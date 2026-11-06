# scripts/archive_colliding_untracked.py
import subprocess
import os
import shutil

repo = r"C:\Users\Admin\Desktop\projects\Present-Career-os"
out = subprocess.check_output(['git', '-C', repo, 'ls-tree', '-r', '--name-only', 'origin/agent/branch-b-curriculum-commerce-iot'], text=True)
b_files = set(out.strip().splitlines())

status_out = subprocess.check_output(['git', '-C', repo, 'status', '--porcelain'], text=True)
untracked = [line[3:].strip() for line in status_out.splitlines() if line.startswith('??')]

colliding = [f for f in untracked if f in b_files]
print(f"Archiving {len(colliding)} colliding untracked files...")

archive_dir = os.path.join(repo, "scripts", "archive_branch_a_temp")
os.makedirs(archive_dir, exist_ok=True)

for rel_path in colliding:
    src = os.path.join(repo, rel_path)
    dest = os.path.join(archive_dir, os.path.basename(rel_path))
    shutil.move(src, dest)
    print(f"Moved {rel_path} -> scripts/archive_branch_a_temp/{os.path.basename(rel_path)}")

print("Done archiving colliding untracked files!")
