$(function () {
    var socket = io();
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('user connected', function(notification) {
        $('#messages').append($('<li class="notification">').text(notification));
    });
    socket.on('user disconnected', function(notification) {
        $('#messages').append($('<li class="notification">').text(notification));
    });
});