# scripts/topup_cyber_day35_p5.py

content = open("scripts/create_cyber_day35_data.py", "r", encoding="utf-8").read()

p5_more = """    "Eighth, Uncompromising Engineering Dedication: True cybersecurity defense is not merely a set of compliance checkboxes, but an ongoing scientific commitment to mathematical vigilance, deterministic invariants, and relentless defense-in-depth across every line of software code you deploy.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we implement the Milestone7CapstoneAuditor',
    f'{p5_more}    "In the TypeScript snippet below, we implement the Milestone7CapstoneAuditor'
)

open("scripts/create_cyber_day35_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day35_data.py with Part 5 top-up.")
