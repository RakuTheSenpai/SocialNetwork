'use strict';

angular.module('myApp.upload', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'views/upload.html',
        });
    }])
    .controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
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
                imagePreviewHeight: 320,
                imageCropAspectRatio: '1:1',
                imageResizeTargetWidth: 360,
                imageResizeTargetHeight: 360,
                styleLoadIndicatorPosition: 'center bottom',
                styleButtonRemoveItemPosition: 'center bottom'
            }
        );
        const pond = document.querySelector('.filepond--root');
        pond.addEventListener('FilePond:addfile', e => {
            console.log(authToken);
            var file = e.detail.file.file;
            var filename = e.detail.file.filename;
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
                console.log('Success');
                var user = response.data.Items;
                
            }, function errorCallback(response) {
                console.error('Error');
                console.error(response);
            });

        });
    }]);

