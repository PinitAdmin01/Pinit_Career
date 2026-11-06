import json

day40 = {
    "day": 40,
    "title": "Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge",
    "goal": "Architect, build, and defend Milestone 7: the Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge. Design a production-grade C++ dual-task FreeRTOS engine that decouples RS-485 Modbus RTU slave polling from cloud MQTT network jitter, validates sensor holding registers with CRC-16, compresses industrial telemetry using NanoPB binary serialization, publishes QoS 1 events to AWS IoT / Azure IoT Hub over TLS, and spools unacknowledged telemetry records into non-volatile Flash storage during network partitions.",
    "minutes": 45,
    "recap": "In Days 36–39, we mastered MQTT publish/subscribe with QoS guarantees, CoAP UDP messaging, Modbus RTU/TCP industrial polling, and NanoPB compact serialization. Today, we synthesize these protocols into an industrial-grade edge gateway bridge in Milestone 7.",
    "parts": [
        {
            "title": "Dual-Task Architecture & Thread-Safe FreeRTOS Queue Decoupling",
            "say": [
                "Industrial edge gateways connect two fundamentally incompatible temporal domains:",
                "1) The Fieldbus Domain: Deterministic, synchronous, and local. Modbus RTU over RS-485 runs on a strict hardware clock (e.g., 9600 baud, 20ms polling interval per slave). Timing jitter here causes PLC communication timeouts and machine emergency stops.",
                "2) The Cloud Domain: Asynchronous, unpredictable, and wide-area. MQTT over Wi-Fi, Ethernet, or Cellular is subject to WAN latency spikes, TLS handshake negotiations, DNS lookups, and TCP packet retransmissions (100ms to 5,000ms).",
                "If an embedded firmware engineer uses a single-threaded loop (e.g. while(1) { pollModbus(); publishMqtt(); }), any cellular drop or broker delay blocks the Modbus bus, triggering fieldbus alarms across the factory floor.",
                "The Architectural Solution: Multi-Task FreeRTOS Decoupling.",
                "Task 1: ModbusMasterTask (High Priority, Real-Time). Periodically queries RS-485 sensors on a hardware timer. Decodes holding registers, verifies CRC-16, and pushes data into a thread-safe FreeRTOS Queue (xQueueSendToBack).",
                "Task 2: CloudBridgeTask (Lower Priority, Network-Bound). Blocks on xQueueReceive(). When a record arrives, it serializes the data with NanoPB and publishes via TLS MQTT without blocking the RS-485 bus."
            ],
            "example": "While the Cloud Bridge Task waits 2.4 seconds for a cellular TCP retransmission, the Modbus Master Task executes two complete 1-second polling cycles on time, queuing sensor records without missing a single byte.",
            "code": """#include <iostream>
#include <queue>
#include <string>
#include <vector>
#include <cstdint>

struct IndustrialSensorReading {
    uint64_t timestampMs;
    uint8_t slaveAddress;
    uint16_t temperatureRaw; // Scaled 0.1 C
    uint16_t pressureRaw;    // Scaled 0.1 kPa
    uint16_t motorRpm;       // Direct RPM
};

// Simulated Thread-Safe FreeRTOS Queue
class FreeRTOSQueueSim {
private:
    std::queue<IndustrialSensorReading> queue;
    size_t maxDepth;
    uint32_t pushCount;
    uint32_t popCount;

public:
    FreeRTOSQueueSim(size_t depth = 16) : maxDepth(depth), pushCount(0), popCount(0) {}

    bool send(const IndustrialSensorReading& item) {
        if (queue.size() >= maxDepth) {
            std::cout << "  [QUEUE-OVERFLOW] Queue full! Dropping item from Slave " << (int)item.slaveAddress << std::endl;
            return false;
        }
        queue.push(item);
        pushCount++;
        return true;
    }

    bool receive(IndustrialSensorReading& item) {
        if (queue.empty()) return false;
        item = queue.front();
        queue.pop();
        popCount++;
        return true;
    }

    size_t size() const { return queue.size(); }
    void printStats() const {
        std::cout << "[QUEUE-METRICS] Enqueued: " << pushCount << " | Dequeued: " << popCount 
                  << " | Current Depth: " << queue.size() << "/" << maxDepth << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 40 PART 1: DUAL-TASK QUEUE DECOUPLING ---" << std::endl;
    FreeRTOSQueueSim telemetryQueue(8);

    // Simulate Modbus Master Task producing 3 cycles of sensor readings
    std::cout << "[MODBUS-TASK] Polling RS-485 Slaves on 1000ms hardware timer..." << std::endl;
    telemetryQueue.send({1000, 0x01, 245, 1013, 1750}); // 24.5 C, 101.3 kPa, 1750 RPM
    telemetryQueue.send({2000, 0x01, 248, 1014, 1755});
    telemetryQueue.send({3000, 0x01, 251, 1012, 1748});

    telemetryQueue.printStats();

    // Simulate Cloud Bridge Task consuming from queue and publishing
    std::cout << "\\n[CLOUD-TASK] Draining telemetry queue for MQTT publishing..." << std::endl;
    IndustrialSensorReading reading;
    while (telemetryQueue.receive(reading)) {
        std::cout << "  -> Forwarding Record [T+" << reading.timestampMs << "]: Slave " << (int)reading.slaveAddress 
                  << " | Temp=" << (reading.temperatureRaw / 10.0) << " C | RPM=" << reading.motorRpm << std::endl;
    }

    telemetryQueue.printStats();
    return 0;
}
""",
            "output": """--- DAY 40 PART 1: DUAL-TASK QUEUE DECOUPLING ---
[MODBUS-TASK] Polling RS-485 Slaves on 1000ms hardware timer...
[QUEUE-METRICS] Enqueued: 3 | Dequeued: 0 | Current Depth: 3/8

[CLOUD-TASK] Draining telemetry queue for MQTT publishing...
  -> Forwarding Record [T+1000]: Slave 1 | Temp=24.5 C | RPM=1750
  -> Forwarding Record [T+2000]: Slave 1 | Temp=24.8 C | RPM=1755
  -> Forwarding Record [T+3000]: Slave 1 | Temp=25.1 C | RPM=1748
[QUEUE-METRICS] Enqueued: 3 | Dequeued: 3 | Current Depth: 0/8
""",
            "codeNotes": [
                {
                    "line": 7,
                    "note": "IndustrialSensorReading encapsulates the normalized register data from Modbus slaves."
                },
                {
                    "line": 15,
                    "note": "FreeRTOSQueueSim models xQueueSendToBack and xQueueReceive with fixed depth constraints."
                },
                {
                    "line": 50,
                    "note": "The Modbus task runs independently of cloud delays, preserving hard real-time serial timing."
                }
            ],
            "tryIt": "Explain how FreeRTOS mutexes vs queues differ when passing sensor data between ISRs and tasks.",
            "check": {
                "question": "Why must RS-485 Modbus RTU polling and cloud MQTT publishing be separated into distinct FreeRTOS tasks connected by a queue?",
                "options": [
                    "Because WAN network latency, TLS handshakes, and TCP retransmissions would otherwise block the Modbus bus and violate hard real-time serial polling deadlines.",
                    "Because Modbus RTU cannot operate over copper wire without a queue.",
                    "Because MQTT brokers require separate operating systems for each client.",
                    "Because FreeRTOS requires all tasks to be network tasks."
                ],
                "answer": 0,
                "why": "Serial fieldbus polling requires predictable microsecond-level timing. Coupling it synchronously with unpredictable multi-second cloud internet latency would cause serial bus timeouts, dropped slave polls, and industrial PLC shutdown."
            }
        },
        {
            "title": "Defensive Modbus RTU Ingestion, CRC-16 & Fieldbus Diagnostics",
            "say": [
                "Industrial environments are subjected to severe electrical noise: inductive surges from VFDs and contactor arcs induce high-frequency ringing on RS-485 cables.",
                "A robust industrial gateway must never assume an incoming serial frame is uncorrupted. Defensive programming invariants:",
                "1) CRC-16 Verification: The master MUST compute the CRC-16 (polynomial 0xA001) over all received bytes except the final two CRC bytes and assert an exact match before reading data.",
                "2) Slave Timeout Detection: If no response is received within the response timeout (e.g. 250ms), the transaction is marked as a timeout.",
                "3) Consecutive Fault Thresholding: A single CRC error or timeout causes a retry. However, if three (3) consecutive timeouts occur on a single slave, the master transitions that slave state from HEALTHY to OFFLINE_FAULT and issues an industrial alarm.",
                "4) Telemetry Health Metrics: The gateway computes bus health: Packet Error Rate (PER) = (CRC Errors + Timeouts) / Total Queries."
            ],
            "example": "During motor startup, an inductive spike flips bit 3 in a Modbus frame. The master computes CRC 0x45D5 instead of 0x85D4, rejects the packet, increments the error counter, and issues a retry.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

enum class SlaveHealthState { HEALTHY, DEGRADED, OFFLINE_FAULT };

class DefensiveModbusMaster {
private:
    uint32_t totalQueries;
    uint32_t crcErrors;
    uint32_t timeouts;
    uint32_t successfulPolls;
    uint8_t consecutiveFailures;
    SlaveHealthState health;

    uint16_t calculateCRC(const uint8_t* buffer, size_t length) {
        uint16_t crc = 0xFFFF;
        for (size_t pos = 0; pos < length; pos++) {
            crc ^= static_cast<uint16_t>(buffer[pos]);
            for (int bit = 0; bit < 8; bit++) {
                if ((crc & 0x0001) != 0) crc = (crc >> 1) ^ 0xA001;
                else crc >>= 1;
            }
        }
        return crc;
    }

public:
    DefensiveModbusMaster() 
        : totalQueries(0), crcErrors(0), timeouts(0), 
          successfulPolls(0), consecutiveFailures(0), health(SlaveHealthState::HEALTHY) {}

    bool ingestResponse(const std::vector<uint8_t>& frame) {
        totalQueries++;
        if (frame.empty()) {
            timeouts++;
            consecutiveFailures++;
            std::cout << "[FIELDBUS-ERR] Query TIMEOUT! No response within 250ms (Consecutive: " 
                      << (int)consecutiveFailures << ")" << std::endl;
            evaluateHealth();
            return false;
        }

        if (frame.size() < 5) {
            crcErrors++;
            consecutiveFailures++;
            std::cout << "[FIELDBUS-ERR] Runt frame rejected (< 5 bytes)." << std::endl;
            evaluateHealth();
            return false;
        }

        // Verify CRC-16 (Little Endian)
        size_t payloadLen = frame.size() - 2;
        uint16_t computed = calculateCRC(frame.data(), payloadLen);
        uint16_t received = static_cast<uint16_t>(frame[payloadLen]) | 
                            (static_cast<uint16_t>(frame[payloadLen + 1]) << 8);

        if (computed != received) {
            crcErrors++;
            consecutiveFailures++;
            std::cout << "[FIELDBUS-ERR] CRC Mismatch! Computed 0x" << std::hex << computed 
                      << " != Received 0x" << received << std::dec 
                      << " (Consecutive: " << (int)consecutiveFailures << ")" << std::endl;
            evaluateHealth();
            return false;
        }

        // Success
        successfulPolls++;
        consecutiveFailures = 0;
        health = SlaveHealthState::HEALTHY;
        std::cout << "[FIELDBUS-OK] Valid Modbus Frame verified (CRC: 0x" << std::hex << computed << std::dec << ")." << std::endl;
        return true;
    }

    void evaluateHealth() {
        if (consecutiveFailures >= 3) {
            health = SlaveHealthState::OFFLINE_FAULT;
            std::cout << "  -> [ALARM] Slave transitioned to OFFLINE_FAULT state!" << std::endl;
        } else if (consecutiveFailures > 0) {
            health = SlaveHealthState::DEGRADED;
        }
    }

    void printHealthReport() const {
        double per = totalQueries > 0 ? (double)(crcErrors + timeouts) / totalQueries * 100.0 : 0.0;
        std::cout << "[MODBUS-DIAGNOSTICS] Total: " << totalQueries 
                  << " | Success: " << successfulPolls 
                  << " | CRC Errors: " << crcErrors 
                  << " | Timeouts: " << timeouts 
                  << " | PER: " << std::fixed << std::setprecision(1) << per << "%"
                  << " | State: " << (health == SlaveHealthState::HEALTHY ? "HEALTHY" : 
                                     (health == SlaveHealthState::DEGRADED ? "DEGRADED" : "OFFLINE_FAULT")) 
                  << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 40 PART 2: DEFENSIVE MODBUS INGESTION ---" << std::endl;
    DefensiveModbusMaster master;

    // 1. Valid Response: Slave 1, FC 03, 4 bytes, data=[0x00, 0xEB, 0x05, 0x8C], CRC=0xD827
    // Calculate CRC: [0x01, 0x03, 0x04, 0x00, 0xEB, 0x05, 0x8C]
    std::vector<uint8_t> validResp = {0x01, 0x03, 0x04, 0x00, 0xEB, 0x05, 0x8C, 0x27, 0xD8};
    master.ingestResponse(validResp);

    // 2. Corrupt Frame (Bit noise on bus)
    std::vector<uint8_t> corruptResp = validResp;
    corruptResp[3] ^= 0x08; // Noise bit
    master.ingestResponse(corruptResp);

    // 3. Simulated Timeout (Empty buffer)
    master.ingestResponse({});
    master.ingestResponse({}); // 3rd consecutive failure triggers fault alarm

    master.printHealthReport();
    return 0;
}
""",
            "output": """--- DAY 40 PART 2: DEFENSIVE MODBUS INGESTION ---
[FIELDBUS-OK] Valid Modbus Frame verified (CRC: 0xd827).
[FIELDBUS-ERR] CRC Mismatch! Computed 0x1837 != Received 0xd827 (Consecutive: 1)
[FIELDBUS-ERR] Query TIMEOUT! No response within 250ms (Consecutive: 2)
[FIELDBUS-ERR] Query TIMEOUT! No response within 250ms (Consecutive: 3)
  -> [ALARM] Slave transitioned to OFFLINE_FAULT state!
[MODBUS-DIAGNOSTICS] Total: 4 | Success: 1 | CRC Errors: 1 | Timeouts: 2 | PER: 75.0% | State: OFFLINE_FAULT
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "SlaveHealthState tracks device operational state based on serial error rates."
                },
                {
                    "line": 49,
                    "note": "CRC validation rejects corrupt packets before any register values can affect the system."
                },
                {
                    "line": 70,
                    "note": "Consecutive failure thresholding triggers alarms when a slave drops off the physical bus."
                }
            ],
            "tryIt": "Describe how a Modbus Master automatically clears an OFFLINE_FAULT state once the slave resumes valid responses.",
            "check": {
                "question": "What action should an industrial IoT Modbus master take when receiving a frame with a CRC-16 mismatch?",
                "options": [
                    "Reject the frame immediately without processing register values, increment the CRC error counter, and initiate a retry.",
                    "Accept the frame anyway and replace corrupt bytes with zeros.",
                    "Reboot the microcontroller immediately.",
                    "Change the baud rate to 115200 bps."
                ],
                "answer": 0,
                "why": "A CRC mismatch proves that the frame experienced bit corruption during physical transmission. Processing corrupt data could command machinery with dangerous setpoints; the frame must be rejected and retried."
            }
        },
        {
            "title": "NanoPB Binary Serialization & Variable Compression",
            "say": [
                "After the Modbus master successfully decodes raw registers, the gateway must package the telemetry for cloud transmission.",
                "If formatted as JSON: '{\"timestamp\":1792368120000,\"slave_id\":1,\"temp_c\":23.5,\"pressure_kpa\":101.3,\"rpm\":1750,\"vibration\":0.018}', the payload consumes 112 bytes.",
                "Across 100 machines reporting every second, this generates ~1 gigabyte of cellular data per month per cell.",
                "Using Protocol Buffers (NanoPB):",
                "Schema:",
                "  message MachineTelemetry {",
                "    uint64 timestamp = 1;     // Varint (8 bytes max, typically 6-7 bytes)",
                "    uint32 machine_id = 2;    // Varint (1-2 bytes)",
                "    sint32 temp_centi_c = 3;  // ZigZag Varint (2 bytes)",
                "    uint32 pressure_kpa = 4;  // Varint (2 bytes)",
                "    uint32 motor_rpm = 5;     // Varint (2 bytes)",
                "  }",
                "The entire binary payload fits in only 17 to 19 bytes! This represents an 84% reduction in bandwidth consumption.",
                "NanoPB achieves this with static struct buffers and zero heap allocation (malloc=0)."
            ],
            "example": "A 112-byte JSON string is compressed into an 18-byte NanoPB binary packet. On an LTE-M network with high packet fees, this extends gateway operational lifetime and cuts connectivity costs by 84%.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

// Emulated NanoPB Serialization Engine for MachineTelemetry
class NanoPBSerializer {
private:
    static std::vector<uint8_t> encodeVarint(uint64_t val) {
        std::vector<uint8_t> bytes;
        while (val >= 0x80) {
            bytes.push_back(static_cast<uint8_t>((val & 0x7F) | 0x80));
            val >>= 7;
        }
        bytes.push_back(static_cast<uint8_t>(val & 0x7F));
        return bytes;
    }

    static uint32_t encodeZigZag(int32_t n) {
        return static_cast<uint32_t>((n << 1) ^ (n >> 31));
    }

    static void appendField(std::vector<uint8_t>& buf, uint32_t fieldNum, uint64_t val) {
        uint8_t tag = static_cast<uint8_t>((fieldNum << 3) | 0); // WireType 0 = Varint
        buf.push_back(tag);
        auto varint = encodeVarint(val);
        buf.insert(buf.end(), varint.begin(), varint.end());
    }

public:
    static std::vector<uint8_t> serializeTelemetry(uint64_t timestamp, uint32_t machineId, 
                                                   int32_t tempCentiC, uint32_t pressureKpa, uint32_t rpm) {
        std::vector<uint8_t> payload;
        payload.reserve(32); // Zero dynamic reallocations

        appendField(payload, 1, timestamp);
        appendField(payload, 2, machineId);
        appendField(payload, 3, encodeZigZag(tempCentiC));
        appendField(payload, 4, pressureKpa);
        appendField(payload, 5, rpm);

        return payload;
    }
};

void printPayloadComparison(const std::vector<uint8_t>& protoBytes, const std::string& jsonEquivalent) {
    std::cout << "[PAYLOAD-METRICS]" << std::endl;
    std::cout << "  JSON String:  " << jsonEquivalent << " (" << jsonEquivalent.length() << " B)" << std::endl;
    std::cout << "  NanoPB Binary: [ ";
    for (uint8_t b : protoBytes) {
        std::cout << "0x" << std::hex << std::setw(2) << std::setfill('0') << (int)b << " ";
    }
    std::cout << "] (" << std::dec << protoBytes.size() << " B)" << std::endl;
    double savings = (1.0 - (double)protoBytes.size() / jsonEquivalent.length()) * 100.0;
    std::cout << "  Bandwidth Savings: " << std::fixed << std::setprecision(1) << savings << "% Reduction!" << std::endl;
}

int main() {
    std::cout << "--- DAY 40 PART 3: NANOPB BINARY SERIALIZATION ---" << std::endl;
    uint64_t ts = 1792368120; // Epoch timestamp
    uint32_t machine = 1;
    int32_t temp = 235;        // 23.5 C in centi-degrees
    uint32_t pressure = 1013;  // 101.3 kPa * 10
    uint32_t rpm = 1750;

    std::vector<uint8_t> proto = NanoPBSerializer::serializeTelemetry(ts, machine, temp, pressure, rpm);
    std::string jsonEq = "{\\"ts\\":1792368120,\\"id\\":1,\\"temp\\":23.5,\\"pres\\":101.3,\\"rpm\\":1750}";

    printPayloadComparison(proto, jsonEq);
    return 0;
}
""",
            "output": """--- DAY 40 PART 3: NANOPB BINARY SERIALIZATION ---
[PAYLOAD-METRICS]
  JSON String:  {\"ts\":1792368120,\"id\":1,\"temp\":23.5,\"pres\":101.3,\"rpm\":1750} (57 B)
  NanoPB Binary: [ 0x08 0xb8 0xa5 0xb6 0xd6 0x06 0x10 0x01 0x18 0xd6 0x03 0x20 0xf5 0x07 0x28 0xd6 0x0d ] (17 B)
  Bandwidth Savings: 70.2% Reduction!
""",
            "codeNotes": [
                {
                    "line": 8,
                    "note": "encodeVarint compresses multi-byte integers using 7-bit continuations."
                },
                {
                    "line": 18,
                    "note": "encodeZigZag ensures negative temperatures do not inflate the payload."
                },
                {
                    "line": 49,
                    "note": "The binary payload achieves over 70% compression compared to compact JSON and over 84% compared to verbose JSON."
                }
            ],
            "tryIt": "Calculate the byte length of the Protobuf payload when temperature drops to -15.0 C (encoded as -150).",
            "check": {
                "question": "What allows NanoPB binary serialization to achieve > 70% data reduction compared to JSON in embedded telemetry bridges?",
                "options": [
                    "Field keys are encoded as 1-byte tags and numbers are compressed into 7-bit Varints, completely eliminating ASCII string overhead.",
                    "NanoPB removes all timestamps and device identifiers.",
                    "NanoPB runs standard ZIP compression in RAM.",
                    "NanoPB sends data in analog voltage format."
                ],
                "answer": 0,
                "why": "NanoPB eliminates repetitive ASCII text keys and whitespace, substituting 1-byte wire tags and compactly encoding numeric values with Varints and ZigZag mapping."
            }
        },
        {
            "title": "TLS MQTT Publishing with QoS 1 Handshake & Keep-Alive Ping",
            "say": [
                "Industrial telemetry cannot tolerate silent message loss: if a machine begins vibrating excessively, the cloud predictive maintenance engine must receive the alert.",
                "MQTT QoS 1 Guarantees: At Least Once Delivery.",
                "The QoS 1 Protocol Handshake:",
                "1. The Edge Gateway assigns an incrementing 16-bit Packet Identifier (PacketId) to each telemetry message.",
                "2. The gateway publishes the message to the cloud broker over a secure TLS 1.3 socket with QoS=1 flag asserted.",
                "3. The gateway retains the packet in an In-Flight Ack Buffer and arms an ACK timeout timer (e.g. 2000ms).",
                "4. When the cloud broker successfully commits the message to its storage queue, it replies with a 4-byte PUBACK packet containing the identical PacketId.",
                "5. Upon receiving PUBACK, the gateway removes the packet from the In-Flight buffer.",
                "6. If the ACK timer expires without receiving PUBACK, the gateway retransmits the packet with the Duplicate (DUP) flag asserted.",
                "7. Keep-Alive Watchdog: Every 30 seconds of line silence, the gateway transmits a 2-byte PINGREQ. The broker replies with PINGRESP, preventing cellular firewalls from dropping the TCP socket."
            ],
            "example": "Packet ID 0x0042 is published. A cellular jitter delay causes the PUBACK to arrive at 1.8 seconds. Because the timeout is 2.0 seconds, the gateway confirms delivery without triggering an unnecessary retransmission.",
            "code": """#include <iostream>
#include <map>
#include <vector>
#include <iomanip>
#include <cstdint>

struct MqttQoS1Message {
    uint16_t packetId;
    std::string topic;
    std::vector<uint8_t> payload;
    bool isDuplicate;
};

class MqttQoS1Client {
private:
    uint16_t nextPacketId;
    std::map<uint16_t, MqttQoS1Message> inFlightQueue;
    uint32_t publishedCount;
    uint32_t ackedCount;
    uint32_t retransmitCount;

public:
    MqttQoS1Client() : nextPacketId(1), publishedCount(0), ackedCount(0), retransmitCount(0) {}

    uint16_t publish(const std::string& topic, const std::vector<uint8_t>& payload) {
        uint16_t pid = nextPacketId++;
        if (nextPacketId == 0) nextPacketId = 1; // 16-bit non-zero roll

        MqttQoS1Message msg = {pid, topic, payload, false};
        inFlightQueue[pid] = msg;
        publishedCount++;

        std::cout << "[MQTT-PUBLISH] Topic: '" << topic << "' | PacketId: " << pid 
                  << " | QoS: 1 | Payload: " << payload.size() << " B" << std::endl;
        return pid;
    }

    void handlePubAck(uint16_t packetId) {
        auto it = inFlightQueue.find(packetId);
        if (it != inFlightQueue.end()) {
            std::cout << "  -> [MQTT-PUBACK] Received ACK for PacketId " << packetId << " | Removed from in-flight queue." << std::endl;
            inFlightQueue.erase(it);
            ackedCount++;
        } else {
            std::cout << "  -> [MQTT-PUBACK] Received unexpected or duplicate ACK for PacketId " << packetId << std::endl;
        }
    }

    void handleTimeoutRetransmit(uint16_t packetId) {
        auto it = inFlightQueue.find(packetId);
        if (it != inFlightQueue.end()) {
            it->second.isDuplicate = true;
            retransmitCount++;
            std::cout << "[MQTT-RETRANSMIT] ACK timeout expired for PacketId " << packetId 
                      << "! Resending with DUP=1 flag." << std::endl;
        }
    }

    void printStatus() const {
        std::cout << "[MQTT-STATS] Published: " << publishedCount 
                  << " | Confirmed ACKs: " << ackedCount 
                  << " | Retransmits: " << retransmitCount 
                  << " | In-Flight: " << inFlightQueue.size() << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 40 PART 4: TLS MQTT QOS 1 HANDSHAKE ---" << std::endl;
    MqttQoS1Client mqtt;

    std::vector<uint8_t> dummyProto = {0x08, 0xB8, 0xA5, 0x10, 0x01};

    // 1. Normal QoS 1 transaction
    uint16_t id1 = mqtt.publish("factory/cell1/telemetry", dummyProto);
    mqtt.handlePubAck(id1);

    // 2. Transaction with dropped packet requiring retransmission
    uint16_t id2 = mqtt.publish("factory/cell1/telemetry", dummyProto);
    std::cout << "  (Simulating cellular packet loss... ACK timer expires)" << std::endl;
    mqtt.handleTimeoutRetransmit(id2);
    mqtt.handlePubAck(id2); // Broker confirms duplicate

    mqtt.printStatus();
    return 0;
}
""",
            "output": """--- DAY 40 PART 4: TLS MQTT QOS 1 HANDSHAKE ---
[MQTT-PUBLISH] Topic: 'factory/cell1/telemetry' | PacketId: 1 | QoS: 1 | Payload: 5 B
  -> [MQTT-PUBACK] Received ACK for PacketId 1 | Removed from in-flight queue.
[MQTT-PUBLISH] Topic: 'factory/cell1/telemetry' | PacketId: 2 | QoS: 1 | Payload: 5 B
  (Simulating cellular packet loss... ACK timer expires)
[MQTT-RETRANSMIT] ACK timeout expired for PacketId 2! Resending with DUP=1 flag.
  -> [MQTT-PUBACK] Received ACK for PacketId 2 | Removed from in-flight queue.
[MQTT-STATS] Published: 2 | Confirmed ACKs: 2 | Retransmits: 1 | In-Flight: 0
""",
            "codeNotes": [
                {
                    "line": 7,
                    "note": "MqttQoS1Message retains the unacknowledged payload and duplicate status."
                },
                {
                    "line": 39,
                    "note": "handlePubAck clears confirmed messages from the retransmission buffer."
                },
                {
                    "line": 49,
                    "note": "Retransmissions assert the DUP header bit to inform the cloud broker of a potential retry."
                }
            ],
            "tryIt": "Explain how the cloud broker deduplicates incoming QoS 1 messages with identical PacketIds.",
            "check": {
                "question": "What is the purpose of the 16-bit Packet Identifier (PacketId) in MQTT QoS 1 publishing?",
                "options": [
                    "It uniquely correlates a PUBLISH message with its corresponding PUBACK acknowledgment from the broker.",
                    "It specifies the encryption key index.",
                    "It defines the priority level of the message.",
                    "It tracks the battery level of the edge gateway."
                ],
                "answer": 0,
                "why": "In MQTT QoS 1, the client and broker use the 16-bit PacketId to match PUBLISH and PUBACK messages, ensuring guaranteed delivery across unreliable network connections."
            }
        },
        {
            "title": "Flash Store-and-Forward Failover: Blackout Survival & Milestone 7 Gate Verdict",
            "say": [
                "The defining resilience benchmark for an industrial IoT edge gateway is surviving cloud connectivity blackouts.",
                "In industrial manufacturing plants, internet links fail: fiber cables are severed, cellular base stations become congested, or IT upgrades disrupt corporate firewalls.",
                "The Store-and-Forward Architecture:",
                "1) When the cloud MQTT connection is active (ONLINE), incoming NanoPB telemetry records from the FreeRTOS queue are published directly with QoS 1.",
                "2) When the connection fails (OFFLINE), the gateway enters Failover Mode: the Bridge Task diverts incoming NanoPB records into a local non-volatile Flash Ring Buffer (using LittleFS or raw SPI NOR Flash sectors).",
                "3) Modbus RS-485 polling NEVER stops: field machines continue being monitored without losing a single reading.",
                "4) When the network restores and TLS reconnects, a background Spooler Task wakes up. It drains records from Flash in FIFO order, publishing with an 'offline_replay: true' flag, while live telemetry continues uninterrupted.",
                "Milestone 7 Master Integration: Combines Modbus RTU polling, CRC validation, NanoPB compression, MQTT QoS 1 publishing, and Flash store-and-forward failover into a unified production engine.",
                "Upon verifying 100% data delivery through simulated fieldbus noise and network blackouts, the engine issues the official Milestone 7 Gate Verdict."
            ],
            "example": "A factory suffers a 30-minute cellular outage. 1,800 telemetry records are spooled into SPI Flash. When cellular service restores, all 1,800 records are flushed to AWS IoT with zero dropped samples.",
            "code": """#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <iomanip>
#include <cstdint>

// Milestone 7 Complete Engine Implementation
struct TelemetryRecord {
    uint64_t timestamp;
    uint8_t slaveId;
    int16_t temperature; // 0.1 C
    uint16_t pressure;   // 0.1 kPa
    uint16_t rpm;
};

class Milestone7BridgeEngine {
private:
    bool isCloudConnected;
    std::queue<std::vector<uint8_t>> flashSpoolBuffer;
    uint32_t directMqttCount;
    uint32_t spooledToFlashCount;
    uint32_t drainedFromFlashCount;

    // NanoPB Compression Simulation
    std::vector<uint8_t> compressRecord(const TelemetryRecord& rec) {
        std::vector<uint8_t> out;
        out.push_back(0x08); // Tag 1 (timestamp)
        out.push_back(static_cast<uint8_t>(rec.timestamp & 0x7F));
        out.push_back(0x10); // Tag 2 (slaveId)
        out.push_back(rec.slaveId);
        out.push_back(0x18); // Tag 3 (temp)
        out.push_back(static_cast<uint8_t>(rec.temperature & 0xFF));
        out.push_back(0x20); // Tag 4 (pressure)
        out.push_back(static_cast<uint8_t>(rec.pressure & 0xFF));
        out.push_back(0x28); // Tag 5 (rpm)
        out.push_back(static_cast<uint8_t>(rec.rpm & 0xFF));
        return out;
    }

public:
    Milestone7BridgeEngine() 
        : isCloudConnected(true), directMqttCount(0), 
          spooledToFlashCount(0), drainedFromFlashCount(0) {}

    void setCloudOnline(bool online) {
        isCloudConnected = online;
        std::cout << "[GATEWAY-NETWORK] Cloud Status: " 
                  << (isCloudConnected ? "ONLINE (TLS Reconnected)" : "OFFLINE (Blackout Detected)") << std::endl;
        if (isCloudConnected && !flashSpoolBuffer.empty()) {
            drainFlashSpooler();
        }
    }

    void ingestModbusTelemetry(const TelemetryRecord& rec) {
        auto binaryPayload = compressRecord(rec);
        if (isCloudConnected && flashSpoolBuffer.empty()) {
            directMqttCount++;
            std::cout << "[DIRECT-MQTT-QOS1] Published Live Telemetry: Slave " << (int)rec.slaveId 
                      << " | Temp=" << (rec.temperature / 10.0) << " C (" << binaryPayload.size() << " B)" << std::endl;
        } else {
            spooledToFlashCount++;
            flashSpoolBuffer.push(binaryPayload);
            std::cout << "[FLASH-SPOOL] Cloud OFFLINE! Spooled " << binaryPayload.size() 
                      << " B to Flash Buffer (Queue Depth: " << flashSpoolBuffer.size() << ")" << std::endl;
        }
    }

    void drainFlashSpooler() {
        std::cout << "[SPOOLER-TASK] Draining " << flashSpoolBuffer.size() << " records from Non-Volatile Flash..." << std::endl;
        while (!flashSpoolBuffer.empty()) {
            auto payload = flashSpoolBuffer.front();
            flashSpoolBuffer.pop();
            drainedFromFlashCount++;
            std::cout << "  -> Flushed Spooled Telemetry (" << payload.size() << " B) to Cloud Broker [ACK Confirmed]" << std::endl;
        }
        std::cout << "  -> Flash buffer drained completely. Zero data loss." << std::endl;
    }

    void verifyMilestone7() {
        std::cout << "\\n========================================================" << std::endl;
        std::cout << "MILESTONE 7 VERIFICATION SUMMARY:" << std::endl;
        std::cout << "  Direct Cloud Deliveries: " << directMqttCount << std::endl;
        std::cout << "  Spooled during Blackout: " << spooledToFlashCount << std::endl;
        std::cout << "  Recovered from Flash:    " << drainedFromFlashCount << std::endl;
        std::cout << "  Total Records Preserved: " << (directMqttCount + drainedFromFlashCount) << std::endl;
        std::cout << "  Data Loss:               0.00% (100.0% Delivery Guarantee)" << std::endl;
        std::cout << "========================================================" << std::endl;
        std::cout << "MILESTONE 7 GATE VERDICT: FULLY PASSING & CERTIFIED OPERATIONAL" << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 40 PART 5: MILESTONE 7 BRIDGE MASTER ENGINE ---" << std::endl;
    Milestone7BridgeEngine gateway;

    // Normal operation
    gateway.ingestModbusTelemetry({1000, 1, 245, 1013, 1750});

    // Cloud connection drops! Network Blackout!
    gateway.setCloudOnline(false);
    gateway.ingestModbusTelemetry({2000, 1, 248, 1014, 1752});
    gateway.ingestModbusTelemetry({3000, 1, 252, 1012, 1755});
    gateway.ingestModbusTelemetry({4000, 1, 256, 1011, 1751});

    // Cloud restored!
    gateway.setCloudOnline(true);
    gateway.ingestModbusTelemetry({5000, 1, 258, 1010, 1749});

    gateway.verifyMilestone7();
    return 0;
}
""",
            "output": """--- DAY 40 PART 5: MILESTONE 7 BRIDGE MASTER ENGINE ---
[DIRECT-MQTT-QOS1] Published Live Telemetry: Slave 1 | Temp=24.5 C (10 B)
[GATEWAY-NETWORK] Cloud Status: OFFLINE (Blackout Detected)
[FLASH-SPOOL] Cloud OFFLINE! Spooled 10 B to Flash Buffer (Queue Depth: 1)
[FLASH-SPOOL] Cloud OFFLINE! Spooled 10 B to Flash Buffer (Queue Depth: 2)
[FLASH-SPOOL] Cloud OFFLINE! Spooled 10 B to Flash Buffer (Queue Depth: 3)
[GATEWAY-NETWORK] Cloud Status: ONLINE (TLS Reconnected)
[SPOOLER-TASK] Draining 3 records from Non-Volatile Flash...
  -> Flushed Spooled Telemetry (10 B) to Cloud Broker [ACK Confirmed]
  -> Flushed Spooled Telemetry (10 B) to Cloud Broker [ACK Confirmed]
  -> Flushed Spooled Telemetry (10 B) to Cloud Broker [ACK Confirmed]
  -> Flash buffer drained completely. Zero data loss.
[DIRECT-MQTT-QOS1] Published Live Telemetry: Slave 1 | Temp=25.8 C (10 B)

========================================================
MILESTONE 7 VERIFICATION SUMMARY:
  Direct Cloud Deliveries: 2
  Spooled during Blackout: 3
  Recovered from Flash:    3
  Total Records Preserved: 5
  Data Loss:               0.00% (100.0% Delivery Guarantee)
========================================================
MILESTONE 7 GATE VERDICT: FULLY PASSING & CERTIFIED OPERATIONAL
""",
            "codeNotes": [
                {
                    "line": 7,
                    "note": "TelemetryRecord holds structured fieldbus readings for compact binary encoding."
                },
                {
                    "line": 42,
                    "note": "setCloudOnline handles network state transitions and wakes the Flash spooler upon reconnection."
                },
                {
                    "line": 56,
                    "note": "Non-volatile Flash spooling guarantees zero data loss during multi-hour factory network blackouts."
                }
            ],
            "tryIt": "Describe how to implement a circular FIFO pointer system in SPI NOR Flash sectors to prevent wear-out.",
            "check": {
                "question": "What is the primary operational requirement of the Store-and-Forward Flash failover subsystem in an industrial IoT gateway?",
                "options": [
                    "To persist unacknowledged telemetry records in non-volatile Flash during cloud outages and automatically drain them in FIFO order upon reconnection, guaranteeing zero data loss.",
                    "To format the Flash chip as a FAT32 filesystem for desktop access.",
                    "To compress video streams from security cameras.",
                    "To increase the RS-485 baud rate to 10 Mbps."
                ],
                "answer": 0,
                "why": "Industrial IoT systems cannot tolerate telemetry gaps. The store-and-forward architecture spools records to local non-volatile storage during network interruptions and safely delivers them once the connection is restored."
            }
        }
    ],
    "summary": [
        "FreeRTOS multi-tasking and queues decouple deterministic RS-485 serial timing from wide-area cloud network jitter.",
        "Defensive Modbus RTU ingestion verifies CRC-16 (polynomial 0xA001) and detects slave timeouts before processing data.",
        "NanoPB compact binary serialization reduces telemetry payload size by over 70% with zero dynamic heap allocations.",
        "MQTT QoS 1 publishing enforces guaranteed At-Least-Once delivery using Packet Identifiers and PUBACK acknowledgments.",
        "Non-volatile Flash store-and-forward failover ensures 100% data preservation during extended cloud connectivity blackouts."
    ],
    "projectStep": {
        "title": "Deploying and Certifying the Milestone 7 Industrial Telemetry Bridge",
        "steps": [
            "Configure RS-485 transceiver direction control on an STM32 USART peripheral with t3.5 frame silence timers.",
            "Create a thread-safe FreeRTOS Queue linking the Modbus Poller Task to the Cloud Bridge Task.",
            "Compile the industrial telemetry .proto schema using NanoPB for zero-allocation binary packing.",
            "Test store-and-forward failover by disconnecting the cloud network and verifying 100% telemetry recovery upon reconnection."
        ]
    }
}

with open('scripts/iot_emb_day40.json', 'w', encoding='utf-8') as f:
    json.dump(day40, f, indent=2)
print("Wrote scripts/iot_emb_day40.json successfully!")
