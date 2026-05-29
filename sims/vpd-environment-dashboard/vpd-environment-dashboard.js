// VPD Environment Dashboard — p5.js
// CANVAS_HEIGHT: 640
let canvasWidth = 900;
let drawHeight = 520;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// Controls
let tempSlider, rhSlider, stageSelect, scenarioSelect, tableCheckbox;

// State
let currentScenario = 'None';

// Colors
const COLOR_GREEN = [46, 125, 50];
const COLOR_TEAL = [0, 188, 212];
const COLOR_ORANGE = [255, 152, 0];
const COLOR_RED = [239, 83, 80];
const COLOR_BLUE = [66, 165, 245];
const COLOR_BG = [248, 249, 250];
const COLOR_PANEL = [255, 255, 255];
const COLOR_BORDER = [222, 226, 230];
const COLOR_TEXT = [33, 37, 41];
const COLOR_MUTED = [108, 117, 125];

// Optimal VPD ranges per growth stage (kPa)
const STAGE_RANGES = {
    'Propagation': { min: 0.4, max: 0.8 },
    'Vegetative':  { min: 0.8, max: 1.2 },
    'Fruiting':    { min: 1.0, max: 1.5 }
};

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 950);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    // Left panel controls — sliders & selects
    tempSlider = createSlider(15, 35, 24, 0.5);
    tempSlider.style('width', '200px');

    rhSlider = createSlider(30, 95, 65, 1);
    rhSlider.style('width', '200px');

    stageSelect = createSelect();
    stageSelect.option('Propagation');
    stageSelect.option('Vegetative');
    stageSelect.option('Fruiting');
    stageSelect.selected('Vegetative');
    stageSelect.style('width', '210px');

    // Control row (below draw area)
    scenarioSelect = createSelect();
    scenarioSelect.option('None');
    scenarioSelect.option('Summer afternoon (hot)');
    scenarioSelect.option('Night cycle');
    scenarioSelect.option('Propagation dome');
    scenarioSelect.option('Winter dry heat');
    scenarioSelect.selected('None');
    scenarioSelect.changed(applyScenario);
    scenarioSelect.style('width', '220px');

    tableCheckbox = createCheckbox('Show VPD Table', false);

    positionControls();
}

function positionControls() {
    // Left panel: sliders inside the left panel area
    const leftX = 20;
    tempSlider.position(leftX, 80);
    rhSlider.position(leftX, 150);
    stageSelect.position(leftX, 220);

    // Bottom control row
    scenarioSelect.position(20, drawHeight + 35);
    tableCheckbox.position(280, drawHeight + 40);
}

function applyScenario() {
    const s = scenarioSelect.value();
    currentScenario = s;
    if (s === 'Summer afternoon (hot)') {
        tempSlider.value(30);
        rhSlider.value(50);
    } else if (s === 'Night cycle') {
        tempSlider.value(20);
        rhSlider.value(75);
    } else if (s === 'Propagation dome') {
        tempSlider.value(24);
        rhSlider.value(85);
    } else if (s === 'Winter dry heat') {
        tempSlider.value(22);
        rhSlider.value(30);
    }
}

// SVP in kPa (Tetens / Magnus formula). T in °C.
function calcSVP(tC) {
    return 0.6108 * Math.exp((17.27 * tC) / (tC + 237.3));
}

function calcVPD(tC, rh) {
    return calcSVP(tC) * (1 - rh / 100);
}

// Map VPD to color zone (independent of stage — overall scale)
function vpdColor(vpd) {
    if (vpd < 0.4)  return COLOR_BLUE;
    if (vpd < 0.8)  return [129, 199, 132];   // light green — propagation range
    if (vpd < 1.2)  return COLOR_GREEN;       // vegetative range
    if (vpd < 1.5)  return [102, 187, 106];   // fruiting upper range
    if (vpd < 1.8)  return COLOR_ORANGE;
    return COLOR_RED;
}

function draw() {
    background(COLOR_BG);

    const t = tempSlider.value();
    const rh = rhSlider.value();
    const stage = stageSelect.value();
    const svp = calcSVP(t);
    const vpd = calcVPD(t, rh);

    // Title
    push();
    fill(...COLOR_GREEN);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('VPD Environment Dashboard', 12, 8);
    pop();

    // Panel widths
    const leftW  = Math.floor(width * 0.40);
    const centerW = Math.floor(width * 0.40);
    const rightW = width - leftW - centerW;
    const topY = 30;
    const panelH = drawHeight - 40;

    drawLeftPanel(0, topY, leftW, panelH, t, rh, stage);
    drawCenterPanel(leftW, topY, centerW, panelH, t, rh, stage, svp, vpd);
    drawRightPanel(leftW + centerW, topY, rightW, panelH, vpd, rh);

    // Control row separator + labels
    drawControlBar();

    // Optional VPD table overlay
    if (tableCheckbox.checked()) {
        drawVPDTable(t, rh);
    }

    // Formula tooltip — when hovering near VPD readout
    drawFormulaTooltipIfHover(leftW, topY, centerW, panelH, t, rh, svp, vpd);
}

function drawPanelBox(x, y, w, h, title) {
    push();
    noStroke();
    fill(...COLOR_PANEL);
    rect(x + 8, y, w - 16, h, 6);
    stroke(...COLOR_BORDER);
    noFill();
    rect(x + 8, y, w - 16, h, 6);
    pop();

    push();
    noStroke();
    fill(...COLOR_GREEN);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(title, x + 18, y + 8);
    pop();
}

function drawLeftPanel(x, y, w, h, t, rh, stage) {
    drawPanelBox(x, y, w, h, 'Inputs');

    push();
    fill(...COLOR_TEXT);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    // Temperature label
    text('Temperature: ' + nf(t, 1, 1) + ' °C', x + 18, y + 35);
    // Humidity label
    text('Relative Humidity: ' + rh + ' %', x + 18, y + 105);
    // Growth stage label
    text('Growth Stage:', x + 18, y + 175);
    pop();

    // Tip block at bottom of left panel
    const tipY = y + h - 110;
    push();
    noStroke();
    fill(232, 245, 233);
    rect(x + 18, tipY, w - 36, 95, 4);
    stroke(...COLOR_GREEN);
    noFill();
    rect(x + 18, tipY, w - 36, 95, 4);
    pop();

    push();
    noStroke();
    fill(...COLOR_GREEN);
    textStyle(BOLD);
    textSize(12);
    textAlign(LEFT, TOP);
    text('Stage VPD targets', x + 26, tipY + 6);
    textStyle(NORMAL);
    fill(...COLOR_TEXT);
    textSize(11);
    const r = STAGE_RANGES[stage];
    text('Propagation: 0.4 – 0.8 kPa', x + 26, tipY + 24);
    text('Vegetative:  0.8 – 1.2 kPa', x + 26, tipY + 40);
    text('Fruiting:    1.0 – 1.5 kPa', x + 26, tipY + 56);
    fill(...COLOR_GREEN);
    textStyle(BOLD);
    text('Current target: ' + nf(r.min, 1, 1) + ' – ' + nf(r.max, 1, 1) + ' kPa', x + 26, tipY + 74);
    pop();
}

function drawCenterPanel(x, y, w, h, t, rh, stage, svp, vpd) {
    drawPanelBox(x, y, w, h, 'Results');

    push();
    fill(...COLOR_TEXT);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);
    text('SVP at ' + nf(t, 1, 1) + ' °C: ' + nf(svp, 1, 2) + ' kPa', x + 18, y + 35);
    pop();

    // Large VPD readout
    push();
    fill(...COLOR_GREEN);
    noStroke();
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(14);
    text('VPD', x + 18, y + 65);
    textSize(32);
    fill(...vpdColor(vpd));
    text(nf(vpd, 1, 2) + ' kPa', x + 18, y + 82);
    pop();

    // Gauge
    const gx = x + 18;
    const gy = y + 145;
    const gw = w - 36;
    const gh = 28;
    drawGauge(gx, gy, gw, gh, vpd, stage);

    // Interpretation
    const r = STAGE_RANGES[stage];
    let interp = '';
    let interpColor = COLOR_GREEN;
    if (vpd < r.min) {
        if (vpd < 0.6) {
            interp = 'Too low — calcium delivery limited';
            interpColor = COLOR_BLUE;
        } else {
            interp = 'Below optimal for ' + stage + ' — slow transpiration';
            interpColor = COLOR_BLUE;
        }
    } else if (vpd > r.max) {
        if (vpd > 1.8) {
            interp = 'Too high — stomata likely closed';
            interpColor = COLOR_RED;
        } else {
            interp = 'Above optimal for ' + stage + ' — plants may stress';
            interpColor = COLOR_ORANGE;
        }
    } else {
        interp = 'Optimal for ' + stage;
        interpColor = COLOR_GREEN;
    }

    push();
    fill(...interpColor);
    noStroke();
    textStyle(BOLD);
    textSize(13);
    textAlign(LEFT, TOP);
    text(interp, x + 18, gy + gh + 15);
    pop();

    // Scenario label
    if (currentScenario && currentScenario !== 'None') {
        push();
        fill(...COLOR_MUTED);
        noStroke();
        textStyle(NORMAL);
        textSize(11);
        textAlign(LEFT, TOP);
        text('Scenario: ' + currentScenario, x + 18, gy + gh + 38);
        pop();
    }
}

function drawGauge(gx, gy, gw, gh, vpd, stage) {
    const vMin = 0;
    const vMax = 2.0;
    const r = STAGE_RANGES[stage];

    // Background zones (full gauge sectioned by VPD value)
    const zones = [
        { from: 0.0, to: 0.4,  c: COLOR_BLUE },
        { from: 0.4, to: 0.8,  c: [129, 199, 132] },
        { from: 0.8, to: 1.2,  c: COLOR_GREEN },
        { from: 1.2, to: 1.5,  c: [102, 187, 106] },
        { from: 1.5, to: 1.8,  c: COLOR_ORANGE },
        { from: 1.8, to: 2.0,  c: COLOR_RED }
    ];

    push();
    noStroke();
    for (const z of zones) {
        const x1 = gx + (z.from / vMax) * gw;
        const x2 = gx + (z.to / vMax) * gw;
        fill(z.c[0], z.c[1], z.c[2], 180);
        rect(x1, gy, x2 - x1, gh);
    }
    stroke(...COLOR_BORDER);
    noFill();
    rect(gx, gy, gw, gh);
    pop();

    // Stage optimal range bracket (highlighted)
    const ox1 = gx + (r.min / vMax) * gw;
    const ox2 = gx + (r.max / vMax) * gw;
    push();
    stroke(...COLOR_GREEN);
    strokeWeight(3);
    noFill();
    rect(ox1, gy - 3, ox2 - ox1, gh + 6);
    pop();

    // Scale ticks
    push();
    fill(...COLOR_MUTED);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    for (let v = 0; v <= 2.0; v += 0.5) {
        const tx = gx + (v / vMax) * gw;
        stroke(...COLOR_MUTED);
        line(tx, gy + gh, tx, gy + gh + 4);
        noStroke();
        text(nf(v, 1, 1), tx, gy + gh + 6);
    }
    pop();

    // Marker
    const mx = constrain(gx + (vpd / vMax) * gw, gx, gx + gw);
    push();
    stroke(...COLOR_TEXT);
    strokeWeight(2);
    fill(255);
    triangle(mx, gy - 8, mx - 6, gy - 18, mx + 6, gy - 18);
    line(mx, gy - 4, mx, gy + gh + 4);
    pop();
}

function drawRightPanel(x, y, w, h, vpd, rh) {
    drawPanelBox(x, y, w, h, 'Consequences');

    const rows = [
        getTranspirationRow(vpd),
        getCalciumRow(vpd),
        getDiseaseRow(rh),
        getCO2Row(vpd)
    ];

    const rowH = 78;
    const startY = y + 35;

    for (let i = 0; i < rows.length; i++) {
        const ry = startY + i * rowH;
        const row = rows[i];

        // Colored dot
        push();
        noStroke();
        fill(row.color[0], row.color[1], row.color[2]);
        ellipse(x + 22, ry + 8, 11, 11);
        pop();

        // Label
        push();
        fill(...COLOR_TEXT);
        noStroke();
        textStyle(BOLD);
        textSize(11);
        textAlign(LEFT, TOP);
        text(row.label, x + 34, ry + 2);

        textStyle(NORMAL);
        fill(row.color[0], row.color[1], row.color[2]);
        textSize(12);
        text(row.value, x + 34, ry + 18);

        fill(...COLOR_MUTED);
        textSize(10);
        text(row.note, x + 18, ry + 38, w - 30);
        pop();
    }
}

function getTranspirationRow(vpd) {
    let value, color, note;
    if (vpd < 0.6) {
        value = 'Low';
        color = COLOR_BLUE;
        note = 'Low driving force — slow nutrient uptake.';
    } else if (vpd <= 1.5) {
        value = 'Moderate';
        color = COLOR_GREEN;
        note = 'Healthy transpiration pull.';
    } else {
        value = 'High';
        color = COLOR_ORANGE;
        note = 'Plants lose water faster than roots can absorb.';
    }
    return { label: 'Transpiration rate', value: value, color: color, note: note };
}

function getCalciumRow(vpd) {
    if (vpd < 0.6) {
        return { label: 'Calcium delivery', value: 'Warning',
                 color: COLOR_ORANGE,
                 note: 'Low transpiration limits Ca²⁺ transport — risk of tip burn.' };
    }
    return { label: 'Calcium delivery', value: 'OK',
             color: COLOR_GREEN,
             note: 'Transpiration sufficient to move calcium to new tissue.' };
}

function getDiseaseRow(rh) {
    if (rh > 85) {
        return { label: 'Disease risk', value: 'Elevated',
                 color: COLOR_RED,
                 note: 'High RH favors Botrytis & powdery mildew.' };
    }
    return { label: 'Disease risk', value: 'Low',
             color: COLOR_GREEN,
             note: 'Humidity below mold threshold.' };
}

function getCO2Row(vpd) {
    if (vpd > 1.6) {
        return { label: 'CO₂ efficiency', value: 'Reduced',
                 color: COLOR_ORANGE,
                 note: 'Stomata closing — CO₂ enrichment less effective.' };
    }
    return { label: 'CO₂ efficiency', value: 'Full',
             color: COLOR_GREEN,
             note: 'Stomata open — CO₂ enrichment pays off.' };
}

function drawControlBar() {
    push();
    noStroke();
    fill(245, 247, 250);
    rect(0, drawHeight, width, controlHeight);
    stroke(...COLOR_BORDER);
    line(0, drawHeight, width, drawHeight);
    pop();

    push();
    fill(...COLOR_TEXT);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Common Scenarios:', 20, drawHeight + 18);
    pop();

    push();
    fill(...COLOR_MUTED);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Hover over the VPD value to see the formula with current numbers substituted.',
         20, drawHeight + 78, width - 40);
    pop();
}

function drawVPDTable(curT, curRh) {
    // Overlay heatmap centered on canvas
    const cols = 6;
    const rows = 6;
    const tValues = [15, 19, 23, 27, 31, 35];
    const rhValues = [40, 50, 60, 70, 80, 90];

    const tableW = Math.min(width - 80, 520);
    const tableH = Math.min(drawHeight - 80, 360);
    const tx = (width - tableW) / 2;
    const ty = 50;

    // Semi-transparent backdrop
    push();
    noStroke();
    fill(0, 0, 0, 80);
    rect(0, 30, width, drawHeight - 30);
    pop();

    // Panel
    push();
    noStroke();
    fill(255);
    rect(tx, ty, tableW, tableH, 6);
    stroke(...COLOR_BORDER);
    noFill();
    rect(tx, ty, tableW, tableH, 6);
    pop();

    // Title
    push();
    fill(...COLOR_GREEN);
    noStroke();
    textStyle(BOLD);
    textSize(13);
    textAlign(LEFT, TOP);
    text('VPD Heatmap (kPa) — Temperature × Humidity', tx + 12, ty + 8);
    pop();

    const headerH = 36;
    const labelW = 56;
    const cellW = (tableW - labelW - 14) / cols;
    const cellH = (tableH - headerH - 14) / rows;
    const gridX = tx + labelW + 6;
    const gridY = ty + headerH;

    // Column headers (Temperature)
    push();
    fill(...COLOR_TEXT);
    noStroke();
    textStyle(BOLD);
    textSize(11);
    textAlign(CENTER, BOTTOM);
    for (let c = 0; c < cols; c++) {
        text(tValues[c] + '°C', gridX + c * cellW + cellW / 2, gridY - 4);
    }
    textAlign(LEFT, BOTTOM);
    text('T →', tx + 12, gridY - 4);
    pop();

    // Row labels (RH)
    push();
    fill(...COLOR_TEXT);
    noStroke();
    textStyle(BOLD);
    textSize(11);
    textAlign(RIGHT, CENTER);
    for (let r = 0; r < rows; r++) {
        text(rhValues[r] + '%', gridX - 4, gridY + r * cellH + cellH / 2);
    }
    textAlign(LEFT, TOP);
    text('RH', tx + 12, gridY + 6);
    pop();

    // Find current cell (nearest)
    let curCol = -1, curRow = -1;
    let bestT = 9999, bestR = 9999;
    for (let c = 0; c < cols; c++) {
        if (Math.abs(tValues[c] - curT) < bestT) { bestT = Math.abs(tValues[c] - curT); curCol = c; }
    }
    for (let r = 0; r < rows; r++) {
        if (Math.abs(rhValues[r] - curRh) < bestR) { bestR = Math.abs(rhValues[r] - curRh); curRow = r; }
    }

    // Draw cells
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const v = calcVPD(tValues[c], rhValues[r]);
            const col = vpdColor(v);
            const cx = gridX + c * cellW;
            const cy = gridY + r * cellH;
            push();
            noStroke();
            fill(col[0], col[1], col[2], 220);
            rect(cx + 1, cy + 1, cellW - 2, cellH - 2, 2);
            // Value label
            fill(33);
            textAlign(CENTER, CENTER);
            textSize(11);
            textStyle(BOLD);
            text(nf(v, 1, 2), cx + cellW / 2, cy + cellH / 2);
            pop();
        }
    }

    // Highlight current cell
    if (curCol >= 0 && curRow >= 0) {
        push();
        stroke(0);
        strokeWeight(3);
        noFill();
        rect(gridX + curCol * cellW + 1, gridY + curRow * cellH + 1, cellW - 2, cellH - 2, 2);
        pop();
    }

    // Footer
    push();
    fill(...COLOR_MUTED);
    noStroke();
    textSize(10);
    textAlign(LEFT, BOTTOM);
    text('Black border = current (T, RH). Uncheck "Show VPD Table" to hide.',
         tx + 12, ty + tableH - 4);
    pop();
}

function drawFormulaTooltipIfHover(cx, cy, cw, ch, t, rh, svp, vpd) {
    // VPD readout zone (matches drawCenterPanel positions)
    const zx = cx + 18;
    const zy = cy + 82;
    const zw = 220;
    const zh = 40;
    if (mouseX >= zx && mouseX <= zx + zw && mouseY >= zy && mouseY <= zy + zh) {
        const txt1 = 'VPD = SVP × (1 − RH/100)';
        const txt2 = '    = ' + nf(svp, 1, 2) + ' × (1 − ' + nf(rh / 100, 1, 2) + ')';
        const txt3 = '    = ' + nf(vpd, 1, 2) + ' kPa';
        const tipW = 260;
        const tipH = 70;
        let tipX = mouseX + 12;
        let tipY = mouseY + 12;
        if (tipX + tipW > width) tipX = mouseX - tipW - 12;
        if (tipY + tipH > drawHeight) tipY = mouseY - tipH - 12;

        push();
        noStroke();
        fill(33, 37, 41, 235);
        rect(tipX, tipY, tipW, tipH, 4);
        fill(255);
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        textSize(11);
        text(txt1, tipX + 8, tipY + 6);
        textStyle(NORMAL);
        text(txt2, tipX + 8, tipY + 24);
        text(txt3, tipX + 8, tipY + 42);
        pop();
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    positionControls();
}
