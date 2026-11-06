# scripts/build_day57_visuals.py
import json
import hashlib

with open("scripts/day-57-data.json", "r", encoding="utf-8") as f:
    day57_data = json.load(f)

parts = day57_data["parts"]

reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 57 Part 1 — PKI & Mutual TLS (mTLS) Handshake: X.509 Certificate Hierarchy & Cipher Negotiation",
        "regName": "MTLS_HANDSHAKE_REG",
        "bitNames": ["MTLS_ENGINE_EN", "SRV_CERT_VAL", "CLI_CERT_VAL", "ECDHE_KEY_SHARE", "CERT_VERIFY_OK", "AES_GCM_CIPHER", "PFS_LATCH_OK", "MTLS_ESTABLISHED"],
        "steps": [
            ("say1", "Initialize mutual TLS engine: Load offline Root CA trust store into local cryptographic registry.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Verify cloud broker Server Certificate: Validate X.509 signature chain against enterprise Root CA.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Execute ECDHE ephemeral key exchange: Compute Curve25519 shared secret with Perfect Forward Secrecy.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Sign handshake transcript with client private key and transition to AES-128-GCM cipher suite.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 57 Part 2 — Microchip ATECC608A Hardware Secure Element: Silicon Key Isolation & ECDSA Signing",
        "regName": "ATECC608A_SILICON_REG",
        "bitNames": ["ATECC_POWER_ON", "SLOT0_FUSE_LOCKED", "READ_PROHIBIT_OK", "I2C_CMD_DISPATCH", "ECDSA_P256_ACTIVE", "TRNG_ENTROPY_OK", "SIGN_COORD_READY", "SILICON_ISOLATED"],
        "steps": [
            ("say1", "Power up Microchip ATECC608A secure element: Establish 1 MHz I2C communications channel.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Verify Slot 0 configuration fuses: Confirm permanent hardware lock and read prohibition policy.", "0xDC", 220, [1, 1, 0, 1, 1, 1, 0, 0]),
            ("example", "Dispatch Sign command targeting Slot 0: Feed 32-byte TLS transcript hash into internal coprocessor.", "0xBE", 190, [1, 0, 1, 1, 1, 1, 1, 0]),
            ("tryIt", "Compute P-256 scalar multiplication on silicon: Return 64-byte ECDSA signature (R, S) over I2C bus.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 57 Part 3 — TPM 2.0 & PKCS#11 Cryptographic Token Interface: Hardware Abstraction & Non-Exportable Keys",
        "regName": "TPM2_PKCS11_REG",
        "bitNames": ["PKCS11_INIT_OK", "TPM2_TSS_BRIDGE", "TOKEN_OPEN_SESSION", "OBJECT_RESOLVE_URI", "CKA_EXTRACT_FALSE", "SRK_AUTH_PASS", "HARDWARE_SIGN_OK", "TPM_ISOLATION_VALID"],
        "steps": [
            ("say1", "Initialize libtpm2_pkcs11 dynamic library: Connect to tpm2-abrmd resource manager daemon.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Resolve RFC 7512 PKCS#11 URI: Locate hardware token handle for iot_edge_device_key.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Audit immutable hardware token attributes: Verify CKA_EXTRACTABLE=FALSE and CKA_SENSITIVE=TRUE.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Delegate CertificateVerify signature to TPM 2.0 coprocessor without exposing private key to RAM.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 57 Part 4 — X.509 Certificate Revocation Lifecycle: CRLs, OCSP Stapling & Zero Trust Expiration",
        "regName": "X509_REVOCATION_REG",
        "bitNames": ["REVOCATION_ENGINE_EN", "CRL_CACHE_VALID", "OCSP_CLIENT_ACTIVE", "STAPLING_RESPONSE_OK", "SERIAL_LOOKUP_HIT", "REVOCATION_FLAGGED", "ZERO_TRUST_QUARANTINE", "REVOCATION_AUDIT_PASS"],
        "steps": [
            ("say1", "Initialize Zero-Trust Certificate Revocation Manager: Configure authoritative OCSP responder endpoints.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Inspect incoming device serial number 0A3F19BC45: Query status and verify active valid certificate.", "0xB9", 185, [1, 0, 1, 1, 1, 0, 0, 1]),
            ("example", "Inspect compromised device serial number 0A3F19BC44: Detect KEY_COMPROMISE entry in revocation registry.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Enforce Zero Trust boundary: Terminate TLS handshake immediately and quarantine compromised node.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 57 Part 5 — Masterclass Synthesis: Zero-Trust Hardware-Enforced Security Mesh Engine",
        "regName": "SEC_MASTER_ENGINE_REG",
        "bitNames": ["SEC_ENGINE_INIT", "HW_SE_BOUND_OK", "PKCS11_URI_PARSED", "MTLS_13_HANDSHAKE", "OCSP_ZERO_TRUST", "SIEM_TELEMETRY_PUB", "TOKEN_LATCH_OK", "SEC_ENGINE_CERTIFIED"],
        "steps": [
            ("say1", "Instantiate HardwareSecurityMeshEngine: Bind to TPM 2.0 PKCS#11 provider and verify slot lock.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Intercept compromised device connection: Block revoked credential and increment incident telemetry.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Authenticate genuine edge gateway: Execute hardware-delegated ECDSA mTLS 1.3 mutual handshake.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Verify 100% hardware-anchored zero-trust mesh and latch MTLS_HARDWARE_SECURITY_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
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
    "day": 57,
    "title": "Mutual TLS (mTLS) X.509 Authentication & Hardware Secure Elements (ATECC608A / TPM 2.0 PKCS#11)",
    "promptSha": "mtls-x509-hardware-secure-elements-day57-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-57.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-57.json successfully with domain-accurate hardware registers.")
