---
title: Plant Life Cycle Stages Explorer
description: Plant Life Cycle Stages Explorer
status: implemented
library: p5.js
bloom_level: Remember (L1) and Understand (L2)
---

# Plant Life Cycle Stages Explorer



<iframe src="main.html" width="100%" height="622"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Hydroponics](../../chapters/01-introduction/index.md).

```text
Type: infographic
**sim-id:** plant-life-cycle-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Give students an interactive reference for the six plant life cycle stages, with nutrient and environmental requirements visible for each stage. Students can click each stage to see the parameters they will manage in later chapters.

Bloom Level: Remember (L1) and Understand (L2)
Bloom Verb: Identify and describe — students identify each stage and describe the grower's management priorities

Layout: Circular life cycle diagram with 6 stage nodes arranged around a central hydroponics reservoir icon; directional arrows between nodes

Stages (nodes, clickable):
1. Seed / Germination — seed icon
Click reveals: Optimal temperature 65–75°F (18–24°C), media must be moist not soaked, no nutrient solution yet, light not required until cotyledons emerge, timeline 3–7 days
2. Seedling — small two-leaf sprout icon
Click reveals: First true leaves present, introduce dilute nutrient solution EC 0.5–0.8 mS/cm, 18h photoperiod, fragile roots — handle gently, timeline 7–14 days from germination
3. Vegetative Growth — full leafy plant icon
Click reveals: High nitrogen (N:P:K ratio favors N), EC 1.5–2.5 mS/cm, 18h photoperiod for most crops, rapid leaf expansion, begin training / pruning tall varieties, timeline 2–8 weeks depending on crop
4. Transition to Flowering — plant with first flower bud icon
Click reveals: Reduce nitrogen, increase phosphorus and potassium, photoperiod change (12h) triggers flowering in many crops, watch for calcium deficiency, timeline 1–3 weeks
5. Fruiting / Harvest (leafy greens) — tomato or harvested lettuce icon
Click reveals: Maximum K for sugar translocation, maintain Ca for cell wall integrity in fruit, monitor EC closely, first harvest begins, timeline varies by crop
6. Harvest / System Reset — scissors and cleaned reservoir icon
Click reveals: Harvest criteria for leafy greens vs. fruiting crops, post-harvest cooling, system draining and cleaning, disinfection before next cycle (Chapter 7), crop rotation planning

Arrows between stages: Directional; clicking an arrow reveals the transition condition (e.g., "Photoperiod change from 18h → 12h triggers flowering in tomatoes and peppers")

Color coding:
- Teal/green: Vegetative stages (Seedling, Vegetative)
- Yellow-orange: Reproductive stages (Flowering, Fruiting)
- Blue-gray: Neutral stages (Germination, Reset)

Central icon: Hydroponic reservoir with roots; hover reveals "Each stage has different nutrient and environment needs — managing transitions is where growers make or lose yield"

Responsive: Scales to container; nodes reposition proportionally; minimum height 500px
```

## Related Resources

- [Chapter 1: Introduction to Hydroponics](../../chapters/01-introduction/index.md)
