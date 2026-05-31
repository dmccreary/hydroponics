# References: Networking, IoT, and Advanced MicroPython

1. [MQTT](https://en.wikipedia.org/wiki/MQTT) - Wikipedia - Covers the MQTT publish-subscribe messaging protocol designed for IoT devices with constrained bandwidth; explains brokers, topics, QoS levels, and why MQTT is preferred over HTTP for real-time sensor telemetry.

2. [Internet of Things](https://en.wikipedia.org/wiki/Internet_of_things) - Wikipedia - Overview of IoT architecture including edge devices, gateways, cloud platforms, and data flows; provides context for how hydroponic sensor nodes fit into a full IoT monitoring and control system.

3. [Watchdog timer](https://en.wikipedia.org/wiki/Watchdog_timer) - Wikipedia - Explains hardware and software watchdog timers that automatically reset a microcontroller if it stops responding; essential for building crash-resilient hydroponic automation nodes.

4. MicroPython for the Internet of Things - Charles Bell - Apress - Comprehensive coverage of Wi-Fi connectivity on ESP32, MQTT client implementation, HTTP request handling, NeoPixel control, OLED display drivers, and memory management strategies for long-running IoT applications.

5. Programming the Raspberry Pi Pico/W - Simon Monk - McGraw-Hill - Chapters on Pico W Wi-Fi networking, MQTT sensor data transmission, boot.py and main.py startup sequence, and OTA firmware update patterns for remote hydroponic monitoring systems.

6. [MicroPython: Network Module](https://docs.micropython.org/en/latest/library/network.html) - MicroPython.org - Official documentation for Wi-Fi connection management on ESP32 and Pico W, covering WLAN object configuration, connection state checking, and IP address assignment.

7. [MicroPython: uMQTT Simple](https://github.com/micropython/micropython-lib/tree/master/micropython/umqtt.simple) - MicroPython Library - Source and documentation for the lightweight umqtt.simple MQTT client library used to publish sensor data from MicroPython nodes to broker platforms like Mosquitto and HiveMQ.

8. [Raspberry Pi: Pico W Networking](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html#network) - Raspberry Pi Foundation - Official guide to Wi-Fi setup on the Pico W using MicroPython's network module, including connection examples and troubleshooting for typical IoT connectivity issues.

9. [Real Python: Socket Programming](https://realpython.com/python-sockets/) - Real Python - Tutorial on low-level TCP/UDP socket programming in Python; provides the foundation for understanding how MQTT and HTTP libraries build on top of socket connections in MicroPython.

10. [Python Docs: JSON](https://docs.python.org/3/library/json.html) - Python.org - Official documentation for the JSON encoding/decoding library; MicroPython's ujson module mirrors this API and is used to serialize sensor readings into structured payloads for MQTT transmission.
