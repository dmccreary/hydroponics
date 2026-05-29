---
title: Hardware Interfaces and Sensor Programming
description: MicroPython's hardware interfaces — GPIO, ADC, PWM, I2C, SPI, UART, interrupts, timers, asyncio, and CSV/JSON file I/O for real hydroponic sensor systems.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# Hardware Interfaces and Sensor Programming

## Summary

This chapter bridges software and hardware by teaching MicroPython's full suite of communication protocols: I2C, SPI, UART, ADC, DAC, PWM, and GPIO. Students learn to read digital and analog sensors, write CSV data to files, work with JSON, configure pull-up and pull-down resistors, handle interrupts for real-time event detection, use hardware timers, and write non-blocking asynchronous code with asyncio — the foundation for all sensor projects in later chapters.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Exception Handling Try/Except
2. File I/O in MicroPython
3. Reading Files
4. Writing and Appending Files
5. CSV File Writing in MicroPython
6. JSON in MicroPython
7. I2C Protocol Basics
8. I2C in MicroPython
9. SPI Protocol Basics
10. SPI in MicroPython
11. UART Serial Communication
12. Analog-to-Digital Converter
13. ADC in MicroPython
14. Digital-to-Analog Converter
15. PWM: Pulse Width Modulation
16. PWM in MicroPython
17. GPIO Pin Modes
18. Digital Read and Write
19. Pull-Up and Pull-Down Resistors
20. Interrupts and IRQ
21. Timer and machine.Timer
22. utime Module
23. Async/Await in MicroPython
24. asyncio in MicroPython
25. Wi-Fi Connection on ESP32

## Prerequisites

This chapter builds on concepts from:

- [Chapter 12: MicroPython Fundamentals](../12-micropython-fundamentals/index.md)

---

!!! mascot-welcome "Cress gets hands-on with hardware"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 13, hydro-explorers! Chapter 12 gave you the Python language. Now we plug in sensors. This chapter is the bridge between code and the physical world — every technique here directly applies to reading pH probes, controlling nutrient pumps, and logging temperature data to flash memory. Let's go from blinking an LED to running a full asynchronous sensor loop!

## Exception Handling: Try/Except

In embedded systems, hardware fails silently. A sensor disconnects mid-read, an I2C device doesn't respond, a file can't be written because the flash is full. Without exception handling, these events crash your entire sensor program and leave your hydroponics system unmonitored.

Python uses **try/except** blocks to catch and handle errors gracefully. The `try` block contains code that might raise an exception; the `except` block runs if a specific exception type occurs.

```python
import machine

try:
    sensor_value = ph_sensor.read()
    print(f"pH: {sensor_value:.2f}")
except OSError as e:
    print(f"Sensor communication error: {e}")
    sensor_value = None
except ValueError as e:
    print(f"Invalid sensor value: {e}")
    sensor_value = None
```

Key exception types in MicroPython hardware code:

| Exception | When it occurs |
|-----------|---------------|
| `OSError` | I2C/SPI device not responding, file system errors |
| `ValueError` | Invalid argument to a function (e.g., ADC pin out of range) |
| `AttributeError` | Method called on None (sensor not initialized) |
| `MemoryError` | Out of RAM — MicroPython devices have limited memory |
| `RuntimeError` | Hardware configuration conflict |

The optional `finally` clause runs regardless of whether an exception occurred — useful for cleanup:

```python
try:
    data = sensor.read_block()
    write_to_file(data)
except OSError:
    log_error("Read failed")
finally:
    sensor.release_bus()   # Always release I2C bus
```

## File I/O in MicroPython

MicroPython on the Pico and ESP32 provides a small flash filesystem — typically 1–2 MB of storage after the firmware — using the LittleFS format. This filesystem stores your `.py` scripts and can also be used to log sensor data.

File operations use the same `open()`, `read()`, `write()`, and `close()` functions as desktop Python, but with one important difference: flash memory has a finite number of write cycles (typically 100,000+), so it's important not to write to the same file thousands of times per second.

### Reading Files

```python
with open("calibration.txt", "r") as f:
    content = f.read()
    lines = content.splitlines()

with open("settings.json", "r") as f:
    line = f.readline()
```

The `with` statement ensures the file is automatically closed when the block exits, even if an exception occurs.

### Writing and Appending Files

Mode `"w"` creates a new file (or overwrites an existing one). Mode `"a"` appends to an existing file without erasing it — the correct mode for sensor data logging.

```python
# Write (overwrite) — use for configuration files
with open("calibration.txt", "w") as f:
    f.write(f"ph_slope={slope}\n")
    f.write(f"ph_offset={offset}\n")

# Append — use for sensor data logs
with open("sensor_log.csv", "a") as f:
    f.write(f"{timestamp},{temperature},{ph},{ec}\n")
```

### CSV File Writing

**CSV** (Comma-Separated Values) is the simplest and most widely supported format for tabular data. A CSV file has one row per reading, with values separated by commas. This format can be opened directly in spreadsheet software for analysis.

```python
import utime

LOG_FILE = "hydro_log.csv"

def write_csv_header():
    with open(LOG_FILE, "w") as f:
        f.write("timestamp,temperature_c,ph,ec_ms_cm,do_mg_l\n")

def log_reading(temp, ph, ec, do):
    timestamp = utime.time()
    with open(LOG_FILE, "a") as f:
        f.write(f"{timestamp},{temp:.1f},{ph:.2f},{ec:.3f},{do:.1f}\n")
```

For long deployments, the log file will eventually fill the flash. A rotation strategy prevents the filesystem from filling up:

```python
import uos

def check_log_size():
    try:
        stat = uos.stat(LOG_FILE)
        if stat[6] > 800_000:
            uos.rename(LOG_FILE, "log_old.csv")
            write_csv_header()
    except OSError:
        write_csv_header()
```

### JSON in MicroPython

**JSON** (JavaScript Object Notation) is the standard format for structured data exchange over networks. MicroPython provides the `ujson` module for encoding Python dictionaries to JSON strings and decoding JSON strings back to dictionaries.

```python
import ujson

reading = {"timestamp": 1717000000, "ph": 6.42, "ec": 1.85, "temp": 22.7}
json_str = ujson.dumps(reading)

parsed = ujson.loads(json_str)
print(parsed["ph"])   # 6.42

# Save JSON configuration to flash
with open("config.json", "w") as f:
    ujson.dump({"ph_setpoint": 6.5, "ec_setpoint": 2.0}, f)

# Load JSON configuration from flash
with open("config.json", "r") as f:
    config = ujson.load(f)
ph_target = config["ph_setpoint"]
```

JSON is essential for MQTT and HTTP communication — all cloud IoT platforms accept sensor data in JSON format.

!!! mascot-tip "Use JSON for configuration, CSV for time-series logs"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Cress points upward with one finger">
    A useful pattern: store system configuration (setpoints, calibration constants, Wi-Fi credentials) in a `config.json` file that you load at startup. Store time-series sensor readings in a `sensor_log.csv` file that you append to on each cycle. Configuration is small and rarely changes; logs are large and grow continuously. Match the format to the access pattern.

## GPIO: Digital Pins

**GPIO** stands for General-Purpose Input/Output. GPIO pins are the basic digital interface between a microcontroller and the physical world — they can be configured as inputs (to read a button or float switch) or outputs (to switch a relay or LED).

Before we look at the code, three key terms: a pin configured as **input** reads the voltage on the pin (high = 3.3 V, low = 0 V). A pin configured as **output** drives the pin to either 3.3 V (high) or 0 V (low). The `machine.Pin` class is MicroPython's interface to GPIO pins.

### GPIO Pin Modes

```python
from machine import Pin

# Output pin — controls a relay or LED
relay_pin = Pin(15, Pin.OUT)
relay_pin.value(1)   # Set high (relay on)
relay_pin.value(0)   # Set low (relay off)
relay_pin.toggle()   # Invert current state

# Input pin — reads a float switch or button
float_switch = Pin(16, Pin.IN)
state = float_switch.value()   # Returns 0 or 1
```

### Pull-Up and Pull-Down Resistors

When a GPIO input pin is connected to a switch that physically disconnects from the circuit when open, the pin is left "floating" — it receives no defined voltage, causing it to read unpredictably. A **pull-up resistor** connects the pin to 3.3 V through a high resistance (typically 10–100 kΩ), ensuring the pin reads `1` when the switch is open and `0` when the switch is closed (pulling it to ground). A **pull-down resistor** does the reverse.

Most microcontrollers include internal pull-up and pull-down resistors that can be enabled in software:

```python
# Internal pull-up: pin reads 1 when switch is open, 0 when closed
button = Pin(14, Pin.IN, Pin.PULL_UP)

# Internal pull-down: pin reads 0 when switch is open, 1 when closed
level_sensor = Pin(17, Pin.IN, Pin.PULL_DOWN)
```

For hydroponic float switches and reservoir level sensors, `Pin.PULL_UP` is the most common configuration — the switch connects the pin to ground when activated.

### Digital Read and Write

```python
import time

pump_pin = Pin(15, Pin.OUT)
overflow_pin = Pin(16, Pin.IN, Pin.PULL_UP)

while True:
    if overflow_pin.value() == 0:
        pump_pin.value(0)
        print("OVERFLOW DETECTED — pump stopped")
    time.sleep(0.1)
```

## ADC: Reading Analog Sensors

A **digital signal** is either on or off (0 V or 3.3 V). But most hydroponic sensors produce **analog signals** — a continuously varying voltage proportional to the measured quantity (pH, EC, dissolved oxygen). An **Analog-to-Digital Converter (ADC)** samples the analog voltage and converts it to a digital number.

On the Raspberry Pi Pico, the RP2040 has a 12-bit ADC (values 0–4095) on three pins (GPIO 26, 27, 28). MicroPython exposes this through the `machine.ADC` class. The `read_u16()` method returns a 16-bit scaled value (0–65535):

```python
from machine import ADC

ph_adc = ADC(26)

raw = ph_adc.read_u16()
voltage = raw * 3.3 / 65535

slope = 3.47
offset = -0.12
ph = slope * voltage + offset
```

### Digital-to-Analog Converter

A **DAC** (Digital-to-Analog Converter) converts a digital number back to a voltage. The ESP32 has two DAC channels; the Raspberry Pi Pico does not have a hardware DAC and uses PWM to approximate analog output instead.

In hydroponic systems, a DAC is rarely needed — sensors produce analog outputs that you read with an ADC, while outputs to pumps and solenoids are digital (on/off). The exception is variable-speed pump controllers that accept a 0–10 V analog control signal.

## PWM: Controlling Pumps and LED Intensity

**PWM** (Pulse Width Modulation) approximates a variable voltage using a digital output pin. The pin rapidly switches between high (3.3 V) and low (0 V) at a fixed frequency. The **duty cycle** — the percentage of time the pin is high — determines the effective average voltage.

Before we see the code, two parameters to understand: **frequency** (in Hz) is how many on/off cycles occur per second, and **duty cycle** (0–65535 in MicroPython's 16-bit API, where 65535 = 100%) is the fraction of each cycle spent at the high state.

PWM applications in hydroponics include LED intensity control (1000–5000 Hz), variable-speed peristaltic pump drivers, servo motor control for valve positioning (50 Hz), and fan speed control.

```python
from machine import Pin, PWM

led = PWM(Pin(0))
led.freq(1000)
led.duty_u16(32768)   # 50% duty cycle

def set_pump_speed(pump_pin, percent):
    pump = PWM(Pin(pump_pin))
    pump.freq(500)
    duty = int(percent / 100 * 65535)
    pump.duty_u16(duty)

set_pump_speed(pump_pin=15, percent=75)
```

## Serial Communication Protocols

### I2C Protocol

**I2C** (Inter-Integrated Circuit) is a two-wire serial bus for communicating with sensors and peripherals. Two wires are used: **SDA** (Serial Data) and **SCL** (Serial Clock). A single I2C bus can address up to 127 devices simultaneously — each device has a unique 7-bit address. This makes I2C ideal for systems with many sensors sharing the same two pins.

Common hydroponic sensors that use I2C: temperature/humidity (SHT30, SHT31), CO₂ (SCD40), light (TSL2591 PAR sensor), OLED display drivers (SSD1306).

The protocol works as follows: the microcontroller (master) initiates all communication by generating the clock signal. Devices (slaves) respond when addressed by their unique 7-bit address.

```python
from machine import I2C, Pin

i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=400_000)

devices = i2c.scan()
print(f"I2C devices found: {[hex(d) for d in devices]}")

data = i2c.readfrom_mem(0x44, 0x00, 2)

i2c.writeto(0x44, bytes([0x2C, 0x06]))
```

`i2c.scan()` is an indispensable debugging tool — run it in the REPL first to confirm your sensor is wired correctly and recognized at its expected address.

### SPI Protocol

**SPI** (Serial Peripheral Interface) is a four-wire synchronous protocol — faster than I2C but requiring more pins. The four wires are: **MOSI** (Master Out Slave In), **MISO** (Master In Slave Out), **SCK** (Serial Clock), and **CS** (Chip Select). Each SPI device requires its own CS pin.

SPI devices in hydroponic systems include high-speed ADC chips for precision measurements, SD card modules for long-term data logging beyond flash capacity, and some displays.

```python
from machine import SPI, Pin

spi = SPI(0, baudrate=1_000_000, polarity=0, phase=0,
          sck=Pin(18), mosi=Pin(19), miso=Pin(16))
cs = Pin(17, Pin.OUT)

cs.value(0)
result = spi.read(2, write=0xFF)
cs.value(1)
```

SPI is faster than I2C (up to 80 MHz vs. 1 MHz for fast-mode I2C) and useful when reading sensors at high sample rates or writing to an SD card.

### UART Serial Communication

**UART** (Universal Asynchronous Receiver/Transmitter) is the classic two-wire serial protocol. Two pins: **TX** (transmit) and **RX** (receive). Unlike I2C and SPI, UART does not use a clock wire — both devices must agree on the same **baud rate** (bits per second) in advance.

Hydroponic sensors that use UART: Atlas Scientific pH and EC probes (in UART mode), CO₂ sensors (MH-Z19B, CM1106), and GPS modules.

```python
from machine import UART
import utime

uart = UART(1, baudrate=9600, tx=Pin(8), rx=Pin(9))

uart.write(b"R\r")

utime.sleep_ms(900)
if uart.any():
    response = uart.read()
    ph_str = response.decode().strip()
    ph = float(ph_str)
    print(f"pH: {ph:.2f}")
```

!!! mascot-thinking "Choosing the right bus"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress holds chin thoughtfully">
    I2C for multiple sensors on two wires. SPI for high-speed or precision sensors. UART for older sensors or those with pre-built ASCII command interfaces (like Atlas Scientific probes). If you're unsure, check the sensor's datasheet — it will specify which interface the sensor uses and what the required baud rate, address, or timing is.

## Interrupts and Timers

### Interrupts and IRQ

An **interrupt** is a hardware signal that causes the microcontroller to immediately pause its current code and run a special handler function. Unlike polling, interrupts allow the processor to respond to events the moment they occur.

In hydroponic systems, interrupts are useful for detecting a float switch activation instantly, catching a high-flow pulse from a water flow meter, and responding to alarm button presses without delay.

The handler function (called an **IRQ handler**) must be short and fast — it should only set a flag variable, not do complex operations like file writes or print statements. Heavy work happens in the main loop when it checks the flag.

```python
from machine import Pin
import utime

alarm_triggered = False

def overflow_handler(pin):
    global alarm_triggered
    alarm_triggered = True

overflow_pin = Pin(16, Pin.IN, Pin.PULL_UP)
overflow_pin.irq(trigger=Pin.IRQ_FALLING, handler=overflow_handler)

while True:
    if alarm_triggered:
        print("OVERFLOW DETECTED — stopping pumps")
        stop_all_pumps()
        alarm_triggered = False
    utime.sleep_ms(100)
```

`Pin.IRQ_FALLING` triggers when the pin transitions from high to low (float switch closes). `Pin.IRQ_RISING` triggers on low-to-high.

### Timer and machine.Timer

A **hardware timer** triggers a callback function at precise, regular intervals — independent of what the main program is doing. This is useful for periodic sensor sampling that must happen on a fixed schedule.

```python
from machine import Timer

sample_count = 0
readings = []

def sample_sensors(timer):
    global sample_count, readings
    ph = ph_sensor.read_ph()
    readings.append(ph)
    sample_count += 1

timer = Timer()
timer.init(period=5000, mode=Timer.PERIODIC, callback=sample_sensors)
```

### utime Module

The **`utime`** module provides time functions for delays and timestamps:

- `utime.sleep(seconds)` — pause for a floating-point number of seconds
- `utime.sleep_ms(ms)` — pause for an integer number of milliseconds
- `utime.sleep_us(us)` — pause for microseconds
- `utime.time()` — returns seconds since the epoch (requires RTC or NTP for accuracy)
- `utime.ticks_ms()` — returns a monotonic millisecond counter
- `utime.ticks_diff(new, old)` — compute elapsed time, handling counter wraparound

```python
start = utime.ticks_ms()
# ... do something ...
elapsed = utime.ticks_diff(utime.ticks_ms(), start)
print(f"Operation took {elapsed} ms")
```

## Asynchronous Programming

### Async/Await Concepts

A standard Python program executes one operation at a time. When `time.sleep(60)` runs, the entire program is frozen for 60 seconds. For a hydroponic controller that must handle multiple independent tasks simultaneously — reading pH every 30 seconds, checking flow rate every 5 seconds, updating a display every second, listening for alarms continuously — this is a problem.

**Async/await** (cooperative multitasking or coroutines) solves this by allowing multiple tasks to appear to run simultaneously. A coroutine is a function defined with `async def`. It suspends its own execution at an `await` point, allowing other coroutines to run, then resumes when its awaited operation completes.

The key concept: `await asyncio.sleep(60)` suspends *this* coroutine for 60 seconds but allows *other* coroutines to run during that time. `time.sleep(60)` blocks everything.

### asyncio in MicroPython

MicroPython includes `asyncio` for writing concurrent sensor loops:

```python
import asyncio

async def read_ph_loop():
    while True:
        ph = ph_sensor.read_ph()
        print(f"pH: {ph:.2f}")
        await asyncio.sleep(30)

async def read_temp_loop():
    while True:
        temp = temp_sensor.read()
        print(f"Temp: {temp:.1f}C")
        await asyncio.sleep(5)

async def update_display_loop():
    while True:
        display.show_readings()
        await asyncio.sleep(1)

async def main():
    await asyncio.gather(
        read_ph_loop(),
        read_temp_loop(),
        update_display_loop()
    )

asyncio.run(main())
```

`asyncio.gather()` runs multiple coroutines concurrently. The event loop switches between them at each `await asyncio.sleep()` call. This is the architecture used in production hydroponic controllers managing pH, EC, temperature, flow, display, and network reporting simultaneously.

!!! mascot-encourage "asyncio is advanced — build up to it"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Cress gives an encouraging nod">
    If asyncio feels complex, start by writing simple polling loops with `time.sleep()`. Once your individual sensor-reading functions work, wrap them in `async def` functions and combine with `asyncio.gather()`. The structure of each function barely changes — only the sleep calls need to become `await asyncio.sleep()`. Make it work first, then make it concurrent.

## Wi-Fi Connection on Pico W and ESP32

The Pico W and ESP32 both support 2.4 GHz Wi-Fi for uploading sensor data to a server or MQTT broker. The MicroPython `network` module handles the connection.

```python
import network
import utime

def connect_wifi(ssid, password, timeout=20):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    start = utime.ticks_ms()
    while not wlan.isconnected():
        if utime.ticks_diff(utime.ticks_ms(), start) > timeout * 1000:
            raise RuntimeError("Wi-Fi connection timed out")
        utime.sleep_ms(200)

    ip_info = wlan.ifconfig()
    print(f"Connected. IP: {ip_info[0]}")
    return wlan

wlan = connect_wifi("MyHomeNetwork", "password123")
```

Once connected, the microcontroller can use `urequests` (for HTTP) or `umqtt.simple` (for MQTT) to transmit sensor data to a server or cloud platform. Chapter 14 covers both in detail, along with MQTT broker setup, watchdog timers, and over-the-air firmware updates.

#### Diagram: Hardware Interface Architecture
<iframe src="../../sims/hardware-interface-architecture/main.html" width="100%" height="682" scrolling="no"></iframe>
<details markdown="1">
<summary>MicroPython Hardware Interface Architecture Diagram</summary>
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
</details>

## Key Takeaways

- **Try/except** wraps hardware communication calls to prevent crashes when sensors disconnect or return invalid data.
- **File I/O** uses mode `"a"` for sensor logs (append) and mode `"w"` for configuration files (overwrite); always use `with` statements for automatic cleanup.
- **CSV** is the best format for time-series sensor logs; **JSON** (via `ujson`) is best for configuration and network transmission.
- **GPIO pins** are configured as input or output with `machine.Pin`; pull-up and pull-down resistors ensure defined voltage levels for float switches.
- **ADC** converts analog sensor voltages (0–3.3 V) to integers (0–65535) that are scaled to engineering units via calibration equations.
- **PWM** approximates variable voltage via rapid on/off switching; duty cycle controls LED dimming, pump speed, and servo position.
- **I2C** uses two wires (SDA, SCL) for up to 127 addressable sensors; **SPI** uses four wires for higher speed; **UART** uses two wires for legacy sensors and ASCII-command devices.
- **Interrupts** allow instant response to physical events; the IRQ handler should only set a flag — the main loop does the heavy work.
- **asyncio** enables cooperative multitasking — multiple sensor loops running concurrently, sharing the CPU at `await asyncio.sleep()` points.
- **Wi-Fi** on Pico W and ESP32 uses the `network` module; MQTT and HTTP libraries then transmit sensor data to cloud platforms.

!!! mascot-celebration "Chapter 13 complete — your sensors are live!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You can now read every type of hydroponic sensor, control pumps and lights, log data to flash, and run concurrent sensor tasks — all on a $6 microcontroller. Chapter 14 takes the data off-device: MQTT for real-time streaming, HTTP for web dashboards, watchdog timers for crash recovery, and OTA updates so you can push firmware changes without touching the hardware. The cloud awaits, growers!
