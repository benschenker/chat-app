/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('operatorCtrl',
  [
    '$scope',
    'socket',
    ($scope, socket) => {
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
      });
      $scope.$on('socket:chatEnd', () => {
        $scope.history = [];
      });
      $scope.$on('socket:newMessage', (ev, payload) => {
        $scope.addMessage(payload);
      });
    },
  ]
);

// function sendMessageToVisitor(message) {
//   socket.emit('message-to-visitor', { message });
// }
