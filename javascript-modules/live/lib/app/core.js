import { ParamsParser } from './parsers/params-parser.js';
import { CommentParser } from './parsers/comment-parser.js';

// TODO: Use the @bookshop/helpers package for name normalization
const normalizeName = name => name.replace(/\/[\w-]+\..+$/, '').replace(/\..+$/, '');
const parseParams = params => params ? (new ParamsParser(params)).build() : [];
const getTemplateCommentIterator = node => {
    const documentNode = node.ownerDocument ?? document;
    return documentNode.evaluate("//comment()[contains(.,'bookshop-live')]", node, null, XPathResult.ANY_TYPE, null);
}
const parseComment = node => {
    return (new CommentParser(node.textContent.replace(/^bookshop-live /, ''))).build()
}
const nodeIsBefore = (a, b) => {
    return a && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
}

/**
 * Try find an existing absolute path to the given identifier,
 * and note down the sum absolute path of the new name if we can
 */
export const storeResolvedPath = (name, identifier, pathStack) => {
    if (typeof identifier !== 'string') return;
    // TODO: The `include.` replacement feels too SSG coupled.
    //                       v v v v v v v v v v v v 
    identifier = identifier.replace(/^include\./, '').replace(/\[(\d+)]/g, '.$1').split('.');
    const baseIdentifier = identifier.shift();
    const existingPath = findInStack(baseIdentifier, pathStack);
    const prefix = existingPath ?? baseIdentifier;
    pathStack[pathStack.length - 1][name] = `${[prefix, ...identifier].join('.')}`;
}

export const findInStack = (key, stack) => {
    const [baseIdentifier, ...rest] = key.split('.');
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i][baseIdentifier]) {
            if (rest.length) return `${stack[i][baseIdentifier]}.${rest.join('.')}`;
            return `${stack[i][baseIdentifier]}`;
        }
    }
    // Try again for keys that legitimately contain a .
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i][key]) {
            return `${stack[i][key]}`;
        }
    }
    return null;
}

const dig = (obj, path) => {
    if (typeof path === 'string') path = path.replace(/\[(\d+)]/g, '.$1').split('.');
    obj = obj[path.shift()];
    if (obj && path.length) return dig(obj, path);
    return obj;
}

/**
 * Replaces all nodes between startNode and endNode (exclusive)
 * with the _inner_ nodes of outputElement
 * Doesn't persist the outputElement itself, only its children
 */
export const replaceHTMLRegion = (startNode, endNode, outputElement) => {
    let node = startNode.nextSibling;
    while (node && (node.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
        const next = node.nextSibling;
        node.remove();
        node = next;
    }
    while (outputElement.childNodes.length) {
        endNode.parentNode.insertBefore(outputElement.childNodes[0], endNode);
    }
}

/**
 * Takes in a DOM tree containing Bookshop live comments
 * Calls a given callback whenever a component end tag is hit
 */
const evaluateTemplate = async (liveInstance, documentNode, parentPathStack, templateBlockHandler = () => { }) => {
    const stack = [{ scope: {} }];           // The stack of data scopes
    const pathStack = parentPathStack || [{}];     // The paths from the root to any assigned variables
    let stashedNodes = [];    // bookshop_bindings tags that we should keep track of for the next component
    let stashedParams = [];    // Params from the bookshop_bindings tag that we should include in the next component tag

    const combinedScope = () => [liveInstance.data, ...stack.map(s => s.scope)];
    const currentScope = () => stack[stack.length - 1];

    const iterator = getTemplateCommentIterator(documentNode);
    let currentNode = iterator.iterateNext();

    while (currentNode) {
        const liveTag = parseComment(currentNode);

        for (const [name, identifier] of parseParams(liveTag?.context)) {
            currentScope().scope[name] = await liveInstance.eval(identifier, combinedScope());
            const normalizedIdentifier = liveInstance.normalize(identifier);
            if (typeof normalizedIdentifier === 'object' && !Array.isArray(normalizedIdentifier)) {
                Object.values(normalizedIdentifier).forEach(value => {
                    return storeResolvedPath(name, value, pathStack)
                });
            } else {
                storeResolvedPath(name, normalizedIdentifier, pathStack);
            }
        }

        if (liveTag?.end) {
            currentScope().endNode = currentNode;
            await templateBlockHandler(stack.pop());
            pathStack.pop();
        } else if (liveTag.stack) {
            let scope = {};
            pathStack.push({});
            stack.push({
                pathStack: JSON.parse(JSON.stringify(pathStack)),
                scope,
            });
        } else if (liveTag.unstack) {
            stack.pop()
            pathStack.pop();
        } else if (liveTag && liveTag?.name === "__bookshop__subsequent") { // Entering a bookshop_bindings rule
            stashedNodes.push(currentNode);
            stashedParams = [...stashedParams, ...parseParams(liveTag?.params)];
        } else if (liveTag?.name) { // Entering a new component
            let scope = {};
            const params = [...stashedParams, ...parseParams(liveTag?.params)];
            pathStack.push({});
            for (const [name, identifier] of params) {
                // Currently 'bind' is used in Jekyll/11ty and '.' is used in Hugo
                if (name === 'bind') {
                    const bindVals = await liveInstance.eval(identifier, combinedScope());
                    if (bindVals && typeof bindVals === 'object') {
                        scope = { ...scope, ...bindVals };
                        Object.keys(bindVals).forEach(key => storeResolvedPath(key, `${identifier}.${key}`, pathStack));
                    }
                } else if (name === ".") {
                    const bindVals = await liveInstance.eval(identifier, combinedScope());
                    if (bindVals && typeof bindVals === 'object' && !Array.isArray(bindVals)) {
                        scope = { ...scope, ...bindVals };
                    } else {
                        scope[name] = bindVals;
                    }
                    const normalizedIdentifier = liveInstance.normalize(identifier);
                    if (typeof normalizedIdentifier === 'object' && !Array.isArray(normalizedIdentifier)) {
                        Object.entries(normalizedIdentifier).forEach(([key, value]) => {
                            return storeResolvedPath(key, value, pathStack)
                        });
                    }
                } else {
                    scope[name] = await liveInstance.eval(identifier, combinedScope());
                    storeResolvedPath(name, identifier, pathStack);
                }
            };

            stack.push({
                startNode: currentNode,
                name: normalizeName(liveTag?.name),
                pathStack: JSON.parse(JSON.stringify(pathStack)),
                scope,
                params,
                stashedNodes,
                depth: stack.length - 1,
            });
            stashedParams = [];
            stashedNodes = [];
        }
        currentNode = iterator.iterateNext();
    }
}

/**
 * Takes in a real-DOM tree containing Bookshop live comments
 * Returns an array of all components rendered in virtual-DOM nodes,
 * with the start & end real-DOM nodes to anchor each component on
 */
export const renderComponentUpdates = async (liveInstance, documentNode) => {
    const vDom = document.implementation.createHTMLDocument();
    const updates = [];     // Rendered elements and their DOM locations

    const templateBlockHandler = async ({ startNode, endNode, name, scope, pathStack, depth, stashedNodes }) => {
        // We only need to render the outermost component
        if (depth) return;

        const output = vDom.createElement('div');
        await liveInstance.renderElement(
            name,
            scope,
            output
        )
        updates.push({ startNode, endNode, output, pathStack, scope, name, stashedNodes });
    }

    await evaluateTemplate(liveInstance, documentNode, null, templateBlockHandler);

    return updates;
}

const findDataBinding = (identifier, liveInstance, pathStack) => {
    const normalizedIdentifier = liveInstance.normalize(identifier);
    if (typeof normalizedIdentifier === 'object' && !Array.isArray(normalizedIdentifier)) {
        for (const innerIdentifier of Object.values(normalizedIdentifier)) {
            let dataBinding = findDataBinding(innerIdentifier, liveInstance, pathStack);
            if (dataBinding) return dataBinding;
        }
        return null;
    }

    let path = (findInStack(normalizedIdentifier, pathStack) ?? normalizedIdentifier);
    let pathResolves = dig(liveInstance.data, path);
    if (pathResolves) {
        // TODO: This special page case feels too SSG-coupled
        let dataBinding = path.replace(/^page(\.|$)/, '');

        // TODO: This special Params case feels too SSG-coupled
        dataBinding = dataBinding.replace(/^Params(\.|$)/, '');
        return dataBinding;
    }
}

/**
 * Takes in a real-or-virtual-DOM tree containing Bookshop live comments
 * Updates all components found within to have data bindings
 * pointing to the front matter path passed to that component (if possible)
 */
export const hydrateDataBindings = async (liveInstance, documentNode, pathsInScope, preComment, postComment, stashedNodes) => {
    const vDom = documentNode.ownerDocument;
    const components = [];     // Rendered components and their path stack

    // documentNode won't contain the bookshopLive comments that triggered its render,
    // which have the context we need for giving it data bindings. So we sneak them in
    documentNode.prepend(preComment);
    for (let node of stashedNodes.reverse()) {
        documentNode.prepend(node);
    }
    documentNode.append(postComment);
    // v v v This is here for the tests, see jsdom #3269: https://github.com/jsdom/jsdom/issues/3269
    vDom.body.appendChild(documentNode);

    const templateBlockHandler = async (component) => {
        components.push(component);
    }

    await evaluateTemplate(liveInstance, documentNode, pathsInScope, templateBlockHandler);

    for (let { startNode, endNode, params, pathStack, scope, name } of components) {
        // By default, don't add bindings for bookshop shared includes
        const isStandardComponent = liveInstance.resolveComponentType(name) === 'component';
        const dataBindingFlag = scope?.editorLink
            ?? scope?.editor_link
            ?? scope?._editorLink
            ?? scope?._editor_link
            ?? scope?.dataBinding
            ?? scope?.data_binding
            ?? scope?._dataBinding
            ?? scope?._data_binding
            ?? isStandardComponent;
        if (dataBindingFlag) { // If we should be adding a data binding _for this component_
            let dataBinding = null;
            for (const [, identifier] of params) {
                dataBinding = findDataBinding(identifier, liveInstance, pathStack);
                if (dataBinding) break;
            }
            if (dataBinding) {
                // Add the data binding to all top-level elements of the component,
                // since we can't wrap the component in any elements
                let node = startNode.nextElementSibling;
                while (node && (node.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
                    node.dataset.cmsBind = `cloudcannon:#${dataBinding}`;
                    node = node.nextElementSibling;
                }
            }
        }
    }

    preComment.remove();
    postComment.remove();
    for (let node of stashedNodes) {
        node.remove();
    }
    // v v v This is here for the tests, see jsdom #3269: https://github.com/jsdom/jsdom/issues/3269
    documentNode.remove();
}

/**
 * Update the block of HTML between DOMStart and DOMEnd to match the contents of vDOMObject
 * This will walk the tree and make only the most fine-grained changes possible.
 * - Any changes to attributes like classnames will re-render the entire DOM node & children
 * - Adding or removing elements will re-render from the parent DOM node
 * - Most other changes should only update a text node
 */
export const graftTrees = (DOMStart, DOMEnd, vDOMObject) => {
    // Collapse each NodeList into an array so that moving elements doesn't truncate a list
    let existingNodes = [], incomingNodes = [...vDOMObject.childNodes];

    let existingNode = DOMStart.nextSibling;
    while (nodeIsBefore(existingNode, DOMEnd)) {
        existingNodes.push(existingNode);
        existingNode = existingNode.nextSibling;
    }

    if (existingNodes.length !== incomingNodes.length) {
        // Root-level children have been added or removed, re-render the whole block
        replaceHTMLRegion(DOMStart, DOMEnd, vDOMObject);
        return;
    }

    for (let i = 0; i < existingNodes.length; i++) {
        diffAndUpdateNode(existingNodes[i], incomingNodes[i]);
    }
}

const diffAndUpdateNode = (existingNode, incomingNode) => {
    if (existingNode.isEqualNode(incomingNode)) {
        // Node and full subtree is identical
        return;
    }

    if (!existingNode.cloneNode(false).isEqualNode(incomingNode.cloneNode(false))) {
        // Node sans-children has changes, update this whole node (and thus children)
        existingNode.replaceWith(incomingNode);
        return;
    }

    if (existingNode.childNodes.length !== incomingNode.childNodes.length) {
        // Node children have been added or removed, update this whole node
        existingNode.replaceWith(incomingNode);
        return;
    }
    // Existing node is fine, we can reach parity by updating one/some of the child nodes.


    // Collapse each NodeList into an array so that moving an element
    // in incomingChildren doesn't remove it from the list (and change our indexing)
    const existingChildren = [...existingNode.childNodes];
    const incomingChildren = [...incomingNode.childNodes];
    for (let i = 0; i < existingChildren.length; i++) {
        diffAndUpdateNode(existingChildren[i], incomingChildren[i]);
    }
}
