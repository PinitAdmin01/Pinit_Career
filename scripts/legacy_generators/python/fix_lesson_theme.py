with open('src/app/quests/lesson/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('background: rgba(15, 23, 42, 0.75);', 'background: var(--card);')
c = c.replace("background: 'rgba(15, 23, 42, 0.92)'", "background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)'")

with open('src/app/quests/lesson/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('LESSON PAGE UPDATED CLEANLY')
