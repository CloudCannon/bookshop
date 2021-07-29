import { fileURLToPath } from "url";
import path from 'path';

global.__filename = u => fileURLToPath(u);
global.__dirname = u => path.dirname(__filename(u));

global.stubExternalPlugin = (name, regex) => {
    return {
        name: name,
        setup(build) {
            build.onResolve({ filter: regex }, args => {
                return { path: args.path, external: true }
            })
        },
    }
}

