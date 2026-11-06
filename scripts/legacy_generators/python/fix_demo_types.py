# Fix report/route.ts
with open('src/app/api/internship/report/route.ts', 'r', encoding='utf-8') as f:
    report_code = f.read()

report_code = report_code.replace(
    "if (!lenCheck.isValidLength) {",
    "if (!lenCheck.ok) {"
)
with open('src/app/api/internship/report/route.ts', 'w', encoding='utf-8') as f:
    f.write(report_code)
print("Fixed report/route.ts")

# Fix submit/route.ts
with open('src/app/api/internship/tasks/[taskId]/submit/route.ts', 'r', encoding='utf-8') as f:
    submit_code = f.read()

submit_code = submit_code.replace(
    "language: canonical.language,",
    "language: ((canonical as Record<string, unknown>).language as any) || (track === 'web_fullstack' ? 'tsx' : 'python'),"
)
submit_code = submit_code.replace("execution.allPassed", "execution.passed")

with open('src/app/api/internship/tasks/[taskId]/submit/route.ts', 'w', encoding='utf-8') as f:
    f.write(submit_code)
print("Fixed submit/route.ts")
