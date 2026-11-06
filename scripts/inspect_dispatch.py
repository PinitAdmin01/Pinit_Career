import sys

sys.path.insert(0, r'C:\Users\Admin\AppData\Roaming\uv\tools\graphifyy\Lib\site-packages')
import inspect
import graphify.cli as cli

print("dispatch_command signature:", inspect.signature(cli.dispatch_command))
