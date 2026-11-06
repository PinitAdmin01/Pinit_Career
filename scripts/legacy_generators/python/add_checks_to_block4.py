# scripts/add_checks_to_block4.py
import json

part_checks = {
    # Day 16
    (16, 0): {
        "codeNotes": ["Extracts 4-byte CoAP header bitfields.", "Demonstrates packing Ver, Type, TKL, Code, and MsgID.", "Verifies binary unpacking and classification."],
        "tryIt": "Alter msg_type to NON (0x01) and observe the unpacked type string.",
        "check": {
            "question": "What is the exact fixed byte size of a standard CoAP binary header defined in RFC 7252?",
            "options": ["4 bytes", "8 bytes", "12 bytes", "20 bytes"],
            "answer": 0,
            "explanation": "RFC 7252 fixes the core CoAP binary header to exactly 4 bytes (32 bits) comprising Ver, Type, TKL, Code, and Message ID."
        }
    },
    (16, 1): {
        "codeNotes": ["Sorts options by option number in ascending order.", "Calculates delta values relative to preceding options.", "Encodes 4-bit nibbles with 1-byte and 2-byte extensions."],
        "tryIt": "Append another Uri-Path option and verify that its delta is calculated as 0.",
        "check": {
            "question": "Why does CoAP serialize options using Delta Encoding rather than absolute option numbers?",
            "options": [
                "To eliminate redundant bytes by encoding only the numerical difference between sorted option numbers.",
                "To encrypt options against unauthorized eavesdroppers.",
                "To ensure options can be processed out of order.",
                "To convert ASCII strings into Base64 characters."
            ],
            "answer": 0,
            "explanation": "Because options are sorted numerically, encoding the delta between consecutive numbers allows most options to be identified in a single 4-bit nibble."
        }
    },
    (16, 2): {
        "codeNotes": ["Maintains subscriber table mapping resources to client endpoints.", "Increments 24-bit observe sequence number.", "Dispatches asynchronous notification datagrams with client tokens."],
        "tryIt": "Register a third subscriber and verify notification broadcasting.",
        "check": {
            "question": "What transaction handle allows a CoAP client to match asynchronous Observe notifications to its original request?",
            "options": [
                "The client-generated Token (1 to 8 bytes).",
                "The 16-bit Message ID which remains identical forever.",
                "The IP address and MAC address of the gateway.",
                "The UDP source port which must be static."
            ],
            "answer": 0,
            "explanation": "The Token acts as an application-level transaction identifier preserved across all Observe notifications."
        }
    },
    (16, 3): {
        "codeNotes": ["Encodes NUM, More flag, and SZX into Block2 option bytes.", "Calculates power-of-two chunk sizes using 2^(SZX+4).", "Segments a 250-byte array into 64-byte blocks."],
        "tryIt": "Change SZX to 3 (128 bytes) and observe the reduction in total block count.",
        "check": {
            "question": "In CoAP Blockwise Transfer (RFC 7959), what payload size corresponds to SZX exponent 2?",
            "options": ["64 bytes", "16 bytes", "32 bytes", "128 bytes"],
            "answer": 0,
            "explanation": "BlockSize is defined as 2^(SZX + 4). For SZX = 2, 2^(2 + 4) = 2^6 = 64 bytes."
        }
    },
    (16, 4): {
        "codeNotes": ["Implements CoAP REST routing table and duplicate detection cache.", "Generates piggybacked ACK responses for CON requests.", "Verifies duplicate request suppression and token reflection."],
        "tryIt": "Send a NON request and verify that the response type is NON instead of ACK.",
        "check": {
            "question": "What is the primary benefit of Piggybacked Acknowledgements in CoAP?",
            "options": [
                "The response payload is bundled directly inside the ACK packet, cutting required wireless transmissions in half.",
                "It enables TCP handshakes over UDP sockets.",
                "It eliminates the need for Message IDs in headers.",
                "It encrypts payloads using hardware AES-128."
            ],
            "answer": 0,
            "explanation": "Piggybacked ACKs bundle the response status code and data into the ACK frame, saving radio airtime and battery energy."
        }
    },

    # Day 17
    (17, 0): {
        "codeNotes": ["Maintains bidirectional topic registration map.", "Assigns 2-byte Topic IDs for long UTF-8 strings.", "Compares standard MQTT header footprint with MQTT-SN."],
        "tryIt": "Register a second topic and inspect the assigned 16-bit ID.",
        "check": {
            "question": "How does MQTT-SN eliminate string topic overhead over constrained radio links?",
            "options": [
                "By registering the topic string once and using a 2-byte Topic ID for all subsequent publishes.",
                "By compressing topic strings using gzip.",
                "By removing topics completely and broadcasting raw data.",
                "By forcing all topics to be 1 byte long."
            ],
            "answer": 0,
            "explanation": "MQTT-SN replaces long UTF-8 topic strings with 16-bit integer Topic IDs via the REGISTER/REGACK handshake."
        }
    },
    (17, 1): {
        "codeNotes": ["Implements ASLEEP client session state with configurable sleep duration.", "Buffers cloud downlink messages in a per-client queue.", "Flushes buffered messages upon receiving client PINGREQ wake-up probe."],
        "tryIt": "Enqueue a third downlink message and observe queue flushing upon PINGREQ.",
        "check": {
            "question": "What packet is transmitted by a sleeping MQTT-SN client upon waking up to retrieve buffered downlink messages?",
            "options": [
                "A lightweight PINGREQ packet.",
                "A full CONNECT packet with clean session flag.",
                "A DISCONNECT packet with duration 0.",
                "A SUBSCRIBE wildcard packet."
            ],
            "answer": 0,
            "explanation": "A sleeping client wakes up, turns on its receiver, and sends PINGREQ to signal the gateway to flush queued messages."
        }
    },
    (17, 2): {
        "codeNotes": ["Models Transparent gateway with dedicated TCP connection per sensor.", "Models Aggregating gateway with shared multiplexed TCP connection.", "Compares cloud telemetry egress formatting."],
        "tryIt": "Connect 3 simulated sensors to the aggregating gateway and observe shared pipe multiplexing.",
        "check": {
            "question": "What is the main scalability advantage of an Aggregating MQTT-SN Gateway over a Transparent Gateway?",
            "options": [
                "It maintains a single pooled TCP connection to the cloud broker, servicing thousands of nodes without socket exhaustion.",
                "It gives every sensor node its own public IP address.",
                "It encrypts data with quantum-resistant keys.",
                "It eliminates the need for radio transceivers."
            ],
            "answer": 0,
            "explanation": "Aggregating gateways multiplex thousands of wireless sensor nodes over a single persistent cloud connection, preventing TCP socket starvation."
        }
    },
    (17, 3): {
        "codeNotes": ["Encodes QoS -1 publish flags with binary 11b in bits 6..5.", "Bypasses connection handshakes using Predefined Topic IDs.", "Validates single 9-byte UDP blast transmission."],
        "tryIt": "Modify topic ID to 0x0002 and verify packet flag bitfields.",
        "check": {
            "question": "Which statement accurately describes MQTT-SN Quality of Service Level -1 (QoS -1)?",
            "options": [
                "The node publishes a single non-connected datagram without establishing a session or waiting for an ACK.",
                "The node requires a 4-way handshake matching MQTT QoS 2.",
                "The gateway rejects the publish because the node is not connected.",
                "The node retransmits until the broker returns PUBACK."
            ],
            "answer": 0,
            "explanation": "QoS -1 allows ultra-low-power nodes to transmit a single fire-and-forget datagram without prior connection or registration."
        }
    },
    (17, 4): {
        "codeNotes": ["Implements production-grade MQTTSNGatewayEngine.", "Handles CONNECT, REGISTER, and QoS 1 PUBLISH frames.", "Translates sensor telemetry into cloud broker uplinks and generates PUBACKs."],
        "tryIt": "Publish with QoS 0 and verify that no PUBACK is returned.",
        "check": {
            "question": "What return code indicates successful topic registration in an MQTT-SN REGACK packet?",
            "options": ["0x00 (Accepted)", "0x01 (Rejected: Congestion)", "0x02 (Invalid Topic ID)", "0xFF (Not Supported)"],
            "answer": 0,
            "explanation": "A return code of 0x00 in the REGACK message indicates that the topic registration was accepted and the Topic ID is valid."
        }
    },

    # Day 18
    (18, 0): {
        "codeNotes": ["Implements PureCBOR integer encoder across bit-width boundaries.", "Encodes 0..23 inline in initial byte additional info.", "Encodes negative integers using -1 - val mapping."],
        "tryIt": "Encode number 500 and verify that it requires 3 bytes total (0x19 header + 2 bytes).",
        "check": {
            "question": "In CBOR (RFC 8949), how are unsigned integers from 0 to 23 encoded?",
            "options": [
                "Directly inside the 5-bit Additional Information field of the initial byte (1 byte total).",
                "As an initial byte followed by a 1-byte integer.",
                "Using standard ASCII string characters.",
                "As 4-byte big-endian integers."
            ],
            "answer": 0,
            "explanation": "Values 0 through 23 fit directly inside the lower 5 bits of the initial byte, requiring zero extra bytes on the wire."
        }
    },
    (18, 1): {
        "codeNotes": ["Encodes Major Type 2 (Byte Strings) and Major Type 3 (Text Strings).", "Demonstrates native binary packaging without Base64 expansion.", "Measures exact wire bandwidth savings."],
        "tryIt": "Encode a 16-byte cryptographic key as a Byte String and verify that its header is 0x50.",
        "check": {
            "question": "What bandwidth expansion penalty is avoided by using CBOR Byte Strings instead of JSON Base64 strings?",
            "options": [
                "The 33% size expansion inherent in Base64 ASCII conversion.",
                "The 50% checksum expansion.",
                "The 10% IP header tax.",
                "The 64% encryption expansion."
            ],
            "answer": 0,
            "explanation": "Base64 encodes 3 binary bytes into 4 ASCII characters (a 33% bloat). Native CBOR byte strings eliminate this overhead entirely."
        }
    },
    (18, 2): {
        "codeNotes": ["Encodes key-value Maps (Major Type 5) and Arrays (Major Type 4).", "Packs 32-bit floats into exact IEEE 754 4-byte fields.", "Compares binary map footprint against minified JSON."],
        "tryIt": "Add an integer key pair {1: 42} and observe the compact 2-byte encoding.",
        "check": {
            "question": "Unlike JSON, what key types are natively supported in CBOR Maps?",
            "options": [
                "Arbitrary data types, including compact integers and byte strings.",
                "Strictly double-quoted UTF-8 text strings.",
                "Only lowercase alphanumeric characters.",
                "Only sequential 16-bit indexes."
            ],
            "answer": 0,
            "explanation": "CBOR Maps allow keys of any valid data type, including integer keys that drastically reduce dictionary header bloat."
        }
    },
    (18, 3): {
        "codeNotes": ["Constructs MessagePack binary telemetry frame.", "Compares byte footprints of JSON, MessagePack, and CBOR.", "Analyzes type regularity and semantic tagging advantages."],
        "tryIt": "Evaluate byte reduction when adding a fourth sensor telemetry key.",
        "check": {
            "question": "What structural advantage does CBOR have over MessagePack for embedded microcontrollers?",
            "options": [
                "A strictly uniform 3-bit Major Type hierarchy enabling ultra-compact decoders (< 500 bytes ROM).",
                "Built-in support for XML documents.",
                "Larger header sizes that improve error correction.",
                "Mandatory ASCII text parsing."
            ],
            "answer": 0,
            "explanation": "CBOR's uniform 3-bit major type design allows minimalist decoders to parse every type using simple bit-shift and mask operations."
        }
    },
    (18, 4): {
        "codeNotes": ["Implements production CBORTelemetryEngine with integer keys.", "Packs node ID, sequence, timestamp, and readings.", "Calculates exact percentage bandwidth reduction against JSON."],
        "tryIt": "Test serialization with high-frequency float readings and inspect output hex.",
        "check": {
            "question": "Why is reducing serialization byte size critical for LPWAN radios like LoRaWAN?",
            "options": [
                "Radio regulations restrict transmitters to a 1% duty cycle, so smaller payloads directly allow higher reporting frequency and longer battery life.",
                "LoRa radios cannot transmit binary data.",
                "LoRaWAN packets must be exactly 10 bytes.",
                "Cloud gateways drop all packets larger than 50 bytes."
            ],
            "answer": 0,
            "explanation": "Under strict LPWAN duty cycle limits, cutting payload bytes in half cuts on-air transmission time in half, conserving battery power and spectrum."
        }
    },

    # Day 19
    (19, 0): {
        "codeNotes": ["Packs 13-byte DTLS 1.2 record header.", "Encapsulates ContentType, ProtocolVersion, Epoch, 48-bit SeqNum, and Length.", "Validates record unpacking across epoch transitions."],
        "tryIt": "Increment Epoch to 2 and verify that header bytes 3..4 update accordingly.",
        "check": {
            "question": "What is the exact size of a standard DTLS 1.2 Record Header defined in RFC 6347?",
            "options": ["13 bytes", "5 bytes", "8 bytes", "20 bytes"],
            "answer": 0,
            "explanation": "A DTLS 1.2 record header consists of ContentType (1B), Version (2B), Epoch (2B), Sequence Number (6B), and Length (2B) = 13 bytes total."
        }
    },
    (19, 1): {
        "codeNotes": ["Implements DTLSStatelessCookie engine using HMAC-SHA256.", "Generates 16-byte cookie over client IP, port, and random.", "Validates non-spoofed client and rejects spoofed IPs."],
        "tryIt": "Change the client port and verify that cookie verification fails.",
        "check": {
            "question": "What attack is neutralized by the DTLS HelloVerifyRequest stateless cookie exchange?",
            "options": [
                "Denial-of-Service UDP amplification and resource exhaustion attacks.",
                "Physical side-channel power analysis.",
                "Man-in-the-middle ARP spoofing.",
                "Buffer overflow memory corruption."
            ],
            "answer": 0,
            "explanation": "HelloVerifyRequest forces the client to prove return-path reachability before the server allocates cryptographic session memory."
        }
    },
    (19, 2): {
        "codeNotes": ["Implements RFC 6347 64-bit sliding replay window algorithm.", "Tracks right_edge and bitmask for received sequence numbers.", "Accepts out-of-order packets and drops replays/duplicates."],
        "tryIt": "Send a packet with sequence number 100 and observe right edge advancement.",
        "check": {
            "question": "In the DTLS 64-bit sliding replay window, how is a duplicate packet within the active window detected?",
            "options": [
                "By testing if bit (1 << (right_edge - seq_num)) in the 64-bit bitmap is already set to 1.",
                "By querying an external SQL database.",
                "By checking if the sequence number is an odd number.",
                "By computing an MD5 hash of the packet."
            ],
            "answer": 0,
            "explanation": "If the bit corresponding to (right_edge - seq_num) is already 1, the packet was previously received and is rejected as a duplicate."
        }
    },
    (19, 3): {
        "codeNotes": ["Compares PSK vs ECDHE cryptographic performance on Cortex-M4.", "Measures RAM, Flash, handshake latency, and energy consumption.", "Validates that PSK is over 30x more energy-efficient during handshakes."],
        "tryIt": "Calculate battery lifetime difference when performing 100 handshakes per day.",
        "check": {
            "question": "Why do constrained IoT standards like Thread and Zigbee strongly favor Pre-Shared Key (PSK) ciphersuites?",
            "options": [
                "PSK handshakes execute in milliseconds with minimal RAM and ~30x less energy than asymmetric ECDHE operations.",
                "PSK cannot be decrypted by quantum computers.",
                "PSK eliminates the need for AES encryption.",
                "PSK works without radio antennas."
            ],
            "answer": 0,
            "explanation": "PSK uses symmetric cryptography, avoiding expensive elliptic curve point multiplications and reducing RAM/energy consumption drastically."
        }
    },
    (19, 4): {
        "codeNotes": ["Implements production DTLSRecordEngine with authenticated encryption.", "Enforces epoch verification, replay window checks, and HMAC MAC validation.", "Verifies rejection of replayed and single-bit tampered packets."],
        "tryIt": "Tamper with byte 0 of the ciphertext and verify that MAC verification fails.",
        "check": {
            "question": "Why does the DTLSRecordEngine execute the sliding-window replay check before authenticated decryption?",
            "options": [
                "To drop duplicate and stale packets in 20 clock cycles, preventing CPU and battery exhaustion from executing unnecessary decryption.",
                "Because sequence numbers cannot be read after decryption.",
                "To reset the hardware AES co-processor.",
                "Because DTLS requires decryption to occur on the transmitter."
            ],
            "answer": 0,
            "explanation": "Checking the replay window first filters replays in microseconds without burning battery energy on cryptographic hash or cipher operations."
        }
    },

    # Day 20
    (20, 0): {
        "codeNotes": ["Models 1280-byte IPv6 MTU requirement against 127-byte 802.15.4 frame limit.", "Calculates uncompressed IPv6+UDP overhead (48 bytes).", "Demonstrates the necessity of 6LoWPAN adaptation layer."],
        "tryIt": "Calculate usable payload space if MAC security (MIC-32) adds 14 bytes to the header.",
        "check": {
            "question": "What is the minimum MTU required by standard IPv6 (RFC 8200) versus the maximum physical frame size of IEEE 802.15.4?",
            "options": [
                "IPv6 requires 1280 bytes MTU; IEEE 802.15.4 allows maximum 127 bytes.",
                "IPv6 requires 1500 bytes; IEEE 802.15.4 allows 256 bytes.",
                "Both protocols require exactly 512 bytes.",
                "IPv6 requires 64 bytes; IEEE 802.15.4 allows 1024 bytes."
            ],
            "answer": 0,
            "explanation": "RFC 8200 mandates a 1280-byte minimum MTU for IPv6, while IEEE 802.15.4 physical frames are capped at 127 bytes."
        }
    },
    (20, 1): {
        "codeNotes": ["Decodes LOWPAN_IPHC 2-byte header bitfields.", "Extracts TF, NH, HLIM, CID, SAC, SAM, DAC, and DAM.", "Demonstrates stateless MAC-derived IPv6 address elision."],
        "tryIt": "Change hop limit to 1 and verify that HLIM decodes as 'HopLimit=1 (0B)'.",
        "check": {
            "question": "In LOWPAN_IPHC (RFC 6282), how are source and destination IPv6 addresses elided in stateless mode?",
            "options": [
                "The lower 64 bits are derived directly from the sender and receiver 802.15.4 MAC addresses carried in the link layer frame.",
                "Addresses are replaced by random 4-byte tokens.",
                "All addresses are routed to 0.0.0.0.",
                "Addresses are stored in cloud DNS servers."
            ],
            "answer": 0,
            "explanation": "Stateless address compression (SAM=11, DAM=11) derives the IPv6 Interface Identifier (IID) from the link-layer radio MAC addresses."
        }
    },
    (20, 2): {
        "codeNotes": ["Constructs LOWPAN_NHC UDP header.", "Compresses ports in range 0xF0B0..0xF0BF into 4 bits each.", "Verifies total 6-byte IPv6+UDP header footprint (87.5% reduction)."],
        "tryIt": "Calculate available space in an 802.15.4 frame when compressed header is 6 bytes.",
        "check": {
            "question": "What total header size is achieved by combining LOWPAN_IPHC with LOWPAN_NHC for IPv6 and UDP?",
            "options": ["6 bytes", "48 bytes", "20 bytes", "12 bytes"],
            "answer": 0,
            "explanation": "LOWPAN_IPHC (2B) + UDP NHC (1B) + compressed ports (1B) + checksum (2B) = 6 bytes total, down from 48 bytes uncompressed."
        }
    },
    (20, 3): {
        "codeNotes": ["Implements SixLoWPANFragmenter for FRAG1 (4B) and FRAGN (5B).", "Aligns payload chunks to 8-byte boundaries.", "Encodes 11-bit datagram_size, 16-bit datagram_tag, and 8-bit offset."],
        "tryIt": "Fragment a 500-byte datagram and inspect the resulting fragment count.",
        "check": {
            "question": "What unit of measurement is used for the datagram_offset byte in 6LoWPAN FRAGN headers?",
            "options": ["Units of 8 bytes (64 bits)", "Units of 1 byte", "Units of 16 bytes", "Units of 127 bytes"],
            "answer": 0,
            "explanation": "RFC 4944 specifies that the datagram_offset in FRAGN headers is expressed in increments of 8 bytes."
        }
    },
    (20, 4): {
        "codeNotes": ["Implements Milestone 4 Capstone SixLoWPANEngine.", "Validates full IPHC+NHC compression and round-trip decompression.", "Reassembles fragmented multihop payloads and awards SIXLOWPAN_COMPRESSION_AND_FRAGMENTATION_GRADE_A_PLUS_CERTIFIED."],
        "tryIt": "Simulate delivering fragments out of order and verify exact payload reassembly.",
        "check": {
            "question": "What certification string is emitted upon successful execution of the Milestone 4 SixLoWPANEngine test suite?",
            "options": [
                "SIXLOWPAN_COMPRESSION_AND_FRAGMENTATION_GRADE_A_PLUS_CERTIFIED",
                "BLE_LINK_LAYER_ENGINE_GRADE_A_PLUS_CERTIFIED",
                "IEEE_802_15_4_MAC_ENGINE_GRADE_A_PLUS_CERTIFIED",
                "COAP_REST_ENGINE_GRADE_A_PLUS_VERIFIED"
            ],
            "answer": 0,
            "explanation": "The Milestone 4 Capstone certifies students with SIXLOWPAN_COMPRESSION_AND_FRAGMENTATION_GRADE_A_PLUS_CERTIFIED."
        }
    }
}

# Update block4_iot_net_all_days.json
with open("scripts/block4_iot_net_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

for day_obj in days:
    d_num = day_obj["day"]
    for p_idx, part in enumerate(day_obj["parts"]):
        meta = part_checks.get((d_num, p_idx))
        if meta:
            part["codeNotes"] = meta["codeNotes"]
            part["tryIt"] = meta["tryIt"]
            part["check"] = meta["check"]

with open("scripts/block4_iot_net_all_days.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2)

print("Updated scripts/block4_iot_net_all_days.json with complete check, tryIt, and codeNotes properties.")
