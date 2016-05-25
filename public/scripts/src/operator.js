/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('operatorCtrl',
  [
    '$scope',
    'socket',
    ($scope, socket) => {
      $scope.chatting = false;
      $scope.history = [];
      $scope.addMessage = (payload) => {
        $scope.history.push(payload);
      };
      $scope.submitNewMessage = () => {
        const payload = {
          name: $scope.name,
          message: $scope.newMessage,
        };
        socket.emit('message-to-visitor', payload);
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

// function sendMessageToVisitor(message) {
//   socket.emit('message-to-visitor', { message });
// }
