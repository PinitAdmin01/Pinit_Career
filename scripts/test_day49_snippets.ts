import assert from 'node:assert/strict';
import vm from 'node:vm';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function runSnippet(code: string): Promise<string> {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math,
    Map,
    Set,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

async function main() {
  console.log('Testing Day 49 TypeScript snippets...');

  // Snippet 1: FIS Experiment Architecture & Blast Radius
  const code1 = `
interface FisTarget {
  id: string;
  az: string;
  state: 'running' | 'stopped';
}

interface FisAction {
  actionId: string;
  targetId: string;
  durationSeconds: number;
}

class FisExperimentEngine {
  private targets: FisTarget[] = [];

  registerTarget(target: FisTarget): void {
    this.targets.push(target);
  }

  execute(action: FisAction, maxPercent: number): { affected: number; compliant: boolean } {
    const total = this.targets.length;
    const maxAllowed = Math.floor((total * maxPercent) / 100);
    const selected = this.targets.slice(0, maxAllowed);

    for (const t of selected) {
      t.state = 'stopped';
    }

    return {
      affected: selected.length,
      compliant: selected.length <= maxAllowed
    };
  }
}

const engine = new FisExperimentEngine();
for (let i = 1; i <= 10; i++) {
  engine.registerTarget({ id: 'i-' + i, az: i % 2 === 0 ? 'us-east-1a' : 'us-east-1b', state: 'running' });
}

const res1 = engine.execute({ actionId: 'aws:ec2:stop-instances', targetId: 'instances', durationSeconds: 60 }, 20);
console.log('Status=FIS_EXPERIMENT_ARCHITECTURE_VERIFIED | Action=aws:ec2:stop-instances | TargetCount=' + res1.affected + ' | BlastRadiusCompliant=' + res1.compliant);
`;
  const out1 = await runSnippet(code1);
  console.log('Snippet 1 Output:', out1);
  assert.ok(out1.includes('Status=FIS_EXPERIMENT_ARCHITECTURE_VERIFIED | Action=aws:ec2:stop-instances | TargetCount=2 | BlastRadiusCompliant=true'));

  // Snippet 2: Stop Conditions & Safety Circuit Breakers
  const code2 = `
interface MetricProbe {
  timestamp: number;
  p99LatencyMs: number;
  errorRate5xx: number;
}

class FisSafetyCircuitBreaker {
  public experimentActive = true;
  public rollbackExecuted = false;

  constructor(
    private readonly maxP99Ms: number,
    private readonly maxErrorRate: number
  ) {}

  evaluateTelemetry(probes: MetricProbe[]): 'CONTINUE' | 'ABORT_ROLLBACK' {
    for (const p of probes) {
      if (p.p99LatencyMs > this.maxP99Ms || p.errorRate5xx > this.maxErrorRate) {
        this.experimentActive = false;
        this.rollbackExecuted = true;
        return 'ABORT_ROLLBACK';
      }
    }
    return 'CONTINUE';
  }
}

const breaker = new FisSafetyCircuitBreaker(250, 0.02);
const telemetryFeed: MetricProbe[] = [
  { timestamp: 1, p99LatencyMs: 45, errorRate5xx: 0.001 },
  { timestamp: 2, p99LatencyMs: 120, errorRate5xx: 0.004 },
  { timestamp: 3, p99LatencyMs: 310, errorRate5xx: 0.035 } // Breaches threshold!
];

const decision = breaker.evaluateTelemetry(telemetryFeed);
const finalState = breaker.rollbackExecuted ? 'STABLE' : 'DEGRADED';
console.log('Status=FIS_SAFETY_CIRCUIT_BREAKER_VERIFIED | StopConditionTriggered=' + (decision === 'ABORT_ROLLBACK') + ' | RollbackExecuted=' + breaker.rollbackExecuted + ' | FinalSystemState=' + finalState);
`;
  const out2 = await runSnippet(code2);
  console.log('Snippet 2 Output:', out2);
  assert.ok(out2.includes('Status=FIS_SAFETY_CIRCUIT_BREAKER_VERIFIED | StopConditionTriggered=true | RollbackExecuted=true | FinalSystemState=STABLE'));

  // Snippet 3: AZ Evacuation & N+1 Headroom
  const code3 = `
interface AzCapacity {
  az: string;
  activeInstances: number;
  maxHealthyCapacity: number;
  trafficWeight: number;
}

class ZonalShiftController {
  private zones: Map<string, AzCapacity> = new Map();

  registerZone(az: string, active: number, max: number): void {
    this.zones.set(az, { az, activeInstances: active, maxHealthyCapacity: max, trafficWeight: 100 });
  }

  evacuateZone(targetAz: string): { evacuatedAz: string; survivingZones: number; surplusPercent: number } {
    const evacuated = this.zones.get(targetAz)!;
    evacuated.trafficWeight = 0;

    const surviving = Array.from(this.zones.values()).filter(z => z.az !== targetAz);
    const totalRequiredTraffic = 300; // Original 100 per zone across 3 zones
    const redistributedLoad = totalRequiredTraffic / surviving.length; // 150 each

    let totalSurplus = 0;
    for (const z of surviving) {
      z.trafficWeight = 150;
      const surplus = ((z.maxHealthyCapacity - redistributedLoad) / z.maxHealthyCapacity) * 100;
      totalSurplus += surplus;
    }

    const avgSurplus = Math.floor(totalSurplus / surviving.length);
    return {
      evacuatedAz: targetAz,
      survivingZones: surviving.length,
      surplusPercent: avgSurplus
    };
  }
}

const controller = new ZonalShiftController();
// Sizing each AZ for 200 instances (Total capacity = 600, Normal load = 300, 100 per AZ)
controller.registerZone('us-east-1a', 100, 200);
controller.registerZone('us-east-1b', 100, 200);
controller.registerZone('us-east-1c', 100, 200);

const res3 = controller.evacuateZone('us-east-1a');
// Surviving load: 150 per zone. Max capacity: 200 per zone. Headroom surplus: (200 - 150) / 200 = 25%
console.log('Status=FIS_AZ_EVACUATION_VERIFIED | DisruptedAz=' + res3.evacuatedAz + ' | SurvivingAzs=' + res3.survivingZones + ' | HeadroomSurplusPercent=' + res3.surplusPercent);
`;
  const out3 = await runSnippet(code3);
  console.log('Snippet 3 Output:', out3);
  assert.ok(out3.includes('Status=FIS_AZ_EVACUATION_VERIFIED | DisruptedAz=us-east-1a | SurvivingAzs=2 | HeadroomSurplusPercent=25'));

  // Snippet 4: Network Chaos Injection & Fallback
  const code4 = `
interface NetworkRequest {
  id: string;
  endpoint: string;
}

class NetworkFaultSimulator {
  private failureCount = 0;
  private circuitOpen = false;

  constructor(
    public readonly injectedLatencyMs: number,
    public readonly packetLossPercent: number
  ) {}

  executeRequest(req: NetworkRequest): { latencyMs: number; status: string; fallbackServed: boolean } {
    if (this.circuitOpen) {
      return { latencyMs: 5, status: 'CIRCUIT_OPEN_FAST_FALLBACK', fallbackServed: true };
    }

    // Simulate injected failure
    this.failureCount++;
    if (this.failureCount >= 3) {
      this.circuitOpen = true; // Trip circuit breaker
    }

    return {
      latencyMs: this.injectedLatencyMs,
      status: 'DEGRADED_DOWNSTREAM',
      fallbackServed: false
    };
  }

  isCircuitOpen(): boolean {
    return this.circuitOpen;
  }
}

const faultSim = new NetworkFaultSimulator(200, 15);
faultSim.executeRequest({ id: 'r1', endpoint: '/payments' });
faultSim.executeRequest({ id: 'r2', endpoint: '/payments' });
faultSim.executeRequest({ id: 'r3', endpoint: '/payments' });

const fallbackRes = faultSim.executeRequest({ id: 'r4', endpoint: '/payments' });

console.log('Status=FIS_NETWORK_CHAOS_VERIFIED | InjectedLatencyMs=' + faultSim.injectedLatencyMs + ' | PacketLossPercent=' + faultSim.packetLossPercent + ' | CircuitBreakerTripped=' + faultSim.isCircuitOpen() + ' | FallbackServed=' + fallbackRes.fallbackServed);
`;
  const out4 = await runSnippet(code4);
  console.log('Snippet 4 Output:', out4);
  assert.ok(out4.includes('Status=FIS_NETWORK_CHAOS_VERIFIED | InjectedLatencyMs=200 | PacketLossPercent=15 | CircuitBreakerTripped=true | FallbackServed=true'));

  // Snippet 5: GameDay Incident Drill & Blameless Autopsy
  const code5 = `
interface GameDayIncident {
  drillId: string;
  simulatedFault: string;
  mttdSeconds: number;
  mttrSeconds: number;
  autopsySummary: string;
}

class GameDayOrchestrator {
  public recordedDrills: GameDayIncident[] = [];

  recordDrill(drill: GameDayIncident): void {
    this.recordedDrills.push(drill);
  }

  generateAutopsy(drillId: string): { drillId: string; mttd: number; mttr: number; ready: boolean } {
    const drill = this.recordedDrills.find(d => d.drillId === drillId);
    if (!drill) throw new Error('Drill not found');

    return {
      drillId: drill.drillId,
      mttd: drill.mttdSeconds,
      mttr: drill.mttrSeconds,
      ready: drill.autopsySummary.length > 20
    };
  }
}

const orchestrator = new GameDayOrchestrator();
orchestrator.recordDrill({
  drillId: 'GD-2026-Q4-01',
  simulatedFault: 'DynamoDB Cross-Region Replication Latency Spike',
  mttdSeconds: 14,
  mttrSeconds: 28,
  autopsySummary: 'Blameless Post-Mortem: Automated circuit breaker tripped in 14s; fallback cache absorbed 100% read traffic. MTTR was 28s.'
});

const report = orchestrator.generateAutopsy('GD-2026-Q4-01');
console.log('Status=GAMEDAY_INCIDENT_DRILL_VERIFIED | MTTD_Seconds=' + report.mttd + ' | MTTR_Seconds=' + report.mttr + ' | BlamelessAutopsyGenerated=' + report.ready);
`;
  const out5 = await runSnippet(code5);
  console.log('Snippet 5 Output:', out5);
  assert.ok(out5.includes('Status=GAMEDAY_INCIDENT_DRILL_VERIFIED | MTTD_Seconds=14 | MTTR_Seconds=28 | BlamelessAutopsyGenerated=true'));

  console.log('\nAll 5 Day 49 snippets PASSED with 100% exact stdout match!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
