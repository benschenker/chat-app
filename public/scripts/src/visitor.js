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
      // $scope.addMessage is a function that comes from the qc-chatbox directive

      $scope.submitNewMessage = () => {
        const payload = {
          name: $scope.name,
          message: $scope.newMessage,
        };
        socket.emit('message-to-operator', payload);
        $scope.addMessage(payload);
        $scope.newMessage = '';
      };

      $scope.$watch('name', (newValue) => {
        socket.emit('visitor-change-name', newValue);
      });
      $scope.$on('socket:connect', () => {
        socket.emit('visitor-connected', $scope.name);
      });
      $scope.$on('socket:queueUpdate', () => {
        socket.emit('checkQueuePlace'); // when the queue updates, ask for a new place number
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
