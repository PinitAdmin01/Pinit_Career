# scripts/expand_day22_words.py
import json

with open("scripts/iot_net_day22.json", "r", encoding="utf-8") as f:
    d = json.load(f)

expansions = {
    1: (
        "In production industrial field networks, ICMPv6 control messages are subject to strict quality-of-service (QoS) classification "
        "at the media access control layer. When an RPL router transmits a DIO or DAO, the link-layer driver assigns the highest priority "
        "queue to ensure that routing maintenance packets preempt bulk telemetry uploads. Furthermore, to guard against rogue node injection "
        "and false rank advertising, RFC 6550 defines cryptographic security modes within the ICMPv6 header. By utilizing the RPL Security Option, "
        "nodes append an HMAC or AES-CCM signature verifying the authenticity of the advertising router. This prevents malicious adversaries from "
        "injecting forged DIOs with artificially low ranks (a sinkhole attack), ensuring that the integrity of the routing topology remains uncompromised."
    ),
    2: (
        "From an energy-budgeting perspective, the Trickle algorithm's parameter tuning directly dictates device operating lifespan. "
        "Consider an autonomous gas meter powered by an internal 2.4-ampere-hour battery. If the Trickle timer is configured with an aggressive "
        "I_max of only 1 minute, the node will transmit 1,440 DIO beacons per day. Assuming each transmission consumes 20 milliamps for 5 milliseconds, "
        "the routing overhead alone consumes over 72 milliampere-hours per year. Conversely, by expanding I_max to 16 doublings (roughly 1.8 hours) "
        "and setting redundancy constant k to 3, daily transmissions drop to fewer than 20 packets, reducing annual routing energy consumption to "
        "less than 1 milliampere-hour. This profound energy conservation is why utility operators mandate Trickle compliance in smart city tenders."
    ),
    3: (
        "When evaluating the downstream routing architecture, hybrid techniques are increasingly deployed in modern mesh routers. "
        "While standard Non-Storing Mode offloads all routing state to the Root, intermediate routers can optionally cache recent downward routes "
        "for high-frequency local peer-to-peer communication. In an industrial plant where a temperature sensor triggers a nearby cooling valve, "
        "routing through the Root in a 10-hop round trip introduces unacceptable latency. By employing local P2P-RPL (RFC 6997), nodes can establish "
        "temporary reactive point-to-point routes directly across lateral mesh links, bypassing the Root and achieving sub-50-millisecond actuator response times."
    ),
    4: (
        "The mathematical rigor of RPL's loop detection is reinforced by secondary heuristics including data-path hop limit monitoring and poison-reverse procedures. "
        "When an intermediate router receives a telemetry packet with an RPL Option header indicating an unexpected downward hop on an upward route, "
        "it immediately triggers a local repair by multicasting a poisoned DIO with Rank 0xFFFF. This poisons the broken sub-tree, forcing all descendant "
        "nodes to dissociate from the failing path and solicit fresh parent links via DIS. This self-healing cascade operates entirely autonomously, "
        "guaranteeing that even if a backhoe severs a physical cable or heavy industrial machinery temporarily blocks an RF link, the mesh converges on "
        "alternative paths in seconds without requiring manual administrator intervention."
    )
}

for idx, exp in expansions.items():
    d["parts"][idx]["say"].append(exp)

with open("scripts/iot_net_day22.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Expanded scripts/iot_net_day22.json successfully.")
