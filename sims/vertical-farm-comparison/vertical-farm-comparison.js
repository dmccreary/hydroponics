// Vertical Farm Models Comparison — p5.js
// CANVAS_HEIGHT: 700
let canvasWidth = 980;
let drawHeight = 560;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

const MODELS = [
    {
        id: "indoor-led", name: "Multi-tier Indoor LED", color: [76, 175, 80],
        raw: { energy: 9,  yield: 80, capex: 2500, opex: 4.5, scale: 4, location: 5, climate: 5, labor: 3, water: 5, harvest: 5 },
        scores: { energy: 2, yield: 5, capex: 1, opex: 1, scale: 4, location: 5, climate: 5, labor: 3, water: 5, harvest: 5 }
    },
    {
        id: "greenhouse-hybrid", name: "Greenhouse Hybrid", color: [255, 152, 0],
        raw: { energy: 4,  yield: 50, capex: 800, opex: 2.5, scale: 5, location: 3, climate: 3, labor: 3, water: 4, harvest: 4 },
        scores: { energy: 4, yield: 4, capex: 3, opex: 3, scale: 5, location: 3, climate: 3, labor: 3, water: 4, harvest: 4 }
    },
    {
        id: "container-farm", name: "Container Farm", color: [0, 188, 212],
        raw: { energy: 10, yield: 75, capex: 4500, opex: 5.0, scale: 2, location: 5, climate: 5, labor: 2, water: 5, harvest: 5 },
        scores: { energy: 1, yield: 5, capex: 1, opex: 1, scale: 2, location: 5, climate: 5, labor: 4, water: 5, harvest: 5 }
    },
    {
        id: "rooftop", name: "Rooftop Greenhouse", color: [156, 39, 176],
        raw: { energy: 3,  yield: 45, capex: 1500, opex: 3.0, scale: 3, location: 2, climate: 3, labor: 3, water: 4, harvest: 4 },
        scores: { energy: 5, yield: 3, capex: 2, opex: 3, scale: 3, location: 2, climate: 3, labor: 3, water: 4, harvest: 4 }
    },
    {
        id: "tower", name: "Tower Garden", color: [239, 83, 80],
        raw: { energy: 6,  yield: 60, capex: 600,  opex: 3.0, scale: 4, location: 4, climate: 2, labor: 2, water: 4, harvest: 4 },
        scores: { energy: 3, yield: 4, capex: 4, opex: 3, scale: 4, location: 4, climate: 2, labor: 4, water: 4, harvest: 4 }
    }
];

const AXES = [
    {
        key: "energy", label: "Energy Eff.", short: "Energy", units: "kWh/kg",
        rawSuffix: " kWh/kg", lowerIsBetter: true,
        definition: "Electricity used to produce one kilogram of fresh produce. Lower is better.",
        importance: "Energy is the largest controllable OpEx for indoor farms. A high score means the model uses less electricity per kg harvested."
    },
    {
        key: "yield", label: "Yield/m²", short: "Yield", units: "kg/m²/yr",
        rawSuffix: " kg/m²/yr", lowerIsBetter: false,
        definition: "Annual kilograms harvested per square meter of building footprint.",
        importance: "High yield per floor area is what justifies expensive urban real estate and tall stacks."
    },
    {
        key: "capex", label: "CapEx", short: "CapEx", units: "$/m²",
        rawSuffix: " $/m²", lowerIsBetter: true,
        definition: "Up-front capital cost per square meter of growing area.",
        importance: "CapEx sets the financing burden and break-even point. Lower CapEx means a smaller loan and faster payback."
    },
    {
        key: "opex", label: "OpEx", short: "OpEx", units: "$/kg",
        rawSuffix: " $/kg", lowerIsBetter: true,
        definition: "Operating cost (energy, labor, nutrients) per kilogram of produce.",
        importance: "OpEx sets the floor on selling price. Below-market OpEx is required to compete with field-grown commodity crops."
    },
    {
        key: "scale", label: "Scalability", short: "Scale", units: "1–5",
        rawSuffix: " / 5", lowerIsBetter: false,
        definition: "How easily the model can grow from pilot to multi-hectare scale.",
        importance: "Investors reward scalable models. Models capped by structure (containers) or sunlight (rooftops) cannot grow as fast."
    },
    {
        key: "location", label: "Location Flex.", short: "Location", units: "1–5",
        rawSuffix: " / 5", lowerIsBetter: false,
        definition: "Range of sites where the model can be deployed (city centers, deserts, basements).",
        importance: "Location flexibility lets you place production next to consumers, slashing transportation and spoilage."
    },
    {
        key: "climate", label: "Climate Indep.", short: "Climate", units: "1–5",
        rawSuffix: " / 5", lowerIsBetter: false,
        definition: "How fully the model controls light, temperature, and humidity regardless of outside weather.",
        importance: "Climate independence means consistent year-round yield — critical for retail supply contracts."
    },
    {
        key: "labor", label: "Labor (low=best)", short: "Labor", units: "1–5",
        rawSuffix: " / 5", lowerIsBetter: false,
        definition: "How little human labor is required per kg of produce (5 = highly automated).",
        importance: "Labor is often the second largest cost. Automation-friendly designs scale with less hiring."
    },
    {
        key: "water", label: "Water Eff.", short: "Water", units: "1–5",
        rawSuffix: " / 5", lowerIsBetter: false,
        definition: "How efficiently the system recirculates water versus field irrigation.",
        importance: "Water efficiency matters in arid regions and unlocks subsidies and ESG credit in many markets."
    },
    {
        key: "harvest", label: "Time to Harvest", short: "Harvest", units: "1–5",
        rawSuffix: " / 5", lowerIsBetter: false,
        definition: "How quickly a crop cycles from seed to harvest (5 = fastest).",
        importance: "Shorter cycles mean more turns per year, higher revenue per square meter, and faster response to market prices."
    }
];

const SCENARIOS = {
    "None": null,
    "Urban Rooftop": ["rooftop", "indoor-led"],
    "Rural Greenhouse": ["greenhouse-hybrid"],
    "Mobile Container": ["container-farm"],
    "High-Value Herbs": ["indoor-led", "tower"],
    "Commodity Lettuce": ["greenhouse-hybrid", "container-farm"]
};

let enabled = {};            // id -> bool
let recommendedSet = new Set();
let selectedAxis = null;     // index into AXES
let hoverVertex = null;      // { model, axisIdx, x, y }

// p5 controls
let modelCheckboxes = {};
let scenarioSelect, resetBtn;

// Layout (recomputed in updateCanvasSize)
let leftPanelW, rightPanelW, centerW;
let radarCx, radarCy, radarR;
let tableTop, tableHeight;

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 980);
    canvasWidth = containerWidth;
    leftPanelW = Math.floor(canvasWidth * 0.22);
    rightPanelW = Math.floor(canvasWidth * 0.23);
    centerW = canvasWidth - leftPanelW - rightPanelW;
    // Radar in upper portion of the center, table fills below
    const radarRegionH = Math.floor(drawHeight * 0.62);
    radarCx = leftPanelW + centerW / 2;
    radarCy = 50 + radarRegionH / 2;
    radarR = Math.min(centerW * 0.36, radarRegionH * 0.42);
    tableTop = 50 + radarRegionH + 8;
    tableHeight = drawHeight - tableTop - 8;
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    for (const m of MODELS) enabled[m.id] = true;

    buildControls();
}

function buildControls() {
    for (const id in modelCheckboxes) {
        if (modelCheckboxes[id]) modelCheckboxes[id].remove();
    }
    modelCheckboxes = {};

    const x0 = 12;
    let y = 50;
    for (const m of MODELS) {
        const cb = createCheckbox('  ' + m.name, enabled[m.id]);
        cb.position(x0 + 16, y);
        cb.style('font-size', '12px');
        cb.style('color', '#212529');
        cb.changed((function (mid) {
            return function () { enabled[mid] = modelCheckboxes[mid].checked(); };
        })(m.id));
        modelCheckboxes[m.id] = cb;
        y += 26;
    }

    // Scenario dropdown
    const sysY = y + 18;
    scenarioSelect = createSelect();
    scenarioSelect.position(x0, sysY + 18);
    scenarioSelect.style('font-size', '12px');
    scenarioSelect.style('width', (leftPanelW - 24) + 'px');
    Object.keys(SCENARIOS).forEach(o => scenarioSelect.option(o));
    scenarioSelect.selected('None');
    scenarioSelect.changed(onScenarioChanged);

    // Reset button
    resetBtn = createButton('Reset');
    resetBtn.position(12, drawHeight + 14);
    resetBtn.style('font-size', '12px');
    resetBtn.mousePressed(resetAll);
}

function onScenarioChanged() {
    const scen = scenarioSelect.value();
    const list = SCENARIOS[scen];
    if (!list) {
        recommendedSet = new Set();
        for (const m of MODELS) {
            enabled[m.id] = true;
            if (modelCheckboxes[m.id]) modelCheckboxes[m.id].checked(true);
        }
        return;
    }
    recommendedSet = new Set(list);
    for (const m of MODELS) {
        const on = recommendedSet.has(m.id);
        enabled[m.id] = on;
        if (modelCheckboxes[m.id]) modelCheckboxes[m.id].checked(on);
    }
}

function resetAll() {
    recommendedSet = new Set();
    selectedAxis = null;
    for (const m of MODELS) {
        enabled[m.id] = true;
        if (modelCheckboxes[m.id]) modelCheckboxes[m.id].checked(true);
    }
    scenarioSelect.selected('None');
}

function draw() {
    background(248, 249, 250);

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textStyle(BOLD);
    textSize(15);
    textAlign(LEFT, TOP);
    text('Vertical Farm Models Comparison', 12, 10);
    textStyle(NORMAL);
    textSize(11);
    fill(108, 117, 125);
    text('Toggle models, click an axis label for detail, hover a vertex for raw value.', 12, 30);
    pop();

    drawLeftPanelLabels();
    drawRadar();
    drawRightPanel();
    drawDataTable();
    drawControlBarBackground();

    if (hoverVertex) drawTooltip(hoverVertex);
}

function drawLeftPanelLabels() {
    const x0 = 12;
    let y = 50;
    for (const m of MODELS) {
        push();
        noStroke();
        fill(m.color[0], m.color[1], m.color[2]);
        rect(x0, y + 4, 12, 12, 2);
        // outline if recommended
        if (recommendedSet.has(m.id)) {
            stroke(46, 125, 50);
            strokeWeight(2);
            noFill();
            rect(x0 - 2, y + 2, 16, 16, 3);
        }
        pop();
        y += 26;
    }

    const sysY = 50 + MODELS.length * 26 + 18;
    push();
    fill(33);
    noStroke();
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Scenario:', 12, sysY);
    pop();
}

function axisAngle(i) {
    // Start at top (-PI/2), evenly spaced
    return -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
}

function drawRadar() {
    push();
    translate(radarCx, radarCy);

    // Concentric polygons at scores 1..5
    for (let r = 1; r <= 5; r++) {
        const t = r / 5;
        if (r === 5) { stroke(150); strokeWeight(1.2); }
        else { stroke(220); strokeWeight(1); }
        noFill();
        beginShape();
        for (let i = 0; i < AXES.length; i++) {
            const ang = axisAngle(i);
            vertex(Math.cos(ang) * radarR * t, Math.sin(ang) * radarR * t);
        }
        endShape(CLOSE);
    }

    // Axis spokes
    stroke(195);
    strokeWeight(1);
    for (let i = 0; i < AXES.length; i++) {
        const ang = axisAngle(i);
        line(0, 0, Math.cos(ang) * radarR, Math.sin(ang) * radarR);
    }

    // Tick numbers on top spoke
    fill(140);
    noStroke();
    textStyle(NORMAL);
    textSize(8);
    textAlign(LEFT, CENTER);
    for (let r = 1; r <= 5; r++) {
        const t = r / 5;
        text(r, 3, -radarR * t);
    }
    pop();

    // Polygons (recommended ones drawn last)
    hoverVertex = null;
    const order = MODELS.slice().sort((a, b) => {
        const ar = recommendedSet.has(a.id) ? 1 : 0;
        const br = recommendedSet.has(b.id) ? 1 : 0;
        return ar - br;
    });
    for (const m of order) {
        if (!enabled[m.id]) continue;
        drawModelPolygon(m);
    }

    // Axis labels (drawn after polygons so they're on top, with click hit boxes)
    push();
    textStyle(BOLD);
    textSize(11);
    textAlign(CENTER, CENTER);
    const labelPad = 26;
    for (let i = 0; i < AXES.length; i++) {
        const ang = axisAngle(i);
        const lx = radarCx + Math.cos(ang) * (radarR + labelPad);
        const ly = radarCy + Math.sin(ang) * (radarR + labelPad);
        const lbl = AXES[i].label;
        const w = textWidth(lbl) + 10;
        const h = 16;
        const bx = lx - w / 2;
        const by = ly - h / 2;
        const hovered = mouseX >= bx && mouseX <= bx + w && mouseY >= by && mouseY <= by + h;
        // background pill
        noStroke();
        if (selectedAxis === i) {
            fill(46, 125, 50);
        } else if (hovered) {
            fill(0, 188, 212, 80);
        } else {
            fill(255, 255, 255, 220);
        }
        rect(bx, by, w, h, 8);
        // text
        fill(selectedAxis === i ? 255 : 33);
        text(lbl, lx, ly);
        AXES[i]._labelBox = { x: bx, y: by, w: w, h: h };
    }
    pop();
}

function drawModelPolygon(m) {
    const pts = [];
    for (let i = 0; i < AXES.length; i++) {
        const v = m.scores[AXES[i].key];
        const t = v / 5;
        const ang = axisAngle(i);
        const px = radarCx + Math.cos(ang) * radarR * t;
        const py = radarCy + Math.sin(ang) * radarR * t;
        pts.push({ x: px, y: py });
    }

    const isRec = recommendedSet.has(m.id);
    push();
    fill(m.color[0], m.color[1], m.color[2], 70);
    stroke(m.color[0], m.color[1], m.color[2], 230);
    strokeWeight(isRec ? 3 : 1.5);
    beginShape();
    for (const p of pts) vertex(p.x, p.y);
    endShape(CLOSE);
    pop();

    // Vertex dots + hover
    for (let i = 0; i < AXES.length; i++) {
        const p = pts[i];
        const dx = mouseX - p.x, dy = mouseY - p.y;
        const hit = Math.sqrt(dx * dx + dy * dy) < 7;
        push();
        noStroke();
        fill(m.color[0], m.color[1], m.color[2]);
        circle(p.x, p.y, hit ? 10 : 5);
        pop();
        if (hit) {
            hoverVertex = { model: m, axisIdx: i, x: p.x, y: p.y };
        }
    }
}

function drawRightPanel() {
    const x = canvasWidth - rightPanelW + 6;
    const y = 50;
    const w = rightPanelW - 12;
    const h = Math.floor(drawHeight * 0.62) - 10;

    push();
    noStroke();
    fill(255);
    rect(x, y, w, h, 4);
    stroke(222, 226, 230);
    noFill();
    rect(x, y, w, h, 4);
    pop();

    push();
    textAlign(LEFT, TOP);
    if (selectedAxis === null) {
        fill(108, 117, 125);
        noStroke();
        textSize(11);
        text('Click any axis label on the radar to see what the metric means and which model leads on it.',
             x + 10, y + 10, w - 20);
    } else {
        const ax = AXES[selectedAxis];
        // Header
        noStroke();
        fill(46, 125, 50);
        textStyle(BOLD);
        textSize(13);
        text(ax.label, x + 10, y + 10);
        fill(108, 117, 125);
        textStyle(NORMAL);
        textSize(10);
        text('Units: ' + ax.units, x + 10, y + 28);

        let ty = y + 48;
        const lineH = 13;
        const wrapW = w - 20;

        textStyle(BOLD);
        textSize(10);
        fill(46, 125, 50);
        text('Definition', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        text(ax.definition, x + 10, ty, wrapW);
        ty += textHeightFor(ax.definition, wrapW) + 6;

        textStyle(BOLD);
        fill(46, 125, 50);
        text('Why it matters', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        text(ax.importance, x + 10, ty, wrapW);
        ty += textHeightFor(ax.importance, wrapW) + 6;

        // Best model on this axis
        let best = MODELS[0];
        for (const m of MODELS) {
            if (m.scores[ax.key] > best.scores[ax.key]) best = m;
        }
        textStyle(BOLD);
        fill(0, 188, 212);
        text('Leader on this axis', x + 10, ty); ty += lineH;
        // swatch
        noStroke();
        fill(best.color[0], best.color[1], best.color[2]);
        rect(x + 10, ty + 2, 10, 10, 2);
        fill(33);
        textStyle(NORMAL);
        text(best.name + '  (' + best.raw[ax.key] + ax.rawSuffix + ')', x + 26, ty, wrapW - 16);
        ty += lineH + 6;

        // Ranked list
        textStyle(BOLD);
        fill(46, 125, 50);
        text('All models (score / raw)', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        const ranked = MODELS.slice().sort((a, b) => b.scores[ax.key] - a.scores[ax.key]);
        for (const m of ranked) {
            noStroke();
            fill(m.color[0], m.color[1], m.color[2]);
            rect(x + 10, ty + 2, 8, 8, 2);
            fill(33);
            const line = m.name + ': ' + m.scores[ax.key] + '/5 (' + m.raw[ax.key] + ax.rawSuffix + ')';
            text(line, x + 22, ty, wrapW - 14);
            ty += lineH + 1;
        }
    }
    pop();
}

function drawDataTable() {
    const x0 = leftPanelW + 4;
    const w = centerW + rightPanelW - 12;
    const y0 = tableTop;
    const h = tableHeight;

    // Panel background
    push();
    noStroke();
    fill(255);
    rect(x0, y0, w, h, 4);
    stroke(222, 226, 230);
    noFill();
    rect(x0, y0, w, h, 4);
    pop();

    // Header
    push();
    fill(46, 125, 50);
    noStroke();
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Raw values (green = best in row, red = worst)', x0 + 8, y0 + 6);
    pop();

    const headerY = y0 + 24;
    const rowsY = headerY + 18;
    const nCols = MODELS.length;
    const axisColW = Math.floor(w * 0.20);
    const dataColW = Math.floor((w - axisColW - 12) / nCols);
    const rowH = Math.max(12, Math.floor((h - 44) / AXES.length));

    // Column headers
    push();
    textSize(9);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    for (let c = 0; c < nCols; c++) {
        const cx = x0 + 6 + axisColW + c * dataColW;
        const m = MODELS[c];
        // color bar
        noStroke();
        fill(m.color[0], m.color[1], m.color[2], 180);
        rect(cx + 2, headerY, dataColW - 4, 14, 2);
        // recommended border
        if (recommendedSet.has(m.id)) {
            noFill();
            stroke(46, 125, 50);
            strokeWeight(2);
            rect(cx + 2, headerY, dataColW - 4, 14, 2);
        }
        // name
        noStroke();
        fill(255);
        // Truncate name to fit
        let nm = m.name;
        while (textWidth(nm) > dataColW - 8 && nm.length > 3) {
            nm = nm.slice(0, -1);
        }
        if (nm !== m.name) nm = nm.slice(0, -1) + '…';
        text(nm, cx + dataColW / 2, headerY + 7);
    }
    pop();

    // Rows
    push();
    textSize(9);
    for (let r = 0; r < AXES.length; r++) {
        const ax = AXES[r];
        const ry = rowsY + r * rowH;

        // Axis name cell
        noStroke();
        fill(selectedAxis === r ? 0xea : 248, selectedAxis === r ? 0xf3 : 249, selectedAxis === r ? 0xe9 : 250);
        rect(x0 + 4, ry, axisColW, rowH - 1, 2);
        fill(33);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text(ax.label, x0 + 8, ry + rowH / 2);
        textStyle(NORMAL);
        fill(108, 117, 125);
        textAlign(RIGHT, CENTER);
        text(ax.units, x0 + 4 + axisColW - 6, ry + rowH / 2);

        // Find best/worst raw value among ENABLED models
        const vals = MODELS.filter(m => enabled[m.id]).map(m => m.raw[ax.key]);
        let bestV = null, worstV = null;
        if (vals.length > 0) {
            if (ax.lowerIsBetter) {
                bestV = Math.min(...vals);
                worstV = Math.max(...vals);
            } else {
                bestV = Math.max(...vals);
                worstV = Math.min(...vals);
            }
        }

        // Data cells
        for (let c = 0; c < nCols; c++) {
            const m = MODELS[c];
            const cx = x0 + 6 + axisColW + c * dataColW;
            const v = m.raw[ax.key];

            const isEnabled = enabled[m.id];
            const isBest = isEnabled && vals.length > 1 && v === bestV && bestV !== worstV;
            const isWorst = isEnabled && vals.length > 1 && v === worstV && bestV !== worstV;

            // cell background
            noStroke();
            if (!isEnabled) {
                fill(240, 240, 240);
            } else if (isBest) {
                fill(46, 125, 50, 60);
            } else if (isWorst) {
                fill(239, 83, 80, 55);
            } else {
                fill(255);
            }
            rect(cx + 2, ry, dataColW - 4, rowH - 1, 2);

            // value text
            fill(isEnabled ? 33 : 160);
            textStyle(isBest ? BOLD : NORMAL);
            textAlign(CENTER, CENTER);
            text(v, cx + dataColW / 2, ry + rowH / 2);
        }
    }
    pop();
}

function drawTooltip(hv) {
    const ax = AXES[hv.axisIdx];
    const lines = [
        hv.model.name,
        ax.label + ': ' + hv.model.raw[ax.key] + ax.rawSuffix,
        'Score: ' + hv.model.scores[ax.key] + '/5'
    ];
    push();
    textFont('Segoe UI');
    textSize(11);
    let maxW = 0;
    for (const l of lines) maxW = Math.max(maxW, textWidth(l));
    const padX = 8, padY = 6, lineH = 14;
    const w = Math.min(maxW + padX * 2, 260);
    const h = lineH * lines.length + padY * 2;
    let tx = hv.x + 12;
    let ty = hv.y + 12;
    if (tx + w > canvasWidth - 4) tx = hv.x - w - 12;
    if (ty + h > drawHeight - 4) ty = hv.y - h - 12;

    noStroke();
    fill(33, 37, 41, 235);
    rect(tx, ty, w, h, 4);
    fill(255);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(lines[0], tx + padX, ty + padY);
    textStyle(NORMAL);
    text(lines[1], tx + padX, ty + padY + lineH);
    fill(220);
    text(lines[2], tx + padX, ty + padY + lineH * 2);
    pop();
}

function textHeightFor(str, w) {
    push();
    textSize(10);
    const charW = textWidth('M');
    pop();
    const charsPerLine = Math.max(8, Math.floor(w / Math.max(1, charW * 0.6)));
    const lines = Math.max(1, Math.ceil(str.length / charsPerLine));
    return lines * 13;
}

function drawControlBarBackground() {
    push();
    noStroke();
    fill(245, 247, 249);
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(222, 226, 230);
    line(0, drawHeight, canvasWidth, drawHeight);
    pop();

    push();
    fill(108, 117, 125);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text('Tip: Pick a scenario on the left to auto-filter models for that decision context. Click any axis label on the radar for definition, importance, and the leading model.',
         90, drawHeight + 18, canvasWidth - 110);
    text('Radar scores are normalized 1–5 (higher = better). The data table below shows raw engineering values with units.',
         90, drawHeight + 60, canvasWidth - 110);
    pop();
}

function mousePressed() {
    // Axis label clicks
    for (let i = 0; i < AXES.length; i++) {
        const b = AXES[i]._labelBox;
        if (!b) continue;
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
            selectedAxis = (selectedAxis === i) ? null : i;
            return;
        }
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}
