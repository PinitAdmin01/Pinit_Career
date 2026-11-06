import json, re

for day, path in [(57, 'scripts/branch_c/build_day57.py'), (58, 'scripts/branch_c/build_day58.py')]:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # replace V8 with Engine, V1 with Primary
    content = content.replace('V8 Object Graph Buffer Ingestion', 'Engine Object Graph Buffer Ingestion')
    content = content.replace('Policy V1 Pod Eviction Endpoint', 'Policy Primary Pod Eviction Endpoint')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {path}")
