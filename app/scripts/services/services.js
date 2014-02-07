'use strict';

angular.module('subtome')
.factory('services', function() {
  var services = {};
  var error;


  function count() {
    var count = 0;
    for(var name in services) {
      count += 1;
    }
    return count;
  }

  function uses(name) {
    return (services[name] || false) && true;
  }

  function load() {
    try {
      var servicesString = localStorage.getItem('services');
    }
    catch(error) {
      console.error('There was an error, so we could not load the services from the localStorage. ', error);
      if(error.name === 'SecurityError' && error.code === 18) {
        error = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
      }
      else {
        error = 'We could not load your favorite subscriptions tools. ';
      }
    }
    if(servicesString) {
      try {
        services = angular.fromJson(servicesString);
      }
      catch(error) {
        console.error('Could not parse ' + servicesString);
        error = 'Warning: We could not load your favorite subscriptions tools. ';
      }
    }
  }


  function register(name, handler) {
    if(!services[name] || handler !== services[name]) {
      services[name] = {
        url: decodeURIComponent(handler),
        addedOn: Date.now()
      }
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
    var used = [];
    forEach(function(name, s) {
      s.name = name;
      used.push(s);
    });
    return used;
  }

  function removeService(name) {
    delete services[name];
    save();
  }

  load();
  return {
    load: load,
    removeService: removeService,
    used: used,
    forEach: forEach,
    save: save,
    register: register,
    count: count,
    uses: uses
  }
});

