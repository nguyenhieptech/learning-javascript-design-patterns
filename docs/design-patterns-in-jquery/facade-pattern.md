---
sidebar_position: 4
---

# Facade Pattern

As we reviewed earlier in the book, the **Facade Pattern** provides a simpler abstracted interface to a larger (potentially more complex) body of code.

Facades can be frequently found across the jQuery library and provide developers easy access to implementations for handling DOM manipulation, animation and of particular interest, cross-browser Ajax.

The following are facades for jQuery's `$.ajax()`:

```js
$.get(url, data, callback, dataType);
$.post(url, data, callback, dataType);
$.getJSON(url, data, callback);
$.getScript(url, callback);
```

These are translated behind the scenes to:

```js
// $.get()
$.ajax({
  url: url,
  data: data,
  dataType: dataType,
}).done(callback);

// $.post
$.ajax({
  type: 'POST',
  url: url,
  data: data,
  dataType: dataType,
}).done(callback);

// $.getJSON()
$.ajax({
  url: url,
  dataType: 'json',
  data: data,
}).done(callback);

// $.getScript()
$.ajax({
  url: url,
  dataType: 'script',
}).done(callback);
```

What's even more interesting is that the above facades are actually facades in their own right, hiding a great deal of complexity behind the scenes.

This is because the `jQuery.ajax()` implementation in jQuery core is a non-trivial piece of code to say the least. At minimum it normalizes the cross-browser differences between XHR (XMLHttpRequest) and makes it trivial for us to perform common HTTP actions (e.g `get`, `post` etc), work with Deferreds and so on.

As it would take an entire chapter to show all of the code related to the above facades, here is instead the code in jQuery core normalizing XHR:

```js
// Functions to create xhrs
function createStandardXHR() {
  try {
    return new window.XMLHttpRequest();
  } catch (e) {}
}

function createActiveXHR() {
  try {
    return new window.ActiveXObject('Microsoft.XMLHTTP');
  } catch (e) {}
}

// Create the request object
jQuery.ajaxSettings.xhr = window.ActiveXObject
  ? /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function () {
      return (!this.isLocal && createStandardXHR()) || createActiveXHR();
    }
  : // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;
    ...
```

Whilst the following block of code is also a level above the actual jQuery XHR (`jqXHR`) implementation, it's the convenience facade that we actually most commonly interact with:

```js
// Request the remote document
jQuery.ajax({
  url: url,
  type: type,
  dataType: 'html',
  data: params,
  // Complete callback (responseText is used internally)
  complete: function (jqXHR, status, responseText) {
    // Store the response as specified by the jqXHR object
    responseText = jqXHR.responseText;
    // If successful, inject the HTML into all the matched elements
    if (jqXHR.isResolved()) {
      // Get the actual response in case
      // a dataFilter is present in ajaxSettings
      jqXHR.done(function (r) {
        responseText = r;
      });
      // See if a selector was specified
      self.html(
        selector
          ? // Create a dummy div to hold the results
            jQuery('<div>')
              // inject the contents of the document in, removing the scripts
              // to avoid any 'Permission Denied' errors in IE
              .append(responseText.replace(rscript, ''))

              // Locate the specified elements
              .find(selector)
          : // If not, just inject the full result
            responseText
      );
    }

    if (callback) {
      self.each(callback, [responseText, status, jqXHR]);
    }
  },
});

// These 3 lines code below is from the book but it might be mistaken.
// https://addyosmani.com/resources/essentialjsdesignpatterns/book/#facadepatternjquery

//   return this;
//   }
// </div>
```
