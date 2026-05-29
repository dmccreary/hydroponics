---
title: Hardware Interface Architecture
description: Hardware Interface Architecture
status: scaffold
library: p5.js
bloom_level: Understand (L2) and Analyze (L4)
---

# Hardware Interface Architecture



<iframe src="main.html" width="100%" height="682"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 13: Hardware Interfaces and Sensor Programming](../../chapters/13-hardware-interfaces/index.md).

```text
Type: architecture-diagram
**sim-id:** hardware-interface-architecture<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the complete hardware communication architecture — how different protocols (GPIO, ADC, PWM, I2C, SPI, UART) connect a Pico W microcontroller to different classes of hydroponic sensors and actuators, with data flowing through asyncio tasks and out to Wi-Fi.

Bloom Level: Understand (L2) and Analyze (L4)
Bloom Verb: Classify — students identify which protocol connects each sensor type to the microcontroller.

Layout: Canvas 900×540. Central element: rounded rectangle labeled "Raspberry Pi Pico W". Surrounding it are six protocol lanes radiating outward:
- Left: GPIO → Float Switch, Relay, LED, Button
- Upper-left: ADC → pH Sensor (analog), EC Sensor (analog), Light Sensor
- Lower-left: PWM → Pump Driver, Fan Speed, LED Dimmer
- Upper-right: I2C → SHT31 (temp/humidity), SCD40 (CO₂), OLED Display, BME280
- Right: SPI → SD Card Module, High-Res ADC
- Lower-right: UART → Atlas pH/EC Probe, MH-Z19 CO₂, GPS Module

Each protocol lane uses a distinct color (GPIO=blue, ADC=orange, PWM=purple, I2C=green, SPI=red, UART=teal). Component boxes use simple icons.

Center bottom: "asyncio Event Loop" block containing four task boxes (read_ph, read_temp, read_ec, update_display) with circular arrows showing cooperative scheduling.

Center top: "Wi-Fi (network module)" block with arrow from Pico → "MQTT Broker / HTTP Server".

Interactivity:
- Clicking any component box highlights it and all components using the same protocol (same color lane), dimming others.
- A detail panel appears below the diagram showing: protocol name, typical frequency, max devices, MicroPython class name, and one code snippet.
- Clicking "Show Wiring" toggles an overlay labeling each GPIO pin number.

Responsive: Scales to container width; protocol lanes rearrange from radial to top/bottom split on narrow screens.
```

## Related Resources

- [Chapter 13: Hardware Interfaces and Sensor Programming](../../chapters/13-hardware-interfaces/index.md)
