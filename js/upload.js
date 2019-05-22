'use strict';

angular.module('myApp.upload', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'views/upload.html',
        });
    }])
    .controller('UploadCtrl', ['$scope', function ($scope) {
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
            var file = e.detail.file.file;
            var filename = e.detail.file.filename;
            
        });

    }]);

