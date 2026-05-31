---
title: Lighting Science
description: PAR, PPFD, DLI, photoperiod, LED vs HID vs fluorescent technology, light recipes, PPFD maps, inverse square law, and energy cost calculations for indoor growing.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# Lighting Science

## Summary

This chapter covers the physics and engineering of plant lighting from first principles: photosynthetically active radiation, photon flux density (PPFD), daily light integral (DLI), photoperiod control, and the comparative efficiency of LED versus HID versus fluorescent technologies. Students learn to read a PPFD map, calculate DLI for a target crop, design a light schedule, write a light recipe for vegetative and flowering stages, and calculate the energy cost per kilogram of yield — the key metric for evaluating any indoor growing operation.

## Concepts Covered

This chapter covers the following 29 concepts from the learning graph:

1. Light and Plant Growth
2. Photosynthetic Active Radiation
3. PAR Wavelength Range
4. Red Light Effects on Plants
5. Blue Light Effects on Plants
6. Far-Red Light Effects
7. PPFD: Photon Flux Density
8. Daily Light Integral (DLI)
9. DLI Calculation
10. Photoperiod Requirements
11. Long-Day vs Short-Day Plants
12. LED Grow Light Technology
13. LED Spectrum and Efficiency
14. HID Lighting (HPS and MH)
15. Fluorescent Lighting (T5/T8)
16. LED vs HID Comparison
17. Light Intensity and Canopy
18. Inverse Square Law for Light
19. Grow Light Mounting Height
20. Light Uniformity and PPFD Map
21. Heat Output From Lighting
22. Light Schedules and Photoperiod
23. Light Recipes for Crop Stages
24. Lumens vs PPFD Distinction
25. Light Efficacy µmol/J
26. Light Meter and Quantum Sensor
27. Photoperiod Control Relay
28. Light Cost Per kWh
29. Light Energy to Biomass

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Hydroponics](../01-introduction/index.md)
- [Chapter 2: Root Biology and Nutrient Absorption](../02-root-biology/index.md)

---

!!! mascot-welcome "Cress shines a light on photosynthesis engineering"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 10! Light is the energy source for every gram of biomass your plants produce. In a controlled indoor environment, you are paying for every photon — so understanding the physics of how plants use light, how to measure it correctly, and how to deliver it efficiently is not optional. This chapter gives you the vocabulary and calculation tools to evaluate any grow light and design a lighting system that maximizes yield per watt of electricity.

## Light and Plant Growth: The Basics

Before introducing the measurement vocabulary, recall from Chapters 1 and 2 that photosynthesis converts light energy into chemical energy stored as glucose. The efficiency of this conversion, and therefore the growth rate of the plant, depends on three light parameters that the grower can control:

1. **Intensity** — how many photons reach the leaf surface per unit time (measured in PPFD)
2. **Spectrum** — which wavelengths of light are delivered (measured across the PAR range)
3. **Duration** — how many hours per day the plant receives light (the photoperiod)

All three interact: a plant receiving the right spectrum but too few hours will be light-limited; a plant receiving many hours at the wrong spectrum will grow slowly; a plant receiving too much intensity can suffer photoinhibition (the photosynthetic machinery becomes overwhelmed and efficiency drops).

## Photosynthetically Active Radiation (PAR)

**Photosynthetically active radiation (PAR)** is defined as the range of wavelengths from **400 to 700 nanometers (nm)** — the portion of the electromagnetic spectrum that plant pigments can absorb for photosynthesis. This range corresponds roughly to visible light (violet through red), though human eyes perceive some wavelengths in this range more or less brightly than plants use them.

**PAR wavelength range details:**

- **Blue light (400–500 nm)**: Absorbed by chlorophyll b and carotenoids; promotes compact vegetative growth, thick dark green leaves, and strong root development. High blue light produces shorter, stockier plants.
- **Green light (500–600 nm)**: Partially reflected by chlorophyll (which is why plants appear green), but penetrates the leaf canopy better than red or blue — reaching lower leaves and interior canopy. Not wasted as commonly believed.
- **Red light (600–700 nm)**: The most efficient wavelength for photosynthesis per photon — absorbed by chlorophyll a at its peak efficiency (~680 nm). Promotes leaf expansion, elongation, and fast vegetative growth. Too much red without blue produces etiolated (stretched) plants.
- **Far-red light (700–750 nm)**: Just outside the PAR range but biologically active. Far-red activates phytochrome Pfr form, which controls flowering time in photoperiod-sensitive plants. Far-red supplementation accelerates flowering initiation in long-day plants and is used commercially to manipulate crop timing.

!!! mascot-thinking "Why does 'lumens' measure the wrong thing for plants?"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress taps chin thoughtfully">
    Lumens measure light output as perceived by the human eye — with green light weighted most heavily because human eyes are most sensitive to green. Plants, however, use red and blue most efficiently. A lamp can produce many lumens (bright to human eyes) while delivering few photosynthetically active photons. This is why lumen ratings on grow lights are nearly meaningless for plant science. Always evaluate grow lights in PPFD (µmol/m²/s) and efficacy (µmol/J), not lumens or lux.

## PPFD: Photosynthetic Photon Flux Density

**PPFD** (Photosynthetic Photon Flux Density) is the measure of how many photons in the PAR range (400–700 nm) fall on a given surface area per second. It is expressed in **micromoles of photons per square meter per second (µmol·m⁻²·s⁻¹)**.

PPFD is the instantaneous intensity measurement — a snapshot at one moment. It varies across the canopy (higher directly beneath the light, lower at the edges) and changes with mounting height (inverse square law).

**Typical PPFD ranges for common crops:**

| Crop / Stage | PPFD Target (µmol·m⁻²·s⁻¹) |
|-------------|--------------------------|
| Seedlings / propagation | 100–250 |
| Lettuce, herbs (vegetative) | 200–400 |
| Leafy greens (high-yield commercial) | 400–600 |
| Tomatoes, peppers (vegetative) | 400–600 |
| Tomatoes, peppers (fruiting) | 600–1,000+ |
| Cannabis / high-demand crops | 800–1,500 |

Beyond approximately 800–1,000 µmol·m⁻²·s⁻¹, most crops saturate their photosynthetic capacity (the **light saturation point**) and additional light produces little additional growth while increasing electricity cost. This light saturation point can be raised by increasing CO₂ concentration (covered in Chapter 11).

## Daily Light Integral (DLI)

**Daily light integral (DLI)** is the total cumulative photon dose a plant receives over a full day — the sum of all PPFD measurements across the photoperiod. DLI is expressed in **moles of photons per square meter per day (mol·m⁻²·d⁻¹)**.

DLI integrates both intensity and duration into a single number, making it the most useful metric for comparing different growing scenarios (e.g., 12h of 500 µmol·m⁻²·s⁻¹ vs. 18h of 350 µmol·m⁻²·s⁻¹).

**DLI calculation:**

\[ \text{DLI} = \text{PPFD} \times \text{photoperiod (hours)} \times 3600 \div 1{,}000{,}000 \]

The 3600 converts hours to seconds; dividing by 1,000,000 converts micromoles to moles.

Example: PPFD = 400 µmol·m⁻²·s⁻¹ for 16 hours:

\[ \text{DLI} = 400 \times 16 \times 3600 \div 1{,}000{,}000 = 23.0 \text{ mol·m⁻²·d⁻¹} \]

**Target DLI by crop:**

| Crop | Target DLI (mol·m⁻²·d⁻¹) |
|------|--------------------------|
| Lettuce, spinach | 12–17 |
| Basil, herbs | 14–20 |
| Tomatoes (vegetative) | 20–30 |
| Tomatoes (fruiting) | 25–40 |
| Cucumbers | 22–35 |
| Strawberries | 12–17 |

## Photoperiod Requirements

**Photoperiod** is the number of hours of light per day. Different crops respond differently to photoperiod:

- **Day-neutral plants**: Growth rate and flowering are not controlled by day length. Lettuce varieties grown for leaf production, most herbs, and most vegetable crops used in hydroponic production are day-neutral. Photoperiod affects DLI (longer days → more total photons) but not flowering time.
- **Long-day plants**: Flower when the photoperiod exceeds a critical threshold (typically 14–16 hours). Spinach, strawberries, and some lettuce varieties are long-day plants. They will not bolt (flower prematurely) in short-day conditions.
- **Short-day plants**: Flower when the photoperiod falls below a critical threshold (typically 12–14 hours). Chrysanthemums and poinsettias are classic examples. Some cannabis varieties are also short-day.

**Standard photoperiod schedules:**

- **18h light / 6h dark**: Standard for vegetative growth in most indoor crops. Maximizes DLI without eliminating the dark period needed for respiration and hormonal cycling.
- **16h / 8h**: Good for lettuce and herbs; slightly reduced DLI compared to 18h but lower electricity cost.
- **12h / 12h**: Standard for triggering flowering in short-day plants.
- **24h continuous light**: Used experimentally and for some propagation stages; some crops tolerate it well (lettuce), others suffer (tomatoes need a dark period).

A **photoperiod control relay** (a simple digital timer connected to the grow light circuit) automates on/off cycling. Solid-state relays rated for the light's amperage avoid the wear of mechanical timers.

## Grow Light Technologies

### LED Grow Light Technology

**LED (light-emitting diode) technology** has transformed indoor growing economics over the past decade. LEDs produce light when current passes through a semiconductor junction; the emitted wavelength depends on the semiconductor materials used.

**LED grow light advantages:**

- **High efficacy**: Modern LED grow lights achieve 2.5–3.5 µmol/J (micromoles of PAR photons per joule of electricity) — two to four times more efficient than HPS at producing photosynthetically useful light
- **Low heat output**: LEDs convert most energy to light rather than heat; radiant heat directed at the canopy is minimal, allowing closer mounting and reducing HVAC load
- **Long lifespan**: Typically rated at 50,000–100,000 hours; lamps rarely need replacement during a system's operational life
- **Spectrum tunability**: Adjustable-spectrum LEDs allow the grower to shift the blue/red ratio for different growth stages

**LED spectrum and efficacy**: Modern commercial LEDs for plant growth use a mix of deep red (~660 nm), blue (~450 nm), and white phosphor-converted LEDs. The white phosphors provide a broad-spectrum fill that covers green and yellow wavelengths for canopy penetration.

### HID Lighting (HPS and MH)

**High-intensity discharge (HID)** lights dominated commercial greenhouse and indoor growing before LED matured. Two types are relevant:

- **High-pressure sodium (HPS)**: Produces a warm orange-yellow spectrum peaking around 590–620 nm. Highly efficient for vegetative and fruiting crops, with efficacy of 1.0–1.5 µmol/J. Still used in large commercial greenhouses for its proven track record and lower upfront cost.
- **Metal halide (MH)**: Produces a broader, cooler blue-white spectrum. Better for vegetative stages; lower efficacy than HPS (0.8–1.2 µmol/J). Often used in combination with HPS (MH for veg, HPS for flower).

**HID heat output**: A 1,000W HPS fixture produces approximately 3,400 BTU/hr of heat directly into the growing space. This significantly increases HVAC load and requires maintaining greater mounting distances from the canopy (typically 45–90 cm) to avoid heat stress.

### Fluorescent Lighting (T5/T8)

**T5 and T8 fluorescent tubes** are low-intensity grow lights appropriate for seedling propagation, microgreens, and low-light crops. They produce relatively low PPFD (50–200 µmol·m⁻²·s⁻¹ at canopy level) and are not suitable for fruiting crops or high-yield leafy green production.

**Advantages**: Low cost, widely available, produce minimal heat, easy to mount very close to seedling trays (15–30 cm above canopy).

**T5 HO (high-output)** fixtures are the preferred fluorescent option for propagation — they deliver approximately 3× the output of standard T8 tubes at similar fixture cost.

Modern fluorescent is being rapidly replaced by LED bars in propagation and microgreen applications due to LED's higher efficacy and longer lifespan.

### LED vs. HID Comparison

| Parameter | LED (modern) | HPS | MH |
|-----------|-------------|-----|-----|
| Efficacy (µmol/J) | 2.5–3.5 | 1.0–1.5 | 0.8–1.2 |
| Heat to canopy | Very low | High | High |
| Lifespan | 50,000–100,000 hr | 10,000–20,000 hr | 8,000–15,000 hr |
| Upfront cost | High | Low–moderate | Moderate |
| Electricity cost (for equal DLI) | Lowest | 2–3× LED | 2.5–4× LED |
| Spectrum control | Excellent (tunable) | Fixed warm spectrum | Fixed cool spectrum |
| Break-even vs. HPS (energy) | ~2–4 years | Baseline | — |

## The Inverse Square Law for Light

The **inverse square law** describes how light intensity decreases with distance from a point source:

\[ \text{Intensity} \propto \frac{1}{d^2} \]

Doubling the distance between a light source and the canopy reduces intensity to one-quarter of its original value. Halving the distance quadruples intensity.

**Practical consequences for grow light mounting height:**

- Moving an LED fixture from 60 cm to 30 cm above the canopy (half the distance) quadruples the PPFD at the canopy — potentially causing light stress if PPFD was already near saturation.
- Adding a second layer of growing racks below an LED (at twice the mounting distance) receives only one-quarter the PPFD delivered to the top layer — significant for multi-tier vertical farming design.
- The inverse square law applies most strictly to point light sources; modern LED panels are area sources and the intensity drop-off is less dramatic than the strict 1/d² relationship at close distances.

**Grow light mounting height** recommendations vary by fixture type:

- Large LED panels (600W+): 45–75 cm above canopy for most crops
- Small LED bars: 20–40 cm above canopy
- T5 fluorescent: 15–30 cm above canopy for seedlings
- HPS/MH 1000W: 60–100 cm above canopy (heat distance)

## Light Uniformity and the PPFD Map

A **PPFD map** shows the spatial distribution of photon flux density across a canopy area, typically measured as a grid of point measurements at canopy height. Commercial grow lights are sold with PPFD maps at multiple mounting heights, showing the intensity distribution at each point on a grid.

**Light uniformity** is expressed as the ratio of minimum to average PPFD across the mapped area. A ratio above 0.75 is considered good uniformity; below 0.5 means significant areas of the canopy are seriously under-lit even if the center is well-supplied.

In a well-designed NFT or DWC array, grow lights are arranged to provide overlapping coverage that minimizes hot spots and under-lit zones. Single-fixture setups often show a bell-shaped PPFD distribution (highest intensity center, declining edges) — acceptable in smaller systems but problematic at scale.

#### Diagram: PPFD and DLI Calculator
<iframe src="../../sims/ppfd-dli-calculator/main.html" width="100%" height="702" scrolling="no"></iframe>
<details markdown="1">
<summary>PPFD and DLI Interactive Calculator</summary>
Type: microsim
**sim-id:** ppfd-dli-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to interactively calculate DLI from PPFD and photoperiod, compare different lighting scenarios for energy cost, and understand how the inverse square law affects PPFD with mounting height change.

Bloom Level: Apply (L3)
Bloom Verb: Calculate — students calculate DLI, energy cost, and mounting height effects using real formulas

Canvas layout:
- Left panel (50%): Calculator with three sections:
  Section 1 "DLI Calculator":
    Inputs: PPFD (slider 50–1500 µmol·m⁻²·s⁻¹), Photoperiod (slider 8–24 hours)
    Output: DLI in mol·m⁻²·d⁻¹, displayed numerically and as a horizontal bar against crop target ranges (color-coded: red=too low, green=optimal, orange=high)
  Section 2 "Energy Cost":
    Inputs: Light wattage (number input), electricity cost $/kWh (number input, default 0.12)
    Output: Daily energy cost ($), monthly energy cost ($), annual energy cost ($)
  Section 3 "Inverse Square Law":
    Inputs: Current PPFD at known height (number input), current height (cm slider 10–200), new height (cm slider 10–200)
    Output: New PPFD at the new height, with warning if result exceeds 1200 µmol·m⁻²·s⁻¹ (light stress risk)

- Right panel (50%): Crop target DLI reference chart
  Horizontal bar chart showing DLI target ranges for: Lettuce, Basil, Tomato veg, Tomato fruit, Cucumber, Strawberry, Seedlings
  Current calculated DLI shown as a vertical orange line moving across all bars as the calculator updates
  Each bar is clickable to set DLI calculator inputs to the recommended range midpoint

Interactivity:
- All sliders and inputs update output in real time
- "Compare two scenarios" button: Expands to show a side-by-side comparison of two different PPFD/photoperiod combinations with their DLI and energy cost
- Hover over any output: Tooltip shows the formula used and what each variable means

Responsive: Stacks to vertical layout on narrow screens
</details>

## Light Recipes for Crop Stages

A **light recipe** specifies the spectrum, intensity, and photoperiod appropriate for each stage of crop development. Commercial controlled-environment agriculture operations have developed stage-specific recipes that optimize growth rate, quality, and yield.

**Typical light recipe for lettuce:**
- Germination (days 1–5): 100–150 µmol·m⁻²·s⁻¹, 16h photoperiod, broad spectrum
- Seedling (days 6–14): 150–250 µmol·m⁻²·s⁻¹, 18h photoperiod, 20% blue / 80% red
- Vegetative (days 15–30): 300–450 µmol·m⁻²·s⁻¹, 18h photoperiod, 15% blue / 85% red
- Pre-harvest darkening (optional, 24–48h before harvest): Complete darkness — reduces nitrate concentration in leaves

**Spectrum manipulation for quality:**
- High blue (30–40% of total spectrum): Promotes compact growth, darker green leaves, higher anthocyanin in red varieties — preferred for fresh market quality
- High red (90%+ of total spectrum): Promotes fast leaf expansion and high DW yield — preferred for maximum production efficiency
- Far-red supplementation (5–10% of total): Accelerates stem elongation; used in final days before harvest to increase fresh weight by driving leaf expansion

## Heat Output and Light Cost

**Heat output from lighting** affects the HVAC requirements of the growing space. While LEDs are much more efficient than HPS, they still convert some input power to heat. A 600W LED fixture operating in a 10m² growing space adds significant heat load:

Heat load = Wattage × (1 − efficacy as fraction of total input)

For a grow light with 35% photon conversion efficiency: Heat = 600W × 0.65 = 390W of heat to be removed by HVAC.

**Light cost per kWh** and **light energy to biomass** are the two most important economic metrics for indoor lighting:

- **Light cost per kg of lettuce**: With 1 kWh at $0.12 producing approximately 6.25 g of lettuce fresh weight under efficient LED conditions, the energy cost per kg is approximately $0.12 / 0.00625 = $19.20/kg — lighting alone represents a significant portion of operating costs.
- This is why improving light efficacy (µmol/J) and choosing crops with high DLI efficiency is central to the economics of vertical farming (Chapter 21).

**Light meter and quantum sensor**: A quantum sensor (also called PAR meter) measures PPFD directly, using silicon photodiodes weighted to the 400–700 nm range. Consumer-grade quantum sensors (Apogee MQ-500, Li-Cor) provide accurate readings for research and commercial growing. Smartphone-based lux meters with conversion factors are less accurate but usable for educational purposes.

## Key Takeaways

- **PAR (400–700 nm)** is the light range plants use for photosynthesis; lumens measure human perception and are useless for plant science.
- **PPFD (µmol·m⁻²·s⁻¹)** is instantaneous intensity at the canopy; **DLI (mol·m⁻²·d⁻¹)** is the cumulative daily photon dose — the more useful planning metric.
- **DLI = PPFD × hours × 3600 ÷ 1,000,000**: Memorize or bookmark this formula.
- **LED lights** are 2–3× more electrically efficient than HPS for plant growth (measured in µmol/J); the higher upfront cost pays back in electricity savings in 2–4 years.
- **The inverse square law**: doubling light distance reduces PPFD to one-quarter; halving distance quadruples PPFD.
- **Light recipes** specify spectrum, intensity, and photoperiod for each crop stage; higher blue promotes compact quality; higher red promotes maximum biomass yield.
- **Photoperiod control** via relay timers or microcontrollers (Chapter 13) automates light scheduling and enables photoperiod manipulation for flowering crops.
- **Energy cost** is the primary economic constraint in indoor lighting — evaluate every grow light purchase in µmol/J and $/kWh, not watts or lumens.

??? question "Check Your Understanding — Click to reveal the answer"
    **Question:** A grower is running a 400W LED fixture at 60 cm above a lettuce canopy and measures 450 µmol·m⁻²·s⁻¹ with a quantum sensor. They want to achieve a DLI of 17 mol·m⁻²·d⁻¹. How many hours per day should the lights run?

    **Answer:** Rearranging the DLI formula: Hours = DLI × 1,000,000 ÷ (PPFD × 3600) = 17,000,000 ÷ (450 × 3600) = 17,000,000 ÷ 1,620,000 ≈ 10.5 hours. The grower should run lights for approximately 10.5 hours per day to achieve the target DLI of 17 mol·m⁻²·d⁻¹. This is on the lower end of the optimal range for lettuce (12–17 mol·m⁻²·d⁻¹) — increasing to 12.5 hours would reach the middle of the target range.

!!! mascot-celebration "Chapter 10 complete — you can now engineer light for plant growth!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You can calculate DLI, evaluate grow lights by their efficacy in µmol/J, design photoperiod schedules, and estimate energy cost per kilogram of yield. Chapter 11 covers the other half of the aerial environment — temperature, humidity, CO₂, and vapor pressure deficit — the variables that interact with light to determine ultimate plant performance. Let's control the whole environment!

[See Annotated References](./references.md)
