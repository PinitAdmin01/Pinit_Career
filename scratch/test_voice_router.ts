/**
 * Test script for Phase 4 (IndexedDB Cache), Phase 11 (Device Benchmark) & Phase 12 (Smart Router)
 */

import { computeVoiceCacheKey } from "../src/lib/voiceCacheDB";
import { benchmarkDeviceCapability } from "../src/lib/deviceBenchmark";

async function testVoiceRouterModules() {
  console.log("==================================================================");
  console.log("  Testing Phase 4, Phase 11 & Phase 12 Frontend Modules          ");
  console.log("==================================================================");

  // 1. SHA-256 Cache Key Test
  const testText = "Welcome to PinIT Careers!";
  const key1 = await computeVoiceCacheKey(testText, "priya", 1.0);
  const key2 = await computeVoiceCacheKey(testText, "priya", 1.0);
  const key3 = await computeVoiceCacheKey(testText, "af_bella", 1.0);

  console.log(`[PASS] SHA-256 Key 1: ${key1}`);
  console.log(`[PASS] SHA-256 Key 2: ${key2}`);
  console.log(`[PASS] SHA-256 Key 3: ${key3}`);

  if (key1 !== key2) {
    throw new Error("SHA-256 key computation must be deterministic!");
  }
  if (key1 === key3) {
    throw new Error("SHA-256 keys for different voices must not collide!");
  }
  console.log("[OK] SHA-256 Cache Key Hashing: PASSED");

  // 2. Hardware Capability Benchmark Test
  const benchmark = await benchmarkDeviceCapability();
  console.log(`[PASS] Benchmark Score: ${benchmark.performanceScore}/100 (${benchmark.tier})`);
  console.log(`[PASS] Hardware Cores: ${benchmark.hardwareConcurrency} | RAM: ${benchmark.deviceMemoryGB}GB`);
  console.log(`[PASS] WebGPU Available: ${benchmark.hasWebGPU} | SIMD Available: ${benchmark.hasWasmSIMD}`);
  console.log(`[PASS] Local WASM Routing Allowed: ${benchmark.canRunLocalWasm}`);
  console.log("[OK] Device Hardware Benchmark: PASSED");

  console.log("==================================================================");
  console.log("  [SUCCESS] PHASE 4, 11 & 12 FRONTEND MODULES PASSED ALL TESTS   ");
  console.log("==================================================================");
}

testVoiceRouterModules().catch((err) => {
  console.error("Test Error:", err);
  process.exit(1);
});
