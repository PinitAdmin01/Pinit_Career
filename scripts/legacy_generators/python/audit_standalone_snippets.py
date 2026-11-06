import json

def check_all():
    failed = []
    for d in range(36, 41):
        with open(f"scripts/iot_sec_day{d}.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        for idx, p in enumerate(data['parts']):
            code = p['code']
            try:
                exec(code, {})
            except Exception as e:
                print(f"Day {d} Part {idx+1} fails standalone: {type(e).__name__}: {e}")
                failed.append((d, idx+1, str(e)))
    if not failed:
        print("ALL 25 snippets in Days 36-40 execute in isolated namespaces cleanly!")
    else:
        print(f"Total failures: {len(failed)}")

if __name__ == '__main__':
    check_all()
