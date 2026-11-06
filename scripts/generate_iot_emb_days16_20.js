import fs from 'fs';
import path from 'path';

// Days 16-20 Generator for Course 14: IoT, Firmware & Embedded Systems (iot_emb)
// Month 1 Block 4: DMA Controller, Circular Streaming Buffers, D-Cache Coherence, Hardware Watchdogs & Milestone 4 Engine

const createDay16 = () => ({
  day: 16,
  title: "Direct Memory Access (DMA) Controller: Streams, Channels & Bus Matrix Arbitration",
  goal: "Master high-speed zero-CPU data movement: the ARM Cortex-M Multi-Master AHB Bus Matrix, DMA Stream/Channel crossbar multiplexing, memory-to-memory vs peripheral-to-memory transfers, and hardware FIFO threshold burst sizing.",
  minutes: 36,
  recap: "In Block 3, we mastered hardware timers, NVIC interrupts, and SAR ADCs. Today in Day 16, we eliminate CPU overhead completely by unlocking the Direct Memory Access (DMA) controller and AHB bus matrix crossbar.",
  parts: [
    {
      title: "Multi-Master AHB Bus Matrix Architecture & Round-Robin Arbitration",
      say: [
        "In modern 32-bit ARM Cortex-M microcontrollers, the CPU is not the only silicon master capable of driving memory access across the physical address space.",
        "The silicon architecture is organized around a high-performance multi-layer Advanced High-performance Bus (AHB) matrix that connects multiple bus masters (Cortex-M CPU Core I-Code, D-Code, System Bus, DMA1, DMA2, and Ethernet MAC) to multiple bus slaves (Flash memory, SRAM1, SRAM2, and APB peripheral bridges).",
        "The bus matrix allows parallel concurrent transactions: for instance, the CPU can execute instructions from Flash memory while DMA1 streams incoming UART bytes into SRAM1, and DMA2 streams audio samples from SRAM2 out to an I2S DAC simultaneously without CPU stalls.",
        "When two masters attempt to access the exact same slave memory block at the same clock cycle (for example, both CPU and DMA2 writing to SRAM1), the hardware AHB Bus Matrix arbiter intervenes.",
        "The arbiter enforces either Round-Robin or Fixed Priority arbitration: if configured for round-robin, bus masters alternate access cycle-by-cycle, ensuring neither the CPU nor the DMA controller experiences bus starvation.",
        "Understanding bus matrix interconnects is essential: placing DMA ring buffers and CPU task stacks in separate physical SRAM banks (e.g., SRAM1 vs SRAM2) eliminates bus arbitration conflicts entirely, unlocking peak silicon throughput."
      ],
      example: "Like a multi-lane highway interchange: cars from Highway 1 (CPU to Flash) and trucks from Highway 2 (DMA to SRAM) travel along independent overpasses simultaneously without causing traffic jams unless they both merge into the exact same toll booth.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct AhbMasterRequest {
    const char* masterName;
    uint32_t targetSlaveBank; // 1 = SRAM1, 2 = SRAM2, 3 = Flash
    uint32_t priority;        // Higher number = higher priority
};

class BusMatrixArbiter {
private:
    uint32_t lastGrantedMasterIndex;
public:
    BusMatrixArbiter() : lastGrantedMasterIndex(0) {}

    uint32_t arbitrateRoundRobin(const AhbMasterRequest masters[], int count, uint32_t contestedSlave) {
        // Find next master requesting the contested slave in circular order
        for (int i = 1; i <= count; ++i) {
            uint32_t idx = (lastGrantedMasterIndex + i) % count;
            if (masters[idx].targetSlaveBank == contestedSlave) {
                lastGrantedMasterIndex = idx;
                return idx;
            }
        }
        return 0;
    }
};

int main() {
    AhbMasterRequest masters[3] = {
        {"CPU_DCode", 1, 2},
        {"DMA1_Stream5", 1, 3}, // Both request SRAM1 (contested!)
        {"DMA2_Stream0", 2, 1}  // Requests SRAM2 (uncontested)
    };

    BusMatrixArbiter arbiter;
    std::cout << "[BUS MATRIX] Slot 0 Contested Access on SRAM1:\\n";
    uint32_t g1 = arbiter.arbitrateRoundRobin(masters, 3, 1);
    std::cout << "  -> Granted to: " << masters[g1].masterName << "\\n";

    std::cout << "[BUS MATRIX] Slot 1 Contested Access on SRAM1:\\n";
    uint32_t g2 = arbiter.arbitrateRoundRobin(masters, 3, 1);
    std::cout << "  -> Granted to: " << masters[g2].masterName << "\\n";
    return 0;
}`,
      output: `[BUS MATRIX] Slot 0 Contested Access on SRAM1:\n  -> Granted to: DMA1_Stream5\n[BUS MATRIX] Slot 1 Contested Access on SRAM1:\n  -> Granted to: CPU_DCode`,
      codeNotes: [
        { line: 5, note: "Defines bus master memory request with target slave destination and priority" },
        { line: 17, note: "Executes circular round-robin arbitration algorithm to grant bus access" },
        { line: 36, note: "Demonstrates fair cycle-by-cycle sharing between DMA and CPU without starvation" }
      ],
      tryIt: "Change the CPU targetSlaveBank to 3 (Flash) and verify that DMA1_Stream5 accesses SRAM1 with 0 contention cycles.",
      check: {
        question: "Why do embedded systems architects partition DMA buffers and CPU thread stacks into separate physical SRAM banks (e.g., SRAM1 vs SRAM2)?",
        options: [
          "To allow concurrent, non-blocking AHB bus matrix transactions where CPU and DMA operate simultaneously with zero arbitration stalls",
          "Because DMA controllers cannot read addresses higher than 64 kilobytes",
          "Because microcontrollers shut down if the CPU touches SRAM1",
          "To reduce the physical weight of the silicon chip package"
        ],
        answer: 0,
        why: "When CPU and DMA target separate physical slave ports on the multi-layer AHB matrix, each transaction proceeds across dedicated parallel bus wires without encountering memory arbitration contention."
      }
    },
    {
      title: "DMA Streams, Channels & Hardware Trigger Multiplexing",
      say: [
        "On high-performance microcontrollers like STM32 ARM Cortex-M4/M7, DMA controllers are structured hierarchically into Controllers, Streams, and Channels.",
        "Typically, the silicon provides two independent DMA controllers (DMA1 and DMA2). Each controller contains 8 bidirectional Streams (Streams 0 through 7).",
        "Each Stream features a multi-channel multiplexer connecting to 8 hardware Channels (Channel 0 through Channel 7).",
        "A channel maps a specific hardware peripheral trigger—such as USART1_RX, SPI1_TX, TIM2_CH1, or ADC1—to that stream.",
        "For example, in the DMA configuration register (DMA_SxCR), the CHSEL[2:0] bitfield selects which peripheral channel triggers the stream, ensuring that only one peripheral hardware line drives transfers on that stream at any given time.",
        "Configuring the wrong channel number in CHSEL is a silent failure bug: the DMA stream will initialize properly and wait forever, but because the peripheral request lines are mapped to a different channel, no transfers will ever trigger."
      ],
      example: "Think of an old telephone switchboard: DMA1 is the main building, Streams 0-7 are 8 telephone operators, and Channels 0-7 are selector switches allowing an operator to plug into the police, hospital, fire station, or airport line.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct DmaStreamConfig {
    uint8_t controller; // 1 or 2
    uint8_t stream;     // 0 to 7
    uint8_t channel;    // 0 to 7
    const char* peripheral;
    uint32_t cr_register_val;
};

class DmaMultiplexer {
public:
    static uint32_t buildSxCR(uint8_t channel, uint8_t priorityLevel, bool circularMode, bool dirMemToPeriph) {
        uint32_t cr = 0;
        cr |= (channel & 0x07) << 25;       // CHSEL[2:0] bits 27:25
        cr |= (priorityLevel & 0x03) << 16; // PL[1:0] bits 17:16 (00=Low, 11=Very High)
        if (circularMode) cr |= (1 << 8);    // CIRC bit 8
        if (dirMemToPeriph) cr |= (1 << 6);  // DIR[1:0] bit 6 (01 = Memory-to-peripheral)
        cr |= (1 << 0);                     // EN bit 0 (Stream Enable)
        return cr;
    }
};

int main() {
    // Configure SPI1_TX on DMA2 Stream 3, Channel 3, Very High Priority, Circular mode
    uint32_t cr = DmaMultiplexer::buildSxCR(3, 3, true, true);
    std::cout << "[DMA2 Stream 3] Configured for SPI1_TX:\\n";
    std::cout << "  -> Raw SxCR: 0x" << std::hex << std::uppercase << cr << "\\n";
    std::cout << "  -> Channel:  " << ((cr >> 25) & 0x07) << "\\n";
    std::cout << "  -> Priority: " << ((cr >> 16) & 0x03) << " (Very High)\\n";
    std::cout << "  -> Circular: " << (((cr >> 8) & 0x01) ? "ENABLED" : "DISABLED") << "\\n";
    std::cout << "  -> Stream:   " << (((cr >> 0) & 0x01) ? "ACTIVE" : "OFF") << "\\n";
    return 0;
}`,
      output: `[DMA2 Stream 3] Configured for SPI1_TX:\n  -> Raw SxCR: 0x6030101\n  -> Channel:  3\n  -> Priority: 3 (Very High)\n  -> Circular: ENABLED\n  -> Stream:   ACTIVE`,
      codeNotes: [
        { line: 15, note: "Encodes hardware channel select bits into bits 27:25 of DMA_SxCR" },
        { line: 17, note: "Configures priority level (0b11 = Very High) to win internal arbiter contests" },
        { line: 26, note: "Outputs synthesized 32-bit register configuration word matching ARM Cortex-M hardware" }
      ],
      tryIt: "Change circularMode to false and verify that bit 8 is cleared in the generated SxCR register.",
      check: {
        question: "What is the function of the CHSEL[2:0] bitfield in the DMA Stream Configuration Register (DMA_SxCR)?",
        options: [
          "It selects which peripheral request line (Channels 0-7) triggers data transfers on that stream",
          "It changes the baud rate of the attached UART port",
          "It determines the physical supply voltage of the microcontroller",
          "It encrypts the transferred data with AES-128"
        ],
        answer: 0,
        why: "The CHSEL bits route the internal hardware trigger lines from a specific peripheral (such as SPI, UART, or ADC) into the selected DMA stream."
      }
    },
    {
      title: "Transfer Directions: Memory-to-Peripheral, Peripheral-to-Memory & Mem-to-Mem",
      say: [
        "A DMA stream must be explicitly configured for its physical direction of data transfer using the DIR[1:0] bits in DMA_SxCR.",
        "Direction 00 represents Peripheral-to-Memory: incoming hardware bytes from peripheral data registers (such as USART_DR or ADC_DR) are read and written to an SRAM destination array.",
        "Direction 01 represents Memory-to-Peripheral: data stored in an SRAM buffer is read by DMA and written into an outbound peripheral register (such as SPI_DR or DAC_DHR12R1).",
        "Direction 10 represents Memory-to-Memory (M2M): blocks of data are copied directly from one memory address to another (e.g., Flash to SRAM or SRAM to SRAM) at maximum bus speed without CPU intervention, replacing software `memcpy()`.",
        "Crucial Hardware Invariant: Memory-to-Memory mode is ONLY supported on DMA2; DMA1 is physically wired only to peripheral buses and cannot execute M2M transfers.",
        "Attempting to enable Memory-to-Memory mode on DMA1 triggers a configuration error bit and prevents the stream from enabling."
      ],
      example: "Think of conveyor belts: Peripheral-to-Memory is an unloader belt moving cargo from ships into warehouse bins; Memory-to-Peripheral is a loader belt filling trucks; Memory-to-Memory is an automated internal forklift moving pallets between warehouse aisles.",
      code: `#include <iostream>
#include <cstdint>
#include <cstring>

enum DmaDirection {
    PERIPH_TO_MEM = 0,
    MEM_TO_PERIPH = 1,
    MEM_TO_MEM = 2
};

struct DmaTransferDescriptor {
    uint32_t srcAddress;
    uint32_t dstAddress;
    uint32_t transferLengthWords;
    DmaDirection direction;
    uint8_t controller; // 1 or 2
};

bool validateAndExecuteDmaTransfer(const DmaTransferDescriptor* dma, uint32_t* dst, const uint32_t* src) {
    // Invariant: M2M is strictly restricted to DMA2 controller on Cortex-M
    if (dma->direction == MEM_TO_MEM && dma->controller == 1) {
        std::cout << "[ERROR] Memory-to-Memory mode not supported on DMA1! Must use DMA2.\\n";
        return false;
    }
    // Simulate zero-overhead hardware burst copy
    for (uint32_t i = 0; i < dma->transferLengthWords; ++i) {
        dst[i] = src[i];
    }
    return true;
}

int main() {
    uint32_t srcBuffer[4] = {0x11112222, 0x33334444, 0x55556666, 0x77778888};
    uint32_t dstBuffer[4] = {0};

    DmaTransferDescriptor invalidM2M = {0x20000000, 0x20001000, 4, MEM_TO_MEM, 1};
    validateAndExecuteDmaTransfer(&invalidM2M, dstBuffer, srcBuffer);

    DmaTransferDescriptor validM2M = {0x20000000, 0x20001000, 4, MEM_TO_MEM, 2};
    if (validateAndExecuteDmaTransfer(&validM2M, dstBuffer, srcBuffer)) {
        std::cout << "[DMA2 M2M] Hardware burst transfer complete (4 words copied):\\n";
        for (int i = 0; i < 4; ++i) {
            std::cout << "  Word[" << i << "]: 0x" << std::hex << dstBuffer[i] << "\\n";
        }
    }
    return 0;
}`,
      output: `[ERROR] Memory-to-Memory mode not supported on DMA1! Must use DMA2.\n[DMA2 M2M] Hardware burst transfer complete (4 words copied):\n  Word[0]: 0x11112222\n  Word[1]: 0x33334444\n  Word[2]: 0x55556666\n  Word[3]: 0x77778888`,
      codeNotes: [
        { line: 18, note: "Enforces silicon architectural invariant: M2M transfers restricted to DMA2" },
        { line: 24, note: "Simulates hardware AHB direct burst copy without CPU cycle consumption" },
        { line: 36, note: "Rejects invalid DMA1 M2M invocation and succeeds under DMA2 controller" }
      ],
      tryIt: "Change invalidM2M controller to 2 and verify both descriptors execute successfully.",
      check: {
        question: "Why does attempting a Memory-to-Memory (M2M) transfer on DMA1 fail on STM32 Cortex-M microcontrollers?",
        options: [
          "Because DMA1 is physically connected only to peripheral buses (APB1) and lacks master interconnect ports to drive dual memory banks",
          "Because DMA1 does not have power supplied to it",
          "Because M2M transfers require internet access",
          "Because DMA1 can only handle 1 byte total"
        ],
        answer: 0,
        why: "In ARM Cortex-M hardware design, DMA1 bus ports connect to APB peripherals and SRAM, but cannot drive simultaneous master-to-slave transfers between two memory buses; only DMA2 features dual AHB master ports capable of memory-to-memory routing."
      }
    },
    {
      title: "Hardware FIFO Thresholds & Burst Transfer Alignment",
      say: [
        "Each DMA stream includes a dedicated 4-word (16-byte) internal hardware FIFO buffer.",
        "The FIFO serves two crucial purposes: packing/unpacking data of differing widths (such as reading 8-bit bytes from a UART and packing them into 32-bit words in SRAM), and executing high-speed Burst Transfers across the AHB bus matrix.",
        "Without FIFO mode (Direct Mode), the DMA controller issues an AHB bus request for every single peripheral trigger, consuming bus arbitration overhead on every byte.",
        "In FIFO mode, the FIFO Control Register (DMA_SxFCR) configures a threshold (1/4, 1/2, 3/4, or Full FIFO). The DMA accumulates peripheral samples inside the FIFO until the threshold is met, and then requests the AHB bus to burst all words into SRAM in a single multi-beat burst (INCR4, INCR8, or INCR16).",
        "Crucial Alignment Rule: Burst transfers MUST be memory-aligned to the total burst size; a 4-word (16-byte) burst must target an address evenly divisible by 16 (address & 0x0F == 0).",
        "Targeting an unaligned address during a burst transfer triggers an immediate Direct Mode Error (DME) or FIFO Error (FEIF) interrupt flag, aborting the stream."
      ],
      example: "Like grocery shopping: Direct Mode is walking each individual apple out to your car one by one; FIFO Burst Mode is filling your cart (FIFO threshold) and wheeling the entire haul to your car in a single efficient trip.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct DmaFifoConfig {
    uint8_t threshold; // 0=1/4, 1=1/2, 2=3/4, 3=Full
    uint8_t burstSizeWords; // 1, 4, 8, 16
    uint32_t destinationAddress;
};

bool validateFifoBurstAlignment(const DmaFifoConfig* cfg) {
    uint32_t burstSizeBytes = cfg->burstSizeWords * 4;
    uint32_t alignmentMask = burstSizeBytes - 1;

    std::cout << "[DMA FIFO] Checking burst size " << cfg->burstSizeWords << " words (" << burstSizeBytes << " bytes) against 0x" 
              << std::hex << cfg->destinationAddress << "...\\n";

    if ((cfg->destinationAddress & alignmentMask) != 0) {
        std::cout << "  -> [ERROR] FIFO_ALIGNMENT_FAULT: Address is not " << std::dec << burstSizeBytes << "-byte aligned!\\n";
        return false;
    }
    std::cout << "  -> [OK] Address is aligned! Hardware burst transfer permitted.\\n";
    return true;
}

int main() {
    DmaFifoConfig unaligned = {3, 4, 0x20000006}; // 4 words (16B) burst, but address ends in 6
    validateFifoBurstAlignment(&unaligned);

    DmaFifoConfig aligned = {3, 4, 0x20000010};   // 4 words (16B) burst, address divisible by 16
    validateFifoBurstAlignment(&aligned);
    return 0;
}`,
      output: `[DMA FIFO] Checking burst size 4 words (16 bytes) against 0x20000006...\n  -> [ERROR] FIFO_ALIGNMENT_FAULT: Address is not 16-byte aligned!\n[DMA FIFO] Checking burst size 4 words (16 bytes) against 0x20000010...\n  -> [OK] Address is aligned! Hardware burst transfer permitted.`,
      codeNotes: [
        { line: 11, note: "Calculates address alignment mask from burst size (burstSizeBytes - 1)" },
        { line: 15, note: "Detects unaligned address violating AHB multi-beat burst requirements" },
        { line: 26, note: "Confirms valid 16-byte alignment allowing peak bus arbitration efficiency" }
      ],
      tryIt: "Configure an 8-word burst (32 bytes) at address 0x20000010 and verify it fails (needs 32-byte alignment 0x20).",
      check: {
        question: "What hardware fault occurs if firmware configures a 4-beat word burst (16 bytes) to an SRAM address not divisible by 16?",
        options: [
          "A FIFO Alignment Error (FEIF) / Bus Fault aborts the DMA stream immediately",
          "The CPU increases its clock speed automatically",
          "The data is converted into text JSON",
          "The microcontroller deletes all firmware files"
        ],
        answer: 0,
        why: "ARM AHB bus protocols strictly require burst memory accesses to be aligned to the total byte length of the burst transaction; unaligned bursts generate immediate bus transfer errors."
      }
    },
    {
      title: "Building an Autonomous Zero-CPU UART DMA Reception Engine",
      say: [
        "In traditional interrupt-driven UART reception, every single incoming byte generates an RXNE interrupt, forcing the CPU through 12-cycle hardware stacking, ISR execution, ring buffer pointer updating, and 12-cycle unstacking.",
        "At 921,600 baud, bytes arrive every 10.8 microseconds; an interrupt-driven system spends over 40% of its entire CPU budget simply handling UART interrupts!",
        "By binding USART_RX to a DMA Stream, incoming bytes are transferred directly from USART_DR into an SRAM circular buffer with ZERO CPU intervention.",
        "The CPU remains 100% free to execute control algorithms, mathematical transforms, or deep sleep.",
        "To know when an asynchronous packet has finished arriving without knowing its length in advance, firmware enables the USART IDLE Line Interrupt (`USART_CR1_IDLEIE`).",
        "When the sender finishes transmitting a packet and the RX pin remains HIGH for 1 bit period, the hardware IDLE interrupt fires; the CPU wakes up once per packet, inspects the remaining DMA counter (`DMA_SxNDTR`), and processes the complete message in bulk."
      ],
      example: "Like mail delivery: instead of the mail carrier ringing your doorbell for every individual envelope (byte interrupts), they drop all envelopes into your mailbox (DMA stream) and ring the doorbell once when the delivery bundle is finished (IDLE line interrupt).",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct UartDmaReceiver {
    uint8_t rxBuffer[32];
    uint32_t bufferCapacity;
    uint32_t ndtr_remaining; // Number of Data to Transfer Register
};

class AutonomousUartEngine {
public:
    static void handleIdleLineInterrupt(UartDmaReceiver* rx) {
        // Calculate bytes received = Buffer Capacity - NDTR
        uint32_t bytesReceived = rx->bufferCapacity - rx->ndtr_remaining;
        std::cout << "[USART IDLE LINE DETECTED] Packet reception complete!\\n";
        std::cout << "  -> Total Bytes Transferred by DMA: " << bytesReceived << " bytes\\n";
        std::cout << "  -> CPU Overhead: 1 interrupt per PACKET (instead of " << bytesReceived << " byte interrupts)\\n";
        std::cout << "  -> Packet Content: \\"";
        for (uint32_t i = 0; i < bytesReceived; ++i) {
            std::cout << static_cast<char>(rx->rxBuffer[i]);
        }
        std::cout << "\\"\\n";
    }
};

int main() {
    UartDmaReceiver rx = {{0}, 32, 32};

    // Simulate DMA streaming incoming GPS NMEA string autonomously
    const char* incomingTelemetry = "$GPGGA,123519";
    int len = 13;
    for (int i = 0; i < len; ++i) {
        rx.rxBuffer[i] = incomingTelemetry[i];
    }
    rx.ndtr_remaining = 32 - len; // DMA decrements NDTR on each transfer

    // Line goes idle, hardware triggers IDLE interrupt
    AutonomousUartEngine::handleIdleLineInterrupt(&rx);
    return 0;
}`,
      output: `[USART IDLE LINE DETECTED] Packet reception complete!\n  -> Total Bytes Transferred by DMA: 13 bytes\n  -> CPU Overhead: 1 interrupt per PACKET (instead of 13 byte interrupts)\n  -> Packet Content: "$GPGGA,123519"`,
      codeNotes: [
        { line: 6, note: "Models DMA NDTR register decremented on every incoming peripheral byte" },
        { line: 13, note: "Calculates total received packet size as (Capacity - NDTR) on IDLE interrupt" },
        { line: 36, note: "Demonstrates zero-CPU reception of full ASCII telemetry string with 1 single ISR" }
      ],
      tryIt: "Simulate a 20-byte packet and verify that NDTR remaining is 12 and 20 bytes are reported.",
      check: {
        question: "How does combining a circular DMA stream with a UART IDLE line interrupt optimize packet processing?",
        options: [
          "It allows the CPU to sleep while DMA moves bytes, waking the processor only once when an entire frame finishes arriving",
          "It doubles the baud rate of the physical wire",
          "It eliminates the need for SRAM in the microcontroller",
          "It prevents the transmitter from sending data"
        ],
        answer: 0,
        why: "DMA moves incoming bytes directly into RAM without CPU intervention, and the IDLE interrupt notifies the CPU only after an entire transmission pause occurs, slashing interrupt overhead by over 95%."
      }
    }
  ],
  summary: [
    "The Multi-Layer AHB Bus Matrix enables parallel concurrent data movement between multiple masters (CPU, DMA) and multiple slaves (Flash, SRAM).",
    "DMA Streams multiplex multiple hardware Channel requests, ensuring dedicated priority and routing for high-speed peripherals.",
    "Memory-to-Memory (M2M) transfers are physically restricted to DMA2 on Cortex-M due to dual master bus matrix routing requirements.",
    "Internal DMA FIFO buffers assemble multi-beat bursts (INCR4/8/16) that require strict natural address boundary alignment to prevent bus faults.",
    "Pairing UART DMA reception with the hardware IDLE Line Interrupt achieves zero-CPU byte processing with single-interrupt packet handling."
  ],
  projectStep: {
    title: "Implement High-Performance Zero-CPU DMA Multi-Bus Infrastructure",
    steps: [
      "Configure multi-master AHB bus matrix memory layouts partitioning DMA buffers into isolated SRAM banks.",
      "Initialize DMA2 Stream 0 with Channel 0 routing for hardware ADC streaming transfers.",
      "Verify memory-to-memory hardware transfer validation rules on DMA2 versus DMA1 controllers.",
      "Configure DMA FIFO thresholds and verify memory address alignment constraints for multi-beat bursts.",
      "Implement autonomous UART reception using DMA circular streaming coupled with hardware IDLE line interrupt detection."
    ]
  }
});

const createDay17 = () => ({
  day: 17,
  title: "Circular DMA & Ping-Pong Buffers: Half-Transfer (HT) & Transfer-Complete (TC) Zero-Copy Streaming",
  goal: "Master continuous real-time audio and sensor streaming: circular DMA buffering, Half-Transfer (HT) and Transfer-Complete (TC) double-buffering, deterministic latency budgeting, and elimination of race conditions.",
  minutes: 36,
  recap: "In Day 16, we mastered the DMA controller and AHB bus matrix. Today in Day 17, we construct the industry-standard high-throughput streaming architecture: Circular DMA Double Buffering (Ping-Pong buffers).",
  parts: [
    {
      title: "The Continuous Streaming Dilemma & Circular Buffer Physics",
      say: [
        "In continuous data acquisition systems—such as 48 kHz digital audio, 3-axis accelerometer vibration analysis, or RF software-defined radio—data never stops arriving.",
        "If firmware uses a standard linear DMA buffer, when the buffer fills, the DMA controller stops (`NDTR == 0`).",
        "The CPU must stop what it is doing, process the buffer, re-point the memory addresses, and re-enable the stream.",
        "During the few clock cycles that the DMA stream is disabled, incoming hardware bytes overrun the peripheral register, causing silent data drops and corrupted waveform continuity.",
        "Circular DMA mode (`DMA_SxCR_CIRC = 1`) solves this fundamentally: when the DMA transfer counter reaches zero, the hardware automatically reloads the counter from the initial configuration and wraps the memory pointer back to the start of the buffer in ZERO clock cycles.",
        "The stream never stops, never stalls, and never drops a single sample across millions of continuous transfers."
      ],
      example: "Like an infinite circular conveyor belt in a package sorting depot: the belt seamlessly wraps around the rollers and loops forever, ensuring boxes never fall off the end of the line.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct CircularDmaEngine {
    uint32_t buffer[8];
    uint32_t capacity;
    uint32_t writePointer;
    bool circularMode;
    uint32_t totalSamplesTransferred;
};

void simulateCircularDmaStep(CircularDmaEngine* dma, uint32_t sample) {
    dma->buffer[dma->writePointer] = sample;
    dma->writePointer++;
    dma->totalSamplesTransferred++;

    if (dma->writePointer >= dma->capacity) {
        if (dma->circularMode) {
            std::cout << "[DMA WRAPAROUND] Reached end of buffer -> Hardware automatically loops to index 0!\\n";
            dma->writePointer = 0; // 0-cycle hardware reload
        } else {
            std::cout << "[DMA HALT] Linear buffer full -> Stream stopped!\\n";
        }
    }
}

int main() {
    CircularDmaEngine dma = {{0}, 4, 0, true, 0};
    std::cout << "[CIRCULAR DMA] Streaming 6 continuous sensor samples into 4-slot ring buffer:\\n";
    for (uint32_t i = 1; i <= 6; ++i) {
        simulateCircularDmaStep(&dma, i * 100);
    }
    std::cout << "Final Total Samples Transferred: " << dma.totalSamplesTransferred << "\\n";
    std::cout << "Active Write Index: " << dma.writePointer << "\\n";
    return 0;
}`,
      output: `[CIRCULAR DMA] Streaming 6 continuous sensor samples into 4-slot ring buffer:\n[DMA WRAPAROUND] Reached end of buffer -> Hardware automatically loops to index 0!\nFinal Total Samples Transferred: 6\nActive Write Index: 2`,
      codeNotes: [
        { line: 5, note: "Defines ring buffer state with capacity, write pointer, and auto-reload flag" },
        { line: 17, note: "Simulates hardware automatic pointer wrap without stopping peripheral transfers" },
        { line: 31, note: "Confirms continuous zero-stall data acquisition across buffer boundaries" }
      ],
      tryIt: "Set circularMode to false and observe that after 4 samples, the linear DMA stream halts.",
      check: {
        question: "What is the critical advantage of Circular DMA mode over Linear DMA mode in streaming applications?",
        options: [
          "The hardware automatically reloads the counter and wraps to buffer start in zero cycles, preventing sample drops",
          "It compresses the data with gzip automatically",
          "It eliminates the need for electrical power",
          "It forces the CPU to run at double clock speed"
        ],
        answer: 0,
        why: "Circular DMA guarantees continuous execution without software intervention, eliminating the blind spots where linear buffers stall during re-arming."
      }
    },
    {
      title: "Half-Transfer (HT) & Transfer-Complete (TC) Double Buffering (Ping-Pong)",
      say: [
        "While Circular DMA guarantees that hardware never stops streaming, it introduces a software challenge: how does the CPU safely read data from the circular buffer without reading memory that the DMA is actively overwriting?",
        "If CPU reading and DMA writing collide in the same memory sector, a race condition occurs, resulting in torn reads and corrupted data frames.",
        "ARM Cortex-M DMA controllers resolve this using two hardware interrupt flags: Half-Transfer (`HTIF`) and Transfer-Complete (`TCIF`).",
        "Firmware allocates a buffer of size 2N. The first half (indices 0 to N-1) is designated Buffer A (Ping), and the second half (indices N to 2N-1) is designated Buffer B (Pong).",
        "When the DMA finishes filling Buffer A, it triggers the Half-Transfer Interrupt (HT). The CPU immediately begins processing Buffer A while the DMA continues uninterrupted into Buffer B.",
        "When the DMA finishes filling Buffer B, it triggers the Transfer-Complete Interrupt (TC). The CPU switches to process Buffer B while the DMA wraps back around to refill Buffer A."
      ],
      example: "Like two water buckets under a waterfall: while bucket A is filling, you pour out bucket B. The instant bucket A reaches half-full, you swap buckets, ensuring not a single drop of water spills onto the ground.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct PingPongBuffer {
    uint32_t data[8]; // Size 2N (N = 4)
    uint32_t N;
    bool bufferA_ready;
    bool bufferB_ready;
};

class PingPongDmaController {
public:
    static void handleHalfTransferInterrupt(PingPongBuffer* pp) {
        pp->bufferA_ready = true;
        std::cout << "[DMA_IT_HT] Half-Transfer Interrupt asserted!\\n";
        std::cout << "  -> DMA is now writing Buffer B (indices 4..7)\\n";
        std::cout << "  -> CPU is safely processing Buffer A (indices 0..3)\\n";
    }

    static void handleTransferCompleteInterrupt(PingPongBuffer* pp) {
        pp->bufferB_ready = true;
        std::cout << "[DMA_IT_TC] Transfer-Complete Interrupt asserted!\\n";
        std::cout << "  -> DMA wrapped to Buffer A (indices 0..3)\\n";
        std::cout << "  -> CPU is safely processing Buffer B (indices 4..7)\\n";
    }
};

int main() {
    PingPongBuffer pp = {{0}, 4, false, false};
    std::cout << "[PING-PONG STREAMING CYCLE]:\\n";
    PingPongDmaController::handleHalfTransferInterrupt(&pp);
    PingPongDmaController::handleTransferCompleteInterrupt(&pp);
    return 0;
}`,
      output: `[PING-PONG STREAMING CYCLE]:\n[DMA_IT_HT] Half-Transfer Interrupt asserted!\n  -> DMA is now writing Buffer B (indices 4..7)\n  -> CPU is safely processing Buffer A (indices 0..3)\n[DMA_IT_TC] Transfer-Complete Interrupt asserted!\n  -> DMA wrapped to Buffer A (indices 0..3)\n  -> CPU is safely processing Buffer B (indices 4..7)`,
      codeNotes: [
        { line: 5, note: "Allocates 2N buffer split into Ping (0..N-1) and Pong (N..2N-1) halves" },
        { line: 13, note: "HT interrupt triggers CPU processing on Buffer A while DMA writes Buffer B" },
        { line: 20, note: "TC interrupt triggers CPU processing on Buffer B while DMA wraps to Buffer A" }
      ],
      tryIt: "Expand N to 8 (16 elements total) and verify that Buffer A spans 0..7 and Buffer B spans 8..15.",
      check: {
        question: "How does the combination of Half-Transfer (HT) and Transfer-Complete (TC) interrupts eliminate race conditions in streaming firmware?",
        options: [
          "It partitions memory so the CPU always reads the inactive half while DMA writes the active half",
          "It stops all electrical activity in the microcontroller",
          "It disables the DMA controller during reading",
          "It forces the CPU to execute code in reverse"
        ],
        answer: 0,
        why: "By ping-ponging between two halves of a circular buffer, the CPU and DMA access non-overlapping memory regions, guaranteeing mutually exclusive, race-free zero-copy processing."
      }
    },
    {
      title: "Real-Time Processing Latency Budgets & Overrun Protection",
      say: [
        "In a Ping-Pong DMA architecture, there is a strict real-time deadline: the CPU must completely finish processing Buffer A before the DMA finishes Buffer B!",
        "If the CPU processing time exceeds the DMA half-buffer fill time (T_cpu > T_dma_half), the DMA will wrap around and begin overwriting Buffer A before the CPU has finished reading it.",
        "This condition is known as a Buffer Overrun or Data Collision Hazard.",
        "Calculating the real-time latency budget is deterministic: T_budget = N_samples / Sampling_Frequency.",
        "For example, in a 48 kHz audio pipeline with N = 256 samples per half-buffer, T_budget = 256 / 48,000 = 5.33 milliseconds.",
        "The CPU signal processing algorithm (FFT, filtering, compression) must execute in strictly less than 5.33 ms under worst-case execution time (WCET), leaving sufficient margin for higher-priority system interrupts."
      ],
      example: "Like eating popcorn at a movie theater: if the refill machine dumps a new batch into your bucket every 5 minutes (DMA fill rate), you must finish eating your half (CPU processing) in under 5 minutes, or the new batch overflows onto the floor.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct StreamingLatencyBudget {
    uint32_t samplingFrequencyHz;
    uint32_t halfBufferSizeSamples;
    double allowedBudgetMs;
};

StreamingLatencyBudget calculateLatencyBudget(uint32_t fs, uint32_t n) {
    StreamingLatencyBudget b;
    b.samplingFrequencyHz = fs;
    b.halfBufferSizeSamples = n;
    b.allowedBudgetMs = (static_cast<double>(n) / fs) * 1000.0;
    return b;
}

bool evaluateRealTimeDeadline(double budgetMs, double wcetMs) {
    std::cout << "[LATENCY AUDIT] Half-Buffer Budget: " << std::fixed << std::setprecision(2) << budgetMs << " ms\\n";
    std::cout << "  -> Measured Algorithm WCET:  " << wcetMs << " ms\\n";
    if (wcetMs >= budgetMs) {
        std::cout << "  -> [OVERRUN ERROR] CPU exceeded latency budget! Buffer will be overwritten.\\n";
        return false;
    }
    double marginPct = ((budgetMs - wcetMs) / budgetMs) * 100.0;
    std::cout << "  -> [REAL-TIME PASS] Deadline met! CPU Headroom Margin: " << marginPct << "%\\n";
    return true;
}

int main() {
    // 48 kHz Audio Pipeline with N = 256 samples
    StreamingLatencyBudget audio = calculateLatencyBudget(48000, 256);
    evaluateRealTimeDeadline(audio.allowedBudgetMs, 2.10); // Safe algorithm (2.1 ms)
    evaluateRealTimeDeadline(audio.allowedBudgetMs, 5.80); // Overrun algorithm (5.8 ms)
    return 0;
}`,
      output: `[LATENCY AUDIT] Half-Buffer Budget: 5.33 ms\n  -> Measured Algorithm WCET:  2.10 ms\n  -> [REAL-TIME PASS] Deadline met! CPU Headroom Margin: 60.62%\n[LATENCY AUDIT] Half-Buffer Budget: 5.33 ms\n  -> Measured Algorithm WCET:  5.80 ms\n  -> [OVERRUN ERROR] CPU exceeded latency budget! Buffer will be overwritten.`,
      codeNotes: [
        { line: 12, note: "Calculates maximum allowable execution window T = (N / Fs) * 1000" },
        { line: 20, note: "Detects real-time deadline violation causing destructive buffer collision" },
        { line: 31, note: "Proves that algorithm running in 2.1 ms preserves over 60% CPU headroom margin" }
      ],
      tryIt: "Increase N to 512 and observe the budget expand to 10.67 ms.",
      check: {
        question: "What happens if the CPU takes longer to process Buffer A than the time it takes the DMA to fill Buffer B?",
        options: [
          "A Buffer Overrun occurs: the DMA overwrites Buffer A before the CPU finishes reading it, causing data corruption",
          "The DMA controller automatically slows down the sampling rate of the hardware",
          "The microcontroller executes a software reset immediately",
          "The audio pitch automatically shifts up one octave"
        ],
        answer: 0,
        why: "In streaming architectures, hardware sampling is asynchronous and continuous; if software violates the real-time processing deadline, the incoming stream overwrites memory being actively read."
      }
    },
    {
      title: "Zero-Copy Data Pipeline: Transferring Buffer Ownership to Network & Disk",
      say: [
        "In production embedded systems, reading sensor data is only the first step: the acquired data must be compressed, logged to an SD card, or transmitted over Ethernet or Wi-Fi.",
        "Naive firmware implementations copy bytes multiple times: DMA -> Ping Buffer -> Intermediate Array -> Network Socket.",
        "Every in-memory copy wastes CPU cycles and consumes precious SRAM bandwidth on the AHB matrix.",
        "The Zero-Copy architectural pattern eliminates intermediate copies by passing memory ownership pointers.",
        "When the Half-Transfer interrupt fires, the ISR posts the pointer `&buffer[0]` directly into an RTOS message queue or ring buffer.",
        "The consumer task (e.g. Ethernet publisher) transmits directly from `&buffer[0]` using a secondary DMA stream, achieving complete zero-copy end-to-end data pipelines."
      ],
      example: "Like transferring a deed to a house: instead of picking up the physical bricks and moving them across town, you simply hand over the single sheet of paper containing the ownership address.",
      code: `#include <iostream>
#include <cstdint>

struct BufferOwnershipMessage {
    const uint32_t* dataPointer;
    uint32_t lengthWords;
    uint32_t bufferId; // 0 = Buffer A, 1 = Buffer B
};

class ZeroCopyPipeline {
public:
    static void dispatchToNetwork(const BufferOwnershipMessage* msg) {
        std::cout << "[ZERO-COPY PIPELINE] Dispatching Buffer " << (msg->bufferId == 0 ? "A" : "B") 
                  << " directly to Ethernet DMA:\\n";
        std::cout << "  -> Pointer Address: 0x" << std::hex << msg->dataPointer << "\\n";
        std::cout << "  -> Length:          " << std::dec << msg->lengthWords << " words\\n";
        std::cout << "  -> Copies Avoided:  1 intermediate RAM buffer copy (0 CPU cycles)\\n";
    }
};

int main() {
    uint32_t streamingBuffer[16] = {0xAA, 0xBB, 0xCC, 0xDD};

    // HT Interrupt fires -> passes Buffer A pointer
    BufferOwnershipMessage msgA = {&streamingBuffer[0], 8, 0};
    ZeroCopyPipeline::dispatchToNetwork(&msgA);

    // TC Interrupt fires -> passes Buffer B pointer
    BufferOwnershipMessage msgB = {&streamingBuffer[8], 8, 1};
    ZeroCopyPipeline::dispatchToNetwork(&msgB);
    return 0;
}`,
      output: `[ZERO-COPY PIPELINE] Dispatching Buffer A directly to Ethernet DMA:\n  -> Pointer Address: 0x20000000\n  -> Length:          8 words\n  -> Copies Avoided:  1 intermediate RAM buffer copy (0 CPU cycles)\n[ZERO-COPY PIPELINE] Dispatching Buffer B directly to Ethernet DMA:\n  -> Pointer Address: 0x20000020\n  -> Length:          8 words\n  -> Copies Avoided:  1 intermediate RAM buffer copy (0 CPU cycles)`,
      codeNotes: [
        { line: 5, note: "Encapsulates buffer pointer and word length in lightweight 12-byte descriptor" },
        { line: 12, note: "Routes pointer directly to network DMA without memory copy overhead" },
        { line: 24, note: "Demonstrates zero-copy pointer handover across both buffer phases" }
      ],
      tryIt: "Modify the buffer to 32 words and verify that Buffer B starts at offset &streamingBuffer[16].",
      check: {
        question: "What is the primary benefit of the Zero-Copy memory pattern in embedded streaming systems?",
        options: [
          "It eliminates redundant memory copies, conserving CPU cycles, reducing latency, and freeing SRAM bandwidth",
          "It makes code readable only by assembly compilers",
          "It increases the power consumption of the microcontroller",
          "It converts all analog signals to digital voltages"
        ],
        answer: 0,
        why: "Passing buffer pointers rather than copying byte payloads saves thousands of CPU cycles per second and eliminates memory bus contention."
      }
    },
    {
      title: "Building a Fault-Tolerant Audio Ping-Pong Streaming Engine",
      say: [
        "To consolidate Block 4 Day 17, we construct a complete, fault-tolerant Audio Ping-Pong Streaming Engine.",
        "The engine integrates Circular DMA mode, Half-Transfer and Transfer-Complete callbacks, real-time latency monitoring, and zero-copy pointer dispatch.",
        "Crucially, it includes an Overrun Detection Canary: if an interrupt is delayed and the CPU fails to process Buffer A before Buffer B finishes, a collision flag is set, logging diagnostic telemetry without crashing the system.",
        "This architecture forms the backbone of commercial smart speakers, active noise cancellation headsets, and medical ECG monitors.",
        "Mastering ping-pong double buffering transforms an embedded developer from a novice writing blocking loops into a systems architect capable of handling gigabit continuous telemetry."
      ],
      example: "Like a Formula 1 pit stop crew: wheel guns and tires are pre-positioned in parallel (ping-pong double buffer) so cars are serviced in 2 seconds without ever turning off the engine.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class AudioPingPongEngine {
private:
    uint32_t audioBuffer[8];
    bool bufferA_busy;
    bool bufferB_busy;
    uint32_t overrunCount;
public:
    AudioPingPongEngine() : bufferA_busy(false), bufferB_busy(false), overrunCount(0) {}

    void onHalfTransferInterrupt() {
        if (bufferA_busy) {
            overrunCount++;
            std::cout << "[COLLISION ALERT] Buffer A was still busy! Overrun recorded.\\n";
        }
        bufferA_busy = true;
        // Process Buffer A
        std::cout << "[AUDIO STREAM] Processing Ping Buffer A (0..3)...\\n";
        bufferA_busy = false; // Finished processing
    }

    void onTransferCompleteInterrupt() {
        if (bufferB_busy) {
            overrunCount++;
            std::cout << "[COLLISION ALERT] Buffer B was still busy! Overrun recorded.\\n";
        }
        bufferB_busy = true;
        // Process Buffer B
        std::cout << "[AUDIO STREAM] Processing Pong Buffer B (4..7)...\\n";
        bufferB_busy = false; // Finished processing
    }

    uint32_t getOverruns() const { return overrunCount; }
};

int main() {
    AudioPingPongEngine engine;
    std::cout << "[AUDIO ENGINE] Executing 2 full double-buffer cycles:\\n";
    engine.onHalfTransferInterrupt();
    engine.onTransferCompleteInterrupt();
    engine.onHalfTransferInterrupt();
    engine.onTransferCompleteInterrupt();

    std::cout << "[STREAM VERIFICATION] Total Overruns: " << engine.getOverruns() << " (0% Drop Rate)\\n";
    return 0;
}`,
      output: `[AUDIO ENGINE] Executing 2 full double-buffer cycles:\n[AUDIO STREAM] Processing Ping Buffer A (0..3)...\n[AUDIO STREAM] Processing Pong Buffer B (4..7)...\n[AUDIO STREAM] Processing Ping Buffer A (0..3)...\n[AUDIO STREAM] Processing Pong Buffer B (4..7)...\n[STREAM VERIFICATION] Total Overruns: 0 (0% Drop Rate)`,
      codeNotes: [
        { line: 8, note: "Maintains lock flags to detect buffer collisions when processing runs late" },
        { line: 15, note: "Detects overruns and records diagnostic metric rather than stalling firmware" },
        { line: 37, note: "Proves 100% zero-drop streaming across continuous multi-cycle execution" }
      ],
      tryIt: "Simulate a slow processing step by leaving bufferA_busy true and verify collision count increments.",
      check: {
        question: "Why should an audio streaming engine implement overrun detection canaries?",
        options: [
          "To detect and log real-time deadline violations when system load delays buffer processing",
          "To turn off the speakers when volume is loud",
          "To format the microcontroller flash memory",
          "To reduce the number of pins on the chip"
        ],
        answer: 0,
        why: "Overrun canaries detect timing glitches early, allowing engineers to size buffers appropriately or optimize algorithms before deploying into mission-critical hardware."
      }
    }
  ],
  summary: [
    "Circular DMA mode automatically wraps memory pointers and reloads transfer counters in zero clock cycles.",
    "Half-Transfer (HT) and Transfer-Complete (TC) interrupts split buffers into Ping and Pong halves, eliminating race conditions.",
    "Real-time processing latency budgets dictate that CPU execution time must remain strictly below half-buffer fill time (T_cpu < T_dma_half).",
    "Zero-Copy memory ownership handovers route buffer pointers directly to networking and storage peripherals with zero CPU copy overhead.",
    "Fault-tolerant overrun detection canaries protect against data corruption when unexpected interrupt bursts delay buffer processing."
  ],
  projectStep: {
    title: "Construct and Verify a Real-Time Audio Ping-Pong Streaming Engine",
    steps: [
      "Configure circular DMA mode with 2N sample double-buffering on peripheral audio streaming channels.",
      "Implement Half-Transfer (HT) and Transfer-Complete (TC) callback handlers for non-blocking buffer dispatch.",
      "Audit real-time execution timing budgets against worst-case execution time (WCET) constraints.",
      "Integrate zero-copy pointer handover from acquisition buffers directly to outbound communication queues.",
      "Implement defensive overrun canaries and verify zero-drop audio streaming across multi-cycle stress tests."
    ]
  }
});

const createDay18 = () => ({
  day: 18,
  title: "Cache Coherency & Memory Barriers: D-Cache Invalidation, Clean-and-Invalidate & Cortex-M7 Physics",
  goal: "Master high-performance caching physics: ARM Cortex-M7/M55 Harvard architecture L1 Data Cache (D-Cache), 32-byte cache line alignment, Cache Invalidation vs Clean-and-Invalidate, and DMB/DSB memory barriers.",
  minutes: 36,
  recap: "In Day 17, we mastered circular DMA double-buffering on Cortex-M4. Today in Day 18, we step up to high-performance microcontrollers (ARM Cortex-M7 at 480MHz): where L1 Data Caches introduce the notorious Cache Coherency hazard.",
  parts: [
    {
      title: "ARM Cortex-M7 Harvard Architecture & The L1 Data Cache (D-Cache)",
      say: [
        "On high-frequency microcontrollers like the ARM Cortex-M7 (running at 400MHz to 600MHz), the processor core runs significantly faster than physical SRAM memory.",
        "If the CPU had to wait for physical SRAM access on every load and store instruction, the processor would spend 80% of its time stalled waiting for memory bus cycles.",
        "To solve this, the Cortex-M7 incorporates Level 1 Harvard Architecture caches: a 16KB Instruction Cache (I-Cache) and a 16KB Data Cache (D-Cache).",
        "The D-Cache organizes memory into 32-byte Cache Lines. When the CPU reads a memory address, the cache controller loads the entire 32-byte aligned block from physical SRAM into fast static cache memory inside the core.",
        "Subsequent reads and writes to that memory region execute in a single clock cycle at full core frequency.",
        "However, while the CPU accesses SRAM through its internal L1 D-Cache, hardware peripherals and DMA controllers access physical SRAM directly across the AHB bus matrix—bypassing the CPU's internal cache entirely!"
      ],
      example: "Like an executive working with a private notepad (L1 Cache) on their desk while the company filing cabinet (physical SRAM) sits down the hall. If someone updates the filing cabinet, the executive's notepad still has outdated numbers unless they sync their desk.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct CacheLine {
    uint32_t tag;
    bool valid;
    bool dirty;
    uint8_t data[32]; // 32-byte standard ARM Cortex-M7 cache line
};

void inspectCacheLineOrganization(uint32_t address) {
    uint32_t lineOffset = address & 0x1F;        // Lower 5 bits (0..31)
    uint32_t alignedLineBase = address & ~0x1F;  // Aligned 32-byte boundary
    std::cout << "[ARM CORTEX-M7 D-CACHE] Address: 0x" << std::hex << address << "\\n";
    std::cout << "  -> Cache Line Base Address: 0x" << alignedLineBase << "\\n";
    std::cout << "  -> Offset within 32B Line:  " << std::dec << lineOffset << " bytes\\n";
}

int main() {
    inspectCacheLineOrganization(0x20000014); // Offset 20 within line 0x20000000
    inspectCacheLineOrganization(0x20000040); // Exactly on 32-byte line boundary
    return 0;
}`,
      output: `[ARM CORTEX-M7 D-CACHE] Address: 0x20000014\n  -> Cache Line Base Address: 0x20000000\n  -> Offset within 32B Line:  20 bytes\n[ARM CORTEX-M7 D-CACHE] Address: 0x20000040\n  -> Cache Line Base Address: 0x20000040\n  -> Offset within 32B Line:  0 bytes`,
      codeNotes: [
        { line: 7, note: "Defines 32-byte cache line structure matching ARM Cortex-M7 hardware specification" },
        { line: 12, note: "Extracts 32-byte alignment boundary mask (~0x1F)" },
        { line: 20, note: "Demonstrates hardware cache line grouping for arbitrary memory addresses" }
      ],
      tryIt: "Pass address 0x2000003F and observe that it is the last byte (offset 31) of cache line 0x20000020.",
      check: {
        question: "What is the standard cache line size of the L1 Data Cache on an ARM Cortex-M7 processor?",
        options: [
          "32 bytes",
          "1 byte",
          "4 kilobytes",
          "64 megabytes"
        ],
        answer: 0,
        why: "ARM Cortex-M7 architecture organizes its L1 Data and Instruction caches into 32-byte lines, loading and evicting memory in 32-byte contiguous blocks."
      }
    },
    {
      title: "The DMA Cache Coherency Hazard: Stale Reads & Overwrite Hazards",
      say: [
        "The fact that the CPU reads through D-Cache while DMA reads and writes physical SRAM directly leads to the dreaded Cache Coherency Bug.",
        "Hazard 1: Peripheral-to-Memory (Stale CPU Read). The DMA controller receives new telemetry from an ADC and writes it directly into physical SRAM. However, the CPU previously read that buffer, so the old data is sitting in D-Cache. When the CPU reads the buffer, it reads the stale cached data, completely blind to the new data DMA placed in SRAM!",
        "Hazard 2: Memory-to-Peripheral (Stale Peripheral Write). The CPU writes new commands into an outbound transmission buffer. In a Write-Back cache, the new bytes stay in D-Cache marked as 'dirty' and are NOT written to physical SRAM immediately. When the DMA starts sending from SRAM, it transmits old garbage data because the CPU's updates never reached SRAM!",
        "Hazard 3: Cache Eviction Overwrite. If a buffer is not aligned to 32 bytes, adjacent variables share the same cache line. When the CPU modifies an adjacent variable, the cache line is evicted back to SRAM, overwriting the new data that DMA had written into the shared line!",
        "Without strict cache maintenance operations, DMA firmware on Cortex-M7 will experience random, catastrophic data corruption."
      ],
      example: "Like two editors working on the same book: Editor A makes revisions on a local copy on their laptop without uploading it (stale SRAM); Editor B prints the book from the server without downloading revisions (stale read).",
      code: `#include <iostream>
#include <cstdint>

struct CoherencySimulation {
    uint32_t physicalSram;
    uint32_t dCacheValue;
    bool isCacheDirty;
};

void simulateStaleReadHazard(CoherencySimulation* sim, uint32_t newDmaData) {
    std::cout << "[STALE READ HAZARD]:\\n";
    std::cout << "  Initial State: SRAM = 0x" << std::hex << sim->physicalSram << ", D-Cache = 0x" << sim->dCacheValue << "\\n";

    // DMA writes new data directly into physical SRAM
    sim->physicalSram = newDmaData;
    std::cout << "  1. DMA writes new telemetry (0x" << std::hex << newDmaData << ") directly to SRAM.\\n";

    // CPU reads buffer through D-Cache (without invalidating!)
    uint32_t cpuRead = sim->dCacheValue;
    std::cout << "  2. CPU reads address through L1 Cache -> Gets Stale 0x" << std::hex << cpuRead << "!\\n";
    if (cpuRead != sim->physicalSram) {
        std::cout << "  -> [CORRUPTION ALERT] Cache Coherency Bug: CPU read stale data!\\n";
    }
}

int main() {
    CoherencySimulation sim = {0x1111, 0x1111, false};
    simulateStaleReadHazard(&sim, 0x9999);
    return 0;
}`,
      output: `[STALE READ HAZARD]:\n  Initial State: SRAM = 0x1111, D-Cache = 0x1111\n  1. DMA writes new telemetry (0x9999) directly to SRAM.\n  2. CPU reads address through L1 Cache -> Gets Stale 0x1111!\n  -> [CORRUPTION ALERT] Cache Coherency Bug: CPU read stale data!`,
      codeNotes: [
        { line: 4, note: "Models divergent state between physical SRAM memory and L1 D-Cache" },
        { line: 14, note: "DMA updates physical SRAM bypassing cache" },
        { line: 20, note: "Proves CPU reads stale cached value resulting in data desynchronization" }
      ],
      tryIt: "Update dCacheValue to match newDmaData and observe the corruption alert disappears.",
      check: {
        question: "Why does a CPU read stale data from an incoming DMA buffer on an ARM Cortex-M7 if cache maintenance is omitted?",
        options: [
          "Because DMA writes directly to physical SRAM while the CPU reads previously cached data from L1 D-Cache",
          "Because the SRAM chip deletes data after 1 millisecond",
          "Because DMA transfers can only be read by microprocessors",
          "Because the CPU clock is inverted"
        ],
        answer: 0,
        why: "DMA hardware bypasses the CPU cache; if the CPU already holds that memory line in L1 D-Cache, it reads the obsolete cached copy unless the line is explicitly invalidated."
      }
    },
    {
      title: "Cache Maintenance Operations: SCB_InvalidateDCache vs SCB_CleanDCache",
      say: [
        "To prevent cache coherency bugs, the ARM CMSIS core architecture provides hardware Cache Maintenance Instructions executed via the System Control Block (SCB).",
        "Operation 1: Invalidate Data Cache (`SCB_InvalidateDCache_by_Addr`). Used for Peripheral-to-Memory (incoming DMA). It forces the CPU to discard its internal cache lines for that buffer. The next time the CPU reads the buffer, it is forced to fetch the fresh data from physical SRAM.",
        "Crucial Timing: `SCB_InvalidateDCache` must be executed AFTER the DMA finishes receiving, BEFORE the CPU reads the data!",
        "Operation 2: Clean Data Cache (`SCB_CleanDCache_by_Addr`). Used for Memory-to-Peripheral (outbound DMA). It forces the CPU to flush all dirty cache lines out to physical SRAM.",
        "Crucial Timing: `SCB_CleanDCache` must be executed BEFORE starting the outbound DMA transfer, ensuring physical SRAM contains the CPU's latest updates.",
        "Operation 3: Clean-and-Invalidate (`SCB_CleanInvalidateDCache_by_Addr`). Flushes dirty lines to SRAM and immediately marks the cache lines invalid. Used when transferring shared bidirectional buffers."
      ],
      example: "Like saving your document before sending it to the printer (Clean Cache = flush to disk), and hitting 'Refresh' on your browser to see new comments posted by others (Invalidate Cache = discard local cache and fetch from server).",
      code: `#include <iostream>
#include <cstdint>

struct CacheMaintenanceController {
    static void executeCleanDCache(uint32_t addr, uint32_t size) {
        std::cout << "[SCB_CleanDCache] Flushing dirty cache lines for outbound DMA:\\n";
        std::cout << "  -> Flushed range: 0x" << std::hex << addr << " to 0x" << (addr + size) << "\\n";
        std::cout << "  -> SRAM is now coherent with CPU writes! Outbound DMA safe to start.\\n";
    }

    static void executeInvalidateDCache(uint32_t addr, uint32_t size) {
        std::cout << "[SCB_InvalidateDCache] Invalidating cache lines for incoming DMA:\\n";
        std::cout << "  -> Invalidated range: 0x" << std::hex << addr << " to 0x" << (addr + size) << "\\n";
        std::cout << "  -> Stale cache discarded! CPU forced to read fresh samples from SRAM.\\n";
    }
};

int main() {
    uint32_t txBuffer = 0x20001000;
    uint32_t rxBuffer = 0x20002000;

    // Outbound transfer: Clean before DMA start
    CacheMaintenanceController::executeCleanDCache(txBuffer, 128);

    // Inbound transfer: Invalidate after DMA completes
    CacheMaintenanceController::executeInvalidateDCache(rxBuffer, 128);
    return 0;
}`,
      output: `[SCB_CleanDCache] Flushing dirty cache lines for outbound DMA:\n  -> Flushed range: 0x20001000 to 0x20001080\n  -> SRAM is now coherent with CPU writes! Outbound DMA safe to start.\n[SCB_InvalidateDCache] Invalidating cache lines for incoming DMA:\n  -> Invalidated range: 0x20002000 to 0x20002080\n  -> Stale cache discarded! CPU forced to read fresh samples from SRAM.`,
      codeNotes: [
        { line: 5, note: "Cleans cache before outbound DMA so physical SRAM contains latest CPU data" },
        { line: 11, note: "Invalidates cache after inbound DMA so CPU fetches fresh data from SRAM" },
        { line: 24, note: "Applies exact timing sequence required for bidirectional DMA coherency" }
      ],
      tryIt: "Simulate a 256-byte buffer and verify the flushed address range extends to 0x20001100.",
      check: {
        question: "When must `SCB_InvalidateDCache_by_Addr()` be executed when receiving incoming sensor data via DMA?",
        options: [
          "AFTER the DMA finishes receiving and BEFORE the CPU reads the buffer",
          "Before the microcontroller is manufactured",
          "During the hardware reset handler only",
          "After the CPU finishes reading the buffer"
        ],
        answer: 0,
        why: "Invalidating the cache after DMA completes but before CPU reading forces the CPU to discard stale cached lines and fetch the newly arrived DMA samples directly from physical SRAM."
      }
    },
    {
      title: "32-Byte Cache Line Alignment & Data Memory Barriers (DMB / DSB)",
      say: [
        "Cache maintenance instructions operate on whole 32-byte cache lines; there is no such thing as invalidating half a cache line.",
        "Therefore, any buffer accessed by DMA in a cached microcontroller MUST satisfy two non-negotiable rules.",
        "Rule 1: Alignment. The buffer starting address must be aligned to a 32-byte boundary: `uint8_t buffer[128] __attribute__((aligned(32)))`.",
        "Rule 2: Padding. The buffer size must be an exact multiple of 32 bytes. If a buffer is 10 bytes, it must be padded to 32 bytes so that no other variable shares that 32-byte cache line.",
        "Furthermore, ARM processors feature superscalar execution and out-of-order write buffering.",
        "To enforce instruction ordering, architects use Memory Barrier instructions: Data Memory Barrier (`__DMB()`) ensures all previous memory accesses complete before subsequent accesses begin, and Data Synchronization Barrier (`__DSB()`) halts execution until all outstanding bus transactions have fully completed."
      ],
      example: "Like apartment buildings where water can only be shut off for an entire floor (32-byte line). If you put your bathroom on the same floor as your neighbor's kitchen (unaligned buffer), shutting off your water shuts off their sink too.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct AlignedBufferDescriptor {
    uintptr_t address;
    uint32_t sizeBytes;
};

bool verifyCacheCoherentBufferRules(const AlignedBufferDescriptor* desc) {
    std::cout << "[CACHE BUFFER AUDIT] Address: 0x" << std::hex << desc->address 
              << ", Size: " << std::dec << desc->sizeBytes << " bytes\\n";

    bool addressAligned = (desc->address & 0x1F) == 0;
    bool sizePadded = (desc->sizeBytes & 0x1F) == 0;

    if (!addressAligned) {
        std::cout << "  -> [FAIL] Address not 32-byte aligned! (Offset: " << (desc->address & 0x1F) << ")\\n";
    }
    if (!sizePadded) {
        std::cout << "  -> [FAIL] Size not multiple of 32 bytes! (Remainder: " << (desc->sizeBytes & 0x1F) << ")\\n";
    }

    if (addressAligned && sizePadded) {
        std::cout << "  -> [PASS] Buffer satisfies ARM Cortex-M7 cache coherency rules!\\n";
        return true;
    }
    return false;
}

int main() {
    AlignedBufferDescriptor badBuf = {0x20000004, 50};   // Unaligned and unpadded
    verifyCacheCoherentBufferRules(&badBuf);

    AlignedBufferDescriptor goodBuf = {0x20000020, 64};  // Aligned to 32, multiple of 32
    verifyCacheCoherentBufferRules(&goodBuf);
    return 0;
}`,
      output: `[CACHE BUFFER AUDIT] Address: 0x20000004, Size: 50 bytes\n  -> [FAIL] Address not 32-byte aligned! (Offset: 4)\n  -> [FAIL] Size not multiple of 32 bytes! (Remainder: 18)\n[CACHE BUFFER AUDIT] Address: 0x20000020, Size: 64 bytes\n  -> [PASS] Buffer satisfies ARM Cortex-M7 cache coherency rules!`,
      codeNotes: [
        { line: 11, note: "Checks 32-byte starting address alignment using mask ~0x1F" },
        { line: 12, note: "Checks 32-byte size padding rule to prevent false sharing with adjacent variables" },
        { line: 29, note: "Validates buffer compliance guaranteeing zero cache corruption risk" }
      ],
      tryIt: "Change badBuf address to 0x20000040 and size to 32 and observe it passes audit.",
      check: {
        question: "Why must a DMA buffer in a cached ARM Cortex-M7 system be both aligned to and padded to a 32-byte boundary?",
        options: [
          "To prevent cache line false sharing where invalidating the buffer inadvertently corrupts adjacent variables",
          "Because DMA hardware cannot count beyond 32",
          "To increase the resistance of the physical copper traces",
          "To allow the CPU to execute code in 8-bit mode"
        ],
        answer: 0,
        why: "Cache maintenance affects entire 32-byte lines; if adjacent variables share a cache line with a DMA buffer, invalidating the buffer will destroy changes made to those adjacent variables."
      }
    },
    {
      title: "Building a Coherent High-Speed DMA Transceiver Engine",
      say: [
        "We unite D-Cache maintenance, memory barriers, 32-byte alignment, and DMA streaming into a Coherent High-Speed DMA Transceiver Engine.",
        "The engine manages bidirectional streaming across SPI and UART interfaces on an ARM Cortex-M7 running at 480MHz.",
        "Before outbound transmission, it calls `SCB_CleanDCache()` followed by `__DSB()` to guarantee all written data has drained from the CPU write buffer into physical SRAM.",
        "Upon inbound reception, it calls `__DSB()` followed by `SCB_InvalidateDCache()` before passing data pointers to the consumer application.",
        "By enforcing these hardware invariants, the system achieves maximum 480MHz CPU performance without suffering a single dropped byte or corrupted packet."
      ],
      example: "Like an airlock on a spacecraft: strict cycle protocols (Clean -> DSB -> Transmit -> Receive -> DSB -> Invalidate) ensure zero atmospheric contamination (data corruption) occurs between two different pressure environments (CPU Cache vs DMA SRAM).",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class CoherentDmaEngine {
private:
    uint32_t txBufferAddress;
    uint32_t rxBufferAddress;
    uint32_t bufferLengthBytes;
public:
    CoherentDmaEngine(uint32_t txAddr, uint32_t rxAddr, uint32_t len)
        : txBufferAddress(txAddr), rxBufferAddress(rxAddr), bufferLengthBytes(len) {}

    void executeOutboundTransmit() {
        std::cout << "[COHERENT TX] Step 1: Clean D-Cache (0x" << std::hex << txBufferAddress << ")...\\n";
        std::cout << "[COHERENT TX] Step 2: __DSB() Data Synchronization Barrier (drain write buffers)...\\n";
        std::cout << "[COHERENT TX] Step 3: Trigger DMA Stream (SRAM -> SPI_DR)...\\n";
        std::cout << "  -> Transmit Complete: 100% coherent data guaranteed!\\n";
    }

    void executeInboundReceive() {
        std::cout << "[COHERENT RX] Step 1: DMA Stream completes (SPI_DR -> SRAM)...\\n";
        std::cout << "[COHERENT RX] Step 2: __DSB() Barrier (ensure bus transfers settled)...\\n";
        std::cout << "[COHERENT RX] Step 3: Invalidate D-Cache (0x" << std::hex << rxBufferAddress << ")...\\n";
        std::cout << "[COHERENT RX] Step 4: CPU safely reads fresh telemetry!\\n";
    }
};

int main() {
    CoherentDmaEngine engine(0x20001000, 0x20002000, 128);
    engine.executeOutboundTransmit();
    std::cout << "\\n";
    engine.executeInboundReceive();
    return 0;
}`,
      output: `[COHERENT TX] Step 1: Clean D-Cache (0x20001000)...\n[COHERENT TX] Step 2: __DSB() Data Synchronization Barrier (drain write buffers)...\n[COHERENT TX] Step 3: Trigger DMA Stream (SRAM -> SPI_DR)...\n  -> Transmit Complete: 100% coherent data guaranteed!\n\n[COHERENT RX] Step 1: DMA Stream completes (SPI_DR -> SRAM)...\n[COHERENT RX] Step 2: __DSB() Barrier (ensure bus transfers settled)...\n[COHERENT RX] Step 3: Invalidate D-Cache (0x20002000)...\n[COHERENT RX] Step 4: CPU safely reads fresh telemetry!`,
      codeNotes: [
        { line: 13, note: "Executes Clean followed by DSB barrier before triggering outbound DMA" },
        { line: 20, note: "Executes DSB barrier followed by Invalidate after DMA completes reception" },
        { line: 30, note: "Validates complete bidirectional cache-coherent DMA lifecycle" }
      ],
      tryIt: "Invert the order of Clean and DMA Trigger in TX and observe the timing violation.",
      check: {
        question: "What is the purpose of the `__DSB()` (Data Synchronization Barrier) instruction prior to invalidating the cache after DMA reception?",
        options: [
          "It halts the CPU until all outstanding bus matrix write transactions have completed into SRAM",
          "It reboots the microcontroller",
          "It clears all RAM memory to zero",
          "It changes the baud rate of the serial port"
        ],
        answer: 0,
        why: "A Data Synchronization Barrier guarantees that all background bus matrix transfers from the DMA have fully landed in physical SRAM before cache invalidation occurs."
      }
    }
  ],
  summary: [
    "ARM Cortex-M7 L1 Data Cache (D-Cache) provides single-cycle memory access using 32-byte cache lines.",
    "The DMA Cache Coherency Hazard occurs because DMA accesses physical SRAM directly, bypassing the CPU's internal L1 D-Cache.",
    "SCB_CleanDCache flushes dirty cache lines to SRAM before outbound DMA; SCB_InvalidateDCache discards stale cache lines after inbound DMA.",
    "DMA buffers must be strictly 32-byte aligned and padded to multiples of 32 bytes to prevent destructive cache line false sharing.",
    "Data Memory Barriers (DMB/DSB) enforce memory transaction ordering and guarantee complete bus settling across asynchronous hardware domains."
  ],
  projectStep: {
    title: "Implement Hardware L1 Cache Coherency Management on ARM Cortex-M7",
    steps: [
      "Configure linker scripts to align DMA buffers to 32-byte boundaries and pad allocations to 32-byte multiples.",
      "Implement SCB_CleanDCache flushing routines prior to outbound peripheral DMA transfers.",
      "Implement SCB_InvalidateDCache routines immediately following DMA Half-Transfer and Transfer-Complete interrupts.",
      "Insert DSB and DMB memory barrier instructions to synchronize out-of-order write buffers.",
      "Execute high-speed bidirectional DMA stress tests to verify 100% data coherency with zero memory corruption."
    ]
  }
});

const createDay19 = () => ({
  day: 19,
  title: "Hardware Watchdog Timers: Independent Watchdog (IWDG), Window Watchdog (WWDG) & Anti-Freeze Fail-Safes",
  goal: "Master mission-critical fail-safe hardware: the low-speed internal (LSI) Independent Watchdog (IWDG), the high-precision Window Watchdog (WWDG), multi-task heartbeat bitmask supervision, and crash-recovery telemetry logging.",
  minutes: 36,
  recap: "In Day 18, we mastered cache coherency and DMA bus synchronization. Today in Day 19, we engineer the ultimate line of defense in embedded hardware: Hardware Watchdog Timers that rescue frozen firmware from infinite loops, deadlocks, and cosmic ray bit-flips.",
  parts: [
    {
      title: "The Independent Watchdog (IWDG): Dedicated LSI Clock & Downcounting Physics",
      say: [
        "In mission-critical embedded systems (such as medical pacemakers, satellite avionics, and automotive engine controllers), software is exposed to electrical noise, electrostatic discharge (ESD), and software deadlocks that can cause firmware to freeze.",
        "If a device freezes in a remote location—such as an agricultural soil sensor buried underground or an industrial valve controller in a chemical plant—a technician cannot walk over to press a physical reset button.",
        "The primary hardware fail-safe is the Independent Watchdog (IWDG).",
        "The critical architectural property of the IWDG is that it is completely independent: it does NOT use the main crystal oscillator or main system clock.",
        "Instead, the IWDG is clocked by its own dedicated Low-Speed Internal (LSI) RC oscillator running at roughly 32 kHz.",
        "Even if the main system PLL fails, the external crystal fractures, or code execution freezes inside an infinite loop, the IWDG continues downcounting autonomously; if firmware fails to reload the key register before it reaches zero, the IWDG hardware forces an immediate system reset."
      ],
      example: "Like a dead-man's switch on a train: the train engineer must press a foot pedal every 30 seconds. If the engineer falls asleep or has a medical emergency, the switch releases and the emergency brakes engage automatically.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class IndependentWatchdog {
private:
    uint32_t counter;
    uint32_t reloadValue;
    bool enabled;
public:
    IndependentWatchdog(uint32_t reload) : counter(reload), reloadValue(reload), enabled(false) {}

    void start() {
        enabled = true;
        std::cout << "[IWDG HARDWARE] Watchdog started with reload value: " << reloadValue << "\\n";
    }

    void reload() {
        if (!enabled) return;
        counter = reloadValue; // Firmware feeds the watchdog
        std::cout << "  -> [IWDG FEED] Key register written (0xAAAA). Counter reloaded to " << reloadValue << "\\n";
    }

    bool tick() {
        if (!enabled) return true;
        if (counter > 0) {
            counter--;
            return true;
        } else {
            std::cout << "[IWDG TIMEOUT] Counter reached 0! Hardware RESET generated.\\n";
            return false; // Triggers hardware reset
        }
    }

    uint32_t getCounter() const { return counter; }
};

int main() {
    IndependentWatchdog iwdg(3);
    iwdg.start();

    // Normal operation: firmware feeds watchdog
    iwdg.tick();
    iwdg.reload();

    // Firmware enters infinite loop / freeze: fails to feed
    std::cout << "[FIRMWARE FREEZE] Firmware locked in infinite loop...\\n";
    while (iwdg.tick()) {
        std::cout << "  IWDG Downcounting: " << iwdg.getCounter() << "\\n";
    }
    return 0;
}`,
      output: `[IWDG HARDWARE] Watchdog started with reload value: 3\n  -> [IWDG FEED] Key register written (0xAAAA). Counter reloaded to 3\n[FIRMWARE FREEZE] Firmware locked in infinite loop...\n  IWDG Downcounting: 2\n  IWDG Downcounting: 1\n  IWDG Downcounting: 0\n[IWDG TIMEOUT] Counter reached 0! Hardware RESET generated.`,
      codeNotes: [
        { line: 5, note: "Models dedicated LSI-driven downcounter independent of core CPU clock" },
        { line: 16, note: "Reload key register (0xAAAA) resets counter to prevent system reset" },
        { line: 38, note: "Demonstrates hardware autonomous reset upon firmware execution freeze" }
      ],
      tryIt: "Increase reload value to 5 and observe that 5 ticks elapse before hardware reset triggers.",
      check: {
        question: "Why is the Independent Watchdog (IWDG) clocked by a dedicated Low-Speed Internal (LSI) oscillator rather than the main system clock?",
        options: [
          "To guarantee that the watchdog continues counting and can reset the MCU even if the main oscillator fails or crashes",
          "Because the LSI oscillator uses zero electrical energy",
          "Because the main system clock is too slow for watchdogs",
          "To allow the watchdog to access the internet"
        ],
        answer: 0,
        why: "A dedicated LSI clock guarantees that the watchdog remains fully operational even if the primary high-speed crystal stops oscillating or system PLL clocks fail."
      }
    },
    {
      title: "The Window Watchdog (WWDG): Early Feed Detection & Upper/Lower Bounds",
      say: [
        "While the IWDG protects against firmware running too slowly (or freezing), it has a blind spot: what if code goes haywire and begins executing a corrupted loop that feeds the watchdog continuously?",
        "If firmware is stuck in an erratic loop that repeatedly calls `reload()`, the IWDG will never timeout, and the microcontroller remains permanently corrupted.",
        "The Window Watchdog (WWDG) solves this by enforcing both a Lower Bound and an Upper Bound time window.",
        "To successfully feed the WWDG, firmware must refresh the counter within an approved time window (e.g. between 10ms and 40ms).",
        "If firmware feeds the WWDG too late (counter < 0x40), a reset occurs.",
        "Crucially, if firmware feeds the WWDG too early (counter > Window Value), an immediate hardware reset is triggered!",
        "This guarantees that firmware is executing at the correct mathematical cadence: neither frozen nor executing runaway loops."
      ],
      example: "Like a medication schedule: you must take your heart pill once every 24 hours. If you forget to take it (too late), you get sick; if you take 5 pills in 10 minutes (too early), you poison yourself. The pill must be taken strictly within the designated window.",
      code: `#include <iostream>
#include <cstdint>

struct WindowWatchdogConfig {
    uint8_t windowUpperLimit; // e.g. 0x50
    uint8_t currentCounter;   // 7-bit downcounter (0x40..0x7F)
};

class WindowWatchdog {
public:
    static bool feed(WindowWatchdogConfig* wwdg) {
        std::cout << "[WWDG FEED ATTEMPT] Counter = 0x" << std::hex << (int)wwdg->currentCounter 
                  << ", Window = 0x" << (int)wwdg->windowUpperLimit << "...\\n";

        // Check Early Feed Violation
        if (wwdg->currentCounter > wwdg->windowUpperLimit) {
            std::cout << "  -> [WWDG RESET] EARLY FEED FAULT! Firmware executed too fast or loop corrupted.\\n";
            return false;
        }

        // Check Late Feed Violation (bit 6 drops to 0 at 0x3F)
        if (wwdg->currentCounter < 0x40) {
            std::cout << "  -> [WWDG RESET] LATE FEED FAULT! Firmware timed out.\\n";
            return false;
        }

        std::cout << "  -> [WWDG OK] Feed accepted within valid time window!\\n";
        return true;
    }
};

int main() {
    WindowWatchdogConfig wwdg = {0x50, 0x60}; // Counter is 0x60 (> 0x50 Window) -> Too early!
    WindowWatchdog::feed(&wwdg);

    wwdg.currentCounter = 0x48; // Counter is 0x48 (between 0x40 and 0x50) -> Valid window!
    WindowWatchdog::feed(&wwdg);
    return 0;
}`,
      output: `[WWDG FEED ATTEMPT] Counter = 0x60, Window = 0x50...\n  -> [WWDG RESET] EARLY FEED FAULT! Firmware executed too fast or loop corrupted.\n[WWDG FEED ATTEMPT] Counter = 0x48, Window = 0x50...\n  -> [WWDG OK] Feed accepted within valid time window!`,
      codeNotes: [
        { line: 4, note: "Defines 7-bit downcounter (0x40..0x7F) and upper window threshold" },
        { line: 13, note: "Detects early feed fault when counter is above the upper window threshold" },
        { line: 29, note: "Demonstrates rejection of early feed and acceptance within valid timing window" }
      ],
      tryIt: "Set currentCounter to 0x3F and verify it triggers a late feed reset.",
      check: {
        question: "What unique failure mode does the Window Watchdog (WWDG) detect that the Independent Watchdog (IWDG) cannot?",
        options: [
          "Early Feed Faults, where runaway or corrupted code loops refresh the watchdog too quickly",
          "Physical battery disconnection",
          "Radio signal interference",
          "USB cable unplugging"
        ],
        answer: 0,
        why: "The Window Watchdog enforces an upper time bound; refreshing the counter before the window opens triggers an immediate hardware reset to kill runaway loops."
      }
    },
    {
      title: "The Multi-Task Heartbeat Bitmask Architecture",
      say: [
        "In a multithreaded Real-Time Operating System (FreeRTOS) environment, a common novice blunder is placing the watchdog feed instruction inside a single high-priority timer task.",
        "If a low-priority sensor task or network communication thread enters a permanent deadlock, the timer task continues running happily and feeding the watchdog!",
        "The system appears functional to the watchdog hardware while vital sensor or safety tasks are completely frozen.",
        "The professional solution is the Multi-Task Heartbeat Bitmask Architecture.",
        "Each active RTOS task is assigned a unique bit in a shared 32-bit heartbeat register (e.g. Task 1 = bit 0, Task 2 = bit 1, Task 3 = bit 2).",
        "At the end of each valid work loop, each task sets its assigned bit.",
        "A dedicated Supervisory Watchdog Task executes periodically: it checks whether ALL bits match the expected mask (`heartbeat == 0b111`).",
        "If and only if every single task has proven its health within the window, the supervisor feeds the physical hardware watchdog and clears the heartbeat register for the next cycle.",
        "If even one task hangs or starves, the bitmask check fails, the watchdog is starved, and the hardware resets the microcontroller."
      ],
      example: "Like a submarine crew roll call: before diving, the captain checks off the engine room (bit 0), sonar (bit 1), and life support (bit 2). If the engine room fails to check in, the dive is aborted immediately.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class HeartbeatSupervisor {
private:
    uint32_t activeHeartbeats;
    uint32_t expectedMask;
public:
    HeartbeatSupervisor(uint32_t mask) : activeHeartbeats(0), expectedMask(mask) {}

    void reportTaskHeartbeat(uint8_t taskId) {
        activeHeartbeats |= (1 << taskId);
    }

    bool evaluateAndFeedWatchdog() {
        std::cout << "[SUPERVISOR AUDIT] Heartbeat Mask: 0b" 
                  << ((activeHeartbeats & 4) ? "1" : "0")
                  << ((activeHeartbeats & 2) ? "1" : "0")
                  << ((activeHeartbeats & 1) ? "1" : "0")
                  << ", Expected: 0b"
                  << ((expectedMask & 4) ? "1" : "0")
                  << ((expectedMask & 2) ? "1" : "0")
                  << ((expectedMask & 1) ? "1" : "0") << "...\\n";

        if (activeHeartbeats == expectedMask) {
            std::cout << "  -> [ALL TASKS HEALTHY] Hardware Watchdog Fed! Clearing bits for next cycle.\\n";
            activeHeartbeats = 0; // Reset for next epoch
            return true;
        } else {
            uint32_t missing = expectedMask & ~activeHeartbeats;
            std::cout << "  -> [TASK STARVATION DETECTED] Missing Task Bits: 0x" << std::hex << missing << "\\n";
            std::cout << "  -> Watchdog feed aborted! Permitting hardware reset.\\n";
            return false;
        }
    }
};

int main() {
    // 3 Tasks: Task 0 (Telemetry), Task 1 (Sensors), Task 2 (Motor Control)
    HeartbeatSupervisor supervisor(0x07); // Expected 0b111

    // Scenario 1: All tasks report healthy
    supervisor.reportTaskHeartbeat(0);
    supervisor.reportTaskHeartbeat(1);
    supervisor.reportTaskHeartbeat(2);
    supervisor.evaluateAndFeedWatchdog();

    // Scenario 2: Task 1 deadlocks and fails to report
    std::cout << "\\n[SIMULATING MOTOR CONTROL DEADLOCK]:\\n";
    supervisor.reportTaskHeartbeat(0);
    supervisor.reportTaskHeartbeat(2); // Task 1 missing!
    supervisor.evaluateAndFeedWatchdog();
    return 0;
}`,
      output: `[SUPERVISOR AUDIT] Heartbeat Mask: 0b111, Expected: 0b111...\n  -> [ALL TASKS HEALTHY] Hardware Watchdog Fed! Clearing bits for next cycle.\n\n[SIMULATING MOTOR CONTROL DEADLOCK]:\n[SUPERVISOR AUDIT] Heartbeat Mask: 0b101, Expected: 0b111...\n  -> [TASK STARVATION DETECTED] Missing Task Bits: 0x2\n  -> Watchdog feed aborted! Permitting hardware reset.`,
      codeNotes: [
        { line: 5, note: "Maintains atomic 32-bit bitmask tracking task health status" },
        { line: 15, note: "Verifies all required tasks have executed within the current supervisory window" },
        { line: 24, note: "Pinpoints exact missing task identifier (0x2 = Task 1) and aborts watchdog feed" }
      ],
      tryIt: "Add Task 3 (mask 0x0F) and verify that all 4 tasks must report to feed the watchdog.",
      check: {
        question: "Why should firmware avoid feeding a hardware watchdog from a single dedicated timer task in an RTOS system?",
        options: [
          "Because if other worker tasks deadlock or freeze, the timer task continues running and feeding the watchdog, hiding the system failure",
          "Because timer tasks consume all RAM memory",
          "Because watchdogs cannot be fed more than once per day",
          "Because FreeRTOS does not support timer interrupts"
        ],
        answer: 0,
        why: "Feeding from a single task masks deadlocks in other threads; multi-task heartbeat bitmasks verify that every individual concurrent thread is alive before feeding."
      }
    },
    {
      title: "Crash Recovery, Reset Cause Detection & Non-Volatile Telemetry Logging",
      say: [
        "When an embedded watchdog resets a microcontroller, the device must not wake up amnesic.",
        "Upon hardware reset, the Reset and Clock Control (RCC) peripheral maintains status flags in the Clock Control & Status Register (`RCC_CSR`).",
        "Flags like `IWDGRSTF` (Independent Watchdog Reset Flag), `WWDGRSTF` (Window Watchdog Reset Flag), `PINRSTF` (Physical Pin Reset), and `PORRSTF` (Power-On Reset) identify the exact cause of reboot.",
        "During startup, bootloader firmware reads `RCC_CSR` to diagnose why the reset occurred.",
        "If a watchdog reset is detected, the firmware writes a diagnostic crash record (containing the faulting task ID, system uptime, and last recorded stack pointer) into battery-backed SRAM or flash EEPROM.",
        "Once network connectivity is established, this crash telemetry is uploaded to the cloud fleet management platform, allowing engineers to trace and patch intermittent field bugs."
      ],
      example: "Like an airplane black box: when a flight undergoes an emergency event, the cockpit voice recorder and flight data recorder preserve all sensor readings so investigators can discover the exact cause.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct ResetDiagnosticRecord {
    const char* resetCause;
    uint32_t faultingTaskId;
    uint32_t uptimeSeconds;
    bool crashUploaded;
};

class ResetReasonAnalyzer {
public:
    static ResetDiagnosticRecord evaluateRccFlags(uint32_t rcc_csr, uint32_t lastTask, uint32_t uptime) {
        ResetDiagnosticRecord rec = {"UNKNOWN", lastTask, uptime, false};

        if (rcc_csr & (1 << 29)) {
            rec.resetCause = "INDEPENDENT_WATCHDOG_RESET";
        } else if (rcc_csr & (1 << 30)) {
            rec.resetCause = "WINDOW_WATCHDOG_RESET";
        } else if (rcc_csr & (1 << 26)) {
            rec.resetCause = "EXTERNAL_PIN_RESET";
        } else if (rcc_csr & (1 << 27)) {
            rec.resetCause = "POWER_ON_RESET";
        }

        std::cout << "[POST-MORTEM DIAGNOSTICS] Bootloader Startup Audit:\\n";
        std::cout << "  -> RCC_CSR Register: 0x" << std::hex << rcc_csr << "\\n";
        std::cout << "  -> Identified Cause: " << rec.resetCause << "\\n";
        std::cout << "  -> Faulting Task ID: " << std::dec << rec.faultingTaskId << "\\n";
        std::cout << "  -> System Uptime:    " << rec.uptimeSeconds << " seconds\\n";
        return rec;
    }
};

int main() {
    // Bit 29 set in RCC_CSR = IWDGRSTF (Independent Watchdog Reset Flag)
    uint32_t mockRccCsr = (1 << 29) | (1 << 26);
    ResetDiagnosticRecord crash = ResetReasonAnalyzer::evaluateRccFlags(mockRccCsr, 1, 86420);
    return 0;
}`,
      output: `[POST-MORTEM DIAGNOSTICS] Bootloader Startup Audit:\n  -> RCC_CSR Register: 0x24000000\n  -> Identified Cause: INDEPENDENT_WATCHDOG_RESET\n  -> Faulting Task ID: 1\n  -> System Uptime:    86420 seconds`,
      codeNotes: [
        { line: 4, note: "Defines non-volatile post-mortem crash record structure" },
        { line: 14, note: "Inspects RCC_CSR hardware reset flags (bit 29 = IWDG, bit 30 = WWDG)" },
        { line: 36, note: "Demonstrates post-mortem diagnostic reporting allowing cloud fleet telemetry" }
      ],
      tryIt: "Simulate a Power-On Reset by setting bit 27 in mockRccCsr and verify the reported cause.",
      check: {
        question: "How does firmware determine that the previous reboot was caused by a hardware watchdog timeout?",
        options: [
          "By reading the watchdog reset flags (IWDGRSTF/WWDGRSTF) in the RCC_CSR register at bootup",
          "By measuring the temperature of the processor",
          "By asking the user to press a button",
          "By checking if the clock is running backwards"
        ],
        answer: 0,
        why: "Hardware retains the reset cause in the Reset and Clock Control (RCC_CSR) status register across reboots until firmware explicitly clears the flags."
      }
    },
    {
      title: "Building an Industrial Fail-Safe Supervisory Watchdog Engine",
      say: [
        "We unite the Independent Watchdog, Window Watchdog, Multi-Task Heartbeat supervision, and crash logging into a comprehensive Fail-Safe Supervisory Watchdog Engine.",
        "The engine operates as an independent supervisor thread: it tracks 4 real-time tasks (Sensor Acquisition, Control Loop, Network Telemetry, and User Interface).",
        "It verifies that each task meets its specific timing window; only when all 4 tasks report valid heartbeats does it refresh both the IWDG and WWDG.",
        "If a task hangs, it allows the hardware watchdog to reset the microcontroller, captures post-mortem crash telemetry, and safely recovers system operations.",
        "This supervisory architecture represents the gold standard of safety-critical firmware engineering, certified under IEC 61508 and ISO 26262 automotive safety standards."
      ],
      example: "Like an emergency flight management system: four independent avionics computers vote on flight surface controls; if one computer freezes, the supervisor isolates the fault and resets the subsystem seamlessly.",
      code: `#include <iostream>
#include <cstdint>

class FailSafeWatchdogEngine {
private:
    uint8_t taskHeartbeats;
    uint8_t expectedMask;
    uint32_t healthyCycles;
public:
    FailSafeWatchdogEngine() : taskHeartbeats(0), expectedMask(0x0F), healthyCycles(0) {}

    void reportTask(uint8_t id) {
        taskHeartbeats |= (1 << id);
    }

    bool executeSupervisoryCycle() {
        if (taskHeartbeats == expectedMask) {
            healthyCycles++;
            taskHeartbeats = 0; // Clear for next cycle
            std::cout << "[SUPERVISOR CYCLE " << healthyCycles << "] All 4 tasks verified healthy -> Hardware Watchdog Fed.\\n";
            return true;
        } else {
            std::cout << "[SUPERVISOR FAULT] Missing task detected (0x" << std::hex << (expectedMask & ~taskHeartbeats) << ") -> Watchdog starved!\\n";
            return false;
        }
    }
};

int main() {
    FailSafeWatchdogEngine engine;
    std::cout << "[INDUSTRIAL FAIL-SAFE ENGINE]:\\n";
    // Cycle 1: All 4 tasks report
    engine.reportTask(0);
    engine.reportTask(1);
    engine.reportTask(2);
    engine.reportTask(3);
    engine.executeSupervisoryCycle();

    // Cycle 2: Task 2 hangs
    std::cout << "\\n[SIMULATING TASK 2 HANG]:\\n";
    engine.reportTask(0);
    engine.reportTask(1);
    engine.reportTask(3); // Task 2 missing!
    engine.executeSupervisoryCycle();
    return 0;
}`,
      output: `[INDUSTRIAL FAIL-SAFE ENGINE]:\n[SUPERVISOR CYCLE 1] All 4 tasks verified healthy -> Hardware Watchdog Fed.\n\n[SIMULATING TASK 2 HANG]:\n[SUPERVISOR FAULT] Missing task detected (0x4) -> Watchdog starved!`,
      codeNotes: [
        { line: 5, note: "Supervises 4 concurrent firmware tasks using 4-bit mask (0x0F)" },
        { line: 15, note: "Feeds physical watchdog only upon unanimous health verification" },
        { line: 36, note: "Isolates exact hanging task (bit 2 = 0x4) and triggers system safety reset" }
      ],
      tryIt: "Add Task 2 report in Cycle 2 and verify that both cycles execute successfully.",
      check: {
        question: "What industrial safety standard requires independent watchdog supervision and reset reason auditing in embedded systems?",
        options: [
          "IEC 61508 / ISO 26262 functional safety standards",
          "HTTP 1.1 Web Specifications",
          "Bluetooth 4.0 Core Specification",
          "Unicode UTF-8 Text Encoding Standard"
        ],
        answer: 0,
        why: "Functional safety standards (IEC 61508 and ISO 26262) mandate hardware watchdog mechanisms and crash diagnostics to ensure systems enter a predictable safe state upon software failure."
      }
    }
  ],
  summary: [
    "The Independent Watchdog (IWDG) is clocked by an autonomous Low-Speed Internal (LSI) oscillator, surviving main clock and PLL failures.",
    "The Window Watchdog (WWDG) enforces both lower and upper time bounds, detecting runaway code that feeds the watchdog too early.",
    "Multi-task heartbeat bitmasks verify that every concurrent task in an RTOS is executing properly before refreshing the hardware watchdog.",
    "The RCC_CSR register preserves post-mortem hardware reset flags across reboots for automated crash diagnostic telemetry.",
    "Industrial fail-safe watchdog engines guarantee compliance with IEC 61508 and ISO 26262 functional safety standards."
  ],
  projectStep: {
    title: "Implement Industrial Multi-Watchdog Supervisory Architecture",
    steps: [
      "Configure the Independent Watchdog (IWDG) with LSI clock prescalers for fail-safe system reset.",
      "Implement the Window Watchdog (WWDG) with upper and lower time windows to detect early feed faults.",
      "Construct a multi-task heartbeat bitmask supervisor integrating all concurrent FreeRTOS tasks.",
      "Implement post-mortem RCC_CSR reset flag auditing and persistent crash telemetry logging.",
      "Execute simulated task hang and deadlock fault injection to verify deterministic recovery."
    ]
  }
});

const createDay20 = () => ({
  day: 20,
  title: "Milestone 4: Zero-CPU DMA Streaming Ring Buffer & Fail-Safe Watchdog Engine",
  goal: "Architect, integrate, and defend Milestone 4: a high-throughput industrial communications and data engine uniting circular DMA double-buffering, ARM Cortex-M7 D-cache coherency maintenance, and multi-task watchdog supervision.",
  minutes: 40,
  recap: "Over Days 16 through 19, we mastered the multi-master AHB bus matrix, circular DMA double buffering, L1 D-cache coherency, and multi-task watchdog fail-safes. Today in Day 20, we integrate these foundational disciplines into the unified Milestone 4 Capstone Engine.",
  parts: [
    {
      title: "Milestone 4 Architecture & System Integration Blueprint",
      say: [
        "Welcome to the Milestone 4 Defense Gate! In this milestone project, you transition from isolated peripheral drivers into a Senior Embedded Systems Architect.",
        "Your mission is to construct the High-Throughput Communications & Fail-Safe Engine for an Industrial Edge Gateway running on an ARM Cortex-M7.",
        "The system must fulfill three mandatory engineering mandates simultaneously.",
        "Mandate 1: Zero-CPU Data Acquisition. High-frequency analog and serial sensor data must stream continuously into a circular DMA double-buffer with zero CPU byte interrupts.",
        "Mandate 2: Strict Cache Coherency. The Cortex-M7 L1 D-Cache must be synchronized using 32-byte aligned buffers, memory barriers, and SCB Clean/Invalidate instructions to guarantee zero memory corruption.",
        "Mandate 3: Multi-Task Fail-Safe Supervision. An autonomous watchdog supervisor must monitor acquisition, processing, and communication threads, ensuring immediate hardware reset if any thread deadlocks."
      ],
      example: "Like an automated orbital satellite: high-speed radio telemetry streams directly to solid-state memory via DMA; internal processors verify data integrity through cache barriers; and triple-redundant watchdog timers monitor all flight subsystems.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct SystemMilestoneManifest {
    const char* subsystem;
    bool dmaZeroCpuStreaming;
    bool cacheCoherencyEnforced;
    bool multiTaskWatchdogActive;
    const char* verificationStatus;
};

void inspectMilestoneBlueprint(const SystemMilestoneManifest* m) {
    std::cout << "=========================================================\\n";
    std::cout << "  MILESTONE 4 SYSTEM ARCHITECTURE BLUEPRINT\\n";
    std::cout << "=========================================================\\n";
    std::cout << "Subsystem: " << m->subsystem << "\\n";
    std::cout << "  [MANDATE 1] Zero-CPU DMA Streaming:     " << (m->dmaZeroCpuStreaming ? "VERIFIED (0% Drop)" : "FAIL") << "\\n";
    std::cout << "  [MANDATE 2] L1 D-Cache Coherency:       " << (m->cacheCoherencyEnforced ? "VERIFIED (32B Aligned)" : "FAIL") << "\\n";
    std::cout << "  [MANDATE 3] Multi-Task Watchdog Engine: " << (m->multiTaskWatchdogActive ? "VERIFIED (Anti-Freeze)" : "FAIL") << "\\n";
    std::cout << "Status: " << m->verificationStatus << "\\n";
}

int main() {
    SystemMilestoneManifest manifest = {
        "ApexIndustrialGateway_M7",
        true,
        true,
        true,
        "PRODUCTION_READY_CERTIFIED"
    };
    inspectMilestoneBlueprint(&manifest);
    return 0;
}`,
      output: `=========================================================\n  MILESTONE 4 SYSTEM ARCHITECTURE BLUEPRINT\n=========================================================\nSubsystem: ApexIndustrialGateway_M7\n  [MANDATE 1] Zero-CPU DMA Streaming:     VERIFIED (0% Drop)\n  [MANDATE 2] L1 D-Cache Coherency:       VERIFIED (32B Aligned)\n  [MANDATE 3] Multi-Task Watchdog Engine: VERIFIED (Anti-Freeze)\nStatus: PRODUCTION_READY_CERTIFIED`,
      codeNotes: [
        { line: 5, note: "Defines system milestone compliance verification manifest" },
        { line: 13, note: "Audits the three mandatory architectural mandates for production deployment" },
        { line: 27, note: "Validates unanimous system pass for Milestone 4 architectural certification" }
      ],
      tryIt: "Change dmaZeroCpuStreaming to false and verify that Mandate 1 reports FAIL.",
      check: {
        question: "What are the three core engineering pillars evaluated in the Milestone 4 Defense Gate?",
        options: [
          "Zero-CPU DMA streaming, L1 D-Cache coherency maintenance, and multi-task watchdog supervision",
          "HTML web design, CSS color gradients, and database backups",
          "Physical copper trace etching, solder paste application, and enclosure packaging",
          "Spreadsheet accounting formulas and sales forecasting"
        ],
        answer: 0,
        why: "Milestone 4 certifies mastery over high-throughput DMA data movement, high-frequency L1 cache synchronization, and safety-critical watchdog supervision."
      }
    },
    {
      title: "Building the Zero-CPU Circular DMA Ping-Pong Streaming Engine",
      say: [
        "The first pillar of Milestone 4 is the Zero-CPU Circular DMA Streaming Engine.",
        "We configure DMA2 Stream 0 with a 32-byte aligned 2N double-buffer (`__attribute__((aligned(32)))`).",
        "The engine operates in Circular Mode (`CIRC = 1`). In the background, incoming sensor samples flow into Buffer A (indices 0 to N-1).",
        "The Half-Transfer (HT) interrupt notifies the software to process Buffer A while the DMA continues filling Buffer B (indices N to 2N-1).",
        "The Transfer-Complete (TC) interrupt notifies the software to process Buffer B while the DMA loops back to refill Buffer A.",
        "Latency tracking verifies that buffer processing time is strictly less than half-buffer fill time, maintaining a 0% packet drop rate."
      ],
      example: "Like dual pistons in a steam engine: piston A drives the wheel while piston B intakes steam; then piston B drives while piston A intakes, creating continuous, uninterrupted forward propulsion.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

struct DoubleBufferState {
    uint32_t samples[8]; // Size 2N (N = 4)
    uint32_t pingPongHalfSize;
    uint32_t activeBufferId; // 0 = Buffer A, 1 = Buffer B
    uint32_t totalProcessedSamples;
};

class DmaStreamingEngine {
public:
    static void processPingBuffer(DoubleBufferState* state) {
        state->activeBufferId = 0;
        state->totalProcessedSamples += state->pingPongHalfSize;
        std::cout << "[DMA PING COMPLETE] Processed Buffer A (Samples 0..3). Total: " 
                  << state->totalProcessedSamples << "\\n";
    }

    static void processPongBuffer(DoubleBufferState* state) {
        state->activeBufferId = 1;
        state->totalProcessedSamples += state->pingPongHalfSize;
        std::cout << "[DMA PONG COMPLETE] Processed Buffer B (Samples 4..7). Total: " 
                  << state->totalProcessedSamples << "\\n";
    }
};

int main() {
    DoubleBufferState state = {{0}, 4, 0, 0};
    std::cout << "[STREAMING INGESTION TEST]:\\n";
    DmaStreamingEngine::processPingBuffer(&state);
    DmaStreamingEngine::processPongBuffer(&state);
    DmaStreamingEngine::processPingBuffer(&state);
    DmaStreamingEngine::processPongBuffer(&state);
    return 0;
}`,
      output: `[STREAMING INGESTION TEST]:\n[DMA PING COMPLETE] Processed Buffer A (Samples 0..3). Total: 4\n[DMA PONG COMPLETE] Processed Buffer B (Samples 4..7). Total: 8\n[DMA PING COMPLETE] Processed Buffer A (Samples 0..3). Total: 12\n[DMA PONG COMPLETE] Processed Buffer B (Samples 4..7). Total: 16`,
      codeNotes: [
        { line: 5, note: "Defines 2N double-buffer state with active buffer ID tracking" },
        { line: 12, note: "Simulates Half-Transfer interrupt processing Buffer A" },
        { line: 19, note: "Simulates Transfer-Complete interrupt processing Buffer B with continuous total sample accumulation" }
      ],
      tryIt: "Simulate 3 full cycles (6 buffer swaps) and verify that 24 total samples are processed.",
      check: {
        question: "Why must the double-buffer size in Circular DMA mode be twice the processing block size (2N)?",
        options: [
          "To allow the CPU to read one half (N) while the DMA hardware writes the other half (N) simultaneously",
          "Because ARM processors cannot allocate odd-numbered arrays",
          "Because circular buffers require power-of-two multiplication",
          "To double the clock frequency of the CPU"
        ],
        answer: 0,
        why: "A 2N buffer provides two alternating halves (Ping and Pong), allowing CPU and DMA to operate simultaneously without accessing the same memory addresses."
      }
    },
    {
      title: "Building the L1 D-Cache Coherence Manager & Memory Barriers",
      say: [
        "The second pillar of Milestone 4 is L1 Data Cache Coherency Management.",
        "Because our Cortex-M7 gateway runs with D-Cache enabled at 480MHz, raw DMA memory operations risk stale reads and cache overwrite corruption.",
        "The Coherence Manager enforces strict synchronization barriers.",
        "On outbound transmission: `SCB_CleanDCache()` flushes modified data from L1 cache to physical SRAM, followed by `__DSB()` to ensure all bus lines settle before DMA begins.",
        "On inbound reception: after the DMA Transfer-Complete or Half-Transfer flag asserts, `__DSB()` ensures DMA writes have landed in SRAM, and `SCB_InvalidateDCache()` purges obsolete cache lines before the CPU accesses the buffer.",
        "Compile-time alignment assertions guarantee that all buffers reside on 32-byte boundaries with size padding."
      ],
      example: "Like an air-purification cleanroom: before sensitive silicon wafers enter the chamber (DMA data to CPU), the airlock purges all contaminants (cache invalidation), ensuring pristine data integrity.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class CacheCoherenceManager {
public:
    static bool enforceCoherentRx(uintptr_t bufferAddr, uint32_t sizeBytes) {
        if ((bufferAddr & 0x1F) != 0 || (sizeBytes & 0x1F) != 0) {
            std::cout << "[COHERENCE ERROR] Alignment violation on 0x" << std::hex << bufferAddr << "\\n";
            return false;
        }
        std::cout << "[CACHE COHERENCE RX] Synchronizing Inbound DMA Buffer (0x" << std::hex << bufferAddr << "):\\n";
        std::cout << "  1. __DSB() -> Bus lines settled.\\n";
        std::cout << "  2. SCB_InvalidateDCache_by_Addr(0x" << std::hex << bufferAddr << ", " << std::dec << sizeBytes << "B)\\n";
        std::cout << "  3. Data is 100% coherent! Zero stale read risk.\\n";
        return true;
    }
};

int main() {
    uintptr_t validBuffer = 0x20001000; // Divisible by 32
    CacheCoherenceManager::enforceCoherentRx(validBuffer, 64);
    return 0;
}`,
      output: `[CACHE COHERENCE RX] Synchronizing Inbound DMA Buffer (0x20001000):\n  1. __DSB() -> Bus lines settled.\n  2. SCB_InvalidateDCache_by_Addr(0x20001000, 64B)\n  3. Data is 100% coherent! Zero stale read risk.`,
      codeNotes: [
        { line: 6, note: "Validates 32-byte alignment and padding compliance before cache operations" },
        { line: 12, note: "Executes DSB memory synchronization barrier followed by cache line invalidation" },
        { line: 20, note: "Demonstrates zero-defect cache coherency protocol" }
      ],
      tryIt: "Pass sizeBytes = 50 and verify that the alignment error triggers.",
      check: {
        question: "What is the consequence of failing to call `SCB_InvalidateDCache()` on an incoming DMA buffer on Cortex-M7?",
        options: [
          "The CPU reads stale, outdated data from its internal L1 cache, remaining blind to new data in SRAM",
          "The microcontroller catches fire physically",
          "The network router reboots",
          "The baud rate drops to zero"
        ],
        answer: 0,
        why: "Without cache invalidation, the CPU continues reading the obsolete copy of memory cached in L1 D-Cache rather than the fresh samples written to SRAM by the DMA."
      }
    },
    {
      title: "Building the Multi-Task Watchdog Supervisor & Crash Telemetry Logger",
      say: [
        "The third pillar of Milestone 4 is the Multi-Task Watchdog Supervisor and Crash Logger.",
        "The supervisor thread monitors 4 core gateway tasks: Task 0 (DMA Ingest), Task 1 (DSP Filtering), Task 2 (MQTT Cloud Publisher), and Task 3 (System Diagnostics).",
        "Each task must register its heartbeat bit within an agreed 50ms supervisory epoch.",
        "If all 4 tasks report, the supervisor refreshes both the Independent Watchdog (IWDG) and Window Watchdog (WWDG) and clears the heartbeat register.",
        "To prove robustness, we subject the engine to Live Deadlock Injection: when Task 1 is deliberately locked in an infinite loop, the supervisor detects the missing bit, refuses to feed the watchdog, and captures post-mortem crash telemetry.",
        "Upon reboot, the bootloader inspects `RCC_CSR` flags, logs the crash record to non-volatile memory, and restores normal gateway operations."
      ],
      example: "Like a flight safety controller: if the autopilot, rudder, and throttle fail to synchronize within 50 milliseconds, the emergency backup flight computer immediately overrides control and resets the avionics.",
      code: `#include <iostream>
#include <cstdint>
#include <iomanip>

class IntegratedWatchdogSupervisor {
private:
    uint8_t heartbeatRegister;
    uint8_t requiredMask;
    uint32_t simulatedRccCsr;
public:
    IntegratedWatchdogSupervisor() : heartbeatRegister(0), requiredMask(0x0F), simulatedRccCsr(0) {}

    void reportTask(uint8_t id) {
        heartbeatRegister |= (1 << id);
    }

    bool auditAndFeed() {
        if (heartbeatRegister == requiredMask) {
            heartbeatRegister = 0;
            std::cout << "[WATCHDOG SUPERVISOR] All 4 tasks verified healthy -> Watchdog fed!\\n";
            return true;
        } else {
            uint8_t missing = requiredMask & ~heartbeatRegister;
            std::cout << "[WATCHDOG TRIPPED] Missing Task Bits: 0x" << std::hex << (int)missing << "\\n";
            std::cout << "  -> Hardware Reset Triggered! Setting IWDGRSTF flag in RCC_CSR...\\n";
            simulatedRccCsr |= (1 << 29); // IWDG Reset Flag
            return false;
        }
    }

    uint32_t getRccCsr() const { return simulatedRccCsr; }
};

int main() {
    IntegratedWatchdogSupervisor sup;
    std::cout << "[CYCLE 1: NORMAL OPERATION]\\n";
    sup.reportTask(0);
    sup.reportTask(1);
    sup.reportTask(2);
    sup.reportTask(3);
    sup.auditAndFeed();

    std::cout << "\\n[CYCLE 2: SIMULATED DEADLOCK IN TASK 1]\\n";
    sup.reportTask(0);
    sup.reportTask(2);
    sup.reportTask(3); // Task 1 missing!
    sup.auditAndFeed();

    std::cout << "\\n[POST-MORTEM RESET LOG]:\\n";
    std::cout << "  RCC_CSR Flags: 0x" << std::hex << sup.getRccCsr() << " (IWDGRSTF Asserted!)\\n";
    return 0;
}`,
      output: `[CYCLE 1: NORMAL OPERATION]\n[WATCHDOG SUPERVISOR] All 4 tasks verified healthy -> Watchdog fed!\n\n[CYCLE 2: SIMULATED DEADLOCK IN TASK 1]\n[WATCHDOG TRIPPED] Missing Task Bits: 0x2\n  -> Hardware Reset Triggered! Setting IWDGRSTF flag in RCC_CSR...\n\n[POST-MORTEM RESET LOG]:\n  RCC_CSR Flags: 0x20000000 (IWDGRSTF Asserted!)`,
      codeNotes: [
        { line: 5, note: "Maintains 4-task heartbeat register and simulated RCC reset status flag" },
        { line: 15, note: "Detects missing task heartbeat and starves watchdog to trigger hardware reset" },
        { line: 36, note: "Captures simulated IWDG reset flag (0x20000000) for post-mortem analysis" }
      ],
      tryIt: "Add Task 1 back in Cycle 2 and observe that no reset occurs.",
      check: {
        question: "How does the multi-task heartbeat supervisor guarantee that a hung background thread is caught even if other threads are running?",
        options: [
          "It requires all threads to set their assigned bits in a shared mask; if any thread hangs, the mask is incomplete and the watchdog is starved",
          "It monitors the physical weight of the circuit board",
          "It forces all threads to execute in a single serial queue",
          "It shuts down the microcontroller after 10 seconds unconditionally"
        ],
        answer: 0,
        why: "By requiring an exact bitmask match across all active threads, the supervisor guarantees that a freeze in any single thread will starve the watchdog and reset the system."
      }
    },
    {
      title: "Master Architectural Synthesis & Official Milestone 4 Defense Certification",
      say: [
        "In this final capstone session, you defend your Milestone 4 Architecture before the Senior Technical Review Board.",
        "The board evaluates your end-to-end integration across all three domains:",
        "Domain 1: Zero-CPU DMA Streaming. Circular double-buffering sustains continuous real-time sample ingestion without a single dropped byte or buffer collision.",
        "Domain 2: L1 D-Cache Coherency. 32-byte alignment, padding, DSB barriers, and SCB Clean/Invalidate instructions eliminate all cache desynchronization hazards on ARM Cortex-M7.",
        "Domain 3: Fail-Safe Watchdog Architecture. Multi-task heartbeat bitmasks and independent watchdog timers ensure automatic recovery from deadlocks with post-mortem diagnostic logging.",
        "Upon unanimous board approval, you are awarded official certification in Advanced Embedded Communications, DMA Architecture & Safety-Critical Firmware Engineering."
      ],
      example: "Like passing the flight readiness review at NASA: flight software, thermal shielding, and life support systems are audited under simulated multi-system failures before launch approval.",
      code: `#include <iostream>
#include <cstdint>

struct Milestone4DefenseCriteria {
    bool dmaCircularStreamingVerified;
    bool dcacheCoherencyVerified;
    bool multiTaskWatchdogVerified;
    bool crashTelemetryLogged;
};

bool evaluateMilestone4Defense(const Milestone4DefenseCriteria* c) {
    std::cout << "=========================================================\\n";
    std::cout << "  OFFICIAL MILESTONE 4 DEFENSE BOARD EVALUATION\\n";
    std::cout << "=========================================================\\n";
    std::cout << "1. Zero-CPU DMA Streaming:      " << (c->dmaCircularStreamingVerified ? "[PASS]" : "[FAIL]") << "\\n";
    std::cout << "2. L1 D-Cache Coherency:        " << (c->dcacheCoherencyVerified ? "[PASS]" : "[FAIL]") << "\\n";
    std::cout << "3. Multi-Task Watchdog Guard:   " << (c->multiTaskWatchdogVerified ? "[PASS]" : "[FAIL]") << "\\n";
    std::cout << "4. Post-Mortem Crash Logging:   " << (c->crashTelemetryLogged ? "[PASS]" : "[FAIL]") << "\\n";

    bool pass = c->dmaCircularStreamingVerified && c->dcacheCoherencyVerified &&
                c->multiTaskWatchdogVerified && c->crashTelemetryLogged;

    if (pass) {
        std::cout << "\\nBoard Verdict: UNANIMOUS_PASS\\n";
        std::cout << "[MILESTONE 4 PASSED] Advanced Embedded DMA & Safety Engine Certified!\\n";
    } else {
        std::cout << "\\nBoard Verdict: REJECTED_REVISION_REQUIRED\\n";
    }
    return pass;
}

int main() {
    Milestone4DefenseCriteria criteria = {true, true, true, true};
    evaluateMilestone4Defense(&criteria);
    return 0;
}`,
      output: `=========================================================\n  OFFICIAL MILESTONE 4 DEFENSE BOARD EVALUATION\n=========================================================\n1. Zero-CPU DMA Streaming:      [PASS]\n2. L1 D-Cache Coherency:        [PASS]\n3. Multi-Task Watchdog Guard:   [PASS]\n4. Post-Mortem Crash Logging:   [PASS]\n\nBoard Verdict: UNANIMOUS_PASS\n[MILESTONE 4 PASSED] Advanced Embedded DMA & Safety Engine Certified!`,
      codeNotes: [
        { line: 4, note: "Defines the 4 mandatory criteria for Milestone 4 defense qualification" },
        { line: 15, note: "Evaluates comprehensive system integration under unanimous voting rules" },
        { line: 29, note: "Issues official Milestone 4 certification confirming production-ready embedded architecture" }
      ],
      tryIt: "Set crashTelemetryLogged to false and verify that the board verdict is REJECTED.",
      check: {
        question: "What core architectural competencies are officially certified by passing Milestone 4?",
        options: [
          "Zero-CPU circular DMA double-buffering, ARM Cortex-M7 L1 cache coherency management, and multi-task watchdog supervisory fail-safes",
          "Typing speed in text editors",
          "Creating marketing presentations",
          "Setting up email accounts"
        ],
        answer: 0,
        why: "Milestone 4 certifies mastery over high-throughput DMA streaming, L1 cache coherency synchronization, and mission-critical watchdog fail-safe architectures."
      }
    }
  ],
  summary: [
    "Milestone 4 unifies zero-CPU circular DMA double-buffering, L1 D-Cache coherency, and multi-task watchdog supervision.",
    "Circular Ping-Pong DMA buffers eliminate sample drops and decouple asynchronous acquisition from CPU processing.",
    "L1 D-Cache Clean and Invalidate instructions coupled with DSB barriers eliminate stale reads and overwrite hazards on Cortex-M7.",
    "The Multi-Task Heartbeat Bitmask architecture verifies the health of all concurrent tasks before feeding the hardware watchdog.",
    "Post-mortem RCC_CSR reset diagnostics preserve crash telemetry for cloud fleet reliability auditing."
  ],
  projectStep: {
    title: "Construct, Verify, and Defend Milestone 4: Zero-CPU DMA Streaming & Fail-Safe Engine",
    steps: [
      "Construct a circular DMA ping-pong streaming buffer with Half-Transfer and Transfer-Complete callbacks.",
      "Integrate ARM Cortex-M7 L1 D-Cache maintenance with 32-byte alignment and DSB memory barriers.",
      "Implement multi-task heartbeat bitmask supervision monitoring all active gateway threads.",
      "Configure Independent (IWDG) and Window (WWDG) watchdogs with post-mortem RCC_CSR reset diagnostics.",
      "Defend the integrated architecture before the technical review board to achieve official Milestone 4 certification."
    ]
  }
});

// Output all days as JSON
const days = [createDay16(), createDay17(), createDay18(), createDay19(), createDay20()];
for (const d of days) {
  const filePath = path.join('scripts', `iot_emb_day${d.day}.json`);
  fs.writeFileSync(filePath, JSON.stringify(d, null, 2), 'utf-8');
  console.log(`Generated ${filePath} successfully!`);
}
console.log('All Days 16-20 generated successfully!');
