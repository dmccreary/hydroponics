# References: Hardware Interfaces and Sensor Programming

1. [General-purpose input/output](https://en.wikipedia.org/wiki/General-purpose_input/output) - Wikipedia - Explains GPIO pins as configurable digital input/output lines on microcontrollers; covers pull-up/pull-down resistors, voltage levels, and maximum current ratings relevant to relay and sensor wiring.

2. [I²C](https://en.wikipedia.org/wiki/I%C2%B2C) - Wikipedia - Detailed description of the I2C serial protocol including two-wire bus topology, address space, clock stretching, and multi-device addressing used by Atlas Scientific pH/EC modules and SSD1306 OLED displays.

3. [Pulse-width modulation](https://en.wikipedia.org/wiki/Pulse-width_modulation) - Wikipedia - Explains PWM as a method for controlling average power delivered to devices by varying duty cycle; covers applications in speed control of pumps and fans in hydroponic automation systems.

4. Programming the Raspberry Pi Pico/W - Simon Monk - McGraw-Hill - Hands-on chapters on GPIO wiring, ADC sensor reading, I2C device interfacing, PWM motor control, and asyncio-based concurrent sensor polling directly applicable to hydroponic sensor nodes.

5. MicroPython for the Internet of Things - Charles Bell - Apress - Covers DS18B20 one-wire temperature sensing, DHT22 humidity reading, I2C sensor libraries, relay module control, and interrupt-driven event handling in MicroPython on ESP32 hardware.

6. [MicroPython: Machine Module](https://docs.micropython.org/en/latest/library/machine.html) - MicroPython.org - Official API reference for the machine module covering GPIO, ADC, PWM, I2C, SPI, UART, and Timer classes used to interface sensors and actuators in hydroponic systems.

7. [MicroPython: asyncio](https://docs.micropython.org/en/latest/library/asyncio.html) - MicroPython.org - Documentation for MicroPython's asyncio module enabling concurrent sensor polling, timed actuator control, and non-blocking I/O without requiring threads on resource-constrained microcontrollers.

8. [Raspberry Pi Pico Datasheet](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html) - Raspberry Pi Foundation - Full hardware documentation for Pico and Pico W including pin diagrams, ADC specifications, I2C/SPI/UART peripheral mapping, and power requirements for sensor wiring.

9. [Real Python: Object-Oriented Programming](https://realpython.com/python3-object-oriented-programming/) - Real Python - In-depth guide to Python classes and OOP patterns applicable to designing clean, reusable sensor class libraries in MicroPython for pH probes, temperature sensors, and relay controllers.

10. [Khan Academy: Electric Circuits](https://www.khanacademy.org/science/ap-physics-2/ap-circuits-topic) - Khan Academy - Physics of electric circuits including Ohm's law, current, voltage, and resistance — foundational for understanding GPIO current limits, pull-up resistor values, and relay coil drive requirements.
