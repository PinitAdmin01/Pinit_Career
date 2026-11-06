# scripts/build_iot_net_day7.py
"""
Builds Day 7 for Course 18: IoT Networking & Cloud Protocols (iot_net).
Day 7: IEEE 802.15.4 MAC Frame Formats, Superframes & Guaranteed Time Slots (GTS)
Pedagogical Invariants:
- Exactly 5 parts, each strictly >= 580 words (target >= 620 words).
- minutes: 38.
- 100% deterministic Python standard library execution, verified output capture.
- 4 multiple choice options with answer: 0 and deep why.
- Strict mathematical & architectural depth: MAC framing, FCF bitfields, FFD/RFD roles, superframe BO/SO duty cycles, GTS allocation, CRC-16 CCITT.
"""

import json
import subprocess
import sys

def build_day7():
    # =========================================================================
    # Part 1: IEEE 802.15.4 General MAC Frame Anatomy & Frame Control Field (FCF)
    # =========================================================================
    p1_say = [
        "Welcome to Day 7 of IoT Networking & Cloud Protocols. Today we transition from the physical RF layer of O-QPSK modulation and DSSS spreading up to the link layer: IEEE 802.15.4 Medium Access Control (MAC) Framing.",
        "In constrained low-power wireless networking, every single over-the-air bit consumes precious battery energy. Unlike Ethernet (which prefixes 14 bytes of MAC header and appends 4 bytes of FCS) or Wi-Fi (whose MAC header spans 24 to 30 bytes), the IEEE 802.15.4 MAC frame was engineered to maximize payload throughput while minimizing header bloat within the rigid 127-byte physical layer MTU.",
        "The general IEEE 802.15.4 MAC frame—termed the MAC Protocol Data Unit (MPDU)—is organized into three fundamental logical structures: the MAC Header (MHR), the MAC Service Data Unit (MSDU, or payload), and the MAC Footer (MFR).",
        "The MAC Header begins with the critical 2-octet (16-bit) Frame Control Field (FCF). The FCF dictates how the entire remainder of the frame must be parsed by the receiver's hardware state machine. The FCF bitfield layout is defined as follows: Bits 0–2 specify the Frame Type (000 = Beacon, 001 = Data, 010 = Acknowledgment, 011 = MAC Command, with values 100–111 reserved); Bit 3 is the Security Enabled bit (1 indicates the presence of an Auxiliary Security Header for AES-CCM* encryption/authentication); Bit 4 is the Frame Pending bit (used by coordinators to signal that indirect data is buffered for a sleeping child node); Bit 5 is the AR (Acknowledgment Request) bit, commanding the recipient to return an immediate MAC ACK; and Bit 6 is the PAN ID Compression bit.",
        "The PAN ID Compression bit (Bit 6) is a brilliant optimization for conserving bandwidth: when both the source and destination devices belong to the exact same Personal Area Network (PAN), setting this bit to 1 instructs the parser to omit the Source PAN ID field entirely, saving 2 full octets of header overhead.",
        "Bits 10–11 and Bits 14–15 of the FCF define the Destination Addressing Mode and Source Addressing Mode, respectively. Each addressing mode field can take four values: 00 indicates Address Not Present (used in ACKs or broadcast beacons); 01 is Reserved; 10 specifies 16-bit Short Network Addressing; and 11 specifies 64-bit Extended IEEE EUI-64 Addressing. This flexible scheme allows the MHR length to dynamically vary between a minimal 3 bytes (in an ACK frame) and up to 23 bytes (in a frame with dual 64-bit addresses, dual PAN IDs, and security).",
        "Following the FCF is the 1-octet Sequence Number (SN). The Sequence Number increments monotonically with each transmitted frame, allowing receivers to identify and discard duplicate packets caused by retransmissions and matching outbound ACKs to their originating data frames.",
        "Next come the Addressing Fields, which dynamically include the Destination PAN ID (16 bits), Destination Address (16 or 64 bits), Source PAN ID (16 bits, if uncompressed), and Source Address (16 or 64 bits). If security is enabled (FCF bit 3 = 1), the Auxiliary Security Header follows, containing the Security Control byte, a 4-byte Frame Counter (for anti-replay protection), and an optional Key Identifier.",
        "Finally, the frame terminates with the MAC Footer (MFR), consisting of a 2-octet Frame Check Sequence (FCS). The FCS utilizes the standard ITU-T CRC-16 CCITT polynomial: G(x) = x^16 + x^12 + x^5 + 1 (represented in hexadecimal as 0x1021). The transmitter calculates this CRC over all octets of the MHR and MSDU; the receiver recomputes the checksum and drops corrupted frames immediately, preventing bad data from entering the higher-layer network stack.",
        "Mastering this binary bitfield anatomy is foundational for every embedded firmware engineer, enabling bit-perfect packet crafting, protocol analysis with Wireshark sniffer hardware, and custom mesh stack implementation."
    ]
    p1_example = "Think of the Frame Control Field (FCF) as the shipping label on an international courier envelope. The checkbox 'Security' indicates whether the contents are inside a tamper-proof pouch. The checkbox 'PAN Compression' indicates that sender and recipient share the same office building, so you don't need to write the corporate branch address twice. The delivery truck reads these checkboxes before even opening the cargo."
    p1_code = """# IEEE 802.15.4 Frame Control Field (FCF) & CRC-16 CCITT Parser
import struct

class IEEE802154FCF:
    FRAME_TYPES = {0: "Beacon", 1: "Data", 2: "Acknowledgment", 3: "MAC Command"}
    ADDR_MODES = {0: "None", 1: "Reserved", 2: "Short-16", 3: "Extended-64"}
    
    def __init__(self, fcf_val: int):
        self.raw_fcf = fcf_val
        self.frame_type = fcf_val & 0x07
        self.security_enabled = bool((fcf_val >> 3) & 0x01)
        self.frame_pending = bool((fcf_val >> 4) & 0x01)
        self.ack_request = bool((fcf_val >> 5) & 0x01)
        self.pan_id_compression = bool((fcf_val >> 6) & 0x01)
        self.dest_addr_mode = (fcf_val >> 10) & 0x03
        self.frame_version = (fcf_val >> 12) & 0x03
        self.src_addr_mode = (fcf_val >> 14) & 0x03
        
    def to_dict(self):
        return {
            "raw_hex": f"0x{self.raw_fcf:04X}",
            "type": self.FRAME_TYPES.get(self.frame_type, "Reserved"),
            "security": self.security_enabled,
            "pending": self.frame_pending,
            "ack_req": self.ack_request,
            "pan_comp": self.pan_id_compression,
            "dest_mode": self.ADDR_MODES.get(self.dest_addr_mode),
            "src_mode": self.ADDR_MODES.get(self.src_addr_mode)
        }

def compute_crc16_ccitt(data: bytes) -> int:
    crc = 0x0000
    for byte in data:
        crc ^= (byte << 8)
        for _ in range(8):
            if crc & 0x8000:
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF
            else:
                crc = (crc << 1) & 0xFFFF
    return crc

# Example FCF: Data Frame, Security=0, ACK_Req=1, PAN_Comp=1, Dest=16-bit, Src=16-bit
# Bits: 001 (Type=1 Data), 0, 0, 1 (AR), 1 (PAN_Comp), 00, 0, 10 (Dest=2), 00, 10 (Src=2)
# Value = 0x8861
fcf = IEEE802154FCF(0x8861)
sample_packet = bytes([0x61, 0x88, 0x42, 0xCD, 0xAB, 0x02, 0x00, 0x01, 0x00]) + b"TEMP=24.5C"
fcs = compute_crc16_ccitt(sample_packet)

print("=== IEEE 802.15.4 FCF Bitfield Deconstruction ===")
for k, v in fcf.to_dict().items():
    print(f"  {k:12s}: {v}")
print(f"\\nSample Packet Length: {len(sample_packet)} bytes")
print(f"Computed FCS (CRC-16 CCITT): 0x{fcs:04X} ({fcs})")
"""
    p1_codeNotes = [
        "Implements IEEE802154FCF decoding 16-bit Frame Control Fields into human-readable flags.",
        "Extracts frame types, security enablement, ACK requests, and source/dest addressing modes.",
        "Implements exact CRC-16 CCITT polynomial 0x1021 computing the 2-octet MAC Footer (FCS)."
    ]
    p1_tryIt = "Modify the raw FCF to 0x8841 (clearing the ACK Request bit) and observe how ack_req updates to False."
    p1_check = {
        "question": "What is the purpose of the PAN ID Compression bit (Bit 6) in the IEEE 802.15.4 Frame Control Field?",
        "options": [
            "It eliminates the 2-octet Source PAN ID field when both source and destination belong to the same PAN, conserving bandwidth.",
            "It compresses the entire packet payload using GZIP compression.",
            "It converts 64-bit Extended addresses into 16-bit Short addresses.",
            "It reduces the radio transmit frequency by half to double communication range."
        ],
        "answer": 0,
        "why": "Option 0 is correct: When communicating intra-PAN (where the source and destination share the same PAN ID), setting the PAN ID Compression bit to 1 instructs the recipient to use the Destination PAN ID as the Source PAN ID, omitting 2 bytes from the MAC header. Option 1 is false (it does not compress the payload). Option 2 confuses address mode selection with header compression. Option 3 is physically impossible."
    }

    # =========================================================================
    # Part 2: Operating Topologies & Device Roles: FFD vs RFD & PAN Coordinators
    # =========================================================================
    p2_say = [
        "Having mastered the binary frame layout, we examine how 802.15.4 organizes physical devices into cooperative networks: Device Roles and Network Topologies.",
        "The IEEE 802.15.4 standard defines two distinct classes of physical hardware devices based on computational and energy capacity: Full Function Devices (FFD) and Reduced Function Devices (RFD).",
        "A Full Function Device (FFD) is an embedded node equipped with full MAC layer functionality. An FFD can operate in three distinct operational roles: as the Personal Area Network (PAN) Coordinator (the master device that establishes and governs the network), as a simple Coordinator (a router or relay node that forwards packets and coordinates child devices), or as a standard network Device. Crucially, an FFD can communicate with any other FFD or RFD within radio range, and it can act as a routing relay. In mains-powered industrial installations, smart energy gateways, line-powered smart switches, and building controllers are implemented as FFDs.",
        "In contrast, a Reduced Function Device (RFD) is an ultra-constrained, lightweight leaf node. An RFD implements only a minimal subset of the 802.15.4 MAC specification: it can never become a PAN Coordinator, it can never become a router, and it can only communicate with a single designated FFD (its parent coordinator). An RFD can never communicate directly with another RFD. Because of these simplifications, the software ROM and RAM footprint of an RFD MAC stack is microscopic (often under 4 KB of RAM), and the device can spend 99.9% of its operational life in ultra-low-power sleep modes (< 1 microampere current draw). Coin-cell temperature sensors, door window magnetic contacts, and asset tracking tags are built as RFDs.",
        "Using these two device classes, 802.15.4 networks can be configured into two fundamental topologies: Star Topology and Peer-to-Peer (Mesh / Cluster-Tree) Topology.",
        "In a Star Topology, communication is strictly centralized. A single dedicated FFD is elected as the PAN Coordinator. All other devices (whether FFDs or RFDs) establish direct point-to-point wireless links with the central coordinator. When an RFD sensor wants to transmit telemetry to another node, it must send the frame to the PAN Coordinator, which then forwards the packet to the destination. Star networks are exceptionally simple and deterministic, making them ideal for small residential homes or single industrial machinery monitoring.",
        "In a Peer-to-Peer Topology, multiple FFDs can communicate directly with any other FFD within radio range. While one unique FFD still serves as the Root PAN Coordinator (defining the PAN ID and master security credentials), intermediate FFDs act as mesh routers, enabling multi-hop packet forwarding across expansive physical territories (such as multi-story office buildings, agricultural vineyards, or sprawling petroleum refineries). RFDs attach to the perimeter of the mesh as leaf children.",
        "A special hierarchical variant of peer-to-peer is the Cluster-Tree Network, where individual FFDs act as Cluster Heads, synchronizing their own localized clusters of nodes and relaying cluster traffic along tree branches to the root coordinator.",
        "In practical firmware architectures, the operational state machines of FFDs and RFDs differ dramatically. An FFD transceiver must typically remain in continuous Receive (RX) mode unless an explicit superframe duty cycle is negotiated, because the coordinator or router never knows when an asynchronous child device will transmit a telemetry burst. Maintaining an active receiver consumes significant baseline current (typically 12 mA to 20 mA at 3.0V), which depletes a standard coin cell in a matter of days. Consequently, FFDs are predominantly deployed as line-powered mains devices or connected to rechargeable energy harvesting sub-circuits.",
        "Conversely, an RFD firmware stack exploits the fact that it never routes traffic. It awakens its crystal oscillator, performs a brief clear channel assessment or waits for a beacon, fires its telemetry packet, listens for an immediate 16-symbol MAC acknowledgment, and instantly shuts down all internal clocks to re-enter deep sleep. By confining radio active duration to under 5 milliseconds per transmission cycle, an RFD achieves an average current consumption below 5 to 10 microamperes, validating why modern smart home and industrial building ecosystems strictly separate routing infrastructure from edge sensing.",
        "Understanding the demarcation between FFD and RFD roles is essential for system sizing, memory budgeting, and battery lifespan projection across commercial IoT deployments."
    ]
    p2_example = "Think of a school classroom. The teacher is a Full Function Device (FFD) and the PAN Coordinator. The students are Reduced Function Devices (RFDs). If student Alice wants to pass a note to student Bob in a star topology, Alice must raise her hand and give the note to the teacher, who hands it to Bob. The students don't need complex administrative credentials; they just need to talk to the teacher."
    p2_code = """# 802.15.4 Device Capability & Topology Validation Engine
class DeviceRoleEngine:
    ROLES = {"PAN_COORDINATOR": 0, "ROUTER_FFD": 1, "END_DEVICE_FFD": 2, "LEAF_RFD": 3}
    
    def __init__(self, device_id: str, is_ffd: bool, role: str):
        self.device_id = device_id
        self.is_ffd = is_ffd
        if not is_ffd and role in ("PAN_COORDINATOR", "ROUTER_FFD"):
            raise ValueError(f"Reduced Function Device (RFD) cannot assume role {role}!")
        self.role = role
        self.associated_children = []
        self.parent = None
        
    def can_route_traffic(self) -> bool:
        return self.is_ffd and self.role in ("PAN_COORDINATOR", "ROUTER_FFD")
        
    def associate_child(self, child_device: 'DeviceRoleEngine'):
        if not self.can_route_traffic():
            raise PermissionError(f"Device {self.device_id} ({self.role}) cannot accept child associations!")
        self.associated_children.append(child_device.device_id)
        child_device.parent = self.device_id

# Simulate Topology Creation
pan_coord = DeviceRoleEngine("COORD_001", is_ffd=True, role="PAN_COORDINATOR")
router_ffd = DeviceRoleEngine("ROUTER_002", is_ffd=True, role="ROUTER_FFD")
temp_sensor_rfd = DeviceRoleEngine("TEMP_SENS_003", is_ffd=False, role="LEAF_RFD")
motion_sensor_rfd = DeviceRoleEngine("MOT_SENS_004", is_ffd=False, role="LEAF_RFD")

# Form Cluster-Tree Links
pan_coord.associate_child(router_ffd)
router_ffd.associate_child(temp_sensor_rfd)
pan_coord.associate_child(motion_sensor_rfd)

print("=== IEEE 802.15.4 Network Role & Association Topology ===")
for node in [pan_coord, router_ffd, temp_sensor_rfd, motion_sensor_rfd]:
    print(f"Node [{node.device_id}]: FFD={str(node.is_ffd):5s} | Role={node.role:15s} | Parent={str(node.parent):10s} | Children={node.associated_children}")
"""
    p2_codeNotes = [
        "Defines DeviceRoleEngine modeling FFD and RFD architectural capabilities.",
        "Enforces strict standard rule: RFDs cannot serve as coordinators or routers.",
        "Simulates cluster-tree hierarchy with parent-child association constraints."
    ]
    p2_tryIt = "Attempt to instantiate an RFD with role='PAN_COORDINATOR' and verify that the ValueError exception is correctly thrown."
    p2_check = {
        "question": "Which of the following statements accurately characterizes a Reduced Function Device (RFD) in an IEEE 802.15.4 network?",
        "options": [
            "An RFD implements minimal MAC functionality, can never act as a coordinator or router, and communicates exclusively with a single parent FFD.",
            "An RFD acts as the master PAN Coordinator responsible for assigning 16-bit short addresses.",
            "An RFD must keep its receiver continuously powered to route multi-hop packets.",
            "An RFD communicates directly with other RFDs across peer-to-peer ad-hoc links."
        ],
        "answer": 0,
        "why": "Option 0 accurately summarizes the IEEE 802.15.4 standard: RFDs are designed for extreme resource constraints and low battery power. They can only communicate with a single FFD parent and never route traffic or act as coordinators. Option 1 describes the PAN Coordinator (which must be an FFD). Option 2 describes router FFDs. Option 3 is prohibited by the standard."
    }

    # =========================================================================
    # Part 3: Superframe Architecture: Beacon Order (BO), Superframe Order (SO) & Duty Cycle
    # =========================================================================
    p3_say = [
        "Now we explore one of the most mathematically elegant power-conservation mechanisms defined in wireless communications: the IEEE 802.15.4 Superframe Structure.",
        "IEEE 802.15.4 networks can operate in two distinct synchronization modes: Non-Beacon-Enabled Networks and Beacon-Enabled Networks.",
        "In Non-Beacon-Enabled Networks, there is no master clock or shared schedule. Nodes sleep asynchronously and wake up whenever they have data to send, using unslotted CSMA/CA to contend for the channel. To receive downlink data, end devices must periodically transmit Data Request polling packets to their parent coordinator. Non-beacon mode is simple, robust against clock drift, and widely used in Zigbee Pro and Thread.",
        "In contrast, Beacon-Enabled Networks provide synchronized, scheduled communications governed by periodic Beacon Frames broadcast by the PAN Coordinator. The time between consecutive beacons is structured into a Superframe.",
        "The geometry of the superframe is strictly controlled by two parameters transmitted inside the beacon's Superframe Specification field: the Beacon Order (BO) and the Superframe Order (SO), where 0 <= SO <= BO <= 14.",
        "The standard defines a fundamental timing constant: aBaseSuperframeDuration = aBaseSlotDuration * aNumSuperframeSlots = (3 * 20 symbols) * 16 = 60 symbols * 16 slots = 960 symbols. At 62.5 ksymbols/s, 960 symbols equals exactly 15.36 milliseconds (15,360 microseconds).",
        "The Beacon Interval (BI)—the exact duration between consecutive beacon transmissions—is calculated as: BI = aBaseSuperframeDuration * 2^BO = 15.36 ms * 2^BO. When BO = 0, BI = 15.36 ms. When BO = 10, BI = 15.36 ms * 1024 ≈ 15.73 seconds. If BO = 15, the network disables beacons and reverts to non-beacon mode.",
        "The Active Superframe Duration (SD)—the period during which the coordinator keeps its receiver energized and devices can transmit—is calculated as: SD = aBaseSuperframeDuration * 2^SO = 15.36 ms * 2^SO.",
        "The mathematical Duty Cycle of the network is therefore: Duty Cycle = SD / BI = (aBaseSuperframeDuration * 2^SO) / (aBaseSuperframeDuration * 2^BO) = 2^(SO - BO).",
        "For example, if the PAN Coordinator configures BO = 8 (BI = 15.36 ms * 256 = 3.932 seconds) and SO = 4 (SD = 15.36 ms * 16 = 0.2458 seconds), the duty cycle is 2^(4 - 8) = 2^(-4) = 1/16 = 6.25%. During the active 245.8 milliseconds, nodes exchange packets. During the remaining 3.686 seconds (the Inactive Period), the coordinator and all child devices completely turn off their radio transceivers, drawing under 1 microampere of sleep current.",
        "If SO = BO, the duty cycle is 100% (no inactive period). Conversely, setting BO = 10 and SO = 2 yields a duty cycle of 2^(-8) = 1/256 ≈ 0.39%, allowing battery-operated nodes to achieve operational lifespans exceeding 7 to 10 years on a single coin cell.",
        "When evaluating the synchronization mechanics of beacon-enabled superframes, engineers must address the critical challenge of Clock Drift and Clock Jitter. Real-world 32.768 kHz tuning-fork crystals embedded on microcontroller boards exhibit thermal drift specifications of typically +/- 20 parts per million (ppm) to +/- 40 ppm. If a network operates with a long Beacon Interval (such as BO = 10, where BI is approximately 15.73 seconds), a 40 ppm clock drift across two communicating nodes can accumulate up to 1.25 milliseconds of temporal displacement between consecutive beacons.",
        "To prevent child nodes from missing the coordinator's beacon due to this cumulative drift, the IEEE 802.15.4 specification incorporates a Guard Time or Receiver Wakeup Margin. Child devices must wake up slightly earlier than the nominal beacon boundary (typically 2 to 5 milliseconds early) to open their reception windows. If the Beacon Order is set excessively high (such as BO = 14, where BI spans roughly 4.19 minutes), the accumulated crystal drift forces the receiver to remain active for unacceptably long guard intervals, offsetting the theoretical duty-cycle power savings. This fundamental physical trade-off between crystal tolerance and synchronization overhead dictates that commercial beacon-enabled deployments typically constrain BO between 4 and 8.",
        "Understanding this exponential relationship between BO, SO, and duty cycle enables IoT engineers to configure networks that strike the optimal compromise between messaging latency and multi-year battery preservation."
    ]
    p3_example = "Think of a lighthouse beam rotating in the dark. The lighthouse flashes a brilliant beam once every 60 seconds (Beacon Interval, BI). The beam stays pointed at your harbor for only 3 seconds (Superframe Duration, SD). During those 3 seconds, all harbor boats rapidly signal their status. For the remaining 57 seconds, the boats turn off their lanterns to save oil (battery sleep)."
    p3_code = """# IEEE 802.15.4 Superframe Timing & Battery Lifespan Calculator
class SuperframeTimingEngine:
    # aBaseSuperframeDuration = 960 symbols * 16 us/symbol = 15,360 us = 15.36 ms
    A_BASE_SUPERFRAME_DURATION_MS = 15.36
    
    @classmethod
    def calculate_superframe_parameters(cls, bo: int, so: int) -> dict:
        if not (0 <= so <= bo <= 14):
            raise ValueError(f"Invalid superframe parameters: require 0 <= SO ({so}) <= BO ({bo}) <= 14.")
            
        bi_ms = cls.A_BASE_SUPERFRAME_DURATION_MS * (2 ** bo)
        sd_ms = cls.A_BASE_SUPERFRAME_DURATION_MS * (2 ** so)
        inactive_ms = bi_ms - sd_ms
        duty_cycle_pct = (sd_ms / bi_ms) * 100.0
        
        # Estimate battery lifespan on CR2032 (220 mAh = 220,000 uAh)
        # Active current (RX/TX): 18.0 mA = 18,000 uA
        # Sleep current: 0.002 mA = 2.0 uA
        avg_current_ua = (duty_cycle_pct / 100.0) * 18000.0 + (1.0 - duty_cycle_pct / 100.0) * 2.0
        battery_capacity_uah = 220.0 * 1000.0
        battery_hours = battery_capacity_uah / avg_current_ua
        battery_years = battery_hours / (24.0 * 365.25)
        
        return {
            "bo": bo,
            "so": so,
            "bi_sec": bi_ms / 1000.0,
            "sd_sec": sd_ms / 1000.0,
            "inactive_sec": inactive_ms / 1000.0,
            "duty_cycle_pct": duty_cycle_pct,
            "avg_current_ua": avg_current_ua,
            "battery_years": battery_years
        }

engine = SuperframeTimingEngine()
print("=== IEEE 802.15.4 Superframe Timing & Battery Endurance ===")
configs = [(4, 4), (6, 3), (8, 4), (10, 2)]
for bo, so in configs:
    res = engine.calculate_superframe_parameters(bo, so)
    print(f"BO={bo:02d}, SO={so:02d} | BI={res['bi_sec']:6.2f}s | SD={res['sd_sec']:6.3f}s | "
          f"DutyCycle={res['duty_cycle_pct']:6.2f}% | Current={res['avg_current_ua']:7.1f} uA | "
          f"Battery Life: {res['battery_years']:4.1f} Years")
"""
    p3_codeNotes = [
        "Implements SuperframeTimingEngine calculating exact Beacon Intervals (BI) and Superframe Durations (SD).",
        "Calculates duty cycles governed strictly by 2^(SO - BO).",
        "Models CR2032 coin cell battery endurance across varying BO and SO trade-offs."
    ]
    p3_tryIt = "Evaluate a superframe with BO=10 and SO=0 to observe how the duty cycle drops to under 0.1% with over 10 years of simulated battery life."
    p3_check = {
        "question": "In an IEEE 802.15.4 beacon-enabled network with Beacon Order BO = 8 and Superframe Order SO = 5, what is the exact duty cycle of the active superframe?",
        "options": [
            "12.5%, calculated as 2^(SO - BO) = 2^(5 - 8) = 2^(-3) = 1/8.",
            "62.5%, calculated as SO / BO = 5 / 8.",
            "3.125%, calculated as 2^(5 - 10) = 2^(-5) = 1/32.",
            "100%, because superframes always maintain full continuous reception."
        ],
        "answer": 0,
        "why": "Option 0 is mathematically correct: the active duration is SD = aBaseSuperframeDuration * 2^SO and the beacon interval is BI = aBaseSuperframeDuration * 2^BO. The duty cycle is SD / BI = 2^(SO - BO) = 2^(5 - 8) = 2^(-3) = 1/8 = 12.5%. Option 1 incorrectly computes a linear fraction. Options 2 and 3 miscalculate the exponents."
    }

    # =========================================================================
    # Part 4: Contention Access Period (CAP) vs Contention-Free Period (CFP) & GTS
    # =========================================================================
    p4_say = [
        "Inside the active portion of the superframe (Superframe Duration, SD), the channel is further subdivided into two fundamentally distinct communication phases: the Contention Access Period (CAP) and the Contention-Free Period (CFP).",
        "Every active superframe is partitioned into exactly 16 equally spaced time slots (numbered Slot 0 through Slot 15). Slot 0 is always reserved for the PAN Coordinator to transmit its Beacon Frame, which marks the start of the superframe and delivers network synchronization parameters.",
        "Immediately following the beacon is the Contention Access Period (CAP). During the CAP, any associated device that has data to transmit competes for the wireless medium using the Slotted CSMA/CA protocol. Devices perform random backoffs aligned to superframe slot boundaries, conduct Clear Channel Assessments (CCA), and transmit if the channel is idle. Because the CAP is contention-based, packet collisions can occur if multiple nodes choose identical backoff slots, resulting in stochastic packet latencies. Most regular sensor telemetry, network commands, and association requests are exchanged during the CAP.",
        "However, industrial automation and medical monitoring applications cannot tolerate non-deterministic collision delays. Consider a wireless patient heart monitor transmitting an emergency electrocardiogram (ECG) telemetry spike, or an automated robotic assembly line monitoring an emergency stop trip-wire. If a collision forces exponential backoff during an emergency, catastrophic failure ensues.",
        "To guarantee zero collisions and deterministic, sub-millisecond latency for critical traffic, IEEE 802.15.4 introduces the Contention-Free Period (CFP) through Guaranteed Time Slots (GTS).",
        "The CFP appears at the trailing end of the active superframe, immediately following the CAP and extending up to the end of Slot 15. Within the CFP, the PAN Coordinator can allocate up to a maximum of 7 Guaranteed Time Slots (GTS).",
        "A single GTS can span one or more contiguous superframe time slots, but the combined total of all active GTS allocations can never exceed 7 slots, ensuring that the remaining CAP never shrinks below aMinCAPLength (440 symbols = 7.04 ms).",
        "GTS allocation is strictly managed by the PAN Coordinator. When an end device requires deterministic channel access, it sends a GTS Request MAC Command during the CAP. The request specifies the desired direction (Transmit GTS, where the device transmits to the coordinator, or Receive GTS, where the coordinator transmits to the device) and the required slot length.",
        "The coordinator evaluates its schedule. If sufficient slots remain in the CFP, the coordinator grants the GTS and broadcasts the allocation in the GTS Descriptor field of its subsequent beacon frames. The GTS descriptor lists the requesting node's 16-bit short address, starting slot number, and slot length.",
        "During its designated GTS, the authorized device has exclusive, uncontested access to the wireless channel. It transmits immediately without executing CSMA/CA backoffs, without performing Clear Channel Assessment, and with zero risk of packet collision. This guarantees hard real-time latency and maximum energy efficiency, as the radio transmitter powers up exclusively for its allocated microsecond slot.",
        "Beyond industrial emergency stops and patient medical telemetry, Guaranteed Time Slots (GTS) play a vital role in audio streaming and precision vibration analysis for predictive maintenance. In industrial predictive maintenance, tri-axial accelerometer sensors sample high-frequency motor vibrations at several kilohertz to detect bearing degradation and shaft misalignment. Transmitting raw vibration data over contention-based CSMA/CA causes severe packet inter-arrival jitter, corrupting Fast Fourier Transform (FFT) frequency spectrum calculations on the gateway.",
        "By binding high-rate vibration bursts to dedicated GTS slots in the CFP, the sensor transmits its acoustic telemetry in contiguous, predictable chunks. Furthermore, the GTS state machine incorporates automatic deallocation rules: if a node fails to utilize its allocated GTS for a configurable number of consecutive superframes (governed by the GTS deallocation persistence counter), the coordinator automatically revokes the allocation and returns the time slots to the shared Contention Access Period (CAP). This prevents dormant or failed nodes from monopolizing channel capacity and ensures dynamic capacity elasticity."
    ]
    p4_example = "Think of an airport runway. The Contention Access Period (CAP) is like general aviation runway taxiing: private propeller planes look around, wait their turn, and merge when the lane is open. Guaranteed Time Slots (GTS) in the Contention-Free Period (CFP) are like an emergency medevac air ambulance flight: all other planes are locked on the taxiway, and the ambulance touches down with a guaranteed, exclusive landing window."
    p4_code = """# IEEE 802.15.4 Superframe Slot & GTS Allocation Engine
class SuperframeSlotCoordinator:
    TOTAL_SLOTS = 16
    MAX_GTS_COUNT = 7
    MIN_CAP_SLOTS = 4   # Preserves minimum Contention Access Period
    
    def __init__(self, pan_id: int):
        self.pan_id = pan_id
        self.gts_allocations = {}   # node_id -> {"start_slot": int, "length": int, "dir": str}
        
    def request_gts(self, node_id: str, length_slots: int, direction: str) -> bool:
        if len(self.gts_allocations) >= self.MAX_GTS_COUNT:
            print(f"GTS Request REJECTED for {node_id}: Maximum 7 GTS allocations reached.")
            return False
            
        current_gts_slots = sum(g["length"] for g in self.gts_allocations.values())
        if (current_gts_slots + length_slots) > (self.TOTAL_SLOTS - self.MIN_CAP_SLOTS):
            print(f"GTS Request REJECTED for {node_id}: Would violate minimum CAP length.")
            return False
            
        # Allocate slots backwards from Slot 15 (CFP extends from end of superframe)
        new_start_slot = self.TOTAL_SLOTS - current_gts_slots - length_slots
        self.gts_allocations[node_id] = {
            "start_slot": new_start_slot,
            "length": length_slots,
            "dir": direction
        }
        return True
        
    def get_superframe_map(self) -> list[str]:
        slots = ["CAP"] * self.TOTAL_SLOTS
        slots[0] = "BEACON"
        for node_id, alloc in self.gts_allocations.items():
            for s in range(alloc["start_slot"], alloc["start_slot"] + alloc["length"]):
                slots[s] = f"GTS_{node_id[:4]}"
        return slots

coord = SuperframeSlotCoordinator(pan_id=0xCAFE)
# Allocate GTS for Critical Medical ECG Node and Industrial Vibration Node
coord.request_gts("ECG_PATIENT_01", length_slots=2, direction="TX")
coord.request_gts("VIB_TURBINE_02", length_slots=3, direction="TX")

# Attempt excessive GTS allocation that would violate minimum CAP
coord.request_gts("EXCESS_NODE_03", length_slots=8, direction="TX")

slots = coord.get_superframe_map()
print("=== IEEE 802.15.4 Superframe Slot Allocation Map (16 Slots) ===")
for idx, s in enumerate(slots):
    print(f"Slot {idx:02d}: {s}")
"""
    p4_codeNotes = [
        "Models the 16-slot IEEE 802.15.4 superframe partition.",
        "Enforces standard constraints: maximum 7 GTS allocations and mandatory minimum CAP length.",
        "Allocates Contention-Free Period (CFP) slots backwards from Slot 15 towards the CAP boundary."
    ]
    p4_tryIt = "Allocate a third GTS with length_slots=2 and observe how the slots map updates to fill the CFP."
    p4_check = {
        "question": "What is the primary operational advantage of a Guaranteed Time Slot (GTS) in an IEEE 802.15.4 beacon-enabled network?",
        "options": [
            "It grants dedicated, collision-free channel access with zero CSMA/CA backoff delay for hard real-time latency.",
            "It increases the radio transmit power by 20 dBm to penetrate thick steel walls.",
            "It allows the device to communicate without knowing the network PAN ID.",
            "It enables unencrypted broadcast to all devices simultaneously."
        ],
        "answer": 0,
        "why": "Option 0 correctly describes the fundamental design goal of GTS: by pre-allocating dedicated time slots in the Contention-Free Period (CFP), the authorized node transmits without CSMA/CA channel contention or backoff, guaranteeing deterministic, zero-collision delivery. Options 1, 2, and 3 are technically invalid."
    }

    # =========================================================================
    # Part 5: Full IEEE 802.15.4 MAC Frame Serializer & Parser Engine
    # =========================================================================
    p5_say = [
        "To conclude Day 7, we synthesize all MAC layer framing specifications into an end-to-end, production-grade binary serializer and deserializer: the IEEE 802.15.4 MAC Frame Engine.",
        "In commercial embedded protocol stacks (such as Zephyr OS, TI-OpenThread, or Contiki-NG), the MAC frame serializer sits at the boundary between the physical radio driver and the higher-level network layers (such as 6LoWPAN or Zigbee Network Layer).",
        "When an upper-layer application generates a telemetry payload (for instance, a CoAP sensor reading or an alarm event), the MAC layer is tasked with packing this payload into a compliant MPDU binary buffer.",
        "The serialization engine begins by formatting the 2-octet Frame Control Field (FCF). It evaluates whether the source and destination addresses belong to the same PAN ID; if identical, it automatically asserts the PAN ID Compression bit, omitting the 2-octet Source PAN ID field to save valuable over-the-air bytes.",
        "Next, the engine serializes the 1-octet Sequence Number, followed by the Destination PAN ID (always little-endian in 802.15.4), the Destination Address (supporting both 16-bit short integers and 64-bit IEEE extended addresses), and the Source Address.",
        "If the Auxiliary Security Header is active, the engine appends the security control octet and the 4-byte cryptographic frame counter before appending the variable-length MAC Service Data Unit (MSDU) payload.",
        "Finally, the serializer calculates the 2-octet Frame Check Sequence (FCS) using the ITU-T CRC-16 CCITT polynomial across every serialized byte of the MHR and MSDU, appending the checksum in little-endian byte order to seal the frame.",
        "The deserializer reverses this process with rigorous validation: it checks frame length, unpacks the FCF, verifies addressing modes, validates that the payload fits within the 127-byte physical MTU, and recalculates the CRC-16 FCS. If the recomputed FCS does not match the frame's trailing bytes, the deserializer drops the frame with a CHECKSUM_FAILURE error, preventing corrupt data from compromising application state.",
        "To ensure absolute compatibility across heterogeneous embedded hardware architectures (such as ARM Cortex-M, RISC-V, and Tensilica architectures), the IEEE 802.15.4 binary serialization engine enforces strict little-endian byte ordering for all multi-octet integer fields. Both 16-bit short addresses, 16-bit PAN IDs, and 64-bit extended IEEE EUI-64 identifiers must be serialized with their least significant octet placed at the lowest memory address.",
        "Furthermore, modern high-reliability firmware engines implement zero-copy parsing techniques. Rather than copying incoming over-the-air packet octets into intermediary memory buffers, the deserializer slices memory views directly over the hardware DMA receive ring buffer. The parser calculates field offsets dynamically based on the FCF bitfields, verifying addressing mode presence and security control headers in place without allocating dynamic heap memory. In safety-critical embedded systems, avoiding dynamic memory allocation (malloc/free) eliminates heap fragmentation and prevents memory exhaustion crashes.",
        "Finally, the integrity verification subsystem integrates with hardware CRC accelerators. Modern wireless microcontrollers feature built-in hardware CRC peripherals that compute the CRC-16 CCITT polynomial in parallel with DMA transfers at line rate. This ensures that frame check validation introduces zero software CPU cycle overhead, allowing the microcontroller's main processor to remain in low-power sleep modes until a verified, error-free packet has been deposited into system memory.",
        "Mastering this binary serialization and parsing architecture gives systems engineers the foundational code necessary to implement custom 802.15.4 packet sniffers, gateway protocol translators, and hardened mesh radios.",
        "In Day 8, we will build directly upon these serialized frames as we construct the CSMA/CA medium access contention algorithms that arbitrate over-the-air transmission.",
        "In enterprise mesh gateways, the binary serializer also interfaces with protocol translation layers. For example, when bridging an 802.15.4 sensor mesh to an enterprise MQTT or Kafka broker, the gateway deserializes the raw 802.15.4 frame, validates the 16-bit short address mapping against its internal database, and repackages the telemetry into JSON or Protocol Buffer payloads for cloud consumption. Having a deterministic, zero-allocation binary codec is the linchpin that enables low-latency edge gateway translation at thousands of packets per second."
    ]
    p5_example = "Think of packing a precision modular shipping crate. You first attach the standard shipping label (FCF and Sequence Number), insert the recipient and return address badges (16-bit or 64-bit addressing), load the fragile cargo (MSDU payload), and finally snap on a serialized tamper-evident security barcode seal (CRC-16 FCS). If the barcode seal arrives broken, the receiving warehouse rejects the entire crate."
    p5_code = """# Complete Binary IEEE 802.15.4 MAC Frame Serializer & Deserializer
import struct

class IEEE802154MacFrame:
    def __init__(self, frame_type=1, ack_req=True, pan_compress=True,
                 seq_num=1, dst_pan=0xCAFE, dst_addr=0x0002,
                 src_addr=0x0001, payload=b""):
        self.frame_type = frame_type
        self.ack_req = ack_req
        self.pan_compress = pan_compress
        self.seq_num = seq_num
        self.dst_pan = dst_pan
        self.dst_addr = dst_addr
        self.src_addr = src_addr
        self.payload = payload
        
    def serialize(self) -> bytes:
        # Build 16-bit FCF: Data Frame (1), AR, PAN_Comp, Dest=16-bit (2), Src=16-bit (2)
        fcf = (self.frame_type & 0x07)
        if self.ack_req:
            fcf |= (1 << 5)
        if self.pan_compress:
            fcf |= (1 << 6)
        fcf |= (2 << 10)  # Dest mode: 16-bit Short
        fcf |= (2 << 14)  # Src mode: 16-bit Short
        
        # MHR: FCF (2B) + SeqNum (1B) + DstPAN (2B) + DstAddr (2B) + SrcAddr (2B)
        # Note: If pan_compress=True, SrcPAN is omitted
        mhr = struct.pack("<HBBHH", fcf, self.seq_num, self.dst_pan & 0xFF,
                          (self.dst_pan >> 8) & 0xFF, self.dst_addr)
        # Re-pack clean header with struct
        mhr = struct.pack("<H B H H H", fcf, self.seq_num, self.dst_pan, self.dst_addr, self.src_addr)
        
        packet_without_fcs = mhr + self.payload
        if len(packet_without_fcs) + 2 > 127:
            raise ValueError("Frame exceeds IEEE 802.15.4 127-byte MTU!")
            
        # Compute CRC-16 CCITT
        crc = 0x0000
        for byte in packet_without_fcs:
            crc ^= (byte << 8)
            for _ in range(8):
                if crc & 0x8000:
                    crc = ((crc << 1) ^ 0x1021) & 0xFFFF
                else:
                    crc = (crc << 1) & 0xFFFF
                    
        fcs = struct.pack("<H", crc)
        return packet_without_fcs + fcs

    @classmethod
    def parse(cls, raw_bytes: bytes) -> dict:
        if len(raw_bytes) < 11 or len(raw_bytes) > 127:
            raise ValueError("Invalid frame length.")
            
        # Verify CRC
        payload_data = raw_bytes[:-2]
        received_fcs = struct.unpack("<H", raw_bytes[-2:])[0]
        
        crc = 0x0000
        for byte in payload_data:
            crc ^= (byte << 8)
            for _ in range(8):
                if crc & 0x8000:
                    crc = ((crc << 1) ^ 0x1021) & 0xFFFF
                else:
                    crc = (crc << 1) & 0xFFFF
                    
        is_valid_fcs = (crc == received_fcs)
        fcf, seq, dst_pan, dst_addr, src_addr = struct.unpack("<H B H H H", raw_bytes[:9])
        payload = raw_bytes[9:-2]
        
        return {
            "fcf_hex": f"0x{fcf:04X}",
            "seq_num": seq,
            "dst_pan": f"0x{dst_pan:04X}",
            "dst_addr": f"0x{dst_addr:04X}",
            "src_addr": f"0x{src_addr:04X}",
            "payload": payload.decode("utf-8", errors="replace"),
            "fcs_valid": is_valid_fcs,
            "total_bytes": len(raw_bytes)
        }

frame = IEEE802154MacFrame(seq_num=42, dst_pan=0xCAFE, dst_addr=0x0002, src_addr=0x0001, payload=b"TELEMETRY:23.8C")
raw_mpdu = frame.serialize()
parsed = IEEE802154MacFrame.parse(raw_mpdu)

print("=== Complete IEEE 802.15.4 MAC Frame Serialization & Parsing ===")
print(f"Serialized MPDU: {raw_mpdu.hex().upper()} ({len(raw_mpdu)} octets)")
for k, v in parsed.items():
    print(f"  {k:12s}: {v}")
print(f"Frame Integrity Check: {'CRC-16 VERIFIED PERFECT' if parsed['fcs_valid'] else 'CHECKSUM ERROR'}")
"""
    p5_codeNotes = [
        "Implements full binary serialization of IEEE 802.15.4 MPDU frames.",
        "Encodes variable-length MHR with FCF flags, 16-bit addressing, and payload.",
        "Appends little-endian CRC-16 CCITT and validates checksum upon parsing."
    ]
    p5_tryIt = "Corrupt a single byte in raw_mpdu before parsing and verify that fcs_valid correctly reports False."
    p5_check = {
        "question": "What is the maximum permissible length of a complete IEEE 802.15.4 MAC Protocol Data Unit (MPDU) including header, payload, and FCS?",
        "options": [
            "Exactly 127 octets, matching the maximum physical payload (PSDU) defined by the standard.",
            "1500 octets, matching the standard Ethernet MTU.",
            "64 octets, matching legacy CAN bus framing.",
            "256 octets, matching RS-485 Modbus RTU frames."
        ],
        "answer": 0,
        "why": "Option 0 is correct: The IEEE 802.15.4 physical layer specification allocates 7 bits for the length field in the PHY header (PHR), strictly limiting the maximum MPDU size to 127 bytes (aBasePHYPayloadSize). Options 1, 2, and 3 describe specifications for other networking protocols."
    }

    day7_data = {
        "coursePrefix": "iot_net",
        "day": 7,
        "title": "IEEE 802.15.4 MAC Frame Formats, Superframes & Guaranteed Time Slots",
        "goal": "Master IEEE 802.15.4 link-layer framing: Frame Control Field (FCF) decoding, FFD vs RFD roles, superframe duty cycle mathematics (BO/SO), Guaranteed Time Slots (GTS), and CRC-16 CCITT verification.",
        "minutes": 38,
        "recap": "In Day 6, we mastered the 2.4 GHz PHY, O-QPSK modulation, and 32-chip DSSS spreading. Now in Day 7, we climb to the MAC layer to engineer packet framing and superframe timing.",
        "parts": [
            {
                "title": "IEEE 802.15.4 General MAC Frame Anatomy & Frame Control Field",
                "say": p1_say,
                "example": p1_example,
                "code": p1_code,
                "output": "",
                "codeNotes": p1_codeNotes,
                "tryIt": p1_tryIt,
                "check": p1_check
            },
            {
                "title": "Operating Topologies & Device Roles: FFD vs RFD & PAN Coordinators",
                "say": p2_say,
                "example": p2_example,
                "code": p2_code,
                "output": "",
                "codeNotes": p2_codeNotes,
                "tryIt": p2_tryIt,
                "check": p2_check
            },
            {
                "title": "Superframe Architecture: Beacon Order, Superframe Order & Duty Cycle",
                "say": p3_say,
                "example": p3_example,
                "code": p3_code,
                "output": "",
                "codeNotes": p3_codeNotes,
                "tryIt": p3_tryIt,
                "check": p3_check
            },
            {
                "title": "Contention Access Period vs Contention-Free Period & GTS",
                "say": p4_say,
                "example": p4_example,
                "code": p4_code,
                "output": "",
                "codeNotes": p4_codeNotes,
                "tryIt": p4_tryIt,
                "check": p4_check
            },
            {
                "title": "Full IEEE 802.15.4 MAC Frame Serializer & Parser Engine",
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
            "IEEE 802.15.4 MAC frames (MPDUs) are bounded by a strict 127-octet MTU and governed by a 16-bit Frame Control Field (FCF).",
            "PAN ID Compression eliminates redundant 2-octet Source PAN IDs for intra-PAN unicast transmissions.",
            "Full Function Devices (FFDs) can serve as PAN Coordinators and routers; Reduced Function Devices (RFDs) act solely as energy-efficient leaf endpoints.",
            "Beacon-enabled superframes define duty cycles governed by 2^(SO - BO), enabling sub-1% active duty cycles for multi-year battery endurance.",
            "Guaranteed Time Slots (GTS) allocate up to 7 dedicated slots in the Contention-Free Period (CFP) for zero-collision real-time industrial telemetry."
        ],
        "projectStep": {
            "title": "IEEE 802.15.4 MAC Layer Framing & Superframe Synthesis",
            "steps": [
                "Implement the 16-bit Frame Control Field (FCF) binary encoder and parser.",
                "Enforce FFD and RFD role constraints within an association topology validator.",
                "Calculate superframe Beacon Intervals (BI) and Superframe Durations (SD) across BO/SO values.",
                "Construct the Contention-Free Period (CFP) Guaranteed Time Slot (GTS) allocator.",
                "Synthesize the binary IEEE802154MacFrame serializer and verify 100% CRC-16 CCITT integrity."
            ]
        }
    }

    # Execute all code snippets dynamically to guarantee 100% exact output match
    for idx, p in enumerate(day7_data["parts"]):
        proc = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"Day 7 Part {idx+1} execution error:\n{proc.stderr}")
            sys.exit(1)
        p["output"] = proc.stdout.strip()

    wcs = [len(" ".join(p["say"]).split()) for p in day7_data["parts"]]
    print(f"Day 7 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_net_day7.json", "w", encoding="utf-8") as f:
        json.dump(day7_data, f, indent=2, ensure_ascii=False)
    print("Successfully built scripts/iot_net_day7.json!")

if __name__ == '__main__':
    build_day7()
