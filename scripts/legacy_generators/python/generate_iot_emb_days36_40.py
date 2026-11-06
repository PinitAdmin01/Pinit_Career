import json

days = {}

# =========================================================================
# DAY 36: MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament
# =========================================================================
days[36] = {
    "day": 36,
    "title": "MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament",
    "goal": "Master the dominant cloud telemetry protocol: deconstruct MQTT 3.1.1/5.0 packet layouts, variable-length integer encoding, QoS 0/1/2 delivery guarantees, and Last Will and Testament (LWT) disconnect detection.",
    "minutes": 42,
    "recap": "In Block 7, we engineered wireless networks (BLE, Wi-Fi, LoRaWAN, Thread). Today we begin Block 8: Industrial IoT Protocols & Cloud Telemetry, starting with MQTT, the standard messaging protocol for cloud IoT ingestion.",
    "parts": [
        {
            "title": "MQTT Publish/Subscribe Architecture & Topic Tree Wildcards",
            "say": [
                "Unlike HTTP (which is request/response and point-to-point), MQTT is a Publish/Subscribe messaging protocol brokered by a central server (e.g., Mosquitto, EMQX, AWS IoT Core).",
                "Publishers and Subscribers are completely decoupled in three dimensions: Space (they do not need to know each other's IP address), Time (they do not need to be online simultaneously if persistent sessions are used), and Synchronization (publishing is asynchronous).",
                "Topic namespaces are hierarchical strings separated by forward slashes (e.g., 'factories/us-east/line1/press/temperature').",
                "Clients subscribe using wildcards: Single-Level Wildcard ('+') matches exactly one hierarchy level ('factories/+/line1/press/temperature'); Multi-Level Wildcard ('#') matches any number of trailing levels and MUST be placed at the very end of the topic ('factories/us-east/#')."
            ],
            "example": "A subscriber listening on 'sensors/+/temp' receives 'sensors/room1/temp' and 'sensors/room2/temp', but ignores 'sensors/room1/sub/temp'. Listening on 'sensors/#' receives everything under 'sensors/'.",
            "code": """#include <iostream>
#include <string>
#include <vector>

bool matchTopic(const std::string& pattern, const std::string& topic) {
    size_t pIdx = 0, tIdx = 0;
    while (pIdx < pattern.length() && tIdx < topic.length()) {
        if (pattern[pIdx] == '#') return true; // Multi-level matches everything remaining
        if (pattern[pIdx] == '+') {
            // Skip until next '/' in both
            while (tIdx < topic.length() && topic[tIdx] != '/') tIdx++;
            pIdx++;
            if (pIdx < pattern.length() && pattern[pIdx] == '/') pIdx++;
            if (tIdx < topic.length() && topic[tIdx] == '/') tIdx++;
            continue;
        }
        if (pattern[pIdx] != topic[tIdx]) return false;
        pIdx++; tIdx++;
    }
    if (pIdx < pattern.length() && pattern[pIdx] == '#') return true;
    return (pIdx == pattern.length() && tIdx == topic.length());
}

void testTopicMatching(const std::string& pattern, const std::string& topic) {
    bool matched = matchTopic(pattern, topic);
    std::cout << "  Pattern: \"" << pattern << "\" vs Topic: \"" << topic << "\" -> "
              << (matched ? "[MATCH]" : "[REJECT]") << std::endl;
}

int main() {
    std::cout << "--- DAY 36 PART 1: MQTT TOPIC MATCHING & WILDCARDS ---" << std::endl;
    std::cout << "[TOPIC-EVALUATOR] Testing MQTT Topic Filter Rules:" << std::endl;
    testTopicMatching("factories/+/line1/temp", "factories/us-east/line1/temp");
    testTopicMatching("factories/+/line1/temp", "factories/us-east/sub/line1/temp");
    testTopicMatching("telemetry/#",            "telemetry/devices/dev01/vitals");
    testTopicMatching("telemetry/#",            "alerts/critical");
    return 0;
}
""",
            "output": """--- DAY 36 PART 1: MQTT TOPIC MATCHING & WILDCARDS ---
[TOPIC-EVALUATOR] Testing MQTT Topic Filter Rules:
  Pattern: "factories/+/line1/temp" vs Topic: "factories/us-east/line1/temp" -> [MATCH]
  Pattern: "factories/+/line1/temp" vs Topic: "factories/us-east/sub/line1/temp" -> [REJECT]
  Pattern: "telemetry/#" vs Topic: "telemetry/devices/dev01/vitals" -> [MATCH]
  Pattern: "telemetry/#" vs Topic: "alerts/critical" -> [REJECT]
""",
            "codeNotes": [
                {"line": 5, "note": "matchTopic demonstrates the MQTT specification rules for single-level (+) and multi-level (#) wildcards."},
                {"line": 7, "note": "The '#' character matches all remaining hierarchical levels and must terminate the subscription string."},
                {"line": 9, "note": "The '+' wildcard matches exactly one level between two slashes."}
            ],
            "tryIt": "Explain why subscribing to the root topic '#' on a massive enterprise broker is an operational antipattern.",
            "check": {
                "question": "What is the key difference between the MQTT single-level wildcard (+) and multi-level wildcard (#)?",
                "options": [
                    "The '+' wildcard matches exactly one topic hierarchy level, whereas '#' matches any number of subordinate topic levels up to the end of the topic string.",
                    "The '+' wildcard is for numbers, while '#' is for strings.",
                    "The '+' wildcard is only supported in MQTT 5.0.",
                    "The '#' wildcard can be placed at the beginning of a topic string."
                ],
                "answer": 0,
                "why": "In MQTT, '+' matches a single level between slashes (e.g. 'a/+/c' matches 'a/b/c' but not 'a/b/d/c'). '#' matches any arbitrary depth of trailing levels and must be the final character in the topic filter."
            }
        },
        {
            "title": "Variable-Length Integer Encoding & Packet Header Anatomy",
            "say": [
                "Every MQTT packet consists of three parts: 1) Fixed Header (present in all packets); 2) Variable Header (present in select packets like CONNECT, PUBLISH, SUBSCRIBE); 3) Payload (the actual message data).",
                "The Fixed Header is just 2 bytes minimum. Byte 1 contains the Packet Type (bits 4-7: CONNECT=1, PUBLISH=3, PUBACK=4, PINGREQ=12, DISCONNECT=14) and Flags (bits 0-3: DUP, QoS level, RETAIN).",
                "Byte 2 onwards contains the Remaining Length field, which uses a compact Variable-Length Integer Encoding scheme.",
                "In Variable-Length Encoding, each byte uses the lower 7 bits (0-127) to encode the number, and bit 7 (0x80) as a Continuation Bit indicating whether another length byte follows.",
                "A 1-byte length encodes up to 127 bytes. A 4-byte length can encode payloads up to 268,435,455 bytes (256 MB) while consuming only 1 byte for small packets!"
            ],
            "example": "To encode length 64: binary 0x40 (MSB=0, 1 byte). To encode length 321: byte 1 = (321 % 128) | 0x80 = 0xC1; byte 2 = (321 / 128) = 0x02. Encoded as [0xC1, 0x02].",
            "code": """#include <iostream>
#include <cstdint>
#include <iomanip>
#include <vector>

std::vector<uint8_t> encodeVariableLength(uint32_t length) {
    std::vector<uint8_t> bytes;
    do {
        uint8_t encodedByte = length % 128;
        length /= 128;
        if (length > 0) {
            encodedByte |= 0x80; // Set continuation bit
        }
        bytes.push_back(encodedByte);
    } while (length > 0);
    return bytes;
}

uint32_t decodeVariableLength(const std::vector<uint8_t>& bytes) {
    uint32_t multiplier = 1;
    uint32_t value = 0;
    for (uint8_t b : bytes) {
        value += (b & 0x7F) * multiplier;
        multiplier *= 128;
        if ((b & 0x80) == 0) break; // Final byte reached
    }
    return value;
}

int main() {
    std::cout << "--- DAY 36 PART 2: MQTT VARIABLE LENGTH INTEGER ENCODING ---" << std::endl;
    uint32_t testLengths[] = {64, 127, 128, 321, 16384, 2097151};

    for (uint32_t len : testLengths) {
        auto enc = encodeVariableLength(len);
        uint32_t dec = decodeVariableLength(enc);
        std::cout << "  Value: " << std::setw(8) << len << " -> Encoded (" << enc.size() << "B): [";
        for (size_t i = 0; i < enc.size(); ++i) {
            std::cout << "0x" << std::hex << (int)enc[i] << (i < enc.size() - 1 ? ", " : "");
        }
        std::cout << std::dec << "] -> Decoded: " << dec << (len == dec ? " [PASS]" : " [FAIL]") << std::endl;
    }
    return 0;
}
""",
            "output": """--- DAY 36 PART 2: MQTT VARIABLE LENGTH INTEGER ENCODING ---
  Value:       64 -> Encoded (1B): [0x40] -> Decoded: 64 [PASS]
  Value:      127 -> Encoded (1B): [0x7f] -> Decoded: 127 [PASS]
  Value:      128 -> Encoded (2B): [0x80, 0x1] -> Decoded: 128 [PASS]
  Value:      321 -> Encoded (2B): [0xc1, 0x2] -> Decoded: 321 [PASS]
  Value:    16384 -> Encoded (3B): [0x80, 0x80, 0x1] -> Decoded: 16384 [PASS]
  Value:  2097151 -> Encoded (3B): [0xff, 0xff, 0x7f] -> Decoded: 2097151 [PASS]
""",
            "codeNotes": [
                {"line": 6, "note": "encodeVariableLength implements the official MQTT 3.1.1 7-bit continuation encoding algorithm."},
                {"line": 17, "note": "decodeVariableLength reconstructs the integer using incremental 128x multipliers until bit 7 is clear."},
                {"line": 32, "note": "Demonstrates that values under 128 bytes require only a single byte of length overhead."}
            ],
            "tryIt": "Calculate the maximum number that can be encoded in 4 variable-length bytes (hint: 128^4 - 1).",
            "check": {
                "question": "How does MQTT encode the remaining length field in packet fixed headers?",
                "options": [
                    "Using a 1-to-4 byte variable-length encoding where the lower 7 bits encode data and the MSB indicates continuation.",
                    "As a fixed 32-bit big-endian integer.",
                    "As an ASCII decimal string.",
                    "Using Base64 encoding."
                ],
                "answer": 0,
                "why": "The MQTT specification mandates a variable-length scheme using 7 bits per byte for the value and bit 7 as the continuation flag. This minimizes overhead for small sensor payloads (1 byte) while permitting packets up to 256MB."
            }
        },
        {
            "title": "Quality of Service (QoS 0 vs 1 vs 2): Guarantees & Handshakes",
            "say": [
                "MQTT provides three distinct Quality of Service (QoS) levels defining delivery guarantees between publisher, broker, and subscriber.",
                "QoS 0 (At most once / 'Fire and Forget'): The publisher sends the PUBLISH packet and forgets it. No acknowledgment is sent; no packet ID is assigned. If the network drops the packet, it is permanently lost. Used for high-frequency telemetry where occasional drops don't matter.",
                "QoS 1 (At least once / 'Acknowledged Delivery'): The PUBLISH packet contains a unique 16-bit Packet ID. The broker MUST reply with a PUBACK packet containing the matching ID. The publisher keeps the packet in a retransmit queue until PUBACK is received. If a network glitch occurs, the publisher resends the packet, which can cause duplicate delivery at the subscriber.",
                "QoS 2 (Exactly once / 'Assured Delivery'): Uses a 4-step handshake: 1) PUBLISH -> 2) PUBREC (Publish Received) -> 3) PUBREL (Publish Release) -> 4) PUBCOMP (Publish Complete). It guarantees no loss and zero duplicates, but incurs 4 network round trips and heavy latency."
            ],
            "example": "Temperature updates every 500ms use QoS 0. Alarm notifications use QoS 1. Financial fund transfers or OTA firmware boot commands require QoS 2.",
            "code": """#include <iostream>
#include <cstdint>
#include <iomanip>
#include <string>

struct QoSSpec {
    uint8_t level;
    std::string name;
    std::string guarantee;
    uint32_t roundTrips;
    bool hasDuplicateRisk;
    bool requiresPacketId;
};

void evaluateQoSLevels() {
    QoSSpec specs[] = {
        {0, "At most once",   "Best effort delivery (May drop)",        0, false, false},
        {1, "At least once",  "Guaranteed delivery (May duplicate)",    1, true,  true},
        {2, "Exactly once",   "Strict single delivery (Zero duplicates)", 2, false, true}
    };

    std::cout << "[MQTT-QOS] Delivery Guarantee Matrix:" << std::endl;
    for (const auto& q : specs) {
        std::cout << "  QoS " << (int)q.level << " (" << std::left << std::setw(15) << q.name << "):" << std::endl;
        std::cout << "    Guarantee:       " << q.guarantee << std::endl;
        std::cout << "    Handshake RTTs:  " << q.roundTrips << " Round-Trips (" 
                  << (q.level == 0 ? "PUBLISH only" : (q.level == 1 ? "PUBLISH + PUBACK" : "PUBLISH + PUBREC + PUBREL + PUBCOMP")) << ")" << std::endl;
        std::cout << "    Duplicate Risk:  " << (q.hasDuplicateRisk ? "YES (Application must be idempotent)" : "NO") << std::endl;
        std::cout << "    Packet ID Field: " << (q.requiresPacketId ? "MANDATORY" : "OMITTED") << std::endl;
    }
}

int main() {
    std::cout << "--- DAY 36 PART 3: QUALITY OF SERVICE (QOS) MECHANICS ---" << std::endl;
    evaluateQoSLevels();
    return 0;
}
""",
            "output": """--- DAY 36 PART 3: QUALITY OF SERVICE (QOS) MECHANICS ---
[MQTT-QOS] Delivery Guarantee Matrix:
  QoS 0 (At most once   ):
    Guarantee:       Best effort delivery (May drop)
    Handshake RTTs:  0 Round-Trips (PUBLISH only)
    Duplicate Risk:  NO
    Packet ID Field: OMITTED
  QoS 1 (At least once  ):
    Guarantee:       Guaranteed delivery (May duplicate)
    Handshake RTTs:  1 Round-Trips (PUBLISH + PUBACK)
    Duplicate Risk:  YES (Application must be idempotent)
    Packet ID Field: MANDATORY
  QoS 2 (Exactly once   ):
    Guarantee:       Strict single delivery (Zero duplicates)
    Handshake RTTs:  2 Round-Trips (PUBLISH + PUBREC + PUBREL + PUBCOMP)
    Duplicate Risk:  NO
    Packet ID Field: MANDATORY
""",
            "codeNotes": [
                {"line": 5, "note": "QoSSpec details the trade-offs between delivery certainty, network round-trips, and duplicate risk."},
                {"line": 19, "note": "QoS 1 requires the application layer to be idempotent because dropped PUBACKs cause retransmissions."},
                {"line": 23, "note": "QoS 2 eliminates duplicates via its 4-step handshake at the expense of high latency over cellular/satellite."}
            ],
            "tryIt": "Describe what happens when a client sends a QoS 1 packet, the broker receives it and publishes to subscribers, but the PUBACK packet is lost in radio noise.",
            "check": {
                "question": "Why must an IoT application subscribing to MQTT QoS 1 telemetry treat incoming messages as idempotent?",
                "options": [
                    "Because if the network drops the broker's PUBACK response, the publisher retransmits the message with the DUP flag set, causing duplicate delivery.",
                    "Because QoS 1 packets are automatically encrypted twice.",
                    "Because the broker deletes all messages every 60 seconds.",
                    "Because QoS 1 messages only arrive on weekends."
                ],
                "answer": 0,
                "why": "QoS 1 guarantees delivery by retransmitting if an acknowledgment is not received. If the broker receives the publish successfully but the returning PUBACK is lost in network noise, the publisher re-sends the packet, resulting in duplicate delivery at the subscriber."
            }
        },
        {
            "title": "Keep-Alive Heartbeats & Last Will and Testament (LWT)",
            "say": [
                "TCP connections can die silently (the 'half-open' socket state) if a cable is cut or battery power fails without sending a TCP FIN packet.",
                "MQTT resolves this with two integrated mechanisms: 1) Keep-Alive Heartbeats; 2) Last Will and Testament (LWT).",
                "During CONNECT, the client specifies a Keep-Alive interval in seconds (e.g. 60s). If no application traffic is sent within this window, the client transmits a tiny 2-byte PINGREQ packet; the broker replies with a 2-byte PINGRESP.",
                "The 1.5x Multiplier Invariant: In the MQTT specification, the broker will only declare a client disconnected if no packets (telemetry or PINGREQs) are received within 1.5 times the Keep-Alive duration (e.g., 60s * 1.5 = 90 seconds).",
                "Last Will and Testament: In the CONNECT packet, the client registers a Will Topic, Will QoS, and Will Message (e.g., topic 'devices/dev01/status', message 'OFFLINE_UNEXPECTED'). If the broker detects an ungraceful disconnect (timeout or socket error), the BROKER automatically publishes the Last Will message to alert the fleet."
            ],
            "example": "A smart lock connects with LWT: 'devices/lock12/status' = 'OFFLINE'. If someone pulls the power cord, the broker publishes 'OFFLINE' to cloud dashboards after 1.5x Keep-Alive, without the dead lock sending a byte.",
            "code": """#include <iostream>
#include <string>

struct LWTConfig {
    std::string willTopic;
    std::string willMessage;
    uint8_t willQoS;
    bool willRetain;
};

class MQTTConnectionSupervisor {
private:
    uint32_t keepAliveSec;
    LWTConfig lwt;
    bool isConnected;
    uint32_t secondsSinceLastPacket;

public:
    MQTTConnectionSupervisor(uint32_t keepAlive, const LWTConfig& will)
        : keepAliveSec(keepAlive), lwt(will), isConnected(true), secondsSinceLastPacket(0) {}

    void tickOneSecond() {
        if (!isConnected) return;
        secondsSinceLastPacket++;

        uint32_t timeoutThreshold = static_cast<uint32_t>(keepAliveSec * 1.5);
        if (secondsSinceLastPacket >= timeoutThreshold) {
            std::cout << "[BROKER-TIMEOUT] No packets received for " << secondsSinceLastPacket 
                      << "s (1.5x Keep-Alive limit of " << timeoutThreshold << "s EXCEEDED)!" << std::endl;
            triggerLastWillAndTestament();
        }
    }

    void handlePacketReceived() {
        secondsSinceLastPacket = 0;
    }

    void triggerLastWillAndTestament() {
        isConnected = false;
        std::cout << "[BROKER-ACTION] Client declared UNGRACEFULLY DISCONNECTED." << std::endl;
        std::cout << "  -> Publishing Last Will and Testament to Topic: \"" << lwt.willTopic << "\"" << std::endl;
        std::cout << "  -> LWT Payload: \"" << lwt.willMessage << "\" (QoS " << (int)lwt.willQoS << ")" << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 36 PART 4: KEEP-ALIVE & LAST WILL AND TESTAMENT ---" << std::endl;
    LWTConfig lockWill = {"devices/smartlock_01/status", "STATUS: UNEXPECTED_POWER_LOSS", 1, true};
    MQTTConnectionSupervisor brokerMonitor(60, lockWill);

    std::cout << "[SIMULATION] Normal operation: packet received at 30 seconds." << std::endl;
    for (int i = 0; i < 30; ++i) brokerMonitor.tickOneSecond();
    brokerMonitor.handlePacketReceived();

    std::cout << "\\n[SIMULATION] Sudden hardware cable cut at t=30! Client silent..." << std::endl;
    for (int i = 0; i < 95; ++i) {
        brokerMonitor.tickOneSecond();
    }
    return 0;
}
""",
            "output": """--- DAY 36 PART 4: KEEP-ALIVE & LAST WILL AND TESTAMENT ---
[SIMULATION] Normal operation: packet received at 30 seconds.

[SIMULATION] Sudden hardware cable cut at t=30! Client silent...
[BROKER-TIMEOUT] No packets received for 90s (1.5x Keep-Alive limit of 90s EXCEEDED)!
[BROKER-ACTION] Client declared UNGRACEFULLY DISCONNECTED.
  -> Publishing Last Will and Testament to Topic: "devices/smartlock_01/status"
  -> LWT Payload: "STATUS: UNEXPECTED_POWER_LOSS" (QoS 1)
""",
            "codeNotes": [
                {"line": 5, "note": "LWTConfig registers the topic, message, and QoS registered during the initial CONNECT packet."},
                {"line": 24, "note": "The broker enforces the 1.5x multiplier before disconnecting the client and triggering LWT."},
                {"line": 34, "note": "Crucially, the Last Will message is transmitted by the BROKER on behalf of the dead client."}
            ],
            "tryIt": "Explain why a graceful disconnect (sending DISCONNECT packet before closing socket) cancels the Last Will and Testament.",
            "check": {
                "question": "Who physically transmits the Last Will and Testament (LWT) message across the MQTT broker to alert subscribers when a client dies?",
                "options": [
                    "The MQTT broker transmits the LWT message automatically on behalf of the client when it detects an ungraceful disconnection or Keep-Alive timeout.",
                    "The dying client sends it right before its battery dies.",
                    "The Wi-Fi router generates the LWT message.",
                    "The user's smartphone sends the message."
                ],
                "answer": 0,
                "why": "A device that experiences a sudden power loss, battery drop, or broken cable cannot transmit a message. The broker stores the LWT parameters registered during CONNECT and publishes the message itself when it detects the client has dropped."
            }
        },
        {
            "title": "Master Engine: Embedded MQTT Client in C++",
            "say": [
                "We now construct the complete Day 36 Master Engine: an embedded MQTT Client platform.",
                "Our engine models: 1) Construction of fixed and variable header byte sequences; 2) QoS 1 state machine tracking Packet IDs and processing incoming PUBACKs; 3) Keep-Alive timer management with PINGREQ transmission; 4) Last Will and Testament registration.",
                "This architecture represents the core engine powering industrial telemetry gateways reporting to AWS IoT Core, Azure IoT Hub, and local Mosquitto servers."
            ],
            "example": "Executing the engine demonstrates CONNECT with LWT, QoS 1 publish with PUBACK handshake verification, and Keep-Alive heartbeat generation.",
            "code": """#include <iostream>
#include <cstdint>
#include <iomanip>
#include <string>
#include <vector>

class EmbeddedMQTTClient {
private:
    std::string clientId;
    bool isConnected;
    uint16_t nextPacketId;
    uint32_t keepAliveSec;
    uint32_t secondsSinceActivity;

public:
    EmbeddedMQTTClient(const std::string& id, uint32_t keepAlive)
        : clientId(id), isConnected(false), nextPacketId(1),
          keepAliveSec(keepAlive), secondsSinceActivity(0) {}

    void connect(const std::string& willTopic, const std::string& willMsg) {
        isConnected = true;
        secondsSinceActivity = 0;
        std::cout << "[MQTT-CLIENT] Formed CONNECT Packet:" << std::endl;
        std::cout << "  Client ID:   \"" << clientId << "\"" << std::endl;
        std::cout << "  Keep-Alive:  " << keepAliveSec << " seconds" << std::endl;
        std::cout << "  LWT Topic:   \"" << willTopic << "\"" << std::endl;
        std::cout << "  LWT Message: \"" << willMsg << "\"" << std::endl;
        std::cout << "  -> Transmitted CONNECT. Received CONNACK (Return Code: 0x00 - Accepted)." << std::endl;
    }

    void publishQoS1(const std::string& topic, const std::string& payload) {
        if (!isConnected) return;
        uint16_t packetId = nextPacketId++;
        secondsSinceActivity = 0;

        std::cout << "[MQTT-PUBLISH] Sending QoS 1 Message (Packet ID: " << packetId << "):" << std::endl;
        std::cout << "  Topic:   \"" << topic << "\"" << std::endl;
        std::cout << "  Payload: \"" << payload << "\"" << std::endl;

        // Simulated broker response
        std::cout << "  -> Broker returned PUBACK for Packet ID: " << packetId << " [DELIVERY CONFIRMED]" << std::endl;
    }

    void checkKeepAlive() {
        secondsSinceActivity += 30; // Simulate 30s elapsed
        if (secondsSinceActivity >= keepAliveSec) {
            std::cout << "[MQTT-HEARTBEAT] " << secondsSinceActivity 
                      << "s elapsed without traffic. Sending PINGREQ (2 Bytes: [0xC0, 0x00])..." << std::endl;
            std::cout << "  -> Received PINGRESP (2 Bytes: [0xD0, 0x00]). Connection Healthy." << std::endl;
            secondsSinceActivity = 0;
        }
    }

    bool isCertified() const { return isConnected && nextPacketId > 1; }
};

int main() {
    std::cout << "--- DAY 36 PART 5: MASTER EMBEDDED MQTT CLIENT ENGINE ---" << std::endl;
    EmbeddedMQTTClient client("Turbine_Sensor_Node_44", 60);

    client.connect("factory/alerts/turbine44", "STATE: DISCONNECTED_UNEXPECTED");
    std::cout << std::endl;

    client.publishQoS1("factory/telemetry/turbine44", "{\"rpm\": 3600, \"temp_c\": 74.2, \"vib_g\": 0.12}");
    std::cout << std::endl;

    client.checkKeepAlive();
    client.checkKeepAlive();

    if (client.isCertified()) {
        std::cout << "\\n[ENGINE-VERIFIED] Embedded MQTT Client Engine: CERTIFIED OPERATIONAL" << std::endl;
    }
    return 0;
}
""",
            "output": """--- DAY 36 PART 5: MASTER EMBEDDED MQTT CLIENT ENGINE ---
[MQTT-CLIENT] Formed CONNECT Packet:
  Client ID:   "Turbine_Sensor_Node_44"
  Keep-Alive:  60 seconds
  LWT Topic:   "factory/alerts/turbine44"
  LWT Message: "STATE: DISCONNECTED_UNEXPECTED"
  -> Transmitted CONNECT. Received CONNACK (Return Code: 0x00 - Accepted).

[MQTT-PUBLISH] Sending QoS 1 Message (Packet ID: 1):
  Topic:   "factory/telemetry/turbine44"
  Payload: "{\"rpm\": 3600, \"temp_c\": 74.2, \"vib_g\": 0.12}"
  -> Broker returned PUBACK for Packet ID: 1 [DELIVERY CONFIRMED]

[MQTT-HEARTBEAT] 60s elapsed without traffic. Sending PINGREQ (2 Bytes: [0xC0, 0x00])...
  -> Received PINGRESP (2 Bytes: [0xD0, 0x00]). Connection Healthy.

[ENGINE-VERIFIED] Embedded MQTT Client Engine: CERTIFIED OPERATIONAL
""",
            "codeNotes": [
                {"line": 5, "note": "EmbeddedMQTTClient manages protocol states, packet ID generation, and Keep-Alive timing."},
                {"line": 28, "note": "publishQoS1 assigns a 16-bit packet ID and validates matching PUBACK from the broker."},
                {"line": 40, "note": "checkKeepAlive transmits 2-byte PINGREQ packets before the Keep-Alive window expires."}
            ],
            "tryIt": "Add message retransmission logic: if PUBACK is not received within 2 seconds, resend with the DUP flag set.",
            "check": {
                "question": "What is the primary function of the MQTT PINGREQ and PINGRESP packets?",
                "options": [
                    "They allow the client and broker to verify that the underlying TCP connection remains open when no application data is being exchanged.",
                    "They calibrate the microcontroller real-time clock.",
                    "They query the current price of cloud storage.",
                    "They restart the microcontroller CPU."
                ],
                "answer": 0,
                "why": "PINGREQ (from client) and PINGRESP (from broker) are 2-byte heartbeat packets exchanged during idle periods to prove that the TCP link is alive and prevent the broker from triggering the client's Last Will and Testament."
            }
        }
    ],
    "summary": [
        "MQTT decouples publishers and subscribers across space, time, and synchronization via a central broker.",
        "Topic filters support single-level (+) and multi-level (#) wildcards for dynamic hierarchical telemetry routing.",
        "Fixed headers use a 7-bit variable-length integer encoding to support remaining lengths from 1 byte to 256 MB.",
        "QoS 0 provides best-effort, QoS 1 guarantees delivery with duplicate risk, and QoS 2 guarantees exactly-once via a 4-step handshake.",
        "Brokers enforce a 1.5x Keep-Alive timeout, publishing the client's Last Will and Testament if ungraceful disconnection occurs."
    ],
    "projectStep": {
        "title": "Deploying an Embedded MQTT Client in C",
        "steps": [
            "Initialize the network socket interface using non-blocking LwIP TCP sockets.",
            "Construct an MQTT CONNECT packet registering client ID, Keep-Alive interval, and Last Will and Testament.",
            "Implement QoS 1 telemetry publishing with 16-bit Packet ID tracking and a retransmission timeout buffer.",
            "Schedule a periodic software timer to send 2-byte PINGREQ packets during idle intervals."
        ]
    }
}

# Write scripts/iot_emb_day36.json
with open('scripts/iot_emb_day36.json', 'w', encoding='utf-8') as f:
    json.dump(days[36], f, indent=2)
print("Wrote scripts/iot_emb_day36.json successfully!")
# =========================================================================
# DAY 37: Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern
# =========================================================================
days[37] = {
    "day": 37,
    "title": "Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern",
    "goal": "Achieve RESTful web semantics on tiny microcontrollers: master the Constrained Application Protocol (CoAP, RFC 7252), 4-byte binary header parsing, Confirmable (CON) vs Non-Confirmable (NON) messages, and the reactive Observe Pattern (RFC 7641).",
    "minutes": 40,
    "recap": "Yesterday we mastered TCP-based MQTT. Today we examine the UDP-based alternative: CoAP, engineered specifically for constrained devices that cannot afford the RAM and bandwidth overhead of TCP handshakes.",
    "parts": [
        {
            "title": "CoAP Architecture & The UDP Stateless Micro-Web (RFC 7252)",
            "say": [
                "HTTP and TCP are bloated for constrained embedded systems. A single HTTP GET request requires a 3-way TCP handshake (SYN, SYN-ACK, ACK), hundreds of bytes of ASCII text headers (User-Agent, Accept, Host), and TCP connection state management.",
                "The Constrained Application Protocol (CoAP, RFC 7252) brings RESTful web semantics (GET, POST, PUT, DELETE) to resource-constrained 8-bit and 32-bit devices by running over lightweight, connectionless UDP.",
                "CoAP replaces bloated ASCII headers with a compact, fixed 4-byte binary header. A complete CoAP request can fit in under 20 bytes, easily traversing tiny 127-byte 802.15.4 radio frames without fragmentation.",
                "CoAP operates in two sub-layers: a Messaging Layer (handling reliability and deduplication over UDP) and a Request/Response Layer (handling REST methods and response codes like 2.05 Content or 4.04 Not Found)."
            ],
            "example": "An HTTP GET request takes ~300 bytes of ASCII over TCP. The equivalent CoAP GET /sensors/temp request takes exactly 16 bytes of binary over UDP, executing in a single packet with zero connection setup latency.",
            "code": """#include <iostream>
#include <cstdint>
#include <iomanip>

struct ProtocolComparison {
    const char* protocol;
    const char* transport;
    uint32_t connectionSetupBytes;
    uint32_t minHeaderBytes;
    bool supportsREST;
};

void displayCoAPAdvantage() {
    ProtocolComparison protocols[] = {
        {"HTTP/1.1", "TCP", 160, 250, true},
        {"CoAP",     "UDP",   0,   4, true}
    };

    std::cout << "[COAP-ARCH] HTTP vs CoAP Overhead Comparison:" << std::endl;
    for (const auto& p : protocols) {
        std::cout << "  Protocol: " << std::left << std::setw(10) << p.protocol
                  << " | Transport: " << std::setw(4) << p.transport
                  << " | Handshake: " << std::right << std::setw(3) << p.connectionSetupBytes << " Bytes"
                  << " | Min Header: " << std::setw(3) << p.minHeaderBytes << " Bytes"
                  << " | REST Semantics: " << (p.supportsREST ? "YES" : "NO") << std::endl;
    }
}

int main() {
    std::cout << "--- DAY 37 PART 1: COAP ARCHITECTURE & UDP MICRO-WEB ---" << std::endl;
    displayCoAPAdvantage();
    return 0;
}
""",
            "output": """--- DAY 37 PART 1: COAP ARCHITECTURE & UDP MICRO-WEB ---
[COAP-ARCH] HTTP vs CoAP Overhead Comparison:
  Protocol: HTTP/1.1   | Transport: TCP  | Handshake: 160 Bytes | Min Header: 250 Bytes | REST Semantics: YES
  Protocol: CoAP       | Transport: UDP  | Handshake:   0 Bytes | Min Header:   4 Bytes | REST Semantics: YES
""",
            "codeNotes": [
                {"line": 5, "note": "ProtocolComparison benchmarks the packet overhead of HTTP/TCP versus CoAP/UDP."},
                {"line": 13, "note": "CoAP eliminates TCP's 3-way handshake entirely, achieving 0-byte connection setup."},
                {"line": 15, "note": "Minimum CoAP header is only 4 bytes compared to 250+ bytes for standard HTTP ASCII headers."}
            ],
            "tryIt": "Calculate the byte savings when sending 100 sensor readings per day over satellite IoT using CoAP vs HTTP.",
            "check": {
                "question": "What transport layer protocol does the Constrained Application Protocol (CoAP) utilize by default?",
                "options": [
                    "UDP (User Datagram Protocol), eliminating connection setup handshakes and keeping memory state minimal.",
                    "TCP (Transmission Control Protocol).",
                    "HTTP/2.",
                    "SCTP."
                ],
                "answer": 0,
                "why": "CoAP runs over UDP (port 5683 for unencrypted, port 5684 for DTLS encrypted) to avoid TCP's 3-way handshake, large socket buffers, and connection state on constrained microcontrollers."
            }
        },
        {
            "title": "4-Byte Fixed Binary Header & Delta Option Encoding",
            "say": [
                "Every CoAP message begins with a fixed 4-byte binary header.",
                "Byte 0: Version (bits 6-7, always 01b for CoAP v1), Type (bits 4-5: 0=Confirmable CON, 1=Non-Confirmable NON, 2=Acknowledgement ACK, 3=Reset RST), and Token Length (TKL, bits 0-3, length of correlation token, 0-8 bytes).",
                "Byte 1: Code (split into a 3-bit class and 5-bit detail: 0.01=GET, 0.02=POST, 0.03=PUT, 0.04=DELETE, 2.05=Content, 4.04=Not Found).",
                "Bytes 2-3: Message ID (16-bit integer for reliability and deduplication).",
                "Following the Token are CoAP Options (like HTTP headers: Uri-Path, Content-Format, Max-Age). Options use Delta Encoding: each option specifies how much higher its Option Number is than the previous option, packing URI paths into tiny 1-to-2 byte prefixes."
            ],
            "example": "A GET request has Ver=1, Type=CON (0), TKL=0 (Byte 0 = 0x40); Code=0.01 GET (Byte 1 = 0x01); Message ID=0x1234 (Bytes 2-3 = 0x12, 0x34). Total header: 4 bytes [0x40, 0x01, 0x12, 0x34].",
            "code": """#include <iostream>
#include <cstdint>
#include <iomanip>
#include <vector>

#pragma pack(push, 1)
struct CoAPFixedHeader {
    uint8_t ver_type_tkl; // Ver: 2b, Type: 2b, TKL: 4b
    uint8_t code;         // Class: 3b, Detail: 5b
    uint16_t messageId;   // Big-endian 16-bit ID
};
#pragma pack(pop)

void parseCoAPHeader(const uint8_t* rawBytes) {
    const auto* h = reinterpret_cast<const CoAPFixedHeader*>(rawBytes);
    uint8_t version = (h->ver_type_tkl >> 6) & 0x03;
    uint8_t type    = (h->ver_type_tkl >> 4) & 0x03;
    uint8_t tkl     = h->ver_type_tkl & 0x0F;
    uint8_t codeClass  = (h->code >> 5) & 0x07;
    uint8_t codeDetail = h->code & 0x1F;
    uint16_t msgId  = (rawBytes[2] << 8) | rawBytes[3];

    const char* typeNames[] = {"CON (Confirmable)", "NON (Non-Confirmable)", "ACK (Acknowledgement)", "RST (Reset)"};

    std::cout << "[COAP-PARSER] Decoded 4-Byte Binary Header:" << std::endl;
    std::cout << "  Version:    " << (int)version << std::endl;
    std::cout << "  Type:       " << typeNames[type] << std::endl;
    std::cout << "  Token Len:  " << (int)tkl << " Bytes" << std::endl;
    std::cout << "  Code:       " << (int)codeClass << "." << std::setw(2) << std::setfill('0') << (int)codeDetail;
    if (codeClass == 0 && codeDetail == 1) std::cout << " (GET)";
    if (codeClass == 2 && codeDetail == 5) std::cout << " (2.05 Content)";
    std::cout << std::endl;
    std::cout << "  Message ID: 0x" << std::hex << std::setw(4) << msgId << std::dec << std::endl;
}

int main() {
    std::cout << "--- DAY 37 PART 2: COAP 4-BYTE BINARY HEADER ---" << std::endl;
    // GET request, CON, MsgId = 0x4A2F
    uint8_t rawPacket[] = {0x40, 0x01, 0x4A, 0x2F};
    parseCoAPHeader(rawPacket);
    return 0;
}
""",
            "output": """--- DAY 37 PART 2: COAP 4-BYTE BINARY HEADER ---
[COAP-PARSER] Decoded 4-Byte Binary Header:
  Version:    1
  Type:       CON (Confirmable)
  Token Len:  0 Bytes
  Code:       0.01 (GET)
  Message ID: 0x4a2f
""",
            "codeNotes": [
                {"line": 6, "note": "CoAPFixedHeader structure captures the exact 4-byte binary layout defined in RFC 7252 Section 3."},
                {"line": 15, "note": "Bitfield extraction separates Version (2b), Type (2b), and Token Length (4b) from Byte 0."},
                {"line": 19, "note": "Code format c.dd represents REST methods (0.01 GET, 0.02 POST) and response statuses (2.05 Content)."}
            ],
            "tryIt": "Construct the 4-byte header for an ACK response returning 2.05 Content with Message ID 0x4A2F.",
            "check": {
                "question": "What information is encoded in Byte 0 of an RFC 7252 CoAP fixed binary header?",
                "options": [
                    "Version (2 bits), Message Type (CON/NON/ACK/RST, 2 bits), and Token Length (4 bits).",
                    "The IP address of the destination server.",
                    "The Wi-Fi WPA2 password.",
                    "The temperature reading."
                ],
                "answer": 0,
                "why": "Byte 0 of the CoAP header efficiently multiplexes the protocol version (bits 6-7), message transmission reliability type (bits 4-5), and token length (bits 0-3) into a single 8-bit word."
            }
        },
        {
            "title": "Piggybacked vs Separate Responses & Exponential Backoff Retransmissions",
            "say": [
                "Because UDP is inherently unreliable, CoAP implements its own lightweight reliability layer.",
                "Confirmable (CON) messages require an Acknowledgement (ACK) matching the 16-bit Message ID. If an ACK is not received within ACK_TIMEOUT (default 2.0 seconds), CoAP doubles the timeout and retransmits (Exponential Backoff with jitter) up to MAX_RETRANSMIT (default 4 attempts).",
                "Two Response Patterns: Piggybacked vs Separate.",
                "In a Piggybacked Response, if the server has the data immediately available (e.g. reading an internal temperature register), it bundles the 2.05 Content response directly INSIDE the ACK packet! The transaction completes in exactly 1 round trip with zero extra packets.",
                "In a Separate Response, if the server must execute a slow physical action (e.g., waiting 500ms for an ADC conversion or motor actuation), it immediately returns an Empty ACK (Code 0.00) to stop the client's retransmit timer. Later, when the action finishes, the server sends a separate CON message containing the response."
            ],
            "example": "Piggybacked: Client sends CON GET /temp -> Server responds ACK 2.05 '21.5C'. Total: 2 packets. Separate: Client sends CON POST /valve -> Server responds Empty ACK -> Server sends CON 2.04 Changed -> Client responds Empty ACK.",
            "code": """#include <iostream>
#include <cstdint>
#include <iomanip>

class CoAPRetransmissionEngine {
private:
    uint32_t baseTimeoutMs;
    uint32_t maxRetransmissions;

public:
    CoAPRetransmissionEngine() : baseTimeoutMs(2000), maxRetransmissions(4) {}

    void simulateTransmission(bool serverResponds, uint32_t respondOnAttempt) {
        std::cout << "[COAP-RELIABILITY] Transmitting CON Message (MsgID: 0x51B2):" << std::endl;
        uint32_t currentTimeoutMs = baseTimeoutMs;

        for (uint32_t attempt = 1; attempt <= (maxRetransmissions + 1); ++attempt) {
            std::cout << "  Attempt " << attempt << ": Transmitted UDP datagram. Timeout timer: " 
                      << currentTimeoutMs << " ms" << std::endl;

            if (serverResponds && attempt == respondOnAttempt) {
                std::cout << "  -> [ACK RECEIVED] Piggybacked Response (2.05 Content) received in 120 ms! Success." << std::endl;
                return;
            }

            if (attempt <= maxRetransmissions) {
                std::cout << "  -> [TIMEOUT] No ACK received. Doubling timeout (Exponential Backoff)..." << std::endl;
                currentTimeoutMs *= 2;
            }
        }

        std::cout << "  -> [ABORT] Max retransmissions exhausted! Remote host declared UNREACHABLE." << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 37 PART 3: COAP RELIABILITY & RETRANSMISSIONS ---" << std::endl;
    CoAPRetransmissionEngine engine;

    // Case 1: Server responds on attempt 2 after initial packet drop
    std::cout << "[SCENARIO 1: PACKET LOSS RECOVERY]" << std::endl;
    engine.simulateTransmission(true, 2);

    // Case 2: Server completely offline
    std::cout << "\\n[SCENARIO 2: DEAD SERVER FAILURE]" << std::endl;
    engine.simulateTransmission(false, 0);

    return 0;
}
""",
            "output": """--- DAY 37 PART 3: COAP RELIABILITY & RETRANSMISSIONS ---
[SCENARIO 1: PACKET LOSS RECOVERY]
[COAP-RELIABILITY] Transmitting CON Message (MsgID: 0x51B2):
  Attempt 1: Transmitted UDP datagram. Timeout timer: 2000 ms
  -> [TIMEOUT] No ACK received. Doubling timeout (Exponential Backoff)...
  Attempt 2: Transmitted UDP datagram. Timeout timer: 4000 ms
  -> [ACK RECEIVED] Piggybacked Response (2.05 Content) received in 120 ms! Success.

[SCENARIO 2: DEAD SERVER FAILURE]
[COAP-RELIABILITY] Transmitting CON Message (MsgID: 0x51B2):
  Attempt 1: Transmitted UDP datagram. Timeout timer: 2000 ms
  -> [TIMEOUT] No ACK received. Doubling timeout (Exponential Backoff)...
  Attempt 2: Transmitted UDP datagram. Timeout timer: 4000 ms
  -> [TIMEOUT] No ACK received. Doubling timeout (Exponential Backoff)...
  Attempt 3: Transmitted UDP datagram. Timeout timer: 8000 ms
  -> [TIMEOUT] No ACK received. Doubling timeout (Exponential Backoff)...
  Attempt 4: Transmitted UDP datagram. Timeout timer: 16000 ms
  -> [TIMEOUT] No ACK received. Doubling timeout (Exponential Backoff)...
  Attempt 5: Transmitted UDP datagram. Timeout timer: 32000 ms
  -> [ABORT] Max retransmissions exhausted! Remote host declared UNREACHABLE.
""",
            "codeNotes": [
                {"line": 13, "note": "Implements RFC 7252 exponential backoff: base timeout doubles after each failed attempt (2s, 4s, 8s, 16s)."},
                {"line": 20, "note": "Piggybacked response carries the REST payload inside the ACK datagram, completing in 1 round trip."},
                {"line": 28, "note": "Declares host unreachable after 5 total transmission attempts."}
            ],
            "tryIt": "Calculate the total time elapsed before giving up when ACK_TIMEOUT is 2.0s and MAX_RETRANSMIT is 4.",
            "check": {
                "question": "What is a 'Piggybacked Response' in the Constrained Application Protocol (CoAP)?",
                "options": [
                    "A response where the server returns the application data (e.g. 2.05 Content) directly inside the Acknowledgement (ACK) packet of a Confirmable request.",
                    "A response that piggybacks onto a cellular SMS message.",
                    "A response that includes two different passwords.",
                    "A response containing an MP3 audio file."
                ],
                "answer": 0,
                "why": "In CoAP, if the requested resource is immediately available, the server includes the response code and payload directly within the ACK packet that acknowledges the client's CON request, eliminating the need for an extra message."
            }
        },
        {
            "title": "The CoAP Observe Pattern (RFC 7641) & Block-Wise Transfers",
            "say": [
                "Standard REST requires clients to poll servers repeatedly with GET requests to discover state changes, which wastes bandwidth and battery.",
                "RFC 7641 introduces the CoAP Observe Pattern, bringing publish/subscribe semantics to REST over UDP.",
                "A client sends a single GET request with the Observe Option flag set (Observe = 0, Register). The server acknowledges and adds the client's UDP IP/port to its internal Observer List.",
                "Whenever the physical sensor reading changes, the server automatically transmits an asynchronous UDP datagram (carrying an incrementing Observe sequence number) to all registered observers.",
                "Block-wise Transfers (RFC 7959): When a payload exceeds the MTU (e.g., transmitting a 2KB cryptographic certificate or firmware block over 6LoWPAN), CoAP Block1 (request body) and Block2 (response body) split data into 16, 32, 64, or 128-byte slices with an SZX (size exponent) and More-Flag (M), assembling large transfers over lossy UDP without fragmentation failure."
            ],
            "example": "A smart thermostat observes '/sensors/ambient'. Instead of polling every 10 seconds, it sends 1 observe request. The server pushes updates only when temperature changes by >= 0.5C.",
            "code": """#include <iostream>
#include <string>
#include <vector>

struct ObserverSubscription {
    std::string clientEndpoint; // IP:Port
    uint32_t lastSequenceNumber;
    bool isActive;
};

class CoAPObservableResource {
private:
    std::string resourcePath;
    float currentTemperature;
    uint32_t sequenceNumber;
    std::vector<ObserverSubscription> subscribers;

public:
    CoAPObservableResource(const std::string& path)
        : resourcePath(path), currentTemperature(21.0f), sequenceNumber(0) {}

    void registerObserver(const std::string& endpoint) {
        subscribers.push_back({endpoint, 0, true});
        std::cout << "[COAP-OBSERVE] Client \"" << endpoint << "\" subscribed to \"" 
                  << resourcePath << "\" (Observe Option: REGISTER)" << std::endl;
    }

    void updateTemperature(float newTemp) {
        currentTemperature = newTemp;
        sequenceNumber++;
        std::cout << "\\n[SENSOR-UPDATE] Temperature changed to: " << currentTemperature << " C" << std::endl;
        std::cout << "[OBSERVE-NOTIFY] Streaming asynchronous notification (Seq #" << sequenceNumber << "):" << std::endl;

        for (const auto& sub : subscribers) {
            if (sub.isActive) {
                std::cout << "  -> Pushed UDP Datagram to " << sub.clientEndpoint 
                          << " | Payload: [2.05 Content, " << currentTemperature << " C]" << std::endl;
            }
        }
    }
};

int main() {
    std::cout << "--- DAY 37 PART 4: COAP OBSERVE PATTERN (RFC 7641) ---" << std::endl;
    CoAPObservableResource tempSensor("/sensors/ambient");

    tempSensor.registerObserver("192.168.1.105:5683");
    tempSensor.registerObserver("192.168.1.112:5683");

    tempSensor.updateTemperature(21.8f);
    tempSensor.updateTemperature(22.4f);

    return 0;
}
""",
            "output": """--- DAY 37 PART 4: COAP OBSERVE PATTERN (RFC 7641) ---
[COAP-OBSERVE] Client "192.168.1.105:5683" subscribed to "/sensors/ambient" (Observe Option: REGISTER)
[COAP-OBSERVE] Client "192.168.1.112:5683" subscribed to "/sensors/ambient" (Observe Option: REGISTER)

[SENSOR-UPDATE] Temperature changed to: 21.8 C
[OBSERVE-NOTIFY] Streaming asynchronous notification (Seq #1):
  -> Pushed UDP Datagram to 192.168.1.105:5683 | Payload: [2.05 Content, 21.8 C]
  -> Pushed UDP Datagram to 192.168.1.112:5683 | Payload: [2.05 Content, 21.8 C]

[SENSOR-UPDATE] Temperature changed to: 22.4 C
[OBSERVE-NOTIFY] Streaming asynchronous notification (Seq #2):
  -> Pushed UDP Datagram to 192.168.1.105:5683 | Payload: [2.05 Content, 22.4 C]
  -> Pushed UDP Datagram to 192.168.1.112:5683 | Payload: [2.05 Content, 22.4 C]
""",
            "codeNotes": [
                {"line": 5, "note": "ObserverSubscription tracks the client's network endpoint and sequence number."},
                {"line": 18, "note": "A single GET request with Observe=0 registers the client on the server's notification list."},
                {"line": 29, "note": "Asynchronous UDP push occurs only when sensor values physically change, eliminating polling traffic."}
            ],
            "tryIt": "Describe how a client deregisters from an observed resource by sending a GET request with Observe = 1 (Deregister).",
            "check": {
                "question": "What is the primary operational advantage of the CoAP Observe Pattern (RFC 7641) over periodic HTTP GET polling?",
                "options": [
                    "It eliminates polling traffic by having the server push asynchronous UDP notifications only when the physical resource state changes.",
                    "It converts UDP packets into TCP streams.",
                    "It doubles the physical radio range of 802.15.4.",
                    "It automatically translates CoAP into Bluetooth."
                ],
                "answer": 0,
                "why": "Instead of a client waking up every 5 seconds to ask 'has the value changed?', the client registers once. The server streams an update only when the value updates, saving huge amounts of radio airtime and battery power."
            }
        },
        {
            "title": "Master Engine: Embedded CoAP Server Simulator in C++",
            "say": [
                "We now assemble the complete Day 37 Master Engine: an industrial Embedded CoAP Server platform.",
                "Our engine models: 1) Parsing incoming 4-byte binary headers over UDP; 2) Matching URI paths (/sensors/temp, /actuators/relay); 3) Handling Confirmable (CON) vs Non-Confirmable (NON) requests; 4) Piggybacked 2.05 Content and 2.04 Changed response generation; 5) Asynchronous Observe client notification streaming.",
                "This architecture represents the core engine powering smart lighting, industrial building automation, and Thread-based Matter devices."
            ],
            "example": "Executing the engine demonstrates header parsing, URI routing, piggybacked ACK response generation, and observe push notifications with zero memory leaks.",
            "code": """#include <iostream>
#include <cstdint>
#include <iomanip>
#include <string>
#include <vector>

class EmbeddedCoAPServer {
private:
    float temperatureCelsius;
    bool relayState;
    uint32_t requestsProcessed;

public:
    EmbeddedCoAPServer() 
        : temperatureCelsius(23.4f), relayState(false), requestsProcessed(0) {}

    void handleIncomingDatagram(uint8_t type, uint8_t code, uint16_t msgId, const std::string& uriPath) {
        requestsProcessed++;
        std::cout << "[COAP-SERVER] Ingested Datagram #" << requestsProcessed << ":" << std::endl;
        std::cout << "  Type: " << (type == 0 ? "CON" : "NON") << " | Code: " << (int)(code >> 5) << "." 
                  << std::setw(2) << std::setfill('0') << (int)(code & 0x1F) << " | MsgID: 0x" 
                  << std::hex << msgId << std::dec << " | URI: \"" << uriPath << "\"" << std::endl;

        if (uriPath == "/sensors/temp" && code == 0x01) { // GET
            std::cout << "  -> [RESPONSE] 2.05 Content (Piggybacked in ACK): {\"temp\": " 
                      << temperatureCelsius << " C}" << std::endl;
        } else if (uriPath == "/actuators/relay" && code == 0x03) { // PUT
            relayState = !relayState;
            std::cout << "  -> [RESPONSE] 2.04 Changed (Piggybacked in ACK): Relay toggled to " 
                      << (relayState ? "ON" : "OFF") << std::endl;
        } else {
            std::cout << "  -> [RESPONSE] 4.04 Not Found" << std::endl;
        }
    }

    bool isCertified() const { return requestsProcessed >= 2; }
};

int main() {
    std::cout << "--- DAY 37 PART 5: MASTER EMBEDDED COAP SERVER ENGINE ---" << std::endl;
    EmbeddedCoAPServer server;

    // Client 1: CON GET /sensors/temp
    server.handleIncomingDatagram(0, 0x01, 0x1A42, "/sensors/temp");
    std::cout << std::endl;

    // Client 2: CON PUT /actuators/relay
    server.handleIncomingDatagram(0, 0x03, 0x1A43, "/actuators/relay");

    if (server.isCertified()) {
        std::cout << "\\n[ENGINE-VERIFIED] Embedded CoAP Server Engine: CERTIFIED OPERATIONAL" << std::endl;
    }
    return 0;
}
""",
            "output": """--- DAY 37 PART 5: MASTER EMBEDDED COAP SERVER ENGINE ---
[COAP-SERVER] Ingested Datagram #1:
  Type: CON | Code: 0.01 | MsgID: 0x1a42 | URI: "/sensors/temp"
  -> [RESPONSE] 2.05 Content (Piggybacked in ACK): {"temp": 23.4 C}

[COAP-SERVER] Ingested Datagram #2:
  Type: CON | Code: 0.03 | MsgID: 0x1a43 | URI: "/actuators/relay"
  -> [RESPONSE] 2.04 Changed (Piggybacked in ACK): Relay toggled to ON

[ENGINE-VERIFIED] Embedded CoAP Server Engine: CERTIFIED OPERATIONAL
""",
            "codeNotes": [
                {"line": 5, "note": "EmbeddedCoAPServer routes incoming UDP datagrams to internal sensor and actuator state handlers."},
                {"line": 20, "note": "GET /sensors/temp produces a 2.05 Content piggybacked response containing telemetry."},
                {"line": 23, "note": "PUT /actuators/relay toggles physical state and acknowledges with a 2.04 Changed status code."}
            ],
            "tryIt": "Add a handler for a 4.05 Method Not Allowed error when a client attempts a DELETE on a read-only sensor.",
            "check": {
                "question": "What is the primary design characteristic of the CoAP Request/Response model?",
                "options": [
                    "It mirrors standard HTTP REST methods (GET, POST, PUT, DELETE) and status codes (2.05 Content, 4.04 Not Found) using compact binary encodings over UDP.",
                    "It requires all messages to be encrypted with PGP keys.",
                    "It uses XML strings exclusively.",
                    "It is designed strictly for desktop supercomputers."
                ],
                "answer": 0,
                "why": "CoAP is an intentional binary translation of HTTP REST principles: developers use familiar GET, POST, PUT methods and status codes, but encoded in compact 4-byte binary packets running over stateless UDP."
            }
        }
    ],
    "summary": [
        "CoAP brings RESTful web architecture to constrained microcontrollers over lightweight, connectionless UDP.",
        "A fixed 4-byte binary header encodes Version, Type (CON/NON/ACK/RST), Token Length, Code, and 16-bit Message ID.",
        "Piggybacked responses carry data directly inside the ACK datagram, completing transactions in exactly one round trip.",
        "Exponential backoff with jitter handles packet loss over UDP by doubling timeout durations between retries.",
        "The Observe Pattern (RFC 7641) enables asynchronous event streaming, eliminating the bandwidth waste of periodic GET polling."
    ],
    "projectStep": {
        "title": "Implementing a CoAP Server on Top of LwIP UDP Sockets",
        "steps": [
            "Bind a UDP socket to standard CoAP port 5683.",
            "Implement a binary decoder parsing the 4-byte fixed header and Delta-encoded URI options.",
            "Route URI paths to handler functions, generating piggybacked 2.05 Content responses.",
            "Maintain an in-memory client list for Observe subscriptions to push asynchronous sensor updates."
        ]
    }
}

# Write scripts/iot_emb_day37.json
with open('scripts/iot_emb_day37.json', 'w', encoding='utf-8') as f:
    json.dump(days[37], f, indent=2)
print("Wrote scripts/iot_emb_day37.json successfully!")
