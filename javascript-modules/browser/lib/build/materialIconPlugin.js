import path from 'path';
import fastGlob from 'fast-glob';
import { createRequire } from 'module';
import normalizePath from 'normalize-path';

const importFile = (file, index) => {
    return `
    import icon${index} from '@material-design-icons/svg/filled/${file}';
    files['${file.replace(/\.svg$/, '')}'] = icon${index};`
}

export default () => ({
    name: 'material-glob',
    setup: (build) => {
        build.onResolve({ filter: /^__filled_material_icons__$/ }, async (args) => {
            const require = createRequire(import.meta.url);
            const iconPath = path.dirname(require.resolve('@material-design-icons/svg/package.json'))
            if (!iconPath) return;
            return {
                path: args.path,
                namespace: 'renderer-material-glob',
                pluginData: {
                    resolveDir: normalizePath(path.join(iconPath, 'filled'))
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'renderer-material-glob' }, async (args) => {
            const files = (await fastGlob(`*.svg`, {
                cwd: args.pluginData.resolveDir,
            })).sort();
            const output = `
            const files = {};
            ${files.map(importFile).join('\n')}

            export default files;
            `;
            return { contents: output, resolveDir: args.pluginData.resolveDir };
        });
    },
});
