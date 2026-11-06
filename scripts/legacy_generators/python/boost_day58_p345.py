with open("scripts/build_iot_sec_day58.py", "r", encoding="utf-8") as f:
    text = f.read()

p3_more = '''        "In safety-critical avionics and industrial SCADA controllers, explicit-state model checking is also deployed to verify Deadlock Freedom and Termination. A deadlock occurs when a set of concurrent processes enter a mutually blocking state where no process can proceed—for example, if node A waits for a packet from node B, while node B simultaneously waits for an acknowledgment from node A. Our BFS explorer evaluates the out-degree of every non-terminal state graph node: if any reachable non-terminal state has an out-degree of zero, the engine flags a critical protocol deadlock hazard."'''

p4_more = '''        "Furthermore, automated counterexample trace generation accelerates compliance auditing by converting complex formal failures into human-readable sequence diagrams. Instead of deciphering abstract mathematical logic formulas, firmware developers and validation engineers can directly inspect the chronological sequence of transmitted packets, identifying exactly which message field was exploited by the attacker. This rapid diagnostic loop reduces protocol remediation timelines from months to hours."'''

p5_more = '''        "As we finalize our formal verification architecture, the mathematical certitude provided by symbolic execution represents the ultimate evolutionary step in secure embedded software engineering. By ensuring that protocol models are mathematically proven sound before a single line of C or assembly code is written, engineering organizations eliminate the most elusive, expensive, and catastrophic class of cybersecurity vulnerabilities. The resulting formal verification artifacts establish an unshakeable standard of trust across industrial operational technology."'''

pos3 = text.find('p3_say = [')
end3 = text.find('    ]', pos3)
text = text[:end3] + ',\n' + p3_more + '\n' + text[end3:]

pos4 = text.find('p4_say = [')
end4 = text.find('    ]', pos4)
text = text[:end4] + ',\n' + p4_more + '\n' + text[end4:]

pos5 = text.find('p5_say = [')
end5 = text.find('    ]', pos5)
text = text[:end5] + ',\n' + p5_more + '\n' + text[end5:]

with open("scripts/build_iot_sec_day58.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted Parts 3, 4, 5 of Day 58!")
