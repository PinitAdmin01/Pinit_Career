import hashlib
import struct
import hmac

# Snippet 1: Asymmetric Firmware Signing Architecture (Public Key in OTP eFuse)
def test_snippet1():
    # Public key hash stored in eFuse (32 bytes)
    oem_pubkey_bytes = b"OEM_ROOT_ED25519_PUBLIC_KEY_COORDINATES_32B"[:32]
    efuse_pubkey_hash = hashlib.sha256(oem_pubkey_bytes).hexdigest()
    
    # Received firmware manifest public key
    received_pubkey = oem_pubkey_bytes
    received_hash = hashlib.sha256(received_pubkey).hexdigest()
    
    key_trusted = received_hash == efuse_pubkey_hash
    print(f"eFuse Root Key Hash: {efuse_pubkey_hash[:16]}...")
    print(f"Received Key Hash  : {received_hash[:16]}...")
    print(f"Root Key Authenticated: {key_trusted}")

# Snippet 2: Signature Algorithm Comparison (Signature and Key Sizes)
def test_snippet2():
    # Ed25519 vs ECDSA P-256 vs RSA-3072 memory footprint comparison
    algs = {
        "Ed25519 (RFC 8032)": {"pubkey_bytes": 32, "sig_bytes": 64, "verify_ram_bytes": 128},
        "ECDSA P-256": {"pubkey_bytes": 64, "sig_bytes": 64, "verify_ram_bytes": 256},
        "RSA-3072": {"pubkey_bytes": 384, "sig_bytes": 384, "verify_ram_bytes": 1536}
    }
    for name, data in algs.items():
        print(f"{name:18}: PubKey={data['pubkey_bytes']}B, Sig={data['sig_bytes']}B, RAM={data['verify_ram_bytes']}B")
    ratio = algs["RSA-3072"]["verify_ram_bytes"] / algs["Ed25519 (RFC 8032)"]["verify_ram_bytes"]
    print(f"RAM Ratio RSA vs Ed25519: {ratio:.1f}x less memory for Ed25519")

# Snippet 3: Multi-Segment Firmware Manifest & Digest Chain
def test_snippet3():
    # Manifest containing multiple segment hashes:
    # Segment 1: Secure Core (Cortex-M33 Secure Enclave)
    # Segment 2: Application (Non-Secure OS)
    # Segment 3: TinyML Weights (CMSIS-NN Model)
    segments = {
        "SECURE_ENCLAVE": b"SECURE_CORE_BINARY_DATA",
        "APP_FIRMWARE": b"NONSECURE_APPLICATION_DATA",
        "TINYML_WEIGHTS": b"CMSIS_NN_INT8_MODEL_DATA"
    }
    
    manifest_hashes = {}
    chain_hasher = hashlib.sha256()
    for name, data in segments.items():
        h = hashlib.sha256(data).digest()
        manifest_hashes[name] = h
        chain_hasher.update(h)
    
    root_manifest_digest = chain_hasher.hexdigest()
    print(f"Segment Count: {len(segments)}")
    for name, h in manifest_hashes.items():
        print(f"  {name:15}: {h.hex()[:16]}...")
    print(f"Root Manifest Digest: {root_manifest_digest[:16]}...")

# Snippet 4: eFuse Key Revocation Bitmask
def test_snippet4():
    # 4 OEM root key slots: Slot 0, Slot 1, Slot 2, Slot 3
    # If a key is compromised, its corresponding eFuse bit is blown (1 -> 0)
    efuse_key_mask = 0b1101 # Slot 1 is revoked! (bit 1 is 0)
    
    def is_key_valid(slot_id: int, mask: int) -> bool:
        return bool(mask & (1 << slot_id))

    k0_ok = is_key_valid(0, efuse_key_mask)
    k1_ok = is_key_valid(1, efuse_key_mask)
    k2_ok = is_key_valid(2, efuse_key_mask)
    print(f"eFuse Key Mask: 0b{efuse_key_mask:04b}")
    print(f"Key Slot 0 (Primary): {'ACTIVE' if k0_ok else 'REVOKED'}")
    print(f"Key Slot 1 (Compromised): {'ACTIVE' if k1_ok else 'REVOKED'}")
    print(f"Key Slot 2 (Backup): {'ACTIVE' if k2_ok else 'REVOKED'}")

# Snippet 5: ApexFirmwareVerifierEngine
def test_snippet5():
    class ApexFirmwareVerifierEngine:
        def __init__(self, trusted_root_hash: str, active_key_mask=0b1101):
            self.trusted_root_hash = trusted_root_hash
            self.active_key_mask = active_key_mask

        def verify_firmware_package(self, key_slot: int, pubkey: bytes, manifest_digest: bytes, signature_token: bytes, segments: dict):
            # Check 1: Key slot active in eFuse mask
            if not (self.active_key_mask & (1 << key_slot)):
                return False, f"Key Slot {key_slot} is REVOKED in eFuse"
            
            # Check 2: Public key matches trusted root hash
            if hashlib.sha256(pubkey).hexdigest() != self.trusted_root_hash:
                return False, "Public Key not rooted in eFuse"
            
            # Check 3: Simulated signature check (HMAC token over manifest digest)
            expected_sig = hmac.new(pubkey, manifest_digest, hashlib.sha256).digest()[:16]
            if signature_token != expected_sig:
                return False, "Digital Signature Verification Failed"
            
            # Check 4: Verify segment hashes match manifest
            chain = hashlib.sha256()
            for name, data in segments.items():
                chain.update(hashlib.sha256(data).digest())
            if chain.digest() != manifest_digest:
                return False, "Segment Digest Chain Mismatch"
            
            return True, "FIRMWARE_VERIFIED_AUTHENTIC"

    pub = b"OEM_HARDWARE_ROOT_KEY_32B_BYTES"
    root_hash = hashlib.sha256(pub).hexdigest()
    engine = ApexFirmwareVerifierEngine(root_hash, active_key_mask=0b1101)
    
    # Construct manifest and signature
    segments = {"CORE": b"SECURE_CORE_CODE", "APP": b"RTOS_APP_CODE"}
    chain = hashlib.sha256()
    for s in segments.values():
        chain.update(hashlib.sha256(s).digest())
    manifest_digest = chain.digest()
    sig = hmac.new(pub, manifest_digest, hashlib.sha256).digest()[:16]
    
    ok1, msg1 = engine.verify_firmware_package(0, pub, manifest_digest, sig, segments)
    ok2, msg2 = engine.verify_firmware_package(1, pub, manifest_digest, sig, segments)
    
    print(f"Slot 0 Verification: {msg1} (Success: {ok1})")
    print(f"Slot 1 Verification: {msg2} (Success: {ok2})")

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
