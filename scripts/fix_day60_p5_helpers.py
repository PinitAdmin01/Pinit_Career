with open("scripts/build_iot_sec_day60.py", "r", encoding="utf-8") as f:
    text = f.read()

helpers_day60_p5 = '''class ApexShieldRootOfTrustSubsystem:
    TOKEN_PASS = 0x69C35AA5
    def __init__(self, hardware_efuse_svn: int = 5):
        self.hardware_efuse_svn = hardware_efuse_svn
    def execute_puf_sovereign_derivation(self, sram_seed: bytes) -> bytes:
        return hashlib.sha256(b"PUF_KEY" + sram_seed).digest()
    def execute_hybrid_pqc_secure_boot(self, manifest_svn: int, payload: bytes, ecdsa_ok: bool, mldsa_ok: bool) -> dict:
        return {"authorized": ecdsa_ok and mldsa_ok, "status": "BOOT_OK", "efuse_floor": max(self.hardware_efuse_svn, manifest_svn)}

class ApexShieldZeroTrustNetworkSubsystem:
    def __init__(self, master_network_key: bytes):
        self.net_key = master_network_key
        self.top = 100
        self.seen = set()
    def process_and_transmit_telemetry(self, src_eui: bytes, counter: int, telemetry: str) -> bytes:
        return struct.pack("<I", counter) + telemetry.encode()
    def receive_and_verify_packet(self, frame: bytes) -> dict:
        counter = struct.unpack("<I", frame[:4])[0]
        if counter in self.seen or counter <= self.top - 64:
            return {"valid": False}
        self.seen.add(counter)
        self.top = max(self.top, counter)
        return {"valid": True, "telemetry": frame[4:].decode()}

class ApexShieldIncidentDefenseSubsystem:
    def __init__(self, master_keys: dict):
        self.keys = dict(master_keys)
        self.log = []
    def log_telemetry_event(self, t: int, code: int, payload: str):
        self.log.append((t, code, payload))
    def trigger_physical_tamper_incident(self, chassis_open: bool, ambient_lux: float, temp_c: float, timestamp: int) -> dict:
        for k in list(self.keys.keys()):
            self.keys[k] = bytes([0x00] * len(self.keys[k]))
        return {"incident": True, "keys_zeroized": True, "siren_broadcast_active": True}
'''

pos5 = text.find('p5_code = """# Day 60 Part 5:')
insert_pos5 = text.find('class ApexShieldSovereignPlatformEngine:', pos5)
text = text[:insert_pos5] + helpers_day60_p5 + '\n' + text[insert_pos5:]

with open("scripts/build_iot_sec_day60.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Inserted standalone helpers into Day 60 Part 5!")
