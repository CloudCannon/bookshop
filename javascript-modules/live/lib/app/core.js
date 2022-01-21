//    <!--bookshop-live name(...) params(...)-->
// or <!--bookshop-live name(...) params(...) context(...)-->
// or <!--bookshop-live end-->
const liveMatchRegex = /bookshop-live ((?<end>end)|name\((?<name>[^)]*)\) params\((?<params>[^)]*)\)).*/;
//    <!--bookshop-live context(...)-->
const contextMatchRegex = /bookshop-live.*context\((?<context>.+)\)\s*$/;

// TODO: Use the @bookshop/helpers package for name normalization
const normalizeName = name => name.replace(/\/[\w-]+\..+$/, '').replace(/\..+$/, '');
const parseParams = params => params ? params.replace(/: /g, '=').split(' ').map(p => p.split('=')) : [];
const getTemplateCommentIterator = node => {
    const documentNode = node.ownerDocument ?? document;
    return documentNode.evaluate("//comment()[contains(.,'bookshop-live')]", node, null, XPathResult.ANY_TYPE, null);
}
const parseComment = node => {
    return {
        matches: node.textContent.match(liveMatchRegex),
        contextMatches: node.textContent.match(contextMatchRegex),
    }
}
const nodeIsBefore = (a, b) => {
    return a && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
}

/**
 * Try find an existing absolute path to the given identifier,
 * and note down the sum absolute path of the new name if we can
 */
export const storeResolvedPath = (name, identifier, pathStack) => {
    // TODO: This shouldn't be required post-tokenizer 
    if (!name || !identifier) return;
    // TODO: The `include.` replacement feels too SSG coupled.
    //                       v v v v v v v v v v v v 
    identifier = identifier.replace(/^include\./, '').replace(/\[(\d+)]/g, '.$1').split('.');
    const baseIdentifier = identifier.shift();
    const existingPath = findInStack(baseIdentifier, pathStack);
    const prefix = existingPath ?? baseIdentifier;
    pathStack[pathStack.length - 1][name] = `${[prefix, ...identifier].join('.')}`;
}

export const findInStack = (key, stack) => {
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i][key]) return stack[i][key]
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
 * Returns a string digest of the HTML between two nodes
 */
export const buildDigest = (startNode, endNode) => {
    let node = startNode.nextSibling;
    let digest = ''
    while (nodeIsBefore(node, endNode)) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                digest += node.outerHTML;
                break;
            case Node.COMMENT_NODE:
                digest += `<!--${node.textContent}-->`;
                break;
            default:
                digest += node.textContent || '';
        }
        node = node.nextSibling;
    }
    return digest;
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
    const stack = [];           // The stack of component data scopes
    const pathStack = parentPathStack || [{}];     // The paths from the root to any assigned variables
    const bindings = {};        // Anything assigned through assigns or loops
    let stashedNodes = [];    // bookshop_bindings tags that we should keep track of for the next component
    let stashedParams = [];    // Params from the bookshop_bindings tag that we should include in the next component tag

    const combinedScope = () => [liveInstance.data, ...stack.map(s => s.scope), bindings];
    const currentScope = () => stack[stack.length - 1];

    const iterator = getTemplateCommentIterator(documentNode);
    let currentNode = iterator.iterateNext();

    while (currentNode) {
        const { matches, contextMatches } = parseComment(currentNode);

        for (const [name, identifier] of parseParams(contextMatches?.groups["context"])) {
            // TODO: This shouldn't be required post-tokenizer 
            if (!identifier) return;
            // TODO: bindings here has no encapsulation / stack, which feels too SSG-coupled for assigns
            // TODO: bindings here has no encapsulation / stack, which is wrong for loops
            bindings[name] = await liveInstance.eval(identifier, combinedScope());
            storeResolvedPath(name, identifier, pathStack);
        }

        if (matches?.groups["end"]) {
            currentScope().endNode = currentNode;
            await templateBlockHandler(stack.pop());
            pathStack.pop();
        } else if (matches && matches.groups["name"] === "__bookshop__subsequent") { // Entering a bookshop_bindings rule
            stashedNodes.push(currentNode);
            stashedParams = [...stashedParams, ...parseParams(matches.groups["params"])];
        } else if (matches) { // Entering a new component
            let scope = {};
            const params = [...stashedParams, ...parseParams(matches.groups["params"])];
            pathStack.push({});
            for (const [name, identifier] of params) {
                // TODO: This shouldn't be required post-tokenizer 
                if (!identifier) return;
                // Currently 'bind' is used in Jekyll/11ty and '.' is used in Hugo
                if (name === 'bind' || name === '.') {
                    const bindVals = await liveInstance.eval(identifier, combinedScope());
                    if (bindVals && typeof bindVals === 'object') {
                        scope = { ...scope, ...bindVals };
                        Object.keys(bindVals).forEach(key => storeResolvedPath(key, `${identifier}.${key}`, pathStack));
                    }
                } else {
                    scope[name] = await liveInstance.eval(identifier, combinedScope());
                    storeResolvedPath(name, identifier, pathStack);
                }
            };

            stack.push({
                startNode: currentNode,
                name: normalizeName(matches.groups["name"]),
                bindings: JSON.parse(JSON.stringify(bindings)),
                pathStack: JSON.parse(JSON.stringify(pathStack)),
                scope,
                params,
                stashedNodes,
                depth: stack.length,
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

    const templateBlockHandler = async ({ startNode, endNode, name, scope, bindings, pathStack, depth, stashedNodes }) => {
        // We only need to render the outermost component
        if (depth) return;

        const output = vDom.createElement('div');
        await liveInstance.renderElement(
            name,
            scope,
            bindings,
            output
        )
        updates.push({ startNode, endNode, output, pathStack, scope, name, stashedNodes });
    }

    await evaluateTemplate(liveInstance, documentNode, null, templateBlockHandler);

    return updates;
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

    // pathsInScope are from an earlier render pass, so will contain any paths
    // at a higher level than the documentNode we're working on. Without this,
    // if documentNode is a subcomponent we wouldn't be able to know
    // its path back to the root data.
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
                let path = (findInStack(identifier, pathStack) ?? identifier);

                // TODO: This special Params case feels too SSG-coupled
                path = path.replace(/^\.Params/, 'Params');

                let pathResolves = dig(liveInstance.data, path);
                if (pathResolves) {
                    // TODO: This special page case feels too SSG-coupled
                    dataBinding = path.replace(/^page(\.|$)/, '');

                    // TODO: This special Params case feels too SSG-coupled
                    dataBinding = dataBinding.replace(/^Params(\.|$)/, '');
                    break;
                }
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
