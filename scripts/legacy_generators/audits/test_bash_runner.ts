import { executeBashSuite } from '../src/lib/code/runners/bashRunner';

async function testBash() {
  const code = `mkdir -p /home/student/workspace/git_pack_d31
echo "PACK_SIGNATURE: PACK" > /home/student/workspace/git_pack_d31/pack_header.txt
echo "VERSION: 2" >> /home/student/workspace/git_pack_d31/pack_header.txt
echo "OBJECTS_COUNT: 25000" >> /home/student/workspace/git_pack_d31/pack_header.txt
cat /home/student/workspace/git_pack_d31/pack_header.txt
grep "OBJECTS_COUNT" /home/student/workspace/git_pack_d31/pack_header.txt`;

  const res = await executeBashSuite(code);
  console.log("Passed:", res.allPassed);
  console.log("Stdout:\n" + res.stdout);
  console.log("Stderr:\n" + res.stderr);
}

testBash();
