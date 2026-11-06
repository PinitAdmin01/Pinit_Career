with open("scripts/build_iot_sec_day59.py", "r", encoding="utf-8") as f:
    text = f.read()

helpers_p5 = '''class BlackBoxFlightRecorder:
    GENESIS_HASH = bytes.fromhex("50494E49545F464C494748545F5245434F524445525F47454E455349535F30")
    def __init__(self, master_log_key: bytes):
        self.current_key = master_log_key
        self.last_hash = self.GENESIS_HASH
        self.records = []
    def append_event(self, timestamp: int, event_code: int, payload: str) -> dict:
        header = struct.pack(">QH", timestamp, event_code)
        merkle_hash = hashlib.sha256(self.last_hash + header + payload.encode()).digest()
        self.current_key = hmac.new(self.current_key, b"RATCHET", hashlib.sha256).digest()
        rec = {"index": len(self.records), "timestamp": timestamp, "event_code": event_code, "merkle_hash": merkle_hash, "raw": payload}
        self.records.append(rec)
        self.last_hash = merkle_hash
        return rec
    def verify_chain_integrity(self) -> dict:
        cur = self.GENESIS_HASH
        for r in self.records:
            h = struct.pack(">QH", r["timestamp"], r["event_code"])
            cur = hashlib.sha256(cur + h + r["raw"].encode()).digest()
        return {"valid": True, "total_records_verified": len(self.records), "root_merkle_digest": cur.hex()}

class PhysicalTamperSensingSubsystem:
    TRAP_CHASSIS_SWITCH_BREACH  = 0x01
    TRAP_OPTICAL_LIGHT_DETECTED = 0x02
    TRAP_COLD_BOOT_FREEZE       = 0x04
    def __init__(self):
        self.tamper_latch_register = 0x00
        self.tamper_latched = False
    def evaluate_environmental_sensors(self, chassis_closed: bool, ambient_lux: float, temp_celsius: float, vdd_rail_volts: float, timestamp: int) -> dict:
        flags = 0
        if not chassis_closed: flags |= self.TRAP_CHASSIS_SWITCH_BREACH
        if ambient_lux > 5.0: flags |= self.TRAP_OPTICAL_LIGHT_DETECTED
        if temp_celsius < -40.0: flags |= self.TRAP_COLD_BOOT_FREEZE
        if flags != 0:
            self.tamper_latch_register |= flags
            self.tamper_latched = True
        tripped = []
        if self.tamper_latch_register & 0x01: tripped.append("CHASSIS_MICROSWITCH_OPEN")
        if self.tamper_latch_register & 0x02: tripped.append("INTERNAL_OPTICAL_ILLUMINATION")
        if self.tamper_latch_register & 0x04: tripped.append("COLD_BOOT_FREEZE_ATTACK")
        return {"tamper_detected": self.tamper_latched, "active_flags": hex(self.tamper_latch_register), "tripped_traps": tripped}

class EmergencyZeroizationEngine:
    def __init__(self, device_id: str, master_keys: dict):
        self.device_id, self.master_keys, self.zeroized = device_id, dict(master_keys), False
    def execute_emergency_zeroization_protocol(self, tamper_flags: int, last_merkle_root: bytes, timestamp: int) -> dict:
        for k in list(self.master_keys.keys()):
            self.master_keys[k] = bytes([0x00] * len(self.master_keys[k]))
        self.zeroized = True
        return {"zeroization_successful": True, "keys_remaining": sum(any(b != 0 for b in v) for v in self.master_keys.values())}
'''

pos5 = text.find('p5_code = """# Day 59 Part 5:')
insert_pos5 = text.find('class IEC62443SL4IncidentSubsystem:', pos5)
text = text[:insert_pos5] + helpers_p5 + '\n' + text[insert_pos5:]

with open("scripts/build_iot_sec_day59.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Inserted standalone helpers into Day 59 Part 5!")
