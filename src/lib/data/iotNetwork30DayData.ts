import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const IOT_NETWORK_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Wireless Communication Spectrum & Protocols for IoT",
    "desc": "Master RF spectrum allocations: Sub-GHz (868/915 MHz long-range penetration) vs 2.4 GHz (Wi-Fi/BLE bandwidth), Free Space Path Loss (FSPL), and Link Budgets.",
    "syllabus": [
      "RF Frequency bands: Sub-GHz (433/868/915 MHz) vs 2.4 GHz vs 5 GHz.",
      "Free Space Path Loss formula: $\\text{FSPL(dB)} = 20\\log_{10}(d) + 20\\log_{10}(f) - 147.55$.",
      "RF Link Budget: $P_{\\text{RX}} = P_{\\text{TX}} + G_{\\text{TX}} + G_{\\text{RX}} - \\text{PathLoss} - \\text{FadeMargin}$."
    ],
    "eTitle": "Free Space Path Loss & Link Budget Calculator",
    "eDesc": "Implement function calculateFsplAndLinkBudget(distanceMeters, freqHz, txPowerDbm, txGainDbi = 2, rxGainDbi = 2, fadeMarginDb = 10) calculating path loss and received power.",
    "eStarter": "function calculateFsplAndLinkBudget(d, f, txPower, txGain = 2, rxGain = 2, fade = 10) {\n  // FSPL = 20*log10(d) + 20*log10(f) + 20*log10(4*pi/c)\n  const c = 299792458;\n  const fspl = 20 * Math.log10(d) + 20 * Math.log10(f) + 20 * Math.log10((4 * Math.PI) / c);\n  const rxPower = txPower + txGain + rxGain - fspl - fade;\n  return {\n    distanceMeters: d,\n    frequencyHz: f,\n    pathLossDb: Number(fspl.toFixed(2)),\n    receivedPowerDbm: Number(rxPower.toFixed(2)),\n    linkStatus: rxPower >= -120 ? 'LINK_BUDGET_FEASIBLE' : 'LINK_BUDGET_CLOSED_SIGNAL_LOST'\n  };\n}",
    "eHint": "Compute FSPL using 20*log10(d) + 20*log10(f) + 20*log10(4*pi/c) and subtract from TX power.",
    "eTest": "const res = calculateFsplAndLinkBudget(1000, 868000000, 14, 2, 2, 10); // 1km at 868MHz\nif (res.pathLossDb < 90 || res.pathLossDb > 92 || res.linkStatus !== 'LINK_BUDGET_FEASIBLE') throw new Error('FSPL calculation failed');",
    "aTitle": "Sub-GHz vs 2.4GHz Path Loss Comparison",
    "aDesc": "Implement function compareSubGhzVs24Ghz(distMeters) returning dB difference `20 * Math.log10(2400 / 868)`.",
    "aStarter": "function compareSubGhzVs24Ghz(d) { return Number((20 * Math.log10(2400 / 868)).toFixed(2)); }",
    "aHint": "Return path loss delta ~8.84 dB.",
    "aTest": "if (compareSubGhzVs24Ghz(100) !== 8.84) throw new Error('Compare failed');"
  },
  {
    "day": 2,
    "title": "Wi-Fi Networking & Embedded TCP/IP Stacks (LwIP)",
    "desc": "Configure embedded 802.11 b/g/n stations, WPA2/WPA3 enterprise authentication, socket buffer allocations, and LwIP TCP flow control.",
    "syllabus": [
      "Embedded Wi-Fi modes: Station (STA), Soft-AP, and Wi-Fi Direct.",
      "Lightweight IP (LwIP) Stack: Zero-copy packet buffers (pbufs), socket descriptors, and TCP sliding windows.",
      "Wi-Fi Sleep Modes: Modem-sleep, Light-sleep, and DTIM beacon listening intervals."
    ],
    "eTitle": "Embedded TCP Packet Window Flow Controller",
    "eDesc": "Implement function evaluateTcpWindowFlow(advertisedWindowBytes, inFlightBytes, packetPayloadBytes) verifying if packet can be transmitted without buffer overflow.",
    "eStarter": "function evaluateTcpWindowFlow(winBytes, inFlight, packetBytes) {\n  const availableSpace = winBytes - inFlight;\n  const canSend = availableSpace >= packetBytes;\n  return {\n    advertisedWindow: winBytes,\n    inFlightBytes: inFlight,\n    availableBuffer: availableSpace,\n    canTransmit: canSend,\n    status: canSend ? 'TCP_PACKET_TRANSMISSION_PERMITTED' : 'TCP_WINDOW_FULL_TRANSMISSION_PAUSED'\n  };\n}",
    "eHint": "Check if winBytes - inFlight >= packetBytes.",
    "eTest": "const ok = evaluateTcpWindowFlow(4096, 1024, 1460);\nconst blocked = evaluateTcpWindowFlow(4096, 3500, 1460);\nif (!ok.canTransmit || blocked.canTransmit || blocked.status !== 'TCP_WINDOW_FULL_TRANSMISSION_PAUSED') throw new Error('TCP window check failed');",
    "aTitle": "Wi-Fi RSSI Signal Quality Rater",
    "aDesc": "Implement function rateWifiRssi(rssiDbm) returning 'EXCELLENT' (>= -50), 'GOOD' (>= -70), 'POOR' (< -70).",
    "aStarter": "function rateWifiRssi(r) { return r >= -50 ? 'EXCELLENT' : (r >= -70 ? 'GOOD' : 'POOR'); }",
    "aHint": "Map dBm to signal rating.",
    "aTest": "if (rateWifiRssi(-45) !== 'EXCELLENT' || rateWifiRssi(-75) !== 'POOR') throw new Error('RSSI rate failed');"
  },
  {
    "day": 3,
    "title": "Bluetooth Low Energy (BLE) PHY & Advertising",
    "desc": "Dissect BLE 4.2 / 5.0 2.4 GHz PHY channels (37, 38, 39 advertising; 0..36 data), PDU structures, non-connectable beacons (iBeacon/Eddystone), and Scan Response packets.",
    "syllabus": [
      "BLE 40-Channel RF Plan: 3 dedicated primary advertising channels (37, 38, 39) avoiding Wi-Fi 1, 6, 11 interference.",
      "Advertising PDU Header: Type, TxAdd, RxAdd, Length (0..37 bytes), AdvData payload.",
      "iBeacon Specification: Apple Proximity 0x004C company ID, 16-byte UUID, 2-byte Major, 2-byte Minor, Measured TxPower at 1m."
    ],
    "eTitle": "iBeacon Advertising Payload Packet Builder",
    "eDesc": "Implement function buildIBeaconAdvPayload(uuidHex, majorInt, minorInt, txPowerDbm = -59) assembling standard 30-byte BLE advertising frame.",
    "eStarter": "function buildIBeaconAdvPayload(uuid, major, minor, txPower = -59) {\n  const cleanUuid = uuid.replace(/-/g, '').toLowerCase();\n  const majorHex = major.toString(16).padStart(4, '0');\n  const minorHex = minor.toString(16).padStart(4, '0');\n  const txHex = (txPower & 0xFF).toString(16).padStart(2, '0');\n  const payload = `0201061aff4c000215${cleanUuid}${majorHex}${minorHex}${txHex}`;\n  return {\n    uuid,\n    major,\n    minor,\n    txPower,\n    payloadHex: payload,\n    totalBytes: payload.length / 2,\n    status: 'IBEACON_ADV_PDU_PACKED_NOMINAL'\n  };\n}",
    "eHint": "Format 0201061aff4c000215 + uuid + majorHex + minorHex + txHex.",
    "eTest": "const res = buildIBeaconAdvPayload('e2c56db5-dffb-48d2-b060-d0f5a71096e0', 1, 100, -59);\nif (res.totalBytes !== 30 || !res.payloadHex.includes('4c000215')) throw new Error('iBeacon payload builder failed');",
    "aTitle": "BLE Advertising Channel Identifier",
    "aDesc": "Implement function isPrimaryAdvChannel(channelNum) returning true for channels 37, 38, 39.",
    "aStarter": "function isPrimaryAdvChannel(ch) { return [37, 38, 39].includes(ch); }",
    "aHint": "Check channels 37, 38, 39.",
    "aTest": "if (!isPrimaryAdvChannel(37) || isPrimaryAdvChannel(12)) throw new Error('Adv channel failed');"
  },
  {
    "day": 4,
    "title": "BLE GATT Architecture: Services, Characteristics & Descriptors",
    "desc": "Build connected BLE applications: Generic Attribute Profile (GATT) Server/Client, Primary Services, 128-bit Custom UUIDs, Read/Write/Notify/Indicate permissions, and CCCD descriptors.",
    "syllabus": [
      "GATT Hierarchy: Server $\\to$ Service $\\to$ Characteristic $\\to$ Descriptor (CCCD `0x2902`).",
      "Properties: Read, Write, Write Without Response, Notify (Unacknowledged stream), Indicate (Acknowledged).",
      "Attribute Protocol (ATT) MTU Negotiation (Default 23 bytes $\\to$ 512 bytes)."
    ],
    "eTitle": "BLE GATT Characteristic Read/Write Permission Enforcer",
    "eDesc": "Implement function evaluateGattOperation(characteristic, operationType, callerSecurityLevel) validating permissions before dispatching attribute handlers.",
    "eStarter": "function evaluateGattOperation(char, op, secLevel = 'OPEN') {\n  // char = { uuid: '2A37', properties: ['READ', 'NOTIFY'], requiresAuth: false }\n  if (!char.properties.includes(op)) {\n    return { permitted: false, error: 'GATT_OPERATION_NOT_SUPPORTED' };\n  }\n  if (char.requiresAuth && secLevel !== 'AUTHENTICATED_ENCRYPTED') {\n    return { permitted: false, error: 'GATT_INSUFFICIENT_AUTHENTICATION' };\n  }\n  return { permitted: true, characteristicUuid: char.uuid, operation: op, status: 'GATT_ACCESS_GRANTED' };\n}",
    "eHint": "Verify op is in properties and auth conditions are satisfied.",
    "eTest": "const char = { uuid: '2A19', properties: ['READ'], requiresAuth: true };\nconst fail = evaluateGattOperation(char, 'READ', 'OPEN');\nconst ok = evaluateGattOperation(char, 'READ', 'AUTHENTICATED_ENCRYPTED');\nif (fail.permitted || !ok.permitted || fail.error !== 'GATT_INSUFFICIENT_AUTHENTICATION') throw new Error('GATT permission check failed');",
    "aTitle": "CCCD Notify Bitmask Formatter",
    "aDesc": "Implement function formatCccdBitmask(notifyEnabled, indicateEnabled) returning `0x0001` (Notify), `0x0002` (Indicate), `0x0003` (Both), `0x0000` (None).",
    "aStarter": "function formatCccdBitmask(n, i) { let mask = 0; if (n) mask |= 1; if (i) mask |= 2; return `0x000${mask}`; }",
    "aHint": "Return bitmask string.",
    "aTest": "if (formatCccdBitmask(true, false) !== '0x0001' || formatCccdBitmask(true, true) !== '0x0003') throw new Error('CCCD mask failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete BLE / Wi-Fi Multi-Radio Embedded Gateway Engine",
    "desc": "Milestone 1: Build a production embedded multi-radio gateway: BLE GATT sensor collector, iBeacon proximity scanner, Wi-Fi Station provisioner, LwIP TCP socket stream manager, and Link Budget auditor.",
    "syllabus": [
      "Multi-Radio Coexistence: Timesharing 2.4 GHz antenna between Wi-Fi and BLE.",
      "GATT Characteristic streaming to TCP socket gateway.",
      "Production Multi-Radio Invariant verification."
    ],
    "eTitle": "Multi-Radio Gateway Master Controller",
    "eDesc": "Implement function processGatewayPacketBatch(blePackets, wifiSocket) converting BLE GATT sensor telemetry into TCP socket wire frames.",
    "eStarter": "function processGatewayPacketBatch(blePackets, socket) {\n  let forwarded = 0;\n  for (const pkt of blePackets) {\n    if (pkt.valid && socket.connected) {\n      socket.buffer.push(`FRAME_TCP_${pkt.sensorId}_${pkt.value}`);\n      forwarded++;\n    }\n  }\n  return {\n    totalBlePacketsReceived: blePackets.length,\n    packetsForwardedToWifi: forwarded,\n    socketBufferDepth: socket.buffer.length,\n    status: 'MULTI_RADIO_GATEWAY_FORWARDING_ACTIVE'\n  };\n}",
    "eHint": "Push valid packets to socket buffer and count forwarded items.",
    "eTest": "const socket = { connected: true, buffer: [] };\nconst pkts = [{ valid: true, sensorId: 'TEMP', value: 24.5 }, { valid: false }];\nconst res = processGatewayPacketBatch(pkts, socket);\nif (res.packetsForwardedToWifi !== 1 || socket.buffer.length !== 1 || res.status !== 'MULTI_RADIO_GATEWAY_FORWARDING_ACTIVE') throw new Error('Milestone 1 gateway failed');",
    "aTitle": "Radio Coexistence Slot Allocator",
    "aDesc": "Implement function allocateCoexistenceSlots(wifiDutyPercent = 70) returning `{ wifiMs: 70, bleMs: 30 }`.",
    "aStarter": "function allocateCoexistenceSlots(w = 70) { return { wifiMs: w, bleMs: 100 - w }; }",
    "aHint": "Split 100ms cycle.",
    "aTest": "if (allocateCoexistenceSlots(60).bleMs !== 40) throw new Error('Coex slot failed');"
  },
  {
    "day": 6,
    "title": "BLE Mesh: Managed Flooding, Relays & Provisioning",
    "desc": "Scale Bluetooth to thousands of nodes: BLE Mesh architecture, Managed Flooding, Time-To-Live (TTL) hop decrementers, Message Cache deduplication, and Relay / Low-Power Nodes (LPN).",
    "syllabus": [
      "BLE Mesh Network Layer: Managed Flooding with IV Index and Sequence Numbers.",
      "Node Roles: Provisioner, Relay Node, Friend Node, Low-Power Node (LPN) with Poll Timeout sleep.",
      "Message Cache & TTL: Preventing infinite broadcast loops and broadcast storms."
    ],
    "eTitle": "BLE Mesh Managed Flooding Relay Router",
    "eDesc": "Implement function routeBleMeshMessage(messageCache, packet) deduplicating received mesh messages and decrementing TTL before re-relaying.",
    "eStarter": "function routeBleMeshMessage(cache, pkt) {\n  const msgKey = `${pkt.sourceAddress}_${pkt.sequenceNumber}`;\n  if (cache.has(msgKey)) {\n    return { relayed: false, reason: 'DUPLICATE_MESSAGE_DROPPED' };\n  }\n  cache.add(msgKey);\n  if (pkt.ttl <= 1) {\n    return { relayed: false, reason: 'TTL_EXPIRED_HOP_LIMIT_REACHED' };\n  }\n  return {\n    relayed: true,\n    source: pkt.sourceAddress,\n    newTtl: pkt.ttl - 1,\n    status: 'MESH_MESSAGE_RELAYED_TO_FLOOD_NETWORK'\n  };\n}",
    "eHint": "Check cache for duplicates and ensure ttl > 1 before relaying with ttl - 1.",
    "eTest": "const cache = new Set();\nconst pkt = { sourceAddress: '0x0001', sequenceNumber: 42, ttl: 5 };\nconst r1 = routeBleMeshMessage(cache, pkt);\nconst r2 = routeBleMeshMessage(cache, pkt); // Duplicate\nif (!r1.relayed || r1.newTtl !== 4 || r2.relayed || r2.reason !== 'DUPLICATE_MESSAGE_DROPPED') throw new Error('BLE mesh relay routing failed');",
    "aTitle": "BLE Mesh Friend Poll Interval Calculator",
    "aDesc": "Implement function getFriendPollIntervalMs(pollTimeoutSec) returning `pollTimeoutSec * 100`.",
    "aStarter": "function getFriendPollIntervalMs(s) { return s * 100; }",
    "aHint": "Multiply seconds by 100.",
    "aTest": "if (getFriendPollIntervalMs(10) !== 1000) throw new Error('Poll calc failed');"
  },
  {
    "day": 7,
    "title": "Zigbee (IEEE 802.15.4) & Thread IPv6 Wireless Mesh",
    "desc": "Compare industrial wireless mesh networks: IEEE 802.15.4 O-QPSK physical layer, Zigbee Cluster Library (ZCL) PAN coordinator/router trees, and Thread 6LoWPAN IPv6 mesh with Border Routers.",
    "syllabus": [
      "IEEE 802.15.4 PHY/MAC: 2.4 GHz, 250 kbps, 16 channels (11..26), CSMA-CA channel access.",
      "Zigbee PRO Topology: Single PAN Coordinator, Mesh Routers, and Sleepy End Devices (SED).",
      "Thread Protocol: IPv6 native, no coordinator single point of failure (Self-healing Leader/Router election), Border Router integration."
    ],
    "eTitle": "Zigbee / Thread Mesh Neighbor Table Router",
    "eDesc": "Implement function selectBestMeshRoute(neighborTable, destinationAddress) selecting next-hop router with lowest Path Cost (LQI / RSSI metric).",
    "eStarter": "function selectBestMeshRoute(neighbors, dest) {\n  const routes = neighbors.filter(n => n.canRouteTo === dest);\n  if (routes.length === 0) return { routeFound: false, error: 'NO_ROUTE_TO_DESTINATION' };\n  routes.sort((a, b) => a.pathCost - b.pathCost); // Lower path cost is better\n  const best = routes[0];\n  return {\n    routeFound: true,\n    destination: dest,\n    nextHopAddress: best.neighborAddress,\n    pathCost: best.pathCost,\n    linkQuality: best.lqi,\n    status: 'OPTIMAL_MESH_ROUTE_SELECTED'\n  };\n}",
    "eHint": "Filter by destination and sort by lowest pathCost.",
    "eTest": "const neighbors = [{ neighborAddress: '0x0002', canRouteTo: '0x0005', pathCost: 15, lqi: 200 }, { neighborAddress: '0x0003', canRouteTo: '0x0005', pathCost: 8, lqi: 240 }];\nconst res = selectBestMeshRoute(neighbors, '0x0005');\nif (!res.routeFound || res.nextHopAddress !== '0x0003' || res.pathCost !== 8) throw new Error('Mesh routing failed');",
    "aTitle": "802.15.4 Channel Frequency Calculator",
    "aDesc": "Implement function get802154FreqMhz(channel) returning `2405 + 5 * (channel - 11)`.",
    "aStarter": "function get802154FreqMhz(ch) { return 2405 + 5 * (ch - 11); }",
    "aHint": "Calculate channel frequency.",
    "aTest": "if (get802154FreqMhz(11) !== 2405 || get802154FreqMhz(26) !== 2480) throw new Error('Channel freq failed');"
  },
  {
    "day": 8,
    "title": "LoRa & Chirp Spread Spectrum (CSS) Modulation",
    "desc": "Master long-range physics: Semtech LoRa Chirp Spread Spectrum (CSS), Spreading Factors (SF7..SF12), Bandwidth (125/250/500 kHz), Coding Rates (4/5..4/8), and Processing Gain.",
    "syllabus": [
      "LoRa CSS Modulation: Up-chirps, Down-chirps, and Symbol duration ($T_s = \\frac{2^{\\text{SF}}}{\\text{BW}}$).",
      "Processing Gain: Operating up to 20 dB below the RF thermal noise floor ($-137\\text{ dBm}$ sensitivity).",
      "Orthogonality of Spreading Factors: Multiple nodes transmitting simultaneously on the same frequency with different SFs without collisions."
    ],
    "eTitle": "LoRa Symbol Duration & Bitrate Calculator",
    "eDesc": "Implement function calculateLoraMetrics(sf, bwHz = 125000, codingRateDenom = 5) calculating symbol duration and raw data bitrate.",
    "eStarter": "function calculateLoraMetrics(sf, bw = 125000, cr = 5) {\n  const symbolDurationMs = (Math.pow(2, sf) / bw) * 1000;\n  const rawBitrateBps = sf * (bw / Math.pow(2, sf)) * (4 / cr);\n  const snrThresholdDb = -7.5 - (sf - 7) * 2.5; // Sensitivity threshold\n  return {\n    spreadingFactor: sf,\n    bandwidthKhz: bw / 1000,\n    symbolDurationMs: Number(symbolDurationMs.toFixed(3)),\n    rawBitrateBps: Number(rawBitrateBps.toFixed(1)),\n    snrThresholdDb\n  };\n}",
    "eHint": "Compute Ts = (2^sf / bw)*1000 and bitrate = sf * (bw / 2^sf) * (4/cr).",
    "eTest": "const sf7 = calculateLoraMetrics(7, 125000, 5);\nconst sf12 = calculateLoraMetrics(12, 125000, 5);\nif (sf7.symbolDurationMs !== 1.024 || sf12.symbolDurationMs !== 32.768 || sf7.rawBitrateBps < 5000) throw new Error('LoRa metrics calculation failed');",
    "aTitle": "LoRa Processing Gain Calculator",
    "aDesc": "Implement function calculateProcessingGainDb(bwHz, bitRateBps) returning `10 * Math.log10(bwHz / bitRateBps)`.",
    "aStarter": "function calculateProcessingGainDb(bw, br) { return Number((10 * Math.log10(bw / br)).toFixed(1)); }",
    "aHint": "Compute 10 * log10(bw / br).",
    "aTest": "if (calculateProcessingGainDb(125000, 5000) !== 14.0) throw new Error('Processing gain failed');"
  },
  {
    "day": 9,
    "title": "LoRaWAN Network Architecture: End Devices, Gateways & Network Server",
    "desc": "Build global LoRaWAN topologies: Star-of-Stars architecture, 8-channel Gateway forwarders, Network Server deduplication, Join Server, and Application Server payloads.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LoRaWAN Network Architecture: End Devices, Gateways & Network Server.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRaWAN Gateway Frame Deduplicator",
    "eDesc": "Implement function deduplicateLoraGateways(gatewayReports) selecting frame with highest RSSI / SNR signal quality from multi-gateway receptions.",
    "eStarter": "function deduplicateLoraGateways(reports) {\n  if (reports.length === 0) return { count: 0, bestReport: null };\n  reports.sort((a, b) => b.rssiDbm - a.rssiDbm);\n  const best = reports[0];\n  return {\n    totalGatewaysHeard: reports.length,\n    selectedGatewayId: best.gatewayId,\n    bestRssiDbm: best.rssiDbm,\n    bestSnrDb: best.snrDb,\n    status: 'LORAWAN_FRAME_DEDUPLICATED'\n  };\n}",
    "eHint": "Sort reports descending by rssiDbm and return best gateway.",
    "eTest": "const reports = [{ gatewayId: 'GW_1', rssiDbm: -110, snrDb: -5 }, { gatewayId: 'GW_2', rssiDbm: -85, snrDb: 8 }];\nconst res = deduplicateLoraGateways(reports);\nif (res.selectedGatewayId !== 'GW_2' || res.totalGatewaysHeard !== 2) throw new Error('Deduplication failed');",
    "aTitle": "Gateway Channel Count Auditor",
    "aDesc": "Implement function isMultiChannelGateway(channels) returning true if channels >= 8.",
    "aStarter": "function isMultiChannelGateway(c) { return c >= 8; }",
    "aHint": "Check channels >= 8.",
    "aTest": "if (!isMultiChannelGateway(8) || isMultiChannelGateway(1)) throw new Error('GW channels failed');"
  },
  {
    "day": 10,
    "title": "LoRaWAN Activation: Over-The-Air (OTAA) vs ABP & Session Keys",
    "desc": "Authenticate LoRaWAN nodes securely: Join Request / Join Accept exchange, OTAA AES-128 cryptographic key derivation (`NwkSKey`, `AppSKey`), and Activation By Personalization (ABP) security pitfalls.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LoRaWAN Activation: Over-The-Air (OTAA) vs ABP & Session Keys.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRaWAN OTAA Session Key Derivation Simulator",
    "eDesc": "Implement function deriveOtaaSessionKeys(appKey, devNonce, appNonce, netId) generating simulated 16-byte NwkSKey and AppSKey.",
    "eStarter": "function deriveOtaaSessionKeys(appKey, devNonce, appNonce, netId) {\n  const nwkSKey = `0x_nwk_${appKey.slice(2, 6)}_${appNonce}_${devNonce}`;\n  const appSKey = `0x_app_${appKey.slice(2, 6)}_${appNonce}_${devNonce}`;\n  return {\n    networkSessionKey: nwkSKey,\n    appSessionKey: appSKey,\n    activationType: 'OTAA_DYNAMIC_SESSION',\n    status: 'KEYS_DERIVED_JOIN_ACCEPT_READY'\n  };\n}",
    "eHint": "Format simulated session keys with appKey, appNonce, and devNonce.",
    "eTest": "const res = deriveOtaaSessionKeys('0x0123456789abcdef', 101, 202, '000013');\nif (!res.networkSessionKey.includes('202') || res.status !== 'KEYS_DERIVED_JOIN_ACCEPT_READY') throw new Error('OTAA key derivation failed');",
    "aTitle": "DevNonce Replay Detector",
    "aDesc": "Implement function checkDevNonceUsed(usedSet, nonce) returning true if nonce is already in set.",
    "aStarter": "function checkDevNonceUsed(s, n) { return s.has(n); }",
    "aHint": "Check set membership.",
    "aTest": "if (!checkDevNonceUsed(new Set([42]), 42)) throw new Error('Nonce check failed');"
  },
  {
    "day": 11,
    "title": "LoRaWAN Device Classes: Class A, Class B & Class C",
    "desc": "Optimize battery vs latency: Class A (Battery-optimized: RX1/RX2 windows only after uplink), Class B (Beacon-synchronized periodic receive slots), and Class C (Continuous mains-powered listening).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LoRaWAN Device Classes: Class A, Class B & Class C.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRaWAN Class A RX1 / RX2 Window Scheduler",
    "eDesc": "Implement function scheduleClassAReceiveWindows(uplinkEndTimestampMs, rx1DelayMs = 1000, rx2DelayMs = 2000) computing exact millisecond timestamps for downlink listening slots.",
    "eStarter": "function scheduleClassAReceiveWindows(uplinkEnd, rx1Delay = 1000, rx2Delay = 2000) {\n  return {\n    uplinkEndTimestampMs: uplinkEnd,\n    rx1WindowOpenMs: uplinkEnd + rx1Delay,\n    rx2WindowOpenMs: uplinkEnd + rx2Delay,\n    rx1DurationMs: 150,\n    rx2DurationMs: 150,\n    deviceClass: 'CLASS_A_BATTERY_OPTIMIZED'\n  };\n}",
    "eHint": "Compute rx1 = uplinkEnd + rx1Delay and rx2 = uplinkEnd + rx2Delay.",
    "eTest": "const res = scheduleClassAReceiveWindows(10000, 1000, 2000);\nif (res.rx1WindowOpenMs !== 11000 || res.rx2WindowOpenMs !== 12000) throw new Error('Class A schedule failed');",
    "aTitle": "Class C Power Mode Identifier",
    "aDesc": "Implement function isContinuousListeningClass(devClass) returning `devClass === 'CLASS_C'`.",
    "aStarter": "function isContinuousListeningClass(c) { return c === 'CLASS_C'; }",
    "aHint": "Check Class C.",
    "aTest": "if (!isContinuousListeningClass('CLASS_C')) throw new Error('Class check failed');"
  },
  {
    "day": 12,
    "title": "Time-on-Air (ToA) & Regional Duty Cycle Regulations",
    "desc": "Comply with European ETSI 1% duty cycle (36s airtime per hour) and US FCC dwell times: LoRa Time-on-Air packet mathematical calculation, Preamble symbols, and Header/CRC durations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Time-on-Air (ToA) & Regional Duty Cycle Regulations.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRa Time-on-Air (ToA) Exact Millisecond Calculator",
    "eDesc": "Implement function calculateLoraToaMs(sf, payloadBytes, bwHz = 125000, preambleSymbols = 8, cr = 1, explicitHeader = true) calculating precise packet airtime.",
    "eStarter": "function calculateLoraToaMs(sf, bytes, bw = 125000, preamble = 8, cr = 1, explicit = true) {\n  const tSym = (Math.pow(2, sf) / bw) * 1000; // Symbol time in ms\n  const tPreamble = (preamble + 4.25) * tSym;\n  // Payload symbol count formula:\n  const de = (sf >= 11) ? 1 : 0; // Low data rate optimization\n  const ih = explicit ? 0 : 1;\n  const num = 8 * bytes - 4 * sf + 28 + 16 - 20 * ih;\n  const denom = 4 * (sf - 2 * de);\n  const payloadSyms = 8 + Math.max(Math.ceil(num / denom) * (cr + 4), 0);\n  const tPayload = payloadSyms * tSym;\n  const totalToa = tPreamble + tPayload;\n  return {\n    spreadingFactor: sf,\n    payloadBytes: bytes,\n    timeOnAirMs: Number(totalToa.toFixed(2)),\n    preambleDurationMs: Number(tPreamble.toFixed(2))\n  };\n}",
    "eHint": "Compute symbol time, preamble time, payload symbols, and total time on air.",
    "eTest": "const sf7 = calculateLoraToaMs(7, 20, 125000, 8, 1, true);\nif (sf7.timeOnAirMs < 50 || sf7.timeOnAirMs > 75) throw new Error('LoRa ToA calculation failed');",
    "aTitle": "1% Duty Cycle Hourly Airtime Limit",
    "aDesc": "Implement function getMaxHourlyAirtimeSec(dutyPercent = 1) returning `3600 * (dutyPercent / 100)`.",
    "aStarter": "function getMaxHourlyAirtimeSec(d = 1) { return 3600 * (d / 100); }",
    "aHint": "Return 36 seconds for 1%.",
    "aTest": "if (getMaxHourlyAirtimeSec(1) !== 36) throw new Error('Airtime limit failed');"
  },
  {
    "day": 13,
    "title": "Cellular IoT: NB-IoT (Narrowband) & LTE-M (Cat-M1)",
    "desc": "Deploy cellular LPWAN: NB-IoT (200 kHz bandwidth, 20 dB link budget gain, PSM sleep) vs LTE-M (1.4 MHz bandwidth, VoLTE voice, mobile tower handover), and SIM/eSIM profiles.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cellular IoT: NB-IoT (Narrowband) & LTE-M (Cat-M1).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cellular LPWAN Technology Selector Engine",
    "eDesc": "Implement function selectCellularIotTechnology(requiresMobilityHandover, requiresVoice, targetDeepSleepCurrentUa) recommending NB-IoT vs LTE-M based on requirements.",
    "eStarter": "function selectCellularIotTechnology(mobility, voice, targetSleepUa) {\n  if (voice || mobility) {\n    return { selectedTech: 'LTE_M_CAT_M1', bandwidthKhz: 1400, supportsHandover: true, reason: 'MOBILITY_OR_VOICE_REQUIRED' };\n  }\n  return { selectedTech: 'NB_IOT_CAT_NB1', bandwidthKhz: 200, supportsHandover: false, reason: 'STATIONARY_DEEP_PENETRATION_LOW_POWER' };\n}",
    "eHint": "Select LTE-M if voice/mobility required; else NB-IoT.",
    "eTest": "const carTracker = selectCellularIotTechnology(true, false, 5);\nconst waterMeter = selectCellularIotTechnology(false, false, 3);\nif (carTracker.selectedTech !== 'LTE_M_CAT_M1' || waterMeter.selectedTech !== 'NB_IOT_CAT_NB1') throw new Error('Cellular selector failed');",
    "aTitle": "Cellular Bandwidth Formatter",
    "aDesc": "Implement function formatCellularBw(tech) returning '200 kHz' for NB-IoT or '1.4 MHz' for LTE-M.",
    "aStarter": "function formatCellularBw(t) { return t === 'NB-IoT' ? '200 kHz' : '1.4 MHz'; }",
    "aHint": "Format bandwidth string.",
    "aTest": "if (formatCellularBw('NB-IoT') !== '200 kHz') throw new Error('Bw format failed');"
  },
  {
    "day": 14,
    "title": "Cellular Power Saving Modes: PSM & eDRX Timers",
    "desc": "Achieve 10-year battery life on cellular: Power Saving Mode (PSM: T3324 Active Timer vs T3412 Periodic TAU Timer ~3 uA sleep) and extended Discontinuous Reception (eDRX).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cellular Power Saving Modes: PSM & eDRX Timers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cellular PSM Battery Life & Energy Calculator",
    "eDesc": "Implement function calculateCellularBatteryLifeYears(batteryMah = 3000, activeCurrentMa = 100, activeSecondsPerDay = 10, psmSleepCurrentUa = 3.5) estimating battery runtime in years.",
    "eStarter": "function calculateCellularBatteryLifeYears(batteryMah = 3000, activeMa = 100, activeSec = 10, psmUa = 3.5) {\n  const activeMahPerDay = (activeMa * (activeSec / 3600));\n  const sleepMahPerDay = ((psmUa / 1000) * ((86400 - activeSec) / 3600));\n  const totalMahPerDay = activeMahPerDay + sleepMahPerDay;\n  const totalDays = batteryMah / totalMahPerDay;\n  const years = totalDays / 365.25;\n  return {\n    dailyConsumptionMah: Number(totalMahPerDay.toFixed(4)),\n    estimatedRuntimeDays: Math.floor(totalDays),\n    estimatedRuntimeYears: Number(years.toFixed(1)),\n    status: years >= 5.0 ? 'TEN_YEAR_BATTERY_GOAL_ACHIEVED' : 'BATTERY_DEPLETES_PREMATURELY'\n  };\n}",
    "eHint": "Compute active and sleep mAh per day and divide battery capacity.",
    "eTest": "const res = calculateCellularBatteryLifeYears(3000, 100, 10, 3.5);\nif (res.estimatedRuntimeYears < 15 || res.status !== 'TEN_YEAR_BATTERY_GOAL_ACHIEVED') throw new Error('Battery life calculation failed');",
    "aTitle": "T3324 Active Timer Formatter",
    "aDesc": "Implement function formatT3324TimerSec(multiplier, unitMultiplierSec = 2) returning `${multiplier * unitMultiplierSec} seconds`.",
    "aStarter": "function formatT3324TimerSec(m, u = 2) { return `${m * u} seconds`; }",
    "aHint": "Multiply multiplier by unit seconds.",
    "aTest": "if (formatT3324TimerSec(10, 2) !== '20 seconds') throw new Error('Timer format failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine",
    "desc": "Milestone 2: Build a production long-range telemetry platform: LoRaWAN OTAA session key deriver, Time-on-Air duty cycle limiter, Class A RX window scheduler, and Cellular NB-IoT PSM power estimator.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Long-Range LPWAN Telemetry Engine",
    "eDesc": "Implement function processLpwanTelemetryCycle(loraNode, cellularNode, channelDutyLimiter) orchestrating dual LPWAN telemetry transmissions under airtime regulations.",
    "eStarter": "function processLpwanTelemetryCycle(lora, cell, duty) {\n  const loraAllowed = (duty.usedAirtimeSec + lora.toaSec) <= duty.maxAirtimeSec;\n  if (loraAllowed) {\n    duty.usedAirtimeSec += lora.toaSec;\n  }\n  return {\n    loraTransmitted: loraAllowed,\n    cellularTransmitted: cell.psmActive,\n    remainingDutyAirtimeSec: Number((duty.maxAirtimeSec - duty.usedAirtimeSec).toFixed(2)),\n    status: 'LPWAN_TELEMETRY_ENGINE_OPERATIONAL'\n  };\n}",
    "eHint": "Check duty cycle airtime and transmit if allowed.",
    "eTest": "const duty = { usedAirtimeSec: 10, maxAirtimeSec: 36 };\nconst res = processLpwanTelemetryCycle({ toaSec: 1.5 }, { psmActive: true }, duty);\nif (!res.loraTransmitted || !res.cellularTransmitted || res.remainingDutyAirtimeSec !== 24.5) throw new Error('Milestone 2 LPWAN failed');",
    "aTitle": "LPWAN Engine Health Check",
    "aDesc": "Implement function auditLpwanHealth() returning `{ status: 'HEALTHY', subGhzReady: true, cellularReady: true }`.",
    "aStarter": "function auditLpwanHealth() { return { status: 'HEALTHY', subGhzReady: true, cellularReady: true }; }",
    "aHint": "Return health object.",
    "aTest": "if (auditLpwanHealth().status !== 'HEALTHY') throw new Error('Health check failed');"
  },
  {
    "day": 16,
    "title": "CoAP (Constrained Application Protocol) & UDP REST",
    "desc": "Implement RESTful architectures on microcontrollers: CoAP (RFC 7252) binary header packing, Confirmable (CON) vs Non-Confirmable (NON) messages, Token tracking, and Observe resource subscriptions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of CoAP (Constrained Application Protocol) & UDP REST.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CoAP Binary Header Packet Encoder",
    "eDesc": "Implement function encodeCoapHeader(version = 1, type = 0, tokenLength = 4, code = '0.01', messageId = 1234) packing CoAP 4-byte header bitfields.",
    "eStarter": "function encodeCoapHeader(ver = 1, type = 0, tkl = 4, code = '0.01', msgId = 1234) {\n  const byte0 = ((ver & 0x03) << 6) | ((type & 0x03) << 4) | (tkl & 0x0F);\n  const [codeClass, codeDetail] = code.split('.').map(Number);\n  const byte1 = ((codeClass & 0x07) << 5) | (codeDetail & 0x1F);\n  const byte2 = (msgId >> 8) & 0xFF;\n  const byte3 = msgId & 0xFF;\n  const headerBytes = [byte0, byte1, byte2, byte3];\n  return {\n    version: ver,\n    type: type === 0 ? 'CON' : (type === 1 ? 'NON' : 'ACK'),\n    codeString: code,\n    messageId: msgId,\n    headerHex: headerBytes.map(b => b.toString(16).padStart(2, '0')).join(''),\n    status: 'COAP_HEADER_PACKED_NOMINAL'\n  };\n}",
    "eHint": "Pack (ver<<6)|(type<<4)|tkl into byte 0, (codeClass<<5)|codeDetail into byte 1, and msgId into bytes 2 and 3.",
    "eTest": "const res = encodeCoapHeader(1, 0, 0, '0.01', 0x1234); // GET CON\nif (res.headerHex !== '40011234' || res.type !== 'CON') throw new Error('CoAP header encode failed');",
    "aTitle": "CoAP Method Code Formatter",
    "aDesc": "Implement function getCoapCode(method) returning '0.01' (GET), '0.02' (POST), '0.03' (PUT), '0.04' (DELETE).",
    "aStarter": "function getCoapCode(m) { const map = { GET: '0.01', POST: '0.02', PUT: '0.03', DELETE: '0.04' }; return map[m] || '0.00'; }",
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
    "eStarter": "function registerMqttSnTopic(table, topicStr) {\n  if (!table[topicStr]) {\n    const nextId = Object.keys(table).length + 1;\n    table[topicStr] = nextId;\n  }\n  return {\n    topicName: topicStr,\n    assignedTopicId: table[topicStr],\n    bytesSavedVsString: Math.max(0, topicStr.length - 2),\n    status: 'TOPIC_REGISTERED_MQTTSN_OPTIMAL'\n  };\n}",
    "eHint": "Assign next integer ID and compute bytes saved vs sending topic string.",
    "eTest": "const table = {};\nconst res = registerMqttSnTopic(table, 'sensors/factory/line1/temp');\nif (res.assignedTopicId !== 1 || res.bytesSavedVsString !== 25) throw new Error('MQTT-SN registration failed');",
    "aTitle": "MQTT-SN MsgType Code Formatter",
    "aDesc": "Implement function getMqttSnMsgType(name) returning `0x0A` (REGISTER), `0x0C` (PUBLISH), `0x14` (DISCONNECT).",
    "aStarter": "function getMqttSnMsgType(n) { const m = { REGISTER: '0x0A', PUBLISH: '0x0C', DISCONNECT: '0x14' }; return m[n] || '0x00'; }",
    "aHint": "Map name to hex code.",
    "aTest": "if (getMqttSnMsgType('PUBLISH') !== '0x0C') throw new Error('MsgType failed');"
  },
  {
    "day": 18,
    "title": "Compact Binary Serializations: CBOR & MessagePack",
    "desc": "Eliminate JSON overhead on microcontrollers: CBOR (Concise Binary Object Representation RFC 8949) vs MessagePack, Major Types (0..7), Compact Bitfields, and 80% payload size reduction.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Compact Binary Serializations: CBOR & MessagePack.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Compact Binary Payload Size & Savings Evaluator",
    "eDesc": "Implement function evaluateBinarySerialization(jsonPayloadObject) estimating JSON vs CBOR encoded byte sizes.",
    "eStarter": "function evaluateBinarySerialization(obj) {\n  const jsonStr = JSON.stringify(obj);\n  const jsonBytes = jsonStr.length;\n  // Simulated CBOR byte packing: 1 byte per key + compact value bytes\n  const cborBytes = Math.floor(jsonBytes * 0.35); // ~65% reduction\n  const savingsPercent = ((jsonBytes - cborBytes) / jsonBytes) * 100;\n  return {\n    jsonSizeFormattedBytes: jsonBytes,\n    cborSizeEncodedBytes: cborBytes,\n    bandwidthSavingsPercent: Number(savingsPercent.toFixed(1)),\n    status: 'CBOR_BINARY_SERIALIZATION_OPTIMAL'\n  };\n}",
    "eHint": "Compute jsonBytes, estimate cborBytes, and calculate savings percentage.",
    "eTest": "const res = evaluateBinarySerialization({ temperature: 24.55, humidity: 62.1, pressure: 101325, deviceId: 'SENSOR_NODE_001' });\nif (res.bandwidthSavingsPercent < 60 || res.status !== 'CBOR_BINARY_SERIALIZATION_OPTIMAL') throw new Error('Binary serialization test failed');",
    "aTitle": "CBOR Major Type Identifier",
    "aDesc": "Implement function getCborMajorType(headerByte) returning `(headerByte >> 5) & 0x07`.",
    "aStarter": "function getCborMajorType(b) { return (b >> 5) & 0x07; }",
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
    "eStarter": "function validateDtlsPskHandshake(clientId, store, expectedId) {\n  const key = store[clientId];\n  const isMatch = (clientId === expectedId) && Boolean(key);\n  return {\n    clientIdentity: clientId,\n    keyFound: Boolean(key),\n    sessionEstablished: isMatch,\n    status: isMatch ? 'DTLS_SECURE_SESSION_ESTABLISHED' : 'DTLS_HANDSHAKE_REJECTED_UNKNOWN_PSK'\n  };\n}",
    "eHint": "Verify clientId matches expected and key exists in store.",
    "eTest": "const store = { 'client_mcu_01': '0xSecretPskKey' };\nconst res = validateDtlsPskHandshake('client_mcu_01', store, 'client_mcu_01');\nif (!res.sessionEstablished || res.status !== 'DTLS_SECURE_SESSION_ESTABLISHED') throw new Error('DTLS handshake failed');",
    "aTitle": "DTLS Record Epoch Incrementor",
    "aDesc": "Implement function incrementDtlsEpoch(epoch) returning `epoch + 1`.",
    "aStarter": "function incrementDtlsEpoch(e) { return e + 1; }",
    "aHint": "Increment epoch number.",
    "aTest": "if (incrementDtlsEpoch(0) !== 1) throw new Error('Epoch inc failed');"
  },
  {
    "day": 20,
    "title": "6LoWPAN: IPv6 Header Compression (LOWPAN_IPHC)",
    "desc": "Fit 128-bit IPv6 packets into 127-byte 802.15.4 frames: 6LoWPAN (RFC 6282), LOWPAN_IPHC header compression (40-byte IPv6 + 8-byte UDP $\\to$ 6 bytes!), and Mesh Under vs Route Over.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 6LoWPAN: IPv6 Header Compression (LOWPAN_IPHC).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "6LoWPAN Header Compression Ratio Calculator",
    "eDesc": "Implement function calculate6lowpanCompression(ipv6HeaderBytes = 40, udpHeaderBytes = 8, compressedBytes = 6) calculating compression efficiency.",
    "eStarter": "function calculate6lowpanCompression(ip = 40, udp = 8, comp = 6) {\n  const uncompressedTotal = ip + udp;\n  const reductionPercent = ((uncompressedTotal - comp) / uncompressedTotal) * 100;\n  return {\n    uncompressedHeaderBytes: uncompressedTotal,\n    compressed6lowpanBytes: comp,\n    headerReductionPercent: Number(reductionPercent.toFixed(1)),\n    fitsInSingle802154Frame: true,\n    status: '6LOWPAN_IPHC_HEADER_COMPRESSED_SUCCESS'\n  };\n}",
    "eHint": "Compute reduction from 48 bytes to 6 bytes.",
    "eTest": "const res = calculate6lowpanCompression(40, 8, 6);\nif (res.headerReductionPercent !== 87.5 || !res.fitsInSingle802154Frame) throw new Error('6LoWPAN compression failed');",
    "aTitle": "6LoWPAN Dispatch Byte Formatter",
    "aDesc": "Implement function getIphcDispatchByte() returning `0x60` (LOWPAN_IPHC).",
    "aStarter": "function getIphcDispatchByte() { return '0x60'; }",
    "aHint": "Return 0x60 dispatch byte.",
    "aTest": "if (getIphcDispatchByte() !== '0x60') throw new Error('Dispatch byte failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production Constrained Protocol & Security Engine",
    "desc": "Milestone 3: Build a production constrained communications stack: CoAP binary header encoder, MQTT-SN topic registry, CBOR binary serializer, DTLS PSK session manager, and 6LoWPAN header compressor.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Production Constrained Protocol & Security Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Constrained Protocol Master Engine",
    "eDesc": "Implement function processConstrainedPacketCycle(coapPacket, cborPayload, dtlsSession) encoding, compressing, and encrypting packet for 802.15.4 transmission.",
    "eStarter": "function processConstrainedPacketCycle(coap, cbor, dtls) {\n  const isEncrypted = dtls.connected;\n  const totalWireBytes = coap.headerBytes + cbor.byteLength + (isEncrypted ? 13 : 0);\n  return {\n    protocol: 'COAP_OVER_DTLS_6LOWPAN',\n    payloadCborBytes: cbor.byteLength,\n    totalWireFrameBytes: totalWireBytes,\n    isEncrypted,\n    status: 'CONSTRAINED_PROTOCOL_PACKET_DISPATCHED'\n  };\n}",
    "eHint": "Compute wire bytes with optional DTLS header and verify dispatch status.",
    "eTest": "const res = processConstrainedPacketCycle({ headerBytes: 4 }, { byteLength: 18 }, { connected: true });\nif (res.totalWireFrameBytes !== 35 || res.status !== 'CONSTRAINED_PROTOCOL_PACKET_DISPATCHED') throw new Error('Milestone 3 protocol failed');",
    "aTitle": "Constrained Stack Auditor",
    "aDesc": "Implement function auditConstrainedStack() returning `{ certified: true, tier: 'CONSTRAINED_IOT_READY' }`.",
    "aStarter": "function auditConstrainedStack() { return { certified: true, tier: 'CONSTRAINED_IOT_READY' }; }",
    "aHint": "Return certification object.",
    "aTest": "if (!auditConstrainedStack().certified) throw new Error('Stack audit failed');"
  },
  {
    "day": 22,
    "title": "RPL (Routing Protocol for Low-Power and Lossy Networks)",
    "desc": "Route packets in lossy mesh networks: RPL (RFC 6550), Destination-Oriented Directed Acyclic Graphs (DODAG), Trickle Timer algorithm, and Objective Functions (OF0 vs MRHOF).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of RPL (Routing Protocol for Low-Power and Lossy Networks).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "RPL DODAG Rank Calculator & Loop Detector",
    "eDesc": "Implement function calculateRplRank(parentRank, minHopRankIncrease = 256, step = 1) ensuring child rank is strictly greater than parent to prevent routing loops.",
    "eStarter": "function calculateRplRank(pRank, minHop = 256, step = 1) {\n  const newRank = pRank + (minHop * step);\n  const isLoopFree = newRank > pRank;\n  return {\n    parentRank: pRank,\n    calculatedNodeRank: newRank,\n    isLoopFree,\n    status: isLoopFree ? 'RPL_RANK_VALID_LOOP_FREE' : 'RPL_RANK_ERROR_LOOP_HAZARD'\n  };\n}",
    "eHint": "Compute newRank = pRank + (minHop * step) and verify newRank > pRank.",
    "eTest": "const res = calculateRplRank(512, 256, 2);\nif (res.calculatedNodeRank !== 1024 || !res.isLoopFree) throw new Error('RPL rank calc failed');",
    "aTitle": "Trickle Timer Doubler",
    "aDesc": "Implement function doubleTrickleInterval(currentI, maxI = 16) returning `Math.min(currentI * 2, maxI)`.",
    "aStarter": "function doubleTrickleInterval(i, maxI = 16) { return Math.min(i * 2, maxI); }",
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
    "eStarter": "function calculateVswrAndEfficiency(s11Db) {\n  const gamma = Math.pow(10, -Math.abs(s11Db) / 20); // Reflection coefficient\n  const vswr = (1 + gamma) / (1 - gamma);\n  const radiatedPercent = (1 - (gamma * gamma)) * 100;\n  const isGoodMatch = s11Db <= -10; // -10 dB is standard RF match (VSWR < 1.92)\n  return {\n    s11ReturnLossDb: s11Db,\n    reflectionCoefficient: Number(gamma.toFixed(3)),\n    vswr: Number(vswr.toFixed(2)),\n    radiatedPowerPercent: Number(radiatedPercent.toFixed(1)),\n    antennaMatchingQuality: isGoodMatch ? 'EXCELLENT_50_OHM_MATCH' : 'POOR_MATCH_HIGH_RF_REFLECTION'\n  };\n}",
    "eHint": "Compute gamma = 10^(-|s11|/20), vswr = (1+gamma)/(1-gamma), radiatedPercent = (1-gamma^2)*100.",
    "eTest": "const good = calculateVswrAndEfficiency(-20);\nconst bad = calculateVswrAndEfficiency(-3);\nif (good.vswr > 1.3 || bad.vswr < 5.0 || good.antennaMatchingQuality !== 'EXCELLENT_50_OHM_MATCH') throw new Error('VSWR calculation failed');",
    "aTitle": "Quarter-Wave Antenna Length Calculator",
    "aDesc": "Implement function getQuarterWaveLengthMm(freqMhz) returning `(299792 / (4 * freqMhz))`.",
    "aStarter": "function getQuarterWaveLengthMm(f) { return Number((299792 / (4 * f)).toFixed(1)); }",
    "aHint": "Compute c / (4 * f).",
    "aTest": "if (getQuarterWaveLengthMm(868) < 85 || getQuarterWaveLengthMm(868) > 87) throw new Error('Antenna length failed');"
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
    "eStarter": "function parseAtResponse(raw, cmd) {\n  const hasOk = raw.includes('OK');\n  const hasError = raw.includes('ERROR');\n  if (hasError) return { success: false, command: cmd, error: 'MODEM_AT_COMMAND_ERROR' };\n  if (hasOk) {\n    return { success: true, command: cmd, responseText: raw.trim(), status: 'MODEM_RESPONSE_OK' };\n  }\n  return { success: false, command: cmd, status: 'MODEM_AWAITING_RESPONSE_TIMEOUT' };\n}",
    "eHint": "Check buffer for OK and ERROR strings.",
    "eTest": "const ok = parseAtResponse('AT+CSQ\\r\\n+CSQ: 24,99\\r\\nOK\\r\\n', 'AT+CSQ');\nconst err = parseAtResponse('AT+CGATT=1\\r\\nERROR\\r\\n', 'AT+CGATT=1');\nif (!ok.success || err.success || ok.status !== 'MODEM_RESPONSE_OK') throw new Error('AT parser failed');",
    "aTitle": "CSQ to dBm Signal Converter",
    "aDesc": "Implement function csqToDbm(csq) returning `-113 + 2 * csq`.",
    "aStarter": "function csqToDbm(c) { return -113 + 2 * c; }",
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
    "eStarter": "function validateWirelessFrameCounter(last, incoming) {\n  const isValid = incoming > last;\n  return {\n    lastReceivedCounter: last,\n    incomingCounter: incoming,\n    isAuthentic: isValid,\n    status: isValid ? 'FRAME_COUNTER_VALID_ACCEPTED' : 'REPLAY_ATTACK_DETECTED_FRAME_DROPPED'\n  };\n}",
    "eHint": "Verify incoming > last counter.",
    "eTest": "const ok = validateWirelessFrameCounter(100, 101);\nconst replay = validateWirelessFrameCounter(100, 95);\nif (!ok.isAuthentic || replay.isAuthentic || replay.status !== 'REPLAY_ATTACK_DETECTED_FRAME_DROPPED') throw new Error('Frame counter test failed');",
    "aTitle": "RF Jamming Detector",
    "aDesc": "Implement function detectRfJamming(rssiNoiseFloorDbm, thresholdDbm = -75) returning `rssiNoiseFloorDbm >= thresholdDbm`.",
    "aStarter": "function detectRfJamming(n, t = -75) { return n >= t; }",
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
    "eStarter": "function reconstructFuotaFirmware(received, required = 100, redundancy = 20) {\n  const canReconstruct = received >= required;\n  const packetLossPercent = Math.max(0, (((required + redundancy) - received) / (required + redundancy)) * 100);\n  return {\n    fragmentsReceived: received,\n    fragmentsRequired: required,\n    reconstructionPossible: canReconstruct,\n    toleratedPacketLossPercent: Number(packetLossPercent.toFixed(1)),\n    status: canReconstruct ? 'FUOTA_FIRMWARE_RECONSTRUCTION_SUCCESS' : 'INSUFFICIENT_FRAGMENTS_IMAGE_INCOMPLETE'\n  };\n}",
    "eHint": "Verify received >= required fragments.",
    "eTest": "const ok = reconstructFuotaFirmware(105, 100, 20);\nconst fail = reconstructFuotaFirmware(90, 100, 20);\nif (!ok.reconstructionPossible || fail.reconstructionPossible || ok.status !== 'FUOTA_FIRMWARE_RECONSTRUCTION_SUCCESS') throw new Error('FUOTA test failed');",
    "aTitle": "Firmware Fragment Count Calculator",
    "aDesc": "Implement function calculateFragmentCount(firmwareSizeBytes, fragmentSizeBytes = 200) returning `Math.ceil(firmwareSizeBytes / fragmentSizeBytes)`.",
    "aStarter": "function calculateFragmentCount(fw, frag = 200) { return Math.ceil(fw / frag); }",
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
    "eStarter": "function optimizeEnergyDutyCycle(harvestMw, activeMw, sleepMw = 0.01, activeMs = 50) {\n  // Energy in = Energy out -> harvestMw * T = activeMw * (activeMs/1000) + sleepMw * (T - activeMs/1000)\n  const activeJoules = (activeMw / 1000) * (activeMs / 1000);\n  const netHarvestPerSec = (harvestMw - sleepMw) / 1000;\n  if (netHarvestPerSec <= 0) return { sustainable: false, minIntervalSec: -1 };\n  const minIntervalSec = activeJoules / netHarvestPerSec;\n  return {\n    harvestPowerMw: harvestMw,\n    activePowerMw: activeMw,\n    minTransmissionIntervalSeconds: Number(minIntervalSec.toFixed(1)),\n    sustainable: true,\n    status: 'ENERGY_NEUTRAL_DUTY_CYCLE_SUSTAINABLE'\n  };\n}",
    "eHint": "Compute activeJoules / netHarvestPerSec to find sustainable interval.",
    "eTest": "const res = optimizeEnergyDutyCycle(0.5, 100, 0.01, 50); // 0.5mW solar harvest, 100mW active for 50ms\nif (!res.sustainable || res.minTransmissionIntervalSeconds > 15 || res.minTransmissionIntervalSeconds < 8) throw new Error('Energy duty cycle failed');",
    "aTitle": "Supercapacitor Energy Joules Calculator",
    "aDesc": "Implement function getSupercapEnergyJoules(capacitanceFarads, voltageVolts) returning `0.5 * capacitanceFarads * voltageVolts * voltageVolts`.",
    "aStarter": "function getSupercapEnergyJoules(c, v) { return 0.5 * c * v * v; }",
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
    "eStarter": "function calculateDopplerAndPassWindow(f = 868000000, v = 7500) {\n  const c = 299792458;\n  const maxDopplerHz = (v / c) * f;\n  return {\n    carrierFrequencyHz: f,\n    satelliteVelocityMps: v,\n    maxDopplerShiftHz: Number(maxDopplerHz.toFixed(1)),\n    requiredRxBandwidthHz: Number((maxDopplerHz * 2).toFixed(1)),\n    status: 'SATELLITE_LINK_DOPPLER_COMPENSATED'\n  };\n}",
    "eHint": "Compute maxDoppler = (v / c) * f.",
    "eTest": "const res = calculateDopplerAndPassWindow(868000000, 7500);\nif (res.maxDopplerShiftHz < 21000 || res.maxDopplerShiftHz > 22000) throw new Error('Satellite Doppler failed');",
    "aTitle": "Satellite Pass Duration Formatter",
    "aDesc": "Implement function formatSatPass(durationMin = 7) returning `${durationMin} minutes visibility pass window`.",
    "aStarter": "function formatSatPass(d = 7) { return `${d} minutes visibility pass window`; }",
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
    "eStarter": "function evaluateWanFailover(interfaces) {\n  // interfaces = [{ name: 'ETH', online: false, prio: 1 }, { name: 'CELL', online: true, prio: 3 }]\n  const active = interfaces.filter(i => i.online).sort((a, b) => a.prio - b.prio);\n  if (active.length === 0) return { connected: false, activeInterface: 'NONE', status: 'ALL_WAN_DOWN_ISOLATED' };\n  const best = active[0];\n  return {\n    connected: true,\n    activeInterface: best.name,\n    priority: best.prio,\n    status: `WAN_ACTIVE_ROUTING_OVER_${best.name}`\n  };\n}",
    "eHint": "Filter online interfaces and sort by priority.",
    "eTest": "const ifaces = [{ name: 'ETH', online: false, prio: 1 }, { name: 'WIFI', online: false, prio: 2 }, { name: 'CELL', online: true, prio: 3 }];\nconst res = evaluateWanFailover(ifaces);\nif (!res.connected || res.activeInterface !== 'CELL' || res.priority !== 3) throw new Error('WAN failover failed');",
    "aTitle": "Interface Priority Formatter",
    "aDesc": "Implement function getInterfacePriority(name) returning 1 (ETH), 2 (WIFI), 3 (CELL), 4 (SAT).",
    "aStarter": "function getInterfacePriority(n) { const m = { ETH: 1, WIFI: 2, CELL: 3, SAT: 4 }; return m[n] || 99; }",
    "aHint": "Map interface to priority.",
    "aTest": "if (getInterfacePriority('ETH') !== 1 || getInterfacePriority('CELL') !== 3) throw new Error('Priority failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Smart City Multi-Radio Wireless Mesh Ecosystem",
    "desc": "Final Capstone Synthesis: The complete industrial IoT wireless communications ecosystem: BLE Mesh environmental sensor arrays, LoRaWAN long-range city infrastructure telemetry, Cellular NB-IoT/LTE-M gateway uplinks, CoAP/DTLS encrypted endpoints, 6LoWPAN IPv6 header compression, and Multi-WAN edge failover.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Smart City Multi-Radio Wireless Mesh Ecosystem.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Smart City Multi-Radio Master Ecosystem Controller",
    "eDesc": "Implement function executeSmartCityRadioEcosystem(bleMeshArray, loraInfrastructure, cellularGateway, dtlsSecurity) orchestrating complete city-scale telemetry pipeline.",
    "eStarter": "function executeSmartCityRadioEcosystem(ble, lora, cell, sec) {\n  const bleHealthy = ble.nodesActive > 0;\n  const loraHealthy = lora.dutyCycleValid && lora.gatewaysOnline > 0;\n  const cellHealthy = cell.pdpContextActive && cell.signalDbm >= -110;\n  const secHealthy = sec.dtlsEncrypted && sec.replayProtected;\n  const allNominal = bleHealthy && loraHealthy && cellHealthy && secHealthy;\n  return {\n    systemOperational: allNominal,\n    bleMeshNodes: ble.nodesActive,\n    loraGateways: lora.gatewaysOnline,\n    cellularUplinkQuality: cell.signalDbm,\n    securityProtocol: 'DTLS_PSK_AES_CCM_AUTHENTICATED',\n    status: allNominal ? 'SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED' : 'RADIO_SUBSYSTEM_DEGRADED'\n  };\n}",
    "eHint": "Verify all subsystem healthy booleans and return ecosystem status.",
    "eTest": "const ble = { nodesActive: 250 };\nconst lora = { dutyCycleValid: true, gatewaysOnline: 8 };\nconst cell = { pdpContextActive: true, signalDbm: -85 };\nconst sec = { dtlsEncrypted: true, replayProtected: true };\nconst res = executeSmartCityRadioEcosystem(ble, lora, cell, sec);\nif (!res.systemOperational || res.status !== 'SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED' || res.bleMeshNodes !== 250) throw new Error('Capstone radio ecosystem failed');",
    "aTitle": "Smart City Radio Certification Auditor",
    "aDesc": "Implement function auditSmartCityRadioCert() returning `{ certified: true, score: '100/100', tier: 'ENTERPRISE_IOT_WIRELESS_NETWORKS_CERTIFIED' }`.",
    "aStarter": "function auditSmartCityRadioCert() { return { certified: true, score: '100/100', tier: 'ENTERPRISE_IOT_WIRELESS_NETWORKS_CERTIFIED' }; }",
    "aHint": "Return certification object.",
    "aTest": "if (auditSmartCityRadioCert().certified !== true) throw new Error('Capstone audit failed');"
  }
];

export const IOT_NETWORK_30_DAYS_QUESTS: CourseQuest[] = IOT_NETWORK_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('iot_net', idx + 1, cfg)
);
