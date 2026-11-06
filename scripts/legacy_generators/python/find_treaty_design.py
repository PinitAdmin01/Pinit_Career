with open('scripts/tri_branch_collision_treaty.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('course-design-systems')
if pos != -1:
    print("Found course-design-systems in treaty HTML:")
    print(text[pos:pos+1500])
else:
    pos2 = text.find('Design Systems')
    print("Found Design Systems:", pos2 != -1)
    if pos2 != -1:
        print(text[pos2:pos2+1500])
