with open('scripts/build_day51_cloud.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to Part 2
p2_target = '''    "To maximize query efficiency, architects ensure that high-cardinality attributes are placed strategically within composite keys.'''
p2_replacement = '''    "A crucial numerical nuance in composite sort key design is Lexicographical Zero-Padding. Because DynamoDB sort keys are strings, sorting occurs strictly according to ASCII character codes. If integer values (such as order sequence numbers or invoice counts) are concatenated as raw numbers, an ASCII sort anomaly occurs where 'ORDER#10' sorts before 'ORDER#2' because the character '1' precedes '2'. To guarantee correct numerical ordering, engineers enforce strict zero-padding (such as 'ORDER#00000002' and 'ORDER#00000010'), ensuring that chronological or sequence range queries behave predictably.",
    "Furthermore, architects understand the operational distinction between KeyConditionExpressions and FilterExpressions. KeyConditionExpressions determine which physical partition and sort key ranges are read from storage, directly dictating Read Capacity Unit consumption. A FilterExpression evaluates attributes after items have already been read into memory, discarding non-matching items before returning results to the client. While a FilterExpression cannot reduce capacity unit consumption, combining a composite sort key prefix with a lightweight client-side filter provides exceptional flexibility for edge-case query criteria.",
    "To maximize query efficiency, architects ensure that high-cardinality attributes are placed strategically within composite keys.'''

# Add to Part 3
p3_target = '''    "Furthermore, architects configure Index Projections thoughtfully.'''
p3_replacement = '''    "Architects must also navigate the asynchronous replication mechanics and backpressure dynamics of Global Secondary Indexes. When an item is written to the primary table, DynamoDB replicates the mutation to associated GSIs asynchronously, typically within ten milliseconds. However, if a GSI is under-provisioned and experiences write throttling, DynamoDB applies backpressure to the primary table, throttling base table writes even if the primary table has ample capacity. To prevent GSI backpressure from knocking down primary writes, platform teams align GSI write throughput with base table provisioning or use On-Demand capacity mode.",
    "Crucially, modern Single-Table Design deprecates Local Secondary Indexes (LSIs) in favor of sparse GSIs. An LSI shares the base table's partition key and must be defined at table creation time; however, adding an LSI imposes an inflexible ten-gigabyte hard limit on the total size of any individual item collection sharing a partition key. If an active tenant's order history exceeds ten gigabytes, all subsequent writes to that partition fail catastrophically. Overloaded GSIs suffer from no item collection size limits, enabling infinite horizontal scalability across petabytes of relational data.",
    "Furthermore, architects configure Index Projections thoughtfully.'''

# Add to Part 4
p4_target = '''    "For complex many-to-many topologies where relationships must be updated or revoked, architects use DynamoDB Transactions ('TransactWriteItems') to maintain referential integrity.'''
p4_replacement = '''    "When modeling complex tree hierarchies (such as organizational charts, file system folders, or product taxonomies), architects frequently combine Adjacency Lists with the Materialized Path Pattern. In a materialized path schema, an item's sort key stores the complete breadcrumb path from the root node to the leaf: such as 'PATH#CORP#TECH#PLATFORM#INFRA'. Using 'begins_with(SK, 'PATH#CORP#TECH')', an application fetches all descendant departments and employees across entire organizational subtrees in a single query.",
    "Additionally, platform engineers evaluate the trade-offs between Fan-Out on Write and Fan-Out on Read in distributed graph architectures. For high-read, low-write topologies, writing duplicate edge items synchronously ensures sub-ten-millisecond read latency. For high-velocity write workflows, applications capture mutations on Amazon DynamoDB Streams, triggering asynchronous AWS Lambda workers to populate secondary graph edges in the background, maintaining near real-time referential parity with zero write latency penalties.",
    "For complex many-to-many topologies where relationships must be updated or revoked, architects use DynamoDB Transactions ('TransactWriteItems') to maintain referential integrity.'''

# Add to Part 5
p5_target = '    "In the verified TypeScript simulation below, we model a complete \'DynamoTransactionSimulator\''
p5_replacement = '''    "An indispensable architectural safeguard in transactional design is Transaction Idempotency. In distributed network environments, transient timeouts can cause a client to retry a TransactWriteItems request even after DynamoDB successfully committed the transaction. Without idempotency protection, a customer might be billed twice for the same order. DynamoDB provides built-in idempotency through the 'ClientRequestToken' parameter. If a client retries a transaction with the same token within ten minutes, DynamoDB recognizes the duplicate, skips re-execution, and returns the original transaction outcome without re-applying mutations.",
    "Architects must also calculate the Capacity Cost of Transactions. Because DynamoDB transactions execute a two-phase protocol (prepare and commit) to guarantee distributed ACID semantics, transactions consume double the standard capacity units: a transactional read consumes two RCUs per four kilobytes, and a transactional write consumes two WCUs per kilobyte. For mission-critical banking, checkout, and inventory operations, this two-fold capacity investment is the gold standard for absolute financial and data integrity.",
    "In the verified TypeScript simulation below, we model a complete 'DynamoTransactionSimulator' '''

assert p2_target in content, "p2_target not found"
assert p3_target in content, "p3_target not found"
assert p4_target in content, "p4_target not found"
assert p5_target in content, "p5_target not found"

content = content.replace(p2_target, p2_replacement)
content = content.replace(p3_target, p3_replacement)
content = content.replace(p4_target, p4_replacement)
content = content.replace(p5_target, p5_replacement)

with open('scripts/build_day51_cloud.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully injected paragraphs into build_day51_cloud.py!")
