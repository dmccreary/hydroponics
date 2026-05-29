// PPFD / DLI Calculator — p5.js
// CANVAS_HEIGHT: 700
let canvasWidth = 960;
let drawHeight = 580;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

// Layout
let stackVertical = false;
let leftX, leftY, leftW, rightX, rightY, rightW;

// Section 1 - DLI
let ppfdSlider, photoperiodSlider;
// Section 2 - Energy
let wattageInput, kwhInput;
// Section 3 - Inverse Square Law
let refPpfdInput, refHeightSlider, newHeightSlider;
// Compare
let compareBtn, resetCompareBtn;
let compareMode = false;
let scenarioA = null;

// Colors
const GREEN = [46, 125, 50];
const TEAL = [0, 188, 212];
const RED = [239, 83, 80];
const ORANGE = [255, 152, 0];
const DARK = [33, 37, 41];
const MUTED = [108, 117, 125];
const LIGHT_BG = [255, 255, 255];
const BORDER = [222, 226, 230];

// Crops
const CROPS = [
    { name: "Lettuce",        min: 12, max: 17 },
    { name: "Basil",          min: 14, max: 20 },
    { name: "Tomato (veg)",   min: 18, max: 25 },
    { name: "Tomato (fruit)", min: 24, max: 35 },
    { name: "Cucumber",       min: 18, max: 30 },
    { name: "Strawberry",     min: 17, max: 25 },
    { name: "Seedlings",      min:  6, max: 12 }
];

// Hover regions for tooltip support
let hoverRegions = [];
let cropRowBounds = [];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 980);
    stackVertical = containerWidth < 600;
    if (stackVertical) {
        drawHeight = 1000;
    } else {
        drawHeight = 580;
    }
    canvasHeight = drawHeight + controlHeight;
    containerHeight = canvasHeight;
}

function computeLayout() {
    if (stackVertical) {
        leftX = 10;
        leftY = 40;
        leftW = containerWidth - 20;
        rightX = 10;
        rightY = leftY + 540;
        rightW = containerWidth - 20;
    } else {
        leftX = 10;
        leftY = 40;
        leftW = Math.floor(containerWidth * 0.5) - 15;
        rightX = leftX + leftW + 10;
        rightY = 40;
        rightW = containerWidth - rightX - 10;
    }
}

function setup() {
    updateCanvasSize();
    computeLayout();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    // Section 1 controls
    ppfdSlider = createSlider(50, 1500, 400, 10);
    ppfdSlider.style('width', '200px');
    photoperiodSlider = createSlider(8, 24, 16, 1);
    photoperiodSlider.style('width', '200px');

    // Section 2 controls
    wattageInput = createInput('200', 'number');
    wattageInput.style('width', '70px');
    kwhInput = createInput('0.12', 'number');
    kwhInput.style('width', '70px');
    kwhInput.attribute('step', '0.01');

    // Section 3 controls
    refPpfdInput = createInput('800', 'number');
    refPpfdInput.style('width', '70px');
    refHeightSlider = createSlider(10, 200, 30, 1);
    refHeightSlider.style('width', '180px');
    newHeightSlider = createSlider(10, 200, 60, 1);
    newHeightSlider.style('width', '180px');

    // Compare button
    compareBtn = createButton('Capture as Scenario A');
    compareBtn.mousePressed(handleCompareClick);

    resetCompareBtn = createButton('Reset Compare');
    resetCompareBtn.mousePressed(() => {
        compareMode = false;
        scenarioA = null;
    });

    positionControls();
}

function positionControls() {
    // Section 1 - top of left column
    const s1y = leftY + 40;
    ppfdSlider.position(leftX + 12, s1y + 18);
    photoperiodSlider.position(leftX + 12, s1y + 56);

    // Section 2
    const s2y = stackVertical ? (leftY + 200) : (leftY + 200);
    wattageInput.position(leftX + 120, s2y + 28);
    kwhInput.position(leftX + 120, s2y + 56);

    // Section 3
    const s3y = stackVertical ? (leftY + 340) : (leftY + 340);
    refPpfdInput.position(leftX + 160, s3y + 28);
    refHeightSlider.position(leftX + 160, s3y + 60);
    newHeightSlider.position(leftX + 160, s3y + 92);

    // Compare buttons - in control area
    compareBtn.position(leftX + 12, drawHeight + 12);
    resetCompareBtn.position(leftX + 200, drawHeight + 12);
}

function draw() {
    background(248, 249, 250);
    hoverRegions = [];
    cropRowBounds = [];

    // Title
    push();
    fill(GREEN);
    noStroke();
    textStyle(BOLD);
    textSize(15);
    textAlign(LEFT, TOP);
    text('PPFD / DLI Calculator', 12, 10);
    textStyle(NORMAL);
    textSize(11);
    fill(MUTED);
    text('Calculate Daily Light Integral, energy cost, and mounting height effects.', 200, 14);
    pop();

    // Compute DLI
    const ppfd = ppfdSlider.value();
    const photoperiod = photoperiodSlider.value();
    const dli = ppfd * photoperiod * 0.0036;

    // Energy
    const wattage = parseFloat(wattageInput.value()) || 0;
    const kwh = parseFloat(kwhInput.value()) || 0;
    const dailyKwh = wattage * photoperiod / 1000;
    const dailyCost = dailyKwh * kwh;
    const monthlyCost = dailyCost * 30;
    const annualCost = dailyCost * 365;

    // Inverse square
    const refPpfd = parseFloat(refPpfdInput.value()) || 0;
    const refHeight = refHeightSlider.value();
    const newHeight = newHeightSlider.value();
    const distRatio = refHeight / newHeight;
    const intensityRatio = distRatio * distRatio;
    const newPpfd = refPpfd * intensityRatio;

    drawSection1(ppfd, photoperiod, dli);
    drawSection2(wattage, kwh, dailyCost, monthlyCost, annualCost, photoperiod);
    drawSection3(refPpfd, refHeight, newHeight, distRatio, intensityRatio, newPpfd);
    drawCropChart(dli);

    drawControlArea(ppfd, photoperiod, dli, wattage, kwh, dailyCost);

    // Tooltip last
    drawTooltip();
}

function drawSectionCard(x, y, w, h, title) {
    push();
    noStroke();
    fill(LIGHT_BG);
    rect(x, y, w, h, 6);
    stroke(BORDER);
    noFill();
    rect(x, y, w, h, 6);
    pop();

    push();
    noStroke();
    fill(GREEN);
    textStyle(BOLD);
    textSize(13);
    textAlign(LEFT, TOP);
    text(title, x + 10, y + 8);
    pop();
}

function drawSection1(ppfd, photoperiod, dli) {
    const x = leftX, y = leftY, w = leftW, h = 150;
    drawSectionCard(x, y, w, h, 'Section 1 — DLI Calculator');

    // Slider labels
    push();
    noStroke();
    fill(DARK);
    textSize(11);
    textAlign(LEFT, TOP);
    text(`PPFD: ${ppfd} µmol·m⁻²·s⁻¹`, x + 220, y + 30);
    text(`Photoperiod: ${photoperiod} hours`, x + 220, y + 68);
    pop();

    // DLI big value
    push();
    fill(GREEN);
    noStroke();
    textStyle(BOLD);
    textSize(17);
    textAlign(LEFT, TOP);
    const dliText = `DLI = ${dli.toFixed(1)} mol·m⁻²·day⁻¹`;
    text(dliText, x + 12, y + 95);
    // Hover region for DLI tooltip
    const tw = textWidth(dliText);
    hoverRegions.push({
        x: x + 12, y: y + 95, w: tw, h: 18,
        formula: 'DLI = PPFD × hours × 0.0036',
        detail: `${ppfd} × ${photoperiod} × 0.0036 = ${dli.toFixed(1)} mol·m⁻²·day⁻¹`
    });
    pop();

    // Horizontal bar 0-50
    const barX = x + 12;
    const barY = y + 122;
    const barW = w - 24;
    const barH = 16;

    // Zones
    const scale = barW / 50;
    push();
    noStroke();
    fill(239, 83, 80, 170);   // red 0-10
    rect(barX, barY, 10 * scale, barH);
    fill(46, 125, 50, 170);   // green 10-25
    rect(barX + 10 * scale, barY, 15 * scale, barH);
    fill(255, 152, 0, 170);   // orange 25-50
    rect(barX + 25 * scale, barY, 25 * scale, barH);
    stroke(BORDER);
    noFill();
    rect(barX, barY, barW, barH);
    pop();

    // Indicator
    const dliClamped = Math.min(dli, 50);
    const indX = barX + dliClamped * scale;
    push();
    stroke(DARK);
    strokeWeight(2);
    line(indX, barY - 3, indX, barY + barH + 3);
    fill(DARK);
    noStroke();
    triangle(indX - 4, barY - 7, indX + 4, barY - 7, indX, barY - 2);
    pop();

    // Scale labels
    push();
    noStroke();
    fill(MUTED);
    textSize(9);
    textAlign(LEFT, TOP);
    text('0', barX, barY + barH + 2);
    textAlign(CENTER, TOP);
    text('10', barX + 10 * scale, barY + barH + 2);
    text('25', barX + 25 * scale, barY + barH + 2);
    textAlign(RIGHT, TOP);
    text('50 mol', barX + barW, barY + barH + 2);
    pop();
}

function drawSection2(wattage, kwh, daily, monthly, annual, photoperiod) {
    const x = leftX, y = leftY + 160, w = leftW, h = 110;
    drawSectionCard(x, y, w, h, 'Section 2 — Energy Cost');

    push();
    noStroke();
    fill(DARK);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Wattage (W):', x + 12, y + 32);
    text('Cost ($/kWh):', x + 12, y + 60);
    pop();

    // Outputs
    const outX = x + 240;
    push();
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    fill(DARK);
    const dailyText = `Daily: $${daily.toFixed(2)}`;
    text(dailyText, outX, y + 30);
    let tw = textWidth(dailyText);
    hoverRegions.push({
        x: outX, y: y + 30, w: tw, h: 16,
        formula: 'Daily = W × hours / 1000 × $/kWh',
        detail: `${wattage} × ${photoperiod} / 1000 × ${kwh.toFixed(3)} = $${daily.toFixed(2)}`
    });

    const monthlyText = `Monthly: $${monthly.toFixed(2)}`;
    text(monthlyText, outX, y + 50);
    tw = textWidth(monthlyText);
    hoverRegions.push({
        x: outX, y: y + 50, w: tw, h: 16,
        formula: 'Monthly = Daily × 30',
        detail: `$${daily.toFixed(2)} × 30 = $${monthly.toFixed(2)}`
    });

    const annualText = `Annual: $${annual.toFixed(2)}`;
    text(annualText, outX, y + 70);
    tw = textWidth(annualText);
    hoverRegions.push({
        x: outX, y: y + 70, w: tw, h: 16,
        formula: 'Annual = Daily × 365',
        detail: `$${daily.toFixed(2)} × 365 = $${annual.toFixed(2)}`
    });
    pop();
}

function drawSection3(refPpfd, refH, newH, distRatio, intRatio, newPpfd) {
    const x = leftX, y = leftY + 280, w = leftW, h = 220;
    drawSectionCard(x, y, w, h, 'Section 3 — Inverse Square Law');

    push();
    noStroke();
    fill(DARK);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Reference PPFD:', x + 12, y + 32);
    text(`Reference height: ${refH} cm`, x + 12, y + 64);
    text(`New height: ${newH} cm`, x + 12, y + 96);
    pop();

    // Outputs
    push();
    noStroke();
    textStyle(BOLD);
    textSize(14);
    fill(GREEN);
    textAlign(LEFT, TOP);
    const newText = `PPFD at new height: ${newPpfd.toFixed(0)} µmol·m⁻²·s⁻¹`;
    text(newText, x + 12, y + 130);
    const tw = textWidth(newText);
    hoverRegions.push({
        x: x + 12, y: y + 130, w: tw, h: 18,
        formula: 'PPFD_new = PPFD_ref × (h_ref / h_new)²',
        detail: `${refPpfd} × (${refH}/${newH})² = ${refPpfd} × ${intRatio.toFixed(3)} = ${newPpfd.toFixed(0)}`
    });

    textStyle(NORMAL);
    textSize(11);
    fill(MUTED);
    text(`(Distance ratio: ${distRatio.toFixed(2)}, Intensity ratio: ${intRatio.toFixed(2)}×)`,
        x + 12, y + 154);
    pop();

    // Warning
    if (newPpfd > 1200) {
        push();
        noStroke();
        fill(RED);
        textStyle(BOLD);
        textSize(12);
        textAlign(LEFT, TOP);
        text('⚠ Light stress risk — PPFD exceeds 1200 µmol·m⁻²·s⁻¹', x + 12, y + 178);
        pop();
    }

    // Mini visual: two lamps at heights
    drawLampVisual(x + w - 150, y + 30, 130, 170, refH, newH);
}

function drawLampVisual(x, y, w, h, refH, newH) {
    push();
    // Frame
    noStroke();
    fill(248, 249, 250);
    rect(x, y, w, h, 4);
    stroke(BORDER);
    noFill();
    rect(x, y, w, h, 4);

    // Canopy line at bottom
    stroke(GREEN);
    strokeWeight(2);
    line(x + 6, y + h - 14, x + w - 6, y + h - 14);
    noStroke();
    fill(GREEN);
    textSize(9);
    textAlign(CENTER, TOP);
    text('canopy', x + w / 2, y + h - 12);

    // Map height (10-200) to vertical position
    const maxH = 200;
    const yRef = map(refH, 10, maxH, y + h - 18, y + 14);
    const yNew = map(newH, 10, maxH, y + h - 18, y + 14);

    // Reference lamp
    noStroke();
    fill(TEAL);
    rect(x + 18, yRef - 6, 30, 8, 2);
    fill(DARK);
    textSize(9);
    textAlign(LEFT, CENTER);
    text(`ref ${refH}cm`, x + 52, yRef - 2);

    // New lamp
    fill(ORANGE);
    rect(x + 18, yNew - 6, 30, 8, 2);
    fill(DARK);
    text(`new ${newH}cm`, x + 52, yNew - 2);
    pop();
}

function drawCropChart(currentDli) {
    const x = rightX, y = rightY, w = rightW;
    const h = stackVertical ? 460 : 540;
    drawSectionCard(x, y, w, h, 'Crop Target DLI Reference (mol·m⁻²·day⁻¹)');

    const chartLeft = x + 100;
    const chartRight = x + w - 80;
    const chartW = chartRight - chartLeft;
    const maxDli = 40;
    const scale = chartW / maxDli;

    // X-axis labels
    push();
    noStroke();
    fill(MUTED);
    textSize(9);
    textAlign(CENTER, TOP);
    for (let v = 0; v <= 40; v += 10) {
        const tx = chartLeft + v * scale;
        text(v, tx, y + 30);
        stroke(BORDER);
        line(tx, y + 42, tx, y + h - 20);
        noStroke();
    }
    pop();

    const rowH = (h - 60) / CROPS.length;
    const rowStartY = y + 46;

    for (let i = 0; i < CROPS.length; i++) {
        const crop = CROPS[i];
        const rowY = rowStartY + i * rowH;
        const cy = rowY + rowH / 2;

        const bx = chartLeft + crop.min * scale;
        const bw = (crop.max - crop.min) * scale;
        const bh = Math.min(18, rowH - 8);
        const by = cy - bh / 2;

        const inRange = currentDli >= crop.min && currentDli <= crop.max;

        // Bar
        push();
        noStroke();
        fill(GREEN[0], GREEN[1], GREEN[2], inRange ? 230 : 170);
        rect(bx, by, bw, bh, 3);
        if (inRange) {
            stroke(GREEN);
            strokeWeight(2);
            noFill();
            rect(bx - 1, by - 1, bw + 2, bh + 2, 3);
        }
        pop();

        // Crop name
        push();
        noStroke();
        fill(DARK);
        textSize(11);
        textAlign(LEFT, CENTER);
        text(crop.name, x + 10, cy);
        pop();

        // Range label
        push();
        noStroke();
        fill(MUTED);
        textSize(10);
        textAlign(LEFT, CENTER);
        text(`${crop.min}–${crop.max}`, chartRight + 4, cy);
        pop();

        // In-range check
        if (inRange) {
            push();
            noStroke();
            fill(GREEN);
            textSize(12);
            textAlign(LEFT, CENTER);
            textStyle(BOLD);
            text('✓', x + 84, cy);
            pop();
        }

        cropRowBounds.push({
            crop,
            x: x + 6, y: rowY, w: w - 12, h: rowH
        });
    }

    // Current DLI vertical indicator across all bars
    const dliClamped = Math.min(Math.max(currentDli, 0), maxDli);
    const lineX = chartLeft + dliClamped * scale;
    push();
    stroke(ORANGE);
    strokeWeight(2);
    line(lineX, rowStartY, lineX, y + h - 16);
    fill(ORANGE);
    noStroke();
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, BOTTOM);
    text(`current ${currentDli.toFixed(1)}`, lineX, rowStartY - 2);
    pop();

    // Hint
    push();
    noStroke();
    fill(MUTED);
    textSize(10);
    textAlign(LEFT, BOTTOM);
    text('Click a crop row to set PPFD for the midpoint DLI of that crop.',
        x + 10, y + h - 4);
    pop();
}

function drawControlArea(ppfd, photoperiod, dli, wattage, kwh, dailyCost) {
    const y0 = drawHeight;
    push();
    noStroke();
    fill(LIGHT_BG);
    rect(0, y0, containerWidth, controlHeight);
    stroke(BORDER);
    line(0, y0, containerWidth, y0);
    pop();

    // Tip / status text
    push();
    noStroke();
    fill(MUTED);
    textSize(11);
    textAlign(LEFT, TOP);
    if (!compareMode) {
        text('Hover over any output value to see its formula. Click "Capture as Scenario A" to compare two settings.',
            leftX, y0 + 50);
    } else if (scenarioA && !compareMode.B) {
        text('Scenario A captured. Adjust controls to define Scenario B — comparison updates live.',
            leftX, y0 + 50);
    }
    pop();

    // Compare panel
    if (compareMode && scenarioA) {
        drawComparePanel(y0, ppfd, photoperiod, dli, wattage, kwh, dailyCost);
    }
}

function drawComparePanel(y0, ppfd, photoperiod, dli, wattage, kwh, dailyCost) {
    const px = Math.max(leftX + 360, 360);
    const py = y0 + 8;
    const pw = containerWidth - px - 10;
    const ph = controlHeight - 16;

    push();
    noStroke();
    fill(248, 249, 250);
    rect(px, py, pw, ph, 4);
    stroke(BORDER);
    noFill();
    rect(px, py, pw, ph, 4);
    pop();

    const aDli = scenarioA.dli;
    const aCost = scenarioA.dailyCost;
    const bDli = dli;
    const bCost = dailyCost;

    const colW = pw / 2;
    drawScenarioCol(px, py, colW, ph, 'Scenario A',
        scenarioA.ppfd, scenarioA.photoperiod, aDli,
        scenarioA.wattage, scenarioA.kwh, aCost,
        aDli >= bDli, aCost <= bCost);
    drawScenarioCol(px + colW, py, colW, ph, 'Scenario B',
        ppfd, photoperiod, bDli, wattage, kwh, bCost,
        bDli >= aDli, bCost <= aCost);
}

function drawScenarioCol(x, y, w, h, label, ppfd, photo, dli, wattage, kwh, cost, dliWin, costWin) {
    push();
    noStroke();
    fill(DARK);
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, TOP);
    text(label, x + 8, y + 6);

    textStyle(NORMAL);
    textSize(10);
    fill(MUTED);
    text(`PPFD ${ppfd}, ${photo}h, ${wattage}W @ $${kwh.toFixed(2)}`, x + 8, y + 22);

    // DLI line
    fill(dliWin ? GREEN : DARK);
    textStyle(BOLD);
    textSize(11);
    text(`DLI: ${dli.toFixed(1)} mol·m⁻²·day⁻¹${dliWin ? '  ★' : ''}`, x + 8, y + 40);

    fill(costWin ? GREEN : DARK);
    text(`Daily cost: $${cost.toFixed(2)}${costWin ? '  ★' : ''}`, x + 8, y + 58);
    pop();
}

function drawTooltip() {
    for (const r of hoverRegions) {
        if (mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h) {
            drawTooltipBox(mouseX + 12, mouseY + 12, r.formula, r.detail);
            return;
        }
    }
}

function drawTooltipBox(x, y, formula, detail) {
    push();
    textSize(11);
    const w1 = textWidth(formula);
    const w2 = detail ? textWidth(detail) : 0;
    const tw = Math.max(w1, w2) + 16;
    const th = detail ? 38 : 22;

    let tx = x, ty = y;
    if (tx + tw > containerWidth) tx = containerWidth - tw - 4;
    if (ty + th > containerHeight) ty = y - th - 16;

    noStroke();
    fill(33, 37, 41, 235);
    rect(tx, ty, tw, th, 4);

    fill(255);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(formula, tx + 8, ty + 4);
    if (detail) {
        textStyle(NORMAL);
        fill(220);
        text(detail, tx + 8, ty + 20);
    }
    pop();
}

function handleCompareClick() {
    const ppfd = ppfdSlider.value();
    const photoperiod = photoperiodSlider.value();
    const dli = ppfd * photoperiod * 0.0036;
    const wattage = parseFloat(wattageInput.value()) || 0;
    const kwh = parseFloat(kwhInput.value()) || 0;
    const dailyCost = wattage * photoperiod / 1000 * kwh;

    scenarioA = { ppfd, photoperiod, dli, wattage, kwh, dailyCost };
    compareMode = true;
}

function mousePressed() {
    // Crop chart row clicks
    for (const r of cropRowBounds) {
        if (mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h) {
            const mid = (r.crop.min + r.crop.max) / 2;
            const photoperiod = photoperiodSlider.value();
            // PPFD = DLI / (photoperiod × 0.0036)
            let newPpfd = mid / (photoperiod * 0.0036);
            // Clamp to slider range and round to step 10
            newPpfd = Math.round(newPpfd / 10) * 10;
            newPpfd = Math.max(50, Math.min(1500, newPpfd));
            ppfdSlider.value(newPpfd);
            return;
        }
    }
}

function windowResized() {
    updateCanvasSize();
    computeLayout();
    resizeCanvas(containerWidth, containerHeight);
    positionControls();
}
