with open("src/lib/visuals/gate.ts", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("R1:")
if idx != -1:
    print(text[idx:idx+600])
