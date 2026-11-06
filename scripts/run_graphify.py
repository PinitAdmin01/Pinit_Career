import sys

sys.path.insert(0, r'C:\Users\Admin\AppData\Roaming\uv\tools\graphifyy\Lib\site-packages')
import graphify.cli as cli

sys.argv = ['graphify', 'update', '.']
try:
    cli.dispatch_command(sys.argv[1:])
    print("Graphify update completed successfully!")
except SystemExit as e:
    print(f"Graphify exited with code: {e.code}")
except Exception as e:
    print(f"Graphify encountered error: {e}")
