 // jshint esversion:6
 var c, val, fg, bg, nitem, ampl = 0,
     rot = 0,
     count = 0;

 window.addEventListener('load', function() {
     socket.forceNew = true;
     nitem = document.getElementsByClassName('color').length;

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
         rot = rot + val;
         doIt(ampl, fg);
     });
     socket.on('amp', function(amp) {
         ampl = parseFloat(amp);
         doIt(ampl, fg);

     });
 });


 function doIt(amp, fg) {
     console.log('amp: ' + amp);
     console.log('fg: ' + fg);
     console.log('nitem: ' + nitem);
     for (var i = 0; i < nitem; i++) {
         document.getElementsByClassName('color').item(i).style.backgroundColor = '#' + fg;
         document.getElementsByClassName('color').item(i).style.transform = "scale(1," + (2 * Math.sin(count) * ((amp * Math.abs((i - nitem / 2))) / nitem) + 0.3) + ")";
         count = count + 0.8;
     }

 }

 function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B); }

 function toHex(n) {
     n = parseInt(n, 10);
     if (isNaN(n)) return "00";
     n = Math.max(0, Math.min(n, 255));
     return "0123456789ABCDEF".charAt((n - n % 16) / 16) +
         "0123456789ABCDEF".charAt(n % 16);
 }