<script>
    import {iconSvg} from './icons.js';

    export let selectingComponent = false;
    export let component = {};
    export let framework = "none";
    export let editProps = true;
</script>

<div class="component-info" class:thin={!editProps} class:tutorial={!component?.identity}>
    <div class="nav-pane">
        <button 
            class="menu"
            on:click={() => selectingComponent = true}>{@html iconSvg("folder_open")}</button>
        <button 
            class="menu" 
            on:click={() => editProps = !editProps}>{@html editProps ? iconSvg('vertical_align_top') : iconSvg('vertical_align_bottom')}</button>
    </div>
    <div class="content-pane">
        {#if !component?.identity}
            <div class="component-title">
                <span class="bookshop-icon-string">{@html iconSvg("menu_book")} Bookshop Browser</span>
            </div>
            <div class="component-data">
                <p class="tutorial">
                    Select a component using the
                    <button 
                        class="menu inline-menu"
                        on:click={() => selectingComponent = true}>{@html iconSvg("folder_open")}</button>
                    button
                </p>
            </div>
        {:else}
            <div class="component-title">
                <span class="bookshop-icon-string">{@html iconSvg(component?.identity?.icon)} {component?.identity?.label}</span>
            </div>

            {#if editProps && component?.props}
            <div class="component-data">
                <p class="description">{component?.identity?.description || ""}</p>

                <p class="title">Frameworks</p>
                <p class="label buttons">
                {#each component?.frameworks as f}
                    <button 
                        class:selected={framework === f}
                        on:click={() => {framework = f}}>{f}</button>
                {/each}
                </p>

                {#if component?.identity?.structures}
                <p class="title">Structures</p>
                <p class="label">{component.identity.structures.join(', ')}</p>
                {/if}

                {#if component?.identity?.tags}
                <p class="title">Tags</p>
                <p class="label">{component.identity.tags.join(', ')}</p>
                {/if}

            </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .component-info {
        width: 300px;
        min-width: 300px;
        box-sizing: border-box;
        padding: 0;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }
    .component-info.tutorial {
        width: 100%;
    }

    .nav-pane {
        box-sizing: border-box;
        background-color: #fafafa;
        border-right: solid 1px #eee;
        width: 44px;
        min-width: 44px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .thin .nav-pane {
        flex-direction: row;
        width: auto;
    }

    .menu {
        appearance: none;
        -webkit-appearance: none;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .inline-menu {
        display: inline-flex;
        vertical-align: bottom;
    }

    .menu:hover {
        background-color: #eee;
    }

    .content-pane {
        box-sizing: border-box;
        padding: 14px;
        width: 100%;
    }

    .component-data .description {
        font-size: 12px;
        color: rgb(65, 65, 65);
        margin: 10px 0 16px 0;
        max-width: 160px;
    }
    .component-data .tutorial {
        font-size: 14px;
        color: rgb(65, 65, 65);
        margin: 10px 0;
        line-height: 20px;
    }
    .component-data p {
        margin: 0;
    }
    .component-data .title {
        font-size: 12px;
        font-weight: bold;
    }
    .component-data .label {
        font-size: 12px;
        font-weight: 600;
        font-family: monospace;
        color: rgb(176, 61, 0);
        margin-bottom: 10px;
    }
    .component-data .label.buttons {
        display: flex;
    }
    .component-data .label.buttons button {
        padding: 0 5px 0 0;
        appearance: none;
        -webkit-appearance: none;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        font-family: monospace;
        color: rgb(0, 135, 176);
    }
    .component-data .label.buttons button.selected {
        color: rgb(176, 61, 0);
    }
    .component-data .label.buttons button:hover {
        text-decoration: underline;
    }
    .thin.component-info {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .component-title {
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 228px;
    }
</style>