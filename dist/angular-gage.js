/**
 * angular-gage
 * @version v0.1.0 - 2015-06-13
 * @author Francesco Pontillo (francescopontillo@gmail.com)
 * @link https://github.com/frapontillo/angular-gage
 * @license Apache-2.0
**/

'use strict';
// Source: dist/.temp/common.js
angular.module('frapontillo.gage', [
  'frapontillo.gage.directives',
  'frapontillo.gage.controllers'
]);
// Source: dist/.temp/controllers/justgage.js
angular.module('frapontillo.gage.controllers', []).controller('justgageCtrl', [
  '$scope',
  '$filter',
  function ($scope, $filter) {
    var self = this;
    /*
     * Collection of functions to override the default transformation of JustGage parameter options.
     * Each function should return a value acceptable as a JustGage parameter.
     */
    self.getOptionValueOverrides = {
      customSectors: angular.fromJson,
      levelColors: angular.fromJson,
      textRenderer: function (originalFunction) {
        if (!originalFunction) {
          return undefined;
        }
        if (angular.isFunction(originalFunction)) {
          return originalFunction();
        }
        return originalFunction;
      }
    };
    /**
     * Transform the string-like option value into a real option that can be passed to JustGage.
     * The option name is used to check if there is any override transform function that can be used instead
     * of this function's default implementation.
     * @param {object} name - The name of the option to transform.
     * @param {object} value - The value to transform.
     * @returns {object} - The transformed value.
     */
    self.getOptionValue = function (name, value) {
      var overrideFunction = self.getOptionValueOverrides[name];
      if (overrideFunction) {
        return overrideFunction(value);
      }
      if (value === '') {
        return undefined;
      }
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      return value;
    };
    /**
     * Get all option names from the scope, excluding the ones in the given array.
     * @param {Array|string} exclude - String or Array of strings containing the names to exclude from the result.
     * @returns {Array} - Strings of the valid option names.
     */
    self.getOptionsNames = function (exclude) {
      var optionsNames = [];
      var exclusionArray = exclude || [];
      // Transform the basic object into an array
      if (angular.isDefined(exclude) && !angular.isArray(exclude)) {
        exclusionArray = [exclude];
      }
      // Add the name to the returning array iif it's not 'this', it doesn't start with a '$' and it is not excluded
      angular.forEach($scope, function (el, key) {
        if (key !== 'this' && key.substring(0, 1) !== '$' && $filter('filter')(exclusionArray, key).length === 0) {
          optionsNames.push(key);
        }
      });
      return optionsNames;
    };
    /**
     * Get all options which have a defined value.
     * @returns {object} - Object of valid options.
     */
    self.getDefinedOptions = function () {
      var options = {};
      var optionNames = self.getOptionsNames();
      angular.forEach(optionNames, function (el) {
        if (el !== 'this' && el.substring(0, 1) !== '$' && $scope[el]) {
          options[el] = self.getOptionValue(el, $scope[el]);
        }
      });
      return options;
    };
  }
]);
// Source: dist/.temp/directives/justgage.js
/* global JustGage:false */
angular.module('frapontillo.gage.directives', ['frapontillo.gage.controllers']).directive('justgage', function () {
  return {
    restrict: 'EAC',
    scope: {
      title: '@',
      titleFontColor: '@',
      value: '@',
      valueFontColor: '@',
      width: '@',
      height: '@',
      relativeGaugeSize: '@',
      min: '@',
      max: '@',
      valueMinFontSize: '@',
      titleMinFontSize: '@',
      labelMinFontSize: '@',
      minLabelMinFontSize: '@',
      maxLabelMinFontSize: '@',
      hideValue: '@',
      hideMinMax: '@',
      hideInnerShadow: '@',
      gaugeWidthScale: '@',
      gaugeColor: '@',
      showInnerShadow: '@',
      shadowOpacity: '@',
      shadowSize: '@',
      shadowVerticalOffset: '@',
      levelColors: '@',
      customSectors: '@',
      noGradient: '@',
      label: '@',
      labelFontColor: '@',
      startAnimationTime: '@',
      startAnimationType: '@',
      refreshAnimationTime: '@',
      refreshAnimationType: '@',
      donut: '@',
      donutStartAngle: '@',
      counter: '@',
      decimals: '@',
      symbol: '@',
      formatNumber: '@',
      humanFriendly: '@',
      humanFriendlyDecimal: '@',
      textRenderer: '&'
    },
    controller: 'justgageCtrl',
    link: function (scope, element, attrs, justgageCtrl) {
      var justgage, watchers = [];
      /**
           * Bind the `value` property on the scope in order to refresh the JustGage when it changes.
           */
      var bindValue = function () {
        watchers.push(scope.$watch('value', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            justgage.refresh(newValue, scope.max);
          }
        }));
        watchers.push(scope.$watch('max', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            justgage.refresh(scope.value, newValue);
          }
        }));
      };
      /**
           * Bind all scope paramenters other than `value` and `textRenderer` and re-creates the JustGage whenever
           * one of them changes.
           */
      var bindOtherOptions = function () {
        var otherOptionsNames = justgageCtrl.getOptionsNames([
            'value',
            'max'
          ]);
        // TODO: move to angularjs 1.3 and replace with $watchGroup
        angular.forEach(otherOptionsNames, function (name) {
          watchers.push(scope.$watch(name, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              init();
            }
          }));
        });
      };
      /**
           * Initialize the JustGage element with the given non-undefined options on the scope.
           * It also binds the scope values to appropriate changes
           */
      var init = function () {
        var justgageOptions = { parentNode: element[0] };
        angular.extend(justgageOptions, justgageCtrl.getDefinedOptions());
        // Remove existing canvas from DOM (if any)
        if (justgage) {
          var canvasDom = justgage.canvas.canvas;
          canvasDom.parentNode.removeChild(canvasDom);
        }
        // Clear existing watcher (see http://stackoverflow.com/a/17306971 why while & pop)
        while (watchers.length > 0) {
          var watcher = watchers.pop();
          watcher();
        }
        // rebuild the gage
        justgage = new JustGage(justgageOptions);
        // Bind scope changes to element methods
        bindValue();
        bindOtherOptions();
      };
      // Initialize everything on the next $digest cycle
      init();
    }
  };
});