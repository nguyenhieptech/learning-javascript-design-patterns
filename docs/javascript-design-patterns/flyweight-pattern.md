---
sidebar_position: 13
---

# Flyweight Pattern

The Flyweight pattern is a classical structural solution for optimizing code that is repetitive, slow and inefficiently shares data. It aims to minimize the use of memory in an application by sharing as much data as possible with related objects (e.g application configuration, state and so on).

The pattern was first conceived by Paul Calder and Mark Linton in 1990 and was named after the boxing weight class that includes fighters weighing less than 112lb. The name Flyweight itself is derived from this weight classification as it refers to the small weight (memory footprint) the pattern aims to help us achieve.

In practice, Flyweight data sharing can involve taking several similar objects or data constructs used by a number of objects and placing this data into a single external object. We can pass through this object to those depending on this data, rather than storing identical data across each one.

## Using Flyweights

There are two ways in which the Flyweight pattern can be applied. The first is at the data-layer, where we deal with the concept of sharing data between large quantities of similar objects stored in memory.

The second is at the DOM-layer where the Flyweight can be used as a central event-manager to avoid attaching event handlers to every child element in a parent container we wish to have some similar behavior.

As the data-layer is where the flyweight pattern is most used traditionally, we'll take a look at this first.

## Flyweights and sharing data

For this application, there are a few more concepts around the classical Flyweight pattern that we need to be aware of. In the Flyweight pattern there's a concept of two states - intrinsic and extrinsic. Intrinsic information may be required by internal methods in our objects which they absolutely cannot function without. Extrinsic information can however be removed and stored externally.

Objects with the same intrinsic data can be replaced with a single shared object, created by a factory method. This allows us to reduce the overall quantity of implicit data being stored quite significantly.

The benefit of this is that we're able to keep an eye on objects that have already been instantiated so that new copies are only ever created should the intrinsic state differ from the object we already have.

We use a manager to handle the extrinsic states. How this is implemented can vary, but one approach to this to have the manager object contain a central database of the extrinsic states and the flyweight objects which they belong to.

## Implementing Classical Flyweights

As the Flyweight pattern hasn't been heavily used in JavaScript in recent years, many of the implementations we might use for inspiration come from the Java and C++ worlds.

Our first look at Flyweights in code is my JavaScript implementation of the Java sample of the Flyweight pattern from Wikipedia (http://en.wikipedia.org/wiki/Flyweight_pattern).

We will be making use of three types of Flyweight components in this implementation, which are listed below:

- **Flyweight** corresponds to an interface through which flyweights are able to receive and act on extrinsic states
- **Concrete Flyweight** actually implements the Flyweight interface and stores intrinsic state. Concrete Flyweights need to be sharable and capable of manipulating state that is extrinsic
- **Flyweight Factory** manages flyweight objects and creates them too. It makes sure that our flyweights are shared and manages them as a group of objects which can be queried if we require individual instances. If an object has been already created in the group it returns it, otherwise it adds a new object to the pool and returns it.

These correspond to the following definitions in our implementation:

- CoffeeOrder: Flyweight
- CoffeeFlavor: Concrete Flyweight
- CoffeeOrderContext: Helper
- CoffeeFlavorFactory: Flyweight Factory
- testFlyweight: Utilization of our Flyweights

### Duck punching "implements"

Duck punching allows us to extend the capabilities of a language or solution without necessarily needing to modify the runtime source. As this next solution requires the use of a Java keyword (`implements`) for implementing interfaces and isn't found in JavaScript natively, let's first duck punch it.

`Function.prototype.implementsFor` works on an object constructor and will accept a parent class (function) or object and either inherit from this using normal inheritance (for functions) or virtual inheritance (for objects).

```js
// Simulate pure virtual inheritance/"implement" keyword for JS
Function.prototype.implementsFor = function (parentClassOrObject) {
  if (parentClassOrObject.constructor === Function) {
    // Normal Inheritance
    this.prototype = new parentClassOrObject();
    this.prototype.constructor = this;
    this.prototype.parent = parentClassOrObject.prototype;
  } else {
    // Pure Virtual Inheritance
    this.prototype = parentClassOrObject;
    this.prototype.constructor = this;
    this.prototype.parent = parentClassOrObject;
  }
  return this;
};
```

We can use this to patch the lack of an `implements` keyword by having a function inherit an interface explicitly. Below, `CoffeeFlavor` implements the `CoffeeOrder` interface and must contain its interface methods in order for us to assign the functionality powering these implementations to an object.

```js
// Flyweight object
var CoffeeOrder = {
  // Interfaces
  serveCoffee: function (context) {},
  getFlavor: function () {},
};

// ConcreteFlyweight object that creates ConcreteFlyweight
// Implements CoffeeOrder
function CoffeeFlavor(newFlavor) {
  var flavor = newFlavor;

  // If an interface has been defined for a feature
  // implement the feature
  if (typeof this.getFlavor === 'function') {
    this.getFlavor = function () {
      return flavor;
    };
  }

  if (typeof this.serveCoffee === 'function') {
    this.serveCoffee = function (context) {
      console.log(
        'Serving Coffee flavor ' + flavor + ' to table number ' + context.getTable()
      );
    };
  }
}

// Implement interface for CoffeeOrder
CoffeeFlavor.implementsFor(CoffeeOrder);

// Handle table numbers for a coffee order
function CoffeeOrderContext(tableNumber) {
  return {
    getTable: function () {
      return tableNumber;
    },
  };
}

function CoffeeFlavorFactory() {
  var flavors = {},
    length = 0;

  return {
    getCoffeeFlavor: function (flavorName) {
      var flavor = flavors[flavorName];
      if (typeof flavor === 'undefined') {
        flavor = new CoffeeFlavor(flavorName);
        flavors[flavorName] = flavor;
        length++;
      }
      return flavor;
    },

    getTotalCoffeeFlavorsMade: function () {
      return length;
    },
  };
}

// Sample usage:
// testFlyweight()

function testFlyweight() {
  // The flavors ordered.
  var flavors = [],
    // The tables for the orders.
    tables = [],
    // Number of orders made
    ordersMade = 0,
    // The CoffeeFlavorFactory instance
    flavorFactory = new CoffeeFlavorFactory();

  function takeOrders(flavorIn, table) {
    flavors.push(flavorFactory.getCoffeeFlavor(flavorIn));
    tables.push(new CoffeeOrderContext(table));
    ordersMade++;
  }

  takeOrders('Cappuccino', 2);
  takeOrders('Cappuccino', 2);
  takeOrders('Frappe', 1);
  takeOrders('Frappe', 1);
  takeOrders('Xpresso', 1);
  takeOrders('Frappe', 897);
  takeOrders('Cappuccino', 97);
  takeOrders('Cappuccino', 97);
  takeOrders('Frappe', 3);
  takeOrders('Xpresso', 3);
  takeOrders('Cappuccino', 3);
  takeOrders('Xpresso', 96);
  takeOrders('Frappe', 552);
  takeOrders('Cappuccino', 121);
  takeOrders('Xpresso', 121);

  for (var i = 0; i < ordersMade; ++i) {
    flavors[i].serveCoffee(tables[i]);
  }
  console.log(' ');
  console.log(
    'total CoffeeFlavor objects made: ' + flavorFactory.getTotalCoffeeFlavorsMade()
  );
}
```

## Converting code to use the Flyweight pattern

Next, let's continue our look at Flyweights by implementing a system to manage all of the books in a library. The important meta-data for each book could probably be broken down as follows:

- ID
- Title
- Author
- Genre
- Page count
- Publisher ID
- ISBN

We'll also require the following properties to keep track of which member has checked out a particular book, the date they've checked it out on as well as the expected date of return.

- checkoutDate
- checkoutMember
- dueReturnDate
- availability

Each book would thus be represented as follows, prior to any optimization using the Flyweight pattern:

```js
var Book = function (
  id,
  title,
  author,
  genre,
  pageCount,
  publisherID,
  ISBN,
  checkoutDate,
  checkoutMember,
  dueReturnDate,
  availability
) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.genre = genre;
  this.pageCount = pageCount;
  this.publisherID = publisherID;
  this.ISBN = ISBN;
  this.checkoutDate = checkoutDate;
  this.checkoutMember = checkoutMember;
  this.dueReturnDate = dueReturnDate;
  this.availability = availability;
};

Book.prototype = {
  getTitle: function () {
    return this.title;
  },

  getAuthor: function () {
    return this.author;
  },

  getISBN: function () {
    return this.ISBN;
  },

  // For brevity, other getters are not shown
  updateCheckoutStatus: function (
    bookID,
    newStatus,
    checkoutDate,
    checkoutMember,
    newReturnDate
  ) {
    this.id = bookID;
    this.availability = newStatus;
    this.checkoutDate = checkoutDate;
    this.checkoutMember = checkoutMember;
    this.dueReturnDate = newReturnDate;
  },

  extendCheckoutPeriod: function (bookID, newReturnDate) {
    this.id = bookID;
    this.dueReturnDate = newReturnDate;
  },

  isPastDue: function (bookID) {
    var currentDate = new Date();
    return currentDate.getTime() > Date.parse(this.dueReturnDate);
  },
};
```

This probably works fine initially for small collections of books, however as the library expands to include a larger inventory with multiple versions and copies of each book available, we may find the management system running slower and slower over time. Using thousands of book objects may overwhelm the available memory, but we can optimize our system using the Flyweight pattern to improve this.

We can now separate our data into intrinsic and extrinsic states as follows: data relevant to the book object (`title`, `author` etc) is intrinsic whilst the checkout data (`checkoutMember`, `dueReturnDate` etc) is considered extrinsic. Effectively this means that only one Book object is required for each combination of book properties. it's still a considerable quantity of objects, but significantly fewer than we had previously.

The following single instance of our book meta-data combinations will be shared among all of the copies of a book with a particular title.

```js
// Flyweight optimized version
var Book = function (title, author, genre, pageCount, publisherID, ISBN) {
  this.title = title;
  this.author = author;
  this.genre = genre;
  this.pageCount = pageCount;
  this.publisherID = publisherID;
  this.ISBN = ISBN;
};
```

As we can see, the extrinsic states have been removed. Everything to do with library check-outs will be moved to a manager and as the object data is now segmented, a factory can be used for instantiation.

## A Basic Factory

Let's now define a very basic factory. What we're going to have it do is perform a check to see if a book with a particular title has been previously created inside the system; if it has, we'll return it - if not, a new book will be created and stored so that it can be accessed later. This makes sure that we only create a single copy of each unique intrinsic piece of data:

```js
// Book Factory singleton
var BookFactory = (function () {
  var existingBooks = {},
    existingBook;

  return {
    createBook: function (title, author, genre, pageCount, publisherID, ISBN) {
      // Find out if a particular book meta-data combination has been created before
      // !! or (bang bang) forces a boolean to be returned
      existingBook = existingBooks[ISBN];
      if (!!existingBook) {
        return existingBook;
      } else {
        // if not, let's create a new instance of the book and store it
        var book = new Book(title, author, genre, pageCount, publisherID, ISBN);
        existingBooks[ISBN] = book;
        return book;
      }
    },
  };
})();
```

### Managing the extrinsic states

Next, we need to store the states that were removed from the Book objects somewhere - luckily a manager (which we'll be defining as a Singleton) can be used to encapsulate them. Combinations of a Book object and the library member that's checked them out will be called Book records. Our manager will be storing both and will also include checkout related logic we stripped out during our flyweight optimization of the Book class.

```js
// BookRecordManager singleton
var BookRecordManager = (function () {
  var bookRecordDatabase = {};

  return {
    // add a new book into the library system
    addBookRecord: function (
      id,
      title,
      author,
      genre,
      pageCount,
      publisherID,
      ISBN,
      checkoutDate,
      checkoutMember,
      dueReturnDate,
      availability
    ) {
      var book = BookFactory.createBook(
        title,
        author,
        genre,
        pageCount,
        publisherID,
        ISBN
      );

      bookRecordDatabase[id] = {
        checkoutMember: checkoutMember,
        checkoutDate: checkoutDate,
        dueReturnDate: dueReturnDate,
        availability: availability,
        book: book,
      };
    },
    updateCheckoutStatus: function (
      bookID,
      newStatus,
      checkoutDate,
      checkoutMember,
      newReturnDate
    ) {
      var record = bookRecordDatabase[bookID];
      record.availability = newStatus;
      record.checkoutDate = checkoutDate;
      record.checkoutMember = checkoutMember;
      record.dueReturnDate = newReturnDate;
    },

    extendCheckoutPeriod: function (bookID, newReturnDate) {
      bookRecordDatabase[bookID].dueReturnDate = newReturnDate;
    },

    isPastDue: function (bookID) {
      var currentDate = new Date();
      return currentDate.getTime() > Date.parse(bookRecordDatabase[bookID].dueReturnDate);
    },
  };
})();
```

The result of these changes is that all of the data that's been extracted from the Book class is now being stored in an attribute of the BookManager singleton (BookDatabase) - something considerably more efficient than the large number of objects we were previously using. Methods related to book checkouts are also now based here as they deal with data that's extrinsic rather than intrinsic.

This process does add a little complexity to our final solution, however it's a small concern when compared to the performance issues that have been tackled. Data wise, if we have 30 copies of the same book, we are now only storing it once. Also, every function takes up memory. With the flyweight pattern these functions exist in one place (on the manager) and not on every object, thus saving on memory use. For the above-mentioned flyweight unoptimized version we store just link to the function object as we used Book constructor's prototype but if it was implemented in other way, functions would be created for every book instance.

## The Flyweight pattern and the DOM

The DOM (Document Object Model) supports two approaches that allow objects to detect events - either top down (event capture) or bottom up (event bubbling).

In event capture, the event is first captured by the outer-most element and propagated to the inner-most element. In event bubbling, the event is captured and given to the inner-most element and then propagated to the outer-elements.

One of the best metaphors for describing Flyweights in this context was written by Gary Chisholm and it goes a little like this:

> Try to think of the flyweight in terms of a pond. A fish opens its mouth (the event), bubbles rise to the surface (the bubbling) a fly sitting on the top flies away when the bubble reaches the surface (the action). In this example we can easily transpose the fish opening its mouth to a button being clicked, the bubbles as the bubbling effect and the fly flying away to some function being run

Bubbling was introduced to handle situations where a single event (e.g a click) may be handled by multiple event handlers defined at different levels of the DOM hierarchy. Where this happens, event bubbling executes event handlers defined for specific elements at the lowest level possible. From there on, the event bubbles up to containing elements before going to those even higher up.

Flyweights can be used to tweak the event bubbling process further, as we will see shortly.

### Example 1: Centralized event handling

For our first practical example, imagine we have a number of similar elements in a document with similar behavior executed when a user-action (e.g click, mouse-over) is performed against them.

Normally what we do when constructing our own accordion component, menu or other list-based widget is bind a click event to each link element in the parent container (e.g `$('ul li a').on(..)`. Instead of binding the click to multiple elements, we can easily attach a Flyweight to the top of our container which can listen for events coming from below. These can then be handled using logic that is as simple or complex as required.

As the types of components mentioned often have the same repeating markup for each section (e.g. each section of an accordion), there's a good chance the behavior of each element that may be clicked is going to be quite similar and relative to similar classes nearby. We'll use this information to construct a very basic accordion using the Flyweight below.

A stateManager namespace is used here to encapsulate our flyweight logic whilst jQuery is used to bind the initial click to a container div. In order to ensure that no other logic on the page is attaching similar handles to the container, an unbind event is first applied.

Now to establish exactly what child element in the container is clicked, we make use of a `target` check which provides a reference to the element that was clicked, regardless of its parent. We then use this information to handle the click event without actually needing to bind the event to specific children when our page loads.

#### HTML

```html
<div id="container">
  <div class="toggle" href="#">More Info (Address)
    <span class="info">
      This is more information
    </span>
  </div>
  <div class="toggle" href="#">Even More Info (Map)
    <span class="info">
      <iframe
        src="http://www.map-generator.net/extmap.php?name=London&amp;address=london%2C%20england&amp;width=500...gt;"
      </iframe>
    </span>
  </div>
</div>
```

#### JavaScript

```js
var stateManager = {
  fly: function () {
    var self = this;

    $('#container')
      .unbind()
      .on('click', 'div.toggle', function (e) {
        self.handleClick(e.target);
      });
  },

  handleClick: function (elem) {
    $(elem).find('span').toggle('slow');
  },
};
```

The benefit here is that we're converting many independent actions into a shared ones (potentially saving on memory).

### Example 2: Using the Flyweight for performance optimization

In our second example, we'll reference some further performance gains that can be achieved using Flyweights with jQuery.

James Padolsey previously wrote an article called 76 _bytes for faster_ jQuery where he reminded us that each time jQuery fires off a callback, regardless of type (filter, each, event handler), we're able to access the function's context (the DOM element related to it) via the `this` keyword.

Unfortunately, many of us have become used to the idea of wrapping `this` in `$()` or `jQuery()`, which means that a new instance of jQuery is unnecessarily constructed every time, rather than simply doing this:

```js
$('div').on('click', function () {
  console.log('You clicked: ' + $(this).attr('id'));
});

// we should avoid using the DOM element to create a
// jQuery object (with the overhead that comes with it)
// and just use the DOM element itself like this:

$('div').on('click', function () {
  console.log('You clicked:' + this.id);
});
```

James had wanted to use jQuery's `jQuery.text` in the following context, however he disagreed with the notion that a new jQuery object had to be created on each iteration:

```js
$('a').map(function () {
  return $(this).text();
});
```

Now with respect to redundant wrapping, where possible with jQuery's utility methods, it's better to use `jQuery.methodName` (e.g `jQuery.text`) as opposed to `jQuery.fn.methodName` (e.g `jQuery.fn.text`) where methodName represents a utility such as `each()` or `text`. This avoids the need to call a further level of abstraction or construct a new jQuery object each time our function is called as as `jQuery.methodName` is what the library itself uses at a lower-level to power `jQuery.fn.methodName`.

Because however not all of jQuery's methods have corresponding single-node functions, Padolsey devised the idea of a jQuery.single utility.

The idea here is that a single jQuery object is created and used for each call to jQuery.single (effectively meaning only one jQuery object is ever created). The implementation for this can be found below and as we're consolidating data for multiple possible objects into a more central singular structure, it is technically also a Flyweight.

```js
jQuery.single = (function (o) {
  var collection = jQuery([1]);
  return function (element) {
    // Give collection the element:
    collection[0] = element;

    // Return the collection:
    return collection;
  };
})();
```

An example of this in action with chaining is:

```js
$('div').on('click', function () {
  var html = jQuery.single(this).next().html();
  console.log(html);
});
```

Note: Although we may believe that simply caching our jQuery code may offer just as equivalent performance gains, Padolsey claims that $.single() is still worth using and can perform better. That's not to say don't apply any caching at all, just be mindful that this approach can assist. For further details about $.single, I recommend reading Padolsey's full post.
