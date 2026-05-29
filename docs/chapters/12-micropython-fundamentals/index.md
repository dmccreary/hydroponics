---
title: MicroPython Fundamentals
description: MicroPython on Raspberry Pi Pico and ESP32 — installation, Thonny IDE, REPL, data types, collections, control flow, functions, and object-oriented programming for hydroponic sensor systems.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# MicroPython Fundamentals

## Summary

This chapter introduces the MicroPython programming environment on two target platforms — Raspberry Pi Pico/Pico W and ESP32 — covering installation, the Thonny IDE, and the REPL interactive prompt. Students work through the full language foundation: primitive data types, strings, lists, tuples, dictionaries, conditional logic, loops, functions with default parameters, lambda expressions, and object-oriented programming with classes and inheritance.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. MicroPython vs CPython
2. Raspberry Pi Pico Overview
3. Raspberry Pi Pico W (Wi-Fi)
4. ESP32 Microcontroller Overview
5. MicroPython Installation
6. Thonny IDE Setup
7. REPL (Read-Eval-Print Loop)
8. Variables and Data Types
9. Integer and Float Types
10. String Operations
11. Boolean Logic
12. None Type and Null Checks
13. Lists in MicroPython
14. Tuples in MicroPython
15. Dictionaries in MicroPython
16. If-Else Statements
17. For Loops
18. While Loops
19. Loop Control (Break/Continue)
20. Functions and def Keyword
21. Function Parameters and Returns
22. Default Parameters
23. Lambda Functions
24. Classes and Objects (OOP)
25. Inheritance in MicroPython

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

!!! mascot-welcome "Cress powers up the Pico"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 12, growers! The first eleven chapters built your understanding of water, nutrients, light, and environment. Now we add the digital layer — the microcontroller programs that read sensors, log data, and eventually automate your entire system. By the end of this chapter, you'll have a working MicroPython environment and enough Python fundamentals to write real sensor-reading code. Let's grow something amazing — with code!

## MicroPython vs CPython: Same Language, Different Home

Python exists in several forms. The version most students encounter on laptops and in web courses is **CPython** — the reference implementation of Python maintained by the Python Software Foundation. CPython runs on operating systems like Windows, macOS, and Linux. It has access to a full filesystem, gigabytes of RAM, and a vast library ecosystem.

**MicroPython** is a lean reimplementation of Python 3 designed to run directly on microcontrollers — small chips with no operating system, often only 256 kilobytes of RAM and 2 megabytes of flash storage. MicroPython implements the Python 3 core language (the same syntax, data types, and control flow), but omits many standard library modules and adapts others for the constraints of embedded hardware.

The practical differences matter for hydroponic automation:

| Feature | CPython | MicroPython |
|---------|---------|-------------|
| Runs on | Laptops, servers | Microcontrollers (Pico, ESP32) |
| RAM available | 4–64+ GB | 128 KB – 520 KB |
| File system | Full OS filesystem | Small flash filesystem (LittleFS) |
| Standard library | Complete | Subset (`uos`, `ujson`, `urequests`) |
| Import speed | Fast | Slow (compiles on device) |
| Startup time | ~0.3 seconds | ~0.1 seconds (bare metal) |
| Power consumption | Watts | Milliwatts |

The syntax you write is nearly identical between CPython and MicroPython. A MicroPython script that reads a temperature sensor and formats the result as JSON is 95% identical to the equivalent Python script you would run on a Raspberry Pi (Linux) computer. This means everything you learn in this chapter transfers directly to desktop Python.

## The Hardware Platforms

### Raspberry Pi Pico

The **Raspberry Pi Pico** is a small, low-cost microcontroller board built around the RP2040 chip, designed by the Raspberry Pi Foundation. Its specifications:

- **Processor**: Dual-core Arm Cortex-M0+ at 133 MHz
- **RAM**: 264 KB on-chip SRAM
- **Flash**: 2 MB on-board (stores your MicroPython code)
- **GPIO pins**: 26 multi-function pins (GPIO, I2C, SPI, UART, ADC, PWM)
- **Power**: 1.8–5.5 V (USB powered or battery)
- **Cost**: ~$4 USD

The Pico has no built-in Wi-Fi. For network-connected hydroponic systems, use the Pico's companion: the **Raspberry Pi Pico W**, which adds a CYW43439 wireless chip supporting 2.4 GHz Wi-Fi. The Pico W costs ~$6 USD and runs the same MicroPython firmware with additional wireless libraries (`network`, `urequests`). The Pico W is the recommended platform for any hydroponic system that needs to log data to a server or receive remote commands.

### ESP32

The **ESP32** is a family of microcontrollers made by Espressif Systems. Where the Pico targets simplicity and cost, the ESP32 targets connectivity:

- **Processor**: Dual-core Xtensa LX6 at 240 MHz (faster than the Pico)
- **RAM**: 520 KB SRAM
- **Flash**: 4 MB (external SPI flash, expandable to 16 MB)
- **Built-in**: Wi-Fi (2.4 GHz 802.11 b/g/n) **and** Bluetooth (Classic + BLE)
- **GPIO pins**: 34 programmable pins with multiple peripherals
- **Power**: 3.3 V (usually powered via 5 V USB regulator)
- **Cost**: ~$3–$10 USD depending on board variant

The ESP32 is widely used in commercial hydroponic sensor nodes because of its built-in Wi-Fi, higher processing speed, and extensive community support. Many off-the-shelf hydroponic sensor shields are designed for ESP32 development boards (such as the ESP32 DevKit C or the Wemos D1 Mini32).

**Which to choose?** For learning and classroom use, the Raspberry Pi Pico W is recommended — it has excellent documentation, official MicroPython support, and the Pico's pinout is easier to read for beginners. For production deployments, the ESP32 is often preferred for its connectivity features and wider sensor ecosystem.

## Installing MicroPython

MicroPython is installed by **flashing firmware** onto the microcontroller — overwriting the chip's flash memory with a MicroPython runtime image. This is a one-time setup:

**For Raspberry Pi Pico / Pico W:**

1. Download the latest MicroPython `.uf2` firmware file from `micropython.org/download/RPI_PICO_W/` (for Pico W) or `micropython.org/download/RPI_PICO/` (for Pico).
2. Hold the **BOOTSEL** button on the Pico while plugging it into your computer via USB.
3. The Pico appears as a USB mass storage drive named "RPI-RP2".
4. Drag and drop the `.uf2` file onto the RPI-RP2 drive.
5. The Pico automatically reboots, running MicroPython.

**For ESP32:**

1. Install the `esptool` Python package on your computer: `pip install esptool`
2. Download the ESP32 MicroPython firmware (`.bin`) from `micropython.org/download/esp32/`
3. Erase the existing flash: `esptool.py --port /dev/ttyUSB0 erase_flash`
4. Flash the firmware: `esptool.py --port /dev/ttyUSB0 write_flash -z 0x1000 esp32-firmware.bin`

After either installation, the microcontroller presents a serial USB connection to your computer. The MicroPython runtime is now running on the chip, waiting for commands.

## Thonny IDE Setup

**Thonny** is a lightweight Python IDE (Integrated Development Environment) designed for beginners, with built-in support for MicroPython on embedded boards. It provides:

- A code editor with syntax highlighting
- A direct **REPL** connection to the microcontroller
- A file manager that shows files on both your computer and the microcontroller's flash filesystem
- One-click run/stop buttons that upload and execute code on the device

**Setup steps:**

1. Download Thonny from `thonny.org` and install it on your computer
2. Open Thonny → **Tools** → **Options** → **Interpreter** tab
3. Select "MicroPython (Raspberry Pi Pico)" or "MicroPython (ESP32)" from the interpreter dropdown
4. Select the correct COM port (Windows) or `/dev/ttyACM0` or `/dev/ttyUSB0` (Linux/Mac)
5. Click OK — the REPL panel at the bottom of Thonny should display the MicroPython version string

Thonny saves files to the microcontroller's flash filesystem. The file named `main.py` on the device runs automatically every time the microcontroller is powered on — this is where your hydroponic sensor loop will eventually live.

## The REPL: Interactive Python on the Device

The **REPL** (Read-Eval-Print Loop) is an interactive Python prompt that runs directly on the microcontroller. It reads your input, evaluates it as Python, prints the result, and loops back to wait for the next input. The REPL is the fastest way to test code, explore the hardware, and debug sensor problems.

In Thonny's shell panel (after connecting), you'll see the MicroPython prompt:

```
MicroPython v1.23.0 on 2024-06-02; Raspberry Pi Pico W with RP2040
Type "help()" for more information.
>>>
```

The `>>>` is the REPL prompt. You can type any valid Python expression:

```python
>>> 2 + 2
4
>>> "hello"
'hello'
>>> import machine
>>> machine.freq()
125000000
```

The last line queries the Pico's current CPU clock frequency — 125 MHz (the default). This kind of hardware introspection is only possible because the REPL is running on the microcontroller itself, not on your computer.

!!! mascot-thinking "The REPL is your sensor debugging tool"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress holds chin thoughtfully">
    When your sensor isn't reading correctly, don't re-flash the entire program. Open the REPL, import your sensor module, and query the sensor directly: `sensor.read_ph()`. You'll see the raw value immediately. This is 10x faster than the edit-flash-wait cycle. Get comfortable with the REPL before writing long scripts — it's how experienced embedded developers debug hardware.

## Variables and Data Types

MicroPython uses **dynamic typing** — variables have no declared type. The type is determined by the value assigned. This is identical to desktop Python:

```python
# The variable 'temperature' holds a float
temperature = 23.5

# The variable 'pump_running' holds a boolean
pump_running = False

# The variable 'sensor_id' holds a string
sensor_id = "pH-probe-A"

# The variable 'reading_count' holds an integer
reading_count = 0
```

Variables in MicroPython follow the same naming rules as Python: names must start with a letter or underscore, can contain letters, digits, and underscores, and are case-sensitive (`Temperature` and `temperature` are different variables).

### Integer and Float Types

**Integers** (`int`) are whole numbers with no decimal point. In MicroPython on the RP2040 and ESP32, integers are 30-bit signed values (range approximately ±536 million) by default, with support for arbitrary-precision integers.

**Floats** (`float`) are 64-bit double-precision floating-point numbers on CPython, but **32-bit single-precision** on most MicroPython platforms (including the Pico). This means MicroPython floats have approximately 7 significant decimal digits of precision — sufficient for sensor readings (pH to two decimal places, EC to three decimal places, temperature to one decimal place), but worth knowing if you are doing high-precision scientific calculations.

```python
>>> ph = 6.85
>>> ec = 1.423
>>> type(ph)
<class 'float'>
>>> type(42)
<class 'int'>
>>> round(ph, 1)
6.9
```

Arithmetic operators work as expected: `+`, `-`, `*`, `/` (float division), `//` (integer floor division), `%` (modulo), `**` (exponentiation).

### String Operations

**Strings** (`str`) in MicroPython are immutable sequences of Unicode characters. Single quotes and double quotes are interchangeable:

```python
>>> crop = "basil"
>>> status = 'nutrient solution nominal'
>>> len(crop)
5
>>> crop.upper()
'BASIL'
>>> crop + " - " + status
'basil - nutrient solution nominal'
```

Key string operations for sensor logging:

- `str(value)` — converts a number to string for concatenation
- `f"pH: {ph:.2f}"` — f-strings (formatted string literals) for embedding values
- `string.strip()` — removes leading/trailing whitespace (useful when parsing serial input)
- `string.split(",")` — splits a CSV line into a list of fields
- `string.encode()` / `string.decode()` — converts between `str` and `bytes` for network and UART communication

F-strings are essential for building log entries and MQTT messages:

```python
temp = 22.7
ph = 6.42
ec = 1.85
log_line = f"temp={temp:.1f},ph={ph:.2f},ec={ec:.3f}"
# Result: "temp=22.7,ph=6.42,ec=1.850"
```

### Boolean Logic

**Booleans** (`bool`) hold one of two values: `True` or `False`. Booleans are the result of comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) and logical operators (`and`, `or`, `not`).

```python
>>> ph = 6.85
>>> ph > 5.5 and ph < 7.5
True
>>> not (ph > 8.0)
True
```

In hydroponic control logic, boolean expressions directly represent "is the system in range?" checks:

```python
ph_ok = 5.5 <= ph <= 7.5
ec_ok = 0.8 <= ec <= 3.0
temp_ok = 18.0 <= temperature <= 28.0
system_nominal = ph_ok and ec_ok and temp_ok
```

### None Type and Null Checks

**`None`** is Python's null value — a singleton object of type `NoneType`. It represents the absence of a value. In sensor code, `None` is commonly used to signal "no reading available" when a sensor fails to return data.

```python
def read_sensor():
    try:
        value = sensor.read()
        return value
    except OSError:
        return None

reading = read_sensor()
if reading is None:
    print("Sensor error — skipping this reading")
else:
    print(f"Reading: {reading}")
```

Always test for `None` with `is None` or `is not None`, not with `== None`. This is the Python convention and avoids subtle bugs with objects that override equality.

!!! mascot-warning "Never use == None"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Cress raises a cautionary hand">
    Writing `if reading == None` works most of the time, but some objects override the `__eq__` method in unexpected ways. The idiomatic and safe form is `if reading is None` — this checks object identity, not equality. In sensor code where reliability matters, always use `is None`.

## Collections: Lists, Tuples, and Dictionaries

MicroPython supports three built-in collection types essential for sensor data management.

### Lists

A **list** is an ordered, mutable (changeable) collection of any objects, enclosed in square brackets. Lists are the go-to container for accumulating sensor readings over time.

```python
ph_readings = [6.5, 6.7, 6.4, 6.8, 6.6]

print(ph_readings[0])       # 6.5 (first element)
print(ph_readings[-1])      # 6.6 (last element)

ph_readings.append(6.9)

average_ph = sum(ph_readings) / len(ph_readings)
```

Common list operations for sensor logging: `append(value)` adds to the end; `pop(0)` removes the first element (sliding window buffer); `list[start:end]` extracts a sublist; `min()`, `max()`, and `sum()` compute statistics.

A useful pattern in hydroponic monitoring is the **fixed-length rolling buffer** — keep only the last N readings:

```python
MAX_READINGS = 10
readings = []

def add_reading(value):
    readings.append(value)
    if len(readings) > MAX_READINGS:
        readings.pop(0)
```

### Tuples

A **tuple** is an ordered, immutable collection, enclosed in parentheses. Once created, a tuple cannot be modified. Tuples are useful for values that should never change — pin assignments, calibration constants, or named result pairs returned from a function.

```python
I2C_PINS = (4, 5)   # SDA=4, SCL=5 — immutable configuration

def read_dht22():
    return 22.5, 65.0   # Returns a (temperature, humidity) tuple

temp, humidity = read_dht22()   # Tuple unpacking
```

Use tuples when you have a fixed set of values that logically belong together and should not be accidentally modified. Their immutability is a form of self-documentation: these values are configuration, not variable state.

### Dictionaries

A **dictionary** (`dict`) stores key-value pairs, enclosed in curly braces. Dictionaries are the natural structure for sensor readings where each measurement has a name:

```python
reading = {
    "timestamp": 1717000000,
    "temperature": 22.7,
    "ph": 6.42,
    "ec": 1.85,
    "dissolved_oxygen": 8.2
}

print(reading["ph"])          # 6.42
print(reading.get("tds", 0))  # 0 (default if key missing)

reading["vpd"] = 0.95

import ujson
json_string = ujson.dumps(reading)
```

The `ujson` module (MicroPython's compact JSON library) converts dictionaries to JSON strings for MQTT or HTTP transmission — the standard format for IoT sensor data.

## Control Flow

### If-Else Statements

Conditional logic in MicroPython uses `if`/`elif`/`else`. The condition is any expression that evaluates to `True` or `False`. Indentation (4 spaces) defines the block — there are no curly braces.

```python
ph = 5.2

if ph < 5.5:
    print("pH too low — add pH Up solution")
elif ph > 7.5:
    print("pH too high — add pH Down solution")
else:
    print(f"pH nominal: {ph:.2f}")
```

In hydroponic automation, if-elif-else chains implement the control logic that determines what the system does in response to sensor readings, covering every expected system state.

### For Loops

A **for loop** iterates over a sequence — a list, a range, or any iterable. The loop variable takes each value in order:

```python
readings = [6.4, 6.6, 6.5, 6.8, 6.3]
total = 0
for r in readings:
    total += r
average = total / len(readings)

for i in range(10):
    reading = sensor.read()
    print(f"Reading {i+1}: {reading}")
    time.sleep(1)
```

`range(n)` generates integers from 0 to n-1. `range(start, stop, step)` gives more control: `range(0, 100, 10)` generates 0, 10, 20, ..., 90.

### While Loops

A **while loop** repeats a block as long as a condition remains `True`. The main sensor polling loop in every hydroponic controller is a while loop:

```python
import time

while True:
    ph = read_ph_sensor()
    ec = read_ec_sensor()
    temp = read_temperature()
    log_reading(ph, ec, temp)
    check_alarms(ph, ec, temp)
    time.sleep(60)
```

`while True` creates an infinite loop that runs until the microcontroller is powered off or reset — the standard pattern for embedded control programs that run continuously by design.

### Loop Control: Break and Continue

**`break`** immediately exits the current loop. **`continue`** skips the rest of the current iteration and jumps to the next one.

```python
# break: exit loop when a valid reading is obtained
for attempt in range(5):
    reading = sensor.read()
    if reading is not None:
        break
    time.sleep(0.5)

# continue: skip invalid readings in a list
for r in all_readings:
    if r is None:
        continue
    process(r)
```

Both `break` and `continue` appear frequently in sensor code to handle missing data, out-of-range values, and retry logic.

!!! mascot-thinking "Loop control vs. flag variables"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress taps temple thoughtfully">
    Before `break` and `continue` existed, programmers used boolean flag variables. The `break`/`continue` approach is cleaner for most sensor retry patterns. Use `break` when you want to exit early upon success; use `continue` when you want to skip bad data and move on. Both make the intent clearer than a flag variable.

## Functions

### Defining Functions with def

A **function** is a named block of reusable code. Functions are defined with the `def` keyword, followed by the function name, parameters, and a colon. The function body is indented.

```python
def celsius_to_fahrenheit(celsius):
    return (celsius * 9 / 5) + 32

def format_sensor_reading(ph, ec, temperature):
    return f"pH:{ph:.2f} EC:{ec:.2f} T:{temperature:.1f}C"
```

Functions apply the **DRY principle** (Don't Repeat Yourself) — write sensor reading, conversion, and formatting code once, then call it wherever needed.

### Function Parameters, Returns, and Default Parameters

Functions take **parameters** (inputs) and **return** a value to the caller. A function that doesn't explicitly return a value returns `None`.

**Default parameters** allow a function to be called with fewer arguments — the default value is used when the caller doesn't supply that argument:

```python
def read_average_ph(samples=5, delay_ms=500):
    readings = []
    for _ in range(samples):
        readings.append(ph_sensor.read())
        time.sleep_ms(delay_ms)
    return sum(readings) / len(readings)

avg = read_average_ph()                    # 5 samples, 500ms delay
avg = read_average_ph(samples=10)          # 10 samples, 500ms delay
avg = read_average_ph(samples=3, delay_ms=200)  # 3 samples, 200ms delay
```

Default parameters reduce the amount of code callers must write for the common case while preserving the ability to override when needed.

### Lambda Functions

A **lambda** is a small anonymous function defined in a single expression, useful for short transformations that don't warrant a full `def`:

```python
raw_to_ph = lambda raw_adc: (raw_adc / 4095) * 14.0

readings.sort(key=lambda r: r["timestamp"])
```

In hydroponic code, lambdas appear most often as sort keys, in `map()` calls for unit conversion, and in `filter()` calls to exclude out-of-range values. For anything more complex than a single expression, use a named `def` function for readability.

## Object-Oriented Programming

### Classes and Objects

A **class** is a blueprint for creating objects. An **object** is a specific instance of a class. Classes bundle data (attributes) and behavior (methods) together.

For hydroponic systems, a class models a sensor: the sensor has attributes (calibration values, I2C address) and methods (read a value, calibrate, reset). Before we look at the class syntax, note two key terms: `__init__` is the **constructor** method that runs when you create a new instance, and `self` is a reference to the specific instance being operated on.

```python
class PHSensor:
    def __init__(self, adc_pin, calibration_slope=3.5, calibration_offset=0.0):
        self.adc = machine.ADC(adc_pin)
        self.slope = calibration_slope
        self.offset = calibration_offset

    def read_raw(self):
        return self.adc.read_u16()

    def read_ph(self):
        raw = self.read_raw()
        voltage = raw * 3.3 / 65535
        ph = self.slope * voltage + self.offset
        return round(ph, 2)

    def calibrate(self, known_ph, measured_voltage):
        self.offset = known_ph - (self.slope * measured_voltage)
```

To create and use a pH sensor object:

```python
ph_probe = PHSensor(adc_pin=26)
current_ph = ph_probe.read_ph()
print(f"Current pH: {current_ph}")

ph_probe.calibrate(known_ph=7.0, measured_voltage=2.24)
```

Classes make it easy to manage multiple sensors of the same type:

```python
reservoir_ph = PHSensor(adc_pin=26, calibration_slope=3.47)
inlet_ph = PHSensor(adc_pin=27, calibration_slope=3.51)
```

### Inheritance

**Inheritance** allows a new class to acquire the attributes and methods of an existing class, then add or override behavior. The `super()` function calls the parent class's `__init__` from inside the child class.

```python
class BaseSensor:
    def __init__(self, name):
        self.name = name
        self.last_reading = None

    def read(self):
        raise NotImplementedError("Subclass must implement read()")

    def status(self):
        return f"{self.name}: {self.last_reading}"


class TemperatureSensor(BaseSensor):
    def __init__(self, pin):
        super().__init__("Temperature")
        import ds18x20, onewire
        self.ow = onewire.OneWire(machine.Pin(pin))
        self.ds = ds18x20.DS18X20(self.ow)
        self.rom = self.ds.scan()[0]

    def read(self):
        self.ds.convert_temp()
        time.sleep_ms(750)
        value = self.ds.read_temp(self.rom)
        self.last_reading = value
        return value


class ECSensor(BaseSensor):
    def __init__(self, adc_pin, k_constant=1.0):
        super().__init__("EC")
        self.adc = machine.ADC(adc_pin)
        self.k = k_constant

    def read(self):
        raw = self.adc.read_u16()
        voltage = raw * 3.3 / 65535
        ec = voltage * self.k
        self.last_reading = ec
        return ec
```

With this design, any code that works with a `BaseSensor` automatically works with `TemperatureSensor` and `ECSensor` — you can put different sensor types in a list and call `.read()` on each:

```python
sensors = [TemperatureSensor(pin=2), ECSensor(adc_pin=28)]

for sensor in sensors:
    value = sensor.read()
    print(sensor.status())
```

This pattern — a base class with a shared interface, subclasses with specific implementations — is how professional hydroponic control systems are structured. Chapter 13 builds on this foundation with real sensor libraries.

!!! mascot-encourage "OOP takes practice — start with one class"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Cress gives an encouraging nod">
    Object-oriented programming can feel abstract at first. Don't try to design a full class hierarchy before writing any code. Start with one sensor, write a simple class for it, and make it work. Once you have a working `PHSensor` class, the pattern for `ECSensor` and `TemperatureSensor` will feel natural. Good OOP design emerges from working code — it isn't designed in advance.

#### Diagram: MicroPython Concept Map
<iframe src="../../sims/micropython-concept-map/main.html" width="100%" height="642" scrolling="no"></iframe>
<details markdown="1">
<summary>MicroPython Fundamentals Interactive Concept Map</summary>
Type: concept-map
**sim-id:** micropython-concept-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the relationships between the 25 MicroPython concepts in this chapter, organized as a visual dependency map from hardware (bottom) to language (middle) to OOP (top).

Bloom Level: Understand (L2) and Remember (L1)
Bloom Verb: Organize — students see how hardware setup, data types, control flow, functions, and OOP build on each other.

Layout: Canvas 800×520. Four horizontal tiers:
- Bottom tier (Hardware): Raspberry Pi Pico, Pico W, ESP32, MicroPython Installation, Thonny IDE, REPL
- Middle tier (Language Fundamentals): Variables, Integer/Float, String, Boolean, None, Lists, Tuples, Dicts
- Upper-middle tier (Control Flow and Functions): If-Else, For Loops, While Loops, Break/Continue, Functions, Default Parameters, Lambda
- Top tier (OOP): Classes and Objects, Inheritance

Nodes: Rounded rectangles, color-coded by tier (dark blue bottom → teal middle → green upper → gold top). Each node labeled with concept name.

Edges: Arrows from prerequisite to dependent concept. On hover, arrows highlight in orange and a tooltip shows "concept A enables concept B".

Interactivity:
- Clicking a node highlights it and all directly connected nodes (predecessors and successors) in orange; all others dim to 30% opacity.
- Click background to deselect.
- Toggle "Show Code Examples": hovering a node shows a 1–4 line code snippet popup illustrating that concept.

Responsive: Scales to fit container width.
</details>

## Key Takeaways

- **MicroPython** is Python 3 for microcontrollers — same syntax, smaller footprint, no operating system required.
- **Raspberry Pi Pico W** is the recommended beginner platform; **ESP32** is preferred for production deployments requiring built-in Wi-Fi and Bluetooth.
- **Thonny IDE** manages the connection to the microcontroller, handles file transfers, and provides direct REPL access.
- **The REPL** (Read-Eval-Print Loop) is the fastest way to test sensor code and debug hardware issues interactively.
- **Python's core types** — integers, floats, strings, booleans, and `None` — work identically in MicroPython, with floats being 32-bit (single precision) on most microcontrollers.
- **Collections** — lists (mutable, ordered), tuples (immutable, ordered), and dictionaries (key-value) — are the fundamental data structures for sensor buffers and readings.
- **Control flow** — if/elif/else, for, while, break, continue — implements all decision logic in a hydroponic controller.
- **Functions** with default parameters reduce repetition and make sensor code reusable; lambdas suit short single-expression transformations.
- **Classes and inheritance** model sensors as objects with shared interfaces, enabling clean code that works uniformly across different sensor types.

!!! mascot-celebration "Chapter 12 complete — you speak MicroPython!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You've gone from zero to object-oriented MicroPython! The language fundamentals in this chapter are all you need to write real hydroponic sensor code. Chapter 13 puts this to work: GPIO pins, I2C and SPI buses, ADC readings, PWM for pump control, and the interrupt-driven patterns that make a microcontroller feel alive. Bring your Pico — it's time to wire something up!
