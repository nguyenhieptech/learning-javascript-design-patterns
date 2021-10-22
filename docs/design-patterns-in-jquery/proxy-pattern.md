---
sidebar_position: 8
---

# Proxy Pattern

There are times when it is necessary for us to control the access and context behind an object and this is where the Proxy pattern can be useful.

It can help us control when an expensive object should be instantiated, provide advanced ways to reference the object or modify the object to function a particular way in specific contexts.

In jQuery core, a `jQuery.proxy()` method exists which accepts as input a function and returns a new one which will always have a specific context. This ensures that the value of `this` within a function is the value we expect.

An example of where this is useful is when we're making use of timers within a `click` event handler. Imagine we have the following handler prior to adding any timers:

```js
$('button').on('click', function () {
  // Within this function, "this" refers to the element that was clicked
  $(this).addClass('active');
});
```

If we wished to add a hard delay before the `active` class was added, we _could_ use `setTimeout()` to achieve this. Unfortunately there is a small problem with this solution: whatever function is passed to `setTimeout()` will have a different value for `this` within that function. It will instead refer to the `window` object, which is not what we desire.

```js
$('button').on('click', function () {
  setTimeout(function () {
    // "this" doesn't refer to our element!
    // It refers to window
    $(this).addClass('active');
  });
});
```

To work around this problem, we can use `jQuery.proxy()` to implement a type of proxy pattern. By calling it with the function and value we would like assigned to `this` it will actually return a function that retains the value we desire within the correct context. Here's how this would look:

```js
$('button').on('click', function () {
  setTimeout(
    $.proxy(function () {
      // "this" now refers to our element as we wanted
      $(this).addClass('active');
    }, this),
    500
  );

  // the last "this" we're passing tells $.proxy() that our DOM element
  // is the value we want "this" to refer to.
});
```

jQuery's implementation of `jQuery.proxy()` can be found below:

```js
// Bind a function to a context, optionally partially applying any
// arguments.
proxy: function( fn, context ) {
  if ( typeof context === "string" ) {
    var tmp = fn[ context ];
    context = fn;
    fn = tmp;
  }

  // Quick check to determine if target is callable, in the spec
  // this throws a TypeError, but we will just return undefined.
  if ( !jQuery.isFunction( fn ) ) {
    return undefined;
  }

  // Simulated bind
  var args = slice.call( arguments, 2 ),
    proxy = function() {
      return fn.apply( context, args.concat( slice.call( arguments ) ) );
    };

  // Set the guid of unique handler to the same of original handler, so it can be removed
  proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

  return proxy;
}
```
