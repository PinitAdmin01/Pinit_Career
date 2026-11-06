import fs from 'fs';

const content = fs.readFileSync('docs/PINIT_36_COURSES_DEEP_CURRICULUM_AUDIT.md', 'utf8');
const start = content.indexOf('### Course 1: Java Enterprise Core');
const end = content.indexOf('### Course 2: Full-Stack React');
console.log(content.substring(start, end));
