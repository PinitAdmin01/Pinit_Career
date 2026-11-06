with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8") as f:
    text = f.read()

start_marker = "Block 8"
end_marker = "Block 9"

idx1 = text.find(start_marker)
idx2 = text.find(end_marker, idx1) if idx1 != -1 else -1

if idx1 != -1 and idx2 != -1:
    content = text[idx1:idx2]
    with open("scripts/soft_skills_month2_batch2_bible.txt", "w", encoding="utf-8") as out:
        out.write(content)
    print("Found Block 8, wrote to scripts/soft_skills_month2_batch2_bible.txt")
else:
    print(f"Indices: {idx1}, {idx2}")
