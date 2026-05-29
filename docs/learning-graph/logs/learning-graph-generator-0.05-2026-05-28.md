# Learning Graph Generator Session Log

- **Skill version:** learning-graph-generator v0.05
- **Date:** 2026-05-28
- **Project:** Hydroponics: From Mason Jar to Vertical Farm
- **Repo:** dmccreary/hydroponics

---

## Python Tools Used

| Script | Version | Purpose |
|---|---|---|
| analyze-graph.py | (from skill) | DAG validation, quality metrics, indegree analysis |
| csv-to-json.py | v0.04 | CSV → vis-network JSON with metadata, groups, nodes, edges |
| taxonomy-distribution.py | (from skill) | Taxonomy balance report |

---

## Session Summary

### Step 0 — Setup
- Copied Python tools from skill into `docs/learning-graph/`
- Verified `mkdocs.yml` and `docs/` directory present

### Step 1 — Course Description Assessment
- Found `quality_score: 97` in `docs/course-description.md` frontmatter
- Score > 85 → skipped re-assessment to save tokens

### Step 2 — Concept List (500 concepts)
- Generated 500 concepts across 15 taxonomy categories
- Emphasis areas per user request:
  - **MicroPython Programming (UPYTH):** 70 concepts — full language stack from variables to async/await, hardware interfaces (I2C, SPI, UART, ADC, PWM, GPIO), Wi-Fi, MQTT, OTA, sensor libraries (Atlas Scientific, DS18B20, DHT22, SSD1306, relay, peristaltic pump)
  - **Data Analysis (DATA):** 45 concepts — pandas, NumPy, Matplotlib, Plotly, Dash, SPC, anomaly detection, time-series, regression
  - **Financial Modeling (FIN):** 30 concepts — NPV, IRR, break-even, OpEx/CapEx, energy cost modeling, declining solar projections, Monte Carlo simulation, Plotly dashboards
  - **Solar Energy (SOLAR):** 30 concepts — PV effect, MPPT, battery storage (lead-acid + LiFePO₄), off-grid/grid-tie/hybrid, energy audit, solar ROI
- Saved to `concept-list.md`

### Step 3 — Dependency Graph CSV
- Generated `learning-graph.csv` with columns: ConceptID, ConceptLabel, Dependencies (pipe-delimited), TaxonomyID
- Initial orphan found: concept 281 (UART Serial Communication) — fixed by adding dependency on 247 and making it a prerequisite for concept 340
- Final CSV: 500 rows, 861 dependency edges

### Step 4 — Quality Analysis (analyze-graph.py)
- Valid DAG ✅ | 0 cycles ✅ | 0 orphans ✅
- 21 foundational concepts (no prerequisites)
- Maximum dependency chain: 19 steps
- Longest path: MicroPython vs CPython → ... → Real-Time Dashboard Updates
- Top indegree: Soilless Growing Systems (25), Functions and def Keyword (22), Vertical Farming Definition (22)
- Report saved to `quality-metrics.md`

### Step 5 — Concept Taxonomy
- 15 categories; none exceeds 30% threshold
- Largest: UPYTH 14.0%, DATA 9.0%, NUTR 8.0%
- All categories in healthy range ✅
- Saved to `concept-taxonomy.md`

### Step 5b — taxonomy-names.json
- All 15 taxonomy IDs mapped to human-readable names
- Required by csv-to-json.py v0.04 for `classifierName` field

### Step 6 — TaxonomyID in CSV
- Embedded at generation time (not added separately)

### Step 7 — metadata.json
- Extracted from course-description.md
- Creator: Dan McCreary | Date: 2026-05-28 | License: CC BY-NC-SA 4.0

### Step 8 — color-config.json
- 15 colors chosen from the recommended 24-color palette
- Dark backgrounds: FOUND, PHYS, NUTR, SYST, ENVC, SENS, DATA, SAFE, VERT, FIN
- Light backgrounds: DIY, GROW, LITE, SOLAR

### Step 9 — learning-graph.json (csv-to-json.py v0.04)
- Command: `python csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json`
- Output: 500 nodes, 861 edges, 15 groups ✅

### Step 10 — Taxonomy Distribution (taxonomy-distribution.py)
- All 15 categories balanced, no warnings ✅
- Saved to `taxonomy-distribution.md`

### Step 11 — index.md
- Updated from template with hydroponics-specific content

### Step 12 — mkdocs.yml navigation updated
- Added: Concept Enumeration, Concept Taxonomy, Graph Quality Analysis, Taxonomy Distribution Report

### Build verification
- `mkdocs build --strict` passed ✅ (one info note about unlisted prompts/learning-graph.md, harmless)

---

## Files Created

| File | Description |
|---|---|
| `concept-list.md` | 500 numbered concepts in 15 groups |
| `learning-graph.csv` | Full dependency graph with TaxonomyID (500 rows, 861 edges) |
| `learning-graph.json` | vis-network JSON (metadata, groups, nodes, edges) |
| `concept-taxonomy.md` | 15 category definitions with TaxonomyID abbreviations |
| `taxonomy-names.json` | ID → human-readable name mapping |
| `color-config.json` | TaxonomyID → CSS color mapping |
| `metadata.json` | Dublin Core metadata for learning graph |
| `quality-metrics.md` | DAG validation and indegree analysis report |
| `taxonomy-distribution.md` | Category balance report |
| `index.md` | Learning graph section landing page |
| `logs/learning-graph-generator-0.05-2026-05-28.md` | This session log |
