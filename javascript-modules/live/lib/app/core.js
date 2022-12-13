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

let bookshop_version = null;
if (typeof BOOKSHOP_VERSION !== "undefined") {
    bookshop_version = BOOKSHOP_VERSION;
}

/**
 * Try find an existing absolute path to the given identifier,
 * and note down the sum absolute path of the new name if we can
 */
export const storeResolvedPath = (name, identifier, pathStack, logger) => {
    if (typeof identifier !== 'string') return;
    // TODO: The `include.` replacement feels too SSG coupled.
    //                       v v v v v v v v v v v v 
    const splitIdentifier = identifier.replace(/^include\./, '').replace(/\[(\d+)]/g, '.$1').split('.');
    logger?.log?.(`Split ${identifier} info ${JSON.stringify(splitIdentifier)}`);
    const baseIdentifier = splitIdentifier.shift();
    logger?.log?.(`Using base identifier ${baseIdentifier}`);
    if (baseIdentifier) {
        const existingPath = findInStack(baseIdentifier, pathStack);
        logger?.log?.(`Found the existing path ${existingPath}`);
        const prefix = existingPath ?? baseIdentifier;
        logger?.log?.(`Using the prefix ${prefix}`);
        pathStack[pathStack.length - 1][name] = `${[prefix, ...splitIdentifier].join('.')}`;
    } else {
        const existingPath = findInStack(identifier, pathStack);
        logger?.log?.(`Found the existing path ${existingPath}`);
        const path = existingPath ?? identifier;
        logger?.log?.(`Using the path ${path}`);
        pathStack[pathStack.length - 1][name] = path;
    }
    logger?.log?.(`Stored ${name}: ${pathStack[pathStack.length - 1][name]}`);
}

// TODO: This is now partially coupled with Hugo.
// This function should move into each engine.
export const findInStack = (key, stack) => {
    const [baseIdentifier, ...rest] = key?.split?.('.');
    if (baseIdentifier) {
        for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i][baseIdentifier]) {
                if (rest.length) return `${stack[i][baseIdentifier]}.${rest.join('.')}`;
                return `${stack[i][baseIdentifier]}`;
            }
            if (stack[i]["."] && stack[i]["."] !== '.' && !/^(\$|Params)/.test(key)) {
                return `${stack[i]["."]}.${key}`;
            }
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
    if (typeof path === 'string' && /^\s*['"`]/.test(path)) return false;
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
const evaluateTemplate = async (opts) => {
    const {
        liveInstance,
        documentNode,
        parentPathStack,
        templateBlockHandler,
        isRetry,
        logger,
        processDeepComponents = true
    } = opts;
    const stack = [{ scope: {} }];           // The stack of data scopes
    const pathStack = parentPathStack || [{}];     // The paths from the root to any assigned variables
    let stashedNodes = [];    // bookshop_bindings tags that we should keep track of for the next component
    let stashedParams = [];    // Params from the bookshop_bindings tag that we should include in the next component tag
    let meta = {};    // Metadata set in the teplate

    const combinedScope = () => [liveInstance.data, ...stack.map(s => s.scope)];
    const currentScope = () => stack[stack.length - 1];

    const iterator = getTemplateCommentIterator(documentNode);
    let currentNode = iterator.iterateNext();

    while (currentNode) {
        logger?.log?.(`Parsing the comment:`);
        logger?.log?.(currentNode.textContent);
        const liveTag = parseComment(currentNode);

        if (!liveInstance.storedMeta) {
            // Keep track of any metadata that the renderer wants
            for (const [name, identifier] of parseParams(liveTag?.meta)) {
                meta[name] = identifier;
                logger?.log?.(`Registered metadata ${name} as ${identifier}`);

                if (name === "version" && bookshop_version) {
                    const expected_version = await liveInstance.eval(identifier, combinedScope(), logger?.nested?.());
                    if (expected_version !== bookshop_version) {
                        console.error([
                            `Your Bookshop SSG plugin is running version ${expected_version}, but @bookshop/live is running version ${bookshop_version}.`,
                            `Bookshop follows semantic versioning with regard to your site and components,`,
                            `but this does not extend to Bookshop packages being compatible with each other across any version jump.`,
                            `\nRun %cnpx @bookshop/up@latest%c in your root directory to upgrade all Bookshop dependencies.`
                        ].join('\n'),
                            `color: #FF4C29; font-family: monospace; font-weight: bold;`,
                            `color: unset; font-family: unset; font-weight: unset;`
                        );
                    }
                }

                liveInstance.storedMeta = true;
            }

            await liveInstance.storeMeta(meta);
        }

        for (const [name, identifier] of parseParams(liveTag?.context)) {
            const componentDepth = stack.length - 1;
            if (componentDepth == 0 || processDeepComponents === true) {
                logger?.log?.(`Parsing context ${name}: ${identifier}`);
                currentScope().scope[name] = await liveInstance.eval(identifier, combinedScope(), logger?.nested?.());
                const normalizedIdentifier = liveInstance.normalize(identifier, logger?.nested?.());
                if (typeof normalizedIdentifier === 'object' && !Array.isArray(normalizedIdentifier)) {
                    Object.values(normalizedIdentifier).forEach(value => {
                        return storeResolvedPath(name, value, pathStack, logger?.nested?.())
                    });
                } else {
                    storeResolvedPath(name, normalizedIdentifier, pathStack, logger?.nested?.());
                }
            } else {
                logger?.log?.(`Skipping deep context of ${name}: ${identifier}`);
            }
        }

        // Hunt through the stack and try to reassign an existing variable.
        // This is currently only done in Hugo templates
        for (const [name, identifier] of parseParams(liveTag?.reassign)) {
            const componentDepth = stack.length - 1;
            if (componentDepth == 0 || processDeepComponents === true) {
                logger?.log?.(`Reassigning ${name} to ${identifier}`);
                for (let i = stack.length - 1; i >= 0; i -= 1) {
                    if (stack[i].scope[name] !== undefined) {
                        stack[i].scope[name] = await liveInstance.eval(identifier, combinedScope(), logger?.nested?.());
                        break;
                    }
                }
                for (let i = pathStack.length - 1; i >= 0; i -= 1) {
                    if (pathStack[i][name] !== undefined) {
                        const normalizedIdentifier = liveInstance.normalize(identifier, logger?.nested?.());
                        if (typeof normalizedIdentifier === 'object' && !Array.isArray(normalizedIdentifier)) {
                            Object.values(normalizedIdentifier).forEach(value => {
                                return storeResolvedPath(name, value, [pathStack[i]])
                            });
                        } else {
                            storeResolvedPath(name, normalizedIdentifier, [pathStack[i]]);
                        }
                        break;
                    }
                }
            } else {
                logger?.log?.(`Skipping deep reassignment of ${name} to ${identifier}`);
            }
        }

        if (liveTag?.end) {
            logger?.log?.(`Reached the end of a block, handing off to the handler function`);
            currentScope().endNode = currentNode;
            await templateBlockHandler(stack.pop(), logger?.nested?.());
            pathStack.pop();
        } else if (liveTag.stack) {
            logger?.log?.(`Stacking a new context`);
            let scope = {};
            pathStack.push({});
            stack.push({
                pathStack: JSON.parse(JSON.stringify(pathStack)),
                scope,
            });
        } else if (liveTag.unstack) {
            logger?.log?.(`Unstacking a context`);
            stack.pop()
            pathStack.pop();
        } else if (liveTag && liveTag?.name === "__bookshop__subsequent") { // Entering a bookshop_bindings rule
            logger?.log?.(`Stashing parameters for the next bookshop tag`);
            stashedNodes.push(currentNode);
            stashedParams = [...stashedParams, ...parseParams(liveTag?.params)];
        } else if (liveTag?.name) { // Entering a new component
            const componentDepth = stack.length - 1;
            if (componentDepth == 0 || processDeepComponents === true) {
                logger?.log?.(`Rendering a new component ${liveTag.name}`);
                let scope = {};
                const params = [...stashedParams, ...parseParams(liveTag?.params)];
                pathStack.push({});
                for (const [name, identifier] of params) {
                    // Currently 'bind' is used in Jekyll/11ty and '.' is used in Hugo
                    if (name === 'bind') {
                        const bindVals = await liveInstance.eval(identifier, combinedScope(), logger?.nested?.());
                        if (bindVals && typeof bindVals === 'object') {
                            scope = { ...scope, ...bindVals };
                            Object.keys(bindVals).forEach(key => storeResolvedPath(key, `${identifier}.${key}`, pathStack));
                        }
                    } else if (name === ".") {
                        const bindVals = await liveInstance.eval(identifier, combinedScope(), logger?.nested?.());
                        if (bindVals && typeof bindVals === 'object' && !Array.isArray(bindVals)) {
                            scope = { ...scope, ...bindVals };
                        } else {
                            scope[name] = bindVals;
                        }
                        const normalizedIdentifier = liveInstance.normalize(identifier, logger?.nested?.());
                        if (typeof normalizedIdentifier === 'object' && !Array.isArray(normalizedIdentifier)) {
                            Object.entries(normalizedIdentifier).forEach(([key, value]) => {
                                return storeResolvedPath(key, value, pathStack);
                            });
                        } else {
                            storeResolvedPath(name, normalizedIdentifier, pathStack);
                        }
                    } else {
                        scope[name] = await liveInstance.eval(identifier, combinedScope(), logger?.nested?.());
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
                    depth: componentDepth,
                });
            } else {
                logger?.log?.(`Skipping deep render of ${liveTag.name}`);

                pathStack.push({});
                stack.push({
                    startNode: currentNode,
                    name: normalizeName(liveTag?.name),
                    depth: componentDepth,
                });
            }
            stashedParams = [];
            stashedNodes = [];
        }
        try {
            currentNode = iterator.iterateNext();
        } catch (e) {
            logger?.log?.(`Failed to iterate to the next node.`);
            if (!isRetry) {
                // DOM changed under us, start again.
                logger?.log?.(`Trying to start again...`);
                return await evaluateTemplate(opts);
            }
        }
    }
}

/**
 * Takes in a real-DOM tree containing Bookshop live comments
 * Returns an array of all components rendered in virtual-DOM nodes,
 * with the start & end real-DOM nodes to anchor each component on
 */
export const renderComponentUpdates = async (liveInstance, documentNode, logger) => {
    const vDom = document.implementation.createHTMLDocument();
    const updates = [];     // Rendered elements and their DOM locations

    const templateBlockHandler = async ({ startNode, endNode, name, scope, pathStack, depth, stashedNodes }, logger) => {
        // We only need to render the outermost component
        logger?.log?.(`Received a template block to render for ${name}`);
        if (depth) {
            logger?.log?.(`Skipping render for nested component ${name}`);
            return;
        };

        const liveRenderFlag = scope?.live_render
            ?? scope?.liveRender
            ?? scope?._live_render
            ?? scope?._liveRender
            ?? true;
        if (!liveRenderFlag) {
            logger?.log?.(`Skipping render for ${name} due to false liverender flag`);
            return;
        };

        const output = vDom.createElement('div');
        await liveInstance.renderElement(
            name,
            scope,
            output,
            logger?.nested?.(),
        )
        logger?.log?.(`Rendered ${name} block into an update`);
        updates.push({ startNode, endNode, output, pathStack, scope, name, stashedNodes });
    }

    logger?.log?.(`Evaluating templates found in a document`);
    await evaluateTemplate({
        liveInstance,
        documentNode,
        templateBlockHandler,
        isRetry: false,
        logger: logger?.nested?.(),
        processDeepComponents: false
    });

    logger?.log?.(`Completed evaluating the document`);
    return updates;
}

const findDataBinding = (identifier, liveInstance, pathStack, logger) => {
    logger?.log?.(`Finding the data binding for ${identifier}`);
    const normalizedIdentifier = liveInstance.normalize(identifier, logger?.nested?.());
    if (typeof normalizedIdentifier === 'object') {
        for (const innerIdentifier of Object.values(normalizedIdentifier)) {
            logger?.log?.(`'twas an object — finding the data binding for ${innerIdentifier}'`);
            let dataBinding = findDataBinding(innerIdentifier, liveInstance, pathStack, logger?.nested?.());
            if (dataBinding) return dataBinding;
        }
        return null;
    }

    let path = (findInStack(normalizedIdentifier, pathStack) ?? normalizedIdentifier);
    let pathResolves = dig(liveInstance.data, path);
    logger?.log?.(`Found the path ${path}, which ${pathResolves ? `does resolve` : `does not resolve`}`);
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
export const hydrateDataBindings = async (liveInstance, documentNode, pathsInScope, preComment, postComment, stashedNodes, logger) => {
    logger?.log?.(`Hydrating data bindings`);
    const vDom = documentNode.ownerDocument;
    const components = [];     // Rendered components and their path stack

    // documentNode won't contain the bookshopLive comments that triggered its render,
    // which have the context we need for giving it data bindings. So we sneak them in
    documentNode.prepend(preComment);
    for (let node of stashedNodes.reverse()) {
        logger?.log?.(`Adding a stashed node to the top of our document node`);
        documentNode.prepend(node);
    }
    documentNode.append(postComment);
    // v v v This is here for the tests, see jsdom #3269: https://github.com/jsdom/jsdom/issues/3269
    vDom.body.appendChild(documentNode);

    const templateBlockHandler = async (component, logger) => {
        logger?.log?.(`Storing an update for ${component.name}`);
        components.push(component);
    }

    logger?.log?.(`Evaluating template...`);
    await evaluateTemplate({
        liveInstance,
        documentNode,
        pathStack: [{}],
        templateBlockHandler,
        isRetry: false,
        logger: logger?.nested?.()
    });

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
                dataBinding = findDataBinding(identifier, liveInstance, pathStack, logger?.nested?.());
                if (dataBinding) break;
            }
            if (dataBinding) {
                logger?.log?.(`Found the data binding ${dataBinding} for ${name}`);
                // Add the data binding to all top-level elements of the component,
                // since we can't wrap the component in any elements
                let node = startNode.nextElementSibling;
                while (node && (node.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
                    logger?.log?.(`Setting data-cms-bind on an element`);
                    node.dataset.cmsBind = `#${dataBinding}`;
                    node = node.nextElementSibling;
                }
            } else {
                logger?.log?.(`Couldn't find a data binding for ${name}`);
            }
        } else {
            logger?.log?.(`${name} opted out of getting a data binding`);
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
export const graftTrees = (DOMStart, DOMEnd, vDOMObject, logger) => {
    // Collapse each NodeList into an array so that moving elements doesn't truncate a list
    let existingNodes = [], incomingNodes = [...vDOMObject.childNodes];

    let existingNode = DOMStart.nextSibling;
    while (nodeIsBefore(existingNode, DOMEnd)) {
        existingNodes.push(existingNode);
        existingNode = existingNode.nextSibling;
    }

    if (existingNodes.length !== incomingNodes.length) {
        logger?.log?.(`Trees are different lengths, replacing the entire region en-masse`);
        // Root-level children have been added or removed, re-render the whole block
        replaceHTMLRegion(DOMStart, DOMEnd, vDOMObject);
        return;
    }

    logger?.log?.(`Updating the tree...`);
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
