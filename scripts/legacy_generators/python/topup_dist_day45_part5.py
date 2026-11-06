# scripts/topup_dist_day45_part5.py

with open("scripts/create_dist_day45_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how the production audit confirms a 92.4% L1 hit ratio'
extra = '''    "From an economic and environmental perspective, the return on investment of our multi-tier cache engine is immense. By shielding primary databases from over ninety-nine percent of read requests and coalescing write spikes into batched bulk operations, an organization reduces cloud database provisioning costs by up to seventy percent, slashing hardware provisioning expenses while decreasing datacenter energy consumption.",
    "Notice how the production audit confirms a 92.4% L1 hit ratio'''

content = content.replace(target, extra)

with open("scripts/create_dist_day45_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 5 of Day 45!")
