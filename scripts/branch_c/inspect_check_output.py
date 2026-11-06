with open("scripts/visuals/check.mts", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("PASS")
if idx == -1:
    idx = text.find("pictureCount")
print(text[idx-100:idx+400])
