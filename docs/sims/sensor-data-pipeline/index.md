---
title: Sensor Data Analysis Pipeline
description: Apply data analysis steps (noise, validation, fill, resample, rolling average) to a simulated 35-day crop cycle dataset and observe real-time transformations.
status: scaffold
library: p5.js
bloom_level: Apply (L3) and Analyze (L4)
---

# Sensor Data Analysis Pipeline



<iframe src="main.html" width="100%" height="702"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 16: Data Collection and Analysis](../../chapters/16-data-collection-analysis/index.md).

```text
Type: interactive-analysis
**sim-id:** sensor-data-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Simulate a 35-day crop cycle dataset (synthetic pH, EC, temperature readings at 5-minute intervals) and allow students to apply each analysis step — load, clean, resample, rolling average, correlation, regression — and observe the output update in real-time.

Bloom Level: Apply (L3) and Analyze (L4)
Bloom Verb: Apply — students apply data analysis operations to a simulated dataset and observe how each step transforms the data.

Layout: Canvas 900×500. Split into left panel (analysis controls) and right panel (data visualization).

Left panel — analysis steps (checkboxes and sliders):
1. "Add simulated noise" slider (0–100%) — adds random noise to the synthetic dataset
2. "Add missing data gaps" slider (0–20%) — randomly NaN-ifies readings
3. "Apply validation" checkbox — remove out-of-range values
4. "Fill missing data" dropdown — None / Forward Fill / Interpolate
5. "Resample to" dropdown — 5 min / 15 min / 1 hour / 1 day
6. "Rolling window" slider (1–48 readings)
7. "Show regression line" checkbox
8. "Show ±1 std band" checkbox

Right panel — time series chart showing:
- Raw data (gray points, can be toggled)
- Cleaned/interpolated data (blue line)
- Resampled data (orange line)
- Rolling average (green line)
- Regression trend line (red dashed)
- ±1 std band (shaded green)

Below chart: stats panel showing real-time values: mean, median, std, min, max, trend slope (pH/day).

Interactivity: All left-panel changes update the chart instantly. Hovering the chart shows a vertical cursor with the exact values at that timestamp. Toggle "View Mode" to switch between pH / EC / Temperature.
```

## Related Resources

- [Chapter 16: Data Collection and Analysis](../../chapters/16-data-collection-analysis/index.md)
