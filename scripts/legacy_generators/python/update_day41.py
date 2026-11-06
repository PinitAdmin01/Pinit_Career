with open('scripts/build_day41_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = '    "Run the complete simulation below and trace how the ServerProductPage compo'
idx = text.find(target)
if idx != -1:
    addition = '''    "Looking ahead to modern production workflows in React 19 and contemporary frameworks, this architecture reaches its logical culmination with Server Functions and unified compiler optimization. Instead of treating the server and client as separate applications communicating over disconnected endpoints, React Server Components provide a single coherent programming model with automatic boundary isolation. As we advance through this block, we will see how this streaming foundation unlocks progressive streaming SSR with Suspense, user-prioritized selective hydration, and seamless Server Action mutations with zero network boilerplate.",\n'''
    text = text[:idx] + addition + text[idx:]
    with open('scripts/build_day41_file.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully added paragraph to Day 41 Part 5.")
else:
    print("Target not found.")
