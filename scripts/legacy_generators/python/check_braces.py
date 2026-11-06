import json

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('"day": 13,')
start_pos = text.rfind('{', 0, pos)
next_bracket = text.find('\n];', pos)
end_pos = text.rfind('}', start_pos, next_bracket) + 1

day_slice = text[start_pos:end_pos].strip()
print("day_slice length:", len(day_slice))
try:
    lesson = json.loads(day_slice)
    print("SUCCESS: JSON parsed cleanly!")
    print("Day:", lesson.get("day"))
    print("Title:", lesson.get("title"))
    words = sum(len(" ".join(p.get("say", [])).split()) for p in lesson.get("parts", []))
    print(f"Total Words: {words} (~{words/150:.1f} mins)")
    for i, p in enumerate(lesson.get("parts", [])):
        pw = len(" ".join(p.get("say", [])).split())
        print(f"  Part {i+1}: {pw} words")
except Exception as e:
    print("FAILED JSON PARSE:", e)
