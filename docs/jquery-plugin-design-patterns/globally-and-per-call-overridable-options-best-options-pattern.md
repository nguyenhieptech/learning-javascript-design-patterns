---
sidebar_position: 11
---

# Globally And Per-Call Overridable Options (Best Options Pattern)

For our next pattern, we’ll look at an optimal approach to configuring options and defaults for a plugin. The way most of us are probably familiar with defining plugin options is to pass through an object literal of defaults to `$.extend()`, as demonstrated in our basic plugin boilerplate.

If, however, we’re working with a plugin with many customizable options that we would like users to be able to override either globally or on a per-call level, then we can structure things a little more optimally.

Instead, by referring to an options object defined within the plugin namespace explicitly (for example, `$fn.pluginName.options`) and merging this with any options passed through to the plugin when it is initially invoked, users have the option of either passing options through during plugin initialization or overriding options outside of the plugin (as demonstrated here).

```js
/*!
 * jQuery "best options" plugin boilerplate
 * Author: @cowboy
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */

(function ($, window, document, undefined) {
  $.fn.pluginName = function (options) {
    // Here's a best practice for overriding "defaults"
    // with specified options. Note how, rather than a
    // regular defaults object being passed as the second
    // parameter, we instead refer to $.fn.pluginName.options
    // explicitly, merging it with the options passed directly
    // to the plugin. This allows us to override options both
    // globally and on a per-call level.

    options = $.extend({}, $.fn.pluginName.options, options);

    return this.each(function () {
      var elem = $(this);
    });
  };

  // Globally overriding options
  // Here are our publicly accessible default plugin options
  // that are available in case the user doesn't pass in all
  // of the values expected. The user is given a default
  // experience but can also override the values as necessary.
  // e.g. $fn.pluginName.key ="otherval";

  $.fn.pluginName.options = {
    key: 'value',
    myMethod: function (elem, param) {},
  };
})(jQuery, window, document);
```

Usage:

```js
$('#elem').pluginName({
  key: 'foobar',
});
```

## Further Reading

- [jQuery Pluginization](http://benalman.com/talks/jquery-pluginization.html) and the [accompanying gist](https://gist.github.com/472783/e8bf47340413129a8abe5fac55c83336efb5d4e1), Ben Alman
