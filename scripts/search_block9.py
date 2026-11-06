with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8") as f:
    text = f.read()

# Search for "Proxy Pattern Foundations"
pos = text.find("Proxy Pattern Foundations")
print("Position of Proxy Pattern Foundations:", pos)

if pos != -1:
    block9_raw = text[pos - 200 : pos + 65000]
    with open("scripts/blockchain_block9_raw.html", "w", encoding="utf-8") as f:
        f.write(block9_raw)
    print("Saved scripts/blockchain_block9_raw.html!")
