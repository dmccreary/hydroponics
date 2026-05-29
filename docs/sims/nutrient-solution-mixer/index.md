---
title: Nutrient Solution Mixing Calculator
description: Nutrient Solution Mixing Calculator
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Nutrient Solution Mixing Calculator



<iframe src="main.html" width="100%" height="642"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: Nutrient Solution Chemistry and Mixing](../../chapters/05-nutrient-solution-chemistry/index.md).

```text
Type: microsim
**sim-id:** nutrient-solution-mixer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to interactively design a nutrient solution from raw salts by entering target element concentrations and seeing the salt quantities required. Demonstrates the relationship between salt composition and solution chemistry.

Bloom Level: Apply (L3)
Bloom Verb: Calculate — students calculate salt quantities needed to achieve target nutrient concentrations

Instructional Rationale: This is a step-through calculator appropriate for Apply-level objectives. Students enter targets and observe quantities, building numeracy around solution formulation before working with real salts.

Canvas layout:
- Left panel (45%): Target concentration inputs (ppm) for: N (nitrate), N (ammonium), P, K, Ca, Mg, S, Fe
- Center panel (35%): Calculated salt quantities (g per liter of final solution) for: Calcium nitrate, Magnesium sulfate, Potassium nitrate, Monopotassium phosphate, Chelated iron (DTPA-Fe)
- Right panel (20%): Solution summary — estimated EC (mS/cm), N:P:K ratio, Ca:Mg ratio, and any warnings (e.g., "Ca + phosphate conflict" if concentrations exceed co-precipitation threshold)

Pre-loaded presets (dropdown):
- Lettuce / Leafy Greens (vegetative formula, EC ~1.6)
- Basil / Herbs (moderate EC ~1.8)
- Tomato Vegetative (EC ~2.5)
- Tomato Fruiting (EC ~3.5)

Interactivity:
- Changing any target ppm input recalculates salt quantities and updates the summary in real time
- Clicking a salt name in the center panel opens a tooltip with: chemical formula, solubility, pH effect, handling notes
- Warning icon appears if any combination would cause precipitation (e.g., Ca too high with P too high)
- "Show Mixing Order" button generates a numbered mixing sequence: (1) fill reservoir with water, (2) add calcium nitrate, stir, (3) add magnesium sulfate, stir, (4) add potassium nitrate, stir, (5) add potassium phosphate, stir, (6) add chelated iron, (7) check EC and pH

Responsive: Scales to container width; panels stack vertically on narrow screens
```

## Related Resources

- [Chapter 5: Nutrient Solution Chemistry and Mixing](../../chapters/05-nutrient-solution-chemistry/index.md)
