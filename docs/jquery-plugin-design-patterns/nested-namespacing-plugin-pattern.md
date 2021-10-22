---
sidebar_position: 5
---

# Nested Namespacing Plugin Pattern

As we've previously covered in the book, namespacing our code is a way to avoid collisions with other objects and variables in the global namespace. They’re important because we want to safeguard our plugin from breaking in the event that another script on the page uses the same variable or plugin names as ours. As a good citizen of the global namespace, we must also do our best not to prevent other developers scripts from executing because of the same issues.

JavaScript doesn't really have built-in support for namespaces as other languages do, but it does have objects that can be used to achieve a similar effect. Employing a top-level object as the name of our namespace, we can easily check for the existence of another object on the page with the same name. If such an object does not exist, then we define it; if it does exist, then we simply extend it with our plugin.

Objects (or, rather, object literals) can be used to create nested namespaces, such as `namespace.subnamespace.pluginName` and so on. But to keep things simple, the namespacing boilerplate below should show us everything we need to get started with these concepts.

```js
/*!
 * jQuery namespaced "Starter" plugin boilerplate
 * Author: @dougneiner
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */

(function ($) {
  if (!$.myNamespace) {
    $.myNamespace = {};
  }

  $.myNamespace.myPluginName = function (el, myFunctionParam, options) {
    // To avoid scope issues, use "base" instead of "this"
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;

    // Add a reverse reference to the DOM object
    base.$el.data('myNamespace.myPluginName', base);

    base.init = function () {
      base.myFunctionParam = myFunctionParam;

      base.options = $.extend({}, $.myNamespace.myPluginName.defaultOptions, options);

      // Put our initialization code here
    };

    // Sample Function, Uncomment to use
    // base.functionName = function( parameters ){
    //
    // };
    // Run initializer
    base.init();
  };

  $.myNamespace.myPluginName.defaultOptions = {
    myDefaultValue: '',
  };

  $.fn.mynamespace_myPluginName = function (myFunctionParam, options) {
    return this.each(function () {
      new $.myNamespace.myPluginName(this, myFunctionParam, options);
    });
  };
})(jQuery);
```

Usage:

```js
$('#elem').mynamespace_myPluginName({
  myDefaultValue: 'foobar',
});
```

## Further Reading

- “[Namespacing in JavaScript](https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/),” Angus Croll
- “[Use Your $.fn jQuery Namespace](http://ryanflorence.com/use-your-fn-jquery-namespace/),” Ryan Florence
- “[JavaScript Namespacing](http://michaux.ca/articles/javascript-namespacing),” Peter Michaux
- “[Modules and namespaces in JavaScript](http://www.2ality.com/2011/04/modules-and-namespaces-in-javascript.html),” Axel Rauschmayer
