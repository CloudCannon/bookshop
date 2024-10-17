import sveltePlugin from "esbuild-svelte";

export const extensions = [".svelte"];

export const buildPlugins = [
    sveltePlugin({ compileOptions: { css: true } })
]

export const esbuildConfigFn = (esbuildOptions, options) => {

};
