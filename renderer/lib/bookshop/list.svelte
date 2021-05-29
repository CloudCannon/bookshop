<script>
    export let components = {};
    export let selectedComponent = "";
    export let selectingComponent = false;

    let list;

    $: if (selectingComponent) list.focus();

    const set = (c) => {
        selectedComponent = c;
        list.blur();
    }

    const blurry = (e) => {
        if (e?.relatedTarget?.dataset?.blur !== "list-child") {
            selectingComponent = false;
        }
    }
</script>

<div class="component-list"
     class:show={selectingComponent}
     on:blur={blurry}
     bind:this={list}
     tabindex="-1">
    <p><span class="icon material-icons main-icon">folder_open</span> Components</p>
    <button class="material-icons">close</button>
    <ul>
    {#each Object.entries(components) as [key, component]}
        <li>
            <button class="component"
                data-blur="list-child" 
                on:mousedown={set(key)}
                on:blur={blurry}>
                <span class="icon material-icons">{component?.identity?.icon}</span>
                {component?.identity?.label}
            </button>
        </li>
    {/each}
    </ul>
</div>

<style>
    .component-list {
        position: absolute;
        z-index: 999999999;
        background-color: #fff;
        border-right: solid 2px #AAA;
        width: 300px;
        min-width: 300px;
        max-height: 100vh;
        overflow-y: scroll;
        opacity: 0;
        pointer-events: none;
        transform: translateX(-100%);
        transition: transform 0.2s ease, opacity 0.2s ease 0.2s;
        padding-bottom: 40px;
    }
    button.material-icons {
        appearance: none;
        -webkit-appearance: none;
        border: none;
        background: transparent;
        position: absolute;
        top: 12px;
        right: 10px;
        cursor: pointer;
        font-size: 14px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    button.material-icons:hover {
        background-color: #eee;
    }
    p {
        font-weight: bold;
        font-size: 14px;
        margin: 0;
        padding: 14px;
        background-color: #fafafa;
    }
    .main-icon {
        display: inline-block;
    }
    .component-list.show {
        opacity: 1;
        pointer-events: all;
        transform: translateX(0);
        transition: transform 0.2s ease, opacity 0s;
    }
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    li {
        margin: 0;
    }
    .component {
        box-sizing: border-box;
        appearance: none;
        -webkit-appearance: none;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 10px;
        width: 100%;
    }
    button:hover {
        background-color: #eee;
    }
    .material-icons.icon {
        font-size: 14px;
        display: inline-block;
        width: 20px;
    }
</style>