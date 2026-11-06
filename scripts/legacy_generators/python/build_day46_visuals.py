import json
import hashlib

with open("scripts/day-46-data.json", "r", encoding="utf-8") as f:
    day46_data = json.load(f)

parts = day46_data["parts"]

# Hardware register specifications for Day 46
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 46 Part 1 — The IPv6 MTU Paradox & IEEE 802.15.4 Physical Constraints (RFC 4944)",
        "regName": "LOWPAN_FRAG_CTRL_REG",
        "bitNames": ["FRAG_ACTIVE", "FRAG1_HDR", "FRAGN_HDR", "DATAGRAM_SIZE", "TAG_ALLOC", "OFFSET_CALC", "PAYLOAD_SPLIT", "FRAG_DISPATCH_OK"],
        "steps": [
            ("say1", "Initialize RFC 4944 fragmentation engine: Evaluate 250-byte IPv6 datagram against 102-byte IEEE 802.15.4 MTU.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Construct FRAG1 header: Encode 11-bit datagram size and allocate unique 16-bit transaction tag.", "0xD9", 217, [1, 1, 0, 1, 1, 0, 0, 1]),
            ("example", "Construct FRAGN headers: Encode 8-byte scaled offset (offset // 8) for subsequent 96-byte payload slices.", "0xFD", 253, [1, 1, 1, 1, 1, 1, 0, 1]),
            ("tryIt", "Commit fragmentation sequence: Transmit 3 compliant IEEE 802.15.4 radio frames across wireless mesh link.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 46 Part 2 — RFC 6282 LOWPAN_IPHC Base Header Compression Mechanics",
        "regName": "LOWPAN_IPHC_BASE_REG",
        "bitNames": ["IPHC_DISPATCH", "TF_ELIDED", "NH_INLINE", "HLIM_COMPRESSED", "CID_PRESENT", "SAC_STATELESS", "SAM_LINK_DERIV", "IPHC_BASE_OK"],
        "steps": [
            ("say1", "Initialize RFC 6282 LOWPAN_IPHC compressor: Assert 3-bit dispatch identifier 011b (0x60).", "0x80", 128, [1, 0, 0, 0, 0, 0, 0, 0]),
            ("say2", "Elide Traffic Class and Flow Label (TF=11b) and compress Hop Limit 64 to 2 bits (HLIM=10b).", "0xD0", 208, [1, 1, 0, 1, 0, 0, 0, 0]),
            ("example", "Execute stateless MAC address elision: Derive 128-bit source and destination IPs directly from IEEE 802.15.4 frame.", "0xFD", 253, [1, 1, 1, 1, 1, 1, 0, 1]),
            ("tryIt", "Collapse standard 40-byte IPv6 header into a 3-byte wire header, achieving 92.5% compression efficiency.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 46 Part 3 — Next Header Compression (NHC) for UDP & Context-Based Address Compression",
        "regName": "LOWPAN_NHC_UDP_REG",
        "bitNames": ["NHC_UDP_DISP", "PORT_4BIT_COMP", "CHKSUM_INLINE", "CID_MATCH", "SAM_CONTEXT", "DAM_CONTEXT", "UDP_4BYTE_OK", "NHC_COMP_OK"],
        "steps": [
            ("say1", "Activate LOWPAN_NHC transport compressor: Detect UDP next header and assert 5-bit dispatch 11110b.", "0x80", 128, [1, 0, 0, 0, 0, 0, 0, 0]),
            ("say2", "Compress CoAP ports (0xF0B0-0xF0BF) down to 4-bit nibbles, packing source and destination into 1 byte (P=11b).", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("example", "Elide redundant UDP Length field and match 64-bit global prefix against 6LoWPAN Context Table (CID=1).", "0xFA", 250, [1, 1, 1, 1, 1, 0, 1, 0]),
            ("tryIt", "Commit compressed UDP header: Output 4-byte transport header with inline 16-bit Internet checksum.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 46 Part 4 — Fragmentation Reassembly Engine, Buffer Starvation & Reassembly Timeout",
        "regName": "LOWPAN_REASSEMBLY_REG",
        "bitNames": ["REASSEMBLY_EN", "TAG_MATCH", "OFFSET_SEEK", "BUFFER_ALLOC_OK", "OUT_OF_ORDER_LATCH", "TIMEOUT_TIMER_ARM", "BUFFER_STARVE_DROP", "PACKET_REASSEMBLED"],
        "steps": [
            ("say1", "Ingest incoming 6LoWPAN fragment: Allocate reassembly buffer indexed by (src_mac, datagram_tag).", "0xC8", 200, [1, 1, 0, 0, 1, 0, 0, 0]),
            ("say2", "Latch out-of-order FRAGN fragment (offset 96 to 191) directly into pre-allocated memory buffer.", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("example", "Ingest FRAG1 (offset 0 to 95): Arm 3.0-second RFC 4944 reassembly timeout timer to prevent buffer starvation.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Verify 100% datagram reconstruction: Deallocate buffer and dispatch reassembled packet to IPv6 stack.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 46 Part 5 — Masterclass Synthesis: Full RFC 4944 / RFC 6282 6LoWPAN Adaptation Engine",
        "regName": "LOWPAN_MASTER_ENGINE_REG",
        "bitNames": ["STACK_INIT", "IPV6_INGEST", "IPHC_COMPRESSED", "FRAG_DISPATCH", "WIRE_REASSEMBLY", "INTEGRITY_VERIFIED", "UDP_DISPATCH", "CERT_V46_OK"],
        "steps": [
            ("say1", "Initialize LowPANMasterEngine: Configure IEEE 802.15.4 MAC interface and register global context prefixes.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Compress 48 bytes of IPv6/UDP headers into 6 bytes using combined LOWPAN_IPHC and LOWPAN_NHC.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Execute RFC 4944 fragmentation and out-of-order reassembly across simulated lossy mesh channels.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Verify 100% payload integrity and emit certification token LOWPAN_IPHC_ADAPTATION_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 46,
    "title": "6LoWPAN Adaptation Layer: Fragmentation, Reassembly & LOWPAN_IPHC Compression",
    "promptSha": "lowpan-iphc-nhc-adaptation-day46-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-46.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-46.json successfully with domain-accurate hardware registers.")
