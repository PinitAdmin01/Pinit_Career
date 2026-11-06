import hashlib
import hmac
import struct

# Snippet 1: NIST SP 800-57 Key State Machine
def test_snippet1():
    STATES = ["PRE_ACTIVATION", "ACTIVE", "SUSPENDED", "DEACTIVATED", "COMPROMISED", "DESTROYED"]
    
    class KeyLifecycle:
        def __init__(self, key_id: str):
            self.key_id = key_id
            self.state = "PRE_ACTIVATION"
            self.usage_count = 0
            self.max_usage = 1000

        def activate(self):
            if self.state == "PRE_ACTIVATION":
                self.state = "ACTIVE"
                return True
            return False

        def record_use(self):
            if self.state != "ACTIVE":
                return False, "KEY_NOT_ACTIVE"
            self.usage_count += 1
            if self.usage_count >= self.max_usage:
                self.state = "DEACTIVATED"
                return True, "CRYPTOPERIOD_EXPIRED"
            return True, "OK"

        def destroy(self):
            self.state = "DESTROYED"

    kl = KeyLifecycle("AES_MASTER_KEY_01")
    kl.activate()
    ok, msg = kl.record_use()
    
    print(f"Key ID: {kl.key_id}, State: {kl.state}")
    print(f"Usage Recorded: {ok}, Result: {msg}")
    kl.destroy()
    print(f"Final State: {kl.state}")

# Snippet 2: Secure Key Rotation via HKDF Ratchet
def test_snippet2():
    # Ratchet key generation using HMAC-SHA256
    current_key = hashlib.sha256(b"ROOT_SESSION_KEY_EPOCH_0").digest()
    
    def rotate_key(prev_key: bytes, epoch: int) -> bytes:
        info = b"KEY_ROTATION_EPOCH_" + struct.pack(">I", epoch)
        return hmac.new(prev_key, info, hashlib.sha256).digest()

    epoch1_key = rotate_key(current_key, 1)
    epoch2_key = rotate_key(epoch1_key, 2)
    
    print(f"Epoch 0 Key: {current_key[:8].hex()}...")
    print(f"Epoch 1 Key: {epoch1_key[:8].hex()}...")
    print(f"Epoch 2 Key: {epoch2_key[:8].hex()}...")
    print(f"Forward Secrecy Preserved: {epoch1_key != epoch2_key}")

# Snippet 3: Tamper Pin Interrupt & Emergency Lockdown
def test_snippet3():
    class TamperMonitor:
        def __init__(self):
            self.tamper_detected = False
            self.lockdown_active = False

        def on_tamper_pin_interrupt(self, pin_state_high: bool):
            # Enclosure switch opened -> pin pulled HIGH
            if pin_state_high:
                self.tamper_detected = True
                self.lockdown_active = True
                return "EMERGENCY_LOCKDOWN_TRIGGERED"
            return "IDLE_NORMAL"

    monitor = TamperMonitor()
    res1 = monitor.on_tamper_pin_interrupt(False)
    res2 = monitor.on_tamper_pin_interrupt(True)
    
    print(f"Normal Monitoring : {res1}")
    print(f"Chassis Breach Pin: {res2}")
    print(f"Lockdown Enforced : {monitor.lockdown_active}")

# Snippet 4: Volatile Memory Scrubbing
def test_snippet4():
    # Simulates explicit zeroization avoiding compiler dead-store elimination
    class SecureMemoryBuffer:
        def __init__(self, key_bytes: bytes):
            self.buf = bytearray(key_bytes)

        def is_scrubbed(self) -> bool:
            return all(b == 0 for b in self.buf)

        def explicit_zeroize(self):
            # Write zero to every byte individually (volatile barrier simulation)
            for i in range(len(self.buf)):
                self.buf[i] = 0x00

    secret_key = b"TOP_SECRET_SESSION_KEY_MATERIAL"
    mem = SecureMemoryBuffer(secret_key)
    before_zero = mem.is_scrubbed()
    mem.explicit_zeroize()
    after_zero = mem.is_scrubbed()
    
    print(f"Memory Scrubbed Before: {before_zero}")
    print(f"Memory Scrubbed After : {after_zero}")
    print(f"Buffer Content: {bytes(mem.buf)}")

# Snippet 5: ApexKeyLifecycleEngine
def test_snippet5():
    class ApexKeyLifecycleEngine:
        def __init__(self, initial_key_material: bytes):
            self.key_store = {"ACTIVE_KEY": bytearray(initial_key_material)}
            self.epoch = 0
            self.state = "ACTIVE"
            self.tamper_tripped = False

        def rotate_active_key(self):
            if self.state != "ACTIVE":
                return False, "CANNOT_ROTATE_INACTIVE_KEY"
            self.epoch += 1
            old_key = bytes(self.key_store["ACTIVE_KEY"])
            new_key = hmac.new(old_key, b"RATCHET_" + struct.pack(">I", self.epoch), hashlib.sha256).digest()
            # Explicit zeroize old key
            for i in range(len(self.key_store["ACTIVE_KEY"])):
                self.key_store["ACTIVE_KEY"][i] = 0
            self.key_store["ACTIVE_KEY"] = bytearray(new_key)
            return True, f"KEY_ROTATED_EPOCH_{self.epoch}"

        def emergency_zeroize(self, tamper_pin: bool):
            if tamper_pin:
                self.tamper_tripped = True
                self.state = "DESTROYED"
                for i in range(len(self.key_store["ACTIVE_KEY"])):
                    self.key_store["ACTIVE_KEY"][i] = 0x00
                return True, "ZEROIZED_IMMEDIATELY"
            return False, "NO_TAMPER"

    engine = ApexKeyLifecycleEngine(b"INITIAL_AES_KEY_MATERIAL_32B_01"[:32])
    
    # 1. Normal rotation
    ok_rot, msg_rot = engine.rotate_active_key()
    
    # 2. Tamper event trigger
    ok_wipe, msg_wipe = engine.emergency_zeroize(tamper_pin=True)
    
    is_cleared = all(b == 0 for b in engine.key_store["ACTIVE_KEY"])
    print(f"Rotation Result : {msg_rot} (Success: {ok_rot})")
    print(f"Emergency Action: {msg_wipe} (State: {engine.state})")
    print(f"Active Key Scrubbed to Zero: {is_cleared}")

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
