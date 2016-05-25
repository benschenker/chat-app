/* global angular*/
angular.module('chat', [
  'btford.socket-io',
])
.factory('socket', (socketFactory) => {
  const socket = socketFactory();
  socket.forward('connect');
  socket.forward('queueUpdate');
  socket.forward('queuePlace');
  socket.forward('newMessage');
  socket.forward('chatStart');
  socket.forward('chatEnd');
  socket.forward('default-name');
  socket.forward('queueUpdateOperator');
  return socket;
});
