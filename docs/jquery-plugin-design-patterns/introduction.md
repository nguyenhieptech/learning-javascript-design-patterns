---
sidebar_position: 1
---

# Introduction

jQuery plugin development has evolved over the past few years. We no longer have just one way to write plugins, but many. In reality, certain plugin design patterns might work better for a particular problem or component than others.

Some developers may wish to use the jQuery UI [widget factory](http://ajpiano.com/widgetfactory/#slide1); it’s great for complex, flexible UI components. Some may not.

Some might like to structure their plugins more like modules (similar to the module pattern) or use a more modern module format such as AMD.

Some might want their plugins to harness the power of prototypal inheritance. Others may wish to use custom events or Publish/Subscribe to communicate from plugins to the rest of their app. And so on.

I began to think about plugin patterns after noticing a number of efforts to create a one-size-fits-all jQuery plugin boilerplate. While such a boilerplate is a great idea in theory, the reality is that we rarely write plugins in one fixed way, using a single pattern all the time.

Let us assume that we’ve tried our hand at writing our own jQuery plugins at some point and we’re comfortable putting together something that works. It’s functional. It does what it needs to do, but perhaps we feel it could be structured better. Maybe it could be more flexible or could be designed to address more of the issues developers commonly run into. If this sounds familiar, then you might find this chapter useful. In it, we're going to explore a number of jQuery plugin patterns that have worked well for other developers in the wild.

**Note:** This chapter is targeted at intermediate to advanced developers, although we will briefly review some jQuery plugin fundamentals to begin.

If you don’t feel quite ready for this just yet, I’m happy to recommend the official jQuery [Plugins/Authoring](http://docs.jquery.com/Plugins/Authoring) guide, Ben Alman’s [plugin style guide](https://msdn.microsoft.com/en-us/scriptjunkie/ff696759) and Remy Sharp’s “[Signs of a Poorly Written jQuery Plugin.](http://remysharp.com/2010/06/03/signs-of-a-poorly-written-jquery-plugin/)” as reading material prior to starting this section.
