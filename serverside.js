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

var users = {};

app.get('/', function(req, res) {
    res.render('index.html', {});
});

io.on('connection', function(socket){
    socket.on('join', function(username) {
        users[socket.id] = username;
        io.emit('user connected', username + ' joined the room');
    });
    socket.on('disconnect', function(){
        console.log(users[socket.id]);
        if (users[socket.id]) {
            io.emit('user disconnected', users[socket.id] + ' left the room');
        }
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', users[socket.id], msg);
    });
    socket.on('typing', function(username) {
        io.emit('typing', username + ' is typing');
    });
    socket.on('cleartyping', function() {
        setTimeout(function() {
            console.log('clearing');
            io.emit('cleartyping');
        }, 800);
    });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});