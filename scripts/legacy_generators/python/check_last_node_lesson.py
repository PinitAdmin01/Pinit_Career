import sys, json

sys.stdout.reconfigure(encoding='utf-8')
from nodeWebLongLessons import NODE_WEB_LONG_LESSONS

print(f"Total long lessons in NODE_WEB_LONG_LESSONS: {len(NODE_WEB_LONG_LESSONS)}")
last = NODE_WEB_LONG_LESSONS[-1]
print(f"Last lesson day: {last.get('day')}, title: {last.get('title')}")
