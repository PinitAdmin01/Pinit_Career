# scripts/tiny_top_up.py
import sys
sys.path.append('scripts')
import make_month2_days43_44_45 as m
import json

# Day 45 Part 3 (+30 words)
m.day45_lesson["parts"][2]["say"].append(
    "By rigorously inspecting the residual distribution and verifying constant variance across cohorts, financial architects ensure that the estimated marginal return on capital reflects genuine underlying economics rather than spurious artifacts."
)

# Day 45 Part 4 (+35 words)
m.day45_lesson["parts"][3]["say"].append(
    "Furthermore, by tying buffer inventory levels directly to statistically calculated prediction intervals, operations leaders systematically eliminate both the risk of catastrophic retail stockouts and the burden of redundant working capital lockup."
)

# Serialize back
out_file = "scripts/make_month2_days43_44_45.py"
with open(out_file, "r", encoding="utf-8") as f:
    text = f.read()

code_sec = text[:text.find("d43_parts = [")]

parts_json_43 = json.dumps(m.day43_lesson['parts'], indent=4)
parts_json_44 = json.dumps(m.day44_lesson['parts'], indent=4)
parts_json_45 = json.dumps(m.day45_lesson['parts'], indent=4)

# Replace code and output strings with variables
for d in [43, 44, 45]:
    for p in range(1, 6):
        c_var = f"d{d}_p{p}_code"
        o_var = f"d{d}_p{p}_out"
        parts_json_43 = parts_json_43.replace(f'"{c_var}"', c_var).replace(f'"{o_var}"', o_var)
        parts_json_44 = parts_json_44.replace(f'"{c_var}"', c_var).replace(f'"{o_var}"', o_var)
        parts_json_45 = parts_json_45.replace(f'"{c_var}"', c_var).replace(f'"{o_var}"', o_var)

tail_idx = text.find('day43_lesson = {')
tail_code = text[tail_idx:]

final_py = f"""{code_sec}d43_parts = {parts_json_43}
d44_parts = {parts_json_44}
d45_parts = {parts_json_45}

{tail_code}"""

with open(out_file, "w", encoding="utf-8") as f:
    f.write(final_py)

print("make_month2_days43_44_45.py 100% completed!")
