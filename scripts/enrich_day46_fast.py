with open('scripts/build_day46_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Part 2 addition (~80 words)
p2_target = 'without static credentials or switch AWS CLI profiles manually."'
p2_add = '''without static credentials or switch AWS CLI profiles manually.",
    "Additionally, Terragrunt optimizes continuous delivery performance in large monorepos through the terragrunt run-all plan --terragrunt-parallelism command. Instead of executing environments serially across dozens of AWS accounts, Terragrunt resolves the global DAG across all child terragrunt.hcl files and executes speculative plans concurrently. If an upstream VPC module is modified, Terragrunt automatically detects downstream dependency modules—such as Kubernetes clusters and RDS databases—and includes them in the speculative plan, preventing unverified breaking changes from reaching production."'''

# Part 3 addition (~70 words)
p3_target = 'maintaining 100% operational uptime."'
p3_add = '''maintaining 100% operational uptime.",
    "Furthermore, declarative moved blocks provide essential safety when refactoring Terraform module structures across major version boundaries. When migrating from a legacy community module to an internal enterprise module, resource address structures inevitably change. By embedding declarative moved blocks within the consumer configuration, platform teams allow developer teams to upgrade module version pins seamlessly via pull requests without scheduling maintenance windows or requiring manual state interventions from senior cloud infrastructure specialists."'''

# Part 4 addition (~70 words)
p4_target = 'ensuring continuous deployment capabilities."'
p4_add = '''ensuring continuous deployment capabilities.",
    "To guard against inadvertent state file exposure or accidental deletion, enterprise platform teams deploy dedicated AWS Config rules and Service Control Policies (SCPs) protecting the remote state infrastructure. An SCP attached at the root of AWS Organizations blocks any IAM principal—including account root users—from deleting the state S3 bucket or modifying DynamoDB lock table schemas. Concurrently, S3 Bucket Object Lock enforces WORM retention for state version histories, preventing ransomware or malicious insider actors from destroying historical infrastructure state."'''

# Part 5 addition (~130 words)
p5_target = 'deliver autonomous, enterprise-grade cloud operations."'
p5_add = '''deliver autonomous, enterprise-grade cloud operations.",
    "Furthermore, enterprise platforms enforce zero-trust blast radius containment by decomposing monolithic state files into decoupled state boundaries. Instead of storing an entire cloud estate within a single state file, platform architects separate infrastructure into discrete state tiers: network tier, compute tier, data tier, and application tier. Each tier maintains an independent remote state file with isolated DynamoDB locks. If an unexpected error occurs during an application tier deployment, the network and database tiers remain completely untouched and locked against unintended mutations.",
    "From an auditability standpoint, all Terraform plan and apply execution outputs are ingested into AWS Security Lake and CloudWatch Logs in structured JSON format. SRE teams query apply run metrics using Amazon Athena, monitoring resource provisioning durations, failure rates, and provider API throttling incidents. This real-time telemetry allows platform leadership to continuously optimize concurrency thresholds and eliminate deployment bottlenecks across the global enterprise cloud fleet."'''

if p2_target in c:
    c = c.replace(p2_target, p2_add)
if p3_target in c:
    c = c.replace(p3_target, p3_add)
if p4_target in c:
    c = c.replace(p4_target, p4_add)
if p5_target in c:
    c = c.replace(p5_target, p5_add)

with open('scripts/build_day46_cloud.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Enrichment complete in build_day46_cloud.py!")
