---
sidebar_position: 3
---

# CommonJS

## A Module Format Optimized For The Server

The CommonJS module proposal specifies a simple API for declaring modules server-side and unlike AMD attempts to cover a broader set of concerns such as io, file-system, promises and more.

The format was proposed by [CommonJS](http://www.commonjs.org/) - a volunteer working group which aim to design, prototype and standardize JavaScript APIs. To date they've attempted to ratify standards for both [modules](http://www.commonjs.org/specs/modules/1.0/) and [packages](http://wiki.commonjs.org/wiki/Packages/1.0).

## Getting Started

From a structure perspective, a CommonJS module is a reusable piece of JavaScript which exports specific objects made available to any dependent code. Unlike AMD, there are typically no function wrappers around such modules (so we won't see `define` here for example).

CommonJS modules basically contain two primary parts: a free variable named `exports` which contains the objects a module wishes to make available to other modules and a `require` function that modules can use to import the exports of other modules.

### Understanding CommonJS: require() and exports

```js
// package/lib is a dependency we require
var lib = require('package/lib');

// behaviour for our module
function foo() {
  lib.log('hello world!');
}

// export (expose) foo to other modules
exports.foo = foo;
```

### Basic consumption of exports

```js
// define more behaviour we would like to expose
function foobar() {
  this.foo = function () {
    console.log('Hello foo');
  };

  this.bar = function () {
    console.log('Hello bar');
  };
}

// expose foobar to other modules
exports.foobar = foobar;

// an application consuming "foobar"

// access the module relative to the path
// where both usage and module files exist
// in the same directory

var foobar = require('./foobar').foobar,
  test = new foobar();

// Outputs: "Hello bar"
test.bar();
```

### AMD-equivalent Of The First CommonJS Example

```js
define(function (require) {
  var lib = require('package/lib');

  // some behaviour for our module
  function foo() {
    lib.log('hello world!');
  }

  // export (expose) foo for other modules
  return {
    foobar: foo,
  };
});
```

This can be done as AMD supports a [simplified CommonJS wrapping](http://requirejs.org/docs/whyamd.html#sugar) feature.

### Consuming Multiple Dependencies

**app.js**

```js
var modA = require('./foo');
var modB = require('./bar');

exports.app = function () {
  console.log('Im an application!');
};

exports.foo = function () {
  return modA.helloWorld();
};
```

**bar.js**

```js
exports.name = 'bar';
```

**foo.js**

```js
require('./bar');
exports.helloWorld = function () {
  return 'Hello World!!';
};
```

### What Loaders & Frameworks Support CommonJS?

**In-browser:**

- curl.js http://github.com/unscriptable/curl
- SproutCore 1.1 http://sproutcore.com
- PINF http://github.com/pinf/loader-js

**Server-side:**

- Nodehttp://nodejs.org
- Narwhal https://github.com/tlrobinson/narwhal
- Persevere http://www.persvr.org/
- Wakanda http://www.wakandasoft.com/

### Is CommonJS Suitable For The Browser?

There are developers that feel CommonJS is better suited to server-side development which is one reason there's currently a level of **disagreement** over which format should and will be used as the de facto standard in the pre-Harmony age moving forward. Some of the arguments against CommonJS include a note that many CommonJS APIs address server-oriented features which one would simply not be able to implement at a browser-level in JavaScript - for example, _io_, _system_ and _js_ could be considered unimplementable by the nature of their functionality.

That said, it's useful to know how to structure CommonJS modules regardless so that we can better appreciate how they fit in when defining modules which may be used everywhere. Modules which have applications on both the client and server include validation, conversion and templating engines. The way some developers are approaching choosing which format to use is opting for CommonJS when a module can be used in a server-side environment and using AMD if this is not the case.

As AMD modules are capable of using plugins and can define more granular things like constructors and functions this makes sense. CommonJS modules are only able to define objects which can be tedious to work with if we're trying to obtain constructors out of them.

Although it's beyond the scope of this section, one may have also noticed that there were different types of "require" methods mentioned when discussing AMD and CommonJS. The concern with a similar naming convention is of course confusion and the community are currently split on the merits of a global require function. John Hann's suggestion here is that rather than calling it "require", which would probably fail to achieve the goal of informing users about the different between a global and inner require, it may make more sense to rename the global loader method something else (e.g. the name of the library). It's for this reason that a loader like curl.js uses `curl()` as opposed to `require`.

### Related Reading

[Demystifying CommonJS Modules](http://dailyjs.com/2010/10/18/modules/)

[JavaScript Growing Up](http://www.slideshare.net/davidpadbury/javascript-growing-up)

[The RequireJS Notes On CommonJS](http://requirejs.org/docs/commonjs.html)

[Taking Baby Steps With Node.js And CommonJS - Creating Custom Modules](http://elegantcode.com/2011/02/04/taking-baby-steps-with-node-js-commonjs-and-creating-custom-modules/)

[Asynchronous CommonJS Modules for the Browser](https://www.sitepen.com/blog/2010/07/16/asynchronous-commonjs-modules-for-the-browser-and-introducing-transporter/)

[The CommonJS Mailing List](https://groups.google.com/group/commonjs)

## AMD && CommonJS Competing, But Equally Valid Standards

Both AMD and CommonJS are valid module formats with different end-goals.

AMD adopts a browser-first approach to development, opting for asynchronous behavior and simplified backwards compatibility but it doesn't have any concept of File I/O. It supports objects, functions, constructors, strings, JSON and many other types of modules, running natively in the browser. It's incredibly flexible.

CommonJS on the other hand takes a server-first approach, assuming synchronous behavior, no global baggage and attempts to cater for the future (on the server). What we mean by this is that because CommonJS supports unwrapped modules, it can feel a little more close to the ES.next/Harmony specifications, freeing us of the `define()` wrapper that AMD enforces. CommonJS modules however only support objects as modules.

### UMD: AMD And CommonJS-Compatible Modules For Plugins

For developers wishing to create modules that can work in both browser and server-side environments, existing solutions could be considered little lacking. To help alleviate this, James Burke, I and a number of other developers created UMD (Universal Module Definition) https://github.com/umdjs/umd.

UMD is an experimental module format that allows the definition of modules that work in both client and server environments with all or most of the popular script-loading techniques available at the time of writing. Although the idea of (yet) another module format may be daunting, we will cover UMD briefly for the sake of thoroughness.

We originally began defining UMD by taking a look at the simplified CommonJS wrapper supported in the AMD specification. For developers wishing to write modules as if they were CommonJS modules, the following CommonJS-compatible format could be used:

**Basic AMD Hybrid Format**

```js
define(function (require, exports, module) {
  var shuffler = require('lib/shuffle');

  exports.randomize = function (input) {
    return shuffler.shuffle(input);
  };
});
```

It's important however to note that a module is really only treated as a CommonJS module if it doesn't contain a dependency array and the definition function contains one parameter at minimum. This also won't work correctly on some devices (e.g the PS3). For further information about the above wrapper, see http://requirejs.org/docs/api.html#cjsmodule.

Taking this further, we wanted to provide a number of different patterns that not just worked with AMD and CommonJS, but also solved common compatibility problems developers wishing to develop such modules had with other environments.

One such variation we can see below allows us to use CommonJS, AMD or browser globals to create a module.

**Using CommonJS, AMD or browser globals to create a module**

Define a module `commonJsStrict`, which depends on another module called `b`. The name of the module is implied by the file name and its best practice for the file name and the exported global to have the same name.

If the module `b` also uses the same type of boilerplate in the browser, it will create a global `.b` that is used. If we don't wish to support the browser global patch, we can remove the `root` and the passing `this` as the first argument to the top function

```js
(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    factory(exports, require('b'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports', 'b'], factory);
  } else {
    // Browser globals
    factory((root.commonJsStrict = {}), root.b);
  }
})(this, function (exports, b) {
  //use b in some fashion.

  // attach properties to the exports object to define
  // the exported module properties.
  exports.action = function () {};
});
```

The UMD repository contains variations covering modules that work optimally in the browser, those best for providing exports, those optimal for CommonJS runtimes and even those that work best for defining jQuery plugins, which we will look at next.

**jQuery plugins that function in all environments**

UMD provides two patterns for working with jQuery plugins - one which defines plugins that work well with AMD and browser globals and another which can also work in CommonJS environments. jQuery is not likely to be used in most CommonJS environments so keep this in mind unless we're working with an environment which does play well with it.

We will now define a plugin composed of a core and an extension to that core. The core plugin is loaded into a `$.core` namespace, which can then be easily extended using plugin extensions via the namespacing pattern. Plugins loaded via script tags automatically populate a `plugin` namespace under `core` (i.e. `$.core.plugin.methodName()`).

The pattern can be quite nice to work with because plugin extensions can access properties and methods defined in the base or, with a little tweaking, override default behavior so that it can be extended to do more. A loader is also not required to make any of this fully functional.

For more details of what is being done, please see the inline comments in the code samples below.

**usage.html**

```html
<script type="text/javascript" src="jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="pluginCore.js"></script>
<script type="text/javascript" src="pluginExtension.js"></script>

<script type="text/javascript">
  $(function () {
    // Our plugin "core" is exposed under a core namespace in
    // this example, which we first cache
    var core = $.core;

    // Then use use some of the built-in core functionality to
    // highlight all divs in the page yellow
    core.highlightAll();

    // Access the plugins (extensions) loaded into the "plugin"
    // namespace of our core module:

    // Set the first div in the page to have a green background.
    core.plugin.setGreen('div:first');
    // Here we're making use of the core's "highlight" method
    // under the hood from a plugin loaded in after it

    // Set the last div to the "errorColor" property defined in
    // our core module/plugin. If we review the code further down,
    // we can see how easy it is to consume properties and methods
    // between the core and other plugins
    core.plugin.setRed('div:last');
  });
</script>
```

**_pluginCore.js_**

```js
// Module/Plugin core
// Note: the wrapper code we see around the module is what enables
// us to support multiple module formats and specifications by
// mapping the arguments defined to what a specific format expects
// to be present. Our actual module functionality is defined lower
// down, where a named module and exports are demonstrated.
//
// Note that dependencies can just as easily be declared if required
// and should work as demonstrated earlier with the AMD module examples.

(function (name, definition) {
  var theModule = definition(),
    // this is considered "safe":
    hasDefine = typeof define === 'function' && define.amd,
    // hasDefine = typeof define === "function",
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module
    define(theModule);
  } else if (hasExports) {
    // Node.js Module
    module.exports = theModule;
  } else {
    // Assign to common namespaces or simply the global object (window)
    (this.jQuery || this.ender || this.$ || this)[name] = theModule;
  }
})('core', function () {
  var module = this;
  module.plugins = [];
  module.highlightColor = 'yellow';
  module.errorColor = 'red';

  // define the core module here and return the public API

  // This is the highlight method used by the core highlightAll()
  // method and all of the plugins highlighting elements different
  // colors
  module.highlight = function (el, strColor) {
    if (this.jQuery) {
      jQuery(el).css('background', strColor);
    }
  };
  return {
    highlightAll: function () {
      module.highlight('div', module.highlightColor);
    },
  };
});
```

**pluginExtension.js**

```js
// Extension to module core

(function (name, definition) {
  var theModule = definition(),
    hasDefine = typeof define === 'function',
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module
    define(theModule);
  } else if (hasExports) {
    // Node.js Module
    module.exports = theModule;
  } else {
    // Assign to common namespaces or simply the global object (window)
    // account for for flat-file/global module extensions
    var obj = null,
      namespaces,
      scope;

    obj = null;
    namespaces = name.split('.');
    scope = this.jQuery || this.ender || this.$ || this;

    for (var i = 0; i < namespaces.length; i++) {
      var packageName = namespaces[i];
      if (obj && i == namespaces.length - 1) {
        obj[packageName] = theModule;
      } else if (typeof scope[packageName] === 'undefined') {
        scope[packageName] = {};
      }
      obj = scope[packageName];
    }
  }
})('core.plugin', function () {
  // Define our module here and return the public API.
  // This code could be easily adapted with the core to
  // allow for methods that overwrite and extend core functionality
  // in order to expand the highlight method to do more if we wish.
  return {
    setGreen: function (el) {
      highlight(el, 'green');
    },
    setRed: function (el) {
      highlight(el, errorColor);
    },
  };
});
```

UMD doesn't aim to replace AMD nor CommonJS but merely offers some supplemental assistance for developers wishing to get their code working in more environments today. For further information or to contribute suggestions towards this experimental format, see https://github.com/umdjs/umd.

### Further Reading

- “[Using AMD Loaders to Write and Manage Modular JavaScript](http://unscriptable.com/code/Using-AMD-loaders/#0),” John Hann
- “[Demystifying CommonJS Modules](http://dailyjs.com/2010/10/18/modules/),” Alex Young
- “[AMD Module Patterns: Singleton](http://unscriptable.com/index.php/2011/09/22/amd-module-patterns-singleton/),” John Hann
- [“Run-Anywhere JavaScript Modules Boilerplate Code](https://www.sitepen.com/blog/2010/09/30/run-anywhere-javascript-modules-boilerplate-code/),” Kris Zyp
- [“Standards And Proposals for JavaScript Modules And jQuery](https://tagneto.blogspot.com/2010/12/standards-and-proposals-for-javascript.html),” James Burke
