var Services = function Services() {
  this.services = {};
  this.error = null;
  this.load();
}

Services.prototype.load = function loadServices() {
  try {
    var servicesString = localStorage.getItem('services');
  }
  catch(error) {
    console.error('There was an error, so we could not load the services from the localStorage. ', error);
    if(error.name === 'SecurityError' && error.code === 18) {
      this.error = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
    }
    else {
      this.error = 'We could not load your favorite subscriptions tools. ';
    }
  }
  if(servicesString) {
    try {
      this.services = JSON.parse(servicesString);
    }
    catch(error) {
      console.error('Could not parse ' + servicesString);
      this.error = 'Warning: We could not load your favorite subscriptions tools. ';
    }
  }
}

Services.prototype.count = function countServices() {
  var count = 0;
  for(var name in this.services) {
    count += 1;
  }
  return count;
}

Services.prototype.forEach = function forEachServices(iterator) {
  for(var name in this.services) {
    iterator(name, this.services[name]);
  }
}

Services.prototype.used = function usedServices() {
  var used = [];
  this.forEach(function(name, s) {
    s.name = name;
    used.push(s);
  });
  return used;
}

Services.prototype.uses = function usesService(name) {
  return this.services[name] || false;
}

Services.prototype.save = function saveServices() {
  localStorage.setItem('services', JSON.stringify(this.services));
}

Services.prototype.removeService = function removeService(name) {
  delete this.services[name];
  this.save();
}

Services.prototype.register = function registerService(name, handler) {
  if(!this.services[name]) {
    this.services[name] = {
      url: handler,
      addedOn: Date.now()
    }
    this.save();
  }
}
