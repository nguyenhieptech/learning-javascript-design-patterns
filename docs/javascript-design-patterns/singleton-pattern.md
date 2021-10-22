---
sidebar_position: 4
---

# Singleton Pattern

The Singleton pattern is thus known because it restricts instantiation of a class to a single object. Classically, the Singleton pattern can be implemented by creating a class with a method that creates a new instance of the class if one doesn't exist. In the event of an instance already existing, it simply returns a reference to that object.

Singletons differ from static classes (or objects) as we can delay their initialization, generally because they require some information that may not be available during initialization time. They don't provide a way for code that is unaware of a previous reference to them to easily retrieve them. This is because it is neither the object or "class" that's returned by a Singleton, it's a structure. Think of how closured variables aren't actually closures - the function scope that provides the closure is the closure.

In JavaScript, Singletons serve as a shared resource namespace which isolate implementation code from the global namespace so as to provide a single point of access for functions.

We can implement a Singleton as follows:

```js
var mySingleton = (function () {
  // Instance stores a reference to the Singleton
  var instance;

  function init() {
    // Singleton

    // Private methods and variables
    function privateMethod() {
      console.log('I am private');
    }

    var privateVariable = 'Im also private';

    var privateRandomNumber = Math.random();

    return {
      // Public methods and variables
      publicMethod: function () {
        console.log('The public can see me!');
      },

      publicProperty: 'I am also public',

      getRandomNumber: function () {
        return privateRandomNumber;
      },
    };
  }

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    },
  };
})();

var myBadSingleton = (function () {
  // Instance stores a reference to the Singleton
  var instance;

  function init() {
    // Singleton

    var privateRandomNumber = Math.random();

    return {
      getRandomNumber: function () {
        return privateRandomNumber;
      },
    };
  }

  return {
    // Always create a new Singleton instance
    getInstance: function () {
      instance = init();

      return instance;
    },
  };
})();

// Usage:

var singleA = mySingleton.getInstance();
var singleB = mySingleton.getInstance();
console.log(singleA.getRandomNumber() === singleB.getRandomNumber()); // true

var badSingleA = myBadSingleton.getInstance();
var badSingleB = myBadSingleton.getInstance();
console.log(badSingleA.getRandomNumber() !== badSingleB.getRandomNumber()); // true

// Note: as we are working with random numbers, there is a
// mathematical possibility both numbers will be the same,
// however unlikely. The above example should otherwise still
// be valid.
```

What makes the Singleton is the global access to the instance (generally through `MySingleton.getInstance()`) as we don't (at least in static languages) call `new MySingleton()` directly. This is however possible in JavaScript.

In the GoF book, the _applicability_ of the Singleton pattern is described as follows:

- There must be exactly one instance of a class, and it must be accessible to clients from a well-known access point.
- When the sole instance should be extensible by subclassing, and clients should be able to use an extended instance without modifying their code.

The second of these points refers to a case where we might need code such as:

```js
mySingleton.getInstance = function () {
  if (this._instance == null) {
    if (isFoo()) {
      this._instance = new FooSingleton();
    } else {
      this._instance = new BasicSingleton();
    }
  }
  return this._instance;
};
```

Here, `getInstance` becomes a little like a Factory method and we don't need to update each point in our code accessing it. `FooSingleton` above would be a subclass of `BasicSingleton` and implement the same interface.

Why is deferring execution considered important for a Singleton?:

> In C++ it serves to isolate from the unpredictability of the order of dynamic initialization, returning control to the programmer.

It is important to note the difference between a static instance of a class (object) and a Singleton: whilst a Singleton can be implemented as a static instance, it can also be constructed lazily, without the need for resources nor memory until this is actually needed.

If we have a static object that can be initialized directly, we need to ensure the code is always executed in the same order (e.g in case `objCar` needs `objWheel` during its initialization) and this doesn't scale when you have a large number of source files.

Both Singletons and static objects are useful but they shouldn't be overused - the same way in which we shouldn't overuse other patterns.

In practice, the Singleton pattern is useful when exactly one object is needed to coordinate others across a system. Here is one example with the pattern being used in this context:

```js
var SingletonTester = (function () {
  // options: an object containing configuration options for the singleton
  // e.g var options = { name: "test", pointX: 5};
  function Singleton(options) {
    // set options to the options supplied
    // or an empty object if none are provided
    options = options || {};

    // set some properties for our singleton
    this.name = 'SingletonTester';

    this.pointX = options.pointX || 6;

    this.pointY = options.pointY || 10;
  }

  // our instance holder
  var instance;

  // an emulation of static variables and methods
  var _static = {
    name: 'SingletonTester',

    // Method for getting an instance. It returns
    // a singleton instance of a singleton object
    getInstance: function (options) {
      if (instance === undefined) {
        instance = new Singleton(options);
      }

      return instance;
    },
  };

  return _static;
})();

var singletonTest = SingletonTester.getInstance({
  pointX: 5,
});

// Log the output of pointX just to verify it is correct
// Outputs: 5
console.log(singletonTest.pointX);
```

Whilst the Singleton has valid uses, often when we find ourselves needing it in JavaScript it's a sign that we may need to re-evaluate our design.

They're often an indication that modules in a system are either tightly coupled or that logic is overly spread across multiple parts of a codebase. Singletons can be more difficult to test due to issues ranging from hidden dependencies, the difficulty in creating multiple instances, difficulty in stubbing dependencies and so on.

Miller Medeiros has previously recommended [this](https://www.ibm.com/developerworks/webservices/library/co-single/index.html) excellent article on the Singleton and its various issues for further reading as well as the comments to [this](http://misko.hevery.com/2008/10/21/dependency-injection-myth-reference-passing/) article, discussing how Singletons can increase tight coupling. I'm happy to second these recommendations as both pieces raise many important points about this pattern that are also worth noting.
