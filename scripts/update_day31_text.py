import json
import hashlib
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_cloud_day31.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Update p3_say and p5_say
p3_extra = '''    "From an operational routing perspective, Linux policy-based routing tables inside the worker node kernel direct traffic arriving from or destined to secondary ENIs. The VPC CNI configures custom route tables (e.g. table 1001, 1002) and ip rule priorities ensuring packets leaving a Pod's veth interface exit through the exact secondary ENI bound to that Pod's secondary subnet. This prevents asymmetric routing or reverse-path filtering (RPFilter) packet drops across VPC subnets.",
    "Furthermore, architects must carefully configure outbound internet egress for secondary CGNAT subnets. Because 100.64.0.0/10 addresses are non-routable on the public internet, any traffic destined outside the VPC must undergo network address translation. By default, the AWS VPC CNI performs local SNAT using the worker node's primary IP for all non-VPC destinations. However, when connecting to corporate on-premises systems via AWS Transit Gateway or Direct Connect, organizations enable `AWS_VPC_K8S_CNI_EXTERNALSNAT=true`. This delegates SNAT to enterprise edge firewalls or AWS NAT Gateways located in public subnets, preserving end-to-end IP auditability for internal compliance."'''

p5_extra = '''    "When analyzing the internal systems lifecycle, the coordination between the Kubernetes kubelet and the local `aws-node` daemon during pod startup is an extraordinary engineering feat. When kubelet receives a scheduling assignment from kube-scheduler, it invokes the Container Network Interface specification through local RPC. The `aws-node` daemon's `ipamd` process evaluates the Pod's target network namespace, reads the local IPAM pool, binds the secondary IP, and configures the Linux kernel's policy routing database using `ip rule` and `iptables` mangle tables in sub-millisecond timeframes.",
    "Observability is the final pillar of enterprise production readiness. The AWS VPC CNI exposes detailed Prometheus metrics on port 61678, streaming critical telemetry such as `awscni_assigned_ip_addresses`, `awscni_total_ip_addresses`, `awscni_eni_allocated`, and `awscni_aws_api_latency_ms`. Cloud platform teams configure Prometheus alerts that fire when subnet IP allocation exceeds 80% capacity or when AWS EC2 API rate-limiting throttles secondary ENI creation. Combined with automated horizontal scaling and Karpenter node provisioning, this comprehensive architecture ensures zero-downtime scalability under hyperscale traffic loads."'''

# Replace p3_say and p5_say in the file
# Let's write the entire script cleanly
