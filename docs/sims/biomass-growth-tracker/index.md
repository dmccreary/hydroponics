---
title: Biomass Growth Tracker
description: Enter plant growth measurements to plot growth curves and calculate relative growth rate and fresh-to-dry weight ratio over a simulated crop cycle.
status: implemented
library: Chart.js
bloom_level: Apply (L3)
---

# Biomass Growth Tracker



<iframe src="main.html" width="100%" height="722"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Water Transport, Photosynthesis, and Plant Health](../../chapters/03-water-transport/index.md).

```text
Type: microsim
**sim-id:** biomass-growth-tracker<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Give students an interactive tool to enter growth measurements over time, visualize the growth curve, and calculate relative growth rate and fresh-to-dry weight ratio. Reinforces the difference between fresh and dry weight and provides practice with growth rate mathematics.

Bloom Level: Apply (L3)
Bloom Verb: Calculate — students calculate growth rates and weight ratios from entered data

Canvas layout:
- Top section (50%): Line chart (x-axis: days after transplant, y-axis: fresh weight in grams); data points appear as the student enters values
- Bottom section (50%): Data entry table and calculated results panel side by side

Input fields:
- Data table with columns: Day, Fresh Weight (g), Dry Weight (g, optional)
- "Add Row" / "Remove Row" buttons
- "Target Harvest Weight (g)" input

Calculated results (update in real time):
- Current fresh/dry weight ratio from latest row with both values
- Average daily growth rate (g/day fresh weight)
- Relative Growth Rate (if two dry weight entries are present): displayed with formula and calculated value in g/(g·day)
- Predicted harvest date based on current growth rate and target harvest weight
- Progress bar: current weight as % of target harvest weight

Interactive features:
- Hover any chart data point: shows exact day and weight values
- Toggle "Show Trend Line": adds linear regression line and R² value
- Pre-loaded example data: lettuce growth curve from transplant to 35-day harvest at ~120g fresh weight with dry weight entries at day 7 and day 35

Visual style: Green data line, teal trend line, gray grid; controls in clean right-panel layout
```

## Related Resources

- [Chapter 3: Water Transport, Photosynthesis, and Plant Health](../../chapters/03-water-transport/index.md)
