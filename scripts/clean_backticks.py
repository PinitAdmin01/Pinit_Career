with open('scripts/generate_iot_edge_day6.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any backticks with triple quotes
fixed = text.replace('`', '"""')

with open('scripts/generate_iot_edge_day6.py', 'w', encoding='utf-8') as f:
    f.write(fixed)

print("Cleaned backticks in generate_iot_edge_day6.py")
