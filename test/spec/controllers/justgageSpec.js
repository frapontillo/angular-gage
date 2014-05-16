'use strict';

describe('Controller: justgageCtrl', function () {

  // load the controller's module
  beforeEach(module('frapontillo.gage.controllers'));

  var justgageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    justgageCtrl = $controller('justgageCtrl', {
      $scope: scope
    });
  }));

  describe('Handling of default and custom parameter transformations', function () {

    it('should attach a map of custom parameter transformation functions to the scope', function () {
      expect(typeof justgageCtrl.getOptionValueOverrides).toBe('object');
    });

    it('should transform some regular parameter to boolean', function () {
      expect(justgageCtrl.getOptionValue('something', 'true')).toBeTruthy();
      expect(justgageCtrl.getOptionValue('something', 'false')).toBeFalsy();
    });

    it('should transform some regular parameter to undefined', function () {
      expect(justgageCtrl.getOptionValue('something', '')).toBeUndefined();
    });

    it('should not transform some regular parameter', function () {
      expect(justgageCtrl.getOptionValue('something', 'some value')).toBe('some value');
    });

    it('should transform sectors from string to array', function () {
      var customSectors = justgageCtrl.getOptionValue('customSectors',
        '[{"lo":0,"hi":1,"color":"green"},{"lo":1,"hi":2,"color":"yellow"},{"lo":2,"hi":3,"color":"red"}]');
      expect(typeof customSectors).toBe('object');
      expect(customSectors.length).toBe(3);
    });

    it('should transform level colors from string to array', function () {
      var levelColors = justgageCtrl.getOptionValue('levelColors', '["green","yellow","red"]');
      expect(typeof levelColors).toBe('object');
      expect(levelColors.length).toBe(3);
    });

    it('should transform the value into "test"', function () {
      scope.value = 1337;
      scope.$apply();
      var transFn = function () {
        return 'test';
      };
      var textRenderer = justgageCtrl.getOptionValue('textRenderer', transFn);
      var newValue = textRenderer();
      expect(newValue).toBe('test');
    });

    it('should not transform the value', function () {
      scope.value = 1337;
      scope.$apply();
      var textRenderer = justgageCtrl.getOptionValue('textRenderer', undefined);
      expect(textRenderer).toBeUndefined();
    });
  });

  describe('Retrieval of valid directive scope parameters', function() {

    it('should not return $parent scope', function() {
      expect(scope.$parent).toBeDefined();
      expect(justgageCtrl.getOptionsNames()).not.toContain('$parent');
    });

    it('should not return "this"', function() {
      expect(justgageCtrl.getOptionsNames()).not.toContain('this');
    });

    it('should not return the given "value" variable name', function() {
      scope.value = 1337;
      scope.$apply();
      expect(scope.value).toBeDefined();
      expect(justgageCtrl.getOptionsNames(['value'])).not.toContain('value');
    });

    it('should handle an object as a single element array', function() {
      scope.value = 1337;
      scope.$apply();
      expect(scope.value).toBeDefined();
      expect(justgageCtrl.getOptionsNames('value')).not.toContain('value');
    });

    it('should not return "value" nor "donut"', function() {
      scope.value = 1337;
      scope.donut = false;
      scope.$apply();
      expect(scope.value).toBeDefined();
      expect(scope.donut).toBeDefined();
      var opts = justgageCtrl.getOptionsNames(['value', 'donut']);
      expect(opts).toNotContain('value');
      expect(opts).toNotContain('donut');
    });

  });

  describe('Retrieval of defined options only', function() {

    it('should return an empty object', function() {
      expect(justgageCtrl.getDefinedOptions()).toEqual({});
    });

    it('should return only the "value"', function() {
      scope.value = 1337;
      scope.$apply();
      expect(justgageCtrl.getDefinedOptions()).toEqual({value:1337});
    });

    it('should return the "value" and the "title"', function() {
      var expScope = {value:1337, title:'This is a test'};
      scope.value = expScope.value;
      scope.title = expScope.title;
      scope.$apply();
      expect(justgageCtrl.getDefinedOptions()).toEqual(expScope);
    });

  });

});
