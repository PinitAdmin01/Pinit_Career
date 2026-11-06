import sys
sys.path.append('scripts')

print("=== CHECKING BLOCK 3 (DAYS 11 to 15) ===")
for d in range(11, 16):
    try:
        mod = __import__(f'block3_day{d}')
        day_obj = getattr(mod, f'DAY_{d}')
        wcs = [len(p.get('content', '').split()) for p in day_obj['parts']]
        print(f"block3_day{d}: {wcs} (Total: {sum(wcs)}) | All >= 580: {all(w >= 580 for w in wcs)}")
    except Exception as e:
        print(f"Error checking block3_day{d}: {e}")

print("\n=== CHECKING BLOCK 4 (DAYS 16 to 20) ===")
for d in range(16, 21):
    try:
        mod = __import__(f'block4_day{d}')
        day_obj = getattr(mod, f'DAY_{d}')
        wcs = [len(p.get('content', '').split()) for p in day_obj['parts']]
        print(f"block4_day{d}: {wcs} (Total: {sum(wcs)}) | All >= 580: {all(w >= 580 for w in wcs)}")
    except Exception as e:
        print(f"Error checking block4_day{d}: {e}")
