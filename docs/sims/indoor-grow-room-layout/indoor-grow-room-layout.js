// Indoor Grow Room Layout - p5.js top-down clickable diagram
// CANVAS_HEIGHT: 620
let canvasWidth = 760;
let drawHeight = 440;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let showFlow = false;
let showAir = false;
let flowToggleBtn, airToggleBtn, resetBtn;
let flowPhase = 0;

let zones = [];
let selectedZone = null;

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    flowToggleBtn = createButton('Show Nutrient Flow');
    flowToggleBtn.position(10, drawHeight + 10);
    flowToggleBtn.mousePressed(() => { showFlow = !showFlow; flowToggleBtn.html(showFlow ? 'Hide Nutrient Flow' : 'Show Nutrient Flow'); });

    airToggleBtn = createButton('Show Airflow');
    airToggleBtn.position(160, drawHeight + 10);
    airToggleBtn.mousePressed(() => { showAir = !showAir; airToggleBtn.html(showAir ? 'Hide Airflow' : 'Show Airflow'); });

    resetBtn = createButton('Clear Selection');
    resetBtn.position(285, drawHeight + 10);
    resetBtn.mousePressed(() => { selectedZone = null; });

    defineZones();
}

function defineZones() {
    // Coordinates use a logical 760x440 frame; we rescale at draw time.
    zones = [
        { id: 'lights', x: 80, y: 50, w: 460, h: 60, color: [255, 224, 130], label: 'Grow Lights', chapter: 'Ch. 10',
          what: 'Full-spectrum LED panels mounted above the canopy.',
          why: 'Drives photosynthesis. Photoperiod and intensity control growth stage.',
          chapters: 'Lighting design covered in Chapter 10.' },
        { id: 'channels', x: 80, y: 130, w: 460, h: 130, color: [165, 214, 167], label: 'Growing Channels', chapter: 'Ch. 6–8',
          what: 'NFT channels or deep-water trays holding net cups and root mass.',
          why: 'Delivers oxygenated nutrient solution to roots continuously.',
          chapters: 'Systems covered in Chapters 6 (NFT), 7 (DWC), and 8 (Aeroponics).' },
        { id: 'reservoir', x: 80, y: 280, w: 120, h: 110, color: [144, 202, 249], label: 'Reservoir', chapter: 'Ch. 5',
          what: 'Sump tank holding mixed nutrient solution.',
          why: 'Buffers volume, lets pH and EC be measured and dosed.',
          chapters: 'Reservoir sizing and management in Chapter 5.' },
        { id: 'sensors', x: 215, y: 290, w: 90, h: 50, color: [128, 222, 234], label: 'Sensors', chapter: 'Ch. 15',
          what: 'pH probe, EC meter, temperature probe in the reservoir.',
          why: 'Closes the feedback loop — you cannot dose what you do not measure.',
          chapters: 'Sensor selection and calibration in Chapter 15.' },
        { id: 'controller', x: 215, y: 350, w: 110, h: 40, color: [128, 222, 234], label: 'Controller', chapter: 'Ch. 12–14',
          what: 'Raspberry Pi Pico or ESP32 microcontroller.',
          why: 'Reads sensors, drives relays, logs data.',
          chapters: 'Microcontroller programming in Chapters 12–14.' },
        { id: 'relay', x: 340, y: 350, w: 90, h: 40, color: [128, 222, 234], label: 'Relay & Power', chapter: 'Ch. 13',
          what: 'Solid-state relay board switching pumps and lights.',
          why: 'Lets a 3.3V microcontroller control mains-powered equipment safely.',
          chapters: 'Relay wiring in Chapter 13.' },
        { id: 'dashboard', x: 445, y: 290, w: 95, h: 50, color: [128, 222, 234], label: 'Dashboard', chapter: 'Ch. 17',
          what: 'LCD or browser-based dashboard showing live sensor values.',
          why: 'Lets the grower see the system state at a glance.',
          chapters: 'Dashboard design in Chapter 17.' },
        { id: 'exhaust', x: 545, y: 140, w: 60, h: 110, color: [189, 189, 189], label: 'Exhaust', chapter: 'Ch. 11',
          what: 'Inline fan pulling air through a carbon filter.',
          why: 'Removes humidity, heat and odors; pulls fresh CO₂ in.',
          chapters: 'Ventilation in Chapter 11.' },
        { id: 'intake', x: 15, y: 140, w: 60, h: 110, color: [189, 189, 189], label: 'Air Intake', chapter: 'Ch. 11',
          what: 'Passive vent with a particle filter on the opposite wall.',
          why: 'Supplies fresh CO₂-rich air to replace exhausted air.',
          chapters: 'Ventilation in Chapter 11.' }
    ];
}

function draw() {
    background(248, 249, 250);

    const sx = width / 760;
    const sy = drawHeight / 440;

    // Room outline
    push();
    stroke(120);
    strokeWeight(3);
    noFill();
    rect(8 * sx, 30 * sy, 744 * sx, 380 * sy, 6);
    pop();

    // Zones
    for (const z of zones) {
        const isSel = selectedZone && selectedZone.id === z.id;
        push();
        noStroke();
        fill(z.color[0], z.color[1], z.color[2], isSel ? 255 : 210);
        rect(z.x * sx, z.y * sy, z.w * sx, z.h * sy, 4);
        if (isSel) {
            stroke(46, 125, 50);
            strokeWeight(3);
            noFill();
            rect(z.x * sx, z.y * sy, z.w * sx, z.h * sy, 4);
        }
        pop();

        push();
        fill(33);
        noStroke();
        textSize(11);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text(z.label, (z.x + z.w / 2) * sx, (z.y + z.h / 2) * sy - 6);
        textStyle(NORMAL);
        textSize(10);
        text(z.chapter, (z.x + z.w / 2) * sx, (z.y + z.h / 2) * sy + 7);
        pop();
    }

    // Nutrient flow arrows (animated)
    if (showFlow) {
        flowPhase = (flowPhase + 0.015) % 1;
        drawFlowArrows(sx, sy);
    }
    // Airflow arrows
    if (showAir) {
        drawAirArrows(sx, sy);
    }

    // Info panel below the room
    drawInfoPanel();

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Indoor Grow Room — Top-Down Layout', 12, 8);
    pop();
}

function drawFlowArrows(sx, sy) {
    push();
    stroke(25, 118, 210);
    strokeWeight(3);
    noFill();
    // Reservoir -> channels (up)
    const x1 = 140 * sx, y1 = 280 * sy;
    const x2 = 140 * sx, y2 = 260 * sy;
    drawAnimatedDash(x1, y1, x2, y2, flowPhase);
    // Channels -> drain back (down right side)
    drawAnimatedDash(500 * sx, 260 * sy, 500 * sx, 285 * sy, flowPhase);
    drawAnimatedDash(500 * sx, 285 * sy, 200 * sx, 320 * sy, flowPhase);
    pop();

    // Labels
    push();
    noStroke();
    fill(25, 118, 210);
    textSize(10);
    textStyle(BOLD);
    textAlign(LEFT);
    text('pump out', 145 * sx, 270 * sy);
    text('drain back', 350 * sx, 315 * sy);
    pop();
}

function drawAirArrows(sx, sy) {
    push();
    drawingContext.setLineDash([6, 4]);
    stroke(120);
    strokeWeight(2);
    line(75 * sx, 195 * sy, 540 * sx, 195 * sy);
    drawingContext.setLineDash([]);
    // arrowhead
    fill(120);
    noStroke();
    triangle(540 * sx, 195 * sy, 528 * sx, 189 * sy, 528 * sx, 201 * sy);
    pop();
    push();
    noStroke();
    fill(80);
    textSize(10);
    textStyle(BOLD);
    text('fresh air →  →  →  →  → exhaust', 220 * sx, 188 * sy);
    pop();
}

function drawAnimatedDash(x1, y1, x2, y2, phase) {
    const steps = 8;
    for (let i = 0; i < steps; i++) {
        const t1 = (i + phase) / steps;
        const t2 = t1 + 0.04;
        if (t1 >= 1) continue;
        const xa = lerp(x1, x2, t1), ya = lerp(y1, y2, t1);
        const xb = lerp(x1, x2, Math.min(t2, 1)), yb = lerp(y1, y2, Math.min(t2, 1));
        line(xa, ya, xb, yb);
    }
}

function drawInfoPanel() {
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
    textSize(12);
    textAlign(LEFT, TOP);
    if (selectedZone) {
        textStyle(BOLD);
        fill(46, 125, 50);
        text(selectedZone.label + ' (' + selectedZone.chapter + ')', 20, py + 8);
        textStyle(NORMAL);
        fill(33);
        text('What: ' + selectedZone.what, 20, py + 28, width - 40);
        text('Why: ' + selectedZone.why, 20, py + 56, width - 40);
        text(selectedZone.chapters, 20, py + 88, width - 40);
    } else {
        fill(108, 117, 125);
        text('Click any labeled zone to see what it does, why it matters, and which chapter covers it.', 20, py + 10, width - 40);
    }
    pop();
}

function mousePressed() {
    if (mouseY > drawHeight) return;
    const sx = width / 760;
    const sy = drawHeight / 440;
    for (const z of zones) {
        if (mouseX >= z.x * sx && mouseX <= (z.x + z.w) * sx &&
            mouseY >= z.y * sy && mouseY <= (z.y + z.h) * sy) {
            selectedZone = z;
            return;
        }
    }
    selectedZone = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
