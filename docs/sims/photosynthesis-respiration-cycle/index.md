---
title: Photosynthesis and Respiration Cycle
description: Step-through visualization of photosynthesis and cellular respiration showing inputs, outputs, molecule counts, and energy flow between chloroplast and mitochondrion.
status: implemented
library: p5.js
bloom_level: Understand (L2)
---

# Photosynthesis and Respiration Cycle



<iframe src="main.html" width="100%" height="622"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Hydroponics](../../chapters/01-introduction/index.md).

```text
Type: microsim
**sim-id:** photosynthesis-respiration-cycle<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show students the complementary relationship between photosynthesis and cellular respiration — inputs, outputs, and where each process occurs in the plant cell — with concrete data values visible at each step.

Bloom Level: Understand (L2)
Bloom Verb: Explain — students trace how energy and molecules flow between the two processes

Instructional Rationale: Step-through with concrete molecule counts is appropriate because the Understand/explain objective requires tracing transformations with actual data. Continuous animation would obscure the input-to-output relationships. Students predict outcomes before advancing to the next step.

Canvas layout:
- Left panel (70% width): Plant cross-section showing a leaf cell (chloroplast highlighted green) on the top half and a root cell (mitochondrion highlighted orange) on the bottom half
- Right panel (30% width): Step counter, current equation fragment, molecule count display, and Next/Previous buttons

Data Visibility Requirements:
Stage 0 (initial): Sunlight arrow entering leaf; CO2 molecules entering stomata; water molecules entering root tip; labels on all visible structures
Stage 1 (light reactions): Highlight thylakoid membrane in chloroplast; display "6H2O → 6O2 + ATP + NADPH" with O2 arrows leaving leaf stomata
Stage 2 (Calvin cycle): Highlight chloroplast stroma; display "6CO2 + ATP + NADPH → C6H12O6"; glucose molecule icon accumulates in leaf
Stage 3 (phloem transport): Arrow showing glucose moving from leaf down through phloem to root
Stage 4 (root respiration setup): Scene shifts emphasis to root cell; mitochondrion highlighted; glucose and O2 molecules visible near it
Stage 5 (respiration): Display "C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP"; ATP burst icon appears in root cell
Stage 6 (nutrient uptake): ATP arrow points to active transport pump on root cell membrane; K+ ion moves across membrane from solution side to cell interior

Interactive controls:
- Button "Next Step" — advances through stages 0–6
- Button "Previous Step" — returns to prior stage
- Button "Reset" — returns to stage 0
- Toggle "Lights Off" — grays out photosynthesis stages, shows only respiration running; glucose pool depletes over repeated steps
- Hover any molecule icon: Tooltip shows molecule name, chemical formula, and role in the process

Default state: Stage 0, lights on

Visual style: Flat vector illustration, green/teal palette consistent with textbook color scheme
```

## Related Resources

- [Chapter 1: Introduction to Hydroponics](../../chapters/01-introduction/index.md)
