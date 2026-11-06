import hmac
import hashlib
import struct

# Snippet 1: RFC 8446 1-RTT Handshake flow & Transcript Hash simulation
def test_snippet1():
    # Simulate Handshake Transcript Hash
    # ClientHello + ServerHello
    client_random = b"\x01" * 32
    server_random = b"\x02" * 32
    
    transcript = hashlib.sha256()
    client_hello = b"ClientHello:TLS_AES_128_GCM_SHA256:x25519" + client_random
    server_hello = b"ServerHello:TLS_AES_128_GCM_SHA256:x25519" + server_random
    
    transcript.update(client_hello)
    transcript.update(server_hello)
    thash = transcript.hexdigest()
    print(f"Transcript Length: {len(client_hello) + len(server_hello)} bytes")
    print(f"Transcript SHA-256 Digest: {thash[:16]}...")

# Snippet 2: Ephemeral ECDHE Key Exchange with scalar math
def test_snippet2():
    # Simulated Curve25519 / P-256 ECDHE point multiplication
    # Client private key scalar 'a', public key A = a * G
    # Server private key scalar 'b', public key B = b * G
    # Shared secret S = a * B = b * A = a * b * G
    # In stdlib Python, we can simulate the shared secret scalar derivation
    client_priv = 0x5A5A5A5A
    server_priv = 0x7B7B7B7B
    generator_g = 0x09 # Base point generator
    
    # Simple simulated modular group for demonstration
    prime_p = 0xFFFFFFFFFFFFFFC5
    client_pub = pow(generator_g, client_priv, prime_p)
    server_pub = pow(generator_g, server_priv, prime_p)
    
    shared_client = pow(server_pub, client_priv, prime_p)
    shared_server = pow(client_pub, server_priv, prime_p)
    
    shared_secret_bytes = struct.pack(">Q", shared_client)
    print(f"Client PubKey: 0x{client_pub:016X}")
    print(f"Server PubKey: 0x{server_pub:016X}")
    print(f"Secrets Match: {shared_client == shared_server} (Shared Secret: {shared_secret_bytes.hex().upper()})")

# Snippet 3: TLS 1.3 HKDF Key Schedule (RFC 5869 & RFC 8446 HKDF-Expand-Label)
def test_snippet3():
    def hkdf_extract(salt: bytes, ikm: bytes) -> bytes:
        if not salt:
            salt = b"\x00" * 32
        return hmac.new(salt, ikm, hashlib.sha256).digest()

    def hkdf_expand_label(secret: bytes, label: str, context: bytes, length: int) -> bytes:
        # TLS 1.3 HkdfLabel: uint16 length, opaque label<7..255> = "tls13 " + label, opaque context<0..255>
        full_label = b"tls13 " + label.encode("ascii")
        hkdf_label = struct.pack(">H", length) + bytes([len(full_label)]) + full_label + bytes([len(context)]) + context
        # HKDF-Expand: HMAC(secret, info + 0x01)
        info = hkdf_label + b"\x01"
        return hmac.new(secret, info, hashlib.sha256).digest()[:length]

    # Early Secret -> Handshake Secret
    shared_secret = b"\x42" * 32
    early_secret = hkdf_extract(b"\x00" * 32, b"\x00" * 32)
    # Derive secret for handshake
    derived_secret = hkdf_expand_label(early_secret, "derived", hashlib.sha256(b"").digest(), 32)
    handshake_secret = hkdf_extract(derived_secret, shared_secret)
    
    # Handshake Traffic Keys (16-byte AES-128 key)
    mock_transcript = hashlib.sha256(b"handshake_transcript").digest()
    client_hs_key = hkdf_expand_label(handshake_secret, "c hs traffic", mock_transcript, 16)
    server_hs_key = hkdf_expand_label(handshake_secret, "s hs traffic", mock_transcript, 16)
    print(f"Handshake Secret: {handshake_secret.hex()[:16]}...")
    print(f"Client HS Traffic Key: {client_hs_key.hex().upper()}")
    print(f"Server HS Traffic Key: {server_hs_key.hex().upper()}")

# Snippet 4: Record Buffer Optimization (MFLN 512 bytes vs 16 KB standard)
def test_snippet4():
    standard_record_buffer = 16384 # 16 KB default TLS record
    mfln_512_buffer = 512          # RFC 6066 Maximum Fragment Length 512 bytes
    
    # wolfSSL static memory budget calculation:
    # 2 buffers (TX + RX) + cipher context
    standard_ram_bytes = (standard_record_buffer * 2) + 1024
    mfln_ram_bytes = (mfln_512_buffer * 2) + 1024
    
    savings_percent = (1 - (mfln_ram_bytes / standard_ram_bytes)) * 100
    print(f"Standard TLS 1.3 Record RAM: {standard_ram_bytes / 1024:.1f} KB")
    print(f"Optimized MFLN-512 Record RAM: {mfln_ram_bytes / 1024:.2f} KB")
    print(f"SRAM Savings: {savings_percent:.1f}%")

# Snippet 5: ApexBaremetalTlsEngine
def test_snippet5():
    class ApexBaremetalTlsEngine:
        def __init__(self):
            self.state = "START"
            self.transcript = hashlib.sha256()
            self.handshake_secret = None

        def send_client_hello(self):
            ch_data = b"ClientHello:TLS_AES_128_GCM_SHA256:ECDHE_X25519"
            self.transcript.update(ch_data)
            self.state = "WAIT_SERVER_HELLO"
            return ch_data

        def process_server_hello(self, sh_data: bytes, shared_secret: bytes):
            if self.state != "WAIT_SERVER_HELLO":
                raise ValueError("Unexpected state")
            self.transcript.update(sh_data)
            
            # Derive Handshake Traffic Key
            thash = self.transcript.digest()
            self.handshake_secret = hmac.new(b"derived_early", shared_secret, hashlib.sha256).digest()
            client_write_key = hmac.new(self.handshake_secret, b"tls13 c hs key" + thash, hashlib.sha256).digest()[:16]
            self.state = "HANDSHAKE_ENCRYPTED"
            return client_write_key

        def finish_handshake(self, server_finished_mac: bytes):
            if self.state != "HANDSHAKE_ENCRYPTED":
                raise ValueError("Handshake not encrypted")
            # Verify Finished MAC
            expected_mac = hmac.new(self.handshake_secret, b"finished:" + self.transcript.digest(), hashlib.sha256).digest()[:16]
            if server_finished_mac != expected_mac:
                self.state = "ERROR"
                return False
            self.state = "ESTABLISHED"
            return True

    engine = ApexBaremetalTlsEngine()
    ch = engine.send_client_hello()
    sh = b"ServerHello:ECDHE_ACCEPTED"
    mock_shared = b"\x33" * 32
    client_key = engine.process_server_hello(sh, mock_shared)
    
    # Compute matching server finished mac
    expected_mac = hmac.new(engine.handshake_secret, b"finished:" + engine.transcript.digest(), hashlib.sha256).digest()[:16]
    success = engine.finish_handshake(expected_mac)
    print(f"Engine State: {engine.state}")
    print(f"Client Write Key: {client_key.hex().upper()}")
    print(f"Handshake Completed: {success}")

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
