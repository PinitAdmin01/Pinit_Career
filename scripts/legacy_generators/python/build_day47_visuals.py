import json
import hashlib

with open("scripts/day-47-data.json", "r", encoding="utf-8") as f:
    day47_data = json.load(f)

parts = day47_data["parts"]

# Hardware register specifications for Day 47
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 47 Part 1 — RPL DODAG Architecture & ICMPv6 Control Messages (DIS, DIO, DAO, DAO-ACK)",
        "regName": "RPL_CONTROL_MSG_REG",
        "bitNames": ["ICMP6_TYPE155", "DIS_SOLICIT", "DIO_ADVERTISE", "DAO_UPWARD", "DAO_ACK_RECV", "RPL_INST_MATCH", "VERSION_LATCH", "CTRL_MSG_OK"],
        "steps": [
            ("say1", "Initialize RPL control protocol: Register ICMPv6 Type 155 handler and parse RPL Instance ID.", "0x84", 132, [1, 0, 0, 0, 0, 1, 0, 0]),
            ("say2", "Construct DIO advertisement: Encode DODAG ID, Grounded flag, Storing Mode MOP, and Rank 256.", "0xA6", 166, [1, 0, 1, 0, 0, 1, 1, 0]),
            ("example", "Broadcast DIO message across link-local all-RPL-nodes multicast address (FF02::1A).", "0xAF", 175, [1, 0, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Receive upward DAO prefix registration from child node and return confirmed DAO-ACK.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 47 Part 2 — The Trickle Timer Algorithm (RFC 6206): Rapid Convergence & Zero-Overhead Quiescence",
        "regName": "RPL_TRICKLE_TIMER_REG",
        "bitNames": ["TRICKLE_ARM", "IMIN_RESET", "IMAX_EXPONENT", "INTERVAL_DOUBLE", "COUNTER_CONSIST", "SUPPRESS_FIRE", "INCONSIST_TRIGGER", "TRICKLE_OK"],
        "steps": [
            ("say1", "Arm RFC 6206 Trickle timer: Initialize interval I to I_min (10 ms) and select random broadcast time t in [I/2, I).", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Listen across interval: Increment consistency counter c upon hearing 3 consistent neighbor DIO announcements.", "0xD8", 216, [1, 1, 0, 1, 1, 0, 0, 0]),
            ("example", "Evaluate at time t: Consistency counter c exceeds redundancy constant k (3 >= 2), suppress DIO transmission.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("tryIt", "Simulate topological inconsistency: Reset interval to I_min for instantaneous millisecond re-convergence.", "0xEE", 238, [1, 1, 1, 0, 1, 1, 1, 0]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 47 Part 3 — Rank Calculation, Monotonic Ordering & Objective Functions (OF0 vs MRHOF)",
        "regName": "RPL_RANK_MRHOF_REG",
        "bitNames": ["RANK_EVAL_EN", "ETX_METRIC_CALC", "HYSTERESIS_LOCK", "PARENT_SWITCH", "RANK_MONOTONIC", "LOOP_AVOID_OK", "OF0_HOP_COUNT", "MRHOF_OK"],
        "steps": [
            ("say1", "Initialize MRHOF objective function: Calculate link Expected Transmission Count (ETX) from MAC retry stats.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Evaluate candidate NODE_B with minor improvement (76 units): Hysteresis threshold (192) suppresses route flap.", "0xE0", 224, [1, 1, 1, 0, 0, 0, 0, 0]),
            ("example", "NODE_B link improves to ETX 1.0 (204 units improvement): Execute atomic parent switch and update rank to 512.", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("tryIt", "Verify strictly monotonic rank progression to mathematically eliminate routing loops across mesh tree.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 47 Part 4 — Downward Routing Topologies: Storing Mode vs Non-Storing Source Routing",
        "regName": "RPL_DOWNWARD_ROUT_REG",
        "bitNames": ["STORING_MODE", "NON_STORING_MODE", "DAO_PREFIX_LATCH", "SRH_HEADER_GEN", "ROUTING_TABLE_SYNC", "MOP_CONFIG", "TRANSIT_OPTION", "DOWNWARD_OK"],
        "steps": [
            ("say1", "Configure Mode of Operation (MOP): Select Storing Mode (MOP=2) for localized routing table lookups.", "0xA4", 164, [1, 0, 1, 0, 0, 1, 0, 0]),
            ("say2", "Ingest child DAO message: Populate local forwarding table mapping destination IPv6 to next-hop MAC.", "0xB5", 181, [1, 0, 1, 1, 0, 1, 0, 1]),
            ("example", "Switch root to Non-Storing Mode (MOP=1): Compute full BFS graph path and generate Source Routing Header (SRH).", "0x5A", 90, [0, 1, 0, 1, 1, 0, 1, 0]),
            ("tryIt", "Forward downward packet along intermediate hops: Advance SRH pointer without local table memory consumption.", "0x7F", 127, [0, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 47 Part 5 — Masterclass Synthesis: Full RPL Mesh Routing Engine with Multi-Hop Convergence",
        "regName": "RPL_MASTER_ENGINE_REG",
        "bitNames": ["DODAG_ROOT_INIT", "MESH_DISCOVERY", "TRICKLE_QUIESCENT", "MRHOF_OPTIMIZED", "NO_LOOP_VERIFIED", "PACKET_FORWARDED", "METRIC_STABLE", "CERT_V47_OK"],
        "steps": [
            ("say1", "Initialize RPLMasterMeshEngine: Establish ROOT_GW at baseline Rank 256 and arm Trickle timers.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Form 6-node DODAG mesh tree across 3 hops: Nodes select optimal parents via MRHOF ETX path cost.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Route upward telemetry from leaf NODE_5 through intermediate hops: Validate strictly decreasing ranks.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Commit converged mesh network and emit certification token RPL_DODAG_ROUTING_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    }
]

entries = []
for idx, part in enumerate(parts):
    code_str = part["code"]
    code_hash = hashlib.sha256(code_str.encode("utf-8")).hexdigest()
    spec_meta = reg_specs[idx]
    
    steps_list = []
    for step_tag, caption, hex_val, dec_val, bit_vals in spec_meta["steps"]:
        bits_list = []
        for b_idx in range(8):
            bit_name = spec_meta["bitNames"][7 - b_idx]
            val = bit_vals[b_idx]
            bits_list.append({
                "index": 7 - b_idx,
                "name": bit_name,
                "value": val,
                "tone": "ok" if val == 1 else "idle",
                "highlighted": True if (val == 1 and b_idx == 0) else False
            })
        
        steps_list.append({
            "at": step_tag,
            "step": step_tag,
            "caption": caption,
            "registerName": spec_meta["regName"],
            "bitWidth": 8,
            "hexValue": hex_val,
            "decimalValue": dec_val,
            "maskApplied": hex_val,
            "bits": bits_list
        })
    
    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "register-bits",
            "title": spec_meta["title"],
            "steps": steps_list
        }
    }
    entries.append(entry)

visual_doc = {
    "schemaVersion": 1,
    "prefix": "iot_net",
    "coursePrefix": "iot_net",
    "day": 47,
    "title": "RPL Mesh Routing: DODAG Formation, Objective Functions & Trickle Timers",
    "promptSha": "rpl-dodag-mrhof-trickle-day47-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-47.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-47.json successfully with domain-accurate hardware registers.")
