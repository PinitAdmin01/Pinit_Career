import subprocess
import json
import os

with open('scripts/test_cloud_day31_snippets.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Execute the definitions
g = {}
exec(text, g)
snippets = g['snippets']

outputs = []
for i, code in enumerate(snippets):
    temp_path = f'temp_snippet_{i+1}.ts'
    with open(temp_path, 'w', encoding='utf-8') as tf:
        tf.write(code)
    res = subprocess.run(['npx', 'tsx', temp_path], capture_output=True, text=True, shell=True)
    if os.path.exists(temp_path):
        os.remove(temp_path)
    if res.returncode != 0:
        print(f"Error {i+1}:", res.stderr)
        outputs.append("")
    else:
        out = res.stdout.strip()
        print(f"=== Snippet {i+1} Output ===")
        print(out)
        outputs.append(out)

with open('scripts/cloud_day31_outputs.json', 'w', encoding='utf-8') as f:
    json.dump(outputs, f, indent=2)

print("\nSaved all outputs to scripts/cloud_day31_outputs.json")
