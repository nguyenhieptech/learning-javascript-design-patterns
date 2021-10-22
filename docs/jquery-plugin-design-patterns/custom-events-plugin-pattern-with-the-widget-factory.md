---
sidebar_position: 6
---

# Custom Events Plugin Pattern (With The Widget factory)

In the _JavaScript Design Patterns_ section of the book, we discussed the Observer pattern and later went on to cover jQuery's support for custom events, which offer a similar solution for implementing Publish/Subscribe. This same pattern can be used when writing jQuery plugins.

The basic idea here is that objects in a page can publish event notifications when something interesting occurs in our application. Other objects then subscribe to (or listen) for these events and respond accordingly. This results in the logic for our application being significantly more decoupled, as each object no longer needs to directly communicate with another.

In the following jQuery UI widget factory pattern, we’ll implement a basic custom event-based Publish/Subscribe system that allows our plugin to subscribe to event notifications from the rest of our application, which will be responsible for publishing them.

```js
/*!
 * jQuery custom-events plugin boilerplate
 * Author: DevPatch
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */

// In this pattern, we use jQuery's custom events to add
// pub/sub (publish/subscribe) capabilities to widgets.
// Each widget would publish certain events and subscribe
// to others. This approach effectively helps to decouple
// the widgets and enables them to function independently.

(function ($, window, document, undefined) {
  $.widget('ao.eventStatus', {
    options: {},

    _create: function () {
      var self = this;

      //self.element.addClass( "my-widget" );

      //subscribe to "myEventStart"
      self.element.on('myEventStart', function (e) {
        console.log('event start');
      });

      //subscribe to "myEventEnd"
      self.element.on('myEventEnd', function (e) {
        console.log('event end');
      });

      //unsubscribe to "myEventStart"
      //self.element.off( "myEventStart", function(e){
      ///console.log( "unsubscribed to this event" );
      //});
    },

    destroy: function () {
      $.Widget.prototype.destroy.apply(this, arguments);
    },
  });
})(jQuery, window, document);

// Publishing event notifications
// $( ".my-widget" ).trigger( "myEventStart");
// $( ".my-widget" ).trigger( "myEventEnd" );
```

Usage:

```js
var el = $('#elem');
el.eventStatus();
el.eventStatus().trigger('myEventStart');
```

## Further Reading

- “[Communication Between jQuery UI Widgets](http://www.devpatch.com/articles/2010-03-22-communication-between-jquery-ui-widgets/),” Benjamin Sternthal
