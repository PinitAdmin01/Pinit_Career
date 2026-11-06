import subprocess

for d in [31, 32]:
    p = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day{d}_prompt.py'
    with open(p, 'r', encoding='utf-8') as f:
        text = f.read()
    text = text.replace("with open('scripts/branch_c/prompt_day", "with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day")
    text = text.replace("with open('src/lib/data/lessonVisuals/prompt-py/day-", "with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-")
    with open(p, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Fixed paths in Day {d}")

# Re-run all 5 builders
for d in [31, 32, 33, 34, 35]:
    script = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day{d}_prompt.py'
    res = subprocess.run(['python', script], capture_output=True, text=True)
    assert res.returncode == 0, f"Error building Day {d}: {res.stderr}"
    print(f"Re-built Day {d} successfully!")

# Re-assemble promptPythonLongLessons.ts
res_ass = subprocess.run(['python', 'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/assemble_block7_prompt.py'], capture_output=True, text=True)
assert res_ass.returncode == 0, f"Error assembling: {res_ass.stderr}"
print(res_ass.stdout)
