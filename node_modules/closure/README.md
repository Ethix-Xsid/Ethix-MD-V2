# node-closure

Closure library wrapper for node.js.

Enjoy!

## Installation

Just copy `closure.js`, or using npm:

    npm install closure

## Introduction

To use closure library with shared global object (recommended):

    global.CLOSURE_BASE_PATH = 'closure-library/closure/goog/'; // default
    require('closure').Closure(global);

To fetch additional closure dependencies:

    goog.loadScript('my_deps.js');

That's about it.

## Running separate instance of closure library 

You may create isolated instance of closure library with separate global scope:

    var goog = require('closure').Closure();

By default a new global object will be created, but object to be used as library global scope may be provided:

    var root = {};
    require('closure').Closure(root);
    //root.goog is goog namespace
    //root.soy is soy namespace

To just override library location:

    var goog = require('closure').Closure({CLOSURE_BASE_PATH: 'closure/goog/'});
