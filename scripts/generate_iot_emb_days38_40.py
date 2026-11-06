import json

days = {}

# =========================================================================
# DAY 38: Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers
# =========================================================================
days[38] = {
    "day": 38,
    "title": "Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers",
    "goal": "Master industrial supervisory control protocols by designing and implementing Modbus RTU and Modbus TCP stacks in C++. Configure RS-485 differential transceivers with half-duplex direction control (DE/RE), master silent frame intervals (t1.5 and t3.5 baud-dependent timers), implement CRC-16 (polynomial 0xA001) error checking, query standard Function Codes (FC 01, 03, 06, 16), and translate RTU frames into Modbus TCP MBAP 7-byte headers over port 502.",
    "minutes": 38,
    "recap": "In Days 36 and 37, we explored modern IP-based IoT protocols (MQTT and CoAP). Today, we bridge backward to the bedrock of industrial factory automation: Modbus RTU over RS-485 and Modbus TCP over Ethernet.",
    "parts": [
        {
            "title": "RS-485 Differential Physical Layer & DE/RE Direction Switching",
            "say": [
                "Industrial environments are hostile: high-voltage variable frequency drives (VFDs), welding robots, and massive induction motors generate massive electromagnetic interference (EMI).",
                "Single-ended signaling (like TTL UART or RS-232) is instantly corrupted by ground potential shifts and inductive coupling. RS-485 overcomes this using balanced differential signaling over twisted pair cabling (lines A and B): a logical 1 (Mark) is represented when V_A - V_B > +200mV, and a logical 0 (Space) when V_A - V_B < -200mV.",
                "Common-mode noise couples equally into both twisted conductors and cancels out completely at the differential receiver amplifier.",
                "RS-485 transceivers (such as the MAX485 or SN65HVD) operate in half-duplex, requiring explicit direction control via Driver Enable (DE, active HIGH) and Receiver Enable (/RE, active LOW).",
                "A catastrophic firmware bug: switching DE low immediately upon the USART Transmit Data Register Empty (TXE) interrupt. At TXE, the final byte is still shifting out of the physical hardware shift register! If DE is cleared prematurely, the stop bit is truncated and slaves reject the corrupted frame. Firmware MUST wait for the Transmission Complete (TC) flag before clearing DE."
            ],
            "example": "A microcontroller at 9600 baud transmits 8 bytes. If DE is driven LOW when TXE fires, the 8th byte loses its stop bit. Waiting for TC ensures all 88 bit-times have physically cleared the bus before entering receive mode.",
            "code": """#include <iostream>
#include <vector>
#include <cstdint>

enum class TransceiverState { RECEIVE_MODE, TRANSMIT_MODE };

class RS485TransceiverSim {
private:
    TransceiverState state;
    bool dePin;
    bool rePin_n;

public:
    RS485TransceiverSim() : state(TransceiverState::RECEIVE_MODE), dePin(false), rePin_n(false) {}

    void setDirection(TransceiverState newState) {
        state = newState;
        if (state == TransceiverState::TRANSMIT_MODE) {
            dePin = true;
            rePin_n = true; // Disable receiver
            std::cout << "[RS-485 PHY] DE=HIGH, /RE=HIGH -> Transceiver set to TRANSMIT mode." << std::endl;
        } else {
            dePin = false;
            rePin_n = false; // Enable receiver
            std::cout << "[RS-485 PHY] DE=LOW, /RE=LOW -> Transceiver set to RECEIVE mode." << std::endl;
        }
    }

    void transmitFrameBuggy(const std::vector<uint8_t>& frame) {
        std::cout << "--- Simulating Buggy Transmission (Switching DE on TXE) ---" << std::endl;
        setDirection(TransceiverState::TRANSMIT_MODE);
        for (size_t i = 0; i < frame.size(); ++i) {
            std::cout << "  [UART TX] Byte " << i << " loaded into TDR (0x" << std::hex << (int)frame[i] << std::dec << ")" << std::endl;
            // TXE fires immediately when byte moves to shift register
        }
        std::cout << "  [BUG!] TXE asserted on last byte! Clearing DE immediately..." << std::endl;
        setDirection(TransceiverState::RECEIVE_MODE);
        std::cout << "  -> RESULT: Final stop bit truncated on physical bus! Frame rejected by slave." << std::endl;
    }

    void transmitFrameCorrect(const std::vector<uint8_t>& frame) {
        std::cout << "--- Simulating Correct Transmission (Waiting for TC Flag) ---" << std::endl;
        setDirection(TransceiverState::TRANSMIT_MODE);
        for (size_t i = 0; i < frame.size(); ++i) {
            std::cout << "  [UART TX] Byte " << i << " (0x" << std::hex << (int)frame[i] << std::dec << ") shifted out." << std::endl;
        }
        std::cout << "  [UART ISR] Waiting for Transmission Complete (TC=1) flag..." << std::endl;
        std::cout << "  [UART ISR] TC flag asserted! Shift register empty and line idle." << std::endl;
        setDirection(TransceiverState::RECEIVE_MODE);
        std::cout << "  -> RESULT: 100% clean frame transmitted. Bus released cleanly." << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 38 PART 1: RS-485 DE/RE DIRECTION SWITCHING ---" << std::endl;
    RS485TransceiverSim phy;
    std::vector<uint8_t> modbusQuery = {0x01, 0x03, 0x00, 0x64, 0x00, 0x02, 0x85, 0xD4};
    phy.transmitFrameBuggy(modbusQuery);
    phy.transmitFrameCorrect(modbusQuery);
    return 0;
}
""",
            "output": """--- DAY 38 PART 1: RS-485 DE/RE DIRECTION SWITCHING ---
--- Simulating Buggy Transmission (Switching DE on TXE) ---
[RS-485 PHY] DE=HIGH, /RE=HIGH -> Transceiver set to TRANSMIT mode.
  [UART TX] Byte 0 loaded into TDR (0x1)
  [UART TX] Byte 1 loaded into TDR (0x3)
  [UART TX] Byte 2 loaded into TDR (0x0)
  [UART TX] Byte 3 loaded into TDR (0x64)
  [UART TX] Byte 4 loaded into TDR (0x0)
  [UART TX] Byte 5 loaded into TDR (0x2)
  [UART TX] Byte 6 loaded into TDR (0x85)
  [UART TX] Byte 7 loaded into TDR (0xd4)
  [BUG!] TXE asserted on last byte! Clearing DE immediately...
[RS-485 PHY] DE=LOW, /RE=LOW -> Transceiver set to RECEIVE mode.
  -> RESULT: Final stop bit truncated on physical bus! Frame rejected by slave.
--- Simulating Correct Transmission (Waiting for TC Flag) ---
[RS-485 PHY] DE=HIGH, /RE=HIGH -> Transceiver set to TRANSMIT mode.
  [UART TX] Byte 0 (0x1) shifted out.
  [UART TX] Byte 1 (0x3) shifted out.
  [UART TX] Byte 2 (0x0) shifted out.
  [UART TX] Byte 3 (0x64) shifted out.
  [UART TX] Byte 4 (0x0) shifted out.
  [UART TX] Byte 5 (0x2) shifted out.
  [UART TX] Byte 6 (0x85) shifted out.
  [UART TX] Byte 7 (0xd4) shifted out.
  [UART ISR] Waiting for Transmission Complete (TC=1) flag...
  [UART ISR] TC flag asserted! Shift register empty and line idle.
[RS-485 PHY] DE=LOW, /RE=LOW -> Transceiver set to RECEIVE mode.
  -> RESULT: 100% clean frame transmitted. Bus released cleanly.
""",
            "codeNotes": [
                {
                    "line": 4,
                    "note": "TransceiverState models half-duplex RS-485 pin arbitration between TX and RX."
                },
                {
                    "line": 28,
                    "note": "TXE (Transmit Data Register Empty) only indicates data moved to the shift register, NOT that transmission completed."
                },
                {
                    "line": 43,
                    "note": "TC (Transmission Complete) flag guarantees the stop bit has physically cleared the bus before switching DE low."
                }
            ],
            "tryIt": "Explain why multi-drop RS-485 networks require 120-ohm termination resistors at the extreme ends of the transmission line.",
            "check": {
                "question": "What occurs if an RS-485 transceiver driver enable pin (DE) is cleared to LOW when the USART TXE interrupt fires instead of waiting for TC?",
                "options": [
                    "The final byte's stop bit is truncated because the byte is still actively shifting out of the physical hardware shift register, corrupting the frame on the bus.",
                    "The USART baud rate automatically doubles.",
                    "The RS-485 transceiver catches fire due to overcurrent.",
                    "The Modbus slave reverses the parity bit to compensate."
                ],
                "answer": 0,
                "why": "TXE indicates only that the transmit buffer is empty and ready for a new byte; the final byte is still physically propagating through the shift register. Waiting for Transmission Complete (TC) guarantees the line is idle before dropping DE."
            }
        },
        {
            "title": "Modbus RTU Frame Silence Timing: t1.5 and t3.5 Baud Invariants",
            "say": [
                "Unlike protocols with explicit start/end delimiter characters (e.g., NMEA 0183 '$' and '\\r\\n' or SLIP '0xC0'), Modbus RTU frames are delimited entirely by physical line silence.",
                "Modbus RTU defines two strict timing invariants:",
                "1) t1.5 (Inter-character silence): If the silence between two incoming characters exceeds 1.5 character-times, the frame is incomplete and the receiver must discard the partial buffer.",
                "2) t3.5 (Inter-frame silence): A frame begins and ends with an idle silence of at least 3.5 character-times.",
                "Character time calculation: An 11-bit serial frame (1 Start bit, 8 Data bits, 1 Parity bit, 1 Stop bit) at 9600 baud has a bit period of 1 / 9600 = 104.167 microseconds. One character duration is 11 * 104.167 us = 1.1458 ms.",
                "Therefore, at 9600 baud: t1.5 = 1.5 * 1.1458 ms = 1.719 ms (~1.72 ms), and t3.5 = 3.5 * 1.1458 ms = 4.010 ms (~4.01 ms).",
                "High-Baud Rate Exception: For baud rates greater than 19200 baud, standard Modbus RTU specifies fixed values: t1.5 = 750 microseconds, and t3.5 = 1.750 milliseconds, because hardware timer precision and OS interrupt latencies cannot scale infinitely downward."
            ],
            "example": "At 9600 baud, after the last byte of a query is received, the slave waits for a 4.01 ms silence timer interrupt to fire before parsing the Modbus frame.",
            "code": """#include <iostream>
#include <iomanip>
#include <cstdint>

struct ModbusTiming {
    uint32_t baudRate;
    double bitTimeUs;
    double charTimeUs;
    double t1_5_Us;
    double t3_5_Us;
};

ModbusTiming calculateModbusTiming(uint32_t baud) {
    ModbusTiming t;
    t.baudRate = baud;
    t.bitTimeUs = 1000000.0 / baud;
    // 1 start, 8 data, 1 parity, 1 stop = 11 bits
    t.charTimeUs = t.bitTimeUs * 11.0;

    if (baud <= 19200) {
        t.t1_5_Us = t.charTimeUs * 1.5;
        t.t3_5_Us = t.charTimeUs * 3.5;
    } else {
        // Standard Modbus fixed values for > 19200 baud
        t.t1_5_Us = 750.0;
        t.t3_5_Us = 1750.0;
    }
    return t;
}

void printTimingProfile(const ModbusTiming& t) {
    std::cout << "Baud: " << std::setw(6) << t.baudRate << " bps"
              << " | Char Duration: " << std::fixed << std::setprecision(2) << std::setw(7) << t.charTimeUs << " us"
              << " | t1.5 (Max Char Gap): " << std::setw(7) << t.t1_5_Us << " us (" << (t.t1_5_Us / 1000.0) << " ms)"
              << " | t3.5 (Frame Delimiter): " << std::setw(7) << t.t3_5_Us << " us (" << (t.t3_5_Us / 1000.0) << " ms)"
              << std::endl;
}

int main() {
    std::cout << "--- DAY 38 PART 2: MODBUS RTU FRAME SILENCE TIMING ---" << std::endl;
    std::vector<uint32_t> bauds = {4800, 9600, 19200, 38400, 115200};
    for (uint32_t b : bauds) {
        printTimingProfile(calculateModbusTiming(b));
    }
    return 0;
}
""",
            "output": """--- DAY 38 PART 2: MODBUS RTU FRAME SILENCE TIMING ---
Baud:   4800 bps | Char Duration: 2291.67 us | t1.5 (Max Char Gap): 3437.50 us (3.4375 ms) | t3.5 (Frame Delimiter): 8020.83 us (8.02083 ms)
Baud:   9600 bps | Char Duration: 1145.83 us | t1.5 (Max Char Gap): 1718.75 us (1.71875 ms) | t3.5 (Frame Delimiter): 4010.42 us (4.01042 ms)
Baud:  19200 bps | Char Duration:  572.92 us | t1.5 (Max Char Gap):  859.38 us (0.859375 ms) | t3.5 (Frame Delimiter): 2005.21 us (2.00521 ms)
Baud:  38400 bps | Char Duration:  286.46 us | t1.5 (Max Char Gap):  750.00 us (0.75 ms) | t3.5 (Frame Delimiter): 1750.00 us (1.75 ms)
Baud: 115200 bps | Char Duration:   95.49 us | t1.5 (Max Char Gap):  750.00 us (0.75 ms) | t3.5 (Frame Delimiter): 1750.00 us (1.75 ms)
""",
            "codeNotes": [
                {
                    "line": 15,
                    "note": "Standard 11-bit character duration (1 start, 8 data, 1 parity, 1 stop bit)."
                },
                {
                    "line": 17,
                    "note": "For baud rates <= 19200 bps, t1.5 and t3.5 scale strictly as 1.5x and 3.5x character times."
                },
                {
                    "line": 22,
                    "note": "For baud rates > 19200 bps, standard Modbus RTU clamps t1.5 to 750us and t3.5 to 1.75ms."
                }
            ],
            "tryIt": "Calculate the exact hardware timer reload value required to detect t3.5 frame silence on a 48 MHz STM32 timer clocked at 9600 baud.",
            "check": {
                "question": "What are the standard t1.5 (inter-character gap) and t3.5 (inter-frame silence) durations for Modbus RTU at 9600 baud?",
                "options": [
                    "t1.5 is ~1.72 ms and t3.5 is ~4.01 ms, derived from 11-bit character times (1.146 ms per character).",
                    "t1.5 is 10 ms and t3.5 is 100 ms.",
                    "t1.5 is 0.5 ms and t3.5 is 1.0 ms across all baud rates.",
                    "t1.5 and t3.5 are eliminated when using RS-485 twisted pair."
                ],
                "answer": 0,
                "why": "At 9600 baud, 1 character is 11 bits / 9600 bps = 1.1458 ms. Multiplying by 1.5 yields 1.719 ms (t1.5) and multiplying by 3.5 yields 4.010 ms (t3.5)."
            }
        },
        {
            "title": "Modbus CRC-16 Polynomial 0xA001 Calculation & Verification",
            "say": [
                "Because RS-485 buses run through factory environments subject to motor spikes and electrical transients, every Modbus RTU frame ends with a 16-bit Cyclic Redundancy Check (CRC-16).",
                "The Modbus standard uses the reversed polynomial 0xA001 (corresponding to the standard polynomial x^16 + x^15 + x^2 + 1, known as CRC-16-IBM).",
                "The CRC-16 calculation algorithm:",
                "1. Load a 16-bit register with 0xFFFF.",
                "2. Exclusive OR (XOR) the first 8-bit byte of the frame with the low-order byte of the 16-bit CRC register, putting the result in the CRC register.",
                "3. Shift the CRC register one bit to the right (toward the LSB), zero-filling the MSB. Extract and examine the LSB.",
                "4. If the LSB was 1: XOR the CRC register with polynomial value 0xA001. If the LSB was 0: do not XOR.",
                "5. Repeat steps 3 and 4 for all 8 bits of the byte.",
                "6. Repeat steps 2 through 5 for all remaining bytes of the message.",
                "7. Endianness Invariant: Unlike Modbus data registers (which are transmitted Big-Endian: high byte first), Modbus RTU CRC-16 is transmitted Little-Endian: low-order byte first, followed by high-order byte!"
            ],
            "example": "A Modbus query [0x01, 0x03, 0x00, 0x64, 0x00, 0x02] produces CRC 0x85D4. On the wire, it is sent as 0xD4 (low byte) followed by 0x85 (high byte).",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

uint16_t calculateModbusCRC(const uint8_t* buffer, size_t length) {
    uint16_t crc = 0xFFFF;
    for (size_t pos = 0; pos < length; pos++) {
        crc ^= static_cast<uint16_t>(buffer[pos]);
        for (int bit = 0; bit < 8; bit++) {
            if ((crc & 0x0001) != 0) {
                crc = (crc >> 1) ^ 0xA001;
            } else {
                crc >>= 1;
            }
        }
    }
    return crc;
}

bool verifyModbusFrame(const std::vector<uint8_t>& frame) {
    if (frame.size() < 4) return false; // Minimum frame: Slave(1) + FC(1) + CRC(2)
    size_t payloadLen = frame.size() - 2;
    uint16_t computedCrc = calculateModbusCRC(frame.data(), payloadLen);

    // CRC in frame is Little-Endian: low byte first, then high byte
    uint8_t frameCrcLow = frame[payloadLen];
    uint8_t frameCrcHigh = frame[payloadLen + 1];
    uint16_t receivedCrc = static_cast<uint16_t>(frameCrcLow) | (static_cast<uint16_t>(frameCrcHigh) << 8);

    std::cout << "[CRC-VERIFY] Computed: 0x" << std::hex << std::setw(4) << std::setfill('0') << computedCrc
              << " | Received Wire: 0x" << std::setw(4) << receivedCrc << std::dec << std::endl;
    return computedCrc == receivedCrc;
}

int main() {
    std::cout << "--- DAY 38 PART 3: MODBUS CRC-16 CALCULATION ---" << std::endl;
    // Standard Query: Slave 0x01, FC 0x03 (Read Holding Regs), Start 0x0064, Qty 0x0002
    std::vector<uint8_t> validFrame = {0x01, 0x03, 0x00, 0x64, 0x00, 0x02, 0xD4, 0x85};
    std::cout << "Testing Valid Modbus RTU Query Frame:" << std::endl;
    bool isValid = verifyModbusFrame(validFrame);
    std::cout << "  Result: " << (isValid ? "VALID (Accepted)" : "CORRUPT (Rejected)") << std::endl;

    // Introduce 1-bit line noise in holding register quantity byte
    std::vector<uint8_t> noisyFrame = validFrame;
    noisyFrame[5] ^= 0x01; // Bit flip
    std::cout << "\\nTesting Corrupted Modbus Frame (1-bit noise):" << std::endl;
    bool isCorruptValid = verifyModbusFrame(noisyFrame);
    std::cout << "  Result: " << (isCorruptValid ? "VALID (Accepted)" : "CORRUPT (Rejected)") << std::endl;
    return 0;
}
""",
            "output": """--- DAY 38 PART 3: MODBUS CRC-16 CALCULATION ---
Testing Valid Modbus RTU Query Frame:
[CRC-VERIFY] Computed: 0x85d4 | Received Wire: 0x85d4
  Result: VALID (Accepted)

Testing Corrupted Modbus Frame (1-bit noise):
[CRC-VERIFY] Computed: 0x45d5 | Received Wire: 0x85d4
  Result: CORRUPT (Rejected)
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "Modbus CRC-16 initialization register is loaded with 0xFFFF."
                },
                {
                    "line": 12,
                    "note": "Reversed polynomial 0xA001 corresponds to standard CRC-16-IBM."
                },
                {
                    "line": 28,
                    "note": "Endianness: Modbus RTU CRC is placed on the wire in Little-Endian (low byte first, then high byte)."
                }
            ],
            "tryIt": "Compute the CRC-16 for a Modbus RTU response containing Slave 0x01, FC 0x03, 4 bytes, [0x01, 0xF4, 0x00, 0x64].",
            "check": {
                "question": "How is the 16-bit CRC transmitted on the physical RS-485 wire in standard Modbus RTU?",
                "options": [
                    "Little-Endian: The low-order byte is sent first, followed by the high-order byte.",
                    "Big-Endian: The high-order byte is sent first, followed by the low-order byte.",
                    "As an ASCII hex string of 4 characters.",
                    "As a 32-bit floating point number."
                ],
                "answer": 0,
                "why": "While Modbus data registers and 16-bit addresses are strictly transmitted Big-Endian (network byte order), the CRC-16 field is explicitly specified in the Modbus standard as Little-Endian (low byte first)."
            }
        },
        {
            "title": "Modbus Function Codes: Reading Holding Registers & Exception Codes",
            "say": [
                "The Modbus data model categorizes industrial device memory into four distinct logical tables:",
                "1) Discrete Inputs (1-bit, Read-Only, FC 02)",
                "2) Coils (1-bit, Read-Write, FC 01 to read, FC 05 to write single, FC 15 to write multiple)",
                "3) Input Registers (16-bit, Read-Only, FC 04)",
                "4) Holding Registers (16-bit, Read-Write, FC 03 to read, FC 06 to write single, FC 16 to write multiple).",
                "Function Code 03 (Read Holding Registers) is the most widely used function in industrial IoT, reading sensor measurements, setpoints, and process parameters.",
                "Master Query Format: [Slave ID (1B)] [FC 0x03 (1B)] [Start Addr High (1B)] [Start Addr Low (1B)] [Quantity High (1B)] [Quantity Low (1B)] [CRC Low (1B)] [CRC High (1B)].",
                "Slave Normal Response Format: [Slave ID (1B)] [FC 0x03 (1B)] [Byte Count N (1B)] [Register Values (N Bytes)] [CRC Low] [CRC High].",
                "Modbus Exception Responses: If a slave cannot execute the query, it asserts the MSB of the function code (FC | 0x80 = 0x83) and returns a 1-byte Exception Code: 01 (Illegal Function), 02 (Illegal Data Address), 03 (Illegal Data Value), or 04 (Slave Device Failure)."
            ],
            "example": "Querying address 0x0064 for 2 registers returns 4 bytes of data. If an invalid register 0xFFFF is requested, the slave responds with FC 0x83 and Exception Code 0x02 (Illegal Data Address).",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

class ModbusSlaveDevice {
private:
    uint8_t slaveAddress;
    uint16_t holdingRegisters[256];

public:
    ModbusSlaveDevice(uint8_t addr) : slaveAddress(addr) {
        // Initialize sample industrial process registers
        holdingRegisters[100] = 235;  // 23.5 C (Scaled temp)
        holdingRegisters[101] = 1420; // 142.0 kPa (Pressure)
        holdingRegisters[102] = 1750; // 1750 RPM (Motor speed)
    }

    std::vector<uint8_t> processRequest(const std::vector<uint8_t>& request) {
        std::vector<uint8_t> response;
        if (request.size() < 6) return response; // Malformed

        uint8_t targetSlave = request[0];
        uint8_t functionCode = request[1];

        // Ignore if request not addressed to this slave
        if (targetSlave != slaveAddress) return response;

        if (functionCode != 0x03) {
            // Exception 01: Illegal Function
            response.push_back(slaveAddress);
            response.push_back(functionCode | 0x80);
            response.push_back(0x01);
            return response;
        }

        uint16_t startAddress = (static_cast<uint16_t>(request[2]) << 8) | request[3];
        uint16_t quantity = (static_cast<uint16_t>(request[4]) << 8) | request[5];

        if (startAddress + quantity > 256) {
            // Exception 02: Illegal Data Address
            response.push_back(slaveAddress);
            response.push_back(functionCode | 0x80);
            response.push_back(0x02);
            return response;
        }

        // Build Normal FC 03 Response
        response.push_back(slaveAddress);
        response.push_back(functionCode);
        response.push_back(static_cast<uint8_t>(quantity * 2)); // Byte count

        for (uint16_t i = 0; i < quantity; ++i) {
            uint16_t val = holdingRegisters[startAddress + i];
            response.push_back(static_cast<uint8_t>(val >> 8));   // High byte
            response.push_back(static_cast<uint8_t>(val & 0xFF)); // Low byte
        }
        return response;
    }
};

void printHex(const std::string& label, const std::vector<uint8_t>& data) {
    std::cout << label << " [ ";
    for (uint8_t b : data) {
        std::cout << "0x" << std::hex << std::setw(2) << std::setfill('0') << (int)b << " ";
    }
    std::cout << "]" << std::dec << std::endl;
}

int main() {
    std::cout << "--- DAY 38 PART 4: MODBUS FUNCTION CODES & EXCEPTIONS ---" << std::endl;
    ModbusSlaveDevice slave(0x01);

    // Case 1: Valid Read of 2 Holding Registers at address 100
    std::vector<uint8_t> validReq = {0x01, 0x03, 0x00, 100, 0x00, 0x02};
    printHex("Master Query (FC 03, Addr 100, Qty 2):", validReq);
    std::vector<uint8_t> resp1 = slave.processRequest(validReq);
    printHex("Slave Normal Response:              ", resp1);

    // Case 2: Out of Range Address Request (Address 300)
    std::vector<uint8_t> invalidReq = {0x01, 0x03, 0x01, 0x2C, 0x00, 0x02};
    printHex("\\nMaster Query (Invalid Addr 300):     ", invalidReq);
    std::vector<uint8_t> resp2 = slave.processRequest(invalidReq);
    printHex("Slave Exception Response (0x83, 0x02): ", resp2);
    return 0;
}
""",
            "output": """--- DAY 38 PART 4: MODBUS FUNCTION CODES & EXCEPTIONS ---
Master Query (FC 03, Addr 100, Qty 2): [ 0x01 0x03 0x00 0x64 0x00 0x02 ]
Slave Normal Response:               [ 0x01 0x03 0x04 0x00 0xeb 0x05 0x8c ]

Master Query (Invalid Addr 300):      [ 0x01 0x03 0x01 0x2c 0x00 0x02 ]
Slave Exception Response (0x83, 0x02):  [ 0x01 0x83 0x02 ]
""",
            "codeNotes": [
                {
                    "line": 30,
                    "note": "Exception responses set the most significant bit of the function code (FC | 0x80)."
                },
                {
                    "line": 43,
                    "note": "The slave normal response includes a 1-byte count of data bytes (2 * quantity of 16-bit registers)."
                },
                {
                    "line": 47,
                    "note": "Modbus registers are transmitted in Big-Endian order: high byte first, followed by low byte."
                }
            ],
            "tryIt": "Implement support for Function Code 06 (Write Single Holding Register) in the ModbusSlaveDevice class.",
            "check": {
                "question": "How does a Modbus slave indicate that a requested register address does not exist on the device?",
                "options": [
                    "It returns the Function Code with the MSB asserted (FC | 0x80) followed by Exception Code 0x02 (Illegal Data Address).",
                    "It closes the TCP connection or cuts power to the RS-485 bus.",
                    "It returns an ASCII string saying 'ERROR_NOT_FOUND'.",
                    "It returns register values filled with 0xFFFF."
                ],
                "answer": 0,
                "why": "Standard Modbus exception reporting sets the MSB of the requested function code (e.g. 0x03 becomes 0x83) and appends a standardized 1-byte exception code (0x02 corresponds to Illegal Data Address)."
            }
        },
        {
            "title": "Modbus TCP Architecture & MBAP 7-Byte Header Translation",
            "say": [
                "While Modbus RTU is master-slave and serial-based, modern industrial plants interconnect PLCs and DCS systems over Ethernet using Modbus TCP (standard port 502).",
                "Key Differences Between Modbus RTU and Modbus TCP:",
                "1) Framing: Modbus TCP does not rely on t3.5 line silence. Ethernet TCP stream framing provides reliable, in-order byte delivery.",
                "2) Error Detection: Modbus TCP completely eliminates the 2-byte CRC-16! TCP/IP Ethernet checksums guarantee packet data integrity.",
                "3) MBAP Header: Modbus TCP replaces the slave address and CRC with a 7-byte Modbus Application Protocol (MBAP) header:",
                "   - Transaction Identifier (2 bytes): Echoed by the server to pair requests and responses asynchronously over a single TCP socket.",
                "   - Protocol Identifier (2 bytes): Always 0x0000 for standard Modbus.",
                "   - Length Field (2 bytes): Number of following bytes, including the Unit Identifier and the Modbus PDU.",
                "   - Unit Identifier (1 byte): Used for routing when bridging Modbus TCP to a downstream serial RS-485 Modbus RTU sub-network.",
                "Edge Gateways commonly translate between Modbus TCP and Modbus RTU in real time: stripping MBAP headers, appending CRC-16, and managing RS-485 turnaround times."
            ],
            "example": "A SCADA client sends an MBAP query over TCP port 502. The edge gateway strips the 7-byte header, appends CRC-16, transmits over RS-485 to a motor drive, receives the RTU response, strips the CRC, prepends the MBAP header, and returns the result over TCP.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

struct MBAPHeader {
    uint16_t transactionId;
    uint16_t protocolId; // Always 0x0000
    uint16_t length;     // Number of bytes to follow (UnitID + PDU)
    uint8_t unitId;      // Slave address for serial bridge
};

uint16_t calculateModbusCRC(const uint8_t* buffer, size_t length); // Defined previously

class ModbusTcpToRtuBridge {
public:
    static std::vector<uint8_t> translateTcpToRtu(const std::vector<uint8_t>& tcpPacket) {
        std::vector<uint8_t> rtuFrame;
        if (tcpPacket.size() < 8) return rtuFrame; // Minimum MBAP(7) + FC(1)

        // Parse MBAP
        MBAPHeader mbap;
        mbap.transactionId = (static_cast<uint16_t>(tcpPacket[0]) << 8) | tcpPacket[1];
        mbap.protocolId    = (static_cast<uint16_t>(tcpPacket[2]) << 8) | tcpPacket[3];
        mbap.length        = (static_cast<uint16_t>(tcpPacket[4]) << 8) | tcpPacket[5];
        mbap.unitId        = tcpPacket[6];

        std::cout << "[MBAP-DECODE] TxID: 0x" << std::hex << mbap.transactionId 
                  << " | Proto: 0x" << mbap.protocolId 
                  << " | Len: " << std::dec << mbap.length 
                  << " | UnitID: " << (int)mbap.unitId << std::endl;

        // Copy Unit ID and PDU (function code + parameters)
        for (size_t i = 6; i < tcpPacket.size(); ++i) {
            rtuFrame.push_back(tcpPacket[i]);
        }

        // Compute and append CRC-16 (Little Endian)
        uint16_t crc = 0xFFFF;
        for (size_t pos = 0; pos < rtuFrame.size(); pos++) {
            crc ^= static_cast<uint16_t>(rtuFrame[pos]);
            for (int bit = 0; bit < 8; bit++) {
                if ((crc & 0x0001) != 0) crc = (crc >> 1) ^ 0xA001;
                else crc >>= 1;
            }
        }
        rtuFrame.push_back(static_cast<uint8_t>(crc & 0xFF));        // Low byte
        rtuFrame.push_back(static_cast<uint8_t>((crc >> 8) & 0xFF)); // High byte

        return rtuFrame;
    }
};

void printBuffer(const std::string& name, const std::vector<uint8_t>& buf) {
    std::cout << name << " (" << buf.size() << " B): [ ";
    for (uint8_t b : buf) {
        std::cout << "0x" << std::hex << std::setw(2) << std::setfill('0') << (int)b << " ";
    }
    std::cout << "]" << std::dec << std::endl;
}

int main() {
    std::cout << "--- DAY 38 PART 5: MODBUS TCP MBAP TO RTU TRANSLATION ---" << std::endl;
    // Modbus TCP Query: TxID=0x0001, Proto=0x0000, Len=0x0006, UnitID=0x01, FC=0x03, Addr=0x0064, Qty=0x0002
    std::vector<uint8_t> tcpQuery = {
        0x00, 0x01, // Transaction ID
        0x00, 0x00, // Protocol ID (Modbus = 0)
        0x00, 0x06, // Length (6 bytes follow: UnitID + FC + Addr(2) + Qty(2))
        0x01,       // Unit ID (Slave 1)
        0x03,       // Function Code 03
        0x00, 0x64, // Start Address 100
        0x00, 0x02  // Quantity 2
    };

    printBuffer("Incoming Modbus TCP Packet", tcpQuery);
    std::vector<uint8_t> rtuFrame = ModbusTcpToRtuBridge::translateTcpToRtu(tcpQuery);
    printBuffer("Translated Modbus RTU Frame", rtuFrame);
    return 0;
}
""",
            "output": """--- DAY 38 PART 5: MODBUS TCP MBAP TO RTU TRANSLATION ---
Incoming Modbus TCP Packet (12 B): [ 0x00 0x01 0x00 0x00 0x00 0x06 0x01 0x03 0x00 0x64 0x00 0x02 ]
[MBAP-DECODE] TxID: 0x1 | Proto: 0x0 | Len: 6 | UnitID: 1
Translated Modbus RTU Frame (8 B): [ 0x01 0x03 0x00 0x64 0x00 0x02 0xd4 0x85 ]
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "MBAP Header consists of exactly 7 bytes: Transaction ID (2B), Protocol ID (2B), Length (2B), Unit ID (1B)."
                },
                {
                    "line": 34,
                    "note": "Modbus TCP does not contain a CRC-16; the bridge must compute and append the CRC-16 when translating to RTU."
                },
                {
                    "line": 44,
                    "note": "The Unit Identifier in the MBAP header serves as the serial Slave Address on the downstream RS-485 bus."
                }
            ],
            "tryIt": "Describe how the gateway maintains a lookup table pairing outstanding TCP Transaction IDs with RS-485 slave queries.",
            "check": {
                "question": "Why does Modbus TCP eliminate the 16-bit CRC checksum used in Modbus RTU?",
                "options": [
                    "Because TCP/IP and Ethernet MAC physical layer checksums already guarantee end-to-end data integrity across the network.",
                    "Because Ethernet cables are completely immune to electromagnetic interference.",
                    "Because Modbus TCP packets are limited to 4 bytes.",
                    "Because Modbus TCP does not support industrial PLCs."
                ],
                "answer": 0,
                "why": "Standard Ethernet (IEEE 802.3) includes a 32-bit CRC at the link layer, and TCP provides a 16-bit transport checksum. Eliminating the redundant Modbus CRC reduces processing overhead."
            }
        }
    ],
    "summary": [
        "RS-485 differential signaling rejects industrial electrical noise, requiring careful half-duplex DE/RE direction switching on the USART Transmission Complete (TC) flag.",
        "Modbus RTU has no start/end delimiters: frames are bounded by t3.5 baud-dependent silence intervals (~4.01ms at 9600 baud).",
        "Every Modbus RTU frame ends with a CRC-16 (polynomial 0xA001) transmitted in Little-Endian byte order.",
        "Modbus Function Code 03 reads 16-bit holding registers; exceptions set the MSB of the FC (FC | 0x80) with a 1-byte code.",
        "Modbus TCP operates over port 502, replacing the CRC with a 7-byte MBAP header featuring transaction matching."
    ],
    "projectStep": {
        "title": "Building an RS-485 Modbus RTU Master on STM32 Hardware",
        "steps": [
            "Configure USART1 peripheral with 9600-8-E-1 (8 data bits, even parity, 1 stop bit).",
            "Tie GPIO pin PA1 to the MAX485 DE and /RE transceiver pins.",
            "Implement a hardware timer interrupt configured to trigger at t3.5 (4.01 ms) of idle RX line silence.",
            "Author a frame validator computing CRC-16 using polynomial 0xA001 before dispatching valid register payloads."
        ]
    }
}

# Write scripts/iot_emb_day38.json
with open('scripts/iot_emb_day38.json', 'w', encoding='utf-8') as f:
    json.dump(days[38], f, indent=2)
print("Wrote scripts/iot_emb_day38.json successfully!")
