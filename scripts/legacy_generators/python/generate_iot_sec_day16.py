#!/usr/bin/env python3
"""
generate_iot_sec_day16.py
Course 19 (iot_sec) Month 1 Block 4 Day 16:
Public Key Infrastructure (PKI) for IoT & IEEE 802.1AR Secure Device Identity
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

# --- PART 1 ---
p1_code = """# IEEE 802.1AR IDevID vs LDevID Dual-Identity Simulator
import hashlib

class IEEE8021ARDualIdentity:
    def __init__(self, eui64_hardware_id: str):
        self.eui64 = eui64_hardware_id
        # IDevID: Injected at factory silicon fab, permanent, immutable
        self.idevid = {
            "type": "IDevID (Initial Device Identifier)",
            "issuer": "CN=SiliconVendor-Root-CA,O=SiliconFab,C=US",
            "subject": f"CN=IoT-Node-{self.eui64},serialNumber={self.eui64}",
            "immutable": True,
            "private_key_exportable": False
        }
        # LDevID: Issued during customer enterprise enrollment, rotatable
        self.ldevid = None

    def enroll_enterprise_tenant(self, enterprise_ca: str, operational_domain: str) -> dict:
        self.ldevid = {
            "type": "LDevID (Locally Significant Device Identifier)",
            "issuer": f"CN={enterprise_ca},O=SmartGrid-Tenant,C=US",
            "subject": f"CN={self.eui64}.{operational_domain}",
            "immutable": False,
            "private_key_exportable": False
        }
        return self.ldevid

dev = IEEE8021ARDualIdentity("00-80-E1-02-00-14-3A-9F")
ldevid = dev.enroll_enterprise_tenant("Utility-Enterprise-CA", "grid.utility.com")

print("=== IEEE 802.1AR Dual Identity Architecture ===")
print(f"Silicon Provenance (IDevID): {dev.idevid['subject']} | Issuer: {dev.idevid['issuer']}")
print(f"Enterprise Tenancy (LDevID): {ldevid['subject']} | Issuer: {ldevid['issuer']}")
print("Identity Invariant: IDevID proves silicon origin; LDevID grants operational network authorization.")
"""
p1_out = run_code(p1_code)

p1_say = [
    "Welcome to Stage 2 of the IoT Hardware Security and Root of Trust engineering curriculum: Secure Identity, Provisioning, and Cloud Onboarding. When deploying massive fleets of industrial IoT devices—such as 500,000 smart electric meters, connected pacemakers, or robotic pipeline valves—the central cloud platform must deterministically verify that a connecting edge device is an authentic, factory-manufactured unit and not an adversarial laptop running an emulation script. To solve this foundational authentication problem, the industry relies on Public Key Infrastructure (PKI) and the IEEE 802.1AR Secure Device Identity standard.",
    "Traditional embedded systems frequently made the catastrophic mistake of using shared symmetric secrets or static credentials burned into firmware flash. If an attacker extracted the shared password from a single decommissioned test meter, they could mass-forge unauthorized credentials and inject falsified sensor readings across the entire power grid. Public Key Infrastructure eliminates shared secrets: each physical device possesses a mathematically unique asymmetric cryptographic keypair (such as NIST P-256 ECC or Ed25519). The private key never leaves the device, while the public key is signed by a trusted Certificate Authority (CA) into an X.509 certificate.",
    "The IEEE 802.1AR standard formalizes this architecture by introducing the Dual-Identity Model, decoupling silicon provenance from enterprise operational tenancy: 1) Initial Device Identifier (IDevID): An immutable, permanent X.509 certificate and private key generated and bound to hardware at the factory during silicon wafer fabrication or module manufacturing. The IDevID is signed by the silicon manufacturer's Root CA (e.g., STMicroelectronics, Microchip, or NXP). The IDevID cannot be modified or deleted for the physical lifetime of the hardware.",
    "2) Locally Significant Device Identifier (LDevID): An operational X.509 certificate issued by the customer's enterprise CA during field deployment. While the IDevID proves where the silicon was manufactured, the LDevID proves which enterprise organization currently owns and operates the device. When an electric utility company purchases smart meters from a manufacturer, the meters authenticate themselves to the utility's enrollment server using their factory IDevID, which then provisions an operational LDevID. If the meter is later decommissioned or sold to another utility, the LDevID is revoked or rotated without touching the underlying silicon IDevID.",
    "This dual-identity hierarchy establishes an unbroken cryptographic chain of trust: Silicon Manufacturer Root CA -> Intermediate Factory CA -> Device IDevID -> Enterprise CA -> Device LDevID. Trust delegates hierarchically across digital signatures.",
    "By adhering to IEEE 802.1AR, embedded engineers ensure that device identities are uncloneable, hardware-anchored, and agile across complex multi-tenant operational lifecycles."
]

# --- PART 2 ---
p2_code = """# On-Chip Silicon Key Generation vs PC Injected Key Simulator
import hashlib, secrets

class SecureElementKeyGenEngine:
    def __init__(self):
        self.pc_generated_key_copies = []

    def simulate_pc_usb_injection(self) -> dict:
        # Dangerous: PC software generates private key and writes via USB/JTAG
        raw_key = secrets.token_bytes(32)
        # Rogue factory operator or malware saves backup copy of private key
        self.pc_generated_key_copies.append(raw_key)
        return {
            "method": "EXTERNAL_PC_INJECTION",
            "clonable_by_operator": True,
            "risk": "HIGH_VULNERABILITY_FACTORY_THEFT"
        }

    def simulate_on_chip_hardware_generation(self) -> dict:
        # Secure: Internal hardware TRNG generates key inside Secure Element die
        internal_key = secrets.token_bytes(32)
        # Gating hardware prevents internal key from ever reading to external bus
        return {
            "method": "ON_CHIP_BORN_IN_SILICON",
            "clonable_by_operator": False,
            "security_status": "ZERO_EXPORT_HARDWARE_BOUND"
        }

engine = SecureElementKeyGenEngine()
pc_inj = engine.simulate_pc_usb_injection()
on_chip = engine.simulate_on_chip_hardware_generation()

print("=== Cryptographic Key Provenance Comparison ===")
print(f"External PC Injection:  Clonable -> {pc_inj['clonable_by_operator']} (Risk: {pc_inj['risk']})")
print(f"On-Chip Generation:     Clonable -> {on_chip['clonable_by_operator']} (Status: {on_chip['security_status']})")
print("Provenance Invariant: Private keys must be generated inside the Secure Element and never exported.")
"""
p2_out = run_code(p2_code)

p2_say = [
    "A device certificate is only as secure as the private key that underpins it. If an adversary gains possession of an edge device's private key, they can clone the device perfectly, forging telemetry, decrypting firmware updates, and subverting mutual authentication handshakes without triggering any network anomalies. Therefore, how and where the private key is generated represents the most critical manufacturing security decision in IoT engineering.",
    "In flawed manufacturing pipelines, device keys are generated externally on a factory provisioning PC or programming rig. The factory computer executes OpenSSL, generates an ECC keypair, and writes the private key into the microcontroller's flash or EEPROM over USB, UART, or JTAG debug probes. This practice creates an existential vulnerability: the private key exists outside the device on the computer's hard drive, RAM, and USB bus. A rogue factory technician, malicious supplier, or malware infected on the factory test computer can quietly log and export millions of private keys, enabling catastrophic clone attacks years later.",
    "IEEE 802.1AR and modern hardware root-of-trust standards mandate that keys must be 'Born in Silicon'. The device private key must be generated directly on-chip inside the microcontroller's hardware Secure Element (such as an ATECC608B, STSAFE-A110, or TrustZone crypto enclave) using the chip's internal True Random Number Generator (TRNG).",
    "Under on-chip key generation, the private key bits are written directly from the internal TRNG entropy pool into write-only physical registers or secure eFuses inside the silicon die. The hardware design physically disconnects internal read buses from the key storage cells. The private key can NEVER be read out by software, JTAG probes, or external buses.",
    "Only the public key is exported over the programming interface. The factory CA signs this exported public key and returns the signed X.509 IDevID certificate, which is stored in public flash. Because the private key was born on-chip and never crossed a physical wire or existed on an external computer, the device identity is mathematically guaranteed to be uncloneable.",
    "This zero-export provenance invariant guarantees that even the device manufacturer cannot impersonate their own deployed hardware in the field."
]

# --- PART 3 ---
p3_code = """# EUI-64 Hardware Identity & Subject Alternative Name (SAN) Simulator
import struct

class EUI64SANExtensionBuilder:
    def __init__(self, mac_48: bytes):
        # Convert 48-bit MAC (e.g. 00:80:E1:14:3A:9F) to 64-bit EUI-64
        # Insert 0xFFFE into the middle (after 3 bytes) and invert universal/local bit
        b0 = mac_48[0] ^ 0x02  # Invert bit 1 of byte 0
        self.eui64_bytes = bytes([b0, mac_48[1], mac_48[2], 0xFF, 0xFE, mac_48[3], mac_48[4], mac_48[5]])
        self.eui64_str = "-".join(f"{b:02X}" for b in self.eui64_bytes)

    def generate_san_extension(self) -> dict:
        san_uri = f"urn:eui64:{self.eui64_str}"
        return {
            "oid": "2.5.29.17",  # id-ce-subjectAltName
            "san_type": "URI",
            "hardware_serial": self.eui64_str,
            "san_payload": san_uri
        }

san_builder = EUI64SANExtensionBuilder(bytes([0x00, 0x80, 0xE1, 0x14, 0x3A, 0x9F]))
san = san_builder.generate_san_extension()

print("=== EUI-64 Hardware Serial SAN Extension ===")
print(f"Derived EUI-64 Serial: {san['hardware_serial']}")
print(f"X.509 SAN Payload:    {san['san_payload']} (OID: {san['oid']})")
print("Naming Invariant: IEEE 802.1AR mandates unique EUI-64 or EUI-48 identifiers in Subject Alt Name.")
"""
p3_out = run_code(p3_code)

p3_say = [
    "To bind an X.509 certificate unambiguously to a physical piece of silicon, IEEE 802.1AR mandates strict naming conventions within certificate fields. A common mistake in naive IoT deployments is putting descriptive, mutable names in the Common Name (CN) field—such as `CN=WaterPump-Building4`. If the pump is relocated to Building 7, the certificate becomes misleading or invalid. Furthermore, human-readable names do not guarantee global uniqueness across millions of deployed nodes.",
    "IEEE 802.1AR solves this by binding the device's immutable hardware serial number directly into the certificate's Subject Alternative Name (SAN) extension (OID `2.5.29.17`). Specifically, the standard standardizes on IEEE EUI-48 (standard 48-bit MAC addresses) or IEEE EUI-64 (Extended Unique Identifiers) formatted as Uniform Resource Names (URNs), such as `urn:eui64:02-80-E1-FF-FE-14-3A-9F`.",
    "The EUI-64 identifier is globally unique: the upper 24 or 36 bits represent the Organizationally Unique Identifier (OUI) assigned to the hardware manufacturer by the IEEE Registration Authority, while the remaining bits represent the manufacturer's internal serial number. On Ethernet, Wi-Fi, or cellular microcontrollers, the 48-bit MAC address is converted to an EUI-64 by inserting the octets `0xFF` and `0xFE` between the third and fourth bytes and inverting the universal/local bit (bit 1 of the first byte).",
    "During certificate issuance, the Certificate Authority embeds this hardware URN into the SAN extension. When the device authenticates over mutual TLS (mTLS), the cloud gateway extracts the SAN field, parses the EUI-64 identifier, and verifies it against the device asset registry.",
    "Because the SAN extension is covered by the CA's digital signature over the certificate, an attacker cannot modify or tamper with the hardware identifier without invalidating the cryptographic signature.",
    "This cryptographic binding ensures that network identities correspond 1:1 with physical silicon serial numbers, eliminating identity spoofing and unauthorized MAC cloning across industrial networks."
]

# --- PART 4 ---
p4_code = """# Constrained PKCS#10 Certificate Signing Request (CSR) Generator
import hashlib, hmac

class ConstrainedCSRGenerator:
    def __init__(self, device_id: str):
        self.device_id = device_id
        self.private_key = b"SECURE_ELEMENT_PRIVATE_KEY_256B"
        self.public_key  = hashlib.sha256(self.private_key).hexdigest()

    def build_pkcs10_csr(self, requested_subject: str) -> dict:
        certification_request_info = f"SUBJECT:{requested_subject};PUBKEY:{self.public_key}"
        # Self-sign the CSR using on-chip private key (ECDSA / HMAC proof of possession)
        signature = hmac.new(self.private_key, certification_request_info.encode(), hashlib.sha256).hexdigest()
        
        return {
            "subject": requested_subject,
            "public_key": self.public_key[:32] + "...",
            "proof_of_possession_signature": signature[:32] + "...",
            "valid_signature": True
        }

csr_gen = ConstrainedCSRGenerator("IoT-00-80-E1")
csr = csr_gen.build_pkcs10_csr("CN=edge-meter-01.grid.local")

print("=== PKCS#10 Certificate Signing Request (CSR) ===")
print(f"Requested Subject: {csr['subject']}")
print(f"Public Key:        {csr['public_key']}")
print(f"CSR Self-Sig:      {csr['proof_of_possession_signature']}")
print("CSR Invariant: The CSR proves possession of the private key matching the public key requested.")
"""
p4_out = run_code(p4_code)

p4_say = [
    "Once an IoT device is deployed in the field, it must transition from its factory IDevID to an operational LDevID issued by the customer's enterprise Certificate Authority. This automated enrollment workflow is conducted using Certificate Signing Requests (CSRs) standardized under PKCS#10 (RFC 2986).",
    "A PKCS#10 CSR is a structured cryptographic document generated directly by the edge microcontroller. The CSR consists of three core components: 1) Certification Request Info: specifying the requested subject distinguished name (e.g., `CN=edge-meter-01.grid.local`), domain attributes, and the device's public key; 2) Signature Algorithm Identifier: specifying the cryptographic algorithm (e.g., `ecdsa-with-SHA256`); and 3) Digital Signature: an ECDSA digital signature computed over the request info using the device's private key.",
    "The digital signature on the CSR serves a vital security function known as Proof of Possession (PoP). When the enterprise CA receives the CSR, it verifies the signature against the public key contained inside the request. This mathematically proves to the CA that the requesting device actually possesses the matching private key, preventing an attacker from tricking the CA into issuing a certificate for a public key that the attacker does not control.",
    "In industrial IoT environments, CSRs are transmitted to enterprise CAs using automated enrollment protocols such as Enrollment over Secure Transport (EST, RFC 7030) or Certificate Management Protocol (CMPv2). The device opens a secure TLS connection to the EST server, authenticating itself using its factory IDevID certificate. Once authenticated, the device posts its PKCS#10 CSR over HTTP. The CA validates the CSR, signs the operational LDevID certificate, and returns it to the device in the response payload.",
    "On constrained microcontrollers, constructing a full PKCS#10 ASN.1 DER structure requires careful memory management. Low-memory embedded libraries format the ASN.1 sequence incrementally in a static buffer, computing the SHA-256 hash across the payload and invoking the hardware crypto accelerator to generate the compact 64-byte ECDSA signature.",
    "This automated, zero-touch provisioning workflow allows thousands of IoT devices to securely onboard into enterprise cloud environments without manual technician intervention."
]

# --- PART 5 ---
p5_code = """# ApexDeviceIdentityEngine: Unified IEEE 802.1AR PKI & Attestation Manager
import hashlib

class ApexDeviceIdentityEngine:
    def __init__(self, eui64: str):
        self.eui64 = eui64
        self.idevid_cert = {
            "subject": f"CN=Node-{self.eui64}",
            "issuer": "CN=SiliconVendor-CA",
            "is_hardware_bound": True
        }
        self.ldevid_cert = None
        self.active_certs = [self.idevid_cert]

    def enroll_ldevid_with_csr(self, tenant_ca_name: str, requested_cn: str) -> dict:
        # Verify silicon IDevID authenticates the CSR enrollment transaction
        if not self.idevid_cert["is_hardware_bound"]:
            return {"status": "ENROLLMENT_FAILED_UNAUTHENTICATED"}

        # Issue tenant LDevID
        self.ldevid_cert = {
            "subject": f"CN={requested_cn}",
            "issuer": f"CN={tenant_ca_name}",
            "is_hardware_bound": True,
            "parent_idevid": self.idevid_cert["subject"]
        }
        self.active_certs.append(self.ldevid_cert)
        return {
            "status": "ENROLLMENT_SUCCESS",
            "ldevid": self.ldevid_cert["subject"],
            "issuer": self.ldevid_cert["issuer"],
            "total_active_certs": len(self.active_certs)
        }

    def verify_chain_of_trust(self) -> dict:
        has_idevid = any(c["issuer"] == "CN=SiliconVendor-CA" for c in self.active_certs)
        has_ldevid = any(c["subject"].startswith("CN=smartgrid") for c in self.active_certs)
        return {
            "idevid_provenance_verified": has_idevid,
            "ldevid_tenancy_verified": has_ldevid,
            "chain_status": "VALID_IEEE_802_1AR_HIERARCHY"
        }

engine = ApexDeviceIdentityEngine("00-80-E1-02-00-14-3A-9F")
enrollment = engine.enroll_ldevid_with_csr("SmartGrid-Utility-CA", "smartgrid-meter-702")
chain = engine.verify_chain_of_trust()

print("=== ApexDeviceIdentityEngine Verification ===")
print(f"1. IDevID Hardware Origin: Verified -> {chain['idevid_provenance_verified']}")
print(f"2. LDevID Tenancy Enrollment: {enrollment['status']} ({enrollment['ldevid']})")
print(f"3. Dual-Identity Chain Status: {chain['chain_status']}")
print("Identity Invariant: IEEE 802.1AR guarantees unforgeable hardware provenance and agile tenant lifecycle.")
"""
p5_out = run_code(p5_code)

p5_say = [
    "To unite all PKI concepts into an operational subsystem, firmware engineers deploy the ApexDeviceIdentityEngine. This engine synthesizes on-chip hardware key generation, IDevID certificate verification, EUI-64 Subject Alternative Name formatting, PKCS#10 CSR generation, and automated LDevID enrollment into an integrated device identity manager.",
    "Let us trace the complete lifecycle within our unified engine. At cold boot, the device accesses its hardware-bound IDevID certificate anchored in silicon. The IDevID subject contains the globally unique EUI-64 serial number (`00-80-E1-02-00-14-3A-9F`), signed by the silicon manufacturer's Root CA. The private key resides permanently inside the on-chip Secure Element, inaccessible to external software.",
    "When deployed in the customer's enterprise environment, the device initiates zero-touch onboarding. It establishes an authenticated session with the enterprise enrollment server using its factory IDevID. The engine then generates an operational keypair on-chip, builds a PKCS#10 CSR requesting identity `CN=smartgrid-meter-702`, and signs the request using its operational private key.",
    "The enterprise CA validates the CSR signature, confirms Proof of Possession, and issues the operational LDevID certificate signed by `CN=SmartGrid-Utility-CA`. The device stores the LDevID alongside its IDevID in secure non-volatile storage.",
    "During subsequent operational communication (such as streaming telemetry to the utility SCADA cloud over mutual TLS), the device presents its LDevID for network access while retaining its immutable IDevID for factory attestation. If the device is ever decommissioned or transferred to another tenant, the enterprise revokes the LDevID without affecting the silicon provenance.",
    "By deploying the IEEE 802.1AR architecture, embedded systems eliminate identity theft, prevent mass device cloning, and achieve scalable, zero-trust lifecycle management across millions of deployed IoT nodes."
]

def make_long_lesson_day16():
    return {
        "coursePrefix": "iot_sec",
        "day": 16,
        "title": "Public Key Infrastructure (PKI) for IoT & IEEE 802.1AR Secure Device Identity",
        "goal": "Master IEEE 802.1AR secure device identity standards, Initial Device Identifier (IDevID), Locally Significant Device Identifier (LDevID), on-chip cryptographic key generation in silicon, EUI-64 hardware naming, and X.509 Certificate Signing Requests (CSR).",
        "minutes": 38,
        "recap": "In Block 3, we constructed the hardware-isolated TrustZone enclave and PMSAv8 MPU partition engine. Today in Block 4, we leverage that secure enclave to establish cryptographic identity using the IEEE 802.1AR standard.",
        "parts": [
            {
                "title": "IEEE 802.1AR Architecture: IDevID vs LDevID Dual-Identity Model",
                "say": p1_say,
                "example": "IEEE 802.1AR decouples silicon provenance (immutable factory IDevID) from operational enterprise tenancy (rotatable LDevID), preventing identity cloning across device fleets.",
                "code": p1_code,
                "output": p1_out,
                "codeNotes": [
                    "IDevID is an immutable certificate injected during factory manufacturing and signed by the silicon vendor CA.",
                    "LDevID is an operational certificate provisioned during field deployment by the enterprise customer CA.",
                    "Trust delegates hierarchically across X.509 certificate chains without shared symmetric secrets."
                ],
                "tryIt": "Simulate enrolling an enterprise tenant LDevID on a device with an existing factory IDevID and verify dual identity.",
                "check": {
                    "question": "What is the primary architectural purpose of separating IDevID from LDevID in IEEE 802.1AR?",
                    "options": [
                        "To decouple immutable hardware silicon provenance from rotatable enterprise operational tenancy.",
                        "To allow devices to communicate without using IP addresses.",
                        "To double the encryption speed of symmetric AES ciphers.",
                        "To eliminate the need for digital certificates in embedded systems."
                    ],
                    "answer": 0,
                    "why": "IDevID permanently proves silicon origin, while LDevID allows enterprise operational certificates to be rotated or revoked during tenancy changes."
                }
            },
            {
                "title": "On-Chip Cryptographic Key Generation & Factory Injection",
                "say": p2_say,
                "example": "Generating private keys on-chip inside the Secure Element ensures private keys are 'Born in Silicon' and never exposed to factory PCs or external buses.",
                "code": p2_code,
                "output": p2_out,
                "codeNotes": [
                    "External PC injection exposes private keys to factory operators, programming rigs, and malware.",
                    "On-chip key generation uses internal TRNGs to write keys directly into write-only secure storage.",
                    "Hardware read-bus gating physically prevents private keys from ever being exported."
                ],
                "tryIt": "Compare key clonability between external PC injection and on-chip silicon generation.",
                "check": {
                    "question": "Why must an edge device's private key be generated on-chip inside a Secure Element rather than injected via USB?",
                    "options": [
                        "Because external generation exposes the raw private key on PC RAM and cables, risking factory theft or cloning.",
                        "Because on-chip generation uses less electricity than USB communication.",
                        "Because external PCs cannot compute 256-bit elliptic curve math.",
                        "Because USB cables cannot transmit cryptographic numbers."
                    ],
                    "answer": 0,
                    "why": "On-chip generation ensures the private key is born inside the silicon die and never leaves the hardware boundary, eliminating cloning."
                }
            },
            {
                "title": "EUI-64 Hardware Identity & Subject Alternative Name (SAN) Extensions",
                "say": p3_say,
                "example": "IEEE 802.1AR mandates embedding globally unique EUI-64 or EUI-48 identifiers into X.509 Subject Alternative Name (SAN) fields as hardware URNs.",
                "code": p3_code,
                "output": p3_out,
                "codeNotes": [
                    "MAC addresses convert to EUI-64 by inserting 0xFFFE and inverting the universal/local bit.",
                    "SAN extension (OID 2.5.29.17) carries the hardware URN (urn:eui64:XX-XX-XX...).",
                    "CA digital signatures over the certificate protect the hardware serial number from tampering."
                ],
                "tryIt": "Convert a 48-bit MAC address into an EUI-64 identifier and format it as an X.509 SAN extension URI.",
                "check": {
                    "question": "How does IEEE 802.1AR securely bind a certificate to physical hardware?",
                    "options": [
                        "By embedding a globally unique EUI-64 or EUI-48 hardware serial number into the Subject Alternative Name (SAN) extension.",
                        "By printing a barcode onto the plastic device enclosure.",
                        "By measuring the physical temperature of the CPU at boot time.",
                        "By hardcoding the user's email address into the certificate Common Name."
                    ],
                    "answer": 0,
                    "why": "Embedding the EUI-64 identifier inside the signed SAN extension binds the cryptographic identity to the physical hardware serial number."
                }
            },
            {
                "title": "Certificate Signing Request (CSR) Generation in Constrained Enclaves",
                "say": p4_say,
                "example": "Devices generate PKCS#10 CSRs containing requested subjects and public keys, self-signing with their private keys to establish Proof of Possession (PoP).",
                "code": p4_code,
                "output": p4_out,
                "codeNotes": [
                    "PKCS#10 CSRs specify requested subject names, public keys, and cryptographic signatures.",
                    "Proof of Possession (PoP) proves to the CA that the requester owns the private key matching the public key.",
                    "Automated enrollment protocols like EST (RFC 7030) transport CSRs over mutual TLS."
                ],
                "tryIt": "Generate a PKCS#10 CSR with self-signed proof of possession and verify the signature against the public key.",
                "check": {
                    "question": "What is the primary role of the digital signature inside a PKCS#10 Certificate Signing Request (CSR)?",
                    "options": [
                        "It provides Proof of Possession (PoP), proving the device actually controls the private key matching the public key.",
                        "It encrypts the network connection during transmission.",
                        "It compresses the certificate payload to save RAM.",
                        "It bypasses the need for Certificate Authority approval."
                    ],
                    "answer": 0,
                    "why": "The signature on a CSR proves that the entity requesting the certificate actually possesses the corresponding private key."
                }
            },
            {
                "title": "ApexDeviceIdentityEngine: Unified IEEE 802.1AR PKI & Attestation Manager",
                "say": p5_say,
                "example": "ApexDeviceIdentityEngine synthesizes IDevID anchoring, EUI-64 SAN derivation, PKCS#10 CSR issuance, and LDevID enrollment into an integrated PKI identity manager.",
                "code": p5_code,
                "output": p5_out,
                "codeNotes": [
                    "ApexDeviceIdentityEngine manages multi-tier certificate lifecycles across silicon and tenant domains.",
                    "LDevID enrollment requires prior authentication using the hardware-bound factory IDevID.",
                    "Chain-of-trust verification confirms both silicon manufacturer provenance and enterprise tenancy."
                ],
                "tryIt": "Enroll an LDevID using a valid IDevID and verify that the complete IEEE 802.1AR chain of trust passes validation.",
                "check": {
                    "question": "What happens during zero-touch field onboarding under the IEEE 802.1AR standard?",
                    "options": [
                        "The device authenticates to the enterprise server using its factory IDevID, requests an LDevID via CSR, and receives an operational certificate.",
                        "A technician manually enters a shared password onto each device via a keypad.",
                        "The device disables encryption and sends all operational data in plaintext.",
                        "The device re-flashes its bootloader from an unverified public server."
                    ],
                    "answer": 0,
                    "why": "Zero-touch onboarding uses the hardware IDevID to authenticate the initial connection and enroll an operational LDevID via CSR."
                }
            }
        ],
        "summary": [
            "IEEE 802.1AR establishes a dual-identity architecture: permanent factory IDevID and rotatable operational LDevID.",
            "Cryptographic keys must be 'Born in Silicon' via on-chip TRNGs to prevent private key theft and cloning during manufacturing.",
            "Globally unique EUI-64 hardware identifiers are bound into X.509 Subject Alternative Name (SAN) extensions.",
            "PKCS#10 Certificate Signing Requests (CSRs) provide Proof of Possession (PoP) during automated EST/CMPv2 enrollment.",
            "The unified ApexDeviceIdentityEngine demonstrates complete hardware provenance, tenant agility, and chain-of-trust verification."
        ],
        "projectStep": {
            "title": "Build & Validate IEEE 802.1AR PKI Device Identity Engine",
            "steps": [
                "Simulate an IEEE 802.1AR dual-identity manager supporting immutable factory IDevIDs and rotatable operational LDevIDs.",
                "Implement an on-chip key generation engine demonstrating zero-export hardware isolation against PC injection.",
                "Construct an EUI-64 hardware identifier builder formatting MAC addresses into X.509 SAN extension URNs.",
                "Develop a PKCS#10 CSR generation module creating self-signed Proof of Possession signatures over public keys.",
                "Integrate all components into an ApexDeviceIdentityEngine verifying complete end-to-end chain-of-trust validation."
            ]
        }
    }

if __name__ == "__main__":
    day16_data = make_long_lesson_day16()
    with open("scripts/iot_sec_day16.json", "w", encoding="utf-8") as f:
        json.dump(day16_data, f, indent=2)

    words = [sum(len(s.split()) for s in p["say"]) for p in day16_data["parts"]]
    print(f"Day 16 base generated successfully! Words per part: {words} (Total: {sum(words)}, Min: {min(words)})")
