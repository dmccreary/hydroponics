# Digital Soil and Water Sensors

To teach the value of instant digital sensor tracking versus chemical lab tests (test strips) in a high school hydroponics course using the [Raspberry Pi Pico](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED) and MicroPython, the best approach is to focus on pH and Electrical Conductivity (EC / TDS). These are the two most critical real-time variables in a liquid hydroponics environment.
Unlike a standard single-board Raspberry Pi, the [Raspberry Pi Pico](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED) includes native Analog-to-Digital Converter (ADC) pins (Pins 26, 27, and 28). This allows it to read low-cost, hobbyist-grade analog sensors directly without needing external ADC converter boards. [1, 2, 3] 
Below are excellent low-cost sensor pairings that match your classrooms' setup perfectly.

## 1. The pH Comparison: Analog Sensor Module vs. pH Strips
The goal here is to show students how a chemical test strip provides a broad color change that requires human interpretation, while an electrode sensor provides a precise voltage that fluctuates in real-time as the solution changes.

* The Hardware Option: [DFRobot Gravity: Lab Grade Analog pH Sensor Kit V2](https://www.dfrobot.com/product-1782.html) (approx. $35.00–$40.00).
* How it Works with the [Pico](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED): The kit includes a signal conversion board. Students plug the glass BNC pH probe into the board, and wire the board's analog output pin directly to Pico Pin 26 (ADC0). It is fully compatible with the Pico's 3.3V logic level. [4, 5] 
* The MicroPython Lesson: The [Pico](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED) reads the raw 16-bit analog value (machine.ADC(26).read_u16()). Students write a simple script to map the incoming voltage to a standard 0–14 pH scale. [5, 6] 
* The Strip vs. Sensor Lab Concept: Have students dip a standard paper litmus strip into a nutrient tank. They will have to visually guess whether the color looks like a pH of "6.0" or "7.0". Then, have them drop the analog probe into the tank and open their MicroPython terminal. They will see the digital readout dynamically jump to a highly precise value like 6.18. Students can add a single drop of vinegar (acid) to the water and watch the terminal value drop instantly, highlighting the immediate feedback loop of digital monitoring.

------------------------------
## 2. The Nutrient (EC/TDS) Comparison: Analog TDS Probe vs. Multi-Pad Test Strips
Electrical Conductivity (EC) or Total Dissolved Solids (TDS) measures the strength of the nutrient salts dissolved in the water.

* The Hardware Option: [[CQRobot Ocean: Analog TDS Sensor Meter](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED)](https://www.amazon.com/CQRobot-Ocean-Compatible-Scientific-Laboratory/dp/B08KXRHK7H) (approx. $15.00–$20.00).
* How it Works with the [Pico](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED): This waterproof two-pin probe plugs into a small conditioning board. The board outputs a 0 to 2.3V analog signal, making it incredibly safe for the Pico’s 3.3V ADC inputs. Students wire it to [Pico Pin 27 (ADC1)](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED).
* The MicroPython Lesson: Dissolved salts increase water conductivity. Students use MicroPython to read the raw voltage, calculate the conductivity, and print out the parts-per-million (ppm) value to their screen. [5] 
* The Strip vs. Sensor Lab Concept: Traditional aquarium or agricultural test strips use slow chemical reactions on separate pads to approximate individual nutrients. Have students try to evaluate the solution using strips. Next, have them use the Pico TDS sensor while gradually stirring a gram of water-soluble hydroponic fertilizer into the tank. The terminal will instantly track the climbing ppm count as the fertilizer crystals dissolve. This perfectly demonstrates the engineering value of using continuous, automated data streams to manage an ecosystem.

------------------------------
## Starter MicroPython Routine for Your Classroom
You can hand this baseline script directly to students using Thonny. It prints raw readings from both sensors every second, giving them an instant baseline for calibration: [5, 6] 

import machineimport time
# Define the Pico's native ADC pinsph_sensor = machine.ADC(26)   # Physical Pin 31 on the Picotds_sensor = machine.ADC(27)  # Physical Pin 32 on the Pico

print("--- Classroom Hydroponics Lab Sensor Node Initialized ---")
while True:
    # Read 16-bit digital values (ranges from 0 to 65535)
    raw_ph = ph_sensor.read_u16()
    raw_tds = tds_sensor.read_u16()
    
    # Convert raw data to voltage (Pico ADC baseline is 3.3V)
    ph_voltage = (raw_ph / 65535.0) * 3.3
    tds_voltage = (raw_tds / 65535.0) * 3.3
    
    # Display the instant readings to the terminal
    print("Instant pH Board Voltage: {:.2f}V | Instant TDS Board Voltage: {:.2f}V".format(ph_voltage, tds_voltage))
    
    time.sleep(1.0)

## Lab Logistics Tip
If your students are assembling these on a breadboard, it is a great time to introduce a quick lesson on ground loops. If they submerge both the pH probe and the TDS probe into the exact same small cup of water while powered by the same [Pico](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED), the electrical signal sent out by the TDS probe can distort the tiny voltage generated by the glass pH electrode. Teach students to sample their water in separate test tubes to isolate the sensors, mirroring real laboratory protocol! [7] 
Would you like me to help draft a step-by-step calibration guide for the students to calculate their exact math equations for turning those voltages into true pH numbers?

[1] [https://www.instructables.com](https://www.instructables.com/DIY-Hydroponics-With-Raspberry-Pi/)
[2] [https://industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/selecting-a-ph-sensor-for-arduino-and-raspberry-pi-projects)
[3] [https://www.youtube.com](https://www.youtube.com/watch?v=X_qQDGuyxis)
[4] [https://www.youtube.com](https://www.youtube.com/watch?v=Q7z7Ikmctxg)
[5] [https://www.youtube.com](https://www.youtube.com/watch?v=4ZZqfmevKts&t=445)
[6] [https://www.youtube.com](https://www.youtube.com/watch?v=9lelfdwoKKA&t=61)
[7] [https://www.reddit.com](https://www.reddit.com/r/Hydroponics/comments/wzjbuv/hi_i_am_looking_for_suggestions_for_ec_and_ph/)
