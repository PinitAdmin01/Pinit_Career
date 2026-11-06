import hmac
import hashlib
import struct

# Snippet 1: Milestone Architecture: Initializing Identity & Cryptographic Context
def test_snippet1():
    # Hardware EUI-64 Birthmark IDevID
    eui64_hardware_id = "00-80-E1-02-00-14-3A-9F"
    serial_number = 0x1A2B3C4D
    mcu_sram_kb = 32
    
    # State flags
    state = {
        "device_identity": "IEEE_802_1AR_IDEVID",
        "eui64": eui64_hardware_id,
        "serial": f"0x{serial_number:08X}",
        "static_buffer_bytes": 2048,
        "mfln_limit": 512
    }
    print(f"Milestone 4 Init: Identity={state['device_identity']}, EUI64={state['eui64']}")
    print(f"Hardware Serial: {state['serial']}, Static Buffer: {state['static_buffer_bytes']} B (MFLN: {state['mfln_limit']} B)")

# Snippet 2: ClientHello generation with EUI-64 binding & Ephemeral ECDHE Share
def test_snippet2():
    # Simulate generating ephemeral ECDHE share (32 bytes)
    ephemeral_priv = b"\x55" * 32
    ephemeral_pub = hashlib.sha256(ephemeral_priv).digest() # Mock EC point
    client_random = b"\xAA" * 32
    
    # Build ClientHello payload
    ch_payload = b"TLS13_CH:" + client_random + ephemeral_pub + b":MFLN_512:SAN_EUI64_0080E10200143A9F"
    transcript = hashlib.sha256(ch_payload).digest()
    print(f"ClientHello Size: {len(ch_payload)} bytes")
    print(f"Ephemeral PubKey: {ephemeral_pub.hex()[:16]}...")
    print(f"Initial Transcript Hash: {transcript.hex()[:16]}...")

# Snippet 3: Ingesting ServerHello, ServerCert & OCSP Staple
def test_snippet3():
    # Mock Server flight
    server_ephemeral_pub = b"\xBB" * 32
    server_serial = 0x7E112233
    ocsp_status = "GOOD"
    ocsp_valid_until = 1775000000
    current_time = 1770000000
    
    # Validate OCSP staple freshness and status
    is_revocation_ok = (ocsp_status == "GOOD") and (current_time < ocsp_valid_until)
    print(f"Server Cert Serial: 0x{server_serial:08X}")
    print(f"Stapled OCSP Status: {ocsp_status} (Valid until {ocsp_valid_until})")
    print(f"Revocation Verification: {'PASSED' if is_revocation_ok else 'FAILED'}")

# Snippet 4: Full HKDF Key Schedule and Transcript Binding
def test_snippet4():
    # Compute mock shared secret S = ECDH(client_priv, server_pub)
    shared_secret = hashlib.sha256(b"mock_ecdh_shared_point").digest()
    
    # Derive Handshake Secret
    early_secret = hmac.new(b"\x00"*32, b"\x00"*32, hashlib.sha256).digest()
    handshake_secret = hmac.new(early_secret, shared_secret, hashlib.sha256).digest()
    
    # Derive Master Secret & Application Traffic Keys
    master_secret = hmac.new(handshake_secret, b"derived_master", hashlib.sha256).digest()
    client_app_key = hmac.new(master_secret, b"tls13 c ap traffic", hashlib.sha256).digest()[:16]
    server_app_key = hmac.new(master_secret, b"tls13 s ap traffic", hashlib.sha256).digest()[:16]
    
    print(f"Shared Secret: {shared_secret.hex()[:16]}...")
    print(f"Handshake Secret: {handshake_secret.hex()[:16]}...")
    print(f"Client App Traffic Key: {client_app_key.hex().upper()}")
    print(f"Server App Traffic Key: {server_app_key.hex().upper()}")

# Snippet 5: Complete ApexMilestone4TlsIdentityEngine
def test_snippet5():
    class ApexMilestone4TlsIdentityEngine:
        def __init__(self, eui64: str, serial: int):
            self.eui64 = eui64
            self.serial = serial
            self.state = "INIT"
            self.transcript = hashlib.sha256()
            self.app_keys = None

        def execute_handshake(self, server_pub: bytes, ocsp_valid_until: int, now: int):
            self.state = "CLIENT_HELLO_SENT"
            ch = f"CH:{self.eui64}:X25519_KEY".encode()
            self.transcript.update(ch)
            
            # Verify OCSP staple
            if now > ocsp_valid_until:
                self.state = "REVOCATION_FAIL"
                return False, "OCSP Staple Expired"
            
            # Process ServerHello & derive keys
            sh = f"SH:ACCEPTED".encode() + server_pub
            self.transcript.update(sh)
            
            # Shared secret
            shared_secret = hashlib.sha256(b"simulated_ecdh" + server_pub).digest()
            hs_secret = hmac.new(b"early", shared_secret, hashlib.sha256).digest()
            master_secret = hmac.new(hs_secret, b"master", hashlib.sha256).digest()
            
            client_write = hmac.new(master_secret, b"c_app" + self.transcript.digest(), hashlib.sha256).digest()[:16]
            server_write = hmac.new(master_secret, b"s_app" + self.transcript.digest(), hashlib.sha256).digest()[:16]
            self.app_keys = (client_write, server_write)
            
            self.state = "MUTUAL_TLS_ESTABLISHED"
            return True, "Handshake Certified"

    engine = ApexMilestone4TlsIdentityEngine("00-80-E1-02-00-14-3A-9F", 0x1A2B3C4D)
    ok, msg = engine.execute_handshake(b"\x99"*32, ocsp_valid_until=1775000000, now=1770000000)
    
    print(f"Milestone 4 Engine State: {engine.state}")
    print(f"Verification Result: {msg} (Success: {ok})")
    print(f"Client Write Key: {engine.app_keys[0].hex().upper()}")
    print(f"Server Write Key: {engine.app_keys[1].hex().upper()}")

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
