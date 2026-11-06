# scripts/read_page_678.py
with open('scripts/pages_671_to_end.txt', 'r', encoding='utf-8') as f:
    text = f.read()

def get_page(p_num):
    start_marker = f"==================== PAGE {p_num} ===================="
    end_marker = f"==================== PAGE {p_num + 1} ===================="
    start_pos = text.find(start_marker)
    if start_pos == -1:
        return ""
    end_pos = text.find(end_marker, start_pos)
    if end_pos == -1:
        return text[start_pos:]
    return text[start_pos:end_pos]

p677 = get_page(677)
p678 = get_page(678)
p679 = get_page(679)

print("=== PAGE 677 ===")
print(p677.encode('ascii', errors='replace').decode('ascii'))
print("=== PAGE 678 ===")
print(p678.encode('ascii', errors='replace').decode('ascii'))
print("=== PAGE 679 ===")
print(p679.encode('ascii', errors='replace').decode('ascii'))
