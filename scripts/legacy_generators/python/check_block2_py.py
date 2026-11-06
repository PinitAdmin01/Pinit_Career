import sys
sys.path.append('scripts')

for d in range(6, 11):
    try:
        mod = __import__(f'block2_day{d}')
        day_obj = getattr(mod, f'DAY_{d}')
        wcs = [len(p.get('content', '').split()) for p in day_obj['parts']]
        print(f"block2_day{d}: {wcs} (Total: {sum(wcs)}) | All >= 580: {all(w >= 580 for w in wcs)}")
    except Exception as e:
        print(f"Error checking block2_day{d}: {e}")
