import vm from 'node:vm';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function runTs(code: string): Promise<string> {
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

async function testAll() {
  const p1 = `// Envoy Sidecar Packet Interception & iptables Redirection
interface IptablesRule {
  chain: 'PREROUTING' | 'OUTPUT';
  protocol: 'tcp';
  destinationPort: number;
  redirectPort: number; // Envoy listener port 15006 (inbound) or 15001 (outbound)
}

class EnvoyPacketInterceptor {
  private rules: IptablesRule[] = [];

  setupRedirection() {
    this.rules.push({ chain: 'PREROUTING', protocol: 'tcp', destinationPort: 8080, redirectPort: 15006 });
    this.rules.push({ chain: 'OUTPUT', protocol: 'tcp', destinationPort: 443, redirectPort: 15001 });
  }

  intercept(direction: 'inbound' | 'outbound', port: number): string {
    const chain = direction === 'inbound' ? 'PREROUTING' : 'OUTPUT';
    const rule = this.rules.find(r => r.chain === chain && r.destinationPort === port);
    if (!rule) return 'BYPASS_CONTAINER_DIRECT';
    return \`INTERCEPTED [\${direction.toUpperCase()}]: Port \${port} -> Envoy Local Port \${rule.redirectPort}\`;
  }
}

const interceptor = new EnvoyPacketInterceptor();
interceptor.setupRedirection();
console.log(interceptor.intercept('inbound', 8080));
console.log(interceptor.intercept('outbound', 443));`;

  const p2 = `// SPIFFE Identity & STRICT PeerAuthentication Enforcement
interface SpiffeCertificate {
  spiffeId: string; // e.g. spiffe://cluster.local/ns/payments/sa/checkout-service-sa
  validUntil: number;
  cipherSuite: string;
}

class PeerAuthenticationEngine {
  private mode: 'STRICT' | 'PERMISSIVE';

  constructor(mode: 'STRICT' | 'PERMISSIVE') {
    this.mode = mode;
  }

  evaluateConnection(hasTls: boolean, cert?: SpiffeCertificate): string {
    if (this.mode === 'STRICT') {
      if (!hasTls || !cert) {
        return 'DROPPED: Connection reset by peer (Plaintext rejected in STRICT mode)';
      }
      return \`AUTHENTICATED_MTLS: Principal=\${cert.spiffeId} Cipher=\${cert.cipherSuite}\`;
    }
    return hasTls ? 'AUTHENTICATED_MTLS' : 'ACCEPTED_PLAINTEXT_FALLBACK';
  }
}

const strictEngine = new PeerAuthenticationEngine('STRICT');
const validCert: SpiffeCertificate = {
  spiffeId: 'spiffe://cluster.local/ns/banking/sa/ledger-sa',
  validUntil: Date.now() + 86400000,
  cipherSuite: 'ECDHE-ECDSA-AES128-GCM-SHA256'
};

console.log(strictEngine.evaluateConnection(false));
console.log(strictEngine.evaluateConnection(true, validCert));`;

  const p3 = `// Istio VirtualService Canary Traffic Shifter & Circuit Breaker
interface DestinationWeight {
  subset: 'v1' | 'v2';
  weight: number;
}

interface CircuitBreakerConfig {
  maxConsecutive5xx: number;
  currentFailures: number;
  circuitOpen: boolean;
}

class CanaryTrafficRouter {
  private destinations: DestinationWeight[];
  private cb: CircuitBreakerConfig;

  constructor(destinations: DestinationWeight[], cb: CircuitBreakerConfig) {
    this.destinations = destinations;
    this.cb = cb;
  }

  recordFailure() {
    this.cb.currentFailures++;
    if (this.cb.currentFailures >= this.cb.maxConsecutive5xx) {
      this.cb.circuitOpen = true;
    }
  }

  route(randomNormalized: number): string {
    if (this.cb.circuitOpen) {
      return 'CIRCUIT_BREAKER_TRIPPED: Outlier target ejected (503 Service Unavailable)';
    }
    let cumulative = 0;
    for (const d of this.destinations) {
      cumulative += d.weight;
      if (randomNormalized * 100 <= cumulative) {
        return \`ROUTED_TO: Subset \${d.subset} (Weight: \${d.weight}%)\`;
      }
    }
    return 'ROUTED_TO: Default fallback';
  }
}

const router = new CanaryTrafficRouter(
  [{ subset: 'v1', weight: 90 }, { subset: 'v2', weight: 10 }],
  { maxConsecutive5xx: 3, currentFailures: 0, circuitOpen: false }
);

console.log(router.route(0.50)); // Should route to v1 (50 <= 90)
console.log(router.route(0.95)); // Should route to v2 (95 > 90)
router.recordFailure(); router.recordFailure(); router.recordFailure();
console.log(router.route(0.50)); // Circuit open`;

  const p4 = `// Istio Layer 7 AuthorizationPolicy Evaluation
interface RequestPrincipal {
  sourceSpiffe: string;
  jwtRole: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
}

class AuthorizationPolicyEngine {
  evaluate(req: RequestPrincipal): string {
    // Policy: Allow only Principal 'billing-sa' with role 'finance-admin' to DELETE /v1/ledgers
    if (req.method === 'DELETE' && req.path.startsWith('/v1/ledgers')) {
      const allowedSpiffe = 'spiffe://cluster.local/ns/finance/sa/billing-sa';
      if (req.sourceSpiffe === allowedSpiffe && req.jwtRole === 'finance-admin') {
        return 'RBAC_ALLOWED: Policy matched for finance-admin';
      }
      return 'RBAC_DENIED_403: Forbidden - Principal or Role mismatch';
    }
    return 'RBAC_ALLOWED: Read/Write standard policy';
  }
}

const auth = new AuthorizationPolicyEngine();
console.log(auth.evaluate({
  sourceSpiffe: 'spiffe://cluster.local/ns/finance/sa/billing-sa',
  jwtRole: 'finance-admin',
  method: 'DELETE',
  path: '/v1/ledgers/acc-9902'
}));
console.log(auth.evaluate({
  sourceSpiffe: 'spiffe://cluster.local/ns/marketing/sa/analytics-sa',
  jwtRole: 'viewer',
  method: 'DELETE',
  path: '/v1/ledgers/acc-9902'
}));`;

  const p5 = `// Masterclass Synthesis: Enterprise Zero-Trust Service Mesh Engine
interface MeshPacket {
  clientIp: string;
  sourceSpiffe: string;
  targetService: string;
  path: string;
  hasTls: boolean;
  canaryRolloutPct: number;
}

class EnterpriseServiceMeshEngine {
  private strictMtls = true;
  private consecutiveErrors = 0;

  processRequest(pkt: MeshPacket): { status: string; routedVersion: string; mTLS: string; latencyMs: number } {
    // 1. Transparent Interception & Strict mTLS Check
    if (this.strictMtls && !pkt.hasTls) {
      return {
        status: 'CONNECTION_RESET_400',
        routedVersion: 'none',
        mTLS: 'REJECTED_PLAINTEXT',
        latencyMs: 0.1
      };
    }

    // 2. Traffic Shifting (Canary)
    const version = pkt.canaryRolloutPct >= 90 ? 'v2' : 'v1';

    return {
      status: 'HTTP_200_OK',
      routedVersion: version,
      mTLS: 'SPIFFE_VERIFIED_STRICT',
      latencyMs: 1.25
    };
  }
}

const mesh = new EnterpriseServiceMeshEngine();
const unencrypted = mesh.processRequest({
  clientIp: '100.64.10.4',
  sourceSpiffe: 'none',
  targetService: 'payment-svc',
  path: '/process',
  hasTls: false,
  canaryRolloutPct: 0
});

const encryptedV1 = mesh.processRequest({
  clientIp: '100.64.10.4',
  sourceSpiffe: 'spiffe://cluster.local/ns/store/sa/cart-sa',
  targetService: 'payment-svc',
  path: '/process',
  hasTls: true,
  canaryRolloutPct: 50
});

const encryptedV2 = mesh.processRequest({
  clientIp: '100.64.10.4',
  sourceSpiffe: 'spiffe://cluster.local/ns/store/sa/cart-sa',
  targetService: 'payment-svc',
  path: '/process',
  hasTls: true,
  canaryRolloutPct: 95
});

console.log(\`Unencrypted: \${unencrypted.status} (\${unencrypted.mTLS})\`);
console.log(\`Encrypted v1: \${encryptedV1.status} [Version: \${encryptedV1.routedVersion}] (\${encryptedV1.mTLS})\`);
console.log(\`Encrypted v2: \${encryptedV2.status} [Version: \${encryptedV2.routedVersion}] (\${encryptedV2.mTLS})\`);
console.log('ZERO_TRUST_SERVICE_MESH_GRADE_A_PLUS_CERTIFIED');`;

  console.log('--- Testing Day 34 Part 1 ---');
  console.log(await runTs(p1));
  console.log('--- Testing Day 34 Part 2 ---');
  console.log(await runTs(p2));
  console.log('--- Testing Day 34 Part 3 ---');
  console.log(await runTs(p3));
  console.log('--- Testing Day 34 Part 4 ---');
  console.log(await runTs(p4));
  console.log('--- Testing Day 34 Part 5 ---');
  console.log(await runTs(p5));
}

testAll().catch(console.error);
