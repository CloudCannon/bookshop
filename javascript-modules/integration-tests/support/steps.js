// features/support/steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert").strict;

//
// HELPERS
//

const unescape = (str) => {
  return str.replace(/\\(.)/g, "$1");
}

const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const strToLenientRegExp = (str) => {
  return new RegExp(escapeRegExp(str).replace(/\s/g, "\\s*"));
}

const strToStrictRegExp = (str) => {
  return new RegExp(escapeRegExp(str));
}

//
// STEPS
//

Given(/^the file tree:$/i, function (input) {
  this.buildFileTree(input);
});

Given(/^an? (\S+) file containing "(.+)"$/i, function (filepath, input) {
  this.createFile(filepath, unescape(input));
});

Given(/^an? (\S+) file containing:$/i, function (filepath, input) {
  this.createFile(filepath, unescape(input));
});

When(/^I run "(.+)" in the (\S+) directory$/i, { timeout: 60 * 1000 }, async function (command, dir) {
  command = this.replacePort(command);
  await this.runCommand(unescape(command), dir);
});

When(/^I daemonize "(.+)" in the (\S+) directory$/i, { timeout: 60 * 1000 }, async function (command, dir) {
  command = this.replacePort(command);
  this.runCommand(unescape(command), dir); // We'll need to kill this later
});

When(/^I serve the (\S+) directory$/i, { timeout: 60 * 1000 }, function (dir) {
  this.serveDir(dir); // We'll need to kill this later
});

Then(/^(\S+) should (not )?exist$/i, function (file, negation) {
  const exists = this.fileExists(file);
  if (negation) assert.ok(!exists, `${file} does not exist`);
  else assert.ok(exists, `${file} exists`);
});

Then(/^(debug )?(\S+) should (not |leniently )?contain the text "(.+)"$/i, function (debug, file, modifier, contents) {
  assert.ok(this.fileExists(file), `${file} exists`);
  const fileContents = this.fileContents(file);
  if (debug) this.debugStep(fileContents);

  let negation = modifier === 'not ';
  contents = unescape(contents);
  if (modifier === 'leniently ') {
    contents = strToLenientRegExp(contents);
    fileContents = fileContents.replace(/\n/g, ' ');
  } else {
    contents = strToStrictRegExp(contents);
  }

  const contains = contents.test(fileContents);
  if (negation) assert.ok(!contains, `${file} does not match ${contents}`);
  else assert.ok(contains, `${file} matches ${contents}`);
});

Then(/^(debug )?(\S+) should (not |leniently )?contain each row:$/i, function (debug, file, modifier, table) {
  assert.ok(this.fileExists(file), `${file} exists`);
  let fileContents = this.fileContents(file);
  if (debug) this.debugStep(fileContents);

  let negation = modifier === 'not ';
  if (modifier === 'leniently ') {
    fileContents = fileContents.replace(/\n/g, ' ');
  }

  table.hashes().forEach(row => {
    let contents = unescape(row.text);
    if (modifier === 'leniently ') {
      contents = strToLenientRegExp(contents);
    } else {
      contents = strToStrictRegExp(contents);
    }
    const contains = contents.test(fileContents);
    if (negation) assert.ok(!contains, `${file} does not match ${contents}`);
    else assert.ok(contains, `${file} matches ${contents}`);
  });
});

Then(/^(debug )?(stdout|stderr) should (not )?be empty$/i, function (debug, stream, negation) {
  if (debug) this.debugStep(this[stream]);
  if (negation) assert.notStrictEqual(this[stream], "")
  else assert.strictEqual(this[stream], "");
});

Then(/^(debug )?(stdout|stderr) should (not )?contain "(.+)"$/i, function (debug, stream, negation, contents) {
  if (debug) this.debugStep(this[stream]);
  const contains = this[stream].includes(unescape(contents));
  if (negation) assert.ok(!contains, `${stream} does not contain ${unescape(contents)}`);
  else assert.ok(contains, `${stream} contains ${unescape(contents)}`);
});

//
// PUPPETEER HELPERS
//

const ensurePage = async (state) => {
  if (!state.browser) state.browser = await state.puppeteer.launch();
  if (!state.page) state.page = await state.browser.newPage();
}

function p_sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

const p_retry = async (fn, wait, attempts) => {
  try {
    return await fn();
  } catch (e) {
    if (attempts <= 0) {
      throw e;
    }
    await p_sleep(wait);
    return await p_retry(fn, attempts - 1);
  }
}

//
// PUPPETEER STEPS
//

When(/^🌐 I load (\S+)$/i, { timeout: 60 * 1000 }, async function (url) {
  await ensurePage(this);
  await p_retry(
    () => this.page.goto(this.replacePort(url), {
      waitUntil: 'networkidle2',
    }),
    500, // ms between attempts
    20 // attempts
  );
  this.page
    .on('console', message => this.trackPuppeteerLog(`${message.type().toUpperCase()}: ${message.text()}`))
    .on('pageerror', ({ message }) => this.trackPuppeteerError(message))
    .on('requestfailed', request => this.trackPuppeteerError(`${request.failure().errorText} ${request.url()}`));
});

When(/^🌐 CloudCannon is ready with the data:$/i, { timeout: 60 * 1000 }, async function (input) {
  if (!this.page) throw Error("No page open");
  const script = `window.CC = class CloudCannon {
    constructor(options) { this.data = options.data; document.dispatchEvent(this.event('cloudcannon:load')); }
    newData(data) { this.data = data; document.dispatchEvent(this.event('cloudcannon:update')); }
    event(name) { return new CustomEvent(name, { detail: { CloudCannon: this } });}
    enableEvents() {}
    refreshInterface() {}
    async value() { return this.data; }
  };
  window.CloudCannon = new window.CC({ data: ${input} })`;
  await this.page.addScriptTag({ content: script });
  await p_sleep(100); // Brief pause for Bookshop to re-render
});

When(/^🌐 CloudCannon pushes new data:$/i, { timeout: 60 * 1000 }, async function (input) {
  if (!this.page) throw Error("No page open");
  const script = `window.CloudCannon.newData(${input});`;
  await this.page.addScriptTag({ content: script });
});

When(/^🌐 "(.+)" evaluates$/i, { timeout: 5 * 1000 }, async function (statement) {
  if (!this.page) throw Error("No page open");
  try {
    await this.page.waitForFunction(statement, { timeout: 4 * 1000 });
  } catch (e) {
    this.trackPuppeteerError(`${statement} didn't evaluate within 4s`);
  }
});

Then(/^🌐 The selector (\S+) should contain "(.+)"$/i, { timeout: 60 * 1000 }, async function (selector, contents) {
  if (!this.page) throw Error("No page open");
  const innerText = await this.page.$eval(selector, (node) => node.innerText);
  const contains = innerText.includes(unescape(contents));
  assert.equal(innerText, contains ? innerText : `innerText containing \`${contents}\``);
});

Then(/^🌐 There should be no errors$/i, { timeout: 60 * 1000 }, async function () {
  assert.deepEqual(this.puppeteerErrors(), []);
});

Then(/^🌐 There should be no logs$/i, { timeout: 60 * 1000 }, async function () {
  assert.deepEqual(this.puppeteerLogs(), []);
});