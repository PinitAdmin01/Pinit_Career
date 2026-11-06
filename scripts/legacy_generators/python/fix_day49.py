with open("scripts/generate_day49_clean.py", "r", encoding="utf-8") as f:
    text = f.read()

old_s = "The Critical Decision Cutoff is $-1.78$:"
new_s = "The Critical Decision Cutoff established by Professor Beneish is $-1.78$, separating aggressive earnings manipulation from conservative accounting reporting:"
assert old_s in text
text = text.replace(old_s, new_s)

with open("scripts/generate_day49_clean.py", "w", encoding="utf-8") as f:
    f.write(text)
print("Replaced successfully!")
