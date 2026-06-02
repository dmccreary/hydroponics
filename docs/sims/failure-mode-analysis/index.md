---
title: Failure Mode Analysis Decision Tree
description: Color-coded failure mode matrix for six hydroponic system types, showing time-to-crop-loss, detection method, and recommended mitigation for each failure.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) and Evaluate (L5)
---

# Failure Mode Analysis Decision Tree



<iframe src="main.html" width="100%" height="682"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Advanced Hydroponic Systems and Maintenance](../../chapters/07-advanced-systems/index.md).

```text
Type: workflow
**sim-id:** failure-mode-analysis<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Guide students through a structured failure mode analysis for their chosen system type, identifying the most likely failure modes, estimated time-to-crop-loss for each, and the appropriate redundancy or monitoring response.

Bloom Level: Analyze (L4) and Evaluate (L5)
Bloom Verb: Assess — students assess the failure risk profile of a system and recommend mitigations

Layout: Interactive diagram with left panel (system type selector) and main panel (failure mode display)

Left panel: Radio buttons for system type: Kratky | DWC | NFT | Ebb-and-Flow | Aeroponics | Drip

Main panel: For the selected system, shows a failure mode matrix:
- Each row = one failure mode (e.g., "Air pump failure", "Water pump failure", "Timer failure", "Power outage", "Root rot outbreak")
- Columns: Failure Mode | Time to Crop Loss | Detection Method | Recommended Mitigation
- Rows are color-coded by severity: Red = crop death in <4 hours, Orange = 4–24 hours, Yellow = 1–7 days, Green = recoverable if caught
- Clicking any row expands a detail panel with: what causes this failure, early warning signs, step-by-step recovery procedure

Interactivity:
- Selecting a different system type updates all failure mode rows instantly
- Toggle "Show Commercial vs. Hobby": changes the recommended mitigations based on scale
- "Risk Score" button: calculates a total system risk score based on the selected failure modes and displays a bar chart comparing all six system types
- Each failure mode row has a "Mark as Mitigated" checkbox; when checked, the row turns green and the risk score decreases

Responsive: Scales to container; columns compress gracefully on narrow screens
```

## Related Resources

- [Chapter 7: Advanced Hydroponic Systems and Maintenance](../../chapters/07-advanced-systems/index.md)
