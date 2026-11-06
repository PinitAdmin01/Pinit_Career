import sys

with open('scripts/build_cloud_day31.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = '    "Observability is the final pillar of enterprise production readiness.'
replacement = '''    "In catastrophic disaster scenarios—such as a regional AWS network impairment or an aggressive pod eviction cascade triggered by node memory pressure—the resilience of the EKS VPC CNI allocation engine prevents compounding failure loops. In naive architectures, when fifty worker nodes crash simultaneously, their secondary IP bindings remain temporarily locked in the EC2 control plane as zombie attachments. During rapid recovery, new replacement nodes attempt to request secondary ENIs and encounter severe EC2 rate-limiting RequestLimitExceeded exceptions. The production-grade IPAM engine avoids this through intelligent exponential backoff-jitter algorithms, proactive warm pool caching, and immediate graceful detachment during SIGTERM shutdown hooks. By mastering these nuanced operational behaviors, you ensure that your Kubernetes infrastructure remains impervious to cascading outage storms.",
    "Observability is the final pillar of enterprise production readiness.'''

text = text.replace(target, replacement)

with open('scripts/build_cloud_day31.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated p5_say in scripts/build_cloud_day31.py")
