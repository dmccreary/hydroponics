# Quiz: Sensors and Electronics

Test your understanding of pH probe electrochemistry, EC measurement, temperature and humidity sensors, flow sensors, solenoid valves, sensor signal conditioning, and enclosure design for hydroponic environments with these questions.

---

#### 1. A pH glass electrode produces a voltage that changes according to the Nernst equation. At 25°C, what is the voltage change per pH unit, and what does this mean for calibration?

<div class="upper-alpha" markdown>
1. 100 mV per pH unit; two-point calibration at pH 4 and pH 10 spans 600 mV
2. 59.16 mV per pH unit; the full pH 0–14 range spans approximately 828 mV, requiring precise millivolt measurement
3. 10 mV per pH unit; making pH 7 differ from pH 6 by only 10 mV
4. 200 mV per pH unit; one-point calibration at pH 7 is sufficient for all hydroponic applications
</div>

??? question "Show Answer"
    The correct answer is **B**. The Nernst equation predicts 59.16 mV per pH unit at 25°C (this changes with temperature — another source of drift). A pH electrode at pH 7.0 produces 0 mV (the isopotential point); at pH 6.0 it produces +59.16 mV; at pH 8.0 it produces −59.16 mV. The full 0–14 range spans ±414 mV. This requires the measurement circuit (pH interface chip like Atlas Scientific EZO-pH) to accurately resolve millivolt-level signals from a high-impedance glass electrode. Two-point calibration with buffer solutions establishes the electrode's actual slope and offset, correcting for manufacturing variation and aging.

    **Concept Tested:** pH Glass Electrode

---

#### 2. Why do EC (electrical conductivity) meters use alternating current (AC) rather than direct current (DC) to measure conductivity?

<div class="upper-alpha" markdown>
1. AC is safer than DC for measurements made near water and living plants
2. DC current causes electrolysis — gas bubble formation and electrode plating — at the probe surfaces, which alters the measurement and damages the electrodes; AC reverses direction fast enough to prevent electrolytic buildup
3. AC allows the meter to measure both positive and negative ions simultaneously, improving accuracy
4. DC is too slow to measure the rapidly changing ion concentrations in a recirculating nutrient solution
</div>

??? question "Show Answer"
    The correct answer is **B**. When DC current flows through an ionic solution between two electrodes, electrolysis occurs: positive ions migrate to the negative electrode and deposit there (plating), while negative ions migrate to the positive electrode and gas evolves. This changes the electrode surface chemistry, shifts the apparent resistance, and damages the probe over time. AC (typically 1–10 kHz square wave) reverses the current direction thousands of times per second, averaging out ion migration and preventing net accumulation at either electrode. This keeps the probe clean and the measurement accurate over time.

    **Concept Tested:** EC Probe AC Measurement

---

#### 3. A DHT22 sensor is connected to a MicroPython controller to measure grow room temperature and humidity for VPD calculation. Why is a DHT22 required rather than the less expensive DHT11?

<div class="upper-alpha" markdown>
1. DHT22 supports I2C communication; DHT11 only supports analog voltage output
2. DHT22 measures humidity with 0.1% RH resolution and ±2% accuracy, while DHT11 has only 1% resolution and ±5% accuracy — the precision is required for accurate VPD calculation used in crop management
3. DHT22 is waterproof and can be submerged; DHT11 cannot be used in humid environments
4. DHT11 is discontinued and no longer available; DHT22 is the current replacement
</div>

??? question "Show Answer"
    The correct answer is **B**. VPD calculation requires accurate humidity measurement: a ±5% RH error in the DHT11 translates to VPD errors of 0.1–0.2 kPa depending on temperature — enough to misclassify a 0.8 kPa optimal condition as a 0.9+ kPa stress condition or vice versa. The DHT22's ±2% RH accuracy and 0.1% resolution provide the precision needed for reliable VPD management. The DHT11 is adequate for simple "too humid / not humid enough" alerts but not for precision VPD-based crop management decisions.

    **Concept Tested:** DHT22 vs DHT11

---

#### 4. A solenoid valve controlling water flow into a hydroponic system is specified as "normally closed (NC)." What is the safe-failure advantage of a normally-closed valve over a normally-open valve?

<div class="upper-alpha" markdown>
1. Normally-closed valves use less electricity because power is only needed to open them, not to hold them closed
2. If power is lost or the controller fails, a normally-closed valve fails in the closed (safe) position — preventing flooding; a normally-open valve would allow uncontrolled water flow during a power failure
3. Normally-closed valves are more accurate for precise flow control because the spring force provides consistent calibration
4. Normally-closed valves work with both AC and DC solenoids; normally-open valves require DC only
</div>

??? question "Show Answer"
    The correct answer is **B**. Fail-safe design principle: solenoid valves should fail in the safest possible state. For water inlet to a hydroponics system, the dangerous failure mode is uncontrolled flooding — the tank or grow bed overflows. A normally-closed (NC) valve requires power to open. When power fails (controller crash, power outage, wiring fault), the spring returns the valve to the closed position, stopping water flow. A normally-open (NO) valve would flood uncontrollably during any power failure. Always specify NC valves for fill/supply lines in automated hydroponics systems.

    **Concept Tested:** Solenoid Valve Types

---

#### 5. After performing a two-point pH calibration with pH 4.0 and 7.0 buffer solutions, a grower's pH meter reads 6.2 in a nutrient solution that actually is at pH 6.2. Three weeks later, the meter reads 6.5 for the same solution without any changes being made. What maintenance step is most likely needed?

<div class="upper-alpha" markdown>
1. Replace the nutrient solution — pH drift of this magnitude indicates complete formula breakdown
2. Recalibrate the pH meter — glass electrodes drift over time due to reference junction contamination and membrane aging, requiring periodic two-point recalibration
3. Add pH-Down to bring the solution to the meter's reading — trust the current meter value
4. Replace the probe's storage solution — evaporation of the storage solution causes pH to read high
</div>

??? question "Show Answer"
    The correct answer is **B**. pH glass electrodes drift for several reasons: the reference junction (usually KCl solution) can become contaminated with nutrient ions; the glass membrane's hydration layer changes with use and storage conditions; and the electrode's slope (mV/pH) changes as the glass ages. The 0.3 pH unit shift in this scenario is consistent with electrode drift, not solution change. Recalibration with fresh buffer solutions corrects for the current electrode state. Electrode replacement is needed when the slope drops below approximately 95% of theoretical (56+ mV/pH unit), typically after 6–18 months depending on use.

    **Concept Tested:** pH Probe Maintenance

---

#### 6. A MicroPython controller reads a pH sensor every second. Raw readings fluctuate between 6.1 and 6.5 due to electrical noise, though the actual solution pH is stable at 6.3. What signal processing technique most effectively reduces this noise?

<div class="upper-alpha" markdown>
1. Read the sensor only once per hour — less frequent readings eliminate noise by sampling during quiet periods
2. Apply a moving average filter over the last 3–5 readings to smooth high-frequency electrical noise while still detecting real pH changes within a few seconds
3. Round all readings to one decimal place — the 0.1 resolution eliminates sub-unit noise automatically
4. Use a lower-quality ADC with less sensitivity — higher-precision ADCs amplify noise
</div>

??? question "Show Answer"
    The correct answer is **B**. A moving average filter maintains a rolling buffer of the N most recent readings and returns their average. For pH: store the last 5 readings [6.1, 6.3, 6.5, 6.2, 6.4]; average = 6.3. The next second, drop the oldest and add the new reading, recalculate. This smooths high-frequency noise (electrical interference, pump vibration) while a real sustained pH change (e.g., acid injection) will shift the average within 3–5 readings. Window sizes of 3–5 samples balance noise rejection against response speed adequately for hydroponics, where pH changes of concern take minutes to develop.

    **Concept Tested:** Moving Average Filter

---

#### 7. A grower uses a hall-effect flow sensor to measure nutrient solution flow rate through an NFT system. The sensor outputs 450 pulses per liter. In one minute, the controller counts 4,500 pulses. What is the flow rate in liters per minute (L/min)?

<div class="upper-alpha" markdown>
1. 4.5 L/min
2. 10 L/min
3. 0.1 L/min
4. 450 L/min
</div>

??? question "Show Answer"
    The correct answer is **B**. Flow rate = pulse count ÷ pulses per liter = 4,500 pulses ÷ 450 pulses/liter = 10 liters. Since this occurred over 1 minute, the flow rate is 10 L/min. Flow sensors are valuable for detecting pump degradation in NFT systems (where low flow causes crop loss) — if the expected 10 L/min drops to 6 L/min over several weeks, the pump impeller is wearing or a partial clog is developing, triggering a maintenance alert before complete failure.

    **Concept Tested:** Flow Sensors

---

#### 8. What is the correct procedure for storing a pH probe between uses to maintain its calibration and extend its service life?

<div class="upper-alpha" markdown>
1. Store the probe in distilled water to keep the glass membrane hydrated
2. Store the probe in pH 4.0 buffer solution or dedicated electrode storage solution, keeping the glass membrane and reference junction moist
3. Allow the probe to air-dry completely between uses to prevent bacterial growth on the glass surface
4. Store the probe in the nutrient solution from the last measurement — this maintains the electrode in a similar environment
</div>

??? question "Show Answer"
    The correct answer is **B**. pH glass electrodes must be stored moist — the glass membrane requires a hydration layer to function properly and loses calibration accuracy when dried out. However, distilled or RO water is incorrect: it is hypotonic and can draw KCl out of the reference junction, degrading it. The correct storage solution is either pH 4.0 buffer solution (slightly acidic, similar to the electrode's typical use environment) or the manufacturer's dedicated electrode storage solution (usually ~3M KCl). Never store in nutrient solution — mineral deposits can block the reference junction.

    **Concept Tested:** pH Probe Maintenance

---

#### 9. A carbon dioxide (CO₂) sensor based on NDIR (non-dispersive infrared) technology drifts upward by approximately 50 ppm per month. How should this sensor be used in a long-term grow facility monitoring system?

<div class="upper-alpha" markdown>
1. Replace the sensor every month — NDIR sensors have a 30-day service life by design
2. Perform automatic baseline correction (ABC) by exposing the sensor to fresh outdoor air (approximately 420 ppm CO₂) at regular intervals, or manual recalibration against a known reference concentration
3. Add 50 ppm to all readings each month to compensate for the drift mathematically
4. NDIR CO₂ sensors do not drift — if readings increase 50 ppm, actual CO₂ levels have increased
</div>

??? question "Show Answer"
    The correct answer is **B**. NDIR CO₂ sensors drift due to aging of the optical components and changes in the light source intensity. Many industrial sensors include an Automatic Baseline Correction (ABC) algorithm that assumes the lowest readings over 7–14 days represent fresh outdoor air (~420 ppm) and calibrates accordingly — this works if the sensor is periodically exposed to outdoor air levels. For sealed grow rooms with continuous CO₂ enrichment, ABC may misfire; manual zero-point calibration against a reference gas or known outdoor air (with the enrichment system off) should be performed every 3–6 months.

    **Concept Tested:** CO₂ Sensor Calibration

---

#### 10. A sensor module that runs on 5V logic is to be connected to a Raspberry Pi Pico that operates at 3.3V. Beyond the voltage divider for the sensor's output signal, what additional concern must be addressed for bidirectional I2C communication?

<div class="upper-alpha" markdown>
1. No additional concern — voltage dividers work for all I2C signals in both directions
2. I2C is bidirectional — simple resistive voltage dividers only work in one direction; a dedicated bidirectional level shifter IC (like BSS138-based modules) is required so both the Pico and sensor can drive the bus lines safely
3. I2C signals do not require level shifting — the I2C protocol automatically adjusts to the lowest voltage in the system
4. Bidirectional I2C requires two separate buses at different voltages — level shifting between buses is not possible
</div>

??? question "Show Answer"
    The correct answer is **B**. This is a footgun: a simple resistive voltage divider (two resistors) is a passive one-directional circuit — it reduces 5V to 3.3V for signals going from the sensor to the Pico, but it cannot safely translate 3.3V Pico outputs to 5V for signals going the other direction. For bidirectional I2C, dedicated level-shifter modules using N-channel MOSFETs (such as the BSS138-based TXB0102 or MOSFET-based 4-channel modules) allow both the 3.3V Pico and 5V sensor to drive the bus lines at their respective logic levels. Using a simple voltage divider on a bidirectional I2C bus can damage the Pico or cause unreliable communication.

    **Concept Tested:** Bidirectional Level Shifting

---
