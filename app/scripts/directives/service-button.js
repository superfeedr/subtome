'use strict';

angular.module('subtome')
.directive('serviceButton', ['$window', 'services', 'subscriptions', 'safeUrl', function($window, services, subscriptions, safeUrl) {
  return {
    restrict: 'E',
    scope: {
      service: '='
    },
    templateUrl: '/views/service-button.html',
    replace:true,
    link: function(scope) {

      scope.service.used = services.uses(scope.service.name);

      scope.open = function() {
        var url = scope.service.url;
        if(!safeUrl(url)) {
          return $window.alert('It looks like this redirect is not safe. Please remove that service from your favorites.');
        }

        var redirect = decodeURIComponent(url).replace('{url}', encodeURIComponent(scope.$parent.resource));
        if(redirect.match(/\{feed\}/)) {
          if(scope.$parent.feeds[0]) {
            redirect = redirect.replace('{feed}', encodeURIComponent(scope.$parent.feeds[0]));
          }
          else {
            redirect = redirect.replace('{feed}', encodeURIComponent(scope.$parent.resource));
          }
        }
        if(redirect.match(/\{feeds\}/)) {
          redirect = redirect.replace('{feeds}', scope.$parent.feeds.join(','));
        }
        subscriptions.add(scope.$parent.resource, {feeds: scope.$parent.feeds, service: scope.service.name});
        var d = document.createElement('a');
        d.href = scope.$parent.resource;
        var s = document.createElement('a');
        s.href = url;
        $window.parent.postMessage({subscription: {
          feeds: scope.$parent.feeds,
          resource: scope.$parent.resource,
          app: {
            name: scope.service.name,
            url: s.protocol + '//' + s.host
          }
        }}, d.protocol + '//' + d.host);
        $window.open(redirect);
      };
    }
  };
}]);


