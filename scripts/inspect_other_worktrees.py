import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

for wt, name in [
    (r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce', 'Branch B (Commerce/IoT)'),
    (r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform', 'Branch C (Platform/Admin)')
]:
    print(f"=== {name}: {wt} ===")
    try:
        res = subprocess.run(['git', 'status'], cwd=wt, capture_output=True, text=True)
        print(res.stdout[:500])
        res_log = subprocess.run(['git', 'log', '-n', '3', '--oneline'], cwd=wt, capture_output=True, text=True)
        print("Recent commits:")
        print(res_log.stdout)
    except Exception as e:
        print("Error checking worktree:", e)
