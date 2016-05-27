/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('visitorCtrl',
  [
    '$scope',
    'socket',
    ($scope, socket) => {
      $scope.queue = 100; // large inital value
      $scope.name = 'visitor';
      $scope.history = [];
      $scope.submitNewMessage = () => {
        const payload = {
          name: $scope.name,
          message: $scope.newMessage,
        };
        socket.emit('message-to-operator', payload);
        $scope.addMessage(payload);
        $scope.newMessage = '';
      };

      $scope.$on('socket:connect', () => {
        socket.emit('visitor-connected', 'visitor');
      });
      $scope.$on('socket:queueUpdate', () => {
        socket.emit('checkQueuePlace');
      });
      $scope.$on('socket:queuePlace', (ev, place) => {
        $scope.queue = place;
      });
      $scope.$on('socket:newMessage', (ev, payload) => {
        $scope.addMessage(payload);
      });
      $scope.$on('socket:chatEnd', () => {
        $scope.chatEnd = true;
      });
    },
  ]
);
