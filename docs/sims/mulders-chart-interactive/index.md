---
title: Interactive Mulder's Chart — pH and Nutrient Availability
description: Drag a pH slider to see how each of 14 mineral nutrients changes in availability and visualize Mulder antagonism relationships between nutrients.
status: scaffold
library: p5.js
bloom_level: Analyze (L4)
---

# Interactive Mulder's Chart — pH and Nutrient Availability



<iframe src="main.html" width="100%" height="602"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: Essential Nutrients: Macro and Micro](../../chapters/04-macro-micro-nutrients/index.md).

```text
Type: infographic
**sim-id:** mulders-chart-interactive<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize how each nutrient's availability changes with pH, and how excess of one nutrient causes deficiency of another (Mulder antagonisms). Students drag a pH slider and observe which nutrients become limited.

Bloom Level: Analyze (L4)
Bloom Verb: Examine — students examine relationships between pH and nutrient availability and identify antagonism patterns

Visual layout: Two views toggled by tab buttons

View 1 — pH Availability Chart:
- Horizontal bar chart with all 14 mineral nutrients on y-axis (N, P, K, Ca, Mg, S, Fe, Mn, Zn, Cu, B, Mo, Cl, Ni)
- Bar length represents availability from 0% (not available) to 100% (fully available) at the current pH
- Bar fill color: Green when >75% available, Yellow when 25–75%, Red when <25%
- pH slider: range 4.5 to 8.5, step 0.1, default 6.0
- Green vertical band marks the 5.5–6.5 optimal range on a secondary mini-chart above the bars
- Clicking any bar opens a side panel with: nutrient name, function in brief, typical solution concentration (ppm), absorption form, and which pH range causes lockout

View 2 — Antagonism Network:
- Force-directed network diagram showing nodes for all 14 mineral nutrients
- Orange arrows = antagonism (excess source → reduced uptake of target)
- Teal arrows = synergism (promotes uptake of target)
- Key antagonisms:
  Excess K → reduced Mg, Ca uptake
  Excess Ca → reduced Mg, K, Fe uptake
  Excess Mg → reduced Ca, K uptake
  Excess Fe → reduced Mn, Zn uptake
  Excess Mn → reduced Fe, Zn uptake
  Excess Zn → reduced Fe uptake
  Excess P → reduced Zn, Fe uptake
- Nodes sized proportionally to frequency of deficiency reports in hydroponic literature
- Clicking a nutrient node: highlights all antagonism arrows; shows "If you have excess [X], watch for deficiency of [Y]"
- Toggle "Show excess" / "Show deficiency" direction filter

Tab labels: "pH Availability" | "Nutrient Interactions"

Responsive: Scales to container width; minimum height 540px
Color scheme: Green (available), yellow (limited), red (unavailable), orange (antagonism arrows), teal (synergism arrows)
```

## Related Resources

- [Chapter 4: Essential Nutrients: Macro and Micro](../../chapters/04-macro-micro-nutrients/index.md)
