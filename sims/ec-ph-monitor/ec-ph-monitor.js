// EC/pH Monitor — Chart.js
// CANVAS_HEIGHT: 720

const EC_MIN = 1.2, EC_MAX = 2.2;
const PH_MIN = 5.5, PH_MAX = 6.5;
const EC_AXIS_MIN = 0, EC_AXIS_MAX = 4;
const PH_AXIS_MIN = 4.0, PH_AXIS_MAX = 8.0;

const driftExample = [
    { day: 0,  ec: 1.8, ph: 6.0 },
    { day: 1,  ec: 1.7, ph: 6.1 },
    { day: 2,  ec: 1.6, ph: 6.2 },
    { day: 3,  ec: 1.5, ph: 6.4 },
    { day: 4,  ec: 1.4, ph: 6.6 },
    { day: 5,  ec: 1.3, ph: 6.8 },
    { day: 6,  ec: 2.0, ph: 6.0 },
    { day: 7,  ec: 1.9, ph: 6.0 },
    { day: 8,  ec: 1.8, ph: 5.9 },
    { day: 9,  ec: 1.7, ph: 5.8 },
    { day: 10, ec: 1.6, ph: 5.7 },
    { day: 11, ec: 1.5, ph: 5.6 },
    { day: 12, ec: 1.4, ph: 5.5 },
    { day: 13, ec: 1.3, ph: 5.5 }
];

const healthyExample = [
    { day: 0,  ec: 1.8, ph: 6.0 },
    { day: 1,  ec: 1.8, ph: 6.0 },
    { day: 2,  ec: 1.7, ph: 6.1 },
    { day: 3,  ec: 1.7, ph: 6.0 },
    { day: 4,  ec: 1.8, ph: 6.0 },
    { day: 5,  ec: 1.9, ph: 5.9 },
    { day: 6,  ec: 1.8, ph: 6.0 },
    { day: 7,  ec: 1.7, ph: 6.1 },
    { day: 8,  ec: 1.8, ph: 6.0 },
    { day: 9,  ec: 1.9, ph: 6.0 },
    { day: 10, ec: 1.8, ph: 6.1 },
    { day: 11, ec: 1.7, ph: 6.0 },
    { day: 12, ec: 1.8, ph: 6.0 },
    { day: 13, ec: 1.8, ph: 6.0 }
];

const crashExample = [
    { day: 0,  ec: 1.8, ph: 6.0 },
    { day: 1,  ec: 1.9, ph: 5.9 },
    { day: 2,  ec: 2.0, ph: 5.7 },
    { day: 3,  ec: 2.1, ph: 5.5 },
    { day: 4,  ec: 2.3, ph: 5.3 },
    { day: 5,  ec: 2.5, ph: 5.0 },
    { day: 6,  ec: 2.7, ph: 4.8 },
    { day: 7,  ec: 2.9, ph: 4.6 },
    { day: 8,  ec: 3.1, ph: 4.5 },
    { day: 9,  ec: 3.2, ph: 4.5 },
    { day: 10, ec: 3.3, ph: 4.5 },
    { day: 11, ec: 3.3, ph: 4.5 },
    { day: 12, ec: 3.4, ph: 4.5 },
    { day: 13, ec: 3.4, ph: 4.5 }
];

let rows = JSON.parse(JSON.stringify(driftExample));
let chart;

// Plugin: shaded target bands behind the data lines
const targetBandsPlugin = {
    id: 'targetBands',
    beforeDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;
        const ecScale = scales.yEC;
        const phScale = scales.yPH;
        if (!ecScale || !phScale) return;

        // EC band (green, on left axis)
        const ecTop = ecScale.getPixelForValue(EC_MAX);
        const ecBot = ecScale.getPixelForValue(EC_MIN);
        ctx.save();
        ctx.fillStyle = 'rgba(46, 125, 50, 0.12)';
        ctx.fillRect(chartArea.left, ecTop, chartArea.right - chartArea.left, ecBot - ecTop);

        // pH band (teal, on right axis)
        const phTop = phScale.getPixelForValue(PH_MAX);
        const phBot = phScale.getPixelForValue(PH_MIN);
        ctx.fillStyle = 'rgba(0, 188, 212, 0.12)';
        ctx.fillRect(chartArea.left, phTop, chartArea.right - chartArea.left, phBot - phTop);
        ctx.restore();
    }
};

function rebuildTable() {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';
    rows.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td><input type="number" data-idx="' + idx + '" data-field="day" value="' + r.day + '" min="0" step="1"></td>' +
            '<td><input type="number" data-idx="' + idx + '" data-field="ec"  value="' + r.ec  + '" min="0" max="6" step="0.1"></td>' +
            '<td><input type="number" data-idx="' + idx + '" data-field="ph"  value="' + r.ph  + '" min="0" max="14" step="0.1"></td>' +
            '<td><button data-remove="' + idx + '" class="warn small">×</button></td>';
        tbody.appendChild(tr);
    });
    tbody.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            const field = e.target.dataset.field;
            const val = parseFloat(e.target.value);
            rows[idx][field] = isNaN(val) ? 0 : val;
            updateChart();
        });
    });
    tbody.querySelectorAll('button[data-remove]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.remove);
            rows.splice(idx, 1);
            rebuildTable();
            updateChart();
        });
    });
}

function slope(values) {
    // simple linear slope over last N points (x = index)
    const n = values.length;
    if (n < 2) return 0;
    let sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) {
        sx += i; sy += values[i]; sxy += i * values[i]; sxx += i * i;
    }
    const denom = n * sxx - sx * sx;
    if (denom === 0) return 0;
    return (n * sxy - sx * sy) / denom;
}

function rangeStatus(value, min, max) {
    if (value < min || value > max) return 'red';
    const span = max - min;
    const margin = span * 0.10;
    if (value < min + margin || value > max - margin) return 'yellow';
    return 'green';
}

function combineStatus(a, b) {
    const order = { green: 0, yellow: 1, red: 2 };
    return order[a] >= order[b] ? a : b;
}

function updateStatusAndDiagnostics() {
    const statusEl = document.getElementById('statusPill');
    const resultsEl = document.getElementById('results');
    const diagEl = document.getElementById('diagnostics');

    if (rows.length === 0) {
        statusEl.className = 'status-pill status-yellow';
        statusEl.textContent = 'No data';
        resultsEl.innerHTML = '';
        diagEl.innerHTML = '';
        return;
    }

    const sorted = [...rows].sort((a, b) => a.day - b.day);
    const last = sorted[sorted.length - 1];

    const ecStatus = rangeStatus(last.ec, EC_MIN, EC_MAX);
    const phStatus = rangeStatus(last.ph, PH_MIN, PH_MAX);
    const overall = combineStatus(ecStatus, phStatus);

    if (overall === 'green') {
        statusEl.className = 'status-pill status-green';
        statusEl.textContent = 'In target range';
    } else if (overall === 'yellow') {
        statusEl.className = 'status-pill status-yellow';
        statusEl.textContent = 'Approaching limit (within 10%)';
    } else {
        statusEl.className = 'status-pill status-red';
        statusEl.textContent = 'Out of range';
    }

    // out-of-range day count
    let outDays = 0;
    sorted.forEach(r => {
        if (r.ec < EC_MIN || r.ec > EC_MAX || r.ph < PH_MIN || r.ph > PH_MAX) outDays++;
    });

    let html = '';
    html += '<div class="stat-row"><span>Current EC (Day ' + last.day + ')</span><b>' + last.ec.toFixed(2) + ' mS/cm</b></div>';
    html += '<div class="stat-row"><span>Current pH (Day ' + last.day + ')</span><b class="teal">' + last.ph.toFixed(2) + '</b></div>';
    html += '<div class="stat-row"><span>Out-of-range days</span><b>' + outDays + ' / ' + sorted.length + '</b></div>';
    resultsEl.innerHTML = html;

    // diagnostic trend analysis over last 3 readings
    const tail = sorted.slice(-3);
    const ecSlope = slope(tail.map(r => r.ec));
    const phSlope = slope(tail.map(r => r.ph));

    let diag = '';

    if (last.ec < EC_MIN) {
        diag += '<div class="alert bad"><b>EC below target (' + last.ec.toFixed(2) + ' &lt; ' + EC_MIN + ').</b> ' +
                'Plants may be nutrient-starved. Add concentrated nutrient stock (Part A + Part B) and remeasure.</div>';
    } else if (last.ec > EC_MAX) {
        diag += '<div class="alert bad"><b>EC above target (' + last.ec.toFixed(2) + ' &gt; ' + EC_MAX + ').</b> ' +
                'Salt buildup risk — add plain water to dilute, or partial reservoir change.</div>';
    }

    if (last.ph < PH_MIN) {
        diag += '<div class="alert bad"><b>pH below target (' + last.ph.toFixed(2) + ' &lt; ' + PH_MIN + ').</b> ' +
                'Acidic — micronutrient toxicity risk. Add pH-Up (KOH) in small steps.</div>';
    } else if (last.ph > PH_MAX) {
        diag += '<div class="alert bad"><b>pH above target (' + last.ph.toFixed(2) + ' &gt; ' + PH_MAX + ').</b> ' +
                'Alkaline — Fe, Mn, P lockout. Add pH-Down (phosphoric acid) in small steps.</div>';
    }

    // Trend diagnostics (only if enough readings and value is in range)
    if (tail.length >= 3) {
        if (ecSlope < -0.05 && last.ec >= EC_MIN && last.ec <= EC_MAX) {
            diag += '<div class="alert"><b>EC dropping</b> (slope ' + ecSlope.toFixed(2) +
                    '/day). Plants are consuming nutrients faster than water — top up with nutrient solution, not plain water.</div>';
        } else if (ecSlope > 0.05 && last.ec >= EC_MIN && last.ec <= EC_MAX) {
            diag += '<div class="alert"><b>EC rising</b> (slope +' + ecSlope.toFixed(2) +
                    '/day). Water is evaporating faster than plants drink it — add plain RO/tap water to dilute.</div>';
        }

        if (phSlope > 0.05 && last.ph >= PH_MIN && last.ph <= PH_MAX) {
            diag += '<div class="alert"><b>pH rising</b> (slope +' + phSlope.toFixed(2) +
                    '/day). Typical of nitrate uptake — be ready with pH-Down (mild acid).</div>';
        } else if (phSlope < -0.05 && last.ph >= PH_MIN && last.ph <= PH_MAX) {
            diag += '<div class="alert"><b>pH falling</b> (slope ' + phSlope.toFixed(2) +
                    '/day). May indicate ammonium uptake or biological activity — be ready with pH-Up (KOH).</div>';
        }
    }

    if (diag === '') {
        diag = '<div class="alert ok"><b>All clear.</b> EC and pH are tracking inside target bands. Keep monitoring daily.</div>';
    }

    diagEl.innerHTML = diag;
}

function updateChart() {
    const sorted = [...rows].sort((a, b) => a.day - b.day);
    const labels = sorted.map(r => r.day);

    chart.data.labels = labels;
    chart.data.datasets[0].data = sorted.map(r => r.ec);
    chart.data.datasets[1].data = sorted.map(r => r.ph);
    chart.update();
    updateStatusAndDiagnostics();
}

window.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('ecphChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'EC (mS/cm)',
                    yAxisID: 'yEC',
                    data: [],
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.15)',
                    tension: 0.25,
                    pointRadius: 4,
                    pointBackgroundColor: '#2e7d32',
                    borderWidth: 2
                },
                {
                    label: 'pH',
                    yAxisID: 'yPH',
                    data: [],
                    borderColor: '#00bcd4',
                    backgroundColor: 'rgba(0, 188, 212, 0.15)',
                    tension: 0.25,
                    pointRadius: 4,
                    pointBackgroundColor: '#00bcd4',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    title: { display: true, text: 'Day' }
                },
                yEC: {
                    type: 'linear',
                    position: 'left',
                    min: EC_AXIS_MIN,
                    max: EC_AXIS_MAX,
                    title: { display: true, text: 'EC (mS/cm)', color: '#2e7d32' },
                    ticks: { color: '#2e7d32' },
                    grid: { color: 'rgba(46,125,50,0.08)' }
                },
                yPH: {
                    type: 'linear',
                    position: 'right',
                    min: PH_AXIS_MIN,
                    max: PH_AXIS_MAX,
                    title: { display: true, text: 'pH', color: '#00838f' },
                    ticks: { color: '#00838f' },
                    grid: { drawOnChartArea: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => 'Day ' + items[0].label,
                        label: (item) => {
                            if (item.dataset.label === 'pH') return 'pH: ' + item.parsed.y.toFixed(2);
                            return 'EC: ' + item.parsed.y.toFixed(2) + ' mS/cm';
                        }
                    }
                }
            }
        },
        plugins: [targetBandsPlugin]
    });

    document.getElementById('addRow').addEventListener('click', () => {
        const lastDay = rows.length ? Math.max(...rows.map(r => r.day)) : -1;
        const lastRow = rows.length ? rows[rows.length - 1] : { ec: 1.8, ph: 6.0 };
        rows.push({ day: lastDay + 1, ec: lastRow.ec, ph: lastRow.ph });
        rebuildTable();
        updateChart();
    });
    document.getElementById('loadHealthy').addEventListener('click', () => {
        rows = JSON.parse(JSON.stringify(healthyExample));
        rebuildTable();
        updateChart();
    });
    document.getElementById('loadDrift').addEventListener('click', () => {
        rows = JSON.parse(JSON.stringify(driftExample));
        rebuildTable();
        updateChart();
    });
    document.getElementById('loadCrash').addEventListener('click', () => {
        rows = JSON.parse(JSON.stringify(crashExample));
        rebuildTable();
        updateChart();
    });
    document.getElementById('clearData').addEventListener('click', () => {
        rows = [];
        rebuildTable();
        updateChart();
    });

    rebuildTable();
    updateChart();
});
