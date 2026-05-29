---
title: DIY Build Cost and Complexity Selector
description: DIY Build Cost and Complexity Selector
status: scaffold
library: p5.js
bloom_level: Evaluate (L5)
---

# DIY Build Cost and Complexity Selector



<iframe src="main.html" width="100%" height="682"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: DIY Systems and School Projects](../../chapters/08-diy-school-projects/index.md).

```text
Type: infographic
**sim-id:** diy-build-selector<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let students explore all four DIY build options interactively, filtering by budget and complexity to find the most appropriate starting project. Reinforces the cost-tier framework and components needed for each build.

Bloom Level: Evaluate (L5)
Bloom Verb: Recommend — students recommend a build based on constraints and justify the choice

Layout: Grid of 4 build cards arranged horizontally (or 2×2 on narrow screens); filter controls above the grid

Filter controls:
- Slider "My Budget: $X" (range $0–$400, step $10)
- Dropdown "Experience Level": Beginner | Intermediate | Advanced
- Checkbox "School/Classroom use" — filters to builds that meet school safety rules

Build cards (each shows):
- Build name and photo-style illustration
- Budget range
- Plant capacity
- Complexity rating (1–3 stars)
- Key advantage (one sentence)
- Key constraint (one sentence)
- Estimated build time

Cards that don't match the filters are grayed out; matching cards are highlighted

Clicking a card: Opens an expanded panel with:
- Full materials list with estimated costs
- Assembly steps summary (numbered, 5–7 steps)
- Photo/illustration of finished build
- Recommended first crops
- "Upgrade pathway": What to add next to move to Tier 3 or 4

Interactivity:
- Filter controls update card visibility in real time
- "Compare two builds" mode: Select two build cards and see them side by side with matching attributes highlighted for comparison
- "Show classroom-safe only" toggle: Highlights builds approved for school use based on no sharp tools required, no concentrated chemicals stored unsupervised

Responsive: Cards stack vertically on narrow screens; expanded panel appears below or as modal
```

## Related Resources

- [Chapter 8: DIY Systems and School Projects](../../chapters/08-diy-school-projects/index.md)
