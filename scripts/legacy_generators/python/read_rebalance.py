import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('Multi-Agent Workload Rebalance: Branch B & Branch C Split')
if idx != -1:
    print(text[idx:idx+3500])
else:
    print("Not found")
