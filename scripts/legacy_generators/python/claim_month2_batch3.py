import os

mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(mem_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(mem_dir, "multi_agent_control.csv")

new_tasks = [
    'TASK-1192,"excel_viz Day 41: Exploratory Data Analysis & Descriptive Statistics: Skewness, Kurtosis, Interquartile Range & Outlier Detection",AGENT-381,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1193,"excel_viz Day 42: Inferential Statistics & Hypothesis Testing in Excel: Z-Tests, T-Tests, Paired Samples & ANOVA F-Tests",AGENT-381,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1194,"excel_viz Day 43: Bivariate Correlation & Ordinary Least Squares (OLS) Linear Regression: R², Residual Plots & P-Values",AGENT-381,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1195,"excel_viz Day 44: Time-Series Forecasting & Exponential Smoothing: Seasonality Decomposition & Trend Projections (FORECAST.ETS)",AGENT-381,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1196,"excel_viz Day 45: ⭐ Milestone 6: ApexAnalytics Statistical Testing & Time-Series Forecasting Engine Suite",AGENT-381,Course 21 excel_viz,In_Progress,2026-10-17'
]

with open(agent_tasks_path, "a", encoding="utf-8") as f:
    f.write("\n" + "\n".join(new_tasks) + "\n")

agent_row = 'AGENT-381,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1196,In_Progress,2026-10-17 21:15:00,"5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 3 — Course 21 excel_viz Days 41-45 & Milestone 6 Capstone: ApexAnalytics Statistical Testing & Time-Series Forecasting Engine Suite (TASK-1192..1196)."'

with open(multi_agent_path, "a", encoding="utf-8") as f:
    f.write("\n" + agent_row + "\n")

print("Batch 3 registered successfully with AGENT-381 and TASK-1192..1196!")
