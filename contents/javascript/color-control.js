 // jshint esversion:6

 window.addEventListener('load', function() {
     socket.forceNew = true;

     socket.on('connect', function() {
         console.log('connected');
         this.emit('Hello!');

     });

     socket.on('error', function() { socket.close(); });
     socket.on('disconnect', function() { socket.close(); });
     socket.on('close', function() { socket.close(); });
     socket.on('color', function(color) {
         var c = color.split('\n').join('').split('|');
         //console.log(rgbToHex(c[0], c[1], c[2]));

         document.body.style.backgroundColor = '#' + rgbToHex(c[0], c[1], c[2]);
     });

     socket.on('millis', function(ms) {
         document.getElementById('millis').innerText = ms;
     });
 });

 function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B) }

 function toHex(n) {
     n = parseInt(n, 10);
     if (isNaN(n)) return "00";
     n = Math.max(0, Math.min(n, 255));
     return "0123456789ABCDEF".charAt((n - n % 16) / 16) +
         "0123456789ABCDEF".charAt(n % 16);
 }