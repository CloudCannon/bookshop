import engines from `__bookshop_engines__`;
window.BookshopLive = class BookshopLive {
    constructor(options) {
        this.engines = engines;
        this.elements = [];
        this.globalData = {};
        options?.remoteGlobals?.forEach(this.fetchGlobalData.bind(this));
    }

    async fetchGlobalData(path) {
        const dataReq = await fetch(path);
        const data = await dataReq.json();
        Object.assign(this.globalData, data);
    }

    readElement(el) {
        return {
            dom: el,
            originalHTML: el.innerHTML,
            componentName: el.dataset.bookshopLive,
            componentPropSource: el.dataset.bookshopProps,
        }
    }

    async renderElement(componentName, scope, bindings, dom) {
        try {
            await this.engines[0].render(dom, componentName, scope, {...this.globalData, ...bindings});
        } catch(e) {
            console.warn(`Error rendering bookshop component ${componentName}`, e);
            console.warn(`This is expected in certain cases, and may not be an issue, especially when deleting or re-ordering components.`)
        }
    }

    update(data) {
        this.data = data;
        this.render();
    }

    async render() {
        const vDom = document.implementation.createHTMLDocument();
        const iterator = document.evaluate("//comment()[contains(.,'bookshop-live')]", document, null, XPathResult.ANY_TYPE, null);
        const stack = [];
        const updates = [];
        let bindings = {}
        let currentNode = iterator.iterateNext();
        while(currentNode){
            const matches = currentNode.textContent.match(/bookshop-live ((?<end>end)|name\((?<name>[^)]*)\) params\((?<params>[^)]*)\)).*/);
            const contextMatches = currentNode.textContent.match(/bookshop-live.*context\((?<context>[^)]*)\)/);
            if(contextMatches?.groups["context"]){
                const prevScope = {...(stack[stack.length-1]?.scope ?? this.data), ...bindings};
                contextMatches.groups["context"].replace(/: /g, '=').split(' ').forEach((binding) => {
                    const [name, identifier] = binding.split('=');
                    bindings[name] = this.dig(identifier, prevScope);
                })
            }
            
            if(matches?.groups["end"]){
                const {startNode, name, scope, bindings} = stack.pop();
                const output = vDom.createElement('div');
                await this.renderElement(
                    name,
                    scope,
                    bindings,
                    output
                )
                updates.push({startNode, endNode: currentNode, output});
            } else if(matches){
                let scope = {};
                const prevScope = {...(stack[stack.length-1]?.scope ?? this.data), ...bindings};
                matches.groups["params"].replace(/: /g, '=').split(' ').forEach((param) => {
                    const [name, identifier] = param.split('=');
                    if(name === 'bind'){
                        scope = {...scope, ...this.dig(identifier, prevScope)};
                    } else {
                        scope[name] = this.dig(identifier, prevScope);
                    }
                });

                stack.push({
                    startNode: currentNode,
                    name: matches.groups["name"].replace(/\/[\w-]+\..+$/, '').replace(/\..+$/, ''),
                    bindings: JSON.parse(JSON.stringify(bindings)),
                    scope
                });
            }
            currentNode = iterator.iterateNext();
        }

        updates.forEach(({startNode, endNode, output}) => {
            let node = startNode.nextSibling;
            let digest = ''
            while(node && (node.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0){
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

            if(digest === output.innerHTML){
                return;
            }

            node = startNode.nextSibling
            while(node && (node.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0){
                const next = node.nextSibling;
                node.remove();
                node = next;
            }
            output = endNode.parentNode.insertBefore(output, endNode);
            output.outerHTML = output.innerHTML;
        })
    }


    dig(keys, scope) {
        if (!keys) return null;
        if (typeof keys === "string" && /^('|").*('|")$/.test(keys)) return keys.substr(1, keys.length-2)
        if (!Array.isArray(keys)) keys = keys.split('.');
        const key = keys.shift();
        const indexMatches = key.match(/(?<key>.*)\[(?<index>\d*)\]$/);
        scope = {...this.globalData, ...(scope ?? this.data)};
        if (indexMatches) {
            scope = (scope ?? this.data)[indexMatches.groups["key"]];
            scope = (scope ?? this.data)[parseInt(indexMatches.groups["index"])];
        } else {
            scope = (scope ?? this.data)[key];
        }
        if(scope && keys.length) {
            return this.dig(keys, scope);
        }
        return scope;
    }
}
