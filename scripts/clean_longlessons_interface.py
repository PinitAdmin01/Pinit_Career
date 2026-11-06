with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = """export interface LongLesson {
  id?: string;
  course?: string;
  coursePrefix?: string;
  course?: string;
  day: number;
  title: string;
  totalParts?: number;
  duration?: string;
  desc?: string;
  description?: string;
  visualBinding?: any;
  /** One sentence: what the student can do after this lesson. */
  goal?: string;
  /** Rough lesson length in minutes (lesson only, not practice). */
  minutes?: number;
  /** Short reminder of the previous day, spoken at the start. */
  recap?: string;
  overview?: string;
  description?: string;
  desc?: string;
  parts: LongLessonPart[];
  /** Key points to remember, shown at the end. */
  summary?: string[];
  /** Today's step of the month project. */
  projectStep?: { title: string; steps: string[] };
  visualBinding?: {
    schemaVersion?: number;
    type?: string;
    visualHash?: string;
    [key: string]: any;
  };
}"""

new_block = """export interface LongLesson {
  id?: string;
  course?: string;
  coursePrefix?: string;
  day: number;
  title: string;
  totalParts?: number;
  duration?: string;
  /** One sentence: what the student can do after this lesson. */
  goal?: string;
  /** Rough lesson length in minutes (lesson only, not practice). */
  minutes?: number;
  /** Short reminder of the previous day, spoken at the start. */
  recap?: string;
  overview?: string;
  description?: string;
  desc?: string;
  parts: LongLessonPart[];
  /** Key points to remember, shown at the end. */
  summary?: string[];
  /** Today's step of the month project. */
  projectStep?: { title: string; steps: string[] };
  visualBinding?: {
    schemaVersion?: number;
    type?: string;
    visualHash?: string;
    [key: string]: any;
  };
}"""

if old_block in text:
    text = text.replace(old_block, new_block)
elif old_block.replace('\n', '\r\n') in text:
    text = text.replace(old_block.replace('\n', '\r\n'), new_block.replace('\n', '\r\n'))
else:
    print("Could not find exact block, checking regex")
    import re
    text = re.sub(r'export interface LongLesson \{.*?\n\}', new_block, text, flags=re.DOTALL)

with open('src/lib/data/longLessons.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Interface cleaned up successfully")
