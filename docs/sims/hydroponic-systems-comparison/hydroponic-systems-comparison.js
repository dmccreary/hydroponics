// Hydroponic Systems Side-by-Side Comparison — p5.js
// CANVAS_HEIGHT: 640
let canvasWidth = 900;
let drawHeight = 540;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

const GREEN = '#2e7d32';
const TEAL = '#00bcd4';
const DARK = '#1f2937';
const LIGHT_BG = '#ffffff';
const GRAY = '#9ca3af';
const SOLUTION = '#4fc3f7';
const ROOT = '#f4e1c1';

let currentView = 'gallery'; // 'gallery' | 'detail'
let selectedSystem = -1;
let hoverIndex = -1;
let backBtn = null;

const systems = [
    {
        name: 'Kratky',
        short: 'Passive — no pump, falling water level',
        o2: 2,
        risk: 1,
        complexity: 1,
        cost: 1,
        crops: 'Lettuce, herbs, short-cycle leafy greens',
        insight: 'Zero electricity — the falling solution level lets roots find both water and air.'
    },
    {
        name: 'DWC',
        short: 'Roots suspended in oxygenated solution',
        o2: 4,
        risk: 4,
        complexity: 2,
        cost: 2,
        crops: 'Lettuce, basil, leafy greens, small tomato',
        insight: 'Massive root oxygen while the bubbler runs — but a single point of failure.'
    },
    {
        name: 'NFT',
        short: 'Thin film flowing through tilted channels',
        o2: 3,
        risk: 5,
        complexity: 3,
        cost: 3,
        crops: 'Lettuce, strawberries, leafy crops',
        insight: 'Thin film maximizes oxygen — but the pump cannot stop, ever.'
    },
    {
        name: 'Ebb-and-Flow',
        short: 'Flood and drain on a timed cycle',
        o2: 4,
        risk: 3,
        complexity: 3,
        cost: 3,
        crops: 'Peppers, tomatoes, larger fruiting crops',
        insight: 'The drain cycle IS the breath — solution out, air in.'
    },
    {
        name: 'Aeroponics',
        short: 'Roots in air, sprayed with nutrient mist',
        o2: 5,
        risk: 5,
        complexity: 5,
        cost: 5,
        crops: 'Lettuce, herbs, research and genetics work',
        insight: 'Highest oxygen, highest precision, highest risk of failure.'
    },
    {
        name: 'Fogponics',
        short: 'Ultrasonic fog of sub-50 micron droplets',
        o2: 5,
        risk: 4,
        complexity: 5,
        cost: 4,
        crops: 'Cuttings, micro-greens, research',
        insight: 'Nutrient droplets sub-50 μm — delivered directly to the root surface.'
    }
];

let thumbBounds = []; // [{x,y,w,h,idx}, ...]

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    backBtn = createButton('← Back to Gallery');
    backBtn.mousePressed(() => {
        currentView = 'gallery';
        selectedSystem = -1;
        backBtn.hide();
    });
    backBtn.hide();
    positionBackBtn();
}

function positionBackBtn() {
    if (backBtn) {
        backBtn.position(containerWidth - 160, 10);
        backBtn.style('background', GREEN);
        backBtn.style('color', '#fff');
        backBtn.style('border', 'none');
        backBtn.style('padding', '6px 12px');
        backBtn.style('border-radius', '4px');
        backBtn.style('cursor', 'pointer');
        backBtn.style('font-family', 'Segoe UI, Tahoma, sans-serif');
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    positionBackBtn();
}

function draw() {
    background(248, 249, 250);
    if (currentView === 'gallery') {
        drawGallery();
    } else {
        drawDetail();
    }
}

// ---------- GALLERY ----------
function drawGallery() {
    // Title
    fill(DARK);
    noStroke();
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(20);
    text('Hydroponic Systems — Click a card to explore', 16, 12);
    textStyle(NORMAL);
    textSize(13);
    fill(80);
    text('Compare six architectures side by side. Each card shows a cross-section, oxygen rating, pump risk, complexity and cost.', 16, 40);

    // Grid layout
    let cols = 3;
    if (containerWidth < 720) cols = 2;
    if (containerWidth < 480) cols = 1;
    let rows = Math.ceil(systems.length / cols);

    const top = 70;
    const bottom = drawHeight + controlHeight - 16;
    const left = 16;
    const right = containerWidth - 16;
    const gap = 12;

    const gridW = right - left;
    const gridH = bottom - top;

    const cellW = (gridW - gap * (cols - 1)) / cols;
    const cellH = (gridH - gap * (rows - 1)) / rows;

    thumbBounds = [];
    hoverIndex = -1;
    for (let i = 0; i < systems.length; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = left + c * (cellW + gap);
        const y = top + r * (cellH + gap);
        thumbBounds.push({ x, y, w: cellW, h: cellH, idx: i });
        if (mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH) {
            hoverIndex = i;
        }
        drawThumbnail(systems[i], i, x, y, cellW, cellH, hoverIndex === i);
    }
}

function drawThumbnail(sys, idx, x, y, w, h, isHover) {
    // Card background
    push();
    noStroke();
    fill(255);
    rect(x, y, w, h, 8);
    // Border
    strokeWeight(isHover ? 3 : 1.5);
    stroke(isHover ? GREEN : '#d0d7de');
    noFill();
    rect(x, y, w, h, 8);
    pop();

    // Diagram area (top portion)
    const diagH = h * 0.62;
    const diagX = x + 10;
    const diagY = y + 30;
    const diagW = w - 20;
    const diagBottom = diagY + diagH - 10;

    // Title bar at top
    push();
    fill(GREEN);
    noStroke();
    rect(x, y, w, 22, 8, 8, 0, 0);
    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(13);
    text(sys.name, x + w / 2, y + 11);
    pop();

    // Draw the system mini diagram (use unanimated static form)
    push();
    drawSystemDiagram(idx, diagX, diagY, diagW, diagH - 10, false);
    pop();

    // 1-line description
    push();
    noStroke();
    fill(80);
    textAlign(CENTER, TOP);
    textStyle(NORMAL);
    textSize(11);
    text(sys.short, x + 6, y + h - 32, w - 12, 30);
    pop();
}

// ---------- DETAIL ----------
function drawDetail() {
    const sys = systems[selectedSystem];

    // Header
    push();
    fill(GREEN);
    noStroke();
    rect(0, 0, containerWidth, 50);
    fill(255);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(22);
    text(sys.name, 18, 25);
    textStyle(NORMAL);
    textSize(13);
    fill(220, 245, 220);
    text(sys.short, 18, 42);
    pop();

    // Layout: diagram left (~55%), info right (~45%)
    const top = 60;
    const bottom = drawHeight + controlHeight - 10;
    const leftPanelX = 12;
    const leftPanelW = containerWidth * 0.55 - 18;
    const rightPanelX = containerWidth * 0.55 + 6;
    const rightPanelW = containerWidth - rightPanelX - 12;
    const panelH = bottom - top;

    // Left: diagram panel
    push();
    fill(255);
    stroke('#d0d7de');
    strokeWeight(1);
    rect(leftPanelX, top, leftPanelW, panelH, 6);
    pop();

    push();
    drawSystemDiagram(selectedSystem, leftPanelX + 14, top + 14, leftPanelW - 28, panelH - 28, true);
    pop();

    // Right: info panel
    push();
    fill(255);
    stroke('#d0d7de');
    strokeWeight(1);
    rect(rightPanelX, top, rightPanelW, panelH, 6);
    pop();

    drawInfoPanel(sys, rightPanelX + 14, top + 14, rightPanelW - 28, panelH - 28);
}

function drawInfoPanel(sys, x, y, w, h) {
    let cy = y;
    push();
    noStroke();
    fill(DARK);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(15);
    text('System Ratings', x, cy);
    cy += 24;

    drawRatingBar(x, cy, w, 'Oxygen Delivery', sys.o2, GREEN); cy += 28;
    drawRatingBar(x, cy, w, 'Pump Failure Risk', sys.risk, '#c62828'); cy += 28;
    drawRatingBar(x, cy, w, 'Setup Complexity', sys.complexity, '#fb8c00'); cy += 28;
    drawCostBar(x, cy, w, 'Cost to Build', sys.cost); cy += 32;

    // Best crops
    fill(DARK);
    textStyle(BOLD);
    textSize(13);
    text('Best Crops', x, cy);
    cy += 18;
    textStyle(NORMAL);
    textSize(12);
    fill(60);
    text(sys.crops, x, cy, w, 40);
    cy += 38;

    // Key insight box
    fill('#e0f2f1');
    stroke(TEAL);
    strokeWeight(1.5);
    const boxH = Math.max(60, h - (cy - y) - 4);
    rect(x, cy, w, boxH, 6);
    noStroke();
    fill(GREEN);
    textStyle(BOLD);
    textSize(12);
    text('KEY INSIGHT', x + 10, cy + 8);
    fill(DARK);
    textStyle(NORMAL);
    textSize(13);
    text(sys.insight, x + 10, cy + 26, w - 20, boxH - 30);
    pop();
}

function drawRatingBar(x, y, w, label, value, color) {
    push();
    noStroke();
    fill(60);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(12);
    text(label, x, y);

    const barY = y + 14;
    const segW = 16;
    const segGap = 4;
    const totalSegW = 5 * segW + 4 * segGap;
    const barX = x + w - totalSegW;
    for (let i = 0; i < 5; i++) {
        if (i < value) fill(color); else fill('#e5e7eb');
        noStroke();
        rect(barX + i * (segW + segGap), barY, segW, 10, 2);
    }
    // value text
    fill(60);
    textAlign(RIGHT, TOP);
    textSize(11);
    text(value + '/5', barX - 8, y + 14);
    pop();
}

function drawCostBar(x, y, w, label, value) {
    push();
    noStroke();
    fill(60);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(12);
    text(label, x, y);

    textAlign(RIGHT, TOP);
    textStyle(BOLD);
    textSize(16);
    fill(GREEN);
    let s = '';
    for (let i = 0; i < 5; i++) s += (i < value) ? '$' : '·';
    text(s, x + w, y + 12);
    pop();
}

// ---------- DIAGRAM DISPATCH ----------
function drawSystemDiagram(idx, x, y, w, h, animated) {
    push();
    // clip-like background
    noStroke();
    fill('#f1f5f9');
    rect(x, y, w, h, 4);
    // border
    noFill();
    stroke('#cbd5e1');
    strokeWeight(1);
    rect(x, y, w, h, 4);
    pop();

    switch (idx) {
        case 0: drawKratky(x, y, w, h, animated); break;
        case 1: drawDWC(x, y, w, h, animated); break;
        case 2: drawNFT(x, y, w, h, animated); break;
        case 3: drawEbbFlow(x, y, w, h, animated); break;
        case 4: drawAeroponics(x, y, w, h, animated); break;
        case 5: drawFogponics(x, y, w, h, animated); break;
    }
}

// ---------- SYSTEM DIAGRAMS ----------

function drawKratky(x, y, w, h, animated) {
    push();
    const cx = x + w / 2;
    const jarW = Math.min(w * 0.5, 140);
    const jarH = h * 0.78;
    const jarX = cx - jarW / 2;
    const jarY = y + h * 0.14;

    // Jar (mason jar shape)
    noFill();
    stroke('#7c8a99');
    strokeWeight(2);
    // body
    rect(jarX, jarY + 14, jarW, jarH - 14, 6, 6, 14, 14);
    // neck
    line(jarX + 8, jarY + 14, jarX + 8, jarY + 4);
    line(jarX + jarW - 8, jarY + 14, jarX + jarW - 8, jarY + 4);
    // lid
    fill('#cbd5e1');
    rect(jarX + 4, jarY - 4, jarW - 8, 10, 3);

    // Solution level: animated falling
    let levelFrac;
    if (animated) {
        const period = 360; // frames per cycle
        const t = (frameCount % period) / period;
        levelFrac = 0.65 - t * 0.45; // 0.65 -> 0.20 then resets
    } else {
        levelFrac = 0.45;
    }
    const solH = (jarH - 30) * levelFrac;
    const solTop = jarY + jarH - solH;
    noStroke();
    fill('#a98a5b');
    rect(jarX + 3, solTop, jarW - 6, solH - 6, 0, 0, 12, 12);

    // dashed line for original level
    stroke('#5d4037');
    strokeWeight(1);
    drawingContext.setLineDash([4, 3]);
    line(jarX + 3, jarY + jarH * 0.30, jarX + jarW - 3, jarY + jarH * 0.30);
    drawingContext.setLineDash([]);

    // Net pot at top
    noStroke();
    fill('#9ca3af');
    rect(cx - jarW * 0.22, jarY + 4, jarW * 0.44, 12, 2);
    // Plant
    fill(GREEN);
    ellipse(cx - 8, jarY - 2, 14, 10);
    ellipse(cx + 6, jarY - 4, 16, 10);
    ellipse(cx, jarY - 10, 10, 8);

    // Roots
    stroke(ROOT);
    strokeWeight(1.5);
    noFill();
    for (let i = -3; i <= 3; i++) {
        const sx = cx + i * 6;
        const ex = cx + i * 4 + Math.sin(i) * 8;
        const ey = solTop + 10 + abs(i) * 4;
        bezier(sx, jarY + 16, sx + i, jarY + 30, ex - i, ey - 10, ex, ey);
    }

    // Air gap callout
    if (animated) {
        stroke(TEAL);
        strokeWeight(1);
        noFill();
        const gapY = jarY + 18 + (solTop - (jarY + 18)) / 2;
        line(jarX - 30, gapY, jarX - 4, gapY);
        noStroke();
        fill(TEAL);
        textAlign(RIGHT, CENTER);
        textSize(11);
        text('air gap', jarX - 32, gapY);
        // labels
        fill(60);
        textAlign(LEFT, CENTER);
        text('net pot', jarX + jarW + 8, jarY + 10);
        text('solution', jarX + jarW + 8, solTop + solH / 2);
        text('roots', jarX + jarW + 8, solTop - 8);
        stroke(GRAY);
        strokeWeight(1);
        line(jarX + jarW + 6, jarY + 10, jarX + jarW, jarY + 10);
        line(jarX + jarW + 6, solTop + solH / 2, jarX + jarW, solTop + solH / 2);
        line(jarX + jarW + 6, solTop - 8, jarX + jarW, solTop - 4);
    }
    pop();
}

function drawDWC(x, y, w, h, animated) {
    push();
    const cx = x + w / 2;
    const bucketW = Math.min(w * 0.62, 200);
    const bucketH = h * 0.62;
    const bucketX = cx - bucketW / 2;
    const bucketY = y + h * 0.22;

    // Bucket
    noFill();
    stroke('#6b7280');
    strokeWeight(2);
    rect(bucketX, bucketY, bucketW, bucketH, 0, 0, 14, 14);

    // Lid
    fill('#374151');
    rect(bucketX - 4, bucketY - 6, bucketW + 8, 8, 2);

    // Solution
    noStroke();
    fill(SOLUTION);
    rect(bucketX + 3, bucketY + 8, bucketW - 6, bucketH - 12, 0, 0, 12, 12);

    // Net pot lid hole
    fill('#374151');
    ellipse(cx, bucketY - 2, bucketW * 0.30, 8);
    fill('#9ca3af');
    rect(cx - bucketW * 0.13, bucketY - 6, bucketW * 0.26, 10);

    // Plant
    fill(GREEN);
    ellipse(cx - 8, bucketY - 12, 14, 10);
    ellipse(cx + 8, bucketY - 12, 16, 10);
    ellipse(cx, bucketY - 20, 12, 10);

    // Roots
    stroke(ROOT);
    strokeWeight(1.5);
    noFill();
    for (let i = -3; i <= 3; i++) {
        const sx = cx + i * 5;
        bezier(sx, bucketY + 4, sx + i * 2, bucketY + bucketH * 0.4,
            sx - i, bucketY + bucketH * 0.7, sx + i, bucketY + bucketH * 0.85);
    }

    // Air stone at bottom
    noStroke();
    fill('#374151');
    rect(cx - 18, bucketY + bucketH - 10, 36, 6, 2);
    fill(60);
    textAlign(CENTER, TOP);
    textSize(9);
    text('air stone', cx, bucketY + bucketH - 2);

    // Bubbles
    fill(255, 255, 255, 200);
    noStroke();
    if (animated) {
        for (let i = 0; i < 18; i++) {
            const phase = (frameCount * 0.6 + i * 24) % 200;
            const bx = cx + (i % 5 - 2) * 7 + sin((frameCount + i * 10) * 0.05) * 3;
            const by = bucketY + bucketH - 12 - phase * (bucketH - 20) / 200;
            const sz = 3 + (i % 3);
            ellipse(bx, by, sz, sz);
        }
    } else {
        // static bubbles
        for (let i = 0; i < 8; i++) {
            ellipse(cx + (i - 4) * 6, bucketY + bucketH - 20 - i * 4, 4, 4);
        }
    }

    // Air pump outside bucket (right)
    stroke('#6b7280');
    strokeWeight(2);
    noFill();
    const pumpX = bucketX + bucketW + 18;
    const pumpY = bucketY + bucketH - 30;
    fill('#e5e7eb');
    rect(pumpX, pumpY, 36, 22, 3);
    noStroke();
    fill(60);
    textAlign(CENTER, TOP);
    textSize(9);
    text('air pump', pumpX + 18, pumpY + 24);

    // Tube connecting pump to air stone
    stroke('#374151');
    strokeWeight(1.5);
    noFill();
    bezier(pumpX, pumpY + 10,
        pumpX - 10, pumpY,
        bucketX + bucketW - 8, bucketY + 4,
        cx + 4, bucketY + bucketH - 8);

    if (animated) {
        noStroke();
        fill(60);
        textAlign(LEFT, CENTER);
        textSize(11);
        text('plant', cx + bucketW * 0.18 + 16, bucketY - 16);
        text('net pot lid', bucketX + bucketW + 8, bucketY - 2);
        text('oxygenated solution', bucketX + bucketW + 8, bucketY + bucketH / 2);
        stroke(GRAY);
        strokeWeight(1);
        line(bucketX + bucketW + 6, bucketY - 2, bucketX + bucketW, bucketY - 2);
        line(bucketX + bucketW + 6, bucketY + bucketH / 2, bucketX + bucketW, bucketY + bucketH / 2);
    }
    pop();
}

function drawNFT(x, y, w, h, animated) {
    push();
    const cy = y + h * 0.55;
    const chanLen = w * 0.78;
    const chanH = 22;
    const chanX = x + (w - chanLen) / 2;
    const tilt = -5 * PI / 180;

    // pivot for tilt around center
    translate(chanX + chanLen / 2, cy);
    rotate(tilt);
    translate(-chanLen / 2, 0);

    // Channel
    noFill();
    stroke('#9ca3af');
    strokeWeight(2);
    rect(0, 0, chanLen, chanH, 4);

    // Thin film of solution
    noStroke();
    fill(SOLUTION);
    rect(2, chanH - 6, chanLen - 4, 4);

    // Flowing dots
    if (animated) {
        for (let i = 0; i < 14; i++) {
            const t = (frameCount * 2 + i * 30) % (chanLen);
            fill(TEAL);
            ellipse(t, chanH - 4, 4, 3);
        }
    }

    // Plants in net cups along the channel
    const plantCount = 4;
    for (let p = 0; p < plantCount; p++) {
        const px = chanLen * (0.15 + p * 0.23);
        // net cup
        fill('#9ca3af');
        noStroke();
        rect(px - 10, -4, 20, chanH - 8, 2);
        // plant
        fill(GREEN);
        ellipse(px - 5, -10, 10, 8);
        ellipse(px + 5, -12, 12, 8);
        ellipse(px, -18, 8, 8);
        // roots
        stroke(ROOT);
        strokeWeight(1.2);
        noFill();
        line(px - 2, chanH - 8, px - 1, chanH - 2);
        line(px + 2, chanH - 8, px + 3, chanH - 2);
        line(px, chanH - 8, px, chanH - 2);
    }
    pop();

    // Outside the tilted group - reservoir and pump
    push();
    // Reservoir below the low end (right end after negative tilt = right is higher... use left as low)
    // tilt is -5 deg => left side lower. Reservoir on left.
    const resW = 60, resH = 36;
    const resX = chanX - 6;
    const resY = cy + 36;
    noFill();
    stroke('#6b7280');
    strokeWeight(2);
    rect(resX, resY, resW, resH, 0, 0, 6, 6);
    noStroke();
    fill(SOLUTION);
    rect(resX + 2, resY + 8, resW - 4, resH - 10, 0, 0, 4, 4);

    // return arrow from low end down to reservoir
    stroke(TEAL);
    strokeWeight(2);
    noFill();
    const lowX = chanX + 2;
    const lowY = cy + 12;
    line(lowX, lowY, lowX, resY);
    // arrowhead
    fill(TEAL);
    noStroke();
    triangle(lowX - 4, resY - 2, lowX + 4, resY - 2, lowX, resY + 4);

    // pump up arrow from reservoir to high end (right side)
    const highX = chanX + chanLen - 6;
    const highY = cy - 30;
    stroke(GREEN);
    strokeWeight(2);
    noFill();
    bezier(resX + resW, resY + resH / 2,
        resX + resW + 60, resY + resH / 2,
        highX, resY,
        highX, highY);
    fill(GREEN);
    noStroke();
    triangle(highX - 4, highY + 4, highX + 4, highY + 4, highX, highY - 4);

    fill(60);
    textAlign(CENTER, TOP);
    textSize(9);
    text('reservoir', resX + resW / 2, resY + resH + 2);
    text('pump', highX + 8, highY + 4);

    if (animated) {
        textAlign(LEFT, CENTER);
        textSize(11);
        text('tilted channel (~5°)', x + 8, y + 14);
        text('thin nutrient film', x + 8, y + 28);
    }
    pop();
}

function drawEbbFlow(x, y, w, h, animated) {
    push();
    const cx = x + w / 2;
    // Flood table on top
    const tableW = w * 0.78;
    const tableH = h * 0.22;
    const tableX = cx - tableW / 2;
    const tableY = y + h * 0.18;

    // Reservoir below
    const resW = tableW * 0.75;
    const resH = h * 0.28;
    const resX = cx - resW / 2;
    const resY = tableY + tableH + 36;

    // Cycle phase for animation: 0..1 = filling, 1..2 = draining
    let fillFrac = 0.5;
    let phase = 0; // 0 = filling/full, 1 = draining/empty
    if (animated) {
        const period = 360;
        const t = (frameCount % period) / period;
        if (t < 0.45) fillFrac = t / 0.45; // filling
        else if (t < 0.55) fillFrac = 1.0; // full hold
        else fillFrac = 1 - (t - 0.55) / 0.45; // draining
    } else {
        fillFrac = 0.6;
    }

    // Flood table outline
    noFill();
    stroke('#6b7280');
    strokeWeight(2);
    rect(tableX, tableY, tableW, tableH, 4);
    // Water in flood table
    noStroke();
    fill(SOLUTION);
    const waterH = (tableH - 6) * fillFrac;
    rect(tableX + 3, tableY + tableH - 3 - waterH, tableW - 6, waterH);

    // Clay pebble medium (small circles)
    fill('#a16207');
    for (let i = 0; i < 24; i++) {
        const px = tableX + 8 + (i % 12) * (tableW - 16) / 12 + 4;
        const py = tableY + tableH - 8 - Math.floor(i / 12) * 6;
        ellipse(px, py, 5, 4);
    }

    // Plants on top
    for (let p = 0; p < 3; p++) {
        const px = tableX + tableW * (0.22 + p * 0.28);
        fill(GREEN);
        noStroke();
        ellipse(px - 5, tableY - 6, 14, 10);
        ellipse(px + 6, tableY - 8, 16, 10);
        ellipse(px, tableY - 16, 10, 10);
        // stem into pebbles
        stroke('#388e3c');
        strokeWeight(2);
        line(px, tableY - 2, px, tableY + 8);
    }

    // Reservoir
    noFill();
    stroke('#6b7280');
    strokeWeight(2);
    rect(resX, resY, resW, resH, 0, 0, 6, 6);
    noStroke();
    fill(SOLUTION);
    rect(resX + 3, resY + 6, resW - 6, resH - 9, 0, 0, 4, 4);

    // Pump arrow up (left side)
    const pumpUpX = resX + resW * 0.20;
    stroke(GREEN);
    strokeWeight(2);
    noFill();
    line(pumpUpX, resY + 6, pumpUpX, tableY + tableH - 4);
    fill(GREEN);
    noStroke();
    triangle(pumpUpX - 4, tableY + tableH - 4, pumpUpX + 4, tableY + tableH - 4, pumpUpX, tableY + tableH - 12);

    // Overflow drain (right side)
    const drainX = resX + resW * 0.80;
    stroke(TEAL);
    strokeWeight(2);
    noFill();
    line(drainX, tableY + tableH - 4, drainX, resY + 6);
    fill(TEAL);
    noStroke();
    triangle(drainX - 4, resY + 6, drainX + 4, resY + 6, drainX, resY + 14);

    // Labels
    if (animated) {
        fill(60);
        textAlign(LEFT, CENTER);
        textSize(11);
        text(fillFrac > 0.5 ? 'FLOOD phase' : 'DRAIN phase', x + 8, y + 14);
        textAlign(CENTER, TOP);
        textSize(9);
        text('pump', pumpUpX, resY - 14);
        text('drain', drainX, resY - 14);
        text('reservoir', cx, resY + resH + 2);
        text('flood table', cx, tableY - 30);
    }
    pop();
}

function drawAeroponics(x, y, w, h, animated) {
    push();
    const cx = x + w / 2;
    const chW = w * 0.72;
    const chH = h * 0.60;
    const chX = cx - chW / 2;
    const chY = y + h * 0.20;

    // Sealed chamber
    noFill();
    stroke('#6b7280');
    strokeWeight(2);
    rect(chX, chY, chW, chH, 6);

    // Top lid with plant openings
    fill('#374151');
    noStroke();
    rect(chX, chY - 6, chW, 10, 4, 4, 0, 0);

    // 3 plants
    for (let p = 0; p < 3; p++) {
        const px = chX + chW * (0.20 + p * 0.30);
        fill(GREEN);
        ellipse(px - 6, chY - 12, 14, 10);
        ellipse(px + 6, chY - 14, 16, 10);
        ellipse(px, chY - 22, 10, 10);

        // Roots hanging in air
        stroke(ROOT);
        strokeWeight(1.3);
        noFill();
        for (let r = -2; r <= 2; r++) {
            bezier(px + r * 2, chY + 4,
                px + r * 4, chY + chH * 0.25,
                px - r * 3, chY + chH * 0.55,
                px + r * 2, chY + chH * 0.75);
        }
    }

    // Misting nozzles (small triangles at sides)
    fill('#374151');
    noStroke();
    triangle(chX + 6, chY + chH * 0.5, chX + 14, chY + chH * 0.5 - 4, chX + 14, chY + chH * 0.5 + 4);
    triangle(chX + chW - 6, chY + chH * 0.5, chX + chW - 14, chY + chH * 0.5 - 4, chX + chW - 14, chY + chH * 0.5 + 4);

    // Mist dots
    noStroke();
    if (animated) {
        const pulse = (sin(frameCount * 0.08) + 1) / 2; // 0..1
        const alpha = 100 + pulse * 130;
        fill(255, 255, 255, alpha);
        for (let i = 0; i < 40; i++) {
            const rx = chX + 16 + random(chW - 32);
            const ry = chY + 20 + random(chH - 30);
            const sz = 2 + random(2);
            ellipse(rx, ry, sz, sz);
        }
    } else {
        fill(255, 255, 255, 160);
        for (let i = 0; i < 18; i++) {
            const rx = chX + 18 + (i * 11) % (chW - 36);
            const ry = chY + 30 + ((i * 7) % (chH - 40));
            ellipse(rx, ry, 3, 3);
        }
    }

    // Collection trough at bottom (inside chamber)
    fill(SOLUTION);
    noStroke();
    rect(chX + 3, chY + chH - 8, chW - 6, 5);

    // High-pressure pump outside
    const pumpX = chX + chW + 12;
    const pumpY = chY + chH - 30;
    fill('#e5e7eb');
    stroke('#6b7280');
    strokeWeight(1.5);
    rect(pumpX, pumpY, 28, 22, 3);
    noStroke();
    fill(60);
    textAlign(CENTER, TOP);
    textSize(9);
    text('HP pump', pumpX + 14, pumpY + 24);

    // Tube to nozzles
    stroke('#374151');
    strokeWeight(1.5);
    noFill();
    line(pumpX, pumpY + 10, chX + chW - 4, pumpY + 10);
    line(chX + chW - 4, pumpY + 10, chX + chW - 4, chY + chH * 0.5);

    if (animated) {
        fill(60);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(11);
        text('sealed chamber', x + 8, y + 14);
        text('roots in AIR', x + 8, y + 28);
        text('mist nozzles →', chX - 78, chY + chH * 0.5);
    }
    pop();
}

function drawFogponics(x, y, w, h, animated) {
    push();
    const cx = x + w / 2;
    const chW = w * 0.72;
    const chH = h * 0.62;
    const chX = cx - chW / 2;
    const chY = y + h * 0.18;

    // Closed chamber
    noFill();
    stroke('#6b7280');
    strokeWeight(2);
    rect(chX, chY, chW, chH, 6);

    // Top lid
    fill('#374151');
    noStroke();
    rect(chX, chY - 6, chW, 10, 4, 4, 0, 0);

    // Plants
    for (let p = 0; p < 3; p++) {
        const px = chX + chW * (0.20 + p * 0.30);
        fill(GREEN);
        ellipse(px - 6, chY - 12, 14, 10);
        ellipse(px + 6, chY - 14, 16, 10);
        ellipse(px, chY - 22, 10, 10);
        // Roots
        stroke(ROOT);
        strokeWeight(1.3);
        noFill();
        for (let r = -2; r <= 2; r++) {
            bezier(px + r * 2, chY + 4,
                px + r * 3, chY + chH * 0.3,
                px - r * 2, chY + chH * 0.55,
                px + r * 1, chY + chH * 0.7);
        }
    }

    // Reservoir water at bottom (~lower 25%)
    noStroke();
    fill(SOLUTION);
    const waterY = chY + chH * 0.78;
    rect(chX + 3, waterY, chW - 6, chH * 0.22 - 3, 0, 0, 4, 4);

    // Ultrasonic fogger disk at bottom center
    fill('#9ca3af');
    stroke('#374151');
    strokeWeight(1);
    const foggerX = cx;
    const foggerY = chY + chH - 8;
    ellipse(foggerX, foggerY, 28, 6);
    // Wave lines above fogger
    stroke(TEAL);
    strokeWeight(1.5);
    noFill();
    for (let i = 0; i < 3; i++) {
        const wy = foggerY - 6 - i * 4;
        arc(foggerX, wy, 22 - i * 2, 8, PI, TWO_PI);
    }

    // Fog particles drifting up
    noStroke();
    if (animated) {
        for (let i = 0; i < 50; i++) {
            const seed = i * 37.7;
            const phase = (frameCount * 0.5 + seed) % 240;
            const fx = chX + 12 + ((seed * 13) % (chW - 24)) + sin((frameCount + seed) * 0.02) * 6;
            const fy = waterY - 6 - phase * (chH * 0.7) / 240;
            const alpha = 180 * (1 - phase / 240);
            fill(255, 255, 255, alpha);
            const sz = 4 + (i % 4);
            ellipse(fx, fy, sz, sz);
        }
    } else {
        fill(255, 255, 255, 140);
        for (let i = 0; i < 22; i++) {
            const fx = chX + 14 + (i * 17) % (chW - 28);
            const fy = waterY - 8 - ((i * 9) % (chH * 0.6));
            ellipse(fx, fy, 5, 5);
        }
    }

    if (animated) {
        fill(60);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(11);
        text('closed chamber', x + 8, y + 14);
        text('fog (<50 μm droplets)', x + 8, y + 28);
        textAlign(CENTER, TOP);
        textSize(9);
        text('ultrasonic fogger', foggerX, foggerY + 6);
    }
    pop();
}

// ---------- INTERACTION ----------
function mousePressed() {
    if (currentView === 'gallery') {
        for (const b of thumbBounds) {
            if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
                selectedSystem = b.idx;
                currentView = 'detail';
                backBtn.show();
                positionBackBtn();
                return;
            }
        }
    }
}
