# scripts/build_day60_visuals.py
import json
import hashlib

with open("scripts/day-60-data.json", "r", encoding="utf-8") as f:
    day60_data = json.load(f)

parts = day60_data["parts"]

reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 60 Part 1 — Capstone Architecture: End-to-End Enterprise Edge-to-Cloud Protocol Mesh Topology",
        "regName": "MESH_ROUTER_REG",
        "bitNames": ["MESH_ROUTER_EN", "MODBUS_BRIDGE_OK", "OPC_UA_TSN_OK", "MQTT_SN_6LOWPAN", "BUFFER_RING_VALID", "BURST_BACKPRESSURE", "CLOUD_UPLINK_SYNC", "MESH_TOPOLOGY_READY"],
        "steps": [
            ("say1", "Initialize ProtocolMeshTopologyRouter: Instantiate cross-protocol ring buffers on edge gateway.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Activate industrial Modbus RTU/TCP bridge and TSN OPC UA deterministic automation channel.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("example", "Register 6LoWPAN wireless sensor subnets via lightweight 2-byte Topic ID MQTT-SN bridge.", "0xBE", 190, [1, 0, 1, 1, 1, 1, 1, 0]),
            ("tryIt", "Synchronize multi-protocol pipelines to AWS and Azure cloud brokers with zero packet loss.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 60 Part 2 — Hardware-Anchored Identity & Zero-Trust Provisioning Pipeline Integration",
        "regName": "SOVEREIGN_SEC_REG",
        "bitNames": ["SOVEREIGN_SEC_INIT", "SLOT0_FUSE_LOCKED", "TRNG_ENTROPY_PASS", "MTLS_13_MUTUAL_OK", "EST_ENROLL_ACTIVE", "OCSP_STATUS_GOOD", "AUDIT_JOURNAL_SIGN", "SOVEREIGN_MESH_ACTIVE"],
        "steps": [
            ("say1", "Initialize SovereignHardwareSecurityPipeline: Confirm permanent silicon hardware lock on Slot 0.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Execute on-chip ECDSA CertificateVerify signature delegation via PKCS#11 token interface.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Query live OCSP responder: Confirm device leaf certificate status is cryptographically 'GOOD'.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Establish authenticated mutual TLS 1.3 session and commit signed entry to immutable audit journal.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 60 Part 3 — Bidirectional Device Shadow & Closed-Loop Digital Twin Actuation Mesh",
        "regName": "TWIN_CLOSED_LOOP_REG",
        "bitNames": ["TWIN_MESH_ENABLE", "DESIRED_PATCH_IN", "VERSION_LOCK_OK", "ACTUATOR_DRIVE_SET", "LIMIT_SWITCH_CONFIRM", "TACH_RPM_VERIFIED", "ZERO_DELTA_REPORT", "TWIN_CONVERGED_VALID"],
        "steps": [
            ("say1", "Initialize ClosedLoopDigitalTwinMesh: Subscribe to cloud desired state document at Version 10.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Parse desired setpoints: Accelerate spindle to 3600 RPM and energize pneumatic cooling valve relay.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("example", "Wait for physical sensor feedback: Confirm optical tachometer 3600 RPM and limit switch closure.", "0xBE", 190, [1, 0, 1, 1, 1, 1, 1, 0]),
            ("tryIt", "Confirm physical convergence: Publish updated reported state and advance twin to Version 11.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 60 Part 4 — Resilient Dual-Bank Secure OTA Deployment & Fleet Rollback Guardian",
        "regName": "OTA_GUARDIAN_REG",
        "bitNames": ["OTA_GUARDIAN_INIT", "DUAL_BANK_STAGED", "OEM_ECDSA_VALID", "ANTI_ROLLBACK_PASS", "BOOT_SLOT_SWAPPED", "WDT_CONFIRM_PASS", "EFUSE_EPOCH_BLOWN", "FLEET_ROLLBACK_SAFE"],
        "steps": [
            ("say1", "Initialize FleetOtaRollbackGuardian: Monitor dual-bank flash partitions from running Bank A.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Verify OEM cryptographic signature and evaluate Security Epoch against hardware monotonic counter.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Execute atomic bootloader swap to Bank B and arm 60-second hardware watchdog countdown timer.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Pass post-boot self-tests: Permanently blow eFuse to advance epoch and confirm Bank B operational status.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 60 Part 5 — Grand Masterclass Capstone Synthesis: Production Enterprise Edge-to-Cloud Digital Twin & Security Mesh Engine",
        "regName": "GRAND_CAPSTONE_REG",
        "bitNames": ["MASTER_PLATFORM_INIT", "MULTI_PROTO_BRIDGED", "SOVEREIGN_MTLS_SEALED", "TWIN_100PCT_CONVERGED", "OTA_DUAL_BANK_ACTIVE", "ENTERPRISE_TELEMETRY", "TOKEN_LATCH_OK", "COURSE_18_CERTIFIED"],
        "steps": [
            ("say1", "Instantiate EnterpriseEdgeCloudMasterEngine: Orchestrate multi-protocol, security, and twin subsystems.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Execute full-stack cyber-physical synchronization across industrial fieldbuses and hyperscale clouds.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Verify zero delta twin tracking, hardware key isolation, and brick-proof dual-bank OTA protection.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Assert OPERATIONAL_SOVEREIGN_MESH and latch COURSE_18_IOT_NET_MASTER_CAPSTONE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 60,
    "title": "Milestone 12 Capstone: Production Enterprise Edge-to-Cloud Digital Twin & Security Mesh Engine",
    "promptSha": "milestone-12-master-capstone-day60-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-60.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-60.json successfully with domain-accurate hardware registers.")
