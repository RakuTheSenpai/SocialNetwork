'use strict';

angular.module('myApp.upload', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'views/upload.html',
        });
    }])
    .controller('UploadCtrl', ['$scope', function($scope) {
        
    }]);;
FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);

FilePond.create(document.querySelector('input'),
{
imagePreviewHeight: 320,
imageCropAspectRatio: '1:1',
imageResizeTargetWidth: 360,
imageResizeTargetHeight: 360,
styleLoadIndicatorPosition: 'center bottom',
styleButtonRemoveItemPosition: 'center bottom'
}
);
//   $('.chips').chips({
//     placeholder: 'Enter a tag',
//     secondaryPlaceholder: '+Tag',
//     minLength: 1
//   });


