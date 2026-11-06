# Builder script that writes enriched day31_data.py, day32_data.py, day33_data.py, day34_data.py, day35_data.py
import json
import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

print("Enrichment builder ready.")
