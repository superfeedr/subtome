var Services = function Services() {
  this.services = {};
  this.load();
}

Services.prototype.load = function loadServices() {
  var servicesString = localStorage.getItem('services');
  if(servicesString) {
    try {
      this.services = JSON.parse(servicesString);
    }
    catch(error) {
      console.error('Could not parse ' + servicesString);
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
