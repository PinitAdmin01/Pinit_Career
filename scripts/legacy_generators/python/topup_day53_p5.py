# scripts/topup_day53_p5.py
import re

content = open("scripts/create_dist_day53_data.py", "r", encoding="utf-8").read()

old_p5 = """    "Sixth, Distributed Long-Term Storage & Global Federation: While a single vanilla Prometheus instance excels at short-term, high-frequency metrics ingestion on local NVMe disks, enterprise architectures requiring multi-year compliance retention and cross-region global querying deploy CNCF graduated federation platforms such as Thanos or Cortex. These architectures deploy sidecar containers alongside local Prometheus instances that continuously ship immutable two-hour TSDB block chunks into durable cloud object storage (such as Amazon S3 or Google Cloud Storage), while a distributed query engine fans out PromQL queries across both local in-memory buffers and cold object storage to deliver seamless, unified historical telemetry across planetary multi-cloud footprints.",
    "Consider the final physical analogy"""

new_p5 = """    "Sixth, Distributed Long-Term Storage & Global Federation: While a single vanilla Prometheus instance excels at short-term, high-frequency metrics ingestion on local NVMe disks, enterprise architectures requiring multi-year compliance retention and cross-region global querying deploy CNCF graduated federation platforms such as Thanos or Cortex. These architectures deploy sidecar containers alongside local Prometheus instances that continuously ship immutable two-hour TSDB block chunks into durable cloud object storage (such as Amazon S3 or Google Cloud Storage), while a distributed query engine fans out PromQL queries across both local in-memory buffers and cold object storage to deliver seamless, unified historical telemetry across planetary multi-cloud footprints.",
    "Seventh, Alertmanager Deduplication & Routing Topologies: Raw PromQL alerts are routed downstream to the Prometheus Alertmanager, which handles critical operational responsibilities: grouping related alerts across pods to eliminate alert fatigue, deduplicating redundant notifications during cascading failures, applying maintenance window silences, and routing notifications to PagerDuty or Slack based on label routing trees. This ensures on-call engineers receive high-signal, actionable notifications rather than hundreds of disjointed alerts.",
    "Consider the final physical analogy"""

content = content.replace(old_p5, new_p5)
open("scripts/create_dist_day53_data.py", "w", encoding="utf-8").write(content)
print("Updated Day 53 Part 5.")
