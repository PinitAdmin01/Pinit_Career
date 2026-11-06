import datetime

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 1. multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(mac_path, 'a', encoding='latin-1') as f:
    f.write(f'AGENT-415,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1354,In_Progress,{now_str},"Month 2 Pioneer Batch 3: Block 9 -- Days 41-45 (Throwable Hierarchy, Defensive try-catch Propagation, try-with-resources and AutoCloseable, Garbage Collection and Memory Leaks, Milestone 8 Resilient File Ingestion Engine: TASK-1354..1358) in progress"\n')
print('Registered AGENT-415 in multi_agent_control.csv')

# 2. agent_tasks.csv
at_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_entries = [
    f'TASK-1354,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 9 (M2 Batch 3),Antigravity,Course 5 java_basics Day 41: JVM Throwable Hierarchy: Throwable Error Exception and RuntimeException,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-41.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1355,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 9 (M2 Batch 3),Antigravity,Course 5 java_basics Day 42: Defensive Error Recovery: try-catch-finally Blocks and Exception Propagation,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-42.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1356,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 9 (M2 Batch 3),Antigravity,Course 5 java_basics Day 43: Resource Lifecycles: AutoCloseable try-with-resources and Custom Fault Taxonomies,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-43.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1357,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 9 (M2 Batch 3),Antigravity,Course 5 java_basics Day 44: JVM Garbage Collection Anatomy and Diagnosing Real Memory Leaks,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-44.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1358,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 9 (M2 Batch 3),Antigravity,Course 5 java_basics Day 45: Milestone 8: Resilient Order File Ingestion Engine with Auto-Rollback,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-45.json; tests/java_basics_visuals_expansion.test.ts,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n'
]
with open(at_path, 'a', encoding='latin-1') as f:
    f.writelines(task_entries)
print('Registered TASK-1354..1358 in agent_tasks.csv')
