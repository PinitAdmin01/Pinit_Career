# IoT Wireless Networks & Protocols — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **IoT Wireless Networks & Protocols (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 📶 Course Overview
* **Name**: IoT Wireless Networks & Protocols
* **ID**: `course-iot-network`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Wireless Network Engineers / IoT Developers / Telecom SDEs
* **Learning Interface**: RF signals gauges, LPWAN airtime sheets, MQTT subscription trees, and network routers tables.
* **Evaluation Sandbox**: Network engines checking Free Space Path Loss equations, LoRa Spreading Factors durations, NB-IoT cellular connection retries, whitelisted regulatory frequencies, MQTT single/multilevel topic wildcard parsers, IP DHCP address pools, and network compliance audits.

---

## 📅 Detailed Day-by-Day Syllabus

### 📶 Week 1: Signal Budgets, Spreading Factors & Spectrum Whitelists

#### 🟢 Day 1: BLE Packet Length & LPWAN Topologies
* **Lecture Syllabus**:
  - LoRaWAN and LPWAN architectures
  - BLE advertising packet limits
  - Narrow-band network topologies
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: RSSI Signal Strength Quality parsing
* **Lecture Syllabus**:
  - RSSI decibel signals indicators
  - Wireless link quality ranges
  - Evaluating antenna signal levels
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Path Loss Link Budget equations
* **Lecture Syllabus**:
  - Free Space Path Loss (FSPL) math
  - Antenna transmission budgets
  - Path loss dB calculations
* **Coding Exam**: `network-basics-exam-day-3` (`getFreeSpaceLoss`)
  - **Task**: Write a JS function `getFreeSpaceLoss(distanceKm, frequencyMhz)` returning propagation decibel losses.
  - **Test**: `getFreeSpaceLoss(10, 868)` matches standard propagation constants equations.
* **Coding Assignment**: `network-basics-assign-day-3` (`getLinkMargin`)
  - **Task**: Write a JS function `getLinkMargin(txPower, rxSens, loss)` checking link budgets.
  - **Test**: Calculates transmission margins subtracting path losses.

#### 🟢 Day 4: LoRaWAN Spreading Factor durations
* **Lecture Syllabus**:
  - LoRa Spreading Factors (SF7-SF12)
  - Time-on-Air (ToA) variables equations
  - duty cycle transmission limits
* **Coding Exam**: `network-basics-exam-day-4` (`isAirtimeSafe`)
  - **Task**: Write a JS function `isAirtimeSafe(sf, sizeBytes, maxMs)` checking packet transmission times.
  - **Test**: Blocks airtime estimates exceeding millisecond bounds.
* **Coding Assignment**: `network-basics-assign-day-4` (`getAirtimeMs`)
  - **Task**: Write a JS function `getAirtimeMs(sf, sizeBytes)` calculating airtime.
  - **Test**: Multiplies bytes sizes factors.

#### 🟢 Day 5: NB-IoT Cellular connection retries
* **Lecture Syllabus**:
  - NB-IoT cellular access loops
  - checking connection attempt parameters
  - preventing battery drain resets
* **Coding Exam**: `network-basics-exam-day-5` (`canRetryConnection`)
  - **Task**: Write a JS function `canRetryConnection(attempt, maxRetry)` checking retries.
  - **Test**: Rejects loop counters matching limit bounds.
* **Coding Assignment**: `network-basics-assign-day-5` (`getRetriesLeft`)
  - **Task**: Write a JS function `getRetriesLeft(attempt, maxRetry)` checking remaining attempts.
  - **Test**: Returns clamped values >= 0.

#### 🟢 Day 6: LPWAN region whitelisted frequencies
* **Lecture Syllabus**:
  - Regional radio spectrum whitelist regulations
  - LPWAN channel frequency tables
  - Restricted radio band checker
* **Coding Exam**: `network-basics-exam-day-6` (`isFrequencyAllowed`)
  - **Task**: Write a JS function `isFrequencyAllowed(freq, whitelist)` checking regional spectrum bands.
  - **Test**: Confirms presence inside authorized array configurations.
* **Coding Assignment**: `network-basics-assign-day-6` (`isIsmBandRange`)
  - **Task**: Write a JS function `isIsmBandRange(freq, min, max)` checking bands limits.
  - **Test**: Validates inclusive bounds.

#### 🟢 Day 7: MQTT Message Protocols: Topic wildcard validation
* **Lecture Syllabus**:
  - MQTT topic hierarchical namespaces
  - Single level plus wildcard operators
  - Multi level hash wildcard configurations
* **Coding Exam**: `network-basics-exam-day-7` (`isTopicMatch`)
  - **Task**: Write a JS function `isTopicMatch(pubTopic, subTopic)` routing MQTT payload targets.
  - **Test**: Evaluates topic path matches and '#' wildcards structures.
* **Coding Assignment**: `network-basics-assign-day-7` (`getSubtopicLevels`)
  - **Task**: Write a JS function `getSubtopicLevels(topic)` parsing path directories.
  - **Test**: Splits hierarchy by slashes counts.

---

### 📶 Week 2: DHCP Address Pools & Gateway compliance Audits

#### 🟢 Day 8: IP Address configuration: DHCP Pool validators
* **Lecture Syllabus**:
  - Ethernet networks DHCP allocations
  - IP address numeric ranges boundaries
  - Subnet gateways defaults targets
* **Coding Exam**: `network-basics-exam-day-8` (`isIpInPool`)
  - **Task**: Write a JS function `isIpInPool(ip, startIp, endIp)` verifying gateway interfaces.
  - **Test**: Compares network prefixes and clamps last octet parameters.
* **Coding Assignment**: `network-basics-assign-day-8` (`isOctetValid`)
  - **Task**: Write a JS function `isOctetValid(num)` auditing IP formats.
  - **Test**: Restricts inputs between 0 and 255.

#### 🟢 Day 9: Final Capstone: IoT network compliance audit
* **Lecture Syllabus**:
  - Wireless links margins scans
  - MQTT routing topics validation
  - IP address pools compliance reviews
* **Coding Exam**: `network-basics-exam-day-9` (`evaluateNetworkBuild`)
  - **Task**: Write a JS function `evaluateNetworkBuild(report)` auditing network layouts.
  - **Test**: Checks link margins, topic routes, and DHCP parameters in report.
* **Coding Assignment**: `network-basics-assign-day-9` (`isLossAcceptable`)
  - **Task**: Write a JS function `isLossAcceptable(lossPct)` checking packet drop rates.
  - **Test**: Validates loss percentage thresholds.

---

### 📶 Week 3: Applied LPWAN Deployments & Routing Reviews

#### 🟢 Day 10: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

---

### 📶 Week 4: Applied LPWAN Deployments & Routing Reviews (Review)

#### 🟢 Day 15: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying gateway routing parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link budgets
  - Assembling wireless compliance checklists
  - Verifying standards validations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: IoT network compliance audit (Review)
* **Lecture Syllabus**:
  - Assemble final IoT wireless networks and protocols gateway configurations report
  - Verify Path Loss equations calculations and Spreading Factors airtimes parameters
  - Confirm MQTT topics wildcards routing and DHCP addresses IP pools allocations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
