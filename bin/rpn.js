#!/usr/bin/env node
var fs = require("fs");
var rpn = require("rpn");

process.argv.slice(2).forEach(function (sourceFilename) {
    
    var codeFilename   = sourceFilename.replace(/\.[\w]+$/, ".js");   
    var mapFilename    = codeFilename + ".map");    
    
    var input          = fs.readFileSync(sourceFilename);
    var rootSourceNode = rpn.compile(input, {originalFilename: sourceFilename});
    var output         = rootSourceNode.toStringWithSourceMap({ file: mapFilename});

    fs.writeFileSync(codeFilename, output.code + "\n//@ sourceMappingURL=" + mapFilename);
    fs.writeFileSync(mapFilename,  output.map);
    
});
