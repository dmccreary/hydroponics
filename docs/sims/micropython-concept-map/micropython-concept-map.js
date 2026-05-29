// MicroPython Concept Map — p5.js
// CANVAS_HEIGHT: 640
let canvasWidth = 900;
let drawHeight = 520;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let showCode = false;
let codeCheckbox, resetBtn;

let selectedNodeId = null;
let hoverNodeId = null;
let hoverEdge = null;

const HIGHLIGHT = [255, 152, 0]; // orange #ff9800
const DIM_ALPHA = 70;            // ~30% opacity

const TIERS = [
    { // Bottom — Hardware
        name: "Hardware & Tools",
        color: [33, 86, 142],
        nodes: [
            { id: "pico",    label: "Raspberry Pi Pico",   snippet: "from machine import Pin\nled = Pin('LED', Pin.OUT)" },
            { id: "picow",   label: "Pico W",              snippet: "import network\nwlan = network.WLAN(network.STA_IF)" },
            { id: "esp32",   label: "ESP32",               snippet: "# ESP32 has Wi-Fi + BT built-in\nimport network" },
            { id: "install", label: "MicroPython Install", snippet: "# Drag .uf2 file to BOOTSEL\n# Pico appears as USB drive" },
            { id: "thonny",  label: "Thonny IDE",          snippet: "# Tools -> Interpreter -> MicroPython (Raspberry Pi Pico)" },
            { id: "repl",    label: "REPL",                snippet: ">>> 2 + 2\n4\n>>> print('hi')\nhi" }
        ]
    },
    { // Language fundamentals
        name: "Language Fundamentals",
        color: [38, 166, 154],
        nodes: [
            { id: "variables", label: "Variables",       snippet: "ph = 6.2\nec = 1.8" },
            { id: "numbers",   label: "Integer / Float", snippet: "count = 10        # int\ntemp = 23.5      # float" },
            { id: "strings",   label: "String",          snippet: "name = 'pH probe'\nprint(f'Reading: {ph}')" },
            { id: "booleans",  label: "Boolean",         snippet: "pump_on = True\nif pump_on: pass" },
            { id: "none",      label: "None",            snippet: "last_reading = None\nif last_reading is None: ..." },
            { id: "lists",     label: "Lists",           snippet: "readings = [6.0, 6.1, 6.2]\nreadings.append(6.3)" },
            { id: "tuples",    label: "Tuples",          snippet: "coord = (3.3, 1)   # voltage, pin\nv, p = coord" },
            { id: "dicts",     label: "Dicts",           snippet: "config = {'ph_pin': 26, 'rate': 60}\nprint(config['ph_pin'])" }
        ]
    },
    { // Control flow & functions
        name: "Control Flow & Functions",
        color: [76, 175, 80],
        nodes: [
            { id: "ifelse",    label: "If / Else",        snippet: "if ph < 5.5:\n    dose_up()\nelse:\n    pass" },
            { id: "forloop",   label: "For Loops",        snippet: "for r in readings:\n    print(r)" },
            { id: "whileloop", label: "While Loops",      snippet: "while pump_on:\n    sleep(1)" },
            { id: "breakcont", label: "Break / Continue", snippet: "for r in readings:\n    if r is None: continue\n    if r > 9: break" },
            { id: "functions", label: "Functions",        snippet: "def avg(values):\n    return sum(values) / len(values)" },
            { id: "defaults",  label: "Default Params",   snippet: "def read(pin, n=10):\n    ..." },
            { id: "lambda",    label: "Lambda",           snippet: "sq = lambda x: x*x\nsq(5)  # 25" }
        ]
    },
    { // Top — OOP
        name: "Object-Oriented Programming",
        color: [255, 179, 0],
        nodes: [
            { id: "classes",     label: "Classes & Objects", snippet: "class PhProbe:\n    def __init__(self, pin):\n        self.pin = pin" },
            { id: "inheritance", label: "Inheritance",       snippet: "class Atlas(PhProbe):\n    def read(self):\n        # I2C protocol\n        ..." }
        ]
    }
];

const EDGES = [
    // hardware -> language
    { from: "repl", to: "variables" },
    { from: "thonny", to: "repl" },
    { from: "install", to: "thonny" },
    { from: "pico", to: "install" },
    { from: "picow", to: "pico" },
    // variables -> other primitive types
    { from: "variables", to: "numbers" },
    { from: "variables", to: "strings" },
    { from: "variables", to: "booleans" },
    { from: "variables", to: "none" },
    // primitives -> collections
    { from: "numbers", to: "lists" },
    { from: "lists", to: "tuples" },
    { from: "lists", to: "dicts" },
    // language -> control flow
    { from: "booleans", to: "ifelse" },
    { from: "lists",    to: "forloop" },
    { from: "booleans", to: "whileloop" },
    { from: "forloop",  to: "breakcont" },
    { from: "whileloop",to: "breakcont" },
    { from: "ifelse",   to: "functions" },
    { from: "functions",to: "defaults" },
    { from: "functions",to: "lambda" },
    // control flow -> OOP
    { from: "functions", to: "classes" },
    { from: "dicts",     to: "classes" },
    { from: "classes",   to: "inheritance" }
];

// Computed at setupLayout
let nodeMap = {};            // id -> {x, y, w, h, tierIdx, label, snippet, color}
let predecessors = {};       // id -> [ids]
let successors = {};         // id -> [ids]

const NODE_W = 120;
const NODE_H = 38;
const LEFT_MARGIN = 110;     // leave room for tier headers

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 920);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    codeCheckbox = createCheckbox(' Show code examples', false);
    codeCheckbox.position(10, drawHeight + 12);
    codeCheckbox.changed(() => { showCode = codeCheckbox.checked(); });

    resetBtn = createButton('Reset');
    resetBtn.position(200, drawHeight + 10);
    resetBtn.mousePressed(() => { selectedNodeId = null; });

    setupLayout();
    buildAdjacency();
}

function setupLayout() {
    nodeMap = {};
    const usableW = width - LEFT_MARGIN - 20;
    // Tiers stacked: index 0 (Hardware) at bottom, last tier at top
    const tierCount = TIERS.length;
    const tierSlotH = drawHeight / tierCount;

    for (let t = 0; t < tierCount; t++) {
        const tier = TIERS[t];
        // bottom tier (t=0) sits at largest y; top tier (t=last) at smallest y
        const rowCenterY = drawHeight - (t + 0.5) * tierSlotH;
        const n = tier.nodes.length;
        // Evenly spaced node centers across usable width
        for (let i = 0; i < n; i++) {
            const frac = (i + 0.5) / n;
            const cx = LEFT_MARGIN + frac * usableW;
            const node = tier.nodes[i];
            nodeMap[node.id] = {
                id: node.id,
                label: node.label,
                snippet: node.snippet,
                tierIdx: t,
                color: tier.color,
                x: cx - NODE_W / 2,
                y: rowCenterY - NODE_H / 2,
                w: NODE_W,
                h: NODE_H,
                cx: cx,
                cy: rowCenterY
            };
        }
    }
}

function buildAdjacency() {
    predecessors = {};
    successors = {};
    for (const id in nodeMap) {
        predecessors[id] = [];
        successors[id] = [];
    }
    for (const e of EDGES) {
        if (successors[e.from]) successors[e.from].push(e.to);
        if (predecessors[e.to]) predecessors[e.to].push(e.from);
    }
}

function highlightedSet() {
    if (!selectedNodeId) return null;
    const set = new Set();
    set.add(selectedNodeId);
    for (const p of predecessors[selectedNodeId] || []) set.add(p);
    for (const s of successors[selectedNodeId] || []) set.add(s);
    return set;
}

function edgeIsHighlighted(e, hSet) {
    if (!hSet) return false;
    return (e.from === selectedNodeId && hSet.has(e.to)) ||
           (e.to === selectedNodeId && hSet.has(e.from));
}

function draw() {
    background(248, 249, 250);

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('MicroPython Concept Map — Hardware to OOP', 12, 6);
    pop();

    drawTierBands();
    drawTierHeaders();

    const hSet = highlightedSet();

    // Detect edge hover (only over arrow midpoints)
    hoverEdge = findHoverEdge();

    // Draw edges first (so nodes sit on top)
    for (const e of EDGES) {
        const a = nodeMap[e.from];
        const b = nodeMap[e.to];
        if (!a || !b) continue;
        const highlighted = edgeIsHighlighted(e, hSet);
        const dim = hSet && !highlighted;
        const isHovered = hoverEdge === e;
        drawArrow(a, b, highlighted, dim, isHovered);
    }

    // Detect hovered node
    hoverNodeId = null;
    if (mouseY < drawHeight) {
        for (const id in nodeMap) {
            const n = nodeMap[id];
            if (mouseX >= n.x && mouseX <= n.x + n.w && mouseY >= n.y && mouseY <= n.y + n.h) {
                hoverNodeId = id;
                break;
            }
        }
    }

    // Draw nodes
    for (const id in nodeMap) {
        const n = nodeMap[id];
        const isSel = id === selectedNodeId;
        const inHighlight = hSet && hSet.has(id);
        const dim = hSet && !inHighlight;
        drawNode(n, isSel, inHighlight, dim);
    }

    // Edge tooltip
    if (hoverEdge) {
        drawEdgeTooltip(hoverEdge);
    }

    // Code snippet popup
    if (showCode && hoverNodeId) {
        drawCodePopup(nodeMap[hoverNodeId]);
    }

    drawInfoPanel();
}

function drawTierBands() {
    push();
    noStroke();
    const tierCount = TIERS.length;
    const tierSlotH = drawHeight / tierCount;
    for (let t = 0; t < tierCount; t++) {
        const tier = TIERS[t];
        const yTop = drawHeight - (t + 1) * tierSlotH;
        // Pale tinted band
        fill(tier.color[0], tier.color[1], tier.color[2], 18);
        rect(0, yTop, width, tierSlotH);
    }
    pop();
}

function drawTierHeaders() {
    push();
    const tierCount = TIERS.length;
    const tierSlotH = drawHeight / tierCount;
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(11);
    for (let t = 0; t < tierCount; t++) {
        const tier = TIERS[t];
        const cy = drawHeight - (t + 0.5) * tierSlotH;
        // Color block
        noStroke();
        fill(tier.color[0], tier.color[1], tier.color[2]);
        rect(6, cy - tierSlotH / 2 + 4, 6, tierSlotH - 8, 2);
        // Label — wrap to two lines if needed
        fill(60);
        const parts = wrapTierLabel(tier.name);
        for (let i = 0; i < parts.length; i++) {
            text(parts[i], 18, cy - (parts.length - 1) * 7 + i * 14);
        }
    }
    pop();
}

function wrapTierLabel(name) {
    // Simple two-line wrap on '&' or space
    if (name.length <= 14) return [name];
    if (name.includes('&')) {
        const idx = name.indexOf('&');
        return [name.slice(0, idx).trim(), name.slice(idx).trim()];
    }
    const mid = Math.floor(name.length / 2);
    const sp = name.lastIndexOf(' ', mid + 6);
    if (sp > 0) return [name.slice(0, sp).trim(), name.slice(sp).trim()];
    return [name];
}

function drawNode(n, isSel, inHighlight, dim) {
    push();
    const c = n.color;
    let alpha = 230;
    if (dim) alpha = DIM_ALPHA;
    if (isSel || (inHighlight && selectedNodeId)) {
        noStroke();
        fill(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 235);
    } else {
        noStroke();
        fill(c[0], c[1], c[2], alpha);
    }
    rect(n.x, n.y, n.w, n.h, 8);

    if (isSel) {
        stroke(33);
        strokeWeight(2);
        noFill();
        rect(n.x, n.y, n.w, n.h, 8);
    } else if (hoverNodeId === n.id) {
        stroke(33);
        strokeWeight(1.2);
        noFill();
        rect(n.x, n.y, n.w, n.h, 8);
    }

    // Label
    noStroke();
    const textAlpha = dim ? 110 : 255;
    // Pick a label color that contrasts the fill
    if (isSel || (inHighlight && selectedNodeId)) {
        fill(33, 33, 33, textAlpha);
    } else {
        // Dark tier (blue) gets white text; lighter tiers get dark text
        if (n.tierIdx === 0) fill(255, 255, 255, textAlpha);
        else fill(33, 33, 33, textAlpha);
    }
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(11);
    text(n.label, n.x + n.w / 2, n.y + n.h / 2);
    pop();
}

function drawArrow(a, b, highlighted, dim, isHovered) {
    // Arrow from top edge of source (a) to bottom edge of target (b)
    // a is lower tier (larger y), b is higher tier (smaller y), so arrow goes up.
    // But edges can be sideways too (variables -> numbers in same tier).
    const sameTier = a.tierIdx === b.tierIdx;

    let x1, y1, x2, y2;
    if (sameTier) {
        // Connect side to side
        if (a.cx < b.cx) {
            x1 = a.x + a.w; y1 = a.cy;
            x2 = b.x;       y2 = b.cy;
        } else {
            x1 = a.x;       y1 = a.cy;
            x2 = b.x + b.w; y2 = b.cy;
        }
    } else if (b.tierIdx > a.tierIdx) {
        // upward: from top of a to bottom of b
        x1 = a.cx; y1 = a.y;
        x2 = b.cx; y2 = b.y + b.h;
    } else {
        // downward
        x1 = a.cx; y1 = a.y + a.h;
        x2 = b.cx; y2 = b.y;
    }

    push();
    let col, weight, alpha;
    if (highlighted || isHovered) {
        col = HIGHLIGHT;
        weight = 2.4;
        alpha = 240;
    } else if (dim) {
        col = [120, 120, 120];
        weight = 1;
        alpha = 60;
    } else {
        col = [120, 130, 140];
        weight = 1.2;
        alpha = 170;
    }
    stroke(col[0], col[1], col[2], alpha);
    strokeWeight(weight);
    noFill();

    // Slight curve so multi-edges don't overlap
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    // Control point: offset perpendicular to the line for a gentle bezier
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const nxp = -dy / len;
    const nyp = dx / len;
    const curveAmt = sameTier ? 0 : Math.min(20, len * 0.08);
    const cx1 = mx + nxp * curveAmt;
    const cy1 = my + nyp * curveAmt;

    bezier(x1, y1, cx1, cy1, cx1, cy1, x2, y2);

    // Arrowhead at (x2,y2) pointing along tangent from control to endpoint
    const tx = x2 - cx1;
    const ty = y2 - cy1;
    const tlen = Math.max(1, Math.sqrt(tx * tx + ty * ty));
    const ux = tx / tlen;
    const uy = ty / tlen;
    const ah = 8;
    const aw = 5;
    const baseX = x2 - ux * ah;
    const baseY = y2 - uy * ah;
    const leftX = baseX + (-uy) * aw;
    const leftY = baseY + ( ux) * aw;
    const rightX = baseX - (-uy) * aw;
    const rightY = baseY - ( ux) * aw;
    noStroke();
    fill(col[0], col[1], col[2], alpha);
    triangle(x2, y2, leftX, leftY, rightX, rightY);
    pop();
}

function findHoverEdge() {
    if (mouseY > drawHeight) return null;
    // Hit-test edges by checking distance from mouse to the arrow midpoint segment.
    let best = null;
    let bestDist = 7; // px tolerance
    for (const e of EDGES) {
        const a = nodeMap[e.from];
        const b = nodeMap[e.to];
        if (!a || !b) continue;
        const sameTier = a.tierIdx === b.tierIdx;
        let x1, y1, x2, y2;
        if (sameTier) {
            if (a.cx < b.cx) { x1 = a.x + a.w; y1 = a.cy; x2 = b.x; y2 = b.cy; }
            else { x1 = a.x; y1 = a.cy; x2 = b.x + b.w; y2 = b.cy; }
        } else if (b.tierIdx > a.tierIdx) {
            x1 = a.cx; y1 = a.y;
            x2 = b.cx; y2 = b.y + b.h;
        } else {
            x1 = a.cx; y1 = a.y + a.h;
            x2 = b.cx; y2 = b.y;
        }
        const d = distPointToSegment(mouseX, mouseY, x1, y1, x2, y2);
        if (d < bestDist) {
            bestDist = d;
            best = e;
        }
    }
    return best;
}

function distPointToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = x1 + t * dx;
    const cy = y1 + t * dy;
    return Math.hypot(px - cx, py - cy);
}

function drawEdgeTooltip(e) {
    const a = nodeMap[e.from];
    const b = nodeMap[e.to];
    const msg = a.label + " enables " + b.label;
    push();
    textSize(11);
    textStyle(NORMAL);
    const padX = 6, padY = 4;
    const tw = textWidth(msg) + padX * 2;
    const th = 18;
    let x = mouseX + 12;
    let y = mouseY - th - 6;
    if (x + tw > width) x = width - tw - 4;
    if (y < 2) y = mouseY + 14;
    noStroke();
    fill(33, 33, 33, 230);
    rect(x, y, tw, th, 4);
    fill(255);
    textAlign(LEFT, CENTER);
    text(msg, x + padX, y + th / 2);
    pop();
}

function drawCodePopup(node) {
    const lines = node.snippet.split('\n');
    push();
    textFont('Consolas, Menlo, monospace');
    textSize(11);
    let maxW = 0;
    for (const l of lines) {
        const w = textWidth(l);
        if (w > maxW) maxW = w;
    }
    const padX = 8, padY = 6;
    const lineH = 14;
    const boxW = maxW + padX * 2;
    const boxH = lines.length * lineH + padY * 2;
    let x = mouseX + 14;
    let y = mouseY + 12;
    if (x + boxW > width - 4) x = mouseX - boxW - 12;
    if (y + boxH > drawHeight - 4) y = drawHeight - boxH - 4;
    if (x < 4) x = 4;
    if (y < 24) y = 24;

    noStroke();
    fill(33, 33, 33, 240);
    rect(x, y, boxW, boxH, 6);
    // Header strip in node color
    fill(node.color[0], node.color[1], node.color[2], 220);
    rect(x, y, boxW, 4, 6);

    fill(245, 245, 245);
    textAlign(LEFT, TOP);
    for (let i = 0; i < lines.length; i++) {
        text(lines[i], x + padX, y + padY + i * lineH);
    }
    pop();
}

function drawInfoPanel() {
    const py = drawHeight + 46;
    push();
    noStroke();
    fill(255);
    rect(10, py, width - 20, controlHeight - 56, 4);
    stroke(222, 226, 230);
    noFill();
    rect(10, py, width - 20, controlHeight - 56, 4);
    pop();

    push();
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);
    if (selectedNodeId) {
        const n = nodeMap[selectedNodeId];
        const preds = (predecessors[selectedNodeId] || []).map(id => nodeMap[id].label).join(', ') || '(none — root concept)';
        const succs = (successors[selectedNodeId] || []).map(id => nodeMap[id].label).join(', ') || '(none — leaf concept)';
        fill(46, 125, 50);
        textStyle(BOLD);
        text(n.label, 20, py + 8);
        textStyle(NORMAL);
        fill(33);
        text('Prerequisites: ' + preds, 20, py + 28, width - 40);
        text('Enables: ' + succs, 20, py + 46, width - 40);
    } else {
        fill(108, 117, 125);
        text('Click a concept to highlight its prerequisites and dependents. Toggle "Show code examples" then hover a concept for a code snippet.', 20, py + 10, width - 40);
    }
    pop();
}

function mousePressed() {
    if (mouseY > drawHeight) return;
    for (const id in nodeMap) {
        const n = nodeMap[id];
        if (mouseX >= n.x && mouseX <= n.x + n.w && mouseY >= n.y && mouseY <= n.y + n.h) {
            selectedNodeId = (selectedNodeId === id) ? null : id;
            return;
        }
    }
    selectedNodeId = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    setupLayout();
}
