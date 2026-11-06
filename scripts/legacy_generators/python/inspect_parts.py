import re

with open('src/lib/data/devopsWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's parse with node/ts or inspect day 30
# In TS, DEVOPS_WEB_LONG_LESSONS is an array of LongLesson
