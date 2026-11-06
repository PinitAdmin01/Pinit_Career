import datetime

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 1. multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(mac_path, 'a', encoding='latin-1') as f:
    f.write(f'AGENT-414,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1349,In_Progress,{now_str},"Month 2 Pioneer Batch 2: Block 8 -- Days 36-40 (Inheritance and super Chaining, vtables and Dynamic Dispatch, Universal equals/hashCode Contract, Abstract Classes vs Interfaces, Milestone 7 Payment Gateway Engine: TASK-1349..1353) in progress"\n')
print('Registered AGENT-414 in multi_agent_control.csv')

# 2. agent_tasks.csv
at_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_entries = [
    f'TASK-1349,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 8 (M2 Batch 2),Antigravity,Course 5 java_basics Day 36: Inheritance Hierarchies -- extends super Constructor Chaining and Code Reuse,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-36.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1350,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 8 (M2 Batch 2),Antigravity,Course 5 java_basics Day 37: Method Overriding @Override Virtual Method Tables (vtable) and Dynamic Dispatch,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-37.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1351,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 8 (M2 Batch 2),Antigravity,Course 5 java_basics Day 38: The Universal Object Contract: equals() hashCode() and Reference Identity (==),write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-38.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1352,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 8 (M2 Batch 2),Antigravity,Course 5 java_basics Day 39: Abstract Classes vs Interfaces and Default Method Contract Evolution,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-39.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1353,{now_str[:10]},{now_str[11:]},IN_PROGRESS,Block 8 (M2 Batch 2),Antigravity,Course 5 java_basics Day 40: Milestone 7: Pluggable Multi-Provider Payment Gateway Interface Engine,write_to_file; run_command,src/lib/data/javaBasicsLongLessons.ts; src/lib/data/lessonVisuals/java-basics/day-40.json; tests/java_basics_visuals_expansion.test.ts,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n'
]
with open(at_path, 'a', encoding='latin-1') as f:
    f.writelines(task_entries)
print('Registered TASK-1349..1353 in agent_tasks.csv')
