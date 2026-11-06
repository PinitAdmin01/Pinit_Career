import sys
import re
from expand_day50_parts import P5_ADD

with open('scripts/build_day50_final.py', 'r', encoding='utf-8') as f:
    text = f.read()

p5_idx = text.find('"id": "p5"')
print(text[p5_idx:p5_idx+200])

def count_words(say_list):
    total = 0
    for p in say_list:
        total += len(re.findall(r"\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b", p))
    return total

print("P5_ADD words:", count_words(P5_ADD))
