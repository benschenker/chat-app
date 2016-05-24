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
  let queue = [];
  const getQueueLen = () => queue.length;
  const enQueue = (newVal) => {
    queue = queue.concat(newVal);
    io.emit('queueUpdate', {
      queue: getQueueLen(),
    });
  };
  return {
    getQueueLen,
    enQueue,
  };
})();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('visitor-connected', () => {
    console.log(`a visitor connected with socket id:${socket.id}`);
    state.enQueue(socket.id);
  });

  socket.on('operator-connected', () => {
    console.log(`an operator connected with socket id:${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`socket disconnected:${socket.id}`);
  });

  socket.on('message-to-operator', (payload) => {
    console.log(`message-to-operator ${payload.message}`);
  });

  socket.on('message-to-visitor', (payload) => {
    console.log(`message-to-visitor ${payload.message}`);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`\nReady for requests on http://localhost:${port}`);// eslint-disable-line no-console
});
