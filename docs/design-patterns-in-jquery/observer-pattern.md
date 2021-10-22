---
sidebar_position: 5
---

# Observer Pattern

Another pattern we reviewed earlier is the Observer (Publish/Subscribe) pattern. This is where the objects in a system may subscribe to other objects and be notified by them when an event of interest occurs.

jQuery core has come with built-in support for a publish/subscribe-like system for a few years now, which it refers to as _custom events_.

In earlier versions of the library, access to these custom events was possible using jQuery.bind() (subscribe), `jQuery.trigger()` (publish) and `jQuery.unbind()` (unsubscribe), but in recent versions this can be done using `jQuery.on()`, `jQuery.trigger()` and `jQuery.off()`.

Below we can see an example of this being used in practice:

```js
// Equivalent to subscribe(topicName, callback)
$(document).on('topicName', function () {
  //..perform some behaviour
});

// Equivalent to publish(topicName)
$(document).trigger('topicName');

// Equivalent to unsubscribe(topicName)
$(document).off('topicName');
```

Calls to `jQuery.on()` and `jQuery.off()` eventually go through the jQuery events system. Similar to Ajax, as the implementation for this is relatively long, we can instead look at where and how the actual event handlers for custom events are attached:

```js
jQuery.event = {
  add: function (elem, types, handler, data, selector) {
    var elemData,
      eventHandle,
      events,
      t,
      tns,
      type,
      namespaces,
      handleObj,
      handleObjIn,
      quick,
      handlers,
      special;

    ...

    // Init the element's event structure and main handler,
    //if this is the first
    events = elemData.events;
    if (!events) {
      elemData.events = events = {};
    }
    ...

    // Handle multiple events separated by a space
    // jQuery(...).bind("mouseover mouseout", fn);
    types = jQuery.trim(hoverHack(types)).split(' ');
    for (t = 0; t < types.length; t++) {
      ...

      // Init the event handler queue if we're the first
      handlers = events[type];
      if (!handlers) {
        handlers = events[type] = [];
        handlers.delegateCount = 0;

        // Only use addEventListener/attachEvent if the special
        // events handler returns false
        if (
          !special.setup ||
          special.setup.call(elem, data,
          // namespaces, eventHandle) === false
        ) {
          // Bind the global event handler to the element
          if (elem.addEventListener) {
            elem.addEventListener(type, eventHandle, false);
          } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, eventHandle);
          }
        }
      }
      // https://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjquery
```

For those that prefer to use the conventional naming scheme for the Observer pattern, Ben Alman created a simple wrapper around the above methods which provides us access to `jQuery.publish()`, `jQuery.subscribe`, and `jQuery.unsubscribe` methods. I've previously linked to them earlier in the book, but we can see the wrapper in full below.

```js
(function ($) {
  var o = $({});

  $.subscribe = function () {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function () {
    o.off.apply(o, arguments);
  };

  $.publish = function () {
    o.trigger.apply(o, arguments);
  };
})(jQuery);
```

In recent versions of jQuery, a multi-purpose callbacks object (`jQuery.Callbacks`) was made available to enable users to write new solutions based on callback lists. One such solution to write using this feature is another Publish/Subscribe system. An implementation of this is the following:

```js
var topics = {};

jQuery.Topic = function (id) {
  var callbacks,
    topic = id && topics[id];
  if (!topic) {
    callbacks = jQuery.Callbacks();
    topic = {
      publish: callbacks.fire,
      subscribe: callbacks.add,
      unsubscribe: callbacks.remove,
    };
    if (id) {
      topics[id] = topic;
    }
  }
  return topic;
};
```

which can then be used as follows:

```js
// Subscribers
$.Topic('mailArrived').subscribe(fn1);
$.Topic('mailArrived').subscribe(fn2);
$.Topic('mailSent').subscribe(fn1);

// Publisher
$.Topic('mailArrived').publish('hello world!');
$.Topic('mailSent').publish('woo! mail!');

// Here, "hello world!" gets pushed to fn1 and fn2
// when the "mailArrived" notification is published
// with "woo! mail!" also being pushed to fn1 when
// the "mailSent" notification is published.

// Outputs:
// hello world!
// fn2 says: hello world!
// woo! mail!
```
