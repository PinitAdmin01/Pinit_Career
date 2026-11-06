# scripts/build_iot_net_day9.py
"""
Builds Day 9 for Course 18: IoT Networking & Cloud Protocols (iot_net).
Day 9: PAN Coordination, Association Handshakes, 16/64-Bit Addressing & Network Synchronization
Pedagogical Invariants:
- Exactly 5 parts, each strictly >= 580 words (target >= 620 words).
- minutes: 38.
- 100% deterministic Python standard library execution, verified output capture.
- 4 multiple choice options with answer: 0 and deep why.
- Strict mathematical & architectural depth: PAN formation, ED/Active/Passive scans, EUI-64 vs 16-bit Short Address, 4-way association handshake, orphan recovery, association tables.
"""

import json
import subprocess
import sys

def build_day9():
    # =========================================================================
    # Part 1: PAN Formation & Channel Scanning: ED, Active & Passive Scans
    # =========================================================================
    p1_say = [
        "Welcome to Day 9 of IoT Networking & Cloud Protocols. Having mastered the physical layer modulation and link-layer CSMA/CA channel arbitration in Days 6 through 8, we now investigate how an autonomous wireless mesh discovers, establishes, and governs itself: Personal Area Network (PAN) Formation and Channel Scanning.",
        "When an unconfigured Full Function Device (FFD) boots up with the intention of becoming a PAN Coordinator, it cannot simply select an arbitrary radio channel and begin broadcasting. Doing so would risk selecting a channel saturated with enterprise Wi-Fi interference or colliding with an existing neighboring 802.15.4 network that shares the same Personal Area Network Identifier (PAN ID).",
        "Instead, the prospective PAN Coordinator executes a rigorous two-phase network discovery procedure mandated by the IEEE 802.15.4 standard: an Energy Detection (ED) Scan followed by an Active Channel Scan.",
        "The first phase is the Energy Detection (ED) Scan. During an ED scan, the device steps sequentially through all 16 channels of the 2.4 GHz band (Channels 11 through 26). On each channel, the radio receiver measures the peak and average electromagnetic energy over a duration governed by the ScanDuration parameter: ScanTime = aBaseSuperframeDuration * (2^ScanDuration + 1) symbols. The device compiles an Energy List recording the ambient noise floor across the entire spectrum. Channels exhibiting high RF energy (often caused by nearby Wi-Fi access points on Wi-Fi Channels 1, 6, or 11) are immediately eliminated. The device selects a subset of quiet, low-interference channels (typically Channels 15, 20, 25, or 26) for further evaluation.",
        "The second phase is the Active Channel Scan. On each quiet candidate channel identified during the ED scan, the device broadcasts a MAC Beacon Request command frame using the broadcast destination address 0xFFFF. The device then enables its receiver for ScanTime, listening for Beacon Frames returned by any active PAN Coordinators operating within radio range. Each received beacon discloses the existing network's 16-bit PAN ID, Logical Channel, Protocol Version, and whether the PAN is currently permitting new device associations.",
        "By parsing all returned beacons, the prospective coordinator identifies all occupied PAN IDs in the local RF vicinity. It then chooses a unique, uncontested 16-bit PAN ID (any integer from 0x0001 to 0xFFFE, avoiding 0xFFFF which is reserved for broadcast).",
        "Finally, for battery-powered end devices looking to join an existing network, the standard provides the Passive Channel Scan. Unlike the active scan, a passive scan transmits zero radio packets. The joining node simply tunes to each channel and silently listens for periodic beacon frames broadcast by existing coordinators, minimizing energy expenditure and avoiding channel pollution.",
        "Once a clean channel is selected and an uncontested PAN ID is established, the coordinator broadcasts its initial Beacon Frame or sets up an unslotted network, officially inaugurating the Personal Area Network.",
        "In enterprise multi-gateway architectures, the Channel Selection algorithm must also incorporate dynamic Link Quality Assessment over time. Ambient RF conditions in commercial facilities fluctuate significantly between business hours and nighttime. For instance, employee smartphone Wi-Fi hotspotting and Bluetooth device density surge between 9:00 AM and 5:00 PM, creating transient spectral crowding on channels that appeared completely quiet during an early-morning commissioning scan.",
        "To maintain optimal network health, high-end 802.15.4 coordinators execute periodic Background Energy Scans during quiescent network periods. If the rolling average noise floor on the operating channel rises above -80 dBm for a sustained duration, the coordinator can initiate a Network Channel Change. It broadcasts a series of Broadcast Channel Switch Announcements over several consecutive superframes, informing all child nodes of the target channel and the exact countdown timer before the entire PAN migrates synchronously to the new frequency.",
        "Understanding these channel scanning state machines is critical for designing industrial wireless gateways that can automatically commission themselves in complex multi-tenant factory floors without requiring manual RF spectrum analyzer intervention."
    ]
    p1_example = "Think of a vendor arriving at an outdoor flea market to set up a fruit stand. The vendor first walks down the aisles listening to where the loud diesel generators and construction equipment are rumbling (Energy Detection Scan). Once they find a quiet grassy area, they ask the nearby shopkeepers what stall numbers are already registered (Active Scan). Once they confirm stall #42 is unassigned, they pitch their tent and open for business."
    p1_code = """# IEEE 802.15.4 PAN Formation & Multi-Channel Scanner Engine
class PanFormationScanner:
    CHANNELS = list(range(11, 27))   # Channels 11 to 26
    
    def __init__(self, simulated_spectrum_noise: dict, existing_networks: dict):
        self.noise_map = simulated_spectrum_noise   # channel -> noise_power_dbm
        self.networks = existing_networks           # channel -> list of PAN_IDs
        
    def perform_energy_detection_scan(self) -> dict:
        # Step through all 16 channels and record peak RF power
        energy_results = {}
        for ch in self.CHANNELS:
            power = self.noise_map.get(ch, -98.0)
            energy_results[ch] = power
        return energy_results
        
    def perform_active_scan(self, candidate_channels: list[int]) -> dict:
        # Broadcast Beacon Request on quiet candidate channels and listen for PAN beacons
        discovered_pans = {}
        for ch in candidate_channels:
            active_pans = self.networks.get(ch, [])
            discovered_pans[ch] = active_pans
        return discovered_pans
        
    def form_new_pan(self, preferred_pan_id: int = 0xABCD) -> dict:
        # 1. Execute ED Scan
        ed_results = self.perform_energy_detection_scan()
        # Find quiet channels (noise < -85 dBm)
        quiet_channels = [ch for ch, pwr in ed_results.items() if pwr < -85.0]
        if not quiet_channels:
            raise RuntimeError("All channels exhibit severe RF interference!")
            
        # 2. Execute Active Scan on quiet channels
        active_results = self.perform_active_scan(quiet_channels)
        
        # 3. Select best channel (lowest noise) with no PAN ID conflict
        sorted_channels = sorted(quiet_channels, key=lambda c: ed_results[c])
        selected_channel = sorted_channels[0]
        occupied_pans_on_ch = active_results.get(selected_channel, [])
        
        assigned_pan_id = preferred_pan_id
        while assigned_pan_id in occupied_pans_on_ch or assigned_pan_id in (0x0000, 0xFFFF):
            assigned_pan_id = (assigned_pan_id + 1) & 0xFFFE
            
        return {
            "status": "PAN_ESTABLISHED",
            "selected_channel": selected_channel,
            "channel_noise_dbm": ed_results[selected_channel],
            "pan_id": f"0x{assigned_pan_id:04X}",
            "conflicting_pans_avoided": occupied_pans_on_ch
        }

# Simulate realistic enterprise RF environment: Wi-Fi on Ch 1, 6, 11
spectrum_noise = {
    11: -65.0, 12: -68.0, 13: -72.0, 14: -75.0,  # Wi-Fi Ch 1 overlap
    16: -62.0, 17: -64.0, 18: -69.0, 19: -71.0,  # Wi-Fi Ch 6 overlap
    21: -60.0, 22: -63.0, 23: -68.0, 24: -70.0,  # Wi-Fi Ch 11 overlap
    15: -90.0, 20: -92.0, 25: -91.0, 26: -96.0   # Clean guard gaps
}
existing_nets = {
    26: [0x1111, 0x2222]   # Existing building automation networks on Ch 26
}

scanner = PanFormationScanner(spectrum_noise, existing_nets)
pan_record = scanner.form_new_pan(preferred_pan_id=0x1111)

print("=== IEEE 802.15.4 Autonomous PAN Formation Record ===")
for k, v in pan_record.items():
    print(f"  {k:25s}: {v}")
"""
    p1_codeNotes = [
        "Defines PanFormationScanner executing two-phase ED and Active Channel scanning.",
        "Eliminates channels suffering heavy Wi-Fi interference above -85 dBm.",
        "Resolves PAN ID collisions automatically by incrementing contested identifiers."
    ]
    p1_tryIt = "Set preferred_pan_id to 0x3333 and verify that it is assigned directly without collision resolution."
    p1_check = {
        "question": "What is the primary difference between an Active Channel Scan and a Passive Channel Scan in an IEEE 802.15.4 network?",
        "options": [
            "An Active Scan broadcasts Beacon Request frames and listens for responses, whereas a Passive Scan only listens silently for periodic beacons without transmitting.",
            "An Active Scan operates at 5 GHz, whereas a Passive Scan operates at 2.4 GHz.",
            "An Active Scan encrypts the radio channel, whereas a Passive Scan disables all network security.",
            "An Active Scan is used exclusively by Reduced Function Devices (RFDs)."
        ],
        "answer": 0,
        "why": "Option 0 accurately captures the standard definition: Active Scanning actively probes the medium by transmitting MAC Beacon Requests to solicit immediate responses from coordinators. Passive Scanning listens silently across each channel for pre-existing periodic beacon broadcasts, consuming zero transmit power. Options 1, 2, and 3 are technically invalid."
    }

    # =========================================================================
    # Part 2: Address Space & Translation: 64-Bit Extended vs 16-Bit Short Addresses
    # =========================================================================
    p2_say = [
        "Once a Personal Area Network is established, how are individual participating nodes identified and addressed? Today we explore IEEE 802.15.4 Address Space Architecture: 64-Bit Extended Addresses versus 16-Bit Short Addresses.",
        "Every single IEEE 802.15.4 silicon transceiver manufactured in the world is assigned a globally unique 64-bit Extended MAC Address (EUI-64) by the silicon vendor during fabrication (such as Texas Instruments, Nordic Semiconductor, or NXP). The IEEE Registration Authority allocates a 24-bit or 36-bit Organizationally Unique Identifier (OUI) to the manufacturer, and the manufacturer burns a unique 40-bit or 28-bit extension into immutable One-Time Programmable (OTP) eFuses on the chip die.",
        "This 64-bit EUI-64 address guarantees that no two wireless devices on Earth will ever share the same physical hardware address. However, transmitting an 8-byte address in the destination field and an 8-byte address in the source field consumes 16 bytes of MAC header overhead in every single packet. Within a strictly constrained 127-byte physical frame, losing 16 bytes purely to addressing fields severely restricts the throughput available for application telemetry and encryption wrappers.",
        "To eliminate this header bloat, IEEE 802.15.4 introduces dynamic 16-Bit Short Addressing. A 16-bit short address spans exactly 2 octets, reducing dual addressing overhead from 16 bytes down to just 4 bytes (or 2 bytes if PAN ID compression is active). This saves up to 12 bytes per packet—an extraordinary 9.4% payload capacity expansion within a 127-byte frame.",
        "The 16-bit short address space (0x0000 to 0xFFFF) is rigorously partitioned by the standard into distinct functional ranges:",
        "Address 0x0000 is universally reserved for the PAN Coordinator of the network. When any node in the PAN transmits a packet with destination address 0x0000, it is guaranteed to route directly to the root coordinator.",
        "Addresses 0x0001 through 0xFFFD represent the Assignable Unicast Address Space. The PAN Coordinator or parent routers dynamically allocate these 16-bit integers to child devices during the network association handshake. A single 802.15.4 network can theoretically support up to 65,533 uniquely addressed active nodes.",
        "Address 0xFFFE is reserved as the Special Unassociated Address. When an uncommissioned sensor first boots up and has not yet joined a network, it possesses no short address. If it must transmit a frame before association, it sets its source address to 0xFFFE, indicating to recipient coordinators that the device must be addressed using its full 64-bit extended EUI-64.",
        "Address 0xFFFF is universally reserved as the MAC Broadcast Address. A frame transmitted to destination address 0xFFFF is accepted and processed by every single listening transceiver on that channel and PAN ID.",
        "A vital architectural consideration when designing 16-bit short address allocation schemes is Address Fragmentation and Address Recycling in dynamic ad-hoc networks. In applications such as smart hospitals or logistics warehouses, asset tracking tags enter the facility, associate with the network, transmit telemetry for several hours, and then physically depart as shipments leave the loading dock.",
        "If a coordinator implements naive sequential address allocation without recycling, departing devices will permanently consume address slots, eventually causing address pool exhaustion even though only a dozen active nodes remain in the building. To prevent this, professional coordinator firmware implements an Address Aging and Garbage Collection engine. When an associated device fails to report keepalive telemetry within its agreed poll interval, the coordinator marks the short address as DORMANT. After an expiration quarantine period, the address is reclaimed and returned to the free allocation pool.",
        "The PAN Coordinator maintains an internal Address Translation Table that maps every associated device's factory 64-bit EUI-64 to its ephemeral 16-bit Short Address, enabling seamless address resolution across local mesh routing and cloud gateway boundaries."
    ]
    p2_example = "Think of a large corporate headquarters. Your full 64-bit extended address is your legal passport identity (Full Name, Date of Birth, Passport Number), which is unique across the entire world but clumsy to use for daily communication. Your 16-bit short address is your 4-digit internal desk phone extension (e.g., ext. 1042). When people inside the building call you, they dial 1042; if someone contacts external headquarters from the outside, the receptionist looks up your extension in the directory."
    p2_code = """# IEEE 802.15.4 Address Space Partitioning & Translation Table Engine
class IEEE802154AddressEngine:
    SPECIAL_ADDRESSES = {
        0x0000: "PAN_COORDINATOR",
        0xFFFE: "UNASSOCIATED_DEVICE",
        0xFFFF: "MAC_BROADCAST"
    }
    
    def __init__(self, pan_id: int):
        self.pan_id = pan_id
        # EUI-64 (str) -> Short Address (int)
        self.eui64_to_short = {}
        # Short Address (int) -> EUI-64 (str)
        self.short_to_eui64 = {}
        self.next_allocatable_short = 0x0001
        
    def allocate_short_address(self, eui64_hex: str) -> int:
        if eui64_hex in self.eui64_to_short:
            return self.eui64_to_short[eui64_hex]
            
        if self.next_allocatable_short > 0xFFFD:
            raise OverflowError("PAN short address space completely exhausted (65,533 nodes max)!")
            
        short_addr = self.next_allocatable_short
        self.next_allocatable_short += 1
        
        self.eui64_to_short[eui64_hex] = short_addr
        self.short_to_eui64[short_addr] = eui64_hex
        return short_addr
        
    def classify_address(self, addr: int) -> str:
        if addr in self.SPECIAL_ADDRESSES:
            return self.SPECIAL_ADDRESSES[addr]
        elif 0x0001 <= addr <= 0xFFFD:
            return "ASSOCIATED_UNICAST_NODE"
        else:
            return "INVALID_ADDRESS"

engine = IEEE802154AddressEngine(pan_id=0xABCD)

# Register factory devices with unique 64-bit EUI-64 MAC addresses
nodes = [
    "00:12:4B:00:14:D5:2F:01",
    "00:12:4B:00:14:D5:2F:02",
    "00:12:4B:00:14:D5:2F:03"
]

print("=== IEEE 802.15.4 Address Allocation & Resolution ===")
for eui in nodes:
    short = engine.allocate_short_address(eui)
    role = engine.classify_address(short)
    print(f"EUI-64 [{eui}] -> Assigned Short Address: 0x{short:04X} ({role})")

for special in [0x0000, 0xFFFE, 0xFFFF]:
    print(f"Special Address 0x{special:04X}: {engine.classify_address(special)}")
"""
    p2_codeNotes = [
        "Defines IEEE802154AddressEngine managing the 16-bit short address allocation pool.",
        "Enforces standard reservations: 0x0000 (Coordinator), 0xFFFE (Unassociated), 0xFFFF (Broadcast).",
        "Demonstrates bidirectional EUI-64 to Short Address translation and address classification."
    ]
    p2_tryIt = "Allocate 5 additional addresses and verify that the next_allocatable_short increments sequentially."
    p2_check = {
        "question": "What is the designated meaning of 16-bit Short Address 0xFFFE in an IEEE 802.15.4 MAC frame?",
        "options": [
            "It signifies that the transmitting device has not yet been assigned a short address and must be identified by its 64-bit extended EUI-64.",
            "It represents a broadcast packet destined for all devices in the PAN.",
            "It addresses the root PAN Coordinator.",
            "It commands the receiver to perform an immediate cryptographic key rotation."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the standard: Address 0xFFFE is reserved to indicate an unassociated device. When a node transmits an Association Request, it does not yet own a short address, so it specifies 0xFFFE as its short address and provides its full 64-bit EUI-64. Address 0xFFFF is broadcast, and 0x0000 is the PAN Coordinator."
    }

    # =========================================================================
    # Part 3: The 4-Way Association Handshake Protocol
    # =========================================================================
    p3_say = [
        "How does an unassociated sensor node transition from being an isolated piece of silicon into an authenticated, commissioned member of an IEEE 802.15.4 network? Enter the 4-Way Association Handshake Protocol.",
        "In constrained low-power wireless networking, child sensor nodes are frequently asleep. Furthermore, the coordinator cannot simply blast a response packet to a child because it does not know if the child's receiver is active. To handle these physical constraints gracefully, 802.15.4 implements an Indirect Data Transfer mechanism embedded inside the association sequence.",
        "The association process unfolds across four mandatory, sequential protocol steps:",
        "Step 1: The Association Request. After discovering a coordinator through channel scanning, the unassociated device constructs an Association Request MAC Command frame. In the MAC header, the source address is set to the device's 64-bit extended EUI-64, the destination PAN ID is set to the coordinator's PAN ID, and the destination address is set to the coordinator's address. The command payload includes a Capability Information byte, where the joining node declares whether it is an FFD or RFD, its power source (mains vs battery), whether its receiver is enabled when idle, and whether it supports link security. The device transmits this frame using CSMA/CA with the Acknowledgment Request (AR) bit set.",
        "Step 2: The Immediate MAC ACK. Upon receiving the Association Request and validating its CRC-16 checksum, the coordinator immediately returns a 3-octet MAC Acknowledgment frame matching the sequence number of the request. This ACK confirms to the device that the coordinator successfully received the request. However, the ACK does NOT contain the assigned short address! The coordinator requires time to consult its internal admission control policies, evaluate available memory, and allocate a 16-bit address.",
        "Step 3: The Wait Interval & Indirect Data Request. The joining device enters a standby wait state for a standardized period known as macResponseWaitTime (typically aBaseSuperframeDuration * 32 symbols ≈ 491.5 milliseconds). This interval gives the coordinator sufficient time to process the association. Once macResponseWaitTime expires, the joining device transmits a Data Request MAC Command frame to the coordinator, commanding: 'I am device EUI-64, do you have my association response buffered?'",
        "Step 4: The Association Response. If the coordinator has successfully processed the request, it transmits the buffered Association Response MAC Command frame back to the device. The response payload contains two vital fields: the Assigned 16-Bit Short Address (e.g., 0x0005) and the 1-octet Association Status Code.",
        "The standard defines four possible Association Status Codes: 0x00 indicates Association Successful; 0x01 indicates PAN at Capacity (no short addresses or routing memory available); 0x02 indicates Access Denied (security policy violation or unauthorized device); and values 0x03–0x7F are reserved.",
        "If status 0x00 is received, the device stores its assigned 16-bit Short Address in non-volatile flash, configures its radio hardware filters, and transitions into the fully ASSOCIATED operational state.",
        "When examining the security dynamics of the 4-way association handshake, systems engineers must evaluate vulnerability to unauthorized network snooping and rogue node admission. In unencrypted association handshakes, the Association Request, MAC ACK, Data Request, and Association Response are exchanged in plaintext over the air. An eavesdropper with an inexpensive 802.15.4 packet sniffer can capture the joining node's 64-bit EUI-64 address and assigned short address.",
        "To enforce zero-trust security during commissioning, production standards (such as Zigbee 3.0 and Thread) mandate that the MAC-layer association handshake must be immediately followed by an Upper-Layer Commissioning and Key Exchange Protocol. In Thread, the node uses EC-J-PAKE (Elliptic Curve Password Authenticated Key Exchange) over DTLS to securely establish the master network encryption key without transmitting passphrases over the air. In Zigbee, the coordinator uses a temporary Install Code Pre-Shared Key (derived from a QR code printed on the physical device) to encrypt the Master Network Key before the node is permitted to transmit application telemetry.",
        "Mastering this 4-step sequence is essential for debugging mesh commissioning failures, diagnosing join timeouts, and capturing sniffer traces during field deployments."
    ]
    p3_example = "Think of applying for a library card. Step 1: You hand your passport and application form to the librarian (Association Request). Step 2: The librarian gives you a claim ticket stamped 'Received' (MAC ACK). Step 3: You sit in the waiting room for 10 minutes, then return to the counter with your claim ticket (Data Request). Step 4: The librarian hands you your laminated library card with your new 4-digit member ID (Association Response)."
    p3_code = """# IEEE 802.15.4 4-Way Association Handshake Protocol Simulator
class IEEE802154AssociationCoordinator:
    STATUS_SUCCESS = 0x00
    STATUS_PAN_AT_CAPACITY = 0x01
    STATUS_ACCESS_DENIED = 0x02
    
    def __init__(self, pan_id=0xCAFE, max_capacity=10):
        self.pan_id = pan_id
        self.max_capacity = max_capacity
        self.associated_nodes = {}  # eui64 -> short_addr
        self.buffered_responses = {} # eui64 -> response_dict
        self.next_short = 0x0001
        
    def handle_step1_association_request(self, eui64: str, is_ffd: bool, is_mains_powered: bool) -> dict:
        # Coordinator receives request and immediately plans buffered response
        if len(self.associated_nodes) >= self.max_capacity:
            status = self.STATUS_PAN_AT_CAPACITY
            assigned_short = 0xFFFF
        else:
            status = self.STATUS_SUCCESS
            assigned_short = self.next_short
            self.next_short += 1
            self.associated_nodes[eui64] = assigned_short
            
        self.buffered_responses[eui64] = {
            "assigned_short": assigned_short,
            "status_code": status,
            "status_str": "SUCCESS" if status == 0x00 else "CAPACITY_FULL"
        }
        
        # Step 2: Immediate MAC ACK
        return {"step": 2, "frame": "MAC_ACK", "status": "REQUEST_ACKNOWLEDGED"}
        
    def handle_step3_data_request(self, eui64: str) -> dict:
        # Step 4: Coordinator returns buffered Association Response
        if eui64 not in self.buffered_responses:
            return {"step": 4, "frame": "NO_DATA", "status": "NO_BUFFERED_DATA"}
            
        resp = self.buffered_responses.pop(eui64)
        return {
            "step": 4,
            "frame": "ASSOCIATION_RESPONSE",
            "assigned_short": f"0x{resp['assigned_short']:04X}",
            "status": resp["status_str"]
        }

coord = IEEE802154AssociationCoordinator(pan_id=0xCAFE)
joining_eui64 = "00:12:4B:00:14:D5:99:A1"

print("=== IEEE 802.15.4 4-Way Association Handshake Protocol ===")
# Step 1: Device transmits Association Request
print(f"Step 1: Device [{joining_eui64}] transmits Association Request...")
# Step 2: Coordinator returns immediate MAC ACK
ack = coord.handle_step1_association_request(joining_eui64, is_ffd=False, is_mains_powered=False)
print(f"Step 2: Coordinator returns -> {ack['frame']} ({ack['status']})")

# Simulated macResponseWaitTime delay (491.5 ms)
print("  ... Device delays for macResponseWaitTime (491.5 ms) ...")

# Step 3: Device transmits Data Request (Polling)
print(f"Step 3: Device [{joining_eui64}] transmits Data Request to fetch response...")
# Step 4: Coordinator delivers Association Response
final_resp = coord.handle_step3_data_request(joining_eui64)
print(f"Step 4: Coordinator returns -> {final_resp['frame']} | Assigned Short: {final_resp['assigned_short']} | Status: {final_resp['status']}")
"""
    p3_codeNotes = [
        "Models full 4-step IEEE 802.15.4 association handshake state machine.",
        "Demonstrates indirect data buffering between Step 2 (ACK) and Step 3 (Data Request).",
        "Assigns 16-bit short address upon Step 4 Association Response delivery."
    ]
    p3_tryIt = "Instantiate the coordinator with max_capacity=0 and verify that Step 4 returns status CAPACITY_FULL with address 0xFFFF."
    p3_check = {
        "question": "Why does the IEEE 802.15.4 coordinator NOT deliver the assigned 16-bit short address directly inside the MAC ACK of Step 2?",
        "options": [
            "The MAC ACK is a rigid 3-byte physical frame without payload space, requiring the coordinator to buffer the response for indirect retrieval via a Data Request.",
            "Because 16-bit short addresses can only be transmitted over Ethernet cables.",
            "The device must reboot into an encrypted bootloader before accepting addresses.",
            "The coordinator must wait 24 hours to obtain FCC spectrum approval."
        ],
        "answer": 0,
        "why": "Option 0 correctly explains the architectural limitation: in IEEE 802.15.4, MAC Acknowledgment frames are fixed at exactly 3 octets (2-byte FCF + 1-byte Sequence Number) to ensure ultra-fast 16-symbol turnaround times. An ACK cannot carry payload data. The coordinator buffers the association response in memory, and the device fetches it via an indirect Data Request in Step 3/4. Options 1, 2, and 3 are technically invalid."
    }

    # =========================================================================
    # Part 4: Network Maintenance: Disassociation, Orphan Scans & Realignment
    # =========================================================================
    p4_say = [
        "In a dynamic, real-world wireless deployment, network membership is not static. Physical devices lose power, battery voltages drop, coordinators reboot after firmware updates, and radio interference causes nodes to lose clock synchronization.",
        "To maintain network stability and self-healing resilience across years of operation, the IEEE 802.15.4 MAC specification incorporates four vital network maintenance protocols: Disassociation Notifications, Loss of Synchronization Recovery, Orphan Scans, and Realignment Commands.",
        "The first maintenance protocol is Disassociation. Either party—the parent coordinator or the child device—can initiate a graceful departure from the network. If an end device is being decommissioned or moved to a different facility, it transmits a Disassociation Notification MAC Command frame to its parent coordinator, specifying a Disassociation Reason (e.g., Coordinator wishes device to leave, or Device wishes to leave). The parent immediately deallocates the child's 16-bit short address, purging it from its internal routing table so the address can be reused. Conversely, if a coordinator runs out of memory, it can command a child to leave, triggering the child to clear its network credentials.",
        "The second critical scenario is Loss of Synchronization (Sync Loss). In beacon-enabled networks, a child device maintains its sleep/wake schedule by synchronizing to periodic beacon frames. If environmental interference or physical obstruction prevents the device from hearing a beacon, it increments a missed beacon counter. The standard mandates the aMaxLostBeacons constant (default value = 4). If a child node misses 4 consecutive beacons, the MAC layer declares a SYNC_LOSS event, concluding that the parent coordinator has either failed, rebooted on a different channel, or moved out of radio range.",
        "Upon declaring sync loss, the child device does not give up and wipe its flash memory. Instead, it initiates an Orphan Scan. In an Orphan Scan, the node steps through all radio channels and transmits an Orphan Notification MAC Command frame containing its factory 64-bit extended address. The frame announces: 'I am device EUI-64, I was previously associated on this PAN, where is my parent?'",
        "If the parent coordinator hears the Orphan Notification, it looks up the device's EUI-64 in its active association table. If the device is found, the coordinator immediately transmits a Coordinator Realignment MAC Command frame directly to the orphan. The realignment frame provides the current PAN ID, Logical Channel, and confirms the node's assigned 16-bit Short Address.",
        "Upon parsing the realignment frame, the orphaned node immediately locks back into synchronization without executing a complete, expensive 4-way re-association handshake. This rapid self-healing capability preserves network stability during industrial transient power glitches.",
        "In large-scale mesh topologies where multiple routers coexist, the Orphan Scan protocol also serves as an automated Local Parent Failover mechanism. If a sensor node's immediate parent router suffers a hardware power failure, the child will quickly miss 4 consecutive beacons and declare SYNC_LOSS. When the child initiates its Orphan Scan, not only its original parent, but any neighboring router that has cached the child's short address can evaluate the realignment request.",
        "If an alternative neighboring router possesses the child's routing credentials or has an active path to the root coordinator, it can issue a realignment response, adopting the orphaned device as a new child. This decentralized orphan recovery mechanism enables self-healing mesh behavior, rerouting stranded sensor clusters around failed intermediate nodes without requiring manual re-commissioning or technician truck rolls.",
        "Mastering these maintenance handshakes enables systems engineers to design impervious firmware recovery loops that survive unexpected gateway restarts without leaving field sensors permanently stranded.",
        "Additionally, embedded developers must carefully calibrate the duration of the Orphan Scan. If an orphan sweeps channels too rapidly, the coordinator may not receive the notification; conversely, if the scan duration is excessively long, the battery of the disconnected sensor is needlessly drained. Adhering to the standard aScanDuration parameter ensures reliable realignment without battery depletion."
    ]
    p4_example = "Think of a small child getting separated from their parent in a crowded department store. Rather than assuming they have no parents and being adopted from scratch (full re-association), the child walks to the center aisle and calls out their full name (Orphan Scan). The parent recognizes their child's voice, walks over, takes their hand, and confirms: 'We are on Floor 2, here is your badge' (Coordinator Realignment)."
    p4_code = """# IEEE 802.15.4 Orphan Recovery & Coordinator Realignment Simulator
class OrphanRecoveryEngine:
    MAX_LOST_BEACONS = 4
    
    def __init__(self, pan_id=0xCAFE, channel=26):
        self.pan_id = pan_id
        self.channel = channel
        # Coordinator database: EUI-64 -> Short Address
        self.registered_nodes = {
            "00:12:4B:00:14:D5:01:A0": 0x0002,
            "00:12:4B:00:14:D5:01:B0": 0x0003
        }
        
    def check_orphan_notification(self, orphan_eui64: str, rx_channel: int) -> dict:
        # Coordinator receives Orphan Notification on rx_channel
        if rx_channel != self.channel:
            return {"status": "IGNORED", "reason": "WRONG_CHANNEL"}
            
        if orphan_eui64 in self.registered_nodes:
            short_addr = self.registered_nodes[orphan_eui64]
            # Emit Coordinator Realignment MAC Command
            return {
                "status": "REALIGNED",
                "frame": "COORDINATOR_REALIGNMENT",
                "pan_id": f"0x{self.pan_id:04X}",
                "channel": self.channel,
                "confirmed_short_addr": f"0x{short_addr:04X}",
                "message": f"Welcome back orphan node {orphan_eui64}!"
            }
        else:
            return {"status": "UNKNOWN_ORPHAN", "reason": "NODE_NOT_IN_ASSOCIATION_TABLE"}

engine = OrphanRecoveryEngine(pan_id=0xCAFE, channel=26)
orphan_node = "00:12:4B:00:14:D5:01:A0"

print("=== IEEE 802.15.4 Orphan Scan & Realignment Handshake ===")
# Simulate node missing 4 consecutive beacons
print(f"Node [{orphan_node}] missed 4 consecutive beacons -> SYNC_LOSS declared.")
print(f"Node initiates Orphan Scan across channels...")

# Scan Ch 25 (Wrong channel)
res_wrong = engine.check_orphan_notification(orphan_node, rx_channel=25)
print(f"  Channel 25 Scan Result: {res_wrong['status']} ({res_wrong.get('reason')})")

# Scan Ch 26 (Coordinator's channel)
res_correct = engine.check_orphan_notification(orphan_node, rx_channel=26)
print(f"  Channel 26 Scan Result: {res_correct['status']} -> {res_correct['frame']}")
print(f"    -> PAN ID: {res_correct['pan_id']} | Channel: {res_correct['channel']} | Restored Short: {res_correct['confirmed_short_addr']}")
"""
    p4_codeNotes = [
        "Models the IEEE 802.15.4 aMaxLostBeacons (4) synchronization failure threshold.",
        "Simulates multi-channel Orphan Notification broadcasts and coordinator verification.",
        "Emits Coordinator Realignment commands restoring lost short address and channel settings."
    ]
    p4_tryIt = "Introduce an unregistered orphan node address and verify that the coordinator returns UNKNOWN_ORPHAN."
    p4_check = {
        "question": "How many consecutive beacons must an IEEE 802.15.4 child device miss before declaring a loss of synchronization (SYNC_LOSS)?",
        "options": [
            "Exactly 4 consecutive beacons, governed by the standard constant aMaxLostBeacons.",
            "1 missed beacon.",
            "100 missed beacons.",
            "Beacons are never missed in wireless communications."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the standard: The IEEE 802.15.4 MAC PIB defines aMaxLostBeacons = 4. If an associated device misses 4 consecutive expected beacon transmissions, the MAC declares SYNC_LOSS and initiates an Orphan Scan or re-association. Options 1, 2, and 3 are false."
    }

    # =========================================================================
    # Part 5: Full PAN Coordinator Association Table & Routing Simulator
    # =========================================================================
    p5_say = [
        "To conclude Day 9, we synthesize all network coordination, addressing, and association protocols into an integrated PAN Coordinator Management Subsystem.",
        "In a commercial embedded gateway (such as a Thread Border Router or Zigbee Gateway), the PAN Coordinator maintains a unified, thread-safe Association and Neighbor Table in system memory.",
        "For every participating device in the network, the table tracks five mandatory metadata attributes: the 64-bit Extended EUI-64 hardware address, the assigned 16-bit Short Network Address, the Device Capability Flags (FFD vs RFD, mains vs battery-powered, receiver on when idle), the Link Quality Indicator (LQI) and Received Signal Strength Indicator (RSSI) of the last received frame, and a Keepalive Age Counter.",
        "When an incoming packet arrives from an upper layer destined for a particular device, the coordinator's routing engine performs an instant O(1) hash table lookup. If the destination is designated by an EUI-64 address, it resolves the address to the corresponding 16-bit Short Address to format the outgoing MAC header.",
        "Furthermore, if the destination device is an energy-conserving Sleepy End Device (an RFD with receiver disabled when idle), the coordinator cannot transmit the frame over the air immediately. Instead, the coordinator's Indirect Queue Manager buffers the packet in an indirect transmission queue, asserts the Frame Pending bit in subsequent beacon frames or ACK packets, and only releases the payload when the sleeping child wakes up and submits a Data Request polling frame.",
        "The coordinator also executes a background Health Monitor task: if an associated node fails to submit keepalive telemetry or poll for indirect data within a configurable timeout window (e.g., 3600 seconds), the node is flagged as STALE. The coordinator can initiate an active ping, reassign the slot, or gracefully purge the stale device to reclaim short addresses.",
        "By simulating this complete PAN Coordinator state machine in Python, embedded software architects gain hands-on mastery over the exact memory structures and packet queues that govern production-grade industrial mesh gateways.",
        "In industrial SCADA environments, managing the Indirect Transmission Queue requires sophisticated buffer eviction policies to prevent memory exhaustion on resource-constrained coordinator gateways. An industrial gateway may coordinate hundreds of sleepy sensor nodes, each generating asynchronous telemetry and alarm reports. If multiple network nodes experience extended sleep cycles or temporary RF obstructions, the coordinator's RAM buffer can quickly become congested with undelivered downstream packets.",
        "To maintain deterministic memory bounds, the coordinator implements Quality of Service (QoS) Priority Queuing and Time-To-Live (TTL) expiration. High-priority actuation commands (such as emergency valve shutdowns or fire alarm triggers) are assigned to a high-priority FIFO buffer that preempts routine configuration queries. Furthermore, every buffered packet is stamped with a TTL deadline; if a sleepy child fails to poll before the deadline expires, the stale packet is discarded with an EXPIRED event notification delivered to the cloud telemetry pipeline.",
        "Mastering these association tables, queue eviction mechanics, and indirect delivery channels equips firmware developers to construct carrier-grade IoT gateways capable of orchestrating thousands of nodes with rock-solid stability.",
        "Finally, the association subsystem generates structured diagnostics for network operations centers (NOC). By logging association transitions, channel switch counts, and packet retries, operations teams can identify degraded RF links, locate rogue interfering transmitters, and verify regulatory compliance across large enterprise campus deployments. These telemetry streams ensure total visibility, actionable diagnostic logs, and deterministic reliability throughout the entire wireless mesh lifecycle across diverse operating environments."
        "In Day 10, all physical and MAC layer components built across Block 2—from 802.15.4 binary framing and CRC-16 computation to unslotted CSMA/CA backoff arbitration and association state tracking—will culminate in our Milestone 2 Grand Capstone Engine."
    ]
    p5_example = "Think of a hotel concierge desk. The concierge keeps a guest ledger (Association Table). Each guest has their permanent passport ID (EUI-64) and their temporary room number (16-bit Short Address). If a courier delivers a parcel for a guest who is currently out sightseeing (sleepy end device), the concierge holds the parcel in the mail cubby (indirect buffer) and hands it to the guest only when they return to the desk and ask for their mail (Data Request)."
    p5_code = """# Complete IEEE 802.15.4 PAN Coordinator Association & Indirect Queue Subsystem
class FullPanCoordinatorSubsystem:
    def __init__(self, pan_id: int = 0xABCD):
        self.pan_id = pan_id
        # Association table: short_addr -> dict(eui64, is_ffd, is_sleepy, lqi, rssi, last_seen)
        self.association_table = {}
        # Reverse lookup: eui64 -> short_addr
        self.eui64_map = {}
        # Indirect packet buffer: short_addr -> list of queued packets
        self.indirect_buffers = {}
        self.next_short_addr = 0x0001
        
    def associate_node(self, eui64: str, is_ffd: bool, is_sleepy: bool, lqi: int = 255, rssi: float = -65.0) -> int:
        if eui64 in self.eui64_map:
            return self.eui64_map[eui64]
            
        short = self.next_short_addr
        self.next_short_addr += 1
        
        self.association_table[short] = {
            "eui64": eui64,
            "is_ffd": is_ffd,
            "is_sleepy": is_sleepy,
            "lqi": lqi,
            "rssi": rssi,
            "last_seen_epoch": 1000
        }
        self.eui64_map[eui64] = short
        self.indirect_buffers[short] = []
        return short
        
    def route_outbound_packet(self, dst_eui64: str, payload: bytes) -> dict:
        if dst_eui64 not in self.eui64_map:
            raise KeyError(f"Destination node {dst_eui64} not associated in PAN 0x{self.pan_id:04X}!")
            
        dst_short = self.eui64_map[dst_eui64]
        node_meta = self.association_table[dst_short]
        
        if node_meta["is_sleepy"]:
            # Buffer indirectly for sleeping device
            self.indirect_buffers[dst_short].append(payload)
            return {
                "action": "QUEUED_INDIRECT",
                "dst_short": f"0x{dst_short:04X}",
                "queue_depth": len(self.indirect_buffers[dst_short]),
                "frame_pending_bit": True
            }
        else:
            # Transmit immediately to line-powered or active receiver
            return {
                "action": "TRANSMIT_IMMEDIATE",
                "dst_short": f"0x{dst_short:04X}",
                "payload_bytes": len(payload),
                "frame_pending_bit": False
            }
            
    def handle_child_poll(self, child_short: int) -> dict:
        if child_short not in self.indirect_buffers or not self.indirect_buffers[child_short]:
            return {"action": "NO_DATA", "payload": None}
            
        queued_packet = self.indirect_buffers[child_short].pop(0)
        remaining = len(self.indirect_buffers[child_short])
        return {
            "action": "DELIVER_INDIRECT",
            "payload": queued_packet,
            "remaining_queued": remaining,
            "frame_pending_bit": remaining > 0
        }

coordinator = FullPanCoordinatorSubsystem(pan_id=0xABCD)

# Associate Router FFD (Line-powered, always active)
short_rtr = coordinator.associate_node("00:12:4B:00:00:AA:01", is_ffd=True, is_sleepy=False)
# Associate Sleepy Sensor RFD (Coin-cell powered, sleeping)
short_sens = coordinator.associate_node("00:12:4B:00:00:BB:02", is_ffd=False, is_sleepy=True)

print("=== IEEE 802.15.4 PAN Coordinator Association & Routing Subsystem ===")
print(f"Router Node Assigned: 0x{short_rtr:04X} (Active Receiver)")
print(f"Sensor Node Assigned: 0x{short_sens:04X} (Sleepy End Device)")

# 1. Route packet to Active Router
r1 = coordinator.route_outbound_packet("00:12:4B:00:00:AA:01", b"SET_ROUTING_METRIC=4")
print(f"\\nOutbound to Router: {r1['action']} -> Dest Short: {r1['dst_short']}")

# 2. Route packet to Sleepy Sensor (Must queue indirectly)
r2 = coordinator.route_outbound_packet("00:12:4B:00:00:BB:02", b"VALVE_ACTUATE_OFF")
print(f"Outbound to Sleepy Sensor: {r2['action']} -> Dest Short: {r2['dst_short']} | FramePending={r2['frame_pending_bit']}")

# 3. Sleepy sensor wakes up and polls for data
poll_res = coordinator.handle_child_poll(short_sens)
print(f"\\nSensor Wakes & Polls -> {poll_res['action']}: Payload = '{poll_res['payload'].decode()}' (More Pending={poll_res['frame_pending_bit']})")
"""
    p5_codeNotes = [
        "Implements FullPanCoordinatorSubsystem tracking node association and capabilities.",
        "Differentiates routing between active receivers (immediate TX) and sleepy endpoints (indirect queue).",
        "Demonstrates child poll data retrieval and Frame Pending bit management."
    ]
    p5_tryIt = "Queue two consecutive packets for the sleepy sensor and verify that the first poll reports frame_pending_bit=True."
    p5_check = {
        "question": "How does an IEEE 802.15.4 PAN Coordinator deliver downstream telemetry packets to an associated Sleepy End Device whose receiver is disabled during idle periods?",
        "options": [
            "The coordinator buffers the packet in an indirect transmission queue, asserts the Frame Pending bit, and delivers the frame when the child node polls with a Data Request.",
            "The coordinator increases transmit power to 100 Watts to penetrate the disabled receiver.",
            "The coordinator commands the radio to broadcast the packet over cellular LTE.",
            "Packets cannot be delivered to sleepy devices and must be discarded."
        ],
        "answer": 0,
        "why": "Option 0 accurately describes the standard indirect data transfer mechanism: because sleepy nodes keep their radios powered down to save battery, coordinators buffer downstream traffic in an indirect queue. The coordinator asserts the Frame Pending bit in beacons and ACKs; when the child awakens and sends a Data Request, the coordinator transmits the buffered packet. Options 1, 2, and 3 are technically invalid."
    }

    day9_data = {
        "coursePrefix": "iot_net",
        "day": 9,
        "title": "PAN Coordination, Association Handshakes, 16/64-Bit Addressing & Network Synchronization",
        "goal": "Master IEEE 802.15.4 network coordination: Energy Detection & Active channel scanning, EUI-64 vs 16-bit Short addressing, 4-way association handshakes, orphan recovery, and indirect packet buffering for sleepy endpoints.",
        "minutes": 38,
        "recap": "In Day 8, we engineered CSMA/CA channel contention and backoff state machines. Today in Day 9, we construct network-level coordination: autonomous PAN formation, device association, and indirect message queuing.",
        "parts": [
            {
                "title": "PAN Formation & Channel Scanning: ED, Active & Passive Scans",
                "say": p1_say,
                "example": p1_example,
                "code": p1_code,
                "output": "",
                "codeNotes": p1_codeNotes,
                "tryIt": p1_tryIt,
                "check": p1_check
            },
            {
                "title": "Address Space & Translation: 64-Bit Extended vs 16-Bit Short Addresses",
                "say": p2_say,
                "example": p2_example,
                "code": p2_code,
                "output": "",
                "codeNotes": p2_codeNotes,
                "tryIt": p2_tryIt,
                "check": p2_check
            },
            {
                "title": "The 4-Way Association Handshake Protocol",
                "say": p3_say,
                "example": p3_example,
                "code": p3_code,
                "output": "",
                "codeNotes": p3_codeNotes,
                "tryIt": p3_tryIt,
                "check": p3_check
            },
            {
                "title": "Network Maintenance: Disassociation, Orphan Scans & Realignment",
                "say": p4_say,
                "example": p4_example,
                "code": p4_code,
                "output": "",
                "codeNotes": p4_codeNotes,
                "tryIt": p4_tryIt,
                "check": p4_check
            },
            {
                "title": "Full PAN Coordinator Association Table & Routing Simulator",
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
            "Autonomous PAN formation utilizes Energy Detection (ED) scans to eliminate noisy channels followed by Active Scans to avoid duplicate PAN ID collisions.",
            "Dynamic 16-bit Short Addressing compresses dual MAC addressing overhead from 16 bytes to 4 bytes, saving up to 12 bytes per packet (9.4% MTU expansion).",
            "The 4-way association handshake decouples request acknowledgment from address allocation through indirect Data Request polling.",
            "Nodes that miss 4 consecutive beacons declare SYNC_LOSS and execute Orphan Scans to quickly realign with their parent without full re-association.",
            "PAN Coordinators manage indirect queues and Frame Pending bits to deliver downstream packets to Sleepy End Devices upon wakeup."
        ],
        "projectStep": {
            "title": "IEEE 802.15.4 Network Formation & Coordinator Engineering",
            "steps": [
                "Implement the two-phase ED and Active Channel scanner to select clean channels and uncontested PAN IDs.",
                "Construct the 16-bit Short Address allocator enforcing special address reservations.",
                "Model the complete 4-step Association Handshake with indirect response buffering.",
                "Implement the aMaxLostBeacons sync loss detector and Coordinator Realignment recovery engine.",
                "Synthesize the FullPanCoordinatorSubsystem with indirect message queuing for sleepy end devices."
            ]
        }
    }

    # Execute all code snippets dynamically to guarantee 100% exact output match
    for idx, p in enumerate(day9_data["parts"]):
        proc = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"Day 9 Part {idx+1} execution error:\n{proc.stderr}")
            sys.exit(1)
        p["output"] = proc.stdout.strip()

    wcs = [len(" ".join(p["say"]).split()) for p in day9_data["parts"]]
    print(f"Day 9 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_net_day9.json", "w", encoding="utf-8") as f:
        json.dump(day9_data, f, indent=2, ensure_ascii=False)
    print("Successfully built scripts/iot_net_day9.json!")

if __name__ == '__main__':
    build_day9()
