// features/support/steps.js
const yaml = require("js-yaml");
const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert").strict;


/* * * * * * * * * *
 *                 *
 * STRING  HELPERS *
 *                 *
 * * * * * * * * * */

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

const subVariables = (input, varObject) => {
  for (const [key, value] of Object.entries(varObject)) {
    const r = new RegExp(`\\[${key}\\]`, 'g');
    input = input.replace(r, value);
  }
  return input;
}

/* * * * * * * * * * *
 *                   *
 * FILESYSTEM  STEPS *
 *                   *
 * * * * * * * * * * */

Given(/^the file tree:$/i, function (input) {
  this.buildFileTree(input);
});

Given(/^an? (\S+) file containing "(.+)"$/i, function (filepath, input) {
  input = subVariables(input, this.storage);
  this.createFile(filepath, unescape(input));
});

Given(/^an? (\S+) file containing:$/i, function (filepath, input) {
  input = subVariables(input, this.storage);
  this.createFile(filepath, unescape(input));
});

Given(/^\[(.+)\]:$/i, function (variable, input) {
  this.storage[variable] = input;
});

Given(/^\[(.+)\]: "(.+)"$/i, function (variable, input) {
  this.storage[variable] = input;
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

/* * * * * * * * *
 *               *
 * COMMAND STEPS *
 *               *
 * * * * * * * * */

Given(/^I serve the (\S+) directory$/i, { timeout: 60 * 1000 }, function (dir) {
  this.serveDir(dir); // We'll need to kill this later
});

When(/^I run "(.+)" in the (\S+) directory$/i, { timeout: 60 * 1000 }, async function (command, dir) {
  command = this.replacePort(command);
  await this.runCommand(unescape(command), dir);
  assert.strictEqual(this.commandError, "");
});

When(/^I daemonize "(.+)" in the (\S+) directory$/i, { timeout: 60 * 1000 }, async function (command, dir) {
  command = this.replacePort(command);
  this.runCommand(unescape(command), dir); // We'll need to kill this later
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

/* * * * * * * * * * *
 *                   *
 * PUPPETEER HELPERS *
 *                   *
 * * * * * * * * * * */

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

const loadPage = async (url, world) => {
  await ensurePage(world);
  await p_retry(
    () => world.page.goto(world.replacePort(url), {
      waitUntil: 'networkidle0',
    }),
    500, // ms between attempts
    20 // attempts
  );
  world.page
    .on('console', message => world.trackPuppeteerLog(`${message.type().toUpperCase()}: ${message.text()}`))
    .on('pageerror', ({ message }) => world.trackPuppeteerError(message))
    .on('requestfailed', request => world.trackPuppeteerError(`${request.failure().errorText} ${request.url()}`));
}

const readyCloudCannon = async (data, world) => {
  if (!world.page) throw Error("No page open");
  const script = `window.CC = class CloudCannon {
    constructor(options) { this.isMocked = true; this.data = options.data; document.dispatchEvent(this.event('cloudcannon:load')); }
    newData(data) { this.data = data; document.dispatchEvent(this.event('cloudcannon:update')); }
    event(name) { return new CustomEvent(name, { detail: { CloudCannon: this } });}
    enableEvents() {}
    refreshInterface() {}
    async value() { return this.data; }
  };
  window.CloudCannon = new window.CC({ data: ${data} })`;
  await world.page.addScriptTag({ content: script });
  await p_sleep(50);
}

/* * * * * * * * * *
 *                 *
 * PUPPETEER STEPS *
 *                 *
 * * * * * * * * * */

When(/^🌐 I load (\S+)$/i, { timeout: 60 * 1000 }, async function (url) {
  await loadPage(url, this);
});

When(/^🌐 CloudCannon is ready with the data:$/i, { timeout: 60 * 1000 }, async function (data) {
  await readyCloudCannon(data, this);
});

When(/^🌐 CloudCannon pushes new json:$/i, { timeout: 60 * 1000 }, async function (input) {
  if (!this.page) throw Error("No page open");
  const script = `window.CloudCannon.newData(${input});`;
  await this.page.addScriptTag({ content: script });
  try {
    await this.page.waitForFunction(`window.bookshopLive?.renderCount >= 2`, { timeout: 4 * 1000 });
  } catch (e) {
    this.trackPuppeteerError(`Bookshop didn't re-render within 4s`);
  }
});

When(/^🌐 CloudCannon pushes new yaml:$/i, { timeout: 60 * 1000 }, async function (input) {
  if (!this.page) throw Error("No page open");
  const page_data = JSON.stringify(yaml.load(input));
  const script = `window.CloudCannon.newData(${page_data});`;
  await this.page.addScriptTag({ content: script });
  try {
    await this.page.waitForFunction(`window.bookshopLive?.renderCount >= 2`, { timeout: 4 * 1000 });
  } catch (e) {
    this.trackPuppeteerError(`Bookshop didn't re-render within 4s`);
  }
});

When(/^🌐 "(.+)" evaluates$/i, { timeout: 5 * 1000 }, async function (statement) {
  if (!this.page) throw Error("No page open");
  try {
    await this.page.waitForFunction(statement, { timeout: 4 * 1000 });
  } catch (e) {
    this.trackPuppeteerError(`${statement} didn't evaluate within 4s`);
  }
});

When(/^🌐 I (?:add|have added) a click listener to (\S+)$/i, { timeout: 60 * 1000 }, async function (selector) {
  await this.page.evaluate((selector) => {
    document.querySelector(selector).addEventListener('click', () => { window[`${selector}:clicked`] = true })
  }, selector);
});

When(/^🌐 I click (\S+)$/i, { timeout: 60 * 1000 }, async function (selector) {
  await this.page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
});

When(/^🌐 I trigger a (\S+) on (\S+)$/i, { timeout: 60 * 1000 }, async function (action, selector) {
  await this.page.evaluate((action, selector) => {
    document.querySelector(selector).dispatchEvent(new Event(action))
  }, action, selector);
});

Then(/^🌐 There should be a click listener on (\S+)$/i, { timeout: 60 * 1000 }, async function (selector) {
  await this.page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
  const clicked = await this.page.evaluate((selector) => {
    return window[`${selector}:clicked`];
  }, selector);
  assert.equal(clicked, true, `Clicking the element did fire the expected handler. Expected window["${selector}:clicked"] to be true.`);
});

Then(/^🌐 The selector (\S+) should contain ['"](.+)['"]$/i, { timeout: 60 * 1000 }, async function (selector, contents) {
  if (!this.page) throw Error("No page open");
  const innerText = await this.page.$eval(selector, (node) => node.innerText);
  const contains = innerText.includes(unescape(contents));
  assert.equal(innerText, contains ? innerText : `innerText containing \`${contents}\``);
});

Then(/^🌐 The selector (\S+) should match ['"](.+)['"]$/i, { timeout: 60 * 1000 }, async function (selector, contents) {
  if (!this.page) throw Error("No page open");
  const outerHTML = await this.page.$eval(selector, (node) => node.outerHTML);
  const contains = outerHTML.includes(unescape(contents));
  assert.equal(outerHTML, contains ? outerHTML : `outerHTML containing \`${contents}\``);
});

Then(/^🌐 "(.+)" should evaluate$/i, { timeout: 5 * 1000 }, async function (statement) {
  if (!this.page) throw Error("No page open");
  try {
    await this.page.waitForFunction(statement, { timeout: 4 * 1000 });
  } catch (e) {
    throw Error(`${statement} didn't evaluate within 4s`)
  }
});

Then(/^🌐 There should be no errors$/i, { timeout: 60 * 1000 }, async function () {
  assert.deepEqual(this.puppeteerErrors(), []);
});

Then(/^🌐 There should be no logs$/i, { timeout: 60 * 1000 }, async function () {
  assert.deepEqual(this.puppeteerLogs(), []);
});

/* * * * * * * *
 *             *
 * COMBO STEPS *
 *             *
 * * * * * * * */

Given(/^🌐 I (?:have loaded|load) my site( in CloudCannon)?$/i, { timeout: 60 * 1000 }, async function (inCloudCannon) {
  if (!this.storage.ssg) {
    throw new Error(`Expected ssg to be set with a "Given [ssg]:" step`);
  }
  if (!/^jekyll|eleventy|hugo$/.test(this.storage.ssg)) {
    throw new Error(`SSG was ${this.storage.ssg}, expected one of: jekyll, eleventy, hugo`);
  }
  const ssg = this.storage.ssg;

  let page_data;
  if (inCloudCannon) {
    if (!this.storage.front_matter) {
      throw new Error(`Expected front matter to be set with a "Given [front_matter]:" step`);
    }
    page_data = JSON.stringify(yaml.load(this.storage.front_matter));
  }

  // SSG build
  switch (ssg) {
    case 'jekyll':
      await this.runCommand(`bundle exec jekyll build --trace`, `site`);
      break;
    case 'hugo':
      await this.runCommand(`hugo`, `site`);
      assert.strictEqual(this.stderr, "");
      assert.strictEqual(this.commandError, "");
      await this.runCommand(`cloudcannon-hugo --baseurl /`, `site`);
      break;
    case 'eleventy':
      await this.runCommand(`npm start`, `site`);
  }
  assert.strictEqual(this.stderr, "");
  assert.strictEqual(this.commandError, "");

  // @bookshop/generate
  await this.runCommand(`npm start`, `.`);

  // Open the site in a browser
  switch (ssg) {
    case 'jekyll':
    case 'eleventy':
      this.serveDir("site/_site");
      break;
    case 'hugo':
      this.serveDir("site/public");
  }
  await loadPage("http://localhost:__PORT__", this);
  if (inCloudCannon) {
    // Trigger cloudcannon:load
    await readyCloudCannon(page_data, this);
    try {
      await this.page.waitForFunction("window.bookshopLive?.renderCount > 0", { timeout: 4 * 1000 });
    } catch (e) {
      this.trackPuppeteerError(e.toString());
      this.trackPuppeteerError(`Bookshop didn't do an initial render within 4s`);
    }
  }

  assert.deepEqual(this.puppeteerErrors(), []);
});