/**
 * PinIT Careers AI Voice System - Phase 11: Device Capability Benchmarking Engine
 * Evaluates student hardware performance to determine Client (WASM/WebGPU) vs Cloud execution routing.
 */

export interface DeviceBenchmarkReport {
  performanceScore: number; // 0 - 100
  canRunLocalWasm: boolean;
  hasWebGPU: boolean;
  hasWasmSIMD: boolean;
  hardwareConcurrency: number;
  deviceMemoryGB: number;
  benchmarkDurationMs: number;
  tier: "HIGH_END" | "MID_TIER" | "LOW_END";
}

const BENCHMARK_CACHE_KEY = "pinit_device_perf_report_v1";

/**
 * Quick WebAssembly SIMD feature detection test.
 */
function detectWasmSIMD(): boolean {
  try {
    return (
      typeof WebAssembly === "object" &&
      typeof WebAssembly.validate === "function" &&
      WebAssembly.validate(
        new Uint8Array([
          0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
          10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
        ])
      )
    );
  } catch {
    return false;
  }
}

/**
 * Quick WebGPU API support check.
 */
function detectWebGPU(): boolean {
  if (typeof navigator === "undefined") return false;
  return "gpu" in navigator && (navigator as any).gpu !== undefined;
}

/**
 * Runs a 15ms CPU/Memory micro-benchmark calculation.
 */
function runMicroBenchmark(): number {
  const start = performance.now();
  let acc = 1.0;
  const size = 150000;
  for (let i = 0; i < size; i++) {
    acc += Math.sqrt(i) * Math.sin(i);
  }
  const duration = performance.now() - start;
  return Math.max(0.1, duration);
}

/**
 * Benchmarks the student's hardware and returns a full capability report.
 */
export async function benchmarkDeviceCapability(): Promise<DeviceBenchmarkReport> {
  // Check cached benchmark result
  if (typeof localStorage !== "undefined") {
    const cached = localStorage.getItem(BENCHMARK_CACHE_KEY);
    if (cached) {
      try {
        const report: DeviceBenchmarkReport = JSON.parse(cached);
        return report;
      } catch {
        // Fallthrough to re-run
      }
    }
  }

  const startBenchmarkTime = performance.now();
  const hasWebGPU = detectWebGPU();
  const hasWasmSIMD = detectWasmSIMD();
  
  const hardwareConcurrency = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
  const deviceMemoryGB = typeof navigator !== "undefined" ? (navigator as any).deviceMemory || 4 : 4;
  
  const calcDurationMs = runMicroBenchmark();
  
  // Calculate weighted Performance Score (0 - 100)
  let score = 50;
  
  // CPU Cores weighting (max 25 pts)
  score += Math.min(25, (hardwareConcurrency / 8) * 25);
  
  // Device RAM weighting (max 25 pts)
  score += Math.min(25, (deviceMemoryGB / 8) * 25);
  
  // WebGPU Bonus (max 20 pts)
  if (hasWebGPU) score += 20;
  
  // SIMD Bonus (max 10 pts)
  if (hasWasmSIMD) score += 10;
  
  // Benchmark execution speed penalty (fast = bonus, slow = penalty)
  if (calcDurationMs < 10) score += 10;
  else if (calcDurationMs > 30) score -= 15;

  const performanceScore = Math.min(100, Math.max(10, Math.round(score)));
  
  let tier: "HIGH_END" | "MID_TIER" | "LOW_END" = "MID_TIER";
  if (performanceScore >= 75) tier = "HIGH_END";
  else if (performanceScore < 45) tier = "LOW_END";
  
  const canRunLocalWasm = performanceScore >= 75 && (hasWebGPU || hasWasmSIMD);
  const benchmarkDurationMs = Math.round(performance.now() - startBenchmarkTime);

  const report: DeviceBenchmarkReport = {
    performanceScore,
    canRunLocalWasm,
    hasWebGPU,
    hasWasmSIMD,
    hardwareConcurrency,
    deviceMemoryGB,
    benchmarkDurationMs,
    tier,
  };

  // Cache report in localStorage
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(BENCHMARK_CACHE_KEY, JSON.stringify(report));
    } catch {
      // Ignore write error
    }
  }

  console.log(`[PinIT Voice Router] Device Hardware Benchmark Score: ${performanceScore}/100 (${tier}). Local WASM Allowed: ${canRunLocalWasm}`);
  return report;
}
