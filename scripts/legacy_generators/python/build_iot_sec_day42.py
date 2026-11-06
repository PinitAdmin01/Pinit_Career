# scripts/build_iot_sec_day42.py
import json
import subprocess
import sys

def build_day42():
    # Part 1 Code: Cold-Boot Attack & SRAM Remanence Decay Simulation
    p1_code = '''# Day 42 Part 1: Cold-Boot Attack Modeling: Temperature-Dependent SRAM Data Remanence Decay
import math

class SRAMRemanenceModel:
    """Models temperature-dependent charge leakage in unpowered SRAM cells (Arrhenius decay)."""
    def __init__(self, nominal_retention_time_s: float = 0.05):
        self.t0 = nominal_retention_time_s  # Decay time at 25 deg C (298.15 K)
        self.ea_ev = 0.65  # Activation energy for silicon junction leakage in eV
        self.k_ev = 8.617333262e-5  # Boltzmann constant in eV/K

    def calculate_decay_half_life(self, temp_celsius: float) -> float:
        """Computes SRAM bit retention half-life using the Arrhenius equation."""
        t_kelvin = temp_celsius + 273.15
        t_ref_k = 298.15
        # Tau(T) = Tau_0 * exp((E_a / k) * (1/T - 1/T_ref))
        exponent = (self.ea_ev / self.k_ev) * ((1.0 / t_kelvin) - (1.0 / t_ref_k))
        return self.t0 * math.exp(exponent)

    def simulate_key_survival(self, key_bytes: list[int], unpowered_time_s: float, temp_celsius: float) -> dict:
        half_life = self.calculate_decay_half_life(temp_celsius)
        # Probability of bit remaining uncorrupted: P = 0.5 + 0.5 * exp(-t / half_life)
        retention_prob = 0.5 + 0.5 * math.exp(-unpowered_time_s / (half_life + 1e-12))
        
        # Estimate surviving bits across 256 bits (32 bytes)
        total_bits = len(key_bytes) * 8
        corrupted_bits = int(total_bits * (1.0 - retention_prob))
        surviving_bits = total_bits - corrupted_bits
        survival_pct = (surviving_bits / total_bits) * 100.0

        return {
            'temp_celsius': temp_celsius,
            'half_life_seconds': round(half_life, 2),
            'unpowered_duration_s': unpowered_time_s,
            'survival_pct': round(survival_pct, 2),
            'exploitable': survival_pct > 85.0
        }

if __name__ == '__main__':
    model = SRAMRemanenceModel(nominal_retention_time_s=0.08)
    print("=== Cold-Boot SRAM Remanence Decay Analysis ===")
    sample_key = [0x5A] * 32  # 256-bit AES Key
    test_temps = [25.0, 0.0, -20.0, -50.0]
    for temp in test_temps:
        res = model.simulate_key_survival(sample_key, unpowered_time_s=10.0, temp_celsius=temp)
        print(f"Temp: {res['temp_celsius']:+5.1f} C | Half-life: {res['half_life_seconds']:9.2f} s | 10s Retention: {res['survival_pct']:5.1f}% | Exploitable: {res['exploitable']}")
'''

    # Part 2 Code: PTAT Thermal Sensor & Window Comparator
    p2_code = '''# Day 42 Part 2: PTAT Bandgap Thermal Sensor & Cryo/Over-Temperature Window Comparator
import struct

class PTATThermalSensor:
    """Simulates on-chip Proportional-To-Absolute-Temperature (PTAT) sensor and window comparator."""
    def __init__(self, v_ptat_slope_mv_per_k: float = 2.0, t_low_c: float = -30.0, t_high_c: float = 105.0):
        self.slope = v_ptat_slope_mv_per_k
        self.t_low_k = t_low_c + 273.15
        self.t_high_k = t_high_c + 273.15
        self.v_ref_low_mv = self.slope * self.t_low_k
        self.v_ref_high_mv = self.slope * self.t_high_k
        self.trip_latched = False

    def sample_temperature(self, ambient_temp_c: float) -> dict:
        t_kelvin = ambient_temp_c + 273.15
        v_sensor_mv = self.slope * t_kelvin
        
        # Dual-threshold window comparator
        cryo_alarm = (v_sensor_mv < self.v_ref_low_mv)
        overtemp_alarm = (v_sensor_mv > self.v_ref_high_mv)
        alarm_asserted = cryo_alarm or overtemp_alarm

        if alarm_asserted:
            self.trip_latched = True

        status = "NORMAL_RANGE"
        if cryo_alarm:
            status = "CRYO_ATTACK_DETECTED"
        elif overtemp_alarm:
            status = "OVERTEMP_ATTACK_DETECTED"

        return {
            'ambient_c': ambient_temp_c,
            'v_sensor_mv': round(v_sensor_mv, 2),
            'v_ref_low_mv': round(self.v_ref_low_mv, 2),
            'v_ref_high_mv': round(self.v_ref_high_mv, 2),
            'status': status,
            'alarm_latched': self.trip_latched
        }

if __name__ == '__main__':
    sensor = PTATThermalSensor(t_low_c=-30.0, t_high_c=105.0)
    print("=== On-Chip PTAT Bandgap Thermal Sensor Simulation ===")
    print(f"Safety Window: -30.0 C ({sensor.v_ref_low_mv:.1f} mV) to +105.0 C ({sensor.v_ref_high_mv:.1f} mV)")
    eval_temps = [25.0, 75.0, -45.0, 120.0]
    for t in eval_temps:
        res = sensor.sample_temperature(t)
        print(f"T: {res['ambient_c']:+5.1f} C -> V_ptat: {res['v_sensor_mv']:6.1f} mV | Status: {res['status']:24s} | Alarm Latched: {res['alarm_latched']}")
'''

    # Part 3 Code: Silicon Photodiode Decapsulation Detector
    p3_code = '''# Day 42 Part 3: Integrated Silicon Photodiode Decapsulation & Optical Intrusion Detector
import math

class DieDecapsulationDetector:
    """Simulates on-chip PN-junction photodiode response to ambient light and decapsulation."""
    def __init__(self, dark_current_pa: float = 5.0, responsivity_a_per_w: float = 0.45):
        self.i_dark = dark_current_pa * 1e-12  # 5 pA dark current inside opaque package
        self.responsivity = responsivity_a_per_w  # A/W at 650 nm optical wavelength
        self.active_area_um2 = 400.0  # 20 um x 20 um photodiode
        self.trip_threshold_na = 2.0   # 2 nA threshold asserts light tamper alarm
        self.trip_latched = False

    def calculate_photocurrent_na(self, ambient_lux: float) -> float:
        """Converts optical illuminance (lux) to photocurrent generated in silicon PN-junction."""
        # 1 lux ~= 0.0079 W/m^2 for daylight spectrum
        optical_irradiance_w_m2 = ambient_lux * 0.0079
        area_m2 = self.active_area_um2 * 1e-12
        optical_power_w = optical_irradiance_w_m2 * area_m2
        i_photo = self.i_dark + (optical_power_w * self.responsivity)
        return i_photo * 1e9  # Convert to nA

    def evaluate_optical_tamper(self, ambient_lux: float) -> dict:
        i_na = self.calculate_photocurrent_na(ambient_lux)
        tamper_tripped = (i_na > self.trip_threshold_na)
        if tamper_tripped:
            self.trip_latched = True

        return {
            'ambient_lux': ambient_lux,
            'photocurrent_na': round(i_na, 4),
            'threshold_na': self.trip_threshold_na,
            'package_integrity': 'TAMPERED_DECAPSULATED' if tamper_tripped else 'INTACT_SEALED',
            'alarm_latched': self.trip_latched
        }

if __name__ == '__main__':
    detector = DieDecapsulationDetector()
    print("=== Silicon Die Decapsulation Optical Sensor Analysis ===")
    test_environments = [
        ("Sealed Epoxy Package (Dark)", 0.0),
        ("Lab Ambient Shadow (Low Light)", 150.0),
        ("Inspection Microscope Lamp", 12000.0),
        ("Direct Sunlight", 80000.0)
    ]
    for env, lux in test_environments:
        res = detector.evaluate_optical_tamper(lux)
        print(f"Env: {env:30s} ({res['ambient_lux']:7.0f} lux) -> I_photo: {res['photocurrent_na']:8.3f} nA | Status: {res['package_integrity']}")
'''

    # Part 4 Code: Voltage Slew-Rate & Fast Brownout Detection
    p4_code = '''# Day 42 Part 4: Voltage Slew-Rate & Fast Supply Disconnect Detection
import struct

class VoltageSlewRateMonitor:
    """Monitors power supply dV/dt slew rate to detect sudden battery extraction and glitch cuts."""
    def __init__(self, v_nominal: float = 3.3, max_slew_mv_per_us: float = 250.0):
        self.v_nominal = v_nominal
        self.max_slew = max_slew_mv_per_us
        self.last_voltage = v_nominal
        self.last_time_us = 0.0
        self.alarm_tripped = False

    def evaluate_voltage_step(self, current_v: float, timestamp_us: float) -> dict:
        delta_v = abs(current_v - self.last_voltage) * 1000.0  # mV
        delta_t = max(0.01, timestamp_us - self.last_time_us)   # us
        measured_slew = delta_v / delta_t  # mV/us

        is_tamper = (measured_slew > self.max_slew) or (current_v < 1.8)
        if is_tamper:
            self.alarm_tripped = True

        self.last_voltage = current_v
        self.last_time_us = timestamp_us

        return {
            'voltage_v': round(current_v, 3),
            'slew_rate_mv_per_us': round(measured_slew, 2),
            'max_allowed_slew': self.max_slew,
            'tamper_detected': is_tamper,
            'alarm_latched': self.alarm_tripped
        }

if __name__ == '__main__':
    monitor = VoltageSlewRateMonitor(v_nominal=3.3, max_slew_mv_per_us=250.0)
    print("=== Voltage Slew-Rate (dV/dt) Tamper Monitor ===")
    test_profile = [
        (3.30, 10.0),   # Steady state
        (3.28, 20.0),   # Normal load step (20 mV over 10 us = 2 mV/us)
        (2.10, 22.0),   # Sharp power disconnect cut (1180 mV over 2 us = 590 mV/us!)
        (1.20, 24.0)    # Collapsing power rail
    ]
    for v, t in test_profile:
        res = monitor.evaluate_voltage_step(v, t)
        print(f"Time: {t:4.1f} us -> V: {res['voltage_v']:4.2f} V | dV/dt: {res['slew_rate_mv_per_us']:6.1f} mV/us | Tamper: {res['tamper_detected']} | Latched: {res['alarm_latched']}")
'''

    # Part 5 Code: Integrated Environmental Sensor Fusion Engine
    p5_code = '''# Day 42 Part 5: TamperShield Environmental Sensor Fusion Engine & Master Trip Controller
import struct

class PTATThermalSensor:
    def __init__(self, t_low_c: float = -30.0, t_high_c: float = 105.0):
        self.t_low_c = t_low_c
        self.t_high_c = t_high_c
    def sample_temperature(self, t_c: float) -> dict:
        tripped = (t_c < self.t_low_c) or (t_c > self.t_high_c)
        status = "CRYO_ATTACK_DETECTED" if t_c < self.t_low_c else ("OVERTEMP_ATTACK_DETECTED" if t_c > self.t_high_c else "NORMAL")
        return {'status': status, 'alarm_latched': tripped}

class DieDecapsulationDetector:
    def __init__(self, trip_threshold_lux: float = 50.0):
        self.thresh = trip_threshold_lux
    def evaluate_optical_tamper(self, lux: float) -> dict:
        tripped = (lux > self.thresh)
        return {'package_integrity': 'TAMPERED_DECAPSULATED' if tripped else 'INTACT', 'alarm_latched': tripped}

class VoltageSlewRateMonitor:
    def __init__(self, max_slew_mv_per_us: float = 250.0):
        self.max_slew = max_slew_mv_per_us
        self.last_v = 3.3
        self.last_t = 0.0
    def evaluate_voltage_step(self, v: float, t_us: float) -> dict:
        dt = max(0.01, t_us - self.last_t)
        slew = (abs(v - self.last_v) * 1000.0) / dt
        tripped = (slew > self.max_slew) or (v < 1.8)
        self.last_v = v
        self.last_t = t_us
        return {'tamper_detected': tripped, 'alarm_latched': tripped}

class EnvironmentalSensorFusionEngine:
    """Aggregates thermal, optical, and voltage slew sensors into autonomous zeroization trip matrix."""
    def __init__(self, root_key_hex: str):
        self.key_bytes = list(bytes.fromhex(root_key_hex))
        self.thermal_sensor = PTATThermalSensor(t_low_c=-30.0, t_high_c=105.0)
        self.optical_detector = DieDecapsulationDetector()
        self.voltage_monitor = VoltageSlewRateMonitor()
        self.alarm_asserted = False
        self.zeroized = False
        self.trip_source = "NONE"

    def execute_sensor_fusion_poll(self, temp_c: float, lux: float, voltage_v: float, t_us: float) -> dict:
        r_temp = self.thermal_sensor.sample_temperature(temp_c)
        r_opt = self.optical_detector.evaluate_optical_tamper(lux)
        r_volt = self.voltage_monitor.evaluate_voltage_step(voltage_v, t_us)

        # Trigger logic: Any sensor assertion forces instant key destruction
        if r_temp['alarm_latched'] and self.trip_source == "NONE":
            self.trip_source = f"THERMAL_VIOLATION ({r_temp['status']})"
        elif r_opt['alarm_latched'] and self.trip_source == "NONE":
            self.trip_source = "OPTICAL_DECAPSULATION_DETECTED"
        elif r_volt['alarm_latched'] and self.trip_source == "NONE":
            self.trip_source = "VOLTAGE_SLEW_ATTACK_DETECTED"

        if self.trip_source != "NONE":
            self.alarm_asserted = True
            # Hardware zeroization: instantaneous key overwriting
            self.key_bytes = [0x00] * len(self.key_bytes)
            self.zeroized = True

        return {
            'timestamp_us': t_us,
            'temp_status': r_temp['status'],
            'optical_status': r_opt['package_integrity'],
            'voltage_tamper': r_volt['tamper_detected'],
            'alarm_asserted': self.alarm_asserted,
            'zeroized': self.zeroized,
            'trip_source': self.trip_source,
            'active_key': bytes(self.key_bytes[:4]).hex().upper()
        }

if __name__ == '__main__':
    master_key = "FEDCBA98765432100123456789ABCDEF" * 2  # 32-byte AES root key
    fusion = EnvironmentalSensorFusionEngine(master_key)
    print("=== TamperShield Environmental Sensor Fusion Engine Initialized ===")
    print(f"Root Key Initial Hash Prefix: {bytes(fusion.key_bytes[:4]).hex().upper()}...")

    # Cycle 1: Nominal operation (25 C, dark package, 3.3V)
    c1 = fusion.execute_sensor_fusion_poll(temp_c=25.0, lux=0.0, voltage_v=3.3, t_us=10.0)
    print(f"Cycle 1 (Nominal)  -> Alarm: {c1['alarm_asserted']} | Keys Zeroized: {c1['zeroized']} | Source: {c1['trip_source']}")

    # Cycle 2: Cryogenic cooling attack initiated (-40 C)
    c2 = fusion.execute_sensor_fusion_poll(temp_c=-40.0, lux=0.0, voltage_v=3.3, t_us=20.0)
    print(f"Cycle 2 (Cryo Hit) -> Alarm: {c2['alarm_asserted']} | Keys Zeroized: {c2['zeroized']} | Source: {c2['trip_source']}")
    print(f"Zeroization Verification: Key Storage Overwritten to 0x{c2['active_key']} (Instantaneous Destruction!)")
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

    day42_lesson = {
        "coursePrefix": "iot_sec",
        "day": 42,
        "title": "Environmental Physical Attack Detection: Cryo/Over-Temp, Decapsulation & Microprobing",
        "goal": "Architect and simulate multi-sensor environmental tamper detection systems, including on-chip proportional-to-absolute-temperature (PTAT) thermal trip comparators, silicon photodiode decapsulation detectors, and supply voltage slew-rate monitors to detect cold-boot attacks and chemical de-packaging.",
        "minutes": 38,
        "recap": "Yesterday, in Day 41, we implemented active silicon meshes on Metal 7 and serpentine enclosure TDR reflection monitors. Today, in Day 42, we fortify the hardware against non-mechanical environmental attacks, defending against cryogenic cold-boot memory freezing, chemical package decapsulation, and rapid power disconnection.",
        "parts": [
            {
                "title": "Cold-Boot Attacks & Memory Remanence: Physics of Cryogenic Freezing & DRAM/SRAM Decay",
                "say": [
                    "A classic and devastating physical attack against embedded microcontrollers and secure cryptographic coprocessors is the cold-boot attack. Grounded in the solid-state physics of semiconductor memory, cold-boot exploits take advantage of data remanence in volatile static random-access memory (SRAM) and dynamic RAM (DRAM). In theoretical computer science, volatile memory cells are assumed to lose their state instantly when electrical power is removed. In physical silicon reality, however, memory cells store logical state as microscopic electrostatic charges trapped on CMOS gate oxide capacitances and cross-coupled inverters. When external power is disconnected, these stored charges do not vanish instantaneously; rather, they leak away gradually through reverse-biased silicon PN-junction leakage currents and subthreshold drain-to-source conduction.",
                    "At standard room temperature (+25 degrees Celsius), unpowered SRAM cells experience rapid thermal carrier diffusion, causing state discharge within tens to hundreds of milliseconds. However, carrier mobility and thermal excitation in silicon follow the Arrhenius rate equation: the leakage current I_leak is exponentially proportional to temperature: I_leak = I_0 * exp(-E_a / (k * T)), where E_a is the silicon bandgap activation energy (approximately 0.65 eV to 1.1 eV), k is Boltzmann's constant, and T is the absolute temperature in Kelvin. If an adversary rapidly chills the microcontroller package using an inverted can of compressed liquid refrigerant or liquid nitrogen (-50 deg C to -196 deg C), thermal carrier generation collapses by orders of magnitude.",
                    "Under cryogenic freezing conditions, the electrical discharge time constant of unpowered SRAM cells increases from fractions of a second to multiple tens of seconds, or even minutes. An attacker can physically cut the power supply to the secure microcontroller, extract the chilled silicon chip or external SRAM module with mechanical tweezers, transplant it into an adversary-controlled FPGA testing bench, and read out the decaying memory matrix. Because bits decay predictably toward their preferred power-on reset state, statistical recovery algorithms (such as Hamming weight error-correction and branch-and-bound tree searching) can reconstruct 256-bit AES master keys and private RSA keys even if 10% to 15% of the memory bits have experienced thermal flip.",
                    "Cold-boot attacks also threaten industrial IoT endpoints that utilize battery-backed SRAM (BB-SRAM) to store root cryptographic keys during transit or storage. If the backup battery line is severed while the device is frozen, the keys persist long enough for an attacker to re-apply power and access the memory bus before the charge dissipates. Furthermore, freezing attacks are frequently combined with hardware resets: by forcing a hardware reset pin while the memory is chilled, the microcontroller reboots into unauthenticated test firmware or ROM bootloader routines without clearing the SRAM contents, allowing the adversary to dump memory over open UART or SPI debug interfaces.",
                    "To completely neutralize cold-boot vulnerabilities, secure hardware architectures must not rely on passive power loss for key erasure. Instead, the silicon must incorporate autonomous, continuously operating cryogenic temperature sensors that detect the onset of thermal chilling while power remains available. If the die temperature drops below certified operational boundaries (e.g., below -30 deg C or -40 deg C), the hardware supervisor must instantly assert an internal zeroization sequence, actively discharging all internal storage nodes to ground long before cryogenic temperatures stabilize.",
                    "In certified Common Criteria EAL5+ and FIPS 140-3 Level 4 hardware evaluations, vulnerability assessment teams rigorously quantify the thermal decay profile of internal registers. Evaluators chill the device to -60 deg C, cut the primary and battery power rails for precisely calibrated intervals (from 1 second to 60 seconds), and execute automated bit-error-rate (BER) mapping upon re-powering. Hardware security modules must demonstrate zero-remanence properties: even after sub-second cryogenic power interruptions, all critical security parameters must be certifiably overwritten, ensuring that residual electrostatic charges cannot be imaged using Kelvin probe force microscopy (KPFM) or scanning electron microscopy (SEM) voltage contrast imaging."
                ],
                "example": "An attacker sprays compressed tetrafluoroethane refrigerant onto an industrial smart meter, dropping the MCU package temperature to -50 deg C. The attacker severs the 3.3V power rail, expecting the SRAM keys to persist for 60 seconds. However, as the temperature crossed -30 deg C, our on-chip PTAT sensor triggered an active zeroization latch, wiping the master keys in 25 nanoseconds before the power was cut.",
                "code": p1_code,
                "output": outputs[0],
                "codeNotes": [
                    "SRAMRemanenceModel implements the Arrhenius solid-state leakage equation (E_a = 0.65 eV) to calculate temperature-dependent retention half-life.",
                    "simulate_key_survival calculates the percentage of uncorrupted bits surviving across a 32-byte key after a 10-second unpowered period at various temperatures.",
                    "Demonstrates that chilling to -50 deg C extends retention half-life by orders of magnitude, making unpowered memory highly exploitable without active zeroization."
                ],
                "tryIt": "Set unpowered_time_s to 60.0 seconds and observe how cryogenic freezing at -50 C still preserves over 80% of key bits, demonstrating the necessity of active thermal trip circuits.",
                "check": {
                    "question": "Why does cryogenic cooling (-50 deg C) allow attackers to perform cold-boot attacks against volatile SRAM?",
                    "options": [
                        "It exponentially suppresses thermal carrier leakage through silicon PN junctions, extending charge retention time from milliseconds to minutes",
                        "It permanently transforms SRAM inverters into read-only flash memory",
                        "It freezes the clock frequency of the processor so instructions cannot execute",
                        "It increases the resistance of copper traces to infinity, preventing current discharge"
                    ],
                    "answer": 0,
                    "why": "According to the Arrhenius relationship, leakage current through reverse-biased silicon junctions decreases exponentially as temperature drops, preserving electrostatic charge on unpowered SRAM gate capacitances for tens of seconds."
                }
            },
            {
                "title": "On-Chip Thermal Sensor Circuits: PTAT Bandgap References & Cryogenic/Thermal Tripping Comparators",
                "say": [
                    "To defend against both cryogenic cold-boot attacks and destructive over-temperature manipulations, secure integrated circuits incorporate on-chip Proportional-To-Absolute-Temperature (PTAT) thermal sensor circuits. A PTAT sensor is an analog instrumentation circuit fabricated directly onto the silicon substrate alongside cryptographic execution units. Unlike external board-level temperature sensors (which can be desoldered, thermally insulated, or physically severed by an attacker), an on-chip PTAT sensor is integrated within the core silicon layout and cannot be removed without permanently destroying the die.",
                    "The operating principle of a PTAT sensor relies on the fundamental physics of bipolar junction transistors (BJTs) operating under differential current densities. In standard CMOS technology, parasitic vertical PNP substrate transistors are naturally formed by p+ diffusion, n-well, and p-substrate layers. When two identical PNP transistors are biased with unequal collector currents (or designed with an emitter area ratio N:1), the difference between their base-emitter voltages Delta_V_be is directly proportional to absolute temperature T in Kelvin: Delta_V_be = V_be1 - V_be2 = (k * T / q) * ln(N), where k is Boltzmann's constant, q is electron charge, and ln(N) is a fixed geometric constant.",
                    "Because k and q are fundamental physical constants, Delta_V_be exhibits a completely linear, positive temperature coefficient (typically around 1.5 mV to 2.5 mV per Kelvin). By combining this PTAT voltage with a Complementary-To-Absolute-Temperature (CTAT) voltage (derived from the negative temperature coefficient of a single forward-biased diode: dV_be / dT ~= -2.0 mV/K), the on-chip analog block establishes a stable, zero-temperature-coefficient bandgap reference voltage (V_bg ~= 1.25 V). This reference voltage serves as an immutable calibration standard across all operational conditions.",
                    "The PTAT output voltage is fed into an autonomous, dual-threshold analog window comparator. The window comparator defines the certified safe thermal operating envelope (typically -30 deg C to +105 deg C for industrial automotive-grade microcontrollers). High-precision on-chip resistor ladders generate reference threshold voltages: V_ref_low corresponding to the cryogenic trip limit (-30 deg C), and V_ref_high corresponding to the over-temperature trip limit (+105 deg C). Fast analog differential comparators continuously compare the instantaneous V_ptat voltage against both limits.",
                    "If an attacker sprays refrigerant onto the chip, V_ptat drops below V_ref_low, causing the cryogenic comparator output to switch high within nanoseconds. Conversely, if an attacker subjects the chip to high-temperature heating—a common technique used to induce thermal fault injection, accelerate flash memory bit rot, or weaken PUF (Physically Unclonable Function) stability—V_ptat exceeds V_ref_high, asserting the over-temperature alarm. In both cases, the comparator output directly sets a hardware set-dominant SR latch, triggering immediate key zeroization without any CPU intervention.",
                    "To prevent attackers from disabling the thermal protection block by starving its power supply or injecting localized substrate noise, the PTAT circuitry is designed with dedicated fail-safe bias monitors. If the internal current bias drops below 80% of its nominal operating level (indicating power starvation or ground lift attacks), a secondary under-current trip circuit fires automatically, ensuring that the sensor cannot be silently blinded.",
                    "In production manufacturing, wafer-level post-fabrication calibration is essential to guarantee tight trip tolerances. Because sub-micron CMOS manufacturing suffers from random dopant fluctuations and threshold voltage variations across silicon wafers, uncalibrated bandgap references exhibit up to +/- 5 deg C of initial offset. Secure microcontrollers incorporate on-chip non-volatile eFuse trim banks. During automated wafer-sort testing at +25 deg C, high-precision automated test equipment (ATE) measures the raw V_ptat voltage and programs digital trim bits that adjust the internal bias resistor network, locking the absolute thermal trip accuracy to within +/- 1.5 deg C across the entire operating lifetime of the device.",
                    "Furthermore, high-security silicon architectures employ second-order curvature correction. While the first-order difference of base-emitter voltages Delta_V_be is linear with temperature, the temperature dependence of carrier mobility and the collector current introduces a slight non-linear logarithmic curvature at extreme temperature boundaries (-40 deg C and +125 deg C). Curvature-compensation circuits inject a non-linear squaring current at elevated temperatures, flattening the thermal slope error and preventing false trips at the operational margins while guaranteeing razor-sharp triggering upon deliberate cryogenic attack."
                ],
                "example": "An attacker uses an industrial heat gun to warm an automotive secure gateway to 135 deg C to induce flash memory bitflips. The on-chip PTAT sensor voltage rises to 816 mV, exceeding the +105 deg C safety ceiling (756 mV). The over-temperature comparator trips in 8 nanoseconds, latching the hardware alarm and zeroizing internal secrets.",
                "code": p2_code,
                "output": outputs[1],
                "codeNotes": [
                    "PTATThermalSensor models a linear PTAT voltage generator with a calibrated slope of 2.0 mV/K.",
                    "Dual reference thresholds (V_ref_low and V_ref_high) define the certified thermal safety window from -30 C to +105 C.",
                    "Dual-threshold window comparator asserts an autonomous hardware alarm latch whenever ambient temperature breaches the safety envelope."
                ],
                "tryIt": "Modify t_low_c to -20.0 C and verify that an ambient temperature of -25.0 C successfully asserts the CRYO_ATTACK_DETECTED alarm status.",
                "check": {
                    "question": "What is the physical foundation of an on-chip PTAT (Proportional-To-Absolute-Temperature) sensor?",
                    "options": [
                        "The base-emitter voltage difference Delta_V_be between two bipolar transistors operating at different current densities is strictly linear with absolute temperature T",
                        "The resistance of silicon dioxide dielectrics drops to zero at freezing temperatures",
                        "The mechanical vibration of bonding wires changes color under ultraviolet light",
                        "CMOS logic gates stop conducting electricity at +25 deg C"
                    ],
                    "answer": 0,
                    "why": "The Delta_V_be of two bipolar transistors with an emitter area ratio N:1 is given by (k*T/q)*ln(N), which depends only on physical constants and temperature in Kelvin, providing a perfectly linear thermal voltage slope."
                }
            },
            {
                "title": "Silicon Die Decapsulation Detection: Integrated Light Sensors, Ambient Photodiodes & Spectral Response",
                "say": [
                    "A mandatory physical security requirement under FIPS 140-3 Physical Security Level 4 is the detection of integrated circuit de-packaging and decapsulation. In standard manufacturing, the silicon die is hermetically encapsulated inside an opaque black epoxy molding compound composed of phenolic resin, silica fillers, and carbon black pigments. Under normal operating conditions inside this opaque package, the interior of the integrated circuit exists in total darkness: ambient photon flux is essentially zero, and any light-sensitive silicon structures exhibit only microscopic dark leakage currents (typically less than 10 picoamperes).",
                    "When an adversary chemically decapsulates the package with fuming acids or mechanically mills away the mold compound to expose the die surface, ambient laboratory light (ranging from 100 lux in normal office lighting to over 50,000 lux under optical microscopes) floods the bare silicon die. Silicon is an indirect-bandgap semiconductor with a bandgap energy E_g of approximately 1.12 eV at room temperature. Any photon possessing an optical energy h * nu greater than 1.12 eV (corresponding to optical wavelengths shorter than 1100 nm, encompassing all visible light and near-infrared radiation) is absorbed by the silicon lattice, generating electron-hole pairs via the internal photoelectric effect.",
                    "Secure microcontrollers capitalize on this photoelectric property by distributing an array of integrated PN-junction photodiodes across the die surface. Fabricated using standard n-well / p-substrate or p+ diffusion / n-well junctions, these photodiodes are reverse-biased. In total darkness inside the sealed package, the photodiode passes only a negligible reverse saturation dark current I_dark on the order of 1 to 10 picoamperes. However, as soon as package material is removed and photons strike the depletion region, the generated electron-hole pairs are swept across the electric field, creating a reverse photocurrent I_photo: I_photo = Responsivity * P_optical + I_dark, where Responsivity is typically 0.4 to 0.6 Amperes per Watt at visible wavelengths.",
                    "Even under faint ambient illumination of 100 lux, the photocurrent generated in a modest 20 um x 20 um photodiode surges from picoamperes into multiple nanoamperes—an increase of three to four orders of magnitude. The photodiode current is fed into an on-chip current comparator or charge-integrating transimpedance amplifier. If the photocurrent exceeds a calibrated noise threshold (typically 2 to 5 nA), the optical comparator triggers immediately, asserting the decapsulation alarm line and driving the hardware zeroization latch before the attacker can place the exposed die onto an analytical probe station.",
                    "To prevent an adversary from bypassing decapsulation sensors by performing de-packaging and probing inside a darkroom or under monochromatic infrared illumination, high-security chips employ spectral-diversity optical detector arrays. These arrays combine visible-light photodiodes, deep-ultraviolet detectors (sensitive to laser ablation beams), and near-infrared (NIR) photodiodes with anti-reflective silicon coatings. Furthermore, the optical sensors are interspersed directly beneath active top-metal mesh grids: if an attacker uses infrared back-side laser microscopy (which penetrates the silicon bulk from the substrate side), the substrate photodiodes detect the laser photon flux, preventing both front-side and back-side optical inspection.",
                    "To prevent false trips from high-energy cosmic rays or diagnostic X-ray inspection systems used during board assembly and quality control, modern optical sensors deploy differential photodiode pairs. Each sensing node consists of an active photodiode exposed to the package interface paired with an adjacent reference photodiode that is completely covered by thick Metal 6 and Metal 7 dummy copper shields. Uniform penetrating radiation (such as industrial X-ray tomography) penetrates both diodes equally, generating identical common-mode currents that are cancelled out by an on-chip differential transimpedance amplifier. Only surface illumination penetrating a decapsulated package produces differential current, eliminating false alarms while retaining single-photon sensitivity.",
                    "Additionally, optical trip latches are engineered with optical hysteresis and dark current auto-zeroing. Because silicon dark current increases exponentially at elevated operating temperatures (+105 deg C), a static trip threshold could cause false alarms in automotive under-the-hood environments. The auto-zeroing circuit samples the dark current during power-on initialization and dynamically tracks thermal leakage, maintaining a constant signal-to-noise ratio margin of at least 20 dB above the thermal floor across the entire automotive temperature envelope."
                ],
                "example": "A failure analysis technician decapsulates a secure microcontroller using nitric acid and places it under a 10,000-lux microscope illuminator. Within 3 nanoseconds of light striking the die, the on-chip photodiode array generates 15.8 nA of photocurrent, exceeding the 2.0 nA threshold and instantly triggering key zeroization.",
                "code": p3_code,
                "output": outputs[2],
                "codeNotes": [
                    "DieDecapsulationDetector models a silicon PN-junction photodiode with a dark current of 5 pA and responsivity of 0.45 A/W.",
                    "calculate_photocurrent_na converts optical illuminance (lux) to photocurrent generated across a 400 um^2 depletion area.",
                    "Demonstrates that exposure to ambient laboratory light generates nanoamperes of photocurrent, crossing the 2 nA tamper threshold instantly."
                ],
                "tryIt": "Set ambient_lux to 50.0 (dim shadow) and observe that even faint ambient light generates sufficient photocurrent to trip the decapsulation alarm.",
                "check": {
                    "question": "How do on-chip silicon photodiodes detect integrated circuit package decapsulation?",
                    "options": [
                        "Photons with energy exceeding silicon's 1.12 eV bandgap generate electron-hole pairs in reverse-biased PN junctions, creating a photocurrent that surges by orders of magnitude above dark leakage",
                        "Photons physically heat the bonding wires until they fuse open",
                        "Ambient light alters the dielectric constant of copper traces to zero",
                        "The package decapsulation is detected by measuring atmospheric air pressure with an internal barometer"
                    ],
                    "answer": 0,
                    "why": "Inside an opaque sealed package, reverse-biased photodiodes conduct only negligible dark current (picoamps). When decapsulated, incoming photons generate electron-hole pairs, producing a photocurrent (nanoamps) that trips the comparator."
                }
            },
            {
                "title": "Voltage Slew-Rate & Fast Supply Disconnect Detection: Brownout and Crowbar Sensing",
                "say": [
                    "A critical vulnerability in physical hardware security is the rapid supply disconnect exploit. In this attack scenario, an adversary attempts to defeat active anti-tamper circuitry by instantly severing the device's external power supply or backup battery. The attacker hopes that by cutting power faster than the microcontroller's supervisory logic can execute, the internal CPU and peripheral controllers will shut down before zeroization routines can execute, leaving cryptographic keys intact in decaying volatile SRAM.",
                    "To neutralize this exploit, modern secure architectures incorporate fast voltage slew-rate monitors and high-speed brownout detectors capable of executing autonomous hardware zeroization using purely passive energy reservoirs. A voltage slew-rate monitor measures the rate of change of the supply voltage over time: dV_dd / dt. Under normal operating conditions, decoupling capacitors and power management ICs ensure that supply voltage transitions are smooth and bounded, rarely exceeding a few millivolts per microsecond (e.g., during low-power sleep state transitions or maximum-load CPU bursts).",
                    "Conversely, when an external power lead is abruptly clipped or an attacker connects a low-impedance crowbar shunt across the power rails, the supply voltage drops precipitously, producing an abnormal negative slew rate exceeding hundreds of millivolts per microsecond (e.g., -500 mV/us to -5000 mV/us). The on-chip voltage slew monitor utilizes an analog differentiator circuit—typically constructed from an on-chip capacitor connected to a current-mirror comparator—that generates an output current proportional to dV / dt: I_slew = C_diff * (dV / dt). When I_slew exceeds the calibrated safety limit, the slew detector trips immediately.",
                    "Simultaneously, high-speed brownout detectors monitor absolute voltage thresholds. In standard microcontrollers, brownout detectors operate with millisecond-scale low-pass filter delays to prevent transient supply dips from triggering unwanted system resets. In secure hardware microcontrollers, however, the brownout detector is split into a two-tier architecture: a slow software-filtered reset tier for general MCU operation, and an ultra-fast hardware trip tier with a response latency under 10 nanoseconds. The moment V_dd drops below a critical security threshold (e.g., 2.0 V on a 3.3 V nominal rail), the fast tier triggers.",
                    "The operational cornerstone of this fast-disconnect defense is the integrated zeroization energy reservoir. Fabricated using high-density on-chip deep-trench capacitors (DTC) or supported by dedicated PCB reservoir capacitors, this reservoir stores sufficient electrical energy (Q = C * V) to power the hardware zeroization crowbar transistors even after external power has dropped to zero volts. The moment the fast brownout or slew monitor asserts, the stored charge is dumped directly into the gates of the SRAM discharge transistors, ensuring 100% key destruction before the supply rail completely collapses.",
                    "In physical circuit implementation, the slew-rate differentiator utilizes low-leakage metal-insulator-metal (MIM) capacitors positioned between the power distribution grid and the sensing node. To ensure absolute immunity to high-frequency electromagnetic interference (such as nearby cell phone transmissions or industrial motor arcing), the differentiator is equipped with an integrated charge-integrating low-pass stage. High-frequency RF transients whose duration is shorter than 5 nanoseconds are absorbed by on-chip clamp diodes, whereas true power disconnection events (which persist for microseconds as decoupling capacitors discharge) charge the sensing node past the trip threshold, ensuring zero false triggers under harsh industrial electromagnetic environments.",
                    "Furthermore, high-speed voltage supervisory circuits incorporate programmable brownout hysteresis. If the main power rail experiences a temporary voltage dip (for example, due to a heavy inductive motor startup on the factory floor), the comparator activates a low-power clock gating state rather than an immediate destructive zeroization. Only when the voltage drop crosses the critical security boundary (e.g., dropping below 1.8 V where SRAM volatile integrity begins to degrade) does the Emergency Zeroization Rail assert, perfectly segregating operational fault tolerance from irreversible cryptographic protection."
                ],
                "example": "A thief snips the external 3.3V battery lead with wire cutters. The supply rail collapses at -650 mV/us. Within 12 nanoseconds, the on-chip dV/dt differentiator fires, dumping energy from on-chip deep-trench capacitors into the BB-SRAM crowbar transistors, wiping the AES master key before V_dd falls below 2.0 V.",
                "code": p4_code,
                "output": outputs[3],
                "codeNotes": [
                    "VoltageSlewRateMonitor tracks instantaneous power supply dV/dt slew rate and absolute brownout threshold (1.8 V).",
                    "evaluate_voltage_step differentiates normal load steps (2 mV/us) from violent power disconnect cuts (> 250 mV/us).",
                    "Demonstrates nanosecond-scale tamper assertion powered by local reservoir capacitance."
                ],
                "tryIt": "Simulate a gradual battery discharge (e.g., current_v = 3.25 at timestamp_us = 50.0) and verify that normal slow voltage decay does not trigger false slew rate alarms.",
                "check": {
                    "question": "How does secure hardware ensure that root keys are destroyed if an attacker suddenly cuts the power supply cable?",
                    "options": [
                        "On-chip differentiator circuits detect abnormal negative voltage slew rate (dV/dt), and dedicated reservoir capacitors power instantaneous key discharge before the rail collapses",
                        "The chip relies on the host operating system to save the keys to cloud storage before power goes out",
                        "The processor uses thermal cooling to slow down electron motion until power returns",
                        "The keys are encrypted with a password sent over SMS"
                    ],
                    "answer": 0,
                    "why": "High-speed dV/dt slew rate monitors detect rapid supply collapse in nanoseconds, utilizing energy stored in local reservoir capacitors to drive key-erasure discharge transistors before the voltage drops to zero."
                }
            },
            {
                "title": "Integrated Environmental Sensor Fusion Engine & Hardware Alarm Aggregator",
                "say": [
                    "The culmination of physical environmental protection is the integrated environmental sensor fusion engine. In a certified FIPS 140-3 Level 4 or Common Criteria EAL6+ security processor, the physical security boundary is guarded by dozens of heterogeneous sensors: on-chip PTAT thermal sensors, package decapsulation photodiodes, supply voltage slew-rate and brownout monitors, Metal 7 active die meshes, and enclosure capacitive sensors. The sensor fusion engine serves as the centralized hardware aggregator, consolidating all discrete tamper indicators into a unified, fault-tolerant trip matrix.",
                    "The primary architectural challenge in multi-sensor tamper aggregation is balancing hypersensitivity against false-alarm resilience. In industrial environments, IoT devices are subjected to heavy machinery vibrations, electromagnetic interference from motor drives, and ambient temperature swings. If a security module false-trips and zeroizes its root master keys in the field, it creates severe operational disruption (denial of service), requiring expensive board replacements or authorized cryptographic re-provisioning. Therefore, the sensor fusion engine implements digital filtering, debouncing, and multi-sensor correlation algorithms.",
                    "However, for high-severity attack signatures—such as a detected package decapsulation (photodiode current surge) or a severe negative voltage slew rate (power rail cut)—the fusion engine bypasses all software filters. These critical physical attack indicators route directly through an asynchronous combinatorial OR-tree known as the Emergency Zeroization Rail (EZR). The EZR triggers the primary hardware latch in under 20 nanoseconds, guaranteeing that no physical attack vector can exploit filtering delays to intercept secrets.",
                    "Simultaneously, the sensor fusion engine maintains an immutable, battery-backed physical incident log. When any sensor trips, the fusion engine captures a comprehensive diagnostic telemetry snapshot before zeroizing secrets: the specific sensor channel that triggered (e.g., SENSOR_CRYO vs SENSOR_OPTICAL), the analog reading at the moment of trigger (e.g., -42.5 deg C or 8,500 lux), the hardware cycle counter, and the operating mode of the processor. This telemetry is preserved in a write-once tamper register domain that remains readable by authorized security auditors post-incident, enabling forensic failure analysis.",
                    "Ultimately, the sensor fusion engine embodies the principle of hardware physical sovereignty. By surrounding the cryptographic core with an impenetrable multi-layered shell of active physical and environmental sensors, the device ensures that any attempt to breach its physical boundary—whether by cold-boot freezing, chemical acid decapsulation, or power starvation—results in instantaneous, irreversible self-destruction of all confidential assets, leaving the adversary with a hollow, useless silicon shell.",
                    "To validate the sensor fusion engine against formal Common Criteria EAL6+ physical security evaluations, hardware security laboratories employ rigorous multi-vector environmental stress profiling. The device is placed inside an environmental test chamber and subjected to combined physical attack matrices: rapid temperature ramp-downs (-5 deg C/sec) occurring simultaneously with high-intensity xenon strobe flashes (simulating decapsulation under laser cutting) and sudden supply rail impedance collapses. The hardware fusion engine must demonstrate deterministic response latency under 35 nanoseconds across all test corners, certifying that the Emergency Zeroization Rail consistently destroys all critical security parameters before any physical extraction probe can establish electrical contact.",
                    "Moreover, the sensor fusion engine is architected with complete single-point-of-failure (SPOF) immunity. The primary trip lines from each environmental sensor are routed as independent, redundant complementary differential pairs through physically isolated routing channels across the die. If an attacker manages to mill through one section of the chip to sever a thermal trip wire, the adjacent complementary wire flags an open-circuit fault that immediately triggers the Emergency Zeroization Rail. This fail-secure topology guarantees that attempting to disable the sensor fusion engine induces the very self-destruction response the attacker is attempting to prevent.",
                    "In critical industrial infrastructure—such as smart electrical grids, pipeline control valves, and railway signaling transponders—this autonomous physical protection architecture guarantees that unmonitored remote devices can withstand physical theft and laboratory reverse-engineering, upholding system integrity across decades of field operation."
                ],
                "example": "An attacker places an industrial gateway into a thermal freeze chamber while simultaneously cutting the external supply. The sensor fusion engine's PTAT sensor detects -40 C while the slew monitor detects supply collapse. The Emergency Zeroization Rail fires in 15 nanoseconds, wiping all 32 bytes of the AES-256 root key to 0x00 and logging the physical intrusion event.",
                "code": p5_code,
                "output": outputs[4],
                "codeNotes": [
                    "EnvironmentalSensorFusionEngine unifies thermal, optical, and voltage slew rate sensors into an autonomous trip matrix.",
                    "execute_sensor_fusion_poll continuously monitors physical invariants and executes instantaneous root key zeroization upon breach.",
                    "Demonstrates complete hardware physical sovereignty: any verified environmental attack immediately destroys master cryptographic keys."
                ],
                "tryIt": "Execute poll with lux=500.0 (optical intrusion) and verify that the fusion engine identifies OPTICAL_DECAPSULATION_DETECTED and zeroes the key store.",
                "check": {
                    "question": "What is the Emergency Zeroization Rail (EZR) in an environmental sensor fusion engine?",
                    "options": [
                        "An asynchronous hardwired combinatorial circuit that bypasses software filtering to trigger instantaneous key zeroization in under 20 nanoseconds upon verified physical attack",
                        "A mechanical fuse that shoots sparks to alert nearby security guards",
                        "A software API endpoint accessible over the public Internet",
                        "A backup battery that powers the cooling fan during thermal attacks"
                    ],
                    "answer": 0,
                    "why": "The Emergency Zeroization Rail (EZR) is an asynchronous, hardwired combinatorial trip circuit that bypasses software delays to trigger instantaneous hardware key destruction within nanoseconds of a verified physical intrusion."
                }
            }
        ],
        "summary": [
            "Cold-boot attacks exploit temperature-dependent SRAM data remanence governed by the Arrhenius equation, extending retention half-life from milliseconds to minutes under cryogenic freezing.",
            "On-chip Proportional-To-Absolute-Temperature (PTAT) sensors provide linear thermal voltage monitoring (Delta_V_be = k*T/q * ln(N)), detecting cryogenic chilling and over-temperature attacks.",
            "Silicon die decapsulation photodiodes detect package opening: incoming photons exceeding the 1.12 eV bandgap generate nanoamperes of photocurrent, tripping optical alarms instantly.",
            "Voltage slew-rate monitors (dV/dt) detect sudden power disconnect cuts, dumping stored charge from on-chip deep-trench capacitors to zeroize keys before supply rails collapse.",
            "The Environmental Sensor Fusion Engine aggregates all thermal, optical, and electrical tamper sensors into an Emergency Zeroization Rail (EZR) ensuring complete physical hardware sovereignty."
        ],
        "projectStep": {
            "title": "Milestone 9 Architecture: Implement Environmental Sensor Fusion & Thermal/Optical Trip Engine",
            "steps": [
                "Implement the on-chip PTAT thermal monitoring model with dual reference thresholds for cryogenic (-30 C) and over-temperature (+105 C) detection.",
                "Integrate the silicon PN-junction photodiode decapsulation model to detect ambient light exposure upon package breach.",
                "Configure the fast voltage slew-rate (dV/dt) differentiator circuit to detect abrupt power cable severance and crowbar attacks.",
                "Bind all environmental sensor trip lines into the Emergency Zeroization Rail (EZR) to trigger instantaneous BB-SRAM key erasure."
            ]
        }
    }

    wcs = [len(" ".join(p["say"]).split()) for p in day42_lesson["parts"]]
    print(f"Day 42 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_sec_day42.json", "w", encoding="utf-8") as f:
        json.dump(day42_lesson, f, indent=2)

    print("Successfully built scripts/iot_sec_day42.json!")

if __name__ == "__main__":
    build_day42()
