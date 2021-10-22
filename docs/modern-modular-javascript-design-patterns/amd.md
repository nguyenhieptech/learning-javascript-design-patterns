---
sidebar_position: 2
---

# AMD

## A Format For Writing Modular JavaScript In The Browser

The overall goal for the AMD (Asynchronous Module Definition) format is to provide a solution for modular JavaScript that developers can use today. It was born out of Dojo's real world experience using XHR+eval and proponents of this format wanted to avoid any future solutions suffering from the weaknesses of those in the past.

The AMD module format itself is a proposal for defining modules where both the module and dependencies can be [asynchronously](http://dictionary.reference.com/browse/asynchronous) loaded. It has a number of distinct advantages including being both asynchronous and highly flexible by nature which removes the tight coupling one might commonly find between code and module identity. Many developers enjoy using it and one could consider it a reliable stepping stone towards the [module system](http://wiki.ecmascript.org/doku.php?id=harmony:modules) proposed for ES Harmony.

AMD began as a draft specification for a module format on the CommonJS list but as it wasn't able to reach full consensus, further development of the format moved to the [amdjs](https://github.com/amdjs) group.

Today it's embraced by projects including Dojo, MooTools, Firebug and even jQuery. Although the term CommonJS AMD format has been seen in the wild on occasion, it's best to refer to it as just AMD or Async Module support as not all participants on the CommonJS list wished to pursue it.

**Note**: There was a time when the proposal was referred to as Modules Transport/C, however as the spec wasn't geared towards transporting existing CommonJS modules, but rather - for defining modules - it made more sense to opt for the AMD naming convention.

## Getting Started With Modules

The first two concepts worth noting about AMD are the idea of a `define` method for facilitating module definition and a `require` method for handling dependency loading. _define_ is used to define named or unnamed modules based using the following signature:

```js
define(
  module_id /*optional*/,
  [dependencies] /*optional*/,
  definition function /*function for instantiating the module or object*/
);
```

As we can tell by the inline comments, the `module_id` is an optional argument which is typically only required when non-AMD concatenation tools are being used (there may be some other edge cases where it's useful too). When this argument is left out, we refer to the module as anonymous.

When working with anonymous modules, the idea of a module's identity is DRY, making it trivial to avoid duplication of filenames and code. Because the code is more portable, it can be easily moved to other locations (or around the file-system) without needing to alter the code itself or change its module ID. Consider the `module_id` similar to the concept of folder paths.

Note: Developers can run this same code on multiple environments just by using an AMD optimizer that works with a CommonJS environment such as [r.js](https://github.com/jrburke/r.js/).

Back to the `define` signature, the dependencies argument represents an array of dependencies which are required by the module we are defining and the third argument ("definition function" or "factory function") is a function that's executed to instantiate our module. A bare bone module could be defined as follows:

## Understanding AMD: define()

```js
// A module_id (myModule) is used here for demonstration purposes only
define('myModule', ['foo', 'bar'], function (foo, bar) {
  // dependencies (foo and bar) are mapped to function parameters // module definition function
  // return a value that defines the module export
  // (i.e the functionality we want to expose for consumption)

  // create your module here
  var myModule = {
    doStuff: function () {
      console.log('Yay! Stuff');
    },
  };

  return myModule;
});

// An alternative version could be..
define('myModule', ['math', 'graph'], function (math, graph) {
  // Note that this is a slightly different pattern
  // With AMD, it's possible to define modules in a few
  // different ways due to it's flexibility with
  // certain aspects of the syntax
  return {
    plot: function (x, y) {
      return graph.drawPie(math.randomGrid(x, y));
    },
  };
});
```

_require_ on the other hand is typically used to load code in a top-level JavaScript file or within a module should we wish to dynamically fetch dependencies. An example of its usage is:

## Understanding AMD: require()

```js
// Consider "foo" and "bar" are two external modules
// In this example, the "exports" from the two modules
// loaded are passed as function arguments to the
// callback (foo and bar) so that they can similarly be accessed

require(['foo', 'bar'], function (foo, bar) {
  // rest of your code here
  foo.doSomething();
});
```

## Dynamically-loaded Dependencies

```js
define(function (require) {
  var isReady = false,
    foobar;

  // note the inline require within our module definition
  require(['foo', 'bar'], function (foo, bar) {
    isReady = true;
    foobar = foo() + bar();
  });

  // we can still return a module
  return {
    isReady: isReady,
    foobar: foobar,
  };
});
```

## Understanding AMD: plugins

The following is an example of defining an AMD-compatible plugin:

```js
// With AMD, it's possible to load in assets of almost any kind
// including text-files and HTML. This enables us to have template
// dependencies which can be used to skin components either on
// page-load or dynamically.

define( ["./templates", "text!./template.md","css!./template.css" ],

    function( templates, template ){
        console.log( templates );
        // do something with our templates here
    }

});
```

**Note:** Although css! is included for loading CSS dependencies in the above example, it's important to remember that this approach has some caveats such as it not being fully possible to establish when the CSS is fully loaded. Depending on how we approach our build process, it may also result in CSS being included as a dependency in the optimized file, so use CSS as a loaded dependency in such cases with caution. If interested in doing the above, we can also explore @VIISON's RequireJS CSS plugin further [here](https://github.com/VIISON/RequireCSS).

## Loading AMD Modules Using RequireJS

```js
require(['app/myModule'], function (myModule) {
  // start the main module which in-turn
  // loads other modules
  var module = new myModule();
  module.doStuff();
});
```

This example could simply be looked at as `requirejs(["app/myModule"], function(){})` which indicates the loader's top level globals are being used. This is how to kick off top-level loading of modules with different AMD loaders however with a `define()` function, if it's passed a local require all `require([])` examples apply to both types of loader (curl.js and RequireJS).

## Loading AMD Modules Using curl.js

```js
curl(
  ['app/myModule.js'],

  function (myModule) {
    // start the main module which in-turn
    // loads other modules
    var module = new myModule();
    module.doStuff();
  }
);
```

## Modules With Deferred Dependencies

```js
// This could be compatible with jQuery's Deferred implementation,
// futures.js (slightly different syntax) or any one of a number
// of other implementations

define(['lib/Deferred'], function (Deferred) {
  var defer = new Deferred();

  require(['lib/templates/?index.html', 'lib/data/?stats'], function (template, data) {
    defer.resolve({ template: template, data: data });
  });
  return defer.promise();
});
```

## AMD Modules With Dojo

Defining AMD-compatible modules using Dojo is fairly straight-forward. As per above, define any module dependencies in an array as the first argument and provide a callback (factory) which will execute the module once the dependencies have been loaded. e.g:

```js
define(["dijit/Tooltip"], function( Tooltip ){

  //Our dijit tooltip is now available for local use
  new Tooltip(...);

});
```

Note the anonymous nature of the module, which can now be both consumed by a Dojo asynchronous loader, RequireJS or the standard [dojo.require()](http://livedocs.dojotoolkit.org/dojo/require) module loader.

There are some interesting gotchas with module referencing that are useful to know here. Although the AMD-advocated way of referencing modules declares them in the dependency list with a set of matching arguments, this isn't supported by the older Dojo 1.6 build system - it really only works for AMD-compliant loaders. e.g:

```js
define(["dojo/cookie", "dijit/Tooltip"], function( cookie, Tooltip ){

  var cookieValue = cookie( "cookieName" );
  new Tooltip(...);

});
```

This has many advantages over nested namespacing as modules no longer need to directly reference complete namespaces every time - all we require is the "dojo/cookie" path in dependencies, which once aliased to an argument, can be referenced by that variable. This removes the need to repeatedly type out "dojo." in our applications.

The final gotcha to be aware of is that if we wish to continue using the older Dojo build system or wish to migrate older modules to this newer AMD-style, the following more verbose version enables easier migration. Notice that dojo and dijit and referenced as dependencies too:

```js
define(["dojo", "dijit', "dojo/cookie", "dijit/Tooltip"], function( dojo, dijit ){
  var cookieValue = dojo.cookie( "cookieName" );
  new dijit.Tooltip(...);
});
```

## AMD Module Design Patterns (Dojo)

As we've seen in previous sections, design patterns can be highly effective in improving how we approach structuring solutions to common development problems. [John Hann](https://twitter.com/unscriptable) has given some excellent presentations about AMD module design patterns covering the Singleton, Decorator, Mediator and others and I highly recommend checking out his [slides](http://unscriptable.com/code/AMD-module-patterns/) if we get a chance.

A selection of AMD design patterns can be found below.

**Decorator pattern:**

```js
// mylib/UpdatableObservable: a Decorator for dojo/store/Observable
define(['dojo', 'dojo/store/Observable'], function (dojo, Observable) {
  return function UpdatableObservable(store) {
    var observable = dojo.isFunction(store.notify) ? store : new Observable(store);

    observable.updated = function (object) {
      dojo.when(object, function (itemOrArray) {
        dojo.forEach([].concat(itemOrArray), this.notify, this);
      });
    };

    return observable;
  };
});

// Decorator consumer
// a consumer for mylib/UpdatableObservable

define(['mylib/UpdatableObservable'], function (makeUpdatable) {
  var observable, updatable, someItem;

  // make the observable store updatable
  updatable = makeUpdatable(observable); // `new` is optional!

  // we can then call .updated() later on if we wish to pass
  // on data that has changed
  //updatable.updated( updatedItem );
});
```

**Adapter pattern**

```js
// "mylib/Array" adapts `each` function to mimic jQuerys:
define(['dojo/_base/lang', 'dojo/_base/array'], function (lang, array) {
  return lang.delegate(array, {
    each: function (arr, lambda) {
      array.forEach(arr, function (item, i) {
        lambda.call(item, i, item); // like jQuery's each
      });
    },
  });
});

// Adapter consumer
// "myapp/my-module":
define(['mylib/Array'], function (array) {
  array.each(['uno', 'dos', 'tres'], function (i, esp) {
    // here, `this` == item
  });
});
```

## AMD Modules With jQuery

Unlike Dojo, jQuery really only comes with one file, however given the plugin-based nature of the library, we can demonstrate how straight-forward it is to define an AMD module that uses it below.

```js
define(['js/jquery.js', 'js/jquery.color.js', 'js/underscore.js'], function (
  $,
  colorPlugin,
  _
) {
  // Here we've passed in jQuery, the color plugin and Underscore
  // None of these will be accessible in the global scope, but we
  // can easily reference them below.

  // Pseudo-randomize an array of colors, selecting the first
  // item in the shuffled array
  var shuffleColor = _.first(_.shuffle(['#666', '#333', '#111']));

  // Animate the background-color of any elements with the class
  // "item" on the page using the shuffled color
  $('.item').animate({ backgroundColor: shuffleColor });

  // What we return can be used by other modules
  return {};
});
```

There is however something missing from this example and it's the concept of registration.

**Registering jQuery As An Async-compatible Module**

One of the key features that landed in jQuery 1.7 was support for registering jQuery as an asynchronous module. There are a number of compatible script loaders (including RequireJS and curl) which are capable of loading modules using an asynchronous module format and this means fewer hacks are required to get things working.

If a developer wants to use AMD and does not want their jQuery version leaking into the global space, they should call `noConflict` in their top level module that uses jQuery. In addition, since multiple versions of jQuery can be on a page there are special considerations that an AMD loader must account for, and so jQuery only registers with AMD loaders that have recognized these concerns, which are indicated by the loader specifying `define.amd.jQuery`. RequireJS and curl are two loaders that do so

The named AMD provides a safety blanket of being both robust and safe for most use-cases.

```js
// Account for the existence of more than one global
// instances of jQuery in the document, cater for testing
// .noConflict()

var jQuery = this.jQuery || 'jQuery',
  $ = this.$ || '$',
  originaljQuery = jQuery,
  original$ = $;

define(['jquery'], function ($) {
  $('.items').css('background', 'green');
  return function () {};
});
```

## Why Is AMD A Better Choice For Writing Modular JavaScript?

- Provides a clear proposal for how to approach defining flexible modules.
- Significantly cleaner than the present global namespace and `<script>` tag solutions many of us rely on. There's a clean way to declare stand-alone modules and dependencies they may have.
- Module definitions are encapsulated, helping us to avoid pollution of the global namespace.
- Arguably works better than some alternative solutions (e.g. CommonJS, which we'll be looking at shortly). It doesn't have issues with cross-domain, local or debugging and doesn't have a reliance on server-side tools to be used. Most AMD loaders support loading modules in the browser without a build process.
- Provides a "transport" approach for including multiple modules in a single file. Other approaches like CommonJS have yet to agree on a transport format.
- It's possible to lazy load scripts if this is needed.

**Note:** Many of the above could be said about YUI's module loading strategy as well.

## Related Reading

[The RequireJS Guide To AMD](http://requirejs.org/docs/whyamd.html)

[What's the fastest way to load AMD modules?](http://unscriptable.com/index.php/2011/09/21/what-is-the-fastest-way-to-load-amd-modules/)

[AMD vs. CommonJS, what's the better format?](http://unscriptable.com/index.php/2011/09/30/amd-versus-cjs-whats-the-best-format/)

[AMD Is Better For The Web Than CommonJS Modules](http://blog.millermedeiros.com/2011/09/amd-is-better-for-the-web-than-commonjs-modules/)

[The Future Is Modules Not Frameworks](http://unscriptable.com/code/Modules-Frameworks/)

[AMD No Longer A CommonJS Specification](https://groups.google.com/group/commonjs/browse_thread/thread/96a0963bcb4ca78f/cf73db49ce267ce1?lnk=gst#)

[On Inventing JavaScript Module Formats And Script Loaders](https://tagneto.blogspot.com/2011/04/on-inventing-js-module-formats-and.html)

[The AMD Mailing List](https://groups.google.com/group/amd-implement)

## What Script Loaders & Frameworks Support AMD?

**In-browser:**

- RequireJS http://requirejs.org
- curl.js http://github.com/unscriptable/curl
- bdLoad http://bdframework.com/bdLoad
- Yabble http://github.com/jbrantly/yabble
- PINF http://github.com/pinf/loader-js
  (and more)

**Server-side:**

- RequireJS http://requirejs.org
- PINF http://github.com/pinf/loader-js

## AMD Conclusions

Having used AMD for a number of projects, my conclusions are that it ticks a lot of the checkboxes developers creating serious applications might desire from a better module format. It avoids the need to worry about globals, supports named modules, doesn't require server transformation to function and is a pleasure to use for dependency management.

It's also an excellent addition for modular development using Backbone.js, ember.js or any number of other structural frameworks for keeping applications organized.

As AMD has been heavily discussed for almost two years within the Dojo and CommonJS worlds, we know it's had time to mature and evolve. We also know it's been battle-tested in the wild by a number of large companies to build non-trivial applications (IBM, BBC iPlayer) and so, if it didn't work, chances are they would have abandoned it by now, but haven't.

That said, there are still areas where AMD could be improved. Developers who have used the format for some time may feel the AMD boilerplate/wrapper-code is an annoying overhead. Whilst I share this concern, there are tools such as Volo that can help work around these issues and I would argue that on the whole, the pros with using AMD far outweigh the cons.
