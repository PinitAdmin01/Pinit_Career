with open('scripts/build_day46_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Part 1 extra paragraph
p1_target = 'flawless topological order with zero cycles."'
p1_extra = '''flawless topological order with zero cycles.",
    "Additionally, enterprise infrastructure architectures leverage Terraform Module Registries and semantic version pinning to guarantee reproducibility across multi-account deployments. By referencing pinned module versions (such as ref equals v2 dot 4 dot 0), platform teams prevent unexpected upstream breaking changes from disrupting production builds. Automated Dependabot or Renovate pipelines scan module dependencies continuously, proposing automated pull requests with changelogs and security vulnerability assessments, ensuring that the cloud platform remains patched, resilient, and enterprise-grade."'''

# Part 2 extra paragraph
p2_target = 'without duplicating resource declarations."'
p2_extra = '''without duplicating resource declarations.",
    "Furthermore, Terragrunt simplifies multi-account AWS Organizations management through dynamic IAM assume role configuration. In the root terragrunt hcl file, platform architects define an iam role attribute that dynamically evaluates the target AWS account ID based on the directory path (e.g., accounts/prod/us-east-1). When Terragrunt executes, it automatically calls AWS STS AssumeRole to obtain short-lived credentials for the target account before invoking Terraform, eliminating the need to manage static credentials or switch AWS CLI profiles manually."'''

# Part 3 extra paragraph
p3_target = 'preserving production cloud infrastructure with zero downtime."'
p3_extra = '''preserving production cloud infrastructure with zero downtime.",
    "Additionally, platform engineers combine declarative moved blocks with automated pull request linting using tf-summarize and infracost. Infracost analyzes the planned resource changes and projects the exact delta in monthly cloud spend, while tf-summarize generates clean tabular views of created, updated, and moved resources. When senior architects review the pull request, the clear moved indicator proves definitively that no production database or stateful network interface will suffer recreation, maintaining 100% operational uptime."'''

# Part 4 extra paragraph
p4_target = 'safely releases an orphaned lock via force-unlock to resume operations."'
p4_extra = '''safely releases an orphaned lock via force-unlock to resume operations.",
    "From an enterprise disaster recovery perspective, platform teams enforce cross-region replication on the remote state S3 bucket. Using AWS S3 Cross-Region Replication (CRR) combined with KMS multi-region customer managed keys, every state change committed in the primary region is replicated asynchronously to a secondary disaster recovery region within seconds. If a regional AWS outage degrades S3 access in the primary region, the CI/CD pipeline can immediately fail over to the secondary bucket replica, ensuring continuous deployment capabilities."'''

# Part 5 extra paragraph
p5_target = 'Run this verified harness to conclude your mastery of enterprise Infrastructure as Code on AWS!"'
p5_extra = '''Run this verified harness to conclude your mastery of enterprise Infrastructure as Code on AWS!",
    "Finally, enterprise Site Reliability Engineering teams integrate automated rollback and self-healing mechanisms into the GitOps pipeline. If an applied change triggers CloudWatch error rate alarms within fifteen minutes of deployment, an automated AWS Systems Manager runbook executes an automated Git revert commit and triggers a rollback pipeline run. By pairing declarative infrastructure with automated verification and instantaneous rollback capabilities, platform engineering teams deliver autonomous, enterprise-grade cloud operations."'''

if p1_target in c:
    c = c.replace(p1_target, p1_extra)
if p2_target in c:
    c = c.replace(p2_target, p2_extra)
if p3_target in c:
    c = c.replace(p3_target, p3_extra)
if p4_target in c:
    c = c.replace(p4_target, p4_extra)
if p5_target in c:
    c = c.replace(p5_target, p5_extra)

with open('scripts/build_day46_cloud.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated build_day46_cloud.py with 8 dense paragraphs per part!")
