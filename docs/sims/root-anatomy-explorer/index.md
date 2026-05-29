---
title: Root Cross-Section and Absorption Zones
description: Root Cross-Section and Absorption Zones
status: implemented
library: p5.js
bloom_level: Remember (L1) and Understand (L2)
---

# Root Cross-Section and Absorption Zones



<iframe src="main.html" width="100%" height="622"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Root Biology and Nutrient Absorption](../../chapters/02-root-biology/index.md).

```text
Type: diagram
**sim-id:** root-anatomy-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Give students a visual and interactive reference for root anatomy so they can connect each structural feature to its function in nutrient absorption and understand why root health matters to a hydroponic grower.

Bloom Level: Remember (L1) and Understand (L2)
Bloom Verb: Identify and describe — students identify each root zone/tissue and describe its role

Visual layout: Two views side by side:
Left view (60% width): Longitudinal section of root tip showing the five zones from tip to mature root tissue:
- Root cap (gray-brown, rounded tip)
- Meristematic zone (tightly packed small cells, deep green)
- Zone of elongation (cells noticeably longer, lighter green)
- Zone of differentiation: root hair cells visible as fine projections from epidermis (teal), endodermis with Casparian strip visible (orange band), vascular cylinder (dark blue center)
- Older suberized root (lighter gray-brown, no hairs)

Right view (40% width): Cross-sectional slice through the differentiation zone showing:
- Epidermis with root hair (outermost layer, teal)
- Cortex (several layers of loosely packed cells, light green)
- Endodermis with Casparian strip (orange band, labeled)
- Pericycle (thin layer just inside endodermis)
- Xylem vessels (star-shaped, dark blue)
- Phloem cells (between xylem arms, purple)

Interactivity:
- Click any labeled tissue in either view to open an infobox with:
  1. Tissue name and cell types
  2. Function in nutrient absorption or transport
  3. What happens to plant growth if this tissue is damaged (e.g., "If the Casparian strip is damaged, ions bypass the endodermis and the root loses selectivity")
- Hover over the Casparian strip in the cross-section to see a tooltip explaining why it forces ions to enter through cell membranes rather than passing between cells
- Toggle button "Show Ion Pathway" — animates a colored dot (representing a nitrate ion) moving from solution → root hair → cortex → endodermis → xylem

Color scheme: Green tones for living tissue, teal for root hairs, orange for Casparian strip, blue for xylem, purple for phloem
Responsive: Scales to container width; cross-section repositions below longitudinal view on narrow screens
```

## Related Resources

- [Chapter 2: Root Biology and Nutrient Absorption](../../chapters/02-root-biology/index.md)
