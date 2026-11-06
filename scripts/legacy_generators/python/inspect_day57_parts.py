import sys
import json
import subprocess

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day57_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's bypass assertions to inspect all parts
code = text.replace('assert words >= 600', '# assert words >= 600')
code = code.replace('assert total_words >= 3000', '# assert total_words >= 3000')
loc = {}
exec(code, loc)
d = loc['build_day57']()

print(f"Total parts: {len(d['parts'])}")
for i, p in enumerate(d['parts']):
    words = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ('{p['title']}'): {words} words")
    # Test execute code
    try:
        proc = subprocess.run([sys.executable, "-c", p['code']], capture_output=True, text=True, check=True)
        print(f"  Code executed successfully! Output len: {len(proc.stdout)}")
    except subprocess.CalledProcessError as e:
        print(f"  Code FAILED: {e.stderr}")
