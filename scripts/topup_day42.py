with open('scripts/build_day42_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'Run this verified harness to complete your mastery of advanced IAM and zero-trust identity architectures on AWS!"'
extra = '''Run this verified harness to complete your mastery of advanced IAM and zero-trust identity architectures on AWS!",
    "Additionally, enterprise infrastructure teams encode these zero-trust identity guardrails into infrastructure as code (IaC) linting rules using tools like Checkov, tfsec, and cfn-nag. These static analysis scanners evaluate every Terraform and AWS CDK definition before deployment, automatically failing CI/CD builds if an IAM role policy statement is defined with wildcard actions on wildcard resources ('Action: *', 'Resource: *') or lacks an explicit permission boundary attachment. By enforcing these guardrails deterministically in code and continuously validating runtime identity telemetry, organizations establish an impenetrable Zero-Trust perimeter across their multi-account AWS cloud estate."'''

if target in c:
    c = c.replace(target, extra)
    with open('scripts/build_day42_cloud.py', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Part 5 topup successful")
else:
    print("Target not found")
