 // jshint esversion:6

 socket.forceNew = true;

 socket.on('connect', function() {
     console.log('connected');
     this.emit('Hello!');

 });

 socket.on('error', function() { socket.close(); });
 socket.on('disconnect', function() { socket.close(); });
 socket.on('close', function() { socket.close(); });
 socket.on('color', function(color) {
     console.log(color);
     document.body.style.backgroundColor = color;
 });

 var osc = new OSC({
     plugin: new OSC.WebsocketServerPlugin()
 });

 osc.on('open', function() {
     console.log('OSC open');
     osc.send('hello');
 });

 osc.open({ port: 10000 });