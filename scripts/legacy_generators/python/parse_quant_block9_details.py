import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

section = html[13595000:13650000]
with open('scripts/quant_block9_raw.html', 'w', encoding='utf-8') as f:
    f.write(section)

days = re.split(r'Day (\d+)</span>', section)
for i in range(1, len(days), 2):
    d_num = int(days[i])
    if d_num < 41 or d_num > 45:
        continue
    content = days[i+1]
    title_match = re.search(r'<strong[^>]*>([^<]+)</strong>', content)
    title = title_match.group(1).strip() if title_match else 'Unknown'
    
    goal_match = re.search(r'<span[^>]*>Goal:</span>\s*(.*?)(?=<span[^>]*>Invariant:</span>|</div>)', content, re.DOTALL)
    goal = re.sub(r'<[^>]+>', '', goal_match.group(1)).strip() if goal_match else ''
    
    inv_match = re.search(r'<span[^>]*>Invariant:</span>\s*(.*?)(?=</div>)', content, re.DOTALL)
    inv = re.sub(r'<[^>]+>', '', inv_match.group(1)).strip() if inv_match else ''
    
    fail_match = re.search(r'<strong>Failure:</strong>\s*(.*?)(?=<strong>tryIt Friction:</strong>|</div>)', content, re.DOTALL)
    failure = re.sub(r'<[^>]+>', '', fail_match.group(1)).strip() if fail_match else ''
    
    tryit_match = re.search(r'<strong>tryIt Friction:</strong>\s*(.*?)(?=</div>)', content, re.DOTALL)
    tryit = re.sub(r'<[^>]+>', '', tryit_match.group(1)).strip() if tryit_match else ''

    print(f'*** DAY {d_num}: {title} ***')
    print(f'Goal: {goal}')
    print(f'Invariant: {inv}')
    print(f'Failure: {failure}')
    print(f'tryIt: {tryit}')
    
    # Extract quests
    q_matches = re.findall(r'<span[^>]*>(Q\d+\.\d+)</span>\s*<strong>([^<]+)</strong>(?:\s*<em>\(([^)]+)\)</em>)?:\s*(.*?)(?=</div>)', content, re.DOTALL)
    for q_id, q_name, q_kind, q_desc in q_matches:
        q_desc_clean = re.sub(r'<[^>]+>', '', q_desc).strip()
        kind_str = f' [{q_kind}]' if q_kind else ''
        print(f'  {q_id}{kind_str} {q_name}: {q_desc_clean}')
    print('='*80)
