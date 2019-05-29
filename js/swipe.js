'use strict';

angular.module('myApp.swipe', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/swipe', {
            templateUrl: 'views/swipe.html',
        });
    }])
    .controller('SwipeCtrl', ['$scope', '$http', function ($scope, $http) {
        var user = "";
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        $scope.memes = [];

        var authToken;
        var index = 0;
        var bio;
        var age;
        var tags;
        var pic;
        var viewed;
        var username;
        window.authToken.then(function setAuthToken(token) {
            if (token) {
                authToken = token;
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
                        user = response.data.Items[0];
                        username = user.Username;
                        viewed = user.MemesViewed;
                        age = user.Age;
                        tags = user.Tags;
                        bio = user.Bio;
                        pic = user.Pic;

                        var req2 = {
                            method: 'POST',
                            url: _config.api.invokeUrl + '/getmemes',
                            headers: {
                                Authorization: authToken
                            },
                            data: {

                            }
                        };
                        $http(req2).then(function successCallback(response) {
                            $scope.memes = response.data.Items;
                            $scope.currentimage = $scope.memes[0].Filename;
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
            } else {
                window.location.href = '#!/login';
            }
        }).catch(function handleTokenError(error) {
            Swal.fire(error);
            window.location.href = '#!/login';
        });

        $scope.next = function (opinion) {
            index++;
            if (index < $scope.memes.length) {
                $scope.currentimage = $scope.memes[index].Filename;
            }
            viewed += 1;
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/updateusuariomema',
                headers: {
                    Authorization: authToken
                },
                data: {
                    Age: age,
                    Bio: bio,
                    MemesViewed: viewed,
                    Username: username,
                    Tags: tags,
                    Pic: pic,
                }
            };
            $http(req).then(function successCallback(response) {
            }, function errorCallback(response) {
                console.error(response);
            });
        }
    }]);;