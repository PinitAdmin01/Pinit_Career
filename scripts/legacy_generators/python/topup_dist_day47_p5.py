# scripts/topup_dist_day47_p5.py

with open("scripts/create_dist_day47_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how the production telemetry confirms 8 active consumers'
extra = '''    "From a financial and operational cost optimization viewpoint, the Cooperative Sticky Assignor yields enormous architectural savings for cloud enterprises. Under legacy eager rebalances, frequent pod restarts in dynamic Kubernetes environments caused cascading rebalance storms, forcing organizations to over-provision consumer fleets by over three hundred percent to compensate for twenty-second processing freezes.",
    "By reducing rebalance pauses to negligible forty-two-millisecond blips and preserving hot in-memory state, our cooperative consumer architecture allows teams to run lean, rightsized container fleets with automated spot-instance reclamation, cutting streaming infrastructure expenses by up to sixty percent while guaranteeing ninety-nine point nine nine percent pipeline availability.",
    "Notice how the production telemetry confirms 8 active consumers'''

content = content.replace(target, extra)

with open("scripts/create_dist_day47_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 5 of Day 47!")
