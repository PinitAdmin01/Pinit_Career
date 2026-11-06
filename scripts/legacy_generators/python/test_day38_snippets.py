# scripts/test_day38_snippets.py
import math

# Snippet 1: Near-Field Magnetic Induction
class NearFieldInductionModel:
    def __init__(self, probe_diameter_um: float = 500.0, turns: int = 5):
        self.radius_m = (probe_diameter_um / 2.0) * 1e-6
        self.area_m2 = math.pi * (self.radius_m ** 2)
        self.turns = turns
        self.mu_0 = 4 * math.pi * 1e-7

    def calculate_induced_emf(self, current_ma: float, distance_um: float, rise_time_ps: float) -> dict:
        r_m = distance_um * 1e-6
        i_a = current_ma * 1e-3
        dt_s = rise_time_ps * 1e-12
        b_field_tesla = (self.mu_0 * i_a) / (2 * math.pi * r_m)
        d_phi_dt = (self.turns * self.area_m2 * b_field_tesla) / dt_s
        v_induced_mv = d_phi_dt * 1000.0

        return {
            "Distance_um": distance_um,
            "B_Field_uT": round(b_field_tesla * 1e6, 3),
            "InducedEMF_mV": round(v_induced_mv, 3)
        }

model1 = NearFieldInductionModel(probe_diameter_um=250.0, turns=4)
p1 = model1.calculate_induced_emf(current_ma=50.0, distance_um=100.0, rise_time_ps=200.0)
p2 = model1.calculate_induced_emf(current_ma=50.0, distance_um=500.0, rise_time_ps=200.0)
print("SNIPPET 1:")
print(f"Probe at 100um: B = {p1['B_Field_uT']} uT | Induced EMF = {p1['InducedEMF_mV']} mV")
print(f"Probe at 500um: B = {p2['B_Field_uT']} uT | Induced EMF = {p2['InducedEMF_mV']} mV")
print(f"Distance Attenuation: {round(p1['InducedEMF_mV'] / p2['InducedEMF_mV'], 2)}x")

# Snippet 2: 2D Spatial Grid Scanner
class SpatialGridScanner:
    def __init__(self, grid_size: int = 4):
        self.grid_size = grid_size
        self.hotspot = (2, 2)

    def scan_die_surface(self) -> list:
        heatmap = []
        for y in range(self.grid_size):
            row = []
            for x in range(self.grid_size):
                dist = math.sqrt((x - self.hotspot[0]) ** 2 + (y - self.hotspot[1]) ** 2)
                em_intensity = max(0.1, round(10.0 / (1.0 + 2.5 * (dist ** 2)), 2))
                row.append(em_intensity)
            heatmap.append(row)
        return heatmap

scanner = SpatialGridScanner(grid_size=4)
grid = scanner.scan_die_surface()
print("\nSNIPPET 2:")
print(f"Hotspot Coordinates: (2, 2)")
print(f"Peak Radiation:      {grid[2][2]} a.u.")
print(f"Corner Radiation:    {grid[0][0]} a.u.")
print(f"Contrast Ratio:      {round(grid[2][2] / grid[0][0], 2)}x")

# Snippet 3: RF Bandpass Filter
class RFSignalConditioner:
    def __init__(self, center_freq_mhz: float = 120.0, bandwidth_mhz: float = 20.0):
        self.f_center = center_freq_mhz
        self.bw = bandwidth_mhz

    def filter_signal(self, input_spectrum: dict) -> dict:
        filtered = {}
        for freq, amp in input_spectrum.items():
            if abs(freq - self.f_center) <= (self.bw / 2.0):
                filtered[freq] = round(amp * 1.0, 2)
            else:
                filtered[freq] = round(amp * 0.05, 2) # 26 dB attenuation
        return filtered

rf = RFSignalConditioner(center_freq_mhz=120.0, bandwidth_mhz=20.0)
spectrum = {80.0: 1.5, 115.0: 4.8, 120.0: 9.2, 125.0: 4.1, 160.0: 2.0}
res3 = rf.filter_signal(spectrum)
print("\nSNIPPET 3:")
print(f"Center Carrier (120 MHz): {res3[120.0]} mV (Passed)")
print(f"Out-of-Band (80 MHz):     {res3[80.0]} mV (Attenuated)")
print(f"Carrier Filtering Pass:   {res3[120.0] > 9.0 and res3[80.0] < 0.2}")

# Snippet 4: Differential EM Analysis (DEMA)
class DifferentialEMAnalyzer:
    def __init__(self):
        pass

    def compute_dema_differential(self, set_0: list, set_1: list) -> float:
        mean_0 = sum(set_0) / len(set_0)
        mean_1 = sum(set_1) / len(set_1)
        return round(abs(mean_1 - mean_0), 4)

dema = DifferentialEMAnalyzer()
traces_bit0 = [2.1, 2.3, 2.0, 2.2, 2.1]
traces_bit1 = [6.8, 7.1, 6.9, 7.2, 7.0]
diff = dema.compute_dema_differential(traces_bit0, traces_bit1)
print("\nSNIPPET 4:")
print(f"Mean EM Trace Bit 0: {round(sum(traces_bit0)/5, 2)} mV")
print(f"Mean EM Trace Bit 1: {round(sum(traces_bit1)/5, 2)} mV")
print(f"DEMA Differential:   {diff} mV")
print(f"Differential Trapped: {diff > 4.5}")

# Snippet 5: ApexElectromagneticSideChannelEngine
class ApexElectromagneticSideChannelEngine:
    def __init__(self, target_byte: int = 0x3C):
        self.target_byte = target_byte
        self.sbox = [
            0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,
            0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0
        ]

    def hamming_weight(self, n: int) -> int:
        return bin(n).count("1")

    def capture_em_radiation(self, plaintext: int) -> float:
        intermediate = self.sbox[(plaintext ^ self.target_byte) % len(self.sbox)]
        return float(self.hamming_weight(intermediate) * 1.5)

    def execute_cema_attack(self, plaintexts: list) -> dict:
        traces = [self.capture_em_radiation(p) for p in plaintexts]
        best_candidate = -1
        max_corr = -1.0

        for candidate in range(32):
            hyp = [self.hamming_weight(self.sbox[(p ^ candidate) % len(self.sbox)]) for p in plaintexts]
            n = len(traces)
            mean_t = sum(traces) / n
            mean_h = sum(hyp) / n
            num = sum((traces[i] - mean_t) * (hyp[i] - mean_h) for i in range(n))
            den_t = math.sqrt(sum((traces[i] - mean_t) ** 2 for i in range(n)))
            den_h = math.sqrt(sum((hyp[i] - mean_h) ** 2 for i in range(n)))
            corr = (num / (den_t * den_h)) if (den_t * den_h) != 0 else 0.0

            if corr > max_corr:
                max_corr = corr
                best_candidate = candidate

        return {
            "RecoveredSubkey": hex(best_candidate),
            "ExpectedSubkey": hex(self.target_byte % 32),
            "CEMA_PeakCorrelation": round(max_corr, 4),
            "AttackSuccess": best_candidate == (self.target_byte % 32)
        }

engine5 = ApexElectromagneticSideChannelEngine(target_byte=0x1C)
pts = [0x02, 0x07, 0x11, 0x1B, 0x24, 0x2E, 0x33, 0x3C]
res5 = engine5.execute_cema_attack(pts)
print("\nSNIPPET 5:")
print(f"CEMA Recovered Subkey: {res5['RecoveredSubkey']}")
print(f"CEMA Peak Correlation: {res5['CEMA_PeakCorrelation']}")
print(f"Key Recovery Match:    {res5['AttackSuccess']}")
