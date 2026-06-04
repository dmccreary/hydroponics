// DIY Build Selector — p5.js
// CANVAS_HEIGHT: 680
let canvasWidth = 960;
let filterHeight = 90;
let drawHeight = 560;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// UI controls
let budgetSlider, levelSelect, classroomCheckbox, compareBtn, backBtn, clearCompareBtn;

// State
let budget = 100;
let level = "Beginner";
let classroomOnly = false;
let compareMode = false;
let selectedBuildId = null;       // open expanded view
let comparePicks = [];            // ids selected for compare
let cardRects = [];               // hit-test rectangles
let filteredIds = new Set();

const LEVEL_RANK = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };

const BUILDS = [
  {
    id: "mason-kratky",
    name: "Mason Jar Kratky",
    budgetMin: 5, budgetMax: 25,
    capacity: "1 plant (lettuce / herb)",
    complexity: 1,
    minLevel: "Beginner",
    classroomSafe: true,
    advantage: "Zero electricity — works on any windowsill.",
    constraint: "Single short-cycle crop only; no top-up mid-cycle.",
    buildTime: "30 min",
    materials: [
      "1× 1-quart mason jar with lid — $3",
      "1× 2-inch net pot — $1",
      "1× pack rockwool starter cube — $2 (covers many plants)",
      "1× small bottle two-part nutrient (e.g. MaxiGro 2 oz) — $4",
      "1× pH test strips — $5",
      "Painter's tape and marker — $2",
      "Lettuce seeds — $3"
    ],
    steps: [
      "Cut a hole in the jar lid sized to friction-fit the net pot.",
      "Soak rockwool cube in pH-6 water for 30 min, plant seed in cube.",
      "Mix nutrient solution to 1.6 EC; pour into jar until just touching the bottom of the net pot.",
      "Insert net pot + cube into jar lid.",
      "Wrap the jar with tape/foil to block light.",
      "Place by window with 6+ hours indirect light.",
      "Mark initial solution level; do not top up — let air gap form as roots grow."
    ],
    crops: "Lettuce, basil, herbs",
    upgrade: "Add a small air pump and bigger reservoir to convert to Tier 2 DWC."
  },
  {
    id: "bucket-dwc",
    name: "5-Gallon Bucket DWC",
    budgetMin: 40, budgetMax: 90,
    capacity: "1 large or 4 small plants",
    complexity: 2,
    minLevel: "Beginner",
    classroomSafe: true,
    advantage: "Fast growth from huge root oxygen, simple parts.",
    constraint: "Air pump must run 24/7; failure kills plants in hours.",
    buildTime: "2 hours",
    materials: [
      "1× 5-gal food-grade bucket with lid — $8",
      "1× 6-inch net pot lid (or DIY hole + 6\" net pot) — $7",
      "1× quiet aquarium air pump (≥2 W) — $15",
      "1× air stone + tubing — $5",
      "1× rockwool starter cubes — $4",
      "1× 2-part nutrient (1L set) — $20",
      "1× EC + pH pen combo (cheap) — $15",
      "Hydroton clay pebbles, 5L — $10"
    ],
    steps: [
      "Drill or cut a 6-inch hole in the bucket lid for the net pot.",
      "Add air stone to bottom of bucket; run tubing out a small hole near the rim.",
      "Connect tubing to air pump (outside bucket).",
      "Fill bucket with pH-6 nutrient solution to 1 inch below net pot bottom.",
      "Rinse hydroton, fill net pot, set rockwool-rooted seedling in center.",
      "Place bucket where temp is 18–22 °C; cover with a dark cloth if any light reaches solution.",
      "Top up weekly; replace solution every 2 weeks."
    ],
    crops: "Lettuce, basil, kale, small tomato",
    upgrade: "Add a chiller and second bucket in parallel to support fruiting crops."
  },
  {
    id: "nft-rail",
    name: "PVC NFT Rail (3-channel)",
    budgetMin: 120, budgetMax: 220,
    capacity: "9–18 plants",
    complexity: 3,
    minLevel: "Intermediate",
    classroomSafe: true,
    advantage: "Scales easily and gives lettuce its fastest growth.",
    constraint: "Pump cannot stop; root mats can clog channels.",
    buildTime: "4–6 hours",
    materials: [
      "3× 4-inch PVC pipe, 1.5 m each, with end caps — $40",
      "1× 20-gal reservoir tote — $25",
      "1× 800 L/h submersible pump — $25",
      "1.5 m × 2 each: 1/2-inch black tubing — $10",
      "Net cups (2-inch) × 18 — $10",
      "Drill, hole saw 2-inch — borrowed/owned",
      "Adjustable frame (2×4 or PVC) — $25",
      "Two-part nutrient (large) — $25",
      "EC + pH pen — $25"
    ],
    steps: [
      "Cut 2-inch holes in PVC every 8 inches along the top.",
      "Build a frame so channels tilt 1:30 slope back to reservoir.",
      "Drill drain holes in low-end end caps; run return tubing to reservoir.",
      "Run pump output through tubing to high end of each channel; restrict flow with a ball valve to ~1 L/min/channel.",
      "Insert rockwool-rooted seedlings into net cups; place in channel holes.",
      "Run pump 24/7; check film depth (2–3 mm thick across channel floor).",
      "Trim root mats every 2 weeks to prevent clogging."
    ],
    crops: "Lettuce, basil, strawberries, leafy greens",
    upgrade: "Add a controller (Pico) with sensors for full Tier 4 monitoring."
  },
  {
    id: "iot-controller",
    name: "Tier-4 Pico Controller",
    budgetMin: 200, budgetMax: 380,
    capacity: "Adds smart monitoring to any system",
    complexity: 3,
    minLevel: "Advanced",
    classroomSafe: true,
    advantage: "Logs and controls automatically; gives the data analytics chapter real data.",
    constraint: "Requires soldering and code — best for advanced students.",
    buildTime: "6–10 hours",
    materials: [
      "1× Raspberry Pi Pico W — $7",
      "1× DS18B20 temp probe (waterproof) — $5",
      "1× Atlas Scientific or DFRobot EC kit — $80",
      "1× Atlas pH kit — $60",
      "1× 4-channel SSR module — $20",
      "1× breadboard + jumper wires — $10",
      "1× project enclosure — $15",
      "1× 5 V USB power supply — $10",
      "1× microSD or cloud logging service (free)",
      "Soldering iron + solder (shared)",
      "OLED display (optional) — $10"
    ],
    steps: [
      "Solder headers to Pico; mount on breadboard inside enclosure.",
      "Wire temp probe to a GPIO with 4.7 kΩ pull-up.",
      "Wire EC + pH boards via UART or I2C to the Pico.",
      "Wire the SSR module to GPIO outputs (one per pump/light).",
      "Flash MicroPython firmware from Chapter 12 code.",
      "Calibrate EC + pH probes with reference solutions.",
      "Run logging loop; verify CSV/cloud upload working.",
      "Add safety bounds in code (no pump > 30 min/hr; warn on EC out of band)."
    ],
    crops: "Pairs with any of the above builds.",
    upgrade: "Add camera and dashboard from Chapter 17 for full classroom display."
  }
];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 980);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    // Budget slider
    budgetSlider = createSlider(0, 400, 100, 10);
    budgetSlider.position(15, 38);
    budgetSlider.style('width', '180px');
    budgetSlider.input(() => { budget = budgetSlider.value(); recomputeFilter(); });

    // Experience level
    levelSelect = createSelect();
    levelSelect.position(310, 38);
    levelSelect.option('Beginner');
    levelSelect.option('Intermediate');
    levelSelect.option('Advanced');
    levelSelect.selected('Beginner');
    levelSelect.changed(() => { level = levelSelect.value(); recomputeFilter(); });

    // Classroom-safe checkbox
    classroomCheckbox = createCheckbox(' Classroom-safe only', false);
    classroomCheckbox.position(470, 38);
    classroomCheckbox.changed(() => { classroomOnly = classroomCheckbox.checked(); recomputeFilter(); });

    // Compare mode button
    compareBtn = createButton('Compare Mode: OFF');
    compareBtn.position(660, 36);
    compareBtn.mousePressed(() => {
        compareMode = !compareMode;
        comparePicks = [];
        compareBtn.html('Compare Mode: ' + (compareMode ? 'ON' : 'OFF'));
    });

    // Back button (hidden initially)
    backBtn = createButton('← Back to cards');
    backBtn.position(15, drawHeight + 15);
    backBtn.mousePressed(() => { selectedBuildId = null; updateButtonVisibility(); });
    backBtn.hide();

    // Clear compare selection button (hidden initially)
    clearCompareBtn = createButton('Clear selection');
    clearCompareBtn.position(150, drawHeight + 15);
    clearCompareBtn.mousePressed(() => { comparePicks = []; });
    clearCompareBtn.hide();

    recomputeFilter();
}

function updateButtonVisibility() {
    if (selectedBuildId) backBtn.show(); else backBtn.hide();
    if (compareMode && comparePicks.length > 0 && !selectedBuildId) clearCompareBtn.show();
    else clearCompareBtn.hide();
}

function recomputeFilter() {
    filteredIds = new Set();
    const userRank = LEVEL_RANK[level];
    for (const b of BUILDS) {
        if (budget < b.budgetMin) continue;
        if (LEVEL_RANK[b.minLevel] > userRank) continue;
        if (classroomOnly && !b.classroomSafe) continue;
        filteredIds.add(b.id);
    }
}

function draw() {
    background(248, 249, 250);

    drawFilterHeader();

    if (selectedBuildId) {
        drawExpandedPanel();
    } else {
        drawCardGrid();
        drawCompareArea();
    }

    drawFooterTip();
    updateButtonVisibility();
}

// ---------- Filter Header ----------
function drawFilterHeader() {
    push();
    noStroke();
    fill(255);
    rect(0, 0, width, filterHeight);
    stroke(222, 226, 230);
    line(0, filterHeight, width, filterHeight);
    pop();

    push();
    fill(46, 125, 50);
    noStroke();
    textStyle(BOLD);
    textSize(15);
    textAlign(LEFT, TOP);
    text('DIY Build Selector', 15, 8);
    pop();

    // Slider label with live value
    push();
    fill(33);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('My Budget: $' + budget, 200, 42);
    textStyle(NORMAL);
    text('Experience Level:', 310, 22);
    pop();
}

// ---------- Card Grid ----------
function computeGridLayout() {
    // Decide columns based on width
    let cols;
    if (containerWidth >= 820) cols = 4;
    else if (containerWidth >= 520) cols = 2;
    else cols = 1;
    const gap = 14;
    const marginX = 15;
    const marginTop = filterHeight + 14;
    const rows = Math.ceil(BUILDS.length / cols);
    const cardW = (containerWidth - 2 * marginX - gap * (cols - 1)) / cols;
    const availH = drawHeight - (marginTop - 0) - 14;
    const cardH = Math.min(380, (availH - gap * (rows - 1)) / rows);
    return { cols, rows, cardW, cardH, gap, marginX, marginTop };
}

function drawCardGrid() {
    const L = computeGridLayout();
    cardRects = [];

    for (let i = 0; i < BUILDS.length; i++) {
        const b = BUILDS[i];
        const r = i % L.cols;
        const c = Math.floor(i / L.cols);
        // Actually arrange row-major: i -> col=r, row=c
        const col = i % L.cols;
        const row = Math.floor(i / L.cols);
        const x = L.marginX + col * (L.cardW + L.gap);
        const y = L.marginTop + row * (L.cardH + L.gap);

        const matches = filteredIds.has(b.id);
        const isPickedForCompare = comparePicks.includes(b.id);

        drawBuildCard(b, x, y, L.cardW, L.cardH, matches, isPickedForCompare);
        cardRects.push({ id: b.id, x, y, w: L.cardW, h: L.cardH });
    }
}

function drawBuildCard(b, x, y, w, h, matches, picked) {
    push();
    // Card background
    if (matches) {
        fill(255);
    } else {
        fill(236, 239, 241);
    }
    if (picked) {
        stroke(0, 188, 212);
        strokeWeight(3);
    } else if (matches) {
        stroke(46, 125, 50);
        strokeWeight(2);
    } else {
        stroke(207, 216, 220);
        strokeWeight(1);
    }
    rect(x, y, w, h, 6);
    pop();

    // Header bar
    push();
    noStroke();
    if (matches) fill(46, 125, 50); else fill(176, 190, 197);
    rect(x, y, w, 26, 6, 6, 0, 0);
    fill(255);
    textStyle(BOLD);
    textSize(12);
    textAlign(LEFT, CENTER);
    const headerName = fitText(b.name, w - 16, 12);
    text(headerName, x + 8, y + 13);
    pop();

    // Illustration area (~80 px tall, scaled if card too short)
    const illoH = Math.min(80, h * 0.22);
    const illoY = y + 30;
    drawBuildIllustration(b, x + 8, illoY, w - 16, illoH, matches);

    // Text region
    const textTop = illoY + illoH + 6;
    const lineH = 13;
    const textColor = matches ? color(33) : color(120);
    push();
    fill(textColor);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);

    let ty = textTop;
    textStyle(BOLD);
    text('Budget:', x + 8, ty);
    textStyle(NORMAL);
    text('$' + b.budgetMin + '–$' + b.budgetMax, x + 60, ty);
    ty += lineH;

    textStyle(BOLD);
    text('Capacity:', x + 8, ty);
    textStyle(NORMAL);
    text(fitText(b.capacity, w - 80, 10), x + 60, ty);
    ty += lineH;

    textStyle(BOLD);
    text('Complexity:', x + 8, ty);
    drawStars(x + 80, ty + 5, b.complexity, matches);
    ty += lineH;

    textStyle(BOLD);
    text('Build time:', x + 8, ty);
    textStyle(NORMAL);
    text(b.buildTime, x + 70, ty);
    ty += lineH;

    textStyle(BOLD);
    text('Min level:', x + 8, ty);
    textStyle(NORMAL);
    text(b.minLevel, x + 65, ty);
    ty += lineH + 3;

    // Advantage / constraint
    textStyle(BOLD);
    if (matches) fill(46, 125, 50); else fill(120);
    text('+', x + 8, ty);
    fill(textColor);
    textStyle(NORMAL);
    text(b.advantage, x + 18, ty, w - 26, 30);
    ty += 28;

    textStyle(BOLD);
    if (matches) fill(198, 40, 40); else fill(140);
    text('!', x + 10, ty);
    fill(textColor);
    textStyle(NORMAL);
    text(b.constraint, x + 18, ty, w - 26, 30);
    pop();

    // Footer hint
    push();
    noStroke();
    fill(matches ? color(46, 125, 50) : color(150));
    textSize(9);
    textStyle(ITALIC);
    textAlign(RIGHT, BOTTOM);
    let hint = 'click for details';
    if (compareMode) hint = picked ? 'selected ✓' : 'click to compare';
    if (!matches) hint = 'filtered out';
    text(hint, x + w - 8, y + h - 6);
    pop();
}

function fitText(s, maxWidth, ts) {
    push();
    textSize(ts);
    if (textWidth(s) <= maxWidth) { pop(); return s; }
    let out = s;
    while (out.length > 4 && textWidth(out + '…') > maxWidth) out = out.slice(0, -1);
    pop();
    return out + '…';
}

function drawStars(x, y, n, active) {
    push();
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();
    for (let i = 0; i < 3; i++) {
        if (i < n) fill(active ? color(255, 179, 0) : color(160));
        else fill(active ? color(207, 216, 220) : color(200));
        text('★', x + i * 11, y);
    }
    pop();
}

// ---------- Illustrations (cross-section style) ----------
function drawBuildIllustration(b, x, y, w, h, active) {
    push();
    // Background
    noStroke();
    fill(active ? color(232, 245, 233) : color(245, 245, 245));
    rect(x, y, w, h, 4);
    if (b.id === "mason-kratky") drawMasonJar(x, y, w, h, active);
    else if (b.id === "bucket-dwc") drawBucketDWC(x, y, w, h, active);
    else if (b.id === "nft-rail") drawNFTRail(x, y, w, h, active);
    else if (b.id === "iot-controller") drawPicoController(x, y, w, h, active);
    pop();
}

function drawMasonJar(x, y, w, h, active) {
    const cx = x + w / 2;
    const jarW = Math.min(w * 0.4, 42);
    const jarH = h * 0.7;
    const jarX = cx - jarW / 2;
    const jarY = y + h - jarH - 4;
    // Jar
    noStroke();
    fill(active ? color(187, 222, 251) : color(220));
    rect(jarX, jarY + 6, jarW, jarH - 6, 3, 3, 5, 5);
    // Lid
    fill(active ? color(120, 120, 120) : color(180));
    rect(jarX - 2, jarY, jarW + 4, 7, 2);
    // Net pot opening
    fill(255);
    rect(cx - 7, jarY, 14, 5);
    // Plant
    fill(active ? color(46, 125, 50) : color(150));
    triangle(cx, jarY - 14, cx - 8, jarY - 2, cx + 8, jarY - 2);
    triangle(cx, jarY - 20, cx - 6, jarY - 10, cx + 6, jarY - 10);
    // Roots
    stroke(active ? color(120, 90, 60) : color(170));
    strokeWeight(1);
    for (let i = -2; i <= 2; i++) {
        line(cx + i * 3, jarY + 6, cx + i * 4, jarY + jarH - 4);
    }
    // Solution line
    noStroke();
    fill(active ? color(100, 181, 246, 200) : color(200));
    rect(jarX + 2, jarY + jarH - 12, jarW - 4, 8);
}

function drawBucketDWC(x, y, w, h, active) {
    const cx = x + w / 2;
    const bw = Math.min(w * 0.55, 70);
    const bh = h * 0.7;
    const bx = cx - bw / 2;
    const by = y + h - bh - 4;
    noStroke();
    // Bucket
    fill(active ? color(96, 125, 139) : color(190));
    quad(bx, by + 6, bx + bw, by + 6, bx + bw - 4, by + bh, bx + 4, by + bh);
    // Lid
    fill(active ? color(69, 90, 100) : color(160));
    rect(bx - 3, by, bw + 6, 7, 2);
    // Net pot
    fill(255);
    rect(cx - 9, by, 18, 5);
    // Plant
    fill(active ? color(46, 125, 50) : color(150));
    triangle(cx, by - 16, cx - 10, by - 2, cx + 10, by - 2);
    // Water
    fill(active ? color(100, 181, 246, 180) : color(200));
    quad(bx + 3, by + 18, bx + bw - 3, by + 18, bx + bw - 5, by + bh - 3, bx + 5, by + bh - 3);
    // Bubbles
    fill(active ? color(255, 255, 255, 220) : color(230));
    for (let i = 0; i < 5; i++) {
        const phase = (frameCount * 0.02 + i * 0.3) % 1;
        const bxp = bx + 10 + i * ((bw - 20) / 5);
        const byp = by + bh - 3 - phase * (bh - 24);
        circle(bxp, byp, 3);
    }
    // Air pump line
    if (active) {
        stroke(60);
        strokeWeight(1);
        noFill();
        line(bx + 2, by + bh - 2, bx + 2, by + bh + 4);
    }
}

function drawNFTRail(x, y, w, h, active) {
    noStroke();
    // 3 channels with slight slope
    const channelY = y + h * 0.55;
    const cw = w - 16;
    const ch = 8;
    for (let i = 0; i < 3; i++) {
        const yy = channelY + i * 10;
        fill(active ? color(176, 190, 197) : color(210));
        rect(x + 8, yy, cw, ch, 2);
    }
    // Plants on top channel
    fill(active ? color(46, 125, 50) : color(150));
    for (let i = 0; i < 6; i++) {
        const px = x + 14 + i * (cw / 6);
        triangle(px, channelY - 10, px - 5, channelY, px + 5, channelY);
    }
    // Reservoir
    fill(active ? color(100, 181, 246) : color(200));
    rect(x + 4, y + h - 14, 18, 10, 2);
    // Pump arrow
    if (active) {
        stroke(25, 118, 210);
        strokeWeight(1.5);
        noFill();
        line(x + 13, y + h - 14, x + 13, channelY + 4);
        line(x + 13, channelY + 4, x + cw + 6, channelY + 4);
        // arrow
        fill(25, 118, 210);
        noStroke();
        triangle(x + cw + 6, channelY + 1, x + cw + 6, channelY + 7, x + cw + 11, channelY + 4);
    }
}

function drawPicoController(x, y, w, h, active) {
    noStroke();
    // Enclosure
    fill(active ? color(38, 50, 56) : color(180));
    rect(x + 12, y + 12, w - 24, h - 20, 4);
    // PCB
    fill(active ? color(76, 175, 80) : color(200));
    rect(x + 22, y + 22, w - 44, h - 38, 2);
    // Pico chip
    fill(active ? color(33) : color(140));
    rect(x + w / 2 - 12, y + h / 2 - 6, 24, 12, 1);
    // LEDs
    for (let i = 0; i < 3; i++) {
        fill(active ? [color(255, 87, 34), color(255, 235, 59), color(76, 175, 80)][i] : color(200));
        circle(x + 30 + i * 8, y + 30, 3);
    }
    // Wires to "sensors"
    if (active) {
        stroke(255, 152, 0);
        strokeWeight(1);
        line(x + 22, y + h / 2, x + 8, y + h / 2);
        stroke(33, 150, 243);
        line(x + w - 22, y + h / 2, x + w - 8, y + h / 2);
        // probes
        noStroke();
        fill(120);
        circle(x + 6, y + h / 2, 5);
        circle(x + w - 6, y + h / 2, 5);
    }
}

// ---------- Compare area ----------
function drawCompareArea() {
    if (!compareMode) return;
    if (comparePicks.length === 0) return;

    const L = computeGridLayout();
    const yStart = L.marginTop + L.rows * (L.cardH + L.gap);
    if (yStart + 80 > drawHeight) return;

    push();
    noStroke();
    fill(255);
    stroke(0, 188, 212);
    strokeWeight(2);
    rect(15, yStart, containerWidth - 30, drawHeight - yStart - 8, 6);
    pop();

    push();
    fill(0, 188, 212);
    noStroke();
    textStyle(BOLD);
    textSize(12);
    textAlign(LEFT, TOP);
    text('Comparison', 25, yStart + 8);
    pop();

    const colW = (containerWidth - 60) / 2;
    for (let i = 0; i < 2; i++) {
        const colX = 25 + i * (colW + 10);
        const b = i < comparePicks.length ? BUILDS.find(x => x.id === comparePicks[i]) : null;
        push();
        noStroke();
        fill(248, 249, 250);
        rect(colX, yStart + 28, colW, drawHeight - yStart - 40, 4);
        pop();

        if (!b) {
            push();
            fill(150);
            textStyle(ITALIC);
            textSize(11);
            textAlign(CENTER, CENTER);
            text('Click a card to pick…', colX + colW / 2, yStart + (drawHeight - yStart) / 2);
            pop();
            continue;
        }
        push();
        fill(46, 125, 50);
        noStroke();
        textStyle(BOLD);
        textSize(12);
        textAlign(LEFT, TOP);
        text(fitText(b.name, colW - 12, 12), colX + 8, yStart + 36);

        fill(33);
        textStyle(NORMAL);
        textSize(10);
        let yy = yStart + 56;
        const attr = (k, v) => {
            push();
            textStyle(BOLD);
            text(k, colX + 8, yy);
            textStyle(NORMAL);
            text(v, colX + 80, yy, colW - 90);
            pop();
            yy += 14;
        };
        attr('Budget:', '$' + b.budgetMin + '–$' + b.budgetMax);
        attr('Capacity:', b.capacity);
        attr('Complexity:', '★'.repeat(b.complexity) + '☆'.repeat(3 - b.complexity));
        attr('Min level:', b.minLevel);
        attr('Build time:', b.buildTime);
        attr('Crops:', b.crops);
        pop();
    }
}

// ---------- Expanded Panel ----------
function drawExpandedPanel() {
    const b = BUILDS.find(x => x.id === selectedBuildId);
    if (!b) return;

    const px = 15;
    const py = filterHeight + 14;
    const pw = containerWidth - 30;
    const ph = drawHeight - py - 14;

    push();
    noStroke();
    fill(255);
    stroke(46, 125, 50);
    strokeWeight(2);
    rect(px, py, pw, ph, 6);
    pop();

    // Header
    push();
    noStroke();
    fill(46, 125, 50);
    rect(px, py, pw, 32, 6, 6, 0, 0);
    fill(255);
    textStyle(BOLD);
    textSize(14);
    textAlign(LEFT, CENTER);
    text(b.name, px + 12, py + 16);
    textStyle(NORMAL);
    textSize(11);
    textAlign(RIGHT, CENTER);
    text('Budget $' + b.budgetMin + '–$' + b.budgetMax + '  •  ' + b.buildTime + '  •  ' + b.minLevel,
        px + pw - 12, py + 16);
    pop();

    // Two columns
    const colW = (pw - 30) / 2;
    const leftX = px + 10;
    const rightX = px + 20 + colW;
    const colY = py + 42;
    const colH = ph - 52;

    // Left: materials
    drawColumnHeader('Materials', leftX, colY, colW);
    push();
    fill(33);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    let yy = colY + 22;
    for (const m of b.materials) {
        text('• ' + m, leftX + 4, yy, colW - 8);
        const lines = Math.ceil(textWidth('• ' + m) / (colW - 8));
        yy += 13 * Math.max(1, lines);
        if (yy > colY + colH - 10) break;
    }
    pop();

    // Right: steps, crops, upgrade
    drawColumnHeader('Assembly Steps', rightX, colY, colW);
    push();
    fill(33);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    let yr = colY + 22;
    for (let i = 0; i < b.steps.length; i++) {
        const s = (i + 1) + '. ' + b.steps[i];
        text(s, rightX + 4, yr, colW - 8);
        const approxLines = Math.ceil(textWidth(s) / (colW - 8));
        yr += 13 * Math.max(1, approxLines);
        if (yr > colY + colH - 80) break;
    }
    pop();

    // Bottom strip: crops + upgrade
    const stripY = py + ph - 60;
    push();
    noStroke();
    fill(232, 245, 233);
    rect(px + 8, stripY, pw - 16, 50, 4);

    fill(46, 125, 50);
    textStyle(BOLD);
    textSize(10);
    textAlign(LEFT, TOP);
    text('First crops:', px + 16, stripY + 6);
    textStyle(NORMAL);
    fill(33);
    text(b.crops, px + 90, stripY + 6, pw - 100);

    fill(46, 125, 50);
    textStyle(BOLD);
    text('Upgrade path:', px + 16, stripY + 26);
    textStyle(NORMAL);
    fill(33);
    text(b.upgrade, px + 100, stripY + 26, pw - 110);
    pop();
}

function drawColumnHeader(label, x, y, w) {
    push();
    noStroke();
    fill(0, 188, 212);
    rect(x, y, w, 18, 3);
    fill(255);
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, CENTER);
    text(label, x + 6, y + 9);
    pop();
}

// ---------- Footer tip ----------
function drawFooterTip() {
    push();
    noStroke();
    fill(255);
    rect(0, drawHeight, width, controlHeight);
    stroke(222, 226, 230);
    line(0, drawHeight, width, drawHeight);
    pop();

    push();
    fill(108, 117, 125);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    let tipY = drawHeight + 50;
    let tip;
    if (selectedBuildId) {
        tip = 'Reading the expanded build sheet. Use "← Back to cards" to return to the grid.';
    } else if (compareMode) {
        const n = comparePicks.length;
        if (n === 0) tip = 'Compare Mode is ON — click any two cards to see them side by side.';
        else if (n === 1) tip = 'Compare Mode — one card picked. Click a second card to compare.';
        else tip = 'Compare Mode — two cards picked. Use "Clear selection" to pick a different pair.';
    } else {
        const n = filteredIds.size;
        tip = n + ' of ' + BUILDS.length + ' builds match your filters. Click a card for full materials, steps, and upgrade path.';
    }
    text(tip, 15, tipY, width - 30);

    // Legend
    fill(46, 125, 50);
    rect(15, tipY + 36, 14, 10);
    fill(33);
    text('matches filters', 32, tipY + 35);
    fill(207, 216, 220);
    rect(140, tipY + 36, 14, 10);
    fill(33);
    text('filtered out', 158, tipY + 35);
    if (compareMode) {
        fill(0, 188, 212);
        rect(240, tipY + 36, 14, 10);
        fill(33);
        text('selected for compare', 258, tipY + 35);
    }
    pop();
}

// ---------- Input ----------
function mousePressed() {
    // Only the canvas area
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    // Don't intercept when expanded panel is open (Back button handles return)
    if (selectedBuildId) return;
    // Ignore clicks in filter header or footer
    if (mouseY < filterHeight || mouseY > drawHeight) return;

    for (const r of cardRects) {
        if (mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h) {
            handleCardClick(r.id);
            return;
        }
    }
}

function handleCardClick(id) {
    const matches = filteredIds.has(id);
    if (!matches) return; // filtered-out cards are inert
    if (compareMode) {
        // Toggle pick
        const idx = comparePicks.indexOf(id);
        if (idx >= 0) {
            comparePicks.splice(idx, 1);
        } else {
            if (comparePicks.length >= 2) comparePicks.shift();
            comparePicks.push(id);
        }
    } else {
        selectedBuildId = id;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
