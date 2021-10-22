---
sidebar_position: 12
---

# A Highly Configurable And Mutable Plugin Pattern

In this pattern, similar to Alex Sexton's prototypal inheritance plugin pattern, logic for our plugin isn’t nested in a jQuery plugin itself. We instead define our plugin logic using a constructor and an object literal defined on its prototype. jQuery is then used for the actual instantiation of the plugin object.

Customization is taken to the next level by employing two little tricks, one of which we’ve seen in previous patterns:

- Options can be overridden both globally and per collection of elements/
- Options can be customized on a **per-element** level through HTML5 data attributes (as shown below). This facilitates plugin behavior that can be applied to a collection of elements but then customized inline without the need to instantiate each element with a different default value.

We don’t see the latter option in the wild too often, but it can be a significantly cleaner solution (as long as we don’t mind the inline approach). If wondering where this could be useful, imagine writing a draggable plugin for a large set of elements. We could go about customizing their options as follows:

```js
$('.item-a').draggable({ defaultPosition: 'top-left' });
$('.item-b').draggable({ defaultPosition: 'bottom-right' });
$('.item-c').draggable({ defaultPosition: 'bottom-left' });
//etc
```

But using our patterns inline approach, the following would be possible:

```js
$('.items').draggable();
```

```html
<li class="item" data-plugin-options="{"defaultPosition":"top-left"}"></div>
<li class="item" data-plugin-options="{"defaultPosition":"bottom-left"}"></div>
```

And so on. We may well have a preference for one of these approaches, but it is just another variation worth being aware of.

```js
/*
 * "Highly configurable" mutable plugin boilerplate
 * Author: @markdalgleish
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// Note that with this pattern, as per Alex Sexton's, the plugin logic
// hasn't been nested in a jQuery plugin. Instead, we just use
// jQuery for its instantiation.

(function ($, window, document, undefined) {
  // our plugin constructor
  var Plugin = function (elem, options) {
    this.elem = elem;
    this.$elem = $(elem);
    this.options = options;

    // This next line takes advantage of HTML5 data attributes
    // to support customization of the plugin on a per-element
    // basis. For example,
    // <div class="item" data-plugin-options="{'message':'Goodbye World!'}"></div>
    this.metadata = this.$elem.data('plugin-options');
  };

  // the plugin prototype
  Plugin.prototype = {
    defaults: {
      message: 'Hello world!',
    },

    init: function () {
      // Introduce defaults that can be extended either
      // globally or using an object literal.
      this.config = $.extend({}, this.defaults, this.options, this.metadata);

      // Sample usage:
      // Set the message per instance:
      // $( "#elem" ).plugin( { message: "Goodbye World!"} );
      // or
      // var p = new Plugin( document.getElementById( "elem" ),
      // { message: "Goodbye World!"}).init()
      // or, set the global default message:
      // Plugin.defaults.message = "Goodbye World!"

      this.sampleMethod();
      return this;
    },

    sampleMethod: function () {
      // e.g. show the currently configured message
      // console.log(this.config.message);
    },
  };

  Plugin.defaults = Plugin.prototype.defaults;

  $.fn.plugin = function (options) {
    return this.each(function () {
      new Plugin(this, options).init();
    });
  };

  // optional: window.Plugin = Plugin;
})(jQuery, window, document);
```

Usage:

```js
$('#elem').plugin({
  message: 'foobar',
});
```

## Further Reading

- “[Creating Highly Configurable jQuery Plugins](http://markdalgleish.com/2011/05/creating-highly-configurable-jquery-plugins/),” Mark Dalgleish
- “[Writing Highly Configurable jQuery Plugins, Part 2](http://markdalgleish.com/2011/09/html5data-creating-highly-configurable-jquery-plugins-part-2/),” Mark Dalgleish
