 // jshint esversion:6
 var c, val, fg, bg;
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
         c = color.split('\n').join('').split('|');
         fg = rgbToHex(c[0], c[1], c[2]);
         bg = rgbToHex((255 - parseInt(c[0])), (255 - parseInt(c[1])), (255 - parseInt(c[2])));
         val = (((Math.max(0, Math.min(parseInt(c[0]), 255)) / 255) + (Math.max(0, Math.min(parseInt(c[1]), 255)) / 255) + (Math.max(0, Math.min(parseInt(c[2]), 255)) / 255)) / 3);
         document.body.style.backgroundColor = '#' + bg;
         document.getElementById('color').style.backgroundColor = '#' + fg;
         //document.getElementById('color').style.transform = "scale(" + val + ",1) translate(0," + (document.body.clientHeight - val * document.body.clientHeight) + "px)";
         //document.getElementById('color').style.transform = "scale(" + val + ")";
         document.getElementById('color').style.boxShadow = "0 0 " + (val * 500) + "px #" + fg;
     });
 });

 function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B); }

 function toHex(n) {
     n = parseInt(n, 10);
     if (isNaN(n)) return "00";
     n = Math.max(0, Math.min(n, 255));
     return "0123456789ABCDEF".charAt((n - n % 16) / 16) +
         "0123456789ABCDEF".charAt(n % 16);
 }