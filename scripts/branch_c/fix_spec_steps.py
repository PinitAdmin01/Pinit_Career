import os, subprocess

days = [33, 34, 35]

replacement_code = '''entries = []
for p_idx, part in enumerate(parts_data):
    spec_steps = []
    for s_idx, at_k in enumerate(["say1", "say2", "example", "tryIt"]):
        cap = captions_data[p_idx][at_k]
        assert len(cap) <= 75, f"Part {p_idx+1} {at_k} caption too long: {len(cap)} ({cap})"
        assert cap.endswith('.'), f"Part {p_idx+1} {at_k} caption must end with period: ({cap})"
        assert not any(c.isdigit() for c in cap), f"Part {p_idx+1} {at_k} caption contains digits: ({cap})"
        spec_steps.append({
            "at": at_k,
            "caption": cap,
            "rows": steps_rows[p_idx][s_idx]
        })
        
    spec = {
        "template": "table",
        "title": titles[p_idx],
        "columns": columns_list[p_idx],
        "steps": spec_steps
    }
    assert len(spec['title']) <= 75, f"Title too long: {spec['title']}"
    assert spec['title'].endswith('.'), f"Title must end with dot: {spec['title']}"
    assert not any(c.isdigit() for c in spec['title']), f"Title has digits: {spec['title']}"
    
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "spec": spec,
        "filled": spec
    }
    entries.append(entry)
'''

for day in days:
    path = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day{day}_prompt.py'
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Find where entries = [] starts and visual_envelope starts
    idx_entries = text.find('entries = []')
    idx_envelope = text.find('visual_envelope = {')
    
    if idx_entries != -1 and idx_envelope != -1:
        new_text = text[:idx_entries] + replacement_code + '\n' + text[idx_envelope:]
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f"Patched build_day{day}_prompt.py")
        
        # Run it
        res = subprocess.run(['python', path], capture_output=True, text=True)
        print(f"Ran build_day{day}_prompt.py: Return {res.returncode}")
        if res.returncode != 0:
            print(res.stderr)
        else:
            print(res.stdout[-150:])
