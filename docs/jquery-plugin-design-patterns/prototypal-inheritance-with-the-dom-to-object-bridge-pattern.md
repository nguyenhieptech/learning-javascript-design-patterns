---
sidebar_position: 7
---

# Prototypal Inheritance With The DOM-To-Object Bridge Pattern

As covered earlier, in JavaScript, we don’t have the traditional notion of classes that we would find in other classical programming languages, but we do have prototypal inheritance. With prototypal inheritance, an object inherits from another object. We can apply this concept to jQuery plugin development.

Yepnope.js author [Alex Sexton](https://alexsexton.com/) and jQuery team member [Scott Gonzalez](http://scottgonzalez.com/) have looked at this topic in detail. In sum, they discovered that for organized modular development, clearly separating the object that defines the logic for a plugin from the plugin-generation process itself can be beneficial.

The benefit is that testing our plugins code becomes significantly easier and we are also able to adjust the way things work behind the scenes without altering the way that any object APIs we implement are used.

In Sexton’s article on this topic, he implemented a bridge that enables us to attach our general logic to a particular plugin, which we’ve implemented in the pattern below.

One of the other advantages of this pattern is that we don’t have to constantly repeat the same plugin initialization code, thus ensuring that the concepts behind DRY development are maintained. Some developers might also find this pattern easier to read than others.

```js
/*!
 * jQuery prototypal inheritance plugin boilerplate
 * Author: Alex Sexton, Scott Gonzalez
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */

// myObject - an object representing a concept we wish to model
// (e.g. a car)
var myObject = {
  init: function (options, elem) {
    // Mix in the passed-in options with the default options
    this.options = $.extend({}, this.options, options);

    // Save the element reference, both as a jQuery
    // reference and a normal reference
    this.elem = elem;
    this.$elem = $(elem);

    // Build the DOM's initial structure
    this._build();

    // return this so that we can chain and use the bridge with less code.
    return this;
  },
  options: {
    name: 'No name',
  },
  _build: function () {
    //this.$elem.html( "<h1>"+this.options.name+"</h1>" );
  },
  myMethod: function (msg) {
    // We have direct access to the associated and cached
    // jQuery element
    // this.$elem.append( "<p>"+msg+"</p>" );
  },
};

// Object.create support test, and fallback for browsers without it
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

// Create a plugin based on a defined object
$.plugin = function (name, object) {
  $.fn[name] = function (options) {
    return this.each(function () {
      if (!$.data(this, name)) {
        $.data(this, name, Object.create(object).init(options, this));
      }
    });
  };
};
```

Usage:

```js
$.plugin('myobj', myObject);

$('#elem').myobj({ name: 'John' });

var collection = $('#elem').data('myobj');
collection.myMethod('I am a method');
```

## Further Reading

- “[Using Inheritance Patterns To Organize Large jQuery Applications](https://alexsexton.com/?p=51),” Alex Sexton
- “[How to Manage Large Applications With jQuery or Whatever](http://www.slideshare.net/SlexAxton/how-to-manage-large-jquery-apps” (further discussion), Alex Sexton
- “[Practical Example of the Need for Prototypal Inheritance](http://blog.bigbinary.com/2010/03/12/pratical-example-of-need-for-prototypal-inheritance.html),” Neeraj Singh
- “[Prototypal Inheritance in JavaScript](http://javascript.crockford.com/prototypal.html),” Douglas Crockford
