import json

with open('scripts/react_day51.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

d['parts'][1]['output'] = """--- ROUTE GROUP URL NORMALIZATION & ISOLATION ---
URL: /about       -> Group: (marketing)    | Layout: MarketingPublicLayout
URL: /pricing     -> Group: (marketing)    | Layout: MarketingPublicLayout
URL: /analytics   -> Group: (dashboard)    | Layout: DashboardProtectedLayout
URL: /settings    -> Group: (dashboard)    | Layout: DashboardProtectedLayout"""

with open('scripts/react_day51.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

out_lines = [
    '# scripts/react_day51_data.py',
    'import json',
    '',
    'def get_day51_data():',
    f'    return {repr(d)}',
    '',
    'if __name__ == "__main__":',
    '    data = get_day51_data()',
    '    total_words = 0',
    '    print(f"Day {data[\'day\']}: {data[\'title\']}")',
    '    for i, p in enumerate(data[\'parts\']):',
    '        w = sum(len(s.split()) for s in p[\'say\'])',
    '        total_words += w',
    '        print(f"  Part {i+1}: {w} words")',
    '    print(f"Total Words: {total_words}")'
]
with open('scripts/react_day51_data.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))

print('Updated Day 51 Part 2 output!')
