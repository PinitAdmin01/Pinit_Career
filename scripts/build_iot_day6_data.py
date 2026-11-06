import json
import hashlib
import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from visuals.iot_spec_m1 import IOT_M1_PART1

# Days 6 to 10 full definition
DAYS_DATA = [
    {
        "day": 6,
        "title": "Universal Asynchronous Receiver-Transmitter (UART): Baud Rates, Oversampling & Line Noise",
        "goal": "Confront asynchronous communication physics: master Universal Asynchronous Receiver-Transmitter (UART/USART). Understand how two devices communicate without a shared clock wire by agreeing on exact baud rates (115200, 921600 bps). Calculate the fractional Baud Rate Register (BRR) divisor from peripheral bus clock frequencies. Analyze receiver oversampling (16x and 8x): start bit detection via falling edge transitions, majority voting across sample pulses, and how a 2.5% clock drift between transmitter and receiver causes catastrophic framing errors and bit corruption.",
        "minutes": 36,
        "recap": "In Day 5, we mastered embedded IoT wireless networking, BLE GATT profiles, low-power mesh networking, and cryptographic OTA firmware updates. Today in Day 6, we begin Block 2: Serial Communications & Hardware Buses by mastering bare-metal UART physics.",
        "parts": [
            {
                "title": "Asynchronous Framing Physics & Baud Rate Generator Math",
                "say": [
                    "Welcome to Day 6! In modern embedded systems, Universal Asynchronous Receiver-Transmitter (UART) is the universal umbilical cord connecting microcontrollers to host consoles, cellular modems, and GPS receivers.",
                    "Unlike synchronous protocols like SPI or I2C that dedicate a physical wire to a shared clock signal, UART is completely asynchronous: it relies exclusively on pre-shared timing agreements between transmitter and receiver.",
                    "A standard UART frame begins with an idle HIGH line (Mark state), drops LOW for exactly one bit period to signal the Start bit (Space state), transmits 5 to 8 data bits (least significant bit first), includes an optional parity bit, and concludes with 1 or 2 stop bits.",
                    "The hardware generates this precise timing using a dedicated Baud Rate Register (USART_BRR) that divides the peripheral bus clock (e.g., APB1 at 42MHz or APB2 at 84MHz) down to the target baud frequency.",
                    "If the calculated divisor has a fractional truncation error exceeding 2.5%, the cumulative sampling drift over a 10-bit frame will cause the receiver to sample directly on bit transition edges, creating catastrophic framing errors and data corruption."
                ],
                "example": "Calculating the USART_BRR register value for 115,200 baud on a 16MHz APB peripheral clock: Divisor = 16,000,000 / (16 * 115,200) = 8.6805. The integer part is 8 (0x08), and the fractional part is round(0.6805 * 16) = 11 (0x0B), producing BRR = 0x008B.",
                "code": """#include <iostream>
#include <cstdint>
#include <iomanip>

struct UartBaudCalculator {
    static uint32_t computeBRR(uint32_t pclk, uint32_t baud) {
        // Standard 16x oversampling: BRR = pclk / baud
        // Fixed-point calculation with rounding
        uint32_t div = (2 * pclk + baud) / (2 * baud);
        return div;
    }

    static double computeActualBaud(uint32_t pclk, uint32_t brr) {
        return static_cast<double>(pclk) / brr;
    }
};

int main() {
    uint32_t pclk = 16000000; // 16 MHz
    uint32_t targetBaud = 115200;
    uint32_t brr = UartBaudCalculator::computeBRR(pclk, targetBaud);
    double actualBaud = UartBaudCalculator::computeActualBaud(pclk, brr);
    double errorPct = ((actualBaud - targetBaud) / targetBaud) * 100.0;

    std::cout << "Target Baud: " << targetBaud << "\\n";
    std::cout << "Computed BRR: 0x" << std::hex << std::uppercase << brr << std::dec << " (" << brr << ")\\n";
    std::cout << "Actual Baud: " << std::fixed << std::setprecision(1) << actualBaud << "\\n";
    std::cout << "Error: " << std::setprecision(2) << errorPct << "% (Tolerance < 2.5%)\\n";
    return 0;
}""",
                "output": """Target Baud: 115200
Computed BRR: 0x8B (139)
Actual Baud: 115107.9
Error: -0.08% (Tolerance < 2.5%)""",
                "codeNotes": [
                    { "line": 5, "note": "Computes integer and fractional divisor using fixed-point arithmetic with rounding" },
                    { "line": 23, "note": "BRR value 0x8B sets 8 mantissa bits and 11 fractional bits on Cortex-M USART" },
                    { "line": 25, "note": "Achieves -0.08% error, well within the strict 2.5% cumulative timing budget" }
                ],
                "tryIt": "Recalculate the BRR register for a 42MHz APB1 clock at 921,600 baud and verify whether the error percentage exceeds 2.5%.",
                "check": {
                    "question": "What is the maximum allowable cumulative clock drift between a UART transmitter and receiver over a standard 10-bit frame?",
                    "options": [
                        "Strictly below 2.5% to ensure the receiver samples near the center of the 10th bit rather than on transition boundaries.",
                        "Up to 15% because UART automatically synchronizes on every individual data bit edge.",
                        "Exactly 0.00% because microcontrollers cannot tolerate any frequency discrepancy.",
                        "50% because stop bits reset the internal clock phase completely."
                    ],
                    "answer": 0,
                    "why": "Over a 10-bit frame (1 start, 8 data, 1 stop), a 2.5% drift shifts the sampling point by 25% of a bit width; any greater drift risks sampling during unstable rise/fall transitions."
                }
            },
            {
                "title": "Start Bit Detection & 16x Hardware Oversampling Physics",
                "say": [
                    "Because UART lacks a shared clock line, the receiver must synthesize an internal sampling clock that locks onto the incoming asynchronous bitstream.",
                    "The receiver hardware achieves this by clocking its internal shift register at 16 times the negotiated baud rate (16x oversampling).",
                    "While the bus is idle in the Mark state (logic HIGH), the receiver continuously samples the RX line looking for a 1-to-0 falling edge transition.",
                    "When a falling edge is detected, the receiver starts an internal 16-tick counter: if samples 3, 4, and 5 are confirmed LOW via majority voting (at least 2 out of 3 samples zero), a valid Start bit is confirmed.",
                    "The hardware then resets its counter to sample subsequent data bits precisely at ticks 7, 8, and 9—the exact mathematical center of each bit period where electrical signal levels are most stable."
                ],
                "example": "A 16x oversampling engine rejects a 2-tick electrical noise glitch on the RX pin because samples 3, 4, and 5 do not confirm a persistent LOW start bit.",
                "code": """#include <iostream>
#include <cstdint>

struct UartOversampler {
    static bool validateStartBit(const uint8_t samples[16]) {
        // Samples 3, 4, and 5 must be evaluated via majority voting
        int lowCount = 0;
        if (samples[3] == 0) lowCount++;
        if (samples[4] == 0) lowCount++;
        if (samples[5] == 0) lowCount++;
        return lowCount >= 2;
    }

    static uint8_t sampleDataBit(const uint8_t samples[16]) {
        // Majority voting at center pulses: 7, 8, 9
        int highCount = 0;
        if (samples[7] == 1) highCount++;
        if (samples[8] == 1) highCount++;
        if (samples[9] == 1) highCount++;
        return (highCount >= 2) ? 1 : 0;
    }
};

int main() {
    // Simulated 16x samples for a valid start bit
    uint8_t startSamples[16] = {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    // Simulated 16x samples with center noise on data bit: 1, 0, 1 -> majority 1
    uint8_t dataSamples[16] = {0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0};

    bool startOk = UartOversampler::validateStartBit(startSamples);
    uint8_t bitVal = UartOversampler::sampleDataBit(dataSamples);

    std::cout << "Start Bit Valid: " << (startOk ? "TRUE" : "FALSE") << "\\n";
    std::cout << "Center Majority Bit: " << static_cast<int>(bitVal) << "\\n";
    std::cout << "Noise Resilience: 3-pulse voting filtered single-tick glitch\\n";
    return 0;
}""",
                "output": """Start Bit Valid: TRUE
Center Majority Bit: 1
Noise Resilience: 3-pulse voting filtered single-tick glitch""",
                "codeNotes": [
                    { "line": 4, "note": "Validates falling edge by evaluating center start bit samples 3, 4, and 5" },
                    { "line": 13, "note": "Majority voting at ticks 7, 8, 9 ensures high immunity against electromagnetic line noise" },
                    { "line": 28, "note": "Reconstructs correct logic 1 despite transient bit-flip at tick 8" }
                ],
                "tryIt": "Simulate a noise spike where sample 4 is logic 1 and verify that 2-out-of-3 majority voting still accepts the start bit.",
                "check": {
                    "question": "Why does a 16x oversampling UART receiver sample data bits at ticks 7, 8, and 9?",
                    "options": [
                        "Because ticks 7, 8, and 9 represent the mathematical center of the bit period where the analog signal has stabilized.",
                        "Because ticks 1 through 6 are reserved for parity bit checksum calculation.",
                        "Because microcontrollers can only read GPIO pins when the timer counter equals an odd number.",
                        "Because sampling at tick 0 would cause a hardware interrupt storm."
                    ],
                    "answer": 0,
                    "why": "Sampling at the center (ticks 7, 8, 9) maximizes tolerance against rise-time distortion, capacitive slew rates, and clock drift."
                }
            },
            {
                "title": "Interrupt-Driven Ring Buffered UART Reception",
                "say": [
                    "In production firmware, polling the UART status register in a tight while loop (blocking I/O) is strictly forbidden because it starves the CPU of compute cycles.",
                    "If the microcontroller is busy executing a motor control loop when a byte arrives, the UART Data Register (DR) will be overwritten by the next incoming byte, causing an Overrun Error (ORE).",
                    "To guarantee zero byte loss, embedded architectures configure the UART Receive Not Empty (RXNE) interrupt coupled with a lock-free circular FIFO ring buffer.",
                    "When the hardware shifts in the final stop bit, the RXNE flag asserts and immediately vectors the CPU into the USART Interrupt Service Routine (ISR).",
                    "The ISR reads the character from the hardware register into the RAM ring buffer in less than 30 assembly instructions, clearing the interrupt and leaving main application tasks unblocked."
                ],
                "example": "A circular FIFO buffer storing incoming telemetry packets: the head pointer advances on RXNE interrupts while the tail pointer advances in user space.",
                "code": """#include <iostream>
#include <cstdint>

template <size_t SIZE>
class UartRingBuffer {
private:
    uint8_t buffer_[SIZE];
    volatile size_t head_{0};
    volatile size_t tail_{0};

public:
    bool pushFromISR(uint8_t byte) {
        size_t nextHead = (head_ + 1) % SIZE;
        if (nextHead == tail_) {
            return false; // Buffer overflow!
        }
        buffer_[head_] = byte;
        head_ = nextHead;
        return true;
    }

    bool pop(uint8_t& byte) {
        if (head_ == tail_) {
            return false; // Buffer empty
        }
        byte = buffer_[tail_];
        tail_ = (tail_ + 1) % SIZE;
        return true;
    }

    size_t count() const {
        return (head_ >= tail_) ? (head_ - tail_) : (SIZE - tail_ + head_);
    }
};

int main() {
    UartRingBuffer<16> rxQueue;

    // Simulate ISR receiving 4 bytes of GPS NMEA sentence: "$GPG"
    rxQueue.pushFromISR('$');
    rxQueue.pushFromISR('G');
    rxQueue.pushFromISR('P');
    rxQueue.pushFromISR('G');

    std::cout << "Buffered Bytes: " << rxQueue.count() << "\\n";
    std::cout << "Popped Stream: ";
    uint8_t ch;
    while (rxQueue.pop(ch)) {
        std::cout << static_cast<char>(ch);
    }
    std::cout << "\\nZero-Overrun Invariant: Lock-free ring buffer decouples hardware ISR from processing loop.\\n";
    return 0;
}""",
                "output": """Buffered Bytes: 4
Popped Stream: $GPG
Zero-Overrun Invariant: Lock-free ring buffer decouples hardware ISR from processing loop.""",
                "codeNotes": [
                    { "line": 8, "note": "Head and tail pointers declared volatile to prevent compiler register caching across ISR boundaries" },
                    { "line": 13, "note": "Lock-free single-producer single-consumer circular buffer requires no mutex or critical section" },
                    { "line": 22, "note": "User task pops buffered bytes asynchronously without stalling incoming serial transfers" }
                ],
                "tryIt": "Test what happens if the ring buffer fills to capacity (push 16 bytes into a size-16 buffer) and verify that pushFromISR returns false.",
                "check": {
                    "question": "Why are the head and tail indices of an embedded ring buffer declared with the volatile keyword?",
                    "options": [
                        "To notify the compiler that their values can be modified asynchronously by an Interrupt Service Routine, preventing register optimization.",
                        "To allocate the pointers in battery-backed SRAM rather than CPU registers.",
                        "To encrypt the memory contents against buffer overflow attacks.",
                        "To force the C++ compiler to generate 64-bit atomic instructions."
                    ],
                    "answer": 0,
                    "why": "Without volatile, an optimizing compiler may cache head or tail in a CPU register, leading the user loop to read stale values and hang indefinitely."
                }
            },
            {
                "title": "Hardware Flow Control (RTS / CTS) & Line Noise Immunity",
                "say": [
                    "Software ring buffers protect against microsecond-scale processing jitter, but if the main thread blocks for several milliseconds, even a large buffer will eventually overflow.",
                    "Hardware Flow Control eliminates buffer overflows at the physical electrical layer by adding two dedicated signaling wires: Ready To Send (RTS) and Clear To Send (CTS).",
                    "RTS is an active-LOW output from the receiver: when the local receive buffer reaches 80% capacity, the hardware deasserts RTS (pulls it HIGH), signaling the remote transmitter to halt.",
                    "CTS is an active-LOW input on the transmitter: before transmitting any byte, the transmitter checks CTS; if HIGH, transmission pauses instantly without losing a single bit.",
                    "Coupling RTS/CTS flow control with RS-485 or RS-232 differential line drivers provides bulletproof noise immunity across hundred-meter industrial factory floors."
                ],
                "example": "A receiver automatically pulls RTS HIGH when its ring buffer exceeds high-water mark, forcing the remote sender to throttle transmission.",
                "code": """#include <iostream>
#include <cstdint>

class HardwareFlowController {
private:
    size_t capacity_;
    size_t currentFill_;
    bool rtsAsserted_; // Active LOW: true means Ready (LOW)

public:
    HardwareFlowController(size_t capacity)
        : capacity_(capacity), currentFill_(0), rtsAsserted_(true) {}

    void onByteReceived() {
        currentFill_++;
        // If fill exceeds 80% high-water mark, deassert RTS (pull HIGH)
        if (currentFill_ >= (capacity_ * 80) / 100) {
            rtsAsserted_ = false;
        }
    }

    void onBytesProcessed(size_t count) {
        if (count >= currentFill_) currentFill_ = 0;
        else currentFill_ -= count;
        // Re-assert RTS when fill drops below 40% low-water mark
        if (currentFill_ <= (capacity_ * 40) / 100) {
            rtsAsserted_ = true;
        }
    }

    bool isReadyToReceive() const { return rtsAsserted_; }
    size_t getFill() const { return currentFill_; }
};

int main() {
    HardwareFlowController uartRx(100);

    // Ingest 85 bytes into a 100-byte buffer
    for (int i = 0; i < 85; ++i) {
        uartRx.onByteReceived();
    }
    std::cout << "Buffer Fill: " << uartRx.getFill() << "/100\\n";
    std::cout << "RTS State: " << (uartRx.isReadyToReceive() ? "ASSERTED (Ready)" : "DEASSERTED (Halt Sender)") << "\\n";

    uartRx.onBytesProcessed(60);
    std::cout << "After Processing 60 Bytes -> Fill: " << uartRx.getFill() << "/100\\n";
    std::cout << "RTS State: " << (uartRx.isReadyToReceive() ? "ASSERTED (Ready)" : "DEASSERTED (Halt Sender)") << "\\n";
    return 0;
}""",
                "output": """Buffer Fill: 85/100
RTS State: DEASSERTED (Halt Sender)
After Processing 60 Bytes -> Fill: 25/100
RTS State: ASSERTED (Ready)""",
                "codeNotes": [
                    { "line": 16, "note": "Deasserts RTS at 80% capacity to give remote transmitter time to stop before buffer overflow" },
                    { "line": 24, "note": "Hysteresis low-water mark (40%) prevents rapid RTS pin oscillation during high-throughput bursts" },
                    { "line": 40, "note": "Automatically re-asserts RTS when sufficient queue headroom has been restored" }
                ],
                "tryIt": "Adjust the high-water threshold to 90% and low-water to 50% and trace the RTS transitions under simulated burst traffic.",
                "check": {
                    "question": "What is the primary function of RTS/CTS hardware flow control in serial links?",
                    "options": [
                        "To allow the receiver to physically pause the remote transmitter when local buffers approach capacity, preventing data loss.",
                        "To encrypt data packets during wireless radio transmission.",
                        "To double the serial transmission baud rate over single copper wires.",
                        "To automatically correct bit errors using Reed-Solomon codes."
                    ],
                    "answer": 0,
                    "why": "Hardware flow control uses RTS and CTS voltage levels to throttle the sender before the receiver's buffer overflows, guaranteeing zero data loss."
                }
            },
            {
                "title": "Industrial UART Packet Framing & End-to-End CRC Verification",
                "say": [
                    "A raw stream of individual bytes is useless to an embedded application unless framed into structured packets with start delimiters, length tags, and checksums.",
                    "In hostile industrial environments filled with variable frequency drives and electromagnetic interference (EMI), noise spikes can inject phantom bytes or corrupt bits.",
                    "A robust industrial UART protocol encapsulates payloads with a unique synchronization header (e.g., 0xAA 0x55), a packet length field, an operation opcode, and a CRC-16 checksum.",
                    "The receiver processes incoming bytes through a deterministic Finite State Machine (FSM): hunting for sync bytes, buffering payload fields, and validating the CRC before dispatching to application logic.",
                    "If the computed CRC does not match the packet trailer, the frame is discarded and an error counter increments, protecting the microcontroller from executing corrupted commands."
                ],
                "example": "A packet framing state machine parses a telemetry frame and verifies its CRC-16 checksum, rejecting corrupted packets.",
                "code": """#include <iostream>
#include <cstdint>
#include <vector>

struct UartFrameParser {
    static uint16_t computeCRC16(const uint8_t* data, size_t length) {
        uint16_t crc = 0xFFFF;
        for (size_t i = 0; i < length; ++i) {
            crc ^= static_cast<uint16_t>(data[i]) << 8;
            for (int bit = 0; bit < 8; ++bit) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ 0x1021; // CCITT polynomial
                } else {
                    crc <<= 1;
                }
            }
        }
        return crc;
    }
};

int main() {
    // Packet: [SYNC1, SYNC2, LEN, CMD, DATA0, DATA1]
    uint8_t payload[] = {0xAA, 0x55, 0x02, 0x01, 0x10, 0x20};
    uint16_t expectedCrc = UartFrameParser::computeCRC16(payload, sizeof(payload));

    std::cout << "Packet Payload Bytes: " << sizeof(payload) << "\\n";
    std::cout << "Computed CRC-16/CCITT: 0x" << std::hex << std::uppercase << expectedCrc << std::dec << "\\n";

    // Simulate single-bit transmission corruption in DATA1
    payload[5] ^= 0x01;
    uint16_t corruptedCrc = UartFrameParser::computeCRC16(payload, sizeof(payload));
    std::cout << "Corrupted CRC: 0x" << std::hex << std::uppercase << corruptedCrc << std::dec << "\\n";
    std::cout << "Frame Validation: " << (expectedCrc == corruptedCrc ? "ACCEPTED" : "REJECTED (CRC Mismatch)") << "\\n";
    return 0;
}""",
                "output": """Packet Payload Bytes: 6
Computed CRC-16/CCITT: 0x8B32
Corrupted CRC: 0xC1C3
Frame Validation: REJECTED (CRC Mismatch)""",
                "codeNotes": [
                    { "line": 6, "note": "Implements CRC-16/CCITT polynomial (0x1021) with 0xFFFF seed for industrial error detection" },
                    { "line": 22, "note": "Frame synchronization header 0xAA 0x55 anchors byte stream alignment" },
                    { "line": 31, "note": "Instantly rejects corrupted payload when checksum mismatch occurs" }
                ],
                "tryIt": "Modify the payload length byte and observe how the CRC-16 catches length tampering.",
                "check": {
                    "question": "Why should industrial UART byte streams always be encapsulated with a sync header and CRC checksum?",
                    "options": [
                        "To delineate packet boundaries in a continuous byte stream and reject frames corrupted by electromagnetic line noise.",
                        "To convert serial bytes into parallel bus signals.",
                        "Because microcontrollers cannot receive data without a CRC calculation.",
                        "To prevent the baud rate generator from overheating."
                    ],
                    "answer": 0,
                    "why": "Sync headers provide stream realignment when bytes are lost, while CRC checksums detect multi-bit transmission errors caused by industrial EMI."
                }
            }
        ],
        "summary": [
            "UART communication is completely asynchronous, requiring both sides to maintain cumulative clock drift below 2.5% over the 10-bit frame.",
            "Hardware 16x oversampling detects the Start bit falling edge and samples data bits at ticks 7, 8, 9 via 3-pulse majority voting.",
            "Interrupt-driven reception using the RXNE flag coupled with circular FIFO ring buffers decouples hardware interrupts from user processing.",
            "RTS/CTS hardware flow control prevents buffer overflows at the physical electrical layer by throttling remote transmitters.",
            "Encapsulating byte streams with sync headers, length tags, and CRC-16 checksums guarantees end-to-end data integrity in noisy industrial environments."
        ],
        "projectStep": {
            "title": "Step 6: Constructing the High-Throughput Asynchronous UART Engine",
            "steps": [
                "Implement UartBaudCalculator computing fractional USART_BRR divisors with < 2.5% clock error.",
                "Develop UartOversampler evaluating 16x oversampling and 3-pulse majority voting for start and data bits.",
                "Build a lock-free UartRingBuffer circular FIFO decoupling the RXNE interrupt service routine from user tasks.",
                "Create a HardwareFlowController with high and low watermarks managing physical RTS/CTS throttle signals.",
                "Implement an industrial UartFrameParser validating sync headers and CRC-16 checksums under simulated EMI line noise."
            ]
        }
    }
]

print("Script template ready.")
