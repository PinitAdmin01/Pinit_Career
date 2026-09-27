# Industrial IoT Security & Device Lifecycle — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Industrial IoT Security & Device Lifecycle (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🔒 Course Overview
* **Name**: Industrial IoT Security & Device Lifecycle
* **ID**: `course-iot-security`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: IoT Security Engineers / Firmware Auditors
* **Learning Interface**: Bootloader signature trace outputs, encrypted communication feeds, anti-rollback version logs, and TLS certificate trees.
* **Evaluation Sandbox**: Security compilers checking secure boot public key hashes, symmetric AES initialization vectors, anti-rollback firmware upgrades, and HSM key slots.

---

## 📅 Detailed Day-by-Day Syllabus

### 🔒 Week 1: Secure Boot & Hardware Root of Trust

#### 🟢 Day 1: Introduction to Hardware Root of Trust & Boot Security
* **Lecture Syllabus**:
  - Hardware Root of Trust concepts
  - Secure boot signature chains
  - Detecting bootloader signature anomalies
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Symmetric Encryption block alignments & AES IV parameters
* **Lecture Syllabus**:
  - Symmetric encryption algorithms (AES-128)
  - Initialization Vector (IV) parameters
  - Cipher block alignments
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: HSM Key slot limitations & Secure Storage
* **Lecture Syllabus**:
  - HSM slots configuration
  - Credential keys storage
  - verifying slots capacities
* **Coding Exam**: `iotsec-basics-exam-day-3` (`isSlotAvailable`)
  - **Task**: Write a JS function `isSlotAvailable(slotIndex, maxSlots)` checking HSM slots boundaries.
  - **Test**: `isSlotAvailable(5, 16) === true`.
* **Coding Assignment**: `iotsec-basics-assign-day-3` (`getSlotsLeft`)
  - **Task**: Write a JS function `getSlotsLeft(activeCount, maxSlots)` calculating remaining capacity.
  - **Test**: Returns remaining slots.

#### 🟢 Day 4: Bootloader signatures & public key verification
* **Lecture Syllabus**:
  - Secure bootloader signatures verification
  - Firmware verification structures
  - detecting payload anomalies checks
* **Coding Exam**: `iotsec-basics-exam-day-4` (`isBootSignatureValid`)
  - **Task**: Write a JS function `isBootSignatureValid(signature, expectedSig)` auditing signature matches.
  - **Test**: Checks non-empty matching signature strings.
* **Coding Assignment**: `iotsec-basics-assign-day-4` (`isSignatureLengthAllowed`)
  - **Task**: Write a JS function `isSignatureLengthAllowed(sig, targetLen)` verifying length.
  - **Test**: Returns true if string length matches targets.

#### 🟢 Day 5: ECC Public Key coordinate formatting checks
* **Lecture Syllabus**:
  - ECC key formatting constraints
  - ECC public keys coordinate audits
  - verifying cryptographic coordinates sizes
* **Coding Exam**: `iotsec-basics-exam-day-5` (`isValidEccKey`)
  - **Task**: Write a JS function `isValidEccKey(key)` checking key prefixes.
  - **Test**: Confirms 66-length hex string checks starting with '04'.
* **Coding Assignment**: `iotsec-basics-assign-day-5` (`isUncompressedKey`)
  - **Task**: Write a JS function `isUncompressedKey(key)` checking formats.
  - **Test**: Flags when key starts with uncompressed prefix.

#### 🟢 Day 6: Physical Security: Anti-tamper alerts tracking
* **Lecture Syllabus**:
  - Active copper trace anti-tamper wires
  - Physical chassis intrusion logs
  - Triggering credential wiping loops
* **Coding Exam**: `iotsec-basics-exam-day-6` (`isTamperTriggered`)
  - **Task**: Write a JS function `isTamperTriggered(pinVal, threshold)` parsing sensor values.
  - **Test**: Flags when voltages exceed trigger thresholds.
* **Coding Assignment**: `iotsec-basics-assign-day-6` (`classifyTamper`)
  - **Task**: Write a JS function `classifyTamper(level)` classifying alerts.
  - **Test**: Emits WARNING or CRITICAL labels.

#### 🟢 Day 7: Memory Protection: ROM code checksum integrity audits
* **Lecture Syllabus**:
  - ROM code checksum equations
  - factory target memory values
  - hardware verification loops
* **Coding Exam**: `iotsec-basics-exam-day-7` (`isRomValid`)
  - **Task**: Write a JS function `isRomValid(checksum, target)` checking checksums.
  - **Test**: Confirms match with positive targets.
* **Coding Assignment**: `iotsec-basics-assign-day-7` (`getRomSizeMargin`)
  - **Task**: Write a JS function `getRomSizeMargin(usedBytes, maxBytes)` checking sizes.
  - **Test**: Returns subtraction limits.

---

### 🔒 Week 2: OTA Upgrades & Dual Partition A/B Selectors

#### 🟢 Day 8: OTA firmware package checksum validations
* **Lecture Syllabus**:
  - Dual-partition A/B layouts
  - OTA package checksum verification
  - wiping corrupted payload files
* **Coding Exam**: `iotsec-basics-exam-day-8` (`verifyChecksum`)
  - **Task**: Write a JS function `verifyChecksum(payload, expectedHash)` validating packages.
  - **Test**: Appends hashed string flags, checking targets.
* **Coding Assignment**: `iotsec-basics-assign-day-8` (`generateMockHash`)
  - **Task**: Write a JS function `generateMockHash(payload)` generating mock signatures.
  - **Test**: Appends '-hashed' string checks.

#### 🟢 Day 9: Anti-rollback firmware version checks
* **Lecture Syllabus**:
  - OTA version upgrade logic
  - Anti-rollback security parameters
  - verifying firmware builds versions
* **Coding Exam**: `iotsec-basics-exam-day-9` (`isVersionUpgrade`)
  - **Task**: Write a JS function `isVersionUpgrade(currentVer, newVer)` preventing downgrades.
  - **Test**: Rejects version updates lower than active versions.
* **Coding Assignment**: `iotsec-basics-assign-day-9` (`isVersionEqual`)
  - **Task**: Write a JS function `isVersionEqual(v1, v2)` comparing versions.
  - **Test**: returns equality check.

#### 🟢 Day 10: Dual partition boot selectors & Active-inactive state flags
* **Lecture Syllabus**:
  - Dual partition boot loaders
  - Active-inactive status selectors
  - writing boot status logs
* **Coding Exam**: `iotsec-basics-exam-day-10` (`getActiveSlot`)
  - **Task**: Write a JS function `getActiveSlot(slotAState, slotBState)` selecting boot targets.
  - **Test**: Returns recovery state if both partition checksums are bad.
* **Coding Assignment**: `iotsec-basics-assign-day-10` (`isRecoveryNeeded`)
  - **Task**: Write a JS function `isRecoveryNeeded(slotA, slotB)` flagging recoveries.
  - **Test**: Triggers recovery if active boot fails.

#### 🟢 Day 11: Diagnostics checks & boot success thresholds
* **Lecture Syllabus**:
  - Monitoring startup sequence limits
  - Evaluating hardware diagnostic logs
  - Checking hardware boot errors
* **Coding Exam**: `iotsec-basics-exam-day-11` (`isBootSuccessful`)
  - **Task**: Write a JS function `isBootSuccessful(attempts, maxAttempts, diagnosticCode)` checking status.
  - **Test**: Checks diagnostic code matches 'SUCCESS' and attempts are below boundaries.
* **Coding Assignment**: `iotsec-basics-assign-day-11` (`getBootAttemptsLeft`)
  - **Task**: Write a JS function `getBootAttemptsLeft(attempts, maxAttempts)` finding remaining attempts.
  - **Test**: Subtracts values to get margins.

#### 🟢 Day 12: OTA upgrade packet timeout thresholds
* **Lecture Syllabus**:
  - OTA packet transmission limits
  - Session recovery timeouts checking
  - Preventing half-upgraded states
* **Coding Exam**: `iotsec-basics-exam-day-12` (`isUpgradeTimeout`)
  - **Task**: Write a JS function `isUpgradeTimeout(elapsedSec, limitSec)` checking timeouts.
  - **Test**: Flags when download durations exceed limits.
* **Coding Assignment**: `iotsec-basics-assign-day-12` (`getTimeoutProgress`)
  - **Task**: Write a JS function `getTimeoutProgress(elapsed, limit)` finding elapsed percentages.
  - **Test**: Computes rounded ratios, clamping to 100%.

#### 🟢 Day 13: Firmware package size limits check
* **Lecture Syllabus**:
  - Flash partition limits check
  - Structuring firmware header sectors
  - Validating package size parameters
* **Coding Exam**: `iotsec-basics-exam-day-13` (`isPackageSizeAllowed`)
  - **Task**: Write a JS function `isPackageSizeAllowed(packageBytes, flashBytes)` checking partition sizes.
  - **Test**: Restricts firmware sizes below flash storage capacities.
* **Coding Assignment**: `iotsec-basics-assign-day-13` (`getFlashBytesLeft`)
  - **Task**: Write a JS function `getFlashBytesLeft(used, total)` finding space.
  - **Test**: Returns differences.

#### 🟢 Day 14: Certificate expiration epoch validation
* **Lecture Syllabus**:
  - X.509 certificate formats
  - Validating security certificate lifespans
  - Checking expiration epoch timelines
* **Coding Exam**: `iotsec-basics-exam-day-14` (`isCertExpired`)
  - **Task**: Write a JS function `isCertExpired(expiryEpoch, currentEpoch)` checking certificates.
  - **Test**: Flags expired certificates based on epoch timestamps.
* **Coding Assignment**: `iotsec-basics-assign-day-14` (`getExpiryMargin`)
  - **Task**: Write a JS function `getExpiryMargin(expiry, current)` finding remaining time.
  - **Test**: Subtracts current time, clamping to 0.

---

### 🔒 Week 3: Encrypted Communication & TLS handshake parameters

#### 🟢 Day 15: TLS Handshake: Cipher suite whitelists mapping
* **Lecture Syllabus**:
  - TLS handshake stages
  - Cipher suite whitelists checking
  - Restricting weak encryption algorithms
* **Coding Exam**: `iotsec-basics-exam-day-15` (`isCipherSupported`)
  - **Task**: Write a JS function `isCipherSupported(cipher, allowedList)` checking cipher suites.
  - **Test**: Confirms cipher suites exist in allowed lists.
* **Coding Assignment**: `iotsec-basics-assign-day-15` (`getCipherListSize`)
  - **Task**: Write a JS function `getCipherListSize(allowedList)` counting suites.
  - **Test**: Reports array lengths.

#### 🟢 Day 16: CA Certificate chain path validators
* **Lecture Syllabus**:
  - Root, Intermediate, and Leaf CAs
  - Verifying signature paths validation
  - Trust store anchor lookups
* **Coding Exam**: `iotsec-basics-exam-day-16` (`isCertChainValid`)
  - **Task**: Write a JS function `isCertChainValid(chainArray)` checking validation structures.
  - **Test**: Asserts chain arrays are non-empty and every element is a valid string.
* **Coding Assignment**: `iotsec-basics-assign-day-16` (`getChainDepth`)
  - **Task**: Write a JS function `getChainDepth(chainArray)` finding trust depths.
  - **Test**: Reports array sizes.

#### 🟢 Day 17: Public Key encryption key length constraints
* **Lecture Syllabus**:
  - RSA and ECC key parameters
  - Auditing public key bit sizes
  - Restricting weak cryptosystems
* **Coding Exam**: `iotsec-basics-exam-day-17` (`isKeyLengthSafe`)
  - **Task**: Write a JS function `isKeyLengthSafe(algorithm, bitLength)` auditing keys.
  - **Test**: Restricts RSA keys below 2048-bit and ECC keys below 256-bit.
* **Coding Assignment**: `iotsec-basics-assign-day-17` (`getMinKeyLength`)
  - **Task**: Write a JS function `getMinKeyLength(algorithm)` finding limits.
  - **Test**: Returns 2048 for RSA and 256 for ECC.

#### 🟢 Day 18: MQTT TLS Port configuration checkers
* **Lecture Syllabus**:
  - Securing transport layers ports
  - Encrypted MQTTS connection parameters
  - Classifying secure port parameters
* **Coding Exam**: `iotsec-basics-exam-day-18` (`isSecurePort`)
  - **Task**: Write a JS function `isSecurePort(port, protocol)` checking ports.
  - **Test**: Restricts secure protocols to secure ports (e.g. 8883 for MQTTS).
* **Coding Assignment**: `iotsec-basics-assign-day-18` (`getStandardSecurePort`)
  - **Task**: Write a JS function `getStandardSecurePort(protocol)` selecting secure ports.
  - **Test**: Maps secure port values.

#### 🟢 Day 19: TRNG Session Key cryptographic entropy audits
* **Lecture Syllabus**:
  - True Random Number Generators (TRNG)
  - Cryptographic entropy source checks
  - Validating session keys randomness
* **Coding Exam**: `iotsec-basics-exam-day-19` (`isEntropySufficient`)
  - **Task**: Write a JS function `isEntropySufficient(entropyBits, minRequired)` validating session keys.
  - **Test**: Flags weak keys falling below entropy standards.
* **Coding Assignment**: `iotsec-basics-assign-day-19` (`getEntropyMargin`)
  - **Task**: Write a JS function `getEntropyMargin(entropy, limit)` finding entropy margins.
  - **Test**: Subtracts values to get margins.

#### 🟢 Day 20: Firmware header magic bytes checkers
* **Lecture Syllabus**:
  - Firmware package header metadata formats
  - Structuring magic bytes check fields
  - Validating header integrity fields
* **Coding Exam**: `iotsec-basics-exam-day-20` (`isValidHeader`)
  - **Task**: Write a JS function `isValidHeader(headerHex)` checking headers.
  - **Test**: Enforces magic byte prefixes check, rejecting empty inputs.
* **Coding Assignment**: `iotsec-basics-assign-day-20` (`stripHeaderMagic`)
  - **Task**: Write a JS function `stripHeaderMagic(headerHex)` stripping magic bytes prefixes.
  - **Test**: Trims out leading '5F'.

#### 🟢 Day 21: Device Lifecycle State transition checkers
* **Lecture Syllabus**:
  - Device lifecycle phases (Manufactured, Provisioned, Active, Suspended, Decommissioned)
  - Transition state controls
  - Restricting illegal state changes
* **Coding Exam**: `iotsec-basics-exam-day-21` (`isValidTransition`)
  - **Task**: Write a JS function `isValidTransition(fromState, toState)` checking transition rules.
  - **Test**: Blocks transitions from decommissioned states.
* **Coding Assignment**: `iotsec-basics-assign-day-21` (`isDecommissioned`)
  - **Task**: Write a JS function `isDecommissioned(state)` flagging final phases.
  - **Test**: Returns state matches.

---

### 🔒 Week 4: Security Audits & Capstone Lifecycle Scanners

#### 🟢 Day 22: CRL: Revoked certificates lists check
* **Lecture Syllabus**:
  - Certificate Revocation Lists (CRL)
  - Querying certificate serial parameters
  - Checking revoked certificates lists
* **Coding Exam**: `iotsec-basics-exam-day-22` (`isCertRevoked`)
  - **Task**: Write a JS function `isCertRevoked(serial, crlArray)` auditing certificate states.
  - **Test**: Checks if certificate serials exist in CRL arrays.
* **Coding Assignment**: `iotsec-basics-assign-day-22` (`isCrlEmpty`)
  - **Task**: Write a JS function `isCrlEmpty(crlArray)` checking sizes.
  - **Test**: Evaluates list emptiness.

#### 🟢 Day 23: Dynamic Key Rotation warning limits
* **Lecture Syllabus**:
  - Security key expiry cycles
  - Warning notification timers
  - Dynamic key rotation routines
* **Coding Exam**: `iotsec-basics-exam-day-23` (`isRotationRequired`)
  - **Task**: Write a JS function `isRotationRequired(daysRemaining, thresholdDays)` auditing keys.
  - **Test**: Flags when remaining days drop below thresholds.
* **Coding Assignment**: `iotsec-basics-assign-day-23` (`getRotationMargin`)
  - **Task**: Write a JS function `getRotationMargin(days, limit)` finding limits.
  - **Test**: Returns subtraction values.

#### 🟢 Day 24: Security Event Log severity filters
* **Lecture Syllabus**:
  - Log level classifications (INFO, WARNING, CRITICAL)
  - Security event logging rules
  - Filtering security logs lists
* **Coding Exam**: `iotsec-basics-exam-day-24` (`filterSecurityLogs`)
  - **Task**: Write a JS function `filterSecurityLogs(logs, minSeverity)` filtering logs.
  - **Test**: Evaluates severity properties inside logs array.
* **Coding Assignment**: `iotsec-basics-assign-day-24` (`isCriticalLog`)
  - **Task**: Write a JS function `isCriticalLog(log)` checking CRITICAL severities.
  - **Test**: Returns status flag.

#### 🟢 Day 25: Provisioning token validation & onboarding handshakes
* **Lecture Syllabus**:
  - Device onboarding handshakes
  - Validation of provisioning payloads formats
  - Checking provisioning token lifespans
* **Coding Exam**: `iotsec-basics-exam-day-25` (`isProvisioningTokenValid`)
  - **Task**: Write a JS function `isProvisioningTokenValid(token)` checking token structures.
  - **Test**: Enforces token structure check, checking length parameters.
* **Coding Assignment**: `iotsec-basics-assign-day-25` (`stripTokenPrefix`)
  - **Task**: Write a JS function `stripTokenPrefix(token)` stripping token prefixes.
  - **Test**: Trims out leading 'PROV-'.

#### 🟢 Day 26: Anti-replay message nonce sequence tracking
* **Lecture Syllabus**:
  - Mitigating replay attacks in network streams
  - Tracking message sequence counts
  - Preventing duplicate packet replays
* **Coding Exam**: `iotsec-basics-exam-day-26` (`isNonceSequenceValid`)
  - **Task**: Write a JS function `isNonceSequenceValid(newNonce, lastNonce)` checking sequences.
  - **Test**: Restricts new nonces to be strictly greater than last nonces.
* **Coding Assignment**: `iotsec-basics-assign-day-26` (`getNonceGap`)
  - **Task**: Write a JS function `getNonceGap(newNonce, lastNonce)` finding sequence gaps.
  - **Test**: Returns subtraction values.

#### 🟢 Day 27: Firmware integrity checks & checksum matches
* **Lecture Syllabus**:
  - Firmware runtime integrity verifiers
  - Flash memory checksum checks
  - Wiping firmware payload files on tampering
* **Coding Exam**: `iotsec-basics-exam-day-27` (`verifyFirmwareIntegrity`)
  - **Task**: Write a JS function `verifyFirmwareIntegrity(computed, expected)` checking signatures.
  - **Test**: Flags mismatch failures on boot checks.
* **Coding Assignment**: `iotsec-basics-assign-day-27` (`isIntegrityChecked`)
  - **Task**: Write a JS function `isIntegrityChecked(status)` auditing integrity states.
  - **Test**: Checks integrity statuses.

#### 🟢 Day 28: Capstone: Device Security Compliance Auditor
* **Lecture Syllabus**:
  - Auditing secure boot key hashes
  - Checking firmware upgrade version rollbacks
  - Auditing TLS handshake certifications
* **Coding Exam**: `iotsec-basics-exam-day-28` (`evaluateDeviceCompliance`)
  - **Task**: Write a JS function `evaluateDeviceCompliance(report)` verifying compliance states.
  - **Test**: Confirms secure boot, rollback upgrades, and TLS certifications audit maps.
* **Coding Assignment**: `iotsec-basics-assign-day-28` (`getSecurityRating`)
  - **Task**: Write a JS function `getSecurityRating(score)` compiling rating labels.
  - **Test**: Emits EXCELLENT, MEDIUM, or CRITICAL labels.

#### 🟢 Day 29: Capstone: Production deployment lifecycle review
* **Lecture Syllabus**:
  - Reviewing secure boot key hashes
  - Verifying symmetric AES IV block sizes
  - Auditing HSM key slots capacities
* **Status**: Lecture Only (Capstones lifecycle review).

#### 🟢 Day 30: Capstone: Production deployment lifecycle review
* **Lecture Syllabus**:
  - Assemble final device QA security compliance reports
  - Checking overall device firmware and cryptographic parameters
  - Confirming safe bootloader and certificate authority chains checklist
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
