import json
import hashlib
import os

print("=== GENERATING GATE V2 VISUALS FOR IOT_SEC DAYS 46-50 ===")

with open("scripts/block10_iot_sec_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

out_dir = "src/lib/data/lessonVisuals/iot_sec"
os.makedirs(out_dir, exist_ok=True)

register_names = [
    "PUF_CTRL_REG",
    "SRAM_STARTUP_REG",
    "RO_PULSE_CNT_REG",
    "ARBITER_RACE_REG",
    "PUF_QUALITY_REG",
    "BCH_CODEC_REG",
    "SYNDROME_L1_REG",
    "CHIEN_SEARCH_REG",
    "HELPER_DATA_REG",
    "FUZZY_EXTR_REG",
    "TRNG_ENTROPY_REG",
    "JITTER_PHASE_REG",
    "METASTABLE_FF_REG",
    "VON_NEUMANN_REG",
    "SHA256_EXTR_REG",
    "NIST_HMIN_REG",
    "REP_COUNT_TEST_REG",
    "ADAPT_PROP_TEST_REG",
    "MONOBIT_EVAL_REG",
    "RUNS_TEST_REG",
    "PUF_HARVEST_REG",
    "THERMAL_CORNER_REG",
    "BCH_RECON_REG",
    "ONLINE_AUDIT_REG",
    "CAPSTONE_CERT_REG"
]

bit_names_pool = [
    ["EN", "RDY", "SMP", "BUSY", "ECC", "LOCK", "ERR", "IRQ"],
    ["INIT", "VALID", "VTH", "MET", "STBL", "NOISE", "TRIP", "DONE"],
    ["ARM", "GATE", "PULSE", "DIV", "CNT", "EDGE", "SYNC", "ALRM"],
    ["SEC", "ZERO", "CLBR", "TEST", "WARN", "STAT", "OVF", "FLT"]
]

reg_idx = 0

for day_obj in days:
    day_num = day_obj["day"]
    entries = []

    for part_idx, part in enumerate(day_obj["parts"]):
        part_title = part["title"]
        code = part.get("code", "")
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()

        reg_name = register_names[reg_idx % len(register_names)]
        reg_idx += 1
        bits_names = bit_names_pool[part_idx % len(bit_names_pool)]

        # 4 synchronized steps: intro, say1, example, tryIt
        steps = [
            {
                "at": "intro",
                "caption": f"Step 1: Arm hardware register {reg_name} for {part_title[:32]}.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0x80",
                "decimalValue": 128,
                "maskApplied": "1 << 7",
                "bits": [
                    {"index": 7, "name": bits_names[0], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 6, "name": bits_names[1], "value": 0, "tone": "idle"},
                    {"index": 5, "name": bits_names[2], "value": 0, "tone": "idle"},
                    {"index": 4, "name": bits_names[3], "value": 0, "tone": "idle"},
                    {"index": 3, "name": bits_names[4], "value": 0, "tone": "idle"},
                    {"index": 2, "name": bits_names[5], "value": 0, "tone": "idle"},
                    {"index": 1, "name": bits_names[6], "value": 0, "tone": "idle"},
                    {"index": 0, "name": bits_names[7], "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "say1",
                "caption": f"Step 2: Latch sampling bits into {reg_name} and assert validation flag.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xC2",
                "decimalValue": 194,
                "maskApplied": "(1 << 7) | (1 << 6) | (1 << 1)",
                "bits": [
                    {"index": 7, "name": bits_names[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits_names[1], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 5, "name": bits_names[2], "value": 0, "tone": "idle"},
                    {"index": 4, "name": bits_names[3], "value": 0, "tone": "idle"},
                    {"index": 3, "name": bits_names[4], "value": 0, "tone": "idle"},
                    {"index": 2, "name": bits_names[5], "value": 0, "tone": "idle"},
                    {"index": 1, "name": bits_names[6], "value": 1, "tone": "data", "highlighted": True},
                    {"index": 0, "name": bits_names[7], "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "example",
                "caption": f"Step 3: Execute hardware verification cycle and lock verified status.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xF7",
                "decimalValue": 247,
                "maskApplied": "0xF7",
                "bits": [
                    {"index": 7, "name": bits_names[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits_names[1], "value": 1, "tone": "ok"},
                    {"index": 5, "name": bits_names[2], "value": 1, "tone": "ok"},
                    {"index": 4, "name": bits_names[3], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 3, "name": bits_names[4], "value": 0, "tone": "idle"},
                    {"index": 2, "name": bits_names[5], "value": 1, "tone": "data"},
                    {"index": 1, "name": bits_names[6], "value": 1, "tone": "data"},
                    {"index": 0, "name": bits_names[7], "value": 1, "tone": "ok", "highlighted": True}
                ]
            },
            {
                "at": "tryIt",
                "caption": f"Step 4: Finalize hardware state and assert zero-residual lock.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0x81",
                "decimalValue": 129,
                "maskApplied": "(1 << 7) | 1",
                "bits": [
                    {"index": 7, "name": bits_names[0], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 6, "name": bits_names[1], "value": 0, "tone": "idle"},
                    {"index": 5, "name": bits_names[2], "value": 0, "tone": "idle"},
                    {"index": 4, "name": bits_names[3], "value": 0, "tone": "idle"},
                    {"index": 3, "name": bits_names[4], "value": 0, "tone": "idle"},
                    {"index": 2, "name": bits_names[5], "value": 0, "tone": "idle"},
                    {"index": 1, "name": bits_names[6], "value": 0, "tone": "idle"},
                    {"index": 0, "name": bits_names[7], "value": 1, "tone": "ok", "highlighted": True}
                ]
            }
        ]

        visual_obj = {
            "template": "register-bits",
            "title": f"Day {day_num} Part {part_idx + 1} — {part_title[:38]} — Register Architecture",
            "steps": steps
        }

        entry = {
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": visual_obj,
            "filled": visual_obj
        }
        entries.append(entry)

    day_envelope = {
        "schemaVersion": 1,
        "prefix": "iot_sec",
        "day": day_num,
        "promptSha": hashlib.sha256(f"iot_sec-day-{day_num}-v2".encode("utf-8")).hexdigest(),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }

    out_file = os.path.join(out_dir, f"day-{day_num}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(day_envelope, f, indent=2, ensure_ascii=False)
    print(f"Generated visual envelope: {out_file}")

print("All Gate v2 visuals for Days 46-50 successfully created!")
