import os
import re
import json
import glob

workspaces = {
    "Branch_A (Tech/Present-Career-os)": r"C:\Users\Admin\Desktop\projects\Present-Career-os",
    "Branch_B (Commerce/Present-Career-os-commerce)": r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce",
    "Branch_C (Platform/Present-Career-os-platform)": r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform"
}

print("=== CHECKING WORKSPACE BRANCHES ===")
import subprocess
for name, path in workspaces.items():
    if os.path.exists(path):
        res = subprocess.run(["git", "branch", "--show-current"], cwd=path, capture_output=True, text=True)
        head = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=path, capture_output=True, text=True)
        print(f"{name}: branch '{res.stdout.strip()}' at {head.stdout.strip()}")
    else:
        print(f"{name}: PATH NOT FOUND")

