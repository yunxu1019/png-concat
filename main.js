#!/usr/bin/env node
var pngjs = require("pngjs");
var fs = require("fs");
var path = require("path");
var { PNG } = pngjs;

var concatpng = function (pathname) {
    fs.readdir(pathname, function (err, files) {
        var pngcollection = [];
        if (err) {
            console.error(err);
            return;
        }
        files.filter(filename => /\.png$/i.test(filename) && !/\.concat\.png$/i.test(filename)).map(function (filename, cx, filtered) {
            var fullpath = path.join(pathname, filename);
            readinfo(fullpath).then(function (pngObject) {
                pngObject.name = filename.replace(/\.png$/i, "");
                pngObject.cssname = pngObject.name.replace(/[^\w\-\_]/g, a => a.charCodeAt(0).toString(36));
                pngcollection.push(pngObject);
                if (pngcollection.length === filtered.length) {
                    packcollection(pngcollection);
                }
            });
        });

    })
};
var readinfo = function (pngsrc) {
    return new Promise(function (ok, oh) {
        fs.createReadStream(pngsrc).pipe(new PNG).on('parsed', function () { ok(this) });
    });
};

var packcollection = function (pngcollection) {
    var sizeMap = {
    };
    var totalSize = 0;
    pngcollection.forEach(function (png) {
        var sizekey = [png.width, png.height].join(",");
        totalSize += png.width * png.height;
        if (!sizeMap[sizekey]) sizeMap[sizekey] = 1;
        else sizeMap[sizekey]++;
    });
    var aimedWidth = Math.sqrt(totalSize), targetWidth = 0;
    for (var k in sizeMap) {
        var tempWidth = +k.split(",")[0];
        var tempCount = +(aimedWidth / tempWidth).toFixed(0);
        if (tempCount) {
            if (tempCount < 1) tempCount = 1;
            targetWidth = Math.max(tempCount * tempWidth, targetWidth);
        }
    }
    var offsetMap = {
    };
    var totalHeight = 0;
    for (var k in sizeMap) {
        var [tempWidth, tempHeight] = k.split(",");
        var tempCount = +(targetWidth / tempWidth);
        var tempHeight = Math.ceil(sizeMap[k] / tempCount) * tempHeight;
        offsetMap[k] = [0, totalHeight];
        if (tempHeight) {
            totalHeight += tempHeight;
        }
    }
    pngcollection.forEach(function (png) {
        var { width, height } = png;
        var sizekey = [width, height].join(",");
        var [offsetLeft, offsetTop] = offsetMap[sizekey];
        png.left = offsetLeft;
        png.top = offsetTop;
        offsetLeft += width;
        if (offsetLeft + width > targetWidth) {
            offsetLeft = 0;
            offsetTop += height;
        }
        offsetMap[sizekey] = [offsetLeft, offsetTop];
    });
    var dest = new PNG({
        width: targetWidth,
        height: totalHeight
    });
    var [maxWidthLength, maxHeightLength, maxNameLength, maxLeftLength, maxTopLength] = [0, 0, 0, 0, 0];
    var padding = function (str, minLength) {
        if (typeof str !== "string") var isReverse = true;;
        str = String(str);
        if (str.length >= minLength) return str;
        if (isReverse) return " ".repeat(minLength - str.length) + str;
        return str + " ".repeat(minLength - str.length);
    };
    pngcollection.forEach(function (png) {
        var { width, height, top, left, cssname } = png;
        maxNameLength = Math.max(String(cssname).length, maxNameLength);
        maxWidthLength = Math.max(String(width).length, maxWidthLength);
        maxHeightLength = Math.max(String(height).length, maxHeightLength);
        maxLeftLength = Math.max(String(-left).length, maxLeftLength);
        maxTopLength = Math.max(String(-top).length, maxTopLength);
        png.bitblt(dest, 0, 0, width, height, left, top);
    });

    var cssdata = pngcollection.map(function (png) {
        return `.png-concat-${padding(png.cssname, maxNameLength)} { width: ${padding(png.width, maxWidthLength)}px; height: ${padding(png.height, maxHeightLength)}px; background-position: ${padding(-png.left, maxLeftLength)}px ${padding(-png.top, maxTopLength)}px }`
    }).join("\r\n");
    var divdata = pngcollection.map(function (png) {
        return `<div class="png-concat-div png-concat-${png.cssname}"></div>`
    }).join("\r\n");
    var filedestname = "png-concat.concat";
    var pngfilename = filedestname + ".png";
    var cssfilename = filedestname + ".css";
    var htmlfilename = filedestname + ".html";
    var htmldata = `<!doctype html>\r\n<html><head><meta charset="utf-8"/><title>png-concat图标查看工具</title><link rel="stylesheet" type='text/css' href="${cssfilename}"/><style>.png-concat-div{background-image:url('${pngfilename}');display:inline-block}</style></head>\r\n<body>\r\n${divdata}\r\n</body></html>`
    dest.pack().pipe(fs.createWriteStream(pngfilename));

    fs.writeFile(cssfilename, cssdata, function (error) {
        if (error) throw new Error("写入css失败！");
        console.log(cssfilename);
    });
    fs.writeFile(htmlfilename, htmldata, function (error) {
        if (error) throw new Error("写入html失败！");
        console.log(htmlfilename);
    });

};
concatpng(process.cwd());