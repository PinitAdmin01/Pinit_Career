const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/university/portfolio/[studentId]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  "institutionName = 'Apex Institute of Technology';",
  "institutionName = undefined;"
);
content = content.replace(
  "cgpa = 9.42;",
  "cgpa = undefined;"
);
content = content.replace(
  "attendancePercentage = 96.5;",
  "attendancePercentage = undefined;"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated portfolio page.tsx: eliminated Apex Institute and fake metrics.');
