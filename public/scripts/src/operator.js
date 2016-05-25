/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('operatorCtrl',
  [
    '$scope',
    'socket',
    ($scope, socket) => {
      $scope.name = 'Operator';
      $scope.chatting = false;
      $scope.history = [];

      $scope.submitNewMessage = () => {
        const payload = {
          name: $scope.name,
          message: $scope.newMessage,
        };
        if (payload.message === '!next') {
          socket.emit('closeThisChat');
        } else {
          socket.emit('message-to-visitor', payload);
        }
        $scope.addMessage(payload);
        $scope.newMessage = '';
      };

      $scope.$on('socket:connect', () => {
        socket.emit('operator-connected');
      });
      $scope.$on('socket:chatStart', () => {
        $scope.history = [];
        $scope.chatting = true;
      });
      $scope.$on('socket:chatEnd', () => {
        $scope.history = [];
        $scope.chatting = false;
      });
      $scope.$on('socket:newMessage', (ev, payload) => {
        $scope.addMessage(payload);
      });
      $scope.$on('socket:queueUpdateOperator', (ev, queue) => {
        $scope.queue = queue;
      });
    },
  ]
);
