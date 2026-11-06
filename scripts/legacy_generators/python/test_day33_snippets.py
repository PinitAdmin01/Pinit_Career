# scripts/test_day33_snippets.py
import sys
import hashlib
import struct

print("Testing Day 33 Python Snippets...")

# Snippet 1: EMFI Eddy Current & LFI Photoelectric Carrier Model
s1 = """import struct

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

# Snippet 2: EMFI XY-Coordinate Targeting & Pulse Generator Model
s2 = """import struct

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

# Snippet 3: Single-Event Transient (SET) to Single-Event Upset (SEU)
s3 = """import struct

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

# Snippet 4: Active Optical Shield & Substrate Current Sensor
s4 = """import hashlib

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

# Snippet 5: Production EMFI / LFI Spatial Vulnerability Heatmap Engine
s5 = """import hashlib
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

import subprocess
snippets = [s1, s2, s3, s4, s5]
for i, s in enumerate(snippets):
    res = subprocess.run([sys.executable, "-c", s], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Snippet {i+1} FAILED:\n{res.stderr}")
        sys.exit(1)
    print(f"Snippet {i+1} Output:\n{res.stdout}")

print("All 5 Day 33 snippets tested successfully!")
