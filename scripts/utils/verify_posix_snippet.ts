import { executeBashSuite } from '../src/lib/code/runners/bashRunner';

async function main() {
  const code = `mkdir -p /home/student/workspace/productivity_sim
echo "METRIC,VALUE,STATUS" > /home/student/workspace/productivity_sim/metrics.csv
echo "GROSS_WPM,90,VERIFIED" >> /home/student/workspace/productivity_sim/metrics.csv
echo "ACCURACY_PCT,98.5,OPTIMAL" >> /home/student/workspace/productivity_sim/metrics.csv
echo "HOME_ROW,ASDF_JKL,TOUCH_TYPING_BENCHMARK_VERIFIED" >> /home/student/workspace/productivity_sim/metrics.csv
cat /home/student/workspace/productivity_sim/metrics.csv
grep "TOUCH_TYPING_BENCHMARK_VERIFIED" /home/student/workspace/productivity_sim/metrics.csv`;

  const res = await executeBashSuite(code);
  console.log("allPassed:", res.allPassed);
  console.log("stdout:\n" + res.stdout);
}

main();
