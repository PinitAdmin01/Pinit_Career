# scripts/inspect_node_day31.py
with open('src/lib/data/nodeWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('day: 31')
if idx == -1:
    idx = text.find('"day": 31')
print(text[idx:idx+1200])
