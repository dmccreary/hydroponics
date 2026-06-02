---
title: SPC Dashboard for Hydroponics
description: Statistical Process Control dashboard for a 35-day crop cycle with control charts, anomaly flags, and trend analysis for pH, EC, and temperature.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) and Evaluate (L5)
---

# SPC Dashboard for Hydroponics



<iframe src="main.html" width="100%" height="722"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 17: Data Visualization and Process Control](../../chapters/17-data-visualization/index.md).

```text
Type: interactive-dashboard
**sim-id:** spc-dashboard<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Demonstrate a complete SPC dashboard for a 35-day hydroponic crop cycle, allowing students to interactively explore control charts, anomaly detection, and trend analysis for pH, EC, and temperature.

Bloom Level: Analyze (L4) and Evaluate (L5)
Bloom Verb: Evaluate — students assess the system's performance by interpreting control chart patterns, anomaly flags, and trend slopes.

Layout: Canvas 900×540. Three sections:

Top section: Sensor selector tabs (pH | EC | Temperature) + time range slider (1 day to 35 days).

Middle section: Main control chart (60% of height)
- Line plot of selected sensor over selected time range
- Center line (green), UCL/LCL (red dashed), UWL/LWL (orange dotted)
- Rolling mean overlay (blue, thick)
- Out-of-control points shown as red circles
- Trend anomaly periods shaded in light red

Bottom section: three panels side by side:
- Stats panel: mean, std, UCL, LCL, % in-control, trend slope
- Anomaly table: timestamp, value, z-score, anomaly type (Z-score / IQR / Trend)
- Distribution histogram with CL and control limit lines overlaid

Interactivity:
- Clicking a point on the chart highlights it in the anomaly table
- Clicking a table row highlights the point on the chart
- Toggle "Show All Methods": adds IQR fences and moving-average bands to the chart
- Toggle "Simulate Dosing Event": injects a simulated pH spike at day 18 and shows how the anomaly detection methods respond differently

Responsive: Scales to container; on narrow screens, anomaly table moves below the chart.
```

## Related Resources

- [Chapter 17: Data Visualization and Process Control](../../chapters/17-data-visualization/index.md)
