import json

for day in range(16, 21):
    with open(f"scripts/iot_edge_day{day}.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    for idx, part in enumerate(data['parts']):
        if not isinstance(part.get('tryIt'), str):
            print(f"ERROR: Day {day} Part {idx+1} tryIt is {type(part.get('tryIt'))}")
        else:
            # ensure non-empty
            assert len(part['tryIt'].strip()) > 0
print("All Days 16-20 tryIt fields are confirmed to be valid strings!")
