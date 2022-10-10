/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const out = "./build/";
const to = "./docs/obsolete.js";
if (fs.existsSync(to)) {
  fs.unlinkSync(to);
}
fs.copyFileSync(out + "obsolete.js", to);
