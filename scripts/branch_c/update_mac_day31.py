mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
entry = "AGENT-502,agent/branch-c-platform-admin-faculty,Present-Career-os-platform,Active,Course: dsa-optim Month 2 Block 7 Day 31 Completed & Pushed,cdbeca64\n"

with open(mac_path, "a", encoding="utf-8") as f:
    f.write(entry)

print("Updated multi_agent_control.csv")
