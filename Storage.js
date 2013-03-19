(function (WL) {

  if (window.top !== window.top) {

    return;
  }

  // modules can be imported individually for different extensions, but all will export onto window.WL
  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  var browser, storage, setter, getter;
  if ('chrome' in window) {

    browser = 'chrome';
  }
  else if ('safari' in window) {

    browser = 'safari';
  }
  else if ('require' in window) {

    browser = 'firefox';
  }

  var storages = {

    'chrome': {

      'storage': ('chrome' in window && chrome.storage.local)
    },

    'safari': {

      'storage': ('localStorage' in window && window.localStorage)
    },

    'firefox': {

      'storage': ('require' in window && require('simple-storage'))
    }
  };

  // set storage module
  storage = storages[browser].storage;

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
      }
    },

    'safari': {

      'set': function (key, value, callback) {

        storage.setItem(key, value);
        callback();
      },

      'get': function (key, callback) {

        callback(storage.getItem(key));
      }
    },

    'firefox': {

      'set': function (key, value, callback) {

        storage.storage[key] = value;
        callback();
      },

      'get': function (key, callback) {

        callback(storage.storage[key]);
      }
    }
  };

  setter = function (key, value) {

    var deferred = new $.Deferred();

    interfaces[browser].set(key, value, function () {

      console.log('interfaces[browser].set', arguments);
      // console.log('error', chrome.runtime.lastError);
      deferred.resolveWith(this, arguments);
    });

    return deferred.promise();
  };

  getter = function (key) {

    var deferred = new $.Deferred();

    interfaces[browser].get(key, function (value) {

      console.log('interfaces[browser].get', arguments);
      // console.log('error', chrome.runtime.lastError);
      deferred.resolveWith(this, arguments);
    });

    return deferred.promise();
  };

  // Export
  WL.storage = {

    'get': getter,
    'set': setter
  };

  // Test test
  WL.storage.set("test", "test value").done(function () {

    console.log('WL.storage.set.done', arguments);

    WL.storage.get("test").done(function (value) {

      console.log("WL.storage.get.done", arguments);
    });
  });

})(window.WL);