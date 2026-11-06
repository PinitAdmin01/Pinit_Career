import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day44_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p2 = '''    "In offline-first or poor connectivity scenarios, progressive enhancement guarantees that users never lose their filled-out form data. If a submission fails due to an intermittent drop in signal, the browser's native form state remains intact in memory, allowing users to retry instantly without re-typing lengthy text.",
'''

add_p3 = '''    "This combination of declarative action state, automatic transition wrapping, and decoupled submit button status provides full-stack teams with an unprecedented level of developer velocity and UI stability, turning cumbersome mutation workflows into clean, reusable component patterns.",
'''

add_p4 = '''    "As web standards continue to evolve toward native HTML streaming and optimistic client projections, React 19 establishes a new gold standard where complex mutations feel instantaneous and unbreakable across any device.",
'''

add_p5 = '''    "Furthermore, this unified mutation model eliminates the impedance mismatch that historically tormented web developers. In classical REST or GraphQL architectures, client state managers had to maintain client-side entity caches (like Apollo Client cache or Normalized Redux stores) that were constantly at risk of becoming stale or desynchronized with SQL database tables. With Server Actions and RSC cache revalidation, the server database remains the single source of truth, and the client UI is refreshed declaratively via streaming diffs.",
    "By synthesizing native HTML form mechanics, asynchronous server functions, and optimistic reconciliation, full-stack engineers gain the superpower to build applications that load instantly, mutate securely, and scale effortlessly to millions of global users.",
'''

def insert_before_closing_bracket(content, array_name, addition):
    target = f"{array_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Target {target} not found")
    idx_close = content.find("\n]", idx)
    return content[:idx_close] + ",\n" + addition.rstrip(",\n") + content[idx_close:]

new_text = insert_before_closing_bracket(text, "p2_say", add_p2)
new_text = insert_before_closing_bracket(new_text, "p3_say", add_p3)
new_text = insert_before_closing_bracket(new_text, "p4_say", add_p4)
new_text = insert_before_closing_bracket(new_text, "p5_say", add_p5)

with open('scripts/build_day44_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Topped up Day 44 round 2 successfully!")
