# scripts/dump_page_678.py
with open('scripts/pages_671_to_end.txt', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = "==================== PAGE 678 ===================="
end_marker = "==================== PAGE 679 ===================="

start = text.find(start_marker)
end = text.find(end_marker)

page_678 = text[start:end]
with open('scripts/exact_page_678.txt', 'w', encoding='utf-8') as f:
    f.write(page_678)

print("Dumped exact page 678 to scripts/exact_page_678.txt")
