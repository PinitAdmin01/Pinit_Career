with open('scripts/design_day38_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Part 3: add a sentence
p3_target = "This eliminates memory allocations entirely during chart scrubbing."
p3_replace = "This eliminates memory allocations entirely during chart scrubbing. Furthermore, by maintaining a stable object reference, downstream components can bind reactive listeners to the virtual anchor without causing unneeded re-renders or GC pressure."
text = text.replace(p3_target, p3_replace, 1)

# Part 5: add a rich paragraph
p5_target = "Furthermore, our implementation incorporates touch device support."
p5_replace = """Additionally, the candlestick tooltip integrates high-contrast visual states for accessibility. When users configure their operating system to high contrast mode (such as Windows High Contrast Black), the CSS engine replaces subtle background shadows with explicit two-pixel high-contrast border outlines. Assistive technology agents and keyboard magnification utilities can cleanly distinguish the floating overlay from the dense candlestick graph beneath it.
                Furthermore, our implementation incorporates touch device support."""
text = text.replace(p5_target, p5_replace, 1)

with open('scripts/design_day38_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Topped up Part 3 and Part 5!")
