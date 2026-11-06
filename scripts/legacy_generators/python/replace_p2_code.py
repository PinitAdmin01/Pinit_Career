import sys, os
sys.path.insert(0, os.path.abspath('.'))
from scripts.design_day57_data import DAY_57

DAY_57['parts'][1]['code'] = r"""// AST Component Scanner Simulation (Extracting Imports, Tags & Props)
interface ImportBinding {
  localName: string;
  importedName: string;
  sourceModule: string;
}

interface JsxUsageNode {
  tagName: string;
  props: Record<string, string | number | boolean>;
  lineNumber: number;
}

class StaticAstScanner {
  public static parseFileSimulated(sourceCode: string, targetPackage: string) {
    const lines = sourceCode.split('\n');
    const imports: ImportBinding[] = [];
    const usages: { component: string; props: Record<string, any>; line: number }[] = [];

    // 1. Extract imports from target package
    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(sourceCode)) !== null) {
      const specifiers = match[1].split(',').map(s => s.trim());
      const source = match[2];
      if (source === targetPackage) {
        for (const spec of specifiers) {
          const parts = spec.split(/\s+as\s+/);
          const importedName = parts[0].trim();
          const localName = parts[1] ? parts[1].trim() : importedName;
          imports.push({ importedName, localName, sourceModule: source });
        }
      }
    }

    // 2. Scan for JSX tags matching imported bindings
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      for (const imp of imports) {
        const tagPattern = new RegExp('<' + imp.localName + '\\b([^>]*)' + '/?>', 'g');
        let tagMatch;
        while ((tagMatch = tagPattern.exec(line)) !== null) {
          const rawProps = tagMatch[1];
          const props: Record<string, any> = {};
          
          // Simple prop extractor
          const propRegex = /([a-zA-Z0-9_-]+)(?:=(?:["']([^"']*)["']|\{([^}]*)\}))?/g;
          let pMatch;
          while ((pMatch = propRegex.exec(rawProps)) !== null) {
            const key = pMatch[1];
            const val = pMatch[2] !== undefined ? pMatch[2] : pMatch[3] !== undefined ? pMatch[3] : true;
            props[key] = val;
          }

          usages.push({
            component: imp.importedName,
            props,
            line: lineIdx + 1
          });
        }
      }
    }

    return { imports, usages };
  }
}

const sampleCode = `
import React from 'react';
import { Button as BrandButton, Dialog } from '@pinit/design-system';
import { OldLegacyWidget } from 'legacy-lib';

export const CheckoutView = () => {
  return (
    <div>
      <Dialog isOpen={true} title="Confirm Order">
        <p>Are you sure?</p>
        <BrandButton variant="primary" size="lg" isDisabled={false}>
          Complete Purchase
        </BrandButton>
      </Dialog>
    </div>
  );
};
`;

const scan = StaticAstScanner.parseFileSimulated(sampleCode, '@pinit/design-system');

console.log("Discovered Design System Imports: " + scan.imports.length);
scan.imports.forEach(i => console.log(`  - ${i.importedName} aliased as ${i.localName}`));

console.log("Discovered JSX Component Usages: " + scan.usages.length);
scan.usages.forEach(u => {
  console.log(`  - <${u.component}> on line ${u.line} with props: ${JSON.stringify(u.props)}`);
});
"""

# Now write back
with open('scripts/design_day57_data.py', 'w', encoding='utf-8') as f:
    f.write('''# scripts/design_day57_data.py
import re
import sys

def count_words(text_list):
    words = len(re.findall(r'\\b[A-Za-z0-9_\\-\\.\\$\\/:\\@\\\']+\\b', ' '.join(text_list)))
    return words

DAY_57 = ''' + repr(DAY_57) + '''

if __name__ == '__main__':
    print(f"Day 57: {DAY_57['title']}")
    for i, p in enumerate(DAY_57['parts'], 1):
        w = count_words(p['say'])
        print(f"  Part {i}: {w} words")
        assert w >= 600, f"Part {i} has {w} words (< 600)"
    print("Day 57 verification complete!")
''')

print("Directly replaced Part 2 code in design_day57_data.py!")
