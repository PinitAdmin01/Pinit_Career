with open('scripts/design_day39_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_out = """Rendered Sheet DOM Fragment:
 <div id="portal-banking-sheet" class="fixed inset-0 z-50 flex flex-col justify-end">
  <div class="backdrop bg-black/60 fixed inset-0 transition-opacity" aria-hidden="true"></div>
  <div role="dialog" aria-modal="true" aria-labelledby="tx-sheet-title"
       class="sheet-card relative bg-slate-900 border-t border-slate-700 rounded-t-2xl shadow-2xl"
       style="height: 520px; padding-bottom: 34px;">
    <div class="drag-handle-bar w-12 h-1.5 bg-slate-600 rounded-full mx-auto my-3" aria-hidden="true"></div>
    <div class="p-6">
      <h2 id="tx-sheet-title" class="text-lg font-bold text-white">Transaction Details</h2>
      <div class="my-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
        <div class="text-xs text-slate-400">Merchant</div>
        <div class="text-base font-bold text-white">Apex Capital International Settlement</div>
        <div class="mt-2 text-xs text-slate-400">Settled Amount</div> 
   ..."""

new_out = """Rendered Sheet DOM Fragment:
 <div id="portal-banking-sheet" class="fixed inset-0 z-50 flex flex-col justify-end">
  <div class="backdrop bg-black/60 fixed inset-0 transition-opacity" aria-hidden="true"></div>
  <div role="dialog" aria-modal="true" aria-labelledby="tx-sheet-title"
       class="sheet-card relative bg-slate-900 border-t border-slate-700 rounded-t-2xl shadow-2xl"
       style="height: 520px; padding-bottom: 34px;">
    <div class="drag-handle-bar w-12 h-1.5 bg-slate-600 rounded-full mx-auto my-3" aria-hidden="true"></div>
    <div class="p-6">
      <h2 id="tx-sheet-title" class="text-lg font-bold text-white">Transaction Details</h2>
      <div class="my-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
        <div class="text-xs text-slate-400">Merchant</div>
        <div class="text-base font-bold text-white">Apex Capital International Settlement</div> 
   ..."""

text = text.replace(old_out, new_out)
with open('scripts/design_day39_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Day 39 Part 5 output match!")
