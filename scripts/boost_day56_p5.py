with open("scripts/build_iot_sec_day56.py", "r", encoding="utf-8") as f:
    text = f.read()

p5_more = '''        "In distributed smart grid environments, the zero-trust mesh subsystem operates in concert with automated failover and topology self-healing algorithms. If an edge routing node experiences sudden physical power loss or persistent RF jamming, neighboring mesh nodes automatically recalculate RPL (Routing Protocol for Low-Power and Lossy Networks) destination-oriented directed acyclic graphs (DODAGs) within 200 milliseconds. Every new parent-child routing adjacency triggers a mutual cryptographic challenge-response sequence to re-verify link-layer trust before user telemetry packets are admitted onto the alternate wireless path.",
        "As industrial systems transition into the Industry 4.0 era, the importance of robust, cryptographically sound mesh communications cannot be overstated. By unifying authenticated AES-CCM* encryption, out-of-order sliding-window replay defense, high-efficiency 6LoWPAN compression, and zero-knowledge Thread MeshCop commissioning, the Day 56 curriculum provides embedded engineers with the foundational architecture required to build impervious wireless mesh fabrics."'''

pos = text.find('p5_say = [')
end_pos = text.find('    ]', pos)
text = text[:end_pos] + ',\n' + p5_more + '\n' + text[end_pos:]

with open("scripts/build_iot_sec_day56.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted Part 5 of Day 56!")
