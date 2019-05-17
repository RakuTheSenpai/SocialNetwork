'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
        });
    }])
    .controller('LoginCtrl', ['$scope', function($scope) {
        
    }]);;