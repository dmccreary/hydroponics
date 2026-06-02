---
title: Ion Uptake Mechanisms Comparison
description: Step-through side-by-side comparison of passive diffusion and active transport with concrete concentration values and ATP consumption at each stage.
status: implemented
library: p5.js
bloom_level: Understand (L2)
---

# Ion Uptake Mechanisms Comparison



<iframe src="main.html" width="100%" height="602"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Root Biology and Nutrient Absorption](../../chapters/02-root-biology/index.md).

```text
Type: microsim
**sim-id:** ion-uptake-mechanisms<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to directly compare passive diffusion and active transport side-by-side, with explicit data on concentration gradients, ATP consumption, and ion movement direction.

Bloom Level: Understand (L2)
Bloom Verb: Compare — students compare the two mechanisms and explain when each operates

Instructional Rationale: Side-by-side step-through with concrete concentration values is appropriate because the Understand/compare objective requires students to see both mechanisms operate simultaneously with real numbers. Continuous animation would prevent students from reading the concentration values that reveal whether the gradient favors inward or outward movement.

Canvas layout: Two panels side by side
Left panel (45%): Passive diffusion — cell membrane with two channel proteins; concentration bar graph on each side; ion dots (blue) on solution side
Right panel (45%): Active transport — cell membrane with pump protein; ATP icon; concentration bar graph on each side; ion dots (orange) starting on solution side
Center divider (10%): Shared step counter and buttons

Data Visibility Requirements for each panel:
Step 0 (initial): Solution concentration = 200 units, cell interior = 20 units; gradient arrow visible pointing inward (left panel) and outward (right panel showing high internal K+)
Step 1 (diffusion): Passive: 3 blue ions move through channel inward; concentration readout updates (197 → 23); ATP consumed: 0
Step 2 (active transport): Pump protein changes shape; ATP counter decrements by 1; orange ion moves from solution (50 units) into cell (already 500 units — against gradient); concentration updates
Step 3 (oxygen dependency): Toggle "Remove O2" button — passive diffusion continues unchanged; active transport stops (pump grays out); "No ATP — pump inactive" message

Interactive controls:
- Button "Next Step" / "Previous Step" — advance through comparison steps 0–3
- Toggle "Remove O2" — demonstrates what happens to each mechanism when oxygen is absent
- Hover any ion dot: Shows ion name, charge, and which nutrients use this pathway primarily
- Hover concentration bar: Shows units in ppm and mM alongside the bar height

Default state: Step 0, O2 present
Visual style: Flat vector, teal for passive pathway, orange for active transport; consistent with textbook palette
```

## Related Resources

- [Chapter 2: Root Biology and Nutrient Absorption](../../chapters/02-root-biology/index.md)
