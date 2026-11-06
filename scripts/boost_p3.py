import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_cloud_day32.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add a sentence to Part 3:
p3_target = '"In addition, Karpenter\'s `EC2NodeClass` provides fine-grained control over network interface attachment and storage throughput.'
p3_replace = '''"To enforce strict cost guardrails, platform teams define explicit resource limits directly inside the NodePool spec using `spec.limits.cpu` and `spec.limits.memory` attributes. If an application autoscaling defect triggers a rogue pod spawn loop, Karpenter automatically caps total provisioned cores and RAM across the cluster, preventing runaway AWS billing while triggering Prometheus alerts to on-call engineering squads.",
    "In addition, Karpenter's `EC2NodeClass` provides fine-grained control over network interface attachment and storage throughput.'''

text = text.replace(p3_target, p3_replace)

with open('scripts/build_cloud_day32.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added cost guardrail paragraph to Part 3!")
