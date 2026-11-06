#!/usr/bin/env python3
"""
generate_iot_edge_block9.py
Generates Course 18 (iot_edge) Month 2 Block 9 (Days 41–45) LongLessons.
Strict Invariants:
- 5 parts per day.
- say >= 580 words per part (target >= 600 words).
- minutes: 38 declared duration.
- tryIt is plain string.
- codeNotes >= 3 items.
- summary >= 4 items.
- projectStep.steps >= 4 items.
- check: 4 options, answer: 0, thorough why.
"""

import json
import os

def word_count(text):
    return len(text.split())

def ensure_word_count(text, min_words=600):
    words = text.split()
    if len(words) >= min_words:
        return text
    # Should be pre-crafted to exceed min_words, but safeguard if needed
    raise ValueError(f"Text has only {len(words)} words, required {min_words}")

print("Preparing Day 41 - 45 generation...")
