<script>
    import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
    import {keymap} from "@codemirror/view"
    import {StreamLanguage} from "@codemirror/stream-parser"
    import {yaml} from "@codemirror/legacy-modes/mode/yaml"
    import {onMount, createEventDispatcher} from "svelte"
    import {tabBinding} from "./helpers"

    export let code = "";
    export let error = false;

    const dispatch = createEventDispatcher();

    let editor, view, prevCode;

    $: if (view) initState(code);

    const initState = (str) => {
        if (str !== prevCode) {
            view.setState(EditorState.create({
                doc: code, 
                extensions: [
                    basicSetup,
                    keymap.of([tabBinding]),
                    StreamLanguage.define(yaml)
                ],
            }));
            prevCode = str;
        }
    }

    const updateCode = (tx) => {
        view.update([tx]);
        if (tx.docChanged) {
            dispatch('newcode', {
                code: view.state.doc.toString()
            })
        }
    }

    onMount(() => {
        view = new EditorView({
            parent: editor,
            dispatch: updateCode
        });
        initState(code);
    })
</script>

<div class="editor" class:error={error} bind:this={editor}>

</div>

<style>
    .error {
        outline: solid 2px red;
    }
    .editor {
        flex: 1;
        min-height: 300px;
        max-height: 300px;
        overflow: scroll;
    }
</style>