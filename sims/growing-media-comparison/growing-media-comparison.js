// Growing Media Comparison — p5.js
// CANVAS_HEIGHT: 620
let canvasWidth = 960;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

const MEDIA = [
    {
        id: "rockwool", name: "Rockwool", color: [239, 83, 80],
        waterRetention: 4.5, airPorosity: 3.5, reusability: 1.0, phNeutrality: 1.5,
        waterRetentionNote: "Holds ~80% of volume as water — excellent for seedlings.",
        airPorosityNote: "Fibrous structure leaves air channels even when saturated.",
        reusabilityNote: "Single-use; biodegrades slowly in landfill.",
        phNeutralityNote: "Manufactured alkaline (pH ~8); must be pre-soaked in pH-5.5 water.",
        fullProps: "Density 90 kg/m³; CEC ~0. Fibrous mineral wool. Holds 80% water, 18% air, 2% solid.",
        prepSteps: ["Soak in pH-5.5 water for 12–24 hours", "Drain (no squeezing)", "Insert seed/cube"],
        sterilization: "Single-use — discard after harvest.",
        costPerCycle: "$0.30 per cube",
        bestSystems: ["NFT", "DWC", "Drip"],
        bestCrops: ["Lettuce", "Herbs", "Tomato"]
    },
    {
        id: "clay", name: "Expanded Clay", color: [255, 152, 0],
        waterRetention: 2.0, airPorosity: 4.5, reusability: 5.0, phNeutrality: 4.0,
        waterRetentionNote: "Porous pebbles absorb 15% by weight; surface drains fast.",
        airPorosityNote: "Loose pebble pile has huge inter-particle air space.",
        reusabilityNote: "Wash, sterilize, reuse indefinitely.",
        phNeutralityNote: "Slightly alkaline initially; stabilizes near neutral after rinsing.",
        fullProps: "Density 350 kg/m³; CEC negligible. Fired clay pebbles 8–16 mm.",
        prepSteps: ["Rinse 3× to remove dust", "Optional: pH-5.5 soak overnight"],
        sterilization: "Soak in 10% H2O2 or boil between cycles.",
        costPerCycle: "$0.05 per L (amortized over many cycles)",
        bestSystems: ["Ebb-and-Flow", "Drip", "DWC"],
        bestCrops: ["Tomato", "Lettuce", "Herbs"]
    },
    {
        id: "coir", name: "Coconut Coir", color: [121, 85, 72],
        waterRetention: 4.0, airPorosity: 3.0, reusability: 2.5, phNeutrality: 4.0,
        waterRetentionNote: "Holds 70% of volume as water; doesn't compact like peat.",
        airPorosityNote: "Mixed grades retain 20–30% air space.",
        reusabilityNote: "Can be reused 1–2 cycles after flush/sterilization.",
        phNeutralityNote: "Naturally pH 5.7–6.5 — friendly to most crops.",
        fullProps: "Density 75 kg/m³; CEC ~50. Coconut husk fiber, biodegradable.",
        prepSteps: ["Buffer with Ca(NO3)2 solution to remove residual K/Na", "Rinse with clean water"],
        sterilization: "Solarize or treat with H2O2 between cycles.",
        costPerCycle: "$0.20 per L (compressed brick form)",
        bestSystems: ["Drip", "Ebb-and-Flow"],
        bestCrops: ["Tomato", "Herbs", "Microgreens"]
    },
    {
        id: "perlite", name: "Perlite", color: [144, 202, 249],
        waterRetention: 1.5, airPorosity: 5.0, reusability: 4.0, phNeutrality: 4.5,
        waterRetentionNote: "Holds little water; mostly used as an aerator.",
        airPorosityNote: "Volcanic glass with sealed air pockets — best air score.",
        reusabilityNote: "Reuse 3–5 cycles before crumbling.",
        phNeutralityNote: "Inert; pH ~7.",
        fullProps: "Density 80 kg/m³; CEC ~0. Expanded volcanic glass.",
        prepSteps: ["Rinse to settle dust (wear mask)"],
        sterilization: "Rinse and bake at 80°C for 1 hour, or use H2O2.",
        costPerCycle: "$0.08 per L",
        bestSystems: ["Ebb-and-Flow", "Drip"],
        bestCrops: ["Microgreens", "Herbs"]
    },
    {
        id: "vermiculite", name: "Vermiculite", color: [171, 71, 188],
        waterRetention: 4.5, airPorosity: 2.0, reusability: 2.0, phNeutrality: 4.0,
        waterRetentionNote: "Holds 4–5× its weight in water; can waterlog roots.",
        airPorosityNote: "Compacts over time, reducing air space.",
        reusabilityNote: "1–2 cycles before it compacts.",
        phNeutralityNote: "Slightly alkaline (pH 7–7.5).",
        fullProps: "Density 100 kg/m³; CEC ~150. Heated mica mineral.",
        prepSteps: ["Rinse to remove dust", "Mix 50:50 with perlite to improve aeration"],
        sterilization: "Bake at 100°C.",
        costPerCycle: "$0.10 per L",
        bestSystems: ["Ebb-and-Flow"],
        bestCrops: ["Microgreens", "Herbs"]
    },
    {
        id: "pumice", name: "Pumice", color: [144, 144, 144],
        waterRetention: 2.5, airPorosity: 4.5, reusability: 5.0, phNeutrality: 4.0,
        waterRetentionNote: "Porous pumice grains hold modest water on internal surfaces.",
        airPorosityNote: "Highly porous and free-draining.",
        reusabilityNote: "Indefinite — does not break down.",
        phNeutralityNote: "Nearly neutral (pH 7.0).",
        fullProps: "Density 600 kg/m³; CEC ~10. Lightweight volcanic rock.",
        prepSteps: ["Rinse to remove dust", "Optional pH soak"],
        sterilization: "H2O2 rinse or bake; very durable.",
        costPerCycle: "$0.06 per L",
        bestSystems: ["Drip", "Ebb-and-Flow"],
        bestCrops: ["Tomato", "Herbs"]
    },
    {
        id: "gravel", name: "Gravel / Sand", color: [69, 90, 100],
        waterRetention: 1.0, airPorosity: 3.0, reusability: 5.0, phNeutrality: 3.0,
        waterRetentionNote: "Almost no internal water capacity; drains immediately.",
        airPorosityNote: "Heavy and dense; modest inter-particle air.",
        reusabilityNote: "Indefinite — wash and reuse.",
        phNeutralityNote: "Limestone gravel raises pH; silica/granite is neutral.",
        fullProps: "Density 1500 kg/m³; CEC ~0. Inert mineral.",
        prepSteps: ["Wash with water until runoff is clear", "Verify pH with overnight soak"],
        sterilization: "Boil or bleach rinse.",
        costPerCycle: "$0.02 per L",
        bestSystems: ["Ebb-and-Flow"],
        bestCrops: ["Tomato"]
    }
];

const AXES = [
    { key: "waterRetention", noteKey: "waterRetentionNote", label: "Water retention", short: "Water" },
    { key: "airPorosity",    noteKey: "airPorosityNote",    label: "Air porosity",    short: "Air" },
    { key: "reusability",    noteKey: "reusabilityNote",    label: "Reusability",     short: "Reuse" },
    { key: "phNeutrality",   noteKey: "phNeutralityNote",   label: "pH neutrality",   short: "pH" }
];

// One angle per axis: top, right, bottom, left
const AXIS_ANGLES = [-HALF_PI_VAL(), 0, HALF_PI_VAL(), Math.PI];
function HALF_PI_VAL() { return Math.PI / 2; }

let enabled = {};         // id -> bool
let highlighted = new Set();
let detailMedium = null;
let hoverVertex = null;   // { medium, axisIdx, x, y, score, note }

// p5 controls
let mediaCheckboxes = {};
let systemSelect, cropSelect, resetBtn;

// Layout constants (recomputed in updateCanvasSize)
let leftPanelW, rightPanelW, centerW;
let radarCx, radarCy, radarR;

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 980);
    canvasWidth = containerWidth;
    leftPanelW = Math.floor(canvasWidth * 0.22);
    rightPanelW = Math.floor(canvasWidth * 0.23);
    centerW = canvasWidth - leftPanelW - rightPanelW;
    radarCx = leftPanelW + centerW / 2;
    radarCy = drawHeight / 2 - 8;
    radarR = Math.min(centerW * 0.32, drawHeight * 0.32);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    // Default: enable all media
    for (const m of MEDIA) enabled[m.id] = true;

    buildControls();
}

function buildControls() {
    // Clean up any existing controls (defensive — only called once normally)
    for (const id in mediaCheckboxes) {
        if (mediaCheckboxes[id]) mediaCheckboxes[id].remove();
    }
    mediaCheckboxes = {};

    // Left panel checkboxes
    const x0 = 12;
    let y = 50;
    for (const m of MEDIA) {
        const cb = createCheckbox('  ' + m.name, enabled[m.id]);
        cb.position(x0 + 16, y);
        cb.style('font-size', '12px');
        cb.style('color', '#212529');
        cb.changed((function (mid) {
            return function () { enabled[mid] = cb.checked(); };
        })(m.id));
        mediaCheckboxes[m.id] = cb;
        y += 26;
    }

    // System dropdown
    const sysY = y + 14;
    systemSelect = createSelect();
    systemSelect.position(x0, sysY + 16);
    systemSelect.style('font-size', '12px');
    systemSelect.style('width', (leftPanelW - 24) + 'px');
    ['Any', 'Kratky', 'DWC', 'NFT', 'Ebb-and-Flow', 'Aeroponics', 'Drip'].forEach(o => systemSelect.option(o));
    systemSelect.selected('Any');
    systemSelect.changed(onSystemChanged);

    // Crop dropdown
    const cropY = sysY + 52;
    cropSelect = createSelect();
    cropSelect.position(x0, cropY + 16);
    cropSelect.style('font-size', '12px');
    cropSelect.style('width', (leftPanelW - 24) + 'px');
    ['Any', 'Lettuce', 'Herbs', 'Tomato', 'Microgreens'].forEach(o => cropSelect.option(o));
    cropSelect.selected('Any');
    cropSelect.changed(onCropChanged);

    // Reset button below the canvas
    resetBtn = createButton('Reset filters');
    resetBtn.position(12, drawHeight + 12);
    resetBtn.style('font-size', '12px');
    resetBtn.mousePressed(resetFilters);
}

function onSystemChanged() {
    const sys = systemSelect.value();
    if (sys === 'Any') {
        highlighted = new Set();
        return;
    }
    // Score: count of bestSystems match; pick top 2
    const scored = MEDIA.map(m => ({ m, s: m.bestSystems.includes(sys) ? 1 : 0 }))
        .filter(x => x.s > 0);
    scored.sort((a, b) => b.s - a.s);
    const top = scored.slice(0, 2).map(x => x.m.id);
    highlighted = new Set(top);
    // Auto-enable the highlighted, dim others (don't actually disable, just highlight)
    for (const id of top) {
        enabled[id] = true;
        if (mediaCheckboxes[id]) mediaCheckboxes[id].checked(true);
    }
    // Reset crop select to Any to avoid conflict
    cropSelect.selected('Any');
}

function onCropChanged() {
    const crop = cropSelect.value();
    if (crop === 'Any') {
        highlighted = new Set();
        return;
    }
    const matches = MEDIA.filter(m => m.bestCrops.includes(crop)).map(m => m.id);
    highlighted = new Set(matches.slice(0, 3));
    for (const id of highlighted) {
        enabled[id] = true;
        if (mediaCheckboxes[id]) mediaCheckboxes[id].checked(true);
    }
    systemSelect.selected('Any');
}

function resetFilters() {
    highlighted = new Set();
    detailMedium = null;
    for (const m of MEDIA) {
        enabled[m.id] = true;
        if (mediaCheckboxes[m.id]) mediaCheckboxes[m.id].checked(true);
    }
    systemSelect.selected('Any');
    cropSelect.selected('Any');
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
    text('Growing Media Comparison', 12, 10);
    textStyle(NORMAL);
    textSize(11);
    fill(108, 117, 125);
    text('Toggle media, hover vertices, click a name to inspect.', 12, 30);
    pop();

    drawLeftPanelLabels();
    drawRadar();
    drawLegendRow();
    drawRightPanel();
    drawControlBarBackground();

    if (hoverVertex) drawTooltip(hoverVertex);
}

function drawLeftPanelLabels() {
    // Color swatches next to checkboxes
    const x0 = 12;
    let y = 50;
    for (const m of MEDIA) {
        push();
        noStroke();
        fill(m.color[0], m.color[1], m.color[2]);
        rect(x0, y + 4, 12, 12, 2);
        pop();
        y += 26;
    }

    // Section labels
    const sysY = 50 + MEDIA.length * 26 + 14;
    push();
    fill(33);
    noStroke();
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Best for system:', x0, sysY);
    text('Best for crop:', x0, sysY + 52);
    pop();
}

function drawRadar() {
    // Concentric pentagon rings (but 4 axes -> diamond shape). Use 4 axes as a quadrilateral.
    push();
    translate(radarCx, radarCy);

    // Rings at 1..5 (4 inner rings + outer)
    for (let r = 1; r <= 5; r++) {
        const t = r / 5;
        if (r === 5) {
            stroke(150);
            strokeWeight(1.2);
        } else {
            stroke(210);
            strokeWeight(1);
        }
        noFill();
        beginShape();
        for (let i = 0; i < 4; i++) {
            const ang = AXIS_ANGLES[i];
            vertex(Math.cos(ang) * radarR * t, Math.sin(ang) * radarR * t);
        }
        endShape(CLOSE);
    }

    // Axis spokes
    stroke(180);
    strokeWeight(1);
    for (let i = 0; i < 4; i++) {
        const ang = AXIS_ANGLES[i];
        line(0, 0, Math.cos(ang) * radarR, Math.sin(ang) * radarR);
    }

    // Axis labels
    noStroke();
    fill(46, 125, 50);
    textStyle(BOLD);
    textSize(12);
    textAlign(CENTER, CENTER);
    const labelPad = 18;
    for (let i = 0; i < 4; i++) {
        const ang = AXIS_ANGLES[i];
        const lx = Math.cos(ang) * (radarR + labelPad);
        const ly = Math.sin(ang) * (radarR + labelPad);
        text(AXES[i].label, lx, ly);
    }

    // Tick numbers on top axis
    fill(120);
    textStyle(NORMAL);
    textSize(9);
    textAlign(LEFT, CENTER);
    for (let r = 1; r <= 5; r++) {
        const t = r / 5;
        text(r, 3, -radarR * t);
    }

    pop();

    // Draw polygons (non-highlighted first, highlighted last so they're on top)
    const highlightActive = highlighted.size > 0;
    const drawOrder = MEDIA.slice().sort((a, b) => {
        const ah = highlighted.has(a.id) ? 1 : 0;
        const bh = highlighted.has(b.id) ? 1 : 0;
        return ah - bh;
    });

    hoverVertex = null;
    for (const m of drawOrder) {
        if (!enabled[m.id]) continue;
        drawMediumPolygon(m, highlightActive);
    }
}

function drawMediumPolygon(m, highlightActive) {
    const isHi = highlighted.has(m.id);
    const dim = highlightActive && !isHi;

    const pts = [];
    for (let i = 0; i < 4; i++) {
        const v = m[AXES[i].key];
        const t = v / 5;
        const ang = AXIS_ANGLES[i];
        const px = radarCx + Math.cos(ang) * radarR * t;
        const py = radarCy + Math.sin(ang) * radarR * t;
        pts.push({ x: px, y: py });
    }

    push();
    const alpha = dim ? 30 : (isHi ? 110 : 80);
    fill(m.color[0], m.color[1], m.color[2], alpha);
    stroke(m.color[0], m.color[1], m.color[2], dim ? 100 : 230);
    strokeWeight(isHi ? 3 : 1.5);
    beginShape();
    for (const p of pts) vertex(p.x, p.y);
    endShape(CLOSE);
    pop();

    // Vertex dots + hover detection
    for (let i = 0; i < 4; i++) {
        const p = pts[i];
        const v = m[AXES[i].key];
        const note = m[AXES[i].noteKey];
        const dx = mouseX - p.x, dy = mouseY - p.y;
        const hit = Math.sqrt(dx * dx + dy * dy) < 6;

        push();
        noStroke();
        fill(m.color[0], m.color[1], m.color[2], dim ? 120 : 255);
        circle(p.x, p.y, hit ? 9 : 5);
        pop();

        if (hit) {
            hoverVertex = {
                medium: m,
                axisIdx: i,
                x: p.x,
                y: p.y,
                score: v,
                note: note
            };
        }
    }
}

function drawTooltip(hv) {
    const lines = [
        hv.medium.name + ' — ' + AXES[hv.axisIdx].label,
        'Score: ' + hv.score + ' / 5',
        hv.note
    ];
    push();
    textSize(11);
    textFont('Segoe UI');
    let maxW = 0;
    for (const l of lines) maxW = Math.max(maxW, textWidth(l));
    const padX = 8, padY = 6;
    const w = Math.min(maxW + padX * 2, 280);
    const lineH = 14;
    const h = lineH * lines.length + padY * 2;

    let tx = hv.x + 10;
    let ty = hv.y + 10;
    if (tx + w > canvasWidth - 4) tx = hv.x - w - 10;
    if (ty + h > drawHeight - 4) ty = hv.y - h - 10;

    noStroke();
    fill(33, 37, 41, 235);
    rect(tx, ty, w, h, 4);
    fill(255);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(lines[0], tx + padX, ty + padY, w - padX * 2);
    textStyle(NORMAL);
    text(lines[1], tx + padX, ty + padY + lineH, w - padX * 2);
    fill(220);
    text(lines[2], tx + padX, ty + padY + lineH * 2, w - padX * 2);
    pop();
}

function drawLegendRow() {
    // Below the radar, above the controls (reserve room for wrapped 2nd row)
    const y = drawHeight - 60;
    const x0 = leftPanelW + 8;
    const w = centerW - 16;

    push();
    fill(33);
    noStroke();
    textStyle(BOLD);
    textSize(11);
    textAlign(LEFT, CENTER);
    text('Click a name for details →', x0, y - 16);
    pop();

    // Layout legend chips in a row (wrap if needed)
    const chipH = 22;
    let cx = x0;
    let cy = y;
    push();
    textSize(11);
    textStyle(NORMAL);
    for (const m of MEDIA) {
        const labelW = textWidth(m.name);
        const chipW = labelW + 26;
        if (cx + chipW > x0 + w) {
            cx = x0;
            cy += chipH + 4;
        }
        const hovered = mouseX >= cx && mouseX <= cx + chipW && mouseY >= cy && mouseY <= cy + chipH;
        // background
        noStroke();
        if (detailMedium && detailMedium.id === m.id) {
            fill(m.color[0], m.color[1], m.color[2], 200);
        } else {
            fill(255);
        }
        stroke(m.color[0], m.color[1], m.color[2]);
        strokeWeight(hovered ? 2 : 1);
        rect(cx, cy, chipW, chipH, 4);
        // swatch
        noStroke();
        fill(m.color[0], m.color[1], m.color[2]);
        rect(cx + 5, cy + 5, 12, 12, 2);
        // label
        fill(detailMedium && detailMedium.id === m.id ? 255 : 33);
        textAlign(LEFT, CENTER);
        text(m.name, cx + 22, cy + chipH / 2);
        // store layout for click detection
        m._chipBox = { x: cx, y: cy, w: chipW, h: chipH };
        cx += chipW + 6;
    }
    pop();
}

function drawRightPanel() {
    const x = canvasWidth - rightPanelW + 6;
    const y = 50;
    const w = rightPanelW - 12;
    const h = drawHeight - 60;

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
    if (!detailMedium) {
        fill(108, 117, 125);
        noStroke();
        textSize(11);
        text('Click a medium name below the chart to see details.', x + 10, y + 10, w - 20);
    } else {
        const m = detailMedium;
        // Header swatch
        noStroke();
        fill(m.color[0], m.color[1], m.color[2]);
        rect(x + 10, y + 10, 14, 14, 2);
        fill(33);
        textStyle(BOLD);
        textSize(13);
        text(m.name, x + 30, y + 10);

        let ty = y + 34;
        const lineH = 13;
        const wrapW = w - 20;

        textStyle(BOLD);
        textSize(10);
        fill(46, 125, 50);
        text('Properties', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        text(m.fullProps, x + 10, ty, wrapW);
        ty += textHeightFor(m.fullProps, wrapW, 10) + 6;

        textStyle(BOLD);
        fill(46, 125, 50);
        text('Scores', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        for (const ax of AXES) {
            text('• ' + ax.short + ': ' + m[ax.key] + '/5', x + 10, ty);
            ty += lineH;
        }
        ty += 4;

        textStyle(BOLD);
        fill(46, 125, 50);
        text('Prep steps', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        for (const s of m.prepSteps) {
            const wrapped = '• ' + s;
            text(wrapped, x + 10, ty, wrapW);
            ty += textHeightFor(wrapped, wrapW, 10) + 2;
        }
        ty += 4;

        textStyle(BOLD);
        fill(46, 125, 50);
        text('Sterilization', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        text(m.sterilization, x + 10, ty, wrapW);
        ty += textHeightFor(m.sterilization, wrapW, 10) + 6;

        textStyle(BOLD);
        fill(46, 125, 50);
        text('Cost per cycle', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        text(m.costPerCycle, x + 10, ty, wrapW);
        ty += lineH + 6;

        textStyle(BOLD);
        fill(0, 188, 212);
        text('Best systems', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        text(m.bestSystems.join(', '), x + 10, ty, wrapW);
        ty += lineH + 4;

        textStyle(BOLD);
        fill(0, 188, 212);
        text('Best crops', x + 10, ty); ty += lineH;
        textStyle(NORMAL);
        fill(33);
        text(m.bestCrops.join(', '), x + 10, ty, wrapW);
    }
    pop();
}

function textHeightFor(str, w, sz) {
    // Approximate wrapped text height
    push();
    textSize(sz);
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
    text('Tip: Use filters on the left to highlight the top media for a specific system or crop. Hover a polygon corner for details.',
         110, drawHeight + 18, canvasWidth - 130);
    pop();
}

function mousePressed() {
    // Legend chip clicks
    for (const m of MEDIA) {
        const b = m._chipBox;
        if (!b) continue;
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
            detailMedium = (detailMedium && detailMedium.id === m.id) ? null : m;
            return;
        }
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}
