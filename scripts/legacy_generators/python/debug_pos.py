with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()
d = 13
marker = f'"day": {d},'
marker_pos = text.find(marker)
start_pos = text.rfind('{', 0, marker_pos)
next_pos = text.find(f'"day": {d+1},', marker_pos)
if next_pos == -1:
    next_pos = text.find('];', marker_pos)
end_pos = text.rfind('}', start_pos, next_pos) + 1
print('marker_pos:', marker_pos)
print('start_pos:', start_pos)
print('next_pos:', next_pos)
print('end_pos:', end_pos)
print('start snippet:', repr(text[start_pos:start_pos+60]))
print('end snippet:', repr(text[end_pos-60:end_pos]))
