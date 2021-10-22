---
sidebar_position: 1
---

# The Importance Of Decoupling Applications

In the world of scalable JavaScript, when we say an application is **modular**, we often mean it's composed of a set of highly decoupled, distinct pieces of functionality stored in modules. [Loose coupling](http://arguments.callee.info/2009/05/18/javascript-design-patterns--mediator/) facilitates easier maintainability of apps by removing dependencies where possible. When this is implemented efficiently, it's quite easy to see how changes to one part of a system may affect another.

Unlike some more traditional programming languages however, the current iteration of JavaScript ([ECMA-262](https://www.ecma-international.org/publications/standards/Ecma-262.htm)) doesn't provide developers with the means to import such modules of code in a clean, organized manner. It's one of the concerns with specifications that haven't required great thought until more recent years where the need for more organized JavaScript applications became apparent.

Instead, developers at present are left to fall back on variations of the [module](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth) or [object literal](http://rmurphey.com/blog/2009/10/15/using-objects-to-organize-your-code/) patterns, which we covered earlier in the book. With many of these, module scripts are strung together in the DOM with namespaces being described by a single global object where it's still possible to incur naming collisions in our architecture. There's also no clean way to handle dependency management without some manual effort or third party tools.

Whilst native solutions to these problems will be arriving in [ES Harmony](http://wiki.ecmascript.org/doku.php?id=harmony:modules) (likely to be the next version of JavaScript), the good news is that writing modular JavaScript has never been easier and we can start doing it today.

In this section, we're going to look at three formats for writing modular JavaScript: **AMD**, **CommonJS** and proposals for the next version of JavaScript, **Harmony**.

# A Note On Script Loaders

It's difficult to discuss AMD and CommonJS modules without talking about the elephant in the room - [script loaders](https://msdn.microsoft.com/en-us/scriptjunkie/hh227261). At the time of writing this book, script loading is a means to a goal, that goal being modular JavaScript that can be used in applications today - for this, use of a compatible script loader is unfortunately necessary. In order to get the most out of this section, I recommend gaining a **basic understanding** of how popular script loading tools work so the explanations of module formats make sense in context.

There are a number of great loaders for handling module loading in the AMD and CommonJS formats, but my personal preferences are [RequireJS](http://requirejs.org/) and [curl.js](https://github.com/unscriptable/curl). Complete tutorials on these tools are outside the scope of this book, but I can recommend reading John Hann's article about [curl.js](http://unscriptable.com/index.php/2011/03/30/curl-js-yet-another-amd-loader/) and James Burke's [RequireJS](http://requirejs.org/docs/api.html) API documentation for more.

From a production perspective, the use of optimization tools (like the RequireJS optimizer) to concatenate scripts is recommended for deployment when working with such modules. Interestingly, with the [Almond](https://github.com/jrburke/almond) AMD shim, RequireJS doesn't need to be rolled in the deployed site and what one might consider a script loader can be easily shifted outside of development.

That said, James Burke would probably say that being able to dynamically load scripts after page load still has its use cases and RequireJS can assist with this too. With these notes in mind, let's get started.
