# Quiz: MicroPython Fundamentals

Test your understanding of MicroPython hardware constraints, data types, control flow, collections, functions, and object-oriented programming for embedded hydroponics controllers with these questions.

---

#### 1. What is the most significant difference between MicroPython running on a Raspberry Pi Pico and standard CPython running on a desktop computer?

<div class="upper-alpha" markdown>
1. MicroPython uses a different programming language syntax that is incompatible with CPython
2. MicroPython has severely constrained RAM (264 KB on Pico) and no operating system, requiring memory-efficient programming and direct hardware register access
3. MicroPython is slower because it runs on battery power instead of mains electricity
4. MicroPython cannot use loops or functions — only sequential line-by-line execution is supported
</div>

??? question "Show Answer"
    The correct answer is **B**. The Raspberry Pi Pico has 264 KB of RAM total — compared to gigabytes on a desktop — and no operating system managing memory, processes, or file systems. This means: (1) large data structures can cause out-of-memory crashes; (2) there is no garbage collection running in the background (gc.collect() must be called explicitly); (3) hardware is accessed directly through registers via the machine module; (4) libraries must be MicroPython-compatible versions (CPython libraries will not import). The syntax is largely compatible, but the runtime environment is fundamentally different.

    **Concept Tested:** MicroPython vs CPython

---

#### 2. On a Raspberry Pi Pico, what is the data type of `3.14159` and what limitation does this create compared to CPython?

<div class="upper-alpha" markdown>
1. It is a 64-bit double-precision float, identical to CPython — no limitation exists
2. It is a 32-bit single-precision float, giving only 6–7 significant digits of precision versus CPython's 15–16 digits
3. It is stored as an integer — MicroPython on Pico does not support floating point natively
4. It is a 16-bit half-precision float, limiting all values to the range ±65,504
</div>

??? question "Show Answer"
    The correct answer is **B**. MicroPython on the Pico uses 32-bit single-precision floating point (IEEE 754), which provides only 6–7 significant digits of precision. CPython uses 64-bit double precision (15–16 digits). For hydroponics control, this matters when: (1) calculating pH from millivolt readings (rounding errors accumulate in the Nernst equation); (2) averaging many sensor readings (accumulated rounding drift); (3) comparing floating point values for exact equality. The practical workaround is to round results to the meaningful precision of the sensor (e.g., one decimal place for pH) rather than relying on float precision.

    **Concept Tested:** Data Types in MicroPython

---

#### 3. Why should sensor readings be checked with `if reading is None` rather than `if not reading` in MicroPython hydroponics code?

<div class="upper-alpha" markdown>
1. The `is None` check is faster and uses less RAM than the `not` operator
2. `if not reading` treats valid sensor values of 0 and 0.0 as False, incorrectly branching as if the sensor failed when it actually returned a valid zero measurement
3. `is None` is required because MicroPython does not support boolean logic on sensor objects
4. Both checks are identical in MicroPython — there is no practical difference between them
</div>

??? question "Show Answer"
    The correct answer is **B**. This is a classic Python pitfall. The `not` operator uses truthiness evaluation: `not 0` is `True`, `not 0.0` is `True`, `not ""` is `True`. If a sensor returns a valid reading of 0 (e.g., a dissolved oxygen sensor reading 0 mg/L in an anaerobic environment, or a temperature sensor at 0°C), `if not reading` would incorrectly branch to the error handling path. `if reading is None` only triggers when the value is explicitly `None`, correctly distinguishing "sensor failed and returned nothing" from "sensor successfully measured zero."

    **Concept Tested:** None Checks

---

#### 4. What is the difference between a Python list and a tuple, and when should each be used to store sensor readings in a hydroponics controller?

<div class="upper-alpha" markdown>
1. Lists store numbers; tuples store strings — the choice depends on the data type, not mutability
2. Lists are mutable (values can be changed after creation) — use for rolling buffers of readings; tuples are immutable — use for fixed configuration values like pin numbers
3. Tuples are faster for math operations; lists are faster for string operations
4. There is no practical difference — use either interchangeably for all hydroponics data
</div>

??? question "Show Answer"
    The correct answer is **B**. Lists are mutable — elements can be appended, removed, or changed after creation — making them appropriate for rolling buffers of recent sensor readings that update continuously. Tuples are immutable — once created, their values cannot change — making them appropriate for fixed configuration data like hardware pin assignments, alarm threshold pairs, or calibration coefficients that should never be accidentally modified during runtime. Tuples also use slightly less RAM than equivalent lists, a meaningful savings on memory-constrained microcontrollers.

    **Concept Tested:** Collections in MicroPython

---

#### 5. What is the standard main-loop pattern for a MicroPython hydroponics monitoring program, and why is `while True` used rather than a fixed iteration count?

<div class="upper-alpha" markdown>
1. `while True` is used because MicroPython does not support `for` loops with counters
2. `while True` creates an infinite loop that runs continuously until power is removed, which is the correct behavior for an embedded controller that must monitor sensors indefinitely without a user present
3. `while True` pauses the program until sensor data arrives, then processes it and exits
4. `while True` should be avoided — the correct pattern is a function called once per second by the operating system scheduler
</div>

??? question "Show Answer"
    The correct answer is **B**. An embedded hydroponics controller has no defined stopping point — it should read sensors, check conditions, and take actions continuously for as long as it has power. A fixed iteration count would cause the program to exit after completing its loops, leaving the system unmonitored. `while True` with `time.sleep()` inside creates the polling cycle: read sensors → check alarms → log data → wait N seconds → repeat indefinitely. This is the universal pattern for embedded firmware. The program only stops when power is removed or an unhandled exception occurs.

    **Concept Tested:** While True Main Loop

---

#### 6. Why does a MicroPython class for a sensor object (e.g., `class pHSensor`) provide better code organization than a collection of separate functions?

<div class="upper-alpha" markdown>
1. Classes execute faster than functions on MicroPython hardware
2. A class bundles the sensor's state (calibration values, pin number, last reading) with its methods (calibrate, read, validate), ensuring state is always consistent and preventing global variable pollution
3. MicroPython requires classes for all hardware interactions — the machine module does not work with standalone functions
4. Classes automatically handle hardware errors without requiring try/except blocks
</div>

??? question "Show Answer"
    The correct answer is **B**. A sensor class encapsulates: (1) state — the sensor's calibration coefficients, hardware pin or bus reference, and last reading are stored in instance variables rather than global variables; (2) behavior — methods like `calibrate()`, `read()`, and `is_valid()` are grouped with the data they operate on. Without a class, sensor state must be tracked in global variables, which can be accidentally modified from anywhere in the code and become unmanageable as the system grows. Classes provide a clean interface that prevents accidental state corruption.

    **Concept Tested:** Classes and OOP

---

#### 7. What is the REPL in MicroPython and what is its primary use during hydroponics hardware development?

<div class="upper-alpha" markdown>
1. REPL stands for "Remote Error and Peripheral Logger" — it records hardware errors automatically
2. REPL (Read-Eval-Print Loop) is the interactive Python prompt where commands are typed and executed immediately, used for testing sensor wiring, debugging pin assignments, and testing code snippets without uploading full programs
3. REPL is a library for controlling relays and pumps from MicroPython
4. REPL is the process that restarts the Pico automatically after a crash
</div>

??? question "Show Answer"
    The correct answer is **B**. The REPL (Read-Eval-Print Loop) is the interactive prompt accessible via the USB serial connection to the Pico (using Thonny or a serial terminal). In the REPL, a developer can: test if a sensor is wired correctly by importing its library and calling `sensor.read()` immediately; check which I2C devices are present with `i2c.scan()`; test relay control with `relay_pin.value(1)`; and debug individual functions interactively. This eliminates the write-flash-wait cycle for hardware testing — critical in environments where incorrect wiring could damage hardware.

    **Concept Tested:** REPL Usage

---

#### 8. What happens if a MicroPython program on the Pico W encounters an unhandled exception during sensor reading in the main loop?

<div class="upper-alpha" markdown>
1. MicroPython automatically restarts the loop from the beginning, ignoring the error
2. The program crashes and stops executing entirely, leaving pumps, lights, and heaters in whatever state they were in at the moment of the crash
3. The Pico W automatically reboots within 1 second when any exception occurs
4. The exception is logged to the REPL but execution continues on the next loop iteration
</div>

??? question "Show Answer"
    The correct answer is **B**. In MicroPython, an unhandled exception terminates program execution. For a hydroponics controller, this is dangerous: if an I2C sensor read fails with an unhandled exception mid-loop, the main loop stops. A nutrient pump that was turned on before the exception will remain on indefinitely — flooding the grow space. A heater or light that should cycle off will stay on. The correct pattern is to wrap hardware calls in `try/except` blocks so the program catches hardware errors, logs them, and continues the main loop safely rather than crashing.

    **Concept Tested:** Error Handling

---

#### 9. In MicroPython, what is the difference between `import time; time.sleep(5)` and using `asyncio` with `await asyncio.sleep(5)` for timing in a sensor polling loop?

<div class="upper-alpha" markdown>
1. `time.sleep(5)` pauses all execution for 5 seconds; `await asyncio.sleep(5)` pauses only the current coroutine, allowing other tasks (like monitoring a second sensor) to run during the wait
2. `asyncio.sleep` is more accurate than `time.sleep` for timing; time.sleep drifts by several seconds per hour
3. `time.sleep` uses less RAM than asyncio; asyncio is only appropriate for systems with more than 1 MB of RAM
4. Both are identical in behavior on MicroPython — `asyncio` is a CPython-only library
</div>

??? question "Show Answer"
    The correct answer is **A**. `time.sleep(5)` is a blocking call — the entire program halts for 5 seconds, no other code runs during the wait. For a simple single-sensor system this is acceptable. `asyncio.sleep(5)` is non-blocking: it yields control back to the event loop while waiting, allowing other coroutines to execute concurrently. For a multi-sensor hydroponics controller (pH sensor every 30 seconds, temperature every 5 seconds, pump control every second), asyncio enables concurrent polling without spawning threads. MicroPython includes the `asyncio` library for exactly this embedded use case.

    **Concept Tested:** Asyncio vs Time Sleep

---

#### 10. A MicroPython function is written to mix a nutrient solution by opening a pump valve for a calculated number of seconds. What is the most important defensive programming practice to add?

<div class="upper-alpha" markdown>
1. Add a comment explaining what the function does, so other developers understand it
2. Add a maximum timeout guard that forces the valve closed if the hardware timer exceeds the expected duration, preventing flooding if the stop signal fails
3. Use integer seconds only — never float values for valve timing, as floats are imprecise on Pico
4. Log the function call to a file before executing, so crashes can be traced post-incident
</div>

??? question "Show Answer"
    The correct answer is **B**. A pump valve opened without a hardware-enforced maximum timeout is a dangerous design flaw: if the software controlling the valve fails (exception, logic error, program crash) while the valve is open, the valve stays open indefinitely, flooding the grow space or depleting the nutrient reservoir. The correct defensive pattern is a hardware watchdog or a maximum duration guard that closes the valve and raises an alarm if the expected completion signal does not arrive within the calculated time plus a safety margin. Comments and logging are valuable but do not prevent the hardware failure mode.

    **Concept Tested:** Safe Hardware Control Patterns

---
