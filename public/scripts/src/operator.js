/* global io angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')

.controller('operatorCtrl',
  [
    '$scope',
    'socket',
    ($scope, socket) => {
      $scope.name = 'Operator';
      $scope.chattingWith = {};
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
      $scope.$on('socket:chatStart', (ev, chatter) => {
        $scope.history = [];
        $scope.chattingWith = chatter;
      });
      $scope.$on('socket:chatEnd', () => {
        $scope.history = [];
        $scope.chattingWith = {};
      });
      $scope.$on('socket:chatter-name-change', (ev, chatter) => {
        $scope.chattingWith = chatter;
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
