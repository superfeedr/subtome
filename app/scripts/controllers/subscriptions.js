'use strict';

angular.module('subtome')
.controller('SubscriptionsController', ['$scope', 'subscriptions', function SubscriptionsController($scope, subscriptions) {
  $scope.subscriptions = subscriptions.all();
}]);
