// Farm Financial Model — p5.js
// CANVAS_HEIGHT: 740
let canvasWidth = 980;
let drawHeight = 600;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// Colors
const COL_GREEN = [46, 125, 50];
const COL_RED = [239, 83, 80];
const COL_ORANGE = [255, 152, 0];
const COL_BLUE = [25, 118, 210];
const COL_TEAL = [0, 188, 212];
const COL_GREY = [108, 117, 125];
const COL_BG = [248, 249, 250];
const COL_PANEL = [255, 255, 255];
const COL_BORDER = [222, 226, 230];

// Inputs (p5 createInput elements)
let inp = {};
let marketSelect;
let btnSolar, btnMonte, btnExport;

// Computed results
let dirty = true;
let results = {};

// Overlay state
let overlay = null; // 'solar' | 'monte' | 'export' | null
let monteData = null;
let solarData = null;

// Tooltip
let hoverYear = -1;

// Default values
const defaults = {
    capex_growing: 15000,
    capex_lighting: 12000,
    capex_hvac: 8000,
    capex_automation: 5000,
    capex_facility: 10000,
    opex_electricity: 800,
    opex_water: 50,
    opex_nutrients: 200,
    opex_seeds: 150,
    opex_laborHours: 80,
    opex_laborRate: 18,
    opex_packaging: 100,
    rev_area: 30,
    rev_yield: 4,
    rev_cycles: 10,
    rev_price: 8
};

const channelMultipliers = {
    'Wholesale': 0.8,
    'Restaurant': 1.0,
    'Farmers Market': 1.3,
    'CSA': 1.2
};

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, canvasWidth);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    buildInputs();
    layoutInputs();
    dirty = true;
}

function buildInputs() {
    const inputDefs = [
        // CapEx
        ['capex_growing', defaults.capex_growing],
        ['capex_lighting', defaults.capex_lighting],
        ['capex_hvac', defaults.capex_hvac],
        ['capex_automation', defaults.capex_automation],
        ['capex_facility', defaults.capex_facility],
        // OpEx
        ['opex_electricity', defaults.opex_electricity],
        ['opex_water', defaults.opex_water],
        ['opex_nutrients', defaults.opex_nutrients],
        ['opex_seeds', defaults.opex_seeds],
        ['opex_laborHours', defaults.opex_laborHours],
        ['opex_laborRate', defaults.opex_laborRate],
        ['opex_packaging', defaults.opex_packaging],
        // Revenue
        ['rev_area', defaults.rev_area],
        ['rev_yield', defaults.rev_yield],
        ['rev_cycles', defaults.rev_cycles],
        ['rev_price', defaults.rev_price]
    ];

    for (const [name, val] of inputDefs) {
        const el = createInput(String(val), 'number');
        el.size(60, 18);
        el.input(() => { dirty = true; });
        inp[name] = el;
    }

    marketSelect = createSelect();
    marketSelect.option('Wholesale');
    marketSelect.option('Restaurant');
    marketSelect.option('Farmers Market');
    marketSelect.option('CSA');
    marketSelect.selected('Restaurant');
    marketSelect.changed(() => { dirty = true; });

    btnSolar = createButton('Compare Solar vs Grid');
    btnSolar.mousePressed(() => {
        computeSolarComparison();
        overlay = (overlay === 'solar') ? null : 'solar';
    });

    btnMonte = createButton('Run Monte Carlo');
    btnMonte.mousePressed(() => {
        runMonteCarlo();
        overlay = (overlay === 'monte') ? null : 'monte';
    });

    btnExport = createButton('Export Business Plan');
    btnExport.mousePressed(() => {
        overlay = (overlay === 'export') ? null : 'export';
    });
}

function layoutInputs() {
    const w = containerWidth;
    const col1 = Math.round(w * 0.02);
    const col2 = Math.round(w * 0.24);
    const col3 = Math.round(w * 0.46);
    // col4 is results panel (no inputs)

    const labelH = 16;
    const rowH = 26;
    const startY = 50;

    // Column 1 — CapEx
    let y = startY;
    placeInput('capex_growing', col1, y); y += rowH;
    placeInput('capex_lighting', col1, y); y += rowH;
    placeInput('capex_hvac', col1, y); y += rowH;
    placeInput('capex_automation', col1, y); y += rowH;
    placeInput('capex_facility', col1, y); y += rowH;

    // Column 2 — OpEx
    y = startY;
    placeInput('opex_electricity', col2, y); y += rowH;
    placeInput('opex_water', col2, y); y += rowH;
    placeInput('opex_nutrients', col2, y); y += rowH;
    placeInput('opex_seeds', col2, y); y += rowH;
    placeInput('opex_laborHours', col2, y); y += rowH;
    placeInput('opex_laborRate', col2, y); y += rowH;
    placeInput('opex_packaging', col2, y); y += rowH;

    // Column 3 — Revenue
    y = startY;
    placeInput('rev_area', col3, y); y += rowH;
    placeInput('rev_yield', col3, y); y += rowH;
    placeInput('rev_cycles', col3, y); y += rowH;
    placeInput('rev_price', col3, y); y += rowH;
    marketSelect.position(col3 + 100, y + 26);
    marketSelect.size(60);
    y += rowH;

    // Buttons below results column (col4)
    const col4 = Math.round(w * 0.68);
    const btnY = drawHeight + 10;
    btnSolar.position(col1 + 4, btnY);
    btnMonte.position(col1 + 180, btnY);
    btnExport.position(col1 + 320, btnY);
}

function placeInput(name, x, y) {
    inp[name].size(55, 18);
    inp[name].position(x + 100, y + 26);
}

function getVal(name) {
    const v = parseFloat(inp[name].value());
    return isFinite(v) ? v : 0;
}

function recompute() {
    const r = {};

    r.capex_growing = getVal('capex_growing');
    r.capex_lighting = getVal('capex_lighting');
    r.capex_hvac = getVal('capex_hvac');
    r.capex_automation = getVal('capex_automation');
    r.capex_facility = getVal('capex_facility');
    r.totalCapEx = r.capex_growing + r.capex_lighting + r.capex_hvac +
                   r.capex_automation + r.capex_facility;

    // Loan: 7% APR, 5 yr
    r.loanPayment = loanPayment(r.totalCapEx, 0.07, 60);

    r.opex_electricity = getVal('opex_electricity');
    r.opex_water = getVal('opex_water');
    r.opex_nutrients = getVal('opex_nutrients');
    r.opex_seeds = getVal('opex_seeds');
    r.opex_laborHours = getVal('opex_laborHours');
    r.opex_laborRate = getVal('opex_laborRate');
    r.opex_labor = r.opex_laborHours * r.opex_laborRate;
    r.opex_packaging = getVal('opex_packaging');
    r.monthlyOpEx = r.opex_electricity + r.opex_water + r.opex_nutrients +
                    r.opex_seeds + r.opex_labor + r.opex_packaging + r.loanPayment;

    r.area = getVal('rev_area');
    r.yieldPerM2 = getVal('rev_yield');
    r.cycles = getVal('rev_cycles');
    r.pricePerKg = getVal('rev_price');
    r.channel = marketSelect.value();
    r.channelMult = channelMultipliers[r.channel] || 1.0;

    r.monthlyYieldKg = (r.area * r.yieldPerM2 * r.cycles) / 12;
    r.monthlyRevenue = r.monthlyYieldKg * r.pricePerKg * r.channelMult;

    r.breakEvenKg = r.pricePerKg > 0 ? r.monthlyOpEx / (r.pricePerKg * r.channelMult) : Infinity;
    r.monthlyProfit = r.monthlyRevenue - r.monthlyOpEx;
    r.annualProfit = r.monthlyProfit * 12;

    r.npv = computeNPV(r.annualProfit, r.totalCapEx, 0.08, 5);
    r.irr = computeIRR(r.annualProfit, r.totalCapEx, 5);
    r.payback = r.annualProfit > 0 ? r.totalCapEx / r.annualProfit : null;
    r.roi5 = r.totalCapEx > 0 ? ((5 * r.annualProfit - r.totalCapEx) / r.totalCapEx) * 100 : 0;

    results = r;
    dirty = false;
}

function loanPayment(principal, apr, n) {
    if (principal <= 0) return 0;
    const r = apr / 12;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function computeNPV(annualProfit, capex, rate, years) {
    let npv = -capex;
    for (let y = 1; y <= years; y++) {
        npv += annualProfit / Math.pow(1 + rate, y);
    }
    return npv;
}

function computeIRR(annualProfit, capex, years) {
    if (capex <= 0) return null;
    const f = (r) => computeNPV(annualProfit, capex, r, years);
    let lo = -0.499, hi = 1.0;
    let fLo = f(lo), fHi = f(hi);
    if (fLo * fHi > 0) return null; // no sign change
    for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        const fMid = f(mid);
        if (Math.abs(fMid) < 0.0001) return mid;
        if (fLo * fMid < 0) {
            hi = mid; fHi = fMid;
        } else {
            lo = mid; fLo = fMid;
        }
    }
    return (lo + hi) / 2;
}

function draw() {
    if (dirty) recompute();
    background(COL_BG);

    drawTitle();
    drawColumns();
    drawCashFlowChart();
    drawTipBar();

    if (overlay === 'solar') drawSolarOverlay();
    else if (overlay === 'monte') drawMonteOverlay();
    else if (overlay === 'export') drawExportOverlay();
}

function drawTitle() {
    push();
    fill(COL_GREEN);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Farm Financial Model — 5-Year Hydroponic Business Plan', 12, 8);
    pop();
}

function drawColumns() {
    const w = containerWidth;
    const c1x = Math.round(w * 0.02);
    const c2x = Math.round(w * 0.24);
    const c3x = Math.round(w * 0.46);
    const c4x = Math.round(w * 0.68);
    const colW = Math.round(w * 0.21);
    const c4w = w - c4x - Math.round(w * 0.02);
    const startY = 36;
    const colH = 360;

    drawColumnPanel(c1x, startY, colW, colH, 'CapEx (one-time)');
    drawColumnPanel(c2x, startY, colW, colH, 'OpEx (monthly)');
    drawColumnPanel(c3x, startY, colW, colH, 'Revenue (monthly)');
    drawColumnPanel(c4x, startY, c4w, colH, 'Results');

    // CapEx labels
    drawInputLabel('Growing system $', c1x + 10, startY + 50);
    drawInputLabel('Lighting $', c1x + 10, startY + 76);
    drawInputLabel('HVAC / climate $', c1x + 10, startY + 102);
    drawInputLabel('Automation $', c1x + 10, startY + 128);
    drawInputLabel('Facility buildout $', c1x + 10, startY + 154);
    // Totals
    drawComputedRow(c1x + 10, startY + 200, 'Total CapEx', fmtMoney(results.totalCapEx), COL_GREEN);
    drawComputedRow(c1x + 10, startY + 224, 'Loan pmt /mo', fmtMoney(results.loanPayment), COL_GREY);
    push();
    fill(COL_GREY);
    noStroke();
    textSize(10);
    text('(7% APR, 5-yr term)', c1x + 10, startY + 250);
    pop();

    // OpEx labels
    drawInputLabel('Electricity $', c2x + 10, startY + 50);
    drawInputLabel('Water $', c2x + 10, startY + 76);
    drawInputLabel('Nutrients $', c2x + 10, startY + 102);
    drawInputLabel('Seeds $', c2x + 10, startY + 128);
    drawInputLabel('Labor hrs', c2x + 10, startY + 154);
    drawInputLabel('Hourly rate $', c2x + 10, startY + 180);
    drawInputLabel('Packaging $', c2x + 10, startY + 206);
    drawComputedRow(c2x + 10, startY + 252, 'Labor cost', fmtMoney(results.opex_labor), COL_GREY);
    drawComputedRow(c2x + 10, startY + 276, 'Total OpEx', fmtMoney(results.monthlyOpEx), COL_RED);

    // Revenue labels
    drawInputLabel('Area (m²)', c3x + 10, startY + 50);
    drawInputLabel('Yield kg/m²/cyc', c3x + 10, startY + 76);
    drawInputLabel('Cycles / yr', c3x + 10, startY + 102);
    drawInputLabel('Price $/kg', c3x + 10, startY + 128);
    drawInputLabel('Market channel', c3x + 10, startY + 154);
    drawComputedRow(c3x + 10, startY + 200, 'Channel mult', results.channelMult.toFixed(2) + '×', COL_TEAL);
    drawComputedRow(c3x + 10, startY + 224, 'Yield/mo (kg)', results.monthlyYieldKg.toFixed(1), COL_GREY);
    drawComputedRow(c3x + 10, startY + 252, 'Revenue /mo', fmtMoney(results.monthlyRevenue), COL_GREEN);

    // Results column 4
    drawResultsPanel(c4x + 10, startY + 40, c4w - 20);
}

function drawColumnPanel(x, y, w, h, title) {
    push();
    noStroke();
    fill(COL_PANEL);
    rect(x, y, w, h, 6);
    stroke(COL_BORDER);
    noFill();
    rect(x, y, w, h, 6);
    pop();
    push();
    noStroke();
    fill(COL_GREEN);
    rect(x, y, w, 22, 6, 6, 0, 0);
    fill(255);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(title, x + 8, y + 11);
    pop();
}

function drawInputLabel(label, x, y) {
    push();
    fill(40);
    noStroke();
    textSize(10);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    text(label, x, y);
    pop();
}

function drawComputedRow(x, y, label, value, color) {
    push();
    noStroke();
    fill(60);
    textSize(10);
    textAlign(LEFT, TOP);
    text(label, x, y);
    fill(color[0], color[1], color[2]);
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, TOP);
    text(value, x + 90, y - 1);
    pop();
}

function drawResultsPanel(x, y, w) {
    const rowH = 30;
    const items = [
        ['Break-even', results.breakEvenKg.toFixed(1) + ' kg/mo', COL_TEAL],
        ['Monthly P/L', fmtMoney(results.monthlyProfit), results.monthlyProfit >= 0 ? COL_GREEN : COL_RED],
        ['Annual Profit', fmtMoney(results.annualProfit), results.annualProfit >= 0 ? COL_GREEN : COL_RED],
        ['NPV (8%, 5 yr)', fmtMoney(results.npv), results.npv >= 0 ? COL_GREEN : COL_RED],
        ['IRR', results.irr === null ? 'n/a' : (results.irr * 100).toFixed(1) + '%', COL_BLUE],
        ['Payback', results.payback === null ? 'n/a' : results.payback.toFixed(1) + ' yr', COL_BLUE],
        ['ROI 5-yr', results.roi5.toFixed(1) + '%', results.roi5 >= 0 ? COL_GREEN : COL_RED]
    ];

    for (let i = 0; i < items.length; i++) {
        const [label, value, color] = items[i];
        const ry = y + i * rowH;

        push();
        noStroke();
        if (i % 2 === 0) fill(245, 248, 245);
        else fill(255);
        rect(x, ry, w, rowH - 2, 3);
        pop();

        push();
        fill(80);
        noStroke();
        textSize(11);
        textAlign(LEFT, CENTER);
        text(label, x + 8, ry + (rowH - 2) / 2);
        fill(color[0], color[1], color[2]);
        textStyle(BOLD);
        textSize(14);
        textAlign(RIGHT, CENTER);
        text(value, x + w - 8, ry + (rowH - 2) / 2);
        pop();
    }
}

function drawCashFlowChart() {
    const w = containerWidth;
    const cx = Math.round(w * 0.02);
    const cy = 410;
    const cw = w - Math.round(w * 0.04);
    const ch = 180;

    push();
    noStroke();
    fill(COL_PANEL);
    rect(cx, cy, cw, ch, 6);
    stroke(COL_BORDER);
    noFill();
    rect(cx, cy, cw, ch, 6);
    pop();

    push();
    noStroke();
    fill(COL_GREEN);
    rect(cx, cy, cw, 22, 6, 6, 0, 0);
    fill(255);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text('5-Year Cash Flow — Revenue (green) / OpEx (red) / CapEx depreciation (orange) / Cumulative (blue)', cx + 8, cy + 11);
    pop();

    // Chart area
    const padL = 60, padR = 80, padT = 35, padB = 28;
    const ax = cx + padL;
    const ay = cy + padT;
    const aw = cw - padL - padR;
    const ah = ch - padT - padB;
    const midY = ay + ah / 2;
    const barRegionH = ah / 2 - 4;

    const annualRev = results.monthlyRevenue * 12;
    const annualOpEx = results.monthlyOpEx * 12;
    const capexAmort = results.totalCapEx / 5;

    // Build cumulative cash flow
    const cumCash = [-results.totalCapEx];
    for (let y = 1; y <= 5; y++) {
        cumCash.push(cumCash[cumCash.length - 1] + results.annualProfit);
    }

    // Scaling
    const maxBar = Math.max(1, annualRev, annualOpEx + capexAmort);
    const maxCum = Math.max(Math.abs(Math.min(...cumCash)), Math.max(...cumCash), 1);
    const barScale = barRegionH / maxBar;

    // Axis
    push();
    stroke(180);
    line(ax, midY, ax + aw, midY);
    pop();

    // Bars per year
    const nYears = 5;
    const bw = aw / (nYears + 1);
    const yearXs = [];
    for (let yr = 1; yr <= nYears; yr++) {
        const bx = ax + bw * (yr - 0.5) - bw * 0.35;
        const bWidth = bw * 0.7;
        const cxCenter = bx + bWidth / 2;
        yearXs.push(cxCenter);

        // Revenue (above midline, green)
        const revH = annualRev * barScale;
        push();
        noStroke();
        fill(COL_GREEN[0], COL_GREEN[1], COL_GREEN[2], 220);
        rect(bx, midY - revH, bWidth, revH);
        pop();

        // OpEx (below midline, red)
        const opexH = annualOpEx * barScale;
        push();
        noStroke();
        fill(COL_RED[0], COL_RED[1], COL_RED[2], 220);
        rect(bx, midY, bWidth, opexH);
        pop();

        // CapEx amortization (stacked below opex, orange)
        const capH = capexAmort * barScale;
        push();
        noStroke();
        fill(COL_ORANGE[0], COL_ORANGE[1], COL_ORANGE[2], 220);
        rect(bx, midY + opexH, bWidth, capH);
        pop();

        // Year label
        push();
        fill(60);
        noStroke();
        textSize(10);
        textAlign(CENTER, TOP);
        text('Yr ' + yr, cxCenter, ay + ah + 4);
        pop();
    }

    // Cumulative cash flow line
    const cumScale = (ah / 2 - 4) / maxCum;
    const points = [];
    // Year 0 starts at axis left
    const y0X = ax + 8;
    const y0Y = midY - cumCash[0] * cumScale;
    points.push([y0X, y0Y]);
    for (let yr = 1; yr <= nYears; yr++) {
        const px = yearXs[yr - 1];
        const py = midY - cumCash[yr] * cumScale;
        points.push([px, py]);
    }

    push();
    stroke(COL_BLUE);
    strokeWeight(2.5);
    noFill();
    beginShape();
    for (const [px, py] of points) vertex(px, py);
    endShape();
    fill(COL_BLUE);
    noStroke();
    for (let i = 0; i < points.length; i++) {
        const [px, py] = points[i];
        circle(px, py, 7);
    }
    pop();

    // Y-axis labels (rough scale)
    push();
    fill(80);
    noStroke();
    textSize(9);
    textAlign(RIGHT, CENTER);
    text(fmtShortMoney(maxBar), ax - 4, midY - barRegionH);
    text('0', ax - 4, midY);
    text('-' + fmtShortMoney(annualOpEx + capexAmort), ax - 4, midY + (annualOpEx + capexAmort) * barScale);
    pop();

    // Cumulative legend (right side)
    push();
    fill(COL_BLUE);
    noStroke();
    textSize(10);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text('Cum:', ax + aw + 6, midY - 30);
    textStyle(NORMAL);
    fill(60);
    text('End Yr 5: ' + fmtShortMoney(cumCash[5]), ax + aw + 6, midY - 12);
    text('Start: ' + fmtShortMoney(cumCash[0]), ax + aw + 6, midY + 4);
    pop();

    // Hover tooltip
    detectHover(ax, ay, aw, ah, bw, midY, annualRev, annualOpEx, capexAmort, cumCash);
}

function detectHover(ax, ay, aw, ah, bw, midY, annualRev, annualOpEx, capexAmort, cumCash) {
    hoverYear = -1;
    if (mouseX < ax || mouseX > ax + aw || mouseY < ay || mouseY > ay + ah) return;
    for (let yr = 1; yr <= 5; yr++) {
        const cxCenter = ax + bw * (yr - 0.5);
        if (Math.abs(mouseX - cxCenter) < bw * 0.45) {
            hoverYear = yr;
            break;
        }
    }
    if (hoverYear < 1) return;

    const lines = [
        'Year ' + hoverYear,
        'Revenue: ' + fmtMoney(annualRev),
        'OpEx: ' + fmtMoney(annualOpEx),
        'CapEx amort: ' + fmtMoney(capexAmort),
        'Cumulative: ' + fmtMoney(cumCash[hoverYear])
    ];
    drawTooltip(mouseX + 12, mouseY + 12, lines);
}

function drawTooltip(x, y, lines) {
    const pad = 6;
    const lh = 14;
    const w = 180;
    const h = lines.length * lh + pad * 2;
    let tx = x, ty = y;
    if (tx + w > containerWidth - 4) tx = containerWidth - w - 4;
    if (ty + h > containerHeight - 4) ty = containerHeight - h - 4;
    push();
    noStroke();
    fill(33, 33, 33, 235);
    rect(tx, ty, w, h, 4);
    fill(255);
    textSize(10);
    textAlign(LEFT, TOP);
    for (let i = 0; i < lines.length; i++) {
        if (i === 0) textStyle(BOLD); else textStyle(NORMAL);
        text(lines[i], tx + pad, ty + pad + i * lh);
    }
    pop();
}

function drawTipBar() {
    push();
    fill(COL_GREY);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Edit any input to see live updates. Hover bars for year detail. Try the buttons above for scenarios.',
         12, drawHeight + 55);
    pop();
}

// ---------- Solar comparison ----------
function computeSolarComparison() {
    const baselineElec = results.opex_electricity;
    const solarReducedElec = baselineElec * 0.2; // 80% offset
    const solarCapEx = 20000;

    // Grid scenario (baseline)
    const gridMonthly = results.monthlyOpEx;
    const gridAnnualProfit = results.annualProfit;
    const gridNPV = results.npv;

    // Solar scenario: reduces electricity, adds CapEx (no extra loan modeling for simplicity)
    const solarDeltaElec = solarReducedElec - baselineElec; // negative
    const solarMonthlyOpEx = results.monthlyOpEx + solarDeltaElec;
    const solarMonthlyProfit = results.monthlyRevenue - solarMonthlyOpEx;
    const solarAnnualProfit = solarMonthlyProfit * 12;
    const solarTotalCapEx = results.totalCapEx + solarCapEx;
    const solarNPV = computeNPV(solarAnnualProfit, solarTotalCapEx, 0.08, 5);

    solarData = {
        gridElec: baselineElec,
        solarElec: solarReducedElec,
        solarCapEx: solarCapEx,
        gridMonthly: gridMonthly,
        solarMonthly: solarMonthlyOpEx,
        gridNPV: gridNPV,
        solarNPV: solarNPV
    };
}

function drawSolarOverlay() {
    const ow = Math.min(520, containerWidth - 40);
    const oh = 280;
    const ox = (containerWidth - ow) / 2;
    const oy = 80;

    drawOverlayPanel(ox, oy, ow, oh, 'Solar vs Grid Electricity');

    if (!solarData) return;
    const d = solarData;
    const y0 = oy + 50;

    push();
    fill(40);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Assumption: solar PV offsets 80% of electricity at +$' + d.solarCapEx.toLocaleString() + ' CapEx.',
         ox + 14, y0);
    pop();

    // Side-by-side bars (monthly OpEx)
    const barX1 = ox + 60;
    const barX2 = ox + ow - 160;
    const barTop = y0 + 50;
    const barMaxH = 120;
    const maxOpex = Math.max(d.gridMonthly, d.solarMonthly, 1);

    drawSolarBar(barX1, barTop, barMaxH, d.gridMonthly / maxOpex * barMaxH,
                 'Grid', d.gridMonthly, d.gridElec, d.gridNPV, COL_RED);
    drawSolarBar(barX2, barTop, barMaxH, d.solarMonthly / maxOpex * barMaxH,
                 'Solar (+$20K)', d.solarMonthly, d.solarElec, d.solarNPV, COL_GREEN);

    push();
    fill(COL_GREY);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    text('Click button again to close.', ox + ow / 2, oy + oh - 18);
    pop();
}

function drawSolarBar(x, top, maxH, h, label, monthly, elec, npv, color) {
    const bw = 70;
    push();
    noStroke();
    fill(color[0], color[1], color[2], 200);
    rect(x, top + (maxH - h), bw, h);
    fill(40);
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(label, x + bw / 2, top + maxH + 6);
    textStyle(NORMAL);
    textSize(10);
    text('Elec $' + Math.round(elec) + '/mo', x + bw / 2, top + maxH + 22);
    text('Total OpEx ' + fmtMoney(monthly), x + bw / 2, top + maxH + 36);
    text('5-yr NPV ' + fmtShortMoney(npv), x + bw / 2, top + maxH + 50);
    pop();
}

// ---------- Monte Carlo ----------
function runMonteCarlo() {
    const n = 1000;
    const basePrice = results.pricePerKg;
    const baseYield = results.yieldPerM2;
    const baseElec = results.opex_electricity;

    const profits = [];
    for (let i = 0; i < n; i++) {
        const priceFactor = 1 + (Math.random() * 0.6 - 0.3);
        const yieldFactor = 1 + (Math.random() * 0.5 - 0.25);
        const elecFactor = 1 + (Math.random() * 0.4 - 0.2);

        const price = basePrice * priceFactor;
        const yld = baseYield * yieldFactor;
        const elec = baseElec * elecFactor;

        const monthlyYield = (results.area * yld * results.cycles) / 12;
        const monthlyRev = monthlyYield * price * results.channelMult;
        const monthlyOpEx = elec + results.opex_water + results.opex_nutrients +
                            results.opex_seeds + results.opex_labor + results.opex_packaging +
                            results.loanPayment;
        const annualProfit = (monthlyRev - monthlyOpEx) * 12;
        profits.push(annualProfit);
    }
    profits.sort((a, b) => a - b);

    const p10 = profits[Math.floor(n * 0.1)];
    const p50 = profits[Math.floor(n * 0.5)];
    const p90 = profits[Math.floor(n * 0.9)];

    // Histogram
    const nBins = 25;
    const min = profits[0];
    const max = profits[n - 1];
    const binW = (max - min) / nBins || 1;
    const bins = new Array(nBins).fill(0);
    for (const p of profits) {
        let idx = Math.floor((p - min) / binW);
        if (idx >= nBins) idx = nBins - 1;
        if (idx < 0) idx = 0;
        bins[idx]++;
    }

    monteData = { profits, p10, p50, p90, bins, min, max, binW };
}

function drawMonteOverlay() {
    const ow = Math.min(640, containerWidth - 40);
    const oh = 360;
    const ox = (containerWidth - ow) / 2;
    const oy = 50;

    drawOverlayPanel(ox, oy, ow, oh, 'Monte Carlo — 1000 simulations of Annual Profit');

    if (!monteData) return;
    const d = monteData;

    push();
    fill(40);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Varying: price ±30%, yield ±25%, electricity ±20% (uniform).', ox + 14, oy + 38);
    pop();

    const chartX = ox + 50;
    const chartY = oy + 80;
    const chartW = ow - 80;
    const chartH = 180;

    push();
    stroke(COL_BORDER);
    noFill();
    rect(chartX, chartY, chartW, chartH);
    pop();

    const maxCount = Math.max(...d.bins);
    const bw = chartW / d.bins.length;
    for (let i = 0; i < d.bins.length; i++) {
        const h = (d.bins[i] / maxCount) * (chartH - 6);
        push();
        noStroke();
        const center = d.min + (i + 0.5) * d.binW;
        if (center < 0) fill(COL_RED[0], COL_RED[1], COL_RED[2], 200);
        else fill(COL_GREEN[0], COL_GREEN[1], COL_GREEN[2], 200);
        rect(chartX + i * bw + 1, chartY + chartH - h, bw - 2, h);
        pop();
    }

    // Zero line
    if (d.min < 0 && d.max > 0) {
        const zeroX = chartX + (0 - d.min) / (d.max - d.min) * chartW;
        push();
        stroke(80);
        strokeWeight(1);
        drawingContext.setLineDash([4, 4]);
        line(zeroX, chartY, zeroX, chartY + chartH);
        drawingContext.setLineDash([]);
        noStroke();
        fill(80);
        textSize(10);
        textAlign(CENTER, BOTTOM);
        text('$0', zeroX, chartY - 2);
        pop();
    }

    // Percentile markers
    drawPercentile(chartX, chartY, chartW, chartH, d.p10, d.min, d.max, 'P10', COL_RED);
    drawPercentile(chartX, chartY, chartW, chartH, d.p50, d.min, d.max, 'P50', COL_BLUE);
    drawPercentile(chartX, chartY, chartW, chartH, d.p90, d.min, d.max, 'P90', COL_GREEN);

    // X-axis labels
    push();
    fill(60);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text(fmtShortMoney(d.min), chartX, chartY + chartH + 4);
    textAlign(RIGHT, TOP);
    text(fmtShortMoney(d.max), chartX + chartW, chartY + chartH + 4);
    pop();

    // Summary
    push();
    fill(40);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    const sy = chartY + chartH + 24;
    text('P10 (downside): ' + fmtMoney(d.p10), ox + 14, sy);
    text('Median P50: ' + fmtMoney(d.p50), ox + 14 + 200, sy);
    text('P90 (upside): ' + fmtMoney(d.p90), ox + 14 + 400, sy);
    pop();

    push();
    fill(COL_GREY);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    text('Click button again to close.', ox + ow / 2, oy + oh - 16);
    pop();
}

function drawPercentile(cx, cy, cw, ch, val, vmin, vmax, label, color) {
    if (vmax === vmin) return;
    const px = cx + (val - vmin) / (vmax - vmin) * cw;
    push();
    stroke(color[0], color[1], color[2]);
    strokeWeight(2);
    line(px, cy, px, cy + ch);
    noStroke();
    fill(color[0], color[1], color[2]);
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, BOTTOM);
    text(label, px, cy - 2);
    pop();
}

// ---------- Export ----------
function drawExportOverlay() {
    const ow = Math.min(640, containerWidth - 40);
    const oh = 480;
    const ox = (containerWidth - ow) / 2;
    const oy = 30;

    drawOverlayPanel(ox, oy, ow, oh, 'Business Plan Summary (one-pager)');

    const lines = buildExportLines();
    push();
    fill(40);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    let ty = oy + 40;
    for (const ln of lines) {
        if (ln.startsWith('# ')) {
            textStyle(BOLD);
            fill(COL_GREEN);
            textSize(12);
            text(ln.substring(2), ox + 14, ty);
            textStyle(NORMAL);
            fill(40);
            textSize(11);
        } else {
            text(ln, ox + 14, ty);
        }
        ty += 16;
    }
    pop();

    push();
    fill(COL_GREY);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    text('Click button again to close. Copy text above into your business plan.',
         ox + ow / 2, oy + oh - 18);
    pop();
}

function buildExportLines() {
    const r = results;
    return [
        '# Capital Expenditure',
        '  Growing system: ' + fmtMoney(r.capex_growing),
        '  Lighting: ' + fmtMoney(r.capex_lighting),
        '  HVAC: ' + fmtMoney(r.capex_hvac),
        '  Automation: ' + fmtMoney(r.capex_automation),
        '  Facility: ' + fmtMoney(r.capex_facility),
        '  Total CapEx: ' + fmtMoney(r.totalCapEx),
        '  Loan payment (7%, 5yr): ' + fmtMoney(r.loanPayment) + '/mo',
        '# Operating Expenses (monthly)',
        '  Electricity: ' + fmtMoney(r.opex_electricity),
        '  Water: ' + fmtMoney(r.opex_water),
        '  Nutrients: ' + fmtMoney(r.opex_nutrients),
        '  Seeds: ' + fmtMoney(r.opex_seeds),
        '  Labor (' + r.opex_laborHours + ' hr × $' + r.opex_laborRate + '): ' + fmtMoney(r.opex_labor),
        '  Packaging: ' + fmtMoney(r.opex_packaging),
        '  Total monthly OpEx: ' + fmtMoney(r.monthlyOpEx),
        '# Revenue',
        '  Growing area: ' + r.area + ' m²',
        '  Yield: ' + r.yieldPerM2 + ' kg/m²/cycle × ' + r.cycles + ' cycles/yr',
        '  Channel: ' + r.channel + ' (×' + r.channelMult.toFixed(2) + ')',
        '  Monthly revenue: ' + fmtMoney(r.monthlyRevenue),
        '# Key Metrics',
        '  Break-even: ' + r.breakEvenKg.toFixed(1) + ' kg/mo',
        '  Monthly profit: ' + fmtMoney(r.monthlyProfit),
        '  Annual profit: ' + fmtMoney(r.annualProfit),
        '  NPV (8%, 5yr): ' + fmtMoney(r.npv),
        '  IRR: ' + (r.irr === null ? 'n/a' : (r.irr * 100).toFixed(1) + '%'),
        '  Payback: ' + (r.payback === null ? 'n/a' : r.payback.toFixed(1) + ' yr'),
        '  ROI 5-yr: ' + r.roi5.toFixed(1) + '%'
    ];
}

// ---------- Overlay helper ----------
function drawOverlayPanel(x, y, w, h, title) {
    push();
    noStroke();
    fill(0, 0, 0, 80);
    rect(0, 0, containerWidth, containerHeight);
    fill(COL_PANEL);
    stroke(COL_GREEN);
    strokeWeight(2);
    rect(x, y, w, h, 8);
    noStroke();
    fill(COL_GREEN);
    rect(x, y, w, 28, 8, 8, 0, 0);
    fill(255);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(title, x + 12, y + 14);
    pop();
}

// ---------- Formatters ----------
function fmtMoney(v) {
    if (!isFinite(v)) return 'n/a';
    const sign = v < 0 ? '-' : '';
    const abs = Math.abs(v);
    return sign + '$' + abs.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmtShortMoney(v) {
    if (!isFinite(v)) return 'n/a';
    const sign = v < 0 ? '-' : '';
    const abs = Math.abs(v);
    if (abs >= 1000000) return sign + '$' + (abs / 1000000).toFixed(1) + 'M';
    if (abs >= 1000) return sign + '$' + (abs / 1000).toFixed(1) + 'K';
    return sign + '$' + abs.toFixed(0);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    layoutInputs();
}
