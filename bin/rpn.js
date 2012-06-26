#!/usr/bin/env node
var fs = require("fs");
var rpn = require("rpn");

process.argv.slice(2).forEach(function (file) {
    var input = fs.readFileSync(file);
    var output = rpn.compile(input, {
        originalFilename: file
    }).toStringWithSourceMap({
        file: file.replace(/\.[\w]+$/, ".js.map")
    })
    fs.writeFileSync(file.replace(/\.[\w]+$/, ".js"), output.code);
    fs.writeFileSync(file.replace(/\.[\w]+$/, ".js.map"), output.map);
});
