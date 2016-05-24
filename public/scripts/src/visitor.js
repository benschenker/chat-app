/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('visitorCtrl',
  [
    '$scope',
    ($scope) => {
      $scope.queue = 4;
    },
  ]
);


// const socket = io();
// socket.on('connect', () => {
//   socket.emit('visitor-connected');
// });

// function sendMessageToOperator(message) {
//   socket.emit('message-to-operator', { message });
// }
