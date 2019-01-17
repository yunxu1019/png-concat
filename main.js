#!/usr/bin/env node
var concatpng = require("./concat");
var [, , pngname, scale] = process.argv;
if (/^(\d+)?(\.\d*)?(p[xt]|r?em|[cm]m)?$/i.test(pngname)) {
    scale = pngname;
    pngname = "";
}
concatpng(process.cwd(), pngname || "png-concat.concat", scale);