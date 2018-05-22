// jshint esversion:6
var add, cint, hexStr, itemrgb = "127,127,127";
var c, val, fg, bg = "0,0,0",
    div, svg, vals = [],
    nitem, strobeval = 0,
    scalemax = 1.2;

var rows = 10,
    cols = 10;

var svgname = "circle.svg";

$.get('/default', function(data) {
    getNItems(data.nitem);
    fg = 'hsl(' + rgbToHsl(data.color) + ')';
    scalemax = parseFloat(data.scale);
}).fail(function() {
    onDisconnect();
});

window.addEventListener('load', function() {
    createItems();
    setColor();

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
        itemrgb = color;
        fg = 'hsl(' + rgbToHsl(color.substr(0, color.length - 1)) + ')';
        setColor();
    });

    socket.on('bgcolor', function(color) {
        bg = color.substr(0, color.length - 1);
        bg = 'rgb(' + (color.substr(0, color.length - 1)) + ')';
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
        scalemax = parseFloat(s);
    });

    socket.on('values', function(val) {
        vals = val.split('\n').join('').split('|');
        for (var i = nitem - 1; i >= 0; i--) {
            if (document.getElementsByClassName('color').item(i).style.webkitAnimationPlayState != "running") {
                document.getElementsByClassName('color').item(i).style.opacity = parseFloat(vals[nitem - i - 1]);
                document.getElementsByClassName('color').item(i).style.transform = parseFloat(vals[nitem - i - 1]) <= 0.2 ? "scale(1)" : "scale(" + scalemax + ")";
            }
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
    rows = n ? parseInt(n.split('|')[0]) : 4;
    cols = n ? parseInt(n.split('|')[1]) : 4;
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
        document.getElementById('container').appendChild(div);
        div.innerHTML = '<object class="svgobj" data="/contents/images/' + svgname + '" type="image/svg+xml" width="100%" height="100%"></object>';
    }
}

function setColor() {
    document.getElementById('overlay').style.backgroundColor = fg;
    document.body.style.backgroundColor = bg;
    if (document.getElementsByClassName("svgobj").length == 0) return;
    for (var i = 0; i < nitem; i++) {
        try {
            document.getElementsByClassName("svgobj").item(i).contentDocument.getElementsByClassName('mysvg').item(0).setAttribute('fill', 'hsl(' + rgbToHsl(itemrgb) + ')');
            //document.getElementsByClassName("svgobj").item(i).contentDocument.getElementsByClassName('mysvg').item(0).setAttribute('preserveAspectRatio', 'none');
        } catch (err) {}
    }
}

function rgbToHsl(color) {

    var r = parseInt(color.split(',')[0]);
    var g = parseInt(color.split(',')[1]);
    var b = parseInt(color.split(',')[2]);

    var min, max, i, l, s, maxcolor, h, rgb = [];
    rgb[0] = r / 255;
    rgb[1] = g / 255;
    rgb[2] = b / 255;
    min = rgb[0];
    max = rgb[0];
    maxcolor = 0;
    for (i = 0; i < rgb.length - 1; i++) {
        if (rgb[i + 1] <= min) { min = rgb[i + 1]; }
        if (rgb[i + 1] >= max) {
            max = rgb[i + 1];
            maxcolor = i + 1;
        }
    }
    if (maxcolor == 0) {
        h = (rgb[1] - rgb[2]) / (max - min);
    }
    if (maxcolor == 1) {
        h = 2 + (rgb[2] - rgb[0]) / (max - min);
    }
    if (maxcolor == 2) {
        h = 4 + (rgb[0] - rgb[1]) / (max - min);
    }
    if (isNaN(h)) { h = 0; }
    h = h * 60;
    if (h < 0) { h = h + 360; }
    l = (min + max) / 2;
    if (min == max) {
        s = 0;
    } else {
        if (l < 0.5) {
            s = (max - min) / (max + min);
        } else {
            s = (max - min) / (2 - max - min);
        }
    }
    s = s;
    return (h /*+ Math.floor(360 * Math.random()) % 360*/ ) + ',' + Math.floor(s * 100 - (Math.floor(30 * Math.random()))) + '%,' + Math.floor(l * 100 /*- (Math.floor(50 * Math.random()))*/ ) + '%';
}