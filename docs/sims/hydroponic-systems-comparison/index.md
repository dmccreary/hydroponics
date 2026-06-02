---
title: Hydroponic Systems Side-by-Side Comparison
description: Clickable gallery of six hydroponic system cross-sections (Kratky, DWC, NFT, Ebb-and-Flow, Aeroponics, Drip) with trade-off comparisons on five dimensions.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) and Evaluate (L5)
---

# Hydroponic Systems Side-by-Side Comparison



<iframe src="main.html" width="100%" height="642"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Passive and Basic Active Systems](../../chapters/06-passive-basic-active-systems/index.md).

```text
Type: diagram
**sim-id:** hydroponic-systems-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let students visually compare all six hydroponic system architectures side by side, click each to see how it works, and explore trade-offs on key dimensions (oxygen, cost, complexity, pump risk, crop suitability).

Bloom Level: Analyze (L4) and Evaluate (L5)
Bloom Verb: Compare and judge — students compare architectures and make a justified system selection for a given scenario

Layout: Gallery view showing six small system diagram thumbnails arranged in a 2×3 or 3×2 grid; each thumbnail shows the key structural elements of that system type in a simple cross-sectional illustration

Thumbnails (each is a simplified cross-section, click to expand):
1. Kratky: Mason jar + net pot + root growing into solution + air gap labeled
2. DWC: Bucket + net pot + roots in solution + air stone + air pump
3. NFT: Channel at slight angle + thin film on channel floor + roots sitting in film + pump + reservoir
4. Ebb-and-Flow: Flood table above reservoir + pump + timer + plants in growing medium + overflow drain
5. Aeroponics: Roots hanging in air chamber + misting nozzles spraying roots + collection trough + high-pressure pump
6. Fogponics: Ultrasonic fogger in reservoir + fog rising around roots + enclosed chamber

Expanded detail panel (appears when thumbnail is clicked, takes 60% of canvas):
- System diagram with labeled components
- Animated flow showing solution/air movement (solution flow arrow, oxygen delivery visualization)
- Ratings display:
  - Oxygen Delivery: 1–5 stars
  - Pump Failure Risk: 1–5 (1=none, 5=immediate death)
  - Setup Complexity: 1–5
  - Cost to Build: $ to $$$$$
  - Best Crops: list of suitable crops
- One-sentence "key insight" about this system

Animation: Each system shows its characteristic movement — DWC shows bubbles rising, NFT shows film flowing, Aeroponics shows mist spray pulses

Return button: "Back to gallery"

Responsive: Grid wraps to single column on narrow screens; detail panel stacks below thumbnails
```

## Related Resources

- [Chapter 6: Passive and Basic Active Systems](../../chapters/06-passive-basic-active-systems/index.md)
