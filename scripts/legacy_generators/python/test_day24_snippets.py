import hashlib
import hmac
import struct

# Snippet 1: Static Certificate vs Attestation Binding
def test_snippet1():
    # Demonstrates why static certificates fail when firmware is tampered,
    # and how attestation binds identity to the firmware hash.
    static_device_cert = "DEVICE_CERT_SN_9874102"
    golden_fw_hash = hashlib.sha256(b"AUTHENTIC_FIRMWARE_V2").hexdigest()
    compromised_fw_hash = hashlib.sha256(b"TROJANED_FIRMWARE_V2_CVE_EXPLOITED").hexdigest()
    
    # Naive Cloud: checks only static cert
    naive_trust = bool(static_device_cert)
    
    # Attestation Cloud: verifies firmware measurement
    def verify_attestation(cert: str, measured_hash: str) -> bool:
        return (cert == static_device_cert) and (measured_hash == golden_fw_hash)
    
    print(f"Device Certificate : {static_device_cert}")
    print(f"Naive Auth Result  : {'TRUSTED (VULNERABLE!)' if naive_trust else 'REJECTED'}")
    print(f"Attestation (Golden): {'TRUSTED' if verify_attestation(static_device_cert, golden_fw_hash) else 'REJECTED'}")
    print(f"Attestation (Tamper): {'TRUSTED' if verify_attestation(static_device_cert, compromised_fw_hash) else 'REJECTED (TAMPER BLOCKED)'}")

# Snippet 2: TCG DICE CDI Derivation from UDS and FMC Measurement
def test_snippet2():
    # TCG DICE: Compound Device Identifier (CDI) = KDF(UDS, Hash(First Mutable Code))
    uds = b"HARDWARE_UNIQUE_DEVICE_SECRET_32B"[:32] # Burned into OTP eFuse
    fmc_binary = b"STAGE1_BOOTLOADER_FMC_CODE_BYTES"
    fmc_hash = hashlib.sha256(fmc_binary).digest()
    
    # KDF using HMAC-SHA256
    cdi = hmac.new(uds, fmc_hash, hashlib.sha256).digest()
    
    print(f"UDS (Locked eFuse) : {uds[:8].hex()}...")
    print(f"FMC Digest (SHA256): {fmc_hash[:8].hex()}...")
    print(f"Derived DICE CDI   : {cdi[:8].hex()}... (Length: {len(cdi)} bytes)")

# Snippet 3: Multi-Layer DICE Attestation Chain
def test_snippet3():
    # Layer 0 (ROM) -> Layer 1 (FMC) -> Layer 2 (App)
    uds = b"FACTORY_OTP_UDS_KEY_32BYTES_LONG"[:32]
    fmc_code = b"APEX_SECURE_BOOTLOADER_LAYER1"
    app_code = b"APEX_EDGE_APPLICATION_LAYER2"
    
    # Layer 1 CDI & Alias Key
    fmc_hash = hashlib.sha256(fmc_code).digest()
    cdi_layer1 = hmac.new(uds, b"DICE_CDI_L1" + fmc_hash, hashlib.sha256).digest()
    alias_key_l1 = hashlib.sha256(cdi_layer1 + b"ALIAS_KEY").digest()
    
    # Layer 2 CDI & Alias Key (derived from Layer 1 CDI)
    app_hash = hashlib.sha256(app_code).digest()
    cdi_layer2 = hmac.new(cdi_layer1, b"DICE_CDI_L2" + app_hash, hashlib.sha256).digest()
    alias_key_l2 = hashlib.sha256(cdi_layer2 + b"ALIAS_KEY").digest()
    
    print(f"Layer 1 Alias Key: {alias_key_l1[:8].hex()}...")
    print(f"Layer 2 Alias Key: {alias_key_l2[:8].hex()}...")
    print(f"Cryptographic Separation Verified: {alias_key_l1 != alias_key_l2}")

# Snippet 4: Attestation Token Generation with Ephemeral Nonce
def test_snippet4():
    # Cloud transmits ephemeral 16-byte nonce to prevent replay attacks
    cloud_nonce = b"\xde\xad\xbe\xef\xca\xfe\xba\xbe\x01\x02\x03\x04\x05\x06\x07\x08"
    firmware_hash = hashlib.sha256(b"ACTIVE_PRODUCTION_APP_V2").digest()
    security_version = 8
    
    alias_privkey = hashlib.sha256(b"SIMULATED_DICE_ALIAS_KEY_MATERIAL").digest()
    
    # Construct attestation claim: Nonce (16B) || SecurityVersion (4B) || FirmwareHash (32B)
    claim = cloud_nonce + struct.pack(">I", security_version) + firmware_hash
    # Attestation signature / proof (HMAC under Alias Key)
    proof = hmac.new(alias_privkey, claim, hashlib.sha256).digest()
    
    # Cloud Verification:
    expected_claim = cloud_nonce + struct.pack(">I", security_version) + firmware_hash
    expected_proof = hmac.new(alias_privkey, expected_claim, hashlib.sha256).digest()
    is_valid = hmac.compare_digest(proof, expected_proof)
    
    print(f"Attestation Claim Size: {len(claim)} bytes")
    print(f"Attestation Proof HMAC: {proof[:8].hex()}...")
    print(f"Cloud Verification    : {'VALID' if is_valid else 'INVALID'}")

# Snippet 5: ApexDiceAttestationEngine
def test_snippet5():
    class ApexDiceAttestationEngine:
        def __init__(self, uds_bytes: bytes):
            self._uds = uds_bytes # Root secret (ROM locked)
            self.cdi = None
            self.alias_key = None
            self.active_measurement = None

        def initialize_boot_stage(self, stage_name: str, stage_code: bytes):
            measurement = hashlib.sha256(stage_code).digest()
            self.active_measurement = measurement
            # Derive CDI = HMAC(UDS, stage_name || measurement)
            self.cdi = hmac.new(self._uds, stage_name.encode() + measurement, hashlib.sha256).digest()
            # Derive Alias Attestation Key
            self.alias_key = hmac.new(self.cdi, b"ATTESTATION_ALIAS_KEY", hashlib.sha256).digest()

        def generate_attestation_proof(self, nonce: bytes, sec_version: int) -> dict:
            claim = nonce + struct.pack(">I", sec_version) + self.active_measurement
            sig = hmac.new(self.alias_key, claim, hashlib.sha256).digest()
            return {
                "nonce": nonce.hex(),
                "sec_version": sec_version,
                "measurement": self.active_measurement.hex(),
                "proof": sig.hex()
            }

        def verify_proof(self, token: dict, expected_nonce: bytes, expected_measurement: bytes, expected_alias_key: bytes) -> bool:
            if bytes.fromhex(token["nonce"]) != expected_nonce:
                return False
            if bytes.fromhex(token["measurement"]) != expected_measurement:
                return False
            claim = expected_nonce + struct.pack(">I", token["sec_version"]) + expected_measurement
            expected_sig = hmac.new(expected_alias_key, claim, hashlib.sha256).digest()
            return hmac.compare_digest(bytes.fromhex(token["proof"]), expected_sig)

    engine = ApexDiceAttestationEngine(uds_bytes=b"PHYSICAL_OTP_UDS_32_BYTES_SECRET"[:32])
    good_code = b"APEX_APPLICATION_BINARY_PRODUCTION_V3"
    engine.initialize_boot_stage("APP_STAGE", good_code)
    
    nonce = b"CHALLENGE_NONCE_"
    token = engine.generate_attestation_proof(nonce, sec_version=12)
    
    # Verifier with golden values
    golden_meas = hashlib.sha256(good_code).digest()
    is_verified = engine.verify_proof(token, nonce, golden_meas, engine.alias_key)
    
    # Simulated Tampered Image
    tampered_meas = hashlib.sha256(b"APEX_APPLICATION_TAMPERED").digest()
    is_tamper_rejected = not engine.verify_proof(token, nonce, tampered_meas, engine.alias_key)
    
    print(f"Token Measurement: {token['measurement'][:16]}...")
    print(f"Proof Signature  : {token['proof'][:16]}...")
    print(f"Golden Attestation Verified: {is_verified}")
    print(f"Tampered Payload Blocked   : {is_tamper_rejected}")

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
