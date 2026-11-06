import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const IOT_NETWORK_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Low-Power Radio Networks & 6LoWPAN Protocol Engineering",
    "desc": "Master RF spectrum allocations: Sub-GHz (868/915 MHz long-range penetration) vs 2.4 GHz (Wi-Fi/BLE bandwidth), Free Space Path Loss (FSPL), and Link Budgets.",
    "syllabus": [
      "RF Frequency bands: Sub-GHz (433/868/915 MHz) vs 2.4 GHz vs 5 GHz.",
      "Free Space Path Loss formula: $\\text{FSPL(dB)} = 20\\log_{10}(d) + 20\\log_{10}(f) - 147.55$.",
      "RF Link Budget: $P_{\\text{RX}} = P_{\\text{TX}} + G_{\\text{TX}} + G_{\\text{RX}} - \\text{PathLoss} - \\text{FadeMargin}$."
    ],
    "eTitle": "Free Space Path Loss & Link Budget Calculator",
    "eDesc": "Implement function calculateFsplAndLinkBudget(distanceMeters, freqHz, txPowerDbm, txGainDbi = 2, rxGainDbi = 2, fadeMarginDb = 10) calculating path loss and received power.",
    "eStarter": "function calculateFsplAndLinkBudget(d, f, txPower, txGain = 2, rxGain = 2, fade = 10) {\n  // TODO: Compute FSPL using 20*log10(d) + 20*log10(f) + 20*log10(4*pi/c) and subtract from TX power.\n  \n}",
    "eHint": "Compute FSPL using 20*log10(d) + 20*log10(f) + 20*log10(4*pi/c) and subtract from TX power.",
    "eTest": "const res = calculateFsplAndLinkBudget(1000, 868000000, 14, 2, 2, 10); // 1km at 868MHz\nif (res.pathLossDb < 90 || res.pathLossDb > 92 || res.linkStatus !== 'LINK_BUDGET_FEASIBLE') throw new Error('FSPL calculation failed');",
    "aTitle": "Sub-GHz vs 2.4GHz Path Loss Comparison",
    "aDesc": "Implement function compareSubGhzVs24Ghz(distMeters) returning dB difference `20 * Math.log10(2400 / 868)`.",
    "aStarter": "function compareSubGhzVs24Ghz(d) {\n  // TODO: Return path loss delta ~8.84 dB.\n  \n}",
    "aHint": "Return path loss delta ~8.84 dB.",
    "aTest": "if (compareSubGhzVs24Ghz(100) !== 8.83) throw new Error('Compare failed');"
  },
  {
    "day": 2,
    "title": "LoRaWAN CSS Modulation, BLE Mesh Flooding, Cellular NB-IoT & RPL Mesh",
    "desc": "Configure embedded 802.11 b/g/n stations, WPA2/WPA3 enterprise authentication, socket buffer allocations, and LwIP TCP flow control.",
    "syllabus": [
      "Embedded Wi-Fi modes: Station (STA), Soft-AP, and Wi-Fi Direct.",
      "Lightweight IP (LwIP) Stack: Zero-copy packet buffers (pbufs), socket descriptors, and TCP sliding windows.",
      "Wi-Fi Sleep Modes: Modem-sleep, Light-sleep, and DTIM beacon listening intervals."
    ],
    "eTitle": "Embedded TCP Packet Window Flow Controller",
    "eDesc": "Implement function evaluateTcpWindowFlow(advertisedWindowBytes, inFlightBytes, packetPayloadBytes) verifying if packet can be transmitted without buffer overflow.",
    "eStarter": "function evaluateTcpWindowFlow(winBytes, inFlight, packetBytes) {\n  // TODO: Check if winBytes - inFlight >= packetBytes.\n  \n}",
    "eHint": "Check if winBytes - inFlight >= packetBytes.",
    "eTest": "const ok = evaluateTcpWindowFlow(4096, 1024, 1460);\nconst blocked = evaluateTcpWindowFlow(4096, 3500, 1460);\nif (!ok.canTransmit || blocked.canTransmit || blocked.status !== 'TCP_WINDOW_FULL_TRANSMISSION_PAUSED') throw new Error('TCP window check failed');",
    "aTitle": "Wi-Fi RSSI Signal Quality Rater",
    "aDesc": "Implement function rateWifiRssi(rssiDbm) returning 'EXCELLENT' (>= -50), 'GOOD' (>= -70), 'POOR' (< -70).",
    "aStarter": "function rateWifiRssi(r) {\n  // TODO: Map dBm to signal rating.\n  \n}",
    "aHint": "Map dBm to signal rating.",
    "aTest": "if (rateWifiRssi(-45) !== 'EXCELLENT' || rateWifiRssi(-75) !== 'POOR') throw new Error('RSSI rate failed');"
  },
  {
    "day": 3,
    "title": "Thread IPv6 Mesh Networks, CoAP Blockwise Transfers & OSCORE Security",
    "desc": "Dissect BLE 4.2 / 5.0 2.4 GHz PHY channels (37, 38, 39 advertising; 0..36 data), PDU structures, non-connectable beacons (iBeacon/Eddystone), and Scan Response packets.",
    "syllabus": [
      "BLE 40-Channel RF Plan: 3 dedicated primary advertising channels (37, 38, 39) avoiding Wi-Fi 1, 6, 11 interference.",
      "Advertising PDU Header: Type, TxAdd, RxAdd, Length (0..37 bytes), AdvData payload.",
      "iBeacon Specification: Apple Proximity 0x004C company ID, 16-byte UUID, 2-byte Major, 2-byte Minor, Measured TxPower at 1m."
    ],
    "eTitle": "iBeacon Advertising Payload Packet Builder",
    "eDesc": "Implement function buildIBeaconAdvPayload(uuidHex, majorInt, minorInt, txPowerDbm = -59) assembling standard 30-byte BLE advertising frame.",
    "eStarter": "function buildIBeaconAdvPayload(uuid, major, minor, txPower = -59) {\n  // TODO: Format 0201061aff4c000215 + uuid + majorHex + minorHex + txHex.\n  \n}",
    "eHint": "Format 0201061aff4c000215 + uuid + majorHex + minorHex + txHex.",
    "eTest": "const res = buildIBeaconAdvPayload('e2c56db5-dffb-48d2-b060-d0f5a71096e0', 1, 100, -59);\nif (res.totalBytes !== 30 || !res.payloadHex.includes('4c000215')) throw new Error('iBeacon payload builder failed');",
    "aTitle": "BLE Advertising Channel Identifier",
    "aDesc": "Implement function isPrimaryAdvChannel(channelNum) returning true for channels 37, 38, 39.",
    "aStarter": "function isPrimaryAdvChannel(ch) {\n  // TODO: Check channels 37, 38, 39.\n  \n}",
    "aHint": "Check channels 37, 38, 39.",
    "aTest": "if (!isPrimaryAdvChannel(37) || isPrimaryAdvChannel(12)) throw new Error('Adv channel failed');"
  },
  {
    "day": 4,
    "title": "Matter Protocol Architecture: Unified IP Data Models, SPAKE2+ & Multi-Admin",
    "desc": "Build connected BLE applications: Generic Attribute Profile (GATT) Server/Client, Primary Services, 128-bit Custom UUIDs, Read/Write/Notify/Indicate permissions, and CCCD descriptors.",
    "syllabus": [
      "GATT Hierarchy: Server $\\to$ Service $\\to$ Characteristic $\\to$ Descriptor (CCCD `0x2902`).",
      "Properties: Read, Write, Write Without Response, Notify (Unacknowledged stream), Indicate (Acknowledged).",
      "Attribute Protocol (ATT) MTU Negotiation (Default 23 bytes $\\to$ 512 bytes)."
    ],
    "eTitle": "BLE GATT Characteristic Read/Write Permission Enforcer",
    "eDesc": "Implement function evaluateGattOperation(characteristic, operationType, callerSecurityLevel) validating permissions before dispatching attribute handlers.",
    "eStarter": "function evaluateGattOperation(char, op, secLevel = 'OPEN') {\n  // TODO: Verify op is in properties and auth conditions are satisfied.\n  \n}",
    "eHint": "Verify op is in properties and auth conditions are satisfied.",
    "eTest": "const char = { uuid: '2A19', properties: ['READ'], requiresAuth: true };\nconst fail = evaluateGattOperation(char, 'READ', 'OPEN');\nconst ok = evaluateGattOperation(char, 'READ', 'AUTHENTICATED_ENCRYPTED');\nif (fail.permitted || !ok.permitted || fail.error !== 'GATT_INSUFFICIENT_AUTHENTICATION') throw new Error('GATT permission check failed');",
    "aTitle": "CCCD Notify Bitmask Formatter",
    "aDesc": "Implement function formatCccdBitmask(notifyEnabled, indicateEnabled) returning `0x0001` (Notify), `0x0002` (Indicate), `0x0003` (Both), `0x0000` (None).",
    "aStarter": "function formatCccdBitmask(n, i) {\n  // TODO: Return bitmask string.\n  \n}",
    "aHint": "Return bitmask string.",
    "aTest": "if (formatCccdBitmask(true, false) !== '0x0001' || formatCccdBitmask(true, true) !== '0x0003') throw new Error('CCCD mask failed');"
  },
  {
    "day": 5,
    "title": "Milestone 1 Capstone: End-to-End Thread Mesh Gateway & Cloud Telemetry Pipeline",
    "desc": "Milestone 1: Build a production embedded multi-radio gateway: BLE GATT sensor collector, iBeacon proximity scanner, Wi-Fi Station provisioner, LwIP TCP socket stream manager, and Link Budget auditor.",
    "syllabus": [
      "Multi-Radio Coexistence: Timesharing 2.4 GHz antenna between Wi-Fi and BLE.",
      "GATT Characteristic streaming to TCP socket gateway.",
      "Production Multi-Radio Invariant verification."
    ],
    "eTitle": "Multi-Radio Gateway Master Controller",
    "eDesc": "Implement function processGatewayPacketBatch(blePackets, wifiSocket) converting BLE GATT sensor telemetry into TCP socket wire frames.",
    "eStarter": "function processGatewayPacketBatch(blePackets, socket) {\n  // TODO: Push valid packets to socket buffer and count forwarded items.\n  \n}",
    "eHint": "Push valid packets to socket buffer and count forwarded items.",
    "eTest": "const socket = { connected: true, buffer: [] };\nconst pkts = [{ valid: true, sensorId: 'TEMP', value: 24.5 }, { valid: false }];\nconst res = processGatewayPacketBatch(pkts, socket);\nif (res.packetsForwardedToWifi !== 1 || socket.buffer.length !== 1 || res.status !== 'MULTI_RADIO_GATEWAY_FORWARDING_ACTIVE') throw new Error('Milestone 1 gateway failed');",
    "aTitle": "Radio Coexistence Slot Allocator",
    "aDesc": "Implement function allocateCoexistenceSlots(wifiDutyPercent = 70) returning `{ wifiMs: 70, bleMs: 30 }`.",
    "aStarter": "function allocateCoexistenceSlots(w = 70) {\n  // TODO: Split 100ms cycle.\n  \n}",
    "aHint": "Split 100ms cycle.",
    "aTest": "if (allocateCoexistenceSlots(60).bleMs !== 40) throw new Error('Coex slot failed');"
  },
  {
    "day": 6,
    "title": "IEEE 802.15.4 Architecture, 2.4 GHz PHY & O-QPSK DSSS Modulation",
    "desc": "Scale Bluetooth to thousands of nodes: BLE Mesh architecture, Managed Flooding, Time-To-Live (TTL) hop decrementers, Message Cache deduplication, and Relay / Low-Power Nodes (LPN).",
    "syllabus": [
      "BLE Mesh Network Layer: Managed Flooding with IV Index and Sequence Numbers.",
      "Node Roles: Provisioner, Relay Node, Friend Node, Low-Power Node (LPN) with Poll Timeout sleep.",
      "Message Cache & TTL: Preventing infinite broadcast loops and broadcast storms."
    ],
    "eTitle": "BLE Mesh Managed Flooding Relay Router",
    "eDesc": "Implement function routeBleMeshMessage(messageCache, packet) deduplicating received mesh messages and decrementing TTL before re-relaying.",
    "eStarter": "function routeBleMeshMessage(cache, pkt) {\n  // TODO: Check cache for duplicates and ensure ttl > 1 before relaying with ttl - 1.\n  \n}",
    "eHint": "Check cache for duplicates and ensure ttl > 1 before relaying with ttl - 1.",
    "eTest": "const cache = new Set();\nconst pkt = { sourceAddress: '0x0001', sequenceNumber: 42, ttl: 5 };\nconst r1 = routeBleMeshMessage(cache, pkt);\nconst r2 = routeBleMeshMessage(cache, pkt); // Duplicate\nif (!r1.relayed || r1.newTtl !== 4 || r2.relayed || r2.reason !== 'DUPLICATE_MESSAGE_DROPPED') throw new Error('BLE mesh relay routing failed');",
    "aTitle": "BLE Mesh Friend Poll Interval Calculator",
    "aDesc": "Implement function getFriendPollIntervalMs(pollTimeoutSec) returning `pollTimeoutSec * 100`.",
    "aStarter": "function getFriendPollIntervalMs(s) {\n  // TODO: Multiply seconds by 100.\n  \n}",
    "aHint": "Multiply seconds by 100.",
    "aTest": "if (getFriendPollIntervalMs(10) !== 1000) throw new Error('Poll calc failed');"
  },
  {
    "day": 7,
    "title": "IEEE 802.15.4 MAC Frame Formats, Superframes & Guaranteed Time Slots",
    "desc": "Compare industrial wireless mesh networks: IEEE 802.15.4 O-QPSK physical layer, Zigbee Cluster Library (ZCL) PAN coordinator/router trees, and Thread 6LoWPAN IPv6 mesh with Border Routers.",
    "syllabus": [
      "IEEE 802.15.4 PHY/MAC: 2.4 GHz, 250 kbps, 16 channels (11..26), CSMA-CA channel access.",
      "Zigbee PRO Topology: Single PAN Coordinator, Mesh Routers, and Sleepy End Devices (SED).",
      "Thread Protocol: IPv6 native, no coordinator single point of failure (Self-healing Leader/Router election), Border Router integration."
    ],
    "eTitle": "Zigbee / Thread Mesh Neighbor Table Router",
    "eDesc": "Implement function selectBestMeshRoute(neighborTable, destinationAddress) selecting next-hop router with lowest Path Cost (LQI / RSSI metric).",
    "eStarter": "function selectBestMeshRoute(neighbors, dest) {\n  // TODO: Filter by destination and sort by lowest pathCost.\n  \n}",
    "eHint": "Filter by destination and sort by lowest pathCost.",
    "eTest": "const neighbors = [{ neighborAddress: '0x0002', canRouteTo: '0x0005', pathCost: 15, lqi: 200 }, { neighborAddress: '0x0003', canRouteTo: '0x0005', pathCost: 8, lqi: 240 }];\nconst res = selectBestMeshRoute(neighbors, '0x0005');\nif (!res.routeFound || res.nextHopAddress !== '0x0003' || res.pathCost !== 8) throw new Error('Mesh routing failed');",
    "aTitle": "802.15.4 Channel Frequency Calculator",
    "aDesc": "Implement function get802154FreqMhz(channel) returning `2405 + 5 * (channel - 11)`.",
    "aStarter": "function get802154FreqMhz(ch) {\n  // TODO: Calculate channel frequency.\n  \n}",
    "aHint": "Calculate channel frequency.",
    "aTest": "if (get802154FreqMhz(11) !== 2405 || get802154FreqMhz(26) !== 2480) throw new Error('Channel freq failed');"
  },
  {
    "day": 8,
    "title": "CSMA/CA Channel Access: Slotted vs Unslotted, Backoff Exponents & CCA Physics",
    "desc": "Master long-range physics: Semtech LoRa Chirp Spread Spectrum (CSS), Spreading Factors (SF7..SF12), Bandwidth (125/250/500 kHz), Coding Rates (4/5..4/8), and Processing Gain.",
    "syllabus": [
      "LoRa CSS Modulation: Up-chirps, Down-chirps, and Symbol duration ($T_s = \\frac{2^{\\text{SF}}}{\\text{BW}}$).",
      "Processing Gain: Operating up to 20 dB below the RF thermal noise floor ($-137\\text{ dBm}$ sensitivity).",
      "Orthogonality of Spreading Factors: Multiple nodes transmitting simultaneously on the same frequency with different SFs without collisions."
    ],
    "eTitle": "LoRa Symbol Duration & Bitrate Calculator",
    "eDesc": "Implement function calculateLoraMetrics(sf, bwHz = 125000, codingRateDenom = 5) calculating symbol duration and raw data bitrate.",
    "eStarter": "function calculateLoraMetrics(sf, bw = 125000, cr = 5) {\n  // TODO: Compute Ts = (2^sf / bw)*1000 and bitrate = sf * (bw / 2^sf) * (4/cr).\n  \n}",
    "eHint": "Compute Ts = (2^sf / bw)*1000 and bitrate = sf * (bw / 2^sf) * (4/cr).",
    "eTest": "const sf7 = calculateLoraMetrics(7, 125000, 5);\nconst sf12 = calculateLoraMetrics(12, 125000, 5);\nif (sf7.symbolDurationMs !== 1.024 || sf12.symbolDurationMs !== 32.768 || sf7.rawBitrateBps < 5000) throw new Error('LoRa metrics calculation failed');",
    "aTitle": "LoRa Processing Gain Calculator",
    "aDesc": "Implement function calculateProcessingGainDb(bwHz, bitRateBps) returning `10 * Math.log10(bwHz / bitRateBps)`.",
    "aStarter": "function calculateProcessingGainDb(bw, br) {\n  // TODO: Compute 10 * log10(bw / br).\n  \n}",
    "aHint": "Compute 10 * log10(bw / br).",
    "aTest": "if (calculateProcessingGainDb(125000, 5000) !== 14.0) throw new Error('Processing gain failed');"
  },
  {
    "day": 9,
    "title": "PAN Coordination, Association Handshakes, 16/64-Bit Addressing & Network Synchronization",
    "desc": "Build global LoRaWAN topologies: Star-of-Stars architecture, 8-channel Gateway forwarders, Network Server deduplication, Join Server, and Application Server payloads.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LoRaWAN Network Architecture: End Devices, Gateways & Network Server.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRaWAN Gateway Frame Deduplicator",
    "eDesc": "Implement function deduplicateLoraGateways(gatewayReports) selecting frame with highest RSSI / SNR signal quality from multi-gateway receptions.",
    "eStarter": "function deduplicateLoraGateways(reports) {\n  // TODO: Sort reports descending by rssiDbm and return best gateway.\n  \n}",
    "eHint": "Sort reports descending by rssiDbm and return best gateway.",
    "eTest": "const reports = [{ gatewayId: 'GW_1', rssiDbm: -110, snrDb: -5 }, { gatewayId: 'GW_2', rssiDbm: -85, snrDb: 8 }];\nconst res = deduplicateLoraGateways(reports);\nif (res.selectedGatewayId !== 'GW_2' || res.totalGatewaysHeard !== 2) throw new Error('Deduplication failed');",
    "aTitle": "Gateway Channel Count Auditor",
    "aDesc": "Implement function isMultiChannelGateway(channels) returning true if channels >= 8.",
    "aStarter": "function isMultiChannelGateway(c) {\n  // TODO: Check channels >= 8.\n  \n}",
    "aHint": "Check channels >= 8.",
    "aTest": "if (!isMultiChannelGateway(8) || isMultiChannelGateway(1)) throw new Error('GW channels failed');"
  },
  {
    "day": 10,
    "title": "Milestone 2: IEEE 802.15.4 Frame Parser & Unslotted CSMA/CA MAC State Machine Engine",
    "desc": "Authenticate LoRaWAN nodes securely: Join Request / Join Accept exchange, OTAA AES-128 cryptographic key derivation (`NwkSKey`, `AppSKey`), and Activation By Personalization (ABP) security pitfalls.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LoRaWAN Activation: Over-The-Air (OTAA) vs ABP & Session Keys.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRaWAN OTAA Session Key Derivation Simulator",
    "eDesc": "Implement function deriveOtaaSessionKeys(appKey, devNonce, appNonce, netId) generating simulated 16-byte NwkSKey and AppSKey.",
    "eStarter": "function deriveOtaaSessionKeys(appKey, devNonce, appNonce, netId) {\n  // TODO: Format simulated session keys with appKey, appNonce, and devNonce.\n  \n}",
    "eHint": "Format simulated session keys with appKey, appNonce, and devNonce.",
    "eTest": "const res = deriveOtaaSessionKeys('0x0123456789abcdef', 101, 202, '000013');\nif (!res.networkSessionKey.includes('202') || res.status !== 'KEYS_DERIVED_JOIN_ACCEPT_READY') throw new Error('OTAA key derivation failed');",
    "aTitle": "DevNonce Replay Detector",
    "aDesc": "Implement function checkDevNonceUsed(usedSet, nonce) returning true if nonce is already in set.",
    "aStarter": "function checkDevNonceUsed(s, n) {\n  // TODO: Check set membership.\n  \n}",
    "aHint": "Check set membership.",
    "aTest": "if (!checkDevNonceUsed(new Set([42]), 42)) throw new Error('Nonce check failed');"
  },
  {
    "day": 11,
    "title": "Bluetooth Low Energy (BLE 5.x) Architecture & Physical Layers: 1M, 2M & Coded PHY",
    "desc": "Optimize battery vs latency: Class A (Battery-optimized: RX1/RX2 windows only after uplink), Class B (Beacon-synchronized periodic receive slots), and Class C (Continuous mains-powered listening).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LoRaWAN Device Classes: Class A, Class B & Class C.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRaWAN Class A RX1 / RX2 Window Scheduler",
    "eDesc": "Implement function scheduleClassAReceiveWindows(uplinkEndTimestampMs, rx1DelayMs = 1000, rx2DelayMs = 2000) computing exact millisecond timestamps for downlink listening slots.",
    "eStarter": "function scheduleClassAReceiveWindows(uplinkEnd, rx1Delay = 1000, rx2Delay = 2000) {\n  // TODO: Compute rx1 = uplinkEnd + rx1Delay and rx2 = uplinkEnd + rx2Delay.\n  \n}",
    "eHint": "Compute rx1 = uplinkEnd + rx1Delay and rx2 = uplinkEnd + rx2Delay.",
    "eTest": "const res = scheduleClassAReceiveWindows(10000, 1000, 2000);\nif (res.rx1WindowOpenMs !== 11000 || res.rx2WindowOpenMs !== 12000) throw new Error('Class A schedule failed');",
    "aTitle": "Class C Power Mode Identifier",
    "aDesc": "Implement function isContinuousListeningClass(devClass) returning `devClass === 'CLASS_C'`.",
    "aStarter": "function isContinuousListeningClass(c) {\n  // TODO: Check Class C.\n  \n}",
    "aHint": "Check Class C.",
    "aTest": "if (!isContinuousListeningClass('CLASS_C')) throw new Error('Class check failed');"
  },
  {
    "day": 12,
    "title": "BLE Advertising Architecture, Primary Channels & BLE 5.0 Extended Advertising",
    "desc": "Comply with European ETSI 1% duty cycle (36s airtime per hour) and US FCC dwell times: LoRa Time-on-Air packet mathematical calculation, Preamble symbols, and Header/CRC durations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Time-on-Air (ToA) & Regional Duty Cycle Regulations.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRa Time-on-Air (ToA) Exact Millisecond Calculator",
    "eDesc": "Implement function calculateLoraToaMs(sf, payloadBytes, bwHz = 125000, preambleSymbols = 8, cr = 1, explicitHeader = true) calculating precise packet airtime.",
    "eStarter": "function calculateLoraToaMs(sf, bytes, bw = 125000, preamble = 8, cr = 1, explicit = true) {\n  // TODO: Compute symbol time, preamble time, payload symbols, and total time on air.\n  \n}",
    "eHint": "Compute symbol time, preamble time, payload symbols, and total time on air.",
    "eTest": "const sf7 = calculateLoraToaMs(7, 20, 125000, 8, 1, true);\nif (sf7.timeOnAirMs < 50 || sf7.timeOnAirMs > 75) throw new Error('LoRa ToA calculation failed');",
    "aTitle": "1% Duty Cycle Hourly Airtime Limit",
    "aDesc": "Implement function getMaxHourlyAirtimeSec(dutyPercent = 1) returning `3600 * (dutyPercent / 100)`.",
    "aStarter": "function getMaxHourlyAirtimeSec(d = 1) {\n  // TODO: Return 36 seconds for 1%.\n  \n}",
    "aHint": "Return 36 seconds for 1%.",
    "aTest": "if (getMaxHourlyAirtimeSec(1) !== 36) throw new Error('Airtime limit failed');"
  },
  {
    "day": 13,
    "title": "Generic Access Profile (GAP) Roles, Scanning Strategies & Address Privacy (RPA)",
    "desc": "Deploy cellular LPWAN: NB-IoT (200 kHz bandwidth, 20 dB link budget gain, PSM sleep) vs LTE-M (1.4 MHz bandwidth, VoLTE voice, mobile tower handover), and SIM/eSIM profiles.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cellular IoT: NB-IoT (Narrowband) & LTE-M (Cat-M1).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cellular LPWAN Technology Selector Engine",
    "eDesc": "Implement function selectCellularIotTechnology(requiresMobilityHandover, requiresVoice, targetDeepSleepCurrentUa) recommending NB-IoT vs LTE-M based on requirements.",
    "eStarter": "function selectCellularIotTechnology(mobility, voice, targetSleepUa) {\n  // TODO: Select LTE-M if voice/mobility required; else NB-IoT.\n  \n}",
    "eHint": "Select LTE-M if voice/mobility required; else NB-IoT.",
    "eTest": "const carTracker = selectCellularIotTechnology(true, false, 5);\nconst waterMeter = selectCellularIotTechnology(false, false, 3);\nif (carTracker.selectedTech !== 'LTE_M_CAT_M1' || waterMeter.selectedTech !== 'NB_IOT_CAT_NB1') throw new Error('Cellular selector failed');",
    "aTitle": "Cellular Bandwidth Formatter",
    "aDesc": "Implement function formatCellularBw(tech) returning '200 kHz' for NB-IoT or '1.4 MHz' for LTE-M.",
    "aStarter": "function formatCellularBw(t) {\n  // TODO: Format bandwidth string.\n  \n}",
    "aHint": "Format bandwidth string.",
    "aTest": "if (formatCellularBw('NB-IoT') !== '200 kHz') throw new Error('Bw format failed');"
  },
  {
    "day": 14,
    "title": "BLE Connection Establishment, Supervision Invariants & Adaptive Frequency Hopping (AFH)",
    "desc": "Achieve 10-year battery life on cellular: Power Saving Mode (PSM: T3324 Active Timer vs T3412 Periodic TAU Timer ~3 uA sleep) and extended Discontinuous Reception (eDRX).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cellular Power Saving Modes: PSM & eDRX Timers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cellular PSM Battery Life & Energy Calculator",
    "eDesc": "Implement function calculateCellularBatteryLifeYears(batteryMah = 3000, activeCurrentMa = 100, activeSecondsPerDay = 10, psmSleepCurrentUa = 3.5) estimating battery runtime in years.",
    "eStarter": "function calculateCellularBatteryLifeYears(batteryMah = 3000, activeMa = 100, activeSec = 10, psmUa = 3.5) {\n  // TODO: Compute active and sleep mAh per day and divide battery capacity.\n  \n}",
    "eHint": "Compute active and sleep mAh per day and divide battery capacity.",
    "eTest": "const res = calculateCellularBatteryLifeYears(3000, 100, 10, 3.5);\nif (res.estimatedRuntimeYears < 15 || res.status !== 'TEN_YEAR_BATTERY_GOAL_ACHIEVED') throw new Error('Battery life calculation failed');",
    "aTitle": "T3324 Active Timer Formatter",
    "aDesc": "Implement function formatT3324TimerSec(multiplier, unitMultiplierSec = 2) returning `${multiplier * unitMultiplierSec} seconds`.",
    "aStarter": "function formatT3324TimerSec(m, u = 2) {\n  // TODO: Multiply multiplier by unit seconds.\n  \n}",
    "aHint": "Multiply multiplier by unit seconds.",
    "aTest": "if (formatT3324TimerSec(10, 2) !== '20 seconds') throw new Error('Timer format failed');"
  },
  {
    "day": 15,
    "title": "Milestone 3 Capstone: Multi-Role BLE Link Layer State Machine & Connection Parameter Negotiation Engine",
    "desc": "Milestone 2: Build a production long-range telemetry platform: LoRaWAN OTAA session key deriver, Time-on-Air duty cycle limiter, Class A RX window scheduler, and Cellular NB-IoT PSM power estimator.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Long-Range LPWAN Telemetry Engine",
    "eDesc": "Implement function processLpwanTelemetryCycle(loraNode, cellularNode, channelDutyLimiter) orchestrating dual LPWAN telemetry transmissions under airtime regulations.",
    "eStarter": "function processLpwanTelemetryCycle(lora, cell, duty) {\n  // TODO: Check duty cycle airtime and transmit if allowed.\n  \n}",
    "eHint": "Check duty cycle airtime and transmit if allowed.",
    "eTest": "const duty = { usedAirtimeSec: 10, maxAirtimeSec: 36 };\nconst res = processLpwanTelemetryCycle({ toaSec: 1.5 }, { psmActive: true }, duty);\nif (!res.loraTransmitted || !res.cellularTransmitted || res.remainingDutyAirtimeSec !== 24.5) throw new Error('Milestone 2 LPWAN failed');",
    "aTitle": "LPWAN Engine Health Check",
    "aDesc": "Implement function auditLpwanHealth() returning `{ status: 'HEALTHY', subGhzReady: true, cellularReady: true }`. When called with `overrideProps`, return the base object merged with `overrideProps`.",
    "aStarter": "function auditLpwanHealth(overrideProps) {\n  // TODO: Return {\"status\":\"HEALTHY\",\"subGhzReady\":true,\"cellularReady\":true} merged with optional overrideProps\n  \n}",
    "aHint": "Return { ...{\"status\":\"HEALTHY\",\"subGhzReady\":true,\"cellularReady\":true}, ...(overrideProps || {}) }.",
    "aTest": "const base = auditLpwanHealth();\nconst custom = auditLpwanHealth({ verifiedOverride: true });\nif (!base || !custom.verifiedOverride) throw new Error('Object configuration merge failed');"
  },
  {
    "day": 16,
    "title": "CoAP (Constrained Application Protocol) & UDP REST Architecture (RFC 7252)",
    "desc": "Implement RESTful architectures on microcontrollers: CoAP (RFC 7252) binary header packing, Confirmable (CON) vs Non-Confirmable (NON) messages, Token tracking, and Observe resource subscriptions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of CoAP (Constrained Application Protocol) & UDP REST.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CoAP Binary Header Packet Encoder",
    "eDesc": "Implement function encodeCoapHeader(version = 1, type = 0, tokenLength = 4, code = '0.01', messageId = 1234) packing CoAP 4-byte header bitfields.",
    "eStarter": "function encodeCoapHeader(ver = 1, type = 0, tkl = 4, code = '0.01', msgId = 1234) {\n  // TODO: Pack (ver<<6)|(type<<4)|tkl into byte 0, (codeClass<<5)|codeDetail into byte 1, and msgId into bytes 2 and 3.\n  \n}",
    "eHint": "Pack (ver<<6)|(type<<4)|tkl into byte 0, (codeClass<<5)|codeDetail into byte 1, and msgId into bytes 2 and 3.",
    "eTest": "const res = encodeCoapHeader(1, 0, 0, '0.01', 0x1234); // GET CON\nif (res.headerHex !== '40011234' || res.type !== 'CON') throw new Error('CoAP header encode failed');",
    "aTitle": "CoAP Method Code Formatter",
    "aDesc": "Implement function getCoapCode(method) returning '0.01' (GET), '0.02' (POST), '0.03' (PUT), '0.04' (DELETE).",
    "aStarter": "function getCoapCode(m) {\n  // TODO: Map method to CoAP code string.\n  \n}",
    "aHint": "Map method to CoAP code string.",
    "aTest": "if (getCoapCode('GET') !== '0.01' || getCoapCode('POST') !== '0.02') throw new Error('CoAP code failed');"
  },
  {
    "day": 17,
    "title": "MQTT-SN (MQTT for Sensor Networks) & Gateway Architecture",
    "desc": "Adapt MQTT for non-TCP networks: MQTT-SN over UDP / Zigbee / BLE, 2-byte Topic IDs (avoiding string topic overhead), Gateway discovery (`SEARCHGW`/`GWINFO`), and Sleeping Clients.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of MQTT-SN (MQTT for Sensor Networks) & Gateway Architecture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "MQTT-SN Topic Registration & ID Allocator",
    "eDesc": "Implement function registerMqttSnTopic(topicTable, topicString) assigning unique 2-byte integer TopicId for compact transmission.",
    "eStarter": "function registerMqttSnTopic(table, topicStr) {\n  // TODO: Assign next integer ID and compute bytes saved vs sending topic string.\n  \n}",
    "eHint": "Assign next integer ID and compute bytes saved vs sending topic string.",
    "eTest": "const table = {};\nconst res = registerMqttSnTopic(table, 'sensors/factory/line1/temp');\nif (res.assignedTopicId !== 1 || res.bytesSavedVsString !== 24) throw new Error('MQTT-SN registration failed');",
    "aTitle": "MQTT-SN MsgType Code Formatter",
    "aDesc": "Implement function getMqttSnMsgType(name) returning `0x0A` (REGISTER), `0x0C` (PUBLISH), `0x14` (DISCONNECT).",
    "aStarter": "function getMqttSnMsgType(n) {\n  // TODO: Map name to hex code.\n  \n}",
    "aHint": "Map name to hex code.",
    "aTest": "if (getMqttSnMsgType('PUBLISH') !== '0x0C') throw new Error('MsgType failed');"
  },
  {
    "day": 18,
    "title": "Compact Binary Serializations: CBOR & MessagePack vs JSON",
    "desc": "Eliminate JSON overhead on microcontrollers: CBOR (Concise Binary Object Representation RFC 8949) vs MessagePack, Major Types (0..7), Compact Bitfields, and 80% payload size reduction.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Compact Binary Serializations: CBOR & MessagePack.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Compact Binary Payload Size & Savings Evaluator",
    "eDesc": "Implement function evaluateBinarySerialization(jsonPayloadObject) estimating JSON vs CBOR encoded byte sizes.",
    "eStarter": "function evaluateBinarySerialization(obj) {\n  // TODO: Compute jsonBytes, estimate cborBytes, and calculate savings percentage.\n  \n}",
    "eHint": "Compute jsonBytes, estimate cborBytes, and calculate savings percentage.",
    "eTest": "const res = evaluateBinarySerialization({ temperature: 24.55, humidity: 62.1, pressure: 101325, deviceId: 'SENSOR_NODE_001' });\nif (res.bandwidthSavingsPercent < 60 || res.status !== 'CBOR_BINARY_SERIALIZATION_OPTIMAL') throw new Error('Binary serialization test failed');",
    "aTitle": "CBOR Major Type Identifier",
    "aDesc": "Implement function getCborMajorType(headerByte) returning `(headerByte >> 5) & 0x07`.",
    "aStarter": "function getCborMajorType(b) {\n  // TODO: Shift right 5 bits and mask 0x07.\n  \n}",
    "aHint": "Shift right 5 bits and mask 0x07.",
    "aTest": "if (getCborMajorType(0xA5) !== 5) throw new Error('Major type failed');"
  },
  {
    "day": 19,
    "title": "DTLS (Datagram Transport Layer Security) for Constrained Nodes",
    "desc": "Encrypt UDP sensor streams: DTLS 1.2 / 1.3 (RFC 6347), Pre-Shared Key (TLS_PSK) cipher suites, Handshake fragmentation, Replay Detection sliding windows, and Connection IDs (CID).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of DTLS (Datagram Transport Layer Security) for Constrained Nodes.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DTLS Pre-Shared Key (PSK) Handshake Validator",
    "eDesc": "Implement function validateDtlsPskHandshake(clientIdentity, pskStore, expectedIdentity) verifying pre-shared key identity before establishing encrypted datagram session.",
    "eStarter": "function validateDtlsPskHandshake(clientId, store, expectedId) {\n  // TODO: Verify clientId matches expected and key exists in store.\n  \n}",
    "eHint": "Verify clientId matches expected and key exists in store.",
    "eTest": "const store = { 'client_mcu_01': '0xSecretPskKey' };\nconst res = validateDtlsPskHandshake('client_mcu_01', store, 'client_mcu_01');\nif (!res.sessionEstablished || res.status !== 'DTLS_SECURE_SESSION_ESTABLISHED') throw new Error('DTLS handshake failed');",
    "aTitle": "DTLS Record Epoch Incrementor",
    "aDesc": "Implement function incrementDtlsEpoch(epoch) returning `epoch + 1`.",
    "aStarter": "function incrementDtlsEpoch(e) {\n  // TODO: Increment epoch number.\n  \n}",
    "aHint": "Increment epoch number.",
    "aTest": "if (incrementDtlsEpoch(0) !== 1) throw new Error('Epoch inc failed');"
  },
  {
    "day": 20,
    "title": "Milestone 4 Capstone: 6LoWPAN Header Compression (LOWPAN_IPHC) & Multihop Packet Fragmentation Engine",
    "desc": "Fit 128-bit IPv6 packets into 127-byte 802.15.4 frames: 6LoWPAN (RFC 6282), LOWPAN_IPHC header compression (40-byte IPv6 + 8-byte UDP $\\to$ 6 bytes!), and Mesh Under vs Route Over.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 6LoWPAN: IPv6 Header Compression (LOWPAN_IPHC).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "6LoWPAN Header Compression Ratio Calculator",
    "eDesc": "Implement function calculate6lowpanCompression(ipv6HeaderBytes = 40, udpHeaderBytes = 8, compressedBytes = 6) calculating compression efficiency.",
    "eStarter": "function calculate6lowpanCompression(ip = 40, udp = 8, comp = 6) {\n  // TODO: Compute reduction from 48 bytes to 6 bytes.\n  \n}",
    "eHint": "Compute reduction from 48 bytes to 6 bytes.",
    "eTest": "const res = calculate6lowpanCompression(40, 8, 6);\nif (res.headerReductionPercent !== 87.5 || !res.fitsInSingle802154Frame) throw new Error('6LoWPAN compression failed');",
    "aTitle": "6LoWPAN Dispatch Byte Formatter",
    "aDesc": "Implement function getIphcDispatchByte() returning `0x60` (LOWPAN_IPHC). When called with an `inputTag` string, return `{ canonical: \"0x60\", provided: String(inputTag).trim(), isMatch }` comparing case-insensitively.",
    "aStarter": "function getIphcDispatchByte(inputTag) {\n  // TODO: Return \"0x60\" when called with no arguments, or { canonical: \"0x60\", provided: String(inputTag).trim(), isMatch: boolean }\n  \n}",
    "aHint": "If inputTag === undefined return \"0x60\"; otherwise trim and compare case-insensitively against \"0x60\".",
    "aTest": "if (getIphcDispatchByte() !== \"0x60\") throw new Error('Canonical string must equal ' + \"0x60\");\nconst okMatch = getIphcDispatchByte(\"0x60\".toLowerCase());\nconst badMatch = getIphcDispatchByte('INVALID_TAG_XYZ');\nif (!okMatch || !okMatch.isMatch || badMatch.isMatch || okMatch.canonical !== \"0x60\") throw new Error('Case-insensitive canonical tag verification failed');"
  },
  {
    "day": 21,
    "title": "Milestone 5 Capstone: Production Constrained Protocol & Security Engine",
    "desc": "Milestone 3: Build a production constrained communications stack: CoAP binary header encoder, MQTT-SN topic registry, CBOR binary serializer, DTLS PSK session manager, and 6LoWPAN header compressor.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Production Constrained Protocol & Security Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Constrained Protocol Master Engine",
    "eDesc": "Implement function processConstrainedPacketCycle(coapPacket, cborPayload, dtlsSession) encoding, compressing, and encrypting packet for 802.15.4 transmission.",
    "eStarter": "function processConstrainedPacketCycle(coap, cbor, dtls) {\n  // TODO: Compute wire bytes with optional DTLS header and verify dispatch status.\n  \n}",
    "eHint": "Compute wire bytes with optional DTLS header and verify dispatch status.",
    "eTest": "const res = processConstrainedPacketCycle({ headerBytes: 4 }, { byteLength: 18 }, { connected: true });\nif (res.totalWireFrameBytes !== 35 || res.status !== 'CONSTRAINED_PROTOCOL_PACKET_DISPATCHED') throw new Error('Milestone 3 protocol failed');",
    "aTitle": "Constrained Stack Auditor",
    "aDesc": "Implement function auditConstrainedStack() returning `{ certified: true, tier: 'CONSTRAINED_IOT_READY' }`. When called with `overrideProps`, return the base object merged with `overrideProps`.",
    "aStarter": "function auditConstrainedStack(overrideProps) {\n  // TODO: Return {\"certified\":true,\"tier\":\"CONSTRAINED_IOT_READY\"} merged with optional overrideProps\n  \n}",
    "aHint": "Return { ...{\"certified\":true,\"tier\":\"CONSTRAINED_IOT_READY\"}, ...(overrideProps || {}) }.",
    "aTest": "const base = auditConstrainedStack();\nconst custom = auditConstrainedStack({ verifiedOverride: true });\nif (!base || !custom.verifiedOverride) throw new Error('Object configuration merge failed');"
  },
  {
    "day": 22,
    "title": "RPL (Routing Protocol for Low-Power and Lossy Networks - RFC 6550)",
    "desc": "Route packets in lossy mesh networks: RPL (RFC 6550), Destination-Oriented Directed Acyclic Graphs (DODAG), Trickle Timer algorithm, and Objective Functions (OF0 vs MRHOF).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of RPL (Routing Protocol for Low-Power and Lossy Networks).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "RPL DODAG Rank Calculator & Loop Detector",
    "eDesc": "Implement function calculateRplRank(parentRank, minHopRankIncrease = 256, step = 1) ensuring child rank is strictly greater than parent to prevent routing loops.",
    "eStarter": "function calculateRplRank(pRank, minHop = 256, step = 1) {\n  // TODO: Compute newRank = pRank + (minHop * step) and verify newRank > pRank.\n  \n}",
    "eHint": "Compute newRank = pRank + (minHop * step) and verify newRank > pRank.",
    "eTest": "const res = calculateRplRank(512, 256, 2);\nif (res.calculatedNodeRank !== 1024 || !res.isLoopFree) throw new Error('RPL rank calc failed');",
    "aTitle": "Trickle Timer Doubler",
    "aDesc": "Implement function doubleTrickleInterval(currentI, maxI = 16) returning `Math.min(currentI * 2, maxI)`.",
    "aStarter": "function doubleTrickleInterval(i, maxI = 16) {\n  // TODO: Double interval up to maxI.\n  \n}",
    "aHint": "Double interval up to maxI.",
    "aTest": "if (doubleTrickleInterval(4, 16) !== 8 || doubleTrickleInterval(16, 16) !== 16) throw new Error('Trickle double failed');"
  },
  {
    "day": 23,
    "title": "RF Antennas, Impedance Matching & VSWR",
    "desc": "Design high-efficiency RF hardware: Monopole vs Dipole vs PCB Trace antennas, 50-Ohm characteristic impedance matching (Smith Charts), Return Loss ($S_{11}$), and Voltage Standing Wave Ratio (VSWR).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of RF Antennas, Impedance Matching & VSWR.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "RF Return Loss & VSWR Power Efficiency Calculator",
    "eDesc": "Implement function calculateVswrAndEfficiency(s11Db) calculating Voltage Standing Wave Ratio and radiated power percentage.",
    "eStarter": "function calculateVswrAndEfficiency(s11Db) {\n  // TODO: Compute gamma = 10^(-|s11|/20), vswr = (1+gamma)/(1-gamma), radiatedPercent = (1-gamma^2)*100.\n  \n}",
    "eHint": "Compute gamma = 10^(-|s11|/20), vswr = (1+gamma)/(1-gamma), radiatedPercent = (1-gamma^2)*100.",
    "eTest": "const good = calculateVswrAndEfficiency(-20);\nconst bad = calculateVswrAndEfficiency(-3);\nif (good.vswr > 1.3 || bad.vswr < 5.0 || good.antennaMatchingQuality !== 'EXCELLENT_50_OHM_MATCH') throw new Error('VSWR calculation failed');",
    "aTitle": "Quarter-Wave Antenna Length Calculator",
    "aDesc": "Implement function getQuarterWaveLengthMm(freqMhz) returning `(299792 / (4 * freqMhz))`.",
    "aStarter": "function getQuarterWaveLengthMm(f) {\n  // TODO: Compute c / (4 * f).\n  \n}",
    "aHint": "Compute c / (4 * f).",
    "aTest": "const __chk = getQuarterWaveLengthMm(868);\nif (__chk === undefined || __chk === null || Number.isNaN(__chk)) throw new Error('Function must return a valid result');\nif (getQuarterWaveLengthMm(868) < 85 || getQuarterWaveLengthMm(868) > 87) throw new Error('Antenna length failed');"
  },
  {
    "day": 24,
    "title": "Cellular AT Commands State Machine & Modem Management",
    "desc": "Control embedded LTE/NB-IoT modems (Quectel BG96, SIMCom, Nordic nRF9160): AT Command parser state machine, URC (Unsolicited Result Codes), `AT+CSQ` signal quality, and PDP Context activation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cellular AT Commands State Machine & Modem Management.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cellular Modem AT Command Parser State Machine",
    "eDesc": "Implement function parseAtResponse(rawBuffer, targetCommand) extracting `OK`, `ERROR`, or URC values.",
    "eStarter": "function parseAtResponse(raw, cmd) {\n  // TODO: Check buffer for OK and ERROR strings.\n  \n}",
    "eHint": "Check buffer for OK and ERROR strings.",
    "eTest": "const ok = parseAtResponse('AT+CSQ\\r\\n+CSQ: 24,99\\r\\nOK\\r\\n', 'AT+CSQ');\nconst err = parseAtResponse('AT+CGATT=1\\r\\nERROR\\r\\n', 'AT+CGATT=1');\nif (!ok.success || err.success || ok.status !== 'MODEM_RESPONSE_OK') throw new Error('AT parser failed');",
    "aTitle": "CSQ to dBm Signal Converter",
    "aDesc": "Implement function csqToDbm(csq) returning `-113 + 2 * csq`.",
    "aStarter": "function csqToDbm(c) {\n  // TODO: Compute -113 + 2 * csq.\n  \n}",
    "aHint": "Compute -113 + 2 * csq.",
    "aTest": "if (csqToDbm(20) !== -73 || csqToDbm(0) !== -113) throw new Error('CSQ convert failed');"
  },
  {
    "day": 25,
    "title": "Wireless Security: Replay Attacks, Frame Counters & Jamming",
    "desc": "Harden wireless links against physical and RF threats: AES-128-CCM* encryption, Monotonic Frame Counters (preventing replay attacks), and RF Jamming / RSSI noise floor anomaly detection.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Wireless Security: Replay Attacks, Frame Counters & Jamming.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Wireless Monotonic Frame Counter Replay Defense",
    "eDesc": "Implement function validateWirelessFrameCounter(lastCounter, incomingCounter) validating strict monotonic increment before decrypting payload.",
    "eStarter": "function validateWirelessFrameCounter(last, incoming) {\n  // TODO: Verify incoming > last counter.\n  \n}",
    "eHint": "Verify incoming > last counter.",
    "eTest": "const ok = validateWirelessFrameCounter(100, 101);\nconst replay = validateWirelessFrameCounter(100, 95);\nif (!ok.isAuthentic || replay.isAuthentic || replay.status !== 'REPLAY_ATTACK_DETECTED_FRAME_DROPPED') throw new Error('Frame counter test failed');",
    "aTitle": "RF Jamming Detector",
    "aDesc": "Implement function detectRfJamming(rssiNoiseFloorDbm, thresholdDbm = -75) returning `rssiNoiseFloorDbm >= thresholdDbm`.",
    "aStarter": "function detectRfJamming(n, t = -75) {\n  // TODO: Check if noise floor exceeds threshold.\n  \n}",
    "aHint": "Check if noise floor exceeds threshold.",
    "aTest": "if (!detectRfJamming(-60, -75) || detectRfJamming(-100, -75)) throw new Error('Jamming detect failed');"
  },
  {
    "day": 26,
    "title": "Firmware Over-The-Air (FOTA / FUOTA) Multicast Updates",
    "desc": "Update 10,000 wireless devices simultaneously: LoRaWAN FUOTA (Firmware Update Over The Air), Multicast Setup, Fragmentation Session (Reed-Solomon erasure coding), and delta binary patching.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Firmware Over-The-Air (FOTA / FUOTA) Multicast Updates.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "FUOTA Reed-Solomon Erasure Coding Packet Reconstructor",
    "eDesc": "Implement function reconstructFuotaFirmware(receivedFragmentsCount, requiredFragmentsCount = 100, redundancyFragmentsCount = 20) verifying if firmware image can be fully reconstructed.",
    "eStarter": "function reconstructFuotaFirmware(received, required = 100, redundancy = 20) {\n  // TODO: Verify received >= required fragments.\n  \n}",
    "eHint": "Verify received >= required fragments.",
    "eTest": "const ok = reconstructFuotaFirmware(105, 100, 20);\nconst fail = reconstructFuotaFirmware(90, 100, 20);\nif (!ok.reconstructionPossible || fail.reconstructionPossible || ok.status !== 'FUOTA_FIRMWARE_RECONSTRUCTION_SUCCESS') throw new Error('FUOTA test failed');",
    "aTitle": "Firmware Fragment Count Calculator",
    "aDesc": "Implement function calculateFragmentCount(firmwareSizeBytes, fragmentSizeBytes = 200) returning `Math.ceil(firmwareSizeBytes / fragmentSizeBytes)`.",
    "aStarter": "function calculateFragmentCount(fw, frag = 200) {\n  // TODO: Divide firmware size by fragment size.\n  \n}",
    "aHint": "Divide firmware size by fragment size.",
    "aTest": "if (calculateFragmentCount(50000, 200) !== 250) throw new Error('Fragment calc failed');"
  },
  {
    "day": 27,
    "title": "Energy Harvesting & Solar/Thermal Duty Cycling",
    "desc": "Design battery-free IoT devices: Solar PV harvesting, Peltier thermoelectric generators (TEG), Supercapacitor charge curves, and Dynamic Energy-Aware Duty Cycling.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Energy Harvesting & Solar/Thermal Duty Cycling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Energy-Harvesting Supercapacitor Charge & Sleep Cycle Optimizer",
    "eDesc": "Implement function optimizeEnergyDutyCycle(harvestPowerMw, activePowerMw, sleepPowerMw = 0.01, activeTimeMs = 50) computing sustainable transmission interval.",
    "eStarter": "function optimizeEnergyDutyCycle(harvestMw, activeMw, sleepMw = 0.01, activeMs = 50) {\n  // TODO: Compute activeJoules / netHarvestPerSec to find sustainable interval.\n  \n}",
    "eHint": "Compute activeJoules / netHarvestPerSec to find sustainable interval.",
    "eTest": "const res = optimizeEnergyDutyCycle(0.5, 100, 0.01, 50); // 0.5mW solar harvest, 100mW active for 50ms\nif (!res.sustainable || res.minTransmissionIntervalSeconds > 15 || res.minTransmissionIntervalSeconds < 8) throw new Error('Energy duty cycle failed');",
    "aTitle": "Supercapacitor Energy Joules Calculator",
    "aDesc": "Implement function getSupercapEnergyJoules(capacitanceFarads, voltageVolts) returning `0.5 * capacitanceFarads * voltageVolts * voltageVolts`.",
    "aStarter": "function getSupercapEnergyJoules(c, v) {\n  // TODO: Compute 0.5 * C * V^2.\n  \n}",
    "aHint": "Compute 0.5 * C * V^2.",
    "aTest": "if (getSupercapEnergyJoules(1.0, 3.3) !== 5.445) throw new Error('Supercap energy failed');"
  },
  {
    "day": 28,
    "title": "Satellite IoT & Direct-to-Cell LEO Constellations",
    "desc": "Connect devices anywhere on Earth: Low Earth Orbit (LEO) constellations (Starlink Direct-to-Cell, Iridium, Astrocast, Myriota), Doppler shift frequency compensation, and orbital pass scheduling.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Satellite IoT & Direct-to-Cell LEO Constellations.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LEO Satellite Orbital Pass Window & Doppler Shift Calculator",
    "eDesc": "Implement function calculateDopplerAndPassWindow(carrierFreqHz = 868000000, satVelocityMps = 7500) calculating maximum Doppler frequency shift during satellite overhead pass.",
    "eStarter": "function calculateDopplerAndPassWindow(f = 868000000, v = 7500) {\n  // TODO: Compute maxDoppler = (v / c) * f.\n  \n}",
    "eHint": "Compute maxDoppler = (v / c) * f.",
    "eTest": "const res = calculateDopplerAndPassWindow(868000000, 7500);\nif (res.maxDopplerShiftHz < 21000 || res.maxDopplerShiftHz > 22000) throw new Error('Satellite Doppler failed');",
    "aTitle": "Satellite Pass Duration Formatter",
    "aDesc": "Implement function formatSatPass(durationMin = 7) returning `${durationMin} minutes visibility pass window`.",
    "aStarter": "function formatSatPass(d = 7) {\n  // TODO: Format pass duration string.\n  \n}",
    "aHint": "Format pass duration string.",
    "aTest": "if (!formatSatPass(7).includes('7 minutes')) throw new Error('Sat pass format failed');"
  },
  {
    "day": 29,
    "title": "Edge Network Failover & Mesh Self-Healing Orchestration",
    "desc": "Build mission-critical high-availability networks: Multi-WAN Edge failover (Wi-Fi $\\to$ Cellular $\\to$ Satellite), Dynamic DNS heartbeats, and Mesh self-healing parent selection.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Edge Network Failover & Mesh Self-Healing Orchestration.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Edge Gateway Multi-WAN Failover Manager",
    "eDesc": "Implement function evaluateWanFailover(wanInterfaces) selecting the highest-priority active internet interface (Ethernet > Wi-Fi > Cellular > Satellite).",
    "eStarter": "function evaluateWanFailover(interfaces) {\n  // TODO: Filter online interfaces and sort by priority.\n  \n}",
    "eHint": "Filter online interfaces and sort by priority.",
    "eTest": "const ifaces = [{ name: 'ETH', online: false, prio: 1 }, { name: 'WIFI', online: false, prio: 2 }, { name: 'CELL', online: true, prio: 3 }];\nconst res = evaluateWanFailover(ifaces);\nif (!res.connected || res.activeInterface !== 'CELL' || res.priority !== 3) throw new Error('WAN failover failed');",
    "aTitle": "Interface Priority Formatter",
    "aDesc": "Implement function getInterfacePriority(name) returning 1 (ETH), 2 (WIFI), 3 (CELL), 4 (SAT).",
    "aStarter": "function getInterfacePriority(n) {\n  // TODO: Map interface to priority.\n  \n}",
    "aHint": "Map interface to priority.",
    "aTest": "if (getInterfacePriority('ETH') !== 1 || getInterfacePriority('CELL') !== 3) throw new Error('Priority failed');"
  },
  {
    "day": 30,
    "title": "Grand Capstone: Enterprise Smart City Multi-Radio Wireless Mesh Ecosystem",
    "desc": "Final Capstone Synthesis: The complete industrial IoT wireless communications ecosystem: BLE Mesh environmental sensor arrays, LoRaWAN long-range city infrastructure telemetry, Cellular NB-IoT/LTE-M gateway uplinks, CoAP/DTLS encrypted endpoints, 6LoWPAN IPv6 header compression, and Multi-WAN edge failover.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Smart City Multi-Radio Wireless Mesh Ecosystem.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Smart City Multi-Radio Master Ecosystem Controller",
    "eDesc": "Implement function executeSmartCityRadioEcosystem(bleMeshArray, loraInfrastructure, cellularGateway, dtlsSecurity) orchestrating complete city-scale telemetry pipeline.",
    "eStarter": "function executeSmartCityRadioEcosystem(ble, lora, cell, sec) {\n  // TODO: Verify all subsystem healthy booleans and return ecosystem status.\n  \n}",
    "eHint": "Verify all subsystem healthy booleans and return ecosystem status.",
    "eTest": "const ble = { nodesActive: 250 };\nconst lora = { dutyCycleValid: true, gatewaysOnline: 8 };\nconst cell = { pdpContextActive: true, signalDbm: -85 };\nconst sec = { dtlsEncrypted: true, replayProtected: true };\nconst res = executeSmartCityRadioEcosystem(ble, lora, cell, sec);\nif (!res.systemOperational || res.status !== 'SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED' || res.bleMeshNodes !== 250) throw new Error('Capstone radio ecosystem failed');",
    "aTitle": "Smart City Radio Certification Auditor",
    "aDesc": "Implement function auditSmartCityRadioCert() returning `{ certified: true, score: '100/100', tier: 'ENTERPRISE_IOT_WIRELESS_NETWORKS_CERTIFIED' }`. When called with `overrideProps`, return the base object merged with `overrideProps`.",
    "aStarter": "function auditSmartCityRadioCert(overrideProps) {\n  // TODO: Return {\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_IOT_WIRELESS_NETWORKS_CERTIFIED\"} merged with optional overrideProps\n  \n}",
    "aHint": "Return { ...{\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_IOT_WIRELESS_NETWORKS_CERTIFIED\"}, ...(overrideProps || {}) }.",
    "aTest": "const base = auditSmartCityRadioCert();\nconst custom = auditSmartCityRadioCert({ verifiedOverride: true });\nif (!base || !custom.verifiedOverride) throw new Error('Object configuration merge failed');"
  }
];

export const IOT_NETWORK_30_DAYS_QUESTS: CourseQuest[] = IOT_NETWORK_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('iot_net', idx + 1, cfg)
);
