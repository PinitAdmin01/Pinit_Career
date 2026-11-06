# scripts/build_day57.py
import json
import subprocess
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from test_day57_snippets import p1_code, p2_code, p3_code, p4_code, p5_code
from expand_day57_text import part1_say, part2_say, part3_say, part4_say, part5_say

def get_output(code):
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{res.stderr}")
    return res.stdout.replace("\r\n", "\n").strip()

p1_out = get_output(p1_code)
p2_out = get_output(p2_code)
p3_out = get_output(p3_code)
p4_out = get_output(p4_code)
p5_out = get_output(p5_code)

day57_obj = {
    "day": 57,
    "title": "Mutual TLS (mTLS) X.509 Authentication & Hardware Secure Elements (ATECC608A / TPM 2.0 PKCS#11)",
    "coursePrefix": "iot_net",
    "parts": [
        {
            "title": "PKI & Mutual TLS (mTLS) Handshake: X.509 Certificate Hierarchy & Cipher Negotiation",
            "say": part1_say,
            "code": p1_code,
            "output": p1_out,
            "codeNotes": [
                "MtlsHandshakeSimulator verifies mutual trust: cloud broker server certificate and edge client certificate against Root CA.",
                "Validates certificate digital signatures and checks public key bindings before negotiating cryptographic session keys.",
                "Negotiates TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 for authenticated symmetric data transmission with Perfect Forward Secrecy."
            ],
            "tryIt": "Modify the client certificate signer fingerprint to an untrusted value and observe the handshake failure when mutual trust verification fails.",
            "check": {
                "question": "What is the primary architectural difference between one-way TLS and Mutual TLS (mTLS) in industrial IoT systems?",
                "options": [
                    "In mTLS, both the client and the server present and cryptographically verify X.509 certificates, whereas in one-way TLS only the client verifies the server certificate.",
                    "In mTLS, data packets are transmitted twice across two independent physical Ethernet cables.",
                    "In mTLS, encryption keys are derived from the device MAC address rather than an asymmetric handshake.",
                    "In mTLS, certificates are verified by human operators who enter PIN codes via a physical keypad during every connection."
                ],
                "answer": 0,
                "explanation": "Mutual TLS requires both endpoints to present and cryptographically validate X.509 certificates signed by trusted authorities, ensuring that both client and server authenticate each other prior to data exchange."
            }
        },
        {
            "title": "Microchip ATECC608A Hardware Secure Element: Silicon Key Isolation & ECDSA Signing",
            "say": part2_say,
            "code": p2_code,
            "output": p2_out,
            "codeNotes": [
                "SecureElementATECC608A enforces absolute silicon isolation: private key is burned into Slot 0 and permanently locked.",
                "Host microcontroller never reads the private key bytes across I2C; private key cannot be extracted even with bus sniffers.",
                "Cryptochip calculates ECDSA signatures internally on silicon, returning only R and S signature coordinates."
            ],
            "tryIt": "Attempt to access the private key when slot_locked is False and verify that hardware safety policies prevent execution on unlocked slots.",
            "check": {
                "question": "Why does the Microchip ATECC608A secure element prohibit the host microcontroller from reading private key bytes across the I2C bus?",
                "options": [
                    "To prevent adversaries with physical device access or firmware compromise from extracting the private key and cloning devices.",
                    "Because the I2C bus voltage is too low to transmit 256-bit cryptographic numbers.",
                    "To save microcontroller flash storage memory by keeping keys in analog form.",
                    "Because reading keys over I2C causes the microcontroller quartz crystal oscillator to lose synchronization."
                ],
                "answer": 0,
                "explanation": "Hardware key isolation guarantees that private keys cannot be extracted over electrical interfaces, protecting against flash memory desoldering, bus sniffing, and host firmware exploitation."
            }
        },
        {
            "title": "TPM 2.0 & PKCS#11 Cryptographic Token Interface: Hardware Abstraction & Non-Exportable Keys",
            "say": part3_say,
            "code": p3_code,
            "output": p3_out,
            "codeNotes": [
                "TpmPkcs11Interface abstracts hardware cryptographic tokens via standardized PKCS#11 function entry points.",
                "Applications reference hardware-backed keys using standardized RFC 7512 PKCS#11 URIs instead of plaintext file paths.",
                "Signatures are calculated directly inside the TPM 2.0 cryptographic boundary without exposing key material to userland RAM."
            ],
            "tryIt": "Create a second token object 'backup_operator_key' and verify that the PKCS#11 URI accurately resolves the new object identifier.",
            "check": {
                "question": "What is the primary advantage of referencing cryptographic keys via PKCS#11 URIs instead of file paths in edge Linux gateways?",
                "options": [
                    "It decouples application software from specific hardware vendors and prevents private keys from ever existing as plaintext files on disk.",
                    "It compresses TLS handshake packets to reduce cellular telemetry bandwidth by 90%.",
                    "It allows unauthenticated users to modify kernel network routing tables via HTTP GET requests.",
                    "It eliminates the need for DNS resolution by embedding IPv6 addresses into the URI query parameters."
                ],
                "answer": 0,
                "explanation": "PKCS#11 URIs reference hardware-isolated cryptographic objects through a vendor-agnostic interface, completely eliminating plaintext private key files from disk filesystems."
            }
        },
        {
            "title": "X.509 Certificate Revocation Lifecycle: CRLs, OCSP Stapling & Zero Trust Expiration",
            "say": part4_say,
            "code": p4_code,
            "output": p4_out,
            "codeNotes": [
                "CertificateRevocationManager intercepts compromised or decommissioned device certificates prior to network admission.",
                "Tracks serial numbers of revoked credentials and provides instantaneous status evaluation (good vs revoked).",
                "Enforces Zero Trust security posture: physical possession of hardware yields zero network access once revoked."
            ],
            "tryIt": "Add certificate serial '0A3F19BC45' to the revocation list and observe how subsequent OCSP queries immediately return REVOKED_CERTIFICATE_ACCESS_DENIED.",
            "check": {
                "question": "Why is Online Certificate Status Protocol (OCSP) superior to Certificate Revocation Lists (CRLs) in constrained IoT networks?",
                "options": [
                    "OCSP queries verify individual certificate serial numbers with minimal bandwidth, avoiding multi-megabyte CRL downloads over low-power links.",
                    "OCSP uses UDP packets which are never dropped by cellular base stations.",
                    "OCSP replaces asymmetric encryption with symmetric XOR ciphers to conserve CPU battery life.",
                    "OCSP eliminates the need for public key cryptography entirely by sharing static passwords."
                ],
                "answer": 0,
                "explanation": "OCSP queries check the exact status of a single certificate with a lightweight signed response, avoiding the heavy memory and bandwidth penalties of downloading full CRL lists on constrained edge devices."
            }
        },
        {
            "title": "Masterclass Synthesis: Zero-Trust Hardware-Enforced Security Mesh Engine",
            "say": part5_say,
            "code": p5_code,
            "output": p5_out,
            "codeNotes": [
                "HardwareSecurityMeshEngine unifies hardware silicon isolation, PKCS#11 abstraction, mTLS 1.3 handshakes, and live OCSP revocation.",
                "Blocks compromised credentials instantaneously, logging security telemetry for SIEM intrusion detection systems.",
                "Generates hardware-backed signatures directly on silicon and establishes trusted mTLS sessions to the enterprise cloud.",
                "Latches verification token MTLS_HARDWARE_SECURITY_ENGINE_GRADE_A_PLUS_CERTIFIED upon flawless cryptographic convergence."
            ],
            "tryIt": "Modify the engine to run with a third client serial and inspect how internal telemetry counters reflect authenticated and blocked sessions.",
            "check": {
                "question": "What is the ultimate security benefit of combining hardware secure elements with mTLS and real-time revocation in enterprise IoT infrastructure?",
                "options": [
                    "It provides end-to-end cryptographic trust where keys cannot be physically stolen or cloned, and compromised devices can be severed instantaneously from the cloud.",
                    "It eliminates the need for edge devices to run an operating system or have memory.",
                    "It increases wireless transmission range by converting radio waves into optical infrared beams.",
                    "It allows factory operators to share one master private key across millions of untracked sensors."
                ],
                "answer": 0,
                "explanation": "Combining hardware key isolation with mutual TLS and real-time revocation ensures that credentials cannot be cloned from physical devices, network traffic is tamper-proof, and compromised nodes are instantly quarantined."
            }
        }
    ],
    "summary": [
        "Mutual TLS (mTLS) provides bidirectional cryptographic authentication where both edge gateway and cloud broker validate X.509 certificate chains.",
        "Microchip ATECC608A secure elements isolate private keys within silicon Slot 0, delegating ECDSA signature computation without exposing keys over I2C.",
        "TPM 2.0 and PKCS#11 URIs decouple Linux application software from hardware cryptographic coprocessors, eliminating plaintext private key files from disk.",
        "Online Certificate Status Protocol (OCSP) enables lightweight, real-time revocation auditing, terminating compromised device sessions with zero network delay.",
        "The masterclass engine unifies hardware isolation, PKCS#11 tokens, and zero-trust revocation under MTLS_HARDWARE_SECURITY_ENGINE_GRADE_A_PLUS_CERTIFIED."
    ]
}

# Verify word count per part
total_words = 0
for idx, part in enumerate(day57_obj["parts"]):
    wc = sum(len(p.split()) for p in part["say"])
    total_words += wc
    print(f"Part {idx+1} word count: {wc} words")
    assert wc >= 580, f"Part {idx+1} has only {wc} words (< 580)"

print(f"Day 57 total word count: {total_words} words (Requirement: >= 3000)")
assert total_words >= 3000

with open("scripts/day-57-data.json", "w", encoding="utf-8") as f:
    json.dump(day57_obj, f, indent=2, ensure_ascii=False)

print("Saved scripts/day-57-data.json successfully!")
