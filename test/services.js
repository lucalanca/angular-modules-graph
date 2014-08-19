var should = require('should');

describe("factories", function() {
  var angular

  beforeEach(function() {
    angular = require('../src/fake-angular')()
  })

  it('factories with no dependencies should have an empty array', function () {
    function testService () {
      return {
        attr:   "attribute",
        getFoo: function (foo) {},
        getBar: function (bar) {}
      }
    };

    var testService2 = [function testService () {
      return {
        attr:   "attribute",
        getFoo: function (foo) {},
        getBar: function (bar) {}
      }
    }];

    angular
      .module('testModule1', [])
      .factory('testService', testService)
      .factory('testService2', testService2);


    var testModule1 = angular.modulesMap['testModule1'];
    testModule1.services[1].deps.should.be.a.Array;
    testModule1.services[1].deps.should.have.a.lengthOf(0);
    testModule1.services[0].deps.should.be.a.Array;
    testModule1.services[0].deps.should.have.a.lengthOf(0);
  })

  it('property should contain all defined services with variable function definition', function() {
    function testService (dep1) {
      return {
        attr:   "attribute",
        getFoo: function (foo) {},
        getBar: function (bar) {}
      }
    };

    angular
      .module('testModule1', [])
      .factory('testService', testService);

    var testModule1 = angular.modulesMap['testModule1'];
    testModule1.services.should.be.a.Array;
    testModule1.services.should.have.a.lengthOf(1);
    testModule1.services[0].name.should.be.equal('testService');
    testModule1.services[0].deps.should.be.a.Array;
    testModule1.services[0].deps.should.have.a.lengthOf(1);
    testModule1.services[0].deps[0].should.be.equal('dep1');

    testModule1.services[0].api.should.be.a.Array;
    testModule1.services[0].api.indexOf('attr').should.not.be.equal(-1);
    testModule1.services[0].api.indexOf('getFoo').should.not.be.equal(-1);
    testModule1.services[0].api.indexOf('getBar').should.not.be.equal(-1);
  })

  it('should exclude angular dependencies', function () {
    var testService2 = ['$resource', 'dep2', function ($resource, dep2) {
      return {
        attr:   "attribute",
        getFoo: function (foo) {},
        getBar: function (bar) {}
      }
    }];
    function testService ($http, dep1) {
      return {
        attr:   "attribute",
        getFoo: function (foo) {},
        getBar: function (bar) {}
      }
    };

    angular
      .module('testModule1', [])
      .factory('testService', testService)
      .factory('testService2', testService2);

    var testModule1 = angular.modulesMap['testModule1'];
    testModule1.services[0].deps.should.be.a.Array;
    testModule1.services[0].deps.should.have.a.lengthOf(1);
    testModule1.services[0].deps[0].should.be.equal('dep1');

    testModule1.services[1].deps.should.be.a.Array;
    testModule1.services[1].deps.should.have.a.lengthOf(1);
    testModule1.services[1].deps[0].should.be.equal('dep2');

  })
})
