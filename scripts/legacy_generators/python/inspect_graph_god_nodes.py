with open('graphify-out/GRAPH_REPORT.md', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re

# Find sections mentioning God Nodes
god_nodes_match = re.search(r'## God Nodes.*?(?=\n## )', text, re.DOTALL)
if god_nodes_match:
    print("=== GOD NODES ===")
    print(god_nodes_match.group(0)[:1500])

# Find sections mentioning curriculum architecture or longLessons
curriculum_matches = re.findall(r'### Community [^\n]+\n.*?curriculum.*?\n(?=\n###|\n##)', text, re.DOTALL | re.IGNORECASE)
print(f"\nFound {len(curriculum_matches)} communities mentioning curriculum.")
for m in curriculum_matches[:3]:
    print("--- COMMUNITY SAMPLE ---")
    print(m[:500])
