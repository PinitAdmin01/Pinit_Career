import csv

def main():
    # 1. Append tasks to agent_tasks.csv
    tasks_csv = 'c:/Users/Admin/Desktop/projects/memory of agent/agent_tasks.csv'
    new_tasks = [
        ["TASK-1654", "2026-10-19", "05:18:00", "IN_PROGRESS", "codex/interview-tab-reliability", "Antigravity", "Course 02 react-basics Day 46: Concurrent External Stores with useSyncExternalStore: Eliminating State Tearing in Third-Party State Libraries", "python,node,git", "src/lib/data/reactLongLessons.ts,src/lib/data/react30DayData.ts,src/lib/data/lessonVisuals/react-basics/day-46..50.json", "In progress curriculum expansion", "Present-Career-os", ""],
        ["TASK-1655", "2026-10-19", "05:18:00", "IN_PROGRESS", "codex/interview-tab-reliability", "Antigravity", "Course 02 react-basics Day 47: Finite State Automata & Hierarchical Statecharts in React: Actor Model & Transition Invariants", "python,node,git", "src/lib/data/reactLongLessons.ts,src/lib/data/react30DayData.ts,src/lib/data/lessonVisuals/react-basics/day-46..50.json", "In progress curriculum expansion", "Present-Career-os", ""],
        ["TASK-1656", "2026-10-19", "05:18:00", "IN_PROGRESS", "codex/interview-tab-reliability", "Antigravity", "Course 02 react-basics Day 48: Micro-Frontends with Module Federation: Shared React Runtimes, Version Isolation & Remote Island Mounting", "python,node,git", "src/lib/data/reactLongLessons.ts,src/lib/data/react30DayData.ts,src/lib/data/lessonVisuals/react-basics/day-46..50.json", "In progress curriculum expansion", "Present-Career-os", ""],
        ["TASK-1657", "2026-10-19", "05:18:00", "IN_PROGRESS", "codex/interview-tab-reliability", "Antigravity", "Course 02 react-basics Day 49: Custom React Reconcilers: Building a Headless HostConfig with react-reconciler", "python,node,git", "src/lib/data/reactLongLessons.ts,src/lib/data/react30DayData.ts,src/lib/data/lessonVisuals/react-basics/day-46..50.json", "In progress curriculum expansion", "Present-Career-os", ""],
        ["TASK-1658", "2026-10-19", "05:18:00", "IN_PROGRESS", "codex/interview-tab-reliability", "Antigravity", "Course 02 react-basics Day 50: Milestone 9: Micro-Frontend Real-Time Trading Desk with useSyncExternalStore & Federated Modules", "python,node,git", "src/lib/data/reactLongLessons.ts,src/lib/data/react30DayData.ts,src/lib/data/lessonVisuals/react-basics/day-46..50.json", "In progress curriculum expansion", "Present-Career-os", ""]
    ]

    with open(tasks_csv, 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        for t in new_tasks:
            writer.writerow(t)
    print("Registered TASK-1654..1658 in agent_tasks.csv!")

    # 2. Append agent to multi_agent_control.csv
    mac_csv = 'c:/Users/Admin/Desktop/projects/memory of agent/multi_agent_control.csv'
    new_agent_line = 'AGENT-463,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1654..1658,In_Progress,none,"Course 02 (react-basics) Month 2 Block 10 (Days 46-50): useSyncExternalStore, Hierarchical Statecharts, Micro-Frontends, Custom Reconcilers & Milestone 9",2026-10-19 05:18:00,,,\n'
    with open(mac_csv, 'a', encoding='utf-8') as f:
        f.write(new_agent_line)
    print("Registered AGENT-463 in multi_agent_control.csv!")

if __name__ == '__main__':
    main()
