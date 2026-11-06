# scripts/expand_d29.py
with open("scripts/build_iot_net_day29.py", "r", encoding="utf-8") as f:
    text = f.read()

p1_add = '''    "To prevent synthetic probe traffic from congesting low-bandwidth cellular or satellite uplinks, industrial link evaluators implement Adaptive Probing Frequency. When an interface demonstrates pristine health (zero packet loss and stable low latency over hundreds of samples), the probe interval automatically scales back from once every 2 seconds to once every 15 seconds. Conversely, the moment a single probe experiences unexpected packet loss or latency spikes above 200 milliseconds, the evaluator immediately accelerates probing to once per second. This agile rate adaptation minimizes operational data consumption and satellite billing charges while guaranteeing sub-second fault detection when a link begins to degrade."'''

p2_add = '''    "In mission-critical utility substations, zero-loss failover is often augmented by BGP Anycast routing and VRRP (Virtual Router Redundancy Protocol) at the local network edge. A pair of redundant physical edge gateways share a single virtual IP address and virtual MAC address across the local Ethernet segment. If Gateway Alpha suffers an internal power supply failure or kernel panic, Gateway Beta detects the absence of VRRP heartbeats within 300 milliseconds, assumes the master role, and resumes packet routing without requiring connected PLC controllers or SCADA master servers to update their configured gateway IP addresses."'''

p3_add = '''    "In addition to MRHOF parent switching, RPL mesh self-healing incorporates the Trickle Algorithm (RFC 6206) for adaptive control overhead regulation. When the network topology is stable, Trickle exponentially doubles the transmission interval of DIO routing beacons, expanding sleep time up to several hours and reducing control traffic to less than 0.1% of network airtime. However, the moment a link failure or local repair event is detected, Trickle immediately resets its timer to the minimum interval (typically 16 milliseconds). This rapid timer reset floods the local neighborhood with fresh routing beacons, allowing downstream nodes to discover alternate parent paths and reconverge the mesh within fractions of a second."'''

p4_add1 = '''    "Flash memory endurance and write amplification are paramount considerations in transactional telemetry journaling. Because NAND and NOR flash memory wear out after 10,000 to 100,000 erase cycles, writing every individual 50-byte sensor frame into a fresh flash sector would destroy flash silicon in months. To prevent premature hardware failure, the journal engine implements RAM Write Coalescing: incoming sensor frames are accumulated into an internal 4-kilobyte RAM staging buffer. Only when the staging buffer fills or a 5-second timer expires is the entire buffer flushed as a single sequential write operation into flash, slashing write amplification by over 80-fold."'''

p4_add2 = '''    "Furthermore, transactional integrity is guaranteed using Atomic Double-Buffering with CRC-32 metadata blocks. When writing a new journal batch to flash, the engine writes payload data first, verifies flash write status registers, and finally commits the transaction by writing the batch header with length and CRC. If a sudden power loss occurs midway through flash programming, the bootloader or journal recovery routine detects the incomplete transaction header during next startup, discards the uncommitted fragment, and resumes from the last valid checkpoint without file system corruption."'''

p5_add1 = '''    "The architectural convergence of Multi-WAN edge redundancy, self-healing mesh routing, and non-volatile transactional journaling delivers an unbreakable, sovereign communication fabric for modern industrial automation. In national power grids, offshore wind farms, and metropolitan smart transportation systems, network failures are inevitable physical realities—cables are severed by construction excavators, cell towers lose power during ice storms, and lightning strikes disable mesh routers. By engineering autonomous, multi-layered self-healing and zero-loss failover directly into the edge computing tier, systems engineers eliminate the risk of catastrophic blind spots."'''

p5_add2 = '''    "By validating composite health indices across physical interfaces, executing atomic 3-strike failovers, implementing RPL local route repair with poison reverse invariants, and enforcing flash journal backpressure, you have acquired the complete industrial resilience engineering skillset. The master orchestrator built today passes every rigorous physical and protocol verification gate, certifying your expertise at the highest level of industrial IoT network design."'''

p5_add3 = '''    "Looking ahead to emerging IEEE 802.1 TSN (Time-Sensitive Networking) and 6TiSCH industrial wireless standards, deterministic redundancy will operate at the microsecond level across synchronized time slots. Edge gateways will schedule dual-path packet replication across concurrent Sub-GHz mesh and 5G RedCap radio slices simultaneously, providing mathematical zero-jitter, zero-loss determinism for industrial robotics and high-speed electrical switchgear control."'''

text = text.replace('part1_say = [', 'part1_say = [\n' + p1_add + ',')
text = text.replace('part2_say = [', 'part2_say = [\n' + p2_add + ',')
text = text.replace('part3_say = [', 'part3_say = [\n' + p3_add + ',')
text = text.replace('part4_say = [', 'part4_say = [\n' + p4_add1 + ',\n' + p4_add2 + ',')
text = text.replace('part5_say = [', 'part5_say = [\n' + p5_add1 + ',\n' + p5_add2 + ',\n' + p5_add3 + ',')

with open("scripts/build_iot_net_day29.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated build_iot_net_day29.py with expanded paragraphs.")
