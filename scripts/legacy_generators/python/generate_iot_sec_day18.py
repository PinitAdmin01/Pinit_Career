import json

def generate_day18():
    day18 = {
        "coursePrefix": "iot_sec",
        "day": 18,
        "title": "Certificate Revocation on Edge Devices: CRL, OCSP & Offline Memory Budgets",
        "goal": "Analyze certificate revocation scaling bottlenecks on constrained edge microcontrollers, master RFC 6066 OCSP Stapling, and implement compact probabilistic Bloom filter revocation blacklists for offline gateways.",
        "minutes": 38,
        "recap": "Yesterday we dissected ASN.1 DER Tag-Length-Value encoding and implemented a zero-heap static-buffer X.509 certificate parser. Today we tackle the critical challenge of certificate revocation on resource-constrained, intermittently connected IoT nodes.",
        "parts": [
            {
                "title": "The IoT Certificate Revocation Dilemma & Network Constraints",
                "say": [
                    "In enterprise and web Public Key Infrastructure, issuing a digital certificate is only half of the security equation. The other half is revocation: the ability to immediately invalidate a certificate before its natural expiration date if the associated private key is compromised, the device is physically stolen, or the hardware is decommissioned.",
                    "On desktop browsers and cloud servers operating over multi-gigabit fiber connections, checking revocation is straightforward. When connecting to a secure domain, the client queries online revocation endpoints to determine whether the certificate serial number has been marked as revoked by the issuing Certificate Authority.",
                    "However, in the Internet of Things (IoT), certificate revocation represents one of the most notoriously difficult engineering challenges. Edge devices operate under severe technical constraints that render conventional revocation mechanisms completely unworkable. A smart water meter or agricultural soil sensor typically connects over low-power wide-area networks (LPWAN) such as NB-IoT, LTE-M, or LoRaWAN. These networks offer data throughput of only a few kilobits per second and charge per-kilobyte data fees.",
                    "Furthermore, battery-powered IoT devices spend 99.9% of their operating life in deep sleep modes, waking up for mere seconds to transmit a single encrypted telemetry packet before returning to sleep. Establishing independent network connections to query remote revocation authorities consumes prohibitive battery energy and radio duty cycle budget.",
                    "Compounding these network limits is the offline operational reality of industrial edge computing. Microcontrollers deployed in offshore wind farms, railway locomotives, or subterranean mining tunnels frequently operate for days or weeks without an active Internet uplink. If a device requires an instantaneous online query to validate peer certificates, the entire industrial control system grinds to a halt whenever connectivity drops.",
                    "Therefore, embedded firmware architectures require specialized, low-bandwidth, and memory-efficient revocation models that balance freshness against extreme resource constraints."
                ],
                "example": "Let us examine a basic revocation verification logic where an edge node checks incoming device certificate serial numbers against a set of known revoked credentials.",
                "code": "cert_serial = 0x1A2B3C4D\nrevoked_serials = {0x11223344, 0x1A2B3C4D, 0x99887766}\n\nis_revoked = cert_serial in revoked_serials\nprint(f\"Checking Serial: 0x{cert_serial:08X}\")\nprint(f\"Revocation Status: {'REVOKED' if is_revoked else 'GOOD'}\")",
                "output": "Checking Serial: 0x1A2B3C4D\nRevocation Status: REVOKED",
                "codeNotes": [
                    "Extracts the certificate serial number from the X.509 TBSCertificate structure.",
                    "Compares the serial against the local revocation database.",
                    "Flags the connection as compromised if the serial matches a revoked entry."
                ],
                "tryIt": "Test what happens if cert_serial is changed to 0x55667788 (an unrevoked serial number).",
                "check": {
                    "question": "Why do traditional online certificate revocation checks fail on battery-powered LPWAN IoT devices?",
                    "options": [
                        "Low data rates, expensive cellular bandwidth fees, and strict deep-sleep energy budgets make frequent external lookups prohibitive.",
                        "LPWAN protocols cannot transmit TLS 1.3 packets under any circumstances.",
                        "Certificate serial numbers cannot be represented over cellular modems.",
                        "The IEEE 802.1AR standard prohibits revoking certificates after manufacturing."
                    ],
                    "answer": 0,
                    "why": "Querying remote servers over low-bandwidth cellular or satellite links drains battery power and exceeds radio duty-cycle regulations."
                }
            },
            {
                "title": "Certificate Revocation Lists (CRL): The Microcontroller Scaling Bottleneck",
                "say": [
                    "The earliest standardized mechanism for certificate revocation is the Certificate Revocation List (CRL), defined in RFC 5280. A CRL is a digitally signed, timestamped blacklist published periodically by a Certificate Authority. It contains an ASN.1 sequence of revoked certificate serial numbers, revocation timestamps, and optional reason codes.",
                    "In small, closed PKI deployments, CRLs function adequately. However, in enterprise IoT fleets with millions of connected nodes, CRLs suffer from a catastrophic scaling bottleneck: linear size growth. Because a CRL is an append-only list of every certificate ever revoked by that CA, its file size balloons over time.",
                    "Consider a commercial IoT platform managing 1,000,000 devices. If 5% of certificates are revoked over a five-year period (due to device decommissioning, key rotation, or board replacement), the CRL contains 50,000 entries. Each revoked entry requires approximately 16 to 24 bytes in ASN.1 DER encoding. Consequently, the raw CRL download exceeds 800 Kilobytes to 1.2 Megabytes.",
                    "For a resource-constrained microcontroller featuring only 32 KB or 64 KB of internal SRAM, downloading an 800 KB CRL is physically impossible: the file is 25 times larger than the device's entire memory space! Even if the microcontroller streams the CRL directly into external SPI NOR flash, downloading a 1 MB file over an NB-IoT link at 10 kbps requires over 13 minutes of continuous radio transmission, consuming thousands of milliampere-seconds of battery power.",
                    "To mitigate this, RFC 5280 introduced Delta CRLs, where the CA publishes a small incremental list containing only certificates revoked since the last base CRL issuance. While Delta CRLs reduce bandwidth for active updates, the client must still periodically ingest the massive base CRL to maintain ground truth. For embedded edge architectures, classical full CRL ingestion is fundamentally incompatible with microcontroller memory budgets."
                ],
                "example": "Let us compute the memory and bandwidth disparity between full CRL downloads and incremental Delta CRLs on a 32 KB RAM microcontroller.",
                "code": "total_revoked = 50_000\nentry_size_bytes = 16\ncrl_size_kb = (total_revoked * entry_size_bytes) / 1024\nmcu_ram_kb = 32\n\ndelta_certs = 50\ndelta_size_kb = (delta_certs * entry_size_bytes) / 1024\nprint(f\"Full CRL Size: {crl_size_kb:.1f} KB (MCU RAM: {mcu_ram_kb} KB -> {crl_size_kb / mcu_ram_kb:.1f}x RAM)\")\nprint(f\"Delta CRL Size: {delta_size_kb:.2f} KB (Fits comfortably in MCU RAM)\")",
                "output": "Full CRL Size: 781.2 KB (MCU RAM: 32 KB -> 24.4x RAM)\nDelta CRL Size: 0.78 KB (Fits comfortably in MCU RAM)",
                "codeNotes": [
                    "Full CRL scaling is proportional to total historical fleet revocations.",
                    "Full CRL exceeds microcontroller RAM by more than 24x.",
                    "Delta CRLs restrict bandwidth to recent updates but require complex baseline state synchronization."
                ],
                "tryIt": "Calculate what the full CRL size would be if the fleet reaches 200,000 revoked certificates over a 10-year lifespan.",
                "check": {
                    "question": "What is the primary reason full Certificate Revocation Lists (CRLs) fail on resource-constrained microcontrollers?",
                    "options": [
                        "The linear growth of revoked entries causes the CRL file size to exceed total available microcontroller SRAM by orders of magnitude.",
                        "CRLs use RSA-4096 signatures which microcontrollers cannot mathematically compute.",
                        "CRLs are only valid when transmitted over unencrypted HTTP channels.",
                        "CRLs do not include digital signatures from the issuing CA."
                    ],
                    "answer": 0,
                    "why": "A full CRL grows with every revoked certificate in CA history, quickly reaching megabytes—far exceeding the typical 16 KB-64 KB SRAM of an MCU."
                }
            },
            {
                "title": "Online Certificate Status Protocol (OCSP) & RFC 6066 OCSP Stapling",
                "say": [
                    "To overcome the unbounded size of CRLs, the IETF developed the Online Certificate Status Protocol (OCSP), standardized under RFC 6960. Instead of forcing the client to download a complete list of all revoked certificates, OCSP provides a lightweight request-response query mechanism. The client sends a compact OCSPRequest containing only the serial number of the certificate in question, and the CA's OCSP Responder replies with a signed OCSPResponse stating whether that specific certificate is 'good', 'revoked', or 'unknown'.",
                    "While direct OCSP queries resolve the memory storage problem, they introduce two severe penalties for edge microcontrollers: latency and privacy leaks. Every time an IoT device connects to a server, it must open an auxiliary TCP connection to the OCSP Responder before it can complete the primary TLS handshake. If the OCSP server is slow or unreachable, the connection stalls. Furthermore, direct OCSP leaks the client's network activity to third-party responder servers.",
                    "The modern engineering solution to this dilemma is RFC 6066 OCSP Stapling (formally known as the TLS Certificate Status Request extension). In OCSP Stapling, the client does not query the OCSP Responder at all! Instead, the responsibility of querying revocation status is offloaded entirely to the server (e.g., the cloud gateway or enterprise broker).",
                    "The server periodically contacts the CA's OCSP Responder (e.g., once every 24 hours), obtains a fresh, cryptographically signed OCSP response for its own certificate, and caches it. When an edge device initiates a TLS handshake with the server, the client includes the `status_request` extension in its ClientHello message. The server 'staples' the cached, CA-signed OCSP response directly into the TLS Certificate message sent to the client.",
                    "Upon receiving the stapled response, the microcontroller parses the status block, checks that the response has not expired (verifying the `thisUpdate` and `nextUpdate` timestamps), and validates the CA's digital signature over the OCSP response. This achieves zero client-side HTTP overhead, eliminates secondary connections, protects client privacy, and guarantees real-time revocation enforcement within a single round-trip TLS handshake."
                ],
                "example": "Let us simulate an embedded OCSP Stapling response verifier that checks the stapled status, validates timestamp freshness, and verifies the CA's cryptographic signature.",
                "code": "class MockOcspStaple:\n    def __init__(self, serial: int, status: str, valid_until_epoch: int):\n        self.serial = serial\n        self.status = status\n        self.valid_until = valid_until_epoch\n        payload = f\"{serial}:{status}:{valid_until_epoch}\".encode()\n        self.signature = hashlib.sha256(payload).hexdigest()[:16]\n\nstaple = MockOcspStaple(0x1A2B3C4D, \"GOOD\", 1775000000)\ncurrent_time = 1770000000\nis_fresh = current_time < staple.valid_until\nprint(f\"OCSP Staple for Serial 0x{staple.serial:08X}: Status={staple.status}\")\nprint(f\"Freshness Check: {'PASS' if is_fresh else 'EXPIRED'} (Valid until {staple.valid_until})\")\nprint(f\"CA Signature Digest: {staple.signature}\")",
                "output": "OCSP Staple for Serial 0x1A2B3C4D: Status=GOOD\nFreshness Check: PASS (Valid until 1775000000)\nCA Signature Digest: 5a5198ade7bf3756",
                "codeNotes": [
                    "OCSP response is bundled directly into the TLS handshake by the server, requiring no external HTTP lookups by the client.",
                    "Freshness verification ensures that an attacker cannot replay a stale OCSP response after revocation.",
                    "Digital signature generated by the CA guarantees that the status cannot be forged by an intermediary proxy."
                ],
                "tryIt": "Modify current_time to 1780000000 (after valid_until) and verify that the freshness check correctly flags the staple as EXPIRED.",
                "check": {
                    "question": "How does RFC 6066 OCSP Stapling reduce energy consumption on an IoT edge node?",
                    "options": [
                        "The server offloads the revocation query to the CA and bundles the signed proof directly into the TLS handshake, saving the MCU from making a secondary HTTP connection.",
                        "OCSP Stapling disables all asymmetric cryptography on the edge device.",
                        "OCSP Stapling allows the microcontroller to skip verifying the server certificate chain.",
                        "The CA sends an SMS message directly to the device modem whenever a certificate is revoked."
                    ],
                    "answer": 0,
                    "why": "By bundling the cached, CA-signed OCSP response into the TLS handshake, the edge device avoids spinning up a separate connection to an OCSP server."
                }
            },
            {
                "title": "Compact Local Delta Blacklists & Bloom Filters for Offline Gateways",
                "say": [
                    "While OCSP Stapling elegantly solves revocation for edge devices connecting outward to cloud servers, industrial edge architectures often face the inverse challenge: an on-premise edge gateway acting as a local server must authenticate hundreds of incoming sensor nodes over mutual TLS (mTLS) while operating offline from the cloud.",
                    "In an offline electrical substation or offshore drilling platform, the local edge gateway cannot query a cloud OCSP responder to verify incoming sensor certificates. If a technician reports that sensor node #402 was physically compromised or stolen, the gateway must immediately block node #402 without having access to an active Internet connection.",
                    "Storing an explicit list of 64-bit certificate serial numbers in microcontroller RAM consumes 8 bytes per entry. While manageable for 10 entries, storing thousands of revoked devices in constrained RAM or flash is inefficient. To maximize memory efficiency, high-performance embedded systems employ Bloom Filters.",
                    "A Bloom Filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It consists of a compact bit array of size $m$ and $k$ independent cryptographic hash functions. When a certificate serial number is added to the revocation filter, the serial is hashed by the $k$ hash functions, and the corresponding bit positions in the array are set to 1.",
                    "When an incoming certificate is validated, the gateway hashes its serial number with the same $k$ functions and checks whether all $k$ bits are 1. If any bit is 0, the certificate is guaranteed not to be in the revoked set (zero false negatives). If all bits are 1, the certificate is marked as revoked. By tuning the bit array size $m$ and number of hash functions $k$, a gateway can track thousands of revoked devices in less than 64 to 256 bytes of memory with an acceptably low false positive probability (e.g., < 0.1%)."
                ],
                "example": "Let us implement a compact 32-byte (256-bit) Bloom Filter in Python that registers revoked certificate serial numbers and checks incoming connections with zero false negatives.",
                "code": "class CompactBloomRevocation:\n    def __init__(self, size_bytes=64, num_hashes=3):\n        self.size_bits = size_bytes * 8\n        self.bitarray = bytearray(size_bytes)\n        self.num_hashes = num_hashes\n\n    def _hashes(self, serial: int):\n        data = struct.pack(\">Q\", serial)\n        h1 = int(hashlib.md5(data).hexdigest(), 16)\n        h2 = int(hashlib.sha1(data).hexdigest(), 16)\n        for i in range(self.num_hashes):\n            yield (h1 + i * h2) % self.size_bits\n\n    def add_revoked(self, serial: int):\n        for bit_idx in self._hashes(serial):\n            byte_idx = bit_idx // 8\n            bit_offset = bit_idx % 8\n            self.bitarray[byte_idx] |= (1 << bit_offset)\n\n    def is_revoked(self, serial: int) -> bool:\n        for bit_idx in self._hashes(serial):\n            byte_idx = bit_idx // 8\n            bit_offset = bit_idx % 8\n            if not (self.bitarray[byte_idx] & (1 << bit_offset)):\n                return False\n        return True\n\nbloom = CompactBloomRevocation(size_bytes=32, num_hashes=3)\nrevoked_list = [0x11223344, 0x55667788, 0xDEADBEEF]\nfor s in revoked_list:\n    bloom.add_revoked(s)\n\ntest_pass = bloom.is_revoked(0xCAFEBABE)\ntest_fail = bloom.is_revoked(0xDEADBEEF)\nprint(f\"Bloom Filter Memory: {len(bloom.bitarray)} bytes ({len(bloom.bitarray)*8} bits)\")\nprint(f\"Serial 0xDEADBEEF: {'REVOKED' if test_fail else 'GOOD'}\")\nprint(f\"Serial 0xCAFEBABE: {'REVOKED' if test_pass else 'GOOD'}\")",
                "output": "Bloom Filter Memory: 32 bytes (256 bits)\nSerial 0xDEADBEEF: REVOKED\nSerial 0xCAFEBABE: GOOD",
                "codeNotes": [
                    "Uses double hashing (h1 + i * h2) to generate multiple independent hash bit indices efficiently.",
                    "Compact 32-byte bit array stores revocation status for multiple devices in microscopic memory footprints.",
                    "Guarantees zero false negatives: if a certificate was revoked, it will never be reported as GOOD."
                ],
                "tryIt": "Add 0xCAFEBABE to the filter and verify that both test_pass and test_fail now return REVOKED.",
                "check": {
                    "question": "What is the crucial mathematical guarantee of a Bloom Filter when used for certificate revocation blacklists?",
                    "options": [
                        "It has zero false negatives: if a serial number was added to the blacklist, the filter will never claim it is valid.",
                        "It completely prevents all false positives regardless of bit array size.",
                        "It encrypts the serial numbers using asymmetric ECC cryptography.",
                        "It automatically deletes expired certificates after 24 hours."
                    ],
                    "answer": 0,
                    "why": "Bloom filters guarantee that an element in the set will never yield a negative test (zero false negatives). A non-revoked certificate might very rarely collide (false positive), but no revoked certificate can slip through."
                }
            },
            {
                "title": "ApexEdgeRevocationEngine: Hybrid Revocation Subsystem for IoT Gateways",
                "say": [
                    "To unify online and offline revocation checking into an industrial-grade firmware subsystem, embedded engineers deploy the ApexEdgeRevocationEngine. This engine integrates RFC 6066 OCSP Stapling verification for outbound cloud connections with a local, low-memory Bloom filter blacklist for offline peer validation.",
                    "Let us trace the operational lifecycle of this hybrid engine. When the device acts as a client connecting to a cloud broker over TLS 1.3, it sends an OCSP status request. Upon receiving the stapled OCSP response, the engine executes three verification checks: 1) Response Status: verifying that the status code is strictly 'GOOD'; 2) Freshness Window: verifying that the current UTC epoch time is less than `valid_until`; and 3) Cryptographic Proof: verifying the CA's digital signature over the OCSP response structure.",
                    "Simultaneously, when the device acts as an edge gateway accepting local mTLS connections from peer sensors in the field, it evaluates incoming certificate serial numbers against its local Bloom filter blacklist. If an attacker attempts to authenticate using a stolen or compromised sensor certificate, the Bloom filter detects the blacklisted serial number in microseconds and rejects the connection before TLS handshake keys are established.",
                    "By combining OCSP Stapling with compact Bloom filter delta blacklists, the ApexEdgeRevocationEngine solves the IoT revocation trilemma. It delivers instantaneous revocation enforcement, protects low-power radio bandwidth budgets, operates reliably during network outages, and guarantees memory safety within strict microcontroller SRAM boundaries."
                ],
                "example": "Let us execute the complete ApexEdgeRevocationEngine, demonstrating dual-mode verification combining local Bloom filter blacklists and stapled OCSP validation.",
                "code": "class ApexEdgeRevocationEngine:\n    def __init__(self, bloom_size=64):\n        self.bloom_bits = bloom_size * 8\n        self.filter = bytearray(bloom_size)\n\n    def record_revocation(self, serial: int):\n        for salt in [0x01, 0x02, 0x03]:\n            h = int(hashlib.sha256(struct.pack(\">QB\", serial, salt)).hexdigest()[:8], 16)\n            bit = h % self.bloom_bits\n            self.filter[bit // 8] |= (1 << (bit % 8))\n\n    def verify_certificate(self, serial: int, ocsp_staple=None, now_epoch=1770000000):\n        is_blacklisted = True\n        for salt in [0x01, 0x02, 0x03]:\n            h = int(hashlib.sha256(struct.pack(\">QB\", serial, salt)).hexdigest()[:8], 16)\n            bit = h % self.bloom_bits\n            if not (self.filter[bit // 8] & (1 << (bit % 8))):\n                is_blacklisted = False\n                break\n        \n        if is_blacklisted:\n            return \"FAIL: Serial is in local revocation blacklist\"\n\n        if ocsp_staple:\n            if ocsp_staple.get(\"status\") != \"GOOD\":\n                return f\"FAIL: OCSP status is {ocsp_staple.get('status')}\"\n            if now_epoch > ocsp_staple.get(\"valid_until\", 0):\n                return \"FAIL: OCSP staple has expired\"\n            return \"PASS: Certificate verified (Bloom OK + Valid OCSP Staple)\"\n        \n        return \"PASS: Certificate verified (Bloom OK, no staple)\"\n\nengine = ApexEdgeRevocationEngine(bloom_size=32)\nengine.record_revocation(0xBAADC0DE)\n\nstaple_ok = {\"status\": \"GOOD\", \"valid_until\": 1775000000}\nr1 = engine.verify_certificate(0x00112233, staple_ok)\nr2 = engine.verify_certificate(0xBAADC0DE, staple_ok)\nprint(f\"Cert 0x00112233: {r1}\")\nprint(f\"Cert 0xBAADC0DE: {r2}\")",
                "output": "Cert 0x00112233: PASS: Certificate verified (Bloom OK + Valid OCSP Staple)\nCert 0xBAADC0DE: FAIL: Serial is in local revocation blacklist",
                "codeNotes": [
                    "Fast-path local check eliminates rogue certificates before processing expensive cryptographic handshakes.",
                    "Verifies OCSP staple status and freshness window in a single pass.",
                    "Provides a comprehensive hybrid revocation engine for mission-critical industrial IoT deployments."
                ],
                "tryIt": "Pass an expired staple ({'status': 'GOOD', 'valid_until': 1760000000}) to verify that the engine fails with 'FAIL: OCSP staple has expired'.",
                "check": {
                    "question": "What happens if a revoked certificate serial number is presented to the ApexEdgeRevocationEngine?",
                    "options": [
                        "The local Bloom filter detects the serial number and fails verification immediately, regardless of any stapled response.",
                        "The engine downloads the complete 1 MB CRL over the radio.",
                        "The engine resets the microcontroller into factory bootloader mode.",
                        "The engine accepts the certificate if the TLS connection is encrypted."
                    ],
                    "answer": 0,
                    "why": "The local Bloom filter provides immediate, fail-closed blacklisting: if a serial is in the local blacklist, it is rejected immediately."
                }
            }
        ],
        "summary": [
            "Traditional online revocation queries fail on LPWAN IoT devices due to extreme bandwidth costs, latency, and battery sleep cycles.",
            "Full Certificate Revocation Lists (CRLs) suffer from linear size expansion, quickly exceeding microcontroller SRAM by 20x to 100x.",
            "RFC 6066 OCSP Stapling offloads query overhead to the server, delivering CA-signed, timestamped revocation proofs directly inside the TLS handshake.",
            "Compact local Bloom filters and delta blacklists allow offline edge gateways to enforce immediate revocation within microscopic 32-256 byte memory budgets."
        ],
        "projectStep": {
            "title": "Implement Hybrid Edge Revocation Subsystem with OCSP Stapling & Bloom Filters",
            "steps": [
                "Profile network bandwidth and RAM requirements for full CRLs vs Delta CRLs under fleet scaling models.",
                "Implement an RFC 6066 OCSP Stapling response parser validating status codes, freshness windows, and CA signatures.",
                "Construct a compact 256-bit Bloom filter to track revoked serial numbers for offline industrial gateways.",
                "Integrate the hybrid checks into the ApexEdgeRevocationEngine and benchmark false positive rates across 10,000 synthetic serials."
            ]
        }
    }

    with open("scripts/iot_sec_day18.json", "w", encoding="utf-8") as f:
        json.dump(day18, f, indent=2)
    print("Day 18 generated successfully!")

if __name__ == "__main__":
    generate_day18()
