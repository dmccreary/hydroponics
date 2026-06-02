---
title: PPFD and DLI Calculator
description: Calculate DLI from PPFD and photoperiod, compare lighting energy costs at your electricity rate, and see how fixture mounting height affects PPFD.
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# PPFD and DLI Calculator



<iframe src="main.html" width="100%" height="702"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Lighting Science](../../chapters/10-lighting-science/index.md).

```text
Type: microsim
**sim-id:** ppfd-dli-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to interactively calculate DLI from PPFD and photoperiod, compare different lighting scenarios for energy cost, and understand how the inverse square law affects PPFD with mounting height change.

Bloom Level: Apply (L3)
Bloom Verb: Calculate — students calculate DLI, energy cost, and mounting height effects using real formulas

Canvas layout:
- Left panel (50%): Calculator with three sections:
  Section 1 "DLI Calculator":
    Inputs: PPFD (slider 50–1500 µmol·m⁻²·s⁻¹), Photoperiod (slider 8–24 hours)
    Output: DLI in mol·m⁻²·d⁻¹, displayed numerically and as a horizontal bar against crop target ranges (color-coded: red=too low, green=optimal, orange=high)
  Section 2 "Energy Cost":
    Inputs: Light wattage (number input), electricity cost $/kWh (number input, default 0.12)
    Output: Daily energy cost ($), monthly energy cost ($), annual energy cost ($)
  Section 3 "Inverse Square Law":
    Inputs: Current PPFD at known height (number input), current height (cm slider 10–200), new height (cm slider 10–200)
    Output: New PPFD at the new height, with warning if result exceeds 1200 µmol·m⁻²·s⁻¹ (light stress risk)

- Right panel (50%): Crop target DLI reference chart
  Horizontal bar chart showing DLI target ranges for: Lettuce, Basil, Tomato veg, Tomato fruit, Cucumber, Strawberry, Seedlings
  Current calculated DLI shown as a vertical orange line moving across all bars as the calculator updates
  Each bar is clickable to set DLI calculator inputs to the recommended range midpoint

Interactivity:
- All sliders and inputs update output in real time
- "Compare two scenarios" button: Expands to show a side-by-side comparison of two different PPFD/photoperiod combinations with their DLI and energy cost
- Hover over any output: Tooltip shows the formula used and what each variable means

Responsive: Stacks to vertical layout on narrow screens
```

## Related Resources

- [Chapter 10: Lighting Science](../../chapters/10-lighting-science/index.md)
