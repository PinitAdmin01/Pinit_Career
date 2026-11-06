# scripts/update_central_memory_final.py
import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
entry_mac = f'TASK-2010,Branch A,course-3d-graphics,Days 56-60,COMPLETED,{now_str},Block 12 Occlusion Culling Virtual Geometry Nanite DAGs Render Graphs Profiler & Grand Final Capstone (60/60 Days - 100% Complete - COURSE 15 GRADUATED)\n'

with open(mac_file, "a", encoding="utf-8") as f:
    f.write(entry_mac)

tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
entry_tasks = f'TASK-2010,Branch A,course-3d-graphics,Month 2 Block 12 (Days 56-60 & Grand Final Capstone),COMPLETED,{now_str},60/60 Days (100% Complete) - Course 15 Graduated\n'

try:
    with open(tasks_file, "a", encoding="utf-8") as f:
        f.write(entry_tasks)
    print("Updated agent_tasks.csv")
except Exception as e:
    print(f"agent_tasks.csv update note: {e}")

print("Updated multi_agent_control.csv with TASK-2010")
