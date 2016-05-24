/* global angular*/
angular.module('chat', [
  'btford.socket-io',
])
.factory('socket', (socketFactory) => {
  const socket = socketFactory();
  socket.forward('connect');
  return socket;
});
