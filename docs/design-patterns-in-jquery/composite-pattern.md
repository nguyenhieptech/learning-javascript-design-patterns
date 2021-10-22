---
sidebar_position: 2
---

# Composite Pattern

**The Composite Pattern** describes a group of objects that can be treated in the same way a single instance of an object may be.

This allows us to treat both individual objects and compositions in a uniform manner, meaning that the same behavior will be applied regardless of whether we're working with one item or a thousand.

In jQuery, when we're applying methods to an element or collection of elements, we can treat both sets in a uniform manner as both selections return a jQuery object.

This is demonstrated by the code sample using the jQuery selector below. Here it's possible to add an `active` class to both selections for a single element (e.g an element with a unique ID) or a group of elements with the same tag name or class, without additional effort:

```js
// Single elements
$('#singleItem').addClass('active');
$('#container').addClass('active');

// Collections of elements
$('div').addClass('active');
$('.item').addClass('active');
$('input').addClass('active');
```

The jQuery `addClass()` implementation could either directly use native _for_ loops (or jQuery's `jQuery.each()`/`jQuery.fn.each()`) to iterate through a collection in order to apply the method to both single items or groups. Looking through the source we can see this is indeed the case:

```js
addClass: function (value) {
  var classNames, i, l, elem, setClass, c, cl;

  if (jQuery.isFunction(value)) {
    return this.each(function (j) {
      jQuery(this).addClass(value.call(this, j, this.className));
    });
  }

  if (value && typeof value === 'string') {
    classNames = value.split(rspace);

    for (i = 0, l = this.length; i < l; i++) {
      elem = this[i];

      if (elem.nodeType === 1) {
        if (!elem.className && classNames.length === 1) {
          elem.className = value;
        } else {
          setClass = ' ' + elem.className + ' ';

          for (c = 0, cl = classNames.length; c < cl; c++) {
            if (!~setClass.indexOf(' ' + classNames[c] + ' ')) {
              setClass += classNames[c] + ' ';
            }
          }
          elem.className = jQuery.trim(setClass);
        }
      }
    }
  }

  return this;
};
```
