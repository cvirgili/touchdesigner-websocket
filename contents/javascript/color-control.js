 // jshint esversion:6
 var c, val, fg, bg, div, vals = new Array(),
     nitem = 45,
     ampl = 0,
     rot = 0,
     count = 0;

 window.addEventListener('load', function() {
     socket.forceNew = true;

     createItems();

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
     socket.on('nitem', function(n) {
         nitem = parseInt(n);
         createItems();
     });
     socket.on('values', function(val) {
         vals = [];
         vals = val.split('\n').join('').split('|');
         for (var i = 0; i < nitem; i++) {
             document.getElementsByClassName('color').item(i).style.transform = "scale(1," + Math.round(parseFloat(vals[i]) * 100) / 100 + ")";
         }
     });
 });

 function createItems() {
     document.getElementById('container').innerHTML = "";
     for (var i = 0; i < nitem; i++) {
         div = document.createElement("div");
         div.setAttribute("class", "color");
         div.style.width = (100 / (nitem * 2)) + "%";
         div.style.marginLeft = (100 / (nitem * 2)) / 2 + "%";
         div.style.marginRight = (100 / (nitem * 2)) / 2 + "%";
         document.getElementById('container').appendChild(div);
     }

 }

 function doIt(amp, fg) {
     for (var i = 0; i < nitem; i++) {
         document.getElementsByClassName('color').item(i).style.backgroundColor = '#' + fg;
         //document.getElementsByClassName('color').item(i).style.transform = "scale(1," + (3 * Math.sin(count) * ((amp * Math.abs((i - nitem / 2))) / nitem) + 0.01) + ")";
         //count = count + 0.4;
     }

 }

 function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B); }

 function toHex(n) {
     n = parseInt(n, 10);
     if (isNaN(n)) return "00";
     n = Math.max(0, Math.min(n, 255));
     return "0123456789ABCDEF".charAt((n - n % 16) / 16) +
         "0123456789ABCDEF".charAt(n % 16);
 };