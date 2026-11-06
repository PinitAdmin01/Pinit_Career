import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Course 14')
while idx != -1:
    sub = text[idx:idx+1500]
    if 'Block 12' in sub or 'Days 56' in sub:
        print("Found in Course 14:")
        print(sub[:800])
        print("="*60)
        break
    idx = text.find('Course 14', idx+1)

idx2 = text.find('Block 12 (Days 56')
if idx2 != -1:
    print("Found Block 12:")
    print(text[idx2:idx2+1200])
