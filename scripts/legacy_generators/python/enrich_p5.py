import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_cloud_day31.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = '    "Observability is the final pillar of enterprise production readiness. The AWS VPC CNI exposes detailed Prometheus metrics on port 61678, streaming critical telemetry such as `awscni_assigned_ip_addresses`, `awscni_total_ip_addresses`, `awscni_eni_allocated`, and `awscni_aws_api_latency_ms`. Cloud platform teams configure Prometheus alerts that fire when subnet IP allocation exceeds 80% capacity or when AWS EC2 API rate-limiting throttles secondary ENI creation. Combined with automated horizontal scaling and Karpenter node provisioning, this comprehensive architecture ensures zero-downtime scalability under hyperscale traffic loads."\n]'

replacement = '''    "Observability is the final pillar of enterprise production readiness. The AWS VPC CNI exposes detailed Prometheus metrics on port 61678, streaming critical telemetry such as `awscni_assigned_ip_addresses`, `awscni_total_ip_addresses`, `awscni_eni_allocated`, and `awscni_aws_api_latency_ms`. Cloud platform teams configure Prometheus alerts that fire when subnet IP allocation exceeds 80% capacity or when AWS EC2 API rate-limiting throttles secondary ENI creation. Combined with automated horizontal scaling and Karpenter node provisioning, this comprehensive architecture ensures zero-downtime scalability under hyperscale traffic loads.",
    "In catastrophic disaster scenarios—such as a regional AWS network impairment or an aggressive pod eviction cascade triggered by node memory pressure—the resilience of the EKS VPC CNI allocation engine prevents compounding failure loops. In naive architectures, when fifty worker nodes crash simultaneously, their secondary IP bindings remain temporarily locked in the EC2 control plane as zombie attachments. During rapid recovery, new replacement nodes attempt to request secondary ENIs and encounter severe EC2 rate-limiting RequestLimitExceeded exceptions. The production-grade IPAM engine avoids this through intelligent exponential backoff-jitter algorithms, proactive warm pool caching, and immediate graceful detachment during SIGTERM shutdown hooks.",
    "Finally, enterprise security governance mandates continuous verification of pod network boundaries. By binding dedicated AWS Security Groups directly to individual Kubernetes Pods (using Security Groups for Pods and the `SecurityGroupPolicy` CRD), platform architects enforce fine-grained micro-segmentation without maintaining complex Calico or Cilium network policies. Pods accessing PCI-DSS payment gateways or HIPAA patient databases are granted exclusive security groups that permit traffic only from authorized API gateways. This complete architectural synergy—spanning high-availability etcd control planes, native ENI allocation, non-routable CGNAT address conservation, cryptographic IRSA token federation, and pod-level security group enforcement—forms the unshakeable foundation of mission-critical Kubernetes on AWS."
]'''

if target in text:
    text = text.replace(target, replacement)
    with open('scripts/build_cloud_day31.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully enriched p5_say in scripts/build_cloud_day31.py")
else:
    print("Target string not found in scripts/build_cloud_day31.py")
