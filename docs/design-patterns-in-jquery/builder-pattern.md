---
sidebar_position: 9
---

# Builder Pattern

When working with the DOM, we often want to construct new elements dynamically - a process which can increase in complexity depending on the final markup, attributes and properties we wish our constructed elements to contain.

Complex elements require special care when being defined, especially if we want the flexibility to either literally define the final markup for our elements (which can get messy) or take a more readable object-oriented route instead. Having a mechanism for building our complex DOM objects that is independent from the objects themselves gives us this flexibility and that is exactly what the Builder pattern provides.

Builders allow us to construct complex objects by only specifying the type and content of the object, shielding us from the process of creating or representing the object explicitly.

The jQuery dollar sign allows us to do just this as it provides a number of different means for dynamically building new jQuery (and DOM) objects, by either passing in the complete markup for an element, partial markup and content or using the jQuery for construction:

```js
$('<div class="foo">bar</div>');

$('<p id="test">foo <em>bar</em></p>').appendTo('body');

var newParagraph = $('<p />').text('Hello world');

$('<input />').attr({ type: 'text', id: 'sample' }).appendTo('#container');
```

Below is a snippet from jQuery core's internal `jQuery.prototype` method which assists with the construction of jQuery objects from markup passed to the `jQuery()` selector. Regardless of whether or not `document.createElement` is used to create a new element, a reference to the element (found or created) is injected into the returned object so further methods such as `.attr()` can be easily used on it right after.

```js
// HANDLE: $(html) -> $(array)
if (match[1]) {
  context = context instanceof jQuery ? context[0] : context;
  doc = context ? context.ownerDocument || context : document;

  // If a single string is passed in and it's a single tag
  // just do a createElement and skip the rest
  ret = rsingleTag.exec(selector);

  if (ret) {
    if (jQuery.isPlainObject(context)) {
      selector = [document.createElement(ret[1])];
      jQuery.fn.attr.call(selector, context, true);
    } else {
      selector = [doc.createElement(ret[1])];
    }
  } else {
    ret = jQuery.buildFragment([match[1]], [doc]);
    selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
  }

  return jQuery.merge(this, selector);
}
```
