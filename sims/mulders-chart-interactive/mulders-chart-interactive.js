// Mulder's Chart Interactive — pH and Nutrient Availability
// CANVAS_HEIGHT: 600
let canvasWidth = 760;
let drawHeight = 460;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// ---- Data: nutrient pH optima (low, high) and detail info ----
const NUTRIENTS = [
    { sym: 'N',  name: 'Nitrogen',   lo: 6.0, hi: 7.5, ppm: '100–250',  form: 'NO₃⁻, NH₄⁺',
      func: 'Builds amino acids, proteins, chlorophyll.' },
    { sym: 'P',  name: 'Phosphorus', lo: 6.0, hi: 7.0, ppm: '30–80',
      form: 'H₂PO₄⁻, HPO₄²⁻',
      func: 'Energy transfer (ATP), root and flower development.' },
    { sym: 'K',  name: 'Potassium',  lo: 6.0, hi: 8.0, ppm: '150–300',  form: 'K⁺',
      func: 'Stomatal regulation, enzyme activation, fruit quality.' },
    { sym: 'Ca', name: 'Calcium',    lo: 6.5, hi: 8.5, ppm: '150–200',  form: 'Ca²⁺',
      func: 'Cell wall structure, prevents blossom-end rot.' },
    { sym: 'Mg', name: 'Magnesium',  lo: 6.5, hi: 8.5, ppm: '50–75',    form: 'Mg²⁺',
      func: 'Central atom in chlorophyll; enzyme cofactor.' },
    { sym: 'S',  name: 'Sulfur',     lo: 6.0, hi: 9.0, ppm: '60–120',   form: 'SO₄²⁻',
      func: 'Amino acids (cysteine, methionine); aroma compounds.' },
    { sym: 'Fe', name: 'Iron',       lo: 4.5, hi: 6.5, ppm: '2–5',      form: 'Fe²⁺ (chelated)',
      func: 'Chlorophyll synthesis; electron transport.' },
    { sym: 'Mn', name: 'Manganese',  lo: 5.0, hi: 6.5, ppm: '0.5–1.0',  form: 'Mn²⁺',
      func: 'Photosynthesis water-splitting; enzyme cofactor.' },
    { sym: 'Zn', name: 'Zinc',       lo: 5.0, hi: 7.0, ppm: '0.05–0.5', form: 'Zn²⁺',
      func: 'Auxin synthesis, internode elongation.' },
    { sym: 'Cu', name: 'Copper',     lo: 5.0, hi: 7.0, ppm: '0.05–0.5', form: 'Cu²⁺',
      func: 'Electron transport; lignin formation.' },
    { sym: 'B',  name: 'Boron',      lo: 5.0, hi: 7.0, ppm: '0.2–0.5',  form: 'H₃BO₃',
      func: 'Cell wall integrity; pollen germination.' },
    { sym: 'Mo', name: 'Molybdenum', lo: 7.0, hi: 8.5, ppm: '0.01–0.05',form: 'MoO₄²⁻',
      func: 'Nitrate reductase; nitrogen metabolism.' },
    { sym: 'Cl', name: 'Chlorine',   lo: 4.5, hi: 8.5, ppm: '20–100',   form: 'Cl⁻',
      func: 'Osmotic balance; photosynthesis O₂ evolution.' },
    { sym: 'Ni', name: 'Nickel',     lo: 5.5, hi: 7.0, ppm: '0.01–0.05',form: 'Ni²⁺',
      func: 'Urease enzyme; nitrogen recycling.' }
];

// Antagonism edges: source -> [targets]
const ANTAGONISMS = {
    'K':  ['Mg', 'Ca'],
    'Ca': ['Mg', 'K', 'Fe'],
    'Mg': ['Ca', 'K'],
    'Fe': ['Mn', 'Zn'],
    'Mn': ['Fe', 'Zn'],
    'Zn': ['Fe'],
    'P':  ['Zn', 'Fe']
};
// Synergism edges (teal): source -> [targets]
const SYNERGISMS = {
    'N':  ['K'],
    'Mg': ['P']
};

// ---- Colors ----
const COL_PRIMARY = [46, 125, 50];   // green
const COL_ACCENT  = [0, 188, 212];   // teal
const COL_GREEN   = [76, 175, 80];
const COL_YELLOW  = [255, 193, 7];
const COL_RED     = [229, 57, 53];
const COL_ORANGE  = [255, 112, 0];
const COL_BG      = [248, 249, 250];
const COL_PANEL   = [255, 255, 255];
const COL_BORDER  = [222, 226, 230];
const COL_TEXT    = [33, 37, 41];
const COL_MUTED   = [108, 117, 125];

// ---- State ----
let currentView = 'ph';   // 'ph' or 'network'
let phValue = 6.0;
let selectedNutrient = null;
let networkSelected = null;
let showMode = 'excess';  // 'excess' or 'deficiency'

let tabPhBtn, tabNetBtn, modeBtn, resetBtn;
let phSlider, phLabelY;

// Node positions (computed once)
let nodes = {};

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    // Tab buttons
    tabPhBtn = createButton("pH Availability");
    tabPhBtn.position(12, drawHeight + 10);
    tabPhBtn.mousePressed(() => { currentView = 'ph'; updateTabStyles(); });

    tabNetBtn = createButton("Nutrient Interactions");
    tabNetBtn.position(150, drawHeight + 10);
    tabNetBtn.mousePressed(() => { currentView = 'network'; updateTabStyles(); });

    // pH slider
    phSlider = createSlider(45, 85, 60, 1);  // /10
    phSlider.position(12, drawHeight + 60);
    phSlider.style('width', '260px');
    phSlider.input(() => { phValue = phSlider.value() / 10; });

    // Mode toggle (for network view)
    modeBtn = createButton('Mode: Show Excess Effects');
    modeBtn.position(310, drawHeight + 10);
    modeBtn.mousePressed(() => {
        showMode = (showMode === 'excess') ? 'deficiency' : 'excess';
        modeBtn.html(showMode === 'excess'
            ? 'Mode: Show Excess Effects'
            : 'Mode: Show Deficiency Sources');
    });

    // Reset selection
    resetBtn = createButton('Clear Selection');
    resetBtn.position(540, drawHeight + 10);
    resetBtn.mousePressed(() => { selectedNutrient = null; networkSelected = null; });

    updateTabStyles();
    layoutNetworkNodes();
}

function updateTabStyles() {
    const active = 'background:#2e7d32;color:#fff;border:1px solid #2e7d32;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:600;';
    const inactive = 'background:#fff;color:#2e7d32;border:1px solid #2e7d32;padding:6px 12px;border-radius:4px;cursor:pointer;';
    tabPhBtn.attribute('style', currentView === 'ph' ? active : inactive);
    tabNetBtn.attribute('style', currentView === 'network' ? active : inactive);
}

function layoutNetworkNodes() {
    // We compute placement at draw time because width may change; store
    // angle indices here.
    nodes = {};
    const n = NUTRIENTS.length;
    for (let i = 0; i < n; i++) {
        const angle = (i / n) * TWO_PI - HALF_PI;
        nodes[NUTRIENTS[i].sym] = { angle: angle, sym: NUTRIENTS[i].sym };
    }
}

function draw() {
    background(COL_BG);

    // Title
    push();
    noStroke();
    fill(COL_PRIMARY);
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text("Mulder's Chart — pH and Nutrient Availability", 12, 8);
    pop();

    if (currentView === 'ph') {
        drawAvailabilityView();
    } else {
        drawNetworkView();
    }

    drawControlPanelBackground();
    drawControlLabels();
}

// =================================================================
// View 1: pH Availability
// =================================================================
function drawAvailabilityView() {
    const top = 36;
    const left = 90;
    const right = (selectedNutrient ? Math.floor(width * 0.62) : width - 20);
    const barAreaTop = top + 24;
    const barAreaBottom = drawHeight - 30;
    const rowH = (barAreaBottom - barAreaTop) / NUTRIENTS.length;
    const barH = Math.max(10, rowH - 6);

    // Optimal pH band (5.5–6.5) — vertical band behind bars
    const xAt = (ph) => map(ph, 4.5, 8.5, left, right);
    push();
    noStroke();
    fill(76, 175, 80, 45);
    rect(xAt(5.5), barAreaTop - 6, xAt(6.5) - xAt(5.5), barAreaBottom - barAreaTop + 12);
    pop();

    // Axis: pH gridlines + labels
    push();
    stroke(220);
    strokeWeight(1);
    for (let p = 4.5; p <= 8.5 + 0.001; p += 0.5) {
        const x = xAt(p);
        line(x, barAreaTop - 6, x, barAreaBottom + 6);
    }
    noStroke();
    fill(COL_MUTED);
    textSize(10);
    textAlign(CENTER, TOP);
    for (let p = 4.5; p <= 8.5 + 0.001; p += 0.5) {
        text(p.toFixed(1), xAt(p), barAreaBottom + 8);
    }
    textAlign(CENTER, TOP);
    fill(COL_TEXT);
    textSize(11);
    textStyle(BOLD);
    text('pH scale', (left + right) / 2, barAreaBottom + 22);
    pop();

    // Current pH marker
    push();
    stroke(COL_PRIMARY);
    strokeWeight(2);
    const xPh = xAt(phValue);
    line(xPh, barAreaTop - 10, xPh, barAreaBottom + 6);
    noStroke();
    fill(COL_PRIMARY);
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, BOTTOM);
    text('pH ' + phValue.toFixed(1), xPh, barAreaTop - 12);
    pop();

    // Header
    push();
    noStroke();
    fill(COL_TEXT);
    textSize(11);
    textStyle(BOLD);
    textAlign(RIGHT, CENTER);
    text('Nutrient', left - 6, top + 8);
    textAlign(LEFT, CENTER);
    text('Availability at pH ' + phValue.toFixed(1), left + 6, top + 8);
    pop();

    // Bars
    for (let i = 0; i < NUTRIENTS.length; i++) {
        const nut = NUTRIENTS[i];
        const y = barAreaTop + i * rowH;
        const avail = availabilityAt(nut, phValue);  // 0..1
        const fullW = right - left;
        const w = fullW * avail;
        const col = colorForAvailability(avail);

        // Row label
        push();
        noStroke();
        fill(COL_TEXT);
        textSize(11);
        textAlign(RIGHT, CENTER);
        textStyle(NORMAL);
        text(nut.sym + ' — ' + nut.name, left - 6, y + barH / 2);
        pop();

        // Bar background (full width, faint)
        push();
        noStroke();
        fill(235);
        rect(left, y, fullW, barH, 3);
        pop();

        // Selected highlight outline
        if (selectedNutrient && selectedNutrient.sym === nut.sym) {
            push();
            noFill();
            stroke(COL_PRIMARY);
            strokeWeight(2);
            rect(left - 2, y - 2, fullW + 4, barH + 4, 4);
            pop();
        }

        // Bar fill
        push();
        noStroke();
        fill(col[0], col[1], col[2]);
        rect(left, y, w, barH, 3);
        pop();

        // % label
        push();
        noStroke();
        fill(COL_TEXT);
        textSize(10);
        textAlign(LEFT, CENTER);
        text(Math.round(avail * 100) + '%', left + Math.max(w, 0) + 4, y + barH / 2);
        pop();
    }

    // Legend (top right inside chart area if no panel)
    if (!selectedNutrient) {
        drawAvailabilityLegend(right - 230, top + 2);
    } else {
        drawNutrientPanel(selectedNutrient, right + 14, top, width - right - 24, drawHeight - top - 16);
    }
}

function availabilityAt(nut, ph) {
    // Smooth bell curve: 1.0 inside [lo, hi], falls off with gaussian on
    // each side. Width of falloff = 1.0 pH unit.
    if (ph >= nut.lo && ph <= nut.hi) return 1.0;
    const sigma = 1.0;
    let d;
    if (ph < nut.lo) d = nut.lo - ph;
    else d = ph - nut.hi;
    const v = Math.exp(-(d * d) / (2 * sigma * sigma));
    // Floor at 0.05 so a tiny visible sliver still appears
    return Math.max(0.04, v);
}

function colorForAvailability(a) {
    if (a > 0.75) return COL_GREEN;
    if (a >= 0.25) return COL_YELLOW;
    return COL_RED;
}

function drawAvailabilityLegend(x, y) {
    push();
    noStroke();
    fill(COL_PANEL);
    stroke(COL_BORDER);
    rect(x, y, 220, 78, 4);
    pop();
    push();
    noStroke();
    textSize(11);
    textStyle(BOLD);
    fill(COL_TEXT);
    text('Legend', x + 8, y + 14);
    textStyle(NORMAL);
    textSize(10);

    const items = [
        { c: COL_GREEN,  label: '> 75% — Fully available' },
        { c: COL_YELLOW, label: '25–75% — Limited' },
        { c: COL_RED,    label: '< 25% — Locked out' }
    ];
    for (let i = 0; i < items.length; i++) {
        const yy = y + 28 + i * 16;
        fill(items[i].c[0], items[i].c[1], items[i].c[2]);
        rect(x + 10, yy, 14, 10, 2);
        fill(COL_TEXT);
        text(items[i].label, x + 30, yy + 8);
    }
    pop();
}

function drawNutrientPanel(nut, x, y, w, h) {
    push();
    noStroke();
    fill(COL_PANEL);
    rect(x, y, w, h, 6);
    stroke(COL_PRIMARY);
    strokeWeight(2);
    noFill();
    rect(x, y, w, h, 6);
    pop();

    push();
    noStroke();
    fill(COL_PRIMARY);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(nut.name + ' (' + nut.sym + ')', x + 12, y + 10);

    fill(COL_TEXT);
    textSize(11);
    textStyle(BOLD);
    text('Function', x + 12, y + 38);
    textStyle(NORMAL);
    text(nut.func, x + 12, y + 54, w - 24);

    textStyle(BOLD);
    text('Absorption form', x + 12, y + 96);
    textStyle(NORMAL);
    text(nut.form, x + 12, y + 112, w - 24);

    textStyle(BOLD);
    text('Typical solution ppm', x + 12, y + 138);
    textStyle(NORMAL);
    text(nut.ppm, x + 12, y + 154, w - 24);

    textStyle(BOLD);
    text('Optimal pH range', x + 12, y + 180);
    textStyle(NORMAL);
    text(nut.lo.toFixed(1) + ' – ' + nut.hi.toFixed(1), x + 12, y + 196, w - 24);

    textStyle(BOLD);
    fill(COL_RED);
    text('Lockout pH', x + 12, y + 222);
    textStyle(NORMAL);
    fill(COL_TEXT);
    text('Below ' + nut.lo.toFixed(1) + ' or above ' + nut.hi.toFixed(1)
        + ' the ion forms insoluble compounds or precipitates.',
        x + 12, y + 238, w - 24);

    // Availability at current pH
    const a = availabilityAt(nut, phValue);
    const ac = colorForAvailability(a);
    textStyle(BOLD);
    fill(COL_TEXT);
    text('At pH ' + phValue.toFixed(1) + ':', x + 12, y + h - 44);
    fill(ac[0], ac[1], ac[2]);
    textSize(16);
    text(Math.round(a * 100) + '% available', x + 90, y + h - 46);
    pop();
}

// =================================================================
// View 2: Antagonism Network
// =================================================================
function drawNetworkView() {
    const cx = (selectedNutrient || networkSelected) ? width * 0.32 : width * 0.5;
    const cy = 36 + (drawHeight - 36 - 30) / 2;
    const radius = Math.min((drawHeight - 36 - 50) / 2, ((selectedNutrient || networkSelected) ? width * 0.32 : width * 0.42)) - 30;

    // Resolve coordinates
    const pos = {};
    for (const sym in nodes) {
        const a = nodes[sym].angle;
        pos[sym] = { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
    }

    // Determine highlight set
    const sel = networkSelected;
    const highlighted = new Set();
    if (sel) {
        if (showMode === 'excess') {
            const targets = ANTAGONISMS[sel] || [];
            for (const t of targets) highlighted.add(sel + '->' + t);
        } else {
            // Show which excess nutrients reduce uptake of this one
            for (const src in ANTAGONISMS) {
                if (ANTAGONISMS[src].includes(sel)) highlighted.add(src + '->' + sel);
            }
        }
    }

    // Draw antagonism edges (orange)
    for (const src in ANTAGONISMS) {
        for (const tgt of ANTAGONISMS[src]) {
            const key = src + '->' + tgt;
            const isHi = highlighted.has(key);
            const dim = sel && !isHi;
            drawArrow(pos[src], pos[tgt], COL_ORANGE, isHi, dim);
        }
    }
    // Synergism edges (teal)
    for (const src in SYNERGISMS) {
        for (const tgt of SYNERGISMS[src]) {
            const dim = !!sel;
            drawArrow(pos[src], pos[tgt], COL_ACCENT, false, dim);
        }
    }

    // Nodes
    for (let i = 0; i < NUTRIENTS.length; i++) {
        const nut = NUTRIENTS[i];
        const p = pos[nut.sym];
        const isSel = sel === nut.sym;
        push();
        if (isSel) {
            stroke(COL_PRIMARY);
            strokeWeight(3);
        } else {
            stroke(180);
            strokeWeight(1);
        }
        fill(isSel ? color(COL_PRIMARY[0], COL_PRIMARY[1], COL_PRIMARY[2]) : 255);
        ellipse(p.x, p.y, 38, 38);
        noStroke();
        fill(isSel ? 255 : COL_TEXT);
        textSize(12);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(nut.sym, p.x, p.y);
        pop();
    }

    // Legend
    drawNetworkLegend();

    // Side panel if selected
    if (networkSelected) {
        drawNetworkPanel(networkSelected, width * 0.66, 40, width * 0.34 - 14, drawHeight - 70);
    }
}

function drawArrow(a, b, col, highlight, dim) {
    // Shorten endpoints by node radius
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 1) return;
    const ux = dx / d, uy = dy / d;
    const r = 19;
    const x1 = a.x + ux * r;
    const y1 = a.y + uy * r;
    const x2 = b.x - ux * r;
    const y2 = b.y - uy * r;

    push();
    if (dim) {
        stroke(col[0], col[1], col[2], 40);
        strokeWeight(1);
    } else if (highlight) {
        stroke(col[0], col[1], col[2], 255);
        strokeWeight(3);
    } else {
        stroke(col[0], col[1], col[2], 180);
        strokeWeight(1.5);
    }
    line(x1, y1, x2, y2);

    // Arrowhead
    const ah = highlight ? 10 : 7;
    const angle = Math.atan2(uy, ux);
    const ax1 = x2 - ah * Math.cos(angle - 0.4);
    const ay1 = y2 - ah * Math.sin(angle - 0.4);
    const ax2 = x2 - ah * Math.cos(angle + 0.4);
    const ay2 = y2 - ah * Math.sin(angle + 0.4);
    noStroke();
    if (dim) fill(col[0], col[1], col[2], 40);
    else fill(col[0], col[1], col[2], highlight ? 255 : 200);
    triangle(x2, y2, ax1, ay1, ax2, ay2);
    pop();
}

function drawNetworkLegend() {
    const x = 14, y = 40;
    push();
    noStroke();
    fill(COL_PANEL);
    stroke(COL_BORDER);
    rect(x, y, 200, 70, 4);
    pop();
    push();
    noStroke();
    textSize(11);
    textStyle(BOLD);
    fill(COL_TEXT);
    text('Legend', x + 8, y + 14);
    textStyle(NORMAL);
    textSize(10);

    // Antagonism
    stroke(COL_ORANGE);
    strokeWeight(2.5);
    line(x + 10, y + 32, x + 38, y + 32);
    noStroke();
    fill(COL_ORANGE);
    triangle(x + 38, y + 32, x + 32, y + 29, x + 32, y + 35);
    fill(COL_TEXT);
    text('Antagonism (reduces uptake)', x + 44, y + 35);

    // Synergism
    stroke(COL_ACCENT);
    strokeWeight(2.5);
    line(x + 10, y + 52, x + 38, y + 52);
    noStroke();
    fill(COL_ACCENT);
    triangle(x + 38, y + 52, x + 32, y + 49, x + 32, y + 55);
    fill(COL_TEXT);
    text('Synergism (promotes uptake)', x + 44, y + 55);
    pop();
}

function drawNetworkPanel(sym, x, y, w, h) {
    const nut = NUTRIENTS.find(n => n.sym === sym);
    if (!nut) return;

    push();
    noStroke();
    fill(COL_PANEL);
    rect(x, y, w, h, 6);
    stroke(COL_PRIMARY);
    strokeWeight(2);
    noFill();
    rect(x, y, w, h, 6);
    pop();

    push();
    noStroke();
    fill(COL_PRIMARY);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(nut.name + ' (' + nut.sym + ')', x + 12, y + 10);

    fill(COL_TEXT);
    textSize(11);
    textStyle(NORMAL);
    text(nut.func, x + 12, y + 32, w - 24);

    let cursorY = y + 76;
    textStyle(BOLD);
    textSize(11);

    if (showMode === 'excess') {
        const targets = ANTAGONISMS[sym] || [];
        fill(COL_ORANGE);
        text('If you have excess ' + sym + ':', x + 12, cursorY);
        cursorY += 18;
        fill(COL_TEXT);
        textStyle(NORMAL);
        if (targets.length === 0) {
            text('No major antagonisms recorded.', x + 12, cursorY, w - 24);
        } else {
            const names = targets.map(t => {
                const nn = NUTRIENTS.find(n => n.sym === t);
                return nn ? (t + ' (' + nn.name + ')') : t;
            });
            text('Watch for deficiency of: ' + names.join(', '),
                x + 12, cursorY, w - 24);
        }
    } else {
        const sources = [];
        for (const s in ANTAGONISMS) {
            if (ANTAGONISMS[s].includes(sym)) sources.push(s);
        }
        fill(COL_ORANGE);
        text('If ' + sym + ' is deficient:', x + 12, cursorY);
        cursorY += 18;
        fill(COL_TEXT);
        textStyle(NORMAL);
        if (sources.length === 0) {
            text('No known excess-driven lockouts.', x + 12, cursorY, w - 24);
        } else {
            const names = sources.map(t => {
                const nn = NUTRIENTS.find(n => n.sym === t);
                return nn ? (t + ' (' + nn.name + ')') : t;
            });
            text('Check for excess of: ' + names.join(', '),
                x + 12, cursorY, w - 24);
        }
    }

    cursorY += 56;
    textStyle(BOLD);
    fill(COL_TEXT);
    text('Absorption form', x + 12, cursorY);
    textStyle(NORMAL);
    text(nut.form, x + 12, cursorY + 16, w - 24);

    cursorY += 44;
    textStyle(BOLD);
    text('Typical ppm', x + 12, cursorY);
    textStyle(NORMAL);
    text(nut.ppm, x + 12, cursorY + 16, w - 24);
    pop();
}

// =================================================================
// Control panel chrome
// =================================================================
function drawControlPanelBackground() {
    push();
    noStroke();
    fill(240, 244, 246);
    rect(0, drawHeight, width, controlHeight);
    stroke(COL_BORDER);
    line(0, drawHeight, width, drawHeight);
    pop();
}

function drawControlLabels() {
    push();
    noStroke();
    fill(COL_TEXT);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);

    // pH slider label
    text('pH: ' + phValue.toFixed(1), 280, drawHeight + 62);
    textStyle(NORMAL);
    textSize(10);
    fill(COL_MUTED);
    text('Drag the slider to change root-zone pH (4.5 – 8.5).',
        12, drawHeight + 90);
    text('Tip: Click a bar or node to open its info panel.',
        12, drawHeight + 108);
    pop();
}

// =================================================================
// Input handling
// =================================================================
function mousePressed() {
    if (mouseY < 0 || mouseY > drawHeight) return;
    if (currentView === 'ph') {
        handlePhClick();
    } else {
        handleNetworkClick();
    }
}

function handlePhClick() {
    const top = 36;
    const left = 90;
    const right = (selectedNutrient ? Math.floor(width * 0.62) : width - 20);
    const barAreaTop = top + 24;
    const barAreaBottom = drawHeight - 30;
    const rowH = (barAreaBottom - barAreaTop) / NUTRIENTS.length;
    const barH = Math.max(10, rowH - 6);

    if (mouseX < left - 80 || mouseX > right + 60) {
        // Outside row area
        return;
    }
    for (let i = 0; i < NUTRIENTS.length; i++) {
        const y = barAreaTop + i * rowH;
        if (mouseY >= y - 2 && mouseY <= y + barH + 2) {
            selectedNutrient = NUTRIENTS[i];
            return;
        }
    }
    selectedNutrient = null;
}

function handleNetworkClick() {
    // Recompute positions for hit test
    const cx = networkSelected ? width * 0.32 : width * 0.5;
    const cy = 36 + (drawHeight - 36 - 30) / 2;
    const radius = Math.min((drawHeight - 36 - 50) / 2, (networkSelected ? width * 0.32 : width * 0.42)) - 30;

    for (let i = 0; i < NUTRIENTS.length; i++) {
        const sym = NUTRIENTS[i].sym;
        const a = nodes[sym].angle;
        const x = cx + radius * Math.cos(a);
        const y = cy + radius * Math.sin(a);
        const d = Math.hypot(mouseX - x, mouseY - y);
        if (d <= 22) {
            networkSelected = sym;
            return;
        }
    }
    networkSelected = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
