---
title: Growing Media Properties Comparison
description: Radar chart comparing seven growing media across water retention, air porosity, reusability, and pH neutrality with filters by system type and crop.
status: scaffold
library: p5.js
bloom_level: Analyze (L4)
---

# Growing Media Properties Comparison



<iframe src="main.html" width="100%" height="622"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: Growing Media and Crop Management](../../chapters/09-growing-media-crops/index.md).

```text
Type: infographic
**sim-id:** growing-media-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to visually compare all seven major growing media across four key dimensions simultaneously, and to filter media by system type and crop to find the best fit for their situation.

Bloom Level: Analyze (L4)
Bloom Verb: Compare — students compare media properties and select the most appropriate medium for a given scenario

Layout: Radar chart with 4 axes (water retention, air porosity, reusability, pH neutrality), one colored polygon per medium overlaid on the same chart; media toggle checkboxes on the right

Media toggles (checkboxes, each with a different color):
- Rockwool (red)
- Expanded clay (orange)
- Coconut coir (brown)
- Perlite (white/light blue)
- Vermiculite (purple)
- Pumice (gray)
- Gravel/sand (dark gray)

Axes (each 0–5 scale):
- Water retention: 0 = drains immediately, 5 = holds water long-term
- Air porosity: 0 = waterlogged structure, 5 = maximally airy
- Reusability: 0 = single-use, 5 = indefinite
- pH neutrality: 0 = strongly alkaline or acidic, 5 = perfectly neutral

Interactive features:
- Click any medium's checkbox to toggle its polygon on/off
- Hover any polygon vertex: Shows exact score and what it means (e.g., "Rockwool water retention: 4.5 — holds 80% of volume as water")
- Filter dropdown "Best for system type": Selects the top 2 recommended media for that system and highlights them
- Filter dropdown "Crop type": Highlights recommended media for lettuce, herbs, tomato, microgreens

Clicking a medium label below the chart: Opens a detail card with full property table, pH preparation steps if needed, sterilization method, and cost estimate per cycle

Responsive: Scales to container; control panel collapses to toggles-only on narrow screens
```

## Related Resources

- [Chapter 9: Growing Media and Crop Management](../../chapters/09-growing-media-crops/index.md)
