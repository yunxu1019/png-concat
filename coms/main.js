var concat = require("./concat");
var pngname, scale, prefix;
for (var arg of process.argv.slice(2)) {
    if (/^(\d+)?(\.\d*)?(p[xt]|r?em|[cm]m)?$/i.test(arg)) {
        scale = arg;
    }
    else if (/\-$/.test(arg)) {
        prefix = arg;
    }
    else if (!pngname) {
        pngname = arg;
    }

}
concat(process.cwd(), pngname || prefix && prefix.replace(/\-$/, '') || "png-concat.concat", scale, prefix);