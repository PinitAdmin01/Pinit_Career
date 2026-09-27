# IoT, Firmware & Embedded Systems — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **IoT, Firmware & Embedded Systems (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🔌 Course Overview
* **Name**: IoT, Firmware & Embedded Systems
* **ID**: `course-iot-embedded`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Firmware Engineers / Embedded Developers / Hardware SDEs
* **Learning Interface**: Microcontroller pin layouts, ADC registers graphs, RTOS task priorities sheets, and hardware metrics logs.
* **Evaluation Sandbox**: Hardware compilers checking ADC voltage scale translations, PWM brightness percentage duty cycle scaling, sensor moving average filters, GPIO registers pin direction mask builders, consecutive sensor thresholds triggers, RTOS schedulers priority preemptions, and firmware compliance capstone exams.

---

## 📅 Detailed Day-by-Day Syllabus

### 🔌 Week 1: GPIO Registers, ADC Scaling & PWM Actuation

#### 🟢 Day 1: IoT & Embedded Systems Foundations: MCUs & GPIO Pins
* **Lecture Syllabus**:
  - Microcontroller architectures (ESP32, STM32, Arduino Uno)
  - GPIO pin direction registers configurations (Input/Output)
  - Voltage divider math and pin safety limits
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Bare-Metal Programming: main Loops & Interrupt Service Routines (ISRs)
* **Lecture Syllabus**:
  - Microcontroller super-loop design pattern
  - Hardware interrupts and Interrupt Service Routines (ISRs)
  - Configuring system timers and delays
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Analog Interfaces: ADC Bit Resolutions & Voltages Scaling
* **Lecture Syllabus**:
  - Analog-to-Digital Converter properties
  - ADC resolution formulas (8, 10, 12 bits)
  - Scaling voltage percentages
* **Coding Exam**: `embedded-basics-exam-day-3` (`scaleVoltageToAdc`)
  - **Task**: Write a JS function `scaleVoltageToAdc(voltage, maxVoltage, bitResolution)` converting voltage values to digital integers.
  - **Test**: `scaleVoltageToAdc(1.65, 3.3, 12) === 2048`.
* **Coding Assignment**: `embedded-basics-assign-day-3` (`scaleAdcToVoltage`)
  - **Task**: Write a JS function `scaleAdcToVoltage(adcVal, maxVoltage, bitResolution)` converting integer codes to voltage.
  - **Test**: Resolves fractional volts values.

#### 🟢 Day 4: Actuators: PWM Duty Cycle Integer Scalers
* **Lecture Syllabus**:
  - PWM signals parameters
  - Scaling percentage to integer duty cycles
  - Duty cycle bit bounds (8, 16 bits)
* **Coding Exam**: `embedded-basics-exam-day-4` (`getPercentToPwm`)
  - **Task**: Write a JS function `getPercentToPwm(percent, maxPwmValue)` mapping brightness outputs to integer values.
  - **Test**: Checks bounds (0 to maxPwmValue).
* **Coding Assignment**: `embedded-basics-assign-day-4` (`getPwmPercent`)
  - **Task**: Write a JS function `getPwmPercent(pwmVal, maxPwmValue)` converting integers to percentages.
  - **Test**: Returns rounded values.

#### 🟢 Day 5: DSP basics: Sensor Data Window Average smoothing
* **Lecture Syllabus**:
  - Analog voltage noise issues
  - Window average smoothing pipelines
  - Filtering sensor spikes
* **Coding Exam**: `embedded-basics-exam-day-5` (`getSmoothAverage`)
  - **Task**: Write a JS function `getSmoothAverage(values, size)` calculating sliding averages.
  - **Test**: Computes averages from end of arrays.
* **Coding Assignment**: `embedded-basics-assign-day-5` (`filterOutliers`)
  - **Task**: Write a JS function `filterOutliers(values, threshold)` stripping outlier values.
  - **Test**: Emits filtered array values.

#### 🟢 Day 6: Microcontroller Registers: GPIO Pin Direction Mask builders
* **Lecture Syllabus**:
  - GPIO hardware registers structures
  - Pin direction bitmasks configurations
  - configuring safe hardware boot values
* **Coding Exam**: `embedded-basics-exam-day-6` (`isValidGpioMask`)
  - **Task**: Write a JS function `isValidGpioMask(mask, maxPinCount)` checking register bounds.
  - **Test**: Rejects values exceeding pin widths.
* **Coding Assignment**: `embedded-basics-assign-day-6` (`buildPinMask`)
  - **Task**: Write a JS function `buildPinMask(pinIndices)` compiling register configurations.
  - **Test**: Sums indices as powers of 2.

#### 🟢 Day 7: Firmware Safety: Sensor Threshold Trigger logic
* **Lecture Syllabus**:
  - Sensor threshold alerts limits
  - Consecutive alert window counters
  - Debouncing hardware trigger alarms
* **Coding Exam**: `embedded-basics-exam-day-7` (`isAlarmTriggered`)
  - **Task**: Write a JS function `isAlarmTriggered(readings, limit, triggerCount)` evaluating threshold streak triggers.
  - **Test**: Confirms alarms on sequential matches.
* **Coding Assignment**: `embedded-basics-assign-day-7` (`checkSensorAlert`)
  - **Task**: Write a JS function `checkSensorAlert(val, limit)` checking thresholds.
  - **Test**: Returns true if val is greater than limit.

---

### 🔌 Week 2: RTOS task Priority Preemption & compliance Audits

#### 🟢 Day 8: RTOS Schedulers: Task Priority Preemption
* **Lecture Syllabus**:
  - RTOS task scheduler queues
  - Task priority bounds and preemptions
  - Resolving priority inversions gates
* **Coding Exam**: `embedded-basics-exam-day-8` (`shouldPreempt`)
  - **Task**: Write a JS function `shouldPreempt(runningPriority, incomingPriority)` preemption checks.
  - **Test**: Compares priorities values.
* **Coding Assignment**: `embedded-basics-assign-day-8` (`isPriorityValid`)
  - **Task**: Write a JS function `isPriorityValid(priority)` checking priorities parameters.
  - **Test**: Restricts inputs between 0 and 255.

#### 🟢 Day 9: Final Capstone: Firmware & RTOS compliance audit
* **Lecture Syllabus**:
  - Firmware calibration parameters scan
  - GPIO port registry mask verification
  - RTOS task preemptions checks
* **Coding Exam**: `embedded-basics-exam-day-9` (`evaluateFirmwareBuild`)
  - **Task**: Write a JS function `evaluateFirmwareBuild(report)` auditing firmware builds.
  - **Test**: Checks ADCs, registers masks, and RTOS schedules in report.
* **Coding Assignment**: `embedded-basics-assign-day-9` (`isCoveragePassed`)
  - **Task**: Write a JS function `isCoveragePassed(coveragePct)` checking coverage levels.
  - **Test**: Confirms coverage is >= 80%.

---

### 🔌 Week 3: Applied Embedded systems & Telemetry Reviews

#### 🟢 Day 10: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

---

### 🔌 Week 4: Applied Embedded systems & Telemetry Reviews (Review)

#### 🟢 Day 15: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying RTOS scheduling parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing ADC scaling factors
  - Assembling firmware compliance checklists
  - Verifying standards validations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Firmware & RTOS compliance audit (Review)
* **Lecture Syllabus**:
  - Assemble final microcontroller firmware deployments and RTOS scheduling audit report
  - Verify ADC values calculations and GPIO registers bitmasks parameters
  - Confirm RTOS task priorities and consecutive sensors thresholds trigger configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
