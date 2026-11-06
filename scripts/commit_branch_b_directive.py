import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

wt_b = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"

print("--- Staging BRANCH_B_DIRECTIVE.md in Worktree B ---")
res1 = subprocess.run(['git', 'add', 'BRANCH_B_DIRECTIVE.md'], cwd=wt_b, capture_output=True, text=True)
print(res1.stdout, res1.stderr)

res2 = subprocess.run(['git', 'commit', '-m', 'docs(directive): publish Branch B Tri-Branch Charter for Flagship Commerce Month 2 (400 Days)'], cwd=wt_b, capture_output=True, text=True)
print(res2.stdout, res2.stderr)

res3 = subprocess.run(['git', 'push', 'origin', 'agent/branch-b-curriculum-commerce-iot'], cwd=wt_b, capture_output=True, text=True)
print(res3.stdout, res3.stderr)
