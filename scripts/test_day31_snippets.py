# scripts/test_day31_snippets.py
import subprocess
import build_iot_net_day31 as b

codes = [b.part1_code, b.part2_code, b.part3_code, b.part4_code, b.part5_code]

for i, c in enumerate(codes):
    res = subprocess.run(["python", "-c", c], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Snippet {i+1} FAILED:")
        print(res.stderr)
    else:
        print(f"Snippet {i+1} PASSED. Output lines: {len(res.stdout.splitlines())}")
