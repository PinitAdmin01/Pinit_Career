import json

with open("scripts/day-48-data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

p1_extra = [
    "To understand the operational resilience of Thread partition governance, consider the mathematical and state-machine dynamics that govern Leader election and partition reconciliation. When a Thread mesh experiences physical segmentation—such as when structural steel doors close or RF jamming disrupts wireless links between clusters—the disconnected segment detects the absence of MLE advertisements from the original Leader. Nodes in the isolated segment enter the detached state, initiate a random backoff timeout to avoid synchronized contention, and if no neighboring Leader is discovered, the most senior router autonomously promotes itself to Leader of a new partition. It generates a new 32-bit Partition ID with an incremented weight metric, updates its Network Data version counter, and begins arbitrating 16-bit RLOC16 addresses for its sub-mesh.",
    "When physical radio propagation is later restored, the two partitions encounter each other's periodic MLE Advertisements. Thread resolves partition collisions deterministically: the partition with the higher Partition Weight takes precedence and absorbs the secondary partition. If partition weights are identical, the partition with the larger numerical Partition ID prevails. The losing Leader immediately abdicates its leadership, steps down to a Child or Router role, and commands all downstream routers and end devices in its former partition to attach to the winning partition and reacquire valid RLOC16 addresses, ensuring seamless network healing without administrative intervention."
]

p2_extra = [
    "The Mesh Link Establishment (MLE) security and route propagation mechanism relies on strict cryptographic validation to protect against spoofing and replay attacks. Every MLE Link Request contains an arbitrary 4-byte Challenge TLV generated from a hardware random number generator. The receiving neighbor cannot simply reply with an unverified acknowledgment; it must compute an MLE Link Accept message that embeds the exact challenge token within a Response TLV, alongside its own incoming Challenge TLV and its current 32-bit Link-layer Frame Counter. Both nodes verify that the frame counter is strictly greater than the last recorded counter for that neighbor, completely immunizing the link establishment against replay attacks on the physical wireless medium.",
    "In addition to point-to-point authentication, MLE periodically disseminates the entire network topology via Route64 TLVs embedded in MLE Advertisements. The Route64 TLV encodes a 64-bit router mask where each bit indicates whether a specific Router ID (0 to 63) is active in the mesh. Following the mask, each active router's entry specifies an incoming route cost (1 to 15, where 16 represents infinity/unreachable) and an outgoing link quality indicator (LQI 0 to 3). Routers execute an incremental Bellman-Ford distance-vector algorithm using these Route64 records: when a router receives an advertisement from neighbor N showing path cost C to destination D, the router computes its updated path cost as Cost(N) + C. If the new sum is lower than the current routing table entry, the router updates its next-hop pointer to N, ensuring rapid convergence to the shortest multi-hop path across the entire wireless mesh."
]

p3_extra = [
    "Managing battery-operated Sleepy End Devices (SEDs) imposes stringent timing and buffer management requirements on the Parent Router. Because an SED disables its IEEE 802.15.4 radio transceiver during sleep mode to conserve microamperes of battery current, it cannot receive unsolicited unicast transmissions. The Parent Router must therefore maintain a dedicated Child Table and an Indirect Transmission Queue in RAM. When an incoming IPv6 packet addressed to the SED arrives from the mesh, the parent places the frame into the indirect queue and arms an expiration timer governed by the child's configured Child Timeout (typically ranging from tens of seconds to several hours).",
    "When the SED awakens on its internal RTC timer, it transmits an IEEE 802.15.4 MAC Data Request command frame to its parent. Upon receiving this polling frame, the parent inspects its indirect queue. If a packet is waiting, the parent sets the 'Frame Pending' bit in the immediate 802.15.4 MAC acknowledgment. Seeing this bit asserted, the SED keeps its radio in receive mode and prepares to capture the subsequent downlink data frame. If the indirect queue is empty, the parent returns an acknowledgment with Frame Pending cleared, allowing the SED to immediately return to deep sleep within sub-milliseconds. Thread 1.2 and 1.3 enhance this architecture by introducing Coordinated Sampled Listening (CSL), where the parent and SED synchronize microscopic listening windows, allowing the parent to transmit downlinks at scheduled microsecond offsets without requiring continuous polling."
]

p4_extra = [
    "The Thread Commissioning protocol (MeshCoP) provides an enterprise-grade security framework designed to onboard new devices (Joiners) without exposing network credentials to eavesdroppers. During commissioning, an authenticated Commissioner (such as an administrative tablet or smartphone) connects to the Thread network through a Border Router or directly via an on-mesh router. The Commissioner registers its credentials with the Leader via CoAP MGMT_COMMISSIONER_SET messages. When an uncommissioned Joiner powers on, it transmits an MLE Discovery Request scanning for Joiner Routers on the active radio channel.",
    "The Joiner Router acts as a stateless UDP relay between the Joiner and the Commissioner. All authentication exchanges occur over an ephemeral Datagram Transport Layer Security (DTLS) tunnel using the Pre-Shared Key for the Device (PSKd)—a high-entropy passphrase or QR code printed on the physical casing of the Joiner. The Commissioner computes steering data using a Bloom filter derived from the Joiner's IEEE EUI-64 MAC address, ensuring only authorized Joiners are invited to connect. Once DTLS mutual authentication completes successfully, the Commissioner securely pushes the Thread Master Network Key, Network Name, Extended PAN ID, and Mesh-Local IPv6 prefix through the encrypted tunnel. The Joiner saves these operational credentials to non-volatile flash, tears down the DTLS session, and seamlessly attaches to the production mesh as a full cryptographic peer."
]

p5_extra = [
    "In enterprise deployments, OpenThread serves as the foundational connectivity substrate for high-level smart home and industrial protocols, most notably Matter. Matter utilizes IPv6 datagram transport exclusively, running over UDP port 5540 with secure session establishment via CASE (Certificate Authenticated Session Establishment) and PASE (Passcode-Authenticated Session Establishment). Because Thread provides native IPv6 routing at the network layer without requiring transport proxies or application-level gateways, Matter microservices communicate directly between Wi-Fi devices, Ethernet servers, and low-power Thread sensors with zero payload translation.",
    "Furthermore, OpenThread's platform abstraction architecture isolates the core protocol stack from hardware peripherals. The core engine—encapsulated within the `otInstance` object—manages timers, child tables, routing tables, and cryptographic primitives, while delegating physical radio transmission, non-volatile storage, and entropy generation to platform hardware abstraction layer (HAL) drivers (`otPlatRadio`, `otPlatAlarm`, `otPlatEntropy`). This clean decoupling allows engineers to run the exact same OpenThread codebase across Nordic nRF52840, Silicon Labs EFR32, NXP K32W, and ESP32-H2 microcontrollers, or in native POSIX container simulations for continuous integration and automated compliance testing.",
    "Rigorous verification is the final pillar of enterprise Thread certification. Automated test harnesses execute continuous conformance suites verifying that link margin metrics remain stable under simulated RF fading, that child table entries expire cleanly when keep-alives cease, and that MLE Route64 updates converge within sub-second thresholds across 32-router topologies. By mastering both the theoretical finite state machines and the hands-on OpenThread API primitives, network engineers can architect multi-hop wireless meshes that deliver five-nines reliability, ultra-low power longevity, and seamless cross-ecosystem interoperability."
]

d['parts'][0]['say'].extend(p1_extra)
d['parts'][1]['say'].extend(p2_extra)
d['parts'][2]['say'].extend(p3_extra)
d['parts'][3]['say'].extend(p4_extra)
d['parts'][4]['say'].extend(p5_extra)

print("=== EXPANDED DAY 48 WORD COUNT AUDIT ===")
total = 0
for i, p in enumerate(d['parts']):
    wc = sum(len(x.split()) for x in p['say'])
    total += wc
    status = "PASS" if wc >= 580 else "FAIL"
    print(f"Part {i+1}: {wc} words ({status})")
print(f"Total Day 48 Words: {total} words (min >= 3000: {'PASS' if total >= 3000 else 'FAIL'})")

with open("scripts/day-48-data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2, ensure_ascii=False)
print("Updated scripts/day-48-data.json with expanded prose.")
