import os, sys

sys.stdout.reconfigure(encoding='utf-8')

for script_name in ['scripts/append_iot_sec_days11_15.py', 'scripts/verify_iot_sec_block3.py', 'scripts/compile_iot_sec_days11_15_visuals.mts']:
    if os.path.exists(script_name):
        print(f"=== {script_name} ===")
        with open(script_name, 'r', encoding='utf-8') as f:
            print(f.read()[:1500])
