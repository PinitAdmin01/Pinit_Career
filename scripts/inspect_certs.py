# scripts/inspect_certs.py
with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
idx28 = text.find('"day": 28')
idx29 = text.find('"day": 29')
idx30 = text.find('"day": 30')

d28_chunk = text[idx28:idx29]
d30_chunk = text[idx30:]

print("Day 28 CERT lines:")
for line in d28_chunk.split("\n"):
    if "CERTIFIED" in line:
        print("  ", line.strip())

print("Day 30 CERT lines:")
for line in d30_chunk.split("\n"):
    if "CERTIFIED" in line:
        print("  ", line.strip())
