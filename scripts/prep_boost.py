import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/test_word_counts.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's add extra technical details to parts 2, 3, 4, 5
p2_add = """
    "In addition to IP target settings, modern EKS clusters utilize VPC CNI Prefix Delegation. Instead of allocating single /32 IP addresses to secondary ENI slots, the CNI requests /28 IPv4 prefixes (blocks of 16 contiguous IP addresses). This multiplies the pod capacity per ENI by up to sixteen times, allowing smaller, cost-effective EC2 instance types to support dense microservice packing without hitting hardware ENI ceilings. Prefix delegation also reduces AWS EC2 API throttling during massive scale-out events because one API call reserves sixteen IP addresses simultaneously."
"""

p3_add = """
    "From an operational routing perspective, Linux policy-based routing tables inside the worker node kernel direct traffic arriving from or destined to secondary ENIs. The VPC CNI configures custom route tables (e.g. table 1001, 1002) and ip rule priorities ensuring packets leaving a Pod's veth interface exit through the exact secondary ENI bound to that Pod's secondary subnet. This prevents asymmetric routing or reverse-path filtering (RPFilter) packet drops across VPC subnets."
"""

p4_add = """
    "Furthermore, adopting EKS Pod Identity streamlines cross-account and multi-cluster IAM governance. Because traditional IRSA requires creating an IAM OIDC Identity Provider entry for every EKS cluster, managing hundreds of clusters across multi-account AWS Organizations created significant administrative overhead. EKS Pod Identity solves this by delegating credential negotiation to a native EKS controller, allowing platform teams to bind IAM roles to Kubernetes ServiceAccounts using standard AWS CLI, Terraform, or CloudFormation templates without touching OIDC endpoints."
"""

p5_add = """
    "When architecting production EKS clusters, combining VPC CNI custom networking with Karpenter dynamic provisioning and security groups for pods delivers the ultimate enterprise container platform. Platform engineers achieve granular Layer-4 network isolation, zero RFC 1918 address exhaustion, instantaneous microsecond credential rotation via IRSA, and sub-minute node auto-scaling. These capabilities form the core operational bedrock of modern Fortune 500 mission-critical cloud native deployments."
"""

print("Additions ready")
