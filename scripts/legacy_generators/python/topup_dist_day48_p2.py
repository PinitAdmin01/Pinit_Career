# scripts/topup_dist_day48_p2.py

with open("scripts/create_dist_day48_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how transaction 101 transitions to COMMITTED'
extra = '''    "Crucially, the two-phase commit protocol executed by streaming brokers does not suffer from the classic blocking coordinator flaw of traditional databases. Because brokers write control markers sequentially to append-only logs without holding distributed pessimistic locks on individual record rows, other non-transactional or independent transactions proceed in parallel without lock contention, maintaining high pipeline throughput.",
    "Notice how transaction 101 transitions to COMMITTED'''

content = content.replace(target, extra)

with open("scripts/create_dist_day48_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 2 of Day 48!")
