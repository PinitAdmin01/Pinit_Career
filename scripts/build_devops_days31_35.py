import json
import hashlib
import re
import os
import subprocess

from data_devops_day31 import DAY_31
from data_devops_day32 import DAY_32
from data_devops_day33 import DAY_33
from data_devops_day34 import DAY_34
from data_devops_day35 import DAY_35

ALL_DAYS = [DAY_31, DAY_32, DAY_33, DAY_34, DAY_35]

STOPWORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'there',
    'which', 'about', 'would', 'could', 'should', 'these', 'those', 'where',
    'after', 'before', 'while', 'under', 'other', 'into', 'then', 'than',
    'when', 'what', 'some', 'more', 'most', 'such', 'only', 'over', 'also'
}

def extract_meaningful_words(text: str) -> set:
    words = re.findall(r'[a-zA-Z]{4,}', text.lower())
    return {w for w in words if w not in STOPWORDS}

def validate_caption(caption: str, lesson_text: str, context: str):
    assert len(caption) <= 75, f"{context}: caption exceeds 75 chars ({len(caption)}): {caption}"
    assert caption.endswith('.'), f"{context}: caption must end with period: {caption}"
    assert not any(c.isdigit() for c in caption), f"{context}: caption contains digits: {caption}"
    caption_words = extract_meaningful_words(caption)
    lesson_words = extract_meaningful_words(lesson_text)
    shared = caption_words.intersection(lesson_words)
    assert len(shared) >= 2, f"{context}: caption shares < 2 words with lesson text ({shared}): '{caption}'"

print("--- AUDITING WORD COUNTS & INVARIANTS ---")

for day_data in ALL_DAYS:
    day = day_data["day"]
    parts = day_data["parts"]
    assert len(parts) == 5, f"Day {day} must have exactly 5 parts"
    day_words = 0
    for p in parts:
        part_num = p["part"]
        say = p["say"]
        word_count = sum(len(para.split()) for para in say)
        day_words += word_count
        print(f"Day {day} Part {part_num} words: {word_count}")
        assert word_count >= 580, f"Day {day} Part {part_num} has {word_count} words (< 580)!"
        assert p.get("example"), f"Day {day} Part {part_num} missing example"
        assert p.get("code"), f"Day {day} Part {part_num} missing code"
        assert p.get("output"), f"Day {day} Part {part_num} missing output"
        assert len(p.get("codeNotes", [])) >= 3, f"Day {day} Part {part_num} codeNotes < 3"
        assert p.get("tryIt"), f"Day {day} Part {part_num} missing tryIt"
        assert p.get("check"), f"Day {day} Part {part_num} missing check"
        assert p["check"]["answer"] == 0, f"Day {day} Part {part_num} check answer != 0"
        assert len(p["check"]["options"]) == 4, f"Day {day} Part {part_num} check options != 4"
    print(f"Day {day} total words: {day_words}")
    assert day_words >= 3000, f"Day {day} total words {day_words} < 3000!"

print("--- ALL 5 DAYS PASSED WORD COUNT & INVARIANT CHECKS! ---")
