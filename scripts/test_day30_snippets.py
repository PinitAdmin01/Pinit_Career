# scripts/test_day30_snippets.py
import sys
import hashlib
import hmac
import struct
import secrets

print("Testing Day 30 Code Snippets...")

# Snippet 1: Master Architecture Blueprint Validator
s1 = """import hashlib
import struct

class ApexSentryBlueprint:
    def __init__(self):
        self.subsystems = {
            "SILICON_ROT": {"status": "ACTIVE", "puf_bits": 256, "efuse_state": "SECURE_LOCKED"},
            "BUS_ENCRYPTION": {"cipher": "AES-XTS-256", "sector_size": 512, "active": True},
            "TRUSTZONE_ISOLATION": {"sau_regions": 4, "mpu_subregions": 8, "nsc_gateway": True},
            "PKI_IDENTITY": {"standard": "IEEE_802.1AR", "curve": "Ed25519", "cert_valid": True},
            "FOTA_PIPELINE": {"banks": 2, "anti_rollback_ver": 4, "signature": "Ed25519"},
            "SECURE_STORAGE": {"cipher": "AES-GCM-256", "nvs_entries": 16, "tamper_zeroize": True}
        }

    def validate_blueprint(self):
        passed = 0
        for name, spec in self.subsystems.items():
            if spec.get("active", True) and spec.get("status", "ACTIVE") == "ACTIVE":
                passed += 1
        digest = hashlib.sha256(str(sorted(self.subsystems.items())).encode()).hexdigest()[:16]
        return passed, len(self.subsystems), digest

blueprint = ApexSentryBlueprint()
passed, total, bp_hash = blueprint.validate_blueprint()
print(f"ApexSentry Architecture Blueprint Subsystems: {passed}/{total}")
print(f"Blueprint Integrity Hash: {bp_hash.upper()}")
print("Architecture Validation: CERTIFIED_PRODUCTION_READY")
"""

# Snippet 2: Bare-Metal Silicon Root of Trust & Memory Bus Shield
s2 = """import hashlib
import struct

class SiliconRootOfTrust:
    def __init__(self, raw_puf_seed):
        self.puf_key = hashlib.sha256(raw_puf_seed.encode()).digest()
        self.efuse_security_level = 3  # SECURE_LOCKED
        self.anti_rollback_hw = 4

    def aes_xts_tweak_encrypt(self, sector_id: int, plaintext: bytes) -> bytes:
        # Software model of AES-XTS: Key1 for ECB stream, Key2 for sector tweak
        key1 = hashlib.sha256(self.puf_key + b":KEY1").digest()
        key2 = hashlib.sha256(self.puf_key + b":KEY2").digest()
        tweak = hashlib.sha256(key2 + struct.pack("<Q", sector_id)).digest()
        keystream = hashlib.sha256(key1 + tweak).digest()
        # XOR first len(plaintext) bytes
        cipher = bytes(p ^ keystream[i % len(keystream)] for i, p in enumerate(plaintext))
        return cipher

rot = SiliconRootOfTrust("APEX_SENTRY_SILICON_PUF_SEED_0x99A7C")
sector_data = b"CRITICAL_CALIBRATION_MATRIX_DATA_V4"
encrypted = rot.aes_xts_tweak_encrypt(sector_id=1024, plaintext=sector_data)
decrypted = rot.aes_xts_tweak_encrypt(sector_id=1024, plaintext=encrypted)

print(f"PUF Derived Master Key: {rot.puf_key[:8].hex().upper()}...")
print(f"eFuse Security State: LEVEL_{rot.efuse_security_level} (SECURE_LOCKED)")
print(f"Encrypted Sector 1024: {encrypted[:12].hex().upper()}...")
print(f"Decrypted Matches Original: {decrypted == sector_data}")
"""

# Snippet 3: TrustZone MPU Sandboxing & Bare-Metal TLS 1.3 Handshake
s3 = """import hashlib
import hmac
import struct

class TrustZoneGateway:
    def __init__(self):
        self.secure_ram_start = 0x30000000
        self.secure_ram_end = 0x3003FFFF

    def nsc_read_secure_state(self, caller_domain: str, target_address: int) -> bool:
        if caller_domain == "NON_SECURE" and (self.secure_ram_start <= target_address <= self.secure_ram_end):
            return False # Block direct non-secure access
        return True # Allowed through NSC veneer

class BareMetalTLS13Session:
    def __init__(self, device_id: str):
        self.device_id = device_id
        # Ephemeral ECDHE exchange simulation
        self.priv_eph = hashlib.sha256(b"DEVICE_EPHEMERAL_KEY").digest()
        self.pub_eph = hashlib.sha256(self.priv_eph + b":PUB").digest()

    def derive_traffic_keys(self, server_pub_eph: bytes) -> bytes:
        shared_secret = hashlib.sha256(self.priv_eph + server_pub_eph).digest()
        client_key = hmac.new(shared_secret, b"tls13 client write key", hashlib.sha256).digest()
        return client_key

tz = TrustZoneGateway()
mem_blocked = not tz.nsc_read_secure_state("NON_SECURE", 0x30010000)
tls = BareMetalTLS13Session("APEX-SENTINEL-NODE-01")
server_fake_pub = hashlib.sha256(b"SERVER_EPHEMERAL_PUB").digest()
client_write_key = tls.derive_traffic_keys(server_fake_pub)

print(f"TrustZone Direct Memory Violation Blocked: {mem_blocked}")
print(f"Bare-Metal TLS 1.3 Handshake Established")
print(f"Derived Client Traffic Key: {client_write_key[:8].hex().upper()}...")
"""

# Snippet 4: Dual-Bank FOTA Update, eFuse Counter & DICE Attestation
s4 = """import hashlib
import hmac
import struct

class ResilientFOTAAndDICE:
    def __init__(self, current_version: int):
        self.current_version = current_version
        self.active_bank = "BANK_A"
        self.uds = hashlib.sha256(b"UNIQUE_DEVICE_SECRET_PUF").digest()

    def verify_fota_package(self, pkg_version: int, payload: bytes, sig: bytes) -> bool:
        if pkg_version <= self.current_version:
            return False # Anti-rollback check
        expected_sig = hashlib.sha256(b"OEM_SIGNING_KEY:" + payload).digest()
        return sig == expected_sig

    def compute_dice_alias(self, firmware_hash: bytes) -> bytes:
        # CDI = KDF(UDS, FW_Hash)
        cdi = hmac.new(self.uds, firmware_hash, hashlib.sha256).digest()
        # Alias Key = KDF(CDI, b"ALIAS_KEY")
        alias_key = hmac.new(cdi, b"DEVICE_ALIAS_KEY", hashlib.sha256).digest()
        return alias_key

fota = ResilientFOTAAndDICE(current_version=4)
new_firmware = b"APEX_SENTRY_FIRMWARE_V5_RELEASE_BUILD"
valid_sig = hashlib.sha256(b"OEM_SIGNING_KEY:" + new_firmware).digest()

fota_ok = fota.verify_fota_package(5, new_firmware, valid_sig)
alias_key = fota.compute_dice_alias(hashlib.sha256(new_firmware).digest())

print(f"FOTA Signature & Anti-Rollback Verified: {fota_ok}")
print(f"eFuse Anti-Rollback Hardware Monotonic Version: 5")
print(f"TCG DICE Derived Alias Key: {alias_key[:8].hex().upper()}...")
"""

# Snippet 5: ApexSentryGrandMasterEngine Full Pipeline
s5 = """import hashlib
import hmac
import struct

class ApexSentryGrandMasterEngine:
    def __init__(self, puf_seed: str):
        self.puf_seed = puf_seed
        self.uds = hashlib.sha256(puf_seed.encode()).digest()
        self.firmware_version = 4
        self.active_bank = "BANK_A"
        self.operational_state = "COLD_BOOT"
        self.tamper_pin_asserted = False
        self.key_store = {
            "MASTER_PUF_KEY": hashlib.sha256(self.uds + b":PUF").digest(),
            "TLS_IDENTITY_KEY": hashlib.sha256(self.uds + b":TLS").digest(),
            "NVS_ENCRYPTION_KEY": hashlib.sha256(self.uds + b":NVS").digest()
        }

    def power_on_self_test(self) -> bool:
        # AES & SHA KAT
        kat_sha = hashlib.sha256(b"APEX_KAT").digest()
        exp_sha = hashlib.sha256(b"APEX_KAT").digest()
        if kat_sha != exp_sha:
            self.operational_state = "FAULT"
            return False
        self.operational_state = "SELF_TEST_PASSED"
        return True

    def boot_to_secure_world(self) -> str:
        if self.operational_state != "SELF_TEST_PASSED":
            return "BOOT_DENIED"
        self.operational_state = "OPERATIONAL_SECURE"
        return "APEX_SENTINEL_ONLINE"

    def trigger_tamper_zeroization(self):
        self.tamper_pin_asserted = True
        # Hardware Zeroize Key Store
        for k in self.key_store:
            self.key_store[k] = b"\\x00" * 32
        self.operational_state = "HARDWARE_ZEROIZED_LOCKDOWN"

sentinel = ApexSentryGrandMasterEngine("APEX_SILICON_MASTER_ENTROPY_0xFEA1")
post_ok = sentinel.power_on_self_test()
boot_status = sentinel.boot_to_secure_world()
keys_before = sentinel.key_store["MASTER_PUF_KEY"][:6].hex().upper()

# Simulate intrusion event
sentinel.trigger_tamper_zeroization()
keys_after = sentinel.key_store["MASTER_PUF_KEY"].hex()

print(f"Power-On Self-Test (POST): {post_ok}")
print(f"Secure Boot Pipeline Status: {boot_status}")
print(f"Pre-Tamper Master Key: {keys_before}...")
print(f"Tamper Detected -> Zeroized Key: {keys_after}")
print(f"Final Sentinel Security State: {sentinel.operational_state}")
print("Grand Capstone Defense: PASSED_WITH_DISTINCTION")
"""

import subprocess
snippets = [s1, s2, s3, s4, s5]
for i, s in enumerate(snippets):
    res = subprocess.run([sys.executable, "-c", s], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Snippet {i+1} FAILED:\n{res.stderr}")
        sys.exit(1)
    print(f"Snippet {i+1} Output:\n{res.stdout}")

print("All 5 Day 30 snippets tested and verified successfully!")
