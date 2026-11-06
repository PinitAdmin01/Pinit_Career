with open('scripts/build_day46_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'eliminating the need to manage static credentials or switch AWS CLI profiles manually."'
extra = '''eliminating the need to manage static credentials or switch AWS CLI profiles manually.",
    "Additionally, Terragrunt optimizes continuous delivery performance in large monorepos through the terragrunt run-all plan --terragrunt-parallelism command. Instead of executing environments serially across dozens of AWS accounts, Terragrunt resolves the global DAG across all child terragrunt.hcl files and executes speculative plans concurrently. If an upstream VPC module is modified, Terragrunt automatically detects downstream dependency modules—such as Kubernetes clusters and RDS databases—and includes them in the speculative plan, preventing unverified breaking changes from reaching production.",
    "To guarantee environment consistency across distributed developer teams, platform architects mandate Terragrunt version constraints and hook automation. Using before_hook and after_hook declarations in terragrunt.hcl, teams automatically run tflint and checkov before executing Terraform, and stream Slack notifications or Datadog metrics upon apply completion. By embedding policy checks directly into the orchestration lifecycle, organizations eliminate configuration drift and achieve sovereign GitOps compliance."'''

assert target in c, "target not found in build_day46_cloud.py"
c = c.replace(target, extra)

with open('scripts/build_day46_cloud.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Added paragraphs to p2_say successfully!")
