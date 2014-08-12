# ambient.js - Width

The `width` plugin watches the window resize events and enables/disables global styles based on the current value. This can be used for responsive web design. It can optionally implement additional styles at certain increments within an active style. These are called bendpoints and they give you the ability to make micro style adjustments within the context of a larger breakpoint.

`width` also supports "mobile first" paradigms (or desktop first) by adding  ___stylename___-gte and ___stylename___-lte styles. GTE and LTE stand for "greater than equal to" and "less than equal to" and they are used to allow certain styles to be inherited in either direction.

## Download
- [Development](https://raw.githubusercontent.com/amwmedia/ambient.js/master/src/plugins/ambient-width.js)
- [Minified](https://raw.githubusercontent.com/amwmedia/ambient.js/master/src/plugins/ambient-width.min.js)

## Options
- __min__ (int) [_optional_]: minimum pixel width at which this style becomes active
- __max__ (int) [_optional_]: maximum pixel width at which this style will remain active
- __bend__ (int) [_optional_]: number of pixels between bendpoints

## Example
``` javascript
ambient.init({
    'mobile': { // the class we want
        width: { // the plugin we are using
            max: 640, // active from 0 - 639
            bend: 100 // add another bendpoint every 100px
        }
    },
    'tablet': { // the class we want
        width: { // the plugin we are using
            min: 640, // kick in at 640
            max: 768, // active from 640 - 767
            bend: 100 // add another bendpoint every 100px
        }
    }
});
```