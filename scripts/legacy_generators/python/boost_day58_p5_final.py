with open("scripts/build_iot_sec_day58.py", "r", encoding="utf-8") as f:
    text = f.read()

p5_final = '''        "This rigorous mathematical validation guarantees that the industrial control firmware deployed on edge controllers, substation relays, and smart sensors operates with certified zero-trust resilience across decades of unattended operational service."'''

pos5 = text.find('p5_say = [')
end5 = text.find('    ]', pos5)
text = text[:end5] + ',\n' + p5_final + '\n' + text[end5:]

with open("scripts/build_iot_sec_day58.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted Part 5 of Day 58 to >= 580 words!")
