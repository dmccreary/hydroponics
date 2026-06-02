---
title: Root Exudate pH Drift Simulator
description: Simulate reservoir pH drift over 14 days by adjusting the nitrate-to-ammonium ratio to see how nitrogen source affects pH direction and rate of change.
status: implemented
library: p5.js
bloom_level: Apply (L3)
---

# Root Exudate pH Drift Simulator



<iframe src="main.html" width="100%" height="582"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Root Biology and Nutrient Absorption](../../chapters/02-root-biology/index.md).

```text
Type: microsim
**sim-id:** root-exudate-ph-drift<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show students how root exudate release drives pH drift in a hydroponic reservoir over time, and how nitrogen source (nitrate vs. ammonium) changes the direction of drift. Students adjust controls and observe pH over simulated days.

Bloom Level: Apply (L3)
Bloom Verb: Demonstrate — students demonstrate how nutrient formula affects pH stability

Instructional Rationale: Parameter exploration is appropriate for Apply-level objectives. Students adjust the N-source ratio and observe the pH outcome, building intuition for managing pH drift before they encounter it in a real system.

Canvas layout:
- Left panel (55%): Line chart of reservoir pH over 14 simulated days; y-axis 4.0–8.0 with optimal zone (5.5–6.5) shaded green; drift lines for each scenario update in real time as parameters change
- Right panel (45%): Controls and current-day status display

Interactive controls:
- Slider "Nitrate %": 0–100% (ammonium fills the remainder); label updates to show "Nitrate/Ammonium ratio X:Y"
- Slider "Plant Biomass" (proxy for exudate production): Small plant (50g fresh weight) → Large plant (500g fresh weight)
- Slider "Reservoir Volume": 2L → 20L (larger reservoir = more buffering capacity, slower drift)
- Button "Simulate 14 Days" — runs the simulation with current parameters
- Button "Reset"
- Toggle "Show Correction Events": Adds pH-Down dosing events on days where pH exceeds 6.5, showing how the grower would intervene

Data displayed:
- Current pH (day selected by hovering chart line)
- Days out of optimal range
- Total pH-Down corrections needed with current parameters

Visual style: Green shaded band for optimal pH range; red line when pH is out of range; teal line when in range; controls in right panel with clear labels and current values shown
```

## Related Resources

- [Chapter 2: Root Biology and Nutrient Absorption](../../chapters/02-root-biology/index.md)
