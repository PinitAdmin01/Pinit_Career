with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

bad1 = '''      "if (!slot.includes('id="B:0"') || !slot.includes('Loading...')) throw new Error('Slot placeholder check failed');"'''
good1 = '''      "if (!slot.includes('id=\\\"B:0\\\"') || !slot.includes('Loading...')) throw new Error('Slot placeholder check failed');"'''

bad2 = '''      "if (s !== '<script>$RC("B:0","S:0")</script>') throw new Error('$RC script check failed');"'''
good2 = '''      "if (s !== '<script>$RC(\\\"B:0\\\",\\\"S:0\\\")</script>') throw new Error('$RC script check failed');"'''

assert bad1 in text, "bad1 not found"
assert bad2 in text, "bad2 not found"

text = text.replace(bad1, good1)
text = text.replace(bad2, good2)

with open('src/lib/data/react30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed quotes in react30DayData.ts successfully!")
