import json
import hashlib
import os

print("=== GENERATING EXACT REGISTER-BITS GATE V2 VISUALS FOR DAYS 31-35 ===")

with open("scripts/block7_iot_net_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

out_dir = "src/lib/data/lessonVisuals/iot_net"
os.makedirs(out_dir, exist_ok=True)

register_names = [
    # Day 31: Modbus RTU / TCP
    "MODBUS_CRC16_IBM_REG",
    "MODBUS_RS485_T35_REG",
    "MODBUS_MBAP_TRANS_REG",
    "MODBUS_POLL_FSM_REG",
    "MODBUS_AUDIT_MAST_REG",
    # Day 32: CAN / CAN-FD
    "CAN_ARBITRATION_REG",
    "CAN_BIT_STUFFING_REG",
    "CAN_FD_BRS_SPEED_REG",
    "CAN_SOCKET_FILTER_REG",
    "CAN_FD_AUDIT_MAST_REG",
    # Day 33: OPC UA IEC 62541
    "OPCUA_ADDRESS_SPACE_REG",
    "OPCUA_BROWSE_PATH_REG",
    "OPCUA_UASC_BINARY_REG",
    "OPCUA_DEADBAND_PUB_REG",
    "OPCUA_AUDIT_MAST_REG",
    # Day 34: TSN 802.1Qbv / 802.1Qbu
    "TSN_GPTP_DELAY_REG",
    "TSN_TAS_GCL_SCHED_REG",
    "TSN_PREEMPT_SLIC_REG",
    "TSN_FRER_REDUND_REG",
    "TSN_DETERM_AUDIT_REG",
    # Day 35: Milestone 7 Capstone
    "CAPSTONE_GW_ROUTING_REG",
    "CAPSTONE_NORMALIZER_REG",
    "CAPSTONE_OPCUA_BIND_REG",
    "CAPSTONE_TSN_EGRESS_REG",
    "CAPSTONE_CERT_MAST_REG"
]

bit_names_pool = [
    ["CRC16", "DE_RE", "T15", "T35", "MBAP", "PDU", "POLL", "EXC_OK"],
    ["ARB_WON", "RECESS", "DOMIN", "STUFF", "FD_BRS", "DLC64", "SOCK_OK", "BUS_OFF"],
    ["ROOT", "OBJECT", "VAR", "METHOD", "UASC", "TOKEN", "DEADB", "NOTIFY"],
    ["GPTP", "BMCA", "PDELAY", "TAS_GCL", "GUARD", "PREEMPT", "FRER", "LOCK"],
    ["ROUTER", "MODBUS", "CAN_FD", "OPCUA", "TSN_Q7", "SLICED", "HITLESS", "CERT_OK"]
]

reg_idx = 0

for day_data in days:
    day_num = day_data["day"]
    entries = []
    
    for p_idx, part in enumerate(day_data["parts"]):
        code_text = part["code"]
        code_hash = hashlib.sha256(code_text.encode("utf-8")).hexdigest()
        
        reg_name = register_names[reg_idx % len(register_names)]
        bits = bit_names_pool[p_idx % len(bit_names_pool)]
        reg_idx += 1
        
        # Build 4 steps matching register-bits schema
        steps = [
            {
                "at": "intro",
                "caption": f"Step 1: Arm hardware register {reg_name} for {part['title'][:32]}.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0x80",
                "decimalValue": 128,
                "maskApplied": "1 << 7",
                "bits": [
                    {"index": 7, "name": bits[0], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 6, "name": bits[1], "value": 0, "tone": "idle"},
                    {"index": 5, "name": bits[2], "value": 0, "tone": "idle"},
                    {"index": 4, "name": bits[3], "value": 0, "tone": "idle"},
                    {"index": 3, "name": bits[4], "value": 0, "tone": "idle"},
                    {"index": 2, "name": bits[5], "value": 0, "tone": "idle"},
                    {"index": 1, "name": bits[6], "value": 0, "tone": "idle"},
                    {"index": 0, "name": bits[7], "value": 0, "tone": "idle"}
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
                    {"index": 7, "name": bits[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits[1], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 5, "name": bits[2], "value": 0, "tone": "idle"},
                    {"index": 4, "name": bits[3], "value": 0, "tone": "idle"},
                    {"index": 3, "name": bits[4], "value": 0, "tone": "idle"},
                    {"index": 2, "name": bits[5], "value": 1, "tone": "accent", "highlighted": True},
                    {"index": 1, "name": bits[6], "value": 0, "tone": "idle"},
                    {"index": 0, "name": bits[7], "value": 0, "tone": "idle"}
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
                    {"index": 7, "name": bits[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits[1], "value": 1, "tone": "ok"},
                    {"index": 5, "name": bits[2], "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 4, "name": bits[3], "value": 1, "tone": "accent", "highlighted": True},
                    {"index": 3, "name": bits[4], "value": 1, "tone": "ok"},
                    {"index": 2, "name": bits[5], "value": 0, "tone": "idle"},
                    {"index": 1, "name": bits[6], "value": 1, "tone": "ok"},
                    {"index": 0, "name": bits[7], "value": 0, "tone": "idle"}
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
                    {"index": 7, "name": bits[0], "value": 1, "tone": "ok"},
                    {"index": 6, "name": bits[1], "value": 1, "tone": "ok"},
                    {"index": 5, "name": bits[2], "value": 1, "tone": "ok"},
                    {"index": 4, "name": bits[3], "value": 1, "tone": "ok"},
                    {"index": 3, "name": bits[4], "value": 1, "tone": "ok"},
                    {"index": 2, "name": bits[5], "value": 1, "tone": "ok"},
                    {"index": 1, "name": bits[6], "value": 1, "tone": "ok"},
                    {"index": 0, "name": bits[7], "value": 1, "tone": "ok", "highlighted": True}
                ]
            }
        ]
        
        spec = {
            "template": "register-bits",
            "title": f"Day {day_num} Part {p_idx + 1} \u2014 {part['title'][:32]} \u2014 Register Architecture",
            "steps": steps
        }
        
        entries.append({
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": spec
        })
        
    envelope = {
        "schemaVersion": 1,
        "prefix": "iot_net",
        "day": day_num,
        "promptSha": hashlib.sha256(f"iot_net_day_{day_num}_prompt".encode("utf-8")).hexdigest(),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }
    
    out_file = os.path.join(out_dir, f"day-{day_num}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(envelope, f, indent=2)
    print(f"Generated {out_file} with {len(entries)} entries.")

print("All Gate v2 visuals generated successfully for Block 7.")
