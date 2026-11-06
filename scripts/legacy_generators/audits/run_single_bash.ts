import { executeBashSuite } from '../src/lib/code/runners/bashRunner';
import * as fs from 'fs';

async function main() {
  const code = fs.readFileSync(process.argv[2], 'utf8');
  const res = await executeBashSuite(code);
  process.stdout.write(res.stdout || '');
}
main();
