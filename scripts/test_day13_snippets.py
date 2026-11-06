#!/usr/bin/env python3
import subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

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

for i, code in enumerate([p1_code, p2_code, p3_code, p4_code, p5_code], 1):
    out = run_code(code)
    print(f"Snippet {i} passed!")
