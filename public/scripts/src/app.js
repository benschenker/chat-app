/* global angular*/
angular.module('chat', [
  'btford.socket-io',
])
.factory('socket', (socketFactory) => {
  const socket = socketFactory();
  socket.forward('connect');
  socket.forward('queueUpdate');
  socket.forward('queuePlace');
  return socket;
});
