with open('scripts/branch_c/build_day59.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"say1": "Proactive chaos engineering provides primary defense against systemic collapse.",',
    '"say1": "Proactive chaos engineering defends against systemic collapse.",'
)

text = text.replace(
    '"Financial institutions utilize automated verification rules before clearing."',
    '"Financial institutions run automated verification rules before clearing."'
)

text = text.replace(
    '"Draft declarative Open Policy Agent rules restricting infrastructure actions."',
    '"Draft Open Policy Agent rules restricting infrastructure actions."'
)

text = text.replace(
    '"Aviation safety boards publish forensic reports following flight diversions."',
    '"Aviation safety boards publish forensic reports following diversions."'
)

with open('scripts/branch_c/build_day59.py', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated build_day59.py")
