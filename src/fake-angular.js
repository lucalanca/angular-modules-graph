'use strict';

function Module(name, deps) {
  this.name = name
  this.modules = deps
  this.items = []
  this.controllers = [];
  this.services = [];
}

var methods = ['constant', 'controller', 'directive', 'factory', 'filter', 'provider', 'service', 'value']
var globalApis = ['lowercase',
  'uppercase',
  'forEach',
  'extend',
  'identity',
  'noop',
  'isUndefined',
  'isDefined',
  'isObject',
  'isString',
  'isNumber',
  'isDate',
  'isArray',
  'isFunction',
  'isElement',
  'copy',
  'equals',
  'bind',
  'toJson',
  'fromJson',
  'bootstrap',
  'injector',
  'element',
];

methods.forEach(function(method) {
  Module.prototype[method] = function addItem(name) {
    this.items.push(name);
    return this;
  }
})

function angularDepsToStringDeps (angularDeps) {
  var deps, definition, angularDepsStr;
  if (angularDeps instanceof Array) {
    definition = angularDeps.pop();
    deps = angularDeps;
  } else if (angularDeps instanceof Function) {
    definition = angularDeps;
    // We just care about the wrapper function to the dependencies
    angularDepsStr = "" + angularDeps;
    angularDepsStr = angularDepsStr.slice(0, angularDepsStr.indexOf('{'));
    var deps = /\(([^)]+)/.exec(angularDepsStr);
    if (deps && deps.length && deps[1]) {
      deps = deps[1].split(/\s*,\s*/);
    } else {
      deps = [];
    }
  }
  return { deps: deps, definition: definition };
};

Module.prototype.controller = function (name, deps) {
  this.controllers.push({
    'name': name,
    'deps': angularDepsToStringDeps(deps).deps
  });
  this.items.push(name);
  return this;
}

Module.prototype.factory = function (name, deps) {
  var angularDeps = angularDepsToStringDeps(deps);
  this.services.push({
    'name': name,
    'deps': angularDeps.deps,
    'api': Object.keys(
      angularDeps.definition instanceof Function ? angularDeps.definition() : {})
  });
  this.items.push(name);
  return this;
}

Module.prototype.run = function() {
  return this
};
Module.prototype.config = function() {
  return this
};

module.exports = function() {
  var angular = {
    modules: [],
    modulesMap: {},
    modulesNames: [],
    module: function(name, deps) {
      if (this.modulesNames.indexOf(name)>-1){
        if(deps){
          this.modulesMap[name].modules = deps
        }
        return this.modulesMap[name]
      }

      var module = new Module(name,deps)

      this.modulesNames.push(name)
      this.modulesMap[name] = module
      this.modules.push(module)
      return module
    }
  }
  var noop = function(){}
  globalApis.forEach(function(method) {
    angular[method] = noop
  });

  return angular
}
