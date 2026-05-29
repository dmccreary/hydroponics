---
title: Water Transport, Photosynthesis, and Plant Health
description: Root adaptation to aquatic growing, dissolved oxygen, root rot physiology, plant stress responses, nutrient deficiency and toxicity symptoms, and how to diagnose visual plant problems.
generated_by: claude skill chapter-content-generator
date: 2026-05-28 23:01:11
version: 0.08
---

# Water Transport, Photosynthesis, and Plant Health

## Summary

This chapter completes the plant physiology foundation by examining what goes wrong when conditions are suboptimal: root adaptation to aquatic growing, the critical role of dissolved oxygen, root rot physiology, and the full vocabulary of visual deficiency symptoms—tip burn, interveinal chlorosis, purple stem syndrome, and necrosis—that growers use to diagnose nutrient problems without a laboratory.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Root Adaptation to Hydroponics
2. Dissolved Oxygen in Root Zone
3. Root Rot Physiology
4. Plant Stress Responses
5. Ethylene as Stress Hormone
6. Nutrient Deficiency Physiology
7. Nutrient Toxicity Effects
8. Tip Burn in Lettuce
9. Blossom End Rot
10. Interveinal Chlorosis
11. Purple Stem Syndrome
12. Necrosis Patterns
13. Growth Rate Measurement
14. Biomass Accumulation
15. Fresh Weight vs Dry Weight

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Hydroponics](../01-introduction/index.md)
- [Chapter 2: Root Biology and Nutrient Absorption](../02-root-biology/index.md)

---

!!! mascot-welcome "Cress reads the plant's warning signs"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 3! The previous chapter explained how a healthy plant root absorbs nutrients. This chapter explains what happens when something goes wrong — and more importantly, how the plant tells you about it before the damage becomes permanent. Leaves, stems, and roots carry visual clues about oxygen supply, calcium delivery, iron availability, and a dozen other variables. Learning to read those clues is one of the most valuable skills in applied hydroponics.

## Root Adaptation to Hydroponic Growing

A plant grown in soil develops a root system adapted to that medium: extensive lateral branching to explore new volumes, coarse roots for anchorage, and fine root hairs for nutrient absorption. When that same plant is grown hydroponically, the root system adapts to its new environment in ways that visually distinguish healthy hydroponic roots from soil-grown roots.

**Hydroponic root adaptations include:**

- **Reduced lateral branching**: In a recirculating or reservoir system, nutrients come to the root rather than requiring the root to grow toward them. This often results in a less-branched but denser root mass concentrated in the nutrient solution zone.
- **Development of water-adapted root tissue**: Roots in permanent contact with aerated solution develop a thinner, less suberized epidermis than soil roots, maximizing membrane permeability for ion uptake.
- **Air-root formation in dual-zone systems**: In Kratky and DWC systems with an air gap, roots that grow above the water surface develop thicker, more suberized tissue adapted to air exposure. These "air roots" provide the oxygen the plant needs for root respiration even as the lower root mass absorbs nutrients from solution.
- **Dense root hair production**: In well-oxygenated solution, root hair development is prolific, creating the characteristic bright-white fuzzy root appearance of a healthy hydroponic plant.

Root color is one of the most reliable diagnostic tools a hydroponic grower has. Before we examine what goes wrong, the following table summarizes what different root appearances mean:

| Root Appearance | Likely Meaning |
|----------------|----------------|
| Bright white, dense root hairs | Healthy — good oxygen, correct pH, no pathogens |
| Cream/tan with no visible hairs | Early oxygen stress or early *Pythium* colonization |
| Brown, slimy, with foul smell | Active root rot — *Pythium* or bacterial decomposition |
| Rust-brown staining (no slime) | Iron precipitate — pH too high causing iron deposits |
| Dark brown/black, mushy | Advanced root rot — significant crop loss likely |

## Dissolved Oxygen in the Root Zone

Chapter 2 established the mechanistic connection between dissolved oxygen (DO) and ATP-powered nutrient uptake. Here we quantify what "sufficient" dissolved oxygen means and what causes it to drop.

**Oxygen saturation in water** depends on temperature. The warmer the water, the less oxygen it can hold. Before examining the numbers, note that root zone oxygen stress begins when DO falls below 3–4 mg/L — at this point aerobic respiration slows and root cells shift toward anaerobic pathways.

| Water Temperature | DO at Saturation (mg/L) | Notes |
|------------------|------------------------|-------|
| 15°C (59°F) | 10.1 | Ideal for cold-tolerant crops |
| 20°C (68°F) | 9.1 | Optimal range for most crops |
| 22°C (72°F) | 8.7 | Upper end of preferred range |
| 25°C (77°F) | 8.2 | Watch carefully |
| 30°C (86°F) | 7.5 | Borderline — *Pythium* risk increases |
| 35°C (95°F) | 6.7 | Dangerous — act immediately |

Causes of low DO in hydroponic systems include high solution temperature, insufficient aeration (air pump failure or undersized), high biological oxygen demand from dense root mass or algae growth, and stagnant areas in the reservoir with no water movement.

The standard recommendation is to maintain solution temperature at 18–22°C (65–72°F) and DO above 5 mg/L. At these conditions the root zone has adequate oxygen for vigorous nutrient uptake with a safety margin above the stress threshold.

## Root Rot Physiology

**Root rot** is not a single disease but a syndrome caused by opportunistic water molds and bacteria that colonize weakened root tissue. The primary pathogen in hydroponic systems is *Pythium* — specifically *Pythium ultimum* and *Pythium aphanidermatum* — which are not true fungi but oomycetes (water molds) that thrive in warm, poorly oxygenated water.

The progression of root rot follows a predictable sequence:

1. DO drops below the stress threshold from warm temperatures, pump failure, or high bioload
2. Root cell membranes weaken as ATP production declines and anaerobic fermentation produces ethanol
3. Root hairs die — first sign visible to the grower as root color changes from white to tan
4. *Pythium* zoospores (motile reproductive cells) are attracted to the root exudates of stressed tissue and colonize the root surface
5. Hyphae penetrate root cortex cells, destroying cell walls and extracting cell contents
6. Rotting spreads up the root toward the crown; in advanced cases the crown (stem base) itself becomes infected
7. The vascular connection between root and shoot is destroyed; the plant wilts rapidly and dies even with a full reservoir

!!! mascot-warning "Root rot can kill a plant in 24–48 hours"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Cress holds up a cautionary hand">
    The time between "roots look a little brown" and "plant has completely collapsed" can be as short as one day in warm conditions. *Pythium* grows fastest at 25–30°C and near-zero oxygen. If your solution temperature climbs above 24°C, take immediate action: add frozen water bottles to the reservoir, relocate it to a cooler space, or switch to a water chiller. The infection is nearly impossible to reverse once the crown is compromised — prevention through temperature and aeration management is the only reliable strategy.

## Plant Stress Responses

Plants have no nervous system and cannot move away from adverse conditions, but they do respond to stress through hormonal signaling systems that alter gene expression, growth patterns, and leaf behavior. Understanding these responses helps growers distinguish nutrient deficiency symptoms from general stress symptoms.

**Abscisic acid (ABA)** is the primary stress hormone responding to drought, salt, and temperature extremes. When roots experience water stress (either dehydration or high osmotic concentration in the solution), ABA synthesized in root cells travels to leaves via the xylem and causes guard cells to close stomata — reducing transpiration to conserve water. The visible result: leaves look dull, slightly curled, and may appear to wilt partially even when water is available in the reservoir.

**Ethylene as stress hormone** is particularly relevant to root health. Ethylene is a gaseous hormone produced by plant tissue under several stress conditions — physical damage, flooding or oxygen deficiency at roots, and pathogen attack. In the context of hydroponic root rot, roots experiencing oxygen deficiency produce ethylene, which:

- Triggers programmed cell death (apoptosis) in root cells — a controlled sacrifice of root tissue that limits pathogen spread
- Promotes adventitious root formation above the damaged zone
- In shoots, causes **epinasty** — downward curling of leaves — that appears before the roots are visually examined

Ethylene-induced leaf epinasty in a hydroponic plant is an early warning sign worth taking seriously. If lettuce or basil leaves are curling downward abnormally, check the reservoir temperature, DO, and root color immediately.

## Nutrient Deficiency Physiology

A **nutrient deficiency** occurs when a plant cannot obtain enough of a required mineral element to meet metabolic demand. The deficiency may arise from three causes:

1. **Absence from solution**: The nutrient was not included in the formula or has been depleted by plant uptake
2. **pH lockout**: The nutrient is present but chemically unavailable at the current pH — the most common cause in hydroponics
3. **Antagonism**: Excess of one ion blocks uptake of another (e.g., too much potassium blocks magnesium uptake)

**Nutrient mobility** determines where deficiency symptoms appear on the plant. Before examining specific symptoms, this rule must be clearly understood:

- **Mobile nutrients** (nitrogen, phosphorus, potassium, magnesium) can be remobilized from older tissue and transported to actively growing young tissue. Deficiency symptoms therefore appear first in **older, lower leaves** — the plant cannibalizes its old leaves to supply new growth.
- **Immobile nutrients** (calcium, iron, manganese, boron) cannot be moved once deposited in leaf tissue. Deficiency symptoms appear first in **new, upper leaves and growing tips** — these tissues receive no supply and cannot pull reserves from elsewhere.

This mobility rule is one of the most useful diagnostic tools for identifying deficiencies without laboratory analysis:

| Nutrient | Mobile? | First symptom location |
|----------|---------|----------------------|
| Nitrogen | Yes | Old leaves turn yellow; yellowing progresses upward |
| Phosphorus | Yes | Old leaves; dark green or purple tinge |
| Potassium | Yes | Old leaf edges (marginal scorch) |
| Magnesium | Yes | Old leaves; interveinal chlorosis |
| Calcium | No | Young leaves; growing tips; tip burn in lettuce |
| Iron | No | Young leaves; interveinal chlorosis |
| Manganese | No | Young leaves; gray-green interveinal pattern |
| Boron | No | Growing tips; distorted or dead new growth |

## Visual Deficiency Symptoms in Detail

The following four symptom patterns are the most commonly encountered in hydroponic growing and are worth knowing by name and visual description.

### Tip Burn in Lettuce

**Tip burn** is the browning and death of leaf margins on the innermost youngest leaves of lettuce heads. It is the most common quality problem in commercial hydroponic lettuce production and the primary reason commercial lettuce heads are sometimes rejected at harvest.

The cause is calcium deficiency at the leaf margin — but not because calcium is absent from the solution. Calcium moves exclusively through the xylem in the transpiration stream. The innermost young leaves have lower transpiration rates (they are enclosed in the head, away from airflow) and therefore receive less calcium. When the plant grows faster than the xylem water stream can deliver calcium to those tissues, the cell walls of expanding leaf margin cells fail and collapse — producing the characteristic brown, water-soaked necrosis.

Management strategies: increase airflow over the canopy to drive transpiration to inner leaves, avoid high temperature and high nitrogen which accelerate growth faster than calcium delivery, and use calcium foliar sprays as a supplement in severe cases.

### Blossom End Rot

**Blossom end rot (BER)** is the collapse and blackening of the blossom end (bottom) of developing tomato, pepper, or cucumber fruit. Like tip burn, it results from calcium deficiency at the growing tissue — inadequate transport rather than absence from solution.

Contributing factors: uneven watering that disrupts the xylem water stream, high EC reducing water uptake rate, high ammonium concentrations that compete with calcium uptake at root membranes, and high humidity reducing transpiration and therefore calcium transport to developing fruit.

### Interveinal Chlorosis

**Interveinal chlorosis** is the yellowing of leaf tissue between the veins, while the veins themselves remain green — the visual pattern looks like a green grid on a yellow background.

Two common causes with distinct locations:

- **Iron deficiency** (new leaves first): Iron is required for chlorophyll synthesis. When iron is unavailable — most commonly because pH exceeds 6.5, where iron forms insoluble hydroxides — new leaves that cannot obtain iron cannot synthesize adequate chlorophyll.
- **Magnesium deficiency** (old leaves first): Magnesium is the central atom in the chlorophyll molecule. When older leaves are cannibalized for magnesium, chlorophyll breaks down in a pattern that initially spares the vascular tissue.

The distinction: iron shows new leaves first (immobile), magnesium shows old leaves first (mobile).

### Purple Stem Syndrome

**Purple stem syndrome** refers to the purpling of stems, petioles, and occasionally the undersides of leaves, caused by accumulation of anthocyanin pigments. Anthocyanins over-accumulate under specific stress conditions including phosphorus deficiency (phosphorus is required for sugar transport; deficiency causes sugar accumulation and anthocyanin synthesis), cold temperatures (slow sugar transport causes accumulation), and in some naturally purple-leaved cultivars (not a deficiency).

### Necrosis Patterns

**Necrosis** — the death and browning or blackening of plant tissue — occurs when cells lose membrane integrity. Patterns in hydroponic plants include:

- **Marginal necrosis** (leaf edge burn): Potassium deficiency or toxic salt accumulation at leaf margins via transpiration
- **Tip necrosis** (growing point death): Calcium deficiency, boron deficiency, or direct salt damage to apical meristems
- **Scattered necrotic spots**: Often a sign of *Pythium* or bacterial infection rather than nutrient deficiency

#### Diagram: Nutrient Deficiency Visual Diagnostic Tool
<iframe src="../../sims/nutrient-deficiency-visual-diagnostic/main.html" width="100%" height="520px" scrolling="no"></iframe>
<details markdown="1">
<summary>Nutrient Deficiency Visual Diagnostic Interactive Tool</summary>
Type: infographic
**sim-id:** nutrient-deficiency-visual-diagnostic<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to interactively diagnose nutrient deficiencies by selecting observed visual symptoms and identifying the matching deficiency. Reinforces the mobility rule and visual pattern vocabulary from this chapter.

Bloom Level: Analyze (L4)
Bloom Verb: Differentiate — students differentiate between deficiency symptoms based on leaf age and visual pattern

Layout: Three-panel interface, full-width responsive
Left panel (30%): Symptom selector
- Radio button: "Leaf age affected — New/upper leaves first | Old/lower leaves first | Both / Whole plant"
- Checkbox list: "Pattern type — Yellowing between veins | Uniform yellowing | Browning at edges | Purple/red discoloration | Browning at growing tip | Twisted or distorted growth"

Center panel (55%): Leaf illustration
- Generic lettuce leaf outline with colored overlay zones that update based on symptom selections
- Yellow zones = chlorosis, brown zones = necrosis, purple zones = anthocyanin, distorted lines = curl/twist
- Leaf toggles between "Young leaf" and "Old leaf" view to show expected pattern for each

Right panel (15%): Diagnosis results
- Lists probable deficiencies matching the selected pattern, sorted by likelihood
- Each deficiency name is clickable to expand detail: nutrient name, mobile/immobile, typical solution ppm, pH range where lockout occurs, corrective action

Interactive features:
- Symptom selections update the leaf illustration and diagnosis list in real time
- "Show All Patterns" button cycles through all eight major deficiency patterns with illustrations and labels
- Hover on leaf region: Tooltip showing which deficiency primarily affects that zone

Visual style: Clean botanical illustration style, green/brown/yellow palette matching textbook
</details>

## Nutrient Toxicity Effects

While deficiency is more common in hydroponic systems, **nutrient toxicity** — an excess of a particular element that becomes harmful — also occurs. Toxicity damage arises from: direct ion toxicity (high concentrations interfering with enzyme function), **ion antagonism** (excess of one ion blocking uptake of another), and osmotic stress from very high total dissolved solids.

Before examining the most important toxicity risks, note that the most common toxicity in beginner systems is not a specific element but a general high-EC situation where the student added too much of everything — resulting in osmotic stress that looks like drought wilting despite a full reservoir.

| Toxicity | Symptom | Common Cause |
|----------|---------|-------------|
| Nitrogen (ammonium) | Brown roots, wilting, poor fruit set | Excess ammonium-based fertilizer in warm solution |
| Iron | Interveinal chlorosis (Fe blocks Mn) | pH below 5.0 releasing excess soluble Fe |
| Manganese | Interveinal chlorosis, dark spots | pH below 5.5 in low-Fe systems |
| Boron | Marginal necrosis on old leaves first | Occasional in hard-water areas |
| Sodium / chloride | Marginal scorch, growth suppression | Municipal water with high Na, or fertilizer contamination |

## Growth Rate Measurement and Biomass Accumulation

Quantifying plant growth is important for comparing system designs, tracking the effect of parameter changes, and modeling yield for commercial planning.

**Fresh weight** is the mass of the plant including all its water content, measured immediately after harvest. This is the commercially relevant metric — what consumers purchase is fresh weight. Fresh weight is typically 85–95% water in leafy greens.

**Dry weight** is the mass of the plant after all water is removed (dried at 70°C for 48–72 hours). Dry weight represents actual biomass — carbon fixed by photosynthesis minus what was consumed by respiration. Dry weight is the scientifically preferred growth metric because it eliminates the large and variable water fraction.

**The fresh weight to dry weight ratio** ranges from 10:1 to 20:1 for leafy greens. This ratio is affected by:

- Calcium deficiency: cells hold less water → lower fresh/dry ratio
- High nitrogen: promotes leaf cell expansion and water accumulation → higher fresh/dry ratio
- High temperature: faster transpiration at harvest → lower fresh/dry ratio

**Relative growth rate (RGR)** provides a normalized measure of how fast a plant accumulates dry biomass:

\[ \text{RGR} = \frac{\ln(W_2) - \ln(W_1)}{t_2 - t_1} \]

Where W₁ and W₂ are dry weights at two time points separated by (t₂ − t₁) days. The natural log accounts for the exponential nature of plant growth, where a larger plant grows absolutely faster than a smaller plant even at the same relative rate.

For school and hobbyist applications, tracking fresh weight at weekly intervals and comparing harvest dates against a baseline is sufficient to evaluate system performance without a laboratory.

#### Diagram: Biomass Growth Tracker
<iframe src="../../sims/biomass-growth-tracker/main.html" width="100%" height="460px" scrolling="no"></iframe>
<details markdown="1">
<summary>Biomass Growth Tracker and Fresh/Dry Weight Calculator</summary>
Type: microsim
**sim-id:** biomass-growth-tracker<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Give students an interactive tool to enter growth measurements over time, visualize the growth curve, and calculate relative growth rate and fresh-to-dry weight ratio. Reinforces the difference between fresh and dry weight and provides practice with growth rate mathematics.

Bloom Level: Apply (L3)
Bloom Verb: Calculate — students calculate growth rates and weight ratios from entered data

Canvas layout:
- Top section (50%): Line chart (x-axis: days after transplant, y-axis: fresh weight in grams); data points appear as the student enters values
- Bottom section (50%): Data entry table and calculated results panel side by side

Input fields:
- Data table with columns: Day, Fresh Weight (g), Dry Weight (g, optional)
- "Add Row" / "Remove Row" buttons
- "Target Harvest Weight (g)" input

Calculated results (update in real time):
- Current fresh/dry weight ratio from latest row with both values
- Average daily growth rate (g/day fresh weight)
- Relative Growth Rate (if two dry weight entries are present): displayed with formula and calculated value in g/(g·day)
- Predicted harvest date based on current growth rate and target harvest weight
- Progress bar: current weight as % of target harvest weight

Interactive features:
- Hover any chart data point: shows exact day and weight values
- Toggle "Show Trend Line": adds linear regression line and R² value
- Pre-loaded example data: lettuce growth curve from transplant to 35-day harvest at ~120g fresh weight with dry weight entries at day 7 and day 35

Visual style: Green data line, teal trend line, gray grid; controls in clean right-panel layout
</details>

## Key Takeaways

- **Root adaptation to hydroponics** produces dense white root hairs in well-oxygenated solution and dual-zone roots (water roots + air roots) in systems with an air gap. Root color is a primary health diagnostic.
- **Dissolved oxygen** must stay above 5 mg/L; warm solution (>24°C) holds less oxygen and increases *Pythium* risk simultaneously.
- **Root rot** (*Pythium*) progresses from brown root tips to full plant collapse in as little as 24–48 hours — prevention through temperature and aeration management is the only reliable strategy.
- **Ethylene** produced by oxygen-stressed roots causes leaf epinasty (downward curl) — an early warning visible before root damage is inspected.
- **Nutrient mobility** determines where deficiency symptoms appear: mobile nutrients (N, P, K, Mg) show old-leaf symptoms first; immobile nutrients (Ca, Fe, Mn, B) show young-leaf symptoms first.
- **Tip burn** and **blossom end rot** are calcium transport problems — calcium is present but not reaching rapidly expanding tissue due to low transpiration or high growth rate.
- **Interveinal chlorosis** on new leaves indicates iron deficiency (often pH-driven); on old leaves indicates magnesium deficiency.
- **Purple stems** often signal phosphorus deficiency or cold solution temperature.
- **Fresh weight** is the commercial metric; **dry weight** is the scientific metric; relative growth rate normalizes for plant size and enables fair comparisons between conditions.

??? question "Check Your Understanding — Click to reveal the answer"
    **Question:** A grower finds that basil plants have bright green young leaves but the older lower leaves are turning yellow uniformly. The roots look white and healthy. pH is 6.0, EC is 2.0 mS/cm. Which nutrient is most likely deficient, and how do the mobility rules support this diagnosis?

    **Answer:** The symptom pattern — uniform yellowing of older leaves while young leaves remain green, with healthy roots and acceptable pH/EC — points to **nitrogen deficiency**. Nitrogen is a mobile nutrient; the plant remobilizes it from older leaves to supply actively growing young tissue. At EC 2.0 mS/cm the total nutrient concentration may be low overall, or the specific nitrogen source may have been depleted. The grower should top up the reservoir with fresh nutrient solution, check whether the formula is nitrogen-adequate, and consider switching to a higher-N formula for the vegetative stage. Chapter 4 covers nitrogen and all other macronutrients in detail.

!!! mascot-celebration "Chapter 3 complete — you can read what your plants are telling you!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You now have the diagnostic vocabulary that experienced growers build over years of trial and error. You know why roots turn brown, what tip burn actually means, why interveinal chlorosis on old leaves differs from new leaves, and how to measure growth properly. Chapter 4 dives into the nutrients themselves — all 17 essential elements — and the pH chemistry that controls whether they are available to your plants. The nutrient chapters are where the science gets really practical!
