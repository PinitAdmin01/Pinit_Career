# scripts/topup_dist_day53.py
import re

content = open("scripts/create_dist_day53_data.py", "r", encoding="utf-8").read()

say_p3_extra = """    "Fourth, Dynamic Service Discovery Integration: In dynamic cloud environments such as Kubernetes or Amazon ECS, container IP addresses are ephemeral and continuously fluctuating as pods are scheduled, rescheduled, and auto-scaled. Hardcoding static IP addresses into a Prometheus configuration file is impossible! Prometheus solves this challenge through pluggable Service Discovery mechanisms that continuously query the Kubernetes API server, Consul, or AWS EC2 APIs. When a new pod boots up with annotations like `prometheus.io/scrape: 'true'`, Prometheus automatically registers the pod's IP and port into its active scrape target pool within seconds, establishing an autonomous, zero-configuration metrics collection pipeline.",
"""

say_p4_extra = """    "Beyond instant and range vectors, PromQL supports Recording Rules for computational efficiency. When an SRE team designs real-time dashboards or high-frequency alerting rules that evaluate complex aggregations across millions of time-series—such as calculating global 99th percentile latencies across fifty microservice tiers—running that query repeatedly every ten seconds can overload the Prometheus TSDB engine. Recording rules allow engineers to precompute complex queries on a scheduled background cadence (e.g., every 60 seconds) and save the resulting vector as a new, lightweight time-series metric (e.g., `job:http_requests:rate5m`). Downstream dashboards and alerting rules then query the precomputed metric instantaneously with sub-millisecond query execution.",
"""

say_p5_extra = """    "Sixth, Distributed Long-Term Storage & Global Federation: While a single vanilla Prometheus instance excels at short-term, high-frequency metrics ingestion on local NVMe disks, enterprise architectures requiring multi-year compliance retention and cross-region global querying deploy CNCF graduated federation platforms such as Thanos or Cortex. These architectures deploy sidecar containers alongside local Prometheus instances that continuously ship immutable two-hour TSDB block chunks into durable cloud object storage (such as Amazon S3 or Google Cloud Storage), while a distributed query engine fans out PromQL queries across both local in-memory buffers and cold object storage to deliver seamless, unified historical telemetry across planetary multi-cloud footprints.",
"""

# Let's inspect say_p3, say_p4, say_p5 and insert the extra paragraphs before the analogy
# Or rewrite the file cleanly.
