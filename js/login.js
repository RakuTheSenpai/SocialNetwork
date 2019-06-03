'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
        });
    }])
    .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var authToken;
        var matches;
        var forDeletion = [];
        window.authToken.then(function setAuthToken(token) {
            if (token) {
                authToken = token;
                window.location.href = '#!/swipe';
                var req = {
                    method: 'POST',
                    url: _config.api.invokeUrl + '/getusuariomema',
                    headers: {
                        Authorization: authToken
                    },
                    data: {

                    }
                };
                $http(req).then(function successCallback(response) {
                    if (response.data.Items.length > 0) {
                        var req2 = {
                            method: 'POST',
                            url: _config.api.invokeUrl + '/getpending',
                            headers: {
                                Authorization: authToken
                            },
                            data: {

                            }
                        };
                        $http(req2).then(function successCallback(response) {
                            var count = response.data.Count;
                            if (count > 0) {
                                matches = response.data.Items;
                                var pendingMatches = [];
                                matches.forEach(match => {
                                    var param = {
                                        DeleteRequest: {
                                            Key: {
                                                Usuario: match.Usuario,
                                                Match: match.Match,
                                            }
                                        }
                                    };
                                    pendingMatches.push(param);
                                });
                                var req3 = {
                                    method: 'POST',
                                    url: _config.api.invokeUrl + '/deletepending',
                                    headers: {
                                        Authorization: authToken
                                    },
                                    data: {
                                        Matches: pendingMatches,
                                    }
                                };
                                $http(req3).then(function successCallback(response) {
                                    Swal.fire({
                                        type: 'success',
                                        title: 'Good News!',
                                        text: "You have " + count + " new matches!",
                                        confirmButtonColor: '#f08080',
                                        confirmButtonText: 'Chat with them!'
                                    }).then((result) => {
                                        if (result.value) {
                                            window.location.href = "#!/chat";
                                        }
                                    })
                                }, function errorCallback(response) {
                                    console.error(response);
                                });
                            }
                        }, function errorCallback(response) {
                            console.error(response);
                        });
                    }
                    else {
                        window.location.href = "#!/info";
                    }

                }, function errorCallback(response) {
                    console.error(response);
                });
            }
        }).catch(function handleTokenError(error) {
            Swal.fire({
                type: 'error',
                title: 'Something went wrong!',
                text: error,
                confirmButtonColor: '#f08080'
            });
        });
        $scope.handleSignin = function () {
            var email = $scope.email;
            var password = $scope.pswd;
            event.preventDefault();
            signin(email, password,
                function signinSuccess() {
                    console.log('Successfully Logged In');
                    window.location.reload('#!/login');
                },
                function signinError(err) {
                    Swal.fire({
                        type: 'error',
                        title: 'Something went wrong!',
                        text: err,
                        confirmButtonColor: '#f08080'
                    });
                    if (err == 'UserNotConfirmedException: User is not confirmed.') {
                        window.location.href = '#!/verify';
                    }
                }
            );
        }

        function signin(email, password, onSuccess, onFailure) {
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: email,
                Password: password
            });

            var cognitoUser = createCognitoUser(email);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: onSuccess,
                onFailure: onFailure
            });

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

        function createCognitoUser(email) {
            return new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });
        }
    }]);;