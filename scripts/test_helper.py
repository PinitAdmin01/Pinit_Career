import json
import re

def count_words(say_list):
    total = 0
    for p in say_list:
        total += len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', p))
    return total

print("Word count helper ready")
