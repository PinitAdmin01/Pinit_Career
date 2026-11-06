# scripts/topup_day59_p3_p5.py
content = open("scripts/create_dist_day59_data.py", "r", encoding="utf-8").read()

p3_more = " This ensures that even inside multi-tenant public cloud virtual machines, packet processing pipelines bypass standard operating system virtualization bottlenecks with microsecond packet delivery."
content = content.replace("virtual machine memory buffers.", "virtual machine memory buffers." + p3_more)

p5_more = " Tomorrow, in Day 60, we crown our entire two-month curriculum with the ultimate master capstone: Course 16 Grand Master Capstone: Planetary Distributed Cloud Architecture!"
content = content.replace("distributed cloud infrastructure.", "distributed cloud infrastructure." + p5_more)

open("scripts/create_dist_day59_data.py", "w", encoding="utf-8").write(content)
print("Updated Day 59 Part 3 and 5.")
