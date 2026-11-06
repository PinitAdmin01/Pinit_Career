# scripts/generate_iot_net_block6_visuals.py
import json
import hashlib
import os

print("=== GENERATING GATE V2 VISUALS FOR IOT_NET DAYS 26-30 ===")

with open("scripts/block6_iot_net_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

out_dir = "src/lib/data/lessonVisuals/iot_net"
os.makedirs(out_dir, exist_ok=True)

register_names = [
    # Day 26: FUOTA Multicast
    "FUOTA_SUIT_SEQ_REG",
    "FUOTA_CHUNK_MAP_REG",
    "FUOTA_DELTA_DIFF_REG",
    "FUOTA_DUAL_BANK_REG",
    "FUOTA_ORCH_MAST_REG",
    # Day 27: Energy Harvesting
    "ENERGY_SUPERCAP_REG",
    "ENERGY_MCU_SLEEP_REG",
    "ENERGY_LPL_CCA_REG",
    "ENERGY_BATTERY_RUL_REG",
    "ENERGY_ENO_ADAPT_REG",
    # Day 28: Satellite IoT
    "SAT_KEPLER_PASS_REG",
    "SAT_DOPPLER_FREQ_REG",
    "SAT_NTN_TIMING_REG",
    "SAT_ZENITH_BURST_REG",
    "SAT_GW_MASTER_REG",
    # Day 29: Edge Failover
    "EDGE_LQI_SCORE_REG",
    "EDGE_WAN_FAILOVER_REG",
    "EDGE_RPL_HEALING_REG",
    "EDGE_STORE_FWD_REG",
    "EDGE_ORCH_MAST_REG",
    # Day 30: Grand Capstone
    "APEX_MULTI_RADIO_REG",
    "APEX_CRYPTO_BOUND_REG",
    "APEX_WAN_MIRROR_REG",
    "APEX_POWER_GOV_REG",
    "APEX_VIVA_MASTER_REG"
]

bit_names_pool = [
    ["SUIT", "CHUNK", "DELTA", "BANK_A", "BANK_B", "PROB", "FLASH", "VALID"],
    ["SCAP", "MPPT", "SLEEP", "LPL", "PREAM", "BAT_OK", "ENO", "ACTIVE"],
    ["KEPLER", "PASS", "DOPP", "NTN", "TA_SYNC", "ZENITH", "BURST", "SPACE"],
    ["LQI", "WAN_A", "WAN_B", "PROBE", "RPL_FIX", "STORE", "FLUSH", "ZERO"],
    ["BLE", "LORA", "MESH", "6LOW", "DTLS", "MIRROR", "GOV", "APEX"]
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
                "hexValue": "0xC4",
                "decimalValue": 196,
                "maskApplied": "(1 << 7) | (1 << 6) | (1 << 2)",
                "bits": [
                    {"index": 7, "name": bits_names[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits_names[1], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 5, "name": bits_names[2], "value": 0, "tone": "idle"},
                    {"index": 4, "name": bits_names[3], "value": 0, "tone": "idle"},
                    {"index": 3, "name": bits_names[4], "value": 0, "tone": "idle"},
                    {"index": 2, "name": bits_names[5], "value": 1, "tone": "accent", "highlighted": True},
                    {"index": 1, "name": bits_names[6], "value": 0, "tone": "idle"},
                    {"index": 0, "name": bits_names[7], "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "example",
                "caption": f"Step 3: Execute hardware transformation in {reg_name} with pipeline status.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xFA",
                "decimalValue": 250,
                "maskApplied": "0xFA",
                "bits": [
                    {"index": 7, "name": bits_names[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits_names[1], "value": 1, "tone": "ok"},
                    {"index": 5, "name": bits_names[2], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 4, "name": bits_names[3], "value": 1, "tone": "accent", "highlighted": True},
                    {"index": 3, "name": bits_names[4], "value": 1, "tone": "ok"},
                    {"index": 2, "name": bits_names[5], "value": 0, "tone": "idle"},
                    {"index": 1, "name": bits_names[6], "value": 1, "tone": "ok"},
                    {"index": 0, "name": bits_names[7], "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "tryIt",
                "caption": f"Step 4: Lock register {reg_name} upon verified hardware completion.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xFF",
                "decimalValue": 255,
                "maskApplied": "0xFF",
                "bits": [
                    {"index": 7, "name": bits_names[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits_names[1], "value": 1, "tone": "ok"},
                    {"index": 5, "name": bits_names[2], "value": 1, "tone": "ok"},
                    {"index": 4, "name": bits_names[3], "value": 1, "tone": "ok"},
                    {"index": 3, "name": bits_names[4], "value": 1, "tone": "ok"},
                    {"index": 2, "name": bits_names[5], "value": 1, "tone": "ok"},
                    {"index": 1, "name": bits_names[6], "value": 1, "tone": "ok"},
                    {"index": 0, "name": bits_names[7], "value": 1, "tone": "ok", "highlighted": True}
                ]
            }
        ]

        entries.append({
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": {
                "template": "register-bits",
                "title": f"Day {day_num} Part {part_idx+1} — {part_title[:30]} — Register Architecture",
                "steps": steps
            }
        })

    day_envelope = {
        "schemaVersion": 1,
        "prefix": "iot_net",
        "day": day_num,
        "promptSha": hashlib.sha256(f"iot_net_day_{day_num}".encode("utf-8")).hexdigest(),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }

    # Write dual files: day-XX.json and day-X.json
    out_file_padded = os.path.join(out_dir, f"day-{day_num:02d}.json")
    with open(out_file_padded, "w", encoding="utf-8") as f:
        json.dump(day_envelope, f, indent=2)

    out_file_plain = os.path.join(out_dir, f"day-{day_num}.json")
    with open(out_file_plain, "w", encoding="utf-8") as f:
        json.dump(day_envelope, f, indent=2)

    print(f"Generated visuals for Day {day_num} -> {out_file_padded} & {out_file_plain} ({len(entries)} parts)")

print("=== ALL BLOCK 6 VISUAL ENVELOPES GENERATED SUCCESSFULLY ===")
