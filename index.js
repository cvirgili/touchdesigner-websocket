// jshint esversion:6
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var clients = [];
app.use('/contents', express.static(__dirname + '/contents'));
app.use('/modules', express.static(__dirname + '/node_modules'));

app.get('/colors', function(req, res) {
    res.sendFile(__dirname + '/views/colors.html');
});


io.on('connect', function(socket) {
    clients.push(socket);
    console.log('clientsN: ' + clients.length);
    server.send('hello:' + clients.indexOf(socket) + '\n', 15000);
    socket.on('error', function() {});
    socket.on('close', function() {

    });
    socket.on('disconnect', function() {
        server.send('bye:' + clients.indexOf(socket) + '\n', 15000);
        clients.splice(clients.indexOf(socket), 1);
        console.log('clientsN: ' + clients.length);
    });
    socket.on('color', function(color) {
        socket.emit('color', color);
    });

});

server.on('message', (msg, rinfo) => {
    var key = msg.toString().split(':')[0];
    var val = msg.toString().split(':')[1];
    io.emit(key, val);
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