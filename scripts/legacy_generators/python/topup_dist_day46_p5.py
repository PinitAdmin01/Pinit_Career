# scripts/topup_dist_day46_p5.py

with open("scripts/create_dist_day46_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how the production telemetry confirms 2,500,000 messages'
extra = '''    "From an enterprise monitoring and alerting perspective, our production dashboard integrates directly with OpenTelemetry and Prometheus. Key health indicators include: `kafka_server_brokermonitor_underreplicatedpartitions` which must remain at zero; `kafka_network_requestmetrics_totaltimems` which tracks end-to-end publish latency; and `kafka_server_replicafetchermanager_maxlag` which alerts on lagging followers before they violate the ten-second ISR eviction threshold.",
    "Notice how the production telemetry confirms 2,500,000 messages'''

content = content.replace(target, extra)

with open("scripts/create_dist_day46_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 5 of Day 46!")
