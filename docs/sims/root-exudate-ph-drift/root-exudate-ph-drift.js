// Root Exudate pH Drift Simulator - p5.js parameter exploration
// CANVAS_HEIGHT: 580
let canvasWidth = 760;
let drawHeight = 440;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;

let nitratePct = 70;     // % nitrate (rest is ammonium)
let plantMass = 200;     // grams fresh weight
let reservoirVol = 8;    // liters
let showCorrections = true;

let phSeries = [];       // 14 daily values
let corrections = [];    // {day, oldPh, newPh}

let nitrateSlider, biomassSlider, volumeSlider;
let nitrateLabel, biomassLabel, volumeLabel;
let simulateBtn, resetBtn, correctionToggle;
let hoverDay = -1;

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    nitrateSlider = createSlider(0, 100, nitratePct, 5);
    nitrateSlider.position(width * 0.55, 60);
    nitrateSlider.style('width', '160px');
    nitrateSlider.input(() => { nitratePct = nitrateSlider.value(); runSim(); });

    biomassSlider = createSlider(50, 500, plantMass, 25);
    biomassSlider.position(width * 0.55, 130);
    biomassSlider.style('width', '160px');
    biomassSlider.input(() => { plantMass = biomassSlider.value(); runSim(); });

    volumeSlider = createSlider(2, 20, reservoirVol, 1);
    volumeSlider.position(width * 0.55, 200);
    volumeSlider.style('width', '160px');
    volumeSlider.input(() => { reservoirVol = volumeSlider.value(); runSim(); });

    simulateBtn = createButton('Re-simulate 14 Days');
    simulateBtn.position(10, drawHeight + 10);
    simulateBtn.mousePressed(runSim);

    resetBtn = createButton('Reset');
    resetBtn.position(155, drawHeight + 10);
    resetBtn.mousePressed(() => {
        nitratePct = 70; plantMass = 200; reservoirVol = 8; showCorrections = true;
        nitrateSlider.value(nitratePct); biomassSlider.value(plantMass); volumeSlider.value(reservoirVol);
        correctionToggle.html('Corrections: ON');
        runSim();
    });

    correctionToggle = createButton('Corrections: ON');
    correctionToggle.position(220, drawHeight + 10);
    correctionToggle.mousePressed(() => {
        showCorrections = !showCorrections;
        correctionToggle.html('Corrections: ' + (showCorrections ? 'ON' : 'OFF'));
        runSim();
    });

    runSim();
}

function runSim() {
    phSeries = [];
    corrections = [];
    let ph = 6.0;
    // Drift formula:
    //   - mostly nitrate uptake → root pumps out OH⁻/HCO₃⁻ → pH RISES
    //   - mostly ammonium uptake → root pumps out H⁺ → pH FALLS
    //   - magnitude scales with plantMass / reservoirVol
    const intensity = plantMass / reservoirVol / 100; // 0.025 (50/20) to 2.5 (500/2)
    const direction = (nitratePct - 50) / 50; // -1 (all NH4) to +1 (all NO3)
    // daily delta in pH units
    const dailyDelta = direction * intensity * 0.35;

    for (let d = 0; d < 14; d++) {
        // small noise
        const noise = (Math.random() - 0.5) * 0.05;
        ph += dailyDelta + noise;
        // dose correction if pH escapes range
        if (showCorrections && (ph > 6.5 || ph < 5.5)) {
            const old = ph;
            ph = 6.0;
            corrections.push({ day: d, oldPh: old, newPh: ph });
        }
        ph = constrain(ph, 3.5, 9.5);
        phSeries.push(ph);
    }
}

function draw() {
    background(248, 249, 250);

    push();
    fill(46, 125, 50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Reservoir pH Drift Over 14 Days', 10, 8);
    pop();

    drawChart();
    drawControlPanel();
    drawControlsBackground();
    drawFooter();
}

function drawChart() {
    const cx = 10, cy = 30;
    const cw = width * 0.52;
    const ch = drawHeight - cy - 10;

    push();
    fill(255);
    stroke(222, 226, 230);
    rect(cx, cy, cw, ch, 4);

    // Y-axis: pH 4.0 to 8.0
    const yMin = 4.0, yMax = 8.0;
    const plotX = cx + 35, plotW = cw - 45;
    const plotY = cy + 15, plotH = ch - 40;
    function py(ph) { return plotY + plotH * (1 - (ph - yMin) / (yMax - yMin)); }
    function px(day) { return plotX + plotW * (day / 13); }

    // Optimal band (5.5 to 6.5)
    noStroke();
    fill(165, 214, 167, 100);
    rect(plotX, py(6.5), plotW, py(5.5) - py(6.5));

    // gridlines
    stroke(222, 226, 230);
    strokeWeight(1);
    for (let v = yMin; v <= yMax; v += 0.5) {
        line(plotX, py(v), plotX + plotW, py(v));
        noStroke();
        fill(108, 117, 125);
        textSize(9);
        textAlign(RIGHT, CENTER);
        text(v.toFixed(1), plotX - 3, py(v));
        stroke(222, 226, 230);
    }

    // x-axis labels
    noStroke();
    fill(108, 117, 125);
    textSize(9);
    textAlign(CENTER, TOP);
    for (let d = 0; d < 14; d += 2) {
        text('D' + (d + 1), px(d), plotY + plotH + 4);
    }

    // pH series line, color-coded per segment
    strokeWeight(2.5);
    noFill();
    for (let i = 1; i < phSeries.length; i++) {
        const v1 = phSeries[i - 1], v2 = phSeries[i];
        const inRange = v1 >= 5.5 && v1 <= 6.5 && v2 >= 5.5 && v2 <= 6.5;
        stroke(inRange ? color(0, 121, 107) : color(229, 57, 53));
        line(px(i - 1), py(v1), px(i), py(v2));
    }

    // Data points
    noStroke();
    for (let i = 0; i < phSeries.length; i++) {
        const inRange = phSeries[i] >= 5.5 && phSeries[i] <= 6.5;
        fill(inRange ? color(0, 121, 107) : color(229, 57, 53));
        circle(px(i), py(phSeries[i]), 5);
    }

    // Correction events
    if (showCorrections) {
        for (const c of corrections) {
            push();
            stroke(255, 152, 0);
            strokeWeight(2);
            drawingContext.setLineDash([4, 3]);
            line(px(c.day), py(c.oldPh), px(c.day), py(c.newPh));
            drawingContext.setLineDash([]);
            noStroke();
            fill(255, 152, 0);
            circle(px(c.day), py(c.newPh), 6);
            pop();
        }
    }

    // Hover marker
    if (mouseX >= plotX && mouseX <= plotX + plotW && mouseY >= plotY && mouseY <= plotY + plotH) {
        hoverDay = Math.round(((mouseX - plotX) / plotW) * 13);
        hoverDay = constrain(hoverDay, 0, 13);
        stroke(33);
        strokeWeight(1);
        line(px(hoverDay), plotY, px(hoverDay), plotY + plotH);
        const ph = phSeries[hoverDay];
        noStroke();
        fill(33);
        textSize(11);
        textStyle(BOLD);
        textAlign(LEFT, BOTTOM);
        text('Day ' + (hoverDay + 1) + ': pH ' + ph.toFixed(2), px(hoverDay) + 4, py(ph) - 4);
        textStyle(NORMAL);
    } else {
        hoverDay = -1;
    }

    // Title
    fill(33);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('pH over 14 days (optimal 5.5–6.5)', cx + 8, cy + 2);
    pop();
}

function drawControlPanel() {
    const px0 = width * 0.55;
    const py0 = 30;
    const pw = width - px0 - 10;
    push();
    fill(255);
    stroke(222, 226, 230);
    rect(px0, py0, pw, drawHeight - py0 - 10, 4);

    fill(46, 125, 50);
    noStroke();
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Controls', px0 + 8, py0 + 6);

    fill(33);
    textSize(11);
    textStyle(NORMAL);
    // Nitrate slider label
    const nh4 = 100 - nitratePct;
    text('Nitrate / Ammonium ratio: ' + nitratePct + ' / ' + nh4 + ' %', px0 + 8, py0 + 30);
    // Plant biomass label
    text('Plant biomass (fresh wt): ' + plantMass + ' g', px0 + 8, py0 + 100);
    // Reservoir volume label
    text('Reservoir volume: ' + reservoirVol + ' L', px0 + 8, py0 + 170);

    // Summary box
    const summaryY = py0 + 230;
    fill(241, 243, 245);
    rect(px0 + 8, summaryY, pw - 16, drawHeight - summaryY - 20, 4);

    fill(0, 121, 107);
    textStyle(BOLD);
    text('Results', px0 + 16, summaryY + 6);
    fill(33);
    textStyle(NORMAL);
    textSize(10);

    const finalPh = phSeries[phSeries.length - 1];
    const outOfRange = phSeries.filter(p => p < 5.5 || p > 6.5).length;
    const direction = (nitratePct - 50) / 50;
    const trend = direction > 0.05 ? 'rising (alkaline)' : direction < -0.05 ? 'falling (acidic)' : 'stable';

    let y = summaryY + 24;
    text('Final pH: ' + finalPh.toFixed(2), px0 + 16, y); y += 14;
    text('Days out of range: ' + outOfRange + ' / 14', px0 + 16, y); y += 14;
    text('Drift direction: ' + trend, px0 + 16, y); y += 14;
    text('Corrections needed: ' + corrections.length, px0 + 16, y);

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

function drawFooter() {
    push();
    fill(33);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    let msg = 'Increase ammonium (lower nitrate %) to push pH DOWN. Smaller reservoirs drift faster. Big plants exhaust buffering quickly.';
    if (nitratePct > 75) msg = 'Mostly nitrate uptake: root releases OH⁻/HCO₃⁻ — reservoir trends ALKALINE. Expect to dose pH-Down.';
    else if (nitratePct < 25) msg = 'Mostly ammonium uptake: root releases H⁺ — reservoir trends ACIDIC. Expect to dose pH-Up.';
    else msg = 'Balanced N source: drift is slower in either direction. Volume and biomass still set how fast change accumulates.';
    text(msg, 10, drawHeight + 50, width - 20);
    pop();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    nitrateSlider.position(width * 0.55, 60);
    biomassSlider.position(width * 0.55, 130);
    volumeSlider.position(width * 0.55, 200);
}
