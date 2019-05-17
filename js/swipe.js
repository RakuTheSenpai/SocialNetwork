'use strict';

angular.module('myApp.swipe', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/swipe', {
            templateUrl: 'views/swipe.html',
        });
    }])
    .controller('SwipeCtrl', ['$scope', function($scope) {
        
    }]);;