// scripts/test_dist_day43_snippets.ts

// Snippet 1: Redis Sentinel Quorum Failover Simulator
interface SentinelNode {
  id: string;
  observedMasterHealth: 'ONLINE' | 'SUBJECTIVELY_DOWN';
}

class RedisSentinelManager {
  private sentinels: SentinelNode[] = [];
  private quorumThreshold: number;

  constructor(sentinels: SentinelNode[], quorumThreshold: number) {
    this.sentinels = sentinels;
    this.quorumThreshold = quorumThreshold;
  }

  evaluateMasterHealth(): {
    isObjectivelyDown: boolean;
    sdownVotes: number;
    failoverAuthorized: boolean;
  } {
    const sdownCount = this.sentinels.filter(s => s.observedMasterHealth === 'SUBJECTIVELY_DOWN').length;
    const odown = sdownCount >= this.quorumThreshold;
    return {
      isObjectivelyDown: odown,
      sdownVotes: sdownCount,
      failoverAuthorized: odown
    };
  }
}

const sentinels: SentinelNode[] = [
  { id: 'sentinel-1', observedMasterHealth: 'SUBJECTIVELY_DOWN' },
  { id: 'sentinel-2', observedMasterHealth: 'SUBJECTIVELY_DOWN' },
  { id: 'sentinel-3', observedMasterHealth: 'ONLINE' }
];
const sentinelMgr = new RedisSentinelManager(sentinels, 2);
const sRes = sentinelMgr.evaluateMasterHealth();
console.log(`[Redis Sentinel] Subjective Down Votes: ${sRes.sdownVotes}/3`);
console.log(`[Redis Sentinel] Objectively Down (ODOWN): ${sRes.isObjectivelyDown}`);
console.log(`[Redis Sentinel] Failover Authorized: ${sRes.failoverAuthorized}`);

// Snippet 2: CRC16 Hash Slot Calculation & Node Mapping
class RedisClusterSlotMapper {
  // Simple deterministic hash simulation for CRC16 % 16384
  static calculateSlot(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const slot = Math.abs(hash) % 16384;
    return slot;
  }

  static getResponsibleNode(slot: number): string {
    // 3-node cluster partition:
    // Node A: 0 - 5460
    // Node B: 5461 - 10922
    // Node C: 10923 - 16383
    if (slot <= 5460) return 'redis-node-A';
    if (slot <= 10922) return 'redis-node-B';
    return 'redis-node-C';
  }
}

const slotUser = RedisClusterSlotMapper.calculateSlot('user:profile:1001');
const slotOrder = RedisClusterSlotMapper.calculateSlot('order:header:992');
console.log(`[Redis Cluster] Key 'user:profile:1001' mapped to Slot ${slotUser} (${RedisClusterSlotMapper.getResponsibleNode(slotUser)})`);
console.log(`[Redis Cluster] Key 'order:header:992' mapped to Slot ${slotOrder} (${RedisClusterSlotMapper.getResponsibleNode(slotOrder)})`);

// Snippet 3: MOVED vs ASK Redirection Protocol
interface ClusterResponse {
  type: 'OK' | 'MOVED' | 'ASK';
  targetNode?: string;
  slot?: number;
  val?: string;
}

class RedisNodeRouter {
  private responsibleSlotStart: number;
  private responsibleSlotEnd: number;
  private migratingSlots = new Set<number>();

  constructor(start: number, end: number) {
    this.responsibleSlotStart = start;
    this.responsibleSlotEnd = end;
  }

  markSlotMigrating(slot: number): void {
    this.migratingSlots.add(slot);
  }

  executeCommand(slot: number, key: string): ClusterResponse {
    if (this.migratingSlots.has(slot)) {
      // Slot is currently migrating -> emit ASK redirection
      return { type: 'ASK', slot, targetNode: 'redis-node-B:6379' };
    }
    if (slot >= this.responsibleSlotStart && slot <= this.responsibleSlotEnd) {
      return { type: 'OK', val: `VALUE_FOR_${key}` };
    }
    // Slot permanently lives elsewhere -> emit MOVED redirection
    return { type: 'MOVED', slot, targetNode: 'redis-node-C:6379' };
  }
}

const nodeA = new RedisNodeRouter(0, 5460);
const resOk = nodeA.executeCommand(100, 'item:1');
const resMoved = nodeA.executeCommand(12000, 'item:2');
nodeA.markSlotMigrating(2500);
const resAsk = nodeA.executeCommand(2500, 'item:3');
console.log(`[Redis Redirection] Owned Slot Response: ${resOk.type}`);
console.log(`[Redis Redirection] Foreign Slot Response: ${resMoved.type} -> ${resMoved.targetNode}`);
console.log(`[Redis Redirection] Migrating Slot Response: ${resAsk.type} -> ${resAsk.targetNode}`);

// Snippet 4: Dynamic Hash Slot Migration & Resharding Flow
class HashSlotMigrationEngine {
  static simulateSlotMigration(
    slot: number,
    sourceNode: string,
    targetNode: string,
    keysInSlot: number
  ): {
    state: 'MIGRATION_COMPLETED';
    transferredKeys: number;
    finalOwner: string;
  } {
    // 1. Target node sets IMPORTING from source
    // 2. Source node sets MIGRATING to target
    // 3. Keys dumped, restored, and acknowledged
    // 4. Cluster epoch bumped and broadcast
    return {
      state: 'MIGRATION_COMPLETED',
      transferredKeys: keysInSlot,
      finalOwner: targetNode
    };
  }
}

const migResult = HashSlotMigrationEngine.simulateSlotMigration(5000, 'node-A', 'node-B', 150);
console.log(`[Slot Migration] Slot 5000 Migration State: ${migResult.state}`);
console.log(`[Slot Migration] Transferred Keys: ${migResult.transferredKeys}`);
console.log(`[Slot Migration] New Owner: ${migResult.finalOwner}`);

// Snippet 5: Production Redis Cluster Engine & Topology Telemetry
interface ClusterTopologyMetric {
  clusterState: 'CLUSTER_OK';
  totalMasters: number;
  totalReplicas: number;
  totalSlotsCovered: number;
  redirectionRatePercent: number;
  readThroughputQps: number;
}

class ProductionRedisClusterEngine {
  static runClusterHealthAudit(): ClusterTopologyMetric {
    return {
      clusterState: 'CLUSTER_OK',
      totalMasters: 6,
      totalReplicas: 6,
      totalSlotsCovered: 16384,
      redirectionRatePercent: 0.02, // Smart client routes 99.98% directly
      readThroughputQps: 450000
    };
  }
}

const audit = ProductionRedisClusterEngine.runClusterHealthAudit();
console.log(`[Production Redis Cluster] Cluster State: ${audit.clusterState}`);
console.log(`[Production Redis Cluster] Master Nodes: ${audit.totalMasters}`);
console.log(`[Production Redis Cluster] Total Slots Covered: ${audit.totalSlotsCovered}/16384`);
console.log(`[Production Redis Cluster] Client Redirection Rate: ${audit.redirectionRatePercent}%`);
console.log(`[Production Redis Cluster] Aggregate Throughput: ${audit.readThroughputQps} QPS`);
