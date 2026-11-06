import sys
sys.path.insert(0, 'scripts')
from react_day49_data import get_day49_data

d = get_day49_data()
d['parts'][2]['output'] = '''--- VIRTUAL NODE GRAPH LAYOUT SERIALIZATION ---
Root Width: 32 | Height: 6
Panel Width: 28 | Height: 4

Rendered Virtual Node Tree:
+-- <ScreenContainer> [32x6]
    +-- <OrderPanel> [28x4]
        "BID: $150.25 (Size: 500)"
        "ASK: $150.30 (Size: 250)"'''

out_lines = [
    "# scripts/react_day49_data.py",
    "import json",
    "",
    "def get_day49_data():",
    f"    return {repr(d)}",
    "",
    "if __name__ == '__main__':",
    "    data = get_day49_data()",
    "    total_words = 0",
    "    print(f\"Day {data['day']}: {data['title']}\")",
    "    for i, p in enumerate(data['parts']):",
    "        w = sum(len(s.split()) for s in p['say'])",
    "        total_words += w",
    "        print(f\"  Part {i+1}: {w} words\")",
    "    print(f\"Total Words: {total_words}\")"
]

with open('scripts/react_day49_data.py', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))
print("Updated Day 49 Part 3 output cleanly!")
