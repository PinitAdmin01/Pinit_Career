import glob
import sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('tests/*visual*.ts') + glob.glob('tests/*lesson*.ts'):
    print(f)
