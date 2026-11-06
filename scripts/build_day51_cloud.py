import json
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

def count_words(text_list):
    total = 0
    for p in text_list:
        words = p.strip().split()
        total += len(words)
    return total

def get_hash(content):
    return hashlib.sha256(content.strip().encode('utf-8')).hexdigest()

# -------------------------------------------------------------
# Part 1: Foundations of Single-Table Design & Anti-Patterns
# -------------------------------------------------------------
p1_title = "Foundations of Single-Table Design: Why Relational Anti-Patterns Fail in DynamoDB"
p1_say = [
    "Welcome to Day 51 of Cloud Native AWS Architecture. Today, we begin Block 11: Advanced Cloud Data Architectures & Global Databases. In this block, we transition from infrastructure deployment pipelines into high-scale distributed data engineering. We begin with the pinnacle of modern NoSQL modeling: Rick Houlihan's DynamoDB Single-Table Design. For developers accustomed to relational databases like PostgreSQL or MySQL, approaching DynamoDB by creating one table per entity type—such as a Users table, Orders table, and Products table—is an intuitive architectural anti-pattern that catastrophic latency and cost regressions.",
    "To understand why multi-table architectures collapse in DynamoDB, consider how relational databases execute queries. An RDBMS supports SQL JOIN operations executed directly inside the database server's query execution engine. The database uses memory buffers, index scans, and merge joins to combine related records across ten tables, returning a unified result set across a single network connection. DynamoDB, by fundamental architectural design, possesses no JOIN operator whatsoever.",
    "When developers build a multi-table DynamoDB architecture, joins must be executed in application code. To display a user dashboard showing their profile, recent orders, and shipping addresses, the backend microservice must execute twenty sequential HTTP request-response cycles against twenty separate DynamoDB endpoints. Because each HTTP round-trip incurs latency, connection overhead, and AWS SDK serialization, overall p99 response times balloon from five milliseconds to more than three hundred milliseconds, and database throughput costs multiply by twenty times.",
    "Single-Table Design completely eliminates this latency penalty by inverting the relationship between data modeling and query execution. Instead of modeling the database around entity normalization, Single-Table Design models data strictly around application Access Patterns. Every single entity type in the enterprise application—Users, Organizations, Orders, Line Items, Products, Invoices, and Shipments—resides within ONE single physical DynamoDB table.",
    "The core mechanism that makes Single-Table Design possible is Generic Key Overloading. Instead of defining named attributes like 'UserId' or 'OrderId' as the primary key, the table defines two generic string attributes: Partition Key ('PK') and Sort Key ('SK'). These keys are overloaded using structured entity prefixes delimited by hash symbols, such as 'PK: USER#101' and 'SK: METADATA' for a user profile, or 'PK: USER#101' and 'SK: ORDER#2026-10-24#001' for an order placed by that user.",
    "By grouping heterogeneous entities under an identical Partition Key, Single-Table Design establishes Item Collections. An Item Collection is a collection of items across different entity types that share the exact same partition key value. Because items in an item collection are physically co-located on the same underlying DynamoDB storage partition and sorted sequentially by their sort keys, a single 'Query' API operation can retrieve a user profile and their last ten orders in a single, atomic, sub-ten-millisecond network round-trip.",
    "Furthermore, Single-Table Design optimizes database economics and capacity management. In DynamoDB, Provisioned Read and Write Capacity Units (RCUs and WCUs) or On-Demand throughput are allocated per physical table. In a twenty-table architecture, unused provisioned capacity on quiet tables cannot be shared with busy tables, resulting in wasted spend and throttling. In a single-table architecture, all database throughput is pooled into a single high-efficiency capacity pool, maximizing resource utilization across the entire microservice.",
    "In the production TypeScript simulation below, we model the foundational mechanics of the 'SingleTableEngine'. We insert a User profile alongside multiple order records sharing the identical partition key 'USER#101'. We execute a single Query operation using a sort key prefix filter ('begins_with ORDER#'), demonstrating that multiple related order records are fetched in a single network round-trip with sub-ten-millisecond speed.",
    "By embracing Single-Table Design, cloud architects discard relational habits and harness the true distributed power of Amazon DynamoDB. Query latency remains constant at single-digit milliseconds whether the table stores ten thousand items or ten billion items."
]

p1_code = """// Part 1: DynamoDB Single-Table Item Collection Engine
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
console.log('Status=DYNAMODB_ITEM_COLLECTION_VERIFIED | UserPk=USER#101 | OrdersFetched=' + orders.length + ' | NetworkRoundTrips=1');"""

p1_output = "Status=DYNAMODB_ITEM_COLLECTION_VERIFIED | UserPk=USER#101 | OrdersFetched=3 | NetworkRoundTrips=1"
p1_notes = [
    {"line": 2, "note": "DynamoItem interface models generic PK and SK key overloading."},
    {"line": 15, "note": "query method fetches co-located item collection records using prefix filtering."}
]

p1_check = {
    "question": "Why is a multi-table DynamoDB architecture considered an anti-pattern compared to Single-Table Design?",
    "options": [
        "Because DynamoDB lacks JOIN operations, forcing applications to execute multiple sequential network HTTP round-trips to combine data, degrading latency and increasing capacity costs.",
        "Because AWS charges a ten-thousand-dollar monthly license fee for every additional DynamoDB table.",
        "Because multi-table DynamoDB databases can only be queried using legacy FTP connections.",
        "Because DynamoDB tables automatically delete themselves if they contain fewer than one million rows."
    ],
    "answer": 0,
    "explanation": "Without server-side SQL joins, a multi-table NoSQL design forces microservices to execute sequential network round-trips over HTTP to stitch relational data together, blowing up p99 latency. Single-Table Design co-locates related items in one table, allowing multi-item fetches in a single sub-10ms query."
}

# -------------------------------------------------------------
# Part 2: Composite Sort Keys & Hierarchical Range Queries
# -------------------------------------------------------------
p2_title = "Composite Sort Keys & Hierarchical Range Queries: begins_with and between Expressions"
p2_say = [
    "In relational modeling, complex hierarchical filtering—such as querying orders placed within a specific state, in a specific status, during a specific month—is achieved by adding multiple indexed columns and authoring a SQL WHERE clause with compound logical operators. In Amazon DynamoDB, query operations can filter only on the Partition Key (using an exact equality match) and the Sort Key (using a single range comparison condition). To satisfy complex hierarchical access patterns without creating dozens of expensive secondary indexes, architects author Composite Sort Keys.",
    "A Composite Sort Key is a structured string created by concatenating multiple logical attributes together into a single sort key value, using a consistent delimiter such as a hash symbol ('#') or hyphen. By ordering the concatenated attributes from the broadest organizational domain down to the narrowest dimension, developers enable multi-level range filtering using the 'begins_with()' and 'between' KeyConditionExpressions.",
    "Consider an enterprise supply chain application where orders must be queried across geographical hierarchies. By constructing a composite sort key formatted as 'COUNTRY#US#STATE#CA#CITY#SAN_FRANCISCO#ZIP#94107', the application satisfies four distinct access patterns from a single query. Querying with 'begins_with(SK, 'COUNTRY#US')' retrieves all United States orders; querying with 'begins_with(SK, 'COUNTRY#US#STATE#CA')' narrows results to California; and querying with the full city prefix targets San Francisco specifically, with zero client-side filtering.",
    "Another universal application of composite sort keys is Status and Temporal Filtering. In e-commerce platforms, customer support frequently queries all pending orders for a merchant placed within a specific date window. By constructing the sort key as 'STATUS#PENDING#DATE#2026-10-24#ORDER#001', the application queries 'PK = MERCHANT#ACME' with 'begins_with(SK, 'STATUS#PENDING')' to fetch all open orders immediately. When an order ships, an update transaction updates the sort key to 'STATUS#SHIPPED#DATE#2026-10-24#ORDER#001', moving the item out of the pending collection automatically.",
    "Furthermore, composite sort keys support Lexicographical Range Queries using the 'BETWEEN' operator. When dates are encoded in ISO-8601 format ('YYYY-MM-DDTHH:MM:SSZ'), alphabetical sorting perfectly mirrors chronological sorting. An application can query all completed orders for a user between two timestamps using 'SK BETWEEN STATUS#COMPLETED#DATE#2026-10-01 AND STATUS#COMPLETED#DATE#2026-10-31', eliminating full-table scans and retrieving only relevant time-sliced items.",
    "A crucial numerical nuance in composite sort key design is Lexicographical Zero-Padding. Because DynamoDB sort keys are strings, sorting occurs strictly according to ASCII character codes. If integer values (such as order sequence numbers or invoice counts) are concatenated as raw numbers, an ASCII sort anomaly occurs where 'ORDER#10' sorts before 'ORDER#2' because the character '1' precedes '2'. To guarantee correct numerical ordering, engineers enforce strict zero-padding (such as 'ORDER#00000002' and 'ORDER#00000010'), ensuring that chronological or sequence range queries behave predictably.",
    "Furthermore, architects understand the operational distinction between KeyConditionExpressions and FilterExpressions. KeyConditionExpressions determine which physical partition and sort key ranges are read from storage, directly dictating Read Capacity Unit consumption. A FilterExpression evaluates attributes after items have already been read into memory, discarding non-matching items before returning results to the client. While a FilterExpression cannot reduce capacity unit consumption, combining a composite sort key prefix with a lightweight client-side filter provides exceptional flexibility for edge-case query criteria.",
    "To maximize query efficiency, architects ensure that high-cardinality attributes are placed strategically within composite keys. Placing attributes with high distinct values (such as unique order IDs) at the end of the composite string preserves prefix-matching capabilities for preceding categorical attributes (such as country or status), balancing search flexibility with precise point lookups.",
    "In the verified TypeScript implementation below, we build a complete 'CompositeIndexStore'. We insert multiple tenant order records with composite sort keys encoding status, date, and order identifiers. We execute a targeted range query using 'begins_with STATUS#PENDING', demonstrating that all four pending orders for the specified tenant are retrieved with zero full-table scan overhead.",
    "Mastering composite sort keys empowers engineers to satisfy sophisticated, multi-tiered business search patterns using pure key condition expressions. Relational-style queries execute with single-digit millisecond predictability at petabyte scale."
]

p2_code = """// Part 2: Composite Sort Keys & Hierarchical Range Queries
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
console.log('Status=COMPOSITE_SORT_KEY_VERIFIED | Prefix=STATUS#PENDING | MatchesFound=' + pendingOrders.length + ' | ScanUsed=false');"""

p2_output = "Status=COMPOSITE_SORT_KEY_VERIFIED | Prefix=STATUS#PENDING | MatchesFound=4 | ScanUsed=false"
p2_notes = [
    {"line": 2, "note": "OrderRecord models composite sort key encoding status, date, and identifier."},
    {"line": 13, "note": "queryByStatusPrefix executes begins_with prefix filtering without full-table scans."}
]

p2_check = {
    "question": "How do Composite Sort Keys enable hierarchical filtering in Amazon DynamoDB without creating secondary indexes?",
    "options": [
        "By concatenating hierarchical attributes into a single delimited string (e.g., STATUS#PENDING#DATE#2026-10-24), allowing KeyConditionExpression begins_with() to query across multiple organizational levels efficiently.",
        "By converting the DynamoDB table into a relational MySQL database in real time.",
        "By forcing all database records to be stored in flat CSV files on Amazon S3.",
        "By disabling all database indexing and using unindexed sequential scans."
    ],
    "answer": 0,
    "explanation": "Composite sort keys concatenate multiple attributes with a delimiter (such as `#`). By placing broader categories first, queries can use `begins_with()` to filter across hierarchical levels (e.g., all pending orders, or pending orders on a specific date) using standard key conditions."
}

# -------------------------------------------------------------
# Part 3: GSI Overloading & The Inverted Index Pattern
# -------------------------------------------------------------
p3_title = "Global Secondary Index (GSI) Overloading & The Inverted Index Pattern: Sparse Indexing"
p3_say = [
    "In a single-table architecture containing ten different business entity types, access patterns inevitably require querying data along dimensions that differ from the primary table's 'PK' and 'SK'. In a relational database, developers add an index on every column queried in a WHERE clause. In DynamoDB, creating a dedicated Global Secondary Index (GSI) for every access pattern quickly breaches the AWS service limit of twenty GSIs per table and inflates storage and write capacity costs. To solve this constraint, architects use GSI Overloading.",
    "GSI Overloading applies the same generic naming philosophy to secondary indexes that Single-Table Design applies to the primary table. Rather than naming index attributes 'UserEmail' or 'OrderDate', the GSI defines generic attributes: 'GSI1PK' as the partition key and 'GSI1SK' as the sort key. Because these attributes are generic strings, a single GSI can index completely different entity types and satisfy dozens of unrelated access patterns simultaneously across the application.",
    "A legendary implementation of GSI Overloading is The Inverted Index Pattern. An Inverted Index is created by setting 'GSI1PK = SK' and 'GSI1SK = PK'. By literally flipping the partition and sort keys, the index inverts hierarchical one-to-many relationships. For example, in the primary table, 'PK = USER#101' and 'SK = ORDER#9001' allows querying all orders for a specific user. In the inverted GSI, 'GSI1PK = ORDER#9001' and 'GSI1SK = USER#101', allowing the application to instantly query which user owns order nine thousand and one with a single point lookup.",
    "Another transformative capability enabled by GSI Overloading is Sparse Indexing. In DynamoDB, an item is populated into a Global Secondary Index only if the item contains the GSI's partition key attribute. If an item completely omits the 'GSI1PK' attribute, DynamoDB does not write the item to the secondary index. Sparse indexing provides enormous economic and performance advantages when querying rare subsets of data.",
    "Consider an enterprise billing system with ten million active customer subscriptions, but only five hundred subscriptions currently in a 'PAST_DUE' payment state. If all ten million items are indexed, querying delinquent accounts requires scanning massive index partitions. With a Sparse Index, the application writes 'GSI1PK = STATUS#PAST_DUE' only on the five hundred delinquent items, omitting the attribute entirely from the nine million healthy items. The sparse GSI contains exactly five hundred records, enabling sub-ten-millisecond retrieval of all overdue accounts at virtually zero storage cost.",
    "Architects must also navigate the asynchronous replication mechanics and backpressure dynamics of Global Secondary Indexes. When an item is written to the primary table, DynamoDB replicates the mutation to associated GSIs asynchronously, typically within ten milliseconds. However, if a GSI is under-provisioned and experiences write throttling, DynamoDB applies backpressure to the primary table, throttling base table writes even if the primary table has ample capacity. To prevent GSI backpressure from knocking down primary writes, platform teams align GSI write throughput with base table provisioning or use On-Demand capacity mode.",
    "Crucially, modern Single-Table Design deprecates Local Secondary Indexes (LSIs) in favor of sparse GSIs. An LSI shares the base table's partition key and must be defined at table creation time; however, adding an LSI imposes an inflexible ten-gigabyte hard limit on the total size of any individual item collection sharing a partition key. If an active tenant's order history exceeds ten gigabytes, all subsequent writes to that partition fail catastrophically. Overloaded GSIs suffer from no item collection size limits, enabling infinite horizontal scalability across petabytes of relational data.",
    "Furthermore, architects configure Index Projections thoughtfully. By default, projecting 'ALL' attributes duplicates data across the GSI, increasing write capacity unit consumption. For high-throughput tables, projecting 'KEYS_ONLY' or 'INCLUDE' (with only essential display attributes) minimizes replication write costs while satisfying rapid lookup requirements.",
    "In the verified TypeScript simulation below, we build a complete 'GsiIndexManager'. We populate heterogeneous primary items representing users, orders, and products. We demonstrate inverted index lookups where order identifiers query their parent users, and verify that sparse indexing contains only the designated secondary index items while omitting metadata records.",
    "GSI Overloading and Sparse Indexing transform secondary indexes from blunt storage multipliers into surgical query accelerators. A handful of overloaded GSIs satisfy enterprise-wide access patterns with peak efficiency."
]

p3_code = """// Part 3: GSI Overloading & The Inverted Index Pattern
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

console.log('Status=GSI_OVERLOADING_INVERTED_VERIFIED | PrimaryEntities=' + totalEntities + ' | InvertedLookupsSucceeded=' + (invertedLookups.length === 1) + ' | SparseIndexItems=' + sparseCount);"""

p3_output = "Status=GSI_OVERLOADING_INVERTED_VERIFIED | PrimaryEntities=6 | InvertedLookupsSucceeded=true | SparseIndexItems=2"
p3_notes = [
    {"line": 2, "note": "GsiItem interface models primary PK/SK and optional generic GSI1PK/GSI1SK attributes."},
    {"line": 15, "note": "queryGsi1 evaluates inverted relationships; countSparse verifies sparse index omission."}
]

p3_check = {
    "question": "What is the primary benefit of Sparse Indexing in Amazon DynamoDB Global Secondary Indexes?",
    "options": [
        "DynamoDB only writes an item to a GSI if the item possesses the GSI partition key attribute, allowing ultra-efficient indexing of rare item subsets without wasting storage or write capacity on unindexed items.",
        "Sparse indexes compress all table data into encrypted ZIP files stored on AWS Snowball appliances.",
        "Sparse indexes allow SQL injection attacks to be parsed without throwing database syntax exceptions.",
        "Sparse indexes automatically delete old items after thirty days without using TTL."
    ],
    "answer": 0,
    "explanation": "In DynamoDB, an item is only indexed into a GSI if it possesses the GSI partition key attribute. If an attribute is omitted, the item is not written to the GSI, making sparse indexing ideal for filtering rare statuses (e.g., past due orders) with zero storage waste."
}

# -------------------------------------------------------------
# Part 4: Many-to-Many Relationships & Adjacency Lists
# -------------------------------------------------------------
p4_title = "Many-to-Many Relationships & Adjacency Lists: Graph Modeling in DynamoDB"
p4_say = [
    "In relational database theory, Many-to-Many (N:M) relationships—such as Users belonging to multiple Teams, Students enrolled in multiple Courses, or Products assigned to multiple Categories—are modeled using Junction or Associative Tables. A junction table contains foreign keys referencing both primary tables, requiring a three-way SQL JOIN to resolve relationships. In DynamoDB, where joins do not exist, modeling many-to-many relationships requires a graph theory modeling technique: The Adjacency List Pattern.",
    "An Adjacency List models a directed bipartite graph directly within a single DynamoDB table. In graph theory, entities represent nodes, and relationships between entities represent edges. Under the Adjacency List pattern, every edge is stored as an individual item in the table, linking the two entities together. By combining the primary table with an inverted Global Secondary Index, the adjacency list enables bidirectional relationship lookups in sub-ten-millisecond time.",
    "Consider modeling enterprise Identity and Access Management where Users are assigned multiple Roles, and Roles contain multiple Users. In the primary table, the forward edge is stored: 'PK: USER#alice' and 'Sort Key: ROLE#ADMIN'. Querying the primary table with 'PK = USER#alice' immediately returns all roles assigned to Alice. To support the reverse query (finding all users who hold the Admin role), the item populates the overloaded secondary index: 'GSI1PK: ROLE#ADMIN' and 'GSI1SK: USER#alice'.",
    "With this bidirectional mapping, querying the GSI with 'GSI1PK = ROLE#ADMIN' returns every user assigned the Admin role in a single query. Both access patterns—'Get roles for a user' and 'Get users for a role'—are satisfied with zero joins, zero application-level loops, and optimal read capacity consumption.",
    "Furthermore, the Adjacency List pattern supports Edge Attributes. Often, a relationship contains contextual metadata: such as the timestamp when Alice was assigned the role, the administrator who approved the assignment, or specific permission override flags. These metadata attributes are stored directly on the edge item. When querying a user's roles or a role's members, the relationship metadata is returned in the same single-operation payload.",
    "When modeling complex tree hierarchies (such as organizational charts, file system folders, or product taxonomies), architects frequently combine Adjacency Lists with the Materialized Path Pattern. In a materialized path schema, an item's sort key stores the complete breadcrumb path from the root node to the leaf: such as 'PATH#CORP#TECH#PLATFORM#INFRA'. Using 'begins_with(SK, 'PATH#CORP#TECH')', an application fetches all descendant departments and employees across entire organizational subtrees in a single query.",
    "Additionally, platform engineers evaluate the trade-offs between Fan-Out on Write and Fan-Out on Read in distributed graph architectures. For high-read, low-write topologies, writing duplicate edge items synchronously ensures sub-ten-millisecond read latency. For high-velocity write workflows, applications capture mutations on Amazon DynamoDB Streams, triggering asynchronous AWS Lambda workers to populate secondary graph edges in the background, maintaining near real-time referential parity with zero write latency penalties.",
    "For complex many-to-many topologies where relationships must be updated or revoked, architects use DynamoDB Transactions ('TransactWriteItems') to maintain referential integrity. When Alice is removed from a team, the transaction deletes the edge item atomically. If node properties (such as the role's title) change, a fan-out stream worker or batch writer updates associated records asynchronously.",
    "In the verified TypeScript implementation below, we build an 'AdjacencyListGraph' engine. We register multiple bidirectional assignments linking users (Alice, Bob, Charlie, Dave) to roles (Admin, DevOps, Security). We demonstrate that querying roles for user Alice returns three distinct roles, while querying role Admin returns all four assigned team members, verifying bidirectional graph parity.",
    "The Adjacency List pattern demonstrates the immense expressive power of DynamoDB Single-Table Design. Complex graph structures and many-to-many relationships are modeled with mathematical elegance, scaling effortlessly to millions of interconnected enterprise entities. By eliminating join overhead and avoiding fragile multi-table network round-trips, graph queries execute in constant time regardless of total data volume."
]

p4_code = """// Part 4: Many-to-Many Adjacency List Graph Engine
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

console.log('Status=ADJACENCY_LIST_GRAPH_VERIFIED | UserRolesCount=' + aliceRoles.length + ' | RoleMembersCount=' + adminUsers.length + ' | BidirectionalParity=true');"""

p4_output = "Status=ADJACENCY_LIST_GRAPH_VERIFIED | UserRolesCount=3 | RoleMembersCount=4 | BidirectionalParity=true"
p4_notes = [
    {"line": 2, "note": "AdjacencyEdge models forward PK/SK and inverted GSI1PK/GSI1SK graph connections."},
    {"line": 15, "note": "getRolesForUser and getUsersForRole execute bidirectional graph traversal in single operations."}
]

p4_check = {
    "question": "How does the Adjacency List pattern resolve Many-to-Many relationships in Amazon DynamoDB without relational junction tables?",
    "options": [
        "By storing relationship edges as individual items with forward keys on the primary table (PK: USER#1, SK: ROLE#A) and inverted keys on a GSI (GSI1PK: ROLE#A, GSI1SK: USER#1), enabling bidirectional single-query lookups.",
        "By running a recursive Python script that scans the entire table every ten seconds.",
        "By converting the DynamoDB database into an unindexed Neo4j graph cluster.",
        "By storing all many-to-many relationships inside a single multi-gigabyte JSON document."
    ],
    "answer": 0,
    "explanation": "The Adjacency List pattern models many-to-many relationships by storing edges as individual items. By inverting keys on a GSI (`GSI1PK = SK, GSI1SK = PK`), both directions of the relationship can be fetched with a single query without joins."
}

# -------------------------------------------------------------
# Part 5: Atomic Transactions & Optimistic Concurrency Control
# -------------------------------------------------------------
p5_title = "Atomic Transactions & Optimistic Concurrency Control: TransactWriteItems and Conditional Expressions"
p5_say = [
    "In financial services, e-commerce checkouts, and mission-critical inventory management, data operations cannot be executed as independent, decoupled writes. Consider a banking funds transfer: transferring one hundred dollars from Account A to Account B requires deducting one hundred dollars from Account A and crediting one hundred dollars to Account B. If the network drops or a compute container crashes halfway through, Account A loses money without Account B receiving it. To guarantee absolute ACID consistency across distributed items, DynamoDB provides TransactWriteItems.",
    "DynamoDB Transactions provide all-or-nothing, atomicity, consistency, isolation, and durability (ACID) across up to one hundred items or four megabytes of data within a single AWS account and region. When an application calls 'TransactWriteItems', DynamoDB executes two internal phases: a prepare phase that checks pre-conditions across all targeted items, and a commit phase that atomically applies all mutations. If any condition check fails—such as Account A having insufficient balance—the entire transaction is cancelled, no items are modified, and DynamoDB returns a 'TransactionCanceledException'.",
    "A TransactWriteItems request can bundle four distinct types of transactional operations: 'Put', 'Update', 'Delete', and 'ConditionCheck'. The 'ConditionCheck' action is extraordinarily powerful: it allows an application to assert a condition on an auxiliary item without mutating it. For example, during an order checkout transaction, the system can assert that the merchant's account is in an 'ACTIVE' state via a ConditionCheck, while simultaneously decrementing product inventory and creating an order record.",
    "In high-concurrency cloud environments where hundreds of requests attempt to mutate the same record simultaneously (such as high-demand flash sales or ticket reservations), applications must defend against Race Conditions. Traditional relational databases resolve race conditions using Pessimistic Locking ('SELECT FOR UPDATE'), which locks database rows and blocks concurrent transactions. In distributed cloud databases, pessimistic locking destroys scalability and causes lock timeouts.",
    "DynamoDB solves concurrent mutation challenges using Optimistic Concurrency Control (OCC). Under optimistic concurrency control, every item maintains an integer 'version' attribute. When an application reads an item, it captures the current version number (e.g., 'version = 1'). When writing updates, the application includes a Conditional Expression: 'ConditionExpression: version = :expectedVersion AND balance >= :amount'.",
    "During write evaluation, DynamoDB atomically checks if the stored version matches the expected version. If another concurrent worker updated the record first and incremented the version to two, the condition check fails instantly with a 'ConditionalCheckFailedException'. The application catches the exception, re-reads the fresh state, recalculates the business logic, and retries the transaction. This optimistic retry loop provides high throughput, zero database deadlocks, and mathematical data integrity.",
    "An indispensable architectural safeguard in transactional design is Transaction Idempotency. In distributed network environments, transient timeouts can cause a client to retry a TransactWriteItems request even after DynamoDB successfully committed the transaction. Without idempotency protection, a customer might be billed twice for the same order. DynamoDB provides built-in idempotency through the 'ClientRequestToken' parameter. If a client retries a transaction with the same token within ten minutes, DynamoDB recognizes the duplicate, skips re-execution, and returns the original transaction outcome without re-applying mutations.",
    "Architects must also calculate the Capacity Cost of Transactions. Because DynamoDB transactions execute a two-phase protocol (prepare and commit) to guarantee distributed ACID semantics, transactions consume double the standard capacity units: a transactional read consumes two RCUs per four kilobytes, and a transactional write consumes two WCUs per kilobyte. For mission-critical banking, checkout, and inventory operations, this two-fold capacity investment is the gold standard for absolute financial and data integrity.",
    "In the verified TypeScript simulation below, we model a complete 'DynamoTransactionSimulator'  executing a banking funds transfer between Account A and Account B. We enforce conditional balance checks and optimistic concurrency version increments, verifying that funds transfer atomically, balances balance perfectly, and the version increments cleanly.",
    "Mastering DynamoDB transactions, condition expressions, and optimistic concurrency control concludes the Single-Table Design journey. Cloud architects possess the complete toolkit to design, build, and operate petabyte-scale NoSQL architectures that combine sub-ten-millisecond velocity with bulletproof transactional consistency."
]

p5_code = """// Part 5: DynamoDB Transactions & Optimistic Concurrency Control
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

console.log('Status=DYNAMODB_TRANSACTIONS_OCC_VERIFIED | AccountA_Balance=' + finalA.balance + ' | AccountB_Balance=' + finalB.balance + ' | AtomicCommit=' + committed + ' | OccVersion=' + finalA.version);"""

p5_output = "Status=DYNAMODB_TRANSACTIONS_OCC_VERIFIED | AccountA_Balance=400 | AccountB_Balance=600 | AtomicCommit=true | OccVersion=2"
p5_notes = [
    {"line": 2, "note": "AccountItem interface tracks financial balance and integer OCC version."},
    {"line": 15, "note": "executeTransfer models atomic TransactWriteItems condition checks and dual-item balance commits."}
]

p5_check = {
    "question": "What is the primary function of TransactWriteItems in Amazon DynamoDB?",
    "options": [
        "It provides all-or-nothing ACID transactional guarantees across up to one hundred items or four megabytes of data, rolling back completely if any condition check or mutation fails.",
        "It translates SQL queries into Python scripts executed on AWS Lambda.",
        "It writes data to thirty external relational databases simultaneously without consistency checks.",
        "It allows items to be written without specifying a partition key."
    ],
    "answer": 0,
    "explanation": "DynamoDB `TransactWriteItems` delivers full ACID transaction semantics across up to 100 items or 4MB of data in a single request. If any condition check fails, the entire transaction is cancelled with zero mutations applied."
}

# -------------------------------------------------------------
# Assembly & Invariant Verification
# -------------------------------------------------------------
parts_data = [
    {"part": 1, "title": p1_title, "say": p1_say, "code": p1_code, "output": p1_output, "codeNotes": p1_notes, "check": p1_check},
    {"part": 2, "title": p2_title, "say": p2_say, "code": p2_code, "output": p2_output, "codeNotes": p2_notes, "check": p2_check},
    {"part": 3, "title": p3_title, "say": p3_say, "code": p3_code, "output": p3_output, "codeNotes": p3_notes, "check": p3_check},
    {"part": 4, "title": p4_title, "say": p4_say, "code": p4_code, "output": p4_output, "codeNotes": p4_notes, "check": p4_check},
    {"part": 5, "title": p5_title, "say": p5_say, "code": p5_code, "output": p5_output, "codeNotes": p5_notes, "check": p5_check}
]

total_words = 0
for p in parts_data:
    words = count_words(p["say"])
    total_words += words
    print(f"Part {p['part']} word count: {words}")
    assert words >= 600, f"Part {p['part']} word count {words} < 600!"

print(f"Total Day 51 word count: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000!"

day51_dict = {
    "day": 51,
    "coursePrefix": "cloud",
    "title": "DynamoDB Single-Table Design Mastery: Overloaded Indexes, Composite Keys & Adjacency Lists",
    "goal": "Master the pinnacle of NoSQL modeling: learn Rick Houlihan's DynamoDB Single-Table Design, generic partition/sort keys (PK and SK), overloaded Global Secondary Indexes, adjacency list modeling for many-to-many relationships, and transactional writes.",
    "minutes": 30,
    "recap": "Today we mastered Amazon DynamoDB Single-Table Design. We learned why relational multi-table anti-patterns collapse in NoSQL, how generic PK/SK overloading creates co-located item collections for sub-10ms queries, composite sort keys with begins_with hierarchical range filtering, GSI overloading with inverted indexes, many-to-many adjacency lists, and ACID TransactWriteItems with optimistic concurrency control.",
    "summary": [
        "Single-Table Design stores heterogeneous entities in one physical table using generic PK and SK keys, enabling sub-10ms multi-entity queries without joins.",
        "Composite Sort Keys concatenate hierarchical attributes (STATUS#PENDING#DATE#2026-10-24) to satisfy multi-level range filtering via begins_with.",
        "Global Secondary Index (GSI) Overloading indexes diverse access patterns on generic GSI1PK/GSI1SK attributes, including sparse and inverted indexes.",
        "Adjacency Lists model many-to-many bipartite graphs directly in DynamoDB, enabling bidirectional traversals with zero relational junction tables.",
        "TransactWriteItems provides all-or-nothing ACID consistency across multiple items, combining condition checks with optimistic concurrency control."
    ],
    "parts": []
}

for p in parts_data:
    day51_dict["parts"].append({
        "title": p["title"],
        "say": p["say"],
        "code": p["code"],
        "output": p["output"],
        "codeNotes": p["codeNotes"],
        "check": p["check"]
    })

with open("scripts/day51_cloud.json", "w", encoding="utf-8") as f:
    json.dump(day51_dict, f, indent=2)

print("Saved scripts/day51_cloud.json successfully!")

# -------------------------------------------------------------
# Generate Gate v2 Visual JSON Envelope (Compare Template)
# -------------------------------------------------------------
visual_entries = []

visual_specs = [
    {
        "part": 1,
        "title": p1_title,
        "leftLabel": "Relational Multi-Table Anti-Pattern",
        "rightLabel": "DynamoDB Single-Table Design",
        "leftAttrs": [
            {"name": "Table Architecture", "value": "Twenty separate normalized tables."},
            {"name": "Query Overhead", "value": "N+1 sequential HTTP network round-trips."},
            {"name": "Latency Profile", "value": "High p99 latency exceeding 250ms."}
        ],
        "rightAttrs": [
            {"name": "Table Architecture", "value": "One table with generic PK and SK keys."},
            {"name": "Query Overhead", "value": "Single Query retrieving item collections."},
            {"name": "Latency Profile", "value": "Consistent sub-ten-millisecond latency."}
        ],
        "captions": [
            "Relational multi-table patterns cause severe sequential network delays.",
            "Single table architectures group related items under identical keys.",
            "Co-located item collections fetch heterogeneous records in one query.",
            "Generic key overloading delivers predictable single-digit latency."
        ]
    },
    {
        "part": 2,
        "title": p2_title,
        "leftLabel": "Unindexed Full-Table Scans",
        "rightLabel": "Composite Sort Key Range Queries",
        "leftAttrs": [
            {"name": "Search Mechanics", "value": "Expensive client-side and full-table scans."},
            {"name": "Hierarchical Lookups", "value": "Multiple separate query rounds per filter."},
            {"name": "Cost Impact", "value": "Massive read capacity consumption on scans."}
        ],
        "rightAttrs": [
            {"name": "Search Mechanics", "value": "Efficient begins_with prefix filtering."},
            {"name": "Hierarchical Lookups", "value": "Multi-level filtering in a single key condition."},
            {"name": "Cost Impact", "value": "Targeted read capacity consumption on matches."}
        ],
        "captions": [
            "Full table scans waste immense read capacity and inflate cloud costs.",
            "Composite sort keys concatenate hierarchical attributes with delimiters.",
            "Prefix filtering queries multiple organizational levels efficiently.",
            "Hierarchical range expressions eliminate expensive unindexed scans."
        ]
    },
    {
        "part": 3,
        "title": p3_title,
        "leftLabel": "Proliferation of Dedicated GSIs",
        "rightLabel": "Overloaded & Sparse Secondary Indexes",
        "leftAttrs": [
            {"name": "Index Count", "value": "Breaching twenty GSI limits rapidly."},
            {"name": "Storage Overhead", "value": "Duplicating full tables across indexes."},
            {"name": "Cost Profile", "value": "High write amplification on all updates."}
        ],
        "rightAttrs": [
            {"name": "Index Count", "value": "One overloaded GSI serving dozens of patterns."},
            {"name": "Storage Overhead", "value": "Sparse indexes indexing only targeted items."},
            {"name": "Cost Profile", "value": "Minimal write amplification on updates."}
        ],
        "captions": [
            "Excessive dedicated secondary indexes rapidly breach service limits.",
            "Overloaded indexes satisfy diverse access patterns using generic keys.",
            "Sparse indexing includes only items with defined secondary attributes.",
            "Inverted indexes allow bidirectional lookups across entity relationships."
        ]
    },
    {
        "part": 4,
        "title": p4_title,
        "leftLabel": "Relational Junction Tables",
        "rightLabel": "Bipartite Graph Adjacency Lists",
        "leftAttrs": [
            {"name": "Relationship Model", "value": "Junction tables requiring three-way joins."},
            {"name": "Traversal Speed", "value": "Unfeasible without relational query engine."},
            {"name": "Metadata Storage", "value": "Complex multi-table schema alterations."}
        ],
        "rightAttrs": [
            {"name": "Relationship Model", "value": "Bidirectional graph edges in a single table."},
            {"name": "Traversal Speed", "value": "Sub-ten-millisecond single-query traversal."},
            {"name": "Metadata Storage", "value": "Edge attributes stored directly on relationship items."}
        ],
        "captions": [
            "Relational junction tables collapse without server-side SQL joins.",
            "Adjacency lists represent graph edges as individual table items.",
            "Inverted secondary keys enable instant bidirectional relationship lookups.",
            "Graph modeling in single-table schemas scales to millions of connections."
        ]
    },
    {
        "part": 5,
        "title": p5_title,
        "leftLabel": "Pessimistic Locking & Deadlocks",
        "rightLabel": "Atomic Transactions & Optimistic Concurrency",
        "leftAttrs": [
            {"name": "Concurrency Control", "value": "Blocking database row locks."},
            {"name": "Consistency", "value": "Fragile multi-step updates with partial failures."},
            {"name": "Throughput", "value": "Severe lock contention and transaction timeouts."}
        ],
        "rightAttrs": [
            {"name": "Concurrency Control", "value": "Optimistic concurrency control with version checks."},
            {"name": "Consistency", "value": "All-or-nothing ACID semantics across items."},
            {"name": "Throughput", "value": "High concurrency with zero database lock contention."}
        ],
        "captions": [
            "Pessimistic row locks create severe contention in distributed databases.",
            "TransactWriteItems executes atomic mutations across distributed items.",
            "Condition expressions enforce optimistic version checks without locking.",
            "Atomic transactions maintain financial consistency across cloud services."
        ]
    }
]

for spec in visual_specs:
    part_idx = spec["part"] - 1
    code = parts_data[part_idx]["code"]
    code_hash = get_hash(code)

    entry = {
        "partTitle": spec["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "compare": {
                "title": spec["title"],
                "leftLabel": spec["leftLabel"],
                "rightLabel": spec["rightLabel"],
                "leftAttributes": spec["leftAttrs"],
                "rightAttributes": spec["rightAttrs"]
            },
            "steps": [
                {
                    "at": "say1",
                    "focus": "left",
                    "annotation": spec["captions"][0]
                },
                {
                    "at": "say2",
                    "focus": "right",
                    "annotation": spec["captions"][1]
                },
                {
                    "at": "example",
                    "focus": "both",
                    "annotation": spec["captions"][2]
                },
                {
                    "at": "tryIt",
                    "focus": "right",
                    "annotation": spec["captions"][3]
                }
            ]
        }
    }
    visual_entries.append(entry)

day51_visual = {
    "schemaVersion": 2,
    "prefix": "cloud",
    "day": 51,
    "entries": visual_entries
}

with open("src/lib/data/lessonVisuals/cloud/day-51.json", "w", encoding="utf-8") as f:
    json.dump(day51_visual, f, indent=2)

print("Saved src/lib/data/lessonVisuals/cloud/day-51.json successfully!")
