// Test runner for Day 39 snippets
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

const c1 = `interface GraphQLSubscriptionFilter {
  subscriptionName: string;
  mutationTrigger: string;
  filterArgument?: string;
  isFilteredBroadcast: boolean;
}

function evaluateSubscriptionModel(sub: GraphQLSubscriptionFilter, clientArg: string, mutationPayloadSymbol: string): string {
  const matchesFilter = !sub.filterArgument || clientArg === mutationPayloadSymbol;
  const broadcastDelivered = sub.isFilteredBroadcast ? matchesFilter : true;

  return \`APPSYNC_SUBSCRIPTION_DELIVERY: Subscription=\${sub.mutationTrigger}->\${sub.subscriptionName} FilterArg=\${sub.filterArgument || 'NONE'} ClientSubscribedTo=\${clientArg} MutationEvent=\${mutationPayloadSymbol} Delivered=\${broadcastDelivered}\`;
}

const filteredSub: GraphQLSubscriptionFilter = {
  subscriptionName: 'onPriceUpdate',
  mutationTrigger: 'updatePrice',
  filterArgument: 'symbol',
  isFilteredBroadcast: true,
};

const unfilteredSub: GraphQLSubscriptionFilter = {
  subscriptionName: 'onPriceUpdate',
  mutationTrigger: 'updatePrice',
  isFilteredBroadcast: false,
};

console.log(evaluateSubscriptionModel(filteredSub, 'AAPL', 'AAPL'));
console.log(evaluateSubscriptionModel(filteredSub, 'MSFT', 'AAPL'));
console.log(evaluateSubscriptionModel(unfilteredSub, 'MSFT', 'AAPL'));`;

const c2 = `interface ResolverBenchmark {
  resolverType: 'APPSYNC_NATIVE_JS' | 'LAMBDA_PROXY';
  invokesLambdaContainer: boolean;
  coldStartRiskMs: number;
  avgLatencyMs: number;
  costPerMillionRequestsUsd: number;
}

function compareResolvers(): { native: ResolverBenchmark; lambda: ResolverBenchmark } {
  const native: ResolverBenchmark = {
    resolverType: 'APPSYNC_NATIVE_JS',
    invokesLambdaContainer: false,
    coldStartRiskMs: 0,
    avgLatencyMs: 6.8,
    costPerMillionRequestsUsd: 4.0,
  };

  const lambda: ResolverBenchmark = {
    resolverType: 'LAMBDA_PROXY',
    invokesLambdaContainer: true,
    coldStartRiskMs: 450,
    avgLatencyMs: 42.5,
    costPerMillionRequestsUsd: 8.2,
  };

  return { native, lambda };
}

const comparison = compareResolvers();
console.log(\`[\${comparison.native.resolverType}] InvokesLambda=\${comparison.native.invokesLambdaContainer} ColdStartMs=\${comparison.native.coldStartRiskMs} AvgLatency=\${comparison.native.avgLatencyMs}ms CostPer1M=$\${comparison.native.costPerMillionRequestsUsd.toFixed(2)}\`);
console.log(\`[\${comparison.lambda.resolverType}] InvokesLambda=\${comparison.lambda.invokesLambdaContainer} ColdStartMs=\${comparison.lambda.coldStartRiskMs} AvgLatency=\${comparison.lambda.avgLatencyMs}ms CostPer1M=$\${comparison.lambda.costPerMillionRequestsUsd.toFixed(2)}\`);`;

const c3 = `interface AppSyncContext {
  userId: string;
  role: 'ADMIN' | 'USER';
  documentId: string;
  payload: string;
}

interface PipelineStep {
  stepName: string;
  execute: (ctx: AppSyncContext) => { success: boolean; error?: string };
}

class PipelineResolverEngine {
  private steps: PipelineStep[] = [];

  addStep(step: PipelineStep) {
    this.steps.push(step);
  }

  executePipeline(ctx: AppSyncContext): string {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      const res = step.execute(ctx);
      if (!res.success) {
        return \`PIPELINE_ERROR: Step=\${step.stepName} Error='\${res.error}'\`;
      }
    }
    return \`PIPELINE_SUCCESS: All \${this.steps.length} functions executed cleanly for doc=\${ctx.documentId}\`;
  }
}

const pipeline = new PipelineResolverEngine();
pipeline.addStep({
  stepName: 'ValidateAuthToken',
  execute: (ctx) => (ctx.userId ? { success: true } : { success: false, error: 'Unauthorized' }),
});
pipeline.addStep({
  stepName: 'CheckDocumentPermissions',
  execute: (ctx) => (ctx.role === 'ADMIN' || ctx.documentId.startsWith(ctx.userId) ? { success: true } : { success: false, error: 'Forbidden' }),
});
pipeline.addStep({
  stepName: 'WriteAuditLogToDynamoDB',
  execute: () => ({ success: true }),
});

console.log(pipeline.executePipeline({ userId: 'user-101', role: 'USER', documentId: 'user-101-notes', payload: 'update text' }));
console.log(pipeline.executePipeline({ userId: 'user-102', role: 'USER', documentId: 'user-101-notes', payload: 'hack attempt' }));`;

const c4 = `interface ConnectedClient {
  connectionId: string;
  subscriptionTopic: string;
  connectedAtMs: number;
}

class AppSyncSubscriptionManager {
  private clients: Map<string, ConnectedClient> = new Map();

  registerClient(connId: string, topic: string) {
    this.clients.set(connId, { connectionId: connId, subscriptionTopic: topic, connectedAtMs: Date.now() });
  }

  broadcastMutation(topic: string, eventData: string): { matchedSubscribers: number; payload: string } {
    let matches = 0;
    for (const c of this.clients.values()) {
      if (c.subscriptionTopic === topic) {
        matches++;
      }
    }
    return { matchedSubscribers: matches, payload: eventData };
  }
}

const manager = new AppSyncSubscriptionManager();
manager.registerClient('conn-001', 'stock:AAPL');
manager.registerClient('conn-002', 'stock:AAPL');
manager.registerClient('conn-003', 'stock:GOOG');
manager.registerClient('conn-004', 'stock:AAPL');

const broadcast = manager.broadcastMutation('stock:AAPL', '{"price": 182.50}');
console.log(\`APPSYNC_BROADCAST: TargetTopic='stock:AAPL' MatchedClients=\${broadcast.matchedSubscribers}/4 Data='\${broadcast.payload}'\`);`;

const c5 = `interface DocumentUpdateEvent {
  documentId: string;
  authorId: string;
  charDelta: number;
}

class ProductionAppSyncCollaborativeEngine {
  private activeWebSockets: number;
  private dynamoDbDirectResolversCount: number;

  constructor(activeClients: number, nativeResolvers: number) {
    this.activeWebSockets = activeClients;
    this.dynamoDbDirectResolversCount = nativeResolvers;
  }

  processDocumentMutation(evt: DocumentUpdateEvent): string {
    const latencyEstimateMs = 5.4;
    const broadcastRecipients = this.activeWebSockets;

    return \`COLLABORATIVE_MUTATION_COMPLETE: Doc=\${evt.documentId} Author=\${evt.authorId} Delta=\${evt.charDelta}chars Resolver=APPSYNC_JS_DIRECT DynamoLatency=\${latencyEstimateMs}ms WebSocketFanOut=\${broadcastRecipients}clients\`;
  }
}

const engine = new ProductionAppSyncCollaborativeEngine(25000, 4);
const event: DocumentUpdateEvent = {
  documentId: 'arch-spec-v2',
  authorId: 'eng-lead-01',
  charDelta: 45,
};

console.log(engine.processDocumentMutation(event));`;

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
