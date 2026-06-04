// Solar Power Designer — p5.js
// CANVAS_HEIGHT: 720
let canvasWidth = 970;
let drawHeight = 580;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// Layout columns
let colLeftX, colLeftW;
let colMidX, colMidW;
let colRightX, colRightW;
let barY, barH;

// Energy audit loads
let loads = [
    { name: 'LED Light', watts: 200, hours: 14, inputs: null },
    { name: 'Water Pump', watts: 25, hours: 24, inputs: null },
    { name: 'Air Pump', watts: 5, hours: 24, inputs: null },
    { name: 'Circulation Fan', watts: 30, hours: 16, inputs: null },
    { name: 'Sensor Node', watts: 3, hours: 24, inputs: null }
];

// Control widgets
let locationSelect, batteryCheckbox, autonomySlider, voltageSelect, panelSlider;
let addLoadBtn, exportBtn;
let removeBtns = [];

// Results
let dirty = true;
let results = {};

// Location PSH map
const PSH_MAP = {
    'Miami (5.6 PSH)': 5.6,
    'Los Angeles (5.5 PSH)': 5.5,
    'Denver (5.1 PSH)': 5.1,
    'Minneapolis (4.2 PSH)': 4.2,
    'Seattle (3.2 PSH)': 3.2,
    'Custom (5.0 PSH)': 5.0
};

// Category colors
const CAT_COLORS = {
    'Lighting': [255, 213, 79],
    'Pumping':  [25, 118, 210],
    'Sensing':  [0, 188, 212],
    'Climate':  [255, 152, 0]
};

// For tooltip on stacked bar
let hoverCategory = null;
let exportText = null;
let exportPanel = null;

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, canvasWidth);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    computeColumns();

    // ----- Middle column controls -----
    locationSelect = createSelect();
    for (const key of Object.keys(PSH_MAP)) {
        locationSelect.option(key);
    }
    locationSelect.selected('Miami (5.6 PSH)');
    locationSelect.changed(() => { dirty = true; });

    batteryCheckbox = createCheckbox(' Use LiFePO4 (vs Lead-Acid)', false);
    batteryCheckbox.changed(() => { dirty = true; });
    batteryCheckbox.style('font-size', '12px');
    batteryCheckbox.style('color', '#212529');

    autonomySlider = createSlider(1, 5, 2, 1);
    autonomySlider.input(() => { dirty = true; });

    voltageSelect = createSelect();
    voltageSelect.option('12V');
    voltageSelect.option('24V');
    voltageSelect.option('48V');
    voltageSelect.selected('24V');
    voltageSelect.changed(() => { dirty = true; });

    panelSlider = createSlider(200, 600, 400, 50);
    panelSlider.input(() => { dirty = true; });

    // ----- Left column buttons -----
    addLoadBtn = createButton('+ Add Load');
    addLoadBtn.mousePressed(() => {
        loads.push({ name: 'New Load', watts: 50, hours: 12, inputs: null });
        rebuildLoadInputs();
        dirty = true;
    });
    addLoadBtn.style('background-color', '#2e7d32');
    addLoadBtn.style('color', 'white');
    addLoadBtn.style('border', 'none');
    addLoadBtn.style('padding', '4px 10px');
    addLoadBtn.style('border-radius', '3px');
    addLoadBtn.style('cursor', 'pointer');
    addLoadBtn.style('font-size', '12px');

    // ----- Export button -----
    exportBtn = createButton('Export Report');
    exportBtn.mousePressed(() => { showExportReport(); });
    exportBtn.style('background-color', '#00bcd4');
    exportBtn.style('color', 'white');
    exportBtn.style('border', 'none');
    exportBtn.style('padding', '6px 14px');
    exportBtn.style('border-radius', '3px');
    exportBtn.style('cursor', 'pointer');
    exportBtn.style('font-size', '13px');
    exportBtn.style('font-weight', 'bold');

    rebuildLoadInputs();
    positionAllControls();
    recompute();
}

function computeColumns() {
    const pad = 10;
    const totalW = width - pad * 2;
    colLeftW  = Math.floor(totalW * 0.28);
    colMidW   = Math.floor(totalW * 0.28);
    colRightW = totalW - colLeftW - colMidW - pad * 2;
    colLeftX  = pad;
    colMidX   = colLeftX + colLeftW + pad;
    colRightX = colMidX + colMidW + pad;

    barH = 110;
    barY = drawHeight - barH - 10;
}

function rebuildLoadInputs() {
    // Remove old inputs and buttons
    for (const ld of loads) {
        if (ld.inputs) {
            if (ld.inputs.name) ld.inputs.name.remove();
            if (ld.inputs.watts) ld.inputs.watts.remove();
            if (ld.inputs.hours) ld.inputs.hours.remove();
        }
        ld.inputs = null;
    }
    for (const b of removeBtns) b.remove();
    removeBtns = [];

    for (let i = 0; i < loads.length; i++) {
        const ld = loads[i];
        const nameIn = createInput(ld.name);
        const wIn = createInput(String(ld.watts));
        const hIn = createInput(String(ld.hours));
        nameIn.input(() => { ld.name = nameIn.value(); dirty = true; });
        wIn.input(() => {
            const v = parseFloat(wIn.value());
            ld.watts = isNaN(v) ? 0 : v;
            dirty = true;
        });
        hIn.input(() => {
            const v = parseFloat(hIn.value());
            ld.hours = isNaN(v) ? 0 : v;
            dirty = true;
        });
        styleInput(nameIn);
        styleInput(wIn);
        styleInput(hIn);
        ld.inputs = { name: nameIn, watts: wIn, hours: hIn };

        const idx = i;
        const rmBtn = createButton('×');
        rmBtn.mousePressed(() => {
            loads.splice(idx, 1);
            rebuildLoadInputs();
            dirty = true;
        });
        rmBtn.style('background-color', '#d32f2f');
        rmBtn.style('color', 'white');
        rmBtn.style('border', 'none');
        rmBtn.style('border-radius', '3px');
        rmBtn.style('cursor', 'pointer');
        rmBtn.style('width', '20px');
        rmBtn.style('height', '20px');
        rmBtn.style('padding', '0');
        rmBtn.style('font-size', '12px');
        rmBtn.style('line-height', '18px');
        removeBtns.push(rmBtn);
    }
    positionAllControls();
}

function styleInput(inp) {
    inp.style('font-size', '11px');
    inp.style('padding', '2px 4px');
    inp.style('border', '1px solid #ced4da');
    inp.style('border-radius', '3px');
    inp.style('background', '#ffffff');
}

function positionAllControls() {
    // Canvas absolute position offset
    const canvasEl = document.querySelector('main canvas');
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const ox = window.scrollX + rect.left;
    const oy = window.scrollY + rect.top;

    // ----- Left column: load rows -----
    const tableTop = 60;
    const rowH = 26;
    const nameW = Math.floor(colLeftW * 0.42);
    const wW = Math.floor(colLeftW * 0.18);
    const hW = Math.floor(colLeftW * 0.18);
    const rmW = 22;
    const gap = 4;

    for (let i = 0; i < loads.length; i++) {
        const ld = loads[i];
        const y = tableTop + i * rowH + 18;
        const x0 = colLeftX + 4;
        if (ld.inputs) {
            ld.inputs.name.position(ox + x0, oy + y);
            ld.inputs.name.size(nameW, 18);
            ld.inputs.watts.position(ox + x0 + nameW + gap, oy + y);
            ld.inputs.watts.size(wW, 18);
            ld.inputs.hours.position(ox + x0 + nameW + gap + wW + gap, oy + y);
            ld.inputs.hours.size(hW, 18);
        }
        if (removeBtns[i]) {
            removeBtns[i].position(ox + x0 + nameW + gap + wW + gap + hW + gap, oy + y);
        }
    }

    const addBtnY = tableTop + loads.length * rowH + 22;
    addLoadBtn.position(ox + colLeftX + 4, oy + addBtnY);

    // ----- Middle column controls -----
    const midTop = 60;
    let cy = midTop + 18;
    const midX = colMidX + 4;

    // Location dropdown
    locationSelect.position(ox + midX, oy + cy + 14);
    locationSelect.size(colMidW - 12, 22);
    locationSelect.style('font-size', '12px');
    cy += 50;

    // Battery checkbox
    batteryCheckbox.position(ox + midX, oy + cy);
    cy += 38;

    // Autonomy slider
    autonomySlider.position(ox + midX, oy + cy + 16);
    autonomySlider.size(colMidW - 16, 20);
    cy += 50;

    // System voltage
    voltageSelect.position(ox + midX, oy + cy + 14);
    voltageSelect.size(colMidW - 12, 22);
    voltageSelect.style('font-size', '12px');
    cy += 50;

    // Panel Wp slider
    panelSlider.position(ox + midX, oy + cy + 16);
    panelSlider.size(colMidW - 16, 20);

    // ----- Export button: in the control area below the canvas / draw area -----
    exportBtn.position(ox + 10, oy + drawHeight + 16);
}

function categorize(name) {
    const n = name.toLowerCase();
    if (n.includes('led') || n.includes('light')) return 'Lighting';
    if (n.includes('pump')) return 'Pumping';
    if (n.includes('fan')) return 'Climate';
    if (n.includes('sensor') || n.includes('controller')) return 'Sensing';
    return 'Pumping';
}

function recompute() {
    // 1) Daily energy
    let dailyWh = 0;
    let peakW = 0;
    const catWh = { 'Lighting': 0, 'Pumping': 0, 'Sensing': 0, 'Climate': 0 };
    for (const ld of loads) {
        const wh = (ld.watts || 0) * (ld.hours || 0);
        dailyWh += wh;
        peakW += (ld.watts || 0);
        const c = categorize(ld.name);
        catWh[c] += wh;
    }

    // 2) Location PSH
    const psh = PSH_MAP[locationSelect.value()] || 5.0;

    // 3) PV array size
    const sysEff = 0.78;
    const reqWp = dailyWh / (psh * sysEff);

    // 4) Panel count
    const panelWp = panelSlider.value();
    const panelCount = Math.ceil(reqWp / panelWp);

    // 5) Battery
    const useLi = batteryCheckbox.checked();
    const dod = useLi ? 0.8 : 0.5;
    const sysV = parseInt(voltageSelect.value(), 10);
    const autonomy = autonomySlider.value();
    const reqAh = (dailyWh * autonomy) / (sysV * dod);
    const batteryWh = reqAh * sysV;

    // 6) Costs
    const panelCost = panelCount * panelWp * 0.80;
    const batteryCost = batteryWh * (useLi ? 0.65 : 0.30);
    const inverterCost = peakW > 1000 ? 400 : 200;
    const controllerCost = reqWp > 1000 ? 150 : (reqWp * 0.05);
    const installCost = 400;
    const totalCost = panelCost + batteryCost + inverterCost + controllerCost + installCost;

    // 7) Lifetime + LCOE
    const lifetimeKWh = dailyWh * 365 * 20 / 1000;
    const lcoe = lifetimeKWh > 0 ? totalCost / lifetimeKWh : 0;

    // 8) Payback & ROI
    const monthlySavings = dailyWh * 30 / 1000 * 0.15;
    const payback = monthlySavings > 0 ? totalCost / (monthlySavings * 12) : Infinity;
    const roi5 = totalCost > 0 ? (5 * monthlySavings * 12 - totalCost) / totalCost * 100 : 0;

    results = {
        dailyWh, peakW, psh, reqWp, panelWp, panelCount,
        useLi, dod, sysV, autonomy, reqAh, batteryWh,
        panelCost, batteryCost, inverterCost, controllerCost, installCost, totalCost,
        lifetimeKWh, lcoe, monthlySavings, payback, roi5,
        catWh
    };
    dirty = false;
}

function draw() {
    if (dirty) recompute();
    background(248, 249, 250);

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Solar Power System Designer', 10, 8);
    textStyle(NORMAL);
    fill(108, 117, 125);
    textSize(11);
    text('Size your off-grid PV system: enter loads, pick a site, see panels, batteries, cost & payback.', 10, 28);
    pop();

    drawLeftColumn();
    drawMiddleColumn();
    drawRightColumn();
    drawStackedBar();
    drawControlArea();
    drawExportPanel();
}

function drawColumnHeader(x, y, w, label) {
    push();
    noStroke();
    fill(46, 125, 50);
    rect(x, y, w, 22, 4, 4, 0, 0);
    fill(255);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(label, x + 8, y + 11);
    pop();
}

function drawColumnFrame(x, y, w, h) {
    push();
    noStroke();
    fill(255);
    rect(x, y, w, h, 4);
    stroke(222, 226, 230);
    noFill();
    rect(x, y, w, h, 4);
    pop();
}

function drawLeftColumn() {
    const y = 48;
    const h = barY - y - 10;
    drawColumnFrame(colLeftX, y, colLeftW, h);
    drawColumnHeader(colLeftX, y, colLeftW, 'Energy Audit');

    // Table header
    push();
    fill(73, 80, 87);
    textSize(10);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    const headerY = y + 28;
    const x0 = colLeftX + 6;
    const nameW = Math.floor(colLeftW * 0.42);
    const wW = Math.floor(colLeftW * 0.18);
    const hW = Math.floor(colLeftW * 0.18);
    const gap = 4;
    text('Load', x0, headerY);
    text('Watts', x0 + nameW + gap, headerY);
    text('h/day', x0 + nameW + gap + wW + gap, headerY);
    pop();

    // Total
    push();
    const totalY = y + 60 + loads.length * 26 + 48;
    fill(46, 125, 50);
    noStroke();
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Total: ' + Math.round(results.dailyWh) + ' Wh/day', colLeftX + 6, totalY);
    textStyle(NORMAL);
    fill(108, 117, 125);
    textSize(10);
    text('Peak load: ' + Math.round(results.peakW) + ' W', colLeftX + 6, totalY + 18);
    pop();
}

function drawMiddleColumn() {
    const y = 48;
    const h = barY - y - 10;
    drawColumnFrame(colMidX, y, colMidW, h);
    drawColumnHeader(colMidX, y, colMidW, 'System Parameters');

    push();
    fill(73, 80, 87);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    let cy = y + 30;
    const lx = colMidX + 6;
    text('Location (Peak Sun Hours)', lx, cy); cy += 50;
    text('Battery Type', lx, cy); cy += 38;
    text('Days of autonomy: ' + autonomySlider.value(), lx, cy); cy += 50;
    text('System voltage', lx, cy); cy += 50;
    text('Panel size: ' + panelSlider.value() + ' Wp', lx, cy);
    pop();

    // Helpful hint at the bottom
    push();
    fill(108, 117, 125);
    textSize(10);
    textStyle(ITALIC);
    textAlign(LEFT, TOP);
    text('Higher PSH → fewer panels.', colMidX + 6, y + h - 36);
    text('LiFePO4 lasts longer but costs more upfront.', colMidX + 6, y + h - 22);
    pop();
}

function drawRightColumn() {
    const y = 48;
    const h = barY - y - 10;
    drawColumnFrame(colRightX, y, colRightW, h);
    drawColumnHeader(colRightX, y, colRightW, 'Results');

    const r = results;
    const lx = colRightX + 12;
    let cy = y + 36;

    const lineH = 30;
    push();
    textAlign(LEFT, TOP);
    noStroke();

    // Required PV
    fill(73, 80, 87);
    textSize(11);
    text('Required PV array', lx, cy);
    fill(33);
    textStyle(BOLD);
    textSize(18);
    text(Math.round(r.reqWp) + ' Wp  (' + r.panelCount + ' × ' + r.panelWp + ' Wp)', lx, cy + 12);
    textStyle(NORMAL);
    cy += lineH + 8;

    // Battery
    fill(73, 80, 87);
    textSize(11);
    text('Battery capacity', lx, cy);
    fill(33);
    textStyle(BOLD);
    textSize(18);
    text(Math.round(r.reqAh) + ' Ah @ ' + r.sysV + 'V', lx, cy + 12);
    textStyle(NORMAL);
    textSize(11);
    fill(108, 117, 125);
    text('(' + (r.batteryWh / 1000).toFixed(2) + ' kWh, ' +
         (r.useLi ? 'LiFePO4' : 'Lead-Acid') + ', ' +
         r.autonomy + 'd autonomy)', lx, cy + 32);
    cy += lineH + 18;

    // Total cost
    fill(73, 80, 87);
    textSize(11);
    text('Estimated system cost', lx, cy);
    fill(46, 125, 50);
    textStyle(BOLD);
    textSize(22);
    text('$' + formatMoney(r.totalCost), lx, cy + 12);
    textStyle(NORMAL);
    cy += lineH + 12;

    // LCOE
    fill(73, 80, 87);
    textSize(11);
    text('LCOE  (grid ≈ $0.15)', lx, cy);
    fill(33);
    textStyle(BOLD);
    textSize(16);
    const lcoeColor = r.lcoe <= 0.15 ? [46, 125, 50] : [211, 47, 47];
    fill(lcoeColor[0], lcoeColor[1], lcoeColor[2]);
    text('$' + r.lcoe.toFixed(3) + ' / kWh', lx, cy + 12);
    textStyle(NORMAL);
    cy += lineH;

    // Payback period
    fill(73, 80, 87);
    textSize(11);
    text('Payback period', lx, cy);
    let payColor = [33, 33, 33];
    if (isFinite(r.payback)) {
        if (r.payback < 8) payColor = [46, 125, 50];
        else if (r.payback > 15) payColor = [211, 47, 47];
    } else {
        payColor = [108, 117, 125];
    }
    fill(payColor[0], payColor[1], payColor[2]);
    textStyle(BOLD);
    textSize(16);
    const payTxt = isFinite(r.payback) ? r.payback.toFixed(1) + ' years' : 'n/a';
    text(payTxt, lx, cy + 12);
    textStyle(NORMAL);
    cy += lineH;

    // Monthly savings
    fill(73, 80, 87);
    textSize(11);
    text('Monthly savings vs grid', lx, cy);
    fill(33);
    textStyle(BOLD);
    textSize(14);
    text('$' + r.monthlySavings.toFixed(2), lx, cy + 12);
    textStyle(NORMAL);
    cy += lineH - 4;

    // ROI 5 year
    fill(73, 80, 87);
    textSize(11);
    text('5-year ROI', lx, cy);
    const roiColor = r.roi5 >= 0 ? [46, 125, 50] : [211, 47, 47];
    fill(roiColor[0], roiColor[1], roiColor[2]);
    textStyle(BOLD);
    textSize(14);
    text(r.roi5.toFixed(1) + ' %', lx, cy + 12);
    pop();
}

function drawStackedBar() {
    push();
    // Frame
    noStroke();
    fill(255);
    rect(10, barY, width - 20, barH, 4);
    stroke(222, 226, 230);
    noFill();
    rect(10, barY, width - 20, barH, 4);
    pop();

    push();
    fill(46, 125, 50);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Daily Energy by Category', 18, barY + 8);
    pop();

    const cats = ['Lighting', 'Pumping', 'Sensing', 'Climate'];
    const total = results.dailyWh || 1;

    const barLeft = 18;
    const barRight = width - 18;
    const barWidth = barRight - barLeft;
    const barTop = barY + 30;
    const barHeight = 36;

    // Find hover category
    hoverCategory = null;
    let xCursor = barLeft;
    for (const cat of cats) {
        const wh = results.catWh ? results.catWh[cat] : 0;
        const segW = (wh / total) * barWidth;
        if (segW <= 0) continue;
        if (mouseX >= xCursor && mouseX <= xCursor + segW &&
            mouseY >= barTop && mouseY <= barTop + barHeight) {
            hoverCategory = { cat, wh, pct: (wh / total) * 100, x: xCursor, w: segW };
        }
        const c = CAT_COLORS[cat];
        push();
        noStroke();
        fill(c[0], c[1], c[2]);
        rect(xCursor, barTop, segW, barHeight);
        // label inside if wide enough
        if (segW > 70) {
            fill(33);
            textSize(11);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text(cat, xCursor + segW / 2, barTop + barHeight / 2 - 6);
            textStyle(NORMAL);
            textSize(10);
            text(Math.round(wh) + ' Wh', xCursor + segW / 2, barTop + barHeight / 2 + 8);
        }
        pop();
        xCursor += segW;
    }

    // Border around bar
    push();
    noFill();
    stroke(180);
    rect(barLeft, barTop, barWidth, barHeight);
    pop();

    // Legend
    push();
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);
    let lx = barLeft;
    const ly = barTop + barHeight + 18;
    for (const cat of cats) {
        const c = CAT_COLORS[cat];
        fill(c[0], c[1], c[2]);
        rect(lx, ly - 6, 12, 12);
        fill(73, 80, 87);
        const wh = results.catWh ? results.catWh[cat] : 0;
        const pct = total > 0 ? (wh / total) * 100 : 0;
        const lbl = cat + ': ' + Math.round(wh) + ' Wh (' + pct.toFixed(0) + '%)';
        text(lbl, lx + 16, ly);
        lx += textWidth(lbl) + 36;
    }
    pop();

    // Tooltip
    if (hoverCategory) {
        const txt = hoverCategory.cat + ': ' + Math.round(hoverCategory.wh) +
            ' Wh (' + hoverCategory.pct.toFixed(1) + '%)';
        push();
        textSize(11);
        textStyle(BOLD);
        const tw = textWidth(txt) + 16;
        const th = 22;
        let tx = mouseX + 12;
        let ty = mouseY - th - 6;
        if (tx + tw > width) tx = width - tw - 4;
        if (ty < barY + 4) ty = barY + 4;
        noStroke();
        fill(33, 33, 33, 230);
        rect(tx, ty, tw, th, 3);
        fill(255);
        textAlign(LEFT, CENTER);
        text(txt, tx + 8, ty + th / 2);
        pop();
    }
}

function drawControlArea() {
    push();
    noStroke();
    fill(241, 248, 233);
    rect(0, drawHeight, width, controlHeight);
    stroke(200, 230, 201);
    line(0, drawHeight, width, drawHeight);
    pop();

    push();
    fill(108, 117, 125);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Tip: Edit any load in the left column, change site/battery in the middle, and watch the right column recalculate live.', 150, drawHeight + 22);
    textSize(10);
    fill(120);
    text('Assumes 78% system efficiency, 20-year lifetime, retail crystalline panels at $0.80/Wp, grid benchmark $0.15/kWh.', 150, drawHeight + 42);
    pop();

    // small key takeaways
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Daily: ' + Math.round(results.dailyWh) + ' Wh   |   ' +
         'PSH: ' + results.psh + '   |   ' +
         'Panels: ' + results.panelCount + '   |   ' +
         'Cost: $' + formatMoney(results.totalCost),
         10, drawHeight + controlHeight - 22);
    pop();
}

function showExportReport() {
    const r = results;
    const lines = [];
    lines.push('SOLAR POWER SYSTEM DESIGN REPORT');
    lines.push('=================================');
    lines.push('');
    lines.push('Location: ' + locationSelect.value());
    lines.push('Peak Sun Hours: ' + r.psh + ' h/day');
    lines.push('');
    lines.push('-- ENERGY AUDIT --');
    for (const ld of loads) {
        lines.push('  ' + ld.name + ': ' + ld.watts + ' W × ' + ld.hours +
            ' h = ' + Math.round(ld.watts * ld.hours) + ' Wh');
    }
    lines.push('  TOTAL DAILY: ' + Math.round(r.dailyWh) + ' Wh');
    lines.push('  Peak load: ' + Math.round(r.peakW) + ' W');
    lines.push('');
    lines.push('-- SYSTEM SIZING --');
    lines.push('  Required PV: ' + Math.round(r.reqWp) + ' Wp');
    lines.push('  Panel: ' + r.panelWp + ' Wp × ' + r.panelCount + ' panels');
    lines.push('  Battery: ' + Math.round(r.reqAh) + ' Ah @ ' + r.sysV + 'V (' +
        (r.batteryWh / 1000).toFixed(2) + ' kWh)');
    lines.push('  Battery type: ' + (r.useLi ? 'LiFePO4 (DoD 80%)' : 'Lead-Acid (DoD 50%)'));
    lines.push('  Autonomy: ' + r.autonomy + ' day(s)');
    lines.push('');
    lines.push('-- COST BREAKDOWN --');
    lines.push('  Panels:           $' + formatMoney(r.panelCost));
    lines.push('  Batteries:        $' + formatMoney(r.batteryCost));
    lines.push('  Inverter:         $' + formatMoney(r.inverterCost));
    lines.push('  Charge controller:$' + formatMoney(r.controllerCost));
    lines.push('  Install/wiring:   $' + formatMoney(r.installCost));
    lines.push('  TOTAL:            $' + formatMoney(r.totalCost));
    lines.push('');
    lines.push('-- ECONOMICS --');
    lines.push('  LCOE: $' + r.lcoe.toFixed(3) + ' / kWh');
    lines.push('  Grid benchmark: $0.15 / kWh');
    lines.push('  Monthly savings: $' + r.monthlySavings.toFixed(2));
    lines.push('  Payback period: ' +
        (isFinite(r.payback) ? r.payback.toFixed(1) + ' years' : 'n/a'));
    lines.push('  5-year ROI: ' + r.roi5.toFixed(1) + ' %');
    lines.push('  Lifetime energy: ' + Math.round(r.lifetimeKWh) + ' kWh (20 yr)');

    exportText = lines.join('\n');

    // Build floating panel
    if (exportPanel) {
        exportPanel.remove();
        exportPanel = null;
    }
    const canvasEl = document.querySelector('main canvas');
    if (!canvasEl) {
        alert(exportText);
        return;
    }
    const rect = canvasEl.getBoundingClientRect();
    exportPanel = createDiv('');
    exportPanel.style('position', 'absolute');
    exportPanel.style('left', (window.scrollX + rect.left + 40) + 'px');
    exportPanel.style('top', (window.scrollY + rect.top + 60) + 'px');
    exportPanel.style('width', Math.min(rect.width - 80, 600) + 'px');
    exportPanel.style('max-height', '420px');
    exportPanel.style('overflow', 'auto');
    exportPanel.style('background', '#ffffff');
    exportPanel.style('border', '2px solid #2e7d32');
    exportPanel.style('border-radius', '6px');
    exportPanel.style('padding', '14px');
    exportPanel.style('box-shadow', '0 4px 16px rgba(0,0,0,0.2)');
    exportPanel.style('font-family', 'Menlo, Consolas, monospace');
    exportPanel.style('font-size', '11px');
    exportPanel.style('z-index', '1000');

    const closeBtn = createButton('Close');
    closeBtn.parent(exportPanel);
    closeBtn.style('float', 'right');
    closeBtn.style('background', '#d32f2f');
    closeBtn.style('color', 'white');
    closeBtn.style('border', 'none');
    closeBtn.style('padding', '4px 10px');
    closeBtn.style('border-radius', '3px');
    closeBtn.style('cursor', 'pointer');
    closeBtn.mousePressed(() => {
        if (exportPanel) { exportPanel.remove(); exportPanel = null; }
    });

    const pre = createElement('pre', exportText);
    pre.parent(exportPanel);
    pre.style('white-space', 'pre-wrap');
    pre.style('margin', '24px 0 0 0');
    pre.style('color', '#212529');
}

function drawExportPanel() {
    // The export panel is a separate DOM element; nothing to draw on canvas.
}

function formatMoney(v) {
    if (!isFinite(v)) return '0';
    return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    computeColumns();
    positionAllControls();
}

function mouseMoved() {
    // triggers redraw via p5 loop; nothing else needed.
}
