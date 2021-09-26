// features/support/steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert").strict;

const unescape = (str) => {
  return str.replace(/\\(.)/g, "$1");
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

Then(/^(debug )?(\S+) should (not )?contain the text "(.+)"$/i, function (debug, file, negation, contents) {
  assert.ok(this.fileExists(file), `${file} exists`);
  const fileContents = this.fileContents(file);
  if (debug) debugStep(fileContents);

  const contains = fileContents.includes(unescape(contents));
  if (negation) assert.ok(!contains, `${file} does not contain ${unescape(contents)}`);
  else assert.ok(contains, `${file} contains ${unescape(contents)}`);
});

Then(/^(debug )?(\S+) should (not )?contain each row:$/i, function (debug, file, negation, table) {
  assert.ok(this.fileExists(file), `${file} exists`);
  const fileContents = this.fileContents(file);
  if (debug) debugStep(fileContents);

  table.hashes().forEach(row => {
    const contains = fileContents.includes(unescape(row.text));
    if (negation) assert.ok(!contains, `${file} does not contain ${unescape(row.text)}`);
    else assert.ok(contains, `${file} contains ${unescape(row.text)}`);
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


