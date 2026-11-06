import os
import re

branches = {
    'Branch A (Present-Career-os)': r'C:\Users\Admin\Desktop\projects\Present-Career-os',
    'Branch B (Present-Career-os-commerce)': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce',
    'Branch C (Present-Career-os-platform)': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform',
}

for bname, bpath in branches.items():
    print(f"\n================ {bname} ================")
    longlessons_path = os.path.join(bpath, 'src', 'lib', 'data', 'longLessons.ts')
    if not os.path.exists(longlessons_path):
        print(f"longLessons.ts NOT FOUND in {bpath}")
        continue
    
    with open(longlessons_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    imports = re.findall(r"import\s*\{\s*(\w+)\s*\}\s*from\s*'(\./[^']+)';", text)
    m1_30 = 0
    m2_30 = 0
    m1_inc = []
    m2_complete_list = []
    m2_partial_list = []
    
    for var_name, rel_path in imports:
        filepath = os.path.normpath(os.path.join(bpath, 'src', 'lib', 'data', rel_path + '.ts'))
        if not os.path.exists(filepath):
            continue
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                c = f.read()
            days = sorted(list(set([int(d) for d in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', c)])))
            m1 = [d for d in days if 1 <= d <= 30]
            m2 = [d for d in days if 31 <= d <= 60]
            
            if len(m1) == 30:
                m1_30 += 1
            else:
                m1_inc.append((os.path.basename(filepath), len(m1)))
            
            if len(m2) == 30:
                m2_30 += 1
                m2_complete_list.append(os.path.basename(filepath))
            elif len(m2) > 0:
                m2_partial_list.append((os.path.basename(filepath), len(m2)))
        except:
            pass
            
    print(f"Total Course Files: {len(imports)}")
    print(f"Month 1 Complete (30 Days): {m1_30}/{len(imports)}")
    if m1_inc:
        print(f"Month 1 Incomplete Courses: {m1_inc}")
    print(f"Month 2 Complete (60 Days Total): {m2_30}/{len(imports)}")
    print(f"Month 2 100% Complete Courses: {m2_complete_list}")
    if m2_partial_list:
        print(f"Month 2 In-Progress/Partial Courses: {m2_partial_list}")
