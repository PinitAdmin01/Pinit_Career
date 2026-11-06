import hashlib
import hmac
import struct

# Snippet 1: FOTA Pipeline State Machine
def test_snippet1():
    states = ["IDLE", "DOWNLOADING", "MANIFEST_VERIFIED", "STAGED_SLOT_B", "TRIAL_BOOT", "CONFIRMED_COMMITTED"]
    current_state = "IDLE"
    transitions = []
    
    for next_state in states[1:]:
        current_state = next_state
        transitions.append(current_state)
        
    print(f"Pipeline Initial State: IDLE")
    print(f"State Sequence: {' -> '.join(transitions)}")
    print(f"Final State Valid: {current_state == 'CONFIRMED_COMMITTED'}")

# Snippet 2: Manifest Digest Chain & Staging
def test_snippet2():
    oem_root_pubkey = b"OEM_ROOT_ED25519_PUBLIC_KEY_COORDS"[:32]
    efuse_pubkey_hash = hashlib.sha256(oem_root_pubkey).digest()
    
    # Candidate package
    sec_version = 14
    app_code = b"APEX_FIRMWARE_PAYLOAD_V2_4_0_SEC_PATCHED"
    app_digest = hashlib.sha256(app_code).digest()
    
    # Manifest
    manifest = struct.pack(">4sII", b"APEX", sec_version, len(app_code)) + app_digest
    manifest_signature = hmac.new(oem_root_pubkey, manifest, hashlib.sha256).digest()
    
    # Verification
    sig_ok = hmac.compare_digest(hmac.new(oem_root_pubkey, manifest, hashlib.sha256).digest(), manifest_signature)
    payload_ok = hashlib.sha256(app_code).digest() == app_digest
    
    print(f"Manifest Magic: {manifest[:4].decode()}, Declared SVN: {sec_version}")
    print(f"Signature Verification: {'PASSED' if sig_ok else 'FAILED'}")
    print(f"Payload Digest Match  : {'PASSED' if payload_ok else 'FAILED'}")

# Snippet 3: Anti-Rollback Fence & Atomic Burn
def test_snippet3():
    class MonotonicFence:
        def __init__(self, hw_counter: int):
            self.hw_counter = hw_counter
            self.staged_counter = None

        def check_fence(self, incoming_svn: int) -> bool:
            if incoming_svn < self.hw_counter:
                return False
            self.staged_counter = incoming_svn
            return True

        def commit(self, self_test_passed: bool) -> bool:
            if not self_test_passed or self.staged_counter is None:
                self.staged_counter = None
                return False
            if self.staged_counter > self.hw_counter:
                self.hw_counter = self.staged_counter
            self.staged_counter = None
            return True

    fence = MonotonicFence(hw_counter=10)
    # Attack with SVN 9
    attack_allowed = fence.check_fence(9)
    # Legitimate upgrade with SVN 14
    upgrade_allowed = fence.check_fence(14)
    commit_success = fence.commit(self_test_passed=True)
    
    print(f"Downgrade SVN 9 Allowed : {attack_allowed}")
    print(f"Upgrade SVN 14 Allowed  : {upgrade_allowed}")
    print(f"Post-Trial Burn Active  : {commit_success} (Active eFuse: {fence.hw_counter})")

# Snippet 4: DICE Attestation Generation & Verifier
def test_snippet4():
    uds = b"FOUNDRY_OTP_UDS_KEY_32B_SECRET_"[:32]
    app_payload = b"APEX_FIRMWARE_PAYLOAD_V2_4_0_SEC_PATCHED"
    app_meas = hashlib.sha256(app_payload).digest()
    
    cdi = hmac.new(uds, b"DICE_APP_LAYER" + app_meas, hashlib.sha256).digest()
    alias_key = hmac.new(cdi, b"ALIAS_KEY", hashlib.sha256).digest()
    
    challenge_nonce = b"NONCE_CHALLENGE_"
    claim = challenge_nonce + struct.pack(">I", 14) + app_meas
    token_sig = hmac.new(alias_key, claim, hashlib.sha256).digest()
    
    # Cloud verifier check
    expected_meas = hashlib.sha256(b"APEX_FIRMWARE_PAYLOAD_V2_4_0_SEC_PATCHED").digest()
    expected_claim = challenge_nonce + struct.pack(">I", 14) + expected_meas
    cloud_verified = hmac.compare_digest(hmac.new(alias_key, expected_claim, hashlib.sha256).digest(), token_sig)
    
    print(f"DICE CDI Hash         : {cdi[:8].hex()}...")
    print(f"Attestation Proof HMAC: {token_sig[:8].hex()}...")
    print(f"Cloud Verifier Result : {'AUTHORIZED' if cloud_verified else 'REJECTED'}")

# Snippet 5: Complete ApexMilestone5FotaAttestationEngine
def test_snippet5():
    class ApexMilestone5FotaAttestationEngine:
        def __init__(self, uds: bytes, root_pubkey: bytes, initial_sec_version: int):
            self.uds = uds
            self.root_pubkey = root_pubkey
            self.hw_counter = initial_sec_version
            self.active_slot = "SLOT_A"
            self.slot_a_code = b"BASELINE_FIRMWARE_V1_0"
            self.slot_b_code = b""
            self.cdi = None
            self.alias_key = None
            self._derive_active_dice()

        def _derive_active_dice(self):
            active_code = self.slot_a_code if self.active_slot == "SLOT_A" else self.slot_b_code
            meas = hashlib.sha256(active_code).digest()
            self.cdi = hmac.new(self.uds, b"DICE_LAYER" + meas, hashlib.sha256).digest()
            self.alias_key = hmac.new(self.cdi, b"ALIAS_KEY", hashlib.sha256).digest()

        def ingest_fota_package(self, manifest: bytes, signature: bytes, payload: bytes) -> tuple:
            # 1. Verify manifest signature
            expected_sig = hmac.new(self.root_pubkey, manifest, hashlib.sha256).digest()
            if not hmac.compare_digest(signature, expected_sig):
                return False, "MANIFEST_SIGNATURE_INVALID"
            
            # 2. Parse manifest: magic(4B), svn(4B), size(4B), payload_hash(32B)
            magic, svn, size = struct.unpack(">4sII", manifest[:12])
            payload_hash = manifest[12:44]
            if magic != b"APEX":
                return False, "INVALID_MAGIC"
            
            # 3. Anti-rollback check
            if svn < self.hw_counter:
                return False, f"DOWNGRADE_BLOCKED: {svn} < {self.hw_counter}"
            
            # 4. Verify payload digest
            if hashlib.sha256(payload).digest() != payload_hash:
                return False, "PAYLOAD_HASH_MISMATCH"
            
            # 5. Stage into Slot B
            self.slot_b_code = payload
            return True, f"STAGED_SLOT_B_SVN_{svn}"

        def execute_trial_and_commit(self, self_test_passed: bool, candidate_svn: int) -> bool:
            if not self_test_passed:
                self.slot_b_code = b""
                return False
            self.active_slot = "SLOT_B"
            if candidate_svn > self.hw_counter:
                self.hw_counter = candidate_svn
            self._derive_active_dice()
            return True

        def generate_attestation(self, nonce: bytes) -> dict:
            active_code = self.slot_a_code if self.active_slot == "SLOT_A" else self.slot_b_code
            meas = hashlib.sha256(active_code).digest()
            claim = nonce + struct.pack(">I", self.hw_counter) + meas
            sig = hmac.new(self.alias_key, claim, hashlib.sha256).digest()
            return {"nonce": nonce.hex(), "svn": self.hw_counter, "meas": meas.hex(), "proof": sig.hex()}

    # Initialize Engine
    root_key = b"OEM_AUTHORIZATION_PUBKEY_32BYTES"[:32]
    engine = ApexMilestone5FotaAttestationEngine(
        uds=b"FOUNDRY_OTP_UDS_KEY_32B_SECRET_"[:32],
        root_pubkey=root_key,
        initial_sec_version=10
    )
    
    # Prepare legitimate v2.0 update package (SVN 15)
    upg_code = b"APEX_SECURE_OPERATING_SYSTEM_V2_0"
    upg_meas = hashlib.sha256(upg_code).digest()
    upg_manifest = struct.pack(">4sII", b"APEX", 15, len(upg_code)) + upg_meas
    upg_sig = hmac.new(root_key, upg_manifest, hashlib.sha256).digest()
    
    # Ingest and Commit
    ok_ingest, msg_ingest = engine.ingest_fota_package(upg_manifest, upg_sig, upg_code)
    commit_ok = engine.execute_trial_and_commit(self_test_passed=True, candidate_svn=15)
    
    # Attestation
    nonce = b"VERIFIER_NONCE__"
    att_token = engine.generate_attestation(nonce)
    
    print(f"FOTA Ingestion: {msg_ingest} (Success: {ok_ingest})")
    print(f"Trial Commit  : Committed={commit_ok}, Active Slot={engine.active_slot}, eFuse={engine.hw_counter}")
    print(f"Attestation Proof SVN: {att_token['svn']}, Proof: {att_token['proof'][:16]}...")

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
