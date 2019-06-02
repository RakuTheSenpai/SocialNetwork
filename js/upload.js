'use strict';

angular.module('myApp.upload', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'views/upload.html',
        });
    }])
    .controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
        $scope.up = true;
        var user = "";
        var file = "";
        var filename = "";
        var bio;
        var age;
        var tags;
        var pic;
        var viewed;
        var username;
        var poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        var userPool;
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

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
                        user = response.data.Items[0];
                        username = user.Username;
                        viewed = user.MemesViewed;
                        age = user.Age;
                        tags = user.Tags;
                        bio = user.Bio;
                        pic = user.Pic;
                        var viewed = response.data.Items[0].MemesViewed;
                        if (viewed < 10) {
                            Swal.fire({
                                title: 'Wait Up!',
                                text: 'You need to like/dislike 10 Memes first for our algorithm.',
                                type: 'success',
                                confirmButtonColor: '#f08080'
                            });
                            window.location.href = "#!/swipe";
                        }
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
                // imageResizeTargetWidth: 360,
                // imageResizeTargetHeight: 360,
                styleLoadIndicatorPosition: 'center bottom',
                styleButtonRemoveItemPosition: 'center bottom'
            }
        );
        const pond = document.querySelector('.filepond--root');
        pond.addEventListener('FilePond:addfile', e => {
            file = e.detail.file.getFileEncodeBase64String();
            filename = e.detail.file.filename.split('.').slice(0, -1).join('.');
            $scope.up = false;
            $scope.$apply();
        });
        pond.addEventListener('FilePond:removefile', e => {
            $scope.up = true;
            $scope.$apply();
        });
        pond.addEventListener('FilePond:error', e => {
            $scope.up = true;
            $scope.$apply();
        });
        $scope.upload = function () {
            $scope.up = true;
            var tagged = [];
            var tag1 = document.getElementById("tag1").value;
            var tag2 = document.getElementById("tag2").value;
            var tag3 = document.getElementById("tag3").value;
            tag1 = (tag1 != '') ? tag1 : "NoTag";
            tag2 = (tag2 != '') ? tag2 : "NoTag";
            tag3 = (tag3 != '') ? tag3 : "NoTag";
            tagged.push(tag1, tag2, tag3);
            //DynamoDB and S3
            var timestamp = Math.floor(Date.now() / 1000);
            var req2 = {
                method: 'POST',
                url: _config.api.invokeUrl + '/putmeme',
                headers: {
                    Authorization: authToken
                },

                data: {
                    Usuario: username,
                    Timestamp: timestamp,
                    Filename: filename,
                    File: file,
                    Tags: tagged
                }
            };
            $http(req2).then(function successCallback(response) {
                Swal.fire({
                    title: 'Image Uploaded!',
                    text: 'Nice job, Gamer.',
                    type: 'success',
                    confirmButtonColor: '#f08080'
                });
                $scope.up = false;
            }, function errorCallback(response) {
                console.error(response);
            });
        }
    }]);

