import csv
from datetime import datetime

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# Register TASK-1669 through TASK-1673
days = [
    (36, "Micro-Acoustic Interfacing: I2S Bus, PDM Microphones & Decimation Sinc Filters"),
    (37, "Fast Audio Feature Extraction: Log-Mel Filterbanks, STFT & CMSIS-DSP MFCCs"),
    (38, "Micro-Acoustic Keyword Spotting: 1D Depthwise CNNs vs Streaming GRU Models"),
    (39, "Acoustic Noise Cancellation: Fixed-Point LMS Adaptive Filters on Microcontrollers"),
    (40, "Milestone 7: Autonomous Ultra-Low-Power PDM Acoustic Keyword Spotting & Voice Trigger Engine")
]

new_tasks = []
today = datetime.now().strftime("%Y-%m-%d")
time_now = datetime.now().strftime("%H:%M:%S")

for idx, (day_num, title) in enumerate(days):
    task_id = f"TASK-{1669 + idx}"
    new_tasks.append([
        task_id,
        f"Course 18 Block 8 Day {day_num}",
        "Antigravity",
        "IN_PROGRESS",
        "src/lib/data/iotEdgeLongLessons.ts",
        "High",
        f"Month 2 Day {day_num}: {title}",
        today,
        "0%",
        f"Initiating Block 8 Day {day_num} expansion",
        "",
        ""
    ])

with open(tasks_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)

print("Appended TASK-1669..1673 to agent_tasks.csv")

# Register AGENT-466 in multi_agent_control.csv
new_mac = [
    "AGENT-466",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1669..1673",
    "In_Progress",
    "Active",
    "Course 18 Block 8 Days 36-40 (I2S/PDM Audio, MFCCs, Keyword Spotting & Milestone 7 Voice Trigger Engine)",
    f"{today} {time_now}",
    "",
    "",
    ""
]

with open(mac_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(new_mac)

print("Appended AGENT-466 to multi_agent_control.csv")
