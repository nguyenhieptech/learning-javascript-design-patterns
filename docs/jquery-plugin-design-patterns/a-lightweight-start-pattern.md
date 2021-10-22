---
sidebar_position: 3
---

# 'A Lightweight Start' Pattern

Let’s begin our deeper look at plugin patterns with something basic that follows best practices (including those in the jQuery plugin-authoring guide). This pattern is ideal for developers who are either new to plugin development or who just want to achieve something simple (such as a utility plugin). _A Lightweight Start_ uses the following:

- Common best practices such as a semi-colon placed before the functions invocation (we'll go through why in the comments below)
- `window`, `document`, `undefined` passed in as arguments.
- A basic defaults object.
- A simple plugin constructor for logic related to the initial creation and the assignment of the element to work with.
- Extending the options with defaults.
- A lightweight wrapper around the constructor, which helps to avoid issues such as multiple instantiations.
- Adherence to the jQuery core style guidelines for maximized readability.

```js
/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
(function ($, window, document, undefined) {
  // undefined is used here as the undefined global
  // variable in ECMAScript 3 and is mutable (i.e. it can
  // be changed by someone else). undefined isn't really
  // being passed in so we can ensure that its value is
  // truly undefined. In ES5, undefined can no longer be
  // modified.

  // window and document are passed through as local
  // variables rather than as globals, because this (slightly)
  // quickens the resolution process and can be more
  // efficiently minified (especially when both are
  // regularly referenced in our plugin).

  // Create the defaults once
  var pluginName = 'defaultPluginName',
    defaults = {
      propertyName: 'value',
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;

    // jQuery has an extend method that merges the
    // contents of two or more objects, storing the
    // result in the first object. The first object
    // is generally empty because we don't want to alter
    // the default options for future instances of the plugin
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // We already have access to the DOM element and
    // the options via the instance, e.g. this.element
    // and this.options
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
```

Usage:

```js
$('#elem').defaultPluginName({
  propertyName: 'a custom value',
});
```

## Further Reading

- [Plugins/Authoring](http://docs.jquery.com/Plugins/Authoring), jQuery
- “[Signs of a Poorly Written jQuery Plugin](http://remysharp.com/2010/06/03/signs-of-a-poorly-written-jquery-plugin/),” Remy Sharp
- “[How to Create Your Own jQuery Plugin](https://msdn.microsoft.com/en-us/scriptjunkie/ff608209),” Elijah Manor
- “[Style in jQuery Plugins and Why It Matters](https://msdn.microsoft.com/en-us/scriptjunkie/ff696759),” Ben Almon
- [“Create Your First jQuery Plugin, Part 2](http://enterprisejquery.com/2010/07/create-your-first-jquery-plugin-part-2-revising-your-plugin/),” Andrew Wirick
