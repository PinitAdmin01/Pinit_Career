# -*- coding: utf-8 -*-
import os
import re

files = [
    'excelVizLongLessons.ts', 'quantSystemsLongLessons.ts', 'g3dLongLessons.ts',
    'fullstackJsLongLessons.ts', 'iotEmbLongLessons.ts', 'iotEdgeLongLessons.ts',
    'iotSecLongLessons.ts', 'iotNetLongLessons.ts', 'compFundLongLessons.ts',
    'gitVcsLongLessons.ts', 'softSkillsLongLessons.ts', 'blockchainLongLessons.ts',
    'javaBasicsLongLessons.ts', 'mobileLongLessons.ts'
]

for fn in files:
    path = os.path.join('src', 'lib', 'data', fn)
    if os.path.exists(path):
        txt = open(path, encoding='utf-8').read()
        days = [int(x) for x in re.findall(r'"day":\s*(\d+)', txt)]
        if days:
            print(f"{fn:28}: count={len(days):2} | min={min(days):2} max={max(days):2} | missing M2: {60 - max(days) if max(days) < 60 else 0}")
        else:
            print(f"{fn:28}: count= 0")
