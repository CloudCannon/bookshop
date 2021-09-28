// features/support/steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert").strict;

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

const debugStep = (log) => {
  console.log(`\n\n--- DEBUG OUTPUT:\n\n\n${log}\n\n--- END DEBUG OUTPUT\n`)
}

Given(/^the file tree:$/i, function (input) {
  this.buildFileTree(input);
});

Given(/^an? (\S+) file containing "(.+)"$/i, function (filepath, input) {
  this.createFile(filepath, unescape(input));
});

Given(/^an? (\S+) file containing:$/i, function (filepath, input) {
  this.createFile(filepath, unescape(input));
});

When(/^I run "(.+)" in the (\S+) directory$/i, {timeout: 60 * 1000}, async function (command, dir) {
  await this.runCommand(unescape(command), dir);
});

Then(/^(\S+) should (not )?exist$/i, function (file, negation) {
  const exists = this.fileExists(file);
  if (negation) assert.ok(!exists, `${file} does not exist`);
  else assert.ok(exists, `${file} exists`);
});

Then(/^(debug )?(\S+) should (not |leniently )?contain the text "(.+)"$/i, function (debug, file, modifier, contents) {
  assert.ok(this.fileExists(file), `${file} exists`);
  const fileContents = this.fileContents(file);
  if (debug) debugStep(fileContents);

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
  if (debug) debugStep(fileContents);

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
  if (debug) debugStep(this[stream]);
  if (negation) assert.notStrictEqual(this[stream], "")
  else assert.strictEqual(this[stream], "");
});

Then(/^(debug )?(stdout|stderr) should (not )?contain "(.+)"$/i, function (debug, stream, negation, contents) {
  if (debug) debugStep(this[stream]);
  const contains = this[stream].includes(unescape(contents));
  if (negation) assert.ok(!contains, `${stream} does not contain ${unescape(contents)}`);
  else assert.ok(contains, `${stream} contains ${unescape(contents)}`);
});


