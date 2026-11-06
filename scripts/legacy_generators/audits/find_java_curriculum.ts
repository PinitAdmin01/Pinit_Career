import fs from 'fs';

function searchFile(path: string, term: string) {
  if (!fs.existsSync(path)) return;
  const content = fs.readFileSync(path, 'utf8');
  let idx = 0;
  while ((idx = content.toLowerCase().indexOf(term.toLowerCase(), idx)) !== -1) {
    console.log(`Found in ${path} at ${idx}:`);
    console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 400)));
    console.log('----------------------------------------------------');
    idx += term.length + 500;
  }
}

searchFile('docs/visuals/PINIT_MASTER_DEBUG.html', 'Course 5');
searchFile('docs/visuals/PINIT_MASTER_DEBUG.html', 'java-basics');
searchFile('docs/PINIT_36_COURSES_DEEP_CURRICULUM_AUDIT.md', 'Course 5');
