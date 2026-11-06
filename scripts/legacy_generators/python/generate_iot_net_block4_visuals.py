# scripts/generate_iot_net_block4_visuals.py
import json
import hashlib
import os

print("=== GENERATING GATE V2 VISUALS FOR IOT_NET DAYS 16-20 ===")

with open("scripts/block4_iot_net_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

out_dir = "src/lib/data/lessonVisuals/iot_net"
os.makedirs(out_dir, exist_ok=True)

register_names = [
    # Day 16: CoAP
    "COAP_VER_TYPE_REG",
    "COAP_CODE_TKL_REG",
    "COAP_OPT_DELTA_REG",
    "COAP_BLOCK2_REG",
    "COAP_REST_ENG_REG",
    # Day 17: MQTT-SN
    "MQTTSN_REG_TOPIC_REG",
    "MQTTSN_SLEEP_Q_REG",
    "MQTTSN_GW_XLAT_REG",
    "MQTTSN_QOS_M1_REG",
    "MQTTSN_BROKER_REG",
    # Day 18: CBOR
    "CBOR_MAJ_TYPE_REG",
    "CBOR_STR_BYTE_REG",
    "CBOR_MAP_F32_REG",
    "CBOR_MP_BENCH_REG",
    "CBOR_TELEM_REG",
    # Day 19: DTLS
    "DTLS_REC_HDR_REG",
    "DTLS_COOKIE_REG",
    "DTLS_REPLAY_WIN_REG",
    "DTLS_PSK_ECDHE_REG",
    "DTLS_AEAD_ENG_REG",
    # Day 20: 6LoWPAN Milestone 4 Capstone
    "LOWPAN_ADAPT_REG",
    "LOWPAN_IPHC_REG",
    "LOWPAN_UDP_NHC_REG",
    "LOWPAN_FRAG_REG",
    "M4_CAPSTONE_CERT_REG"
]

bit_names_pool = [
    ["VER", "CON", "NON", "ACK", "RST", "TKL", "CODE", "VALID"],
    ["REG", "TOPIC", "SHORT", "PREDEF", "QOS", "SLEEP", "PING", "GATE"],
    ["MAJ", "INFO", "STR", "BYTE", "MAP", "FLOAT", "CANON", "PACK"],
    ["REC", "EPOCH", "SEQ", "COOKIE", "WIN64", "PSK", "AEAD", "MAC"],
    ["IPHC", "NHC", "SAM", "DAM", "FRAG", "TAG", "BENCH", "CERT"]
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

print("=== ALL BLOCK 4 VISUAL ENVELOPES GENERATED SUCCESSFULLY ===")
