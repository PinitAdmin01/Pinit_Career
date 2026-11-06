with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace block 1
block1 = """<<<<<<< HEAD
  part?: string | number;
=======
  part?: number;
>>>>>>> origin/agent/branch-c-platform-admin-faculty"""

block2 = """<<<<<<< HEAD
  totalParts?: number;
  duration?: string;
=======
  desc?: string;
  description?: string;
  visualBinding?: any;
>>>>>>> origin/agent/branch-c-platform-admin-faculty"""

text = text.replace(block1, "  part?: string | number;")
text = text.replace(block1.replace('\n', '\r\n'), "  part?: string | number;")

replacement2 = """  totalParts?: number;
  duration?: string;
  desc?: string;
  description?: string;
  visualBinding?: any;"""

text = text.replace(block2, replacement2)
text = text.replace(block2.replace('\n', '\r\n'), replacement2.replace('\n', '\r\n'))

with open('src/lib/data/longLessons.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("longLessons.ts updated successfully")
