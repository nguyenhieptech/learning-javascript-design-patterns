---
sidebar_position: 12
---

# Decorator Pattern

Decorators are a structural design pattern that aim to promote code re-use. Similar to Mixins, they can be considered another viable alternative to object sub-classing.

Classically, Decorators offered the ability to add behaviour to existing classes in a system dynamically. The idea was that the _decoration_ itself wasn't essential to the base functionality of the class, otherwise it would be baked into the superclass itself.

They can be used to modify existing systems where we wish to add additional features to objects without the need to heavily modify the underlying code using them. A common reason why developers use them is their applications may contain features requiring a large quantity of distinct types of object. Imagine having to define hundreds of different object constructors for say, a JavaScript game

The object constructors could represent distinct player types, each with differing capabilities. A Lord of the Rings game could require constructors for `Hobbit`, `Elf`, `Orc`, `Wizard`, `Mountain Giant`, `Stone Giant` and so on, but there could easily be hundreds of these. If we then factored in capabilities, imagine having to create sub-classes for each combination of capability type e.g `HobbitWithRing`, `HobbitWithSword`, `HobbitWithRingAndSword` and so on.This isn't very practical and certainly isn't manageable when we factor in a growing number of different abilities.

The Decorator pattern isn't heavily tied to how objects are created but instead focuses on the problem of extending their functionality. Rather than just relying on prototypal inheritance, we work with a single base object and progressively add decorator objects which provide the additional capabilities. The idea is that rather than sub-classing, we add (decorate) properties or methods to a base object so it's a little more streamlined.

Adding new attributes to objects in JavaScript is a very straight-forward process so with this in mind, a very simplistic decorator may be implemented as follows:

## Example 1: Decorating Constructors With New Functionality

```js
// A vehicle constructor
function Vehicle(vehicleType) {
  // some sane defaults
  this.vehicleType = vehicleType || 'car';
  this.model = 'default';
  this.license = '00000-000';
}

// Test instance for a basic vehicle
var testInstance = new Vehicle('car');
console.log(testInstance);

// Outputs:
// vehicle: car, model:default, license: 00000-000

// Lets create a new instance of vehicle, to be decorated
var truck = new Vehicle('truck');

// New functionality we're decorating vehicle with
truck.setModel = function (modelName) {
  this.model = modelName;
};

truck.setColor = function (color) {
  this.color = color;
};

// Test the value setters and value assignment works correctly
truck.setModel('CAT');
truck.setColor('blue');

console.log(truck);

// Outputs:
// vehicle:truck, model:CAT, color: blue

// Demonstrate "vehicle" is still unaltered
var secondInstance = new Vehicle('car');
console.log(secondInstance);

// Outputs:
// vehicle: car, model:default, license: 00000-000
```

This type of simplistic implementation is functional, but it doesn't really demonstrate all of the strengths Decorators have to offer. For this, we're first going to go through my variation of the Coffee example from an excellent book called _Head First Design Patterns_ by Freeman, Sierra and Bates, which is modeled around a Macbook purchase.

## Example 2: Decorating Objects With Multiple Decorators

```js
// The constructor to decorate
function MacBook() {
  this.cost = function () {
    return 997;
  };
  this.screenSize = function () {
    return 11.6;
  };
}

// Decorator 1
function memory(macbook) {
  var v = macbook.cost();
  macbook.cost = function () {
    return v + 75;
  };
}

// Decorator 2
function engraving(macbook) {
  var v = macbook.cost();
  macbook.cost = function () {
    return v + 200;
  };
}

// Decorator 3
function insurance(macbook) {
  var v = macbook.cost();
  macbook.cost = function () {
    return v + 250;
  };
}

var mb = new MacBook();
memory(mb);
engraving(mb);
insurance(mb);

// Outputs: 1522
console.log(mb.cost());

// Outputs: 11.6
console.log(mb.screenSize());
```

In the above example, our Decorators are overriding the `MacBook()` super-class objects `.cost()` function to return the current price of the `Macbook` plus the cost of the upgrade being specified.

It's considered a decoration as the original `Macbook` objects constructor methods which are not overridden (e.g. `screenSize()`) as well as any other properties which we may define as a part of the `Macbook` remain unchanged and intact.

There isn't really a defined interface in the above example and we're shifting away the responsibility of ensuring an object meets an interface when moving from the creator to the receiver.

## Pseudo-classical Decorators

We're now going to examine a variation of the Decorator first presented in a JavaScript form in _Pro JavaScript Design Patterns_ (PJDP) by Dustin Diaz and Ross Harmes.

Unlike some of the examples from earlier, Diaz and Harmes stick more closely to how decorators are implemented in other programming languages (such as Java or C++) using the concept of an "interface", which we will define in more detail shortly.

**Note**: This particular variation of the Decorator pattern is provided for reference purposes. If finding it overly complex, I recommend opting for one of the simpler implementations covered earlier.

### Interfaces

PJDP describes the Decorator as a pattern that is used to transparently wrap objects inside other objects of the same interface. An interface is a way of defining the methods an object **should** have, however, it doesn't actually directly specify how those methods should be implemented.

They can also indicate what parameters the methods take, but this is considered optional.

So, why would we use an interface in JavaScript? The idea is that they're self-documenting and promote reusability. In theory, interfaces also make code more stable by ensuring changes to them must also be made to the objects implementing them.

Below is an example of an implementation of interfaces in JavaScript using duck-typing - an approach that helps determine whether an object is an instance of constructor/object based on the methods it implements.

```js
// Create interfaces using a pre-defined Interface
// constructor that accepts an interface name and
// skeleton methods to expose.

// In our reminder example summary() and placeOrder()
// represent functionality the interface should
// support
var reminder = new Interface('List', ['summary', 'placeOrder']);

var properties = {
  name: 'Remember to buy the milk',
  date: '05/06/2016',
  actions: {
    summary: function () {
      return 'Remember to buy the milk, we are almost out!';
    },
    placeOrder: function () {
      return 'Ordering milk from your local grocery store';
    },
  },
};

// Now create a constructor implementing the above properties
// and methods

function Todo(config) {
  // State the methods we expect to be supported
  // as well as the Interface instance being checked
  // against

  Interface.ensureImplements(config.actions, reminder);

  this.name = config.name;
  this.methods = config.actions;
}

// Create a new instance of our Todo constructor

var todoItem = new Todo(properties);

// Finally test to make sure these function correctly

console.log(todoItem.methods.summary());
console.log(todoItem.methods.placeOrder());

// Outputs:
// Remember to buy the milk, we are almost out!
// Ordering milk from your local grocery store
```

In the above, `Interface.ensureImplements` provides strict functionality checking and code for both this and the `Interface` constructor can be found [here](https://gist.github.com/addyosmani/1057989).

The biggest problem with interfaces is that, as there isn't built-in support for them in JavaScript, there is a danger of us attempting to emulate a feature of another language that may not be an ideal fit. Lightweight interfaces can be used without a great performance cost however and we will next look at _Abstract_ Decorators using this same concept.

### Abstract Decorators

To demonstrate the structure of this version of the Decorator pattern, we're going to imagine we have a superclass that models a `Macbook` once again and a store that allows us to "decorate" our Macbook with a number of enhancements for an additional fee.

Enhancements can include upgrades to 4GB or 8GB Ram, engraving, Parallels or a case. Now if we were to model this using an individual sub-class for each combination of enhancement options, it might look something like this:

```js
var Macbook = function () {
  //...
};

var MacbookWith4GBRam = function () {},
  MacbookWith8GBRam = function () {},
  MacbookWith4GBRamAndEngraving = function () {},
  MacbookWith8GBRamAndEngraving = function () {},
  MacbookWith8GBRamAndParallels = function () {},
  MacbookWith4GBRamAndParallels = function () {},
  MacbookWith8GBRamAndParallelsAndCase = function () {},
  MacbookWith4GBRamAndParallelsAndCase = function () {},
  MacbookWith8GBRamAndParallelsAndCaseAndInsurance = function () {},
  MacbookWith4GBRamAndParallelsAndCaseAndInsurance = function () {};
```

and so on.

This would be an impractical solution as a new subclass would be required for every possible combination of enhancements that are available. As we would prefer to keep things simple without maintaining a large set of subclasses, let's look at how decorators may be used to solve this problem better.

Rather than requiring all of the combinations we saw earlier, we should simply have to create five new decorator classes. Methods that are called on these enhancement classes would be passed on to our `Macbook` class.

In our next example, decorators transparently wrap around their components and can interestingly be interchanged as they use the same interface.

Here's the interface we're going to define for the Macbook:

```js
var Macbook = new Interface('Macbook', [
  'addEngraving',
  'addParallels',
  'add4GBRam',
  'add8GBRam',
  'addCase',
]);

// A Macbook Pro might thus be represented as follows:
var MacbookPro = function () {
  // implements Macbook
};

MacbookPro.prototype = {
  addEngraving: function () {},
  addParallels: function () {},
  add4GBRam: function () {},
  add8GBRam: function () {},
  addCase: function () {},
  getPrice: function () {
    // Base price
    return 900.0;
  },
};
```

To make it easier for us to add as many more options as needed later on, an Abstract Decorator class is defined with default methods required to implement the `Macbook` interface, which the rest of the options will sub-class. Abstract Decorators ensure that we can decorate a base class independently with as many decorators as needed in different combinations (remember the example earlier?) without needing to derive a class for every possible combination.

```js
// Macbook decorator abstract decorator class

var MacbookDecorator = function (macbook) {
  Interface.ensureImplements(macbook, Macbook);
  this.macbook = macbook;
};

MacbookDecorator.prototype = {
  addEngraving: function () {
    return this.macbook.addEngraving();
  },
  addParallels: function () {
    return this.macbook.addParallels();
  },
  add4GBRam: function () {
    return this.macbook.add4GBRam();
  },
  add8GBRam: function () {
    return this.macbook.add8GBRam();
  },
  addCase: function () {
    return this.macbook.addCase();
  },
  getPrice: function () {
    return this.macbook.getPrice();
  },
};
```

What's happening in the above sample is that the `Macbook` Decorator accepts an object (a Macbook) to use as our base component. It's using the `Macbook` interface we defined earlier and for each method is just calling the same method on the component. We can now create our option classes for what can be added, just by using the `Macbook` Decorator.

```js
// First, define a way to extend an object a
// with the properties in object b. We'll use
// this shortly!
function extend(a, b) {
  for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
  return a;
}

var CaseDecorator = function (macbook) {
  this.macbook = macbook;
};

// Let's now extend (decorate) the CaseDecorator
// with a MacbookDecorator
extend(CaseDecorator, MacbookDecorator);

CaseDecorator.prototype.addCase = function () {
  return this.macbook.addCase() + 'Adding case to macbook';
};

CaseDecorator.prototype.getPrice = function () {
  return this.macbook.getPrice() + 45.0;
};
```

What we're doing here is overriding the `addCase()` and `getPrice()` methods that need to be decorated and we're achieving this by first calling these methods on the original `macbook` and then simply appending a string or numeric value (e.g 45.00) to them accordingly.

As there's been quite a lot of information presented in this section so far, let's try to bring it all together in a single example that will hopefully highlight what we have learned.

```js
// Instantiation of the macbook
var myMacbookPro = new MacbookPro();

// Outputs: 900.00
console.log(myMacbookPro.getPrice());

// Decorate the macbook
var decoratedMacbookPro = new CaseDecorator(myMacbookPro);

// This will return 945.00
console.log(decoratedMacbookPro.getPrice());
```

As decorators are able to modify objects dynamically, they're a perfect pattern for changing existing systems. Occasionally, it's just simpler to create decorators around an object versus the trouble of maintaining individual sub-classes for each object type. This makes maintaining applications that may require a large number of sub-classed objects significantly more straight-forward.

A functional version of this example can be found on [JSBin](https://jsbin.com/UMEJaXu/1/edit?html,js,output).

## Decorators With jQuery

As with other patterns we've covered, there are also examples of the Decorator pattern that can be implemented with jQuery. `jQuery.extend()` allows us to extend (or merge) two or more objects (and their properties) together into a single object at run-time.

In this scenario, a target object can be decorated with new functionality without necessarily breaking or overriding existing methods in the source/superclass object (although this can be done).

In the following example, we define three objects: defaults, options and settings. The aim of the task is to decorate the `defaults` object with additional functionality found in `optionssettings`. We must:

(a) Leave "defaults" in an untouched state where we don't lose the ability to access the properties or functions found in it a later point (b) Gain the ability to use the decorated properties and functions found in "options"

```js
var decoratorApp = decoratorApp || {};

// define the objects we're going to use
decoratorApp = {
  defaults: {
    validate: false,
    limit: 5,
    name: 'foo',
    welcome: function () {
      console.log('welcome!');
    },
  },

  options: {
    validate: true,
    name: 'bar',
    helloWorld: function () {
      console.log('hello world');
    },
  },

  settings: {},

  printObj: function (obj) {
    var arr = [],
      next;
    $.each(obj, function (key, val) {
      next = key + ': ';
      next += $.isPlainObject(val) ? printObj(val) : val;
      arr.push(next);
    });

    return '{ ' + arr.join(', ') + ' }';
  },
};

// merge defaults and options, without modifying defaults explicitly
decoratorApp.settings = $.extend({}, decoratorApp.defaults, decoratorApp.options);

// what we have done here is decorated defaults in a way that provides
// access to the properties and functionality it has to offer (as well as
// that of the decorator "options"). defaults itself is left unchanged

$('#log').append(
  decoratorApp.printObj(decoratorApp.settings) +
    +decoratorApp.printObj(decoratorApp.options) +
    +decoratorApp.printObj(decoratorApp.defaults)
);

// settings -- { validate: true, limit: 5, name: bar, welcome: function (){ console.log( "welcome!" ); },
// helloWorld: function (){ console.log( "hello world" ); } }
// options -- { validate: true, name: bar, helloWorld: function (){ console.log( "hello world" ); } }
// defaults -- { validate: false, limit: 5, name: foo, welcome: function (){ console.log("welcome!"); } }
```

## Advantages & Disadvantages

Developers enjoy using this pattern as it can be used transparently and is also fairly flexible - as we've seen, objects can be wrapped or "decorated" with new behavior and then continue to be used without needing to worry about the base object being modified. In a broader context, this pattern also avoids us needing to rely on large numbers of subclasses to get the same benefits.

There are however drawbacks that we should be aware of when implementing the pattern. If poorly managed, it can significantly complicate our application architecture as it introduces many small, but similar objects into our namespace. The concern here is that in addition to becoming hard to manage, other developers unfamiliar with the pattern may have a hard time grasping why it's being used.

Sufficient commenting or pattern research should assist with the latter, however as long as we keep a handle on how widespread we use the decorator in our applications we should be fine on both counts.
