with open("src/lib/visuals/gate.ts", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("case 'table':")
print(text[idx:idx+800])
