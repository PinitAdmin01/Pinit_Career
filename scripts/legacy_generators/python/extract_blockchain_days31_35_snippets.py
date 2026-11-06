import re
import json

with open("scripts/blockchain_days31_35_snippets.ts", "r", encoding="utf-8") as f:
    ts_code = f.read()

# Pattern matching capture('key', () => { ... \n});
pattern = r"capture\('([^']+)', \(\) => \{(.*?)\n\}\);"
matches = re.findall(pattern, ts_code, re.DOTALL)

with open("scripts/blockchain_days31_35_outputs.json", "r", encoding="utf-8") as f:
    outputs = json.load(f)

snippets_dict = {}
for name, body in matches:
    raw_lines = body.split("\n")
    processed_lines = []
    for line in raw_lines:
        if line.startswith("  "):
            processed_lines.append(line[2:])
        elif line.startswith("\t"):
            processed_lines.append(line[1:])
        else:
            processed_lines.append(line)
    clean_body = "\n".join(processed_lines).strip()
    
    snippets_dict[name] = {
        "code": clean_body,
        "output": outputs.get(name, "")
    }

print(f"Extracted {len(snippets_dict)} snippets.")
with open("scripts/blockchain_days31_35_snippets_dict.json", "w", encoding="utf-8") as f:
    json.dump(snippets_dict, f, indent=2, ensure_ascii=False)
print("Saved scripts/blockchain_days31_35_snippets_dict.json")
