# scripts/fix_prefix_block11.py
for day in [51, 52, 53, 54, 55]:
    path = f'scripts/fullstack_day{day}_data.py'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("'coursePrefix': 'fullstack'", "'coursePrefix': 'fullstack-js'")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed {path}')
