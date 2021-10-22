---
sidebar_position: 5
---

# Observer Pattern

The Observer is a design pattern where an object (known as a subject) maintains a list of objects depending on it (observers), automatically notifying them of any changes to state.

When a subject needs to notify observers about something interesting happening, it broadcasts a notification to the observers (which can include specific data related to the topic of the notification).

When we no longer wish for a particular observer to be notified of changes by the subject they are registered with, the subject can remove them from the list of observers.

It's often useful to refer back to published definitions of design patterns that are language agnostic to get a broader sense of their usage and advantages over time. The definition of the Observer pattern provided in the GoF book, _Design Patterns: Elements of Reusable Object-Oriented Software_, is:

> _"One or more observers are interested in the state of a subject and register their interest with the subject by attaching themselves. When something changes in our subject that the observer may be interested in, a notify message is sent which calls the update method in each observer. When the observer is no longer interested in the subject's state, they can simply detach themselves."_

We can now expand on what we've learned to implement the Observer pattern with the following components:

- _Subject_: maintains a list of observers, facilitates adding or removing observers
- _Observer_: provides an update interface for objects that need to be notified of a Subject's changes of state
- _ConcreteSubject_: broadcasts notifications to observers on changes of state, stores the state of ConcreteObservers
- _ConcreteObserver_: stores a reference to the ConcreteSubject, implements an update interface for the Observer to ensure state is consistent with the Subject's

First, let's model the list of dependent Observers a subject may have:

```js
function ObserverList() {
  this.observerList = [];
}

ObserverList.prototype.add = function (obj) {
  return this.observerList.push(obj);
};

ObserverList.prototype.count = function () {
  return this.observerList.length;
};

ObserverList.prototype.get = function (index) {
  if (index > -1 && index < this.observerList.length) {
    return this.observerList[index];
  }
};

ObserverList.prototype.indexOf = function (obj, startIndex) {
  var i = startIndex;

  while (i < this.observerList.length) {
    if (this.observerList[i] === obj) {
      return i;
    }
    i++;
  }

  return -1;
};

ObserverList.prototype.removeAt = function (index) {
  this.observerList.splice(index, 1);
};
```

Next, let's model the Subject and the ability to add, remove or notify observers on the observer list.

```js
function Subject() {
  this.observers = new ObserverList();
}

Subject.prototype.addObserver = function (observer) {
  this.observers.add(observer);
};

Subject.prototype.removeObserver = function (observer) {
  this.observers.removeAt(this.observers.indexOf(observer, 0));
};

Subject.prototype.notify = function (context) {
  var observerCount = this.observers.count();
  for (var i = 0; i < observerCount; i++) {
    this.observers.get(i).update(context);
  }
};
```

We then define a skeleton for creating new Observers. The update functionality here will be overwritten later with custom behaviour.

```js
// The Observer
function Observer() {
  this.update = function () {
    // ...
  };
}
```

In our sample application using the above Observer components, we now define:

- A button for adding new observable checkboxes to the page
- A control checkbox which will act as a subject, notifying other checkboxes they should be checked
- A container for the new checkboxes being added

We then define ConcreteSubject and ConcreteObserver handlers for both adding new observers to the page and implementing the updating interface. See below for inline comments on what these components do in the context of our example.

#### HTML

```html
<button id="addNewObserver">Add New Observer checkbox</button>
<input id="mainCheckbox" type="checkbox" />
<div id="observersContainer"></div>
```

#### Sample script:

```js
// Extend an object with an extension
function extend(obj, extension) {
  for (var key in extension) {
    obj[key] = extension[key];
  }
}

// References to our DOM elements

var controlCheckbox = document.getElementById('mainCheckbox'),
  addBtn = document.getElementById('addNewObserver'),
  container = document.getElementById('observersContainer');

// Concrete Subject

// Extend the controlling checkbox with the Subject class
extend(controlCheckbox, new Subject());

// Clicking the checkbox will trigger notifications to its observers
controlCheckbox.onclick = function () {
  controlCheckbox.notify(controlCheckbox.checked);
};

addBtn.onclick = addNewObserver;

// Concrete Observer

function addNewObserver() {
  // Create a new checkbox to be added
  var check = document.createElement('input');
  check.type = 'checkbox';

  // Extend the checkbox with the Observer class
  extend(check, new Observer());

  // Override with custom update behaviour
  check.update = function (value) {
    this.checked = value;
  };

  // Add the new observer to our list of observers
  // for our main subject
  controlCheckbox.addObserver(check);

  // Append the item to the container
  container.appendChild(check);
}
```

In this example, we looked at how to implement and utilize the Observer pattern, covering the concepts of a Subject, Observer, ConcreteSubject and ConcreteObserver.

## Differences Between The Observer And Publish/Subscribe Pattern

Whilst the Observer pattern is useful to be aware of, quite often in the JavaScript world, we'll find it commonly implemented using a variation known as the Publish/Subscribe pattern. Whilst very similar, there are differences between these patterns worth noting.

The Observer pattern requires that the observer (or object) wishing to receive topic notifications must subscribe this interest to the object firing the event (the subject).

The Publish/Subscribe pattern however uses a topic/event channel which sits between the objects wishing to receive notifications (subscribers) and the object firing the event (the publisher). This event system allows code to define application specific events which can pass custom arguments containing values needed by the subscriber. The idea here is to avoid dependencies between the subscriber and publisher.

This differs from the Observer pattern as it allows any subscriber implementing an appropriate event handler to register for and receive topic notifications broadcast by the publisher.

Here is an example of how one might use the Publish/Subscribe if provided with a functional implementation powering `publish()`,`subscribe()` and `unsubscribe()` behind the scenes:

```js
// A very simple new mail handler

// A count of the number of messages received
var mailCounter = 0;

// Initialize subscribers that will listen out for a topic
// with the name "inbox/newMessage".

// Render a preview of new messages
var subscriber1 = subscribe('inbox/newMessage', function (topic, data) {
  // Log the topic for debugging purposes
  console.log('A new message was received: ', topic);

  // Use the data that was passed from our subject
  // to display a message preview to the user
  $('.messageSender').html(data.sender);
  $('.messagePreview').html(data.body);
});

// Here's another subscriber using the same data to perform
// a different task.

// Update the counter displaying the number of new
// messages received via the publisher

var subscriber2 = subscribe('inbox/newMessage', function (topic, data) {
  $('.newMessageCounter').html(++mailCounter);
});

publish('inbox/newMessage', [
  {
    sender: 'hello@google.com',
    body: 'Hey there! How are you doing today?',
  },
]);

// We could then at a later point unsubscribe our subscribers
// from receiving any new topic notifications as follows:
// unsubscribe( subscriber1 );
// unsubscribe( subscriber2 );
```

The general idea here is the promotion of loose coupling. Rather than single objects calling on the methods of other objects directly, they instead subscribe to a specific task or activity of another object and are notified when it occurs.

## Advantages

The Observer and Publish/Subscribe patterns encourage us to think hard about the relationships between different parts of our application. They also help us identify what layers containing direct relationships which could instead be replaced with sets of subjects and observers. This effectively could be used to break down an application into smaller, more loosely coupled blocks to improve code management and potentials for re-use.

Further motivation behind using the Observer pattern is where we need to maintain consistency between related objects without making classes tightly coupled. For example, when an object needs to be able to notify other objects without making assumptions regarding those objects.

Dynamic relationships can exist between observers and subjects when using either pattern. This provides a great deal of flexibility which may not be as easy to implement when disparate parts of our application are tightly coupled.

Whilst it may not always be the best solution to every problem, these patterns remain one of the best tools for designing decoupled systems and should be considered an important tool in any JavaScript developer's utility belt.

## Disadvantages

Consequently, some of the issues with these patterns actually stem from their main benefits. In Publish/Subscribe, by decoupling publishers from subscribers, it can sometimes become difficult to obtain guarantees that particular parts of our applications are functioning as we may expect.

For example, publishers may make an assumption that one or more subscribers are listening to them. Say that we're using such an assumption to log or output errors regarding some application process. If the subscriber performing the logging crashes (or for some reason fails to function), the publisher won't have a way of seeing this due to the decoupled nature of the system.

Another draw-back of the pattern is that subscribers are quite ignorant to the existence of each other and are blind to the cost of switching publishers. Due to the dynamic relationship between subscribers and publishers, the update dependency can be difficult to track.

## Publish/Subscribe Implementations

Publish/Subscribe fits in very well in JavaScript ecosystems, largely because at the core, ECMAScript implementations are event driven. This is particularly true in browser environments as the DOM uses events as its main interaction API for scripting.

That said, neither ECMAScript nor DOM provide core objects or methods for creating custom events systems in implementation code (with the exception of perhaps the DOM3 CustomEvent, which is bound to the DOM and is thus not generically useful).

Luckily, popular JavaScript libraries such as dojo, jQuery (custom events) and YUI already have utilities that can assist in easily implementing a Publish/Subscribe system with very little effort. Below we can see some examples of this:

```js
// Publish

// jQuery: $(obj).trigger("channel", [arg1, arg2, arg3]);
$( el ).trigger( "/login", [{username:"test", userData:"test"}] );

// Dojo: dojo.publish("channel", [arg1, arg2, arg3] );
dojo.publish( "/login", [{username:"test", userData:"test"}] );

// YUI: el.publish("channel", [arg1, arg2, arg3]);
el.publish( "/login", {username:"test", userData:"test"} );


// Subscribe

// jQuery: $(obj).on( "channel", [data], fn );
$( el ).on( "/login", function( event ){...} );

// Dojo: dojo.subscribe( "channel", fn);
var handle = dojo.subscribe( "/login", function(data){..} );

// YUI: el.on("channel", handler);
el.on( "/login", function( data ){...} );


// Unsubscribe

// jQuery: $(obj).off( "channel" );
$( el ).off( "/login" );

// Dojo: dojo.unsubscribe( handle );
dojo.unsubscribe( handle );

// YUI: el.detach("channel");
el.detach( "/login" );
```

For those wishing to use the Publish/Subscribe pattern with vanilla JavaScript (or another library) [AmplifyJS](http://amplifyjs.com/) includes a clean, library-agnostic implementation that can be used with any library or toolkit. Radio.js (http://radio.uxder.com/), PubSubJS (https://github.com/mroderick/PubSubJS) or Pure JS PubSub by Peter Higgins (https://github.com/phiggins42/bloody-jquery-plugins/blob/55e41df9bf08f42378bb08b93efcb28555b61aeb/pubsub.js) are also similar alternatives worth checking out.

jQuery developers in particular have quite a few other options and can opt to use one of the many well-developed implementations ranging from Peter Higgins's jQuery plugin to Ben Alman's (optimized) Pub/Sub jQuery gist on GitHub. Links to just a few of these can be found below.

- Ben Alman's Pub/Sub gist https://gist.github.com/661855 (recommended)
- Rick Waldron's jQuery-core style take on the above https://gist.github.com/705311
- Peter Higgins" plugin http://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js.
- AppendTo's Pub/Sub in AmplifyJS http://amplifyjs.com
- Ben Truyman's gist https://gist.github.com/826794

So that we are able to get an appreciation for how many of the vanilla JavaScript implementations of the Observer pattern might work, let's take a walk through of a minimalist version of Publish/Subscribe I released on GitHub under a project called [pubsubz](https://github.com/addyosmani/pubsubz). This demonstrates the core concepts of subscribe, publish as well as the concept of unsubscribing.

I've opted to base our examples on this code as it sticks closely to both the method signatures and approach of implementation I would expect to see in a JavaScript version of the classic Observer pattern.

### A Publish/Subscribe Implementation

```js
var pubsub = {};

(function (myObject) {
  // Storage for topics that can be broadcast
  // or listened to
  var topics = {};

  // A topic identifier
  var subUid = -1;

  // Publish or broadcast events of interest
  // with a specific topic name and arguments
  // such as the data to pass along
  myObject.publish = function (topic, args) {
    if (!topics[topic]) {
      return false;
    }

    var subscribers = topics[topic],
      len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(topic, args);
    }

    return this;
  };

  // Subscribe to events of interest
  // with a specific topic name and a
  // callback function, to be executed
  // when the topic/event is observed
  myObject.subscribe = function (topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func,
    });
    return token;
  };

  // Unsubscribe from a specific
  // topic, based on a tokenized reference
  // to the subscription
  myObject.unsubscribe = function (token) {
    for (var m in topics) {
      if (topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return this;
  };
})(pubsub);
```

### Example: Using Our Implementation

We can now use the implementation to publish and subscribe to events of interest as follows:

```js
// Another simple message handler

// A simple message logger that logs any topics and data received through our
// subscriber
var messageLogger = function (topics, data) {
  console.log('Logging: ' + topics + ': ' + data);
};

// Subscribers listen for topics they have subscribed to and
// invoke a callback function (e.g messageLogger) once a new
// notification is broadcast on that topic
var subscription = pubsub.subscribe('inbox/newMessage', messageLogger);

// Publishers are in charge of publishing topics or notifications of
// interest to the application. e.g:

pubsub.publish('inbox/newMessage', 'hello world!');

// or
pubsub.publish('inbox/newMessage', ['test', 'a', 'b', 'c']);

// or
pubsub.publish('inbox/newMessage', {
  sender: 'hello@google.com',
  body: 'Hey again!',
});

// We can also unsubscribe if we no longer wish for our subscribers
// to be notified
pubsub.unsubscribe(subscription);

// Once unsubscribed, this for example won't result in our
// messageLogger being executed as the subscriber is
// no longer listening
pubsub.publish('inbox/newMessage', 'Hello! are you still there?');
```

### Example: User-Interface Notifications

Next, let's imagine we have a web application responsible for displaying real-time stock information.

The application might have a grid for displaying the stock stats and a counter for displaying the last point of update. When the data model changes, the application will need to update the grid and counter. In this scenario, our subject (which will be publishing topics/notifications) is the data model and our subscribers are the grid and counter.

When our subscribers receive notification that the model itself has changed, they can update themselves accordingly.

In our implementation, our subscriber will listen to the topic "newDataAvailable" to find out if new stock information is available. If a new notification is published to this topic, it will trigger `gridUpdate` to add a new row to our grid containing this information. It will also update a _last updated_ counter to log the last time data was added

```js
// Return the current local time to be used in our UI later
getCurrentTime = function () {
  var date = new Date(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    y = date.getFullYear(),
    t = date.toLocaleTimeString().toLowerCase();

  return m + '/' + d + '/' + y + ' ' + t;
};

// Add a new row of data to our fictional grid component
function addGridRow(data) {
  // ui.grid.addRow( data );
  console.log('updated grid component with:' + data);
}

// Update our fictional grid to show the time it was last
// updated
function updateCounter(data) {
  // ui.grid.updateLastChanged( getCurrentTime() );
  console.log('data last updated at: ' + getCurrentTime() + ' with ' + data);
}

// Update the grid using the data passed to our subscribers
gridUpdate = function (topic, data) {
  if (data !== undefined) {
    addGridRow(data);
    updateCounter(data);
  }
};

// Create a subscription to the newDataAvailable topic
var subscriber = pubsub.subscribe('newDataAvailable', gridUpdate);

// The following represents updates to our data layer. This could be
// powered by ajax requests which broadcast that new data is available
// to the rest of the application.

// Publish changes to the gridUpdated topic representing new entries
pubsub.publish('newDataAvailable', {
  summary: 'Apple made $5 billion',
  identifier: 'APPL',
  stockPrice: 570.91,
});

pubsub.publish('newDataAvailable', {
  summary: 'Microsoft made $20 million',
  identifier: 'MSFT',
  stockPrice: 30.85,
});
```

### Example: Decoupling applications using Ben Alman's Pub/Sub implementation

In the following movie ratings example, we'll be using Ben Alman's jQuery implementation of Publish/Subscribe to demonstrate how we can decouple a user interface. Notice how submitting a rating only has the effect of publishing the fact that new user and rating data is available.

It's left up to the subscribers to those topics to then delegate what happens with that data. In our case we're pushing that new data into existing arrays and then rendering them using the Underscore library's `.template()` method for templating.

#### HTML/Templates

```html
<script id="userTemplate" type="text/html">
  <li><%= name %></li>
</script>

<script id="ratingsTemplate" type="text/html">
  <li><strong><%= title %></strong> was rated <%= rating %>/5</li>
</script>

<div id="container">
  <div class="sampleForm">
    <p>
      <label for="twitter_handle">Twitter handle:</label>
      <input type="text" id="twitter_handle" />
    </p>
    <p>
      <label for="movie_seen">Name a movie you've seen this year:</label>
      <input type="text" id="movie_seen" />
    </p>
    <p>
      <label for="movie_rating">Rate the movie you saw:</label>
      <select id="movie_rating">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5" selected>5</option>
      </select>
    </p>
    <p>
      <button id="add">Submit rating</button>
    </p>
  </div>

  <div class="summaryTable">
    <div id="users"><h3>Recent users</h3></div>
    <div id="ratings"><h3>Recent movies rated</h3></div>
  </div>
</div>
```

#### JavaScript

```js
(function ($) {
  // Pre-compile templates and "cache" them using closure
  var userTemplate = _.template($('#userTemplate').html()),
    ratingsTemplate = _.template($('#ratingsTemplate').html());

  // Subscribe to the new user topic, which adds a user
  // to a list of users who have submitted reviews
  $.subscribe('/new/user', function (e, data) {
    if (data) {
      $('#users').append(userTemplate(data));
    }
  });

  // Subscribe to the new rating topic. This is composed of a title and
  // rating. New ratings are appended to a running list of added user
  // ratings.
  $.subscribe('/new/rating', function (e, data) {
    if (data) {
      $('#ratings').append(ratingsTemplate(data));
    }
  });

  // Handler for adding a new user
  $('#add').on('click', function (e) {
    e.preventDefault();

    var strUser = $('#twitter_handle').val(),
      strMovie = $('#movie_seen').val(),
      strRating = $('#movie_rating').val();

    // Inform the application a new user is available
    $.publish('/new/user', { name: strUser });

    // Inform the app a new rating is available
    $.publish('/new/rating', { title: strMovie, rating: strRating });
  });
})(jQuery);
```

### Example: Decoupling an Ajax-based jQuery application

In our final example, we're going to take a practical look at how decoupling our code using Pub/Sub early on in the development process can save us some potentially painful refactoring later on.

Quite often in Ajax-heavy applications, once we've received a response to a request we want to achieve more than just one unique action. One could simply add all of their post-request logic into a success callback, but there are drawbacks to this approach.

Highly coupled applications sometimes increase the effort required to reuse functionality due to the increased inter-function/code dependency. What this means is that although keeping our post-request logic hardcoded in a callback might be fine if we're just trying to grab a result set once, it's not as appropriate when we want to make further Ajax-calls to the same data source (and different end-behavior) without rewriting parts of the code multiple times. Rather than having to go back through each layer that calls the same data-source and generalizing them later on, we can use pub/sub from the start and save time.

Using Observers, we can also easily separate application-wide notifications regarding different events down to whatever level of granularity we're comfortable with - something which can be less elegantly done using other patterns.

Notice how in our sample below, one topic notification is made when a user indicates they want to make a search query and another is made when the request returns and actual data is available for consumption. It's left up to the subscribers to then decide how to use knowledge of these events (or the data returned). The benefits of this are that, if we wanted, we could have 10 different subscribers utilizing the data returned in different ways but as far as the Ajax-layer is concerned, it doesn't care. Its sole duty is to request and return data then pass it on to whoever wants to use it. This separation of concerns can make the overall design of our code a little cleaner.

#### HTML/Templates:

```html
<form id="flickrSearch">
  <input type="text" name="tag" id="query" />

  <input type="submit" name="submit" value="submit" />
</form>

<div id="lastQuery"></div>

<ol id="searchResults"></ol>

<script id="resultTemplate" type="text/html">
  <% _.each(items, function( item ){ %>
  <li><img src="<%= item.media.m %>" /></li>
  <% });%>
</script>
```

#### JavaScript:

```js
(function ($) {
  // Pre-compile template and "cache" it using closure
  var resultTemplate = _.template($('#resultTemplate').html());

  // Subscribe to the new search tags topic
  $.subscribe('/search/tags', function (e, tags) {
    $('#lastQuery').html('<p>Searched for:<strong>' + tags + '</strong></p>');
  });

  // Subscribe to the new results topic
  $.subscribe('/search/resultSet', function (e, results) {
    $('#searchResults').empty().append(resultTemplate(results));
  });

  // Submit a search query and publish tags on the /search/tags topic
  $('#flickrSearch').submit(function (e) {
    e.preventDefault();
    var tags = $(this).find('#query').val();

    if (!tags) {
      return;
    }

    $.publish('/search/tags', [$.trim(tags)]);
  });

  // Subscribe to new tags being published and perform
  // a search query using them. Once data has returned
  // publish this data for the rest of the application
  // to consume

  $.subscribe('/search/tags', function (e, tags) {
    $.getJSON(
      'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?',
      {
        tags: tags,
        tagmode: 'any',
        format: 'json',
      },

      function (data) {
        if (!data.items.length) {
          return;
        }

        $.publish('/search/resultSet', { items: data.items });
      }
    );
  });
})(jQuery);
```

The Observer pattern is useful for decoupling a number of different scenarios in application design and if you haven't been using it, I recommend picking up one of the pre-written implementations mentioned today and just giving it a try out. It's one of the easier design patterns to get started with but also one of the most powerful.
