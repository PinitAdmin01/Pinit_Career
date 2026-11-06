# scripts/build_day58_visuals.py
import json
import hashlib

with open("scripts/day-58-data.json", "r", encoding="utf-8") as f:
    day58_data = json.load(f)

parts = day58_data["parts"]

reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 58 Part 1 — Zero-Touch Provisioning (ZTP) Architecture & Claim Certificate Bootstrap",
        "regName": "ZTP_BOOTSTRAP_REG",
        "bitNames": ["ZTP_BOOTSTRAP_EN", "CLAIM_CERT_LATCH", "HW_SERIAL_FETCH", "MTLS_BOOTSTRAP_OK", "WHITELIST_CHECK", "NONCE_CHALLENGE", "ENROLL_AUTH_PASS", "ZTP_BOOTSTRAP_READY"],
        "steps": [
            ("say1", "Power up unprovisioned gateway: Detect missing production configuration and enter ZTP mode.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Load factory Claim Certificate: Bind restricted bootstrap credentials from secure flash.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("example", "Transmit hardware MAC serial to cloud bootstrap broker over cellular backhaul.", "0xBE", 190, [1, 0, 1, 1, 1, 1, 1, 0]),
            ("tryIt", "Validate claim against ERP whitelist and receive ephemeral cryptographic nonce token.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 58 Part 2 — RFC 7030 Enrollment over Secure Transport (EST) & Autonomous Lifecycle Management",
        "regName": "EST_RFC7030_REG",
        "bitNames": ["EST_CLIENT_INIT", "CACERTS_FETCH_OK", "ON_CHIP_KEYGEN", "PKCS10_CSR_GEN", "SIMPLEENROLL_REQ", "CA_SIGN_VERIFIED", "PROD_CERT_LATCH", "EST_LIFECYCLE_ACTIVE"],
        "steps": [
            ("say1", "Initialize RFC 7030 EST client: Dial /cacerts endpoint to update root CA trust store.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Execute on-chip keypair generation inside ATECC608A: Private key permanently sealed.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Format PKCS#10 Certificate Signing Request (CSR) with requested Subject Distinguished Name.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Transmit /simpleenroll request and latch issued production certificate serial into non-volatile storage.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 58 Part 3 — AWS IoT Fleet Provisioning by Claim: Provisioning Templates & Dynamic Resource Binding",
        "regName": "AWS_FLEET_PROV_REG",
        "bitNames": ["AWS_PROV_INIT", "CLAIM_MQTT_PUB", "CERT_OWN_TOKEN", "TEMPLATE_PARSE_OK", "THING_REG_PASS", "IAM_POLICY_BIND", "PROD_CONFIG_LATCH", "AWS_FLEET_CONVERGED"],
        "steps": [
            ("say1", "Establish mTLS to AWS IoT Core using factory claim certificate and subscribe to response topics.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Publish to $aws/certificates/create/json: Receive unique certificateId and ownership token.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Submit ownership token and parameters to IndustrialGatewayFleetTemplate provisioning topic.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Register Thing resource, attach least-privilege IAM policy, and switch to production credentials.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 58 Part 4 — Azure IoT Hub Device Provisioning Service (DPS): Dynamic Allocation & Multi-Region Orchestration",
        "regName": "AZURE_DPS_REG",
        "bitNames": ["DPS_SCOPE_INIT", "GLOBAL_ENDPOINT_CONNECT", "X509_GROUP_ATTEST", "GEO_ALLOC_EVAL", "HUB_ROUTING_PASS", "TWIN_BOOTSTRAP_OK", "ASSIGNED_STATE_LATCH", "DPS_FLEET_READY"],
        "steps": [
            ("say1", "Initialize Azure DPS client: Configure ID Scope 0ne004A812C and global provisioning endpoint.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Present X.509 leaf certificate signed by enterprise Sub-CA for Enrollment Group attestation.", "0xB9", 185, [1, 0, 1, 1, 1, 0, 0, 1]),
            ("example", "Evaluate geo-latency allocation policy: Route robot arm gateway to closest regional hub (us-west).", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Latch ASSIGNED state, disconnect from DPS, and establish permanent connection to target IoT Hub.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 58 Part 5 — Masterclass Synthesis: Automated Multi-Cloud Zero-Touch Fleet Provisioning Engine",
        "regName": "ZTP_MASTER_FLEET_REG",
        "bitNames": ["ZTP_MASTER_INIT", "FACTORY_CLAIM_GUARD", "MULTI_CLOUD_ROUTER", "CREDENTIAL_ROLLOVER", "ROGUE_INTERCEPT_OK", "TELEMETRY_STATS_PUB", "TOKEN_LATCH_OK", "ZTP_ENGINE_CERTIFIED"],
        "steps": [
            ("say1", "Instantiate ZeroTouchFleetProvisioningEngine: Initialize multi-cloud fleet enrollment pipelines.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Onboard wind turbine sensors: Route Blade Sensor 01 to AWS IoT Core and Sensor 02 to Azure DPS.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Intercept rogue device attempt bearing invalid claim credentials and increment audit telemetry counter.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Verify 100% zero-touch multi-cloud fleet convergence and latch ZTP_FLEET_PROVISIONING_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 58,
    "title": "Zero-Touch Provisioning (ZTP) & EST (RFC 7030), Cloud Device Fleet Provisioning (AWS / Azure DPS)",
    "promptSha": "ztp-est-fleet-provisioning-day58-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-58.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-58.json successfully with domain-accurate hardware registers.")
