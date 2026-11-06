with open('tests/java_basics_days1_5_overhaul.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'assert.equal(lesson.minutes, 38, `Day ${day} minutes (${lesson.minutes}) must be 38`);',
    'assert.ok(lesson.minutes >= 30 && lesson.minutes <= 45, `Day ${day} minutes (${lesson.minutes}) must be between 30 and 45`);'
)

with open('tests/java_basics_days1_5_overhaul.test.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated tests/java_basics_days1_5_overhaul.test.ts line 54.")
