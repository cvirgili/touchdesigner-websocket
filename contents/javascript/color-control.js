 // jshint esversion:6
 var c, val, fg, bg, div, vals = new Array(),
     nitem,
     ampl = 0,
     rot = 0,
     count = 0;

 var row = 10;

 $.get('/default', function(data) {
     console.log('color: ' + data.color);
     console.log('nitem: ' + data.nitem);
     nitem = parseInt(data.nitem);
     fg = data.color + "";
     createItems();
     doIt();
     document.getElementById('overlay').style.backgroundColor = fg;

 });

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
         fg = color.substr(0, 7);
         doIt();
     });

     socket.on('strobe', function(strb) {
         document.getElementById('overlay').style.opacity = parseFloat(strb);
         document.getElementById('overlay').style.backgroundColor = (parseFloat(strb) > 0.15) ? "#fff" : fg;
     });
     socket.on('nitem', function(n) {
         nitem = parseInt(n);
         createItems();
     });
     socket.on('values', function(val) {
         vals = [];
         vals = val.split('\n').join('').split('|');
         for (var i = nitem - 1; i >= 0; i--) {
             document.getElementsByClassName('color').item(i).style.opacity = parseFloat(vals[nitem - i - 1]);
         }
     });

 });


 function createItems() {
     document.getElementById('container').innerHTML = "";
     for (var i = 0; i < nitem; i++) {
         div = document.createElement("div");
         div.setAttribute("class", "color");
         div.style.width = 100 / (nitem / row) + "vw";
         div.style.height = 100 / row + "vh";
         div.style.marginTop = 0 + "vh";
         div.style.backgroundColor = fg;
         document.getElementById('container').appendChild(div);
     }

 }

 function doIt() {
     for (var i = 0; i < nitem; i++) {
         document.getElementsByClassName('color').item(i).style.backgroundColor = fg;
     }
     document.getElementById('overlay').style.backgroundColor = fg;
 }