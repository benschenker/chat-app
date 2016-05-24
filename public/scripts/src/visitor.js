/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('visitorCtrl',
  [
    '$scope',
    'socket',
    ($scope, socket) => {
      $scope.queue = 4;
      $scope.$on('socket:connect', () => {
        socket.emit('visitor-connected');
      });
    },
  ]
);


// function sendMessageToOperator(message) {
//   socket.emit('message-to-operator', { message });
// }
