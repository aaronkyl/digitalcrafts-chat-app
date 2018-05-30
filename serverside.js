const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const http = require('http').Server(app);
const io = require('socket.io')(http);

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
    console.log('a user joined');
    io.emit('user connected', 'a user joined');
    socket.on('disconnect', function(){
        console.log('a user left');
        io.emit('user disconnected', 'a user left');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});