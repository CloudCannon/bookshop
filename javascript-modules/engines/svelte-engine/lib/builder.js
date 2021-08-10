import sveltePlugin from "esbuild-svelte";
import svelteFixPlugin from "./lib/build/svelteFixPlugin.js";

export const extensions = [".svelte"];

export const buildPlugins = [
    sveltePlugin({compileOptions: {css: true}}),
    svelteFixPlugin
]
