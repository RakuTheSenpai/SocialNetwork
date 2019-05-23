'use strict';

angular.module('myApp.info', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/info', {
            templateUrl: 'views/inforegister.html',
        });
    }])
    .controller('InfoCtrl', ['$scope', function($scope) {
        
    }]);;