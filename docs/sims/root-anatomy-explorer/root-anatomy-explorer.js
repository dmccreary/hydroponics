// Root Anatomy Explorer - p5.js dual-view clickable diagram
// CANVAS_HEIGHT: 620
let canvasWidth = 760;
let drawHeight = 440;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;

let selectedTissue = null;
let showPathway = false;
let pathwayBtn, resetBtn;
let pathwayPhase = 0;

const tissues = {
    cap: {
        name: 'Root cap',
        cells: 'Layers of loose parenchyma cells continuously shed and replaced.',
        function: 'Mechanically protects the meristem as the root pushes through media. Secretes mucilage that lubricates the tip and supports microbial life around the rhizosphere.',
        damage: 'If the cap is torn off, the meristem behind it is exposed and root tip growth stalls until a new cap regenerates.'
    },
    meristem: {
        name: 'Meristematic zone',
        cells: 'Small, tightly packed, undifferentiated cells dividing rapidly.',
        function: 'Source of all new cells for the growing root. Cells produced here will mature into every other zone behind the tip.',
        damage: 'Damage to the meristem halts root elongation entirely. Heat, hypoxia, or chemical injury here ends the life of that root.'
    },
    elongation: {
        name: 'Zone of elongation',
        cells: 'Recently divided cells that are stretching axially as their vacuoles expand.',
        function: 'Pushes the root tip forward by lengthening cells, not by adding new ones.',
        damage: 'If turgor collapses (water stress) elongation stops within minutes. This is why new transplants stall in dry media.'
    },
    differentiation: {
        name: 'Zone of differentiation',
        cells: 'Epidermis with root-hair projections; cortex; endodermis with Casparian strip; pericycle; xylem and phloem.',
        function: 'The active absorption zone. Root hairs greatly increase surface area for water and ion uptake. The Casparian strip forces all ions to pass through cell membranes, enforcing selectivity.',
        damage: 'Damaged root hairs sharply reduce uptake. A broken Casparian strip would let ions bypass selective transport and reach the xylem unchecked.'
    },
    suberized: {
        name: 'Older suberized root',
        cells: 'Cells whose walls are coated in suberin (a waxy waterproof barrier).',
        function: 'Provides mechanical strength and pathogen resistance. Mostly transports water; absorption rate is low here.',
        damage: 'Mostly resistant. Older roots tolerate brief stress but cannot replace lost root hairs — that\'s the job of the differentiation zone.'
    },
    epidermis: {
        name: 'Epidermis (with root hair)',
        cells: 'Outermost single layer of cells; some extend long tubular root hair projections.',
        function: 'First contact with the nutrient solution. Root hairs increase surface area 10–20×.',
        damage: 'Root hairs are fragile and snap when transplants are mishandled. Loss of hairs roughly halves uptake until they regrow.'
    },
    cortex: {
        name: 'Cortex',
        cells: 'Multiple layers of loosely packed parenchyma cells with air spaces between them.',
        function: 'Stores starch and lets water and ions move toward the endodermis. The intercellular air spaces (aerenchyma) are how O₂ reaches inner tissues.',
        damage: 'Hypoxia destroys cortical cells first — this is the visible browning of oxygen-starved roots.'
    },
    endodermis: {
        name: 'Endodermis with Casparian strip',
        cells: 'Single layer of cells with a waterproof suberin band (the Casparian strip) sealing their radial walls.',
        function: 'Forces every ion into the symplast — through a cell membrane — before it can reach the xylem. This is the selectivity checkpoint.',
        damage: 'A broken Casparian strip eliminates ion selectivity. The plant can then absorb harmful ions it should have excluded.'
    },
    pericycle: {
        name: 'Pericycle',
        cells: 'Thin meristematic layer just inside the endodermis.',
        function: 'Origin of lateral root branches. Each new lateral root erupts outward from the pericycle.',
        damage: 'If the pericycle is killed, the root can no longer branch. Architecture stays linear instead of tree-like.'
    },
    xylem: {
        name: 'Xylem vessels',
        cells: 'Hollow dead conduits with thick lignified walls, arranged in a star pattern.',
        function: 'Carries water and dissolved minerals UPWARD from roots to shoots, powered by transpirational pull.',
        damage: 'Air embolism or pathogen plugging blocks flow; whole branches above wilt.'
    },
    phloem: {
        name: 'Phloem',
        cells: 'Living sieve tubes with companion cells, between the xylem arms.',
        function: 'Carries sugars DOWNWARD from leaves to roots, fueling respiration and root growth.',
        damage: 'Blocked phloem starves the roots even when leaves are healthy.'
    }
};

let zones = [];

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    pathwayBtn = createButton('Show Ion Pathway');
    pathwayBtn.position(10, drawHeight + 10);
    pathwayBtn.mousePressed(() => {
        showPathway = !showPathway;
        pathwayBtn.html(showPathway ? 'Hide Ion Pathway' : 'Show Ion Pathway');
    });

    resetBtn = createButton('Clear Selection');
    resetBtn.position(155, drawHeight + 10);
    resetBtn.mousePressed(() => { selectedTissue = null; });

    defineZones();
}

function defineZones() {
    // Longitudinal view (left 60%): zones along the y-axis from top (mature root) to bottom (tip)
    // We will rescale at draw time using sx/sy from a 760x440 logical frame.
    zones = [
        // Longitudinal view zones
        { view: 'long', id: 'suberized', x: 80, y: 50, w: 320, h: 70 },
        { view: 'long', id: 'differentiation', x: 80, y: 130, w: 320, h: 100 },
        { view: 'long', id: 'elongation', x: 80, y: 240, w: 320, h: 70 },
        { view: 'long', id: 'meristem', x: 80, y: 320, w: 320, h: 50 },
        { view: 'long', id: 'cap', x: 80, y: 380, w: 320, h: 40 },
        // Cross-section view zones (right 40%): concentric circles
        // We use radial pick: click stored centrally
        { view: 'cross', id: 'epidermis' },
        { view: 'cross', id: 'cortex' },
        { view: 'cross', id: 'endodermis' },
        { view: 'cross', id: 'pericycle' },
        { view: 'cross', id: 'xylem' },
        { view: 'cross', id: 'phloem' }
    ];
}

function draw() {
    background(248, 249, 250);
    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Root Anatomy: Longitudinal + Cross-Section', 10, 8);
    pop();

    const sx = width / 760;
    const sy = drawHeight / 440;
    drawLongitudinal(sx, sy);
    drawCrossSection(sx, sy);

    drawControlsBackground();
    drawInfoPanel();

    if (showPathway) {
        pathwayPhase = (pathwayPhase + 0.01) % 1;
        drawIonPathway(sx, sy);
    }
}

function drawLongitudinal(sx, sy) {
    // Left view, vertical taper from suberized at top to root cap at bottom
    push();
    noStroke();
    // Suberized (light gray-brown)
    fill(189, 170, 154);
    rect(80 * sx, 50 * sy, 320 * sx, 70 * sy, 4);
    // Differentiation (teal with root hairs)
    fill(178, 223, 219);
    rect(80 * sx, 130 * sy, 320 * sx, 100 * sy, 4);
    // Casparian strip band inside differentiation
    fill(255, 152, 0);
    rect(170 * sx, 145 * sy, 140 * sx, 8 * sy);
    // Zone of elongation (lighter green)
    fill(200, 230, 201);
    rect(80 * sx, 240 * sy, 320 * sx, 70 * sy, 4);
    // Meristem (deep green)
    fill(56, 142, 60);
    rect(80 * sx, 320 * sy, 320 * sx, 50 * sy, 4);
    // Root cap (gray-brown rounded)
    fill(121, 85, 72);
    rect(80 * sx, 380 * sy, 320 * sx, 30 * sy, 12);

    // Root hairs in differentiation zone
    stroke(0, 121, 107);
    strokeWeight(1);
    for (let i = 0; i < 18; i++) {
        const xx = 85 * sx + i * 17 * sx;
        line(xx, 230 * sy, xx - 4, 240 * sy);
    }
    for (let i = 0; i < 18; i++) {
        const xx = 85 * sx + i * 17 * sx;
        line(xx, 130 * sy, xx - 4, 120 * sy);
    }
    pop();

    // Labels
    push();
    fill(33);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text('Older suberized root', 88 * sx, 85 * sy);
    text('Zone of differentiation', 88 * sx, 165 * sy);
    textStyle(NORMAL);
    textSize(9);
    fill(191, 102, 0);
    text('← Casparian strip', 315 * sx, 149 * sy);
    fill(33);
    textStyle(BOLD);
    textSize(11);
    text('Zone of elongation', 88 * sx, 275 * sy);
    fill(255);
    text('Meristem', 88 * sx, 345 * sy);
    text('Root cap', 88 * sx, 395 * sy);
    pop();

    // Highlight selected zone in longitudinal view
    if (selectedTissue) {
        const z = zones.find(z => z.view === 'long' && z.id === selectedTissue);
        if (z) {
            push();
            noFill();
            stroke(46, 125, 50);
            strokeWeight(3);
            rect(z.x * sx, z.y * sy, z.w * sx, z.h * sy, 4);
            pop();
        }
    }
}

function drawCrossSection(sx, sy) {
    // Right 40% panel
    const cx = 560 * sx;
    const cy = 220 * sy;
    const baseR = Math.min(width * 0.18, drawHeight * 0.35);

    push();
    // Title
    fill(46, 125, 50);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('Cross-Section (Differentiation Zone)', cx, 35 * sy);

    // Epidermis (outermost teal ring)
    fill(128, 222, 234);
    stroke(0, 121, 107);
    strokeWeight(1);
    circle(cx, cy, baseR * 2);
    // Cortex (light green)
    fill(200, 230, 201);
    circle(cx, cy, baseR * 1.7);
    // Endodermis (orange band)
    fill(255, 152, 0);
    circle(cx, cy, baseR * 1.1);
    // Pericycle (thin tan ring)
    fill(255, 224, 178);
    circle(cx, cy, baseR * 0.95);
    // Vascular cylinder (white background)
    fill(255);
    circle(cx, cy, baseR * 0.85);
    pop();

    // Xylem star (dark blue) — 4-arm star
    push();
    fill(13, 71, 161);
    noStroke();
    const arms = 4;
    for (let i = 0; i < arms; i++) {
        const a = i * TWO_PI / arms;
        const r1 = baseR * 0.4;
        const w = baseR * 0.15;
        push();
        translate(cx, cy);
        rotate(a);
        ellipse(0, r1 / 2, w, r1);
        pop();
    }
    // Central xylem disk
    circle(cx, cy, baseR * 0.25);
    pop();

    // Phloem (purple patches between xylem arms)
    push();
    fill(123, 31, 162);
    noStroke();
    for (let i = 0; i < arms; i++) {
        const a = (i + 0.5) * TWO_PI / arms;
        const r1 = baseR * 0.32;
        const x = cx + cos(a) * r1;
        const y = cy + sin(a) * r1;
        circle(x, y, baseR * 0.18);
    }
    pop();

    // Root hair extending from epidermis
    push();
    stroke(0, 121, 107);
    strokeWeight(2);
    line(cx + baseR, cy, cx + baseR * 1.7, cy - baseR * 0.3);
    fill(0, 121, 107);
    noStroke();
    textSize(9);
    textAlign(LEFT, BOTTOM);
    text('root hair', cx + baseR * 1.7, cy - baseR * 0.32);
    pop();

    // Labels with leader lines
    push();
    stroke(120);
    strokeWeight(1);
    fill(33);
    textSize(9);
    textAlign(LEFT, CENTER);
    noStroke();
    text('epidermis', cx + baseR + 10, cy + baseR * 0.85);
    text('cortex', cx + baseR + 10, cy + baseR * 0.55);
    fill(191, 102, 0);
    textStyle(BOLD);
    text('endodermis (Casparian)', cx + baseR + 10, cy + baseR * 0.25);
    textStyle(NORMAL);
    fill(33);
    text('pericycle', cx - baseR * 1.5, cy + baseR * 0.3);
    fill(13, 71, 161);
    text('xylem', cx - baseR * 1.5, cy);
    fill(123, 31, 162);
    text('phloem', cx - baseR * 1.5, cy - baseR * 0.3);
    pop();

    // Store cross-section state for picking
    window._crossCenter = { cx, cy, baseR };

    // Highlight selected cross-section tissue
    if (selectedTissue && window._crossCenter) {
        const tissueRadii = {
            epidermis: baseR,
            cortex: baseR * 0.85,
            endodermis: baseR * 0.55,
            pericycle: baseR * 0.475,
            xylem: baseR * 0.4,
            phloem: baseR * 0.4
        };
        if (tissueRadii[selectedTissue]) {
            push();
            noFill();
            stroke(46, 125, 50);
            strokeWeight(3);
            circle(cx, cy, tissueRadii[selectedTissue] * 2);
            pop();
        }
    }
}

function drawIonPathway(sx, sy) {
    // Animated dot moving solution → root hair → cortex → endodermis → xylem
    const cc = window._crossCenter;
    if (!cc) return;
    const startX = cc.cx + cc.baseR * 1.9;
    const startY = cc.cy - cc.baseR * 0.4;
    const endX = cc.cx;
    const endY = cc.cy;
    const x = lerp(startX, endX, pathwayPhase);
    const y = lerp(startY, endY, pathwayPhase);
    push();
    fill(255, 152, 0);
    stroke(191, 102, 0);
    strokeWeight(2);
    circle(x, y, 10);
    fill(33);
    noStroke();
    textSize(9);
    textStyle(BOLD);
    text('NO₃⁻', x + 8, y - 8);
    pop();
}

function drawControlsBackground() {
    push();
    noStroke();
    fill(241, 243, 245);
    rect(0, drawHeight, width, controlHeight);
    stroke(222, 226, 230);
    line(0, drawHeight, width, drawHeight);
    pop();
}

function drawInfoPanel() {
    const py = drawHeight + 50;
    const ph = controlHeight - 60;
    push();
    fill(255);
    rect(10, py, width - 20, ph, 4);
    stroke(222, 226, 230);
    noFill();
    rect(10, py, width - 20, ph, 4);

    fill(33);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    if (selectedTissue && tissues[selectedTissue]) {
        const t = tissues[selectedTissue];
        textStyle(BOLD);
        fill(46, 125, 50);
        textSize(12);
        text(t.name, 20, py + 8);
        textStyle(NORMAL);
        fill(33);
        textSize(11);
        text('Cell types: ' + t.cells, 20, py + 28, width - 40);
        text('Function: ' + t.function, 20, py + 56, width - 40);
        text('If damaged: ' + t.damage, 20, py + 90, width - 40);
    } else {
        fill(108, 117, 125);
        text('Click any zone on the longitudinal view (left) or the cross-section rings (right) to see what each tissue does and what happens if it is damaged.', 20, py + 8, width - 40);
    }
    pop();
}

function mousePressed() {
    if (mouseY > drawHeight) return;
    const sx = width / 760;
    const sy = drawHeight / 440;

    // Check longitudinal zones first
    for (const z of zones) {
        if (z.view !== 'long') continue;
        if (mouseX >= z.x * sx && mouseX <= (z.x + z.w) * sx &&
            mouseY >= z.y * sy && mouseY <= (z.y + z.h) * sy) {
            selectedTissue = z.id;
            return;
        }
    }
    // Cross-section picking
    const cc = window._crossCenter;
    if (cc) {
        const dx = mouseX - cc.cx;
        const dy = mouseY - cc.cy;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r <= cc.baseR) {
            // Determine which ring
            if (r < cc.baseR * 0.4) {
                // could be xylem (center) or phloem (between arms)
                const ang = Math.atan2(dy, dx);
                // Phloem patches are at offset angles (i + 0.5)
                // Simplify: if within central core circle r < baseR*0.125 → xylem disk
                if (r < cc.baseR * 0.2) selectedTissue = 'xylem';
                else {
                    // Roughly alternate; treat half the angular sectors as phloem
                    const sector = Math.floor((ang + TWO_PI) / (PI / 2)) % 2;
                    selectedTissue = sector === 0 ? 'xylem' : 'phloem';
                }
            } else if (r < cc.baseR * 0.475) selectedTissue = 'pericycle';
            else if (r < cc.baseR * 0.55) selectedTissue = 'endodermis';
            else if (r < cc.baseR * 0.85) selectedTissue = 'cortex';
            else selectedTissue = 'epidermis';
            return;
        }
    }
    selectedTissue = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
}
