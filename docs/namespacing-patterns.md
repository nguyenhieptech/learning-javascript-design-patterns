---
sidebar_position: 16
---

# Namespacing Patterns

In this section, we're going to explore patterns for namespacing in JavaScript. Namespaces can be considered a logical grouping of units of code under a unique identifier. The identifier can be referenced in many namespaces and each identifier can itself contain a hierarchy of its own nested (or sub) namespaces.

In application development, we employ namespaces for a number of important reasons. In JavaScript, they help us avoid **collisions** with other objects or variables in the global namespace. They're also extremely useful for helping organize blocks of functionality in a code-base so that it can be more easily referenced and used.

Namespacing any serious script or application is critical as it's important to safeguard our code from breaking in the event of another script on the page using the **same** variable or method names we are. With the number of **third-party** tags regularly injected into pages these days, this can be a common problem we all need to tackle at some point in our careers. As a well-behaved "citizen" of the global namespace, it's also imperative that we do our best to similarly not prevent other developer's scripts executing due to the same issues.

Whilst JavaScript doesn't really have built-in support for namespaces like other languages, it does have objects and closures which can be used to achieve a similar effect.

## Namespacing Fundamentals

Namespaces can be found in almost any serious JavaScript application. Unless we're working with a simple code-snippet, it's imperative that we do our best to ensure that we're implementing namespacing correctly as it's not just simple to pick-up, it'll also avoid third party code clobbering our own. The patterns we'll be examining in this section are:

1. Single global variables
2. Prefix namespacing
3. Object literal notation
4. Nested namespacing
5. Immediately-invoked Function Expressions
6. Namespace injection

### 1. Single global variables

One popular pattern for namespacing in JavaScript is opting for a single global variable as our primary object of reference. A skeleton implementation of this where we return an object with functions and properties can be found below:

```js
var myApplication = (function () {
  function App() {
    //...
  }

  return {
    //...
  };
})();

// Here is the original, the author might be mistaken (NOT comfirmed).
// https://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailnamespacing
// 1. Single global variables
// var myApplication = (function () {
//   function() {
//     //...
//   },
//   return {
//     //...
//   }
// })();
```

Although this works for certain situations, the biggest challenge with the single global variable pattern is ensuring that no one else has used the same global variable name as we have in the page.

### 2. Prefix namespacing

One solution to the above problem, as mentioned by [Peter Michaux](http://michaux.ca/articles/javascript-namespacing), is to use prefix namespacing. It's a simple concept at heart, but the idea is we select a unique prefix namespace we wish to use (in this example, `myApplication_`) and then define any methods, variables or other objects after the prefix as follows:

```js
var myApplication_propertyA = {};
var myApplication_propertyB = {};
function myApplication_myMethod() {
  //...
}
```

This is effective from the perspective of decreasing the chances of a particular variable existing in the global scope, but remember that a uniquely named object can have the same effect.

This aside, the biggest issue with the pattern is that it can result in a large number of global objects once our application starts to grow. There is also quite a heavy reliance on our prefix not being used by any other developers in the global namespace, so be careful if opting to use this.

For more on Peter's views about the single global variable pattern, read his excellent post on them http://peter.michaux.ca/articles/javascript-namespacing.

### 3. Object literal notation

Object literal notation (which we also cover in the module pattern section of the book) can be thought of as an object containing a collection of key:value pairs with a colon separating each pair of keys and values where keys can also represent new namespaces.

```js
var myApplication = {
  // As we've seen, we can easily define functionality for
  // this object literal..
  getInfo: function () {
    //...
  },

  // but we can also populate it to support
  // further object namespaces containing anything
  // anything we wish:
  models: {},
  views: {
    pages: {},
  },
  collections: {},
};
```

One can also opt for adding properties directly to the namespace:

```js
myApplication.foo = function () {
  return 'bar';
};

myApplication.utils = {
  toString: function () {
    //...
  },
  export: function () {
    //...
  },
};
```

Object literals have the advantage of not polluting the global namespace but assist in organizing code and parameters logically. They are truly beneficial if we wish to create easily-readable structures that can be expanded to support deep nesting. Unlike simple global variables, object literals often also take into account tests for the existence of a variable by the same name so the chances of collision occurring are significantly reduced.

In the next sample, we demonstrate a number of different ways in which we can check to see if a variable (object or plugin namespace) already exists, defining it if it doesn't.

```js
// This doesn't check for existence of "myApplication" in
// the global namespace. Bad practice as we can easily
// clobber an existing variable/namespace with the same name
var myApplication = {};

// The following options *do* check for variable/namespace existence.
// If already defined, we use that instance, otherwise we assign a new
// object literal to myApplication.
//
// Option 1: var myApplication = myApplication || {};
// Option 2: if( !MyApplication ){ MyApplication = {} };
// Option 3: window.myApplication || ( window.myApplication = {} );
// Option 4: var myApplication = $.fn.myApplication = function() {};
// Option 5: var myApplication = myApplication === undefined ? {} : myApplication;
```

We'll often see developers opting for Option 1 or Option 2 - they are both straight-forward to understand and are equivalent in terms of their end-result.
Option 3 assumes that we're working in the global namespace, but it could also be written as:

```js
myApplication || (myApplication = {});
```

This variation assumes that `myApplication` has already been initialized and so it's only really useful for a parameter/argument scenario as in the following example:

```js
function foo() {
  myApplication || (myApplication = {});
}

// myApplication hasn't been initialized,
// so foo() throws a ReferenceError

foo();

// However accepting myApplication as an
// argument

function foo(myApplication) {
  myApplication || (myApplication = {});
}

foo();

// Even if myApplication === undefined, there is no error
// and myApplication gets set to {} correctly
```

Options 4 can be useful for writing jQuery plugins where:

```js
// If we were to define a new plugin..
var myPlugin = $.fn.myPlugin = function() { ... };

// Then later rather than having to type:
$.fn.myPlugin.defaults = {};

// We can do:
myPlugin.defaults = {};
```

This results in better compression (minification) and can save on scope lookups.

Option 5 is a little similar to Option 4, but is a long-form which evaluates whether `myApplication` is `undefined` inline such that it's defined as an object if not, otherwise set to an existing value for `myApplication` if so.

It is shown just for the sake of being thorough but in most situations, Options 1-4 will more than suffice for most needs.
There is of course a great deal of variance in how and where object literals are used for organizing and structuring code. For smaller applications wishing to expose a nested API for a particular self-enclosed module, we may just find ourselves using the Revealing Module Pattern, which we covered earlier in the book:

```js
var namespace = (function () {

    // defined within the local scope
    var privateMethod1 = function () { /* ... */ },
        privateMethod2 = function () { /* ... */ },
        privateProperty1 = "foobar";

  return {

    // the object literal returned here can have as many
    // nested depths as we wish, however as mentioned,
    // this way of doing things works best for smaller,
    // limited-scope applications in my personal opinion
    publicMethod1: privateMethod1,

    // nested namespace with public properties
    properties: {
        publicProperty1: privateProperty1
    },

    // another tested namespace
    utils: {
        publicMethod2: privateMethod2
    }
    ...
  }
})();
```

The benefit of object literals is that they offer us a very elegant key/value syntax to work with; one where we're able to easily encapsulate any distinct logic or functionality for our application in a way that clearly separates it from others and provides a solid foundation for extending our code.

A possible downside however is that object literals have the potential to grow into long syntactic constructs. Opting to take advantage of the nested namespace pattern (which also uses the same pattern as its base)

This pattern has a number of other useful applications too. In addition to namespacing, it's often of benefit to decouple the default configuration for our application into a single area that can be easily modified without the need to search through our entire codebase just to alter them - object literals work great for this purpose. Here's an example of a hypothetical object literal for configuration:

```js
var myConfig = {
  language: 'english',

  defaults: {
    enableGeolocation: true,
    enableSharing: false,
    maxPhotos: 20,
  },

  theme: {
    skin: 'a',
    toolbars: {
      index: 'ui-navigation-toolbar',
      pages: 'ui-custom-toolbar',
    },
  },
};
```

Note that JSON is a subset of object literal notation and there are really only minor syntactical differences between it and the above (e.g JSON keys must be strings). If for any reason one wishes to use JSON for storing configuration data instead (e.g. for simpler storage when sending to the back-end), feel free to. For more on the object literal pattern, I recommend reading Rebecca Murphey's excellent article on the topic as she covers a few areas we didn't touch upon.

### 4. Nested namespacing

An extension of the object literal pattern is nested namespacing. It's another common pattern used that offers a lower risk of collision due to the fact that even if a namespace already exists, it's unlikely the same nested children do.

Does this look familiar?

```js
YAHOO.util.Dom.getElementsByClassName('test');
```

Older versions of Yahoo!'s YUI library use the nested object namespacing pattern regularly. During my time as an engineer at AOL, we also used this pattern in many of our larger applications. A sample implementation of nested namespacing may look like this:

```js
var myApp = myApp || {};

// perform a similar existence check when defining nested
// children
myApp.routers = myApp.routers || {};
myApp.model = myApp.model || {};
myApp.model.special = myApp.model.special || {};

// nested namespaces can be as complex as required:
// myApp.utilities.charting.html5.plotGraph(/*..*/);
// myApp.modules.financePlanner.getSummary();
// myApp.services.social.facebook.realtimeStream.getLatest();
```

**Note: The above differs from how YUI3 approaches namespacing as modules there use a sandboxed API host object with far less and far shallower namespacing.**

We can also opt to declare new nested namespaces/properties as indexed properties as follows:

```js
myApp['routers'] = myApp['routers'] || {};
myApp['models'] = myApp['models'] || {};
myApp['controllers'] = myApp['controllers'] || {};
```

Both options are readable, organized and offer a relatively safe way of namespacing our application in a similar fashion to what we may be used to in other languages. The only real caveat however is that it requires our browser's JavaScript engine first locating the myApp object and then digging down until it gets to the function we actually wish to use.

This can mean an increased amount of work to perform lookups, however developers such as [Juriy Zaytsev](https://twitter.com/kangax) have previously tested and found the performance differences between single object namespacing vs the "nested" approach to be quite negligible.

### 5. Immediately-invoked Function Expressions (IIFE)s

Earlier in the book, we briefly covered the concept of an [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) (immediately-invoked function expression) which is effectively an unnamed function, immediately invoked after it's been defined. If it sounds familiar it's because you may have previous come across it referred to as a self-executing (or self-invoked) anonymous function, however I personally feel Ben Alman's IIFE naming is more accurate. In JavaScript, because both variables and functions explicitly defined within such a context may only be accessed inside of it, function invocation provides an easy means to achieving privacy.

IIFEs are a popular approach to encapsulating application logic to protect it from the global namespace but also have their use in the world of namespacing.

Examples of IIFEs can be found below:

```js
// an (anonymous) immediately-invoked function expression
(function () {
  /*...*/
})();

// a named immediately-invoked function expression
(function foobar() {
  /*..*/
})();
```

Examples of self-executing functions, which are quite different than IIFEs, can be found below:

```js
// named self-executing function
function foobar() {
  foobar();
}

// anonymous self-executing function
var foobar = function () {
  arguments.callee();
};
```

Back to the IIFEs, a slightly more expanded version of the first IIFE example might look like:

```js
var namespace = namespace || {};

// here a namespace object is passed as a function
// parameter, where we assign public methods and
// properties to it
(function (o) {
  o.foo = 'foo';
  o.bar = function () {
    return 'bar';
  };
})(namespace);

console.log(namespace);
```

Whilst readable, this example could be significantly expanded on to address common development concerns such as defined levels of privacy (public/private functions and variables) as well as convenient namespace extension. Let's go through some more code:

```js
// namespace (our namespace name) and undefined are passed here
// to ensure 1. namespace can be modified locally and isn't
// overwritten outside of our function context
// 2. the value of undefined is guaranteed as being truly
// undefined. This is to avoid issues with undefined being
// mutable pre-ES5.

(function (namespace, undefined) {
  // private properties
  var foo = 'foo',
    bar = 'bar';

  // public methods and properties
  namespace.foobar = 'foobar';

  namespace.say = function (msg) {
    speak(msg);
  };

  namespace.sayHello = function () {
    namespace.say('hello world');
  };

  // private method
  function speak(msg) {
    console.log('You said: ' + msg);
  }

  // check to evaluate whether "namespace" exists in the
  // global namespace - if not, assign window.namespace an
  // object literal
})((window.namespace = window.namespace || {}));

// we can then test our properties and methods as follows

// public

// Outputs: foobar
console.log(namespace.foobar);

// Outputs: You said: hello world
namespace.sayHello();

// assigning new properties
namespace.foobar2 = 'foobar';

// Outputs: foobar
console.log(namespace.foobar2);
```

Extensibility is of course key to any scalable namespacing pattern and IIFEs can be used to achieve this quite easily. In the below example, our "namespace" is once again passed as an argument to our anonymous function and is then extended (or decorated) with further functionality:

```js
// let's extend the namespace with new functionality
(function (namespace, undefined) {
  // public method
  namespace.sayGoodbye = function () {
    namespace.say('goodbye');
  };
})((window.namespace = window.namespace || {}));

// Outputs: goodbye
namespace.sayGoodbye();
```

If you would like to find out more about this pattern, I recommend reading Ben's IIFE post for more information.

### 6. Namespace injection

Namespace injection is another variation on the IIFE where we "inject" the methods and properties for a specific namespace from within a function wrapper using `this` as a namespace proxy. The benefit this pattern offers is easy application of functional behaviour to multiple objects or namespaces and can come in useful when applying a set of base methods to be built on later (e.g. getters and setters).

The disadvantages of this pattern are that there may be easier or more optimal approaches to achieving this goal (e.g. deep object extension / merging) which I cover earlier in the section.

Below we can see an example of this pattern in action, where we use it to populate the behaviour for two namespaces: one initially defined (utils) and another which we dynamically create as a part of the functionality assignment for utils (a new namespace called `tools`).

```js
var myApp = myApp || {};
myApp.utils = {};

(function () {
  var val = 5;

  this.getValue = function () {
    return val;
  };

  this.setValue = function (newVal) {
    val = newVal;
  };

  // also introduce a new sub-namespace
  this.tools = {};
}.apply(myApp.utils));

// inject new behaviour into the tools namespace
// which we defined via the utilities module

(function () {
  this.diagnose = function () {
    return 'diagnosis';
  };
}.apply(myApp.utils.tools));

// note, this same approach to extension could be applied
// to a regular IIFE, by just passing in the context as
// an argument and modifying the context rather than just
// "this"

// Usage:

// Outputs our populated namespace
console.log(myApp);

// Outputs: 5
console.log(myApp.utils.getValue());

// Sets the value of `val` and returns it
myApp.utils.setValue(25);
console.log(myApp.utils.getValue());

// Testing another level down
console.log(myApp.utils.tools.diagnose());
```

Angus Croll has also [previously](https://msdn.microsoft.com/en-us/scriptjunkie/gg578608) suggested the idea of using the call API to provide a natural separation between contexts and arguments. This pattern can feel a lot more like a module creator, but as modules still offer an encapsulation solution, we'll briefly cover it for the sake of thoroughness:

```js
// define a namespace we can use later
var ns = ns || {},
  ns2 = ns2 || {};

// the module/namespace creator
var creator = function (val) {
  var val = val || 0;

  this.next = function () {
    return val++;
  };

  this.reset = function () {
    val = 0;
  };
};

creator.call(ns);

// ns.next, ns.reset now exist
creator.call(ns2, 5000);

// ns2 contains the same methods
// but has an overridden value for val
// of 5000
```

As mentioned, this type of pattern is useful for assigning a similar base set of functionality to multiple modules or namespaces. I would however only really suggest using it where explicitly declaring functionality within an object/closure for direct access doesn't make sense.

## Advanced namespacing patterns

We'll now explore some advanced patterns and utilities that I have found invaluable when working on larger applications - some of which have required a re-think of traditional approaches to application namespacing. I'll note that I am not advocating any of the following as _the_ way to namespace, but rather ways that I have found work in practice.

### Automating nested namespacing

As we've reviewed, nested namespaces can provide an organized hierarchy of structure for a unit of code. An example of such a namespace could be the following: _application.utilities.drawing.canvas.2d_. This can also be expanded using the object literal pattern to be:

```js
var application = {
  utilities: {
    drawing: {
      canvas: {
        2d:{
          //...
        }
      }
    }
  }
};
```

One of the obvious challenges with this pattern is that each additional layer we wish to create requires yet another object to be defined as a child of some parent in our top-level namespace. This can become particularly laborious when multiple depths are required as our application increases in complexity.

How can this problem be better solved? In [JavaScript Patterns](https://www.amazon.com/JavaScript-Patterns-Stoyan-Stefanov/dp/0596806752), [Stoyan Stefanov](http://jspatterns.com/) presents a very-clever approach for automatically defining nested namespaces under an existing global variable. He suggests a convenience method that takes a single string argument for a nest, parses this and automatically populates our base namespace with the objects required.

The method he suggests using is the following, which I've updated it to be a generic function for easier re-use with multiple namespaces:

```js
// top-level namespace being assigned an object literal
var myApp = myApp || {};

// a convenience function for parsing string namespaces and
// automatically generating nested namespaces
function extend(ns, ns_string) {
  var parts = ns_string.split('.'),
    parent = ns,
    pl;

  pl = parts.length;

  for (var i = 0; i < pl; i++) {
    // create a property if it doesn't exist
    if (typeof parent[parts[i]] === 'undefined') {
      parent[parts[i]] = {};
    }

    parent = parent[parts[i]];
  }

  return parent;
}

// Usage:
// extend myApp with a deeply nested namespace
var mod = extend(myApp, 'modules.module2');

// the correct object with nested depths is output
console.log(mod);

// minor test to check the instance of mod can also
// be used outside of the myApp namesapce as a clone
// that includes the extensions

// Outputs: true
console.log(mod == myApp.modules.module2);

// further demonstration of easier nested namespace
// assignment using extend
extend(myApp, 'moduleA.moduleB.moduleC.moduleD');
extend(myApp, 'longer.version.looks.like.this');
console.log(myApp);
```

Web inspector output:

![Web inspector output](https://addyosmani.com/resources/essentialjsdesignpatterns/book/images/ns1.png 'Web inspector output')

Where one would previously have had to explicitly declare the various nests for their namespace as objects, this can now be easily achieved using a single, cleaner line of code.

### Dependency declaration pattern

We're now going to explore a minor augmentation to the nested namespacing pattern which we'll refer to as the Dependency Declaration pattern. We all know that local references to objects can decrease overall lookup times, but let's apply this to namespacing to see how it might look in practice:

```js
// common approach to accessing nested namespaces
myApp.utilities.math.fibonacci(25);
myApp.utilities.math.sin(56);
myApp.utilities.drawing.plot(98, 50, 60);

// with local/cached references
var utils = myApp.utilities,
  maths = utils.math,
  drawing = utils.drawing;

// easier to access the namespace
maths.fibonacci(25);
maths.sin(56);
drawing.plot(98, 50, 60);

// note that the above is particularly performant when
// compared to hundreds or thousands of calls to nested
// namespaces vs. a local reference to the namespace
```

Working with a local variable here is almost always faster than working with a top-level global (e.g.myApp). It's also both more convenient and more performant than accessing nested properties/sub-namespaces on every subsequent line and can improve readability in more complex applications.

Stoyan recommends declaring localized namespaces required by a function or module at the top of our function scope (using the single-variable pattern) and calls this a dependency declaration pattern. One of the benefits this offers is a decrease in locating dependencies and resolving them, should we have an extendable architecture that dynamically loads modules into our namespace when required.

In my opinion this pattern works best when working at a modular level, localizing a namespace to be used by a group of methods. Localizing namespaces on a per-function level, especially where there is significant overlap between namespace dependencies would be something I would recommend avoiding where possible. Instead, define it further up and just have them all access the same reference.

### Deep object extension

An alternative approach to automatic namespacing is deep object extension. Namespaces defined using object literal notation may be easily extended (or merged) with other objects (or namespaces) such that the properties and functions of both namespaces can be accessible under the same namespace post-merge.

This is something that's been made fairly easy to accomplish with modern JavaScript frameworks (e.g. see jQuery's [$.extend](https://api.jquery.com/jQuery.extend/)), however, if looking to extend object (namespaces) using vanilla JS, the following routine may be of assistance.

```js
// extend.js
// Written by Andrew Dupont, optimized by Addy Osmani

function extend(destination, source) {
  var toString = Object.prototype.toString,
    objTest = toString.call({});

  for (var property in source) {
    if (source[property] && objTest === toString.call(source[property])) {
      destination[property] = destination[property] || {};
      extend(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }

  return destination;
}

console.group('objExtend namespacing tests');

// define a top-level namespace for usage
var myNS = myNS || {};

// 1. extend namespace with a "utils" object
extend(myNS, {
  utils: {
    //...
  },
});

console.log('test 1', myNS);
// myNS.utils now exists

// 2. extend with multiple depths (namespace.hello.world.wave)
extend(myNS, {
  hello: {
    world: {
      wave: {
        test: function () {
          //...
        },
      },
    },
  },
});

// test direct assignment works as expected
myNS.hello.test1 = 'this is a test';
myNS.hello.world.test2 = 'this is another test';
console.log('test 2', myNS);

// 3. what if myNS already contains the namespace being added
// (e.g. "library")? we want to ensure no namespaces are being
// overwritten during extension

myNS.library = {
  foo: function () {},
};

extend(myNS, {
  library: {
    bar: function () {
      //...
    },
  },
});

// confirmed that extend is operating safely (as expected)
// myNS now also contains library.foo, library.bar
console.log('test 3', myNS);

// 4. what if we wanted easier access to a specific namespace without having
// to type the whole namespace out each time?

var shorterAccess1 = myNS.hello.world;
shorterAccess1.test3 = 'hello again';
console.log('test 4', myNS);

//success, myApp.hello.world.test3 is now "hello again"

console.groupEnd();
```

**Note:** The above implementation is not cross-browser compatible for all objects and should be considered a proof-of-concept only. One may find the Underscore.js `extend()` method a simpler, more cross-browser implementation to start with http://documentcloud.github.io/underscore/docs/underscore.html#section-82.

For developers that are going to use jQuery in their application, one can achieve the exact same object namespace extensibility with `$.extend` as follows:

```js
// top-level namespace
var myApp = myApp || {};

// directly assign a nested namespace
myApp.library = {
  foo: function () {
    //...
  },
};

// deep extend/merge this namespace with another
// to make things interesting, let's say it's a namespace
// with the same name but with a different function
// signature: $.extend( deep, target, object1, object2 )
$.extend(true, myApp, {
  library: {
    bar: function () {
      //...
    },
  },
});

console.log('test', myApp);
// myApp now contains both library.foo() and library.bar() methods
// nothing has been overwritten which is what we're hoping for.
```

For the sake of thoroughness, please see [here](https://gist.github.com/1221980) for jQuery $.extend equivalents to the rest of the namespacing experiments found in this section.

### Recommendation

Reviewing the namespace patterns we've explored in this section, the option that I would personally use for most larger applications is nested object namespacing with the object literal pattern. Where possible, I would implement this using automated nested namespacing, however this is just a personal preference.

IIFEs and single global variables may work fine for applications in the small to medium range, however, larger codebases requiring both namespaces and deep sub-namespaces require a succinct solution that promotes readability and scales. I feel this pattern achieves all of these objectives well.

I would also recommend trying out some of the suggested advanced utility methods for namespace extension as they really can save us time in the long-run.
