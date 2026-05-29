// Failure Mode Analysis — p5.js
// CANVAS_HEIGHT: 680
let canvasWidth = 950;
let drawHeight = 540;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let systemSelect, commercialCheckbox, riskBtn, resetBtn;
let selectedSystem = 'Kratky';
let commercialScale = false;
let expandedRow = -1;
let showRiskChart = false;

// Track mitigated failure modes — key = system + '|' + modeName
let mitigated = new Set();

const SYSTEMS = ['Kratky', 'DWC', 'NFT', 'Ebb-and-Flow', 'Aeroponics', 'Drip'];

const SEVERITY_COLOR = {
    Red: [239, 83, 80],
    Orange: [255, 152, 0],
    Yellow: [255, 213, 79],
    Green: [165, 214, 167]
};
const SEVERITY_WEIGHT = { Red: 8, Orange: 4, Yellow: 2, Green: 1 };
const SEVERITY_TEXT_COLOR = {
    Red: [255, 255, 255],
    Orange: [33, 33, 33],
    Yellow: [33, 33, 33],
    Green: [33, 33, 33]
};

const FAILURE_MODES = {
    Kratky: [
        { mode: "Solution depletion", severity: "Yellow", time: "3–7 days", detection: "Visual: solution drops below root tips", hobbyFix: "Top up with fresh nutrient solution", commercialFix: "Float-switch alarm + auto top-up", cause: "Plant consumes solution; level naturally falls.", warning: "Solution visibly low or roots dry above water line.", recovery: "1. Add same-EC nutrient solution\n2. Maintain air gap\n3. Reset level mark" },
        { mode: "Root rot (low O2)", severity: "Orange", time: "1–3 days", detection: "Brown slimy roots, foul smell", hobbyFix: "Replace solution, sterilize jar, add H2O2", commercialFix: "Maintain air gap discipline; UV sterilization", cause: "Solution stagnation with no air gap.", warning: "Discoloration on root tips, off odor.", recovery: "1. Empty + clean jar\n2. Trim affected roots\n3. Restart with sterilized media" },
        { mode: "Algae growth", severity: "Green", time: "1+ weeks", detection: "Green tint on jar walls", hobbyFix: "Wrap jar in opaque material", commercialFix: "Opaque containers as standard", cause: "Light reaching nutrient solution.", warning: "Green slime appears on walls.", recovery: "1. Clean jar with mild bleach solution\n2. Cover\n3. Resume" }
    ],
    DWC: [
        { mode: "Air pump failure", severity: "Red", time: "2–6 hours", detection: "No bubbles in reservoir", hobbyFix: "Backup battery + spare pump", commercialFix: "Redundant air pumps + SMS alarm on flow loss", cause: "Pump motor burnout or air line blockage.", warning: "Bubbler quiet; DO probe drops.", recovery: "1. Replace pump immediately\n2. Manually aerate (whisk surface) while waiting\n3. Trim dead root tissue" },
        { mode: "Air stone clogging", severity: "Orange", time: "12–24 hours", detection: "Reduced bubble volume", hobbyFix: "Monthly air stone replacement", commercialFix: "Use diffuser tubing with cleaning schedule", cause: "Mineral scale or biofilm clogs pores.", warning: "Fewer/larger bubbles.", recovery: "1. Soak stone in dilute acid\n2. Or replace\n3. Check DO" },
        { mode: "Solution temp spike", severity: "Orange", time: "12–24 hours", detection: "Temp > 24°C reduces DO", hobbyFix: "Frozen bottles in reservoir", commercialFix: "Chiller loop", cause: "Hot ambient or insufficient insulation.", warning: "Temp probe over 24°C; plants wilting at midday.", recovery: "1. Add ice bottles\n2. Shade reservoir\n3. Increase aeration" },
        { mode: "Power outage", severity: "Red", time: "2–6 hours", detection: "Power monitor", hobbyFix: "UPS for at least 2 hours", commercialFix: "Generator with auto-switch", cause: "Grid failure.", warning: "Power outage alert.", recovery: "1. Switch to UPS\n2. Manual aerate if extended\n3. Test pump after restore" }
    ],
    NFT: [
        { mode: "Water pump failure", severity: "Red", time: "20–45 min", detection: "Channel dry / no return flow", hobbyFix: "Backup pump on standby", commercialFix: "Redundant pumps + flow sensor alarms", cause: "Pump motor failure or clog.", warning: "Reservoir not draining; channel film vanishing.", recovery: "1. Swap to backup pump\n2. Mist roots while restoring\n3. Check root damage" },
        { mode: "Channel clog (root mat)", severity: "Orange", time: "6–12 hours", detection: "Pooling at high end of channel", hobbyFix: "Trim roots monthly", commercialFix: "Schedule root trim every 2 weeks", cause: "Excess root growth blocks flow.", warning: "Solution backs up; pump overheats.", recovery: "1. Pull plants\n2. Trim roots\n3. Flush channel" },
        { mode: "Algae in channel", severity: "Yellow", time: "Days", detection: "Green tint in film", hobbyFix: "Opaque covers", commercialFix: "Black PVC channels standard", cause: "Light penetrates channel.", warning: "Green tint.", recovery: "1. Cover with opaque tape\n2. Sterilize channel" },
        { mode: "Power outage", severity: "Red", time: "30–60 min", detection: "Power monitor", hobbyFix: "UPS + manual misting", commercialFix: "Generator + UPS", cause: "Grid failure.", warning: "Power loss alarm.", recovery: "1. UPS keeps pump running\n2. Generator fails over\n3. Resume monitoring" }
    ],
    "Ebb-and-Flow": [
        { mode: "Timer failure (stuck on)", severity: "Yellow", time: "1–3 days", detection: "Table not draining", hobbyFix: "Reliable digital timer", commercialFix: "PLC with watchdog timer", cause: "Mechanical timer sticking.", warning: "Continuous flood, plants sit in water.", recovery: "1. Replace timer\n2. Inspect roots\n3. Allow normal drain cycle" },
        { mode: "Pump failure", severity: "Yellow", time: "1–3 days", detection: "Table not filling", hobbyFix: "Backup pump", commercialFix: "Redundant pumps with auto-switch", cause: "Pump burnout, impeller clog.", warning: "No flood at scheduled time.", recovery: "1. Swap pump\n2. Run extra cycle to catch up\n3. Check roots" },
        { mode: "Overflow drain clog", severity: "Orange", time: "12–24 hours", detection: "Table overflows", hobbyFix: "Inspect drain weekly", commercialFix: "Dual overflow drains", cause: "Debris in drain.", warning: "Water rising past max level.", recovery: "1. Clear drain\n2. Drain table\n3. Inspect plant roots" }
    ],
    Aeroponics: [
        { mode: "Nozzle clogging", severity: "Orange", time: "6–24 hours", detection: "Visual misting check", hobbyFix: "Weekly nozzle clean", commercialFix: "Self-cleaning nozzles + flow sensor", cause: "Mineral scale, salt buildup.", warning: "Asymmetric misting; dry roots.", recovery: "1. Replace/clean nozzles\n2. Verify pressure\n3. Inspect roots" },
        { mode: "High-pressure pump failure", severity: "Red", time: "15–30 min", detection: "Pressure gauge zero", hobbyFix: "Backup pump (rare)", commercialFix: "Dual pumps + pressure alarm", cause: "Motor failure or seal leak.", warning: "No mist sound; pressure zero.", recovery: "1. Switch to backup\n2. Spray roots manually\n3. Replace pump" },
        { mode: "Mist chamber leak", severity: "Yellow", time: "1–3 days", detection: "Humidity drop, puddles below", hobbyFix: "Seal with silicone", commercialFix: "Proper gasketing standard", cause: "Seal failure or panel crack.", warning: "Reservoir dropping faster than usual.", recovery: "1. Locate leak\n2. Seal\n3. Refill" },
        { mode: "Power outage", severity: "Red", time: "10–30 min", detection: "Power monitor", hobbyFix: "UPS + hand sprayer", commercialFix: "Generator + dual UPS", cause: "Grid failure.", warning: "Power alarm.", recovery: "1. UPS bridges\n2. Generator starts\n3. Verify mist resumed" }
    ],
    Drip: [
        { mode: "Emitter clogging", severity: "Orange", time: "12–24 hours", detection: "Dry medium at some plants", hobbyFix: "Inline filters; flush weekly", commercialFix: "Pressure-compensating emitters + bi-weekly flush", cause: "Mineral or biofilm deposits.", warning: "Uneven canopy growth.", recovery: "1. Clear clogged emitter\n2. Flush line\n3. Replace if needed" },
        { mode: "Pump failure", severity: "Yellow", time: "1–2 days", detection: "No drip at any plant", hobbyFix: "Backup pump", commercialFix: "Redundant pumps + flow alarm", cause: "Motor burnout.", warning: "Reservoir level not dropping.", recovery: "1. Swap pump\n2. Run catch-up cycle\n3. Inspect" },
        { mode: "Line break/leak", severity: "Yellow", time: "1–3 days", detection: "Wet floor or reservoir empties fast", hobbyFix: "Inspect lines monthly", commercialFix: "Pressure monitoring + leak shutoff", cause: "Mechanical damage or fitting failure.", warning: "Reservoir drops fast.", recovery: "1. Locate + repair\n2. Refill\n3. Re-inspect" }
    ]
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

    // System select (dropdown)
    systemSelect = createSelect();
    for (const s of SYSTEMS) systemSelect.option(s);
    systemSelect.selected(selectedSystem);
    systemSelect.position(15, 50);
    systemSelect.style('width', '160px');
    systemSelect.style('font-size', '13px');
    systemSelect.changed(() => {
        selectedSystem = systemSelect.value();
        expandedRow = -1;
        showRiskChart = false;
    });

    // Commercial scale checkbox
    commercialCheckbox = createCheckbox(' Commercial scale', false);
    commercialCheckbox.position(15, 90);
    commercialCheckbox.style('font-size', '12px');
    commercialCheckbox.changed(() => {
        commercialScale = commercialCheckbox.checked();
    });

    // Calculate Risk Score button
    riskBtn = createButton('Calculate Risk Score');
    riskBtn.position(15, 125);
    riskBtn.style('font-size', '12px');
    riskBtn.style('background-color', '#2e7d32');
    riskBtn.style('color', '#ffffff');
    riskBtn.style('border', 'none');
    riskBtn.style('padding', '6px 10px');
    riskBtn.style('border-radius', '3px');
    riskBtn.style('cursor', 'pointer');
    riskBtn.mousePressed(() => {
        showRiskChart = true;
        expandedRow = -1;
    });

    // Reset Mitigations button
    resetBtn = createButton('Reset Mitigations');
    resetBtn.position(15, 160);
    resetBtn.style('font-size', '12px');
    resetBtn.style('background-color', '#ffffff');
    resetBtn.style('color', '#2e7d32');
    resetBtn.style('border', '1px solid #2e7d32');
    resetBtn.style('padding', '6px 10px');
    resetBtn.style('border-radius', '3px');
    resetBtn.style('cursor', 'pointer');
    resetBtn.mousePressed(() => {
        mitigated.clear();
        showRiskChart = false;
        expandedRow = -1;
    });
}

function mitigatedKey(system, mode) {
    return system + '|' + mode;
}

function isMitigated(system, mode) {
    return mitigated.has(mitigatedKey(system, mode));
}

function systemRiskScore(system) {
    let score = 0;
    for (const fm of FAILURE_MODES[system]) {
        if (!isMitigated(system, fm.mode)) {
            score += SEVERITY_WEIGHT[fm.severity];
        }
    }
    return score;
}

function systemMaxRiskScore(system) {
    let score = 0;
    for (const fm of FAILURE_MODES[system]) {
        score += SEVERITY_WEIGHT[fm.severity];
    }
    return score;
}

function draw() {
    background(248, 249, 250);

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Failure Mode Analysis — Hydroponic Systems', 12, 10);
    pop();

    drawLeftPanel();
    drawMainPanel();
}

function drawLeftPanel() {
    const panelW = Math.max(180, width * 0.22);

    push();
    noStroke();
    fill(255);
    rect(8, 35, panelW - 10, drawHeight - 10, 4);
    stroke(222, 226, 230);
    noFill();
    rect(8, 35, panelW - 10, drawHeight - 10, 4);
    pop();

    push();
    fill(33);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('System Type:', 15, 38);
    textStyle(NORMAL);
    pop();

    // Legend below controls
    const legendY = 210;
    push();
    fill(33);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Severity Legend:', 15, legendY);
    textStyle(NORMAL);
    pop();

    const legendItems = [
        { sev: 'Red', label: '< 4 hours' },
        { sev: 'Orange', label: '4–24 hours' },
        { sev: 'Yellow', label: '1–7 days' },
        { sev: 'Green', label: 'recoverable' }
    ];
    for (let i = 0; i < legendItems.length; i++) {
        const item = legendItems[i];
        const y = legendY + 22 + i * 22;
        const c = SEVERITY_COLOR[item.sev];
        push();
        noStroke();
        fill(c[0], c[1], c[2]);
        rect(15, y, 16, 16, 2);
        fill(33);
        textSize(11);
        textAlign(LEFT, CENTER);
        text(item.label, 38, y + 8);
        pop();
    }

    // Risk score gauge
    const gaugeY = legendY + 22 + 4 * 22 + 14;
    const score = systemRiskScore(selectedSystem);
    const maxScore = systemMaxRiskScore(selectedSystem);
    push();
    fill(33);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Current Risk Score:', 15, gaugeY);
    textStyle(NORMAL);
    textSize(18);
    textStyle(BOLD);
    fill(46, 125, 50);
    text(score + ' / ' + maxScore, 15, gaugeY + 18);
    pop();

    // Risk bar
    const barX = 15;
    const barY = gaugeY + 46;
    const barW = panelW - 35;
    const barH = 14;
    push();
    noStroke();
    fill(238, 238, 238);
    rect(barX, barY, barW, barH, 3);
    // gradient fill
    const ratio = maxScore > 0 ? score / maxScore : 0;
    const fillW = barW * ratio;
    // gradient from green to red
    for (let i = 0; i < fillW; i++) {
        const t = i / barW;
        const r = lerp(46, 239, t);
        const g = lerp(125, 83, t);
        const b = lerp(50, 80, t);
        stroke(r, g, b);
        line(barX + i, barY, barX + i, barY + barH);
    }
    noStroke();
    fill(33);
    textSize(10);
    textAlign(LEFT, TOP);
    text('Lower is safer', barX, barY + barH + 4);
    pop();
}

function drawMainPanel() {
    const leftW = Math.max(180, width * 0.22);
    const mainX = leftW + 4;
    const mainY = 38;
    const mainW = width - mainX - 10;
    const mainH = drawHeight - 10;

    push();
    noStroke();
    fill(255);
    rect(mainX, mainY, mainW, mainH, 4);
    stroke(222, 226, 230);
    noFill();
    rect(mainX, mainY, mainW, mainH, 4);
    pop();

    // Header
    const modeLabel = commercialScale ? 'COMMERCIAL' : 'HOBBY';
    push();
    fill(33);
    noStroke();
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(selectedSystem + ' — Failure Mode Matrix', mainX + 10, mainY + 8);
    textAlign(RIGHT, TOP);
    fill(0, 188, 212);
    text(modeLabel, mainX + mainW - 10, mainY + 8);
    pop();

    if (showRiskChart) {
        drawRiskChart(mainX, mainY + 30, mainW, mainH - 30);
        return;
    }

    drawFailureTable(mainX, mainY + 30, mainW, mainH - 30);
}

function drawFailureTable(x, y, w, h) {
    const modes = FAILURE_MODES[selectedSystem];

    // Column widths as fractions
    const cols = [
        { label: 'Failure Mode', frac: 0.18 },
        { label: 'Time to Loss', frac: 0.13 },
        { label: 'Detection', frac: 0.22 },
        { label: 'Mitigation (' + (commercialScale ? 'Commercial' : 'Hobby') + ')', frac: 0.32 },
        { label: 'Mitigated', frac: 0.15 }
    ];
    const tableX = x + 8;
    const tableY = y + 4;
    const tableW = w - 16;

    let cx = tableX;
    const colX = [];
    const colW = [];
    for (const c of cols) {
        colX.push(cx);
        colW.push(tableW * c.frac);
        cx += tableW * c.frac;
    }

    // Header row
    push();
    noStroke();
    fill(46, 125, 50);
    rect(tableX, tableY, tableW, 26, 3);
    fill(255);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < cols.length; i++) {
        text(cols[i].label, colX[i] + 6, tableY + 13, colW[i] - 8);
    }
    pop();

    // Calculate row heights — base row 56, expanded row larger
    let cursorY = tableY + 30;
    const rowH = 60;
    const detailH = 140;

    for (let i = 0; i < modes.length; i++) {
        const fm = modes[i];
        const mit = isMitigated(selectedSystem, fm.mode);
        const sev = SEVERITY_COLOR[fm.severity];
        const txtCol = SEVERITY_TEXT_COLOR[fm.severity];

        // Row background
        push();
        if (mit) {
            noStroke();
            fill(200, 230, 201);
            rect(tableX, cursorY, tableW, rowH - 4, 3);
            stroke(46, 125, 50);
            strokeWeight(2);
            noFill();
            rect(tableX, cursorY, tableW, rowH - 4, 3);
        } else {
            noStroke();
            fill(sev[0], sev[1], sev[2], 220);
            rect(tableX, cursorY, tableW, rowH - 4, 3);
            if (expandedRow === i) {
                stroke(0, 188, 212);
                strokeWeight(3);
                noFill();
                rect(tableX, cursorY, tableW, rowH - 4, 3);
            }
        }
        pop();

        // Cell text
        push();
        if (mit) {
            fill(33);
        } else {
            fill(txtCol[0], txtCol[1], txtCol[2]);
        }
        noStroke();
        textSize(11);
        textStyle(BOLD);
        textAlign(LEFT, TOP);
        text(fm.mode, colX[0] + 6, cursorY + 6, colW[0] - 8);
        textStyle(NORMAL);
        textSize(10);
        text(fm.time, colX[1] + 6, cursorY + 6, colW[1] - 8);
        text(fm.detection, colX[2] + 6, cursorY + 6, colW[2] - 8);
        const fixText = commercialScale ? fm.commercialFix : fm.hobbyFix;
        text(fixText, colX[3] + 6, cursorY + 6, colW[3] - 8);
        pop();

        // Mitigated checkbox (drawn manually, hit-tested in mousePressed)
        const cbSize = 18;
        const cbX = colX[4] + colW[4] / 2 - cbSize / 2;
        const cbY = cursorY + rowH / 2 - cbSize / 2 - 2;
        push();
        stroke(33);
        strokeWeight(1.5);
        fill(255);
        rect(cbX, cbY, cbSize, cbSize, 2);
        if (mit) {
            stroke(46, 125, 50);
            strokeWeight(3);
            noFill();
            line(cbX + 3, cbY + cbSize / 2, cbX + cbSize / 2 - 1, cbY + cbSize - 4);
            line(cbX + cbSize / 2 - 1, cbY + cbSize - 4, cbX + cbSize - 3, cbY + 3);
        }
        pop();

        // Click indicator
        push();
        noStroke();
        fill(mit ? 33 : (txtCol[0] === 255 ? 255 : 33), 180);
        textSize(9);
        textAlign(LEFT, BOTTOM);
        if (expandedRow === i) {
            text('▼ click to collapse', colX[0] + 6, cursorY + rowH - 8);
        } else {
            text('▶ click row for details', colX[0] + 6, cursorY + rowH - 8);
        }
        pop();

        cursorY += rowH;

        // Expanded detail panel
        if (expandedRow === i) {
            push();
            noStroke();
            fill(245, 250, 245);
            rect(tableX, cursorY, tableW, detailH - 4, 3);
            stroke(0, 188, 212);
            strokeWeight(2);
            noFill();
            rect(tableX, cursorY, tableW, detailH - 4, 3);
            pop();

            push();
            fill(33);
            noStroke();
            textAlign(LEFT, TOP);
            textSize(11);
            textStyle(BOLD);
            fill(46, 125, 50);
            text('Cause:', tableX + 10, cursorY + 8);
            textStyle(NORMAL);
            fill(33);
            text(fm.cause, tableX + 60, cursorY + 8, tableW - 70);

            textStyle(BOLD);
            fill(46, 125, 50);
            text('Early warning:', tableX + 10, cursorY + 36);
            textStyle(NORMAL);
            fill(33);
            text(fm.warning, tableX + 100, cursorY + 36, tableW - 110);

            textStyle(BOLD);
            fill(46, 125, 50);
            text('Recovery procedure:', tableX + 10, cursorY + 64);
            textStyle(NORMAL);
            fill(33);
            text(fm.recovery, tableX + 10, cursorY + 82, tableW - 20);
            pop();

            cursorY += detailH;
        }

        if (cursorY > y + h - 20) break;
    }
}

function drawRiskChart(x, y, w, h) {
    push();
    fill(33);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Maximum Risk Score Comparison (all 6 systems, no mitigations)', x + 10, y + 6);
    textStyle(NORMAL);
    textSize(10);
    fill(108, 117, 125);
    text('Current selected system shown highlighted. Bar = sum of severity weights (Red=8, Orange=4, Yellow=2, Green=1).', x + 10, y + 24, w - 20);
    pop();

    // compute max
    let maxBar = 0;
    const scores = SYSTEMS.map(s => systemMaxRiskScore(s));
    const currentScores = SYSTEMS.map(s => systemRiskScore(s));
    for (const sc of scores) if (sc > maxBar) maxBar = sc;
    if (maxBar < 1) maxBar = 1;

    const chartX = x + 100;
    const chartY = y + 60;
    const chartW = w - 130;
    const chartH = h - 90;
    const rowH = chartH / SYSTEMS.length;

    for (let i = 0; i < SYSTEMS.length; i++) {
        const sys = SYSTEMS[i];
        const maxSc = scores[i];
        const curSc = currentScores[i];
        const ry = chartY + i * rowH + 4;
        const barH = rowH - 14;
        const maxBarW = chartW * (maxSc / maxBar);
        const curBarW = chartW * (curSc / maxBar);

        // Label
        push();
        fill(33);
        noStroke();
        textSize(11);
        textStyle(sys === selectedSystem ? BOLD : NORMAL);
        textAlign(RIGHT, CENTER);
        text(sys, chartX - 8, ry + barH / 2);
        pop();

        // Max bar (light)
        push();
        noStroke();
        fill(239, 83, 80, 110);
        rect(chartX, ry, maxBarW, barH, 3);
        // Current bar (darker)
        fill(239, 83, 80, 220);
        rect(chartX, ry, curBarW, barH, 3);

        if (sys === selectedSystem) {
            stroke(0, 188, 212);
            strokeWeight(2);
            noFill();
            rect(chartX, ry, maxBarW, barH, 3);
        }

        // Score number
        noStroke();
        fill(33);
        textSize(11);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text(curSc + ' / ' + maxSc, chartX + maxBarW + 6, ry + barH / 2);
        pop();
    }

    // Footer hint
    push();
    fill(108, 117, 125);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text('Click any failure mode row (after closing this chart) to see recovery details.', x + 10, y + h - 18);
    pop();

    // Close hint button-like text
    push();
    fill(0, 188, 212);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(RIGHT, TOP);
    text('[ Click here or change system to close chart ]', x + w - 10, y + 6);
    pop();
}

function mousePressed() {
    // Ignore clicks outside canvas
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    const leftW = Math.max(180, width * 0.22);
    const mainX = leftW + 4;
    const mainY = 38;
    const mainW = width - mainX - 10;
    const mainH = drawHeight - 10;

    // Click in chart area closes chart
    if (showRiskChart) {
        if (mouseX >= mainX && mouseX <= mainX + mainW &&
            mouseY >= mainY && mouseY <= mainY + mainH) {
            showRiskChart = false;
            return;
        }
        return;
    }

    // Hit test table rows
    const tableX = mainX + 8;
    const tableY = mainY + 30 + 4;
    const tableW = mainW - 16;
    const rowH = 60;
    const detailH = 140;
    const headerH = 30;

    let cursorY = tableY + headerH;
    const modes = FAILURE_MODES[selectedSystem];

    // Column 5 = Mitigated checkbox column
    const cols = [
        { frac: 0.18 }, { frac: 0.13 }, { frac: 0.22 }, { frac: 0.32 }, { frac: 0.15 }
    ];
    let cx = tableX;
    const colX = [];
    const colW = [];
    for (const c of cols) {
        colX.push(cx);
        colW.push(tableW * c.frac);
        cx += tableW * c.frac;
    }

    for (let i = 0; i < modes.length; i++) {
        const fm = modes[i];
        const rowTop = cursorY;
        const rowBottom = cursorY + rowH - 4;

        if (mouseX >= tableX && mouseX <= tableX + tableW &&
            mouseY >= rowTop && mouseY <= rowBottom) {

            // Check if click was in the Mitigated checkbox area
            const cbSize = 18;
            const cbX = colX[4] + colW[4] / 2 - cbSize / 2;
            const cbY = cursorY + rowH / 2 - cbSize / 2 - 2;
            const pad = 12;
            if (mouseX >= cbX - pad && mouseX <= cbX + cbSize + pad &&
                mouseY >= cbY - pad && mouseY <= cbY + cbSize + pad) {
                const key = mitigatedKey(selectedSystem, fm.mode);
                if (mitigated.has(key)) mitigated.delete(key);
                else mitigated.add(key);
                return;
            }

            // Otherwise toggle expanded row
            expandedRow = (expandedRow === i) ? -1 : i;
            return;
        }

        cursorY += rowH;
        if (expandedRow === i) cursorY += detailH;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
