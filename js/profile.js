'use strict';

angular.module('myApp.profile', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'views/profile.html',
        });
    }])
    .controller('ProfileCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.signOut = function () {
            if (userPool.getCurrentUser() != null) {
                userPool.getCurrentUser().signOut();
                window.location.reload("#!/login");
            }
        }
        $scope.done = false;
        $scope.user;
        $scope.edit = true;
        $scope.settings = "settings";
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var authToken;
        var file = '';
        var filename = '';
        FilePond.registerPlugin(
            FilePondPluginFileEncode,
            FilePondPluginFileValidateType,
            FilePondPluginImageExifOrientation,
            FilePondPluginImagePreview,
            FilePondPluginImageCrop,
            FilePondPluginImageResize,
            FilePondPluginImageTransform
        );

        FilePond.create(document.querySelector('input[type="file"]'),
            {
                //imagePreviewHeight: 360,
                imageCropAspectRatio: '1:1',
                imageResizeTargetWidth: 100,
                imageResizeTargetHeight: 100,
                stylePanelLayout: 'compact circle',
                styleLoadIndicatorPosition: 'center bottom',
                styleButtonRemoveItemPosition: 'center bottom'
            }
        );
        const pond = document.querySelector('.filepond--root');
        pond.addEventListener('FilePond:addfile', e => {
            file = e.detail.file.getFileEncodeBase64String();
            filename = e.detail.file.filename
        });
        pond.addEventListener('FilePond:removefile', e => {
            file = '';
        });
        pond.addEventListener('FilePond:error', e => {
            file = '';
        });
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
                        $scope.user = response.data.Items[0];
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
        $scope.change = function () {
            $scope.edit = ($scope.edit == true) ? false : true;
            $scope.settings = ($scope.settings == "settings") ? "check" : "settings";
            if ($scope.edit) {
                var req = {
                    method: 'POST',
                    url: _config.api.invokeUrl + '/updateusuariomema',
                    headers: {
                        Authorization: authToken
                    },
                    data: {
                        Email: $scope.user.Email,
                        Age: $scope.user.Age,
                        Username: $scope.user.Username,
                        Bio: $scope.user.Bio,
                        Pic: $scope.user.Pic,
                        MemesViewed: $scope.user.MemesViewed,
                        Tags: $scope.user.Tags
                    }
                };
                $http(req).then(function successCallback(response) {
                }, function errorCallback(response) {
                    console.error(response);
                });
                if (file != '') {
                    var req2 = {
                        method: 'POST',
                        url: _config.api.invokeUrl + '/updateprofilepic',
                        headers: {
                            Authorization: authToken
                        },
                        data: {
                            Usuario: $scope.user.Username,
                            File: file,
                        }
                    };
                    $http(req2).then(function successCallback(response) {
                        window.location.reload('#!/profile');
                    }, function errorCallback(response) {
                        window.location.reload('#!/profile');
                    });
                }
            }
        }
        $scope.signOut = function () {
            if (userPool.getCurrentUser() != null) {
                userPool.getCurrentUser().signOut();
                window.location.reload("#!/login");
            }
        }
    }]);;