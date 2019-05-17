'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.login',
    'myApp.chat',
    'myApp.register',
    'myApp.profile',
    'myApp.swipe',
    'myApp.upload',
    'myApp.verify'
])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/login' });
    }])
    .controller('myAppCtrl', ['$scope', function ($scope) {
        $scope.change = function (location) {
            window.location.href = location;
        }
        if (!(_config.cognito.userPoolId &&
            _config.cognito.userPoolClientId &&
            _config.cognito.region)) {
            Swal.fire({
                type: 'error',
                title: 'Something went wrong!',
                text: 'Error in config.js file, not configured.'
            })
            return;
        }
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };

        var userPool;

        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        if (typeof AWSCognito !== 'undefined') {
            AWSCognito.config.region = _config.cognito.region;
        }

        window.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
            var cognitoUser = userPool.getCurrentUser();

            if (cognitoUser) {
                cognitoUser.getSession(function sessionCallback(err, session) {
                    if (err) {
                        reject(err);
                    } else if (!session.isValid()) {
                        resolve(null);
                    } else {
                        resolve(session.getIdToken().getJwtToken());
                    }
                });
            } else {
                resolve(null);
            }
        });
        $scope.signOut = function () {
            if (userPool.getCurrentUser() != null) {
                userPool.getCurrentUser().signOut();
                window.location.reload("#!/login");
            }
        }
    }]);