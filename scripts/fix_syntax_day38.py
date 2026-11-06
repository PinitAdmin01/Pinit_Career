with open('scripts/design_day38_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

bad = '''"Additionally, the candlestick tooltip integrates high-contrast visual states for accessibility. When users configure their operating system to high contrast mode (such as Windows High Contrast Black), the CSS engine replaces subtle background shadows with explicit two-pixel high-contrast border outlines. Assistive technology agents and keyboard magnification utilities can cleanly distinguish the floating overlay from the dense candlestick graph beneath it.
                Furthermore, our implementation incorporates touch device support."'''

good = '''"Additionally, the candlestick tooltip integrates high-contrast visual states for accessibility. When users configure their operating system to high contrast mode (such as Windows High Contrast Black), the CSS engine replaces subtle background shadows with explicit two-pixel high-contrast border outlines. Assistive technology agents and keyboard magnification utilities can cleanly distinguish the floating overlay from the dense candlestick graph beneath it.",
                "Furthermore, our implementation incorporates touch device support."'''

text = text.replace(bad, good, 1)

with open('scripts/design_day38_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed syntax in Day 38 Part 5!")
