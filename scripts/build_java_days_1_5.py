import os
import json
import hashlib
import subprocess

def word_count(text_or_list):
    if isinstance(text_or_list, list):
        full_text = " ".join(text_or_list)
    else:
        full_text = str(text_or_list)
    return len(full_text.strip().split())

print("Testing word count helper...")
assert word_count(["Hello world this is a test", "second paragraph here"]) == 8
print("Word count helper ok.")
