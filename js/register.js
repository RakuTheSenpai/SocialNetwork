'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'views/register.html',
        });
    }])
    .controller('RegisterCtrl', ['$scope', function($scope) {
        
    }]);;