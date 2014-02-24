'use strict';

describe('Directive serviceButton', function () {

  beforeEach(angular.mock.module('subtome'));

  it('should setup the button with the right scope information');

  describe('open', function() {

    beforeEach(function() {
      localStorage.clear();
    });

    afterEach(function() {
      localStorage.clear();
    });

    it('should send a google analytics event');

    it('should alert the user if the redirect is not safe');

    it('should replace the {url} in the redirect url with the resource');

    it('should replace the {feed} in the redirect url with the first feed if there are several');

    it('should replace the {feed} in the redirect url with the only feed if there is just one');

    it('should replace the {feeds} in the redirect url with the only feed with all feeds if there are multiple');

    it('should add a subscription to the list of subscriptions');

    it('should post a message to the parent');

    it('should open the redirect in a new tab');
  });
});




