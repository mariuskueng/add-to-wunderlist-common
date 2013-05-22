(function (WL) {

  if (window !== window.top || /\.xml$/.test(window.location.pathname)) {

    return;
  }

  // modules can be imported individually for different extensions, but all will export onto window.WL
  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  var browser, storage, setter, getter, remover;

  if ('chrome' in window) {

    browser = 'chrome';
  }
  else if ('safari' in window) {

    browser = 'safari';
  }
  else if (/Firefox/.test(window.navigator.userAgent)) {

    browser = 'firefox';
  }

  WL.browser = browser;

  var storages = {

    'chrome': {

      'storage': ('chrome' in window && chrome.storage.local)
    },

    'safari': {

      'storage': ('localStorage' in window && window.localStorage)
    },

    'firefox': {

      'storage': ('localStorage' in window && window.localStorage)
    }
  };

  // set storage module
  storage = storages[browser].storage;

  var localStorageInterface = {

    'set': function (key, value, callback) {

      storage.setItem(key, value);
      callback();
    },

    'get': function (key, callback) {

      callback(storage.getItem(key));
    },

    'remove': function (key, callback) {

      storage.removeItem(key);
      callback();
    }
  };

  var interfaces = {

    'chrome': {

      'set': function (key, value, callback) {

        var data = {};
        data[key] = value;

        storage.set(data, callback);
      },

      'get': function (key, callback) {

        storage.get(key, function (result) {

          callback(result[key]);
        });
      },

      'remove': function (key, callback) {

        storage.remove(key, function () {

          callback(arguments);
        });
      }
    },

    'safari': localStorageInterface,

    'firefox': localStorageInterface
  };

  setter = function (key, value) {

    var deferred = new $.Deferred();

    interfaces[browser].set(key, value, function () {

      deferred.resolveWith(this, arguments);
    });

    return deferred.promise();
  };

  getter = function (key) {

    var deferred = new $.Deferred();

    interfaces[browser].get(key, function (value) {

      deferred.resolveWith(this, arguments);
    });

    return deferred.promise();
  };

  remover = function (key) {

    var deferred = new $.Deferred();

    interfaces[browser].remove(key, function () {

      deferred.resolveWith(this, arguments);
    });

    return deferred.promise();
  };

  // Export
  WL.storage = {

    'get': getter,
    'set': setter,
    'remove': remover
  };

})(window.WL);