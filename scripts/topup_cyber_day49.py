import json
import re

topup_p2 = [
    "To achieve airtight organizational isolation, enterprise cloud security architects pair Service Control Policies with IAM Permission Boundaries. While an SCP establishes an organization-wide ceiling enforced at the AWS Organizations root, an IAM Permission Boundary is an advanced IAM feature attached directly to IAM users and roles within individual workload accounts. A permission boundary uses a managed policy to determine the maximum permissions that an identity-based policy can grant to an IAM entity. For instance, in delegated developer environments where software engineers need authority to create IAM roles for Lambda functions, administrators attach a permission boundary that strictly forbids creating roles with administrative access or modifying security guardrails. Even if the developer writes an IAM policy granting `*:*`, the effective permissions are strictly clipped to the boundary policy, eliminating privilege escalation.",
    "Furthermore, multi-account governance leverages automated Landing Zones and Account Vending Machines (via AWS Control Tower or custom Terraform modules). When a new business unit requests a cloud environment, the vending machine provisions a pristine account with pre-configured VPC network peering, centralized CloudTrail logging streaming to an immutable S3 bucket in the dedicated Log Archive account, and mandatory GuardDuty threat detection. By combining preventive SCP guardrails with detective controls powered by AWS Config and Security Hub, enterprise cloud estates maintain continuous compliance across hundreds of dynamically provisioned cloud accounts."
]

topup_p3 = [
    "Delving deeper into Infrastructure as Code security, operational teams must implement automated Configuration Drift Detection. In cloud operations, configuration drift occurs when an engineer bypasses version control to make manual modifications in the cloud web console (such as opening a security group port during an emergency outage). Over time, the live cloud infrastructure diverges from the version-controlled Terraform code, reintroducing critical security vulnerabilities. Enterprise CI/CD engines execute scheduled drift detection runs: running `terraform plan -detailed-exitcode` nightly in read-only mode. If drift is detected (exit code 2), the pipeline triggers an automated alert and can automatically execute `terraform apply` to overwrite unauthorized manual changes, restoring the verified golden state.",
    "Crucially, securing IaC source code repositories requires blocking hardcoded secrets at the developer workstation before commits enter git history. Tools like Gitleaks and TruffleHog scan local git commits using regular expressions and Shannon entropy algorithms to identify high-entropy strings matching AWS secret keys, private SSH keys, and API tokens. Once a secret is committed to a git repository, even if immediately deleted in a subsequent commit, it remains permanently accessible in git commit history objects. Integrating pre-commit hooks and GitHub secret scanning guarantees that plaintext credentials can never be pushed to enterprise version control repositories."
]

topup_p4 = [
    "To implement sophisticated enterprise governance beyond static pattern matching, organizations adopt Policy as Code (PaC) frameworks utilizing Open Policy Agent (OPA) and Rego. While static scanners like Checkov evaluate predefined security rules, enterprise environments require custom contextual rules: for example, mandating that all production S3 buckets must be tagged with `CostCenter`, `Owner`, and `DataClassification`, or requiring that production RDS databases enforce automated multi-AZ replication. OPA evaluates the JSON representation of the Terraform plan against declarative Rego policies, providing expressive, Turing-complete evaluation of cloud resource relationships before provisioning.",
    "Additionally, modern DevSecOps pipelines implement formal Security Waiver and Suppression Workflows. In legitimate architectural scenarios (such as an S3 bucket intentionally designed to host a public documentation website), developers must not disable the scanner entirely. Instead, the developer documents a formal waiver using inline code comments (e.g., `#checkov:skip=CKV_AWS_20: Approved public documentation CDN bucket per SEC-4902`). Security teams review these inline suppressions during pull request approvals, ensuring that every deviation from standard baseline security is audited, justified, and time-bounded."
]

topup_p5 = [
    "Synthesizing cloud governance into a complete lifecycle requires bridging build-time IaC validation with runtime Cloud Security Posture Management (CSPM). While static IaC analysis verifies intent at the code level, CSPM platforms (such as Wiz, Prisma Cloud, or AWS Security Hub) continuously ingest cloud API telemetry to evaluate actual runtime configurations against CIS Cloud Benchmarks, identifying vulnerabilities arising from external threat actors or unmanaged legacy assets.",
    "Furthermore, high-maturity cloud defense incorporates Automated Event-Driven Remediation. Using services like Amazon EventBridge and AWS Lambda, cloud security teams deploy real-time response bots: if a developer manually disables S3 bucket encryption or attaches an internet gateway to a private subnet, EventBridge captures the CloudTrail API event in sub-second timeframes and triggers a serverless Lambda function to automatically re-enable encryption or revoke the unauthorized route. By combining programmatic identity boundaries, immutable organizational guardrails, shift-left IaC scanning, and automated runtime remediation, enterprise cloud platforms achieve resilient, self-healing zero-trust architectures."
]

with open("scripts/create_cyber_day49_data.py", "r", encoding="utf-8") as f:
    text = f.read()

new_text = text
for i, topup in enumerate([topup_p2, topup_p3, topup_p4, topup_p5], 2):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    new_text = re.sub(pattern, rf'\1{topup_str}\2', new_text, count=1)

with open("scripts/create_cyber_day49_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day49_data.py with topups!")
