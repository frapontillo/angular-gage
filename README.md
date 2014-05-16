angular-gage [![Build Status](https://travis-ci.org/frapontillo/angular-gage.png)](https://travis-ci.org/frapontillo/angular-gage)
===============

AngularJS directive for the [JustGage](http://justgage.com/) gauge.

## Installation

```shell
$ bower install angular-gage
```

## Usage

The directive tag is `justgage`, but you can also use it as an attribute or as a class name. `angular-gage` implements
all of the original JustGage parameters via AngularJS binding:

* `title`, gauge title text
* `titleFontColor`, color of the title text
* `value`, value to show
* `valueFontColor`, color of the value text
* `width`, gauge width
* `height`, gauge height
* `relativeGaugeSize`, true if the gauge has to grow with the container
* `min`, minimum value
* `max`, maximum value
* `valueMinFontSize`, absolute minimum font size for the value
* `titleMinFontSize`, absolute minimum font size for the title
* `labelMinFontSize`, absolute minimum font size for the label
* `minLabelMinFontSize`, absolute minimum font size for the minimum label
* `maxLabelMinFontSize`, absolute minimum font size for the maximum label
* `hideValue`, hide value text
* `hideMinMax`, hide min and max values
* `hideInnerShadow`, hide inner shadow
* `gaugeWidthScale`, width of the gauge element
* `gaugeColor`, background color of gauge element
* `showInnerShadow`, true to display inner shadow
* `shadowOpacity`, shadow opacity, values 0 ~ 1
* `shadowSize`, inner shadow size
* `shadowVerticalOffset`, how much is shadow offset from top
* `levelColors`, array of strings, colors of indicator, from lower to upper, in hex format
* `customSectors`, array of objects with color, hi, lo attributes
* `noGradient`, true to use sector-based color change, false to use gradual color change
* `label`, text to show below value
* `labelFontColor`, color of label under the value
* `startAnimationTime`, length of initial load animation
* `startAnimationType`, type of initial animation (linear, >, <, <>, bounce)
* `refreshAnimationTime`, length of refresh animation
* `refreshAnimationType` type of refresh animation (linear, >, <, <>, bounce)
* `donut`, turn the gauge into a full circle donut
* `donutStartAngle`, angle to start from when in donut mode
* `counter`, increase numbers one by one
* `decimals`, quantity of decimal numbers to show
* `symbol`, unit of measure that will be appended to value
* `formatNumber`, whether to format numbers
* `humanFriendly`, true to show shorthand big numbers (300K instead of 300XXX)
* `humanFriendlyDecimal`, number of decimal places for our human friendly number to contain
* `textRenderer`, function applied before rendering text

When parameters are not set or they are `undefined`, the behavior of JustGage is to assume they are not set; therefore,
the default values will be loaded.

You can check out the demo at `demo/index.html`.

## Development

To build your own version, use `grunt`:

```shell
$ npm install -g grunt-cli bower karma
$ npm install
$ bower install
$ grunt
```

## Contribute

To contribute, please follow the generic [AngularJS Contributing Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md),
with the only exception to send the PR to the `develop` branch instead of `master`.

Before committing and requesting a PR, please make sure that your build succeeds.

##Author

Francesco Pontillo (<mailto:francescopontillo@gmail.com>)

##License

```
   Copyright 2014 Francesco Pontillo

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

```