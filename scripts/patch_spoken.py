with open('src/lib/data/longLessonTypes.ts', 'r', encoding='utf-8') as f:
    text = f.read()

old_func = """export function estimateSpokenMinutes(lesson: LongLesson): number {
  const words = lesson.parts
    .flatMap((p) => [...(p.say || []), p.example ?? '', p.tryIt ?? '', p.check?.why || (p.check as any)?.explanation || ''])
    .join(' ')
    .split(/\\s+/)
    .filter(Boolean).length;
  return Math.round(words / 120);
}"""

new_func = """export function estimateSpokenMinutes(lesson: LongLesson): number {
  const words = lesson.parts
    .flatMap((p) => [
      ...(p.say || []),
      (p as any).content ?? '',
      p.example ?? '',
      p.tryIt ?? '',
      p.check?.why || (p.check as any)?.explanation || ''
    ])
    .join(' ')
    .split(/\\s+/)
    .filter(Boolean).length;
  return Math.round(words / 120);
}"""

# Try exact or normalized replacement
text_norm = text.replace('\r\n', '\n')
if old_func in text_norm:
    text_norm = text_norm.replace(old_func, new_func)
    with open('src/lib/data/longLessonTypes.ts', 'w', encoding='utf-8', newline='\n') as f:
        f.write(text_norm)
    print("Patched estimateSpokenMinutes successfully!")
else:
    print("Could not find old_func in text_norm")
