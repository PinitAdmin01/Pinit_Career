with open('scripts/build_day45_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'embodying the gold standard of modern cloud security engineering."'
extra = '''embodying the gold standard of modern cloud security engineering.",
    "Additionally, Site Reliability Engineering teams integrate automated runbooks with Amazon GuardDuty and AWS Security Hub to enforce automated remediation for high-severity findings. If an unauthorized IAM modification or unusual API call occurs within the CDE, automated EventBridge rules trigger an AWS Step Functions state machine that quarantines the affected resource, alerts on-call security engineers, and logs the incident to CloudTrail Lake within seconds, ensuring continuous, bulletproof defense across the entire financial cloud mesh."'''

if target in c:
    c = c.replace(target, extra)
    with open('scripts/build_day45_cloud.py', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Part 5 topup successful")
else:
    print("Target not found")
