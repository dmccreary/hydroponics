---
title: HACCP Food Safety Risk Matrix
description: HACCP Food Safety Risk Matrix
status: scaffold
library: p5.js
bloom_level: Analyze (L4) and Evaluate (L5)
---

# HACCP Food Safety Risk Matrix



<iframe src="main.html" width="100%" height="662"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 18: Food Safety and Pest Management](../../chapters/18-food-safety/index.md).

```text
Type: decision-tool
**sim-id:** haccp-risk-matrix<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Guide students through a simplified HACCP hazard analysis for their specific hydroponic setup, identifying Critical Control Points and appropriate corrective actions.

Bloom Level: Analyze (L4) and Evaluate (L5)
Bloom Verb: Evaluate — students assess the food safety risk profile of their system configuration and identify gaps in their control measures.

Layout: Canvas 900×500. Three-panel layout:

Left panel — System Configuration (checkboxes):
- Crop type: Leafy greens / Herbs / Fruiting crops / Sprouts
- Water source: Municipal / Well / Rainwater / Reverse osmosis
- Scale: Home/classroom (<50 plants) / Small commercial (50–500) / Commercial (500+)
- Consumers: Personal only / Students/Institution / Public sale

Center panel — Risk Matrix:
For each of 8 hazard categories (contaminated water, biofilm, worker hygiene, harvest surface, post-harvest cooling, pest/disease, chemical contamination, physical hazard), shows a 3×3 risk matrix cell: Probability (Low/Med/High) × Severity (Low/Med/High). Cells colored: green (low risk), yellow (medium), red (high). The cell color and rating update automatically based on the left panel selections.

Right panel — CCP Summary:
Lists the top 3 Critical Control Points for the selected configuration with:
- CCP name
- Monitoring method
- Critical limit
- Corrective action if limit exceeded

Interactivity:
- Any change to the left panel immediately updates the risk matrix and CCP summary.
- Clicking any hazard category in the risk matrix expands a detail panel: what this hazard means, what pathogens are associated, and a step-by-step prevention protocol.
- "Download HACCP Plan" button: generates a printable text summary of the full analysis for the selected configuration.

Responsive: Scales to container width; on narrow screens, panels stack vertically.
```

## Related Resources

- [Chapter 18: Food Safety and Pest Management](../../chapters/18-food-safety/index.md)
