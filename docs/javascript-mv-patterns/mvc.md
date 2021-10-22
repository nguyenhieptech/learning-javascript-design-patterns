---
sidebar_position: 2
---

# MVC

MVC is an architectural design pattern that encourages improved application organization through a separation of concerns. It enforces the isolation of business data (Models) from user interfaces (Views), with a third component (Controllers) traditionally managing logic and user-input. The pattern was originally designed by [Trygve Reenskaug](https://en.wikipedia.org/wiki/Trygve_Reenskaug) during his time working on Smalltalk-80 (1979) where it was initially called Model-View-Controller-Editor. MVC went on to be described in depth in 1995's [“Design Patterns: Elements of Reusable Object-Oriented Software”](https://www.amazon.co.uk/Design-patterns-elements-reusable-object-oriented/dp/0201633612) (The "GoF" book), which played a role in popularizing its use.

## Smalltalk-80 MVC

It's important to understand what the original MVC pattern was aiming to solve as it's mutated quite heavily since the days of its origin. Back in the 70's, graphical user-interfaces were few and far between and a concept known as [Separated Presentation](https://martinfowler.com/eaaDev/uiArchs.html) began to be used as a means to make a clear division between domain objects which modeled concepts in the real world (e.g a photo, a person) and the presentation objects which were rendered to the user's screen.

The Smalltalk-80 implementation of MVC took this concept further and had an objective of separating out the application logic from the user interface. The idea was that decoupling these parts of the application would also allow the reuse of models for other interfaces in the application. There are some interesting points worth noting about Smalltalk-80's MVC architecture:

- A Model represented domain-specific data and was ignorant of the user-interface (Views and Controllers). When a model changed, it would inform its observers.
- A View represented the current state of a Model. The Observer pattern was used for letting the View know whenever the Model was updated or modified.
- Presentation was taken care of by the View, but there wasn't just a single View and Controller - a View-Controller pair was required for each section or element being displayed on the screen.
- The Controllers role in this pair was handling user interaction (such as key-presses and actions e.g. clicks), making decisions for the View.

Developers are sometimes surprised when they learn that the Observer pattern (nowadays commonly implemented as the Publish/Subscribe variation) was included as a part of MVC's architecture many decades ago. In Smalltalk-80's MVC, the View observes the Model. As mentioned in the bullet point above, anytime the Model changes, the Views react. A simple example of this is an application backed by stock market data - in order for the application to be useful, any change to the data in our Models should result in the View being refreshed instantly.

Martin Fowler has done an excellent job of writing about the [origins](https://martinfowler.com/eaaDev/uiArchs.html) of MVC over the years and if interested in some further historical information about Smalltalk-80's MVC, I recommend reading his work.

## MVC For JavaScript Developers

We've reviewed the 70's, but let us now return to the here and now. In modern times, the MVC pattern has been applied to a diverse range of programming languages including of most relevance to us: JavaScript. JavaScript now has a number of frameworks boasting support for MVC (or variations on it, which we refer to as the MV\* family), allowing developers to easily add structure to their applications without great effort.

These frameworks include the likes of Backbone, Ember.js and AngularJS. Given the importance of avoiding "spaghetti" code, a term which describes code that is very difficult to read or maintain due to its lack of structure, it's imperative that the modern JavaScript developer understand what this pattern provides. This allows us to effectively appreciate what these frameworks enable us to do differently.

We know that MVC is composed of three core components:

### Models

Models manage the data for an application. They are concerned with neither the user-interface nor presentation layers but instead represent unique forms of data that an application may require. When a model changes (e.g when it is updated), it will typically notify its observers (e.g views, a concept we will cover shortly) that a change has occurred so that they may react accordingly.

To understand models further, let us imagine we have a JavaScript photo gallery application. In a photo gallery, the concept of a photo would merit its own model as it represents a unique kind of domain-specific data. Such a model may contain related attributes such as a caption, image source and additional meta-data. A specific photo would be stored in an instance of a model and a model may also be reusable. Below we can see an example of a very simplistic model implemented using Backbone.

```js
var Photo = Backbone.Model.extend({
  // Default attributes for the photo
  defaults: {
    src: 'placeholder.jpg',
    caption: 'A default image',
    viewed: false,
  },

  // Ensure that each photo created has an `src`.
  initialize: function () {
    this.set({ src: this.defaults.src });
  },
});
```

The built-in capabilities of models vary across frameworks, however it is quite common for them to support validation of attributes, where attributes represent the properties of the model, such as a model identifier. When using models in real-world applications we generally also desire model persistence. Persistence allows us to edit and update models with the knowledge that its most recent state will be saved in either: memory, in a user's localStorage data-store or synchronized with a database.

In addition, a model may also have multiple views observing it. If say, our photo model contained meta-data such as its location (longitude and latitude), friends that were present in the photo (a list of identifiers) and a list of tags, a developer may decide to provide a single view to display each of these three facets.

It is not uncommon for modern MVC/MV\* frameworks to provide a means to group models together (e.g. in Backbone, these groups are referred to as "collections"). Managing models in groups allows us to write application logic based on notifications from the group should any model it contains be changed. This avoids the need to manually observe individual model instances.

A sample grouping of models into a simplified Backbone collection can be seen below.

```js
var PhotoGallery = Backbone.Collection.extend({
  // Reference to this collection's model.
  model: Photo,

  // Filter down the list of all photos
  // that have been viewed
  viewed: function () {
    return this.filter(function (photo) {
      return photo.get('viewed');
    });
  },

  // Filter down the list to only photos that
  // have not yet been viewed
  unviewed: function () {
    return this.without.apply(this, this.viewed());
  },
});
```

Older texts on MVC may also contain reference to a notion of models managing application state.In JavaScript applications state has a different connotation, typically referring to the current "state" i.e view or sub-view (with specific data) on a users screen at a fixed point. State is a topic which is regularly discussed when looking at Single-page applications, where the concept of state needs to be simulated.

So to summarize, models are primarily concerned with business data.

### Views

Views are a visual representation of models that present a filtered view of their current state. Whilst Smalltalk views are about painting and maintaining a bitmap, JavaScript views are about building and maintaining a DOM element.

A view typically observes a model and is notified when the model changes, allowing the view to update itself accordingly. Design pattern literature commonly refers to views as "dumb" given that their knowledge of models and controllers in an application is limited.

Users are able to interact with views and this includes the ability to read and edit (i.e get or set the attribute values in) models. As the view is the presentation layer, we generally present the ability to edit and update in a user-friendly fashion. For example, in the former photo gallery application we discussed earlier, model editing could be facilitated through an "edit' view where a user who has selected a specific photo could edit its meta-data.

The actual task of updating the model falls to controllers (which we will be covering shortly).

Let's explore views a little further using a vanilla JavaScript sample implementation. Below we can see a function that creates a single Photo view, consuming both a model instance and a controller instance.

We define a `render()` utility within our view which is responsible for rendering the contents of the `photoModel` using a JavaScript templating engine (Underscore templating) and updating the contents of our view, referenced by `photoEl`.

The `photoModel` then adds our `render()` callback as one of its subscribers so that through the Observer pattern we can trigger the view to update when the model changes.

One may wonder where user-interaction comes into play here. When users click on any elements within the view, it's not the view's responsibility to know what to do next. It relies on a controller to make this decision for it. In our sample implementation, this is achieved by adding an event listener to `photoEl` which will delegate handling the click behavior back to the controller, passing the model information along with it in case it's needed.

The benefit of this architecture is that each component plays its own separate role in making the application function as needed.

```js
var buildPhotoView = function (photoModel, photoController) {
  var base = document.createElement('div'),
    photoEl = document.createElement('div');

  base.appendChild(photoEl);

  var render = function () {
    // We use a templating library such as Underscore
    // templating which generates the HTML for our
    // photo entry
    photoEl.innerHTML = _.template('#photoTemplate', {
      src: photoModel.getSrc(),
    });
  };

  photoModel.addSubscriber(render);

  photoEl.addEventListener('click', function () {
    photoController.handleEvent('click', photoModel);
  });

  var show = function () {
    photoEl.style.display = '';
  };

  var hide = function () {
    photoEl.style.display = 'none';
  };

  return {
    showView: show,
    hideView: hide,
  };
};
```

#### Templating

In the context of JavaScript frameworks that support MVC/MV\*, it is worth briefly discussing JavaScript templating and its relationship to views as we briefly touched upon it in the last section.

It has long been considered (and proven) a performance bad practice to manually create large blocks of HTML markup in-memory through string concatenation. Developers doing so have fallen prey to inperformantly iterating through their data, wrapping it in nested divs and using outdated techniques such as `document.write` to inject the "template" into the DOM. As this typically means keeping scripted markup inline with our standard markup, it can quickly become both difficult to read and more importantly, maintain such disasters, especially when building non-trivially sized applications.

JavaScript templating solutions (such as Handlebars.js and Mustache) are often used to define templates for views as markup (either stored externally or within script tags with a custom type - e.g text/template) containing template variables. Variables may be delimitated using a variable syntax (e.g {{name}}) and frameworks are typically smart enough to accept data in a JSON form (which model instances can be converted to) such that we only need be concerned with maintaining clean models and clean templates. Most of the grunt work to do with population is taken care of by the framework itself. This has a large number of benefits, particularly when opting to store templates externally as this can give way to templates being dynamically loaded on an as-needed basis when it comes to building larger applications.

Below we can see two examples of HTML templates. One implemented using the popular Handlebars.js framework and another using Underscore's templates.

#### Handlebars.js:

```js
<li class='photo'>
  <h2>{{ caption }}</h2>
  <img class='source' src='{{src}}' />
  <div class='meta-data'>{{ metadata }}</div>
</li>
```

#### Underscore.js Microtemplates:

```js
<li class="photo">
  <h2><%= caption %></h2>
  <img class="source" src="<%= src %>"/>
  <div class="meta-data">
    <%= metadata %>
  </div>
</li>
```

Note that templates are not themselves views. Developers coming from a Struts Model 2 architecture may feel like a template _is_ a view, but it isn't. A view is an object which observes a model and keeps the visual representation up-to-date. A template _might_ be a declarative way to specify part or even all of a view object so that it can be generated from the template specification.

It is also worth noting that in classical web development, navigating between independent views required the use of a page refresh. In Single-page JavaScript applications however, once data is fetched from a server via Ajax, it can simply be dynamically rendered in a new view within the same page without any such refresh being necessary.

The role of navigation thus falls to a "router", which assists in managing application state (e.g allowing users to bookmark a particular view they have navigated to). As routers are, however, neither a part of MVC nor present in every MVC-like framework, I will not be going into them in greater detail in this section.

To summarize, views are a visual representation of our application data.

### Controllers

Controllers are an intermediary between models and views which are classically responsible for updating the model when the user manipulates the view.

In our photo gallery application, a controller would be responsible for handling changes the user made to the edit view for a particular photo, updating a specific photo model when a user has finished editing.

Remember that the controllers fulfill one role in MVC: the facilitation of the Strategy pattern for the view. In the Strategy pattern regard, the view delegates to the controller at the view's discretion. So, that's how the strategy pattern works. The view could delegate handling user events to the controller when the view sees fit. The view _could_ delegate handling model change events to the controller if the view sees fit, but this is not the traditional role of the controller.

In terms of where most JavaScript MVC frameworks detract from what is conventionally considered "MVC" however, it is with controllers. The reasons for this vary, but in my honest opinion, it is that framework authors initially look at the server-side interpretation of MVC, realize that it doesn't translate 1:1 on the client-side and re-interpret the C in MVC to mean something they feel makes more sense. The issue with this however is that it is subjective, increases the complexity in both understanding the classical MVC pattern and of course the role of controllers in modern frameworks.

As an example, let's briefly review the architecture of the popular architectural framework Backbone.js. Backbone contains models and views (somewhat similar to what we reviewed earlier), however it doesn't actually have true controllers. Its views and routers act a little similar to a controller, but neither are actually controllers on their own.

In this respect, contrary to what might be mentioned in the official documentation or in blog posts, Backbone is neither a truly MVC/MVP nor MVVM framework. It's in fact better to consider it a member of the MV* family which approaches architecture in its own way. There is of course nothing wrong with this, but it is important to distinguish between classical MVC and MV* should we begin relying on advice from classical literature on the former to help with the latter.

### Controllers in another library (Spine.js) vs Backbone.js

#### Spine.js

We now know that controllers are traditionally responsible for updating the model when the user updates the view. It's interesting to note that the most popular JavaScript MVC/MV\* framework at the time of writing (Backbone) does not have it's own explicit concept of controllers.

It can thus be useful for us to review the controller from another MVC framework to appreciate the difference in implementations and further demonstrate how nontraditionally frameworks approach the role of the controller. For this, let's take a look at a sample controller from Spine.js:

In this example, we're going to have a controller called `PhotosController` which will be in charge of individual photos in the application. It will ensure that when the view updates (e.g a user edited the photo meta-data) the corresponding model does too.

Note: We won't be delving heavily into Spine.js at all, but will just take a ten-foot view of what its controllers can do:

```js
// Controllers in Spine are created by inheriting from Spine.Controller

var PhotosController = Spine.Controller.sub({
  init: function () {
    this.item.bind('update', this.proxy(this.render));
    this.item.bind('destroy', this.proxy(this.remove));
  },

  render: function () {
    // Handle templating
    this.replace($('#photoTemplate').tmpl(this.item));
    return this;
  },

  remove: function () {
    this.el.remove();
    this.release();
  },
});
```

In Spine, controllers are considered the glue for an application, adding and responding to DOM events, rendering templates and ensuring that views and models are kept in sync (which makes sense in the context of what we know to be a controller).

What we're doing in the above example is setting up listeners in the `update` and `destroy` events using `render()` and `remove()`. When a photo entry gets updated, we re-render the view to reflect the changes to the meta-data. Similarly, if the photo gets deleted from the gallery, we remove it from the view. In the `render()` function, we're using Underscore micro-templating (via `_.template()`) to render a JavaScript template with the ID #photoTemplate. This simply returns a compiled HTML string used to populate the contents of `photoEl`.

What this provides us with is a very lightweight, simple way to manage changes between the model and the view.

#### Backbone.js

Later on in this section we're going to revisit the differences between Backbone and traditional MVC, but for now let's focus on controllers.

In Backbone, one shares the responsibility of a controller with both the `Backbone.View` and `Backbone.Router`. Some time ago Backbone did once come with its own `Backbone.Controller`, but as the naming for this component didn't make sense for the context in which it was being used, it was later renamed to Router.

Routers handle a little more of the controller responsibility as it's possible to bind the events there for models and have our view respond to DOM events and rendering. As Tim Branyen (another Bocoup-based Backbone contributor) has also previously pointed out, it's possible to get away with not needing `Backbone.Router` at all for this, so a way to think about it using the Router paradigm is probably:

```js
var PhotoRouter = Backbone.Router.extend({
  routes: { 'photos/:id': 'route' },

  route: function (id) {
    var item = photoCollection.get(id);
    var view = new PhotoView({ model: item });

    $('.content').html(view.render().el);
  },
});
```

To summarize, the takeaway from this section is that controllers manage the logic and coordination between models and views in an application.

## What does MVC give us?

This separation of concerns in MVC facilitates simpler modularization of an application's functionality and enables:

- Easier overall maintenance. When updates need to be made to the application it is very clear whether the changes are data-centric, meaning changes to models and possibly controllers, or merely visual, meaning changes to views.
- Decoupling models and views means that it is significantly more straight-forward to write unit tests for business logic
- Duplication of low-level model and controller code (i.e what we may have been using instead) is eliminated across the application
- Depending on the size of the application and separation of roles, this modularity allows developers responsible for core logic and developers working on the user-interfaces to work simultaneously

## Smalltalk-80 MVC In JavaScript

Although the majority of modern-day JavaScript frameworks attempt to evolve the MVC paradigm to better fit the differing needs of web application development, there is one framework which attempts to adhere to the pure form of the pattern found in Smalltalk-80. Maria.js (https://github.com/petermichaux/maria) by Peter Michaux offers an implementation which is faithful to MVCs origins - Models are models, Views are views and Controllers are nothing but controllers. Whilst some developers might feel an MV\* framework should address more concerns, this is a useful reference to be aware of in case you would like a JavaScript implementation of the original MVC.

### Delving deeper

At this point in the book, we should have a basic understanding of what the MVC pattern provides, but there's still some fascinating information about it worth noting.

The GoF do not refer to MVC as a design pattern, but rather consider it a _set of classes to build a user interface_. In their view, it's actually a variation of three classical design patterns: the Observer, Strategy and Composite patterns. Depending on how MVC has been implemented in a framework, it may also use the Factory and Template patterns. The GoF book mentions these patterns as useful extras when working with MVC.

As we have discussed, models represent application data whilst views are what the user is presented on screen. As such, MVC relies on the Observer pattern for some of its core communication (something that surprisingly isn't covered in many articles about the MVC pattern). When a model is changed it notifies its observers (Views) that something has been updated - this is perhaps the most important relationship in MVC. The observer nature of this relationship is also what facilitates multiple views being attached to the same model.

For developers interested in knowing more about the decoupled nature of MVC (once again, depending on the implementation), one of the goals of the pattern is to help define one-to-many relationships between a topic (data object) and its observers. When a topic changes, its observers are updated. Views and controllers have a slightly different relationship. Controllers facilitate views to respond to different user input and are an example of the Strategy pattern.

### Summary

Having reviewed the classical MVC pattern, we should now understand how it allows us to cleanly separate concerns in an application. We should also now appreciate how JavaScript MVC frameworks may differ in their interpretation of the MVC pattern, which although quite open to variation, still shares some of the fundamental concepts the original pattern has to offer.

When reviewing a new JavaScript MVC/MV\* framework, remember - it can be useful to step back and review how it's opted to approach architecture (specifically, how it supports implementing models, views, controllers or other alternatives) as this can better help us grok how the framework expects to be used.
