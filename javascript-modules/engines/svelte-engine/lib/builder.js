import sveltePlugin from "esbuild-svelte";
import svelteFixPlugin from "./svelteFixPlugin.js";

export const extensions = [".svelte"];

export const buildPlugins = [
    sveltePlugin({ compileOptions: { css: true } }),
    svelteFixPlugin
]

export const esbuildConfigFn = (esbuildOptions, options) => {

};
