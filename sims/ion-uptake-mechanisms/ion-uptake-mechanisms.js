// Ion Uptake Mechanisms Comparison - p5.js side-by-side step-through
// CANVAS_HEIGHT: 600
let canvasWidth = 760;
let drawHeight = 460;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;

let step = 0;
let oxygenPresent = true;
let stepBtn, prevBtn, resetBtn, o2Btn;

// State that updates with steps
const steps = [
    {
        label: 'Step 0: Initial concentrations',
        passive: { out: 200, in: 20, ions: 0, atp: 0 },
        active:  { out: 50,  in: 500, ions: 0, atp: 0 },
        explain: 'Both panels start at rest. Passive (left): solution NO₃⁻ = 200 units, cell interior = 20 — gradient favors INWARD movement. Active (right): solution K⁺ = 50, cell interior = 500 — gradient favors OUTWARD movement (against uptake).'
    },
    {
        label: 'Step 1: Diffusion through channels',
        passive: { out: 197, in: 23, ions: 3, atp: 0 },
        active:  { out: 50,  in: 500, ions: 0, atp: 0 },
        explain: 'Passive: 3 NO₃⁻ ions move through ion channels down their gradient. No ATP consumed. Active: no movement yet — pump not engaged.'
    },
    {
        label: 'Step 2: Active transport pumps a K⁺',
        passive: { out: 194, in: 26, ions: 6, atp: 0 },
        active:  { out: 49,  in: 501, ions: 1, atp: 1 },
        explain: 'Passive continues to drift inward. Active: pump consumes 1 ATP to move one K⁺ ion from solution (50) INTO the cell (already at 500 — uphill). Pump shape change releases ATP as ADP + Pᵢ.'
    },
    {
        label: 'Step 3: Oxygen toggle test',
        passive: { out: 191, in: 29, ions: 9, atp: 0 },
        active:  { out: 49,  in: 501, ions: 1, atp: 1 },
        explain: oxygenPresent
            ? 'O₂ is present. Passive continues diffusion. Active pump can continue (more ATP available). This is the normal hydroponic root environment.'
            : 'O₂ REMOVED. Passive diffusion continues unchanged — it does not need ATP. But the active pump STOPS: no O₂ → no respiration → no ATP → no uptake. This is what happens in oxygen-starved roots.'
    }
];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    prevBtn = createButton('◀ Previous');
    prevBtn.position(10, drawHeight + 10);
    prevBtn.mousePressed(() => { step = Math.max(0, step - 1); });

    stepBtn = createButton('Next Step ▶');
    stepBtn.position(110, drawHeight + 10);
    stepBtn.mousePressed(() => { step = Math.min(steps.length - 1, step + 1); });

    resetBtn = createButton('Reset');
    resetBtn.position(220, drawHeight + 10);
    resetBtn.mousePressed(() => { step = 0; oxygenPresent = true; o2Btn.html('O₂: Present'); });

    o2Btn = createButton('O₂: Present');
    o2Btn.position(285, drawHeight + 10);
    o2Btn.mousePressed(() => {
        oxygenPresent = !oxygenPresent;
        o2Btn.html('O₂: ' + (oxygenPresent ? 'Present' : 'Removed'));
    });
}

function draw() {
    background(248, 249, 250);

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('Passive Diffusion vs Active Transport', width / 2, 6);
    pop();

    const panelTop = 28;
    const panelH = drawHeight - panelTop - 10;
    const leftW = width * 0.48;
    const rightX = width * 0.52;
    const rightW = width * 0.48;

    drawPanel(5, panelTop, leftW, panelH, 'Passive Diffusion (Channel Protein)',
              steps[step].passive, color(33, 150, 243), 'NO₃⁻', false);
    drawPanel(rightX, panelTop, rightW, panelH, 'Active Transport (ATP-Powered Pump)',
              steps[step].active, color(255, 152, 0), 'K⁺', true);

    drawControlsBackground();
    drawStepInfo();
}

function drawPanel(x, y, w, h, title, state, ionColor, ionLabel, isActive) {
    push();
    fill(255);
    stroke(222, 226, 230);
    rect(x, y, w, h, 6);

    // Title
    fill(0, 121, 107);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(title, x + w / 2, y + 6);

    // Layout inside panel
    const midX = x + w / 2;
    const memTop = y + 35;
    const memBottom = y + h - 70;

    // Solution side label
    fill(33);
    textSize(10);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    text('Solution side', x + 8, memTop);
    text('Cell interior', x + w - 70, memTop);

    // Concentration bars
    const barMaxH = memBottom - memTop - 20;
    const outConc = state.out;
    const inConc = state.in;
    const maxScale = isActive ? 600 : 220;

    // Left bar (solution)
    const lbH = (outConc / maxScale) * barMaxH;
    noStroke();
    fill(ionColor);
    rect(x + 10, memBottom - lbH, 22, lbH);
    fill(33);
    textSize(10);
    textAlign(LEFT, BOTTOM);
    text(outConc + ' u', x + 10, memBottom - lbH - 3);

    // Right bar (cell)
    const rbH = (inConc / maxScale) * barMaxH;
    noStroke();
    fill(ionColor);
    rect(x + w - 32, memBottom - rbH, 22, rbH);
    fill(33);
    textSize(10);
    textAlign(LEFT, BOTTOM);
    text(inConc + ' u', x + w - 32, memBottom - rbH - 3);

    // Membrane (vertical line in middle)
    stroke(120);
    strokeWeight(3);
    line(midX, memTop + 25, midX, memBottom);
    // membrane phospholipid heads
    noStroke();
    fill(255, 235, 59);
    for (let cy = memTop + 30; cy < memBottom; cy += 14) {
        circle(midX - 4, cy, 6);
        circle(midX + 4, cy, 6);
    }

    // Channel or pump in middle of membrane
    const proteinY = (memTop + memBottom) / 2;
    if (isActive) {
        // Pump (oval, brown)
        const grayed = !oxygenPresent && step >= 3;
        push();
        fill(grayed ? color(189, 189, 189) : color(141, 110, 99));
        stroke(grayed ? color(120, 120, 120) : color(78, 52, 46));
        strokeWeight(2);
        ellipse(midX, proteinY, 30, 50);
        // ATP icon
        if (!grayed) {
            fill(255, 235, 59);
            noStroke();
            circle(midX - 22, proteinY - 20, 14);
            fill(33);
            textSize(8);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text('ATP', midX - 22, proteinY - 20);
        } else {
            fill(120);
            noStroke();
            textSize(9);
            textAlign(CENTER, CENTER);
            text('no ATP', midX, proteinY + 35);
        }
        pop();
    } else {
        // Channel (rectangle, opens both sides)
        push();
        fill(178, 223, 238);
        stroke(2, 119, 189);
        strokeWeight(2);
        rect(midX - 10, proteinY - 25, 20, 50, 4);
        pop();
    }

    // Gradient arrow
    push();
    stroke(33);
    strokeWeight(2);
    fill(33);
    if (outConc > inConc) {
        // inward arrow
        line(midX - 50, proteinY, midX + 50, proteinY);
        triangle(midX + 50, proteinY, midX + 42, proteinY - 5, midX + 42, proteinY + 5);
        noStroke();
        textSize(10);
        textAlign(CENTER, BOTTOM);
        text('gradient → inward', midX, proteinY - 6);
    } else if (inConc > outConc) {
        // outward arrow (gradient favors outward but transport may go inward)
        stroke(244, 67, 54);
        fill(244, 67, 54);
        line(midX + 50, proteinY, midX - 50, proteinY);
        triangle(midX - 50, proteinY, midX - 42, proteinY - 5, midX - 42, proteinY + 5);
        noStroke();
        textSize(10);
        textAlign(CENTER, BOTTOM);
        text('gradient → outward (uphill)', midX, proteinY - 6);
    }
    pop();

    // Ion dots crossing
    const grayed = isActive && !oxygenPresent && step >= 3;
    const movingCount = Math.min(state.ions, 8);
    push();
    noStroke();
    fill(grayed && isActive ? color(189, 189, 189) : ionColor);
    for (let i = 0; i < movingCount; i++) {
        const px = midX + 15 + i * 6;
        const py2 = proteinY - 30 + i * 4;
        circle(px, py2, 7);
    }
    pop();

    // ATP counter (active panel only)
    if (isActive) {
        push();
        fill(0, 121, 107);
        noStroke();
        textSize(11);
        textStyle(BOLD);
        textAlign(LEFT, BOTTOM);
        text('ATP consumed: ' + state.atp, x + 10, y + h - 8);
        pop();
    } else {
        push();
        fill(0, 121, 107);
        noStroke();
        textSize(11);
        textStyle(BOLD);
        textAlign(LEFT, BOTTOM);
        text('ATP consumed: 0', x + 10, y + h - 8);
        pop();
    }
    pop();

    // Footer label
    push();
    fill(108, 117, 125);
    noStroke();
    textSize(10);
    textAlign(LEFT, BOTTOM);
    text('Ion: ' + ionLabel + (isActive ? '  (also Ca²⁺, NH₄⁺)' : '  (also Cl⁻, NO₃⁻)'),
         x + w / 2 + 20, y + h - 8);
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

function drawStepInfo() {
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(steps[step].label, 10, drawHeight + 50);
    textStyle(NORMAL);
    fill(33);
    textSize(11);
    text(steps[step].explain, 10, drawHeight + 70, width - 20);
    pop();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
}
