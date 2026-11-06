import json
import hashlib

with open("scripts/day-43-data.json", "r", encoding="utf-8") as f:
    day43_data = json.load(f)

parts = day43_data["parts"]

# Hardware register specifications for Day 43
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 43 Part 1 — LoRaWAN Regional Channel Plans & Spectrum Allocations (EU868, US915, IN865)",
        "regName": "LORA_REGIONAL_PLAN_REG",
        "bitNames": ["BAND_EU868", "BAND_US915", "BAND_AS923", "BAND_IN865", "CH_MASK_ACT", "HOP_TABLE_EN", "SUB_BAND_LOCK", "REG_INIT_OK"],
        "steps": [
            ("say1", "Initialize Regional Plan Manager: Select EU868 band profile and configure default 868.1/868.3/868.5 MHz channels.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Apply 16-bit channel mask (ChMask): Enable extended channels 0 through 7 via OTAA CFList.", "0x8D", 141, [1, 0, 0, 0, 1, 1, 0, 1]),
            ("example", "Arm pseudo-random frequency hopping sequence across active channel bank to distribute interference.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("tryIt", "Switch regulatory profile to US915 Sub-band 2 (channels 8-15) with 500 kHz uplink channel support.", "0x5F", 95, [0, 1, 0, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 43 Part 2 — ETSI EN 300 220 Sub-band Duty-Cycle Quotas vs FCC Part 15.247 Dwell Time Limits",
        "regName": "LORA_DUTY_CYCLE_REG",
        "bitNames": ["DC_ENFORCE", "SUB_G_1PCT", "SUB_H_01PCT", "SUB_G3_10PCT", "FCC_DWELL_LMT", "QUOTA_EXHAUST", "BACKOFF_WAIT", "AIRTIME_OK"],
        "steps": [
            ("say1", "Activate statutory airtime compliance engine: Initialize 3,600-second rolling token bucket tracker.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Enforce ETSI Sub-band g 1.0% duty-cycle ceiling (36.0 seconds max transmission time per hour).", "0xC1", 193, [1, 1, 0, 0, 0, 0, 0, 1]),
            ("example", "Detect excessive SF12 packet burst: Sub-band g quota exhausted, hardware radio forces mandatory back-off.", "0xE6", 230, [1, 1, 1, 0, 0, 1, 1, 0]),
            ("tryIt", "Enforce FCC 47 CFR Part 15.247 400 ms dwell time boundary: Reject over-length packets on 125 kHz channels.", "0x91", 145, [1, 0, 0, 1, 0, 0, 0, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 43 Part 3 — The Server-Side ADR Optimization Algorithm: SNR Margin & Step Allocation",
        "regName": "LORA_ADR_SERVER_REG",
        "bitNames": ["ADR_ACTIVE", "HIST_BUF_FULL", "SNR_MAX_LOCK", "MARGIN_EVAL", "NSTEP_INC_DR", "NSTEP_DEC_PWR", "LINK_ADR_GEN", "ADR_SRV_OK"],
        "steps": [
            ("say1", "Initialize ADR server controller: Collect 20 consecutive uplink frames into circular history buffer.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Extract maximum SNR across observation window and compute available link margin relative to DR0 sensitivity.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Allocate Nstep optimization: Stage 1 increases Data Rate from DR0 (SF12) to DR5 (SF7) to collapse airtime.", "0xF8", 248, [1, 1, 1, 1, 1, 0, 0, 0]),
            ("tryIt", "Allocate Stage 2: Reduce transmit power from 14 dBm down to 11 dBm and emit LinkADRReq command.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 43 Part 4 — LinkADRReq Command Encoding & Device ADRACKReq Fallback State Machine",
        "regName": "LORA_LINK_ADR_CMD_REG",
        "bitNames": ["ADR_REQ_RX", "CHMASK_ACK", "DATARATE_ACK", "POWER_ACK", "ADR_ACK_LMT", "ADR_ACK_DLY", "FALLBACK_SF", "LINK_ADR_OK"],
        "steps": [
            ("say1", "End device demodulates LinkADRReq: Execute atomic tripartite validation across ChMask, DR, and Power.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("say2", "Transmit LinkADRAns acknowledgment byte (0x07): All 3 ACK bits set, confirming atomic reconfiguration.", "0xF1", 241, [1, 1, 1, 1, 0, 0, 0, 1]),
            ("example", "Simulate loss of downlink connectivity: Uplink counter exceeds ADR_ACK_LIMIT (64), assert ADRACKReq bit.", "0x18", 24, [0, 0, 0, 1, 1, 0, 0, 0]),
            ("tryIt", "ADR_ACK_DELAY (32 frames) expires without ACK: Node restores +14 dBm and steps down SF notch-by-notch.", "0x1E", 30, [0, 0, 0, 1, 1, 1, 1, 0]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 43 Part 5 — Masterclass Synthesis: Full Regional ADR & Airtime Regulatory Simulation Engine",
        "regName": "LORA_MASTER_ADR_REG",
        "bitNames": ["SYS_INITIALIZED", "REGIONAL_LOCK", "DUTY_CYCLE_OK", "BUFFER_SYNC", "ADR_CONVERGED", "FALLBACK_RDY", "TOKEN_BUCKET_OK", "CERT_V43_OK"],
        "steps": [
            ("say1", "Initialize RegionalADRMasterEngine: Load EU868 parameters and arm 1.0% statutory airtime tracker.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Execute telemetry cycle 1 at SF12: Record 1,318 ms time-on-air and deduct airtime from hourly budget.", "0xE0", 224, [1, 1, 1, 0, 0, 0, 0, 0]),
            ("example", "Complete 20-frame observation: ADR converges, stepping node to SF7 and cutting airtime by 95.3%.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Verify closed-loop network stability and emit certification token LORAWAN_REGIONAL_ADR_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 43,
    "title": "Adaptive Data Rate (ADR), Channel Plans & Regional Duty-Cycle Compliance",
    "promptSha": "lorawan-regional-adr-dutycycle-day43-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-43.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-43.json successfully with domain-accurate hardware registers.")
