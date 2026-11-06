import json

for d in range(6, 11):
    with open(f"scripts/bcom_fin_day{d}_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    part_words = []
    for p in data["parts"]:
        text = p["say"]
        if isinstance(text, list):
            text = " ".join(text)
        part_words.append(len(text.split()))
    total = sum(part_words)
    print(f"Day {d}: Total {total} words, Parts: {part_words}, Minutes: {data['minutes']}")
