// Test runner for Day 38 snippets
import vm from 'node:vm';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function testSnippet(name: string, code: string): Promise<string> {
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
    JSON,
    BigInt,
    Date
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 3000 });
  return out.join('\n');
}

const c1 = `interface BrokerNode {
  id: number;
  az: 'us-east-1a' | 'us-east-1b' | 'us-east-1c';
  isAlive: boolean;
}

interface TopicPartition {
  partitionId: number;
  leaderBrokerId: number;
  replicas: number[];
  isr: number[];
}

function evaluateTopicHealth(brokers: BrokerNode[], partition: TopicPartition, minIsr: number): string {
  const liveBrokers = new Set(brokers.filter(b => b.isAlive).map(b => b.id));
  const activeIsr = partition.isr.filter(id => liveBrokers.has(id));
  const isWritable = activeIsr.length >= minIsr && liveBrokers.has(partition.leaderBrokerId);

  return \`MSK_PARTITION_STATUS: Partition=\${partition.partitionId} Leader=\${partition.leaderBrokerId} TotalReplicas=\${partition.replicas.length} ActiveISR=\${activeIsr.length}/\${partition.isr.length} MinISR=\${minIsr} Writable=\${isWritable}\`;
}

const clusterBrokers: BrokerNode[] = [
  { id: 1, az: 'us-east-1a', isAlive: true },
  { id: 2, az: 'us-east-1b', isAlive: true },
  { id: 3, az: 'us-east-1c', isAlive: false },
];

const partition: TopicPartition = {
  partitionId: 0,
  leaderBrokerId: 1,
  replicas: [1, 2, 3],
  isr: [1, 2, 3],
};

console.log(evaluateTopicHealth(clusterBrokers, partition, 2));`;

const c2 = `type AckLevel = 0 | 1 | -1;

interface ProducerRecordResult {
  ackConfig: string;
  durabilityTier: 'ZERO_DURABILITY' | 'LEADER_ONLY' | 'STRONG_ISR_CONSISTENCY';
  survivesLeaderCrash: boolean;
  ackLatencyMs: number;
}

function evaluateAckPolicy(acks: AckLevel): ProducerRecordResult {
  switch (acks) {
    case 0:
      return { ackConfig: 'acks=0', durabilityTier: 'ZERO_DURABILITY', survivesLeaderCrash: false, ackLatencyMs: 0.5 };
    case 1:
      return { ackConfig: 'acks=1', durabilityTier: 'LEADER_ONLY', survivesLeaderCrash: false, ackLatencyMs: 4.2 };
    case -1:
      return { ackConfig: 'acks=all (min.insync.replicas=2)', durabilityTier: 'STRONG_ISR_CONSISTENCY', survivesLeaderCrash: true, ackLatencyMs: 14.8 };
  }
}

const policies: AckLevel[] = [0, 1, -1];
for (const p of policies) {
  const res = evaluateAckPolicy(p);
  console.log(\`[\${res.ackConfig}] Durability=\${res.durabilityTier} ZeroLossGuarantee=\${res.survivesLeaderCrash} Latency=\${res.ackLatencyMs}ms\`);
}`;

const c3 = `interface ConsumerPod {
  podName: string;
  assignedPartitions: number[];
}

function assignPartitions(partitionCount: number, consumers: string[]): ConsumerPod[] {
  const pods: ConsumerPod[] = consumers.map(name => ({ podName: name, assignedPartitions: [] }));

  for (let p = 0; p < partitionCount; p++) {
    const targetConsumer = pods[p % pods.length];
    targetConsumer.assignedPartitions.push(p);
  }

  return pods;
}

const consumerNames = Array.from({ length: 8 }, (_, i) => \`consumer-pod-\${i + 1}\`);
const assignment = assignPartitions(6, consumerNames);

const activePods = assignment.filter(p => p.assignedPartitions.length > 0);
const idlePods = assignment.filter(p => p.assignedPartitions.length === 0);

console.log(\`KAFKA_REBALANCE_RESULT: Partitions=6 TotalConsumers=8 ActiveWorkers=\${activePods.length} IdleWorkers=\${idlePods.length}\`);
console.log(\`ACTIVE_ASSIGNMENTS: \${activePods.map(p => \`\${p.podName}->[p\${p.assignedPartitions.join(',')}]\`).join(', ')}\`);
console.log(\`IDLE_PODS: \${idlePods.map(p => p.podName).join(', ')}\`);`;

const c4 = `interface MSKSecurityProfile {
  authProtocol: 'SASL_SSL' | 'IAM' | 'PLAINTEXT';
  mechanism: 'SCRAM-SHA-512' | 'AWS_MSK_IAM' | 'NONE';
  inTransitEncryption: 'TLS_1_3' | 'DISABLED';
  secretsManagerArn: string;
}

class MSKSecurityValidator {
  validateSecurityPosture(profile: MSKSecurityProfile): { compliant: boolean; securityScore: number; details: string } {
    const isEncrypted = profile.inTransitEncryption === 'TLS_1_3';
    const isSecureAuth = profile.authProtocol === 'SASL_SSL' || profile.authProtocol === 'IAM';
    const hasSecretIntegration = profile.secretsManagerArn.startsWith('arn:aws:secretsmanager:');

    const compliant = isEncrypted && isSecureAuth && hasSecretIntegration;
    const score = (isEncrypted ? 40 : 0) + (isSecureAuth ? 30 : 0) + (hasSecretIntegration ? 30 : 0);

    return {
      compliant,
      securityScore: score,
      details: \`Auth=\${profile.authProtocol}/\${profile.mechanism} Encryption=\${profile.inTransitEncryption} SecretsEngine=\${hasSecretIntegration ? 'ACTIVE' : 'NONE'}\`,
    };
  }
}

const validator = new MSKSecurityValidator();
const prodProfile: MSKSecurityProfile = {
  authProtocol: 'SASL_SSL',
  mechanism: 'SCRAM-SHA-512',
  inTransitEncryption: 'TLS_1_3',
  secretsManagerArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:AmazonMSK_kafka_prod_user',
};

const result = validator.validateSecurityPosture(prodProfile);
console.log(\`MSK_SECURITY_VALIDATION: Compliant=\${result.compliant} Score=\${result.securityScore}/100 Status=\${result.details}\`);`;

const c5 = `interface PartitionOffsetLag {
  partition: number;
  logEndOffset: number;
  currentConsumerOffset: number;
}

class MSKClusterSupervisor {
  private partitions: PartitionOffsetLag[] = [];

  constructor(partitionStats: PartitionOffsetLag[]) {
    this.partitions = partitionStats;
  }

  evaluateConsumerLag(maxAllowedLag: number): { totalLag: number; criticalPartitions: number[]; status: 'HEALTHY' | 'DEGRADED' } {
    let totalLag = 0;
    const critical: number[] = [];

    for (const p of this.partitions) {
      const lag = p.logEndOffset - p.currentConsumerOffset;
      totalLag += lag;
      if (lag > maxAllowedLag) {
        critical.push(p.partition);
      }
    }

    return {
      totalLag,
      criticalPartitions: critical,
      status: critical.length === 0 ? 'HEALTHY' : 'DEGRADED',
    };
  }
}

const stats: PartitionOffsetLag[] = [
  { partition: 0, logEndOffset: 154000, currentConsumerOffset: 153950 },
  { partition: 1, logEndOffset: 182000, currentConsumerOffset: 181900 },
  { partition: 2, logEndOffset: 195000, currentConsumerOffset: 188500 },
  { partition: 3, logEndOffset: 140000, currentConsumerOffset: 139980 },
];

const supervisor = new MSKClusterSupervisor(stats);
const health = supervisor.evaluateConsumerLag(1000);

console.log(\`MSK_CLUSTER_HEALTH: Status=\${health.status} TotalConsumerLag=\${health.totalLag} records\`);
console.log(\`ALERT_PARTITIONS: Count=\${health.criticalPartitions.length} DegradedPartitions=[\${health.criticalPartitions.join(', ')}] ActionRequired=INVESTIGATE_WORKER_HEARTBEAT\`);`;

async function main() {
  console.log('=== PART 1 ===');
  console.log(await testSnippet('P1', c1));
  console.log('\n=== PART 2 ===');
  console.log(await testSnippet('P2', c2));
  console.log('\n=== PART 3 ===');
  console.log(await testSnippet('P3', c3));
  console.log('\n=== PART 4 ===');
  console.log(await testSnippet('P4', c4));
  console.log('\n=== PART 5 ===');
  console.log(await testSnippet('P5', c5));
}

main();
