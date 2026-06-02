---
title: EC and pH Monitor Over a Crop Cycle
description: Dual-axis chart showing how EC and pH evolve over a 35-day crop cycle with interactive management actions like topping up water and adding pH adjusters.
status: scaffold
library: Chart.js
bloom_level: Analyze (L4)
---

# EC and pH Monitor Over a Crop Cycle



<iframe src="main.html" width="100%" height="722"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: Nutrient Solution Chemistry and Mixing](../../chapters/05-nutrient-solution-chemistry/index.md).

```text
Type: microsim
**sim-id:** ec-ph-monitor<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show students how EC and pH typically evolve over a full crop cycle in a recirculating DWC system, and let them simulate the effects of different management decisions (topping up water, adding nutrient, adding pH-Up/Down) on the curves.

Bloom Level: Analyze (L4)
Bloom Verb: Examine — students examine patterns in EC and pH data and identify when and why intervention is needed

Canvas layout:
- Top chart (55%): Dual-axis line chart over 35 simulated days: pH on left y-axis (range 5.0–7.5, optimal zone 5.5–6.5 shaded green), EC on right y-axis (range 0–3.5 mS/cm, target zone shaded light blue)
- Bottom panel (45%): Event log, day slider, and management action buttons

Pre-loaded simulation scenarios (dropdown):
- "Typical lettuce cycle — moderate drift" (pH rises ~0.2/day, EC drops as plants consume nutrients)
- "Hard water — buffered" (pH resistant to decline; bicarbonate causes slow upward drift)
- "Warm reservoir — rapid pH swing" (temperature-accelerated pH instability)

Management action buttons (apply at current day):
- "Add water (1L)" — decreases EC proportionally, pH unchanged
- "Add nutrient (10mL Part A+B)" — increases EC, slight pH change
- "Add pH-Down (5 drops)" — decreases pH by ~0.3 units
- "Add pH-Up (5 drops)" — increases pH by ~0.3 units

Interactive features:
- Day slider: Scrub through simulated days; chart updates to show current state
- Clicking "Apply Action": Records an event in the event log and updates the simulation forward
- Hover any data point: Shows exact pH, EC, and day values
- Red/orange zone overlays show when pH or EC is out of optimal range
- "Run to harvest" button: Fast-forwards the simulation to day 35 with no intervention — shows what happens without management

Event log: Text list of actions taken, date, and effect on EC/pH

Visual style: Green shaded band for pH optimal, blue band for EC optimal; red lines when out of range
```

## Related Resources

- [Chapter 5: Nutrient Solution Chemistry and Mixing](../../chapters/05-nutrient-solution-chemistry/index.md)
