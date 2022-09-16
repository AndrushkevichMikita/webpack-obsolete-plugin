/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const out = './build/';

fs.rmdirSync(out, {
  recursive: true
});
fs.mkdirSync(out);

[
  './package.json', //
  // "./package-lock.json",
  //   './.npmignore',
  //   './README.md',
  './obsoletePlugin.js'
  //   './LICENSE.md'
].forEach((f) => {
  fs.copyFileSync(f, path.resolve(out, f));
});