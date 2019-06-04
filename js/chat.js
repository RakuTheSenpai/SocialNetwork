'use strict';
angular.module('myApp.chat', ['ngRoute', "pubnub.angular.service"])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: 'views/chat.html',
        });
    }])
    .controller('ChatCtrl', ['$scope', '$http', 'Pubnub', function ($scope, $http, Pubnub) {
        $scope.currentContact = "";
        $scope.userEmail = "";
        $scope.matchEmail = "";

        $scope.sendMessage = function () {
            // Don't send an empty message 
            if (!$scope.messageContent || $scope.messageContent === '') {
                return;
            }
            var date = new Date();
            var month = date.getMonth();
            var day = date.getDate();
            var year = date.getFullYear();
            var hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
            var period = date.getHours() >= 12 ? 'PM' : 'AM';
            var minute = date.getMinutes();
            var sendDate = month + "/" + day + "/" + year + " at " + hour + ":" + minute + period;
            Pubnub.publish({
                channel: $scope.channel,
                message: {
                    content: $scope.messageContent,
                    sender_uuid: $scope.user,
                    date: sendDate
                },
                callback: function (m) {

                }
            });
            $scope.messageContent = '';
        }

        $scope.changeContact = function (contact, match) {
            $scope.currentContact = contact;
            $scope.matchEmail = match;
            if ($scope.user > contact) {
                $scope.channel = $scope.user + "|" + contact;
            } else {
                $scope.channel = contact + "|" + $scope.user;
            }
            Pubnub.subscribe({
                channel: $scope.channel,
                message: function (m) {
                    $scope.$apply(function () {
                        $scope.currentMessages.push(m);
                    });
                }
            });
            Pubnub.history({
                channel: $scope.channel,
                callback: function (m) {
                    $scope.$apply(function () {
                        $scope.currentMessages.length = 0;
                        angular.extend($scope.currentMessages, m[0]);
                    });
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
            $scope.changeContact($scope.contacts[0].Username, $scope.contacts[0].Email);
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
                        $scope.userEmail = response.data.Items[0].Email;
                        req = {
                            method: 'POST',
                            url: _config.api.invokeUrl + '/getmatches',
                            headers: {
                                Authorization: authToken
                            },
                            data: {}
                        };
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
                        $http(req).then(function successCallback(response) {
                            if (response.data.Count == 0) {
                                Swal.fire({
                                    title: 'Wait Up!',
                                    text: 'You don\'t have any matches just yet',
                                    type: 'success',
                                    confirmButtonColor: '#f08080'
                                });
                                window.location.href = "#!/swipe";
                            }
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

        $scope.unMatch = function (user, match) {
            var req = {
                method: 'POST',
                url: _config.api.invokeUrl + '/unmatch',
                headers: {
                    Authorization: authToken
                },
                data: {
                    Usuario: user,
                    Match: match
                }
            };
            $http(req).then(function successCallback(response) {
                req = {
                    method: 'POST',
                    url: _config.api.invokeUrl + '/unmatch',
                    headers: {
                        Authorization: authToken
                    },
                    data: {
                        Usuario: match,
                        Match: user
                    }
                };
                $http(req).then(function successCallback(response) {
                    Swal.fire({
                        title: 'He/She gone.',
                        text: 'User has been unmatched!',
                        type: 'success',
                        confirmButtonColor: '#f08080'
                    });
                    window.location.reload('#!/chat');
                }, function errorCallback(response) {
                    console.error(response);
                });
            }, function errorCallback(response) {
                console.error(response);
            });
        }

    }]).directive('myRepeatDirective', function () {
        return function (scope, element, attrs) {
            if (scope.$last) {
                var elems = document.querySelectorAll('.tooltipped');
                var instances = M.Tooltip.init(elems);
                document.getElementById('bottom').scrollTop = 9999999;
            }
        };
    });