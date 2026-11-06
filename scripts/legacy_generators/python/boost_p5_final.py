import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_cloud_day32.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = '    "Furthermore, Karpenter provides first-class support for stateful and accelerated workloads'
replace = '''    "Platform architects must also integrate automated budget alerts and cost anomaly detection alongside Karpenter. By analyzing AWS Cost and Usage Reports (CUR) partitioned by Karpenter NodePool tags, FinOps teams trace infrastructure expenditures directly back to business units, proving significant ROI and ensuring continuous financial governance across modern container platforms.",
    "Furthermore, Karpenter provides first-class support for stateful and accelerated workloads'''

text = text.replace(target, replace)

with open('scripts/build_cloud_day32.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added FinOps paragraph to Part 5!")
