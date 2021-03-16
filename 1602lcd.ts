//%color=#330aff icon="\uf26c"
namespace Lcd {
    let rspin = DigitalPin.P3;
    let eblpin = DigitalPin.P1;
    let datapins = [
        DigitalPin.P8,
        DigitalPin.P12,
        DigitalPin.P2,
        DigitalPin.P13
    ];
    let _cleardsp = 0x01;
    let _rthome = 0x02;
    let _modeset = 0x04;
    let _dspcont = 0x08;
    let _shiftcur = 0x10;
    let _funcset = 0x20;
    let _setcgram = 0x40;
    let _setddram = 0x80;

    let _entryright = 0x00;
    let _entryleft = 0x02;
    let _entshiftincr = 0x01;
    let _entshiftdcr = 0x00;

    let _dspon = 0x04;
    let _dspoff = 0x00;
    let _curon = 0x02;
    let _curoff = 0x00;
    let _bnkon = 0x01;
    let _bnkoff = 0x00;

    let _dspmove = 0x08;
    let _curmove = 0x00;
    let _moveright = 0x04;
    let _moveleft = 0x00;

    let _eightbits = 0x10;
    let _fourbits = 0x00;
    let _twoline = 0x08;
    let _oneline = 0x00;
    let _5x10dots = 0x04;
    let _5x8dots = 0x00;

    //%block="enable LCD interface"
    export function initDisplay () {
        basic.pause(50);
        pins.digitalWritePin(rspin, 0);
        pins.digitalWritePin(eblpin, 0);
        write4bits(0x03);
        basic.pause(5);
        write4bits(0x03);
        basic.pause(5);
        write4bits(0x03);
        basic.pause(2);
        write4bits(0x02);
        send(_funcset | 0x08, 0);
        basic.pause(5);
        send(_funcset | 0x08, 0);
        basic.pause(2);
        send(_funcset | 0x08, 0);
        basic.pause(2);
        send(_funcset | 0x08, 0);
        basic.pause(2);
        send(_dspcont | _dspon | _curoff | _bnkoff, 0);
        clear();
        send(_modeset | _entryleft | _entshiftdcr, 0);
    }

    //%block="clear LCD"
    export function clear() {
        send(_cleardsp, 0);
        basic.pause(2);
    }

    function home() {
        send(_rthome, 0);
        basic.pause(2);
    }

    function setCursor(col:number, row:number) {
        let orpart = col;
        if(row > 0) {
            orpart = orpart + 0x40;
        }
        send(_setddram | orpart, 0);
    }

    function displayText(text: string) {
        for(let i = 0; i < text.length; i++) {
            send(text[i].charCodeAt(0), 1);
        }
    }

    function send(value: number, mode: number) {
        pins.digitalWritePin(rspin, mode);
        write4bits(value>>4);
        write4bits(value);
    }

    function pulse() {
        pins.digitalWritePin(eblpin, 0);
        basic.pause(1);
        pins.digitalWritePin(eblpin, 1);
        basic.pause(1);
        pins.digitalWritePin(eblpin, 0);
        basic.pause(1);
    }

    function write4bits(value: number) {
        for(let i = 0; i < 4; i++) {
            pins.digitalWritePin(datapins[i], (value>>i) & 0x01);
        }
        pulse();
    }

    /**
     * Display text on the LCD display
     * @param text to display on screen, eg: "Hello LCD"
     * @param x position or col, eg: 0
     * @param y position or row, eg: 0
     */
    //%block="display text %text x %x y %y"
    export function showText(text: string, x: number, y: number) {
        setCursor(x, y);
        displayText(text);
    }
}