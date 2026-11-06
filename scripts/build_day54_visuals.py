import json
import hashlib

with open("scripts/day-54-data.json", "r", encoding="utf-8") as f:
    day54_data = json.load(f)

parts = day54_data["parts"]

# Hardware register specifications for Day 54
reg_specs = [
    {
        "partIndex": 0,
        "title": "Day 54 Part 1 — IEEE 802.1Qbv Time-Aware Shaper (TAS) & Gate Control Lists (GCL)",
        "regName": "TSN_TAS_GCL_SCHED_REG",
        "bitNames": ["GCL_CYCLE_ACTIVE", "GATE_EXPRESS_OPEN", "GATE_BE_OPEN", "GUARD_BAND_EN", "TIME_SLICE_MATCH", "EPOCH_TICK_SYNC", "OVERRUN_PREVENT", "TAS_SCHED_VALID"],
        "steps": [
            ("say1", "Initialize 802.1Qbv TAS scheduler: Program 1000 us cycle time across 8 priority queues.", "0x81", 129, [1, 0, 0, 0, 0, 0, 0, 1]),
            ("say2", "Activate Express time slice (0-300 us): Open gates for TC7/TC6 and close best-effort.", "0xCF", 207, [1, 1, 0, 0, 1, 1, 1, 1]),
            ("example", "Engage administrative Guard Band at offset 800 us: Block low-priority transmission overruns.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify zero queue delay for servo torque frame and complete isolation of background telemetry.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 1,
        "title": "Day 54 Part 2 — IEEE 802.1Qbu & 802.3br Frame Preemption & mPacket Framing",
        "regName": "TSN_FRAME_PREEMPT_REG",
        "bitNames": ["PREEMPT_ACTIVE", "EXPRESS_DETECT", "HOLD_MAC_TX", "MPACKET_FRAG_START", "FRAG_CRC_CHECK", "RESUME_MAC_TX", "REASSEMBLY_OK", "PREEMPT_PASS"],
        "steps": [
            ("say1", "Detect arrival of express emergency-stop frame while pMAC is serializing bulk telemetry.", "0xC0", 192, [1, 1, 0, 0, 0, 0, 0, 0]),
            ("say2", "Preempt pMAC transmission: Terminate initial fragment with SMD-S0 and 32-bit mCRC checksum.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Transmit express frame using SMD-E delimiter with sub-100ns MAC Merge switching latency.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Resume remaining 120 bytes using SMD-C0: Receiver verifies seamless bit-perfect reassembly.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 2,
        "title": "Day 54 Part 3 — IEEE 802.1AS Generalized Precision Time Protocol (gPTP) Clock Synchronization",
        "regName": "TSN_GPTP_SYNC_REG",
        "bitNames": ["GPTP_PORT_ENABLE", "GRANDMASTER_LOCK", "PDELAY_REQ_SENT", "PDELAY_RESP_RCVD", "PROP_DELAY_COMP", "FOLLOW_UP_LATCH", "SUB_US_OFFSET_OK", "AS_SYNC_CONVERGED"],
        "steps": [
            ("say1", "Enable gPTP port engine: Lock to Grandmaster clock source via Best Master Clock Algorithm.", "0xC1", 193, [1, 1, 0, 0, 0, 0, 0, 1]),
            ("say2", "Exchange Pdelay_Req and Pdelay_Resp frames: Latch nanosecond hardware MII timestamps t1-t4.", "0xFD", 253, [1, 1, 1, 1, 1, 1, 0, 1]),
            ("example", "Calculate peer link propagation delay: Compensate for 460.0 ns fiber transit delay.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Apply Follow_Up drift correction: Lock local bridge clock with sub-100ns deterministic jitter.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 3,
        "title": "Day 54 Part 4 — Industrial Ethernet Protocols: PROFINET Real-Time (RT) & EtherNet/IP CIP Framing",
        "regName": "TSN_PROFINET_RT_REG",
        "bitNames": ["PROFINET_RT_EN", "ETHERTYPE_8892_OK", "CYCLE_COUNTER_INC", "DATA_STATUS_VALID", "ETHERNET_IP_CIP", "ENCAP_CMD_MATCH", "IO_CONTROLLER_SYNC", "IND_ETHERNET_PASS"],
        "steps": [
            ("say1", "Enable Layer 2 PROFINET RT engine: Bind dedicated Ethernet frame parser to EtherType 0x8892.", "0xC1", 193, [1, 1, 0, 0, 0, 0, 0, 1]),
            ("say2", "Unpack FrameID 0x8001: Extract 43 bytes of real-time drive speed and torque telemetry.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Validate DataStatus byte (0x35): Confirm primary provider status and active PLC Run mode.", "0xEF", 239, [1, 1, 1, 0, 1, 1, 1, 1]),
            ("tryIt", "Bridge cyclic I/O into TSN scheduled queue: Verify deterministic delivery in under 1 millisecond.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    },
    {
        "partIndex": 4,
        "title": "Day 54 Part 5 — Masterclass Synthesis: Deterministic TSN Switch Simulator & Verification Token",
        "regName": "TSN_MASTER_ENGINE_REG",
        "bitNames": ["TSN_MASTER_INIT", "GCL_SCHEDULE_RUN", "PREEMPT_ENGINE_OK", "GPTP_CLOCK_DISC", "PROFINET_FRAME_OK", "DETERMINISTIC_PASS", "TOKEN_LATCH_OK", "TSN_CERTIFIED"],
        "steps": [
            ("say1", "Initialize DeterministicTsnSwitchEngine: Align local clock to Grandmaster with -210 ns offset.", "0x91", 145, [1, 0, 0, 1, 0, 0, 0, 1]),
            ("say2", "Load GCL schedule: Allocate express robot slot, best-effort window, and 150 us guard band.", "0xDF", 223, [1, 1, 0, 1, 1, 1, 1, 1]),
            ("example", "Execute mixed traffic stream: Pass express frame, route PROFINET RT, and block guard-band burst.", "0xBF", 191, [1, 0, 1, 1, 1, 1, 1, 1]),
            ("tryIt", "Verify zero packet drops for control loops and latch TSN_DETERMINISTIC_NETWORK_ENGINE_GRADE_A_PLUS_CERTIFIED.", "0xFF", 255, [1, 1, 1, 1, 1, 1, 1, 1]),
        ]
    }
]

entries = []
for idx, part in enumerate(parts):
    code_str = part["code"]
    code_hash = hashlib.sha256(code_str.encode("utf-8")).hexdigest()
    spec_meta = reg_specs[idx]
    
    steps_list = []
    for step_tag, caption, hex_val, dec_val, bit_vals in spec_meta["steps"]:
        bits_list = []
        for b_idx in range(8):
            bit_name = spec_meta["bitNames"][7 - b_idx]
            val = bit_vals[b_idx]
            bits_list.append({
                "index": 7 - b_idx,
                "name": bit_name,
                "value": val,
                "tone": "ok" if val == 1 else "idle",
                "highlighted": True if (val == 1 and b_idx == 0) else False
            })
        
        steps_list.append({
            "at": step_tag,
            "step": step_tag,
            "caption": caption,
            "registerName": spec_meta["regName"],
            "bitWidth": 8,
            "hexValue": hex_val,
            "decimalValue": dec_val,
            "maskApplied": hex_val,
            "bits": bits_list
        })
    
    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "register-bits",
            "title": spec_meta["title"],
            "steps": steps_list
        }
    }
    entries.append(entry)

visual_doc = {
    "schemaVersion": 1,
    "prefix": "iot_net",
    "coursePrefix": "iot_net",
    "day": 54,
    "title": "Industrial Ethernet & Time-Sensitive Networking (TSN): 802.1Qbv TAS, 802.1Qbu Preemption & gPTP",
    "promptSha": "industrial-ethernet-tsn-day54-v2",
    "model": "gpt-4o",
    "codeHash": entries[0]["codeHash"],
    "spec": {
        "template": "register-bits"
    },
    "entries": entries
}

with open("src/lib/data/lessonVisuals/iot_net/day-54.json", "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2, ensure_ascii=False)

print("Saved src/lib/data/lessonVisuals/iot_net/day-54.json successfully with domain-accurate hardware registers.")
