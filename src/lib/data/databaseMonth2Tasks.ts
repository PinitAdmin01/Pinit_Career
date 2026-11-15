import { buildEnrichedDayQuests, type DayConfig } from './curriculumEnricher';
import type { CourseQuest } from './coursesData';
import { MONTH2_LESSON_INDEX } from './month2LessonIndex';

interface RawSqlM2DayTask {
  day: number;
  fallbackTitle: string;
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

const RAW_SQL_M2_DAY_TASKS: RawSqlM2DayTask[] = [
  {
    "day": 31,
    "fallbackTitle": "Advanced Query Optimization, Cost-Based Optimizer Mechanics & EXPLAIN ANALYZE Execution Plans",
    "eTitle": "Covering Index (INCLUDE) for Index-Only / Index Scan",
    "eDesc": "Table `orders (id int, customer_id int, created_at int, total_cents int)` contains 3,000 rows.\nCreate a composite covering index `idx_orders_cov` on `orders (customer_id, created_at DESC) INCLUDE (total_cents)` and run `ANALYZE orders;` so selective customer lookups avoid heap fetches.",
    "eStarter": "-- TODO: create covering index idx_orders_cov on orders and ANALYZE orders\nANALYZE orders;",
    "eHint": "CREATE INDEX idx_orders_cov ON orders (customer_id, created_at DESC) INCLUDE (total_cents);\nANALYZE orders;",
    "eTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE orders (id int PRIMARY KEY, customer_id int, created_at int, total_cents int);\nINSERT INTO orders SELECT g, (g % 250) + 1, 10000 - g, (g % 99) * 100 FROM generate_series(1, 3000) g;\nANALYZE orders;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE tablename='orders' AND indexname='idx_orders_cov') AS ok, 'idx_orders_cov exists' AS msg;\nSELECT (SELECT indexdef FROM pg_indexes WHERE indexname='idx_orders_cov') ILIKE '%INCLUDE%' AS ok, 'index uses INCLUDE covering clause' AS msg;\nSELECT explain_json('SELECT customer_id, created_at, total_cents FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 5') ~ '(Index Only Scan|Index Scan)' AS ok, 'planner uses Index or Index Only Scan' AS msg;",
    "aTitle": "Decorrelate SubPlan into Single-Pass Window Aggregation",
    "aDesc": "Table `tx (id int, acct_id int, amount numeric)` has skewed transactions.\nWrite a single `SELECT id, acct_id, amount` query (using CTE + window `AVG(amount) OVER (PARTITION BY acct_id)`) returning rows where `amount > account_avg`, ordered by `id`.",
    "aStarter": "SELECT id, acct_id, amount\nFROM tx t1\n-- TODO: decorrelate without correlated SubPlan\nORDER BY id;",
    "aHint": "WITH stats AS (\n  SELECT id, acct_id, amount, AVG(amount) OVER (PARTITION BY acct_id) AS avg_amt\n  FROM tx\n)\nSELECT id, acct_id, amount FROM stats WHERE amount > avg_amt ORDER BY id;",
    "aTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE tx (id int PRIMARY KEY, acct_id int, amount numeric(10,2));\nINSERT INTO tx VALUES (1, 10, 100), (2, 10, 300), (3, 10, 200), (4, 20, 50), (5, 20, 90);\n-- CHECKS --\nSELECT (SELECT array_agg(id ORDER BY id) FROM answer) = ARRAY[2, 5] AS ok, 'returns above-average tx ids [2, 5]' AS msg;\nSELECT EXISTS(SELECT 1 FROM answer WHERE acct_id = 10 AND amount = 300) AS ok, 'includes acct 10 amount 300' AS msg;\nSELECT (SELECT count(*) FROM answer) = 2 AS ok, 'exact 2 qualifying rows' AS msg;"
  },
  {
    "day": 32,
    "fallbackTitle": "B-Tree vs LSM-Tree Internal Index Architectures, Write Amplification & Page Layouts",
    "eTitle": "Expression B-Tree Index for Case-Insensitive Lookup",
    "eDesc": "Table `users (id int, email text)` has 2,000 rows.\nCreate an expression B-Tree index `idx_users_lower_email` on `users (lower(email))` and run `ANALYZE users;`.",
    "eStarter": "-- TODO: create functional index idx_users_lower_email on lower(email)\nANALYZE users;",
    "eHint": "CREATE INDEX idx_users_lower_email ON users (lower(email));\nANALYZE users;",
    "eTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE users (id int PRIMARY KEY, email text NOT NULL);\nINSERT INTO users SELECT g, 'User' || g || '@Corp.IO' FROM generate_series(1, 2000) g;\nANALYZE users;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE tablename='users' AND indexname='idx_users_lower_email') AS ok, 'idx_users_lower_email exists' AS msg;\nSELECT (SELECT indexdef FROM pg_indexes WHERE indexname='idx_users_lower_email') ILIKE '%lower(email)%' AS ok, 'indexes lower(email)' AS msg;\nSELECT explain_json($$SELECT id FROM users WHERE lower(email) = 'user42@corp.io'$$) ~ '(Index Scan|Bitmap Index Scan)' AS ok, 'planner uses index on lower(email)' AS msg;",
    "aTitle": "Fillfactor-Tuned Partial B-Tree Index to Reduce Page Splits",
    "aDesc": "Table `jobs (id int, status text, created_at int)` holds mostly `DONE` history rows and hot `PENDING` queue rows.\nCreate a partial index `idx_jobs_pending` on `jobs (created_at) WHERE status = 'PENDING'` with storage parameter `fillfactor = 70`, and run `ANALYZE jobs;`.",
    "aStarter": "-- TODO: partial index idx_jobs_pending with fillfactor = 70\nANALYZE jobs;",
    "aHint": "CREATE INDEX idx_jobs_pending ON jobs (created_at) WITH (fillfactor = 70) WHERE status = 'PENDING';\nANALYZE jobs;",
    "aTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE jobs (id int PRIMARY KEY, status text, created_at int);\nINSERT INTO jobs SELECT g, CASE WHEN g % 50 = 0 THEN 'PENDING' ELSE 'DONE' END, g FROM generate_series(1, 2500) g;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE tablename='jobs' AND indexname='idx_jobs_pending') AS ok, 'idx_jobs_pending exists' AS msg;\nSELECT (SELECT indexdef FROM pg_indexes WHERE indexname='idx_jobs_pending') ILIKE '%WHERE%PENDING%' AS ok, 'partial predicate matches PENDING' AS msg;\nSELECT 'fillfactor=70' = ANY(COALESCE((SELECT reloptions FROM pg_class WHERE relname='idx_jobs_pending'), ARRAY[]::text[])) AS ok, 'fillfactor=70 configured' AS msg;"
  },
  {
    "day": 33,
    "fallbackTitle": "Advanced Window Functions, Frame Specifications & Moving Aggregations",
    "eTitle": "3-Point Centered Moving Average via ROWS Frame",
    "eDesc": "Table `metrics (acct_id int, day_seq int, val numeric)` stores sequential daily metrics.\nReturn `acct_id, day_seq, val, ROUND(moving_avg, 2) AS ma3` using `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` per account, ordered by `acct_id, day_seq`.",
    "eStarter": "SELECT acct_id, day_seq, val, val AS ma3 FROM metrics ORDER BY acct_id, day_seq;",
    "eHint": "SELECT acct_id, day_seq, val,\n  ROUND(AVG(val) OVER (PARTITION BY acct_id ORDER BY day_seq ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 2) AS ma3\nFROM metrics\nORDER BY acct_id, day_seq;",
    "eTest": "CREATE TABLE metrics (acct_id int, day_seq int, val numeric); INSERT INTO metrics VALUES (1,1,10),(1,2,20),(1,3,30),(1,4,40),(2,1,100),(2,2,200);\n-- CHECKS --\nSELECT (SELECT count(*) FROM answer) = 6 AS ok, '6 rows returned' AS msg;\nSELECT (SELECT ma3 FROM answer WHERE acct_id=1 AND day_seq=2) = 20.00 AS ok, 'acct 1 day 2 MA3 = 20.00' AS msg;\nSELECT (SELECT ma3 FROM answer WHERE acct_id=1 AND day_seq=4) = 35.00 AS ok, 'acct 1 day 4 boundary MA3 = 35.00' AS msg;\nSELECT (SELECT ma3 FROM answer WHERE acct_id=2 AND day_seq=1) = 150.00 AS ok, 'acct 2 partition isolated MA3 = 150.00' AS msg;",
    "aTitle": "Time-Based RANGE Frame vs Peer GROUPS Frame",
    "aDesc": "Table `ticks (ts_day int, amount int)` has duplicate and gapped day numbers.\nReturn `ts_day, amount, range_sum, grp_sum` ordered by `ts_day, amount` where `range_sum` sums `RANGE BETWEEN 2 PRECEDING AND CURRENT ROW` and `grp_sum` sums `GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW` (both ordered by `ts_day`).",
    "aStarter": "SELECT ts_day, amount, 0 AS range_sum, 0 AS grp_sum FROM ticks ORDER BY ts_day, amount;",
    "aHint": "SELECT ts_day, amount,\n  SUM(amount) OVER (ORDER BY ts_day RANGE BETWEEN 2 PRECEDING AND CURRENT ROW) AS range_sum,\n  SUM(amount) OVER (ORDER BY ts_day GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW) AS grp_sum\nFROM ticks\nORDER BY ts_day, amount;",
    "aTest": "CREATE TABLE ticks (ts_day int, amount int); INSERT INTO ticks VALUES (1, 10), (1, 20), (3, 5), (7, 40);\n-- CHECKS --\nSELECT (SELECT count(*) FROM answer) = 4 AS ok, '4 rows' AS msg;\nSELECT (SELECT bool_and(range_sum = 35) FROM answer WHERE ts_day = 3) AS ok, 'day 3 RANGE(2 preceding) includes day 1 + day 3 = 35' AS msg;\nSELECT (SELECT range_sum FROM answer WHERE ts_day = 7) = 40 AS ok, 'day 7 RANGE excludes day 3 (>2 gap) = 40' AS msg;\nSELECT (SELECT grp_sum FROM answer WHERE ts_day = 7) = 45 AS ok, 'day 7 GROUPS(1 preceding) includes peer group day 3 = 45' AS msg;"
  },
  {
    "day": 34,
    "fallbackTitle": "Table Partitioning & Sharding Architectures for Terabyte-Scale Warehouses",
    "eTitle": "Declarative 4-Bucket HASH Sharded Partition Table",
    "eDesc": "Create partitioned table `events_sharded (tenant_id int NOT NULL, event_id int NOT NULL, payload text) PARTITION BY HASH (tenant_id);` with 4 modulus-4 partitions named `shard_0`, `shard_1`, `shard_2`, `shard_3`, then insert rows for `tenant_id` 1..8.",
    "eStarter": "CREATE TABLE events_sharded (tenant_id int NOT NULL, event_id int NOT NULL, payload text); -- TODO: PARTITION BY HASH + 4 shards + inserts",
    "eHint": "CREATE TABLE events_sharded (tenant_id int NOT NULL, event_id int NOT NULL, payload text) PARTITION BY HASH (tenant_id);\nCREATE TABLE shard_0 PARTITION OF events_sharded FOR VALUES WITH (MODULUS 4, REMAINDER 0);\nCREATE TABLE shard_1 PARTITION OF events_sharded FOR VALUES WITH (MODULUS 4, REMAINDER 1);\nCREATE TABLE shard_2 PARTITION OF events_sharded FOR VALUES WITH (MODULUS 4, REMAINDER 2);\nCREATE TABLE shard_3 PARTITION OF events_sharded FOR VALUES WITH (MODULUS 4, REMAINDER 3);\nINSERT INTO events_sharded SELECT g, g * 10, 'ok' FROM generate_series(1, 8) g;",
    "eTest": "SELECT 1;\n-- CHECKS --\nSELECT (SELECT partstrat FROM pg_partitioned_table WHERE partrelid = 'events_sharded'::regclass) = 'h' AS ok, 'partitioned by HASH' AS msg;\nSELECT (SELECT count(*) FROM pg_inherits WHERE inhparent = 'events_sharded'::regclass) = 4 AS ok, 'has 4 child shard partitions' AS msg;\nSELECT (SELECT count(*) FROM events_sharded) = 8 AS ok, 'all 8 rows inserted and routed' AS msg;",
    "aTitle": "Cross-Shard Revenue Skew & Total Share Audit",
    "aDesc": "Two regional shard tables exist: `shard_us (id int, rev int)` and `shard_eu (id int, rev int)`.\nCombine them with literal shard labels (`'us'`, `'eu'`) and return `shard, rows_cnt, total_rev, ROUND(total_rev * 100.0 / SUM(total_rev) OVER (), 2) AS rev_pct` ordered by `shard`.",
    "aStarter": "SELECT 'us' AS shard, 0 AS rows_cnt, 0 AS total_rev, 0.00 AS rev_pct;",
    "aHint": "WITH combined AS (\n  SELECT 'us' AS shard, rev FROM shard_us\n  UNION ALL\n  SELECT 'eu' AS shard, rev FROM shard_eu\n), agg AS (\n  SELECT shard, count(*)::int AS rows_cnt, SUM(rev)::int AS total_rev FROM combined GROUP BY shard\n)\nSELECT shard, rows_cnt, total_rev, ROUND(total_rev * 100.0 / SUM(total_rev) OVER (), 2) AS rev_pct FROM agg ORDER BY shard;",
    "aTest": "CREATE TABLE shard_us (id int, rev int); CREATE TABLE shard_eu (id int, rev int); INSERT INTO shard_us VALUES (1, 300), (2, 450); INSERT INTO shard_eu VALUES (3, 250);\n-- CHECKS --\nSELECT (SELECT count(*) FROM answer) = 2 AS ok, '2 shard summaries' AS msg;\nSELECT (SELECT total_rev FROM answer WHERE shard='us') = 750 AS ok, 'us total_rev = 750' AS msg;\nSELECT (SELECT rev_pct FROM answer WHERE shard='us') = 75.00 AND (SELECT rev_pct FROM answer WHERE shard='eu') = 25.00 AS ok, 'us 75% / eu 25%' AS msg;"
  },
  {
    "day": 35,
    "fallbackTitle": "Milestone 7 Capstone: The Multi-Million Transaction Query Degradation & Outage Post-Mortem",
    "eTitle": "Milestone 7A: SARGable Range Rewrite + Composite Index Fix",
    "eDesc": "Table `ledger_tx (id int, merchant_id int, txn_date date, amount int)` had non-SARGable `EXTRACT(YEAR FROM txn_date)` scans.\nCreate composite index `idx_ledger_merch_dt ON ledger_tx (merchant_id, txn_date)` and write a SARGable `CREATE VIEW march_summary AS SELECT merchant_id, count(*)::int AS cnt, SUM(amount)::int AS vol FROM ledger_tx WHERE txn_date >= DATE '2026-03-01' AND txn_date < DATE '2026-04-01' GROUP BY merchant_id`.",
    "eStarter": "-- TODO: create index idx_ledger_merch_dt and view march_summary",
    "eHint": "CREATE INDEX idx_ledger_merch_dt ON ledger_tx (merchant_id, txn_date);\nANALYZE ledger_tx;\nCREATE VIEW march_summary AS\nSELECT merchant_id, count(*)::int AS cnt, SUM(amount)::int AS vol\nFROM ledger_tx\nWHERE txn_date >= DATE '2026-03-01' AND txn_date < DATE '2026-04-01'\nGROUP BY merchant_id;",
    "eTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE ledger_tx (id int PRIMARY KEY, merchant_id int, txn_date date, amount int);\nINSERT INTO ledger_tx SELECT g, (g % 50) + 1, DATE '2026-02-25' + (g % 40), (g % 10) * 100 FROM generate_series(1, 2000) g;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='idx_ledger_merch_dt') AS ok, 'composite index exists' AS msg;\nSELECT explain_json($$SELECT amount FROM ledger_tx WHERE merchant_id = 5 AND txn_date >= DATE '2026-03-01' AND txn_date < DATE '2026-04-01'$$) ~ '(Index Scan|Bitmap)' AS ok, 'SARGable range uses index' AS msg;\nSELECT (SELECT SUM(cnt) FROM march_summary) = (SELECT count(*) FROM ledger_tx WHERE txn_date >= DATE '2026-03-01' AND txn_date < DATE '2026-04-01') AS ok, 'march_summary exact counts' AS msg;",
    "aTitle": "Milestone 7B: JSONB Path-Ops GIN Index & Containment Query",
    "aDesc": "Table `event_log (id int, payload jsonb)` stores nested metadata.\nCreate a GIN index `idx_event_payload_gin ON event_log USING gin (payload jsonb_path_ops)`, then write a `CREATE VIEW high_risk_events AS` filtering `payload @> '{\"risk\":\"HIGH\",\"region\":\"ap-south\"}'::jsonb` ordered by `id`.",
    "aStarter": "-- TODO: GIN jsonb_path_ops index + view high_risk_events",
    "aHint": "CREATE INDEX idx_event_payload_gin ON event_log USING gin (payload jsonb_path_ops);\nCREATE VIEW high_risk_events AS\nSELECT id, payload\nFROM event_log\nWHERE payload @> '{\"risk\":\"HIGH\",\"region\":\"ap-south\"}'::jsonb\nORDER BY id;",
    "aTest": "CREATE TABLE event_log (id int PRIMARY KEY, payload jsonb NOT NULL);\nINSERT INTO event_log VALUES (1,'{\"risk\":\"HIGH\",\"region\":\"ap-south\",\"code\":500}'),(2,'{\"risk\":\"LOW\",\"region\":\"ap-south\"}'),(3,'{\"risk\":\"HIGH\",\"region\":\"ap-south\",\"code\":429}'),(4,'{\"risk\":\"HIGH\",\"region\":\"us-east\"}');\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='idx_event_payload_gin' AND indexdef ILIKE '%USING gin%' AND indexdef ILIKE '%jsonb_path_ops%') AS ok, 'GIN jsonb_path_ops index exists' AS msg;\nSELECT (SELECT array_agg(id ORDER BY id) FROM high_risk_events) = ARRAY[1, 3] AS ok, 'containment matched rows 1 and 3' AS msg;\nSELECT (SELECT count(*) FROM high_risk_events) = 2 AS ok, 'exact 2 matches' AS msg;"
  },
  {
    "day": 36,
    "fallbackTitle": "Advanced Concurrency: MVCC Isolation Levels, Read Committed vs Repeatable Read & Serialization Failures",
    "eTitle": "MVCC Snapshot Visibility Reader",
    "eDesc": "Table `mvcc_tuples (row_id int, xmin_tx int, xmax_tx int, committed_up_to_tx int, val text)` models tuple headers.\nGiven an in-flight snapshot at `snapshot_tx = 100` (and committed tx ids in `tx_log(tx_id, state)`), select currently visible `row_id, val` where `xmin_tx <= 100` is `COMMITTED` and (`xmax_tx IS NULL` OR `xmax_tx > 100` OR xmax is `ABORTED`), ordered by `row_id`.",
    "eStarter": "SELECT row_id, val FROM mvcc_tuples ORDER BY row_id;",
    "eHint": "SELECT m.row_id, m.val\nFROM mvcc_tuples m\nJOIN tx_log tmin ON tmin.tx_id = m.xmin_tx\nLEFT JOIN tx_log tmax ON tmax.tx_id = m.xmax_tx\nWHERE m.xmin_tx <= 100 AND tmin.state = 'COMMITTED'\n  AND (m.xmax_tx IS NULL OR m.xmax_tx > 100 OR tmax.state <> 'COMMITTED')\nORDER BY m.row_id;",
    "eTest": "CREATE TABLE tx_log (tx_id int PRIMARY KEY, state text);\nINSERT INTO tx_log VALUES (90,'COMMITTED'),(95,'ABORTED'),(98,'COMMITTED'),(102,'COMMITTED'),(105,'IN_PROGRESS');\nCREATE TABLE mvcc_tuples (row_id int PRIMARY KEY, xmin_tx int, xmax_tx int, val text);\nINSERT INTO mvcc_tuples VALUES (1,90,NULL,'live'),(2,95,NULL,'aborted_ins'),(3,90,98,'deleted_before'),(4,90,95,'delete_rolled_back'),(5,102,NULL,'future_commit'),(6,90,102,'deleted_after_snap');\n-- CHECKS --\nSELECT (SELECT array_agg(row_id ORDER BY row_id) FROM answer) = ARRAY[1, 4, 6] AS ok, 'MVCC snapshot sees rows 1, 4, 6' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE row_id IN (2,3,5)) AS ok, 'hides aborted insert, prior delete, and future commit' AS msg;\nSELECT (SELECT count(*) FROM answer) = 3 AS ok, 'exact 3 visible tuples' AS msg;",
    "aTitle": "Optimistic Concurrency Control (OCC) Versioned CAS Update",
    "aDesc": "Table `inventory (sku text PRIMARY KEY, qty int, version int)` guards against lost updates.\nPerform an atomic CAS decrement for `sku = 'GPU-X'` subtracting `4` only if `version = 7` AND `qty >= 4`, incrementing `version` by `1`! Also attempt a stale CAS for `'SSD-Y'` (`version = 1`, actual is `3`) so only `'GPU-X'` updates.",
    "aStarter": "UPDATE inventory SET qty = qty - 4 WHERE sku = 'GPU-X';",
    "aHint": "UPDATE inventory SET qty = qty - 4, version = version + 1 WHERE sku = 'GPU-X' AND version = 7 AND qty >= 4;\nUPDATE inventory SET qty = qty - 2, version = version + 1 WHERE sku = 'SSD-Y' AND version = 1 AND qty >= 2;",
    "aTest": "CREATE TABLE inventory (sku text PRIMARY KEY, qty int, version int); INSERT INTO inventory VALUES ('GPU-X', 10, 7), ('SSD-Y', 12, 3);\n-- CHECKS --\nSELECT (SELECT qty FROM inventory WHERE sku='GPU-X') = 6 AS ok, 'GPU-X qty decremented to 6' AS msg;\nSELECT (SELECT version FROM inventory WHERE sku='GPU-X') = 8 AS ok, 'GPU-X version bumped to 8' AS msg;\nSELECT (SELECT qty FROM inventory WHERE sku='SSD-Y') = 12 AND (SELECT version FROM inventory WHERE sku='SSD-Y') = 3 AS ok, 'stale SSD-Y CAS did not overwrite' AS msg;"
  },
  {
    "day": 37,
    "fallbackTitle": "Explicit Row & Table Latching: FOR UPDATE, SKIP LOCKED Work Queues & Advisory Locks",
    "eTitle": "FOR UPDATE SKIP LOCKED Batch Job Claimer",
    "eDesc": "Table `job_queue (id int PRIMARY KEY, priority int, status text, worker text)` holds pending tasks.\nClaim top 2 `'PENDING'` tasks by highest `priority DESC, id ASC` using `FOR UPDATE SKIP LOCKED`, setting `status = 'RUNNING', worker = 'w1'`, inserting claimed `(id, priority)` into `claimed_log`, then running `ANALYZE claimed_log;`.",
    "eStarter": "-- TODO: WITH picked AS (... FOR UPDATE SKIP LOCKED LIMIT 2) UPDATE + INSERT into claimed_log\nANALYZE claimed_log;",
    "eHint": "WITH picked AS (\n  SELECT id FROM job_queue WHERE status = 'PENDING' ORDER BY priority DESC, id ASC FOR UPDATE SKIP LOCKED LIMIT 2\n), upd AS (\n  UPDATE job_queue q SET status = 'RUNNING', worker = 'w1' FROM picked WHERE q.id = picked.id RETURNING q.id, q.priority\n)\nINSERT INTO claimed_log (id, priority) SELECT id, priority FROM upd;\nANALYZE claimed_log;",
    "eTest": "CREATE TABLE job_queue (id int PRIMARY KEY, priority int, status text, worker text);\nCREATE TABLE claimed_log (id int PRIMARY KEY, priority int);\nINSERT INTO job_queue VALUES (1,5,'DONE','w0'),(2,9,'PENDING',NULL),(3,7,'PENDING',NULL),(4,9,'PENDING',NULL),(5,4,'PENDING',NULL);\n-- CHECKS --\nSELECT (SELECT array_agg(id ORDER BY id) FROM claimed_log) = ARRAY[2, 4] AS ok, 'claimed highest-priority pending jobs [2, 4]' AS msg;\nSELECT (SELECT count(*) FROM job_queue WHERE status='RUNNING' AND worker='w1') = 2 AS ok, '2 jobs marked RUNNING by w1' AS msg;\nSELECT (SELECT status FROM job_queue WHERE id=3) = 'PENDING' AS ok, 'remaining job stays PENDING' AS msg;",
    "aTitle": "Deadlock-Free Canonical Lock-Ordering Advisory Transfer",
    "aDesc": "Table `accts (id int PRIMARY KEY, bal int)` exists.\nWrite a PL/pgSQL function `safe_transfer(from_id int, to_id int, amt int) RETURNS boolean` that acquires `pg_advisory_xact_lock` on `LEAST(from_id, to_id)` FIRST then `GREATEST(from_id, to_id)`, debits `from_id` and credits `to_id` if funds suffice (returning `true`, else `false`). Call `SELECT safe_transfer(2, 1, 40)`.",
    "aStarter": "CREATE FUNCTION safe_transfer(from_id int, to_id int, amt int) RETURNS boolean LANGUAGE plpgsql AS $$ BEGIN RETURN false; END $$;",
    "aHint": "CREATE FUNCTION safe_transfer(from_id int, to_id int, amt int) RETURNS boolean LANGUAGE plpgsql AS $$\nDECLARE cur_bal int;\nBEGIN\n  PERFORM pg_advisory_xact_lock(LEAST(from_id, to_id));\n  IF from_id <> to_id THEN\n    PERFORM pg_advisory_xact_lock(GREATEST(from_id, to_id));\n  END IF;\n  SELECT bal INTO cur_bal FROM accts WHERE id = from_id FOR UPDATE;\n  IF cur_bal IS NULL OR cur_bal < amt THEN RETURN false; END IF;\n  UPDATE accts SET bal = bal - amt WHERE id = from_id;\n  UPDATE accts SET bal = bal + amt WHERE id = to_id;\n  RETURN true;\nEND $$;\nSELECT safe_transfer(2, 1, 40);",
    "aTest": "CREATE TABLE accts (id int PRIMARY KEY, bal int); INSERT INTO accts VALUES (1, 100), (2, 80);\n-- CHECKS --\nSELECT (SELECT bal FROM accts WHERE id=1) = 140 AND (SELECT bal FROM accts WHERE id=2) = 40 AS ok, 'transferred 40 from acct 2 to acct 1' AS msg;\nSELECT safe_transfer(2, 1, 999) = false AS ok, 'insufficient funds returns false safely' AS msg;\nSELECT (SELECT prosrc FROM pg_proc WHERE proname='safe_transfer') ILIKE '%pg_advisory_xact_lock%' AND (SELECT prosrc FROM pg_proc WHERE proname='safe_transfer') ILIKE '%LEAST%' AS ok, 'uses canonical LEAST/GREATEST lock order' AS msg;"
  },
  {
    "day": 38,
    "fallbackTitle": "Distributed Two-Phase Commit: PREPARE TRANSACTION, Consensus & Distributed Deadlock Detection",
    "eTitle": "Wait-For Graph Distributed Deadlock Cycle Detector",
    "eDesc": "Table `wait_for (waiter text, holder text)` records cross-shard lock dependencies.\nUse `WITH RECURSIVE ... CYCLE` to return all distinct `waiter` tx IDs that belong to a cycle, ordered alphabetically as `tx_id`.",
    "eStarter": "SELECT DISTINCT waiter AS tx_id FROM wait_for ORDER BY tx_id;",
    "eHint": "WITH RECURSIVE walk AS (\n  SELECT waiter AS start_tx, waiter, holder FROM wait_for\n  UNION ALL\n  SELECT w.start_tx, e.waiter, e.holder FROM walk w JOIN wait_for e ON e.waiter = w.holder\n) CYCLE waiter SET is_cycle USING path\nSELECT DISTINCT start_tx AS tx_id FROM walk WHERE is_cycle AND waiter = start_tx ORDER BY tx_id;",
    "eTest": "CREATE TABLE wait_for (waiter text, holder text); INSERT INTO wait_for VALUES ('T1','T2'),('T2','T3'),('T3','T1'),('T4','T5'),('T5','T6');\n-- CHECKS --\nSELECT (SELECT array_agg(tx_id ORDER BY tx_id) FROM answer) = ARRAY['T1','T2','T3'] AS ok, 'identifies cycle T1, T2, T3 only' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE tx_id IN ('T4','T5','T6')) AS ok, 'excludes non-cyclic chain T4->T5->T6' AS msg;\nSELECT (SELECT count(*) FROM answer) = 3 AS ok, 'exact 3 deadlocked txs' AS msg;",
    "aTitle": "Atomic 2PC Global Decision Coordinator Query",
    "aDesc": "Table `tpc_votes (gid text, shard text, vote text)` records participant PREPARE votes (`COMMIT` vs `ABORT`).\nUpdate `tpc_coord (gid text PRIMARY KEY, status text)` setting `status` to `'COMMITTED'` only if ALL participant rows for that `gid` voted `'COMMIT'` (and at least 1 row exists), else `'ABORTED'`.",
    "aStarter": "UPDATE tpc_coord SET status = 'ABORTED';",
    "aHint": "UPDATE tpc_coord c\nSET status = CASE\n  WHEN EXISTS(SELECT 1 FROM tpc_votes v WHERE v.gid = c.gid) AND (SELECT bool_and(v.vote = 'COMMIT') FROM tpc_votes v WHERE v.gid = c.gid) THEN 'COMMITTED'\n  ELSE 'ABORTED'\nEND;",
    "aTest": "CREATE TABLE tpc_coord (gid text PRIMARY KEY, status text);\nINSERT INTO tpc_coord VALUES ('gx1','PREPARING'),('gx2','PREPARING'),('gx3','PREPARING');\nCREATE TABLE tpc_votes (gid text, shard text, vote text);\nINSERT INTO tpc_votes VALUES ('gx1','s1','COMMIT'),('gx1','s2','COMMIT'),('gx2','s1','COMMIT'),('gx2','s2','ABORT');\n-- CHECKS --\nSELECT (SELECT status FROM tpc_coord WHERE gid='gx1') = 'COMMITTED' AS ok, 'gx1 unanimous COMMIT -> COMMITTED' AS msg;\nSELECT (SELECT status FROM tpc_coord WHERE gid='gx2') = 'ABORTED' AS ok, 'gx2 mixed vote -> ABORTED' AS msg;\nSELECT (SELECT status FROM tpc_coord WHERE gid='gx3') = 'ABORTED' AS ok, 'gx3 zero votes -> ABORTED' AS msg;"
  },
  {
    "day": 39,
    "fallbackTitle": "Advanced Index Concurrency: GiST & BRIN Concurrent Builds, Fastupdate Buffers & Resolution",
    "eTitle": "BRIN Time-Series Block-Range Index Configuration",
    "eDesc": "Table `iot_stream (id int, recorded_at int, val numeric)` stores append-ordered telemetry.\nCreate BRIN index `idx_iot_brin ON iot_stream USING brin (recorded_at) WITH (pages_per_range = 32);` and run `ANALYZE iot_stream;`.",
    "eStarter": "-- TODO: CREATE INDEX idx_iot_brin USING brin with pages_per_range = 32",
    "eHint": "CREATE INDEX idx_iot_brin ON iot_stream USING brin (recorded_at) WITH (pages_per_range = 32);\nANALYZE iot_stream;",
    "eTest": "CREATE TABLE iot_stream (id int PRIMARY KEY, recorded_at int, val numeric); INSERT INTO iot_stream SELECT g, g * 5, g * 1.5 FROM generate_series(1, 2000) g;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='idx_iot_brin' AND indexdef ILIKE '%USING brin%') AS ok, 'BRIN index created' AS msg;\nSELECT 'pages_per_range=32' = ANY(COALESCE((SELECT reloptions FROM pg_class WHERE relname='idx_iot_brin'), ARRAY[]::text[])) AS ok, 'pages_per_range=32 set' AS msg;\nSELECT (SELECT count(*) FROM iot_stream WHERE recorded_at BETWEEN 100 AND 200) = 21 AS ok, 'range query matches 21 rows' AS msg;",
    "aTitle": "GiST Interval Exclusion Constraint Preventing Overlaps",
    "aDesc": "Table `reservations (id int PRIMARY KEY, span int4range NOT NULL)` reserves time slots.\nAdd a GiST exclusion constraint `no_overlap` (`ALTER TABLE reservations ADD CONSTRAINT no_overlap EXCLUDE USING gist (span WITH &&);`) so overlapping ranges cannot coexist, then insert `(1, '[10, 20)')`.",
    "aStarter": "-- TODO: ADD CONSTRAINT no_overlap EXCLUDE USING gist + insert valid span",
    "aHint": "ALTER TABLE reservations ADD CONSTRAINT no_overlap EXCLUDE USING gist (span WITH &&);\nINSERT INTO reservations VALUES (1, '[10, 20)');",
    "aTest": "CREATE TABLE reservations (id int PRIMARY KEY, span int4range NOT NULL);\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='no_overlap' AND contype='x') AS ok, 'exclusion constraint no_overlap created' AS msg;\nSELECT (SELECT count(*) FROM reservations) = 1 AS ok, 'non-overlapping span inserted' AS msg;\nDO $$ BEGIN\n  INSERT INTO reservations VALUES (2, '[15, 25)');\n  RAISE EXCEPTION 'overlap should fail';\nEXCEPTION WHEN exclusion_violation THEN\n  NULL;\nEND $$;\nSELECT true AS ok, 'overlapping insert rejected by GiST exclusion' AS msg;"
  },
  {
    "day": 40,
    "fallbackTitle": "Milestone 8 Capstone: High-Concurrency Ticket Booking & Double-Spend Outage Post-Mortem",
    "eTitle": "Milestone 8A: Active-Seat Partial Unique Index + Atomic Claim",
    "eDesc": "Table `seat_holds (id serial PRIMARY KEY, show_id int, seat text, user_id text, status text)` holds seat claims.\nCreate partial unique index `uq_active_seat ON seat_holds (show_id, seat) WHERE status IN ('HELD','CONFIRMED')`, then cleanly attempt to claim `(10, 'A1', 'u2', 'HELD')` using `ON CONFLICT DO NOTHING` and also book `(10, 'A2', 'u2', 'HELD')` (previously `'CANCELLED'`).",
    "eStarter": "-- TODO: create partial unique index uq_active_seat + idempotent inserts",
    "eHint": "CREATE UNIQUE INDEX uq_active_seat ON seat_holds (show_id, seat) WHERE status IN ('HELD', 'CONFIRMED');\nINSERT INTO seat_holds (show_id, seat, user_id, status) VALUES (10, 'A1', 'u2', 'HELD') ON CONFLICT DO NOTHING;\nINSERT INTO seat_holds (show_id, seat, user_id, status) VALUES (10, 'A2', 'u2', 'HELD') ON CONFLICT DO NOTHING;",
    "eTest": "CREATE TABLE seat_holds (id serial PRIMARY KEY, show_id int, seat text, user_id text, status text); INSERT INTO seat_holds (show_id, seat, user_id, status) VALUES (10,'A1','u1','HELD'),(10,'A2','u3','CANCELLED');\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='uq_active_seat' AND indexdef ILIKE '%UNIQUE%' AND indexdef ILIKE '%WHERE%') AS ok, 'uq_active_seat partial unique index exists' AS msg;\nSELECT (SELECT count(*) FROM seat_holds WHERE show_id=10 AND seat='A1' AND status='HELD') = 1 AS ok, 'u1 keeps exclusive A1 hold' AS msg;\nSELECT (SELECT user_id FROM seat_holds WHERE show_id=10 AND seat='A2' AND status='HELD') = 'u2' AS ok, 'cancelled A2 safely re-booked by u2' AS msg;",
    "aTitle": "Milestone 8B: Double-Spend Idempotency Capture Audit",
    "aDesc": "Table `captures (capture_id int, idem_key text, acct_id int, amount int, status text)` received retried requests.\nDeduplicate `'CAPTURED'` rows per `idem_key` keeping earliest `capture_id`, and return `acct_id, SUM(amount)::int AS valid_cents, count(*)::int AS valid_cnt` ordered by `acct_id`.",
    "aStarter": "SELECT acct_id, SUM(amount)::int AS valid_cents, count(*)::int AS valid_cnt FROM captures GROUP BY acct_id ORDER BY acct_id;",
    "aHint": "WITH dedup AS (\n  SELECT DISTINCT ON (idem_key) acct_id, amount\n  FROM captures\n  WHERE status = 'CAPTURED'\n  ORDER BY idem_key, capture_id ASC\n)\nSELECT acct_id, SUM(amount)::int AS valid_cents, count(*)::int AS valid_cnt\nFROM dedup\nGROUP BY acct_id\nORDER BY acct_id;",
    "aTest": "CREATE TABLE captures (capture_id int, idem_key text, acct_id int, amount int, status text); INSERT INTO captures VALUES (1,'k1',10,500,'CAPTURED'),(2,'k1',10,500,'CAPTURED'),(3,'k2',10,300,'FAILED'),(4,'k3',10,200,'CAPTURED'),(5,'k4',20,900,'CAPTURED');\n-- CHECKS --\nSELECT (SELECT valid_cents FROM answer WHERE acct_id=10) = 700 AS ok, 'acct 10 deduplicated valid_cents = 700' AS msg;\nSELECT (SELECT valid_cnt FROM answer WHERE acct_id=10) = 2 AS ok, 'acct 10 valid_cnt = 2' AS msg;\nSELECT (SELECT valid_cents FROM answer WHERE acct_id=20) = 900 AS ok, 'acct 20 valid_cents = 900' AS msg;"
  },
  {
    "day": 41,
    "fallbackTitle": "Physical Streaming Replication: WAL Senders, WAL Receivers & Cascading Topologies",
    "eTitle": "pg_wal_lsn_diff Replica Lag Classifier",
    "eDesc": "Table `replicas (name text, sent_lsn pg_lsn, replay_lsn pg_lsn)` tracks streaming standbys.\nReturn `name, pg_wal_lsn_diff(sent_lsn, replay_lsn)::bigint AS lag_bytes`, plus `health` (`'HEALTHY'` < 1048576, `'LAGGING'` < 67108864, `'CRITICAL'` >= 67108864), ordered by `name`.",
    "eStarter": "SELECT name, 0::bigint AS lag_bytes, 'HEALTHY' AS health FROM replicas ORDER BY name;",
    "eHint": "SELECT name,\n  pg_wal_lsn_diff(sent_lsn, replay_lsn)::bigint AS lag_bytes,\n  CASE\n    WHEN pg_wal_lsn_diff(sent_lsn, replay_lsn) < 1048576 THEN 'HEALTHY'\n    WHEN pg_wal_lsn_diff(sent_lsn, replay_lsn) < 67108864 THEN 'LAGGING'\n    ELSE 'CRITICAL'\n  END AS health\nFROM replicas\nORDER BY name;",
    "eTest": "CREATE TABLE replicas (name text, sent_lsn pg_lsn, replay_lsn pg_lsn); INSERT INTO replicas VALUES ('r1','0/5000000','0/4FF0000'),('r2','0/5000000','0/3000000'),('r3','0/9000000','0/1000000');\n-- CHECKS --\nSELECT (SELECT health FROM answer WHERE name='r1') = 'HEALTHY' AS ok, 'r1 lag 64KB -> HEALTHY' AS msg;\nSELECT (SELECT health FROM answer WHERE name='r2') = 'LAGGING' AS ok, 'r2 lag 32MB -> LAGGING' AS msg;\nSELECT (SELECT health FROM answer WHERE name='r3') = 'CRITICAL' AND (SELECT lag_bytes FROM answer WHERE name='r3') = 134217728 AS ok, 'r3 lag 128MB -> CRITICAL' AS msg;",
    "aTitle": "Recursive Cascading Replication Topology Lag Tree",
    "aDesc": "Table `rep_nodes (node text PRIMARY KEY, upstream text, replay_lsn pg_lsn)` models primary -> cascading standbys.\nUse `WITH RECURSIVE` from `upstream IS NULL` (primary) returning `node, depth, pg_wal_lsn_diff(root_lsn, replay_lsn)::bigint AS end_to_end_lag` ordered by `depth, node`.",
    "aStarter": "SELECT node, 0 AS depth, 0::bigint AS end_to_end_lag FROM rep_nodes ORDER BY node;",
    "aHint": "WITH RECURSIVE tree AS (\n  SELECT node, replay_lsn AS root_lsn, replay_lsn, 0 AS depth FROM rep_nodes WHERE upstream IS NULL\n  UNION ALL\n  SELECT c.node, t.root_lsn, c.replay_lsn, t.depth + 1 FROM rep_nodes c JOIN tree t ON c.upstream = t.node\n)\nSELECT node, depth, pg_wal_lsn_diff(root_lsn, replay_lsn)::bigint AS end_to_end_lag FROM tree ORDER BY depth, node;",
    "aTest": "CREATE TABLE rep_nodes (node text PRIMARY KEY, upstream text, replay_lsn pg_lsn); INSERT INTO rep_nodes VALUES ('pri',NULL,'0/2000000'),('relay','pri','0/1F00000'),('leaf1','relay','0/1E00000');\n-- CHECKS --\nSELECT (SELECT depth FROM answer WHERE node='leaf1') = 2 AS ok, 'leaf1 depth = 2' AS msg;\nSELECT (SELECT end_to_end_lag FROM answer WHERE node='leaf1') = 2097152 AS ok, 'leaf1 end-to-end lag = 2MB' AS msg;\nSELECT (SELECT end_to_end_lag FROM answer WHERE node='pri') = 0 AS ok, 'primary lag = 0' AS msg;"
  },
  {
    "day": 42,
    "fallbackTitle": "Synchronous vs Asynchronous Replication: synchronous_commit Levels & RPO/RTO Tuning",
    "eTitle": "Quorum FIRST-k vs ANY-k Commit Ack Watermark",
    "eDesc": "Table `sync_standbys (name text, prio int, ack_lsn pg_lsn)` lists synchronous standby positions (lower `prio` = higher priority).\nCompute a single-row comparison: `any2_lsn` (2nd-highest `ack_lsn` across all standbys) and `first2_lsn` (minimum `ack_lsn` among top 2 standbys ordered by `prio ASC`).",
    "eStarter": "SELECT MAX(ack_lsn) AS any2_lsn, MIN(ack_lsn) AS first2_lsn FROM sync_standbys;",
    "eHint": "WITH ranked AS (\n  SELECT name, prio, ack_lsn,\n    ROW_NUMBER() OVER (ORDER BY ack_lsn DESC) AS lsn_rk,\n    ROW_NUMBER() OVER (ORDER BY prio ASC) AS prio_rk\n  FROM sync_standbys\n)\nSELECT\n  (SELECT ack_lsn FROM ranked WHERE lsn_rk = 2) AS any2_lsn,\n  (SELECT MIN(ack_lsn) FROM ranked WHERE prio_rk <= 2) AS first2_lsn;",
    "eTest": "CREATE TABLE sync_standbys (name text, prio int, ack_lsn pg_lsn); INSERT INTO sync_standbys VALUES ('s1',1,'0/500'),('s2',2,'0/300'),('s3',3,'0/450');\n-- CHECKS --\nSELECT (SELECT any2_lsn FROM answer) = '0/450'::pg_lsn AS ok, 'ANY 2 ack watermark is 0/450' AS msg;\nSELECT (SELECT first2_lsn FROM answer) = '0/300'::pg_lsn AS ok, 'FIRST 2 (s1,s2) min watermark is 0/300' AS msg;\nSELECT (SELECT count(*) FROM answer) = 1 AS ok, 'single summary row returned' AS msg;",
    "aTitle": "Durability Mode RPO Exposure Audit",
    "aDesc": "Table `tx_profiles (app text, sync_mode text, avg_lsn_rate_kbps int, crash_window_sec int)` defines client settings.\nCompute `max_rpo_kb` (`0` for `'on'`, `'remote_apply'`, `'remote_write'`; `avg_lsn_rate_kbps * crash_window_sec` for `'off'` or `'local'`) and `zero_rpo` boolean ordered by `app`.",
    "aStarter": "SELECT app, 0 AS max_rpo_kb, false AS zero_rpo FROM tx_profiles ORDER BY app;",
    "aHint": "SELECT app,\n  CASE WHEN sync_mode IN ('on','remote_apply','remote_write') THEN 0 ELSE avg_lsn_rate_kbps * crash_window_sec END AS max_rpo_kb,\n  (sync_mode IN ('on','remote_apply','remote_write')) AS zero_rpo\nFROM tx_profiles\nORDER BY app;",
    "aTest": "CREATE TABLE tx_profiles (app text, sync_mode text, avg_lsn_rate_kbps int, crash_window_sec int); INSERT INTO tx_profiles VALUES ('payments','remote_apply',500,4),('metrics','off',200,10),('auth','local',100,5);\n-- CHECKS --\nSELECT (SELECT max_rpo_kb FROM answer WHERE app='payments') = 0 AND (SELECT zero_rpo FROM answer WHERE app='payments') = true AS ok, 'payments RPO=0' AS msg;\nSELECT (SELECT max_rpo_kb FROM answer WHERE app='metrics') = 2000 AND (SELECT zero_rpo FROM answer WHERE app='metrics') = false AS ok, 'metrics RPO=2000KB' AS msg;\nSELECT (SELECT max_rpo_kb FROM answer WHERE app='auth') = 500 AS ok, 'auth local risks 500KB RPO' AS msg;"
  },
  {
    "day": 43,
    "fallbackTitle": "Logical Replication & Change Data Capture: Publications, Subscriptions & CDC Pipelines",
    "eTitle": "Apply Ordered CDC Stream via MERGE Into Replica Table",
    "eDesc": "Table `cdc_batch (id int, val text, op char(1))` contains net logical changes (`I`, `U`, `D`) for `target_replica (id int PRIMARY KEY, val text)`.\nUse PostgreSQL `MERGE INTO target_replica t USING cdc_batch s ON t.id = s.id` to insert `'I'`, update `'U'`, and delete `'D'` in one atomic statement!",
    "eStarter": "-- TODO: MERGE INTO target_replica t USING cdc_batch s ...",
    "eHint": "MERGE INTO target_replica t\nUSING cdc_batch s ON t.id = s.id\nWHEN MATCHED AND s.op = 'D' THEN DELETE\nWHEN MATCHED AND s.op IN ('U', 'I') THEN UPDATE SET val = s.val\nWHEN NOT MATCHED AND s.op IN ('I', 'U') THEN INSERT (id, val) VALUES (s.id, s.val);",
    "eTest": "CREATE TABLE target_replica (id int PRIMARY KEY, val text); INSERT INTO target_replica VALUES (1,'old'),(2,'gone'),(3,'keep'); CREATE TABLE cdc_batch (id int, val text, op char(1)); INSERT INTO cdc_batch VALUES (1,'new','U'),(2,NULL,'D'),(4,'added','I');\n-- CHECKS --\nSELECT (SELECT val FROM target_replica WHERE id=1) = 'new' AS ok, 'row 1 updated' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM target_replica WHERE id=2) AS ok, 'row 2 deleted' AS msg;\nSELECT (SELECT val FROM target_replica WHERE id=4) = 'added' AND (SELECT val FROM target_replica WHERE id=3) = 'keep' AS ok, 'row 4 inserted and row 3 untouched' AS msg;",
    "aTitle": "Point-in-Time Snapshot Reconstruction from CDC Log",
    "aDesc": "Table `cdc_wal (pk int, lsn pg_lsn, op text, name text)` stores append-only row mutations.\nReconstruct active rows at watermark `lsn <= '0/2000'::pg_lsn` using latest mutation per `pk` and excluding `'D'` tombstones, returning `pk, name` ordered by `pk`.",
    "aStarter": "SELECT pk, name FROM cdc_wal ORDER BY pk;",
    "aHint": "WITH latest AS (\n  SELECT DISTINCT ON (pk) pk, op, name\n  FROM cdc_wal\n  WHERE lsn <= '0/2000'::pg_lsn\n  ORDER BY pk, lsn DESC\n)\nSELECT pk, name FROM latest WHERE op <> 'D' ORDER BY pk;",
    "aTest": "CREATE TABLE cdc_wal (pk int, lsn pg_lsn, op text, name text); INSERT INTO cdc_wal VALUES (1,'0/1000','I','Alpha'),(1,'0/1500','U','AlphaV2'),(1,'0/3000','D',NULL),(2,'0/1200','I','Beta'),(2,'0/1800','D',NULL),(3,'0/2500','I','Future');\n-- CHECKS --\nSELECT (SELECT array_agg(pk ORDER BY pk) FROM answer) = ARRAY[1] AS ok, 'only pk 1 alive at 0/2000' AS msg;\nSELECT (SELECT name FROM answer WHERE pk=1) = 'AlphaV2' AS ok, 'pk 1 has version AlphaV2 at 0/2000' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE pk IN (2, 3)) AS ok, 'tombstoned pk 2 and future pk 3 excluded' AS msg;"
  },
  {
    "day": 44,
    "fallbackTitle": "Connection Pooling Architecture: PgBouncer Mechanics, Pooling Modes & Little's Law Sizing",
    "eTitle": "Little's Law Pool Concurrency & Saturation Calculator",
    "eDesc": "Table `pool_services (svc text, rps numeric, avg_ms numeric, pool_size int)` tracks service traffic.\nCompute `svc, ROUND((rps * (avg_ms / 1000.0))::numeric, 2) AS avg_active, (rps * (avg_ms / 1000.0) > pool_size) AS saturated` ordered by `svc`.",
    "eStarter": "SELECT svc, 0.00 AS avg_active, false AS saturated FROM pool_services ORDER BY svc;",
    "eHint": "SELECT svc,\n  ROUND((rps * (avg_ms / 1000.0))::numeric, 2) AS avg_active,\n  (rps * (avg_ms / 1000.0) > pool_size) AS saturated\nFROM pool_services\nORDER BY svc;",
    "eTest": "CREATE TABLE pool_services (svc text, rps numeric, avg_ms numeric, pool_size int); INSERT INTO pool_services VALUES ('api',2000,15,20),('auth',400,10,16);\n-- CHECKS --\nSELECT (SELECT avg_active FROM answer WHERE svc='api') = 30.00 AND (SELECT saturated FROM answer WHERE svc='api') = true AS ok, 'api L=30 > 20 saturated' AS msg;\nSELECT (SELECT avg_active FROM answer WHERE svc='auth') = 4.00 AND (SELECT saturated FROM answer WHERE svc='auth') = false AS ok, 'auth L=4 <= 16 healthy' AS msg;\nSELECT (SELECT count(*) FROM answer) = 2 AS ok, '2 services analyzed' AS msg;",
    "aTitle": "Transaction-Pooling Compatibility Blocker Detector",
    "aDesc": "Table `query_audit (svc text, stmt text)` captures client SQL patterns.\nFlag services issuing session-pinning statements (`LISTEN`, `PREPARE `, `CREATE TEMP`, `SET SESSION`) returning `svc, count(*)::int AS pin_events` for affected services ordered by `svc`.",
    "aStarter": "SELECT svc, 0 AS pin_events FROM query_audit GROUP BY svc;",
    "aHint": "SELECT svc, count(*)::int AS pin_events\nFROM query_audit\nWHERE stmt ~* '^\\s*(LISTEN|PREPARE\\s+|CREATE\\s+TEMP|SET\\s+SESSION)'\nGROUP BY svc\nORDER BY svc;",
    "aTest": "CREATE TABLE query_audit (svc text, stmt text); INSERT INTO query_audit VALUES ('worker','LISTEN jobs'),('worker','PREPARE p1 AS SELECT 1'),('worker','SELECT 1'),('web','SELECT * FROM users'),('legacy','CREATE TEMP TABLE t(x int)');\n-- CHECKS --\nSELECT (SELECT pin_events FROM answer WHERE svc='worker') = 2 AS ok, 'worker has 2 session-pin statements' AS msg;\nSELECT (SELECT pin_events FROM answer WHERE svc='legacy') = 1 AS ok, 'legacy has 1 temp-table pin' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE svc='web') AS ok, 'clean web service excluded' AS msg;"
  },
  {
    "day": 45,
    "fallbackTitle": "Milestone 9 Capstone: Multi-Region Primary Failover & Split-Brain Disaster Recovery Post-Mortem",
    "eTitle": "Milestone 9A: Deterministic Failover Winner & Rogue WAL Divergence",
    "eDesc": "Table `cluster_nodes (node text, wal_lsn pg_lsn, timeline int, priority int, reachable boolean)` captures election candidates after primary loss.\nWrite a `CREATE VIEW failover_decision AS` returning ONLY the winning `reachable = true` node ordered by `wal_lsn DESC, timeline DESC, priority ASC LIMIT 1`, with columns `winner, wal_lsn, rogue_lag_bytes` (`pg_wal_lsn_diff(winner.wal_lsn, (SELECT MAX(wal_lsn) FROM cluster_nodes WHERE NOT reachable))` or 0).",
    "eStarter": "-- TODO: CREATE VIEW failover_decision AS ...",
    "eHint": "CREATE VIEW failover_decision AS\nSELECT node AS winner, wal_lsn,\n  COALESCE(ABS(pg_wal_lsn_diff(wal_lsn, (SELECT MAX(wal_lsn) FROM cluster_nodes WHERE NOT reachable))), 0)::bigint AS rogue_lag_bytes\nFROM cluster_nodes\nWHERE reachable\nORDER BY wal_lsn DESC, timeline DESC, priority ASC\nLIMIT 1;",
    "eTest": "CREATE TABLE cluster_nodes (node text, wal_lsn pg_lsn, timeline int, priority int, reachable boolean); INSERT INTO cluster_nodes VALUES ('us-old','0/5020000',2,1,false),('eu-1','0/5010000',2,2,true),('ap-1','0/5000000',2,1,true);\n-- CHECKS --\nSELECT (SELECT winner FROM failover_decision) = 'eu-1' AS ok, 'eu-1 promoted with highest reachable WAL LSN' AS msg;\nSELECT (SELECT rogue_lag_bytes FROM failover_decision) = 65536 AS ok, 'rogue divergence = 64KB (65536B)' AS msg;\nSELECT (SELECT count(*) FROM failover_decision) = 1 AS ok, 'single winner selected' AS msg;",
    "aTitle": "Milestone 9B: Split-Brain Last-Writer-Wins Quarantine Reconciliation",
    "aDesc": "Table `split_writes (key text, node text, hlc_ts int, val text)` captures concurrent conflicting writes during split-brain.\nCompute a winning-vs-quarantined view returning `key, winner_node, winner_val, conflict_count` (total writes per key) ordered by `key`, using `(hlc_ts DESC, node DESC)` tie-breaker.",
    "aStarter": "SELECT key, node AS winner_node, val AS winner_val, 1 AS conflict_count FROM split_writes ORDER BY key;",
    "aHint": "WITH ranked AS (\n  SELECT key, node, val,\n    ROW_NUMBER() OVER (PARTITION BY key ORDER BY hlc_ts DESC, node DESC) AS rk,\n    COUNT(*) OVER (PARTITION BY key)::int AS conflict_count\n  FROM split_writes\n)\nSELECT key, node AS winner_node, val AS winner_val, conflict_count FROM ranked WHERE rk = 1 ORDER BY key;",
    "aTest": "CREATE TABLE split_writes (key text, node text, hlc_ts int, val text); INSERT INTO split_writes VALUES ('k1','nA',100,'v1'),('k1','nB',105,'v2'),('k2','nA',200,'alpha'),('k2','nB',200,'beta');\n-- CHECKS --\nSELECT (SELECT winner_val FROM answer WHERE key='k1') = 'v2' AND (SELECT conflict_count FROM answer WHERE key='k1') = 2 AS ok, 'k1 picks higher HLC 105' AS msg;\nSELECT (SELECT winner_node FROM answer WHERE key='k2') = 'nB' AND (SELECT winner_val FROM answer WHERE key='k2') = 'beta' AS ok, 'k2 breaks equal-HLC tie using node DESC (nB)' AS msg;\nSELECT (SELECT count(*) FROM answer) = 2 AS ok, '2 unique keys reconciled' AS msg;"
  },
  {
    "day": 46,
    "fallbackTitle": "Declarative Table Partitioning: PARTITION BY RANGE, LIST, HASH & Storage Layout Internals",
    "eTitle": "LIST Partitioning with Explicit Default Overflow Partition",
    "eDesc": "Create `regional_events (id int, region text, payload text) PARTITION BY LIST (region)` with partitions `part_us` (`'us'`), `part_eu` (`'eu'`), and `part_other` (`DEFAULT`), and insert `(1,'us','a'), (2,'eu','b'), (3,'ap','c')`.",
    "eStarter": "-- TODO: CREATE TABLE regional_events PARTITION BY LIST + partitions + inserts",
    "eHint": "CREATE TABLE regional_events (id int, region text, payload text) PARTITION BY LIST (region);\nCREATE TABLE part_us PARTITION OF regional_events FOR VALUES IN ('us');\nCREATE TABLE part_eu PARTITION OF regional_events FOR VALUES IN ('eu');\nCREATE TABLE part_other PARTITION OF regional_events DEFAULT;\nINSERT INTO regional_events VALUES (1,'us','a'),(2,'eu','b'),(3,'ap','c');",
    "eTest": "SELECT 1;\n-- CHECKS --\nSELECT (SELECT partstrat FROM pg_partitioned_table WHERE partrelid = 'regional_events'::regclass) = 'l' AS ok, 'partitioned by LIST' AS msg;\nSELECT (SELECT count(*) FROM part_us) = 1 AND (SELECT count(*) FROM part_eu) = 1 AND (SELECT count(*) FROM part_other) = 1 AS ok, 'each partition holds its routed row' AS msg;\nSELECT (SELECT count(*) FROM regional_events) = 3 AS ok, 'total 3 rows in parent' AS msg;",
    "aTitle": "Two-Level Composite RANGE + HASH Subpartitioned Table",
    "aDesc": "Create two-level subpartitioned table `telemetry (ts date, tenant_id int, val int) PARTITION BY RANGE (ts) PARTITION BY HASH (tenant_id)` (`p_2026` covering `2026-01-01` to `2027-01-01`, subpartitioned by `HASH (tenant_id)` into `p_2026_h0`, `p_2026_h1`), and insert `('2026-05-01', 1, 50)` and `('2026-05-02', 2, 75)`.",
    "aStarter": "-- TODO: RANGE parent -> HASH subpartitioned child + 2 hash subpartitions + inserts",
    "aHint": "CREATE TABLE telemetry (ts date, tenant_id int, val int) PARTITION BY RANGE (ts);\nCREATE TABLE p_2026 PARTITION OF telemetry FOR VALUES FROM ('2026-01-01') TO ('2027-01-01') PARTITION BY HASH (tenant_id);\nCREATE TABLE p_2026_h0 PARTITION OF p_2026 FOR VALUES WITH (MODULUS 2, REMAINDER 0);\nCREATE TABLE p_2026_h1 PARTITION OF p_2026 FOR VALUES WITH (MODULUS 2, REMAINDER 1);\nINSERT INTO telemetry VALUES ('2026-05-01', 1, 50), ('2026-05-02', 2, 75);",
    "aTest": "SELECT 1;\n-- CHECKS --\nSELECT (SELECT partstrat FROM pg_partitioned_table WHERE partrelid = 'telemetry'::regclass) = 'r' AS ok, 'top level RANGE' AS msg;\nSELECT (SELECT partstrat FROM pg_partitioned_table WHERE partrelid = 'p_2026'::regclass) = 'h' AS ok, 'second level HASH' AS msg;\nSELECT (SELECT count(*) FROM p_2026_h0) + (SELECT count(*) FROM p_2026_h1) = 2 AS ok, 'both rows stored in leaf hash subpartitions' AS msg;"
  },
  {
    "day": 47,
    "fallbackTitle": "Dynamic Partition Pruning & Query Optimization: Plan-Time, Run-Time & Partition-Wise Topologies",
    "eTitle": "Plan-Time Partition Pruning Verification Across Monthly Ranges",
    "eDesc": "Partitioned table `clickstream (id int, event_month int, hits int) PARTITION BY RANGE (event_month)` already exists.\nAttach 3 monthly partitions: `m_jan` (`[1, 2)`), `m_feb` (`[2, 3)`), `m_mar` (`[3, 4)`), insert `(1,1,10), (2,2,20), (3,3,30)`, and run `ANALYZE clickstream;`.",
    "eStarter": "-- TODO: create m_jan, m_feb, m_mar partitions, insert sample rows, ANALYZE",
    "eHint": "CREATE TABLE m_jan PARTITION OF clickstream FOR VALUES FROM (1) TO (2);\nCREATE TABLE m_feb PARTITION OF clickstream FOR VALUES FROM (2) TO (3);\nCREATE TABLE m_mar PARTITION OF clickstream FOR VALUES FROM (3) TO (4);\nINSERT INTO clickstream VALUES (1, 1, 10), (2, 2, 20), (3, 3, 30);\nANALYZE clickstream;",
    "eTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE clickstream (id int, event_month int, hits int) PARTITION BY RANGE (event_month);\n-- CHECKS --\nSELECT (SELECT count(*) FROM pg_inherits WHERE inhparent = 'clickstream'::regclass) = 3 AS ok, '3 monthly partitions attached' AS msg;\nSELECT explain_json('SELECT * FROM clickstream WHERE event_month = 2') LIKE '%m_feb%' AS ok, 'planner scans m_feb' AS msg;\nSELECT explain_json('SELECT * FROM clickstream WHERE event_month = 2') NOT LIKE '%m_jan%' AND explain_json('SELECT * FROM clickstream WHERE event_month = 2') NOT LIKE '%m_mar%' AS ok, 'pruned m_jan and m_mar at plan time' AS msg;",
    "aTitle": "Multi-Dimensional Rollup via GROUPING SETS over Partitioned Sales",
    "aDesc": "Table `sales_p (region text, category text, rev int)` holds partitioned revenue.\nReturn `COALESCE(region, 'ALL') AS region, COALESCE(category, 'ALL') AS category, SUM(rev)::int AS total_rev` across `GROUPING SETS ((region), (category), ())` ordered by `region, category`.",
    "aStarter": "SELECT region, category, SUM(rev)::int AS total_rev FROM sales_p GROUP BY region, category;",
    "aHint": "SELECT COALESCE(region, 'ALL') AS region, COALESCE(category, 'ALL') AS category, SUM(rev)::int AS total_rev\nFROM sales_p\nGROUP BY GROUPING SETS ((region), (category), ())\nORDER BY 1, 2;",
    "aTest": "CREATE TABLE sales_p (region text, category text, rev int); INSERT INTO sales_p VALUES ('US','Cloud',100),('US','DB',50),('EU','Cloud',80);\n-- CHECKS --\nSELECT (SELECT total_rev FROM answer WHERE region='ALL' AND category='ALL') = 230 AS ok, 'grand total = 230' AS msg;\nSELECT (SELECT total_rev FROM answer WHERE region='US' AND category='ALL') = 150 AS ok, 'US subtotal = 150' AS msg;\nSELECT (SELECT total_rev FROM answer WHERE region='ALL' AND category='Cloud') = 180 AS ok, 'Cloud subtotal = 180' AS msg;"
  },
  {
    "day": 48,
    "fallbackTitle": "Partition Maintenance Automation, Zero-Downtime Data Lifecycles & DETACH CONCURRENTLY",
    "eTitle": "Zero-Loss Partition Detach Archive & Future Roll-Forward",
    "eDesc": "Partitioned `audit_events (id int, yr int, msg text)` has `audit_2024` (`[2024, 2025)`) and `audit_2025` (`[2025, 2026)`).\nDetach `audit_2024` as standalone archive table (`ALTER TABLE audit_events DETACH PARTITION audit_2024;`) and attach new live partition `audit_2026` (`[2026, 2027)`), then insert `(99, 2026, 'live')`.",
    "eStarter": "-- TODO: DETACH audit_2024 and create audit_2026 + insert 2026 row",
    "eHint": "ALTER TABLE audit_events DETACH PARTITION audit_2024;\nCREATE TABLE audit_2026 PARTITION OF audit_events FOR VALUES FROM (2026) TO (2027);\nINSERT INTO audit_events VALUES (99, 2026, 'live');",
    "eTest": "CREATE TABLE audit_events (id int, yr int, msg text) PARTITION BY RANGE (yr);\nCREATE TABLE audit_2024 PARTITION OF audit_events FOR VALUES FROM (2024) TO (2025);\nCREATE TABLE audit_2025 PARTITION OF audit_events FOR VALUES FROM (2025) TO (2026);\nINSERT INTO audit_events VALUES (1, 2024, 'old'), (2, 2025, 'cur');\n-- CHECKS --\nSELECT NOT EXISTS(SELECT 1 FROM pg_inherits WHERE inhparent='audit_events'::regclass AND inhrelid='audit_2024'::regclass) AS ok, 'audit_2024 detached from parent' AS msg;\nSELECT (SELECT count(*) FROM audit_2024) = 1 AS ok, 'archive table audit_2024 retains 2024 row intact' AS msg;\nSELECT (SELECT count(*) FROM audit_2026) = 1 AND (SELECT count(*) FROM audit_events) = 2 AS ok, 'audit_2026 attached and receives 2026 row' AS msg;",
    "aTitle": "Partition Boundary Gap & Overlap Validator Query",
    "aDesc": "Table `part_defs (part_name text, start_day int, end_day int)` describes half-open `[start_day, end_day)` bounds.\nUse `LEAD(start_day) OVER (ORDER BY start_day, end_day)` to report every anomaly (`part_name`, `anomaly` = `'OVERLAP'` when `end_day > next_start` or `'GAP'` when `end_day < next_start`) ordered by `part_name`.",
    "aStarter": "SELECT part_name, 'OK' AS anomaly FROM part_defs ORDER BY part_name;",
    "aHint": "WITH seq AS (\n  SELECT part_name, start_day, end_day, LEAD(start_day) OVER (ORDER BY start_day, end_day) AS next_start\n  FROM part_defs\n)\nSELECT part_name,\n  CASE WHEN end_day > next_start THEN 'OVERLAP' WHEN end_day < next_start THEN 'GAP' END AS anomaly\nFROM seq\nWHERE next_start IS NOT NULL AND end_day <> next_start\nORDER BY part_name;",
    "aTest": "CREATE TABLE part_defs (part_name text, start_day int, end_day int); INSERT INTO part_defs VALUES ('p1',1,10),('p2',10,25),('p3',20,30),('p4',35,40);\n-- CHECKS --\nSELECT (SELECT anomaly FROM answer WHERE part_name='p2') = 'OVERLAP' AS ok, 'p2 [10,25) overlaps p3 [20,30)' AS msg;\nSELECT (SELECT anomaly FROM answer WHERE part_name='p3') = 'GAP' AS ok, 'gap between p3 [20,30) and p4 [35,40)' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE part_name='p1') AND (SELECT count(*) FROM answer) = 2 AS ok, 'contiguous p1 excluded' AS msg;"
  },
  {
    "day": 49,
    "fallbackTitle": "Distributed Sharding & Scale-Out Architecture: postgres_fdw, Foreign Partitions & Distributed Transactions",
    "eTitle": "Deterministic Hash-Ring Tenant-to-Shard Router",
    "eDesc": "Table `tenants (tenant_key text PRIMARY KEY)` stores customer keys.\nRoute every tenant cleanly using PostgreSQL native `ABS(hashtext(tenant_key)) % 4` into `tenant_key, shard_id` ordered by `tenant_key`, plus confirm balanced valid range `0..3`.",
    "eStarter": "SELECT tenant_key, 0 AS shard_id FROM tenants ORDER BY tenant_key;",
    "eHint": "SELECT tenant_key, (ABS(hashtext(tenant_key)) % 4)::int AS shard_id\nFROM tenants\nORDER BY tenant_key;",
    "eTest": "CREATE TABLE tenants (tenant_key text PRIMARY KEY); INSERT INTO tenants VALUES ('acme'),('globex'),('initech'),('soylent'),('umbrella'),('wayne');\n-- CHECKS --\nSELECT (SELECT bool_and(shard_id BETWEEN 0 AND 3) FROM answer) AS ok, 'all shard ids in [0, 3]' AS msg;\nSELECT (SELECT shard_id FROM answer WHERE tenant_key='acme') = (ABS(hashtext('acme')) % 4)::int AS ok, 'deterministic hashtext routing' AS msg;\nSELECT (SELECT count(*) FROM answer) = 6 AS ok, 'all 6 tenants routed' AS msg;",
    "aTitle": "Distributed Pushdown Top-K Coordinator Merge Query",
    "aDesc": "Three shards `shard_a (id int, score int)`, `shard_b`, `shard_c` hold regional leaderboard rows.\nSimulate pushdown Top-3-per-shard then global Top-4 coordinator merge returning `shard_tag, id, score` ordered by `score DESC, id ASC`.",
    "aStarter": "SELECT 'a' AS shard_tag, id, score FROM shard_a LIMIT 4;",
    "aHint": "WITH top_shards AS (\n  (SELECT 'a' AS shard_tag, id, score FROM shard_a ORDER BY score DESC, id ASC LIMIT 3)\n  UNION ALL\n  (SELECT 'b' AS shard_tag, id, score FROM shard_b ORDER BY score DESC, id ASC LIMIT 3)\n  UNION ALL\n  (SELECT 'c' AS shard_tag, id, score FROM shard_c ORDER BY score DESC, id ASC LIMIT 3)\n)\nSELECT shard_tag, id, score FROM top_shards ORDER BY score DESC, id ASC LIMIT 4;",
    "aTest": "CREATE TABLE shard_a (id int, score int); CREATE TABLE shard_b (id int, score int); CREATE TABLE shard_c (id int, score int); INSERT INTO shard_a VALUES (1,95),(2,70); INSERT INTO shard_b VALUES (3,99),(4,88),(5,60); INSERT INTO shard_c VALUES (6,91),(7,85);\n-- CHECKS --\nSELECT (SELECT count(*) FROM answer) = 4 AS ok, 'global top 4 returned' AS msg;\nSELECT (SELECT array_agg(id ORDER BY score DESC) FROM answer) = ARRAY[3, 1, 6, 4] AS ok, 'top 4 ids [3, 1, 6, 4]' AS msg;\nSELECT (SELECT shard_tag FROM answer WHERE id=3) = 'b' AS ok, 'retains originating shard tag' AS msg;"
  },
  {
    "day": 50,
    "fallbackTitle": "Milestone 10 Capstone: Multi-Tenant Distributed Sharded Database & Real-Time Time-Series Partition Engine",
    "eTitle": "Milestone 10A: Multi-Tenant Partitioned Metric Table + Pruned Rollup",
    "eDesc": "Create partitioned table `tenant_metrics (tenant_id int NOT NULL, metric_ts date NOT NULL, val int NOT NULL) PARTITION BY RANGE (metric_ts);` with monthly partitions `tm_jan` (`[2026-01-01, 2026-02-01)`) and `tm_feb` (`[2026-02-01, 2026-03-01)`), local index `idx_tm_tenant ON tenant_metrics (tenant_id, metric_ts)`, insert rows across Jan/Feb, and `ANALYZE tenant_metrics;`.",
    "eStarter": "-- TODO: partitioned tenant_metrics + local index + seed rows + ANALYZE",
    "eHint": "CREATE TABLE tenant_metrics (tenant_id int NOT NULL, metric_ts date NOT NULL, val int NOT NULL) PARTITION BY RANGE (metric_ts);\nCREATE TABLE tm_jan PARTITION OF tenant_metrics FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');\nCREATE TABLE tm_feb PARTITION OF tenant_metrics FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');\nCREATE INDEX idx_tm_tenant ON tenant_metrics (tenant_id, metric_ts);\nINSERT INTO tenant_metrics VALUES (1,'2026-01-10',40),(1,'2026-02-15',60),(2,'2026-02-20',90);\nANALYZE tenant_metrics;",
    "eTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\n-- CHECKS --\nSELECT (SELECT count(*) FROM pg_inherits WHERE inhparent = 'tenant_metrics'::regclass) = 2 AS ok, '2 monthly partitions attached' AS msg;\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE tablename='tm_feb' AND indexdef ILIKE '%tenant_id%') AS ok, 'local partitioned index propagated to tm_feb' AS msg;\nSELECT explain_json($$SELECT SUM(val) FROM tenant_metrics WHERE metric_ts >= DATE '2026-02-01'$$) NOT LIKE '%tm_jan%' AS ok, 'tm_jan pruned for February query' AS msg;",
    "aTitle": "Milestone 10B: Atomic Cold-Partition Rollup & Purge Pipeline",
    "aDesc": "Move old cold events (`ts < DATE '2026-02-01'`) from `raw_events (id int, tenant_id int, ts date, units int)` into `daily_rollup (tenant_id int, day date, total_units int, PRIMARY KEY (tenant_id, day))` atomically in a single `WITH archived AS (DELETE ... RETURNING ...) INSERT ... ON CONFLICT DO UPDATE` statement, then run `ANALYZE daily_rollup;`.",
    "aStarter": "-- TODO: WITH archived AS (DELETE FROM raw_events ... RETURNING ...) INSERT INTO daily_rollup ... ON CONFLICT DO UPDATE\nANALYZE daily_rollup;",
    "aHint": "WITH archived AS (\n  DELETE FROM raw_events WHERE ts < DATE '2026-02-01' RETURNING tenant_id, ts, units\n)\nINSERT INTO daily_rollup (tenant_id, day, total_units)\nSELECT tenant_id, ts, SUM(units)::int FROM archived GROUP BY tenant_id, ts\nON CONFLICT (tenant_id, day) DO UPDATE SET total_units = daily_rollup.total_units + EXCLUDED.total_units;\nANALYZE daily_rollup;",
    "aTest": "CREATE TABLE raw_events (id int PRIMARY KEY, tenant_id int, ts date, units int);\nCREATE TABLE daily_rollup (tenant_id int, day date, total_units int, PRIMARY KEY (tenant_id, day));\nINSERT INTO daily_rollup VALUES (1, '2026-01-15', 10);\nINSERT INTO raw_events VALUES (1,1,'2026-01-15',25),(2,1,'2026-01-15',15),(3,2,'2026-01-20',100),(4,1,'2026-02-05',99);\n-- CHECKS --\nSELECT (SELECT total_units FROM daily_rollup WHERE tenant_id=1 AND day='2026-01-15') = 50 AS ok, 'existing rollup incremented 10+25+15=50' AS msg;\nSELECT (SELECT total_units FROM daily_rollup WHERE tenant_id=2 AND day='2026-01-20') = 100 AS ok, 'new tenant 2 day rolled up' AS msg;\nSELECT (SELECT count(*) FROM raw_events) = 1 AND EXISTS(SELECT 1 FROM raw_events WHERE id=4) AS ok, 'only hot Feb row remains in raw_events' AS msg;"
  },
  {
    "day": 51,
    "fallbackTitle": "Query Optimizer Cost Models: Random Page Cost vs Seq Page Cost & Cost Estimation Internals",
    "eTitle": "Extended Multi-Column Functional Dependency Statistics",
    "eDesc": "Table `geo_addresses (id int, city text, zip text)` exhibits strong `city -> zip` correlation.\nCreate extended statistics `st_city_zip` tracking `(dependencies)` on `city, zip` FROM `geo_addresses`, and run `ANALYZE geo_addresses;`.",
    "eStarter": "-- TODO: CREATE STATISTICS st_city_zip (dependencies) ON city, zip FROM geo_addresses;",
    "eHint": "CREATE STATISTICS st_city_zip (dependencies) ON city, zip FROM geo_addresses;\nANALYZE geo_addresses;",
    "eTest": "CREATE TABLE geo_addresses (id int PRIMARY KEY, city text, zip text); INSERT INTO geo_addresses SELECT g, CASE WHEN g % 2 = 0 THEN 'Austin' ELSE 'Boston' END, CASE WHEN g % 2 = 0 THEN '78701' ELSE '02101' END FROM generate_series(1, 500) g;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_statistic_ext WHERE stxname='st_city_zip') AS ok, 'extended statistics st_city_zip created' AS msg;\nSELECT EXISTS(SELECT 1 FROM pg_statistic_ext WHERE stxname='st_city_zip' AND 'f' = ANY(stxkind::text[])) AS ok, 'functional dependency kind enabled' AS msg;\nSELECT EXISTS(SELECT 1 FROM pg_statistic_ext_data d JOIN pg_statistic_ext s ON s.oid = d.stxoid WHERE s.stxname='st_city_zip') AS ok, 'ANALYZE populated dependency data' AS msg;",
    "aTitle": "I/O + CPU Cost Model Path Selection Query",
    "aDesc": "Table `access_paths (qid int, path_name text, pages int, random_pages int, rows_est int)` holds candidate plans (`seq_page_cost=1.0, random_page_cost=4.0, cpu_tuple_cost=0.01`).\nCompute each path `total_cost = ROUND((pages * 1.0 + random_pages * 4.0 + rows_est * 0.01)::numeric, 2)` and return the cheapest `qid, path_name, total_cost` per `qid`, ordered by `qid`.",
    "aStarter": "SELECT qid, path_name, 0.00 AS total_cost FROM access_paths ORDER BY qid;",
    "aHint": "WITH scored AS (\n  SELECT qid, path_name,\n    ROUND((pages * 1.0 + random_pages * 4.0 + rows_est * 0.01)::numeric, 2) AS total_cost\n  FROM access_paths\n)\nSELECT DISTINCT ON (qid) qid, path_name, total_cost FROM scored ORDER BY qid, total_cost ASC, path_name ASC;",
    "aTest": "CREATE TABLE access_paths (qid int, path_name text, pages int, random_pages int, rows_est int); INSERT INTO access_paths VALUES (1,'SeqScan',500,0,10000),(1,'IndexScan',5,80,100),(2,'SeqScan',500,0,10000),(2,'IndexScan',10,200,4000);\n-- CHECKS --\nSELECT (SELECT path_name FROM answer WHERE qid=1) = 'IndexScan' AND (SELECT total_cost FROM answer WHERE qid=1) = 326.00 AS ok, 'qid 1 picks IndexScan (326.00 < 600.00)' AS msg;\nSELECT (SELECT path_name FROM answer WHERE qid=2) = 'SeqScan' AND (SELECT total_cost FROM answer WHERE qid=2) = 600.00 AS ok, 'qid 2 picks SeqScan (600.00 < 850.00)' AS msg;\nSELECT (SELECT count(*) FROM answer) = 2 AS ok, '2 winner paths' AS msg;"
  },
  {
    "day": 52,
    "fallbackTitle": "Plan Invalidation & Generic vs Custom Plans: plan_cache_mode & Parameter Sniffing",
    "eTitle": "Key-Skew Share Diagnostic for plan_cache_mode Policy",
    "eDesc": "Table `tenant_orders (tenant_id int)` contains skewed row volumes.\nCompute each `tenant_id`'s percentage `pct` of total rows (`ROUND(count(*) * 100.0 / SUM(count(*)) OVER (), 2)`) and return `tenant_id, pct, CASE WHEN MAX(...) > 75 THEN 'force_custom_plan' ELSE 'auto' END AS policy`, ordered by `pct DESC`.",
    "eStarter": "SELECT tenant_id, 0.00 AS pct, 'auto' AS policy FROM tenant_orders GROUP BY tenant_id;",
    "eHint": "WITH counts AS (\n  SELECT tenant_id, count(*)::numeric AS cnt FROM tenant_orders GROUP BY tenant_id\n), shares AS (\n  SELECT tenant_id, ROUND(cnt * 100.0 / SUM(cnt) OVER (), 2) AS pct FROM counts\n)\nSELECT tenant_id, pct, CASE WHEN MAX(pct) OVER () > 75 THEN 'force_custom_plan' ELSE 'auto' END AS policy\nFROM shares ORDER BY pct DESC, tenant_id;",
    "eTest": "CREATE TABLE tenant_orders (tenant_id int); INSERT INTO tenant_orders SELECT CASE WHEN g <= 90 THEN 1 ELSE (g % 3) + 2 END FROM generate_series(1, 100) g;\n-- CHECKS --\nSELECT (SELECT tenant_id FROM answer LIMIT 1) = 1 AS ok, 'dominant whale tenant 1 first' AS msg;\nSELECT (SELECT pct FROM answer WHERE tenant_id=1) = 90.00 AS ok, 'tenant 1 holds 90.00% skew' AS msg;\nSELECT (SELECT bool_and(policy = 'force_custom_plan') FROM answer) AS ok, 'recommends force_custom_plan above 75%' AS msg;",
    "aTitle": "pg_stats MCF Parameter-Sniffing Sensitivity Detector",
    "aDesc": "Table `skew_demo (id int, tag text)` has heavily skewed `tag` distribution.\nRun `ANALYZE skew_demo;` then query `pg_stats` for `tablename='skew_demo' AND attname='tag'` extracting `most_common_vals::text AS mcv, ROUND((most_common_freqs[1])::numeric, 4) AS top_freq` into view `skew_report`.",
    "aStarter": "-- TODO: ANALYZE skew_demo; CREATE VIEW skew_report AS ... FROM pg_stats ...",
    "aHint": "ANALYZE skew_demo;\nCREATE VIEW skew_report AS\nSELECT attname, most_common_vals::text AS mcv, ROUND((most_common_freqs[1])::numeric, 4) AS top_freq\nFROM pg_stats\nWHERE tablename = 'skew_demo' AND attname = 'tag';",
    "aTest": "CREATE TABLE skew_demo (id int PRIMARY KEY, tag text); INSERT INTO skew_demo SELECT g, CASE WHEN g <= 180 THEN 'HOT' ELSE 'RARE_' || g END FROM generate_series(1, 200) g;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_views WHERE viewname='skew_report') AS ok, 'skew_report view exists' AS msg;\nSELECT (SELECT top_freq FROM skew_report) = 0.9000 AS ok, 'pg_stats recorded top MCV frequency 0.9000' AS msg;\nSELECT (SELECT mcv FROM skew_report) LIKE '%HOT%' AS ok, 'HOT flagged as top MCV' AS msg;"
  },
  {
    "day": 53,
    "fallbackTitle": "Custom Operator Classes & Index Access Methods: CREATE OPERATOR CLASS & GiST Penalty",
    "eTitle": "Immutable Reverse-Text Functional Index for Suffix LIKE Scans",
    "eDesc": "Table `domains (id int, host text)` needs fast domain-suffix searches (`host LIKE '%.edu'`).\nCreate an `IMMUTABLE` SQL function `rev_text(s text) RETURNS text` returning `reverse(s)`, then create B-Tree index `idx_domains_rev ON domains (rev_text(host) text_pattern_ops);` and run `ANALYZE domains;`.",
    "eStarter": "-- TODO: CREATE FUNCTION rev_text(s text) RETURNS text IMMUTABLE + CREATE INDEX idx_domains_rev",
    "eHint": "CREATE FUNCTION rev_text(s text) RETURNS text LANGUAGE sql IMMUTABLE STRICT AS $$ SELECT reverse(s) $$;\nCREATE INDEX idx_domains_rev ON domains (rev_text(host) text_pattern_ops);\nANALYZE domains;",
    "eTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE domains (id int PRIMARY KEY, host text); INSERT INTO domains SELECT g, 'host' || g || CASE WHEN g % 50 = 0 THEN '.edu' ELSE '.com' END FROM generate_series(1, 2000) g;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='idx_domains_rev' AND indexdef ILIKE '%rev_text(host)%') AS ok, 'reverse-text index exists' AS msg;\nSELECT (SELECT count(*) FROM domains WHERE rev_text(host) LIKE 'ude.%') = 40 AS ok, 'finds all 40 .edu domains' AS msg;\nSELECT explain_json($$SELECT host FROM domains WHERE rev_text(host) LIKE 'ude.%'$$) ~ '(Index Scan|Bitmap)' AS ok, 'suffix search uses idx_domains_rev' AS msg;",
    "aTitle": "Custom Composite Type, Comparator & B-Tree Ordering View",
    "aDesc": "Table `alerts (id int, tier text, score int)` ranks alerts (`CRIT` > `WARN` > `INFO`, then `score DESC`).\nCreate an `IMMUTABLE` SQL ranking function `alert_rank(t text) RETURNS int` (`CRIT`->3, `WARN`->2, `INFO`->1), index `idx_alerts_rank ON alerts (alert_rank(tier) DESC, score DESC);`, and view `alert_ranking AS SELECT id, tier, score FROM alerts ORDER BY alert_rank(tier) DESC, score DESC, id ASC;`.",
    "aStarter": "CREATE VIEW alert_ranking AS SELECT id, tier, score FROM alerts ORDER BY id;",
    "aHint": "CREATE FUNCTION alert_rank(t text) RETURNS int LANGUAGE sql IMMUTABLE STRICT AS $$ SELECT CASE t WHEN 'CRIT' THEN 3 WHEN 'WARN' THEN 2 ELSE 1 END $$;\nCREATE INDEX idx_alerts_rank ON alerts (alert_rank(tier) DESC, score DESC);\nCREATE VIEW alert_ranking AS SELECT id, tier, score FROM alerts ORDER BY alert_rank(tier) DESC, score DESC, id ASC;",
    "aTest": "CREATE TABLE alerts (id int PRIMARY KEY, tier text, score int); INSERT INTO alerts VALUES (1,'INFO',99),(2,'CRIT',40),(3,'WARN',80),(4,'CRIT',95);\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='idx_alerts_rank') AS ok, 'idx_alerts_rank created' AS msg;\nSELECT (SELECT array_agg(id) FROM alert_ranking) = ARRAY[4, 2, 3, 1] AS ok, 'custom priority ordering [4, 2, 3, 1]' AS msg;\nSELECT (SELECT provolatile FROM pg_proc WHERE proname='alert_rank') = 'i' AS ok, 'alert_rank marked IMMUTABLE' AS msg;"
  },
  {
    "day": 54,
    "fallbackTitle": "Just-In-Time (JIT) Compilation Internals: LLVM Code Generation & Inlining Thresholds",
    "eTitle": "JIT Over-Compilation Regression Detector",
    "eDesc": "Table `jit_traces (qid int, plan_cost numeric, exec_ms numeric, jit_ms numeric)` captures statement timings.\nIdentify OLTP queries hurt by JIT where `jit_ms > exec_ms * 0.4`, returning `qid, plan_cost, ROUND((jit_ms * 100.0 / exec_ms), 2) AS jit_pct, 'RAISE_THRESHOLD' AS action` ordered by `qid`.",
    "eStarter": "SELECT qid, plan_cost, 0.00 AS jit_pct, 'OK' AS action FROM jit_traces ORDER BY qid;",
    "eHint": "SELECT qid, plan_cost,\n  ROUND((jit_ms * 100.0 / exec_ms)::numeric, 2) AS jit_pct,\n  'RAISE_THRESHOLD' AS action\nFROM jit_traces\nWHERE jit_ms > exec_ms * 0.4\nORDER BY qid;",
    "eTest": "CREATE TABLE jit_traces (qid int, plan_cost numeric, exec_ms numeric, jit_ms numeric); INSERT INTO jit_traces VALUES (1,120000,15,9),(2,150000,500,12),(3,105000,8,5);\n-- CHECKS --\nSELECT (SELECT array_agg(qid ORDER BY qid) FROM answer) = ARRAY[1, 3] AS ok, 'detects short OLTP queries 1 and 3 penalized by JIT' AS msg;\nSELECT (SELECT jit_pct FROM answer WHERE qid=1) = 60.00 AS ok, 'qid 1 jit_pct = 60.00%' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE qid=2) AS ok, 'analytical qid 2 (2.4% JIT) excluded' AS msg;",
    "aTitle": "Single-Pass Branchless FILTER Aggregation Consolidation",
    "aDesc": "Table `orders_bi (region text, status text, amount int)` was previously scanned 3 separate times by scalar subqueries.\nCompute all KPIs in a SINGLE pass per `region` using `FILTER (WHERE ...)`: `region, COALESCE(SUM(amount) FILTER (WHERE status='PAID'), 0)::int AS paid_amt, count(*) FILTER (WHERE status='REFUND')::int AS refund_cnt, count(*)::int AS total_cnt` ordered by `region`.",
    "aStarter": "SELECT region, 0 AS paid_amt, 0 AS refund_cnt, count(*)::int AS total_cnt FROM orders_bi GROUP BY region ORDER BY region;",
    "aHint": "SELECT region,\n  COALESCE(SUM(amount) FILTER (WHERE status = 'PAID'), 0)::int AS paid_amt,\n  count(*) FILTER (WHERE status = 'REFUND')::int AS refund_cnt,\n  count(*)::int AS total_cnt\nFROM orders_bi\nGROUP BY region\nORDER BY region;",
    "aTest": "CREATE TABLE orders_bi (region text, status text, amount int); INSERT INTO orders_bi VALUES ('APAC','PAID',120),('APAC','PAID',80),('APAC','REFUND',50),('EU','REFUND',90);\n-- CHECKS --\nSELECT (SELECT paid_amt FROM answer WHERE region='APAC') = 200 AND (SELECT refund_cnt FROM answer WHERE region='APAC') = 1 AS ok, 'APAC paid=200 refunds=1' AS msg;\nSELECT (SELECT paid_amt FROM answer WHERE region='EU') = 0 AND (SELECT refund_cnt FROM answer WHERE region='EU') = 1 AS ok, 'EU paid=0 refunds=1' AS msg;\nSELECT (SELECT total_cnt FROM answer WHERE region='APAC') = 3 AS ok, 'APAC total=3' AS msg;"
  },
  {
    "day": 55,
    "fallbackTitle": "Milestone 11 Capstone: Autonomous Query Performance Tuner & JIT Accelerated Analytical Engine",
    "eTitle": "Milestone 11A: Autonomous Missing-Index DDL Advisor",
    "eDesc": "Table `slow_queries (tbl text, filter_col text, total_cost numeric)` logs high-cost sequential filters; `pg_indexes` lists existing indexes.\nCreate view `index_advisor` returning missing indexes where `total_cost > 5000` and NO existing `pg_indexes` entry on `tablename = tbl` references `filter_col`: `tbl, filter_col, 'CREATE INDEX idx_' || tbl || '_' || filter_col || ' ON ' || tbl || ' (' || filter_col || ');' AS ddl` ordered by `tbl, filter_col`.",
    "eStarter": "CREATE VIEW index_advisor AS SELECT tbl, filter_col, '' AS ddl FROM slow_queries ORDER BY tbl;",
    "eHint": "CREATE VIEW index_advisor AS\nSELECT s.tbl, s.filter_col,\n  'CREATE INDEX idx_' || s.tbl || '_' || s.filter_col || ' ON ' || s.tbl || ' (' || s.filter_col || ');' AS ddl\nFROM slow_queries s\nWHERE s.total_cost > 5000\n  AND NOT EXISTS (\n    SELECT 1 FROM pg_indexes i WHERE i.tablename = s.tbl AND i.indexdef ILIKE '%(' || s.filter_col || '%'\n  )\nORDER BY s.tbl, s.filter_col;",
    "eTest": "CREATE TABLE invoices (id int, cust_id int, status text); CREATE INDEX idx_inv_status ON invoices (status);\nCREATE TABLE sessions (id int, token text);\nCREATE TABLE slow_queries (tbl text, filter_col text, total_cost numeric); INSERT INTO slow_queries VALUES ('invoices','cust_id',9500),('invoices','status',8200),('sessions','token',12000),('sessions','id',1200);\n-- CHECKS --\nSELECT (SELECT array_agg(filter_col ORDER BY filter_col) FROM index_advisor) = ARRAY['cust_id', 'token'] AS ok, 'recommends only unindexed high-cost predicates' AS msg;\nSELECT (SELECT ddl FROM index_advisor WHERE tbl='invoices') = 'CREATE INDEX idx_invoices_cust_id ON invoices (cust_id);' AS ok, 'valid DDL emitted for invoices.cust_id' AS msg;\nSELECT (SELECT count(*) FROM index_advisor) = 2 AS ok, 'excludes already-indexed status and low-cost id' AS msg;",
    "aTitle": "Milestone 11B: LATERAL Top-1 Per-Account Report + Covering Index",
    "aDesc": "Tables `cust (id int PRIMARY KEY, name text)` and `payments (id int, cust_id int, paid_at int, amt int)` have 3,000 payments.\nCreate covering index `idx_pay_cust_dt ON payments (cust_id, paid_at DESC) INCLUDE (amt)` and create view `latest_cust_payment` using `CROSS JOIN LATERAL` returning `c.id, c.name, p.paid_at, p.amt` for every customer's single latest payment (ordered by `c.id`).",
    "aStarter": "-- TODO: create index idx_pay_cust_dt and view latest_cust_payment using LATERAL",
    "aHint": "CREATE INDEX idx_pay_cust_dt ON payments (cust_id, paid_at DESC) INCLUDE (amt);\nANALYZE payments;\nCREATE VIEW latest_cust_payment AS\nSELECT c.id, c.name, p.paid_at, p.amt\nFROM cust c\nCROSS JOIN LATERAL (\n  SELECT paid_at, amt FROM payments WHERE cust_id = c.id ORDER BY paid_at DESC LIMIT 1\n) p\nORDER BY c.id;",
    "aTest": "CREATE OR REPLACE FUNCTION explain_json(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE j json;\nBEGIN\n  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;\n  RETURN j::text;\nEND $$;\nCREATE TABLE cust (id int PRIMARY KEY, name text); INSERT INTO cust VALUES (1,'Ada'),(2,'Grace');\nCREATE TABLE payments (id int PRIMARY KEY, cust_id int, paid_at int, amt int);\nINSERT INTO payments SELECT g, (g % 2) + 1, g * 10, g FROM generate_series(1, 3000) g;\n-- CHECKS --\nSELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='idx_pay_cust_dt' AND indexdef ILIKE '%INCLUDE%') AS ok, 'covering index idx_pay_cust_dt created' AS msg;\nSELECT (SELECT amt FROM latest_cust_payment WHERE id=1) = 3000 AND (SELECT amt FROM latest_cust_payment WHERE id=2) = 2999 AS ok, 'returns latest payment per customer (Ada=3000, Grace=2999)' AS msg;\nSELECT explain_json('SELECT paid_at, amt FROM payments WHERE cust_id = 1 ORDER BY paid_at DESC LIMIT 1') ~ '(Index Only Scan|Index Scan)' AS ok, 'LATERAL inner probe hits index scan' AS msg;"
  },
  {
    "day": 56,
    "fallbackTitle": "Analytical Window Functions: Framing Internals & HyperLogLog Cardinality",
    "eTitle": "Gap-and-Island User Sessionization Window Pipeline",
    "eDesc": "Table `clicks (user_id int, ts_min int)` stores click timestamps in minutes.\nAssign `session_num` per `user_id` starting at `1`, incrementing by `1` whenever gap since previous click (`ts_min - LAG(ts_min)`) > `30` minutes, and aggregate `user_id, session_num, MIN(ts_min) AS start_min, MAX(ts_min) AS end_min, count(*)::int AS events` ordered by `user_id, session_num`.",
    "eStarter": "SELECT user_id, 1 AS session_num, MIN(ts_min) AS start_min, MAX(ts_min) AS end_min, count(*)::int AS events FROM clicks GROUP BY user_id;",
    "eHint": "WITH gaps AS (\n  SELECT user_id, ts_min,\n    CASE WHEN LAG(ts_min) OVER (PARTITION BY user_id ORDER BY ts_min) IS NULL OR ts_min - LAG(ts_min) OVER (PARTITION BY user_id ORDER BY ts_min) > 30 THEN 1 ELSE 0 END AS is_new\n  FROM clicks\n), tagged AS (\n  SELECT user_id, ts_min, SUM(is_new) OVER (PARTITION BY user_id ORDER BY ts_min)::int AS session_num FROM gaps\n)\nSELECT user_id, session_num, MIN(ts_min) AS start_min, MAX(ts_min) AS end_min, count(*)::int AS events\nFROM tagged GROUP BY user_id, session_num ORDER BY user_id, session_num;",
    "eTest": "CREATE TABLE clicks (user_id int, ts_min int); INSERT INTO clicks VALUES (1,10),(1,25),(1,80),(1,95),(2,5);\n-- CHECKS --\nSELECT (SELECT count(*) FROM answer) = 3 AS ok, '3 sessions across 2 users' AS msg;\nSELECT (SELECT events FROM answer WHERE user_id=1 AND session_num=1) = 2 AND (SELECT end_min FROM answer WHERE user_id=1 AND session_num=2) = 95 AS ok, 'user 1 split at gap 80-25=55 > 30' AS msg;\nSELECT (SELECT session_num FROM answer WHERE user_id=2) = 1 AS ok, 'user 2 has 1 session' AS msg;",
    "aTitle": "HyperLogLog Harmonic-Mean Distinct Cardinality Estimator",
    "aDesc": "Table `hll_registers (bucket_id int, max_rho int)` holds `m = 4` merged HLL register values (`alpha_4 = 0.532`).\nWrite a single-row SQL query returning `ROUND((0.532 * 4 * 4 / SUM(POWER(2.0, -max_rho)))::numeric, 2) AS est_cardinality`.",
    "aStarter": "SELECT 0.00 AS est_cardinality;",
    "aHint": "SELECT ROUND((0.532 * 4 * 4 / SUM(POWER(2.0, -max_rho)))::numeric, 2) AS est_cardinality\nFROM hll_registers;",
    "aTest": "CREATE TABLE hll_registers (bucket_id int PRIMARY KEY, max_rho int); INSERT INTO hll_registers VALUES (0, 2), (1, 3), (2, 2), (3, 1);\n-- CHECKS --\nSELECT (SELECT est_cardinality FROM answer) = 7.57 AS ok, 'harmonic mean HLL estimate = 7.57' AS msg;\nSELECT (SELECT count(*) FROM answer) = 1 AS ok, 'single scalar estimate returned' AS msg;\nSELECT (SELECT est_cardinality > 0 FROM answer) AS ok, 'positive cardinality estimate' AS msg;"
  },
  {
    "day": 57,
    "fallbackTitle": "Temporal Graph Traversal, Recursive Hierarchical SQL Analytics & Cycle Detection Algorithms",
    "eTitle": "Cycle-Safe Recursive Service Dependency Graph Walk",
    "eDesc": "Table `deps (src text, dst text)` maps microservice dependencies (containing cycles).\nTrace all reachable downstream targets starting from `'gateway'` using `WITH RECURSIVE ... CYCLE dst SET is_cycle USING path`, returning distinct non-cycle reachable `node`s plus their minimum `depth` (`1`-indexed from `'gateway'`), ordered by `depth, node`.",
    "eStarter": "SELECT dst AS node, 1 AS depth FROM deps WHERE src = 'gateway';",
    "eHint": "WITH RECURSIVE walk(dst, depth) AS (\n  SELECT dst, 1 FROM deps WHERE src = 'gateway'\n  UNION ALL\n  SELECT d.dst, w.depth + 1 FROM deps d JOIN walk w ON d.src = w.dst\n) CYCLE dst SET is_cycle USING path\nSELECT dst AS node, MIN(depth)::int AS depth\nFROM walk\nWHERE NOT is_cycle\nGROUP BY dst\nORDER BY depth, node;",
    "eTest": "CREATE TABLE deps (src text, dst text); INSERT INTO deps VALUES ('gateway','auth'),('auth','db'),('db','auth'),('gateway','pay'),('pay','ledger'),('orphan','z');\n-- CHECKS --\nSELECT (SELECT array_agg(node ORDER BY depth, node) FROM answer) = ARRAY['auth','pay','db','ledger'] AS ok, 'reachable nodes [auth, pay, db, ledger] without infinite loop' AS msg;\nSELECT (SELECT depth FROM answer WHERE node='ledger') = 2 AS ok, 'ledger at depth 2' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE node IN ('orphan','z')) AS ok, 'unreachable subgraph excluded' AS msg;",
    "aTitle": "Time-Respecting Shortest-Cost Temporal Path Traversal",
    "aDesc": "Table `flights (orig text, dest text, depart_hr int, arrive_hr int, cost int)` stores valid schedules (`layover >= 0`, i.e., `f.depart_hr >= prev_arrive`).\nFind cheapest valid route from `'DEL'` to `'SFO'` in `WITH RECURSIVE` returning `MIN(total_cost)::int AS min_cost`.",
    "aStarter": "SELECT 0 AS min_cost;",
    "aHint": "WITH RECURSIVE trips(cur, arrive_hr, total_cost, visited) AS (\n  SELECT dest, arrive_hr, cost, ARRAY[orig, dest] FROM flights WHERE orig = 'DEL'\n  UNION ALL\n  SELECT f.dest, f.arrive_hr, t.total_cost + f.cost, t.visited || f.dest\n  FROM flights f JOIN trips t ON f.orig = t.cur\n  WHERE f.depart_hr >= t.arrive_hr AND NOT (f.dest = ANY(t.visited))\n)\nSELECT MIN(total_cost)::int AS min_cost FROM trips WHERE cur = 'SFO';",
    "aTest": "CREATE TABLE flights (orig text, dest text, depart_hr int, arrive_hr int, cost int); INSERT INTO flights VALUES ('DEL','DXB',1,5,200),('DXB','SFO',4,14,100),('DXB','SFO',7,18,500),('DEL','LHR',2,10,300),('LHR','SFO',11,20,350);\n-- CHECKS --\nSELECT (SELECT min_cost FROM answer) = 650 AS ok, 'cheapest time-valid DEL->LHR->SFO = 650 (invalid 4<5 DXB connection rejected)' AS msg;\nSELECT (SELECT count(*) FROM answer) = 1 AS ok, 'single scalar min_cost row' AS msg;\nSELECT (SELECT min_cost > 300 FROM answer) AS ok, 'cannot take impossible earlier flight' AS msg;"
  },
  {
    "day": 58,
    "fallbackTitle": "Enterprise Security Architecture: Row-Level Security (RLS), Column-Level Encryption & Fine-Grained Audit Logging",
    "eTitle": "Multi-Tenant Row-Level Security + Tax-ID Redacted View",
    "eDesc": "Table `invoices (id int, tenant_id int, tax_id text, amount int)` holds multi-tenant billing records.\n1) Enable RLS (`ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;`) and create permissive policy `tenant_iso ON invoices USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::int);`.\n2) Create view `invoices_masked AS SELECT id, tenant_id, '***-' || RIGHT(tax_id, 4) AS masked_tax, amount FROM invoices;`.",
    "eStarter": "-- TODO: ENABLE ROW LEVEL SECURITY, CREATE POLICY tenant_iso, CREATE VIEW invoices_masked",
    "eHint": "ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;\nCREATE POLICY tenant_iso ON invoices USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::int);\nCREATE VIEW invoices_masked AS SELECT id, tenant_id, '***-' || RIGHT(tax_id, 4) AS masked_tax, amount FROM invoices;",
    "eTest": "CREATE TABLE invoices (id int PRIMARY KEY, tenant_id int, tax_id text, amount int); INSERT INTO invoices VALUES (1,10,'999881234',500),(2,20,'777665678',900);\n-- CHECKS --\nSELECT (SELECT relrowsecurity FROM pg_class WHERE relname='invoices') AS ok, 'RLS enabled on invoices' AS msg;\nSELECT EXISTS(SELECT 1 FROM pg_policies WHERE tablename='invoices' AND policyname='tenant_iso') AS ok, 'tenant_iso policy exists' AS msg;\nSELECT (SELECT masked_tax FROM invoices_masked WHERE id=1) = '***-1234' AS ok, 'invoices_masked redacts tax_id cleanly' AS msg;",
    "aTitle": "Immutable Trigger-Based Security Audit Trail",
    "aDesc": "Table `accounts_sec (id int PRIMARY KEY, role text)` and `sec_audit_log (op text, before_data jsonb, after_data jsonb)` exist.\nWrite trigger function `log_sec_change() RETURNS trigger LANGUAGE plpgsql` inserting `(TG_OP, to_jsonb(OLD), to_jsonb(NEW))` into `sec_audit_log`, attach `AFTER INSERT OR UPDATE OR DELETE` trigger `trg_sec_audit ON accounts_sec`, then update `id=1` role to `'ADMIN'`.",
    "aStarter": "-- TODO: CREATE FUNCTION log_sec_change + CREATE TRIGGER trg_sec_audit + UPDATE accounts_sec",
    "aHint": "CREATE FUNCTION log_sec_change() RETURNS trigger LANGUAGE plpgsql AS $$\nBEGIN\n  INSERT INTO sec_audit_log (op, before_data, after_data) VALUES (TG_OP, to_jsonb(OLD), to_jsonb(NEW));\n  RETURN COALESCE(NEW, OLD);\nEND $$;\nCREATE TRIGGER trg_sec_audit AFTER INSERT OR UPDATE OR DELETE ON accounts_sec FOR EACH ROW EXECUTE FUNCTION log_sec_change();\nUPDATE accounts_sec SET role = 'ADMIN' WHERE id = 1;",
    "aTest": "CREATE TABLE accounts_sec (id int PRIMARY KEY, role text); CREATE TABLE sec_audit_log (op text, before_data jsonb, after_data jsonb); INSERT INTO accounts_sec VALUES (1, 'USER');\n-- CHECKS --\nSELECT (SELECT count(*) FROM sec_audit_log) = 1 AS ok, 'audit row written' AS msg;\nSELECT (SELECT before_data->>'role' FROM sec_audit_log LIMIT 1) = 'USER' AS ok, 'captured OLD role USER' AS msg;\nSELECT (SELECT after_data->>'role' FROM sec_audit_log LIMIT 1) = 'ADMIN' AND (SELECT op FROM sec_audit_log LIMIT 1) = 'UPDATE' AS ok, 'captured UPDATE to ADMIN' AS msg;"
  },
  {
    "day": 59,
    "fallbackTitle": "Change Data Capture (CDC), Logical Replication Internals & Real-Time Event Streaming",
    "eTitle": "Transactional Outbox Trigger Writing JSONB Domain Events",
    "eDesc": "Tables `orders_tx (id int PRIMARY KEY, state text)` and `outbox_events (id serial PRIMARY KEY, event_type text, payload jsonb)` exist.\nCreate trigger function `emit_order_outbox() RETURNS trigger` + `AFTER INSERT OR UPDATE` trigger `trg_orders_outbox` setting `event_type = CASE WHEN TG_OP = 'INSERT' THEN 'OrderCreated' ELSE 'OrderUpdated' END` and `payload = to_jsonb(NEW)`, then insert `(10, 'PAID')` and update `id=10` to `'SHIPPED'`.",
    "eStarter": "-- TODO: trigger emit_order_outbox + INSERT + UPDATE on orders_tx",
    "eHint": "CREATE FUNCTION emit_order_outbox() RETURNS trigger LANGUAGE plpgsql AS $$\nBEGIN\n  INSERT INTO outbox_events (event_type, payload) VALUES (CASE WHEN TG_OP = 'INSERT' THEN 'OrderCreated' ELSE 'OrderUpdated' END, to_jsonb(NEW));\n  RETURN NEW;\nEND $$;\nCREATE TRIGGER trg_orders_outbox AFTER INSERT OR UPDATE ON orders_tx FOR EACH ROW EXECUTE FUNCTION emit_order_outbox();\nINSERT INTO orders_tx VALUES (10, 'PAID');\nUPDATE orders_tx SET state = 'SHIPPED' WHERE id = 10;",
    "eTest": "CREATE TABLE orders_tx (id int PRIMARY KEY, state text); CREATE TABLE outbox_events (id serial PRIMARY KEY, event_type text, payload jsonb);\n-- CHECKS --\nSELECT (SELECT count(*) FROM outbox_events) = 2 AS ok, '2 outbox events emitted atomically' AS msg;\nSELECT (SELECT event_type FROM outbox_events WHERE id=1) = 'OrderCreated' AND (SELECT payload->>'state' FROM outbox_events WHERE id=1) = 'PAID' AS ok, 'OrderCreated payload matches INSERT' AS msg;\nSELECT (SELECT event_type FROM outbox_events WHERE id=2) = 'OrderUpdated' AND (SELECT payload->>'state' FROM outbox_events WHERE id=2) = 'SHIPPED' AS ok, 'OrderUpdated payload matches UPDATE' AS msg;",
    "aTitle": "Exactly-Once Idempotent CDC Consumer Inbox Projection",
    "aDesc": "Incoming `cdc_inbox (event_id text, acct_id int, delta int)` contains duplicate redeliveries; `processed_events (event_id text PRIMARY KEY)` tracks applied IDs and `balances (acct_id int PRIMARY KEY, bal int)` holds live balances.\nWrite a CTE chain inserting distinct `event_id`s into `processed_events ON CONFLICT DO NOTHING RETURNING event_id` and applying ONLY those newly-inserted deltas to `balances`, then run `ANALYZE balances;`!",
    "aStarter": "-- TODO: idempotent CTE inserting processed_events ON CONFLICT DO NOTHING then updating balances\nANALYZE balances;",
    "aHint": "WITH uniq AS (\n  SELECT DISTINCT ON (event_id) event_id, acct_id, delta FROM cdc_inbox\n), newly AS (\n  INSERT INTO processed_events (event_id) SELECT event_id FROM uniq ON CONFLICT DO NOTHING RETURNING event_id\n), to_apply AS (\n  SELECT u.acct_id, SUM(u.delta)::int AS net FROM uniq u JOIN newly n ON n.event_id = u.event_id GROUP BY u.acct_id\n)\nUPDATE balances b SET bal = b.bal + a.net FROM to_apply a WHERE b.acct_id = a.acct_id;\nANALYZE balances;",
    "aTest": "CREATE TABLE cdc_inbox (event_id text, acct_id int, delta int);\nCREATE TABLE processed_events (event_id text PRIMARY KEY);\nCREATE TABLE balances (acct_id int PRIMARY KEY, bal int);\nINSERT INTO processed_events VALUES ('e1');\nINSERT INTO balances VALUES (1, 100), (2, 50);\nINSERT INTO cdc_inbox VALUES ('e1',1,500),('e2',1,25),('e2',1,25),('e3',2,-10);\n-- CHECKS --\nSELECT (SELECT bal FROM balances WHERE acct_id=1) = 125 AS ok, 'acct 1 ignored duplicate e1 and duplicate e2 delivery (100+25=125)' AS msg;\nSELECT (SELECT bal FROM balances WHERE acct_id=2) = 40 AS ok, 'acct 2 applied e3 (-10 => 40)' AS msg;\nSELECT (SELECT count(*) FROM processed_events) = 3 AS ok, 'processed_events holds e1, e2, e3' AS msg;"
  },
  {
    "day": 60,
    "fallbackTitle": "Milestone 12 Capstone: Planetary-Scale Enterprise SQL Career OS: Financial Ledger, Graph Analytics & Hybrid Vector Engine",
    "eTitle": "Milestone 12A: Double-Entry Financial Ledger Balance Proof + Trial Balance",
    "eDesc": "Table `journal_lines (journal_id int, acct text, side text, cents int)` stores ledger postings (`side` in `DR`/`CR`).\n1) Create view `unbalanced_journals AS SELECT journal_id FROM journal_lines GROUP BY journal_id HAVING COALESCE(SUM(cents) FILTER (WHERE side='DR'),0) <> COALESCE(SUM(cents) FILTER (WHERE side='CR'),0);`.\n2) Create view `trial_balance` returning balanced accounts (`acct, (COALESCE(SUM(cents) FILTER (WHERE side='DR'),0) - COALESCE(SUM(cents) FILTER (WHERE side='CR'),0))::int AS net_dr_cents`) excluding any `journal_id` in `unbalanced_journals`, ordered by `acct`.",
    "eStarter": "-- TODO: CREATE VIEW unbalanced_journals + CREATE VIEW trial_balance",
    "eHint": "CREATE VIEW unbalanced_journals AS\nSELECT journal_id FROM journal_lines GROUP BY journal_id\nHAVING COALESCE(SUM(cents) FILTER (WHERE side='DR'), 0) <> COALESCE(SUM(cents) FILTER (WHERE side='CR'), 0);\nCREATE VIEW trial_balance AS\nSELECT acct,\n  (COALESCE(SUM(cents) FILTER (WHERE side='DR'), 0) - COALESCE(SUM(cents) FILTER (WHERE side='CR'), 0))::int AS net_dr_cents\nFROM journal_lines\nWHERE journal_id NOT IN (SELECT journal_id FROM unbalanced_journals)\nGROUP BY acct\nORDER BY acct;",
    "eTest": "CREATE TABLE journal_lines (journal_id int, acct text, side text, cents int); INSERT INTO journal_lines VALUES (1,'cash','DR',1000),(1,'rev','CR',1000),(2,'cash','DR',500),(2,'ar','CR',500),(3,'cash','DR',999);\n-- CHECKS --\nSELECT (SELECT array_agg(journal_id) FROM unbalanced_journals) = ARRAY[3] AS ok, 'unbalanced journal 3 isolated' AS msg;\nSELECT (SELECT SUM(net_dr_cents) FROM trial_balance) = 0 AS ok, 'valid double-entry trial balance nets strictly to 0' AS msg;\nSELECT (SELECT net_dr_cents FROM trial_balance WHERE acct='cash') = 1500 AND (SELECT net_dr_cents FROM trial_balance WHERE acct='rev') = -1000 AS ok, 'cash=+1500, rev=-1000' AS msg;",
    "aTitle": "Milestone 12B: Pure-SQL Hybrid Cosine Vector + Metadata Retriever",
    "aDesc": "Table `doc_vecs (doc_id text PRIMARY KEY, category text, emb float8[])` and query vector table `q_vec (emb float8[])` hold normalized 3D embeddings.\nUse `UNNEST(d.emb) WITH ORDINALITY` joined to `UNNEST(q.emb) WITH ORDINALITY` on ordinality position to compute cosine/dot similarity (`ROUND(SUM(dv * qv)::numeric, 4) AS sim`) for `d.category = 'eng'`, returning top 2 `doc_id, sim` ordered by `sim DESC, doc_id ASC`.",
    "aStarter": "SELECT doc_id, 0.0000 AS sim FROM doc_vecs LIMIT 2;",
    "aHint": "SELECT d.doc_id,\n  ROUND(SUM(dv.val * qv.val)::numeric, 4) AS sim\nFROM doc_vecs d\nCROSS JOIN q_vec q\nCROSS JOIN LATERAL UNNEST(d.emb) WITH ORDINALITY AS dv(val, idx)\nJOIN LATERAL UNNEST(q.emb) WITH ORDINALITY AS qv(val, idx) ON qv.idx = dv.idx\nWHERE d.category = 'eng'\nGROUP BY d.doc_id\nORDER BY sim DESC, d.doc_id ASC\nLIMIT 2;",
    "aTest": "CREATE TABLE doc_vecs (doc_id text PRIMARY KEY, category text, emb float8[]); CREATE TABLE q_vec (emb float8[]); INSERT INTO q_vec VALUES (ARRAY[0.8, 0.6, 0.0]); INSERT INTO doc_vecs VALUES ('d1','eng',ARRAY[0.8,0.6,0.0]),('d2','mkt',ARRAY[1.0,0.0,0.0]),('d3','eng',ARRAY[0.6,0.8,0.0]),('d4','eng',ARRAY[0.0,0.0,1.0]);\n-- CHECKS --\nSELECT (SELECT array_agg(doc_id ORDER BY sim DESC) FROM answer) = ARRAY['d1', 'd3'] AS ok, 'returns top-2 eng docs [d1, d3]' AS msg;\nSELECT (SELECT sim FROM answer WHERE doc_id='d1') = 1.0000 AND (SELECT sim FROM answer WHERE doc_id='d3') = 0.9600 AS ok, 'exact dot similarities d1=1.0000, d3=0.9600' AS msg;\nSELECT NOT EXISTS(SELECT 1 FROM answer WHERE doc_id='d2') AS ok, 'metadata category filter excluded mkt doc' AS msg;"
  }
];

const indexByDay = new Map((MONTH2_LESSON_INDEX['sql-mastery'] || []).map((entry) => [entry.day, entry]));

export const DATABASE_MONTH2_CONFIGS: DayConfig[] = RAW_SQL_M2_DAY_TASKS.map((t) => {
  const indexed = indexByDay.get(t.day);
  return {
    day: t.day,
    title: indexed?.title || t.fallbackTitle,
    desc: indexed?.goal || `${t.fallbackTitle} — hands-on PostgreSQL architecture labs.`,
    syllabus: indexed?.summary?.length ? indexed.summary : [t.eTitle, t.aTitle],
    eLanguage: 'sql',
    aLanguage: 'sql',
    eTitle: t.eTitle,
    eDesc: t.eDesc,
    eStarter: t.eStarter,
    eHint: t.eHint,
    eTest: t.eTest,
    aTitle: t.aTitle,
    aDesc: t.aDesc,
    aStarter: t.aStarter,
    aHint: t.aHint,
    aTest: t.aTest,
  };
});

export const DATABASE_MONTH2_QUESTS: CourseQuest[] = DATABASE_MONTH2_CONFIGS.flatMap((cfg) =>
  buildEnrichedDayQuests('sql-mastery', cfg.day!, cfg)
);
