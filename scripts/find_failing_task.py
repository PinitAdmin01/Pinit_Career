p = 'tests/web_track_tasks.test.ts'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

target = """              if (!KNOWN_CONSTANT_TASKS.has(t.id)) {
                assert.ok(!constResult.passed, `${label}: passes with constant answer`);
              }"""

replacement = """              if (!KNOWN_CONSTANT_TASKS.has(t.id)) {
                if (constResult.passed) {
                  console.error('*** CONSTANT ANSWER FAILURE ***:', label);
                }
                assert.ok(!constResult.passed, `${label}: passes with constant answer`);
              }"""

if target in c:
    c = c.replace(target, replacement, 1)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated web_track_tasks.test.ts successfully')
elif target.replace('\n', '\r\n') in c:
    c = c.replace(target.replace('\n', '\r\n'), replacement.replace('\n', '\r\n'), 1)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated web_track_tasks.test.ts with CRLF')
else:
    print('Target not found')
