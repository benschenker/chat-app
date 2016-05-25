/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('visitorCtrl',
  [
    '$scope',
    'socket',
    ($scope, socket) => {
      $scope.queue = 100; // large inital value

      $scope.history = [];
      $scope.addMessage = (payload) => {
        $scope.history.push(payload);
      };
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
        socket.emit('visitor-connected');
      });
      $scope.$on('socket:default-name', (ev, defaultName) => {
        $scope.name = defaultName;
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


// function sendMessageToOperator(message) {
//   socket.emit('message-to-operator', { message });
// }
