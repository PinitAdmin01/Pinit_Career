import json
import hashlib
import os

def word_count(text_or_list):
    if isinstance(text_or_list, list):
        full_text = " ".join(text_or_list)
    else:
        full_text = str(text_or_list)
    return len(full_text.strip().split())

def make_check(q, correct, wrong1, wrong2, wrong3, why):
    return {
        "question": q,
        "options": [correct, wrong1, wrong2, wrong3],
        "answer": 0,
        "why": why
    }

from generate_block1_gold_standard import DAY_1, DAY_2

print(f"Day 1 parts: {len(DAY_1['parts'])}, Day 2 parts: {len(DAY_2['parts'])}")
