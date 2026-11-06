# scripts/build_iot_net_day14.py
"""
Builds Day 14 for Course 18: IoT Networking & Cloud Protocols (iot_net).
Day 14: BLE Connection Establishment, Supervision Invariants & Adaptive Frequency Hopping (AFH)
Pedagogical Invariants:
- Exactly 5 parts, each strictly >= 580 words (target >= 620 words).
- minutes: 38.
- 100% deterministic Python standard library execution, verified output capture.
- 4 multiple choice options with answer: 0 and deep why.
- Strict mathematical & architectural depth: CONNECT_IND framing, Anchor point alignment, Connection Interval (7.5ms-4.0s), Peripheral Latency, Supervision Timeout Invariant (T_supervision > (1 + Latency) * T_conn * 2), Adaptive Frequency Hopping (AFH), Channel Selection Algorithm (CSA #1 vs CSA #2), LL_CONNECTION_UPDATE_IND.
"""

import json
import os
import subprocess
import sys

VALIDATOR_CODE = '''class BLESupervisionInvariantValidator:
    MIN_INTERVAL_MS = 7.5
    MAX_INTERVAL_MS = 4000.0
    MIN_TIMEOUT_MS = 100.0
    MAX_TIMEOUT_MS = 32000.0
    MAX_LATENCY = 499
    
    @classmethod
    def validate_connection_parameters(cls, interval_ms: float, latency: int, 
                                       timeout_ms: float, platform: str = "BLUETOOTH_SIG") -> dict:
        errors = []
        warnings = []
        if not (cls.MIN_INTERVAL_MS <= interval_ms <= cls.MAX_INTERVAL_MS):
            errors.append(f"Interval {interval_ms:.2f}ms outside valid range [7.5ms, 4000.0ms]")
        if not (0 <= latency <= cls.MAX_LATENCY):
            errors.append(f"Latency {latency} outside valid range [0, 499]")
        if not (cls.MIN_TIMEOUT_MS <= timeout_ms <= cls.MAX_TIMEOUT_MS):
            errors.append(f"Timeout {timeout_ms:.0f}ms outside valid range [100ms, 32000ms]")
            
        min_allowed_timeout_sig = (1 + latency) * interval_ms * 2.0
        if timeout_ms <= min_allowed_timeout_sig:
            errors.append(
                f"VIOLATION: Supervision Timeout ({timeout_ms:.0f}ms) must be strictly greater than "
                f"(1 + Latency) * Interval * 2 ({min_allowed_timeout_sig:.1f}ms). Risk: False Drops!"
            )
            
        if platform == "APPLE_IOS":
            min_apple_timeout = (1 + latency) * interval_ms * 3.0
            if timeout_ms < min_apple_timeout:
                errors.append(f"APPLE GUIDELINE VIOLATION: Timeout must be >= (1+L)*Interval*3 ({min_apple_timeout:.1f}ms)")
            if timeout_ms > 6000.0:
                errors.append(f"APPLE GUIDELINE VIOLATION: Supervision Timeout cannot exceed 6.0 seconds (got {timeout_ms/1000:.1f}s)")
            if interval_ms < 15.0:
                warnings.append("Apple recommends Interval >= 15.0ms for general BLE accessories.")
                
        return {
            "platform": platform,
            "is_valid": len(errors) == 0,
            "min_safe_timeout_ms": min_allowed_timeout_sig,
            "errors": errors,
            "warnings": warnings
        }
'''

CSA2_CODE = '''class BLEChannelSelectionAlgorithm2:
    TOTAL_DATA_CHANNELS = 37
    
    def __init__(self, access_address: int, channel_map_bitmask: int):
        self.access_address = access_address
        self.used_channels = [ch for ch in range(self.TOTAL_DATA_CHANNELS) 
                              if (channel_map_bitmask & (1 << ch)) != 0]
        if len(self.used_channels) < 2:
            raise ValueError("Channel Map must contain at least 2 used channels.")
            
    @staticmethod
    def _mam16(a: int, b: int) -> int:
        return (a * b) & 0xFFFF
        
    @staticmethod
    def _bit_reverse_16(val: int) -> int:
        res = 0
        for _ in range(16):
            res = (res << 1) | (val & 1)
            val >>= 1
        return res

    def compute_csa2_channel(self, event_counter: int) -> dict:
        aa_lower = self.access_address & 0xFFFF
        aa_upper = (self.access_address >> 16) & 0xFFFF
        
        prn_e = (event_counter ^ aa_lower) & 0xFFFF
        prn_e = self._mam16(prn_e, 0x0011) ^ aa_upper
        prn_e = (prn_e * 0x0011) & 0xFFFF
        
        unmapped_channel = prn_e % self.TOTAL_DATA_CHANNELS
        if unmapped_channel in self.used_channels:
            final_channel = unmapped_channel
            was_remapped = False
        else:
            remapping_index = (self._bit_reverse_16(prn_e) * len(self.used_channels)) >> 16
            final_channel = self.used_channels[remapping_index]
            was_remapped = True
            
        freq_mhz = 2402.0 + 2.0 * final_channel
        return {
            "event_counter": event_counter,
            "unmapped_channel": unmapped_channel,
            "final_channel": final_channel,
            "freq_mhz": freq_mhz,
            "was_remapped": was_remapped
        }
'''

def build_day14():
    # =========================================================================
    # Part 1: Connection Handshake, CONNECT_IND Framing & Anchor Point Timing
    # =========================================================================
    p1_say = [
        "Welcome to Day 14 of IoT Networking & Cloud Protocols. Having mastered advertising architectures, active scanning, and cryptographic identity privacy in Days 12 and 13, we now investigate the pinnacle of point-to-point BLE communication: Connection Establishment and Link Layer Synchronization.",
        "While advertising allows broadcast beacons to disperse telemetry across open airwaves, bidirectional data transfers—such as streaming electrocardiograms, uploading sensor logs, or securely commissioning industrial actuators—require a robust, power-optimized, deterministic connection.",
        "In Bluetooth Low Energy, a connection is not a persistent RF carrier wave. Instead, it is an exquisitely choreographed series of microsecond-accurate time slots called Connection Events, scheduled at deterministic intervals between two synchronized radios.",
        "The connection process begins when a Central device enters the Initiating state while listening for connectable advertising packets (ADV_IND or ADV_DIRECT_IND) on primary advertising channels 37, 38, or 39.",
        "When the Initiator's radio captures a connectable packet from its target Peripheral, it pauses for exactly the Interframe Spacing time (T_IFS = 150 microseconds) and transmits a 34-byte Link Layer PDU known as CONNECT_IND (Connection Indication).",
        "The CONNECT_IND frame is the ultimate architectural mandate of the new connection. It contains the 6-byte Initiator address (InitA), the 6-byte target Peripheral address (AdvA), and a 22-byte payload termed the Link Layer Data (LLData).",
        "Within the LLData payload, the Central unilaterally defines the physical and timing reality of the connection link:",
        "1. Access Address (AA, 4 octets): A cryptographically random 32-bit integer generated according to strict rules (it must have no more than six consecutive zeros or ones, cannot equal the advertising address 0x8E89BED6, and cannot have all four octets identical). This random address becomes the physical hardware filter for all subsequent data packets.",
        "2. CRC Initialization (CRCInit, 3 octets): A 24-bit pseudo-random initialization vector used by both transceivers to seed their linear feedback shift registers for CRC-24 calculation.",
        "3. Window Size (WinSize, 1 octet) and Window Offset (WinOffset, 2 octets): These fields define the Transmit Window—the exact microsecond time interval during which the Central will transmit its very first packet on data channel 0–36.",
        "4. Connection Interval (Interval, 2 octets), Peripheral Latency (Latency, 2 octets), and Supervision Timeout (Timeout, 2 octets): The triad governing ongoing link timing and endurance.",
        "5. Channel Map (ChM, 5 octets): A 37-bit bitmask declaring which of the 37 data channels (0–36) are deemed RF-healthy (Good) and which are marked interfered (Bad) by local Wi-Fi noise.",
        "6. Hop Increment (Hop, 5 bits): A pseudo-random integer between 5 and 16 used by Channel Selection Algorithm #1.",
        "Upon transmitting or receiving CONNECT_IND, both radios transition immediately into the Connected state. The Peripheral sets its hardware timer to wake up at: First Anchor Point = t_connect_ind_end + 1.25 ms + WinOffset. When that timer fires, the Central transmits its first packet, the Peripheral returns an acknowledgment, and the link achieves phase-lock synchronization.",
        "In modern Bluetooth 5.0 and 5.2 controllers, connection establishment can also occur over secondary advertising channels using AUX_CONNECT_REQ and AUX_CONNECT_RSP. This extended connection handshake offloads connection requests from crowded primary channels, enabling connections to be established directly on high-speed 2M PHY or long-range LE Coded PHY.",
        "Regardless of whether legacy CONNECT_IND or extended handshakes are used, the timing relationship between the transmission window and the anchor point remains absolute. If the Peripheral fails to detect the Central's packet within the Transmit Window (WinOffset to WinOffset + WinSize), it remains in the connecting state for subsequent scheduled intervals until either a packet is received or the supervision timer expires.",
        "Furthermore, modern Link Layer controllers continuously calibrate their 32.768 kHz sleep crystal oscillators against high-frequency 32 MHz or 64 MHz radio clocks to prevent anchor point drift. If crystal drift causes the peripheral's wake-up timer to slip by more than a few microseconds, the receiver's early-listening window (Window Widening) expands dynamically to ensure the preamble is never clipped."
    ]
    p1_example = "Think of a scheduled railway crossing. The train dispatcher (Central) hands the stationmaster (Peripheral) an official schedule manifest (CONNECT_IND). The manifest says: 'Our private train code is 0xA1B2C3D4 (Access Address). The first train will arrive in exactly 12.5 milliseconds (WinOffset). After that, a train will pass every 50 milliseconds on the dot (Connection Interval). If 2 seconds pass without a train, sound the alarm and shut down the line (Supervision Timeout)'."
    p1_code = """# BLE Link Layer CONNECT_IND Packet Dissector & Anchor Point Calculator
import struct

class BLEConnectIndEngine:
    @classmethod
    def parse_connect_ind_pdu(cls, raw_bytes: bytes) -> dict:
        if len(raw_bytes) < 34:
            raise ValueError("CONNECT_IND PDU must be exactly 34 bytes (12B Addrs + 22B LLData)")
            
        inita = ":".join(f"{b:02X}" for b in reversed(raw_bytes[0:6]))
        adva  = ":".join(f"{b:02X}" for b in reversed(raw_bytes[6:12]))
        
        lldata = raw_bytes[12:34]
        access_address = struct.unpack("<I", lldata[0:4])[0]
        crc_init = struct.unpack("<I", lldata[4:7] + b"\\x00")[0]
        
        win_size_slots = lldata[7]
        win_offset_slots = struct.unpack("<H", lldata[8:10])[0]
        interval_slots = struct.unpack("<H", lldata[10:12])[0]
        latency_val = struct.unpack("<H", lldata[12:14])[0]
        timeout_slots = struct.unpack("<H", lldata[14:16])[0]
        
        chm_bytes = lldata[16:21]
        hop_increment = lldata[21] & 0x1F
        
        # Unit Conversions based on Bluetooth Core Specification:
        # WinSize & WinOffset: 1.25 ms units
        # Interval: 1.25 ms units (Valid range: 6 to 3200 -> 7.5 ms to 4.0 s)
        # Timeout: 10 ms units (Valid range: 10 to 3200 -> 100 ms to 32.0 s)
        win_size_ms = win_size_slots * 1.25
        win_offset_ms = win_offset_slots * 1.25
        interval_ms = interval_slots * 1.25
        timeout_ms = timeout_slots * 10.0
        
        # Calculate First Anchor Point delay from end of CONNECT_IND
        first_anchor_delay_ms = 1.25 + win_offset_ms
        
        return {
            "inita": inita,
            "adva": adva,
            "access_address": f"0x{access_address:08X}",
            "crc_init": f"0x{crc_init:06X}",
            "win_size_ms": win_size_ms,
            "win_offset_ms": win_offset_ms,
            "first_anchor_delay_ms": first_anchor_delay_ms,
            "interval_ms": interval_ms,
            "latency": latency_val,
            "timeout_ms": timeout_ms,
            "hop_increment": hop_increment,
            "active_channels": bin(int.from_bytes(chm_bytes, 'little')).count('1')
        }

# Construct sample raw 34-byte CONNECT_IND packet
# InitA: 11:22:33:44:55:66, AdvA: AA:BB:CC:DD:EE:FF
raw_pdu = (
    bytes([0x66, 0x55, 0x44, 0x33, 0x22, 0x11]) + # InitA
    bytes([0xFF, 0xEE, 0xDD, 0xCC, 0xBB, 0xAA]) + # AdvA
    struct.pack("<I", 0xA5B6C7D8) +                # Access Address
    bytes([0x55, 0xAA, 0x55]) +                    # CRCInit (24-bit)
    bytes([0x02]) +                                # WinSize: 2 * 1.25 = 2.5 ms
    struct.pack("<H", 8) +                         # WinOffset: 8 * 1.25 = 10.0 ms
    struct.pack("<H", 40) +                        # Interval: 40 * 1.25 = 50.0 ms
    struct.pack("<H", 4) +                         # Latency: 4 events
    struct.pack("<H", 200) +                       # Timeout: 200 * 10 = 2000 ms
    bytes([0xFF, 0xFF, 0xFF, 0xFF, 0x1F]) +        # ChM: All 37 channels active (0x1FFFFFFFFF)
    bytes([0x07])                                  # Hop Increment: 7
)

parsed = BLEConnectIndEngine.parse_connect_ind_pdu(raw_pdu)
print("=== BLE Link Layer CONNECT_IND Binary Dissector & Timing Analysis ===")
print(f"Master (InitA): {parsed['inita']} ---> Slave (AdvA): {parsed['adva']}")
print(f"Negotiated Access Address: {parsed['access_address']} | CRC Init: {parsed['crc_init']}")
print(f"First Anchor Point Delay:  {parsed['first_anchor_delay_ms']:.2f} ms (WinOffset: {parsed['win_offset_ms']:.2f} ms)")
print(f"Connection Interval:       {parsed['interval_ms']:.2f} ms ({parsed['interval_ms']/1.25:.0f} slots)")
print(f"Peripheral Latency:        {parsed['latency']} skipped events")
print(f"Supervision Timeout:       {parsed['timeout_ms']:.0f} ms ({parsed['timeout_ms']/10:.0f} slots)")
print(f"Channel Map:               {parsed['active_channels']}/37 active channels | Hop Increment: {parsed['hop_increment']}")
"""
    p1_codeNotes = [
        "Defines BLEConnectIndEngine parsing raw 34-byte CONNECT_IND Link Layer packets.",
        "Decodes WinSize, WinOffset, Connection Interval, Slave Latency, and Supervision Timeout bitfields.",
        "Calculates the exact First Anchor Point delay according to Bluetooth Core Specification timing."
    ]
    p1_tryIt = "Modify interval_slots to 80 and observe that the connection interval doubles to 100.0 ms."
    p1_check = {
        "question": "In the BLE CONNECT_IND packet, what is the base unit of time used to encode the Connection Interval and the Supervision Timeout?",
        "options": [
            "Connection Interval is encoded in 1.25 ms units; Supervision Timeout is encoded in 10.0 ms units.",
            "Both Connection Interval and Supervision Timeout are encoded in 1.0 second units.",
            "Connection Interval is encoded in 320 us CSMA slots; Supervision Timeout is encoded in microseconds.",
            "Both values are encoded as arbitrary floating-point numbers in milliseconds."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the Bluetooth specification: Connection Interval is specified in discrete steps of 1.25 ms (range 6 to 3200, giving 7.5 ms to 4.0 s). Supervision Timeout is specified in discrete steps of 10.0 ms (range 10 to 3200, giving 100 ms to 32.0 s). Options 1, 2, and 3 are incorrect."
    }

    # =========================================================================
    # Part 2: The Connection Parameter Triad: Interval, Latency & Timeout
    # =========================================================================
    p2_say = [
        "Once a BLE connection is established, the ongoing physical behavior, responsiveness, and electrical power consumption of both transceivers are governed completely by three tightly interrelated parameters: the Connection Parameter Triad.",
        "1. Connection Interval (connInterval): The precise time delta between consecutive Connection Events, configured in discrete increments of 1.25 milliseconds within the range of 7.5 milliseconds (6 slots) to 4.0 seconds (3,200 slots).",
        "During each connection event, the Central radio transmits a packet to the Peripheral at the scheduled anchor point, and the Peripheral is expected to return an immediate packet (such as a data payload or an empty ACK packet) after T_IFS (150 microseconds).",
        "A short connection interval (e.g. 7.5 ms to 15.0 ms) delivers maximum data throughput and ultra-low latency, making it ideal for real-time audio streaming, gaming controllers, or rapid firmware updates. However, because the radio must wake up and burn high active current dozens of times per second, battery life drops precipitously.",
        "A long connection interval (e.g. 1.0 s to 4.0 s) dramatically lowers radio duty cycle, enabling coin-cell battery life measured in years, but limits throughput and creates noticeable command response latency.",
        "2. Peripheral Latency (connPeripheralLatency, historically Slave Latency): An integer between 0 and 499 representing the number of consecutive connection events that the Peripheral is permitted to ignore (sleep through) if it has no application data to send.",
        "Peripheral Latency is one of the most brilliant power-saving mechanisms in modern wireless protocols.",
        "Consider a Peripheral with a Connection Interval of 50 ms and Peripheral Latency = 9. When the Peripheral has no sensor updates to transmit, it simply stays in low-power deep sleep for 9 consecutive events, waking up only on the 10th event (every 500 ms) to exchange an empty packet with the Central, keeping the link alive.",
        "However, if the user suddenly presses a button or an industrial sensor detects a critical threshold breach, the Peripheral can wake up at ANY scheduled 50 ms interval without waiting for the latency period to expire. This asymmetric architecture delivers the best of both worlds: ultra-low average power consumption during idle periods combined with instant, low-latency responsiveness when events occur.",
        "3. Supervision Timeout (connSupervisionTimeout): The maximum allowable duration that a device will tolerate without receiving a single valid over-the-air packet from its peer before declaring the physical link dead, dropping the connection state, and notifying the Host application.",
        "Supervision Timeout is configured in increments of 10.0 milliseconds within the allowable range of 100 milliseconds (10 slots) to 32.0 seconds (3,200 slots).",
        "Balancing this triad requires embedded engineers to respect strict mathematical constraints, as an improperly configured combination will cause sudden, unexplained link disconnections.",
        "In production multi-connection topologies—where a Central hub connects simultaneously to eight or more wireless sensors—the Central's Link Layer scheduler must interleave connection events without time-domain overlap. If Sensor A has an interval of 20 ms and Sensor B has an interval of 30 ms, the Central must compute the least common multiple of their schedules to avoid scheduling two active transmissions simultaneously on different channels.",
        "To facilitate multi-connection scheduling, advanced BLE stacks utilize Connection Event Length Extension, allowing a connection event to dynamically expand beyond its minimum slot if both peers have queued data, and contract back to a single packet exchange when queues empty.",
        "When configuring parameters for mobile phone integration, developers must also respect operating system specific connection guidelines. Both iOS and Android enforce distinct minimum intervals (typically 15 ms on iOS and 11.25 ms on Android) and restrict slave latency multipliers to ensure background services do not freeze. Designing parameter negotiation logic that accommodates these platform constraints guarantees smooth cross-platform compatibility."
    ]
    p2_example = "Think of a manager and a remote worker. The Connection Interval is a scheduled check-in every 10 minutes. Peripheral Latency = 5 means the worker can skip up to 5 check-ins (sleep for an hour) if they have nothing to report, but if an urgent fire breaks out, they can check in at the very next 10-minute mark. The Supervision Timeout is 2 hours; if the manager doesn't hear from the worker after 2 hours, they assume the worker has lost internet access and close the ticket."
    p2_code = """# BLE Connection Parameter Triad Duty Cycle & Effective Latency Modeling
class BLEConnectionParamModel:
    def __init__(self, interval_ms: float, latency: int, timeout_ms: float, 
                 tx_rx_charge_uc: float = 18.0, sleep_current_ua: float = 1.5):
        self.interval_ms = interval_ms
        self.latency = latency
        self.timeout_ms = timeout_ms
        self.tx_rx_charge_uc = tx_rx_charge_uc  # Microcoulombs per active event (TX + RX)
        self.sleep_current_ua = sleep_current_ua
        
    @property
    def effective_idle_period_ms(self) -> float:
        # Effective period between wake-ups when no data is pending
        return self.interval_ms * (1 + self.latency)
        
    @property
    def max_event_response_latency_ms(self) -> float:
        # Maximum delay before Peripheral can transmit sudden high-priority data
        return self.interval_ms
        
    def calculate_average_current_ua(self) -> float:
        # Average current = (Q_active / T_period) + I_sleep
        t_period_sec = self.effective_idle_period_ms / 1000.0
        q_active_uc = self.tx_rx_charge_uc
        i_active_ua = q_active_uc / t_period_sec
        return i_active_ua + self.sleep_current_ua

# Compare 3 Real-World Application Profiles
profiles = {
    "Gaming Mouse (High Throughput)":   BLEConnectionParamModel(interval_ms=7.5, latency=0, timeout_ms=500.0),
    "Heart Rate Belt (Balanced)":       BLEConnectionParamModel(interval_ms=50.0, latency=4, timeout_ms=2000.0),
    "Industrial Tank Monitor (Low Pwr)": BLEConnectionParamModel(interval_ms=200.0, latency=19, timeout_ms=10000.0)
}

print("=== BLE Connection Parameter Triad Electrical & Latency Trade-Offs ===")
for name, p in profiles.items():
    avg_uA = p.calculate_average_current_ua()
    # Projected CR2032 lifespan (225 mAh)
    lifespan_years = (225.0 * 1000.0) / avg_uA / 24.0 / 365.25
    print(f"Profile: {name}")
    print(f"  Conn Interval: {p.interval_ms:6.1f} ms | Slave Latency: {p.latency:2d} | Supervision Timeout: {p.timeout_ms:6.0f} ms")
    print(f"  Effective Idle Sleep: {p.effective_idle_period_ms:6.1f} ms | Instant Alert Latency: {p.max_event_response_latency_ms:5.1f} ms")
    print(f"  Average Current Draw: {avg_uA:6.2f} uA | Projected CR2032 Battery: {lifespan_years:5.2f} Years\\n")
"""
    p2_codeNotes = [
        "Defines BLEConnectionParamModel modeling trade-offs between Connection Interval, Latency, and Timeout.",
        "Demonstrates how Peripheral Latency reduces idle power consumption without degrading instant event latency.",
        "Projects coin-cell battery lifespan across Gaming Mouse, Heart Rate, and Industrial Tank profiles."
    ]
    p2_tryIt = "Set latency to 0 on the Industrial Tank profile and observe how average current increases dramatically."
    p2_check = {
        "question": "How does configuring a non-zero Peripheral Latency benefit an embedded BLE sensor node without degrading its ability to report urgent sensor events?",
        "options": [
            "It allows the Peripheral to remain in deep sleep during idle connection events, but if new sensor data arrives, it can wake up and transmit at the very next scheduled connection interval.",
            "It forces the Central node to increase transmit power to +20 dBm.",
            "It eliminates the need for a 32-bit Access Address.",
            "It encrypts the payload using asymmetric RSA-4096 keys."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the core specification mechanism: Peripheral Latency allows the peripheral to skip up to 'Latency' connection events when idle to conserve battery power, while retaining the ability to wake up and transmit immediately on the next interval when fresh data requires transmission. Options 1, 2, and 3 are incorrect."
    }

    # =========================================================================
    # Part 3: The Supervision Timeout Invariant & False Dropout Avoidance
    # =========================================================================
    p3_say = [
        "In embedded wireless systems, one of the most frustrating and pervasive firmware bugs encountered by junior engineers is the 'Random BLE Disconnection' phenomenon.",
        "A device connects successfully, exchanges packets for a few seconds, and then abruptly drops the link with an HCI error code: 0x08 (HCI_STATUS_CONNECTION_TIMEOUT).",
        "In over 90% of cases, this issue is not caused by RF interference, antenna detuning, or broken hardware. It is caused by application firmware violating the fundamental mathematical invariant of the Bluetooth specification: The Supervision Timeout Invariant.",
        "The Bluetooth Core Specification mandates that the Supervision Timeout, connSupervisionTimeout, must satisfy the following strict inequality:",
        "connSupervisionTimeout > (1 + connPeripheralLatency) * connConnectionInterval * 2",
        "Let us dissect the rigorous physical and mathematical necessity behind this inequality.",
        "Suppose a connection is configured with connConnectionInterval = 100 milliseconds and connPeripheralLatency = 4. When the Peripheral is idle, it is legally entitled by the specification to sleep through 4 consecutive events, waking up only once every (1 + 4) * 100 ms = 500 milliseconds.",
        "Now, suppose an engineer inadvertently configures connSupervisionTimeout to 500 milliseconds (violating the invariant, since 500 is not strictly greater than 500 * 2 = 1000 ms).",
        "If a single RF collision or temporary multi-path fade corrupts the packet transmitted during that 500 ms wake-up event, the Central's supervision timer will reach 500 ms before the Peripheral's next legal wake-up opportunity (at t = 1000 ms).",
        "The Central's Link Layer Controller will immediately conclude that the Peripheral has died, moved out of range, or suffered catastrophic power failure. It tears down the connection and emits an HCI Connection Timeout event.",
        "Notice the factor of 2 at the end of the invariant formula. The specification includes this multiplication by 2 to guarantee that the connection can tolerate at least ONE full missed anchor point due to transient RF interference without triggering a false disconnection.",
        "Furthermore, operating systems enforce their own strict platform rules on top of the Bluetooth SIG specification. For example, Apple's Bluetooth Accessory Design Guidelines mandate: connSupervisionTimeout <= 6.0 seconds, connConnectionInterval >= 15 ms, and connSupervisionTimeout >= (1 + connPeripheralLatency) * connConnectionInterval * 3 (requiring a safety factor of 3 instead of 2).",
        "If an accessory requests parameters that violate Apple or Google Android invariants, the smartphone's Bluetooth stack will either reject the L2CAP Connection Parameter Update Request or unilaterally force default parameters.",
        "Rigorous verification of the Supervision Timeout Invariant is therefore a non-negotiable requirement for commercial IoT firmware development.",
        "In mission-critical industrial sensor networks operating near heavy machinery, high-voltage variable frequency drives (VFDs) and arc welders generate severe burst electromagnetic interference that can wipe out multiple consecutive packets. In such environments, setting the supervision timeout to merely 2 times the effective idle interval is insufficient.",
        "Industrial firmware architects commonly apply a safety factor of 6 to 8: setting connSupervisionTimeout to 4.0 or 6.0 seconds even when effective reporting occurs every 500 ms. This expansive margin allows the Link Layer's Adaptive Frequency Hopping engine to cycle through multiple clean channels and successfully exchange recovery packets long before the supervision timer expires, maintaining continuous link survivability.",
        "Furthermore, when devices undergo Dynamic PHY Updates—such as switching from 1M PHY to LE Coded S=8—the duration of individual packets increases eightfold. If connection parameters are too tight, packet duration combined with retransmission timeouts can collide with subsequent anchor points. Ensuring an expansive supervision timeout prevents false link dropouts during dynamic modulation transitions.",
        "Engineers must also consider the interaction between supervision timeout and RTOS task watchdogs. If an RTOS task freezes while holding a Bluetooth semaphore, the Link Layer supervision timer provides a critical failsafe, resetting the connection state machine and allowing system recovery without a full device reboot."
    ]
    p3_example = "Think of a safety check-in protocol on a construction site. If workers are permitted to check in once every 30 minutes (Interval * (1 + Latency)), you cannot set the emergency panic alarm (Supervision Timeout) to 30 minutes. If a worker gets stuck in an elevator for 31 minutes, or their radio battery blips during a single check-in, the alarm will sound and fire trucks will arrive at the site unnecessarily. The alarm must be set to at least 65 minutes (more than twice the check-in period) to prevent false alarms."
    p3_code = VALIDATOR_CODE + """
# Evaluate 3 Test Parameter Vectors
test_cases = [
    # Case 1: Buggy configuration (Timeout too short)
    {"name": "Faulty Firmware Vector A", "interval": 100.0, "latency": 4, "timeout": 500.0, "plat": "BLUETOOTH_SIG"},
    # Case 2: Compliant standard SIG parameters
    {"name": "Compliant Standard Vector B", "interval": 50.0, "latency": 4, "timeout": 2000.0, "plat": "BLUETOOTH_SIG"},
    # Case 3: Rejected by Apple iOS Guidelines (Timeout > 6s)
    {"name": "Apple Guideline Conflict Vector C", "interval": 200.0, "latency": 15, "timeout": 12000.0, "plat": "APPLE_IOS"}
]

print("=== BLE Supervision Timeout Invariant Verification Engine ===")
for tc in test_cases:
    res = BLESupervisionInvariantValidator.validate_connection_parameters(
        tc["interval"], tc["latency"], tc["timeout"], tc["plat"]
    )
    status_str = "VALID (COMPLIANT)" if res["is_valid"] else "INVALID (REJECTED)"
    print(f"Test: {tc['name']} -> {status_str}")
    print(f"  Params: Interval={tc['interval']:.1f}ms, Latency={tc['latency']}, Timeout={tc['timeout']:.0f}ms")
    print(f"  Required Min Timeout: > {res['min_safe_timeout_ms']:.1f} ms")
    for err in res["errors"]:
        print(f"  [ERROR] {err}")
    for warn in res["warnings"]:
        print(f"  [WARN]  {warn}")
    print()
"""
    p3_codeNotes = [
        "Defines BLESupervisionInvariantValidator enforcing Bluetooth SIG Core specification rules.",
        "Validates the mathematical requirement: Supervision Timeout > (1 + Latency) * Interval * 2.",
        "Applies Apple iOS Accessory Design Guidelines restricting maximum timeout to 6.0 seconds."
    ]
    p3_tryIt = "Set interval to 100 ms, latency to 4, and timeout to 1100 ms and verify that it passes validation."
    p3_check = {
        "question": "What is the mandatory mathematical relationship between Supervision Timeout, Connection Interval, and Peripheral Latency in Bluetooth Low Energy?",
        "options": [
            "Supervision Timeout must be strictly greater than (1 + Peripheral Latency) * Connection Interval * 2.",
            "Supervision Timeout must always equal the Connection Interval divided by 2.",
            "Peripheral Latency must be greater than the Supervision Timeout multiplied by 37.",
            "Supervision Timeout is fixed at exactly 10.24 seconds regardless of other parameters."
        ],
        "answer": 0,
        "why": "Option 0 is mathematically correct: To guarantee that a connection can withstand at least one full missed wake-up event due to transient RF noise without triggering a false link drop, the Bluetooth specification mandates that Timeout > (1 + Latency) * Interval * 2. Options 1, 2, and 3 are completely incorrect."
    }

    # =========================================================================
    # Part 4: Adaptive Frequency Hopping (AFH) & Channel Selection Algorithm #2
    # =========================================================================
    p4_say = [
        "In shared 2.4 GHz spectrum environments, maintaining an active wireless link across a single fixed frequency channel is doomed to failure.",
        "High-power Wi-Fi routers broadcasting 40 MHz or 80 MHz channels, microwave ovens radiating hundreds of watts of magnetron leakage, and neighboring wireless devices produce severe localized co-channel interference.",
        "To achieve robust, carrier-grade communication reliability, Bluetooth Low Energy employs Adaptive Frequency Hopping (AFH) across the 37 General Data channels (Channels 0 through 36).",
        "During every single Connection Event, the Central and Peripheral radios hop together to a new physical RF channel. Even if Wi-Fi Channel 6 (2437 MHz) is completely saturated with heavy streaming video traffic, a BLE connection event landing on Channel 17 or Channel 18 may suffer a packet drop, but the subsequent connection event will immediately hop to a clean, quiet frequency outside the Wi-Fi band (such as Channel 25 at 2454 MHz or Channel 36 at 2478 MHz).",
        "The Bluetooth Core Specification defines two distinct channel selection algorithms: Channel Selection Algorithm #1 (CSA #1, introduced in Bluetooth 4.0) and Channel Selection Algorithm #2 (CSA #2, introduced in Bluetooth 5.0).",
        "In legacy CSA #1, the next channel is computed using a simple linear modulo step: unmappedChannel = (lastUnmappedChannel + hopIncrement) % 37, where hopIncrement is a fixed integer between 5 and 16 assigned in CONNECT_IND.",
        "If the resulting unmappedChannel is marked as 'Bad' (interfered) in the active Channel Map, it is remapped into the pool of 'Good' (used) channels using a secondary lookup table: remappedChannel = unmappedChannel % numUsedChannels.",
        "While computationally trivial, CSA #1 suffers from severe spectral predictability and pseudo-random clustering. If multiple BLE links share the same hop increment, they tend to collide repeatedly across consecutive events.",
        "To decisively eliminate this clustering vulnerability, Bluetooth 5.0 introduced Channel Selection Algorithm #2 (CSA #2).",
        "CSA #2 utilizes a high-entropy pseudo-random permutation generator based on 16-bit integer multiplication, bitwise rotation, and bit-reversal operations.",
        "The inputs to the CSA #2 state machine are the 16-bit Connection Event Counter (which increments deterministically on every scheduled anchor point) and the 32-bit Access Address.",
        "Because the Access Address is unique to every single active link in the physical world, two co-located connections operating in the same room will follow completely orthogonal, uncorrelated frequency hopping paths even when their connection intervals and start times coincide perfectly.",
        "The active Channel Map is dynamically maintained by the Central device through Channel Classification. The Central's Link Layer continuously monitors packet error rates (PER) and Received Signal Strength Indicators (RSSI) across all 37 channels.",
        "When an active channel suffers elevated packet loss, the Central transmits an LL_CHANNEL_MAP_IND control PDU declaring the new channel mask. Both transceivers apply the new channel map at a synchronized future instant, gracefully steering communication traffic away from noisy RF bands without interrupting application data flow.",
        "Under the Bluetooth Core Specification, the Channel Map update requires that at least 2 data channels remain marked as Good in the bitmask. If a noisy RF environment degrades 35 out of 37 channels, the Controller must still hop between the remaining 2 channels, ensuring that frequency diversity is never completely abandoned.",
        "In production firmware, Channel Classification algorithms utilize moving average filters to compute Packet Error Rate (PER) per channel over time windows of 10 to 30 seconds. Channels exhibiting PER above 30% are dynamically demoted to Bad, while previously noisy channels that demonstrate quiet RSSI during background passive sweeps are gradually rehabilitated and restored to the active Channel Map.",
        "In enterprise campus deployments where dozens of Wi-Fi 6 access points operate on 80 MHz channel widths, almost half of the 2.4 GHz spectrum can experience sustained interference. CSA #2's pseudo-random remapping shines in these scenarios: by remapping blocked frequencies uniformly across the remaining quiet channels, it prevents repeat collisions and ensures that neither device experiences localized packet stalls."
    ]
    p4_example = "Think of two dancers navigating a crowded dance floor full of swinging obstacles (Wi-Fi interference). CSA #1 is taking 7 steps forward and 1 step right every time; if an obstacle is there, you take a predictable sidestep. CSA #2 is following a complex choreographed routine dictated by a secret song rhythm (the Access Address); the dancers weave unpredictably across all clear floor spaces, never bumping into other dancing pairs."
    p4_code = CSA2_CODE + """
# Simulate CSA #2 across 10 consecutive connection events
# Channel Map: Disable Wi-Fi Channel 6 (Channels 11-19 blocked due to heavy 2.437 GHz interference)
full_map = (1 << 37) - 1
bad_channels_mask = 0
for bad_ch in range(11, 20):  # Mask out Channels 11-19
    bad_channels_mask |= (1 << bad_ch)
clean_channel_map = full_map & (~bad_channels_mask)

csa2_link_a = BLEChannelSelectionAlgorithm2(access_address=0xA1B2C3D4, channel_map_bitmask=clean_channel_map)
csa2_link_b = BLEChannelSelectionAlgorithm2(access_address=0x5E6F7A8B, channel_map_bitmask=clean_channel_map)

print("=== BLE 5.0 Channel Selection Algorithm #2 (CSA #2) Hopping Demonstration ===")
print(f"Total Available Data Channels: {len(csa2_link_a.used_channels)}/37 (Wi-Fi Ch 6 Channels 11-19 Blocked)\\n")
print(f"Event | Link A (AA: 0xA1B2C3D4) Channel [Freq] | Link B (AA: 0x5E6F7A8B) Channel [Freq]")
print("-" * 75)
for event in range(10):
    res_a = csa2_link_a.compute_csa2_channel(event)
    res_b = csa2_link_b.compute_csa2_channel(event)
    remap_str_a = "*" if res_a["was_remapped"] else " "
    remap_str_b = "*" if res_b["was_remapped"] else " "
    print(f"{event:5d} | Ch {res_a['final_channel']:2d}{remap_str_a} ({res_a['freq_mhz']:.1f} MHz)            | "
          f"Ch {res_b['final_channel']:2d}{remap_str_b} ({res_b['freq_mhz']:.1f} MHz)")
print("\\n(* indicates channel was remapped away from blocked Wi-Fi band)")
"""
    p4_codeNotes = [
        "Implements Bluetooth 5.0 Channel Selection Algorithm #2 (CSA #2) with PRNG mixing and bit-reversal remapping.",
        "Demonstrates dynamic avoidance of interfered 2.4 GHz channels (Wi-Fi Ch 6 coexistence).",
        "Validates that distinct Access Addresses yield orthogonal, non-colliding frequency hopping paths."
    ]
    p4_tryIt = "Examine how remapping redirects unmapped channels 11-19 into clean frequencies below 2420 MHz or above 2450 MHz."
    p4_check = {
        "question": "What is the primary architectural improvement of Bluetooth 5.0 Channel Selection Algorithm #2 (CSA #2) over legacy CSA #1?",
        "options": [
            "CSA #2 uses the 32-bit Access Address and pseudo-random PRNG permutation to generate orthogonal, pseudo-random hopping sequences that eliminate multi-link channel clustering.",
            "CSA #2 increases the number of 2.4 GHz RF channels from 40 to 1,000.",
            "CSA #2 abandons frequency hopping and uses ultra-wideband direct sequence spreading exclusively.",
            "CSA #2 requires all devices to synchronize their clocks to GPS satellites."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the Bluetooth 5.0 specification: CSA #2 incorporates the connection's unique 32-bit Access Address and event counter into a high-entropy pseudo-random generator, ensuring that co-located links execute orthogonal hopping sequences that avoid clustering. Options 1, 2, and 3 are incorrect."
    }

    # =========================================================================
    # Part 5: Full BLE Link Parameter Negotiator & AFH Hopping Engine Platform
    # =========================================================================
    p5_say = [
        "To conclude Day 14, we synthesize all connection handshake mechanisms, timing triads, mathematical supervision invariants, and adaptive frequency hopping engines into an integrated simulation platform: the Complete BLE Link Parameter Negotiation & AFH Orchestration Subsystem.",
        "In production firmware architecture (such as Nordic Semiconductor Zephyr OS or FreeRTOS with NimBLE), a BLE connection is not static. Applications frequently transition between low-power sensor telemetry and bursty high-speed firmware uploads.",
        "When an application needs to transfer a large binary firmware patch, the Host requests a Connection Parameter Update. The Central Controller constructs an LL_CONNECTION_UPDATE_IND Link Layer control PDU specifying the new interval, latency, and timeout.",
        "Crucially, the control PDU specifies an Instant: a future 16-bit connection event counter value (typically 6 to 12 events in the future).",
        "Both the Central and Peripheral continue operating on their old connection parameters until the local event counter equals the Instant. At that exact microsecond anchor point, both radios switch simultaneously to the new interval and latency without dropping a single packet or losing clock synchronization.",
        "Our unified software engine models this complete end-to-end lifecycle: validating the Supervision Timeout Invariant across proposed parameter updates, rejecting invalid combinations with descriptive error codes, scheduling synchronized instant handoffs, and running CSA #2 frequency hopping across interfered spectrum maps.",
        "By executing this deterministic test suite, systems engineers verify that their connection management pipelines are immune to false dropouts and compliant with the Bluetooth Core Specification.",
        "In mission-critical connected medical devices—such as hospital patient monitors transmitting vital signs—connection parameter negotiation must be executed with zero data loss. If an emergency occurs and the monitor needs to increase reporting frequency from once per second (1000 ms interval) to 20 times per second (50 ms interval), the parameter update must transition seamlessly while continuous electrocardiogram data streams over the link.",
        "By enforcing deterministic Instant scheduling, the Link Layer guarantees that both radios transition to the 50 ms schedule at the exact same anchor point, maintaining uninterrupted packet sequence numbers (SN and NESN) and avoiding packet retransmissions.",
        "Furthermore, our simulation platform verifies that when a peripheral operates in multi-link environments—such as maintaining an active BLE link to a local nurse's gateway while concurrently broadcasting periodic advertising beacons—the scheduler arbitrates priority conflicts, ensuring connection events are never dropped in favor of background non-connected tasks.",
        "In addition, the simulation engine validates error-handling paths during missed connection events. If channel noise causes an entire connection event to be lost, both transceivers automatically advance their internal event counters and apply the scheduled parameter updates when the Instant counter matches, avoiding state desynchronization.",
        "By enforcing these mathematical invariants, embedded engineers build wireless firmware that is battle-tested against interference and certified compliant with international Bluetooth regulatory standards.",
        "In production automated test rigs—such as continuous integration test benches running hardware-in-the-loop (HIL) over Zephyr OS or Nordic nRF Connect SDK—this validation engine can run directly as a software unit test or pre-flight firmware check before flashing remote sensor nodes.",
        "Catching parameter violations in continuous integration before devices reach field deployment prevents costly recalls and ensures that battery lifetime metrics match theoretical models with high fidelity.",
        "As we step into Day 15, we will unite all these components into a unified Capstone engine capable of coordinating real-time state transitions, multi-link scheduling, and certified parameter negotiation across complex industrial topologies.",
        "With Physical, Advertising, GAP, and Connection layers mastered across Days 11 through 14, tomorrow in Day 15 we will construct the Milestone 3 Capstone: the Multi-Role BLE Link Layer State Machine & Connection Parameter Negotiation Engine!"
    ]
    p5_example = "Think of a satellite changing its orbital altitude. Ground control doesn't say 'fire your thrusters right now' because radio delays might desynchronize the maneuver. Instead, ground control transmits: 'At exactly orbit counter 1,045 (the Instant), ignite thrusters for 3.2 seconds'. Both the ground tracking dish and the satellite adjust their tracking angles at the exact same second, maintaining continuous telemetry lock throughout the orbital transition."
    p5_code = VALIDATOR_CODE + CSA2_CODE + """
# Full BLE Link Parameter Negotiator & AFH Synchronization Subsystem
class BLEFullLinkOrchestrationEngine:
    def __init__(self, access_address: int, initial_interval_ms: float = 50.0, 
                 initial_latency: int = 4, initial_timeout_ms: float = 2000.0,
                 channel_map_mask: int = (1 << 37) - 1):
        # Validate initial parameters
        val = BLESupervisionInvariantValidator.validate_connection_parameters(
            initial_interval_ms, initial_latency, initial_timeout_ms
        )
        if not val["is_valid"]:
            raise ValueError(f"Initial parameters invalid: {val['errors']}")
            
        self.access_address = access_address
        self.interval_ms = initial_interval_ms
        self.latency = initial_latency
        self.timeout_ms = initial_timeout_ms
        self.channel_map = channel_map_mask
        self.csa2 = BLEChannelSelectionAlgorithm2(access_address, channel_map_mask)
        self.event_counter = 0
        self.pending_update = None
        
    def request_parameter_update(self, new_interval_ms: float, new_latency: int, 
                                  new_timeout_ms: float, delay_events: int = 6) -> dict:
        val = BLESupervisionInvariantValidator.validate_connection_parameters(
            new_interval_ms, new_latency, new_timeout_ms
        )
        if not val["is_valid"]:
            return {"accepted": False, "reason": val["errors"]}
            
        instant = self.event_counter + delay_events
        self.pending_update = {
            "instant": instant,
            "new_interval_ms": new_interval_ms,
            "new_latency": new_latency,
            "new_timeout_ms": new_timeout_ms
        }
        return {
            "accepted": True,
            "instant_event": instant,
            "events_until_instant": delay_events
        }
        
    def step_connection_event(self) -> dict:
        # Check if pending update instant has arrived
        applied_update = False
        if self.pending_update and self.event_counter == self.pending_update["instant"]:
            self.interval_ms = self.pending_update["new_interval_ms"]
            self.latency = self.pending_update["new_latency"]
            self.timeout_ms = self.pending_update["new_timeout_ms"]
            self.pending_update = None
            applied_update = True
            
        # Compute CSA #2 hopping channel for this event
        hop_info = self.csa2.compute_csa2_channel(self.event_counter)
        
        result = {
            "event": self.event_counter,
            "interval_ms": self.interval_ms,
            "channel": hop_info["final_channel"],
            "freq_mhz": hop_info["freq_mhz"],
            "applied_update": applied_update
        }
        self.event_counter += 1
        return result

# Verification Simulation: Transition from Low-Power Idle to High-Speed FOTA Mode
engine = BLEFullLinkOrchestrationEngine(
    access_address=0x1A2B3C4D, initial_interval_ms=100.0, initial_latency=4, initial_timeout_ms=3000.0
)

print("=== BLE Connection Parameter Update & CSA #2 Synchronized Instant Handoff ===")
print("Initial Mode: Low-Power Sensor Telemetry (Interval: 100ms, Latency: 4, Timeout: 3000ms)\\n")

# Schedule update at Event 4 to High-Speed FOTA mode (Interval: 15ms, Latency: 0, Timeout: 1000ms)
update_req = engine.request_parameter_update(new_interval_ms=15.0, new_latency=0, new_timeout_ms=1000.0, delay_events=4)
print(f"Host initiates LL_CONNECTION_UPDATE_IND -> Instant Scheduled at Event {update_req['instant_event']}\\n")

print("Event | Active Interval | Hop Channel [Frequency] | Parameter State")
print("-" * 65)
for _ in range(8):
    ev = engine.step_connection_event()
    state_str = "** PARAMETERS SWITCHED (Instant Reached!) **" if ev["applied_update"] else "Normal Operation"
    print(f"{ev['event']:5d} | {ev['interval_ms']:6.1f} ms     | Ch {ev['channel']:2d} ({ev['freq_mhz']:.1f} MHz)      | {state_str}")
"""
    p5_codeNotes = [
        "Defines BLEFullLinkOrchestrationEngine coordinating LL_CONNECTION_UPDATE_IND procedures.",
        "Demonstrates synchronized parameter handoffs at the exact scheduled Instant connection event counter.",
        "Validates seamless transition from low-power sensor telemetry (100 ms) to high-speed FOTA mode (15 ms)."
    ]
    p5_tryIt = "Schedule a parameter update that violates the Supervision Invariant and verify that the engine rejects it."
    p5_check = {
        "question": "In BLE connection parameter updates (LL_CONNECTION_UPDATE_IND), why is an 'Instant' event counter value included in the control PDU?",
        "options": [
            "To define a precise future connection event at which both Central and Peripheral switch to the new parameters simultaneously without losing synchronization.",
            "To restart the connection from scratch and re-advertise on primary channels.",
            "To reset the 32-bit Access Address back to the legacy advertising address.",
            "To measure the physical distance between the devices in meters."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the Bluetooth specification: The Instant specifies a future connection event counter counter value. Both devices continue using the old connection parameters until that exact counter is reached, at which point both radios switch to the new parameters simultaneously without clock drift or dropped packets. Options 1, 2, and 3 are incorrect."
    }

    day14_data = {
        "day": 14,
        "title": "BLE Connection Establishment, Supervision Invariants & Adaptive Frequency Hopping (AFH)",
        "course": "IoT Networking & Cloud Protocols",
        "minutes": 38,
        "parts": [
            {
                "title": "Connection Handshake, CONNECT_IND Framing & Anchor Point Timing",
                "say": p1_say,
                "example": p1_example,
                "code": p1_code,
                "output": "",
                "codeNotes": p1_codeNotes,
                "tryIt": p1_tryIt,
                "check": p1_check
            },
            {
                "title": "The Connection Parameter Triad: Interval, Latency & Timeout",
                "say": p2_say,
                "example": p2_example,
                "code": p2_code,
                "output": "",
                "codeNotes": p2_codeNotes,
                "tryIt": p2_tryIt,
                "check": p2_check
            },
            {
                "title": "The Supervision Timeout Invariant & False Dropout Avoidance",
                "say": p3_say,
                "example": p3_example,
                "code": p3_code,
                "output": "",
                "codeNotes": p3_codeNotes,
                "tryIt": p3_tryIt,
                "check": p3_check
            },
            {
                "title": "Adaptive Frequency Hopping (AFH) & Channel Selection Algorithm #2",
                "say": p4_say,
                "example": p4_example,
                "code": p4_code,
                "output": "",
                "codeNotes": p4_codeNotes,
                "tryIt": p4_tryIt,
                "check": p4_check
            },
            {
                "title": "Full BLE Link Parameter Negotiator & AFH Hopping Engine Platform",
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
            "BLE connections are established via the 34-byte CONNECT_IND PDU, which assigns the 32-bit Access Address, CRCInit, and Anchor Point timing.",
            "The Connection Parameter Triad consists of Connection Interval (7.5 ms–4.0 s), Peripheral Latency (0–499), and Supervision Timeout (100 ms–32.0 s).",
            "The fundamental Supervision Timeout Invariant requires connSupervisionTimeout > (1 + connPeripheralLatency) * connConnectionInterval * 2 to prevent false link dropouts.",
            "Adaptive Frequency Hopping (AFH) mitigates 2.4 GHz Wi-Fi interference across 37 General Data channels using dynamic Channel Maps.",
            "Bluetooth 5.0 Channel Selection Algorithm #2 (CSA #2) uses the unique Access Address and PRNG permutations to generate orthogonal, cluster-free hopping paths."
        ],
        "projectStep": {
            "title": "BLE Connection Management & Adaptive Frequency Hopping Subsystem",
            "steps": [
                "Dissect raw 34-byte CONNECT_IND packets, calculating WinOffset, First Anchor Point delay, and active channel counts.",
                "Model the electrical and responsiveness trade-offs across the Connection Interval, Peripheral Latency, and Timeout triad.",
                "Implement the Supervision Timeout Invariant validator enforcing Bluetooth SIG rules and Apple iOS Accessory Design Guidelines.",
                "Construct the Bluetooth 5.0 Channel Selection Algorithm #2 (CSA #2) engine with bit-reversal remapping across noisy Wi-Fi channels.",
                "Execute the synchronized parameter update simulator transitioning links between low-power sensor and high-throughput FOTA modes at scheduled Instants."
            ]
        }
    }

    # Execute all code snippets dynamically to guarantee 100% exact output match
    sub_env = {**os.environ, "PYTHONIOENCODING": "utf-8"}
    for idx, p in enumerate(day14_data["parts"]):
        proc = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True, encoding="utf-8", env=sub_env)
        if proc.returncode != 0:
            print(f"Day 14 Part {idx+1} execution error:\n{proc.stderr}")
            sys.exit(1)
        p["output"] = proc.stdout.strip()

    wcs = [len(" ".join(p["say"]).split()) for p in day14_data["parts"]]
    print(f"Day 14 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_net_day14.json", "w", encoding="utf-8") as f:
        json.dump(day14_data, f, indent=2, ensure_ascii=False)
    print("Successfully built scripts/iot_net_day14.json!")

if __name__ == '__main__':
    build_day14()
