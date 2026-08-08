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
        processDeepComponents = true,
        // Optional Map(startNode -> identity). When provided, a "block" (a
        // component directly inside a range/with) whose inputs are unchanged
        // since last walk has its entire subtree skipped — not evaluated, not
        // handed to templateBlockHandler. This is what makes editing one block
        // of a large page cheap: the other blocks aren't walked at all.
        blockMemo,
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
                isRange: true, // a range/with iteration; its child components are "blocks"
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
            // A "block" is a component that sits directly inside a range/with
            // iteration (its enclosing frame is a range). These are the
            // independently-renderable content blocks of a page.
            const isBlock = !!stack[stack.length - 1]?.isRange;

            // Skip an unchanged block's whole subtree without evaluating it.
            // The block's inputs are its enclosing (loop) scope, which the
            // preceding context comment has already resolved cheaply, plus its
            // own params and the engine's data/globals generation. We only READ
            // the memo here to decide skipping; the caller writes it once the
            // block has actually been processed, so a superseded or failed pass
            // never leaves a block wrongly marked up-to-date.
            let blockIdentity = null;
            if (blockMemo && isBlock) {
                blockIdentity = JSON.stringify({
                    n: normalizeName(liveTag.name),
                    p: liveTag.params || '',
                    s: stack[stack.length - 1]?.scope,
                    g: liveInstance.engines?.[0]?.dataGeneration ?? 0,
                    v: liveInstance.globalDataVersion ?? 0,
                });
                if (blockMemo.get(currentNode) === blockIdentity) {
                    logger?.log?.(`Skipping unchanged block ${liveTag.name}`);
                    // Advance past this component's matching end, tracking
                    // nested components (stack/unstack and standalone bindings
                    // tags don't open a component, so don't affect the depth).
                    let depth = 1;
                    while (depth > 0) {
                        let next;
                        try { next = iterator.iterateNext(); } catch { next = null; }
                        if (!next) break;
                        currentNode = next;
                        const t = parseComment(currentNode);
                        if (t?.name && t.name !== '__bookshop__subsequent') depth++;
                        else if (t?.end) depth--;
                    }
                    stashedParams = [];
                    stashedNodes = [];
                    try { currentNode = iterator.iterateNext(); } catch { currentNode = null; }
                    continue;
                }
            }

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
                    isBlock,
                    blockIdentity,
                });
            } else {
                logger?.log?.(`Skipping deep render of ${liveTag.name}`);

                pathStack.push({});
                stack.push({
                    startNode: currentNode,
                    name: normalizeName(liveTag?.name),
                    depth: componentDepth,
                    isBlock,
                    blockIdentity,
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
// Opt-in (window.bookshopIncrementalBlocks): render only the content blocks
// whose inputs changed rather than re-rendering the whole top-level wrapper.
// A "block" is a component that sits directly inside a range/with iteration
// (e.g. each entry of a page that ranges over `content_blocks`). Editing one
// block then rebuilds only that block instead of the entire page. Pages with no
// range-child blocks fall back to whole-component rendering, so non-range
// layouts behave exactly as the default path.
const renderComponentUpdatesIncremental = async (liveInstance, documentNode, logger) => {
    const vDom = document.implementation.createHTMLDocument();
    const updates = [];
    const pendingComponents = [];
    const all = [];

    // Skip walking/evaluating blocks whose inputs are unchanged. Disabled by
    // window.bookshopLiveNoMemo (then every block is re-walked and re-rendered).
    const useMemo = !(typeof window !== 'undefined' && window.bookshopLiveNoMemo);
    liveInstance.renderBlockMemo ??= new WeakMap();

    await evaluateTemplate({
        liveInstance,
        documentNode,
        templateBlockHandler: async (frame) => { all.push(frame); },
        isRetry: false,
        logger: logger?.nested?.(),
        processDeepComponents: true,
        blockMemo: useMemo ? liveInstance.renderBlockMemo : undefined,
    });

    // `all` holds only the components that were actually walked — unchanged
    // blocks were skipped wholesale. Render units = outermost walked blocks, or
    // (a page with no range-child blocks) the walked top-level components.
    const blocks = all.filter(c => c.isBlock && c.startNode && c.endNode);
    const usesBlocks = blocks.length > 0;
    const units = usesBlocks
        ? blocks.filter(b => !blocks.some(o => o !== b
            && nodeIsBefore(o.startNode, b.startNode) && nodeIsBefore(b.endNode, o.endNode)))
        : all.filter(c => c.depth === 0 && c.startNode && c.endNode);

    if (typeof window !== 'undefined') {
        window.__incrementalStats = { total: all.length, blocks: blocks.length, units: units.length, rendered: 0 };
    }

    // Blocks are already filtered by the subtree-skip above (only changed ones
    // were walked). Top-level fallback units aren't blocks, so memo-skip
    // unchanged ones per-unit here — the same skip the non-incremental path does.
    const engineGeneration = liveInstance.engines[0]?.dataGeneration;
    const perUnitMemo = !usesBlocks && useMemo && engineGeneration !== undefined && !!liveInstance.renderMemo;

    for (const c of units) {
        const liveRenderFlag = c.scope?.live_render ?? c.scope?.liveRender
            ?? c.scope?._live_render ?? c.scope?._liveRender ?? true;
        if (!liveRenderFlag) {
            logger?.log?.(`Skipping render for ${c.name} due to false liverender flag`);
            continue; // never memoized (we only memoize after a real render)
        }
        let memoKey = null;
        if (perUnitMemo) {
            memoKey = JSON.stringify({
                name: c.name, scope: c.scope, pathStack: c.pathStack,
                engineGeneration, globalDataVersion: liveInstance.globalDataVersion ?? 0,
            });
            if (liveInstance.renderMemo.get(c.startNode) === memoKey) {
                logger?.log?.(`Skipping ${c.name} — inputs unchanged since last render`);
                continue;
            }
        }
        pendingComponents.push({
            name: c.name, scope: c.scope, dom: vDom.createElement('div'),
            startNode: c.startNode, endNode: c.endNode,
            pathStack: c.pathStack, stashedNodes: c.stashedNodes,
            blockIdentity: c.blockIdentity, memoKey,
        });
    }

    if (typeof window !== 'undefined' && window.__incrementalStats) {
        window.__incrementalStats.rendered = pendingComponents.length;
    }

    if (pendingComponents.length > 0) {
        logger?.log?.(`Incrementally rendering ${pendingComponents.length} block(s)`);
        await liveInstance.renderElements(pendingComponents, logger?.nested?.());
        for (const c of pendingComponents) {
            // Memoize only once a component has actually rendered, so a failed
            // render re-runs next time rather than being skipped as up-to-date.
            // We own the memo write here (blocks -> renderBlockMemo via subtree
            // identity, fallback units -> renderMemo) and pass memoKey: null to
            // the update so live.js doesn't also memoize on output-present alone.
            if (useMemo && c.renderedOk !== false) {
                if (c.blockIdentity) liveInstance.renderBlockMemo.set(c.startNode, c.blockIdentity);
                else if (c.memoKey) liveInstance.renderMemo.set(c.startNode, c.memoKey);
            }
            updates.push({
                startNode: c.startNode, endNode: c.endNode, output: c.dom,
                pathStack: c.pathStack, scope: c.scope, name: c.name,
                stashedNodes: c.stashedNodes, memoKey: null,
            });
        }
    }
    return updates;
};

export const renderComponentUpdates = async (liveInstance, documentNode, logger) => {
    // Incremental block rendering is on by default; opt out with
    // window.bookshopIncrementalBlocks = false.
    if (typeof window === 'undefined' || window.bookshopIncrementalBlocks !== false) {
        return renderComponentUpdatesIncremental(liveInstance, documentNode, logger);
    }

    const vDom = document.implementation.createHTMLDocument();
    const updates = [];     // Rendered elements and their DOM locations
    const pendingComponents = []; // Components to batch render

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

        // Skip components whose render inputs haven't changed since the last
        // update — during editing, usually everything but the edited component.
        // Only enabled for engines that track a dataGeneration, since a render
        // can also depend on site data/config changing underneath the scope.
        let memoKey = null;
        const engineGeneration = liveInstance.engines[0].dataGeneration;
        const memoizationEnabled = engineGeneration !== undefined
            && liveInstance.renderMemo
            && !(typeof window !== 'undefined' && window.bookshopLiveNoMemo);
        if (memoizationEnabled) {
            memoKey = JSON.stringify({
                name,
                scope,
                pathStack,
                engineGeneration,
                globalDataVersion: liveInstance.globalDataVersion ?? 0,
            });
            if (liveInstance.renderMemo.get(startNode) === memoKey) {
                logger?.log?.(`Skipping render for ${name} — inputs unchanged since last render`);
                return;
            }
        }

        const output = vDom.createElement('div');

        // Collect components for batch rendering instead of rendering immediately
        pendingComponents.push({
            name,
            scope,
            dom: output,
            startNode,
            endNode,
            pathStack,
            stashedNodes,
            memoKey
        });
        logger?.log?.(`Queued ${name} for batch rendering`);
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

    // Batch render all collected components.
    // renderElements reads each component's name/scope/dom, and marks the
    // outcome back onto each object as renderedOk.
    if (pendingComponents.length > 0) {
        logger?.log?.(`Batch rendering ${pendingComponents.length} components`);
        await liveInstance.renderElements(pendingComponents, logger?.nested?.());

        // Build updates array from rendered components
        for (const c of pendingComponents) {
            logger?.log?.(`Rendered ${c.name} block into an update`);
            updates.push({
                startNode: c.startNode,
                endNode: c.endNode,
                output: c.dom,
                pathStack: c.pathStack,
                scope: c.scope,
                name: c.name,
                stashedNodes: c.stashedNodes,
                memoKey: c.memoKey,
                renderedOk: c.renderedOk
            });
        }
    }

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
 * Applies a data binding to a single rendered component,
 * pointing at the front matter path passed to that component (if possible)
 */
const applyComponentBindings = (liveInstance, component, boundThisPass, logger) => {
    const { startNode, endNode, params, pathStack, scope, name } = component;
    // Tracks the elements this instance has bound, so that stale bindings can
    // be removed without ever touching template-authored data-cms-bind attributes.
    liveInstance.boundElements ??= new WeakSet();
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

    let dataBinding = null;
    if (dataBindingFlag) { // If we should be adding a data binding _for this component_
        for (const [, identifier] of params) {
            dataBinding = findDataBinding(identifier, liveInstance, pathStack, logger?.nested?.());
            if (dataBinding) break;
        }
        logger?.log?.(dataBinding
            ? `Found the data binding ${dataBinding} for ${name}`
            : `Couldn't find a data binding for ${name}`);
    } else {
        logger?.log?.(`${name} opted out of getting a data binding`);
    }

    // Add the data binding to all top-level elements of the component,
    // since we can't wrap the component in any elements.
    // If this component shouldn't be bound, remove any binding
    // that a previous pass applied.
    let node = startNode.nextElementSibling;
    while (node && (node.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
        if (dataBinding) {
            logger?.log?.(`Setting data-cms-bind on an element`);
            node.dataset.cmsBind = `#${dataBinding}`;
            liveInstance.boundElements.add(node);
            boundThisPass?.add(node);
        } else if (liveInstance.boundElements.has(node) && !boundThisPass?.has(node)) {
            // Component regions can overlap — an unbound wrapper's top-level
            // elements can be another component's just-bound elements, so only
            // remove bindings that no component applied during this pass.
            logger?.log?.(`Removing a stale data-cms-bind from an element`);
            node.removeAttribute('data-cms-bind');
            liveInstance.boundElements.delete(node);
        }
        node = node.nextElementSibling;
    }
}

const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Walks the live document post-graft and applies data bindings to every
 * component found. Yields to the main thread between components so a long
 * pass doesn't lock the UI, and bails when a newer render supersedes it.
 * Returns true if the pass ran to completion.
 */
export const hydrateDocumentBindings = async (liveInstance, documentNode, logger, isSuperseded = () => false) => {
    logger?.log?.(`Hydrating the document's data bindings`);
    const components = [];

    const templateBlockHandler = async (component, logger) => {
        logger?.log?.(`Storing a binding candidate for ${component.name}`);
        components.push(component);
    }

    // Skip re-binding unchanged blocks: their DOM (and existing data-cms-bind
    // attributes) is untouched between edits. Uses a memo separate from the
    // render pass so a block that just re-rendered is still re-bound this pass.
    // Only engaged for the incremental path; the default path passes no memo.
    let blockMemo;
    if (typeof window !== 'undefined' && window.bookshopIncrementalBlocks !== false
        && !window.bookshopLiveNoMemo) {
        liveInstance.hydrateBlockMemo ??= new WeakMap();
        blockMemo = liveInstance.hydrateBlockMemo;
    }

    await evaluateTemplate({
        liveInstance,
        documentNode,
        templateBlockHandler,
        isRetry: false,
        logger: logger?.nested?.(),
        blockMemo,
    });

    const boundThisPass = new Set();
    for (const component of components) {
        if (isSuperseded()) {
            logger?.log?.(`A newer render superseded this hydration pass — bailing`);
            // A newer pass will re-walk everything; some blocks weren't bound
            // this pass, so drop the memo rather than leave them marked done.
            if (blockMemo) liveInstance.hydrateBlockMemo = new WeakMap();
            return false;
        }
        applyComponentBindings(liveInstance, component, boundThisPass, logger?.nested?.());
        if (blockMemo && component.blockIdentity) {
            blockMemo.set(component.startNode, component.blockIdentity);
        }
        await yieldToMain();
    }
    logger?.log?.(`Hydrated the document's data bindings`);
    return true;
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

    const boundThisPass = new Set();
    for (const component of components) {
        applyComponentBindings(liveInstance, component, boundThisPass, logger?.nested?.());
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

// Data bindings are hydrated onto the live DOM after grafting, so freshly
// rendered nodes won't have them yet. They shouldn't force a node replacement —
// a replaced node gets its binding back on the post-graft hydration pass.
const nodesShallowEqualIgnoringBindings = (a, b) => {
    const aClone = a.cloneNode(false);
    const bClone = b.cloneNode(false);
    if (typeof aClone.removeAttribute === 'function') {
        aClone.removeAttribute('data-cms-bind');
    }
    if (typeof bClone.removeAttribute === 'function') {
        bClone.removeAttribute('data-cms-bind');
    }
    return aClone.isEqualNode(bClone);
}

const diffAndUpdateNode = (existingNode, incomingNode) => {
    if (existingNode.isEqualNode(incomingNode)) {
        // Node and full subtree is identical
        return;
    }

    if (!nodesShallowEqualIgnoringBindings(existingNode, incomingNode)) {
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

    // We're keeping the existing node, so sync across any template-authored binding
    // that the fresh render produced. (An incoming node _without_ a binding says
    // nothing — bindings that Bookshop hydrates onto the live DOM won't be present
    // on freshly rendered nodes, and are managed by the hydration pass instead.)
    if (typeof incomingNode.getAttribute === 'function') {
        const incomingBind = incomingNode.getAttribute('data-cms-bind');
        if (incomingBind !== null && existingNode.getAttribute('data-cms-bind') !== incomingBind) {
            existingNode.setAttribute('data-cms-bind', incomingBind);
        }
    }


    // Collapse each NodeList into an array so that moving an element
    // in incomingChildren doesn't remove it from the list (and change our indexing)
    const existingChildren = [...existingNode.childNodes];
    const incomingChildren = [...incomingNode.childNodes];
    for (let i = 0; i < existingChildren.length; i++) {
        diffAndUpdateNode(existingChildren[i], incomingChildren[i]);
    }
}
