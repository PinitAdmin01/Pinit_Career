# scripts/topup_dist_day49_p5.py

with open("scripts/create_dist_day49_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how the production telemetry confirms 150,000 events'
extra = '''    "From an operational cost efficiency standpoint, utilizing embedded local RocksDB state stores slashing primary database licensing costs by over eighty percent. In legacy architectures, streaming workers made hundreds of thousands of network RPC calls to external relational databases per second, saturating network interfaces and requiring massive database clusters. By co-locating state inside worker pod memory and NVMe storage, streaming pipelines achieve ten times greater throughput at a fraction of cloud compute infrastructure spend.",
    "Notice how the production telemetry confirms 150,000 events'''

content = content.replace(target, extra)

with open("scripts/create_dist_day49_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 5 of Day 49!")
