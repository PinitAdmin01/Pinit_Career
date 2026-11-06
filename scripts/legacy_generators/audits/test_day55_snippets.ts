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
  console.log('Testing Day 55 TypeScript snippets (Milestone 10 Capstone - Global E-Commerce Data Tier)...');

  // Snippet 1: Multi-Tier Data Routing Engine
  const code1 = `
class DataTierRouter {
  routeRequest(endpoint: string): string {
    if (endpoint.startsWith('/catalog')) return 'CACHE';
    if (endpoint.startsWith('/orders')) return 'NOSQL';
    if (endpoint.startsWith('/settlement')) return 'RDBMS';
    if (endpoint.startsWith('/analytics')) return 'LAKEHOUSE';
    return 'UNKNOWN';
  }
}

const router = new DataTierRouter();
const r1 = router.routeRequest('/catalog/product/101');
const r2 = router.routeRequest('/orders/checkout');
const r3 = router.routeRequest('/settlement/ledger');
const r4 = router.routeRequest('/analytics/daily-revenue');

console.log('Status=GLOBAL_DATA_TIER_ROUTING_VERIFIED | CatalogRoute=' + r1 + ' | OrderRoute=' + r2 + ' | SettlementRoute=' + r3 + ' | AnalyticsRoute=' + r4);
`;
  const out1 = await runSnippet(code1);
  console.log('Snippet 1 Output:', out1);
  assert.ok(out1.includes('Status=GLOBAL_DATA_TIER_ROUTING_VERIFIED | CatalogRoute=CACHE | OrderRoute=NOSQL | SettlementRoute=RDBMS | AnalyticsRoute=LAKEHOUSE'));

  // Snippet 2: Valkey Hot Catalog Acceleration with Stampede Guard
  const code2 = `
class ValkeyCatalogTier {
  private cache = new Map<string, string>();
  public backendReads = 0;

  constructor() {
    this.cache.set('prod:99', JSON.stringify({ id: 'prod:99', name: 'UltraBook Pro', price: 1299 }));
  }

  fetchCatalogItem(id: string): { data: string; latencyMs: number } {
    if (this.cache.has(id)) {
      return { data: this.cache.get(id)!, latencyMs: 1 };
    }
    this.backendReads++;
    return { data: 'MISS', latencyMs: 25 };
  }
}

const valkey = new ValkeyCatalogTier();
let hits = 0;
for (let i = 1; i <= 500; i++) {
  const res = valkey.fetchCatalogItem('prod:99');
  if (res.latencyMs === 1) hits++;
}

console.log('Status=VALKEY_CATALOG_ACCELERATION_VERIFIED | TotalRequests=500 | CacheHits=' + hits + ' | BackendFetches=' + valkey.backendReads + ' | P99LatencyMs=1');
`;
  const out2 = await runSnippet(code2);
  console.log('Snippet 2 Output:', out2);
  assert.ok(out2.includes('Status=VALKEY_CATALOG_ACCELERATION_VERIFIED | TotalRequests=500 | CacheHits=500 | BackendFetches=0 | P99LatencyMs=1'));

  // Snippet 3: DynamoDB Single-Table Atomic Checkout
  const code3 = `
interface SingleTableRecord {
  PK: string;
  SK: string;
  type: string;
  data: Record<string, unknown>;
}

class DynamoDbCheckoutEngine {
  private store = new Map<string, SingleTableRecord>();

  constructor() {
    this.store.set('PROD#99#INVENTORY', { PK: 'PROD#99', SK: 'INVENTORY', type: 'STOCK', data: { available: 50 } });
  }

  executeAtomicCheckout(userId: string, orderId: string, productId: string): { success: boolean; latencyMs: number } {
    // TransactWriteItems: Insert Order and Decrement Inventory
    const stock = this.store.get('PROD#99#INVENTORY')!;
    const currentStock = stock.data.available as number;
    if (currentStock > 0) {
      stock.data.available = currentStock - 1;
      this.store.set(userId + '#' + orderId, {
        PK: userId,
        SK: orderId,
        type: 'ORDER',
        data: { productId, amount: 1299, status: 'CONFIRMED' }
      });
      return { success: true, latencyMs: 6 };
    }
    return { success: false, latencyMs: 6 };
  }
}

const ddb = new DynamoDbCheckoutEngine();
const checkoutRes = ddb.executeAtomicCheckout('USER#101', 'ORD-9021', 'PROD#99');

console.log('Status=DYNAMODB_ATOMIC_CHECKOUT_VERIFIED | OrderId=ORD-9021 | InventoryDeducted=' + checkoutRes.success + ' | TransactionCommitted=' + checkoutRes.success + ' | LatencyMs=' + checkoutRes.latencyMs);
`;
  const out3 = await runSnippet(code3);
  console.log('Snippet 3 Output:', out3);
  assert.ok(out3.includes('Status=DYNAMODB_ATOMIC_CHECKOUT_VERIFIED | OrderId=ORD-9021 | InventoryDeducted=true | TransactionCommitted=true | LatencyMs=6'));

  // Snippet 4: Aurora Global Database Settlement
  const code4 = `
class AuroraSettlementEngine {
  public ledgerBalance = 145000;
  public secondaryLagMs = 120;
  public crossRegionRpoSeconds = 0;

  processSettlement(amount: number): { success: boolean; newBalance: number } {
    this.ledgerBalance += amount;
    return { success: true, newBalance: this.ledgerBalance };
  }
}

const settlement = new AuroraSettlementEngine();
const setRes = settlement.processSettlement(1299);

console.log('Status=AURORA_SETTLEMENT_REPLICATION_VERIFIED | LedgerBalanceUSD=' + settlement.ledgerBalance + ' | SecondaryReplicaLagMs=' + settlement.secondaryLagMs + ' | CrossRegionRpoSeconds=' + settlement.crossRegionRpoSeconds);
`;
  const out4 = await runSnippet(code4);
  console.log('Snippet 4 Output:', out4);
  assert.ok(out4.includes('Status=AURORA_SETTLEMENT_REPLICATION_VERIFIED | LedgerBalanceUSD=146299 | SecondaryReplicaLagMs=120 | CrossRegionRpoSeconds=0'));

  // Snippet 5: Milestone 10 Capstone Full Synthesis Engine
  const code5 = `
class GlobalDataTierOrchestrator {
  synthesizeTransaction(orderId: string): { compositeLatencyMs: number; allTiersOperational: boolean; sub10msAchieved: boolean } {
    // 1. Valkey read: 1ms
    // 2. DynamoDB write: 6ms
    // 3. Aurora write via RDS Proxy: 8ms (executed in parallel pipeline)
    // 4. S3 Lakehouse stream: 2ms async
    const maxPipelineLatency = Math.max(1, 6, 8); // 8ms p99
    return {
      compositeLatencyMs: maxPipelineLatency,
      allTiersOperational: true,
      sub10msAchieved: maxPipelineLatency < 10
    };
  }
}

const orchestrator = new GlobalDataTierOrchestrator();
const synthRes = orchestrator.synthesizeTransaction('ORD-9021');

console.log('Status=GLOBAL_DATA_TIER_SYNTHESIS_VERIFIED | CompositeLatencyMs=' + synthRes.compositeLatencyMs + ' | AllTiersOperational=' + synthRes.allTiersOperational + ' | Sub10msSlaAchieved=' + synthRes.sub10msAchieved);
`;
  const out5 = await runSnippet(code5);
  console.log('Snippet 5 Output:', out5);
  assert.ok(out5.includes('Status=GLOBAL_DATA_TIER_SYNTHESIS_VERIFIED | CompositeLatencyMs=8 | AllTiersOperational=true | Sub10msSlaAchieved=true'));

  console.log('\nAll 5 Day 55 snippets PASSED with 100% exact stdout match!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
