# scripts/test_day39_snippets.py
import random
import math

# Snippet 1: Trace Phase Misalignment
class TraceMisalignmentModel:
    def __init__(self):
        pass

    def evaluate_correlation_decay(self, max_jitter_samples: int = 5) -> dict:
        reference = [1.0, 5.0, 9.0, 4.0, 2.0]
        correlations = []
        for shift in range(max_jitter_samples + 1):
            shifted = [0.0] * shift + reference[:len(reference) - shift]
            n = len(reference)
            mean_r = sum(reference) / n
            mean_s = sum(shifted) / n
            num = sum((reference[i] - mean_r) * (shifted[i] - mean_s) for i in range(n))
            den = math.sqrt(sum((reference[i] - mean_r)**2 for i in range(n)) * sum((shifted[i] - mean_s)**2 for i in range(n)))
            corr = (num / den) if den != 0 else 0.0
            correlations.append(round(corr, 4))
        return {"JitterShifts": list(range(max_jitter_samples + 1)), "Correlations": correlations}

m1 = TraceMisalignmentModel()
res1 = m1.evaluate_correlation_decay(max_jitter_samples=4)
print("SNIPPET 1:")
print(f"Shift 0 (Aligned):   {res1['Correlations'][0]}")
print(f"Shift 1 (1-sample):  {res1['Correlations'][1]}")
print(f"Shift 2 (2-sample):  {res1['Correlations'][2]}")
print(f"Correlation Collapsed: {res1['Correlations'][2] < 0.1}")

# Snippet 2: Random Clock Jitter Generator
class HardwareClockJitterGenerator:
    def __init__(self, seed: int = 42):
        self.rng_state = seed

    def generate_jittered_delay(self, base_cycles: int = 10, max_jitter: int = 4) -> int:
        self.rng_state = (self.rng_state * 1103515245 + 12345) & 0x7FFFFFFF
        jitter = (self.rng_state >> 16) % (max_jitter + 1)
        return base_cycles + jitter

gen = HardwareClockJitterGenerator(seed=101)
delays = [gen.generate_jittered_delay(base_cycles=10, max_jitter=4) for _ in range(5)]
print("\nSNIPPET 2:")
print(f"Generated Jittered Delays: {delays}")
print(f"Delays Vary:               {len(set(delays)) > 1}")
print(f"All within [10, 14]:       {all(10 <= d <= 14 for d in delays)}")

# Snippet 3: Fisher-Yates S-Box Shuffler
class SBoxOperationShuffler:
    def __init__(self, seed: int = 42):
        self.rng = seed

    def shuffle_byte_order(self, num_bytes: int = 16) -> list:
        order = list(range(num_bytes))
        for i in range(num_bytes - 1, 0, -1):
            self.rng = (self.rng * 1103515245 + 12345) & 0x7FFFFFFF
            j = (self.rng >> 16) % (i + 1)
            order[i], order[j] = order[j], order[i]
        return order

shuffler = SBoxOperationShuffler(seed=777)
perm1 = shuffler.shuffle_byte_order(16)
perm2 = shuffler.shuffle_byte_order(16)
print("\nSNIPPET 3:")
print(f"Permutation 1: {perm1[:6]}...")
print(f"Permutation 2: {perm2[:6]}...")
print(f"Permutations Differ: {perm1 != perm2}")
print(f"Valid 16-element Permutation: {sorted(perm1) == list(range(16))}")

# Snippet 4: Dummy Round Injection
class DummyCycleInjector:
    def __init__(self, dummy_probability: float = 0.3):
        self.dummy_prob = dummy_probability
        self.rng = 42

    def execute_round_with_dummies(self, real_rounds: int = 10) -> list:
        execution_trace = []
        for r in range(real_rounds):
            self.rng = (self.rng * 1103515245 + 12345) & 0x7FFFFFFF
            if ((self.rng >> 16) % 100) < (self.dummy_prob * 100):
                execution_trace.append(f"DUMMY_ROUND")
            execution_trace.append(f"REAL_ROUND_{r}")
        return execution_trace

injector = DummyCycleInjector(dummy_probability=0.3)
trace = injector.execute_round_with_dummies(real_rounds=6)
print("\nSNIPPET 4:")
print(f"Execution Stream: {trace}")
print(f"Contains Dummies: {'DUMMY_ROUND' in trace}")
print(f"Total Cycles:     {len(trace)} (expanded from 6)")

# Snippet 5: ApexHidingCountermeasuresEngine
class ApexHidingCountermeasuresEngine:
    def __init__(self):
        pass

    def evaluate_countermeasure_efficiency(self, snr_baseline: float = 2.5) -> dict:
        # Shuffling reduces SNR by factor of 16 (for 16 independent S-Box operations)
        snr_after_shuffling = snr_baseline / 16.0
        # Clock jitter introduces temporal blur, reducing peak correlation by factor of 5
        snr_after_jitter = snr_after_shuffling / 5.0
        # Dummy operations dilute power profile by 30%
        snr_final = snr_after_jitter * 0.70

        traces_needed_baseline = int((3.0 / snr_baseline) ** 2 * 100)
        traces_needed_hardened = int((3.0 / snr_final) ** 2 * 100)

        return {
            "BaselineSNR": snr_baseline,
            "HardenedSNR": round(snr_final, 5),
            "TracesNeededBaseline": traces_needed_baseline,
            "TracesNeededHardened": traces_needed_hardened,
            "SecurityGainFactor": round(traces_needed_hardened / traces_needed_baseline, 1)
        }

engine = ApexHidingCountermeasuresEngine()
perf = engine.evaluate_countermeasure_efficiency(snr_baseline=2.5)
print("\nSNIPPET 5:")
print(f"Baseline SNR:           {perf['BaselineSNR']}")
print(f"Hardened Residual SNR:  {perf['HardenedSNR']}")
print(f"Traces to Extract (Raw):      {perf['TracesNeededBaseline']}")
print(f"Traces to Extract (Hardened): {perf['TracesNeededHardened']}")
print(f"Security Margin Gain:   {perf['SecurityGainFactor']}x")
