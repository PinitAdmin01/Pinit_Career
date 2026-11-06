import json

# 1. Update Day 47 Part 2 output in scripts/react_day47.json
with open('scripts/react_day47.json', 'r', encoding='utf-8') as f:
    d47 = json.load(f)

d47['parts'][1]['output'] = """--- FORMAL STATE MACHINE EXECUTION TRACE ---
Initial State: ENTER_CREDENTIALS
After Short Password -> State: ENTER_CREDENTIALS
After Valid Password -> State: VERIFY_MFA
After Invalid OTP -> State: VERIFY_MFA
After Valid OTP -> State: AUTHENTICATED
Recorded Action Logs: [ 'GUARD_DENIED: Password too short (< 8 chars)', 'EXIT: ENTER_CREDENTIALS', 'ENTRY: VERIFY_MFA', 'GUARD_DENIED: Invalid OTP Token', 'ENTRY: AUTHENTICATED' ]"""

with open('scripts/react_day47.json', 'w', encoding='utf-8') as f:
    json.dump(d47, f, indent=2)

# 2. Update reactLongLessons.ts for Day 47 Part 2 output
with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the multiline array output in Day 47 Part 2
target_multiline = '''"--- FORMAL STATE MACHINE EXECUTION TRACE ---\\nInitial State: ENTER_CREDENTIALS\\nAfter Short Password -> State: ENTER_CREDENTIALS\\nAfter Valid Password -> State: VERIFY_MFA\\nAfter Invalid OTP -> State: VERIFY_MFA\\nAfter Valid OTP -> State: AUTHENTICATED\\nRecorded Action Logs: [\\n  'GUARD_DENIED: Password too short (< 8 chars)',\\n  'EXIT: ENTER_CREDENTIALS',\\n  'ENTRY: VERIFY_MFA',\\n  'GUARD_DENIED: Invalid OTP Token',\\n  'ENTRY: AUTHENTICATED'\\n]"'''

single_line = '''"--- FORMAL STATE MACHINE EXECUTION TRACE ---\\nInitial State: ENTER_CREDENTIALS\\nAfter Short Password -> State: ENTER_CREDENTIALS\\nAfter Valid Password -> State: VERIFY_MFA\\nAfter Invalid OTP -> State: VERIFY_MFA\\nAfter Valid OTP -> State: AUTHENTICATED\\nRecorded Action Logs: [ 'GUARD_DENIED: Password too short (< 8 chars)', 'EXIT: ENTER_CREDENTIALS', 'ENTRY: VERIFY_MFA', 'GUARD_DENIED: Invalid OTP Token', 'ENTRY: AUTHENTICATED' ]"'''

if target_multiline in content:
    content = content.replace(target_multiline, single_line)
    print("Replaced Day 47 Part 2 output in reactLongLessons.ts successfully!")
else:
    print("WARNING: target_multiline not found in reactLongLessons.ts, searching alternative...")
    # fallback search
    sub1 = "Recorded Action Logs: [\\n  'GUARD_DENIED: Password too short"
    if sub1 in content:
        print("Found sub1 in reactLongLessons.ts!")

with open('src/lib/data/reactLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Update titles in src/lib/data/react30DayData.ts
with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    c30 = f.read()

# Title 46
c30 = c30.replace(
    'title: "Concurrent External Stores: useSyncExternalStore, Resilient Subscriptions & Zero State Tearing"',
    'title: "Concurrent External Stores with useSyncExternalStore: Eliminating State Tearing in Third-Party State Libraries"'
)

# Title 47
c30 = c30.replace(
    'title: "Hierarchical Statecharts & Actor Model: XState Architecture, Impossible States & Distributed UI Logic"',
    'title: "Finite State Automata & Hierarchical Statecharts in React: Actor Model & Transition Invariants"'
)

# Title 48
c30 = c30.replace(
    'title: "Micro-Frontends with Module Federation: Webpack 5, Dynamic Remotes, Shared Scope & Event Bus Bridges"',
    'title: "Micro-Frontends with Module Federation: Shared React Runtimes, Version Isolation & Remote Island Mounting"'
)

# Title 49
c30 = c30.replace(
    'title: "Custom React Reconcilers: HostConfig Architecture, Fiber WorkLoop & Terminal/Canvas Rendering"',
    'title: "Custom React Reconcilers: Building a Headless HostConfig with react-reconciler"'
)

with open('src/lib/data/react30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(c30)

print("Updated titles in react30DayData.ts successfully!")
