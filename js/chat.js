'use strict';
// require(["underscore"])
angular.module('myApp.chat', ['ngRoute',"pubnub.angular.service"])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/chat', {
            templateUrl: 'views/chat.html',
        });
    }])
    .controller('ChatCtrl', function($scope, Pubnub) {
        
        // Listening to the callbacks
        $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function (ngEvent, m) {
            $scope.$apply(function () {
                $scope.messages.push(m);
            });
        });

        $scope.sendMessage = function() {
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
                 callback: function(m) {
                     console.log(m);
                 }
             });
             // Reset the messageContent input
             $scope.messageContent = '';
         }


        $scope.initChat = function(){
            Pubnub.init({
                publish_key: 'pub-c-50877502-ae22-45dc-a606-d8f589fa76db',
                subscribe_key: 'sub-c-157f2f30-7c0e-11e9-a950-f249fab64e16',
                uuid: $scope.user
            });
            
            $scope.channel = 'messages-channel';
            Pubnub.subscribe({
                channel: $scope.channel,
                triggerEvents: ['callback']
            });
            Pubnub.history({
                channel: $scope.channel,
                callback: function(m) {
                    console.log(m);
                    angular.extend($scope.messages, m[0]); //This empties messages.
                },
                count: 20
            });
        }

        $scope.changeContact = function(contact){
            // Pubnub.unsubscribe({
            //     channel: $scope.channel
            // }); //Esto me regresa un error raro de CORB :(
            // console.log("Desuscrito :(")
            $scope.channel = contact;
            $scope.currentContact = contact;
            Pubnub.subscribe({
                channel: $scope.channel,
                triggerEvents: ['callback']
            });
            // console.log("Suscrito :)")
            console.log(contact);
            Pubnub.history({
                channel: $scope.channel,
                callback: function(m) {
                    console.log(m);
                    angular.extend($scope.messages, m[0]); //This empties messages.
                },
                count: 20
            });
        }

        $scope.user = "Chouza"; //Should be the current user, not the current contact from the chat.
        $scope.channel = "";
        $scope.currentContact = "";
        $scope.contacts = [
            "Raku",
            "Jkks",
            "Brenda",
            "Sergio",
            "Sachy",
            "messages-channel"
        ];
        $scope.messages = [];
        $scope.initChat();
        // $scope.changeContact($scope.contacts[0]);
    });
    