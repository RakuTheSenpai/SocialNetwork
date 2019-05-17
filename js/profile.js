'use strict';

angular.module('myApp.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'views/profile.html',
        });
    }])
    .controller('ProfileCtrl', ['$scope', function($scope) {
        
    }]);;