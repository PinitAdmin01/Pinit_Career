# scripts/topup_dist_day48_final_p5.py

with open("scripts/create_dist_day48_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how the production telemetry confirms 1,000,000 messages'
extra = '''    "From an architectural return-on-investment perspective, exactly-once processing eliminates the immense technical debt of manual financial reconciliation scripts. In legacy systems running under at-least-once semantics, financial teams routinely spent hours resolving duplicate payments and credit adjustments after network incidents. With hardware-level idempotence and atomic two-phase commit logs, data pipelines deliver mathematical certainty, allowing engineers to focus entirely on feature velocity and customer value.",
    "Notice how the production telemetry confirms 1,000,000 messages'''

content = content.replace(target, extra)

with open("scripts/create_dist_day48_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 5 of Day 48!")
