#!/usr/bin/env python3
"""
generate_iot_sec_day13.py
Course 19 (iot_sec) Month 1 Block 3 Day 13:
Memory Protection Units (MPU): Stack Overflow Guarding & Unprivileged User Mode Isolation
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

# --- PART 1 ---
p1_code = """# ARMv8-M PMSAv8 MPU Region Configuration Simulator
class PMSAv8MPURegion:
    def __init__(self, rnr, base_addr, limit_addr, access_perm, is_executable=False):
        self.rnr = rnr
        self.base_addr = base_addr & ~0x1F   # 32-byte aligned base
        self.limit_addr = limit_addr | 0x1F  # 32-byte aligned limit
        self.access_perm = access_perm       # 'RO', 'RW', 'NO_ACCESS', 'PRIV_RW'
        self.is_executable = is_executable

    def check_access(self, addr: int, is_write: bool, is_fetch: bool, is_privileged: bool) -> bool:
        if not (self.base_addr <= addr <= self.limit_addr):
            return False
        if is_fetch and not self.is_executable:
            return False  # Execute-Never (XN) violation
        if is_write:
            if self.access_perm == 'NO_ACCESS':
                return False
            if self.access_perm == 'RO':
                return False
            if self.access_perm == 'PRIV_RW' and not is_privileged:
                return False
        return True

mpu_flash = PMSAv8MPURegion(rnr=0, base_addr=0x00022000, limit_addr=0x0007FFFF, access_perm='RO', is_executable=True)
mpu_sram  = PMSAv8MPURegion(rnr=1, base_addr=0x20000000, limit_addr=0x2001FFFF, access_perm='RW', is_executable=False)

print("=== ARMv8-M PMSAv8 MPU Region Audit ===")
print("Flash Executable Fetch (0x00025000):", mpu_flash.check_access(0x00025000, is_write=False, is_fetch=True, is_privileged=False))
print("Flash Write Attempt (0x00025000):   ", mpu_flash.check_access(0x00025000, is_write=True, is_fetch=False, is_privileged=False))
print("SRAM Code Execution (0x20004000):   ", mpu_sram.check_access(0x20004000, is_write=False, is_fetch=True, is_privileged=False))
print("MPU Invariant: PMSAv8 enforces 32-byte limit boundaries and Execute-Never (XN) on SRAM.")
"""
p1_out = run_code(p1_code)

p1_say = [
    "While ARM TrustZone establishes coarse macro-level isolation between the Secure World and Non-Secure World, it does not prevent software tasks within the same domain from corrupting each other. If an untrusted third-party IoT networking stack running in the Non-Secure World suffers a buffer overflow, it could overwrite adjacent RTOS kernel data, corrupt thread stacks, or execute injected shellcode from SRAM. To enforce fine-grained memory boundaries inside each security world, ARM processors incorporate the Memory Protection Unit (MPU).",
    "On modern ARMv8-M microcontrollers (such as Cortex-M23, Cortex-M33, and Cortex-M55), the MPU implements the Protected Memory System Architecture version 8 (PMSAv8). PMSAv8 represents a revolutionary improvement over the legacy PMSAv7 architecture found on Cortex-M3 and Cortex-M4 chips. In PMSAv7, region sizes were strictly constrained to powers of two (e.g., 256B, 512B, 1KB, 2KB), and base addresses were required to be aligned to the region size itself. Partitioning arbitrary memory layouts under PMSAv7 was notoriously painful, frequently forcing developers to allocate oversized dummy buffers or disable sub-regions to fit memory maps.",
    "PMSAv8 completely eliminates the power-of-two restriction. In PMSAv8, each region is defined simply by a Base Address Register (MPU_RBAR) and a Limit Address Register (MPU_RLAR). Base and limit addresses are aligned to 32-byte boundaries, allowing firmware developers to wrap MPU regions snugly around arbitrary linker sections, such as a 22.4 KB application code block or a 1,536-byte RTOS thread stack, with zero wasted padding bytes.",
    "Furthermore, on TrustZone-enabled Cortex-M devices, the processor features two distinct, independent MPU peripherals: the Secure MPU (MPU_S) and the Non-Secure MPU (MPU_NS). Each MPU typically provides up to 16 programmable regions. Secure firmware configures MPU_S to enforce strict isolation between internal crypto services and root-of-trust drivers, while Non-Secure OS kernels configure MPU_NS to sandbox individual user tasks, file systems, and network communication daemons.",
    "A fundamental security capability of the PMSAv8 MPU is the enforcement of the Execute-Never (XN) attribute. By clearing the executable flag in MPU_RBAR, firmware designates entire memory ranges—especially SRAM and peripheral register banks—as non-executable. If a cyber-attacker exploits a stack buffer overflow and attempts to redirect the Program Counter into SRAM where shellcode has been staged, the MPU hardware immediately intercepts the instruction fetch and triggers an Instruction Access Violation (IACCVIOL) MemManage exception before a single instruction can execute.",
    "This hardware-level W^X (Write XOR Execute) policy neutralizes classic code-injection exploits at zero runtime performance cost, providing deterministic protection against malicious payload staging in volatile embedded memory."
]

# --- PART 2 ---
p2_code = """# Privileged Handler Mode vs Unprivileged Thread Mode (CONTROL.nPRIV) Simulator
class CPUExecutionPrivilegeLevel:
    def __init__(self):
        self.mode = "THREAD"       # "THREAD" or "HANDLER"
        self.npriv = 0             # 0 = Privileged, 1 = Unprivileged
        self.privileged_peripherals = (0x40000000, 0x4000FFFF)

    def is_privileged(self) -> bool:
        # Handler mode (ISRs) is ALWAYS privileged regardless of nPRIV
        if self.mode == "HANDLER":
            return True
        return self.npriv == 0

    def access_system_control_block(self) -> dict:
        if not self.is_privileged():
            return {
                "access": "DENIED",
                "fault": "BUS_FAULT_UNPRIVILEGED_SCB_WRITE",
                "trap": "MemManage_Exception"
            }
        return {"access": "GRANTED", "fault": "NONE", "trap": "NONE"}

cpu = CPUExecutionPrivilegeLevel()
# Thread mode drops privileges to run unprivileged user task
cpu.npriv = 1
user_scb = cpu.access_system_control_block()

# Interrupt occurs, CPU enters Handler mode (automatically privileged)
cpu.mode = "HANDLER"
isr_scb = cpu.access_system_control_block()

print("=== CPU Privilege Level Enforcement ===")
print(f"User Thread SCB Access (nPRIV=1): {user_scb['access']} ({user_scb['trap']})")
print(f"Handler ISR SCB Access:           {isr_scb['access']} ({isr_scb['trap']})")
print("Privilege Invariant: Unprivileged user threads are blocked from reconfiguring system control blocks.")
"""
p2_out = run_code(p2_code)

p2_say = [
    "An MPU is useless if untrusted application code can simply write to MPU configuration registers and disable its own constraints. To prevent unauthorized reconfiguration, ARM architecture bifurcates execution into two distinct privilege levels: Privileged Level and Unprivileged Level, operating across two processor execution modes: Handler Mode and Thread Mode.",
    "When an ARM Cortex-M processor boots from reset, it begins execution in Privileged Thread Mode. In Privileged mode, software has unrestricted access to the entire memory space, all peripheral registers, and core system configuration registers located in the System Control Block (SCB), including the MPU registers (`MPU_CTRL`, `MPU_RBAR`, `MPU_RLAR`) and NVIC interrupt controllers. All interrupt and exception handlers execute in Handler Mode, which is hardware-hardwired to always be Privileged.",
    "To isolate untrusted applications, an RTOS kernel switches the CPU into Unprivileged Thread Mode prior to transferring control to user tasks. This transition is achieved by manipulating the `CONTROL` register: setting the `nPRIV` bit (bit 0) to 1. In Unprivileged mode, the processor hardware enforces strict security prohibitions: direct writes to the System Control Block, NVIC registers, SysTick registers, and MPU registers are forbidden. Any attempt by unprivileged code to write to these registers triggers a hardware Fault.",
    "Crucially, the privilege transition is asymmetric and strictly one-way in software. Once running with `CONTROL.nPRIV = 1`, unprivileged code cannot simply clear the bit by executing `MSR CONTROL, R0`. The processor hardware ignores attempts by unprivileged code to clear `nPRIV`. The only mechanism by which an unprivileged user thread can regain privileged execution is by triggering an exception—specifically by executing a Supervisor Call instruction (`SVC`).",
    "When an application executes `SVC #imm`, the processor hardware saves context and traps into the privileged SVC Handler in Handler Mode. The operating system kernel validates the syscall parameters, verifies memory buffers against MPU policies, performs the requested privileged action (such as sending a network packet or reading a hardware sensor), and returns execution to Unprivileged Thread Mode.",
    "By confining untrusted application code, device drivers, and third-party libraries to Unprivileged Thread Mode, embedded firmware establishes a defensible security architecture. Application bugs or vulnerabilities cannot corrupt core kernel state, disable watchdog timers, or tamper with memory isolation parameters."
]

# --- PART 3 ---
p3_code = """# Stack Overflow Guard Region & MemManage Exception Simulator
class RTOSThreadStackGuard:
    def __init__(self, thread_name: str, stack_bottom: int, stack_top: int, guard_size=32):
        self.thread_name = thread_name
        self.stack_top = stack_top          # High address (stack grows downwards)
        self.stack_bottom = stack_bottom    # Low address limit
        self.guard_size = guard_size
        self.guard_limit = stack_bottom + guard_size  # Unmapped guard page: [stack_bottom, guard_limit]
        self.current_sp = stack_top

    def push_stack(self, words: int) -> dict:
        bytes_to_push = words * 4
        projected_sp = self.current_sp - bytes_to_push
        
        # Check if projected SP hits or breaches the guard region
        if projected_sp < self.guard_limit:
            return {
                "status": "STACK_OVERFLOW_DETECTED",
                "sp": hex(projected_sp),
                "fault": "MemManage_DACCVIOL_GUARD_REGION_HIT",
                "action": "HALT_CORRUPTED_THREAD_ISOLATION"
            }
        
        self.current_sp = projected_sp
        return {"status": "STACK_ALLOCATED_SUCCESS", "sp": hex(self.current_sp), "fault": "NONE"}

guard = RTOSThreadStackGuard("SensorTask", stack_bottom=0x20001000, stack_top=0x20002000, guard_size=32)
push1 = guard.push_stack(100)   # 400 bytes, safe
push2 = guard.push_stack(950)   # 3800 bytes, breaches guard region

print("=== MPU Stack Overflow Guard Region Audit ===")
print(f"Safe Stack Push:       Status -> {push1['status']} (SP: {push1['sp']})")
print(f"Overflow Attack Push:  Status -> {push2['status']} (Fault: {push2['fault']})")
print("Stack Guard Invariant: Unmapped guard pages trigger hardware MemManage before stack can corrupt neighbor SRAM.")
"""
p3_out = run_code(p3_code)

p3_say = [
    "In embedded C and C++ software, the thread stack represents one of the most volatile and dangerous attack surfaces. On ARM architectures, the stack grows downwards in memory (from higher memory addresses toward lower memory addresses). When a function is called, the CPU allocates a new stack frame, pushing local variables, saved registers, and return addresses down into SRAM. If a deeply nested recursive function runs out of control, or if a local buffer is written beyond its boundary, the stack pointer descends below its allocated limit.",
    "In an unprotected embedded system, a stack overflow silently writes over whatever data lies immediately below the stack in SRAM. Typically, adjacent memory contains critical operating system structures: neighbor thread control blocks (TCBs), task stacks, heap memory, or global function pointers. By overflowing the stack, an attacker can overwrite a neighbor thread's saved Program Counter or elevate privileges, leading to complete remote code execution.",
    "Traditional RTOS kernels attempted to detect stack overflows in software using Stack Watermarking. During task creation, the RTOS fills the stack memory with a known magic byte pattern (such as `0xA5A5A5A5`). During periodic context switches, the kernel checks whether the bytes at the very bottom of the stack have been altered. While simple, software watermarking is fundamentally reactive and dangerous: the corruption has already occurred before the check runs, and if an attacker jumps past the watermark or corrupts memory between context switches, the kernel is completely unaware.",
    "The PMSAv8 MPU provides an impenetrable hardware solution: Stack Overflow Guard Regions. During task context switching, the RTOS configures an MPU region directly at the bottom of the active thread's stack. This region (which can be as small as 32 bytes under PMSAv8) is programmed with access permission `NO_ACCESS`.",
    "The instant a thread executes an instruction (such as `PUSH {R4-R11}`) that causes the stack pointer to cross into the guard region, the MPU hardware traps the memory bus transaction before it can execute. The write is aborted, preventing any corruption of neighbor memory, and the CPU immediately vectors into the `MemManage` exception handler with the Data Access Violation (`DACCVIOL`) status bit set in the Configurable Fault Status Register (`CFSR`).",
    "The RTOS fault supervisor can inspect the faulting thread ID, log an audit alert, cleanly terminate the runaway thread, and reclaim its memory without crashing the rest of the system, achieving zero-tolerance fault isolation."
]

# --- PART 4 ---
p4_code = """# Memory Attribute Indirection Register (MAIR) & Device Memory Simulator
class MemoryAttributeController:
    def __init__(self):
        # MAIR register encodes memory type and cacheability per AttrIndex [0..7]
        # Attr 0: 0x00 -> Device-nGnRnE (Strongly-Ordered)
        # Attr 1: 0x04 -> Device-nGnRE (Hardware Peripheral register access)
        # Attr 2: 0x44 -> Normal Memory, Non-cacheable
        # Attr 3: 0xFF -> Normal Memory, Outer/Inner Write-Back Cacheable
        self.mair_entries = {
            0: {"type": "Device-nGnRnE", "reorder": False, "bufferable": False, "cacheable": False},
            1: {"type": "Device-nGnRE",  "reorder": False, "bufferable": True,  "cacheable": False},
            2: {"type": "Normal-NC",     "reorder": True,  "bufferable": True,  "cacheable": False},
            3: {"type": "Normal-WB",     "reorder": True,  "bufferable": True,  "cacheable": True}
        }

    def access_address(self, attr_idx: int) -> dict:
        entry = self.mair_entries.get(attr_idx, self.mair_entries[0])
        return {
            "attr_index": attr_idx,
            "memory_type": entry["type"],
            "instruction_reordering": "PROHIBITED" if not entry["reorder"] else "ALLOWED",
            "early_write_ack": "ENABLED" if entry["bufferable"] else "DISABLED"
        }

mair = MemoryAttributeController()
peripheral_attr = mair.access_address(1)  # Device-nGnRE
sram_attr = mair.access_address(3)        # Normal-WB

print("=== MAIR Memory Ordering & Attribute Resolution ===")
print(f"Peripheral Memory (Attr 1): Type -> {peripheral_attr['memory_type']}, Reordering -> {peripheral_attr['instruction_reordering']}")
print(f"SRAM Memory (Attr 3):       Type -> {sram_attr['memory_type']}, Reordering -> {sram_attr['instruction_reordering']}")
print("Ordering Invariant: Device-nGnRE forbids speculative reads and compiler reordering on crypto peripheral registers.")
"""
p4_out = run_code(p4_code)

p4_say = [
    "In high-performance microcontrollers equipped with advanced memory subsystems, the processor core does not treat all memory identically. Reading and writing standard program variables in SRAM requires caching and write-buffering for peak throughput. In contrast, interacting with hardware peripheral registers (such as AES accelerators, UART FIFOs, or cryptographic key registers) requires strict, unbuffered, non-speculative bus transactions where every write occurs in exact programmatic order.",
    "Under ARMv8-M PMSAv8, memory characteristics are decoupled from region descriptors using the Memory Attribute Indirection Registers (`MAIR0` and `MAIR1`). The MAIR registers act as an 8-entry lookup table (Attr0 through Attr7). Each 8-bit entry encodes the fundamental memory type—Normal Memory or Device Memory—along with its cacheability and buffering attributes.",
    "When configuring an MPU region in `MPU_RLAR`, the firmware simply writes a 3-bit index (`AttrIndx`) referencing one of the 8 predefined MAIR attribute slots. This indirection mechanism drastically simplifies MPU configuration, as all 16 MPU regions share a consistent set of validated hardware attributes.",
    "For hardware peripherals, the PMSAv8 architecture defines Device Memory attributes with explicit ordering constraints: `Device-nGnRnE` and `Device-nGnRE`. The acronym denotes three architectural behaviors: nG (Non-Gathering: multiple accesses cannot be merged into a single bus transaction), nR (Non-Reordering: the memory controller cannot reorder reads and writes relative to each other), and nE / E (Early Write Acknowledgement: whether the bus can acknowledge a write before it reaches the endpoint).",
    "Configuring cryptographic peripherals with Device-nGnRE is paramount for embedded security. If a peripheral were erroneously mapped as Normal memory, the CPU's speculative execution engine or out-of-order write buffer could write an encryption key before configuring the cipher mode, or read a FIFO buffer speculatively, corrupting cryptographic state machines.",
    "By enforcing Device attributes through MAIR, firmware ensures that hardware crypto engines and TRNG registers behave strictly deterministically according to their silicon specifications."
]

# --- PART 5 ---
p5_code = """# ApexMPUProtectionEngine: Unified PMSAv8 Memory Protection Subsystem
class ApexMPUProtectionEngine:
    def __init__(self):
        self.regions = []
        self.memmanage_fault_log = None

    def add_region(self, name: str, base: int, limit: int, perm: str, xn: bool):
        self.regions.append({
            "name": name,
            "base": base,
            "limit": limit,
            "perm": perm,  # "RO", "RW", "PRIV_RW", "NO_ACCESS"
            "xn": xn       # Execute-Never
        })

    def validate_memory_access(self, address: int, is_write: bool, is_fetch: bool, is_priv: bool) -> str:
        # Match against active regions (PMSAv8: highest matching region number takes precedence)
        matched_region = None
        for r in reversed(self.regions):
            if r["base"] <= address <= r["limit"]:
                matched_region = r
                break

        if not matched_region:
            self.memmanage_fault_log = f"DEFAULT_DENIED_UNMAPPED_ADDRESS_{hex(address)}"
            return "TRAP: MemManage_FAULT"

        if is_fetch and matched_region["xn"]:
            self.memmanage_fault_log = f"IACCVIOL_EXECUTE_NEVER_VIOLATION_{matched_region['name']}"
            return "TRAP: MemManage_IACCVIOL"

        if is_write:
            if matched_region["perm"] in ("RO", "NO_ACCESS"):
                self.memmanage_fault_log = f"DACCVIOL_WRITE_PROTECTION_{matched_region['name']}"
                return "TRAP: MemManage_DACCVIOL"
            if matched_region["perm"] == "PRIV_RW" and not is_priv:
                self.memmanage_fault_log = f"DACCVIOL_PRIVILEGE_VIOLATION_{matched_region['name']}"
                return "TRAP: MemManage_DACCVIOL"

        return f"ACCESS_GRANTED_{matched_region['name']}"

engine = ApexMPUProtectionEngine()
# Region 0: Flash Code (Read-Only, Executable)
engine.add_region("FLASH_TEXT", 0x00020000, 0x0005FFFF, perm="RO", xn=False)
# Region 1: SRAM Data (Read-Write, Execute-Never)
engine.add_region("SRAM_DATA", 0x20000000, 0x20017FFF, perm="RW", xn=True)
# Region 2: Stack Guard Page (No-Access, Execute-Never)
engine.add_region("STACK_GUARD", 0x20018000, 0x2001801F, perm="NO_ACCESS", xn=True)
# Region 3: OS Kernel Config (Privileged RW, Execute-Never)
engine.add_region("KERNEL_CONF", 0x20018020, 0x2001FFFF, perm="PRIV_RW", xn=True)

print("=== ApexMPUProtectionEngine Verification ===")
# 1. User mode fetch from flash
t1 = engine.validate_memory_access(0x00025000, is_write=False, is_fetch=True, is_priv=False)
print("1. User Flash Code Fetch:       ", t1)

# 2. Malicious user write to Flash
t2 = engine.validate_memory_access(0x00025000, is_write=True, is_fetch=False, is_priv=False)
print("2. User Flash Write Tamper:     ", t2, f"({engine.memmanage_fault_log})")

# 3. Stack overflow hitting Guard Region
t3 = engine.validate_memory_access(0x20018010, is_write=True, is_fetch=False, is_priv=False)
print("3. Stack Overflow Guard Hit:    ", t3, f"({engine.memmanage_fault_log})")

# 4. Unprivileged access to Kernel Config
t4 = engine.validate_memory_access(0x20018100, is_write=True, is_fetch=False, is_priv=False)
print("4. User Kernel Config Write:    ", t4, f"({engine.memmanage_fault_log})")
print("Engine Invariant: ApexMPU strictly traps buffer overflows, privilege escalations, and code injection.")
"""
p5_out = run_code(p5_code)

p5_say = [
    "To unite all memory protection mechanisms into an industrial-grade runtime environment, firmware architects deploy a comprehensive MPU Subsystem. This subsystem dynamically manages MPU region programming during RTOS context switches, isolates unprivileged user tasks, detects stack overflows in real time, and intercepts unauthorized peripheral manipulation.",
    "Let us trace the complete execution lifecycle within our unified ApexMPUProtectionEngine. At startup, privileged boot code initializes the default memory map across the MPU. Region 0 is allocated for application Flash (`FLASH_TEXT`), configured as Read-Only and Executable (`XN=0`). Region 1 encompasses the primary user SRAM buffer (`SRAM_DATA`), configured with Read-Write permissions but tagged strictly as Execute-Never (`XN=1`), guaranteeing that no injected code can execute from data memory.",
    "To defend against stack overflows, Region 2 is established as a 32-byte Stack Guard Page (`STACK_GUARD`) mapped at the base of the user stack with permission `NO_ACCESS`. Region 3 reserves the upper kernel configuration block (`KERNEL_CONF`), marked as Privileged Read-Write. With these regions programmed and enabled via `MPU_CTRL`, the kernel drops privileges into Unprivileged Thread Mode.",
    "During normal operation, the user task executes instructions from flash and reads/writes local data in SRAM without incurring any performance penalties. However, when an adversary attempts to overwrite the application Flash partition, the MPU hardware detects the write permission violation and halts the transaction instantly, raising a Data Access Violation (`DACCVIOL`) MemManage exception.",
    "Similarly, if a buffer overflow causes the task stack to descend past its threshold into the guard page, the access to Region 2 is trapped before adjacent kernel data can be corrupted. And if unprivileged code attempts to tamper with the kernel configuration block at Region 3, the privilege check triggers an immediate MemManage exception.",
    "By combining the hardware guarantees of PMSAv8 with dynamic RTOS stack guarding, embedded developers construct resilient IoT devices capable of surviving memory corruption attacks in untrusted user software without jeopardizing system integrity."
]

def make_long_lesson_day13():
    return {
        "coursePrefix": "iot_sec",
        "day": 13,
        "title": "Memory Protection Units (MPU): Stack Overflow Guarding & Unprivileged User Mode Isolation",
        "goal": "Master ARMv8-M PMSAv8 MPU architecture, privileged vs unprivileged execution levels, stack overflow guard regions, MAIR device memory typing, and MemManage exception trapping to enforce bulletproof memory boundaries.",
        "minutes": 38,
        "recap": "Day 12 partitioned hardware domains with ARMv8-M TrustZone (SAU/IDAU, banked stacks, and dual vector tables). Today, we implement fine-grained memory safety within both domains using the PMSAv8 Memory Protection Unit (MPU).",
        "parts": [
            {
                "title": "ARMv8-M PMSAv8 MPU Architecture & 32-Byte Granularity",
                "say": p1_say,
                "example": "PMSAv8 replaces clumsy power-of-two regions with flexible base/limit registers and 32-byte alignment, enforcing Execute-Never (XN) on SRAM to stop shellcode execution.",
                "code": p1_code,
                "output": p1_out,
                "codeNotes": [
                    "PMSAv8 defines regions via MPU_RBAR (base) and MPU_RLAR (limit) with 32-byte alignment.",
                    "Execute-Never (XN) bit prevents malicious instruction execution from SRAM data buffers.",
                    "TrustZone microcontrollers feature dual MPU hardware: MPU_S for Secure and MPU_NS for Non-Secure."
                ],
                "tryIt": "Attempt an instruction fetch from SRAM and verify that the Execute-Never (XN) rule triggers an IACCVIOL fault.",
                "check": {
                    "question": "What is the key advantage of ARMv8-M PMSAv8 over legacy PMSAv7 MPU architecture?",
                    "options": [
                        "Regions are defined by arbitrary base and limit addresses with 32-byte alignment instead of strict power-of-two sizes.",
                        "It eliminates the need for flash memory by caching everything in CPU registers.",
                        "It encrypts all network packets using AES hardware automatically.",
                        "It allows unprivileged code to modify memory protection registers without traps."
                    ],
                    "answer": 0,
                    "why": "PMSAv8 replaces power-of-two size restrictions with flexible 32-byte aligned base and limit address registers."
                }
            },
            {
                "title": "Privileged Handler Mode vs Unprivileged Thread Mode (CONTROL.nPRIV)",
                "say": p2_say,
                "example": "RTOS drops to Unprivileged Thread Mode via CONTROL.nPRIV=1 to sandbox user tasks, while hardware traps unauthorized SCB or MPU register writes into MemManage exceptions.",
                "code": p2_code,
                "output": p2_out,
                "codeNotes": [
                    "Handler mode is always Privileged; Thread mode can be Privileged (nPRIV=0) or Unprivileged (nPRIV=1).",
                    "Unprivileged code cannot modify CONTROL.nPRIV or access System Control Block (SCB) registers.",
                    "Unprivileged tasks must execute SVC instructions to request privileged operating system services."
                ],
                "tryIt": "Test an unprivileged write to the System Control Block and verify that the access is intercepted and rejected.",
                "check": {
                    "question": "How can an unprivileged user thread running with CONTROL.nPRIV=1 regain privileged execution?",
                    "options": [
                        "By triggering an exception or executing an SVC (Supervisor Call) instruction to enter the privileged OS handler.",
                        "By directly clearing the nPRIV bit in the CONTROL register using an MSR instruction.",
                        "By performing a division by zero to trigger a UsageFault.",
                        "By rebooting the microcontroller into bootloader mode."
                    ],
                    "answer": 0,
                    "why": "The transition from unprivileged to privileged execution is hardware-restricted to exceptions such as the SVC instruction."
                }
            },
            {
                "title": "Stack Overflow Detection & Guard Regions",
                "say": p3_say,
                "example": "Unmapped 32-byte guard pages placed at the stack bottom trigger hardware MemManage DACCVIOL faults the instant a descending stack breaches its limit.",
                "code": p3_code,
                "output": p3_out,
                "codeNotes": [
                    "Descending ARM stacks threaten to overwrite adjacent kernel data and neighbor thread control blocks.",
                    "PMSAv8 allocates an unmapped NO_ACCESS guard region at the bottom limit of the thread stack.",
                    "Any push instruction breaching the guard page immediately triggers a MemManage DACCVIOL fault."
                ],
                "tryIt": "Simulate a recursive function stack overflow and observe the hardware guard region aborting the write.",
                "check": {
                    "question": "Why is MPU-based hardware stack guarding superior to software watermarking in RTOS applications?",
                    "options": [
                        "It traps the stack overflow synchronously at the exact moment of breach, preventing memory corruption before it occurs.",
                        "It allows thread stacks to grow indefinitely without consuming physical RAM.",
                        "It encrypts the stack frame using hardware AES.",
                        "It doubles the CPU clock frequency during context switches."
                    ],
                    "answer": 0,
                    "why": "MPU guard pages trigger an immediate hardware fault upon breach, whereas software watermarks only detect corruption after it has already occurred."
                }
            },
            {
                "title": "Memory Attribute Indirection Register (MAIR) & Device Memory",
                "say": p4_say,
                "example": "MAIR decouples memory caching attributes from region bounds, enforcing Device-nGnRE ordering on cryptographic peripherals to prevent speculative hazards.",
                "code": p4_code,
                "output": p4_out,
                "codeNotes": [
                    "MAIR registers encode memory type and cacheability as an 8-slot lookup table.",
                    "MPU_RLAR references MAIR entries using a 3-bit AttrIndx field.",
                    "Device-nGnRE forbids speculative execution and access reordering on hardware peripheral registers."
                ],
                "tryIt": "Compare instruction reordering permissions between Device-nGnRE and Normal-WB memory attributes.",
                "check": {
                    "question": "Why must cryptographic hardware peripheral registers be mapped with Device-nGnRE memory attributes?",
                    "options": [
                        "To prevent the processor from reordering writes, merging transactions, or executing speculative reads on hardware registers.",
                        "To allow CPU caches to store crypto keys in L1 cache indefinitely.",
                        "To compress peripheral data packets before transmission over the bus.",
                        "To permit multiple threads to write to the same register simultaneously."
                    ],
                    "answer": 0,
                    "why": "Device-nGnRE ensures strictly non-reordered, unbuffered access to peripheral registers, preventing speculative state machine corruption."
                }
            },
            {
                "title": "ApexMPUProtectionEngine: Unified PMSAv8 Memory Protection Subsystem",
                "say": p5_say,
                "example": "ApexMPUProtectionEngine coordinates flash execution, SRAM W^X policies, stack guard traps, and kernel privilege boundaries into an integrated defense framework.",
                "code": p5_code,
                "output": p5_out,
                "codeNotes": [
                    "ApexMPUProtectionEngine manages multi-region memory validation and fault classification.",
                    "Flash writes and SRAM code execution are blocked with DACCVIOL and IACCVIOL traps.",
                    "Stack overflow breaches into guard pages trigger immediate fault containment and task isolation."
                ],
                "tryIt": "Execute a write to the protected kernel configuration block from an unprivileged thread and observe the privilege violation trap.",
                "check": {
                    "question": "What is the primary role of the W^X (Write XOR Execute) memory policy enforced by the MPU?",
                    "options": [
                        "It ensures memory is either writable or executable, but never both, preventing code injection attacks in SRAM.",
                        "It doubles the write speed of flash memory during firmware updates.",
                        "It eliminates the need for RTOS context switching.",
                        "It allows user applications to modify operating system code dynamically."
                    ],
                    "answer": 0,
                    "why": "W^X prevents attackers from injecting malicious shellcode into data RAM and then executing it."
                }
            }
        ],
        "summary": [
            "ARMv8-M PMSAv8 MPU replaces clumsy power-of-two constraints with flexible 32-byte base and limit address registers.",
            "Execution privilege is partitioned into Privileged and Unprivileged levels via CONTROL.nPRIV, sandboxing user code.",
            "Hardware stack guard pages placed at stack bottoms trap overflows synchronously via MemManage DACCVIOL faults.",
            "MAIR indirection registers enforce Device-nGnRE ordering to prevent speculative reordering on crypto peripherals.",
            "The unified ApexMPUProtectionEngine demonstrates complete containment against shellcode injection and memory tampering."
        ],
        "projectStep": {
            "title": "Build & Validate ARM PMSAv8 MPU Protection Subsystem",
            "steps": [
                "Implement a PMSAv8 MPU region validator supporting 32-byte alignment and Execute-Never (XN) enforcement.",
                "Construct a CPU privilege simulator demonstrating CONTROL.nPRIV mode dropping and SVC exception entry.",
                "Develop an RTOS thread stack guard engine verifying synchronous MemManage traps on descending stack overflows.",
                "Build a MAIR memory attribute resolver validating Device-nGnRE ordering constraints on peripheral registers.",
                "Integrate all modules into an ApexMPUProtectionEngine verifying complete W^X policy and fault containment."
            ]
        }
    }

if __name__ == "__main__":
    day13_data = make_long_lesson_day13()
    with open("scripts/iot_sec_day13.json", "w", encoding="utf-8") as f:
        json.dump(day13_data, f, indent=2)

    words = [sum(len(s.split()) for s in p["say"]) for p in day13_data["parts"]]
    print(f"Day 13 base generated successfully! Words per part: {words} (Total: {sum(words)}, Min: {min(words)})")
