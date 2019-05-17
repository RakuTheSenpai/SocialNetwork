'use strict';

angular.module('myApp.upload', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'views/upload.html',
        });
    }])
    .controller('UploadCtrl', ['$scope', function($scope) {
        
    }]);;