with open("src/lib/visuals/gate.ts", "r", encoding="utf-8") as f:
    text = f.read()

for t in ["case 'bars':", "case 'table':", "case 'tree-graph':", "case 'compare':"]:
    idx = text.find(t)
    if idx != -1:
        print("=== " + t + " ===")
        print(text[idx:idx+300])
