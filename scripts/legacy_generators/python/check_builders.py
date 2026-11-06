import sys, os
sys.stdout.reconfigure(encoding='utf-8')
builders = [f for f in os.listdir('scripts') if f.startswith('day5') and f.endswith('_builder.py')]
for f in sorted(builders):
    size = os.path.getsize(os.path.join('scripts', f))
    print(f'{f}: {size} bytes')
