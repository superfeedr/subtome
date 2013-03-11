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
    console.error('There was an error, so we could not load the services from the localStorage. Showing the defaults.', error);
    if(error.name === 'SecurityError' && error.code === 18) {
      this.error = 'A browser setting is preventing SubToMe from saving your favorite subscription tools. Open up Settings > Privacy. Then, make sure Accept cookies from sites is checked. Also, make sure Accept third-party is checked as well.';
    }
    else {
      this.error = 'We could not load your favorite subscriptions tools. We\'re showing you the default apps.';
    }
  }
  if(servicesString) {
    try {
      this.services = JSON.parse(servicesString);
    }
    catch(error) {
      console.error('Could not parse ' + servicesString);
      this.error = 'Warning: We could not load your favorite subscriptions tools. We\'re showing you the default apps.';
    }
  }
}

Services.prototype.forEachDefaultService = function forEachDefaultService (iterator) {
  iterator('Google Reader', {
    url: 'http://www.google.com/reader/view/feed/{feed}?source=subtome'
  });
  iterator('NewsBlur', {
    url: 'http://www.newsblur.com/?url={url}'
  });
  iterator('Bloglovin\'', {
    url: 'http://www.bloglovin.com/search/{url}'
  });
  iterator('Blogtrottr', {
    url: 'http://blogtrottr.com/?subscribe={feed}'
  });
}

Services.prototype.forEach = function forEachServices(iterator) {
  for(var name in this.services) {
    iterator(name, this.services[name]);
  }
}

Services.prototype.uses = function usesService(name) {
  return this.services[name] || false;
}

Services.prototype.setAsDefault = function setAsDefault(name, def) {
  for(var n in this.services) {
    delete this.services[n].default;
  }
  if(name) {
    this.services[name].default = def;
  }
  this.save();
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

module.exports = new Services();
