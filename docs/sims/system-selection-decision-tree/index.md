---
title: System Selection Decision Tree
description: Clickable decision flowchart guiding students through crop type, budget, and electricity availability to recommend the most suitable hydroponic system.
status: scaffold
library: p5.js
bloom_level: Evaluate (L5)
---

# System Selection Decision Tree



<iframe src="main.html" width="100%" height="642"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Passive and Basic Active Systems](../../chapters/06-passive-basic-active-systems/index.md).

```text
Type: workflow
**sim-id:** system-selection-decision-tree<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Guide students through a series of decision criteria to arrive at a recommended system type for a given growing scenario. Reinforces the trade-off concepts from the chapter and gives students practice with decision-making reasoning.

Bloom Level: Evaluate (L5)
Bloom Verb: Recommend — students recommend a system type and justify the choice using trade-off criteria

Visual layout: Top-down flowchart with clickable decision nodes

Decision tree structure:
Root: "What is your primary crop?" → Leafy greens/herbs | Fruiting crops | Root crops | Propagation

Leafy greens/herbs branch:
  → "Do you have reliable electricity?" → Yes: "What is your budget?" → <$50: Kratky | $50-200: DWC | $200+: NFT
  → No: "Use Kratky — no electricity required" (terminal node)

Fruiting crops branch:
  → "Expected growth duration?" → Short cycle (<60 days): DWC | Long cycle (>60 days): Ebb-and-Flow or Drip

Root crops branch:
  → "Scale?" → Small/Home: Ebb-and-Flow | Large/Commercial: Aeroponics

Propagation branch:
  → "Speed priority?" → Max speed: Fogponics | Good enough: DWC clone bucket

Each terminal node (system recommendation) is clickable to open a panel with:
- System name and one-sentence description
- Estimated cost range to build
- Key strength and key weakness
- "Learn more" link pointing to relevant section in this chapter

Interactivity:
- Each decision diamond is hoverable to see the decision question in full
- Users can click "Reset" to start over from the root
- Previously-visited paths remain highlighted in a lighter color for comparison
- Each branch can be selected and re-selected to explore different paths

Visual style: Green for confirmed paths, gray for unexplored branches, teal for terminal recommendation nodes
```

## Related Resources

- [Chapter 6: Passive and Basic Active Systems](../../chapters/06-passive-basic-active-systems/index.md)
