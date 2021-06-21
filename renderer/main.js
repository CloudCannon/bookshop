#! /usr/bin/env node

const { Command } = require("commander");
const sveltePlugin = require('esbuild-svelte');
const path = require('path')
const express = require('express')
const BookshopImportGlobPlugin = require('./server/bookshopImportPlugin');
const BookshopScssImport = require('./server/scssImportPlugin');

const app = express();
const expressWs = require('express-ws')(app);

const program = new Command();

async function run() {
    program.requiredOption("-b, --bookshop <path>", "Path to the bookshop to serve");
    program.option("-p, --port <port>", "Port to serve the renderer JS on");
    program.option("-o, --output <filename>", "Build once and output final JS to given filename");
    program.option("--fluidns <namespace>", "Namespace for postcss-fluidvars");
    program.option("--exclude <tags...>", "Component tags to exclude (space seperated)");
    program.option("--stretcher", "Run the legacy stretcher importer on SCSS");
    program.parse(process.argv);
    const options = program.opts();
    const bookshopDir = path.join(process.cwd(), options.bookshop);
    const output = options.output && options.output.length ? path.join(process.cwd(), options.output) : false;

    const globals = {
        bookshopDir: bookshopDir,
        fileTypes: [
            "\.jekyll\.html",
            "\.bookshop\.toml",
            "\.svelte"
        ],
        exclude: JSON.stringify(options.exclude || []),
        port: options.port,
        output: output,
        sockets: [],
        currentMemoryFile: `console.log("📚 Javascript has  not yet built");`,
        runScssStretcher: options.stretcher,
        fluidns: options.fluidns
    };

    function fix_svelte_path() {
        return {
            name: 'fix_svelte_path',
            setup(b) {
                const path = require('path')
                const svelteFileLocation = require.resolve('svelte');
                const svelteFolderLocation = path.dirname(svelteFileLocation);
                const nodeFolderLocation = path.dirname(svelteFolderLocation);

                b.onResolve({ filter: /^svelte$|^svelte\// }, args => {
                    return { path: path.join(nodeFolderLocation,args.path,'index.mjs') }
                });
            }
        }
    }

    const buildRenderer = () => {
        const esbuildOptions = {};
        if (globals.output) {
            esbuildOptions.outfile = globals.output
            esbuildOptions.write = true;
            esbuildOptions.watch = false;
            esbuildOptions.define = { BOOKSHOP_HMR_AVAILABLE: false, BOOKSHOP_HMR_PORT: 0, BOOKSHOP_EXCLUDE: globals.exclude };
        } else {
            esbuildOptions.write = false;
            esbuildOptions.define = { BOOKSHOP_HMR_AVAILABLE: true, BOOKSHOP_HMR_PORT: globals.port, BOOKSHOP_EXCLUDE: globals.exclude };
            esbuildOptions.watch = {
                onRebuild(error, result) {
                    if (error) {
                        console.error('📚 Renderer rebuild failed:', error)
                    } else if (result.outputFiles[0]) {
                        updateNewFile(result.outputFiles[0])
                    }
                },
            };
        }
        
        require('esbuild').build({
            ...esbuildOptions,
            entryPoints: [path.join(__dirname, 'lib/app.js')],
            bundle: true,
            loader: {
                '.jekyll.html': 'text',
                '.bookshop.toml': 'text',
                '.bookshop_scss': 'text'
            },
            plugins: [
                fix_svelte_path(),
                BookshopImportGlobPlugin({
                    bookshopDir: globals.bookshopDir,
                    fileTypes: globals.fileTypes
                }),
                BookshopScssImport({
                    bookshopDir: globals.bookshopDir,
                    runScssStretcher: globals.runScssStretcher,
                    fluidns: globals.fluidns
                }),
                sveltePlugin({compileOptions: {css: true}})
            ],
        }).catch(() => process.exit(1))
        .then((result) => {
            if (result.errors.length) {
                console.error('📚 Renderer initial build failed:', result.errors)
            } else if (result.outputFiles?.[0]) {
                updateNewFile(result.outputFiles[0])
            } else if (globals.output) {
                console.log(`📚 Bookshop built to ${globals.output}`)
            }
        })
    }

    const serveRenderer = () => {
        if (!globals.port || !globals.port.length) {
            console.error("📚 In serve mode and no port provided!");
            process.exit(1);
        }
        app.get('/bookshop.js', (req, res) => {
            res.type('.js');
            res.send(globals.currentMemoryFile);
        })
    
        app.ws('/', function(ws, req) {
            globals.sockets.push(ws);
            console.log(`📚 Client Connected`);
        });
        
        app.listen(globals.port, () => {
            console.log(`📚 Bookshop Renderer served at http://localhost:${globals.port}/bookshop.js`)
        })
    }

    const updateNewFile = (file) => {
        globals.currentMemoryFile = file.text;
        console.log(`📚 Pushing new components`);
        globals.sockets.forEach(ws => {
            try {
                ws.send('new-components');
            } catch {}
        })
    }

    buildRenderer();
    if (!globals.output) serveRenderer();
}

run();