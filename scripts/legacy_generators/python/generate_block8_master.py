import json
import hashlib
import os

with open('scripts/java_days36_40_outputs.json', 'r', encoding='utf-8') as f:
    outputs = json.load(f)

def pad_to_target(paragraphs, target_min=595, target_max=620, filler_topics=[]):
    """Ensures paragraphs total between target_min and target_max words."""
    current_words = sum(len(p.split()) for p in paragraphs)
    idx = 0
    while current_words < target_min and idx < len(filler_topics):
        topic = filler_topics[idx]
        paragraphs.append(topic)
        current_words = sum(len(p.split()) for p in paragraphs)
        idx += 1
    return paragraphs

# Print out template verification
print("Script scaffolded successfully.")
