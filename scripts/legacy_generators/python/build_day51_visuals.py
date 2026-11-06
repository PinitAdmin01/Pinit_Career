import json
import hashlib

with open("scripts/day-51-data.json", "r", encoding="utf-8") as f:
    day51_data = json.load(f)

parts = day51_data["parts"]

# Hardware register specifications for Day 51
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 51 Part 1 — Modbus RTU Framing, RS-485 Physical Layer & 3.5 Character Silent Interval",
        "regName": "MODBUS_RTU_FRAME_REG",
        "bitNames": ["RS485_DIFF_EN", "TERMINATION_120R", "BAUD_9600_LATCH", "SILENT_T35_ARM", "FRAME_DEMARC_OK", "SLAVE_ADDR_MATCH", "FUNC_DECODE_OK", "RTU_FRAME_READY"],
        "steps": [
            ("say1", "Configure RS-485 transceiver: Enable differential driver and 120-ohm bus termination.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Arm frame timer: Measure 3.5 character silent interval (4.01 ms at 9600 baud).", "0x8B", 139, [1, 0, 0, 0, 1, 0, 1, 1]),
            ("example", "Detect valid t3.5 bus silence and initiate slave address and function code decoding.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Complete Modbus RTU frame demarcation and prepare PDU payload for verification.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 51 Part 2 — CRC-16 Calculation & Error Detection (Modbus Polynomial 0xA001)",
        "regName": "MODBUS_CRC16_CALC_REG",
        "bitNames": ["CRC_PRESET_FFFF", "POLY_A001_LOAD", "LSB_SHIFT_EN", "XOR_REDUCTION_OK", "BYTE_PROC_LOOP", "LITTLE_ENDIAN_SWAP", "CRC_MATCH_OK", "FRAME_INTEG_PASS"],
        "steps": [
            ("say1", "Initialize 16-bit CRC register to 0xFFFF and load reflected polynomial 0xA001.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Process PDU bytes: Execute 8-bit right shifts with conditional 0xA001 XOR reduction.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Swap CRC bytes to Little-Endian transmission order (low byte first) and append to frame.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify zero remainder across complete frame and latch integrity pass flag.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 51 Part 3 — Modbus Register Model & Function Codes (01, 02, 03, 04, 05, 06, 15, 16)",
        "regName": "MODBUS_FUNC_EXEC_REG",
        "bitNames": ["TABLE_ADDR_RESOLV", "HOLDING_REG_SEL", "FUNC_03_READ_OK", "FUNC_16_WRITE_OK", "BYTE_COUNT_LATCH", "MULTI_WORD_FLOAT", "EXCEPTION_CHECK", "REG_OP_SUCCESS"],
        "steps": [
            ("say1", "Resolve Modbus data table: Map PDU address 0x000A to 4x Holding Register table.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Execute Function 16: Write motor speed (1750 RPM) and temperature setpoint (68 C).", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Execute Function 03: Read back 2 holding registers and format byte count header.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify error-free register operation and confirm zero exception codes returned.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 51 Part 4 — Modbus TCP Protocol: MBAP Header, Transaction IDs & Socket Multiplexing",
        "regName": "MODBUS_TCP_MBAP_REG",
        "bitNames": ["TCP_PORT_502_BIND", "MBAP_HEADER_GEN", "TID_INCREMENT", "PROTO_ID_ZERO", "LEN_FIELD_CALC", "UNIT_ID_ROUTE", "SOCKET_POOL_OK", "TCP_FRAME_PASS"],
        "steps": [
            ("say1", "Bind Modbus TCP server to designated TCP port 502 with socket pooling enabled.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Generate 7-byte MBAP header: Increment Transaction ID and enforce Protocol ID 0x0000.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Calculate MBAP length field and route command PDU to downstream Unit ID 1.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Transmit multiplexed Modbus TCP request across persistent socket with TCP checksum integrity.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 51 Part 5 — Masterclass Synthesis: Comprehensive Modbus RTU/TCP Industrial Bridge",
        "regName": "MODBUS_MASTER_BRIDGE_REG",
        "bitNames": ["GW_CORE_INIT", "RTU_POLL_CYCLE", "CRC_ERROR_MON", "TCP_RELAY_ACTIVE", "TELEMETRY_CACHE_OK", "STORE_FORWARD_ARM", "TOKEN_LATCH_OK", "MODBUS_BRIDGE_CERT"],
        "steps": [
            ("say1", "Initialize ModbusIndustrialBridgeEngine: Bind RS-485 serial port and Ethernet TCP socket.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Execute cyclic polling across Unit 1 (Pump Station) and Unit 2 (VFD Inverter).", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Buffer telemetry readings into edge cache and relay structured data over Modbus TCP.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify zero CRC corruptions across polling tasks and latch token MODBUS_INDUSTRIAL_PROTOCOL_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 51,
    "title": "Modbus Protocol Suite: Modbus RTU, RS-485 Serial & Modbus TCP Industrial Bridging",
    "promptSha": "modbus-rtu-tcp-industrial-day51-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-51.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-51.json successfully with domain-accurate hardware registers.")
