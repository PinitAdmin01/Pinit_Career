import sys, os
sys.path.insert(0, os.path.abspath('.'))
from scripts.design_day58_data import DAY_58

DAY_58['parts'][2]['code'] = r"""// Sovereign AST Codemod Transformer (Simulating jscodeshift API)
interface AstJsxAttribute {
  name: string;
  value: string;
}

interface AstJsxElement {
  tag: string;
  attributes: Record<string, string>;
  childrenText: string;
}

class SovereignCodemodEngine {
  // Simulates transforming legacy <Modal title="..." onClose="...">Content</Modal>
  // into modern <Dialog><Dialog.Header><Dialog.Title>...</Dialog.Title></Dialog.Header><Dialog.Body>...</Dialog.Body></Dialog>
  public static transformModalToDialog(sourceCode: string): string {
    const modalRegex = /<Modal\s+title=(["'][^"']+["'])\s+onClose=\{([^}]+)\}>([\s\S]*?)<\/Modal>/g;

    return sourceCode.replace(modalRegex, (_match, titleVal, onCloseVal, children) => {
      const cleanChildren = children.trim();
      const cleanTitle = titleVal.replace(/["']/g, '');

      return [
        '<Dialog open={true} onOpenChange={' + onCloseVal + '}>',
        '  <Dialog.Header>',
        '    <Dialog.Title>' + cleanTitle + '</Dialog.Title>',
        '  </Dialog.Header>',
        '  <Dialog.Body>',
        '    ' + cleanChildren,
        '  </Dialog.Body>',
        '</Dialog>'
      ].join('\n');
    });
  }
}

// Sample legacy enterprise component file
const legacyConsumerCode = [
  "import React from 'react';",
  "import { Modal } from '@pinit/components';",
  "",
  "export const DeleteConfirmView = ({ isOpen, onClose }) => {",
  "  return (",
  "    <div>",
  "      <Modal title=\"Confirm Account Deletion\" onClose={onClose}>",
  "        <p>This action cannot be undone. All database records will be erased.</p>",
  "      </Modal>",
  "    </div>",
  "  );",
  "};"
].join('\n');

const migratedCode = SovereignCodemodEngine.transformModalToDialog(legacyConsumerCode);

console.log("=== Automated Codemod Migration Result ===");
console.log(migratedCode);
"""

with open('scripts/design_day58_data.py', 'w', encoding='utf-8') as f:
    f.write('''# scripts/design_day58_data.py
import re
import sys

def count_words(text_list):
    words = len(re.findall(r'\\b[A-Za-z0-9_\\-\\.\\$\\/:\\@\\\']+\\b', ' '.join(text_list)))
    return words

DAY_58 = ''' + repr(DAY_58) + '''

if __name__ == '__main__':
    print(f"Day 58: {DAY_58['title']}")
    for i, p in enumerate(DAY_58['parts'], 1):
        w = count_words(p['say'])
        print(f"  Part {i}: {w} words")
        assert w >= 600, f"Part {i} has {w} words (< 600)"
    print("Day 58 verification complete!")
''')

print("Updated Part 3 code in design_day58_data.py!")
