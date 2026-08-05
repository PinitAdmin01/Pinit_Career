const fs = require('fs');
const content = fs.readFileSync('c:/Users/vinay/Desktop/project/verify-pinit/firebase-deploy/src/app/quests/lesson/page.tsx', 'utf8');

const lines = content.split('\n');
let braceStack = [];
let parenStack = [];

for (let r = 0; r < lines.length; r++) {
  const line = lines[r];
  for (let c = 0; c < line.length; c++) {
    const char = line[c];
    if (char === '{') {
      braceStack.push({ line: r + 1, col: c + 1 });
    } else if (char === '}') {
      braceStack.pop();
    } else if (char === '(') {
      parenStack.push({ line: r + 1, col: c + 1 });
    } else if (char === ')') {
      parenStack.pop();
    }
  }
}
console.log("FINAL STACKS:", { braceStack, parenStack });
