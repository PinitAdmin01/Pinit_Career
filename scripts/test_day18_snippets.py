import hashlib
import struct

# Snippet 1: The Revocation problem: check status against a revocation list
def test_snippet1():
    cert_serial = 0x1A2B3C4D
    revoked_serials = {0x11223344, 0x1A2B3C4D, 0x99887766}
    
    is_revoked = cert_serial in revoked_serials
    print(f"Checking Serial: 0x{cert_serial:08X}")
    print(f"Revocation Status: {'REVOKED' if is_revoked else 'GOOD'}")

# Snippet 2: Megabyte CRL scaling calculation & Delta CRL footprint
def test_snippet2():
    total_revoked = 50_000
    entry_size_bytes = 16 # serial (8 bytes) + rev date (4 bytes) + reason (4 bytes)
    crl_size_kb = (total_revoked * entry_size_bytes) / 1024
    mcu_ram_kb = 32
    
    # Delta CRL: only last 24h revocations (e.g. 50 certs)
    delta_certs = 50
    delta_size_kb = (delta_certs * entry_size_bytes) / 1024
    print(f"Full CRL Size: {crl_size_kb:.1f} KB (MCU RAM: {mcu_ram_kb} KB -> {crl_size_kb / mcu_ram_kb:.1f}x RAM)")
    print(f"Delta CRL Size: {delta_size_kb:.2f} KB (Fits comfortably in MCU RAM)")

# Snippet 3: RFC 6066 OCSP Stapling Response Parser
def test_snippet3():
    # Mock OCSP response:
    # Status: 0 (Successful), CertStatus: 0 (Good), ProducedAt, ThisUpdate, NextUpdate
    # Signature over status block
    class MockOcspStaple:
        def __init__(self, serial: int, status: str, valid_until_epoch: int):
            self.serial = serial
            self.status = status # "GOOD", "REVOKED", "UNKNOWN"
            self.valid_until = valid_until_epoch
            # compute mock signature over payload
            payload = f"{serial}:{status}:{valid_until_epoch}".encode()
            self.signature = hashlib.sha256(payload).hexdigest()[:16]

    staple = MockOcspStaple(0x1A2B3C4D, "GOOD", 1775000000)
    current_time = 1770000000
    is_fresh = current_time < staple.valid_until
    print(f"OCSP Staple for Serial 0x{staple.serial:08X}: Status={staple.status}")
    print(f"Freshness Check: {'PASS' if is_fresh else 'EXPIRED'} (Valid until {staple.valid_until})")
    print(f"CA Signature Digest: {staple.signature}")

# Snippet 4: Bloom Filter for Compact Local Revocation Blacklists
def test_snippet4():
    class CompactBloomRevocation:
        def __init__(self, size_bytes=64, num_hashes=3):
            self.size_bits = size_bytes * 8
            self.bitarray = bytearray(size_bytes)
            self.num_hashes = num_hashes

        def _hashes(self, serial: int):
            data = struct.pack(">Q", serial)
            h1 = int(hashlib.md5(data).hexdigest(), 16)
            h2 = int(hashlib.sha1(data).hexdigest(), 16)
            for i in range(self.num_hashes):
                yield (h1 + i * h2) % self.size_bits

        def add_revoked(self, serial: int):
            for bit_idx in self._hashes(serial):
                byte_idx = bit_idx // 8
                bit_offset = bit_idx % 8
                self.bitarray[byte_idx] |= (1 << bit_offset)

        def is_revoked(self, serial: int) -> bool:
            for bit_idx in self._hashes(serial):
                byte_idx = bit_idx // 8
                bit_offset = bit_idx % 8
                if not (self.bitarray[byte_idx] & (1 << bit_offset)):
                    return False
            return True

    bloom = CompactBloomRevocation(size_bytes=32, num_hashes=3)
    revoked_list = [0x11223344, 0x55667788, 0xDEADBEEF]
    for s in revoked_list:
        bloom.add_revoked(s)

    test_pass = bloom.is_revoked(0xCAFEBABE)
    test_fail = bloom.is_revoked(0xDEADBEEF)
    print(f"Bloom Filter Memory: {len(bloom.bitarray)} bytes ({len(bloom.bitarray)*8} bits)")
    print(f"Serial 0xDEADBEEF: {'REVOKED' if test_fail else 'GOOD'}")
    print(f"Serial 0xCAFEBABE: {'REVOKED' if test_pass else 'GOOD'}")

# Snippet 5: ApexEdgeRevocationEngine
def test_snippet5():
    class ApexEdgeRevocationEngine:
        def __init__(self, bloom_size=64):
            self.bloom_bits = bloom_size * 8
            self.filter = bytearray(bloom_size)

        def record_revocation(self, serial: int):
            for salt in [0x01, 0x02, 0x03]:
                h = int(hashlib.sha256(struct.pack(">QB", serial, salt)).hexdigest()[:8], 16)
                bit = h % self.bloom_bits
                self.filter[bit // 8] |= (1 << (bit % 8))

        def verify_certificate(self, serial: int, ocsp_staple=None, now_epoch=1770000000):
            # Step 1: Check local Bloom filter blacklist
            is_blacklisted = True
            for salt in [0x01, 0x02, 0x03]:
                h = int(hashlib.sha256(struct.pack(">QB", serial, salt)).hexdigest()[:8], 16)
                bit = h % self.bloom_bits
                if not (self.filter[bit // 8] & (1 << (bit % 8))):
                    is_blacklisted = False
                    break
            
            if is_blacklisted:
                return "FAIL: Serial is in local revocation blacklist"

            # Step 2: If OCSP staple provided, verify staple
            if ocsp_staple:
                if ocsp_staple.get("status") != "GOOD":
                    return f"FAIL: OCSP status is {ocsp_staple.get('status')}"
                if now_epoch > ocsp_staple.get("valid_until", 0):
                    return "FAIL: OCSP staple has expired"
                return "PASS: Certificate verified (Bloom OK + Valid OCSP Staple)"
            
            return "PASS: Certificate verified (Bloom OK, no staple)"

    engine = ApexEdgeRevocationEngine(bloom_size=32)
    engine.record_revocation(0xBAADC0DE)
    
    # Test valid cert with good staple
    staple_ok = {"status": "GOOD", "valid_until": 1775000000}
    r1 = engine.verify_certificate(0x00112233, staple_ok)
    r2 = engine.verify_certificate(0xBAADC0DE, staple_ok)
    print(f"Cert 0x00112233: {r1}")
    print(f"Cert 0xBAADC0DE: {r2}")

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
