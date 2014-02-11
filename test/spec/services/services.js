'use strict';
describe('Service: Services', function () {
  var services;
  module(function ($provide) {
    $provide.value('$window', {});
  });
  beforeEach(function () {
    module('subtome');
    inject(function ($injector) {
      services = $injector.get('services');
    });
    localStorage.clear();
  });
  describe('count', function () {
    it('should return the number of services', function () {
      expect(services.count())
        .toBe(0);
      localStorage.setItem('services', '{"Digg Reader":{"url":"http://digg.com/reader/search/{url}","addedOn":1382040048973,"name":"Digg Reader","$$hashKey":"034"},"NewsBlur":{"url":"http://www.newsblur.com/?url={url}","addedOn":1382041446321,"name":"NewsBlur","$$hashKey":"00O"},"RSS feed":{"url":"/#/redirect?to={feed}","addedOn":1383736166326,"name":"RSS feed","$$hashKey":"00O"},"@updt_me":{"url":"https://twitter.com/intent/tweet?in_reply_to=369917839001387008&text=START {feed}","addedOn":1384371352730,"name":"@updt_me","$$hashKey":"00P"},"Feedly":{"url":"http://www.feedly.com/home#subscription/feed/{feed}","addedOn":1384965966622,"name":"Feedly","$$hashKey":"00Q"},"Player FM":{"url":"http://player.fm/series?url={feed}&referrer={url}&related_feeds={feeds}","addedOn":1386131222085,"name":"Player FM","$$hashKey":"016"},"go read":{"url":"http://www.goread.io/user/add-subscription?url={url}","addedOn":1386187569182,"name":"go read","$$hashKey":"00T"},"Kouio":{"url":"https://kouio.com/subscribe?url={url}","addedOn":1390590445756,"name":"Kouio","$$hashKey":"00W"},"Wordpress":{"url":"http://raeder.wordpress.com","addedOn":1392052986458,"name":"Wordpress","$$hashKey":"00V"}}');
      services.load();
      expect(services.count())
        .toBe(9);
    });
  });
  describe('uses', function () {
    it('should return false if there is no registered service with that name', function () {
      expect(services.uses('MyService'))
        .toBe(false);
    });
    it('should return true if there is a registered service with that name', function () {
      services.register('MyService', 'http://MyService.com/handler');
      expect(services.uses('MyService'))
        .toBe(true);
    });
  });
  describe('load', function () {
    it('should load the data from localStorage', function () {
      var mock = {
        'My First Service': {
          'url': 'http://myfirstservice.tld/handler',
          'addedOn': Date.now(),
          'name': 'My First Service'
        },
        'My Second Service': {
          'url': 'http://mysecondservice.tld/handler',
          'addedOn': Date.now(),
          'name': 'My Second Service'
        }
      };
      localStorage.setItem('services', JSON.stringify(mock));
      services.load();
      expect(services.count())
        .toBe(2);
      services.forEach(function (name, service) {
        expect(service.url)
          .toBe(mock[name].url);
        expect(service.name)
          .toBe(mock[name].name);
        expect(service.addedOn)
          .toBe(mock[name].addedOn);
      });
    });
    it('should set the error if the data could not be loaded from localStorage');
    it('should set the error if the data could not be parsed', function () {
      localStorage.setItem('services', 'notjson');
      services.load();
      expect(services.count())
        .toBe(0);
      expect(services.error())
        .toBe('Warning: We could not load your favorite subscriptions tools. ');
    });
  });
  describe('register', function () {
    it('should add the service to the list of used services', function () {
      expect(services.uses('My New Service'))
        .toBe(false);
      services.register('My New Service', 'http://my.new.service.tld/handler');
      expect(services.uses('My New Service'))
        .toBe(true);
    });
    it('should save the services to localStorage', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      var json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'].name)
        .toBe('My New Service');
      expect(json['My New Service'].url)
        .toBe('http://my.new.service.tld/handler');
      expect(json['My New Service'].addedOn)
        .toBeGreaterThan(Date.now() - 1000);
    });
    it('should resave services if the handler has been changed', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      var json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'].url)
        .toBe('http://my.new.service.tld/handler');
      services.register('My New Service', 'http://my.new.service.tld/new-handler');
      json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'].url)
        .toBe('http://my.new.service.tld/new-handler');
    });
    it('should not resave previously registered services if they have not been changed', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      var json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'].url)
        .toBe('http://my.new.service.tld/handler');
      services.register('My New Service', 'http://my.new.service.tld/new-handler');
      json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'].url)
        .toBe('http://my.new.service.tld/new-handler');
    });
  });
  describe('save', function () {
    it('should write the data as JSON to localStorage', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      var json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'].name)
        .toBe('My New Service');
      expect(json['My New Service'].url)
        .toBe('http://my.new.service.tld/handler');
      expect(json['My New Service'].addedOn)
        .toBeGreaterThan(Date.now() - 1000);
    });
  });
  describe('forEach', function () {
    it('should yield each registered services to the argument', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      services.register('My Other Service', 'http://my.other.service.tld/handler');
      expect(services.count())
        .toBe(2);
      var spy = jasmine.createSpy();
      services.forEach(spy);
      expect(spy)
        .toHaveBeenCalledWith('My New Service', {
          name: 'My New Service',
          url: 'http://my.new.service.tld/handler',
          addedOn: jasmine.any(Number)
        });
      expect(spy)
        .toHaveBeenCalledWith('My Other Service', {
          name: 'My Other Service',
          url: 'http://my.other.service.tld/handler',
          addedOn: jasmine.any(Number)
        });
    });
  });
  describe('used', function () {
    it('should return an array of used services', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      services.register('My Other Service', 'http://my.other.service.tld/handler');
      expect(services.used()
        .length)
        .toBe(2);
      expect(services.used()[0].name)
        .toBe('My New Service');
      expect(services.used()[0].url)
        .toBe('http://my.new.service.tld/handler');
      expect(services.used()[1].name)
        .toBe('My Other Service');
      expect(services.used()[1].url)
        .toBe('http://my.other.service.tld/handler');
    });
  });
  describe('removeService', function () {
    it('should remove the service from the list of used services', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      expect(services.uses('My New Service'))
        .toBe(true);
      services.removeService('My New Service');
      expect(services.uses('My New Service'))
        .toBe(false);
    });
    it('should save the services to localStorage', function () {
      services.register('My New Service', 'http://my.new.service.tld/handler');
      services.register('My Other Service', 'http://my.other.service.tld/handler');
      var json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'].name)
        .toBe('My New Service');
      expect(json['My New Service'].url)
        .toBe('http://my.new.service.tld/handler');
      expect(json['My New Service'].addedOn)
        .toBeGreaterThan(Date.now() - 1000);
      services.removeService('My New Service');
      json = JSON.parse(localStorage.getItem('services'));
      expect(json['My New Service'])
        .toBe(undefined);
    });
  });
});
