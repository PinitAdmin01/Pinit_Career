const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'lib', 'services');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Service.ts'));

for (const file of files) {
  const full = path.join(dir, file);
  let src = fs.readFileSync(full, 'utf8');
  const before = src;
  src = src.replace(/function readLocalDb\(\): any \{/g, 'async function readLocalDb(): Promise<any> {');
  src = src.replace(/function writeLocalDb\(data: any\): void \{/g, 'async function writeLocalDb(data: any): Promise<void> {');
  src = src.replace(/return readLocalJson\(/g, 'return await readLocalJson(');
  src = src.replace(/writeLocalJson\(([^)]+)\);/g, 'await writeLocalJson($1);');
  src = src.replace(/const db = readLocalDb\(\);/g, 'const db = await readLocalDb();');
  src = src.replace(/return readLocalDb\(\);/g, 'return await readLocalDb();');
  src = src.replace(/writeLocalDb\(([^)]+)\);/g, 'await writeLocalDb($1);');
  if (src !== before) {
    fs.writeFileSync(full, src);
    console.log('updated', file);
  } else {
    console.log('unchanged', file);
  }
}
