with open("src/lib/visuals/gate.ts", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("caption")
while idx != -1:
    print("--- MATCH AT", idx, "---")
    print(text[max(0, idx-50):min(len(text), idx+300)])
    idx = text.find("caption", idx+300)
