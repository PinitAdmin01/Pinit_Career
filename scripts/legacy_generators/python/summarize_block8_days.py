import re

with open('scripts/java_block8_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Let's split by '<div style="background: #ffffff; border: 1px solid #cbd5e1;' which is usually the card header
cards = re.split(r'Day (\d+)</span>\s*<strong style="[^"]*">([^<]+)</strong>', text)

print(f"Cards found: {len(cards)}")
for i in range(1, len(cards), 3):
    d_num = cards[i]
    d_title = cards[i+1]
    d_body = cards[i+2]
    
    # Extract Goal
    goal_m = re.search(r'Goal:</span>\s*([^<]+)', d_body)
    goal = goal_m.group(1).strip() if goal_m else ''
    
    # Extract Invariant
    inv_m = re.search(r'Invariant:</span>\s*([^<]+)', d_body)
    invariant = inv_m.group(1).strip() if inv_m else ''
    
    # Extract Failure
    fail_m = re.search(r'Failure:</strong>\s*([^<]+)', d_body)
    failure = fail_m.group(1).strip() if fail_m else ''
    
    # Extract tryIt
    try_m = re.search(r'tryIt Friction:</strong>\s*([^<]+)', d_body)
    try_it = try_m.group(1).strip() if try_m else ''

    print(f"\n==================== DAY {d_num}: {ascii(d_title)} ====================")
    print(f"Goal: {ascii(goal)}")
    print(f"Invariant: {ascii(invariant)}")
    print(f"Failure: {ascii(failure)}")
    print(f"tryIt: {ascii(try_it)}")
