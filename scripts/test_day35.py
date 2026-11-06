import subprocess
from react_day35_data import day35_data

print(f"Day {day35_data['day']}: {day35_data['title']}")
total_words = 0
for idx, part in enumerate(day35_data['parts'], start=1):
    part_text = " ".join(part['say'])
    words = len(part_text.split())
    total_words += words
    print(f"Part {idx} ({part['title'][:35]}...): words={words}")
    if words < 580:
        print(f"WARNING: Part {idx} is below 580 words ({words})!")

print(f"Total words: {total_words}")

print("Testing code snippets for Day 35...")
for idx, part in enumerate(day35_data['parts'], start=1):
    code = part['code']
    expected_output = part['output']
    
    # Run in node
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in Part {idx} code execution:\n{res.stderr}")
        exit(1)
    
    actual_output = res.stdout.strip()
    if actual_output != expected_output.strip():
        print(f"MISMATCH in Part {idx} output!")
        print("Expected:")
        print(repr(expected_output.strip()))
        print("Actual:")
        print(repr(actual_output))
        exit(1)
    else:
        print(f"Part {idx} code output verified!")

print("Day 35 verified successfully!")
