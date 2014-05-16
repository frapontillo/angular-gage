'use strict';

describe('Directive: justgage', function () {

  var originalElement = '<div justgage title="{{title}}" title-font-color="{{titleFontColor}}" ' +
    'value="{{value}}" value-font-color="{{valueFontColor}}" width="{{width}}" height="{{height}}" ' +
    'relative-gauge-size="{{relativeGaugeSize}}" value-min-font-size="{{valueMinFontSize}}" ' +
    'title-min-font-size="{{titleMinFontSize}}" label-min-font-size="{{labelMinFontSize}}" ' +
    'min-label-min-font-size="{{minLabelMinFontSize}}" maxLabelMinFontSize="{{maxLabelMinFontSize}}" ' +
    'min="{{min}}" max="{{max}}" hide-min-max="{{hideMinMax}}" hide-value="{{hideValue}}" ' +
    'hide-inner-shadow="{{hideInnerShadow}}" gauge-width-scale="{{gaugeWidthScale}}" ' +
    'gauge-color="{{gaugeColor}}" show-inner-shadow="{{showInnerShadow}}" shadow-opacity="{{shadowOpacity}}" ' +
    'shadow-size="{{shadowSize}}" shadow-vertical-offset="{{shadowVerticalOffset}}" level-colors="{{levelColors}}" ' +
    'custom-sectors="{{customSectors}}" no-gradient="{{noGradient}}" label="{{label}}" ' +
    'label-font-color="{{labelFontColor}}" start-animation-time="{{startAnimationTime}}" ' +
    'start-animation-type="{{startAnimationType}}" refresh-animation-time="{{refreshAnimationTime}}" ' +
    'refresh-animation-type="{{refreshAnimationType}}" donut="{{donut}}" donut-start-angle="{{donutStartAngle}}" ' +
    'counter="{{counter}}" decimals="{{decimals}}" symbol="{{symbol}}" format-number="{{formatNumber}}" ' +
    'human-friendly="{{humanFriendly}}" human-friendly-decimal="{{humanFriendlyDecimal}}" ' +
    'text-renderer="textRenderer()"></div>';

  var element;

  beforeEach(module('frapontillo.gage'));

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element(originalElement);
    element = $compile(element)($rootScope)[0];
  }));

  it('should should create a justgage', inject(function($rootScope) {
    expect(element).not.toBe(undefined);
    expect(element.firstChild.localName).toBe('svg');
    expect($rootScope.value).toBeUndefined();
  }));

});
