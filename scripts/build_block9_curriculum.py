import os
import sys
import json
import hashlib

# Reconfigure stdout for Windows UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

print("Authoring scripts/build_block9_curriculum.py...")
