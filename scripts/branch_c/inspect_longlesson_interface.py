with open("src/lib/data/longLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("export interface LongLesson")
if idx == -1:
    idx = text.find("interface LongLesson")
print(text[idx:idx+1200])
