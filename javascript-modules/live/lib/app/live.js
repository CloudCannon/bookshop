export const getLive = (engines) => class BookshopLive {
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

    async update(data) {
        this.data = data;
        await this.render();
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
            const contextMatches = currentNode.textContent.match(/bookshop-live.*context\((?<context>.+)\)\s*$/);

            if(contextMatches?.groups["context"]){
                const assignments = contextMatches.groups["context"].replace(/: /g, '=').split(' ');
                for (const binding of assignments) {
                    const [name, identifier] = binding.split('=');
                    const scopes = [this.data, ...stack.map(s => s.scope), bindings];
                    bindings[name] = await this.engines[0].eval(identifier, scopes);
                }
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
                const params = matches.groups["params"].replace(/: /g, '=').split(' ');
                for (const param of params) {
                    const [name, identifier] = param.split('=');
                    const scopes = [this.data, ...stack.map(s => s.scope), bindings];
                    if(name === 'bind'){
                        const bindVals = await this.engines[0].eval(identifier, scopes);
                        scope = {...scope, ...bindVals};
                    } else {
                        scope[name] = await this.engines[0].eval(identifier, scopes);
                    }
                };

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
}
