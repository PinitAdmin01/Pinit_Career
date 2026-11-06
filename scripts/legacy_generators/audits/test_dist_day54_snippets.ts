// scripts/test_dist_day54_snippets.ts

// Snippet 1: SteadyStateMonitor
interface MetricSnapshot {
  errorRatePercent: number;
  p99LatencyMs: number;
  requestsPerSecond: number;
}

class SteadyStateMonitor {
  private baseline: MetricSnapshot;
  private maxAllowedErrorRate: number;
  private maxAllowedP99Ms: number;

  constructor(baseline: MetricSnapshot, maxAllowedErrorRate = 1.0, maxAllowedP99Ms = 200) {
    this.baseline = baseline;
    this.maxAllowedErrorRate = maxAllowedErrorRate;
    this.maxAllowedP99Ms = maxAllowedP99Ms;
  }

  isHypothesisHolding(current: MetricSnapshot): { holds: boolean; reason?: string } {
    if (current.errorRatePercent > this.maxAllowedErrorRate) {
      return { holds: false, reason: `Error rate ${current.errorRatePercent}% breached limit ${this.maxAllowedErrorRate}%` };
    }
    if (current.p99LatencyMs > this.maxAllowedP99Ms) {
      return { holds: false, reason: `p99 latency ${current.p99LatencyMs}ms breached limit ${this.maxAllowedP99Ms}ms` };
    }
    return { holds: true };
  }
}

// Snippet 2: NetworkChaosInjector
interface ChaosConfig {
  latencyMs: number;
  packetLossPercent: number;
}

class NetworkChaosInjector {
  private config: ChaosConfig;

  constructor(config: ChaosConfig) {
    this.config = config;
  }

  async executeWithChaos<T>(action: () => Promise<T>, randomFactor = Math.random()): Promise<{ result?: T; injectedDelayMs: number; dropped: boolean }> {
    if (randomFactor * 100 < this.config.packetLossPercent) {
      return { injectedDelayMs: 0, dropped: true };
    }

    const delay = this.config.latencyMs;
    // Simulate delay
    const res = await action();
    return { result: res, injectedDelayMs: delay, dropped: false };
  }
}

// Snippet 3: KubernetesPodEvictionSimulator
interface Pod {
  id: string;
  node: string;
  status: 'Running' | 'Evicted' | 'Terminated';
}

class KubernetesPodEvictionSimulator {
  private pods: Map<string, Pod> = new Map();
  private minAvailable: number;

  constructor(initialPods: Pod[], minAvailable: number) {
    for (const p of initialPods) this.pods.set(p.id, { ...p });
    this.minAvailable = minAvailable;
  }

  evictPod(podId: string): { success: boolean; activePods: number; message: string } {
    const runningPods = Array.from(this.pods.values()).filter(p => p.status === 'Running');
    if (runningPods.length <= this.minAvailable) {
      return {
        success: false,
        activePods: runningPods.length,
        message: `PodDisruptionBudget violation: cannot evict pod ${podId}, minAvailable ${this.minAvailable} reached.`
      };
    }

    const pod = this.pods.get(podId);
    if (!pod || pod.status !== 'Running') {
      return { success: false, activePods: runningPods.length, message: `Pod ${podId} not running.` };
    }

    pod.status = 'Evicted';
    return {
      success: true,
      activePods: runningPods.length - 1,
      message: `Pod ${podId} evicted successfully under PDB allowance.`
    };
  }

  getRunningCount(): number {
    return Array.from(this.pods.values()).filter(p => p.status === 'Running').length;
  }
}

// Snippet 4: ChaosResilientCircuitBreaker
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class ChaosResilientCircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private readonly threshold: number;
  private readonly fallbackValue: string;

  constructor(threshold = 3, fallbackValue = 'fallback_response') {
    this.threshold = threshold;
    this.fallbackValue = fallbackValue;
  }

  async call(action: () => Promise<string>): Promise<{ data: string; fromFallback: boolean; state: CircuitState }> {
    if (this.state === 'OPEN') {
      return { data: this.fallbackValue, fromFallback: true, state: this.state };
    }

    try {
      const data = await action();
      this.failureCount = 0;
      this.state = 'CLOSED';
      return { data, fromFallback: false, state: this.state };
    } catch {
      this.failureCount++;
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
      }
      return { data: this.fallbackValue, fromFallback: true, state: this.state };
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Snippet 5: ChaosResilienceAuditor
interface ChaosAuditResult {
  experimentName: string;
  steadyStateBreached: boolean;
  blastRadiusPercent: number;
  recoveryLatencyMs: number;
  isResilient: boolean;
}

class ChaosResilienceAuditor {
  static evaluateExperiment(
    name: string,
    breached: boolean,
    impactedFraction: number,
    recoveryMs: number
  ): ChaosAuditResult {
    const blastRadiusPercent = impactedFraction * 100;
    const isResilient = !breached && blastRadiusPercent <= 5 && recoveryMs <= 500;
    return {
      experimentName: name,
      steadyStateBreached: breached,
      blastRadiusPercent,
      recoveryLatencyMs: recoveryMs,
      isResilient
    };
  }
}

async function runTests() {
  // Test 1: SteadyStateMonitor
  const monitor = new SteadyStateMonitor({ errorRatePercent: 0.1, p99LatencyMs: 45, requestsPerSecond: 1000 });
  const check1 = monitor.isHypothesisHolding({ errorRatePercent: 0.2, p99LatencyMs: 80, requestsPerSecond: 1100 });
  if (!check1.holds) throw new Error('Check 1 should hold');
  const check2 = monitor.isHypothesisHolding({ errorRatePercent: 2.5, p99LatencyMs: 80, requestsPerSecond: 1100 });
  if (check2.holds) throw new Error('Check 2 should breach error rate');
  console.log('Snippet 1 PASS');

  // Test 2: NetworkChaosInjector
  const injector = new NetworkChaosInjector({ latencyMs: 50, packetLossPercent: 20 });
  const chaosRes1 = await injector.executeWithChaos(async () => 'ok', 0.1); // < 20% -> dropped
  if (!chaosRes1.dropped) throw new Error('Should be dropped');
  const chaosRes2 = await injector.executeWithChaos(async () => 'ok', 0.5); // > 20% -> ok
  if (chaosRes2.dropped || chaosRes2.result !== 'ok' || chaosRes2.injectedDelayMs !== 50) throw new Error('Should succeed');
  console.log('Snippet 2 PASS');

  // Test 3: KubernetesPodEvictionSimulator
  const simulator = new KubernetesPodEvictionSimulator([
    { id: 'pod-1', node: 'node-a', status: 'Running' },
    { id: 'pod-2', node: 'node-b', status: 'Running' },
    { id: 'pod-3', node: 'node-c', status: 'Running' }
  ], 2);
  const ev1 = simulator.evictPod('pod-1');
  if (!ev1.success || simulator.getRunningCount() !== 2) throw new Error('Eviction 1 failed');
  const ev2 = simulator.evictPod('pod-2'); // running is 2, minAvailable is 2 -> rejected
  if (ev2.success || simulator.getRunningCount() !== 2) throw new Error('PDB should block eviction');
  console.log('Snippet 3 PASS');

  // Test 4: ChaosResilientCircuitBreaker
  const cb = new ChaosResilientCircuitBreaker(2, 'cached_fallback');
  await cb.call(async () => { throw new Error('fail 1'); });
  if (cb.getState() !== 'CLOSED') throw new Error('Should still be closed after 1 fail');
  const failRes = await cb.call(async () => { throw new Error('fail 2'); });
  if (cb.getState() !== 'OPEN' || !failRes.fromFallback || failRes.data !== 'cached_fallback') throw new Error('Should trip open');
  const openRes = await cb.call(async () => 'wont run');
  if (!openRes.fromFallback) throw new Error('Should return fallback immediately while open');
  console.log('Snippet 4 PASS');

  // Test 5: ChaosResilienceAuditor
  const audit = ChaosResilienceAuditor.evaluateExperiment('latency_pod_eviction_mesh', false, 0.02, 350);
  if (!audit.isResilient || audit.blastRadiusPercent !== 2) throw new Error('Audit evaluation failed');
  console.log('Snippet 5 PASS');
  console.log('ALL DAY 54 SNIPPETS PASS 5/5!');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
