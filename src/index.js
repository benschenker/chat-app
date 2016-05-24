/* eslint func-names: "off", no-console: "off"*/
const express = require('express');
const app = express();
const server = require('http').Server(app);// eslint-disable-line new-cap
const io = require('socket.io')(server);

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
  const queue = [];
  const getQueueLen = () => queue.length;
  const enQueue = (id) => {
    queue.push(id);
  };
  const deQueue = () => {
    io.emit('queueUpdate'); // notify all users that the queue has changed
    return queue.shift();
  };
  const getQueuePlace = (id) => queue.indexOf(id);
  return {
    getQueueLen,
    enQueue,
    getQueuePlace,
    deQueue,
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

  // socket.on('operator-connected', () => {
  //   console.log(`an operator connected with socket id:${socket.id}`);
  // });

  socket.on('disconnect', () => {
    console.log(`socket disconnected:${socket.id}`);
    state.deQueue(socket.id);
  });

  socket.on('message-to-operator', (payload) => {
    console.log(`message-to-operator ${payload.name}: ${payload.message}`);
  });
  //
  // socket.on('message-to-visitor', (payload) => {
  //   console.log(`message-to-visitor ${payload.message}`);
  // });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`\nReady for requests on http://localhost:${port}`);// eslint-disable-line no-console
});
