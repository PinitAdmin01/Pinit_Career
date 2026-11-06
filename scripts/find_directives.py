import glob
import sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob(r'C:\Users\Admin\Desktop\projects\memory of agent\*directive*') + glob.glob(r'C:\Users\Admin\Desktop\projects\memory of agent\*BRANCH*') + glob.glob(r'C:\Users\Admin\Desktop\projects\memory of agent\*branch*'):
    print(f)

for f in glob.glob('scripts/*directive*') + glob.glob('scripts/*branch*'):
    print(f)
