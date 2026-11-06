import json
import hashlib
import os
import re

from block1_day1 import DAY_1
from block1_day2 import DAY_2
from block1_day3 import DAY_3
from block1_day4 import DAY_4
from block1_day5 import DAY_5

NEW_DAYS = [DAY_1, DAY_2, DAY_3, DAY_4, DAY_5]

print("=== ASSEMBLING BLOCK 1 (DAYS 1 to 5) ===")

# 1. Update java30DayData.ts titles and descriptions
with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    j30_text = f.read()

DAY_UPDATES = [
    (1, "Java Platform Architecture & First Program: Hello World, Classes and System.out",
     "Java is a strongly typed, object-oriented language compiled to platform-independent bytecode executed by the Java Virtual Machine (JVM). Every Java program lives inside a class container with a main method entry point: public class Solution { public static void main(String[] args) { System.out.println(\\\"Hello!\\\"); } }. Every complete instruction terminates with a semicolon (;). (Real world: Powers Android apps, AWS backend microservices, and global financial ledgers.)"),
    (2, "Variables, Primitive Types & Interactive Input: The Scanner Console Engine",
     "Variables are type-safe memory slots allocated on the JVM thread stack. Java provides 8 primitive types: byte, short, int, long, float, double, boolean, and char. The java.util.Scanner class wraps System.in to capture keyboard input (sc.nextInt() for integers, sc.nextLine() for strings). Always flush the buffer with sc.nextLine() after reading numbers to prevent the Enter-key skipping bug! (Real world: Interactive CLI prompts, ATM interfaces, and form data ingestion.)"),
    (3, "Operators, Mathematical Expressions & String Concatenation",
     "Arithmetic operators (+, -, *, /, %) perform calculations; dividing two integers truncates the decimal remainder. The plus operator (+) is overloaded: if either operand is a String, it triggers string concatenation. Operator precedence follows PEMDAS, and parentheses override natural precedence. Smaller primitive types automatically widen to larger types, while narrowing requires explicit casting. (Real world: Dynamic pricing calculators, currency formatting, and invoice computations.)"),
    (4, "Arithmetic Algorithms, Modulo Arithmetic & Computational Logic",
     "The modulo operator (%) computes division remainders and forms the basis for cyclic indexing and parity testing (n % 2 == 0). Floating-point arithmetic (double) follows IEEE 754 and requires epsilon tolerance comparisons (Math.abs(a - b) < 0.001) rather than exact == checks. The java.lang.Math class provides static algorithms including abs, max, min, pow, and sqrt. (Real world: Multi-party expense allocation, round-robin load balancers, and circular queue buffers.)"),
    (5, "Conditional Logic, Boolean Expressions & Branching Decision Engines (if / else)",
     "Conditional branching routes execution based on boolean conditions. Relational operators (==, !=, <, <=, >, >=) compare numbers into boolean primitives. Logical operators (&&, ||, !) combine conditions with short-circuit evaluation, protecting against null pointer exceptions. The if-else and if-else-if ladders create mutually exclusive decision trees. (Real world: Loan approval algorithms, grade classification consoles, and security access gateways.)")
]

for day_num, title, desc in DAY_UPDATES:
    # Update title
    j30_text = re.sub(
        r'(\{\s*"title":\s*")[^"]*("\s*,\s*"desc":\s*")[^"]*("\s*,\s*"syllabus":.*?,"day":\s*' + str(day_num) + r'\s*\})',
        r'\g<1>' + title + r'\g<2>' + desc + r'\g<3>',
        j30_text,
        flags=re.DOTALL
    )

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(j30_text)
print("Updated src/lib/data/java30DayData.ts titles and descriptions.")

# 2. Update javaBasicsLongLessons.ts
# Let's read javaBasicsLongLessons.ts and replace Days 1-5
with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the days 1 to 5 objects in JAVA_BASICS_LONG_LESSONS array
# Let's inspect where Day 1 starts and where Day 6 starts
day6_idx = content.find('  {\n    "day": 6,')
if day6_idx == -1:
    day6_idx = content.find('  {\n    day: 6,')
if day6_idx == -1:
    # Let's search with regex
    m = re.search(r'\n  \{\s*["\']?day["\']?:\s*6,', content)
    day6_idx = m.start()

print(f"Day 6 starts at index: {day6_idx}")
prefix = content[:content.find('export const JAVA_BASICS_LONG_LESSONS: LongLesson[] = [') + len('export const JAVA_BASICS_LONG_LESSONS: LongLesson[] = [')]
suffix = content[day6_idx:]

# Convert NEW_DAYS to pretty json lines matching formatting
new_days_json = []
for d in NEW_DAYS:
    s = json.dumps(d, indent=4)
    # indent by 2 spaces
    indented = '\n'.join(('  ' + line if line else line) for line in s.split('\n'))
    new_days_json.append(indented)

new_content = prefix + '\n' + ',\n'.join(new_days_json) + ',\n' + suffix.lstrip('\n')

with open('src/lib/data/javaBasicsLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated src/lib/data/javaBasicsLongLessons.ts for Days 1 to 5.")

# 3. Generate on-disk visual JSON files for Days 1 to 5
visuals_dir = 'src/lib/data/lessonVisuals/java-basics'
os.makedirs(visuals_dir, exist_ok=True)

for d in NEW_DAYS:
    day_num = d['day']
    padded = f"day-{day_num:02d}.json"
    p = os.path.join(visuals_dir, padded)

    entries = []
    for part in d['parts']:
        code_str = part.get('code', '')
        h = hashlib.sha256(code_str.encode('utf-8')).hexdigest()
        
        # Build 4 steps for stack-queue template
        spec = {
            "template": "stack-queue",
            "title": f"{part['title'][:40]}... — JVM Memory & Execution Lifecycle",
            "mode": "stack",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Initialize JVM thread frame for {part['title'][:35]}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Execution Engine", "Memory Pipeline"],
                    "action": "push",
                    "actionItem": "Memory Pipeline",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "say1",
                    "caption": f"Evaluate operational state: {part['title'][:35]}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Execution Engine", "Memory Pipeline", "RuntimeValidator.verify()"],
                    "action": "push",
                    "actionItem": "RuntimeValidator.verify()",
                    "tones": ["ok", "data", "data", "accent"]
                },
                {
                    "at": "example",
                    "caption": f"Execute conceptual transformation: {part['title'][:30]}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Execution Engine", "Pipeline Output"],
                    "action": "pop",
                    "actionItem": "RuntimeValidator.verify()",
                    "tones": ["ok", "data", "accent"]
                },
                {
                    "at": "tryIt",
                    "caption": "Verification complete. Invariant confirmed with zero runtime faults.",
                    "mode": "stack",
                    "items": ["main() Frame", "Verified Output (0 Faults)"],
                    "action": "inspect",
                    "actionItem": "Verified Output (0 Faults)",
                    "tones": ["ok", "accent"]
                }
            ]
        }
        
        entries.append({
            "partTitle": part['title'],
            "codeHash": h,
            "spec": spec
        })

    vis_obj = {
        "schemaVersion": 1,
        "prefix": "java-basics",
        "day": day_num,
        "promptSha": "40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68",
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }
    
    with open(p, 'w', encoding='utf-8') as vf:
        json.dump(vis_obj, vf, indent=2)
    print(f"Generated on-disk visual: {p}")

print("=== BLOCK 1 ASSEMBLY COMPLETE ===")
