// jshint esversion:6
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

app.use('/contents', express.static(__dirname + '/contents'));
app.use('/modules', express.static(__dirname + '/node_modules'));

app.get('/colors', function(req, res) {
    res.sendFile(__dirname + '/views/colors.html');
});


io.on('connect', function(socket) {
    console.log('connected');
    server.send('hello\n', 12000, 'localhost', function(err, bytes) {
        console.log('err: ' + err);
        console.log('bytes: ' + bytes);
        // server.close();
    });
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

    server.on('message', (msg, rinfo) => {
        //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        if (msg.toString().startsWith('millis'))
            io.emit('millis', msg.toString().split(':')[1]);
        if (msg.toString().startsWith('color'))
            io.emit('color', msg.toString().split(':')[1]);
    });
});


http.listen(3001, function() {
    console.log('listening on *:3001');
});



server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});


server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(14000);