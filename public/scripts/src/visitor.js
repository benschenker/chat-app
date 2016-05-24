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
      $scope.submitNewmessage = () => {
        socket.emit('message-to-operator', {
          name: $scope.name,
          message: $scope.newMessage,
        });
        $scope.addMessage($scope.name, $scope.newMessage);
        $scope.newMessage = '';
      };

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
