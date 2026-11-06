# scripts/sync_exact_outputs.py
import json, subprocess

for d in range(46, 51):
    path = f'scripts/react_day{d}.json'
    data = json.load(open(path, 'r', encoding='utf-8'))
    updated = False
    for i, p in enumerate(data['parts']):
        res = subprocess.run(['node', '-e', p['code']], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error executing Day {d} Part {i+1}:", res.stderr)
            continue
        actual = res.stdout.strip()
        expected = p['output'].strip()
        if actual != expected:
            print(f"Syncing output for Day {d} Part {i+1}")
            p['output'] = actual
            updated = True
    if updated:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        out_lines = [
            f"# scripts/react_day{d}_data.py",
            "import json",
            "",
            f"def get_day{d}_data():",
            f"    return {repr(data)}",
            "",
            "if __name__ == '__main__':",
            f"    data = get_day{d}_data()",
            "    total_words = 0",
            "    print(f\"Day {data['day']}: {data['title']}\")",
            "    for i, p in enumerate(data['parts']):",
            "        w = sum(len(s.split()) for s in p['say'])",
            "        total_words += w",
            "        print(f\"  Part {i+1}: {w} words\")",
            "    print(f\"Total Words: {total_words}\")"
        ]
        with open(f'scripts/react_day{d}_data.py', 'w', encoding='utf-8') as f:
            f.write('\n'.join(out_lines))
        print(f"Updated Day {d} files!")
print("Sync complete.")
