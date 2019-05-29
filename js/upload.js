'use strict';

angular.module('myApp.upload', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'views/upload.html',
        });
    }])
    .controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.up = false;
        var user = "";
        var file = "";
        var filename = "";
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
                        user = response.data.Items[0].Username;
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
            filename = e.detail.file.filename;
            $scope.file_up = false;
        });
        pond.addEventListener('FilePond:removefile', e => {
            $scope.file_up = true;
        });
        pond.addEventListener('FilePond:error', e => {
            $scope.file_up = true;
        });
        $scope.upload = function () {
            $scope.up = true;
            //DynamoDB and S3
            var timestamp = Math.floor(Date.now() / 1000);
            var req2 = {
                method: 'POST',
                url: _config.api.invokeUrl + '/putmeme',
                headers: {
                    Authorization: authToken
                },
                data: {
                    Usuario: user,
                    Timestamp: timestamp,
                    Filename: filename,
                    File: file,
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
  $(document).ready(function(){
    $('select').formSelect();
  });
        
        
    }]);
 
      
