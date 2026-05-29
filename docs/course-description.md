---
title: Course Description for Hydroponics
description: A detailed course description for Hydroponics including overview, topics covered and learning objectives in the format of the 2001 Bloom Taxonomy
quality_score: 97
---

# Course Description

## Title

Hydroponics: From Mason Jar to Vertical Farm

## Why This Course Matters

**Hydroponics** — growing plants in nutrient-rich water without soil — is one of
the fastest-growing sectors in agriculture. The global vertical farming market
exceeded $20 billion in 2026. Yet the same science that powers a rooftop
commercial farm can be explored for as little as $10 with a mason jar, a net
pot, and some mineral salts. This textbook bridges that gap: students learn
the plant physiology and nutrient chemistry that make hydroponics work, then
apply those concepts through interactive MicroSims and hands-on DIY builds
before scaling up to the economics and automation of commercial vertical farms.

Hydroponics also sits at the intersection of biology, chemistry, engineering,
food science, and data science — making it an ideal STEM vehicle for
project-based learning. A school garden project, an automated pH monitor
built on an Raspberry Pi Pico with a ph sensor, or a vertical farm business plan are all natural capstone outcomes for this course.

## Audience

Advanced high-school students and college students with an interest in plant
science, sustainable agriculture, engineering, or entrepreneurship. The book
emphasizes MicroSims — interactive browser-based simulations — as the primary
tool for building intuition about system dynamics, nutrient chemistry, and
plant physiology before touching physical hardware.

## Prerequisites

- Basic biology: plant cells, photosynthesis, cellular respiration
- Basic chemistry: pH scale, aqueous solutions, ions, concentration (ppm/mg/L)
- Comfort reading graphs, tables, and simple block diagrams
- No prior experience with hydroponics, electronics, or programming is required

## Topics Covered

1. **Introduction and history** — origins of hydroponics, William Gericke and
   the coining of the term in 1937, why soilless growing outperforms soil in
   controlled environments, overview of the field from hobby to commercial scale

2. **Plant physiology** — root anatomy and architecture, nutrient uptake
   mechanisms (passive diffusion vs. active transport), water transport (osmosis,
   transpiration, xylem flow), root exudates and their effect on rhizosphere pH,
   how root oxygen access drives growth rate

3. **Macro- and micronutrients** — the 17 essential plant nutrients, roles of
   each macronutrient (N, P, K, Ca, Mg, S) and micronutrient (Fe, Mn, Zn, Cu,
   B, Mo, Cl, Ni), deficiency symptom identification, toxicity thresholds,
   typical solution concentrations (ppm / mg·L⁻¹)

4. **Nutrient solution chemistry** — pH and its effect on nutrient availability
   (the Mulder chart), electrical conductivity (EC) as a proxy for total dissolved
   solids, cation-anion balance, mixing nutrient solutions from mineral salts
   (calcium nitrate, magnesium sulfate/Epsom salt, potassium nitrate),
   pH drift causes and correction, buffering

5. **Hydroponic system types** — passive vs. active systems; Kratky (no pump,
   no electricity), Deep Water Culture (DWC), Nutrient Film Technique (NFT),
   Ebb-and-Flow (flood-and-drain), Aeroponics, Fogponics; trade-offs in
   complexity, cost, failure modes, and crop suitability

6. **DIY and school systems** — Kratky mason jar setup ($10–15), DWC 5-gallon
   bucket ($50–120), PVC pipe NFT channel, recycled-container builds; materials
   sourcing (hardware store, online), safety and sanitation for school settings,
   recommended beginner crops (lettuce, basil, cilantro, mint, microgreens)

7. **Growing media** — rockwool, expanded clay (hydroton), coconut coir,
   perlite, vermiculite, pumice, gravel; physical properties (water retention,
   air porosity, pH neutrality, reusability), how to prepare and sterilize media

8. **Lighting** — photosynthetically active radiation (PAR, 400–700 nm),
   photosynthetic photon flux density (PPFD, µmol·m⁻²·s⁻¹), daily light
   integral (DLI), LED vs. HID vs. fluorescent comparisons (energy efficiency,
   heat output, spectrum), photoperiod requirements, light recipes for
   vegetative vs. flowering stages

9. **Environmental control** — temperature (air and solution), relative humidity,
   CO₂ enrichment, vapor pressure deficit (VPD) and its effect on transpiration,
   HVAC basics for grow rooms, data loggers and alarm setpoints

10. **Automation and IoT** — analog and digital sensors (pH electrode, EC probe,
    temperature thermistor, humidity/CO₂ sensors), microcontrollers (Raspberry Pi Pico, ESP32, Raspberry Pi 5), dosing pumps and relay boards, MicroPython, MicroPython libraries,
    open-source software platforms (Mycodo, OpenHab, Blynk), data logging and
    dashboard visualization, wireless sensor networks (NRF24L01+, Wi-Fi, MQTT)

11. **Food safety and sanitation** — biofilm formation in recirculating systems
    (algal-bacterial complexes), human pathogen risks in hydroponic lettuce
    (Listeria monocytogenes, Salmonella, Shiga toxin-producing E. coli), HACCP
    principles applied to controlled-environment agriculture, water source
    selection (municipal vs. well vs. rainwater), cleaning and sanitizing
    protocols (bleach, hydrogen peroxide, UV), food safety break points

12. **Pest and disease management** — root rot (Pythium), powdery mildew,
    algae blooms, fungus gnats, aphids, spider mites; Integrated Pest Management
    (IPM) without soil; biological controls; quarantine practices; early detection

13. **Vertical farming and urban agriculture** — tower systems and stacked
    multi-tier racks, commercial operations (AeroFarms, Bowery Farming, Plenty,
    Gotham Greens), energy and infrastructure costs, profitability challenges,
    proximity to consumers ("food miles"), rooftop and building-integrated farms,
    container farms

14. **Sustainability and economics** — water use efficiency (up to 90% less than
    field agriculture), energy consumption vs. food-miles saved, land footprint,
    DIY system budgets ($10–$400), commercial system ROI modeling,
    scaling from school garden to startup, grants and urban agriculture policy

## Topics NOT Covered

The following topics are adjacent but outside the scope of this textbook:

- **Soil-based growing** — referenced only for comparison; not taught in depth
- **Aquaponics** — integrating fish waste as a nutrient source is a natural
  extension but is treated as a boundary topic, not a core chapter
- **Advanced plant breeding and genetics** — CRISPR, tissue culture, and
  varietal selection are not covered
- **Large-scale greenhouse engineering** — structural load, HVAC sizing for
  commercial facilities, and building permits are beyond scope
- **Cannabis cultivation** — excluded for educational context; the physiology
  applies but crop-specific content is not included
- **Soil science** — not a soil-focused course; pedology and composting are
  out of scope

## Learning Outcomes

By the end of this textbook, the reader will be able to:

### Remember

- Name and describe the six major hydroponic system types (Kratky, DWC, NFT,
  Ebb-and-Flow, Aeroponics, Fogponics) and their defining characteristics
- List the six macronutrients (N, P, K, Ca, Mg, S) and at least six
  micronutrients required for plant growth, and state the role of each
- Recall key environmental parameter ranges: solution pH (5.5–6.5), EC units
  (mS/cm), PAR wavelength range (400–700 nm), and VPD (kPa)
- Identify the historical figure who coined the term "hydroponics" (William
  Gericke, University of California, 1937)
- Name common growing media (rockwool, clay pellets, coco coir, perlite) and
  their primary physical properties
- List the food safety pathogens of concern in hydroponic leafy greens
  (Listeria monocytogenes, Salmonella, STEC) and the conditions that favor them

### Understand

- Explain how nutrient ions move from solution into plant roots through passive
  diffusion and active transport mechanisms, and why oxygen at the root zone
  accelerates uptake
- Describe how pH affects the bioavailability of each major nutrient group, and
  explain why pH drifts upward or downward in a running system
- Explain the differences between passive (Kratky) and active (DWC, NFT)
  systems in terms of oxygen delivery, pump-failure risk, and crop suitability
- Describe how biofilm forms on wetted surfaces in recirculating systems, why
  it harbors human pathogens, and why it is harder to eliminate than planktonic
  bacteria
- Explain why LED fixtures are more energy-efficient than HID for indoor
  growing, and what "light recipe" means for different crop stages
- Describe how commercial vertical farms stack growing layers to multiply yield
  per square foot of building footprint, and what energy trade-offs that creates

### Apply

- Mix a balanced two-part or three-part nutrient solution from raw mineral salts
  (calcium nitrate, magnesium sulfate, potassium nitrate) to a target EC and pH
- Build a functional Kratky mason jar or DWC bucket system, select appropriate
  growing media and net pots, and transplant seedlings into it
- Adjust the pH of a nutrient solution using pH-Up and pH-Down solutions, and
  verify with a calibrated pH meter
- Write simple MicroPython or ESP32 code to read a pH or temperature sensor, display
  the value on an LCD, and log it to a CSV file
- Select an appropriate hydroponic system type and crop for a given space,
  budget, and experience level, justifying the choice with cost and complexity
  trade-offs

### Analyze

- Diagnose nutrient deficiency symptoms from photographs of plant leaves,
  matching visual patterns (interveinal chlorosis, tip burn, purple stems) to
  specific nutrient shortfalls
- Trace a pH drift trend in logged sensor data to its likely root cause
  (root exudate release, bicarbonate buffering, bacterial nitrification, or
  evaporation concentration)
- Interpret a week's worth of pH, EC, and temperature data from a running
  system and identify the corrective actions needed
- Compare the energy cost per kilogram of lettuce produced by DWC vs. NFT vs.
  aeroponics under different lighting scenarios
- Assess the food safety risk profile of a specific system (e.g., recirculating
  NFT for lettuce) by identifying contamination entry points and spread pathways

### Evaluate

- Evaluate the trade-offs between a DIY Kratky setup ($10–15), a DWC bucket
  system ($50–120), and a commercial turnkey unit ($400+) for a school
  classroom context, weighing cost, maintenance, and learning value
- Judge which hydroponic system best fits a given scenario: a middle-school
  science classroom, a studio apartment, a restaurant herb garden, or a
  rooftop urban farm — and defend the recommendation with quantitative data
- Assess the economic viability of a small commercial vertical lettuce farm,
  given stated energy costs, yield per m², labor, and produce prices
- Evaluate competing sustainability claims (water savings vs. energy use vs.
  food-miles vs. land footprint) and arrive at a reasoned net-impact judgment
  for a specific location and crop

### Create

- Design a complete small-scale hydroponic system — from component selection,
  bill of materials, and nutrient schedule through sensor wiring and
  environmental automation — and predict its weekly yield using MicroSim models
- Build and program an IoT monitoring dashboard (MicroPython on Raspberry Pi
  Pico W or ESP32 + open-source platform) that reads pH, EC, and temperature
  every 5 minutes, logs data to a spreadsheet, and sends an alert when values
  drift outside safe bounds
- Develop a capstone school garden project including system design, crop
  rotation plan, nutrient schedule, food safety sanitation protocol, and a
  cost-benefit analysis suitable for a grant application
- Propose a vertical farming business plan for a specific urban location,
  including system architecture, crop selection, energy budget, staffing,
  revenue model, and projected break-even timeline
