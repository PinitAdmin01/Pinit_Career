const fs = require('fs');
const { execSync } = require('child_process');

// Run python with pypdf to extract pages 420 to 435
const script = `
import sys
from pypdf import PdfReader
sys.stdout.reconfigure(encoding='utf-8')
reader = PdfReader('docs/visuals/PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf')
for p in range(419, 435):
    print(f'=== PAGE {p+1} ===')
    text = reader.pages[p].extract_text()
    for line in text.splitlines():
        if line.strip().startswith('Day ') or line.strip().startswith('Block ') or 'COURSE' in line.upper():
            print(f'  {line.strip()[:100]}')
`;
fs.writeFileSync('scripts/extract_ent_pages.py', script);
console.log('Script written.');
