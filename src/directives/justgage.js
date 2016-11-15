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

      function isElementInViewPort(el) {

          var rect = el.getBoundingClientRect();

          return (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)
              );
      }


      scope.$on("$destroy", function handleDestroyEvent() {
          destroyJustgage();
          //deregister(element);
      });
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
        watchers.push(scope.$watch(function () { return isElementInViewPort(element[0]) }, function (newValue) {
            console.log
            if (newValue) {
                rebuildJustgage();
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
           

        var justgage = null;
        var destroyJustgage = function() {
            if (justgage) {
                var canvasDom = justgage.canvas.canvas;
                canvasDom.parentNode.removeChild(canvasDom);
                justgage = null;
            }
        }
        var rebuildJustgage = function() {
            destroyJustgage();
            var justgageOptions = { parentNode: element[0] };
            angular.extend(justgageOptions, justgageCtrl.getDefinedOptions());
            justgage = new JustGage(justgageOptions);
        }
        
        var init = function () {
            
            // Clear existing watcher (see http://stackoverflow.com/a/17306971 why while & pop)
            while (watchers.length > 0) {
              var watcher = watchers.pop();
              watcher();
            }
            // rebuild the gage
            rebuildJustgage();
            // Bind scope changes to element methods
            bindValue();
            bindOtherOptions();
          };
          // Initialize everything on the next $digest cycle
          init();
        }
    };
});
