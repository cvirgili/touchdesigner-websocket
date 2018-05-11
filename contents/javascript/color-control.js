 // jshint esversion:6
 var c, val, fg, bg, div, svg, vals = [],
     nitem, strobeval = 0,
     scalemax = 1;

 var rows = 10,
     cols = 10;

 var svgname = "hex.svg";

 $.get('/default', function(data) {
     getNItems(data.nitem);
     fg = data.color.substr(0, 7);
     //document.getElementById('overlay').style.backgroundColor = fg;
 }).fail(function() {
     onDisconnect();
 });

 window.addEventListener('load', function() {
     createItems();
     setColor();

     //socket.forceNew = true;

     socket.on('connect', function() {});
     socket.on('error', function() {
         onDisconnect();
         socket.close();
     });
     socket.on('disconnect', function() {
         onDisconnect();
         socket.close();
     });
     socket.on('close', function() {
         onDisconnect();
         socket.close();
     });
     socket.on('color', function(color) {
         fg = color.substr(0, 7);
         setColor();
     });

     socket.on('reload', reload);


     socket.on('strobe', function(strb) {
         strobeval = parseFloat(strb);
         document.getElementById('overlay').style.backgroundColor = (strobeval >= 1.0) ? "#ffffff" : fg;
         document.getElementById('overlay').style.opacity = strobeval;
     });

     socket.on('nitem', function(n) {
         getNItems(n);
         createItems();
     });

     socket.on('scale', function(s) {
         console.log(s);
         scalemax = parseFloat(s);
     });

     socket.on('values', function(val) {
         vals = val.split('\n').join('').split('|');
         for (var i = nitem - 1; i >= 0; i--) {
             document.getElementsByClassName('color').item(i).style.opacity = parseFloat(vals[nitem - i - 1]);
             document.getElementsByClassName('color').item(i).style.transform = parseFloat(vals[nitem - i - 1]) <= 0.2 ? "scale(0.5,.5)" : "scale(" + scalemax + ")";
         }
     });
 });

 function onDisconnect() {
     document.getElementById('container').innerHTML = "<h1>Bye Bye!</h1><button id='reloadbtn'>RELOAD</button>";
     $('#reloadbtn').on('click touchstart', reload);
     document.body.style.backgroundColor = "red";
 }

 function reload() {
     location.reload(true);
 }

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
         //div.style.backgroundColor = fg;
         document.getElementById('container').appendChild(div);
         div.innerHTML = '<object class="svgobj" data="/contents/images/' + svgname + '" type="image/svg+xml" width="100%" height="100%"></object>';
     }
 }

 function setColor() {

     document.getElementById('overlay').style.backgroundColor = fg;
     if (document.getElementsByClassName("svgobj").length == 0) return;
     for (var i = 0; i < nitem; i++) {
         try {
             document.getElementsByClassName("svgobj").item(i).contentDocument.getElementsByClassName('mysvg').item(0).setAttribute('fill', fg);
         } catch (err) {}
     }
 }