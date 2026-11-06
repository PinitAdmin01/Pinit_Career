import json

with open('scripts/audit_findings_fast.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total Forensic Issues: {data['total_issues']}\n")
for idx, item in enumerate(data['findings'][:25]):
    print(f"#{idx+1} [{item['course']}] Day {item['day']} | Type: {item['category']}")
    print(f"   What: {item['what']}")
    print(f"   Where: {item['where']}")
    print(f"   Evidence: {item['evidence']}")
    print(f"   Fix: {item['how']}\n")
