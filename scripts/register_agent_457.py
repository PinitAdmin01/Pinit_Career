import csv

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# Register AGENT-457 for Block 3 (Days 11-15)
new_agent = [
    "AGENT-457",
    "codex/interview-tab-reliability",
    "c:/Users/Admin/Desktop/projects/Present-Career-os",
    "Active",
    "2026-10-19 03:45:00",
    "TASK-1624..1628",
    "In Progress",
    "Course 18 (iot_edge) Month 1 Block 3 (Days 11-15) Depthwise Separable Convolutions & CMSIS-NN Optimization"
]

with open(mac_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(new_agent)

print("Registered AGENT-457 in multi_agent_control.csv")

# Register TASK-1624 to TASK-1628 in agent_tasks.csv
new_tasks = [
    ["TASK-1624", "Course 18 (iot_edge) Day 11: Depthwise Separable Convolution: Math, Flops & Parameter Reduction", "Curriculum", "IN_PROGRESS", "HIGH", "AGENT-457", "2026-10-19", "", "0%", "Authoring Day 11 with >= 2900 words, Gate v2 visual, 38 min declared"],
    ["TASK-1625", "Course 18 (iot_edge) Day 12: im2col Matrix Transformation & SRAM Column Buffer Scratchpads", "Curriculum", "PENDING", "HIGH", "AGENT-457", "2026-10-19", "", "0%", "Authoring Day 12 with >= 2900 words, Gate v2 visual, 38 min declared"],
    ["TASK-1626", "Course 18 (iot_edge) Day 13: ARM CMSIS-NN SMLAD Dual-MAC SIMD Vector Assembly Optimization", "Curriculum", "PENDING", "HIGH", "AGENT-457", "2026-10-19", "", "0%", "Authoring Day 13 with >= 2900 words, Gate v2 visual, 38 min declared"],
    ["TASK-1627", "Course 18 (iot_edge) Day 14: MobileNet on Microcontrollers: Bottleneck Inverted Residuals & Squeeze-Excitation", "Curriculum", "PENDING", "HIGH", "AGENT-457", "2026-10-19", "", "0%", "Authoring Day 14 with >= 2900 words, Gate v2 visual, 38 min declared"],
    ["TASK-1628", "Course 18 (iot_edge) Day 15: Capstone: TinyML Audio Keyword Spotter (KWS) Sub-50ms Inference Engine", "Curriculum", "PENDING", "HIGH", "AGENT-457", "2026-10-19", "", "0%", "Authoring Day 15 with >= 2900 words, Gate v2 visual, 38 min declared"]
]

with open(tasks_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)

print("Registered TASK-1624..1628 in agent_tasks.csv")
