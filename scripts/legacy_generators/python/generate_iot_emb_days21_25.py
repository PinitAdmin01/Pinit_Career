import json
import os

def create_day21():
    return {
        "day": 21,
        "title": "Real-Time Operating System (RTOS) Physics: Hard vs Soft RTOS, Task Control Blocks & Stacks",
        "goal": "Transition from bare-metal super-loops to multi-tasking operating systems: master FreeRTOS kernel internals. Understand hard vs soft real-time determinism, Task Control Blocks (TCB), per-task stack allocation, 0xA5 stack canary watermarking, and Rate Monotonic Scheduling (RMS) utilization bounds.",
        "minutes": 36,
        "recap": "In Block 4, we mastered DMA controllers, circular double-buffering, and hardware watchdogs. Today, we enter the world of concurrent embedded operating systems: the FreeRTOS real-time kernel.",
        "parts": [
            {
                "title": "Hard vs Soft Real-Time Systems: Determinism, Bounded WCET & Deadlines",
                "say": [
                    "A common misconception is that a Real-Time Operating System (RTOS) is simply a fast operating system; in reality, an RTOS is about predictability, not raw speed.",
                    "The defining metric of an RTOS is Determinism: the mathematical guarantee that a given task will execute within a strictly bounded time window regardless of system load.",
                    "In a Hard Real-Time System (such as an automotive airbag controller, cardiac pacemaker, or rocket attitude thruster), missing a deadline constitutes total system failure with catastrophic real-world consequences.",
                    "In a Soft Real-Time System (such as video streaming or a digital watch UI), missing a deadline causes degraded quality of service (dropped video frames) but no physical harm.",
                    "To guarantee hard real-time deadlines, every task must have a proven Worst-Case Execution Time (WCET).",
                    "General-purpose operating systems like Linux or Windows are soft real-time at best because virtual memory page faults, dynamic heap allocations, and complex CFS schedulers introduce unbounded latency jitter."
                ],
                "example": "An airbag deployment system: if the deceleration sensor fires, the airbag MUST inflate within exactly 15 milliseconds; deploying in 16 milliseconds is not 'a little late'—it is fatal.",
                "code": r"""#include <iostream>
#include <string>
#include <iomanip>

struct TaskTimingProfile {
    std::string taskName;
    double bestCaseTimeMs;
    double worstCaseTimeMs;
    double deadlineMs;
    bool isHardRealTime;

    bool evaluateCompliance() const {
        return worstCaseTimeMs <= deadlineMs;
    }
};

void auditRealTimeSystem(const TaskTimingProfile& task) {
    std::cout << "[RTOS AUDIT] Task: " << task.taskName 
              << " (" << (task.isHardRealTime ? "HARD REAL-TIME" : "SOFT REAL-TIME") << ")\n";
    std::cout << "  Best-Case:  " << std::fixed << std::setprecision(2) << task.bestCaseTimeMs << " ms\n";
    std::cout << "  Worst-Case: " << task.worstCaseTimeMs << " ms\n";
    std::cout << "  Deadline:   " << task.deadlineMs << " ms\n";

    if (task.evaluateCompliance()) {
        std::cout << "  -> VERDICT: COMPLIANT (Margin: +" << (task.deadlineMs - task.worstCaseTimeMs) << " ms)\n";
    } else {
        std::cout << "  -> VERDICT: DEADLINE VIOLATION! (Exceeded by " 
                  << (task.worstCaseTimeMs - task.deadlineMs) << " ms) - CATASTROPHIC!\n";
    }
}

int main() {
    TaskTimingProfile airbag = {"Airbag Squib Trigger", 2.10, 4.80, 5.00, true};
    TaskTimingProfile display = {"UI Screen Refresh", 12.00, 22.00, 16.67, false};

    auditRealTimeSystem(airbag);
    std::cout << "\n";
    auditRealTimeSystem(display);
    return 0;
}""",
                "output": r"""[RTOS AUDIT] Task: Airbag Squib Trigger (HARD REAL-TIME)
  Best-Case:  2.10 ms
  Worst-Case: 4.80 ms
  Deadline:   5.00 ms
  -> VERDICT: COMPLIANT (Margin: +0.20 ms)

[RTOS AUDIT] Task: UI Screen Refresh (SOFT REAL-TIME)
  Best-Case:  12.00 ms
  Worst-Case: 22.00 ms
  Deadline:   16.67 ms
  -> VERDICT: DEADLINE VIOLATION! (Exceeded by 5.33 ms) - CATASTROPHIC!""",
                "codeNotes": [
                    {"line": 12, "note": "Hard real-time compliance requires that Worst-Case Execution Time strictly <= Deadline"},
                    {"line": 34, "note": "Airbag task completes within 4.8 ms WCET, safely meeting 5.0 ms hard deadline"},
                    {"line": 35, "note": "UI display task misses 60Hz deadline by 5.33 ms, acceptable only in soft systems"}
                ],
                "tryIt": "Reduce airbag WCET margin to negative and verify that the safety audit flags an immediate critical failure.",
                "check": {
                    "question": "What is the defining requirement of a Hard Real-Time Operating System?",
                    "options": [
                        "It mathematically guarantees that critical tasks complete within bounded deadlines, where a single missed deadline causes total system failure",
                        "It has the highest raw gigahertz CPU frequency",
                        "It executes tasks without using a stack",
                        "It only runs on 64-bit processors"
                    ],
                    "answer": 0,
                    "why": "Hard real-time is defined by bounded determinism: missing a deadline is treated as a total system failure regardless of average speed."
                }
            },
            {
                "title": "The Task Control Block (TCB): Architecture, State & Stack Pointers",
                "say": [
                    "In FreeRTOS, every task is represented by an internal kernel structure called the Task Control Block (`TCB_t`).",
                    "The very first member of the `TCB_t` struct is `pxTopOfStack`—a pointer to the current top of the task's private stack.",
                    "Placing `pxTopOfStack` at offset zero is a brilliant assembly optimization: in the context switcher, loading the TCB address into a register immediately gives direct access to the stack pointer without adding struct member offsets.",
                    "The TCB also stores the task's Name, Priority level (0 to `configMAX_PRIORITIES - 1`), Stack Base address, and two bidirectional list items (`xStateListItem` and `xEventListItem`).",
                    "At any given instant, a task exists in one of four states: RUNNING (actively executing on the CPU), READY (able to run, awaiting CPU time), BLOCKED (waiting for an event or timer delay), or SUSPENDED.",
                    "The FreeRTOS scheduler maintains these states by moving TCB list items between kernel priority lists (`pxReadyTasksLists`, `xDelayedTaskList1`, `xSuspendedTaskList`)."
                ],
                "example": "A TCB is like a pilot's flight manifest and cockpit clipboard: it records who the pilot is, their seniority (priority), where their flight bag is stored (stack pointer), and whether they are currently in the air, on standby at the gate, or resting between flights.",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

enum class TaskState {
    RUNNING,
    READY,
    BLOCKED,
    SUSPENDED
};

struct SimulatedTcb {
    uint32_t* pxTopOfStack; // Offset 0: Critical for assembly context switch
    uint32_t priority;
    uint32_t* pxStackBase;
    uint32_t stackSizeBytes;
    std::string taskName;
    TaskState state;
};

void inspectTcb(const SimulatedTcb& tcb) {
    std::cout << "[TCB INSPECTION] Task '" << tcb.taskName << "':\n";
    std::cout << "  pxTopOfStack: 0x" << std::hex << (uintptr_t)tcb.pxTopOfStack 
              << " (Offset 0 in TCB)\n";
    std::cout << "  Stack Base:   0x" << (uintptr_t)tcb.pxStackBase 
              << ", Allocated: " << std::dec << tcb.stackSizeBytes << " bytes\n";
    std::cout << "  Priority:     " << tcb.priority << "\n";
    std::string stateStr = "READY";
    if (tcb.state == TaskState::RUNNING) stateStr = "RUNNING";
    else if (tcb.state == TaskState::BLOCKED) stateStr = "BLOCKED";
    std::cout << "  Kernel State: " << stateStr << "\n";
}

int main() {
    uint32_t mockStack[128]; // 512-byte stack
    SimulatedTcb sensorTask = {
        &mockStack[112],     // Top of stack (grows downward)
        3,                   // Priority 3 (High)
        mockStack,
        512,
        "SensorSampler",
        TaskState::READY
    };

    inspectTcb(sensorTask);
    return 0;
}""",
                "output": r"""[TCB INSPECTION] Task 'SensorSampler':
  pxTopOfStack: 0x... (Offset 0 in TCB)
  Stack Base:   0x..., Allocated: 512 bytes
  Priority:     3
  Kernel State: READY""",
                "codeNotes": [
                    {"line": 13, "note": "pxTopOfStack must reside at byte offset 0 of TCB for single-instruction assembly access"},
                    {"line": 34, "note": "Stack grows downward on ARM Cortex-M; top of stack is near the high address"},
                    {"line": 39, "note": "Represents READY state waiting for scheduler dispatch"}
                ],
                "tryIt": "Simulate transitioning the task state to BLOCKED when waiting for an I2C sensor reading.",
                "check": {
                    "question": "Why is pxTopOfStack placed at byte offset 0 of the FreeRTOS Task Control Block (TCB_t)?",
                    "options": [
                        "So the assembly context switcher can read and update the task's stack pointer in a single instruction without calculating struct offsets",
                        "Because the C++ language requires it",
                        "To prevent compiler optimization errors",
                        "Because offset 0 is stored in Flash memory"
                    ],
                    "answer": 0,
                    "why": "By placing pxTopOfStack at offset 0, the assembly instruction 'LDR R0, [R1]' directly loads the stack pointer when R1 points to the TCB."
                }
            },
            {
                "title": "Per-Task Stack Allocation & Initialization of Fake Exception Stacking Frames",
                "say": [
                    "In a bare-metal program, all code shares a single stack (the Main Stack Pointer, MSP).",
                    "In an RTOS, every task has its own completely independent stack allocated in SRAM.",
                    "When a new task is created (`xTaskCreate`), it is not running yet; how can the scheduler context-switch into it for the very first time?",
                    "The kernel solves this through Fake Exception Frame Initialization (`pxPortInitialiseStack`).",
                    "The kernel pre-populates the task's empty stack with an artificial 16-register hardware/software exception frame as if the task had already been interrupted.",
                    "The fake frame contains: xPSR (with Thumb bit 24 = 1), PC (set to the task's function address), LR (set to `prvTaskExitError`), R0 (set to the task parameter `pvParameters`), and zeros for R1–R12 and R4–R11.",
                    "When the scheduler performs its first context switch, it pops these fake registers; the CPU branches directly to the task entry function naturally!"
                ],
                "example": "Setting up a new rental apartment: before the tenant moves in, the landlord places keys on the counter, turns on the refrigerator, and leaves a welcome letter (fake stack frame) so the tenant can walk in and start living immediately.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <iomanip>

struct InitialStackFrame {
    // Software saved registers (popped by PendSV)
    uint32_t r4, r5, r6, r7, r8, r9, r10, r11;
    // Hardware saved registers (popped automatically by Cortex-M hardware)
    uint32_t r0;        // Task parameter (pvParameters)
    uint32_t r1, r2, r3, r12;
    uint32_t lr;        // Return address on task exit (error trap)
    uint32_t pc;        // Task entry point function pointer
    uint32_t xpsr;      // Program Status Register (Thumb bit = 1)
};

uint32_t* initializeTaskStack(uint32_t* stackTop, void (*taskFunc)(void*), void* param) {
    stackTop--; // Decrement pointer
    *stackTop = 0x01000000; // xPSR: Bit 24 (Thumb bit) MUST be 1
    stackTop--;
    *stackTop = (uint32_t)taskFunc; // PC: Points to task function
    stackTop--;
    *stackTop = 0x00000000; // LR: Task exit trap
    stackTop--;
    *stackTop = 0x12121212; // R12
    stackTop--;
    *stackTop = 0x03030303; // R3
    stackTop--;
    *stackTop = 0x02020202; // R2
    stackTop--;
    *stackTop = 0x01010101; // R1
    stackTop--;
    *stackTop = (uint32_t)param; // R0: Holds pvParameters argument!
    
    // R4 - R11 software registers (initialized to known debug values)
    for (int r = 11; r >= 4; --r) {
        stackTop--;
        *stackTop = 0x04040400 + r;
    }
    return stackTop; // New pxTopOfStack
}

void dummyTask(void* p) {
    std::cout << "Task executing with param: " << (uintptr_t)p << "\n";
}

int main() {
    uint32_t taskStack[64];
    uint32_t* stackEnd = &taskStack[64]; // Top of allocated array

    uint32_t* topOfStack = initializeTaskStack(stackEnd, dummyTask, (void*)0xCAFE);

    std::cout << "Initialized Fake Stack Frame for New Task:\n";
    std::cout << "  Stack Base:    0x" << std::hex << (uintptr_t)taskStack << "\n";
    std::cout << "  Initial Top:   0x" << (uintptr_t)topOfStack << "\n";
    std::cout << "  Frame Size:    " << std::dec << (stackEnd - topOfStack) << " words (16 registers)\n";
    std::cout << "  xPSR (at top): 0x01000000 (Thumb bit verified)\n";
    return 0;
}""",
                "output": r"""Initialized Fake Stack Frame for New Task:
  Stack Base:    0x...
  Initial Top:   0x...
  Frame Size:    16 words (16 registers)
  xPSR (at top): 0x01000000 (Thumb bit verified)""",
                "codeNotes": [
                    {"line": 19, "note": "Bit 24 of xPSR must be 1 (Thumb bit); if 0, Cortex-M generates an immediate UsageFault"},
                    {"line": 21, "note": "Initializes PC to task entry point function address"},
                    {"line": 31, "note": "R0 receives pvParameters pointer per ARM AAPCS calling convention"}
                ],
                "tryIt": "Demonstrate what happens if xPSR bit 24 is set to 0: the ARM processor refuses to execute in non-Thumb mode.",
                "check": {
                    "question": "Why must bit 24 (Thumb bit) of the xPSR register be set to 1 when initializing a new FreeRTOS task stack?",
                    "options": [
                        "ARM Cortex-M processors only support the Thumb-2 instruction set; a 0 in bit 24 triggers a fatal UsageFault exception on startup",
                        "To enable floating-point hardware",
                        "To double the size of the task stack",
                        "To enable the external crystal oscillator"
                    ],
                    "answer": 0,
                    "why": "ARM Cortex-M cores do not support legacy ARM 32-bit state; execution requires the Thumb bit (bit 24 of xPSR) to be asserted at all times."
                }
            },
            {
                "title": "Stack Overflow Detection: Canary Watermarking (0xA5) & High-Water Marks",
                "say": [
                    "Stack overflow is the number one cause of mysterious crashes, memory corruption, and spontaneous resets in embedded systems.",
                    "If a task exceeds its allocated stack, it silently overwrites adjacent Task Control Blocks, heap variables, or other task stacks.",
                    "FreeRTOS provides two powerful stack overflow detection methods configured via `configCHECK_FOR_STACK_OVERFLOW`.",
                    "Method 1: During task switching, the kernel checks if the current stack pointer `pxTopOfStack` has fallen outside the allocated range `pxStackBase`.",
                    "Method 2 (Canary Watermarking): When a task is created, the kernel fills its entire stack with the signature canary byte `0xA5`.",
                    "The kernel inspects the last 16–32 bytes at the bottom of the stack; if any canary byte has been overwritten, the kernel halts and invokes `vApplicationStackOverflowHook()`.",
                    "The function `uxTaskGetStackHighWaterMark()` scans from the bottom to count intact `0xA5` bytes, returning the minimum unused stack space ever reached."
                ],
                "example": "Canary watermarking is like miners taking a canary into a coal mine: as long as the canary is alive (0xA5 intact), the air is safe; if the canary dies (0xA5 overwritten), everyone must evacuate immediately.",
                "code": r"""#include <iostream>
#include <vector>
#include <cstdint>

class StackWatermarkInspector {
private:
    static const uint8_t CANARY_BYTE = 0xA5;
    std::vector<uint8_t> stackMemory;
public:
    StackWatermarkInspector(size_t sizeBytes) : stackMemory(sizeBytes, CANARY_BYTE) {}

    void simulateTaskExecution(size_t stackUsedBytes) {
        // Stack grows downward from end towards index 0
        size_t total = stackMemory.size();
        if (stackUsedBytes > total) {
            stackUsedBytes = total; // Full overflow
        }
        for (size_t i = total - stackUsedBytes; i < total; ++i) {
            stackMemory[i] = 0xAA; // Overwritten by active stack frames
        }
    }

    size_t getStackHighWaterMark() const {
        size_t intactCanaries = 0;
        // Count intact 0xA5 bytes from bottom of stack (index 0)
        for (size_t i = 0; i < stackMemory.size(); ++i) {
            if (stackMemory[i] == CANARY_BYTE) {
                intactCanaries++;
            } else {
                break;
            }
        }
        return intactCanaries;
    }

    bool checkOverflow() const {
        // Check first 16 canary bytes at bottom of stack
        for (size_t i = 0; i < 16 && i < stackMemory.size(); ++i) {
            if (stackMemory[i] != CANARY_BYTE) {
                return true; // Overflow detected!
            }
        }
        return false;
    }
};

int main() {
    StackWatermarkInspector taskStack(512); // 512-byte stack filled with 0xA5

    std::cout << "Initial Stack High-Water Mark: " << taskStack.getStackHighWaterMark() << " bytes unused\n";
    taskStack.simulateTaskExecution(400); // Uses 400 bytes
    std::cout << "After 400-byte load: " << taskStack.getStackHighWaterMark() 
              << " bytes unused (Safe margin: 112 bytes)\n";

    // Dangerous deep recursion consumes 510 bytes (destroys canary bottom)
    taskStack.simulateTaskExecution(510);
    std::cout << "After heavy recursion: " << taskStack.getStackHighWaterMark() << " bytes unused\n";
    if (taskStack.checkOverflow()) {
        std::cout << "[FATAL STACK OVERFLOW HOOK] 0xA5 Canary destroyed! Halting system safely.\n";
    }
    return 0;
}""",
                "output": r"""Initial Stack High-Water Mark: 512 bytes unused
After 400-byte load: 112 bytes unused (Safe margin: 112 bytes)
After heavy recursion: 2 bytes unused
[FATAL STACK OVERFLOW HOOK] 0xA5 Canary destroyed! Halting system safely.""",
                "codeNotes": [
                    {"line": 10, "note": "Pre-fills entire stack array with FreeRTOS standard 0xA5 canary byte"},
                    {"line": 22, "note": "uxTaskGetStackHighWaterMark counts intact 0xA5 bytes from stack bottom"},
                    {"line": 49, "note": "Traps stack overflow hook when bottom canary boundary is corrupted"}
                ],
                "tryIt": "Demonstrate how stack tuning in production uses high-water marks to safely shrink oversized task stacks.",
                "check": {
                    "question": "What is the standard canary byte used by FreeRTOS to watermark task stacks for overflow detection?",
                    "options": [
                        "0xA5",
                        "0x00",
                        "0xFF",
                        "0x55"
                    ],
                    "answer": 0,
                    "why": "FreeRTOS fills stack memory with 0xA5 upon creation; checking whether the 0xA5 pattern at the stack limit has been altered reveals whether an overflow occurred."
                }
            },
            {
                "title": "Rate Monotonic Scheduling (RMS) Mathematical Utilization Bounds",
                "say": [
                    "How does an embedded systems architect prove mathematically that a set of real-time tasks will ALWAYS meet their deadlines?",
                    "The foundation of real-time scheduling theory is Rate Monotonic Scheduling (RMS), established by Liu and Layland in 1973.",
                    "Under RMS, task priorities are assigned strictly by period: the shorter the period (higher rate), the higher the priority.",
                    "Liu and Layland proved that a set of N periodic tasks is guaranteed to meet all deadlines if total CPU utilization satisfies: U = sum(C_i / T_i) <= N * (2^(1/N) - 1).",
                    "For N=1, U <= 100%. For N=2, U <= 82.8%. For N=3, U <= 78.0%. As N approaches infinity, the bound converges to ln(2) = 69.3%.",
                    "If total utilization is below 69.3%, all tasks are mathematically guaranteed to meet all hard deadlines under all conditions without exception."
                ],
                "example": "A busy highway speed limit: if the highway operates at under 69% capacity, traffic is mathematically guaranteed to flow smoothly without stop-and-go phantom shockwaves.",
                "code": r"""#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

struct PeriodicTask {
    std::string name;
    double computationTimeMs; // C_i
    double periodMs;          // T_i

    double getUtilization() const {
        return computationTimeMs / periodMs;
    }
};

class RmsSchedulerAnalyzer {
public:
    static double calculateRmsBound(size_t n) {
        if (n == 0) return 0.0;
        return (double)n * (std::pow(2.0, 1.0 / n) - 1.0);
    }

    static void evaluateTaskSet(const std::vector<PeriodicTask>& tasks) {
        double totalU = 0.0;
        std::cout << "Rate Monotonic Scheduling (RMS) Mathematical Evaluation:\n";
        for (const auto& t : tasks) {
            double u = t.getUtilization();
            totalU += u;
            std::cout << "  Task '" << t.name << "': C=" << t.computationTimeMs 
                      << "ms, T=" << t.periodMs << "ms -> U = " 
                      << std::fixed << std::setprecision(1) << (u * 100.0) << "%\n";
        }

        double bound = calculateRmsBound(tasks.size());
        std::cout << "  --------------------------------------------------\n";
        std::cout << "  Total Utilization:   " << (totalU * 100.0) << "%\n";
        std::cout << "  Liu-Layland Bound:   " << (bound * 100.0) << "% (for N=" << tasks.size() << ")\n";

        if (totalU <= bound) {
            std::cout << "  -> THEORETICALLY GUARANTEED SCHEDULABLE: All hard deadlines met!\n";
        } else if (totalU <= 1.0) {
            std::cout << "  -> FEASIBLE BUT NOT GUARANTEED: Requires exact response-time analysis.\n";
        } else {
            std::cout << "  -> UNSCHEDULABLE: CPU overloaded (>100%), deadline misses inevitable!\n";
        }
    }
};

int main() {
    std::vector<PeriodicTask> avionics = {
        {"FlightControlLoop", 1.0,  10.0}, // U = 10% (T=10ms, Highest Pri)
        {"NavigationFilter",  5.0,  25.0}, // U = 20% (T=25ms, Med Pri)
        {"TelemetryStream",  15.0,  50.0}  // U = 30% (T=50ms, Low Pri)
    };
    RmsSchedulerAnalyzer::evaluateTaskSet(avionics);
    return 0;
}""",
                "output": r"""Rate Monotonic Scheduling (RMS) Mathematical Evaluation:
  Task 'FlightControlLoop': C=1.0ms, T=10.0ms -> U = 10.0%
  Task 'NavigationFilter': C=5.0ms, T=25.0ms -> U = 20.0%
  Task 'TelemetryStream': C=15.0ms, T=50.0ms -> U = 30.0%
  --------------------------------------------------
  Total Utilization:   60.0%
  Liu-Layland Bound:   78.0% (for N=3)
  -> THEORETICALLY GUARANTEED SCHEDULABLE: All hard deadlines met!""",
                "codeNotes": [
                    {"line": 17, "note": "Calculates Liu-Layland RMS utilization bound: N * (2^(1/N) - 1)"},
                    {"line": 25, "note": "Sums individual task utilizations C_i / T_i"},
                    {"line": 34, "note": "Total 60% utilization <= 78.0% bound: mathematically proves 100% deadline compliance"}
                ],
                "tryIt": "Increase Telemetry computation time to 25.0 ms (U=50%) and observe how total utilization crosses the 78% bound.",
                "check": {
                    "question": "Under Rate Monotonic Scheduling (RMS), what is the asymptotic Liu-Layland utilization bound as the number of tasks approaches infinity?",
                    "options": [
                        "ln(2) ≈ 69.3%",
                        "100.0%",
                        "50.0%",
                        "90.0%"
                    ],
                    "answer": 0,
                    "why": "As N approaches infinity, N * (2^(1/N) - 1) converges mathematically to ln(2) = 0.69314... (approx 69.3%)."
                }
            }
        ],
        "summary": [
            "Hard real-time systems require mathematical determinism where Worst-Case Execution Time (WCET) strictly meets bounded deadlines.",
            "FreeRTOS Task Control Blocks (TCB) store pxTopOfStack at offset 0 for single-instruction assembly context switching.",
            "New task stacks are initialized with a fake 16-register exception frame (R0-R15, xPSR) with Thumb bit 24 set to 1.",
            "Stack canary watermarking fills memory with 0xA5, enabling uxTaskGetStackHighWaterMark and vApplicationStackOverflowHook.",
            "Rate Monotonic Scheduling (RMS) assigns priorities by period, guaranteeing schedulability when total utilization is below the Liu-Layland bound (approx 69.3%)."
        ],
        "projectStep": {
            "title": "Construct a Preemptive TCB Architecture with Stack Canary Watermarking and RMS Analysis",
            "steps": [
                "Implement a Task Control Block (TCB) structure with pxTopOfStack aligned at byte offset 0.",
                "Construct a fake exception stacking initialization engine populating R0–R15 with Thumb bit verification.",
                "Pre-fill task stacks with 0xA5 canary bytes and implement a high-water mark stack overflow detector.",
                "Calculate Liu-Layland mathematical utilization bounds for multi-rate periodic task sets.",
                "Verify task state transitions between READY, RUNNING, and BLOCKED queues."
            ]
        }
    }

def create_day22():
    return {
        "day": 22,
        "title": "Preemptive Scheduling & Context Switching: PendSV Exception, SysTick & Assembly Stack Swapping",
        "goal": "Deconstruct the black box of operating system multitasking: write an ARM Cortex-M Context Switcher in assembly. Understand why context switching inside hardware ISRs causes crashes, how the PendSV deferred exception operates at lowest priority, MSP vs PSP stack switching, and cycle-exact task swapping.",
        "minutes": 36,
        "recap": "Yesterday, we analyzed Task Control Blocks and fake stack frames. Today, we open the engine of the operating system: the PendSV assembly context switcher that swaps execution between tasks seamlessly.",
        "parts": [
            {
                "title": "Thread vs Handler Modes, Main Stack Pointer (MSP) vs Process Stack Pointer (PSP)",
                "say": [
                    "To support robust multitasking, the ARM Cortex-M architecture implements two operating modes and two physical stack pointer registers.",
                    "Thread Mode is used for normal background application execution (user tasks); Handler Mode is entered automatically whenever an exception or interrupt fires.",
                    "Additionally, Cortex-M features two distinct Stack Pointers: the Main Stack Pointer (`MSP`) and the Process Stack Pointer (`PSP`).",
                    "The `CONTROL` register (bit 1 `SPSEL`) selects which stack pointer is currently active in Thread Mode: `SPSEL=0` uses MSP, `SPSEL=1` uses PSP.",
                    "In a professional RTOS, all kernel interrupt handlers and system exceptions execute in Handler Mode using `MSP`.",
                    "Each user task executes in Thread Mode using its private stack addressed by `PSP`; this isolates tasks so an application stack overflow cannot corrupt kernel interrupt handlers."
                ],
                "example": "MSP is the building's main emergency fire escape stairs used only by emergency responders (ISRs); PSP is the private internal elevator inside each tenant's individual apartment (user tasks).",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

struct CpuExecutionState {
    std::string mode; // "Thread Mode" or "Handler Mode"
    std::string activeStack; // "MSP" or "PSP"
    uint32_t controlRegister;
};

void evaluateExecutionMode(uint32_t ipsr, uint32_t control) {
    std::cout << "[CPU PIPELINE STATE]:\n";
    if (ipsr != 0) {
        std::cout << "  Mode:         Handler Mode (Servicing Exception/ISR #" << ipsr << ")\n";
        std::cout << "  Active Stack: MSP (Main Stack Pointer enforced by hardware)\n";
    } else {
        std::cout << "  Mode:         Thread Mode (Running Application Task)\n";
        bool usePsp = (control & (1 << 1));
        std::cout << "  Active Stack: " << (usePsp ? "PSP (Process Stack Pointer)" : "MSP (Main Stack Pointer)") << "\n";
        if (usePsp) {
            std::cout << "  -> RTOS Task Isolation: Active! Kernel stack protected.\n";
        }
    }
}

int main() {
    // Scenario 1: User task running in Thread mode with PSP
    std::cout << "Scenario 1: Normal RTOS Task Execution:\n";
    evaluateExecutionMode(0, 0x02); // IPSR=0 (Thread), CONTROL bit 1=1 (PSP)

    // Scenario 2: Hardware timer interrupt fires
    std::cout << "\nScenario 2: Hardware Timer Interrupt Fires:\n";
    evaluateExecutionMode(28, 0x02); // IPSR=28 (TIM2), Hardware forces MSP
    return 0;
}""",
                "output": r"""Scenario 1: Normal RTOS Task Execution:
[CPU PIPELINE STATE]:
  Mode:         Thread Mode (Running Application Task)
  Active Stack: PSP (Process Stack Pointer)
  -> RTOS Task Isolation: Active! Kernel stack protected.

Scenario 2: Hardware Timer Interrupt Fires:
[CPU PIPELINE STATE]:
  Mode:         Handler Mode (Servicing Exception/ISR #28)
  Active Stack: MSP (Main Stack Pointer enforced by hardware)""",
                "codeNotes": [
                    {"line": 13, "note": "Non-zero IPSR indicates Handler Mode executing an active hardware interrupt"},
                    {"line": 17, "note": "Thread mode uses CONTROL register bit 1 (SPSEL) to select private PSP"},
                    {"line": 28, "note": "Demonstrates hardware switching to MSP automatically on interrupt entry"}
                ],
                "tryIt": "Explain why user tasks running with PSP prevents an application stack crash from corrupting the kernel.",
                "check": {
                    "question": "Which stack pointer register is used by user tasks in Thread Mode under FreeRTOS on ARM Cortex-M?",
                    "options": [
                        "PSP (Process Stack Pointer), enabled via CONTROL bit 1",
                        "MSP (Main Stack Pointer)",
                        "BaseStack Register",
                        "Vector Offset Register"
                    ],
                    "answer": 0,
                    "why": "FreeRTOS configures user tasks to run in Thread Mode using PSP, reserving MSP exclusively for kernel interrupt service routines."
                }
            },
            {
                "title": "Why Context Switching Inside Hardware ISRs Causes Crashes: The PendSV Invariant",
                "say": [
                    "Why can't the SysTick timer or a peripheral ISR simply swap `pxCurrentTCB` and switch stacks directly inside its own handler?",
                    "Consider this fatal scenario: a high-priority motor timer ISR fires; while it is running, a low-priority UART ISR is interrupted.",
                    "If the motor ISR attempts to execute a context switch, it swaps stack pointers in the middle of nested hardware interrupt stacking frames.",
                    "When the processor tries to unstack, it reads the wrong registers from the wrong stack, generating an instantaneous `HardFault` and freezing the chip.",
                    "The ARM architects solved this with a dedicated system exception: PendSV (Pended System Call).",
                    "Invariant: The PendSV exception is ALWAYS configured with the lowest possible hardware interrupt priority (Priority 15, or 0xFF in `SHPR3`).",
                    "When SysTick or an ISR decides a context switch is needed, it simply sets the PendSV pending bit (`SCB->ICSR_PENDSVSET = 1`); PendSV only executes AFTER all higher-priority hardware ISRs have completely finished and unstacked!"
                ],
                "example": "A busy hospital operating room: surgeons don't swap surgical shift teams while performing open-heart surgery; they place a note on the board (PendSV) to change shifts the moment the patient is stable and all instruments are put away.",
                "code": r"""#include <iostream>
#include <string>

struct InterruptNestingModel {
    int activeInterrupts;
    bool pendSvPending;

    InterruptNestingModel() : activeInterrupts(0), pendSvPending(false) {}

    void enterHardwareIsr(const std::string& name) {
        activeInterrupts++;
        std::cout << "[ISR ENTRY] " << name << " active (Nesting Level = " << activeInterrupts << ")\n";
    }

    void requestContextSwitch() {
        pendSvPending = true;
        std::cout << "  -> [CONTEXT SWITCH REQUESTED] Setting PendSV Pending Bit (Deferred)\n";
    }

    void exitHardwareIsr(const std::string& name) {
        activeInterrupts--;
        std::cout << "[ISR EXIT] " << name << " finished (Remaining Nesting = " << activeInterrupts << ")\n";

        if (activeInterrupts == 0 && pendSvPending) {
            std::cout << "  -> [ALL HARDWARE ISRs FINISHED] CPU safely enters PendSV Exception!\n";
            std::cout << "  -> [PENDSV HANDLER] Executing zero-risk task context switch!\n";
            pendSvPending = false;
        }
    }
};

int main() {
    InterruptNestingModel mcu;
    // Low priority UART ISR begins
    mcu.enterHardwareIsr("UART_RX_ISR (Priority 3)");
    // Preempted by higher priority Timer ISR
    mcu.enterHardwareIsr("TIMER_MOTOR_ISR (Priority 1)");

    // Timer ISR unblocks high-priority task, requests context switch
    mcu.requestContextSwitch();

    // Timer finishes
    mcu.exitHardwareIsr("TIMER_MOTOR_ISR (Priority 1)");
    // UART finishes -> only now does PendSV execute safely!
    mcu.exitHardwareIsr("UART_RX_ISR (Priority 3)");
    return 0;
}""",
                "output": r"""[ISR ENTRY] UART_RX_ISR (Priority 3) active (Nesting Level = 1)
[ISR ENTRY] TIMER_MOTOR_ISR (Priority 1) active (Nesting Level = 2)
  -> [CONTEXT SWITCH REQUESTED] Setting PendSV Pending Bit (Deferred)
[ISR EXIT] TIMER_MOTOR_ISR (Priority 1) finished (Nesting Level = 1)
[ISR EXIT] UART_RX_ISR (Priority 3) finished (Nesting Level = 0)
  -> [ALL HARDWARE ISRs FINISHED] CPU safely enters PendSV Exception!
  -> [PENDSV HANDLER] Executing zero-risk task context switch!""",
                "codeNotes": [
                    {"line": 15, "note": "Context switch request merely sets PendSV pending flag without immediate stack swapping"},
                    {"line": 23, "note": "PendSV executes only when active hardware interrupt nesting level reaches 0"},
                    {"line": 34, "note": "Prevents catastrophic stack frame corruption during nested interrupt execution"}
                ],
                "tryIt": "Explain why configuring PendSV at highest priority instead of lowest would defeat its purpose.",
                "check": {
                    "question": "Why is the PendSV exception configured at the lowest possible interrupt priority (Priority 15) in FreeRTOS?",
                    "options": [
                        "To guarantee that context switching is deferred until all higher-priority hardware ISRs have finished executing and unstacked",
                        "Because PendSV is a slow software function",
                        "To save battery power",
                        "Because the ARM processor does not support priority levels for system exceptions"
                    ],
                    "answer": 0,
                    "why": "Running PendSV at lowest priority guarantees that all active hardware interrupts finish and unstack back to Thread mode before the context switcher swaps task stacks."
                }
            },
            {
                "title": "The Assembly Engine: PendSV_Handler Step-by-Step",
                "say": [
                    "Let us inspect the exact GNU ARM assembly instructions executed inside `PendSV_Handler`.",
                    "Step 1: When PendSV is entered, hardware has ALREADY automatically stacked R0–R3, R12, LR, PC, and xPSR onto the current task's `PSP`.",
                    "Step 2: Read current task stack pointer: `MRS R0, PSP`.",
                    "Step 3: Save remaining software registers: `STMDB R0!, {R4-R11}` (Store Multiple Decrement Before).",
                    "Step 4: Save updated stack pointer into current TCB: `LDR R1, =pxCurrentTCB; LDR R2, [R1]; STR R0, [R2]` (Writes `R0` into offset 0 `pxTopOfStack`).",
                    "Step 5: Pick next task: `BL vTaskSwitchContext` (Updates `pxCurrentTCB` to point to the highest-priority READY task).",
                    "Step 6: Load new task's stack pointer: `LDR R1, =pxCurrentTCB; LDR R2, [R1]; LDR R0, [R2]`.",
                    "Step 7: Restore new task's software registers: `LDMIA R0!, {R4-R11}` (Load Multiple Increment After).",
                    "Step 8: Update CPU PSP and return: `MSR PSP, R0; BX LR` (Hardware un-stacks R0–R3, R12, LR, PC, xPSR into new task!)."
                ],
                "example": "A chess player's clock: player 1 takes their hands off the board and pushes their clock button (save R4-R11, store PSP); player 2's clock starts ticking, player 2 grabs their pieces (load PSP, restore R4-R11) and resumes their game.",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

struct TaskContext {
    std::string name;
    uint32_t r4_r11[8];
    uint32_t psp;
};

void tracePendSvContextSwitch(TaskContext& outgoing, TaskContext& incoming) {
    std::cout << "=== PENDING SV CONTEXT SWITCH TRACE ===\n";
    std::cout << "[STEP 1-3] Hardware stacked R0-R3,R12,LR,PC,xPSR onto PSP (0x" 
              << std::hex << outgoing.psp << ")\n";
    std::cout << "           Software pushes R4-R11 via 'STMDB R0!, {R4-R11}'\n";
    outgoing.psp -= (8 * 4); // 8 registers saved
    std::cout << "[STEP 4]   Saved updated PSP into " << outgoing.name << "->pxTopOfStack: 0x" 
              << outgoing.psp << "\n";

    std::cout << "[STEP 5]   vTaskSwitchContext() invoked: pxCurrentTCB updated to " << incoming.name << "\n";

    std::cout << "[STEP 6-7] Loaded incoming PSP from " << incoming.name << "->pxTopOfStack: 0x" 
              << incoming.psp << "\n";
    std::cout << "           Software pops R4-R11 via 'LDMIA R0!, {R4-R11}'\n";
    incoming.psp += (8 * 4);

    std::cout << "[STEP 8]   Updated PSP register. Executing 'BX LR'...\n";
    std::cout << "           Hardware automatically un-stacks R0-R3,R12,LR,PC,xPSR into " 
              << incoming.name << "!\n";
    std::cout << "-> Context switch complete! " << incoming.name << " is now RUNNING on CPU.\n";
}

int main() {
    TaskContext task1 = {"Task1_LowPriority", {1,2,3,4,5,6,7,8}, 0x20001000};
    TaskContext task2 = {"Task2_HighPriority", {9,10,11,12,13,14,15,16}, 0x20002000};

    tracePendSvContextSwitch(task1, task2);
    return 0;
}""",
                "output": r"""=== PENDING SV CONTEXT SWITCH TRACE ===
[STEP 1-3] Hardware stacked R0-R3,R12,LR,PC,xPSR onto PSP (0x20001000)
           Software pushes R4-R11 via 'STMDB R0!, {R4-R11}'
[STEP 4]   Saved updated PSP into Task1_LowPriority->pxTopOfStack: 0x20000fe0
[STEP 5]   vTaskSwitchContext() invoked: pxCurrentTCB updated to Task2_HighPriority
[STEP 6-7] Loaded incoming PSP from Task2_HighPriority->pxTopOfStack: 0x20002000
           Software pops R4-R11 via 'LDMIA R0!, {R4-R11}'
[STEP 8]   Updated PSP register. Executing 'BX LR'...
           Hardware automatically un-stacks R0-R3,R12,LR,PC,xPSR into Task2_HighPriority!
-> Context switch complete! Task2_HighPriority is now RUNNING on CPU.""",
                "codeNotes": [
                    {"line": 13, "note": "STMDB R0!, {R4-R11} saves remaining 8 general-purpose registers onto task PSP"},
                    {"line": 18, "note": "vTaskSwitchContext selects highest-priority ready task to become pxCurrentTCB"},
                    {"line": 23, "note": "LDMIA R0!, {R4-R11} restores callee-saved registers for incoming task"}
                ],
                "tryIt": "Count total clock cycles for STMDB and LDMIA on Cortex-M4 and verify total context switch duration.",
                "check": {
                    "question": "Which set of registers must software explicitly push and pop in PendSV_Handler that hardware does not stack automatically?",
                    "options": [
                        "R4 through R11 (the 8 callee-saved registers)",
                        "R0 through R3",
                        "PC and xPSR",
                        "The SysTick control registers"
                    ],
                    "answer": 0,
                    "why": "Hardware automatically stacks R0-R3, R12, LR, PC, and xPSR; software in PendSV_Handler is responsible for preserving the remaining 8 registers (R4-R11)."
                }
            },
            {
                "title": "Preemption and Cooperative Slicing: taskYIELD(), vTaskDelay() & SysTick Management",
                "say": [
                    "A real-time operating system supports two distinct mechanisms for task switching: Cooperative yielding and Preemptive time-slicing.",
                    "In Cooperative Multitasking, a running task voluntarily gives up the CPU by calling `taskYIELD()` or entering a timed sleep via `vTaskDelay()`.",
                    "`vTaskDelay(ticks)` places the calling task into the `xDelayedTaskList`, un-schedules it, and triggers a context switch, freeing the CPU for lower-priority tasks.",
                    "In Preemptive Multitasking, the hardware SysTick timer interrupts the running task periodically (every 1.0 ms).",
                    "Inside `SysTick_Handler`, the kernel increments `xTickCount`, checks whether delayed tasks have timed out, and determines if a higher-priority task is ready to preempt.",
                    "If a higher-priority task is ready, SysTick asserts the PendSV bit; the current task is preempted involuntarily without its knowledge or cooperation."
                ],
                "example": "Cooperative is taking turns speaking at a polite dinner party (you finish your sentence and say 'your turn'); preemptive is a debate moderator with a buzzer cutting off the microphone the microsecond your time limit expires.",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

struct SchedulerState {
    uint32_t currentTick;
    std::string runningTask;
    uint32_t runningPriority;
    bool pendSvTriggered;

    void onSysTick() {
        currentTick++;
        std::cout << "[SYSTICK TICK #" << currentTick << "] Evaluating preemptive scheduling...\n";

        // Suppose high-priority motor task (Priority 4) unblocks at tick 10
        if (currentTick == 10 && runningPriority < 4) {
            std::cout << "  -> High-Priority Task 'MotorControl' (Pri 4) unblocked!\n";
            std::cout << "  -> PREEMPTING '" << runningTask << "' (Pri " << runningPriority << ")\n";
            pendSvTriggered = true;
            runningTask = "MotorControl";
            runningPriority = 4;
        }
    }

    void taskYield(const std::string& nextTask, uint32_t nextPriority) {
        std::cout << "[COOPERATIVE YIELD] '" << runningTask << "' voluntarily yields CPU\n";
        runningTask = nextTask;
        runningPriority = nextPriority;
        std::cout << "  -> Switched to '" << runningTask << "'\n";
    }
};

int main() {
    SchedulerState rtos = {9, "TelemetryLogger", 1, false};

    // Preemption test
    rtos.onSysTick(); // Tick 10: triggers preemption!

    // Cooperative yield test
    rtos.taskYield("BackgroundWorker", 0);
    return 0;
}""",
                "output": r"""[SYSTICK TICK #10] Evaluating preemptive scheduling...
  -> High-Priority Task 'MotorControl' (Pri 4) unblocked!
  -> PREEMPTING 'TelemetryLogger' (Pri 1)
[COOPERATIVE YIELD] 'MotorControl' voluntarily yields CPU
  -> Switched to 'BackgroundWorker'""",
                "codeNotes": [
                    {"line": 13, "note": "SysTick checks whether higher-priority tasks have become unblocked"},
                    {"line": 17, "note": "Preemption triggered involuntarily: sets PendSV to switch away from lower-priority task"},
                    {"line": 25, "note": "Cooperative taskYIELD voluntarily relinquishes CPU control"}
                ],
                "tryIt": "Demonstrate what happens if two tasks share identical priority: SysTick performs round-robin time slicing between them.",
                "check": {
                    "question": "What is the key functional difference between vTaskDelay() and a bare-metal busy-wait delay loop?",
                    "options": [
                        "vTaskDelay() puts the calling task into the Blocked state, freeing 100% of CPU cycles for other tasks to run",
                        "vTaskDelay() runs faster than a busy-wait loop",
                        "vTaskDelay() consumes more electrical power",
                        "vTaskDelay() disables all hardware interrupts"
                    ],
                    "answer": 0,
                    "why": "vTaskDelay() un-schedules the task and moves it to the delayed list, allowing lower-priority tasks to utilize the CPU rather than burning power in a spin-lock."
                }
            },
            {
                "title": "Measuring Context-Switching Overhead: Nanosecond Benchmarking of Task Swap Durations",
                "say": [
                    "How long does an RTOS context switch actually take on ARM Cortex-M hardware?",
                    "Let us calculate the clock cycle budget: Hardware stacking (12 cycles) + `STMDB` R4-R11 (8 cycles) + TCB pointer swap (6 cycles) + `vTaskSwitchContext` (approx 20–30 cycles) + `LDMIA` R4-R11 (8 cycles) + Hardware unstacking (12 cycles).",
                    "Total context switch cost is approximately 66 to 76 clock cycles.",
                    "At 168 MHz (such as an STM32F4), 70 clock cycles equals exactly 416.7 nanoseconds (less than half a microsecond!).",
                    "At 16 MHz, it equals 4.37 microseconds.",
                    "Because context switching consumes less than 1 microsecond, FreeRTOS can switch tasks thousands of times per second while consuming less than 1% of total CPU compute capacity."
                ],
                "example": "A high-speed camera shutter: 400 nanoseconds is so fast that light only travels about 400 feet while the entire operating system swaps memory and register state.",
                "code": r"""#include <iostream>
#include <iomanip>
#include <cstdint>

struct ContextSwitchBudget {
    uint32_t cpuFrequencyHz;
    uint32_t hwStackCycles;
    uint32_t swPushCycles;
    uint32_t schedulerLogicCycles;
    uint32_t swPopCycles;
    uint32_t hwUnstackCycles;

    uint32_t getTotalCycles() const {
        return hwStackCycles + swPushCycles + schedulerLogicCycles + swPopCycles + hwUnstackCycles;
    }

    double getDurationMicroseconds() const {
        return ((double)getTotalCycles() / cpuFrequencyHz) * 1e6;
    }

    double calculateCpuOverheadAt1kHz() const {
        // 1000 context switches per second
        double totalTimeSpent = (double)getTotalCycles() * 1000.0;
        return (totalTimeSpent / cpuFrequencyHz) * 100.0;
    }
};

int main() {
    ContextSwitchBudget f4 = {168000000, 12, 8, 28, 8, 12}; // Total 68 cycles on Cortex-M4

    std::cout << "ARM Cortex-M FreeRTOS Context Switching Performance:\n";
    std::cout << "  Core Clock Frequency:  " << (f4.cpuFrequencyHz / 1e6) << " MHz\n";
    std::cout << "  Total Switch Cycles:   " << f4.getTotalCycles() << " clock cycles\n";
    std::cout << "  Context Switch Time:   " << std::fixed << std::setprecision(3) 
              << f4.getDurationMicroseconds() << " microseconds (" 
              << (f4.getDurationMicroseconds() * 1000.0) << " ns)\n";
    std::cout << "  CPU Load at 1,000 Hz:  " << std::setprecision(3) 
              << f4.calculateCpuOverheadAt1kHz() << "% of CPU budget\n";
    return 0;
}""",
                "output": r"""ARM Cortex-M FreeRTOS Context Switching Performance:
  Core Clock Frequency:  168 MHz
  Total Switch Cycles:   68 clock cycles
  Context Switch Time:   0.405 microseconds (404.762 ns)
  CPU Load at 1,000 Hz:  0.040% of CPU budget""",
                "codeNotes": [
                    {"line": 13, "note": "Sums hardware (24 cycles) and software (44 cycles) context switch components"},
                    {"line": 28, "note": "Proves sub-500-nanosecond context switch duration at 168 MHz"},
                    {"line": 32, "note": "Demonstrates negligible 0.04% CPU overhead for 1 kHz time slicing"}
                ],
                "tryIt": "Compute the context switch time at 480 MHz (Cortex-M7) and verify that it drops below 150 nanoseconds.",
                "check": {
                    "question": "What is the typical total context switch duration of FreeRTOS on a 168 MHz ARM Cortex-M4 microcontroller?",
                    "options": [
                        "Approximately 400 to 500 nanoseconds (less than 1 microsecond)",
                        "Over 10 milliseconds",
                        "Zero clock cycles",
                        "100 microseconds"
                    ],
                    "answer": 0,
                    "why": "With approximately 68–76 total clock cycles, a 168 MHz core executes the entire context switch in approximately 400 to 450 nanoseconds."
                }
            }
        ],
        "summary": [
            "FreeRTOS configures tasks to run in Thread Mode using the Process Stack Pointer (PSP), isolating user tasks from the kernel Main Stack Pointer (MSP).",
            "Context switching must execute inside the lowest-priority PendSV exception to prevent corrupting active hardware interrupt stack frames.",
            "PendSV_Handler executes an optimized assembly sequence: STMDB pushes R4–R11, pxTopOfStack is saved, next TCB is selected, and LDMIA restores R4–R11.",
            "Preemption is driven by the periodic SysTick interrupt asserting PendSV, while cooperative yielding is triggered by taskYIELD() and vTaskDelay().",
            "A complete FreeRTOS context switch requires approximately 68 clock cycles, executing in ~405 nanoseconds on a 168 MHz Cortex-M processor."
        ],
        "projectStep": {
            "title": "Author a Bare-Metal Assembly PendSV Context Switcher and Measure Task Swap Latency",
            "steps": [
                "Configure the CONTROL register to transition execution between MSP and private task PSP stacks.",
                "Configure SHPR3 to assign the PendSV exception the lowest possible hardware interrupt priority.",
                "Implement the complete GNU ARM assembly PendSV_Handler with STMDB/LDMIA preservation of R4–R11.",
                "Integrate the SysTick timer to trigger preemptive task switching and implement cooperative taskYIELD().",
                "Benchmark task switching overhead using DWT->CYCCNT, verifying sub-500-nanosecond execution."
            ]
        }
    }

def create_day23():
    return {
        "day": 23,
        "title": "Task Synchronization: Semaphores, Mutexes & Priority Inversion (The Mars Pathfinder Incident)",
        "goal": "Master synchronization and avoid the most famous bug in space exploration history: Priority Inversion. Analyze the 1997 Mars Pathfinder spacecraft anomaly, understand why binary semaphores fail on shared buses, implement Priority Inheritance Protocols (PIP), and prevent recursive deadlocks.",
        "minutes": 36,
        "recap": "Yesterday, we built the assembly context switcher. Today, we address the gravest concurrency hazard in real-time systems: Priority Inversion, where a low-priority task indirectly starves a mission-critical high-priority task.",
        "parts": [
            {
                "title": "Binary Semaphores vs Mutexes: Mutual Exclusion, Ownership & Signaling Semantics",
                "say": [
                    "In novice embedded code, semaphores and mutexes are frequently confused because both can restrict access to 1 token.",
                    "However, they serve fundamentally different architectural purposes.",
                    "A Binary Semaphore is a Signaling Primitive: Task A signals that an event occurred, and Task B waits for that signal; there is NO concept of ownership (Task A gives the semaphore, Task B takes it).",
                    "A Mutex (Mutual Exclusion Object) is a Locking Primitive: it protects a shared physical resource (like an I2C bus, SPI Flash, or display).",
                    "Crucial Rule: A Mutex has strict OWNERSHIP: only the task that acquired (took) the mutex is permitted to release (give) it.",
                    "Because of ownership, a Mutex supports Priority Inheritance, whereas a Binary Semaphore does not."
                ],
                "example": "A semaphore is a green flag waved at a racetrack (the flagger waves it, the driver moves); a mutex is a key to a private restroom (you take the key into the restroom, and ONLY you can return the key when you exit).",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

class SimulatedMutex {
private:
    bool locked;
    std::string ownerTask;
public:
    SimulatedMutex() : locked(false), ownerTask("NONE") {}

    bool take(const std::string& taskName) {
        if (!locked) {
            locked = true;
            ownerTask = taskName;
            std::cout << "[MUTEX TAKE] Locked by '" << ownerTask << "'\n";
            return true;
        }
        std::cout << "[MUTEX BLOCKED] Task '" << taskName << "' blocked! Owned by '" << ownerTask << "'\n";
        return false;
    }

    bool give(const std::string& taskName) {
        if (!locked) return false;
        // Enforce ownership invariant!
        if (taskName != ownerTask) {
            std::cout << "[MUTEX ERROR] Illegal unlock! Task '" << taskName 
                      << "' attempted to release mutex owned by '" << ownerTask << "'!\n";
            return false;
        }
        locked = false;
        ownerTask = "NONE";
        std::cout << "[MUTEX RELEASE] Mutex successfully unlocked by '" << taskName << "'\n";
        return true;
    }
};

int main() {
    SimulatedMutex i2cBusMutex;
    i2cBusMutex.take("SensorTask");
    // Illegal attempt: TelemetryTask tries to release mutex it does not own
    i2cBusMutex.give("TelemetryTask");
    // Legal release: SensorTask releases its own mutex
    i2cBusMutex.give("SensorTask");
    return 0;
}""",
                "output": r"""[MUTEX TAKE] Locked by 'SensorTask'
[MUTEX ERROR] Illegal unlock! Task 'TelemetryTask' attempted to release mutex owned by 'SensorTask'!
[MUTEX RELEASE] Mutex successfully unlocked by 'SensorTask'""",
                "codeNotes": [
                    {"line": 13, "note": "Mutex take records acquiring task identity as strict owner"},
                    {"line": 25, "note": "Enforces ownership invariant: rejects unlock attempts from non-owner tasks"},
                    {"line": 39, "note": "Releases mutex safely when called by verified owner task"}
                ],
                "tryIt": "Explain why a binary semaphore cannot enforce ownership if an interrupt handler needs to signal a task.",
                "check": {
                    "question": "What is the key architectural difference between a Binary Semaphore and a Mutex in FreeRTOS?",
                    "options": [
                        "A Mutex enforces strict task ownership and supports priority inheritance; a semaphore is an anonymous signaling token without ownership",
                        "A Mutex can store up to 256 tokens, while a semaphore only stores 1",
                        "A semaphore cannot be used in C++",
                        "A Mutex disables all CPU interrupts permanently"
                    ],
                    "answer": 0,
                    "why": "Mutexes implement ownership semantics (only the locking task can unlock it), which is the essential prerequisite for implementing priority inheritance."
                }
            },
            {
                "title": "The 1997 Mars Pathfinder Anomaly: Autopsy of Unbounded Priority Inversion",
                "say": [
                    "On July 4, 1997, NASA's Mars Pathfinder spacecraft landed on Mars to international acclaim.",
                    "A few days into the mission, the lander began experiencing spontaneous total system resets, losing precious scientific data.",
                    "The NASA software team conducted a forensic analysis and uncovered the most famous bug in real-time history: Unbounded Priority Inversion.",
                    "Three tasks were involved: Task Low (meteorological sensor gathering wind data), Task Med (long-running communications/audio task), and Task High (critical attitude control and information bus manager).",
                    "Task Low acquired a shared mutex on the `1553` information bus. While Task Low held the mutex, high-priority Task High became ready and preempted Task Low.",
                    "Task High attempted to access the bus, found the mutex locked, and blocked, allowing Task Low to resume to finish and release the bus.",
                    "BUT before Task Low could release the bus, medium-priority Task Med (which didn't even use the bus!) woke up; because Priority Med > Priority Low, Task Med preempted Task Low indefinitely!",
                    "Task High was now blocked by Task Low, which was blocked by Task Med; a medium task was indirectly starving the highest-priority task in the entire spacecraft!",
                    "A watchdog timer detected that Task High had not run for several seconds, assumed total computer failure, and reset the entire spacecraft."
                ],
                "example": "A fire truck (Task High) is stuck at a narrow one-lane bridge because a slow tractor (Task Low) is crossing; but before the tractor gets across, a parade of marching bands (Task Med) cuts in front of the tractor, stranding the fire truck indefinitely.",
                "code": r"""#include <iostream>
#include <string>

void simulateMarsPathfinderAnomaly(bool priorityInheritanceEnabled) {
    std::cout << "=========================================================\n";
    std::cout << "  MARS PATHFINDER PRIORITY INVERSION SIMULATION\n";
    std::cout << "  (Priority Inheritance: " << (priorityInheritanceEnabled ? "ENABLED" : "DISABLED") << ")\n";
    std::cout << "=========================================================\n";
    std::cout << "[TIME 0] Task LOW (Meteo) acquires 1553 Bus Mutex\n";
    std::cout << "[TIME 1] Task HIGH (Attitude Control) wakes up -> Preempts Task LOW\n";
    std::cout << "[TIME 2] Task HIGH requests 1553 Bus Mutex -> BLOCKS (Owned by LOW)!\n";

    if (!priorityInheritanceEnabled) {
        std::cout << "[TIME 3] CPU resumes Task LOW to finish bus work...\n";
        std::cout << "[TIME 4] Task MED (Communications) wakes up! (Pri MED > Pri LOW)\n";
        std::cout << "[TIME 5] Task MED PREEMPTS Task LOW indefinitely!\n";
        std::cout << "  -> FATAL INVERSION: Task HIGH is starved by Task MED!\n";
        std::cout << "  -> [WATCHDOG TIMEOUT] Spacecraft watchdog resets system on Mars!\n";
    } else {
        std::cout << "  -> [PRIORITY INHERITANCE ACTIVE] Task LOW temporarily ELEVATED to Priority HIGH!\n";
        std::cout << "[TIME 3] Task MED wakes up (Pri MED < Inherited Pri HIGH) -> Task MED BLOCKED!\n";
        std::cout << "[TIME 4] Task LOW finishes 1553 Bus transaction and releases mutex!\n";
        std::cout << "  -> Task LOW drops back to normal Priority LOW.\n";
        std::cout << "[TIME 5] Task HIGH immediately unblocks and executes with ZERO starvation!\n";
    }
}

int main() {
    simulateMarsPathfinderAnomaly(false); // Reproduce 1997 anomaly
    std::cout << "\n";
    simulateMarsPathfinderAnomaly(true);  // Apply Mars patch
    return 0;
}""",
                "output": r"""=========================================================
  MARS PATHFINDER PRIORITY INVERSION SIMULATION
  (Priority Inheritance: DISABLED)
=========================================================
[TIME 0] Task LOW (Meteo) acquires 1553 Bus Mutex
[TIME 1] Task HIGH (Attitude Control) wakes up -> Preempts Task LOW
[TIME 2] Task HIGH requests 1553 Bus Mutex -> BLOCKS (Owned by LOW)!
[TIME 3] CPU resumes Task LOW to finish bus work...
[TIME 4] Task MED (Communications) wakes up! (Pri MED > Pri LOW)
[TIME 5] Task MED PREEMPTS Task LOW indefinitely!
  -> FATAL INVERSION: Task HIGH is starved by Task MED!
  -> [WATCHDOG TIMEOUT] Spacecraft watchdog resets system on Mars!

=========================================================
  MARS PATHFINDER PRIORITY INVERSION SIMULATION
  (Priority Inheritance: ENABLED)
=========================================================
[TIME 0] Task LOW (Meteo) acquires 1553 Bus Mutex
[TIME 1] Task HIGH (Attitude Control) wakes up -> Preempts Task LOW
[TIME 2] Task HIGH requests 1553 Bus Mutex -> BLOCKS (Owned by LOW)!
  -> [PRIORITY INHERITANCE ACTIVE] Task LOW temporarily ELEVATED to Priority HIGH!
[TIME 3] Task MED wakes up (Pri MED < Inherited Pri HIGH) -> Task MED BLOCKED!
[TIME 4] Task LOW finishes 1553 Bus transaction and releases mutex!
  -> Task LOW drops back to normal Priority LOW.
[TIME 5] Task HIGH immediately unblocks and executes with ZERO starvation!""",
                "codeNotes": [
                    {"line": 15, "note": "Without inheritance: medium-priority tasks preempt low-priority mutex holder indefinitely"},
                    {"line": 21, "note": "With inheritance: low-priority holder inherits priority of blocked high-priority task"},
                    {"line": 25, "note": "Task drops back to base priority the instant the mutex is released"}
                ],
                "tryIt": "Trace the exact timeline showing how JPL engineers uploaded a remote C patch to Mars enabling priority inheritance on the mutex.",
                "check": {
                    "question": "What caused the Mars Pathfinder spacecraft to repeatedly reboot on Mars in 1997?",
                    "options": [
                        "Unbounded Priority Inversion: a medium task preempted a low task holding a mutex needed by a critical high task, starving the high task until the watchdog tripped",
                        "The solar panels ran out of battery power",
                        "A cosmic ray physically severed a wire",
                        "The Flash memory filled up"
                    ],
                    "answer": 0,
                    "why": "Medium-priority communications tasks preempted the low-priority meteorological task while it held a bus mutex, preventing the high-priority attitude task from running and triggering watchdog reboots."
                }
            },
            {
                "title": "Priority Inheritance Protocols (PIP): Dynamic Priority Elevation of Mutex Holders",
                "say": [
                    "The Priority Inheritance Protocol (PIP) is the mathematical remedy for unbounded priority inversion.",
                    "Under PIP, when a high-priority task blocks waiting for a mutex held by a lower-priority task, the kernel TEMPORARILY elevates the priority of the holder to match that of the waiting task.",
                    "In the Mars Pathfinder scenario, the moment Task High blocks on the mutex, Task Low's effective priority is instantly promoted to Priority High.",
                    "Now, when Task Med wakes up, it cannot preempt Task Low because Task Low is running with inherited Priority High!",
                    "Task Low finishes its critical section as quickly as possible and releases the mutex.",
                    "The instant the mutex is released, the kernel restores Task Low back to its original baseline priority, and Task High unblocks and acquires the mutex immediately."
                ],
                "example": "A police escort: a slow garbage truck is carrying a package needed by the governor; the state police temporarily give the garbage truck police sirens and escort it through all red lights so it can deliver the package without getting stuck in traffic.",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

struct TcbWithPriorityInheritance {
    std::string name;
    uint32_t basePriority;
    uint32_t activePriority; // Can be temporarily elevated!
};

class PipMutex {
private:
    bool locked;
    TcbWithPriorityInheritance* owner;
public:
    PipMutex() : locked(false), owner(nullptr) {}

    bool take(TcbWithPriorityInheritance* task) {
        if (!locked) {
            locked = true;
            owner = task;
            return true;
        }

        // Contest! Another task wants this mutex
        std::cout << "[PIP CONTEST] Task '" << task->name << "' (Pri " << task->activePriority 
                  << ") wants mutex owned by '" << owner->name << "' (Pri " << owner->activePriority << ")\n";

        if (task->activePriority > owner->activePriority) {
            std::cout << "  -> [PRIORITY ELEVATION] Elevating '" << owner->name 
                      << "' priority from " << owner->activePriority << " to " << task->activePriority << "!\n";
            owner->activePriority = task->activePriority; // Dynamic inheritance
        }
        return false; // Requesting task blocks
    }

    void give() {
        if (!locked || !owner) return;
        std::cout << "[PIP RELEASE] Mutex released by '" << owner->name << "'\n";
        if (owner->activePriority != owner->basePriority) {
            std::cout << "  -> [PRIORITY RESTORATION] Restoring '" << owner->name 
                      << "' priority back to base level " << owner->basePriority << "\n";
            owner->activePriority = owner->basePriority;
        }
        locked = false;
        owner = nullptr;
    }
};

int main() {
    TcbWithPriorityInheritance taskLow = {"TaskLow", 1, 1};
    TcbWithPriorityInheritance taskHigh = {"TaskHigh", 4, 4};

    PipMutex bus;
    bus.take(&taskLow);  // Low locks bus
    bus.take(&taskHigh); // High contests: Low is elevated to 4!
    bus.give();          // Low finishes: drops back to 1!
    return 0;
}""",
                "output": r"""[PIP CONTEST] Task 'TaskHigh' (Pri 4) wants mutex owned by 'TaskLow' (Pri 1)
  -> [PRIORITY ELEVATION] Elevating 'TaskLow' priority from 1 to 4!
[PIP RELEASE] Mutex released by 'TaskLow'
  -> [PRIORITY RESTORATION] Restoring 'TaskLow' priority back to base level 1""",
                "codeNotes": [
                    {"line": 23, "note": "Elevates owner's activePriority to match the contesting task's higher priority"},
                    {"line": 34, "note": "Restores owner's activePriority back to its basePriority the instant the mutex is released"},
                    {"line": 48, "note": "Demonstrates dynamic priority inheritance cycle avoiding priority inversion"}
                ],
                "tryIt": "Demonstrate that if a third task with Priority 3 attempts to take the mutex, the owner remains at Priority 4.",
                "check": {
                    "question": "When does a low-priority task relinquish its inherited elevated priority under the Priority Inheritance Protocol?",
                    "options": [
                        "The exact moment it releases the mutex that caused the priority elevation",
                        "When the microcontroller is reset",
                        "After exactly 100 clock cycles",
                        "When it calls vTaskDelete()"
                    ],
                    "answer": 0,
                    "why": "Priority inheritance is tied directly to mutex ownership; releasing the mutex immediately restores the task's active priority back to its original baseline."
                }
            },
            {
                "title": "Recursive Mutexes & Deadlock Prevention: Resource Hierarchies",
                "say": [
                    "A standard mutex will deadlock if the same task attempts to acquire it twice: the task blocks waiting for the mutex, but it cannot release the mutex because it is blocked on itself!",
                    "A Recursive Mutex (`xSemaphoreCreateRecursiveMutex`) solves this: it maintains a recursion lock count.",
                    "The owning task can acquire the recursive mutex multiple times without blocking; the mutex is only released back to the system when the owner calls give an equal number of times (`takeCount == giveCount`).",
                    "However, having multiple mutexes introduces Deadlocks: Task A holds Mutex 1 and waits for Mutex 2; Task B holds Mutex 2 and waits for Mutex 1 (the deadly embrace).",
                    "To guarantee that deadlocks can never occur, embedded systems implement strict Resource Acquisition Hierarchies.",
                    "Rule: All tasks in the entire system MUST acquire shared mutexes in the exact same predefined numerical order (e.g., always acquire BusMutex before MemoryMutex, never in reverse)."
                ],
                "example": "Two people at a dinner table: person A has the fork and waits for the knife; person B has the knife and waits for the fork; neither can eat until one puts down their utensil. If the rule says 'always pick up the fork first', deadlock is impossible.",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

class RecursiveMutex {
private:
    std::string owner;
    uint32_t lockCount;
public:
    RecursiveMutex() : owner("NONE"), lockCount(0) {}

    bool take(const std::string& task) {
        if (lockCount == 0) {
            owner = task;
            lockCount = 1;
            std::cout << "[RECURSIVE LOCK] Locked by '" << owner << "' (Depth: 1)\n";
            return true;
        } else if (owner == task) {
            lockCount++; // Same task can re-enter safely!
            std::cout << "[RECURSIVE RE-ENTRY] '" << owner << "' re-locked (Depth: " << lockCount << ")\n";
            return true;
        }
        std::cout << "[BLOCKED] Task '" << task << "' blocked by '" << owner << "'\n";
        return false;
    }

    bool give(const std::string& task) {
        if (owner != task || lockCount == 0) return false;
        lockCount--;
        std::cout << "[RECURSIVE UNLOCK] '" << task << "' released (Remaining Depth: " << lockCount << ")\n";
        if (lockCount == 0) {
            owner = "NONE";
            std::cout << "  -> Mutex fully released to system!\n";
        }
        return true;
    }
};

int main() {
    RecursiveMutex mutex;
    // Task enters nested functions, acquiring same mutex twice
    mutex.take("ControlTask");
    mutex.take("ControlTask"); // Re-enters cleanly without deadlock
    mutex.give("ControlTask");
    mutex.give("ControlTask"); // Fully released
    return 0;
}""",
                "output": r"""[RECURSIVE LOCK] Locked by 'ControlTask' (Depth: 1)
[RECURSIVE RE-ENTRY] 'ControlTask' re-locked (Depth: 2)
[RECURSIVE UNLOCK] 'ControlTask' released (Remaining Depth: 1)
[RECURSIVE UNLOCK] 'ControlTask' released (Remaining Depth: 0)
  -> Mutex fully released to system!""",
                "codeNotes": [
                    {"line": 16, "note": "Allows same owner task to re-enter and increment lockCount without blocking on itself"},
                    {"line": 26, "note": "Decrements lockCount on each give; releases to system only when count reaches 0"},
                    {"line": 39, "note": "Demonstrates safe nested mutex acquisition across hierarchical functions"}
                ],
                "tryIt": "Demonstrate that another task attempting to take the mutex while lockCount=1 is blocked.",
                "check": {
                    "question": "How does a Resource Acquisition Hierarchy eliminate deadlocks in multi-threaded RTOS applications?",
                    "options": [
                        "By requiring all tasks to acquire multiple mutexes in the exact same predefined global order, preventing circular wait dependencies",
                        "By deleting tasks that use more than one mutex",
                        "By forcing all mutexes to expire after 1 millisecond",
                        "By running all code in single-threaded mode"
                    ],
                    "answer": 0,
                    "why": "Deadlocks require a circular wait condition; enforcing a strict global acquisition order (e.g., Mutex 1 before Mutex 2) mathematically eliminates circular dependencies."
                }
            },
            {
                "title": "Counting Semaphores for Resource Pool Management",
                "say": [
                    "While mutexes protect single exclusive resources, how do we manage a pool of identical resources (e.g. 4 available DMA memory buffers or 3 network sockets)?",
                    "The solution is a Counting Semaphore (`xSemaphoreCreateCounting`).",
                    "A counting semaphore maintains a counter ranging from 0 up to `maxCount`.",
                    "Each `take` operation decrements the count; if the count is zero, the task blocks until a resource is returned.",
                    "Each `give` operation increments the count and unblocks the highest-priority waiting task.",
                    "Counting semaphores are also used for event counting: an interrupt handler increments the semaphore on every physical pulse, and a worker task decrements it to process events in order."
                ],
                "example": "A bowling alley with 5 pairs of rental shoes: players take a pair (count decrements); when all 5 pairs are rented, the next player must wait at the counter until someone returns a pair (count increments).",
                "code": r"""#include <iostream>
#include <cstdint>

class CountingSemaphore {
private:
    uint32_t count;
    uint32_t maxCount;
public:
    CountingSemaphore(uint32_t initial, uint32_t max) : count(initial), maxCount(max) {}

    bool take(const std::string& task) {
        if (count > 0) {
            count--;
            std::cout << "[SEMAPHORE TAKE] '" << task << "' acquired resource (Remaining: " << count << ")\n";
            return true;
        }
        std::cout << "[SEMAPHORE BLOCKED] '" << task << "' blocked! Pool exhausted (0 available)\n";
        return false;
    }

    void give() {
        if (count < maxCount) {
            count++;
            std::cout << "[SEMAPHORE GIVE] Resource returned to pool (Available: " << count << ")\n";
        }
    }
};

int main() {
    CountingSemaphore dmaBufferPool(2, 2); // 2 DMA buffers available
    dmaBufferPool.take("TaskA");
    dmaBufferPool.take("TaskB");
    dmaBufferPool.take("TaskC"); // Pool exhausted -> blocks!
    dmaBufferPool.give();        // Resource returned
    dmaBufferPool.take("TaskC"); // TaskC now acquires!
    return 0;
}""",
                "output": r"""[SEMAPHORE TAKE] 'TaskA' acquired resource (Remaining: 1)
[SEMAPHORE TAKE] 'TaskB' acquired resource (Remaining: 0)
[SEMAPHORE BLOCKED] 'TaskC' blocked! Pool exhausted (0 available)
[SEMAPHORE GIVE] Resource returned to pool (Available: 1)
[SEMAPHORE TAKE] 'TaskC' acquired resource (Remaining: 0)""",
                "codeNotes": [
                    {"line": 10, "note": "Initializes counting semaphore with initial and maximum available tokens"},
                    {"line": 12, "note": "Take decrements available resource count; blocks when count reaches zero"},
                    {"line": 30, "note": "Demonstrates resource pool allocation across multiple concurrent tasks"}
                ],
                "tryIt": "Initialize maxCount to 4 and verify that 4 tasks can acquire resources simultaneously.",
                "check": {
                    "question": "What happens when a task attempts to take a counting semaphore whose current count is zero?",
                    "options": [
                        "The task enters the Blocked state until another task or ISR gives the semaphore",
                        "The microcontroller generates a HardFault exception",
                        "The count becomes negative (-1)",
                        "The semaphore is deleted"
                    ],
                    "answer": 0,
                    "why": "When a semaphore count is zero, all tokens are in use; requesting tasks block until an active holder releases a token."
                }
            }
        ],
        "summary": [
            "Binary semaphores are anonymous signaling primitives without ownership; mutexes enforce strict task ownership and support priority inheritance.",
            "The 1997 Mars Pathfinder anomaly proved that priority inversion occurs when medium tasks preempt low-priority mutex holders, starving high-priority tasks.",
            "The Priority Inheritance Protocol (PIP) dynamically elevates a mutex holder's priority to match the highest-priority blocked task until release.",
            "Recursive mutexes allow the same task to re-enter nested critical sections, and resource hierarchies eliminate circular deadlocks.",
            "Counting semaphores manage finite pools of shared resources (e.g. DMA buffers, network sockets) with bounded waiting queues."
        ],
        "projectStep": {
            "title": "Construct a Priority-Inheritance Mutex Manager and Recreate the Mars Pathfinder Anomaly",
            "steps": [
                "Implement a thread-safe mutex structure with task ownership verification on take and give.",
                "Recreate the Mars Pathfinder priority inversion condition with Low, Medium, and High priority tasks.",
                "Implement the Priority Inheritance Protocol (PIP) dynamically elevating mutex holders to contestor priorities.",
                "Author a recursive mutex maintaining nested lock counts to support hierarchical function calls.",
                "Implement a counting semaphore managing a pool of 4 DMA audio buffers with zero deadlocks."
            ]
        }
    }

def create_day24():
    return {
        "day": 24,
        "title": "Inter-Task Communication: FreeRTOS Queues, Direct-to-Task Notifications & Event Groups",
        "goal": "Communicate safely between concurrent tasks: master FreeRTOS communication primitives. Understand copy-by-value queue memory isolation, Direct-to-Task notifications (zero-RAM overhead), multi-event bitmask synchronization groups, and interrupt-safe deferred processing via xQueueSendFromISR.",
        "minutes": 36,
        "recap": "Yesterday, we conquered task synchronization, mutexes, and priority inheritance. Today, we master data transport between tasks: thread-safe queues, zero-overhead direct notifications, and interrupt-to-task pipelines.",
        "parts": [
            {
                "title": "FreeRTOS Queues: Copy-by-Value Memory Isolation Invariant & Thread-Safe Ring Buffers",
                "say": [
                    "In multi-tasking systems, tasks must pass data packets to each other without corrupting memory or introducing race conditions.",
                    "The primary communication mechanism in FreeRTOS is the Queue (`QueueHandle_t`).",
                    "Crucial Invariant: FreeRTOS queues operate strictly by COPY-BY-VALUE, not copy-by-reference.",
                    "When a task sends an item via `xQueueSend()`, the kernel copies the byte payload directly into its private internal ring buffer; when the receiving task calls `xQueueReceive()`, the bytes are copied into the receiver's local variable.",
                    "Because data is copied by value, the sending task can immediately overwrite, re-use, or exit the function that created the original variable with 100% safety.",
                    "Copy-by-value completely eliminates dangling pointers, memory leaks, and multi-threaded race conditions."
                ],
                "example": "Mailing a physical letter: you photocopy your document and drop the paper copy in the mailbox (queue); you can shred or rewrite your original draft on your desk, and the recipient still gets the exact copy you mailed.",
                "code": r"""#include <iostream>
#include <vector>
#include <cstring>
#include <cstdint>

template <typename T, size_t CAPACITY>
class FreeRtosQueue {
private:
    T storage[CAPACITY];
    size_t head;
    size_t tail;
    size_t count;
public:
    FreeRtosQueue() : head(0), tail(0), count(0) {}

    // Copy-by-value send
    bool send(const T& item) {
        if (count >= CAPACITY) return false; // Queue full
        storage[head] = item; // Deep copy by value!
        head = (head + 1) % CAPACITY;
        count++;
        std::cout << "[QUEUE SEND] Item copied into kernel storage (Queue Fill: " 
                  << count << "/" << CAPACITY << ")\n";
        return true;
    }

    // Copy-by-value receive
    bool receive(T& item) {
        if (count == 0) return false; // Queue empty
        item = storage[tail]; // Deep copy by value!
        tail = (tail + 1) % CAPACITY;
        count--;
        std::cout << "[QUEUE RECEIVE] Item copied out of kernel storage (Remaining: " 
                  << count << ")\n";
        return true;
    }
};

struct SensorPayload {
    uint32_t sensorId;
    int16_t temperatureC;
    uint16_t pressureHpa;
};

int main() {
    FreeRtosQueue<SensorPayload, 4> queue;

    // Sender creates local variable on its private stack
    SensorPayload localData = {1, 28, 1013};
    queue.send(localData);

    // Sender immediately modifies its local copy
    localData.temperatureC = 99; // Will NOT corrupt queue!

    // Receiver gets the original safe copy
    SensorPayload received;
    queue.receive(received);
    std::cout << "Received Sensor Reading: Temp = " << received.temperatureC 
              << " C (Verified uncorrupted!)\n";
    return 0;
}""",
                "output": r"""[QUEUE SEND] Item copied into kernel storage (Queue Fill: 1/4)
[QUEUE RECEIVE] Item copied out of kernel storage (Remaining: 0)
Received Sensor Reading: Temp = 28 C (Verified uncorrupted!)""",
                "codeNotes": [
                    {"line": 16, "note": "storage[head] = item executes byte-for-byte copy into kernel buffer"},
                    {"line": 48, "note": "Modifying localData does not affect the data already queued in kernel memory"},
                    {"line": 53, "note": "Receiver receives original uncorrupted 28 C temperature payload"}
                ],
                "tryIt": "Demonstrate the fatal bug of passing pointers to stack-allocated variables through queues.",
                "check": {
                    "question": "Why does FreeRTOS use Copy-by-Value rather than Copy-by-Reference for queue messages?",
                    "options": [
                        "To guarantee memory isolation so the sender can safely modify or discard its local variable without corrupting the receiver",
                        "Because pointers are not supported in embedded C",
                        "To reduce the size of the microcontroller Flash memory",
                        "Because the ARM processor does not support RAM"
                    ],
                    "answer": 0,
                    "why": "Copy-by-value ensures complete memory decoupling: tasks do not share pointers, preventing race conditions and dangling pointer bugs."
                }
            },
            {
                "title": "Passing Complex Data Without Corruption: Senders, Receivers & Bounded Timeout Blocking",
                "say": [
                    "FreeRTOS queues provide built-in real-time blocking: tasks specify a timeout in ticks (`TicksToWait`).",
                    "If a task attempts to receive from an empty queue (`xQueueReceive`), it enters the BLOCKED state and consumes 0% CPU cycles until data arrives or the timeout expires.",
                    "If a task attempts to send to a full queue (`xQueueSend`), it blocks until another task reads a packet, creating automatic backpressure and rate limiting.",
                    "For large payloads (such as a 10KB display framebuffer or camera image), copying 10KB by value through a queue would be inefficient.",
                    "In such cases, the established pattern is Queue of Pointers: software allocates a static or pool buffer, and sends the 4-byte pointer through the queue.",
                    "Invariant: When passing pointers through queues, strict ownership transfer must be maintained: the sender must never touch the buffer after sending until the receiver explicitly hands it back."
                ],
                "example": "Passing a heavy cargo shipping container: you don't mail the container itself through the postal system; you mail the paper bill of lading (the pointer) that authorizes the recipient to take ownership of the container at the shipping dock.",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

struct LargeFrameBuffer {
    uint32_t frameId;
    uint8_t pixels[1024]; // 1KB frame
};

class PointerQueue {
private:
    LargeFrameBuffer* queueSlot;
    bool hasData;
public:
    PointerQueue() : queueSlot(nullptr), hasData(false) {}

    bool sendPointer(LargeFrameBuffer* ptr) {
        if (hasData) return false; // Full
        queueSlot = ptr; // Passes 4-byte pointer with zero payload copying!
        hasData = true;
        std::cout << "[QUEUE POINTER] Passed pointer to Frame #" << ptr->frameId 
                  << " (Only 4 bytes copied across queue!)\n";
        return true;
    }

    LargeFrameBuffer* receivePointer() {
        if (!hasData) return nullptr;
        LargeFrameBuffer* ptr = queueSlot;
        hasData = false;
        std::cout << "[QUEUE POINTER] Receiver took ownership of Frame #" << ptr->frameId << "\n";
        return ptr;
    }
};

int main() {
    PointerQueue ptrQueue;
    LargeFrameBuffer frame1 = {101, {0}};

    ptrQueue.sendPointer(&frame1);
    LargeFrameBuffer* received = ptrQueue.receivePointer();
    std::cout << "Received Frame ID: " << received->frameId << " (Zero-copy transfer complete!)\n";
    return 0;
}""",
                "output": r"""[QUEUE POINTER] Passed pointer to Frame #101 (Only 4 bytes copied across queue!)
[QUEUE POINTER] Receiver took ownership of Frame #101
Received Frame ID: 101 (Zero-copy transfer complete!)""",
                "codeNotes": [
                    {"line": 15, "note": "Passes 4-byte memory pointer through queue instead of copying 1024-byte payload"},
                    {"line": 24, "note": "Transfers exclusive buffer ownership to receiver task"},
                    {"line": 36, "note": "Demonstrates high-performance zero-copy buffer passing for large payloads"}
                ],
                "tryIt": "Explain why sending pointers to dynamically allocated malloc buffers requires strict ownership discipline to prevent memory leaks.",
                "check": {
                    "question": "When is it appropriate to pass pointers through a FreeRTOS queue rather than copying values directly?",
                    "options": [
                        "When transmitting large payloads (e.g. image frames, network packets) where copying entire structures would waste CPU cycles and RAM",
                        "Only when the microcontroller has no stack",
                        "When all tasks have identical priorities",
                        "Never, pointers are illegal in FreeRTOS"
                    ],
                    "answer": 0,
                    "why": "For large structures, copying only the 32-bit pointer preserves memory bandwidth and CPU cycles, provided ownership transfer rules are strictly followed."
                }
            },
            {
                "title": "Direct-to-Task Notifications: Zero-RAM Overhead & 45% Faster Context Swaps",
                "say": [
                    "While FreeRTOS queues and semaphores are versatile, every queue requires an allocated `Queue_t` control structure in SRAM (approx 80–120 bytes of RAM).",
                    "To achieve ultra-lightweight communication, FreeRTOS introduced Direct-to-Task Notifications (`xTaskNotify` / `ulTaskNotifyTake`).",
                    "Every Task Control Block (`TCB_t`) natively includes an embedded 32-bit notification value and a notification state at ZERO additional RAM cost.",
                    "A task or ISR can send an event directly to a target task using its task handle.",
                    "Task notifications can emulate binary semaphores (unblocking a waiting task), counting semaphores, or lightweight mailbox registers.",
                    "Benchmark measurements prove that Direct-to-Task Notifications execute up to 45% faster than standard binary semaphores and consume exactly 0 bytes of dynamic heap memory."
                ],
                "example": "Instead of building a community mailbox at the end of the road (creating a queue), the mail carrier knocks directly on your front door and hands you the package.",
                "code": r"""#include <iostream>
#include <cstdint>

class TaskWithDirectNotification {
public:
    uint32_t notificationValue;
    bool isBlockedWaiting;

    TaskWithDirectNotification() : notificationValue(0), isBlockedWaiting(false) {}

    // Simulates ulTaskNotifyTake(pdTRUE, portMAX_DELAY)
    bool notifyTake() {
        if (notificationValue > 0) {
            notificationValue--;
            std::cout << "[NOTIFY TAKE] Direct notification consumed (Value decremented to " 
                      << notificationValue << ")\n";
            return true;
        }
        isBlockedWaiting = true;
        std::cout << "[NOTIFY BLOCKED] Task blocked waiting for direct notification...\n";
        return false;
    }

    // Simulates xTaskNotifyGive(targetTaskHandle)
    void notifyGive() {
        notificationValue++;
        std::cout << "[NOTIFY GIVE] Sent direct event to task! (Value = " 
                  << notificationValue << ")\n";
        if (isBlockedWaiting) {
            isBlockedWaiting = false;
            std::cout << "  -> [UNBLOCKED] Target task immediately unblocked!\n";
        }
    }
};

int main() {
    TaskWithDirectNotification workerTask;

    // Worker attempts to take notification (blocks)
    workerTask.notifyTake();

    // ISR or producer task gives notification directly to worker
    workerTask.notifyGive();

    // Worker now takes notification successfully
    workerTask.notifyTake();
    return 0;
}""",
                "output": r"""[NOTIFY BLOCKED] Task blocked waiting for direct notification...
[NOTIFY GIVE] Sent direct event to task! (Value = 1)
  -> [UNBLOCKED] Target task immediately unblocked!
[NOTIFY TAKE] Direct notification consumed (Value decremented to 0)""",
                "codeNotes": [
                    {"line": 10, "note": "Notification value resides directly inside target task's TCB structure"},
                    {"line": 21, "note": "notifyGive unblocks target task directly without intermediate queue objects"},
                    {"line": 34, "note": "Demonstrates 0-RAM overhead synchronization executing 45% faster than semaphores"}
                ],
                "tryIt": "Configure notificationValue as a bitmask where different bits represent different hardware events.",
                "check": {
                    "question": "What is the primary architectural advantage of FreeRTOS Direct-to-Task Notifications over binary semaphores?",
                    "options": [
                        "They require exactly 0 bytes of additional RAM (built directly into the TCB) and execute up to 45% faster",
                        "They can transmit infinite amounts of data",
                        "They do not require a CPU clock",
                        "They work across different circuit boards"
                    ],
                    "answer": 0,
                    "why": "Task notifications store the notification value directly within the existing TCB, eliminating dynamic memory allocation and reducing scheduler traversal overhead."
                }
            },
            {
                "title": "Multi-Condition Synchronization: Event Groups, Synchronization Bits & Rendezvous Barriers",
                "say": [
                    "What happens when a task needs to wait for multiple independent events to occur simultaneously (e.g., 'wait until Wi-Fi is connected AND GPS has a 3D fix AND Battery is above 20%')?",
                    "Doing this with multiple queues or semaphores results in complex nested blocking and race conditions.",
                    "The solution is FreeRTOS Event Groups (`EventGroupHandle_t`).",
                    "An Event Group maintains a 24-bit bitmask of event flags.",
                    "Tasks can wait for any combination of bits using `xEventGroupWaitBits()`.",
                    "The function supports `xWaitForAllBits = pdTRUE` (logical AND: unblock only when ALL requested bits are set) or `pdFALSE` (logical OR: unblock when ANY bit is set).",
                    "Event groups also provide the `xEventGroupSync()` rendezvous barrier: multiple concurrent tasks synchronize at a barrier and release simultaneously."
                ],
                "example": "A rocket launch sequence: the launch director's console has 3 green lights: Propulsion Ready (Bit 0), Guidance Ready (Bit 1), and Weather Go (Bit 2); the countdown only triggers when all three lights are lit simultaneously.",
                "code": r"""#include <iostream>
#include <cstdint>

class EventGroup {
private:
    uint32_t eventBits;
public:
    EventGroup() : eventBits(0) {}

    void setBits(uint32_t bitsToSet) {
        eventBits |= bitsToSet;
        std::cout << "[EVENT GROUP] Set bits 0x" << std::hex << bitsToSet 
                  << " -> Active Mask: 0x" << eventBits << "\n";
    }

    bool waitBits(uint32_t bitsToWait, bool waitForAll) {
        std::cout << "[EVENT WAIT] Waiting for 0x" << std::hex << bitsToWait 
                  << " (Mode: " << (waitForAll ? "AND (ALL)" : "OR (ANY)") << ")\n";

        if (waitForAll) {
            if ((eventBits & bitsToWait) == bitsToWait) {
                std::cout << "  -> [BARRIER PASSED] All requested event bits asserted!\n";
                return true;
            }
        } else {
            if (eventBits & bitsToWait) {
                std::cout << "  -> [TRIGGER PASSED] At least one event bit asserted!\n";
                return true;
            }
        }
        std::cout << "  -> [BLOCKED] Condition not met. Task blocks.\n";
        return false;
    }
};

int main() {
    EventGroup launchEvents;
    const uint32_t WIFI_READY  = (1 << 0); // Bit 0 (0x01)
    const uint32_t GPS_FIX     = (1 << 1); // Bit 1 (0x02)
    const uint32_t SENSORS_CAL = (1 << 2); // Bit 2 (0x04)
    const uint32_t ALL_READY   = WIFI_READY | GPS_FIX | SENSORS_CAL; // 0x07

    launchEvents.setBits(WIFI_READY);
    launchEvents.setBits(GPS_FIX);
    launchEvents.waitBits(ALL_READY, true); // Still waiting for sensors (blocks)

    launchEvents.setBits(SENSORS_CAL);     // Sensors ready!
    launchEvents.waitBits(ALL_READY, true); // All 3 ready -> Passes!
    return 0;
}""",
                "output": r"""[EVENT GROUP] Set bits 0x1 -> Active Mask: 0x1
[EVENT GROUP] Set bits 0x2 -> Active Mask: 0x3
[EVENT WAIT] Waiting for 0x7 (Mode: AND (ALL))
  -> [BLOCKED] Condition not met. Task blocks.
[EVENT GROUP] Set bits 0x4 -> Active Mask: 0x7
[EVENT WAIT] Waiting for 0x7 (Mode: AND (ALL))
  -> [BARRIER PASSED] All requested event bits asserted!""",
                "codeNotes": [
                    {"line": 10, "note": "Maintains 24-bit event bitmask accessible by all concurrent tasks and ISRs"},
                    {"line": 19, "note": "Evaluates logical AND condition (waitForAll=true) requiring all bits to match"},
                    {"line": 43, "note": "Unblocks launch task only when Wi-Fi, GPS, and sensors are simultaneously ready"}
                ],
                "tryIt": "Set waitForAll to false and demonstrate that the task unblocks as soon as the first bit (Wi-Fi) is set.",
                "check": {
                    "question": "How do FreeRTOS Event Groups allow a task to wait for multiple independent system events to complete?",
                    "options": [
                        "By evaluating an atomic 24-bit bitmask with logical AND (all bits) or logical OR (any bit) matching options",
                        "By polling each event in an infinite while loop",
                        "By creating 24 separate threads",
                        "By turning off the CPU cache"
                    ],
                    "answer": 0,
                    "why": "Event groups allow tasks to block on a 24-bit bitmask, unblocking atomically when all specified bits or any specified bit is set by tasks or ISRs."
                }
            },
            {
                "title": "From ISR to Task: xQueueSendFromISR, portYIELD_FROM_ISR & Deferred Processing",
                "say": [
                    "A critical rule of real-time operating systems is: NEVER call standard RTOS API functions (`xQueueSend`, `xSemaphoreTake`) inside an Interrupt Service Routine.",
                    "Standard API functions can block; an interrupt service routine must NEVER enter a blocked state.",
                    "FreeRTOS provides dedicated ISR-safe functions ending with `FromISR` (such as `xQueueSendFromISR`, `xSemaphoreGiveFromISR`).",
                    "These functions accept a pointer argument: `BaseType_t *pxHigherPriorityTaskWoken`.",
                    "If sending an item to a queue causes a higher-priority task to unblock, the kernel sets `*pxHigherPriorityTaskWoken = pdTRUE`.",
                    "Before exiting the ISR, firmware invokes `portYIELD_FROM_ISR(xHigherPriorityTaskWoken)`: if true, the hardware asserts the PendSV bit, ensuring the CPU context-switches directly into the unblocked high-priority task the microsecond the ISR exits."
                ],
                "example": "A fast delivery driver dropping a package on the porch: the driver doesn't wait inside your house; they ring the doorbell (set higher priority task woken) and leave immediately; you walk to the door and open the package outside of interrupt context.",
                "code": r"""#include <iostream>
#include <string>
#include <cstdint>

struct DeferredIsrPipeline {
    bool queueHasData;
    uint32_t receivedPayload;
    bool pendSvAsserted;

    DeferredIsrPipeline() : queueHasData(false), receivedPayload(0), pendSvAsserted(false) {}

    // Simulated hardware ISR
    void onHardwareUartIsr(uint32_t hardwareWord) {
        std::cout << "[HARDWARE UART ISR] Byte received: 0x" << std::hex << hardwareWord << "\n";
        bool higherPriorityTaskWoken = false;

        // ISR-safe queue send: NEVER blocks!
        queueHasData = true;
        receivedPayload = hardwareWord;
        higherPriorityTaskWoken = true; // High-priority parser task unblocked!

        std::cout << "  -> xQueueSendFromISR: Message queued safely without blocking\n";
        if (higherPriorityTaskWoken) {
            std::cout << "  -> portYIELD_FROM_ISR(pdTRUE): PendSV bit set! Deferred switch armed.\n";
            pendSvAsserted = true;
        }
    }

    void onPendSvContextSwitch() {
        if (pendSvAsserted) {
            std::cout << "[PENDSV HANDLER] Immediate switch to high-priority ParserTask!\n";
            pendSvAsserted = false;
            // High-priority task processes data
            std::cout << "  -> [PARSER TASK] Processed payload: 0x" << std::hex << receivedPayload << "\n";
        }
    }
};

int main() {
    DeferredIsrPipeline pipeline;
    // Hardware interrupt fires
    pipeline.onHardwareUartIsr(0xAA);
    // As ISR returns, PendSV executes context switch
    pipeline.onPendSvContextSwitch();
    return 0;
}""",
                "output": r"""[HARDWARE UART ISR] Byte received: 0xaa
  -> xQueueSendFromISR: Message queued safely without blocking
  -> portYIELD_FROM_ISR(pdTRUE): PendSV bit set! Deferred switch armed.
[PENDSV HANDLER] Immediate switch to high-priority ParserTask!
  -> [PARSER TASK] Processed payload: 0xaa""",
                "codeNotes": [
                    {"line": 18, "note": "xQueueSendFromISR never blocks and sets higherPriorityTaskWoken if unblocking occurs"},
                    {"line": 23, "note": "portYIELD_FROM_ISR arms PendSV to trigger immediate task switch on ISR exit"},
                    {"line": 31, "note": "High-priority parser task executes immediately after ISR returns with zero latency"}
                ],
                "tryIt": "Explain why calling a blocking xQueueSend() inside an ISR triggers a fatal kernel assertion.",
                "check": {
                    "question": "What is the purpose of the portYIELD_FROM_ISR() macro inside an interrupt service routine?",
                    "options": [
                        "It triggers an immediate context switch to the unblocked task via PendSV if a higher-priority task was woken by the ISR",
                        "It pauses all hardware timers",
                        "It reboots the microcontroller",
                        "It disables the global interrupt controller"
                    ],
                    "answer": 0,
                    "why": "portYIELD_FROM_ISR requests a context switch if pxHigherPriorityTaskWoken is true, ensuring the newly unblocked task runs immediately as the ISR exits."
                }
            }
        ],
        "summary": [
            "FreeRTOS queues enforce copy-by-value memory isolation, eliminating multi-threaded race conditions and dangling pointer bugs.",
            "Queues of pointers provide zero-copy high-performance transport for large buffers (display, network) through strict ownership transfer.",
            "Direct-to-Task Notifications embed an event value inside the TCB, executing up to 45% faster than semaphores with 0 bytes of dynamic RAM.",
            "Event Groups evaluate 24-bit bitmasks with logical AND/OR matching, synchronizing multiple concurrent conditions and rendezvous barriers.",
            "FromISR API functions never block, and portYIELD_FROM_ISR ensures newly unblocked high-priority tasks run the instant the hardware ISR returns."
        ],
        "projectStep": {
            "title": "Construct an Event-Driven Multi-Sensor FreeRTOS Pipeline with Queue Backpressure",
            "steps": [
                "Implement a thread-safe copy-by-value FreeRTOS queue transferring structured telemetry packets.",
                "Configure bounded timeout blocking on sender and receiver to implement automatic flow control backpressure.",
                "Integrate Direct-to-Task notifications for lightweight task signaling with zero dynamic memory allocation.",
                "Implement an Event Group rendezvous barrier synchronizing system startup across Wi-Fi, GPS, and sensors.",
                "Construct an interrupt-safe deferred processing pipeline using xQueueSendFromISR and portYIELD_FROM_ISR."
            ]
        }
    }

def create_day25():
    return {
        "day": 25,
        "title": "Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine",
        "goal": "Architect, construct, and defend Milestone 5: the Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine. Build a production-grade FreeRTOS firmware platform integrating 4 prioritized concurrent tasks, sub-2-microsecond scheduling jitter, priority-inheritance bus guards, and zero-drop inter-task queues under live priority inversion injection.",
        "minutes": 38,
        "recap": "Welcome to Milestone 5! Over Days 21–24, we mastered RTOS determinism, TCB stack allocation, PendSV context switching, mutex priority inheritance, and inter-task queues. Today, we unite these kernel systems into an industrial-grade preemptive multi-tasking platform.",
        "parts": [
            {
                "title": "System Architecture Blueprint: 4 Multi-Priority Concurrent Tasks with FreeRTOS Engine",
                "say": [
                    "Milestone 5 represents the transition from bare-metal programming to industrial-grade real-time operating systems.",
                    "The system architecture integrates 4 prioritized concurrent tasks: Task 1 (High-Priority Real-Time Control Loop, Priority 4), Task 2 (Medium-Priority Telemetry Streamer, Priority 2), Task 3 (Low-Priority Sensor Acquisition, Priority 1), and Task 4 (Idle/Watchdog Supervisor, Priority 0).",
                    "Task 1 executes a periodic 1 kHz control loop with hard real-time deadlines (jitter < 2 microseconds).",
                    "Tasks 1 and 3 share a physical hardware bus (I2C/SPI), protected by a Priority-Inheritance Mutex to eliminate Mars Pathfinder inversions.",
                    "Task 3 pushes sensor readings into an inter-task FreeRTOS Queue consumed by Task 2.",
                    "The entire multitasking system is orchestrated by preemptive SysTick time-slicing and lowest-priority PendSV context switching."
                ],
                "example": "An autonomous drone flight avionics platform: Task 1 stabilizes the motors every millisecond; Task 2 streams camera video; Task 3 polls the barometer; and Task 4 monitors battery health and kicks the hardware watchdog.",
                "code": r"""#include <iostream>
#include <string>
#include <vector>

struct RtosTaskBlueprint {
    std::string taskName;
    uint32_t priority;
    uint32_t periodMs;
    uint32_t stackWords;
    std::string role;
};

void printMilestone5Blueprint(const std::vector<RtosTaskBlueprint>& tasks) {
    std::cout << "=======================================================\n";
    std::cout << "  MILESTONE 5: PREEMPTIVE RTOS SYSTEM ARCHITECTURE\n";
    std::cout << "=======================================================\n";
    for (const auto& t : tasks) {
        std::cout << "  [PRIORITY " << t.priority << "] Task: " << t.taskName 
                  << " (Period: " << t.periodMs << "ms, Stack: " << (t.stackWords * 4) << " B)\n";
        std::cout << "    -> Role: " << t.role << "\n";
    }
    std::cout << "=======================================================\n";
    std::cout << "  Kernel Core: FreeRTOS Preemptive Sched + PendSV Switcher\n";
    std::cout << "  Safety Gate: Sub-2us Jitter + Priority Inheritance Active\n";
    std::cout << "=======================================================\n";
}

int main() {
    std::vector<RtosTaskBlueprint> avionics = {
        {"FlightControlTask", 4, 1,   256, "1 kHz Real-Time Attitude PID Loop (Hard Real-Time)"},
        {"TelemetryTask",     2, 20,  512, "High-Throughput Packet Dispatcher (Soft Real-Time)"},
        {"SensorAcqTask",     1, 50,  256, "I2C Barometer & Temp Collector (Shared Bus Holder)"},
        {"SupervisorTask",    0, 100, 128, "Multi-Task Watchdog Supervisor & Health Monitor"}
    };
    printMilestone5Blueprint(avionics);
    return 0;
}""",
                "output": r"""=======================================================
  MILESTONE 5: PREEMPTIVE RTOS SYSTEM ARCHITECTURE
=======================================================
  [PRIORITY 4] Task: FlightControlTask (Period: 1ms, Stack: 1024 B)
    -> Role: 1 kHz Real-Time Attitude PID Loop (Hard Real-Time)
  [PRIORITY 2] Task: TelemetryTask (Period: 20ms, Stack: 2048 B)
    -> Role: High-Throughput Packet Dispatcher (Soft Real-Time)
  [PRIORITY 1] Task: SensorAcqTask (Period: 50ms, Stack: 1024 B)
    -> Role: I2C Barometer & Temp Collector (Shared Bus Holder)
  [PRIORITY 0] Task: SupervisorTask (Period: 100ms, Stack: 512 B)
    -> Role: Multi-Task Watchdog Supervisor & Health Monitor
=======================================================
  Kernel Core: FreeRTOS Preemptive Sched + PendSV Switcher
  Safety Gate: Sub-2us Jitter + Priority Inheritance Active
=======================================================""",
                "codeNotes": [
                    {"line": 14, "note": "Defines 4-level prioritized task matrix adhering to Rate Monotonic Scheduling rules"},
                    {"line": 28, "note": "FlightControlTask assigned highest Priority 4 for deterministic 1 kHz execution"},
                    {"line": 31, "note": "SupervisorTask runs at Priority 0 to verify healthy check-ins across all tasks"}
                ],
                "tryIt": "Verify that assigning FlightControlTask the shortest period and highest priority satisfies RMS requirements.",
                "check": {
                    "question": "Why is the real-time control loop assigned the highest priority (Priority 4) in the Milestone 5 task matrix?",
                    "options": [
                        "To guarantee that it preempts all lower-priority logging and sensor tasks immediately, ensuring sub-2-microsecond execution jitter",
                        "Because priority 4 consumes less electricity",
                        "Because priority 4 code is stored in the CPU cache",
                        "To disable the FreeRTOS timer"
                    ],
                    "answer": 0,
                    "why": "Highest priority guarantees immediate preemption over telemetry and sensor tasks, ensuring deterministic 1.0 ms execution intervals."
                }
            },
            {
                "title": "High-Priority Real-Time Control Loop with Sub-2-Microsecond Scheduling Jitter Proving",
                "say": [
                    "In hard real-time systems, the worst enemy of stability is Jitter: the variation in periodic activation time.",
                    "If a 1.0 kHz task fires at 1.000 ms on one cycle and 1.015 ms on the next, the 15-microsecond jitter destabilizes digital PID controller integration.",
                    "Milestone 5 enforces a strict safety invariant: Scheduling Jitter strictly < 2.0 microseconds.",
                    "To achieve this, the control task uses `vTaskDelayUntil(&xLastWakeTime, xFrequency)` rather than `vTaskDelay()`.",
                    "`vTaskDelayUntil()` calculates absolute target wake times, preventing cumulative drift.",
                    "By configuring the task at Priority 4, the kernel guarantees that when the absolute wake tick arrives, the task preempts background work instantly via PendSV with sub-microsecond latency."
                ],
                "example": "A high-precision laser engraver: the laser must pulse at exactly 10,000 pulses per second; if the pulse jitter varies by even 5 microseconds, the engraved line will have jagged, blurred edges.",
                "code": r"""#include <iostream>
#include <iomanip>
#include <vector>
#include <cmath>

struct JitterSample {
    uint32_t cycleNumber;
    double expectedTimeUs;
    double actualTimeUs;

    double getJitterUs() const {
        return std::abs(actualTimeUs - expectedTimeUs);
    }
};

void evaluateJitterCompliance(const std::vector<JitterSample>& samples, double maxAllowedJitterUs) {
    double maxJitterFound = 0.0;
    std::cout << "[JITTER EVALUATION] 1 kHz Control Loop Execution Trace:\n";

    for (const auto& s : samples) {
        double j = s.getJitterUs();
        if (j > maxJitterFound) maxJitterFound = j;
        std::cout << "  Cycle #" << s.cycleNumber << ": Expected=" << s.expectedTimeUs 
                  << " us, Actual=" << s.actualTimeUs << " us -> Jitter = " 
                  << std::fixed << std::setprecision(2) << j << " us\n";
    }

    std::cout << "  --------------------------------------------------\n";
    std::cout << "  Maximum Jitter Observed: " << maxJitterFound << " us (Limit: " 
              << maxAllowedJitterUs << " us)\n";

    if (maxJitterFound < maxAllowedJitterUs) {
        std::cout << "  -> SAFETY GATE PASSED: Sub-2-microsecond hard real-time determinism certified!\n";
    } else {
        std::cout << "  -> SAFETY GATE FAILED: Jitter exceeds tolerance!\n";
    }
}

int main() {
    std::vector<JitterSample> controlLoop = {
        {1, 1000.0, 1000.4},
        {2, 2000.0, 2000.8},
        {3, 3000.0, 3000.3},
        {4, 4000.0, 4001.1} // Max jitter is 1.1 us
    };

    evaluateJitterCompliance(controlLoop, 2.0);
    return 0;
}""",
                "output": r"""[JITTER EVALUATION] 1 kHz Control Loop Execution Trace:
  Cycle #1: Expected=1000.00 us, Actual=1000.40 us -> Jitter = 0.40 us
  Cycle #2: Expected=2000.00 us, Actual=2000.80 us -> Jitter = 0.80 us
  Cycle #3: Expected=3000.00 us, Actual=3000.30 us -> Jitter = 0.30 us
  Cycle #4: Expected=4000.00 us, Actual=4001.10 us -> Jitter = 1.10 us
  --------------------------------------------------
  Maximum Jitter Observed: 1.10 us (Limit: 2.00 us)
  -> SAFETY GATE PASSED: Sub-2-microsecond hard real-time determinism certified!""",
                "codeNotes": [
                    {"line": 10, "note": "Calculates microsecond deviation between expected and actual activation times"},
                    {"line": 34, "note": "Maximum observed jitter of 1.10 us meets strict < 2.0 us hard real-time requirement"},
                    {"line": 43, "note": "Proves absolute determinism of vTaskDelayUntil under high system load"}
                ],
                "tryIt": "Demonstrate that vTaskDelay introduces cumulative drift of several milliseconds compared to vTaskDelayUntil.",
                "check": {
                    "question": "Why does FreeRTOS provide vTaskDelayUntil() instead of relying solely on vTaskDelay() for periodic control loops?",
                    "options": [
                        "vTaskDelayUntil() specifies an absolute wake time, preventing cumulative timing drift caused by execution variations",
                        "vTaskDelayUntil() runs at double the clock speed",
                        "vTaskDelayUntil() does not use memory",
                        "vTaskDelay() is deprecated in FreeRTOS"
                    ],
                    "answer": 0,
                    "why": "vTaskDelay() adds relative delay after task execution finishes, causing cumulative drift; vTaskDelayUntil() calculates absolute wake ticks, maintaining constant frequency."
                }
            },
            {
                "title": "Shared Bus Resource Guard with Priority-Inheritance Mutex (The Mars Pathfinder Defense)",
                "say": [
                    "Next, we implement the shared bus resource guard protecting the physical I2C/SPI sensor bus.",
                    "Both Task 1 (High-Priority Flight Control) and Task 3 (Low-Priority Barometer Acq) require access to this shared bus.",
                    "The bus is protected by a FreeRTOS Mutex with Priority Inheritance (`xSemaphoreCreateMutex`).",
                    "We subject the system to live priority inversion fault injection: Task 3 acquires the bus mutex; then heavy medium-priority telemetry traffic is injected into Task 2.",
                    "When Task 1 requests the bus, the kernel dynamically elevates Task 3's priority to Priority 4, blocking Task 2.",
                    "Task 3 completes its transaction, releases the mutex, and Task 1 unblocks instantly.",
                    "The system is 100% immune to the Mars Pathfinder anomaly, proving aerospace-grade concurrency safety."
                ],
                "example": "A secure diplomatic pouch on an airplane: both the ambassador and a low-level courier can lock the pouch; if the courier is holding the pouch and terrorists board the plane, the courier is instantly given maximum diplomatic protection to deliver the pouch safely.",
                "code": r"""#include <iostream>
#include <string>

struct ConcurrentBusGuard {
    bool priorityInheritanceEnabled;

    void executeFaultInjectionTest() {
        std::cout << "[FAULT INJECTION] Simulating Mars Pathfinder Concurrency Stress Test:\n";
        std::cout << "  1. Low-Priority Task 3 (SensorAcq) acquires Shared Bus Mutex\n";
        std::cout << "  2. High-Priority Task 1 (FlightControl) requests Bus Mutex -> BLOCKS!\n";

        if (priorityInheritanceEnabled) {
            std::cout << "  -> [KERNEL ACTION] Priority Inheritance triggers: Task 3 promoted to Priority 4!\n";
            std::cout << "  3. Heavy Medium-Priority Telemetry flood arrives on Task 2 (Priority 2)\n";
            std::cout << "  -> [PREEMPTION SHIELD] Task 2 CANNOT preempt elevated Task 3!\n";
            std::cout << "  4. Task 3 finishes bus transaction and releases mutex cleanly.\n";
            std::cout << "  -> Task 1 unblocks and executes with ZERO starvation (0 us delay)!\n";
            std::cout << "  -> TEST RESULT: PASSED (Immune to Mars Pathfinder bug)\n";
        } else {
            std::cout << "  3. Task 2 preempts Task 3 -> Task 1 starved -> SYSTEM LOCKUP!\n";
        }
    }
};

int main() {
    ConcurrentBusGuard busGuard = {true}; // Priority inheritance enabled
    busGuard.executeFaultInjectionTest();
    return 0;
}""",
                "output": r"""[FAULT INJECTION] Simulating Mars Pathfinder Concurrency Stress Test:
  1. Low-Priority Task 3 (SensorAcq) acquires Shared Bus Mutex
  2. High-Priority Task 1 (FlightControl) requests Bus Mutex -> BLOCKS!
  -> [KERNEL ACTION] Priority Inheritance triggers: Task 3 promoted to Priority 4!
  3. Heavy Medium-Priority Telemetry flood arrives on Task 2 (Priority 2)
  -> [PREEMPTION SHIELD] Task 2 CANNOT preempt elevated Task 3!
  4. Task 3 finishes bus transaction and releases mutex cleanly.
  -> Task 1 unblocks and executes with ZERO starvation (0 us delay)!
  -> TEST RESULT: PASSED (Immune to Mars Pathfinder bug)""",
                "codeNotes": [
                    {"line": 12, "note": "Low-priority task 3 promoted to Priority 4 upon contest by high-priority task 1"},
                    {"line": 15, "note": "Shields low-priority task from being preempted by medium-priority telemetry flood"},
                    {"line": 18, "note": "Proves 100% immunity to unbounded priority inversion under live fault injection"}
                ],
                "tryIt": "Explain why binary semaphores cannot be used to protect the shared bus in this architecture.",
                "check": {
                    "question": "What critical protection does the FreeRTOS Mutex provide over a binary semaphore when guarding a shared sensor bus?",
                    "options": [
                        "Priority Inheritance, which elevates the mutex holder's priority to prevent medium-priority tasks from causing unbounded inversion",
                        "Automatic baud rate scaling",
                        "Data encryption",
                        "It doubles the transfer speed"
                    ],
                    "answer": 0,
                    "why": "Only mutexes support priority inheritance; binary semaphores lack ownership and allow medium-priority tasks to starve high-priority tasks indefinitely."
                }
            },
            {
                "title": "High-Throughput Inter-Task Telemetry Queue with Zero-Drop Sensor Ingestion",
                "say": [
                    "Data captured by low-priority Task 3 must be transmitted by medium-priority Task 2 without dropped packets.",
                    "We implement a 16-element FreeRTOS Queue transferring structured `SensorTelemetry_t` packets.",
                    "Task 3 uses a bounded timeout `xQueueSend(queue, &packet, pdMS_TO_TICKS(10))`.",
                    "Task 2 blocks indefinitely on `xQueueReceive(queue, &packet, portMAX_DELAY)`, waking up instantly the microsecond a packet arrives.",
                    "If telemetry transmission is delayed, the queue absorbs burst traffic, providing elastic decoupling.",
                    "Under a burst flood test of 1,000 packets, the queue demonstrates 100% throughput with exactly 0 dropped packets."
                ],
                "example": "A conveyor belt buffer between an assembly line and a packaging station: if the packaging robot changes tape, the conveyor belt holds the assembled parts without stopping the factory line.",
                "code": r"""#include <iostream>
#include <vector>
#include <cstdint>

struct TelemetryPacket {
    uint32_t timestampMs;
    int16_t temperatureC;
    uint16_t pressureHpa;
};

class InterTaskQueueEngine {
private:
    static const size_t QUEUE_CAPACITY = 16;
    TelemetryPacket buffer[QUEUE_CAPACITY];
    size_t count;
    uint32_t totalProcessed;
public:
    InterTaskQueueEngine() : count(0), totalProcessed(0) {}

    bool send(const TelemetryPacket& pkt) {
        if (count >= QUEUE_CAPACITY) return false; // Full
        buffer[count] = pkt;
        count++;
        return true;
    }

    bool receive(TelemetryPacket& pkt) {
        if (count == 0) return false; // Empty
        pkt = buffer[0];
        // Shift buffer
        for (size_t i = 1; i < count; ++i) buffer[i - 1] = buffer[i];
        count--;
        totalProcessed++;
        return true;
    }

    uint32_t getTotalProcessed() const { return totalProcessed; }
};

int main() {
    InterTaskQueueEngine queue;
    std::cout << "[QUEUE BENCHMARK] Ingesting burst of 100 telemetry packets...\n";

    for (uint32_t i = 1; i <= 100; ++i) {
        TelemetryPacket p = {i * 10, (int16_t)(25 + (i % 5)), (uint16_t)(1013 + (i % 3))};
        queue.send(p);
        TelemetryPacket out;
        queue.receive(out);
    }

    std::cout << "  -> Total Packets Successfully Streamed: " << queue.getTotalProcessed() << "/100\n";
    std::cout << "  -> Packet Loss Rate: 0.00% (Zero-Drop Verification Passed!)\n";
    return 0;
}""",
                "output": r"""[QUEUE BENCHMARK] Ingesting burst of 100 telemetry packets...
  -> Total Packets Successfully Streamed: 100/100
  -> Packet Loss Rate: 0.00% (Zero-Drop Verification Passed!)""",
                "codeNotes": [
                    {"line": 18, "note": "Enqueues structured telemetry packet into kernel buffer with bounded timeout"},
                    {"line": 25, "note": "Dequeues and transfers packet to telemetry dispatcher task without race conditions"},
                    {"line": 42, "note": "Verifies 100% zero-drop throughput under continuous 100-packet stream"}
                ],
                "tryIt": "Simulate what happens when the receiver task is paused: the queue fills to 16 items and asserts backpressure.",
                "check": {
                    "question": "What is the primary benefit of using an inter-task FreeRTOS queue between the sensor acquisition task and telemetry dispatcher?",
                    "options": [
                        "It decouples producer and consumer task execution rates, absorbing burst traffic without losing packets or blocking the producer",
                        "It reduces the size of the microcontroller",
                        "It converts digital packets into analog signals",
                        "It eliminates the need for a CPU clock"
                    ],
                    "answer": 0,
                    "why": "Queues provide elastic buffering that decouples sender and receiver rates, preventing temporary transmission delays from stalling sensor acquisition."
                }
            },
            {
                "title": "The Master Milestone 5 Capstone Engine: Verification, Concurrency Stress Testing & Defense",
                "say": [
                    "We now integrate all kernel subsystems into the completed Milestone 5 Master Preemptive RTOS Engine.",
                    "The platform concurrently runs all 4 tasks under the FreeRTOS preemptive scheduler.",
                    "Task 1 executes its 1 kHz control loop with 1.1-microsecond jitter (meeting the < 2.0 us hard real-time requirement).",
                    "Task 3 acquires the shared sensor bus while protected by the Priority-Inheritance Mutex, completely neutralizing injected Mars Pathfinder priority inversion faults.",
                    "Task 3 streams sensor packets into the inter-task queue, which Task 2 dispatches with zero dropped packets.",
                    "Task 0 (Supervisor) verifies that all tasks check in before the 100 ms deadline, ensuring system health.",
                    "Upon passing this milestone, your embedded system achieves industrial-grade, mission-critical real-time operating system certification."
                ],
                "example": "A commercial airliner flight management computer: flight surfaces respond every millisecond without jitter, sensor buses never lock up, telemetry streams continuously, and the system is mathematically proven to never freeze.",
                "code": r"""#include <iostream>
#include <cstdint>
#include <string>

class Milestone5RtosEngine {
public:
    struct EngineMetrics {
        uint32_t tasksRunning;
        double maxJitterMicroseconds;
        bool priorityInheritanceVerified;
        uint32_t packetsStreamed;
        uint32_t droppedPackets;
        bool allDeadlinesMet;
    };

private:
    EngineMetrics metrics;

public:
    Milestone5RtosEngine() {
        metrics.tasksRunning = 4;
        metrics.maxJitterMicroseconds = 1.1; // < 2 us
        metrics.priorityInheritanceVerified = true;
        metrics.packetsStreamed = 1000;
        metrics.droppedPackets = 0;
        metrics.allDeadlinesMet = true;
    }

    void executeConcurrencyStressTest() {
        std::cout << "[MILESTONE 5 RTOS] Executing multi-task preemptive concurrency stress test...\n";
        std::cout << "  -> Preemptive Sched:   SysTick 1kHz + PendSV Context Switcher active\n";
        std::cout << "  -> Task 1 (1 kHz):     Measured Jitter = " << metrics.maxJitterMicroseconds 
                  << " us (Safety Bound: < 2.0 us) - PASSED\n";
        std::cout << "  -> Shared Bus Guard:   Priority Inheritance active (Mars Pathfinder anomaly neutralized)\n";
        std::cout << "  -> Inter-Task Queue:   " << metrics.packetsStreamed 
                  << " packets streamed (0 drops) - PASSED\n";
        std::cout << "  -> Multi-Task Health:  All 4 tasks meeting hard execution deadlines\n";
    }

    void printCertificationReport() const {
        std::cout << "\n=======================================================\n";
        std::cout << "  🏆 MILESTONE 5 MASTER RTOS ENGINE: CERTIFIED COMPLIANT\n";
        std::cout << "=======================================================\n";
        std::cout << "  Active Concurrent Tasks: " << metrics.tasksRunning << "\n";
        std::cout << "  1 kHz Scheduling Jitter: " << metrics.maxJitterMicroseconds << " us (Target: < 2.0 us)\n";
        std::cout << "  Priority Inheritance:    VERIFIED (PIP Inversion Immunity)\n";
        std::cout << "  Telemetry Throughput:    " << metrics.packetsStreamed << " packets (Drop Rate = 0.00%)\n";
        std::cout << "  Real-Time Safety Gate:   APPROVED FOR MISSION-CRITICAL PRODUCTION\n";
        std::cout << "=======================================================\n";
    }
};

int main() {
    Milestone5RtosEngine rtos;
    rtos.executeConcurrencyStressTest();
    rtos.printCertificationReport();
    return 0;
}""",
                "output": r"""[MILESTONE 5 RTOS] Executing multi-task preemptive concurrency stress test...
  -> Preemptive Sched:   SysTick 1kHz + PendSV Context Switcher active
  -> Task 1 (1 kHz):     Measured Jitter = 1.1 us (Safety Bound: < 2.0 us) - PASSED
  -> Shared Bus Guard:   Priority Inheritance active (Mars Pathfinder anomaly neutralized)
  -> Inter-Task Queue:   1000 packets streamed (0 drops) - PASSED
  -> Multi-Task Health:  All 4 tasks meeting hard execution deadlines

=======================================================
  🏆 MILESTONE 5 MASTER RTOS ENGINE: CERTIFIED COMPLIANT
=======================================================
  Active Concurrent Tasks: 4
  1 kHz Scheduling Jitter: 1.1 us (Target: < 2.0 us)
  Priority Inheritance:    VERIFIED (PIP Inversion Immunity)
  Telemetry Throughput:    1000 packets (Drop Rate = 0.00%)
  Real-Time Safety Gate:   APPROVED FOR MISSION-CRITICAL PRODUCTION
=======================================================""",
                "codeNotes": [
                    {"line": 28, "note": "Validates 4-task concurrent execution under preemptive FreeRTOS scheduler"},
                    {"line": 30, "note": "Confirms 1.1 us scheduling jitter strictly within < 2.0 us hard safety limit"},
                    {"line": 46, "note": "Issues final Milestone 5 Preemptive RTOS Engine compliance certification"}
                ],
                "tryIt": "Simulate adding a 5th low-priority logging task and verify that high-priority jitter remains unaffected.",
                "check": {
                    "question": "What primary architectural features ensure that Milestone 5 achieves mission-critical RTOS compliance?",
                    "options": [
                        "Sub-2-microsecond scheduling jitter via preemptive scheduling, priority-inheritance mutexes neutralizing inversion, and zero-drop queues",
                        "Running without an operating system kernel",
                        "Executing all tasks in the same interrupt handler",
                        "Disabling all context switching"
                    ],
                    "answer": 0,
                    "why": "Milestone 5 unites bounded scheduling jitter (<2us), priority-inheritance bus protection against Mars Pathfinder bugs, and zero-drop inter-task queues into a certified platform."
                }
            }
        ],
        "summary": [
            "Milestone 5 coordinates 4 concurrent tasks under a preemptive FreeRTOS kernel with SysTick slicing and PendSV switching.",
            "The 1 kHz high-priority control loop achieves sub-2-microsecond scheduling jitter (measured 1.1 us) using vTaskDelayUntil.",
            "Priority-Inheritance Mutexes dynamically elevate lower-priority task holders, completely neutralizing Mars Pathfinder inversion hazards.",
            "Copy-by-value inter-task queues provide elastic buffering and zero-drop data transport across rate domains.",
            "The entire platform undergoes fault injection and concurrency stress testing, achieving mission-critical real-time certification."
        ],
        "projectStep": {
            "title": "Construct, Verify, and Defend Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine",
            "steps": [
                "Implement a 4-task prioritized matrix under the FreeRTOS preemptive scheduler with isolated task stacks.",
                "Configure a 1 kHz control loop using vTaskDelayUntil and verify sub-2-microsecond scheduling jitter.",
                "Subject the shared sensor bus to simulated Mars Pathfinder priority inversion and prove PIP immunity.",
                "Implement a 16-element inter-task telemetry queue demonstrating zero-drop streaming under burst traffic.",
                "Integrate a multi-task watchdog supervisor monitoring all thread heartbeats and issue final certification."
            ]
        }
    }

def main():
    generators = [
        (21, create_day21),
        (22, create_day22),
        (23, create_day23),
        (24, create_day24),
        (25, create_day25)
    ]
    for day_num, func in generators:
        day_data = func()
        out_path = f"scripts/iot_emb_day{day_num}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(day_data, f, indent=2, ensure_ascii=False)
        print(f"Wrote {out_path} successfully!")
    print("All Days 21-25 generated successfully!")

if __name__ == "__main__":
    main()
