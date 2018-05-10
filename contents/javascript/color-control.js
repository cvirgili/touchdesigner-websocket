 // jshint esversion:6
 var c, val, fg, bg, div, vals = [],
     nitem;

 var rows = 10,
     cols = 10;

 $.get('/default', function(data) {
     console.log('color: ' + data.color);
     console.log('nitem: ' + data.nitem);
     getNItems(data.nitem);
     fg = data.color.substr(0, 7);
     document.getElementById('overlay').style.backgroundColor = fg;
 });

 window.addEventListener('load', function() {
     createItems();
     doIt();

     //socket.forceNew = true;

     socket.on('connect', function() {});
     socket.on('error', function() { socket.close(); });
     socket.on('disconnect', function() { socket.close(); });
     socket.on('close', function() { socket.close(); });
     socket.on('color', function(color) {
         fg = color.substr(0, 7);
         doIt();
     });

     socket.on('strobe', function(strb) {
         document.getElementById('overlay').style.backgroundColor = (parseFloat(strb) < 0.20) ? fg : "#ffffff";
         document.getElementById('overlay').style.opacity = parseFloat(strb);
     });

     socket.on('nitem', function(n) {
         getNItems(n);
         createItems();
     });

     socket.on('values', function(val) {
         vals = val.split('\n').join('').split('|');
         for (var i = nitem - 1; i >= 0; i--) {
             document.getElementsByClassName('color').item(i).style.opacity = parseFloat(vals[nitem - i - 1]);
         }
     });
 });

 function getNItems(n) {
     rows = parseInt(n.split('|')[0]);
     cols = parseInt(n.split('|')[1]);
     nitem = rows * cols;

 }

 function createItems() {
     document.getElementById('container').innerHTML = "";
     for (var i = 0; i < nitem; i++) {
         div = document.createElement("div");
         div.setAttribute("class", "color");
         div.style.width = 100 / cols + "vw";
         div.style.height = 100 / rows + "vh";
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