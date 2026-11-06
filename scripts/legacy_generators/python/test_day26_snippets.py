import struct
import hashlib

# Snippet 1: Attack Surface Assessment: Default vs Hardened Matrix
def test_snippet1():
    # Ports: 21 (FTP), 23 (Telnet), 80 (HTTP), 443 (HTTPS), 8883 (MQTTS)
    default_ports = {21: "OPEN", 23: "OPEN", 80: "OPEN", 443: "OPEN", 8883: "OPEN"}
    
    # Hardened policy: allow only authenticated, encrypted transport
    allowed_ports = {443, 8883}
    hardened_ports = {p: ("OPEN" if p in allowed_ports else "BLOCKED") for p in default_ports}
    
    insecure_open_count = sum(1 for p, s in hardened_ports.items() if s == "OPEN" and p not in allowed_ports)
    print("Default Config Ports :", default_ports)
    print("Hardened Config Ports:", hardened_ports)
    print("Insecure Ports Open  :", insecure_open_count)

# Snippet 2: Bare-Metal Port Filter Table
def test_snippet2():
    # Hardware socket table simulator
    # Only Port 8883 (MQTTS) and 443 (HTTPS) allowed on WAN interface
    whitelist = {
        8883: {"proto": "TCP", "tls": True, "iface": "WAN"},
        443:  {"proto": "TCP", "tls": True, "iface": "WAN"}
    }
    
    def evaluate_ingress(port: int, proto: str, iface: str) -> bool:
        rule = whitelist.get(port)
        if not rule:
            return False
        return rule["proto"] == proto and rule["iface"] == iface
    
    telnet_ok = evaluate_ingress(23, "TCP", "WAN")
    mqtts_ok = evaluate_ingress(8883, "TCP", "WAN")
    
    print(f"Ingress Port 23 (Telnet): {'ACCEPTED' if telnet_ok else 'REJECTED (PORT_LOCKED)'}")
    print(f"Ingress Port 8883 (MQTTS): {'ACCEPTED' if mqtts_ok else 'REJECTED'}")

# Snippet 3: Token Bucket Rate Limiting for Embedded Sockets
def test_snippet3():
    class TokenBucketLimiter:
        def __init__(self, capacity: int, refill_rate: float):
            self.capacity = capacity
            self.tokens = capacity
            self.refill_rate = refill_rate
            self.last_check = 0.0

        def allow_connection(self, timestamp: float) -> bool:
            elapsed = timestamp - self.last_check
            self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
            self.last_check = timestamp
            
            if self.tokens >= 1.0:
                self.tokens -= 1.0
                return True
            return False

    limiter = TokenBucketLimiter(capacity=3, refill_rate=0.5) # 3 burst, 0.5 tokens/sec
    
    # 4 immediate connection requests at t=0.0
    r1 = limiter.allow_connection(0.0)
    r2 = limiter.allow_connection(0.0)
    r3 = limiter.allow_connection(0.0)
    r4 = limiter.allow_connection(0.0) # Should be rate limited!
    
    print(f"Req 1 (t=0.0): {'ALLOWED' if r1 else 'RATE_LIMITED'}")
    print(f"Req 2 (t=0.0): {'ALLOWED' if r2 else 'RATE_LIMITED'}")
    print(f"Req 3 (t=0.0): {'ALLOWED' if r3 else 'RATE_LIMITED'}")
    print(f"Req 4 (t=0.0): {'ALLOWED' if r4 else 'RATE_LIMITED'}")

# Snippet 4: Safe Packet Framing Validator
def test_snippet4():
    # Magic (2B), Len (2B), Type (1B), Reserved (1B)
    MAX_PAYLOAD = 512
    
    def validate_packet_header(raw_header: bytes, total_buf_len: int) -> tuple:
        if len(raw_header) < 6:
            return False, "HEADER_TRUNCATED"
        magic, payload_len, p_type, _ = struct.unpack(">HHBB", raw_header[:6])
        if magic != 0xAA55:
            return False, "INVALID_MAGIC"
        if payload_len > MAX_PAYLOAD:
            return False, f"PAYLOAD_OVERFLOW: {payload_len} > {MAX_PAYLOAD}"
        if total_buf_len < 6 + payload_len:
            return False, "PACKET_TRUNCATED"
        return True, f"VALID_FRAME_TYPE_{p_type}_LEN_{payload_len}"

    hdr_good = struct.pack(">HHBB", 0xAA55, 128, 1, 0)
    hdr_overflow = struct.pack(">HHBB", 0xAA55, 1024, 1, 0)
    
    res1_ok, res1_msg = validate_packet_header(hdr_good, 6 + 128)
    res2_ok, res2_msg = validate_packet_header(hdr_overflow, 6 + 1024)
    
    print(f"Frame 1 (128B): {res1_msg} (Passed: {res1_ok})")
    print(f"Frame 2 (1024B): {res2_msg} (Passed: {res2_ok})")

# Snippet 5: ApexNetworkHardeningEngine
def test_snippet5():
    class ApexNetworkHardeningEngine:
        def __init__(self, allowed_ports: set, max_payload: int):
            self.allowed_ports = allowed_ports
            self.max_payload = max_payload
            self.tokens = 5
            self.rejected_count = 0

        def process_ingress_packet(self, port: int, packet_bytes: bytes) -> tuple:
            # 1. Port lockdown check
            if port not in self.allowed_ports:
                self.rejected_count += 1
                return False, f"BLOCKED_UNAUTHORIZED_PORT_{port}"
            
            # 2. Rate limit check
            if self.tokens <= 0:
                self.rejected_count += 1
                return False, "BLOCKED_RATE_LIMIT_EXCEEDED"
            self.tokens -= 1
            
            # 3. Packet boundary validation
            if len(packet_bytes) < 4:
                self.rejected_count += 1
                return False, "BLOCKED_HEADER_MALFORMED"
            
            magic, length = struct.unpack(">HH", packet_bytes[:4])
            if magic != 0x5049: # 'PI' (PinIT)
                self.rejected_count += 1
                return False, "BLOCKED_INVALID_PROTOCOL_MAGIC"
            if length > self.max_payload:
                self.rejected_count += 1
                return False, f"BLOCKED_PAYLOAD_SIZE_{length}"
            if len(packet_bytes) < 4 + length:
                self.rejected_count += 1
                return False, "BLOCKED_PACKET_TRUNCATION"
            
            return True, f"ACCEPTED_PORT_{port}_LEN_{length}"

    engine = ApexNetworkHardeningEngine(allowed_ports={8883, 443}, max_payload=256)
    
    # Test A: Attack on Port 23
    p1_ok, p1_msg = engine.process_ingress_packet(23, b"HELLO")
    
    # Test B: Valid packet on Port 8883
    valid_pkt = struct.pack(">HH", 0x5049, 32) + b"A" * 32
    p2_ok, p2_msg = engine.process_ingress_packet(8883, valid_pkt)
    
    # Test C: Buffer overflow attack on Port 8883 (Length declared = 500)
    overflow_pkt = struct.pack(">HH", 0x5049, 500) + b"B" * 500
    p3_ok, p3_msg = engine.process_ingress_packet(8883, overflow_pkt)
    
    print(f"Port 23 Access  : {p1_msg} (Success: {p1_ok})")
    print(f"Port 8883 Valid : {p2_msg} (Success: {p2_ok})")
    print(f"Port 8883 Attack: {p3_msg} (Success: {p3_ok})")
    print(f"Total Blocked Attacks: {engine.rejected_count}")

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
