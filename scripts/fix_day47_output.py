# scripts/fix_day47_output.py
import json

path = 'scripts/react_day47.json'
d = json.load(open(path, 'r', encoding='utf-8'))
d['parts'][0]['output'] = """--- BOOLEAN SPAGHETTI VS FINITE STATE AUTOMATA ---
Boolean Flags: { isLoading: false, isSuccess: true, isError: true }
Boolean Impossible State Detected: true
FSM Final State: SUCCESS
FSM Impossible State Risk: ZERO (MATHEMATICALLY IMPOSSIBLE)"""

with open(path, 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

out_lines = [
    '# scripts/react_day47_data.py',
    'import json',
    '',
    'def get_day47_data():',
    f'    return {repr(d)}',
    '',
    'if __name__ == "__main__":',
    '    data = get_day47_data()',
    '    total_words = 0',
    '    print(f"Day {data[\'day\']}: {data[\'title\']}")',
    '    for i, p in enumerate(data[\'parts\']):',
    '        w = sum(len(s.split()) for s in p[\'say\'])',
    '        total_words += w',
    '        print(f"  Part {i+1}: {w} words")',
    '    print(f"Total Words: {total_words}")'
]
with open('scripts/react_day47_data.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))
print('Updated Day 47 Part 1 output successfully!')
