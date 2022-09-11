var pngjs = require("pngjs");
var fs = require("fs");
var path = require("path");
var { PNG } = pngjs;

var getExtentionsFromPath = function (destpath) {
    var exts;
    if (/\.([\|]?(json|png|html|css))+$/i.test(destpath)) {
        if (!exts) exts = {};
        destpath.replace(/[\s\S]*\.([^\.]*)$/, "$1").split("|").forEach(function (a) {
            switch (a) {
                case "html":
                    exts.html = true;
                case "css":
                    exts.css = true;
                    break;
                case "json":
                    exts.json = true;
                    break;
            }
        });
        exts.png = true;
        destpath = destpath.replace(/([\s\S]*)\.[^\.]*$/, "$1") || void 0;
    }
    return [destpath, exts];
}
var concatpng = function (pathname, destpath, pixel = "1px") {
    if (pixel && /^(\d+)?(\.\d+)?$/.test(pixel)) pixel = 1 / pixel + "px";
    var pixel_scale = /^(\d+(?:\.\d*)?|\.\d+)(.*?)$/.exec(pixel);
    if (!pixel_scale) throw new Error("pixel参数无效，可以传入的值有1px,2px,1em,2em等数字加单位的形式");
    fs.readdir(pathname, function (err, files) {
        var pngcollection = [];
        if (err) {
            console.error(err);
            return;
        }
        files.filter(name => /\.png$/i.test(name) && !/\.concat\.png$/i.test(name))
            .map(function (filename, cx, filtered) {
                var fullpath = path.join(pathname, filename);
                readinfo(fullpath).then(function (pngObject) {
                    pngObject.name = filename.replace(/\.png$/i, "");
                    pngObject.cssname = pngObject.name.replace(/[^\w\-\_]/g, a => a.charCodeAt(0).toString(36));
                    pngcollection.push(pngObject);
                    if (pngcollection.length === filtered.length) {
                        packcollection(pngcollection, destpath, +pixel_scale[1] || 1, pixel_scale[2] || "px");
                    }
                });
            });

    })
};

var getSizeKey = function (height) {
    return Math.log2(height) * 2 | 0;
};

var readinfo = function (pngsrc) {
    return new Promise(function (ok, oh) {
        fs.createReadStream(pngsrc).pipe(new PNG).on('parsed', function () { ok(this) });
    });
};

var packcollection = function (pngcollection, filedestpath, ratio, pixel) {
    var sizeMap = {
    };
    var totalSize = 0;
    pngcollection.forEach(function (png) {
        var sizekey = getSizeKey(png.height);
        totalSize += png.width * png.height;
        if (!sizeMap[sizekey]) sizeMap[sizekey] = [png.height];
        if (png.height > sizeMap[sizekey][0]) sizeMap[sizekey][0] = png.height;
        sizeMap[sizekey].push(png);
    });
    var aimedWidth = Math.sqrt(totalSize), targetWidth = 0, tempWidth = 0;
    var grid = [], row = null;
    for (var k in sizeMap) {
        for (var o of sizeMap[k].slice(1)) {
            if (tempWidth && tempWidth + o.width <= aimedWidth) {
                tempWidth += o.width;
            }
            else {
                tempWidth = o.width;
                sizeMap[k][1]++;
                row = [0, 0];
                grid.push(row);
            }
            row.push(o);
            o.left = row[0];
            row[0] += o.width;
            row[1] = Math.max(row[1], o.height);
            targetWidth = Math.max(tempWidth, targetWidth);
        }
    }
    var totalHeight = 0;
    for (var r of grid) {
        for (var p of r) {
            p.top = totalHeight;
        }
        totalHeight += r[1];
    }
    var dest = new PNG({
        width: targetWidth,
        height: totalHeight
    });
    var [maxWidthLength, maxHeightLength, maxNameLength, maxLeftLength, maxTopLength] = [0, 0, 0, 0, 0];
    var scale = function (str) {
        if (typeof str === "string") return str;
        return +(ratio * str).toFixed(4) + pixel;
    };
    pngcollection.forEach(function (png) {
        var { width, height, top, left, cssname } = png;
        maxNameLength = Math.max(scale(cssname).length, maxNameLength);
        maxWidthLength = Math.max(scale(width).length, maxWidthLength);
        maxHeightLength = Math.max(scale(height).length, maxHeightLength);
        maxLeftLength = Math.max(scale(-left).length, maxLeftLength);
        maxTopLength = Math.max(scale(-top).length, maxTopLength);
        png.bitblt(dest, 0, 0, width, height, left, top);
    });
    var [filedestname = "png-concat.concat", extentions = { png: true, html: true, css: true, json: true }] = getExtentionsFromPath(filedestpath);
    var pngfilename = filedestname + ".png";
    var cssfilename = filedestname + ".css";
    var padding = function (str, minLength) {
        if (typeof str !== "string") var isReverse = true;;
        str = scale(str);
        if (str.length >= minLength) return str;
        if (isReverse) return " ".repeat(minLength - str.length) + str;
        return str + " ".repeat(minLength - str.length);
    };
    var stylesheets = pngcollection.map(function (png) {
        return `.png-concat-${padding(png.cssname, maxNameLength)} { width: ${padding(png.width, maxWidthLength)}; height: ${padding(png.height, maxHeightLength)}; background-position: ${padding(-png.left, maxLeftLength)} ${padding(-png.top, maxTopLength)} }`
    });
    var cssdata = [
        `.png-concat{ background: url('${pngfilename}') no-repeat 0 0 / ${scale(targetWidth)} ${scale(totalHeight)}; display: inline-block; }`
    ].concat(stylesheets).join("\r\n");
    var divdata = pngcollection.map(function (png) {
        return `<div class="png-concat png-concat-${png.cssname}"></div>`
    }).join("\r\n");
    var htmldata = `<!doctype html>\r\n<html><head><meta charset="utf-8"/><title>png-concat图标查看工具</title><link rel="stylesheet" type='text/css' href="${cssfilename}"/></head>\r\n<body>\r\n${divdata}\r\n</body></html>`
    dest.pack().pipe(fs.createWriteStream(pngfilename));
    var jsondata = {};
    pngcollection.forEach(function ({ cssname, width, height, left, top }) {
        return jsondata[cssname] = { pixelRatio: ratio, width, height, x: left, y: top };
    });
    [
        ["css", cssdata, cssfilename],
        ['html', htmldata],
        ['json', JSON.stringify(jsondata, null, 4)]
    ].forEach(function ([ext, data, filename = filedestname + '.' + ext]) {
        if (extentions[ext]) {
            fs.writeFile(filename, data, function (error) {
                if (error) return console.error(
                    new Error(`写入${ext}失败！`)
                );
                console.log(filename);
            });
        }

    });
};
module.exports = concatpng;