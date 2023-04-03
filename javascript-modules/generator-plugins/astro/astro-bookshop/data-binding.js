(() => {
	let firstRender = true;
	const update_bindings = () => {
		const getBindingCommentIterator = () => {
			const documentNode = document;
			return documentNode.evaluate(
				"//comment()[contains(.,'databinding:')]",
				documentNode,
				null,
				XPathResult.ANY_TYPE,
				null
			);
		};

		const getEndingBindingCommentIterator = (binding) => {
			const documentNode = document;
			return documentNode.evaluate(
				`//comment()[contains(.,'databindingend:\${binding}')]`,
				documentNode,
				null,
				XPathResult.ANY_TYPE,
				null
			);
		};

		const iter = getBindingCommentIterator();
		const nodes = [];
		let current = iter.iterateNext();

		while(current){
			nodes.push(current);
			current = iter.iterateNext();
		}

		for(current of nodes){
			const data_binding_path = current.textContent.split(':')[1].trim()
			if(data_binding_path.length > 0){
				const endIter = getEndingBindingCommentIterator(data_binding_path)
				let end = endIter.iterateNext();
				while(end){
					const binding = end.textContent.split(':')[1].trim()
					if((end.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING) === 0 && binding === data_binding_path){
						break;
					}
					end = endIter.iterateNext();
				}

				if (end){
					let node = current.nextElementSibling;
					while (
							node &&
							(node.compareDocumentPosition(end) &
									Node.DOCUMENT_POSITION_FOLLOWING) !==
									0
					) {
							node.dataset.cmsBind = data_binding_path;
							node = node.nextElementSibling;
					}
				}
			}
		}
		if(firstRender){
			window?.CloudCannon?.refreshInterface?.();
		}
	}
	window.addEventListener("DOMContentLoaded", update_bindings)
	document.addEventListener("cloudcannon:update", () => setTimeout(update_bindings, 100))
})()