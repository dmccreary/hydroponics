---
title: Nutrient Deficiency Visual Diagnostic Tool
description: Select leaf symptoms (yellowing, browning, distortion) to identify nutrient deficiencies with a leaf illustration that updates based on mobility rules.
status: implemented
library: p5.js
bloom_level: Analyze (L4)
---

# Nutrient Deficiency Visual Diagnostic Tool



<iframe src="main.html" width="100%" height="582"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Water Transport, Photosynthesis, and Plant Health](../../chapters/03-water-transport/index.md).

```text
Type: infographic
**sim-id:** nutrient-deficiency-visual-diagnostic<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to interactively diagnose nutrient deficiencies by selecting observed visual symptoms and identifying the matching deficiency. Reinforces the mobility rule and visual pattern vocabulary from this chapter.

Bloom Level: Analyze (L4)
Bloom Verb: Differentiate — students differentiate between deficiency symptoms based on leaf age and visual pattern

Layout: Three-panel interface, full-width responsive
Left panel (30%): Symptom selector
- Radio button: "Leaf age affected — New/upper leaves first | Old/lower leaves first | Both / Whole plant"
- Checkbox list: "Pattern type — Yellowing between veins | Uniform yellowing | Browning at edges | Purple/red discoloration | Browning at growing tip | Twisted or distorted growth"

Center panel (55%): Leaf illustration
- Generic lettuce leaf outline with colored overlay zones that update based on symptom selections
- Yellow zones = chlorosis, brown zones = necrosis, purple zones = anthocyanin, distorted lines = curl/twist
- Leaf toggles between "Young leaf" and "Old leaf" view to show expected pattern for each

Right panel (15%): Diagnosis results
- Lists probable deficiencies matching the selected pattern, sorted by likelihood
- Each deficiency name is clickable to expand detail: nutrient name, mobile/immobile, typical solution ppm, pH range where lockout occurs, corrective action

Interactive features:
- Symptom selections update the leaf illustration and diagnosis list in real time
- "Show All Patterns" button cycles through all eight major deficiency patterns with illustrations and labels
- Hover on leaf region: Tooltip showing which deficiency primarily affects that zone

Visual style: Clean botanical illustration style, green/brown/yellow palette matching textbook
```

## Related Resources

- [Chapter 3: Water Transport, Photosynthesis, and Plant Health](../../chapters/03-water-transport/index.md)
