---
sidebar_position: 6
---

# Iterator Pattern

The Iterator is a design pattern where iterators (objects that allow us to traverse through all the elements of a collection) access the elements of an aggregate object sequentially without needing to expose its underlying form.

Iterators encapsulate the internal structure of how that particular iteration occurs. In the case of jQuery's `jQuery.fn.each()` iterator, we are actually able to use the underlying code behind `jQuery.each()` to iterate through a collection, without needing to see or understand the code working behind the scenes providing this capability.

This is a pattern that could be considered a special case of the facade, where we explicitly deal with problems related to iteration.

```js
$.each(['john', 'dave', 'rick', 'julian'], function (index, value) {
  console.log(index + ': ' + value);
});

$('li').each(function (index) {
  console.log(index + ': ' + $(this).text());
});
```

Here we can see the code for `jQuery.fn.each()`:

```js
// Execute a callback for every element in the matched set.
each: function( callback, args ) {
  return jQuery.each( this, callback, args );
}
```

Followed by the code behind `jQuery.each()` which handles two ways of iterating through objects:

```js
each: function( object, callback, args ) {
  var name, i = 0,
    length = object.length,
    isObj = length === undefined || jQuery.isFunction( object );

  if ( args ) {
    if ( isObj ) {
      for ( name in object ) {
        if ( callback.apply( object[ name ], args ) === false ) {
          break;
        }
      }
    } else {
      for ( ; i < length; ) {
        if ( callback.apply( object[ i++ ], args ) === false ) {
          break;
        }
      }
    }

  // A special, fast, case for the most common use of each
  } else {
    if ( isObj ) {
      for ( name in object ) {
        if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
          break;
        }
      }
    } else {
      for ( ; i < length; ) {
        if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
          break;
        }
      }
    }
  }

  return object;
};
```
