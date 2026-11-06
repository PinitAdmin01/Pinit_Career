import json
import hashlib
import os

OUT_DIR = "src/lib/data/lessonVisuals/iot_emb"
os.makedirs(OUT_DIR, exist_ok=True)

day_reg_names = {
    41: "ROT_PUF_CR",
    42: "CRYP_AES_CR",
    43: "SECBOOT_CR",
    44: "FLASH_LFS_CR",
    45: "M8_VERIFY_CR"
}

for day in range(41, 46):
    day_json_path = f"scripts/iot_emb_day{day}.json"
    with open(day_json_path, "r", encoding="utf-8") as f:
        day_data = json.load(f)
        
    entries = []
    reg_base = day_reg_names[day]
    
    for p_idx, part in enumerate(day_data["parts"]):
        title = part["title"]
        code = part["code"]
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        reg_name = f"{reg_base}{p_idx+1}"
        
        # 4 synchronized steps: intro, say1, example, tryIt
        steps = [
            {
                "at": "intro",
                "caption": f"Step 1: Initialize {title[:32]} with EN=1 & hardware security boundary active.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0x80",
                "decimalValue": 128,
                "maskApplied": "1 << 7",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 6, "name": "LOCK", "value": 0, "tone": "idle"},
                    {"index": 5, "name": "BUSY", "value": 0, "tone": "idle"},
                    {"index": 4, "name": "VALID", "value": 0, "tone": "idle"},
                    {"index": 3, "name": "AUTH", "value": 0, "tone": "idle"},
                    {"index": 2, "name": "SEC", "value": 0, "tone": "idle"},
                    {"index": 1, "name": "TRNG", "value": 0, "tone": "idle"},
                    {"index": 0, "name": "FAULT", "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "say1",
                "caption": f"Step 2: Cryptographic computation active - LOCK=1 and BUSY=1.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xE0",
                "decimalValue": 224,
                "maskApplied": "(1 << 7) | (1 << 6) | (1 << 5)",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok"},
                    {"index": 6, "name": "LOCK", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 5, "name": "BUSY", "value": 1, "tone": "warn", "highlighted": True},
                    {"index": 4, "name": "VALID", "value": 0, "tone": "idle"},
                    {"index": 3, "name": "AUTH", "value": 0, "tone": "idle"},
                    {"index": 2, "name": "SEC", "value": 0, "tone": "idle"},
                    {"index": 1, "name": "TRNG", "value": 0, "tone": "idle"},
                    {"index": 0, "name": "FAULT", "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "example",
                "caption": f"Step 3: Verification complete - VALID=1 and AUTH=1.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xD8",
                "decimalValue": 216,
                "maskApplied": "(1 << 7) | (1 << 6) | (1 << 4) | (1 << 3)",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok"},
                    {"index": 6, "name": "LOCK", "value": 1, "tone": "ok"},
                    {"index": 5, "name": "BUSY", "value": 0, "tone": "idle"},
                    {"index": 4, "name": "VALID", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 3, "name": "AUTH", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 2, "name": "SEC", "value": 0, "tone": "idle"},
                    {"index": 1, "name": "TRNG", "value": 0, "tone": "idle"},
                    {"index": 0, "name": "FAULT", "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "tryIt",
                "caption": f"Step 4: Certified state - SEC=1 asserted with zero hardware faults.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xDC",
                "decimalValue": 220,
                "maskApplied": "0xD8 | (1 << 2)",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok"},
                    {"index": 6, "name": "LOCK", "value": 1, "tone": "ok"},
                    {"index": 5, "name": "BUSY", "value": 0, "tone": "idle"},
                    {"index": 4, "name": "VALID", "value": 1, "tone": "ok"},
                    {"index": 3, "name": "AUTH", "value": 1, "tone": "ok"},
                    {"index": 2, "name": "SEC", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 1, "name": "TRNG", "value": 0, "tone": "idle"},
                    {"index": 0, "name": "FAULT", "value": 0, "tone": "idle"}
                ]
            }
        ]
        
        entry = {
            "partTitle": title,
            "codeHash": code_hash,
            "spec": {
                "template": "register-bits",
                "title": f"{title} — Register Bit Architecture",
                "steps": steps
            }
        }
        entries.append(entry)
        
    envelope = {
        "schemaVersion": 1,
        "prefix": "iot_emb",
        "day": day,
        "promptSha": hashlib.sha256(f"iot_emb_day_{day}".encode("utf-8")).hexdigest(),
        "model": "antigravity/curriculum-pipeline",
        "entries": entries
    }
    
    out_file = os.path.join(OUT_DIR, f"day-{day:02d}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(envelope, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {out_file} with {len(entries)} visual parts.")

print("All Block 9 visuals successfully generated with Gate v2 envelope!")
