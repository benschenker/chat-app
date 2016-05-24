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

const state = (() => {
  let queue = [];
  let roomId; // visitor who is currently chatting
  let operator = false; // true when operator is logged in
  const getQueueLen = () => queue.length;
  const enQueue = (id) => {
    if (operator && !roomId) {
      roomId = id;
    } else {
      queue.push(id);
      console.log(`enqueueing: id: ${id} queue: ${queue},`);
    }
  };
  const deQueue = (id = '') => {
    io.emit('queueUpdate'); // notify all users that the queue has changed
    if (!id) {
      return queue.shift();
    }
    queue = _.reject(queue, (val) => val === id);
    return id;
  };
  const getQueuePlace = (id) => queue.indexOf(id) + 1;
  const match = () => {
    console.log(`matching: queue: ${queue}, roomId: ${roomId} `);
    const nextUser = deQueue();
    roomId = nextUser;
    console.log(`matched: queue: ${queue}, roomId: ${roomId} `);
    return roomId;
  };
  const getRoomId = () => roomId;
  const setOperator = (bool) => {
    operator = bool;
  };
  return {
    getQueueLen,
    enQueue,
    getQueuePlace,
    deQueue,
    getRoomId,
    match,
    operator,
    setOperator,
  };
})();

io.on('connection', (socket) => {
  console.log('a user connected');

  function sendQueuePlace() {
    const place = state.getQueuePlace(socket.id);
    socket.emit('queuePlace', place);
  }

  socket.on('visitor-connected', () => {
    console.log(`a visitor connected with socket id:${socket.id}`);
    state.enQueue(socket.id);
    sendQueuePlace();
  });

  /*
  User can check what place they are in, especially after getting a queueUpdate event
  */
  socket.on('checkQueuePlace', sendQueuePlace);

  socket.on('operator-connected', () => {
    console.log(`an operator connected with socket id:${socket.id}`);
    state.setOperator(true);
    const roomId = state.match();
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    console.log(`socket disconnected:${socket.id}`);
    state.deQueue(socket.id);
  });

  socket.on('message-to-operator', (payload) => {
    console.log(`message-to-operator ${payload.name}: ${payload.message}`);
    socket.to(socket.id).emit('newMessage', payload);
  });

  socket.on('message-to-visitor', (payload) => {
    console.log(`message-to-visitor ${state.getRoomId()} ${payload.message}`);
    socket.to(state.getRoomId()).emit('newMessage', payload);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`\nReady for requests on http://localhost:${port}`);// eslint-disable-line no-console
});
