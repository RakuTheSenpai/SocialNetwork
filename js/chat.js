'use strict';
// require(["underscore"])
angular.module('myApp.chat', ['ngRoute', "pubnub.angular.service"])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: 'views/chat.html',
        });
    }])
    .controller('ChatCtrl', ['$scope', '$http', 'Pubnub', function ($scope, $http, Pubnub) {
        $scope.currentContact = "";
        // Listening to the callbacks
        $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function (ngEvent, m) {
            $scope.$apply(function () {
                $scope.currentMessages.push(m);
            });
        });
        $scope.sendMessage = function () {
            // Don't send an empty message 
            if (!$scope.messageContent || $scope.messageContent === '') {
                return;
            }
            Pubnub.publish({
                channel: $scope.channel,
                message: {
                    content: $scope.messageContent,
                    sender_uuid: $scope.user,
                    date: new Date()
                },
                callback: function (m) {
                    console.log("El siguiente mensaje se publico a " + $scope.channel);
                    console.log(m);
                }
            });
            // Reset the messageContent input
            $scope.messageContent = '';
        }

        $scope.changeContact = function (contact) {
            $scope.currentContact = contact;
            console.log($scope.currentContact);
            if ($scope.user > contact) {
                $scope.channel = $scope.user + "|" + contact;
            } else {
                $scope.channel = contact + "|" + $scope.user;
            }
            Pubnub.subscribe({
                channel: $scope.channel,
                triggerEvents: ['callback']
            });
            Pubnub.history({
                channel: $scope.channel,
                callback: function (m) {
                    console.log(m);
                    $scope.currentMessages.length = 0;
                    angular.extend($scope.currentMessages, m[0]);
                },
                count: 20
            });
        }

        $scope.initChat = function () {
            Pubnub.init({
                publish_key: 'pub-c-50877502-ae22-45dc-a606-d8f589fa76db',
                subscribe_key: 'sub-c-157f2f30-7c0e-11e9-a950-f249fab64e16',
                uuid: $scope.user
            });
            //$scope.changeContact($scope.contacts[0].Username);
        }


        $scope.channel = "";
        $scope.contacts = [];
        $scope.currentMessages = [];
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
                        $scope.user = response.data.Items[0].Username;
                        console.log("User is " + $scope.user);
                        req = {
                            method: 'POST',
                            url: _config.api.invokeUrl + '/getmatches',
                            headers: {
                                Authorization: authToken
                            },
                            data: {}
                        };
                        $http(req).then(function successCallback(response) {
                            response.data.Items.forEach(element => {
                                var chan = $scope.user + "|" + element.Datos.Username;
                                $scope.contacts.push(element.Datos);
                            });
                            $scope.initChat();
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

    }]);
