import json
import hashlib

with open("scripts/day-42-data.json", "r", encoding="utf-8") as f:
    day42_data = json.load(f)

parts = day42_data["parts"]

# Hardware register specifications for Day 42
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 42 Part 1 — LoRaWAN Device Classes A/B/C Reception Window State Machine",
        "regName": "LORA_MAC_CLASS_CTRL_REG",
        "bitNames": ["CLASS_EN", "MODE_C", "MODE_B", "RX2_OPEN", "RX1_OPEN", "BCN_LOCKED", "PING_ACTIVE", "TX_ACTIVE"],
        "steps": [
            ("say1", "Initialize LoRaWAN Class A MAC: Uplink transmission initiated over physical air interface.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Uplink complete: Power amplifier asleep, hardware timer opens RX1 window at T+1.0s.", "0x88", 136, [1, 0, 0, 0, 1, 0, 0, 0]),
            ("example", "RX1 preamble acquisition timeout: Radio switches frequency and opens RX2 window at T+2.0s.", "0x90", 144, [1, 0, 0, 1, 0, 0, 0, 0]),
            ("tryIt", "Switch node profile to Class C: Continuous listening enabled across all non-transmitting periods.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 42 Part 2 — Over-The-Air Activation (OTAA) Cryptographic Handshake & DevNonce",
        "regName": "LORA_OTAA_JOIN_REG",
        "bitNames": ["JOIN_REQ_TX", "DEVNONCE_OK", "MIC_VERIFIED", "JOIN_ACCEPT_RX", "JOINNONCE_OK", "NWK_S_KEY_OK", "APP_S_KEY_OK", "SESSION_ACTIVE"],
        "steps": [
            ("say1", "Dispatch Join-Request frame: Non-volatile monotonic DevNonce latched and signed.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Join Server verifies Join-Request AES-CMAC MIC under root AppKey successfully.", "0xE0", 224, [1, 1, 1, 0, 0, 0, 0, 0]),
            ("example", "Demodulate Join-Accept frame: Validate JoinNonce freshness and derive NwkSKey & AppSKey.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Commit activated OTAA session: Allocate 32-bit DevAddr and arm operational state machine.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 42 Part 3 — Dual-Key Cryptography: AES-128-CTR Confidentiality & AES-CMAC Integrity",
        "regName": "LORA_CRYPTO_ENGINE_REG",
        "bitNames": ["CRYPTO_EN", "AES_CTR_ACT", "BLOCK_AI_GEN", "PAYLOAD_ENC", "BLOCK_B0_GEN", "CMAC_CALC", "MIC_INSERTED", "CIPHER_DONE"],
        "steps": [
            ("say1", "Activate hardware crypto core: Construct counter block A_i incorporating DevAddr and FCnt.", "0xE0", 224, [1, 1, 1, 0, 0, 0, 0, 0]),
            ("say2", "Generate AES-128-CTR keystream and encrypt FRMPayload under AppSKey with zero padding overhead.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Construct integrity block B_0 and compute RFC 4493 AES-128-CMAC signature under NwkSKey.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Append 4-byte MIC to physical frame: Output fully authenticated, multi-tenant secure payload.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 42 Part 4 — Frame Counter (FCnt) Synchronization, Replay Mitigation & MAC Commands",
        "regName": "LORA_FCNT_MAC_CTRL_REG",
        "bitNames": ["FCNT_SYNC", "REPLAY_PASS", "GAP_WITHIN_MAX", "ROLLOVER_LOK", "FOPTS_PRESENT", "LINK_CHK_ANS", "DEV_STAT_ANS", "DUTY_CYC_ACK"],
        "steps": [
            ("say1", "Verify monotonic FCnt sequence: Confirm incoming counter exceeds previous value to block replay.", "0xE0", 224, [1, 1, 1, 0, 0, 0, 0, 0]),
            ("say2", "Synchronize 16-bit physical FHDR counter with 32-bit internal cryptographic rollover state.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Extract in-band FOpts header field: Process LinkCheckReq link margin and DevStatusReq battery status.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Commit LinkADR and DutyCycle MAC responses: Lock dynamic RF configuration into end device.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 42 Part 5 — Masterclass Synthesis: Full LoRaWAN L2 1.0.4 MAC & OTAA State Machine Engine",
        "regName": "LORA_MASTER_MAC_REG",
        "bitNames": ["MAC_INITIALIZED", "OTAA_JOINED", "FCNT_LOCK", "CIPHER_OK", "CMAC_OK", "TELEMETRY_TX", "RX_WINDOWS_RDY", "CERT_TOKEN_OK"],
        "steps": [
            ("say1", "Initialize LoRaWAN L2 1.0.4 stack: Complete OTAA cryptographic handshake and derive session keys.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Lock 32-bit frame counter sequencer and activate dual-key AES-CTR/CMAC isolation pipeline.", "0xF0", 240, [1, 1, 1, 1, 0, 0, 0, 0]),
            ("example", "Dispatch authenticated telemetry frame: Verify 4-byte MIC and arm microsecond RX1/RX2 timers.", "0xFC", 252, [1, 1, 1, 1, 1, 1, 0, 0]),
            ("tryIt", "Emit enterprise certification token LORAWAN_MAC_OTAA_SECURITY_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "schemaVersion": "2.0.0",
    "prefix": "iot_net",
    "coursePrefix": "iot_net",
    "day": 42,
    "title": "LoRaWAN MAC: Device Classes A/B/C, OTAA Join & AES-128 Security",
    "promptSha": "lorawan-l2-mac-otaa-crypto-day42-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-42.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-42.json successfully with domain-accurate hardware registers.")
