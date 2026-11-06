# Helper to enrich and write out Days 31-35 with exact target word counts
import json
import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

print("Enrichment tool initialized.")
