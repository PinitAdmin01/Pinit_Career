# Full authoring script for Days 36 to 40
import json

with open('scripts/java_days36_40_outputs.json', 'r', encoding='utf-8') as f:
    outputs = json.load(f)

# Let's write out Day 36
from scripts.day36_data import day36

# Let's inspect day36 current words
print("Loaded day36 base.")
