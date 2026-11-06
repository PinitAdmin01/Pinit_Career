# scripts/generate_iot_sec_day33.py
import json

def build_day33():
    p1_say = [
        "Welcome to Day 33 of Course 19: Advanced IoT Hardware Security. On Days 31 and 32, we explored global fault injection vectors—voltage and clock glitching—which affect the entire microcontroller die simultaneously. Today, we advance to localized silicon fault injection: Electromagnetic Fault Injection (EMFI) and Laser Fault Injection (LFI).",
        "Global glitching techniques suffer from a major operational limitation: they lack spatial selectivity. When you drop VDD or shorten the system clock, every combinational path across the entire silicon die experiences timing stress. Often, unrelated peripherals (such as memory controllers or internal bus crossbars) crash or trigger brownout resets before the target security register can be flipped. EMFI and LFI solve this limitation by focusing energy into a microscopic point on the silicon die, allowing an attacker to manipulate a single transistor or flip-flop without disturbing the surrounding circuitry.",
        "To understand Laser Fault Injection (LFI), one must examine the photoelectric effect in semiconductors. Silicon has an indirect bandgap of approximately 1.12 electron-volts (eV) at room temperature. When a photon with energy greater than the bandgap strikes silicon, it excites an electron from the valence band to the conduction band, creating an electron-hole pair. If this carrier generation occurs within or near the depletion region of a reverse-biased PN junction (such as the drain of an 'OFF' NMOS transistor), the strong internal electric field sweeps the electrons toward the positive node and holes toward the substrate.",
        "This instantaneous drift of charge produces a transient photocurrent (I_photo). If the integrated charge exceeds the critical charge (Q_crit) of the storage node (typically just a few femtocoulombs in modern CMOS nodes), the node voltage discharges completely, transforming a logical '1' into a '0'. This phenomenon is known in aerospace and semiconductor engineering as a Single-Event Transient (SET) which latches into a Single-Event Upset (SEU).",
        "Electromagnetic Fault Injection (EMFI) operates via magnetic induction governed by Faraday's Law of Electromagnetic Induction: EMF = -dPhi / dt. An ultra-fast, high-voltage current pulse (hundreds of volts discharged in sub-nanosecond intervals) is driven through a microscopic copper coil placed micrometers above the chip surface. The resulting rapid time-varying magnetic field (B-field) penetrates the chip packaging, inducing localized eddy currents and transient voltage spikes across internal on-chip metal routing layers, corrupting logic signals directly on the bus lines.",
        "However, physical silicon access requires preparation. Standard microcontrollers are encapsulated in opaque epoxy molding compound. While EMFI can often penetrate thin plastic packages, LFI requires physical Silicon Decapsulation. Researchers use heated fuming nitric acid (HNO3) or mechanical milling to dissolve the epoxy resin, exposing the bare silicon die. For modern flip-chip ball grid array (BGA) packages where the active circuitry faces downward, backside thinning and polishing are performed using chemical mechanical polishing (CMP), and near-infrared (NIR) lasers (1064 nm wavelength) are employed because silicon is partially transparent to infrared light from the substrate side.",
        "In Part 1, we implement a physical perturbation model that evaluates photon absorption energy and EMFI-induced eddy current voltages across silicon metal traces."
    ]

    p1_code = """import struct

class PhysicalPerturbationPhysicsModel:
    def __init__(self):
        self.silicon_bandgap_ev = 1.12  # Silicon bandgap
        self.laser_wavelength_nm = 1064  # Infrared laser

    def calculate_laser_photon_energy(self) -> float:
        # E = hc / lambda -> 1240 / lambda_nm (eV)
        energy_ev = round(1240.0 / self.laser_wavelength_nm, 3)
        return energy_ev

    def evaluate_emfi_eddy_current(self, dI_dt_A_per_ns: float, coil_inductance_uH: float) -> float:
        # Induced EMF = -M * (dI/dt)
        # Induces transient voltage across on-chip metal tracks
        coupling_factor = 0.05
        induced_emf_v = round(coupling_factor * coil_inductance_uH * dI_dt_A_per_ns * 1000.0, 2)
        return induced_emf_v

model = PhysicalPerturbationPhysicsModel()
photon_ev = model.calculate_laser_photon_energy()
induced_v = model.evaluate_emfi_eddy_current(dI_dt_A_per_ns=15.0, coil_inductance_uH=0.8)

print(f"Silicon Bandgap: {model.silicon_bandgap_ev} eV")
print(f"1064nm IR Laser Photon Energy: {photon_ev} eV (Substrate Transparent)")
print(f"EMFI Induced Voltage Transient on Metal Track: {induced_v} V")
"""
    p1_output = """Silicon Bandgap: 1.12 eV
1064nm IR Laser Photon Energy: 1.165 eV (Substrate Transparent)
EMFI Induced Voltage Transient on Metal Track: 600.0 V
"""

    p2_say = [
        "Having mastered the semiconductor physics of optical carrier generation and inductive transients, we examine the laboratory equipment and spatial targeting mechanics: EMFI Coils and Motorized XY-Stages.",
        "An advanced EMFI injection station is an extraordinary feat of mechatronic and electrical engineering. At its core is a specialized microscopic injection probe. The probe tip consists of a micro-machined ferrite core or tungsten needle wrapped with several turns of microscopic copper wire, terminating in an aperture as small as 100 to 500 micrometers in diameter. Inside the EMFI pulse generator, a high-voltage capacitor (charged to 200V to 500V) is discharged across the coil using an avalanche transistor or ultra-fast MOSFET switch within 1 to 5 nanoseconds, producing a magnetic field gradient exceeding several Tesla per microsecond.",
        "To position this microscopic magnetic field over a specific functional block on the silicon die (such as the AES cryptographic accelerator, the SRAM memory array, or the secure boot configuration registers), the target microcontroller is mounted onto a motorized high-precision XYZ-translation stage. Industrial stages utilize linear optical encoders and stepper motors capable of sub-micrometer positioning resolution (typically 0.1 to 1.0 micrometer step size).",
        "During an automated penetration testing campaign, the stage traverses the surface of the chip in a raster scan pattern. At each (X, Y) coordinate, the station issues a trigger command synchronized to the microcontroller's execution. A high-voltage EM pulse is discharged, and the system monitors the device output over UART, JTAG, or GPIO pins. If the device outputs an unexpected cryptographic error, skips an authentication loop, or corrupts an encryption round, the coordinate is recorded as a sensitive fault location.",
        "The spatial resolution of EMFI is primarily governed by the diameter of the coil tip and the distance (Z-height) between the coil and the silicon surface. If the coil is positioned too high (e.g., > 1 mm), the magnetic flux spreads out, reducing localized flux density and acting like a noisy global glitch. Conversely, when the coil is positioned within 50 to 100 micrometers of the die surface, the induced eddy currents are tightly confined to an area of a few hundred micrometers, providing surgical targeting of individual register slices.",
        "In Part 2, we simulate an automated EMFI targeting station, demonstrating how spatial coordinates and pulse voltage levels dictate whether a targeted security register is successfully flipped, untouched, or missed entirely."
    ]

    p2_code = """import struct

class EMFITargetingStation:
    def __init__(self, step_size_um: float = 2.5):
        self.step_size_um = step_size_um
        self.critical_die_regions = {
            "AES_ACCELERATOR": (120, 340),
            "SECURITY_STATUS_REGISTER": (450, 180),
            "FLASH_CHARGE_PUMP": (800, 600)
        }

    def fire_emfi_pulse(self, x_um: int, y_um: int, pulse_voltage_v: float) -> str:
        for region, (rx, ry) in self.critical_die_regions.items():
            dist = ((x_um - rx)**2 + (y_um - ry)**2)**0.5
            if dist < 10.0:  # Probe tip radius of effect
                if pulse_voltage_v >= 250.0:
                    return f"BIT_FLIP_SUCCESSFUL in {region} (Distance: {dist:.1f}um)"
                else:
                    return f"INSUFFICIENT_ENERGY in {region} (Voltage too low)"
        return "MISS: Glitch occurred in non-sensitive silicon area"

station = EMFITargetingStation()
hit = station.fire_emfi_pulse(452, 181, pulse_voltage_v=300.0)
low_v = station.fire_emfi_pulse(452, 181, pulse_voltage_v=100.0)
miss = station.fire_emfi_pulse(50, 50, pulse_voltage_v=300.0)

print(f"EMFI Targeting (452, 181) @ 300V: {hit}")
print(f"EMFI Targeting (452, 181) @ 100V: {low_v}")
print(f"EMFI Targeting (50, 50) @ 300V: {miss}")
"""
    p2_output = """EMFI Targeting (452, 181) @ 300V: BIT_FLIP_SUCCESSFUL in SECURITY_STATUS_REGISTER (Distance: 2.2um)
EMFI Targeting (452, 181) @ 100V: INSUFFICIENT_ENERGY in SECURITY_STATUS_REGISTER (Voltage too low)
EMFI Targeting (50, 50) @ 300V: MISS: Glitch occurred in non-sensitive silicon area
"""

    p3_say = [
        "We now examine the microarchitectural exploit achieved through localized fault injection: Single-Event Upset (SEU) Register Bit-Flipping.",
        "In modern microcontrollers, hardware lifecycle states, debug access port (JTAG/SWD) locks, and secure boot verification modes are controlled by hardware configuration registers. For example, during power-on reset, the microcontroller reads security configuration bits from eFuse arrays and latches them into a high-speed volatile Security Control Register located in the System Control Block (SCB).",
        "Consider a 32-bit hardware register where Bit 0 represents 'SECURE_BOOT_LOCKED' (1 = Enforce signature checking, 0 = Open execution) and Bit 1 represents 'JTAG_DISABLED' (1 = JTAG disabled, 0 = JTAG enabled). Under normal operation, the manufacturer sets these bits to 1, locking the silicon. An attacker who only has software access cannot modify these bits because hardware write-protection logic blocks software writes once the boot sequence begins.",
        "However, with Laser Fault Injection or focused EMFI, the attacker bypasses all software protections. By focusing an infrared laser pulse onto the physical flip-flop transistors corresponding to Bit 0 and Bit 1, the incident laser photons generate electron-hole pairs that discharge the internal cross-coupled inverters holding the '1' state. Within picoseconds, the flip-flop flips from 1 to 0!",
        "The consequences are devastating: The secure boot verification logic immediately believes that secure boot is disabled, allowing unsigned or modified firmware to boot. Simultaneously, the silicon hardware re-enables the external JTAG/SWD debugging interface, granting the attacker interactive hardware breakpoint access to dump internal SRAM, extract cryptographic keys, and read non-volatile memory.",
        "Unlike global voltage or clock glitching, this surgical bit-flip was achieved without disrupting the CPU pipeline, without causing a memory bus error, and without tripping brownout monitors. The chip remains fully operational, completely unaware that its hardware security perimeters have been dismantled in silicon.",
        "In Part 3, we simulate this single-event upset on a hardware security register, demonstrating the selective clearing of secure boot and JTAG lockout bits via focused optical carrier injection."
    ]

    p3_code = """import struct

class SiliconRegisterFlipModel:
    def __init__(self):
        # 32-bit Security State Register:
        # Bit 0: SECURE_BOOT_LOCKED (1 = Locked, 0 = Unlocked)
        # Bit 1: JTAG_DISABLED (1 = Disabled, 0 = Enabled)
        self.security_register = 0x00000003  # Both locked and disabled

    def inject_laser_bitflip(self, target_bit: int, energy_uJ: float) -> str:
        if energy_uJ < 0.5:
            return "NO_EFFECT: Photocurrent below threshold"
        elif energy_uJ > 5.0:
            return "SILICON_DESTRUCTION: Laser burned metal track"
        
        # Single-Event Upset (SEU): Flip target bit from 1 to 0
        mask = 1 << target_bit
        if (self.security_register & mask) != 0:
            self.security_register &= ~mask
            return f"SEU_SUCCESS: Bit {target_bit} flipped 1 -> 0 (New Register: 0x{self.security_register:08X})"
        return f"NO_CHANGE: Bit {target_bit} already 0"

reg_model = SiliconRegisterFlipModel()
init_state = reg_model.security_register
res_flip = reg_model.inject_laser_bitflip(target_bit=0, energy_uJ=1.2)
jtag_flip = reg_model.inject_laser_bitflip(target_bit=1, energy_uJ=1.5)

print(f"Initial Security Register: 0x{init_state:08X}")
print(f"LFI Inject Bit 0 (SECURE_BOOT): {res_flip}")
print(f"LFI Inject Bit 1 (JTAG_LOCK): {jtag_flip}")
print(f"Final Compromised Register: 0x{reg_model.security_register:08X} (All Protections Disabled!)")
"""
    p3_output = """Initial Security Register: 0x00000003
LFI Inject Bit 0 (SECURE_BOOT): SEU_SUCCESS: Bit 0 flipped 1 -> 0 (New Register: 0x00000002)
LFI Inject Bit 1 (JTAG_LOCK): SEU_SUCCESS: Bit 1 flipped 1 -> 0 (New Register: 0x00000000)
Final Compromised Register: 0x00000000 (All Protections Disabled!)
"""

    p4_say = [
        "Having demonstrated how localized optical and electromagnetic faults flip security registers, we turn to defensive silicon engineering: Active Optical Shields and Substrate Monitors.",
        "How do high-assurance microcontrollers (such as Common Criteria EAL6+ banking chips, hardware security modules, and automotive security controllers) protect themselves against focused lasers and EM coils? The answer requires physical countermeasures implemented at the silicon layout level.",
        "The first line of defense is the Active Top-Metal Shield. In a standard semiconductor manufacturing process, the top metal layers (e.g., Metal 7 and Metal 8 in an 8-layer metal stack) are normally used for power distribution (VDD/VSS rails). In a secure microcontroller, these top metal layers are laid out as a dense, serpentine mesh covering the entire active surface of the silicon die. A pseudo-random digital bitstream generated by an on-chip cryptographic stream generator is continuously driven through this mesh. If an attacker uses a focused ion beam (FIB) or laser to cut or probe through the mesh to access underlying transistors, the bitstream is broken or shorted, triggering an instantaneous hardware zeroization alarm.",
        "The second line of defense is the On-Chip Photodiode and Light Detector Array. Because silicon dies are encapsulated in darkness, any light reaching the silicon indicates that the protective package has been decapsulated. Integrated silicon photodiodes and reverse-biased PN junctions distributed across the die continuously monitor for incident photons. Under normal dark conditions, these photodiodes conduct only a tiny leakage current known as 'dark current' (typically less than 100 nanoamperes).",
        "When an attacker shines an optical or near-infrared laser onto the die to induce an LFI fault, the incident photons generate a massive photocurrent surge (microamperes to milliamperes). High-speed analog comparators detect this photocurrent within sub-microsecond intervals. The comparator output directly trips an autonomous tamper latch that instantly zeroizes all SRAM key storage registers, blows emergency security fuses, and forces the CPU into a permanent unrecoverable lockdown.",
        "In Part 4, we implement the active optical shield and substrate current monitor, demonstrating how incident laser strikes are intercepted and neutralized before an adversary can manipulate cryptographic states."
    ]

    p4_code = """import hashlib

class ActiveOpticalShield:
    def __init__(self):
        self.top_metal_mesh_active = True
        self.photodiode_current_uA = 0.05  # Dark current
        self.threshold_current_uA = 2.0     # Laser trigger threshold
        self.tamper_tripped = False

    def monitor_substrate_photocurrent(self, incident_laser_uA: float) -> str:
        self.photodiode_current_uA = incident_laser_uA
        if self.photodiode_current_uA >= self.threshold_current_uA:
            self.tamper_tripped = True
            return "ALARM: Laser Photoelectric Current Detected -> SUB-MICROSECOND ZEROIZATION"
        return "NORMAL: Dark current within baseline"

shield = ActiveOpticalShield()
normal_status = shield.monitor_substrate_photocurrent(0.08)
laser_attack = shield.monitor_substrate_photocurrent(12.5)

print(f"Ambient Silicon State: {normal_status}")
print(f"LFI Strike Detection: {laser_attack}")
print(f"Active Optical Shield Tamper Tripped: {shield.tamper_tripped}")
"""
    p4_output = """Ambient Silicon State: NORMAL: Dark current within baseline
LFI Strike Detection: ALARM: Laser Photoelectric Current Detected -> SUB-MICROSECOND ZEROIZATION
Active Optical Shield Tamper Tripped: True
"""

    p5_say = [
        "To synthesize our exploration of EMFI and LFI physical fault injection, we construct the Spatial Vulnerability Heatmap Engine.",
        "In advanced hardware evaluation labs, security researchers generate Spatial Fault Sensitivity Maps (Heatmaps). By mounting a decapsulated chip on an automated XYZ translation stage, an automated test harness sweeps a focused laser spot or EM probe across a high-resolution grid (e.g., 100x100 points across a 2mm x 2mm silicon die). At each grid point, hundreds of fault injection attempts are executed while monitoring register integrity and CPU execution status.",
        "The SpatialFaultHeatmapEngine models this spatial evaluation across a target microcontroller die grid. Each coordinate is evaluated and classified into one of four distinct behavioral states: 1) Vulnerable (The fault induced a successful bit-flip or instruction skip without crashing the core); 2) Reset / Brownout (The fault induced substrate currents that tripped power supervisors, safely rebooting the chip); 3) Immune / No-Effect (The fault energy was insufficient or absorbed by shielding layers); and 4) Destructive (The laser energy burned metal traces).",
        "The security engineer's primary goal in physical hardening is eliminating all 'Vulnerable' coordinates from the heatmap. When vulnerable coordinates are identified (such as unprotected status register flip-flops), the engineering team deploys physical and architectural remediations: rerouting active top-metal shield meshes over the sensitive region, adding parity-checked flip-flops, and integrating localized substrate photocurrent sensors.",
        "By achieving 100% mitigation coverage where every attempt either triggers a protective reset or is absorbed by active shields, the platform earns high-assurance security certification, proving that the edge appliance is impervious to localized physical fault injection.",
        "In the runnable Python implementation below, the SpatialFaultHeatmapEngine executes a complete spatial scan, categorizing coordinate outcomes and verifying defensive coverage."
    ]

    p5_code = """import hashlib
import struct

class SpatialFaultHeatmapEngine:
    def __init__(self):
        # 4x4 Grid mapping of microcontroller die (X, Y)
        self.die_grid = {}
        for x in range(4):
            for y in range(4):
                self.die_grid[(x, y)] = "UNTESTED"

    def execute_spatial_scan(self):
        # Coordinates (1, 2) and (2, 2) contain vulnerable registers
        sensitive_coords = {(1, 2): "VULNERABLE_BIT_FLIP", (2, 2): "VULNERABLE_INSTRUCTION_SKIP"}
        for (x, y) in self.die_grid:
            if (x, y) in sensitive_coords:
                self.die_grid[(x, y)] = sensitive_coords[(x, y)]
            elif x == 3 or y == 3:
                self.die_grid[(x, y)] = "RESET_BROWNOUT"
            else:
                self.die_grid[(x, y)] = "NO_EFFECT"

    def generate_heatmap_summary(self):
        vuln_count = sum(1 for status in self.die_grid.values() if "VULNERABLE" in status)
        reset_count = sum(1 for status in self.die_grid.values() if "RESET" in status)
        safe_count = sum(1 for status in self.die_grid.values() if "NO_EFFECT" in status)
        return vuln_count, reset_count, safe_count

engine = SpatialFaultHeatmapEngine()
engine.execute_spatial_scan()
vuln, resets, safe = engine.generate_heatmap_summary()

print("Spatial Fault Sensitivity Scan Complete:")
print(f"  Vulnerable Exploitable Coordinates: {vuln} locations")
print(f"  Reset / Crash Coordinates: {resets} locations")
print(f"  Immune / No-Effect Coordinates: {safe} locations")
print("Target Security Hardening Plan: TOP_LAYER_ACTIVE_SHIELD_DEPLOYED")
"""
    p5_output = """Spatial Fault Sensitivity Scan Complete:
  Vulnerable Exploitable Coordinates: 2 locations
  Reset / Crash Coordinates: 7 locations
  Immune / No-Effect Coordinates: 7 locations
Target Security Hardening Plan: TOP_LAYER_ACTIVE_SHIELD_DEPLOYED
"""

    parts = [
        {
            "title": "Physics of EMFI & LFI: Eddy Currents, Photoelectric Carrier Generation & Silicon Decapsulation",
            "say": p1_say,
            "example": "Laser Photon Energy and EMFI-Induced Eddy Current Voltage Model",
            "code": p1_code,
            "output": p1_output,
            "codeNotes": [
                "Calculates photon energy for a 1064nm near-infrared laser relative to the silicon bandgap.",
                "Demonstrates that 1064nm IR photons penetrate the silicon substrate while generating electron-hole pairs.",
                "Models EMFI inductive coupling generating high-voltage transients on internal on-chip metal tracks."
            ],
            "tryIt": "Modify the laser wavelength to 532nm (visible green light) and observe how the photon energy increases to 2.33 eV.",
            "check": {
                "question": "Why is a 1064nm near-infrared laser commonly utilized for Laser Fault Injection through the backside of a silicon chip?",
                "options": [
                    "Silicon has an optical absorption bandgap of 1.12 eV; 1064nm light has photon energy of 1.165 eV, allowing it to penetrate through the substrate and excite carriers at active junctions.",
                    "1064nm light permanently evaporates the copper pins on the outside of the packaging.",
                    "Near-infrared light converts CMOS transistors into high-speed vacuum tubes.",
                    "1064nm laser light can only be generated using lithium-ion batteries."
                ],
                "answer": 0,
                "why": "1064nm infrared light penetrates silicon substrates with low absorption, focusing energy directly onto the active transistor junctions."
            }
        },
        {
            "title": "EMFI Coil Design & Pulse Generators: High-Voltage Transients, Nanosecond Discharge & XY-Stage Precision",
            "say": p2_say,
            "example": "High-Precision Motorized XY-Stage Targeting and Pulse Voltage Threshold Model",
            "code": p2_code,
            "output": p2_output,
            "codeNotes": [
                "Simulates a motorized XY-translation stage with micrometer-level spatial positioning.",
                "Evaluates the localized radius of effect and voltage threshold required to induce bit-flips.",
                "Shows that pulses below 250V or positioned outside the critical region fail to induce faults."
            ],
            "tryIt": "Change the target coordinates to (122, 342) and verify that the simulation registers a hit on the AES_ACCELERATOR.",
            "check": {
                "question": "What is the primary advantage of Electromagnetic Fault Injection (EMFI) over global voltage glitching?",
                "options": [
                    "EMFI provides high spatial selectivity, allowing targeted perturbation of specific functional blocks without crashing the entire microcontroller.",
                    "EMFI eliminates the need for electric power to the target microcontroller.",
                    "EMFI can be performed through ten feet of solid lead shielding.",
                    "EMFI permanently increases the flash memory storage capacity of the chip."
                ],
                "answer": 0,
                "why": "EMFI focuses magnetic flux into a micro-scale spot, enabling localized fault injection without inducing global brownout crashes."
            }
        },
        {
            "title": "Localized Register Bit-Flipping & Single-Event Transients (SET): Flipping Security Registers without Resetting Core",
            "say": p3_say,
            "example": "Selective Clearing of Secure Boot and JTAG Lockout Bits via Single-Event Upset",
            "code": p3_code,
            "output": p3_output,
            "codeNotes": [
                "Models a 32-bit hardware security state register latching eFuse security flags.",
                "Simulates a single-event upset flipping Bit 0 (SECURE_BOOT) and Bit 1 (JTAG_LOCK) from 1 to 0.",
                "Demonstrates complete privilege escalation without CPU reset or memory fault trap."
            ],
            "tryIt": "Set the laser energy to 0.2 uJ (below the 0.5 uJ threshold) and verify that no bit-flip occurs.",
            "check": {
                "question": "How does a Single-Event Upset (SEU) induced by laser fault injection subvert hardware security?",
                "options": [
                    "Photocurrents discharge the internal storage node of a flip-flop, flipping a security lock bit from 1 to 0 without crashing the processor.",
                    "The laser melts the silicon die into a liquid metal conductor.",
                    "The laser writes random software code into the un-erasable Boot ROM.",
                    "The laser causes the microcontroller to transmit its private keys over FM radio."
                ],
                "answer": 0,
                "why": "SEUs flip the logic state of individual volatile flip-flops, disabling hardware lockout registers while the CPU continues running."
            }
        },
        {
            "title": "Silicon-Level Defenses: Active Optical Shields, Substrate Current Monitors & Metal Top-Layer Meshes",
            "say": p4_say,
            "example": "Active Optical Shield Photodiode Sensor Detecting Laser Strikes and Triggering Zeroization",
            "code": p4_code,
            "output": p4_output,
            "codeNotes": [
                "Models integrated on-chip photodiode sensors monitoring substrate photocurrent.",
                "Differentiates between baseline dark current (0.05 uA) and laser-induced currents (12.5 uA).",
                "Triggers sub-microsecond hardware key zeroization when photocurrent exceeds safe thresholds."
            ],
            "tryIt": "Set the incident laser current to 1.5 uA (below the 2.0 uA threshold) and observe that the alarm remains untripped.",
            "check": {
                "question": "What is the primary function of an active top-metal shield mesh on a secure microcontroller die?",
                "options": [
                    "To carry a dynamic cryptographic bitstream that triggers immediate zeroization if laser or physical probes attempt to pierce the mesh.",
                    "To radiate high-frequency Wi-Fi signals to the user's smartphone.",
                    "To increase the optical reflectivity of the silicon package for cosmetic branding.",
                    "To act as a heat sink for the external quartz crystal oscillator."
                ],
                "answer": 0,
                "why": "Active top-metal meshes form a continuous electronic fence; cutting or shorting any track immediately trips zeroization alarms."
            }
        },
        {
            "title": "Production EMFI / LFI Laboratory Attack Simulator & Spatial Vulnerability Heatmap Engine",
            "say": p5_say,
            "example": "Automated Die-Grid Spatial Fault Sensitivity Heatmap and Hardening Assessment",
            "code": p5_code,
            "output": p5_output,
            "codeNotes": [
                "Scans a 4x4 silicon die grid to map spatial sensitivity across vulnerable, reset, and immune zones.",
                "Identifies exploitable coordinate locations that require physical and architectural hardening.",
                "Recommends targeted deployment of top-layer active shields to achieve 100% fault resilience."
            ],
            "tryIt": "Add coordinate (0, 0) as an additional sensitive coordinate and observe the updated heatmap summary counts.",
            "check": {
                "question": "What does a 'Vulnerable' coordinate indicate on a spatial fault sensitivity heatmap?",
                "options": [
                    "A location where an injected fault successfully bypassed a security check or flipped a register without crashing the device.",
                    "A location where the silicon package cracked under mechanical stress.",
                    "A location where the power supply voltage exceeded nominal specifications.",
                    "A location where the external antenna disconnected from the circuit board."
                ],
                "answer": 0,
                "why": "Vulnerable coordinates are exploitable sweet spots where faults alter logic state without triggering a reset or system crash."
            }
        }
    ]

    day33 = {
        "coursePrefix": "iot_sec",
        "day": 33,
        "title": "Electromagnetic Fault Injection (EMFI) & Laser Fault Injection (LFI): Localized Silicon Perturbation",
        "goal": "Master the advanced physics and laboratory execution of Electromagnetic Fault Injection (EMFI) and Laser Fault Injection (LFI), analyzing silicon decapsulation, localized single-event transients, register bit-flipping, and active silicon shields.",
        "minutes": 38,
        "recap": "On Days 31 and 32, we explored global voltage and clock glitches. Today on Day 33, we investigated localized physical fault injection using focused EM coils and near-infrared lasers to target individual silicon transistors.",
        "parts": parts,
        "summary": [
            "Analyzed the semiconductor physics of optical electron-hole pair generation and inductive eddy currents in silicon.",
            "Modeled high-precision motorized XY-translation stages and nanosecond high-voltage EMFI discharge probes.",
            "Demonstrated single-event upset register bit-flipping bypassing secure boot checks and JTAG lockouts.",
            "Evaluated silicon-level countermeasures including active top-metal shield meshes and photodiode light sensors.",
            "Generated spatial fault sensitivity heatmaps to identify and remediate vulnerable silicon regions."
        ],
        "projectStep": {
            "title": "Localized Fault Injection Modeling & Spatial Sensitivity Heatmap Analysis",
            "steps": [
                "Calculate laser photon absorption and EMFI-induced transient voltages across on-chip metal routing.",
                "Simulate micrometer-accurate XY-stage spatial targeting over critical cryptographic and security registers.",
                "Model single-event upset bit-flipping on a 32-bit hardware security state register to disable locks.",
                "Implement an active optical shield and substrate photodiode sensor triggering autonomous zeroization.",
                "Generate a die-wide spatial fault sensitivity heatmap and formulate a silicon hardening remediation plan."
            ]
        }
    }

    with open("scripts/iot_sec_day33.json", "w", encoding="utf-8") as f:
        json.dump(day33, f, indent=2)

    print("Generated scripts/iot_sec_day33.json successfully!")

if __name__ == "__main__":
    build_day33()
