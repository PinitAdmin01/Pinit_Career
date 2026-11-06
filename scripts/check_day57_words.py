# scripts/check_day57_words.py
content = open("scripts/create_dist_day57_data.py", "r", encoding="utf-8").read()

temp_content = content.replace("assert wc >= 600", "# assert wc >= 600").replace("assert total_words >= 3000", "# assert total_words >= 3000")
loc = {}
exec(compile(temp_content, "temp", "exec"), loc)

for i in range(1, 6):
    p = loc[f"say_p{i}"]
    wc = sum(len(x.split()) for x in p)
    print(f"say_p{i}: {wc} words")
