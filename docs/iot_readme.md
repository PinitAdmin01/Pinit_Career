# IoT, Firmware & Embedded Systems — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **IoT, Firmware & Embedded Systems (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🔌 Course Overview
* **Name**: IoT, Firmware & Embedded Systems
* **ID**: `course-iot-embedded`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Firmware Engineers / IoT Developers
* **Learning Interface**: Oscilloscope dashboards, pin registers controllers, and telemetry packet logs.
* **Evaluation Sandbox**: Hardware compilers inspecting analog division math, ADC configurations, GPIO register masks, and MQTT buffers.

---

## 📅 Detailed Day-by-Day Syllabus

### 🔌 Week 1: Microcontrollers, GPIO & Signal Processing Foundations

#### 🟢 Day 1: IoT & Embedded Systems Foundations: MCUs & GPIO Pins
* **Lecture Syllabus**:
  - Microcontroller hardware architectures (ESP32, STM32, Arduino Uno)
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
* **Coding Exam**: `iot-basics-exam-day-3` (`scaleVoltageToAdc`)
  - **Task**: Write a JS function `scaleVoltageToAdc(voltage, maxVoltage, bitResolution)` converting voltages to digital scales.
  - **Test**: `scaleVoltageToAdc(1.65, 3.3, 12) === 2048`.
* **Coding Assignment**: `iot-basics-assign-day-3` (`scaleAdcToVoltage`)
  - **Task**: Write a JS function `scaleAdcToVoltage(adcVal, maxVoltage, bitResolution)` translating ADC bits back to voltage scales.
  - **Test**: Multiplies resolution ratios by max voltages.

#### 🟢 Day 4: Actuators: PWM Duty Cycle Integer Scalers
* **Lecture Syllabus**:
  - PWM signals parameters
  - Scaling percentage to integer duty cycles
  - Duty cycle bit bounds (8, 16 bits)
* **Coding Exam**: `iot-basics-exam-day-4` (`getPercentToPwm`)
  - **Task**: Write a JS function `getPercentToPwm(percent, maxPwmValue)` mapping brightness percent to duty cycle integers.
  - **Test**: Clamps overrange percent entries to maxPwmValue.
* **Coding Assignment**: `iot-basics-assign-day-4` (`getPwmPercent`)
  - **Task**: Write a JS function `getPwmPercent(pwmVal, maxPwmValue)` extracting percentage.
  - **Test**: Calculates percent representation.

#### 🟢 Day 5: DSP basics: Sensor Data Window Average smoothing
* **Lecture Syllabus**:
  - Analog voltage noise issues
  - Window average smoothing pipelines
  - Filtering sensor spikes
* **Coding Exam**: `iot-basics-exam-day-5` (`getSmoothAverage`)
  - **Task**: Write a JS function `getSmoothAverage(values, size)` averaging the latest sliding arrays elements.
  - **Test**: Computes averages over size bounds.
* **Coding Assignment**: `iot-basics-assign-day-5` (`filterOutliers`)
  - **Task**: Write a JS function `filterOutliers(values, threshold)` discarding spikes.
  - **Test**: Trims out outlier data.

#### 🟢 Day 6: Microcontroller Registers: GPIO Pin Direction Mask builders
* **Lecture Syllabus**:
  - GPIO hardware registers structures
  - Pin direction bitmasks configurations
  - configuring safe hardware boot values
* **Coding Exam**: `iot-basics-exam-day-6` (`isValidGpioMask`)
  - **Task**: Write a JS function `isValidGpioMask(mask, maxPinCount)` checking mask ranges.
  - **Test**: Returns false if mask overflows bounds.
* **Coding Assignment**: `iot-basics-assign-day-6` (`buildPinMask`)
  - **Task**: Write a JS function `buildPinMask(pinIndices)` compounding pin indices powers.
  - **Test**: Accumulates powers of 2.

#### 🟢 Day 7: Firmware Safety: Sensor Threshold Trigger logic
* **Lecture Syllabus**:
  - Debouncing threshold signals
  - State checks and consecutive loops
  - Preventing hardware false alarms
* **Coding Exam**: `iot-basics-exam-day-7` (`shouldTriggerAlert`)
  - **Task**: Write a JS function `shouldTriggerAlert(values, threshold, consecutiveLimit)` auditing consecutive excursions.
  - **Test**: Fires alarm if latest consecutive limit values exceed threshold.
* **Coding Assignment**: `iot-basics-assign-day-7` (`countExcursions`)
  - **Task**: Write a JS function `countExcursions(values, threshold)` counting excursions.
  - **Test**: Returns count.

---

### 🔌 Week 2: Communication Protocols & Telemetry Networking

#### 🟢 Day 8: Communication Protocols: UART & Serial Packets
* **Lecture Syllabus**:
  - Serial communication fundamentals (UART, RS-232)
  - Baud rates and bit timing equations
  - Frame sync markers (Start/Stop bytes)
* **Coding Exam**: `iot-basics-exam-day-8` (`frameSerialPacket`)
  - **Task**: Write a JS function `frameSerialPacket(payload)` wrapping payloads with start/stop markers.
  - **Test**: Returns payload wrapped in brackets, e.g. `[DATA]`.
* **Coding Assignment**: `iot-basics-assign-day-8` (`deframerPacket`)
  - **Task**: Write a JS function `deframerPacket(packet)` extracting payload between start/stop markers.
  - **Test**: Extracts telemetry values safely.

#### 🟢 Day 9: I2C & SPI: Hardware Bus Addresses scan
* **Lecture Syllabus**:
  - I2C bus operations (SDA, SCL lines)
  - SPI bus operations (MOSI, MISO, SCK, CS)
  - Addressing and scanning external I2C chips
* **Coding Exam**: `iot-basics-exam-day-9` (`scanI2cBus`)
  - **Task**: Write a JS function `scanI2cBus(pingFn, startAddr, endAddr)` scanning devices addresses.
  - **Test**: Registers responsive addresses in range.
* **Coding Assignment**: `iot-basics-assign-day-9` (`isValidI2cAddr`)
  - **Task**: Write a JS function `isValidI2cAddr(addr)` validating addresses.
  - **Test**: Limits checks to 0x08 - 0x77 bounds.

#### 🟢 Day 10: MQTT Client ID Validations
* **Lecture Syllabus**:
  - MQTT client identifier structures
  - Validating prefixes inside brokers
  - Regex formatting connection tags
* **Coding Exam**: `iot-basics-exam-day-10` (`isValidClientId`)
  - **Task**: Write a JS function `isValidClientId(id)` validating broker connection keys.
  - **Test**: Enforces `pinit-` prefix with alphanumeric parameters checks.
* **Coding Assignment**: `iot-basics-assign-day-10` (`formatClientId`)
  - **Task**: Write a JS function `formatClientId(macAddress)` stripping MAC colons.
  - **Test**: Returns clean broker strings.

#### 🟢 Day 11: MQTT Topics: Telemetry Publishers & Subscribers
* **Lecture Syllabus**:
  - MQTT publish/subscribe mechanisms
  - Wildcard path subscriptions (single + vs multi # level)
  - Structuring hierarchical topic namespaces
* **Coding Exam**: `iot-basics-exam-day-11` (`isTopicMatch`)
  - **Task**: Write a JS function `isTopicMatch(filter, topic)` matching topics using wildcards.
  - **Test**: Evaluates topic segment matches.
* **Coding Assignment**: `iot-basics-assign-day-11` (`isValidMqttTopic`)
  - **Task**: Write a JS function `isValidMqttTopic(topic)` validating topic names.
  - **Test**: Drops wildcard characters during direct topics setups.

#### 🟢 Day 12: MQTT Quality of Service (QoS) & Session State
* **Lecture Syllabus**:
  - MQTT QoS levels (0: At most once, 1: At least once, 2: Exactly once)
  - Session flags (Clean Session vs Persistent Session)
  - Message delivery acknowledgments (PUBACK, PUBREC)
* **Coding Exam**: `iot-basics-exam-day-12` (`getQosRequired`)
  - **Task**: Write a JS function `getQosRequired(priority)` selecting QoS levels.
  - **Test**: Maps high-priority telemetry to QoS 1 or 2.
* **Coding Assignment**: `iot-basics-assign-day-12` (`shouldResetSession`)
  - **Task**: Write a JS function `shouldResetSession(isOfflineAvailable)` checking session cleanups flags.
  - **Test**: Audits persistence flags.

#### 🟢 Day 13: CoAP protocol: UDP telemetries serialization
* **Lecture Syllabus**:
  - CoAP light architecture layers
  - UDP packet framing templates
  - CoAP request codes maps
* **Coding Exam**: `iot-basics-exam-day-13` (`parseCoapCode`)
  - **Task**: Write a JS function `parseCoapCode(codeByte)` decoding request bytes.
  - **Test**: Translates integers to GET/POST commands.
* **Coding Assignment**: `iot-basics-assign-day-13` (`isCoapDefaultPort`)
  - **Task**: Write a JS function `isCoapDefaultPort(port)` verifying CoAP network ports.
  - **Test**: Validates 5683 and 5684 port limits.

#### 🟢 Day 14: RTOS basics: Task Schedulers & Priorities
* **Lecture Syllabus**:
  - FreeRTOS task schedulers patterns
  - Allocating task CPU priority weights
  - Preemption vs Cooperative runtime models
* **Coding Exam**: `iot-basics-exam-day-14` (`getHigherPriorityTask`)
  - **Task**: Write a JS function `getHigherPriorityTask(taskA, taskB)` prioritizing scheduler tasks.
  - **Test**: Returns task with higher priority index values.
* **Coding Assignment**: `iot-basics-assign-day-14` (`isStarving`)
  - **Task**: Write a JS function `isStarving(priority, activeThreshold)` scanning for starved tasks.
  - **Test**: Flags tasks whose priorities drop below active limit checks.

---

### 🔌 Week 3: RTOS Scheduling, Synchronization & Threading

#### 🟢 Day 15: RTOS Mutexes & Semaphores: Resource Lockups
* **Lecture Syllabus**:
  - RTOS Semaphores for task signaling
  - Mutex locks for resource sharing
  - Detecting and avoiding deadlock conditions
* **Coding Exam**: `iot-basics-exam-day-15` (`canAcquireLock`)
  - **Task**: Write a JS function `canAcquireLock(mutexState)` verifying lock availability.
  - **Test**: Resolves lock status parameters.
* **Coding Assignment**: `iot-basics-assign-day-15` (`isDeadlockPossible`)
  - **Task**: Write a JS function `isDeadlockPossible(locksHeldByA, locksRequiredByA, locksHeldByB, locksRequiredByB)` tracking resource deadlock cycles.
  - **Test**: Evaluates circular dependency overlaps.

#### 🟢 Day 16: RTOS Message Queues: Thread communication
* **Lecture Syllabus**:
  - RTOS message queues structures
  - Safe thread communication patterns
  - Handling queue overflow conditions
* **Coding Exam**: `iot-basics-exam-day-16` (`isQueueFull`)
  - **Task**: Write a JS function `isQueueFull(currentSize, maxCapacity)` verifying queue limits.
  - **Test**: Flags when size matches maximum capacity parameters.
* **Coding Assignment**: `iot-basics-assign-day-16` (`getRemainingSlots`)
  - **Task**: Write a JS function `getRemainingSlots(currentSize, maxCapacity)` checking space.
  - **Test**: Computes index differences.

#### 🟢 Day 17: Watchdog Timers: System Recovery and Resets
* **Lecture Syllabus**:
  - Watchdog timer (WDT) hardware basics
  - Kicking/feeding the watchdog inside loops
  - Diagnosing software lockups and recovery
* **Coding Exam**: `iot-basics-exam-day-17` (`shouldResetSystem`)
  - **Task**: Write a JS function `shouldResetSystem(lastKickMs, currentMs, timeoutMs)` auditing watchdog status.
  - **Test**: Triggers reboots when loops lag beyond watchdog intervals.
* **Coding Assignment**: `iot-basics-assign-day-17` (`logWatchdogKick`)
  - **Task**: Write a JS function `logWatchdogKick(currentMs)` formatting event timestamps logs.
  - **Test**: Assembles watchdog ping logs.

#### 🟢 Day 18: Firmware Flash Memory storage & Wear leveling
* **Lecture Syllabus**:
  - NAND/NOR flash write cycle limits
  - Wear leveling algorithms and block sector reuse
  - Non-Volatile Storage (NVS) libraries config
* **Coding Exam**: `iot-basics-exam-day-18` (`shouldRetireSector`)
  - **Task**: Write a JS function `shouldRetireSector(writeCount, maxCycles)` auditing sector wear.
  - **Test**: Retires sectors approaching flash wear cycles limits.
* **Coding Assignment**: `iot-basics-assign-day-18` (`getNextWearBlock`)
  - **Task**: Write a JS function `getNextWearBlock(currentBlock, totalBlocks)` rotating write target indexes.
  - **Test**: Applies wear rotation offsets math.

#### 🟢 Day 19: Firmware Security: Secure Boot & Cryptography
* **Lecture Syllabus**:
  - Secure boot stages and public key signature checks
  - AES and SHA-256 integrity checks
  - Secure key storage guidelines
* **Coding Exam**: `iot-basics-exam-day-19` (`isSignatureAuthentic`)
  - **Task**: Write a JS function `isSignatureAuthentic(calculatedHash, signatureHash)` validating boot codes.
  - **Test**: Confirms firmware hash signatures match authentic credentials.
* **Coding Assignment**: `iot-basics-assign-day-19` (`isValidHashLength`)
  - **Task**: Write a JS function `isValidHashLength(hash)` checking SHA-256 strings.
  - **Test**: Validates 64-character hex bounds.

#### 🟢 Day 20: OTA firmware Updates & Version Rollbacks
* **Lecture Syllabus**:
  - OTA boot partition tables
  - Validating version headers
  - Safe rollback protocols
* **Coding Exam**: `iot-basics-exam-day-20` (`isOtaVersionAllowed`)
  - **Task**: Write a JS function `isOtaVersionAllowed(currentVer, newVer)` checking upgrade numbers.
  - **Test**: Restricts updates to newer version IDs.
* **Coding Assignment**: `iot-basics-assign-day-20` (`getOtaStateLabel`)
  - **Task**: Write a JS function `getOtaStateLabel(state)` mapping partition modes.
  - **Test**: Returns RUNNING, VERIFIED, or ROLLBACK state strings.

#### 🟢 Day 21: Power management: Sleep Modes & Energy optimization
* **Lecture Syllabus**:
  - Sleep modes profiles (Active, Light Sleep, Deep Sleep)
  - RTC timer and GPIO wakeup sources
  - Calculating battery lifespans
* **Coding Exam**: `iot-basics-exam-day-21` (`calculateBatteryLifespan`)
  - **Task**: Write a JS function `calculateBatteryLifespan(capacityMah, activeMa, sleepMa, activeTimePercent)` checking energy budgets.
  - **Test**: Formulates lifetime equations based on duty cycles.
* **Coding Assignment**: `iot-basics-assign-day-21` (`shouldEnterDeepSleep`)
  - **Task**: Write a JS function `shouldEnterDeepSleep(inactiveDurationSec)` mapping sleep parameters.
  - **Test**: Flags deep sleep for inactive intervals.

---

### 🔌 Week 4: Production Quality & Capstone Audits

#### 🟢 Day 22: Capstone: Production Firmware Compliance Audit
* **Lecture Syllabus**:
  - Auditing ADC and scale configurations
  - Checking packet framing boundaries
  - Auditing watchdog reset timings
* **Coding Exam**: `iot-basics-exam-day-22` (`evaluateFirmwareCompliance`)
  - **Task**: Write a JS function `evaluateFirmwareCompliance(report)` checking firmware safety flags.
  - **Test**: Asserts ADC checks, watchdog status, and boot validations.
* **Coding Assignment**: `iot-basics-assign-day-22` (`isBootFailure`)
  - **Task**: Write a JS function `isBootFailure(bootStatus)` identifying crash signs.
  - **Test**: Detects critical panics and boot crash logs.

#### 🟢 Day 23: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing secure boot configurations
  - Verifying memory bounds calibrations
  - Auditing sensor parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing bus address scanning ranges
  - Verifying serial frame boundaries
  - Auditing watchdog parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing MQTT topic namespaces
  - Verifying CoAP packet formats
  - Auditing mutex states
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing flash wear limits
  - Verifying OTA upgrade paths
  - Auditing sleep modes battery budgets
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing total evaluation reports
  - Verifying system safety parameters
  - Auditing firmware release checklist
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Verifying RTOS queue limits
  - Checking I2C device presence
  - Checking low-power schedules
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Auditing secure signature hashes
  - Checking serial frame sync markers
  - Testing telemetry QoS parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Capstone: Production Firmware Compliance Audit (Review)
* **Lecture Syllabus**:
  - Compiling final QA hardware compliance report
  - Checking overall system watchdog and battery budget profiles
  - Confirming secure boot and OTA rollbacks checklist
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
