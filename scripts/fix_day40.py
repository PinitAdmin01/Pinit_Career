with open('scripts/fullstack_day40_data.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Part 2
old_p2 = """Worker 1 Rolling Upgrade Completed: v2.5.0
Worker 1 In-Flight Connections Drained: 120
Cluster Running Hybrid Versions During Rolling Upgrade: { 'v2.4.0': 2, 'v2.5.0': 2 }
Zero Connection Drop Guarantee: True"""

new_p2 = """Worker 1 Rolling Upgrade Completed: v2.5.0
Worker 1 In-Flight Connections Drained: 120
Cluster Running Hybrid Versions During Rolling Upgrade: { 'v2.5.0': 2, 'v2.4.0': 2 }
Zero Connection Drop Guarantee: True"""

# Fix Part 4
old_p4 = """Candidate Alpha Similarity Score: 1
Candidate Alpha Filter Matched: true
Candidate Beta Similarity Score: 0.7263
Candidate Beta Filter Matched: false
Wasm v128 SIMD Vector Engine Operational: True"""

new_p4 = """Candidate Alpha Similarity Score: 1
Candidate Alpha Filter Matched: true
Candidate Beta Similarity Score: 0.7171
Candidate Beta Filter Matched: false
Wasm v128 SIMD Vector Engine Operational: True"""

assert old_p2 in content, 'p2 not found'
assert old_p4 in content, 'p4 not found'
content = content.replace(old_p2, new_p2).replace(old_p4, new_p4)

with open('scripts/fullstack_day40_data.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed Day 40 expected outputs successfully!')
