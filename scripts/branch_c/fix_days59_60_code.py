import re

def fix_build_script(filepath, func_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # In parts_data: add "code": code1, "output": output1 to each part dictionary
    # Currently each part in parts_data ends with:
    # "why": "..."
    # }
    # Let's add "code": code1, "output": output1 before the closing } of each part
    # Or replace "check": { ... } with "check": { ... }, "code": code1, "output": output1
    
    # Also in dayXX_dict: remove "code": code1,\n    "output": output1,
    content = content.replace('    "code": code1,\n    "output": output1,\n', '')

    # Let's add "code": code1, "output": output1 inside each part of parts_data
    # In parts_data = [ ... ]
    # We can inject "code": code1, "output": output1 into each part dictionary
    # Easiest way: after definition of parts_data:
    loop_inject = '\nfor part in parts_data:\n    part["code"] = code1\n    part["output"] = output1\n'
    
    # insert loop_inject right after code1 & output1 definition
    target = 'output1 = """{'
    idx = content.find(target)
    if idx != -1:
        end_output1 = content.find('}"""', idx) + 4
        content = content[:end_output1] + loop_inject + content[end_output1:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_build_script('scripts/branch_c/build_day59.py', 'testDay59ChaosEngineeringBlastRadius')
fix_build_script('scripts/branch_c/build_day60.py', 'testDay60GrandCapstoneAutonomousSREMesh')
