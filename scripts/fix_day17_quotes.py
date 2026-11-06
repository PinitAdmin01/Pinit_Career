with open('scripts/block4_day17.py', 'r', encoding='utf-8') as f:
    text = f.read()

bad = """                    "options": [
                        "u1.name.equals(\\'Vinay\\'), because .equals() compares string character content rather than memory addresses",
                        "u1.name == \\'Vinay\\'", which compares memory addresses",
                        "u1.name.compare()",
                        "u1.name = \\'Vinay\\'"
                    ],"""

good = """                    "options": [
                        "u1.name.equals('Vinay'), because .equals() compares string character content rather than memory addresses",
                        "u1.name == 'Vinay', which compares memory addresses",
                        "u1.name.compare()",
                        "u1.name = 'Vinay'"
                    ],"""

text = text.replace(bad, good)
with open('scripts/block4_day17.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Replaced check options cleanly")
