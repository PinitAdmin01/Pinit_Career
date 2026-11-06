import sys

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Course 19')
count = 0
while idx != -1 and count < 6:
    print(f'=== Entry {count+1} ===')
    chunk = text[idx:idx+700].encode('ascii', errors='replace').decode('ascii')
    print(chunk)
    print()
    idx = text.find('Course 19', idx+700)
    count += 1
