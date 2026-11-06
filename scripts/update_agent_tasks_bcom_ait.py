import datetime

tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'

rows = [
    'TASK-BCOM-AIT-B7,"bcom_ait Days 31-35: Enterprise Multi-Agent Systems & Cognitive Swarms",Completed,ce7bad69,Present-Career-os,main,2026-10-27 18:06:50\n',
    'TASK-BCOM-AIT-B8,"bcom_ait Days 36-40: Advanced Enterprise RAG & GraphRAG Architectures",Completed,edda74b0,Present-Career-os,main,2026-10-27 18:29:20\n',
    'TASK-BCOM-AIT-B9,"bcom_ait Days 41-45: Fine-Tuning Domain Adaptation & Enterprise Small Language Models (SLMs)",Completed,LOCAL_TESTED,Present-Career-os,main,2026-10-27 19:00:00\n'
]

with open(tasks_path, 'a', encoding='utf-8') as f:
    for row in rows:
        f.write(row)

print("SUCCESS: Appended tasks to agent_tasks.csv")
