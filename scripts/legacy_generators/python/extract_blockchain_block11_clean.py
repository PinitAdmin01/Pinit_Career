# -*- coding: utf-8 -*-
"""
Extract clean text for Block 11 (Days 51-55) from docs/visuals/PINIT_MASTER_DEBUG.html.
"""

import re
from html import unescape

with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8") as f:
    text = f.read()

positions = {
    51: 11276120,
    52: 11283942,
    53: 11291562,
    54: 11299577,
    55: 11307490,
    56: 11315109
}

def clean_html(html_chunk):
    chunk = re.sub(r'<script.*?</script>', '', html_chunk, flags=re.DOTALL)
    chunk = re.sub(r'<style.*?</style>', '', chunk, flags=re.DOTALL)
    chunk = re.sub(r'<[^>]+>', ' ', chunk)
    chunk = unescape(chunk)
    chunk = re.sub(r'\s+', ' ', chunk).strip()
    return chunk

for d in range(51, 56):
    start = positions[d]
    end = positions[d + 1]
    raw = text[start:end]
    cleaned = clean_html(raw)
    out_file = f"scripts/blockchain_day_{d}_clean.txt"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(cleaned)
    print(f"Day {d}: extracted {len(cleaned.split())} words into {out_file}")
    print(f"Title / First 150 chars: {cleaned[:150]}")
