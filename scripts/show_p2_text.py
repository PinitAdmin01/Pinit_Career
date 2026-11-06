with open('scripts/build_day42.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_idx = text.find('Low-Rank Adaptation (LoRA) Mechanics')
example_idx = text.find('"example":', p2_idx)
print(text[example_idx-400:example_idx])
