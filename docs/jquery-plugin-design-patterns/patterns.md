---
sidebar_position: 2
---

# Patterns

jQuery plugins have few concrete rules, which is one of the reasons for the incredible diversity in how they are implemented across the community. At the most basic level, we can write a plugin simply by adding a new function property to jQuery’s `jQuery.fn` object, as follows:

```js
$.fn.myPluginName = function () {
  // our plugin logic
};
```

This is great for compactness, but the following would be a better foundation to build on:

```js
(function ($) {
  $.fn.myPluginName = function () {
    // our plugin logic
  };
})(jQuery);
```

Here, we’ve wrapped our plugin logic in an anonymous function. To ensure that our use of the $ sign as a shorthand creates no conflicts between jQuery and other JavaScript libraries, we simply pass it to this closure, which maps it to the dollar sign. This ensures that it can’t be affected by anything outside of its scope of execution.

An alternative way to write this pattern would be to use `jQuery.extend()`, which enables us to define multiple functions at once and which sometimes make more sense semantically:

```js
(function ($) {
  $.extend($.fn, {
    myplugin: function () {
      // your plugin logic
    },
  });
})(jQuery);
```

We have now reviewed some jQuery plugin fundamentals, but a lot more could be done to take this further. _A Lightweight Start_ is the first complete plugin design pattern we’ll be exploring and it covers some best practices that we can use for basic everyday plugin development, taking into account common gotchas worth applying.

## Note

While most of the patterns below will be explained, I recommend reading through the comments in the code, because they will offer more insight into why certain best practices are applied.

I should also mention that none of this would be possible without the previous work, input and advice of other members of the jQuery community. I’ve listed them inline with each pattern so that one can read up on their individual work if interested.
