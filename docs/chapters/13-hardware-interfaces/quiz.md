# Quiz: Hardware Interfaces and Electronics

Test your understanding of I2C, SPI, UART, GPIO, ADC, PWM, interrupts, and asyncio patterns for hydroponics hardware integration with these questions.

---

#### 1. What is the key advantage of I2C over SPI for connecting multiple sensors to a single MicroPython controller in a hydroponics system?

<div class="upper-alpha" markdown>
1. I2C is faster than SPI, making it better for real-time sensor data
2. I2C requires only two wires (SDA and SCL) and supports up to 127 devices on the same bus using unique addresses, while SPI requires a separate chip-select wire per device
3. I2C sensors are lower cost than SPI sensors because they require fewer pins
4. I2C operates at 5V logic levels, which is safer for sensors near water
</div>

??? question "Show Answer"
    The correct answer is **B**. I2C uses a two-wire bus (SDA for data, SCL for clock) with a 7-bit address scheme supporting up to 127 unique device addresses on one bus. This allows multiple sensors — pH, EC, temperature, humidity, CO₂ — to share the same two GPIO pins, each responding only to its unique address. SPI is faster but requires a dedicated chip-select (CS) pin per device, which quickly exhausts GPIO pins on a Pico (26 available). For a hydroponics sensor array, I2C's address multiplexing is far more practical than SPI's pin-per-device requirement.

    **Concept Tested:** I2C Communication Protocol

---

#### 2. Why must pull-up resistors be connected to the SDA and SCL lines of an I2C bus?

<div class="upper-alpha" markdown>
1. Pull-up resistors limit current to protect the microcontroller from sensor short circuits
2. I2C uses open-drain signaling where devices can only pull lines low; pull-up resistors (3.3k–10kΩ) pull lines high when no device is driving them, enabling proper logic-level signaling
3. Pull-up resistors set the I2C communication speed — higher resistance means faster clock
4. Pull-up resistors are only needed for long cable runs over 1 meter
</div>

??? question "Show Answer"
    The correct answer is **B**. I2C uses open-drain (or open-collector) signaling — devices can only actively pull a line to logic LOW (ground), never actively drive it HIGH. The logic HIGH state is achieved passively by pull-up resistors (typically 3.3kΩ–10kΩ) connecting SDA and SCL to VCC. When no device is pulling the line low, the resistor holds it high. This design allows multiple devices to share the same wires without electrical conflicts. Without pull-up resistors, I2C lines would float at undefined voltages, making communication unreliable or impossible.

    **Concept Tested:** I2C Pull-up Resistors

---

#### 3. A MicroPython script reads analog voltage from a pH sensor circuit connected to ADC pin 26 on a Raspberry Pi Pico. The raw ADC reading is 2048. What voltage does this represent?

<div class="upper-alpha" markdown>
1. 2.048 V
2. 1.65 V
3. 3.3 V
4. 0.5 V
</div>

??? question "Show Answer"
    The correct answer is **B**. The Pico's ADC is 12-bit, giving a range of 0–4095. It measures 0–3.3V. The conversion is: Voltage = (reading / 4095) × 3.3V. For reading 2048: (2048 / 4095) × 3.3V ≈ 1.65V — exactly half of the 3.3V reference, as expected for a midpoint reading. This formula is essential for converting raw ADC counts to the millivolt values needed for pH and EC sensor calibration calculations.

    **Concept Tested:** ADC Readings

---

#### 4. What is the purpose of PWM (Pulse Width Modulation) in a hydroponics controller, and what parameter controls the actual power delivered to a device?

<div class="upper-alpha" markdown>
1. PWM controls the frequency of power delivery; higher frequency delivers more power
2. PWM switches a digital output on and off rapidly; the duty cycle (percentage of time the signal is HIGH) determines the average power delivered to the device
3. PWM is used exclusively for stepper motor control and has no application in hydroponics
4. PWM converts analog sensor voltages to digital values for the microcontroller to read
</div>

??? question "Show Answer"
    The correct answer is **B**. PWM generates a digital square wave at a fixed frequency. The duty cycle — the percentage of each period where the output is HIGH — determines the average power delivered: 0% duty cycle = fully off, 50% = half power, 100% = fully on. In hydroponics, PWM controls: LED dimming (adjusting PPFD without changing spectrum), variable-speed pump control, and fan speed regulation. On the Pico, `pwm.duty_u16(32768)` sets 50% duty cycle (32768/65535 ≈ 50%) for the 0–65535 range.

    **Concept Tested:** PWM Control

---

#### 5. A float sensor in a hydroponic reservoir should trigger an alarm when the water level drops below a threshold. Why is a hardware interrupt (IRQ) preferred over polling the sensor in the main loop?

<div class="upper-alpha" markdown>
1. Hardware interrupts use less power, extending battery life in solar-powered systems
2. Polling checks the sensor only during each loop iteration (every N seconds), potentially missing a brief low-level event; an interrupt triggers immediately when the signal changes, regardless of loop timing
3. Hardware interrupts work with all sensor types; polling only works with digital sensors
4. The Pico's main loop cannot read GPIO pins directly — interrupts are the only way to read digital inputs
</div>

??? question "Show Answer"
    The correct answer is **B**. A polling loop checks the float switch only when execution reaches that point in the loop — if the loop takes 5 seconds, a dangerous low-level event could persist for up to 5 seconds before detection. A hardware interrupt (IRQ) configured with `pin.irq(trigger=Pin.IRQ_FALLING, handler=alarm_callback)` fires the callback function immediately when the pin transitions, regardless of where the main loop is in its cycle. For safety-critical events like reservoir overflow or pump cavitation, immediate response via interrupt is essential.

    **Concept Tested:** GPIO Interrupts

---

#### 6. When saving sensor data to a CSV file on a MicroPython microcontroller, why must the file be opened in append mode (`"a"`) rather than write mode (`"w"`)?

<div class="upper-alpha" markdown>
1. Append mode is faster for writing small amounts of data than write mode
2. Write mode (`"w"`) truncates (erases) the entire file every time it is opened; append mode adds new rows to the end of the existing file, preserving historical data
3. Write mode requires a specific file size to be specified in advance, which is not possible for time-series data
4. Append mode automatically adds the CSV header row; write mode does not
</div>

??? question "Show Answer"
    The correct answer is **B**. This is a significant footgun in file I/O. Opening a file with `open("data.csv", "w")` creates the file if it does not exist, but if the file already contains data, it immediately truncates (deletes) all existing content before writing. If a hydroponics controller logs data hourly and opens in write mode at each write, every new log entry destroys all previous data, leaving only the most recent record. Append mode (`"a"`) moves the file pointer to the end and adds new content without touching existing data, correctly building a cumulative time-series log.

    **Concept Tested:** CSV Data Logging

---

#### 7. A relay module designed to control a 120V AC pump is labeled "active low." What does this mean and how does it affect the MicroPython control code?

<div class="upper-alpha" markdown>
1. Active low means the relay uses low-voltage (3.3V) coil power, making it safe to connect to the Pico directly
2. Active low means the relay activates (closes the switch, turning the pump ON) when the control pin is driven LOW (0V), and deactivates when the pin is HIGH (3.3V) — the inverse of intuitive logic
3. Active low is a safety feature that prevents the relay from activating if the control wire is disconnected
4. Active low means the relay can only switch AC loads under 120V; higher voltages require active-high modules
</div>

??? question "Show Answer"
    The correct answer is **B**. Active-low relay modules activate when the IN pin is pulled to 0V (logic LOW) and deactivate when the IN pin is at 3.3V (logic HIGH). This inverts expected behavior: `relay_pin.value(0)` turns the pump ON; `relay_pin.value(1)` turns it OFF. This is a subtle footgun — code written with intuitive logic (`1 = on, 0 = off`) will control the pump in reverse. Additionally, if the Pico resets or the control pin floats to HIGH, the relay deactivates (safe default). Always check relay module documentation for active-high vs. active-low before writing control code.

    **Concept Tested:** Relay Control

---

#### 8. Why is a voltage divider circuit necessary when connecting a 5V sensor output to a 3.3V Raspberry Pi Pico GPIO input pin?

<div class="upper-alpha" markdown>
1. The voltage divider increases the signal from 5V to the 5V needed by the sensor's internal logic
2. Applying 5V directly to a 3.3V GPIO pin can permanently damage the Pico's input circuitry; the voltage divider reduces 5V to approximately 3.3V before it reaches the pin
3. The voltage divider filters out electrical noise from the 5V sensor signal before it reaches the microcontroller
4. The Pico requires a minimum of 2 mA signal current that 5V sensors cannot provide without a divider
</div>

??? question "Show Answer"
    The correct answer is **B**. The Raspberry Pi Pico GPIO pins are rated for 3.3V logic. Applying a 5V signal directly exceeds the maximum input voltage specification and can damage the GPIO input protection diodes or permanently destroy the pin. A voltage divider using two resistors (e.g., 10kΩ and 20kΩ) divides the 5V signal: Vout = Vin × (R2/(R1+R2)) = 5V × (20k/(10k+20k)) = 3.33V. This brings the signal within safe range. Dedicated level-shifter ICs provide cleaner conversion for bidirectional signals like I2C.

    **Concept Tested:** Voltage Dividers and Level Shifting

---

#### 9. What is the difference between `time.sleep()` and `asyncio.sleep()` for hardware timing in a MicroPython hydroponics controller, and when does the choice matter?

<div class="upper-alpha" markdown>
1. `asyncio.sleep()` is more accurate than `time.sleep()` for precise timing intervals
2. `time.sleep()` blocks all execution for the specified duration; `asyncio.sleep()` yields control to other coroutines during the wait, enabling concurrent sensor monitoring tasks without threads
3. `time.sleep()` works with all Pico hardware; `asyncio.sleep()` only works with Pico W Wi-Fi features
4. Both are identical — use whichever has the cleaner syntax for the specific application
</div>

??? question "Show Answer"
    The correct answer is **B**. `time.sleep(5)` is a blocking call: the entire program freezes for 5 seconds. If a pH sensor needs reading every 5 seconds and a temperature sensor every 1 second, blocking sleep makes concurrent scheduling impossible without complex state machines. `asyncio.sleep(5)` is a coroutine — it suspends the current task and returns control to the asyncio event loop, allowing other tasks to run during the wait. A hydroponics controller with multiple sensors, a display update, and network logging benefits significantly from asyncio's cooperative multitasking model.

    **Concept Tested:** Asyncio vs Time Sleep

---

#### 10. When building a waterproof electronics enclosure for hydroponics hardware, what IP rating is the minimum acceptable, and what do the two IP digits represent?

<div class="upper-alpha" markdown>
1. IP44 minimum; first digit = shock resistance rating, second digit = moisture resistance rating
2. IP65 minimum; first digit = solid particle (dust) protection level (6 = dust-tight), second digit = liquid ingress protection level (5 = water jets from any direction)
3. IP20 is sufficient for indoor hydroponic environments; outdoor installations require IP65
4. IP rating only applies to commercial industrial equipment; consumer-grade components do not require IP ratings
</div>

??? question "Show Answer"
    The correct answer is **B**. IP (Ingress Protection) ratings use two digits: the first indicates protection against solid particles (1=large objects to 6=dust-tight) and the second indicates protection against liquids (1=dripping water to 9=high-pressure steam). IP65 is the minimum for a hydroponics grow room: dust-tight (6) prevents nutrient salt crystals from entering, and protected against water jets (5) provides margin against splashes, condensation, and spray from irrigation systems. Sensors and electronics in a damp grow environment at IP20 (only finger-sized objects excluded) would quickly fail from moisture ingress.

    **Concept Tested:** Waterproofing Electronics

---
