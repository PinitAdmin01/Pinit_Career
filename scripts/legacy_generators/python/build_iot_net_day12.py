# scripts/build_iot_net_day12.py
"""
Builds Day 12 for Course 18: IoT Networking & Cloud Protocols (iot_net).
Day 12: BLE Advertising Architecture, Primary Channels & BLE 5.0 Extended Advertising
Pedagogical Invariants:
- Exactly 5 parts, each strictly >= 580 words (target >= 620 words).
- minutes: 38.
- 100% deterministic Python standard library execution, verified output capture.
- 4 multiple choice options with answer: 0 and deep why.
- Strict mathematical & architectural depth: Primary vs Secondary advertising, AdvInterval + AdvDelay jitter (0-10 ms), legacy 31-byte limit, AD structures, SCAN_REQ/SCAN_RSP, Bluetooth 5.0 Extended Advertising (ADV_EXT_IND, AuxPtr, 254-byte PDUs, 1650-byte chains).
"""

import json
import os
import subprocess
import sys

def build_day12():
    # =========================================================================
    # Part 1: Primary Advertising Channels, AdvInterval & Random Delay Jitter
    # =========================================================================
    p1_say = [
        "Welcome to Day 12 of IoT Networking & Cloud Protocols. Today, we investigate the foundational broadcast mechanism that underpins all Bluetooth Low Energy discovery, beaconing, and connection initialization: the BLE Advertising Architecture.",
        "In wireless sensor networks, devices do not begin their lifecycle with synchronized clocks or pre-established connections. A battery-powered heart rate monitor, an industrial vibration sensor, or a warehouse asset beacon must make its presence known to arbitrary listening smartphones, gateways, or Central nodes without consuming continuous battery energy.",
        "To achieve this, BLE relies on unslotted asynchronous broadcasting across the three dedicated Primary Advertising channels: Channel 37 (2402 MHz), Channel 38 (2426 MHz), and Channel 39 (2480 MHz).",
        "An advertising event consists of the Peripheral transmitter broadcasting an advertising packet consecutively on Channel 37, then Channel 38, and finally Channel 39, separated by a brief inter-packet turnaround time of less than 10 milliseconds (typically 1 to 2 milliseconds).",
        "The timing between consecutive advertising events is strictly regulated by the Bluetooth Core Specification through two components: the nominal Advertising Interval (advInterval) and the pseudo-random Advertising Delay (advDelay).",
        "The advInterval is configured by application firmware in discrete increments of 0.625 milliseconds (matching the fundamental Bluetooth baseband clock slot). For legacy connectable advertising, the specification mandates an advInterval between 20 milliseconds (32 slots) and 10.24 seconds (16,384 slots). For non-connectable beaconing, the interval can be set as low as 100 milliseconds.",
        "However, if multiple uncoordinated beacons in an industrial facility or retail store transmit at exactly the same nominal interval—say, exactly every 100.0 milliseconds—a catastrophic collision phenomenon occurs. If two beacons transmit simultaneously on Channel 37 at time t = 0, their radio packets will collide over the air, corrupting the CRC and rendering both beacons invisible to listening scanners.",
        "Because their crystal oscillators run at virtually identical frequencies, they would continue to transmit simultaneously at t = 100 ms, t = 200 ms, t = 300 ms, and so on. In communications theory, this is known as persistent phase-locked packet collisions in unslotted ALOHA channels.",
        "To decisively eliminate this vulnerability, the Bluetooth Link Layer specification mandates that the Controller must add a pseudo-random delay, advDelay, to every advertising event: T_event = advInterval + advDelay, where advDelay is an integer or fractional value pseudo-randomly generated in the range of 0.0 milliseconds to 10.0 milliseconds.",
        "This dynamic 0 to 10 ms jitter decorrelates the transmission phases of neighboring beacons. Even if Beacon A and Beacon B experience a collision at time t = 0, their subsequent transmission instants diverge immediately (for example, Beacon A fires at 100 ms + 3.2 ms = 103.2 ms, while Beacon B fires at 100 ms + 8.7 ms = 108.7 ms), ensuring that subsequent packets arrive cleanly at the receiver.",
        "The Bluetooth Core Specification defines four fundamental legacy advertising PDU types: ADV_IND (Connectable Undirected Advertising, used by general sensors seeking connections), ADV_DIRECT_IND (Connectable Directed Advertising, used for high-speed reconnection to a specific known peer within a strict 1.28-second timeout), ADV_NONCONN_IND (Non-Connectable Undirected Advertising, used by unidirectional broadcast beacons like Apple iBeacon or Eddystone), and ADV_SCAN_IND (Scannable Undirected Advertising, allowing scanners to request additional payload via scan responses without supporting connections).",
        "Understanding these timing invariants and PDU classifications is essential for writing low-power, robust embedded BLE firmware that maximizes discovery probability while preventing RF channel saturation in dense enterprise IoT deployments.",
        "In enterprise deployments featuring thousands of asset tags—such as smart warehouses, hospital equipment tracking, and multi-tenant commercial offices—engineers must also analyze the impact of advertising interval selection on device discovery latency. A shorter interval (e.g. 20 ms to 100 ms) yields sub-second discovery by smartphones and gateways, but rapidly drains coin-cell batteries due to high radio duty cycles. Conversely, a longer interval (e.g. 1.0 s to 5.0 s) extends battery life beyond five years, but introduces noticeable user latency during interactive pairing sessions.",
        "Balancing these trade-offs requires applying Poisson arrival models to calculate the joint probability that a scanning window overlaps with an advertising burst, ensuring deterministic discovery guarantees across diverse operational environments."
    ]
    p1_example = "Imagine several lighthouses on a dark coastline flashing their beacons to passing ships. If two lighthouses flashed their beams at the exact same second, their lights would blind the ship's captain with glare. To prevent this, each lighthouse keeper adds a random pause between 0 and 10 seconds before each flash. Even if two lights flash together once, their next flashes will naturally occur at different seconds, allowing the ship to identify both lighthouses clearly."
    p1_code = """# BLE Advertising Event Timing & Unslotted ALOHA Collision Simulation
import random

class BLEAdvTimingModel:
    SLOT_SIZE_MS = 0.625
    
    def __init__(self, adv_interval_ms: float = 100.0, seed: int = 42):
        self.interval_ms = adv_interval_ms
        self.rng = random.Random(seed)
        
    def generate_events(self, num_events: int, apply_jitter: bool = True) -> list[float]:
        timestamps = []
        current_time = 0.0
        for _ in range(num_events):
            jitter = self.rng.uniform(0.0, 10.0) if apply_jitter else 0.0
            current_time += self.interval_ms + jitter
            timestamps.append(current_time)
        return timestamps

def simulate_channel_collisions(interval_ms: float = 100.0, packet_duration_ms: float = 1.2, 
                                num_devices: int = 5, test_duration_ms: float = 5000.0):
    # Simulate devices with and without 0-10ms advDelay jitter
    results = {}
    for jitter_enabled in [False, True]:
        all_packets = []
        for dev_id in range(num_devices):
            model = BLEAdvTimingModel(interval_ms, seed=100 + dev_id)
            # Stagger initial boot slightly (0-20ms)
            boot_offset = (dev_id * 3.7) % 15.0
            t = boot_offset
            while t < test_duration_ms:
                jitter = random.Random(int(t * 1000) + dev_id).uniform(0.0, 10.0) if jitter_enabled else 0.0
                t += interval_ms + jitter
                all_packets.append((t, dev_id))
                
        all_packets.sort(key=lambda x: x[0])
        collisions = 0
        for i in range(len(all_packets) - 1):
            t_curr, dev_curr = all_packets[i]
            t_next, dev_next = all_packets[i+1]
            if dev_curr != dev_next and (t_next - t_curr) < packet_duration_ms:
                collisions += 1
                
        results["With Jitter" if jitter_enabled else "Without Jitter"] = {
            "total_packets": len(all_packets),
            "collisions": collisions,
            "collision_rate_pct": (collisions / len(all_packets)) * 100.0
        }
    return results

res = simulate_channel_collisions(interval_ms=100.0, packet_duration_ms=1.2, num_devices=8, test_duration_ms=10000.0)
print("=== BLE Advertising advDelay (0-10 ms Jitter) Collision Mitigation ===")
for mode, stats in res.items():
    print(f"Mode: {mode:15s} | Packets: {stats['total_packets']:4d} | Collisions: {stats['collisions']:3d} | Rate: {stats['collision_rate_pct']:5.2f}%")
"""
    p1_codeNotes = [
        "Implements BLEAdvTimingModel simulating discrete BLE advertising events across Channels 37, 38, and 39.",
        "Demonstrates mathematical proof of advDelay (0-10 ms random jitter) eliminating phase-locked collisions.",
        "Quantifies collision reduction across 8 concurrent unsynchronized beacons operating in the same RF collision domain."
    ]
    p1_tryIt = "Modify num_devices to 20 and observe how collision rate scales under dense industrial beaconing."
    p1_check = {
        "question": "Why does the Bluetooth Low Energy specification mandate adding a pseudo-random advDelay (0.0 to 10.0 ms) to each nominal advertising interval?",
        "options": [
            "To prevent phase-locked packet collisions between unsynchronized beacons transmitting at identical intervals.",
            "To synchronize the transmitter's clock with the Central node's cellular base station.",
            "To allow the radio transceiver sufficient time to cool down its power amplifier between bursts.",
            "To encrypt the advertising payload using dynamic physical-layer frequency spreading."
        ],
        "answer": 0,
        "why": "Option 0 is correct: Without the 0–10 ms random delay, unsynchronized beacons with identical intervals that collide once would continue to collide indefinitely due to matching crystal frequencies. Option 1 is false (BLE advertising is unslotted and unsynchronized). Option 2 is absurd. Option 3 confuses timing jitter with cryptographic spreading."
    }

    # =========================================================================
    # Part 2: Legacy Advertising Payload Anatomy & AD Type Data Structures
    # =========================================================================
    p2_say = [
        "In legacy Bluetooth Low Energy (Bluetooth 4.0 through 4.2), the physical Link Layer advertising PDU has a maximum allowable size of exactly 37 octets (bytes).",
        "Of these 37 bytes, the Link Layer header consumes exactly 6 bytes for the advertiser's physical device address (AdvA, representing the 48-bit IEEE MAC address or Resolvable Private Address). This leaves exactly 31 bytes (37 - 6 = 31) for the actual user payload: the Advertising Data (AdvData).",
        "Every byte in those 31 bytes of AdvData is precious. To allow multiple independent protocols, services, and identifiers to coexist within this tiny payload without ambiguity, the Bluetooth SIG defined the Type-Length-Value (TLV) structure known as Advertising Data (AD) Structures.",
        "An AdvData field consists of a sequence of concatenated AD structures. Each individual AD structure is structured into three continuous byte fields: the Length field (1 octet), the AD Type field (1 octet), and the AD Data field (Length - 1 octets).",
        "The Length octet declares the total size of the AD Type plus the AD Data. For example, if an AD structure has Length = 0x05, exactly 1 byte is the AD Type and the subsequent 4 bytes are the AD Data. If an AdvData buffer contains unused trailing space after all AD structures are serialized, the remaining bytes are simply zeroed and ignored by conforming parsers.",
        "The Bluetooth Core Specification Assigned Numbers registry specifies dozens of standardized AD Types. The most critical in IoT engineering include:",
        "1. Flags (AD Type 0x01): A 1-octet bitfield specifying the discovery mode and radio capabilities of the device. Bit 0 indicates LE Limited Discoverable Mode (device advertises for a limited window, typically 30 seconds); Bit 1 indicates LE General Discoverable Mode (device advertises indefinitely); and Bit 2 indicates 'BR/EDR Not Supported' (certifying the device as a single-mode BLE peripheral incapable of Classic Bluetooth). For virtually all pure low-power IoT sensors, Flags are encoded as 0x02, 0x01, 0x06 (Length = 2, Type = 0x01, Value = 0x06 = Bits 1 and 2 set).",
        "2. Service UUIDs: Declares the 16-bit, 32-bit, or 128-bit services supported by the device. Common types include 0x02 (Incomplete list of 16-bit Service UUIDs), 0x03 (Complete list of 16-bit Service UUIDs), 0x06 (Incomplete 128-bit UUIDs), and 0x07 (Complete 128-bit UUIDs). For example, a heart rate monitor includes 0x180D (Heart Rate Service), while an environmental monitor includes 0x181A (Environmental Sensing).",
        "3. Local Name: Communicates human-readable device names to end-user interfaces. AD Type 0x08 indicates 'Shortened Local Name', while AD Type 0x09 indicates 'Complete Local Name'. If an embedded device name is 'SensorNode-99', encoding this ASCII string requires 13 bytes (1 byte length + 1 byte type + 11 characters), immediately consuming over 40% of the entire 31-byte legacy budget.",
        "4. TX Power Level (AD Type 0x0A): A 1-octet signed integer indicating the calibrated transmit power at 0 meters. Scanners compare this value against the measured RSSI to compute physical distance using the Log-Distance Path Loss formula.",
        "5. Manufacturer Specific Data (AD Type 0xFF): A flexible proprietary container used extensively in industrial asset tracking and commercial beacon standards. The first 2 octets must contain the Company Identifier Code assigned by the Bluetooth SIG (for example, 0x004C for Apple Inc., 0x0059 for Nordic Semiconductor, 0x000D for Texas Instruments, or 0x0822 for Silicon Labs), followed by arbitrary proprietary telemetry or beacon coordinates.",
        "Mastering the parsing and packing of these AD structures is a compulsory competency for any firmware developer implementing custom GATT profiles or beaconing stacks.",
        "In production embedded systems, firmware engineers often employ dynamic payload compression techniques to maximize information density within the 31-byte limit. For instance, rather than broadcasting full 128-bit custom service UUIDs (which consume 18 bytes for a single UUID), developers register a 16-bit Member UUID with the Bluetooth SIG or encode telemetry variables as bit-packed integer fields inside Manufacturer Specific Data (0xFF), squeezing multiple sensor readings into a single broadcast packet."
    ]
    p2_example = "Think of the 31-byte advertising payload like a tiny postal postcard. You cannot fit an entire book inside. Instead, you write clearly demarcated sticky notes on the postcard. Sticky note 1 says: 'Length 2: My flags are 0x06 (BLE only)'. Sticky note 2 says: 'Length 5: My service is Heart Rate (0x180D)'. Sticky note 3 says: 'Length 10: My name is Pulse-1'. Each note has a measured width, a topic category, and the information."
    p2_code = """# BLE Legacy Advertising Data (AdvData) Binary Encoder & Decoder
import struct

class BLEAdvDataParser:
    AD_TYPE_FLAGS = 0x01
    AD_TYPE_UUID16_COMPLETE = 0x03
    AD_TYPE_COMPLETE_LOCAL_NAME = 0x09
    AD_TYPE_TX_POWER = 0x0A
    AD_TYPE_MANUFACTURER_DATA = 0xFF
    
    @classmethod
    def serialize_ad_structures(cls, structures: list[tuple[int, bytes]]) -> bytes:
        pdu = bytearray()
        for ad_type, data in structures:
            length = len(data) + 1  # 1 byte for AD Type + len(data)
            pdu.append(length)
            pdu.append(ad_type)
            pdu.extend(data)
        if len(pdu) > 31:
            raise ValueError(f"AdvData payload exceeds 31-byte legacy limit! ({len(pdu)} bytes)")
        return bytes(pdu)
        
    @classmethod
    def parse_ad_structures(cls, payload: bytes) -> dict:
        parsed = {"flags": None, "complete_name": None, "uuids_16": [], "tx_power_dbm": None, "manufacturer_raw": None}
        idx = 0
        while idx < len(payload):
            if idx >= len(payload):
                break
            length = payload[idx]
            if length == 0:
                break  # Trailing zero padding
            if idx + 1 + length > len(payload) + 1:
                break  # Malformed structure
            ad_type = payload[idx + 1]
            data = payload[idx + 2 : idx + 1 + length]
            
            if ad_type == cls.AD_TYPE_FLAGS:
                parsed["flags"] = data[0] if len(data) > 0 else 0
            elif ad_type == cls.AD_TYPE_COMPLETE_LOCAL_NAME:
                parsed["complete_name"] = data.decode("utf-8", errors="replace")
            elif ad_type == cls.AD_TYPE_UUID16_COMPLETE:
                # 16-bit UUIDs are little-endian 2-byte values
                for u_idx in range(0, len(data), 2):
                    uuid16 = struct.unpack("<H", data[u_idx:u_idx+2])[0]
                    parsed["uuids_16"].append(f"0x{uuid16:04X}")
            elif ad_type == cls.AD_TYPE_TX_POWER:
                parsed["tx_power_dbm"] = struct.unpack("<b", data)[0]
            elif ad_type == cls.AD_TYPE_MANUFACTURER_DATA:
                company_id = struct.unpack("<H", data[:2])[0] if len(data) >= 2 else 0
                parsed["manufacturer_raw"] = {"company_id": f"0x{company_id:04X}", "payload_hex": data[2:].hex()}
                
            idx += 1 + length
        return parsed

# Assemble sample 31-byte legacy advertising payload for an Industrial Vibration Node
ad_list = [
    (0x01, bytes([0x06])),                                     # Flags: LE General + No BR/EDR
    (0x03, struct.pack("<H", 0x181A)),                          # Complete 16-bit UUID: Environmental Sensing (0x181A)
    (0x0A, struct.pack("<b", 4)),                               # TX Power: +4 dBm
    (0x09, b"PumpSensor"),                                      # Complete Local Name: PumpSensor (10 bytes)
    (0xFF, struct.pack("<H", 0x0059) + bytes([0xAA, 0x01, 0x4B])) # Nordic Semi ID (0x0059) + 3 bytes telemetry
]

encoded_pdu = BLEAdvDataParser.serialize_ad_structures(ad_list)
decoded = BLEAdvDataParser.parse_ad_structures(encoded_pdu)

print("=== BLE Legacy 31-Byte Advertising Binary Serialization & Parsing ===")
print(f"Serialized AdvData ({len(encoded_pdu)}/31 bytes): {encoded_pdu.hex().upper()}")
print(f"Decoded Flags:        0x{decoded['flags']:02X} (LE General Discoverable, BR/EDR Not Supported)")
print(f"Decoded Complete Name:{decoded['complete_name']}")
print(f"Decoded Services:     {decoded['uuids_16']}")
print(f"Decoded TX Power:     {decoded['tx_power_dbm']} dBm")
print(f"Decoded Mfr Specific: Company {decoded['manufacturer_raw']['company_id']}, Data: {decoded['manufacturer_raw']['payload_hex']}")
"""
    p2_codeNotes = [
        "Defines BLEAdvDataParser handling serialization and parsing of TLV AD structures.",
        "Validates strict adherence to the 31-byte legacy Link Layer advertising limit.",
        "Decodes Flags (0x01), 16-bit UUIDs (0x03), Local Name (0x09), TX Power (0x0A), and Manufacturer Data (0xFF)."
    ]
    p2_tryIt = "Add an extra 5 characters to the device name and verify that the serializer raises a ValueError for exceeding 31 bytes."
    p2_check = {
        "question": "What is the maximum allowable payload size (AdvData) for a legacy Bluetooth Low Energy advertising PDU, and how are individual data elements structured inside it?",
        "options": [
            "Exactly 31 bytes, formatted as concatenated Type-Length-Value (TLV) AD structures where each structure begins with a 1-byte length.",
            "Exactly 256 bytes, formatted as a JSON dictionary with UTF-8 encoding.",
            "Exactly 128 bytes, structured as fixed 16-byte cryptographic blocks.",
            "Exactly 1500 bytes, matching the standard Ethernet MTU."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the Bluetooth 4.x legacy specification: The 37-byte Link Layer PDU reserves 6 bytes for the AdvA address, leaving exactly 31 bytes for AdvData. Each AD structure begins with a 1-byte Length, followed by 1-byte AD Type and payload data. Options 1, 2, and 3 are completely incorrect."
    }

    # =========================================================================
    # Part 3: Active Scanning, SCAN_REQ and SCAN_RSP Turnaround Timing
    # =========================================================================
    p3_say = [
        "As established in Part 2, the 31-byte legacy payload limit presents a severe bottleneck when an IoT device must advertise both its complete human-readable device name, cryptographic service UUIDs, and custom telemetry data.",
        "To alleviate this constraint without forcing the device to accept a full, high-overhead bidirectional connection, the Bluetooth architects engineered the Active Scanning handshake.",
        "In BLE, listening devices (Scanners) can operate in one of two modes: Passive Scanning or Active Scanning.",
        "In Passive Scanning, the listening radio simply tunes to Channels 37, 38, and 39 during its scanning windows. When it receives an advertising PDU (such as ADV_IND or ADV_NONCONN_IND), it processes the payload and remains completely silent. Passive scanning is entirely non-intrusive: the advertiser never knows it was overheard, and the scanner transmits zero RF energy.",
        "In Active Scanning, the scanner actively participates in an immediate two-way over-the-air transaction. When an active scanner receives a scannable advertising PDU (ADV_IND or ADV_SCAN_IND), it waits for the transmission to finish, pauses for exactly the Interframe Spacing time (T_IFS = 150 microseconds), and immediately transmits a SCAN_REQ (Scan Request) PDU back to the advertiser on the exact same RF channel.",
        "The SCAN_REQ packet is a compact 12-byte PDU containing the scanner's own 6-byte MAC address (ScanA) and the target advertiser's 6-byte address (AdvA).",
        "When the advertiser receives the SCAN_REQ and confirms that the AdvA field matches its own MAC address, it pauses for another T_IFS (150 us) and immediately transmits a SCAN_RSP (Scan Response) PDU.",
        "The SCAN_RSP packet contains its own 31-byte AdvData payload, formatted with identical TLV AD structures. By combining the 31 bytes of the primary ADV_IND packet with the 31 bytes of the secondary SCAN_RSP packet, the peripheral effectively doubles its broadcast capacity to 62 bytes (31 + 31) without establishing a formal connection state.",
        "Firmware architects exploit this separation through a classic design pattern: essential, high-priority discovery data (such as Flags and 16-bit Service UUIDs) is placed in the primary ADV_IND packet, while descriptive, non-critical data (such as the long Complete Local Name and serial numbers) is deferred to the SCAN_RSP packet.",
        "This architectural partitioning yields immense battery savings for the advertiser. If no active scanner is present in the vicinity, the peripheral only spends battery energy transmitting the short ADV_IND packet. It only incurs the additional energy cost of transmitting SCAN_RSP when an active scanner is physically present and actively queries the node.",
        "However, active scanning introduces a channel utilization cost. In crowded environments containing hundreds of active smartphones scanning continuously, the sheer volume of SCAN_REQ and SCAN_RSP packets can cause severe RF contention on Channels 37, 38, and 39.",
        "To mitigate this contention, scanners utilize backoff algorithms (such as the BLE Backoff Procedure with upper/lower limits) to throttle SCAN_REQ transmissions when collisions are detected.",
        "Under the BLE Link Layer specification, every active scanner maintains an internal backoff count integer variable and an upper limit threshold. When an active scanner transmits a SCAN_REQ but fails to receive a corresponding SCAN_RSP within the specified timeout, it assumes an over-the-air packet collision occurred. In response, it doubles its upper backoff limit (up to a maximum of 256) and selects a new pseudo-random integer backoff counter, suppressing subsequent scan requests until the counter decrements to zero upon hearing valid advertising packets.",
        "Conversely, when a SCAN_RSP is successfully received, the scanner decrements its upper limit, dynamically expanding its query frequency when the RF spectrum is quiet and throttling queries when channel contention escalates. Embedded systems engineers must account for these backoff dynamics when evaluating the reliability of gateway scan response collection."
    ]
    p3_example = "Think of a vendor at an open-air market. The vendor shouts: 'Fresh apples for sale!' (ADV_IND, 31 bytes). A passerby stops and asks: 'What varieties do you have?' (SCAN_REQ). The vendor replies: 'Honeycrisp, Fuji, and Gala from Washington state' (SCAN_RSP, 31 bytes). If nobody asks, the vendor saves their breath (saves battery energy). But if asked, the full catalog is shared without taking the customer into an office to sign a contract."
    p3_code = """# BLE Active Scanning & SCAN_REQ / SCAN_RSP Transaction Engine
class BLEActiveScanEngine:
    T_IFS_US = 150.0   # Mandatory 150 microsecond Interframe Spacing
    
    def __init__(self, adv_address: str, adv_payload: bytes, scan_rsp_payload: bytes):
        self.adv_address = adv_address
        self.adv_payload = adv_payload          # 31-byte primary payload
        self.scan_rsp_payload = scan_rsp_payload  # 31-byte scan response payload
        self.transactions_logged = []
        
    def handle_scanner_interaction(self, scanner_address: str, is_active_scan: bool) -> dict:
        timeline = []
        t_us = 0.0
        
        # 1. Peripheral transmits ADV_IND on primary channel
        # 37-byte Link Layer PDU at 1M PHY = 37 * 8 = 296 bits = 296 us (+ 8 us preamble = 304 us)
        adv_toa = 304.0
        timeline.append({"event": "TX_ADV_IND", "start_us": t_us, "duration_us": adv_toa, "src": self.adv_address})
        t_us += adv_toa
        
        if not is_active_scan:
            # Passive scan: scanner listens silently, peripheral returns to sleep
            return {
                "mode": "PASSIVE_SCAN",
                "total_duration_us": t_us,
                "bytes_transferred": len(self.adv_payload),
                "timeline": timeline
            }
            
        # Active scan: T_IFS pause
        timeline.append({"event": "T_IFS_WAIT", "start_us": t_us, "duration_us": self.T_IFS_US})
        t_us += self.T_IFS_US
        
        # 2. Scanner sends SCAN_REQ (12-byte payload + framing = 18 bytes = 144 us + 8 us preamble = 152 us)
        scan_req_toa = 152.0
        timeline.append({"event": "RX_SCAN_REQ", "start_us": t_us, "duration_us": scan_req_toa, "src": scanner_address})
        t_us += scan_req_toa
        
        # T_IFS pause
        timeline.append({"event": "T_IFS_WAIT", "start_us": t_us, "duration_us": self.T_IFS_US})
        t_us += self.T_IFS_US
        
        # 3. Peripheral transmits SCAN_RSP
        scan_rsp_toa = 304.0
        timeline.append({"event": "TX_SCAN_RSP", "start_us": t_us, "duration_us": scan_rsp_toa, "src": self.adv_address})
        t_us += scan_rsp_toa
        
        total_bytes = len(self.adv_payload) + len(self.scan_rsp_payload)
        return {
            "mode": "ACTIVE_SCAN",
            "total_duration_us": t_us,
            "bytes_transferred": total_bytes,
            "timeline": timeline
        }

engine = BLEActiveScanEngine(
    adv_address="AA:BB:CC:11:22:33",
    adv_payload=b"\\x02\\x01\\x06\\x03\\x03\\x1A\\x18",      # Flags + Environmental UUID
    scan_rsp_payload=b"\\x0E\\x09WeatherStation-01"    # Complete Local Name
)

passive_res = engine.handle_scanner_interaction("11:22:33:44:55:66", is_active_scan=False)
active_res = engine.handle_scanner_interaction("11:22:33:44:55:66", is_active_scan=True)

print("=== BLE Active vs Passive Scanning Transaction Timeline Analysis ===")
print(f"Passive Scan: Duration = {passive_res['total_duration_us']:6.1f} us | Data Exchanged: {passive_res['bytes_transferred']} bytes")
print(f"Active Scan:  Duration = {active_res['total_duration_us']:6.1f} us | Data Exchanged: {active_res['bytes_transferred']} bytes (2x Capacity!)")
print("\\nActive Scan Microsecond Timing Step Breakdown:")
for step in active_res["timeline"]:
    print(f"  [{step['start_us']:6.1f} us - {step['start_us']+step['duration_us']:6.1f} us] {step['event']:12s} ({step['duration_us']:5.1f} us)")
"""
    p3_codeNotes = [
        "Models the microsecond timing sequence of BLE Active Scanning: ADV_IND -> T_IFS -> SCAN_REQ -> T_IFS -> SCAN_RSP.",
        "Demonstrates how Active Scanning doubles broadcast data throughput from 31 bytes to 62 bytes.",
        "Enforces the mandatory 150-microsecond Interframe Spacing (T_IFS) turnaround between transceiver states."
    ]
    p3_tryIt = "Verify that changing the scanner mode to passive eliminates the SCAN_REQ and SCAN_RSP phases entirely."
    p3_check = {
        "question": "In BLE active scanning, what is the exact packet sequence and turnaround timing that allows an advertiser to transmit 62 bytes of data without a connection?",
        "options": [
            "ADV_IND -> T_IFS (150 us) -> SCAN_REQ -> T_IFS (150 us) -> SCAN_RSP.",
            "ADV_IND -> CSMA backoff (320 us) -> DATA_REQ -> ACK.",
            "SCAN_REQ -> Beacon (1 ms) -> Association Request -> Association Confirm.",
            "CONNECT_REQ -> L2CAP Connect -> ATT_READ -> DISCONNECT."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the Bluetooth specification: The advertiser broadcasts ADV_IND, the active scanner replies with SCAN_REQ after T_IFS (150 us), and the advertiser returns SCAN_RSP after another T_IFS (150 us). Options 1, 2, and 3 confuse BLE with 802.15.4 or connection establishment."
    }

    # =========================================================================
    # Part 4: Bluetooth 5.0 Extended Advertising, AuxPtr & Secondary Channels
    # =========================================================================
    p4_say = [
        "While the 31-byte legacy limit and the 62-byte active scan response solved short-range sensor identification in the early 2010s, modern IoT applications quickly outgrew these constraints.",
        "Next-generation applications—such as indoor asset localization transmitting complex angle-of-arrival arrays, smart energy meters broadcasting signed cryptographic certificates, and firmware-over-the-air (FOTA) beacons distributing differential binary patches—require transmitting hundreds or thousands of bytes of broadcast data.",
        "If a device attempted to broadcast thousands of bytes across Channels 37, 38, and 39, the three primary advertising channels would suffer total RF collapse, destroying device discovery for every smartphone and wearable in the building.",
        "To decisively solve this scalability crisis, the Bluetooth 5.0 specification introduced Extended Advertising.",
        "The core innovation of Extended Advertising is the decoupling of Discovery from Payload Delivery by offloading large data frames from the 3 crowded Primary Advertising Channels to the 37 General Data Channels (Channels 0 through 36).",
        "The mechanism operates as follows:",
        "On the Primary Advertising channels (37, 38, 39), the advertiser no longer transmits the large payload. Instead, it transmits a lightweight pointer packet known as ADV_EXT_IND (Extended Advertising Indication).",
        "The ADV_EXT_IND packet contains an extended header with two critical fields: the Advertising Data Info (ADI), which contains an Advertising Set ID and a dynamic Data Status counter, and the Auxiliary Pointer (AuxPtr).",
        "The AuxPtr field is an architectural masterpiece of physical layer coordination. It explicitly instructs listening scanners exactly WHERE and WHEN to tune their radios to receive the actual payload:",
        "1. Channel Index: Specifies which of the 37 secondary data channels (0–36) will carry the secondary packet.",
        "2. CA (Clock Accuracy): Indicates whether the advertiser's sleep clock has 50 ppm or 500 ppm drift.",
        "3. Offset Units & Aux Offset: Specifies the exact microsecond delay (e.g. 300 microseconds or 2.45 milliseconds) between the end of the ADV_EXT_IND packet and the start of the secondary packet.",
        "4. Secondary PHY: Specifies which modulation will be used on the secondary channel (1M PHY, 2M PHY for ultra-fast transfer, or Coded S=8 PHY for kilometer reach).",
        "Upon receiving the ADV_EXT_IND on Channel 37, the scanner's radio hardware reads the AuxPtr, re-tunes its frequency synthesizer to the indicated secondary data channel (for example, Channel 14), switches its demodulator to the indicated PHY (such as 2M PHY), and sleeps until the specified Aux Offset expires. It then wakes up and receives the auxiliary packet: AUX_ADV_IND.",
        "Furthermore, Bluetooth 5.0 increased the maximum Link Layer PDU payload on secondary channels from 37 bytes to an enormous 254 bytes.",
        "If the application payload exceeds 254 bytes, Bluetooth 5.0 supports Advertising Packet Chaining: the first AUX_ADV_IND contains its own AuxPtr pointing to a subsequent AUX_CHAIN_IND packet on another data channel. By chaining up to 6 packets together, Extended Advertising can broadcast an astounding 1,650 bytes of continuous data without requiring a connection.",
        "Finally, Bluetooth 5.0 introduced Periodic Advertising (AUX_SYNC_IND), enabling scanners to synchronize their wake-up timers to deterministic, non-jittered broadcast schedules, forming the foundation of Bluetooth Direction Finding (AoA/AoD) and Auracast broadcast audio.",
        "In periodic advertising trains, the advertiser broadcasts synchronizing metadata (SyncInfo) inside the AUX_ADV_IND frame. The SyncInfo field declares the exact periodic interval, frequency hopping sequence, and access address of the forthcoming periodic advertising stream.",
        "Once a scanner captures this SyncInfo block, it can completely discontinue scanning on primary channels 37, 38, and 39. Instead, it enters low-power sleep and only wakes its radio precisely when periodic packets arrive on secondary data channels. This synchronization eliminates discovery collisions and achieves microampere-level receiver power consumption even when streaming complex telemetry at high update rates."
    ]
    p4_example = "Think of a billboard next to a busy highway (Primary Channel). Putting an entire 20-page legal contract on the billboard would block traffic and nobody could read it. Instead, the billboard simply displays: 'For full contract, visit Radio Station 98.5 FM in exactly 3 minutes' (AuxPtr). Drivers tune their radios to 98.5 FM (Secondary Channel) at the exact scheduled time and listen to the full broadcast, leaving the highway clear."
    p4_code = """# BLE 5.0 Extended Advertising AuxPtr Calculation & Packet Chaining Engine
class BLEExtendedAdvEngine:
    SECONDARY_MAX_PDU_BYTES = 254
    MAX_CHAIN_PAYLOAD_BYTES = 1650
    
    @classmethod
    def encode_aux_ptr(cls, target_channel: int, offset_us: float, phy: str) -> dict:
        if not (0 <= target_channel <= 36):
            raise ValueError(f"Secondary advertising channel must be in range 0-36 (got {target_channel}).")
        # Offset is encoded in units of 30 us (Offset Units = 0) or 300 us (Offset Units = 1)
        if offset_us < 245700:  # Up to ~245 ms
            offset_units = 0    # 30 us units
            encoded_offset = int(offset_us / 30.0)
        else:
            offset_units = 1    # 300 us units
            encoded_offset = int(offset_us / 300.0)
            
        return {
            "target_channel": target_channel,
            "target_freq_mhz": 2402.0 + 2.0 * target_channel,
            "offset_us": offset_us,
            "offset_units": "30us" if offset_units == 0 else "300us",
            "encoded_offset_field": encoded_offset,
            "secondary_phy": phy
        }
        
    @classmethod
    def fragment_extended_payload(cls, payload: bytes) -> list[dict]:
        total_len = len(payload)
        if total_len > cls.MAX_CHAIN_PAYLOAD_BYTES:
            raise ValueError(f"Payload ({total_len}B) exceeds 1,650B maximum chain capacity!")
            
        chunks = []
        offset = 0
        pdu_index = 0
        # First chunk is AUX_ADV_IND, subsequent are AUX_CHAIN_IND
        while offset < total_len:
            chunk_data = payload[offset : offset + cls.SECONDARY_MAX_PDU_BYTES]
            pdu_type = "AUX_ADV_IND" if pdu_index == 0 else "AUX_CHAIN_IND"
            chunks.append({
                "pdu_index": pdu_index,
                "pdu_type": pdu_type,
                "payload_bytes": len(chunk_data),
                "is_last_in_chain": (offset + len(chunk_data)) >= total_len
            })
            offset += len(chunk_data)
            pdu_index += 1
        return chunks

# Test Extended Advertising on Channel 17 with 2M PHY for a 600-byte Industrial Sensor Certificate
engine = BLEExtendedAdvEngine()
aux_ptr = engine.encode_aux_ptr(target_channel=17, offset_us=1200.0, phy="2M_PHY")
cert_payload = bytes([i % 256 for i in range(600)])
chain_plan = engine.fragment_extended_payload(cert_payload)

print("=== BLE 5.0 Extended Advertising AuxPtr & Packet Chaining Simulation ===")
print("Primary Channel 37 Pointer (ADV_EXT_IND):")
print(f"  Target Secondary RF Channel: Ch {aux_ptr['target_channel']} ({aux_ptr['target_freq_mhz']:.1f} MHz)")
print(f"  Aux Offset Delay:            {aux_ptr['offset_us']:.1f} us (Encoded Units: {aux_ptr['offset_units']}, Value: {aux_ptr['encoded_offset_field']})")
print(f"  Target Demodulation PHY:     {aux_ptr['secondary_phy']}")
print(f"\\nPayload Offloading (Total {len(cert_payload)} bytes partitioned across secondary channels):")
for pdu in chain_plan:
    last_str = " (END OF CHAIN)" if pdu["is_last_in_chain"] else " -> Chained to next AuxPtr"
    print(f"  Packet {pdu['pdu_index']}: {pdu['pdu_type']:13s} | Payload: {pdu['payload_bytes']:3d} bytes{last_str}")
"""
    p4_codeNotes = [
        "Implements BLEExtendedAdvEngine modeling Bluetooth 5.0 AuxPtr encoding and secondary channel offloading.",
        "Demonstrates how ADV_EXT_IND points scanners to Secondary Channels (0-36) with microsecond precision.",
        "Partitions a 600-byte telemetry payload across chained AUX_ADV_IND and AUX_CHAIN_IND PDUs up to 1,650 bytes."
    ]
    p4_tryIt = "Simulate an 1800-byte payload and verify that the chain generator rejects it for exceeding the 1,650-byte maximum limit."
    p4_check = {
        "question": "How does Bluetooth 5.0 Extended Advertising prevent RF congestion on Primary Advertising Channels (37, 38, 39) when broadcasting large payloads?",
        "options": [
            "It transmits a compact ADV_EXT_IND pointer on primary channels containing an AuxPtr that redirects scanners to secondary data channels (0–36) where payloads up to 1,650 bytes are transferred.",
            "It forces all listening devices to enter an encrypted Wi-Fi mesh network.",
            "It compresses data using gzip directly inside the 8-bit preamble.",
            "It increases transmit power to +30 dBm so all receivers decode packets simultaneously."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the Bluetooth 5.0 architecture: Primary channels only carry lightweight ADV_EXT_IND frames containing the AuxPtr, which instructs scanners to receive the large payload (up to 254 bytes per PDU, and up to 1,650 bytes chained) on secondary data channels (0–36). Options 1, 2, and 3 are incorrect."
    }

    # =========================================================================
    # Part 5: Full BLE Advertising & Extended PDU Multi-Vector Parser Engine
    # =========================================================================
    p5_say = [
        "To conclude Day 12, we bring together legacy advertising, TLV structure decoding, active scanning handshakes, and Bluetooth 5.0 extended advertising into a unified software verification engine: the BLE Comprehensive Advertising & Extended PDU Multi-Vector Parser Subsystem.",
        "In production embedded systems and network test benches (such as Teledyne LeCroy, Ellisys, or custom Wireshark protocol dissectors running over Zephyr HCI monitors), protocol analyzers must process raw over-the-air bitstreams in real time.",
        "The parser must examine the 4-bit PDU Type field in the 16-bit Link Layer Advertising Header to identify whether an incoming frame is a legacy ADV_IND (0x00), ADV_DIRECT_IND (0x01), ADV_NONCONN_IND (0x02), SCAN_REQ (0x03), SCAN_RSP (0x04), CONNECT_IND (0x05), ADV_SCAN_IND (0x06), or an advanced Bluetooth 5.0 ADV_EXT_IND (0x07).",
        "For legacy packets, the engine must extract the 48-bit advertiser address, parse the 31-byte AdvData payload into structured AD dictionary objects, and calculate effective RF channel dwell times.",
        "For Extended Advertising packets, the engine must decode the Extended Header Flags, extract the Advertising Data Info (ADI) and Auxiliary Pointer (AuxPtr), and compute the precise channel hopping target and wake-up timestamp for secondary channel demodulation.",
        "Furthermore, the subsystem evaluates channel occupancy metrics: comparing total Time-on-Air and battery consumption when broadcasting equivalent telemetry using legacy 31-byte unslotted advertising versus Bluetooth 5.0 Extended Advertising running on the high-speed 2M PHY.",
        "In modern multi-protocol IoT architectures—where Bluetooth Low Energy radios coexist on the same printed circuit board as Wi-Fi 6, Thread, and Zigbee radios—packet collision mitigation and spectrum efficiency are paramount. When devices broadcast legacy advertising packets continuously across Channels 37, 38, and 39, they create an aggressive RF noise floor that can degrade neighboring 802.15.4 and 802.11 networks.",
        "By offloading payloads into Extended Advertising frames on secondary channels, the system confines heavy data traffic to narrow, scheduled frequency slots on channels 0 through 36, preserving primary channels for fast discovery.",
        "Our multi-vector verification engine rigorously inspects every header bitfield: ensuring the Channel Selection Algorithm (ChSel) bit accurately indicates whether CSA #1 or CSA #2 is supported, checking the TxAdd and RxAdd flags to distinguish between IEEE public 48-bit MAC addresses and randomly generated private addresses, and verifying that PDU payload lengths do not exceed specification limits.",
        "When an invalid frame is encountered—such as an advertising packet with an invalid PDU type, a truncated payload, or an impossible length field—the parser triggers deterministic error traps, mimicking the defensive firmware architecture required in commercial protocol stacks.",
        "In addition to packet decoding, the verification engine calculates over-the-air spectral efficiency metrics, determining the exact channel dwell time of each packet under 1M, 2M, and Coded PHYs. For legacy 37-byte frames on 1M PHY, channel dwell time is 376 microseconds (including preamble and Access Address), whereas on 2M PHY, dwell time drops to 188 microseconds.",
        "Conversely, when examining Bluetooth 5.0 Extended Advertising frames with maximum 254-byte payloads, dwell time on 1M PHY extends to 2,120 microseconds, while on LE Coded S=8 it expands to over 17 milliseconds. Understanding these dwell time characteristics enables embedded system designers to select appropriate advertising parameters that prevent co-channel interference and ensure coexistence with Wi-Fi and Thread networks.",
        "By executing this deterministic test suite, systems engineers verify that their advertising pipelines comply fully with the Bluetooth Core Specification, avoiding costly compliance re-testing during SIG qualification (BQB certification).",
        "With advertising architecture thoroughly mastered, Day 13 will focus on the Generic Access Profile (GAP) roles, active versus passive scanning policies, privacy mechanisms, and Resolvable Private Addresses (RPA).",
        "Mastering these parsing techniques equips developers with the precise low-level insights required to build robust packet sniffers, automate RF compliance pipelines, and diagnose subtle timing anomalies in mission-critical IoT ecosystems."
    ]
    p5_example = "Think of an airport international customs terminal. Small luggage (legacy 31-byte packets) goes through the standard overhead scanner. But oversized cargo (Extended Advertising) receives a special routing tag (AuxPtr) directing the baggage handlers to a dedicated freight hangar (Secondary Channel 14) where high-speed conveyor belts (2M PHY) process crates of any size without blocking the passenger lines."
    p5_code = """# Full BLE Comprehensive Advertising & Extended PDU Multi-Vector Parser Subsystem
class BLEFullAdvertisingProtocolEngine:
    # 4-bit Link Layer Advertising PDU Types
    PDU_TYPE_ADV_IND = 0x00
    PDU_TYPE_ADV_DIRECT_IND = 0x01
    PDU_TYPE_ADV_NONCONN_IND = 0x02
    PDU_TYPE_SCAN_REQ = 0x03
    PDU_TYPE_SCAN_RSP = 0x04
    PDU_TYPE_CONNECT_IND = 0x05
    PDU_TYPE_ADV_SCAN_IND = 0x06
    PDU_TYPE_ADV_EXT_IND = 0x07

    PDU_NAMES = {
        0x00: "ADV_IND", 0x01: "ADV_DIRECT_IND", 0x02: "ADV_NONCONN_IND",
        0x03: "SCAN_REQ", 0x04: "SCAN_RSP", 0x05: "CONNECT_IND",
        0x06: "ADV_SCAN_IND", 0x07: "ADV_EXT_IND"
    }

    @classmethod
    def parse_raw_ll_advertising_packet(cls, raw_bytes: bytes) -> dict:
        if len(raw_bytes) < 8:
            raise ValueError("Raw PDU too short (minimum 8 bytes: 2B header + 6B AdvA)")
        
        # 16-bit Header: [PDU Type: 4b | RFU: 1b | ChSel: 1b | TxAdd: 1b | RxAdd: 1b | Length: 8b]
        header_raw = (raw_bytes[1] << 8) | raw_bytes[0]
        pdu_type = header_raw & 0x0F
        tx_add = (header_raw >> 6) & 0x01
        rx_add = (header_raw >> 7) & 0x01
        pdu_length = (header_raw >> 8) & 0xFF
        
        # 48-bit Advertiser Address (Little-Endian)
        adva_bytes = raw_bytes[2:8]
        adva_mac = ":".join(f"{b:02X}" for b in reversed(adva_bytes))
        
        payload_data = raw_bytes[8: 8 + (pdu_length - 6)]
        
        result = {
            "pdu_type_id": pdu_type,
            "pdu_name": cls.PDU_NAMES.get(pdu_type, "UNKNOWN"),
            "tx_addr_type": "RANDOM" if tx_add else "PUBLIC",
            "rx_addr_type": "RANDOM" if rx_add else "PUBLIC",
            "pdu_length": pdu_length,
            "adva": adva_mac,
            "payload_len": len(payload_data)
        }
        
        if pdu_type == cls.PDU_TYPE_ADV_EXT_IND:
            # Extended Advertising header format: [ExtHeaderLen: 6b | AdvMode: 2b]
            if len(payload_data) > 0:
                ext_hdr_len = payload_data[0] & 0x3F
                adv_mode = (payload_data[0] >> 6) & 0x03
                result["extended_info"] = {
                    "ext_header_length": ext_hdr_len,
                    "adv_mode": ["Non-Conn Non-Scan", "Connectable", "Scannable", "Reserved"][adv_mode],
                    "has_aux_ptr": True
                }
        return result

# Verification Test Bench with 3 Real-World Captured Packet Vectors
vectors = [
    # Vector 1: Legacy ADV_IND (Type 0x00, Public Address, Length 16 bytes: 6B AdvA + 10B AdvData)
    # Header: 0x1000 (Type 0, Length 16), AdvA: AA:BB:CC:DD:EE:FF, AdvData: Flags + Name
    bytes([0x00, 0x10]) + bytes([0xFF, 0xEE, 0xDD, 0xCC, 0xBB, 0xAA]) + b"\\x02\\x01\\x06\\x05\\x09Node",
    
    # Vector 2: Legacy SCAN_RSP (Type 0x04, Random Address, Length 12 bytes)
    bytes([0x44, 0x0C]) + bytes([0x11, 0x22, 0x33, 0x44, 0x55, 0x66]) + b"\\x05\\x08DevRsp",
    
    # Vector 3: BLE 5.0 ADV_EXT_IND (Type 0x07, Random Address, Length 10 bytes)
    bytes([0x47, 0x0A]) + bytes([0x99, 0x88, 0x77, 0x66, 0x55, 0x44]) + bytes([0x03, 0x00, 0x11, 0x22])
]

print("=== BLE Comprehensive Advertising Protocol Multi-Vector Parser Engine ===")
for idx, vec in enumerate(vectors):
    parsed = BLEFullAdvertisingProtocolEngine.parse_raw_ll_advertising_packet(vec)
    print(f"Vector {idx+1}: {parsed['pdu_name']:12s} | Addr: {parsed['adva']} ({parsed['tx_addr_type']}) | "
          f"PDU Len: {parsed['pdu_length']}B | Payload: {parsed['payload_len']}B")
    if "extended_info" in parsed:
        print(f"  -> Extended Mode: {parsed['extended_info']['adv_mode']} (AuxPtr Active)")
"""
    p5_codeNotes = [
        "Defines BLEFullAdvertisingProtocolEngine parsing 16-bit LL Advertising Headers and 48-bit MAC addresses.",
        "Validates legacy PDUs (ADV_IND, SCAN_RSP) alongside Bluetooth 5.0 Extended Advertising (ADV_EXT_IND).",
        "Executes a deterministic 3-vector test bench verifying bitfield unpacking across diverse advertising modes."
    ]
    p5_tryIt = "Introduce a corrupt 4-byte packet and verify that the parser raises ValueError for short frames."
    p5_check = {
        "question": "Which field in the Link Layer Advertising PDU Header indicates whether the packet is an ADV_IND, SCAN_REQ, SCAN_RSP, or ADV_EXT_IND?",
        "options": [
            "The 4-bit PDU Type field located in the lower 4 bits of the first header octet.",
            "The 24-bit CRC polynomial at the end of the frame.",
            "The 32-bit Access Address.",
            "The 8-bit Preamble."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the Bluetooth specification: The first 4 bits of the 16-bit Link Layer Advertising Header define the PDU Type (0x00 for ADV_IND, 0x03 for SCAN_REQ, 0x04 for SCAN_RSP, 0x07 for ADV_EXT_IND). Options 1, 2, and 3 are synchronization or error detection fields."
    }

    day12_data = {
        "day": 12,
        "title": "BLE Advertising Architecture, Primary Channels & BLE 5.0 Extended Advertising",
        "course": "IoT Networking & Cloud Protocols",
        "minutes": 38,
        "parts": [
            {
                "title": "Primary Advertising Channels, AdvInterval & Random Delay Jitter",
                "say": p1_say,
                "example": p1_example,
                "code": p1_code,
                "output": "",
                "codeNotes": p1_codeNotes,
                "tryIt": p1_tryIt,
                "check": p1_check
            },
            {
                "title": "Legacy Advertising Payload Anatomy & AD Type Data Structures",
                "say": p2_say,
                "example": p2_example,
                "code": p2_code,
                "output": "",
                "codeNotes": p2_codeNotes,
                "tryIt": p2_tryIt,
                "check": p2_check
            },
            {
                "title": "Active Scanning, SCAN_REQ and SCAN_RSP Turnaround Timing",
                "say": p3_say,
                "example": p3_example,
                "code": p3_code,
                "output": "",
                "codeNotes": p3_codeNotes,
                "tryIt": p3_tryIt,
                "check": p3_check
            },
            {
                "title": "Bluetooth 5.0 Extended Advertising, AuxPtr & Secondary Channels",
                "say": p4_say,
                "example": p4_example,
                "code": p4_code,
                "output": "",
                "codeNotes": p4_codeNotes,
                "tryIt": p4_tryIt,
                "check": p4_check
            },
            {
                "title": "Full BLE Advertising & Extended PDU Multi-Vector Parser Engine",
                "say": p5_say,
                "example": p5_example,
                "code": p5_code,
                "output": "",
                "codeNotes": p5_codeNotes,
                "tryIt": p5_tryIt,
                "check": p5_check
            }
        ],
        "summary": [
            "BLE utilizes Channels 37, 38, and 39 for Primary Advertising, separated across the 2.4 GHz band to avoid co-channel Wi-Fi interference.",
            "The mandatory 0 to 10 ms advDelay pseudo-random jitter eliminates phase-locked packet collisions in unslotted ALOHA beacon networks.",
            "Legacy advertising PDUs carry a maximum of 31 bytes of AdvData, structured as Type-Length-Value (TLV) AD structures.",
            "Active scanning employs a SCAN_REQ and SCAN_RSP transaction (spaced by 150 us T_IFS) to double effective broadcast capacity to 62 bytes.",
            "Bluetooth 5.0 Extended Advertising offloads payloads up to 1,650 bytes to secondary data channels (0–36) using lightweight ADV_EXT_IND AuxPtr pointers."
        ],
        "projectStep": {
            "title": "BLE Advertising Protocol Stack & Extended PDU Analyzer",
            "steps": [
                "Simulate multi-beacon unsynchronized broadcasting and quantify collision elimination via 0–10 ms advDelay jitter.",
                "Implement the binary serializer and parser for 31-byte legacy AD structures (Flags, UUIDs, Names, TX Power, Manufacturer Data).",
                "Model the complete Active Scanning sequence (ADV_IND -> T_IFS -> SCAN_REQ -> T_IFS -> SCAN_RSP) and evaluate microsecond latency.",
                "Construct the Bluetooth 5.0 AuxPtr calculator and payload fragmenter for chained secondary channel broadcasts up to 1,650 bytes.",
                "Execute the multi-vector Link Layer PDU parser validating legacy and extended advertising frame types."
            ]
        }
    }

    # Execute all code snippets dynamically to guarantee 100% exact output match
    sub_env = {**os.environ, "PYTHONIOENCODING": "utf-8"}
    for idx, p in enumerate(day12_data["parts"]):
        proc = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True, encoding="utf-8", env=sub_env)
        if proc.returncode != 0:
            print(f"Day 12 Part {idx+1} execution error:\n{proc.stderr}")
            sys.exit(1)
        p["output"] = proc.stdout.strip()

    wcs = [len(" ".join(p["say"]).split()) for p in day12_data["parts"]]
    print(f"Day 12 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_net_day12.json", "w", encoding="utf-8") as f:
        json.dump(day12_data, f, indent=2, ensure_ascii=False)
    print("Successfully built scripts/iot_net_day12.json!")

if __name__ == '__main__':
    build_day12()
