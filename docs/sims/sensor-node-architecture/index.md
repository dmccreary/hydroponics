---
title: Sensor Node Architecture
description: Sensor Node Architecture
status: scaffold
library: p5.js
bloom_level: Analyze (L4) and Apply (L3)
---

# Sensor Node Architecture



<iframe src="main.html" width="100%" height="662"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 15: Sensors and Electronics Hardware](../../chapters/15-sensors-electronics/index.md).

```text
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
```

## Related Resources

- [Chapter 15: Sensors and Electronics Hardware](../../chapters/15-sensors-electronics/index.md)
