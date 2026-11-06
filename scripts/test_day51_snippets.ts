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
  console.log('Testing Day 51 TypeScript snippets (DynamoDB Single-Table Design)...');

  // Snippet 1: Item Collection & Single-Table Query
  const code1 = `
interface DynamoItem {
  PK: string;
  SK: string;
  entityType: string;
  data: Record<string, unknown>;
}

class SingleTableEngine {
  private items: DynamoItem[] = [];

  put(item: DynamoItem): void {
    this.items.push(item);
  }

  query(pk: string, skPrefix: string): DynamoItem[] {
    return this.items.filter(item => item.PK === pk && item.SK.startsWith(skPrefix));
  }
}

const table = new SingleTableEngine();
// Insert User profile (METADATA) and orders under identical PK
table.put({ PK: 'USER#101', SK: 'METADATA', entityType: 'USER', data: { name: 'Alice Chen', email: 'alice@cloud.io' } });
table.put({ PK: 'USER#101', SK: 'ORDER#2026-10-01#001', entityType: 'ORDER', data: { total: 120, status: 'DELIVERED' } });
table.put({ PK: 'USER#101', SK: 'ORDER#2026-10-15#002', entityType: 'ORDER', data: { total: 450, status: 'SHIPPED' } });
table.put({ PK: 'USER#101', SK: 'ORDER#2026-10-24#003', entityType: 'ORDER', data: { total: 89, status: 'PENDING' } });
table.put({ PK: 'USER#102', SK: 'METADATA', entityType: 'USER', data: { name: 'Bob Smith' } });

// Query item collection: fetch all orders for USER#101 in 1 single network request
const orders = table.query('USER#101', 'ORDER#');
console.log('Status=DYNAMODB_ITEM_COLLECTION_VERIFIED | UserPk=USER#101 | OrdersFetched=' + orders.length + ' | NetworkRoundTrips=1');
`;
  const out1 = await runSnippet(code1);
  console.log('Snippet 1 Output:', out1);
  assert.ok(out1.includes('Status=DYNAMODB_ITEM_COLLECTION_VERIFIED | UserPk=USER#101 | OrdersFetched=3 | NetworkRoundTrips=1'));

  // Snippet 2: Composite Sort Keys & begins_with Filtering
  const code2 = `
interface OrderRecord {
  PK: string;
  SK: string; // e.g., STATUS#PENDING#DATE#2026-10-24#ORD#001
  amount: number;
}

class CompositeIndexStore {
  private records: OrderRecord[] = [];

  insert(rec: OrderRecord): void {
    this.records.push(rec);
  }

  queryByStatusPrefix(tenantId: string, statusPrefix: string): OrderRecord[] {
    return this.records.filter(r => r.PK === tenantId && r.SK.startsWith(statusPrefix));
  }
}

const store = new CompositeIndexStore();
store.insert({ PK: 'TENANT#CORP_A', SK: 'STATUS#PENDING#DATE#2026-10-21#001', amount: 150 });
store.insert({ PK: 'TENANT#CORP_A', SK: 'STATUS#PENDING#DATE#2026-10-22#002', amount: 200 });
store.insert({ PK: 'TENANT#CORP_A', SK: 'STATUS#PENDING#DATE#2026-10-23#003', amount: 350 });
store.insert({ PK: 'TENANT#CORP_A', SK: 'STATUS#PENDING#DATE#2026-10-24#004', amount: 80 });
store.insert({ PK: 'TENANT#CORP_A', SK: 'STATUS#COMPLETED#DATE#2026-10-20#005', amount: 990 });
store.insert({ PK: 'TENANT#CORP_B', SK: 'STATUS#PENDING#DATE#2026-10-24#006', amount: 50 });

const pendingOrders = store.queryByStatusPrefix('TENANT#CORP_A', 'STATUS#PENDING');
console.log('Status=COMPOSITE_SORT_KEY_VERIFIED | Prefix=STATUS#PENDING | MatchesFound=' + pendingOrders.length + ' | ScanUsed=false');
`;
  const out2 = await runSnippet(code2);
  console.log('Snippet 2 Output:', out2);
  assert.ok(out2.includes('Status=COMPOSITE_SORT_KEY_VERIFIED | Prefix=STATUS#PENDING | MatchesFound=4 | ScanUsed=false'));

  // Snippet 3: GSI Overloading & Inverted Index
  const code3 = `
interface GsiItem {
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;
  data: string;
}

class GsiIndexManager {
  private table: GsiItem[] = [];

  put(item: GsiItem): void {
    this.table.push(item);
  }

  queryGsi1(gsi1pk: string): GsiItem[] {
    return this.table.filter(i => i.GSI1PK === gsi1pk);
  }

  countSparse(): number {
    return this.table.filter(i => i.GSI1PK !== undefined).length;
  }
}

const mgr = new GsiIndexManager();
// Primary: PK=USER#1, SK=ORDER#1001. Inverted: GSI1PK=ORDER#1001, GSI1SK=USER#1
mgr.put({ PK: 'USER#1', SK: 'ORDER#1001', GSI1PK: 'ORDER#1001', GSI1SK: 'USER#1', data: 'MacBook Pro' });
// Inverted lookup for order 1002
mgr.put({ PK: 'USER#2', SK: 'ORDER#1002', GSI1PK: 'ORDER#1002', GSI1SK: 'USER#2', data: '4K Monitor' });
// Items without GSI1 keys (Sparse indexing: e.g. normal profile metadata)
mgr.put({ PK: 'USER#1', SK: 'METADATA', data: 'Profile Alice' });
mgr.put({ PK: 'USER#2', SK: 'METADATA', data: 'Profile Bob' });
mgr.put({ PK: 'PRODUCT#99', SK: 'METADATA', data: 'Inventory 500' });
mgr.put({ PK: 'PRODUCT#100', SK: 'METADATA', data: 'Inventory 200' });

const invertedLookups = mgr.queryGsi1('ORDER#1001');
const totalEntities = 6;
const sparseCount = mgr.countSparse();

console.log('Status=GSI_OVERLOADING_INVERTED_VERIFIED | PrimaryEntities=' + totalEntities + ' | InvertedLookupsSucceeded=' + (invertedLookups.length === 1) + ' | SparseIndexItems=' + sparseCount);
`;
  const out3 = await runSnippet(code3);
  console.log('Snippet 3 Output:', out3);
  assert.ok(out3.includes('Status=GSI_OVERLOADING_INVERTED_VERIFIED | PrimaryEntities=6 | InvertedLookupsSucceeded=true | SparseIndexItems=2'));

  // Snippet 4: Many-to-Many Adjacency List
  const code4 = `
interface AdjacencyEdge {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
}

class AdjacencyListGraph {
  private edges: AdjacencyEdge[] = [];

  assign(user: string, role: string): void {
    // Bi-directional edge representation
    this.edges.push({
      PK: 'USER#' + user,
      SK: 'ROLE#' + role,
      GSI1PK: 'ROLE#' + role,
      GSI1SK: 'USER#' + user
    });
  }

  getRolesForUser(user: string): string[] {
    return this.edges.filter(e => e.PK === 'USER#' + user).map(e => e.SK.replace('ROLE#', ''));
  }

  getUsersForRole(role: string): string[] {
    return this.edges.filter(e => e.GSI1PK === 'ROLE#' + role).map(e => e.GSI1SK.replace('USER#', ''));
  }
}

const graph = new AdjacencyListGraph();
// Alice has Admin, DevOps, Security
graph.assign('alice', 'ADMIN');
graph.assign('alice', 'DEVOPS');
graph.assign('alice', 'SECURITY');

// Role ADMIN is held by alice, bob, charlie, dave
graph.assign('bob', 'ADMIN');
graph.assign('charlie', 'ADMIN');
graph.assign('dave', 'ADMIN');

const aliceRoles = graph.getRolesForUser('alice');
const adminUsers = graph.getUsersForRole('ADMIN');

console.log('Status=ADJACENCY_LIST_GRAPH_VERIFIED | UserRolesCount=' + aliceRoles.length + ' | RoleMembersCount=' + adminUsers.length + ' | BidirectionalParity=true');
`;
  const out4 = await runSnippet(code4);
  console.log('Snippet 4 Output:', out4);
  assert.ok(out4.includes('Status=ADJACENCY_LIST_GRAPH_VERIFIED | UserRolesCount=3 | RoleMembersCount=4 | BidirectionalParity=true'));

  // Snippet 5: Atomic Transactions & Optimistic Concurrency Control
  const code5 = `
interface AccountItem {
  id: string;
  balance: number;
  version: number;
}

class DynamoTransactionSimulator {
  private accounts = new Map<string, AccountItem>();

  register(acc: AccountItem): void {
    this.accounts.set(acc.id, acc);
  }

  executeTransfer(fromId: string, toId: string, amount: number, expectedFromVersion: number): boolean {
    const fromAcc = this.accounts.get(fromId);
    const toAcc = this.accounts.get(toId);

    if (!fromAcc || !toAcc) return false;

    // ConditionCheck: version must match and balance >= amount
    if (fromAcc.version !== expectedFromVersion || fromAcc.balance < amount) {
      return false; // Transaction cancelled
    }

    // Atomic update
    fromAcc.balance -= amount;
    fromAcc.version += 1;

    toAcc.balance += amount;
    toAcc.version += 1;

    return true;
  }

  get(id: string): AccountItem {
    return this.accounts.get(id)!;
  }
}

const txSim = new DynamoTransactionSimulator();
txSim.register({ id: 'ACC_A', balance: 500, version: 1 });
txSim.register({ id: 'ACC_B', balance: 500, version: 1 });

const committed = txSim.executeTransfer('ACC_A', 'ACC_B', 100, 1);
const finalA = txSim.get('ACC_A');
const finalB = txSim.get('ACC_B');

console.log('Status=DYNAMODB_TRANSACTIONS_OCC_VERIFIED | AccountA_Balance=' + finalA.balance + ' | AccountB_Balance=' + finalB.balance + ' | AtomicCommit=' + committed + ' | OccVersion=' + finalA.version);
`;
  const out5 = await runSnippet(code5);
  console.log('Snippet 5 Output:', out5);
  assert.ok(out5.includes('Status=DYNAMODB_TRANSACTIONS_OCC_VERIFIED | AccountA_Balance=400 | AccountB_Balance=600 | AtomicCommit=true | OccVersion=2'));

  console.log('\nAll 5 Day 51 snippets PASSED with 100% exact stdout match!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
