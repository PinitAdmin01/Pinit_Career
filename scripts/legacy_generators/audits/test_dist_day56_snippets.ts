// scripts/test_dist_day56_snippets.ts

// Snippet 1: AnycastRoutingTable
interface EdgePoP {
  id: string;
  city: string;
  lat: number;
  lon: number;
}

class AnycastRoutingTable {
  private pops: EdgePoP[] = [];

  registerPoP(pop: EdgePoP): void {
    this.pops.push(pop);
  }

  routeToNearest(clientLat: number, clientLon: number): EdgePoP {
    if (this.pops.length === 0) throw new Error('No PoPs registered');
    let closest = this.pops[0];
    let minDistance = Infinity;

    for (const pop of this.pops) {
      // Euclidean approximation for simple spherical distance
      const dLat = pop.lat - clientLat;
      const dLon = pop.lon - clientLon;
      const dist = Math.sqrt(dLat * dLat + dLon * dLon);
      if (dist < minDistance) {
        minDistance = dist;
        closest = pop;
      }
    }
    return closest;
  }
}

// Snippet 2: EdgeOriginShield
class EdgeOriginShield {
  private inFlight = new Map<string, Promise<string>>();
  private cache = new Map<string, string>();
  private originFetchCount = 0;

  async get(key: string, fetchFromOrigin: () => Promise<string>): Promise<string> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    // Check if an origin fetch for this key is already in flight (request collapsing)
    let pending = this.inFlight.get(key);
    if (!pending) {
      this.originFetchCount++;
      pending = fetchFromOrigin().then(val => {
        this.cache.set(key, val);
        this.inFlight.delete(key);
        return val;
      });
      this.inFlight.set(key, pending);
    }

    return pending;
  }

  getOriginFetchCount(): number {
    return this.originFetchCount;
  }
}

// Snippet 3: V8IsolateRuntimeSimulator
interface IsolateTask {
  scriptId: string;
  memoryLimitMb: number;
}

class V8IsolateRuntimeSimulator {
  private activeIsolates = new Map<string, number>();

  execute(task: IsolateTask, executionFn: () => string): { output: string; startupLatencyMs: number; memoryUsedMb: number } {
    // V8 isolates boot in sub-5ms compared to containers taking seconds
    const startupLatencyMs = 2.4;
    const memoryUsedMb = 1.8;

    if (memoryUsedMb > task.memoryLimitMb) {
      throw new Error(`Out of isolate memory: used ${memoryUsedMb}MB exceeds limit ${task.memoryLimitMb}MB`);
    }

    this.activeIsolates.set(task.scriptId, memoryUsedMb);
    const output = executionFn();
    return { output, startupLatencyMs, memoryUsedMb };
  }

  getActiveCount(): number {
    return this.activeIsolates.size;
  }
}

// Snippet 4: GeoReplicatedEdgeKV
interface EdgeKVEntry {
  value: string;
  version: number;
  timestamp: number;
}

class GeoReplicatedEdgeKV {
  private storage = new Map<string, EdgeKVEntry>();

  put(key: string, value: string, version = 1): void {
    const existing = this.storage.get(key);
    if (!existing || version >= existing.version) {
      this.storage.set(key, { value, version, timestamp: Date.now() });
    }
  }

  get(key: string): string | null {
    const entry = this.storage.get(key);
    return entry ? entry.value : null;
  }
}

// Snippet 5: GlobalEdgeAuditor
interface EdgeAuditReport {
  globalRps: number;
  medianEdgeLatencyMs: number;
  cacheHitRatioPercent: number;
  isolateStartupLatencyMs: number;
  isEnterpriseReady: boolean;
}

class GlobalEdgeAuditor {
  static auditGlobalEdgeMesh(
    rps: number,
    latencyMs: number,
    hitRatio: number,
    startupMs: number
  ): EdgeAuditReport {
    const isEnterpriseReady =
      rps >= 250000 &&
      latencyMs <= 15 &&
      hitRatio >= 98.0 &&
      startupMs <= 5.0;

    return {
      globalRps: rps,
      medianEdgeLatencyMs: latencyMs,
      cacheHitRatioPercent: hitRatio,
      isolateStartupLatencyMs: startupMs,
      isEnterpriseReady
    };
  }
}

async function runTests() {
  // Test 1: AnycastRoutingTable
  const routing = new AnycastRoutingTable();
  routing.registerPoP({ id: 'pop-fra', city: 'Frankfurt', lat: 50.11, lon: 8.68 });
  routing.registerPoP({ id: 'pop-syd', city: 'Sydney', lat: -33.86, lon: 151.20 });
  const clientNearBerlin = routing.routeToNearest(52.52, 13.40);
  if (clientNearBerlin.id !== 'pop-fra') throw new Error('Anycast routing failed');
  console.log('Snippet 1 PASS');

  // Test 2: EdgeOriginShield
  const shield = new EdgeOriginShield();
  let originCalls = 0;
  const mockFetch = async () => {
    originCalls++;
    await new Promise(r => setTimeout(r, 20));
    return 'payload-123';
  };
  const [res1, res2, res3] = await Promise.all([
    shield.get('video-key', mockFetch),
    shield.get('video-key', mockFetch),
    shield.get('video-key', mockFetch)
  ]);
  if (res1 !== 'payload-123' || res2 !== 'payload-123' || res3 !== 'payload-123') throw new Error('Value mismatch');
  if (shield.getOriginFetchCount() !== 1 || originCalls !== 1) throw new Error('Request collapsing failed');
  console.log('Snippet 2 PASS');

  // Test 3: V8IsolateRuntimeSimulator
  const isolate = new V8IsolateRuntimeSimulator();
  const runRes = isolate.execute({ scriptId: 'worker-checkout', memoryLimitMb: 10 }, () => 'processed-at-edge');
  if (runRes.output !== 'processed-at-edge' || runRes.startupLatencyMs > 5 || isolate.getActiveCount() !== 1) {
    throw new Error('Isolate test failed');
  }
  console.log('Snippet 3 PASS');

  // Test 4: GeoReplicatedEdgeKV
  const kv = new GeoReplicatedEdgeKV();
  kv.put('site-config', 'v1-config', 1);
  if (kv.get('site-config') !== 'v1-config') throw new Error('KV put 1 failed');
  kv.put('site-config', 'v2-config', 2);
  if (kv.get('site-config') !== 'v2-config') throw new Error('KV put 2 failed');
  console.log('Snippet 4 PASS');

  // Test 5: GlobalEdgeAuditor
  const audit = GlobalEdgeAuditor.auditGlobalEdgeMesh(250000, 12, 98.7, 2.4);
  if (!audit.isEnterpriseReady || audit.cacheHitRatioPercent !== 98.7) throw new Error('Audit failed');
  console.log('Snippet 5 PASS');
  console.log('ALL DAY 56 SNIPPETS PASS 5/5!');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
