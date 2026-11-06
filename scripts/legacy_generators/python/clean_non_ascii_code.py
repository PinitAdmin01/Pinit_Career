import json

def clean_non_ascii():
    for d in range(36, 41):
        with open(f"scripts/iot_sec_day{d}.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        for idx, p in enumerate(data['parts']):
            code = p['code']
            clean_code = []
            for ch in code:
                if ord(ch) > 127:
                    if ch == '≈':
                        clean_code.append('~=')
                    elif ch in ('’', '‘'):
                        clean_code.append("'")
                    elif ch in ('“', '”'):
                        clean_code.append('"')
                    elif ch == '–':
                        clean_code.append('-')
                    elif ch == '—':
                        clean_code.append('--')
                    elif ch == 'µ':
                        clean_code.append('u')
                    else:
                        clean_code.append(' ')
                else:
                    clean_code.append(ch)
            p['code'] = "".join(clean_code)
        with open(f"scripts/iot_sec_day{d}.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    print("All non-ASCII characters cleaned from code snippets successfully!")

if __name__ == '__main__':
    clean_non_ascii()
