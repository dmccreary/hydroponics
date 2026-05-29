---
title: VPD and Environmental Parameter Dashboard
description: VPD and Environmental Parameter Dashboard
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# VPD and Environmental Parameter Dashboard



<iframe src="main.html" width="100%" height="642"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: Environmental Control and CO₂ Management](../../chapters/11-environmental-control/index.md).

```text
Type: microsim
**sim-id:** vpd-environment-dashboard<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to interactively set temperature and humidity and see the resulting VPD calculated in real time, along with color-coded feedback on whether the environment is in optimal range for each growth stage.

Bloom Level: Apply (L3)
Bloom Verb: Calculate — students calculate VPD from temperature and humidity and interpret whether conditions are optimal

Canvas layout:
- Left panel (40%): Input controls
  - Temperature slider: 15–35°C
  - Humidity slider: 30–95% RH
  - Growth stage selector (dropdown): Propagation | Vegetative | Fruiting
- Center panel (40%): Calculated results
  - Saturated vapor pressure (SVP) at current temperature
  - VPD (large font display)
  - VPD gauge: horizontal bar with colored zones (blue=too low, green=optimal, orange=high, red=very high) with marker at current VPD
  - Interpretation text: "VPD is in the optimal range for [stage]" or "VPD is too high — stomata may close"
- Right panel (20%): Consequences panel
  - Current transpiration rate: Low/Moderate/High (text + colored indicator)
  - Calcium delivery risk: OK / Warning (if VPD < 0.6 kPa, calcium delivery is limited)
  - Disease risk: Low / Elevated (if RH > 85%, powdery mildew and Botrytis risk increases)
  - CO₂ efficiency: Full / Reduced (if stomata are likely closed at high VPD, CO₂ enrichment is less effective)

Interactive features:
- All sliders update calculations in real time
- Hover VPD gauge: Shows the formula SVP × (1 − RH/100) with current values substituted
- "Common Scenarios" dropdown pre-loads temperature and humidity combinations: "Summer afternoon (hot)", "Night cycle", "Propagation dome", "Winter dry heat"
- Toggle "Show VPD Table": Overlays a 6×6 heatmap showing VPD at combinations of temperature (15–35°C) and humidity (40–90%) with the current point marked

Responsive: Panels stack vertically on narrow screens; VPD display remains large
```

## Related Resources

- [Chapter 11: Environmental Control and CO₂ Management](../../chapters/11-environmental-control/index.md)
