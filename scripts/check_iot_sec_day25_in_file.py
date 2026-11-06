with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.rfind('"day": 25')
tail = text[idx:]
p5_idx = tail.find('Complete Device Lifecycle')
print("Part 5 title found at:", p5_idx)
code_idx = tail.find('"code":', p5_idx)
print("Code slice:", repr(tail[code_idx:code_idx+200]))
