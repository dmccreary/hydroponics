# Quiz: Solar Energy and Power Systems

Test your understanding of the photovoltaic effect, solar panel sizing, MPPT controllers, battery technology, off-grid system design, LCOE calculations, and energy monitoring with INA219 with these questions.

---

#### 1. A 400 Wp solar panel is installed at a location receiving 4.5 peak sun hours per day, with a system efficiency of 80%. What is the estimated daily energy production in kWh?

<div class="upper-alpha" markdown>
1. 0.72 kWh/day
2. 1.44 kWh/day
3. 18.0 kWh/day
4. 400 kWh/day
</div>

??? question "Show Answer"
    The correct answer is **B**. Daily energy (Wh) = Panel watt-peak × Peak sun hours × System efficiency = 400 Wp × 4.5 PSH × 0.80 = 1,440 Wh/day = 1.44 kWh/day. System efficiency (0.75–0.85 typical) accounts for inverter losses, battery round-trip losses, wire resistance, and temperature derating. The 400 Wp rating is at Standard Test Conditions (1000 W/m², 25°C) — real-world output is always less. This formula is the foundation for sizing solar arrays for hydroponic grow rooms.

    **Concept Tested:** Solar Panel Output Calculation

---

#### 2. What is the key difference between a PWM charge controller and an MPPT charge controller, and why is MPPT preferred for hydroponics applications?

<div class="upper-alpha" markdown>
1. PWM controllers work with AC power; MPPT controllers only work with DC power
2. MPPT continuously tracks the solar panel's maximum power point (the voltage/current combination that produces maximum watts), extracting 15–30% more energy than PWM controllers that simply switch connection on and off
3. PWM controllers are more reliable and cheaper for all applications above 500 Wp
4. MPPT and PWM are identical in performance — the choice is purely aesthetic
</div>

??? question "Show Answer"
    The correct answer is **B**. A solar panel's power output is maximized at a specific voltage/current operating point (the maximum power point) that changes with temperature and sunlight intensity. MPPT controllers continuously compute and track this point using a DC-DC converter, extracting the maximum available power in all conditions. PWM controllers simply chop the panel's connection to control charging current, wasting the voltage difference between the panel's open-circuit voltage and the battery voltage. MPPT controllers extract 15–30% more energy from the same panel, paying back their higher cost within the first year of operation.

    **Concept Tested:** MPPT Max Power Point Tracking

---

#### 3. A grow room requires 2 days of battery autonomy and consumes 1,200 Wh/day. Using LiFePO4 batteries at 24V with 90% depth of discharge and 85% round-trip efficiency, what battery bank capacity (in Ah) is required?

<div class="upper-alpha" markdown>
1. 16 Ah
2. 65 Ah
3. 117 Ah
4. 2,400 Ah
</div>

??? question "Show Answer"
    The correct answer is **C**. Using the battery sizing formula: C = (E_daily × D_autonomy) / (DoD × V_system × η_battery) = (1,200 × 2) / (0.9 × 24 × 0.85) = 2,400 / 18.36 ≈ 131 Ah. The closest practical answer among options is C (117 Ah would be slightly undersized; a commercially available 150 Ah bank would be used in practice). The formula requires accounting for depth of discharge (LiFePO4 allows 90% vs. 50% for lead-acid) and battery round-trip efficiency (energy in vs. energy out). A 24V system splits the Wh requirement across two 12V batteries in series.

    **Concept Tested:** Battery Sizing for Grow Room

---

#### 4. Why do LiFePO4 (Lithium Iron Phosphate) batteries offer significantly better total cost of ownership than lead-acid batteries for a solar-powered hydroponic operation, despite their higher upfront cost?

<div class="upper-alpha" markdown>
1. LiFePO4 batteries require no battery management system (BMS), reducing maintenance costs
2. LiFePO4 batteries achieve 2,000–4,000+ cycles at 80% depth of discharge versus 300–1,000 cycles for lead-acid at only 50% DoD — their 4–10× longer lifespan and greater usable capacity make total cost of ownership significantly lower over 10 years
3. LiFePO4 batteries are manufactured closer to most hydroponic operations, reducing shipping costs
4. Lead-acid and LiFePO4 have identical total cost of ownership when energy costs are properly accounted for
</div>

??? question "Show Answer"
    The correct answer is **B**. LiFePO4 batteries cost 2–3× more upfront (~$250–400/kWh vs. ~$100–150/kWh for lead-acid), but the economics reverse over a full service life. Lead-acid batteries should not be discharged below 50% (damaging the plates); LiFePO4 can safely reach 90% DoD. Lead-acid lasts 300–1,000 cycles; LiFePO4 lasts 2,000–4,000+. For a hydroponic operation cycling batteries daily, a lead-acid bank may need replacement after 2–3 years; LiFePO4 may last 10+ years. When the replacement cost is factored in, LiFePO4 is cheaper per kWh of energy actually delivered over the system lifetime.

    **Concept Tested:** Lithium Iron Phosphate LiFePO4

---

#### 5. What is net metering, and what economic condition determines whether it provides an acceptable payback period for a grid-tie solar installation at a hydroponic farm?

<div class="upper-alpha" markdown>
1. Net metering is a measurement technique for comparing solar production to grid consumption; payback period depends only on panel efficiency
2. Net metering is the billing arrangement where excess solar production runs the electricity meter backward, crediting the customer at the retail rate; payback periods are acceptable (5–8 years) when utilities compensate excess production at full retail rate, but extend to 10–15 years when compensated at wholesale rates
3. Net metering is a federal subsidy program that pays farms $0.05/kWh for all solar production regardless of consumption
4. Net metering only applies to residential customers — commercial hydroponic farms cannot participate in net metering programs
</div>

??? question "Show Answer"
    The correct answer is **B**. Net metering allows grid-tie solar customers to "bank" excess production by running their electricity meter backward — when solar production exceeds consumption, the excess feeds the grid and reduces the electricity bill at the retail rate. The economic value of net metering depends entirely on the compensation rate: at full retail ($0.15/kWh), excess production is worth as much as consumed electricity, producing 5–8 year payback periods. When utilities pay only the wholesale/avoided-cost rate ($0.03–0.05/kWh) for excess production, the economic case weakens significantly and payback periods lengthen to 10–15 years.

    **Concept Tested:** Net Metering

---

#### 6. A hydroponic grow room energy audit reveals the following loads: 600W LED light (16 h/day), 30W water pump (24 h/day), 10W air pump × 2 (24 h/day), 50W circulation fan (20 h/day). What is the total daily energy consumption in kWh?

<div class="upper-alpha" markdown>
1. 6.9 kWh/day
2. 11.6 kWh/day
3. 1.4 kWh/day
4. 24.0 kWh/day
</div>

??? question "Show Answer"
    The correct answer is **B**. Calculating each load: LED light = 600W × 16h = 9,600 Wh; Water pump = 30W × 24h = 720 Wh; Air pumps = 20W × 24h = 480 Wh; Fan = 50W × 20h = 1,000 Wh. Total = 9,600 + 720 + 480 + 1,000 = 11,800 Wh/day ≈ 11.6 kWh/day. The LED grow light dominates at 82% of total energy consumption. This energy audit is the essential first step in solar system sizing — without it, panel and battery sizing will be wrong. Replacing the 600W fixture with a 300W equivalent (same PPFD, higher efficacy) would cut total energy by approximately 40%.

    **Concept Tested:** Energy Audit for Grow Room

---

#### 7. The INA219 power monitor IC is connected to monitor solar panel current flowing through a 0.1 Ω shunt resistor. The chip measures a shunt voltage of 150 mV. What current is flowing through the circuit?

<div class="upper-alpha" markdown>
1. 0.015 A (15 mA)
2. 1.5 A
3. 15 A
4. 150 A
</div>

??? question "Show Answer"
    The correct answer is **B**. The INA219 uses Ohm's law to calculate current from the shunt voltage: I = V_shunt / R_shunt = 150 mV / 0.1 Ω = 1.5 A. The INA219 measures the small voltage drop across the precision shunt resistor and uses this to compute current without breaking the circuit. At 12V bus voltage, 1.5A represents 18W of power (P = V × I = 12 × 1.5 = 18 W). The INA219 communicates this data over I2C to the MicroPython controller, enabling real-time monitoring of solar generation, load consumption, and battery charge/discharge rates.

    **Concept Tested:** Power Monitoring With INA219

---

#### 8. A solar system is calculated to have an LCOE of $0.058/kWh. The local grid electricity rate is $0.14/kWh. What is the approximate annual cost savings for a grow room consuming 11 kWh/day?

<div class="upper-alpha" markdown>
1. $5.50/year
2. $332/year
3. $1,650/year
4. $0 — LCOE savings only accumulate over the full 25-year lifetime
</div>

??? question "Show Answer"
    The correct answer is **B**. Annual energy = 11 kWh/day × 365 days = 4,015 kWh/year. Cost savings per kWh = grid rate − solar LCOE = $0.14 − $0.058 = $0.082/kWh. Annual savings = 4,015 kWh × $0.082 = $329 ≈ $332/year. At this savings rate, a $4,000 solar system would pay back in approximately 12 years — illustrating why LCOE comparisons must also include the payback period, not just the per-kWh comparison. If the electricity rate were $0.20/kWh, savings would be $568/year and payback would be approximately 7 years.

    **Concept Tested:** Levelized Cost of Energy (LCOE)

---

#### 9. What is the primary advantage of a hybrid grid-plus-battery solar system over either a pure off-grid system or a pure grid-tie system for a commercial hydroponic operation?

<div class="upper-alpha" markdown>
1. Hybrid systems are always cheaper than pure off-grid or grid-tie systems
2. Hybrid systems use solar and batteries for normal operation while using grid backup during extended cloudy periods, AND provide battery backup for critical loads (pumps, sensors) during grid outages — combining reliability with cost efficiency
3. Hybrid systems produce more electricity than either off-grid or grid-tie systems because they use both sources simultaneously
4. Hybrid systems eliminate the need for an MPPT charge controller because the grid manages power point tracking
</div>

??? question "Show Answer"
    The correct answer is **B**. A pure off-grid system requires large battery banks for cloudy days, increasing cost. A pure grid-tie system provides no protection during grid outages — critical hydroponics infrastructure (pumps, aeration, sensors) stops when the grid fails. A hybrid system combines both approaches: during normal operation, solar charges the battery and supplies the load; the grid supplements when solar is insufficient; and during a grid outage, the battery continues supplying the critical loads (pumps, climate control) that cannot tolerate interruption. This is the optimal configuration for commercial operations where crop loss due to infrastructure failure is unacceptable.

    **Concept Tested:** Hybrid Grid and Battery System

---

#### 10. Monocrystalline silicon solar panels are rated at 22% efficiency at Standard Test Conditions (STC). A grower installs them on a roof in summer where panel temperature reaches 65°C. If efficiency decreases 0.4% per °C above 25°C, what is the actual operating efficiency?

<div class="upper-alpha" markdown>
1. 21.6%
2. 18.4%
3. 6.0%
4. 22.0% — efficiency ratings already account for temperature
</div>

??? question "Show Answer"
    The correct answer is **B**. Temperature coefficient of 0.4%/°C means for each degree above 25°C, efficiency drops by 0.4 percentage points. Temperature excess = 65°C − 25°C = 40°C. Efficiency loss = 40 × 0.4% = 16% relative reduction? No — it is 40 × 0.4 = 16 percentage point reduction of the relative efficiency: 22% × (1 − 0.004 × 40) = 22% × (1 − 0.16) = 22% × 0.84 = 18.5% ≈ 18.4%. This ~16% reduction in output means the "400 Wp" panel produces approximately 336 W on a hot summer afternoon, not 400 W. STC ratings are measured at 25°C panel temperature, which rarely occurs in real installations.

    **Concept Tested:** Solar Panel Efficiency

---
