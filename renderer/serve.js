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
    program.requiredOption("-p, --port <port>", "Port to serve the polymorph JS on");
    program.requiredOption("-b, --bookshop <path>", "Path to the bookshop to serve");
    program.option("--fluidns <namespace>", "Namespace for postcss-fluidvars.");
    program.option("--stretcher", "Run the legacy stretcher importer on SCSS.");
    program.parse(process.argv);
    const options = program.opts();
    const bookshopDir = path.join(process.cwd(), options.bookshop);

    const globals = {
        bookshopDir: bookshopDir,
        fileTypes: [
            "\.jekyll\.html",
            "\.bookshop\.toml",
            "\.stories\.toml", // TODO: Remove legacy bookshop support
            "\.svelte"
        ],
        port: options.port,
        sockets: [],
        currentMemoryFile: `console.log("Javascript has  not yet built");`,
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

    const buildPolymorph = () => {
        require('esbuild').build({
            entryPoints: [path.join(__dirname, 'lib/app.js')],
            bundle: true,
            write: false,
            watch: {
                onRebuild(error, result) {
                    if (error) {
                        console.error('Polymorph rebuild failed:', error)
                    } else if (result.outputFiles[0]) {
                        updateNewFile(result.outputFiles[0])
                    }
                },
            },
            loader: {
                '.jekyll.html': 'text',
                '.bookshop.toml': 'text',
                '.stories.toml': 'text', // TODO: Remove legacy bookshop support
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
                console.error('Polymorph initial build failed:', result.errors)
            } else if (result.outputFiles[0]) {
                updateNewFile(result.outputFiles[0])
            }
        })
    }

    const servePolymorph = () => {
        app.get('/bookshop.js', (req, res) => {
            res.type('.js');
            res.send(globals.currentMemoryFile);
        })
    
        app.ws('/', function(ws, req) {
            globals.sockets.push(ws);
            console.log(`Client Connected`);
        });
        
        app.listen(options.port, () => {
            console.log(`📚 Bookshop Polymorph served at http://localhost:${options.port}/bookshop.js`)
        })
    }

    const updateNewFile = (file) => {
        globals.currentMemoryFile = file.text;
        console.log(`Pushing new components`);
        globals.sockets.forEach(ws => {
            try {
                ws.send('new-components');
            } catch {}
        })
    }

    buildPolymorph();
    servePolymorph();
}

run();