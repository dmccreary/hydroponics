# Chapter Design Decisions Log

**Skill:** book-chapter-generator  
**Date:** 2026-05-28  
**Start:** 2026-05-28 22:45:24  
**End:** 2026-05-28 22:54:44  
**Elapsed:** ~9 minutes  
**Status:** Approved by user

---

## Inputs

| Resource | Path | Notes |
|----------|------|-------|
| Course description | `docs/course-description.md` | Advanced HS / college, green-teal palette |
| Learning graph | `docs/learning-graph/learning-graph.json` | 500 nodes, 861 edges |
| Concept taxonomy | `docs/learning-graph/concept-taxonomy.md` | 15 groups |
| Project CLAUDE.md | `CLAUDE.md` | Mascot: Cress the Tree Frog |

---

## Edge Direction Validation

**Method:** `prereqs[edge['from']].add(edge['to'])` — dependency direction (from=dependent, to=prerequisite)

**Result:** PASS — 21 foundational concepts with zero prerequisites, all simple introductory terms:

| ID | Label |
|----|-------|
| 1 | Hydroponics Definition |
| 9 | Plant Growth Fundamentals |
| 10 | Cell Biology Basics |
| 78 | pH Scale Definition |
| 81 | Electrical Conductivity (EC) |
| 83 | Parts Per Million (ppm) |
| 220 | Relative Humidity Definition |
| 234 | Data Logger Basics |
| 246 | MicroPython vs CPython |
| 247 | Raspberry Pi Pico Overview |
| 249 | ESP32 Microcontroller Overview |
| 277 | I2C Protocol Basics |
| 279 | SPI Protocol Basics |
| 282 | Analog-to-Digital Converter |
| 285 | PWM: Pulse Width Modulation |
| 297 | MQTT Protocol Basics |
| 352 | Python Environment Setup |
| 369 | Linear Regression |
| 416 | Solar Energy Basics |
| 428 | Battery Storage Basics |
| 471 | Capital Budgeting Basics |

No advanced concepts appeared as foundational — direction confirmed correct.

---

## Taxonomy Distribution

| Group | Name | Concepts | ID Range |
|-------|------|----------|----------|
| FOUND | Foundation Concepts | 25 | 1–25 |
| PHYS | Plant Physiology | 35 | 26–60 |
| NUTR | Nutrients and Chemistry | 40 | 61–100 |
| SYST | Hydroponic System Types | 35 | 101–135 |
| DIY | DIY and School Systems | 25 | 136–160 |
| GROW | Growing Media and Crops | 25 | 161–185 |
| LITE | Lighting Science | 30 | 186–215 |
| ENVC | Environmental Control | 30 | 216–245 |
| UPYTH | MicroPython Programming | 70 | 246–315 |
| SENS | Sensors and Electronics | 30 | 316–345 |
| DATA | Data Analysis | 45 | 346–390 |
| SAFE | Food Safety and Sanitation | 25 | 391–415 |
| SOLAR | Solar Energy and Power | 30 | 416–445 |
| VERT | Vertical Farming | 25 | 446–470 |
| FIN | Financial Modeling | 30 | 471–500 |
| **Total** | | **500** | |

---

## Design Decisions

### Chapter Count

**Decision:** 21 chapters (~23.8 concepts/chapter average)

**Rationale:** 15 taxonomy groups, 500 concepts. Single-group chapters for groups with 25–35 concepts; splits for larger groups. Keeping related concepts together was prioritized over hitting an exact size target.

### Large Group Splits

| Group | Count | Split | Chapter(s) |
|-------|-------|-------|------------|
| UPYTH | 70 | ÷3 | Ch 12, 13, 14 |
| DATA | 45 | ÷2 | Ch 16, 17 |
| NUTR | 40 | ÷2 | Ch 4, 5 |
| PHYS | 35 | ÷2 | Ch 2, 3 |
| SYST | 35 | ÷2 | Ch 6, 7 |

**UPYTH split rationale:** Three natural tiers — language fundamentals (Ch 12), hardware protocols (Ch 13), networking/IoT + sensor libraries (Ch 14). Students must understand the language before they touch hardware; they must understand hardware before they connect to the network.

**DATA split rationale:** Data collection and analysis (pandas, NumPy, regression) is prerequisite to visualization and process control (Matplotlib, Plotly Dash, SPC). Splitting avoids loading both concerns into one session.

### Dependency Violations Found and Fixed

Three violations detected in the first validation run:

| Violation | Cause | Fix |
|-----------|-------|-----|
| Ch10 `CO2 Benefit Under High Light` (LITE:215) needs Ch11 `CO2 Concentration Effects` (ENVC:224) | LITE group boundary included concept whose prerequisite is in ENVC | Moved ID 215 to Ch 11; Ch 10 LITE range becomes 186–214 |
| Ch19 `Solar ROI Calculation` (SOLAR:443) needs Ch21 `Return on Investment` (FIN:475) | ROI financial concept in SOLAR group depends on FIN foundations | Moved ID 443 to Ch 21 |
| Ch19 `Solar ROI Calculation` (SOLAR:443) needs Ch21 `Capital Budgeting Basics` (FIN:471) | Same concept, second prerequisite | Same fix as above |

**Post-fix validation:** 0 violations, 500/500 concepts assigned.

### Chapters Above 25-Concept Target

Five chapters have 29–31 concepts, slightly above the 25-concept optimal:

| Ch | Count | Rationale for keeping intact |
|----|-------|------------------------------|
| 10 — Lighting Science | 29 | Highly cohesive physics topic; splitting at 15 each loses natural arc from photon physics to light cost |
| 11 — Environmental Control & CO₂ | 31 | Includes the 1 moved concept (215); all concepts tightly coupled to VPD/HVAC control loop |
| 15 — Sensors and Electronics | 30 | Hardware catalog; splitting by sensor type (chemical vs. physical) would fragment breadboard/PCB design concepts that apply to all sensors |
| 19 — Solar Energy and Power | 29 | Lost 1 concept (443) to Ch 21; remaining 29 form a single system-design arc |
| 21 — Financial Modeling | 31 | Gained 1 concept (443); all financial modeling concepts are needed together for Monte Carlo and dashboard capstone |

**Decision:** Accept 29–31 as within working range for this audience (advanced HS/college). Splitting further would push total to 26 chapters with six orphan chapters of 14–16 concepts.

---

## Final Approved Chapter Structure

| Ch | Title | Concepts | Primary Group |
|----|-------|----------|---------------|
| 1 | Introduction to Hydroponics | 25 | FOUND |
| 2 | Root Biology and Nutrient Absorption | 20 | PHYS |
| 3 | Water Transport, Photosynthesis, and Plant Health | 15 | PHYS |
| 4 | Essential Nutrients: Macro and Micro | 20 | NUTR |
| 5 | Nutrient Solution Chemistry and Mixing | 20 | NUTR |
| 6 | Passive and Basic Active Systems | 20 | SYST |
| 7 | Advanced Hydroponic Systems and Maintenance | 15 | SYST |
| 8 | DIY Systems and School Projects | 25 | DIY |
| 9 | Growing Media and Crop Management | 25 | GROW |
| 10 | Lighting Science | 29 | LITE |
| 11 | Environmental Control and CO₂ Management | 31 | ENVC |
| 12 | MicroPython Fundamentals | 25 | UPYTH |
| 13 | Hardware Interfaces and Sensor Programming | 25 | UPYTH |
| 14 | Networking, IoT, and Advanced MicroPython | 20 | UPYTH |
| 15 | Sensors and Electronics Hardware | 30 | SENS |
| 16 | Data Collection and Analysis | 25 | DATA |
| 17 | Data Visualization and Process Control | 20 | DATA |
| 18 | Food Safety and Pest Management | 25 | SAFE |
| 19 | Solar Energy and Power Systems | 29 | SOLAR |
| 20 | Vertical Farming and Commercial Operations | 25 | VERT |
| 21 | Financial Modeling and Hydroponics Economics | 31 | FIN |
| **Total** | | **500** | |
