---
sidebar_position: 3
---

# MVP

Model-view-presenter (MVP) is a derivative of the MVC design pattern which focuses on improving presentation logic. It originated at a company named [Taligent](https://en.wikipedia.org/wiki/Taligent) in the early 1990s while they were working on a model for a C++ CommonPoint environment. Whilst both MVC and MVP target the separation of concerns across multiple components, there are some fundamental differences between them.

For the purposes of this summary we will focus on the version of MVP most suitable for web-based architectures.

## Models, Views & Presenters

The P in MVP stands for presenter. It's a component which contains the user-interface business logic for the view. Unlike MVC, invocations from the view are delegated to the presenter, which are decoupled from the view and instead talk to it through an interface. This allows for all kinds of useful things such as being able to mock views in unit tests.

The most common implementation of MVP is one which uses a Passive View (a view which is for all intents and purposes "dumb"), containing little to no logic. If MVC and MVP are different it is because the C and P do different things. In MVP, the P observes models and updates views when models change. The P effectively binds models to views, a responsibility which was previously held by controllers in MVC.

Solicited by a view, presenters perform any work to do with user requests and pass data back to them. In this respect, they retrieve data, manipulate it and determine how the data should be displayed in the view. In some implementations, the presenter also interacts with a service layer to persist data (models). Models may trigger events but it's the presenters role to subscribe to them so that it can update the view. In this passive architecture, we have no concept of direct data binding. Views expose setters which presenters can use to set data.

The benefit of this change from MVC is that it increases the testability of our application and provides a more clean separation between the view and the model. This isn't however without its costs as the lack of data binding support in the pattern can often mean having to take care of this task separately.

Although a common implementation of a [Passive View](https://martinfowler.com/eaaDev/PassiveScreen.html) is for the view to implement an interface, there are variations on it, including the use of events which can decouple the View from the Presenter a little more. As we don't have the interface construct in JavaScript, we're using more a protocol than an explicit interface here. It's technically still an API and it's probably fair for us to refer to it as an interface from that perspective.

There is also a [Supervising Controller](https://martinfowler.com/eaaDev/SupervisingPresenter.html) variation of MVP, which is closer to the MVC and [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) patterns as it provides data-binding from the Model directly from the View. Key-value observing (KVO) plugins (such as Derick Bailey's Backbone.ModelBinding plugin) tend to bring Backbone out of the Passive View and more into the Supervising Controller or MVVM variations.

## MVP or MVC?

MVP is generally used most often in enterprise-level applications where it's necessary to reuse as much presentation logic as possible. Applications with very complex views and a great deal of user interaction may find that MVC doesn't quite fit the bill here as solving this problem may mean heavily relying on multiple controllers. In MVP, all of this complex logic can be encapsulated in a presenter, which can simplify maintenance greatly.

As MVP views are defined through an interface and the interface is technically the only point of contact between the system and the view (other than a presenter), this pattern also allows developers to write presentation logic without needing to wait for designers to produce layouts and graphics for the application.

Depending on the implementation, MVP may be easier to automatically unit test than MVC. The reason often cited for this is that the presenter can be used as a complete mock of the user-interface and so it can be unit tested independent of other components. In my experience this really depends on the languages we are implementing MVP in (there's quite a difference between opting for MVP for a JavaScript project over one for say, ASP.net).

At the end of the day, the underlying concerns we may have with MVC will likely hold true for MVP given that the differences between them are mainly semantic. As long as we are cleanly separating concerns into models, views and controllers (or presenters) we should be achieving most of the same benefits regardless of the variation we opt for.

## MVC, MVP and Backbone.js

There are very few, if any architectural JavaScript frameworks that claim to implement the MVC or MVP patterns in their classical form as many JavaScript developers don't view MVC and MVP as being mutually exclusive (we are actually more likely to see MVP strictly implemented when looking at web frameworks such as ASP.net or GWT). This is because it's possible to have additional presenter/view logic in our application and yet still consider it a flavor of MVC.

Backbone contributor [Irene Ros](http://ireneros.com/) (of Boston-based Bocoup) subscribes to this way of thinking as when she separates views out into their own distinct components, she needs something to actually assemble them for her. This could either be a controller route (such as a `Backbone.Router`, covered later in the book) or a callback in response to data being fetched.

That said, some developers do however feel that Backbone.js better fits the description of MVP than it does MVC. Their view is that:

- The presenter in MVP better describes the Backbone.View (the layer between View templates and the data bound to it) than a controller does
- The model fits Backbone.Model (it isn't greatly different to the models in MVC at all)
- The views best represent templates (e.g Handlebars/Mustache markup templates)

A response to this could be that the view can also just be a View (as per MVC) because Backbone is flexible enough to let it be used for multiple purposes. The V in MVC and the P in MVP can both be accomplished by `Backbone.View` because they're able to achieve two purposes: both rendering atomic components and assembling those components rendered by other views.

We've also seen that in Backbone the responsibility of a controller is shared with both the Backbone.View and Backbone.Router and in the following example we can actually see that aspects of that are certainly true.

Our Backbone `PhotoView` uses the Observer pattern to "subscribe" to changes to a View's model in the line `this.model.bind("change",...)`. It also handles templating in the `render()` method, but unlike some other implementations, user interaction is also handled in the View (see `events`).

```js
var PhotoView = Backbone.View.extend({
  //... is a list tag.
  tagName: 'li',

  // Pass the contents of the photo template through a templating
  // function, cache it for a single photo
  template: _.template($('#photo-template').html()),

  // The DOM events specific to an item.
  events: {
    'click img': 'toggleViewed',
  },

  // The PhotoView listens for changes to
  // its model, re-rendering. Since there's
  // a one-to-one correspondence between a
  // **Photo** and a **PhotoView** in this
  // app, we set a direct reference on the model for convenience.

  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
  },

  // Re-render the photo entry
  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  // Toggle the `"viewed"` state of the model.
  toggleViewed: function () {
    this.model.viewed();
  },
});
```

Another (quite different) opinion is that Backbone more closely resembles [Smalltalk-80 MVC](https://martinfowler.com/eaaDev/uiArchs.html#ModelViewController), which we went through earlier.

As regular Backbone blogger Derick Bailey has [previously](https://lostechies.com/derickbailey/2011/12/23/backbone-js-is-not-an-mvc-framework/) put it, it's ultimately best not to force Backbone to fit any specific design patterns. Design patterns should be considered flexible guides to how applications may be structured and in this respect, Backbone fits neither MVC nor MVP. Instead, it borrows some of the best concepts from multiple architectural patterns and creates a flexible framework that just works well.

It is however worth understanding where and why these concepts originated, so I hope that my explanations of MVC and MVP have been of help. Call it **the Backbone way**, MV\* or whatever helps reference its flavor of application architecture. Most structural JavaScript frameworks will adopt their own take on classical patterns, either intentionally or by accident, but the important thing is that they help us develop applications which are organized, clean and can be easily maintained.
