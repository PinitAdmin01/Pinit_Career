import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('tests/lesson_all_17_visual_templates_ssr.test.ts', 'r', encoding='utf-8') as f:
    print(f.read()[:2000])
