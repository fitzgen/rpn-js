#!/usr/bin/env node
var fs = require("fs");
var rpn = require("rpn");

process.argv.slice(2).forEach(function (sourceFilename) {
    
    var codeFilename   = sourceFilename.replace(/\.[\w]+$/, ".js");   
    var mapFilename    = codeFilename + ".map";    
    
    var input          = fs.readFileSync(sourceFilename);
    
    var rootSourceNode = rpn.compile(input, {originalFilename: sourceFilename});
    
    // output :: { code :: String, map :: SourceMapGenerator }
    var output         = rootSourceNode.toStringWithSourceMap({ file: mapFilename});

    //We must add the //# sourceMappingURL comment directive 
    //so that the browser’s debugger knows where to find the source map.
    output.code +=  "\n//@ sourceMappingURL=" + mapFilename;
    
    fs.writeFileSync(codeFilename, output.code);
    fs.writeFileSync(mapFilename,  output.map);
    
});
