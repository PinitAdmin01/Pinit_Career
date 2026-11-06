import sys
sys.path.append('scripts')

for b, d_range in [(2, range(6, 11)), (3, range(11, 16)), (4, range(16, 21))]:
    for d in d_range:
        mod = __import__(f'block{b}_day{d}')
        day_obj = getattr(mod, f'DAY_{d}')
        check_counts = []
        for p in day_obj['parts']:
            checks = p.get('checks') or ( [p.get('check')] if p.get('check') else [] )
            check_counts.append(len(checks))
        print(f"Day {d} checks per part: {check_counts}")
