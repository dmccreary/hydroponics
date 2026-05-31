# Quiz: Networking and IoT for Hydroponics

Test your understanding of MicroPython networking, MQTT, REST APIs, boot sequences, watchdog timers, OTA updates, and remote monitoring system design with these questions.

---

#### 1. In a MicroPython Pico W project, what is the correct purpose of `boot.py` versus `main.py`, and in which file should Wi-Fi connection code be placed?

<div class="upper-alpha" markdown>
1. `boot.py` runs last after the system is fully initialized; `main.py` runs first at power-on
2. `boot.py` runs first at power-on to perform hardware initialization (including Wi-Fi connection); `main.py` runs second and contains the main application logic
3. Both files run simultaneously in separate threads; neither has execution priority over the other
4. `boot.py` is only used for factory reset procedures; `main.py` handles all normal operation including networking
</div>

??? question "Show Answer"
    The correct answer is **B**. On Pico W, `boot.py` executes first immediately after power-on or reset, before `main.py`. Wi-Fi connection code belongs in `boot.py` because the application in `main.py` depends on network connectivity — attempting to connect in `main.py` means the connection happens after application code starts, potentially causing failures if the first network call occurs before connection is established. The boot sequence is: hardware power-on → MicroPython firmware initializes → `boot.py` executes → `main.py` executes.

    **Concept Tested:** Boot Sequence

---

#### 2. What is the MQTT publish/subscribe model and why is it more appropriate than direct HTTP GET/POST for a distributed hydroponics sensor network?

<div class="upper-alpha" markdown>
1. MQTT is more secure than HTTP because it uses binary encoding; HTTP sends data in plaintext
2. MQTT uses a broker as a message relay — sensors publish to topics and monitors subscribe to topics — decoupling senders from receivers and enabling one sensor reading to reach multiple consumers simultaneously without direct connections
3. MQTT is only appropriate for professional commercial systems; HTTP is preferred for DIY projects because of simpler debugging
4. MQTT eliminates the need for a network router; sensors communicate directly with each other using the broker as a peer discovery service
</div>

??? question "Show Answer"
    The correct answer is **B**. In MQTT, a broker (like Mosquito) sits centrally and manages message routing. Sensors publish readings to named topics (e.g., `hydroponics/tank1/ph`). Any number of subscribers (dashboard, alert service, data logger, phone app) can independently subscribe to those topics and receive every update. This decoupling means: adding a new consumer requires no changes to the sensor code; a sensor can publish while its consumers are offline (messages queue); and one sensor reading can simultaneously update a dashboard, trigger an alarm, and log to a database. HTTP requires direct request/response connections between specific endpoints.

    **Concept Tested:** MQTT Publish/Subscribe

---

#### 3. A MicroPython program uses `urequests.get()` to fetch configuration data from a REST API. What critical step is often forgotten that causes memory exhaustion on the Pico W over time?

<div class="upper-alpha" markdown>
1. Calling `gc.collect()` before the request to free memory for the response buffer
2. Calling `response.close()` after processing the response to release the TCP socket and associated memory
3. Setting a timeout parameter to prevent the request from blocking indefinitely
4. Converting the JSON response to a Python dictionary before the socket closes automatically
</div>

??? question "Show Answer"
    The correct answer is **B**. This is a common pitfall specific to MicroPython's `urequests` library. Each `urequests.get()` call opens a TCP socket and allocates a response buffer. Unlike CPython where the garbage collector can reclaim these automatically, MicroPython on the Pico W has limited RAM and the socket does not automatically close when the response object goes out of scope. Without explicit `response.close()`, each API call leaks a socket and its memory buffer. After dozens of calls in a long-running monitoring loop, the Pico runs out of memory and crashes. Always call `response.close()` immediately after reading the response data.

    **Concept Tested:** Memory Management

---

#### 4. What is the purpose of a watchdog timer (WDT) in a long-running MicroPython hydroponics controller, and when must it be started in the boot sequence?

<div class="upper-alpha" markdown>
1. The watchdog timer logs sensor readings at regular intervals to prevent data gaps
2. The watchdog timer automatically reboots the microcontroller if the main loop stops feeding it (calling wdt.feed()), recovering from software crashes that would otherwise leave the system unmonitored
3. The watchdog timer controls the nutrient pump timing, ensuring precise dosing intervals
4. The watchdog timer monitors battery voltage and initiates safe shutdown before power is exhausted
</div>

??? question "Show Answer"
    The correct answer is **B**. A watchdog timer (WDT) is a hardware counter that reboots the microcontroller unless the software periodically resets it (calls `wdt.feed()`). In a properly functioning main loop, `wdt.feed()` is called every iteration. If the program crashes, deadlocks, or enters an infinite exception loop, the watchdog counter expires and forces a hardware reboot, restoring operation. Critical timing: the WDT must be started AFTER all initialization (Wi-Fi connection, sensor initialization) is complete. Starting it before initialization may cause the watchdog to trigger during the slow Wi-Fi connection process, creating an endless reboot loop before the program can ever run.

    **Concept Tested:** Watchdog Timer

---

#### 5. A grower wants to push a firmware update to a Pico W hydroponics controller without physical access to the device (OTA update). What is the safest implementation pattern for OTA on MicroPython?

<div class="upper-alpha" markdown>
1. Download the new firmware directly over the network and write it to the Pico's flash filesystem, overwriting the existing files immediately
2. Download the update to a temporary file, verify its integrity, then rename/replace the original file atomically — ensuring the old version is not removed until the new version is confirmed valid
3. OTA updates are not possible on MicroPython — the device must be physically connected to a computer for all firmware updates
4. The best OTA approach is to completely erase the filesystem and reload all files from scratch on each update
</div>

??? question "Show Answer"
    The correct answer is **B**. Directly overwriting `main.py` during download is a dangerous mistake: if the network connection drops mid-download, the file is partially written — the device then boots with corrupted firmware and may become unrecoverable remotely. The safe pattern is: (1) download new code to a temp file (`main.py.new`); (2) verify the file is complete and valid (check file size, or compute a hash); (3) atomically rename `main.py.new` to `main.py`. This ensures the device always has either the old valid firmware or the new valid firmware, never a corrupt partial file.

    **Concept Tested:** OTA Updates

---

#### 6. When a Pico W loses Wi-Fi connection during operation, what is the correct reconnection strategy to avoid blocking the main sensor loop?

<div class="upper-alpha" markdown>
1. Call `wlan.connect()` and wait in a blocking loop until the connection is restored before resuming sensor monitoring
2. Detect the disconnection, attempt reconnection in the background (or with limited retries), continue sensor reading and local logging without network, and alert only when reconnection fails after multiple attempts
3. Reboot the device immediately when Wi-Fi disconnects — this is the fastest way to restore connectivity
4. Wi-Fi disconnection should never occur in a properly configured system; no reconnection code is needed
</div>

??? question "Show Answer"
    The correct answer is **B**. Blocking the main loop on Wi-Fi reconnection can leave pumps and environmental controls unmonitored for minutes during a network outage. The correct pattern is non-blocking: detect disconnection, log a local warning, continue reading sensors and writing to local storage, attempt reconnection in the background or with a few quick retries, and raise an alarm only if reconnection fails persistently. This ensures the physical monitoring and control functions continue during network issues — network connectivity enhances but should not be required for basic safety monitoring.

    **Concept Tested:** Wi-Fi Connection Management

---

#### 7. What is the DS18B20 temperature sensor's communication protocol, and what makes it particularly useful for monitoring multiple points in a hydroponic system?

<div class="upper-alpha" markdown>
1. DS18B20 uses I2C and supports up to 8 sensors on the same bus with fixed addresses 0x48–0x4F
2. DS18B20 uses 1-Wire protocol — multiple sensors with unique 64-bit ROM codes can share a single data wire, enabling temperature monitoring at many points (reservoir, air, inlet, outlet) with one GPIO pin
3. DS18B20 uses SPI and requires one chip-select pin per sensor but offers the highest accuracy of any temperature sensor type
4. DS18B20 uses analog voltage output; the reading must be converted to temperature using a lookup table
</div>

??? question "Show Answer"
    The correct answer is **B**. The DS18B20 uses Dallas/Maxim's 1-Wire protocol — a single-wire bus (plus ground) where each sensor has a factory-programmed unique 64-bit ROM ID. MicroPython's `onewire` and `ds18x20` libraries can address each sensor individually on the shared wire. For hydroponics, this enables: reservoir inlet and outlet temperature monitoring (differential tells you heat exchange efficiency), air temperature near the canopy, and nutrient solution temperature at multiple depths — all using one GPIO pin and one pull-up resistor rather than one I2C address per sensor.

    **Concept Tested:** DS18B20 Temperature Sensors

---

#### 8. NeoPixel RGB LEDs are used as status indicators on a hydroponics controller. A grower sets the LED color to green when all systems are normal and red when an alarm is triggered. What is the main advantage of this approach over a text log?

<div class="upper-alpha" markdown>
1. NeoPixels consume less power than sending text over serial, extending battery life
2. Color status indicators provide at-a-glance system health information without requiring a connected computer or screen, making system status immediately visible from across the grow room
3. NeoPixels can display more alarm categories than text logs, which are limited to ASCII characters
4. NeoPixel indicators work without any programming — they self-configure based on sensor readings
</div>

??? question "Show Answer"
    The correct answer is **B**. A text log requires a connected computer and serial terminal to read. A NeoPixel status indicator provides immediate visual feedback: green = all systems normal; yellow = warning; red = alarm; blue = reconnecting to Wi-Fi. This can be seen from across the grow room without any connected device. In commercial greenhouse settings, a row of green or amber LEDs on a control panel communicates system status to anyone in the facility instantly. This follows the principle of "fail visible" — system problems should be obvious without active monitoring.

    **Concept Tested:** NeoPixel Status Indicators

---

#### 9. A MicroPython hydroponics controller publishes pH readings every 60 seconds via MQTT. A monitoring dashboard subscribes to the topic. If the controller loses power for 30 minutes, what happens to the 30 readings that were not published?

<div class="upper-alpha" markdown>
1. The MQTT broker buffers all missed messages and delivers them in bulk when the controller reconnects
2. The 30 readings are lost entirely — MQTT only delivers messages in real time; there is no server-side buffering of missed messages for offline publishers
3. MQTT automatically saves missed readings to the controller's filesystem and republishes them after reconnection
4. The dashboard displays "0.0 pH" for the missing 30 readings, filling the gap with default values
</div>

??? question "Show Answer"
    The correct answer is **B**. Standard MQTT QoS 0 (the most common default) provides no guarantees — messages are delivered at most once to currently-connected subscribers, with no queuing for offline publishers. When the controller was offline, no readings were published. When it reconnects, it resumes publishing current readings — the 30-minute gap simply does not exist in the published data. The correct architecture for data continuity is local SD card or flash logging on the controller itself, with a separate process to upload historical records after reconnection. MQTT alone is not a data reliability solution.

    **Concept Tested:** MQTT Data Reliability

---

#### 10. What is the minimum information that must be included in every timestamped sensor log entry to make the data useful for post-hoc analysis of a crop cycle?

<div class="upper-alpha" markdown>
1. Only the sensor reading value — the timestamp is implicit from the file creation date
2. Timestamp (ISO 8601 format), sensor identifier, reading value with units, and system status flag (normal/alarm/calibration)
3. Timestamp and reading value are sufficient; other metadata can be added manually during analysis
4. The log file name contains the date — individual entries only need reading values and sensor names
</div>

??? question "Show Answer"
    The correct answer is **B**. Useful crop cycle analysis requires: (1) timestamp in ISO 8601 format (YYYY-MM-DDTHH:MM:SS) for unambiguous sorting and merging with other data sources; (2) sensor identifier (which tank, which sensor type) since systems may have multiple sensors of the same type; (3) reading value with explicit units (pH, mS/cm, °C) to prevent unit confusion during analysis; (4) status flag to distinguish normal readings from readings taken during calibration or alarm states, which should be excluded from trend analysis. Missing any of these fields creates data quality problems that may not be discovered until months later.

    **Concept Tested:** Data Logging Best Practices

---
