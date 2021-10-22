---
sidebar_position: 6
---

# Backbone.js Vs. KnockoutJS

Understanding the subtle differences between MVC, MVP and MVVM are important but developers ultimately will ask whether they should consider using KnockoutJS over Backbone based in what we’ve learned. The following notes may be of help here:

- Both libraries are designed with different goals in mind and its often not as simple as just choosing MVC or MVVM

- If data-binding and two-way communication are your main concerns, KnockoutJS is definitely the way to go.Practically any attribute or value stored in DOM nodes can be mapped to JavaScript objects with this approach.

- Backbone excels with its ease of integration with RESTful services, whilst KnockoutJS Models are simply JavaScript objects and code needed for updating the Model must be written by the developer.

- KnockoutJS has a focus on automating UI bindings, which requires significantly more verbose custom code if attempting to do this with Backbone. This isn't a problem with Backbone itself per se as it purposefully attempts to stay out of the UI. Knockback does however attempt to assist with this problem.

- With KnockoutJS, we can bind our own functions to ViewModel observables, which are executed anytime the observable changes. This allows us the same level of flexibility as can be found in Backbone

- Backbone has a solid routing solution built-in, whilst KnockoutJS offers no routing options out of the box. One can however easily fill this behavior in if needed using Ben Alman’s [BBQ plugin](http://benalman.com/projects/jquery-bbq-plugin/) or a standalone routing system like Miller Medeiros’s excellent [Crossroads](https://millermedeiros.github.com/crossroads.js/).

To conclude, I personally find KnockoutJS more suitable for smaller applications whilst Backbone’s feature set really shines when building anything non-trivial. That said, many developers have used both frameworks to write applications of varying complexity and I recommend trying out both at a smaller scale before making a decision on which might work best for your project.

**For further reading about MVVM or Knockout, I recommend the following articles:**

- [The Advantages Of MVVM](http://www.silverlightshow.net/news/The-Advantages-of-MVVM.aspx)
- [SO: What are the problems with MVVM?](https://stackoverflow.com/questions/883895/what-are-the-problems-of-the-mvvm-pattern)
- [MVVM Explained](http://www.codeproject.com/Articles/100175/Model-View-ViewModel-MVVM-Explained)
- [How does MVVM compare to MVC?](https://www.quora.com/Pros-and-cons-of-MVVM-framework-and-how-I-can-campare-it-with-MVC)
- [Custom bindings in KnockoutJS](http://www.knockmeout.net/2011/09/ko-13-preview-part-2-custom-binding.html)
- [Exploring Knockout with TodoMVC](https://gratdevel.blogspot.co.uk/2012/02/exploring-todomvc-and-knockoutjs-with.html)
