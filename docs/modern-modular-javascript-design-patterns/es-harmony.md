---
sidebar_position: 4
---

# ES Harmony

## Modules Of The Future

[TC39](https://www.ecma-international.org/memento/TC39.htm), the standards body charged with defining the syntax and semantics of ECMAScript and its future iterations is composed of a number of very intelligent developers. Some of these developers (such as [Alex Russell](https://twitter.com/slightlylate)) have been keeping a close eye on the evolution of JavaScript usage for large-scale development over the past few years and are acutely aware of the need for better language features for writing more modular JS.

For this reason, there are currently proposals for a number of exciting additions to the language including flexible [modules](http://wiki.ecmascript.org/doku.php?id=harmony:modules) that can work on both the client and server, a [module loader](http://wiki.ecmascript.org/doku.php?id=harmony:module_loaders) and [more](http://wiki.ecmascript.org/doku.php?id=harmony:proposals). In this section, we'll explore code samples using the syntax proposed for modules in ES.next so we can get a taste of what's to come.

**Note:** Although Harmony is still in the proposal phases, we can already try out (partial) features of ES.next that address native support for writing modular JavaScript thanks to Google's [Traceur](https://code.google.com/p/traceur-compiler/) compiler. To get up and running with Traceur in under a minute, read this [getting started](https://code.google.com/p/traceur-compiler/wiki/GettingStarted) guide. There's also a JSConf [presentation](https://traceur-compiler.googlecode.com/svn/branches/v0.10/presentation/index.html) about it that's worth looking at if interested in learning more about the project.

## Modules With Imports And Exports

Having read through the sections on AMD and CommonJS modules you may be familiar with the concept of module dependencies (imports) and module exports (or, the public API/variables we allow other modules to consume). In ES.next, these concepts have been proposed in a slightly more succinct manner with dependencies being specified using an `import` keyword. `export` isn't greatly different to what we might expect and many developers will look at the code samples lower down and instantly grab them.

- **import** declarations bind a modules exports as local variables and may be renamed to avoid name collisions/conflicts.
- **export** declarations declare that a local-binding of a module is externally visible such that other modules may read the exports but can't modify them. Interestingly, modules may export child modules but can't export modules that have been defined elsewhere. We can also rename exports so their external name differs from their local names.

```js
module staff{
  // specify (public) exports that can be consumed by
  // other modules
  export var baker = {
    bake: function( item ){
      console.log( "Woo! I just baked " + item );
    }
  }
}

module skills{
  export var specialty = "baking";
  export var experience = "5 years";
}

module cakeFactory{
  // specify dependencies
  import baker from staff;

  // import everything with wildcards
  import * from skills;

  export var oven = {
    makeCupcake: function( toppings ){
      baker.bake( "cupcake", toppings );
    },
    makeMuffin: function( mSize ){
      baker.bake( "muffin", size );
    }
  }
}
```

## Modules Loaded From Remote Sources

The module proposals also cater for modules which are remotely based (e.g. a third-party libraries) making it simplistic to load modules in from external locations. Here's an example of pulling in the module we defined above and utilizing it:

```js
module cakeFactory from "http://addyosmani.com/factory/cakes.js";
cakeFactory.oven.makeCupcake( "sprinkles" );
cakeFactory.oven.makeMuffin( "large" );
```

## Module Loader API

The module loader proposed describes a dynamic API for loading modules in highly controlled contexts. Signatures supported on the loader include `load(url, moduleInstance, error)` for loading modules, `createModule(object, globalModuleReferences)` and [others](http://wiki.ecmascript.org/doku.php?id=harmony:module_loaders).

Here's another example for dynamically loading in the module we initially defined. Note that unlike the last example where we pulled in a module from a remote source, the module loader API is better suited to dynamic contexts.

```js
Loader.load('http://addyosmani.com/factory/cakes.js', function (cakeFactory) {
  cakeFactory.oven.makeCupcake('chocolate');
});
```

## CommonJS-like Modules For The Server

For developers who are more interested in server environments, the module system proposed for ES.next isn't just constrained to looking at modules in the browser. Below for example, we can see a CommonJS-like module proposed for use on the server:

```js
// io/File.js
export function open( path ) { ... };
export function close( hnd ) { ... };
```

```js
// compiler/LexicalHandler.js
module file from "io/File";

import { open, close } from file;
export function scan( in ) {
  try {
    var h = open( in ) ...
  }
  finally { close( h ) }
}
```

```js
module lexer from "compiler/LexicalHandler";
module stdlib from "@std";

//... scan(cmdline[0]) ...
```

## Classes With Constructors, Getters & Setters

The notion of a class has always been a contentious issue with purists and we've so far got along with either falling back on JavaScript's [prototypal](http://javascript.crockford.com/prototypal.html) nature or through using frameworks or abstractions that offer the ability to use class definitions in a form that de-sugars to the same prototypal behavior.

In Harmony, classes have been proposed for the language along with constructors and (finally) some sense of true privacy. In the following examples, inline comments are provided to help explain how classes are structured.

Reading through, one may also notice the lack of the word "function" in here. This isn't a typo error: TC39 have been making a conscious effort to decrease our abuse of the `function` keyword for everything and the hope is that this will help simplify how we write code.

```js
class Cake {
  // We can define the body of a class" constructor
  // function by using the keyword "constructor" followed
  // by an argument list of public and private declarations.
  constructor(name, toppings, price, cakeSize) {
    public name = name;
    public cakeSize = cakeSize;
    public toppings = toppings;
    private price = price;
  }

  // As a part of ES.next's efforts to decrease the unnecessary
  // use of "function" for everything, you'll notice that it's
  // dropped for cases such as the following. Here an identifier
  // followed by an argument list and a body defines a new method

  addTopping(topping) {
    public(this).toppings.push(topping);
  }

  // Getters can be defined by declaring get before
  // an identifier/method name and a curly body.
  get allToppings() {
    return public(this).toppings;
  }

  get qualifiesForDiscount() {
    return private(this).price > 5;
  }

  // Similar to getters, setters can be defined by using
  // the "set" keyword before an identifier
  set cakeSize(cSize) {
    if (cSize < 0) {
      throw new Error('Cake must be a valid size - either small, medium or large');
    }
    public(this).cakeSize = cSize;
  }
}
```

## ES Harmony Conclusions

As we've seen, Harmony might come with some exciting new additions that will ease the development of modular applications and handling concerns such as dependency management.

At present, our best options for using Harmony syntax in today's browsers is through a transpiler such as [Google Traceur](https://code.google.com/p/traceur-compiler/) or [Esprima](http://esprima.googlecode.com/). There are also projects such as [Require HM](https://github.com/addyosmani/require-hm) which allow us to use Harmony modules with AMD. Our best bets however until we have specification finalization are AMD (for in-browser modules) and CommonJS (for those on the server).

## Related Reading

[A First Look At The Upcoming JavaScript Modules](http://www.2ality.com/2011/03/first-look-at-upcoming-javascript.html)

[David Herman On JavaScript/ES.Next (Video)](https://blog.mozilla.com/dherman/2011/02/23/my-js-meetup-talk/)

[ES Harmony Module Proposals](http://wiki.ecmascript.org/doku.php?id=harmony:modules)

[ES Harmony Module Semantics/Structure Rationale](http://wiki.ecmascript.org/doku.php?id=harmony:modules_rationale)

[ES Harmony Class Proposals](http://wiki.ecmascript.org/doku.php?id=harmony:classes)
