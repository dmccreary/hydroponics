// Hardware Interface Architecture — p5.js
// CANVAS_HEIGHT: 680
let canvasWidth = 900;
let drawHeight = 540;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let showPins = false;
let pinToggle, resetBtn;

let selected = null;       // { kind: 'component'|'block', protocol: 'GPIO'|..., ref: object }
let asyncPhase = 0;

const PROTOCOLS = {
    GPIO: {
        color: [33, 150, 243], angle: 180,
        desc: 'Digital I/O. Up to 26 pins on Pico.',
        freq: 'DC – 100 MHz',
        maxDevices: '1 per pin',
        classRef: 'machine.Pin',
        snippet: "led = Pin(15, Pin.OUT)\nled.value(1)",
        components: [
            { name: 'Float Switch', pin: '14' },
            { name: 'Relay',        pin: '15' },
            { name: 'LED',          pin: '25' },
            { name: 'Button',       pin: '16' }
        ]
    },
    ADC: {
        color: [255, 152, 0], angle: 135,
        desc: 'Analog-to-Digital. Pico has 3 12-bit ADC channels.',
        freq: 'Up to 500 kS/s',
        maxDevices: '3 analog inputs',
        classRef: 'machine.ADC',
        snippet: "ph_adc = ADC(Pin(26))\nv = ph_adc.read_u16() * 3.3 / 65535",
        components: [
            { name: 'pH Sensor',    pin: '26' },
            { name: 'EC Sensor',    pin: '27' },
            { name: 'Light Sensor', pin: '28' }
        ]
    },
    PWM: {
        color: [156, 39, 176], angle: 225,
        desc: 'Pulse Width Modulation. 16 channels.',
        freq: 'Up to 125 MHz; typ. 1 kHz',
        maxDevices: '16 channels',
        classRef: 'machine.PWM',
        snippet: "pwm = PWM(Pin(15))\npwm.freq(1000)\npwm.duty_u16(32768)",
        components: [
            { name: 'Pump Driver', pin: '15' },
            { name: 'Fan Speed',   pin: '17' },
            { name: 'LED Dimmer',  pin: '19' }
        ]
    },
    I2C: {
        color: [76, 175, 80], angle: 45,
        desc: 'Inter-Integrated Circuit. 2-wire serial bus.',
        freq: '100 kHz – 400 kHz',
        maxDevices: 'Up to 112 devices',
        classRef: 'machine.I2C',
        snippet: "i2c = I2C(0, scl=Pin(1), sda=Pin(0))\ni2c.scan()",
        components: [
            { name: 'SHT31 (T/RH)',  pin: '0/1' },
            { name: 'SCD40 (CO₂)', pin: '0/1' },
            { name: 'OLED Display',  pin: '0/1' },
            { name: 'BME280',        pin: '0/1' }
        ]
    },
    SPI: {
        color: [239, 83, 80], angle: 0,
        desc: 'Serial Peripheral Interface. Fast 4-wire bus.',
        freq: 'Up to 62.5 MHz',
        maxDevices: '1 per chip-select',
        classRef: 'machine.SPI',
        snippet: "spi = SPI(0, baudrate=10000000)\nspi.write(b'\\x01')",
        components: [
            { name: 'SD Card',      pin: '18-21' },
            { name: 'High-Res ADC', pin: '18-21' }
        ]
    },
    UART: {
        color: [0, 188, 212], angle: 315,
        desc: 'Asynchronous serial. 2 UARTs on Pico.',
        freq: 'Up to 921.6 kbaud',
        maxDevices: '2 hardware UARTs',
        classRef: 'machine.UART',
        snippet: "uart = UART(0, baudrate=9600)\nuart.write(b'R\\r')",
        components: [
            { name: 'Atlas pH/EC', pin: '12/13' },
            { name: 'MH-Z19 CO₂', pin: '12/13' },
            { name: 'GPS Module',  pin: '12/13' }
        ]
    }
};

// Central blocks for click detection
const BLOCKS = {
    pico:    { kind: 'block', protocol: 'PICO',  label: 'Raspberry Pi Pico W',
               desc: 'RP2040-based microcontroller with onboard Wi-Fi/Bluetooth. Dual-core ARM Cortex-M0+ at 133 MHz, 264 KB SRAM.',
               freq: '133 MHz', maxDevices: '26 GPIO + 3 ADC',
               classRef: 'machine, network',
               snippet: "import machine\nimport network\nwlan = network.WLAN(network.STA_IF)" },
    asyncio: { kind: 'block', protocol: 'ASYNC', label: 'asyncio Event Loop',
               desc: 'Cooperative multitasking. Tasks await I/O and yield control so sensor reads, network sends, and display updates run concurrently on a single thread.',
               freq: 'Task switch < 1 ms',
               maxDevices: 'Dozens of concurrent tasks',
               classRef: 'uasyncio',
               snippet: "async def read_ph():\n    while True:\n        v = ph_adc.read_u16()\n        await asyncio.sleep(1)" },
    wifi:    { kind: 'block', protocol: 'WIFI',  label: 'Wi-Fi (network)',
               desc: 'Onboard CYW43439 802.11 b/g/n radio. Connects to local AP and exposes a TCP/IP stack for HTTP and MQTT.',
               freq: '2.4 GHz',
               maxDevices: '1 STA + 1 AP',
               classRef: 'network.WLAN',
               snippet: "wlan = network.WLAN(network.STA_IF)\nwlan.active(True)\nwlan.connect(SSID, PASS)" },
    mqtt:    { kind: 'block', protocol: 'MQTT',  label: 'MQTT Broker / HTTP Server',
               desc: 'Remote endpoint receiving sensor telemetry and serving dashboards.',
               freq: 'depends on link',
               maxDevices: 'Thousands of MQTT subscribers',
               classRef: 'umqtt.simple, urequests',
               snippet: "from umqtt.simple import MQTTClient\nc = MQTTClient('pico', 'broker.local')\nc.connect()\nc.publish(b'hydro/ph', b'6.2')" }
};

const ASYNC_TASKS = ['read_ph', 'read_temp', 'read_ec', 'update_display'];

// Computed layout — recomputed on every resize
let layout = {
    cx: 0, cy: 0,
    picoW: 160, picoH: 80,
    lanes: {}, // protocol -> { ex, ey, comps: [{x,y,w,h, ref}] }
    asyncBox: null,
    wifiBox: null,
    mqttBox: null
};

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 950);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    pinToggle = createCheckbox(' Show GPIO pin numbers', false);
    pinToggle.position(12, drawHeight + 8);
    pinToggle.style('font-size', '13px');
    pinToggle.changed(() => { showPins = pinToggle.checked(); });

    resetBtn = createButton('Clear Selection');
    resetBtn.position(220, drawHeight + 8);
    resetBtn.mousePressed(() => { selected = null; });

    computeLayout();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    computeLayout();
}

function computeLayout() {
    layout.cx = width / 2;
    layout.cy = drawHeight / 2 + 10;

    // Central blocks (top: wifi + mqtt; bottom: asyncio)
    const topMqttH = 32, topWifiH = 32, asyncH = 78;
    layout.mqttBox = {
        x: layout.cx - 170, y: 8, w: 340, h: topMqttH,
        ...BLOCKS.mqtt
    };
    layout.wifiBox = {
        x: layout.cx - 110, y: 8 + topMqttH + 22, w: 220, h: topWifiH,
        ...BLOCKS.wifi
    };
    layout.asyncBox = {
        x: layout.cx - 200, y: drawHeight - asyncH - 12, w: 400, h: asyncH,
        ...BLOCKS.asyncio
    };

    // Lane endpoints: radial from Pico center, but constrained inside canvas
    const radius = Math.min(width, drawHeight) * 0.32;
    const compW = 110, compH = 40, compGap = 6;

    layout.lanes = {};
    for (const [name, p] of Object.entries(PROTOCOLS)) {
        const a = radians(p.angle);
        const ex = layout.cx + Math.cos(a) * radius;
        const ey = layout.cy + Math.sin(a) * radius;
        // Place comps as a vertical or horizontal stack perpendicular to angle.
        // We'll lay them out along a perpendicular axis past the label.
        const perp = a + Math.PI / 2;
        const n = p.components.length;
        const totalH = n * compH + (n - 1) * compGap;
        const comps = [];
        for (let i = 0; i < n; i++) {
            const offset = (i - (n - 1) / 2) * (compH + compGap);
            // box anchor past label, offset along perpendicular
            const bx0 = ex + Math.cos(a) * 60 + Math.cos(perp) * offset;
            const by0 = ey + Math.sin(a) * 60 + Math.sin(perp) * offset;
            comps.push({
                x: bx0 - compW / 2, y: by0 - compH / 2,
                w: compW, h: compH,
                cx: bx0, cy: by0,
                protocol: name,
                ref: p.components[i]
            });
        }
        layout.lanes[name] = { ex, ey, comps, labelX: ex, labelY: ey };
    }

    // Clamp comps inside canvas
    for (const lane of Object.values(layout.lanes)) {
        for (const c of lane.comps) {
            if (c.x < 4) c.x = 4;
            if (c.y < 78) c.y = 78;
            if (c.x + c.w > width - 4) c.x = width - 4 - c.w;
            if (c.y + c.h > drawHeight - 95) c.y = drawHeight - 95 - c.h;
            c.cx = c.x + c.w / 2;
            c.cy = c.y + c.h / 2;
        }
    }
}

function draw() {
    background(248, 249, 250);
    asyncPhase = (asyncPhase + 0.01) % 1;

    drawTitle();
    drawTopBlocks();
    drawLanes();
    drawPico();
    drawAsyncBlock();
    drawComponents();
    drawDetailPanel();
}

function drawTitle() {
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Hardware Interface Architecture — Pico W Protocols', 12, 6);
    pop();
}

function activeProtocol() {
    if (!selected) return null;
    if (selected.kind === 'component') return selected.protocol;
    return null; // central block selections don't dim lanes
}

function laneAlpha(protocol) {
    if (!selected) return 255;
    if (selected.kind === 'component' && selected.protocol === protocol) return 255;
    if (selected.kind === 'block') return 255;
    return 76; // ~30%
}

function blockAlpha(blockKey) {
    if (!selected) return 255;
    if (selected.kind === 'block' && selected.ref === BLOCKS[blockKey]) return 255;
    return 200;
}

function drawTopBlocks() {
    // Wi-Fi
    drawRoundedBlock(layout.wifiBox, [0, 121, 107], blockAlpha('wifi'),
                     selected && selected.ref === BLOCKS.wifi);
    // MQTT
    drawRoundedBlock(layout.mqttBox, [55, 71, 79], blockAlpha('mqtt'),
                     selected && selected.ref === BLOCKS.mqtt);

    // Arrow Pico -> wifi
    push();
    stroke(46, 125, 50, 200);
    strokeWeight(2);
    const px = layout.cx, py = layout.cy - layout.picoH / 2;
    const wx = layout.cx, wy = layout.wifiBox.y + layout.wifiBox.h;
    line(px, py, wx, wy);
    // arrowhead up
    fill(46, 125, 50);
    noStroke();
    triangle(wx, wy, wx - 5, wy + 8, wx + 5, wy + 8);
    pop();

    // Arrow wifi -> mqtt
    push();
    stroke(0, 121, 107, 220);
    strokeWeight(2);
    const x1 = layout.cx, y1 = layout.wifiBox.y;
    const x2 = layout.cx, y2 = layout.mqttBox.y + layout.mqttBox.h;
    line(x1, y1, x2, y2);
    fill(0, 121, 107);
    noStroke();
    triangle(x2, y2, x2 - 5, y2 + 8, x2 + 5, y2 + 8);
    pop();
}

function drawRoundedBlock(b, color, alpha, isSel) {
    push();
    noStroke();
    fill(color[0], color[1], color[2], alpha);
    rect(b.x, b.y, b.w, b.h, 8);
    if (isSel) {
        stroke(255, 152, 0);
        strokeWeight(3);
        noFill();
        rect(b.x, b.y, b.w, b.h, 8);
    }
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(12);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2);
    pop();
}

function drawLanes() {
    push();
    for (const [name, p] of Object.entries(PROTOCOLS)) {
        const lane = layout.lanes[name];
        const a = laneAlpha(name);
        // Band: thick translucent line from Pico edge to endpoint
        const a0 = radians(p.angle);
        const sx = layout.cx + Math.cos(a0) * (layout.picoW / 2);
        const sy = layout.cy + Math.sin(a0) * (layout.picoH / 2);
        stroke(p.color[0], p.color[1], p.color[2], a);
        strokeWeight(10);
        line(sx, sy, lane.ex, lane.ey);

        // Label box near endpoint
        noStroke();
        fill(p.color[0], p.color[1], p.color[2], a);
        const lw = textWidth(name) + 16;
        rectMode(CENTER);
        rect(lane.ex, lane.ey, lw, 22, 4);
        rectMode(CORNER);
        fill(255, a);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        textSize(12);
        text(name, lane.ex, lane.ey);

        // Thin connector from label to each component box
        stroke(p.color[0], p.color[1], p.color[2], a);
        strokeWeight(1.5);
        for (const c of lane.comps) {
            line(lane.ex, lane.ey, c.cx, c.cy);
        }
    }
    pop();
}

function drawPico() {
    const b = {
        x: layout.cx - layout.picoW / 2,
        y: layout.cy - layout.picoH / 2,
        w: layout.picoW, h: layout.picoH
    };
    const isSel = selected && selected.ref === BLOCKS.pico;
    push();
    noStroke();
    fill(46, 125, 50);
    rect(b.x, b.y, b.w, b.h, 10);
    if (isSel) {
        stroke(255, 152, 0);
        strokeWeight(3);
        noFill();
        rect(b.x, b.y, b.w, b.h, 10);
    }
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(14);
    text('Raspberry Pi', layout.cx, layout.cy - 12);
    text('Pico W', layout.cx, layout.cy + 8);
    textStyle(NORMAL);
    textSize(10);
    fill(200, 230, 201);
    text('RP2040 · 133 MHz', layout.cx, layout.cy + 26);
    pop();
}

function drawAsyncBlock() {
    const b = layout.asyncBox;
    const isSel = selected && selected.ref === BLOCKS.asyncio;
    push();
    noStroke();
    fill(63, 81, 181, blockAlpha('asyncio'));
    rect(b.x, b.y, b.w, b.h, 8);
    if (isSel) {
        stroke(255, 152, 0);
        strokeWeight(3);
        noFill();
        rect(b.x, b.y, b.w, b.h, 8);
    }
    fill(255);
    noStroke();
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(12);
    text('asyncio Event Loop', b.x + b.w / 2, b.y + 6);

    // Task boxes
    const taskW = 80, taskH = 28;
    const gap = (b.w - ASYNC_TASKS.length * taskW) / (ASYNC_TASKS.length + 1);
    const ty = b.y + 32;
    const centers = [];
    for (let i = 0; i < ASYNC_TASKS.length; i++) {
        const tx = b.x + gap + i * (taskW + gap);
        centers.push({ x: tx + taskW / 2, y: ty + taskH / 2 });
        noStroke();
        fill(232, 234, 246);
        rect(tx, ty, taskW, taskH, 4);
        fill(40);
        textAlign(CENTER, CENTER);
        textStyle(NORMAL);
        textSize(10);
        text(ASYNC_TASKS[i], tx + taskW / 2, ty + taskH / 2);
    }

    // Curved arrows looping between tasks (cooperative scheduling)
    stroke(255, 235, 59, 220);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < centers.length - 1; i++) {
        const a = centers[i], c = centers[i + 1];
        const mx = (a.x + c.x) / 2;
        const my = a.y + 18;
        bezier(a.x + 18, a.y + 6, mx, my, mx, my, c.x - 18, c.y + 6);
    }
    // Wrap-around arrow from last back to first (below)
    const first = centers[0], last = centers[centers.length - 1];
    bezier(last.x, last.y + 14, last.x, last.y + 30,
           first.x, first.y + 30, first.x, first.y + 14);

    // Animated pulse — moving dot along the chain
    const idx = Math.floor(asyncPhase * centers.length) % centers.length;
    const t = (asyncPhase * centers.length) % 1;
    const fromC = centers[idx];
    const toC = centers[(idx + 1) % centers.length];
    const px = lerp(fromC.x, toC.x, t);
    const py = lerp(fromC.y, toC.y, t) + 6;
    noStroke();
    fill(255, 193, 7);
    circle(px, py, 7);
    pop();
}

function drawComponents() {
    push();
    for (const [name, p] of Object.entries(PROTOCOLS)) {
        const lane = layout.lanes[name];
        const a = laneAlpha(name);
        for (const c of lane.comps) {
            const isSel = selected && selected.kind === 'component' && selected.ref === c;
            // Box
            noStroke();
            fill(255, a);
            rect(c.x, c.y, c.w, c.h, 6);
            stroke(p.color[0], p.color[1], p.color[2], a);
            strokeWeight(isSel ? 3 : 2);
            noFill();
            rect(c.x, c.y, c.w, c.h, 6);
            if (isSel) {
                stroke(255, 152, 0);
                strokeWeight(3);
                rect(c.x - 2, c.y - 2, c.w + 4, c.h + 4, 7);
            }
            // Icon: small filled square at left
            noStroke();
            fill(p.color[0], p.color[1], p.color[2], a);
            rect(c.x + 6, c.y + c.h / 2 - 6, 12, 12, 2);
            // Label
            fill(40, 40, 40, a);
            textAlign(LEFT, CENTER);
            textStyle(BOLD);
            textSize(11);
            const lbl = c.ref.name;
            text(lbl, c.x + 24, c.y + (showPins ? c.h / 2 - 6 : c.h / 2));
            if (showPins) {
                textStyle(NORMAL);
                textSize(9);
                fill(p.color[0], p.color[1], p.color[2], a);
                text('GP' + c.ref.pin, c.x + 24, c.y + c.h / 2 + 8);
            }
        }
    }
    pop();
}

function drawDetailPanel() {
    const py = drawHeight + 42;
    const ph = controlHeight - 50;
    push();
    noStroke();
    fill(255);
    rect(10, py, width - 20, ph, 6);
    stroke(222, 226, 230);
    noFill();
    rect(10, py, width - 20, ph, 6);
    pop();

    if (!selected) {
        push();
        fill(108, 117, 125);
        noStroke();
        textSize(12);
        textAlign(LEFT, TOP);
        text('Click any peripheral, the Pico, the asyncio block, Wi-Fi, or MQTT block to inspect its protocol, frequency, MicroPython class, and a code snippet. Toggle the checkbox to see GPIO pin numbers.',
             22, py + 10, width - 44);
        pop();
        return;
    }

    let title, color, desc, freq, maxd, cls, snippet;
    if (selected.kind === 'component') {
        const p = PROTOCOLS[selected.protocol];
        title = selected.ref.name + '  —  ' + selected.protocol;
        color = p.color;
        desc = p.desc;
        freq = p.freq;
        maxd = p.maxDevices;
        cls = p.classRef;
        snippet = p.snippet;
    } else {
        const b = selected.ref;
        title = b.label;
        color = (b === BLOCKS.pico)    ? [46, 125, 50]
              : (b === BLOCKS.asyncio) ? [63, 81, 181]
              : (b === BLOCKS.wifi)    ? [0, 121, 107]
              :                          [55, 71, 79];
        desc = b.desc;
        freq = b.freq;
        maxd = b.maxDevices;
        cls = b.classRef;
        snippet = b.snippet;
    }

    push();
    // Title bar
    noStroke();
    fill(color[0], color[1], color[2]);
    rect(10, py, width - 20, 22, 6);
    fill(255);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(12);
    text(title, 22, py + 11);

    // Two columns: left = description + facts, right = code snippet
    const colSplit = Math.max(360, width * 0.55);
    fill(40);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(11);
    text(desc, 22, py + 30, colSplit - 30);

    textStyle(BOLD);
    text('Frequency:', 22, py + 60);
    text('Max devices:', 22, py + 74);
    text('MicroPython:', 22, py + 88);
    textStyle(NORMAL);
    text(freq, 110, py + 60);
    text(maxd, 110, py + 74);
    text(cls, 110, py + 88);

    // Code snippet box
    const codeX = colSplit + 8;
    const codeW = width - 20 - codeX + 10 - 12;
    noStroke();
    fill(245, 247, 250);
    rect(codeX, py + 30, codeW, 60, 4);
    stroke(222, 226, 230);
    noFill();
    rect(codeX, py + 30, codeW, 60, 4);
    noStroke();
    fill(33);
    textFont('Menlo, Consolas, monospace');
    textSize(10);
    textAlign(LEFT, TOP);
    text(snippet, codeX + 6, py + 36, codeW - 12);
    textFont('Segoe UI');
    pop();
}

function pointInRect(mx, my, b) {
    return mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h;
}

function mousePressed() {
    if (mouseY > drawHeight) return;

    // Components
    for (const [name, p] of Object.entries(PROTOCOLS)) {
        const lane = layout.lanes[name];
        for (const c of lane.comps) {
            if (pointInRect(mouseX, mouseY, c)) {
                selected = { kind: 'component', protocol: name, ref: c };
                return;
            }
        }
    }

    // Pico
    const picoB = {
        x: layout.cx - layout.picoW / 2,
        y: layout.cy - layout.picoH / 2,
        w: layout.picoW, h: layout.picoH
    };
    if (pointInRect(mouseX, mouseY, picoB)) {
        selected = { kind: 'block', protocol: 'PICO', ref: BLOCKS.pico };
        return;
    }
    if (pointInRect(mouseX, mouseY, layout.asyncBox)) {
        selected = { kind: 'block', protocol: 'ASYNC', ref: BLOCKS.asyncio };
        return;
    }
    if (pointInRect(mouseX, mouseY, layout.wifiBox)) {
        selected = { kind: 'block', protocol: 'WIFI', ref: BLOCKS.wifi };
        return;
    }
    if (pointInRect(mouseX, mouseY, layout.mqttBox)) {
        selected = { kind: 'block', protocol: 'MQTT', ref: BLOCKS.mqtt };
        return;
    }

    selected = null;
}
