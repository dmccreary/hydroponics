---
title: Solar Power System Designer
description: Solar Power System Designer
status: scaffold
library: p5.js
bloom_level: Apply (L3) and Evaluate (L5)
---

# Solar Power System Designer



<iframe src="main.html" width="100%" height="722"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 19: Solar Energy and Power Systems](../../chapters/19-solar-energy/index.md).

```text
Type: engineering-calculator
**sim-id:** solar-power-designer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to design a solar power system for their specific hydroponic operation by entering energy loads, location (peak sun hours), and battery preferences, then see panel count, battery size, estimated cost, and LCOE automatically calculated.

Bloom Level: Apply (L3) and Evaluate (L5)
Bloom Verb: Design — students iteratively modify system parameters and observe how each decision affects sizing, cost, and LCOE.

Layout: Canvas 900×540. Three-column layout:

Left column (Energy Audit):
- Table with editable rows: Load name | Watts | Hours/Day
- Pre-populated with: LED Light, Water Pump, Air Pump, Circulation Fan, Sensor Node
- "Add Load" button adds a new row
- Total daily Wh shown at bottom

Center column (System Parameters):
- Location: dropdown (Miami 5.6 PSH, Los Angeles 5.5, Denver 5.1, Minneapolis 4.2, Seattle 3.2, Custom)
- Battery type: Lead-Acid / LiFePO4 toggle
- Days of autonomy: slider (1–5)
- System voltage: radio buttons (12V / 24V / 48V)
- Panel watt-peak: slider (200–600 Wp)

Right column (Results):
- Required panel count (integer, rounded up)
- Required battery capacity (Ah at selected voltage)
- Estimated system cost (US $)
- LCOE ($/kWh)
- Payback period vs. grid at $0.15/kWh (years)
- Monthly cost savings ($)

Below all columns: Stacked bar chart showing energy load breakdown by category (lighting, pumping, sensing, climate) in Wh/day.

Interactivity: All inputs update the right column results and chart in real-time. Hovering the stacked bar chart shows the exact Wh and percentage for each category. "Export Report" button downloads a plain-text system design summary.
```

## Related Resources

- [Chapter 19: Solar Energy and Power Systems](../../chapters/19-solar-energy/index.md)
