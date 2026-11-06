import csv
import datetime

# Register AGENT-456 in multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

with open(mac_path, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow([
        'AGENT-456',
        'Antigravity',
        'codex/interview-tab-reliability',
        'Present-Career-os',
        'TASK-1619..1623',
        'In_Progress',
        'ce55e118',
        'Course 02 (react-basics) Month 2 Block 7: Days 31-35 Expansion (Concurrent Mode, Fiber Architecture, useTransition, useDeferredValue & Milestone 6 Concurrent Grid)',
        now,
        '',
        '',
        ''
    ])

# Register TASK-1619..1623 in agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
tasks = [
    ('TASK-1619', 'Course 02 react-basics Day 31: The React Concurrent Runtime: Fiber Tree, Work-in-Progress & Cooperatively Yielding Reconciler'),
    ('TASK-1620', 'Course 02 react-basics Day 32: Concurrent Interruptible Rendering: useTransition, isPending & Non-Blocking Priority Slicing'),
    ('TASK-1621', 'Course 02 react-basics Day 33: Responsive Input Buffering with useDeferredValue, Stale Visuals & Suspense Fallbacks'),
    ('TASK-1622', 'Course 02 react-basics Day 34: Finite State Machines in React: Predictable State Transitions & useReducer with Discriminated Unions'),
    ('TASK-1623', 'Course 02 react-basics Day 35: Milestone 6: Concurrent Data Grid: 10,000 Row Asynchronous Filter & Priority Slicing Engine')
]

today = datetime.datetime.now().strftime('%Y-%m-%d')
time_now = datetime.datetime.now().strftime('%H:%M:%S')

with open(tasks_path, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    for tid, tdesc in tasks:
        writer.writerow([
            tid,
            today,
            time_now,
            'IN_PROGRESS',
            '',
            'Antigravity Orchestrator',
            tdesc,
            '',
            '0%',
            'Commenced authoring 5-part LongLesson & Gate v2 visual JSON contract for Course 02 Month 2 Block 7.',
            'c7b35c15-f056-4dc6-888b-f56621a809c1',
            ''
        ])

print("Registered AGENT-456 and TASK-1619..1623 successfully in central memory.")
