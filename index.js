var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.get('/operator', function(req, res){
    res.sendfile('operator.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('visitor-connected',function(){
      console.log('a visitor connected with socket id:' + socket.id);
    });

    socket.on('operator-connected',function(){
      console.log('an operator connected with socket id:' + socket.id);
    });

    socket.on('disconnect', function(){
      console.log('socket disconnected: ' + socket.id);
    });

    socket.on('message-to-operator', function(payload){
      console.log("message-to-operator " + payload.message);
    });

    socket.on('message-to-visitor', function(payload){
      console.log("message-to-visitor " + payload.message);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

