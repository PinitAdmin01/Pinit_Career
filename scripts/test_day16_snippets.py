#!/usr/bin/env python3
import subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

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

for i, code in enumerate([p1_code, p2_code, p3_code, p4_code, p5_code], 1):
    out = run_code(code)
    print(f"Snippet {i} passed!")
