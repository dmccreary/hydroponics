// HACCP Risk Matrix — p5.js
// CANVAS_HEIGHT: 660
let canvasWidth = 960;
let drawHeight = 500;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let cropSel, waterSel, scaleSel, consumerSel;
let planBtn, closeDetailBtn;

let dirty = true;
let hazardScores = []; // computed per-frame on dirty
let selectedHazard = null;
let cardRects = []; // hit-test rectangles for hazards

// --- Hazard catalog ---
const HAZARDS = [
    {
        id: 'water',
        name: 'Contaminated water',
        baseP: 2, baseS: 2,
        ccp: 'Water Quality at Source',
        monitoring: 'Test for total coliform monthly; check chlorine/UV daily',
        criticalLimit: '<1 CFU/100 mL coliform; UV dose >40 mJ/cm²',
        corrective: 'Disinfect with UV; re-test before use; switch source if recurring',
        meaning: 'Pathogens enter the system through irrigation water that has not been adequately treated or tested.',
        pathogens: 'E. coli O157:H7, Salmonella, Cryptosporidium',
        steps: [
            'Test source water quarterly for coliforms and heavy metals',
            'UV sterilize incoming water before reservoir entry',
            'Maintain reservoir cleanliness and sealed lid',
            'Replace sediment and carbon filters per schedule',
            'Document every test result with date and operator'
        ]
    },
    {
        id: 'biofilm',
        name: 'Biofilm',
        baseP: 3, baseS: 2,
        ccp: 'Reservoir & Channel Sanitation',
        monitoring: 'Visual inspection weekly; ATP swab monthly',
        criticalLimit: 'ATP RLU <100; no visible slime on channel walls',
        corrective: 'Drain, scrub with food-grade sanitizer (e.g., peracetic acid); flush twice',
        meaning: 'Microbial communities form slimy layers on wet surfaces, harboring pathogens and degrading water quality.',
        pathogens: 'Legionella, Pseudomonas, Listeria',
        steps: [
            'Use opaque containers and tubing to block light',
            'Sanitize reservoir weekly between batches',
            'Brush channel walls and net cups on each turnover',
            'Flush nutrient lines monthly with cleaning solution',
            'Replace tubing annually or sooner if discolored'
        ]
    },
    {
        id: 'worker',
        name: 'Worker hygiene',
        baseP: 2, baseS: 2,
        ccp: 'Personnel Hygiene & Training',
        monitoring: 'Glove and hand-wash checklist each shift; illness log',
        criticalLimit: 'Zero work-when-sick incidents; 100% training completion',
        corrective: 'Send worker home; sanitize touched surfaces; retrain crew',
        meaning: 'Hands, hair, and clothing of workers can transfer fecal-oral pathogens directly onto produce.',
        pathogens: 'Norovirus, Hepatitis A, Staphylococcus aureus',
        steps: [
            'Hand-wash with soap before every harvest session',
            'Wear single-use gloves; change between tasks',
            'Cover hair with caps; remove jewelry',
            'No work when ill — clear sick-leave policy',
            'Maintain dated training records for all staff'
        ]
    },
    {
        id: 'harvest',
        name: 'Harvest surface',
        baseP: 2, baseS: 2,
        ccp: 'Harvest Tool & Container Sanitation',
        monitoring: 'Pre-shift sanitation log; visual + ATP spot checks',
        criticalLimit: 'Sanitizer ≥200 ppm chlorine or equivalent; ATP <150 RLU',
        corrective: 'Re-sanitize; segregate suspect batch; investigate root cause',
        meaning: 'Cutting tools, totes, and prep tables can cross-contaminate produce if not sanitized between uses.',
        pathogens: 'Listeria monocytogenes, Salmonella',
        steps: [
            'Sanitize knives, scissors, and totes before each shift',
            'Use only food-grade harvest containers',
            'Separate raw and finished product zones',
            'Refrigerate harvested crop within one hour',
            'Document sanitation with sign-off log'
        ]
    },
    {
        id: 'cooling',
        name: 'Post-harvest cooling',
        baseP: 2, baseS: 3,
        ccp: 'Cold Chain Maintenance',
        monitoring: 'Cooler temperature log every 2 hours; data logger continuous',
        criticalLimit: 'Product core 0–4 °C within 1 hour of harvest',
        corrective: 'Discard batch if breach >2 hours; recalibrate cooler; review SOPs',
        meaning: 'Warm produce supports rapid pathogen growth; cooling delays multiply risk exponentially.',
        pathogens: 'Listeria monocytogenes, Salmonella',
        steps: [
            'Hydrocool or forced-air cool within 1 hour of harvest',
            'Hold at 0–4 °C throughout storage and transport',
            'Monitor cooler temperature continuously',
            'Maintain time-temperature log for each lot',
            'Discard product if cold chain breached >2 hours'
        ]
    },
    {
        id: 'pest',
        name: 'Pest / disease',
        baseP: 2, baseS: 1,
        ccp: 'Integrated Pest Management',
        monitoring: 'Sticky trap counts weekly; scouting log',
        criticalLimit: '<5 winged pests per trap per week; no plant disease symptoms',
        corrective: 'Apply approved biocontrol; quarantine affected area; review IPM plan',
        meaning: 'Insects and plant pathogens can carry secondary microbial contamination onto edible tissue.',
        pathogens: 'Secondary contamination via insect frass; plant viruses (non-human-pathogen)',
        steps: [
            'Weekly IPM scouting with documented findings',
            'Deploy yellow and blue sticky traps near entries',
            'Quarantine new plant material for 7–14 days',
            'Sanitize equipment and trays between crop cycles',
            'Practice crop and varietal rotation'
        ]
    },
    {
        id: 'chemical',
        name: 'Chemical contamination',
        baseP: 1, baseS: 3,
        ccp: 'Chemical Receiving & Storage',
        monitoring: 'Lot-number log; heavy-metal panel annually',
        criticalLimit: 'All inputs food-grade certified; metals below FDA action levels',
        corrective: 'Recall affected lot; switch supplier; retest reservoir',
        meaning: 'Non-food-grade nutrients, plumbing leachate, or pesticide drift can introduce toxic chemicals.',
        pathogens: 'N/A — pesticides, heavy metals (Pb, Cd, As), nutrient impurities',
        steps: [
            'Use only food-grade certified nutrient salts',
            'Test water annually for heavy metals',
            'Store chemicals in locked, separate area from produce',
            'Track lot numbers and expiration dates',
            'Provide PPE and SDS training for all staff'
        ]
    },
    {
        id: 'physical',
        name: 'Physical hazard',
        baseP: 1, baseS: 2,
        ccp: 'Foreign Object Control',
        monitoring: 'Visual inspection at packing; metal detection if commercial',
        criticalLimit: 'Zero foreign objects detected in final product',
        corrective: 'Hold and inspect entire lot; investigate source; document complaint',
        meaning: 'Glass, metal, hard plastic, or other foreign objects can injure consumers if they reach the package.',
        pathogens: 'N/A — glass, metal shards, hard plastic',
        steps: [
            'Prohibit glass containers in grow and packing areas',
            'Visually inspect produce at packing line',
            'Use metal detection on commercial pack lines',
            'Train staff on foreign-object reporting',
            'Track and investigate all foreign-object complaints'
        ]
    }
];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 960);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    // --- Left panel controls ---
    const leftX = 14;
    let y = 50;
    cropSel = createSelect();
    cropSel.position(leftX, y);
    cropSel.style('width', '200px');
    ['Leafy greens', 'Herbs', 'Fruiting crops', 'Sprouts'].forEach(o => cropSel.option(o));
    cropSel.selected('Leafy greens');
    cropSel.changed(() => { dirty = true; selectedHazard = null; });

    y += 56;
    waterSel = createSelect();
    waterSel.position(leftX, y);
    waterSel.style('width', '200px');
    ['Municipal', 'Well', 'Rainwater', 'Reverse osmosis'].forEach(o => waterSel.option(o));
    waterSel.selected('Municipal');
    waterSel.changed(() => { dirty = true; selectedHazard = null; });

    y += 56;
    scaleSel = createSelect();
    scaleSel.position(leftX, y);
    scaleSel.style('width', '200px');
    ['Home/classroom (<50 plants)', 'Small commercial (50–500)', 'Commercial (500+)'].forEach(o => scaleSel.option(o));
    scaleSel.selected('Home/classroom (<50 plants)');
    scaleSel.changed(() => { dirty = true; selectedHazard = null; });

    y += 56;
    consumerSel = createSelect();
    consumerSel.position(leftX, y);
    consumerSel.style('width', '200px');
    ['Personal only', 'Students/Institution', 'Public sale'].forEach(o => consumerSel.option(o));
    consumerSel.selected('Personal only');
    consumerSel.changed(() => { dirty = true; selectedHazard = null; });

    y += 56;
    planBtn = createButton('Download HACCP Plan');
    planBtn.position(leftX, y);
    planBtn.style('background', '#2e7d32');
    planBtn.style('color', 'white');
    planBtn.style('border', 'none');
    planBtn.style('padding', '6px 10px');
    planBtn.style('border-radius', '3px');
    planBtn.style('cursor', 'pointer');
    planBtn.mousePressed(showPlanPopup);

    // Plan popup wiring
    const closeBtn = document.getElementById('plan-close');
    const copyBtn = document.getElementById('plan-copy');
    if (closeBtn) closeBtn.onclick = () => { document.getElementById('plan-popup').style.display = 'none'; };
    if (copyBtn) copyBtn.onclick = () => {
        const txt = document.getElementById('plan-text').textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(txt).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
            });
        }
    };
}

function computeScores() {
    const crop = cropSel.value();
    const water = waterSel.value();
    const scale = scaleSel.value();
    const consumer = consumerSel.value();

    hazardScores = HAZARDS.map(h => {
        let p = h.baseP;
        let s = h.baseS;

        // Water source modifiers
        if (h.id === 'water') {
            if (water === 'Well') { p += 1; s += 1; }
            else if (water === 'Rainwater') { p += 1; }
            // RO and Municipal = baseline
        }

        // Crop modifiers
        if (crop === 'Sprouts') {
            if (h.id === 'biofilm' || h.id === 'water') s += 2;
        }
        if (crop === 'Leafy greens') {
            if (h.id === 'harvest' || h.id === 'biofilm') p += 1;
        }

        // Scale modifiers
        if (scale === 'Commercial (500+)') {
            if (h.id === 'worker') s += 1;
        }

        // Consumer modifiers (apply to severity)
        if (consumer === 'Public sale') s += 1;
        else if (consumer === 'Personal only') s -= 1;

        // Clamp to 1..3
        p = Math.max(1, Math.min(3, p));
        s = Math.max(1, Math.min(3, s));

        const score = p * s;
        let level = 'low';
        if (score >= 5) level = 'high';
        else if (score >= 3) level = 'medium';

        return { hazard: h, p, s, score, level };
    });
    dirty = false;
}

function levelColor(level, alpha = 255) {
    if (level === 'high') return color(239, 83, 80, alpha);
    if (level === 'medium') return color(255, 213, 79, alpha);
    return color(165, 214, 167, alpha);
}

function levelBorder(level) {
    if (level === 'high') return color(183, 28, 28);
    if (level === 'medium') return color(245, 127, 23);
    return color(46, 125, 50);
}

function draw() {
    background(248, 249, 250);
    if (dirty) computeScores();

    drawTitle();

    // Panel widths
    const margin = 10;
    const leftW = Math.round(width * 0.25);
    const rightW = Math.round(width * 0.30);
    const centerW = width - leftW - rightW - margin * 4;

    const leftX = margin;
    const centerX = leftX + leftW + margin;
    const rightX = centerX + centerW + margin;

    drawLeftPanel(leftX, 30, leftW, drawHeight - 40);
    drawCenterPanel(centerX, 30, centerW, drawHeight - 40);
    drawRightPanel(rightX, 30, rightW, drawHeight - 40);

    drawDetailPanel();
}

function drawTitle() {
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('HACCP Risk Matrix — Food Safety Hazard Assessment', 12, 8);
    pop();
}

function drawPanelFrame(x, y, w, h, title) {
    push();
    noStroke();
    fill(255);
    rect(x, y, w, h, 6);
    stroke(218, 224, 228);
    noFill();
    rect(x, y, w, h, 6);
    pop();

    push();
    noStroke();
    fill(0, 188, 212);
    rect(x, y, w, 22, 6, 6, 0, 0);
    fill(255);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(title, x + 8, y + 11);
    pop();
}

function drawLeftPanel(x, y, w, h) {
    drawPanelFrame(x, y, w, h, 'System Configuration');

    push();
    fill(33);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Crop type', x + 4, y + 30);
    text('Water source', x + 4, y + 86);
    text('Scale', x + 4, y + 142);
    text('Consumers', x + 4, y + 198);
    pop();

    // Reposition controls each frame to track panel
    cropSel.position(x + 4, y + 48);
    waterSel.position(x + 4, y + 104);
    scaleSel.position(x + 4, y + 160);
    consumerSel.position(x + 4, y + 216);
    planBtn.position(x + 4, y + 270);

    // Selected width hint
    const widthHint = Math.max(150, Math.min(w - 16, 240));
    cropSel.style('width', widthHint + 'px');
    waterSel.style('width', widthHint + 'px');
    scaleSel.style('width', widthHint + 'px');
    consumerSel.style('width', widthHint + 'px');

    // Help text
    push();
    fill(108, 117, 125);
    noStroke();
    textSize(10);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    text(
        'Adjust selections to see how your hydroponic setup changes the risk profile and which Critical Control Points (CCPs) rise to the top.',
        x + 6, y + 310, w - 12
    );
    pop();
}

function drawCenterPanel(x, y, w, h) {
    drawPanelFrame(x, y, w, h, 'Risk Matrix — 8 Hazards (click a card for details)');

    cardRects = [];
    const cols = 4;
    const rows = 2;
    const padX = 8;
    const padY = 6;
    const gridY = y + 30;
    const gridH = h - 38;
    const cellW = (w - padX * (cols + 1)) / cols;
    const cellH = (gridH - padY * (rows + 1)) / rows;

    for (let i = 0; i < HAZARDS.length; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const cx = x + padX + c * (cellW + padX);
        const cy = gridY + padY + r * (cellH + padY);
        drawHazardCard(cx, cy, cellW, cellH, hazardScores[i]);
        cardRects.push({ x: cx, y: cy, w: cellW, h: cellH, idx: i });
    }
}

function drawHazardCard(x, y, w, h, scoreObj) {
    if (!scoreObj) return;
    const isSelected = selectedHazard === scoreObj.hazard.id;

    push();
    // Card body
    noStroke();
    fill(levelColor(scoreObj.level, 230));
    rect(x, y, w, h, 5);
    stroke(levelBorder(scoreObj.level));
    strokeWeight(isSelected ? 3 : 1.5);
    noFill();
    rect(x, y, w, h, 5);
    pop();

    // Header text
    push();
    fill(33);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(scoreObj.hazard.name, x + 6, y + 5, w - 12);
    pop();

    // Mini 3x3 matrix
    const miniSize = Math.min(h - 38, 56);
    const miniX = x + 6;
    const miniY = y + h - miniSize - 6;
    drawMiniMatrix(miniX, miniY, miniSize, scoreObj);

    // Score badge (right side)
    const badgeX = x + w - 38;
    const badgeY = y + h - 40;
    push();
    noStroke();
    fill(255, 255, 255, 235);
    rect(badgeX, badgeY, 32, 32, 4);
    stroke(levelBorder(scoreObj.level));
    strokeWeight(1.5);
    noFill();
    rect(badgeX, badgeY, 32, 32, 4);
    noStroke();
    fill(levelBorder(scoreObj.level));
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(15);
    text(scoreObj.score, badgeX + 16, badgeY + 12);
    textStyle(NORMAL);
    textSize(8);
    fill(80);
    text('P×S', badgeX + 16, badgeY + 26);
    pop();

    // Level label
    push();
    fill(levelBorder(scoreObj.level));
    noStroke();
    textSize(9);
    textStyle(BOLD);
    textAlign(RIGHT, TOP);
    let label = 'LOW';
    if (scoreObj.level === 'medium') label = 'MED';
    else if (scoreObj.level === 'high') label = 'HIGH';
    text(label, x + w - 6, y + 5);
    pop();
}

function drawMiniMatrix(x, y, size, scoreObj) {
    const cell = size / 3;
    push();
    // Labels axis: probability vertical (top=High, bottom=Low), severity horizontal (Low->High)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            // row 0 = High probability (3), row 2 = Low (1)
            const probVal = 3 - row;
            const sevVal = col + 1;
            const cellScore = probVal * sevVal;
            let lvl = 'low';
            if (cellScore >= 5) lvl = 'high';
            else if (cellScore >= 3) lvl = 'medium';

            noStroke();
            fill(levelColor(lvl, 180));
            rect(x + col * cell, y + row * cell, cell, cell);

            // Highlight current cell
            if (probVal === scoreObj.p && sevVal === scoreObj.s) {
                stroke(33);
                strokeWeight(2);
                noFill();
                rect(x + col * cell, y + row * cell, cell, cell);
            } else {
                stroke(255);
                strokeWeight(0.5);
                noFill();
                rect(x + col * cell, y + row * cell, cell, cell);
            }
        }
    }
    // Axis labels
    noStroke();
    fill(80);
    textSize(8);
    textStyle(NORMAL);
    textAlign(LEFT, BOTTOM);
    text('P↑', x - 2, y + 8);
    textAlign(LEFT, TOP);
    text('Sev→', x + size + 2, y + size - 8);
    pop();
}

function drawRightPanel(x, y, w, h) {
    drawPanelFrame(x, y, w, h, 'Top 3 Critical Control Points');

    if (!hazardScores.length) return;
    const sorted = [...hazardScores].sort((a, b) => b.score - a.score);
    const top3 = sorted.slice(0, 3);

    let cy = y + 32;
    const innerW = w - 16;

    for (let i = 0; i < top3.length; i++) {
        const s = top3[i];
        const cardH = 118;
        if (cy + cardH > y + h - 6) break;

        push();
        // Card background
        noStroke();
        fill(248, 249, 250);
        rect(x + 8, cy, innerW, cardH, 4);
        stroke(levelBorder(s.level));
        strokeWeight(2);
        noFill();
        rect(x + 8, cy, innerW, cardH, 4);
        pop();

        // Rank badge
        push();
        noStroke();
        fill(levelBorder(s.level));
        ellipse(x + 22, cy + 14, 22, 22);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(11);
        textStyle(BOLD);
        text('#' + (i + 1), x + 22, cy + 13);
        pop();

        push();
        noStroke();
        fill(46, 125, 50);
        textSize(11);
        textStyle(BOLD);
        textAlign(LEFT, TOP);
        text(s.hazard.ccp, x + 38, cy + 6, innerW - 38);
        pop();

        push();
        fill(33);
        noStroke();
        textSize(10);
        textStyle(NORMAL);
        textAlign(LEFT, TOP);
        let ty = cy + 30;
        textStyle(BOLD);
        text('Monitor:', x + 14, ty);
        textStyle(NORMAL);
        text(s.hazard.monitoring, x + 62, ty, innerW - 70);
        ty += 26;
        textStyle(BOLD);
        text('Limit:', x + 14, ty);
        textStyle(NORMAL);
        text(s.hazard.criticalLimit, x + 62, ty, innerW - 70);
        ty += 26;
        textStyle(BOLD);
        text('Action:', x + 14, ty);
        textStyle(NORMAL);
        text(s.hazard.corrective, x + 62, ty, innerW - 70);
        pop();

        // Score chip
        push();
        noStroke();
        fill(levelBorder(s.level));
        rect(x + innerW - 32, cy + 6, 32, 16, 3);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10);
        textStyle(BOLD);
        text('P×S=' + s.score, x + innerW - 16, cy + 14);
        pop();

        cy += cardH + 6;
    }
}

function drawDetailPanel() {
    const panelY = drawHeight + 6;
    const panelH = controlHeight - 12;
    push();
    noStroke();
    fill(255);
    rect(10, panelY, width - 20, panelH, 6);
    stroke(218, 224, 228);
    noFill();
    rect(10, panelY, width - 20, panelH, 6);
    pop();

    if (selectedHazard) {
        const scoreObj = hazardScores.find(s => s.hazard.id === selectedHazard);
        if (!scoreObj) return;
        const h = scoreObj.hazard;

        push();
        // Header band
        noStroke();
        fill(levelBorder(scoreObj.level));
        rect(10, panelY, width - 20, 22, 6, 6, 0, 0);
        fill(255);
        textSize(12);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text(h.name + '  —  Risk Score ' + scoreObj.score + ' (' + scoreObj.level.toUpperCase() + ')', 18, panelY + 11);
        textAlign(RIGHT, CENTER);
        text('Click another card or press [Esc] to close', width - 24, panelY + 11);
        pop();

        push();
        fill(33);
        noStroke();
        textSize(11);
        textAlign(LEFT, TOP);
        const colW = (width - 40) / 2;
        textStyle(BOLD);
        text('What it means:', 18, panelY + 30);
        textStyle(NORMAL);
        text(h.meaning, 18, panelY + 46, colW - 8);

        textStyle(BOLD);
        text('Associated pathogens:', 18, panelY + 84);
        textStyle(NORMAL);
        fill(183, 28, 28);
        text(h.pathogens, 18, panelY + 100, colW - 8);

        // Right column - prevention steps
        fill(46, 125, 50);
        textStyle(BOLD);
        text('Prevention protocol:', 26 + colW, panelY + 30);
        fill(33);
        textStyle(NORMAL);
        let sy = panelY + 46;
        for (let i = 0; i < h.steps.length; i++) {
            const line = (i + 1) + '. ' + h.steps[i];
            text(line, 26 + colW, sy, colW - 8);
            sy += 16;
        }
        pop();
    } else {
        push();
        fill(108, 117, 125);
        noStroke();
        textSize(11);
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        text('How to use this tool', 18, panelY + 8);
        textStyle(NORMAL);
        text(
            '1. Choose your crop, water source, scale, and consumer audience in the left panel.\n' +
            '2. The 8 hazard cards in the center show Probability × Severity. Cards turn yellow or red as risk rises.\n' +
            '3. The right panel lists the top 3 Critical Control Points — these are where you must monitor and document.\n' +
            '4. Click any hazard card to see associated pathogens and a step-by-step prevention protocol.\n' +
            '5. Click "Download HACCP Plan" to copy a full text summary to your clipboard for your food-safety file.',
            18, panelY + 28, width - 36
        );
        pop();
    }
}

function mousePressed() {
    // Detail-panel area: ignore
    if (mouseY > drawHeight) return;
    for (const r of cardRects) {
        if (mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h) {
            const id = HAZARDS[r.idx].id;
            selectedHazard = (selectedHazard === id) ? null : id;
            return;
        }
    }
}

function keyPressed() {
    if (keyCode === ESCAPE) {
        selectedHazard = null;
        const popup = document.getElementById('plan-popup');
        if (popup) popup.style.display = 'none';
    }
}

function showPlanPopup() {
    if (dirty) computeScores();
    const popup = document.getElementById('plan-popup');
    const textEl = document.getElementById('plan-text');
    if (!popup || !textEl) return;

    const lines = [];
    lines.push('HACCP PLAN SUMMARY');
    lines.push('Generated: ' + new Date().toISOString().slice(0, 10));
    lines.push('');
    lines.push('SYSTEM CONFIGURATION');
    lines.push('  Crop type    : ' + cropSel.value());
    lines.push('  Water source : ' + waterSel.value());
    lines.push('  Scale        : ' + scaleSel.value());
    lines.push('  Consumers    : ' + consumerSel.value());
    lines.push('');
    lines.push('HAZARD ANALYSIS (P=Probability 1-3, S=Severity 1-3, Score=P*S)');
    const sorted = [...hazardScores].sort((a, b) => b.score - a.score);
    for (const s of sorted) {
        lines.push('  [' + s.level.toUpperCase().padEnd(6) + '] ' +
            s.hazard.name.padEnd(26) + ' P=' + s.p + ' S=' + s.s + '  Score=' + s.score);
    }
    lines.push('');
    lines.push('TOP 3 CRITICAL CONTROL POINTS');
    const top3 = sorted.slice(0, 3);
    for (let i = 0; i < top3.length; i++) {
        const h = top3[i].hazard;
        lines.push('  CCP #' + (i + 1) + ': ' + h.ccp);
        lines.push('    Monitoring      : ' + h.monitoring);
        lines.push('    Critical limit  : ' + h.criticalLimit);
        lines.push('    Corrective action: ' + h.corrective);
        lines.push('');
    }
    lines.push('PREVENTION PROTOCOLS (all 8 hazards)');
    for (const s of sorted) {
        lines.push('  ' + s.hazard.name + ':');
        for (let i = 0; i < s.hazard.steps.length; i++) {
            lines.push('    ' + (i + 1) + '. ' + s.hazard.steps[i]);
        }
        lines.push('');
    }
    lines.push('-- End of HACCP Plan Summary --');

    textEl.textContent = lines.join('\n');

    // Position popup over canvas center
    popup.style.display = 'block';
    popup.style.left = Math.max(20, Math.round(width / 2) - 280) + 'px';
    popup.style.top = '40px';
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    dirty = true;
}
