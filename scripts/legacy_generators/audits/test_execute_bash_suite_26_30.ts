import assert from 'node:assert';
import { executeBashSuite } from '../src/lib/code/runners/bashRunner';
import { GIT_VCS_LONG_LESSONS } from '../src/lib/data/gitVcsLongLessons';

async function testAll() {
  console.log('Testing executeBashSuite on Days 26-30...');
  for (let dayNum = 26; dayNum <= 30; dayNum++) {
    const d = GIT_VCS_LONG_LESSONS.find(l => l.day === dayNum);
    assert.ok(d, `Day ${dayNum} must resolve`);
    console.log(`\n--- Day ${dayNum}: ${d.title} ---`);
    for (let i = 0; i < d.parts.length; i++) {
      const part = d.parts[i];
      const res = await executeBashSuite(part.code!);
      assert.equal(res.allPassed, true, `Day ${dayNum} Part ${i + 1} bash suite failed: ${res.stderr}`);
      console.log(`  Part ${i + 1} (${part.title.slice(0, 35)}...): PASSED (stdout lines: ${res.stdout?.trim().split('\n').length})`);
    }
  }
  console.log('\n>>> ALL 25 PARTS ACROSS DAYS 26-30 EXECUTED IN POSIX RUNNER WITH 100% PASS! <<<');
}

testAll().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
