/* global io*/
const socket = io();
socket.on('connect', () => {
  socket.emit('operator-connected');
});

// function sendMessageToVisitor(message) {
//   socket.emit('message-to-visitor', { message });
// }
