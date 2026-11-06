# -*- coding: utf-8 -*-
"""
Extract clean text for Block 10 (Days 46-50) from docs/visuals/PINIT_MASTER_DEBUG.html.
"""

import re
from html import unescape

with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8") as f:
    text = f.read()

positions = {
    46: 11238057,
    47: 11245643,
    48: 11253528,
    49: 11261182,
    50: 11268662,
    51: 11276120
}

def clean_html(html_chunk):
    # Remove script/style
    chunk = re.sub(r'<script.*?</script>', '', html_chunk, flags=re.DOTALL)
    chunk = re.sub(r'<style.*?</style>', '', chunk, flags=re.DOTALL)
    # Replace tags with spaces
    chunk = re.sub(r'<[^>]+>', ' ', chunk)
    # Unescape html entities
    chunk = unescape(chunk)
    # Collapse whitespace
    chunk = re.sub(r'\s+', ' ', chunk).strip()
    return chunk

for d in range(46, 51):
    start = positions[d]
    end = positions[d + 1]
    raw = text[start:end]
    cleaned = clean_html(raw)
    out_file = f"scripts/blockchain_day_{d}_clean.txt"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(cleaned)
    print(f"Day {d}: extracted {len(cleaned.split())} words into {out_file}")
    print(f"Title / First 150 chars: {cleaned[:150]}")
