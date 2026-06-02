---
title: Indoor Grow Room Layout
description: Bird's-eye view of a grow room with clickable zones identifying each component and linking to the chapters that cover it in depth.
status: implemented
library: p5.js
bloom_level: Remember (L1)
---

# Indoor Grow Room Layout



<iframe src="main.html" width="100%" height="622"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Hydroponics](../../chapters/01-introduction/index.md).

```text
Type: diagram
**sim-id:** indoor-grow-room-layout<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Give students a spatial mental model of how all grow room components relate to each other before they encounter each component in later chapters. Each labeled zone is clickable to reveal what it does and which chapters cover it.

Bloom Level: Remember (L1)
Bloom Verb: Identify — students identify each grow room zone and its function

Visual layout: Bird's-eye (top-down) view of a rectangular grow room showing proportional placement of all key systems:
- LED grow lights panel spanning the ceiling area, labeled "Grow Lights (Ch. 10)"
- Growing channels / trays below the lights labeled "Hydroponic Growing System (Ch. 6–8)"
- Reservoir / sump tank in one corner labeled "Nutrient Reservoir (Ch. 5)"
- Inline exhaust fan and carbon filter on one wall labeled "Exhaust & Ventilation (Ch. 11)"
- Intake vent with passive filter on the opposite wall labeled "Fresh Air Intake (Ch. 11)"
- Sensor cluster (pH probe, EC meter, thermometer) near reservoir labeled "Sensors & Probes (Ch. 15)"
- Microcontroller board (Raspberry Pi Pico or ESP32) on a shelf labeled "Automation Controller (Ch. 12–14)"
- Relay board and power strip labeled "Relay & Power Control (Ch. 13)"
- Small LCD or laptop screen icon labeled "Data Dashboard (Ch. 17)"

Color scheme:
- Warm yellow: Lighting zone
- Green: Growing channels / root zone
- Blue: Reservoir and water lines
- Gray: Walls, fans, structural
- Teal: Sensors and electronics

Interactivity:
- Click any labeled component to open an infobox containing:
  1. What this component does in plain language
  2. Why it matters for plant growth
  3. Which chapter(s) cover it in depth
- Toggle button "Show Nutrient Solution Flow": Animates colored arrows showing the solution path — reservoir → pump → growing channels → drain back → reservoir
- Toggle button "Show Airflow": Animates dashed arrows showing fresh air intake → circulation fan → exhaust path

Responsive: Scales to container width with maintained aspect ratio
Canvas height: 520px default
```

## Related Resources

- [Chapter 1: Introduction to Hydroponics](../../chapters/01-introduction/index.md)
