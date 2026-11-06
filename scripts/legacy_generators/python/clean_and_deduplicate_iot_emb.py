import json
import re

with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# The first set of 51-55 was serialized with quoted keys: "day": 51
# The second set of 51-55 was formatted with unquoted keys: day: 51
# Find the start of the first 51-55 block
first_quoted_51 = text.find('{\n  "day": 51')
if first_quoted_51 == -1:
    first_quoted_51 = text.find('{"day": 51')
if first_quoted_51 == -1:
    first_quoted_51 = text.find('{\n    "day": 51')

print("First quoted 51 pos:", first_quoted_51)

# Find where the second 51 begins: '  {\n    day: 51,'
second_unquoted_51 = text.find('  {\n    day: 51,')
print("Second unquoted 51 pos:", second_unquoted_51)

if first_quoted_51 != -1 and second_unquoted_51 != -1 and first_quoted_51 < second_unquoted_51:
    # Look back from second_unquoted_51 to find the comma or newline before it
    # We want text from 0 to first_quoted_51 (stripped of trailing comma) + second_unquoted_51 onwards
    clean_prefix = text[:first_quoted_51].rstrip()
    if clean_prefix.endswith(','):
        clean_prefix = clean_prefix[:-1].rstrip()
    
    clean_suffix = text[second_unquoted_51:]
    new_text = clean_prefix + ',\n' + clean_suffix
    
    with open('src/lib/data/iotEmbLongLessons.ts', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully removed duplicate Days 51-55 from src/lib/data/iotEmbLongLessons.ts!")
else:
    print("Could not find the duplicate pattern accurately. Debugging needed.")
