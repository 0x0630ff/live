var streams = [];
var symbolSize = 24;
var gap_between_symbols = 0;
var MIN_SPEED = 1;
var MAX_SPEED = 6;
var stream_length_max = 64;
var background_blend_value = 62

// function windowResized() {
// var last_leng = streams.length;
// resizeCanvas(windowWidth, windowHeight);
// console.log("NEW WINDOW SIZE");
// console.log(streams.length)
// streams.length = round(width / symbolSize);
// var x = 0;
// var y = 0;
// streams.forEach(function (stream) {
//     stream.generateSymbols(x, y);
// });
// for (var i = 0; i <= streams.length; i++) {
//     // var stream = new kStream();
//     stream.generateSymbols(x, y);
//     streams.push(stream);
//     x += symbolSize + gap_between_symbols;
// }
// }

var time_now;

function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    // document.getElementById('txt').innerHTML = h + ":" + m + ":" + s;
    time_now = h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function setup() {
    createCanvas(
        window.innerWidth,
        window.innerHeight
    );
    background(0);

    textSize(symbolSize);

    var x = 0;
    var y = 0;
    // create the new streams
    for (var i = 0; i <= width / symbolSize; i++) {
        var stream = new kStream();
        stream.generateSymbols(x, y);
        streams.push(stream);
        x += symbolSize + gap_between_symbols;
    }
    startTime();
}

function keyPressed() {
    if (keyCode == 32) {
        console.log("SPACEBAR");
        // change color?

        // var fs = fullscreen();
        // fullscreen(!fs);
        // resizeCanvas(window.innerWidth, window.innerHeight, true);
    }
}

function draw() {
    background(0, background_blend_value);
    streams.forEach(function (stream) {
        stream.render();
    });
    textSize(280);
    fill(0, 0, 0);
    text(time_now, (width / 2), (height / 2) + 10);
    // text("WAKE UP", (width / 2), (height / 2) - 0);
    // text("NEO", (width / 2), (height / 2) + 600);
    textAlign(CENTER);
    textSize(symbolSize);
}

// symbol for kana
function kSymbol(x, y, speed, first) {
    this.x = x;
    this.y = y;
    this.value;
    this.speed = speed;
    this.switchInterval = round(random(8, 12));
    this.first = first;

    this.setToRandomSymbol = function () {
        if (frameCount % this.switchInterval == 0) {
            this.value = String.fromCharCode(
                0x30A0 + round(random(0, 96))
            );
            this.switchInterval = round(random(2, 20));
        }
    }

    this.rain = function () {
        this.y = (this.y >= height) ? 0 : this.y += this.speed;
    }
}

// stream for kana
function kStream() {
    this.symbols = [];
    this.totalSymbols = round(random(5, random(30, stream_length_max)));
    this.speed = random(MIN_SPEED, MAX_SPEED);

    this.generateSymbols = function (x, y) {
        var first = round(random(0, 3)) == 0;
        for (var i = 0; i < this.totalSymbols; i++) {
            symbol = new kSymbol(x, y, this.speed, first);
            symbol.setToRandomSymbol();
            this.symbols.push(symbol);
            y -= symbolSize;
            first = false;
        }
    }

    this.render = function () {
        this.symbols.forEach(function (symbol) {
            if (symbol.first == true) {
                fill(190, 205, 199);
                textStyle(BOLD);
            } else {
                fill(0, 200, 30);
                textStyle(NORMAL);
            }
            text(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setToRandomSymbol();
        });
    }
}
