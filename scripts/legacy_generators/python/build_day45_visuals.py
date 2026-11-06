import json
import hashlib

with open("scripts/day-45-data.json", "r", encoding="utf-8") as f:
    day45_data = json.load(f)

parts = day45_data["parts"]

# Hardware register specifications for Day 45
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 45 Part 1 — Multi-Gateway Concentrator Array & Packet Forwarder Ingestion Pipeline",
        "regName": "LORA_CAPSTONE_INGEST_REG",
        "bitNames": ["CONCENTRATOR_EN", "MULTI_CHAN_RX", "BURST_DETECT", "BUFFER_ALLOC", "TIMESTAMP_SYNC", "BACKHAUL_UDP", "METRIC_CAPTURE", "INGEST_OK"],
        "steps": [
            ("say1", "Initialize multi-channel concentrator front-end: Enable 8 parallel IF channels and calibrate thermal noise floor.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Ingest multi-gateway RF wavefronts across Amsterdam topology: Latch arrival timestamps and compute log-distance path loss.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Package demodulated frames into Semtech UDP PUSH_DATA datagrams with per-gateway RSSI and SNR telemetry.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Commit metropolitan gateway roster and arm statutory duty-cycle monitoring across all base stations.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 45 Part 2 — Radio Frequency Collision Modeling & Quasi-Orthogonal Demodulation",
        "regName": "LORA_CAPSTONE_COLLISION_REG",
        "bitNames": ["AIRTIME_COLLIDE", "CO_CHAN_CAPTURE", "QUASI_ORTHO_OK", "POWER_DELTA_EVAL", "DEMOD_SUCCESS", "PACKET_DISCARD", "SIR_MARGIN_LOCK", "COLLISION_OK"],
        "steps": [
            ("say1", "Detect overlapping transmissions in time and frequency: Evaluate Spreading Factor alignment across colliding frames.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Evaluate Co-Channel Capture Effect: Confirm 9.0 dB power delta exceeds 6.0 dB SIR threshold to demodulate dominant packet.", "0xD4", 212, [1, 1, 0, 1, 0, 1, 0, 0]),
            ("example", "Evaluate Cross-SF Quasi-Orthogonality: Verify 16 dB inter-SF isolation allows concurrent demodulation of SF7 and SF10.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("tryIt", "Commit collision arbitration outcomes and discard annihilated frames failing CRC integrity checks.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 45 Part 3 — Multi-Tenant OTAA Session Management & Dual-Key Zero-Trust Cryptography",
        "regName": "LORA_CAPSTONE_SESSION_REG",
        "bitNames": ["OTAA_ROSTER_EN", "DEVNONCE_MONO", "JS_DERIVATION", "NWK_KEY_STORE", "APP_KEY_STORE", "FCNT_ROLLOVER", "ANTI_REPLAY_LOK", "SESSION_OK"],
        "steps": [
            ("say1", "Process OTAA Join-Request: Enforce strictly monotonic DevNonce tracking to permanently eliminate replay attacks.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Execute Join Server session derivation: Generate decoupled NwkSKey (routing) and AppSKey (confidentiality).", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("example", "Arm 32-bit Frame Counter sequencer with AES-CTR stream encryption and AES-CMAC integrity signing.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Commit activated endpoint session into multi-tenant cloud routing tables with zero-trust privilege isolation.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 45 Part 4 — Dynamic Server-Side ADR Convergence & Gateway Duty-Cycle Arbitration",
        "regName": "LORA_CAPSTONE_ADR_REG",
        "bitNames": ["ADR_LOOP_EN", "SNR_MULTI_GW", "MARGIN_3DB_STEP", "DR_OPTIMIZED", "TXPWR_THROTTLED", "GW_DC_AUDITED", "LINK_ADR_DISPATCH", "ADR_OK"],
        "steps": [
            ("say1", "Accumulate 20-frame observation history: Extract maximum reported demodulation SNR across multi-gateway paths.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Calculate +17.5 dB SNR margin: Execute Stage 1 to elevate data rate from DR0 (SF12) to DR5 (SF7).", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("example", "Execute Stage 2: Throttle transmit power amplifier to +11 dBm and arbitrate gateway duty-cycle headroom.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Dispatch LinkADRReq downlink through GW_ALPHA, compressing packet airtime by 95.3% while preserving ETSI compliance.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 45 Part 5 — Masterclass Synthesis: The Complete LoRaWAN Network Server & ADR Engine",
        "regName": "LORA_CAPSTONE_MASTER_REG",
        "bitNames": ["LNS_ENGINE_INIT", "FLEET_JOINED", "DEDUP_ACTIVE", "COLLISION_RESOLVED", "ADR_CONVERGED", "AIRTIME_COMPLIANT", "DOWNLINK_LOCKED", "CERT_V45_OK"],
        "steps": [
            ("say1", "Initialize LoRaWANCapstoneMasterEngine: Orchestrate multi-gateway concentrators, security, and ADR pipelines.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Execute 25-cycle metropolitan fleet simulation: Ingest 75 datagrams and deduplicate to 25 unique frames.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Trigger closed-loop ADR convergence: Collapse airtime from 1,318.91 ms to 61.70 ms across all active nodes.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Emit enterprise milestone token LORAWAN_NETWORK_SERVER_ENGINE_GRADE_A_PLUS_CERTIFIED and finalize Block 9.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 45,
    "title": "🏆 Milestone 9 Capstone: LoRaWAN Network Server & ADR Simulation Engine",
    "promptSha": "lorawan-lns-adr-capstone-day45-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-45.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-45.json successfully with domain-accurate hardware registers.")
