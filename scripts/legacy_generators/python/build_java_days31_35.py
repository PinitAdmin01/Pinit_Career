import json
import hashlib
import os

outputs_path = os.path.join(os.getcwd(), 'scripts', 'java_days31_35_outputs.json')
with open(outputs_path, 'r', encoding='utf-8') as f:
    outputs = json.load(f)

print(f"Loaded {len(outputs)} output entries.")
