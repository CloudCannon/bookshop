import fastGlob from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import sass from 'sass';
import postcss from 'postcss';
import postcssConfig from 'postcss-load-config';
import normalizePath from 'normalize-path';

const sassImport = (filePath) => `@import '${filePath}';`;
const mapDirs = (dirs = [], seg) => { 
    // normalizePath is used because fast-glob does not support \\ path separators
    return dirs.map(d => normalizePath(path.join(d, `/${seg}/**/*.scss`)))
};

const sortBookshopFiles = (a, b) => {
    const m = /\/shared\//;
    const aIsShared = m.test(a), bIsShared = m.test(b);
    if (aIsShared && !bIsShared) {
        return -1;
    } else if (!aIsShared && bIsShared) {
        return 1;
    } else {
        return a.localeCompare(b);
    }
}

const findPostcssConfig = async (primaryBookshopDir) => {
    let config = null;
    try {
        const bookshopPostcssPath = normalizePath(path.join(primaryBookshopDir, 'bookshop/*postcss*'));
        const postcssFiles = (await fastGlob(bookshopPostcssPath));
        if (postcssFiles.length) {
            config = await postcssConfig({}, path.join(primaryBookshopDir, 'bookshop'));
        } else {
            config = await postcssConfig();
        }
    } catch (e) {
        if (e?.code === "ERR_REQUIRE_ESM") {
            console.error([
                `Bookshop tried to load a commonjs postcss configuration file as ESM and failed.`,
                `• Try changing the extension of your file from .js to .cjs`,
                `• postcss.config.cjs should be handled correctly in any modern postcss implementation.`
            ].join(`\n`));
        } else if (e?.code === "MODULE_NOT_FOUND"){
            console.warn(e);
        }
        config = null;
    }
    return config;
}

export default (options) => ({
    name: 'bookshop-styles',
    setup: (build) => {
        build.onResolve({ filter: /^__bookshop_styles__$/ }, async (args) => {
            const bookshopDirs = options?.bookshopDirs || [];
            const fullPaths = [
                ...mapDirs(bookshopDirs, "shared/styles"),
                ...mapDirs(bookshopDirs, "components")
            ];
            return {
                path: '_',
                namespace: 'bookshop-styles-import',
                pluginData: {
                    resolveDir: normalizePath(args.resolveDir),
                    fullPaths: fullPaths,
                    bookshopDirs: options?.bookshopDirs
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-styles-import' }, async (args) => {
            if (args.pluginData.fullPaths.length === 0) {
                return { contents: "", loader: 'text' };
            }
            const files = (await fastGlob(args.pluginData.fullPaths, {
                cwd: args.pluginData.resolveDir,
            })).sort(sortBookshopFiles);
            
            try {
                const sassInput = `${files.map(sassImport).join('\n')}`;
                const sassOutput = sass.renderSync({data: sassInput, quiet: true});
                let cssCode = sassOutput?.css ?? '// Failed to compile';
                
                const primaryBookshopDir = args.pluginData.bookshopDirs[0];
                const postcssSettings = await findPostcssConfig(primaryBookshopDir);
                if (postcssSettings) {
                    const plugins = postcssSettings.plugins;
                    const options = {
                        from: undefined,
                        ...postcssSettings.options
                    };
                    const postcssResult = await postcss(plugins).process(cssCode, options);
                    cssCode = postcssResult.css;
                    
                    const postcssWarnings = postcssResult.warnings();
                    postcssWarnings.forEach(warning => {
                        console.warn(`⛔️ POSTCSS[${warning.plugin}]: ${warning.text}`);
                    });
                }
                return { contents: cssCode, loader: 'text', resolveDir: args.pluginData.resolveDir, watchFiles: files };
            } catch (e) {
                console.error("Bookshop sass compilation failed:");
                console.error(e);
                return { contents: `.bookshop-renderer::after {
                    content: "⛔️      Bookshop sass rendering failed     ⛔️";
                    text-align: center;
                    white-space: pre;
                    color: white;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    padding: 10px;
                    background-color: #960000;
                }`, loader: 'text', resolveDir: args.pluginData.resolveDir, watchFiles: files };
            }
        });
    },
});
