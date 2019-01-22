# Screen Size Debugger

### Installation
Simply add a script tag to your page. Default parameters will attach the elements to the DOM and position it fixed in the bottom right corner.

If you don't rename the file and leave it as `screen-size-debugger.min.js`, it is capable of initializing itself and parsing data attributes off the tag for init.

### Options
  * data-attach="false" (`Default = true`)
	* By default the element will be created and attached to the DOM. If you wish to attach it yourself elsewhere, the instance can be found on `window.ScreenSizeDebugger.default` using the `el` and `styleEl` subprops
  * data-always-visible="true" (`Default = false`)
    * This will cause the screen dimensions to always be visible, no hover required
  * data-framework="{width: ['XL', 1200, 'LG', 992, 'MD', 768, 'SM', 0]}" (`Default`)
    * Override the screen dimensions the library uses to calculate current environment. Each definition is 2 elements of the array, first a description string, and secondly a number of pixels required to satisfy it. Please define the array in descending order.
  * data-style-{CSS_NAME}
    * Any valid css name can be appended to `data-style-` to have it applied to the DOM element used by this library