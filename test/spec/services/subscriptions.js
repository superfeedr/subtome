'use strict';
describe('Service: Subscriptions', function () {
  var subscriptions;
  module(function ($provide) {
    $provide.value('$window', {});
  });
  beforeEach(function () {
    module('subtome');
    inject(function ($injector) {
      subscriptions = $injector.get('subscriptions');
    });
    localStorage.clear();
  });

  afterEach(function () {
    localStorage.clear();
  });

  describe('load', function () {
    it('should load the data from localStorage', function () {
      var mock = {'http://blog.superfeedr.com/':[{'feeds':['http://blog.superfeedr.com/atom.xml', 'https://github.com/julien51.atom'],'service':'Rivered'},{'feeds':['http://blog.superfeedr.com/atom.xml'],'service':'Feedbin'},{'feeds':['http://blog.superfeedr.com/atom.xml'],'service':'Feedbin'}],'http://continuations.com/':[{'feeds':['http://continuations.com/rss'],'service':'RSS feed'}],'http://jobetudiant.net/blog/':[{'feeds':['http://feeds.feedburner.com/jobs-etudiants'],'service':'RSS feed'}],'http://adactio.com/journal/6672/':[{'feeds':['http://adactio.com/journal/rss','http://adactio.com/links/rss','http://adactio.com/articles/rss','http://adactio.com/rss/'],'service':'RSS feed'}]};
      localStorage.setItem('subscriptions', JSON.stringify(mock));
      subscriptions.load();
      var all = subscriptions.all();
      expect(all.length).toBe(4);
      expect(all[0][0]).toBe('http://blog.superfeedr.com/');
      expect(all[0][1][0].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(all[0][1][0].feeds[1]).toBe('https://github.com/julien51.atom');
      expect(all[0][1][0].service).toBe('Rivered');

      expect(all[0][1][1].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(all[0][1][1].service).toBe('Feedbin');

    });
    it('should set the error if the data could not be loaded from localStorage');
    it('should set the error if the data could not be parsed', function () {
      localStorage.setItem('subscriptions', 'notjson');
      subscriptions.load();
      expect(subscriptions.all().length).toBe(0);
      expect(subscriptions.error()).toBe('We could not load your subscriptions. ');
    });
  });

  describe('save', function () {
    it('should write the data as JSON to localStorage', function () {
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['http://blog.superfeedr.com/atom.xml'], service: 'My Service'});
      var json = JSON.parse(localStorage.getItem('subscriptions'));
      expect(json['http://blog.superfeedr.com/'][0].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(json['http://blog.superfeedr.com/'][0].service).toBe('My Service');
    });
  });

  describe('add', function () {
    it('should add a new subscription to an existing subscriptions for a url if it already exists', function () {
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['http://blog.superfeedr.com/atom.xml'], service: 'My Service'});
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['https://github.com/julien51.atom'], service: 'My Other Service'});
      expect(subscriptions.data()['http://blog.superfeedr.com/'][1].feeds[0]).toBe('https://github.com/julien51.atom');
      expect(subscriptions.data()['http://blog.superfeedr.com/'][1].service).toBe('My Other Service');
      expect(subscriptions.data()['http://blog.superfeedr.com/'][0].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(subscriptions.data()['http://blog.superfeedr.com/'][0].service).toBe('My Service');
    });
    it('should add a brand new subscription', function () {
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['http://blog.superfeedr.com/atom.xml'], service: 'My Service'});
      expect(subscriptions.data()['http://blog.superfeedr.com/'][0].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(subscriptions.data()['http://blog.superfeedr.com/'][0].service).toBe('My Service');
    });
  });

  describe('list', function () {
    it('should return the right data structure', function () {
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['http://blog.superfeedr.com/atom.xml', 'https://github.com/julien51.atom'], service: 'My Service'});
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['https://github.com/julien51.atom'], service: 'My Other Service'});
      subscriptions.add('http://push-pub.appspot.com/', {feeds: ['http://push-pub.appspot.com/feed'], service: 'RSS Feed Export'});
      var list = subscriptions.list();
      expect(list[0][0]).toBe('http://blog.superfeedr.com/');
      expect(list[0][1][0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(list[0][1][1]).toBe('https://github.com/julien51.atom');
      expect(list[1][0]).toBe('http://blog.superfeedr.com/');
      expect(list[1][1][0]).toBe('https://github.com/julien51.atom');
      expect(list[2][0]).toBe('http://push-pub.appspot.com/');
      expect(list[2][1][0]).toBe('http://push-pub.appspot.com/feed');
    });
  });

  describe('all', function () {
    it('should return the right data structure', function () {
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['http://blog.superfeedr.com/atom.xml', 'https://github.com/julien51.atom'], service: 'My Service'});
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['https://github.com/julien51.atom'], service: 'My Other Service'});
      subscriptions.add('http://push-pub.appspot.com/', {feeds: ['http://push-pub.appspot.com/feed'], service: 'RSS Feed Export'});
      var all = subscriptions.all();
      expect(all[0][0]).toBe('http://blog.superfeedr.com/');
      expect(all[0][1][0].feeds[0]).toBe('http://blog.superfeedr.com/atom.xml');
      expect(all[0][1][0].feeds[1]).toBe('https://github.com/julien51.atom');
      expect(all[0][1][0].service).toBe('My Service');
      expect(all[0][1][1].feeds[0]).toBe('https://github.com/julien51.atom');
      expect(all[0][1][1].service).toBe('My Other Service');
      expect(all[1][0]).toBe('http://push-pub.appspot.com/');
      expect(all[1][1][0].feeds[0]).toBe('http://push-pub.appspot.com/feed');
      expect(all[1][1][0].service).toBe('RSS Feed Export');
    });
  });

  describe('opml', function () {
    it('should return the right opml format', function () {
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['http://blog.superfeedr.com/atom.xml', 'https://github.com/julien51.atom'], service: 'My Service'});
      subscriptions.add('http://blog.superfeedr.com/', {feeds: ['https://github.com/julien51.atom'], service: 'My Other Service'});
      subscriptions.add('http://push-pub.appspot.com/', {feeds: ['http://push-pub.appspot.com/feed'], service: 'RSS Feed Export'});
      var opml = subscriptions.opml();
      expect(opml).toBe('<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><head><title>Your Subscriptions</title></head><body><outline xmlUrl="http://blog.superfeedr.com/atom.xml" htmlUrl="http://blog.superfeedr.com/" /><outline xmlUrl="https://github.com/julien51.atom" htmlUrl="http://blog.superfeedr.com/" /><outline xmlUrl="http://push-pub.appspot.com/feed" htmlUrl="http://push-pub.appspot.com/" /></body></opml>');
    });
  });

});
