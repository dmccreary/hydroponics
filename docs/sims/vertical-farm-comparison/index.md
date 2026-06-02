---
title: Commercial Vertical Farm Comparison
description: Radar chart comparing five vertical farming models across 10 dimensions including energy efficiency, yield per floor area, CapEx, and location flexibility.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) and Evaluate (L5)
---

# Commercial Vertical Farm Comparison



<iframe src="main.html" width="100%" height="702"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 20: Vertical Farming and Commercial Operations](../../chapters/20-vertical-farming/index.md).

```text
Type: comparison-matrix
**sim-id:** vertical-farm-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Compare the key design and economic parameters of five vertical farming models — Multi-tier Indoor LED, Greenhouse Hybrid, Container Farm, Rooftop Greenhouse, and Tower Garden — across 10 dimensions.

Bloom Level: Analyze (L4) and Evaluate (L5)
Bloom Verb: Compare — students evaluate the trade-offs between farming models for a given location, crop, and budget.

Layout: Canvas 900×520. Radar chart with 10 axes:
1. Energy Efficiency (kWh/kg)
2. Yield per floor m² (kg/m²/year)
3. CapEx ($/m²)
4. OpEx ($/kg)
5. Scalability (1=limited, 5=unlimited)
6. Location Flexibility (1=restricted, 5=anywhere)
7. Climate Independence (1=weather-dependent, 5=full control)
8. Labor Requirement (1=high, 5=minimal)
9. Water Efficiency (1=low, 5=high)
10. Time to Harvest (faster = higher score)

Each farm model is a different colored polygon on the radar chart. All five models are shown simultaneously by default.

Left panel: Checkboxes to show/hide each farm model. Selecting a model highlights its polygon.

Below chart: Data table showing the exact value for each model on each axis, with cells color-coded (green=best, red=worst) for quick comparison.

Interactivity:
- Clicking any axis label shows a detail panel: what this metric means, how it's measured, and which farm model performs best.
- "Scenario Mode" dropdown: pre-sets the chart for specific decision contexts (Urban Rooftop, Rural Greenhouse, Mobile Container, High-Value Herbs, Commodity Lettuce).
- Hovering over any polygon vertex shows the exact value with units.
```

## Related Resources

- [Chapter 20: Vertical Farming and Commercial Operations](../../chapters/20-vertical-farming/index.md)
