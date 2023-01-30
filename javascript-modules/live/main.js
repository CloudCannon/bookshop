import path from "path";
import Builder from "@bookshop/builder";
import { __dirname } from "./lib/build/util.js"

export const runner = async (options) => {
    const bookshopDirs = options.bookshop.map(d => path.join(process.cwd(), d));
    const outputFile = path.join(process.cwd(), options.output);

    const builderOptions = {
        esbuild: {
            outfile: outputFile,
            entryPoints: [path.join(__dirname(import.meta.url), 'lib/app/app.js')]
        },
        exclude: JSON.stringify(options.exclude || []),
        onlyEngines: options.onlyEngines,
        bookshopDirs: bookshopDirs,
        hosted: true
    }

    return await Builder(builderOptions);
}
