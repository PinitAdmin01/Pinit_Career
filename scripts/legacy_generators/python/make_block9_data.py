import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')

# Helper to format long lessons
def count_words(say_list):
    return sum(len(p.split()) for p in say_list)

print("make_block9_data.py initialized.")
