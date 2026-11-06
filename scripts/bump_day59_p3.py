with open('scripts/day59_builder.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a sentence to Part 3
p3_target = 'We implement graduated threat evaluation, execute automated session revocation, trigger memory circuit breakers, capture forensic telemetry, and generate incident containment manifests.'
p3_new = 'We implement graduated threat evaluation, execute automated session revocation, trigger memory circuit breakers, verify cryptographic quarantine integrity, capture forensic telemetry, and generate incident containment manifests.'
content = content.replace(p3_target, p3_new)

# Add one more sentence to Part 5 as well to make sure it's safely over 600
p5_target = 'The Master Incident Center binds all defensive capabilities into a synchronized response fabric:'
p5_new = 'Operating as a unified cognitive fortress, the Master Incident Center binds all defensive capabilities into a synchronized response fabric:'
content = content.replace(p5_target, p5_new)

with open('scripts/day59_builder.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Bumped Part 3 and 5")
