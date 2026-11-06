import fs from 'fs';

function findMonth2(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if ((l.toLowerCase().includes('month 2') || l.toLowerCase().includes('day 31')) && 
        (l.toLowerCase().includes('java') || l.toLowerCase().includes('course 1') || l.toLowerCase().includes('spring'))) {
      console.log(`${filePath}:${i+1}: ${l}`);
      for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 15); j++) {
        console.log(`  ${j+1}: ${lines[j]}`);
      }
      console.log('-------------------------------------------');
    }
  }
}

findMonth2('docs/pinitcareer-24month-master-curriculum.md');
findMonth2('docs/PINIT_CAREER_TRAINING_PROJECTS_INTERNSHIPS_PLACEMENT_TREATISE.md');
findMonth2('docs/visuals/PINIT_MASTER_DEBUG.html');
