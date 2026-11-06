import json
import hashlib

with open("scripts/day-56-data.json", "r", encoding="utf-8") as f:
    day56_data = json.load(f)

parts = day56_data["parts"]

reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 56 Part 1 — Cloud Device Shadow Architecture: Desired vs Reported State & Delta Generation",
        "regName": "SHADOW_DELTA_SYNC_REG",
        "bitNames": ["SHADOW_ENGINE_EN", "DESIRED_LATCH_OK", "REPORTED_LATCH_OK", "DELTA_CALC_ACTIVE", "DELTA_TOPIC_PUB", "MQTT_BROKER_ACK", "VERSION_MATCH", "SHADOW_SYNC_VALID"],
        "steps": [
            ("say1", "Initialize cloud device shadow engine: Register physical thing SMART_HVAC_PUMP_04.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Ingest initial reported state: Latch pump_speed_rpm 1200 and valve_open False at Version 1.", "0xE7", 231, [1, 1, 1, 0, 0, 1, 1, 1]),
            ("example", "Cloud operator updates desired state: Advance to Version 2 and compute discrepancy.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Publish delta document to $aws/things/SMART_HVAC_PUMP_04/shadow/update/delta.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 56 Part 2 — Digital Twin State Reconciliation Engine & Asynchronous Field Actuation",
        "regName": "TWIN_RECONCILE_REG",
        "bitNames": ["RECONCILER_ACTIVE", "DELTA_INGEST_OK", "ACTUATOR_PWM_SET", "RELAY_LATCH_DRIVE", "SENSOR_CONFIRM_OK", "NO_PHANTOM_CONV", "REPORTED_ACK_SENT", "RECONCILE_CONVERGED"],
        "steps": [
            ("say1", "Activate field reconciliation loop: Subscribe to shadow delta updates over secure MQTT.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Parse delta target setpoints: Accelerate pump drive to 1800 RPM and energize valve relay.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("example", "Confirm mechanical limit switch closure: Prevent phantom convergence in cloud twin.", "0xBE", 190, [1, 0, 1, 1, 1, 1, 1, 0]),
            ("tryIt", "Acknowledge physical state convergence: Publish updated reported state to cloud shadow.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 56 Part 3 — Versioned Optimistic Concurrency Control & Conflict Resolution",
        "regName": "SHADOW_LOCK_REG",
        "bitNames": ["OPT_LOCK_ENABLE", "EXPECTED_VER_LATCH", "ACTIVE_VER_COMPARE", "VER_MATCH_OK", "STALE_CONFLICT_409", "ATOMIC_INC_VER", "METADATA_TIME_STAMP", "LOCK_ARBITRATION_OK"],
        "steps": [
            ("say1", "Enable optimistic concurrency control: Track active document Version 10 in cloud registry.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Evaluate stale client update (expecting Version 9): Flag version mismatch and reject with HTTP 409.", "0xB9", 185, [1, 0, 1, 1, 1, 0, 0, 1]),
            ("example", "Evaluate valid client update (expecting Version 10): Accept mutation and atomically advance to Version 11.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Timestamp metadata block with sub-microsecond Unix epoch: Maintain mathematical serializability.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 56 Part 4 — Azure IoT Hub Device Twins & Desired Properties Patch Handling",
        "regName": "AZURE_TWIN_PATCH_REG",
        "bitNames": ["AZURE_TWIN_ENABLE", "DESIRED_PATCH_IN", "VERSION_METADATA_OK", "CONFIG_APPLY_PASS", "REPORTED_PATCH_ACK", "LAST_APPLIED_VER_OK", "DTDL_GRAPH_SYNC", "AZURE_TWIN_CONVERGED"],
        "steps": [
            ("say1", "Initialize Azure IoT Hub device twin: Bind turbine monitor edge node to IoT Hub registry.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Ingest desired properties patch ($version=2): Reconfigure telemetry sampling interval to 10 seconds.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Acknowledge patch via reported properties: Set last_applied_desired_version to 2.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Synchronize with Azure Digital Twins DTDL graph: Confirm zero unapplied desired properties.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 56 Part 5 — Masterclass Synthesis: Bidirectional Cloud Digital Twin Synchronization Engine",
        "regName": "TWIN_MASTER_ENGINE_REG",
        "bitNames": ["TWIN_MASTER_INIT", "CLOUD_DESIRED_INGEST", "CONCURRENCY_GUARD_OK", "CLOSED_LOOP_ACTUATE", "DELTA_ZERO_VERIFIED", "MULTI_CLOUD_BRIDGE_OK", "TOKEN_LATCH_OK", "TWIN_ENGINE_CERTIFIED"],
        "steps": [
            ("say1", "Initialize CloudDigitalTwinSynchronizationEngine: Bind CNC milling machine twin core.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Execute cloud directive: Accelerate spindle from 1500 to 3200 RPM and advance twin to Version 3.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Block concurrent stale command (version conflict): Increment conflict counter and protect hardware.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify 100% digital twin synchronization and latch CLOUD_DEVICE_SHADOW_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 56,
    "title": "Cloud IoT Device Shadows & Digital Twins: AWS IoT Core, Azure IoT Hub & State Reconciliation",
    "promptSha": "cloud-device-shadows-digital-twins-day56-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-56.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-56.json successfully with domain-accurate hardware registers.")
