'use strict';

angular.module('frapontillo.gage.controllers', [])
  .controller('justgageCtrl', function ($scope, $filter) {
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

  });
