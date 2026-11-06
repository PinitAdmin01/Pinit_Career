import json

with open('src/lib/data/gitVersionControlPilotDays.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('= [') + 2
end = text.rfind('];')
days = json.loads(text[start:end+1].strip())
for d in days:
    if 6 <= d['day'] <= 10:
        print(f"\n==========================================")
        print(f"Day {d['day']}: {d['title']}")
        print(f"Overview: {d.get('overviewMetaphor', '')}")
        for b in d.get('blocks', []):
            print(f"  Block {b['blockNumber']}: {b['title']}")
            print(f"    Concept: {b.get('conceptBudget', {}).get('primaryConcept')}")
            print(f"    Terms: {b.get('conceptBudget', {}).get('supportingTerms')}")
