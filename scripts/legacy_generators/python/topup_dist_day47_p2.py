# scripts/topup_dist_day47_p2.py

with open("scripts/create_dist_day47_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how RangeAssignor maps partitions 0 and 1'
extra = '''    "Furthermore, partition assignors must strictly enforce rack and availability zone awareness in modern multi-cloud datacenters. By mapping the rack ID metadata of consumers against the physical rack locations of partition leader brokers, intelligent rack-aware assignors ensure that consumers preferentially fetch from partition replicas located within the exact same availability zone, completely eliminating inter-zone cross-rack network egress costs and shaving round-trip packet latencies.",
    "Notice how RangeAssignor maps partitions 0 and 1'''

content = content.replace(target, extra)

with open("scripts/create_dist_day47_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 2 of Day 47!")
