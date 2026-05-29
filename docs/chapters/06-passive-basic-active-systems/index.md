---
title: Passive and Basic Active Systems
description: Survey of all six major hydroponic system types — Kratky, DWC, NFT, Ebb-and-Flow, Aeroponics, Fogponics — plus drip irrigation, comparing oxygen delivery, pump-failure risk, complexity, cost, and crop suitability.
generated_by: claude skill chapter-content-generator
date: 2026-05-28 23:01:11
version: 0.08
---

# Passive and Basic Active Systems

## Summary

This chapter surveys all six major hydroponic system architectures—Kratky, Deep Water Culture, Nutrient Film Technique, Ebb-and-Flow, Aeroponics, and Fogponics—plus drip irrigation, comparing each on oxygen delivery, pump-failure risk, complexity, cost, and crop suitability. Students develop the judgment to match system type to growing goals before they build anything.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Passive vs Active Systems
2. Kratky Method
3. Kratky Air Gap Principle
4. Deep Water Culture (DWC)
5. DWC Air Pump and Air Stone
6. Single-Bucket DWC
7. Multi-Bucket DWC
8. Recirculating DWC (RDWC)
9. Nutrient Film Technique (NFT)
10. NFT Channel Design
11. NFT Flow Rate
12. NFT Pump Failure Risk
13. Ebb-and-Flow System
14. Ebb-and-Flow Timer Programming
15. Flood Table Design
16. Aeroponics Definition
17. High-Pressure Aeroponics
18. Low-Pressure Aeroponics
19. Fogponics (Ultrasonic)
20. Drip Irrigation Hydroponics

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Hydroponics](../01-introduction/index.md)
- [Chapter 2: Root Biology and Nutrient Absorption](../02-root-biology/index.md)
- [Chapter 3: Water Transport, Photosynthesis, and Plant Health](../03-water-transport/index.md)

---

!!! mascot-welcome "Cress surveys the system landscape"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 6! The chemistry chapters gave you the tools to understand what plants need. Now we build the machines that deliver it. This chapter introduces all six major hydroponic system architectures — from a no-electricity-required mason jar to a commercial-scale aeroponic tower. Understanding the trade-offs between them is what lets you choose the right system for your crop, your budget, and your tolerance for risk. Let's survey the field.

## Passive Versus Active Systems

The most fundamental distinction in hydroponic system design is whether the system moves nutrient solution using powered equipment.

**Passive systems** deliver nutrients through capillary action, gravity, or root growth rather than pumps. They require no electricity to function, making them immune to power outages and mechanically simple. The trade-off is limited control over oxygen delivery and nutrient replenishment rate.

**Active systems** use pumps, timers, and aerators to continuously or periodically move and oxygenate nutrient solution. They offer much higher oxygen delivery, better control over nutrient concentration at the root zone, and suitability for a wider range of crops. The trade-off is dependence on electricity and mechanical reliability — pump failure means the crop is at risk within hours.

The following comparison table summarizes all six system types plus drip irrigation on the key decision dimensions. We will examine each in detail after the table.

| System | Pump? | Oxygen Delivery | Pump Failure Risk | Complexity | Cost | Best Crops |
|--------|-------|----------------|------------------|-----------|------|-----------|
| Kratky | No | Passive air gap | None | Very low | $10–50 | Lettuce, herbs |
| DWC | Air pump | Air stone in reservoir | Low (plant survives hours) | Low | $50–200 | Lettuce, herbs, tomato |
| NFT | Water pump | Film + air exposure | High (wilts in 30–60 min) | Medium | $200–500 | Lettuce, herbs, strawberry |
| Ebb-and-Flow | Water pump + timer | Flood-drain cycle | Medium | Medium | $150–400 | Most crops |
| Aeroponics | High-pressure pump | Exposed roots in air | Very high (wilts in minutes) | High | $500–2,000+ | Lettuce, herbs, root crops |
| Fogponics | Ultrasonic fogger | Fine mist + air | Very high | High | $300–1,000+ | Lettuce, herbs, propagation |
| Drip | Water pump + timer | Substrate aeration | Low–medium | Medium | $200–600 | Fruiting crops, soil-like crops |

## The Kratky Method

The **Kratky method**, developed by B.A. Kratky at the University of Hawaii, is the simplest hydroponic system possible. It requires no pumps, no electricity, no timers, and no recirculation. The entire system can be a mason jar, a net pot, and a nutrient solution.

**How it works**: The plant is placed in a net pot above a reservoir of nutrient solution. Roots grow down into the solution. As the plant absorbs the solution, the water level drops, creating a progressively larger **air gap** between the water surface and the bottom of the net pot. This air gap is where the upper portion of the root mass grows in air — providing the oxygen that the submerged lower roots cannot. The system is "set and forget" until the reservoir is nearly empty, at which point it is either refilled or the crop is harvested.

**The Kratky air gap principle**: The air gap size is self-regulating. As the plant absorbs more solution, the gap grows larger, exposing more root surface to air. Larger plants with higher transpiration rates naturally generate larger air gaps and more oxygen access — the system scales with plant demand automatically.

**Limitations**: The Kratky method does not recirculate solution, so nutrients are not replenished between fills. This is fine for short-cycle crops (lettuce, herbs) but problematic for long-cycle fruiting crops (tomatoes) where nutrient ratios change significantly between vegetative and fruiting stages. Also, if the reservoir runs dry before harvest, the crop stress or dies.

**Best applications**: Lettuce, basil, cilantro, and other leafy greens in 25–50 day cycles. School classroom experiments. Any setting where electricity is not available or not desired.

## Deep Water Culture (DWC)

**Deep Water Culture (DWC)** keeps plant roots submerged continuously in aerated nutrient solution. Unlike Kratky, an air pump connected to an air stone continuously oxygenates the solution — no air gap is required because the dissolved oxygen in the solution itself sustains root respiration.

**How it works**: A net pot holds the plant above the reservoir. Roots grow down through the net pot and hang directly in the nutrient solution. An aquarium air pump (connected via airline tubing to an air stone at the bottom of the reservoir) bubbles air through the solution continuously, maintaining dissolved oxygen above 6–8 mg/L.

**Single-bucket DWC**: The simplest active system — a 5-gallon bucket, one net pot, one air pump, one air stone. Cost: $50–80. This is the most common entry point for DIY hydroponic growers moving beyond Kratky.

**Multi-bucket DWC**: Multiple individual reservoirs (one per plant), each with its own air stone but often sharing one larger pump. Useful for growing different crops with different nutrient needs simultaneously.

**Recirculating DWC (RDWC)**: Multiple containers connected by pipes to a central reservoir. A water pump circulates solution from the central reservoir through all containers and back. This allows centralized nutrient management (adjust EC and pH once for all containers) while maintaining the oxygen advantages of DWC. RDWC scales efficiently to 8–32 sites.

**Oxygen delivery**: Excellent — the air stone produces continuous fine bubbles that maximize solution-air interface and dissolved oxygen. With a properly sized pump, DO stays well above the 5 mg/L threshold even in warm conditions.

**Pump failure risk**: Low to moderate. Unlike NFT, the reservoir contains enough solution to sustain the plant for several hours after pump failure — time to diagnose and repair. However, large plants with full root masses in warm conditions can deplete DO within 2–4 hours.

#### Diagram: Hydroponic Systems Side-by-Side Comparison
<iframe src="../../sims/hydroponic-systems-comparison/main.html" width="100%" height="540px" scrolling="no"></iframe>
<details markdown="1">
<summary>Hydroponic Systems Side-by-Side Comparison Interactive Diagram</summary>
Type: diagram
**sim-id:** hydroponic-systems-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let students visually compare all six hydroponic system architectures side by side, click each to see how it works, and explore trade-offs on key dimensions (oxygen, cost, complexity, pump risk, crop suitability).

Bloom Level: Analyze (L4) and Evaluate (L5)
Bloom Verb: Compare and judge — students compare architectures and make a justified system selection for a given scenario

Layout: Gallery view showing six small system diagram thumbnails arranged in a 2×3 or 3×2 grid; each thumbnail shows the key structural elements of that system type in a simple cross-sectional illustration

Thumbnails (each is a simplified cross-section, click to expand):
1. Kratky: Mason jar + net pot + root growing into solution + air gap labeled
2. DWC: Bucket + net pot + roots in solution + air stone + air pump
3. NFT: Channel at slight angle + thin film on channel floor + roots sitting in film + pump + reservoir
4. Ebb-and-Flow: Flood table above reservoir + pump + timer + plants in growing medium + overflow drain
5. Aeroponics: Roots hanging in air chamber + misting nozzles spraying roots + collection trough + high-pressure pump
6. Fogponics: Ultrasonic fogger in reservoir + fog rising around roots + enclosed chamber

Expanded detail panel (appears when thumbnail is clicked, takes 60% of canvas):
- System diagram with labeled components
- Animated flow showing solution/air movement (solution flow arrow, oxygen delivery visualization)
- Ratings display:
  - Oxygen Delivery: 1–5 stars
  - Pump Failure Risk: 1–5 (1=none, 5=immediate death)
  - Setup Complexity: 1–5
  - Cost to Build: $ to $$$$$
  - Best Crops: list of suitable crops
- One-sentence "key insight" about this system

Animation: Each system shows its characteristic movement — DWC shows bubbles rising, NFT shows film flowing, Aeroponics shows mist spray pulses

Return button: "Back to gallery"

Responsive: Grid wraps to single column on narrow screens; detail panel stacks below thumbnails
</details>

## Nutrient Film Technique (NFT)

**Nutrient Film Technique (NFT)**, developed by researcher Allan Cooper in England in the 1970s, is the backbone of commercial lettuce and herb production worldwide. In NFT, a very thin (1–3 mm) film of nutrient solution flows continuously along the bottom of slightly inclined growing channels. Plant roots sit in these channels, with the lower portion touching the film and the upper portion hanging in air above the film.

**NFT channel design**: Channels are typically made from PVC or white polypropylene, 50–100 mm wide, arranged at a slope of 1:40 to 1:100 (1–2.5 cm drop per meter). The slope ensures solution flows by gravity from the inlet end to the drain end, where it falls back into the reservoir for recirculation. Net pots or plant plugs sit in holes cut at regular intervals along the channel top.

**NFT flow rate**: The correct film thickness (1–3 mm) requires careful flow rate calibration. Too fast and the channel floods rather than films; too slow and the film dries out between root contact points. Typical flow rates are 0.5–2.0 L/min per channel. A submersible pump in the central reservoir drives solution up to the top of the channels through a manifold.

**NFT pump failure risk**: This is NFT's significant weakness. Because the root mass sits directly in a thin film — not a deep reservoir — pump failure immediately stops solution flow. Within 15–60 minutes, the roots begin to dry out (the root mass above the film level has no moisture reserve). In warm conditions this can kill the crop within a few hours. Commercial NFT operations maintain backup pumps on-site, and the pump failure risk is a key factor in the Chapter 7 discussion of redundancy design.

**Why NFT works so well for lettuce**: The design provides excellent oxygen access (most of the root is in air at all times), delivers nutrients continuously to the root zone, and allows very tight plant spacing in commercial channels. Lettuce heads can be spaced every 20–25 cm in an NFT channel, producing 16–20 kg/m²/year in commercial operations.

## Ebb-and-Flow (Flood-and-Drain) System

**Ebb-and-Flow** (also called flood-and-drain) periodically floods a growing container or tray with nutrient solution, then drains it back to a reservoir by gravity. The flooding action saturates the growing medium with solution; the draining action pulls fresh oxygen into the air pockets around the roots.

**Flood table design**: The growing tray is elevated above the reservoir, which sits directly below. A submersible pump in the reservoir drives solution up to the tray; when the pump turns off, solution drains back through the same pipe or through a separate overflow/drain fitting. The tray is typically flat or very slightly sloped to prevent pooling.

**Ebb-and-flow timer programming**: A digital timer (or microcontroller) turns the pump on for a flooding period (typically 15–30 minutes) and off for a drain period (typically 2–4 hours for most media). Flood frequency depends on:
- Medium type: rockwool floods 2–4×/day; hydroton may flood 4–8×/day in warm conditions
- Plant size and transpiration rate: large plants need more frequent flooding
- Climate: hot, dry conditions require more frequent flooding to prevent medium dry-out

The ebb-and-flow system is one of the most versatile system types: it works with nearly all growing media, handles most crop types, and the periodic wet-dry cycle mimics natural rainfall patterns that many crops are adapted to. It is the preferred system for large fruiting crops (tomatoes, cucumbers, peppers) in schools and home gardens.

## Aeroponics

**Aeroponics** suspends plant roots in open air inside a sealed chamber and delivers nutrient solution as fine mist or droplets sprayed directly onto the root surface. Roots are never submerged — they hang entirely in an air-saturated environment between spray events.

The two aeroponics variants differ primarily in spray pressure and droplet size:

**High-pressure aeroponics (HPA)**: Uses a pump operating at 80–120 PSI to force solution through misting nozzles producing droplets of 5–50 µm diameter. Droplets this fine penetrate the root boundary layer efficiently and deliver both nutrients and oxygen directly to root hair surfaces. HPA is the technology used in commercial aeroponics operations (AeroFarms uses a proprietary variant) and produces the fastest root growth of any hydroponic system type.

**Low-pressure aeroponics (LPA)**: Uses a standard submersible pump (5–20 PSI) to deliver solution through larger-aperture spray heads, producing droplets of 100–500 µm. Less efficient than HPA but much cheaper (no high-pressure pump required). Often used in home tower gardens and vertical planter systems.

**Pump failure risk**: Very high. Because roots hang in open air, even brief pump interruptions cause rapid root desiccation. Commercial aeroponic operations use redundant high-pressure pump systems with automatic failover.

## Fogponics

**Fogponics** (a portmanteau of fog + hydroponics) is a variant of aeroponics that uses ultrasonic transducers submerged in solution to create an ultra-fine fog of 1–10 µm droplets. The fog rises through the root zone by convection, coating roots with a continuous film of nutrients and oxygen.

Fogponics produces the finest droplets of any nutrient delivery method, in theory maximizing surface contact with root hairs. In practice, commercial fogponics has not displaced HPA because ultrasonic transducers can clog with mineral deposits, the fine mist does not penetrate dense root masses well, and nutrient concentration in the fog may differ from the bulk solution.

Fogponics is popular for propagation (cloning) and for demonstration systems where the visual effect of fog rising through a clear-sided chamber is engaging for educational purposes.

## Drip Irrigation Hydroponics

**Drip irrigation hydroponics** (also called top-feed or drip systems) delivers nutrient solution as intermittent drips or slow trickles directly to the base of each plant through thin-diameter emitter tubes. A pump pushes solution from a reservoir through a manifold to individual emitters; excess solution drains through the growing medium and either recirculates or runs to waste.

**Run-to-waste drip systems** deliver one-time-use solution that is not recirculated. Excess drains to a collection sump or is discarded. This avoids salt and pH accumulation in the root zone but uses more water and nutrients. Commercial greenhouse tomato and pepper production typically uses run-to-waste drip on rockwool or coir substrate.

**Recirculating drip systems** collect runoff and return it to the reservoir. More resource-efficient but requires monitoring and adjustment of the reservoir as returned solution accumulates roots and microorganisms.

Drip systems pair well with rockwool slabs, coconut coir, perlite, or expanded clay media for large fruiting crops. They are the dominant technology in Dutch-style commercial greenhouse production.

!!! mascot-tip "For a first build, start with Kratky or single-bucket DWC"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Cress points upward with one finger">
    The temptation for new growers is to build the most sophisticated system immediately. Resist it. A Kratky mason jar or a 5-gallon bucket DWC teaches you the chemistry and daily observation habits that every other system requires — without the capital investment or the high failure risk of NFT or aeroponics. Master the basics on low-cost systems, then scale up with confidence. Chapter 8 has step-by-step build instructions for both.

## System Selection Guide

Before Chapter 7 covers maintenance and reliability in depth, here is a practical decision framework for system selection. Three questions drive the decision:

1. **What are you growing?** Leafy greens and herbs → Kratky, DWC, or NFT. Fruiting crops → DWC, ebb-and-flow, or drip. Root crops → ebb-and-flow or aeroponics.
2. **What is your failure tolerance?** Power outages common or pump reliability uncertain → Kratky (no pump) or DWC (several-hour buffer). Commercial / high-value crop → NFT or aeroponics with redundant pumps.
3. **What is your budget and skill level?** Beginner, <$100 → Kratky. Intermediate, $100–500 → DWC or NFT. Advanced, $500+ → ebb-and-flow, aeroponics, or commercial DWC.

#### Diagram: System Selection Decision Tree
<iframe src="../../sims/system-selection-decision-tree/main.html" width="100%" height="480px" scrolling="no"></iframe>
<details markdown="1">
<summary>Hydroponic System Selection Decision Tree</summary>
Type: workflow
**sim-id:** system-selection-decision-tree<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Guide students through a series of decision criteria to arrive at a recommended system type for a given growing scenario. Reinforces the trade-off concepts from the chapter and gives students practice with decision-making reasoning.

Bloom Level: Evaluate (L5)
Bloom Verb: Recommend — students recommend a system type and justify the choice using trade-off criteria

Visual layout: Top-down flowchart with clickable decision nodes

Decision tree structure:
Root: "What is your primary crop?" → Leafy greens/herbs | Fruiting crops | Root crops | Propagation

Leafy greens/herbs branch:
  → "Do you have reliable electricity?" → Yes: "What is your budget?" → <$50: Kratky | $50-200: DWC | $200+: NFT
  → No: "Use Kratky — no electricity required" (terminal node)

Fruiting crops branch:
  → "Expected growth duration?" → Short cycle (<60 days): DWC | Long cycle (>60 days): Ebb-and-Flow or Drip

Root crops branch:
  → "Scale?" → Small/Home: Ebb-and-Flow | Large/Commercial: Aeroponics

Propagation branch:
  → "Speed priority?" → Max speed: Fogponics | Good enough: DWC clone bucket

Each terminal node (system recommendation) is clickable to open a panel with:
- System name and one-sentence description
- Estimated cost range to build
- Key strength and key weakness
- "Learn more" link pointing to relevant section in this chapter

Interactivity:
- Each decision diamond is hoverable to see the decision question in full
- Users can click "Reset" to start over from the root
- Previously-visited paths remain highlighted in a lighter color for comparison
- Each branch can be selected and re-selected to explore different paths

Visual style: Green for confirmed paths, gray for unexplored branches, teal for terminal recommendation nodes
</details>

## Key Takeaways

- **Passive systems** (Kratky) require no electricity and have zero pump-failure risk; the self-adjusting air gap provides passive oxygenation.
- **DWC** offers excellent oxygen delivery from an air stone; single-bucket builds are the best starting point for active hydroponic systems.
- **NFT** is the commercial standard for leafy greens — thin-film channels provide excellent oxygen — but pump failure kills the crop within an hour.
- **Ebb-and-flow** is the most versatile system: periodic flood-drain works with any growing medium and most crop types.
- **Aeroponics** delivers maximum oxygen to hanging roots and fastest growth, but requires high-pressure pumps and near-zero failure tolerance.
- **Fogponics** uses ultrasonic transducers to create ultra-fine mist; useful for propagation but clogging is a persistent issue.
- **Drip irrigation** is the dominant commercial technology for fruiting crops on rockwool or coir substrate.
- System selection drives on three factors: crop type, failure tolerance, and budget/skill level.

??? question "Check Your Understanding — Click to reveal the answer"
    **Question:** A high school classroom wants to grow lettuce year-round. The classroom has reliable electricity, a $200 budget, and a teacher who can check the system every school day but not on weekends. Which system type would you recommend, and why?

    **Answer:** A **DWC single-bucket or multi-site DWC system** is the best fit. Reasoning: (1) DWC works excellently for lettuce; (2) the $200 budget covers a 4–8 site DWC setup; (3) critically, DWC has a low pump-failure risk — the reservoir contains enough aerated solution to sustain plants through a 48-hour weekend without intervention, unlike NFT which would kill the crop within an hour of pump failure. Kratky would also work and requires no weekend monitoring, but DWC grows lettuce faster and gives students the opportunity to learn active system management.

!!! mascot-celebration "Chapter 6 complete — you know all six system architectures!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You can now look at any hydroponic system and identify its type, understand how it delivers oxygen and nutrients, and assess its failure risk. Chapter 7 dives deeper into the engineering details that determine whether a system runs reliably for a full crop cycle: pump sizing, reservoir design, failure modes, redundancy, and the cleaning protocols between cycles. The devil is in the details!
