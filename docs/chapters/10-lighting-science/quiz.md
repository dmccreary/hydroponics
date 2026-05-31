# Quiz: Lighting Science for Indoor Growing

Test your understanding of PAR, PPFD, DLI, light spectrum, LED versus HID technology, and light recipe design with these questions.

---

#### 1. What wavelength range defines photosynthetically active radiation (PAR), and why is visible light outside this range not counted?

<div class="upper-alpha" markdown>
1. 300–800 nm; ultraviolet wavelengths below 400 nm are harmful to plants
2. 400–700 nm; chlorophyll a and b absorb primarily in this range for photosynthesis
3. 500–650 nm; only green and red wavelengths drive the Calvin cycle
4. 380–780 nm; this matches the full human visible spectrum used to measure plant light
</div>

??? question "Show Answer"
    The correct answer is **B**. PAR is defined as 400–700 nm because the two primary photosynthetic pigments — chlorophyll a (peak ~680 nm) and chlorophyll b (peak ~640 nm), along with accessory pigments — absorb light most efficiently within this range and use it to drive the light-dependent reactions of photosynthesis. Wavelengths below 400 nm (UV) and above 700 nm (far-red/infrared) are not efficiently used by primary chlorophyll for photosynthesis, though far-red has secondary effects through the Emerson enhancement effect.

    **Concept Tested:** PAR Definition

---

#### 2. A grower measures PPFD of 400 µmol/m²/s at canopy level for a 16-hour photoperiod. What is the Daily Light Integral (DLI) in mol/m²/day?

<div class="upper-alpha" markdown>
1. 6.4 mol/m²/day
2. 23.0 mol/m²/day
3. 400 mol/m²/day
4. 57.6 mol/m²/day
</div>

??? question "Show Answer"
    The correct answer is **B**. The DLI formula is: DLI = PPFD × photoperiod hours × 3600 ÷ 1,000,000. Calculating: 400 µmol/m²/s × 16 hours × 3600 seconds/hour = 23,040,000 µmol/m²/day. Dividing by 1,000,000 converts µmol to mol: 23.04 mol/m²/day ≈ 23.0 mol/m²/day. DLI integrates instantaneous light intensity over the entire photoperiod, making it the most useful metric for comparing light delivery across different photoperiod lengths.

    **Concept Tested:** Daily Light Integral (DLI)

---

#### 3. What is the primary reason commercial greenhouse operators are switching from HPS (high-pressure sodium) to LED grow lights despite the higher upfront cost of LEDs?

<div class="upper-alpha" markdown>
1. LED lights last forever and never require replacement, unlike HPS bulbs that fail after 6 months
2. LEDs produce 2.5–3.5 µmol/J versus HPS 1.0–1.5 µmol/J, significantly reducing electricity cost per unit of photosynthesis
3. HPS lights require 3-phase power while LEDs operate on standard 120V household circuits
4. LEDs emit no heat, eliminating the need for HVAC systems in commercial greenhouses
</div>

??? question "Show Answer"
    The correct answer is **B**. Modern LED fixtures achieve 2.5–3.5 µmol of PAR per joule of electrical energy consumed, compared to 1.0–1.5 µmol/J for HPS. This 2–2.5× efficiency advantage directly reduces electricity cost per unit of photosynthesis — electricity is often the largest operating expense in a fully enclosed facility. Over a 5–7 year payback period, the electricity savings exceed the higher fixture cost. LEDs do still emit heat (just less), and HPS can run on standard circuits.

    **Concept Tested:** LED vs HID Comparison

---

#### 4. A grower doubles the distance from their LED fixture to the plant canopy. According to the inverse square law, what happens to the PPFD at the canopy?

<div class="upper-alpha" markdown>
1. PPFD decreases by half (50% reduction)
2. PPFD decreases to one quarter of the original value (75% reduction)
3. PPFD decreases by one third (33% reduction)
4. PPFD is unaffected because LED intensity is constant regardless of distance
</div>

??? question "Show Answer"
    The correct answer is **B**. The inverse square law states that light intensity decreases with the square of the distance: I₂ = I₁ × (d₁/d₂)². If distance doubles (d₂ = 2d₁), then I₂ = I₁ × (1/2)² = I₁/4. The PPFD drops to one quarter of its original value — a 75% reduction. This explains why hanging height is critical: moving a light from 12 inches to 24 inches above the canopy reduces delivered PPFD by 75%, not just 50%. Manufacturers specify PPFD at specific hanging heights for this reason.

    **Concept Tested:** Inverse Square Law

---

#### 5. Why is measuring grow light output in lumens (lux) insufficient for evaluating its effectiveness for plant growth?

<div class="upper-alpha" markdown>
1. Lumens measure heat output rather than light output, making them irrelevant for photosynthesis
2. Lumens are weighted to human eye sensitivity (peaking at 555 nm green), which undervalues the blue and red wavelengths most important for photosynthesis
3. Lux measurements require expensive equipment that is not available to most growers
4. Lumens measure total light emitted in all directions, not just the downward light that reaches plants
</div>

??? question "Show Answer"
    The correct answer is **B**. Lumens are a photometric unit weighted to the sensitivity curve of the human eye, which peaks at 555 nm (green). Plants, however, primarily use blue (400–500 nm) and red (600–700 nm) wavelengths. A green LED can produce high lumen output while delivering very little PAR useful for photosynthesis, while a red+blue LED at lower lumen output may deliver more photosynthetically useful light. PPFD in µmol/m²/s is the correct metric because it counts photons in the 400–700 nm range regardless of wavelength.

    **Concept Tested:** Lumens vs PPFD

---

#### 6. What DLI range is most appropriate for lettuce production in a fully controlled indoor environment?

<div class="upper-alpha" markdown>
1. 5–8 mol/m²/day — lettuce is a low-light crop and excess light causes tip burn
2. 12–17 mol/m²/day — matches optimal indoor lettuce yield and quality
3. 30–40 mol/m²/day — maximum light produces maximum yield for lettuce
4. 2–4 mol/m²/day — lettuce evolved under dense canopy shade conditions
</div>

??? question "Show Answer"
    The correct answer is **B**. Lettuce achieves optimal yield and quality at a DLI of 12–17 mol/m²/day in controlled environments. Below 12 mol/m²/day, plants are light-limited and growth slows. Above 17 mol/m²/day, tip burn risk increases as calcium delivery cannot keep pace with high transpiration rates, and quality can decline. At 30–40 mol/m²/day, lettuce shows photoinhibition and significant tip burn. The 12–17 range is the target for commercial lettuce production using LED systems.

    **Concept Tested:** DLI Targets by Crop

---

#### 7. In a "light recipe," what is the specific physiological effect of far-red light (700–800 nm) added to a standard red/blue LED spectrum?

<div class="upper-alpha" markdown>
1. Far-red light triggers anthocyanin production, improving the color and antioxidant content of leafy greens
2. Far-red activates phytochrome Pr→Pfr conversion, triggering shade avoidance responses that elongate stems and increase leaf expansion
3. Far-red penetrates deeper into the canopy than visible wavelengths, improving lower-leaf photosynthesis
4. Far-red light has no measurable effect on plants but is included for aesthetic purposes in commercial facilities
</div>

??? question "Show Answer"
    The correct answer is **B**. Far-red light (700–800 nm) is absorbed by phytochrome, converting the inactive Pr form to the active Pfr form. This signals "open sky" conditions to the plant, triggering shade avoidance responses: stem elongation (internode extension) and increased leaf expansion. In controlled environment production, strategic far-red addition can accelerate leaf expansion, increase fresh weight, and reduce crop cycle time. It also modulates flowering in photoperiod-sensitive crops. Anthocyanin production is primarily triggered by blue and UV light, not far-red.

    **Concept Tested:** Light Spectrum and Plant Physiology

---

#### 8. A grower needs to choose between a 400W HPS fixture and a 200W LED fixture, both claiming to deliver the same PPFD at canopy level. What is the most important factor to verify before concluding the LED is more efficient?

<div class="upper-alpha" markdown>
1. The color temperature (Kelvin rating) of both fixtures must be identical
2. Third-party photometric test data (µmol/s total output and PPFD maps) rather than manufacturer marketing claims
3. The wattage draw at 240V versus 120V for each fixture type
4. The country of manufacture, as import tariffs affect total cost of ownership
</div>

??? question "Show Answer"
    The correct answer is **B**. LED marketing frequently overstates output — a "400W equivalent" LED may draw only 200W but also deliver only 60% of the PPFD claimed. The only reliable comparison is third-party photometric test data showing: (1) actual power draw under operating conditions, (2) total PAR output in µmol/s, (3) PPFD maps at specified hanging heights. Fixtures should be compared using PPE (photosynthetic photon efficacy) in µmol/J calculated from measured data, not claimed specifications. This is a significant pitfall in the LED grow light market.

    **Concept Tested:** LED Efficacy Claims

---

#### 9. Why must photoperiod be strictly controlled at exactly 18 hours light / 6 hours dark for cannabis in vegetative phase, and what happens if the dark period is interrupted?

<div class="upper-alpha" markdown>
1. 18/6 is required for root development; dark period interruption causes root stunting
2. Many short-day plants measure the length of the uninterrupted dark period using phytochrome; even brief light interruption prevents flowering trigger in long-night species
3. The 18/6 ratio optimizes CO₂ uptake during lights-on and respiration recovery during lights-off
4. Photoperiod disruption has no biological effect; the 18/6 schedule is purely for energy cost management
</div>

??? question "Show Answer"
    The correct answer is **B**. Many plants (including cannabis) are photoperiod-sensitive "short-day" plants that actually measure the length of the uninterrupted dark period. The phytochrome system (Pfr conversion back to Pr) is the clock. To keep cannabis in vegetative growth, growers maintain 18+ hours of light so the dark period (6 hours) remains below the critical night length threshold. Even a brief flash of light during the dark period resets the phytochrome clock and prevents the flowering trigger from accumulating. To initiate flowering, growers switch to 12/12 to provide a 12-hour uninterrupted dark period.

    **Concept Tested:** Photoperiod Control

---

#### 10. A commercial vertical farm is designing its light system and must choose between top lighting only versus top lighting plus interlighting (LEDs mounted between plant rows). What is the primary advantage of interlighting for a dense tomato canopy?

<div class="upper-alpha" markdown>
1. Interlighting LEDs are cheaper than top lights because they require lower wattage
2. Top lighting cannot penetrate a dense tomato canopy; interlighting delivers PAR directly to the lower fruit-bearing zones that are otherwise shaded
3. Interlighting eliminates the need for top lighting entirely, reducing fixture count
4. Interlighting provides the far-red wavelengths that top LEDs cannot produce
</div>

??? question "Show Answer"
    The correct answer is **B**. Dense indeterminate tomato plants develop thick canopies where top lighting cannot penetrate to lower leaf tiers and fruiting zones. Light attenuation through a dense canopy reduces PPFD to near-zero at lower positions, limiting photosynthesis in the fruit-bearing zones. Interlighting — LEDs mounted on vertical rails between plant rows — delivers PAR directly to the mid and lower canopy, improving fruit set and quality on lower trusses. Commercial Dutch greenhouse operators have demonstrated 10–20% yield increases with interlighting on tomatoes compared to top lighting alone.

    **Concept Tested:** Vertical Lighting Design

---
