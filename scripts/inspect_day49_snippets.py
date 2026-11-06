import sys
import subprocess
import tempfile
import os
sys.path.append('scripts')
from design_day49_data import DAY_49

for idx, p in enumerate(DAY_49['parts']):
    print(f"=== PART {idx+1}: {p['title']} ===")
    code = p.get('code', '')
    expected = p.get('expectedOutput', '')
    print(f"Code len: {len(code)} chars, expectedOutput: {expected!r}")
