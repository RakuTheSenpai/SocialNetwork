'use strict';

angular.module('myApp.info', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/info', {
            templateUrl: 'views/inforegister.html',
        });
    }])
    .controller('InfoCtrl', ['$scope', '$http', function ($scope, $http) {
        var authToken;
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
                        window.location.href = "#!/swipe";
                    }
                }, function errorCallback(response) {
                    console.error(response);
                });
            } else {
                window.location.href = '#!/login';
            }
        }).catch(function handleTokenError(error) {
            console.log(error);
        });
        $scope.confirm = function () {
            window.location.href = '#!/login';
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/putusuariomema',
                headers: {
                    Authorization: authToken
                },
                data: {
                    Username: $scope.username,
                    Age: $scope.age,
                }
            };
            $http(req).then(function successCallback(response) {
                Swal.fire({
                    title: 'Thank You!',
                    text: 'You have completed your registration.',
                    type: 'success',
                    confirmButtonColor: '#f08080'
                });
                //window.location.href = '#!/swipe';
            }, function errorCallback(response) {
                console.error(response);
            });
        }
    }]);;