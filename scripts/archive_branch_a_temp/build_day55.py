import json
import subprocess
import sys
import os

# Add scripts directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from test_day55_snippets import p1_code, p2_code, p3_code, p4_code, p5_code
from expand_day55_text import part1_say, part2_say, part3_say, part4_say, part5_say

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

# Build the complete day-55 dictionary
day55_obj = {
    "day": 55,
    "title": "Milestone 11 Capstone: Multi-Protocol Industrial Edge Gateway & OT-to-Cloud Pipeline Engine",
    "coursePrefix": "iot_net",
    "parts": [
        {
            "title": "Industrial Edge Gateway Architecture & Interface Topology",
            "say": part1_say,
            "code": p1_code,
            "output": p1_out,
            "codeNotes": [
                "IndustrialGatewayArchitecture verifies link operational status across heterogeneous OT fieldbus and IT uplink interfaces.",
                "Registers RS-485 serial ports, industrial Ethernet ports, 802.15.4 wireless radios, and 1 Gbps TSN bridge connections.",
                "Enforces strict cybersecurity zone segregation between local OT control loops and upstream enterprise cloud networks."
            ],
            "tryIt": "Add a CAN bus interface running at 500 kbps to the gateway architecture and verify that the topology audit passes.",
            "check": {
                "question": "What is the primary architectural purpose of an Industrial Edge Gateway in a modern Industry 4.0 plant?",
                "options": [
                    "To act as the secure, multi-protocol demarcation bridge between deterministic OT fieldbuses and scalable IT cloud networks.",
                    "To replace all local Programmable Logic Controllers (PLCs) with cloud-hosted virtual machines.",
                    "To modulate 2.4 GHz Wi-Fi radio frequencies onto high-voltage 480V factory power cables.",
                    "To compress video surveillance footage using lossy JPEG compression algorithms."
                ],
                "answer": 0,
                "explanation": "An Industrial Edge Gateway securely bridges the gap between heterogeneous operational technology (OT) protocols (Modbus, OPC UA, TSN) and enterprise IT/cloud systems without compromising local real-time control."
            }
        },
        {
            "title": "High-Performance Multi-Protocol Field Ingestion Engine",
            "say": part2_say,
            "code": p2_code,
            "output": p2_out,
            "codeNotes": [
                "MultiProtocolIngestionEngine concurrently decodes Modbus RTU, OPC UA binary Variant, and MQTT-SN datagram frames.",
                "Modbus decoder unpacks big-endian 16-bit register words and evaluates slave response headers.",
                "OPC UA decoder unpacks little-endian double-precision floating-point numbers based on Variant type ID 0x0B.",
                "MQTT-SN decoder extracts compact 2-byte Topic IDs and ASCII telemetry payloads."
            ],
            "tryIt": "Add an ingestion method for 32-bit Modbus floating point registers using struct.unpack('>f', raw_bytes[3:7]) and test with a simulated pressure transmitter.",
            "check": {
                "question": "Why must an industrial edge gateway utilize asynchronous decoupled workers for protocol ingestion rather than sequential single-threaded polling?",
                "options": [
                    "To prevent high-latency serial timeouts or slow slave responses on one fieldbus from blocking high-speed subscriptions and datagrams on other interfaces.",
                    "To enable sensors to transmit telemetry without consuming electrical power from the factory mains.",
                    "To eliminate the need for CRC checksum verification across industrial Ethernet frames.",
                    "To convert all analog 4-20mA current signals into wireless FM radio broadcasts."
                ],
                "answer": 0,
                "explanation": "Decoupled asynchronous ingestion isolates each fieldbus driver, ensuring that communication delays or timeouts on a slow serial line do not starve high-speed Ethernet or wireless mesh channels."
            }
        },
        {
            "title": "Industrial Data Normalization & Semantic Information Modeling",
            "say": part3_say,
            "code": p3_code,
            "output": p3_out,
            "codeNotes": [
                "SemanticDataNormalizer maps raw register integers and floats into unified ISA-95 equipment hierarchies.",
                "Binds telemetry to calibrated engineering units (RPM, degC, mm/s), explicit quality tags, and ISO-8601 UTC timestamps.",
                "Produces standardized JSON-LD payloads ready for direct ingestion by enterprise cloud brokers and digital twin engines."
            ],
            "tryIt": "Change the asset context to PLANT_STUTTGART.BODY_SHOP_02 and observe how the fully qualified asset_id is dynamically updated in the generated JSON schema.",
            "check": {
                "question": "Why is semantic data normalization essential when bridging industrial fieldbus data to cloud platforms?",
                "options": [
                    "Raw register integers lack context; normalization assigns unambiguous ISA-95 asset IDs, calibrated engineering units, and synchronized timestamps.",
                    "It encrypts payload data using symmetric XOR ciphers to prevent reverse engineering by field technicians.",
                    "It converts digital boolean signals into high-frequency analog waveforms for transmission over twisted-pair copper wire.",
                    "It automatically reboots remote PLCs whenever sensor readings exceed predefined alarm thresholds."
                ],
                "answer": 0,
                "explanation": "Normalization transforms obscure, context-free register integers into self-describing, structured assets with calibrated engineering units and standardized timestamps, enabling cloud systems to interpret data without bespoke parsers."
            }
        },
        {
            "title": "Edge Store-and-Forward Buffering & Offline Resiliency",
            "say": part4_say,
            "code": p4_code,
            "output": p4_out,
            "codeNotes": [
                "StoreAndForwardBuffer maintains a high-reliability local queue that captures telemetry during network outages.",
                "Automatically detects cloud link disconnection and diverts normalized events into local flash storage.",
                "Executes controlled FIFO drain cycles upon network restoration, guaranteeing zero data loss across transient WAN disconnects."
            ],
            "tryIt": "Simulate a buffer saturation scenario by reducing max_buffer_size to 2 and observe how the circular buffer prevents memory exhaustion.",
            "check": {
                "question": "What is the primary function of a Store-and-Forward buffer in an industrial edge gateway?",
                "options": [
                    "To store telemetry locally in non-volatile memory during WAN disconnections and sequentially flush the backlog when connectivity is restored, guaranteeing zero data loss.",
                    "To store user passwords in plaintext memory for rapid automated authentication across factory terminals.",
                    "To forward unencrypted HTTP requests across air-gapped industrial firewall boundaries.",
                    "To increase the baud rate of serial RS-485 cables beyond physical transceiver limits."
                ],
                "answer": 0,
                "explanation": "Store-and-Forward buffering guarantees operational telemetry survivability, ensuring that factory data generated during network outages is safely preserved and forwarded once the cloud link returns."
            }
        },
        {
            "title": "🏆 Milestone 11 Capstone: Multi-Protocol Industrial Edge Gateway Master Engine",
            "say": part5_say,
            "code": p5_code,
            "output": p5_out,
            "codeNotes": [
                "IndustrialEdgeGatewayMasterEngine unifies Modbus RTU, OPC UA, and MQTT-SN decoding into a single pipeline.",
                "Integrates real-time semantic normalization with ISA-95 asset binding and linear unit scaling.",
                "Employs dynamic store-and-forward buffering to survive network faults with verified zero data loss.",
                "Latches verification token INDUSTRIAL_IOT_GATEWAY_ENGINE_GRADE_A_PLUS_CERTIFIED upon flawless execution."
            ],
            "tryIt": "Inject a fourth telemetry stream simulating an emergency stop trigger and verify that it delivers immediately while buffered background records are drained in order.",
            "check": {
                "question": "In the Milestone 11 Master Gateway Engine, how is zero data loss verified across an offline network transient?",
                "options": [
                    "By verifying that the total number of telemetry records ingested across all field protocols exactly equals the total records delivered to the cloud after buffer drainage.",
                    "By ensuring that all fieldbus devices are physically powered down whenever the cloud broker disconnects.",
                    "By transmitting duplicate copies of every packet across three independent satellite radio transceivers.",
                    "By storing all historical data solely in volatile RAM registers without flash backup."
                ],
                "answer": 0,
                "explanation": "Zero data loss is mathematically confirmed by auditing that every ingested field event is safely accounted for—either transmitted live or buffered and drained upon link recovery—yielding 100% cloud delivery."
            }
        }
    ],
    "summary": [
        "Industrial Edge Gateways bridge deterministic OT fieldbuses (Modbus, OPC UA, MQTT-SN, TSN) with elastic IT cloud architectures according to ISA/IEC 62443 security standards.",
        "Asynchronous, decoupled protocol ingestion engines isolate heterogeneous field timing requirements, preventing slow serial polling from blocking high-speed Ethernet streams.",
        "Semantic Data Normalization binds raw register integers to ISA-95 asset hierarchies, calibrated engineering units (RPM, degC, mm/s), and ISO-8601 UTC timestamps.",
        "Store-and-Forward Buffering preserves mission-critical operational telemetry during WAN network outages, flushing backlogs with rate-limited QoS upon link restoration.",
        "The Milestone 11 Master Engine synthesizes full multi-protocol fieldbus translation, semantic modeling, and zero-data-loss resiliency, latched under INDUSTRIAL_IOT_GATEWAY_ENGINE_GRADE_A_PLUS_CERTIFIED."
    ]
}

# Verify word count per part
total_words = 0
for idx, part in enumerate(day55_obj["parts"]):
    wc = sum(len(p.split()) for p in part["say"])
    total_words += wc
    print(f"Part {idx+1} word count: {wc} words")
    assert wc >= 580, f"Part {idx+1} has only {wc} words (< 580)"

print(f"Day 55 total word count: {total_words} words (Requirement: >= 3000)")
assert total_words >= 3000

with open("scripts/day-55-data.json", "w", encoding="utf-8") as f:
    json.dump(day55_obj, f, indent=2, ensure_ascii=False)

print("Saved scripts/day-55-data.json successfully!")
