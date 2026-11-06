import json
import re
import sys

from src.lib.data.bcomEcomLongLessons import BCOM_ECOM_LONG_LESSONS

print("Auditing bcom_ecom quiz structure:")
for d in range(31, 61):
    lesson = BCOM_ECOM_LONG_LESSONS.find(lambda l: l.day == d)
    if not lesson:
        continue
    for pIdx, part in enumerate(lesson.parts):
        check = part.check
        if not check:
            print(f"Day {d} Part {pIdx+1}: No check!")
            continue
        # Check properties
        has_opts = hasattr(check, 'options') and len(check.options) == 4
        ans = getattr(check, 'answer', None)
        ansIdx = getattr(check, 'answerIndex', None)
        why = getattr(check, 'why', None) or getattr(check, 'explanation', None)
        
        # print first failure
        if ans != 0 or ansIdx != 0 or not has_opts or not why or len(why) < 20:
            print(f"Day {d} Part {pIdx+1}: ans={ans}, ansIdx={ansIdx}, opts_len={len(getattr(check, 'options', []))}, why_len={len(why) if why else 0}")
            break
