var streams = [];
var symbolSize = 38;
var gap_between_symbols = 0;
var MIN_SPEED = 2;
var MAX_SPEED = 8;
var stream_length_max = 32;
var background_blend_value = 68;
var CLOCK_FONT_SIZE;
var time_now;
var roboto_mono; // font
var time_now_out;

function preload() {
    // Ensure the .ttf or .otf font stored in the assets directory
    // is loaded before setup() and draw() are called
    roboto_mono = loadFont('RobotoMono.ttf');
}

function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);

    var ampm = " AM";

    if (h > 12) {
        h = h - 12;
        ampm = " PM";
    }

    time_now_out = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0') + ampm; //

    // time_now = time_now_out;

    setTimeout(startTime, 1000);
}

function start_kana_glitching() {
    console.log("random kana_char");
    if (round(random(0, 4)) == 0) {
        kana_char = String.fromCharCode(0x30A0 + round(random(0, 96)));


        var spot = round(random(0, time_now_out.length));

        time_now = String(time_now_out.substring(0, spot) + kana_char + time_now_out.substring(spot + 1, time_now_out.length));
        setTimeout(start_kana_glitching, 125);
    }
    else {
        time_now = time_now_out;
        setTimeout(start_kana_glitching, round(random(200, 800)));
    }
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
    CLOCK_FONT_SIZE = window.innerWidth / 10;

    startTime();
    start_kana_glitching();
}

function keyPressed() {
    if (keyCode == 32) {
        console.log("SPACEBAR");
        // change color?

    }
}

function draw() {
    background(0, background_blend_value);
    streams.forEach(function (stream) {
        stream.render();
    });
    textSize(CLOCK_FONT_SIZE);

    drawingContext.shadowColor = color(0, 70, 18);
    drawingContext.shadowBlur = 100;
    textStyle(BOLD);
    fill(0, 90, 0);
    text(time_now, (width / 2), (height / 2) - 0);

    drawingContext.shadowColor = color(0, 0, 0);
    drawingContext.shadowBlur = 0;
    textStyle(BOLD);
    fill(10, 0, 10);
    text(time_now, (width / 2), (height / 2) - 0);
    textAlign(CENTER);
    textSize(symbolSize);
    textStyle(NORMAL);
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
