with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.search(r'const LONG_LESSON_SOURCES.*?(?=export function)', text, re.DOTALL)
if matches:
    print("=== LONG_LESSON_SOURCES ===")
    print(matches.group(0))

get_lesson_match = re.search(r'export function getLongLesson.*?(?=export function|\Z)', text, re.DOTALL)
if get_lesson_match:
    print("=== getLongLesson ===")
    print(get_lesson_match.group(0)[:1000])
