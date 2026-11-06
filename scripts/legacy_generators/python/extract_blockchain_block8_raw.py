with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8") as f:
    text = f.read()

# Position at 11159897
start_pos = 11159897 - 500
end_pos = start_pos + 65000

block8_raw = text[start_pos:end_pos]

with open("scripts/blockchain_block8_raw.html", "w", encoding="utf-8") as f:
    f.write(block8_raw)

print("Saved scripts/blockchain_block8_raw.html")
