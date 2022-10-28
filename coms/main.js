var path = require("path");
var concat = require(path.join(__dirname, "./concat.js"));
extend(console, colored_console);
var pngname, scale, prefix;
for (var arg of process.argv.slice(2)) {
    if (pixelreg.test(arg) || /\=/.test(arg)) {
        scale = arg;
    }
    else if (/\-$/.test(arg)) {
        prefix = arg;
    }
    else if (!pngname) {
        pngname = arg;
    }

}
try {
    concat(process.cwd(), pngname || prefix && prefix.replace(/\-$/, '') || "png-concat.concat", scale, prefix);
}
catch (e) {
    console.error(e.message)
}