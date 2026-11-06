with open('scripts/design_day38_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

lines[572] = '                "Additionally, the candlestick tooltip integrates high-contrast visual states for accessibility. When users configure their operating system to high contrast mode (such as Windows High Contrast Black), the CSS engine replaces subtle background shadows with explicit two-pixel high-contrast border outlines. Assistive technology agents and keyboard magnification utilities can cleanly distinguish the floating overlay from the dense candlestick graph beneath it.",\n'
lines[573] = '                "Furthermore, our implementation incorporates touch device support. When an analyst operates on an iPad or Microsoft Surface touchscreen in an executive boardroom, mouse hover events do not exist. The chart engine seamlessly translates touch tap gestures into virtual anchor coordinate locks, displaying the tooltip with an explicit touch dismissal hit-area outside the chart bounds.",\n'

with open('scripts/design_day38_data.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Cleaned up lines 573-574!")
