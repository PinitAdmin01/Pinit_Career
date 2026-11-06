import sys
import os

main_py = r'C:\Users\Admin\AppData\Roaming\uv\tools\graphifyy\Lib\site-packages\graphify\__main__.py'
if os.path.exists(main_py):
    with open(main_py, 'r', encoding='utf-8') as f:
        print(f.read())
else:
    print("__main__.py not found")
