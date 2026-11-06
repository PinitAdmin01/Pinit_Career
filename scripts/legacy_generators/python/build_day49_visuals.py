import json
import hashlib

with open("scripts/day-49-data.json", "r", encoding="utf-8") as f:
    day49_data = json.load(f)

parts = day49_data["parts"]

# Hardware register specifications for Day 49
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 49 Part 1 — Thread Border Router Architecture & Bidirectional IPv6 Routing",
        "regName": "THREAD_BORDER_ROUTER_REG",
        "bitNames": ["OMR_PREFIX_ADV", "NDP_PROXY_EN", "ETH_IF_UP", "WPAN_IF_UP", "RLOC16_MAP_OK", "IPHC_COMPRESS_OK", "ROUTE_PREF_HIGH", "BR_ACTIVE"],
        "steps": [
            ("say1", "Configure dual interfaces: Bring up Ethernet eth0 and IEEE 802.15.4 wpan0.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Publish Off-Mesh Routable (OMR) prefix into Thread Network Data and enable SLAAC.", "0x87", 135, [1, 0, 0, 0, 0, 1, 1, 1]),
            ("example", "Intercept external NDP Neighbor Solicitation and proxy reply with Border Router MAC.", "0xAF", 175, [1, 0, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Execute bidirectional packet forwarding: Resolve RLOC16 and apply LOWPAN_IPHC compression.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 49 Part 2 — NAT64 / DNS64 Translation Layer for IPv6-Only Constrained Nodes",
        "regName": "THREAD_NAT64_DNS64_REG",
        "bitNames": ["DNS64_RESOLVER_EN", "WELL_KNOWN_PREF", "V4_SYNTH_OK", "NAT_POOL_ALLOC", "PORT_MAP_TRACK", "UDP_TIMEOUT_SET", "CHECKSUM_ADJ_OK", "NAT64_TRANS_DONE"],
        "steps": [
            ("say1", "Enable DNS64 resolver: Intercept AAAA queries and detect missing IPv6 records.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Synthesize IPv6 address: Prepend RFC 6052 64:ff9b::/96 prefix to 32-bit IPv4 address.", "0x87", 135, [1, 0, 0, 0, 0, 1, 1, 1]),
            ("example", "Allocate stateful NAT64 5-tuple session binding and assign ephemeral public port.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Translate outbound IPv6 datagram to IPv4 and execute RFC 1624 incremental checksum update.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 49 Part 3 — Thread Backbone Router (BBR) & Multi-Mesh Multicast Synchronization",
        "regName": "THREAD_BBR_SYNC_REG",
        "bitNames": ["BBR_DOMAIN_JOIN", "PBBR_ELECT_WIN", "MLD_SNOOP_EN", "MCAST_REALM_LATCH", "BACKBONE_QUERY_TX", "PROXY_FWD_EN", "MOBILITY_SYNC_OK", "BBR_CONVERGED"],
        "steps": [
            ("say1", "Join Thread Backbone Domain and evaluate candidate list for Primary BBR election.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Win Primary BBR election: Assert PBBR status and publish service record to Network Data.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("example", "Listen to on-mesh MLD reports and register realm-local multicast group ff05:: on backbone.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Proxy external Matter/mDNS multicast queries into 802.15.4 mesh while suppressing duplicates.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 49 Part 4 — Matter-over-Thread Transport & TCP/UDP Session Establishment",
        "regName": "THREAD_MATTER_TRANS_REG",
        "bitNames": ["MATTER_PORT_OPEN", "UDP_5540_BOUND", "PASE_ONBOARD_OK", "CASE_HANDSHAKE", "SIGMA_I_VERIF", "SESSION_KEY_LATCH", "FRAG_6LOWPAN_EN", "MATTER_TRANS_READY"],
        "steps": [
            ("say1", "Initialize Matter transport: Bind operational socket to UDP port 5540.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Execute CASE Sigma-I handshake: Exchange Node Operational Certificates and derive AES-CCM keys.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Transmit multi-hop Matter command frame: Fragment 300-byte payload across 6LoWPAN frames.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Deliver end-to-end encrypted cluster command to edge node with sub-20ms verified latency.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 49 Part 5 — Masterclass Synthesis: Comprehensive Thread Border Router Engine",
        "regName": "THREAD_MASTER_BR_REG",
        "bitNames": ["BR_CORE_INIT", "OMR_ROUTING_OK", "NAT64_ACTIVE", "BBR_MCAST_PASS", "MATTER_DISPATCH_OK", "TELEMETRY_LOG_EN", "TOKEN_LATCH_OK", "BORDER_ROUTER_CERT"],
        "steps": [
            ("say1", "Initialize ThreadBorderRouterGateway: Bind Linux kernel interfaces wpan0 and eth0.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Route inbound enterprise Matter traffic to edge RLOC and translate cloud telemetry via NAT64.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Proxy realm-local multicast discovery and verify real-time gateway telemetry counters.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Complete full convergence test suite and emit token THREAD_BORDER_ROUTER_IP_CONVERGENCE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 49,
    "title": "Thread Border Router & IP Convergence: Bidirectional IPv6 Routing, NAT64 & Matter",
    "promptSha": "thread-border-router-ip-convergence-day49-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-49.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-49.json successfully with domain-accurate hardware registers.")
