import hashlib
import struct

# Snippet 1: FOTA Image Header & Metadata Layout
def test_snippet1():
    # Firmware image header structure:
    # Magic (4B), Version (4B), Image Size (4B), SHA-256 Digest (32B), Target Slot (1B)
    magic = b"APEX" # 0x41 0x50 0x45 0x58
    version = (2 << 16) | (1 << 8) | 0 # Version 2.1.0
    payload = b"MICROCONTROLLER_FIRMWARE_PAYLOAD_V2_1_0"
    image_size = len(payload)
    sha256_hash = hashlib.sha256(payload).digest()
    target_slot = 1 # Slot B
    
    header = struct.pack(">4sII32sB", magic, version, image_size, sha256_hash, target_slot)
    print(f"Header Magic: {header[:4].decode()}")
    print(f"Firmware Version: {version >> 16}.{(version >> 8) & 0xFF}.{version & 0xFF}")
    print(f"Header Size: {len(header)} bytes, Payload Size: {image_size} bytes")
    print(f"Payload Digest: {sha256_hash.hex()[:16]}...")

# Snippet 2: Dual-Bank A/B Flash Partition Map & Staging
def test_snippet2():
    flash_size_kb = 1024 # 1 MB Flash
    bootloader_kb = 64
    slot_a_kb = 448
    slot_b_kb = 448
    scratch_kb = 64
    
    slots = {
        "BOOTLOADER": {"start": "0x08000000", "size_kb": bootloader_kb},
        "SLOT_A (ACTIVE)": {"start": "0x08010000", "size_kb": slot_a_kb},
        "SLOT_B (STAGING)": {"start": "0x08080000", "size_kb": slot_b_kb},
        "SCRATCH/STORAGE": {"start": "0x080F0000", "size_kb": scratch_kb}
    }
    for name, info in slots.items():
        print(f"{name:18}: Start={info['start']} (Size: {info['size_kb']} KB)")
    total = sum(s["size_kb"] for s in slots.values())
    print(f"Total Flash Partitioned: {total} KB")

# Snippet 3: Chunked Hash Verification & State Transition
def test_snippet3():
    # Streaming ingestion in 16-byte chunks (simulating BLE/LTE-M MTU chunks)
    firmware_data = b"FIRMWARE_CHUNK_1FIRMWARE_CHUNK_2FIRMWARE_CHUNK_3"
    expected_digest = hashlib.sha256(firmware_data).hexdigest()
    
    hasher = hashlib.sha256()
    chunk_size = 16
    for i in range(0, len(firmware_data), chunk_size):
        chunk = firmware_data[i : i + chunk_size]
        hasher.update(chunk)
    
    actual_digest = hasher.hexdigest()
    verified = actual_digest == expected_digest
    print(f"Chunk Size: {chunk_size} bytes, Chunks Ingested: {len(firmware_data)//chunk_size}")
    print(f"Digest Match: {verified} ({actual_digest[:16]}...)")

# Snippet 4: Atomic Boot Flag Update & Watchdog Recovery
def test_snippet4():
    # Boot flags in simulated RTC/eFuse memory:
    # 0 = UNCONFIRMED, 1 = TESTING, 2 = CONFIRMED, 3 = REVERTED
    boot_state = "TESTING"
    watchdog_timeout_ms = 5000
    boot_successful = True
    
    if boot_state == "TESTING":
        if boot_successful:
            boot_state = "CONFIRMED"
            action = "PERMANENT_ACTIVE"
        else:
            boot_state = "REVERTED"
            action = "FALLBACK_SLOT_A"
    
    print(f"Bootloader State: {boot_state}")
    print(f"Watchdog Timer: {watchdog_timeout_ms} ms (Status: KICKED)")
    print(f"Final Action: {action}")

# Snippet 5: ApexDualBankFotaEngine
def test_snippet5():
    class ApexDualBankFotaEngine:
        def __init__(self):
            self.slot_a_version = "1.0.0"
            self.slot_b_version = "None"
            self.active_slot = "A"
            self.candidate_slot = "B"
            self.state = "IDLE"

        def ingest_package(self, version: str, payload: bytes, expected_hash: str):
            self.state = "DOWNLOADING"
            actual_hash = hashlib.sha256(payload).hexdigest()
            if actual_hash != expected_hash:
                self.state = "CORRUPT_PAYLOAD"
                return False, "Hash Verification Failed"
            
            # Stage into candidate slot
            self.slot_b_version = version
            self.state = "STAGED_TESTING"
            return True, f"Staged version {version} in Slot {self.candidate_slot}"

        def commit_boot(self, self_test_passed: bool):
            if self.state != "STAGED_TESTING":
                return False, "Invalid state"
            if self_test_passed:
                self.active_slot = self.candidate_slot
                self.state = "CONFIRMED_ACTIVE"
                return True, f"Active slot permanently switched to Slot {self.active_slot}"
            else:
                self.state = "REVERTED_ROLLBACK"
                return False, f"Self-test failed: Rolling back to Slot A (v{self.slot_a_version})"

    engine = ApexDualBankFotaEngine()
    payload = b"NEW_FIRMWARE_V2_0_0"
    digest = hashlib.sha256(payload).hexdigest()
    
    ok1, msg1 = engine.ingest_package("2.0.0", payload, digest)
    ok2, msg2 = engine.commit_boot(self_test_passed=True)
    
    print(f"FOTA Ingestion: {msg1} (Success: {ok1})")
    print(f"Boot State: {engine.state}")
    print(f"Active Version: v{engine.slot_b_version} on Slot {engine.active_slot}")

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
