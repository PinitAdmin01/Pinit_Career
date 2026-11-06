import json
import hashlib

with open("scripts/day-52-data.json", "r", encoding="utf-8") as f:
    day52_data = json.load(f)

parts = day52_data["parts"]

# Hardware register specifications for Day 52
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 52 Part 1 — OPC UA Architecture & AddressSpace Information Modeling",
        "regName": "OPC_UA_ADDRSPACE_REG",
        "bitNames": ["ADDRSPACE_INIT", "ROOT_FOLDER_OK", "OBJECT_NODE_ADD", "VARIABLE_NODE_ADD", "METHOD_NODE_ADD", "REF_ORGANIZES", "REF_HAS_COMPONENT", "BROWSE_TREE_PASS"],
        "steps": [
            ("say1", "Initialize OPC UA AddressSpace: Instantiate standard Root (ns=0;i=84) and Objects folders.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Create ObjectNode for CentrifugalPump_01 linked to Objects folder via Organizes reference.", "0x87", 135, [1, 0, 0, 0, 0, 1, 1, 1]),
            ("example", "Attach VariableNodes MotorSpeed and BearingTemperature via HasComponent references.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Execute Browse service: Discover full industrial asset topology and component properties.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 52 Part 2 — NodeId Formats & DataValue Diagnostic Structures",
        "regName": "OPC_UA_NODEID_REG",
        "bitNames": ["NS_INDEX_RESOLV", "NUMERIC_ID_MATCH", "STRING_ID_MATCH", "DATAVALUE_CONTAIN", "STATUS_GOOD_0X0", "SRC_TIMESTAMP_SET", "SRV_TIMESTAMP_SET", "DATA_DIAG_PASS"],
        "steps": [
            ("say1", "Resolve Namespace Index: Map ns=2 to custom plant URI and parse NodeId identifier.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Encapsulate sensor reading within DataValue: Assign float value and StatusCode Good (0x00000000).", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Record microsecond UTC SourceTimestamp (sensor sample) and ServerTimestamp (ingestion).", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Format full diagnostic telemetry record and verify legal compliance audit trail.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 52 Part 3 — OPC UA Binary Encoding (UADP) & Serialization Engine",
        "regName": "OPC_UA_BINARY_ENC_REG",
        "bitNames": ["UADP_LITTLE_ENDIAN", "INT32_ENCODE_OK", "FLOAT32_ENCODE_OK", "STR_LEN_PREFIX_OK", "NULL_STR_0XFFFF", "ARRAY_PACK_CONTIG", "EXTENSION_OBJ_OK", "BINARY_STREAM_PASS"],
        "steps": [
            ("say1", "Initialize OPC UA Binary encoder: Configure Little-Endian serialization for numeric primitives.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Encode length-prefixed UTF-8 string: Prefix 4-byte Int32 length followed by raw byte payload.", "0x8B", 139, [1, 0, 0, 0, 1, 0, 1, 1]),
            ("example", "Serialize multi-variable packet: Pack node name, Int32 speed (1750 RPM), and Float temp (68.45 C).", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify zero-copy buffer deserialization and confirm 100% lossless binary round-trip.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 52 Part 4 — Secure Channel Architecture: OPC.TCP & Security Token Negotiation",
        "regName": "OPC_UA_SEC_CHANNEL_REG",
        "bitNames": ["OPCTCP_PORT_4840", "HELLO_ACK_SYNC", "SEC_POLICY_NEGOT", "ASYMM_CERT_EXCH", "X509_CA_VERIFY", "NONCE_32B_DERIVE", "AES256_SESSION_LATCH", "SEC_CHANNEL_ACTIVE"],
        "steps": [
            ("say1", "Establish raw TCP connection on port 4840: Complete Hello (HEL) and Acknowledge (ACK) handshake.", "0x83", 131, [1, 0, 0, 0, 0, 0, 1, 1]),
            ("say2", "Issue OpenSecureChannel request: Negotiate Basic256Sha256 security policy with SignAndEncrypt mode.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Exchange X.509 digital certificates and 32-byte nonces; verify CA signature trust chains.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Derive symmetric AES-256 session keys and latch active secure channel state.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 52 Part 5 — Masterclass Synthesis: Comprehensive OPC UA Industrial Server Engine",
        "regName": "OPC_UA_MASTER_SRV_REG",
        "bitNames": ["SRV_ENGINE_INIT", "SUBSCRIPTION_CREATE", "MONITORED_ITEM_REG", "DEADBAND_EVAL_EN", "PUB_INTERVAL_TICK", "NOTIFICATION_FIRE", "TOKEN_LATCH_OK", "OPCUA_SERVER_CERT"],
        "steps": [
            ("say1", "Initialize OpcUaMasterServerEngine: Register TurbineSpeed variable with 3600 RPM baseline.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Create Subscription with 250ms interval and attach MonitoredItem with 5.0 RPM deadband.", "0x8F", 143, [1, 0, 0, 0, 1, 1, 1, 1]),
            ("example", "Sample sensor reading 3602 RPM: Fluctuation (< 5.0) suppressed by deadband filter.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Sample sensor reading 3608.5 RPM: Exceeds deadband; fire notification and latch token.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 52,
    "title": "OPC UA: Information Modeling, AddressSpace Nodes, Binary Encoding & Secure Transport",
    "promptSha": "opc-ua-industrial-info-model-day52-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-52.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-52.json successfully with domain-accurate hardware registers.")
