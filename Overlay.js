(function (WL) {

  if (window.top !== window.top || /\.xml$/.test(window.location.pathname)) {

    return;
  }

  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  var overlayId = 'wunderlist_overlay';

  function showOverlay (postData) {

    var existing = document.getElementById(overlayId);

    if (!existing) {

      var frame = document.createElement('iframe');

      frame.allowtransparency = 'true';
      frame.scrolling = 'no';
      frame.id = overlayId;
      frame.name = overlayId;
      frame.style.cssText = WL.buildCss();
      frame.src = WL.buildUrl(postData);

      frame.onload = function () {

        frame.style.opacity = 1;

        setTimeout(function () {

          frame.style.cssText = WL.buildCss({

            'opacity': 1,
            'transitionSpeed': 50
          });
        }, 0);
      };

      document.body.appendChild(frame);

      // only listen for events when iframe is present
      window.addEventListener('message', handleMessage, false);
    }
  }

  var handleMessage = function handleMessage (ev) {

    // split message into useful bits
    // message should come in the format 'event:data'
    var parts = ev.data.split(':');
    var eventName = parts[0];
    var eventData = parts[1];
    var frame = $('#' + overlayId)[0];

    // handle messages sent from iframe
    if (eventName === 'close_wunderlist') {

      frame.style.opacity = 0;

      setTimeout(function () {

        frame.src = 'about:blank';
        frame.onload = function () {

          $('body').css({

            'overflow': ''
          });

          // cleanup event
          window.removeEventListener('message', handleMessage, false);
          frame.parentNode.removeChild(frame);
          frame = null;
        };
      }, 500);
    }
    else if (eventName === 'userAuthorized') {

      // store user token in extension's storage for use on reopen
      var token = eventData;
      WL.storage.set('authToken', token);
    }
    else if (eventName === 'webappReady') {

      // send any stored auth token to web app
      WL.storage.get('authToken').done(function (value) {

        if (value) {

          value = 'token:' + value;
          frame.contentWindow.postMessage(value, '*');
        }
      });
    }
    else if (eventName === 'logout') {

      WL.storage.remove('authToken');
    }
  };

  // exports
  WL.showOverlay = showOverlay;
})(window.WL);