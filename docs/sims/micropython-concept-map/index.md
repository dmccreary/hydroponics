---
title: MicroPython Concept Map
description: MicroPython Concept Map
status: scaffold
library: p5.js
bloom_level: Understand (L2) and Remember (L1)
---

# MicroPython Concept Map



<iframe src="main.html" width="100%" height="642"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 12: MicroPython Fundamentals](../../chapters/12-micropython-fundamentals/index.md).

```text
Type: concept-map
**sim-id:** micropython-concept-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the relationships between the 25 MicroPython concepts in this chapter, organized as a visual dependency map from hardware (bottom) to language (middle) to OOP (top).

Bloom Level: Understand (L2) and Remember (L1)
Bloom Verb: Organize — students see how hardware setup, data types, control flow, functions, and OOP build on each other.

Layout: Canvas 800×520. Four horizontal tiers:
- Bottom tier (Hardware): Raspberry Pi Pico, Pico W, ESP32, MicroPython Installation, Thonny IDE, REPL
- Middle tier (Language Fundamentals): Variables, Integer/Float, String, Boolean, None, Lists, Tuples, Dicts
- Upper-middle tier (Control Flow and Functions): If-Else, For Loops, While Loops, Break/Continue, Functions, Default Parameters, Lambda
- Top tier (OOP): Classes and Objects, Inheritance

Nodes: Rounded rectangles, color-coded by tier (dark blue bottom → teal middle → green upper → gold top). Each node labeled with concept name.

Edges: Arrows from prerequisite to dependent concept. On hover, arrows highlight in orange and a tooltip shows "concept A enables concept B".

Interactivity:
- Clicking a node highlights it and all directly connected nodes (predecessors and successors) in orange; all others dim to 30% opacity.
- Click background to deselect.
- Toggle "Show Code Examples": hovering a node shows a 1–4 line code snippet popup illustrating that concept.

Responsive: Scales to fit container width.
```

## Related Resources

- [Chapter 12: MicroPython Fundamentals](../../chapters/12-micropython-fundamentals/index.md)
