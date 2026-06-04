// IoT Data Flow — p5.js
// CANVAS_HEIGHT: 620
let canvasWidth = 900;
let drawHeight = 480;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let showProtocols = false;
let showWatchdog = false;
let protocolsBtn, watchdogBtn, resetBtn;

let paused = false;
let selectedNode = null;

// Animation
let segmentIndex = 0;       // which arrow segment the packet is currently on
let segmentProgress = 0;    // 0..1 along the segment
let pauseTimer = 0;         // pause between full cycles
let currentReading = '';    // text on the moving packet
let isAlarm = false;        // whether this cycle is an alarm

// Watchdog
let watchdogStartFrame = 0;
let wdtResetFrame = -1;     // when reset flashed; -1 = not active

// Layout in logical 900x480 space — scaled at draw time
const LW = 900;
const LH = 480;

// Nodes
let nodes = {};
// Sequence of "hops" the packet follows in normal mode
let hops = [];
// Alarm sequence (adds telegram leg)
let hopsAlarm = [];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 950);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    protocolsBtn = createButton('Show Protocols');
    protocolsBtn.position(10, drawHeight + 10);
    protocolsBtn.mousePressed(() => {
        showProtocols = !showProtocols;
        protocolsBtn.html(showProtocols ? 'Hide Protocols' : 'Show Protocols');
    });

    watchdogBtn = createButton('Show Watchdog');
    watchdogBtn.position(140, drawHeight + 10);
    watchdogBtn.mousePressed(() => {
        showWatchdog = !showWatchdog;
        watchdogStartFrame = frameCount;
        wdtResetFrame = -1;
        watchdogBtn.html(showWatchdog ? 'Hide Watchdog' : 'Show Watchdog');
    });

    resetBtn = createButton('Reset');
    resetBtn.position(270, drawHeight + 10);
    resetBtn.mousePressed(() => {
        selectedNode = null;
        paused = false;
        segmentIndex = 0;
        segmentProgress = 0;
        pauseTimer = 0;
        showProtocols = false;
        showWatchdog = false;
        protocolsBtn.html('Show Protocols');
        watchdogBtn.html('Show Watchdog');
        watchdogStartFrame = frameCount;
        wdtResetFrame = -1;
        nextReading();
    });

    defineNodes();
    nextReading();
}

function defineNodes() {
    // Logical coordinates (will be scaled by sx/sy)
    nodes = {
        sensor: {
            id: 'sensor', label: 'Sensor Node',
            x: 20, y: 90, w: 180, h: 300,
            color: [200, 230, 201],
            detail: 'MicroPython on Raspberry Pi Pico W; publishes via umqtt.simple library every 60 s.',
            code: 'from umqtt.simple import MQTTClient\nc = MQTTClient("pico1", "192.168.1.10")\nc.connect()\nc.publish(b"farm/zone1/sensors/raw",\n          b\'{"ph":6.2,"ec":1.8}\')',
            sensors: [
                { name: 'Temp (DS18B20)',   col: [239, 83, 80]   },
                { name: 'pH (Atlas)',       col: [126, 87, 194]  },
                { name: 'EC (Atlas)',       col: [255, 152, 0]   },
                { name: 'Humidity (DHT22)', col: [66, 165, 245]  },
                { name: 'Flow (pulse)',     col: [38, 166, 154]  }
            ]
        },
        wifi: {
            id: 'wifi', label: 'Wi-Fi Router',
            x: 290, y: 90, w: 140, h: 60,
            color: [187, 222, 251],
            detail: 'TCP/IP transport, port 1883 carries MQTT between the Pico W and the broker.',
            code: '# Router: 192.168.1.1\n# MQTT broker: 192.168.1.10:1883\n# Pico W joins WPA2 SSID "farm-net"'
        },
        broker: {
            id: 'broker', label: 'MQTT Broker',
            x: 280, y: 190, w: 200, h: 220,
            color: [178, 223, 219],
            sublabel: '(Mosquitto)',
            detail: 'Mosquitto on a Raspberry Pi 4. Pub/sub topic matching uses `+` (single level) and `#` (multi level) wildcards.',
            code: '# /etc/mosquitto/mosquitto.conf\nlistener 1883\nallow_anonymous false\npassword_file /etc/mosquitto/pw',
            topics: [
                'farm/zone1/sensors/raw',
                'farm/+/sensors/+',
                'farm/+/alarms/#',
                'farm/zone1/ota/firmware'
            ]
        },
        dashboard: {
            id: 'dashboard', label: 'Dashboard',
            x: 560, y: 80, w: 180, h: 60,
            color: [255, 224, 130],
            detail: 'Grafana or a custom React app; subscribes to all sensor topics for live charts.',
            code: '// React + MQTT.js\nclient.subscribe("farm/zone1/sensors/#");\nclient.on("message", (t, m) => updateChart(t, m));'
        },
        influx: {
            id: 'influx', label: 'InfluxDB',
            x: 560, y: 170, w: 180, h: 60,
            color: [197, 202, 233],
            detail: 'Time-series database; stores readings indefinitely for long-term analysis and dashboards.',
            code: '# Telegraf -> InfluxDB\n[[inputs.mqtt_consumer]]\n  servers = ["tcp://192.168.1.10:1883"]\n  topics  = ["farm/+/sensors/+"]'
        },
        telegram: {
            id: 'telegram', label: 'Telegram Alert Bot',
            x: 560, y: 260, w: 180, h: 60,
            color: [255, 204, 188],
            detail: 'Python script using python-telegram-bot; subscribes to alarm topics and pushes alerts to your phone.',
            code: 'import paho.mqtt.client as mqtt\nfrom telegram import Bot\nbot = Bot(TOKEN)\ndef on_msg(c, u, m):\n    bot.send_message(CHAT, m.payload)'
        },
        ota: {
            id: 'ota', label: 'OTA Update Server',
            x: 560, y: 350, w: 180, h: 60,
            color: [255, 245, 157],
            detail: 'Holds new firmware (.uf2 or .py); publishes to ota/firmware to trigger an update on the Pico W.',
            code: 'mosquitto_pub -h broker \\\n  -t farm/zone1/ota/firmware \\\n  -f new_main.py'
        }
    };

    // Each hop: from-node, to-node, topic, protocol, color
    // We attach handles ("from-side"/"to-side") for routing the arrow.
    hops = [
        { from: 'sensor', to: 'wifi',      topic: 'farm/zone1/sensors/raw', proto: 'MQTT/TCP', color: [46, 125, 50] },
        { from: 'wifi',   to: 'broker',    topic: 'farm/zone1/sensors/raw', proto: 'MQTT',     color: [46, 125, 50] },
        { from: 'broker', to: 'dashboard', topic: 'farm/zone1/sensors/#',   proto: 'MQTT',     color: [255, 152, 0] },
        { from: 'broker', to: 'influx',    topic: 'farm/+/sensors/+',       proto: 'MQTT',     color: [0, 188, 212] }
    ];
    hopsAlarm = [
        { from: 'sensor', to: 'wifi',      topic: 'farm/zone1/alarms/ec',  proto: 'MQTT/TCP', color: [211, 47, 47] },
        { from: 'wifi',   to: 'broker',    topic: 'farm/zone1/alarms/ec',  proto: 'MQTT',     color: [211, 47, 47] },
        { from: 'broker', to: 'telegram',  topic: 'farm/+/alarms/#',       proto: 'MQTT',     color: [211, 47, 47] }
    ];
}

function activeHops() {
    return isAlarm ? hopsAlarm : hops;
}

function nextReading() {
    // 1 in 5 chance of alarm
    isAlarm = random() < 0.2;
    if (isAlarm) {
        const which = random(['ec', 'ph', 'temp']);
        currentReading = which.toUpperCase() + ' OUT OF RANGE';
    } else {
        const samples = [
            'ph=6.2', 'ph=5.9', 'ec=1.8 mS', 'ec=2.1 mS',
            'temp=21.4 C', 'hum=58%', 'flow=1.4 L/min'
        ];
        currentReading = random(samples);
    }
    segmentIndex = 0;
    segmentProgress = 0;
    pauseTimer = 0;
}

function draw() {
    background(248, 249, 250);

    const sx = width / LW;
    const sy = drawHeight / LH;

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('IoT Data Flow — Sensors → MQTT Broker → Subscribers', 12, 8);
    pop();

    // Column labels
    drawColumnLabels(sx, sy);

    // Draw arrows first (so nodes paint over the endpoints)
    drawArrow(nodes.sensor, nodes.wifi, sx, sy, 'farm/zone1/sensors/raw', 'every 60 s', false);
    drawArrow(nodes.wifi, nodes.broker, sx, sy, '', '', false);
    drawArrow(nodes.broker, nodes.dashboard, sx, sy, 'farm/zone1/sensors/#', 'subscribe', false);
    drawArrow(nodes.broker, nodes.influx, sx, sy, 'farm/+/sensors/+', '', false);
    drawArrow(nodes.broker, nodes.telegram, sx, sy, 'farm/+/alarms/#', '', false);
    // OTA reverse (OTA -> broker)
    drawArrow(nodes.ota, nodes.broker, sx, sy, 'farm/zone1/ota/firmware', '', true);

    // Nodes
    drawSensorNode(sx, sy);
    drawSimpleNode(nodes.wifi, sx, sy);
    drawBrokerNode(sx, sy);
    drawSimpleNode(nodes.dashboard, sx, sy);
    drawSimpleNode(nodes.influx, sx, sy);
    drawSimpleNode(nodes.telegram, sx, sy);
    drawSimpleNode(nodes.ota, sx, sy);

    // Re-draw topic labels ON TOP of nodes so they aren't covered
    drawArrowLabel(nodes.sensor, nodes.wifi, sx, sy, 'farm/zone1/sensors/raw', 'every 60 s');
    drawArrowLabel(nodes.broker, nodes.dashboard, sx, sy, 'farm/zone1/sensors/#', 'subscribe');
    drawArrowLabel(nodes.broker, nodes.influx, sx, sy, 'farm/+/sensors/+', '');
    drawArrowLabel(nodes.broker, nodes.telegram, sx, sy, 'farm/+/alarms/#', '');
    drawArrowLabel(nodes.ota, nodes.broker, sx, sy, 'farm/zone1/ota/firmware', '');

    // Protocol labels
    if (showProtocols) {
        drawProtocolLabels(sx, sy);
    }

    // Watchdog overlay
    if (showWatchdog) {
        drawWatchdog(sx, sy);
    }

    // Animated packet
    if (!paused) {
        advancePacket();
    }
    drawPacket(sx, sy);

    // Detail panel below
    drawDetailPanel();
}

function drawColumnLabels(sx, sy) {
    push();
    noStroke();
    fill(108, 117, 125);
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('SENSOR NODE',  (20 + 90) * sx,  35 * sy);
    text('NETWORK + BROKER', (280 + 100) * sx, 35 * sy);
    text('SUBSCRIBERS',  (560 + 90) * sx, 35 * sy);
    pop();
}

function drawSensorNode(sx, sy) {
    const n = nodes.sensor;
    const isSel = selectedNode && selectedNode.id === n.id;

    push();
    noStroke();
    fill(n.color[0], n.color[1], n.color[2]);
    rect(n.x * sx, n.y * sy, n.w * sx, n.h * sy, 8);
    stroke(isSel ? 46 : 158, isSel ? 125 : 158, isSel ? 50 : 158);
    strokeWeight(isSel ? 3 : 1);
    noFill();
    rect(n.x * sx, n.y * sy, n.w * sx, n.h * sy, 8);
    pop();

    push();
    noStroke();
    fill(33);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(12);
    text(n.label, (n.x + n.w / 2) * sx, (n.y + 8) * sy);
    textStyle(NORMAL);
    textSize(10);
    fill(100);
    text('Pico W + MicroPython', (n.x + n.w / 2) * sx, (n.y + 24) * sy);
    pop();

    // Sensor list
    for (let i = 0; i < n.sensors.length; i++) {
        const s = n.sensors[i];
        const ry = n.y + 50 + i * 44;
        // dot
        push();
        noStroke();
        fill(s.col[0], s.col[1], s.col[2]);
        circle((n.x + 22) * sx, (ry + 12) * sy, 14 * Math.min(sx, sy));
        // label
        fill(33);
        textAlign(LEFT, CENTER);
        textSize(10);
        text(s.name, (n.x + 38) * sx, (ry + 12) * sy);
        pop();
    }
}

function drawBrokerNode(sx, sy) {
    const n = nodes.broker;
    const isSel = selectedNode && selectedNode.id === n.id;

    push();
    noStroke();
    fill(n.color[0], n.color[1], n.color[2]);
    rect(n.x * sx, n.y * sy, n.w * sx, n.h * sy, 8);
    stroke(isSel ? 46 : 100, isSel ? 125 : 150, isSel ? 50 : 140);
    strokeWeight(isSel ? 3 : 1);
    noFill();
    rect(n.x * sx, n.y * sy, n.w * sx, n.h * sy, 8);
    pop();

    push();
    noStroke();
    fill(33);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(12);
    text(n.label, (n.x + n.w / 2) * sx, (n.y + 10) * sy);
    textStyle(NORMAL);
    textSize(10);
    fill(100);
    text(n.sublabel, (n.x + n.w / 2) * sx, (n.y + 26) * sy);
    pop();

    // Topic list
    push();
    fill(33);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(9);
    textStyle(BOLD);
    text('Topics:', (n.x + 12) * sx, (n.y + 48) * sy);
    textStyle(NORMAL);
    for (let i = 0; i < n.topics.length; i++) {
        text(n.topics[i], (n.x + 12) * sx, (n.y + 64 + i * 16) * sy);
    }
    pop();

    // Wildcard hint
    push();
    fill(108, 117, 125);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(8);
    text('+ = one level   # = multi level', (n.x + 12) * sx, (n.y + n.h - 22) * sy);
    pop();
}

function drawSimpleNode(n, sx, sy) {
    const isSel = selectedNode && selectedNode.id === n.id;
    push();
    noStroke();
    fill(n.color[0], n.color[1], n.color[2]);
    rect(n.x * sx, n.y * sy, n.w * sx, n.h * sy, 8);
    stroke(isSel ? 46 : 158, isSel ? 125 : 158, isSel ? 50 : 158);
    strokeWeight(isSel ? 3 : 1);
    noFill();
    rect(n.x * sx, n.y * sy, n.w * sx, n.h * sy, 8);
    pop();

    push();
    noStroke();
    fill(33);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(12);
    text(n.label, (n.x + n.w / 2) * sx, (n.y + n.h / 2) * sy);
    pop();
}

// Compute logical endpoint for an arrow between two nodes
function endpoints(fromNode, toNode) {
    // Use the right edge of "from" and the left edge of "to" when from.x < to.x
    // Otherwise reverse.
    let x1, y1, x2, y2;
    if (fromNode.x + fromNode.w / 2 < toNode.x + toNode.w / 2) {
        x1 = fromNode.x + fromNode.w;
        y1 = fromNode.y + fromNode.h / 2;
        x2 = toNode.x;
        y2 = toNode.y + toNode.h / 2;
    } else {
        x1 = fromNode.x;
        y1 = fromNode.y + fromNode.h / 2;
        x2 = toNode.x + toNode.w;
        y2 = toNode.y + toNode.h / 2;
    }
    return { x1, y1, x2, y2 };
}

function drawArrow(fromNode, toNode, sx, sy, topic, sublabel, isReverse) {
    const e = endpoints(fromNode, toNode);
    const x1 = e.x1 * sx, y1 = e.y1 * sy;
    const x2 = e.x2 * sx, y2 = e.y2 * sy;

    push();
    stroke(120);
    strokeWeight(1.5);
    line(x1, y1, x2, y2);
    // arrowhead at x2,y2
    const ang = atan2(y2 - y1, x2 - x1);
    translate(x2, y2);
    rotate(ang);
    fill(120);
    noStroke();
    triangle(0, 0, -9, -5, -9, 5);
    pop();

    // Topic label near midpoint, slightly above the line
    if (topic) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        push();
        noStroke();
        // background pill
        textSize(10);
        const tw = textWidth(topic);
        fill(255, 255, 255, 230);
        rect(mx - tw / 2 - 4, my - 18, tw + 8, 14, 3);
        fill(46, 125, 50);
        textAlign(CENTER, CENTER);
        text(topic, mx, my - 11);
        if (sublabel) {
            fill(108, 117, 125);
            textSize(9);
            text(sublabel, mx, my + 8);
        }
        pop();
    }
}

function drawArrowLabel(fromNode, toNode, sx, sy, topic, sublabel) {
    if (!topic) return;
    const e = endpoints(fromNode, toNode);
    const x1 = e.x1 * sx, y1 = e.y1 * sy;
    const x2 = e.x2 * sx, y2 = e.y2 * sy;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    push();
    noStroke();
    textSize(10);
    const tw = textWidth(topic);
    fill(255, 255, 255, 235);
    rect(mx - tw / 2 - 4, my - 18, tw + 8, 14, 3);
    fill(46, 125, 50);
    textAlign(CENTER, CENTER);
    text(topic, mx, my - 11);
    if (sublabel) {
        fill(255, 255, 255, 235);
        const sw = textWidth(sublabel);
        textSize(9);
        rect(mx - sw / 2 - 4, my + 2, sw + 8, 12, 3);
        fill(108, 117, 125);
        text(sublabel, mx, my + 8);
    }
    pop();
}

function drawProtocolLabels(sx, sy) {
    const labelAt = (fromNode, toNode, proto) => {
        const e = endpoints(fromNode, toNode);
        const mx = (e.x1 + e.x2) / 2 * sx;
        const my = (e.y1 + e.y2) / 2 * sy;
        push();
        noStroke();
        fill(0, 188, 212);
        textSize(9);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        // small pill above
        const tw = textWidth(proto);
        fill(225, 247, 250);
        rect(mx - tw / 2 - 4, my + 4, tw + 8, 13, 3);
        fill(0, 131, 143);
        text(proto, mx, my + 11);
        pop();
    };
    labelAt(nodes.sensor, nodes.wifi, 'TCP/IP');
    labelAt(nodes.wifi, nodes.broker, 'MQTT');
    labelAt(nodes.broker, nodes.dashboard, 'MQTT');
    labelAt(nodes.broker, nodes.influx, 'MQTT');
    labelAt(nodes.broker, nodes.telegram, 'MQTT');
    labelAt(nodes.ota, nodes.broker, 'HTTP');
}

function drawWatchdog(sx, sy) {
    const n = nodes.sensor;
    const period = 30 * 60; // 30 seconds at 60 fps
    const elapsed = (frameCount - watchdogStartFrame) % period;
    const remaining = Math.ceil((period - elapsed) / 60);
    const justReset = elapsed < 60; // 1s flash window after wrap

    // Outer highlight around sensor node
    push();
    noFill();
    stroke(255, 152, 0);
    strokeWeight(3);
    rect((n.x - 4) * sx, (n.y - 4) * sy, (n.w + 8) * sx, (n.h + 8) * sy, 10);
    pop();

    // Countdown badge top-right of sensor node
    push();
    noStroke();
    fill(255, 152, 0);
    const bx = (n.x + n.w - 60) * sx;
    const by = (n.y + 6) * sy;
    rect(bx, by, 54 * sx, 22, 4);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text('WDT ' + remaining + 's', bx + 27 * sx, by + 11);
    pop();

    // WDT reset flash
    if (justReset) {
        push();
        noStroke();
        fill(211, 47, 47, 180);
        rect(n.x * sx, n.y * sy, n.w * sx, n.h * sy, 8);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        textStyle(BOLD);
        text('WDT RESET', (n.x + n.w / 2) * sx, (n.y + n.h / 2) * sy);
        pop();
    }
}

function advancePacket() {
    const hh = activeHops();
    // pause between cycles
    if (pauseTimer > 0) {
        pauseTimer--;
        if (pauseTimer === 0) {
            nextReading();
        }
        return;
    }
    segmentProgress += 0.012;
    if (segmentProgress >= 1) {
        segmentProgress = 0;
        segmentIndex++;
        if (segmentIndex >= hh.length) {
            segmentIndex = 0;
            pauseTimer = 60; // 1 second
        }
    }
}

function drawPacket(sx, sy) {
    const hh = activeHops();
    if (segmentIndex >= hh.length) return;
    if (pauseTimer > 0) return;
    const hop = hh[segmentIndex];
    const e = endpoints(nodes[hop.from], nodes[hop.to]);
    const x = lerp(e.x1, e.x2, segmentProgress) * sx;
    const y = lerp(e.y1, e.y2, segmentProgress) * sy;

    // Packet dot
    push();
    noStroke();
    fill(hop.color[0], hop.color[1], hop.color[2]);
    circle(x, y, 14);
    fill(255);
    stroke(hop.color[0], hop.color[1], hop.color[2]);
    strokeWeight(2);
    noFill();
    circle(x, y, 18);
    pop();

    // Floating label
    push();
    noStroke();
    textSize(10);
    textStyle(BOLD);
    const lbl = currentReading;
    const tw = textWidth(lbl);
    fill(255);
    stroke(hop.color[0], hop.color[1], hop.color[2]);
    strokeWeight(1);
    rect(x + 10, y - 22, tw + 10, 16, 3);
    noStroke();
    fill(hop.color[0], hop.color[1], hop.color[2]);
    textAlign(LEFT, CENTER);
    text(lbl, x + 15, y - 14);
    pop();
}

function drawDetailPanel() {
    const py = drawHeight + 50;
    push();
    noStroke();
    fill(255);
    rect(10, py, width - 20, controlHeight - 60, 4);
    stroke(222, 226, 230);
    noFill();
    rect(10, py, width - 20, controlHeight - 60, 4);
    pop();

    push();
    fill(33);
    noStroke();
    textAlign(LEFT, TOP);
    if (selectedNode) {
        textStyle(BOLD);
        fill(46, 125, 50);
        textSize(12);
        text(selectedNode.label + (selectedNode.sublabel ? ' ' + selectedNode.sublabel : ''), 20, py + 6);
        textStyle(NORMAL);
        fill(33);
        textSize(11);
        text(selectedNode.detail, 20, py + 24, width - 40);
        // code snippet on the right side
        const codeX = Math.max(20, width * 0.5);
        textStyle(BOLD);
        fill(108, 117, 125);
        textSize(10);
        text('Code snippet', codeX, py + 6);
        textStyle(NORMAL);
        fill(33);
        textSize(10);
        // monospace via textFont
        push();
        textFont('Menlo, Consolas, monospace');
        text(selectedNode.code, codeX, py + 22, width - codeX - 20);
        pop();
    } else {
        fill(108, 117, 125);
        textSize(11);
        text('Click any node to pause the animation and see what runs there + a code snippet. Click the background to resume.', 20, py + 12, width - 40);
        textSize(10);
        text('Toggle "Show Protocols" to label each link with its transport. Toggle "Show Watchdog" to see the 30-second WDT countdown on the sensor node.', 20, py + 36, width - 40);
    }
    pop();
}

function mousePressed() {
    if (mouseY > drawHeight) return;
    const sx = width / LW;
    const sy = drawHeight / LH;
    const ids = ['sensor', 'wifi', 'broker', 'dashboard', 'influx', 'telegram', 'ota'];
    for (const id of ids) {
        const n = nodes[id];
        if (mouseX >= n.x * sx && mouseX <= (n.x + n.w) * sx &&
            mouseY >= n.y * sy && mouseY <= (n.y + n.h) * sy) {
            selectedNode = n;
            paused = true;
            return;
        }
    }
    selectedNode = null;
    paused = false;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
