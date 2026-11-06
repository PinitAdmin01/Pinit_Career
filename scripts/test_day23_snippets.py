import struct
import hashlib

# Snippet 1: Downgrade Attack Vulnerability Scenario
def test_snippet1():
    # Firmware versions:
    # v1.0.0 has CVE-2026-1001 (remote code execution bug)
    # v2.0.0 fixed the CVE
    # Device running v2.0.0 is fed an authentically signed v1.0.0 image!
    current_version = 0x020000 # v2.0.0
    incoming_version = 0x010000 # v1.0.0
    signature_valid = True # OEM signed v1.0.0 in the past!
    
    # Naive bootloader: only checks signature!
    naive_accept = signature_valid
    # Secure bootloader: checks anti-rollback fence!
    secure_accept = signature_valid and (incoming_version >= current_version)
    
    print(f"Current Version : 0x{current_version:06X} (v2.0.0)")
    print(f"Incoming Version: 0x{incoming_version:06X} (v1.0.0, Authentic Signature)")
    print(f"Naive Bootloader Result : {'ACCEPTED (VULNERABLE!)' if naive_accept else 'REJECTED'}")
    print(f"Secure Anti-Rollback    : {'ACCEPTED' if secure_accept else 'REJECTED (DOWNGRADE BLOCKED)'}")

# Snippet 2: Thermometer eFuse Counter Encoding
def test_snippet2():
    # Monotonic counter stored as thermometer bits in OTP eFuse:
    # Value 0: 0b00000000 (0 bits blown)
    # Value 1: 0b00000001 (1 bit blown)
    # Value 3: 0b00000111 (3 bits blown)
    # Value 5: 0b00011111 (5 bits blown)
    def decode_thermometer(val: int) -> int:
        return bin(val).count("1")

    def encode_thermometer(count: int) -> int:
        return (1 << count) - 1

    efuse_raw = 0b00011111 # 5 bits blown
    current_counter = decode_thermometer(efuse_raw)
    
    # Try updating to security version 6 (blow 6th bit)
    new_counter = 6
    updated_efuse = encode_thermometer(new_counter)
    
    print(f"Current eFuse Raw: 0b{efuse_raw:08b} (Security Version: {current_counter})")
    print(f"Updated eFuse Raw: 0b{updated_efuse:08b} (Security Version: {new_counter})")
    print(f"One-Way Increment Valid: {(updated_efuse | efuse_raw) == updated_efuse}")

# Snippet 3: Firmware Image Security Version Manifest Parsing
def test_snippet3():
    # Image Header with anti-rollback security counter:
    # Magic (4B), AppVersion (4B), SecurityVersion (4B), ImageSize (4B)
    magic = b"APEX"
    app_version = 0x020100 # v2.1.0
    security_version = 7   # Security counter 7
    image_size = 409600    # 400 KB
    
    header = struct.pack(">4sIII", magic, app_version, security_version, image_size)
    
    m, av, sv, sz = struct.unpack(">4sIII", header)
    print(f"Image Header: Magic={m.decode()}, AppVer=0x{av:06X}")
    print(f"Declared Security Version: {sv} (Image Size: {sz} bytes)")

# Snippet 4: Atomic Fuse Burning Timing & Invariant
def test_snippet4():
    # Invariant: Never blow eFuses before trial self-test succeeds!
    # If eFuse is blown before self-test, and candidate firmware crashes,
    # the device cannot roll back to Slot A because Slot A now fails the new eFuse counter!
    class FuseBurnProtocol:
        def __init__(self, hw_efuse_counter: int):
            self.hw_counter = hw_efuse_counter
            self.state = "STAGED"

        def test_boot(self, trial_passed: bool, candidate_sec_version: int):
            if not trial_passed:
                self.state = "REVERTED_SLOT_A"
                return False, f"Trial failed. Preserved eFuse at {self.hw_counter}"
            
            # Blow eFuses only after successful trial!
            if candidate_sec_version > self.hw_counter:
                self.hw_counter = candidate_sec_version
                self.state = "FUSE_BLOWN_CONFIRMED"
                return True, f"Burned eFuse counter to {self.hw_counter}"
            return True, "No counter increment needed"

    protocol = FuseBurnProtocol(hw_efuse_counter=5)
    ok, msg = protocol.test_boot(trial_passed=True, candidate_sec_version=6)
    print(f"Protocol State: {protocol.state}")
    print(f"Action Result : {msg}")
    print(f"Active Hardware eFuse Counter: {protocol.hw_counter}")

# Snippet 5: ApexAntiRollbackEngine
def test_snippet5():
    class ApexAntiRollbackEngine:
        def __init__(self, initial_hw_counter: int):
            self.hw_counter = initial_hw_counter
            self.staged_counter = None

        def evaluate_incoming_package(self, pkg_security_version: int):
            # Version fencing rule: pkg_security_version MUST be >= hw_counter
            if pkg_security_version < self.hw_counter:
                return False, f"DOWNGRADE_ATTACK_DETECTED: Pkg counter {pkg_security_version} < Hardware counter {self.hw_counter}"
            self.staged_counter = pkg_security_version
            return True, f"VERSION_FENCE_PASSED: Pkg counter {pkg_security_version} >= {self.hw_counter}"

        def commit_anti_rollback(self, self_test_passed: bool):
            if not self_test_passed or self.staged_counter is None:
                self.staged_counter = None
                return False, "Self-test failed: Rollback to golden slot (eFuse preserved)"
            
            # Permanent physical burn
            if self.staged_counter > self.hw_counter:
                old = self.hw_counter
                self.hw_counter = self.staged_counter
                self.staged_counter = None
                return True, f"eFuse blown permanently from {old} to {self.hw_counter}"
            return True, f"Counter unchanged at {self.hw_counter}"

    engine = ApexAntiRollbackEngine(initial_hw_counter=10)
    
    # Test 1: Attack package attempting rollback to security counter 9
    res1_ok, res1_msg = engine.evaluate_incoming_package(pkg_security_version=9)
    # Test 2: Legitimate upgrade package with security counter 11
    res2_ok, res2_msg = engine.evaluate_incoming_package(pkg_security_version=11)
    res2_commit, res2_cmsg = engine.commit_anti_rollback(self_test_passed=True)
    
    print(f"Package v9  : {res1_msg} (Success: {res1_ok})")
    print(f"Package v11 : {res2_msg} (Success: {res2_ok})")
    print(f"Commit Burn : {res2_cmsg} (Active eFuse: {engine.hw_counter})")

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
