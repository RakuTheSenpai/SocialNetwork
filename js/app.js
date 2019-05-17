'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.login',
    'myApp.chat',
    'myApp.register',
    'myApp.profile',
    'myApp.swipe',
    'myApp.upload'
])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/profile' });
    }])
    .controller('myAppCtrl', ['$scope', function ($scope) {
        $scope.change = function (location) {
            window.location.href = location;
        }
    }]);