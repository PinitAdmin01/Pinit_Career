import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_cloud_day32.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add a sentence to Part 4:
p4_target = '"In addition to Spot interruption warnings, Karpenter continuously monitors AWS Health events'
p4_replace = '''"Furthermore, enterprise resilience architectures configure Karpenter to run multiple replicas of its own controller pod using leader election across multiple Availability Zones, backed by a dedicated PDB that prevents Karpenter from ever evicting itself during consolidation passes.",
    "In addition to Spot interruption warnings, Karpenter continuously monitors AWS Health events'''

# Add a sentence to Part 5:
p5_target = '"Furthermore, Karpenter provides first-class support for stateful'
p5_replace = '''"In financial banking systems processing millions of transactions per second, this dynamic compute engine provides the agility required to absorb sudden volume spikes while guaranteeing that infrastructure costs scale down dynamically during off-peak hours.",
    "Furthermore, Karpenter provides first-class support for stateful'''

text = text.replace(p4_target, p4_replace)
text = text.replace(p5_target, p5_replace)

with open('scripts/build_cloud_day32.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added paragraphs to Part 4 and Part 5!")
