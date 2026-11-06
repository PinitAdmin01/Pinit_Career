import json
import hashlib

with open("scripts/day-50-data.json", "r", encoding="utf-8") as f:
    day50_data = json.load(f)

parts = day50_data["parts"]

# Hardware register specifications for Day 50
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 50 Part 1 — Milestone 10 Capstone: Unified Multi-Hop Architecture & Role Coordinator",
        "regName": "CAPSTONE_TOPOLOGY_REG",
        "bitNames": ["PAN_ID_LATCH", "CH_CCA_SCAN_OK", "LEADER_RLOC_0", "ROUTER_ID_ALLOC", "CHILD_TABLE_BOUND", "REED_STANDBY_EN", "ROUTE64_SYNC_OK", "TOPOLOGY_CONVERGED"],
        "steps": [
            ("say1", "Initialize IEEE 802.15.4 physical channel 25 and lock PAN ID 0xFACE.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Assert Border Router Leader at RLOC 0x0000 and allocate Router ID 1 (0x0400).", "0x87", 135, [1, 0, 0, 0, 0, 1, 1, 1]),
            ("example", "Attach Sleepy End Device child at RLOC 0x0401 and populate parent child table.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Complete multi-hop mesh convergence: Synchronize Route64 distance-vector matrix.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 50 Part 2 — Dynamic Packet Processing Pipeline: 6LoWPAN IPHC & Fragmentation",
        "regName": "CAPSTONE_PIPELINE_REG",
        "bitNames": ["IPHC_DISPATCH_EN", "ELIDED_PREFIX_OK", "UDP_NHC_COMPRESS", "SAVINGS_40B_PASS", "FRAG1_HDR_GEN", "FRAGN_OFFSET_OK", "REASSEMBLY_ARM", "PIPELINE_VALID"],
        "steps": [
            ("say1", "Apply RFC 6282 LOWPAN_IPHC compression: Elide common mesh IPv6 prefixes.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Execute LOWPAN_NHC: Compress 8-byte UDP header to 4 bytes, saving 41 bytes total.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Decompose 250-byte Matter payload into 8-byte aligned FRAG1 and FRAGN fragments.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Reassemble fragments in receiver buffer with active watchdog timer validation.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 50 Part 3 — Border Router Ingress/Egress: Dual-Homed Bridging & NAT64 Translation",
        "regName": "CAPSTONE_GATEWAY_REG",
        "bitNames": ["DUAL_HOMED_INIT", "OMR_PREFIX_ADV", "NDP_PROXY_MATCH", "RLOC_FORWARD_OK", "NAT64_DNS64_SYNTH", "PORT_MAP_ALLOC", "CHECKSUM_ADJ_OK", "GATEWAY_BRIDGED"],
        "steps": [
            ("say1", "Bring up dual-homed interfaces: Bind Linux eth0 and IEEE 802.15.4 wpan0.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Route inbound enterprise Matter UDP 5540 packet directly to edge RLOC 0x0401.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Intercept outbound telemetry to 64:ff9b::/96 and map to stateful NAT64 port.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Recalculate transport checksums via RFC 1624 and forward to WAN IPv4 gateway.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 50 Part 4 — Resilience, Churn & Fault Recovery: Partition Healing & Trickle Reset",
        "regName": "CAPSTONE_RECOVERY_REG",
        "bitNames": ["ETX_MONITOR_EN", "RETRY_EXHAUST_DET", "LINK_FAIL_ASSERT", "TRICKLE_RESET_IMIN", "BACKUP_CANDIDATE", "HYSTERESIS_CHECK", "FAILOVER_EXEC", "RECOVERY_COMPLETE"],
        "steps": [
            ("say1", "Monitor radio link quality: Track LQI, RSSI, and MAC retry statistics.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Simulate router RF failure: Detect MAC retry exhaustion and assert link dead.", "0x87", 135, [1, 0, 0, 0, 0, 1, 1, 1]),
            ("example", "Trigger topological inconsistency: Reset Trickle timer interval to I_min (10 ms).", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Execute atomic parent failover to ROUTER_02: Update next-hop pointer with zero data loss.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 50 Part 5 — Masterclass Synthesis: Full Capstone Simulation Engine & Certification Audit",
        "regName": "CAPSTONE_MASTER_CERT_REG",
        "bitNames": ["CAPSTONE_INIT_OK", "TOPO_GRADE_A", "IPHC_GRADE_A", "GATEWAY_GRADE_A", "RECOVERY_GRADE_A", "TELEMETRY_PASS", "TOKEN_LATCH_OK", "CAPSTONE_CERTIFIED"],
        "steps": [
            ("say1", "Initialize CapstoneMeshMasterEngine: Orchestrate multi-hop mesh on Channel 25.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Execute comprehensive test cycle: Route 12 Matter packets and compress headers.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Survive simulated link failure with zero dropped frames and verify NAT64 sessions.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Satisfy all Grade A+ invariants and latch token THREAD_BORDER_ROUTER_CAPSTONE_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 50,
    "title": "Milestone 10 Capstone: 6LoWPAN, RPL & Thread 1.3 Border Router Simulation Engine",
    "promptSha": "milestone-10-capstone-thread-border-router-day50-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-50.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-50.json successfully with domain-accurate hardware registers.")
