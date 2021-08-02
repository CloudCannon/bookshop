<script>
    import {iconSvg} from './icons.js';

    export let components = {};
    export let selectedComponent = "";
    export let selectingComponent = true;
    export let framework = "none";

    let list;

    $: if (selectingComponent && list) list.focus();

    const set = (c) => {
        selectedComponent = c;
        if (!components[c]?.frameworks?.includes(framework)) {
            framework = components[c]?.frameworks?.[0] ?? "none";
        }
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
    <p class="title animate bookshop-icon-string">{@html iconSvg("folder_open")} Components</p>
    <button class="animate close">{@html iconSvg("close")}</button>
    <ul>
    {#each Object.entries(components) as [key, component], i}
        <li class="animate" style="transition-delay: {i/70}s;">
            <button class="component bookshop-icon-string"
                data-blur="list-child" 
                on:mousedown={set(key)}
                on:blur={blurry}>
                {@html iconSvg(component?.identity?.icon)}
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
        transition: opacity 0.2s ease 0.1s;
        padding-bottom: 40px;
    }
    .component-list.show {
        opacity: 1;
        pointer-events: all;
        transition: opacity 0.2s ease;
    }
    .component-list:not(.show) .animate {
        transform: translateX(-10px);
        opacity: 0;
        transition: transform 0.2s ease, opacity 0.2s ease !important;
    }
    .component-list.show .animate {
        transform: translateX(0px);
        opacity: 1;
        transition: transform 0.2s ease, opacity 0.2s ease;
    }
    button.close {
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
    button.close:hover {
        background-color: #eee;
    }
    .title {
        color: inherit;
    }
    p {
        font-weight: bold;
        font-size: 14px;
        margin: 0;
        padding: 14px;
        background-color: #c2b4b4;
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
</style>
