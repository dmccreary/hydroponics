---
title: IoT Data Flow Architecture
description: Architecture diagram tracing sensor data from a Pico W through Wi-Fi to an MQTT broker and out to dashboards, databases, alert bots, and OTA update server.
status: scaffold
library: p5.js
bloom_level: Understand (L2) and Analyze (L4)
---

# IoT Data Flow Architecture



<iframe src="main.html" width="100%" height="622"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: Networking, IoT, and Advanced MicroPython](../../chapters/14-networking-iot/index.md).

```text
Type: architecture-diagram
**sim-id:** iot-data-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the complete data flow from sensors on a Pico W/ESP32, through Wi-Fi to an MQTT broker, and out to subscribers (dashboard, database, alert service, OTA server), with MQTT topic names shown on each arrow.

Bloom Level: Understand (L2) and Analyze (L4)
Bloom Verb: Trace — students follow a sensor reading from hardware through each system layer to its final destination.

Layout: Canvas 900×500. Left column: "Sensor Node" block containing icons for Temperature (DS18B20), pH (Atlas), EC (Atlas), Humidity (DHT22), Flow (pulse meter). Center: "Wi-Fi Router" icon → "MQTT Broker (Mosquitto)" block showing example topics. Right column: four subscriber boxes (Dashboard, InfluxDB, Telegram Alert Bot, OTA Update Server).

MQTT topic labels on arrows:
- Sensor Node → Broker: `farm/zone1/sensors/raw` (every 60s)
- Broker → Dashboard: `farm/zone1/sensors/#` (subscribe all)
- Broker → InfluxDB: `farm/+/sensors/+`
- Broker → Telegram Bot: `farm/+/alarms/#`
- OTA Server → Broker: `farm/zone1/ota/firmware`

Animation: A small "packet" dot travels from sensor node → broker → each subscriber in sequence, with a label showing which topic is used for each hop. The animation loops continuously.

Toggle "Show Protocols": adds HTTP vs MQTT icons above each arrow to show which protocol each hop uses.
Toggle "Show Watchdog": highlights the sensor node with a timer countdown, shows "WDT reset" flash when it expires.

Interactivity:
- Clicking any node pauses the animation and shows a detail panel: what software runs on that node, what language/library, and a code snippet for that layer.
- Click background to resume animation.

Responsive: Scales to container width; on narrow screens, stacks left/center/right vertically.
```

## Related Resources

- [Chapter 14: Networking, IoT, and Advanced MicroPython](../../chapters/14-networking-iot/index.md)
