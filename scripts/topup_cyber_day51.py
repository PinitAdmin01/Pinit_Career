import json
import re

topup_p3 = [
    "To operationalize alert triage efficiently, modern SIEM triage engines incorporate Contextual Alert Enrichment before an analyst ever views a notification. In raw form, an alert might merely state that IP `10.4.12.88` attempted a suspicious command. Through automated enrichment pipelines, the SIEM queries identity directories (Active Directory, Okta) and asset inventories (CMDB) to enrich the alert in real time with vital metadata: the user is a junior marketing intern in the London office, the machine is a Windows 11 corporate laptop, and the target IP is an internal payroll database. This immediate context reveals that the connection is completely anomalous for that employee role, escalating the incident to high priority without requiring manual analyst lookups.",
    "Furthermore, enterprise detection engineering relies on Automated Alert Deduplication and Incident Grouping. During active cyber attacks or malware outbreaks, a single infected endpoint can generate hundreds of repetitive alerts within minutes (such as dozens of individual DNS queries to known malicious domains). Naively alerting on each event floods analyst queues. Deduplication engines group related alerts by host ID, user identity, and attack timeframe into a single consolidated Investigation Case, tracking cumulative threat scores while maintaining a manageable queue for human operators."
]

topup_p4 = [
    "To architect sustainable long-term analytics across petabyte-scale environments, modern enterprises are deploying Hybrid Security Data Lakes pairing real-time Lucene indexing (Elasticsearch, OpenSearch) with high-efficiency columnar analytics engines (ClickHouse, Snowflake, AWS Athena). While Elasticsearch excels at sub-second full-text keyword searches across recent hot data, querying twelve months of historical network telemetry in Elasticsearch requires massive cluster memory and compute costs. By streaming normalized CEF/ECS data simultaneously into columnar Parquet files stored in cloud object storage, threat hunters can execute complex historical SQL aggregations across billions of historical records at a fraction of the cost.",
    "Crucially, forensic integrity within the long-term archive requires Cryptographic Log Chaining using Merkle Trees and HMAC signatures. As logs enter the ingestion pipeline, the ingestion worker computes a SHA-256 hash of each log entry combined with the cryptographic hash of the preceding entry, establishing an unbroken cryptographic chain analogous to a blockchain ledger. If a hostile intruder or malicious database administrator tampers with even a single byte or deletes an audit line from historical archives, the cryptographic Merkle root hash verification fails immediately, providing unassailable proof of tampering during judicial and regulatory proceedings."
]

topup_p5 = [
    "Synthesizing these operational disciplines into continuous excellence requires tracking core Security Operations Key Performance Indicators (KPIs). Chief Information Security Officers (CISOs) evaluate SOC maturity through three fundamental metrics: Dwell Time (the median duration an adversary remains undetected inside the enterprise network before discovery; top-tier SOCs strive for a dwell time under one hour); Mean Time to Detect (MTTD); and Mean Time to Respond (MTTR). By automating CEF normalization, deploying sliding-window correlation, and establishing automated triage pipelines, high-maturity enterprises drive MTTD down from days to minutes.",
    "Furthermore, enterprise SOCs execute regular Purple Team Exercises where Tier 3 threat hunters collaborate directly with offensive red teams. Red team operators simulate real-world adversary techniques (such as pass-the-hash or Kerberoasting), while blue team engineers verify that the SIEM correlation rules accurately capture and triage the attack in real time. This continuous feedback loop ensures that the SOC platform remains continuously adapted to evolving adversary tactics, providing comprehensive, proactive defense across the entire enterprise digital estate."
]

with open("scripts/create_cyber_day51_data.py", "r", encoding="utf-8") as f:
    text = f.read()

new_text = text
for i, topup in enumerate([topup_p3, topup_p4, topup_p5], 3):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    def make_repl(ts):
        return lambda m: m.group(1) + ts + m.group(2)
    new_text = re.sub(pattern, make_repl(topup_str), new_text, count=1)

with open("scripts/create_cyber_day51_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day51_data.py with topups safely!")
