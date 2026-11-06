# scripts/build_iot_sec_day43.py
import json
import subprocess
import sys

def build_day43():
    # Part 1 Code: CSP Inventory & Zeroization Latency Budget
    p1_code = '''# Day 43 Part 1: Critical Security Parameter (CSP) Inventory & Zeroization Latency Budget
import struct

class CSPLifecycleManager:
    """Tracks Critical Security Parameters (CSPs) across volatile storage domains and latency budgets."""
    def __init__(self):
        self.csp_table = [
            {'id': 'AES_ROOT_KEY_256', 'domain': 'BB_SRAM', 'size_bytes': 32, 'max_latency_ns': 50.0},
            {'id': 'HMAC_INTEGRITY_KEY', 'domain': 'BB_SRAM', 'size_bytes': 32, 'max_latency_ns': 50.0},
            {'id': 'ECC_P256_PRIVATE_KEY', 'domain': 'BB_SRAM', 'size_bytes': 32, 'max_latency_ns': 50.0},
            {'id': 'SESSION_EPHEMERAL_KEY', 'domain': 'SYSTEM_SRAM', 'size_bytes': 32, 'max_latency_ns': 500.0},
            {'id': 'TLS_MASTER_SECRET', 'domain': 'SYSTEM_SRAM', 'size_bytes': 48, 'max_latency_ns': 500.0}
        ]

    def audit_zeroization_budget(self) -> dict:
        total_csps = len(self.csp_table)
        total_bytes = sum(c['size_bytes'] for c in self.csp_table)
        bb_sram_csps = [c for c in self.csp_table if c['domain'] == 'BB_SRAM']
        min_budget_ns = min(c['max_latency_ns'] for c in self.csp_table)

        return {
            'total_csps_tracked': total_csps,
            'total_csp_bytes': total_bytes,
            'bb_sram_keys_count': len(bb_sram_csps),
            'fastest_latency_budget_ns': min_budget_ns,
            'fips_140_3_compliant': min_budget_ns <= 100.0
        }

if __name__ == '__main__':
    manager = CSPLifecycleManager()
    print("=== FIPS 140-3 Level 4 CSP Inventory & Zeroization Budget ===")
    res = manager.audit_zeroization_budget()
    print(f"Total CSPs Tracked   : {res['total_csps_tracked']} ({res['total_csp_bytes']} bytes)")
    print(f"BB-SRAM Direct Assets: {res['bb_sram_keys_count']} keys")
    print(f"Critical Trip Budget : {res['fastest_latency_budget_ns']} ns")
    print(f"FIPS Compliance Check: {'PASS (Level 4 Certified)' if res['fips_140_3_compliant'] else 'FAIL'}")
    for item in manager.csp_table:
        print(f"  - [{item['id']:22s}] Domain: {item['domain']:11s} | {item['size_bytes']:2d} B | Budget: {item['max_latency_ns']:5.1f} ns")
'''

    # Part 2 Code: BB-SRAM Power Multiplexer & Voltage Domain Isolation
    p2_code = '''# Day 43 Part 2: Battery-Backed SRAM (BB-SRAM) Dual-Power Multiplexer Simulation
import struct

class BBSRAMPowerMultiplexer:
    """Simulates automatic, glitch-free switching between primary V_DD and backup V_BAT."""
    def __init__(self, v_dd_nominal: float = 3.3, v_bat_nominal: float = 3.0, switch_threshold_v: float = 2.7):
        self.v_dd = v_dd_nominal
        self.v_bat = v_bat_nominal
        self.threshold = switch_threshold_v
        self.v_bb_sram = v_dd_nominal
        self.active_source = "PRIMARY_V_DD"

    def update_power_rails(self, current_v_dd: float, current_v_bat: float) -> dict:
        self.v_dd = current_v_dd
        self.v_bat = current_v_bat

        # Glitch-free power multiplexing logic (PMOS ideal diode controller)
        if self.v_dd >= self.threshold:
            self.v_bb_sram = self.v_dd
            self.active_source = "PRIMARY_V_DD"
        elif self.v_bat >= 1.8:
            self.v_bb_sram = self.v_bat
            self.active_source = "BACKUP_V_BAT"
        else:
            self.v_bb_sram = 0.0
            self.active_source = "UNPOWERED_COLLAPSED"

        return {
            'v_dd_input': round(self.v_dd, 3),
            'v_bat_input': round(self.v_bat, 3),
            'v_bb_sram_rail': round(self.v_bb_sram, 3),
            'active_power_source': self.active_source,
            'retention_guaranteed': (self.v_bb_sram >= 1.8)
        }

if __name__ == '__main__':
    pmux = BBSRAMPowerMultiplexer(v_dd_nominal=3.3, v_bat_nominal=3.0)
    print("=== Battery-Backed SRAM Dual-Power Multiplexer Simulation ===")
    test_transitions = [
        (3.30, 3.00),  # Full power operation
        (2.80, 3.00),  # Minor V_DD dip, still above threshold
        (2.20, 3.00),  # Main power disconnect cut, switch to V_BAT seamlessly
        (0.00, 2.95),  # Host completely unpowered, running off coin-cell backup
        (0.00, 1.20)   # Battery dead/depleted below retention limit
    ]
    for v_dd, v_bat in test_transitions:
        res = pmux.update_power_rails(v_dd, v_bat)
        print(f"V_DD: {res['v_dd_input']:4.2f} V | V_BAT: {res['v_bat_input']:4.2f} V -> BB_SRAM: {res['v_bb_sram_rail']:4.2f} V | Source: {res['active_power_source']:19s} | Retained: {res['retention_guaranteed']}")
'''

    # Part 3 Code: Crowbar Discharge Circuit & RC Nanosecond Timing
    p3_code = '''# Day 43 Part 3: BB-SRAM Hardware Crowbar Discharge Simulation & RC Time Constant
import math

class HardwareCrowbarDischargeCircuit:
    """Simulates active NMOS crowbar pulldown transistors discharging BB-SRAM bit storage nodes."""
    def __init__(self, r_nmos_on_ohms: float = 2.5, c_storage_cell_pf: float = 85.0):
        self.r_on = r_nmos_on_ohms  # Total channel resistance of parallel NMOS discharge network
        self.c_total = c_storage_cell_pf * 1e-12  # Total parasitic storage node capacitance
        self.tau_ns = (self.r_on * self.c_total) * 1e9  # RC time constant in nanoseconds

    def calculate_voltage_decay(self, initial_v: float, elapsed_time_ns: float) -> float:
        # V(t) = V_0 * exp(-t / (R * C))
        return initial_v * math.exp(-elapsed_time_ns / (self.tau_ns + 1e-15))

    def evaluate_discharge_curve(self, initial_voltage: float = 3.0) -> list[dict]:
        time_steps_ns = [0.0, 0.2, 0.5, 1.0, 2.0, 5.0]
        results = []
        v_safe_cutoff = 0.1  # When voltage drops below 100 mV, logic state is 100% erased
        for t in time_steps_ns:
            v_t = self.calculate_voltage_decay(initial_voltage, t)
            pct_erased = (1.0 - (v_t / initial_voltage)) * 100.0
            results.append({
                'time_ns': t,
                'voltage_v': round(v_t, 4),
                'percent_erased': round(pct_erased, 2),
                'state_destroyed': v_t < v_safe_cutoff
            })
        return results

if __name__ == '__main__':
    crowbar = HardwareCrowbarDischargeCircuit(r_nmos_on_ohms=2.0, c_storage_cell_pf=60.0)
    print("=== BB-SRAM Active NMOS Crowbar Discharge Profile ===")
    print(f"NMOS On-Resistance: {crowbar.r_on} Ohms | Node Capacitance: {crowbar.c_total*1e12:.1f} pF | RC Tau: {crowbar.tau_ns:.3f} ns")
    steps = crowbar.evaluate_discharge_curve(initial_voltage=3.0)
    for s in steps:
        print(f"Time: {s['time_ns']:4.1f} ns -> Node Voltage: {s['voltage_v']:6.4f} V | Erased: {s['percent_erased']:6.2f}% | Destroyed: {s['state_destroyed']}")
'''

    # Part 4 Code: Volatile Memory Scrubbing State Machine
    p4_code = '''# Day 43 Part 4: Volatile Memory Scrubbing State Machine & Hardware Pattern Overwrite
import struct

class MemoryScrubbingStateMachine:
    """Executes multi-pass deterministic pattern overwriting to neutralize memory remanence."""
    def __init__(self, memory_size_bytes: int = 128):
        self.mem_size = memory_size_bytes
        self.memory = [0xAA] * memory_size_bytes  # Initial mock cryptographic state
        self.passes_completed = 0
        self.state = "ARMED"

    def execute_pass(self, pattern_byte: int) -> dict:
        """Overwrites every byte with pattern_byte."""
        for i in range(self.mem_size):
            self.memory[i] = pattern_byte & 0xFF
        self.passes_completed += 1
        return {
            'pass_number': self.passes_completed,
            'pattern': hex(pattern_byte),
            'verified': all(b == pattern_byte for b in self.memory)
        }

    def execute_fips_scrub_sequence(self) -> list[dict]:
        # FIPS 140-3 3-pass sanitization: 0x00 -> 0xFF -> 0x00
        patterns = [0x00, 0xFF, 0x00]
        results = []
        for p in patterns:
            res = self.execute_pass(p)
            results.append(res)
        self.state = "SCRUBBED_SANITIZED"
        return results

if __name__ == '__main__':
    scrubber = MemoryScrubbingStateMachine(memory_size_bytes=64)
    print("=== Volatile Memory Scrubbing & Remanence Sanitization ===")
    print(f"Initial Memory State [0..4]: {[hex(b) for b in scrubber.memory[:4]]}...")
    scrub_log = scrubber.execute_fips_scrub_sequence()
    for entry in scrub_log:
        print(f"Pass {entry['pass_number']} -> Overwrite Pattern: {entry['pattern']:4s} | Verified: {entry['verified']}")
    print(f"Final Memory State  [0..4]: {[hex(b) for b in scrubber.memory[:4]]}...")
    print(f"Scrubber Controller Status: {scrubber.state}")
'''

    # Part 5 Code: TamperShield Master Zeroization Engine
    p5_code = '''# Day 43 Part 5: TamperShield Active Zeroization Engine & Forensic Erasure Audit
import struct

class HardwareCrowbarDischargeCircuit:
    def __init__(self, r_nmos_on_ohms: float = 2.0, c_storage_cell_pf: float = 60.0):
        self.tau_ns = (r_nmos_on_ohms * c_storage_cell_pf * 1e-12) * 1e9
    def calculate_voltage_decay(self, initial_v: float, elapsed_time_ns: float) -> float:
        import math
        return initial_v * math.exp(-elapsed_time_ns / (self.tau_ns + 1e-15))

class TamperShieldZeroizationEngine:
    """Master active zeroization engine orchestrating crowbar discharge, scrubbing, and eFuse lock."""
    def __init__(self, root_key_hex: str):
        self.root_key = list(bytes.fromhex(root_key_hex))
        self.bb_sram_voltage = 3.0
        self.crowbar = HardwareCrowbarDischargeCircuit()
        self.zeroized = False
        self.efuse_blown = False
        self.status = "SECURE_MONITORING"

    def execute_instantaneous_zeroization(self, trigger_source: str) -> dict:
        """Executes hardware crowbar pulldown and memory overwriting under 100 ns."""
        # Step 1: Fire hardware NMOS crowbar transistors (0.8 ns)
        self.bb_sram_voltage = self.crowbar.calculate_voltage_decay(self.bb_sram_voltage, elapsed_time_ns=1.5)
        
        # Step 2: Overwrite root key registers with 0x00
        self.root_key = [0x00] * len(self.root_key)
        self.zeroized = True

        # Step 3: Blow irrevocable security eFuses
        self.efuse_blown = True
        self.status = f"ZEROIZED_DUE_TO_{trigger_source}"

        return {
            'trigger_source': trigger_source,
            'bb_sram_residual_v': round(self.bb_sram_voltage, 5),
            'keys_zeroized': self.zeroized,
            'efuse_blown': self.efuse_blown,
            'active_key_preview': bytes(self.root_key[:4]).hex().upper(),
            'engine_status': self.status,
            'fips_compliant': (self.zeroized and self.bb_sram_voltage < 0.05)
        }

if __name__ == '__main__':
    test_key = "0123456789ABCDEF" * 4  # 32-byte AES root key
    engine = TamperShieldZeroizationEngine(test_key)
    print("=== TamperShield Active Zeroization Engine Benchmark ===")
    print(f"Armed Root Key Storage [0..4]: 0x{bytes(engine.root_key[:4]).hex().upper()}...")
    print(f"Pre-Trigger BB-SRAM Rail     : {engine.bb_sram_voltage:.2f} V")
    
    # Assert physical tamper event (e.g., active mesh breach)
    res = engine.execute_instantaneous_zeroization(trigger_source="ACTIVE_DIE_MESH_CUT")
    print("Zeroization Assertion Event  : " + str(res['trigger_source']))
    print(f"Crowbar Residual Voltage     : {res['bb_sram_residual_v']:.5f} V (Node Discharged to Ground)")
    print(f"Root Key Register State      : 0x{res['active_key_preview']}")
    print(f"Security eFuse State         : {'BLOWN (PERMANENT LOCK)' if res['efuse_blown'] else 'INTACT'}")
    print(f"Final Certification Status   : {'PASS (FIPS 140-3 Level 4 Certified)' if res['fips_compliant'] else 'FAIL'}")
'''

    snippets = [p1_code, p2_code, p3_code, p4_code, p5_code]
    outputs = []
    for idx, c in enumerate(snippets):
        res = subprocess.run(["python", "-c", c], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error executing Part {idx+1} code:")
            print(res.stderr)
            sys.exit(1)
        out = res.stdout.replace("\r\n", "\n").strip()
        outputs.append(out)
        print(f"Part {idx+1} code verified cleanly ({len(out)} chars output)")

    day43_lesson = {
        "coursePrefix": "iot_sec",
        "day": 43,
        "title": "Instantaneous Hardware Zeroization & BB-SRAM Key Erasure",
        "goal": "Design and simulate hardware key zeroization circuits, battery-backed SRAM (BB-SRAM) instantaneous crowbar discharge transistors, and volatile memory scrubbing state machines to guarantee sub-microsecond key destruction compliant with FIPS 140-3 Physical Security Level 4.",
        "minutes": 38,
        "recap": "Yesterday, in Day 42, we architected multi-sensor environmental tamper detection (PTAT thermal sensors, die decapsulation photodiodes, and voltage slew rate monitors). Today, in Day 43, we implement the irreversible response mechanism: instantaneous hardware zeroization of all Critical Security Parameters (CSPs) within tens of nanoseconds.",
        "parts": [
            {
                "title": "Critical Security Parameter (CSP) Lifecycles & FIPS 140-3 Zeroization Requirements",
                "say": [
                    "In physical hardware security engineering, the ultimate objective of all sensing, shielding, and monitoring mechanisms is the protection of Critical Security Parameters (CSPs). Defined formally by NIST in FIPS 140-3 (Security Requirements for Cryptographic Modules) and ISO/IEC 19790, a CSP is any security-related information whose compromise would completely undermine the confidentiality, integrity, or authenticity of the cryptographic system. Common CSPs include symmetric master keys (such as 256-bit AES root keys), asymmetric private keys (such as ECC secp256r1 or RSA-3072 signing keys), HMAC authentication keys, seed states for deterministic random bit generators (DRBGs), and authentication passwords or PINs.",
                    "FIPS 140-3 Physical Security Level 4 establishes the most rigorous physical protection standard in the world: it mandates that a cryptographic module must provide a completely enclosed, continuous 360-degree physical envelope that detects unauthorized physical penetration, environmental manipulation, or de-packaging from any direction. Furthermore, Section 7.9 mandates active zeroization: upon detecting any physical breach through the security envelope, the module must immediately, automatically, and irreversibly destroy all unprotected CSPs. The standard specifically forbids relying on passive unpowered decay; zeroization must be an active, driven physical process that renders all plaintext keys completely unrecoverable by any analytical physical or chemical laboratory technique.",
                    "To comply with these stringent mandates, security architects establish a rigorous zeroization latency budget. When an adversary attempts an invasive physical attack—such as drilling through an enclosure, cutting an active silicon mesh, or injecting a cryogenic freezing spray—there exists a microscopic temporal window Delta_t between the initial physical breach and the moment an attacker's probe establishes electrical contact with internal registers. If zeroization takes milliseconds, a fast automated microprobe could capture valid key data before erasure completes. Consequently, Level 4 certified hardware architectures mandate a maximum zeroization latency budget of less than 100 nanoseconds for primary root keys.",
                    "Achieving sub-100-nanosecond zeroization requires a clear segregation of storage domains across the silicon die. Cryptographic keys are categorized based on their volatility and operational lifecycle: persistent root keys (which must survive external power disconnection during factory transit and field servicing) are stored in dedicated Battery-Backed SRAM (BB-SRAM) cells or volatile register files powered by an ultra-low-power backup domain. Ephemeral session keys, working encryption states, and temporary hash digests are allocated in standard system SRAM.",
                    "When a physical tamper event is detected, the hardware supervisor dispatches parallel zeroization signals across both domains. The BB-SRAM domain utilizes high-current active crowbar pulldown transistors to discharge key storage cells directly to ground within 1 to 5 nanoseconds. Concurrently, the system SRAM controller launches an autonomous hardware DMA-like scrubbing sequence that overwrites general-purpose working buffers with multi-pass alternating bit patterns, ensuring comprehensive remanence neutralization across the entire chip.",
                    "In Common Criteria EAL6+ formal evaluations, security evaluators perform forensic post-zeroization imaging. Using conductive atomic force microscopy (C-AFM) and voltage-contrast scanning electron microscopy (VC-SEM), evaluators inspect the physical storage cells to verify whether any residual electrostatic charge remains on gate oxide dielectrics. Certified zeroization engines must achieve complete electrical neutralization: the residual voltage on all key storage nodes must drop below 50 millivolts within 2 nanoseconds, guaranteeing that quantum tunneling or memory remanence cannot reconstruct even a single bit of the master key.",
                    "Furthermore, FIPS 140-3 mandates that the zeroization mechanism must be self-enforcing across all operational operational states. Even if the microcontroller is halted in a low-power deep sleep mode, executing an unauthenticated firmware update, or suspended by an external debugger, the physical Emergency Zeroization Rail must possess un-maskable, absolute priority over all hardware execution units. The key lifecycle architecture models this with a non-recoverable set-dominant hardware state machine: once the transition from STATE_OPERATIONAL to STATE_ZEROIZED occurs, all clock gates to the cryptographic engines are permanently clamped low, and power to the cryptographic register file is locked to ground."
                ],
                "example": "An industrial bank vault cryptographic appliance detects an enclosure drill puncture. Under FIPS 140-3 Level 4 rules, the TamperShield supervisor triggers its Emergency Zeroization Rail: within 1.2 nanoseconds, the 256-bit master key storage cells are actively discharged to 0.005 V, permanently destroying the master authorization key before the drill bit penetrates the inner PCB cavity.",
                "code": p1_code,
                "output": outputs[0],
                "codeNotes": [
                    "CSPLifecycleManager catalogs Critical Security Parameters (CSPs) across Battery-Backed SRAM and System SRAM domains.",
                    "audit_zeroization_budget verifies that the fastest latency budget (50.0 ns) complies with FIPS 140-3 Level 4 active zeroization limits (<= 100 ns).",
                    "Demonstrates the classification and latency budget requirements governing hardware cryptographic key erasure."
                ],
                "tryIt": "Add a new CSP entry for 'POST_QUANTUM_ML_KEM_KEY' with a size of 1632 bytes and observe how the inventory tracker calculates total storage and latency constraints.",
                "check": {
                    "question": "What is the core requirement of active zeroization under FIPS 140-3 Physical Security Level 4?",
                    "options": [
                        "All unprotected Critical Security Parameters (CSPs) must be actively, automatically, and irreversibly destroyed within nanoseconds upon detecting any physical envelope breach",
                        "The device must send a warning email to the system administrator and wait for confirmation before wiping keys",
                        "Keys must be passively left to decay over several minutes after power is removed",
                        "The module must encrypt all keys with a hardcoded factory default password"
                    ],
                    "answer": 0,
                    "why": "FIPS 140-3 Level 4 mandates active, autonomous, and irreversible destruction of all plaintext CSPs immediately upon detecting physical penetration, preventing adversaries from recovering keys through physical or chemical extraction."
                }
            },
            {
                "title": "Battery-Backed SRAM (BB-SRAM) Physical Architecture & Power Multiplexing (V_BAT vs V_DD)",
                "say": [
                    "To maintain cryptographic sovereignty while resisting invasive extraction, modern hardware security modules, smart meters, and automotive domain controllers store root keys in specialized Battery-Backed SRAM (BB-SRAM). While non-volatile memory technologies (such as flash memory and EEPROM) retain data without electrical power, they store charge on isolated floating gates or in silicon nitride charge traps. This solid-state floating-gate charge can be imaged using scanning electron microscopy, magnetic force microscopy (MFM), or passive voltage contrast, even years after the chip is powered off. In stark contrast, volatile SRAM stores data purely as dynamic cross-coupled CMOS inverter states: once the electrical power is removed or discharged to ground, the physical information ceases to exist.",
                    "However, relying on volatile SRAM for root key persistence creates an engineering dilemma: the IoT device must maintain its root master keys during factory shipment, power outages, and battery swaps when the main external power supply (V_DD) is disconnected. To resolve this, secure microcontrollers incorporate an ultra-low-power backup power multiplexer (PMUX) that bridges the primary V_DD supply rail with an external primary lithium coin-cell battery or supercapacitor (V_BAT). The BB-SRAM block, along with the active tamper supervisor and real-time clock (RTC), resides in a physically and electrically isolated silicon power island known as the Battery Backup Domain (BBD).",
                    "The power multiplexer circuit must execute seamless, glitch-free transitions between V_DD and V_BAT. In classical power electronics, diode-OR circuits use Schottky diodes to combine power rails, but the diode forward voltage drop (0.3 V to 0.5 V) wastes significant battery energy and causes supply rail droop. In secure silicon design, the PMUX is constructed using low-on-resistance PMOS pass transistors controlled by high-speed analog voltage comparators, forming an active ideal-diode controller. When the primary V_DD rail is above a calibrated threshold (e.g., 2.7 V), the primary PMOS switch is fully enhanced, powering the BB-SRAM from V_DD with near-zero voltage drop while the backup battery remains completely unloaded.",
                    "When the external power supply is disconnected or dips below the threshold, the analog comparator detects the transition within 20 nanoseconds, turning off the primary PMOS switch and turning on the backup PMOS switch. To prevent intermediate voltage glitches that could corrupt volatile SRAM cell states during the switchover, the power island incorporates on-chip decoupling capacitors that hold the BB-SRAM supply rail steady during the transition. The entire Battery Backup Domain is designed using specialized ultra-low-leakage (ULL) high-threshold-voltage (HVT) transistors, drawing less than 150 nanoamperes of standby current at +25 deg C. This minute current consumption allows a standard CR2032 coin-cell battery to power the root keystore and tamper sensors for over 15 years in the field.",
                    "Crucially, the Battery Backup Domain is guarded by an internal power-isolation ring. Deep n-well silicon isolation barriers and guard rings encircle the BB-SRAM block, preventing substrate noise, over-voltage spikes, or ground-bounce transients on the main microcontroller core from coupling into the sensitive backup domain. If an adversary attempts to inject voltage glitches into external V_DD pins or ground lines, the isolated power multiplexer and substrate guard rings absorb the transients, maintaining unperturbed key storage integrity until a legitimate tamper trip occurs.",
                    "During security certification, evaluators test the power multiplexer against rapid power-cycling attacks. Evaluators pulse the primary V_DD rail between 0 V and 3.3 V at frequencies up to 10 MHz while monitoring the internal BB-SRAM rail on a picosecond oscilloscope. The multiplexer must demonstrate zero cross-conduction (preventing reverse-charging of the primary lithium cell) and zero voltage undershoot below 1.8 V, guaranteeing that power fluctuations cannot induce accidental key corruption or create unmonitored brownout vulnerabilities."
                ],
                "example": "An industrial smart grid gateway is unplugged from its 24V substation supply for transport. The PMUX detects V_DD dropping below 2.7V and transfers the BB-SRAM domain to the internal 3.0V lithium coin cell in 18 nanoseconds. The keystore draws only 120 nA, preserving the 256-bit grid master keys across the 3-day transit window without a single bit corruption.",
                "code": p2_code,
                "output": outputs[1],
                "codeNotes": [
                    "BBSRAMPowerMultiplexer simulates an active PMOS ideal-diode controller switching between primary V_DD (3.3V) and backup V_BAT (3.0V).",
                    "update_power_rails ensures glitch-free power transitions, maintaining the BB-SRAM rail above the 1.8V minimum data retention threshold.",
                    "Demonstrates ultra-low-leakage power isolation that enables multi-year volatile key retention on coin-cell backup power."
                ],
                "tryIt": "Set current_v_dd = 2.0 and current_v_bat = 3.0 to observe how the controller automatically engages the BACKUP_V_BAT source when primary power drops.",
                "check": {
                    "question": "Why is Battery-Backed SRAM (BB-SRAM) preferred over non-volatile flash memory for high-security root key storage?",
                    "options": [
                        "Volatile SRAM stores data purely as dynamic cross-coupled inverter states that can be actively and completely discharged to ground in nanoseconds, leaving zero physical charge remanence",
                        "Flash memory consumes too much electricity to run on household mains power",
                        "SRAM can store infinitely large files up to several terabytes",
                        "Non-volatile flash memory is impossible to program in a factory"
                    ],
                    "answer": 0,
                    "why": "Non-volatile flash stores charge on floating gates that can be physically imaged with electron microscopy even after power-off, whereas volatile SRAM stores data as dynamic inverter voltages that vanish completely when discharged to ground."
                }
            },
            {
                "title": "Crowbar Discharge Circuits: Gate-Driven NMOS Pulldown Transistors & Charge Dissipation Timing",
                "say": [
                    "When a verified physical tamper event occurs, the hardware supervisor must destroy the root keys stored in Battery-Backed SRAM with maximum speed and complete physical certainty. Relying on simply disconnecting the power multiplexer is entirely insufficient: as established in Day 42's analysis of cold-boot memory remanence, an unpowered SRAM cell retains its logical state for milliseconds at room temperature, and for minutes under cryogenic cooling. To achieve instant, irreversible key destruction, the silicon architecture incorporates active hardware crowbar discharge circuits.",
                    "A hardware crowbar circuit is an analog pulldown switching network connected directly across the power rails and internal storage nodes of the BB-SRAM block. In high-security cryptoprocessors, each individual 6T (six-transistor) SRAM cell is augmented with dedicated NMOS pulldown discharge transistors. Under nominal operating conditions, the gates of these crowbar transistors are held firmly at 0 V by a continuous active-low pulldown bias, maintaining an ultra-high off-state impedance (exceeding gigohms) that draws zero measurable leakage current from the backup battery.",
                    "When the Emergency Zeroization Rail (EZR) or active die mesh asserts a tamper event, a high-speed driver injects an instantaneous positive gate pulse (V_gate = V_BAT or boosted by a local charge pump) into the crowbar transistors. The NMOS transistors transition from their off-state into the deep linear (triode) conduction region within fractions of a nanosecond, presenting a low channel on-resistance R_on of only 1 to 3 Ohms across the entire storage matrix. Simultaneously, an upstream PMOS disconnect switch cuts the connection to the backup battery, isolating the battery from the crowbar short circuit.",
                    "The electrical discharge dynamics of the storage cell are governed by the classic RC time constant: Tau = R_on * C_cell, where C_cell is the total parasitic capacitance of the cross-coupled inverter gates and bitlines (typically 50 to 100 picofarads across the entire 256-bit key register). With an aggregate NMOS on-resistance of 2.0 Ohms and a total capacitance of 60 picofarads, the discharge time constant Tau is an astonishingly fast 0.12 nanoseconds (120 picoseconds). The voltage across the storage nodes decays exponentially: V(t) = V_0 * exp(-t / Tau).",
                    "Within five time constants (5 * Tau = 0.6 nanoseconds), the storage node voltage drops to less than 1% of its initial operating value (falling below 30 millivolts). At this microscopic potential, the cross-coupled inverters lose all bistable regenerative feedback: both internal nodes (Q and Q_bar) collapse to zero volts, destroying the trapped electrostatic charge completely. Even if an attacker places the silicon die under a high-vacuum focused ion beam probe station within nanoseconds of the breach, the storage nodes contain only electrical ground, rendering key extraction physically impossible.",
                    "To guarantee that the crowbar circuit operates reliably even if the primary battery wire has been clipped or shorted by an intruder, the crowbar gate drivers are powered by an on-chip energy reservoir constructed from deep-trench capacitors (DTC) or metal-insulator-metal (MIM) capacitors. This local capacitor stores sufficient charge to hold the crowbar NMOS gates fully turned on for over 500 microseconds—thousands of times longer than the sub-nanosecond duration required to discharge the SRAM cells—ensuring foolproof execution under all physical tampering conditions.",
                    "From a high-frequency RF perspective, discharging 60 picofarads within fractions of a nanosecond introduces a rapid current transient: di / dt = C * (d^2 V / dt^2). This fast current surge can generate inductive voltage spikes (L * di/dt) across internal power distribution traces and parasitic bond wires. If left unmitigated, inductive ringing could cause the storage node voltage to bounce back above the CMOS switching threshold, temporarily restoring partial state in the cross-coupled inverters. To prevent inductive bounce, crowbar routing employs distributed multi-finger NMOS arrays with integrated damping resistors, ensuring an overdamped RLC discharge transient that drives nodes monotonically to ground with zero voltage overshoot."
                ],
                "example": "An attacker uses a focused ion beam to sever the Metal 7 shield over the crypto core. The active mesh comparator asserts the EZR line in 3 nanoseconds. The crowbar NMOS driver pulses the pulldown gates: the 3.0V BB-SRAM storage nodes collapse to 0.02V within 0.8 nanoseconds, discharging all 256 key bits to ground before the ion beam penetrates the underlying oxide.",
                "code": p3_code,
                "output": outputs[2],
                "codeNotes": [
                    "HardwareCrowbarDischargeCircuit models active NMOS pulldown transistors discharging BB-SRAM storage node capacitance (60 pF).",
                    "calculate_voltage_decay evaluates exponential RC discharge: V(t) = V_0 * exp(-t / Tau), where Tau is ~0.12 ns.",
                    "Demonstrates that within 1.0 ns, storage voltage drops below 100 mV, achieving 100% destruction of logical state."
                ],
                "tryIt": "Increase r_nmos_on_ohms to 10.0 Ohms to model a higher-resistance discharge network, and verify that the circuit still achieves complete erasure in less than 5 nanoseconds.",
                "check": {
                    "question": "What is the primary function of active NMOS crowbar transistors in a BB-SRAM zeroization circuit?",
                    "options": [
                        "To actively and instantaneously short the SRAM storage nodes and power rail to electrical ground within sub-nanoseconds, discharging all trapped electrostatic charge",
                        "To encrypt the keys using AES-256 before the battery dies",
                        "To transmit a wireless alarm beacon to the manufacturer",
                        "To recharge the backup coin-cell battery during power outages"
                    ],
                    "answer": 0,
                    "why": "Active crowbar transistors provide a low-resistance path to ground that actively collapses the cross-coupled inverter storage nodes in sub-nanoseconds, guaranteeing complete charge dissipation."
                }
            },
            {
                "title": "Volatile Memory Scrubbing State Machines: Hardware Pattern Overwriting & Memory Remanence Neutralization",
                "say": [
                    "While primary cryptographic root keys are destroyed within nanoseconds by hardware crowbar discharge circuits, large volatile memory regions—such as the microcontroller's 512 KB system SRAM, hardware crypto-coprocessor register files, and cache memories—require systematic, multi-pass hardware memory scrubbing. During normal cryptographic execution, intermediate round keys, expanded AES state matrices, private blinding factors, and decrypted data buffers are scattered across working memory. If an attacker freezes the device and extracts the chip, these residual memory footprints could allow partial key reconstruction.",
                    "To neutralize memory remanence across large volatile storage arrays, high-assurance security controllers incorporate an autonomous, hardwired Memory Scrubbing State Machine (MSSM). Unlike software-based zeroing loops (e.g., standard C memset functions, which can be interrupted, optimized away by the compiler, or suppressed by CPU glitching), the MSSM is an independent hardware engine with direct, high-bandwidth master access to the internal memory bus matrix. Once triggered, the MSSM locks the system bus arbiter, preventing the CPU or any DMA peripheral from halting or altering the sanitization sequence.",
                    "The scrubbing sequence executes a deterministic multi-pass sanitization protocol compliant with DoD 5220.22-M and NIST SP 800-88 (Guidelines for Media Sanitization). A single pass of all-zeros (0x00) is often insufficient to defeat advanced physical forensic extraction techniques such as Kelvin probe force microscopy (KPFM). KPFM can detect microscopic surface potential variations (on the order of microvolts) caused by trapped oxide charges that accumulate in the gate dielectrics of transistors that remained in a static '1' state for prolonged operating periods (the 'burn-in' or 'remanence imprint' effect).",
                    "To eliminate this imprint effect, the MSSM executes a three-pass alternating pattern sequence: Pass 1 overwrites every memory word with an all-zeros pattern (0x00000000); Pass 2 immediately overwrites all words with an inverted all-ones pattern (0xFFFFFFFF), forcing every PMOS and NMOS transistor in every storage cell to flip state and discharge trapped charges; Pass 3 writes a final zeroing pattern (0x00000000) or cryptographically random bitstream generated by the on-chip True Random Number Generator (TRNG).",
                    "The hardware scrubber utilizes wide 128-bit or 256-bit internal memory bus channels, scrubbing multiple memory banks in parallel. At a core clock frequency of 200 MHz, a 256-bit bus writes 32 bytes per clock cycle, sanitizing a full 512 KB SRAM array in less than 50 microseconds. Upon completing the final pass, the scrubbing state machine executes an automated read-verify sweep: it reads back all addresses and compares them against the expected pattern. If any memory bit fails to verify (indicating a hardware fault or adversary attempting to freeze specific memory lines with external probe clamps), the scrubber asserts a permanent fatal fault flag, preventing the chip from ever booting again.",
                    "In certified industrial devices, the memory scrubber is also utilized during runtime security transitions. Whenever a cryptographic session terminates, or an IoT application transitions from a high-privilege secure enclave (e.g., Arm TrustZone Secure World) back to an untrusted environment (Non-Secure World), the hardware scrubber automatically sanitizes all shared register files and intermediate stack buffers. This ensures that sensitive cryptographic residuals are eliminated long before an attacker can inspect unprivileged memory spaces.",
                    "To prevent side-channel leakage during the scrubbing process itself, the Memory Scrubbing State Machine is engineered with power-balanced write buffers. When clearing hundreds of kilobytes of memory, writing all-zero or all-one patterns generates large current steps on internal power grids. An attacker monitoring power rails with a near-field electromagnetic probe could analyze the scrubbing waveform to determine how many bits were originally set to '1' versus '0' in the target buffer (a Hamming weight leakage attack). The MSSM counters this by interweaving pseudo-random dummy writes and utilizing balanced complementary write drivers, flattening the current profile and masking the original contents from differential side-channel analysis."
                ],
                "example": "An industrial IoT gateway finishes authenticating a remote TLS 1.3 firmware update. As the connection closes, the hardware MSSM fires: across 3 clock cycles per bank, it overwrites the 64 KB cryptographic working buffer with 0x00, 0xFF, and 0x00, permanently eliminating all intermediate ECDSA ephemeral keys from SRAM.",
                "code": p4_code,
                "output": outputs[3],
                "codeNotes": [
                    "MemoryScrubbingStateMachine implements a hardware-driven 3-pass sanitization sequence (0x00 -> 0xFF -> 0x00) compliant with NIST SP 800-88.",
                    "execute_fips_scrub_sequence sanitizes memory and performs automated bitwise verification across all addresses.",
                    "Demonstrates the elimination of trapped oxide charges and memory remanence footprints across volatile memory."
                ],
                "tryIt": "Modify the pattern list to include an on-chip TRNG random pattern pass, and verify that the scrubber successfully executes and verifies the sequence.",
                "check": {
                    "question": "Why does the NIST SP 800-88 memory scrubbing standard mandate multi-pass alternating bit patterns (0x00 -> 0xFF -> 0x00) rather than a single all-zero pass?",
                    "options": [
                        "To force all transistors in every memory cell to flip state, neutralizing trapped oxide charges and physical surface potential imprints that could be imaged using Kelvin probe force microscopy",
                        "Because computer memory can only store the number 255 (0xFF)",
                        "To clean physical dust particles off the silicon wafer surface",
                        "To allow the CPU to continue running programs while memory is being erased"
                    ],
                    "answer": 0,
                    "why": "Transistors that remain in a static state for long periods develop subtle dielectric charge imprints. Alternating between 0x00 and 0xFF forces all gates to transition, completely neutralizing physical voltage contrast remanence."
                }
            },
            {
                "title": "TamperShield Active Zeroization Engine: Microsecond Bench Verification & Forensic Erasure Audit",
                "say": [
                    "The physical security architecture of Course 19 reaches its defensive apex in the TamperShield Active Zeroization Engine. This master hardware subsystem unifies all sensing and destruction primitives into a cohesive, fail-secure, and certifiably unbypassable physical defense engine. When an adversary mounts a multi-vector physical assault—such as simultaneous liquid nitrogen freezing, package de-encapsulation, and power severance—the TamperShield engine coordinates the simultaneous execution of active crowbar pulldowns, memory scrubbing, and irreversible silicon lockdown.",
                    "The operational sequence of the TamperShield engine is structured into three deterministic, sub-microsecond phases: Phase 1 (Instantaneous Crowbar Zeroization, t < 5 ns): Within nanoseconds of the Emergency Zeroization Rail asserting, dedicated on-chip NMOS crowbar transistors dump the volatile BB-SRAM root key nodes to ground. The backup battery multiplexer is simultaneously isolated, ensuring that residual energy in the coin cell cannot recharge the storage nodes. Phase 2 (Irreversible Silicon Lockdown, t < 50 ns): The engine activates an internal high-voltage charge pump that drives a high-current programming pulse through dedicated polysilicon security eFuses. Blowing these eFuses permanently disables JTAG and SWD debug ports, severs internal test multiplexers, and sets a permanent HARDWARE_COMPROMISED status flag in non-volatile silicon logic.",
                    "Phase 3 (Multi-Bank System SRAM Sanitization, t < 50 us): While the CPU is halted and locked in permanent reset, the autonomous hardware Memory Scrubbing State Machine sweeps across all internal system memory banks, coprocessor registers, and peripheral buffers, executing the multi-pass 0x00/0xFF/0x00 remanence neutralization sequence. Phase 4 (Forensic Telemetry Latching, t < 100 us): An immutable, write-once physical incident record is captured in an isolated battery-backed diagnostic register. This record logs the specific tamper sensor that triggered the event, the exact timestamp from the monotonic hardware counter, the power rail voltages, and the core operating frequency at the instant of intrusion.",
                    "Once the TamperShield engine completes zeroization, the microcontroller is permanently locked in an unrecoverable 'bricked' state. The chip will never boot again, will reject all external debug probes, and contains zero plaintext or encrypted cryptographic keys. In enterprise IoT fleet management and industrial infrastructure, this self-destruction property guarantees that stolen, discarded, or reverse-engineered field devices can never be exploited to compromise the broader cryptographic ecosystem. If an attacker steals a single smart grid terminal or payment sensor, the physical theft results only in the loss of that individual hardware node, while the master industrial PKI infrastructure remains completely intact.",
                    "To achieve FIPS 140-3 Physical Security Level 4 and Common Criteria EAL6+ certification, the TamperShield engine undergoes destructive physical evaluation by accredited third-party test laboratories. Evaluators utilize high-speed digital storage oscilloscopes, infrared thermography cameras, and focused ion beam workstations to verify that zeroization occurs deterministically across all process, voltage, and temperature (PVT) corners. In today's benchmark simulation, we will verify the complete execution of the TamperShield engine, confirming that crowbar discharge and key erasure occur well within the certified sub-100-nanosecond latency window.",
                    "Crucially, the TamperShield engine features anti-probing voltage-clamp feedback loops on all internal zeroization assertion lines. If an attacker drills a microscopic hole and places a focused ion beam probe needle directly onto the crowbar trigger line in an attempt to hold it permanently grounded (suppressing zeroization), an on-chip continuous current-comparator detects the abnormal resistive load. The comparator interprets the probe contact as an active tamper intrusion and immediately asserts redundant internal pyrotechnic fuse circuits and localized high-voltage SCR (silicon-controlled rectifier) crowbars, ensuring that probe interference cannot inhibit key destruction.",
                    "In mission-critical industrial installations—such as smart electrical grid protection relays, nuclear facility access controllers, and offshore pipeline monitors—this autonomous physical zeroization architecture guarantees uncompromised cryptographic integrity. Even if physical hardware falls into the hands of sophisticated nation-state reverse-engineering laboratories, the active hardware zeroization engine ensures that the stolen silicon yields only an inert, completely erased artifact, safeguarding the broader industrial operational network against compromise."
                ],
                "example": "An attacker breaks open a railway signaling controller box and attempts to probe the internal cryptographic coprocessor. The TamperShield engine detects active mesh line severance: Phase 1 discharges BB-SRAM to 0.003V in 1.5 ns; Phase 2 blows the JTAG eFuses; Phase 3 scrubs all 512KB of SRAM. The attacker is left with an unresponsive, completely neutralized silicon chip.",
                "code": p5_code,
                "output": outputs[4],
                "codeNotes": [
                    "TamperShieldZeroizationEngine orchestrates the complete 3-phase hardware zeroization protocol upon verified physical intrusion.",
                    "execute_instantaneous_zeroization achieves sub-nanosecond crowbar discharge, register overwriting, and irrevocable eFuse blowing.",
                    "Demonstrates full FIPS 140-3 Level 4 physical security compliance: BB-SRAM voltage drops below 0.05 V and keys are 100% destroyed."
                ],
                "tryIt": "Execute zeroization with trigger_source='CRYO_TEMPERATURE_BREACH' and observe the resulting forensic status log and residual voltage telemetry.",
                "check": {
                    "question": "What is the consequence of the TamperShield engine blowing security eFuses during physical zeroization?",
                    "options": [
                        "It permanently and irreversibly disables all JTAG/SWD debug ports and test interfaces in hardware, ensuring the compromised chip can never be rebooted or read out",
                        "It causes the chip to physically melt and catch fire",
                        "It resets the device to factory default settings with password 'admin'",
                        "It downloads a replacement firmware image from the public cloud"
                    ],
                    "answer": 0,
                    "why": "Blowing on-chip security eFuses physically severs electrical connections to JTAG/SWD debug logic and test multiplexers, permanently locking the device into an unbootable state that cannot be reversed by software or firmware reloading."
                }
            }
        ],
        "summary": [
            "Critical Security Parameters (CSPs) must be actively destroyed under FIPS 140-3 Level 4 within strict latency budgets (< 100 ns) upon detecting envelope penetration.",
            "Battery-Backed SRAM (BB-SRAM) stores root keys in volatile cross-coupled inverters powered by an ultra-low-leakage (< 150 nA) dual-rail power multiplexer (V_DD vs V_BAT).",
            "Active hardware NMOS crowbar discharge circuits short storage nodes to electrical ground within sub-nanoseconds, collapsing trapped charges with an RC time constant ~0.12 ns.",
            "Hardware Memory Scrubbing State Machines (MSSM) execute 3-pass sanitization (0x00 -> 0xFF -> 0x00) to eliminate dielectric trapped charges and memory remanence footprints.",
            "The TamperShield Active Zeroization Engine unifies crowbar discharge, irrevocable eFuse blowing, and volatile memory scrubbing to enforce absolute physical cryptographic sovereignty."
        ],
        "projectStep": {
            "title": "Milestone 9 Architecture: Implement Battery-Backed SRAM Crowbar & Memory Zeroization Engine",
            "steps": [
                "Configure the Critical Security Parameter (CSP) inventory and latency budget table for 256-bit AES root and ECC private keys.",
                "Implement the BB-SRAM dual-power multiplexer model to support seamless transitions between V_DD and backup V_BAT coin-cell power.",
                "Simulate the active NMOS crowbar pulldown discharge circuit to achieve node collapse to < 50 mV within 2 nanoseconds.",
                "Integrate the multi-pass memory scrubbing state machine to sanitize volatile SRAM and blow permanent security lockout eFuses."
            ]
        }
    }

    wcs = [len(" ".join(p["say"]).split()) for p in day43_lesson["parts"]]
    print(f"Day 43 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_sec_day43.json", "w", encoding="utf-8") as f:
        json.dump(day43_lesson, f, indent=2)

    print("Successfully built scripts/iot_sec_day43.json!")

if __name__ == "__main__":
    build_day43()
