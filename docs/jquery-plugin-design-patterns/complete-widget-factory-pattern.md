---
sidebar_position: 4
---

# “Complete” Widget Factory Pattern

While the jQuery plugin authoring guide is a great introduction to plugin development, it doesn't help obscure away common plugin plumbing tasks that we have to deal with on a regular basis.

The jQuery UI Widget Factory is a solution to this problem that helps us build complex, stateful plugins based on object-oriented principles. It also eases communication with our plugins instance, obfuscating a number of the repetitive tasks that we would have to code when working with basic plugins.

Stateful plugins help us keep track of their current state, also allowing us to change properties of the plugin after it has been initialized.

One of the great things about the Widget Factory is that the majority of the jQuery UI library actually uses it as a base for its components. This means that if we’re looking for further guidance on structure beyond this pattern, we won’t have to look beyond the jQuery UI repository on GitHub (https://github.com/jquery/jquery-ui).

This jQuery UI Widget Factory pattern covers almost all of the supported default factory methods, including triggering events. As per the last pattern, comments are included for all of the methods used and further guidance is given in the inline comments.

```js
/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

(function ($, window, document, undefined) {
  // define our widget under a namespace of your choice
  // with additional parameters e.g.
  // $.widget( "namespace.widgetname", (optional) - an
  // existing widget prototype to inherit from, an object
  // literal to become the widget's prototype );

  $.widget('namespace.widgetname', {
    //Options to be used as defaults
    options: {
      someValue: null,
    },

    //Setup widget (e.g. element creation, apply theming
    //, bind events etc.)
    _create: function () {
      // _create will automatically run the first time
      // this widget is called. Put the initial widget
      // setup code here, then we can access the element
      // on which the widget was called via this.element.
      // The options defined above can be accessed
      // via this.options this.element.addStuff();
    },

    // Destroy an instantiated plugin and clean up
    // modifications the widget has made to the DOM
    destroy: function () {
      // this.element.removeStuff();
      // For UI 1.8, destroy must be invoked from the
      // base widget
      $.Widget.prototype.destroy.call(this);
      // For UI 1.9, define _destroy instead and don't
      // worry about
      // calling the base widget
    },

    methodB: function (event) {
      //_trigger dispatches callbacks the plugin user
      // can subscribe to
      // signature: _trigger( "callbackName", [eventObject],
      // [uiObject] )
      // e.g. this._trigger( "hover", e /*where e.type ==
      // "mouseenter"*/, { hovered: $(e.target)});
      this._trigger('methodA', event, {
        key: value,
      });
    },

    methodA: function (event) {
      this._trigger('dataChanged', event, {
        key: value,
      });
    },

    // Respond to any changes the user makes to the
    // option method
    _setOption: function (key, value) {
      switch (key) {
        case 'someValue':
          // this.options.someValue = doSomethingWith( value );
          break;
        default:
          // this.options[ key ] = value;
          break;
      }

      // For UI 1.8, _setOption must be manually invoked
      // from the base widget
      $.Widget.prototype._setOption.apply(this, arguments);
      // For UI 1.9 the _super method can be used instead
      // this._super( "_setOption", key, value );
    },
  });
})(jQuery, window, document);
```

Usage:

```js
var collection = $('#elem').widgetName({
  foo: false,
});

collection.widgetName('methodB');
```

## Further Reading

- [The jQuery UI Widget Factory](http://ajpiano.com/widgetfactory/#slide1)
- “[Introduction to Stateful Plugins and the Widget Factory](https://msdn.microsoft.com/en-us/scriptjunkie/ff706600),” Doug Neiner
- “[Widget Factory](http://wiki.jqueryui.com/w/page/12138135/Widget%20factory)” (explained), Scott Gonzalez
- “[Understanding jQuery UI Widgets: A Tutorial](http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/),” Hacking at 0300
