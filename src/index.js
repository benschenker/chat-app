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

/* allows pug to render html for any views requested
for example: to render the operator view/html
navigate to '/views/operator'
*/
app.get('/views/:file', (req, res) => {
  res.render(req.params.file);
});

let state = {
  queue: [], // array of visitor objects
  visitorChatting: {}, // a visitor object consisting of a name and an id
  operator: undefined, // the socket id of the logged in operator
};
io.on('connection', (socket) => {
  console.log('a user connected');
  function isVisitor(id) {
    return (visitorObj) => visitorObj.id === id;
  }
  function sendQueuePlace() {
    const place = _.findIndex(state.queue, isVisitor(socket.id)) + 1;
    socket.emit('queuePlace', place);
  }
  function queueUpdateOperator(currentState) {
    io.to(currentState.operator).emit('queueUpdateOperator', currentState.queue);
  }
  function addNextChatterToChat(currentState) {
    const newState = _.cloneDeep(currentState);
    if (newState.queue.length && newState.operator) {
      newState.visitorChatting = newState.queue.shift();
      io.emit('queueUpdate'); // notify all users that the queue has changed
      io.to(newState.operator).emit('chatStart');
      io.to(newState.visitorChatting.id).emit('chatStart');
    } else {
      newState.visitorChatting = {};
    }
    queueUpdateOperator(newState);
    return newState;
  }
  function logState() {
    console.log(`
      queue: ${_.map(state.queue, (visitorObj) => _.get(visitorObj, 'id'))},
      visitorChatting: ${_.get(state.visitorChatting, 'id')},
      operator: ${state.operator}
    `);
  }


  socket.on('visitor-connected', (name) => {
    console.log(`a visitor connected with socket id:${socket.id}`);
    let newState = _.cloneDeep(state);
    newState.queue.push({
      id: socket.id,
      name,
    });
    if (!newState.visitorChatting.id) {
      newState = addNextChatterToChat(newState);
    }
    state = newState;
    queueUpdateOperator(state);
    sendQueuePlace();
    logState();
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
    logState();
  });

  socket.on('disconnect', () => {
    console.log(`socket disconnected:${socket.id}`);
    let newState = _.cloneDeep(state);
    if (socket.id === newState.operator) {
      newState.operator = undefined;
      // what happens if he is chatting and disconnects?
      io.to(newState.visitorChatting.id).emit('chatEnd'); // as if operator did !next
    } else if (socket.id === newState.visitorChatting.id) {
      io.to(newState.operator).emit('chatEnd');
      newState = addNextChatterToChat(newState);
    } else if (_.find(newState.queue, isVisitor(socket.id))) {
      newState.queue = _.reject(newState.queue, isVisitor(socket.id));
      queueUpdateOperator(newState);
      io.emit('queueUpdate'); // notify all users that the queue has changed
    }
    state = newState;
    logState();
  });

  socket.on('message-to-operator', (payload) => {
    console.log(`message-to-operator ${payload.name}: ${payload.message}`);
    socket.to(state.operator).emit('newMessage', payload);
  });

  socket.on('message-to-visitor', (payload) => {
    console.log(`message-to-visitor ${state.visitorChatting.id} ${payload.message}`);
    socket.to(state.visitorChatting.id).emit('newMessage', payload);
  });
  socket.on('closeThisChat', () => {
    console.log(`close chat with ${state.visitorChatting.id}`);
    let newState = _.cloneDeep(state);
    io.to(newState.operator).emit('chatEnd');
    io.to(newState.visitorChatting.id).emit('chatEnd');
    newState = addNextChatterToChat(newState);
    state = newState;
  });
  socket.on('visitor-change-name', (name) => {
    const newState = _.cloneDeep(state);
    if (socket.id === newState.visitorChatting.id) {
      newState.visitorChatting.name = name;
      // Send operator updated name of chatter
    } else if (_.find(newState.queue, isVisitor(socket.id))) {
      const visitorIndex = _.findIndex(state.queue, isVisitor(socket.id));
      newState.queue[visitorIndex].name = name;
      queueUpdateOperator(newState);
    }
    state = newState;
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`\nReady for requests on http://localhost:${port}`);// eslint-disable-line no-console
});
