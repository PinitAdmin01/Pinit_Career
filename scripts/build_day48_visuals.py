import json
import hashlib

with open("scripts/day-48-data.json", "r", encoding="utf-8") as f:
    day48_data = json.load(f)

parts = day48_data["parts"]

# Hardware register specifications for Day 48
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 48 Part 1 — Thread Protocol 1.3 Architecture, Node Roles & Partition Governance",
        "regName": "THREAD_ROLE_STATE_REG",
        "bitNames": ["DETACHED_MODE", "CHILD_ATTACHED", "ROUTER_ROLE", "LEADER_ELECTED", "REED_STANDBY", "ROUTER_ID_LATCH", "PART_ID_VALID", "ROLE_CONVERGED"],
        "steps": [
            ("say1", "Device powers up in detached state; scans channels and locks initial partition ID.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Attach handshake completes; node acquires Child status and allocates RLOC16 address.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("example", "Autonomous router promotion: Router ID allocated and mesh routing role active.", "0xA7", 167, [1, 0, 1, 0, 0, 1, 1, 1]),
            ("tryIt", "Full partition governance: Leader arbitration active with maximum router capacity reached.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 48 Part 2 — Mesh Link Establishment (MLE) & Distance-Vector Route64 Metric",
        "regName": "THREAD_MLE_LINK_REG",
        "bitNames": ["MLE_REQUEST_TX", "CHALLENGE_MATCH", "RESPONSE_VERIF", "FRAME_CTR_OK", "ROUTE64_VALID", "LINK_MARGIN_OK", "NEIGHBOR_LATCH", "MLE_ESTABLISHED"],
        "steps": [
            ("say1", "Transmit MLE Link Request embedding randomized 32-bit Challenge TLV.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Receive MLE Link Accept; verify challenge response token and validate frame counter.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Ingest Route64 TLV distance vector updates and calculate link margin from RSSI.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Two-way symmetric link confirmed; neighbor table updated and Route64 path cost converged.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 48 Part 3 — Sleepy End Devices (SED), Child Tables & Indirect Packet Buffering",
        "regName": "THREAD_SED_POLL_REG",
        "bitNames": ["CHILD_TBL_ALLOC", "INDIR_QUEUED", "MAC_DATA_REQ", "FRAME_PEND_ACK", "DOWNLINK_BURST", "CSL_SYNC_WAKE", "SLEEP_DEEP_OK", "POLL_CYCLE_DONE"],
        "steps": [
            ("say1", "Parent allocates child table slot for Sleepy End Device with assigned timeout.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Incoming downlink packet arrives from mesh; parent buffers frame into indirect queue.", "0xC3", 195, [1, 1, 0, 0, 0, 0, 1, 1]),
            ("example", "SED awakens and issues MAC Data Request poll; parent responds with Frame Pending asserted.", "0xCF", 207, [1, 1, 0, 0, 1, 1, 1, 1]),
            ("tryIt", "Downlink payload transmitted, confirmed with MAC ACK, and SED returns to ultra-low-power sleep.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 48 Part 4 — Commissioning & Security: MeshCoP, DTLS-PSK & Master Key Distribution",
        "regName": "THREAD_COMMISSION_REG",
        "bitNames": ["COMM_CANDIDATE", "MGMT_COMM_SET", "JOINER_DISC_OK", "DTLS_PSK_TUNNEL", "BLOOM_FILTER_OK", "NET_KEY_ENC", "OPER_CREDS_SAVED", "COMMISSION_DONE"],
        "steps": [
            ("say1", "Commissioner candidate registers with Thread Leader via CoAP MGMT_COMMISSIONER_SET.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Joiner sends discovery request; Joiner Router relays DTLS-PSK handshake using PSKd.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Verify Joiner EUI-64 against steering data Bloom filter and establish secure tunnel.", "0x9F", 159, [1, 0, 0, 1, 1, 1, 1, 1]),
            ("tryIt", "Push Master Network Key and network parameters; Joiner persists credentials to flash.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 48 Part 5 — Masterclass Synthesis: Full OpenThread 1.3 Mesh Link, CoAP Messaging & Certification Simulation Engine",
        "regName": "THREAD_MASTER_MESH_REG",
        "bitNames": ["OT_INST_INIT", "MLE_MESH_READY", "CHILD_INDIR_OK", "ROUTE64_OPT", "COAP_DISPATCH_OK", "MATTER_UDP_PASS", "CERT_TOKEN_LATCH", "FULL_ENGINE_PASS"],
        "steps": [
            ("say1", "Initialize OpenThread instance: bind radio HAL, timer drivers, and initialize node state machine.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Form multi-hop mesh: elect Leader, promote active Routers, and synchronize Route64 tables.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Dispatch CoAP control datagram across multi-hop path and deliver buffered payload to SED.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify zero-loss Matter payload delivery and latch certification token THREAD_PROTOCOL_MLE_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 48,
    "title": "Thread 1.3 & OpenThread: Mesh Link Establishment, Roles & CoAP Control",
    "promptSha": "thread-openthread-mle-mesh-day48-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-48.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-48.json successfully with domain-accurate hardware registers.")
