/* global JustGage:false */
'use strict';

angular.module('frapontillo.gage.directives', ['frapontillo.gage.controllers'])
  .directive('justgage',
    function () {
      return {
        restrict: 'EAC',
        scope: {
          title: '@',                       // gauge title text
          titleFontColor: '@',              // title text color
          titleFontFamily: '@',             // title text font-family
          titlePosition: '@',               // title position, "above" or "below"

          value: '@',                       // value to show
          valueFontColor: '@',              // color of value text
          valueFontFamily: '@',             // font-family of value text

          width: '@',                       // gauge width
          height: '@',                      // gauge height
          relativeGaugeSize: '@',           // true if the gauge has to grow with the container

          min: '@',                         // minimum value
          max: '@',                         // maximum value

          valueMinFontSize: '@',            // absolute minimum font size for the value
          titleMinFontSize: '@',            // absolute minimum font size for the title
          labelMinFontSize: '@',            // absolute minimum font size for the label
          minLabelMinFontSize: '@',         // absolute minimum font size for the minimum label
          maxLabelMinFontSize: '@',         // absolute minimum font size for the maximum label

          hideValue: '@',                   // hide value text
          hideMinMax: '@',                  // hide min and max values
          hideInnerShadow: '@',             // hide inner shadow

          gaugeWidthScale: '@',             // width of the gauge element
          gaugeColor: '@',                  // background color of gauge element

          showInnerShadow: '@',             // true to display inner shadow
          shadowOpacity: '@',               // shadow opacity, values 0 ~ 1
          shadowSize: '@',                  // inner shadow size
          shadowVerticalOffset: '@',        // how much is shadow offset from top

          levelColors: '@',                 // array of strings, colors of indicator, from lower to upper, in hex format
          customSectors: '@',               // Array of objects with color, hi, lo attributes
          noGradient: '@',                  // true to use sector-based color change, false to use gradual color change

          label: '@',                       // text to show below value
          labelFontColor: '@',              // color of label under the value

          startAnimationTime: '@',          // length of initial load animation
          startAnimationType: '@',          // type of initial animation (linear, >, <, <>, bounce)
          refreshAnimationTime: '@',        // length of refresh animation
          refreshAnimationType: '@',        // type of refresh animation (linear, >, <, <>, bounce)

          donut: '@',                       // Turn the gauge into a full circle donut
          donutStartAngle: '@',             // angle to start from when in donut mode

          reverse: '@',                     // Reverse the direction of the gauge
          counter: '@',                     // Increase numbers one by one
          decimals: '@',                    // Quantity of decimal numbers to show
          symbol: '@',                      // Unit of measure that will be appended to value
          formatNumber: '@',                // Whether to format numbers
          humanFriendly: '@',               // true to show shorthand big numbers (300K instead of 300XXX)
          humanFriendlyDecimal: '@',        // number of decimal places for our human friendly number to contain

          textRenderer: '&',                 // function applied before rendering text
          watchViewPort: '@'                 // Watch for the element going out of the viewport/being hidden - redraw to prevent UI issues
        },
        controller: 'justgageCtrl',
        link: function (scope, element, attrs, justgageCtrl) {
          var justgage,
              watchers = [];

          // used to determine whether the justgage element is in the viewport or not.
          function isElementInViewPort() {
            var rect = element[0].getBoundingClientRect();
            
            return (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
          }

          // helper functions to destroy/rebuild justgage
          // used outside of init() now, since we have to do this when the gage is brought back into view
          var destroyJustgage = function() {
            if (justgage) {
              var canvasDom = justgage.canvas.canvas;
              canvasDom.parentNode.removeChild(canvasDom);
              justgage = null;
            }
          };
          
          var rebuildJustgage = function() {
            destroyJustgage();
            var justgageOptions = { parentNode: element[0] };
            angular.extend(justgageOptions, justgageCtrl.getDefinedOptions());
            justgage = new JustGage(justgageOptions);
          };
 
          // get rid of the justgage when we're done
          scope.$on('$destroy', destroyJustgage);

          /**
           * Bind the `value` property on the scope in order to refresh the JustGage when it changes.
           */
          var bindValue = function() {
            watchers.push(scope.$watch('value', function(newValue, oldValue) {
              if (newValue !== oldValue) {
                justgage.refresh(newValue, scope.max);
              }
            }));
            watchers.push(scope.$watch('max', function(newValue, oldValue) {
              if (newValue !== oldValue) {
                justgage.refresh(scope.value, newValue);
              }
            }));
            
            // will fire only if the attribute 'watch-view-port' is set to true
            // if fired, justgage element is brought back into view
            // if something slides it off the screen or sets ng-show/hide this will ensure the justgage is redrawn and animated properly
            if (justgageCtrl.getOptionValue('watchViewPort', scope.watchViewPort) === true) {
              watchers.push(scope.$watch(isElementInViewPort, function (newValue) {
                if (newValue) {
                  rebuildJustgage();
                }
              }));
            }
          };

          /**
           * Bind all scope paramenters other than `value` and `textRenderer` and re-creates the JustGage whenever
           * one of them changes.
           */
          var bindOtherOptions = function() {
            var otherOptionsNames = justgageCtrl.getOptionsNames(['value', 'max']);
            // TODO: move to angularjs 1.3 and replace with $watchGroup
            angular.forEach(otherOptionsNames, function (name) {
              watchers.push(scope.$watch(name, function(newValue, oldValue) {
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
          var init = function() {
            // Clear existing watcher (see http://stackoverflow.com/a/17306971 why while & pop)
            while (watchers.length > 0) {
              var watcher = watchers.pop();
              watcher();
            }
            
            // will destroy if exists and build it.
            rebuildJustgage();

            // Bind scope changes to element methods
            bindValue();
            bindOtherOptions();
          };

          // Initialize everything on the next $digest cycle
          init();
        }
      };
    }
  );
