import re
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []

    def handle_data(self, data):
        self.text.append(data)

    def get_text(self):
        return " ".join(self.text)

with open("scripts/blockchain_block9_raw.html", "r", encoding="utf-8") as f:
    raw_html = f.read()

days = [41, 42, 43, 44, 45]
for i in range(len(days)):
    d = days[i]
    next_d = days[i+1] if i+1 < len(days) else 46
    
    start_tag = f"Day {d}"
    end_tag = f"Day {next_d}"
    
    start_idx = raw_html.find(start_tag)
    if next_d == 46:
        end_idx = raw_html.find("Block 10")
        if end_idx == -1:
            end_idx = raw_html.find("Day 46")
    else:
        end_idx = raw_html.find(end_tag, start_idx + len(start_tag))
    
    if start_idx != -1 and end_idx != -1:
        chunk = raw_html[start_idx:end_idx]
        parser = TextExtractor()
        parser.feed(chunk)
        clean_text = parser.get_text()
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        words = len(clean_text.split())
        print(f"Day {d}: {words} clean words")
        
        with open(f"scripts/blockchain_day_{d}_clean.txt", "w", encoding="utf-8") as out_f:
            out_f.write(clean_text)
    else:
        print(f"Could not find slice for Day {d} (start: {start_idx}, end: {end_idx})")
