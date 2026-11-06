import json
import hashlib

with open("scripts/day-44-data.json", "r", encoding="utf-8") as f:
    day44_data = json.load(f)

parts = day44_data["parts"]

# Hardware register specifications for Day 44
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 44 Part 1 — Gateway-to-Server Protocols: Semtech UDP Forwarder & Basic Station",
        "regName": "LORA_PACKET_FWD_REG",
        "bitNames": ["PROTO_UDP_V2", "TOKEN_VALID", "GW_EUI_MATCH", "RXPK_PRESENT", "JSON_DECODED", "PUSH_ACK_TX", "PULL_DATA_ACT", "FWD_OK"],
        "steps": [
            ("say1", "Parse Semtech UDP binary header: Validate protocol version 2 and correlate 16-bit transaction token.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Extract Gateway MAC EUI and decode JSON 'rxpk' metadata array containing frequency, RSSI, and SNR.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Emit 4-byte PUSH_ACK response datagram over UDP port 1700 to confirm receipt of RF frame.", "0xF4", 244, [1, 1, 1, 1, 0, 1, 0, 0]),
            ("tryIt", "Upgrade transport to LoRa Basics Station: Establish persistent TLS WebSocket with client certificate.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 44 Part 2 — Multi-Gateway Uplink Ingestion, Deduplication Window & Metadata Fusion",
        "regName": "LORA_GW_DEDUP_REG",
        "bitNames": ["DEDUP_EN", "TIME_WIN_OPEN", "DUP_FRAME_DET", "METADATA_FUSED", "MAX_SNR_LOCK", "GATEWAY_ROSTER", "DEDUP_DISPATCH", "INGEST_OK"],
        "steps": [
            ("say1", "Ingest first gateway report: Open 150-millisecond deduplication window indexed by payload SHA-256 hash.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Detect duplicate incoming frames from neighboring base stations across variable backhaul paths.", "0xE0", 224, [1, 1, 1, 0, 0, 0, 0, 0]),
            ("example", "Window expiration: Fuse metadata across all reporting gateways, locking maximum SNR and RSSI metrics.", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("tryIt", "Dispatch single deduplicated uplink to Application Server with 11.3 dB macro-diversity gain.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 44 Part 3 — Class A Downlink Gateway Selection & Microsecond Window Scheduling",
        "regName": "LORA_DOWNLINK_SCHED_REG",
        "bitNames": ["SCHED_EN", "GW_SELECT_SNR", "DUTY_CYCLE_HEADROOM", "RX1_WINDOW_LOCK", "RX2_FALLBACK", "BACKHAUL_LATENCY_COMP", "PULL_RESP_QUEUE", "DOWNLINK_OK"],
        "steps": [
            ("say1", "Initialize Downlink Scheduler: Filter candidate gateways by statutory duty-cycle headroom and IP latency.", "0xE0", 224, [1, 1, 1, 0, 0, 0, 0, 0]),
            ("say2", "Select GW_ALPHA (+6.8 dB SNR, 24.0s airtime remaining) while bypassing duty-exhausted GW_BRAVO.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Calculate microsecond target timestamp: tmst = uplink_tmst + 1,000,000 us for Class A RX1 reception.", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("tryIt", "Queue PULL_RESP packet to gateway concentrator TX buffer well before microsecond deadline.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 44 Part 4 — LoRaWAN Backend Interfaces v1.1: Join Server, Network Server & Application Server",
        "regName": "LORA_BACKEND_IF_REG",
        "bitNames": ["JS_CLIENT_EN", "NS_ROUTING_ACT", "AS_PAYLOAD_RDY", "NWK_KEY_DELIVER", "APP_KEY_DELIVER", "PASSIVE_ROAMING", "ZERO_TRUST_ISO", "BACKEND_OK"],
        "steps": [
            ("say1", "Delegate JoinReq over JSON RPC to Join Server: Verify non-volatile monotonic DevNonce anti-replay state.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Derive decoupled session keys: Deliver NwkSKey to Network Server and AppSKey to Application Server.", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("example", "Verify zero-trust privilege separation: Carrier network routes frames without inspecting customer data.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Arm cross-operator Passive Roaming interface: Establish secure PRStartReq peering across partner networks.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 44 Part 5 — Masterclass Synthesis: Full LoRaWAN Network Server Routing & Dispatch Engine",
        "regName": "LORA_MASTER_LNS_REG",
        "bitNames": ["LNS_INITIALIZED", "MULTI_GW_INGEST", "DEDUP_CONVERGED", "JS_AUTHENTICATED", "METADATA_FUSED", "DOWNLINK_ROUTED", "AS_DISPATCHED", "CERT_V44_OK"],
        "steps": [
            ("say1", "Initialize LoRaWANMasterNetworkServer: Register metropolitan gateways with statutory airtime quotas.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Ingest multi-gateway datagrams: Lock optimal path at GW_METRO_02 (+8.6 dB SNR, -81 dBm RSSI).", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Schedule Class A downlink ACK at tmst=11,000,020 us and deduct airtime from gateway regulatory budget.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Commit master cloud routing pipeline and emit LORAWAN_NETWORK_SERVER_DISPATCHER_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 44,
    "title": "LoRaWAN Network Server: Gateway Deduplication, Downlink Scheduling & Backend Interfaces",
    "promptSha": "lorawan-lns-dedup-downlink-backend-day44-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-44.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-44.json successfully with domain-accurate hardware registers.")
