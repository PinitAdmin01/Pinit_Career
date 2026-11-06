import json
import re

def split_into_paragraphs(say_text, num_paragraphs=5):
    if isinstance(say_text, list):
        return say_text
    sentences = re.split(r'(?<=[.!?])\s+', say_text.strip())
    k, m = divmod(len(sentences), num_paragraphs)
    paragraphs = []
    start = 0
    for i in range(num_paragraphs):
        end = start + k + (1 if i < m else 0)
        para = ' '.join(sentences[start:end])
        paragraphs.append(para)
        start = end
    return paragraphs

for day in [57, 58, 59, 60]:
    file_path = f'scripts/quant_day{day}.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    
    for p in d['parts']:
        p['say'] = split_into_paragraphs(p['say'], 5)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2)
    print(f"Re-formatted Day {day} parts say into 5-paragraph arrays.")

print("All Days 57-60 parts say converted to paragraph arrays.")
