// Sensor Data Pipeline — p5.js
// CANVAS_HEIGHT: 700
let canvasWidth = 920;
let drawHeight = 560;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// Dataset config
const DAYS = 35;
const SAMPLES_PER_DAY = 48; // 30-min interval
const N = DAYS * SAMPLES_PER_DAY;

// View modes
const VIEW_PH = 'pH';
const VIEW_EC = 'EC';
const VIEW_TEMP = 'Temperature';

// Series data
let cleanSeries = { pH: [], EC: [], Temperature: [] };
let rawSeries = [];          // noise + missing applied (NaN for missing)
let processed = [];          // after validation + fill
let resampled = [];          // after resample (objects: {t, v})
let rolling = [];            // rolling mean over resampled
let stdBand = [];            // {t, mean, std} per resampled point
let regressionLine = null;   // {slope, intercept}
let stats = null;

// Controls
let noiseSlider, missingSlider, validationCb, fillSel, resampleSel,
    rollingSlider, regressionCb, stdCb, viewSel, regenBtn, rawCb;

// Layout
let leftPanelW;       // ~36%
let rightPanelX;
let rightPanelW;      // ~62%
let chartX, chartY, chartW, chartH;

let dirty = true;
let seed = 12345;
let prng = mulberry32(seed);

// Color palette
const COL_RAW = [158, 158, 158];
const COL_CLEAN = [25, 118, 210];
const COL_RESAMP = [255, 152, 0];
const COL_ROLL = [46, 125, 50];
const COL_BAND = [46, 125, 50, 60];
const COL_REG = [239, 83, 80];
const COL_BG = [248, 249, 250];

function mulberry32(a) {
    return function() {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = a;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function randGauss(rng) {
    // Box-Muller
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 960);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    computeLayout();
    generateCleanData();

    // Build controls in left panel
    const labelX = 12;
    let y = 50;
    const ctlX = 12;
    const dy = 50;

    noiseSlider = createSlider(0, 100, 10, 1);
    positionCtl(noiseSlider, ctlX, y, leftPanelW - 24);
    noiseSlider.input(() => dirty = true);
    y += dy;

    missingSlider = createSlider(0, 20, 5, 1);
    positionCtl(missingSlider, ctlX, y, leftPanelW - 24);
    missingSlider.input(() => dirty = true);
    y += dy;

    validationCb = createCheckbox(' Apply validation (out-of-range → NaN)', false);
    validationCb.position(ctlX, y);
    validationCb.style('font-size', '11px');
    validationCb.changed(() => dirty = true);
    y += 24;

    fillSel = createSelect();
    fillSel.option('None');
    fillSel.option('Forward Fill');
    fillSel.option('Interpolate');
    fillSel.selected('Forward Fill');
    fillSel.position(ctlX + 90, y);
    fillSel.style('width', (leftPanelW - 110) + 'px');
    fillSel.changed(() => dirty = true);
    y += 30;

    resampleSel = createSelect();
    resampleSel.option('30 min');
    resampleSel.option('1 hour');
    resampleSel.option('6 hours');
    resampleSel.option('1 day');
    resampleSel.selected('1 hour');
    resampleSel.position(ctlX + 90, y);
    resampleSel.style('width', (leftPanelW - 110) + 'px');
    resampleSel.changed(() => dirty = true);
    y += 30;

    rollingSlider = createSlider(1, 48, 12, 1);
    positionCtl(rollingSlider, ctlX, y + 28, leftPanelW - 24);
    rollingSlider.input(() => dirty = true);
    y += dy + 14;

    regressionCb = createCheckbox(' Show regression line', true);
    regressionCb.position(ctlX, y);
    regressionCb.style('font-size', '11px');
    regressionCb.changed(() => dirty = true);
    y += 22;

    stdCb = createCheckbox(' Show ±1 std band', true);
    stdCb.position(ctlX, y);
    stdCb.style('font-size', '11px');
    stdCb.changed(() => dirty = true);
    y += 22;

    rawCb = createCheckbox(' Show raw points', true);
    rawCb.position(ctlX, y);
    rawCb.style('font-size', '11px');
    y += 26;

    viewSel = createSelect();
    viewSel.option(VIEW_PH);
    viewSel.option(VIEW_EC);
    viewSel.option(VIEW_TEMP);
    viewSel.selected(VIEW_PH);
    viewSel.position(ctlX + 90, y);
    viewSel.style('width', (leftPanelW - 110) + 'px');
    viewSel.changed(() => { dirty = true; });
    y += 32;

    regenBtn = createButton('Regenerate data');
    regenBtn.position(ctlX, y);
    regenBtn.style('font-size', '11px');
    regenBtn.mousePressed(() => {
        seed = Math.floor(Math.random() * 1e9);
        prng = mulberry32(seed);
        generateCleanData();
        dirty = true;
    });
}

function positionCtl(ctl, x, y, w) {
    ctl.position(x, y);
    ctl.style('width', w + 'px');
}

function computeLayout() {
    leftPanelW = Math.floor(width * 0.36);
    rightPanelX = leftPanelW + 8;
    rightPanelW = width - rightPanelX - 8;
    chartX = rightPanelX + 50;
    chartY = 40;
    chartW = rightPanelW - 70;
    chartH = drawHeight - 130;
}

function generateCleanData() {
    cleanSeries.pH = new Array(N);
    cleanSeries.EC = new Array(N);
    cleanSeries.Temperature = new Array(N);
    const rng = mulberry32(seed);

    for (let i = 0; i < N; i++) {
        const day = i / SAMPLES_PER_DAY;
        // daily phase 0..2pi
        const phase = (i % SAMPLES_PER_DAY) / SAMPLES_PER_DAY * 2 * Math.PI;

        // pH: base 6.0, +0.2 daily oscillation, slow +0.005/day drift
        cleanSeries.pH[i] = 6.0 + 0.2 * Math.sin(phase) + 0.005 * day + 0.01 * randGauss(rng);
        // EC: base 1.8 mS/cm, daily ±0.1, slow -0.02/day drift
        cleanSeries.EC[i] = 1.8 + 0.1 * Math.sin(phase + 0.5) - 0.02 * day + 0.005 * randGauss(rng);
        // Temp: base 22 °C, daily ±3 °C
        cleanSeries.Temperature[i] = 22 + 3 * Math.sin(phase - Math.PI / 2) + 0.2 * randGauss(rng);
    }
}

function getScale(view) {
    if (view === VIEW_PH) return { unit: 'pH', noiseScale: 0.5, valMin: 4.5, valMax: 7.5, validMin: 4, validMax: 9 };
    if (view === VIEW_EC) return { unit: 'mS/cm', noiseScale: 0.4, valMin: 0.8, valMax: 2.4, validMin: 0, validMax: 4 };
    return { unit: '°C', noiseScale: 4, valMin: 10, valMax: 35, validMin: 5, validMax: 40 };
}

function recompute() {
    const view = viewSel.value();
    const clean = cleanSeries[view];
    const noisePct = noiseSlider.value() / 100;
    const missPct = missingSlider.value() / 100;
    const cfg = getScale(view);
    const rng = mulberry32(seed + 7);

    // Step 1-3: raw = clean + noise, then missing
    rawSeries = new Array(N);
    for (let i = 0; i < N; i++) {
        let v = clean[i] + randGauss(rng) * noisePct * cfg.noiseScale;
        if (rng() < missPct) v = NaN;
        rawSeries[i] = v;
    }

    // Step 4: validation
    processed = rawSeries.slice();
    if (validationCb.checked()) {
        for (let i = 0; i < N; i++) {
            const v = processed[i];
            if (!isNaN(v) && (v < cfg.validMin || v > cfg.validMax)) processed[i] = NaN;
        }
    }

    // Step 5: fill
    const fillMode = fillSel.value();
    if (fillMode === 'Forward Fill') {
        let last = NaN;
        for (let i = 0; i < N; i++) {
            if (isNaN(processed[i])) {
                if (!isNaN(last)) processed[i] = last;
            } else {
                last = processed[i];
            }
        }
        // back-fill any leading NaNs
        let next = NaN;
        for (let i = N - 1; i >= 0; i--) {
            if (isNaN(processed[i])) {
                if (!isNaN(next)) processed[i] = next;
            } else {
                next = processed[i];
            }
        }
    } else if (fillMode === 'Interpolate') {
        // linear interpolation
        let i = 0;
        while (i < N) {
            if (isNaN(processed[i])) {
                // find prev valid
                let prev = i - 1;
                while (prev >= 0 && isNaN(processed[prev])) prev--;
                // find next valid
                let next = i + 1;
                while (next < N && isNaN(processed[next])) next++;
                if (prev >= 0 && next < N) {
                    const v0 = processed[prev], v1 = processed[next];
                    for (let k = prev + 1; k < next; k++) {
                        const t = (k - prev) / (next - prev);
                        processed[k] = v0 + (v1 - v0) * t;
                    }
                    i = next;
                } else if (prev >= 0) {
                    for (let k = prev + 1; k < N; k++) processed[k] = processed[prev];
                    i = N;
                } else if (next < N) {
                    for (let k = 0; k < next; k++) processed[k] = processed[next];
                    i = next;
                } else {
                    i++;
                }
            } else {
                i++;
            }
        }
    }
    // else "None": keep NaNs

    // Step 6: resample (average consecutive points)
    const resampleMap = { '30 min': 1, '1 hour': 2, '6 hours': 12, '1 day': 48 };
    const bin = resampleMap[resampleSel.value()] || 2;
    resampled = [];
    for (let i = 0; i < N; i += bin) {
        let sum = 0, cnt = 0;
        for (let k = i; k < Math.min(i + bin, N); k++) {
            if (!isNaN(processed[k])) { sum += processed[k]; cnt++; }
        }
        const tDay = (i + bin / 2) / SAMPLES_PER_DAY;
        resampled.push({ t: tDay, v: cnt > 0 ? sum / cnt : NaN });
    }

    // Step 7: rolling mean
    const w = rollingSlider.value();
    rolling = new Array(resampled.length);
    for (let i = 0; i < resampled.length; i++) {
        const start = Math.max(0, i - Math.floor(w / 2));
        const end = Math.min(resampled.length, i + Math.ceil(w / 2));
        let sum = 0, cnt = 0;
        for (let k = start; k < end; k++) {
            if (!isNaN(resampled[k].v)) { sum += resampled[k].v; cnt++; }
        }
        rolling[i] = cnt > 0 ? sum / cnt : NaN;
    }

    // Step 8: regression on resampled (skip NaNs)
    {
        let sx = 0, sy = 0, sxy = 0, sxx = 0, n = 0;
        for (let i = 0; i < resampled.length; i++) {
            const x = resampled[i].t;
            const y = resampled[i].v;
            if (isNaN(y)) continue;
            sx += x; sy += y; sxy += x * y; sxx += x * x; n++;
        }
        if (n > 1) {
            const denom = n * sxx - sx * sx;
            const slope = denom !== 0 ? (n * sxy - sx * sy) / denom : 0;
            const intercept = (sy - slope * sx) / n;
            regressionLine = { slope, intercept, n };
        } else {
            regressionLine = null;
        }
    }

    // Step 9: rolling std band
    stdBand = new Array(resampled.length);
    for (let i = 0; i < resampled.length; i++) {
        const start = Math.max(0, i - Math.floor(w / 2));
        const end = Math.min(resampled.length, i + Math.ceil(w / 2));
        const m = rolling[i];
        let sq = 0, cnt = 0;
        for (let k = start; k < end; k++) {
            const v = resampled[k].v;
            if (!isNaN(v) && !isNaN(m)) { sq += (v - m) * (v - m); cnt++; }
        }
        const sd = cnt > 1 ? Math.sqrt(sq / (cnt - 1)) : 0;
        stdBand[i] = { mean: m, std: sd };
    }

    // Stats
    const validVals = resampled.map(p => p.v).filter(v => !isNaN(v));
    if (validVals.length > 0) {
        const mean = validVals.reduce((a, b) => a + b, 0) / validVals.length;
        const sorted = validVals.slice().sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const variance = validVals.reduce((a, b) => a + (b - mean) ** 2, 0) / validVals.length;
        const std = Math.sqrt(variance);
        const mn = Math.min(...validVals);
        const mx = Math.max(...validVals);
        stats = {
            mean, median, std, min: mn, max: mx,
            slope: regressionLine ? regressionLine.slope : 0,
            unit: cfg.unit
        };
    } else {
        stats = null;
    }
}

function draw() {
    background(COL_BG);

    if (dirty) {
        recompute();
        dirty = false;
    }

    drawLeftPanel();
    drawChart();
    drawStatsPanel();
    drawHoverCursor();
    drawTitle();
}

function drawTitle() {
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Sensor Data Pipeline', 12, 10);
    textStyle(NORMAL);
    textSize(11);
    fill(108, 117, 125);
    text('Adjust each step → see the chart update', 12, 26);
    pop();
}

function drawLeftPanel() {
    push();
    fill(255);
    stroke(222, 226, 230);
    rect(6, 6, leftPanelW - 4, drawHeight - 12, 4);
    pop();

    // Labels above each control
    push();
    noStroke();
    fill(33);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, BOTTOM);

    text(`Noise level: ${noiseSlider.value()}%`, 12, 48);
    text(`Missing data: ${missingSlider.value()}%`, 12, 98);
    // validation cb has its own label at 138
    text('Fill missing:', 12, 200);
    text('Resample to:', 12, 230);
    text(`Rolling window: ${rollingSlider.value()} samples`, 12, 258);
    // 3 checkboxes after slider
    text('View Mode:', 12, 432);
    pop();
}

function dataToScreenX(tDay) {
    return chartX + (tDay / DAYS) * chartW;
}
function dataToScreenY(v, vMin, vMax) {
    return chartY + chartH - ((v - vMin) / (vMax - vMin)) * chartH;
}

function getYRange() {
    const view = viewSel.value();
    // Auto-fit based on resampled data + rolling
    let mn = Infinity, mx = -Infinity;
    for (const p of resampled) {
        if (!isNaN(p.v)) { if (p.v < mn) mn = p.v; if (p.v > mx) mx = p.v; }
    }
    for (const v of rolling) {
        if (!isNaN(v)) { if (v < mn) mn = v; if (v > mx) mx = v; }
    }
    if (!isFinite(mn) || !isFinite(mx)) {
        const cfg = getScale(view);
        return { mn: cfg.valMin, mx: cfg.valMax };
    }
    const pad = (mx - mn) * 0.15 + 0.05;
    return { mn: mn - pad, mx: mx + pad };
}

function drawChart() {
    // Chart background
    push();
    fill(255);
    stroke(222, 226, 230);
    rect(rightPanelX, 6, rightPanelW, drawHeight - 12, 4);
    pop();

    const view = viewSel.value();
    const cfg = getScale(view);
    const { mn, mx } = getYRange();

    // Y gridlines + labels
    push();
    stroke(238, 238, 238);
    strokeWeight(1);
    fill(100);
    textSize(10);
    textAlign(RIGHT, CENTER);
    noStroke();
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
        const v = mn + (mx - mn) * (i / yTicks);
        const y = dataToScreenY(v, mn, mx);
        stroke(238, 238, 238);
        line(chartX, y, chartX + chartW, y);
        noStroke();
        fill(100);
        text(v.toFixed(2), chartX - 4, y);
    }
    pop();

    // X gridlines + labels
    push();
    textSize(10);
    textAlign(CENTER, TOP);
    fill(100);
    const xTicks = 7;
    for (let i = 0; i <= xTicks; i++) {
        const d = (DAYS * i) / xTicks;
        const x = dataToScreenX(d);
        stroke(238, 238, 238);
        line(x, chartY, x, chartY + chartH);
        noStroke();
        fill(100);
        text(`d${d.toFixed(0)}`, x, chartY + chartH + 4);
    }
    pop();

    // Axis title
    push();
    noStroke();
    fill(60);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(`${view} (${cfg.unit})`, chartX, 12);
    textAlign(CENTER, TOP);
    text('Time (days)', chartX + chartW / 2, chartY + chartH + 18);
    pop();

    // Clip to chart area for series
    push();
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(chartX, chartY, chartW, chartH);
    drawingContext.clip();

    // ±1 std band (drawn first, behind everything)
    if (stdCb.checked() && stdBand.length > 0) {
        push();
        noStroke();
        fill(COL_BAND[0], COL_BAND[1], COL_BAND[2], COL_BAND[3]);
        beginShape();
        for (let i = 0; i < resampled.length; i++) {
            const b = stdBand[i];
            if (isNaN(b.mean)) continue;
            const x = dataToScreenX(resampled[i].t);
            const y = dataToScreenY(b.mean + b.std, mn, mx);
            vertex(x, y);
        }
        for (let i = resampled.length - 1; i >= 0; i--) {
            const b = stdBand[i];
            if (isNaN(b.mean)) continue;
            const x = dataToScreenX(resampled[i].t);
            const y = dataToScreenY(b.mean - b.std, mn, mx);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    // Raw points
    if (rawCb.checked()) {
        push();
        noStroke();
        fill(COL_RAW[0], COL_RAW[1], COL_RAW[2], 110);
        // subsample raw for performance — draw every 2nd point
        for (let i = 0; i < N; i += 2) {
            const v = rawSeries[i];
            if (isNaN(v)) continue;
            const t = i / SAMPLES_PER_DAY;
            const x = dataToScreenX(t);
            const y = dataToScreenY(v, mn, mx);
            circle(x, y, 2);
        }
        pop();
    }

    // Cleaned line (processed) — blue
    push();
    noFill();
    stroke(COL_CLEAN[0], COL_CLEAN[1], COL_CLEAN[2], 180);
    strokeWeight(1);
    beginShape();
    let inLine = false;
    for (let i = 0; i < N; i += 2) {
        const v = processed[i];
        if (isNaN(v)) {
            if (inLine) { endShape(); beginShape(); inLine = false; }
            continue;
        }
        const t = i / SAMPLES_PER_DAY;
        vertex(dataToScreenX(t), dataToScreenY(v, mn, mx));
        inLine = true;
    }
    endShape();
    pop();

    // Resampled line — orange
    push();
    noFill();
    stroke(COL_RESAMP[0], COL_RESAMP[1], COL_RESAMP[2]);
    strokeWeight(1.5);
    beginShape();
    let inLine2 = false;
    for (let i = 0; i < resampled.length; i++) {
        const p = resampled[i];
        if (isNaN(p.v)) {
            if (inLine2) { endShape(); beginShape(); inLine2 = false; }
            continue;
        }
        vertex(dataToScreenX(p.t), dataToScreenY(p.v, mn, mx));
        inLine2 = true;
    }
    endShape();
    pop();

    // Rolling mean — thick green
    push();
    noFill();
    stroke(COL_ROLL[0], COL_ROLL[1], COL_ROLL[2]);
    strokeWeight(2.5);
    beginShape();
    let inLine3 = false;
    for (let i = 0; i < resampled.length; i++) {
        const v = rolling[i];
        if (isNaN(v)) {
            if (inLine3) { endShape(); beginShape(); inLine3 = false; }
            continue;
        }
        vertex(dataToScreenX(resampled[i].t), dataToScreenY(v, mn, mx));
        inLine3 = true;
    }
    endShape();
    pop();

    // Regression line — red dashed
    if (regressionCb.checked() && regressionLine) {
        push();
        stroke(COL_REG[0], COL_REG[1], COL_REG[2]);
        strokeWeight(2);
        drawingContext.setLineDash([8, 5]);
        const y0 = regressionLine.intercept + regressionLine.slope * 0;
        const y1 = regressionLine.intercept + regressionLine.slope * DAYS;
        line(dataToScreenX(0), dataToScreenY(y0, mn, mx),
             dataToScreenX(DAYS), dataToScreenY(y1, mn, mx));
        drawingContext.setLineDash([]);
        pop();
    }

    drawingContext.restore();
    pop();

    // Chart border
    push();
    noFill();
    stroke(180);
    rect(chartX, chartY, chartW, chartH);
    pop();

    // Legend
    drawLegend();
}

function drawLegend() {
    const items = [
        { c: COL_RAW, label: 'Raw' },
        { c: COL_CLEAN, label: 'Cleaned' },
        { c: COL_RESAMP, label: 'Resampled' },
        { c: COL_ROLL, label: 'Rolling mean' },
        { c: COL_REG, label: 'Regression' }
    ];
    push();
    textSize(10);
    textAlign(LEFT, CENTER);
    let lx = chartX + 6;
    const ly = chartY + 6;
    for (const it of items) {
        noStroke();
        fill(it.c[0], it.c[1], it.c[2]);
        rect(lx, ly - 4, 14, 8);
        fill(60);
        text(it.label, lx + 18, ly);
        lx += 18 + textWidth(it.label) + 14;
    }
    pop();
}

function drawStatsPanel() {
    const py = drawHeight + 4;
    const ph = controlHeight - 8;
    push();
    fill(255);
    stroke(222, 226, 230);
    rect(6, py, width - 12, ph, 4);
    pop();

    push();
    noStroke();
    fill(46, 125, 50);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Statistics (on resampled series)', 14, py + 6);
    pop();

    if (!stats) {
        push();
        noStroke();
        fill(120);
        textSize(11);
        text('No valid data — try lowering missing% or disabling validation.', 14, py + 28);
        pop();
        return;
    }

    const cols = [
        ['Mean', stats.mean.toFixed(3) + ' ' + stats.unit],
        ['Median', stats.median.toFixed(3) + ' ' + stats.unit],
        ['Std', stats.std.toFixed(3)],
        ['Min', stats.min.toFixed(3)],
        ['Max', stats.max.toFixed(3)],
        ['Slope', stats.slope.toFixed(4) + ' /day']
    ];

    const sx = 14;
    const sy = py + 30;
    const colW = Math.floor((width - 28) / 6);
    push();
    textSize(11);
    textAlign(LEFT, TOP);
    for (let i = 0; i < cols.length; i++) {
        const cx = sx + i * colW;
        noStroke();
        fill(108, 117, 125);
        text(cols[i][0], cx, sy);
        fill(33);
        textStyle(BOLD);
        text(cols[i][1], cx, sy + 14);
        textStyle(NORMAL);
    }
    pop();

    // Tip
    push();
    noStroke();
    fill(108, 117, 125);
    textSize(10);
    textAlign(LEFT, TOP);
    text('Tip: hover the chart to see exact values. Try raising noise then turn on rolling window to see smoothing.',
         14, py + ph - 18);
    pop();
}

function drawHoverCursor() {
    if (mouseX < chartX || mouseX > chartX + chartW ||
        mouseY < chartY || mouseY > chartY + chartH) return;

    const { mn, mx } = getYRange();
    const tDay = ((mouseX - chartX) / chartW) * DAYS;

    // Vertical line
    push();
    stroke(120, 120, 120, 180);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);
    line(mouseX, chartY, mouseX, chartY + chartH);
    drawingContext.setLineDash([]);
    pop();

    // Find nearest resampled point
    let nearest = null;
    let bestD = Infinity;
    for (const p of resampled) {
        const d = Math.abs(p.t - tDay);
        if (d < bestD) { bestD = d; nearest = p; }
    }
    if (!nearest) return;

    const view = viewSel.value();
    const cfg = getScale(view);
    const rawIdx = Math.min(N - 1, Math.max(0, Math.round(tDay * SAMPLES_PER_DAY)));
    const rawV = rawSeries[rawIdx];
    const procV = processed[rawIdx];

    // Dot on resampled
    if (!isNaN(nearest.v)) {
        push();
        noStroke();
        fill(COL_RESAMP[0], COL_RESAMP[1], COL_RESAMP[2]);
        circle(dataToScreenX(nearest.t), dataToScreenY(nearest.v, mn, mx), 7);
        pop();
    }

    // Tooltip
    const lines = [
        `t = ${tDay.toFixed(2)} d`,
        `raw  = ${isNaN(rawV) ? 'NaN' : rawV.toFixed(3)}`,
        `clean = ${isNaN(procV) ? 'NaN' : procV.toFixed(3)}`,
        `resamp = ${isNaN(nearest.v) ? 'NaN' : nearest.v.toFixed(3)} ${cfg.unit}`
    ];
    const boxW = 150;
    const boxH = 14 + lines.length * 13;
    let bx = mouseX + 10;
    let by = mouseY + 10;
    if (bx + boxW > chartX + chartW) bx = mouseX - 10 - boxW;
    if (by + boxH > chartY + chartH) by = mouseY - 10 - boxH;

    push();
    fill(255, 255, 255, 240);
    stroke(150);
    rect(bx, by, boxW, boxH, 3);
    noStroke();
    fill(33);
    textSize(10);
    textAlign(LEFT, TOP);
    for (let i = 0; i < lines.length; i++) {
        text(lines[i], bx + 6, by + 6 + i * 13);
    }
    pop();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    computeLayout();
    dirty = true;
}
