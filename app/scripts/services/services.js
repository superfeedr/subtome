'use strict';

angular.module('subtome')
.factory('services', function() {
  var services = {};
  var err = '';


  function count() {
    return Object.keys(services).length;
  }

  function uses(name) {
    return (services[name] || false) && true;
  }

  function load() {
    var servicesString;
    try {
      servicesString = localStorage.getItem('services');
    }
    catch(e) {
      console.error('There was an error, so we could not load the services from the localStorage. ', e);
      if(e.name === 'SecurityError' && e.code === 18) {
        err = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
      }
      else {
        err = 'We could not load your favorite subscriptions tools. ';
      }
    }
    if(servicesString) {
      try {
        services = angular.fromJson(servicesString);
      }
      catch(e) {
        console.error('Could not parse ' + servicesString);
        err = 'Warning: We could not load your favorite subscriptions tools. ';
      }
    }
  }


  function register(name, handler) {
    if(!services[name] || handler !== services[name]) {
      services[name] = {
        name: name,
        url: decodeURIComponent(handler),
        addedOn: Date.now()
      };
      save();
    }
  }

  function save() {
    localStorage.setItem('services', angular.toJson(services));
  }

  function forEach(iterator) {
    for(var name in services) {
      iterator(name, services[name]);
    }
  }

  function used() {
    var u = [];
    forEach(function(name, s) {
      s.name = name;
      u.push(s);
    });
    return u;
  }

  function removeService(name) {
    delete services[name];
    save();
  }

  function error() {
    return err;
  }

  load();
  return {
    error: error,
    load: load,
    removeService: removeService,
    used: used,
    forEach: forEach,
    save: save,
    register: register,
    count: count,
    uses: uses
  };
});

