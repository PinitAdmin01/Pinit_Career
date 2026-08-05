# IoT Wireless Networks & Protocols — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **IoT Wireless Networks & Protocols (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 📶 Course Overview
* **Name**: IoT Wireless Networks & Protocols
* **ID**: `course-iot-network`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Network SDEs / IoT System Architects
* **Learning Interface**: RF spectrum analyzers, packet transmission logs, topology maps, and link budget calculators.
* **Evaluation Sandbox**: Network compilers checking BLE advertising payloads, RSSI signal levels, free space path losses, and CoAP binary codes.

---

## 📅 Detailed Day-by-Day Syllabus

### 📶 Week 1: Wireless Topologies & Link Budget Calculations

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
* **Coding Exam**: `iotnet-basics-exam-day-3` (`getFreeSpaceLoss`)
  - **Task**: Write a JS function `getFreeSpaceLoss(distanceKm, frequencyMhz)` estimating signal path losses.
  - **Test**: `getFreeSpaceLoss(10, 868)` returns ~`111.19`.
* **Coding Assignment**: `iotnet-basics-assign-day-3` (`getLinkMargin`)
  - **Task**: Write a JS function `getLinkMargin(txPower, rxSens, loss)` calculating link margins.
  - **Test**: Deducts path losses and receiver sensitivity from transmission power.

#### 🟢 Day 4: LoRaWAN Spreading Factor durations
* **Lecture Syllabus**:
  - LoRa Spreading Factors (SF7-SF12)
  - Time-on-Air (ToA) variables equations
  - duty cycle transmission limits
* **Coding Exam**: `iotnet-basics-exam-day-4` (`isAirtimeSafe`)
  - **Task**: Write a JS function `isAirtimeSafe(sf, sizeBytes, maxMs)` auditing airtime bounds.
  - **Test**: Blocks spreading factor transfers exceeding maximum millisecond limits.
* **Coding Assignment**: `iotnet-basics-assign-day-4` (`getAirtimeMs`)
  - **Task**: Write a JS function `getAirtimeMs(sf, sizeBytes)` returning transmission time.
  - **Test**: Multiplies bytes by spreading factor scales.

#### 🟢 Day 5: NB-IoT Cellular connection retries
* **Lecture Syllabus**:
  - NB-IoT cellular access loops
  - checking connection attempt parameters
  - preventing battery drain resets
* **Coding Exam**: `iotnet-basics-exam-day-5` (`canRetryConnection`)
  - **Task**: Write a JS function `canRetryConnection(attempt, maxRetry)` gating retry loops.
  - **Test**: Rejects connection attempts exceeding maximum retry limits.
* **Coding Assignment**: `iotnet-basics-assign-day-5` (`getRetriesLeft`)
  - **Task**: Write a JS function `getRetriesLeft(attempt, maxRetry)` finding remaining retries.
  - **Test**: Subtraction parameters check.

#### 🟢 Day 6: LPWAN region whitelisted frequencies
* **Lecture Syllabus**:
  - Regional radio spectrum whitelist regulations
  - LPWAN channel frequency tables
  - Restricted radio band checker
* **Coding Exam**: `iotnet-basics-exam-day-6` (`isFrequencyAllowed`)
  - **Task**: Write a JS function `isFrequencyAllowed(freq, whitelist)` checking regional spectrum tables.
  - **Test**: Confirms target frequencies exist in regional whitelists.
* **Coding Assignment**: `iotnet-basics-assign-day-6` (`isIsmBandRange`)
  - **Task**: Write a JS function `isIsmBandRange(freq, min, max)` verifying ISM band ranges.
  - **Test**: Range bounds validation.

#### 🟢 Day 7: Zigbee Mesh routing hop counts
* **Lecture Syllabus**:
  - Zigbee and Thread mesh topologies
  - Routing hop limits checking
  - Bypassing offline mesh routers
* **Coding Exam**: `iotnet-basics-exam-day-7` (`isHopCountSafe`)
  - **Task**: Write a JS function `isHopCountSafe(hops, limit)` auditing mesh hops.
  - **Test**: Flags routes with hop counts exceeding safety limits.
* **Coding Assignment**: `iotnet-basics-assign-day-7` (`getHopsMargin`)
  - **Task**: Write a JS function `getHopsMargin(hops, limit)` returning remaining hop margins.
  - **Test**: Deducts hop count from limits.

---

### 📶 Week 2: Protocols, MAC layers & WiFi AP allocations

#### 🟢 Day 8: BLE Service UUID16 validators
* **Lecture Syllabus**:
  - BLE Generic Attribute (GATT) profiles
  - UUID ranges (16-bit vs 128-bit)
  - CCCD notification descriptor triggers
* **Coding Exam**: `iotnet-basics-exam-day-8` (`isValidUuid16`)
  - **Task**: Write a JS function `isValidUuid16(uuid)` validating hex profiles.
  - **Test**: Matches 4-character hex patterns.
* **Coding Assignment**: `iotnet-basics-assign-day-8` (`expandUuid`)
  - **Task**: Write a JS function `expandUuid(uuid16)` expanding to 128-bit UUID strings.
  - **Test**: Combines 16-bit parameters with standard base templates.

#### 🟢 Day 9: CoAP Binary Status Code maps
* **Lecture Syllabus**:
  - CoAP response codes specifications
  - Binary byte classifications mapping
  - EVM and UDP client status codes
* **Coding Exam**: `iotnet-basics-exam-day-9` (`getCoapStatus`)
  - **Task**: Write a JS function `getCoapStatus(code)` classifying statuses.
  - **Test**: Translates byte codes into CONTENT or NOT_FOUND labels.
* **Coding Assignment**: `iotnet-basics-assign-day-9` (`getCoapClass`)
  - **Task**: Write a JS function `getCoapClass(code)` finding command classes.
  - **Test**: Divides code values by 32.

#### 🟢 Day 10: BLE Connection Interval constraints
* **Lecture Syllabus**:
  - BLE connection parameters constraints
  - Setting connection interval speed ranges
  - Reducing battery current levels
* **Coding Exam**: `iotnet-basics-exam-day-10` (`isIntervalValid`)
  - **Task**: Write a JS function `isIntervalValid(intervalMs)` auditing latency parameters.
  - **Test**: Limits intervals between 7.5ms and 4000ms bounds.
* **Coding Assignment**: `iotnet-basics-assign-day-10` (`getIntervalMultiplier`)
  - **Task**: Write a JS function `getIntervalMultiplier(intervalMs)` computing timing intervals multipliers.
  - **Test**: Divides values by 1.25.

#### 🟢 Day 11: WiFi Access Point (AP) DHCP Lease Allocator
* **Lecture Syllabus**:
  - WiFi 2.4/5GHz AP client connection limits
  - DHCP dynamic IP addresses pools scaling
  - Handling connection lease limits
* **Coding Exam**: `iotnet-basics-exam-day-11` (`allocateIpAddress`)
  - **Task**: Write a JS function `allocateIpAddress(subnetPrefix, clientIndex, maxClients)` allocating dynamic leases.
  - **Test**: Returns concatenated IP address strings.
* **Coding Assignment**: `iotnet-basics-assign-day-11` (`isSameSubnet`)
  - **Task**: Write a JS function `isSameSubnet(ipA, ipB, subnetPrefix)` verifying subnet scopes.
  - **Test**: Evaluates startsWith prefixes matches.

#### 🟢 Day 12: MQTT Publish/Subscribe Event broker queues
* **Lecture Syllabus**:
  - MQTT publisher/subscriber events pipeline
  - Telemetry broker queue structures
  - Topic filters matching maps
* **Coding Exam**: `iotnet-basics-exam-day-12` (`routeTelemetry`)
  - **Task**: Write a JS function `routeTelemetry(topic, payload, subFilter)` routing telemetries.
  - **Test**: Supports wildcard topic routing matches.
* **Coding Assignment**: `iotnet-basics-assign-day-12` (`getTopicDepth`)
  - **Task**: Write a JS function `getTopicDepth(topic)` calculating topic depths.
  - **Test**: Counts '/' delimiters indices.

#### 🟢 Day 13: MQTT Quality of Service (QoS) Retries
* **Lecture Syllabus**:
  - MQTT QoS delivery guarantees levels (0, 1, 2)
  - Keep-alive timeouts and ping controls
  - Handling QoS message retransmission queues
* **Coding Exam**: `iotnet-basics-exam-day-13` (`shouldRetryMessage`)
  - **Task**: Write a JS function `shouldRetryMessage(qos, ackReceived, ageSec)` auditing retry queues.
  - **Test**: Directs retries for missing QoS 1/2 confirmations.
* **Coding Assignment**: `iotnet-basics-assign-day-13` (`isMessageExpired`)
  - **Task**: Write a JS function `isMessageExpired(ageSec, ttlSec)` checking packet expiries.
  - **Test**: Compares ages against TTL parameters.

#### 🟢 Day 14: Cloud telemetry authentication: SAS Token validity
* **Lecture Syllabus**:
  - Cloud telemetry node registration portals
  - SAS token authentication formats
  - Validating key expiration epochs
* **Coding Exam**: `iotnet-basics-exam-day-14` (`isSasTokenValid`)
  - **Task**: Write a JS function `isSasTokenValid(token, currentEpoch)` checking tokens.
  - **Test**: Checks signature and expiration parameters on incoming links.
* **Coding Assignment**: `iotnet-basics-assign-day-14` (`getTokenLifetimeLeft`)
  - **Task**: Write a JS function `getTokenLifetimeLeft(expiry, currentEpoch)` checking time limits.
  - **Test**: Subtracts values to get remaining lifespan.

---

### 📶 Week 3: Device Twins, DTLS & Energy Budgets

#### 🟢 Day 15: Device Twins synchronization status maps
* **Lecture Syllabus**:
  - Device Twin metadata properties configuration
  - Comparing desired vs reported device states
  - Sync scheduler update triggers
* **Coding Exam**: `iotnet-basics-exam-day-15` (`isDeviceTwinSynced`)
  - **Task**: Write a JS function `isDeviceTwinSynced(desired, reported)` tracking sync status.
  - **Test**: Emits keys that mismatch in cloud sync pipelines.
* **Coding Assignment**: `iotnet-basics-assign-day-15` (`getUnsyncedCount`)
  - **Task**: Write a JS function `getUnsyncedCount(desired, reported)` counting gaps.
  - **Test**: Counts unsynced properties keys.

#### 🟢 Day 16: IoT Security: DTLS Pre-Shared Key (PSK) handshakes
* **Lecture Syllabus**:
  - DTLS protocol session encryption layers
  - Pre-Shared Keys (PSK) formats
  - DTLS handshake sequence verification
* **Coding Exam**: `iotnet-basics-exam-day-16` (`isValidPskLength`)
  - **Task**: Write a JS function `isValidPskLength(keyHex)` checking key lengths.
  - **Test**: Enforces 32 or 64 character hex bounds rules.
* **Coding Assignment**: `iotnet-basics-assign-day-16` (`isHexChar`)
  - **Task**: Write a JS function `isHexChar(char)` checking hex formats.
  - **Test**: Matches hex regex ranges.

#### 🟢 Day 17: Battery management: Sleep cycles & current budgets
* **Lecture Syllabus**:
  - Wireless sleep profiles energy maps
  - Duty-cycle transmission current limits
  - Calculating device battery lifespans
* **Coding Exam**: `iotnet-basics-exam-day-17` (`getRequiredSleepSec`)
  - **Task**: Write a JS function `getRequiredSleepSec(currentBatteryPercent, activeCurrentMa)` choosing sleep cycles.
  - **Test**: Sets longer sleep times when battery drops or currents spike.
* **Coding Assignment**: `iotnet-basics-assign-day-17` (`isPowerBudgetSafe`)
  - **Task**: Write a JS function `isPowerBudgetSafe(dailyMah, limitMah)` checking consumption limits.
  - **Test**: Restricts daily draw to limits.

---

### 📶 Week 4: Capstone Audits & Deployments

#### 🟢 Day 18: Capstone: Production Network Compliance Audit
* **Lecture Syllabus**:
  - Auditing wireless network path losses
  - Checking advertising payload sizes
  - Auditing Device Twin sync states
* **Coding Exam**: `iotnet-basics-exam-day-18` (`evaluateNetworkCompliance`)
  - **Task**: Write a JS function `evaluateNetworkCompliance(report)` verifying network parameters compliance.
  - **Test**: Asserts path losses, device twin updates, and battery checks pass safely.
* **Coding Assignment**: `iotnet-basics-assign-day-18` (`isQualityHealthy`)
  - **Task**: Write a JS function `isQualityHealthy(packetLossPercent)` checking loss parameters.
  - **Test**: Flags when packet losses exceed 2%.

#### 🟢 Day 19: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing path loss link margin budgets
  - Verifying RSSI decibel categories
  - Auditing regional frequencies whitelist
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing spreading factor airtimes
  - Verifying cellular access retries parameters
  - Auditing Zigbee mesh routing hop margins
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing MQTT topic routing logic
  - Verifying QoS retransmission conditions
  - Auditing SAS token expiry timestamps
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing DTLS pre-shared keys lengths
  - Verifying low-power sleep constraints
  - Auditing network packet loss limits
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing total evaluation reports
  - Verifying network communication rules
  - Auditing network release checklist
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Auditing cellular access attempts
  - Verifying Bluetooth service advertising UUIDs
  - Checking CoAP response byte codes
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Auditing DHCP IP address leases
  - Checking MQTT retransmission limits
  - Testing SAS token lifetime metrics
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Checking device twin sync mismatch keys
  - Verifying pre-shared key hex validation rules
  - Auditing daily Mah power consumption limits
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing overall system wireless link viability
  - Checking network gateway configurations
  - Confirming safe network topology joins
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Auditing WiFi client connection ranges
  - Verifying Thread mesh routing depths
  - Testing low-power duty cycles
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Checking MQTT topic filters depth
  - Verifying DTLS session handshake timings
  - Testing CoAP response status classes
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Capstone: Production Network Compliance Audit (Review)
* **Lecture Syllabus**:
  - Compiling final QA wireless network compliance report
  - Checking overall system path loss and battery budget profiles
  - Confirming secure key handshakes and network routing checklist
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
