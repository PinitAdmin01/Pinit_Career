import sys, pprint
sys.path.append('scripts')
from fullstack_day40_data import DAY_40

# Part 2 is index 1
# Part 4 is index 3

actual_p2_output = """Worker 1 Rolling Upgrade Completed: v2.5.0
Worker 1 In-Flight Connections Drained: 120
Cluster Running Hybrid Versions During Rolling Upgrade: { 'v2.5.0': 2, 'v2.4.0': 2 }
Zero Connection Drop Guarantee: True"""

actual_p4_output = """Candidate Alpha Similarity Score: 1
Candidate Alpha Filter Matched: true
Candidate Beta Similarity Score: 0.7171
Candidate Beta Filter Matched: false
Wasm v128 SIMD Vector Engine Operational: True"""

DAY_40['parts'][1]['output'] = actual_p2_output
DAY_40['parts'][3]['output'] = actual_p4_output

with open('scripts/fullstack_day40_data.py', 'w', encoding='utf-8') as f:
    f.write("# Day 40 Fullstack JS Long Lesson Data\n")
    f.write(f"DAY_40 = {pprint.pformat(DAY_40, width=120, sort_dicts=False)}\n")

print("Updated DAY_40 outputs successfully!")
