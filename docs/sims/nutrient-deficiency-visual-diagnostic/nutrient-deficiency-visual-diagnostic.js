// Nutrient Deficiency Visual Diagnostic - p5.js + HTML controls
// CANVAS_HEIGHT: 580
const deficiencies = [
    { id: 'N', name: 'Nitrogen (N)', mobile: 'Mobile', age: 'old',
      patterns: ['uniform'],
      ppm: '150–200 ppm', ph: 'Lockout below pH 5.5',
      action: 'Increase nitrate (KNO₃ or Ca(NO₃)₂). Verify EC and pH first.' },
    { id: 'K', name: 'Potassium (K)', mobile: 'Mobile', age: 'old',
      patterns: ['edges'],
      ppm: '200–300 ppm', ph: 'Lockout above pH 7.0 or with excess Ca/Mg',
      action: 'Add K₂SO₄ or KNO₃. Re-balance Ca:Mg:K ratio.' },
    { id: 'P', name: 'Phosphorus (P)', mobile: 'Mobile', age: 'old',
      patterns: ['purple'],
      ppm: '30–50 ppm', ph: 'Lockout below pH 5.5 or above 7.5; cold roots aggravate',
      action: 'Add monopotassium phosphate. Warm reservoir if below 18°C.' },
    { id: 'Mg', name: 'Magnesium (Mg)', mobile: 'Mobile', age: 'old',
      patterns: ['interveinal'],
      ppm: '50–70 ppm', ph: 'Lockout above pH 7.5; competes with excess K',
      action: 'Add Epsom salt (MgSO₄·7H₂O) at ~0.5 g/L. Recheck pH.' },
    { id: 'Ca', name: 'Calcium (Ca)', mobile: 'Immobile', age: 'new',
      patterns: ['tipBurn', 'edges'],
      ppm: '150–200 ppm', ph: 'Lockout below pH 5.5; competes with high K or NH₄⁺',
      action: 'Use calcium nitrate; increase humidity to slow transpiration. Verify VPD.' },
    { id: 'Fe', name: 'Iron (Fe)', mobile: 'Immobile', age: 'new',
      patterns: ['interveinal', 'uniform'],
      ppm: '2–5 ppm chelated', ph: 'Lockout above pH 6.5 in most chelates',
      action: 'Add Fe-EDDHA or Fe-DTPA. Drop reservoir pH to 5.8.' },
    { id: 'S', name: 'Sulfur (S)', mobile: 'Immobile', age: 'new',
      patterns: ['uniform'],
      ppm: '60–100 ppm', ph: 'Rarely locked out in hydroponics',
      action: 'Add MgSO₄ or K₂SO₄ — increases both Mg/K and S.' },
    { id: 'B', name: 'Boron (B)', mobile: 'Immobile', age: 'new',
      patterns: ['tipBurn', 'twisted'],
      ppm: '0.3–0.5 ppm', ph: 'Toxicity risk above 1 ppm — dose carefully',
      action: 'Add a trace mix containing boron. Verify EC stays in range.' },
    { id: 'Zn', name: 'Zinc (Zn)', mobile: 'Immobile', age: 'new',
      patterns: ['interveinal', 'twisted'],
      ppm: '0.05–0.10 ppm', ph: 'Lockout above pH 7.0',
      action: 'Add chelated zinc from a trace blend.' },
    { id: 'Mn', name: 'Manganese (Mn)', mobile: 'Immobile', age: 'new',
      patterns: ['interveinal'],
      ppm: '0.5–1.0 ppm', ph: 'Lockout above pH 6.8',
      action: 'Add chelated manganese. Drop reservoir pH to 5.8 if elevated.' }
];

let selectedPatterns = new Set();
let leafAge = 'old';
let expandedDef = null;
let cycleIndex = -1;
let hoverRegion = '';
let containerWidth;
let canvasHeight = 320;

const sampleScenarios = deficiencies.map(d => ({ id: d.id, patterns: d.patterns, age: d.age, name: d.name }));

function updateCanvasSize() {
    const host = document.querySelector('#leafCanvasHost main');
    containerWidth = Math.min(host.parentElement.offsetWidth - 20, 360);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('#leafCanvasHost main'));
    wireControls();
    rebuildDiagnosis();
}

function wireControls() {
    document.querySelectorAll('input[name="age"]').forEach(inp => {
        inp.addEventListener('change', (e) => {
            leafAge = e.target.value;
            document.getElementById('oldLeafToggle').checked = (leafAge === 'old');
            rebuildDiagnosis();
        });
    });
    document.querySelectorAll('input[data-pattern]').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const p = e.target.dataset.pattern;
            if (e.target.checked) selectedPatterns.add(p);
            else selectedPatterns.delete(p);
            rebuildDiagnosis();
        });
    });
    document.getElementById('oldLeafToggle').addEventListener('change', (e) => {
        leafAge = e.target.checked ? 'old' : 'new';
        const r = document.querySelector('input[name="age"][value="' + (e.target.checked ? 'old' : 'new') + '"]');
        if (r) r.checked = true;
        rebuildDiagnosis();
    });
    document.getElementById('cycleBtn').addEventListener('click', () => {
        cycleIndex = (cycleIndex + 1) % sampleScenarios.length;
        const sc = sampleScenarios[cycleIndex];
        // Apply scenario to UI
        selectedPatterns = new Set(sc.patterns);
        leafAge = sc.age;
        document.querySelectorAll('input[data-pattern]').forEach(inp => {
            inp.checked = sc.patterns.includes(inp.dataset.pattern);
        });
        document.querySelector('input[name="age"][value="' + sc.age + '"]').checked = true;
        document.getElementById('oldLeafToggle').checked = (sc.age === 'old');
        document.getElementById('cycleBtn').textContent = 'Showing: ' + sc.name + ' →';
        rebuildDiagnosis();
    });
    document.getElementById('resetBtn').addEventListener('click', () => {
        selectedPatterns.clear();
        leafAge = 'old';
        cycleIndex = -1;
        expandedDef = null;
        document.querySelectorAll('input[data-pattern]').forEach(inp => inp.checked = false);
        document.querySelector('input[name="age"][value="old"]').checked = true;
        document.getElementById('oldLeafToggle').checked = true;
        document.getElementById('cycleBtn').textContent = 'Show All Patterns →';
        rebuildDiagnosis();
    });
}

function scoreDeficiency(def) {
    let score = 0;
    // pattern matches
    for (const p of def.patterns) {
        if (selectedPatterns.has(p)) score += 2;
    }
    // age match
    if (leafAge === def.age) score += 2;
    else if (leafAge === 'both') score += 1;
    // penalize unselected expected patterns if user selected unrelated patterns
    let unmatched = 0;
    for (const p of selectedPatterns) {
        if (!def.patterns.includes(p)) unmatched += 1;
    }
    score -= unmatched * 0.5;
    return score;
}

function rebuildDiagnosis() {
    const container = document.getElementById('diagnosis');
    container.innerHTML = '';
    if (selectedPatterns.size === 0) {
        container.innerHTML = '<div class="legend">Select one or more symptoms on the left to see probable deficiencies. The list is ranked by symptom match and leaf-age mobility rule.</div>';
        return;
    }
    const scored = deficiencies.map(d => ({ d, s: scoreDeficiency(d) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 5);
    if (scored.length === 0) {
        container.innerHTML = '<div class="legend">No strong matches. Try a different combination of leaf age and pattern.</div>';
        return;
    }
    const maxScore = scored[0].s;
    for (const { d, s } of scored) {
        const tier = s >= maxScore * 0.8 ? '' : s >= maxScore * 0.5 ? 'low' : 'weak';
        const item = document.createElement('div');
        item.className = 'diagnosis-item ' + tier + (expandedDef === d.id ? ' expanded' : '');
        let html = '<h3>' + d.name + ' <span style="font-weight:normal; color:#6c757d">(' + d.mobile + ')</span></h3>';
        html += '<div style="font-size:11px; color:#495057">Match score: ' + s.toFixed(1) + '</div>';
        if (expandedDef === d.id) {
            html += '<div class="meta">';
            html += '<b>Typical level:</b> ' + d.ppm + '<br>';
            html += '<b>pH lockout:</b> ' + d.ph + '<br>';
            html += '<b>Corrective action:</b> ' + d.action;
            html += '</div>';
        }
        item.addEventListener('click', () => {
            expandedDef = (expandedDef === d.id) ? null : d.id;
            rebuildDiagnosis();
        });
        item.innerHTML = html;
        container.appendChild(item);
    }
}

function draw() {
    background(255);
    drawLeaf();
    drawHoverInfo();
}

function drawLeaf() {
    const cx = width / 2;
    const cy = canvasHeight / 2;
    const leafW = Math.min(width * 0.85, 290);
    const leafH = leafW * 0.6;

    // Leaf body
    push();
    fill(165, 214, 167);
    stroke(46, 125, 50);
    strokeWeight(2);
    beginShape();
    vertex(cx - leafW / 2, cy);
    bezierVertex(cx - leafW / 2.5, cy - leafH / 1.4, cx + leafW / 2.5, cy - leafH / 1.4, cx + leafW / 2, cy);
    bezierVertex(cx + leafW / 2.5, cy + leafH / 1.4, cx - leafW / 2.5, cy + leafH / 1.4, cx - leafW / 2, cy);
    endShape(CLOSE);

    // Main vein
    stroke(56, 142, 60);
    strokeWeight(2);
    line(cx - leafW / 2, cy, cx + leafW / 2, cy);
    // Side veins
    strokeWeight(1);
    for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        const xx = cx + i * leafW / 8;
        const dirY = i < 0 ? -1 : 1;
        const yOff = leafH / 2.5 * (1 - Math.abs(i) / 4);
        line(xx, cy, xx + leafW / 12, cy + dirY * yOff);
        line(xx, cy, xx + leafW / 12, cy - dirY * yOff);
    }

    // Overlay zones based on selected patterns
    noStroke();
    if (selectedPatterns.has('interveinal')) {
        // Yellow between veins
        fill(255, 235, 59, 180);
        for (let i = -3; i <= 3; i++) {
            if (i === 0) continue;
            const xx = cx + i * leafW / 8 + leafW / 24;
            ellipse(xx, cy - leafH / 4, leafW / 12, leafH / 6);
            ellipse(xx, cy + leafH / 4, leafW / 12, leafH / 6);
        }
    }
    if (selectedPatterns.has('uniform')) {
        fill(255, 235, 59, 140);
        beginShape();
        vertex(cx - leafW / 2 + 6, cy);
        bezierVertex(cx - leafW / 2.5, cy - leafH / 1.6, cx + leafW / 2.5, cy - leafH / 1.6, cx + leafW / 2 - 6, cy);
        bezierVertex(cx + leafW / 2.5, cy + leafH / 1.6, cx - leafW / 2.5, cy + leafH / 1.6, cx - leafW / 2 + 6, cy);
        endShape(CLOSE);
    }
    if (selectedPatterns.has('edges')) {
        // Brown edges
        noFill();
        stroke(121, 85, 72);
        strokeWeight(6);
        beginShape();
        vertex(cx - leafW / 2, cy);
        bezierVertex(cx - leafW / 2.5, cy - leafH / 1.4, cx + leafW / 2.5, cy - leafH / 1.4, cx + leafW / 2, cy);
        bezierVertex(cx + leafW / 2.5, cy + leafH / 1.4, cx - leafW / 2.5, cy + leafH / 1.4, cx - leafW / 2, cy);
        endShape(CLOSE);
        noStroke();
    }
    if (selectedPatterns.has('purple')) {
        // Purple discoloration on underside (we'll draw as patches on lower half)
        fill(123, 31, 162, 130);
        for (let i = 0; i < 6; i++) {
            const xx = cx - leafW / 3 + i * leafW / 8;
            const yy = cy + leafH / 5;
            ellipse(xx, yy, leafW / 10, leafH / 7);
        }
    }
    if (selectedPatterns.has('tipBurn')) {
        // Brown tip / growing tip
        fill(121, 85, 72);
        ellipse(cx + leafW / 2 - 6, cy, leafW / 8, leafH / 4);
        // White inner highlight to suggest necrosis
        fill(245, 222, 179);
        ellipse(cx + leafW / 2 - 12, cy, leafW / 12, leafH / 6);
    }
    if (selectedPatterns.has('twisted')) {
        // Distorted growth — draw a few wavy strokes
        stroke(46, 125, 50);
        strokeWeight(2);
        noFill();
        for (let i = 0; i < 3; i++) {
            const xx = cx + leafW / 4 + i * 8;
            beginShape();
            for (let t = 0; t < 1; t += 0.05) {
                const yy = cy - leafH / 4 + t * leafH / 2 + Math.sin(t * 12) * 6;
                vertex(xx, yy);
            }
            endShape();
        }
    }
    pop();

    // Leaf age label
    push();
    fill(33);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text((leafAge === 'old' ? 'OLD (lower) leaf' : leafAge === 'new' ? 'NEW (upper) leaf' : 'Whole plant') + ' view',
         cx, cy + leafH / 2 + 12);
    pop();
}

function drawHoverInfo() {
    // Determine which region the mouse is over (margin / interveinal / tip / midrib)
    const cx = width / 2, cy = canvasHeight / 2;
    const leafW = Math.min(width * 0.85, 290);
    const leafH = leafW * 0.6;
    const dx = mouseX - cx, dy = mouseY - cy;
    let region = '';
    if (mouseX >= cx - leafW / 2 && mouseX <= cx + leafW / 2 &&
        Math.abs(dy) < leafH / 2) {
        if (mouseX > cx + leafW / 3) region = 'Tip → Ca, B (immobile, accumulate in growing edges)';
        else if (Math.abs(dy) > leafH / 3) region = 'Margin → K deficiency causes edge burn first';
        else if (Math.abs(dy) > 8) region = 'Interveinal → Mg, Fe, Mn, Zn — yellow stripes between green veins';
        else region = 'Midrib → vascular tissue, less symptom expression';
    }
    if (region) {
        document.getElementById('hoverTip').textContent = region;
    } else {
        document.getElementById('hoverTip').textContent = 'Hover over the leaf for region-specific tips. Selected symptoms are overlaid on the leaf shape.';
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
}
