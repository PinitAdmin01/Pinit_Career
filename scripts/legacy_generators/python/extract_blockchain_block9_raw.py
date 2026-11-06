with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8") as f:
    text = f.read()

# Position at 11206768 is Day 42.
# Let's see where Day 41 starts before that!
start_pos = 11206768 - 12000
end_pos = 11206768 + 55000

block9_raw = text[start_pos:end_pos]

with open("scripts/blockchain_block9_raw.html", "w", encoding="utf-8") as f:
    f.write(block9_raw)

print("Saved scripts/blockchain_block9_raw.html successfully! Length:", len(block9_raw))
