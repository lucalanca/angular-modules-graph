/*eslint no-unused-expressions: 0, no-unused-vars: 0, no-new-func: 0*/
"use strict";

module.exports = function(scripts, options) {

  var _ = require("lodash");
  var angular = require("./src/fake-angular")(options);

  var window = {
    angular: angular
  };
  _.assign(window, options ? options.window : {}, {
    window: window,
    document: {},
    navigator: {}
  });

  var results = scripts.map(function(content) {
    try {
      (new Function("with (this) {" + content.text + ";}")).call(window);
    } catch (e) {
      return {
        id: content.id,
        error: true,
        exception: e
      };
    }

    return {
      id: content.id,
      error: false
    };
  });

  return {
    angular: angular,
    results: results
  };
};
