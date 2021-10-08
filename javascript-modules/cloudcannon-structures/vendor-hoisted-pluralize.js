#! /usr/bin/env node

const path = require('path');
const fs = require('fs');

fs.copyFileSync(
    path.join(__dirname, '../node_modules/pluralize/pluralize.js'),
    path.join(__dirname, 'vendored-pluralize.js'),
);
