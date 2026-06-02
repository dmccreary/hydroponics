---
title: Sensors and Electronics Hardware
description: Physical hardware for hydroponic automation — pH electrodes, EC probes, temperature sensors, relays, pumps, solenoids, breadboard prototyping, signal conditioning, and waterproof enclosure design.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# Sensors and Electronics Hardware

## Summary

This chapter provides hands-on coverage of the physical hardware layer: how pH glass electrodes and EC probes work and how to calibrate them, temperature and humidity sensor specifications, relay modules and dosing pumps, solenoid valves and flow sensors, and electronics fundamentals including breadboard prototyping, PCB design basics, voltage dividers, op-amp signal conditioning, noise filtering, and waterproof enclosure design for sensors operating in wet environments.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. pH Electrode (Glass Electrode)
2. pH Probe Calibration
3. pH Calibration Buffers
4. EC Probe Design
5. EC Probe Calibration
6. DS18B20 Temperature Probe
7. DHT11 vs DHT22 Comparison
8. CO2 NDIR Sensor Technology
9. Water Level Sensor
10. Ultrasonic Distance Sensor
11. Float Switch
12. Relay Module
13. Dosing Pump (Peristaltic)
14. Solenoid Valve
15. Flow Sensor
16. Power Supply Selection
17. Breadboard Prototyping
18. PCB Design Basics
19. Voltage Divider Circuit
20. Op-Amp Circuits
21. Sensor Noise and Filtering
22. Moving Average Filter
23. Analog Signal Conditioning
24. Sensor Drift and Recalibration
25. Wireless Sensor Node Design
26. Battery-Powered Sensor Nodes
27. Sensor Data Timestamping
28. Multiplexed Sensor Reading
29. Atlas Scientific EZO Circuits
30. Sensor Enclosure Waterproofing

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Nutrient Solution Chemistry and Mixing](../05-nutrient-solution-chemistry/index.md)
- [Chapter 8: DIY Systems and School Projects](../08-diy-school-projects/index.md)
- [Chapter 13: Hardware Interfaces and Sensor Programming](../13-hardware-interfaces/index.md)
- [Chapter 14: Networking, IoT, and Advanced MicroPython](../14-networking-iot/index.md)

---

!!! mascot-welcome "Cress opens the hardware toolbox"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 15, growers! Chapters 12–14 covered the software stack. Now we go back to the physical hardware — how do pH electrodes actually measure acidity? Why does an EC probe need two platinum rings? How do you condition a noisy millivolt signal before it reaches your microcontroller's ADC? By the end of this chapter, you'll understand the electronics layer well enough to design, prototype, and waterproof your own sensor node from scratch.

## pH Electrode: The Glass Electrode

The **pH glass electrode** is one of the most chemically elegant sensors in analytical chemistry. Understanding how it works explains why pH probes are fragile, why they need calibration, and why they must be kept moist.

A glass electrode consists of a thin glass membrane at the tip of the probe. This glass is specially formulated to be permeable only to hydrogen ions (H⁺). When the membrane is immersed in a solution, hydrogen ions exchange between the solution and a layer within the glass, creating a potential difference (voltage) across the membrane.

The voltage across the membrane follows the Nernst equation. Before we state it, two terms: **E** is the voltage (electromotive force, in millivolts), and **R**, **T**, **F** are the gas constant, absolute temperature, and Faraday constant respectively. At 25 °C, the equation simplifies to:

\[
E = E_0 - 59.16 \times \text{pH}
\]

**Where:**

| Symbol | Unit | Definition |
|--------|------|------------|
| E | mV (millivolts) | Electrode potential; the voltage measured between the glass pH electrode and the reference electrode immersed in solution |
| E₀ | mV | Electrode offset; the voltage at pH 0 for this specific probe; varies between probes and is determined during calibration |
| 59.16 | mV/pH unit | Nernst slope at 25 °C; the voltage change per pH unit; a healthy probe reads 55–62 mV/pH unit |
| pH | dimensionless | The hydrogen ion activity of the solution being measured |

This means a 59.16 mV change in electrode voltage corresponds to exactly one pH unit change at 25 °C. The electrode voltage is measured against a **reference electrode** (usually a silver/silver-chloride junction filled with KCl gel) packed into the same probe body. The output to the microcontroller is typically a millivolt signal in the range of −300 mV (very basic solution) to +300 mV (very acidic solution), with 0 V corresponding approximately to pH 7.

### pH Probe Calibration

Because the exact relationship between voltage and pH varies slightly between probes (and changes as probes age), calibration is required. **Two-point calibration** is standard:

1. Rinse the probe with deionized water and pat dry
2. Immerse in pH 7.0 buffer solution; wait for stabilization; record voltage V₇
3. Rinse and immerse in pH 4.0 buffer (or pH 10.0 for alkaline calibration); wait; record voltage V₄
4. Compute slope: `slope = (7.0 - 4.0) / (V7 - V4)` (should be near 59 mV/pH unit at 25 °C)
5. Compute offset: `offset = 7.0 - slope × V7`

Store slope and offset in `config.json` on the microcontroller. Apply them in every reading:

```python
def raw_voltage_to_ph(voltage_mv, slope, offset):
    return slope * voltage_mv + offset
```

### pH Calibration Buffers

**Calibration buffers** are solutions with precisely known, stable pH values. Standard pH calibration kits contain buffer solutions at pH 4.00, 7.00, and 10.00. These values are certified accurate to ±0.01 pH at 25 °C.

Buffer storage and handling:

- Store unopened buffers in a cool, dark location (4–8 °C refrigerator for long-term)
- Discard buffer that has been contaminated by the probe — pour out, never return to stock bottle
- Replace opened buffer sachets after 30 days; buffer pH can drift with CO₂ absorption from air
- Recalibrate pH probes every 1–2 weeks in a working hydroponic system; more often if measuring high-acid or high-alkaline solutions

!!! mascot-warning "Never dry-store a glass pH electrode"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Cress raises a cautionary hand">
    A glass pH electrode must be kept moist. When not in use, store it in the plastic cap filled with pH 7 buffer or 3M KCl storage solution — not deionized water, which pulls electrolyte from the reference junction. A dried-out electrode takes hours to re-hydrate and may never fully recover. This is the most common cause of pH probe death in hobbyist setups.

## EC Probe Design and Calibration

An **EC (electrical conductivity) probe** measures how well a solution conducts electricity — directly proportional to ion concentration (nutrient concentration). A typical EC probe has two (or four) platinum or titanium electrodes that are immersed in the solution.

The probe works by applying a small AC voltage between the electrodes and measuring the resulting current. AC is used (not DC) to prevent electrolysis and electrolyte buildup on the electrode surfaces. The conductance \( G = I/V \) (current divided by voltage) is measured, then the conductivity is calculated using the probe's **cell constant** K_cell:

\[
\text{EC} = G \times K_{cell}
\]

**Where:**

| Symbol | Unit | Definition |
|--------|------|------------|
| EC | µS/cm or mS/cm | Electrical conductivity of the solution; a proxy for total dissolved ion concentration |
| G | S (siemens) | Electrical conductance measured between probe electrodes; G = I/V (current ÷ applied voltage) |
| K_cell | cm⁻¹ | Cell constant of the probe; determined by electrode geometry (spacing and surface area); calibrated using a reference solution of known conductivity |

The cell constant (in cm⁻¹) depends on the electrode geometry — the distance between the electrodes and their surface area. Atlas Scientific EZO-EC circuits have a built-in calibration procedure that determines K_cell from a reference solution.

### EC Probe Calibration

EC calibration uses a **calibration solution** with a precisely known conductivity value (commonly 1413 μS/cm, which corresponds approximately to 700 ppm TDS). The calibration procedure:

1. Rinse the probe with deionized water
2. Immerse in 1413 μS/cm calibration solution at 25 °C
3. Send the `Cal,1413` command to the Atlas EZO-EC circuit (or apply the appropriate scaling factor for DIY ADC-based probes)
4. For two-point calibration, repeat with dry calibration (air) as the zero point, then with the calibration solution

Temperature significantly affects conductivity — water at 30 °C is approximately 2% more conductive than at 25 °C per degree. Always use **temperature-compensated EC** readings by providing the current solution temperature to the EZO-EC circuit or applying the temperature correction factor manually.

## Temperature Sensors

### DS18B20 Temperature Probe

The **DS18B20** is a waterproof, stainless-steel encapsulated temperature sensor in a TO-92 package rated for −55 °C to +125 °C with ±0.5 °C accuracy. Its 1-Wire digital protocol means it can be submerged directly in nutrient solution. The stainless steel housing is inert to the solution chemistry used in hydroponics.

Key specifications:

| Parameter | Value |
|-----------|-------|
| Operating range | −55 °C to +125 °C |
| Accuracy | ±0.5 °C (−10 to +85 °C) |
| Resolution | 9–12 bit selectable (0.5–0.0625 °C) |
| Interface | 1-Wire (single data pin) |
| Supply voltage | 3.0–5.5 V (or parasite power from data line) |
| Conversion time | 94–750 ms (depending on resolution) |

### DHT11 vs DHT22 Comparison

Both the **DHT11** and **DHT22** measure air temperature and relative humidity using a resistive humidity sensing element and a thermistor. They differ significantly in accuracy:

| Specification | DHT11 | DHT22 |
|---------------|-------|-------|
| Temperature range | 0–50 °C | −40–80 °C |
| Temperature accuracy | ±2 °C | ±0.5 °C |
| Humidity range | 20–90% RH | 0–100% RH |
| Humidity accuracy | ±5% RH | ±2–5% RH |
| Sample rate | 1 Hz max | 0.5 Hz max |
| Cost | ~$2 | ~$5 |

For hydroponic VPD calculation, the DHT22 is required — the ±2 °C error of the DHT11 produces unacceptably large VPD errors. The DHT22 is recommended for all air quality monitoring in grow rooms.

### CO₂ NDIR Sensor Technology

**NDIR** (Non-Dispersive Infrared) sensors measure CO₂ concentration by detecting how much infrared light at the CO₂ absorption wavelength (4.26 μm) is absorbed by the gas in a measurement cell. NDIR sensors are the most accurate and stable CO₂ sensing technology for grow room monitoring.

The MH-Z19B and SCD40 are popular NDIR CO₂ sensors for hydroponic automation. The SCD40 (I2C) is more compact and accurate; the MH-Z19B (UART) is less expensive and widely used in hobby systems.

Ambient CO₂ is approximately 400 ppm. For enhanced plant growth in a sealed grow room, growers supplement CO₂ to 1000–1500 ppm. Monitoring CO₂ levels is essential for systems with CO₂ enrichment to prevent dangerous human exposure (CO₂ becomes hazardous above ~5000 ppm in confined spaces).

## Level and Flow Sensors

### Water Level Sensors

Knowing the water level in a reservoir allows automatic refill, prevents running the pump dry, and triggers overflow alarms. Several sensor types work for hydroponic reservoirs:

**Float switches**: A mechanical switch inside a buoyant housing. When the float rises above a threshold, it closes (or opens) the circuit. Simple, inexpensive, and zero power consumption when not switching. Limited to detecting a single level threshold — not continuous level measurement.

**Ultrasonic distance sensors** (HC-SR04): Mount above the reservoir, emit an ultrasonic pulse, and measure the time for the echo to return. Distance to the water surface is calculated from the time-of-flight: \( d = v_{sound} \times t / 2 \). This provides continuous level measurement in millimeters. Not ideal for nutrient solution (salt vapor can contaminate the sensor) — use a cover with a small hole.

### Float Switch

As described above, a float switch is the simplest level detection method — a reed switch inside a float that closes when the float is upright (water level is high) and opens when the float tilts (water level is low). Float switches are used in two modes:

- **High-level float**: Mounted near the reservoir's maximum fill line; stops the fill valve if triggered
- **Low-level float**: Mounted near the reservoir's minimum level; stops the pump if triggered

Wire float switches to GPIO pins with `Pin.PULL_UP` (see Chapter 13) — the switch pulls the pin to ground when activated.

### Flow Sensor

A **flow sensor** measures the volume of liquid passing through a pipe. Hall-effect flow sensors (e.g., YF-S201) contain a small turbine wheel with a magnet. As liquid flows through, the turbine spins, generating a series of pulses detected by the Hall-effect sensor. The pulse frequency is proportional to flow rate.

Counting flow pulses with a hardware interrupt (Chapter 13) provides precise volume measurement:

```python
from machine import Pin
import utime

PULSES_PER_LITER = 450   # Calibrate for your specific sensor

pulse_count = 0

def flow_pulse_handler(pin):
    global pulse_count
    pulse_count += 1

flow_pin = Pin(5, Pin.IN, Pin.PULL_UP)
flow_pin.irq(trigger=Pin.IRQ_FALLING, handler=flow_pulse_handler)

def get_flow_liters():
    return pulse_count / PULSES_PER_LITER
```

## Actuators

### Relay Module

A **relay module** (covered in Chapter 14 for software) deserves attention on the hardware side. A relay module typically contains:

- A signal input (connected to GPIO)
- An optocoupler (electrically isolates the microcontroller from the mains-voltage side)
- A coil-driven mechanical relay rated at the intended load (e.g., 10A 250VAC)
- Indicator LED showing relay state

Safety considerations for relay wiring:

- Use appropriately rated wire for the mains-voltage side (14 AWG minimum for 10A loads)
- Keep mains wiring and low-voltage (3.3 V/5 V) wiring physically separated
- Always fuse the mains supply
- Never work on live mains wiring — de-energize before touching

### Dosing Pump (Peristaltic)

A **peristaltic pump** moves fluid by squeezing a flexible tube between rollers and the pump housing. The tube's interior never contacts the pump mechanism — making peristaltic pumps ideal for corrosive or sterile fluids like pH adjustment solutions (hydrochloric acid, potassium hydroxide) and nutrient concentrates.

Key selection criteria for hydroponic dosing pumps:

- **Flow rate**: Typically 0.1–3 mL/s for nutrient dosing applications
- **Tubing material**: Silicone (inert to most hydroponic chemicals, flexible, long-lasting)
- **Voltage**: Most small dosing pumps run at 5 V or 12 V and are controlled by relay

Calibration: Time how long the pump takes to deliver exactly 10 mL into a graduated cylinder. Repeat three times and average to find `ml_per_second`. Store this constant in your config file and update it when tubing is replaced.

### Solenoid Valve

A **solenoid valve** is an electromagnetically actuated valve — when energized, a plunger lifts to open the flow path; when de-energized, a spring closes it. Solenoid valves control water flow (auto-refill, irrigation cycles) and CO₂ injection.

Selection criteria:

- **Normally closed (NC)** vs **normally open (NO)**: NC valves close when power is lost — the safe default for refill valves (if power fails, you don't want the reservoir to overflow)
- **Voltage rating**: 12 VDC or 24 VAC are common; use a relay to switch from 3.3 V GPIO to valve supply voltage
- **Pressure rating**: Ensure the valve rating exceeds your supply line pressure

!!! mascot-thinking "Normally closed valves are the safe default"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress holds chin thoughtfully">
    When a microcontroller loses power, all GPIO pins go to their default state (low). A relay connected to a GPIO-controlled solenoid will de-energize. If you wired a normally-open refill valve, this means the valve opens and your reservoir overfills. If you wired a normally-closed valve, it closes — the safe outcome. Always design for the failure case: what happens to each actuator when power is lost?

## Electronics Fundamentals

### Power Supply Selection

A hydroponic sensor node typically requires multiple voltage levels: 5 V for relay modules and some sensors, 3.3 V for the microcontroller and I2C sensors, 12 V for dosing pumps and solenoids. Power supply selection criteria:

- **Voltage**: Match the highest required voltage; use regulators for lower voltages
- **Current capacity**: Sum the maximum current of all loads with a 50% safety margin
- **Waterproof rating**: IP65 minimum for grow room environments (dust-tight and water spray resistant)
- **Mean time between failures (MTBF)**: Industrial power supplies (Meanwell, COSEL) have 10× higher MTBF than consumer-grade units

A common approach: a 12 V 5 A switching supply powers the relay coils and dosing pumps directly; a 12V-to-5V USB buck converter (LM2596) provides regulated 5 V for the microcontroller and relay signal inputs.

### Breadboard Prototyping

A **breadboard** is a solderless prototyping board with rows of internally-connected holes. Components and jumper wires are inserted into holes; connections are made by the internal copper traces. Breadboards allow circuits to be built and modified without soldering.

Breadboard conventions:
- The two outer rails (labeled + and −) are power buses — connect your 3.3 V and GND to these
- The main grid is split into two halves; each row of 5 holes (a–e, f–j) is internally connected
- Components should bridge the center gap (component leads in the a–e half, connections in the f–j half)

Breadboards are not suitable for humid environments — salt vapor from nutrient solution will cause corrosion and intermittent connections. Use breadboards only for development and testing, then transfer to a perfboard or PCB for deployment.

### PCB Design Basics

A **PCB** (Printed Circuit Board) is the step beyond breadboard — copper traces etched or deposited on an insulating substrate replace jumper wires. PCBs are more reliable, compact, and suitable for humid environments than breadboards.

PCB design tools like **KiCad** (free, open-source) allow you to design a **schematic** (component connections) and a **layout** (physical trace routing). After design, boards are manufactured by PCB fabrication services (PCBWay, JLCPCB, OSH Park) at low cost (10 boards for ~$10–20 for simple designs).

For hydroponic sensor nodes, a custom PCB brings:
- Connectors for I2C, UART, analog sensors, relay outputs, and power, all in defined positions
- Conformal coating protection for humidity resistance
- Reduced failure points compared to wire-wrapped or soldered perfboard

### Voltage Divider Circuit

A **voltage divider** is a two-resistor circuit that produces an output voltage that is a fixed fraction of the input voltage. The voltage divider equation relates input voltage \( V_{in} \) and two resistors \( R_1 \) (top, from input to output) and \( R_2 \) (bottom, from output to ground):

\[
V_{out} = V_{in} \times \frac{R_2}{R_1 + R_2}
\]

**Where:**

| Symbol | Unit | Definition |
|--------|------|------------|
| V_out | V (volts) | Output voltage; measured between the midpoint of the divider and ground |
| V_in | V | Input (supply) voltage applied across the full divider; e.g., 5 V sensor output |
| R₁ | Ω (ohms) | Top resistor; connected between V_in and the output node |
| R₂ | Ω | Bottom resistor; connected between the output node and ground |

In hydroponic electronics, voltage dividers appear in two contexts:

1. **Level shifting**: Sensors that output 0–5 V (like some pH circuits) must be scaled to 0–3.3 V before connecting to a 3.3 V ADC. A divider with R₁ = 10 kΩ and R₂ = 20 kΩ produces V_out = V_in × 0.667, scaling 5 V to 3.33 V.

2. **Resistive sensors**: Thermistors (temperature sensors) and resistive moisture sensors are often used in voltage divider circuits where one resistor is fixed and the other is the sensor — the output voltage varies with the sensor resistance.

### Op-Amp Circuits and Analog Signal Conditioning

The output of a pH glass electrode is typically a millivolt-level signal (±300 mV) with high source impedance. Connecting this directly to an ADC produces noisy, inaccurate readings because the ADC's input impedance "loads" the electrode and distorts the reading.

An **operational amplifier** (op-amp) solves this with two common configurations for analog signal conditioning:

**Voltage follower (buffer)**: The output equals the input, but the op-amp's high input impedance (>1 MΩ) prevents loading the sensor, and its low output impedance can drive the ADC cleanly. Used for pH electrode buffering.

```
+IN ──┐
      └── op-amp output → ADC
-IN ──┘ (connected to output = unity gain)
```

**Inverting amplifier**: Scales and inverts a small input signal:

\[
V_{out} = -\frac{R_f}{R_{in}} \times V_{in}
\]

**Where:**

| Symbol | Unit | Definition |
|--------|------|------------|
| V_out | V (volts) | Amplifier output voltage; inverted (sign-reversed) and scaled relative to V_in |
| R_f | Ω (ohms) | Feedback resistor; connected between op-amp output and inverting input (−); controls gain magnitude |
| R_in | Ω | Input resistor; connected between the signal source and the inverting input (−); sets input impedance |
| V_in | V | Input signal voltage; e.g., the millivolt signal from a pH electrode or other low-level sensor |
| −R_f/R_in | dimensionless | Closed-loop gain; negative sign indicates phase inversion; magnitude > 1 amplifies, < 1 attenuates |

The Atlas Scientific EZO circuits include built-in op-amp signal conditioning. For DIY pH circuits (using a pH electrode and a separate analog-front-end circuit), the INA826 or MCP6002 op-amp are commonly used.

## Signal Quality

### Sensor Noise and Filtering

Real sensor signals contain **noise** — random fluctuations in the measured voltage caused by electromagnetic interference (EMI), thermal noise in resistors, and power supply ripple. Unfiltered noise can cause pH readings to fluctuate ±0.1 pH even in a stable solution.

Types of noise in hydroponic sensor systems:

- **50/60 Hz mains noise**: Induced by proximity to mains wiring and pump motors. Reduced by shielded cables and physical separation.
- **ADC quantization noise**: The inherent error from converting a continuous analog signal to discrete digital steps. Reduced by averaging multiple readings.
- **Sensor thermal drift**: Gradual change in sensor output due to temperature changes. Compensated by temperature measurement.

### Moving Average Filter

The simplest and most effective software noise filter for sensor data is the **moving average**: average the last N readings, where N is chosen to smooth noise without adding too much lag.

```python
class MovingAverageFilter:
    def __init__(self, window_size=5):
        self.window = []
        self.size = window_size

    def add(self, value):
        self.window.append(value)
        if len(self.window) > self.size:
            self.window.pop(0)

    def average(self):
        if not self.window:
            return None
        return sum(self.window) / len(self.window)

ph_filter = MovingAverageFilter(window_size=5)

for _ in range(5):
    raw = ph_adc.read_u16()
    voltage = raw * 3.3 / 65535
    ph_filter.add(slope * voltage + offset)
    utime.sleep_ms(200)

filtered_ph = ph_filter.average()
```

For pH, a window of 3–5 readings sampled at 200 ms intervals provides good noise rejection without significant lag. For EC and temperature, a window of 5–10 is typical.

## Sensor Drift and Recalibration

All sensors **drift** over time — their output changes slightly even when measuring the same quantity. Drift is caused by:

- Electrode fouling (biofilm, mineral deposits on probe surfaces)
- Electrolyte depletion in the reference junction of pH probes
- Aging of the sensing element

A practical recalibration schedule for hydroponic sensors:

| Sensor | Recalibration Interval | Trigger |
|--------|----------------------|---------|
| pH probe | Weekly | If two-point slope deviates >5% from ideal |
| EC probe | Monthly | After cleaning probe tips |
| DS18B20 | Annually | Compare against calibrated thermometer |
| CO₂ sensor | Monthly | Fresh air baseline (atmospheric CO₂ ≈ 400 ppm) |

**Sensor data timestamping**: Every logged reading must include a timestamp — either a Unix timestamp from the RTC or an NTP-synchronized clock. Without timestamps, sensor data cannot be correlated with events (dosing, lighting cycles, temperature changes) and is much less useful for analysis.

## Sensor Node Design

### Wireless Sensor Node Design

A **wireless sensor node** is a self-contained unit that reads sensors and transmits data wirelessly. For hydroponics, the design typically includes:

- Microcontroller with Wi-Fi (Pico W or ESP32)
- Sensors on I2C and/or UART buses
- Relay outputs for local control
- Power supply (wall-powered for fixed installations, battery for remote sensors)
- Waterproof enclosure

The node firmware follows the architecture from Chapter 14: `boot.py` for Wi-Fi and configuration; `main.py` with asyncio for concurrent sensor loops, MQTT publishing, and watchdog feeding.

### Battery-Powered Sensor Nodes

For remote sensors (field hydroponics, greenhouse perimeter sensors), battery power is necessary. Key battery design considerations:

- **Deep sleep**: MicroPython's `machine.deepsleep(ms)` puts the microcontroller into a ~20 μA current draw sleep mode, waking after the specified interval. A sensor node that wakes every 5 minutes, takes a reading in 2 seconds, and sleeps again draws <1 mA average — 4–8 months of operation on a 3000 mAh Li-Ion battery.
- **Battery selection**: LiFePO4 (Lithium Iron Phosphate) is preferred for embedded applications — safer chemistry, 2000+ charge cycles, and stable voltage over most of the discharge curve.
- **Power budget**: Estimate average current draw: duty cycle × active current + (1-duty cycle) × sleep current.

### Multiplexed Sensor Reading

When more sensors are needed than available ADC channels or I2C addresses allow, **multiplexing** selects one sensor at a time from an array. Two common approaches:

- **I2C multiplexer (TCA9548A)**: Provides 8 independent I2C buses; allows connecting 8 sensors with the same address (e.g., eight SHT31 sensors on one Pico)
- **Analog multiplexer (CD74HC4051)**: Connects one ADC input to any of 8 analog sensors using 3 digital select pins

```python
# TCA9548A I2C multiplexer
class TCA9548A:
    def __init__(self, i2c, address=0x70):
        self.i2c = i2c
        self.addr = address

    def select_channel(self, channel):
        self.i2c.writeto(self.addr, bytes([1 << channel]))

    def deselect_all(self):
        self.i2c.writeto(self.addr, bytes([0]))
```

### Sensor Enclosure Waterproofing

Electronics operating in or near nutrient solution must be protected from moisture, condensation, and chemical vapor. Key enclosure design principles:

- **IP rating**: IP65 is the minimum for grow room electronics (dust-tight, water spray resistant). IP67 is needed for components that may be submerged.
- **Enclosure material**: ABS plastic enclosures are chemical-resistant and inexpensive. Fiberglass or stainless steel for harsh chemical environments.
- **Cable glands**: Use IP-rated cable glands for all wire penetrations — they compress a rubber seal around the cable to maintain the enclosure IP rating.
- **Desiccant**: Place a silica gel desiccant packet inside sealed enclosures to absorb residual moisture and prevent condensation on PCBs.
- **Conformal coating**: Apply a thin polyurethane or acrylic conformal coat to the PCB to resist moisture, condensation, and salt vapor. Leave connectors and probe calibration points uncoated.

#### Diagram: Sensor Node Architecture
<iframe src="../../sims/sensor-node-architecture/main.html" width="100%" height="662" scrolling="no"></iframe>
<details markdown="1">
<summary>Hydroponic Sensor Node Electronics Architecture</summary>
Type: architecture-diagram
**sim-id:** sensor-node-architecture<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the complete electronics architecture of a hydroponic sensor node — from sensors and actuators through signal conditioning and the microcontroller to the network layer — with power supply rails shown as colored overlays.

Bloom Level: Analyze (L4) and Apply (L3)
Bloom Verb: Design — students identify the function of each layer and could replicate the architecture for a new sensor.

Layout: Canvas 900×520. Organized in four horizontal layers:
- Bottom layer (Sensors and Actuators): pH electrode → op-amp buffer, DS18B20 → 1-Wire, DHT22 → GPIO, EC probe → analog conditioning, CO₂ NDIR → UART, Float switch → GPIO, Relay → GPIO
- Second layer (Signal Conditioning): Op-amp buffers, voltage dividers, ADC (MCP3208), 1-Wire interface
- Third layer (Microcontroller): Pico W block with GPIO pins labeled; ADC channels; I2C bus; UART; Wi-Fi antenna icon
- Top layer (Network and Outputs): Wi-Fi → MQTT Broker, OLED Display (I2C), LCD (I2C), NeoPixels (GPIO)

Power rails shown as colored horizontal bus lines: 3.3 V (red), 5 V (orange), 12 V (yellow), GND (black). Arrows show power connections from each component to its rail.

Interactivity:
- Hovering a component shows a tooltip: component name, interface type, supply voltage, accuracy specification.
- Toggle "Show Power Rails" to show/hide the colored voltage bus overlays.
- Toggle "Show Signal Path": animates the data flow from pH electrode → op-amp → ADC → Pico → Wi-Fi with a moving dot.
- Clicking any component opens a detail panel: component name, datasheet link, typical cost, MicroPython code snippet.

Responsive: Scales to container width; on narrow screens, stack the four layers vertically.
</details>

## Key Takeaways

- **pH glass electrodes** generate a millivolt signal via hydrogen ion exchange across a thin glass membrane; the Nernst equation relates voltage to pH (approximately 59 mV per pH unit at 25 °C).
- **pH calibration** requires two known buffer solutions (pH 4 and pH 7) to determine probe-specific slope and offset constants; probes must be kept moist and recalibrated weekly.
- **EC probes** measure solution conductivity using AC voltage to avoid electrolysis; always apply temperature compensation because conductivity changes ~2% per °C.
- **DS18B20** (water temperature) and **DHT22** (air temperature/humidity) are the standard sensor pair for hydroponic monitoring; DS18B20 supports multiple sensors on one wire.
- **CO₂ NDIR sensors** (MH-Z19B, SCD40) measure CO₂ via infrared absorption and are required for grow rooms with CO₂ enrichment.
- **Float switches** detect discrete levels; **ultrasonic sensors** provide continuous level measurement; **flow sensors** count pulse interrupts to measure volume.
- **Relay modules** use optocouplers to electrically isolate the microcontroller from mains-voltage loads; always use normally-closed valves so power loss produces the safe (closed) state.
- **Voltage dividers** scale sensor voltages to ADC input ranges; **op-amp buffers** prevent electrode loading and improve signal fidelity.
- **Moving average filters** (3–10 samples) reduce ADC noise in pH and EC readings; window size balances noise reduction against measurement lag.
- **Waterproof enclosures** (IP65+), **cable glands**, **conformal coating**, and **desiccant** are required for any electronics operating in or near nutrient solution.

!!! mascot-celebration "Chapter 15 complete — you can build the hardware!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You now understand every layer of the hydroponic electronics stack — from glass electrodes and peristaltic pumps to op-amp conditioning and waterproof enclosures. Chapter 16 shifts to what happens to sensor data after it's collected: pandas DataFrames, time-series analysis, rolling statistics, and correlation analysis that turn raw pH and EC logs into actionable insights about your crop's health. Let's crunch some numbers!

[See Annotated References](./references.md)
