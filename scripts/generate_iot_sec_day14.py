#!/usr/bin/env python3
"""
generate_iot_sec_day14.py
Course 19 (iot_sec) Month 1 Block 3 Day 14:
Secure Inter-Process Communication (IPC): Non-Secure Callable (NSC) Gateways & SG Veneers
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

# --- PART 1 ---
p1_code = """# ARMv8-M Secure Gateway (SG) Veneer & NSC Entry Point Simulator
class SecureGatewayVeneerTable:
    def __init__(self):
        # NSC memory window: 0x00040000 - 0x00040FFF
        # Each veneer entry consists of:
        # [0x00] SG instruction (0xE97FE97F)
        # [0x04] B.W target_secure_function
        self.nsc_veneers = {
            0x00040000: {"symbol": "nsc_crypto_sign",    "target": 0x10002100, "has_sg": True},
            0x00040008: {"symbol": "nsc_read_device_id", "target": 0x10002240, "has_sg": True}
        }
        self.secure_private_functions = {
            0x10002100: "private_sign_internal_logic",
            0x10002150: "private_extract_raw_private_key"  # Mid-function or unexported secret
        }

    def branch_from_non_secure(self, destination_address: int) -> dict:
        # Check if destination address has the SG instruction in NSC region
        veneer = self.nsc_veneers.get(destination_address)
        if veneer and veneer["has_sg"]:
            return {
                "status": "GATEWAY_AUTHORIZED",
                "service": veneer["symbol"],
                "target_secure_address": hex(veneer["target"]),
                "cpu_state": "TRANSITION_TO_SECURE"
            }
        
        # Illegal attempt to jump directly to private Secure functions bypassing SG
        return {
            "status": "ILLEGAL_ENTRY_REJECTED",
            "fault": "SECUREFAULT_INVEP_INVALID_ENTRY_POINT",
            "cpu_state": "TRAP_SECUREFAULT"
        }

gateway = SecureGatewayVeneerTable()
legit_call = gateway.branch_from_non_secure(0x00040000)
attack_jump = gateway.branch_from_non_secure(0x10002150)

print("=== ARMv8-M Secure Gateway (SG) Veneer Audit ===")
print(f"Legitimate NSC Call (0x00040000): {legit_call['status']} -> {legit_call['service']}")
print(f"Direct Private Jump (0x10002150): {attack_jump['status']} -> Fault: {attack_jump['fault']}")
print("Veneer Invariant: Non-Secure calls can only enter Secure space if first instruction is SG inside NSC.")
"""
p1_out = run_code(p1_code)

p1_say = [
    "In an ARMv8-M TrustZone architecture, the CPU core hardware strictly bars the Non-Secure World from directly branching into Secure memory. If this boundary were absolute with zero communication pathways, the Secure World would be useless, unable to provide cryptographic services, certificate validation, or secure key storage to user applications. To resolve this dilemma, TrustZone introduces a tightly controlled hardware gateway: Non-Secure Callable (NSC) memory and the Secure Gateway (SG) instruction.",
    "Non-Secure Callable memory is a dedicated memory region defined by the Security Attribution Unit (SAU) or Implementation Defined Attribution Unit (IDAU). NSC memory resides physically inside Secure Flash, but possesses a unique hardware permission: Non-Secure software is permitted to execute branch instructions (such as BL or BLX) targeting NSC addresses.",
    "However, branching to an NSC address is governed by an unyielding hardware invariant: The very first 32-bit instruction executed at the branch destination MUST be the Secure Gateway instruction (SG, opcode 0xE97F E97F). If Non-Secure code attempts to jump into NSC memory at an offset that does not begin with an SG instruction, or branches to any other address in Secure memory, the CPU hardware raises an unmaskable SecureFault exception with the Invalid Entry Point (INVEP) status flag asserted.",
    "Because of this hardware rule, toolchains construct a Veneer Table in NSC memory. A veneer is a tiny 8-byte stub consisting of exactly two instructions: first, the SG instruction that authorizes the domain transition from Non-Secure to Secure, and second, a direct branch (B.W) that redirects execution to the actual private implementation function deep within Secure Flash. Non-Secure applications link against this veneer table, treating each entry point as an ordinary C function call.",
    "This architecture completely prevents 'mid-function entry' attacks. In traditional unsegmented microcontrollers, an attacker could branch into the middle of a security function, skipping signature checks or privilege validation. Under TrustZone, the SG instruction acts as an impenetrable electronic turnstile: execution can only enter Secure code at validated, pre-compiled entry points.",
    "Furthermore, toolchains automate veneer generation. When compiling Secure firmware with GCC or Arm Compiler 6, functions marked with the __attribute__((cmse_nonsecure_entry)) macro automatically export an 8-byte SG veneer into the NSC library, providing seamless type-safe inter-domain communication."
]

# --- PART 2 ---
p2_code = """# Cross-Domain Call Convention & Register Scrubbing Simulator
class CrossDomainRegisterSanitizer:
    def __init__(self):
        # General purpose registers R0-R12, LR, APSR
        self.cpu_registers = {f"R{i}": 0 for i in range(13)}
        self.cpu_registers["LR"] = 0
        self.cpu_registers["APSR"] = 0

    def execute_secure_service_and_return(self, secret_key: int, return_val: int) -> dict:
        # Secure computation uses registers as scratchpads
        self.cpu_registers["R1"] = secret_key       # High-entropy private key material
        self.cpu_registers["R2"] = 0xDEADBEEF       # Intermediate crypto digest
        self.cpu_registers["R0"] = return_val       # Service result (0 = success)

        # Secure World must scrub registers before executing BXNS to return
        # Scrub all scratch registers except return value in R0
        for reg in ["R1", "R2", "R3", "R12", "APSR"]:
            self.cpu_registers[reg] = 0

        return {
            "r0_result": self.cpu_registers["R0"],
            "r1_scrubbed": self.cpu_registers["R1"] == 0,
            "r2_scrubbed": self.cpu_registers["R2"] == 0,
            "leakage_status": "ZERO_RESIDUE_VERIFIED"
        }

sanitizer = CrossDomainRegisterSanitizer()
run = sanitizer.execute_secure_service_and_return(secret_key=0x4A1F98C3, return_val=0)

print("=== Cross-Domain Return Register Scrubbing ===")
print(f"Return Value (R0):     {run['r0_result']} (Success)")
print(f"Secret Key (R1) Zero:  {run['r1_scrubbed']}")
print(f"Scratch (R2) Zero:     {run['r2_scrubbed']}")
print(f"Register Sanitization: {run['leakage_status']}")
print("Scrubbing Invariant: Secure World must zero all scratchpad registers before BXNS to prevent context leakage.")
"""
p2_out = run_code(p2_code)

p2_say = [
    "When a Non-Secure application calls an exported Secure service via an NSC veneer, the processor transitions execution across security boundaries. While stack pointers are banked in hardware (MSP_S/MSP_NS and PSP_S/PSP_NS), the core general-purpose registers (R0 through R12), the Link Register (LR), and the Application Program Status Register (APSR) are shared across domains.",
    "This shared register architecture introduces an acute risk of context leakage. During the execution of a Secure cryptographic operation (such as AES key expansion or ECDSA signing), intermediate secret keys, modular arithmetic residues, and private pointers are loaded into registers R1, R2, R3, and R12. If the Secure function simply returned to the Non-Secure caller without sanitizing these registers, the untrusted caller could immediately read out the cryptographic key bits directly from CPU registers.",
    "To eliminate this side-channel, the ARMv8-M Architecture Calling Convention mandates rigorous Register Scrubbing. Before returning execution across the security boundary via the Branch with Exchange to Non-Secure instruction (BXNS), the Secure software must overwrite all scratchpad registers (R1-R3, R12), condition flags (APSR), and floating-point registers (S0-S15) with zeroes.",
    "Only the designated return registers (R0 or R0-R1 for 64-bit values) are permitted to carry valid return status back to the Non-Secure caller. Any register not explicitly used for the return value must be wiped clean.",
    "In addition, the Link Register (LR) requires special handling during cross-domain transitions. When entering a Secure service, the hardware sets bit 0 of the return address in LR to 0, indicating a Non-Secure return target. The Secure callee preserves this return token on the Secure stack (MSP_S) and restores it immediately before executing BXNS.",
    "Modern compilers compliant with the ARM Cortex-M Security Extensions (CMSE) automatically generate register scrubbing epilogues for all functions decorated with the __attribute__((cmse_nonsecure_entry)) attribute. By synthesizing zeroing instructions prior to BXNS, the compiler ensures that no residual cryptographic state ever escapes the Secure World."
]

# --- PART 3 ---
p3_code = """# Secure-to-Non-Secure Callback & Function Pointer Simulator
class SecureCallbackDispatcher:
    def __init__(self):
        self.active_domain = "SECURE"

    def invoke_non_secure_callback(self, ns_func_ptr: int, arg: int) -> dict:
        # In ARMv8-M, a Non-Secure function pointer must have bit 0 = 0 (Clear LSB)
        # In contrast, standard Thumb code has bit 0 = 1
        is_valid_ns_fp = (ns_func_ptr & 0x01) == 0
        
        if not is_valid_ns_fp:
            return {
                "status": "REJECTED_INVALID_NS_FP",
                "fault": "SECUREFAULT_INVALID_NS_CALL_BIT0_SET"
            }

        # Secure CPU hardware pushes return state to MSP_S, loads magic EXC_RETURN into LR
        # and executes BLXNS
        self.active_domain = "NON_SECURE"
        return {
            "status": "CALLBACK_DISPATCH_SUCCESS",
            "active_domain": self.active_domain,
            "target_ns_fp": hex(ns_func_ptr),
            "passed_arg": hex(arg)
        }

dispatcher = SecureCallbackDispatcher()
# Valid NS callback pointer with bit 0 cleared
cb_valid = dispatcher.invoke_non_secure_callback(0x00024000, 0x1234)
# Malicious NS callback attempting to point to Thumb Secure address (bit 0 = 1)
cb_invalid = dispatcher.invoke_non_secure_callback(0x00024001, 0x1234)

print("=== Secure-to-Non-Secure Callback Dispatch ===")
print(f"Valid NS Callback:   {cb_valid['status']} (Domain: {cb_valid.get('active_domain', 'N/A')})")
print(f"Invalid NS Callback: {cb_invalid['status']} (Fault: {cb_invalid.get('fault', 'NONE')})")
print("Callback Invariant: BLXNS transitions require bit 0 of the target function pointer to be cleared.")
"""
p3_out = run_code(p3_code)

p3_say = [
    "While the most common inter-domain pattern involves Non-Secure code invoking Secure services, sophisticated IoT applications frequently require the reverse: Secure firmware invoking a callback function located in Non-Secure memory. Examples include asynchronous cryptographic job completion notifications, periodic timer callbacks, or error reporting hooks registered by the user RTOS.",
    "Calling from Secure World into Non-Secure World is performed using the Branch with Link and Exchange to Non-Secure instruction (BLXNS). However, executing BLXNS introduces critical security complexities that the hardware and software must carefully govern.",
    "A fundamental architectural invariant of ARMv8-M is Function Pointer LSB Encoding. In standard 32-bit ARM Thumb architecture, all function pointers have bit 0 set to 1 to denote the Thumb instruction set state. In ARMv8-M TrustZone, bit 0 is repurposed during inter-domain branches: a function pointer targeting Non-Secure memory MUST have bit 0 cleared to 0.",
    "If Secure firmware executes BLXNS against a function pointer whose LSB is 1, the processor hardware immediately aborts the branch and triggers an unmaskable SecureFault exception. This rule prevents Secure code from being tricked into branching back into another Secure function under the illusion of calling an external callback.",
    "Furthermore, before executing BLXNS, the processor hardware automatically pushes a Secure Context Frame onto the Secure stack (MSP_S). This frame stores sensitive internal registers and loads a special synthetic value (0xFEFFFFFF, known as FNC_RETURN) into the Link Register (LR).",
    "When the Non-Secure callback function finishes executing and executes a standard return (BX LR), the processor intercepts the FNC_RETURN token, unwinds the Secure stack frame, restores Secure execution privilege, and resumes the Secure caller. This hardware mechanism guarantees that untrusted callback code cannot forge return addresses or hijack the Secure stack."
]

# --- PART 4 ---
p4_code = """# Test Target (TT) Pointer Validation & Confused Deputy Defense
class TestTargetPointerValidator:
    def __init__(self):
        # Memory layout:
        # 0x00020000 - 0x00027FFF: Non-Secure RAM (Owner: User Application)
        # 0x10000000 - 0x10007FFF: Secure RAM (Owner: Root Key Enclave)
        self.ns_ram = (0x00020000, 0x00027FFF)
        self.s_ram  = (0x10000000, 0x10007FFF)

    def validate_user_buffer(self, buffer_ptr: int, buffer_len: int) -> dict:
        buf_start = buffer_ptr
        buf_end = buffer_ptr + buffer_len - 1
        
        # TT instruction check: verify entire buffer lies within Non-Secure memory
        # and does not overlap Secure RAM
        is_within_ns = (self.ns_ram[0] <= buf_start <= self.ns_ram[1]) and (self.ns_ram[0] <= buf_end <= self.ns_ram[1])
        is_secure_overlap = not ((buf_end < self.s_ram[0]) or (buf_start > self.s_ram[1]))

        if is_secure_overlap or not is_within_ns:
            return {
                "validation": "REJECTED_CONFUSED_DEPUTY",
                "fault": "SECUREFAULT_UNAUTHORIZED_POINTER_ACCESS",
                "safe_to_copy": False
            }

        return {"validation": "BUFFER_VERIFIED_NON_SECURE", "safe_to_copy": True}

validator = TestTargetPointerValidator()
# Legitimate user buffer in NS SRAM
legit_buf = validator.validate_user_buffer(0x00022000, 128)
# Confused deputy attack: User passes pointer to Secure RAM root key (0x10001000)
attack_buf = validator.validate_user_buffer(0x10001000, 64)

print("=== TT Instruction Pointer Validation Audit ===")
print(f"User App Buffer (0x00022000): {legit_buf['validation']} (Safe: {legit_buf['safe_to_copy']})")
print(f"Confused Deputy (0x10001000): {attack_buf['validation']} (Safe: {attack_buf['safe_to_copy']})")
print("Validation Invariant: Secure services must use TT instructions to verify caller buffer ownership.")
"""
p4_out = run_code(p4_code)

p4_say = [
    "Even with SG veneers and register scrubbing in place, Secure services remain highly vulnerable to one of the most insidious vulnerabilities in computer security: The Confused Deputy Attack. In a confused deputy scenario, an unprivileged Non-Secure application exploits the asymmetric privilege of the Secure service to perform actions that the caller could never execute on its own.",
    "Consider a Secure function exported to user space: `nsc_read_device_id(uint8_t *dest_buf, size_t len)`. Because the function runs in the Secure World, it possesses hardware privilege to write into both Secure and Non-Secure RAM. If a malicious Non-Secure application passes a destination pointer pointing to a critical Secure data structure—such as `0x10001000` (the Secure stack or Root Key table)—the Secure function would blindly copy the device ID over the private key memory, corrupting or exfiltrating Secure state.",
    "To defeat confused deputy attacks, ARMv8-M introduces the Test Target (TT) instruction family: `TT`, `TTT`, `TTA`, and `TTAT`. The TT instruction accepts a target memory address in a register and returns a 32-bit status response detailing the address's security attribution (Secure vs Non-Secure), MPU region assignment, and read/write access permissions.",
    "Using the `cmse_check_address_range()` intrinsic (which compiles directly into TT instructions), the Secure service must validate every incoming pointer and buffer length before dereferencing it. The check verifies two mandatory invariants: first, that every byte in the range `[buf, buf + len - 1]` is classified by the SAU and IDAU as Non-Secure; and second, that the calling Non-Secure task has read or write permission according to the Non-Secure MPU.",
    "If the buffer intersects Secure memory in any way, or if an integer overflow causes the range calculation to wrap around the 4GB address space, the validation check immediately fails. The Secure service rejects the request and logs an alert, completely disarming the confused deputy exploit.",
    "Pointer validation is an absolute requirement for every input and output argument across the TrustZone boundary, ensuring that the Secure World operates exclusively upon data memory legitimately owned by the caller."
]

# --- PART 5 ---
p5_code = """# ApexNSCGatewayEngine: Unified Secure IPC & Gateway Subsystem
class ApexNSCGatewayEngine:
    def __init__(self):
        self.veneers = {
            0x00040000: {"name": "nsc_get_certificate", "target": 0x10003000},
            0x00040008: {"name": "nsc_aes_encrypt_buffer", "target": 0x10003100}
        }
        self.ns_ram_range = (0x00020000, 0x0002FFFF)
        self.active_domain = "NON_SECURE"

    def invoke_gateway(self, veneer_addr: int, src_buf: int, buf_len: int) -> dict:
        # 1. Veneer check
        veneer = self.veneers.get(veneer_addr)
        if not veneer:
            return {"status": "FAIL", "reason": "SECUREFAULT_INVALID_GATEWAY_ENTRY"}

        # 2. Enter Secure domain
        self.active_domain = "SECURE"

        # 3. TT Pointer validation
        if not (self.ns_ram_range[0] <= src_buf and (src_buf + buf_len - 1) <= self.ns_ram_range[1]):
            self.active_domain = "NON_SECURE"
            return {"status": "FAIL", "reason": "CONFUSED_DEPUTY_INVALID_BUFFER"}

        # 4. Execute service securely & scrub registers
        processed_bytes = buf_len
        self.active_domain = "NON_SECURE"

        return {
            "status": "SUCCESS",
            "service": veneer["name"],
            "processed_bytes": processed_bytes,
            "registers_scrubbed": True,
            "final_domain": self.active_domain
        }

engine = ApexNSCGatewayEngine()
# Test 1: Successful NSC call with valid NS buffer
res1 = engine.invoke_gateway(0x00040008, src_buf=0x00021000, buf_len=256)
# Test 2: Confused deputy attack targeting Secure flash (0x10000000)
res2 = engine.invoke_gateway(0x00040008, src_buf=0x10000000, buf_len=32)

print("=== ApexNSCGatewayEngine Verification ===")
print("1. Authorized IPC Call:  ", res1["status"], f"({res1['service']}, Bytes: {res1['processed_bytes']})")
print("2. Confused Deputy Trap: ", res2["status"], f"({res2['reason']})")
print("Gateway Invariant: ApexNSCGatewayEngine unites SG veneers, TT validation, and register scrubbing.")
"""
p5_out = run_code(p5_code)

p5_say = [
    "To unite all inter-domain communication mechanisms into a coherent, industrial-grade architecture, firmware engineers deploy an integrated Secure IPC Gateway Subsystem. This subsystem orchestrates every phase of cross-domain execution: verifying SG veneer entry, performing TT pointer range validation, managing caller stacks, executing cryptographic services, sanitizing CPU registers, and safely returning to the Non-Secure World.",
    "Let us examine the complete lifecycle within our unified ApexNSCGatewayEngine. When an unprivileged Non-Secure application requires cryptographic encryption, it issues a function call targeting the public veneer address `0x00040008` (`nsc_aes_encrypt_buffer`). The CPU hardware fetches the SG instruction at this location, validating entry into NSC memory and transitioning the processor execution state to Secure.",
    "Upon entering the Secure service implementation, the gateway immediately subjects all input arguments to rigorous TT validation. In our simulation, the user provides a buffer pointer `0x00021000` of length 256 bytes. The TT validation engine checks that the entire buffer range `[0x00021000, 0x000210FF]` resides strictly within Non-Secure RAM (`0x00020000 - 0x0002FFFF`). Because the buffer is verified as Non-Secure, the validation succeeds.",
    "The Secure service then reads the plaintext from the user buffer, delegates the encryption task to the hardware AES coprocessor, and writes the resulting ciphertext back to user memory. Once processing concludes, the gateway executes the mandatory register scrubbing protocol: wiping scratch registers R1-R3, R12, and APSR condition flags to zero.",
    "Finally, the Secure gateway executes `BXNS` to return control to the Non-Secure caller. The active domain transitions back to Non-Secure, leaving the caller with the processed data in its local buffer and zero residual secrets in the processor's registers.",
    "Conversely, when an attacker attempts a confused deputy exploit—such as passing a destination pointer targeting Secure Flash at `0x10000000`—the TT validation logic detects the unauthorized memory range immediately. The gateway rejects the call, aborts execution, and prevents any unauthorized memory overwrite, demonstrating impenetrable hardware and software co-design."
]

def make_long_lesson_day14():
    return {
        "coursePrefix": "iot_sec",
        "day": 14,
        "title": "Secure Inter-Process Communication (IPC): Non-Secure Callable (NSC) Gateways & SG Veneers",
        "goal": "Master ARMv8-M Non-Secure Callable (NSC) gateways, SG instruction veneers, cross-domain calling conventions, TT pointer validation, and register scrubbing to build impenetrable secure IPC interfaces.",
        "minutes": 38,
        "recap": "Day 13 hardened memory safety using PMSAv8 MPU regions, stack overflow guard pages, and unprivileged user sandboxing. Today, we bridge the TrustZone divide safely using Non-Secure Callable (NSC) gateways and Secure Gateway (SG) veneers.",
        "parts": [
            {
                "title": "Secure Gateway (SG) Veneers & NSC Entry Points",
                "say": p1_say,
                "example": "Non-Secure code can only enter Secure space through 8-byte SG veneers located in NSC memory; direct jumps or mid-function branches trigger instant SecureFault traps.",
                "code": p1_code,
                "output": p1_out,
                "codeNotes": [
                    "NSC memory allows Non-Secure branches only if the initial instruction is SG (0xE97F E97F).",
                    "Veneer tables pair the SG opcode with a direct branch (B.W) to the private secure implementation.",
                    "Direct jumps into Secure space bypassing SG veneers trigger an unmaskable SecureFault INVEP trap."
                ],
                "tryIt": "Simulate a direct branch into an unexported private Secure function and observe the INVEP SecureFault.",
                "check": {
                    "question": "What is the role of the Secure Gateway (SG) instruction in ARMv8-M TrustZone?",
                    "options": [
                        "It authorizes a valid security state transition from Non-Secure to Secure at pre-compiled NSC entry points.",
                        "It encrypts the entire flash memory array upon system boot.",
                        "It increases the CPU clock multiplier for cryptographic operations.",
                        "It switches the processor into low-power sleep mode."
                    ],
                    "answer": 0,
                    "why": "The SG instruction is the only instruction capable of legally transitioning the CPU from Non-Secure to Secure execution at NSC entry points."
                }
            },
            {
                "title": "Cross-Domain Call Convention & Register Scrubbing",
                "say": p2_say,
                "example": "Before executing BXNS to return to the Non-Secure World, Secure firmware must zero all scratchpad registers (R1-R3, R12, APSR) to prevent cryptographic key leakage.",
                "code": p2_code,
                "output": p2_out,
                "codeNotes": [
                    "General-purpose registers R0-R12 and APSR are shared across security domains.",
                    "Register scrubbing zeroes R1-R3, R12, and condition codes before executing BXNS.",
                    "Compilers compliant with ARM CMSE automate register sanitization via __attribute__((cmse_nonsecure_entry))."
                ],
                "tryIt": "Inspect CPU registers after a secure return to verify that all intermediate secret keys have been scrubbed to zero.",
                "check": {
                    "question": "Why must Secure functions scrub CPU scratchpad registers before executing BXNS to return to Non-Secure code?",
                    "options": [
                        "To prevent residual cryptographic keys, pointers, and sensitive calculation states from leaking to untrusted callers.",
                        "To clear cache lines for power management.",
                        "To reset the microcontroller's hardware watchdog timer.",
                        "To force the Non-Secure application to reload its stack pointer."
                    ],
                    "answer": 0,
                    "why": "General-purpose registers are shared between domains; failing to scrub them leaves secret keys in registers where unprivileged code can read them."
                }
            },
            {
                "title": "Secure-to-Non-Secure Callback Mechanism & Function Pointers",
                "say": p3_say,
                "example": "Secure firmware invokes Non-Secure callbacks via BLXNS, enforcing the invariant that Non-Secure function pointer bit 0 must be 0 and preserving context on MSP_S.",
                "code": p3_code,
                "output": p3_out,
                "codeNotes": [
                    "BLXNS executes Secure-to-Non-Secure branches, saving state to MSP_S with FNC_RETURN in LR.",
                    "Function pointers targeting Non-Secure memory must have bit 0 cleared to 0 in ARMv8-M.",
                    "Executing BLXNS with bit 0 set triggers an immediate SecureFault exception."
                ],
                "tryIt": "Test calling a Non-Secure callback with bit 0 set to 1 and observe the hardware SecureFault trigger.",
                "check": {
                    "question": "In ARMv8-M TrustZone, what does bit 0 = 0 signify in a function pointer passed to BLXNS?",
                    "options": [
                        "It indicates that the target function resides in the Non-Secure World.",
                        "It indicates that the target function is compiled with ARM32 instead of Thumb.",
                        "It indicates that the function requires administrator privileges.",
                        "It indicates that the function is stored in external SPI flash."
                    ],
                    "answer": 0,
                    "why": "In ARMv8-M, bit 0 of function pointers encodes target security: bit 0 = 0 targets Non-Secure code, while bit 0 = 1 targets Secure Thumb code."
                }
            },
            {
                "title": "TrustZone Inter-Domain Parameter Validation & TT Instructions",
                "say": p4_say,
                "example": "TT instructions query memory attribution in hardware, allowing cmse_check_address_range() to defeat confused deputy attacks where callers pass Secure pointers.",
                "code": p4_code,
                "output": p4_out,
                "codeNotes": [
                    "Confused deputy attacks occur when untrusted callers pass Secure pointers to privileged Secure services.",
                    "TT (Test Target) instructions query address security attribution and MPU permissions in hardware.",
                    "cmse_check_address_range() verifies that the caller owns all bytes in the passed buffer before access."
                ],
                "tryIt": "Simulate a confused deputy exploit targeting a Secure root key address and observe the TT validation rejection.",
                "check": {
                    "question": "How do Test Target (TT) instructions protect Secure services from confused deputy attacks?",
                    "options": [
                        "They allow the Secure service to verify that memory buffers passed by callers reside entirely within Non-Secure space.",
                        "They encrypt all data buffers using AES-GCM before copying.",
                        "They prevent the CPU from running at high clock frequencies during memory copies.",
                        "They automatically allocate new SRAM blocks for every incoming function call."
                    ],
                    "answer": 0,
                    "why": "TT instructions test memory attribution in hardware, ensuring Secure services never write into or read from Secure memory on behalf of Non-Secure callers."
                }
            },
            {
                "title": "ApexNSCGatewayEngine: Unified Secure IPC Subsystem",
                "say": p5_say,
                "example": "ApexNSCGatewayEngine unites SG veneer checking, TT pointer validation, hardware crypto delegation, and register scrubbing into a hardened inter-domain IPC pipeline.",
                "code": p5_code,
                "output": p5_out,
                "codeNotes": [
                    "ApexNSCGatewayEngine coordinates authorized veneer entry, TT buffer checks, and domain transitions.",
                    "Valid user buffers in Non-Secure SRAM are processed safely and returned with zero residue.",
                    "Unauthorized memory access attempts trap into fail-closed security rejections."
                ],
                "tryIt": "Execute a valid NSC encryption request and verify that the final domain safely returns to Non-Secure with scrubbed registers.",
                "check": {
                    "question": "What is the complete execution sequence of a secure inter-domain IPC call?",
                    "options": [
                        "Enter via SG veneer in NSC -> Validate pointers with TT -> Execute service -> Scrub registers -> Return via BXNS.",
                        "Branch directly to Secure Flash -> Execute service -> Disable MPU -> Reboot system.",
                        "Disable TrustZone -> Copy data to RAM -> Re-enable TrustZone -> Return.",
                        "Trigger a HardFault -> Recover in handler -> Read registers -> Resume."
                    ],
                    "answer": 0,
                    "why": "The secure IPC lifecycle mandates SG veneer entry, TT address validation, service execution, register scrubbing, and BXNS return."
                }
            }
        ],
        "summary": [
            "Non-Secure Callable (NSC) memory uses 8-byte SG veneers to authorize transitions from Non-Secure to Secure space.",
            "ARMv8-M calling conventions mandate register scrubbing before BXNS to eliminate context leakage of cryptographic secrets.",
            "Secure-to-Non-Secure callbacks use BLXNS with bit 0 = 0 function pointers and hardware FNC_RETURN stack preservation.",
            "Test Target (TT) instructions verify caller buffer attribution in hardware, eliminating confused deputy exploits.",
            "The ApexNSCGatewayEngine simulator demonstrates an impenetrable inter-domain IPC gateway pipeline."
        ],
        "projectStep": {
            "title": "Build & Validate Secure Inter-Process Communication Gateway",
            "steps": [
                "Implement an NSC veneer table simulator verifying SG instruction opcode authorization and INVEP fault traps.",
                "Construct a register scrubbing engine wiping scratch registers (R1-R3, R12, APSR) prior to BXNS returns.",
                "Develop a BLXNS callback dispatcher enforcing function pointer bit 0 = 0 and FNC_RETURN stack management.",
                "Build a TT instruction pointer validator verifying Non-Secure memory ownership and preventing confused deputy attacks.",
                "Integrate all modules into an ApexNSCGatewayEngine validating complete end-to-end secure cross-domain transactions."
            ]
        }
    }

if __name__ == "__main__":
    day14_data = make_long_lesson_day14()
    with open("scripts/iot_sec_day14.json", "w", encoding="utf-8") as f:
        json.dump(day14_data, f, indent=2)

    words = [sum(len(s.split()) for s in p["say"]) for p in day14_data["parts"]]
    print(f"Day 14 base generated successfully! Words per part: {words} (Total: {sum(words)}, Min: {min(words)})")
