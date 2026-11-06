import json
import hashlib

with open("scripts/day-53-data.json", "r", encoding="utf-8") as f:
    day53_data = json.load(f)

parts = day53_data["parts"]

# Hardware register specifications for Day 53
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 53 Part 1 — MQTT-SN Architecture, Transport Independence & Header Framing",
        "regName": "MQTTSN_HEADER_TRANS_REG",
        "bitNames": ["DATAGRAM_MODE_EN", "HEADER_2B_SELECT", "LEN_255B_MAX", "EXT_HDR_DETECT", "CONNECT_DECODE_OK", "PUB_MSG_MATCH", "QOS_M1_FIRE_FORGET", "MQTTSN_FRAME_VALID"],
        "steps": [
            ("say1", "Configure connectionless datagram transport: Enable 2-byte compact header framing.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Parse standard header: Extract 1-byte length (10B) and Message Type 0x04 (CONNECT).", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Detect extended header: Byte 0x01 flags 16-bit Big-Endian length (256B) for large payload.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Enable QoS -1 unauthenticated transmission: Stream sensor payload in under 2 milliseconds.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 53 Part 2 — 2-Byte Topic ID Registration & Pre-defined Topic Names",
        "regName": "MQTTSN_TOPIC_REG_REG",
        "bitNames": ["REGISTER_REQ_IN", "TOPIC_STR_PARSED", "TOPIC_ID_ALLOC", "REGACK_RESP_TX", "PREDEF_TOPIC_MATCH", "SHORT_NAME_2CHAR", "MAPPING_TABLE_SYNC", "TOPIC_REG_CONVERGED"],
        "steps": [
            ("say1", "Receive REGISTER request containing full 32-character UTF-8 topic string.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Allocate 16-bit Topic ID 0x0001 and return confirmed REGACK frame with RC=0x00.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Map pre-defined Topic ID 1 to factory/cell1/status and route 2-character short topic.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Transmit subsequent PUBLISH datagram using 2-byte Topic ID, saving 70 bytes per frame.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 53 Part 3 — Gateway Topologies: Transparent vs Aggregating Gateways",
        "regName": "MQTTSN_GATEWAY_MODE_REG",
        "bitNames": ["ADVERTISE_BC_EN", "GW_ID_LATCH", "SEARCHGW_RECV", "GWINFO_RESP_TX", "TRANSPARENT_MODE", "AGGREGATING_MODE", "TCP_SOCKET_CONSERV", "GW_BRIDGE_READY"],
        "steps": [
            ("say1", "Broadcast periodic ADVERTISE beacons on physical fieldbus with Gateway ID 2 and 900s duration.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Respond to sensor SEARCHGW discovery query with targeted GWINFO transmission.", "0x8B", 139, [1, 0, 0, 0, 1, 0, 1, 1]),
            ("example", "Enable Aggregating Gateway mode: Multiplex 5 field sensors across 1 shared broker TCP socket.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Prevent TCP socket exhaustion on gateway and shield upstream cloud broker from churn.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 53 Part 4 — Asynchronous Device Sleep & Buffered Message Polling",
        "regName": "MQTTSN_SLEEPY_POLL_REG",
        "bitNames": ["DISCONNECT_DURATION", "CLIENT_ASLEEP_FLAG", "DOWNLINK_BUFFER_EN", "CMD_QUEUE_LATCH", "WAKEUP_PINGREQ_IN", "DOWNLINK_BURST_TX", "PINGRESP_SENT", "SLEEP_CYCLE_PASS"],
        "steps": [
            ("say1", "Receive DISCONNECT with 7200s Duration field: Transition client to ASLEEP state.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Capture supervisory valve command from cloud and stage payload in gateway FIFO buffer.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Client awakens on RTC timer: Receive PINGREQ with Client ID and flush 2 buffered commands.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Return PINGRESP to signal buffer empty: Client returns to deep sleep in under 20 ms.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 53 Part 5 — Masterclass Synthesis: Comprehensive MQTT-SN Industrial Gateway",
        "regName": "MQTTSN_MASTER_ENGINE_REG",
        "bitNames": ["GW_MASTER_INIT", "TOPIC_MAP_LATCH", "BINARY_INGEST_OK", "MQTT_BRIDGE_PASS", "STORE_FORWARD_EN", "MTLS_UPSTREAM_OK", "TOKEN_LATCH_OK", "MQTTSN_CERTIFIED"],
        "steps": [
            ("say1", "Initialize MqttSnIndustrialGatewayMaster: Announce gateway presence on 802.15.4 fieldbus.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Register Topic ID 1 for boiler temperature and Topic ID 2 for pump vibration telemetry.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Bridge binary telemetry to enterprise MQTT broker with mTLS encryption and topic re-mapping.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify zero packet drops across sleepy cycles and latch token MQTTSN_CONSTRAINED_GATEWAY_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 53,
    "title": "MQTT-SN Protocol: Constrained Gateways, Topic ID Registration & Sleepy Clients",
    "promptSha": "mqtt-sn-constrained-gateway-day53-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-53.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-53.json successfully with domain-accurate hardware registers.")
