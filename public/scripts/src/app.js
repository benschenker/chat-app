/* global io*/
const socket = io();
socket.on('connect', () => {
  socket.emit('visitor-connected');
});

// function sendMessageToOperator(message) {
//   socket.emit('message-to-operator', { message });
// }
