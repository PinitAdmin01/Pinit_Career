import json
import subprocess
import sys
import os

# Add scripts directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from test_day54_snippets import p1_code, p2_code, p3_code, p4_code, p5_code

def get_output(code):
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{res.stderr}")
    return res.stdout.replace("\r\n", "\n").strip()

p1_out = get_output(p1_code)
p2_out = get_output(p2_code)
p3_out = get_output(p3_code)
p4_out = get_output(p4_code)
p5_out = get_output(p5_code)

part1_say = [
    "Welcome to Day 54 of our IoT Wireless Networks, Protocols, and Edge Mesh Infrastructure curriculum. Today, we advance into the premier echelon of mission-critical deterministic operational technology: Industrial Ethernet and Time-Sensitive Networking, universally recognized across modern engineering as TSN. Standard IEEE 802.3 Ethernet revolutionized enterprise telecommunications with high bandwidth, ubiquitous hardware availability, and low transceiver costs. However, classic CSMA/CD Ethernet and conventional store-and-forward Ethernet bridges suffer from a fundamental, fatal flaw in closed-loop motion control, robotic actuation, automotive drivetrain control, and turbine governor applications: non-deterministic queuing latency and unpredictable packet jitter. Under standard 802.1Q priority queuing, higher-priority frames can still be severely delayed behind a maximum-transmission-unit 1518-byte low-priority jumbo frame that has already begun serialization onto the physical wire, introducing up to 121 microseconds of tail latency on a 100 Mbps link. Time-Sensitive Networking, developed by the IEEE 802.1 TSN Task Group, transforms Ethernet into a strictly deterministic communication backbone capable of microsecond-bounded latency and zero packet loss due to queue congestion.",
    "The core mechanism responsible for deterministic traffic scheduling in TSN is IEEE 802.1Qbv: Enhancements for Scheduled Traffic, colloquially known as the Time-Aware Shaper (TAS). The Time-Aware Shaper operates on the foundational concept of repeating, highly synchronized cyclical time slices managed by a Gate Control List, or GCL. In an 802.1Qbv bridge port, each of the eight traffic class egress queues (Traffic Class 0 through 7) is gated by a discrete binary state: Open (1) or Closed (0). The Gate Control List is an ordered sequence of programmatic entries, where each entry specifies an administrative gate state bitmask and an execution duration in nanoseconds or microseconds. When a cycle begins, the TAS hardware advances through the GCL entries according to a global clock reference. During an allocated time window dedicated to high-priority scheduled traffic—such as isochronous motion feedback and synchronized servo torque commands—the transmission gates for all lower-priority, best-effort queues are forced closed.",
    "Closing the best-effort gates alone is insufficient to guarantee that an express frame is never delayed upon arrival. A critical engineering invariant in IEEE 802.1Qbv is the Guard Band. If a lower-priority Best Effort frame (e.g., standard HTTP telemetry or firmware distribution) begins transmitting 2 microseconds before an express scheduled time slice opens, the physical transmission medium remains occupied until that frame finishes serializing. To prevent this priority inversion, the Time-Aware Shaper enforces an administrative guard band immediately preceding every scheduled traffic window. During the guard band duration—equal to the transmission time of the largest allowable maximum transmission unit frame on the link (e.g., 12.3 microseconds on Gigabit Ethernet or 123 microseconds on Fast Ethernet)—no new best-effort frames are permitted to begin transmission. If a queued frame cannot completely finish serializing before the scheduled window begins, its gate is closed in advance and transmission is deferred, guaranteeing that the wire is completely silent and idle the exact nanosecond the scheduled express window opens.",
    "In industrial manufacturing plants, wind turbine arrays, automotive electronic control units (ECUs), and avionics flight surfaces, configuring the Gate Control List requires rigorous network calculus and global cycle synthesis. Control engineers configure the hyper-period cycle time (typically ranging from 250 microseconds to 2 milliseconds), allocate isolated time slots for cyclic control loops, allocate dynamic shared bandwidth for asynchronous diagnostic queries, and insert protective guard bands. Let us inspect the Python simulation below, where we implement an IEEE 802.1Qbv Time-Aware Shaper with a 1000-microsecond hyper-period, programmed with high-priority scheduled control slots, best-effort windows, and a 200-microsecond guard band that deterministically isolates critical servo commands from bursty background video telemetry.",
    "Observe how the TimeAwareShaper class evaluates the modulo cycle offset of each ingress frame. If a high-priority packet tagged with Traffic Class 7 arrives at offset 50 us, it falls directly into the express window where its gate is open (bitmask 0xC0), allowing instantaneous transmission. Conversely, when a background camera frame arrives at offset 850 us, the active GCL entry corresponds to the guard band (gate mask 0x00), immediately deferring transmission. This mathematical guarantee of bounded delay forms the bedrock of modern industrial automation and Cyber-Physical Systems (CPS)."
]

part2_say = [
    "While the IEEE 802.1Qbv Time-Aware Shaper successfully guarantees zero-jitter deterministic delivery for cyclic traffic, its reliance on conservative guard bands introduces significant bandwidth inefficiency on constrained 100 Mbps and 1 Gbps industrial links. In a network carrying standard 1518-byte MTU Ethernet frames, the guard band must reserve 121 microseconds of dead channel time before every cyclic express slot. If a manufacturing automation cell runs a fast 500-microsecond control cycle, reserving 121 microseconds of guard band consumes over 24% of the entire link's theoretical bandwidth without transmitting a single bit of operational payload. To overcome this limitation and maximize link utilization, the IEEE 802.1 TSN working group collaborated with IEEE 802.3 to introduce IEEE 802.1Qbu and IEEE 802.3br: Frame Preemption and Interspersing Express Traffic (IET).",
    "Frame Preemption fundamentally alters the atomicity of Ethernet frame transmission by dividing the physical link layer into two distinct Media Access Control (MAC) sublayers: an Express MAC (eMAC) and a Preemptible MAC (pMAC), coordinated by a MAC Merge Sublayer (MMS). Express traffic—originating from critical time-sensitive queues—connects directly to the eMAC and possesses immediate preemption authority. Best-effort traffic, file transfers, and non-real-time industrial IoT telemetry route through the pMAC. When the physical line is idle, pMAC frames transmit normally. However, when an express frame arrives in the eMAC buffer while a low-priority pMAC frame is in the middle of being serialized onto the wire, the MAC Merge Sublayer immediately halts the pMAC transmission, generates a specialized intermediate checksum, and releases the wire to the express frame with a preemption latency under 100 nanoseconds.",
    "The physical mechanism enabling preemption without causing receiver frame corruption is the encapsulation of fragmented pMAC data into specialized micro-packets known as mPackets. In standard Ethernet, every frame begins with an 8-byte preamble ending in the Start Frame Delimiter (SFD) byte 0xD5. In an 802.3br preemptible link, the MAC Merge Sublayer modifies the preamble bytes to indicate mPacket fragmentation. The initial fragment of a preempted frame is designated with a Start mPacket Delimiter (SMD-S), which encodes a cyclic fragment count (0 through 3). The end of the initial fragment is terminated by a 4-byte CRC extension known as the mCRC. The express frame is then transmitted using an Express Delimiter (SMD-E) and its standard 32-bit Frame Check Sequence (FCS). Once the express transmission terminates, the MAC Merge Sublayer resumes the preempted low-priority frame, tagging the continuation fragment with a Continuation Delimiter (SMD-C) and the matching fragment count.",
    "At the receiving bridge or endpoint, the MAC Merge Sublayer validates the mCRC of the initial fragment, verifies the continuity of the fragment counter on subsequent SMD-C mPackets, strips the mPacket preambles, and seamlessly reconstitutes the original contiguous Ethernet payload before forwarding it to higher-layer protocol stacks. To prevent fragment proliferation and hardware buffer thrashing, IEEE 802.3br enforces a minimum fragment size rule: a frame cannot be preempted unless at least 64 bytes of payload have been serialized, and the remaining payload fragment must also be at least 64 bytes. In our Python implementation below, we build an exact IEEE 802.1Qbu / 802.3br MAC Merge Sublayer simulation that preempts an in-flight 184-byte bulk telemetry frame, transmits an emergency robot stop command with sub-microsecond latency, and verifies bit-perfect reassembly integrity.",
    "Inspect the resulting output: the initial fragment is framed with SMD-S0 (hex delimiter ending in 0x66) carrying the first 64 bytes, followed immediately by the express emergency stop packet marked with SMD-E (ending in 0xE6). As soon as the express packet finishes, the continuation fragment SMD-C0 (ending in 0x77) serializes the remaining 120 bytes. The receiver verifies that the total reassembled payload exactly matches the original 184 bytes, achieving seamless transmission with zero dead guard band overhead."
]

part3_say = [
    "Neither Time-Aware Shaper GCLs nor Frame Preemption mechanisms can function across a distributed multi-switch factory floor without an ultra-precise, synchronized global clock reference. If the internal crystal oscillator of Switch A drifts by even 10 microseconds relative to Switch B, the scheduled express gates will open out of phase, resulting in catastrophic packet buffering, queue overflow, and dropped motion control cycles. In standard enterprise IP networks, the Network Time Protocol (NTP) provides millisecond-level time synchronization across wide-area networks over UDP port 123. However, NTP's reliance on software timestamping in the operating system kernel and asymmetric internet routing makes it entirely unsuitable for industrial robotics, where microsecond and sub-microsecond synchronization is an absolute requirement. To solve this, Time-Sensitive Networking mandates IEEE 802.1AS: Generalized Precision Time Protocol (gPTP).",
    "IEEE 802.1AS is a tightly constrained, highly optimized profile of the IEEE 1588 Precision Time Protocol specifically tailored for bridged local area networks and automotive Ethernet. In a gPTP network, all participating bridges and endpoint devices participate in an automated election known as the Best Master Clock Algorithm (BMCA) to elect a single grandmaster clock source, typically disciplined by a GPS/GNSS receiver or atomic rubidium oscillator. What elevates gPTP above legacy NTP is hardware cross-timestamping at the physical PHY layer. When a gPTP frame crosses the Media Independent Interface (MII) between the MAC controller and the Ethernet transceiver, dedicated hardware registers latch the exact nanosecond tick of the local counter. This eliminates all software stack overhead, operating system interrupt jitter, and context switching latency from the timing calculation.",
    "To measure and compensate for signal propagation delay across copper cables and optical fibers, IEEE 802.1AS utilizes the Peer-to-Peer Delay Mechanism, avoiding the end-to-end request-response mechanism used in standard IEEE 1588. Every port continuously measures the transit delay to its direct link partner by exchanging Pdelay_Req, Pdelay_Resp, and Pdelay_Resp_Follow_Up messages. Let t1 represent the nanosecond hardware egress timestamp of Pdelay_Req at the local requester, t2 the ingress timestamp at the peer responder, t3 the egress timestamp of Pdelay_Resp from the peer responder, and t4 the ingress timestamp of Pdelay_Resp back at the requester. The peer propagation delay D is calculated as [(t4 - t1) - (t3 - t2)] / 2. Because this calculation occurs strictly between adjacent peers, transparent bridges do not burden the Grandmaster with unicast delay requests, allowing gPTP networks to scale seamlessly to hundreds of switches.",
    "Once peer cable delays and internal bridge residence times are established, the Grandmaster periodically broadcasts Sync messages accompanied by Follow_Up frames containing the precise transmission timestamp. Each downstream bridge adjusts its local synchronized time by subtracting the cumulative propagation and bridge delays. Through this continuous, hardware-driven synchronization loop, IEEE 802.1AS maintains time synchronization across all switches and industrial controllers within a tight envelope of less than 100 nanoseconds of jitter. Below, we implement the mathematical peer delay and master clock drift compensation algorithms in pure Python, demonstrating how nanosecond-precision hardware timestamps converge to maintain perfect deterministic alignment.",
    "Notice the mathematical precision in our Python execution: the peer delay between ports calculates cleanly to 460.0 nanoseconds across the link, while the relative master clock drift is resolved to 750.0 nanoseconds. With sub-microsecond alignment verified as true, all switches across the production cell share an identical time horizon, enabling perfectly synchronized GCL gate openings across every switch fabric. Without this level of precision timing, time-aware shaping collapses into asynchronous buffering, leading to buffer blooming, missed servo cycles, and hazardous safety shutdowns. gPTP provides the universal heartbeat that makes cyber-physical determinism possible."
]

part4_say = [
    "Having established the deterministic physical and link layers of Time-Sensitive Networking—TAS scheduling, frame preemption, and gPTP clock synchronization—we now bridge the gap to the operational technology application layers that govern industrial automation. In legacy fieldbus topologies, manufacturers were locked into proprietary serial protocols like PROFIBUS DP, DeviceNet, or Modbus Plus. With the advent of industrial automation modernisation, these systems transitioned to Industrial Ethernet. Two dominant international standards emerged to command the modern factory floor: PROFINET (Process Field Network), standardized by PROFIBUS & PROFINET International (PI) under IEC 61158 / IEC 61784, and EtherNet/IP (Ethernet Industrial Protocol), standardized by ODVA utilizing the Common Industrial Protocol (CIP).",
    "PROFINET operates in distinct performance tiers to balance computing complexity against latency requirements. PROFINET NRT (Non-Real-Time) utilizes standard TCP/IP and UDP/IP stacks for engineering commissioning, parameterization, and diagnostic asset management. However, for cyclic input/output process data exchange between Programmable Logic Controllers (PLCs) and remote I/O distributed blocks, standard IP routing overhead is unacceptable. PROFINET RT (Real-Time) bypasses the entire transport and network layer (TCP/IP) altogether. PROFINET RT frames are encapsulated directly within standard Ethernet frames using the dedicated EtherType 0x8892. By stripping the IP and UDP headers, PROFINET RT reduces protocol processing overhead, achieving deterministic cycle times between 1 and 10 milliseconds directly in software without specialized hardware.",
    "For ultra-high-speed synchronization—such as multi-axis CNC machines, packaging robotics, and printing presses requiring cycle times below 250 microseconds with sub-microsecond jitter—PROFINET introduces PROFINET IRT (Isochronous Real-Time). Historically, PROFINET IRT achieved this by deploying proprietary Application Specific Integrated Circuits (ASICs) like Siemens ERTEC chips that divided the communication cycle into an isochronous real-time phase and an open phase. In modern automation, PROFINET is actively converging with IEEE 802.1 TSN. The PROFINET specification version 2.4 incorporates IEEE 802.1Qbv, IEEE 802.1AS, and IEEE 802.1CB frame replication, allowing standard TSN silicon to execute PROFINET RT and IRT without proprietary ASICs. Within the PROFINET RT frame, the FrameID field dictates message priority and direction: 0x8000 through 0xBBFF identifies cyclic real-time I/O, while 0xFC01 through 0xFEFF is reserved for acyclic alarms and parameterization.",
    "Conversely, EtherNet/IP encapsulates the Common Industrial Protocol (CIP) directly over TCP/IP (port 44818) for explicit messaging (parameter transfers and diagnostics) and over UDP/IP (port 2222) for implicit I/O cyclic messaging. In an EtherNet/IP architecture, producer-consumer models broadcast sensor values to multiple listening controllers simultaneously. As EtherNet/IP embraces TSN, ODVA has defined CIP over TSN specifications that align CIP motion profiles directly with 802.1Qbv GCL schedules. Engineers must comprehend how these application frames map onto Layer 2 priority tags (PCP values 0 through 7) so that TSN switches route them into the designated express and scheduled traffic queues rather than best-effort FIFO queues. When an edge gateway interfaces with legacy machinery, it often bridges CIP and PROFINET frames across physical boundaries into unified TSN streams, encapsulating legacy operational parameters within modern deterministic flows.",
    "Below, we construct an Industrial Ethernet parser in pure Python that models PROFINET RT cyclic data framing, extracts cycle counters and data status flags, and verifies real-time process integrity. Examine the Python parser output: the frame is tagged with EtherType 0x8892 and assigned FrameID 0x8001. The payload unpacks 43 bytes of real-time drive telemetry, cycle counter 4120, and validates the DataStatus byte indicating primary provider status in PLC Run mode. By decoding these Layer 2 structures directly, edge gateways can ingest and monitor industrial process telemetry without introducing multi-millisecond network stack delays, bridging the critical chasm between field controllers and edge intelligence while maintaining microsecond determinism across factory floor subnets. This direct Layer 2 parsing is essential for deterministic edge processing, providing engineers with deep visibility into active physical automation loops without disturbing cycle deadlines.",
    "Understanding these protocol structures allows systems architects to configure TSN bridge filters, ensuring that high-frequency cyclic I/O frames are granted dedicated express queues while acyclic engineering requests are constrained within best-effort windows."
]

part5_say = [
    "Welcome to the masterclass capstone for Day 54. In this intensive synthesis, we consolidate every layer of Industrial Ethernet and Time-Sensitive Networking into a complete, end-to-end deterministic TSN Switch Simulator. High-performance industrial IoT engineers must master not only individual standards like 802.1Qbv or 802.1AS in isolation, but how these systems interact dynamically under heavy network congestion. In a production automotive manufacturing plant, high-definition optical inspection cameras stream megabytes of uncompressed video across the exact same physical cabling that carries microsecond-critical multi-axis robotic welding synchronization pulses. Without TSN orchestration, the video stream would saturate bridge buffers, causing safety estop trips and bringing the entire assembly line to a halt.",
    "Our masterclass switch engine models the complete deterministic pipeline within an industrial cell switch. First, the switch core synchronizes its local clock against the network Grandmaster using IEEE 802.1AS gPTP peer-to-peer delay compensation, locking clock drift to within a 100-nanosecond tolerance envelope. Second, the switch instantiates an IEEE 802.1Qbv Time-Aware Shaper programmed with a cyclical Gate Control List: an Express Reserved Slot (0 to 400 microseconds, Traffic Classes 6 and 7 open), a Best-Effort Transmission Window (400 to 850 microseconds, Traffic Classes 0 through 3 open), and an administrative Guard Band (850 to 1000 microseconds, all gates closed) to prevent frame overrun.",
    "Third, the switch processes a heterogeneous ingress stream containing urgent robot servo synchronization pulses, cyclic PROFINET RT I/O telemetry, standard factory historian telemetry, and bursty camera image data. Frames tagged as Express Traffic bypass normal queuing delays via simulated MAC Merge sublayer preemption, while scheduled traffic is deterministically evaluated against the active GCL time slice. If an asynchronous camera burst arrives during the protective guard band, the switch intelligently blocks transmission to protect the upcoming express hyper-period, logging zero jitter and zero packet loss for the critical control loops.",
    "Fourth, the engine integrates an autonomous traffic auditing monitor that verifies zero dropped packets for scheduled control streams, exact timing bounds for express frames, and complete isolation of best-effort traffic. The switch maintains per-queue hardware performance counters, monitoring queue depth, preemption frequency, and guard band violations. This real-time diagnostic telemetry allows site reliability engineers to dynamically reconfigure GCL schedules over NETCONF/YANG without disrupting ongoing production operations.",
    "Fifth, the engine bridges operational field events directly into upstream SCADA and enterprise cloud systems. By translating cyclic PROFINET RT telemetry and deterministic TSN stream status into structured operational events, industrial plants achieve seamless end-to-end observability from the physical sensor diaphragm to executive digital twins. This convergence eliminates data silos between factory floor machines and corporate ERP platforms, empowering predictive maintenance and autonomous resource allocation without jeopardizing hard real-time guarantees.",
    "Carefully review the complete masterclass implementation below. Notice how the switch tracks precise transmission metrics across express passes, scheduled passes, and guard drops. When executed, the engine demonstrates complete deterministic isolation, guaranteeing that robotic safety cycles execute with deterministic latency. Upon successful validation, the engine latches its industrial verification token TSN_DETERMINISTIC_NETWORK_ENGINE_GRADE_A_PLUS_CERTIFIED, marking your mastery of modern industrial deterministic networking.",
    "Observe the summary statistics: express robot frames pass immediately, cyclic PROFINET frames execute during scheduled windows, background telemetry streams during best-effort slices, and the disruptive camera burst is dropped or buffered during the guard band. This guarantees 100% deterministic isolation, proving that modern TSN can unify operational technology and information technology onto a single robust Ethernet fabric without requiring air-gapped physical networks. As industrial edge deployments evolve, this deterministic foundation enables software-defined automation, edge AI inferencing, and real-time cloud coordination across enterprise manufacturing ecosystems with verified zero jitter."
]

# Build the complete day-54 dictionary
day54_obj = {
    "day": 54,
    "title": "Industrial Ethernet & Time-Sensitive Networking (TSN): 802.1Qbv TAS, 802.1Qbu Preemption & gPTP",
    "coursePrefix": "iot_net",
    "parts": [
        {
            "title": "IEEE 802.1Qbv Time-Aware Shaper (TAS) & Gate Control Lists (GCL)",
            "say": part1_say,
            "code": p1_code,
            "output": p1_out,
            "codeNotes": [
                "TimeAwareShaper models the IEEE 802.1Qbv Gate Control List (GCL) schedule using periodic cycle offsets.",
                "Each GCL entry defines a duration in microseconds and an 8-bit gate mask corresponding to 8 priority traffic classes (TC0-TC7).",
                "A dedicated Guard Band (gate mask 0x00) isolates upcoming express traffic windows from low-priority queue overruns."
            ],
            "tryIt": "Modify the TimeAwareShaper schedule to reduce the hyper-period cycle from 1000 us to 500 us and verify that high-priority robot commands still transmit without latency.",
            "check": {
                "question": "What is the primary function of an administrative Guard Band in an IEEE 802.1Qbv Time-Aware Shaper?",
                "options": [
                    "To withhold low-priority frame transmissions whose remaining serialization time would overrun into the scheduled express traffic window.",
                    "To encrypt industrial Ethernet frames using AES-128 before forwarding them across public internet links.",
                    "To generate periodic heartbeat pings between downstream Modbus RTU sensors and the central cloud broker.",
                    "To compress Ethernet payload headers by replacing 32-bit IP addresses with 16-bit MAC addresses."
                ],
                "answer": 0,
                "explanation": "The Guard Band ensures that no lower-priority best-effort frame is allowed to start transmitting if it cannot completely finish before the scheduled express traffic window opens, guaranteeing zero jitter for time-critical frames."
            }
        },
        {
            "title": "IEEE 802.1Qbu & 802.3br Frame Preemption & mPacket Framing",
            "say": part2_say,
            "code": p2_code,
            "output": p2_out,
            "codeNotes": [
                "FramePreemptionEngine splits a preemptible frame (pMAC) into micro-packet fragments (mPackets) when express traffic arrives.",
                "SMD-S0 delimiter marks the initial fragment, terminated with a 32-bit mCRC checksum.",
                "SMD-C0 delimiter marks the continuation fragment, allowing the receiving MAC merge sublayer to reconstruct the original frame."
            ],
            "tryIt": "Change the split_offset parameter in fragment_preemptible_frame from 64 to 96 bytes and observe how payload lengths and checksum integrity are recalculated.",
            "check": {
                "question": "In IEEE 802.1Qbu / 802.3br Frame Preemption, what is the role of the MAC Merge Sublayer (MMS)?",
                "options": [
                    "It coordinates the Express MAC (eMAC) and Preemptible MAC (pMAC), interrupting low-priority frame transmission and packaging fragments into mPackets.",
                    "It aggregates multiple Modbus RS-485 serial buses into a single wireless Thread 1.3 mesh border router.",
                    "It converts unencrypted HTTP REST payloads into binary OPC UA Unified Architecture encoded messages.",
                    "It synchronizes real-time operating system task priority inversion using standard mutex locking primitives."
                ],
                "answer": 0,
                "explanation": "The MAC Merge Sublayer sits between the physical layer and two distinct MAC controllers (eMAC and pMAC), dynamically preempting pMAC transmissions and managing mPacket framing."
            }
        },
        {
            "title": "IEEE 802.1AS Generalized Precision Time Protocol (gPTP) Clock Synchronization",
            "say": part3_say,
            "code": p3_code,
            "output": p3_out,
            "codeNotes": [
                "GeneralizedPTP implements the Peer-to-Peer Delay Mechanism using hardware ingress and egress timestamps (t1, t2, t3, t4).",
                "Propagation Delay formula [(t4 - t1) - (t3 - t2)] / 2 cancels out responder processing latency to isolate true cable delay.",
                "Master Clock Offset formula (t2 - t1) - propagation_delay calculates local oscillator drift with sub-microsecond precision."
            ],
            "tryIt": "Increase the measured round-trip timestamps to simulate a 100-meter copper link and observe how the calculated peer delay increases while clock offset maintains nanosecond accuracy.",
            "check": {
                "question": "Why does IEEE 802.1AS gPTP utilize a Peer-to-Peer (P2P) delay mechanism rather than an End-to-End (E2E) delay mechanism?",
                "options": [
                    "P2P delay is calculated strictly between adjacent network link partners, eliminating Grandmaster query bottlenecks and scaling across large bridge topologies.",
                    "P2P delay allows sensors to communicate over wireless Bluetooth Low Energy channels without requiring an IP router.",
                    "P2P delay relies on GPS time signals directly received by every individual Ethernet PHY chip.",
                    "P2P delay eliminates the need for nanosecond hardware timestamping inside the Ethernet MAC layer."
                ],
                "answer": 0,
                "explanation": "The Peer-to-Peer delay mechanism measures propagation delay on every hop independently between direct neighbors. This avoids flooding the Grandmaster with delay requests and allows rapid topology re-convergence."
            }
        },
        {
            "title": "Industrial Ethernet Protocols: PROFINET Real-Time (RT) & EtherNet/IP CIP Framing",
            "say": part4_say,
            "code": p4_code,
            "output": p4_out,
            "codeNotes": [
                "IndustrialEthernetParser parses PROFINET RT frames encapsulated directly over Ethernet using EtherType 0x8892.",
                "FrameID field (0x8000-0xBBFF) defines cyclic real-time IO data exchange without TCP/IP overhead.",
                "DataStatus and TransferStatus trailing bytes convey PLC run-mode states and IO provider validity flags."
            ],
            "tryIt": "Add a new IO data field representing motor vibration telemetry into the simulated IO payload and verify that the parser unpacks the payload length correctly.",
            "check": {
                "question": "How does PROFINET Real-Time (RT) achieve deterministic low-latency communication compared to standard TCP/IP networking?",
                "options": [
                    "It bypasses the network and transport layers (IP and UDP/TCP) entirely, encapsulating cyclic I/O data directly into Ethernet Layer 2 frames with EtherType 0x8892.",
                    "It encrypts payloads using asymmetric RSA-4096 keys at the application presentation layer.",
                    "It runs exclusively over Zigbee 802.15.4 wireless mesh links with guaranteed carrier sensing.",
                    "It compresses JSON telemetry into base64 strings transmitted over WebSockets."
                ],
                "answer": 0,
                "explanation": "PROFINET RT strips away TCP/IP protocol stack overhead by placing cyclic I/O data directly into Layer 2 Ethernet frames with EtherType 0x8892, enabling millisecond-level determinism in standard software."
            }
        },
        {
            "title": "Masterclass Synthesis: Deterministic TSN Switch Simulator & Verification Token",
            "say": part5_say,
            "code": p5_code,
            "output": p5_out,
            "codeNotes": [
                "DeterministicTsnSwitchEngine integrates IEEE 802.1AS clock sync, 802.1Qbv TAS scheduling, and 802.1Qbu preemption into a unified core.",
                "Tracks fine-grained operational metrics including express passes, scheduled passes, and guard-blocked traffic drops.",
                "Guarantees that critical robot and PLC frames experience zero queue jitter while best-effort telemetry is held during guard windows."
            ],
            "tryIt": "Run the switch simulator with an incoming stream of 10 high-rate camera bursts and observe how the guard band prevents them from interfering with scheduled robot sync frames.",
            "check": {
                "question": "What is the primary architectural benefit of converging industrial operational technology (OT) protocols like PROFINET with IEEE Time-Sensitive Networking (TSN)?",
                "options": [
                    "It enables hard real-time motion control and best-effort enterprise IT traffic to coexist deterministically on a single unified physical Ethernet infrastructure without interference.",
                    "It replaces all local industrial sensors with cloud-hosted virtual digital twins accessible solely via 5G cellular modems.",
                    "It converts all factory actuators from three-phase AC electricity to low-power DC battery systems.",
                    "It eliminates the need for physical Ethernet cables by converting all industrial machinery to 2.4 GHz Wi-Fi."
                ],
                "answer": 0,
                "explanation": "TSN enables OT/IT network convergence: critical isochronous control streams and high-bandwidth best-effort IT data share the exact same physical cabling without compromising determinism or safety."
            }
        }
    ],
    "summary": [
        "IEEE 802.1Qbv Time-Aware Shaper (TAS) enforces deterministic cyclical time slicing using Gate Control Lists (GCL) across 8 traffic classes.",
        "Administrative Guard Bands isolate high-priority express windows, withholding low-priority frames to prevent transmission overruns and jitter.",
        "IEEE 802.1Qbu and 802.3br Frame Preemption enables express traffic to preempt low-priority frames in under 100 ns, encapsulating fragments into mPackets.",
        "IEEE 802.1AS Generalized Precision Time Protocol (gPTP) synchronizes distributed bridge clocks with sub-100 ns accuracy via hardware MII cross-timestamping and peer-to-peer delay compensation.",
        "PROFINET RT (EtherType 0x8892) and EtherNet/IP CIP over TSN converge operational technology (OT) with enterprise IT on a unified, deterministic Ethernet backbone."
    ]
}

# Verify word count per part
total_words = 0
for idx, part in enumerate(day54_obj["parts"]):
    wc = sum(len(p.split()) for p in part["say"])
    total_words += wc
    print(f"Part {idx+1} word count: {wc} words")
    assert wc >= 580, f"Part {idx+1} has only {wc} words (< 580)"

print(f"Day 54 total word count: {total_words} words (Requirement: >= 3000)")
assert total_words >= 3000

with open("scripts/day-54-data.json", "w", encoding="utf-8") as f:
    json.dump(day54_obj, f, indent=2, ensure_ascii=False)

print("Saved scripts/day-54-data.json successfully!")
