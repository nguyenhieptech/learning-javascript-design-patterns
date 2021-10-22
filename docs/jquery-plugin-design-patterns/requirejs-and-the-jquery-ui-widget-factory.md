---
sidebar_position: 10
---

# RequireJS And The jQuery UI Widget Factory

As we covered in the section on _Modern Module Design Patterns_, RequireJS is an AMD-compatible script loader that provides a clean solution for encapsulating application logic inside manageable modules.

It’s able to load modules in the correct order (through its order plugin), simplifies the process of combining scripts via its excellent r.js optimizer and provides the means for defining dynamic dependencies on a per-module basis.

In the boilerplate pattern below, we demonstrate how an AMD (and thus RequireJS) compatible jQuery UI widget can be defined that does the following:

- Allows the definition of widget module dependencies, building on top of the previous jQuery UI Widget Factory pattern presented earlier.
- Demonstrates one approach to passing in HTML template assets for creating templated widgets (using Underscore.js micro-templating).
- Includes a quick tip on adjustments that we can make to our widget module if we wish to later pass it through to the RequireJS optimizer.

```js
/*!
 * jQuery UI Widget + RequireJS module boilerplate (for 1.8/9+)
 * Authors: @jrburke, @addyosmani
 * Licensed under the MIT license
 */

// Note from James:
//
// This assumes we are using the RequireJS+jQuery file, and
// that the following files are all in the same directory:
//
// - require-jquery.js
// - jquery-ui.custom.min.js (custom jQuery UI build with widget factory)
// - templates/
// - asset.html
// - ao.myWidget.js

// Then we can construct the widget as follows:

// ao.myWidget.js file:
define('ao.myWidget', [
  'jquery',
  'text!templates/asset.html',
  'underscore',
  'jquery-ui.custom.min',
], function ($, assetHtml, _) {
  // define our widget under a namespace of our choice
  // "ao" is used here as a demonstration
  $.widget('ao.myWidget', {
    // Options to be used as defaults
    options: {},

    // Set up widget (e.g. create element, apply theming,
    // bind events, etc.)
    _create: function () {
      // _create will automatically run the first time
      // this widget is called. Put the initial widget
      // set-up code here, then we can access the element
      // on which the widget was called via this.element.
      // The options defined above can be accessed via
      // this.options
      // this.element.addStuff();
      // this.element.addStuff();
      // We can then use Underscore templating with
      // with the assetHtml that has been pulled in
      // var template = _.template( assetHtml );
      // this.content.append( template({}) );
    },

    // Destroy an instantiated plugin and clean up modifications
    // that the widget has made to the DOM
    destroy: function () {
      // this.element.removeStuff();
      // For UI 1.8, destroy must be invoked from the base
      // widget
      $.Widget.prototype.destroy.call(this);
      // For UI 1.9, define _destroy instead and don't worry
      // about calling the base widget
    },

    methodB: function (event) {
      // _trigger dispatches callbacks the plugin user can
      // subscribe to
      // signature: _trigger( "callbackName", [eventObject],
      // [uiObject] )
      this._trigger('methodA', event, {
        key: value,
      });
    },

    methodA: function (event) {
      this._trigger('dataChanged', event, {
        key: value,
      });
    },

    // Respond to any changes the user makes to the option method
    _setOption: function (key, value) {
      switch (key) {
        case 'someValue':
          // this.options.someValue = doSomethingWith( value );
          break;
        default:
          // this.options[ key ] = value;
          break;
      }

      // For UI 1.8, _setOption must be manually invoked from
      // the base widget
      $.Widget.prototype._setOption.apply(this, arguments);
      // For UI 1.9 the _super method can be used instead
      // this._super( "_setOption", key, value );
    },
  });
});
```

Usage:

index.html:

```html
<script
  data-main="scripts/main"
  src="http://requirejs.org/docs/release/1.0.1/minified/require.js"
></script>
```

main.js

```js
require({
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
    jqueryui: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min',
    boilerplate: '../patterns/jquery.widget-factory.requirejs.boilerplate',
  },
}, ['require', 'jquery', 'jqueryui', 'boilerplate'], function (req, $) {
  $(function () {
    var instance = $('#elem').myWidget();
    instance.myWidget('methodB');
  });
});
```

## Further Reading

- “[Fast Modular Code With jQuery and RequireJS](http://speakerrate.com/talks/2983-fast-modular-code-with-jquery-and-requirejs),” James Burke
- “[jQuery’s Best Friends](http://jquerysbestfriends.com/#slide1),” Alex Sexton
- “[Managing Dependencies With RequireJS](http://www.angrycoding.com/2011/09/managing-dependencies-with-requirejs.html),” Ruslan Matveev
