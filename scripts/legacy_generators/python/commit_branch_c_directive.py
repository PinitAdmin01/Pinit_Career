import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

wt_c = r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform"

print("--- Staging BRANCH_C_DIRECTIVE.md in Worktree C ---")
res1 = subprocess.run(['git', 'add', 'BRANCH_C_DIRECTIVE.md'], cwd=wt_c, capture_output=True, text=True)
print(res1.stdout, res1.stderr)

res2 = subprocess.run(['git', 'commit', '-m', 'docs(directive): publish Branch C Tri-Branch Charter for Python AI & Quantitative Data Month 2 (360 Days)'], cwd=wt_c, capture_output=True, text=True)
print(res2.stdout, res2.stderr)

res3 = subprocess.run(['git', 'push', 'origin', 'agent/branch-c-platform-admin-faculty'], cwd=wt_c, capture_output=True, text=True)
print(res3.stdout, res3.stderr)
