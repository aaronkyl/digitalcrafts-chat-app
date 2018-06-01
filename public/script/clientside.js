$(function () {
    var socket = io();
    var username;
    $("form").submit(function(event){
		event.preventDefault();
	});
	
    $('#messageform').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    
    $('#usernameform').submit(function() {
        $('#usernameform').toggle();
        $('#chatdiv').toggle();
        username = $('#username').val();
        $('#usernameheader').text(username);
        socket.emit('join', username);
    });
    
    $('#m').keydown(function() {
        socket.emit('typing', username);
    });
    $('#m').keyup(function() {
        socket.emit('cleartyping');
    });
    
    function displayNotification(notification) {
        $('#messages').append($('<li class="notification">').text(notification));
    }
    
    function updateUserList(users) {
        $('#userlist').empty();
        $.each(users, function(index, value) {
            $('#userlist').append(value);
            if(index != users.length - 1) {
                $('#userlist').append(', ');
            }
        });
    }
    
    socket.on('typing', function(notification) {
        $('#typingalert').text(notification);
    });
    socket.on('cleartyping', function() {
        $('#typingalert').empty();
    });
    socket.on('chat message', function(user, msg){
        $('#messages').append($('<li>').text(user + ': ' + msg));
    });
    socket.on('user connected', function(notification, users) {
        displayNotification(notification);
        updateUserList(users);
    });
    socket.on('user disconnected', function(notification, users) {
        displayNotification(notification);
        updateUserList(users);
    });
});