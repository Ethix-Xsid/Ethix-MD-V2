var fs = require('fs')
var path = require("path")
var buildModule = require("build-modules")

var buildDirectory = path.join(__dirname,'dist')
if(!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory)
}

var copywrite = '/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/'

console.log('building and minifying...')
build('proto', false, {output: {path:buildDirectory}, header: copywrite})



function build(relativeModulePath, watch, options) {
    var emitter = buildModule(path.join(__dirname, '..', relativeModulePath), {
        watch: watch/*, header: copyright*/, name: options.name, minify: true,
        output: options.output
    })
    emitter.on('done', function() {
       console.log((new Date())+" - Done building "+relativeModulePath+"!")
    })
    emitter.on('error', function(e) {
       console.log(e)
    })
    emitter.on('warning', function(w) {
       console.log(w)
    })
}
