import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('tests/node_days31_35_expansion.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function runLikeSandbox')
print(text[idx:idx+800])
