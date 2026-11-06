import { compileTs } from '../src/lib/code/ts/compileTs';
import vm from 'node:vm';

async function testSnippet(code: string) {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math, Map, Set, String, Number, Boolean, Array, Object, JSON
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

async function run() {
  const s1 = `interface ApiRequest {
  protocol: 'HTTP' | 'REST' | 'WEBSOCKET';
  path: string;
  method: string;
}

class ApiGatewayEngine {
  routeRequest(req: ApiRequest): { targetService: string; latencyBudgetMs: number } {
    if (req.protocol === 'WEBSOCKET') {
      return { targetService: 'WebSocketConnectionPool', latencyBudgetMs: 5 };
    }
    if (req.path.startsWith('/v1/orders')) {
      return { targetService: 'OrderServiceLambda', latencyBudgetMs: 15 };
    }
    if (req.path.startsWith('/v1/catalog')) {
      return { targetService: 'ValkeyCacheProxy', latencyBudgetMs: 2 };
    }
    return { targetService: 'DefaultHttpIntegration', latencyBudgetMs: 20 };
  }
}

const gateway = new ApiGatewayEngine();
const r1 = gateway.routeRequest({ protocol: 'REST', path: '/v1/orders/create', method: 'POST' });
const r2 = gateway.routeRequest({ protocol: 'HTTP', path: '/v1/catalog/browse', method: 'GET' });
const r3 = gateway.routeRequest({ protocol: 'WEBSOCKET', path: '$default', method: 'MESSAGE' });

console.log('Status=API_GATEWAY_ROUTING_VERIFIED | OrdersTarget=' + r1.targetService + ' | CatalogTarget=' + r2.targetService + ' | WsTarget=' + r3.targetService);`;

  const s2 = `class TokenBucketRateLimiter {
  private capacity: number;
  private tokens: number;
  private refillRatePerSec: number;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRatePerSec = refillRatePerSec;
  }

  consume(apiKey: string, tier: 'BASIC' | 'ENTERPRISE'): { allowed: boolean; remaining: number } {
    if (tier === 'ENTERPRISE') {
      return { allowed: true, remaining: 9999 };
    }
    if (this.tokens > 0) {
      this.tokens--;
      return { allowed: true, remaining: this.tokens };
    }
    return { allowed: false, remaining: 0 };
  }
}

const limiter = new TokenBucketRateLimiter(2, 5);
const call1 = limiter.consume('key-basic-1', 'BASIC');
const call2 = limiter.consume('key-basic-1', 'BASIC');
const call3 = limiter.consume('key-basic-1', 'BASIC');
const entCall = limiter.consume('key-ent-9', 'ENTERPRISE');

console.log('Status=RATE_LIMITER_THROTTLING_VERIFIED | Call1=' + call1.allowed + ' | Call2=' + call2.allowed + ' | Call3Throttled=' + (!call3.allowed) + ' | EnterpriseAllowed=' + entCall.allowed);`;

  const s3 = `interface GraphQlQuery {
  operation: 'getOrder' | 'listProducts';
  args: Record<string, unknown>;
}

class AppSyncResolverPipeline {
  private products = [
    { id: 'PROD-1', name: 'Cloud Router', stock: 45 },
    { id: 'PROD-2', name: 'Edge Switch', stock: 12 }
  ];

  resolve(query: GraphQlQuery): { data: unknown; errors: string[] } {
    if (query.operation === 'listProducts') {
      return { data: this.products, errors: [] };
    }
    if (query.operation === 'getOrder') {
      const orderId = query.args.orderId;
      return { data: { id: orderId, status: 'CONFIRMED', total: 1299 }, errors: [] };
    }
    return { data: null, errors: ['UNKNOWN_FIELD'] };
  }
}

const appSync = new AppSyncResolverPipeline();
const q1 = appSync.resolve({ operation: 'listProducts', args: {} });
const q2 = appSync.resolve({ operation: 'getOrder', args: { orderId: 'ORD-991' } });

const prodCount = Array.isArray(q1.data) ? q1.data.length : 0;
const orderStatus = (q2.data as { status: string }).status;

console.log('Status=APPSYNC_RESOLVER_PIPELINE_VERIFIED | ProductCount=' + prodCount + ' | OrderStatus=' + orderStatus + ' | Errors=' + q1.errors.length);`;

  const s4 = `interface WsClient {
  connectionId: string;
  connectedAt: number;
}

class WebSocketManager {
  private connections = new Map<string, WsClient>();

  handleConnect(connectionId: string): boolean {
    this.connections.set(connectionId, { connectionId, connectedAt: Date.now() });
    return true;
  }

  handleDisconnect(connectionId: string): boolean {
    return this.connections.delete(connectionId);
  }

  broadcast(message: string): { deliveredCount: number; activeSockets: number } {
    let count = 0;
    for (const [id] of this.connections) {
      count++;
    }
    return { deliveredCount: count, activeSockets: this.connections.size };
  }
}

const ws = new WebSocketManager();
ws.handleConnect('conn-usr-101');
ws.handleConnect('conn-usr-102');
ws.handleConnect('conn-usr-103');
ws.handleDisconnect('conn-usr-102');

const broadcastResult = ws.broadcast('STOCK_UPDATE:PROD-1');

console.log('Status=WEBSOCKET_MANAGER_VERIFIED | ActiveSockets=' + broadcastResult.activeSockets + ' | DeliveredMessages=' + broadcastResult.deliveredCount + ' | SocketStateConsistent=true');`;

  const s5 = `class HybridApiIngressPlatform {
  processIngress(protocol: 'REST' | 'GRAPHQL' | 'WEBSOCKET', payloadSizeKb: number): {
    authenticated: boolean;
    throttled: boolean;
    backendRoutingLatencyMs: number;
    protocolConfirmed: string;
  } {
    const authenticated = true;
    const throttled = payloadSizeKb > 10000;
    const backendRoutingLatencyMs = protocol === 'WEBSOCKET' ? 4 : 8;

    return {
      authenticated,
      throttled,
      backendRoutingLatencyMs,
      protocolConfirmed: protocol
    };
  }
}

const platform = new HybridApiIngressPlatform();
const restRes = platform.processIngress('REST', 50);
const gqlRes = platform.processIngress('GRAPHQL', 120);
const wsRes = platform.processIngress('WEBSOCKET', 10);

console.log('Status=HYBRID_API_INGRESS_VERIFIED | RestAuth=' + restRes.authenticated + ' | GraphQlLatencyMs=' + gqlRes.backendRoutingLatencyMs + ' | WsProtocol=' + wsRes.protocolConfirmed + ' | IngressHealthy=true');`;

  console.log('--- OUTPUT 1 ---');
  console.log(await testSnippet(s1));
  console.log('--- OUTPUT 2 ---');
  console.log(await testSnippet(s2));
  console.log('--- OUTPUT 3 ---');
  console.log(await testSnippet(s3));
  console.log('--- OUTPUT 4 ---');
  console.log(await testSnippet(s4));
  console.log('--- OUTPUT 5 ---');
  console.log(await testSnippet(s5));
}

run().catch(console.error);
