import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== SCANNING CLIENT CONSOLE.ERROR / CONSOLE.WARN ===")
for root, _, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                t = fp.read()
                # Only check client components or shared libs
                if "'use client'" in t or '"use client"' in t or 'src/components' in p or 'src/lib' in p:
                    for i, l in enumerate(t.splitlines(), 1):
                        s = l.strip()
                        if ('console.error(' in s or 'console.warn(' in s) and not s.startswith('//') and not s.startswith('*'):
                            print(f"{p}:{i} -> {s[:120]}")
