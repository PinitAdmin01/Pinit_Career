import vm from 'node:vm';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function runSnippet(code: string): Promise<string> {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math,
    Map,
    Set,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON,
    Date
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n').trim();
}

async function main() {
  const days = [36, 37, 38, 39];
  for (const d of days) {
    console.log(`Checking Day ${d}...`);
    const mod = await import(`./data_devops_day${d}.py`); // Wait, this is TS trying to import python!
  }
}
main();
