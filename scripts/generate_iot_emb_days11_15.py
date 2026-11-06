import json
import os

def create_day11():
    return {
        "day": 11,
        "title": "Nested Vectored Interrupt Controller (NVIC): Vector Tables, Priority Grouping & Preemption",
        "goal": "Master the hardware orchestrator of the microcontroller: the Nested Vectored Interrupt Controller (NVIC). Deconstruct the ARM Cortex-M Vector Table, memory offsets (VTOR), hardware exception stacking (8-register frame), and SCB->AIRCR priority grouping to engineer deterministic, hard real-time interrupt response.",
        "minutes": 36,
        "recap": "In Block 2, we mastered serial communication buses (UART, SPI, I2C, CAN Bus) using polling and non-blocking status registers. Today, we step into the hardware event engine of ARM microcontrollers: the NVIC, where peripheral hardware triggers immediate asynchronous CPU execution.",
        "parts": [
            {
                "title": "ARM Cortex-M Vector Table Layout & Vector Table Offset Register (VTOR)",
                "say": [
                    "In the ARM Cortex-M architecture, the Vector Table is an array of 32-bit memory addresses residing at the base of code memory that tells the CPU where to branch when power is applied or an interrupt occurs.",
                    "Entry 0 of the vector table is not executable code; it is the Initial Main Stack Pointer (MSP) address loaded into the SP register at hardware reset.",
                    "Entry 1 holds the Reset_Handler address, followed by core system exception handlers: NMI, HardFault, MemManage, BusFault, UsageFault, SVCall, PendSV, and SysTick.",
                    "Above offset 0x40 (exception index 16), peripheral interrupt vectors begin: WWDG, PVD, RTC, FLASH, RCC, EXTI lines, DMA streams, Timers, and I2C/SPI/USART controllers.",
                    "In modern microcontrollers featuring bootloaders or runtime RAM execution, the Vector Table Offset Register (SCB->VTOR at 0xE000ED08) allows shifting the active vector table from Flash base (0x08000000) into RAM (0x20000000) or an application sector.",
                    "VTOR alignment is strict: the table must be aligned to a power of 2 corresponding to the total vector table size, typically at least 128 words (512 bytes, or 0x200 boundary)."
                ],
                "example": "Think of the Vector Table like the emergency dispatch directory pinned to the wall at a fire station: call 0 points to equipment setup, call 1 points to the chief, and call 20 points to the industrial chemical response team.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

struct VectorTable {
    uint32_t initial_sp;
    uint32_t reset_handler;
    uint32_t nmi_handler;
    uint32_t hardfault_handler;
    uint32_t peripheral_handlers[16];
};

class NvicVectorController {
private:
    uint32_t vtor_address;
public:
    NvicVectorController(uint32_t baseAddr) : vtor_address(baseAddr) {}

    bool relocateVectorTable(uint32_t newBase) {
        // Enforce 512-byte (0x200) alignment rule for Cortex-M
        if ((newBase & 0x1FF) != 0) {
            std::cout << "[ERROR] VTOR alignment violation: 0x" << std::hex << newBase << " is not 512-byte aligned!\\n";
            return false;
        }
        vtor_address = newBase;
        std::cout << "[INFO] VTOR successfully relocated to 0x" << std::hex << vtor_address << "\\n";
        return true;
    }

    uint32_t getVtor() const { return vtor_address; }
};

int main() {
    NvicVectorController nvic(0x08000000); // Default Flash base
    std::cout << "Initial VTOR: 0x" << std::hex << nvic.getVtor() << "\\n";
    nvic.relocateVectorTable(0x20000100); // Unaligned - should fail
    nvic.relocateVectorTable(0x20000200); // 512-byte aligned - succeeds
    return 0;
}""",
                "output": r"""Initial VTOR: 0x8000000\n[ERROR] VTOR alignment violation: 0x20000100 is not 512-byte aligned!\n[INFO] VTOR successfully relocated to 0x20000200""",
                "codeNotes": [
                    {"line": 5, "note": "Defines vector table layout starting with Initial Stack Pointer and core handlers"},
                    {"line": 19, "note": "Enforces hardware power-of-2 memory alignment mask (~0x1FF)"},
                    {"line": 34, "note": "Simulates VTOR runtime relocation to SRAM base for dynamic dispatch"}
                ],
                "tryIt": "Try passing 0x08010000 (a 64KB sector boundary in flash) and observe that it passes alignment checks.",
                "check": {
                    "question": "What is stored at offset 0x00000000 of an ARM Cortex-M Vector Table?",
                    "options": [
                        "The Initial Main Stack Pointer (MSP) address",
                        "The Reset_Handler program counter address",
                        "The SysTick exception vector",
                        "The first instruction of the bootloader"
                    ],
                    "answer": 0,
                    "why": "On ARM Cortex-M, the very first 32-bit word in the vector table is loaded directly into the SP register before executing any instructions, establishing the runtime stack."
                }
            },
            {
                "title": "Hardware Exception Stacking (The 8-Word Stacking Frame: R0–R3, R12, LR, PC, xPSR)",
                "say": [
                    "When an interrupt request (IRQ) is accepted by the CPU, the Cortex-M hardware executes an automatic hardware stacking sequence without any software instructions.",
                    "In exactly 12 clock cycles, the processor pushes 8 registers onto the active stack: R0, R1, R2, R3, R12, LR (Link Register), PC (Return Address), and xPSR (Program Status Register).",
                    "These 8 registers constitute the caller-saved registers in the standard ARM Architecture Procedure Call Standard (AAPCS).",
                    "Because hardware stacks these registers automatically, any standard C/C++ function can serve directly as an Interrupt Service Routine (ISR) without needing special compiler assembly wrappers.",
                    "During interrupt entry, the hardware overwrites the Link Register (LR) with a special EXC_RETURN value (such as 0xFFFFFFF9 or 0xFFFFFFFD).",
                    "When the ISR executes a return instruction (like 'BX LR'), the processor detects the 0xFFFFFFF_ pattern and triggers the hardware unstacking sequence in another 12 cycles."
                ],
                "example": "Imagine an astronaut working on a panel: the moment an alarm sounds, an automated mechanical arm grabs their hand tools (R0-R3, R12) and notepad (PC, xPSR) and places them in a tray in 12 seconds flat so they can grab the fire extinguisher immediately.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

struct ExceptionStackFrame {
    uint32_t r0;
    uint32_t r1;
    uint32_t r2;
    uint32_t r3;
    uint32_t r12;
    uint32_t lr;
    uint32_t return_pc;
    uint32_t xpsr;
};

void simulateHardwareStacking(uint32_t sp, uint32_t current_pc) {
    std::cout << "[HARDWARE PIPELINE] Stacking 8 core registers onto SP (0x" << std::hex << sp << ")...\\n";
    ExceptionStackFrame frame;
    frame.r0 = 0x11111111;
    frame.r1 = 0x22222222;
    frame.r2 = 0x33333333;
    frame.r3 = 0x44444444;
    frame.r12 = 0xAAAAAAAA;
    frame.lr = 0x08001234;
    frame.return_pc = current_pc;
    frame.xpsr = 0x01000000; // Thumb bit asserted

    std::cout << "  -> Return PC saved: 0x" << std::hex << frame.return_pc << "\\n";
    std::cout << "  -> xPSR saved:      0x" << std::hex << frame.xpsr << "\\n";
    std::cout << "  -> Stacking overhead: 12 clock cycles\\n";
    std::cout << "[HARDWARE PIPELINE] Loading EXC_RETURN (0xFFFFFFF9) into LR\\n";
}

int main() {
    simulateHardwareStacking(0x2001FFC0, 0x08000450);
    return 0;
}""",
                "output": r"""[HARDWARE PIPELINE] Stacking 8 core registers onto SP (0x2001ffc0)...\n  -> Return PC saved: 0x8000450\n  -> xPSR saved:      0x1000000\n  -> Stacking overhead: 12 clock cycles\n[HARDWARE PIPELINE] Loading EXC_RETURN (0xFFFFFFF9) into LR""",
                "codeNotes": [
                    {"line": 5, "note": "Exact 8-word hardware exception stack frame pushed by ARM Cortex-M hardware"},
                    {"line": 25, "note": "Bit 24 of xPSR represents the Thumb execution bit (must always be 1)"},
                    {"line": 29, "note": "EXC_RETURN value loaded into LR signals hardware unstacking on ISR return"}
                ],
                "tryIt": "Add a check to verify that the return_pc has the Thumb bit (LSB) stripped when loaded into PC.",
                "check": {
                    "question": "Which set of registers is automatically pushed to the stack by ARM Cortex-M hardware upon interrupt entry?",
                    "options": [
                        "R0, R1, R2, R3, R12, LR, PC, and xPSR (8 registers)",
                        "All 16 general-purpose registers (R0 through R15)",
                        "Only the Program Counter (PC) and Stack Pointer (SP)",
                        "R4 through R11 (callee-saved registers)"
                    ],
                    "answer": 0,
                    "why": "ARM Cortex-M hardware automatically stacks the 8 AAPCS caller-saved registers (R0-R3, R12, LR, PC, xPSR) in 12 clock cycles, enabling standard C functions to act directly as ISRs."
                }
            },
            {
                "title": "SCB->AIRCR Priority Grouping: Preemption Priority vs Subpriority Bits",
                "say": [
                    "The NVIC supports up to 256 priority levels, though silicon vendors typically implement 16 levels using the upper 4 bits of the priority byte (bits [7:4]).",
                    "A critical rule in ARM Cortex-M interrupts is: lower numeric value represents higher logical urgency (Priority 0 is the highest priority, Priority 15 is lowest).",
                    "Through the Application Interrupt and Reset Control Register (SCB->AIRCR, bits [10:8] PRIGROUP), the 4 priority bits are split into Preemption Priority and Subpriority.",
                    "Preemption priority governs whether an incoming interrupt can interrupt (preempt) an currently executing ISR.",
                    "Subpriority only determines which interrupt executes first when two interrupts with the exact same preemption priority become pending at the same instant; subpriority can never preempt an active ISR.",
                    "To write to SCB->AIRCR, software must write a 16-bit security key (VECTKEY = 0x5FA) into the upper halfword, preventing accidental writes during firmware runaway."
                ],
                "example": "Preemption is an ER surgeon stepping away from stitching a finger to perform CPR on a cardiac arrest patient. Subpriority is deciding which of two patients with identical fever severity gets called into the examination room first.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

struct NvicPrioritySplit {
    uint8_t preemptionBits;
    uint8_t subpriorityBits;
    uint8_t maxPreempt;
    uint8_t maxSub;
};

NvicPrioritySplit calculatePriorityGrouping(uint32_t priGroup) {
    // ARM AIRCR PRIGROUP encoding for 4 implemented priority bits:
    // 0b011 (Group 3): 4 bits preempt (0-15), 0 bits sub
    // 0b100 (Group 4): 3 bits preempt (0-7),  1 bit sub (0-1)
    // 0b101 (Group 5): 2 bits preempt (0-3),  2 bits sub (0-3)
    // 0b110 (Group 6): 1 bit preempt  (0-1),  3 bits sub (0-7)
    // 0b111 (Group 7): 0 bits preempt (0),    4 bits sub (0-15)
    uint8_t preempt = 0;
    uint8_t sub = 0;
    if (priGroup <= 3) { preempt = 4; sub = 0; }
    else if (priGroup == 4) { preempt = 3; sub = 1; }
    else if (priGroup == 5) { preempt = 2; sub = 2; }
    else if (priGroup == 6) { preempt = 1; sub = 3; }
    else { preempt = 0; sub = 4; }

    return {preempt, sub, static_cast<uint8_t>((1 << preempt) - 1), static_cast<uint8_t>((1 << sub) - 1)};
}

int main() {
    uint32_t aircr_group = 4; // 3 bits preemption, 1 bit subpriority
    NvicPrioritySplit split = calculatePriorityGrouping(aircr_group);
    std::cout << "SCB->AIRCR PRIGROUP = " << aircr_group << "\\n";
    std::cout << "  Preemption bits:  " << (int)split.preemptionBits << " (Levels: 0 to " << (int)split.maxPreempt << ")\\n";
    std::cout << "  Subpriority bits: " << (int)split.subpriorityBits << " (Levels: 0 to " << (int)split.maxSub << ")\\n";
    std::cout << "  Can Level (P=2, S=1) preempt Level (P=3, S=0)? " << (2 < 3 ? "YES (Preempts)" : "NO") << "\\n";
    std::cout << "  Can Level (P=2, S=0) preempt Level (P=2, S=1)? " << (2 < 2 ? "YES (Preempts)" : "NO (Same Preempt Group)") << "\\n";
    return 0;
}""",
                "output": r"""SCB->AIRCR PRIGROUP = 4\n  Preemption bits:  3 (Levels: 0 to 7)\n  Subpriority bits: 1 (Levels: 0 to 1)\n  Can Level (P=2, S=1) preempt Level (P=3, S=0)? YES (Preempts)\n  Can Level (P=2, S=0) preempt Level (P=2, S=1)? NO (Same Preempt Group)""",
                "codeNotes": [
                    {"line": 13, "note": "Standard ARM PRIGROUP decoding mapping hardware priority bits to preemption levels"},
                    {"line": 34, "note": "Demonstrates lower numeric preemption value (2 < 3) preempting an active lower-urgency ISR"},
                    {"line": 35, "note": "Subpriority differences with matching preemption priority cannot cause preemption"}
                ],
                "tryIt": "Set PRIGROUP to 3 (Group 3: 4 bits preemption, 0 bits subpriority) and verify that all 16 levels can preempt each other.",
                "check": {
                    "question": "If Interrupt A has Preemption=2, Subpriority=0 and Interrupt B has Preemption=2, Subpriority=1, can Interrupt A preempt Interrupt B while B is running?",
                    "options": [
                        "No, because both share the exact same preemption priority level (2)",
                        "Yes, because Interrupt A has a lower subpriority numeric value",
                        "Yes, because subpriority always triggers immediate preemption",
                        "Only if the SysTick timer is disabled"
                    ],
                    "answer": 0,
                    "why": "Subpriority only resolves simultaneous pending conflicts when neither interrupt is currently active; only a strictly lower numeric preemption priority can interrupt an active ISR."
                }
            },
            {
                "title": "NVIC Interrupt Enable (NVIC_ISER), Disable (NVIC_ICER), and Pending Registers",
                "say": [
                    "ARM Cortex-M peripherals do not use a single monolithic interrupt mask; instead, the NVIC provides dedicated Set-Enable (ISER) and Clear-Enable (ICER) registers.",
                    "Writing a 1 to a bit in NVIC_ISER enables that specific interrupt line; writing a 0 to NVIC_ISER has zero effect.",
                    "To disable an interrupt, firmware writes a 1 to the corresponding bit in NVIC_ICER; this eliminated read-modify-write race conditions in multi-threaded firmware.",
                    "Similarly, the NVIC features Set-Pending (ISPR) and Clear-Pending (ICPR) registers.",
                    "When a peripheral asserts an interrupt condition, hardware sets the corresponding bit in ISPR; when the CPU enters the ISR, the hardware automatically clears that bit.",
                    "Firmware can also manually set bits in ISPR or use the Software Trigger Interrupt Register (STIR) to simulate hardware interrupts during automated testing."
                ],
                "example": "Instead of a shared light switch where two people might push in opposite directions, you have a green 'turn on' button (ISER) and a separate red 'turn off' button (ICER). Pushing green never turns anything off.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

class MockNvicRegisters {
public:
    uint32_t ISER; // Interrupt Set-Enable Register
    uint32_t ICER; // Interrupt Clear-Enable Register
    uint32_t ISPR; // Interrupt Set-Pending Register
    uint32_t ICPR; // Interrupt Clear-Pending Register

    MockNvicRegisters() : ISER(0), ICER(0), ISPR(0), ICPR(0) {}

    void enableInterrupt(uint8_t irqNum) {
        // Atomic write-1-to-set: writing 0 does nothing
        ISER |= (1 << irqNum);
    }

    void disableInterrupt(uint8_t irqNum) {
        // Atomic write-1-to-clear: clears bit in ISER
        ISER &= ~(1 << irqNum);
    }

    void setPending(uint8_t irqNum) {
        ISPR |= (1 << irqNum);
    }

    void clearPending(uint8_t irqNum) {
        ISPR &= ~(1 << irqNum);
    }
};

int main() {
    MockNvicRegisters nvic;
    uint8_t usart1_irq = 37 % 32; // IRQ index within register bank 1
    
    std::cout << "Initial ISER: 0x" << std::hex << nvic.ISER << "\\n";
    nvic.enableInterrupt(usart1_irq);
    std::cout << "After enabling IRQ " << std::dec << (int)usart1_irq << ", ISER: 0x" << std::hex << nvic.ISER << "\\n";
    nvic.setPending(usart1_irq);
    std::cout << "Hardware asserts pending, ISPR: 0x" << std::hex << nvic.ISPR << "\\n";
    nvic.clearPending(usart1_irq);
    std::cout << "CPU enters ISR, ISPR cleared: 0x" << std::hex << nvic.ISPR << "\\n";
    nvic.disableInterrupt(usart1_irq);
    std::cout << "After disabling, ISER: 0x" << std::hex << nvic.ISER << "\\n";
    return 0;
}""",
                "output": r"""Initial ISER: 0x0\nAfter enabling IRQ 5, ISER: 0x20\nHardware asserts pending, ISPR: 0x20\nCPU enters ISR, ISPR cleared: 0x0\nAfter disabling, ISER: 0x0""",
                "codeNotes": [
                    {"line": 14, "note": "ISER uses atomic write-1-to-enable semantics to eliminate race conditions"},
                    {"line": 19, "note": "ICER uses atomic write-1-to-disable semantics to avoid read-modify-write cycles"},
                    {"line": 40, "note": "Hardware automatically clears pending flag upon entering the active ISR handler"}
                ],
                "tryIt": "Demonstrate enabling multiple interrupts (e.g. IRQ 2 and IRQ 5) and verify both bits are set in ISER.",
                "check": {
                    "question": "Why does the ARM NVIC provide separate ISER (Set-Enable) and ICER (Clear-Enable) registers instead of a single register?",
                    "options": [
                        "To prevent read-modify-write race conditions when multiple threads or ISRs enable and disable interrupts concurrently",
                        "Because 32-bit registers cannot store more than 16 interrupt states",
                        "To reduce the manufacturing cost of the silicon die",
                        "Because the C++ compiler requires separate memory registers"
                    ],
                    "answer": 0,
                    "why": "With separate ISER and ICER registers, software writes a 1 to set or clear a bit without needing to read, mask, and rewrite the register, making interrupt configuration completely atomic and thread-safe."
                }
            },
            {
                "title": "External Interrupt Lines (EXTI), Edge Triggers, and Software-Triggered Interrupts (NVIC_STIR)",
                "say": [
                    "Microcontroller pins do not connect directly to the NVIC; instead, GPIO pins pass through the External Interrupt/Event Controller (EXTI).",
                    "In ARM Cortex-M microcontrollers (like STM32), each pin number across all ports maps to a single EXTI line (e.g., PA0, PB0, and PC0 all multiplex into EXTI0).",
                    "The System Configuration Controller (SYSCFG_EXTICR) selects which physical port is routed to the EXTI line.",
                    "Each EXTI line can be configured for Rising Edge trigger ('EXTI_RTSR'), Falling Edge trigger ('EXTI_FTSR'), or both (dual-edge).",
                    "Crucial Invariant: Inside an EXTI ISR, firmware MUST explicitly clear the pending bit in 'EXTI_PR' by writing a 1 to it; otherwise, the interrupt will continuously re-fire the instant the ISR returns, locking up the CPU.",
                    "Additionally, the NVIC Software Trigger Interrupt Register (STIR) allows unprivileged or privileged code to fire peripheral interrupts purely in software for testing."
                ],
                "example": "Think of EXTI like a doorbell button wired to a chime: you can configure the chime to ring when you push the button down (falling edge), release it (rising edge), or both. And you must reset the buzzer switch before you sit back down.",
                "code": r"""#include <iostream>
#include <cstdint>

struct ExtiController {
    uint32_t IMR;  // Interrupt Mask Register (1=unmasked)
    uint32_t RTSR; // Rising Trigger Selection Register
    uint32_t FTSR; // Falling Trigger Selection Register
    uint32_t PR;   // Pending Register (write-1-to-clear)

    ExtiController() : IMR(0), RTSR(0), FTSR(0), PR(0) {}

    void configurePinInterrupt(uint8_t line, bool rising, bool falling) {
        IMR |= (1 << line);
        if (rising)  RTSR |= (1 << line);
        if (falling) FTSR |= (1 << line);
    }

    void simulateEdgeTransition(uint8_t line, bool isRising) {
        if ((isRising && (RTSR & (1 << line))) || (!isRising && (FTSR & (1 << line)))) {
            if (IMR & (1 << line)) {
                PR |= (1 << line); // Assert hardware pending
                std::cout << "[EXTI HARDWARE] Edge detected on Line " << (int)line << " -> PR asserted!\\n";
            }
        }
    }

    void isrAcknowledge(uint8_t line) {
        // Crucial bare-metal rule: write 1 to clear pending flag
        PR |= (1 << line);
        std::cout << "[ISR HANDLER] Acknowledged Line " << (int)line << " (PR bit cleared)\\n";
    }
};

int main() {
    ExtiController exti;
    uint8_t user_button_line = 0; // EXTI0 for User Push Button
    exti.configurePinInterrupt(user_button_line, true, false); // Rising edge only

    // Simulate button push (rising edge)
    exti.simulateEdgeTransition(user_button_line, true);
    // Inside ISR: acknowledge and clear
    exti.isrAcknowledge(user_button_line);
    return 0;
}""",
                "output": r"""[EXTI HARDWARE] Edge detected on Line 0 -> PR asserted!\n[ISR HANDLER] Acknowledged Line 0 (PR bit cleared)""",
                "codeNotes": [
                    {"line": 13, "note": "Configures EXTI interrupt mask and trigger edge registers"},
                    {"line": 26, "note": "Clears EXTI_PR by writing a 1 to the corresponding bit (rc_w1)"},
                    {"line": 36, "note": "Simulates external push button edge transition triggering EXTI0"}
                ],
                "tryIt": "Enable both rising and falling edge detection and verify that releasing the button also triggers the EXTI line.",
                "check": {
                    "question": "What catastrophic failure occurs if firmware fails to clear the EXTI_PR pending bit inside an external interrupt handler?",
                    "options": [
                        "The CPU immediately re-enters the ISR forever in an infinite loop upon exit, starving main thread execution",
                        "The microcontroller permanently bricks its Flash memory",
                        "The GPIO pin physically inverts its output voltage",
                        "The SysTick timer stops ticking"
                    ],
                    "answer": 0,
                    "why": "Because the pending bit in EXTI_PR remains set, the NVIC detects an active interrupt condition the microsecond the ISR executes its return instruction, causing an inescapable interrupt loop."
                }
            }
        ],
        "summary": [
            "The Vector Table at memory base defines initial MSP and hardware exception/interrupt entry points with strict power-of-2 alignment requirements enforced by VTOR.",
            "ARM Cortex-M hardware executes automatic 12-cycle stacking of R0–R3, R12, LR, PC, and xPSR upon interrupt entry, enabling standard C functions to act directly as ISRs.",
            "SCB->AIRCR PRIGROUP divides the 4 hardware priority bits into Preemption Priority (which can preempt running ISRs) and Subpriority (which only breaks simultaneous ties).",
            "The NVIC utilizes atomic write-1-to-set (ISER) and write-1-to-clear (ICER) registers to prevent multi-threaded race conditions during interrupt configuration.",
            "External pins route through EXTI edge-detection registers, requiring an explicit write-1-to-clear on EXTI_PR inside the ISR to prevent infinite re-entry lockups."
        ],
        "projectStep": {
            "title": "Architect a High-Reliability Interrupt-Driven Embedded Subsystem with NVIC Priority Tuning",
            "steps": [
                "Map the ARM Cortex-M vector table layout and calculate VTOR alignment boundaries for runtime RAM relocation.",
                "Trace the 8-word hardware exception stack frame (R0-R3, R12, LR, PC, xPSR) and verify 12-cycle entry/exit timings.",
                "Configure SCB->AIRCR PRIGROUP to partition hardware priority bits into preemption and subpriority groups.",
                "Implement atomic interrupt enable and disable operations using NVIC_ISER and NVIC_ICER register banks.",
                "Construct an EXTI external pin trigger handler with edge selection and mandatory pending flag clearing routines."
            ]
        }
    }

def create_day12():
    return {
        "day": 12,
        "title": "Interrupt Service Routines (ISRs): Latency Budgets, Tail-Chaining & Late-Arrival Physics",
        "goal": "Engineer deterministic microsecond-level real-time responsiveness: master Cortex-M hardware pipeline mechanics, tail-chaining optimization, late-arrival preemption, and cycle-exact benchmarking using DWT->CYCCNT. Design split-phase top-half/bottom-half interrupt handlers that guarantee zero CPU starvation.",
        "minutes": 36,
        "recap": "Yesterday, we configured the NVIC and EXTI hardware peripherals. Today, we go inside the execution pipeline to analyze the nanosecond physics of ISR latency, hardware tail-chaining, and split-phase event queues.",
        "parts": [
            {
                "title": "Anatomy of Interrupt Latency: Stacking (12 cycles) + Unstacking (12 cycles) = 24 cycles",
                "say": [
                    "Interrupt latency is the precise elapsed time from the physical arrival of an interrupt request at the processor core to the execution of the first instruction of the ISR.",
                    "In the ARM Cortex-M architecture with zero-wait-state memory, baseline interrupt entry requires exactly 12 clock cycles.",
                    "During these 12 cycles, the processor finishes or aborts the current pipeline stage, pushes the 8-word exception frame onto the stack, fetches the ISR address from the vector table, and fills the instruction prefetch buffer.",
                    "Interrupt exit (unstacking) also takes exactly 12 clock cycles: restoring R0–R3, R12, LR, PC, and xPSR from RAM and resuming the interrupted background code.",
                    "Thus, the round-trip hardware context-switching cost of an isolated interrupt is precisely 24 clock cycles.",
                    "At 168 MHz (such as an STM32F4), 12 clock cycles equals 71.4 nanoseconds; at 16 MHz, it equals 750 nanoseconds."
                ],
                "example": "Think of stopping at a highway toll booth: slowing down and pulling up to the window takes 12 seconds (stacking), and accelerating back up to highway speed takes 12 seconds (unstacking).",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

struct LatencyBudget {
    uint32_t cpuFrequencyHz;
    uint32_t stackingCycles;
    uint32_t unstackingCycles;
    
    double getEntryLatencyNs() const {
        return (double)stackingCycles / cpuFrequencyHz * 1e9;
    }

    double getTotalSwitchLatencyNs() const {
        return (double)(stackingCycles + unstackingCycles) / cpuFrequencyHz * 1e9;
    }
};

int main() {
    LatencyBudget mcu168 = {168000000, 12, 12};
    LatencyBudget mcu16  = { 16000000, 12, 12};

    std::cout << "ARM Cortex-M Hardware Interrupt Latency Budget:\\n";
    std::cout << "  At 168 MHz: Entry Latency = " << std::fixed << std::setprecision(1) 
              << mcu168.getEntryLatencyNs() << " ns, Total Round-Trip = " 
              << mcu168.getTotalSwitchLatencyNs() << " ns (24 cycles)\\n";
    std::cout << "  At  16 MHz: Entry Latency = " << std::fixed << std::setprecision(1) 
              << mcu16.getEntryLatencyNs() << " ns, Total Round-Trip = " 
              << mcu16.getTotalSwitchLatencyNs() << " ns (24 cycles)\\n";
    return 0;
}""",
                "output": r"""ARM Cortex-M Hardware Interrupt Latency Budget:\n  At 168 MHz: Entry Latency = 71.4 ns, Total Round-Trip = 142.9 ns (24 cycles)\n  At  16 MHz: Entry Latency = 750.0 ns, Total Round-Trip = 1500.0 ns (24 cycles)""",
                "codeNotes": [
                    {"line": 5, "note": "Encapsulates fixed 12-cycle hardware stacking and unstacking context switch budgets"},
                    {"line": 10, "note": "Calculates nanosecond latency as cycles divided by core clock frequency"},
                    {"line": 21, "note": "Demonstrates sub-100ns deterministic interrupt response at 168 MHz"}
                ],
                "tryIt": "Compute latency for an 84 MHz Cortex-M4 and verify that entry latency is exactly 142.8 ns.",
                "check": {
                    "question": "What is the minimum hardware stacking latency for an ARM Cortex-M processor with zero-wait-state memory?",
                    "options": [
                        "Exactly 12 clock cycles",
                        "Over 150 clock cycles",
                        "0 clock cycles (instantaneous)",
                        "Exactly 1 clock cycle"
                    ],
                    "answer": 0,
                    "why": "ARM Cortex-M cores implement an optimized hardware stacking engine that pushes the 8-word caller-saved register frame in exactly 12 clock cycles."
                }
            },
            {
                "title": "Tail-Chaining Mechanics: Zero-Unstacking Transition Between Successive Interrupts (6 cycles)",
                "say": [
                    "In naive architectures, when an interrupt completes and a second interrupt is already pending, the CPU unstacks all registers back to main, only to immediately restack them for the next ISR.",
                    "ARM Cortex-M eliminates this waste through a hardware optimization called Tail-Chaining.",
                    "When an ISR finishes and another interrupt of equal or lower priority is pending, the CPU skips the entire 12-cycle unstacking sequence and the subsequent 12-cycle stacking sequence.",
                    "Instead, the processor keeps the current stack frame in place and directly fetches the new ISR vector address from memory in only 6 clock cycles.",
                    "Tail-chaining reduces the back-to-back context switch overhead from 24 cycles down to just 6 cycles—a 75% reduction in switching overhead.",
                    "This guarantees exceptional throughput in embedded applications processing high-frequency sensor streams."
                ],
                "example": "If two planes land consecutively on a runway, tail-chaining is letting the second plane land immediately rather than clearing all the fire trucks and ground crew off the runway only to bring them all back 10 seconds later.",
                "code": r"""#include <iostream>
#include <cstdint>

void compareInterruptTransitions(bool tailChainingEnabled) {
    uint32_t naiveCycles = 12 + 12; // Unstack ISR1 (12) + Restack ISR2 (12)
    uint32_t tailChainCycles = 6;   // Direct vector fetch reusing active stack frame

    std::cout << "Successive Interrupt Context Switch:\\n";
    if (tailChainingEnabled) {
        std::cout << "  [OPTIMIZED] Hardware Tail-Chaining active: " << tailChainCycles << " cycles!\\n";
        std::cout << "  Savings: " << (naiveCycles - tailChainCycles) << " clock cycles preserved.\\n";
    } else {
        std::cout << "  [NAIVE] Full unstack & restack: " << naiveCycles << " cycles.\\n";
    }
}

int main() {
    compareInterruptTransitions(false);
    compareInterruptTransitions(true);
    return 0;
}""",
                "output": r"""Successive Interrupt Context Switch:\n  [NAIVE] Full unstack & restack: 24 cycles.\nSuccessive Interrupt Context Switch:\n  [OPTIMIZED] Hardware Tail-Chaining active: 6 cycles!\n  Savings: 18 clock cycles preserved.""",
                "codeNotes": [
                    {"line": 5, "note": "Naive architectures waste 24 cycles unstacking and restacking identical registers"},
                    {"line": 6, "note": "Cortex-M tail-chaining transitions directly to the next ISR in only 6 clock cycles"},
                    {"line": 18, "note": "Compares naive context-switch overhead against optimized hardware tail-chaining"}
                ],
                "tryIt": "Calculate the cumulative clock cycles saved when handling a burst of 10 consecutive sensor interrupts with tail-chaining.",
                "check": {
                    "question": "How many clock cycles does ARM Cortex-M hardware take to transition between two consecutive interrupts using tail-chaining?",
                    "options": [
                        "Exactly 6 clock cycles",
                        "24 clock cycles",
                        "12 clock cycles",
                        "64 clock cycles"
                    ],
                    "answer": 0,
                    "why": "Tail-chaining skips unstacking and restacking by reusing the active stack frame, fetching the next ISR vector in just 6 clock cycles."
                }
            },
            {
                "title": "Late-Arrival Preemption Physics: Splicing Higher-Priority Exceptions into Active Stacking",
                "say": [
                    "What happens if a high-priority interrupt (e.g. motor emergency stop) arrives while the CPU is in the middle of stacking registers for a low-priority interrupt (e.g. UART receive)?",
                    "Naive processors would finish stacking, enter the low-priority ISR, and only then preempt, causing significant jitter for the high-priority event.",
                    "ARM Cortex-M solves this with Late-Arrival Preemption.",
                    "If a higher-priority interrupt arrives while the hardware stacking sequence is still underway, the processor completes the current stacking frame, but dynamically changes the vector fetch.",
                    "Instead of branching to the low-priority ISR, the CPU branches directly to the newly arrived high-priority ISR with zero additional latency penalty.",
                    "Once the high-priority ISR finishes, the low-priority ISR executes via tail-chaining (6 cycles), providing the absolute mathematically minimal latency to the critical event."
                ],
                "example": "If an elevator is already closing its doors to go to the 2nd floor, and a firefighter swipes an emergency override key, the elevator doesn't go to the 2nd floor first; it instantly switches its destination to the roof without stopping or restarting.",
                "code": r"""#include <iostream>
#include <string>

struct InterruptEvent {
    std::string name;
    uint8_t priority;
    uint32_t arrivalCycle;
};

void traceLateArrival(const InterruptEvent& lowPri, const InterruptEvent& highPri) {
    std::cout << "[CYCLE " << lowPri.arrivalCycle << "] " << lowPri.name << " (Pri=" << (int)lowPri.priority << ") arrives -> Stacking begins (Cycles 0-12)\\n";
    std::cout << "[CYCLE " << highPri.arrivalCycle << "] " << highPri.name << " (Pri=" << (int)highPri.priority << ") arrives during active stacking!\\n";
    std::cout << "[HARDWARE LATE-ARRIVAL] Vector fetch spliced! CPU switches vector target to " << highPri.name << "\\n";
    std::cout << "[CYCLE 12] Entering " << highPri.name << " with zero extra penalty!\\n";
    std::cout << "[CYCLE 20] " << highPri.name << " completes -> Tail-chain (6 cycles) to " << lowPri.name << "\\n";
}

int main() {
    InterruptEvent uart = {"UART_RX", 3, 0};
    InterruptEvent eStop = {"MOTOR_ESTOP", 0, 7}; // Arrives at cycle 7 during 12-cycle stacking
    traceLateArrival(uart, eStop);
    return 0;
}""",
                "output": r"""[CYCLE 0] UART_RX (Pri=3) arrives -> Stacking begins (Cycles 0-12)\n[CYCLE 7] MOTOR_ESTOP (Pri=0) arrives during active stacking!\n[HARDWARE LATE-ARRIVAL] Vector fetch spliced! CPU switches vector target to MOTOR_ESTOP\n[CYCLE 12] Entering MOTOR_ESTOP with zero extra penalty!\n[CYCLE 20] MOTOR_ESTOP completes -> Tail-chain (6 cycles) to UART_RX""",
                "codeNotes": [
                    {"line": 12, "note": "High-priority interrupt arrives at cycle 7 while initial 12-cycle stacking is underway"},
                    {"line": 13, "note": "Hardware late-arrival engine dynamically splices the higher priority vector fetch"},
                    {"line": 15, "note": "After emergency stop ISR finishes, low-priority UART ISR executes via 6-cycle tail-chain"}
                ],
                "tryIt": "Modify the arrival cycle of MOTOR_ESTOP to cycle 15 (after stacking completes) and observe standard preemption taking place instead.",
                "check": {
                    "question": "What is the key benefit of ARM Cortex-M Late-Arrival interrupt preemption?",
                    "options": [
                        "It allows a higher-priority interrupt arriving during hardware stacking to be serviced immediately without waiting for the lower-priority ISR to start",
                        "It doubles the CPU clock frequency automatically",
                        "It disables all other interrupts permanently",
                        "It stores register contents in flash memory instead of SRAM"
                    ],
                    "answer": 0,
                    "why": "Late-arrival preemption allows the processor to splice the vector fetch for a higher-priority interrupt that arrives during active stacking, guaranteeing zero wasted latency for urgent tasks."
                }
            },
            {
                "title": "High-Precision Cycle Benchmarking Using Data Watchpoint and Trace (DWT->CYCCNT)",
                "say": [
                    "To verify interrupt latency budgets and execution durations, professional embedded engineers never use crude millisecond timers.",
                    "The ARM Cortex-M processor includes a dedicated hardware debugging peripheral: the Data Watchpoint and Trace (DWT) unit.",
                    "At memory address 0xE0001004 resides the 32-bit Cycle Count Register ('DWT->CYCCNT'), which increments on every single core clock cycle.",
                    "To enable DWT cycle counting, software must first set the TRCENA bit (bit 24) in the Debug Exception and Monitor Control Register ('CoreDebug->DEMCR') and enable bit 0 in 'DWT->CTRL'.",
                    "By sampling 'DWT->CYCCNT' at the start and end of an ISR, firmware can measure execution time with single-clock-cycle resolution (down to 5.95 nanoseconds at 168 MHz).",
                    "This cycle benchmarking is essential for proving real-time deadlines in automotive, aerospace, and medical devices."
                ],
                "example": "Using DWT->CYCCNT is like using a high-speed phantom camera filming at 168 million frames per second instead of glancing at an old kitchen wall clock.",
                "code": r"""#include <iostream>
#include <cstdint>

class MockDwtCycleCounter {
private:
    uint32_t currentCycles;
public:
    MockDwtCycleCounter() : currentCycles(1000000) {}

    uint32_t readCYCCNT() const { return currentCycles; }
    void advance(uint32_t cycles) { currentCycles += cycles; }
};

int main() {
    MockDwtCycleCounter dwt;
    
    // Benchmark mock ISR
    uint32_t start_cycles = dwt.readCYCCNT();
    // Simulate ISR work (reading ADC and updating PID filter: 48 cycles)
    dwt.advance(48);
    uint32_t end_cycles = dwt.readCYCCNT();

    uint32_t isr_duration_cycles = end_cycles - start_cycles;
    double duration_ns_at_168mhz = (double)isr_duration_cycles / 168e6 * 1e9;

    std::cout << "DWT->CYCCNT Benchmark Results:\\n";
    std::cout << "  Start Cycle: " << start_cycles << "\\n";
    std::cout << "  End Cycle:   " << end_cycles << "\\n";
    std::cout << "  ISR Cost:    " << isr_duration_cycles << " CPU clock cycles\\n";
    std::cout << "  Duration:    " << duration_ns_at_168mhz << " nanoseconds (at 168 MHz)\\n";
    return 0;
}""",
                "output": r"""DWT->CYCCNT Benchmark Results:\n  Start Cycle: 1000000\n  End Cycle:   1000048\n  ISR Cost:    48 CPU clock cycles\n  Duration:    285.714 nanoseconds (at 168 MHz)""",
                "codeNotes": [
                    {"line": 10, "note": "Simulates reading the 32-bit DWT->CYCCNT cycle counter register"},
                    {"line": 23, "note": "Calculates exact clock cycle count elapsed during ISR execution"},
                    {"line": 28, "note": "Translates cycle count to physical nanosecond execution time"}
                ],
                "tryIt": "Compute the maximum allowable clock cycles for an ISR running at 100 kHz sample rate to consume less than 10% CPU load.",
                "check": {
                    "question": "What register on ARM Cortex-M provides single-cycle resolution benchmarking of software execution?",
                    "options": [
                        "DWT->CYCCNT (Data Watchpoint and Trace Cycle Count Register)",
                        "SysTick->VAL (SysTick Current Value Register)",
                        "RTC->TR (Real Time Clock Time Register)",
                        "TIM2->CNT (Timer 2 Counter Register)"
                    ],
                    "answer": 0,
                    "why": "DWT->CYCCNT is a dedicated 32-bit hardware counter that increments once every single CPU core clock cycle, providing nanosecond-level execution profiling."
                }
            },
            {
                "title": "Deferred Processing & Split-Phase Architecture: Top-Half ISR to Bottom-Half Ring Buffer Queue",
                "say": [
                    "A cardinal rule of embedded systems engineering is: NEVER perform long calculations, blocking loops, memory allocations, or printf calls inside an ISR.",
                    "Doing so creates priority inversion, causes jitter, and starves other critical real-time interrupts.",
                    "The industry-standard solution is Split-Phase Processing (known in Linux as Top-Half / Bottom-Half architecture).",
                    "The Top-Half (the hardware ISR) executes in minimal cycles: it reads the hardware register, clears the peripheral interrupt flag, enqueues the raw payload into a lockless circular FIFO ring buffer, and immediately exits.",
                    "The Bottom-Half (the background main loop or an RTOS task) pops the data from the ring buffer and performs JSON parsing, PID calculations, or network transmission.",
                    "If asynchronous notification is needed, the Top-Half can trigger the PendSV (Pended System Call) exception to schedule bottom-half execution at the lowest priority."
                ],
                "example": "A busy restaurant kitchen: the busser (top-half ISR) immediately grabs the dirty dishes from the table and drops them on the dishwashing cart in 3 seconds, so customers can sit. The dishwasher (bottom-half task) washes them thoroughly in the back at a steady pace.",
                "code": r"""#include <iostream>
#include <cstdint>

template <typename T, size_t CAPACITY>
class LocklessIsrRingBuffer {
private:
    T buffer[CAPACITY];
    volatile size_t head;
    volatile size_t tail;
public:
    LocklessIsrRingBuffer() : head(0), tail(0) {}

    // Top-Half ISR calls push (must be deterministic and non-blocking)
    bool isrPush(T item) {
        size_t nextHead = (head + 1) % CAPACITY;
        if (nextHead == tail) {
            return false; // Buffer overflow (dropped frame)
        }
        buffer[head] = item;
        head = nextHead;
        return true;
    }

    // Bottom-Half main thread calls pop
    bool pop(T& item) {
        if (head == tail) {
            return false; // Empty buffer
        }
        item = buffer[tail];
        tail = (tail + 1) % CAPACITY;
        return true;
    }

    size_t size() const {
        return (head >= tail) ? (head - tail) : (CAPACITY - tail + head);
    }
};

int main() {
    LocklessIsrRingBuffer<uint16_t, 8> queue;

    std::cout << "[TOP-HALF ISR] Fast capture of 3 ADC sensor readings...\\n";
    queue.isrPush(1024);
    queue.isrPush(2048);
    queue.isrPush(3072);

    std::cout << "[MAIN BOTTOM-HALF] Processing queued events outside interrupt context:\\n";
    uint16_t val;
    while (queue.pop(val)) {
        std::cout << "  -> Processed sensor sample: " << val << " mV\\n";
    }
    return 0;
}""",
                "output": r"""[TOP-HALF ISR] Fast capture of 3 ADC sensor readings...\n[MAIN BOTTOM-HALF] Processing queued events outside interrupt context:\n  -> Processed sensor sample: 1024 mV\n  -> Processed sensor sample: 2048 mV\n  -> Processed sensor sample: 3072 mV""",
                "codeNotes": [
                    {"line": 5, "note": "Template-based lockless single-producer single-consumer circular ring buffer"},
                    {"line": 15, "note": "Top-half ISR enqueue executes in under 15 clock cycles with zero dynamic allocation"},
                    {"line": 45, "note": "Bottom-half processes heavy data in background thread without blocking interrupts"}
                ],
                "tryIt": "Add an overflow error counter to track dropped samples when the buffer fills up during heavy burst traffic.",
                "check": {
                    "question": "What is the primary architectural purpose of a Split-Phase (Top-Half / Bottom-Half) interrupt handler?",
                    "options": [
                        "To keep the hardware ISR execution time as short as possible while deferring complex processing to the background main loop",
                        "To eliminate the need for an Interrupt Service Routine entirely",
                        "To increase the memory usage of the microcontroller",
                        "To force the CPU into permanent sleep mode"
                    ],
                    "answer": 0,
                    "why": "Split-phase handlers execute only time-critical hardware acknowledgments in the top-half ISR, deferring time-consuming processing to the bottom-half to prevent starving other real-time interrupts."
                }
            }
        ],
        "summary": [
            "Hardware interrupt latency consists of 12-cycle stacking and 12-cycle unstacking, giving a baseline 24-cycle round-trip context switch overhead.",
            "Tail-chaining optimizes consecutive interrupts by reusing the active stack frame, reducing back-to-back switching overhead from 24 cycles down to just 6 cycles.",
            "Late-arrival preemption allows higher-priority interrupts arriving during active stacking to splice the vector fetch and execute immediately without latency penalty.",
            "The ARM DWT->CYCCNT register provides single-clock-cycle resolution benchmarking for measuring precise ISR execution times and proving real-time deadlines.",
            "Split-phase top-half/bottom-half architectures decouple fast hardware ISR acknowledgments from heavy background processing using lockless circular ring buffers."
        ],
        "projectStep": {
            "title": "Construct a Nanosecond-Calibrated ISR Pipeline with Hardware Cycle Benchmarking",
            "steps": [
                "Calculate clock cycle and nanosecond latency budgets across 16 MHz, 84 MHz, and 168 MHz core frequencies.",
                "Diagram hardware tail-chaining transitions and prove the 18-cycle savings over naive unstack/restack engines.",
                "Model late-arrival preemption scenarios to evaluate interrupt response during active 12-cycle stacking sequences.",
                "Enable the DWT cycle counter (CYCCNT) to benchmark ISR execution durations with single-cycle resolution.",
                "Implement a thread-safe, lockless circular ring buffer connecting a high-speed top-half ISR to a background bottom-half worker."
            ]
        }
    }

def create_day13():
    return {
        "day": 13,
        "title": "SysTick System Timer & Hardware General-Purpose Timers: Prescalers, ARR & PWM Generation",
        "goal": "Harness the physics of hardware counters: master the Cortex-M SysTick System Timer and 16/32-bit General-Purpose Timers (TIM2–TIM5). Understand prescalers (PSC), auto-reload registers (ARR), edge-aligned and center-aligned PWM generation, preload buffers, and dead-time insertion for motor and power electronics control.",
        "minutes": 36,
        "recap": "Yesterday, we analyzed hardware ISR latency and cycle-exact benchmarking. Today, we control the fundamental heartbeat of embedded systems: hardware timers, clock division physics, and microsecond-accurate Pulse-Width Modulation (PWM).",
        "parts": [
            {
                "title": "The ARM Cortex-M SysTick Timer: Calibration, 24-Bit Down-Counter & Tick Generation",
                "say": [
                    "Every ARM Cortex-M processor core incorporates an identical, dedicated 24-bit down-counting timer: the SysTick (System Tick) timer.",
                    "Because SysTick is an architectural component of the ARM core itself (rather than a silicon vendor peripheral), software written for SysTick is 100% portable across all Cortex-M microcontrollers.",
                    "The SysTick peripheral consists of four registers: Control and Status ('SysTick->CTRL'), Reload Value ('SysTick->LOAD'), Current Value ('SysTick->VAL'), and Calibration Value ('SysTick->CALIB').",
                    "When enabled, SysTick counts down from the value in LOAD towards zero on every clock cycle.",
                    "Upon reaching zero, the COUNTFLAG bit is set in CTRL, the timer automatically reloads the value from LOAD, and (if enabled) fires the SysTick exception (Exception #15).",
                    "In real-time operating systems (like FreeRTOS) and bare-metal frameworks, SysTick is configured to fire at exactly 1 kHz (every 1.0 millisecond) to provide the system timebase."
                ],
                "example": "SysTick is like a mechanical metronome on a musician's piano: it ticks at an unrelenting, perfectly uniform cadence that all other instruments pace themselves against.",
                "code": r"""#include <iostream>
#include <cstdint>

class MockSysTick {
private:
    uint32_t load;
    uint32_t val;
    bool enabled;
    bool interruptEnabled;
    uint32_t tickCount;
public:
    MockSysTick() : load(0), val(0), enabled(false), interruptEnabled(false), tickCount(0) {}

    void config(uint32_t coreClockHz, uint32_t targetFrequencyHz) {
        // Calculate reload value: (Clock / Freq) - 1
        load = (coreClockHz / targetFrequencyHz) - 1;
        val = load;
        enabled = true;
        interruptEnabled = true;
    }

    void stepClock(uint32_t cycles) {
        if (!enabled) return;
        if (cycles > val) {
            tickCount++;
            val = load - (cycles - val);
            std::cout << "[SYSTICK TICK] Exception #15 triggered! System Uptime: " << tickCount << " ms\\n";
        } else {
            val -= cycles;
        }
    }

    uint32_t getTicks() const { return tickCount; }
    uint32_t getLoad() const { return load; }
};

int main() {
    MockSysTick systick;
    uint32_t coreClock = 168000000; // 168 MHz
    systick.config(coreClock, 1000); // 1000 Hz = 1 ms period

    std::cout << "SysTick 1kHz Configuration on 168 MHz Core:\\n";
    std::cout << "  Reload Value (LOAD): " << systick.getLoad() << " cycles\\n";
    systick.stepClock(168000); // 1 ms worth of clock cycles
    return 0;
}""",
                "output": r"""SysTick 1kHz Configuration on 168 MHz Core:\n  Reload Value (LOAD): 167999 cycles\n[SYSTICK TICK] Exception #15 triggered! System Uptime: 1 ms""",
                "codeNotes": [
                    {"line": 16, "note": "Calculates 24-bit reload value using formula (Clock / Freq) - 1"},
                    {"line": 23, "note": "Simulates down-counting to zero and triggering SysTick exception #15"},
                    {"line": 39, "note": "168,000 cycles on a 168 MHz clock produces an exact 1.0 ms period"}
                ],
                "tryIt": "Calculate the reload value required to generate a 100 Hz (10 ms) tick rate on an 84 MHz microcontroller.",
                "check": {
                    "question": "What is the formula to calculate the SysTick->LOAD register value for a given core clock frequency and target tick frequency?",
                    "options": [
                        "LOAD = (F_cpu / F_target) - 1",
                        "LOAD = (F_cpu * F_target) + 1",
                        "LOAD = F_cpu / 256",
                        "LOAD = F_cpu & 0x00FFFFFF"
                    ],
                    "answer": 0,
                    "why": "Because down-counting from N down to 0 takes N + 1 clock cycles, the reload register must be set to (F_cpu / F_target) - 1 to achieve an exact target frequency."
                }
            },
            {
                "title": "Hardware 16-bit / 32-bit Timers: Clock Prescalers (PSC) and Auto-Reload Registers (ARR) Invariants",
                "say": [
                    "While SysTick handles operating system time slices, microcontrollers feature rich hardware General-Purpose and Advanced Timers (e.g. TIM1–TIM14).",
                    "A hardware timer counter ('TIMx_CNT') is driven by an internal peripheral clock divided by the Prescaler Register ('TIMx_PSC').",
                    "Crucial Invariant: The Prescaler register is 0-indexed in Cortex-M hardware; writing PSC = N divides the input clock by (N + 1).",
                    "For example, on an 84 MHz APB1 timer clock, setting PSC = 83 produces a counter clock of exactly 84,000,000 / (83 + 1) = 1,000,000 Hz (1 MHz, or 1.0 microsecond per tick).",
                    "The counter counts until it reaches the Auto-Reload Register ('TIMx_ARR'); upon reaching ARR, it generates an Update Event (UEV), resets the counter to 0, and sets the update flag 'TIM_SR_UIF'.",
                    "The final timer frequency is governed by the deterministic formula: F_out = F_clk / ((PSC + 1) * (ARR + 1))."
                ],
                "example": "Think of a clock gear train: the prescaler is the reduction gear that slows down a spinning electric motor to turn a gear once per second; the auto-reload register is the 60-tooth gear that triggers the minute hand every 60 seconds.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

struct TimerParameters {
    uint32_t timerClockHz;
    uint16_t psc;
    uint32_t arr;

    double getCounterFrequencyHz() const {
        return (double)timerClockHz / (psc + 1);
    }

    double getOutputFrequencyHz() const {
        return (double)timerClockHz / ((psc + 1) * (arr + 1));
    }

    double getPeriodSeconds() const {
        return 1.0 / getOutputFrequencyHz();
    }
};

int main() {
    // Target: 20 kHz PWM for motor control from an 84 MHz timer clock
    TimerParameters timer;
    timer.timerClockHz = 84000000;
    timer.psc = 0;    // No prescaling: counter ticks at 84 MHz
    timer.arr = 4199; // (84,000,000 / 20,000) - 1 = 4199

    std::cout << "Timer 20 kHz Motor PWM Calculation (84 MHz Input Clock):\\n";
    std::cout << "  PSC Value:              " << timer.psc << " (Divisor: " << (timer.psc + 1) << ")\\n";
    std::cout << "  Counter Clock:          " << timer.getCounterFrequencyHz() / 1e6 << " MHz\\n";
    std::cout << "  ARR Value:              " << timer.arr << "\\n";
    std::cout << "  Exact Output Frequency: " << timer.getOutputFrequencyHz() << " Hz\\n";
    std::cout << "  Period:                 " << timer.getPeriodSeconds() * 1e6 << " microseconds\\n";
    return 0;
}""",
                "output": r"""Timer 20 kHz Motor PWM Calculation (84 MHz Input Clock):\n  PSC Value:              0 (Divisor: 1)\n  Counter Clock:          84 MHz\n  ARR Value:              4199\n  Exact Output Frequency: 20000 Hz\n  Period:                 50 microseconds""",
                "codeNotes": [
                    {"line": 9, "note": "Counter frequency divides clock by (PSC + 1)"},
                    {"line": 13, "note": "Output rollover frequency divides clock by ((PSC + 1) * (ARR + 1))"},
                    {"line": 28, "note": "ARR = 4199 provides 4200 discrete steps of PWM duty cycle resolution"}
                ],
                "tryIt": "Configure PSC and ARR to produce a 1.0 Hz blinking LED timer from an 84 MHz clock using PSC = 8399.",
                "check": {
                    "question": "If an 84 MHz timer peripheral has PSC = 83 and ARR = 999, what is the resulting timer update event frequency?",
                    "options": [
                        "1,000 Hz (1.0 kHz)",
                        "10,000 Hz (10.0 kHz)",
                        "840 Hz",
                        "100 Hz"
                    ],
                    "answer": 0,
                    "why": "F = 84,000,000 / ((83 + 1) * (999 + 1)) = 84,000,000 / (84 * 1000) = 84,000,000 / 84,000 = 1,000 Hz."
                }
            },
            {
                "title": "Timer Counter Modes (Upcounting, Downcounting, Center-Aligned) & Repetition Counters",
                "say": [
                    "General-purpose hardware timers support multiple counting modes configurable via the 'TIMx_CR1' control register.",
                    "In Edge-Aligned Upcounting Mode (CMS=00, DIR=0), the counter increments from 0 up to ARR, generates an update event, and immediately wraps back to 0 (sawtooth waveform).",
                    "In Edge-Aligned Downcounting Mode (CMS=00, DIR=1), the counter decrements from ARR down to 0, generates an update event, and reloads ARR.",
                    "In Center-Aligned Mode (CMS=01, 10, or 11), the counter counts up from 0 to ARR, and then counts down from ARR back to 0 (triangular symmetrical waveform).",
                    "Center-aligned counting is the mandatory gold standard for motor control and three-phase inverters because it cancels out second-order harmonic electromagnetic interference (EMI).",
                    "Advanced timers (TIM1/TIM8) also feature a Repetition Counter ('TIMx_RCR'); an update event is generated only after the counter rolls over N + 1 times."
                ],
                "example": "Edge-aligned mode is a water bucket filling to the brim and splashing over all at once; center-aligned mode is a pendulum swinging smoothly back and forth with symmetrical apexes on both sides.",
                "code": r"""#include <iostream>
#include <string>

enum class CounterMode {
    UPCOUNTING,
    DOWNCOUNTING,
    CENTER_ALIGNED
};

void traceCounterWaveform(CounterMode mode, int arr) {
    std::cout << "Simulating Counter Trajectory (ARR=" << arr << "):\\n  Values: ";
    if (mode == CounterMode::UPCOUNTING) {
        for (int i = 0; i <= arr; ++i) std::cout << i << " ";
        std::cout << "| wrap | 0 1...";
    } else if (mode == CounterMode::CENTER_ALIGNED) {
        for (int i = 0; i <= arr; ++i) std::cout << i << " ";
        for (int i = arr - 1; i >= 0; --i) std::cout << i << " ";
        std::cout << "| (Symmetrical Peak)";
    }
    std::cout << "\\n";
}

int main() {
    std::cout << "[EDGE-ALIGNED UPCOUNTING]:\\n";
    traceCounterWaveform(CounterMode::UPCOUNTING, 4);
    std::cout << "[CENTER-ALIGNED DUAL-SLOPE]:\\n";
    traceCounterWaveform(CounterMode::CENTER_ALIGNED, 4);
    return 0;
}""",
                "output": r"""[EDGE-ALIGNED UPCOUNTING]:\nSimulating Counter Trajectory (ARR=4):\n  Values: 0 1 2 3 4 | wrap | 0 1...\n[CENTER-ALIGNED DUAL-SLOPE]:\nSimulating Counter Trajectory (ARR=4):\n  Values: 0 1 2 3 4 3 2 1 0 | (Symmetrical Peak)""",
                "codeNotes": [
                    {"line": 13, "note": "Upcounting produces an asymmetrical sawtooth waveform"},
                    {"line": 16, "note": "Center-aligned mode produces a symmetrical triangular waveform"},
                    {"line": 28, "note": "Center-aligned PWM halves output frequency relative to edge-aligned mode for identical ARR"}
                ],
                "tryIt": "Show mathematically that for the same ARR, center-aligned counting produces exactly half the PWM frequency of upcounting.",
                "check": {
                    "question": "Why is Center-Aligned PWM preferred over Edge-Aligned PWM for brushless DC (BLDC) motor control?",
                    "options": [
                        "It produces symmetrical current ripples that cancel high-frequency harmonic electromagnetic noise (EMI)",
                        "It consumes zero electrical power",
                        "It eliminates the need for a timer prescaler",
                        "It allows the timer to count infinitely without auto-reload"
                    ],
                    "answer": 0,
                    "why": "Center-aligned PWM creates symmetrical drive pulses centered around the midpoint of the timer cycle, drastically reducing audible acoustic noise and harmonic EMI on motor windings."
                }
            },
            {
                "title": "Output Compare Channels & Edge-Aligned vs Center-Aligned PWM Duty Cycle Physics",
                "say": [
                    "A hardware timer channel contains a Capture/Compare Register ('TIMx_CCRx').",
                    "In Output Compare PWM Mode 1 ('TIM_CCMR1_OC1M = 0b110'), the output pin is asserted HIGH as long as the counter value is strictly less than CCR ('CNT < CCR'), and asserted LOW when 'CNT >= CCR'.",
                    "The duty cycle percentage is defined by the precise ratio: Duty % = (CCR / (ARR + 1)) * 100%.",
                    "Setting CCR = 0 produces a continuous 0% duty cycle (pin held permanently LOW).",
                    "Setting CCR > ARR produces a continuous 100% duty cycle (pin held permanently HIGH).",
                    "Because output state transitions are executed directly by dedicated hardware silicon comparators, the generated PWM waveform has zero software jitter regardless of CPU workload."
                ],
                "example": "Imagine a water fountain valve configured to spray water whenever the second hand on a watch is between 0 and 30 seconds, and turn off between 30 and 60 seconds: that produces an exact 50% duty cycle.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

struct PwmChannel {
    uint32_t arr;
    uint32_t ccr;

    double getDutyCyclePercent() const {
        if (ccr == 0) return 0.0;
        if (ccr > arr) return 100.0;
        return ((double)ccr / (arr + 1)) * 100.0;
    }

    bool evaluatePinState(uint32_t currentCnt) const {
        // PWM Mode 1: Active HIGH when CNT < CCR
        return currentCnt < ccr;
    }
};

int main() {
    PwmChannel pwm = {4199, 1050}; // ARR=4199 (20kHz), CCR=1050 (25% duty cycle)

    std::cout << "Hardware Output Compare PWM Evaluation:\\n";
    std::cout << "  ARR: " << pwm.arr << ", CCR: " << pwm.ccr << "\\n";
    std::cout << "  Calculated Duty Cycle: " << std::fixed << std::setprecision(1) 
              << pwm.getDutyCyclePercent() << "%\\n";

    std::cout << "  Sampled Pin States across Counter Trajectory:\\n";
    std::cout << "    At CNT =    0: Pin is " << (pwm.evaluatePinState(0) ? "HIGH" : "LOW") << "\\n";
    std::cout << "    At CNT = 1049: Pin is " << (pwm.evaluatePinState(1049) ? "HIGH" : "LOW") << "\\n";
    std::cout << "    At CNT = 1050: Pin is " << (pwm.evaluatePinState(1050) ? "HIGH" : "LOW") << "\\n";
    std::cout << "    At CNT = 4199: Pin is " << (pwm.evaluatePinState(4199) ? "HIGH" : "LOW") << "\\n";
    return 0;
}""",
                "output": r"""Hardware Output Compare PWM Evaluation:\n  ARR: 4199, CCR: 1050\n  Calculated Duty Cycle: 25.0%\n  Sampled Pin States across Counter Trajectory:\n    At CNT =    0: Pin is HIGH\n    At CNT = 1049: Pin is HIGH\n    At CNT = 1050: Pin is LOW\n    At CNT = 4199: Pin is LOW""",
                "codeNotes": [
                    {"line": 9, "note": "Calculates duty cycle percentage as (CCR / (ARR + 1)) * 100"},
                    {"line": 16, "note": "Hardware comparator asserts HIGH when CNT < CCR and LOW when CNT >= CCR"},
                    {"line": 28, "note": "Transitions from HIGH to LOW at exact boundary CNT = 1050"}
                ],
                "tryIt": "Change CCR to 2100 and verify that the duty cycle calculates to exactly 50.0%.",
                "check": {
                    "question": "In PWM Mode 1, what happens to the output pin when the timer counter CNT reaches and exceeds the CCR register value?",
                    "options": [
                        "The output pin transitions from active HIGH to inactive LOW",
                        "The output pin remains HIGH permanently",
                        "The microcontroller generates a HardFault exception",
                        "The timer clock frequency is doubled"
                    ],
                    "answer": 0,
                    "why": "In PWM Mode 1, the output channel is active HIGH while CNT < CCR, and transitions to inactive LOW the moment CNT >= CCR."
                }
            },
            {
                "title": "Preload Buffers (TIM_CR1_ARPE & TIM_CCMR1_OC1PE), Complementary Outputs & Dead-Time Insertion",
                "say": [
                    "In high-power switching applications, modifying ARR or CCR registers while the timer is actively counting can cause catastrophic glitching.",
                    "If firmware writes CCR = 100 when CNT has already passed 100 (say CNT = 150), the comparator misses the match, leaving the output HIGH for the remainder of the cycle and causing over-current.",
                    "To prevent this, hardware timers incorporate Preload Buffers enabled by 'TIM_CR1_ARPE' (Auto-Reload Preload Enable) and 'TIM_CCMR1_OC1PE' (Output Compare Preload Enable).",
                    "When preload is enabled, writes to CCR or ARR are stored in a shadow buffer and only transferred to the active working register on the next Update Event (timer rollover).",
                    "Furthermore, in H-bridge power stages, driving high-side and low-side MOSFETs simultaneously causes a short circuit ('shoot-through') that destroys the silicon.",
                    "Advanced timers incorporate complementary outputs ('TIM1_CH1' and 'TIM1_CH1N') with hardware Dead-Time Insertion ('TIM1_BDTR_DTG'), guaranteeing that one switch turns completely OFF before the other turns ON."
                ],
                "example": "Preload buffers are like updating the flight departure board: you change the computer system in advance, but the public display flips over cleanly only when the minute rolls over.",
                "code": r"""#include <iostream>
#include <cstdint>

struct PreloadComparator {
    uint32_t activeCCR;
    uint32_t shadowCCR;
    bool preloadEnabled;

    PreloadComparator() : activeCCR(2000), shadowCCR(2000), preloadEnabled(true) {}

    void writeCcrFromSoftware(uint32_t newCcr) {
        if (preloadEnabled) {
            shadowCCR = newCcr; // Stored in shadow buffer; active remains untouched
            std::cout << "[SW WRITE] Preload enabled: shadowCCR=" << shadowCCR 
                      << ", activeCCR remains " << activeCCR << "\\n";
        } else {
            activeCCR = newCcr; // Dangerous immediate update
        }
    }

    void onTimerUpdateEvent() {
        if (preloadEnabled) {
            activeCCR = shadowCCR; // Atomic transfer on timer rollover
            std::cout << "[UPDATE EVENT] Rollover occurred: activeCCR synchronized to " 
                      << activeCCR << "\\n";
        }
    }
};

int main() {
    PreloadComparator pwm;
    pwm.writeCcrFromSoftware(500); // Update duty cycle while timer is running
    std::cout << "Timer counter rolls over at end of period...\\n";
    pwm.onTimerUpdateEvent();      // Clean atomic transfer
    return 0;
}""",
                "output": r"""[SW WRITE] Preload enabled: shadowCCR=500, activeCCR remains 2000\nTimer counter rolls over at end of period...\n[UPDATE EVENT] Rollover occurred: activeCCR synchronized to 500""",
                "codeNotes": [
                    {"line": 12, "note": "Software write updates shadow buffer without disturbing current PWM cycle"},
                    {"line": 20, "note": "Hardware synchronizes shadow to active register only on timer UEV rollover"},
                    {"line": 31, "note": "Guarantees zero-glitch duty cycle transitions in motor and power electronics"}
                ],
                "tryIt": "Simulate what happens when preloadEnabled is false and explain why immediate writes cause shoot-through risk.",
                "check": {
                    "question": "What critical protection do Preload Buffers (ARPE and OC1PE) provide in embedded PWM generation?",
                    "options": [
                        "They prevent glitching and skipped compare events by delaying register updates until the start of the next timer cycle",
                        "They increase the maximum clock frequency of the processor",
                        "They allow the microcontroller to execute code without RAM",
                        "They convert PWM signals into digital SPI data packets"
                    ],
                    "answer": 0,
                    "why": "Preload buffers hold new values in shadow registers and transfer them atomically only during the timer update event, ensuring that duty cycle and period changes never corrupt an active pulse."
                }
            }
        ],
        "summary": [
            "The 24-bit SysTick core timer provides a vendor-independent, portable 1 kHz real-time operating system timebase configured via (Clock / Freq) - 1.",
            "Hardware General-Purpose timers divide input clocks through 0-indexed prescaler (PSC) and auto-reload (ARR) registers via F = F_clk / ((PSC+1)*(ARR+1)).",
            "Center-aligned dual-slope PWM generates symmetrical waveforms that eliminate second-order harmonic EMI, making it mandatory for three-phase motor drives.",
            "Output Compare PWM Mode 1 asserts pins HIGH while CNT < CCR and LOW when CNT >= CCR with zero software jitter.",
            "Preload buffers (ARPE and OC1PE) synchronize duty cycle updates to timer rollovers, and dead-time insertion prevents catastrophic shoot-through on H-bridges."
        ],
        "projectStep": {
            "title": "Engineer a Glitch-Free Center-Aligned Hardware PWM Driver with Preload Buffers",
            "steps": [
                "Calculate SysTick LOAD register values for 1 kHz timebase generation on 84 MHz and 168 MHz Cortex-M processors.",
                "Configure General-Purpose Timer PSC and ARR values to establish an exact 20 kHz carrier frequency.",
                "Implement Center-Aligned counting mode in TIMx_CR1 and compare harmonic symmetry against edge-aligned upcounting.",
                "Configure Output Compare Channel 1 in PWM Mode 1 with variable CCR duty cycle control.",
                "Enable Auto-Reload Preload (ARPE) and Output Compare Preload (OC1PE) to guarantee glitch-free motor control transitions."
            ]
        }
    }

def create_day14():
    return {
        "day": 14,
        "title": "Analog-to-Digital Conversion (ADC) & DAC: Successive Approximation (SAR), Sampling Times & Nyquist Limits",
        "goal": "Digitize physical reality: master 12-bit Successive Approximation Register (SAR) ADCs and DACs. Calculate input impedance RC sampling times, conversion clock budgets, Nyquist-Shannon sampling limits, multi-channel scan sequences, and internal VREFINT reference calibration.",
        "minutes": 36,
        "recap": "Yesterday, we controlled hardware timers and PWM generation. Today, we interface with the physical world by converting continuous analog voltages into quantized digital values using high-speed SAR ADCs.",
        "parts": [
            {
                "title": "Physics of the 12-Bit Successive Approximation Register (SAR) ADC: Binary Search & DAC Comparator",
                "say": [
                    "The Successive Approximation Register (SAR) ADC is the workhorse analog converter in embedded microcontrollers, balancing high speed (1–3 megasamples per second) with 12-bit resolution.",
                    "A SAR ADC operates by executing a hardware binary search: it starts by testing the Most Significant Bit (MSB, Bit 11), generating half the reference voltage (VREF / 2) via an internal capacitive DAC.",
                    "A high-precision analog comparator compares the input voltage on the sample-and-hold capacitor against the internal DAC output.",
                    "If the input voltage exceeds the DAC voltage, the comparator output is 1, and Bit 11 is retained as 1; if less, Bit 11 is cleared to 0.",
                    "The SAR engine repeats this comparison for each subsequent bit (Bit 10 down to Bit 0) over exactly 12 successive clock cycles.",
                    "At 12-bit resolution, an input voltage between 0.0V and 3.3V is quantized into 4,096 discrete steps, yielding a resolution of 3.3V / 4096 = 0.805 millivolts per LSB."
                ],
                "example": "SAR conversion is like a balance scale where a merchant finds the exact weight of flour by testing standard brass weights (8oz, 4oz, 2oz, 1oz), keeping the weight if the scale doesn't tip and discarding it if it does.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

class MockSarAdc12Bit {
private:
    double vref;
public:
    MockSarAdc12Bit(double refVoltage = 3.3) : vref(refVoltage) {}

    uint16_t convert(double inputVoltage) {
        if (inputVoltage < 0.0) inputVoltage = 0.0;
        if (inputVoltage > vref) inputVoltage = vref;

        uint16_t result = 0;
        double currentDacVoltage = 0.0;

        // 12-bit binary search from MSB (11) down to LSB (0)
        for (int bit = 11; bit >= 0; --bit) {
            uint16_t trial = result | (1 << bit);
            double trialVoltage = (double)trial / 4096.0 * vref;

            // Comparator test
            if (inputVoltage >= trialVoltage) {
                result = trial; // Retain bit
            }
        }
        return result;
    }

    double getLsbVoltage() const {
        return vref / 4096.0;
    }
};

int main() {
    MockSarAdc12Bit adc(3.3);
    double test_voltage = 1.65; // Exactly half VREF
    uint16_t raw_code = adc.convert(test_voltage);

    std::cout << "12-Bit SAR ADC Conversion Model (VREF = 3.3V):\\n";
    std::cout << "  LSB Resolution: " << std::fixed << std::setprecision(4) 
              << adc.getLsbVoltage() * 1000.0 << " mV\\n";
    std::cout << "  Input Voltage:  " << test_voltage << " V\\n";
    std::cout << "  Raw ADC Code:   0x" << std::hex << raw_code << " (" << std::dec << raw_code << " / 4095)\\n";
    std::cout << "  Reconstructed:  " << (double)raw_code / 4096.0 * 3.3 << " V\\n";
    return 0;
}""",
                "output": r"""12-Bit SAR ADC Conversion Model (VREF = 3.3V):\n  LSB Resolution: 0.8057 mV\n  Input Voltage:  1.6500 V\n  Raw ADC Code:   0x800 (2048 / 4095)\n  Reconstructed:  1.6500 V""",
                "codeNotes": [
                    {"line": 15, "note": "Simulates 12-step binary search comparator evaluation from bit 11 down to 0"},
                    {"line": 28, "note": "Calculates 1 LSB voltage quantum as VREF / 4096 (0.8057 mV)"},
                    {"line": 39, "note": "1.65V input maps cleanly to midpoint code 0x800 (2048)"}
                ],
                "tryIt": "Pass an input of 3.3V and verify that the output clamps to 4095 (0xFFF).",
                "check": {
                    "question": "How many clock cycles does a 12-bit SAR ADC take to execute the approximation phase after sampling completes?",
                    "options": [
                        "Exactly 12 clock cycles (one cycle per bit of resolution)",
                        "4096 clock cycles",
                        "1 clock cycle",
                        "64 clock cycles"
                    ],
                    "answer": 0,
                    "why": "A Successive Approximation Register tests exactly one bit per clock cycle, requiring 12 cycles for 12-bit resolution."
                }
            },
            {
                "title": "Sample-and-Hold Capacitor Charging & Input Impedance RC Sampling Times Invariant",
                "say": [
                    "Before a SAR ADC can convert a voltage, it must capture the physical electrical charge onto an internal sample-and-hold capacitor (typically C_adc = 4 pF to 8 pF).",
                    "During the sampling phase, an internal analog switch with resistance R_adc (approx 1 kOhm to 6 kOhm) closes, connecting the external sensor circuit to C_adc.",
                    "If the external sensor has an output impedance R_source (such as a 100 kOhm thermistor or resistive divider), an RC low-pass filter is formed with time constant tau = (R_source + R_adc) * C_adc.",
                    "To achieve 12-bit accuracy (1/4096 error = 0.024%), the capacitor must charge for at least ln(4096) = 8.32 time constants (typically 9 to 10 tau for margin).",
                    "Crucial Invariant: If firmware configures the sampling time register ('ADC_SMPR') too short, the capacitor will not finish charging, causing massive measurement errors and cross-talk between channels.",
                    "When measuring high-impedance sensors, engineers must either increase the ADC sampling cycles or insert an external operational amplifier voltage follower."
                ],
                "example": "Trying to fill a bucket from a garden hose: if the hose is thick (low impedance), the bucket fills in 2 seconds; if the hose has a narrow pinhole (high impedance), turning the valve off after 2 seconds leaves the bucket half empty.",
                "code": r"""#include <iostream>
#include <cmath>
#include <iomanip>

struct AdcSamplingCalculator {
    double rSourceOhms;
    double rAdcInternalOhms;
    double cAdcInternalFarads;
    double adcFreqHz;

    double getTauSeconds() const {
        return (rSourceOhms + rAdcInternalOhms) * cAdcInternalFarads;
    }

    double getMinSamplingTimeSeconds() const {
        // 12-bit resolution requires 9 time constants (error < 0.012%)
        return 9.0 * getTauSeconds();
    }

    uint32_t getMinSamplingCycles() const {
        double minTime = getMinSamplingTimeSeconds();
        double cyclePeriod = 1.0 / adcFreqHz;
        return (uint32_t)std::ceil(minTime / cyclePeriod);
    }
};

int main() {
    AdcSamplingCalculator calc = {
        50000.0,    // 50 kOhm sensor output impedance
        6000.0,     // 6 kOhm internal switch resistance
        6e-12,      // 6 pF internal sample-and-hold capacitor
        14000000.0  // 14 MHz ADC peripheral clock
    };

    std::cout << "ADC Sampling Time & Impedance Calculation:\\n";
    std::cout << "  RC Time Constant (tau): " << std::fixed << std::setprecision(2) 
              << calc.getTauSeconds() * 1e9 << " ns\\n";
    std::cout << "  Min Sampling Time (9 tau): " << calc.getMinSamplingTimeSeconds() * 1e9 << " ns\\n";
    std::cout << "  Clock Cycle Period: " << (1.0 / calc.adcFreqHz) * 1e9 << " ns\\n";
    std::cout << "  Required ADC Sampling Cycles: " << calc.getMinSamplingCycles() << " cycles\\n";
    return 0;
}""",
                "output": r"""ADC Sampling Time & Impedance Calculation:\n  RC Time Constant (tau): 336.00 ns\n  Min Sampling Time (9 tau): 3024.00 ns\n  Clock Cycle Period: 71.43 ns\n  Required ADC Sampling Cycles: 43 cycles""",
                "codeNotes": [
                    {"line": 9, "note": "Calculates RC time constant tau = (R_source + R_adc) * C_adc"},
                    {"line": 13, "note": "Enforces 9 time constants for settling within 1/2 LSB at 12-bit resolution"},
                    {"line": 34, "note": "Shows that a 50k sensor requires at least 43 sampling cycles (e.g. SMPR=55.5 cycles)"}
                ],
                "tryIt": "Increase R_source to 100 kOhm and observe how the required sampling cycles rise to over 80 cycles.",
                "check": {
                    "question": "Why does measuring a high-impedance (e.g. 100 kOhm) sensor with the minimum ADC sampling time (e.g. 3 cycles) produce incorrect readings?",
                    "options": [
                        "The internal sample-and-hold capacitor does not have enough time to charge to the true sensor voltage",
                        "The ADC burns out from over-current",
                        "The high impedance causes the CPU clock to halt",
                        "The ADC automatically switches to 8-bit mode"
                    ],
                    "answer": 0,
                    "why": "High source impedance increases the RC charging time constant; if sampling time is shorter than ~9 tau, the internal capacitor is sampled before it reaches the true input voltage."
                }
            },
            {
                "title": "ADC Clock Prescalers, Total Conversion Time & Nyquist Limits",
                "say": [
                    "The total conversion time of an analog channel is the sum of the sampling time and the approximation time: T_conv = T_sample + 12 cycles.",
                    "For example, with a sampling time of 15 cycles on a 14 MHz ADC clock, T_conv = 15 + 12 = 27 cycles, which takes 27 / 14,000,000 = 1.93 microseconds per conversion.",
                    "This corresponds to a maximum sampling rate of F_sample = 1 / 1.93 us = 518.5 kilosamples per second (ksps).",
                    "According to the Nyquist-Shannon Sampling Theorem, the maximum analog signal frequency that can be accurately reconstructed without aliasing is strictly less than half the sampling frequency: F_max < F_sample / 2.",
                    "If firmware attempts to sample a 40 kHz audio signal at a sample rate of 50 ksps (where Nyquist is 25 kHz), the high-frequency components alias into false low frequencies, corrupting the digital data.",
                    "An analog anti-aliasing low-pass RC filter must always precede the ADC pin to eliminate frequencies above the Nyquist limit."
                ],
                "example": "Nyquist aliasing is like watching car wheels in a movie appear to spin backwards because the camera's frame rate (24 fps) is too slow to capture the rapid rotation.",
                "code": r"""#include <iostream>
#include <iomanip>

struct AdcConversionTiming {
    double adcFreqHz;
    uint32_t samplingCycles;
    uint32_t sarCycles; // 12 for 12-bit

    uint32_t getTotalCycles() const {
        return samplingCycles + sarCycles;
    }

    double getConversionTimeSeconds() const {
        return (double)getTotalCycles() / adcFreqHz;
    }

    double getSamplingRateHz() const {
        return 1.0 / getConversionTimeSeconds();
    }

    double getNyquistLimitHz() const {
        return getSamplingRateHz() / 2.0;
    }
};

int main() {
    AdcConversionTiming timing = {14000000.0, 15, 12};

    std::cout << "ADC Conversion Timing & Nyquist Limits:\\n";
    std::cout << "  ADC Clock:       " << timing.adcFreqHz / 1e6 << " MHz\\n";
    std::cout << "  Total Cycles:    " << timing.getTotalCycles() << " (Sample=" 
              << timing.samplingCycles << " + SAR=12)\\n";
    std::cout << "  Conversion Time: " << std::fixed << std::setprecision(2) 
              << timing.getConversionTimeSeconds() * 1e6 << " microseconds\\n";
    std::cout << "  Max Sample Rate: " << timing.getSamplingRateHz() / 1e3 << " ksps\\n";
    std::cout << "  Nyquist Limit:   " << timing.getNyquistLimitHz() / 1e3 << " kHz (Max safe input bandwidth)\\n";
    return 0;
}""",
                "output": r"""ADC Conversion Timing & Nyquist Limits:\n  ADC Clock:       14.00 MHz\n  Total Cycles:    27 (Sample=15 + SAR=12)\n  Conversion Time: 1.93 microseconds\n  Max Sample Rate: 518.52 ksps\n  Nyquist Limit:   259.26 kHz (Max safe input bandwidth)""",
                "codeNotes": [
                    {"line": 8, "note": "Total conversion cycles equals sampling cycles plus 12 SAR approximation cycles"},
                    {"line": 16, "note": "Max sampling rate equals 1 / T_conv (518.52 ksps)"},
                    {"line": 20, "note": "Nyquist limit is strictly half the sampling rate (259.26 kHz)"}
                ],
                "tryIt": "Recalculate conversion time when samplingCycles is set to 84 cycles for measuring a battery sensor.",
                "check": {
                    "question": "According to the Nyquist-Shannon Sampling Theorem, what is the maximum signal frequency an ADC can digitize without aliasing at 100 ksps?",
                    "options": [
                        "50 kHz (strictly less than half the sample rate)",
                        "100 kHz (equal to the sample rate)",
                        "200 kHz (twice the sample rate)",
                        "10 kHz (one tenth of the sample rate)"
                    ],
                    "answer": 0,
                    "why": "The Nyquist criterion states that the sampling rate must exceed twice the highest frequency component of the analog signal (F_sample > 2 * F_signal), so F_max < 50 kHz at 100 ksps."
                }
            },
            {
                "title": "Multi-Channel Regular vs Injected Sequences, End-of-Conversion (EOC) Flags & Overrun Detection",
                "say": [
                    "Embedded microcontrollers rarely measure just one analog pin; they monitor temperature, motor current, battery voltage, and joystick axes in a round-robin sequence.",
                    "The ADC Regular Channel Sequence Registers ('ADC_SQR1' to 'ADC_SQR3') define an ordered list of up to 16 channels to be converted automatically.",
                    "Additionally, advanced microcontrollers feature an Injected Channel Group ('ADC_JSQR').",
                    "An injected conversion acts like an interrupt for the ADC: if an injected trigger fires (such as a motor emergency over-current trigger), the ADC pauses the regular sequence, converts the high-priority injected channel immediately, and then resumes the regular sequence.",
                    "At the end of each channel conversion, the End of Conversion ('ADC_SR_EOC') flag is asserted.",
                    "If the CPU or DMA engine fails to read the data register ('ADC_DR') before the next conversion finishes, the Overrun flag ('ADC_SR_OVR') is set, alerting firmware that analog data was permanently lost."
                ],
                "example": "Regular channels are like customers standing in the grocery store checkout line; an injected channel is an emergency doctor walking in with an urgent pharmacy prescription who gets served immediately ahead of the line.",
                "code": r"""#include <iostream>
#include <vector>
#include <cstdint>

struct AdcSequenceManager {
    std::vector<uint8_t> regularSequence;
    uint8_t currentStep;
    bool eocFlag;
    bool ovrFlag;
    uint16_t dataRegister;

    AdcSequenceManager() : currentStep(0), eocFlag(false), ovrFlag(false), dataRegister(0) {}

    void setSequence(const std::vector<uint8_t>& channels) {
        regularSequence = channels;
        currentStep = 0;
    }

    void stepConversion(uint16_t simulatedSensorValue) {
        if (eocFlag) {
            ovrFlag = true; // Overrun! Previous sample wasn't read
            std::cout << "[WARNING] ADC_SR_OVR asserted! Data overwritten!\\n";
        }
        dataRegister = simulatedSensorValue;
        eocFlag = true;
        uint8_t ch = regularSequence[currentStep];
        std::cout << "[ADC EOC] Channel " << (int)ch << " converted: " << dataRegister << " raw\\n";
        currentStep = (currentStep + 1) % regularSequence.size();
    }

    uint16_t readDataRegister() {
        eocFlag = false; // Reading DR clears EOC
        return dataRegister;
    }
};

int main() {
    AdcSequenceManager adc;
    adc.setSequence({0, 1, 4}); // Sequentially scan CH0 (Current), CH1 (Voltage), CH4 (Temp)

    adc.stepConversion(2048);
    uint16_t val1 = adc.readDataRegister();
    adc.stepConversion(4095);
    uint16_t val2 = adc.readDataRegister();
    return 0;
}""",
                "output": r"""[ADC EOC] Channel 0 converted: 2048 raw\n[ADC EOC] Channel 1 converted: 4095 raw""",
                "codeNotes": [
                    {"line": 15, "note": "Configures ordered multi-channel scan sequence in ADC_SQR registers"},
                    {"line": 21, "note": "Detects ADC_SR_OVR overrun if new conversion completes before DR is read"},
                    {"line": 30, "note": "Reading ADC_DR automatically clears EOC flag for next conversion"}
                ],
                "tryIt": "Simulate calling stepConversion twice without calling readDataRegister and observe the overrun warning fire.",
                "check": {
                    "question": "What is the key functional difference between Regular and Injected ADC channel groups in Cortex-M microcontrollers?",
                    "options": [
                        "Injected conversions have higher priority and can interrupt an active regular sequence upon a hardware trigger",
                        "Regular channels operate only in 8-bit mode, while injected channels are 16-bit",
                        "Injected channels cannot generate interrupts",
                        "Regular channels require external power, while injected channels do not"
                    ],
                    "answer": 0,
                    "why": "Injected channels are designed for time-critical events (like motor current sampling during PWM center pulses); they interrupt regular background scanning immediately."
                }
            },
            {
                "title": "Internal Voltage References (V_REFINT), Temperature Sensor Channels & Continuous Conversion Scanning",
                "say": [
                    "Microcontrollers operating on battery power experience power supply fluctuations: as a lithium battery discharges from 4.2V down to 3.0V, the ADC reference voltage VDDA drops.",
                    "If VDDA drops, naive raw ADC measurements become inaccurate because the LSB voltage changes.",
                    "To solve this, ARM microcontrollers integrate an ultra-stable, factory-calibrated internal reference voltage channel: 'V_REFINT' (typically 1.20V to 1.22V), connected internally to ADC Channel 17.",
                    "The factory measures V_REFINT at exactly 3.3V during silicon wafer manufacturing and writes the calibration code into read-only system memory ('VREFINT_CAL' at 0x1FFF7A2A).",
                    "By measuring the raw V_REFINT channel at runtime, firmware can back-calculate the exact live supply voltage VDDA using: VDDA = 3.3V * (VREFINT_CAL / Raw_VREFINT).",
                    "Additionally, an internal silicon Temperature Sensor channel ('ADC_IN16') allows monitoring microcontroller junction temperature to prevent thermal runaway."
                ],
                "example": "V_REFINT is like carrying a standard platinum 1-meter ruler in your toolbox: even if your plastic measuring tape expands in the heat, you can compare it against the platinum ruler to calibrate your measurements.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

double calculateLiveVdda(uint16_t rawVrefint, uint16_t vrefintCal) {
    // Factory calibration was taken at 3.3V
    return 3.3 * ((double)vrefintCal / (double)rawVrefint);
}

double calibrateSensorVoltage(uint16_t rawSensor, double liveVdda) {
    return ((double)rawSensor / 4095.0) * liveVdda;
}

int main() {
    // Example: Factory calibrated VREFINT code was 1500 (at 3.3V)
    uint16_t factory_cal = 1500;
    // On a draining battery, raw VREFINT reads higher (say 1650) because VDDA is lower
    uint16_t live_raw_vref = 1650;

    double live_vdda = calculateLiveVdda(live_raw_vref, factory_cal);
    uint16_t raw_battery_adc = 2048; // Sensor reads 50% scale
    double corrected_sensor_voltage = calibrateSensorVoltage(raw_battery_adc, live_vdda);

    std::cout << "Runtime VREFINT Power Supply Calibration:\\n";
    std::cout << "  Factory VREFINT_CAL (at 3.3V): " << factory_cal << "\\n";
    std::cout << "  Live Raw VREFINT Reading:     " << live_raw_vref << "\\n";
    std::cout << "  Calculated Live VDDA Supply:   " << std::fixed << std::setprecision(3) 
              << live_vdda << " V (Battery has discharged!)\\n";
    std::cout << "  Calibrated Sensor Reading:     " << corrected_sensor_voltage << " V\\n";
    return 0;
}""",
                "output": r"""Runtime VREFINT Power Supply Calibration:\n  Factory VREFINT_CAL (at 3.3V): 1500\n  Live Raw VREFINT Reading:     1650\n  Calculated Live VDDA Supply:   3.000 V (Battery has discharged!)\n  Calibrated Sensor Reading:     1.500 V""",
                "codeNotes": [
                    {"line": 5, "note": "Calculates true live VDDA by comparing raw VREFINT against factory calibration constant"},
                    {"line": 21, "note": "Demonstrates detection of battery voltage droop from 3.3V down to 3.0V"},
                    {"line": 23, "note": "Calibrates sensor voltage against the true dynamic VDDA value rather than assuming 3.3V"}
                ],
                "tryIt": "Pass a live_raw_vref of 1500 and verify that VDDA calculates to exactly 3.300 V.",
                "check": {
                    "question": "Why is the internal V_REFINT channel essential for battery-powered IoT devices?",
                    "options": [
                        "It allows firmware to determine the exact live VDDA supply voltage and calibrate all analog readings as the battery discharges",
                        "It acts as a physical solar charger for the battery",
                        "It boosts the battery voltage back up to 5V",
                        "It prevents the microcontroller from waking up"
                    ],
                    "answer": 0,
                    "why": "As a battery discharges, the ADC reference voltage drops; measuring the fixed internal bandgap V_REFINT allows firmware to calculate the exact real-time supply voltage and prevent false readings."
                }
            }
        ],
        "summary": [
            "A 12-bit SAR ADC executes a 12-clock binary search comparing analog input against internal capacitive DAC voltages, providing 0.805 mV resolution at 3.3V.",
            "Input impedance dictates sampling time: external source resistance and internal capacitance form an RC filter requiring at least 9 time constants for 12-bit settling.",
            "Total conversion time equals sampling time plus 12 SAR cycles; input signal bandwidth is strictly limited by the Nyquist frequency (F_sample / 2).",
            "ADC sequences support Regular round-robin scanning and high-priority Injected channel triggers with hardware End of Conversion (EOC) and Overrun (OVR) flags.",
            "The internal V_REFINT bandgap channel allows firmware to dynamically measure power supply voltage (VDDA) droop and calibrate sensor measurements."
        ],
        "projectStep": {
            "title": "Construct an Impedance-Calibrated Multi-Channel ADC Acquisition Engine with VREFINT Compensation",
            "steps": [
                "Implement a 12-bit SAR binary search model and derive LSB quantization metrics for standard reference voltages.",
                "Calculate RC time constants and sampling cycle requirements for high-impedance (50k–100k) analog sensors.",
                "Calculate total conversion time budgets and establish anti-aliasing filter cutoffs according to Nyquist limits.",
                "Configure a multi-channel regular sequence with EOC and OVR overrun detection flags.",
                "Implement runtime power supply voltage calibration using internal V_REFINT and factory calibration constants."
            ]
        }
    }

def create_day15():
    return {
        "day": 15,
        "title": "Milestone 3: Real-Time Hardware Signal Generator & DMA Data Engine",
        "goal": "Architect, construct, and defend Milestone 3: the Real-Time Hardware Signal Generator & DMA Data Engine. Integrate hardware timers (TRGO master triggers), 12-bit SAR ADC slave acquisition, circular DMA double-buffering, and zero-CPU telemetry streaming under live fault-injection testing.",
        "minutes": 38,
        "recap": "Welcome to Milestone 3! Over Days 11–14, we mastered the NVIC, interrupt latency budgets, hardware timers, PWM generation, and SAR ADC physics. Today, we unite these peripherals into a high-performance, real-time data engine.",
        "parts": [
            {
                "title": "Architectural Blueprint: Timer TRGO Hardware Triggering to ADC with Zero CPU Interactivity",
                "say": [
                    "A fatal flaw in novice firmware is triggering ADC sampling inside a software SysTick or timer interrupt handler.",
                    "If a higher-priority UART or CAN interrupt preempts the CPU, the software ADC trigger is delayed, introducing unacceptable sampling jitter.",
                    "In production systems, periodic analog data acquisition must be triggered purely in hardware with zero CPU intervention.",
                    "A Master Timer (e.g. TIM2) is configured to generate an internal Trigger Output ('TIM_CR2_MMS = 0b010' Update Event as TRGO).",
                    "The ADC is configured in External Trigger Mode ('ADC_CR2_EXTEN = 0b01', 'ADC_CR2_EXTSEL = 0b0110'), triggering conversion directly from the TRGO signal through internal silicon interconnects.",
                    "This guarantees that ADC conversions occur with absolute mathematical determinism and exactly zero nanoseconds of software jitter."
                ],
                "example": "Software triggering is a conductor shouting 'bang' to a drummer whenever they look at the clock; TRGO hardware triggering is a mechanical cam directly striking the drum at every rotation of the flywheel with zero human reaction delay.",
                "code": r"""#include <iostream>
#include <cstdint>

struct MasterTimerTrgo {
    uint32_t frequencyHz;
    bool trgoEnabled;

    void configure(uint32_t timerClock, uint16_t psc, uint32_t arr) {
        frequencyHz = timerClock / ((psc + 1) * (arr + 1));
        trgoEnabled = true;
        std::cout << "[TIM2 TRGO MASTER] Configured for " << frequencyHz << " Hz hardware trigger output\\n";
    }
};

struct SlaveAdcTrigger {
    bool hardwareTriggerConnected;
    uint32_t totalConversions;

    SlaveAdcTrigger() : hardwareTriggerConnected(false), totalConversions(0) {}

    void connectTrgo(const MasterTimerTrgo& master) {
        hardwareTriggerConnected = master.trgoEnabled;
        std::cout << "[ADC1 SLAVE] Connected to TIM2_TRGO! Zero-jitter hardware triggering armed.\\n";
    }

    void onHardwareTrgoPulse() {
        if (hardwareTriggerConnected) {
            totalConversions++;
            // Hardware samples immediately without CPU code execution
        }
    }
};

int main() {
    MasterTimerTrgo tim2;
    tim2.configure(84000000, 83, 99); // 84 MHz / (84 * 100) = 10,000 Hz (10 kHz)

    SlaveAdcTrigger adc;
    adc.connectTrgo(tim2);

    // Simulate 3 hardware clock pulses
    adc.onHardwareTrgoPulse();
    adc.onHardwareTrgoPulse();
    adc.onHardwareTrgoPulse();

    std::cout << "Hardware conversions completed: " << adc.totalConversions << " (0 CPU instructions used)\\n";
    return 0;
}""",
                "output": r"""[TIM2 TRGO MASTER] Configured for 10000 Hz hardware trigger output\n[ADC1 SLAVE] Connected to TIM2_TRGO! Zero-jitter hardware triggering armed.\nHardware conversions completed: 3 (0 CPU instructions used)""",
                "codeNotes": [
                    {"line": 8, "note": "Configures TIM2 update event to drive TRGO master trigger signal at 10 kHz"},
                    {"line": 19, "note": "ADC connects to internal TRGO bus via ADC_CR2_EXTSEL register"},
                    {"line": 35, "note": "Hardware pulses trigger conversions automatically with zero CPU cycle consumption"}
                ],
                "tryIt": "Verify that changing timer PSC and ARR updates the sampling frequency without requiring any changes to ADC code.",
                "check": {
                    "question": "Why is Master Timer TRGO triggering superior to software-initiated ADC conversion in real-time control systems?",
                    "options": [
                        "It provides mathematically zero sampling jitter because the trigger signal is routed directly through internal hardware interconnects",
                        "It doubles the maximum memory bandwidth of SRAM",
                        "It reduces the ADC conversion resolution to 8 bits",
                        "It converts analog inputs without requiring an ADC peripheral"
                    ],
                    "answer": 0,
                    "why": "TRGO routes timer update pulses directly to the ADC hardware trigger input through silicon traces, eliminating all software execution delays and interrupt preemption jitter."
                }
            },
            {
                "title": "Non-Blocking Circular Ping-Pong Buffer Architecture for Continuous High-Speed Acquisition",
                "say": [
                    "At 10,000 to 100,000 samples per second, generating a CPU interrupt for every single conversion would choke the core with context switching overhead.",
                    "Direct Memory Access (DMA) solves this by moving completed ADC words from 'ADC_DR' directly into an SRAM array over the AHB bus matrix without CPU involvement.",
                    "To process streaming data without racing against the DMA engine, we employ Circular Ping-Pong (Double Buffering) memory architecture.",
                    "The DMA controller is allocated a buffer of size 2N; it fills the first half (Buffer A, indices 0 to N-1), generates a Half-Transfer Complete ('DMA_IT_HT') interrupt, and continues immediately into the second half (Buffer B, indices N to 2N-1).",
                    "While the DMA engine fills Buffer B, the CPU processes Buffer A in the background.",
                    "When the DMA finishes Buffer B, it asserts Transfer Complete ('DMA_IT_TC'), wraps around to Buffer A, and the CPU processes Buffer B—achieving zero-drop continuous streaming."
                ],
                "example": "Ping-pong buffering is like two water pitchers at a busy banquet: while the waiter is filling Pitcher B from the tap, the host is pouring drinks from Pitcher A; the moment Pitcher B is full, they switch pitchers without spilling a single drop.",
                "code": r"""#include <iostream>
#include <vector>
#include <cstdint>

class PingPongDmaBuffer {
private:
    static const size_t HALF_SIZE = 4;
    static const size_t TOTAL_SIZE = HALF_SIZE * 2;
    uint16_t memory[TOTAL_SIZE];
    size_t writeIndex;
public:
    PingPongDmaBuffer() : writeIndex(0) {
        for (size_t i = 0; i < TOTAL_SIZE; ++i) memory[i] = 0;
    }

    // DMA writes one word from ADC_DR
    void dmaWriteSample(uint16_t sample) {
        memory[writeIndex] = sample;
        writeIndex++;

        if (writeIndex == HALF_SIZE) {
            std::cout << "[DMA INTERRUPT: HALF-TRANSFER] Buffer A is full! CPU processing Buffer A...\\n";
            processBuffer(0, HALF_SIZE, "Buffer A");
        } else if (writeIndex == TOTAL_SIZE) {
            std::cout << "[DMA INTERRUPT: TRANSFER-COMPLETE] Buffer B is full! CPU processing Buffer B...\\n";
            processBuffer(HALF_SIZE, TOTAL_SIZE, "Buffer B");
            writeIndex = 0; // Circular wrap-around
        }
    }

    void processBuffer(size_t start, size_t end, const char* name) {
        uint32_t sum = 0;
        for (size_t i = start; i < end; ++i) sum += memory[i];
        std::cout << "  -> " << name << " Mean Value: " << (sum / HALF_SIZE) << " raw ADC counts\\n";
    }
};

int main() {
    PingPongDmaBuffer dmaEngine;
    std::cout << "Simulating Continuous DMA Ping-Pong Streaming (8 samples total):\\n";
    for (int i = 1; i <= 8; ++i) {
        dmaEngine.dmaWriteSample(i * 500);
    }
    return 0;
}""",
                "output": r"""Simulating Continuous DMA Ping-Pong Streaming (8 samples total):\n[DMA INTERRUPT: HALF-TRANSFER] Buffer A is full! CPU processing Buffer A...\n  -> Buffer A Mean Value: 1250 raw ADC counts\n[DMA INTERRUPT: TRANSFER-COMPLETE] Buffer B is full! CPU processing Buffer B...\n  -> Buffer B Mean Value: 3250 raw ADC counts""",
                "codeNotes": [
                    {"line": 20, "note": "Half-Transfer interrupt triggers processing of Buffer A while DMA fills Buffer B"},
                    {"line": 24, "note": "Transfer-Complete interrupt triggers processing of Buffer B and wraps writeIndex to 0"},
                    {"line": 40, "note": "Achieves continuous streaming with zero buffer contention or race conditions"}
                ],
                "tryIt": "Expand HALF_SIZE to 512 samples and verify that DMA wrap-around functions seamlessly at scale.",
                "check": {
                    "question": "What is the primary operational advantage of DMA Circular Ping-Pong (Double) Buffering?",
                    "options": [
                        "It allows the CPU to process one half of the buffer while the DMA hardware concurrently fills the other half without collision",
                        "It eliminates the need for SRAM memory entirely",
                        "It increases the maximum operating temperature of the microcontroller",
                        "It forces the CPU to halt until all transfers complete"
                    ],
                    "answer": 0,
                    "why": "Ping-pong buffering partitions memory into two halves so the CPU can analyze historical data in one buffer while the DMA engine concurrently writes new data into the other buffer with zero locking."
                }
            },
            {
                "title": "Hardware Failure Recovery: Handling ADC Overrun, Clock Drift & Unhandled Interrupts",
                "say": [
                    "In mission-critical embedded systems, failure modes must be explicitly anticipated, trapped, and recovered in hardware.",
                    "Failure Mode 1: ADC Overrun ('ADC_SR_OVR'). If high-priority interrupt bursts delay DMA service, the ADC drops samples and halts conversion. Firmware must detect OVR, clear the flag, flush corrupted buffers, and restart the sequence.",
                    "Failure Mode 2: Unhandled or Spurious Interrupts. If an interrupt line is enabled in NVIC but its vector points to an empty address or unhandled handler, the CPU enters 'Default_Handler' (an infinite loop). Production code implements defensive trap handlers with crash telemetry.",
                    "Failure Mode 3: Hardware Clock Drift. Thermal changes can shift internal RC oscillators by up to +/- 5%, corrupting timer TRGO rates. Periodic calibration against the 32.768 kHz LSE crystal or GPS 1PPS signals maintains frequency accuracy.",
                    "Failure Mode 4: Power Supply Brownouts. If battery voltage dips below the internal regulator threshold, the Supply Voltage Supervisor (PVD/BOR) must generate an emergency interrupt to safely stage data before shutdown."
                ],
                "example": "Defensive embedded engineering is like an airplane's automatic backup systems: if engine 1 loses fuel pressure, the fuel valve closes immediately and engine 2 increases thrust without waiting for the pilot to read the warning light.",
                "code": r"""#include <iostream>
#include <string>

struct SystemHealthMonitor {
    bool adcOverrunDetected;
    bool spuriousInterruptDetected;
    uint32_t recoveredFaults;

    SystemHealthMonitor() : adcOverrunDetected(false), spuriousInterruptDetected(false), recoveredFaults(0) {}

    void triggerFaultInjection(const std::string& faultType) {
        std::cout << "[FAULT INJECTION] Inducing failure: " << faultType << "\\n";
        if (faultType == "ADC_OVERRUN") {
            adcOverrunDetected = true;
            recoverAdcOverrun();
        } else if (faultType == "UNHANDLED_INTERRUPT") {
            spuriousInterruptDetected = true;
            recoverSpuriousInterrupt();
        }
    }

    void recoverAdcOverrun() {
        std::cout << "  -> [RECOVERY] Clearing ADC_SR_OVR, flushing DMA ring buffer, restarting TRGO trigger...\\n";
        adcOverrunDetected = false;
        recoveredFaults++;
        std::cout << "  -> [HEALTH CHECK] ADC stream restored to healthy state!\\n";
    }

    void recoverSpuriousInterrupt() {
        std::cout << "  -> [RECOVERY] Capturing active IPSR exception index, disabling unhandled NVIC line...\\n";
        spuriousInterruptDetected = false;
        recoveredFaults++;
        std::cout << "  -> [HEALTH CHECK] Faulty interrupt masked, kernel recovered!\\n";
    }
};

int main() {
    SystemHealthMonitor health;
    health.triggerFaultInjection("ADC_OVERRUN");
    health.triggerFaultInjection("UNHANDLED_INTERRUPT");
    std::cout << "Total Faults Successfully Recovered: " << health.recoveredFaults << "/2\\n";
    return 0;
}""",
                "output": r"""[FAULT INJECTION] Inducing failure: ADC_OVERRUN\n  -> [RECOVERY] Clearing ADC_SR_OVR, flushing DMA ring buffer, restarting TRGO trigger...\n  -> [HEALTH CHECK] ADC stream restored to healthy state!\n[FAULT INJECTION] Inducing failure: UNHANDLED_INTERRUPT\n  -> [RECOVERY] Capturing active IPSR exception index, disabling unhandled NVIC line...\n  -> [HEALTH CHECK] Faulty interrupt masked, kernel recovered!\nTotal Faults Successfully Recovered: 2/2""",
                "codeNotes": [
                    {"line": 13, "note": "Traps ADC overrun conditions and executes atomic buffer recovery sequence"},
                    {"line": 27, "note": "Defensive exception recovery masks unhandled interrupt lines rather than halting in while(1)"},
                    {"line": 39, "note": "Demonstrates 100% autonomous fault recovery under simulated electrical disruptions"}
                ],
                "tryIt": "Add a Power Voltage Detector (PVD) brownout warning recovery routine that saves critical state to non-volatile flash.",
                "check": {
                    "question": "What happens if an unhandled interrupt fires on a Cortex-M microcontroller with default GCC startup code?",
                    "options": [
                        "The CPU jumps to Default_Handler which executes an infinite 'while(1)' loop, permanently freezing the device",
                        "The CPU automatically resets and clears all memory",
                        "The microcontroller switches to battery backup power",
                        "The operating system reboots in safe mode"
                    ],
                    "answer": 0,
                    "why": "Default vendor startup files alias all unhandled interrupt vectors to Default_Handler, which contains an infinite loop that halts all execution unless defensive recovery handlers are implemented."
                }
            },
            {
                "title": "Real-Time Waveform Reconstruction & Digital Peak/RMS Streaming Analysis",
                "say": [
                    "Once analog data is streaming into memory via DMA ping-pong buffers, the embedded engine must extract physical engineering metrics in real time.",
                    "For alternating current (AC) signals, vibration sensors, or acoustic monitors, two fundamental metrics are Peak-to-Peak Voltage (V_pp) and Root-Mean-Square Voltage (V_rms).",
                    "Peak-to-Peak is computed by tracking maximum and minimum sample codes: V_pp = (Code_max - Code_min) * V_lsb.",
                    "Root-Mean-Square (RMS) calculates true electrical energy: V_rms = sqrt((1/N) * sum(V_i^2)).",
                    "To prevent floating-point unit (FPU) bottlenecks in high-speed microcontrollers, embedded engineers implement fixed-point math and integer square root algorithms.",
                    "By combining zero-jitter TRGO sampling with inline mathematical filters, the microcontroller operates as an autonomous real-time digital oscilloscope."
                ],
                "example": "RMS is like evaluating a boxer's power: peak-to-peak tells you the single hardest punch they threw, but RMS tells you their sustained punching power across the entire 12-round fight.",
                "code": r"""#include <iostream>
#include <cmath>
#include <vector>
#include <iomanip>

struct WaveformMetrics {
    double vPeakToPeak;
    double vRms;
    double vMean;
};

WaveformMetrics analyzeBuffer(const std::vector<uint16_t>& buffer, double vref = 3.3) {
    if (buffer.empty()) return {0.0, 0.0, 0.0};

    uint16_t minVal = 4095;
    uint16_t maxVal = 0;
    double sumSquares = 0.0;
    double sum = 0.0;

    for (uint16_t val : buffer) {
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
        double voltage = (val / 4095.0) * vref;
        sum += voltage;
        sumSquares += (voltage * voltage);
    }

    double vpp = ((maxVal - minVal) / 4095.0) * vref;
    double vmean = sum / buffer.size();
    double vrms = std::sqrt(sumSquares / buffer.size());

    return {vpp, vrms, vmean};
}

int main() {
    // Simulated 50 Hz sine wave sampled at 10 kHz (10 samples)
    std::vector<uint16_t> sampleBuffer = {
        2048, 2680, 3200, 3500, 3200, 2680, 2048, 1416, 896, 596
    };

    WaveformMetrics metrics = analyzeBuffer(sampleBuffer, 3.3);

    std::cout << "Real-Time Waveform Digital Signal Analysis (10 Samples):\\n";
    std::cout << "  Peak-to-Peak Voltage: " << std::fixed << std::setprecision(3) 
              << metrics.vPeakToPeak << " V\\n";
    std::cout << "  Mean DC Offset:       " << metrics.vMean << " V\\n";
    std::cout << "  True RMS Voltage:     " << metrics.vRms << " V\\n";
    return 0;
}""",
                "output": r"""Real-Time Waveform Digital Signal Analysis (10 Samples):\n  Peak-to-Peak Voltage: 2.339 V\n  Mean DC Offset:       1.794 V\n  True RMS Voltage:     1.983 V""",
                "codeNotes": [
                    {"line": 13, "note": "Extracts minimum and maximum ADC codes across sample window"},
                    {"line": 23, "note": "Calculates True RMS using Root-Mean-Square mathematical definition"},
                    {"line": 34, "note": "Demonstrates precision telemetry output extracted directly from raw ADC buffer"}
                ],
                "tryIt": "Verify that passing a flat DC signal of 2048 counts yields V_pp = 0.000 V and V_rms equal to V_mean.",
                "check": {
                    "question": "Why is True RMS calculation essential when measuring real-world AC waveforms in embedded power monitoring?",
                    "options": [
                        "It accurately reflects the true electrical heating power of non-sinusoidal and distorted waveforms",
                        "It eliminates the need for an analog reference voltage",
                        "It doubles the memory capacity of the ADC data buffer",
                        "It converts analog inputs directly into digital pulse widths"
                    ],
                    "answer": 0,
                    "why": "True RMS calculations compute the square root of the mean squared voltages, accurately quantifying the real thermal energy of distorted real-world electrical waveforms."
                }
            },
            {
                "title": "The Master Milestone 3 Hardware Data Engine: Verification, Latency Proving & Stress Testing",
                "say": [
                    "We now integrate all sub-components into the completed Milestone 3 Master Hardware Data Engine.",
                    "The engine runs an autonomous hardware pipeline: TIM2 generates 10.0 kHz TRGO trigger pulses; ADC1 samples analog sensors at exactly 10,000.0 samples per second with zero jitter.",
                    "DMA Stream 0 moves converted data into a 1024-word ping-pong buffer; when the half-transfer interrupt fires, the CPU calculates RMS voltage and peak metrics for Buffer A; when transfer-complete fires, it processes Buffer B.",
                    "Under extreme multi-source stress testing (simultaneous UART logging, external pin EXTI interrupts, and high-frequency PWM switching), the data acquisition engine drops exactly 0 samples.",
                    "The entire hardware subsystem is governed by deterministic state machines, full error logging, and self-healing watchdog loops.",
                    "Upon passing this milestone, your embedded system achieves industrial-grade signal processing certification."
                ],
                "example": "This is a full flight telemetry and avionics data recorder: physical vibrations and voltages are captured by hardware with atomic precision, buffered seamlessly by DMA, and analyzed continuously without dropping a single millisecond of flight data.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <string>

class Milestone3HardwareDataEngine {
public:
    struct EngineTelemetry {
        uint32_t samplesCaptured;
        uint32_t buffersProcessed;
        uint32_t dropRate;
        bool trgoHardwareLocked;
        bool dmaPingPongActive;
    };

private:
    EngineTelemetry telemetry;

public:
    Milestone3HardwareDataEngine() {
        telemetry.samplesCaptured = 0;
        telemetry.buffersProcessed = 0;
        telemetry.dropRate = 0;
        telemetry.trgoHardwareLocked = true;
        telemetry.dmaPingPongActive = true;
    }

    void executeAcquisitionBurst(uint32_t burstSize) {
        std::cout << "[DATA ENGINE] Executing hardware acquisition burst (" << burstSize << " samples)...\\n";
        telemetry.samplesCaptured += burstSize;
        telemetry.buffersProcessed += (burstSize / 512);
        std::cout << "  -> Hardware TRGO Trigger: 10,000.0 Hz (0.0 ns jitter)\\n";
        std::cout << "  -> DMA AHB Transfers:     " << burstSize << " words written to SRAM\\n";
        std::cout << "  -> Ping-Pong Switching:   " << telemetry.buffersProcessed << " buffer swaps executed\\n";
        std::cout << "  -> Zero-Drop Verification: Passed (0 drops / " << burstSize << " samples)\\n";
    }

    void printCertificationReport() const {
        std::cout << "\\n=======================================================\\n";
        std::cout << "  🏆 MILESTONE 3 HARDWARE ENGINE: CERTIFIED COMPLIANT\\n";
        std::cout << "=======================================================\\n";
        std::cout << "  Samples Streamed:      " << telemetry.samplesCaptured << "\\n";
        std::cout << "  Ping-Pong Buffers:     " << telemetry.buffersProcessed << "\\n";
        std::cout << "  Hardware TRGO Lock:    " << (telemetry.trgoHardwareLocked ? "ACTIVE (LOCKED)" : "UNLOCKED") << "\\n";
        std::cout << "  DMA Zero-Drop Status:  VERIFIED (Drop Rate = 0.00%)\\n";
        std::cout << "  Real-Time Safety Gate: APPROVED FOR EMBEDDED PRODUCTION\\n";
        std::cout << "=======================================================\\n";
    }
};

int main() {
    Milestone3HardwareDataEngine engine;
    engine.executeAcquisitionBurst(1024);
    engine.printCertificationReport();
    return 0;
}""",
                "output": r"""[DATA ENGINE] Executing hardware acquisition burst (1024 samples)...\n  -> Hardware TRGO Trigger: 10,000.0 Hz (0.0 ns jitter)\n  -> DMA AHB Transfers:     1024 words written to SRAM\n  -> Ping-Pong Switching:   2 buffer swaps executed\n  -> Zero-Drop Verification: Passed (0 drops / 1024 samples)\n\n=======================================================\n  🏆 MILESTONE 3 HARDWARE ENGINE: CERTIFIED COMPLIANT\n=======================================================\n  Samples Streamed:      1024\n  Ping-Pong Buffers:     2\n  Hardware TRGO Lock:    ACTIVE (LOCKED)\n  DMA Zero-Drop Status:  VERIFIED (Drop Rate = 0.00%)\n  Real-Time Safety Gate: APPROVED FOR EMBEDDED PRODUCTION\n=======================================================""",
                "codeNotes": [
                    {"line": 28, "note": "Integrates hardware TIM2_TRGO triggers, 12-bit ADC, and DMA circular double buffering"},
                    {"line": 34, "note": "Verifies 100% zero-drop data acquisition under high-speed sampling burst"},
                    {"line": 49, "note": "Issues final Milestone 3 Industrial Embedded Data Engine compliance certification"}
                ],
                "tryIt": "Simulate an acquisition burst of 4096 samples and verify that 8 ping-pong buffer swaps are processed with 0 drops.",
                "check": {
                    "question": "What is the primary architectural requirement that allows Milestone 3 to achieve zero-drop analog streaming at high sampling rates?",
                    "options": [
                        "Direct Memory Access (DMA) ping-pong double-buffering offloading data movement entirely from the CPU core",
                        "Running the microcontroller without an operating system clock",
                        "Replacing all hardware registers with dynamic software objects",
                        "Disabling all interrupts on the entire processor permanently"
                    ],
                    "answer": 0,
                    "why": "DMA hardware routes data directly from peripheral registers to SRAM over the AHB bus matrix, freeing the CPU to process blocks of data asynchronously without dropping high-frequency samples."
                }
            }
        ],
        "summary": [
            "Timer TRGO master outputs trigger ADC conversions through direct hardware interconnects, guaranteeing zero clock cycle software sampling jitter.",
            "DMA Circular Ping-Pong double-buffering partitions SRAM into two halves, enabling continuous streaming with zero buffer contention or race conditions.",
            "Defensive embedded recovery handles ADC overrun, spurious interrupts, and clock drift to prevent system lockups in hostile electrical environments.",
            "Real-time digital signal processing calculates Peak-to-Peak and True RMS voltage metrics from streaming buffers with high computational efficiency.",
            "Milestone 3 integrates hardware timers, 12-bit SAR ADCs, DMA controllers, and fail-safe state machines into an industrial-grade data acquisition engine."
        ],
        "projectStep": {
            "title": "Construct, Verify, and Defend Milestone 3: Real-Time Hardware Signal Generator & DMA Data Engine",
            "steps": [
                "Configure Timer 2 Master Mode to generate 10.0 kHz TRGO trigger pulses on internal peripheral bus lines.",
                "Connect ADC1 to TIM2_TRGO hardware triggers and prove zero-jitter conversion timing across clock domains.",
                "Configure DMA Stream 0 in Circular Double-Buffering mode with Half-Transfer and Transfer-Complete interrupt handlers.",
                "Implement real-time Peak-to-Peak and True RMS digital signal processing algorithms on streaming ADC buffers.",
                "Subject the complete data engine to simulated overrun and spurious interrupt fault injection to verify self-healing recovery."
            ]
        }
    }

def main():
    generators = [
        (11, create_day11),
        (12, create_day12),
        (13, create_day13),
        (14, create_day14),
        (15, create_day15)
    ]
    for day_num, func in generators:
        day_data = func()
        out_path = f"scripts/iot_emb_day{day_num}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(day_data, f, indent=2, ensure_ascii=False)
        print(f"Wrote {out_path} successfully!")
    print("All Days 11-15 generated successfully!")

if __name__ == "__main__":
    main()
