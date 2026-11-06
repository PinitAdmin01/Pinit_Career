import { compileTs } from './src/lib/code/compileTs';
import * as fs from 'node:fs';

const outputs = JSON.parse(fs.readFileSync('scripts/cloud_day31_outputs.json', 'utf-8'));

async function testCompile() {
  const p1 = `interface Foo { x: number; } const f: Foo = { x: 42 }; console.log("Value: " + f.x);`;
  const res = await compileTs(p1);
  console.log("Compiled JS:", res.js);
}

testCompile().catch(console.error);
