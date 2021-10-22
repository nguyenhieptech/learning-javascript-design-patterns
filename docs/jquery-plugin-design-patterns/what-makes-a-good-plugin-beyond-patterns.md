---
sidebar_position: 13
---

# What Makes A Good Plugin Beyond Patterns?

At the end of the day, design patterns are just one facet to writing maintainable jQuery plugins. There are a number of other factors worth considering and I would like to share my own criteria for selecting third-party plugins to address some of the other concerns. I hope this helps increase the overall quality of your plugin projects:

**Quality**
Adhere to best practices with respect to both the JavaScript and jQuery that you write. Are efforts being made to lint the plugin code using either jsHint or jsLint? Is the plugin written optimally?

**Code Style**
Does the plugin follow a consistent code style guide such as the [jQuery Core Style Guidelines](http://docs.jquery.com/JQuery_Core_Style_Guidelines)? If not, is your code at least relatively clean and readable?

**Compatibility**

Which versions of jQuery is the plugin compatible with? Has it been tested with the latest jQuery-git builds or latest stable? If the plugin was written before jQuery 1.6, then it might have issues with attributes and properties, because the way they were approached changed in that release.

New versions of jQuery offer improvements and opportunities for the jQuery project to improve on what the core library offers. With this comes occasional breakages (mainly in major releases) as we move towards a better way of doing things. I’d like to see plugin authors update their code when necessary or, at a minimum, test their plugins with new versions to make sure everything works as expected.

**Reliability**

The plugin should come with its own set of unit tests. Not only do these prove it actually functions as expected, but they can also improve the design without breaking it for end users. I consider unit tests essential for any serious jQuery plugin that is meant for a production environment, and they’re not that hard to write. For an excellent guide to automated JavaScript testing with QUnit, you may be interested in “[Automating JavaScript Testing With QUnit](https://msdn.microsoft.com/en-us/scriptjunkie/gg749824),” by [Jörn Zaefferer](http://bassistance.de/).

**Performance**

If the plugin needs to perform tasks that require extensive processing or heavily manipulation of the DOM, one should follow best practices for benchmarking to help minimize this. Use jsPerf.com to test segments of the code to a) how well it performs in different browsers and b) discover what, if anything, might be optimized further.

**Documentation**

If the intension is for other developers to use the plugin, ensure that it’s well documented. Document the API and how the plugin is to be used. What methods and options does the plugin support? Does it have any gotchas that users need to be aware of? If users cannot figure out how to use the plugin, they’ll likely look for an alternative. It is also of great help to comment your plugin code. This is by far the best gift you can offer other developers. If someone feels they can navigate your code base well enough to use it or improve it, then you’ve done a good job.

**Likelihood of maintenance**

When releasing a plugin, estimate how much time may be required for maintenance and support. We all love to share our plugins with the community, but one needs to set expectations for ones ability to answer questions, address issues and make continuous improvements. This can be done simply by stating the project intentions for maintenance support upfront in the README file.
