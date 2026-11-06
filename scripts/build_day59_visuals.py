# scripts/build_day59_visuals.py
import json
import hashlib

with open("scripts/day-59-data.json", "r", encoding="utf-8") as f:
    day59_data = json.load(f)

parts = day59_data["parts"]

reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 59 Part 1 — Dual-Bank Flash A/B Partition Manager & Golden Bootloader Architecture",
        "regName": "DUAL_BANK_CTRL_REG",
        "bitNames": ["FLASH_CONTROLLER_EN", "SLOT_A_ACTIVE", "SLOT_B_ACTIVE", "PASSIVE_STAGED_OK", "BOOT_FLAG_PENDING", "WATCHDOG_ARMED", "SELF_TEST_CONFIRM", "DUAL_BANK_STABLE"],
        "steps": [
            ("say1", "Initialize dual-bank flash controller: Slot A currently mapped to active execution vector.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Stage 2048 KB firmware image into passive Slot B while maintaining control loop execution.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("example", "Arm hardware watchdog timer and set non-volatile boot flag BOOT_SLOT_B_PENDING.", "0xBE", 190, [1, 0, 1, 1, 1, 1, 1, 0]),
            ("tryIt", "Execute atomic bootloader swap: Slot B becomes active and confirms validated self-test status.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 59 Part 2 — Cryptographic Firmware Signature Verification & Manifest Bundling",
        "regName": "FW_SIG_VERIFY_REG",
        "bitNames": ["CRYPTO_VERIFIER_EN", "OTP_EFUSE_PUBKEY", "STAGED_SHA256_CALC", "MANIFEST_DIGEST_MATCH", "ECDSA_P256_ACTIVE", "OEM_SIG_AUTHENTIC", "SLOT_SWAP_PERMIT", "SIGNATURE_VERIFIED"],
        "steps": [
            ("say1", "Activate cryptographic verification engine: Load immutable OEM public key from OTP eFuses.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Stream passive bank flash bytes through hardware SHA-256 accelerator: Calculate image digest.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Verify computed hash against manifest: Confirm zero flash bit flips or transmission noise.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Compute ECDSA P-256 signature verification: Assert OEM authenticity and permit bootloader swap.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 59 Part 3 — Anti-Rollback Protection & Hardware Monotonic Security Counters",
        "regName": "ANTI_ROLLBACK_REG",
        "bitNames": ["ANTI_ROLLBACK_EN", "HW_COUNTER_LATCH", "MANIFEST_EPOCH_IN", "EPOCH_COMPARE_ACTIVE", "DOWNGRADE_BLOCKED", "ONE_WAY_EFUSE_BLOW", "SECURITY_VER_ADVANCE", "ROLLBACK_PROTECT_OK"],
        "steps": [
            ("say1", "Initialize Anti-Rollback Protection Engine: Read hardware monotonic counter (Epoch 4) from silicon.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Intercept downgrade exploit attempt: Incoming binary carries vulnerable Security Epoch 2.", "0xB9", 185, [1, 0, 1, 1, 1, 0, 0, 1]),
            ("example", "Reject downgrade attack: Assert DOWNGRADE_BLOCKED and refuse bootloader slot swap.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Process legitimate update (Epoch 5): Permanently blow hardware eFuse and advance security baseline.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 59 Part 4 — Cellular/Satellite Delta Updates & Chunked Resumable Ingestion",
        "regName": "CHUNK_INGEST_REG",
        "bitNames": ["CHUNK_INGESTER_EN", "BITMAP_NONVOLATILE", "BLOCK_HEADER_PARSE", "CRC32_CHECK_PASS", "BLOCK_LATCH_NVRAM", "RESUMABLE_STATE_OK", "DELTA_DIFF_RECONSTRUCT", "TRANSFER_COMPLETE"],
        "steps": [
            ("say1", "Initialize Resumable Chunked Ingester: Configure 512-byte block size for low-bandwidth cellular link.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Receive and verify Block 0: Confirm CRC32 checksum and update persistent reception bitmap.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("example", "Recover from transient cellular drop: Resume ingestion at Block 1 without restarting from byte 0.", "0xBE", 190, [1, 0, 1, 1, 1, 1, 1, 0]),
            ("tryIt", "Latch final chunk: Apply binary delta differential patch and reconstruct complete target image.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 59 Part 5 — Masterclass Synthesis: Resilient Dual-Bank Secure OTA Firmware Engine",
        "regName": "OTA_MASTER_ENGINE_REG",
        "bitNames": ["OTA_ENGINE_INIT", "ANTI_ROLLBACK_GATE", "OEM_SIG_GATE", "DUAL_BANK_SWAP_OK", "WATCHDOG_CONFIRMED", "CANARY_TELEMETRY_PUB", "TOKEN_LATCH_OK", "OTA_ENGINE_CERTIFIED"],
        "steps": [
            ("say1", "Instantiate SecureOtaFirmwareEngine: Bind dual-bank controller, anti-rollback, and crypto verifier.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Intercept malicious downgrade attack: Intercept epoch 2 payload and increment incident telemetry.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Process genuine production upgrade: Verify signature, advance epoch to 4, and swap active slot.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Confirm post-boot health check and latch OTA_DUAL_BANK_FIRMWARE_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 59,
    "title": "Over-the-Air (OTA) Firmware Updates, Dual-Bank Flash A/B Partitioning & Rollback Protection",
    "promptSha": "ota-dual-bank-firmware-updates-day59-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-59.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-59.json successfully with domain-accurate hardware registers.")
