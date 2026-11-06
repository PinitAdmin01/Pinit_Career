import struct
import hashlib

# Snippet 1: Basic TLV parser for ASN.1 DER
def test_snippet1():
    # Construct a sample ASN.1 DER sequence: SEQUENCE (0x30) containing an INTEGER (0x02) and OCTET STRING (0x04)
    # INTEGER 42 -> 0x02, 0x01, 0x2A
    # OCTET STRING "IDevID" -> 0x04, 0x06, 0x49 0x44 0x65 0x76 0x49 0x44
    int_tlv = bytes([0x02, 0x01, 0x2A])
    str_tlv = bytes([0x04, 0x06]) + b"IDevID"
    seq_payload = int_tlv + str_tlv
    seq_tlv = bytes([0x30, len(seq_payload)]) + seq_payload

    def parse_tlv(buf, offset=0):
        tag = buf[offset]
        length = buf[offset + 1]
        val = buf[offset + 2 : offset + 2 + length]
        return tag, length, val, offset + 2 + length

    t1, l1, v1, off1 = parse_tlv(seq_payload, 0)
    t2, l2, v2, off2 = parse_tlv(seq_payload, off1)
    print(f"Tag1: 0x{t1:02X}, Len1: {l1}, Val: {int.from_bytes(v1, 'big')}")
    print(f"Tag2: 0x{t2:02X}, Len2: {l2}, Val: {v2.decode()}")

# Snippet 2: Bounds checking and anti-recursion TLV parser (no recursion, strict loop)
def test_snippet2():
    # Attack payload: nested sequences exceeding max depth or malformed length extending past buffer
    malformed = bytes([0x30, 0x50, 0x02, 0x01, 0x01]) # length 0x50 but only 3 bytes follow!
    
    def safe_parse_tlv(buf, max_len=1024):
        if len(buf) > max_len:
            return "ERROR: Buffer exceeds max memory budget"
        if len(buf) < 2:
            return "ERROR: Truncated TLV header"
        tag = buf[0]
        length_byte = buf[1]
        if length_byte & 0x80:
            num_len_bytes = length_byte & 0x7F
            if num_len_bytes == 0:
                return "ERROR: Indefinite length forbidden in DER"
            if 2 + num_len_bytes > len(buf):
                return "ERROR: Truncated multibyte length"
            length = int.from_bytes(buf[2 : 2 + num_len_bytes], "big")
            val_start = 2 + num_len_bytes
        else:
            length = length_byte
            val_start = 2
        
        if val_start + length > len(buf):
            return f"ERROR: Length overflow: claims {length} bytes but buffer has {len(buf) - val_start}"
        return f"OK: Tag=0x{tag:02X}, Len={length}"

    res = safe_parse_tlv(malformed, max_len=64)
    print(res)

# Snippet 3: Zero-heap static cursor parsing
def test_snippet3():
    # Simulating a zero-heap flat parser walking an X.509 structure in a static 256-byte buffer
    class ZeroHeapReader:
        def __init__(self, data: bytes):
            self.buf = bytearray(data)
            self.pos = 0
            self.size = len(data)

        def read_tlv(self):
            if self.pos + 2 > self.size:
                return None
            tag = self.buf[self.pos]
            length = self.buf[self.pos + 1]
            if self.pos + 2 + length > self.size:
                raise ValueError("Out of bounds")
            val_offset = self.pos + 2
            self.pos += 2 + length
            return tag, length, val_offset

    # Construct test data: OID 1.2.840.10045.2.1 (EC Public Key) and EUI-64 ID
    oid_bytes = bytes([0x06, 0x07, 0x2A, 0x86, 0x48, 0xCE, 0x3D, 0x02, 0x01])
    id_bytes = bytes([0x04, 0x08, 0x00, 0x80, 0xE1, 0x02, 0x00, 0x14, 0x3A, 0x9F])
    reader = ZeroHeapReader(oid_bytes + id_bytes)
    t1, l1, off1 = reader.read_tlv()
    t2, l2, off2 = reader.read_tlv()
    print(f"ZeroHeap TLV1: Tag=0x{t1:02X}, Len={l1}, RawOffset={off1}")
    print(f"ZeroHeap TLV2: Tag=0x{t2:02X}, Len={l2}, Hex={bytes(reader.buf[off2:off2+l2]).hex().upper()}")

# Snippet 4: Parsing X.509 SPKI and Validity
def test_snippet4():
    # Minimal serialized X.509 mock structure
    # Serial (0x02), Validity NotBefore/NotAfter (UTCTIME 0x17), SPKI (0x30)
    serial = bytes([0x02, 0x04, 0x1A, 0x2B, 0x3C, 0x4D])
    # 260101000000Z to 270101000000Z
    validity = bytes([0x30, 0x1E, 
                      0x17, 0x0D]) + b"260101000000Z" + bytes([0x17, 0x0D]) + b"270101000000Z"
    spki_key = bytes([0x03, 0x21, 0x00]) + bytes(range(32)) # 33 bytes bitstring (0x00 unused bits + 32-byte pubkey)
    
    def parse_validity(buf):
        # Scan for UTCTime tags 0x17
        idx = buf.find(b"\x17\x0d")
        if idx != -1:
            t1 = buf[idx+2 : idx+15].decode("ascii")
            idx2 = buf.find(b"\x17\x0d", idx + 15)
            t2 = buf[idx2+2 : idx2+15].decode("ascii")
            return t1, t2
        return None, None

    nb, na = parse_validity(validity)
    print(f"Serial: {serial[2:].hex().upper()}")
    print(f"NotBefore: {nb}, NotAfter: {na}")
    print(f"SPKI Key Len: {len(spki_key) - 3} bytes")

# Snippet 5: ApexTinyDerParserEngine
def test_snippet5():
    class ApexTinyDerParserEngine:
        def __init__(self, raw_der: bytes):
            self.data = raw_der
            self.cursor = 0

        def parse_certificate(self):
            # Verify outer SEQUENCE
            if len(self.data) < 4 or self.data[0] != 0x30:
                raise ValueError("Invalid DER: Outer element not SEQUENCE")
            
            # Simple zero-copy scanner
            report = {}
            # Find Serial
            if self.data[2] == 0x02:
                s_len = self.data[3]
                report["serial"] = self.data[4 : 4 + s_len].hex().upper()
            
            # Find UTCTime
            u_idx = self.data.find(b"\x17\x0D")
            if u_idx != -1:
                report["valid_from"] = self.data[u_idx+2 : u_idx+15].decode("ascii")
                u_idx2 = self.data.find(b"\x17\x0D", u_idx+15)
                if u_idx2 != -1:
                    report["valid_to"] = self.data[u_idx2+2 : u_idx2+15].decode("ascii")
            
            # Find Public Key (BitString 0x03)
            b_idx = self.data.find(b"\x03\x41\x00\x04") # uncompressed P-256 key (65 bytes)
            if b_idx != -1:
                report["ec_pubkey"] = self.data[b_idx+3 : b_idx+3+65].hex()[:16] + "..."
            else:
                # 33-byte compressed key or mock key
                b_idx = self.data.find(b"\x03\x21\x00")
                if b_idx != -1:
                    report["ec_pubkey"] = self.data[b_idx+3 : b_idx+3+32].hex()[:16] + "..."

            return report

    # Build mock cert
    mock_cert = bytes([0x30, 0x60, 0x02, 0x04, 0x7E, 0x11, 0x22, 0x33]) + \
                bytes([0x17, 0x0D]) + b"260101000000Z" + bytes([0x17, 0x0D]) + b"270101000000Z" + \
                bytes([0x03, 0x21, 0x00]) + (b"\xAA" * 32)
    
    engine = ApexTinyDerParserEngine(mock_cert)
    res = engine.parse_certificate()
    print(f"Parsed Cert: Serial={res.get('serial')}, From={res.get('valid_from')}, To={res.get('valid_to')}")
    print(f"EC PubKey Snippet: {res.get('ec_pubkey')}")

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
