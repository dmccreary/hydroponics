// Photosynthesis and Respiration Cycle - p5.js step-through
// CANVAS_HEIGHT: 620
let canvasWidth = 760;
let drawHeight = 480;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;

let stage = 0;
let lightsOn = true;
let glucosePool = 0;
let nextBtn, prevBtn, resetBtn, lightsBtn;

const stages = [
    { title: 'Stage 0: Inputs available',
      equation: '—',
      molecules: { CO2: 6, H2O: 6, O2_in: 0, Glucose: 0, ATP: 0 },
      narrative: 'Sunlight strikes the leaf. CO₂ diffuses through stomata. Water arrives at the root tip from the nutrient solution.' },
    { title: 'Stage 1: Light reactions',
      equation: '6 H₂O → 6 O₂ + ATP + NADPH',
      molecules: { CO2: 6, H2O: 0, O2_in: 6, Glucose: 0, ATP: 0 },
      narrative: 'In the thylakoid membrane, light splits 6 H₂O into 6 O₂ (released through stomata) and produces ATP and NADPH for the next stage.' },
    { title: 'Stage 2: Calvin cycle',
      equation: '6 CO₂ + ATP + NADPH → C₆H₁₂O₆',
      molecules: { CO2: 0, H2O: 0, O2_in: 0, Glucose: 1, ATP: 0 },
      narrative: 'In the stroma, 6 CO₂ are fixed into one glucose molecule using the ATP and NADPH from Stage 1. Glucose accumulates in the leaf.' },
    { title: 'Stage 3: Phloem transport',
      equation: 'Glucose moves leaf → root via phloem',
      molecules: { CO2: 0, H2O: 0, O2_in: 0, Glucose: 1, ATP: 0 },
      narrative: 'Sugar is loaded into phloem and transported down the plant. The root cell will use it for respiration and growth.' },
    { title: 'Stage 4: Respiration setup',
      equation: 'Glucose + O₂ arrive at mitochondrion',
      molecules: { CO2: 0, H2O: 0, O2_in: 6, Glucose: 1, ATP: 0 },
      narrative: 'O₂ from the nutrient solution diffuses into root cells. Glucose meets oxygen at the mitochondrion.' },
    { title: 'Stage 5: Cellular respiration',
      equation: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ATP',
      molecules: { CO2: 6, H2O: 6, O2_in: 0, Glucose: 0, ATP: 36 },
      narrative: 'Glucose is oxidized. The mitochondrion produces ~36 ATP per glucose, the energy currency the root cell now spends.' },
    { title: 'Stage 6: Active nutrient uptake',
      equation: 'ATP powers K⁺ pump',
      molecules: { CO2: 6, H2O: 6, O2_in: 0, Glucose: 0, ATP: 35 },
      narrative: 'ATP fuels active transport pumps in the root membrane, pulling K⁺ (and other ions) into the cell against the concentration gradient. This is why root oxygen matters: no O₂ → no ATP → no nutrient uptake.' }
];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    prevBtn = createButton('◀ Previous');
    prevBtn.position(10, drawHeight + 10);
    prevBtn.mousePressed(() => { stage = Math.max(0, stage - 1); });

    nextBtn = createButton('Next ▶');
    nextBtn.position(110, drawHeight + 10);
    nextBtn.mousePressed(() => { stage = Math.min(stages.length - 1, stage + 1); });

    resetBtn = createButton('Reset');
    resetBtn.position(195, drawHeight + 10);
    resetBtn.mousePressed(() => { stage = 0; lightsOn = true; lightsBtn.html('Lights: ON'); });

    lightsBtn = createButton('Lights: ON');
    lightsBtn.position(265, drawHeight + 10);
    lightsBtn.mousePressed(() => {
        lightsOn = !lightsOn;
        lightsBtn.html('Lights: ' + (lightsOn ? 'ON' : 'OFF'));
    });
}

function draw() {
    background(248, 249, 250);
    drawScene();
    drawRightPanel();
    drawControlsBackground();
    drawStageInfo();
}

function drawScene() {
    const sceneW = width * 0.65;
    const sceneH = drawHeight - 30;
    const cx = 10, cy = 35;

    push();
    noStroke();
    fill(255);
    rect(cx, cy, sceneW, sceneH, 6);
    stroke(222, 226, 230);
    noFill();
    rect(cx, cy, sceneW, sceneH, 6);
    pop();

    // Sun (only when lights on and stages 0-3)
    if (lightsOn && stage <= 3) {
        push();
        noStroke();
        fill(255, 213, 79);
        circle(cx + 40, cy + 30, 28);
        stroke(255, 213, 79);
        strokeWeight(2);
        for (let a = 0; a < TWO_PI; a += PI / 4) {
            line(cx + 40 + cos(a) * 18, cy + 30 + sin(a) * 18, cx + 40 + cos(a) * 26, cy + 30 + sin(a) * 26);
        }
        // sunlight arrows to leaf
        stroke(255, 193, 7);
        strokeWeight(2);
        for (let i = 0; i < 3; i++) {
            const xa = cx + 55 + i * 20, ya = cy + 45;
            const xb = cx + 100 + i * 20, yb = cy + 90;
            line(xa, ya, xb, yb);
            triangle(xb, yb, xb - 5, yb - 4, xb - 2, yb - 8);
        }
        pop();
    }

    // Leaf cell (top half)
    const leafX = cx + 90, leafY = cy + 70, leafW = sceneW - 130, leafH = 150;
    push();
    fill(200, 230, 201);
    stroke(56, 142, 60);
    strokeWeight(2);
    rect(leafX, leafY, leafW, leafH, 16);
    // Chloroplast
    const chlActive = (stage === 1 || stage === 2);
    fill(chlActive ? color(76, 175, 80) : color(165, 214, 167));
    stroke(46, 125, 50);
    ellipse(leafX + leafW / 2, leafY + leafH / 2, 110, 60);
    fill(255);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Chloroplast', leafX + leafW / 2, leafY + leafH / 2);
    textStyle(NORMAL);
    fill(33);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Leaf cell', leafX + 8, leafY + 8);
    // Stomata
    fill(120);
    rect(leafX + 30, leafY + leafH - 6, 18, 4, 2);
    rect(leafX + leafW - 50, leafY + leafH - 6, 18, 4, 2);
    pop();

    // Phloem (vertical pipe between leaf and root)
    const phX = cx + sceneW / 2 - 10, phY = leafY + leafH, phW = 20, phH = 50;
    push();
    fill(244, 143, 177);
    stroke(173, 20, 87);
    strokeWeight(1.5);
    rect(phX, phY, phW, phH, 4);
    fill(33);
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);
    text('phloem', phX + phW + 6, phY + phH / 2);
    pop();

    // Root cell (bottom half)
    const rootX = cx + 90, rootY = phY + phH + 10, rootW = sceneW - 130, rootH = 130;
    push();
    fill(255, 224, 178);
    stroke(191, 102, 0);
    strokeWeight(2);
    rect(rootX, rootY, rootW, rootH, 16);
    // Mitochondrion
    const mitoActive = (stage >= 4);
    fill(mitoActive ? color(255, 152, 0) : color(255, 204, 128));
    stroke(230, 81, 0);
    ellipse(rootX + rootW / 2, rootY + rootH / 2, 110, 56);
    fill(255);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Mitochondrion', rootX + rootW / 2, rootY + rootH / 2);
    textStyle(NORMAL);
    fill(33);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Root cell', rootX + 8, rootY + 8);
    pop();

    // K+ pump on root cell membrane (stage 6)
    if (stage === 6) {
        push();
        fill(0, 188, 212);
        stroke(0, 131, 143);
        strokeWeight(2);
        rect(rootX + rootW - 10, rootY + rootH / 2 - 10, 20, 20, 4);
        fill(33);
        noStroke();
        textSize(10);
        textAlign(LEFT, CENTER);
        textStyle(BOLD);
        text('K⁺ pump', rootX + rootW + 14, rootY + rootH / 2);
        textStyle(NORMAL);
        // K+ moving in
        fill(156, 39, 176);
        circle(rootX + rootW + 22, rootY + rootH / 2 - 18, 8);
        stroke(156, 39, 176);
        strokeWeight(2);
        line(rootX + rootW + 22, rootY + rootH / 2 - 12, rootX + rootW, rootY + rootH / 2);
        noStroke();
        text('K⁺', rootX + rootW + 32, rootY + rootH / 2 - 18);
        pop();
    }

    // Stage-specific overlays: CO2, O2, glucose icons
    drawMoleculeIcons(cx, cy, sceneW, sceneH, leafX, leafY, leafW, leafH, phX, phY, phW, phH, rootX, rootY, rootW, rootH);
}

function drawMoleculeIcons(cx, cy, sceneW, sceneH, lx, ly, lw, lh, px, py, pw, ph, rx, ry, rw, rh) {
    const s = stages[stage].molecules;
    push();
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    // CO2 entering leaf (stages 0,1)
    if (s.CO2 > 0 && stage <= 2) {
        fill(96, 125, 139);
        for (let i = 0; i < Math.min(s.CO2, 6); i++) {
            const xx = lx + 20 + i * 18, yy = ly - 14;
            noStroke();
            circle(xx, yy, 12);
            fill(255);
            text('CO₂', xx, yy);
            fill(96, 125, 139);
        }
    }
    // O2 leaving leaf (stage 1)
    if (stage === 1) {
        fill(76, 175, 80);
        for (let i = 0; i < 6; i++) {
            const xx = lx + lw - 20 - i * 16, yy = ly + lh + 14;
            noStroke();
            circle(xx, yy, 12);
            fill(255);
            text('O₂', xx, yy);
            fill(76, 175, 80);
        }
    }
    // Water entering root (stage 0)
    if (stage === 0) {
        fill(33, 150, 243);
        for (let i = 0; i < 6; i++) {
            const xx = rx - 18, yy = ry + 20 + i * 16;
            noStroke();
            circle(xx, yy, 12);
            fill(255);
            text('H₂O', xx, yy);
            fill(33, 150, 243);
        }
    }
    // Glucose in leaf (stage 2-3)
    if (stage >= 2 && stage <= 4) {
        fill(255, 152, 0);
        noStroke();
        circle(lx + lw - 30, ly + 30, 14);
        fill(255);
        text('C₆', lx + lw - 30, ly + 30);
    }
    // Glucose moving down phloem (stage 3)
    if (stage === 3) {
        fill(255, 152, 0);
        noStroke();
        circle(px + pw / 2, py + ph / 2, 12);
        fill(255);
        text('C₆', px + pw / 2, py + ph / 2);
    }
    // Glucose + O2 in root (stage 4)
    if (stage === 4) {
        fill(255, 152, 0);
        noStroke();
        circle(rx + 30, ry + 30, 14);
        fill(255);
        text('C₆', rx + 30, ry + 30);
        fill(76, 175, 80);
        circle(rx + 60, ry + 30, 12);
        fill(255);
        text('O₂', rx + 60, ry + 30);
    }
    // CO2 and H2O out of root (stage 5)
    if (stage === 5) {
        fill(96, 125, 139);
        noStroke();
        for (let i = 0; i < 3; i++) {
            const xx = rx + 30 + i * 18, yy = ry + rh + 14;
            circle(xx, yy, 12);
            fill(255);
            text('CO₂', xx, yy);
            fill(96, 125, 139);
        }
        fill(33, 150, 243);
        for (let i = 0; i < 3; i++) {
            const xx = rx + 100 + i * 18, yy = ry + rh + 14;
            circle(xx, yy, 12);
            fill(255);
            text('H₂O', xx, yy);
            fill(33, 150, 243);
        }
    }
    // ATP burst (stages 5,6)
    if (stage >= 5) {
        fill(255, 235, 59);
        stroke(245, 127, 23);
        strokeWeight(2);
        const ax = rx + rw - 40, ay = ry + 30;
        for (let a = 0; a < TWO_PI; a += PI / 5) {
            line(ax, ay, ax + cos(a) * 14, ay + sin(a) * 14);
        }
        noStroke();
        fill(255, 235, 59);
        circle(ax, ay, 16);
        fill(33);
        textStyle(BOLD);
        text('ATP', ax, ay);
    }
    pop();
}

function drawRightPanel() {
    const px = width * 0.65 + 18, py = 35;
    const pw = width - px - 10, ph = drawHeight - 50;
    push();
    fill(255);
    stroke(222, 226, 230);
    rect(px, py, pw, ph, 6);

    fill(46, 125, 50);
    noStroke();
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Step ' + stage + ' / ' + (stages.length - 1), px + 10, py + 10);

    fill(33);
    textSize(12);
    text(stages[stage].title, px + 10, py + 32, pw - 20);

    fill(0, 121, 107);
    textStyle(BOLD);
    textSize(11);
    text('Equation', px + 10, py + 90);
    fill(33);
    textStyle(NORMAL);
    text(stages[stage].equation, px + 10, py + 106, pw - 20);

    fill(0, 121, 107);
    textStyle(BOLD);
    textSize(11);
    text('Molecule counts', px + 10, py + 160);
    fill(33);
    textStyle(NORMAL);
    textSize(11);
    const s = stages[stage].molecules;
    let y = py + 178;
    text('CO₂ available:   ' + s.CO2, px + 10, y); y += 16;
    text('H₂O available:  ' + s.H2O, px + 10, y); y += 16;
    text('O₂ available:    ' + s.O2_in, px + 10, y); y += 16;
    text('Glucose pool:   ' + s.Glucose, px + 10, y); y += 16;
    text('ATP produced: ' + s.ATP, px + 10, y);
    pop();
}

function drawControlsBackground() {
    push();
    noStroke();
    fill(241, 243, 245);
    rect(0, drawHeight, width, controlHeight);
    stroke(222, 226, 230);
    line(0, drawHeight, width, drawHeight);
    pop();
}

function drawStageInfo() {
    push();
    fill(33);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    let msg = stages[stage].narrative;
    if (!lightsOn && stage <= 2) {
        msg = 'Lights are OFF. Photosynthesis stages produce nothing. Glucose pool would deplete as respiration continues. Toggle lights back on or step into respiration stages to see the cycle continue.';
    }
    text(msg, 10, drawHeight + 60, width - 20);
    pop();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
}
