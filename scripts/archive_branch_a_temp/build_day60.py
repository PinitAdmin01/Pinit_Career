# scripts/build_day60.py
import json
import subprocess
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from test_day60_snippets import p1_code, p2_code, p3_code, p4_code, p5_code
from expand_day60_text import part1_say, part2_say, part3_say, part4_say, part5_say

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

day60_obj = {
    "day": 60,
    "title": "Milestone 12 Capstone: Production Enterprise Edge-to-Cloud Digital Twin & Security Mesh Engine",
    "coursePrefix": "iot_net",
    "parts": [
        {
            "title": "Capstone Architecture: End-to-End Enterprise Edge-to-Cloud Protocol Mesh Topology",
            "say": part1_say,
            "code": p1_code,
            "output": p1_out,
            "codeNotes": [
                "ProtocolMeshTopologyRouter unifies heterogeneous industrial fieldbuses with hyperscale cloud brokers.",
                "Deploys decoupled protocol bridges for Modbus RTU/TCP, OPC UA TSN, and 6LoWPAN MQTT-SN.",
                "Maintains persistent memory-mapped circular queues to guarantee zero telemetry data loss during wide-area network drops."
            ],
            "tryIt": "Register an additional bridge for 'BLE_MESH' to 'aws.iot.us-east-1' and verify that the router tracks all 4 bridges.",
            "check": {
                "question": "What is the primary role of the ProtocolMeshTopologyRouter in industrial edge computing architectures?",
                "options": [
                    "To translate between diverse industrial OT protocols (Modbus, OPC UA, MQTT-SN) and cloud telemetry endpoints while isolating buffer queues during network disconnects.",
                    "To convert high-voltage alternating current into direct current for factory lighting.",
                    "To compress video streams into MP3 audio files for cellular radio transmission.",
                    "To eliminate the need for IP addressing by transmitting all data over analog telephone lines."
                ],
                "answer": 0,
                "explanation": "The ProtocolMeshTopologyRouter mediates between diverse fieldbus protocols and cloud brokers, handling protocol translation, timing alignment, and persistent buffering during network disconnects."
            }
        },
        {
            "title": "Hardware-Anchored Identity & Zero-Trust Provisioning Pipeline Integration",
            "say": part2_say,
            "code": p2_code,
            "output": p2_out,
            "codeNotes": [
                "SovereignHardwareSecurityPipeline unifies ATECC608A/TPM 2.0 PKCS#11 key isolation and mTLS 1.3 handshakes.",
                "Enforces on-chip private key locking, preventing credential extraction even under physical flash desoldering attacks.",
                "Interprets real-time OCSP revocation responses and validates bootstrap claim tokens before admitting devices to the mesh."
            ],
            "tryIt": "Set slot0_locked to False to simulate an unblown development fuse and confirm that sovereign authentication is denied.",
            "check": {
                "question": "How does the SovereignHardwareSecurityPipeline guarantee that an adversary with physical access to an edge gateway cannot clone it?",
                "options": [
                    "By generating and permanently locking private keys inside hardware secure elements that prohibit read commands across electrical buses.",
                    "By storing private keys in a password-protected ZIP archive on an external USB thumb drive.",
                    "By painting the metal gateway enclosure with radio-reflective metallic paint.",
                    "By requiring field technicians to scan their fingerprints on a physical biometric scanner every five minutes."
                ],
                "answer": 0,
                "explanation": "Hardware secure elements permanently lock private keys within silicon and refuse read commands, ensuring that even attackers with physical device access cannot extract the keys or clone the identity."
            }
        },
        {
            "title": "Bidirectional Device Shadow & Closed-Loop Digital Twin Actuation Mesh",
            "say": part3_say,
            "code": p3_code,
            "output": p3_out,
            "codeNotes": [
                "ClosedLoopDigitalTwinMesh synchronizes desired cloud intent with reported physical reality across edge assets.",
                "Enforces versioned optimistic concurrency control to eliminate race conditions between concurrent cloud operators.",
                "Applies closed-loop physical verification: updates reported state only after physical sensors confirm mechanical transition, eliminating phantom convergence."
            ],
            "tryIt": "Submit a desired patch with expected_version=9 when active version is 10 and observe that HTTP 409 Conflict is returned.",
            "check": {
                "question": "In digital twin architectures, what is 'Phantom Convergence' and how does our capstone engine eliminate it?",
                "options": [
                    "Phantom convergence occurs when the cloud displays an actuation as successful before physical sensors verify it; our engine waits for independent sensor confirmation before reporting state.",
                    "Phantom convergence occurs when Wi-Fi signals reflect off factory walls; our engine uses directional antennas to focus the beam.",
                    "Phantom convergence occurs when twin version numbers roll over past 65,535; our engine resets the counter to zero.",
                    "Phantom convergence occurs when database tables run out of disk space; our engine deletes older log files automatically."
                ],
                "answer": 0,
                "explanation": "Phantom convergence occurs when software reports a desired state as achieved before hardware finishes moving; the closed-loop engine waits for physical sensor feedback before reporting the new state, guaranteeing that cloud representation matches physical reality."
            }
        },
        {
            "title": "Resilient Dual-Bank Secure OTA Deployment & Fleet Rollback Guardian",
            "say": part4_say,
            "code": p4_code,
            "output": p4_out,
            "codeNotes": [
                "FleetOtaRollbackGuardian coordinates dual-bank flash A/B partitioning, cryptographic signatures, and monotonic eFuses.",
                "Rejects downgrade attacks to older signed firmware containing known vulnerabilities by comparing Security Epochs.",
                "Arms hardware watchdog timer during post-boot self-tests, automatically reverting to the previous bank if an update hangs or crashes."
            ],
            "tryIt": "Set self_test_passed to False and verify that the guardian triggers an automatic watchdog rollback to the original bank.",
            "check": {
                "question": "How does the FleetOtaRollbackGuardian recover if a newly flashed firmware update contains a fatal kernel hang?",
                "options": [
                    "The hardware watchdog timer expires when the application fails to confirm health, asserting a reset that triggers the bootloader to revert to the previous working flash bank.",
                    "It prompts the operator on a physical touchscreen to choose which partition to boot.",
                    "It downloads a replacement operating system over satellite radio at 9600 baud.",
                    "It erases all non-volatile flash memory and powers down the unit permanently."
                ],
                "answer": 0,
                "explanation": "If the new firmware hangs, it cannot kick the watchdog timer; the watchdog asserts a hardware reset, and the immutable bootloader detects the unconfirmed boot flag and falls back to the previous known-good partition."
            }
        },
        {
            "title": "Grand Masterclass Capstone Synthesis: Production Enterprise Edge-to-Cloud Digital Twin & Security Mesh Engine",
            "say": part5_say,
            "code": p5_code,
            "output": p5_out,
            "codeNotes": [
                "EnterpriseEdgeCloudMasterEngine synthesizes multi-protocol routing, hardware security, closed-loop digital twins, and secure OTA.",
                "Produces full-stack operational telemetry across bridged protocols, active mTLS sessions, converged twins, and verified firmware.",
                "Asserts OPERATIONAL_SOVEREIGN_MESH status for enterprise cyber-physical production deployments.",
                "Latches grand master certification token COURSE_18_IOT_NET_MASTER_CAPSTONE_GRADE_A_PLUS_CERTIFIED, marking 100% completion of Course 18."
            ],
            "tryIt": "Inspect the res dictionary returned by execute_enterprise_synthesis() and verify that all five operational pillars are fully certified.",
            "check": {
                "question": "What does achieving Course 18 Grand Master certification demonstrate in enterprise IoT and cyber-physical engineering?",
                "options": [
                    "Mastery of the complete edge-to-cloud spectrum: RF physics, data link layer framing, constrained routing, industrial automation protocols, hardware security elements, zero-touch provisioning, digital twins, and resilient OTA lifecycle management.",
                    "The ability to assemble basic Arduino electronics kits following breadboard diagrams.",
                    "Experience with editing HTML files in consumer web browsers.",
                    "Familiarity with standard desktop computer mouse and keyboard peripherals."
                ],
                "answer": 0,
                "explanation": "Course 18 certification validates full-stack mastery across the entire IoT networking and edge mesh landscape—from physical radio waves and industrial fieldbuses to hardware root-of-trust security, closed-loop digital twins, and fleet lifecycle management."
            }
        }
    ],
    "summary": [
        "The ProtocolMeshTopologyRouter bridges heterogeneous OT fieldbuses (Modbus RTU/TCP, OPC UA TSN, 6LoWPAN MQTT-SN) to hyperscale cloud brokers with zero data loss.",
        "Sovereign hardware security anchors device identity in silicon secure elements (ATECC608A / TPM 2.0 PKCS#11 mTLS 1.3) with automated zero-touch provisioning and OCSP revocation.",
        "The Closed-Loop Digital Twin Mesh enforces versioned optimistic concurrency control and waits for physical sensor verification before reporting state, preventing phantom convergence.",
        "The Fleet OTA Rollback Guardian delivers 100% brick-proof firmware updates using dual-bank A/B partitioning, cryptographic signatures, hardware monotonic anti-rollback eFuses, and watchdog rollback.",
        "The grand master engine synthesizes all five pillars under COURSE_18_IOT_NET_MASTER_CAPSTONE_GRADE_A_PLUS_CERTIFIED, completing Course 18 at 100% full-curriculum distinction."
    ]
}

# Verify word count per part
total_words = 0
for idx, part in enumerate(day60_obj["parts"]):
    wc = sum(len(p.split()) for p in part["say"])
    total_words += wc
    print(f"Part {idx+1} word count: {wc} words")
    assert wc >= 580, f"Part {idx+1} has only {wc} words (< 580)"

print(f"Day 60 total word count: {total_words} words (Requirement: >= 3000)")
assert total_words >= 3000

with open("scripts/day-60-data.json", "w", encoding="utf-8") as f:
    json.dump(day60_obj, f, indent=2, ensure_ascii=False)

print("Saved scripts/day-60-data.json successfully!")
