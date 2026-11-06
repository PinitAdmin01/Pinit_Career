import json
import re

STOP_WORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'there',
    'about', 'into', 'more', 'other', 'some', 'such', 'than', 'them', 'then',
    'these', 'they', 'upon', 'what', 'when', 'where', 'whether', 'while', 'will',
    'would', 'also', 'been', 'each', 'even', 'many', 'most', 'much', 'must',
    'only', 'same', 'should', 'very', 'your'
}

def get_words(text):
    words = set(re.findall(r'[a-zA-Z]{4,}', text.lower()))
    return words - STOP_WORDS

with open("scripts/branch_c/day41_lesson.json", "r", encoding="utf-8") as f:
    d = json.load(f)

for idx, p in enumerate(d["parts"]):
    print(f"\n--- PART {idx+1} ---")
    s0 = p["say"][0]
    s1 = p["say"][1]
    ex = p["example"]
    tr = p["tryIt"]
    print("s0 words:", sorted(list(get_words(s0)))[:10])
    print("s1 words:", sorted(list(get_words(s1)))[:10])
    print("ex words:", sorted(list(get_words(ex)))[:10])
    print("tr words:", sorted(list(get_words(tr)))[:10])
