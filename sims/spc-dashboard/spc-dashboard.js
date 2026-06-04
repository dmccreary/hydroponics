// SPC Dashboard — p5.js
// CANVAS_HEIGHT: 720
let canvasWidth = 960;
let drawHeight = 580;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// Palette
const COL_GREEN = [46, 125, 50];
const COL_BLUE = [25, 118, 210];
const COL_RED = [239, 83, 80];
const COL_ORANGE = [255, 152, 0];
const COL_YELLOW = [255, 235, 59];
const COL_GREY = [120, 120, 120];
const COL_BG = [248, 249, 250];

// Data
const N_DAYS = 35;
const HOURS = 24;
const N_POINTS = N_DAYS * HOURS;

const SERIES_DEFS = {
    pH: { label: 'pH', units: '', target: 6.0, std: 0.15, color: COL_BLUE, yMin: 5.0, yMax: 7.2 },
    EC: { label: 'EC', units: ' mS/cm', target: 1.8, std: 0.10, color: COL_BLUE, yMin: 1.2, yMax: 2.4 },
    Temp: { label: 'Temperature', units: ' °C', target: 22, std: 1.2, color: COL_BLUE, yMin: 16, yMax: 28 }
};

let dataMap = {};            // series -> array of values length N_POINTS
let statsMap = {};           // series -> stats object (mean, std, ucl, lcl, ...)
let anomMap = {};            // series -> array of anomaly objects
let histMap = {};            // series -> histogram bins

// UI
let tabBtns = {};
let timeSlider, allMethodsCB, dosingCB;
let activeSeries = 'pH';
let prevAllMethods = false;
let prevDosing = false;
let selectedIdx = -1;       // index of selected point in full series
let highlightedAnomalyIdx = -1;
let anomScroll = 0;

// Chart geometry (recomputed in draw)
let chartBox = { x: 0, y: 0, w: 0, h: 0 };
let plotPoints = []; // for click hit-testing  [{i, x, y, value}]

// -------- LCG seeded RNG --------
let _seed = 1234567;
function seedRand(s) { _seed = s >>> 0; }
function rand() {
    _seed = (Math.imul(1664525, _seed) + 1013904223) >>> 0;
    return _seed / 4294967296;
}
function randn() {
    // Box-Muller
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, canvasWidth);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    buildAllData();

    // Tabs
    let x = 12;
    const tabY = drawHeight + 8;
    for (const s of ['pH', 'EC', 'Temp']) {
        const b = createButton(SERIES_DEFS[s].label);
        b.position(x, tabY);
        b.mousePressed(() => { activeSeries = s; selectedIdx = -1; highlightedAnomalyIdx = -1; anomScroll = 0; styleTabs(); });
        tabBtns[s] = b;
        x += 110;
    }
    styleTabs();

    // Time slider
    timeSlider = createSlider(1, N_DAYS, N_DAYS, 1);
    timeSlider.position(360, tabY + 4);
    timeSlider.style('width', '220px');

    // Checkboxes
    allMethodsCB = createCheckbox(' Show all methods (IQR, MA bands)', false);
    allMethodsCB.position(12, tabY + 38);

    dosingCB = createCheckbox(' Simulate dosing event (+spike at day 18)', false);
    dosingCB.position(12, tabY + 62);
}

function styleTabs() {
    for (const s of Object.keys(tabBtns)) {
        const b = tabBtns[s];
        if (s === activeSeries) {
            b.style('background', 'rgb(46,125,50)');
            b.style('color', 'white');
            b.style('border', '1px solid #2e7d32');
            b.style('font-weight', 'bold');
        } else {
            b.style('background', '#ffffff');
            b.style('color', '#333');
            b.style('border', '1px solid #ccc');
            b.style('font-weight', 'normal');
        }
        b.style('padding', '4px 10px');
        b.style('border-radius', '4px');
        b.style('cursor', 'pointer');
    }
}

// -------- Data generation --------
function buildAllData() {
    const dosing = dosingCB ? dosingCB.checked() : false;
    for (const s of Object.keys(SERIES_DEFS)) {
        seedRand(s === 'pH' ? 1001 : s === 'EC' ? 2002 : 3003);
        const def = SERIES_DEFS[s];
        const arr = new Array(N_POINTS);
        for (let i = 0; i < N_POINTS; i++) {
            const day = i / HOURS;
            const hour = i % HOURS;
            let v = def.target + randn() * def.std;
            if (s === 'pH') {
                // upward drift between day 22 and day 28: +0.4 over the period
                if (day >= 22 && day <= 28) {
                    const t = (day - 22) / 6;
                    v += 0.4 * t;
                }
                if (dosing && day >= 18 && day < 18 + 6 / 24) {
                    // 6-hour pH spike +0.7
                    v += 0.7;
                }
            } else if (s === 'EC') {
                // sharp dip on day 12
                if (day >= 12 && day < 12 + 4 / 24) v -= 0.6;
                if (dosing && day >= 18 && day < 18 + 6 / 24) v += 0.35;
            } else if (s === 'Temp') {
                // 24h diurnal cycle, amplitude 2 °C, peak around hour 14
                v += 2 * Math.sin((hour - 14) / 24 * 2 * Math.PI);
                if (dosing && day >= 18 && day < 18 + 6 / 24) v += 1.5;
            }
            arr[i] = v;
        }
        // sprinkle a few random spikes
        seedRand(s === 'pH' ? 7001 : s === 'EC' ? 7002 : 7003);
        for (let k = 0; k < 4; k++) {
            const idx = Math.floor(rand() * N_POINTS);
            const sign = rand() < 0.5 ? -1 : 1;
            arr[idx] += sign * (3.2 + rand() * 0.6) * def.std;
        }
        dataMap[s] = arr;
        computeStats(s);
        computeAnomalies(s);
        computeHistogram(s);
    }
}

function computeStats(s) {
    const arr = dataMap[s];
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    const mean = sum / arr.length;
    let sq = 0;
    for (let i = 0; i < arr.length; i++) sq += (arr[i] - mean) * (arr[i] - mean);
    const std = Math.sqrt(sq / arr.length);
    // trend slope over the whole series (units per day)
    // linear regression of value vs day index
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (let i = 0; i < arr.length; i++) {
        const x = i / HOURS;
        sx += x; sy += arr[i]; sxx += x * x; sxy += x * arr[i];
    }
    const n = arr.length;
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    // % in-control: fraction inside ±3σ of the process mean
    let inCtrl = 0;
    for (let i = 0; i < arr.length; i++) {
        if (Math.abs(arr[i] - mean) <= 3 * std) inCtrl++;
    }
    // IQR
    const sorted = arr.slice().sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    statsMap[s] = {
        mean, std,
        ucl: mean + 3 * std, lcl: mean - 3 * std,
        uwl: mean + 2 * std, lwl: mean - 2 * std,
        pctInCtrl: 100 * inCtrl / arr.length,
        slope,
        q1, q3, iqr,
        iqrHi: q3 + 1.5 * iqr,
        iqrLo: q1 - 1.5 * iqr
    };
}

function computeAnomalies(s) {
    const arr = dataMap[s];
    const st = statsMap[s];
    const list = [];
    // Z-score (>3σ)
    for (let i = 0; i < arr.length; i++) {
        const z = (arr[i] - st.mean) / st.std;
        if (Math.abs(z) > 3) {
            list.push({ idx: i, value: arr[i], z, type: 'Z-score' });
        }
    }
    // IQR (outside Tukey fences)
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > st.iqrHi || arr[i] < st.iqrLo) {
            // dedupe with z-score by idx
            if (!list.some(a => a.idx === i)) {
                const z = (arr[i] - st.mean) / st.std;
                list.push({ idx: i, value: arr[i], z, type: 'IQR' });
            }
        }
    }
    // Trend (7-day rolling regression slope above threshold)
    const win = 7 * HOURS;
    const slopeThresh = (s === 'pH') ? 0.04 : (s === 'EC') ? 0.03 : 0.20;
    for (let i = win; i < arr.length; i += HOURS) {
        let sx = 0, sy = 0, sxx = 0, sxy = 0;
        for (let j = i - win; j < i; j++) {
            const x = j / HOURS;
            sx += x; sy += arr[j]; sxx += x * x; sxy += x * arr[j];
        }
        const n = win;
        const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
        if (Math.abs(slope) > slopeThresh) {
            if (!list.some(a => a.idx === i && a.type === 'Trend')) {
                list.push({ idx: i, value: arr[i], z: slope, type: 'Trend' });
            }
        }
    }
    list.sort((a, b) => a.idx - b.idx);
    anomMap[s] = list;
}

function computeHistogram(s) {
    const arr = dataMap[s];
    const def = SERIES_DEFS[s];
    const nb = 20;
    const lo = def.yMin, hi = def.yMax;
    const bins = new Array(nb).fill(0);
    for (let i = 0; i < arr.length; i++) {
        let b = Math.floor((arr[i] - lo) / (hi - lo) * nb);
        if (b < 0) b = 0;
        if (b >= nb) b = nb - 1;
        bins[b]++;
    }
    histMap[s] = { bins, lo, hi };
}

// -------- Draw --------
function draw() {
    background(COL_BG[0], COL_BG[1], COL_BG[2]);

    // Recompute if dosing checkbox flipped
    const dosingNow = dosingCB.checked();
    if (dosingNow !== prevDosing) {
        prevDosing = dosingNow;
        buildAllData();
        selectedIdx = -1;
        highlightedAnomalyIdx = -1;
    }

    drawTitle();
    drawControlChart();
    drawBottomPanels();
    drawControlsTip();
}

function drawTitle() {
    push();
    noStroke();
    fill(COL_GREEN[0], COL_GREEN[1], COL_GREEN[2]);
    textStyle(BOLD);
    textSize(15);
    textAlign(LEFT, TOP);
    const def = SERIES_DEFS[activeSeries];
    text('SPC Dashboard — ' + def.label + def.units + '  (' + N_DAYS + '-day cycle, hourly data)', 12, 8);
    textStyle(NORMAL);
    pop();
}

function drawControlChart() {
    const def = SERIES_DEFS[activeSeries];
    const st = statsMap[activeSeries];
    const arr = dataMap[activeSeries];
    const anoms = anomMap[activeSeries];

    const daysShown = timeSlider.value();
    const startIdx = Math.max(0, N_POINTS - daysShown * HOURS);
    const endIdx = N_POINTS;

    // chart box: full canvas width minus margins, height = (drawHeight - 230)
    const left = 60, right = 20, top = 36;
    const chartH = drawHeight - 220 - top;
    chartBox = { x: left, y: top, w: width - left - right, h: chartH };

    // background
    push();
    noStroke();
    fill(255);
    rect(chartBox.x, chartBox.y, chartBox.w, chartBox.h, 4);
    stroke(222, 226, 230);
    noFill();
    rect(chartBox.x, chartBox.y, chartBox.w, chartBox.h, 4);
    pop();

    // y range from def
    const yLo = def.yMin, yHi = def.yMax;
    const xToPix = (i) => chartBox.x + (i - startIdx) / (endIdx - startIdx) * chartBox.w;
    const yToPix = (v) => chartBox.y + chartBox.h - (v - yLo) / (yHi - yLo) * chartBox.h;

    // Trend-anomaly shading (only on pH if drift active in range)
    if (activeSeries === 'pH') {
        const dStart = 22, dEnd = 28;
        const iA = dStart * HOURS, iB = dEnd * HOURS;
        if (iB >= startIdx && iA <= endIdx) {
            const xA = xToPix(Math.max(iA, startIdx));
            const xB = xToPix(Math.min(iB, endIdx));
            push();
            noStroke();
            fill(239, 83, 80, 40);
            rect(xA, chartBox.y, xB - xA, chartBox.h);
            fill(180, 30, 30);
            textSize(10);
            textStyle(BOLD);
            textAlign(CENTER, TOP);
            text('trend anomaly (day 22–28)', (xA + xB) / 2, chartBox.y + 4);
            textStyle(NORMAL);
            pop();
        }
    }

    // Gridlines and y-axis labels
    push();
    stroke(235);
    strokeWeight(1);
    const nY = 5;
    for (let k = 0; k <= nY; k++) {
        const v = yLo + (yHi - yLo) * k / nY;
        const y = yToPix(v);
        line(chartBox.x, y, chartBox.x + chartBox.w, y);
    }
    pop();

    push();
    fill(80);
    noStroke();
    textSize(10);
    textAlign(RIGHT, CENTER);
    for (let k = 0; k <= nY; k++) {
        const v = yLo + (yHi - yLo) * k / nY;
        const y = yToPix(v);
        text(v.toFixed(2), chartBox.x - 4, y);
    }
    textAlign(LEFT, TOP);
    push();
    translate(14, chartBox.y + chartBox.h / 2);
    rotate(-Math.PI / 2);
    textAlign(CENTER, CENTER);
    text(def.label + def.units, 0, 0);
    pop();
    pop();

    // X-axis day labels
    push();
    fill(80);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    const tickStep = daysShown <= 7 ? 1 : (daysShown <= 14 ? 2 : (daysShown <= 21 ? 3 : 5));
    const startDay = Math.ceil(startIdx / HOURS);
    const endDay = Math.floor(endIdx / HOURS);
    for (let d = startDay; d <= endDay; d += tickStep) {
        const x = xToPix(d * HOURS);
        stroke(200);
        line(x, chartBox.y + chartBox.h, x, chartBox.y + chartBox.h + 4);
        noStroke();
        text('d' + d, x, chartBox.y + chartBox.h + 6);
    }
    text('Day', chartBox.x + chartBox.w / 2, chartBox.y + chartBox.h + 22);
    pop();

    // Control limits
    drawHLine(yToPix(st.mean), COL_GREEN, 2, false, chartBox);
    labelLine('CL ' + st.mean.toFixed(2), chartBox.x + chartBox.w - 6, yToPix(st.mean) - 4, COL_GREEN);
    drawHLine(yToPix(st.ucl), COL_RED, 1.5, true, chartBox);
    labelLine('UCL', chartBox.x + chartBox.w - 6, yToPix(st.ucl) - 4, COL_RED);
    drawHLine(yToPix(st.lcl), COL_RED, 1.5, true, chartBox);
    labelLine('LCL', chartBox.x + chartBox.w - 6, yToPix(st.lcl) - 4, COL_RED);
    drawHLine(yToPix(st.uwl), COL_ORANGE, 1, true, chartBox, [2, 4]);
    drawHLine(yToPix(st.lwl), COL_ORANGE, 1, true, chartBox, [2, 4]);

    // All methods overlays
    if (allMethodsCB.checked()) {
        drawHLine(yToPix(st.iqrHi), [120, 60, 180], 1.2, true, chartBox, [6, 3]);
        drawHLine(yToPix(st.iqrLo), [120, 60, 180], 1.2, true, chartBox, [6, 3]);
        labelLine('IQR hi', chartBox.x + 6, yToPix(st.iqrHi) - 4, [120, 60, 180]);
        labelLine('IQR lo', chartBox.x + 6, yToPix(st.iqrLo) - 4, [120, 60, 180]);
    }

    // Raw line
    push();
    stroke(def.color[0], def.color[1], def.color[2], 200);
    strokeWeight(1.2);
    noFill();
    beginShape();
    for (let i = startIdx; i < endIdx; i++) {
        vertex(xToPix(i), yToPix(arr[i]));
    }
    endShape();
    pop();

    // Rolling mean (window 12)
    push();
    stroke(COL_BLUE[0], COL_BLUE[1], COL_BLUE[2]);
    strokeWeight(2.5);
    noFill();
    beginShape();
    const win = 12;
    for (let i = startIdx; i < endIdx; i++) {
        const lo = Math.max(0, i - win + 1);
        let s = 0;
        for (let j = lo; j <= i; j++) s += arr[j];
        const m = s / (i - lo + 1);
        vertex(xToPix(i), yToPix(m));
    }
    endShape();
    pop();

    // MA ±2 std bands (only when allMethods)
    if (allMethodsCB.checked()) {
        push();
        noStroke();
        fill(25, 118, 210, 35);
        beginShape();
        const win2 = 12;
        for (let i = startIdx; i < endIdx; i++) {
            const lo = Math.max(0, i - win2 + 1);
            let s = 0, sq = 0, n = 0;
            for (let j = lo; j <= i; j++) { s += arr[j]; n++; }
            const m = s / n;
            for (let j = lo; j <= i; j++) sq += (arr[j] - m) * (arr[j] - m);
            const sd = Math.sqrt(sq / n);
            vertex(xToPix(i), yToPix(m + 2 * sd));
        }
        for (let i = endIdx - 1; i >= startIdx; i--) {
            const lo = Math.max(0, i - win2 + 1);
            let s = 0, sq = 0, n = 0;
            for (let j = lo; j <= i; j++) { s += arr[j]; n++; }
            const m = s / n;
            for (let j = lo; j <= i; j++) sq += (arr[j] - m) * (arr[j] - m);
            const sd = Math.sqrt(sq / n);
            vertex(xToPix(i), yToPix(m - 2 * sd));
        }
        endShape(CLOSE);
        pop();
    }

    // Plot anomalies as red dots, build hit-test array of all visible points (subsample)
    plotPoints = [];
    push();
    for (let i = startIdx; i < endIdx; i++) {
        // hit-test entries every 3 points
        if (i % 3 === 0) plotPoints.push({ i, x: xToPix(i), y: yToPix(arr[i]), value: arr[i] });
    }
    pop();

    // Out-of-control circles
    push();
    for (const a of anoms) {
        if (a.idx < startIdx || a.idx >= endIdx) continue;
        const x = xToPix(a.idx), y = yToPix(a.value);
        if (a.type === 'Z-score') {
            noStroke();
            fill(COL_RED[0], COL_RED[1], COL_RED[2]);
            circle(x, y, 8);
        } else if (a.type === 'IQR') {
            if (allMethodsCB.checked()) {
                noFill();
                stroke(120, 60, 180);
                strokeWeight(1.5);
                rect(x - 4, y - 4, 8, 8);
            }
        } else if (a.type === 'Trend') {
            noStroke();
            fill(255, 152, 0, 220);
            triangle(x, y - 5, x - 5, y + 4, x + 5, y + 4);
        }
    }
    pop();

    // Selection highlight
    if (selectedIdx >= startIdx && selectedIdx < endIdx) {
        push();
        const x = xToPix(selectedIdx);
        const y = yToPix(arr[selectedIdx]);
        noFill();
        stroke(COL_YELLOW[0], 200, 0);
        strokeWeight(2.5);
        circle(x, y, 14);
        // crosshair
        stroke(255, 200, 0, 120);
        strokeWeight(1);
        drawingContext.setLineDash([3, 3]);
        line(x, chartBox.y, x, chartBox.y + chartBox.h);
        line(chartBox.x, y, chartBox.x + chartBox.w, y);
        drawingContext.setLineDash([]);
        // value tag
        noStroke();
        fill(33);
        textSize(10);
        textStyle(BOLD);
        textAlign(LEFT, BOTTOM);
        const dayLabel = (selectedIdx / HOURS);
        text('d' + Math.floor(dayLabel) + ' h' + (selectedIdx % HOURS) + ' = ' + arr[selectedIdx].toFixed(2),
             Math.min(x + 8, chartBox.x + chartBox.w - 120), y - 8);
        textStyle(NORMAL);
        pop();
    }

    // Legend top-right inside chart
    push();
    textSize(10);
    textAlign(LEFT, TOP);
    let lx = chartBox.x + 10, ly = chartBox.y + 6;
    noStroke();
    fill(def.color[0], def.color[1], def.color[2]);
    rect(lx, ly + 3, 12, 2); fill(33); text('raw', lx + 16, ly);
    fill(COL_BLUE[0], COL_BLUE[1], COL_BLUE[2]);
    rect(lx + 60, ly + 3, 12, 3); fill(33); text('MA(12)', lx + 76, ly);
    fill(COL_RED[0], COL_RED[1], COL_RED[2]);
    circle(lx + 130, ly + 5, 6); fill(33); text('z>3σ', lx + 138, ly);
    fill(255, 152, 0);
    triangle(lx + 180, ly + 9, lx + 175, ly + 1, lx + 185, ly + 1); fill(33); text('trend', lx + 190, ly);
    pop();
}

function drawHLine(y, col, w, dashed, box, dash) {
    push();
    stroke(col[0], col[1], col[2]);
    strokeWeight(w);
    if (dashed) drawingContext.setLineDash(dash || [6, 4]);
    line(box.x, y, box.x + box.w, y);
    drawingContext.setLineDash([]);
    pop();
}
function labelLine(label, x, y, col) {
    push();
    noStroke();
    fill(col[0], col[1], col[2]);
    textSize(10);
    textAlign(RIGHT, BOTTOM);
    if (x < chartBox.x + chartBox.w / 2) textAlign(LEFT, BOTTOM);
    text(label, x, y);
    pop();
}

function drawBottomPanels() {
    const top = chartBox.y + chartBox.h + 38;
    const h = drawHeight - top - 8;
    const totalW = width - 24;
    const colW = (totalW - 16) / 3;
    const xs = 12;
    drawStatsPanel(xs, top, colW, h);
    drawAnomalyPanel(xs + colW + 8, top, colW, h);
    drawHistogramPanel(xs + (colW + 8) * 2, top, colW, h);
}

function drawStatsPanel(x, y, w, h) {
    const st = statsMap[activeSeries];
    const def = SERIES_DEFS[activeSeries];
    panelBg(x, y, w, h, 'Statistics');
    push();
    fill(33); noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    const u = def.units;
    let yy = y + 26;
    const lh = 16;
    const fmt = (v) => v.toFixed(3);
    const rows = [
        ['mean (CL)', fmt(st.mean) + u],
        ['std σ', fmt(st.std) + u],
        ['UCL (μ+3σ)', fmt(st.ucl) + u],
        ['LCL (μ−3σ)', fmt(st.lcl) + u],
        ['UWL (μ+2σ)', fmt(st.uwl) + u],
        ['LWL (μ−2σ)', fmt(st.lwl) + u],
        ['% in-control', st.pctInCtrl.toFixed(2) + ' %'],
        ['trend slope', st.slope.toFixed(4) + u + '/day'],
        ['IQR fences', fmt(st.iqrLo) + ' .. ' + fmt(st.iqrHi) + u]
    ];
    for (const r of rows) {
        fill(90);
        text(r[0], x + 10, yy);
        fill(33);
        textStyle(BOLD);
        text(r[1], x + 130, yy);
        textStyle(NORMAL);
        yy += lh;
    }
    pop();
}

function drawAnomalyPanel(x, y, w, h) {
    panelBg(x, y, w, h, 'Anomalies (' + anomMap[activeSeries].length + ')');
    const list = anomMap[activeSeries];
    const rowH = 14;
    const headerY = y + 24;
    const listTop = headerY + 16;
    const listH = h - (listTop - y) - 8;
    const maxRows = Math.floor(listH / rowH);

    push();
    noStroke();
    fill(120);
    textSize(10);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text('day:hr', x + 10, headerY);
    text('value', x + 70, headerY);
    text('z / slope', x + 130, headerY);
    text('type', x + 200, headerY);
    textStyle(NORMAL);
    pop();

    // bound scroll
    const maxScroll = Math.max(0, list.length - maxRows);
    anomScroll = Math.max(0, Math.min(anomScroll, maxScroll));

    push();
    textSize(10);
    textAlign(LEFT, TOP);
    for (let r = 0; r < maxRows && r + anomScroll < list.length; r++) {
        const i = r + anomScroll;
        const a = list[i];
        const rowY = listTop + r * rowH;
        if (a.idx === selectedIdx || i === highlightedAnomalyIdx) {
            noStroke();
            fill(255, 235, 59, 120);
            rect(x + 4, rowY - 1, w - 8, rowH);
        }
        noStroke();
        fill(33);
        const d = Math.floor(a.idx / HOURS), hr = a.idx % HOURS;
        text('d' + d + ':' + (hr < 10 ? '0' + hr : hr), x + 10, rowY);
        text(a.value.toFixed(2), x + 70, rowY);
        text(a.z.toFixed(2), x + 130, rowY);
        if (a.type === 'Z-score') fill(COL_RED[0], COL_RED[1], COL_RED[2]);
        else if (a.type === 'IQR') fill(120, 60, 180);
        else fill(COL_ORANGE[0], COL_ORANGE[1], COL_ORANGE[2]);
        text(a.type, x + 200, rowY);
    }
    pop();

    // scroll hint
    if (list.length > maxRows) {
        push();
        noStroke();
        fill(120);
        textSize(9);
        textAlign(RIGHT, BOTTOM);
        text('scroll: ' + (anomScroll + 1) + '–' + Math.min(list.length, anomScroll + maxRows) + ' / ' + list.length + '  (mouse wheel)',
             x + w - 8, y + h - 4);
        pop();
    }
}

function drawHistogramPanel(x, y, w, h) {
    panelBg(x, y, w, h, 'Distribution');
    const hist = histMap[activeSeries];
    const st = statsMap[activeSeries];
    const def = SERIES_DEFS[activeSeries];
    const left = x + 30, right = x + w - 10, top = y + 26, bot = y + h - 24;
    const maxB = Math.max(...hist.bins);
    const bw = (right - left) / hist.bins.length;
    const vToPx = (v) => left + (v - hist.lo) / (hist.hi - hist.lo) * (right - left);

    // axes
    push();
    stroke(200);
    line(left, bot, right, bot);
    pop();

    // bars
    push();
    noStroke();
    fill(def.color[0], def.color[1], def.color[2], 170);
    for (let i = 0; i < hist.bins.length; i++) {
        const bh = hist.bins[i] / maxB * (bot - top);
        rect(left + i * bw + 1, bot - bh, bw - 2, bh);
    }
    pop();

    // CL/UCL/LCL/UWL/LWL lines
    push();
    strokeWeight(1.5);
    stroke(COL_GREEN[0], COL_GREEN[1], COL_GREEN[2]);
    line(vToPx(st.mean), top, vToPx(st.mean), bot);
    stroke(COL_RED[0], COL_RED[1], COL_RED[2]);
    drawingContext.setLineDash([5, 4]);
    line(vToPx(st.ucl), top, vToPx(st.ucl), bot);
    line(vToPx(st.lcl), top, vToPx(st.lcl), bot);
    stroke(COL_ORANGE[0], COL_ORANGE[1], COL_ORANGE[2]);
    drawingContext.setLineDash([2, 4]);
    line(vToPx(st.uwl), top, vToPx(st.uwl), bot);
    line(vToPx(st.lwl), top, vToPx(st.lwl), bot);
    drawingContext.setLineDash([]);
    pop();

    // x labels
    push();
    fill(80); noStroke();
    textSize(9);
    textAlign(CENTER, TOP);
    for (let k = 0; k <= 4; k++) {
        const v = hist.lo + (hist.hi - hist.lo) * k / 4;
        text(v.toFixed(1), left + (right - left) * k / 4, bot + 2);
    }
    textAlign(LEFT, TOP);
    text(def.label + def.units, left, bot + 14);
    pop();
}

function panelBg(x, y, w, h, title) {
    push();
    noStroke();
    fill(255);
    rect(x, y, w, h, 4);
    stroke(222, 226, 230);
    noFill();
    rect(x, y, w, h, 4);
    noStroke();
    fill(COL_GREEN[0], COL_GREEN[1], COL_GREEN[2]);
    textStyle(BOLD);
    textSize(12);
    textAlign(LEFT, TOP);
    text(title, x + 10, y + 6);
    textStyle(NORMAL);
    pop();
}

function drawControlsTip() {
    const y = drawHeight + controlHeight - 30;
    push();
    fill(108, 117, 125);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text('Click any chart point to flag the matching anomaly. Click an anomaly row to highlight the point. Use the slider to zoom in time. Scroll over the anomaly list to page through it.',
         12, y, width - 24);
    pop();
}

// -------- Interaction --------
function mousePressed() {
    // Chart click → nearest plot point
    if (mouseX >= chartBox.x && mouseX <= chartBox.x + chartBox.w &&
        mouseY >= chartBox.y && mouseY <= chartBox.y + chartBox.h && plotPoints.length) {
        let best = null, bestD = 1e9;
        for (const p of plotPoints) {
            const dx = p.x - mouseX, dy = p.y - mouseY;
            const d = dx * dx + dy * dy;
            if (d < bestD) { bestD = d; best = p; }
        }
        if (best) {
            selectedIdx = best.i;
            // find matching anomaly within ±6 hours
            const list = anomMap[activeSeries];
            let foundRow = -1;
            for (let i = 0; i < list.length; i++) {
                if (Math.abs(list[i].idx - selectedIdx) <= 6) {
                    foundRow = i;
                    selectedIdx = list[i].idx;
                    break;
                }
            }
            highlightedAnomalyIdx = foundRow;
            // scroll list so the row is visible
            if (foundRow >= 0) {
                const rowH = 14;
                const maxRows = Math.floor((drawHeight - chartBox.y - chartBox.h - 38 - 50) / rowH);
                if (foundRow < anomScroll) anomScroll = foundRow;
                else if (foundRow >= anomScroll + maxRows) anomScroll = Math.max(0, foundRow - maxRows + 1);
            }
        }
        return;
    }

    // Anomaly panel click
    const top = chartBox.y + chartBox.h + 38;
    const h = drawHeight - top - 8;
    const totalW = width - 24;
    const colW = (totalW - 16) / 3;
    const ax = 12 + colW + 8;
    if (mouseX >= ax && mouseX <= ax + colW && mouseY >= top && mouseY <= top + h) {
        const list = anomMap[activeSeries];
        const headerY = top + 24;
        const listTop = headerY + 16;
        const rowH = 14;
        const r = Math.floor((mouseY - listTop) / rowH);
        if (r >= 0) {
            const i = r + anomScroll;
            if (i < list.length) {
                highlightedAnomalyIdx = i;
                selectedIdx = list[i].idx;
                // scroll chart range so the point is visible if needed
                const daysShown = timeSlider.value();
                const startIdx = Math.max(0, N_POINTS - daysShown * HOURS);
                if (selectedIdx < startIdx) {
                    // expand the time range until it fits
                    const need = Math.ceil((N_POINTS - selectedIdx) / HOURS);
                    timeSlider.value(Math.min(N_DAYS, need + 1));
                }
            }
        }
    }
}

function mouseWheel(e) {
    // scroll anomaly list when hovering it
    const top = chartBox.y + chartBox.h + 38;
    const h = drawHeight - top - 8;
    const totalW = width - 24;
    const colW = (totalW - 16) / 3;
    const ax = 12 + colW + 8;
    if (mouseX >= ax && mouseX <= ax + colW && mouseY >= top && mouseY <= top + h) {
        anomScroll += (e.delta > 0 ? 1 : -1);
        return false;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
