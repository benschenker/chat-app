/* eslint func-names: "off", no-console: "off"*/
const express = require('express');
const app = express();
const server = require('http').Server(app);// eslint-disable-line new-cap
const io = require('socket.io')(server);
const _ = require('lodash');

const publicPath = '../public';
app.use(express.static(publicPath));
app.set('views', `${publicPath}/views`);
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/operator', (req, res) => {
  res.render('operator');
});

let state = {
  queue: [],
  visitorChatting: undefined,
  operator: undefined,
};
io.on('connection', (socket) => {
  console.log('a user connected');

  function sendQueuePlace() {
    const place = state.queue.indexOf(socket.id) + 1;
    socket.emit('queuePlace', place);
  }
  function addNextChatterToChat(currentState) {
    const newState = _.cloneDeep(currentState);
    if (newState.queue.length) {
      newState.visitorChatting = newState.queue.shift();
      io.emit('queueUpdate'); // notify all users that the queue has changed
      // socket.join(newState.visitorChatting);
    }
    return newState;
  }

  socket.on('visitor-connected', () => {
    console.log(`a visitor connected with socket id:${socket.id}`);
    const newState = _.cloneDeep(state);
    if (newState.operator && !newState.visitorChatting) {
      newState.visitorChatting = socket.id;
      // connect him to operator!
    } else {
      newState.queue.push(socket.id);
    }
    state = newState;
    sendQueuePlace();
  });

  /*
  User can check what place they are in, especially after getting a queueUpdate event
  */
  socket.on('checkQueuePlace', sendQueuePlace);

  socket.on('operator-connected', () => {
    console.log(`an operator connected with socket id:${socket.id}`);
    let newState = _.cloneDeep(state);
    newState.operator = socket.id;
    newState = addNextChatterToChat(newState);
    state = newState;
  });

  socket.on('disconnect', () => {
    console.log(`socket disconnected:${socket.id}`);
    // state.deQueue(socket.id);
    let newState = _.cloneDeep(state);
    if (socket.id === newState.operator) {
      newState.operator = undefined;
      // what happens if he is chatting?
    } else if (socket.id === newState.visitorChatting) {
      newState = addNextChatterToChat(newState);
    } else if (newState.queue.indexOf(socket.id) !== -1) {
      newState.queue = _.reject(newState.queue, (val) => val === socket.id);
    }
    state = newState;
  });

  socket.on('message-to-operator', (payload) => {
    console.log(`message-to-operator ${payload.name}: ${payload.message}`);
    socket.to(state.operator).emit('newMessage', payload);
  });

  socket.on('message-to-visitor', (payload) => {
    console.log(`message-to-visitor ${state.visitorChatting} ${payload.message}`);
    socket.to(state.visitorChatting).emit('newMessage', payload);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`\nReady for requests on http://localhost:${port}`);// eslint-disable-line no-console
});
