// Nutrient Solution Mixing Calculator — p5.js
// CANVAS_HEIGHT: 640
let canvasWidth = 900;
let canvasHeight = 640;
let containerWidth;
let containerHeight = canvasHeight;

// Layout
let topBarH = 50;
let panelTop = 70;
let panelBottom = 590;
let footerH = 50;

// Elements (target ppm)
const ELEMENTS = [
    { id: 'N',   label: 'N (nitrate)', def: 150 },
    { id: 'NH4', label: 'N (NH4+)',    def: 15 },
    { id: 'P',   label: 'P',           def: 50 },
    { id: 'K',   label: 'K',           def: 200 },
    { id: 'Ca',  label: 'Ca',          def: 150 },
    { id: 'Mg',  label: 'Mg',          def: 50 },
    { id: 'S',   label: 'S',           def: 65 },
    { id: 'Fe',  label: 'Fe',          def: 3 }
];

// Salt info (formula, solubility, pH effect, handling)
const SALT_INFO = {
    'CaNO3': {
        name: 'Calcium nitrate',
        formula: 'Ca(NO3)2·4H2O',
        solubility: '~1290 g/L at 20 C — very high',
        pH: 'Slightly basic; raises pH',
        handling: 'Hygroscopic. Add FIRST. Never mix dry with sulfates or phosphates.'
    },
    'KNO3': {
        name: 'Potassium nitrate',
        formula: 'KNO3',
        solubility: '~316 g/L at 20 C — high',
        pH: 'Near neutral',
        handling: 'Stable. Strong oxidizer — keep away from organic fuels.'
    },
    'KH2PO4': {
        name: 'Monopotassium phosphate',
        formula: 'KH2PO4 (MKP)',
        solubility: '~226 g/L at 20 C',
        pH: 'Slightly acidic (~4.5 in solution)',
        handling: 'Add AFTER calcium nitrate is fully dissolved and diluted.'
    },
    'MgSO4': {
        name: 'Magnesium sulfate',
        formula: 'MgSO4·7H2O (Epsom)',
        solubility: '~710 g/L at 20 C',
        pH: 'Near neutral',
        handling: 'Easy to handle. Dissolves quickly in warm water.'
    },
    'FeDTPA': {
        name: 'DTPA-Fe chelate',
        formula: 'Fe-DTPA (10% Fe)',
        solubility: 'Stable in solution to pH ~7.5',
        pH: 'Slight effect; chelate breaks down at high pH',
        handling: 'Add LAST. Keep out of direct sunlight in reservoir.'
    }
};

// Salt composition fractions (mass of element per mass of salt)
const SALT_COMP = {
    'CaNO3':  { Ca: 0.170, N: 0.119 },
    'KNO3':   { K:  0.387, N: 0.138 },
    'KH2PO4': { K:  0.287, P: 0.228 },
    'MgSO4':  { Mg: 0.099, S: 0.130 },
    'FeDTPA': { Fe: 0.10 }
};

// Presets
const PRESETS = {
    'Lettuce / Leafy Greens':  { N:150, NH4:15, P:50, K:200, Ca:150, Mg:50, S:65, Fe:3 },
    'Basil / Herbs':           { N:170, NH4:15, P:55, K:230, Ca:170, Mg:55, S:70, Fe:3 },
    'Tomato Vegetative':       { N:200, NH4:20, P:65, K:300, Ca:200, Mg:60, S:80, Fe:4 },
    'Tomato Fruiting':         { N:180, NH4:15, P:70, K:380, Ca:220, Mg:70, S:90, Fe:4 }
};

// State
let targets = {};
let inputs = {};       // element id -> p5 createInput
let presetSelect;
let mixOrderBtn, backBtn;
let showMixingOrder = false;
let selectedSalt = null;  // key into SALT_INFO when clicked
let saltHitRects = [];    // populated each draw for click testing

// Calculation results
let results = {
    salts: { CaNO3: 0, KNO3: 0, KH2PO4: 0, MgSO4: 0, FeDTPA: 0 },
    nDelivered: 0,
    ec: 0,
    npk: { n:0, p:0, k:100 },
    caMg: 0,
    warnings: []
};

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 1000);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    // Initialize targets from default
    for (const e of ELEMENTS) targets[e.id] = e.def;

    // Preset dropdown
    presetSelect = createSelect();
    presetSelect.position(110, 15);
    presetSelect.size(220);
    presetSelect.option('-- Select Preset --');
    for (const k of Object.keys(PRESETS)) presetSelect.option(k);
    presetSelect.changed(applyPreset);

    // Mixing order button (top-right region)
    mixOrderBtn = createButton('Show Mixing Order');
    mixOrderBtn.position(360, 15);
    mixOrderBtn.mousePressed(() => { showMixingOrder = true; selectedSalt = null; });

    // Back button (hidden initially)
    backBtn = createButton('Back to Summary');
    backBtn.position(360, 15);
    backBtn.mousePressed(() => { showMixingOrder = false; });
    backBtn.hide();

    // Create createInput for each element
    createElementInputs();

    recalc();
}

function createElementInputs() {
    for (const e of ELEMENTS) {
        const inp = createInput(String(targets[e.id]), 'number');
        inp.size(55);
        inp.attribute('min', '0');
        inp.attribute('step', '1');
        inp.input(() => {
            const v = parseFloat(inp.value());
            if (!isNaN(v) && v >= 0) {
                targets[e.id] = v;
                recalc();
            }
        });
        inputs[e.id] = inp;
    }
}

function positionInputs() {
    // Left panel x bounds depend on width
    const leftW = width * 0.40;
    const rowH = 42;
    const startY = panelTop + 40;
    const inputX = 10 + leftW - 90;
    for (let i = 0; i < ELEMENTS.length; i++) {
        const e = ELEMENTS[i];
        const y = startY + i * rowH;
        inputs[e.id].position(inputX, y + 4);
    }
}

function applyPreset() {
    const name = presetSelect.value();
    if (!PRESETS[name]) return;
    const p = PRESETS[name];
    for (const k of Object.keys(p)) {
        targets[k] = p[k];
        if (inputs[k]) inputs[k].value(String(p[k]));
    }
    recalc();
}

function recalc() {
    const t = targets;
    const salts = { CaNO3: 0, KNO3: 0, KH2PO4: 0, MgSO4: 0, FeDTPA: 0 };

    // 1. KH2PO4 from target P
    salts.KH2PO4 = (t.P / 1000) / SALT_COMP.KH2PO4.P;
    const k_from_mkp_g = salts.KH2PO4 * SALT_COMP.KH2PO4.K;
    const k_from_mkp_ppm = k_from_mkp_g * 1000;

    // 2. Remaining K from KNO3
    let remK = Math.max(0, t.K - k_from_mkp_ppm);
    salts.KNO3 = (remK / 1000) / SALT_COMP.KNO3.K;
    const n_from_kno3_g = salts.KNO3 * SALT_COMP.KNO3.N;

    // 3. Ca(NO3)2 from target Ca
    salts.CaNO3 = (t.Ca / 1000) / SALT_COMP.CaNO3.Ca;
    const n_from_cano3_g = salts.CaNO3 * SALT_COMP.CaNO3.N;

    // 4. Total N delivered (as nitrate from these two salts)
    const nDelivered_ppm = (n_from_kno3_g + n_from_cano3_g) * 1000;

    // 5. MgSO4 from target Mg
    salts.MgSO4 = (t.Mg / 1000) / SALT_COMP.MgSO4.Mg;

    // 6. DTPA-Fe from target Fe
    salts.FeDTPA = (t.Fe / 1000) / SALT_COMP.FeDTPA.Fe;

    // Summary metrics
    const macroSum = t.N + t.NH4 + t.P + t.K + t.Ca + t.Mg + t.S;
    const ec = macroSum / 700;

    // N:P:K normalized to K=100
    let npk = { n:0, p:0, k:100 };
    if (t.K > 0) {
        npk.n = Math.round((t.N + t.NH4) / t.K * 100);
        npk.p = Math.round(t.P / t.K * 100);
    }
    const caMg = t.Mg > 0 ? (t.Ca / t.Mg) : 0;

    const warnings = [];
    if (t.Ca * t.P > 30000) {
        warnings.push('Ca + phosphate precipitation risk');
    }
    if (Math.abs(nDelivered_ppm - t.N) > 25) {
        warnings.push('N delivered ' + nDelivered_ppm.toFixed(0) +
                      ' vs target ' + t.N.toFixed(0) + ' ppm');
    }
    if (caMg > 0 && (caMg < 2 || caMg > 5)) {
        warnings.push('Ca:Mg ratio ' + caMg.toFixed(1) + ' (target 3:1–4:1)');
    }

    results = {
        salts: salts,
        nDelivered: nDelivered_ppm,
        ec: ec,
        npk: npk,
        caMg: caMg,
        warnings: warnings
    };
}

function draw() {
    background(248, 249, 250);
    positionInputs();

    // Top bar
    push();
    fill(46, 125, 50);
    noStroke();
    rect(0, 0, width, topBarH);
    fill(255);
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text('Nutrient Solution Mixing Calculator', 12, topBarH / 2 - 9);
    textStyle(NORMAL);
    textSize(11);
    text('Preset:', 60, topBarH / 2 + 12);
    pop();

    // Toggle button visibility based on mode
    if (showMixingOrder) {
        mixOrderBtn.hide();
        backBtn.show();
    } else {
        mixOrderBtn.show();
        backBtn.hide();
    }

    // Panel positions
    const leftW = width * 0.40;
    const centerW = width * 0.35;
    const rightW = width * 0.25 - 10;
    const leftX = 10;
    const centerX = leftX + leftW + 5;
    const rightX = centerX + centerW + 5;

    drawTargetsPanel(leftX, panelTop, leftW - 10, panelBottom - panelTop);
    drawSaltsPanel(centerX, panelTop, centerW - 5, panelBottom - panelTop);

    if (showMixingOrder) {
        drawMixingOrder(rightX, panelTop, rightW, panelBottom - panelTop);
    } else if (selectedSalt) {
        drawSaltDetail(rightX, panelTop, rightW, panelBottom - panelTop);
    } else {
        drawSummaryPanel(rightX, panelTop, rightW, panelBottom - panelTop);
    }

    drawFooter();
}

function drawPanel(x, y, w, h, title) {
    push();
    noStroke();
    fill(255);
    rect(x, y, w, h, 6);
    stroke(218, 224, 230);
    noFill();
    rect(x, y, w, h, 6);
    pop();

    push();
    fill(46, 125, 50);
    noStroke();
    rect(x, y, w, 28, 6);
    rect(x, y + 14, w, 14);
    fill(255);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(title, x + 10, y + 14);
    pop();
}

function drawTargetsPanel(x, y, w, h) {
    drawPanel(x, y, w, h, 'Target Concentrations (ppm)');

    const rowH = 42;
    const startY = y + 40;
    push();
    textAlign(LEFT, CENTER);
    textSize(13);
    for (let i = 0; i < ELEMENTS.length; i++) {
        const e = ELEMENTS[i];
        const ry = startY + i * rowH;
        // Row background
        if (i % 2 === 0) {
            noStroke();
            fill(248, 250, 248);
            rect(x + 5, ry, w - 10, rowH - 2, 3);
        }
        // Label
        fill(33);
        noStroke();
        textStyle(BOLD);
        text(e.label, x + 14, ry + rowH / 2 - 4);
        // unit label after input
        textStyle(NORMAL);
        textSize(10);
        fill(100);
        text('ppm', x + w - 28, ry + rowH / 2 - 4);
        textSize(13);
    }
    pop();

    // Hint
    push();
    fill(108, 117, 125);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text('Type a number — salt quantities update live.', x + 14, y + h - 22);
    pop();
}

function drawSaltsPanel(x, y, w, h) {
    drawPanel(x, y, w, h, 'Calculated Salts (g/L)');

    const saltOrder = [
        { key: 'CaNO3',  label: 'Calcium nitrate',         formula: 'Ca(NO3)2·4H2O' },
        { key: 'KNO3',   label: 'Potassium nitrate',       formula: 'KNO3' },
        { key: 'KH2PO4', label: 'Monopotassium phosphate', formula: 'KH2PO4' },
        { key: 'MgSO4',  label: 'Magnesium sulfate',       formula: 'MgSO4·7H2O' },
        { key: 'FeDTPA', label: 'DTPA-Fe chelate (10%)',   formula: 'Fe-DTPA' }
    ];

    saltHitRects = [];
    const rowH = 64;
    const startY = y + 40;

    push();
    textAlign(LEFT, TOP);
    for (let i = 0; i < saltOrder.length; i++) {
        const s = saltOrder[i];
        const ry = startY + i * rowH;
        const isSel = selectedSalt === s.key;

        // Row card
        noStroke();
        fill(isSel ? 230 : 248, isSel ? 246 : 250, isSel ? 234 : 248);
        rect(x + 8, ry, w - 16, rowH - 6, 4);
        if (isSel) {
            stroke(46, 125, 50);
            strokeWeight(1.5);
            noFill();
            rect(x + 8, ry, w - 16, rowH - 6, 4);
        }

        // Name (clickable)
        noStroke();
        fill(0, 105, 92);
        textStyle(BOLD);
        textSize(12);
        text(s.label, x + 16, ry + 6);
        // formula
        fill(108, 117, 125);
        textStyle(NORMAL);
        textSize(10);
        text(s.formula, x + 16, ry + 22);

        // Quantity
        fill(33);
        textStyle(BOLD);
        textSize(15);
        textAlign(RIGHT, TOP);
        text(results.salts[s.key].toFixed(3) + ' g/L', x + w - 18, ry + 14);
        textAlign(LEFT, TOP);

        // info hint
        fill(120);
        textStyle(NORMAL);
        textSize(9);
        text('click for info', x + 16, ry + 40);

        saltHitRects.push({ x: x + 8, y: ry, w: w - 16, h: rowH - 6, key: s.key });
    }
    pop();
}

function drawSummaryPanel(x, y, w, h) {
    drawPanel(x, y, w, h, 'Solution Summary');

    push();
    textAlign(LEFT, TOP);
    let cy = y + 42;
    const lineH = 22;

    // EC
    fill(33);
    textStyle(BOLD);
    textSize(12);
    text('Estimated EC', x + 12, cy);
    fill(46, 125, 50);
    textSize(20);
    text(results.ec.toFixed(1) + ' mS/cm', x + 12, cy + 14);
    cy += 56;

    // NPK ratio
    fill(33);
    textStyle(BOLD);
    textSize(12);
    text('N : P : K (K=100)', x + 12, cy);
    fill(0, 105, 92);
    textSize(15);
    text(results.npk.n + ' : ' + results.npk.p + ' : 100', x + 12, cy + 16);
    cy += 46;

    // Ca:Mg
    fill(33);
    textStyle(BOLD);
    textSize(12);
    text('Ca : Mg ratio', x + 12, cy);
    fill(0, 105, 92);
    textSize(15);
    const cm = results.caMg > 0 ? results.caMg.toFixed(1) + ' : 1' : '—';
    text(cm, x + 12, cy + 16);
    cy += 46;

    // N delivered
    fill(33);
    textStyle(BOLD);
    textSize(12);
    text('N delivered (NO3)', x + 12, cy);
    textStyle(NORMAL);
    fill(60);
    textSize(13);
    text(results.nDelivered.toFixed(0) + ' ppm (target ' +
         targets.N.toFixed(0) + ')', x + 12, cy + 16);
    cy += 46;

    // Warnings
    fill(33);
    textStyle(BOLD);
    textSize(12);
    text('Warnings', x + 12, cy);
    cy += 18;
    if (results.warnings.length === 0) {
        textStyle(NORMAL);
        fill(46, 125, 50);
        textSize(11);
        text('No conflicts detected.', x + 12, cy);
    } else {
        for (const wmsg of results.warnings) {
            // warning icon (triangle)
            noStroke();
            fill(245, 158, 11);
            triangle(x + 12, cy + 12, x + 22, cy + 12, x + 17, cy + 2);
            fill(33);
            textStyle(BOLD);
            textSize(9);
            text('!', x + 16, cy + 4);
            textStyle(NORMAL);
            fill(180, 83, 9);
            textSize(11);
            text(wmsg, x + 28, cy + 2, w - 40);
            cy += 32;
        }
    }
    pop();
}

function drawSaltDetail(x, y, w, h) {
    const info = SALT_INFO[selectedSalt];
    drawPanel(x, y, w, h, 'Salt Info');

    push();
    textAlign(LEFT, TOP);
    let cy = y + 42;

    fill(0, 105, 92);
    textStyle(BOLD);
    textSize(13);
    text(info.name, x + 12, cy, w - 24);
    cy += 22;

    fill(33);
    textStyle(NORMAL);
    textSize(11);
    text('Formula: ' + info.formula, x + 12, cy, w - 24);
    cy += 36;

    textStyle(BOLD);
    text('Solubility', x + 12, cy);
    cy += 14;
    textStyle(NORMAL);
    fill(60);
    text(info.solubility, x + 12, cy, w - 24);
    cy += 36;

    fill(33);
    textStyle(BOLD);
    text('pH Effect', x + 12, cy);
    cy += 14;
    textStyle(NORMAL);
    fill(60);
    text(info.pH, x + 12, cy, w - 24);
    cy += 36;

    fill(33);
    textStyle(BOLD);
    text('Handling', x + 12, cy);
    cy += 14;
    textStyle(NORMAL);
    fill(60);
    text(info.handling, x + 12, cy, w - 24);
    cy += 30;

    // Close hint
    fill(0, 188, 212);
    textStyle(BOLD);
    textSize(10);
    text('[ click salt again or summary area to close ]', x + 12, y + h - 22, w - 24);
    pop();
}

function drawMixingOrder(x, y, w, h) {
    drawPanel(x, y, w, h, 'Mixing Order');

    const steps = [
        'Fill reservoir with clean water (RO if possible).',
        'Add calcium nitrate; stir until fully dissolved.',
        'Add magnesium sulfate; stir.',
        'Add potassium nitrate; stir.',
        'Add monopotassium phosphate; stir.',
        'Add chelated iron LAST.',
        'Verify EC and pH; adjust if needed.'
    ];

    push();
    textAlign(LEFT, TOP);
    let cy = y + 42;
    for (let i = 0; i < steps.length; i++) {
        // numbered circle
        noStroke();
        fill(46, 125, 50);
        ellipse(x + 22, cy + 8, 20, 20);
        fill(255);
        textStyle(BOLD);
        textSize(11);
        textAlign(CENTER, CENTER);
        text(i + 1, x + 22, cy + 7);

        // step text
        fill(33);
        textStyle(NORMAL);
        textSize(11);
        textAlign(LEFT, TOP);
        text(steps[i], x + 40, cy + 2, w - 50);
        cy += 44;
    }

    // Tip
    fill(0, 105, 92);
    textStyle(BOLD);
    textSize(10);
    text('Tip: never mix dry calcium with dry phosphate or sulfate.',
         x + 12, y + h - 30, w - 24);
    pop();
}

function drawFooter() {
    push();
    noStroke();
    fill(255);
    rect(0, panelBottom, width, footerH);
    stroke(218, 224, 230);
    line(0, panelBottom, width, panelBottom);
    pop();

    push();
    fill(108, 117, 125);
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    text('Calculations are approximate (greedy stoichiometric). EC estimated as ppm sum / 700.',
         12, panelBottom + footerH / 2);
    pop();
}

function mousePressed() {
    // Check salt clicks (center panel)
    for (const r of saltHitRects) {
        if (mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h) {
            if (showMixingOrder) showMixingOrder = false;
            selectedSalt = (selectedSalt === r.key) ? null : r.key;
            return;
        }
    }
    // Click on right panel summary area clears salt detail
    const rightX = width * 0.40 + width * 0.35 + 20;
    if (mouseX > rightX && mouseY > panelTop && mouseY < panelBottom) {
        if (selectedSalt) selectedSalt = null;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
