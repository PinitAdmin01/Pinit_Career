# scripts/add_p4_p5_day32.py
from pathlib import Path

path = Path('scripts/data_scrm_day32.py')
content = path.read_text(encoding='utf-8')

p4_add = '''    "Additionally, the routing engine enforces Business Hours and Holiday Calendar Interceptors across multinational time zones. Operating hours schedules (e.g., 08:00 to 18:00 local time, excluding national bank holidays) are assigned to each sales rep. When an inbound lead arrives outside of a sales rep's active working hours, the engine dynamically holds the assignment in an SLA-paused buffer until the opening of the rep's next business day, or alternatively reroutes the lead to a follow-the-sun global support queue in an active operational timezone.",
'''

p5_add = '''    "Finally, the platform maintains strict SOC 2 Type II audit logging and field-level history tracking for every routed record. Compliance officers can inspect complete historical decision trees: tracing the exact millisecond when the marketing webhook fired, the normalized corporate domain, the string similarity scores against candidate accounts, and the mathematical deficit calculations that determined sales rep selection, ensuring total governance transparency and complete defensibility during sales commission disputes.",
'''

content = content.replace(
    '    "In Part 4, we build an Enterprise Lead Routing DAG & Quota-Weighted Round-Robin Engine in pure Python',
    p4_add + '    "In Part 4, we build an Enterprise Lead Routing DAG & Quota-Weighted Round-Robin Engine in pure Python'
)

content = content.replace(
    '    "In Part 5, we execute this comprehensive Enterprise Lead-to-Account Matching & Routing Platform in pure Python',
    p5_add + '    "In Part 5, we execute this comprehensive Enterprise Lead-to-Account Matching & Routing Platform in pure Python'
)

path.write_text(content, encoding='utf-8')
print("Added p4 and p5 words to Day 32!")
