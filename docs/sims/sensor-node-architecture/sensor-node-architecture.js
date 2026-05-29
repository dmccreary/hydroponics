// Sensor Node Architecture — p5.js
// CANVAS_HEIGHT: 660
let canvasWidth = 900;
let drawHeight = 520;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let showPowerRails = false;
let showSignalPath = false;
let railsCheckbox, signalCheckbox, resetBtn;

let components = [];
let layers = [];
let rails = [];
let hoveredComp = null;
let selectedComp = null;

let signalPhase = 0;
let signalPath = []; // ordered list of component ids defining the signal path

// Palette
const GREEN = [46, 125, 50];
const TEAL = [0, 188, 212];
const ORANGE = [255, 152, 0];
const BG = [248, 249, 250];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 960);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    railsCheckbox = createCheckbox(' Show Power Rails', false);
    railsCheckbox.position(10, drawHeight + 8);
    railsCheckbox.style('font-size', '12px');
    railsCheckbox.changed(() => { showPowerRails = railsCheckbox.checked(); });

    signalCheckbox = createCheckbox(' Show Signal Path', false);
    signalCheckbox.position(170, drawHeight + 8);
    signalCheckbox.style('font-size', '12px');
    signalCheckbox.changed(() => { showSignalPath = signalCheckbox.checked(); });

    resetBtn = createButton('Reset');
    resetBtn.position(330, drawHeight + 6);
    resetBtn.mousePressed(() => {
        selectedComp = null;
        showPowerRails = false;
        showSignalPath = false;
        railsCheckbox.checked(false);
        signalCheckbox.checked(false);
    });

    defineLayers();
    defineRails();
    defineComponents();
    setupLayout();

    signalPath = ['ph', 'opamp', 'adc', 'pico', 'wifi', 'mqtt'];
}

function defineLayers() {
    // Layers ordered visually top -> bottom in y, but conceptually bottom is sensors.
    // y is computed in setupLayout against drawHeight.
    layers = [
        { id: 'network',   label: 'Network & Outputs',   row: 0 },
        { id: 'mcu',       label: 'Microcontroller',     row: 1 },
        { id: 'signal',    label: 'Signal Conditioning', row: 2 },
        { id: 'sensors',   label: 'Sensors & Actuators', row: 3 }
    ];
}

function defineRails() {
    // Power rails — drawn as horizontal bus lines spanning width.
    rails = [
        { id: '3v3', label: '3.3 V', color: [239, 83, 80] },
        { id: '5v',  label: '5 V',   color: [255, 152,  0] },
        { id: '12v', label: '12 V',  color: [255, 213, 79] },
        { id: 'gnd', label: 'GND',   color: [40, 40, 40] }
    ];
}

function defineComponents() {
    // Logical coordinates use 0..1 along x; setupLayout maps to pixels.
    components = [
        // Layer 4 (bottom) — Sensors & Actuators
        { id: 'ph',    layer: 'sensors', xL: 0.06, label: 'pH electrode',  iface: 'analog',  supply: ['3v3','gnd'],
          accuracy: '±0.1 pH', datasheet: 'Atlas Scientific E201',
          cost: '$25', snippet: 'from machine import ADC, Pin\nadc = ADC(Pin(26))\nv = adc.read_u16() * 3.3 / 65535\nph = 7 + (2.5 - v) / 0.18' },
        { id: 'ds18', layer: 'sensors', xL: 0.20, label: 'DS18B20',        iface: '1-Wire', supply: ['3v3','gnd'],
          accuracy: '±0.5 °C', datasheet: 'Maxim DS18B20',
          cost: '$5', snippet: 'from machine import Pin\nimport onewire, ds18x20\now = onewire.OneWire(Pin(22))\nds = ds18x20.DS18X20(ow)' },
        { id: 'dht22',layer: 'sensors', xL: 0.34, label: 'DHT22',          iface: 'GPIO',    supply: ['3v3','gnd'],
          accuracy: '±2% RH, ±0.5 °C', datasheet: 'Aosong DHT22',
          cost: '$8', snippet: 'from machine import Pin\nimport dht\nd = dht.DHT22(Pin(15))\nd.measure()' },
        { id: 'ec',   layer: 'sensors', xL: 0.48, label: 'EC probe',       iface: 'analog',  supply: ['5v','gnd'],
          accuracy: '±2% FS', datasheet: 'DFRobot Gravity EC',
          cost: '$70', snippet: 'from machine import ADC, Pin\nadc = ADC(Pin(27))\nec = adc.read_u16() * k_ec' },
        { id: 'co2',  layer: 'sensors', xL: 0.62, label: 'CO₂ NDIR',   iface: 'UART',    supply: ['5v','gnd'],
          accuracy: '±50 ppm', datasheet: 'MH-Z19B',
          cost: '$25', snippet: 'from machine import UART\nuart = UART(0, baudrate=9600)\nuart.write(b"\\xff\\x01\\x86...")' },
        { id: 'float',layer: 'sensors', xL: 0.78, label: 'Float switch',   iface: 'GPIO',    supply: ['3v3','gnd'],
          accuracy: 'digital', datasheet: 'generic reed float',
          cost: '$3', snippet: 'from machine import Pin\nsw = Pin(14, Pin.IN, Pin.PULL_UP)\nlow = sw.value() == 0' },
        { id: 'relay',layer: 'sensors', xL: 0.92, label: 'Relay',          iface: 'GPIO',    supply: ['5v','gnd'],
          accuracy: '10 A mains', datasheet: 'SRD-05VDC-SL-C',
          cost: '$2', snippet: 'from machine import Pin\nrel = Pin(16, Pin.OUT)\nrel.value(1)  # pump ON' },

        // Layer 3 — Signal Conditioning
        { id: 'opamp', layer: 'signal', xL: 0.10, label: 'Op-amp buffer', iface: 'analog',  supply: ['5v','gnd'],
          accuracy: 'Z_in > 1 GΩ', datasheet: 'LMC6482',
          cost: '$2', snippet: '# Hardware op-amp\n# Buffers high-impedance pH probe\n# into low-Z ADC input' },
        { id: 'vdiv',  layer: 'signal', xL: 0.30, label: 'Voltage divider', iface: 'analog', supply: ['3v3','gnd'],
          accuracy: '1% resistors', datasheet: 'R1 / (R1+R2)',
          cost: '$0.10', snippet: '# Scales 0-5 V sensor signal\n# down to 0-3.3 V ADC range\n# V_out = V_in * R2/(R1+R2)' },
        { id: 'adc',   layer: 'signal', xL: 0.52, label: 'ADC MCP3208',   iface: 'SPI',     supply: ['3v3','gnd'],
          accuracy: '12-bit, ±1 LSB', datasheet: 'Microchip MCP3208',
          cost: '$4', snippet: 'from machine import SPI, Pin\nspi = SPI(0, baudrate=1_000_000)\ncs = Pin(17, Pin.OUT)\n# 8-channel external ADC' },
        { id: 'owire', layer: 'signal', xL: 0.74, label: '1-Wire',         iface: '1-Wire',  supply: ['3v3','gnd'],
          accuracy: 'digital', datasheet: '4.7 kΩ pull-up',
          cost: '$0.05', snippet: '# Pull-up resistor on data line\n# allows parasitic-power DS18B20\n# chains on a single GPIO' },

        // Layer 2 — Microcontroller (centered, wide block)
        { id: 'pico', layer: 'mcu', xL: 0.50, label: 'Pico W', iface: 'host MCU', supply: ['3v3','gnd'],
          accuracy: 'RP2040, Wi-Fi', datasheet: 'Raspberry Pi Pico W',
          cost: '$6', snippet: 'import network\nwlan = network.WLAN(network.STA_IF)\nwlan.active(True)\nwlan.connect(SSID, PWD)' },

        // Layer 1 (top) — Network & Outputs
        { id: 'wifi', layer: 'network', xL: 0.12, label: 'Wi-Fi link',  iface: '802.11',  supply: ['3v3','gnd'],
          accuracy: '2.4 GHz', datasheet: 'CYW43439',
          cost: 'integral', snippet: '# Wi-Fi handled by CYW43439\n# on Pico W module\nwlan.isconnected()' },
        { id: 'mqtt', layer: 'network', xL: 0.30, label: 'MQTT Broker', iface: 'TCP/1883',supply: ['—','—'],
          accuracy: 'QoS 0/1/2', datasheet: 'Mosquitto / HiveMQ',
          cost: 'free/self-hosted', snippet: 'from umqtt.simple import MQTTClient\nc = MQTTClient("pico", "broker.local")\nc.connect()\nc.publish(b"hydro/ph", b"6.2")' },
        { id: 'oled', layer: 'network', xL: 0.52, label: 'OLED Display',iface: 'I²C',  supply: ['5v','gnd'],
          accuracy: '128×64', datasheet: 'SSD1306',
          cost: '$5', snippet: 'from machine import I2C, Pin\nimport ssd1306\ni2c = I2C(0, sda=Pin(0), scl=Pin(1))\noled = ssd1306.SSD1306_I2C(128, 64, i2c)' },
        { id: 'lcd',  layer: 'network', xL: 0.72, label: 'LCD',         iface: 'I²C',  supply: ['5v','gnd'],
          accuracy: '16×2 chars', datasheet: 'HD44780 + PCF8574',
          cost: '$4', snippet: 'from lcd_api import LcdApi\nfrom i2c_lcd import I2cLcd\nlcd = I2cLcd(i2c, 0x27, 2, 16)\nlcd.putstr("pH 6.2")' },
        { id: 'npx',  layer: 'network', xL: 0.90, label: 'NeoPixels',   iface: 'GPIO',    supply: ['5v','gnd'],
          accuracy: 'WS2812', datasheet: 'WorldSemi WS2812B',
          cost: '$0.15/px', snippet: 'from neopixel import NeoPixel\nfrom machine import Pin\nnp = NeoPixel(Pin(28), 8)\nnp[0] = (0, 64, 0); np.write()' }
    ];
}

function setupLayout() {
    // Map logical coords to pixel space.
    // Vertical layout: 4 layers with rails between them.
    const topPad = 36;
    const botPad = 24;
    const usableH = drawHeight - topPad - botPad;
    const rowH = usableH / 4;

    // Each layer band y centre
    for (const ly of layers) {
        ly.yc = topPad + ly.row * rowH + rowH / 2;
        ly.yTop = topPad + ly.row * rowH;
        ly.yBot = topPad + (ly.row + 1) * rowH;
    }

    // Rails — placed between layer bands.
    // 3.3V between MCU and Signal; 5V between Signal and Sensors;
    // 12V near top above Network; GND at very bottom under Sensors.
    rails[0].y = (layers.find(l => l.id === 'mcu').yBot + layers.find(l => l.id === 'signal').yTop) / 2;
    rails[1].y = (layers.find(l => l.id === 'signal').yBot + layers.find(l => l.id === 'sensors').yTop) / 2;
    rails[2].y = topPad - 16;
    rails[3].y = drawHeight - botPad / 2 + 4;

    // Component pixel positions
    const leftMargin = 110;
    const rightMargin = 14;
    for (const c of components) {
        const lyr = layers.find(l => l.id === c.layer);
        c.y = lyr.yc;
        c.x = leftMargin + c.xL * (canvasWidth - leftMargin - rightMargin);
        // Box sizing
        if (c.id === 'pico') { c.w = 320; c.h = 70; }
        else { c.w = 96; c.h = 44; }
    }
}

function draw() {
    background(BG[0], BG[1], BG[2]);

    // Recompute layout against current width
    canvasWidth = width;
    setupLayout();

    // Title
    push();
    noStroke();
    fill(GREEN);
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Sensor Node Architecture', 12, 8);
    textStyle(NORMAL);
    fill(108, 117, 125);
    textSize(11);
    text('Hover for specs · click for code · toggle rails / signal path', 12, 26);
    pop();

    drawLayerBands();
    if (showPowerRails) drawPowerRails();
    drawComponents();
    if (showSignalPath) drawSignalPath();
    drawControlBackground();
    drawDetailPanel();
    drawTooltip();
}

function drawLayerBands() {
    push();
    noStroke();
    for (const ly of layers) {
        // Alternating subtle band
        fill(ly.row % 2 === 0 ? 235 : 245, ly.row % 2 === 0 ? 245 : 250, 247);
        rect(0, ly.yTop, width, ly.yBot - ly.yTop);
    }
    // Layer labels on left
    fill(GREEN);
    textSize(10);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    for (const ly of layers) {
        // Wrap label into stacked text if too wide
        text(ly.label, 6, ly.yc - 6);
    }
    pop();
}

function drawPowerRails() {
    push();
    for (const r of rails) {
        stroke(r.color[0], r.color[1], r.color[2], 220);
        strokeWeight(2.5);
        line(100, r.y, width - 8, r.y);
        noStroke();
        fill(r.color[0], r.color[1], r.color[2]);
        textSize(10);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text(r.label, 64, r.y);
    }
    // Connections from each component to its rails
    strokeWeight(1);
    for (const c of components) {
        for (const sid of c.supply) {
            const r = rails.find(rl => rl.id === sid);
            if (!r) continue;
            stroke(r.color[0], r.color[1], r.color[2], 170);
            // vertical drop from component to rail
            line(c.x, c.y, c.x, r.y);
        }
    }
    pop();
}

function drawComponents() {
    hoveredComp = null;
    for (const c of components) {
        const isHover = pointInBox(mouseX, mouseY, c.x - c.w/2, c.y - c.h/2, c.w, c.h);
        const isSel = selectedComp && selectedComp.id === c.id;
        if (isHover && mouseY < drawHeight) hoveredComp = c;

        push();
        // Card
        if (isSel) {
            stroke(ORANGE);
            strokeWeight(3);
        } else if (isHover) {
            stroke(TEAL);
            strokeWeight(2);
        } else {
            stroke(120);
            strokeWeight(1);
        }
        fill(c.id === 'pico' ? color(220, 237, 200) : color(255));
        rect(c.x - c.w/2, c.y - c.h/2, c.w, c.h, 6);
        pop();

        // Label
        push();
        noStroke();
        fill(33);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        textSize(c.id === 'pico' ? 13 : 10.5);
        text(c.label, c.x, c.y - (c.id === 'pico' ? 18 : 6));
        textStyle(NORMAL);
        textSize(c.id === 'pico' ? 10 : 9);
        fill(70);
        text(c.iface, c.x, c.y + (c.id === 'pico' ? 0 : 8));
        pop();

        if (c.id === 'pico') drawPicoDetails(c);
    }
}

function drawPicoDetails(c) {
    push();
    // Pin labels arranged inside the Pico box
    noStroke();
    fill(46, 125, 50);
    textSize(8.5);
    textAlign(LEFT, CENTER);
    const left = c.x - c.w/2 + 8;
    const right = c.x + c.w/2 - 8;
    const ymid = c.y + 8;
    text('ADC0/1/2', left, ymid + 8);
    text('I²C0 (0/1)', left + 78, ymid + 8);
    text('SPI0', left + 160, ymid + 8);
    textAlign(RIGHT, CENTER);
    text('UART0 (12/13)', right, ymid + 8);
    text('GPIO 14–25', right, ymid + 20);

    // Wi-Fi antenna icon (top-right)
    stroke(TEAL);
    strokeWeight(1.5);
    noFill();
    const ax = c.x + c.w/2 - 14, ay = c.y - c.h/2 + 12;
    arc(ax, ay, 10, 10, -PI*0.75, -PI*0.25);
    arc(ax, ay, 16, 16, -PI*0.75, -PI*0.25);
    arc(ax, ay, 22, 22, -PI*0.75, -PI*0.25);
    noStroke();
    fill(TEAL);
    ellipse(ax, ay, 3, 3);
    pop();
}

function drawSignalPath() {
    // Build waypoint list from signalPath ids
    const wp = signalPath.map(id => components.find(c => c.id === id)).filter(Boolean);
    if (wp.length < 2) return;

    push();
    stroke(ORANGE);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < wp.length - 1; i++) {
        drawingContext.setLineDash([5, 4]);
        line(wp[i].x, wp[i].y, wp[i+1].x, wp[i+1].y);
    }
    drawingContext.setLineDash([]);
    pop();

    // Animated dot
    signalPhase = (signalPhase + 0.006) % 1;
    const seg = (wp.length - 1);
    const t = signalPhase * seg;
    const i = Math.floor(t);
    const f = t - i;
    const a = wp[i], b = wp[Math.min(i+1, wp.length - 1)];
    const dx = lerp(a.x, b.x, f);
    const dy = lerp(a.y, b.y, f);
    push();
    noStroke();
    fill(255, 152, 0);
    ellipse(dx, dy, 12, 12);
    fill(255, 255, 255, 200);
    ellipse(dx, dy, 5, 5);
    pop();
}

function drawControlBackground() {
    push();
    noStroke();
    fill(255);
    rect(0, drawHeight, width, controlHeight);
    stroke(222, 226, 230);
    line(0, drawHeight, width, drawHeight);
    pop();
}

function drawDetailPanel() {
    const py = drawHeight + 40;
    push();
    noStroke();
    fill(252);
    rect(8, py, width - 16, controlHeight - 48, 4);
    stroke(222, 226, 230);
    noFill();
    rect(8, py, width - 16, controlHeight - 48, 4);
    pop();

    push();
    textAlign(LEFT, TOP);
    if (selectedComp) {
        const c = selectedComp;
        noStroke();
        fill(GREEN);
        textStyle(BOLD);
        textSize(13);
        text(c.label, 16, py + 6);
        textStyle(NORMAL);
        fill(70);
        textSize(11);
        text('Interface: ' + c.iface + '  ·  Supply: ' + c.supply.join(' / ') +
             '  ·  Accuracy: ' + c.accuracy + '  ·  Cost: ' + c.cost, 16, py + 24);
        fill(0, 90, 160);
        text('Datasheet: ' + c.datasheet, 16, py + 40);

        // Snippet box on right
        const sx = Math.max(280, width * 0.45);
        fill(245, 250, 245);
        noStroke();
        rect(sx, py + 4, width - sx - 12, controlHeight - 56, 4);
        fill(33);
        textFont('Menlo');
        textSize(10);
        text(c.snippet, sx + 8, py + 8, width - sx - 24, controlHeight - 64);
        textFont('Segoe UI');
    } else {
        noStroke();
        fill(108, 117, 125);
        textSize(11);
        text('Click any component to see its datasheet, cost, and a MicroPython snippet.', 16, py + 10);
    }
    pop();
}

function drawTooltip() {
    if (!hoveredComp) return;
    const c = hoveredComp;
    const lines = [
        c.label,
        'Interface: ' + c.iface,
        'Supply: ' + c.supply.join(' / '),
        'Accuracy: ' + c.accuracy
    ];
    push();
    textSize(10.5);
    let tw = 0;
    for (const l of lines) tw = Math.max(tw, textWidth(l));
    const pad = 6;
    const w = tw + pad * 2;
    const h = lines.length * 14 + pad * 2;
    let tx = mouseX + 14;
    let ty = mouseY + 14;
    if (tx + w > width) tx = mouseX - w - 8;
    if (ty + h > drawHeight) ty = mouseY - h - 8;
    noStroke();
    fill(33, 33, 33, 235);
    rect(tx, ty, w, h, 4);
    fill(255);
    textAlign(LEFT, TOP);
    for (let i = 0; i < lines.length; i++) {
        if (i === 0) { textStyle(BOLD); } else { textStyle(NORMAL); }
        text(lines[i], tx + pad, ty + pad + i * 14);
    }
    textStyle(NORMAL);
    pop();
}

function mousePressed() {
    if (mouseY > drawHeight) return;
    for (const c of components) {
        if (pointInBox(mouseX, mouseY, c.x - c.w/2, c.y - c.h/2, c.w, c.h)) {
            selectedComp = c;
            return;
        }
    }
    selectedComp = null;
}

function pointInBox(px, py, x, y, w, h) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    setupLayout();
}
