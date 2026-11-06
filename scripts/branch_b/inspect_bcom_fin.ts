import { BCOM_FINANCE_LONG_LESSONS } from '../../src/lib/data/bcomFinanceLongLessons';

console.log('Inspecting BCOM_FIN missing code or output in Month 2:');
for (let d = 31; d <= 60; d++) {
  const l = BCOM_FINANCE_LONG_LESSONS.find(x => x.day === d);
  if (!l) continue;
  l.parts.forEach((p: any, idx: number) => {
    const hasCode = !!p.code && p.code.trim().length > 0;
    const hasOutput = !!p.output && p.output.trim().length > 0;
    if (!hasCode || !hasOutput) {
      console.log(`Day ${d} Part ${idx + 1}: code=${hasCode} (len=${p.code?.length}), output=${hasOutput} (len=${p.output?.length})`);
    }
  });
}
