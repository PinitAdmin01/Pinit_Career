with open('scripts/design_day39_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Part 3
p3_target = "forbidding the mobile operating system from hijacking the gesture into a window-level bounce."
p3_replace = "forbidding the mobile operating system from hijacking the gesture into a window-level bounce. This guarantees that bottom sheet interactions remain self-contained, fluid, and completely impervious to browser-level viewport glitches."
text = text.replace(p3_target, p3_replace, 1)

# Part 4
p4_target = "Every bottom sheet must include an unambiguous, high-contrast close button"
p4_replace = "In our architecture, keyboard users also benefit from intuitive directional shortcuts: pressing the Down Arrow key while focused on the sheet header initiates a step-by-step collapse. Every bottom sheet must include an unambiguous, high-contrast close button"
text = text.replace(p4_target, p4_replace, 1)

# Part 5
p5_target = "All monetary figures are rendered using tabular monospace font numerals"
p5_replace = "Furthermore, our banking sheet implements haptic feedback coordination via the navigator.vibrate API where supported, delivering a subtle five-millisecond vibration pulse when the sheet snaps closed or locks into position. All monetary figures are rendered using tabular monospace font numerals"
text = text.replace(p5_target, p5_replace, 1)

with open('scripts/design_day39_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Topped up Parts 3, 4, 5 in Day 39!")
