import sys
sys.path.append('scripts')

all_blocks_ok = True

for b, d_range in [(2, range(6, 11)), (3, range(11, 16)), (4, range(16, 21))]:
    print(f"\n=== INSPECTING BLOCK {b} (DAYS {min(d_range)} to {max(d_range)}) ===")
    for d in d_range:
        mod = __import__(f'block{b}_day{d}')
        day_obj = getattr(mod, f'DAY_{d}')
        parts = day_obj.get('parts', [])
        
        has_5_parts = len(parts) == 5
        wcs = [len(p.get('content', '').split()) for p in parts]
        all_wc_ok = all(w >= 580 for w in wcs)
        
        has_tryit = all(bool(p.get('tryIt')) for p in parts)
        has_code = all(len(p.get('code', '')) > 30 for p in parts)
        
        # Check checks
        checks_ok = True
        for p in parts:
            checks = p.get('checks') or ( [p.get('check')] if p.get('check') else [] )
            if len(checks) < 1:
                checks_ok = False
            for c in checks:
                if c.get('answer') != 0:
                    checks_ok = False
                if len(c.get('options', [])) != 4:
                    checks_ok = False
                expl = c.get('explanation') or c.get('why') or ''
                if len(expl) < 15:
                    checks_ok = False

        print(f"Day {d}: {day_obj.get('title')[:45]}...")
        print(f"  Words: {wcs} (Total: {sum(wcs)}) | >=580: {all_wc_ok}")
        print(f"  hasCode: {has_code} | hasTryIt: {has_tryit} | checksOK: {checks_ok}")
        
        if not (has_5_parts and all_wc_ok and has_code and checks_ok):
            all_blocks_ok = False

print(f"\nOVERALL READINESS: {'READY TO ASSEMBLE' if all_blocks_ok else 'NEEDS ENRICHMENT'}")
