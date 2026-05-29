# Learning Graph for Hydroponics

[Open Learning Graph Viewer Fullscreen](../sims/graph-viewer/main.html){ .md-button .md-button--primary }

<iframe src="../sims/graph-viewer/main.html" width="100%" height="600px" frameborder="0"></iframe>

This section contains the learning graph for the *Hydroponics: From Mason Jar to Vertical Farm* textbook. A learning graph is a graph of concepts used in this textbook. Each concept is represented by a node in a network graph. Concepts are connected by directed edges that indicate what concepts each node depends on before that concept is understood by the student.

A learning graph is the foundational data structure for intelligent textbooks that can recommend learning paths. A learning graph is like a roadmap of concepts to help students arrive at their learning goals.

At the left of the learning graph are prerequisite or foundational concepts. They have no outbound edges — they only have inbound edges for other concepts that depend on understanding these foundational prerequisites. At the far right are the most advanced concepts in the course. To master these concepts you must understand all the concepts that they point to.

**Graph summary: 500 concepts · 861 edges · 15 taxonomy categories · 21 foundational concepts · longest path: 19 steps**

## Course Description

The [Course Description](../course-description.md) is the source document for the concepts included in this course. It uses the 2001 Bloom taxonomy to order learning objectives and covers 14 major topic areas from plant physiology and nutrient chemistry through MicroPython automation, data analysis, solar energy, vertical farming, and financial modeling.

## List of Concepts

The [Concept List](./concept-list.md) enumerates all 500 concepts in Title Case, grouped by taxonomy category. Each concept is a short label (≤32 characters) suitable for display in a network graph node.

## Concept Dependency List

The dependency graph is provided in two formats:

- [learning-graph.csv](learning-graph.csv) — tabular format with ConceptID, ConceptLabel, Dependencies (pipe-delimited), TaxonomyID
- [learning-graph.json](learning-graph.json) — vis-network.js JSON format with metadata, groups, nodes, and edges for interactive visualization

## Analysis and Documentation

### Course Description Quality Assessment

[View the Course Description Quality Assessment](course-description-assessment.md)

- Quality score: 97/100 (Excellent)
- 14 topic areas with full Bloom's taxonomy outcomes
- Estimated concept yield: 200–254 concepts from the description alone; extended to 500 with MicroPython, data analysis, solar, and financial modeling emphasis

### Learning Graph Quality Validation

[View the Learning Graph Quality Validation](quality-metrics.md)

- **500 concepts · 861 edges · Valid DAG** ✅
- 0 orphaned nodes ✅
- 0 cycles ✅
- 21 foundational concepts (no prerequisites)
- Maximum dependency chain: 19 steps (MicroPython → CSV → pandas → Plotly → Dash → Real-Time Dashboard)
- Top prerequisite: Soilless Growing Systems (indegree 25), Functions and def Keyword (indegree 22)

### Concept Taxonomy

[View the Concept Taxonomy](concept-taxonomy.md)

15 taxonomy categories color-coded in the graph viewer:

| Category | ID | Count | Color |
|---|---|---|---|
| Foundation Concepts | FOUND | 25 | SteelBlue |
| Plant Physiology | PHYS | 35 | DarkGreen |
| Nutrients and Chemistry | NUTR | 40 | Teal |
| Hydroponic System Types | SYST | 35 | DodgerBlue |
| DIY and School Systems | DIY | 25 | LimeGreen |
| Growing Media and Crops | GROW | 25 | OliveDrab |
| Lighting Science | LITE | 30 | Gold |
| Environmental Control | ENVC | 30 | DarkGoldenrod |
| MicroPython Programming | UPYTH | 70 | MediumPurple |
| Sensors and Electronics | SENS | 30 | DarkSlateBlue |
| Data Analysis | DATA | 45 | Indigo |
| Food Safety and Sanitation | SAFE | 25 | Crimson |
| Solar Energy and Power | SOLAR | 30 | Orange |
| Vertical Farming | VERT | 25 | DarkOrchid |
| Financial Modeling | FIN | 30 | SaddleBrown |

### Taxonomy Distribution

[View the Taxonomy Distribution Report](./taxonomy-distribution.md)

All 15 categories are within the healthy 5–15% range. No category exceeds 30%. The largest category is MicroPython Programming (70 concepts, 14%) reflecting the course's emphasis on hands-on sensor automation with Raspberry Pi Pico and ESP32.
