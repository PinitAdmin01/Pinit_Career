import datetime

task_entry = f"TASK-1937,dsa-optim Day 31: Advanced Graph Algorithms: Tarjans Strongly Connected Components (SCC) & Bridge Detection,Completed,cdbeca64,Present-Career-os-platform,agent/branch-c-platform-admin-faculty,{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"

with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "a", encoding="utf-8") as f:
    f.write(task_entry)

print("Appended TASK-1937 to agent_tasks.csv")
