---
sidebar_position: 7
---

# Prototype Pattern

The GoF refer to the prototype pattern as one which creates objects based on a template of an existing object through cloning.

We can think of the prototype pattern as being based on prototypal inheritance where we create objects which act as prototypes for other objects. The prototype object itself is effectively used as a blueprint for each object the constructor creates. If the prototype of the constructor function used contains a property called `name` for example (as per the code sample lower down), then each object created by that same constructor will also have this same property.

Reviewing the definitions for this pattern in existing (non-JavaScript) literature, we **may** find references to classes once again. The reality is that prototypal inheritance avoids using classes altogether. There isn't a "definition" object nor a core object in theory. We're simply creating copies of existing functional objects.

One of the benefits of using the prototype pattern is that we're working with the prototypal strengths JavaScript has to offer natively rather than attempting to imitate features of other languages. With other design patterns, this isn't always the case.

Not only is the pattern an easy way to implement inheritance, but it can also come with a performance boost as well: when defining a function in an object, they're all created by reference (so all child objects point to the same function) instead of creating their own individual copies.

For those interested, real prototypal inheritance, as defined in the ECMAScript 5 standard, requires the use of `Object.create` (which we previously looked at earlier in this section). To remind ourselves, `Object.create` creates an object which has a specified prototype and optionally contains specified properties as well (e.g `Object.create( prototype, optionalDescriptorObjects )`).

We can see this demonstrated in the example below:

```js
var myCar = {
  name: 'Ford Escort',

  drive: function () {
    console.log("Weeee. I'm driving!");
  },

  panic: function () {
    console.log('Wait. How do you stop this thing?');
  },
};

// Use Object.create to instantiate a new car
var yourCar = Object.create(myCar);

// Now we can see that one is a prototype of the other
console.log(yourCar.name);
```

`Object.create` also allows us to easily implement advanced concepts such as differential inheritance where objects are able to directly inherit from other objects. We saw earlier that `Object.create` allows us to initialise object properties using the second supplied argument. For example:

```js
var vehicle = {
  getModel: function () {
    console.log('The model of this vehicle is..' + this.model);
  },
};

var car = Object.create(vehicle, {
  id: {
    value: MY_GLOBAL.nextId(),
    // writable:false, configurable:false by default
    enumerable: true,
  },

  model: {
    value: 'Ford',
    enumerable: true,
  },
});
```

Here the properties can be initialized on the second argument of `Object.create` using an object literal with a syntax similar to that used by the `Object.defineProperties` and `Object.defineProperty` methods that we looked at previously.

It is worth noting that prototypal relationships can cause trouble when enumerating properties of objects and (as Crockford recommends) wrapping the contents of the loop in a `hasOwnProperty()` check.

If we wish to implement the prototype pattern without directly using `Object.create`, we can simulate the pattern as per the above example as follows:

```js
var vehiclePrototype = {
  init: function (carModel) {
    this.model = carModel;
  },

  getModel: function () {
    console.log('The model of this vehicle is..' + this.model);
  },
};

function vehicle(model) {
  function F() {}
  F.prototype = vehiclePrototype;

  var f = new F();

  f.init(model);
  return f;
}

var car = vehicle('Ford Escort');
car.getModel();
```

**Note**: This alternative does not allow the user to define read-only properties in the same manner (as the vehiclePrototype may be altered if not careful).

A final alternative implementation of the Prototype pattern could be the following:

```js
var beget = (function () {
  function F() {}

  return function (proto) {
    F.prototype = proto;
    return new F();
  };
})();
```

One could reference this method from the `vehicle` function. Note, however that `vehicle` here is emulating a constructor, since the prototype pattern does not include any notion of initialization beyond linking an object to a prototype.
