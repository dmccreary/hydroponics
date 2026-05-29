// Plant Life Cycle Stages Explorer - p5.js circular diagram
// CANVAS_HEIGHT: 620
let canvasWidth = 760;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;

const stages = [
    { id: 0, label: 'Germination', icon: 'seed', color: [144, 164, 174],
      title: 'Seed / Germination (3–7 days)',
      details: [
        'Temperature: 65–75°F (18–24°C)',
        'Media: moist, not soaked — oxygen is critical',
        'No nutrient solution yet — seed has its own food',
        'Light not required until cotyledons emerge',
        'Most growers use rockwool, rapid rooters, or peat pellets'
      ]},
    { id: 1, label: 'Seedling', icon: 'sprout', color: [129, 199, 132],
      title: 'Seedling (7–14 days from germination)',
      details: [
        'First true leaves present',
        'Introduce dilute nutrient solution: EC 0.5–0.8 mS/cm',
        'Photoperiod: 18h light',
        'Roots fragile — handle by leaves only',
        'Transplant to main system when 2–3 true leaves are open'
      ]},
    { id: 2, label: 'Vegetative', icon: 'plant', color: [76, 175, 80],
      title: 'Vegetative Growth (2–8 weeks)',
      details: [
        'High nitrogen — N:P:K ratio favors N',
        'EC: 1.5–2.5 mS/cm depending on crop',
        'Photoperiod: 18h for most crops',
        'Rapid leaf expansion; canopy fills out',
        'Begin training or pruning of tall varieties'
      ]},
    { id: 3, label: 'Flowering', icon: 'bud', color: [255, 183, 77],
      title: 'Transition to Flowering (1–3 weeks)',
      details: [
        'Reduce nitrogen; increase phosphorus and potassium',
        'Photoperiod change (12h) triggers flowering in many crops',
        'Watch for calcium deficiency — buds need Ca for cell walls',
        'Pollination support if needed (gentle shaking for tomatoes)',
        'EC may rise as plant draws more nutrients'
      ]},
    { id: 4, label: 'Fruiting', icon: 'fruit', color: [255, 138, 101],
      title: 'Fruiting / Harvest',
      details: [
        'Maximum K for sugar translocation to fruit',
        'Maintain Ca for cell wall integrity in fruit',
        'Monitor EC closely — overconcentration causes blossom-end rot',
        'First harvest begins; continuous picking for indeterminate varieties',
        'Timeline varies by crop: lettuce 30–45 days, tomato 70–100 days'
      ]},
    { id: 5, label: 'Reset', icon: 'scissors', color: [120, 144, 156],
      title: 'Harvest / System Reset',
      details: [
        'Cut at base for leafy greens; pick individual fruit for fruiting crops',
        'Cool harvest immediately (0–4°C) to preserve shelf life',
        'Drain reservoir completely; flush lines with clean water',
        'Disinfect with H₂O₂ or chlorine before next cycle (Ch. 7)',
        'Plan crop rotation: alternate heavy and light feeders'
      ]}
];

let selectedStage = null;
let nodePositions = [];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');
    computeNodePositions();

    const resetBtn = createButton('Clear Selection');
    resetBtn.position(10, drawHeight + 10);
    resetBtn.mousePressed(() => { selectedStage = null; });
}

function computeNodePositions() {
    nodePositions = [];
    const cx = width / 2;
    const cy = drawHeight / 2 - 10;
    const r = Math.min(width, drawHeight) * 0.34;
    for (let i = 0; i < stages.length; i++) {
        const angle = -PI / 2 + (i * TWO_PI / stages.length);
        nodePositions.push({
            x: cx + cos(angle) * r,
            y: cy + sin(angle) * r,
            angle: angle
        });
    }
}

function draw() {
    background(248, 249, 250);
    const cx = width / 2;
    const cy = drawHeight / 2 - 10;
    const r = Math.min(width, drawHeight) * 0.34;

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('Plant Life Cycle in Hydroponics', width / 2, 6);
    pop();

    // Arrows between stages (circular flow)
    push();
    stroke(120);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < stages.length; i++) {
        const a1 = -PI / 2 + (i * TWO_PI / stages.length);
        const a2 = -PI / 2 + ((i + 1) % stages.length * TWO_PI / stages.length);
        const ar = r + 35;
        arc(cx, cy, ar * 2, ar * 2, a1 + 0.18, a2 - 0.18);
        // arrowhead at end
        const ax = cx + cos(a2 - 0.2) * ar;
        const ay = cy + sin(a2 - 0.2) * ar;
        const tx = cx + cos(a2 - 0.15) * ar;
        const ty = cy + sin(a2 - 0.15) * ar;
        push();
        translate(ax, ay);
        rotate(atan2(ty - ay, tx - ax));
        fill(120);
        noStroke();
        triangle(0, 0, -8, -4, -8, 4);
        pop();
    }
    pop();

    // Central reservoir icon
    push();
    fill(178, 235, 242);
    stroke(0, 131, 143);
    strokeWeight(2);
    ellipse(cx, cy, 95, 60);
    fill(0, 96, 100);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Nutrient', cx, cy - 8);
    text('Reservoir', cx, cy + 6);
    pop();

    // Stage nodes
    for (let i = 0; i < stages.length; i++) {
        const s = stages[i];
        const pos = nodePositions[i];
        const isSel = selectedStage === i;
        const radius = isSel ? 60 : 52;

        push();
        fill(s.color[0], s.color[1], s.color[2]);
        if (isSel) {
            stroke(46, 125, 50);
            strokeWeight(4);
        } else {
            stroke(255);
            strokeWeight(2);
        }
        circle(pos.x, pos.y, radius);
        pop();

        // Icon
        drawStageIcon(s.icon, pos.x, pos.y - 4, isSel);

        // Label
        push();
        fill(33);
        noStroke();
        textSize(11);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(s.label, pos.x, pos.y + radius / 2 + 12);
        pop();
    }

    // Detail panel below
    drawDetailPanel();
}

function drawStageIcon(icon, x, y, big) {
    push();
    translate(x, y);
    const s = big ? 1.2 : 1.0;
    scale(s);
    noStroke();
    switch (icon) {
        case 'seed':
            fill(121, 85, 72);
            ellipse(0, 0, 16, 22);
            break;
        case 'sprout':
            fill(46, 125, 50);
            // stem
            rect(-1, -2, 2, 12);
            // two leaves
            ellipse(-6, -2, 10, 6);
            ellipse(6, -2, 10, 6);
            break;
        case 'plant':
            fill(46, 125, 50);
            rect(-1, 0, 2, 14);
            ellipse(-8, -4, 12, 8);
            ellipse(8, -4, 12, 8);
            ellipse(0, -10, 14, 8);
            break;
        case 'bud':
            fill(46, 125, 50);
            rect(-1, 0, 2, 14);
            ellipse(-7, 2, 10, 6);
            ellipse(7, 2, 10, 6);
            fill(255, 235, 59);
            circle(0, -8, 10);
            break;
        case 'fruit':
            fill(46, 125, 50);
            rect(-1, -10, 2, 6);
            ellipse(-7, -8, 8, 5);
            fill(244, 67, 54);
            circle(0, 2, 18);
            fill(255);
            ellipse(-3, -1, 3, 3);
            break;
        case 'scissors':
            stroke(33);
            strokeWeight(2);
            line(-8, -8, 8, 8);
            line(-8, 8, 8, -8);
            noStroke();
            fill(33);
            circle(-8, -8, 5);
            circle(-8, 8, 5);
            break;
    }
    pop();
}

function drawDetailPanel() {
    const py = drawHeight + 50;
    const ph = controlHeight - 60;
    push();
    noStroke();
    fill(255);
    rect(10, py, width - 20, ph, 4);
    stroke(222, 226, 230);
    noFill();
    rect(10, py, width - 20, ph, 4);

    fill(33);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    if (selectedStage === null) {
        fill(108, 117, 125);
        text('Click any stage node above to see nutrient, photoperiod, and timeline details. Stages flow clockwise from germination back to system reset.', 20, py + 8, width - 40);
    } else {
        const s = stages[selectedStage];
        textStyle(BOLD);
        fill(46, 125, 50);
        textSize(12);
        text(s.title, 20, py + 8);
        textStyle(NORMAL);
        fill(33);
        textSize(11);
        let dy = py + 30;
        for (const d of s.details) {
            text('• ' + d, 20, dy, width - 40);
            dy += 14;
        }
    }
    pop();
}

function mousePressed() {
    if (mouseY > drawHeight) return;
    for (let i = 0; i < stages.length; i++) {
        const pos = nodePositions[i];
        const d = dist(mouseX, mouseY, pos.x, pos.y);
        if (d < 30) {
            selectedStage = i;
            return;
        }
    }
    selectedStage = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    computeNodePositions();
}
