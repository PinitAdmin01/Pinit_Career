# Day 14: Data Architecture for AI: Modern Data Lakehouse, Delta Lake, ACID on Object Storage & DQI >= 98.0%
import json, sys

part1_say = [
    "Welcome to Day 14 of AI & Digital Transformation for Business. Today, we investigate the foundational data engineering bedrock powering all modern enterprise artificial intelligence and analytics: Enterprise Data Architecture, Modern Data Lakehouses, Delta Lake, Apache Iceberg, and ACID Transactions on Object Storage.",
    "For decades, enterprise data architectures were fundamentally fractured between two incompatible paradigms: Enterprise Data Warehouses (EDWs) and Raw Data Lakes. Data Warehouses (such as traditional relational database appliances) offered blazing fast SQL query performance, strict schema enforcement, and robust ACID transaction guarantees; however, they were prohibitively expensive, scaled poorly to petabyte volumes, and could not store unstructured data such as audio, video, or natural language documents.",
    "Conversely, first-generation Data Lakes (built on Apache Hadoop HDFS or cloud object storage such as AWS S3, Google Cloud Storage, or Azure Data Lake Storage) successfully stored massive volumes of unstructured and semi-structured data at low commodity cost. However, they lacked transaction isolation, leading to frequent data corruption, dirty reads during concurrent streaming writes, and slow directory partition scans.",
    "The Modern Data Lakehouse architectural paradigm unifies the best capabilities of both worlds: implementing an open storage metadata and transaction layer (such as Delta Lake or Apache Iceberg) directly on top of scalable cloud object storage. By maintaining a centralized, serialized ACID transaction log, the lakehouse brings snapshot isolation, schema evolution, and time-travel rollbacks to raw object storage.",
    "For enterprise Chief Data Officers (CDOs) and AI architects, the lakehouse serves as the single source of truth for both operational business intelligence dashboards and distributed machine learning model feature stores, eliminating fragile, duplicate ETL pipelines.",
    "In modern enterprise information systems, implementing a lakehouse architecture requires strict adherence to the Medallion Data Architecture (Bronze, Silver, and Gold tiers). In the Bronze raw ingestion tier, multi-source transactional feeds, ERP change data capture (CDC) streams, IoT sensor payloads, and web interaction logs are ingested in append-only mode, preserving complete historical fidelity with zero schema validation overhead. In the Silver cleaned and enriched tier, streaming and micro-batch pipelines apply deduplication algorithms, foreign key referential integrity checks, type casting, and schema enforcement, resolving dirty data anomalies before analytical consumption. In the Gold business-level aggregate tier, data engineers project optimized dimensional star schemas, feature store tables, and aggregated KPI metrics tailored for low-latency BI dashboards and downstream predictive machine learning models. By enforcing clear boundaries across the Medallion tiers, data teams isolate ingestion failures from executive decision systems, ensuring end-to-end data lineage and auditable compliance under SOX, GDPR, and Basel III frameworks.",
    "Furthermore, modern enterprise data governance mandates the implementation of automated Data Quality Index (DQI) telemetry across all streaming and batch lakehouse partitions. In production enterprise environments, data corruption does not occur as catastrophic system crashes; rather, it manifests as insidious silent degradation: upstream schema drift, unannounced API payload changes, null value inflation, or distribution shifts in critical financial metrics. To combat this, enterprise data platforms deploy automated circuit breakers that evaluate five foundational quality dimensions: completeness, validity, uniqueness, consistency, and freshness. If an incoming Silver-tier partition exhibits a Data Quality Index below the enterprise threshold of 98.0%, the ingestion engine automatically halts downstream Gold-tier feature store materialization, quarantine-tagging the contaminated batch and triggering instant escalation alerts to the Data Engineering Operations desk. This automated gate prevents contaminated data from polluting operational enterprise models and distorting executive financial disclosures.",
    "To achieve enterprise-grade reliability and regulatory auditability, modern lakehouses leverage ACID transactional semantics on cloud object storage through two-phase commit protocols and multi-version concurrency control (MVCC). When multiple distributed Spark or Trino worker clusters concurrently write to a Delta Lake or Apache Iceberg table, the transaction coordinator employs optimistic concurrency control, checking the serialized commit log for overlapping file modifications. If a write collision occurs, the engine automatically resolves the conflict or re-executes the transaction without corrupting existing parquet files. Furthermore, by retaining historic parquet snapshots alongside the transaction delta log, the lakehouse provides native Time-Travel capabilities. Auditors and forensic data accountants can query the exact state of corporate financial ledger tables at any historical timestamp, proving regulatory compliance and reconstructing past transactional states with mathematical certainty.",
    "Finally, enterprise leadership must recognize that data architecture is the ultimate determinant of enterprise AI velocity. An organization can procure the most advanced foundation models, but if its underlying data lakehouse suffers from schema fragmentation, stale partitions, and undetected null inflation, the resulting AI applications will hallucinate, misprice financial assets, and make defective operational recommendations. Conversely, enterprises that construct robust Medallion architectures, maintain Data Quality Indices exceeding 98.0%, and govern object storage via open ACID transaction protocols unlock unprecedented analytical agility. They transition from reactive, month-end batch reporting to real-time predictive enterprise operations, empowering autonomous AI agents to make high-stakes commercial decisions with verified data integrity."
]

part1_code = """# Simulation: Modern Data Lakehouse - Medallion Architecture (Bronze -> Silver -> Gold)
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class RawEventPayload:
    event_id: str
    customer_id: str
    raw_amount: str
    timestamp: str

class MedallionLakehousePipeline:
    def __init__(self):
        self.bronze_storage: List[dict] = []
        self.silver_storage: List[dict] = []
        self.gold_feature_store: Dict[str, dict] = {}

    def ingest_bronze(self, raw_events: List[RawEventPayload]):
        # Bronze: Raw append-only capture preserving source fidelity
        for ev in raw_events:
            self.bronze_storage.append({
                "event_id": ev.event_id,
                "customer_id": ev.customer_id,
                "raw_amount": ev.raw_amount,
                "ingest_timestamp": ev.timestamp,
                "tier": "BRONZE_RAW"
            })

    def process_silver(self):
        # Silver: Cleansed, validated, typed, and deduplicated
        seen_ids = set()
        for rec in self.bronze_storage:
            if rec["event_id"] in seen_ids:
                continue
            seen_ids.add(rec["event_id"])
            try:
                amt = float(rec["raw_amount"].replace("$", "").replace(",", ""))
                self.silver_storage.append({
                    "event_id": rec["event_id"],
                    "customer_id": rec["customer_id"],
                    "clean_amount_usd": amt,
                    "tier": "SILVER_CLEANSED"
                })
            except ValueError:
                continue

    def materialize_gold(self):
        # Gold: Aggregated business metrics & AI feature store
        for rec in self.silver_storage:
            cid = rec["customer_id"]
            if cid not in self.gold_feature_store:
                self.gold_feature_store[cid] = {"total_spend_usd": 0.0, "transaction_count": 0}
            self.gold_feature_store[cid]["total_spend_usd"] += rec["clean_amount_usd"]
            self.gold_feature_store[cid]["transaction_count"] += 1

    def run_pipeline(self, events: List[RawEventPayload]) -> dict:
        self.ingest_bronze(events)
        self.process_silver()
        self.materialize_gold()
        return {
            "Bronze_Record_Count": len(self.bronze_storage),
            "Silver_Cleaned_Count": len(self.silver_storage),
            "Gold_Customer_Features": len(self.gold_feature_store),
            "Pipeline_Status": "MEDALLION_LAKEHOUSE_MATERIALIZED"
        }

pipeline = MedallionLakehousePipeline()
events = [
    RawEventPayload("EVT-01", "CUST-100", "$4,500.00", "2026-10-18T10:00:00Z"),
    RawEventPayload("EVT-02", "CUST-200", "$1,250.50", "2026-10-18T10:01:00Z"),
    RawEventPayload("EVT-01", "CUST-100", "$4,500.00", "2026-10-18T10:00:00Z"), # Duplicate
    RawEventPayload("EVT-03", "CUST-100", "$750.00", "2026-10-18T10:05:00Z")
]
res = pipeline.run_pipeline(events)

print("=== MEDALLION DATA LAKEHOUSE PIPELINE ===")
print(f"Bronze Ingested:    {res['Bronze_Record_Count']} raw events")
print(f"Silver Cleansed:    {res['Silver_Cleaned_Count']} valid records (Deduplicated)")
print(f"Gold Feature Store: {res['Gold_Customer_Features']} customer profiles aggregated")
print(f"Pipeline Verdict:   [{res['Pipeline_Status']}]")
"""

part1_output = """=== MEDALLION DATA LAKEHOUSE PIPELINE ===
Bronze Ingested:    4 raw events
Silver Cleansed:    3 valid records (Deduplicated)
Gold Feature Store: 2 customer profiles aggregated
Pipeline Verdict:   [MEDALLION_LAKEHOUSE_MATERIALIZED]"""

part2_say = [
    "Next, in Part 2, we explore the mechanics of ACID Transactions and Multi-Version Concurrency Control (MVCC) on Cloud Object Storage.",
    "Standard cloud object storage (AWS S3, Azure ADLS, Google Cloud Storage) is fundamentally an immutable key-value object store; it possesses no native concept of distributed multi-file transactions, row-level updates, or atomic commits. If a cluster of 500 Spark nodes is writing a 10-gigabyte dataset across 1,000 Parquet files, a network failure or spot-instance preemption halfway through leaves an orphaned, partially written dataset that permanently corrupts analytical queries.",
    "Delta Lake and Apache Iceberg solve this through an explicit, serialized Transaction Delta Log (`_delta_log/` or Iceberg metadata tree). Every insert, update, delete, or merge operation is recorded as a discrete JSON commit file representing an atomic state transition.",
    "When a query reads the table, it queries the transaction log to identify the latest valid snapshot ID. Any temporary or uncommitted parquet files generated by failed write tasks are completely ignored by readers, guaranteeing Atomicity and Isolation.",
    "In our institutional Python model for Part 2, we simulate an ACID Transaction Coordinator on Object Storage that executes atomic commits, rolls back aborted writes, and maintains flawless multi-version concurrency control."
]

part2_code = """# Simulation: Delta Lake ACID Transaction Coordinator & MVCC on Object Storage
import json
import time
from typing import List, Dict

class DeltaTransactionLog:
    def __init__(self):
        self.version = 0
        self.commits: List[dict] = []
        self.active_parquet_files: set = set()

    def commit_transaction(self, files_added: List[str], files_removed: List[str], operation: str) -> dict:
        self.version += 1
        # Apply atomic state changes
        for f in files_removed:
            self.active_parquet_files.discard(f)
        for f in files_added:
            self.active_parquet_files.add(f)

        commit_record = {
            "version": self.version,
            "timestamp": int(time.time()),
            "operation": operation,
            "added_files": files_added,
            "removed_files": files_removed,
            "active_file_count": len(self.active_parquet_files)
        }
        self.commits.append(commit_record)
        return commit_record

    def get_snapshot(self) -> dict:
        return {
            "Current_Version": self.version,
            "Active_Parquet_Files": sorted(list(self.active_parquet_files)),
            "Total_Commits": len(self.commits),
            "Isolation_Level": "SERIALIZABLE_SNAPSHOT_ISOLATION"
        }

delta_log = DeltaTransactionLog()
# Commit 1: Initial load
c1 = delta_log.commit_transaction(files_added=["part-001.parquet", "part-002.parquet"], files_removed=[], operation="WRITE")
# Commit 2: Upsert updating part-001
c2 = delta_log.commit_transaction(files_added=["part-003.parquet"], files_removed=["part-001.parquet"], operation="MERGE_UPSERT")

snapshot = delta_log.get_snapshot()

print("=== DELTA LAKE ACID TRANSACTION AUDIT ===")
print(f"Table Version:       v{snapshot['Current_Version']}")
print(f"Active Files:        {snapshot['Active_Parquet_Files']}")
print(f"Total Commits:       {snapshot['Total_Commits']}")
print(f"ACID Isolation:      [{snapshot['Isolation_Level']}]")
"""

part2_output = """=== DELTA LAKE ACID TRANSACTION AUDIT ===
Table Version:       v2
Active Files:        ['part-002.parquet', 'part-003.parquet']
Total Commits:       2
ACID Isolation:      [SERIALIZABLE_SNAPSHOT_ISOLATION]"""

part3_say = [
    "In Part 3, we master Time-Travel Rollbacks, Schema Evolution, and Partition Compaction.",
    "One of the greatest operational hazards in enterprise data engineering is accidental schema contamination or corrupt batch overwrites. In a traditional database, recovering from a corrupt table overwrite requires restoring multi-terabyte backups from cold storage, causing hours or days of operational downtime.",
    "Because the Delta Lake transaction log maintains an immutable chronological ledger of every commit and historical parquet file, data engineers can perform instantaneous Time-Travel queries. An analyst can execute `SELECT * FROM financial_ledger VERSION AS OF 42` or `TIMESTAMP AS OF '2026-10-01'` to query the historical state of the table exactly as it existed at month-end.",
    "Furthermore, the lakehouse supports Schema Evolution. When upstream business applications add new columns (e.g., adding `tax_jurisdiction_code`), the lakehouse automatically updates its metadata schema without requiring table rewrites or dropping existing data partitions.",
    "In our institutional Python model for Part 3, we build a Time-Travel & Schema Evolution Engine that executes historical snapshot rollbacks and enforces schema consistency."
]

part3_code = """# Simulation: Delta Lake Time-Travel & Schema Evolution Engine
from typing import Dict, Any, List

class TimeTravelLakehouseTable:
    def __init__(self, table_name: str, initial_schema: List[str]):
        self.table_name = table_name
        self.schema = set(initial_schema)
        self.version_history: Dict[int, dict] = {}
        self.current_version = 0

    def record_commit(self, records: List[dict], allow_schema_evolution: bool = True):
        self.current_version += 1
        # Check schema evolution
        for rec in records:
            new_cols = set(rec.keys()) - self.schema
            if new_cols:
                if allow_schema_evolution:
                    self.schema.update(new_cols)
                else:
                    raise ValueError(f"Schema violation! Unexpected columns: {new_cols}")

        self.version_history[self.current_version] = {
            "records": list(records),
            "schema_snapshot": sorted(list(self.schema))
        }

    def time_travel_query(self, version: int) -> dict:
        if version not in self.version_history:
            return {"Error": "VERSION_NOT_FOUND"}
        hist = self.version_history[version]
        return {
            "Table": self.table_name,
            "Queried_Version": version,
            "Record_Count": len(hist["records"]),
            "Schema_At_Version": hist["schema_snapshot"],
            "Query_Status": "HISTORICAL_SNAPSHOT_RESOLVED"
        }

table = TimeTravelLakehouseTable("corporate_invoices", ["invoice_id", "total_usd"])
# Version 1
table.record_commit([{"invoice_id": "INV-101", "total_usd": 1500.0}])
# Version 2 with Schema Evolution
table.record_commit([{"invoice_id": "INV-102", "total_usd": 3200.0, "tax_code": "TX-01"}], allow_schema_evolution=True)

tt_res = table.time_travel_query(version=1)

print("=== LAKEHOUSE TIME-TRAVEL AUDIT ===")
print(f"Table:            {tt_res['Table']}")
print(f"Queried Version:  v{tt_res['Queried_Version']}")
print(f"Schema at v1:     {tt_res['Schema_At_Version']}")
print(f"Time-Travel State:[{tt_res['Query_Status']}]")
"""

part3_output = """=== LAKEHOUSE TIME-TRAVEL AUDIT ===
Table:            corporate_invoices
Queried Version:  v1
Schema at v1:     ['invoice_id', 'total_usd']
Time-Travel State:[HISTORICAL_SNAPSHOT_RESOLVED]"""

part4_say = [
    "In Part 4, we examine automated Data Quality Telemetry and the Data Quality Index (DQI >= 98.0%).",
    "In high-stakes enterprise AI systems—such as automated algorithmic underwriting, dynamic pricing engines, or supply chain replenishment—data quality defects propagate downstream with devastating financial consequences. If an upstream sensor or ERP feed begins transmitting null customer identifiers or negative invoice totals, machine learning models produce garbage predictions.",
    "Enterprise Data Quality operates across Five Foundational Dimensions: Completeness (percentage of non-null required fields), Validity (conformance to data type and business format rules), Uniqueness (absence of duplicate records), Consistency (cross-table referential integrity), and Freshness (ingestion latency within defined SLAs).",
    "A Data Quality Index (DQI) aggregates these dimensions into a composite weighted health score. In production Medallion architectures, if an incoming batch scores below the institutional threshold of 98.0%, automated circuit breakers quarantine the batch, halting Gold-tier materialization and preventing contaminated data from polluting executive dashboards.",
    "In our institutional Python model for Part 4, we build an Enterprise Data Quality Index Engine that scores datasets across all five dimensions and triggers automated circuit-breaker quarantine when DQI falls below 98.0%."
]

part4_code = """# Simulation: Enterprise Data Quality Index (DQI) & Circuit Breaker Engine
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class QualityBatchRecord:
    rec_id: str
    email: str
    amount: float
    country_code: str

class DataQualityIndexEngine:
    def __init__(self, target_dqi: float = 98.0):
        self.target_dqi = target_dqi

    def evaluate_batch(self, batch: List[QualityBatchRecord]) -> dict:
        total = len(batch)
        if total == 0:
            return {"DQI": 0.0, "Status": "EMPTY_BATCH"}

        # 1. Completeness (no empty emails or null amounts)
        complete = sum(1 for r in batch if r.email and r.amount is not None)
        completeness_pct = (complete / total) * 100.0

        # 2. Validity (positive amounts, valid 2-letter country code)
        valid = sum(1 for r in batch if r.amount > 0 and len(r.country_code) == 2)
        validity_pct = (valid / total) * 100.0

        # 3. Uniqueness (distinct rec_ids)
        unique_ids = len(set(r.rec_id for r in batch))
        uniqueness_pct = (unique_ids / total) * 100.0

        # Composite DQI (Weighted: 40% Completeness, 40% Validity, 20% Uniqueness)
        dqi = round((completeness_pct * 0.40) + (validity_pct * 0.40) + (uniqueness_pct * 0.20), 2)
        is_passed = dqi >= self.target_dqi

        return {
            "Batch_Size": total,
            "Completeness_Pct": round(completeness_pct, 1),
            "Validity_Pct": round(validity_pct, 1),
            "Uniqueness_Pct": round(uniqueness_pct, 1),
            "Composite_DQI": dqi,
            "Target_DQI": self.target_dqi,
            "Circuit_Breaker_Action": "PROMOTE_TO_GOLD_FEATURE_STORE" if is_passed else "QUARANTINE_CONTAMINATED_BATCH"
        }

engine = DataQualityIndexEngine(target_dqi=98.0)
clean_batch = [
    QualityBatchRecord("REC-01", "cfo@apex.com", 15000.0, "US"),
    QualityBatchRecord("REC-02", "cio@apex.com", 8500.0, "GB"),
    QualityBatchRecord("REC-03", "vp@apex.com", 12000.0, "DE")
]
res = engine.evaluate_batch(clean_batch)

print("=== DATA QUALITY INDEX (DQI) TELEMETRY ===")
print(f"Batch Records:   {res['Batch_Size']}")
print(f"Completeness:    {res['Completeness_Pct']}%")
print(f"Validity:        {res['Validity_Pct']}%")
print(f"Composite DQI:   {res['Composite_DQI']}% (Target >= {res['Target_DQI']}%)")
print(f"Circuit Breaker: [{res['Circuit_Breaker_Action']}]")
"""

part4_output = """=== DATA QUALITY INDEX (DQI) TELEMETRY ===
Batch Records:   3
Completeness:    100.0%
Validity:        100.0%
Composite DQI:   100.0% (Target >= 98.0%)
Circuit Breaker: [PROMOTE_TO_GOLD_FEATURE_STORE]"""

part5_say = [
    "Finally, in Part 5, we assemble the Enterprise Modern Data Architecture & Governance Control Tower.",
    "The Data Architecture Control Tower serves as the centralized executive cockpit for the Chief Data Officer (CDO) and Chief Technology Officer (CTO). It continuously monitors the end-to-end health of the enterprise lakehouse across all three Medallion tiers, audits ACID transaction logs, verifies schema evolution stability, and enforces the 98.0% DQI circuit breaker.",
    "When all governance parameters satisfy enterprise standards, the Control Tower formally issues the Enterprise Modern Lakehouse Certified accreditation, authorizing the deployment of autonomous AI agents and executive BI reporting pipelines.",
    "In our institutional Python model for Part 5, we construct the complete Enterprise Modern Data Architecture Control Tower that unifies Medallion pipeline metrics, transaction isolation, and DQI certification into a definitive governance verdict."
]

part5_code = """# Simulation: Enterprise Modern Data Lakehouse & Governance Control Tower
class ModernDataArchitectureControlTower:
    def __init__(self, enterprise: str):
        self.enterprise = enterprise

    def audit_lakehouse_architecture(
        self,
        medallion_active: bool,
        acid_transactions_enforced: bool,
        time_travel_enabled: bool,
        measured_dqi: float,
        target_dqi: float = 98.0
    ) -> dict:
        dqi_compliant = measured_dqi >= target_dqi
        is_certified = medallion_active and acid_transactions_enforced and time_travel_enabled and dqi_compliant

        return {
            "Enterprise": self.enterprise,
            "Medallion_Bronze_Silver_Gold": "ACTIVE" if medallion_active else "DEFECTIVE",
            "ACID_Delta_Transaction_Log": "SERIALIZABLE" if acid_transactions_enforced else "UNPROTECTED",
            "Time_Travel_Snapshot_Audit": "OPERATIONAL" if time_travel_enabled else "DISABLED",
            "Measured_DQI_Pct": measured_dqi,
            "Target_DQI_Pct": target_dqi,
            "DQI_Governance_Verdict": "PASSED" if dqi_compliant else "CIRCUIT_BREAKER_TRIGGERED",
            "Enterprise_Certification": "CERTIFIED_MODERN_DATA_LAKEHOUSE" if is_certified else "REMEDIATION_REQUIRED"
        }

tower = ModernDataArchitectureControlTower("Apex Enterprise Global")
cert = tower.audit_lakehouse_architecture(
    medallion_active=True,
    acid_transactions_enforced=True,
    time_travel_enabled=True,
    measured_dqi=99.2
)

print("=== ENTERPRISE DATA ARCHITECTURE CONTROL TOWER ===")
print(f"Enterprise:          {cert['Enterprise']}")
print(f"Medallion Tiers:     {cert['Medallion_Bronze_Silver_Gold']}")
print(f"ACID Isolation:      {cert['ACID_Delta_Transaction_Log']}")
print(f"Time-Travel Engine:  {cert['Time_Travel_Snapshot_Audit']}")
print(f"Measured DQI:        {cert['Measured_DQI_Pct']}% (Target >= {cert['Target_DQI_Pct']}%)")
print(f"Lakehouse Status:    [{cert['Enterprise_Certification']}]")
"""

part5_output = """=== ENTERPRISE DATA ARCHITECTURE CONTROL TOWER ===
Enterprise:          Apex Enterprise Global
Medallion Tiers:     ACTIVE
ACID Isolation:      SERIALIZABLE
Time-Travel Engine:  OPERATIONAL
Measured DQI:        99.2% (Target >= 98.0%)
Lakehouse Status:    [CERTIFIED_MODERN_DATA_LAKEHOUSE]"""

day14_data = {
    "day": 14,
    "coursePrefix": "bcom_ait",
    "title": "Data Architecture for AI: Modern Data Lakehouse, Delta Lake & ACID on Object Storage",
    "goal": "Master modern data architecture for enterprise AI: Medallion architecture (Bronze, Silver, Gold), Delta Lake ACID transaction logs, Multi-Version Concurrency Control (MVCC), Time-Travel historical queries, and the Data Quality Index (DQI >= 98.0%).",
    "minutes": 40,
    "recap": "Welcome to Day 14 of AI & Digital Transformation. Today we explore enterprise data engineering for AI: uniting data lakes and warehouses via Delta Lake, ACID transactions on object storage, Time-Travel rollbacks, and automated DQI circuit breakers.",
    "parts": [
        {
            "part": 1,
            "title": "The Modern Data Lakehouse Paradigm & Medallion Architecture",
            "say": part1_say,
            "example": "A global retail bank stores billions of raw clickstream logs in Bronze S3 storage, cleanses them into Silver Delta tables, and aggregates customer credit features into Gold feature stores for real-time fraud scoring.",
            "code": part1_code,
            "output": part1_output,
            "codeNotes": [
                {"line": 15, "note": "Implements Bronze ingestion storing raw unvalidated events with complete historical fidelity"},
                {"line": 26, "note": "Implements Silver cleansing with deduplication, string cleaning, and float type casting"},
                {"line": 39, "note": "Materializes Gold feature store aggregating customer spend and transaction volume for AI models"}
            ],
            "tryIt": "Add a duplicate record with an invalid raw_amount like 'INVALID_AMT' to observe the Silver tier clean it gracefully.",
            "check": {
                "question": "What is the primary role of the Silver tier in a Modern Data Lakehouse Medallion Architecture?",
                "options": [
                    "Cleansing, deduplicating, validating, and structuring raw Bronze data into trusted, query-ready datasets.",
                    "Deleting all customer records older than thirty days.",
                    "Encrypting raw data into secret cryptocurrency wallets.",
                    "Generating final executive pitch decks automatically."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "The Silver tier takes raw, untyped Bronze data and applies deduplication, validation, type casting, and schema enforcement to produce clean data.",
                "why": "The Silver tier takes raw, untyped Bronze data and applies deduplication, validation, type casting, and schema enforcement to produce clean data."
            }
        },
        {
            "part": 2,
            "title": "ACID Transactions & Multi-Version Concurrency Control (MVCC) on Object Storage",
            "say": part2_say,
            "example": "When a concurrent write job fails midway through writing parquet files to S3, Delta Lake's serialized transaction log ignores the orphan files, preventing readers from experiencing dirty reads.",
            "code": part2_code,
            "output": part2_output,
            "codeNotes": [
                {"line": 10, "note": "Maintains sequential version tracking and JSON commit ledger for atomic state transitions"},
                {"line": 14, "note": "Atomic commit dynamically updates active parquet file set, removing stale files and adding new parts"},
                {"line": 28, "note": "Snapshot queries read exclusively committed active files under serializable snapshot isolation"}
            ],
            "tryIt": "Simulate an aborted commit by not updating active_parquet_files to verify snapshot isolation prevents dirty reads.",
            "check": {
                "question": "How does Delta Lake guarantee ACID transactions on fundamentally non-transactional cloud object storage?",
                "options": [
                    "By maintaining a serialized, append-only Transaction Delta Log that records atomic commit metadata and active parquet snapshots.",
                    "By installing physical database hardware inside cloud object storage centers.",
                    "By requiring all data writes to be executed manually by human database administrators.",
                    "By converting all parquet files into plain text emails."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "The transaction delta log serves as the atomic source of truth, tracking exact valid parquet file snapshots across versions.",
                "why": "The transaction delta log serves as the atomic source of truth, tracking exact valid parquet file snapshots across versions."
            }
        },
        {
            "part": 3,
            "title": "Time-Travel Historical Rollbacks & Schema Evolution Management",
            "say": part3_say,
            "example": "A forensic auditor reconstructs the exact state of a corporate accounts payable ledger as of December 31 by executing a Delta Lake Time-Travel query targeting version 18.",
            "code": part3_code,
            "output": part3_output,
            "codeNotes": [
                {"line": 11, "note": "Tracks immutable historical version snapshots mapping table records and schemas chronologically"},
                {"line": 16, "note": "Supports schema evolution by detecting new columns and updating table metadata dynamically"},
                {"line": 25, "note": "Executes Time-Travel query resolving historical snapshots without restoring backups"}
            ],
            "tryIt": "Set allow_schema_evolution=False when appending 'tax_code' to observe the engine enforce strict schema immutability.",
            "check": {
                "question": "What enterprise benefit does Lakehouse Time-Travel provide during regulatory audits?",
                "options": [
                    "The ability to instantaneously query the historical state of any table at a past timestamp without restoring physical backups.",
                    "The ability to physically travel back in time to alter past business contracts.",
                    "The automatic prediction of next year's stock market prices.",
                    "Exemption from all federal tax reporting requirements."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "Time-Travel queries allow auditors and data engineers to view historical snapshots directly from immutable version logs.",
                "why": "Time-Travel queries allow auditors and data engineers to view historical snapshots directly from immutable version logs."
            }
        },
        {
            "part": 4,
            "title": "Automated Data Quality Telemetry: The Data Quality Index (DQI >= 98.0%)",
            "say": part4_say,
            "example": "A real-time telemetry engine detects null billing addresses in 5% of incoming customer records, dropping the DQI to 95.0% and triggering an automated circuit breaker to quarantine the batch.",
            "code": part4_code,
            "output": part4_output,
            "codeNotes": [
                {"line": 17, "note": "Scores Completeness dimension by auditing non-null email and amount fields"},
                {"line": 21, "note": "Scores Validity dimension by verifying positive currency amounts and 2-letter country codes"},
                {"line": 28, "note": "Calculates composite DQI and triggers circuit breaker if score falls below 98.0% target"}
            ],
            "tryIt": "Add a duplicate record or a negative amount to observe the composite DQI fall and trigger batch quarantine.",
            "check": {
                "question": "What action does an enterprise data pipeline execute when an incoming batch exhibits a DQI below 98.0%?",
                "options": [
                    "It triggers an automated circuit breaker to quarantine the contaminated batch, halting Gold-tier materialization.",
                    "It automatically charges the customer's credit card twice.",
                    "It deletes the entire data lakehouse immediately.",
                    "It disables all company email servers."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "Automated circuit breakers quarantine bad batches before they can contaminate downstream production feature stores or dashboards.",
                "why": "Automated circuit breakers quarantine bad batches before they can contaminate downstream production feature stores or dashboards."
            }
        },
        {
            "part": 5,
            "title": "Enterprise Data Architecture & Governance Control Tower",
            "say": part5_say,
            "example": "The CDO reviews the Data Architecture Control Tower dashboard, verifying that Medallion pipelines, Delta ACID logs, and a 99.2% DQI certify the enterprise lakehouse for production AI operations.",
            "code": part5_code,
            "output": part5_output,
            "codeNotes": [
                {"line": 12, "note": "Audits core architecture pillars: Medallion tiers, ACID logs, Time-Travel, and DQI >= 98.0%"},
                {"line": 15, "note": "Evaluates DQI compliance against the 98.0% institutional quality threshold"},
                {"line": 24, "note": "Formally confers Certified Modern Data Lakehouse accreditation for enterprise deployment"}
            ],
            "tryIt": "Set measured_dqi to 96.5% to observe the DQI governance verdict trigger circuit breaker remediation.",
            "check": {
                "question": "What is the primary objective of an Enterprise Data Architecture Control Tower?",
                "options": [
                    "Providing real-time governance, transaction auditability, and data quality certification across the enterprise lakehouse.",
                    "Replacing human software developers with automated robot vacuum cleaners.",
                    "Managing building air conditioning and electrical power grids.",
                    "Tracking employee social media posts."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "The control tower ensures data integrity, transaction reliability, and quality compliance across all enterprise data tiers.",
                "why": "The control tower ensures data integrity, transaction reliability, and quality compliance across all enterprise data tiers."
            }
        }
    ],
    "summary": [
        "Modern Data Lakehouse Paradigm: Uniting object storage scalability with data warehouse ACID rigor via Delta Lake eliminates fragile data silos.",
        "Medallion Architecture: Structuring data into Bronze (raw), Silver (cleansed), and Gold (curated feature stores) guarantees end-to-end lineage and reliability.",
        "ACID on Object Storage: Serialized Delta transaction logs and snapshot isolation prevent dirty reads and orphaned write corruptions.",
        "Time-Travel & Schema Evolution: Historical version querying enables regulatory auditability and non-destructive schema agility.",
        "Data Quality Index (DQI >= 98.0%): Automated circuit breakers quarantine contaminated batches before they degrade downstream enterprise AI models."
    ],
    "projectStep": {
        "title": "Deploying the Enterprise Modern Data Lakehouse & DQI Control Tower",
        "steps": [
            "Construct a Medallion architecture pipeline ingesting Bronze events, cleansing Silver records, and materializing Gold features.",
            "Implement a Delta Lake ACID transaction coordinator enforcing serialized snapshot isolation on cloud object storage.",
            "Deploy a Time-Travel historical query engine capable of auditing past table versions and managing schema evolution.",
            "Build an automated Data Quality Index engine and synthesize all components into the Enterprise Data Architecture Control Tower."
        ]
    }
}

with open('scripts/bcom_ait_day14_data.json', 'w', encoding='utf-8') as f:
    json.dump(day14_data, f, indent=2)
print('Day 14 data written successfully.')
