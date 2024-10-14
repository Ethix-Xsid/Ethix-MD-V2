// Copyright 2011 Lukasz Mielicki <mielicki@gmail.com>.
// All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
  @fileoverview Closure library wrapper for node.js.

  To apply closure to global object:

    require.('closure').Closure(global);

  To create separate instance of closure

    var goog = require.('closure').Closure();

  By default closure library base.js is expected to be found in
  ./closure-library/closure/goog/, to override this, say:

    var goog =
      require.('closure').Closure({CLOSURE_BASE_PATH: 'closure/goog/'});

  To fetch additional closure dependencies:

    goog.loadScript('my_deps.js');

  To easily access other namespaces than goog either apply closure to
  global object or provide own global object, i.e.

    var root = {};
    require.('closure').Closure(root);
    //root.goog is goog namespace
    //root.soy is soy namespace

  Enjoy!

*/
var vm = require('vm');
var fs = require('fs');
var assert = require('assert').ok;
var path = require('path');


/**
  Closure library constructor.
  @param {Object=} opt_goog_global Optional object to be used as closure
      global object.
  @return {Object} goog namespace object.
*/
exports.Closure = function(opt_goog_global) {

  /**
    Internal closure global object.
    @private
  */
  var goog_ = opt_goog_global || {};

  // Apply closure library required settings.
  set_defaults(goog_, {
    CLOSURE_BASE_PATH: 'closure-library/closure/goog/',
    CLOSURE_IMPORT_SCRIPT: load_script,
    goog: {},
    window: {
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
      console: console
    },
    /**
      execScript replacement
    */
    execScript: function(code) {
      exec_script(code, 'execScript');
      return null;
    }
  });

  /**
    Extends goog with loadScript (goog.importScript_ could be used instead,
    but it's not part of API). Useful for loading dependency files.
  */
  goog_.goog.loadScript = load_script;

  /**
    Loads a closure script (CLOSURE_IMPORT_SCRIPT).
    @param {string} filename The file to be loaded and executed.
    @return {boolean} Always returns true.
    @private
  */
  function load_script(filename) {
    var code = fs.readFileSync(  path.normalize( filename ), 'utf8');
    exec_script(code, filename);
    return true;
  }

  /**
    Executes given code in global scope or in a nifty wrapper providing
    direct access to all global names, i.e.

      (function(){with(this){ CODE }});

    This is necassary to run closure scripts in same execution context while
    having distinct global object.
    @param {String} code Code to execute in closure global scope.
    @param {String=} opt_filename Source file path to provide reference
        in error messages.
    @private
  */
  function exec_script(code, opt_filename) {
    if (goog_ === global) {
      // Run directly in global scope in case global object is used.
      vm.runInThisContext(code, opt_filename);
    } else {
      // Use wrapper.
      var wrapper = '(function(){with(this){' + code + '\n}});';
      var fn = vm.runInThisContext(wrapper, opt_filename);
      fn.call(goog_);
    }
  }

  /**
    Applay defaults to target object if not yet there.
    @param {Object} target Object to be extended.
    @param {Object} defaults Source object.
    @private
  */
  function set_defaults(target, defaults) {
    for (var attr in defaults) {
      if (target[attr] === undefined) {
        target[attr] = defaults[attr];
      }
    }
  }

  // Load base.js
  var basepath = goog_.CLOSURE_BASE_PATH;
  assert(basepath.slice(-1) === path.sep, "CLOSURE_BASE_PATH must end with '" + path.sep + "'");

  load_script(basepath + 'base.js');

  return goog_.goog;
};
