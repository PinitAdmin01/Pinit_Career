with open('scripts/design_day37_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

part5_old_out = """=== INSTITUTIONAL FLOATING PORTAL MANAGER SYSTEM ===
Successfully Mounted Floating Menu:
<div id="portal-floating-trade-menu-01"
     class="fixed pointer-events-auto transition-transform duration-100 ease-out shadow-2xl rounded"
     style="top: 758px; left: 600px; z-index: 3000;">
  <div class="content p-4 bg-slate-900 border border-slate-700 text-white font-mono text-sm">
    <div class="font-bold text-amber-400 Trading Desk Execution Portal</div>
    <div>Placement: bottom-start | Tier Z-Index: 3000</div>
  </div>
</div>

Active Institutional Overlay Registry:
 • Overlay [trade-menu-01] -> Tier: 3000 | Coords: (600, 758) | Placement: bottom-start
 • Overlay [trade-sub-tooltip-01] -> Tier: 1000 | Coords: (716, 770) | Placement: right

Unmounting Sub-Tooltip...
Remaining Overlays in System: 1"""

part5_new_out = """=== INSTITUTIONAL FLOATING PORTAL MANAGER SYSTEM ===
Successfully Mounted Floating Menu:
<div id="portal-floating-trade-menu-01"
     class="fixed pointer-events-auto transition-transform duration-100 ease-out shadow-2xl rounded"
     style="top: 758px; left: 600px; z-index: 3000;">
  <div class="content p-4 bg-slate-900 border border-slate-700 text-white font-mono text-sm">
    <div class="font-bold text-amber-400">Trading Desk Execution Portal</div>
    <div>Placement: bottom-start | Tier Z-Index: 3000</div>
  </div>
</div>

Active Institutional Overlay Registry:
 • Overlay [trade-menu-01] -> Tier: 3000 | Coords: (600, 758) | Placement: bottom-start
 • Overlay [trade-sub-tooltip-01] -> Tier: 1000 | Coords: (716, 770) | Placement: right

Unmounting Sub-Tooltip...
Remaining Overlays in System: 1"""

text = text.replace(part5_old_out, part5_new_out)
with open('scripts/design_day37_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Day 37 Part 5 output!")
