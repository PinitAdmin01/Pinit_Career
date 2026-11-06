import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/audit_cross_branch_status.py', 'r', encoding='utf-8') as f:
    print(f.read()[:3000])
