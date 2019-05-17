'use strict';

angular.module('myApp.chat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: 'views/chat.html',
        });
    }])
    .controller('ChatCtrl', ['$scope', function($scope) {
        
    }]);;