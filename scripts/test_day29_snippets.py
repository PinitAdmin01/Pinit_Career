import hashlib
import hmac
import struct

# Snippet 1: STRIDE-IoT Threat Evaluation Matrix
def test_snippet1():
    stride_matrix = {
        "Spoofing": {"threat": "Rogue Device Impersonation", "control": "IEEE 802.1AR IDevID + mTLS", "status": "MITIGATED"},
        "Tampering": {"threat": "Flash Firmware Modification", "control": "Ed25519 Secure Boot + Hash Chains", "status": "MITIGATED"},
        "Repudiation": {"threat": "Forged Sensor Telemetry", "control": "DICE Remote Attestation Signatures", "status": "MITIGATED"},
        "Information Disclosure": {"threat": "SPI Flash Bus Probing", "control": "AES-XTS Flash Encryption + Encrypted NVS", "status": "MITIGATED"},
        "Denial of Service": {"threat": "TCP SYN Flooding / Socket Starvation", "control": "Token-Bucket Rate Limiter + Port Lockdown", "status": "MITIGATED"},
        "Elevation of Privilege": {"threat": "Buffer Overflow in Non-Secure World", "control": "TrustZone SAU + PMSAv8 MPU Sandboxing", "status": "MITIGATED"}
    }
    
    mitigated_count = sum(1 for m in stride_matrix.values() if m["status"] == "MITIGATED")
    print("STRIDE-IoT Matrix Categories Evaluated:", len(stride_matrix))
    print("Total Threats Mitigated:", mitigated_count)
    print("Security Posture:", "CERTIFIED_HARDENED" if mitigated_count == 6 else "VULNERABILITIES_PENDING")

# Snippet 2: FIPS 140-3 Compliance Level Scoring
def test_snippet2():
    fips_requirements = {
        "Level 1": ["Approved Cryptographic Algorithms", "Basic Software Testing"],
        "Level 2": ["Role-Based Authentication", "Physical Tamper Evidence"],
        "Level 3": ["Identity-Based Authentication", "Active Tamper Detection & Zeroization"],
        "Level 4": ["Environmental Failure Protection", "Complete Active Envelope Shielding"]
    }
    
    # Assess Apex Security Platform capabilities
    apex_capabilities = {
        "Approved Cryptographic Algorithms", "Basic Software Testing",
        "Role-Based Authentication", "Physical Tamper Evidence",
        "Identity-Based Authentication", "Active Tamper Detection & Zeroization"
    }
    
    def assess_level(lvl: str) -> bool:
        reqs = set(fips_requirements[lvl])
        return reqs.issubset(apex_capabilities)

    print("FIPS 140-3 Level 1:", "COMPLIANT" if assess_level("Level 1") else "NON_COMPLIANT")
    print("FIPS 140-3 Level 2:", "COMPLIANT" if assess_level("Level 2") else "NON_COMPLIANT")
    print("FIPS 140-3 Level 3:", "COMPLIANT" if assess_level("Level 3") else "NON_COMPLIANT")
    print("FIPS 140-3 Level 4:", "COMPLIANT" if assess_level("Level 4") else "NON_COMPLIANT")

# Snippet 3: PSA Certified Level 3 & Common Criteria Scoring
def test_snippet3():
    psa_levels = {
        1: "Analysis & Threat Modeling Validation",
        2: "Software-Based Attack Resistance & White-Box Testing",
        3: "Silicon-Level Hardware Attack Resistance & Physical Tamper Proofing"
    }
    
    apex_psa_level = 3
    cc_assurance_level = "EAL4+"
    
    print(f"Platform Security Architecture Target: PSA Certified Level {apex_psa_level}")
    print(f"PSA Level 3 Scope: {psa_levels[apex_psa_level]}")
    print(f"Common Criteria Target Assurance : {cc_assurance_level}")

# Snippet 4: Known-Answer Test (KAT) POST Engine
def test_snippet4():
    # Known-Answer Test for SHA-256 and HMAC
    # Test vector: SHA-256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
    test_input = b"abc"
    expected_sha256 = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    
    actual_sha256 = hashlib.sha256(test_input).hexdigest()
    sha256_pass = actual_sha256 == expected_sha256
    
    # Test vector: HMAC-SHA256(b"key", b"The quick brown fox jumps over the lazy dog")
    hmac_key = b"key"
    hmac_msg = b"The quick brown fox jumps over the lazy dog"
    expected_hmac = "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8"
    actual_hmac = hmac.new(hmac_key, hmac_msg, hashlib.sha256).hexdigest()
    hmac_pass = actual_hmac == expected_hmac
    
    print(f"Power-On Self-Test: SHA-256 KAT: {'PASSED' if sha256_pass else 'FAILED'}")
    print(f"Power-On Self-Test: HMAC   KAT: {'PASSED' if hmac_pass else 'FAILED'}")
    print(f"Cryptographic Engine Status     : {'READY' if (sha256_pass and hmac_pass) else 'FAULT_HALTED'}")

# Snippet 5: ApexSecurityAuditEngine
def test_snippet5():
    class ApexSecurityAuditEngine:
        def __init__(self):
            self.post_passed = False
            self.stride_score = 0
            self.fips_level = 0

        def run_power_on_self_test(self) -> bool:
            # SHA-256 KAT
            act_sha = hashlib.sha256(b"abc").hexdigest()
            exp_sha = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
            if act_sha != exp_sha:
                return False
            self.post_passed = True
            return True

        def audit_system_architecture(self, controls: dict) -> dict:
            if not self.post_passed:
                return {"status": "FAILED_POST", "score": 0}
            
            passed_controls = sum(1 for v in controls.values() if v)
            total_controls = len(controls)
            self.stride_score = (passed_controls / total_controls) * 100
            
            if passed_controls == total_controls:
                self.fips_level = 3
                status = "CERTIFIED_LEVEL_3"
            else:
                self.fips_level = 1
                status = "PARTIAL_COMPLIANCE"
                
            return {
                "status": status,
                "coverage_pct": self.stride_score,
                "fips_level": self.fips_level,
                "psa_certified": "PSA_LEVEL_3_READY" if self.fips_level == 3 else "PSA_LEVEL_1"
            }

    engine = ApexSecurityAuditEngine()
    post_ok = engine.run_power_on_self_test()
    
    apex_controls = {
        "secure_boot": True,
        "flash_encryption": True,
        "trustzone_mpu": True,
        "pki_identity": True,
        "fota_rollback": True,
        "encrypted_nvs": True,
        "tamper_zeroize": True
    }
    
    audit_res = engine.audit_system_architecture(apex_controls)
    
    print(f"POST Verification Status: {post_ok}")
    print(f"Audit Architecture Score: {audit_res['coverage_pct']:.0f}%")
    print(f"Assigned Compliance Tier: {audit_res['status']} ({audit_res['psa_certified']})")

if __name__ == "__main__":
    print("--- S1 ---")
    test_snippet1()
    print("--- S2 ---")
    test_snippet2()
    print("--- S3 ---")
    test_snippet3()
    print("--- S4 ---")
    test_snippet4()
    print("--- S5 ---")
    test_snippet5()
