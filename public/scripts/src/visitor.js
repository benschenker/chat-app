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
      $scope.addMessage = (from, message) => {
        $scope.history.push({
          from,
          message,
        });
      };
      $scope.addMessage('Ben', 'Hello World');

      $scope.$on('socket:connect', () => {
        socket.emit('visitor-connected');
      });
      $scope.$on('socket:queueUpdate', () => {
        socket.emit('checkQueuePlace');
      });
      $scope.$on('socket:queuePlace', (ev, place) => {
        $scope.queue = place;
      });
    },
  ]
);


// function sendMessageToOperator(message) {
//   socket.emit('message-to-operator', { message });
// }
