---
sidebar_position: 9
---

# jQuery Mobile Widgets With The Widget factory

jQuery mobile is a jQuery project framework that encourages the design of ubiquitous web applications that work both on popular mobile devices and platforms and on the desktop. Rather than writing unique applications for each device or OS, we simply write the code once and it should ideally run on many of the A-, B- and C-grade browsers out there at the moment.

The fundamentals behind jQuery mobile can also be applied to plugin and widget development.

What’s interesting in this next pattern is that although there are small, subtle differences in writing a “mobile”-optimized widget, those familiar with using the jQuery UI Widget Factory pattern from earlier should be able to grasp this in next to no time.

The mobile-optimized widget below has a number of interesting differences than the standard UI widget pattern we saw earlier:

- `$.mobile.widget` is referenced as an existing widget prototype from which to inherit. For standard widgets, passing through any such prototype is unnecessary for basic development, but using this jQuery-mobile specific widget prototype provides internal access to further “options” formatting.
- In `_create()`, a guide is provided on how the official jQuery mobile widgets handle element selection, opting for a role-based approach that better fits the jQM mark-up. This isn’t at all to say that standard selection isn’t recommended, only that this approach might make more sense given the structure of jQuery Mobile pages.
- Guidelines are also provided in comment form for applying our plugin methods on `pagecreate` as well as for selecting the plugin application via data roles and data attributes.

```js
/*!
 * (jQuery mobile) jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @scottjehl
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // define a widget under a namespace of our choice
    // here "mobile" has been used in the first argument
    $.widget( "mobile.widgetName", $.mobile.widget, {

        // Options to be used as defaults
        options: {
            foo: true,
            bar: false
        },

        _create: function() {
            // _create will automatically run the first time this
            // widget is called. Put the initial widget set-up code
            // here, then we can access the element on which
            // the widget was called via this.element
            // The options defined above can be accessed via
            // this.options

            // var m = this.element,
            // p = m.parents( ":jqmData(role="page")" ),
            // c = p.find( ":jqmData(role="content")" )
        },

        // Private methods/props start with underscores
        _dosomething: function(){ ... },

        // Public methods like these below can can be called
        // externally:
        // $("#myelem").foo( "enable", arguments );

        enable: function() { ... },

        // Destroy an instantiated plugin and clean up modifications
        // the widget has made to the DOM
        destroy: function () {
            // this.element.removeStuff();
            // For UI 1.8, destroy must be invoked from the
            // base widget
            $.Widget.prototype.destroy.call( this );
            // For UI 1.9, define _destroy instead and don't
            // worry about calling the base widget
        },

        methodB: function ( event ) {
            //_trigger dispatches callbacks the plugin user can
            // subscribe to
            // signature: _trigger( "callbackName", [eventObject],
            // [uiObject] )
            // e.g. this._trigger( "hover", e /*where e.type ==
            // "mouseenter"*/, { hovered: $(e.target)});
            this._trigger( "methodA", event, {
                key: value
            });
        },

        methodA: function ( event ) {
            this._trigger( "dataChanged", event, {
                key: value
            });
        },

        // Respond to any changes the user makes to the option method
        _setOption: function ( key, value ) {
            switch ( key ) {
            case "someValue":
                // this.options.someValue = doSomethingWith( value );
                break;
            default:
                // this.options[ key ] = value;
                break;
            }

            // For UI 1.8, _setOption must be manually invoked from
            // the base widget
            $.Widget.prototype._setOption.apply(this, arguments);
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );
```

Usage:

```js
var instance = $('#foo').widgetName({
  foo: false,
});

instance.widgetName('methodB');
```

We can also self-initialize this widget whenever a new page in jQuery Mobile is created. jQuery Mobile's _page_ plugin dispatches a _create_ event when a jQuery Mobile page (found via the `data-role="page"` attribute) is first initialized. We can listen for that event (called "pagecreate") and run our plugin automatically whenever a new page is created.

```js
$(document).on('pagecreate', function (e) {
  // In here, e.target refers to the page that was created
  // (it's the target of the pagecreate event)
  // So, we can simply find elements on this page that match a
  // selector of our choosing, and call our plugin on them.
  // Here's how we'd call our "foo" plugin on any element with a
  // data-role attribute of "foo":
  $(e.target).find('[data-role="foo"]').foo(options);

  // Or, better yet, let's write the selector accounting for the configurable
  // data-attribute namespace
  $(e.target).find(':jqmData(role="foo")').foo(options);
});
```

We can now simply reference the script containing our widget and `pagecreate` binding in a page running jQuery Mobile site, and it will automatically run like any other jQuery Mobile plugin.
