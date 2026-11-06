with open('scripts/design_day58_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Replace "code": ` with "code": r"""
text = re.sub(r'"code":\s*`', '"code": r"""', text)
# Replace `,\n      "output": with """,\n      "output":
text = re.sub(r'`,\s*"output":', '""",\n      "output":', text)
# Replace "output": ` with "output": """
text = re.sub(r'"output":\s*`', '"output": """', text)
# Replace `,\n      "codeNotes": with """,\n      "codeNotes":
text = re.sub(r'`,\s*"codeNotes":', '""",\n      "codeNotes":', text)

with open('scripts/design_day58_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed quotes in design_day58_data.py")
