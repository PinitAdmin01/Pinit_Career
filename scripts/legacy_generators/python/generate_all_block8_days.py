# Masterclass Generator for Course 5 Month 2 Batch 2: Block 8 (Days 36 to 40)
import json
import hashlib
import os

with open('scripts/java_days36_40_outputs.json', 'r', encoding='utf-8') as f:
    outputs = json.load(f)

# Helper to check word count
def count_words(text_list):
    return sum(len(p.split()) for p in text_list)

# We will define each of the 5 days with rich, deep enterprise explanations
# ensuring every single part has >= 580 words.
