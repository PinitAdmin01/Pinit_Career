import hashlib
import hmac
import struct

# Snippet 1: Hardware KEK Key Wrapping
def test_snippet1():
    # Simulates wrapping an NVS Storage Key under an eFuse-anchored KEK
    hw_kek = b"FACTORY_OTP_EFUSE_KEK_KEY_32BYTE"[:32]
    nvs_storage_key = b"NVS_STORAGE_KEY_MATERIAL_32BYTES"[:32]
    
    # Wrap key: compute HMAC-based wrapper
    wrapped_key = hmac.new(hw_kek, b"WRAP" + nvs_storage_key, hashlib.sha256).digest()
    
    # Unwrap key check
    expected_wrap = hmac.new(hw_kek, b"WRAP" + nvs_storage_key, hashlib.sha256).digest()
    is_valid = hmac.compare_digest(wrapped_key, expected_wrap)
    
    print(f"Hardware KEK Hash  : {hashlib.sha256(hw_kek).hexdigest()[:16]}...")
    print(f"Wrapped Storage Key: {wrapped_key[:8].hex()}...")
    print(f"Key Unwrap Valid   : {is_valid}")

# Snippet 2: AEAD Record Encryption with AAD Binding
def test_snippet2():
    storage_key = b"NVS_STORAGE_ENCRYPTION_KEY_32B__"[:32]
    namespace = "WIFI_CREDS"
    key_name = "SSID_PASSWORD"
    plaintext = b"SUPER_SECRET_WIFI_PASSPHRASE_99"
    
    # AAD binds namespace and key_name:
    aad = namespace.encode() + b":" + key_name.encode()
    # Mask/encrypt (simulated stream cipher XOR with HMAC keystream)
    keystream = hmac.new(storage_key, aad + b"_KEYSTREAM", hashlib.sha256).digest()
    ciphertext = bytes(p ^ k for p, k in zip(plaintext, keystream * 2))
    # Tag binds AAD and ciphertext
    auth_tag = hmac.new(storage_key, aad + ciphertext, hashlib.sha256).digest()
    
    # Verify and decrypt
    expected_tag = hmac.new(storage_key, aad + ciphertext, hashlib.sha256).digest()
    tag_ok = hmac.compare_digest(auth_tag, expected_tag)
    decrypted = bytes(c ^ k for c, k in zip(ciphertext, keystream * 2))
    
    print(f"AAD Binding  : {aad.decode()}")
    print(f"Auth Tag Match: {tag_ok}")
    print(f"Decrypted Data: {decrypted.decode()}")

# Snippet 3: NVS State Replay Detection
def test_snippet3():
    class ReplayProtectedStore:
        def __init__(self, initial_version: int):
            self.active_version = initial_version

        def write_record(self, version: int, payload: bytes) -> tuple:
            if version <= self.active_version:
                return False, f"REPLAY_ATTACK_DETECTED: Version {version} <= Active {self.active_version}"
            self.active_version = version
            return True, f"RECORD_COMMITTED_VERSION_{version}"

    store = ReplayProtectedStore(initial_version=5)
    
    # Attempt 1: Replaying old record version 4
    ok1, msg1 = store.write_record(4, b"OLD_DATA")
    # Attempt 2: Valid update with version 6
    ok2, msg2 = store.write_record(6, b"NEW_DATA")
    
    print(f"Replay Attempt : {msg1} (Success: {ok1})")
    print(f"Legit Update   : {msg2} (Success: {ok2})")
    print(f"Active Version : {store.active_version}")

# Snippet 4: Flash Sector Compaction & Secure Erase
def test_snippet4():
    class FlashSector:
        def __init__(self, sector_id: int):
            self.sector_id = sector_id
            self.data = bytearray(b"\xFF" * 128) # Erased flash state is 0xFF

        def write(self, offset: int, chunk: bytes):
            for i, b in enumerate(chunk):
                self.data[offset + i] = b

        def erase(self):
            # Physical flash erase returns all bits to 1
            for i in range(len(self.data)):
                self.data[i] = 0xFF

    sector = FlashSector(sector_id=1)
    sector.write(0, b"ACTIVE_SESSION_TOKEN_BLOB")
    written_state = sector.data[:8]
    sector.erase()
    erased_state = sector.data[:8]
    
    print(f"Written Sector State: {bytes(written_state)}")
    print(f"Erased Sector State : {bytes(erased_state)}")
    print(f"Fully Erased to 0xFF: {all(b == 0xFF for b in sector.data)}")

# Snippet 5: ApexEncryptedNvsEngine
def test_snippet5():
    class ApexEncryptedNvsEngine:
        def __init__(self, master_key: bytes):
            self.master_key = master_key
            self.current_version = 0
            self.storage = {}

        def put_secure(self, namespace: str, key: str, value: bytes) -> tuple:
            self.current_version += 1
            aad = f"{namespace}:{key}:{self.current_version}".encode()
            # Encrypt
            keystream = hmac.new(self.master_key, aad + b"_STREAM", hashlib.sha256).digest()
            ciphertext = bytes(p ^ k for p, k in zip(value, keystream * 4))
            tag = hmac.new(self.master_key, aad + ciphertext, hashlib.sha256).digest()
            record = {"ver": self.current_version, "ct": ciphertext, "tag": tag}
            self.storage[f"{namespace}:{key}"] = record
            return True, f"SAVED_VER_{self.current_version}"

        def get_secure(self, namespace: str, key: str) -> tuple:
            entry = self.storage.get(f"{namespace}:{key}")
            if not entry:
                return False, b"NOT_FOUND"
            aad = f"{namespace}:{key}:{entry['ver']}".encode()
            expected_tag = hmac.new(self.master_key, aad + entry["ct"], hashlib.sha256).digest()
            if not hmac.compare_digest(entry["tag"], expected_tag):
                return False, b"AUTH_FAILED_TAMPERED"
            keystream = hmac.new(self.master_key, aad + b"_STREAM", hashlib.sha256).digest()
            plaintext = bytes(c ^ k for c, k in zip(entry["ct"], keystream * 4))
            return True, plaintext

    engine = ApexEncryptedNvsEngine(master_key=b"STORAGE_MASTER_KEY_32BYTES_LONG"[:32])
    
    # Store configuration
    ok_put, msg_put = engine.put_secure("CLOUD_AUTH", "DEVICE_TOKEN", b"BEARER_SECRET_TOKEN_XYZ_12345")
    # Retrieve configuration
    ok_get, val_get = engine.get_secure("CLOUD_AUTH", "DEVICE_TOKEN")
    
    print(f"Put Result      : {msg_put} (Success: {ok_put})")
    print(f"Get Result      : {val_get.decode()} (Success: {ok_get})")
    print(f"Current NVS Ver : {engine.current_version}")

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
