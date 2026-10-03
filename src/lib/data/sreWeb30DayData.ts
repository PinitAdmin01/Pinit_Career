import { DayConfig, buildEnrichedDayQuests } from './curriculumEnricher';
import { SRE_DAYS } from './sreWebDays';

const lines = (...l: string[]) => l.join('\n');

export const SRE_WEB_30_DAYS_CONFIGS: DayConfig[] = [
  // ── DAY 1 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[0],
    eTitle: "Calculate SLI Availability Percentage",
    eDesc: "Write `calculateSliAvailability(successfulRequests: number, totalRequests: number): number` returning availability percentage rounded to 4 decimal places. If `totalRequests <= 0`, return `100`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateSliAvailability(successfulRequests: number, totalRequests: number): number {",
      "  // Calculate availability percentage",
      "  return 0;",
      "}"
    ),
    eHint: "Check for non-positive total, then compute (successful / total) * 100 and round.",
    eTest: lines(
      "if (typeof calculateSliAvailability !== 'function') throw new Error('calculateSliAvailability not found');",
      "if (calculateSliAvailability(9990, 10000) !== 99.9) throw new Error('Failed 9990/10000');",
      "if (calculateSliAvailability(950, 1000) !== 95) throw new Error('Failed 950/1000');",
      "if (calculateSliAvailability(0, 0) !== 100) throw new Error('Failed 0/0');",
      "if (calculateSliAvailability(4999, 5000) !== 99.98) throw new Error('Failed 4999/5000');"
    ),
    aTitle: "Evaluate SLO Compliance Delta",
    aDesc: "Write `evaluateSloCompliance(sliPercent: number, sloTargetPercent: number): { compliant: boolean; delta: number }` comparing SLI against target with delta rounded to 4 decimals.",
    aLanguage: "typescript",
    aStarter: lines(
      "function evaluateSloCompliance(sliPercent: number, sloTargetPercent: number): { compliant: boolean; delta: number } {",
      "  // Compare SLI to target",
      "  return { compliant: false, delta: 0 };",
      "}"
    ),
    aHint: "compliant is true if sliPercent >= sloTargetPercent; delta is sliPercent - sloTargetPercent.",
    aTest: lines(
      "if (typeof evaluateSloCompliance !== 'function') throw new Error('evaluateSloCompliance not found');",
      "const r1 = evaluateSloCompliance(99.95, 99.9);",
      "if (!r1.compliant || r1.delta !== 0.05) throw new Error('Failed 99.95 vs 99.9: ' + JSON.stringify(r1));",
      "const r2 = evaluateSloCompliance(99.8, 99.9);",
      "if (r2.compliant || r2.delta !== -0.1) throw new Error('Failed 99.8 vs 99.9: ' + JSON.stringify(r2));",
      "const r3 = evaluateSloCompliance(99.9, 99.9);",
      "if (!r3.compliant || r3.delta !== 0) throw new Error('Failed exact match: ' + JSON.stringify(r3));"
    )
  },

  // ── DAY 2 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[1],
    eTitle: "Calculate Error Budget and Allowed Failures",
    eDesc: "Write `calculateErrorBudget(totalRequests: number, sloTarget: number): { allowedErrors: number; errorBudgetPercent: number }` where `sloTarget` is a decimal (e.g. `0.999`).",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateErrorBudget(totalRequests: number, sloTarget: number): { allowedErrors: number; errorBudgetPercent: number } {",
      "  // Compute error budget",
      "  return { allowedErrors: 0, errorBudgetPercent: 0 };",
      "}"
    ),
    eHint: "allowedErrors is Math.floor(totalRequests * (1 - sloTarget)), budgetPercent is (1 - sloTarget) * 100.",
    eTest: lines(
      "if (typeof calculateErrorBudget !== 'function') throw new Error('calculateErrorBudget not found');",
      "const b1 = calculateErrorBudget(1000000, 0.999);",
      "if (b1.allowedErrors !== 1000 || b1.errorBudgetPercent !== 0.1) throw new Error('Failed 1M at 0.999: ' + JSON.stringify(b1));",
      "const b2 = calculateErrorBudget(500000, 0.99);",
      "if (b2.allowedErrors !== 5000 || b2.errorBudgetPercent !== 1) throw new Error('Failed 500k at 0.99: ' + JSON.stringify(b2));",
      "const b3 = calculateErrorBudget(2000000, 0.9999);",
      "if (b3.allowedErrors !== 200 || b3.errorBudgetPercent !== 0.01) throw new Error('Failed 2M at 0.9999: ' + JSON.stringify(b3));"
    ),
    aTitle: "Calculate Error Budget Burn Rate",
    aDesc: "Write `calculateBurnRate(currentErrorRate: number, allowedErrorRate: number): { burnRate: number; status: 'nominal' | 'elevated' | 'critical' }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateBurnRate(currentErrorRate: number, allowedErrorRate: number): { burnRate: number; status: 'nominal' | 'elevated' | 'critical' } {",
      "  // Compute burn rate",
      "  return { burnRate: 0, status: 'nominal' };",
      "}"
    ),
    aHint: "burnRate = current / allowed. >= 10 is critical, >= 2 is elevated, otherwise nominal.",
    aTest: lines(
      "if (typeof calculateBurnRate !== 'function') throw new Error('calculateBurnRate not found');",
      "const br1 = calculateBurnRate(0.001, 0.001);",
      "if (br1.burnRate !== 1 || br1.status !== 'nominal') throw new Error('Failed 1x burn: ' + JSON.stringify(br1));",
      "const br2 = calculateBurnRate(0.005, 0.001);",
      "if (br2.burnRate !== 5 || br2.status !== 'elevated') throw new Error('Failed 5x burn: ' + JSON.stringify(br2));",
      "const br3 = calculateBurnRate(0.015, 0.001);",
      "if (br3.burnRate !== 15 || br3.status !== 'critical') throw new Error('Failed 15x burn: ' + JSON.stringify(br3));"
    )
  },

  // ── DAY 3 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[2],
    eTitle: "Calculate Serial Subsystem Availability",
    eDesc: "Write `calculateSerialAvailability(availabilities: number[]): number` computing the product of serial availabilities, rounded to 6 decimal places. Empty array returns `1`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateSerialAvailability(availabilities: number[]): number {",
      "  // Product of serial components",
      "  return 0;",
      "}"
    ),
    eHint: "Multiply all availability fractions together and round to 6 decimal places.",
    eTest: lines(
      "if (typeof calculateSerialAvailability !== 'function') throw new Error('calculateSerialAvailability not found');",
      "if (calculateSerialAvailability([0.99, 0.99]) !== 0.9801) throw new Error('Failed [0.99, 0.99]');",
      "if (calculateSerialAvailability([0.999, 0.999, 0.999]) !== 0.997003) throw new Error('Failed [0.999, 0.999, 0.999]');",
      "if (calculateSerialAvailability([0.95, 0.90]) !== 0.855) throw new Error('Failed [0.95, 0.90]');",
      "if (calculateSerialAvailability([]) !== 1) throw new Error('Failed empty array');"
    ),
    aTitle: "Calculate Parallel Redundant Availability",
    aDesc: "Write `calculateParallelAvailability(availabilities: number[]): number` computing redundant availability `1 - product(1 - a_i)`, rounded to 6 decimal places. Empty array returns `0`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateParallelAvailability(availabilities: number[]): number {",
      "  // 1 - product of unavailabilities",
      "  return 0;",
      "}"
    ),
    aHint: "Calculate 1 - reduce((acc, a) => acc * (1 - a), 1).",
    aTest: lines(
      "if (typeof calculateParallelAvailability !== 'function') throw new Error('calculateParallelAvailability not found');",
      "if (calculateParallelAvailability([0.99, 0.99]) !== 0.9999) throw new Error('Failed [0.99, 0.99]');",
      "if (calculateParallelAvailability([0.9, 0.9, 0.9]) !== 0.999) throw new Error('Failed [0.9, 0.9, 0.9]');",
      "if (calculateParallelAvailability([0.8, 0.5]) !== 0.9) throw new Error('Failed [0.8, 0.5]');",
      "if (calculateParallelAvailability([]) !== 0) throw new Error('Failed empty array');"
    )
  },

  // ── DAY 4 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[3],
    eTitle: "Calculate Allowed Downtime in Minutes and Seconds",
    eDesc: "Write `calculateAllowedDowntime(sloPercent: number, periodDays: number = 30): { minutes: number; seconds: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateAllowedDowntime(sloPercent: number, periodDays: number = 30): { minutes: number; seconds: number } {",
      "  // Calculate allowed downtime",
      "  return { minutes: 0, seconds: 0 };",
      "}"
    ),
    eHint: "Compute total seconds in period, multiply by (100 - sloPercent) / 100, then derive minutes and seconds.",
    eTest: lines(
      "if (typeof calculateAllowedDowntime !== 'function') throw new Error('calculateAllowedDowntime not found');",
      "const d1 = calculateAllowedDowntime(99.9, 30);",
      "if (d1.minutes !== 43.2 || d1.seconds !== 2592) throw new Error('Failed 99.9% 30 days: ' + JSON.stringify(d1));",
      "const d2 = calculateAllowedDowntime(99.99, 30);",
      "if (d2.minutes !== 4.32 || d2.seconds !== 259) throw new Error('Failed 99.99% 30 days: ' + JSON.stringify(d2));",
      "const d3 = calculateAllowedDowntime(99.0, 1);",
      "if (d3.minutes !== 14.4 || d3.seconds !== 864) throw new Error('Failed 99% 1 day: ' + JSON.stringify(d3));"
    ),
    aTitle: "Convert Nines of Reliability to Availability Percentage",
    aDesc: "Write `ninesToAvailability(nines: number): number` converting an integer count of nines (e.g. 3 -> 99.9, 4 -> 99.99) rounded to 6 decimal places.",
    aLanguage: "typescript",
    aStarter: lines(
      "function ninesToAvailability(nines: number): number {",
      "  // Convert nines to percentage",
      "  return 0;",
      "}"
    ),
    aHint: "Formula: 100 - 100 * Math.pow(0.1, nines).",
    aTest: lines(
      "if (typeof ninesToAvailability !== 'function') throw new Error('ninesToAvailability not found');",
      "if (ninesToAvailability(2) !== 99) throw new Error('2 nines should be 99');",
      "if (ninesToAvailability(3) !== 99.9) throw new Error('3 nines should be 99.9');",
      "if (ninesToAvailability(4) !== 99.99) throw new Error('4 nines should be 99.99');",
      "if (ninesToAvailability(5) !== 99.999) throw new Error('5 nines should be 99.999');"
    )
  },

  // ── DAY 5 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[4],
    eTitle: "Evaluate Full Service SLI and Error Budget Health",
    eDesc: "Write `evaluateServiceReliability(sloTargetPercent: number, requests: { success: boolean; latencyMs: number }[], latencyThresholdMs: number): { availabilitySli: number; latencySli: number; compliant: boolean; budgetRemainingPercent: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateServiceReliability(sloTargetPercent: number, requests: { success: boolean; latencyMs: number }[], latencyThresholdMs: number): { availabilitySli: number; latencySli: number; compliant: boolean; budgetRemainingPercent: number } {",
      "  // Evaluate service SLIs",
      "  return { availabilitySli: 0, latencySli: 0, compliant: false, budgetRemainingPercent: 0 };",
      "}"
    ),
    eHint: "Compute success count / total for availabilitySli; count latencyMs <= threshold for latencySli; calculate remaining error budget percentage.",
    eTest: lines(
      "if (typeof evaluateServiceReliability !== 'function') throw new Error('evaluateServiceReliability not found');",
      "const r1 = evaluateServiceReliability(99, [",
      "  { success: true, latencyMs: 50 },",
      "  { success: true, latencyMs: 80 },",
      "  { success: true, latencyMs: 120 },",
      "  { success: false, latencyMs: 300 }",
      "], 100);",
      "if (r1.availabilitySli !== 75 || r1.latencySli !== 50 || r1.compliant !== false || r1.budgetRemainingPercent !== 0) throw new Error('Failed r1: ' + JSON.stringify(r1));",
      "const r2 = evaluateServiceReliability(90, [",
      "  { success: true, latencyMs: 20 },",
      "  { success: true, latencyMs: 30 },",
      "  { success: true, latencyMs: 40 },",
      "  { success: true, latencyMs: 50 }",
      "], 100);",
      "if (r2.availabilitySli !== 100 || r2.latencySli !== 100 || r2.compliant !== true || r2.budgetRemainingPercent !== 100) throw new Error('Failed r2: ' + JSON.stringify(r2));",
      "const r3 = evaluateServiceReliability(99, [], 100);",
      "if (r3.availabilitySli !== 100 || r3.compliant !== true) throw new Error('Failed empty requests');"
    ),
    aTitle: "Determine Error Budget Policy Action",
    aDesc: "Write `computeBudgetPolicyAction(burnRate: number, budgetRemainingPercent: number): { action: 'freeze_deployments' | 'throttle_releases' | 'normal_operations'; reason: string }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function computeBudgetPolicyAction(burnRate: number, budgetRemainingPercent: number): { action: 'freeze_deployments' | 'throttle_releases' | 'normal_operations'; reason: string } {",
      "  // Determine policy action",
      "  return { action: 'normal_operations', reason: '' };",
      "}"
    ),
    aHint: "Check if budget depleted or burnRate >= 14.4 (freeze), then burnRate >= 3 or budget <= 20 (throttle), else normal.",
    aTest: lines(
      "if (typeof computeBudgetPolicyAction !== 'function') throw new Error('computeBudgetPolicyAction not found');",
      "const a1 = computeBudgetPolicyAction(15, 50);",
      "if (a1.action !== 'freeze_deployments') throw new Error('15x burn should freeze: ' + JSON.stringify(a1));",
      "const a2 = computeBudgetPolicyAction(1, 0);",
      "if (a2.action !== 'freeze_deployments') throw new Error('0 budget should freeze: ' + JSON.stringify(a2));",
      "const a3 = computeBudgetPolicyAction(4, 80);",
      "if (a3.action !== 'throttle_releases') throw new Error('4x burn should throttle: ' + JSON.stringify(a3));",
      "const a4 = computeBudgetPolicyAction(1, 15);",
      "if (a4.action !== 'throttle_releases') throw new Error('15% budget should throttle: ' + JSON.stringify(a4));",
      "const a5 = computeBudgetPolicyAction(1, 95);",
      "if (a5.action !== 'normal_operations') throw new Error('Nominal should be normal: ' + JSON.stringify(a5));"
    )
  },

  // ── DAY 6 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[5],
    eTitle: "Diff Desired and Live Infrastructure State",
    eDesc: "Write `diffResourceState(desired: Record<string, any>, current: Record<string, any>): { create: string[]; update: string[]; delete: string[]; unchanged: string[] }` returning sorted arrays.",
    eLanguage: "typescript",
    eStarter: lines(
      "function diffResourceState(desired: Record<string, any>, current: Record<string, any>): { create: string[]; update: string[]; delete: string[]; unchanged: string[] } {",
      "  // Compare desired vs current resource state",
      "  return { create: [], update: [], delete: [], unchanged: [] };",
      "}"
    ),
    eHint: "Identify keys in desired only (create), current only (delete), or both (compare JSON for update vs unchanged).",
    eTest: lines(
      "if (typeof diffResourceState !== 'function') throw new Error('diffResourceState not found');",
      "const r1 = diffResourceState({ a: 1, b: 2, c: 3 }, { b: 2, c: 99, d: 4 });",
      "if (r1.create.join(',') !== 'a' || r1.update.join(',') !== 'c' || r1.delete.join(',') !== 'd' || r1.unchanged.join(',') !== 'b') throw new Error('Failed r1: ' + JSON.stringify(r1));",
      "const r2 = diffResourceState({}, { x: 1 });",
      "if (r2.delete.join(',') !== 'x' || r2.create.length !== 0) throw new Error('Failed delete only: ' + JSON.stringify(r2));",
      "const r3 = diffResourceState({ m: 1 }, {});",
      "if (r3.create.join(',') !== 'm' || r3.delete.length !== 0) throw new Error('Failed create only: ' + JSON.stringify(r3));"
    ),
    aTitle: "Topological Sort for Infrastructure Dependencies",
    aDesc: "Write `topologicalResourceSort(dependencies: Record<string, string[]>): string[]` returning an execution order where dependencies precede dependents.",
    aLanguage: "typescript",
    aStarter: lines(
      "function topologicalResourceSort(dependencies: Record<string, string[]>): string[] {",
      "  // Sort resources in dependency order",
      "  return [];",
      "}"
    ),
    aHint: "Use post-order depth-first search or Kahn's algorithm; dependencies[key] is list of items that 'key' depends on.",
    aTest: lines(
      "if (typeof topologicalResourceSort !== 'function') throw new Error('topologicalResourceSort not found');",
      "const order1 = topologicalResourceSort({ app: ['db'], db: [] });",
      "if (order1.indexOf('db') > order1.indexOf('app')) throw new Error('db must precede app: ' + JSON.stringify(order1));",
      "const order2 = topologicalResourceSort({ frontend: ['api'], api: ['db', 'cache'], db: [], cache: [] });",
      "if (order2.indexOf('db') > order2.indexOf('api') || order2.indexOf('cache') > order2.indexOf('api') || order2.indexOf('api') > order2.indexOf('frontend')) throw new Error('Invalid chain order: ' + JSON.stringify(order2));",
      "const order3 = topologicalResourceSort({ a: [], b: [] });",
      "if (order3.length !== 2) throw new Error('Failed independent items');"
    )
  },

  // ── DAY 7 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[6],
    eTitle: "Detect Configuration Drift Attributes",
    eDesc: "Write `detectConfigDrift(declared: Record<string, Record<string, any>>, live: Record<string, Record<string, any>>): { resourceId: string; property: string; expected: any; actual: any }[]`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function detectConfigDrift(declared: Record<string, Record<string, any>>, live: Record<string, Record<string, any>>): { resourceId: string; property: string; expected: any; actual: any }[] {",
      "  // Detect drift between declared and live",
      "  return [];",
      "}"
    ),
    eHint: "For each resource in declared, if missing in live report property '__missing__', else compare every property in declared.",
    eTest: lines(
      "if (typeof detectConfigDrift !== 'function') throw new Error('detectConfigDrift not found');",
      "const d1 = detectConfigDrift({ r1: { memory: 512, cpu: 1 } }, { r1: { memory: 256, cpu: 1 } });",
      "if (d1.length !== 1 || d1[0].property !== 'memory' || d1[0].expected !== 512 || d1[0].actual !== 256) throw new Error('Failed d1: ' + JSON.stringify(d1));",
      "const d2 = detectConfigDrift({ r1: { port: 80 } }, {});",
      "if (d2.length !== 1 || d2[0].property !== '__missing__') throw new Error('Failed missing resource: ' + JSON.stringify(d2));",
      "const d3 = detectConfigDrift({ r1: { env: 'prod' } }, { r1: { env: 'prod' } });",
      "if (d3.length !== 0) throw new Error('Identical should have no drift');"
    ),
    aTitle: "Classify Infrastructure Drift Severity",
    aDesc: "Write `classifyDriftSeverity(drifts: { property: string }[], criticalProps: string[] = ['securityGroup', 'iamRole', 'sslCertificate']): 'none' | 'cosmetic' | 'critical'`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function classifyDriftSeverity(drifts: { property: string }[], criticalProps: string[] = ['securityGroup', 'iamRole', 'sslCertificate']): 'none' | 'cosmetic' | 'critical' {",
      "  // Classify drift severity",
      "  return 'none';",
      "}"
    ),
    aHint: "Return 'none' if drifts is empty; 'critical' if any drift property matches criticalProps; otherwise 'cosmetic'.",
    aTest: lines(
      "if (typeof classifyDriftSeverity !== 'function') throw new Error('classifyDriftSeverity not found');",
      "if (classifyDriftSeverity([]) !== 'none') throw new Error('Empty should be none');",
      "if (classifyDriftSeverity([{ property: 'description' }, { property: 'tags' }]) !== 'cosmetic') throw new Error('Tags should be cosmetic');",
      "if (classifyDriftSeverity([{ property: 'tags' }, { property: 'iamRole' }]) !== 'critical') throw new Error('iamRole should be critical');",
      "if (classifyDriftSeverity([{ property: 'port' }], ['port']) !== 'critical') throw new Error('Custom critical prop failed');"
    )
  },

  // ── DAY 8 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[7],
    eTitle: "Evaluate Multi-Region Health and Failover Need",
    eDesc: "Write `evaluateRegionHealth(regions: { id: string; latencyMs: number; errorRate: number; isAlive: boolean }[]): { healthyRegions: string[]; failoverNeeded: boolean; primaryHealthy: boolean }` where region 0 is primary.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateRegionHealth(regions: { id: string; latencyMs: number; errorRate: number; isAlive: boolean }[]): { healthyRegions: string[]; failoverNeeded: boolean; primaryHealthy: boolean } {",
      "  // Check region health and failover necessity",
      "  return { healthyRegions: [], failoverNeeded: false, primaryHealthy: false };",
      "}"
    ),
    eHint: "A region is healthy if isAlive === true && latencyMs < 300 && errorRate < 0.05. Primary is regions[0].",
    eTest: lines(
      "if (typeof evaluateRegionHealth !== 'function') throw new Error('evaluateRegionHealth not found');",
      "const r1 = evaluateRegionHealth([",
      "  { id: 'us-east', latencyMs: 50, errorRate: 0.01, isAlive: true },",
      "  { id: 'us-west', latencyMs: 70, errorRate: 0.02, isAlive: true }",
      "]);",
      "if (r1.healthyRegions.length !== 2 || !r1.primaryHealthy || r1.failoverNeeded) throw new Error('Failed healthy primary: ' + JSON.stringify(r1));",
      "const r2 = evaluateRegionHealth([",
      "  { id: 'us-east', latencyMs: 500, errorRate: 0.10, isAlive: true },",
      "  { id: 'us-west', latencyMs: 80, errorRate: 0.01, isAlive: true }",
      "]);",
      "if (r2.primaryHealthy || !r2.failoverNeeded || r2.healthyRegions[0] !== 'us-west') throw new Error('Failed degraded primary: ' + JSON.stringify(r2));",
      "const r3 = evaluateRegionHealth([]);",
      "if (r3.healthyRegions.length !== 0 || r3.primaryHealthy || r3.failoverNeeded) throw new Error('Failed empty regions');"
    ),
    aTitle: "Select Best Failover Target Region",
    aDesc: "Write `selectFailoverRegion(primaryId: string, regions: { id: string; healthScore: number; capacityPercent: number }[]): string | null` choosing candidate with highest healthScore (healthScore >= 80 and capacityPercent <= 80).",
    aLanguage: "typescript",
    aStarter: lines(
      "function selectFailoverRegion(primaryId: string, regions: { id: string; healthScore: number; capacityPercent: number }[]): string | null {",
      "  // Select best failover target",
      "  return null;",
      "}"
    ),
    aHint: "Filter out primaryId, ensure healthScore >= 80 and capacityPercent <= 80, sort by healthScore desc, then capacityPercent asc.",
    aTest: lines(
      "if (typeof selectFailoverRegion !== 'function') throw new Error('selectFailoverRegion not found');",
      "const s1 = selectFailoverRegion('us-east', [",
      "  { id: 'us-east', healthScore: 20, capacityPercent: 90 },",
      "  { id: 'us-west', healthScore: 85, capacityPercent: 50 },",
      "  { id: 'eu-central', healthScore: 95, capacityPercent: 40 }",
      "]);",
      "if (s1 !== 'eu-central') throw new Error('Should select highest health eu-central, got: ' + s1);",
      "const s2 = selectFailoverRegion('us-east', [",
      "  { id: 'us-west', healthScore: 70, capacityPercent: 30 }",
      "]);",
      "if (s2 !== null) throw new Error('Health under 80 must return null');",
      "const s3 = selectFailoverRegion('us-east', [",
      "  { id: 'us-west', healthScore: 90, capacityPercent: 95 }",
      "]);",
      "if (s3 !== null) throw new Error('Capacity over 80 must return null');"
    )
  },

  // ── DAY 9 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[8],
    eTitle: "Simulate Weighted DNS Routing Resolution",
    eDesc: "Write `resolveWeightedDns(endpoints: { ip: string; weight: number }[], randomVal: number = 0.5): string` selecting IP based on cumulative weight slice.",
    eLanguage: "typescript",
    eStarter: lines(
      "function resolveWeightedDns(endpoints: { ip: string; weight: number }[], randomVal: number = 0.5): string {",
      "  // Resolve DNS by weight",
      "  return '';",
      "}"
    ),
    eHint: "Compute total weight, threshold = randomVal * totalWeight, iterate cumulative weight until >= threshold.",
    eTest: lines(
      "if (typeof resolveWeightedDns !== 'function') throw new Error('resolveWeightedDns not found');",
      "const eps = [{ ip: '1.1.1.1', weight: 80 }, { ip: '2.2.2.2', weight: 20 }];",
      "if (resolveWeightedDns(eps, 0.1) !== '1.1.1.1') throw new Error('0.1 should select 1.1.1.1');",
      "if (resolveWeightedDns(eps, 0.85) !== '2.2.2.2') throw new Error('0.85 should select 2.2.2.2');",
      "if (resolveWeightedDns([]) !== '') throw new Error('Empty should return empty string');"
    ),
    aTitle: "Resolve Nearest Geographic Region via Euclidean Distance",
    aDesc: "Write `resolveGeographicDns(clientLat: number, clientLon: number, regions: { id: string; lat: number; lon: number }[]): string`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function resolveGeographicDns(clientLat: number, clientLon: number, regions: { id: string; lat: number; lon: number }[]): string {",
      "  // Find nearest region",
      "  return '';",
      "}"
    ),
    aHint: "Compute distance Math.sqrt((clientLat - lat)^2 + (clientLon - lon)^2) and find the minimum.",
    aTest: lines(
      "if (typeof resolveGeographicDns !== 'function') throw new Error('resolveGeographicDns not found');",
      "const regs = [",
      "  { id: 'us-east', lat: 38.0, lon: -78.0 },",
      "  { id: 'eu-west', lat: 53.0, lon: -8.0 },",
      "  { id: 'ap-south', lat: 19.0, lon: 72.0 }",
      "];",
      "if (resolveGeographicDns(40.7, -74.0, regs) !== 'us-east') throw new Error('NYC should map to us-east');",
      "if (resolveGeographicDns(51.5, -0.1, regs) !== 'eu-west') throw new Error('London should map to eu-west');",
      "if (resolveGeographicDns(12.9, 77.5, regs) !== 'ap-south') throw new Error('Bangalore should map to ap-south');",
      "if (resolveGeographicDns(0, 0, []) !== '') throw new Error('Empty should return empty string');"
    )
  },

  // ── DAY 10 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[9],
    eTitle: "Simulate Multi-Region Disaster Recovery Failover",
    eDesc: "Write `simulateMultiRegionFailover(regions: Record<string, { healthy: boolean; latencyMs: number }>, primaryRegion: string): { activeRegion: string; failoverExecuted: boolean; rtoSeconds: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function simulateMultiRegionFailover(regions: Record<string, { healthy: boolean; latencyMs: number }>, primaryRegion: string): { activeRegion: string; failoverExecuted: boolean; rtoSeconds: number } {",
      "  // Simulate multi-region failover",
      "  return { activeRegion: '', failoverExecuted: false, rtoSeconds: 0 };",
      "}"
    ),
    eHint: "If primary healthy return it with rtoSeconds: 0; else find healthy secondary with lowest latency (rtoSeconds: 30), or 'none' with -1.",
    eTest: lines(
      "if (typeof simulateMultiRegionFailover !== 'function') throw new Error('simulateMultiRegionFailover not found');",
      "const res1 = simulateMultiRegionFailover({ 'us-east': { healthy: true, latencyMs: 40 }, 'us-west': { healthy: true, latencyMs: 70 } }, 'us-east');",
      "if (res1.activeRegion !== 'us-east' || res1.failoverExecuted !== false || res1.rtoSeconds !== 0) throw new Error('Primary healthy failed: ' + JSON.stringify(res1));",
      "const res2 = simulateMultiRegionFailover({ 'us-east': { healthy: false, latencyMs: 999 }, 'us-west': { healthy: true, latencyMs: 75 }, 'eu-west': { healthy: true, latencyMs: 120 } }, 'us-east');",
      "if (res2.activeRegion !== 'us-west' || res2.failoverExecuted !== true || res2.rtoSeconds !== 30) throw new Error('Failover to us-west failed: ' + JSON.stringify(res2));",
      "const res3 = simulateMultiRegionFailover({ 'us-east': { healthy: false, latencyMs: 999 } }, 'us-east');",
      "if (res3.activeRegion !== 'none' || res3.rtoSeconds !== -1) throw new Error('No healthy failover failed: ' + JSON.stringify(res3));"
    ),
    aTitle: "Audit Recovery Time Objective (RTO) Compliance",
    aDesc: "Write `auditRtoCompliance(incidents: { id: string; targetRtoSeconds: number; actualRecoverySeconds: number }[]): { compliantCount: number; nonCompliantCount: number; complianceRatePercent: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function auditRtoCompliance(incidents: { id: string; targetRtoSeconds: number; actualRecoverySeconds: number }[]): { compliantCount: number; nonCompliantCount: number; complianceRatePercent: number } {",
      "  // Audit RTO compliance",
      "  return { compliantCount: 0, nonCompliantCount: 0, complianceRatePercent: 0 };",
      "}"
    ),
    aHint: "Compliant when actualRecoverySeconds <= targetRtoSeconds. Compliance rate is (compliant / total) * 100 rounded to 2 decimals.",
    aTest: lines(
      "if (typeof auditRtoCompliance !== 'function') throw new Error('auditRtoCompliance not found');",
      "const a1 = auditRtoCompliance([",
      "  { id: 'inc-1', targetRtoSeconds: 60, actualRecoverySeconds: 45 },",
      "  { id: 'inc-2', targetRtoSeconds: 60, actualRecoverySeconds: 75 },",
      "  { id: 'inc-3', targetRtoSeconds: 120, actualRecoverySeconds: 100 }",
      "]);",
      "if (a1.compliantCount !== 2 || a1.nonCompliantCount !== 1 || a1.complianceRatePercent !== 66.67) throw new Error('Failed a1: ' + JSON.stringify(a1));",
      "const a2 = auditRtoCompliance([]);",
      "if (a2.complianceRatePercent !== 100 || a2.compliantCount !== 0) throw new Error('Failed empty incidents');"
    )
  },

  // ── DAY 11 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[10],
    eTitle: "Implement Round-Robin Server Load Balancer",
    eDesc: "Write `createRoundRobinBalancer(servers: string[]): { getNext(): string | null }` cycling through server hosts on successive calls.",
    eLanguage: "typescript",
    eStarter: lines(
      "function createRoundRobinBalancer(servers: string[]): { getNext(): string | null } {",
      "  // Implement round-robin balancer",
      "  return { getNext: () => null };",
      "}"
    ),
    eHint: "Keep an internal index, return servers[index % length], increment index.",
    eTest: lines(
      "if (typeof createRoundRobinBalancer !== 'function') throw new Error('createRoundRobinBalancer not found');",
      "const b1 = createRoundRobinBalancer(['srv-1', 'srv-2', 'srv-3']);",
      "if (b1.getNext() !== 'srv-1') throw new Error('1st call should be srv-1');",
      "if (b1.getNext() !== 'srv-2') throw new Error('2nd call should be srv-2');",
      "if (b1.getNext() !== 'srv-3') throw new Error('3rd call should be srv-3');",
      "if (b1.getNext() !== 'srv-1') throw new Error('4th call should wrap to srv-1');",
      "const b2 = createRoundRobinBalancer([]);",
      "if (b2.getNext() !== null) throw new Error('Empty balancer must return null');"
    ),
    aTitle: "Select Server with Least Active Connections",
    aDesc: "Write `selectLeastConnections(servers: { id: string; activeConnections: number; healthy: boolean }[]): string | null` returning healthy server with lowest connections.",
    aLanguage: "typescript",
    aStarter: lines(
      "function selectLeastConnections(servers: { id: string; activeConnections: number; healthy: boolean }[]): string | null {",
      "  // Select least connections server",
      "  return null;",
      "}"
    ),
    aHint: "Filter healthy servers, then find the one with lowest activeConnections.",
    aTest: lines(
      "if (typeof selectLeastConnections !== 'function') throw new Error('selectLeastConnections not found');",
      "const s1 = selectLeastConnections([",
      "  { id: 's1', activeConnections: 10, healthy: true },",
      "  { id: 's2', activeConnections: 2, healthy: true },",
      "  { id: 's3', activeConnections: 5, healthy: true }",
      "]);",
      "if (s1 !== 's2') throw new Error('Expected s2 with 2 connections, got: ' + s1);",
      "const s2 = selectLeastConnections([",
      "  { id: 's1', activeConnections: 0, healthy: false },",
      "  { id: 's2', activeConnections: 5, healthy: true }",
      "]);",
      "if (s2 !== 's2') throw new Error('Unhealthy s1 must be skipped, got: ' + s2);",
      "if (selectLeastConnections([]) !== null) throw new Error('Empty must return null');"
    )
  },

  // ── DAY 12 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[11],
    eTitle: "Evaluate Liveness, Readiness, and Startup Probes",
    eDesc: "Write `evaluateProbes(status: { isProcessRunning: boolean; isDbConnected: boolean; isStartupComplete: boolean }): { canRouteTraffic: boolean; mustRestart: boolean; status: 'initializing' | 'healthy' | 'unhealthy' | 'dead' }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateProbes(status: { isProcessRunning: boolean; isDbConnected: boolean; isStartupComplete: boolean }): { canRouteTraffic: boolean; mustRestart: boolean; status: 'initializing' | 'healthy' | 'unhealthy' | 'dead' } {",
      "  // Evaluate probe state",
      "  return { canRouteTraffic: false, mustRestart: false, status: 'unhealthy' };",
      "}"
    ),
    eHint: "!isProcessRunning -> mustRestart, dead; !isStartupComplete -> initializing; !isDbConnected -> unhealthy; else healthy with canRouteTraffic = true.",
    eTest: lines(
      "if (typeof evaluateProbes !== 'function') throw new Error('evaluateProbes not found');",
      "const p1 = evaluateProbes({ isProcessRunning: false, isDbConnected: false, isStartupComplete: false });",
      "if (!p1.mustRestart || p1.canRouteTraffic || p1.status !== 'dead') throw new Error('Dead failed: ' + JSON.stringify(p1));",
      "const p2 = evaluateProbes({ isProcessRunning: true, isDbConnected: true, isStartupComplete: false });",
      "if (p2.mustRestart || p2.canRouteTraffic || p2.status !== 'initializing') throw new Error('Initializing failed: ' + JSON.stringify(p2));",
      "const p3 = evaluateProbes({ isProcessRunning: true, isDbConnected: false, isStartupComplete: true });",
      "if (p3.mustRestart || p3.canRouteTraffic || p3.status !== 'unhealthy') throw new Error('Unhealthy failed: ' + JSON.stringify(p3));",
      "const p4 = evaluateProbes({ isProcessRunning: true, isDbConnected: true, isStartupComplete: true });",
      "if (p4.mustRestart || !p4.canRouteTraffic || p4.status !== 'healthy') throw new Error('Healthy failed: ' + JSON.stringify(p4));"
    ),
    aTitle: "Aggregate Subsystem Health Check Results",
    aDesc: "Write `aggregateHealthChecks(checks: { name: string; status: 'pass' | 'fail' | 'warn'; latencyMs: number }[]): { overall: 'healthy' | 'degraded' | 'unhealthy'; failingChecks: string[] }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function aggregateHealthChecks(checks: { name: string; status: 'pass' | 'fail' | 'warn'; latencyMs: number }[]): { overall: 'healthy' | 'degraded' | 'unhealthy'; failingChecks: string[] } {",
      "  // Aggregate health status",
      "  return { overall: 'healthy', failingChecks: [] };",
      "}"
    ),
    aHint: "Any fail -> unhealthy; any warn -> degraded; else healthy. List all names of failing checks.",
    aTest: lines(
      "if (typeof aggregateHealthChecks !== 'function') throw new Error('aggregateHealthChecks not found');",
      "const a1 = aggregateHealthChecks([",
      "  { name: 'db', status: 'pass', latencyMs: 5 },",
      "  { name: 'redis', status: 'pass', latencyMs: 1 }",
      "]);",
      "if (a1.overall !== 'healthy' || a1.failingChecks.length !== 0) throw new Error('All pass failed: ' + JSON.stringify(a1));",
      "const a2 = aggregateHealthChecks([",
      "  { name: 'db', status: 'pass', latencyMs: 5 },",
      "  { name: 'search', status: 'warn', latencyMs: 500 }",
      "]);",
      "if (a2.overall !== 'degraded' || a2.failingChecks.length !== 0) throw new Error('Warn should degrade: ' + JSON.stringify(a2));",
      "const a3 = aggregateHealthChecks([",
      "  { name: 'auth', status: 'fail', latencyMs: 2000 }",
      "]);",
      "if (a3.overall !== 'unhealthy' || a3.failingChecks.join(',') !== 'auth') throw new Error('Fail should be unhealthy: ' + JSON.stringify(a3));"
    )
  },

  // ── DAY 13 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[12],
    eTitle: "Calculate Exponential Backoff Delay",
    eDesc: "Write `computeBackoffDelay(attempt: number, baseDelayMs: number = 100, maxDelayMs: number = 5000, factor: number = 2): number` with 0-indexed attempt.",
    eLanguage: "typescript",
    eStarter: lines(
      "function computeBackoffDelay(attempt: number, baseDelayMs: number = 100, maxDelayMs: number = 5000, factor: number = 2): number {",
      "  // Calculate exponential backoff",
      "  return 0;",
      "}"
    ),
    eHint: "Compute Math.min(maxDelayMs, baseDelayMs * Math.pow(factor, attempt)).",
    eTest: lines(
      "if (typeof computeBackoffDelay !== 'function') throw new Error('computeBackoffDelay not found');",
      "if (computeBackoffDelay(0, 100, 5000) !== 100) throw new Error('Attempt 0 should be 100');",
      "if (computeBackoffDelay(1, 100, 5000) !== 200) throw new Error('Attempt 1 should be 200');",
      "if (computeBackoffDelay(2, 100, 5000) !== 400) throw new Error('Attempt 2 should be 400');",
      "if (computeBackoffDelay(6, 100, 5000) !== 5000) throw new Error('Attempt 6 should cap at 5000');"
    ),
    aTitle: "Apply Full Jitter Randomization to Retry Delay",
    aDesc: "Write `applyFullJitter(calculatedDelayMs: number, randomFactor: number = 0.5): number` computing `Math.floor(randomFactor * (calculatedDelayMs + 1))`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function applyFullJitter(calculatedDelayMs: number, randomFactor: number = 0.5): number {",
      "  // Apply full jitter",
      "  return 0;",
      "}"
    ),
    aHint: "Return Math.floor(randomFactor * (calculatedDelayMs + 1)).",
    aTest: lines(
      "if (typeof applyFullJitter !== 'function') throw new Error('applyFullJitter not found');",
      "if (applyFullJitter(100, 0.5) !== 50) throw new Error('100 at 0.5 should be 50');",
      "if (applyFullJitter(200, 0.25) !== 50) throw new Error('200 at 0.25 should be 50');",
      "if (applyFullJitter(1000, 0) !== 0) throw new Error('0 factor should be 0');",
      "if (applyFullJitter(500, 1.0) !== 501) throw new Error('1.0 factor should be 501');"
    )
  },

  // ── DAY 14 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[13],
    eTitle: "Implement Circuit Breaker State Machine",
    eDesc: "Write `createCircuitBreaker(failureThreshold: number = 3, resetTimeoutMs: number = 1000)` managing 'CLOSED', 'OPEN', and 'HALF_OPEN' states.",
    eLanguage: "typescript",
    eStarter: lines(
      "function createCircuitBreaker(failureThreshold: number = 3, resetTimeoutMs: number = 1000): {",
      "  recordSuccess(): void;",
      "  recordFailure(nowMs: number): void;",
      "  getState(nowMs: number): 'CLOSED' | 'OPEN' | 'HALF_OPEN';",
      "  canExecute(nowMs: number): boolean;",
      "} {",
      "  // Implement circuit breaker",
      "  return {",
      "    recordSuccess: () => {},",
      "    recordFailure: () => {},",
      "    getState: () => 'CLOSED',",
      "    canExecute: () => true",
      "  };",
      "}"
    ),
    eHint: "Track failureCount, state, and lastFailureTime. Transition OPEN -> HALF_OPEN when resetTimeoutMs passes.",
    eTest: lines(
      "if (typeof createCircuitBreaker !== 'function') throw new Error('createCircuitBreaker not found');",
      "const cb = createCircuitBreaker(2, 500);",
      "if (cb.getState(1000) !== 'CLOSED' || !cb.canExecute(1000)) throw new Error('Initial state not CLOSED');",
      "cb.recordFailure(1010);",
      "if (cb.getState(1020) !== 'CLOSED') throw new Error('1 failure should still be CLOSED');",
      "cb.recordFailure(1030);",
      "if (cb.getState(1040) !== 'OPEN' || cb.canExecute(1040)) throw new Error('2 failures should trigger OPEN');",
      "if (cb.getState(1400) !== 'OPEN') throw new Error('Before 500ms timeout should stay OPEN');",
      "if (cb.getState(1600) !== 'HALF_OPEN' || !cb.canExecute(1600)) throw new Error('After 500ms should be HALF_OPEN');",
      "cb.recordSuccess();",
      "if (cb.getState(1610) !== 'CLOSED') throw new Error('Success in HALF_OPEN should reset to CLOSED');"
    ),
    aTitle: "Format Circuit Breaker Status and Health Message",
    aDesc: "Write `formatCircuitBreakerStatus(state: 'CLOSED' | 'OPEN' | 'HALF_OPEN', failures: number, threshold: number): { status: string; isDegraded: boolean; message: string }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function formatCircuitBreakerStatus(state: 'CLOSED' | 'OPEN' | 'HALF_OPEN', failures: number, threshold: number): { status: string; isDegraded: boolean; message: string } {",
      "  // Format circuit breaker message",
      "  return { status: '', isDegraded: false, message: '' };",
      "}"
    ),
    aHint: "isDegraded is true if state !== 'CLOSED'. Build message indicating circuit state.",
    aTest: lines(
      "if (typeof formatCircuitBreakerStatus !== 'function') throw new Error('formatCircuitBreakerStatus not found');",
      "const s1 = formatCircuitBreakerStatus('CLOSED', 1, 3);",
      "if (s1.isDegraded || !s1.message.includes('Normal')) throw new Error('Closed should be normal: ' + JSON.stringify(s1));",
      "const s2 = formatCircuitBreakerStatus('OPEN', 3, 3);",
      "if (!s2.isDegraded || !s2.message.includes('Tripped')) throw new Error('Open should be tripped: ' + JSON.stringify(s2));",
      "const s3 = formatCircuitBreakerStatus('HALF_OPEN', 0, 3);",
      "if (!s3.isDegraded || !s3.message.includes('Probing')) throw new Error('Half-open should be probing: ' + JSON.stringify(s3));"
    )
  },

  // ── DAY 15 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[14],
    eTitle: "Implement Bulkhead Resource Concurrency Pool",
    eDesc: "Write `createBulkheadPool(maxConcurrent: number, maxQueue: number): { tryAcquire(): boolean; release(): void; getActiveCount(): number; getQueueCount(): number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function createBulkheadPool(maxConcurrent: number, maxQueue: number): {",
      "  tryAcquire(): boolean;",
      "  release(): void;",
      "  getActiveCount(): number;",
      "  getQueueCount(): number;",
      "} {",
      "  // Implement bulkhead pool",
      "  return {",
      "    tryAcquire: () => false,",
      "    release: () => {},",
      "    getActiveCount: () => 0,",
      "    getQueueCount: () => 0",
      "  };",
      "}"
    ),
    eHint: "tryAcquire increments active if < maxConcurrent, else increments queue if < maxQueue, else returns false. release frees slot.",
    eTest: lines(
      "if (typeof createBulkheadPool !== 'function') throw new Error('createBulkheadPool not found');",
      "const pool = createBulkheadPool(2, 1);",
      "if (!pool.tryAcquire() || pool.getActiveCount() !== 1) throw new Error('Acquire 1 failed');",
      "if (!pool.tryAcquire() || pool.getActiveCount() !== 2) throw new Error('Acquire 2 failed');",
      "if (!pool.tryAcquire() || pool.getQueueCount() !== 1) throw new Error('Queue acquire failed');",
      "if (pool.tryAcquire() !== false) throw new Error('4th acquire should reject');",
      "pool.release();",
      "if (pool.getQueueCount() !== 0 || pool.getActiveCount() !== 2) throw new Error('Release should drain queue');",
      "pool.release();",
      "if (pool.getActiveCount() !== 1) throw new Error('Release active failed');"
    ),
    aTitle: "Calculate Distributed Call Timeout Budget",
    aDesc: "Write `calculateTimeoutBudget(clientTimeoutMs: number, hops: { service: string; maxLatencyMs: number }[]): { remainingBudgetMs: number; feasible: boolean; bottleneck: string | null }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateTimeoutBudget(clientTimeoutMs: number, hops: { service: string; maxLatencyMs: number }[]): { remainingBudgetMs: number; feasible: boolean; bottleneck: string | null } {",
      "  // Calculate timeout budget",
      "  return { remainingBudgetMs: 0, feasible: false, bottleneck: null };",
      "}"
    ),
    aHint: "Sum hops latency; remaining is clientTimeoutMs - sum; feasible is remaining >= 0; bottleneck is hop with max latency.",
    aTest: lines(
      "if (typeof calculateTimeoutBudget !== 'function') throw new Error('calculateTimeoutBudget not found');",
      "const t1 = calculateTimeoutBudget(1000, [",
      "  { service: 'gateway', maxLatencyMs: 100 },",
      "  { service: 'auth', maxLatencyMs: 300 },",
      "  { service: 'db', maxLatencyMs: 400 }",
      "]);",
      "if (t1.remainingBudgetMs !== 200 || !t1.feasible || t1.bottleneck !== 'db') throw new Error('Failed t1: ' + JSON.stringify(t1));",
      "const t2 = calculateTimeoutBudget(500, [",
      "  { service: 'api', maxLatencyMs: 400 },",
      "  { service: 'cache', maxLatencyMs: 200 }",
      "]);",
      "if (t2.remainingBudgetMs !== -100 || t2.feasible || t2.bottleneck !== 'api') throw new Error('Failed over-budget t2: ' + JSON.stringify(t2));",
      "const t3 = calculateTimeoutBudget(1000, []);",
      "if (t3.remainingBudgetMs !== 1000 || !t3.feasible || t3.bottleneck !== null) throw new Error('Failed empty hops');"
    )
  },

  // ── DAY 16 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[15],
    eTitle: "Implement Multi-Metric Collection Registry",
    eDesc: "Write `createMetricCollector()` returning an object with `incrementCounter(name, delta)`, `setGauge(name, value)`, `observeHistogram(name, value)`, and `getMetrics()`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function createMetricCollector(): {",
      "  incrementCounter(name: string, delta?: number): void;",
      "  setGauge(name: string, value: number): void;",
      "  observeHistogram(name: string, value: number): void;",
      "  getMetrics(): {",
      "    counters: Record<string, number>;",
      "    gauges: Record<string, number>;",
      "    histograms: Record<string, { count: number; sum: number; avg: number }>;",
      "  };",
      "} {",
      "  // Implement metric collector",
      "  return {",
      "    incrementCounter: () => {},",
      "    setGauge: () => {},",
      "    observeHistogram: () => {},",
      "    getMetrics: () => ({ counters: {}, gauges: {}, histograms: {} })",
      "  };",
      "}"
    ),
    eHint: "Track counters as sum of deltas, gauges as latest value, histograms as count/sum/avg.",
    eTest: lines(
      "if (typeof createMetricCollector !== 'function') throw new Error('createMetricCollector not found');",
      "const mc = createMetricCollector();",
      "mc.incrementCounter('reqs', 10);",
      "mc.incrementCounter('reqs', 5);",
      "mc.setGauge('mem', 512);",
      "mc.observeHistogram('lat', 100);",
      "mc.observeHistogram('lat', 200);",
      "const m = mc.getMetrics();",
      "if (m.counters.reqs !== 15) throw new Error('Counter failed: ' + m.counters.reqs);",
      "if (m.gauges.mem !== 512) throw new Error('Gauge failed: ' + m.gauges.mem);",
      "if (m.histograms.lat.count !== 2 || m.histograms.lat.sum !== 300 || m.histograms.lat.avg !== 150) throw new Error('Histogram failed: ' + JSON.stringify(m.histograms.lat));"
    ),
    aTitle: "Bucket Metric Observations into Histogram Intervals",
    aDesc: "Write `bucketHistogram(observations: number[], buckets: number[]): { bucket: number; count: number }[]` counting observations `<=` bucket.",
    aLanguage: "typescript",
    aStarter: lines(
      "function bucketHistogram(observations: number[], buckets: number[]): { bucket: number; count: number }[] {",
      "  // Distribute observations into cumulative buckets",
      "  return [];",
      "}"
    ),
    aHint: "For each bucket bound, count observations <= bucket.",
    aTest: lines(
      "if (typeof bucketHistogram !== 'function') throw new Error('bucketHistogram not found');",
      "const b1 = bucketHistogram([10, 50, 80, 150, 300], [50, 100, 200, 500]);",
      "if (b1[0].count !== 2 || b1[1].count !== 3 || b1[2].count !== 4 || b1[3].count !== 5) throw new Error('Failed b1: ' + JSON.stringify(b1));",
      "const b2 = bucketHistogram([], [10, 20]);",
      "if (b2[0].count !== 0 || b2[1].count !== 0) throw new Error('Empty observations failed');"
    )
  },

  // ── DAY 17 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[16],
    eTitle: "Calculate p50, p95, and p99 Latency Percentiles",
    eDesc: "Write `calculatePercentiles(observations: number[], percentiles: number[] = [50, 95, 99]): Record<number, number>`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculatePercentiles(observations: number[], percentiles: number[] = [50, 95, 99]): Record<number, number> {",
      "  // Calculate percentiles from observations",
      "  return {};",
      "}"
    ),
    eHint: "Sort ascending, rank = Math.ceil((p / 100) * length) - 1 clamped between 0 and length - 1.",
    eTest: lines(
      "if (typeof calculatePercentiles !== 'function') throw new Error('calculatePercentiles not found');",
      "const obs1 = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];",
      "const p1 = calculatePercentiles(obs1, [50, 90, 99]);",
      "if (p1[50] !== 50 || p1[90] !== 90 || p1[99] !== 100) throw new Error('Failed obs1: ' + JSON.stringify(p1));",
      "const p2 = calculatePercentiles([]);",
      "if (p2[50] !== 0 || p2[95] !== 0) throw new Error('Empty should return 0');"
    ),
    aTitle: "Interpolate Percentile Value from Histogram Buckets",
    aDesc: "Write `interpolateHistogramPercentile(bucketCounts: { le: number; count: number }[], totalCount: number, percentile: number): number`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function interpolateHistogramPercentile(bucketCounts: { le: number; count: number }[], totalCount: number, percentile: number): number {",
      "  // Interpolate percentile from cumulative histogram",
      "  return 0;",
      "}"
    ),
    aHint: "Find bucket where count >= (percentile / 100) * totalCount; linear interpolate with previous bucket.",
    aTest: lines(
      "if (typeof interpolateHistogramPercentile !== 'function') throw new Error('interpolateHistogramPercentile not found');",
      "const buckets = [{ le: 100, count: 50 }, { le: 200, count: 100 }];",
      "const ip1 = interpolateHistogramPercentile(buckets, 100, 50);",
      "if (ip1 !== 100) throw new Error('Exact 50th percentile should be 100, got: ' + ip1);",
      "const ip2 = interpolateHistogramPercentile(buckets, 100, 75);",
      "if (ip2 !== 150) throw new Error('Midpoint 75th percentile should be 150, got: ' + ip2);",
      "if (interpolateHistogramPercentile([], 0, 50) !== 0) throw new Error('Empty should be 0');"
    )
  },

  // ── DAY 18 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[17],
    eTitle: "Format Structured JSON Log Entry with Correlation ID",
    eDesc: "Write `formatStructuredLog(level: 'INFO' | 'WARN' | 'ERROR', message: string, correlationId: string, metadata?: Record<string, any>): string`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function formatStructuredLog(level: 'INFO' | 'WARN' | 'ERROR', message: string, correlationId: string, metadata?: Record<string, any>): string {",
      "  // Format structured log",
      "  return '';",
      "}"
    ),
    eHint: "Return JSON.stringify({ level, message, correlationId, ...(metadata || {}) }).",
    eTest: lines(
      "if (typeof formatStructuredLog !== 'function') throw new Error('formatStructuredLog not found');",
      "const l1 = JSON.parse(formatStructuredLog('INFO', 'User login', 'corr-123', { userId: 'u1' }));",
      "if (l1.level !== 'INFO' || l1.correlationId !== 'corr-123' || l1.userId !== 'u1') throw new Error('Failed l1: ' + JSON.stringify(l1));",
      "const l2 = JSON.parse(formatStructuredLog('ERROR', 'Db timeout', 'corr-456'));",
      "if (l2.level !== 'ERROR' || l2.message !== 'Db timeout') throw new Error('Failed l2: ' + JSON.stringify(l2));"
    ),
    aTitle: "Filter and Extract Correlated Log Entries",
    aDesc: "Write `extractCorrelatedLogs(logs: string[], targetCorrelationId: string): { level: string; message: string }[]`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function extractCorrelatedLogs(logs: string[], targetCorrelationId: string): { level: string; message: string }[] {",
      "  // Extract logs matching correlation id",
      "  return [];",
      "}"
    ),
    aHint: "Parse JSON lines, filter where correlationId === target, map to { level, message }.",
    aTest: lines(
      "if (typeof extractCorrelatedLogs !== 'function') throw new Error('extractCorrelatedLogs not found');",
      "const lines = [",
      "  JSON.stringify({ level: 'INFO', message: 'Step 1', correlationId: 'c1' }),",
      "  JSON.stringify({ level: 'ERROR', message: 'Step 2 failed', correlationId: 'c1' }),",
      "  JSON.stringify({ level: 'INFO', message: 'Other step', correlationId: 'c2' })",
      "];",
      "const res = extractCorrelatedLogs(lines, 'c1');",
      "if (res.length !== 2 || res[0].message !== 'Step 1' || res[1].message !== 'Step 2 failed') throw new Error('Failed c1: ' + JSON.stringify(res));",
      "if (extractCorrelatedLogs(lines, 'c99').length !== 0) throw new Error('c99 should be empty');"
    )
  },

  // ── DAY 19 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[18],
    eTitle: "Build and Analyze Distributed Trace Span Tree",
    eDesc: "Write `buildTraceTree(spans: { id: string; parentId: string | null; name: string; durationMs: number }[]): { rootId: string; totalDurationMs: number; spanCount: number; maxDepth: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function buildTraceTree(spans: { id: string; parentId: string | null; name: string; durationMs: number }[]): { rootId: string; totalDurationMs: number; spanCount: number; maxDepth: number } {",
      "  // Build trace tree stats",
      "  return { rootId: '', totalDurationMs: 0, spanCount: 0, maxDepth: 0 };",
      "}"
    ),
    eHint: "Root span has parentId === null. Recursively traverse child spans to compute maxDepth.",
    eTest: lines(
      "if (typeof buildTraceTree !== 'function') throw new Error('buildTraceTree not found');",
      "const spans = [",
      "  { id: 's1', parentId: null, name: 'root', durationMs: 250 },",
      "  { id: 's2', parentId: 's1', name: 'auth', durationMs: 50 },",
      "  { id: 's3', parentId: 's2', name: 'ldap', durationMs: 30 }",
      "];",
      "const t1 = buildTraceTree(spans);",
      "if (t1.rootId !== 's1' || t1.totalDurationMs !== 250 || t1.spanCount !== 3 || t1.maxDepth !== 3) throw new Error('Failed t1: ' + JSON.stringify(t1));",
      "const t2 = buildTraceTree([]);",
      "if (t2.rootId !== '' || t2.spanCount !== 0) throw new Error('Empty spans failed');"
    ),
    aTitle: "Parse W3C Trace Context Traceparent Header",
    aDesc: "Write `parseTraceparentHeader(header: string): { version: string; traceId: string; parentId: string; flags: string } | null`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function parseTraceparentHeader(header: string): { version: string; traceId: string; parentId: string; flags: string } | null {",
      "  // Parse W3C traceparent header",
      "  return null;",
      "}"
    ),
    aHint: "Split by '-'; must be exactly 4 parts with valid lengths (version 2, traceId 32, parentId 16, flags 2).",
    aTest: lines(
      "if (typeof parseTraceparentHeader !== 'function') throw new Error('parseTraceparentHeader not found');",
      "const valid = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';",
      "const res = parseTraceparentHeader(valid);",
      "if (!res || res.version !== '00' || res.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || res.parentId !== '00f067aa0ba902b7' || res.flags !== '01') throw new Error('Failed valid traceparent: ' + JSON.stringify(res));",
      "if (parseTraceparentHeader('invalid-header') !== null) throw new Error('Invalid format must return null');",
      "if (parseTraceparentHeader('00-short-00f0-01') !== null) throw new Error('Short lengths must return null');"
    )
  },

  // ── DAY 20 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[19],
    eTitle: "Evaluate Multi-Window Error Budget Burn Rate Alerts",
    eDesc: "Write `evaluateBurnRateAlert(windows: { windowMinutes: number; burnRate: number; threshold: number }[]): { shouldAlert: boolean; severity: 'P1' | 'P2' | 'NONE'; triggeringWindows: number[] }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateBurnRateAlert(windows: { windowMinutes: number; burnRate: number; threshold: number }[]): { shouldAlert: boolean; severity: 'P1' | 'P2' | 'NONE'; triggeringWindows: number[] } {",
      "  // Evaluate burn rate alert",
      "  return { shouldAlert: false, severity: 'NONE', triggeringWindows: [] };",
      "}"
    ),
    eHint: "Triggering when burnRate >= threshold. P1 if any triggering windowMinutes <= 60 and burnRate >= 14, else P2.",
    eTest: lines(
      "if (typeof evaluateBurnRateAlert !== 'function') throw new Error('evaluateBurnRateAlert not found');",
      "const a1 = evaluateBurnRateAlert([",
      "  { windowMinutes: 60, burnRate: 15, threshold: 14 },",
      "  { windowMinutes: 360, burnRate: 7, threshold: 6 }",
      "]);",
      "if (!a1.shouldAlert || a1.severity !== 'P1' || a1.triggeringWindows.length !== 2) throw new Error('Failed P1 alert: ' + JSON.stringify(a1));",
      "const a2 = evaluateBurnRateAlert([",
      "  { windowMinutes: 1440, burnRate: 3, threshold: 2 }",
      "]);",
      "if (!a2.shouldAlert || a2.severity !== 'P2') throw new Error('Failed P2 alert: ' + JSON.stringify(a2));",
      "const a3 = evaluateBurnRateAlert([",
      "  { windowMinutes: 60, burnRate: 1, threshold: 14 }",
      "]);",
      "if (a3.shouldAlert || a3.severity !== 'NONE') throw new Error('Failed nominal no-alert');"
    ),
    aTitle: "Deduplicate Operational Alerts by Fingerprint Window",
    aDesc: "Write `deduplicateAlerts(alerts: { id: string; fingerprint: string; timestampMs: number }[], windowMs: number = 300000): { id: string; fingerprint: string; timestampMs: number }[]`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function deduplicateAlerts(alerts: { id: string; fingerprint: string; timestampMs: number }[], windowMs: number = 300000): { id: string; fingerprint: string; timestampMs: number }[] {",
      "  // Deduplicate alerts within time window",
      "  return [];",
      "}"
    ),
    aHint: "Keep the first alert for each fingerprint, and subsequent alerts only if timestamp >= lastAccepted + windowMs.",
    aTest: lines(
      "if (typeof deduplicateAlerts !== 'function') throw new Error('deduplicateAlerts not found');",
      "const alerts = [",
      "  { id: 'a1', fingerprint: 'fp-db', timestampMs: 1000 },",
      "  { id: 'a2', fingerprint: 'fp-db', timestampMs: 5000 },",
      "  { id: 'a3', fingerprint: 'fp-api', timestampMs: 10000 },",
      "  { id: 'a4', fingerprint: 'fp-db', timestampMs: 310000 }",
      "];",
      "const d = deduplicateAlerts(alerts, 300000);",
      "if (d.length !== 3 || d.map(x => x.id).join(',') !== 'a1,a3,a4') throw new Error('Failed deduplicate: ' + JSON.stringify(d));",
      "if (deduplicateAlerts([]).length !== 0) throw new Error('Empty alerts failed');"
    )
  },

  // ── DAY 21 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[20],
    eTitle: "Classify Incident Severity and Response SLA",
    eDesc: "Write `classifyIncidentSeverity(affectedUsers: number, dataLossRisk: boolean, coreServiceDown: boolean): { severity: 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4'; responseSlaMinutes: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function classifyIncidentSeverity(affectedUsers: number, dataLossRisk: boolean, coreServiceDown: boolean): { severity: 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4'; responseSlaMinutes: number } {",
      "  // Classify incident severity",
      "  return { severity: 'SEV4', responseSlaMinutes: 1440 };",
      "}"
    ),
    eHint: "SEV1: coreServiceDown && (affectedUsers > 1000 || dataLossRisk) (15m); SEV2: coreServiceDown || affectedUsers > 5000 (30m); SEV3: affectedUsers > 500 (120m); else SEV4 (1440m).",
    eTest: lines(
      "if (typeof classifyIncidentSeverity !== 'function') throw new Error('classifyIncidentSeverity not found');",
      "const s1 = classifyIncidentSeverity(5000, true, true);",
      "if (s1.severity !== 'SEV1' || s1.responseSlaMinutes !== 15) throw new Error('Failed SEV1: ' + JSON.stringify(s1));",
      "const s2 = classifyIncidentSeverity(100, false, true);",
      "if (s2.severity !== 'SEV2' || s2.responseSlaMinutes !== 30) throw new Error('Failed SEV2: ' + JSON.stringify(s2));",
      "const s3 = classifyIncidentSeverity(800, false, false);",
      "if (s3.severity !== 'SEV3' || s3.responseSlaMinutes !== 120) throw new Error('Failed SEV3: ' + JSON.stringify(s3));",
      "const s4 = classifyIncidentSeverity(50, false, false);",
      "if (s4.severity !== 'SEV4' || s4.responseSlaMinutes !== 1440) throw new Error('Failed SEV4: ' + JSON.stringify(s4));"
    ),
    aTitle: "Calculate Mean Time to Detect (MTTD) and Recover (MTTR)",
    aDesc: "Write `calculateMttdAndMttr(incidents: { detectedAtMs: number; startedAtMs: number; resolvedAtMs: number }[]): { mttdMinutes: number; mttrMinutes: number; count: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateMttdAndMttr(incidents: { detectedAtMs: number; startedAtMs: number; resolvedAtMs: number }[]): { mttdMinutes: number; mttrMinutes: number; count: number } {",
      "  // Calculate MTTD and MTTR in minutes",
      "  return { mttdMinutes: 0, mttrMinutes: 0, count: 0 };",
      "}"
    ),
    aHint: "MTTD = avg((detected - started) / 60000); MTTR = avg((resolved - detected) / 60000).",
    aTest: lines(
      "if (typeof calculateMttdAndMttr !== 'function') throw new Error('calculateMttdAndMttr not found');",
      "const incs = [",
      "  { startedAtMs: 0, detectedAtMs: 600000, resolvedAtMs: 2400000 },",
      "  { startedAtMs: 0, detectedAtMs: 1200000, resolvedAtMs: 4800000 }",
      "];",
      "const res = calculateMttdAndMttr(incs);",
      "if (res.mttdMinutes !== 15 || res.mttrMinutes !== 45 || res.count !== 2) throw new Error('Failed incs: ' + JSON.stringify(res));",
      "const empty = calculateMttdAndMttr([]);",
      "if (empty.mttdMinutes !== 0 || empty.count !== 0) throw new Error('Empty failed');"
    )
  },

  // ── DAY 22 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[21],
    eTitle: "Build Postmortem Incident Timeline and Phase Order",
    eDesc: "Write `buildPostmortemTimeline(events: { timestampMs: number; description: string; phase: 'detection' | 'triage' | 'mitigation' | 'resolution' }[]): { durationMinutes: number; eventCount: number; orderedPhases: string[] }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function buildPostmortemTimeline(events: { timestampMs: number; description: string; phase: 'detection' | 'triage' | 'mitigation' | 'resolution' }[]): { durationMinutes: number; eventCount: number; orderedPhases: string[] } {",
      "  // Build postmortem timeline",
      "  return { durationMinutes: 0, eventCount: 0, orderedPhases: [] };",
      "}"
    ),
    eHint: "Sort events by timestampMs; durationMinutes is (last - first) / 60000; orderedPhases is unique chronological phases.",
    eTest: lines(
      "if (typeof buildPostmortemTimeline !== 'function') throw new Error('buildPostmortemTimeline not found');",
      "const evs = [",
      "  { timestampMs: 300000, description: 'Mitigated', phase: 'mitigation' },",
      "  { timestampMs: 0, description: 'Alert fired', phase: 'detection' },",
      "  { timestampMs: 120000, description: 'War room created', phase: 'triage' }",
      "];",
      "const p1 = buildPostmortemTimeline(evs);",
      "if (p1.durationMinutes !== 5 || p1.eventCount !== 3 || p1.orderedPhases.join(',') !== 'detection,triage,mitigation') throw new Error('Failed p1: ' + JSON.stringify(p1));",
      "const p2 = buildPostmortemTimeline([]);",
      "if (p2.durationMinutes !== 0 || p2.eventCount !== 0) throw new Error('Empty events failed');"
    ),
    aTitle: "Validate Postmortem Action Item Structure and Owners",
    aDesc: "Write `validateActionItems(items: { description: string; owner: string; dueDateIso: string; priority: 'P0' | 'P1' | 'P2' }[]): { valid: boolean; missingFields: string[] }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function validateActionItems(items: { description: string; owner: string; dueDateIso: string; priority: 'P0' | 'P1' | 'P2' }[]): { valid: boolean; missingFields: string[] } {",
      "  // Validate postmortem action items",
      "  return { valid: false, missingFields: [] };",
      "}"
    ),
    aHint: "Check that each item has non-empty description, owner, dueDateIso, and priority P0/P1/P2.",
    aTest: lines(
      "if (typeof validateActionItems !== 'function') throw new Error('validateActionItems not found');",
      "const okItems = [{ description: 'Add circuit breaker', owner: 'alice', dueDateIso: '2026-11-01', priority: 'P0' }];",
      "if (!validateActionItems(okItems).valid) throw new Error('Valid items failed');",
      "const badItems = [{ description: '', owner: 'bob', dueDateIso: '2026-11-01', priority: 'P1' }];",
      "const r = validateActionItems(badItems);",
      "if (r.valid || !r.missingFields.some(f => f.includes('description'))) throw new Error('Missing description failed: ' + JSON.stringify(r));"
    )
  },

  // ── DAY 23 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[22],
    eTitle: "Apply Little's Law for Service Capacity Planning",
    eDesc: "Write `applyLittlesLaw(arrivalRatePerSec: number, avgLatencySec: number): { avgConcurrency: number; recommendedCapacity: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function applyLittlesLaw(arrivalRatePerSec: number, avgLatencySec: number): { avgConcurrency: number; recommendedCapacity: number } {",
      "  // Apply Little's law: L = lambda * W",
      "  return { avgConcurrency: 0, recommendedCapacity: 0 };",
      "}"
    ),
    eHint: "avgConcurrency = arrivalRate * avgLatency (rounded to 2 decimals); recommendedCapacity = Math.ceil(avgConcurrency * 1.5).",
    eTest: lines(
      "if (typeof applyLittlesLaw !== 'function') throw new Error('applyLittlesLaw not found');",
      "const c1 = applyLittlesLaw(100, 0.2);",
      "if (c1.avgConcurrency !== 20 || c1.recommendedCapacity !== 30) throw new Error('Failed c1: ' + JSON.stringify(c1));",
      "const c2 = applyLittlesLaw(500, 0.05);",
      "if (c2.avgConcurrency !== 25 || c2.recommendedCapacity !== 38) throw new Error('Failed c2: ' + JSON.stringify(c2));",
      "const c3 = applyLittlesLaw(0, 1);",
      "if (c3.avgConcurrency !== 0 || c3.recommendedCapacity !== 0) throw new Error('Zero arrival failed');"
    ),
    aTitle: "Calculate Desired Horizontal Pod AutoScaler Replicas",
    aDesc: "Write `calculateAutoScalingDesired(currentReplicas: number, currentMetric: number, targetMetric: number, minReplicas: number = 2, maxReplicas: number = 20): number`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateAutoScalingDesired(currentReplicas: number, currentMetric: number, targetMetric: number, minReplicas: number = 2, maxReplicas: number = 20): number {",
      "  // Compute desired autoscaling replicas",
      "  return 0;",
      "}"
    ),
    aHint: "Desired = Math.ceil(currentReplicas * (currentMetric / targetMetric)), clamped between min and max.",
    aTest: lines(
      "if (typeof calculateAutoScalingDesired !== 'function') throw new Error('calculateAutoScalingDesired not found');",
      "if (calculateAutoScalingDesired(5, 80, 50, 2, 20) !== 8) throw new Error('5 at 80/50 should scale to 8');",
      "if (calculateAutoScalingDesired(10, 20, 50, 2, 20) !== 4) throw new Error('10 at 20/50 should scale down to 4');",
      "if (calculateAutoScalingDesired(10, 200, 50, 2, 20) !== 20) throw new Error('Scale out should cap at maxReplicas 20');",
      "if (calculateAutoScalingDesired(5, 0, 50, 2, 20) !== 2) throw new Error('Scale in should floor at minReplicas 2');"
    )
  },

  // ── DAY 24 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[23],
    eTitle: "Model Cloud Compute Costs (On-Demand vs Reserved)",
    eDesc: "Write `modelCloudComputeCost(hourlyUsageHours: number, onDemandRate: number, reservedRate: number, upfrontCost: number = 0): { onDemandCost: number; reservedCost: number; savings: number; breakEvenReached: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function modelCloudComputeCost(hourlyUsageHours: number, onDemandRate: number, reservedRate: number, upfrontCost: number = 0): { onDemandCost: number; reservedCost: number; savings: number; breakEvenReached: boolean } {",
      "  // Model cloud cost comparison",
      "  return { onDemandCost: 0, reservedCost: 0, savings: 0, breakEvenReached: false };",
      "}"
    ),
    eHint: "onDemand = usage * onDemandRate; reserved = upfront + usage * reservedRate; savings = onDemand - reserved.",
    eTest: lines(
      "if (typeof modelCloudComputeCost !== 'function') throw new Error('modelCloudComputeCost not found');",
      "const c1 = modelCloudComputeCost(1000, 0.10, 0.05, 20);",
      "if (c1.onDemandCost !== 100 || c1.reservedCost !== 70 || c1.savings !== 30 || !c1.breakEvenReached) throw new Error('Failed c1: ' + JSON.stringify(c1));",
      "const c2 = modelCloudComputeCost(100, 0.10, 0.05, 50);",
      "if (c2.savings !== -45 || c2.breakEvenReached) throw new Error('Failed negative savings c2: ' + JSON.stringify(c2));"
    ),
    aTitle: "Evaluate Spot Instance Reliability Risk vs Cost Savings",
    aDesc: "Write `evaluateSpotReliabilityRisk(spotInterruptionRatePercent: number, basePrice: number, spotPrice: number, maxToleratedInterruptionPercent: number = 10): { useSpot: boolean; costSavingsPercent: number; reason: string }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function evaluateSpotReliabilityRisk(spotInterruptionRatePercent: number, basePrice: number, spotPrice: number, maxToleratedInterruptionPercent: number = 10): { useSpot: boolean; costSavingsPercent: number; reason: string } {",
      "  // Evaluate spot instance feasibility",
      "  return { useSpot: false, costSavingsPercent: 0, reason: '' };",
      "}"
    ),
    aHint: "costSavingsPercent = ((base - spot) / base) * 100; useSpot if interruption rate <= maxTolerated.",
    aTest: lines(
      "if (typeof evaluateSpotReliabilityRisk !== 'function') throw new Error('evaluateSpotReliabilityRisk not found');",
      "const s1 = evaluateSpotReliabilityRisk(5, 1.0, 0.3, 10);",
      "if (!s1.useSpot || s1.costSavingsPercent !== 70) throw new Error('Low interruption should use spot: ' + JSON.stringify(s1));",
      "const s2 = evaluateSpotReliabilityRisk(15, 1.0, 0.2, 10);",
      "if (s2.useSpot || s2.costSavingsPercent !== 80) throw new Error('High interruption must reject spot: ' + JSON.stringify(s2));"
    )
  },

  // ── DAY 25 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[24],
    eTitle: "Evaluate End-to-End Incident Lifecycle Metrics",
    eDesc: "Write `evaluateIncidentLifecycle(incident: { id: string; startedAtMs: number; detectedAtMs: number; mitigatedAtMs: number; resolvedAtMs: number; errorRatePeak: number }): { ttdMinutes: number; ttmMinutes: number; ttrMinutes: number; severity: 'SEV1' | 'SEV2' | 'SEV3'; postmortemRequired: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateIncidentLifecycle(incident: { id: string; startedAtMs: number; detectedAtMs: number; mitigatedAtMs: number; resolvedAtMs: number; errorRatePeak: number }): { ttdMinutes: number; ttmMinutes: number; ttrMinutes: number; severity: 'SEV1' | 'SEV2' | 'SEV3'; postmortemRequired: boolean } {",
      "  // Evaluate lifecycle metrics",
      "  return { ttdMinutes: 0, ttmMinutes: 0, ttrMinutes: 0, severity: 'SEV3', postmortemRequired: false };",
      "}"
    ),
    eHint: "ttd = (detected - started) / 60k; ttm = (mitigated - detected) / 60k; ttr = (resolved - started) / 60k. SEV1 if peak >= 0.2, SEV2 if >= 0.05, else SEV3.",
    eTest: lines(
      "if (typeof evaluateIncidentLifecycle !== 'function') throw new Error('evaluateIncidentLifecycle not found');",
      "const i1 = evaluateIncidentLifecycle({ id: 'inc-1', startedAtMs: 0, detectedAtMs: 300000, mitigatedAtMs: 900000, resolvedAtMs: 1500000, errorRatePeak: 0.25 });",
      "if (i1.ttdMinutes !== 5 || i1.ttmMinutes !== 10 || i1.ttrMinutes !== 25 || i1.severity !== 'SEV1' || !i1.postmortemRequired) throw new Error('Failed i1: ' + JSON.stringify(i1));",
      "const i2 = evaluateIncidentLifecycle({ id: 'inc-2', startedAtMs: 0, detectedAtMs: 60000, mitigatedAtMs: 180000, resolvedAtMs: 300000, errorRatePeak: 0.02 });",
      "if (i2.severity !== 'SEV3' || i2.postmortemRequired) throw new Error('Failed i2: ' + JSON.stringify(i2));"
    ),
    aTitle: "Aggregate Multi-Modal Observability Health Signals",
    aDesc: "Write `aggregateObservabilitySignals(metricsHealthy: boolean, logErrorSpike: boolean, traceLatencyHigh: boolean): { systemHealth: 'healthy' | 'degraded' | 'critical'; anomalies: string[] }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function aggregateObservabilitySignals(metricsHealthy: boolean, logErrorSpike: boolean, traceLatencyHigh: boolean): { systemHealth: 'healthy' | 'degraded' | 'critical'; anomalies: string[] } {",
      "  // Aggregate observability signals",
      "  return { systemHealth: 'healthy', anomalies: [] };",
      "}"
    ),
    aHint: "Collect anomalies; critical if anomalies >= 2 or (!metricsHealthy && logErrorSpike), degraded if 1, healthy if 0.",
    aTest: lines(
      "if (typeof aggregateObservabilitySignals !== 'function') throw new Error('aggregateObservabilitySignals not found');",
      "const s1 = aggregateObservabilitySignals(true, false, false);",
      "if (s1.systemHealth !== 'healthy' || s1.anomalies.length !== 0) throw new Error('Failed healthy: ' + JSON.stringify(s1));",
      "const s2 = aggregateObservabilitySignals(true, true, false);",
      "if (s2.systemHealth !== 'degraded' || s2.anomalies.join(',') !== 'LOG_ERROR_SPIKE') throw new Error('Failed degraded: ' + JSON.stringify(s2));",
      "const s3 = aggregateObservabilitySignals(false, true, false);",
      "if (s3.systemHealth !== 'critical' || s3.anomalies.length !== 2) throw new Error('Failed critical: ' + JSON.stringify(s3));"
    )
  },

  // ── DAY 26 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[25],
    eTitle: "Evaluate Chaos Experiment Steady-State Hypothesis",
    eDesc: "Write `evaluateChaosExperiment(steadyState: { maxLatencyMs: number; maxErrorRate: number }, baseline: { latencyMs: number; errorRate: number }, underChaos: { latencyMs: number; errorRate: number }): { hypothesisPassed: boolean; latencyDegradationPercent: number; errorRateDelta: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateChaosExperiment(steadyState: { maxLatencyMs: number; maxErrorRate: number }, baseline: { latencyMs: number; errorRate: number }, underChaos: { latencyMs: number; errorRate: number }): { hypothesisPassed: boolean; latencyDegradationPercent: number; errorRateDelta: number } {",
      "  // Evaluate chaos hypothesis",
      "  return { hypothesisPassed: false, latencyDegradationPercent: 0, errorRateDelta: 0 };",
      "}"
    ),
    eHint: "hypothesisPassed if underChaos satisfies steadyState limits. Compute latency percent change and errorRate delta.",
    eTest: lines(
      "if (typeof evaluateChaosExperiment !== 'function') throw new Error('evaluateChaosExperiment not found');",
      "const e1 = evaluateChaosExperiment({ maxLatencyMs: 200, maxErrorRate: 0.05 }, { latencyMs: 100, errorRate: 0.01 }, { latencyMs: 150, errorRate: 0.02 });",
      "if (!e1.hypothesisPassed || e1.latencyDegradationPercent !== 50 || e1.errorRateDelta !== 0.01) throw new Error('Failed e1: ' + JSON.stringify(e1));",
      "const e2 = evaluateChaosExperiment({ maxLatencyMs: 200, maxErrorRate: 0.05 }, { latencyMs: 100, errorRate: 0.01 }, { latencyMs: 250, errorRate: 0.08 });",
      "if (e2.hypothesisPassed || e2.latencyDegradationPercent !== 150) throw new Error('Failed failing hypothesis e2');"
    ),
    aTitle: "Calculate Failure Blast Radius Dependencies",
    aDesc: "Write `calculateBlastRadius(targetService: string, downstreamServices: Record<string, string[]>): { affectedCount: number; affectedServices: string[] }` returning all services transitively depending on targetService.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateBlastRadius(targetService: string, downstreamServices: Record<string, string[]>): { affectedCount: number; affectedServices: string[] } {",
      "  // Calculate blast radius",
      "  return { affectedCount: 0, affectedServices: [] };",
      "}"
    ),
    aHint: "downstreamServices[s] lists services that depend directly on s. Use BFS/DFS to find all transitive dependents.",
    aTest: lines(
      "if (typeof calculateBlastRadius !== 'function') throw new Error('calculateBlastRadius not found');",
      "const graph = { auth: ['api', 'billing'], api: ['frontend'], billing: ['payout'], frontend: [] };",
      "const b1 = calculateBlastRadius('auth', graph);",
      "if (b1.affectedCount !== 4 || !b1.affectedServices.includes('frontend')) throw new Error('Failed blast radius: ' + JSON.stringify(b1));",
      "const b2 = calculateBlastRadius('frontend', graph);",
      "if (b2.affectedCount !== 0) throw new Error('Leaf service should have 0 blast radius');"
    )
  },

  // ── DAY 27 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[26],
    eTitle: "Simulate Blue-Green Traffic Switch and Rollback",
    eDesc: "Write `simulateBlueGreenSwitch(activeColor: 'blue' | 'green', greenHealth: boolean, blueHealth: boolean): { nextColor: 'blue' | 'green'; switched: boolean; rollbackNeeded: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function simulateBlueGreenSwitch(activeColor: 'blue' | 'green', greenHealth: boolean, blueHealth: boolean): { nextColor: 'blue' | 'green'; switched: boolean; rollbackNeeded: boolean } {",
      "  // Simulate blue-green deployment switch",
      "  return { nextColor: activeColor, switched: false, rollbackNeeded: false };",
      "}"
    ),
    eHint: "If active is blue, target green must be healthy to switch; if unhealthy stay blue with rollbackNeeded true.",
    eTest: lines(
      "if (typeof simulateBlueGreenSwitch !== 'function') throw new Error('simulateBlueGreenSwitch not found');",
      "const s1 = simulateBlueGreenSwitch('blue', true, true);",
      "if (s1.nextColor !== 'green' || !s1.switched || s1.rollbackNeeded) throw new Error('Healthy green failed: ' + JSON.stringify(s1));",
      "const s2 = simulateBlueGreenSwitch('blue', false, true);",
      "if (s2.nextColor !== 'blue' || s2.switched || !s2.rollbackNeeded) throw new Error('Unhealthy green failed: ' + JSON.stringify(s2));",
      "const s3 = simulateBlueGreenSwitch('green', true, true);",
      "if (s3.nextColor !== 'blue' || !s3.switched) throw new Error('Healthy blue switch failed: ' + JSON.stringify(s3));"
    ),
    aTitle: "Plan Rolling Update Batch Steps and Capacity",
    aDesc: "Write `planRollingUpdateSteps(totalInstances: number, maxUnavailable: number = 1, maxSurge: number = 1): { totalSteps: number; batchSize: number; maxSurgeCapacity: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function planRollingUpdateSteps(totalInstances: number, maxUnavailable: number = 1, maxSurge: number = 1): { totalSteps: number; batchSize: number; maxSurgeCapacity: number } {",
      "  // Plan rolling update",
      "  return { totalSteps: 0, batchSize: 0, maxSurgeCapacity: 0 };",
      "}"
    ),
    aHint: "batchSize = Math.max(1, maxUnavailable); maxSurgeCapacity = totalInstances + maxSurge; totalSteps = Math.ceil(totalInstances / batchSize).",
    aTest: lines(
      "if (typeof planRollingUpdateSteps !== 'function') throw new Error('planRollingUpdateSteps not found');",
      "const r1 = planRollingUpdateSteps(10, 2, 2);",
      "if (r1.totalSteps !== 5 || r1.batchSize !== 2 || r1.maxSurgeCapacity !== 12) throw new Error('Failed r1: ' + JSON.stringify(r1));",
      "const r2 = planRollingUpdateSteps(5, 1, 1);",
      "if (r2.totalSteps !== 5 || r2.batchSize !== 1 || r2.maxSurgeCapacity !== 6) throw new Error('Failed r2: ' + JSON.stringify(r2));"
    )
  },

  // ── DAY 28 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[27],
    eTitle: "Evaluate Automated Canary Promotion Thresholds",
    eDesc: "Write `evaluateCanaryPromotion(baseline: { errorRate: number; p99LatencyMs: number }, canary: { errorRate: number; p99LatencyMs: number }, thresholds: { maxErrorRateIncrease: number; maxLatencyIncreasePercent: number }): { promote: boolean; reason: string }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateCanaryPromotion(baseline: { errorRate: number; p99LatencyMs: number }, canary: { errorRate: number; p99LatencyMs: number }, thresholds: { maxErrorRateIncrease: number; maxLatencyIncreasePercent: number }): { promote: boolean; reason: string } {",
      "  // Evaluate canary promotion",
      "  return { promote: false, reason: '' };",
      "}"
    ),
    eHint: "Check errorRate increase against threshold, then latency percentage increase, else promote.",
    eTest: lines(
      "if (typeof evaluateCanaryPromotion !== 'function') throw new Error('evaluateCanaryPromotion not found');",
      "const c1 = evaluateCanaryPromotion({ errorRate: 0.01, p99LatencyMs: 100 }, { errorRate: 0.012, p99LatencyMs: 105 }, { maxErrorRateIncrease: 0.005, maxLatencyIncreasePercent: 10 });",
      "if (!c1.promote || !c1.reason.includes('healthy')) throw new Error('Healthy canary failed: ' + JSON.stringify(c1));",
      "const c2 = evaluateCanaryPromotion({ errorRate: 0.01, p99LatencyMs: 100 }, { errorRate: 0.02, p99LatencyMs: 105 }, { maxErrorRateIncrease: 0.005, maxLatencyIncreasePercent: 10 });",
      "if (c2.promote || !c2.reason.includes('Error rate')) throw new Error('Error rate fail failed: ' + JSON.stringify(c2));",
      "const c3 = evaluateCanaryPromotion({ errorRate: 0.01, p99LatencyMs: 100 }, { errorRate: 0.01, p99LatencyMs: 120 }, { maxErrorRateIncrease: 0.005, maxLatencyIncreasePercent: 10 });",
      "if (c3.promote || !c3.reason.includes('Latency')) throw new Error('Latency fail failed: ' + JSON.stringify(c3));"
    ),
    aTitle: "Generate Canary Traffic Shifting Step Schedule",
    aDesc: "Write `calculateCanaryTrafficSteps(currentTrafficPercent: number, targetTrafficPercent: number = 100, stepPercent: number = 10): number[]`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateCanaryTrafficSteps(currentTrafficPercent: number, targetTrafficPercent: number = 100, stepPercent: number = 10): number[] {",
      "  // Generate traffic steps",
      "  return [];",
      "}"
    ),
    aHint: "Increment from current + stepPercent up to target, making sure target is the final element.",
    aTest: lines(
      "if (typeof calculateCanaryTrafficSteps !== 'function') throw new Error('calculateCanaryTrafficSteps not found');",
      "const s1 = calculateCanaryTrafficSteps(10, 50, 15);",
      "if (s1.join(',') !== '25,40,50') throw new Error('Failed s1: ' + s1.join(','));",
      "const s2 = calculateCanaryTrafficSteps(0, 100, 25);",
      "if (s2.join(',') !== '25,50,75,100') throw new Error('Failed s2: ' + s2.join(','));",
      "const s3 = calculateCanaryTrafficSteps(100, 100, 10);",
      "if (s3.length !== 0) throw new Error('Equal current/target should be empty');"
    )
  },

  // ── DAY 29 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[28],
    eTitle: "Execute Diagnostic Runbook Decision Tree Logic",
    eDesc: "Write `executeRunbookDecisionTree(node: { condition: string; action?: string; yesBranch?: any; noBranch?: any }, state: Record<string, boolean>): { executedActions: string[]; finalState: 'resolved' | 'escalate' }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function executeRunbookDecisionTree(node: { condition: string; action?: string; yesBranch?: any; noBranch?: any }, state: Record<string, boolean>): { executedActions: string[]; finalState: 'resolved' | 'escalate' } {",
      "  // Execute decision tree",
      "  return { executedActions: [], finalState: 'escalate' };",
      "}"
    ),
    eHint: "Check state[node.condition]; if true follow yesBranch, else noBranch; collect action properties.",
    eTest: lines(
      "if (typeof executeRunbookDecisionTree !== 'function') throw new Error('executeRunbookDecisionTree not found');",
      "const tree = {",
      "  condition: 'highCpu',",
      "  action: 'checkProcesses',",
      "  yesBranch: { condition: 'zombieExists', action: 'killZombie', yesBranch: { action: 'done' } },",
      "  noBranch: { action: 'escalateToDev' }",
      "};",
      "const r1 = executeRunbookDecisionTree(tree, { highCpu: true, zombieExists: true });",
      "if (r1.executedActions.join(',') !== 'checkProcesses,killZombie,done' || r1.finalState !== 'resolved') throw new Error('Failed r1: ' + JSON.stringify(r1));",
      "const r2 = executeRunbookDecisionTree(tree, { highCpu: false });",
      "if (r2.executedActions.join(',') !== 'checkProcesses,escalateToDev' || r2.finalState !== 'escalate') throw new Error('Failed r2: ' + JSON.stringify(r2));"
    ),
    aTitle: "Audit Incident Runbook Coverage and Automation Depth",
    aDesc: "Write `auditRunbookCoverage(incidentTypes: string[], runbooks: { incidentType: string; automatedActionCount: number }[]): { coveragePercent: number; unmappedTypes: string[]; fullyAutomatedCount: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function auditRunbookCoverage(incidentTypes: string[], runbooks: { incidentType: string; automatedActionCount: number }[]): { coveragePercent: number; unmappedTypes: string[]; fullyAutomatedCount: number } {",
      "  // Audit runbook coverage",
      "  return { coveragePercent: 0, unmappedTypes: [], fullyAutomatedCount: 0 };",
      "}"
    ),
    aHint: "coveragePercent is mapped / total; fullyAutomatedCount is runbooks with automatedActionCount >= 3.",
    aTest: lines(
      "if (typeof auditRunbookCoverage !== 'function') throw new Error('auditRunbookCoverage not found');",
      "const res = auditRunbookCoverage(['db_failover', 'oom_killed', 'cert_expired'], [",
      "  { incidentType: 'db_failover', automatedActionCount: 3 },",
      "  { incidentType: 'oom_killed', automatedActionCount: 1 }",
      "]);",
      "if (res.coveragePercent !== 66.67 || res.unmappedTypes.join(',') !== 'cert_expired' || res.fullyAutomatedCount !== 1) throw new Error('Failed audit: ' + JSON.stringify(res));",
      "const empty = auditRunbookCoverage([], []);",
      "if (empty.coveragePercent !== 100 || empty.unmappedTypes.length !== 0) throw new Error('Empty audit failed');"
    )
  },

  // ── DAY 30 ──────────────────────────────────────────────────────────
  {
    ...SRE_DAYS[29],
    eTitle: "Generate Comprehensive SRE Multi-Cloud Reliability Scorecard",
    eDesc: "Write `generateReliabilityScorecard(services: { id: string; sliAvailability: number; sloTarget: number; chaosPassed: boolean; canarySafe: boolean }[]): { overallScore: number; grade: 'A' | 'B' | 'C' | 'D' | 'F'; passingServices: number; totalServices: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function generateReliabilityScorecard(services: { id: string; sliAvailability: number; sloTarget: number; chaosPassed: boolean; canarySafe: boolean }[]): { overallScore: number; grade: 'A' | 'B' | 'C' | 'D' | 'F'; passingServices: number; totalServices: number } {",
      "  // Generate reliability scorecard",
      "  return { overallScore: 0, grade: 'F', passingServices: 0, totalServices: 0 };",
      "}"
    ),
    eHint: "For each service: sliScore (max 40), chaosScore (30 if passed), canaryScore (30 if safe). Passing if serviceScore >= 80. Grade: >= 90 A, >= 80 B, >= 70 C, >= 60 D, else F.",
    eTest: lines(
      "if (typeof generateReliabilityScorecard !== 'function') throw new Error('generateReliabilityScorecard not found');",
      "const sc1 = generateReliabilityScorecard([",
      "  { id: 'auth', sliAvailability: 99.9, sloTarget: 99.9, chaosPassed: true, canarySafe: true },",
      "  { id: 'api', sliAvailability: 99.5, sloTarget: 99.5, chaosPassed: true, canarySafe: true }",
      "]);",
      "if (sc1.overallScore !== 100 || sc1.grade !== 'A' || sc1.passingServices !== 2) throw new Error('Failed perfect scorecard: ' + JSON.stringify(sc1));",
      "const sc2 = generateReliabilityScorecard([",
      "  { id: 'db', sliAvailability: 95, sloTarget: 99, chaosPassed: false, canarySafe: true }",
      "]);",
      "if (sc2.overallScore !== 30 || sc2.grade !== 'F' || sc2.passingServices !== 0) throw new Error('Failed degraded scorecard: ' + JSON.stringify(sc2));",
      "const sc3 = generateReliabilityScorecard([]);",
      "if (sc3.overallScore !== 100 || sc3.grade !== 'A') throw new Error('Empty services should be 100 A');"
    ),
    aTitle: "Audit SRE Platform Master Capstone Certification Status",
    aDesc: "Write `auditSrePlatformCertification(completedDays: number, totalDays: number = 30): { certified: boolean; score: string; tier: string }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function auditSrePlatformCertification(completedDays: number, totalDays: number = 30): { certified: boolean; score: string; tier: string } {",
      "  // Audit SRE certification status",
      "  return { certified: false, score: '0/30', tier: 'INCOMPLETE_CURRICULUM' };",
      "}"
    ),
    aHint: "certified is true when completedDays === totalDays, tier is 'ENTERPRISE_SRE_CERTIFIED'.",
    aTest: lines(
      "if (typeof auditSrePlatformCertification !== 'function') throw new Error('auditSrePlatformCertification not found');",
      "const pass = auditSrePlatformCertification(30, 30);",
      "if (!pass.certified || pass.score !== '30/30' || pass.tier !== 'ENTERPRISE_SRE_CERTIFIED') throw new Error('Pass audit failed: ' + JSON.stringify(pass));",
      "const fail = auditSrePlatformCertification(25, 30);",
      "if (fail.certified || fail.score !== '25/30' || fail.tier !== 'INCOMPLETE_CURRICULUM') throw new Error('Fail audit failed: ' + JSON.stringify(fail));"
    )
  }
];

export const SRE_WEB_30_DAYS_QUESTS = SRE_WEB_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('sre-web', i + 1, cfg)
);
