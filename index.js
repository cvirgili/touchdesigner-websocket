var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/contents', express.static(__dirname + '/contents'));
app.use('/modules', express.static(__dirname + '/node_modules'));

app.get('/colors', function(req, res) {
    res.sendFile(__dirname + '/views/colors.html');
});


io.on('connect', function(socket) {
    console.log('connected');
    io.emit('hello!');
    io.send('Hello!');
    socket.send('Hello!');
    socket.on('error', function() {
        socket.close();
    });
    socket.on('close', function() {
        socket.close();
    });
    socket.on('disconnect', function() {
        //socket.close();
    });
    socket.on('color', function(color) {
        socket.emit('color', color);
    });

});


http.listen(3001, function() {
    console.log('listening on *:3001');
});