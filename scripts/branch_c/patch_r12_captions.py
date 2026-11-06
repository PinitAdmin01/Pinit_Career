import subprocess

# 1. Update build_day33_prompt.py
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day33_prompt.py', 'r', encoding='utf-8') as f:
    text33 = f.read()

text33 = text33.replace(
    '"say2": "Adversarial red team personas actively stress test candidate designs."',
    '"say2": "Domain invariant boundaries define what persona prompts refuse to yield."'
)

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day33_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text33)
print("Updated build_day33_prompt.py caption")

# 2. Update build_day34_prompt.py
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day34_prompt.py', 'r', encoding='utf-8') as f:
    text34 = f.read()

text34 = text34.replace(
    '"say2": "Structural XML tags transform raw text walls into hierarchical databases."',
    '"say2": "The primacy recency sandwich anchors critical operational directives."'
)

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day34_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text34)
print("Updated build_day34_prompt.py caption")

# 3. Update build_day35_prompt.py
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day35_prompt.py', 'r', encoding='utf-8') as f:
    text35 = f.read()

text35 = text35.replace(
    '"say2": "Confidence weighted voting extracts verified mathematical consensus."',
    '"say2": "Automated review councils evaluate candidate thoughts across personas."'
)
text35 = text35.replace(
    '"say2": "Prefix caching standardization slashes cloud costs and latency overheads."',
    '"say2": "Salience aware compilers arrange enterprise corpora in sandwich patterns."'
)
text35 = text35.replace(
    '"say2": "OpenTelemetry distributed tracing provides real time system visibility."',
    '"say2": "Decoupled microservices communicate across an asynchronous service bus."'
)

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day35_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text35)
print("Updated build_day35_prompt.py captions")

# Re-run all 3 builders
for d in [33, 34, 35]:
    script = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day{d}_prompt.py'
    res = subprocess.run(['python', script], capture_output=True, text=True)
    assert res.returncode == 0, f"Error running day {d}: {res.stderr}"
    print(f"Re-generated Day {d} successfully!")

# Re-assemble promptPythonLongLessons.ts
res_ass = subprocess.run(['python', 'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/assemble_block7_prompt.py'], capture_output=True, text=True)
assert res_ass.returncode == 0, f"Error assembling: {res_ass.stderr}"
print(res_ass.stdout)
