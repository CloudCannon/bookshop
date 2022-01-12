const path = require('path');
const fs = require('fs');
const { setWorldConstructor, Before, After, AfterAll } = require("@cucumber/cucumber");
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const FileTree = require('./filetree.js');
const test_order = require('./test_ordering.js')();
const kill = require('tree-kill');
const getPort = import('get-port');
const serve_handler = require('serve-handler');
const http = require('http');


// The 3x,xxx port block seems the most free on macOS
const starting_port = 30000;
const port_spacing = 10; // How many ports to provide each each with

Before(async function (scenario) {
  this.internal_test_id = `${scenario.pickle.uri}:${scenario.pickle.name}`;
  const test_index = (await test_order).indexOf(this.internal_test_id);
  if (test_index === -1) {
    throw new Error(`Test ${this.internal_test_id} not found in test_ordering`);
  }
  const assigned_block = starting_port + (test_index * port_spacing);
  const gp = await getPort;
  const port = await gp.default({ port: gp.portNumbers(assigned_block, assigned_block + 10) })
  this.assigned_port = port;

  this.tmp_dir = path.join(process.cwd(), `.bookshop-tmp-test-dir/${uuidv4()}`);
  fs.mkdirSync(this.tmp_dir, { recursive: true });
});

After(async function () {
  if (this.child) {
    kill(this.child.pid);
  }
  if (this.server) {
    this.server.close();
  }
  if (this.browser) {
    await this.browser.close();
  }
  if (!process.env["DEBUG"]) fs.rmdirSync(this.tmp_dir, { recursive: true });
});

class CustomWorld {
  constructor() {
    this.internal_test_id = "";
    this.variable = 0;
    this.tmp_dir = null;
    this.commandError = null;
    this.stdout = null;
    this.stderr = null;
    this.storage = {}; // Generic storage that steps can use
    this.puppeteer = puppeteer; // The puppeteer instance that our steps can use
    this.browser = null; // An active puppeteer browser
    this.page = null; // An active puppeteer page
    this.page_errors = []; // Any network or javascript errors from puppeteer will be collected here
    this.page_logs = []; // Any logs from puppeteer will be collected here
    this.assigned_port = null; // A free port that tests can spin processes up on
    this.child = null; // An active child process that we need to kill later
    this.server = null; // An active http server that we need to kill later
  }

  debugStep(log) {
    console.log(`\n\n[${this.internal_test_id}]\n- - - DEBUG OUTPUT\n${log}\n- - - END DEBUG OUTPUT\n`)
  }

  buildFileTree(input) {
    const tree = new FileTree(input);
    tree.parse().forEach(file => {
      const fullCreatePath = path.join(this.tmp_dir, file.create);
      const fullFromPath = path.join(__dirname, file.from);
      fs.mkdirSync(path.dirname(fullCreatePath), { recursive: true });
      fs.copyFileSync(fullFromPath, fullCreatePath);
    });
  }

  createFile(filePath, input) {
    const fullPath = path.join(this.tmp_dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, input);
  }

  fileExists(name) {
    return fs.existsSync(path.join(this.tmp_dir, name));
  }

  fileContents(name) {
    return fs.readFileSync(path.join(this.tmp_dir, name), 'utf8');
  }

  replacePort(str) {
    return str.replace(/__PORT__/ig, this.assigned_port);
  }

  trackPuppeteerError(e) {
    this.page_errors.push(e);
  }

  puppeteerErrors() {
    return this.page_errors;
  }

  trackPuppeteerLog(e) {
    this.page_logs.push(e);
  }

  puppeteerLogs() {
    return this.page_logs;
  }

  serveDir(dir) {
    const fullPath = path.join(this.tmp_dir, dir);

    if (this.server) {
      throw new Error("Multiple servers!");
    }

    this.server = http.createServer((request, response) => serve_handler(request, response, {
      public: fullPath
    }));
    this.server.listen(this.assigned_port, () => { });
  }

  async runCommand(command, dir) {
    const fullPath = path.join(this.tmp_dir, dir);

    // Fix node binary location on GitHub Actions
    command = command.replace(/npm start/g, 'npm start --scripts-prepend-node-path');

    if (this.child) {
      throw new Error("Multiple child processes!");
    }

    return new Promise((resolve, reject) => {
      this.child = exec(command, { cwd: fullPath }, (error, stdout, stderr) => {
        this.commandError = error || "";
        this.stdout = stdout || "";
        this.stderr = stderr || "";
        this.child = null;
        resolve();
      });
    });
  }
}

setWorldConstructor(CustomWorld);