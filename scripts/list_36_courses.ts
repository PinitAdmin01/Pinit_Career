import fs from 'fs';

const content = fs.readFileSync('docs/PINIT_36_COURSES_DEEP_CURRICULUM_AUDIT.md', 'utf8');
const lines = content.split('\n');
for (const line of lines) {
  if (line.startsWith('### Course ')) {
    console.log(line);
  }
}
