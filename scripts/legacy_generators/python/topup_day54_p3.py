# scripts/topup_day54_p3.py
import re

content = open("scripts/create_dist_day54_data.py", "r", encoding="utf-8").read()

old_p3 = 'Similarly, Memory Pressure experiments validate operating system cgroups and Linux Out-Of-Memory (OOM) killer handling. When a container exceeds its declared `resources.limits.memory`, the Linux kernel triggers the OOM killer (`dmesg: oom-kill: Killed process`), abruptly terminating the container with exit code 137. Chaos experiments systematically ramp up synthetic memory allocations to verify that the application terminates gracefully without corrupting shared database files, and that Kubernetes restarts the container with zero impact to active user sessions.'

new_p3 = 'Similarly, Memory Pressure experiments validate operating system cgroups and Linux Out-Of-Memory (OOM) killer handling. When a container exceeds its declared `resources.limits.memory`, the Linux kernel triggers the OOM killer (`dmesg: oom-kill: Killed process`), abruptly terminating the container with exit code 137. Chaos experiments systematically ramp up synthetic memory allocations to verify that the application terminates gracefully without corrupting shared database files, and that Kubernetes restarts the container with zero impact to active user sessions. Furthermore, Node Drain simulations evaluate cluster oversubscription and autoscaling latency: when an entire node is evicted, the cluster autoscaler must spin up fresh cloud VM capacity before node memory ceilings are breached.'

content = content.replace(old_p3, new_p3)
open("scripts/create_dist_day54_data.py", "w", encoding="utf-8").write(content)
print("Updated Day 54 Part 3.")
