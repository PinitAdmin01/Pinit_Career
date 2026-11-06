with open('scripts/day58_builder.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a sentence to Part 4
p4_target = 'We implement multi-agent utility evaluation, execute automated Nash bargaining negotiations across Treasury, Legal, and Supply Chain nodes, handle deadlock detection, and enforce executive cryptographic sign-off gates.'
p4_new = 'We implement multi-agent utility evaluation, execute automated Nash bargaining negotiations across Treasury, Legal, and Supply Chain nodes, establish algorithmic convergence criteria, handle deadlock detection, and enforce executive cryptographic sign-off gates.'

content = content.replace(p4_target, p4_new)

# Add a sentence to Part 5 as well just in case
p5_target = 'By completing this milestone, you prove mastery over the ultimate frontier of digital business transformation: transforming fragmented corporate silos into a synchronized, self-optimizing, and mathematically resilient cognitive enterprise operating mesh.'
p5_new = '''This foundational capstone positions enterprise leaders to steer complex global corporate conglomerates with absolute clarity, unshakeable fiduciary governance, and mathematical confidence in the age of autonomous artificial intelligence. ''' + p5_target

content = content.replace(p5_target, p5_new)

with open('scripts/day58_builder.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Bumped Part 4 and Part 5")
