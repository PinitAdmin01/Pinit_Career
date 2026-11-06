import json
import re

STOP_WORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'what', 'when', 'your', 'will',
    'then', 'them', 'they', 'some', 'each', 'also', 'just', 'into', 'only', 'more',
    'here', 'make', 'like', 'than', 'been', 'there', 'their', 'which', 'about', 'would',
    'could', 'should', 'other', 'these', 'those', 'after', 'first', 'where', 'while',
    'being', 'does', 'doing', 'look', 'same', 'over', 'such', 'most'
}

def get_words(text):
    return {w for w in re.findall(r'[a-z0-9]+', text.lower()) if len(w) >= 4 and w not in STOP_WORDS}

with open("scripts/branch_c/day36_lesson.json") as f:
    lesson = json.load(f)

for i, part in enumerate(lesson["parts"]):
    print(f"=== PART {i+1} ===")
    w_say0 = get_words(part["say"][0])
    w_say1 = get_words(part["say"][1])
    w_ex = get_words(part["example"])
    w_try = get_words(part["tryIt"])
    print("say0 candidates:", list(w_say0)[:8])
    print("say1 candidates:", list(w_say1)[:8])
    print("example candidates:", list(w_ex)[:8])
    print("tryIt candidates:", list(w_try)[:8])
