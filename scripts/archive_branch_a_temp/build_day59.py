# scripts/build_day59.py
import json
import subprocess
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from test_day59_snippets import p1_code, p2_code, p3_code, p4_code, p5_code
from expand_day59_text import part1_say, part2_say, part3_say, part4_say, part5_say

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

day59_obj = {
    "day": 59,
    "title": "Over-the-Air (OTA) Firmware Updates, Dual-Bank Flash A/B Partitioning & Rollback Protection",
    "coursePrefix": "iot_net",
    "parts": [
        {
            "title": "Dual-Bank Flash A/B Partition Manager & Golden Bootloader Architecture",
            "say": part1_say,
            "code": p1_code,
            "output": p1_out,
            "codeNotes": [
                "DualBankFlashManager isolates running application in Active Bank while staging new image into Passive Bank.",
                "Atomic pointer swap in non-volatile register switches boot slot without overwriting previous operational binary.",
                "Enables zero-downtime updates and automated hardware watchdog rollback if new firmware fails post-boot self-tests."
            ],
            "tryIt": "Trigger a second bootloader swap and verify that the active and passive slots alternate back to the original bank.",
            "check": {
                "question": "What is the primary architectural purpose of Dual-Bank Flash A/B Partitioning in industrial IoT devices?",
                "options": [
                    "To guarantee zero-downtime background staging and allow instant rollback to the previous working slot if the new image fails, preventing hard bricking.",
                    "To double the clock frequency of the main ARM Cortex-M processor.",
                    "To store user passwords in plaintext across two independent flash memory chips.",
                    "To replace Ethernet physical cabling with optical infrared transceivers."
                ],
                "answer": 0,
                "explanation": "Dual-bank flash partitioning allows a device to continue running from its active bank while downloading to the passive bank, and guarantees that a faulty update can be rolled back automatically, preventing fatal device bricking."
            }
        },
        {
            "title": "Cryptographic Firmware Signature Verification & Manifest Bundling",
            "say": part2_say,
            "code": p2_code,
            "output": p2_out,
            "codeNotes": [
                "FirmwareSignatureVerifier verifies binary integrity and authenticity against immutable OEM public keys.",
                "Calculates SHA-256 digest of staged binary and verifies asymmetric ECDSA signature before permitting slot swap.",
                "Guarantees that untrusted, tampered, or corrupted firmware is rejected and purged prior to execution."
            ],
            "tryIt": "Modify a single byte of firmware_data to simulate tampering and observe that verification fails immediately.",
            "check": {
                "question": "Where should the OEM public key or its root hash be stored on an industrial edge device for firmware signature verification?",
                "options": [
                    "In immutable hardware One-Time Programmable (OTP) eFuses or a secure element, ensuring it cannot be overwritten by software commands.",
                    "In a readable text file on a removable SD card attached to the gateway exterior.",
                    "In the web browser cache of the technician who commissioned the device.",
                    "In a public GitHub repository accessible over unencrypted HTTP."
                ],
                "answer": 0,
                "explanation": "Storing the OEM public key in hardware OTP eFuses or a secure element establishes an immutable root of trust that cannot be altered or bypassed by malicious software or network attackers."
            }
        },
        {
            "title": "Anti-Rollback Protection & Hardware Monotonic Security Counters",
            "say": part3_say,
            "code": p3_code,
            "output": p3_out,
            "codeNotes": [
                "AntiRollbackProtectionEngine enforces monotonic security counter checks to defeat downgrade attacks.",
                "Rejects older, legitimately signed firmware binaries containing known vulnerabilities (incoming epoch < hw counter).",
                "Permanently increments one-way hardware fuses when higher security epochs pass post-boot validation."
            ],
            "tryIt": "Attempt to flash a firmware image with epoch=3 when hw_monotonic_counter=4 and confirm that the downgrade attack is intercepted.",
            "check": {
                "question": "Why is cryptographic signature verification alone insufficient to prevent firmware downgrade attacks?",
                "options": [
                    "Because older firmware binaries carry authentic OEM signatures, allowing attackers to downgrade devices to versions with known exploitable vulnerabilities.",
                    "Because asymmetric cryptographic algorithms expire after 24 hours.",
                    "Because attackers can reverse-engineer private keys using standard digital multimeters.",
                    "Because signatures only protect file names rather than the underlying binary code."
                ],
                "answer": 0,
                "explanation": "An attacker can capture an authentically signed older firmware version that contains a known vulnerability and flash it to the device; because the signature is valid, only an anti-rollback monotonic counter can detect and block the downgrade."
            }
        },
        {
            "title": "Cellular/Satellite Delta Updates & Chunked Resumable Ingestion",
            "say": part4_say,
            "code": p4_code,
            "output": p4_out,
            "codeNotes": [
                "ResumableChunkedOtaIngester divides firmware patches into uniform blocks with independent CRC32 integrity checks.",
                "Tracks received chunks via persistent bitmap, recovering from intermittent cellular/satellite connection drops.",
                "Reduces cellular data consumption and flash wear by 85-95% when paired with binary differential patches."
            ],
            "tryIt": "Pass a corrupted CRC32 checksum for block 1 and verify that the ingester rejects the corrupt chunk without aborting previously received blocks.",
            "check": {
                "question": "What is the primary benefit of chunked resumable OTA ingestion over low-power cellular and satellite links?",
                "options": [
                    "It allows devices to resume downloads from the exact point of interruption after network drops without re-downloading previously latched blocks.",
                    "It allows unencrypted packets to bypass carrier firewalls.",
                    "It converts cellular radio signals into ultrasound waves to penetrate underground concrete.",
                    "It eliminates the need for flash memory by streaming firmware directly into CPU instruction registers."
                ],
                "answer": 0,
                "explanation": "Chunked resumable transport tracks received blocks in non-volatile memory, allowing the device to request only missing chunks when recovering from connection drops rather than restarting from byte zero."
            }
        },
        {
            "title": "Masterclass Synthesis: Resilient Dual-Bank Secure OTA Firmware Engine",
            "say": part5_say,
            "code": p5_code,
            "output": p5_out,
            "codeNotes": [
                "SecureOtaFirmwareEngine unifies dual-bank flash staging, cryptographic OEM signatures, and anti-rollback counters.",
                "Enforces strict multi-tier validation: anti-rollback check -> signature verification -> slot swap -> boot confirmation.",
                "Publishes real-time telemetry metrics across updates applied, downgrades blocked, and corruptions rejected.",
                "Latches verification token OTA_DUAL_BANK_FIRMWARE_ENGINE_GRADE_A_PLUS_CERTIFIED upon complete operational convergence."
            ],
            "tryIt": "Execute a third deployment with an invalid signature and observe that corruptions_rejected increments in telemetry metrics.",
            "check": {
                "question": "In an enterprise-grade secure OTA firmware deployment pipeline, what guarantees complete operational resilience?",
                "options": [
                    "The synthesis of dual-bank A/B redundancy, immutable bootloader watchdog rollback, OEM cryptographic signatures, and hardware anti-rollback counters.",
                    "Deploying updates exclusively on weekends when network traffic is lowest.",
                    "Requiring human operators to manually approve every single packet using physical push buttons.",
                    "Erasing all device memory and flash storage prior to initiating the network download."
                ],
                "answer": 0,
                "explanation": "True enterprise resilience requires combining dual-bank redundancy (to prevent bricking), watchdog rollback (to recover from software hangs), cryptographic signatures (to prevent tampering), and anti-rollback counters (to defeat downgrade attacks)."
            }
        }
    ],
    "summary": [
        "Dual-Bank Flash A/B Partitioning executes operational code from the Active Bank while staging new firmware in the Passive Bank, preventing hard bricking.",
        "The immutable Golden Bootloader armed with a hardware Watchdog Timer automatically rolls back to the previous bank if the new firmware fails post-boot self-tests.",
        "Cryptographic OEM signature verification (ECDSA P-256 / SHA-256) validates binary authenticity against immutable public keys burned into hardware eFuses.",
        "Hardware monotonic anti-rollback counters prevent downgrade attacks by rejecting older signed firmware containing known vulnerabilities.",
        "The masterclass engine synthesizes dual-bank staging, signature verification, and anti-rollback under OTA_DUAL_BANK_FIRMWARE_ENGINE_GRADE_A_PLUS_CERTIFIED."
    ]
}

# Verify word count per part
total_words = 0
for idx, part in enumerate(day59_obj["parts"]):
    wc = sum(len(p.split()) for p in part["say"])
    total_words += wc
    print(f"Part {idx+1} word count: {wc} words")
    assert wc >= 580, f"Part {idx+1} has only {wc} words (< 580)"

print(f"Day 59 total word count: {total_words} words (Requirement: >= 3000)")
assert total_words >= 3000

with open("scripts/day-59-data.json", "w", encoding="utf-8") as f:
    json.dump(day59_obj, f, indent=2, ensure_ascii=False)

print("Saved scripts/day-59-data.json successfully!")
