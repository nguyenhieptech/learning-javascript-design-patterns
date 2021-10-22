---
sidebar_position: 4
---

# MVVM

MVVM (Model View ViewModel) is an architectural pattern based on MVC and MVP, which attempts to more clearly separate the development of user-interfaces (UI) from that of the business logic and behavior in an application. To this end, many implementations of this pattern make use of declarative data bindings to allow a separation of work on Views from other layers.

This facilitates UI and development work occurring almost simultaneously within the same codebase. UI developers write bindings to the ViewModel within their document markup (HTML), where the Model and ViewModel are maintained by developers working on the logic for the application.

## History

MVVM (by name) was originally defined by Microsoft for use with Windows Presentation Foundation ([WPF](https://en.wikipedia.org/wiki/Windows_Presentation_Foundation)) and [Silverlight](https://www.microsoft.com/silverlight/), having been officially announced in 2005 by [John Grossman](https://blogs.msdn.com/b/johngossman/) in a blog post about Avalon (the codename for WPF). It also found some popularity in the Adobe Flex community as an alternative to simply using MVC.

Prior to Microsoft adopting the MVVM name, there was however a movement in the community to go from MVP to MVPM: Model View [PresentationModel](https://blogs.adobe.com/paulw/archives/2007/10/presentation_pa_3.html). Martin Fowler wrote an [article](https://martinfowler.com/eaaDev/PresentationModel.html) on PresentationModels back in 2004 for those interested in reading more about it. The idea of a [PresentationModel](http://blogs.infragistics.com/blogs/craig_shoemaker/archive/2009/11/03/learning-model-view-viewmodel-and-presentation-model.aspx) had been around much longer than this article, however it was considered the big break in the idea and greatly helped popularize it.

There was quite a lot of uproar in the "alt.net" circles after Microsoft announced MVVM as an alternative to MVPM. Many claimed the company's dominance in the GUI world was giving them the opportunity to take over the community as a whole, renaming existing concepts as they pleased for marketing purposes. A progressive crowd recognized that whilst MVVM and MVPM were effectively the same idea, they came in slightly different packages.

In recent years, MVVM has been implemented in JavaScript in the form of structural frameworks such as [KnockoutJS](https://knockoutjs.com/), [Kendo MVVM](http://www.kendoui.com/web/roadmap.aspx) and [Knockback.js](https://github.com/kmalakoff/knockback), with an overall positive response from the community.

Let’s now review the three components that compose MVVM.

## Model

As with other members of the MV\* family, the Model in MVVM represents domain-specific data or information that our application will be working with. A typical example of domain-specific data might be a user account (e.g name, avatar, e-mail) or a music track (e.g title, year, album).

Models hold information, but typically don’t handle behavior. They don’t format information or influence how data appears in the browser as this isn’t their responsibility. Instead, formatting of data is handled by the View, whilst behavior is considered business logic that should be encapsulated in another layer that interacts with the Model - the ViewModel.

The only exception to this rule tends to be validation and it’s considered acceptable for Models to validate data being used to define or update existing models (e.g does an e-mail address being input meet the requirements of a particular regular expression?).

In KnockoutJS, Models fall under the above definition, but often make Ajax calls to a server-side service to both read and write Model data.

If we were constructing a simple Todo application, a KnockoutJS Model representing a single Todo item could look as follows:

```js
var Todo = function (content, done) {
  this.content = ko.observable(content);
  this.done = ko.observable(done);
  this.editing = ko.observable(false);
};
```

Note: One may notice in the above snippet that we are calling the method `observable()` on the KnockoutJS namespace `ko`. In KnockoutJS, observables are special JavaScript objects that can notify subscribers about changes and automatically detect dependencies. This allows us to synchronize Models and ViewModels when the value of a Model attribute is modified.

## View

As with MVC, the View is the only part of the application that users actually interact with. They are an interactive UI that represent the state of a ViewModel. In this sense, the view is considered active rather than passive, but this is also true for views in MVC and MVP. In MVC, MVP and MVVM a view can also be passive, but what does this mean?

A passive View only outputs a display and does not accept any user input.

Such a view may also have no real knowledge of the models in our application and could be manipulated by a presenter. MVVM’s active View contains the data-bindings, events and behaviors which requires an understanding of the ViewModel. Although these behaviors can be mapped to properties, the View is still responsible for handling events from the ViewModel.

It’s important to remember the View isn’t responsible here for handling state - it keeps this in sync with the ViewModel.

A KnockoutJS View is simply a HTML document with declarative bindings to link it to the ViewModel. KnockoutJS Views display information from the ViewModel, pass commands to it (e.g a user clicking on an element) and update as the state of the ViewModel changes. Templates generating markup using data from the ViewModel can however also be used for this purpose.

To give a brief initial example, we can look to the JavaScript MVVM framework KnockoutJS for how it allows the definition of a ViewModel and its related bindings in markup:

ViewModel:

```js
var aViewModel = {
  contactName: ko.observable('John'),
};
ko.applyBindings(aViewModel);
```

View:

```html
<p><input id="source" data-bind="value: contactName, valueUpdate: 'keyup'" /></p>
<div data-bind="visible: contactName().length > 10">You have a really long name!</div>
<p>Contact name: <strong data-bind="text: contactName"></strong></p>
```

Our input text-box (source) obtains it's initial value from `contactName`, automatically updating this value whenever contactName changes. As the data binding is two-way, typing into the text-box will update `contactName` accordingly so the values are always in sync.

Although implementation specific to KnockoutJS, the `<div>` containing the "You have a really long name!" text also contains simple validation (once again in the form of data bindings). If the input exceeds 10 characters, it will display, otherwise it will remain hidden.

Moving on to a more advanced example, we can return to our Todo application. A trimmed down KnockoutJS View for this, including all the necessary data-bindings may look as follows.

```html
<div id="todoapp">
  <header>
    <h1>Todos</h1>
    <input
      id="new-todo"
      type="text"
      data-bind="value: current, valueUpdate: 'afterkeydown', enterKey: add"
      placeholder="What needs to be done?"
    />
  </header>
  <section id="main" data-bind="block: todos().length">
    <input id="toggle-all" type="checkbox" data-bind="checked: allCompleted" />
    <label for="toggle-all">Mark all as complete</label>

    <ul id="todo-list" data-bind="foreach: todos">
      <!-- item -->
      <li data-bind="css: { done: done, editing: editing }">
        <div class="view" data-bind="event: { dblclick: $root.editItem }">
          <input class="toggle" type="checkbox" data-bind="checked: done" />
          <label data-bind="text: content"></label>
          <a class="destroy" href="#" data-bind="click: $root.remove"></a>
        </div>
        <input
          class="edit"
          type="text"
          data-bind="value: content, valueUpdate: 'afterkeydown', enterKey: $root.stopEditing, selectAndFocus: editing, event: { blur: $root.stopEditing }"
        />
      </li>
    </ul>
  </section>
</div>
```

Note that the basic layout of the mark-up is relatively straight-forward, containing an input textbox (`new-todo`) for adding new items, togglers for marking items as complete and a list (`todo-list`) with a template for a Todo item in the form of an `li`.

The data bindings in the above markup can be broken down as follows:

- The input textbox `new-todo` has a data-binding for the `current` property, which is where the value of the current item being added is stored. Our ViewModel (shown shortly) observes the `current` property and also has a binding against the `add` event. When the enter key is pressed, the `add` event is triggered and our ViewModel can then trim the value of `current` and add it to the Todo list as needed
- The input checkbox `toggle-all` can mark all of the current items as completed if clicked. If checked, it triggers the `allCompleted` event, which can be seen in our ViewModel
- The item `li` has the class `done`. When a task is marked as done, the CSS class `editing` is marked accordingly. If double-clicking on the item, the `$root.editItem` callback will be executed
- The checkbox with the class `toggle` shows the state of the `done` property
- A label contains the text value of the Todo item (`content`)
- There is also a remove button that will call the `$root.remove` callback when clicked.
- An input textbox used for editing mode also holds the value of the Todo item `content`. The `enterKey` event will set the `editing` property to true or false

## ViewModel

The ViewModel can be considered a specialized Controller that acts as a data converter. It changes Model information into View information, passing commands from the View to the Model.

For example, let us imagine that we have a model containing a date attribute in unix format (e.g 1333832407). Rather than our models being aware of a user's view of the date (e.g 04/07/2012 @ 5:00pm), where it would be necessary to convert the attribute to its display format, our model simply holds the raw format of the data. Our View contains the formatted date and our ViewModel acts as a middle-man between the two.

In this sense, the ViewModel might be looked upon as more of a Model than a View but it does handle most of the View's display logic. The ViewModel may also expose methods for helping to maintain the View's state, update the model based on the action's on a View and trigger events on the View.

In summary, the ViewModel sits behind our UI layer. It exposes data needed by a View (from a Model) and can be viewed as the source our Views go to for both data and actions.

KnockoutJS interprets the ViewModel as the representation of data and operations that can be performed on a UI. This isn't the UI itself nor the data model that persists, but rather a layer that can also hold the yet to be saved data a user is working with. Knockout's ViewModels are implemented JavaScript objects with no knowledge of HTML markup. This abstract approach to their implementation allows them to stay simple, meaning more complex behavior can be more easily managed on-top as needed.

A partial KnockoutJS ViewModel for our Todo application could thus look as follows:

```js
// our main ViewModel
    var ViewModel = function ( todos ) {
      var self = this;

    // map array of passed in todos to an observableArray of Todo objects
    self.todos = ko.observableArray(
    ko.utils.arrayMap( todos, function ( todo ) {
      return new Todo( todo.content, todo.done );
    }));

    // store the new todo value being entered
    self.current = ko.observable();

    // add a new todo, when enter key is pressed
    self.add = function ( data, event ) {
      var newTodo, current = self.current().trim();
      if ( current ) {
        newTodo = new Todo( current );
        self.todos.push( newTodo );
        self.current("");
      }
    };

    // remove a single todo
    self.remove = function ( todo ) {
      self.todos.remove( todo );
    };

    // remove all completed todos
    self.removeCompleted = function () {
      self.todos.remove(function (todo) {
        return todo.done();
      });
    };

    // writeable computed observable to handle marking all complete/incomplete
    self.allCompleted = ko.computed({

      // always return true/false based on the done flag of all todos
      read:function () {
        return !self.remainingCount();
      },

      // set all todos to the written value (true/false)
      write:function ( newValue ) {
        ko.utils.arrayForEach( self.todos(), function ( todo ) {
          //set even if value is the same, as subscribers are not notified in that case
          todo.done( newValue );
        });
      }
    });

    // edit an item
    self.editItem = function( item ) {
      item.editing( true );
    };
 ..
```

Above we are basically providing the methods needed to add, edit or remove items as well as the logic to mark all remaining items as having been completed Note: The only real difference worth noting from previous examples in our ViewModel are observable arrays. In KnockoutJS, if we wish to detect and respond to changes on a single object, we would use `observables`. If however we wish to detect and respond to changes of a collection of things, we can use an `observableArray` instead. A simpler example of how to use observables arrays may look as follows:

```js
// Define an initially an empty array
var myObservableArray = ko.observableArray();

// Add a value to the array and notify our observers
myObservableArray.push('A new todo item');
```

Note: The complete Knockout.js Todo application we reviewed above can be grabbed from TodoMVC if interested.

## Recap: The View and the ViewModel

Views and ViewModels communicate using data-bindings and events. As we saw in our initial ViewModel example, the ViewModel doesn’t just expose Model attributes but also access to other methods and features such as validation.

Our Views handle their own user-interface events, mapping them to the ViewModel as necessary. Models and attributes on the ViewModel are synchronized and updated via two-way data-binding.

Triggers (data-triggers) also allow us to further react to changes in the state of our Model attributes.

## Recap: The ViewModel and the Model

Whilst it may appear the ViewModel is completely responsible for the Model in MVVM, there are some subtleties with this relationship worth noting. The ViewModel can expose a Model or Model attributes for the purposes of data-binding and can also contain interfaces for fetching and manipulating properties exposed in the view.

## Pros and Cons

We now hopefully have a better appreciation for what MVVM is and how it works. Let’s now review the advantages and disadvantages of employing the pattern:

### Advantages

- MVVM Facilitates easier parallel development of a UI and the building blocks that power it
- Abstracts the View and thus reduces the quantity of business logic (or glue) required in the code behind it
- The ViewModel can be easier to unit test than event-driven code
- The ViewModel (being more Model than View) can be tested without concerns of UI automation and interaction

### Disadvantages

- For simpler UIs, MVVM can be overkill
- Whilst data-bindings can be declarative and nice to work with, they can be harder to debug than imperative code where we simply set breakpoints
- Data-bindings in non-trivial applications can create a lot of book-keeping. We also don’t want to end up in a situation where bindings are heavier than the objects being bound to
- In larger applications, it can be more difficult to design the ViewModel up front to get the necessary amount of generalization

## MVVM With Looser Data-Bindings

It’s not uncommon for JavaScript developers from an MVC or MVP background to review MVVM and complain about its true separation of concerns. Namely, the quantity of inline data-bindings maintained in the HTML markup of a View.

I must admit that when I first reviewed implementations of MVVM (e.g KnockoutJS, Knockback), I was surprised that any developer would want to return to the days of old where we mixed logic (JavaScript) with our markup and found it quickly unmaintainable. The reality however is that MVVM does this for a number of good reasons (which we’ve covered), including facilitating designers to more easily bind to logic from their markup.

For the purists among us, you’ll be happy to know that we can now also greatly reduce how reliant we are on data-bindings thanks to a feature known as custom binding providers, introduced in KnockoutJS 1.3 and available in all versions since.

KnockoutJS by default has a data-binding provider which searches for any elements with `data-bind` attributes on them such as in the below example.

```html
<input
  id="new-todo"
  type="text"
  data-bind="value: current, valueUpdate: 'afterkeydown', enterKey: add"
  placeholder="What needs to be done?"
/>
```

When the provider locates an element with this attribute, it parses it and turns it into a binding object using the current data context. This is the way KnockoutJS has always worked, allowing us to declaratively add bindings to elements which KnockoutJS binds to the data at that layer.

Once we start building Views that are no longer trivial, we may end up with a large number of elements and attributes whose bindings in markup can become difficult to manage. With custom binding providers however, this is no longer a problem.

A binding provider is primarily interested in two things:

- When given a DOM node, does it contain any data-bindings?
- If the node passed this first question, what does the binding object look like in the current data context?

Binding providers implement two functions:

- nodeHasBindings: this takes in a DOM node which doesn’t necessarily have to be an element
- getBindings: returns an object representing the bindings as applied to the current data context

A skeleton binding provider might thus look as follows:

```js
var ourBindingProvider = {
  nodeHasBindings: function (node) {
    // returns true/false
  },

  getBindings: function (node, bindingContext) {
    // returns a binding object
  },
};
```

Before we get to fleshing out this provider, let’s briefly discuss logic in data-bind attributes.

If when using Knockout’s MVVM we find yourself dissatisfied with the idea of application logic being overly tied into your View, we can change this. We could implement something a little like CSS classes to assign bindings by name to elements. Ryan Niemeyer (of knockmeout.net) has previously suggested using `data-class` for this to avoid confusing presentation classes with data classes, so let’s get our `nodeHasBindings` function supporting this:

```js
// does an element have any bindings?
function nodeHasBindings(node) {
  return node.getAttribute ? node.getAttribute('data-class') : false;
}
```

Next, we need a sensible `getBindings()` function. As we’re sticking with the idea of CSS classes, why not also consider supporting space-separated classes to allow us to share binding specs between different elements?

Let’s first review what our bindings will look like. We create an object to hold them where our property names need to match the keys we wish to use in our data-classes.

Note: There isn’t a great deal of work required to convert a KnockoutJS application from using traditional data-bindings over to unobtrusive bindings with custom binding providers. We simply pull our all of our data-bind attributes, replace them with data-class attributes and place our bindings in a binding object as per below:

```js
var viewModel = new ViewModel(todos || []),
  bindings = {
    newTodo: {
      value: viewModel.current,
      valueUpdate: 'afterkeydown',
      enterKey: viewModel.add,
    },

    taskTooltip: {
      visible: viewModel.showTooltip,
    },
    checkAllContainer: {
      visible: viewModel.todos().length,
    },
    checkAll: {
      checked: viewModel.allCompleted,
    },

    todos: {
      foreach: viewModel.todos,
    },
    todoListItem: function () {
      return {
        css: {
          editing: this.editing,
        },
      };
    },
    todoListItemWrapper: function () {
      return {
        css: {
          done: this.done,
        },
      };
    },
    todoCheckBox: function () {
      return {
        checked: this.done,
      };
    },
    todoContent: function () {
      return {
        text: this.content,
        event: {
          dblclick: this.edit,
        },
      };
    },
    todoDestroy: function () {
      return {
        click: viewModel.remove,
      };
    },

    todoEdit: function () {
      return {
        value: this.content,
        valueUpdate: 'afterkeydown',
        enterKey: this.stopEditing,
        event: {
          blur: this.stopEditing,
        },
      };
    },

    todoCount: {
      visible: viewModel.remainingCount,
    },
    remainingCount: {
      text: viewModel.remainingCount,
    },
    remainingCountWord: function () {
      return {
        text: viewModel.getLabel(viewModel.remainingCount),
      };
    },
    todoClear: {
      visible: viewModel.completedCount,
    },
    todoClearAll: {
      click: viewModel.removeCompleted,
    },
    completedCount: {
      text: viewModel.completedCount,
    },
    completedCountWord: function () {
      return {
        text: viewModel.getLabel(viewModel.completedCount),
      };
    },
    todoInstructions: {
      visible: viewModel.todos().length,
    },
  };

  ....
```

There are however two lines missing from the above snippet - we still need our `getBindings` function, which will loop through each of the keys in our data-class attributes and build up the resulting object from each of them. If we detect that the binding object is a function, we call it with our current data using the context `this`. Our complete custom binding provider would look as follows:

```js
// We can now create a bindingProvider that uses
// something different than data-bind attributes
ko.customBindingProvider = function (bindingObject) {
  this.bindingObject = bindingObject;

  // determine if an element has any bindings
  this.nodeHasBindings = function (node) {
    return node.getAttribute ? node.getAttribute('data-class') : false;
  };
};

// return the bindings given a node and the bindingContext
this.getBindings = function (node, bindingContext) {
  var result = {},
    classes = node.getAttribute('data-class');

  if (classes) {
    classes = classes.split('');

    //evaluate each class, build a single object to return
    for (var i = 0, j = classes.length; i < j; i++) {
      var bindingAccessor = this.bindingObject[classes[i]];
      if (bindingAccessor) {
        var binding =
          typeof bindingAccessor === 'function'
            ? bindingAccessor.call(bindingContext.$data)
            : bindingAccessor;
        ko.utils.extend(result, binding);
      }
    }
  }

  return result;
};
```

Thus, the final few lines of our `bindings` object can be defined as follows:

```js
// set ko's current bindingProvider equal to our new binding provider
ko.bindingProvider.instance = new ko.customBindingProvider( bindings );

// bind a new instance of our ViewModel to the page
ko.applyBindings( viewModel );

})();
```

What we’re doing here is effectively defining constructor for our binding handler which accepts an object (bindings) which we use to lookup our bindings. We could then re-write the markup for our application View using data-classes as follows:

```html
<div id="create-todo">
  <input id="new-todo" data-class="newTodo" placeholder="What needs to be done?" />
  <span class="ui-tooltip-top" data-class="taskTooltip" style="display: none;"
    >Press Enter to save this task</span
  >
</div>
<div id="todos">
  <div data-class="checkAllContainer">
    <input id="check-all" class="check" type="checkbox" data-class="checkAll" />
    <label for="check-all">Mark all as complete</label>
  </div>
  <ul id="todo-list" data-class="todos">
    <li data-class="todoListItem">
      <div class="todo" data-class="todoListItemWrapper">
        <div class="display">
          <input class="check" type="checkbox" data-class="todoCheckBox" />
          <div
            class="todo-content"
            data-class="todoContent"
            style="cursor: pointer;"
          ></div>
          <span class="todo-destroy" data-class="todoDestroy"></span>
        </div>
        <div class="edit">
          <input class="todo-input" data-class="todoEdit" />
        </div>
      </div>
    </li>
  </ul>
</div>
```

Neil Kerkin has put together a complete TodoMVC demo app using the above, which can be accessed and played around with [here](https://jsfiddle.net/nkerkin/hmq7D/light/).

Whilst it may look like quite a lot of work in the explanation above, now that we have a generic `getBindings` method written, it’s a lot more trivial to simply re-use it and use data-classes rather than strict data-bindings for writing our KnockoutJS applications instead. The net result is hopefully cleaner markup with our data bindings being shifted from the View to a bindings object instead.
