with open('scripts/fullstack_day38_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = "ticketId: 'tkt_' + Math.random().toString(36).substring(2, 9),"
replacement = "ticketId: 'tkt_session_token_7788',"
assert target in text, "Target not found in fullstack_day38_data.py"
text = text.replace(target, replacement)

target_out = '"Session Ticket Issued: " + "tkt_",'
replacement_out = '"Session Ticket Issued: tkt_session_token_7788",'
assert target_out in text, "Target out not found in fullstack_day38_data.py"
text = text.replace(target_out, replacement_out)

with open('scripts/fullstack_day38_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Day 38 Part 5 to be strictly deterministic!")
