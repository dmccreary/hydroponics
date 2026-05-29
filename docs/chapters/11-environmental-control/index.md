---
title: Environmental Control and CO₂ Management
description: Temperature, humidity, vapor pressure deficit (VPD), CO₂ enrichment, HVAC sizing, exhaust fans, dehumidifiers, data loggers, alarm setpoints, and grow room automation overview.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# Environmental Control and CO₂ Management

## Summary

This chapter addresses precision management of the aerial grow environment: air and solution temperature, relative humidity, vapor pressure deficit (VPD), and CO₂ enrichment — including the interaction between CO₂ concentration and high-light intensity covered in Chapter 10. Students learn to size exhaust fans and dehumidifiers, configure HVAC for a grow room, set up data loggers with alarm setpoints, and understand the automation controllers (thermostats, CO₂ regulators, lighting ballasts) that keep parameters within target ranges around the clock.

## Concepts Covered

This chapter covers the following 31 concepts from the learning graph:

1. CO2 Benefit Under High Light
2. Temperature and Plant Growth
3. Air Temperature Management
4. Solution Temperature Control
5. Root Zone Temperature Optimum
6. Relative Humidity Definition
7. Humidity and Transpiration
8. High Humidity and Disease Risk
9. Low Humidity and Tip Burn
10. CO2 Concentration Effects
11. CO2 Enrichment Methods
12. Vapor Pressure Deficit (VPD)
13. VPD Calculation
14. VPD Optimal Ranges by Stage
15. HVAC Basics for Grow Rooms
16. Exhaust and Intake Fan Sizing
17. Air Circulation and Fans
18. Grow Tent Setup
19. Grow Room Insulation
20. Data Logger Basics
21. Environmental Alarm Setpoints
22. Thermostat and Humidity Ctrl
23. CO2 Controller and Regulator
24. Ballast and Lighting Controller
25. Grow Room Automation Overview
26. Heating and Cooling Trade-offs
27. Dehumidifier Selection
28. Humidifier Selection
29. Air Filtration Carbon Filter
30. Positive vs Negative Pressure
31. Fire Safety in Indoor Grows

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Nutrient Solution Chemistry and Mixing](../05-nutrient-solution-chemistry/index.md)
- [Chapter 10: Lighting Science](../10-lighting-science/index.md)

---

!!! mascot-welcome "Cress dials in the grow room environment"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 11! Chapter 10 taught you to engineer light for plant growth. This chapter adds the remaining aerial environment variables — temperature, humidity, CO₂, and airflow — that together determine how efficiently plants convert your lighting investment into biomass. When these variables interact well, photosynthesis runs at maximum efficiency. When any one drifts out of range, it becomes the new growth-limiting factor regardless of how perfect everything else is.

## Temperature and Plant Growth

Temperature affects essentially every biochemical process in the plant. Two temperature environments matter in a hydroponic system — the **air temperature** (affecting transpiration, photosynthesis rate, and cellular enzyme kinetics) and the **solution temperature** (affecting root respiration, dissolved oxygen, and pathogen risk).

**Optimal air temperature ranges by crop:**

| Crop | Day Temperature | Night Temperature |
|------|---------------|-----------------|
| Lettuce | 18–24°C (65–75°F) | 15–18°C (59–65°F) |
| Basil | 22–28°C (72–82°F) | 18–22°C (65–72°F) |
| Tomatoes | 22–28°C (72–82°F) | 18–22°C (65–72°F) |
| Cucumbers | 24–30°C (75–86°F) | 20–24°C (68–75°F) |
| Peppers | 22–28°C (72–82°F) | 18–22°C (65–72°F) |

**DIF (difference in temperature)**: The difference between day temperature and night temperature (DIF) affects plant morphology. Positive DIF (warm days, cool nights) promotes elongation; negative DIF (cool days, warm nights) promotes compact, short internodes. Commercial greenhouse growers use negative DIF in the pre-dawn hours to produce compact ornamentals without plant growth regulators.

**Air temperature management**: In grow tents and small rooms, temperature is managed with:
- **Cooling**: Exhaust fans removing hot air (also removes humidity and CO₂ if enriching); air conditioning units (mini-split or window AC units)
- **Heating**: Seedling heat mats (for germination trays), electric space heaters with thermostatic control, or supplemental heating from HID lighting heat load
- **Heating and cooling trade-offs**: HID fixtures heat the room and reduce heating costs in winter but increase cooling loads in summer. LEDs are more efficient but contribute less waste heat — in cold climates, growing space may require supplemental heating with LEDs.

**Solution temperature control** and **root zone temperature optimum** (18–22°C) were covered in Chapters 2 and 3. Maintaining solution temperature requires: reservoir insulation, water chillers for warm climates, and positioning the reservoir away from heat sources (lighting equipment, south-facing walls).

## Relative Humidity and Transpiration

**Relative humidity (RH)** is the amount of water vapor in the air expressed as a percentage of the maximum amount the air can hold at that temperature. At 100% RH, air is saturated and condensation forms; at 0% RH, air is completely dry.

RH is not the most useful metric for plant management because it is temperature-dependent — the same moisture content registers as higher RH at lower temperatures. This is why **vapor pressure deficit (VPD)** has replaced RH as the preferred environmental metric in modern controlled-environment agriculture.

**Humidity and transpiration**: Transpiration rate is driven by the difference in vapor pressure between the leaf interior (nearly saturated, ~100% RH at leaf temperature) and the surrounding air. Higher air humidity → smaller vapor pressure difference → lower transpiration rate. Lower transpiration means:

- Less water uptake through roots
- Less calcium transported to growing tissue (calcium moves only in the transpiration stream)
- Higher risk of tip burn and other calcium-related disorders

**High humidity and disease risk**: When RH exceeds 85–90%, several harmful conditions develop:
- **Powdery mildew** colonizes leaf surfaces where condensation forms
- **Botrytis** (gray mold) infects flowers, fruit, and leaf tissue
- Water condensation on leaf surfaces blocks gas exchange and creates direct infection pathways for fungal spores

**Low humidity and tip burn**: Very low humidity (<40% RH) increases transpiration dramatically. Lettuce inner leaves transpire less than outer leaves (they are shielded from airflow) — the rapid water pull combined with calcium's immobility causes calcium starvation at the inner leaf margins (tip burn, covered in Chapter 3).

## CO₂ Concentration Effects and Benefit Under High Light

**CO₂ concentration effects** on photosynthesis follow a saturation curve. Atmospheric CO₂ is approximately 420 ppm (parts per million). At this concentration, photosynthesis in most C3 plants (including lettuce, tomatoes, and most vegetables) is partially CO₂-limited — the rate of the Calvin cycle is constrained by the availability of CO₂ relative to the enzymatic capacity of RuBisCO.

**CO₂ benefit under high light**: As PPFD increases above ~600 µmol·m⁻²·s⁻¹, many crops reach CO₂ saturation at 420 ppm before they reach light saturation — meaning CO₂ becomes the growth-limiting factor before light does. Elevating CO₂ to 800–1,200 ppm raises the CO₂ saturation point, allowing the plant to use high-intensity light more efficiently. The result: 20–30% additional photosynthesis rate and growth at equivalent light levels.

This CO₂-light interaction is why commercial vertical farms operating at PPFD >600 µmol·m⁻²·s⁻¹ frequently enrich CO₂. At lower PPFD (<400 µmol·m⁻²·s⁻¹, typical for hobby and school systems), CO₂ enrichment provides minimal benefit because the plant is light-limited rather than CO₂-limited.

**CO₂ enrichment methods:**
- **Compressed CO₂ tanks**: Pure CO₂ delivered through a regulator and distribution manifold. Controlled by a CO₂ controller with an infrared CO₂ sensor. Most precise method.
- **CO₂ generators** (propane or natural gas burners): Burn fossil fuel to produce CO₂. Produces heat and water vapor as by-products — useful in cool climates (heat contribution reduces heating costs) but problematic in warm climates.
- **Fermentation/composting**: Passive CO₂ release from yeast fermentation or compost — produces modest CO₂ levels (typically 100–200 ppm above ambient), low cost, uncontrolled delivery.

**Important**: CO₂ enrichment only helps when stomata are open (during the light period). Shut down CO₂ delivery during the dark period. Also: CO₂ does not penetrate to the canopy if air is stagnant — adequate circulation (below) is essential.

## Vapor Pressure Deficit (VPD)

**Vapor pressure deficit (VPD)** is the difference between the amount of moisture currently in the air and the maximum amount the air can hold at that temperature. It is expressed in kilopascals (kPa).

VPD is a more useful metric than RH because it directly represents the "drying power" of the air — how strongly the air pulls water vapor from leaf surfaces regardless of air temperature.

**VPD calculation:**

First, calculate saturated vapor pressure (SVP) at the given air temperature:

\[ \text{SVP} = 0.6108 \times e^{\frac{17.27 \times T}{T + 237.3}} \text{ (kPa)} \]

where T is temperature in °C. Then:

\[ \text{VPD} = \text{SVP} \times \left(1 - \frac{\text{RH}}{100}\right) \]

**Example**: At 25°C (SVP = 3.17 kPa) and 70% RH: VPD = 3.17 × (1 − 0.70) = 3.17 × 0.30 = 0.95 kPa

**VPD optimal ranges by stage:**

| Growth Stage | VPD Range (kPa) | Notes |
|-------------|----------------|-------|
| Propagation / seedling | 0.4–0.8 | Low VPD keeps fragile roots from desiccating |
| Vegetative growth | 0.8–1.2 | Moderate transpiration drives calcium delivery |
| Late vegetative / early flower | 1.0–1.5 | Higher transpiration acceptable; stomata tolerance increases |
| Fruiting | 1.2–1.8 | Higher VPD acceptable; watch calcium at high VPD |
| >2.0 | Out of range — stomata close, growth slows |

The VPD "sweet spot" for most commercial leafy green production is 0.8–1.2 kPa — high enough to drive adequate calcium transport to growing tissue, low enough to prevent stomatal closure and moisture stress.

#### Diagram: VPD and Environmental Parameter Dashboard
<iframe src="../../sims/vpd-environment-dashboard/main.html" width="100%" height="500px" scrolling="no"></iframe>
<details markdown="1">
<summary>VPD and Environmental Parameter Interactive Dashboard</summary>
Type: microsim
**sim-id:** vpd-environment-dashboard<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to interactively set temperature and humidity and see the resulting VPD calculated in real time, along with color-coded feedback on whether the environment is in optimal range for each growth stage.

Bloom Level: Apply (L3)
Bloom Verb: Calculate — students calculate VPD from temperature and humidity and interpret whether conditions are optimal

Canvas layout:
- Left panel (40%): Input controls
  - Temperature slider: 15–35°C
  - Humidity slider: 30–95% RH
  - Growth stage selector (dropdown): Propagation | Vegetative | Fruiting
- Center panel (40%): Calculated results
  - Saturated vapor pressure (SVP) at current temperature
  - VPD (large font display)
  - VPD gauge: horizontal bar with colored zones (blue=too low, green=optimal, orange=high, red=very high) with marker at current VPD
  - Interpretation text: "VPD is in the optimal range for [stage]" or "VPD is too high — stomata may close"
- Right panel (20%): Consequences panel
  - Current transpiration rate: Low/Moderate/High (text + colored indicator)
  - Calcium delivery risk: OK / Warning (if VPD < 0.6 kPa, calcium delivery is limited)
  - Disease risk: Low / Elevated (if RH > 85%, powdery mildew and Botrytis risk increases)
  - CO₂ efficiency: Full / Reduced (if stomata are likely closed at high VPD, CO₂ enrichment is less effective)

Interactive features:
- All sliders update calculations in real time
- Hover VPD gauge: Shows the formula SVP × (1 − RH/100) with current values substituted
- "Common Scenarios" dropdown pre-loads temperature and humidity combinations: "Summer afternoon (hot)", "Night cycle", "Propagation dome", "Winter dry heat"
- Toggle "Show VPD Table": Overlays a 6×6 heatmap showing VPD at combinations of temperature (15–35°C) and humidity (40–90%) with the current point marked

Responsive: Panels stack vertically on narrow screens; VPD display remains large
</details>

## HVAC Basics for Grow Rooms

**HVAC** (heating, ventilation, and air conditioning) in a grow room has three goals: temperature control, humidity control, and CO₂ replenishment (or enrichment). These goals interact — exhausting air removes heat and humidity but also removes CO₂.

**Exhaust and intake fan sizing**: The primary tool for temperature and humidity control in hobby and small commercial systems is an inline exhaust fan connected to ducting through the grow space roof or wall. Proper sizing ensures the entire air volume of the growing space is exchanged every 1–3 minutes.

Fan sizing formula: Required fan CFM (cubic feet per minute) = Room Volume (cubic feet) ÷ 3 minutes

For a grow tent that is 4 × 4 × 6.5 feet: Volume = 104 cubic feet; Required CFM = 104 ÷ 3 ≈ 35 CFM. Add 25% for carbon filter resistance: Final specification ≈ 45 CFM.

**Intake air**: Passive intake (a mesh vent at the bottom of the tent or room) works for small spaces. Active intake fans improve air mixing in larger rooms. The intake should be smaller than the exhaust to maintain **negative pressure** (air is always flowing in and out, preventing stagnant zones).

**Positive vs. negative pressure**: A slightly negative pressure environment (exhaust > intake) is generally preferred for odor control (ensures all air leaves through the carbon filter) and to prevent outside air from pushing in through cracks. Positive pressure (intake > exhaust) is used in clean rooms and some commercial operations where air quality of intake is controlled (HEPA-filtered).

**Air circulation and fans**: Exhaust fans exchange room air; internal circulation fans move that air around the plant canopy. Without circulation fans, CO₂-depleted boundary layers form on leaf surfaces even in a CO₂-enriched room. Oscillating clip fans or horizontal airflow fans provide the gentle, continuous air movement needed to replenish the boundary layer CO₂.

## Grow Tent Setup and Grow Room Insulation

**Grow tent setup**: Commercial grow tents (sizes from 2×2 ft to 10×10 ft and larger) provide a contained, light-proof, reflective growing space for hobby and small commercial operations. Key setup elements:

- **Mylar reflective interior**: Reflects light back to the canopy — improving light uniformity and reducing edge losses
- **Ducting ports**: Pre-cut holes with drawstring seals for exhaust fan, intake, and power cables
- **Temperature/humidity management**: Inline fan + carbon filter for exhaust; oscillating fan inside for circulation
- **CO₂ enrichment**: Sealed tents are ideal for CO₂ enrichment — losses are minimal if ports are sealed

**Grow room insulation**: Proper insulation reduces temperature swings and energy cost. R-value ≥ R-13 in walls and ceiling is a minimum for year-round growing in most climates. Reflective insulation (Reflectix) is sometimes used for its combined insulating and light-reflecting properties, though its R-value alone (R-3 to R-5) is modest.

## Data Loggers and Environmental Alarm Setpoints

**Data logger basics**: A data logger is a device that records environmental measurements (temperature, humidity, CO₂, light intensity) at regular intervals, storing data for later analysis. Types range from standalone USB data loggers (Govee, SensorPush) to microcontroller-based systems (Chapters 12–16).

**Environmental alarm setpoints** are threshold values that trigger an alert when exceeded:

| Parameter | Low Alarm | High Alarm |
|-----------|-----------|-----------|
| Air temperature | 15°C | 32°C |
| Solution temperature | 16°C | 24°C |
| Relative humidity | 40% | 85% |
| CO₂ concentration | 300 ppm (ventilation check) | 1,500 ppm |
| VPD | 0.4 kPa | 1.8 kPa |

Exceeding any alarm threshold should trigger a notification — at minimum an audible alarm, ideally an SMS or email alert. Chapters 12–14 cover building automated alert systems with MicroPython.

## Controllers and Automation

**Thermostat and humidity control**: Standalone plug-in thermostats (Inkbird IBS-TH2, Ranco controllers) accept a temperature probe and switch a heating or cooling device on/off. Humidity controllers work identically, switching dehumidifiers or humidifiers. Combination temperature + humidity controllers simplify wiring.

**CO₂ controller and regulator**: A CO₂ controller uses an infrared CO₂ sensor to measure the ppm in the room and opens/closes a solenoid valve on the CO₂ supply line to maintain a target setpoint (typically 800–1,200 ppm). The solenoid is connected to the CO₂ regulator on the tank.

**Ballast and lighting controller**: HID ballasts (for HPS and MH fixtures) require a separate ballast unit that controls current to the lamp. Modern digital dimmable ballasts allow variable intensity. LED drivers provide constant-current regulation internally. Both types are typically connected to a timer or controller for photoperiod automation.

**Grow room automation overview**: A fully automated grow room combines:
- Timer-controlled lighting
- Thermostat/humidity control (or microcontroller equivalent)
- CO₂ controller
- Automated dosing pumps for pH and nutrient (Chapters 12–14)
- Data logger or IoT sensor network for remote monitoring
- Alert notifications via SMS, email, or app

## Air Filtration, Fire Safety, and Safety Overview

**Air filtration carbon filter**: Activated carbon filters (inline, connected in series with the exhaust fan) adsorb volatile organic compounds and odors. Essential for crops with strong scents (basil, cilantro) in shared or residential spaces. Carbon filters become saturated over time (typically 1–2 years) and require replacement.

**Positive vs. negative pressure** affects how easily odors escape and how cleanly air is managed — summarized in the fan sizing section above.

**Fire safety in indoor grows**: The combination of electrical equipment, water, and plant material creates fire risk if managed carelessly. Key precautions:
- Use GFCI-protected outlets for all equipment near water
- Route all cables with drip loops — prevent water from running along cables into outlets
- Do not use extension cords rated for temporary use (low amperage) for permanent high-draw equipment (HID lights, pumps)
- Never stack combustible materials (cardboard, peat bags) near lighting equipment
- Install a smoke detector in the growing space
- Know the location of the nearest fire extinguisher (Class C — electrical fires)

## Key Takeaways

- **Air temperature optimum** for most crops is 20–26°C during the day, 15–20°C at night; night drop promotes compact growth.
- **Solution temperature 18–22°C** is critical — warmer solution reduces dissolved oxygen and elevates *Pythium* risk.
- **VPD (0.8–1.2 kPa)** is the preferred environmental metric for manage transpiration, replacing RH alone; calculated from SVP × (1 − RH/100).
- **CO₂ enrichment** to 800–1,200 ppm benefits crops operating above 600 µmol·m⁻²·s⁻¹ PPFD; minimal benefit at lower light levels.
- **Exhaust fan sizing**: Volume (cubic feet) ÷ 3 = minimum CFM; add 25% for carbon filter resistance.
- **Negative pressure** (exhaust > intake) preferred for odor control and air quality management.
- **Alarm setpoints** for temperature, humidity, CO₂, and VPD enable early detection of environmental drift before crop damage occurs.
- **Fire safety**: GFCI outlets, proper cable management, and smoke detection are mandatory in any indoor growing space with electrical equipment and water.

!!! mascot-celebration "Chapter 11 complete — you control the whole aerial environment!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    Temperature, humidity, VPD, CO₂, airflow, and fire safety — you now have the complete picture of the aerial grow environment. The next five chapters shift to the digital and electronic layer: MicroPython programming, sensor wiring, networking, and data visualization. If chemistry is the science of hydroponics, automation is where it becomes engineering. Let's code!
