import json

with open('scripts/react_day59.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

d['parts'][3]['check'] = {
    "question": "Why does RFC-0104 mandate strict Zod runtime schema validation for all Server-Driven UI component payloads?",
    "options": [
        "To enforce immutable structural contracts at domain boundaries and validate runtime data since TypeScript types are erased at compile time",
        "To compile CSS files into single JavaScript bundles",
        "Zod generates automatic cryptocurrency tokens on every validation pass"
    ],
    "answer": 0,
    "why": "TypeScript types are erased during compilation; Zod provides vital runtime schema validation at domain boundaries to guarantee type safety and prevent runtime crashes."
}

with open('scripts/react_day59.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

with open('scripts/react_day59_data.py', 'w', encoding='utf-8') as f:
    f.write(f"DAY_59 = {json.dumps(d, indent=2)}\n")

print("Fixed Day 59 Part 4 check!")
