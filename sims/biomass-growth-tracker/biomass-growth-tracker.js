// Biomass Growth Tracker - Chart.js
// CANVAS_HEIGHT: 720
const exampleData = [
    { day: 0,  fresh: 8,   dry: 0.6 },
    { day: 7,  fresh: 18,  dry: 1.5 },
    { day: 14, fresh: 42,  dry: null },
    { day: 21, fresh: 75,  dry: null },
    { day: 28, fresh: 102, dry: null },
    { day: 35, fresh: 125, dry: 9.5 }
];

let rows = [...exampleData];
let chart;

function rebuildTable() {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';
    rows.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td><input type="number" data-idx="' + idx + '" data-field="day" value="' + r.day + '" min="0" step="1"></td>' +
            '<td><input type="number" data-idx="' + idx + '" data-field="fresh" value="' + r.fresh + '" min="0" step="0.1"></td>' +
            '<td><input type="number" data-idx="' + idx + '" data-field="dry" value="' + (r.dry == null ? '' : r.dry) + '" min="0" step="0.01" placeholder="—"></td>' +
            '<td><button data-remove="' + idx + '" class="warn">×</button></td>';
        tbody.appendChild(tr);
    });
    tbody.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            const field = e.target.dataset.field;
            const val = e.target.value;
            if (field === 'dry') rows[idx].dry = val === '' ? null : parseFloat(val);
            else rows[idx][field] = parseFloat(val) || 0;
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

function linearRegression(points) {
    const n = points.length;
    if (n < 2) return null;
    let sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (const p of points) { sx += p.x; sy += p.y; sxy += p.x * p.y; sxx += p.x * p.x; }
    const denom = n * sxx - sx * sx;
    if (denom === 0) return null;
    const m = (n * sxy - sx * sy) / denom;
    const b = (sy - m * sx) / n;
    // R²
    const meanY = sy / n;
    let ssTot = 0, ssRes = 0;
    for (const p of points) {
        const predicted = m * p.x + b;
        ssTot += (p.y - meanY) ** 2;
        ssRes += (p.y - predicted) ** 2;
    }
    const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
    return { m, b, r2 };
}

function updateResults() {
    const sorted = [...rows].sort((a, b) => a.day - b.day);
    const target = parseFloat(document.getElementById('targetWeight').value) || 0;
    let html = '';

    // Latest fresh/dry ratio
    const ratioRow = [...sorted].reverse().find(r => r.dry != null && r.dry > 0);
    if (ratioRow) {
        const ratio = ratioRow.fresh / ratioRow.dry;
        html += '<div class="result-row"><span>Fresh/Dry ratio (Day ' + ratioRow.day + ')</span><b>' + ratio.toFixed(1) + ':1</b></div>';
    } else {
        html += '<div class="result-row"><span>Fresh/Dry ratio</span><b>—</b></div>';
    }

    // Average daily growth rate
    if (sorted.length >= 2) {
        const first = sorted[0], last = sorted[sorted.length - 1];
        const days = last.day - first.day;
        const rate = days > 0 ? (last.fresh - first.fresh) / days : 0;
        html += '<div class="result-row"><span>Avg growth rate</span><b>' + rate.toFixed(2) + ' g/day</b></div>';

        // Predict harvest date
        if (target > last.fresh && rate > 0) {
            const daysToTarget = (target - last.fresh) / rate;
            const harvestDay = Math.ceil(last.day + daysToTarget);
            html += '<div class="result-row"><span>Predicted harvest day</span><b>Day ' + harvestDay + '</b></div>';
        } else if (target <= last.fresh) {
            html += '<div class="result-row"><span>Predicted harvest day</span><b>Reached</b></div>';
        }
    }

    // RGR (needs two dry weights)
    const drys = sorted.filter(r => r.dry != null && r.dry > 0);
    if (drys.length >= 2) {
        const a = drys[0], b = drys[drys.length - 1];
        const t = b.day - a.day;
        if (t > 0) {
            const rgr = (Math.log(b.dry) - Math.log(a.dry)) / t;
            html += '<div class="result-row" style="border-top:1px solid #00796b; margin-top:4px; padding-top:6px">' +
                    '<span>RGR (dry, Day ' + a.day + '→' + b.day + ')</span><b>' + rgr.toFixed(4) + ' g/(g·day)</b></div>';
            html += '<div style="font-size:10px; color:#6c757d; margin-top:2px">RGR = (ln W₂ − ln W₁) / (t₂ − t₁)</div>';
        }
    } else {
        html += '<div class="result-row"><span>RGR (needs ≥ 2 dry-wt entries)</span><b>—</b></div>';
    }

    // Trend R²
    const points = sorted.map(r => ({ x: r.day, y: r.fresh }));
    const reg = linearRegression(points);
    if (reg) {
        html += '<div class="result-row"><span>Linear R²</span><b>' + reg.r2.toFixed(3) + '</b></div>';
    }

    document.getElementById('results').innerHTML = html;

    // Progress bar
    const latest = sorted[sorted.length - 1];
    if (latest && target > 0) {
        const pct = Math.min(100, (latest.fresh / target) * 100);
        document.getElementById('progressBar').style.width = pct.toFixed(1) + '%';
        document.getElementById('progressLabel').textContent =
            latest.fresh.toFixed(1) + ' g of ' + target + ' g target  (' + pct.toFixed(0) + '%)';
    }
}

function updateChart() {
    const sorted = [...rows].sort((a, b) => a.day - b.day);
    const labels = sorted.map(r => r.day);
    const data = sorted.map(r => r.fresh);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;

    const showTrend = document.getElementById('showTrend').checked;
    const points = sorted.map(r => ({ x: r.day, y: r.fresh }));
    const reg = linearRegression(points);
    if (showTrend && reg && labels.length >= 2) {
        const xMin = labels[0], xMax = labels[labels.length - 1];
        chart.data.datasets[1].data = [
            { x: xMin, y: reg.m * xMin + reg.b },
            { x: xMax, y: reg.m * xMax + reg.b }
        ];
        chart.data.datasets[1].hidden = false;
    } else {
        chart.data.datasets[1].hidden = true;
    }

    chart.update();
    updateResults();
}

window.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('growthChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Fresh weight (g)',
                    data: [],
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.15)',
                    tension: 0.25,
                    pointRadius: 5,
                    pointBackgroundColor: '#2e7d32'
                },
                {
                    label: 'Linear trend',
                    data: [],
                    borderColor: '#00796b',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    type: 'line',
                    parsing: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Days after transplant' } },
                y: { title: { display: true, text: 'Fresh weight (g)' }, beginAtZero: true }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { callbacks: { label: (ctx) => 'Day ' + ctx.label + ': ' + ctx.parsed.y + ' g' } }
            }
        }
    });

    document.getElementById('addRow').addEventListener('click', () => {
        const lastDay = rows.length ? Math.max(...rows.map(r => r.day)) : 0;
        rows.push({ day: lastDay + 7, fresh: 0, dry: null });
        rebuildTable();
        updateChart();
    });
    document.getElementById('loadExample').addEventListener('click', () => {
        rows = JSON.parse(JSON.stringify(exampleData));
        rebuildTable();
        updateChart();
    });
    document.getElementById('clearData').addEventListener('click', () => {
        rows = [];
        rebuildTable();
        updateChart();
    });
    document.getElementById('targetWeight').addEventListener('input', updateResults);
    document.getElementById('showTrend').addEventListener('change', updateChart);

    rebuildTable();
    updateChart();
});
