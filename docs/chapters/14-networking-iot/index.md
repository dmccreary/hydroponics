---
title: Networking, IoT, and Advanced MicroPython
description: Connecting hydroponic sensor nodes to the internet — MQTT, HTTP, sockets, watchdog timers, OTA updates, and a hands-on guide to every sensor library used in automation projects.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# Networking, IoT, and Advanced MicroPython

## Summary

This chapter connects sensor nodes to the internet and the broader IoT ecosystem: socket programming, MQTT pub/sub messaging, HTTP requests, memory management and garbage collection, watchdog timers for crash recovery, OTA firmware updates, and the boot/main execution model. The second half of the chapter is a hands-on library reference for the sensor-specific MicroPython packages used throughout the automation projects: DS18B20, DHT22, Atlas Scientific pH/EC, SSD1306 OLED, relay control, peristaltic pump logic, NeoPixel, and LCD display.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Socket Programming
2. MQTT Protocol Basics
3. MicroPython MQTT Client
4. HTTP Requests From MicroPython
5. Memory Management in MicroPython
6. Garbage Collection
7. Watchdog Timer
8. Boot.py and Main.py Execution
9. OTA Over-the-Air Updates
10. MicroPython Libraries
11. DS18B20 Temperature Library
12. DHT11/DHT22 Library
13. SSD1306 OLED Display Library
14. Atlas Scientific pH Library
15. Atlas Scientific EC Library
16. MCP3208 ADC SPI Library
17. Relay Module Control Code
18. Peristaltic Pump Relay Logic
19. NeoPixel WS2812 Control
20. LCD 16x2 I2C Library

## Prerequisites

This chapter builds on concepts from:

- [Chapter 13: Hardware Interfaces and Sensor Programming](../13-hardware-interfaces/index.md)

---

!!! mascot-welcome "Cress goes online"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 14, hydro-explorers! Your sensors are wired and your code runs — now let's send that data to the world. This chapter connects your Pico W or ESP32 to the internet, explores the messaging protocols that IoT devices use to talk to each other, and gives you a complete reference for every sensor library you'll encounter in hydroponic automation projects. By the end, your grow room will be streaming live data and recovering automatically from crashes. Let's grow something amazing — and monitor it from anywhere!

## Boot.py and Main.py: The MicroPython Startup Sequence

Before we send data to the internet, we need to understand how MicroPython starts. When a microcontroller powers on, MicroPython runs two special files from the flash filesystem in order:

1. **`boot.py`** — runs first, once, at startup. This is where you put code that must run before anything else: connecting to Wi-Fi, loading configuration from `config.json`, initializing the watchdog timer. Keep `boot.py` short and focused on infrastructure.

2. **`main.py`** — runs after `boot.py` completes. This is your main application: sensor loops, MQTT publishing, display updates.

```python
# boot.py — infrastructure setup
import network, ujson, utime

with open("config.json") as f:
    config = ujson.load(f)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(config["wifi_ssid"], config["wifi_password"])

timeout = 20
while not wlan.isconnected() and timeout > 0:
    utime.sleep(1)
    timeout -= 1

print(f"Network: {wlan.ifconfig()[0] if wlan.isconnected() else 'FAILED'}")
```

```python
# main.py — application logic
from sensors import read_all
from mqtt_client import publish_reading
import asyncio

async def sensor_loop():
    while True:
        data = read_all()
        publish_reading(data)
        await asyncio.sleep(60)

asyncio.run(sensor_loop())
```

If `main.py` crashes with an unhandled exception, the device halts. This is where the watchdog timer (covered below) comes in — it automatically reboots the device if the program stops responding.

## Socket Programming

A **socket** is a software endpoint for sending and receiving data over a network. Sockets are the low-level building block that all higher-level protocols (HTTP, MQTT) are built on. Understanding sockets helps you debug network issues and implement custom communication protocols.

In MicroPython, the `usocket` module (usually imported as `socket`) provides a Python-compatible socket API:

```python
import usocket as socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

addr = socket.getaddrinfo("example.com", 80)[0][-1]
s.connect(addr)

s.send(b"GET / HTTP/1.0\r\nHost: example.com\r\n\r\n")

response = s.recv(4096)
print(response.decode())
s.close()
```

Sockets provide maximum control but require you to implement protocol details manually. For HTTP and MQTT, purpose-built libraries handle this.

## MQTT: The IoT Messaging Protocol

**MQTT** (Message Queuing Telemetry Transport) is a lightweight publish/subscribe messaging protocol designed for devices with limited resources. It is the most widely used protocol for IoT sensor data transmission.

Before we look at code, three key MQTT concepts to understand:

- **Broker**: A central server that receives and routes messages. Popular brokers include Mosquitto (self-hosted), HiveMQ, and AWS IoT Core.
- **Topic**: A string identifier that organizes messages, like a channel name. Topics are hierarchical: `farm/zone1/nutrients/ph` identifies pH readings from zone 1.
- **Publish/Subscribe**: Sensors **publish** messages to a topic. Dashboard applications **subscribe** to topics they want to receive. The broker routes messages from publishers to all subscribers of matching topics.

This architecture is superior to direct HTTP requests for several reasons: many devices can subscribe to the same topic without the publisher knowing; the broker handles delivery if a subscriber is temporarily offline; and the protocol overhead is minimal (a few bytes per message vs. hundreds for HTTP).

### MicroPython MQTT Client

MicroPython provides the `umqtt.simple` library for MQTT communication:

```python
from umqtt.simple import MQTTClient
import ujson

CLIENT_ID = "hydro-node-01"
BROKER = "mqtt.example.com"

def connect_mqtt():
    client = MQTTClient(CLIENT_ID, BROKER, 1883)
    client.connect()
    return client

def publish_sensor_data(client, zone, ph, ec, temp):
    topic = f"farm/{zone}/sensors"
    payload = ujson.dumps({"ph": ph, "ec": ec, "temperature": temp, "node": CLIENT_ID})
    client.publish(topic.encode(), payload.encode())

def on_message(topic, msg):
    data = ujson.loads(msg)
    print(f"New setpoint received: pH={data['ph_setpoint']}")

client = connect_mqtt()
client.set_callback(on_message)
client.subscribe(b"farm/zone1/setpoints")

import utime
while True:
    client.check_msg()
    publish_sensor_data(client, "zone1", ph=6.42, ec=1.85, temp=22.7)
    utime.sleep(60)
```

MQTT with QoS level 0 ("fire and forget") is appropriate for sensor data where losing an occasional reading is acceptable. QoS level 1 ("at least once") ensures delivery with acknowledgment — use this for alarm messages and control commands.

!!! mascot-thinking "MQTT topics are your data architecture"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress holds chin thoughtfully">
    Design your MQTT topic hierarchy before writing code. A good structure: `farm/{farm_id}/zone/{zone_id}/{sensor_type}`. This allows a single subscriber to monitor all sensors (`farm/+/zone/+/+`) or just one type (`farm/+/zone/+/ph`). Changing the topic hierarchy after deployment is painful because all publishers and subscribers must update simultaneously. Plan it like a database schema.

## HTTP Requests from MicroPython

**HTTP** is the protocol of the web. While MQTT is better for continuous sensor streaming, HTTP is appropriate for uploading batch readings to a REST API, querying a weather API for outdoor temperature data, or receiving configuration updates from a web server.

MicroPython's `urequests` library provides a simple HTTP client similar to the popular `requests` library in CPython:

```python
import urequests, ujson

API_ENDPOINT = "https://api.example.com/hydroponics/readings"
API_KEY = "your-api-key-here"

def upload_readings(ph, ec, temp):
    headers = {"Content-Type": "application/json",
               "Authorization": f"Bearer {API_KEY}"}
    data = ujson.dumps({"ph": ph, "ec": ec, "temperature": temp})
    try:
        response = urequests.post(API_ENDPOINT, data=data, headers=headers)
        if response.status_code == 200:
            print("Upload successful")
        else:
            print(f"Upload failed: HTTP {response.status_code}")
        response.close()   # Free memory — critical on embedded devices
    except OSError as e:
        print(f"Network error: {e}")
```

Always call `response.close()` after processing an HTTP response to free the memory it occupies. Unclosed responses will eventually cause `MemoryError` crashes.

## Memory Management and Garbage Collection

Memory is one of the most important constraints in MicroPython development. The Pico W has 264 KB of RAM; the ESP32 has 520 KB. After the runtime and loaded modules use their share, a typical application may have only 80–150 KB of working memory.

Python uses **automatic garbage collection** to reclaim memory from objects that are no longer referenced. In MicroPython, the garbage collector runs automatically when needed, but this can cause unpredictable pauses in sensor loops. You can also trigger collection manually:

```python
import gc

free = gc.mem_free()
total = gc.mem_alloc() + gc.mem_free()
print(f"Memory: {free} bytes free of {total} bytes total")

gc.collect()
print(f"After GC: {gc.mem_free()} bytes free")
```

Practical memory management for hydroponic controllers:

- Avoid creating large lists or dictionaries inside sensor loops — allocate them once outside the loop
- Always call `response.close()` immediately after HTTP responses
- Store strings as `bytes` literals (`b"R\r"`) where possible — bytes allocate less overhead than Unicode strings
- Call `gc.collect()` explicitly before memory-intensive operations (parsing large JSON, creating new connections)

## Watchdog Timer

A **watchdog timer** (WDT) is a hardware counter that automatically reboots the microcontroller if the program fails to reset the counter within a specified timeout. Without a watchdog, a software crash or infinite loop can leave your hydroponic system permanently unmonitored until someone physically touches the device.

The watchdog works like this: start it at the beginning of your main loop, and reset it (call "feed") regularly. If the program crashes or hangs, the watchdog timer expires and the device reboots automatically.

```python
from machine import WDT
import utime

wdt = WDT(timeout=8000)   # Reboot if not fed within 8 seconds

while True:
    try:
        ph = read_ph()
        ec = read_ec()
        temp = read_temperature()
        publish_readings(ph, ec, temp)
    except Exception as e:
        log_error(str(e))

    wdt.feed()       # Reset the watchdog timer
    utime.sleep(5)
```

The watchdog timeout must be longer than the longest normal operation in your loop (including network calls, which can take 1–3 seconds). An 8–15 second timeout is typical.

!!! mascot-warning "Start the watchdog last"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Cress raises a cautionary hand">
    Don't start the watchdog timer before your Wi-Fi connection attempt or sensor initialization. These operations can take 5–15 seconds on first boot and may exceed the watchdog timeout, causing an immediate reboot loop. Initialize all hardware first in `boot.py`, then start the watchdog at the top of your main sensor loop in `main.py`.

## OTA Over-the-Air Updates

**OTA** (Over-the-Air) updates allow you to push new firmware or code to a deployed microcontroller over the network — without physical access to the device. In a production hydroponic system, this means updating calibration constants, bug fixes, or new features without visiting the grow room.

MicroPython OTA is implemented by downloading new `.py` files from a server and writing them to the flash filesystem:

```python
import urequests, uos

OTA_URL = "https://your-server.com/firmware/main.py"
OTA_VERSION_URL = "https://your-server.com/firmware/version.txt"

def check_ota():
    try:
        r = urequests.get(OTA_VERSION_URL)
        server_version = r.text.strip()
        r.close()

        with open("version.txt") as f:
            current_version = f.read().strip()

        if server_version != current_version:
            print(f"Updating to version {server_version}...")
            r = urequests.get(OTA_URL)
            with open("main_new.py", "w") as f:
                f.write(r.text)
            r.close()
            uos.rename("main.py", "main_backup.py")
            uos.rename("main_new.py", "main.py")
            import machine
            machine.reset()
    except Exception as e:
        print(f"OTA check failed: {e}")
```

Download to a temporary file first (`main_new.py`), then rename atomically. This prevents a partially downloaded file from bricking the device by replacing a working `main.py`.

## MicroPython Libraries for Hydroponic Sensors

The following sensor libraries are used throughout this course's automation projects.

### DS18B20 Temperature Library

The **DS18B20** is a waterproof digital temperature sensor that communicates via the 1-Wire protocol (a single data wire plus ground). It is the standard water temperature sensor for hydroponic systems because it can be fully submerged in the reservoir. MicroPython includes `ds18x20` and `onewire` modules in the firmware — no separate installation required.

```python
import machine, ds18x20, onewire, utime

ow = onewire.OneWire(machine.Pin(2))
ds = ds18x20.DS18X20(ow)
roms = ds.scan()

ds.convert_temp()
utime.sleep_ms(750)
for rom in roms:
    temp = ds.read_temp(rom)
    print(f"{rom}: {temp:.1f}°C")
```

Multiple DS18B20 sensors can share the same data wire — each has a unique 64-bit ROM address, allowing temperature monitoring at multiple points (reservoir, inlet, outlet) with a single GPIO pin.

### DHT11/DHT22 Library

The **DHT22** measures air temperature (±0.5 °C) and relative humidity (±2–5% RH). It is suitable for monitoring ambient grow room conditions.

```python
import dht, machine

sensor = dht.DHT22(machine.Pin(3))
sensor.measure()
temp = sensor.temperature()
humidity = sensor.humidity()
print(f"Air temp: {temp:.1f}°C, Humidity: {humidity:.1f}%")
```

The DHT22 should not be queried more than once every 2 seconds — the sensor requires time between measurements.

### Atlas Scientific pH and EC Libraries

**Atlas Scientific** manufactures professional-grade liquid analysis circuits. Their EZO-pH and EZO-EC circuits have built-in calibration storage, temperature compensation, and both UART and I2C interfaces.

```python
from machine import UART, Pin
import utime

class AtlasSensor:
    def __init__(self, uart_id, tx_pin, rx_pin):
        self.uart = UART(uart_id, baudrate=9600, tx=tx_pin, rx=rx_pin)

    def send_command(self, cmd):
        self.uart.write(f"{cmd}\r".encode())
        utime.sleep_ms(900)
        if self.uart.any():
            response = self.uart.read().decode().strip()
            if response.startswith("*OK"):
                return None
            return response
        return None

    def read(self):
        return float(self.send_command("R"))

ph_sensor = AtlasSensor(uart_id=1, tx_pin=Pin(8), rx_pin=Pin(9))
ph = ph_sensor.read()
print(f"pH: {ph:.2f}")
```

### MCP3208 ADC SPI Library

The **MCP3208** is an 8-channel, 12-bit SPI ADC chip that extends the Pico's 3 ADC channels to 8 — useful when monitoring multiple analog sensors simultaneously (pH, EC, dissolved oxygen, ORP, and light in one system).

```python
from machine import SPI, Pin

class MCP3208:
    def __init__(self, spi, cs_pin):
        self.spi = spi
        self.cs = Pin(cs_pin, Pin.OUT)
        self.cs.value(1)

    def read_channel(self, channel):
        cmd = bytes([0x06 | (channel >> 2), (channel & 0x03) << 6, 0])
        self.cs.value(0)
        result = self.spi.read(3, write=cmd[0])
        self.cs.value(1)
        return ((result[1] & 0x0F) << 8) | result[2]

spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))
adc = MCP3208(spi, cs_pin=17)
raw = adc.read_channel(0)
voltage = raw * 3.3 / 4095
```

### Relay Module Control and Peristaltic Pump Logic

A **relay module** allows a microcontroller GPIO pin to switch mains-voltage loads (pumps, lights, solenoid valves). Most relay modules are **active low** — the relay activates when the GPIO pin is driven LOW.

```python
from machine import Pin
import utime

class RelayController:
    def __init__(self, pin_number, active_low=True):
        self.pin = Pin(pin_number, Pin.OUT)
        self.active_low = active_low
        self.off()

    def on(self):
        self.pin.value(0 if self.active_low else 1)

    def off(self):
        self.pin.value(1 if self.active_low else 0)

PUMP_ML_PER_SECOND = 1.2   # Calibrated flow rate

def dose_nutrient(pump_relay, volume_ml):
    run_time = volume_ml / PUMP_ML_PER_SECOND
    pump_relay.on()
    utime.sleep(run_time)
    pump_relay.off()

ph_up_pump = RelayController(pin_number=17)
dose_nutrient(ph_up_pump, volume_ml=5.0)
```

Calibrate your pump's flow rate by timing how long it takes to pump a known volume using a graduated cylinder. Re-calibrate after tubing changes.

### NeoPixel WS2812 Control

**NeoPixel** (WS2812) addressable RGB LEDs allow a single GPIO wire to control an entire strip of individually programmable LEDs. In hydroponics, NeoPixels serve as visual status indicators (green = nominal, red = alarm, blue = maintenance mode).

```python
import machine, neopixel

NUM_LEDS = 8
np = neopixel.NeoPixel(machine.Pin(22), NUM_LEDS)

def set_status_color(r, g, b):
    for i in range(NUM_LEDS):
        np[i] = (r, g, b)
    np.write()

set_status_color(0, 255, 0)    # Green = nominal
```

### LCD 16x2 I2C Library

The **16×2 LCD** is a classic text display (16 characters wide, 2 rows), commonly connected via an I2C backpack that converts the 8-wire parallel LCD interface to a 2-wire I2C bus.

```python
from machine import I2C, Pin
from machine_i2c_lcd import I2cLcd

i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=400_000)
lcd = I2cLcd(i2c, 0x27, 2, 16)

lcd.clear()
lcd.putstr("pH: 6.42")
lcd.move_to(0, 1)
lcd.putstr("EC: 1.85 mS/cm")
```

#### Diagram: IoT Data Flow Architecture
<iframe src="../../sims/iot-data-flow/main.html" width="100%" height="500px" scrolling="no"></iframe>
<details markdown="1">
<summary>Hydroponic IoT Data Flow Interactive Diagram</summary>
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
</details>

## Key Takeaways

- **`boot.py`** runs at power-on for infrastructure setup (Wi-Fi, config loading); **`main.py`** runs the application logic — know which belongs in which file.
- **Sockets** are the low-level network primitive; **MQTT** and **HTTP** libraries build on sockets for protocol-level abstraction.
- **MQTT** (publish/subscribe via broker) is ideal for continuous sensor streaming; design your topic hierarchy before deployment — changing it later requires updating all publishers and subscribers.
- **HTTP** via `urequests` suits batch uploads and REST API calls; always call `response.close()` immediately to avoid `MemoryError` crashes.
- **Garbage collection** (`gc.collect()`) can be called manually before memory-intensive operations; monitor `gc.mem_free()` to detect memory leaks in long-running loops.
- **Watchdog timers** automatically reboot the device if the main loop stops running; start the WDT *after* all hardware initialization to avoid reboot loops during startup.
- **OTA updates** download new code to a temp file and rename atomically — never overwrite the live `main.py` directly during download.
- The standard sensor library set for hydroponic automation includes: **DS18B20** (water temp, 1-Wire), **DHT22** (air temp/humidity), **Atlas Scientific** (pH/EC, UART), **SSD1306** (OLED, I2C), **MCP3208** (8-ch ADC, SPI), **relay modules** (GPIO), and **NeoPixels** (addressable LEDs, GPIO).

!!! mascot-celebration "Chapter 14 complete — your grow room is online!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    Your sensor node streams data to an MQTT broker, recovers from crashes with the watchdog timer, and updates its own firmware over Wi-Fi. Chapter 15 steps back to the physical side: the electronics and sensors themselves — how pH electrodes work at the chemistry level, how to wire and calibrate EC probes, how relay circuits are designed, and how to enclosure your build for a wet environment. It's time to get hands-on with the hardware!
