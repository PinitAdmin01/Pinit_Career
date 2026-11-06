import json
import hashlib

with open("scripts/day-55-data.json", "r", encoding="utf-8") as f:
    day55_data = json.load(f)

parts = day55_data["parts"]

reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 55 Part 1 — Industrial Edge Gateway Architecture & Interface Topology",
        "regName": "IND_GW_ARCH_REG",
        "bitNames": ["OT_PHY_INTERFACES_OK", "MODBUS_RS485_UP", "OPC_UA_TCP_UP", "MQTTSN_RADIO_UP", "TSN_PORT_UP", "FIREWALL_ZONE_OK", "SECURITY_BOUNDARY_OK", "GW_ARCH_READY"],
        "steps": [
            ("say1", "Initialize multi-interface industrial edge gateway: Audit physical layer controllers.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Verify OT serial and Ethernet links: Modbus RS-485 UP, OPC UA 100BASE-TX UP.", "0xE7", 231, [1, 1, 1, 0, 0, 1, 1, 1]),
            ("example", "Bring up IEEE 802.15.4 wireless modem and Gigabit TSN deterministic switch port.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Engage ISA/IEC 62443 security boundary lock: Confirm zero listening ports on WAN uplink.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 55 Part 2 — High-Performance Multi-Protocol Field Ingestion Engine",
        "regName": "IND_GW_INGEST_REG",
        "bitNames": ["INGEST_ENGINE_EN", "MODBUS_POLL_TICK", "OPC_SUB_NOTIFY", "MQTTSN_RECV_PACKET", "TSN_EXPRESS_LATCH", "INGEST_FIFO_OK", "ZERO_FRAME_DROP", "INGEST_CYCLE_PASS"],
        "steps": [
            ("say1", "Launch asynchronous ingestion engine: Dispatch dedicated workers for each fieldbus driver.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Decode synchronous Modbus RTU response: Extract 16-bit register value 1850 with valid CRC-16.", "0xC7", 199, [1, 1, 0, 0, 0, 1, 1, 1]),
            ("example", "Ingest OPC UA double variant (45.85 degC) and unpack 8-byte MQTT-SN datagram.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Commit unpacked records to lock-free FIFO queue with zero dropped frames across all protocols.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 55 Part 3 — Industrial Data Normalization & Semantic Information Modeling",
        "regName": "IND_GW_SEMANTIC_NORM_REG",
        "bitNames": ["SEMANTIC_MAPPER_EN", "NODEID_EXTRACT_OK", "TIMESTAMP_UTC_LOCK", "SCALE_FACTOR_APPLY", "SPARKPLUG_B_PAYLOAD", "SCHEMA_VALID_JSON", "NORM_BUFFER_LATCH", "SEMANTIC_NORM_PASS"],
        "steps": [
            ("say1", "Activate SemanticDataNormalizer: Bind incoming records to ISA-95 asset hierarchy model.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Map Modbus register 40001 to PLANT_DETROIT.WELDING_CELL_04.MAIN_PUMP_01 rotational_speed.", "0xC7", 199, [1, 1, 0, 0, 0, 1, 1, 1]),
            ("example", "Apply engineering unit scaling (RPM, degC) and synchronize deterministic ISO-8601 UTC timestamp.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Serialize normalized JSON payload with verified schema structure and 100% quality flag.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 55 Part 4 — Edge Store-and-Forward Buffering & Offline Resiliency",
        "regName": "IND_GW_RESILIENCY_REG",
        "bitNames": ["STORE_FORWARD_EN", "CLOUD_LINK_ONLINE", "FLASH_QUEUE_APPEND", "FIFO_DRAIN_BURST", "DETERMINISTIC_QOS", "OFFLINE_RESILIENCY_PASS", "MTLS_SESSION_SECURE", "RESILIENCY_ENGINE_PASS"],
        "steps": [
            ("say1", "Publish telemetry live to cloud broker: Confirm immediate transmission over online WAN uplink.", "0xC1", 193, [1, 1, 0, 0, 0, 0, 0, 1]),
            ("say2", "Detect WAN disconnect event: Transition to autonomous offline buffering in non-volatile flash FIFO.", "0xA5", 165, [1, 0, 1, 0, 0, 1, 0, 1]),
            ("example", "Stage subsequent factory events locally without blocking fieldbus polling or dropping telemetry.", "0xBD", 189, [1, 0, 1, 1, 1, 1, 0, 1]),
            ("tryIt", "Restore WAN connection: Burst buffered backlog to cloud and verify 100% zero data loss.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 55 Part 5 — 🏆 Milestone 11 Capstone: Multi-Protocol Industrial Edge Gateway Master Engine",
        "regName": "IND_GW_MASTER_CAPSTONE_REG",
        "bitNames": ["CAPSTONE_MASTER_INIT", "FIELD_INGEST_CONVERGED", "SEMANTIC_PIPELINE_OK", "STORE_FORWARD_ACTIVE", "CLOUD_EGRESS_STREAM_OK", "ZERO_DATA_LOSS_PASS", "TOKEN_LATCH_OK", "IND_GATEWAY_CERTIFIED"],
        "steps": [
            ("say1", "Initialize IndustrialEdgeGatewayMasterEngine: Orchestrate multi-protocol fieldbus translation.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Ingest Modbus, OPC UA, and MQTT-SN frames: Apply ISA-95 normalization and unit scaling.", "0xE7", 231, [1, 1, 1, 0, 0, 1, 1, 1]),
            ("example", "Simulate WAN link glitch: Buffer furnace telemetry in local flash, recover, and flush burst.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify 100% cloud telemetry arrival and latch INDUSTRIAL_IOT_GATEWAY_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 55,
    "title": "Milestone 11 Capstone: Multi-Protocol Industrial Edge Gateway & OT-to-Cloud Pipeline Engine",
    "promptSha": "milestone-11-industrial-gateway-capstone-day55-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-55.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-55.json successfully with domain-accurate hardware registers.")
